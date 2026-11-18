import { Component, ElementRef, computed, inject, signal, viewChild } from '@angular/core';
import { VISIBLE_CATEGORIES } from '../../../feature/development/development.config';
import {
	DEV_CATEGORIES,
	DevRoadmap,
	ROADMAP_STATUS_LABELS,
	TASK_STATUS_LABELS,
	weekLabel,
} from '../../../feature/development/development.interface';
import { DevelopmentService } from '../../../feature/development/development.service';
import { TrPipe } from '../../../shared/translate/tr.pipe';
import { FeedbackComponent } from '../feedback/feedback.component';

/** Everything linked to one roadmap: plans, packages, projects, tasks and developers. */
@Component({
	selector: 'app-roadmap-dialog',
	imports: [TrPipe, FeedbackComponent],
	templateUrl: './roadmap-dialog.component.html',
})
export class RoadmapDialogComponent {
	private readonly _dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
	private readonly _data = inject(DevelopmentService);

	protected readonly statusLabels = ROADMAP_STATUS_LABELS;
	protected readonly taskLabels = TASK_STATUS_LABELS;
	protected readonly categoryLabels = Object.fromEntries(
		DEV_CATEGORIES.map((category) => [category.value, category.label]),
	);
	/** Categories are only shown on a site that shows several. */
	protected readonly showCategories = VISIBLE_CATEGORIES.length > 1;
	protected readonly roadmap = signal<DevRoadmap | undefined>(undefined);

	protected readonly packages = computed(() => {
		const ids = this.roadmap()?.packageIds ?? [];

		return this._data.packages().filter((item) => ids.includes(item.id));
	});
	protected readonly projects = computed(() => {
		const ids = this.roadmap()?.projectIds ?? [];

		return this._data.projects().filter((item) => ids.includes(item.id));
	});
	protected readonly developers = computed(() => {
		const ids = this.roadmap()?.developerIds ?? [];

		return this._data.developers().filter((item) => ids.includes(item.id));
	});
	/** Every plan that says something about this roadmap, newest week first. */
	protected readonly plans = computed(() => {
		const id = this.roadmap()?.id;

		return this._data
			.plans()
			.map((plan) => ({ plan, entry: plan.roadmaps?.find((entry) => entry.id === id) }))
			.filter((item) => item.entry)
			.sort((a, b) => b.plan.week.localeCompare(a.plan.week))
			.map(({ plan, entry }) => ({ id: plan.id, label: weekLabel(plan.week), text: entry!.text }));
	});

	open(roadmap: DevRoadmap) {
		this.roadmap.set(roadmap);
		this._dialog().nativeElement.showModal();
	}

	protected close() {
		this._dialog().nativeElement.close();
	}

	protected backdrop(event: MouseEvent) {
		if (event.target === this._dialog().nativeElement) {
			this.close();
		}
	}

	protected isUrl(value: string) {
		return /^https?:\/\//i.test(value);
	}
}
