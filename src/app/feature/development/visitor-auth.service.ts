import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import type { Auth, User } from 'firebase/auth';
import { getFirebaseApp } from './firebase';

/**
 * Carries data of an anonymous visitor over when they sign in to a Google account that already
 * exists, which makes Firebase switch to that account instead of upgrading the anonymous one.
 */
export interface AccountMigration {
	/** Runs while still signed in as the anonymous visitor; whatever it returns goes to `restore`. */
	collect: (anonymousUid: string) => Promise<unknown>;
	/** Runs once signed in as the existing account. */
	restore: (collected: unknown, uid: string) => Promise<void>;
}

/**
 * Visitors vote anonymously and comment after signing in with Google. Signing in later upgrades the
 * anonymous account, so the votes stay with the visitor.
 */
@Injectable({ providedIn: 'root' })
export class VisitorAuthService {
	private readonly _platformId = inject(PLATFORM_ID);
	private readonly _migrations: AccountMigration[] = [];
	private _auth?: Auth;
	private _resolveReady!: () => void;
	private readonly _ready = new Promise<void>((resolve) => (this._resolveReady = resolve));
	/** Bumped when the user changes in place (an anonymous account upgraded to Google). */
	private readonly _upgrades = signal(0);

	readonly user = signal<User | null>(null);
	/** The signed-in user unless they are an anonymous visitor. */
	readonly member = computed(() => {
		this._upgrades();
		const user = this.user();

		return user && !user.isAnonymous ? user : null;
	});
	readonly error = signal('');
	readonly busy = signal(false);

	constructor() {
		if (isPlatformBrowser(this._platformId)) {
			void this._start();
		}
	}

	whenReady() {
		return this._ready;
	}

	registerMigration(migration: AccountMigration) {
		this._migrations.push(migration);
	}

	/** Gives a visitor an anonymous account when they vote, without asking for anything. */
	async ensureUser() {
		await this._ready;

		if (!this._auth!.currentUser) {
			const { signInAnonymously } = await import('firebase/auth');

			await signInAnonymously(this._auth!);
		}

		return this._auth!.currentUser!;
	}

	async signInWithGoogle() {
		this.error.set('');
		this.busy.set(true);

		try {
			await this._ready;
			const { GoogleAuthProvider, linkWithPopup, signInWithCredential, signInWithPopup } =
				await import('firebase/auth');
			const provider = new GoogleAuthProvider();
			const current = this._auth!.currentUser;

			if (!current?.isAnonymous) {
				await signInWithPopup(this._auth!, provider);

				return true;
			}

			try {
				// Keeps the anonymous account's uid, so its votes stay where they are.
				await linkWithPopup(current, provider);
				this._upgrades.update((count) => count + 1);
			} catch (error) {
				const credential = GoogleAuthProvider.credentialFromError(
					error as Parameters<typeof GoogleAuthProvider.credentialFromError>[0],
				);

				if ((error as { code?: string }).code !== 'auth/credential-already-in-use' || !credential) {
					throw error;
				}

				const collected = await Promise.all(
					this._migrations.map((migration) => migration.collect(current.uid)),
				);
				const { user } = await signInWithCredential(this._auth!, credential);

				await Promise.all(
					this._migrations.map((migration, index) => migration.restore(collected[index], user.uid)),
				);
			}

			return true;
		} catch (error) {
			const code = (error as { code?: string }).code;

			if (code !== 'auth/popup-closed-by-user' && code !== 'auth/cancelled-popup-request') {
				this.error.set('Sign in failed. Please try again.');
			}

			return false;
		} finally {
			this.busy.set(false);
		}
	}

	private async _start() {
		const [app, { getAuth, onAuthStateChanged }] = await Promise.all([
			getFirebaseApp(),
			import('firebase/auth'),
		]);

		this._auth = getAuth(app);

		onAuthStateChanged(this._auth, (user) => {
			this.user.set(user);
			this._resolveReady();
		});
	}
}
