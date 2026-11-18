export type DevCategory = 'angular' | 'unity' | 'waw' | 'ai' | 'blockchain';

export const DEV_CATEGORIES: { value: DevCategory; label: string }[] = [
	{ value: 'angular', label: 'Angular' },
	{ value: 'unity', label: 'Unity' },
	{ value: 'waw', label: 'waw' },
	{ value: 'ai', label: 'AI' },
	{ value: 'blockchain', label: 'Blockchain' },
];

export type RoadmapStatus = 'open' | 'planned' | 'in-progress' | 'done';

export const ROADMAP_STATUS_LABELS: Record<RoadmapStatus, string> = {
	open: 'Open',
	planned: 'Planned',
	'in-progress': 'In progress',
	done: 'Done',
};

export type TaskStatus = 'new' | 'in-progress' | 'completed';

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
	new: 'New',
	'in-progress': 'In progress',
	completed: 'Completed',
};

export type RequestType = 'package' | 'roadmap' | 'improvement' | 'bug';

export const REQUEST_TYPE_LABELS: Record<RequestType, string> = {
	package: 'Package',
	roadmap: 'Roadmap',
	improvement: 'Improvement',
	bug: 'Bug',
};

export interface DevDoc {
	id: string;
	createdAt: number;
}

export interface DevPackage extends DevDoc {
	name: string;
	description: string;
	repo: string;
	category: DevCategory;
}

export interface DevProjectLink {
	type: string;
	url: string;
}

export interface DevProject extends DevDoc {
	name: string;
	description: string;
	links?: DevProjectLink[];
}

export interface DevTask {
	id: string;
	title: string;
	status: TaskStatus;
}

export interface DevRoadmap extends DevDoc {
	title: string;
	description: string;
	categories?: DevCategory[];
	status: RoadmapStatus;
	projectIds: string[];
	tasks?: DevTask[];
	packageIds: string[];
	developerIds: string[];
}

export interface DevDeveloper extends DevDoc {
	fullName: string;
	avatar: string;
	linkedin: string;
	upwork: string;
}

export interface DevPlanEntry {
	id: string;
	text: string;
}

export interface DevPlan extends DevDoc {
	title: string;
	week: string;
	content: string;
	packages?: DevPlanEntry[];
	roadmaps?: DevPlanEntry[];
}

export interface DevVote extends DevDoc {
	targetId: string;
	uid: string;
	value: 1 | -1;
}

export interface DevComment extends DevDoc {
	targetId: string;
	uid: string;
	authorName: string;
	text: string;
}

/** ISO week such as 2026-W48, as a number and a readable Monday to Sunday range. */
export const weekLabel = (key: string) => {
	const [yearPart, weekPart] = key.split('-W');
	const year = Number(yearPart);
	const number = Number(weekPart);
	const monday = new Date(Date.UTC(year, 0, 4));

	monday.setUTCDate(monday.getUTCDate() - ((monday.getUTCDay() || 7) - 1) + (number - 1) * 7);

	const sunday = new Date(monday);

	sunday.setUTCDate(monday.getUTCDate() + 6);

	const format = (date: Date, options: Intl.DateTimeFormatOptions) =>
		new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', ...options }).format(date);

	return {
		number,
		range: `${format(monday, { day: 'numeric', month: 'short' })} – ${format(sunday, { day: 'numeric', month: 'short', year: 'numeric' })}`,
	};
};
