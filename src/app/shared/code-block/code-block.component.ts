import { DOCUMENT } from '@angular/common';
import { Component, inject, input, signal } from '@angular/core';
import {  } from '@wawjs/ngx-translate';
import { TrPipe } from '../translate/tr.pipe';
import { IconComponent } from '../icon/icon.component';

@Component({
	selector: 'app-code-block',
	imports: [IconComponent, TrPipe],
	template: `
		<div class="code-block">
			<pre><code>{{ code() }}</code></pre>
			<button
				class="ds-btn ds-btn-ghost ds-btn-sm ds-btn-icon copy"
				type="button"
				[attr.aria-label]="'Copy to clipboard' | tr"
				(click)="copy()"
			>
				<app-icon [name]="state() === 'copied' ? 'copy-check' : 'copy'" />
			</button>
			<span class="sr-only-text" role="status">{{ (state() === 'copied' ? 'Copied' : state() === 'failed' ? 'Copy failed. Select the text and copy it manually.' : '') | tr }}</span>
		</div>
	`,
})
export class CodeBlockComponent {
	private readonly _document = inject(DOCUMENT);

	readonly code = input.required<string>();
	protected readonly state = signal<'idle' | 'copied' | 'failed'>('idle');

	protected async copy() {
		const clipboard = this._document.defaultView?.navigator?.clipboard;

		if (!clipboard) {
			this.state.set('failed');
			return;
		}

		try {
			await clipboard.writeText(this.code());
			this.state.set('copied');
			setTimeout(() => this.state.set('idle'), 2000);
		} catch {
			this.state.set('failed');
		}
	}
}
