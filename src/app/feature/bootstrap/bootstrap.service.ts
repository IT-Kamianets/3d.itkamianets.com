import { Service, inject } from '@angular/core';
import { COMPANY_FALLBACK } from '../company/company.const';
import { CompanyService } from '../company/company.service';

/** The site is fully static: the company profile comes from `src/data/company/company.json`. */
@Service()
export class BootstrapService {
	private readonly _companyService = inject(CompanyService);

	initialize() {
		this._companyService.setFallbackCompany(COMPANY_FALLBACK);
		this._companyService.loading.set(false);
	}
}
