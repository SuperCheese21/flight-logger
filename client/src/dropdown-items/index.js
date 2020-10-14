import AircraftDropdownItem from './AircraftDropdownItem';
import AirlineDropdownItem from './AirlineDropdownItem';
import AirportDropdownItem from './AirportDropdownItem';
import CountryDropdownItem from './CountryDropdownItem';
import RegionDropdownItem from './RegionDropdownItem';

export default [
  {
    name: 'aircraft',
    label: 'Aircraft',
    component: AircraftDropdownItem,
  },
  {
    name: 'airlines',
    label: 'Airlines',
    component: AirlineDropdownItem,
  },
  {
    name: 'airports',
    label: 'Airports',
    component: AirportDropdownItem,
  },
  {
    name: 'countries',
    label: 'Countries',
    component: CountryDropdownItem,
  },
  {
    name: 'regions',
    label: 'Regions',
    component: RegionDropdownItem,
  },
];
