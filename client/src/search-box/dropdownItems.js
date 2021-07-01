import { DATA_TYPE_KEYS } from '../constants';

export default {
  [DATA_TYPE_KEYS.aircraft]: {
    label: 'Aircraft',
    getItemData: ({ _id, iata, icao, names }) => ({
      key: _id,
      text: `${iata}/${icao} - ${names[0].name}`,
    }),
    getHref: ({ names }) => names[0].wiki,
  },
  [DATA_TYPE_KEYS.airlines]: {
    label: 'Airlines',
    getItemData: ({ _id, logo, iata, icao, name }) => ({
      key: _id,
      image: logo,
      text: `${iata}/${icao} - ${name}`,
    }),
    getHref: ({ wiki }) => wiki,
  },
  [DATA_TYPE_KEYS.airports]: {
    label: 'Airports',
    getItemData: ({ _id, codes, name }) => ({
      key: _id,
      text: `${codes.iata || codes.local}/${codes.ident} - ${name}`,
    }),
    getHref: ({ wiki }) => wiki,
  },
  [DATA_TYPE_KEYS.countries]: {
    label: 'Countries',
    getItemData: ({ _id, name }) => ({
      key: _id,
      text: `${_id} - ${name}`,
    }),
    getHref: ({ wiki }) => wiki,
  },
  [DATA_TYPE_KEYS.regions]: {
    label: 'Regions',
    getItemData: ({ _id, country, name }) => ({
      key: _id,
      text: `${_id} - ${name}, ${country}`,
    }),
    getHref: ({ wiki }) => wiki,
  },
};
