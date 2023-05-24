/*jshint esversion: 6 */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { PlusOutlined, DeleteOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { filterDangerousChars, showErrorMessage, showSuccessMessage } from '@/utils/common.utils';
import PagerTable from '@/components/PagerTable';
import tagAPI from '../tagAPI';
import { Button, Row, Col, Input, Space } from 'antd';
import SearchBox from '@/components/SearchBox/index';
import IncsearchUser from '@/components/IncsearchUser';
import SelectUserTable from '@/components/SelectUserTable/index';
// import SearchUser from '@/components/SearchUser';

const { Search } = Input;

class TagUserList extends Component {
  constructor(...args) {
    super(...args);
    this.searchRef = React.createRef();
    this.state = {
      new_user_selected: false,
      userDlgVisible: false,
      searchParams: {
        q: undefined,
      },
    };
  }
  onNewUserSelected(value) {
    this.setState({
      new_user_selected: value,
    });
  }
  //bind user
  addUsersTag() {
    const selections = this.incsearchUser.getSelections(),
      userIds = selections ? selections.map((e) => e.key) : [],
      name = this.props.name,
      payload = {
        usernames: userIds,
      };
    tagAPI.addUsersTag(name, payload).then(() => {
      showSuccessMessage();

      //clear user selections
      this.incsearchUser.clearSelections();
      this.setState(
        {
          new_user_selected: false,
          searchParams: {
            q: null,
          },
        },
        this.refreshTable,
      );
    });
  }

  removeUserTag(entry) {
    const name = this.props.name;
    const params = {
      username: entry.username,
    };

    tagAPI.removeUserTag(name, params).then(
      () => {
        showSuccessMessage();
        this.refreshTable();
      },
      (error) => {
        showErrorMessage(error);
      },
    );
  }

  onRenderAvatar(text, entry) {
    const avatar = (
      <img
        src={entry.picture || `/uc/images/default-avatar.png`}
        style={{ verticalAlign: 'middle', width: '30px', height: '30px' }}
      />
    );
    return avatar;
  }

  onRenderName(text, entry) {
    const username = (
      <span style={{ display: 'inline-block', marginLeft: '10px' }} title={entry.username}>
        {entry.username}
      </span>
    );
    return (
      <Link className="detail-link" to={'/home/userInfo/' + entry.username}>
        {username}
      </Link>
    );
  }

  onRenderActions(text, entry) {
    return (
      <div>
        <Button
          icon={<DeleteOutlined />}
          shape="circle"
          title="删除"
          onClick={this.removeUserTag.bind(this, entry)}
        />
      </div>
    );
  }

  refreshTable() {
    const { searchParams } = this.state;
    this.userTable.refresh(searchParams, false);
  }
  initTable() {
    const cols = [
      {
        title: '',
        dataIndex: 'picture',
        key: 'picture',
        render: this.onRenderAvatar.bind(this),
      },
      {
        title: '用户名',
        dataIndex: 'username',
        key: 'username',
        // render: this.onRenderName.bind(this),
      },
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: '手机',
        dataIndex: 'phone_number',
        key: 'phone_number',
      },
    ];

    cols.push({
      title: '操作',
      key: 'actions',
      dataIndex: 'username',
      render: this.onRenderActions.bind(this),
    });

    return cols;
  }
  componentDidMount() {
    this.props.onRef(this);
    filterDangerousChars();
  }
  addUsersByGroup = () => {
    this.setState({
      userDlgVisible: true,
    });
  };
  onCloseUserDlg = () => {
    this.setState({
      userDlgVisible: false,
    });
  };
  onSelectedUser = (userIds) => {
    const name = this.props.name,
      payload = {
        usernames: userIds,
      };
    return tagAPI.addUsersTag(name, payload).then(() => {
      showSuccessMessage();
      if (this.searchRef.current) {
        //this.searchRef.current.setValue('');todo
      }
      this.setState(
        {
          searchParams: {
            q: '',
          },
        },
        this.refreshTable,
      );
      this.onCloseUserDlg();
    });
  };
  handleSearch = (values) => {
    this.setState(
      {
        searchParams: {
          q: values,
        },
      },
      () => {
        this.refreshTable();
      },
    );
  };
  render() {
    const { selUserTitle } = this.props;
    const { new_user_selected, userDlgVisible, searchParams } = this.state;
    const params = {
      name: this.props.name,
    };
    return (
      <div>
        {
          <Row justify="end" style={{ marginBottom: '10px' }}>
            <Col span={8}>
              <Search
                placeholder="请输入用户名、手机号"
                allowClear={true}
                maxLength={50}
                minLength={0}
                ref={this.searchRef}
                defaultValue={searchParams && searchParams.q}
                onSearch={this.handleSearch}
              />
            </Col>

            <Col span={2}>
              <Space>
                <Button
                  icon={<UsergroupAddOutlined />}
                  type="primary"
                  style={{ marginLeft: '10px' }}
                  onClick={this.addUsersByGroup.bind(this)}
                >
                  添加用户
                </Button>
                <SelectUserTable
                  dialogShow={userDlgVisible}
                  showUserCount={false}
                  title={selUserTitle}
                  onSave={this.onSelectedUser}
                  onCloseDlg={this.onCloseUserDlg}
                />
              </Space>
            </Col>
          </Row>
        }
        <Row>
          <Col span={24}>
            <div className="row-container">
              <div className="col-left-container">
                <div>
                  <PagerTable
                    {...this.props}
                    rowKey="username"
                    pageSize={20}
                    api={tagAPI.getTagUsers}
                    containerClassName="app-entitled-user-table"
                    params={params}
                    columns={this.initTable()}
                    showSelect={false}
                    ref={(input) => {
                      this.userTable = input;
                    }}
                  />
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
export default TagUserList;
