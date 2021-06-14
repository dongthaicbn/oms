import { useRef, useEffect } from 'react';
import { CACHE_PAGE } from 'utils/constants/actionType';
import store from '../../configStore';

export const usePageCache = (pageKey, props) => {
  const getPageCacheData = () => {
    let systemState = store.getState()['system'];
    return systemState.pageCache[pageKey];
  };

  const updatePageCacheData = (key, value) => {
    pageCacheDataRef.current[key] = value;
  };

  const pageCacheDataRef = useRef({});
  const isUseCache = props.history.action === 'POP' && getPageCacheData();

  useEffect(() => {
    return () => {
      store.dispatch({
        type: CACHE_PAGE,
        payload: {
          page: pageKey,
          pageData: pageCacheDataRef.current
        }
      });
    }
  }, []);

  return [isUseCache, getPageCacheData, updatePageCacheData];
};