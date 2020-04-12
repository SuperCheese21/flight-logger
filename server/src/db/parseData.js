import axios from 'axios';
import cheerio from 'cheerio';
import parse from 'csv-parse/lib/sync';

export const getLogoURL = async href => {
  const url = `https://en.wikipedia.org${href}`;
  try {
    const res = await axios.get(url);
    const $ = cheerio.load(res.data);
    const src = $('.infobox img').attr('src');

    return src ? `https:${src}` : '';
  } catch (err) {
    console.error(`  ${url} - Logo not found (${err.message})`);
    return '';
  }
};

export const getText = node => {
  return node
    .children()
    .remove()
    .end()
    .text();
};

export const parseOurAirportsData = data =>
  parse(data, { skip_empty_lines: true }).slice(1);

export const parseWikipediaData = data => {
  const html = data.replace(/\r?\n|\r|N\/A|n\/a|\*/g, '');
  const $ = cheerio.load(html);
  return $('.wikitable tr').toArray();
};
