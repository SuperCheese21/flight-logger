import { model, Schema } from 'mongoose';

const AirportSchema = new Schema({
  _id: String,
  type: String,
  name: String,
  location: {
    lat: Number,
    lon: Number,
  },
  elevation: Number,
  continent: String,
  country: String,
  region: String,
  municipality: String,
  scheduledService: Boolean,
  codes: {
    ident: String,
    gps: String,
    iata: String,
    local: String,
  },
});

const AirportModel = model('Airport', AirportSchema);

export default AirportModel;
