import axios from 'axios';
import cheerio from 'cheerio';
import parse from 'csv-parse/lib/sync';

export const getText = node => {
  return node
    .children()
    .remove()
    .end()
    .text()
    .replace(/None|-|—|–|\*|N\/A|n\/a/g, '')
    .split('/')[0];
};

export const parseOurAirportsData = data =>
  parse(data, { skip_empty_lines: true }).slice(1);

export const parseWikipediaData = data => {
  const html = data.replace(/\r?\n|\r/g, '');
  return cheerio.load(html);
};

export const getAirlineDocument = async href => {
  const url = `https://en.wikipedia.org${href}`;
  try {
    const res = await axios.get(url);
    const $ = parseWikipediaData(res.data);

    const [iata, icao, callsign] = $('.infobox table')
      .eq(0)
      .find('td')
      .map((i, td) => getText($(td)))
      .get();

    if (!iata || !icao) {
      return null;
    }

    const _id = `${iata}_${icao}`; // eslint-disable-line no-underscore-dangle

    const name = $('#firstHeading').text();

    const src = $('.infobox img')
      .eq(0)
      .attr('src');
    const logo = src ? `https:${src}` : '';

    return { _id, iata, icao, callsign, name, logo };
  } catch ({ message }) {
    return console.error(`  ${url} - ${message}`);
  }
};
