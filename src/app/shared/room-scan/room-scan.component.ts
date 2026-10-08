import { Component } from '@angular/core';

type Point = [number, number];

const SCALE = 36;
const ORIGIN: Point = [330, 120];
const ROOM = { width: 5, depth: 6, height: 2.7 };

/** Isometric projection: u runs down-right, v runs down-left, h is height (meters). */
const iso = (u: number, v: number, h: number): Point => [
	ORIGIN[0] + (u - v) * 0.866 * SCALE,
	ORIGIN[1] + (u + v) * 0.5 * SCALE - h * SCALE,
];
const poly = (points: Point[]) => points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');

interface Tag {
	label: string;
	anchor: Point;
	/** Chip position and size in viewBox units. */
	chip: { x: number; y: number };
	/** Where the leader line meets the chip. */
	join: Point;
}

const CHIP_W = 124;
const CHIP_H = 28;
const VIEW = { width: 640, height: 340 };

const tag = (label: string, anchor: Point, x: number, y: number, side: 'left' | 'right'): Tag => ({
	label,
	anchor,
	chip: { x, y },
	join: [side === 'left' ? x + CHIP_W : x, y + CHIP_H / 2],
});

/**
 * A scanned room drawn as a wireframe, tagged with the semantic labels of
 * 3d-scene-schema v1. The labels are the schema's own enum values.
 */
@Component({
	selector: 'app-room-scan',
	templateUrl: './room-scan.component.html',
})
export class RoomScanComponent {
	protected readonly view = VIEW;
	protected readonly chipSize = { width: CHIP_W, height: CHIP_H };

	protected readonly floor = poly([
		iso(0, 0, 0),
		iso(ROOM.width, 0, 0),
		iso(ROOM.width, ROOM.depth, 0),
		iso(0, ROOM.depth, 0),
	]);
	protected readonly rightWall = poly([
		iso(0, 0, 0),
		iso(ROOM.width, 0, 0),
		iso(ROOM.width, 0, ROOM.height),
		iso(0, 0, ROOM.height),
	]);
	protected readonly leftWall = poly([
		iso(0, 0, 0),
		iso(0, ROOM.depth, 0),
		iso(0, ROOM.depth, ROOM.height),
		iso(0, 0, ROOM.height),
	]);
	protected readonly door = poly([
		iso(3.2, 0, 0),
		iso(4.1, 0, 0),
		iso(4.1, 0, 2),
		iso(3.2, 0, 2),
	]);
	protected readonly window = poly([
		iso(0, 2, 0.9),
		iso(0, 3.2, 0.9),
		iso(0, 3.2, 2.1),
		iso(0, 2, 2.1),
	]);
	protected readonly gridLines = [
		...Array.from({ length: ROOM.width - 1 }, (_, i) => ({
			from: iso(i + 1, 0, 0),
			to: iso(i + 1, ROOM.depth, 0),
		})),
		...Array.from({ length: ROOM.depth - 1 }, (_, i) => ({
			from: iso(0, i + 1, 0),
			to: iso(ROOM.width, i + 1, 0),
		})),
	];

	protected readonly tags: Tag[] = [
		tag('WINDOW_FRAME', iso(0, 2.6, 1.5), 16, 40, 'left'),
		tag('WALL_FACE', iso(1.6, 0, 1.5), 500, 40, 'right'),
		tag('DOOR_FRAME', iso(3.65, 0, 1), 520, 125, 'right'),
		tag('FLOOR', iso(2.5, 3, 0), 500, 262, 'right'),
	];

	protected readonly labels = this.tags.map((item) => item.label);

	protected left(x: number) {
		return `${(x / VIEW.width) * 100}%`;
	}

	protected top(y: number) {
		return `${(y / VIEW.height) * 100}%`;
	}
}
