import axios from 'axios';
import cheerio from 'cheerio';
import parse from 'csv-parse/lib/sync';

export const getText = node =>
  node
    .children()
    .remove()
    .end()
    .text()
    .replace(/None|-|—|–|\*|N\/A|n\/a/g, '')
    .split('/')[0]
    .split('(')[0]
    .trim();

export const parseOurAirportsData = data =>
  parse(data, { skip_empty_lines: true }).slice(1);

export const parseWikipediaData = data => {
  const html = data.replace(/\r?\n|\r/g, '');
  return cheerio.load(html);
};

export const getAirlineDocument = async (name, href) => {
  console.log(`  Fetching data for ${name}...`);
  const url = `https://en.wikipedia.org${href}`;
  try {
    const res = await axios.get(url);
    const $ = parseWikipediaData(res.data);

    const infoTable = $('.infobox.vcard')
      .find('table')
      .eq(0);
    const headers = infoTable.find('th a').text();
    const [iata, icao, callsign] = infoTable
      .find('td')
      .map((i, td) => getText($(td)))
      .get();

    if (headers !== 'IATAICAOCallsign' || !iata || !icao) {
      return null;
    }

    const _id = `${iata}_${icao}`; // eslint-disable-line no-underscore-dangle

    const src = $('.infobox img')
      .eq(0)
      .attr('src');
    const logo = src ? `https:${src}` : '';

    return { name, _id, iata, icao, callsign, logo };
  } catch ({ message }) {
    return console.error(`    ${url} - ${message}`);
  }
};
