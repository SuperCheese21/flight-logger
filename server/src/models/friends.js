import { model, Schema } from 'mongoose';

import { AppError } from '../utils/serverUtils';
import User from './user';

const FriendsSchema = new Schema(
  {
    requester: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recipient: {
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

    // Ensure that the recipient and requester are distinct
    const recipientId = recipient._id;
    if (requesterId.equals(recipientId)) {
      throw new AppError(400, "You can't add yourself as a friend");
    }

    // Check if a connection already exists between the two users
    const friends = await this.findFriends(requesterId, recipientId);
    if (!friends) {
      return this.create({
        requester: requesterId,
        recipient: recipientId,
        status: 'pending',
      });
    }

    // Check if the friend request has already been accepted
    if (friends.status === 'accepted') {
      throw new AppError(400, 'You are already friends with this person');
    }

    // Also check if the requester has already sent a friend request
    if (requesterId.equals(friends.requester._id)) {
      throw new AppError(400, 'You already sent this person a friend request');
    }

    // Update the friend request status to accepted
    const query = friends.updateOne({ status: 'accepted' });
    return query.exec();
  }

  static async removeFriend(requesterId, recipientUsername) {
    // Ensure the recipient matches a User
    const recipient = await User.getUserByUsername(recipientUsername);

    // Ensure that the recipient and requester are distinct
    const recipientId = recipient._id;
    if (requesterId.equals(recipientId)) {
      throw new AppError(400, "You can't unfriend yourself");
    }

    // Ensure the two users are friends
    const friends = await this.findFriends(requesterId, recipientId);
    if (!friends) {
      throw new AppError(400, 'You are not friends with this user');
    }

    // Remove friend request from database
    return friends.remove();
  }

  static findFriends(requesterId, recipientId) {
    const query = this.findOne({
      $or: [
        { requester: requesterId, recipient: recipientId },
        { requester: recipientId, recipient: requesterId },
      ],
    });
    return query.exec();
  }

  static async getFriends(userId) {
    const query = this.find({
      $or: [{ requester: userId }, { recipient: userId }],
    })
      .populate('requester')
      .populate('recipient')
      .lean();
    const results = await query.exec();
    console.log({ results });
    return results.reduce(
      (acc, { status, requester, recipient }) => {
        if (status === 'accepted') {
          const friend = userId.equals(requester._id) ? recipient : requester;
          acc.friends.push(friend);
        } else if (userId.equals(recipient._id)) {
          acc.receivedFriendRequests.push(requester);
        }
        return acc;
      },
      {
        friends: [],
        receivedFriendRequests: [],
      },
    );
  }
}

FriendsSchema.loadClass(Friends);

export default model('Friends', FriendsSchema);
