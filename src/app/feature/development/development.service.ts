import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, WritableSignal, computed, inject, signal } from '@angular/core';
import {
	DevCategory,
	DevComment,
	DevDeveloper,
	DevDoc,
	DevPackage,
	DevPlan,
	DevProject,
	DevRoadmap,
	DevVote,
	RequestType,
} from './development.interface';
import { getDb } from './firebase';
import { VisitorAuthService } from './visitor-auth.service';

/**
 * The shared Web Art Work backlog, read live: roadmaps, packages, plans, projects and developers,
 * plus the votes and comments of visitors. The page calls `watch()` and `unwatch()`.
 */
@Injectable({ providedIn: 'root' })
export class DevelopmentService {
	private readonly _platformId = inject(PLATFORM_ID);
	private readonly _auth = inject(VisitorAuthService);
	private _stops: (() => void)[] = [];
	private _users = 0;

	readonly roadmaps = signal<DevRoadmap[]>([]);
	readonly packages = signal<DevPackage[]>([]);
	readonly plans = signal<DevPlan[]>([]);
	readonly projects = signal<DevProject[]>([]);
	readonly developers = signal<DevDeveloper[]>([]);
	readonly votes = signal<DevVote[]>([]);
	readonly comments = signal<DevComment[]>([]);
	readonly loading = signal(true);
	readonly error = signal('');
	readonly actionError = signal('');

	/** Sum of the votes per target. */
	readonly scores = computed(() => {
		const scores = new Map<string, number>();

		for (const vote of this.votes()) {
			scores.set(vote.targetId, (scores.get(vote.targetId) ?? 0) + vote.value);
		}

		return scores;
	});

	/** The visitor's own vote per target. */
	readonly mine = computed(() => {
		const uid = this._auth.user()?.uid;

		return new Map(
			this.votes()
				.filter((vote) => vote.uid === uid)
				.map((vote) => [vote.targetId, vote.value]),
		);
	});

	/** Comments per target, oldest first. */
	readonly commentsByTarget = computed(() => {
		const groups = new Map<string, DevComment[]>();

		for (const comment of [...this.comments()].sort((a, b) => a.createdAt - b.createdAt)) {
			groups.set(comment.targetId, [...(groups.get(comment.targetId) ?? []), comment]);
		}

		return groups;
	});

	constructor() {
		this._auth.registerMigration({
			collect: (uid) => this._takeVotes(uid),
			restore: (votes, uid) => this._giveVotes(votes as DevVote[], uid),
		});
	}

	watch() {
		this._users++;

		if (this._users === 1) {
			void this._start();
		}
	}

	unwatch() {
		this._users = Math.max(0, this._users - 1);

		if (!this._users) {
			this._stops.forEach((stop) => stop());
			this._stops = [];
		}
	}

	/** Voting the same way again takes the vote back; the other way switches it. */
	async vote(targetId: string, value: 1 | -1) {
		this.actionError.set('');

		try {
			const user = await this._auth.ensureUser();
			const [db, fs] = await Promise.all([getDb(), import('firebase/firestore')]);
			const ref = fs.doc(db, 'votes', `${targetId}_${user.uid}`);

			if (this.mine().get(targetId) === value) {
				await fs.deleteDoc(ref);
			} else {
				await fs.setDoc(ref, { targetId, uid: user.uid, value, createdAt: Date.now() });
			}
		} catch {
			this.actionError.set('Could not save your vote. Please try again.');
		}
	}

	async comment(targetId: string, text: string) {
		const user = this._auth.member();
		const body = text.trim().slice(0, 1000);

		if (!user || !body) {
			return false;
		}

		this.actionError.set('');

		try {
			const [db, fs] = await Promise.all([getDb(), import('firebase/firestore')]);

			await fs.addDoc(fs.collection(db, 'comments'), {
				targetId,
				uid: user.uid,
				authorName: user.displayName || 'Visitor',
				text: body,
				createdAt: Date.now(),
			});

			return true;
		} catch {
			this.actionError.set('Could not post your comment. Please try again.');

			return false;
		}
	}

	async deleteComment(id: string) {
		try {
			const [db, fs] = await Promise.all([getDb(), import('firebase/firestore')]);

			await fs.deleteDoc(fs.doc(db, 'comments', id));
		} catch {
			this.actionError.set('Could not delete the comment. Please try again.');
		}
	}

	/** A request for the team: needs a Google sign-in. */
	async request(value: {
		type: RequestType;
		category: DevCategory;
		title: string;
		description: string;
		repo: string;
	}) {
		const user = this._auth.member();

		if (!user) {
			return false;
		}

		try {
			const [db, fs] = await Promise.all([getDb(), import('firebase/firestore')]);

			await fs.addDoc(fs.collection(db, 'requests'), {
				...value,
				status: 'new',
				uid: user.uid,
				authorName: user.displayName || 'Visitor',
				authorEmail: user.email ?? '',
				createdAt: Date.now(),
			});

			return true;
		} catch {
			return false;
		}
	}

	private async _start() {
		if (!isPlatformBrowser(this._platformId)) {
			return;
		}

		this.loading.set(true);
		this.error.set('');

		try {
			const [db, fs] = await Promise.all([getDb(), import('firebase/firestore')]);

			if (!this._users) {
				return;
			}

			const targets: [string, WritableSignal<any[]>][] = [
				['roadmaps', this.roadmaps],
				['packages', this.packages],
				['plans', this.plans],
				['projects', this.projects],
				['developers', this.developers],
				['votes', this.votes],
				['comments', this.comments],
			];
			let pending = targets.length;

			for (const [name, target] of targets) {
				let first = true;

				this._stops.push(
					fs.onSnapshot(
						fs.collection(db, name),
						(snapshot) => {
							target.set(
								snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as DevDoc),
							);

							if (first && !--pending) {
								this.loading.set(false);
							}

							first = false;
						},
						() => {
							this.error.set('Could not load data.');
							this.loading.set(false);
						},
					),
				);
			}
		} catch {
			this.error.set('Could not load data.');
			this.loading.set(false);
		}
	}

	/** Removes the anonymous visitor's votes and hands them back, before the account is replaced. */
	private async _takeVotes(uid: string) {
		const [db, fs] = await Promise.all([getDb(), import('firebase/firestore')]);
		const snapshot = await fs.getDocs(
			fs.query(fs.collection(db, 'votes'), fs.where('uid', '==', uid)),
		);
		const votes = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as DevVote);

		await Promise.all(snapshot.docs.map((doc) => fs.deleteDoc(doc.ref)));

		return votes;
	}

	/** Gives the votes to the account the visitor signed in to, keeping votes it already has. */
	private async _giveVotes(votes: DevVote[], uid: string) {
		const [db, fs] = await Promise.all([getDb(), import('firebase/firestore')]);

		await Promise.all(
			votes.map(async (vote) => {
				const ref = fs.doc(db, 'votes', `${vote.targetId}_${uid}`);

				if (!(await fs.getDoc(ref)).exists()) {
					await fs.setDoc(ref, {
						targetId: vote.targetId,
						uid,
						value: vote.value,
						createdAt: vote.createdAt,
					});
				}
			}),
		);
	}
}
