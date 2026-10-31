import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LanguageService, TranslateService } from '@wawjs/ngx-translate';
import { TrPipe } from '../../shared/translate/tr.pipe';
import { catalogPackages, packageGroups } from '../../feature/catalog/catalog.data';

@Component({ imports: [RouterLink, TrPipe], templateUrl: './packages.component.html' })
export class PackagesComponent {
	private readonly router = inject(Router);
	private readonly route = inject(ActivatedRoute);
	private readonly language = inject(LanguageService);
	private readonly translate = inject(TranslateService);
	private readonly params = toSignal(this.route.queryParamMap, {
		initialValue: this.route.snapshot.queryParamMap,
	});
	protected readonly groups = packageGroups.map((group) => group.name);
	protected readonly query = computed(() => this.params().get('q') ?? '');
	protected readonly group = computed(() => {
		const value = this.params().get('group');
		return value && this.groups.includes(value) ? value : null;
	});
	protected readonly total = catalogPackages.length;
	protected readonly visible = computed(() => {
		this.language.language();
		const words = this.query().trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
		return catalogPackages.filter((item) => {
			if (this.group() && item.group !== this.group()) return false;
			const text = [
				item.name,
				item.packageId,
				item.group,
				this.translate.translate(item.group)(),
				item.summary,
				this.translate.translate(item.summary)(),
				...item.api.map((api) => api.name),
			]
				.join(' ')
				.toLocaleLowerCase();
			return words.every((word) => text.includes(word));
		});
	});
	protected search(event: Event) {
		this.navigate({ q: (event.target as HTMLInputElement).value || null }, true);
	}
	protected select(group: string | null) {
		this.navigate({ group });
	}
	protected reset() {
		this.navigate({ q: null, group: null });
	}
	private navigate(queryParams: Record<string, string | null>, replaceUrl = false) {
		void this.router.navigate([], {
			relativeTo: this.route,
			queryParams,
			queryParamsHandling: 'merge',
			replaceUrl,
		});
	}
}
