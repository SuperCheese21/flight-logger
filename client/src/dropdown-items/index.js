import { DATA_TYPE_KEYS } from '../utils/constants';

export default {
  [DATA_TYPE_KEYS.aircraft]: {
    label: 'Aircraft',
    textExtractor: ({ iata, icao, names }) =>
      `${iata}/${icao} - ${names[0].name}`,
  },
  [DATA_TYPE_KEYS.airlines]: {
    label: 'Airlines',
    textExtractor: ({ iata, icao, name }) => `${iata}/${icao} - ${name}`,
  },
  [DATA_TYPE_KEYS.airports]: {
    label: 'Airports',
    textExtractor: ({ codes, name }) =>
      `${codes.iata || codes.local}/${codes.ident} - ${name}`,
  },
  [DATA_TYPE_KEYS.countries]: {
    label: 'Countries',
    textExtractor: ({ _id, name }) => `${_id} - ${name}`,
  },
  [DATA_TYPE_KEYS.regions]: {
    label: 'Regions',
    textExtractor: ({ _id, country, name }) => `${_id} - ${name}, ${country}`,
  },
};
