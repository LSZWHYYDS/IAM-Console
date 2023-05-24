/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-param-reassign */
import React, { Component } from 'react';
import { Table } from 'antd';
import { showErrorMessage } from '@/utils/common.utils.ts';
// todo 后面重构为ts

class PagerTable extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      data: [],
      requestParams: this.props.defaultSearchParams,
      showSelect: this.props.showSelect,
      currentPage: this.props.currentPage || 1,
      selectedRows: [],
      selectedRowKeys: this.props.selectedRowKeys || [],
    };
    this.pagination = {
      showSizeChanger: true,
      showTotal: (total) => `共${total}条记录`,
      pageSize: this.props.pageSize || 10,
      pageSizeOptions: ['10', '20', '30', '40', '50', '100'],
    };
    this.rowSelection = null;
    this.selectedRows = [];
  }
  setSelectedRowKeys = (selectedRowKeys) => {
    if (this.props.onSelect) {
      this.props.onSelect(selectedRowKeys);
    }
    this.setState({
      selectedRowKeys,
    });
  };
  getData(params, isRefresh, api) {
    if (params && params.application_type) {
      const lowerCase = params.application_type;
      params.application_type = lowerCase.toUpperCase();
    }
    this.api = api;
    params = { ...params, ...this.props.params } || {};
    for (const i in params) {
      if (params.hasOwnProperty(i)) {
        if (params[i] === '' && params[i] === null) {
          delete params[i];
        }
      }
    }
    // eslint-disable-next-line react/no-direct-mutation-state
    this.state.requestParams = params;
    params.page = this.pagination.current;
    params.size = this.pagination.pageSize || 10;
    const tableApi = this.api || this.props.api;
    this.setState({ currentPage: this.pagination.current });
    tableApi(params).then((response) => {
      if (response.data) {
        const dataRegroup = [];
        if (response.data.length) {
          response.data.forEach((ele, index) => {
            dataRegroup[index] = { ...ele, ...ele.config };
          });
        }
        this.pagination.total = response.data.total;
        const states = {
          data: response.data.length ? dataRegroup : response.data.items,
          currentPage: this.pagination.current,
        };
        if (isRefresh) {
          states.selectedRows = [];
          states.selectedRowKeys = [];
          this.props.onSelect && this.props.onSelect([], []);
        }
        if (this._isMounted) {
          this.setState(states, () => {
            if (this.props.selectedKey) {
              const selectedRows = states.data.filter((x) => {
                if (x[this.props.selectedKey]) {
                  return x;
                }
              });
              const selectedRowKeys = selectedRows.map((y) => {
                return y[this.props.rowKey];
              });
              if (selectedRows.length > 0 && typeof this.props.onSelect === 'function') {
                this.props.onSelect(selectedRowKeys, selectedRows);
              }
            }
          });
        }
      } else if (response.data && response.data.message) {
        showErrorMessage(response.data.message);
      }
    });
  }
  clean() {
    this.setState({ data: [] });
  }
  refresh(params, keepSelected, api) {
    this.setState({
      currentPage: 1,
    });
    this.pagination.current = 1;
    this.getData(params || this.state.requestParams, !keepSelected, api);
  }
  componentDidMount() {
    const { onRef } = this.props;
    if (typeof onRef === 'function') {
      onRef(this);
    }
    this._isMounted = true;
    if (this.props.api && !this.props.preventInitLoad) {
      this.getData(this.state.requestParams);
    }
    this.props.onMounted && this.props.onMounted();
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  handleTableChange = (pagination) => {
    this.pagination = { ...this.pagination, ...pagination };
    this.getData(this.state.requestParams, !this.props.keepSelected, this.api);
  };
  render() {
    if (this.state.showSelect) {
      this.rowSelection = {
        type: this.props.selectType || 'checkbox',
        selectedRowKeys: this.state.selectedRowKeys,
      };
    }
    this.pagination.current = this.state.currentPage;

    const getRowKey = (row) => {
      if (this.props.rowKey) {
        const names = this.props.rowKey.split('.');
        let key = row;

        for (const k of names) {
          if (key[k]) {
            key = key[k];
          } else {
            return row.id;
          }
        }
        return key;
      }
      return row.id;
    };
    const customStyle = {
      overflow: 'auto',
      ...this.props.style,
    };

    return (
      <div className={this.props.containerClassName} style={customStyle}>
        <Table
          // bordered
          onRowMouseEnter={this.props.onRowMouseEnter}
          onRowMouseLeave={this.props.onRowMouseLeave}
          rowKey={(record) => getRowKey(record)}
          columns={this.props.columns}
          scroll={this.props.scroll}
          dataSource={this.state.data}
          pagination={!this.props.hidePagination && this.pagination}
          className={this.props.className}
          rowClassName={this.props.rowClassName}
          // rowSelection={this.rowSelection}
          onChange={this.handleTableChange.bind(this)}
          rowSelection={{
            selectedRowKeys: this.state.selectedRowKeys,
            preserveSelectedRowKeys: true,
            onChange: this.setSelectedRowKeys,
          }}
        />
      </div>
    );
  }
}
PagerTable.defaultProps = {
  containerClassName: 'pager-table', // container div class name.
};
export default PagerTable;
