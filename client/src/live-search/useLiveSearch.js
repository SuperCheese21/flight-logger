import debounce from 'lodash.debounce';
import { useCallback, useEffect, useRef, useState } from 'react';
import { usePrevious } from '../common/hooks';
import { getJsonData } from '../common/utils';

const useLiveSearch = ({
  debounceTime,
  getUrl,
  minQueryLength,
  query,
  textExtractor,
  transformData,
}) => {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const cancel = useRef(null);
  const prevQuery = usePrevious(query);

  const fetchResults = useCallback(
    searchQuery => {
      cancel.current?.();
      if (searchQuery.length >= minQueryLength) {
        setIsLoading(true);
        const debouncedFetchResults = debounce(async () => {
          const json = await getJsonData({
            url: `${getUrl}?q=${searchQuery}`,
          });
          setIsLoading(false);
          const newResults = transformData(json) || [];
          setResults(
            newResults.map(result => ({
              id: result._id,
              link: result.wiki || result.names?.[0].wiki,
              logo: result.logo,
              text: textExtractor(result),
            })),
          );
        }, debounceTime);
        cancel.current = debouncedFetchResults.cancel;
        debouncedFetchResults();
      } else {
        setIsLoading(false);
        setResults([]);
      }
    },
    [debounceTime, getUrl, minQueryLength, textExtractor, transformData],
  );

  useEffect(() => {
    if (query !== prevQuery) {
      fetchResults(query);
    }
  }, [fetchResults, prevQuery, query]);

  return { results, isLoading };
};

export default useLiveSearch;
