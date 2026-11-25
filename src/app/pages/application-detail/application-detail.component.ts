import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
	APPLICATION_STATUS_LABELS,
	findApplication,
	findConstructor,
} from '../../feature/catalog/catalog.data';
import { IconComponent } from '../../shared/icon/icon.component';
import { TrPipe } from '../../shared/translate/tr.pipe';

@Component({
	imports: [RouterLink, IconComponent, TrPipe],
	templateUrl: './application-detail.component.html',
})
export class ApplicationDetailComponent {
	protected readonly item = findApplication(
		inject(ActivatedRoute).snapshot.data['slug'] as string,
	)!;
	protected readonly constructorItem = findConstructor(this.item.constructorSlug);
	protected readonly status = APPLICATION_STATUS_LABELS[this.item.status];
}
