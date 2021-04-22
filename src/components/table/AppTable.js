import React, { useState } from 'react';
import { Row, Col, Affix } from 'antd';
import { isEmpty, isFunction } from 'utils/helpers/helpers';
import './AppTable.scss';

const AppTable = (props) => {
  let {
    dataSource,
    columns,
    columnDataSource,
    itemsKey,
    groupKey,
    rowExpandable,
    groupExpandable,
    groupError,
    itemError,
    actionProviders
  } = props;
  dataSource = dataSource || [];
  columns = columns || [];
  actionProviders = actionProviders || {};
  let rowExpandableDisabled = isEmpty(rowExpandable);
  let groupExpandableDisabled = isEmpty(groupExpandable);
  let groupItemRowIndexes = new Set();
  let groupItemDisabled;

  let [tableBodyRef, setTableBodyRef] = useState(null);

  const initTableColumns = () => {
    let tableColumns = [];
    let hasRenderGroup = false;
    columns.forEach((column) => {
      let tableColumn = Object.assign({}, column);
      tableColumns.push({
        ...tableColumn,
        flex: column.width || column.colSpan || 1
      });
      hasRenderGroup = column.renderGroup;
    });
    groupItemDisabled = !groupKey && !hasRenderGroup;
    return tableColumns;
  };

  const initTableData = () => {
    if (!itemsKey) {
      return dataSource;
    }
    let tableData = [];
    dataSource.forEach((data) => {
      if (!groupItemDisabled) {
        tableData.push(data);
        groupItemRowIndexes.add(tableData.length - 1);
      }
      let items = data[itemsKey];
      if (items) {
        items.forEach((item) => {
          tableData.push(item);
        });
      }
    });
    return tableData;
  };

  const tableColumns = initTableColumns();
  const tableData = initTableData();

  const renderTableRow = (className, renderCells = () => {}) => {
    return <Row className={className}>{renderCells()}</Row>;
  };

  const renderTableCells = (className, item, rowIndex,
                            contentRender = (item, column, colIndex) => {}) => {
    return tableColumns.map((column, colIndex) => {
      return (
        <Col
          key={`col-${rowIndex}-${colIndex}`}
          className={className}
          flex={column.flex}
          style={{ justifyContent: column.align }}
        >
          {contentRender(item, column, colIndex)}
        </Col>
      );
    });
  };

  const renderTableHeaderRow = (columnDataSource, columns) => {
    return renderTableRow('header-row',
      () => renderTableCells('column-cell', columnDataSource, 0,
        (item, column) => {
          if (isFunction(column.title)) {
            return column.title(columnDataSource, actionProviders);
          }
          return column.title || column.dataIndex
        })
    );
  };

  const renderTableGroupItemContentCells = (item, rowIndex) => {
    return renderTableCells('group-item-content-cell', item, rowIndex,
      (item, column, colIndex) => {
        if (column.renderGroup) {
          return column.renderGroup(item, actionProviders);
        } else if (colIndex === 0) {
          return item[groupKey];
        }
      });
  };

  const renderTableGroupItemCells = (item, rowIndex) => {
    if (!groupExpandableDisabled && isExpandable(item, groupExpandable)) {
      return <Col span={24}>
        {
          renderTableRow('group-item-content-row',
            () => renderTableGroupItemContentCells(item, rowIndex))
        }
        {
          renderTableRow('group-item-expand-row',
            () => renderTableExpandCell('group-item-expand-cell', item, groupExpandable))
        }
      </Col>
    }
    return renderTableGroupItemContentCells(item, rowIndex);
  };

  const isExpandable = (item, config) => {
    return config &&
      config.expandable &&
      config.expandable(item) &&
      config.render;
  };

  const isGroupError = (item) => {
    return groupError? groupError(item) : false;
  };

  const isItemError = (item) => {
    return itemError? itemError(item) : false;
  };

  const renderTableItemContentCells = (item, rowIndex) => {
    return renderTableCells('item-content-cell', item, rowIndex,
      (item, column, colIndex) => {
        return column.render ? column.render(
          column.dataIndex ? item[column.dataIndex] : item,
          actionProviders
        ) : '';
      }
    );
  };

  const isRowExpandable = (item) => {
    return !rowExpandableDisabled &&
      rowExpandable.expandable &&
      rowExpandable.expandable(item) &&
      rowExpandable.render;
  };

  const renderTableExpandCell = (className, item, config) => {
    return <Col className={className} span={24}>
      {config.render(item, actionProviders)}
    </Col>
  };

  const renderTableItemCells = (item, rowIndex) => {
    if (groupItemRowIndexes.has(rowIndex)) {
      return renderTableGroupItemCells(item, rowIndex);
    }
    if (!rowExpandableDisabled && isExpandable(item, rowExpandable)) {
      return <Col span={24}>
        {
          renderTableRow('item-content-row',
            () => renderTableItemContentCells(item, rowIndex))
        }
        {
          renderTableRow('item-expand-row',
            () => renderTableExpandCell('item-expand-cell', item, rowExpandable))
        }
      </Col>
    }
    return renderTableItemContentCells(item, rowIndex);
  };

  const renderTableItemRows = (dataSource) => {
    return dataSource.map((data, rowIndex) => {
      if (groupItemRowIndexes.has(rowIndex)) {
        return <Affix key={`row-${rowIndex}`} target={() => tableBodyRef}>
          <Row className={`group-item-row ${isGroupError(data)? 'group-item-row-error' : ''}`}>
            {renderTableItemCells(data, rowIndex)}
          </Row>
        </Affix>
      } else {
        return <Row key={`row-${rowIndex}`} className={`item-row ${isItemError(data)? 'item-row-error' : ''}`}>
          {renderTableItemCells(data, rowIndex)}
        </Row>
      }
    });
  };

  return (
    <div className="app-table">
      <div className="table-header">
        {renderTableHeaderRow(columnDataSource, tableColumns)}
      </div>
      <div className="table-body" ref={setTableBodyRef}>
        {renderTableItemRows(tableData)}
      </div>
    </div>
  );
};

export default AppTable;