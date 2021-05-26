import React, { useState, useEffect } from 'react';
import { List } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';
import CircularProgress from '@material-ui/core/CircularProgress';
import { isEmpty } from 'utils/helpers/helpers';
import './AppList.scss'

const AppList = (props) => {
  let {dataSource, renderItem, disableLoadMore, refreshOn, onRefresh, onLoadMore, itemKey} = props;
  renderItem = renderItem || (() => {});
  onLoadMore = onLoadMore || (async () => {});
  onRefresh = onRefresh || (async () => {});
  itemKey = itemKey || 'id';

  const [items, setItems] = useState([]);
  const [loadMoreMeta, setLoadMoreMeta] = useState({
    disabled: false,
    hasMore: true,
    loading: false
  });

  useEffect(() => {
    setItems(dataSource || []);
  }, [dataSource]);

  useEffect(() => {
    setItems([]);
    refreshData();
  }, [refreshOn]);

  const refreshData = () => {
    if (onRefresh) {
      setLoadMoreMeta({disabled: true, hasMore: false, loading: false});
      onRefresh()
        .then((hasMore) => {
          setLoadMoreMeta({disabled: false, hasMore: hasMore, loading: false})
        })
        .catch(error => {
          setLoadMoreMeta({disabled: false, hasMore: true, loading: false});
        });
    }
  };

  const canLoadMore = () => {
    return !disableLoadMore && !loadMoreMeta.disabled && !loadMoreMeta.loading && loadMoreMeta.hasMore;
  };

  const loadMoreData = () => {
    if (onLoadMore) {
      // seem InfiniteScroll.hasMore not working properly, need another load more condition check here
      if (!canLoadMore()) {
        return;
      }
      setLoadMoreMeta({hasMore: true, loading: true});
      onLoadMore(items ? items[items.length - 1] : null)
        .then((hasMore) => {
          setLoadMoreMeta({disabled: false, hasMore: hasMore, loading: false})
        })
        .catch(error => {
          setLoadMoreMeta({disabled: false, hasMore: true, loading: false});
        });
    }
  };

  const renderLoadingItem = () => {
    if (!disableLoadMore && loadMoreMeta.loading) {
      return <div className="item-loading">
        <CircularProgress/>
      </div>
    }
  };

  let hasMore = canLoadMore();
  return (
    <div className="app-list">
      <InfiniteScroll
        pageStart={0}
        initialLoad={false}
        loadMore={loadMoreData}
        hasMore={hasMore}
        threshold={5}
        useWindow={false}>
        <List
          itemLayout="vertical"
          dataSource={items}
          renderItem={(item, index) => (
            <List.Item key={itemKey ? index : (item[itemKey] || index)}>
              {renderItem(item)}
            </List.Item>
          )}/>
        {renderLoadingItem()}
      </InfiniteScroll>
    </div>
  )
};

export default AppList;