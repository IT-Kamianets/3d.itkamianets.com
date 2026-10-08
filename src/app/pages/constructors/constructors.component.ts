import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {  } from '@wawjs/ngx-translate';
import { TrPipe } from '../../shared/translate/tr.pipe';
import { catalogConstructors } from '../../feature/catalog/catalog.data';
import { IconComponent } from '../../shared/icon/icon.component';

@Component({
	imports: [RouterLink, IconComponent, TrPipe],
	templateUrl: './constructors.component.html',
})
export class ConstructorsComponent {
	protected readonly constructors = catalogConstructors;
}
