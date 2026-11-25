import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
	APPLICATION_STATUS_LABELS,
	catalogApplications,
} from '../../feature/catalog/catalog.data';
import { IconComponent } from '../../shared/icon/icon.component';
import { TrPipe } from '../../shared/translate/tr.pipe';

@Component({
	imports: [RouterLink, IconComponent, TrPipe],
	templateUrl: './applications.component.html',
})
export class ApplicationsComponent {
	protected readonly applications = catalogApplications;
	protected readonly statusLabels = APPLICATION_STATUS_LABELS;
}
