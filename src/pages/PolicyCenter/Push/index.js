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
import { Button, Select, Tabs, Modal, Row, Col, message } from 'antd';
import { showErrorMessage, requestMsg } from '@/utils/common.utils.ts';
import UserGroupTree from '@/components/UserGroupTree';
import { getUserListWithSub } from '@/services/userMgrAPI.ts';
import SearchBox from '@/components/SearchBox/index';
import PagerTable from '@/components/PagerTable';
import PushByGroup from './pushByGroup';
import { getUsers, pushPolicy } from '../service';

const { Option } = Select;
const { TabPane } = Tabs;
class Push extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      userOption: null,
      selectUsers: [],
      selectedKey: null,
      tableData: {},
      delRowNum: 0,
      selectedRowKeys: [],
      selectedTabKey: 'dept',
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
    const id = this.props.policyId;
    const arry = [];
    for (const key in this.delRowKeys) {
      if (this.delRowKeys[key]) {
        arry.push(key);
      }
    }
    const { selectedTabKey, selectedRowKeys } = this.state;
    const params = {
      groups: (selectedTabKey === 'dept' && this.pushByGroupRef.getCheckedKeys()) || undefined,
      userLoginIds: (selectedTabKey === 'user' && selectedRowKeys) || undefined,
    };
    if (selectedTabKey === 'dept' && !params.groups) {
      showErrorMessage('请选择下面的部门。');
      return;
    }
    if (selectedTabKey === 'dept' && params.groups.length > 300) {
      showErrorMessage('选择部门超出限制了（最多300个），请分批下发。');
      return;
    }
    pushPolicy(id, params).then((response) => {
      requestMsg(response);
      if (response.code === '0') {
        this.setState({
          selectedRowKeys: [],
        });
        this.props.onCloseDlg();
      } else {
        message.error('操作失败。');
      }
    });
  };

  handlePushCancel = () => {
    this.setState({
      selectedKey: '',
      selectedRowKeys: [],
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
            // selectedRowKeys: [],
          });
          this.delRowKeys = {};
        } else {
          delete this.searchParams.org_id;
        }
        this.userTable.setSelectedRowKeys(this.state.selectedRowKeys);
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
    return getUserListWithSub(...args).then((res) => {
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
    this.userTable.refresh(searchParams, true);
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
    // const merged = _.uniq(_.concat(this.state.selectedRowKeys, selectedRowKeys));
    const merged = _.uniq(_.concat(selectedRowKeys));
    this.setState({
      delRowNum: x,
      selectedRowKeys: merged,
    });
  };
  getUserDiv = () => {
    return (
      <div
        style={{
          display: 'flex',
          // height: 'calc(100vh - 100px)',
          height: '750px',
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
            showUserCount={true}
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
              // height: 'calc(100% - 10px)',
            }}
          >
            <PagerTable
              style={{
                margin: '0',
                padding: '0',
                // height: 'calc(100% - 10px)',
                height: '730px',
              }}
              {...this.props}
              rowKey="username"
              api={this.load}
              keepSelected={true}
              columns={this.initUserMgrTable()}
              defaultSearchParams={this.searchParams}
              showSelect
              hidePagination={false}
              // selectedKey="selected"
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
  onTabChanged = (selectedTabKey) => {
    this.setState({
      selectedTabKey,
    });
  };
  getPushButton = () => {
    const { selectedRowKeys, selectedTabKey } = this.state;
    const canPush =
      selectedTabKey === 'dept' || (selectedTabKey === 'user' && selectedRowKeys.length);
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
    const { selectedTabKey } = this.state;
    const { pushDialogShow } = this.props;
    return (
      <Modal
        open={pushDialogShow}
        width="1200px"
        title="选择下发范围"
        footer={null}
        closable={false}
        destroyOnClose
        style={{ top: 10 }}
      >
        <Tabs defaultActiveKey={selectedTabKey} onChange={this.onTabChanged}>
          <TabPane tab="按部门下发" key="dept">
            <PushByGroup
              ref={(ref) => {
                this.pushByGroupRef = ref;
              }}
            />
          </TabPane>
          <TabPane tab="按用户下发" key="user">
            {this.getUserDiv()}
          </TabPane>
        </Tabs>

        {this.getPushButton()}
      </Modal>
    );
  }
}

export default Push;
