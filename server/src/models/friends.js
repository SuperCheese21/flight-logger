import { model, Schema } from 'mongoose';

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

FriendsSchema.index({ requester: 1, recipient: 1 }, { unique: true });

FriendsSchema.pre('save', async function preSave() {
  console.log('FriendsSchema.pre()');
});

class Friends {
  static async addFriend(requesterId, recipientUsername) {
    console.log({ requesterId, recipientUsername });
    const recipient = await User.getUserByUsername(recipientUsername);
    if (recipient) {
      return this.create({
        requester: requesterId,
        recipient: recipient._id,
        status: 'pending',
      });
    }
    return null;
  }
}

FriendsSchema.loadClass(Friends);

export default model('Friends', FriendsSchema);
