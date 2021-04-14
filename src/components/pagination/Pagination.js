import React from 'react';
import { Pagination } from 'antd';

const PaginationTable = ({ totalElements, onChange, page, size }) => {
  return (
    <div className="pagination-table">
      <Pagination
        current={page + 1}
        pageSize={size}
        total={totalElements || 0}
        showTotal={(total, range) =>
          total > 0
            ? `${range[0]}-${range[1]} của ${total} phần tử`
            : `${range[1]}-${range[1]} của ${total} phần tử`
        }
        showSizeChanger
        onShowSizeChange={onChange}
        onChange={onChange}
        pageSizeOptions={['10', '20', '50']}
      />
    </div>
  );
};

export default PaginationTable;
