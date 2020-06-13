import { model, Schema } from 'mongoose';

import { generateRandomId } from '../utils/serverUtils';

export const TripSchema = new Schema({
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

TripSchema.virtual('flights', {
  ref: 'Flight',
  localField: '_id',
  foreignField: 'trip',
  options: { sort: { outTime: -1 } },
});

TripSchema.pre('save', function preSave() {
  this._id = generateRandomId(6);
});

const Trip = model('Trip', TripSchema);

export const saveTrip = async (user, body) => {
  try {
    return Trip.create({ user, ...body });
  } catch (err) {
    if (err.name === 'MongoError' && err.code === 11000) {
      return saveTrip(user, body);
    }
    throw err;
  }
};

export const getTripById = id => {
  const query = Trip.findById(id)
    .populate('flights')
    .lean();
  return query.exec();
};

export const updateTrip = (_id, user, body) => {
  const query = Trip.findOneAndUpdate({ _id, user }, body, {
    new: true,
  }).lean();
  return query.exec();
};

export default Trip;
