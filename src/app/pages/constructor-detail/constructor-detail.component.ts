import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {} from '@wawjs/ngx-translate';
import { TrPipe } from '../../shared/translate/tr.pipe';
import {
	findConstructor,
	GENERATED_PACKAGE_SUFFIXES,
	repoUrl,
} from '../../feature/catalog/catalog.data';
import { CodeBlockComponent } from '../../shared/code-block/code-block.component';
import { IconComponent } from '../../shared/icon/icon.component';

@Component({
	imports: [RouterLink, IconComponent, CodeBlockComponent, TrPipe],
	templateUrl: './constructor-detail.component.html',
})
export class ConstructorDetailComponent {
	protected readonly item = findConstructor(
		inject(ActivatedRoute).snapshot.data['slug'] as string,
	)!;
	/** A constructor with its own camera and controls packages is ready to build a game on. */
	protected readonly ready = this.item.parts.some((slug) => slug.endsWith('-controls'));
	protected readonly repo = repoUrl(this.item.repo);
	protected readonly generated = GENERATED_PACKAGE_SUFFIXES.map(
		(suffix) => `<game>-${suffix}`,
	).join('\n');
}
