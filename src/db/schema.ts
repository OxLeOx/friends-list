import { sql } from 'drizzle-orm';
import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';

export const products = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  bio: text('bio'),
  friends: integer('friends')
    .array()
    .default(sql`ARRAY[]::integer[]`),
});
