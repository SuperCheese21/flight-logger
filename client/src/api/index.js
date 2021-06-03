import { getJsonData } from '../utils';

export const getSearchResults = async ({ collection, query }) => {
  const json = await getJsonData({
    url: `http://localhost:3000/api/data/${collection}?q=${query}`,
  });
  return json?.results || [];
};
