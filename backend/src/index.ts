import { drizzle } from 'drizzle-orm/neon-http';
import { Users } from './db/schema';
import { neon } from '@neondatabase/serverless';
import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import { addFriend } from './utils';

export type Env = {
  DATABASE_URL: string;
};

const app = new Hono<{ Bindings: Env }>();

// GET /users - Retrieve a list of all users
app.get('/users', async (c) => {
  try {
    const sql = neon(c.env.DATABASE_URL);
    const db = drizzle(sql);
    const result = await db.select().from(Users);
    return c.json({
      result,
    });
  } catch (error) {
    console.log('Error retrieving all users:', error);
    return c.json(
      {
        error,
      },
      400
    );
  }
});

// POST /users - Create a new user
app.post('/users', async (c) => {
  try {
    const { name, bio } = await c.req.json();

    const sql = neon(c.env.DATABASE_URL);
    const db = drizzle(sql);
    const result = await db.insert(Users).values({ name, bio }).returning();
    return c.json(
      {
        result,
      },
      201
    );
  } catch (error) {
    console.log('Error creating a user:', error);
    return c.json(
      {
        error,
      },
      400
    );
  }
});

// POST /users/:id/friends - Add a friend to a user’s friend list
app.post('/users/:id/friends', async (c) => {
  try {
    const { id } = c.req.param();
    const { friendId } = await c.req.json();

    const sql = neon(c.env.DATABASE_URL);
    const db = drizzle(sql);
    const success = await addFriend(db, Number(id), Number(friendId));
    if (success) {
      return c.json({
        message: 'Friend added successfully',
      });
    }
    return c.json({
      message: 'Friend already exists',
    });
  } catch (error) {
    console.log(error);
    return c.json(
      {
        error,
      },
      400
    );
  }
});

export default app;
