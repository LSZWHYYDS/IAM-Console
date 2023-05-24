// /* eslint-disable no-plusplus */
// /* eslint-disable no-param-reassign */
// /* eslint-disable no-restricted-syntax */
// /* eslint-disable array-callback-return */
/* props: 
policyId
pushDialogShow：是否可见p
onCloseDlg：成功 和取消时回调
*/

import React, { Component } from 'react';
import { Button, Select, Tabs, Modal, Row, Col } from 'antd';
import { showErrorMessage, requestMsg } from '@/utils/common.utils.ts';
import UserGroupTree from '@/components/UserGroupTree';
import { getUserList } from '@/services/userMgrAPI.ts';
import SearchBox from '@/components/SearchBox/index';
import PagerTable from '@/components/PagerTable';
import { getUsers, pushPolicy } from '@/pages/PolicyCenter/service';

const { Option } = Select;
const { TabPane } = Tabs;

class SelectUserTable extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      userOption: null,
      selectUsers: [],
      selectedKey: null,
      tableData: {},
      delRowNum: 0,
      selectedRowKeys: [],
    };
    this.searchParams = this.props.searchParams || {};
    this.delRowKeys = {};
  }

  componentDidMount() {
    this.getUsers();
  }

  getUsers = () => {
    getUsers().then((response) => {
      if (response.code === '0') {
        const userArr = [];
        const data = response.data.items;
        data.map((item) => {
          userArr.push(<Option key={item.id}>{item.name}</Option>);
        });
        this.setState({
          userOption: userArr,
        });
      }
    });
  };

  handlePushOk = () => {
    const arry = [];
    for (const key in this.delRowKeys) {
      if (this.delRowKeys[key]) {
        arry.push(key);
      }
    }
    const { selectedRowKeys } = this.state;
    this.props.onSave(selectedRowKeys);
  };

  handlePushCancel = () => {
    this.setState({
      selectedKey: '',
    });
    this.props.onCloseDlg();
  };

  handleSelectChange = (value) => {
    this.setState({
      selectUsers: value,
    });
  };
  onClickTreeNode = (key, e) => {
    if (!e || e.selected) {
      if (e) {
        if (key) {
          this.searchParams.org_id = key;
          this.setState({
            selectedKey: key,
          });
          this.delRowKeys = {};
        } else {
          delete this.searchParams.org_id;
        }
        this.refreshTable(this.searchParams);
      }
      if (key === '_root') {
        this.searchParams.org_id = key;
        this.setState({
          selectedKey: key,
        });
        this.delRowKeys = {};
        this.refreshTable(this.searchParams);
      }
    }
  };

  load = (...args) => {
    return getUserList(...args).then((res) => {
      this.delRowKeys = {};
      res.data.items.map((item) => {
        if (this.delRowKeys[item.sub]) {
          item.selected = false;
        } else {
          item.selected = true;
        }
      });
      this.setState({ tableData: res.data });
      return res;
    });
  };

  initUserMgrTable = () => {
    return [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        width: 80,
      },
      {
        title: '账号',
        dataIndex: 'username',
        key: 'username',
      },
      {
        title: 'email',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: '手机号',
        dataIndex: 'phone_number',
        key: 'phone_number',
      },
    ];
  };
  onSearch = (value) => {
    this.searchParams.q = value;
    this.refreshTable(this.searchParams);
  };
  refreshTable = (searchParams) => {
    this.userTable.refresh(searchParams);
  };

  filterRowKeys = (x, y) => {
    const val = {};
    y.map((item) => {
      if (x.includes(item.sub)) {
        val[item.sub] = false;
      } else {
        val[item.sub] = true;
      }
    });
    return val;
  };

  handleRowSelect = (selectedRowKeys) => {
    if (!this.state.tableData.items) {
      return;
    }
    const del = this.filterRowKeys(selectedRowKeys, this.state.tableData.items);
    this.delRowKeys = Object.assign(this.delRowKeys, del);
    let x = 0;
    for (const key in this.delRowKeys) {
      if (this.delRowKeys[key]) {
        x++;
      }
    }
    this.setState({
      delRowNum: x,
      selectedRowKeys,
    });
  };
  getUserDiv = () => {
    const { showUserCount } = this.props;
    return (
      <div
        style={{
          display: 'flex',
          // height: 'calc(100vh - 300px)',
          height: '561px',
        }}
      >
        <div
          style={{
            borderRight: '1px solid #F1F0EE',
            width: '400px',
            overflow: 'auto',
          }}
        >
          <UserGroupTree
            defaultGroup
            showUserCount={showUserCount === undefined || showUserCount}
            ref={(input) => {
              this.groupTree = input;
            }}
            selectedKey={this.state.selectedKey}
            defaultSelectedKey={this.state.selectedKey || this.props.defaultSelectedKey}
            onClickTreeNode={this.onClickTreeNode}
            linkerGroup={this.props.linkerGroup}
            defaultCheckedKeys={this.props.defaultCheckedKeys}
            checkStrictly={this.props.checkStrictly}
          />
        </div>
        <div style={{ width: '100%', marginLeft: '20px' }}>
          <Row>
            <Col span={12}>
              已选择 <span style={{ color: '#308AF3' }}>{this.state.selectedRowKeys.length}</span>{' '}
              个用户
            </Col>
            <Col span={12}>
              <SearchBox
                placeholder="请输入账号、手机号码"
                defaultSearchKey={this.searchParams && this.searchParams.q}
                onSearch={this.onSearch}
              />
            </Col>
          </Row>
          <div
            style={{
              margin: '0',
              padding: '0',
              height: 'calc(100% - 30px)',
            }}
          >
            <PagerTable
              style={{
                margin: '0',
                padding: '0',
                height: 'calc(100% - 30px)',
              }}
              {...this.props}
              rowKey="username"
              api={this.load}
              columns={this.initUserMgrTable()}
              defaultSearchParams={this.searchParams}
              showSelect
              hidePagination={false}
              selectedKey="selected"
              onSelect={this.handleRowSelect}
              onRef={(ref) => {
                this.userTable = ref;
              }}
            />
          </div>
        </div>
      </div>
    );
  };
  getPushButton = () => {
    const { selectedRowKeys } = this.state;
    const canPush = selectedRowKeys.length;
    return (
      <div className="mt-30" style={{ textAlign: 'right' }}>
        <Button
          type="primary"
          htmlType="submit"
          className="ml-10 fs-16"
          disabled={!canPush}
          onClick={this.handlePushOk}
        >
          确定
        </Button>
        <Button type="ghost" className="ml-10 fs-16" onClick={this.handlePushCancel}>
          关闭
        </Button>
      </div>
    );
  };
  render() {
    const { dialogShow, title = '选择用户' } = this.props;
    return (
      <Modal open={dialogShow} width="1200px" title={title} footer={null} closable={false}>
        {this.getUserDiv()}

        {this.getPushButton()}
      </Modal>
    );
  }
}

export default SelectUserTable;
