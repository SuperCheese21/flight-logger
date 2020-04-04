import { model, Schema } from 'mongoose';

export const AircraftSchema = new Schema({
  _id: String,
  iata: String,
  icao: String,
  names: [String],
});

AircraftSchema.static(
  'dataUrl',
  'https://en.wikipedia.org/wiki/List_of_aircraft_type_designators',
);

AircraftSchema.static('getUpdate', ($, tds) => {
  const icao = tds.eq(0).text();
  const iata = tds.eq(1).text();
  const _id = `${icao}_${iata}`; // eslint-disable-line no-underscore-dangle
  const names = tds
    .eq(2)
    .children('a')
    .map((j, a) => $(a).text())
    .get();
  return { _id, icao, iata, names };
});

export default model('Aircraft', AircraftSchema, 'aircraft');
