import axios from 'axios';
import cheerio from 'cheerio';
import parse from 'csv-parse/lib/sync';

export const getText = node =>
  node
    .text()
    .replace(/None|Unknown|N\/A|-|–|—|\?|\*/gi, '')
    .split(/\/|\(|\[|<|,|;| or /)[0]
    .trim();

const getInt = node => {
  const text = getText(node);
  const ints = text.match(/[0-9]+/g);
  if (ints) {
    return parseInt(ints[0], 10);
  }
  return null;
};

export const parseOurAirportsData = data =>
  parse(data, { skip_empty_lines: true }).slice(1);

export const parseWikipediaData = data =>
  cheerio.load(data, { decodeEntities: false });

export const getAirlineDocument = async href => {
  const url = `https://en.wikipedia.org${href}`;
  try {
    const res = await axios.get(url);
    const $ = parseWikipediaData(res.data);

    const wiki = $('link[rel="canonical"]').attr('href');

    const name = $('#firstHeading')
      .text()
      .split('(')[0]
      .trim();

    const infoTable = $('.infobox.vcard')
      .find('table')
      .eq(0);
    const headers = infoTable.find('th a').text();
    const [iata, icao, callsign] = infoTable
      .find('td')
      .map((i, td) => getText($(td)))
      .get();

    if (
      headers !== 'IATAICAOCallsign' ||
      iata.length !== 2 ||
      icao.length !== 3
    ) {
      return null;
    }

    const fleetSize = getInt($('th:contains("Fleet size")').next());
    const destinations = getInt($('th:contains("Destinations")').next());

    // eslint-disable-next-line no-underscore-dangle
    const _id = `${iata}_${icao}_${name.replace(/ /g, '_')}`;

    const src = $('.infobox img')
      .eq(0)
      .attr('src');
    const logo = src ? `https:${src}` : '';

    console.log(`  Retrieved ${_id} from ${wiki}`);

    return {
      name,
      _id,
      iata,
      icao,
      callsign,
      fleetSize,
      destinations,
      logo,
      wiki,
    };
  } catch ({ message }) {
    return console.error(`    ${url} - ${message}`);
  }
};
