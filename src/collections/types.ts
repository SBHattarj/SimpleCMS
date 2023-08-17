import type widgets from '@src/components/widgets';
import type { roles } from './Auth';
import { writable, type Writable } from 'svelte/store';

// Define a new `permissions` type using a mapped type for read & write
type permissions = {
	[K in (typeof roles)[keyof typeof roles]]?: {
		read?: boolean;
		write?: boolean;
	};
};

// Define a new `Schema` interface that represents the shape of an object with several properties
export interface Schema {
	permissions?: permissions;
	name: string;
	icon?: string;
	slug?: string;
	fields: ReturnType<(typeof widgets)[keyof typeof widgets]>[];
	strict?: boolean;
	status?: 'published' | 'unpublished' | 'draft' | 'schedule' | 'cloned';
}

type Imports =
	| 'ImageArray'
	| 'Media'
	| 'Menu'
	| 'Names'
	| 'Posts'
	| 'Posts2'
	| 'Relation'
	| 'WidgetTest';

export const imports = writable() as Writable<{ [Key in Imports]: Schema }>;
