import { model, Schema } from 'mongoose';

import { AppError } from '../utils/serverUtils';
import User from './user';

const FriendsSchema = new Schema(
  {
    requesterId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recipientId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted'],
      required: true,
    },
    createdAt: Date,
    updatedAt: Date,
  },
  {
    timestamps: true,
  },
);

class Friends {
  static async addFriend(requesterId, recipientUsername) {
    // Ensure the recipient matches a User
    const recipient = await User.getUserByUsername(recipientUsername);
    if (!recipient) {
      throw new AppError(404, 'User not found');
    }

    // Ensure that the recipient and requester are distinct
    const recipientId = recipient._id;
    if (requesterId.equals(recipientId)) {
      throw new AppError(400, "You can't send yourself a friend request");
    }

    // Check if a connection already exists between the two users
    const friends = await this.findFriends(requesterId, recipientId);
    if (!friends) {
      // Create a new friend request if one doesn't exist
      return this.create({ requesterId, recipientId, status: 'pending' });
    }

    // Check if the friend request has already been accepted
    if (friends.status === 'accepted') {
      throw new AppError(400, 'You are already friends with this person');
    }

    // Also check if the requester has already sent a friend request
    if (requesterId.equals(friends.requesterId)) {
      throw new AppError(400, 'You already sent this person a friend request');
    }

    // Update the friend request status to accepted
    const query = friends.updateOne({ status: 'accepted' });
    return query.exec();
  }

  static findFriends(requesterId, recipientId) {
    const query = this.findOne({
      $or: [
        { requesterId, recipientId },
        { requesterId: recipientId, recipientId: requesterId },
      ],
    });
    return query.exec();
  }
}

FriendsSchema.loadClass(Friends);

export default model('Friends', FriendsSchema);
