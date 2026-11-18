import { DatePipe } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { DevelopmentService } from '../../../feature/development/development.service';
import { VisitorAuthService } from '../../../feature/development/visitor-auth.service';
import { TrPipe } from '../../../shared/translate/tr.pipe';

/** Votes and comments under one roadmap or plan. The page watches the data. */
@Component({
	selector: 'app-feedback',
	imports: [DatePipe, TrPipe],
	templateUrl: './feedback.component.html',
})
export class FeedbackComponent {
	protected readonly data = inject(DevelopmentService);
	protected readonly auth = inject(VisitorAuthService);

	readonly targetId = input.required<string>();

	protected readonly open = signal(false);
	protected readonly text = signal('');
	protected readonly busy = signal(false);

	protected readonly score = computed(() => this.data.scores().get(this.targetId()) ?? 0);
	protected readonly mine = computed(() => this.data.mine().get(this.targetId()) ?? 0);
	protected readonly comments = computed(
		() => this.data.commentsByTarget().get(this.targetId()) ?? [],
	);

	protected vote(value: 1 | -1) {
		return this.data.vote(this.targetId(), value);
	}

	protected valueOf(event: Event) {
		return (event.target as HTMLTextAreaElement).value;
	}

	protected canDelete(uid: string) {
		return this.auth.member()?.uid === uid;
	}

	protected async post(event: Event) {
		event.preventDefault();

		if (this.busy() || !this.text().trim()) {
			return;
		}

		this.busy.set(true);

		if (await this.data.comment(this.targetId(), this.text())) {
			this.text.set('');
		}

		this.busy.set(false);
	}
}
