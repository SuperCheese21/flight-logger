import mongoose from 'mongoose';

const AirportSchema = new mongoose.Schema({
  _id: String,
});

const AirportModel = mongoose.model('Airport', AirportSchema);

export default AirportModel;
