import { DOCUMENT } from '@angular/common';
import {
	Component,
	computed,
	effect,
	ElementRef,
	inject,
	signal,
	untracked,
	viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { catalogConstructors, GITHUB_ORG_URL } from '../../feature/catalog/catalog.data';
import { companyProfile } from '../../feature/company/company.data';
import { IconComponent } from '../../shared/icon/icon.component';
import { QrCodeComponent } from '../../shared/qr-code/qr-code.component';
import { RoomScanComponent } from '../../shared/room-scan/room-scan.component';
import { TrPipe } from '../../shared/translate/tr.pipe';

const TOTAL_SLIDES = 6;

/** A horizontal swipe shorter than this, in pixels, is treated as a tap or a scroll. */
const SWIPE_MIN = 50;

/** A full-screen slide deck explaining how the framework is built. Arrow keys, space, Home/End, F for fullscreen, swipe on touch. */
@Component({
	imports: [IconComponent, QrCodeComponent, RoomScanComponent, TrPipe],
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
	private readonly _route = inject(ActivatedRoute);
	private readonly _fragment = toSignal(this._route.fragment, { initialValue: null });
	private readonly _stage = viewChild.required<ElementRef<HTMLElement>>('stage');
	private _touchStart: { x: number; y: number } | null = null;

	protected readonly constructors = catalogConstructors;
	protected readonly orgUrl = GITHUB_ORG_URL;
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
			phase: 'Phase 1',
			title: 'Packages',
			what: 'The systems every 3D game needs: scenes, assets, editing objects, VR, room scanning.',
			why: 'Written once and fixed once, then shared by every game.',
		},
		{
			phase: 'Phase 2',
			title: 'Constructors',
			what: 'A ready base for each camera type: top-down, side view, isometric and more.',
			why: 'The camera decides how a game is built, so each type gets its own starting point.',
		},
		{
			phase: 'Phase 3',
			title: 'Games',
			what: 'A new game starts from a constructor, not from an empty project.',
			why: 'The team writes only what makes the game unique: rules, levels, art.',
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
					slug: '3d-unity-interaction',
					title: 'Interaction',
					text: 'Select, move, rotate and scale objects.',
				},
				{
					slug: '3d-unity-assets',
					title: 'Assets',
					text: 'Loads models, materials and textures by id.',
				},
			],
		},
		{
			title: 'Specific',
			text: 'Devices, platforms and services.',
			packages: [
				{
					slug: '3d-unity-spatial',
					title: 'Spatial',
					text: 'Turns a Meta Quest room scan into a scene.',
				},
				{
					slug: '3d-unity-xr',
					title: 'XR',
					text: 'Meta Quest controllers and an in-VR display.',
				},
				{
					slug: '3d-web-viewer',
					title: 'Web viewer',
					text: 'Opens Scene JSON in the browser, no Unity needed.',
				},
				{
					slug: '3d-unity-firebase',
					title: 'Firebase',
					text: 'Sign-in, saved progress and stored scenes in Firebase.',
				},
			],
		},
	];

	/** A top-down game as the example: what it gets from each layer, and what is left to write. */
	protected readonly gameColumns = [
		{
			title: 'From the packages',
			text: 'What every game gets for free.',
			items: [
				'Levels saved and loaded as Scene JSON',
				'Input from mouse, keyboard, touch or gamepad',
				'Selecting and moving objects',
				'Models and textures loaded by id',
			],
		},
		{
			title: 'From the constructor',
			text: 'What this type of game gets, here a top-down one.',
			items: [
				'Camera that looks from above',
				'Player movement made for that camera',
				'Ready project structure',
			],
		},
		{
			title: 'The team writes',
			text: 'Only what makes this game unique.',
			items: ['Rules and game state', 'Levels and characters', 'Art, music and story'],
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
