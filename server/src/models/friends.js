import { model, Schema } from 'mongoose';

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
    const recipient = await User.getUserByUsername(recipientUsername);
    if (!recipient) {
      return null;
    }

    const recipientId = recipient._id;
    const friends = await this.findFriends(requesterId, recipientId);
    if (!friends) {
      return this.create({ requesterId, recipientId, status: 'pending' });
    }

    if (friends.status === 'accepted') {
      throw new Error('You are already friends with this person');
    }

    if (!requesterId.equals(friends.recipientId)) {
      throw new Error('You already sent this person a friend request');
    }

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
