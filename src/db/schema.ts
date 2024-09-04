import { sql } from 'drizzle-orm';
import { pgTable, serial, text } from 'drizzle-orm/pg-core';

export const products = pgTable('users', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	bio: text('bio'),
	friends: serial('friends')
		.array()
		.default(sql`ARRAY[]::text[]`),
});
