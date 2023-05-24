import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { DeleteOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { showErrorMessage, showSuccessMessage, filterDangerousChars } from '@/utils/common.utils';
import PagerTable from '@/components/PagerTable';
import { unbindUserWithRole, getRoleBindingUsers } from '../../service';

class RoleBindingUserList extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      editScope: false,
      editingEntry: null,
    };
  }
  onRenderAvatar(text, entry) {
    const avatar = (
      <img
        src={entry.user.picture || `/uc/images/default-avatar.png`}
        style={{ verticalAlign: 'middle', width: '30px', height: '30px' }}
      />
    );
    return (
      <Link className="detail-link" to={'/home/rbacBindingsUserInfo/' + entry.user.username}>
        {avatar}
      </Link>
    );
  }
  onRenderName(text, entry) {
    const username = (
      <span style={{ display: 'inline-block', marginLeft: '10px' }} title={entry.user.username}>
        {entry.user.username}
      </span>
    );
    return (
      <Link className="detail-link" to={'/users/usersDetail?username=' + entry.user.username}>
        {username}
      </Link>
    );
  }
  onRenderScopes(text, entry) {
    return (
      entry.binding_scopes &&
      entry.binding_scopes.length && (
        <div>{entry.binding_scopes.map(this.renderOneScope.bind(this))}</div>
      )
    );
  }
  renderOneScope(scope) {
    return (
      scope && (
        <div key={scope.scope} title={scope.scope}>
          {scope.scope === '_null' ? '默认用户组' : scope.scope_description || scope.scope}
        </div>
      )
    );
  }

  onRenderActions(text, entry) {
    return (
      <div>
        {entry.user.created_mode !== 1 && (
          <Button
            icon={<DeleteOutlined />}
            shape="circle"
            title="删除"
            size="large"
            onClick={this.unboundUser.bind(this, entry)}
          />
        )}
      </div>
    );
  }

  refreshTable() {
    this.userTable.refresh({}, false);
  }
  initTable() {
    const cols = [
      {
        title: '',
        dataIndex: 'user.picture',
        key: 'picture',
        render: this.onRenderAvatar.bind(this),
      },
      {
        title: '姓名',
        dataIndex: 'user.username',
        key: 'username',
        render: this.onRenderName.bind(this),
      },
      {
        title: '账号',
        dataIndex: ['user', 'name'],
        key: 'name',
      },
      {
        title: 'email',
        dataIndex: ['user', 'email'],
        key: 'email',
      },
      {
        title: '电话',
        dataIndex: ['user', 'phone_number'],
        key: 'phone_number',
      },
    ];

    // if (this.props.hasScope) {
    //     cols.push({
    //         title: util.t("app.entitlement.user.tbl.cols.scope"),
    //         dataIndex: "binding_scopes",
    //         key: "binding_scopes",
    //         render: this.onRenderScopes.bind(this),
    //     });
    // }

    cols.push({
      title: '操作',
      key: 'actions',
      dataIndex: 'user.sub',
      render: this.onRenderActions.bind(this),
    });

    return cols;
  }
  componentDidMount() {
    filterDangerousChars();
  }
  editScope(entry) {
    this.setState({
      editScope: true,
      editingEntry: entry,
    });
  }

  cancelEditScope() {
    this.setState({
      editScope: false,
      editingEntry: null,
    });
    this.refreshTable();
  }
  unboundUser(entry) {
    const params = {
      client_id: this.props.clientId,
      role: this.props.role.name,
      username: [entry.user.username],
    };

    unbindUserWithRole(params).then(
      () => {
        showSuccessMessage();
        this.refreshTable();
      },
      (error) => {
        showErrorMessage(error);
      },
    );
  }

  render() {
    const propsValue = {
      client_id: this.props.clientId,
      role_name: this.props.role.name,
    };
    return (
      <div>
        <div className="row-container">
          <div className="col-left-container">
            <div>
              <PagerTable
                {...this.props}
                rowKey="user.sub"
                pageSize={100}
                api={getRoleBindingUsers}
                containerClassName="app-entitled-user-table"
                params={propsValue}
                columns={this.initTable()}
                showSelect={false}
                ref={(input) => {
                  this.userTable = input;
                }}
                style={{ height: '500px' }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
RoleBindingUserList.defaultProps = {
  hasScope: true, //can has scope
};
export default RoleBindingUserList;
