import { DOCUMENT } from '@angular/common';
import { Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import {
	catalogConstructors,
	catalogPackages,
	GITHUB_ORG_URL,
	repoUrl,
} from '../../feature/catalog/catalog.data';
import { CodeBlockComponent } from '../../shared/code-block/code-block.component';
import { IconComponent } from '../../shared/icon/icon.component';
import { RoomScanComponent } from '../../shared/room-scan/room-scan.component';
import { TrPipe } from '../../shared/translate/tr.pipe';

const TOTAL_SLIDES = 13;

/** A full-screen slide deck explaining how the framework is built. Arrow keys, space, Home/End, F for fullscreen. */
@Component({
	imports: [IconComponent, CodeBlockComponent, RoomScanComponent, TrPipe],
	templateUrl: './pitch.component.html',
	styles: `
		@keyframes slide-in {
			from {
				opacity: 0;
				transform: translateY(0.75rem);
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

	protected readonly packages = catalogPackages;
	protected readonly constructors = catalogConstructors;
	protected readonly orgUrl = GITHUB_ORG_URL;
	protected readonly coreUrl = `${repoUrl('3d-unity-core')}.git`;
	protected readonly slideNumbers = Array.from({ length: TOTAL_SLIDES }, (_, i) => i);
	protected readonly total = TOTAL_SLIDES;

	protected readonly index = signal(0);
	protected readonly progress = computed(() => ((this.index() + 1) / TOTAL_SLIDES) * 100);

	/** Packages that every constructor includes: the shared base the constructors stand on. */
	protected readonly sharedPackages = catalogPackages
		.map((item) => item.slug)
		.filter((slug) => catalogConstructors.every((item) => item.packages.includes(slug)));

	protected readonly painPoints = [
		'Loading and saving scenes',
		'Loading and caching assets',
		'Selecting and moving objects',
		'XR controllers and input',
		'Understanding the physical room',
	];

	protected readonly packageRules = [
		{
			title: 'One responsibility each',
			text: 'Small enough to reuse, large enough to own a clear job.',
		},
		{
			title: 'Dependencies point one way',
			text: 'A package only knows about the packages below it.',
		},
		{
			title: 'No game code inside',
			text: 'Nothing specific to a product, a racing game, or VRoom.',
		},
		{
			title: 'Install only what you use',
			text: 'Each package is its own Unity Package Manager dependency.',
		},
	];

	protected readonly dependencyTree = `3d-unity-spatial
└─ 3d-unity-scene
   ├─ 3d-unity-core
   └─ 3d-scene-schema`;

	protected readonly coreBenefits = [
		{
			title: 'One lifecycle',
			text: 'Every package starts, runs, and shuts down the same way.',
		},
		{
			title: 'One way to talk',
			text: 'Shared events, services, and logging instead of ad-hoc wiring.',
		},
		{
			title: 'Fix once',
			text: 'A bug fixed in core is fixed in every constructor and every game.',
		},
		{
			title: 'Fast new packages',
			text: 'A new package or constructor starts on working infrastructure.',
		},
	];

	protected readonly coreContents = [
		'Configuration',
		'Services',
		'Lifecycle',
		'Events',
		'Logging',
		'Error handling',
	];

	protected readonly placement = [
		{
			question: 'Does every 3D app need it?',
			answer: 'Core package',
			where: '3d-*',
		},
		{
			question: 'Does every game with this camera need it?',
			answer: 'Constructor',
			where: '3d-constructor-*',
		},
		{
			question: 'Does only this game need it?',
			answer: 'Game package',
			where: 'game-<name>-*',
		},
	];

	protected readonly gameTree = `game-<name>/
├─ game-<name>-core     rules, state, configuration
├─ game-<name>-world    levels stored as Scene JSON
├─ game-<name>-units    characters, enemies, items
├─ game-<name>-ui       HUD and menus
└─ Packages/manifest.json
   └─ 3d-constructor-<camera>
      └─ 3d-unity-core, scene, assets, interaction`;

	protected readonly constructorProvides = [
		'Camera and movement for its game type',
		'Scene loading and saving',
		'Selecting and editing objects',
	];

	protected readonly youWrite = [
		'Rules and game state',
		'Levels, units, and items',
		'Art and audio',
	];

	protected readonly newGameSteps = [
		{ title: 'Pick the constructor', text: 'Choose the one that matches your camera.' },
		{ title: 'Create the project', text: 'Start from its structure and package manifest.' },
		{ title: 'Describe the world', text: 'Levels are Scene JSON, not hand-built Unity scenes.' },
		{ title: 'Reference assets by id', text: 'The asset layer loads and caches them.' },
		{ title: 'Write only your rules', text: 'Everything unique to your game, nothing else.' },
	];

	protected readonly scanSteps = [
		{ package: 'Meta Quest', does: 'scans the room' },
		{ package: '3d-unity-spatial', does: 'turns it into SceneData' },
		{ package: '3d-unity-scene', does: 'saves it as Scene JSON' },
		{ package: 'Your backend', does: 'stores and indexes the scene' },
	];

	protected readonly roadmap = [
		{
			phase: 'Website and documentation',
			text: 'Catalog, architecture, installation, and examples.',
			state: 'Done',
		},
		{
			phase: 'Core packages',
			text: 'Finish assets and interaction, grow scene, spatial, and XR.',
			state: 'In progress',
		},
		{
			phase: 'Constructors',
			text: 'The first constructor on core, scene, assets, and interaction.',
			state: 'Next',
		},
		{
			phase: 'Game generation',
			text: 'Generated project structure, CLI and agent-assisted creation.',
			state: 'Later',
		},
		{
			phase: 'Ecosystem',
			text: 'Community packages, constructor templates, more engines.',
			state: 'Later',
		},
	];

	/** An excerpt of a real object from the 3d-scene-schema v1 room-scan example. */
	protected readonly schemaExcerpt = `{
  "id": "anchor_door_entry",
  "type": "DOOR_FRAME",
  "parentId": "anchor_wall_north",
  "transform": {
    "position": { "x": 1.5, "y": 0, "z": -3.0 }
  },
  "boundary": [ … ]
}`;

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

	protected isShared(slug: string) {
		return this.sharedPackages.includes(slug);
	}

	protected go(delta: number) {
		this.index.update((value) => Math.min(TOTAL_SLIDES - 1, Math.max(0, value + delta)));
		this._syncHash();
	}

	protected goTo(value: number) {
		this.index.set(Math.min(TOTAL_SLIDES - 1, Math.max(0, value)));
		this._syncHash();
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
