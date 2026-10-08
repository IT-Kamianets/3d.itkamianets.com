import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { catalogPackages, dependencyLevels } from '../../feature/catalog/catalog.data';

const NODE = { width: 196, height: 40 };
const GAP = { x: 96, y: 18 };

interface Node {
	slug: string;
	name: string;
	x: number;
	y: number;
}

interface Edge {
	id: string;
	path: string;
}

/** Package dependencies as declared in each package.json, drawn left (no dependencies) to right. */
@Component({
	selector: 'app-dependency-graph',
	templateUrl: './dependency-graph.component.html',
})
export class DependencyGraphComponent {
	private readonly _router = inject(Router);

	protected readonly node = NODE;
	protected readonly nodes: Node[] = dependencyLevels.flatMap((level) =>
		level.packages.map((item, index) => ({
			slug: item.slug,
			name: item.name,
			x: level.level * (NODE.width + GAP.x),
			y: index * (NODE.height + GAP.y),
		})),
	);
	protected readonly width =
		dependencyLevels.length * NODE.width + (dependencyLevels.length - 1) * GAP.x;
	protected readonly height =
		Math.max(...dependencyLevels.map((level) => level.packages.length)) * (NODE.height + GAP.y) -
		GAP.y;
	protected readonly edges: Edge[] = catalogPackages.flatMap((item) =>
		item.dependencies.flatMap((dependency) => {
			const from = this.nodes.find((n) => n.slug === dependency);
			const to = this.nodes.find((n) => n.slug === item.slug);

			if (!from || !to) {
				return [];
			}

			const x1 = from.x + NODE.width;
			const y1 = from.y + NODE.height / 2;
			const x2 = to.x;
			const y2 = to.y + NODE.height / 2;
			const mid = (x1 + x2) / 2;

			return [{ id: `${dependency}>${item.slug}`, path: `M${x1},${y1} C${mid},${y1} ${mid},${y2} ${x2},${y2}` }];
		}),
	);
	protected readonly summary = catalogPackages
		.filter((item) => item.dependencies.length)
		.map((item) => `${item.name} needs ${item.dependencies.join(', ')}`)
		.join('. ');

	protected open(slug: string) {
		void this._router.navigate(['/packages', slug]);
	}
}
