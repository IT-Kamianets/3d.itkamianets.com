import { DOCUMENT } from '@angular/common';
import { Component, DestroyRef, inject, input, signal } from '@angular/core';
import { TrPipe } from '../translate/tr.pipe';
import { IconComponent } from '../icon/icon.component';

@Component({
	selector: 'app-code-block',
	imports: [IconComponent, TrPipe],
	template: `
		<div class="code-block">
			<div class="code-toolbar">
				<span class="ds-supporting" role="status">{{
					(state() === 'copied'
						? 'Copied'
						: state() === 'failed'
							? 'Copy failed. Select the text and copy it manually.'
							: ''
					) | tr
				}}</span>
				<button class="ds-btn ds-btn-ghost copy" type="button" (click)="copy()">
					<app-icon [name]="state() === 'copied' ? 'copy-check' : 'copy'" />
					<span>{{ 'Copy code' | tr }}</span>
				</button>
			</div>
			<pre
				tabindex="0"
				role="region"
				[attr.aria-label]="'Code snippet' | tr"
			><code>{{ code() }}</code></pre>
		</div>
	`,
})
export class CodeBlockComponent {
	private readonly _document = inject(DOCUMENT);
	private resetTimer?: ReturnType<typeof setTimeout>;
	constructor() {
		inject(DestroyRef).onDestroy(() => clearTimeout(this.resetTimer));
	}

	readonly code = input.required<string>();
	protected readonly state = signal<'idle' | 'copied' | 'failed'>('idle');

	protected async copy() {
		clearTimeout(this.resetTimer);
		const clipboard = this._document.defaultView?.navigator?.clipboard;

		if (!clipboard) {
			this.state.set('failed');
			return;
		}

		try {
			await clipboard.writeText(this.code());
			this.state.set('copied');
			this.resetTimer = setTimeout(() => this.state.set('idle'), 2000);
		} catch {
			this.state.set('failed');
		}
	}
}
