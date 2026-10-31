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

const TOTAL_SLIDES = 7;

/** A horizontal swipe shorter than this, in pixels, is treated as a tap or a scroll. */
const SWIPE_MIN = 50;

/** A full-screen slide deck explaining how the framework is built. Arrow keys, space, Home/End, F for fullscreen, swipe on touch. */
@Component({
	imports: [IconComponent, NgTemplateOutlet, QrCodeComponent, RoomScanComponent],
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

	/** Ukrainian names for the catalog constructors; the catalog itself stays in English. */
	private static readonly _constructorNames: Record<string, string> = {
		'character-view': 'Вид від персонажа',
		'top-down': 'Вид зверху',
		isometric: 'Ізометрія',
		'side-view': 'Вид збоку',
		'fixed-view': 'Фіксована камера',
		'free-view': 'Камера «бога» / вільна камера',
	};

	protected readonly constructors = catalogConstructors.map((item) => ({
		...item,
		name: PitchComponent._constructorNames[item.slug] ?? item.name,
	}));
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
			title: 'Пакети',
			what: "Системи, потрібні кожній 3D-грі: сцени, ресурси, редагування об'єктів, VR, сканування кімнати.",
			why: 'Пишемо й виправляємо один раз, а користуються всі ігри.',
			ai: 'Агент читає packages.md і обирає перевірені пакети замість того, щоб писати 3D-системи з нуля.',
		},
		{
			title: 'Конструктори',
			what: 'Готова основа для кожного типу камери: вид зверху, вид збоку, ізометрія та інші.',
			why: 'Камера визначає, як побудована гра, тому кожен тип отримує власну стартову точку.',
			ai: 'AGENTS.md стартера підказує агенту, що будувати першим для цієї камери, тож він починає з робочої основи.',
		},
		{
			title: 'Ігри',
			what: 'Нова гра починається з конструктора, а не з порожнього проєкту.',
			why: 'Команда пише лише те, що робить гру унікальною: правила, рівні, графіку.',
			ai: 'Агент пише лише правила, рівні та графіку; пакети нижче лишаються незмінними й не можуть зламатися.',
		},
	];

	/**
	 * Packages from generic to specific: engine-free data formats, then the Unity systems every game
	 * needs, then device-specific ones. Each column builds on the one before it.
	 */
	protected readonly packageColumns = [
		{
			title: 'Загальні',
			text: 'Формати даних без рушія: Unity, Unreal, веб, AI-інструменти.',
			packages: [
				{
					slug: '3d-scene-schema',
					title: 'Схема сцени',
					text: 'Де що стоїть: сцена як простий JSON.',
				},
				{
					slug: '3d-asset-schema',
					title: 'Схема ресурсів',
					text: "Що це за об'єкти: моделі, матеріали, текстури.",
				},
				{
					slug: '3d-network-schema',
					title: 'Мережева схема',
					text: 'Що відбувається між гравцями: сесії, події, результати.',
				},
			],
		},
		{
			title: 'Ядро',
			text: 'Системи Unity, потрібні кожній 3D-грі.',
			packages: [
				{
					slug: '3d-unity-scene',
					title: 'Сцена',
					text: 'Завантажує та зберігає сцени в Unity.',
				},
				{
					slug: '3d-unity-input',
					title: 'Ввід',
					text: 'Єдині дії для миші, клавіатури, дотику, геймпада та VR.',
				},
				{
					slug: '3d-unity-character',
					title: 'Персонаж',
					text: 'Ходьба, біг, стрибки, схили. Спільний для всіх конструкторів.',
				},
				{
					slug: '3d-unity-assets',
					title: 'Ресурси',
					text: 'Завантажує моделі, матеріали й текстури за id.',
				},
				{
					slug: '3d-unity-audio',
					title: 'Звук',
					text: 'Просторовий звук, звукові події, групи гучності, музика.',
				},
			],
		},
		{
			// Interaction sits here, not in Core: editing objects is a tool some games need, not all.
			title: 'Спеціалізовані',
			text: 'Інструменти редагування, пристрої, платформи та сервіси.',
			packages: [
				{
					slug: '3d-unity-interaction',
					title: 'Взаємодія',
					text: "Вибір, переміщення, обертання й масштабування об'єктів.",
				},
				{
					slug: '3d-unity-spatial',
					title: 'Простір',
					text: 'Перетворює скан кімнати з Meta Quest на сцену.',
				},
				{
					slug: '3d-unity-xr',
					title: 'XR',
					text: 'VR-риг: камера шолома, руки та налаштування комфорту.',
				},
				{
					slug: '3d-unity-firebase',
					title: 'Firebase',
					text: 'Вхід, збереження прогресу та сцен у Firebase.',
				},
				{
					slug: '3d-unity-network',
					title: 'Мережа',
					text: 'Мультиплеєр у реальному часі: рішення ухвалює сервер, гравці синхронізовані.',
				},
			],
		},
	];

	/** The constructor explained on slide 5, on the same grid as the packages slide. */
	protected readonly example = this.constructors.find((item) => item.slug === 'character-view')!;

	/**
	 * The example constructor's own packages: what it adds on top of the shared ones. Movement lives
	 * in `3d-unity-character`; the constructor only decides how input and the camera drive it.
	 */
	private readonly _exampleConstructor = {
		title: 'Конструктор',
		text: '3d-constructor-character-view',
		packages: [
			{
				slug: '3d-constructor-character-view-camera',
				title: 'Камера',
				text: 'Камера від першої та третьої особи.',
			},
			{
				slug: '3d-constructor-character-view-controls',
				title: 'Керування',
				text: 'Рух туди, куди дивиться камера; погляд повертає персонажа.',
			},
			{
				slug: '3d-constructor-vr-controls',
				title: 'VR-керування',
				text: 'Те саме для шолома: йдіть туди, куди дивитесь, цільтесь рукою.',
			},
			{
				slug: '3d-constructor-character-view-template',
				title: 'Шаблон',
				text: 'Готова структура проєкту та список пакетів.',
			},
		],
	};

	/**
	 * Two sample games on the same engine. This slide shows the logic, not a package list: almost
	 * everything a game needs (skills, interface, levels) is a package both games reuse, drawn as
	 * boxes across both columns. Only the game mode is each game's own, and it is named for what it does, so other games can reuse it.
	 */
	private readonly _exampleGames = {
		title: 'Ігри',
		shared: [
			{
				slug: '3d-unity-combat',
				title: 'Бій',
				text: 'Здоров’я, команди, снаряди та ближні атаки. Правила бою задає гра.',
			},
			{
				slug: '3d-unity-ai',
				title: 'Боти',
				text: 'Пошук цілі, переслідування, атака та патрулювання.',
			},
			{
				slug: '3d-unity-ui',
				title: 'Інтерфейс',
				text: 'Екрани на uGUI, створені в коді та розміщені за якорями.',
			},
			{
				slug: '3d-unity-shell',
				title: 'Оболонка',
				text: 'Спільні меню, вхід, лобі та панелі гри.',
			},
			{
				slug: '3d-unity-graybox',
				title: 'Прототип',
				text: 'Примітиви зі стабільними id ресурсів і засоби побудови першої ігрової сцени.',
			},
		],
		games: [
			{
				title: 'Arena',
				packages: [
					{
						slug: 'match rules (project code)',
						title: 'Дезматч',
						text: 'Бій проти ботів: хто кого переміг і коли матч завершено.',
					},
				],
			},
			{
				title: 'Farm',
				packages: [
					{
						slug: 'farming rules (project code)',
						title: 'Фермерство',
						text: 'Посів, догляд і врожай: як росте ферма та що вважається успіхом.',
					},
				],
			},
		],
	};

	protected readonly exampleColumns = [
		...this.packageColumns,
		this._exampleConstructor,
		this._exampleGames,
	];

	/**
	 * Packages the sample games use. It needs no object editing or room scans, so those fade; XR runs
	 * the Quest build, Firebase keeps accounts and match stats, the network runs the match.
	 */
	protected readonly exampleUses = new Set([
		'3d-scene-schema',
		'3d-asset-schema',
		'3d-network-schema',
		'3d-unity-scene',
		'3d-unity-input',
		'3d-unity-character',
		'3d-unity-assets',
		'3d-unity-audio',
		'3d-unity-xr',
		'3d-unity-firebase',
		'3d-unity-network',
		...this._exampleConstructor.packages.map((item) => item.slug),
		...this._exampleGames.shared.map((item) => item.slug),
		...this._exampleGames.games.flatMap((game) => game.packages.map((item) => item.slug)),
	]);

	/** Package capabilities are separate from a verified platform build. */
	protected readonly devices = [
		{
			name: 'Windows',
			input: 'Клавіатура й миша або геймпад.',
			state: 'Ввід із клавіатури та геймпада у пакетах',
		},
		{
			name: 'Телефони на Android',
			input: 'Дотик: стік руху, перетягування для огляду, кнопки заклять.',
			state: 'Сенсорний ввід у пакетах',
		},
		{
			name: 'iPhone та iPad',
			input: 'Те саме сенсорне керування.',
			state: 'Збірку та пристрої перевіряють окремо',
		},
		{
			name: 'Meta Quest 3',
			input: 'Контролери: стік для ходьби, тригер для закляття вздовж руки.',
			state: 'Окреме XR-налаштування та перевірка на шоломі',
		},
	];

	/** Why one game can run everywhere: every device ends up as the same character command. */
	protected readonly deviceFlow = [
		{
			title: 'Ввід',
			packages: '3d-unity-input, 3d-unity-xr',
			text: 'Миша, дотик, геймпад або VR-контролери стають тими самими діями.',
		},
		{
			title: 'Команда',
			packages: '3d-constructor-*-controls',
			text: 'Керування конструктора перетворює дії на одну команду персонажа.',
		},
		{
			title: 'Персонаж і мережа',
			packages: '3d-unity-character, 3d-unity-network',
			text: 'Персонаж рухається; сервер бачить лише команди, тож усі пристрої грають в одному матчі.',
		},
	];

	protected readonly conclusions = [
		{
			title: 'Пишемо один раз',
			text: 'Усі ігри використовують ті самі перевірені пакети, а не пишуть їх заново.',
		},
		{
			title: 'Швидкий старт',
			text: 'Нова гра стартує з конструктора під її камеру.',
		},
		{
			title: 'Фокус на грі',
			text: 'Команди витрачають час на правила, рівні та графіку.',
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
