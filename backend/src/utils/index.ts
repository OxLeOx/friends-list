import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { Users } from '../db/schema';
import { eq } from 'drizzle-orm';

export enum AddFriendResponse {
  SUCCESS,
  USER_NOT_FOUND,
  FRIEND_ALREADY_EXISTS,
  USER_SELF,
  FRIEND_NOT_FOUND,
  UNKNOWN_ERROR,
}

export const addFriend = async (
  db: NeonHttpDatabase<Record<string, never>>,
  userId: number,
  friendId: number
): Promise<AddFriendResponse> => {
  try {
    const user = (
      await db
        .select()
        .from(Users)
        .where(eq(Users.id, userId))
    ).shift();
    if (user) {
      if (user.id === friendId) {
        return AddFriendResponse.USER_SELF;
      }
      if (user.friends?.includes(friendId)) {
        const updatedFriends = [...user?.friends!, friendId];
        await db
          .update(Users)
          .set({ friends: updatedFriends })
          .where(eq(Users.id, userId));
        return AddFriendResponse.SUCCESS;
      }
      return AddFriendResponse.FRIEND_ALREADY_EXISTS;
    }
    return AddFriendResponse.USER_NOT_FOUND;
  } catch (err) {
    console.error('Error adding friend:', err);
    return AddFriendResponse.UNKNOWN_ERROR;
  }
};
