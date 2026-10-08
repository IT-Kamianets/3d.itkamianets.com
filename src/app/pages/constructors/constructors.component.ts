import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateDirective } from '@wawjs/ngx-translate';
import { catalogConstructors } from '../../feature/catalog/catalog.data';
import { IconComponent } from '../../shared/icon/icon.component';

@Component({
	imports: [RouterLink, TranslateDirective, IconComponent],
	templateUrl: './constructors.component.html',
})
export class ConstructorsComponent {
	protected readonly constructors = catalogConstructors;
}
