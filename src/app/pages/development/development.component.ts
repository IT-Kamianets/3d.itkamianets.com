import { Component } from '@angular/core';
import developmentData from '../../../data/development/development.json';
import { RichPipe, TrPipe } from '../../shared/translate/tr.pipe';

type DevBlock =
	| { type: 'p'; text: string }
	| { type: 'ul' | 'ol'; items: string[] }
	| { type: 'table'; head: string[]; rows: { name: string; text: string }[] }
	| { type: 'groups'; groups: { title: string; items: string[] }[] };

interface DevContent {
	title: string;
	lead: string;
	sections: { title: string; blocks: DevBlock[] }[];
}

/** The framework code review: prose, a high-severity table and bug lists grouped by package. */
@Component({
	imports: [TrPipe, RichPipe],
	templateUrl: './development.component.html',
})
export class DevelopmentComponent {
	protected readonly content = developmentData as DevContent;

	protected sectionId(title: string) {
		return title
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-|-$/g, '');
	}
}
