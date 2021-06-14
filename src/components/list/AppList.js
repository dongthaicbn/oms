import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { List } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';
import CircularProgress from '@material-ui/core/CircularProgress';
import './AppList.scss'

const AppList = (props) => {
  let {dataSource, showLoading, renderItem, hasMore, disableLoadMore, onLoadMore, itemKey, scrollTop, onScroll} = props;
  renderItem = renderItem || (() => {});
  onLoadMore = onLoadMore || (async () => {});
  itemKey = itemKey || 'id';

  const [loadMoreMeta, setLoadMoreMeta] = useState({
    disabled: false,
    loading: false
  });
  let listRef = useRef(null);

  useEffect(() => {
    if (scrollTop) {
      listRef.current.scrollTop = scrollTop;
    }
  }, [scrollTop]);

  useEffect(() => {
    if (scrollTop) {
      listRef.current.scrollTop = scrollTop;
    }
  }, [dataSource]);

  useEffect(() => {
    if (loadMoreMeta.loading) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [loadMoreMeta.loading]);

  const handleListScroll = (event) => {
    if (onScroll) {
      onScroll(event.target.scrollTop);
    }
  };

  const canLoadMore = () => {
    return !disableLoadMore && !loadMoreMeta.disabled && !loadMoreMeta.loading && hasMore;
  };

  const isLoadingMore = () => {
    return !disableLoadMore && loadMoreMeta.loading;
  };

  const loadMoreData = () => {
    if (onLoadMore) {
      // seem InfiniteScroll.hasMore not working properly, need another load more condition check here
      if (!canLoadMore()) {
        return;
      }
      setLoadMoreMeta({disabled: true, loading: true});
      onLoadMore(dataSource ? dataSource[dataSource.length - 1] : null)
        .finally(() => {
          setLoadMoreMeta({disabled: false, loading: false})
        });
    }
  };

  const renderLoadingMoreItem = () => {
    if (isLoadingMore()) {
      return <div className="item-loading">
        <CircularProgress/>
      </div>
    }
  };

  const renderListContent = () => {
    if (showLoading) {
      return (
        <div className="loading-container">
          <CircularProgress/>
        </div>
      );
    }
    return (
      <InfiniteScroll
        pageStart={0}
        initialLoad={false}
        loadMore={loadMoreData}
        hasMore={canLoadMore()}
        threshold={10}
        useWindow={false}>
        <List
          itemLayout="vertical"
          dataSource={dataSource}
          renderItem={(item, index) => (
            <List.Item key={itemKey ? index : (item[itemKey] || index)}>
              {renderItem(item)}
            </List.Item>
          )}/>
        {renderLoadingMoreItem()}
      </InfiniteScroll>
    );
  };

  return (
    <div className="app-list" ref={listRef} onScroll={handleListScroll}>
      {renderListContent()}
    </div>
  )
};

export default AppList;