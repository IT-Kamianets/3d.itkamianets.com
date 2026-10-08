import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslateService } from '@wawjs/ngx-translate';

/**
 * Translates a data string through the same dictionary the `translate` directive uses.
 * Impure on purpose: it reads a signal, so it must re-run when the language changes.
 */
@Pipe({ name: 'tr', pure: false })
export class TrPipe implements PipeTransform {
	private readonly _translateService = inject(TranslateService);

	transform(text: string | null | undefined): string {
		return text ? this._translateService.translate(text)() : '';
	}
}

/**
 * Translates, then renders light inline markup for docs prose:
 * `code` becomes monospace, **bold** becomes strong, [text](https://url) becomes an external link.
 * The input is escaped first and Angular still sanitizes the result.
 */
@Pipe({ name: 'rich', pure: false })
export class RichPipe implements PipeTransform {
	private readonly _translateService = inject(TranslateService);

	transform(text: string | null | undefined): string {
		if (!text) {
			return '';
		}

		return this._translateService
			.translate(text)()
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/`([^`]+)`/g, '<span class="ds-mono">$1</span>')
			.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
			.replace(
				/\[([^\]]+)\]\((https:\/\/[^)\s]+)\)/g,
				'<a href="$2" rel="noopener" target="_blank">$1</a>',
			);
	}
}
