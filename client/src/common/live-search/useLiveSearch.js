import debounce from 'lodash.debounce';
import { useCallback, useEffect, useRef, useState } from 'react';
import { usePrevious } from '../hooks';
import { getJsonData } from '../utils';

const useLiveSearch = ({
  debounceTime,
  getUrl,
  maxItems,
  minQueryLength,
  query,
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
          const newResults = transformData(json) || [];
          setResults(newResults.slice(0, maxItems));
          setIsLoading(false);
        }, debounceTime);
        cancel.current = debouncedFetchResults.cancel;
        debouncedFetchResults();
      } else {
        setIsLoading(false);
        setResults([]);
      }
    },
    [debounceTime, getUrl, maxItems, minQueryLength, transformData],
  );

  useEffect(() => {
    if (query !== prevQuery) {
      fetchResults(query);
    }
  }, [fetchResults, prevQuery, query]);

  return { results, isLoading };
};

export default useLiveSearch;
