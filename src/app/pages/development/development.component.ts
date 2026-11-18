import { Component, DestroyRef, computed, inject, signal, viewChild } from '@angular/core';
import { VISIBLE_CATEGORIES } from '../../feature/development/development.config';
import {
	DEV_CATEGORIES,
	DevCategory,
	DevRoadmap,
	weekLabel,
} from '../../feature/development/development.interface';
import { DevelopmentService } from '../../feature/development/development.service';
import { TrPipe } from '../../shared/translate/tr.pipe';
import { FeedbackComponent } from './feedback/feedback.component';
import { RequestConfig, RequestDialogComponent } from './request-dialog/request-dialog.component';
import { RoadmapDialogComponent } from './roadmap-dialog/roadmap-dialog.component';

/**
 * Public development: the roadmaps, packages and weekly plan of the shared Web Art Work backlog,
 * limited to the categories of this site (see `VISIBLE_CATEGORIES`).
 */
@Component({
	imports: [TrPipe, FeedbackComponent, RoadmapDialogComponent, RequestDialogComponent],
	templateUrl: './development.component.html',
})
export class DevelopmentComponent {
	private readonly _roadmapDialog = viewChild.required(RoadmapDialogComponent);
	private readonly _requestDialog = viewChild.required(RequestDialogComponent);

	protected readonly data = inject(DevelopmentService);
	protected readonly categories = DEV_CATEGORIES.filter((category) =>
		VISIBLE_CATEGORIES.includes(category.value),
	);
	/** One category means there is nothing to filter. */
	protected readonly filterable = this.categories.length > 1;
	protected readonly enabled = signal<DevCategory[]>([...VISIBLE_CATEGORIES]);

	private readonly _packageList = computed(
		() => new Map(this.data.packages().map((item) => [item.id, item])),
	);
	private readonly _roadmapList = computed(
		() => new Map(this.data.roadmaps().map((item) => [item.id, item])),
	);

	protected readonly packages = computed(() =>
		this.data
			.packages()
			.filter((item) => this.enabled().includes(item.category))
			.sort((a, b) => a.name.localeCompare(b.name)),
	);

	/** Not done yet, with an enabled category, the most liked first. */
	protected readonly roadmaps = computed(() => {
		const scores = this.data.scores();

		return this.data
			.roadmaps()
			.filter((item) => item.status !== 'done')
			.filter((item) => (item.categories ?? []).some((key) => this.enabled().includes(key)))
			.sort(
				(a, b) =>
					(scores.get(b.id) ?? 0) - (scores.get(a.id) ?? 0) || b.createdAt - a.createdAt,
			);
	});

	/** The newest plan, reduced to the packages and roadmaps of the enabled categories. */
	protected readonly plan = computed(() => {
		const [latest] = [...this.data.plans()].sort(
			(a, b) => b.week.localeCompare(a.week) || b.createdAt - a.createdAt,
		);

		if (!latest) {
			return undefined;
		}

		const enabled = this.enabled();

		return {
			...latest,
			label: weekLabel(latest.week),
			packageEntries: (latest.packages ?? [])
				.map((entry) => ({ text: entry.text, item: this._packageList().get(entry.id) }))
				.filter((entry) => entry.item && enabled.includes(entry.item.category))
				.map((entry) => ({ name: entry.item!.name, text: entry.text })),
			roadmapEntries: (latest.roadmaps ?? [])
				.map((entry) => ({ text: entry.text, item: this._roadmapList().get(entry.id) }))
				.filter(
					(entry) =>
						entry.item && (entry.item.categories ?? []).some((key) => enabled.includes(key)),
				)
				.map((entry) => ({ name: entry.item!.title, text: entry.text })),
		};
	});

	constructor() {
		this.data.watch();
		inject(DestroyRef).onDestroy(() => this.data.unwatch());
	}

	protected open(roadmap: DevRoadmap) {
		this._roadmapDialog().open(roadmap);
	}

	protected request(section: 'roadmaps' | 'packages' | 'plan') {
		const config: Record<typeof section, RequestConfig> = {
			packages: {
				types: ['package'],
				heading: 'Request a new package',
				lead: 'Missing a package you need? Describe what it should do and we will consider it.',
			},
			roadmaps: {
				types: ['roadmap'],
				heading: 'Suggest a roadmap',
				lead: 'Have a bigger idea we should plan? Tell us about it.',
			},
			plan: {
				types: ['bug', 'improvement'],
				heading: 'Report a bug or suggest an improvement',
				lead: 'Found something broken, or something that could work better? Let us know.',
			},
		};

		this._requestDialog().open(config[section]);
	}

	protected toggle(category: DevCategory) {
		this.enabled.update((current) =>
			current.includes(category)
				? current.filter((item) => item !== category)
				: [...current, category],
		);
	}

	protected isUrl(value: string) {
		return /^https?:\/\//i.test(value);
	}
}
