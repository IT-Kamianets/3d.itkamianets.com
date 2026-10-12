import { Component, computed, input } from '@angular/core';
import { create } from 'qrcode';

/** Quiet zone around the code, in modules. The spec asks for 4; scanners read 2 reliably on a white card. */
const MARGIN = 2;

/**
 * A QR code drawn as one SVG path, so it renders on the server and stays sharp at any size.
 * Always dark on white: many phone scanners fail on inverted (light on dark) codes.
 */
@Component({
	selector: 'app-qr-code',
	template: `
		<svg
			class="block h-auto w-full rounded-[var(--radius-md)] bg-white"
			[attr.viewBox]="'0 0 ' + size() + ' ' + size()"
			shape-rendering="crispEdges"
			role="img"
			[attr.aria-label]="label()"
		>
			<path [attr.d]="path()" fill="#000" />
		</svg>
	`,
	host: { class: 'block' },
})
export class QrCodeComponent {
	/** The text or URL to encode. */
	readonly value = input.required<string>();

	/** Accessible name; defaults to the encoded value. */
	readonly ariaLabel = input<string>();

	protected readonly label = computed(() => this.ariaLabel() ?? this.value());

	private readonly _modules = computed(
		() => create(this.value(), { errorCorrectionLevel: 'M' }).modules,
	);

	protected readonly size = computed(() => this._modules().size + MARGIN * 2);

	/** One `h1v1h-1z` square per dark module, merged into a single path. */
	protected readonly path = computed(() => {
		const { size, data } = this._modules();
		let d = '';

		for (let row = 0; row < size; row++) {
			for (let col = 0; col < size; col++) {
				if (data[row * size + col]) {
					d += `M${col + MARGIN} ${row + MARGIN}h1v1h-1z`;
				}
			}
		}

		return d;
	});
}
