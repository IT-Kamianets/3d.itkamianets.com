import { DevCategory } from './development.interface';

/**
 * The categories this site shows. The Development page reads the shared Web Art Work backlog and
 * keeps only these: one category means no filter and no category question in the request form.
 */
export const VISIBLE_CATEGORIES: DevCategory[] = ['unity'];
