import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import {
	afterNextRender,
	Component,
	computed,
	DestroyRef,
	effect,
	ElementRef,
	inject,
	signal,
	untracked,
	viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { ThemeService } from '@wawjs/ngx-ui';
import { catalogConstructors, repoUrl } from '../../feature/catalog/catalog.data';
import { companyProfile } from '../../feature/company/company.data';
import { IconComponent } from '../../shared/icon/icon.component';
import { QrCodeComponent } from '../../shared/qr-code/qr-code.component';
import { RoomScanComponent } from '../../shared/room-scan/room-scan.component';
import { TrPipe } from '../../shared/translate/tr.pipe';

const TOTAL_SLIDES = 7;

/** A horizontal swipe shorter than this, in pixels, is treated as a tap or a scroll. */
const SWIPE_MIN = 50;

/** A full-screen slide deck explaining how the framework is built. Arrow keys, space, Home/End, F for fullscreen, swipe on touch. */
@Component({
	imports: [IconComponent, NgTemplateOutlet, QrCodeComponent, RoomScanComponent, TrPipe],
	templateUrl: './pitch.component.html',
	styles: `
		@keyframes slide-in {
			from {
				opacity: 0;
				transform: translateX(calc(var(--direction, 1) * 2.5rem));
			}
		}
		.slide {
			animation: slide-in 320ms ease-out;
		}
		@media (prefers-reduced-motion: reduce) {
			.slide {
				animation: none;
			}
		}
	`,
	host: { '(window:keydown)': 'onKey($event)' },
})
export class PitchComponent {
	private readonly _document = inject(DOCUMENT);
	private readonly _router = inject(Router);
	private readonly _theme = inject(ThemeService);
	private readonly _route = inject(ActivatedRoute);
	private readonly _fragment = toSignal(this._route.fragment, { initialValue: null });
	private readonly _stage = viewChild.required<ElementRef<HTMLElement>>('stage');
	private _touchStart: { x: number; y: number } | null = null;

	protected readonly constructors = catalogConstructors;
	protected readonly telegramUrl = 'https://t.me/itkp3d';
	protected readonly pitchUrl = `${companyProfile.siteUrl}/pitch`;
	protected readonly pitchUrlLabel = this.pitchUrl.replace(/^https?:\/\//, '');
	protected readonly slideNumbers = Array.from({ length: TOTAL_SLIDES }, (_, i) => i);
	protected readonly total = TOTAL_SLIDES;

	protected readonly index = signal(0);
	/** 1 when moving forward, -1 when moving back, so the next slide enters from the matching side. */
	protected readonly direction = signal<1 | -1>(1);
	protected readonly progress = computed(() => ((this.index() + 1) / TOTAL_SLIDES) * 100);

	protected readonly layers = [
		{
			title: 'Packages',
			what: 'The systems every 3D game needs: scenes, assets, editing objects, VR, room scanning.',
			why: 'Written once and fixed once, then shared by every game.',
			ai: 'The agent reads packages.md and picks tested packages instead of writing 3D systems from scratch.',
		},
		{
			title: 'Constructors',
			what: 'A ready base for each camera type: top-down, side view, isometric and more.',
			why: 'The camera decides how a game is built, so each type gets its own starting point.',
			ai: 'The starter’s AGENTS.md tells the agent what to build first for this camera, so it starts from a working base.',
		},
		{
			title: 'Games',
			what: 'A new game starts from a constructor, not from an empty project.',
			why: 'The team writes only what makes the game unique: rules, levels, art.',
			ai: 'The agent writes only rules, levels and art; the packages below stay fixed and cannot be broken.',
		},
	];

	/**
	 * Packages from generic to specific: engine-free data formats, then the Unity systems every game
	 * needs, then device-specific ones. Each column builds on the one before it.
	 */
	protected readonly packageColumns = [
		{
			title: 'Generic',
			text: 'Data formats with no engine: Unity, Unreal, web, AI tools.',
			packages: [
				{
					slug: '3d-scene-schema',
					title: 'Scene schema',
					text: 'Where things are: a scene as plain JSON.',
				},
				{
					slug: '3d-asset-schema',
					title: 'Asset schema',
					text: 'What things are: models, materials, textures.',
				},
				{
					slug: '3d-network-schema',
					title: 'Network schema',
					text: 'What happens between players: sessions, events, results.',
				},
			],
		},
		{
			title: 'Core',
			text: 'Unity systems every 3D game needs.',
			packages: [
				{
					slug: '3d-unity-core',
					title: 'Core',
					text: 'The shared base: settings, events, logging, startup.',
				},
				{
					slug: '3d-unity-scene',
					title: 'Scene',
					text: 'Loads and saves scenes in Unity.',
				},
				{
					slug: '3d-unity-input',
					title: 'Input',
					text: 'One set of actions for mouse, keyboard, touch, gamepad and VR.',
				},
				{
					slug: '3d-unity-character',
					title: 'Character',
					text: 'Walking, running, jumping, slopes. Shared by every constructor.',
				},
				{
					slug: '3d-unity-assets',
					title: 'Assets',
					text: 'Loads models, materials and textures by id.',
				},
				{
					slug: '3d-unity-audio',
					title: 'Audio',
					text: '3D sound, sound events, volume groups, music.',
				},
			],
		},
		{
			// Interaction sits here, not in Core: editing objects is a tool some games need, not all.
			title: 'Specific',
			text: 'Editing tools, devices, platforms and services.',
			packages: [
				{
					slug: '3d-unity-interaction',
					title: 'Interaction',
					text: 'Select, move, rotate and scale objects.',
				},
				{
					slug: '3d-unity-spatial',
					title: 'Spatial',
					text: 'Turns a Meta Quest room scan into a scene.',
				},
				{
					slug: '3d-unity-xr',
					title: 'XR',
					text: 'The VR rig: headset camera, hands and comfort settings.',
				},
				{
					slug: '3d-unity-firebase',
					title: 'Firebase',
					text: 'Sign-in, saved progress and stored scenes in Firebase.',
				},
				{
					slug: '3d-unity-network',
					title: 'Network',
					text: 'Real-time multiplayer: the server decides, players stay in sync.',
				},
			],
		},
	];

	/** The constructor explained on slide 5, on the same grid as the packages slide. */
	protected readonly example = catalogConstructors.find(
		(item) => item.slug === 'character-view',
	)!;

	/**
	 * The example constructor's own packages: what it adds on top of the shared ones. Movement lives
	 * in `3d-unity-character`; the constructor only decides how input and the camera drive it.
	 */
	private readonly _exampleConstructor = {
		title: 'Constructor',
		text: '3d-constructor-character-view',
		packages: [
			{
				slug: '3d-constructor-character-view-camera',
				title: 'Camera',
				text: 'First- and third-person camera.',
			},
			{
				slug: '3d-constructor-character-view-controls',
				title: 'Controls',
				text: 'Moves where the camera looks; looking turns the character.',
			},
			{
				slug: '3d-constructor-vr-controls',
				title: 'VR controls',
				text: 'The same for a headset: walk where you look, aim with the hand.',
			},
			{
				slug: '3d-constructor-character-view-template',
				title: 'Template',
				text: 'Ready project structure and package list.',
			},
		],
	};

	/**
	 * The sample game, Temnorid Arena, as built today (v0.1): a free-for-all deathmatch against bots
	 * with spells instead of guns; rounds, teams and an economy come next. Split the way a player meets it: the interface around a match, then the gameplay itself.
	 * Arenas are levels, so they get a package of their own, stored as Scene JSON.
	 */
	private readonly _exampleGame = {
		title: 'The game',
		text: 'The only part the team writes.',
		packages: [
			{
				group: 'Interface',
				slug: 'temnorid-arena-menus',
				title: 'Menus',
				text: 'Main menu, pause, settings, sign-in and match stats.',
			},
			{
				group: 'Interface',
				slug: 'temnorid-arena-hud',
				title: 'HUD',
				text: 'Health, mana, spell bar, kill feed, scoreboard. Touch and VR layouts.',
			},
			{
				group: 'Gameplay',
				slug: 'temnorid-arena-core',
				title: 'Core',
				text: 'Combatants, bots, respawns and the match scoreboard.',
			},
			{
				group: 'Gameplay',
				slug: 'temnorid-arena-spells',
				title: 'Spells',
				text: 'Fireball, frost nova, shield, blink. The server checks every cast.',
			},
			{
				group: 'Gameplay',
				slug: 'temnorid-arena-maps',
				title: 'Maps',
				text: 'The first arena as Scene JSON, with props and spawn points.',
			},
		],
	};

	protected readonly exampleColumns = [
		...this.packageColumns,
		this._exampleConstructor,
		this._exampleGame,
	];

	/**
	 * Packages the sample game uses. It needs no object editing or room scans, so those fade; XR runs
	 * the Quest build, Firebase keeps accounts and match stats, the network runs the match.
	 */
	protected readonly exampleUses = new Set([
		'3d-scene-schema',
		'3d-asset-schema',
		'3d-network-schema',
		'3d-unity-core',
		'3d-unity-scene',
		'3d-unity-input',
		'3d-unity-character',
		'3d-unity-assets',
		'3d-unity-audio',
		'3d-unity-xr',
		'3d-unity-firebase',
		'3d-unity-network',
		...this._exampleConstructor.packages.map((item) => item.slug),
		...this._exampleGame.packages.map((item) => item.slug),
	]);

	/**
	 * One project, four kinds of device. `state` says honestly how far each one is: the Quest build
	 * has only run with a simulated headset so far, and the iOS project is built on a Mac.
	 */
	protected readonly devices = [
		{
			name: 'Windows',
			input: 'Keyboard and mouse, or a gamepad.',
			state: 'Playable',
		},
		{
			name: 'Android phones',
			input: 'Touch: a move stick, drag to look, spell buttons.',
			state: 'Builds an APK',
		},
		{
			name: 'iPhone and iPad',
			input: 'The same touch controls.',
			state: 'Xcode project set up',
		},
		{
			name: 'Meta Quest 3',
			input: 'Controllers: stick to walk, trigger to cast along the hand.',
			state: 'Works in the simulator, headset next',
		},
	];

	/** Why one game can run everywhere: every device ends up as the same character command. */
	protected readonly deviceFlow = [
		{
			title: 'Input',
			packages: '3d-unity-input, 3d-unity-xr',
			text: 'Mouse, touch, gamepad or VR controllers become the same actions.',
		},
		{
			title: 'Command',
			packages: '3d-constructor-*-controls',
			text: 'The controls of the constructor turn actions into one character command.',
		},
		{
			title: 'Character and network',
			packages: '3d-unity-character, 3d-unity-network',
			text: 'The character moves; the server only sees commands, so all devices share one match.',
		},
	];

	protected readonly conclusions = [
		{
			title: 'Write once',
			text: 'Every game shares the same tested packages instead of rebuilding them.',
		},
		{
			title: 'Start fast',
			text: 'A new game starts from a constructor that matches its camera.',
		},
		{
			title: 'Focus on the game',
			text: 'Teams spend their time on rules, levels and art.',
		},
	];

	constructor() {
		// The deck is a fixed full-screen layer with its own scroll; without this the page behind it
		// (topbar, footer) scrolls too, and a phone shows two scrollbars. Browser only, so prerender is untouched.
		const destroyRef = inject(DestroyRef);

		afterNextRender(() => {
			const root = this._document.documentElement;
			const previous = root.style.overflow;

			root.style.overflow = 'hidden';
			destroyRef.onDestroy(() => (root.style.overflow = previous));

			// The slides are shown on a projector, so they are always light. Only the `data-mode` attribute
			// is forced; the visitor's saved choice stays untouched and comes back when they leave.
			const forceLight = () => {
				if (root.getAttribute('data-mode') !== 'light') {
					root.setAttribute('data-mode', 'light');
				}
			};
			const watcher = new MutationObserver(forceLight);

			forceLight();
			watcher.observe(root, { attributes: true, attributeFilter: ['data-mode'] });
			destroyRef.onDestroy(() => {
				watcher.disconnect();
				root.setAttribute('data-mode', this._theme.mode() ?? 'dark');
			});
		});

		// The slide number lives in the URL fragment (#3), so reload and shared links keep the place.
		// Applied in an effect, not at construction, so the prerendered first slide still hydrates.
		effect(() => {
			const value = Number.parseInt(this._fragment() ?? '', 10);

			if (Number.isFinite(value)) {
				const next = Math.min(TOTAL_SLIDES - 1, Math.max(0, value - 1));

				untracked(() => this.index.set(next));
			}
		});
	}

	/** The starter repository a game of this style is cloned from, e.g. for `git clone <url> <game>`. */
	protected cloneUrl(repo: string) {
		return repoUrl(repo);
	}

	/** `3d-unity-core` becomes `core`, so constructor rows stay short. */
	protected short(slug: string) {
		return slug.replace('3d-unity-', '');
	}

	protected go(delta: number) {
		this.goTo(this.index() + delta);
	}

	protected goTo(value: number) {
		const next = Math.min(TOTAL_SLIDES - 1, Math.max(0, value));

		if (next === this.index()) {
			return;
		}

		this.direction.set(next > this.index() ? 1 : -1);
		this.index.set(next);
		// A long slide may have been scrolled on a phone; the next one starts at its top.
		this._stage().nativeElement.scrollTop = 0;
		this._syncHash();
	}

	protected onTouchStart(event: TouchEvent) {
		const touch = event.touches[0];

		// Code blocks scroll sideways on narrow screens, so a swipe there must not change the slide.
		const insideScroller = (event.target as Element | null)?.closest('pre');

		this._touchStart =
			event.touches.length === 1 && !insideScroller
				? { x: touch.clientX, y: touch.clientY }
				: null;
	}

	protected onTouchEnd(event: TouchEvent) {
		const start = this._touchStart;
		const touch = event.changedTouches[0];

		this._touchStart = null;

		if (!start || !touch) {
			return;
		}

		const dx = touch.clientX - start.x;
		const dy = touch.clientY - start.y;

		// Mostly horizontal, so a vertical scroll through a long slide never flips it.
		if (Math.abs(dx) >= SWIPE_MIN && Math.abs(dx) > Math.abs(dy) * 1.5) {
			this.go(dx < 0 ? 1 : -1);
		}
	}

	protected onKey(event: KeyboardEvent) {
		if (event.metaKey || event.ctrlKey || event.altKey) {
			return;
		}

		switch (event.key) {
			case 'ArrowRight':
			case 'ArrowDown':
			case 'PageDown':
			case ' ':
				event.preventDefault();
				this.go(1);
				break;
			case 'ArrowLeft':
			case 'ArrowUp':
			case 'PageUp':
				event.preventDefault();
				this.go(-1);
				break;
			case 'Home':
				event.preventDefault();
				this.goTo(0);
				break;
			case 'End':
				event.preventDefault();
				this.goTo(TOTAL_SLIDES - 1);
				break;
			case 'f':
			case 'F':
				this._toggleFullscreen();
				break;
		}
	}

	private _syncHash() {
		void this._router.navigate([], {
			relativeTo: this._route,
			fragment: String(this.index() + 1),
			replaceUrl: true,
		});
	}

	private _toggleFullscreen() {
		if (this._document.fullscreenElement) {
			void this._document.exitFullscreen();
		} else {
			void this._document.documentElement.requestFullscreen?.();
		}
	}
}
