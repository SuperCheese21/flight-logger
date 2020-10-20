import { arrayOf, bool, number, shape, string } from 'prop-types';

export const countryShape = {
  _id: string.isRequired,
  name: string.isRequired,
  continent: string.isRequired,
  wiki: string.isRequired,
};

export const regionShape = {
  _id: string.isRequired,
  localCode: string.isRequired,
  name: string.isRequired,
  continent: string.isRequired,
  country: countryShape.isRequired,
  wiki: string.isRequired,
};

export const aircraftShape = {
  _id: string.isRequired,
  iata: string.isRequired,
  icao: string.isRequired,
  names: arrayOf(
    shape({
      name: string.isRequired,
      wiki: string.isRequired,
    }),
  ),
};

export const airlineShape = {
  _id: string.isRequired,
  iata: string.isRequired,
  icao: string.isRequired,
  name: string.isRequired,
  callsign: string.isRequired,
  fleetSize: number.isRequired,
  destinations: number.isRequired,
  logo: string.isRequired,
  wiki: string.isRequired,
};

export const airportShape = {
  _id: string.isRequired,
  type: string.isRequired,
  name: string.isRequired,
  location: arrayOf(number),
  elevation: number.isRequired,
  continent: string.isRequired,
  country: countryShape,
  region: regionShape,
  municipality: string.isRequired,
  scheduledService: bool.isRequired,
  
  wiki: string.isRequired,
};
