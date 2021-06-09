import debounce from 'lodash.debounce';
import { useCallback, useEffect, useRef, useState } from 'react';
import { usePrevious } from '../common/hooks';
import { getJsonData } from '../common/utils';

const useLiveSearch = ({
  debounceTime,
  getUrl,
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
          setIsLoading(false);
          const newResults = transformData(json) || [];
          setResults(newResults);
        }, debounceTime);
        cancel.current = debouncedFetchResults.cancel;
        debouncedFetchResults();
      } else {
        setIsLoading(false);
        setResults([]);
      }
    },
    [debounceTime, getUrl, minQueryLength, transformData],
  );

  useEffect(() => {
    if (query !== prevQuery) {
      fetchResults(query);
    }
  }, [fetchResults, prevQuery, query]);

  return { results, isLoading };
};

export default useLiveSearch;
