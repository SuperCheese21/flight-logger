import { model, Schema } from 'mongoose';

import AppError from '../utils/error';
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
      return this.create({ user, ...body });
    } catch (err) {
      if (err.name === 'MongoError' && err.code === 11000) {
        return this.saveTrip(user, body);
      }
      if (err.name === 'ValidationError') {
        throw new AppError(400, err.message);
      }
      throw err;
    }
  }

  static getTripById(id) {
    return this.findById(id)
      .populate('flights')
      .lean();
  }

  static async updateTrip(_id, user, body) {
    const query = this.findOneAndUpdate({ _id, user }, body, {
      new: true,
    }).lean();
    const trip = await query.exec();
    if (!trip) {
      throw new AppError(404, 'Trip Not Found');
    }
    return trip;
  }

  static async deleteTrip(_id, user) {
    const query = this.findOneAndDelete({ _id, user }).lean();
    const trip = await query.exec();
    if (!trip) {
      throw new AppError(404, 'Trip Not Found');
    }
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
