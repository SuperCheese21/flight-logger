import { model, Schema } from 'mongoose';

import { generateRandomId } from '../utils/serverUtils';

const TripSchema = new Schema({
  _id: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

class Trip {
  static saveTrip(user, body) {
    try {
      return Trip.create({ user, ...body });
    } catch (err) {
      if (err.name === 'MongoError' && err.code === 11000) {
        return this.saveTrip(user, body);
      }
      throw err;
    }
  }

  static getTripById(id) {
    const query = this.findById(id)
      .populate('flights')
      .lean();
    return query.exec();
  }

  static updateTrip(_id, user, body) {
    const query = this.findOneAndUpdate({ _id, user }, body, {
      new: true,
    }).lean();
    return query.exec();
  }

  static deleteTrip(_id, user) {
    const query = this.findOneAndDelete({ _id, user }).lean();
    return query.exec();
  }
}

TripSchema.virtual('flights', {
  ref: 'Flight',
  localField: '_id',
  foreignField: 'trip',
  options: { sort: { outTime: -1 } },
});

TripSchema.pre('save', function preSave() {
  this._id = generateRandomId(6);
});

TripSchema.loadClass(Trip);

export default model('Trip', TripSchema);
