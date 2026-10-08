import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { TranslateDirective } from '@wawjs/ngx-translate';
import { catalogPackages, packageGroups } from '../../feature/catalog/catalog.data';

@Component({
	imports: [RouterLink, TranslateDirective],
	templateUrl: './packages.component.html',
})
export class PackagesComponent {
	private readonly _router = inject(Router);
	private readonly _route = inject(ActivatedRoute);

	protected readonly groups = packageGroups.map((group) => group.name);
	/** The active filter lives in the URL (?group=Core) so it can be shared and survives reload. */
	protected readonly group = toSignal(
		this._route.queryParamMap.pipe(map((params) => params.get('group'))),
		{ initialValue: this._route.snapshot.queryParamMap.get('group') },
	);
	protected readonly visible = computed(() => {
		const group = this.group();
		return group ? catalogPackages.filter((item) => item.group === group) : catalogPackages;
	});

	protected select(group: string | null) {
		void this._router.navigate([], {
			relativeTo: this._route,
			queryParams: { group },
			queryParamsHandling: 'merge',
			replaceUrl: true,
		});
	}
}
