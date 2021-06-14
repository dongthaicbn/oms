import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Row, Col } from 'antd';
import { isEmpty, isFunction, isIPad } from 'utils/helpers/helpers';
import CircularProgress from '@material-ui/core/CircularProgress';
import './AppTable.scss';

const isIPadDevice = isIPad();
const TABLE_ITEM_SPACING_PX = 8;

const initTableColumns = (columns) => {
  columns = columns || [];
  let newTableColumns = [];
  columns.forEach((column) => {
    let tableColumn = Object.assign({}, column);
    if (column.width) {
      tableColumn['width'] = column.width;
    } else {
      tableColumn['flex'] = column.colSpan || 1;
    }
    newTableColumns.push(tableColumn);
  });
  return newTableColumns;
};

const initTableData = (dataSource, itemsKey) => {
  dataSource = dataSource || [];
  let newTableData = [];
  dataSource.forEach((data, index) => {
    let item = {
      ...data,
      _is_group: false,
      _index: index
    };
    newTableData.push(item);
    let childItems = [];
    if (itemsKey) {
      item._is_group = true;
      let items = data[itemsKey];
      if (items) {
        items.forEach((item, itemIndex) => {
          let childItem = {
            ...item,
            _is_group: false,
            _index: itemIndex,
            _group_index: index
          };
          childItems.push(childItem);
        });
      }
      item.items = childItems;
    }
  });
  return newTableData;
};

