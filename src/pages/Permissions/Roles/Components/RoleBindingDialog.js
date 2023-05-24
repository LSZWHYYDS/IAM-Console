import React, { Component } from 'react';
import { Modal } from 'antd';
import { filterDangerousChars } from '@/utils/common.utils';
import RoleBindingUserComponent from './RoleBindingUserComponent';
import { bindUserWithRole } from '@/pages/Permissions/service';

class RoleBindingDialog extends Component {
  constructor(...args) {
    super(...args);
    this.clientId = this.props.clientId || 'usercenter';
    this.role = this.props.role;
  }

  componentDidMount() {
    filterDangerousChars();
  }
  render() {
    const title = '绑定管理员' + (this.props.role && ':' + this.props.role.name);
    return (
      <Modal
        title={title}
        style={{ top: '5px' }}
        open={this.props.show}
        destroyOnClose
        onCancel={this.props.onClose}
        width="900px"
        footer={null}
      >
        <RoleBindingUserComponent clientId={this.clientId} role={this.props.role} />
      </Modal>
    );
  }
}

RoleBindingDialog.defaultProps = {
  showBindingUser: true,
  showBindingOrg: true,
  showBindingTag: true,
};
export default RoleBindingDialog;
