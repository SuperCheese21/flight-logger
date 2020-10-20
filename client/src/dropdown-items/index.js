import AircraftDropdownItem from './AircraftDropdownItem';
import AirlineDropdownItem from './AirlineDropdownItem';
import AirportDropdownItem from './AirportDropdownItem';
import CountryDropdownItem from './CountryDropdownItem';
import RegionDropdownItem from './RegionDropdownItem';

export default {
  aircraft: {
    label: 'Aircraft',
    component: AircraftDropdownItem,
  },
  airlines: {
    label: 'Airlines',
    component: AirlineDropdownItem,
  },
  airports: {
    label: 'Airports',
    component: AirportDropdownItem,
  },
  countries: {
    label: 'Countries',
    component: CountryDropdownItem,
  },
  regions: {
    label: 'Regions',
    component: RegionDropdownItem,
  },
};
