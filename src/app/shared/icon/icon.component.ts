import { Component, computed, input } from '@angular/core';
import { ICONS, IconName } from './icons';

interface Shape {
	d: string | null;
	circle: { cx: string; cy: string; r: string } | null;
	opacity: string | null;
	fillRule: string | null;
	clipRule: string | null;
}

const attr = (source: string, name: string) =>
	new RegExp(`(?:^|\\s)${name}="([^"]*)"`).exec(source)?.[1] ?? null;

/** Parses the static icon markup once into plain shapes, so no HTML is injected at runtime. */
const SHAPES = Object.fromEntries(
	Object.entries(ICONS).map(([name, markup]) => {
		const shapes: Shape[] = [];
		const groupOpacity: (string | null)[] = [];

		for (const match of markup.matchAll(/<(\/?)(g|path|circle)([^>]*?)(\/?)>/g)) {
			const [, closing, tag, rest, selfClosing] = match;

			if (tag === 'g') {
				if (closing) {
					groupOpacity.pop();
				} else {
					groupOpacity.push(attr(rest, 'opacity'));
				}
				continue;
			}

			const inherited = groupOpacity.find((opacity) => opacity !== null) ?? null;
			shapes.push({
				d: attr(rest, 'd'),
				circle:
					tag === 'circle'
						? { cx: attr(rest, 'cx') ?? '0', cy: attr(rest, 'cy') ?? '0', r: attr(rest, 'r') ?? '0' }
						: null,
				opacity: attr(rest, 'opacity') ?? inherited,
				fillRule: attr(rest, 'fill-rule'),
				clipRule: attr(rest, 'clip-rule'),
			});
			void selfClosing;
		}

		return [name, shapes];
	}),
) as Record<IconName, Shape[]>;

/** Decorative Solar bold-duotone icon. */
@Component({
	selector: 'app-icon',
	template: `<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		aria-hidden="true"
		focusable="false"
		[style.width]="size()"
		[style.height]="size()"
	>
		@for (shape of shapes(); track $index) {
			@if (shape.circle; as circle) {
				<circle
					fill="currentColor"
					[attr.cx]="circle.cx"
					[attr.cy]="circle.cy"
					[attr.r]="circle.r"
					[attr.opacity]="shape.opacity"
				/>
			} @else {
				<path
					fill="currentColor"
					[attr.d]="shape.d"
					[attr.opacity]="shape.opacity"
					[attr.fill-rule]="shape.fillRule"
					[attr.clip-rule]="shape.clipRule"
				/>
			}
		}
	</svg>`,
	host: { style: 'display: inline-flex; flex: none; line-height: 0' },
})
export class IconComponent {
	readonly name = input.required<IconName>();
	readonly size = input('1.25rem');

	protected readonly shapes = computed(() => SHAPES[this.name()] ?? []);
}
