import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateDirective } from '@wawjs/ngx-translate';
import { findPackage, repoUrl } from '../../feature/catalog/catalog.data';
import { CodeBlockComponent } from '../../shared/code-block/code-block.component';
import { IconComponent } from '../../shared/icon/icon.component';

@Component({
	imports: [RouterLink, TranslateDirective, IconComponent, CodeBlockComponent],
	templateUrl: './package-detail.component.html',
})
export class PackageDetailComponent {
	protected readonly item = findPackage(inject(ActivatedRoute).snapshot.data['slug'] as string)!;
	protected readonly repo = repoUrl(this.item.slug);
	protected readonly gitUrl = `${this.repo}.git`;
	protected readonly related = this.item.related
		.map((slug) => findPackage(slug))
		.filter((related) => !!related);
}
