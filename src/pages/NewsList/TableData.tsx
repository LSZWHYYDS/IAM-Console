import React, { useRef, useState } from 'react';
import { Row, Col } from 'antd';
import { FileExcelOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import type { ActionType } from '@ant-design/pro-table';
import SearchBox from '@/components/SearchBox/index';
import { createQueryString, exportToCsv } from '@/utils/common.utils';

const TableData: React.FC<any> = (props) => {
  const [searchParams, setSearchParams] = useState({
    q: undefined,
  });
  const actionRef = useRef<ActionType>();
  const [pageSize, setPageSize] = useState(10);
  const onPageSize = (_value, pageSizeValue) => {
    setPageSize(pageSizeValue);
  };

  const onSearch = () => {
    if (actionRef.current) {
      actionRef.current.reload();
    }
  };
  const handleSearch = (searchKey: any) => {
    setSearchParams({
      ...searchParams,
      q: searchKey,
    });
    onSearch();
  };
  const getExportAPI = () => {
    return '/iam/api/auditlog/export'; //auditAPI.exportLog;
  };
  const handleExport = () => {
    const url = getExportAPI() + createQueryString(searchParams),
      filename = 'audit.csv';
    exportToCsv(url, filename);
  };
  const { apiFunc, hasExport } = props;
  return (
    <>
      <Row>
        <Col offset={14} span={10}>
          <SearchBox
            placeholder="请输入搜索内容"
            defaultSearchKey={searchParams && searchParams.q}
            onSearch={handleSearch}
            showSearchButton={false}
            minLength={0}
            showClear={true}
          />
        </Col>
        {hasExport && (
          <Col offset={1} span={1}>
            <button title="导出" onClick={handleExport} style={{ padding: '0' }}>
              <FileExcelOutlined />
            </button>
            <a id="exportLink" target="_blank" className="hidden" />
          </Col>
        )}
      </Row>
      <ProTable
        actionRef={actionRef}
        rowKey="id"
        className="minHeight"
        search={false}
        options={false}
        request={async (params: { pageSize: number; current: number }) => {
          const result = await apiFunc({
            ...searchParams,
            page: params.current,
            size: params.pageSize,
          });
          return {
            data: result.data.items,
            success: true,
            total: result.data.total,
          };
        }}
        columns={props.columns}
        pagination={{ pageSize, showSizeChanger: true, onChange: onPageSize }}
      />
    </>
  );
};
export default TableData;
