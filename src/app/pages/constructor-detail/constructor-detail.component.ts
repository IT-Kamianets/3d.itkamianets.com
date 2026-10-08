import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateDirective } from '@wawjs/ngx-translate';
import {
	findConstructor,
	GENERATED_PACKAGE_SUFFIXES,
} from '../../feature/catalog/catalog.data';

@Component({
	imports: [RouterLink, TranslateDirective],
	templateUrl: './constructor-detail.component.html',
})
export class ConstructorDetailComponent {
	protected readonly item = findConstructor(
		inject(ActivatedRoute).snapshot.data['slug'] as string,
	)!;
	protected readonly generated = GENERATED_PACKAGE_SUFFIXES.map(
		(suffix) => `game-<name>-${suffix}`,
	);
}
