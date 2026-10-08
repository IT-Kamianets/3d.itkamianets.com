import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateDirective } from '@wawjs/ngx-translate';
import { packageGroups } from '../../feature/catalog/catalog.data';

@Component({
	imports: [RouterLink, TranslateDirective],
	templateUrl: './packages.component.html',
})
export class PackagesComponent {
	protected readonly groups = packageGroups;
}
