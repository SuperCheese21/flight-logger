import debounce from 'lodash.debounce';
import { useCallback, useEffect, useRef, useState } from 'react';
import { usePrevious } from '../common/hooks';
import { getJsonData } from '../common/utils';

const useLiveSearch = ({
  debounceTime = 250,
  getUrl,
  minQueryLength = 1,
  query,
  transformData = _ => _,
}) => {
  const [results, setResults] = useState([]);

  const cancel = useRef(null);
  const prevQuery = usePrevious(query);

  const fetchResults = useCallback(
    searchQuery => {
      cancel.current?.();
      if (searchQuery.length >= minQueryLength) {
        const debouncedFetchResults = debounce(async () => {
          const json = await getJsonData({
            url: `${getUrl}?q=${searchQuery}`,
          });
          const newResults = transformData(json) || [];
          setResults(newResults);
        }, debounceTime);
        cancel.current = debouncedFetchResults.cancel;
        debouncedFetchResults();
      } else {
        setResults([]);
      }
    },
    [debounceTime, getUrl, minQueryLength, transformData],
  );

  useEffect(() => {
    if (query !== prevQuery) {
      fetchResults(query);
    }
  }, [fetchResults, minQueryLength, prevQuery, query]);

  return results;
};

export default useLiveSearch;
