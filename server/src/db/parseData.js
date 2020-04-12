import axios from 'axios';
import cheerio from 'cheerio';
import parse from 'csv-parse/lib/sync';

export const getText = node => {
  return node
    .children()
    .remove()
    .end()
    .text();
};

export const getAirlineDocument = async href => {
  const url = `https://en.wikipedia.org${href}`;
  try {
    const res = await axios.get(url);
    const $ = cheerio.load(res.data);

    const name = $('#firstHeading').text();

    const [iata, icao, callsign] = $('.infobox table')
      .eq(0)
      .find('td')
      .map((i, td) => getText($(td)))
      .get();

    const src = $('.infobox img')
      .eq(0)
      .attr('src');
    const logo = src ? `https:${src}` : '';

    return { iata, icao, callsign, name, logo };
  } catch ({ message }) {
    console.error(`  ${url} - ${message}`);
    return {};
  }
};

export const parseOurAirportsData = data =>
  parse(data, { skip_empty_lines: true }).slice(1);

export const parseWikipediaData = data => {
  const html = data.replace(/\r?\n|\r|N\/A|n\/a|\*/g, '');
  const $ = cheerio.load(html);
  return $('.wikitable tr').toArray();
};
