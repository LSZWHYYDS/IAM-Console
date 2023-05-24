import React, { Component } from 'react';
import { Row, Col, Button } from 'antd';
import { UsergroupAddOutlined } from '@ant-design/icons';
import { showSuccessMessage, filterDangerousChars } from '@/utils/common.utils';
import IncsearchUser from '@/components/IncsearchUser';
import RoleBindingUserList from './RoleBindingUserList';
import { bindUserWithRole } from '@/pages/Permissions/service';

class RoleBindingUserComponent extends Component {
  constructor(...args) {
    super(...args);
    this.clientId = this.props.clientId;
    this.role = this.props.role;
    this.state = {
      new_user_selected: false,
    };
  }

  componentDidMount() {
    filterDangerousChars();
    this.setState({});
  }
  //on new user selected
  onNewUserSelected(value) {
    this.setState({
      new_user_selected: value,
    });
  }
  //bind user
  bindUser() {
    const selections = this.incsearchUser.getSelections(),
      userIds = selections ? selections.map((e) => e.key) : [],
      params = {
        client_id: this.clientId,
        role: this.props.role.name,
      },
      payload = {
        binding_scopes: [],
        targets: userIds,
      };
    bindUserWithRole(params, payload).then(() => {
      showSuccessMessage();
      this.incsearchUser.clearSelections();
      this.setState({
        new_user_selected: false,
      });
      this.bindingUserList.refreshTable();
    });
  }
  render() {
    const { new_user_selected } = this.state;
    return (
      <div className="scrollable-div">
        <Row>
          <Col span={22}>
            <IncsearchUser
              optionKey="username"
              onChange={this.onNewUserSelected.bind(this)}
              ref={(input) => {
                this.incsearchUser = input;
              }}
            />
          </Col>
          <Col span={1}>
            <Button
              icon={<UsergroupAddOutlined />}
              size="large"
              disabled={!new_user_selected || new_user_selected.length === 0}
              onClick={this.bindUser.bind(this)}
              shape="circle"
            />
          </Col>
        </Row>
        <Row>
          <Col span={22}>
            <RoleBindingUserList
              ref={(input) => {
                this.bindingUserList = input;
              }}
              clientId={this.clientId}
              role={this.props.role}
              hasScope={this.props.hasScope}
            />
          </Col>
        </Row>
      </div>
    );
  }
}
RoleBindingUserComponent.defaultProps = {
  hasScope: true, //can has scope
};
export default RoleBindingUserComponent;
