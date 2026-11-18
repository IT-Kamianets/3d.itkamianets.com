import { Component, ElementRef, computed, inject, signal, viewChild } from '@angular/core';
import { VISIBLE_CATEGORIES } from '../../../feature/development/development.config';
import {
	DEV_CATEGORIES,
	DevCategory,
	REQUEST_TYPE_LABELS,
	RequestType,
} from '../../../feature/development/development.interface';
import { DevelopmentService } from '../../../feature/development/development.service';
import { VisitorAuthService } from '../../../feature/development/visitor-auth.service';
import { TrPipe } from '../../../shared/translate/tr.pipe';

export interface RequestConfig {
	types: RequestType[];
	heading: string;
	lead: string;
}

/** A modal form that sends a request to the team. Needs a Google sign-in. */
@Component({
	selector: 'app-request-dialog',
	imports: [TrPipe],
	templateUrl: './request-dialog.component.html',
})
export class RequestDialogComponent {
	private readonly _dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
	private readonly _data = inject(DevelopmentService);

	protected readonly auth = inject(VisitorAuthService);
	protected readonly typeLabels = REQUEST_TYPE_LABELS;
	protected readonly categories = DEV_CATEGORIES.filter((category) =>
		VISIBLE_CATEGORIES.includes(category.value),
	);
	protected readonly config = signal<RequestConfig>({ types: ['roadmap'], heading: '', lead: '' });
	protected readonly chosenType = signal<RequestType | ''>('');
	protected readonly type = computed(() => this.chosenType() || this.config().types[0]);
	/** A site with one category does not ask for it. */
	protected readonly category = signal<DevCategory | ''>(
		this.categories.length === 1 ? this.categories[0].value : '',
	);
	protected readonly title = signal('');
	protected readonly description = signal('');
	protected readonly repo = signal('');
	protected readonly busy = signal(false);
	protected readonly sent = signal(false);
	protected readonly failed = signal(false);

	open(config: RequestConfig) {
		this.config.set(config);
		this.chosenType.set('');
		this.sent.set(false);
		this.failed.set(false);
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

	protected valueOf(event: Event) {
		return (event.target as HTMLInputElement | HTMLTextAreaElement).value;
	}

	protected async submit(event: Event) {
		event.preventDefault();
		const title = this.title().trim();
		const category = this.category();

		if (!title || !category || this.busy()) {
			return;
		}

		this.busy.set(true);
		this.failed.set(false);

		const saved = await this._data.request({
			type: this.type(),
			category,
			title,
			description: this.description().trim(),
			repo: this.type() === 'package' ? this.repo().trim() : '',
		});

		this.busy.set(false);
		this.sent.set(saved);
		this.failed.set(!saved);

		if (saved) {
			this.title.set('');
			this.description.set('');
			this.repo.set('');
		}
	}
}
