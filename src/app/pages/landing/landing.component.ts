import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateDirective } from '@wawjs/ngx-translate';
import { catalogConstructors, catalogPackages } from '../../feature/catalog/catalog.data';

@Component({
	imports: [RouterLink, TranslateDirective],
	templateUrl: './landing.component.html',
	styleUrl: './landing.component.scss',
})
export class LandingComponent {
	protected readonly featuredPackages = catalogPackages.slice(0, 4);
	protected readonly constructors = catalogConstructors;
}
