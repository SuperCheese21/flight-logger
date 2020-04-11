import cheerio from 'cheerio';
import parse from 'csv-parse/lib/sync';

export const parseOurAirportsData = data =>
  parse(data, { skip_empty_lines: true }).slice(1);

export const parseWikipediaData = data => {
  const html = data.replace(/\r?\n|\r|N\/A|n\/a/g, '');
  const $ = cheerio.load(html);
  return $('.wikitable tr').toArray();
};
