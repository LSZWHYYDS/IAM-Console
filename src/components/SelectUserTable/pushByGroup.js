import React, { Component } from 'react';
import { Col } from 'antd';
import { getUserList } from '@/services/userMgrAPI';
import UserGroupTree from '@/components/UserGroupTree';
import PagerTable from '@/components/PagerTable/index';

class PushByGroup extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      data: [],
      selectedKey: null,
      tableData: {},
      checkedKeys: [],
      checkedParrentKeys: [],
      userTotal: 0,
    };
    this.searchParams = this.props.searchParams || {};
    this.policyDetails = {};
  }
  onClickTreeNode = (key, e) => {
    if (!e || e.selected) {
      if (e) {
        if (key) {
          this.searchParams.org_id = key;
          this.setState({
            selectedKey: key,
          });
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
        this.refreshTable(this.searchParams);
      }
    }
  };
  initUserMgrTable = () => {
    return [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
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
  load = (...args) => {
    return getUserList(...args).then((res) => {
      this.setState({ tableData: res.data });
      return res;
    });
  };
  refreshTable = (searchParams) => {
    this.userTable.refresh(searchParams);
  };
  onCheckNode = (checkedKeys, checkedParrentKeys, userTotal) => {
    this.setState({ checkedKeys, checkedParrentKeys, userTotal });
  };
  getCheckedKeys = () => {
    const { checkedParrentKeys } = this.state;
    if (checkedParrentKeys.length === 1 && checkedParrentKeys[0] === '_root') {
      return ['-1'];
    }
    return this.state.checkedParrentKeys;
  };
  onRefUserTable = (ref) => {
    this.userTable = ref;
  };

  render() {
    return (
      <div
        style={{
          display: 'flex',
          // height: 'calc(100vh - 300px)',
          height: '561px',
        }}
      >
        <Col span={8}>
          <div
            style={{
              borderRight: '1px solid #F1F0EE',
            }}
          >
            <UserGroupTree
              defaultGroup
              linkerGroup={true}
              showCheckedTip={true}
              showUserCount={true}
              maxHeight={'390px'}
              ref={(input) => {
                this.groupTree = input;
              }}
              selectedKey={this.state.selectedKey}
              defaultSelectedKey={this.state.selectedKey || this.props.defaultSelectedKey}
              onClickTreeNode={this.onClickTreeNode.bind(this)}
              onCheckNode={this.onCheckNode.bind(this)}
              defaultCheckedKeys={this.state.checkedGroups || this.props.defaultCheckedKeys}
              checkStrictly={this.props.checkStrictly}
            />
          </div>
        </Col>
        <Col span={16}>
          <div style={{ width: '100%', marginLeft: '20px' }}>
            <PagerTable
              style={{
                margin: '0',
                padding: '0',
                height: 'calc(100% - 30px)',
              }}
              {...this.props}
              rowKey="username"
              api={this.load.bind(this)}
              columns={this.initUserMgrTable()}
              defaultSearchParams={this.searchParams}
              selectedKey="selected"
              onRef={this.onRefUserTable}
            />
          </div>
        </Col>
      </div>
    );
  }
}

export default PushByGroup;