const AppTable = (props) => {
  let {
    dataSource,
    showLoading,
    columns,
    groupFilter,
    itemFilter,
    itemsKey,
    groupKey,
    noStickyGroup,
    rowExpandable,
    groupExpandable,
    groupExtendable,
    groupError,
    itemError,
    actionProviders,
    renderBottom
  } = props;

  actionProviders = actionProviders || {};

  let [tableHasScroll, setTableHasScroll] = useState(false);
  let [tableColumns, setTableColumns] = useState([]);
  let [tableData, setTableData] = useState([]);

  let tableBodyRef = React.createRef();
  let setTableBodyRef = useCallback((ref) => {
    tableBodyRef.current = ref;
    if (tableBodyRef.current) {
      setTableHasScroll(tableBodyRef.current.scrollHeight > tableBodyRef.current.clientHeight)
    }
  }, []);

  const isRowExpandableDisabled = () => {
    return isEmpty(rowExpandable);
  };

  const isGroupExpandableDisabled = () => {
    return isEmpty(groupExpandable);
  };

  const isGroupExtendableDisabled = () => {
    return isEmpty(groupExtendable);
  };

  useEffect(() => {
    setTableColumns(initTableColumns(columns));
  }, [columns]);

  useEffect(() => {
    setTableData(initTableData(dataSource, itemsKey));
  }, [dataSource]);

  useEffect(() => {
    if (tableBodyRef?.current) {
      setTableHasScroll(tableBodyRef.current.scrollHeight > tableBodyRef.current.clientHeight)
    }
  }, [tableData]);

  const renderTableRow = (className, renderCells = () => { }) => {
    return <Row className={className}>{renderCells()}</Row>;
  };

  const renderTableCells = (className, item,
                            contentRender = (item, column, colIndex) => { }) => {
    return tableColumns.map((column, colIndex) => {
      return (
        <Col
          key={`col-${colIndex}`}
          className={className}
          flex={column.flex}
          style={{ width: column.width, minWidth: column.minWidth, justifyContent: column.align, textAlign: column.align }}
        >
          {contentRender(item, column, colIndex)}
        </Col>
      );
    });
  };

  const renderTableGroupItemContentCells = (item) => {
    return (
      <Col className="group-item-content-cell"
           span={24}>
        {item[groupKey]}
      </Col>
    )
  };

  const renderTableGroupItemCells = (item) => {
    let isGroupExpandable = !isGroupExpandableDisabled() && isExpandable(item, groupExpandable);
    let isGroupExtendable = !isGroupExtendableDisabled() && isExtendable(item, groupExtendable);
    return <Col span={24}>
      <div className={`group-item-head-wrapper ${isGroupExtendable? 'half-border-round' : 'full-border-round'}`}>
        {
          renderTableRow('group-item-content-row',
            () => renderTableGroupItemContentCells(item))
        }
        {
          isGroupExpandable &&
          renderTableRow('group-item-expand-row',
            () => renderTableExpandCell('group-item-expand-cell', item, groupExpandable))
        }
      </div>
      {
        isGroupExtendable &&
        <div className="group-item-body-wrapper">
          {
            renderTableRow('group-item-extend-row',
              () => renderTableExpandCell('group-item-extend-cell', item, groupExtendable))
          }
        </div>
      }
    </Col>
  };

  const isExpandable = (item, config) => {
    return config &&
      config.expandable &&
      config.expandable(item) &&
      config.render;
  };

  const isExtendable = (item, config) => {
    return config &&
      config.extendable &&
      config.extendable(item) &&
      config.render;
  };

  const isGroupError = (item) => {
    return groupError ? groupError(item) : false;
  };

  const isItemError = (item) => {
    return itemError ? itemError(item) : false;
  };

  const renderTableItemContentCells = (item) => {
    return renderTableCells('item-content-cell', item,
      (item, column, colIndex) => {
        return column.render ? column.render(
          column.dataIndex ? item[column.dataIndex] : item,
          actionProviders
        ) : '';
      }
    );
  };

  const renderTableExpandCell = (className, item, config) => {
    return <Col className={className} span={24}>
      {config.render(item, actionProviders)}
    </Col>
  };

  const renderTableItemCells = (item) => {
    if (item._is_group) {
      return renderTableGroupItemCells(item);
    }
    if (!isRowExpandableDisabled() && isExpandable(item, rowExpandable)) {
      return <Col span={24}>
        {
          renderTableRow('item-content-row',
            () => renderTableItemContentCells(item))
        }
        {
          renderTableRow('item-expand-row',
            () => renderTableExpandCell('item-expand-cell', item, rowExpandable))
        }
      </Col>
    }
    return renderTableItemContentCells(item);
  };

  const renderTableHeaderRow = () => {
    return renderTableRow('header-row',
      () => renderTableCells('column-cell', null,
        (item, column) => {
          if (isFunction(column.title)) {
            return column.title(actionProviders);
          }
          return column.title || column.dataIndex
        })
    );
  };

  const renderTableGroupItemRow = (groupItem) => {
    let itemRows = groupItem.items.map((item, index) => (
      <Row key={`row-${groupItem._group_index}-${index}`}
           className={`item-row ${isItemError(item) ? 'item-row-error' : ''}`}>
        {renderTableItemCells(item)}
      </Row>
    ));
    return <>
      <Row className={`group-item-row ${isGroupError(groupItem) ? 'group-item-row-error' : ''} ${noStickyGroup ? '' : 'group-item-sticky'}`}>
        {renderTableItemCells(groupItem)}
      </Row>
      {itemRows}
    </>;
  };

  const renderTableBody = () => {
    if (showLoading) {
      return (
        <div className="table-progress-container">
          <CircularProgress/>
        </div>
      )
    }
    return (
      <div ref={setTableBodyRef}
           className={`table-body ${tableHasScroll ? 'content-scrollable' : ''}`}>
        {renderTableItemRows()}
        {renderBottom && renderBottom()}
      </div>
    );
  }

  const renderTableItemRows = () => {
    return tableData.map((item, index) => {
      if (item._is_group) {
        if (groupFilter? groupFilter(item) : true) {
          return (
            <div key={`group-${item._index}`}
                 className="group-item-container">
              {renderTableGroupItemRow(item)}
            </div>
          )
        }
      } else {
        if (itemFilter? itemFilter(item) : true) {
          return (
            <Row key={`row-${index}`} className={`item-row ${isItemError(item) ? 'item-row-error' : ''}`}>
              {renderTableItemCells(item)}
            </Row>
          )
        }
      }
    });
  };

  return (
    <div className={`app-table ${isIPadDevice? 'ipad-device' : ''}`}>
      <div className="table-header">
        {renderTableHeaderRow()}
      </div>
      {renderTableBody()}
    </div>
  );
};

export default AppTable;