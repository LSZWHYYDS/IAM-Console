/**
 */
/*jshint esversion: 6 */
import { Button, Checkbox, Form, Modal, Select } from 'antd';
import { Component } from 'react';

const Option = Select.Option,
  FormItem = Form.Item;

class AppInfoProfileAttrEdit extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      newAttr: Object.assign({}, this.props.oldAttr),
    };
    this.attr = {
      username: '用户名',
      nickname: '昵称',
      first_name: '名',
      last_name: '姓',
      email: '邮箱',
      name: '姓名',
      preferred_username: '别名',
      phone_number: '手机号',
      employee_number: '员工编号',
      gender: '性别',
      address: '地址',
      birthdate: '生日',
      cost_center: '结算中心',
      division: '分支结构',
      telephone_number: '座机号',
      title: '职位',
      user_code: '职位编号',
      manager: '上级经理',
      locale: '工作地',
      website: '个人主页',
      zoneinfo: '时区',
      sort_order: '排序号',
      picture: '头像',
      cert: '用户证书',
      tag: '静态标签',
      group: '组织结构',
      sub: '用户ID',
      type: '用户类型',
      email_verified: '邮箱已校验',
      phone_number_verified: '手机已校验',
      dynamic_tag: '动态标签',
      last_login: '上次登录时间',
      login_geo: '上次登录地理位置',
      profile: '用户资料URL',
      pwd_changed_time: '密码修改时间',
      pwd_expiration_time: '密码过期时间',
      created_mode: '创建模式',
      created_by: '创建者',
      created_at: '创建时间',
      updated_by: '更新者',
      updated_at: '更新时间',
      create_by: '创建者',
      create_time: '创建时间',
      update_by: '更新者',
      update_time: '更新时间',
      status: '状态',
      org_ids: '部门IDs',
      connector_type: '链接器类型',
      group_positions: '职位',
    };
  }
  // eslint-disable-next-line react/no-deprecated
  componentWillReceiveProps(nextProps) {
    if (nextProps.oldAttr) {
      //edit attr
      this.setState({
        newAttr: Object.assign({}, nextProps.oldAttr),
      });
    } else {
      //new attr
      this.setState({
        newAttr: Object.assign({}, { as_claim: false }),
      });
    }
  }

  onSelectChange(value) {
    const domain_name = value;
    const attr = this.props.optionalAttrs.find((ele) => ele.domain_name === domain_name);
    const canSetClaim = attr.as_claim; // whether this attr can be set as claim
    let newAttr = Object.assign(this.state.newAttr, { domain_name: value });
    if (!canSetClaim) {
      // if can't set as claim
      newAttr.as_claim = false;
    }
    this.setState({ newAttr });
  }

  handleAsClaim(event) {
    const value = event.target.checked;
    this.setState({
      newAttr: Object.assign(this.state.newAttr, { as_claim: value }),
    });
  }

  render() {
    let domain_name,
      display_name = null,
      as_claim = this.state.newAttr.as_claim;
    let asClaimDisabled = false;
    if (this.state.newAttr.domain_name) {
      domain_name = this.state.newAttr.domain_name;
      const attr = this.props.optionalAttrs.find((ele) => ele.domain_name === domain_name);
      display_name = this.attr[domain_name] || attr.display_name;
      as_claim = this.state.newAttr.as_claim;
      const canSetClaim = (attr && attr.as_claim) || false; // whether this attr can be set as claim
      if (!canSetClaim) {
        // if can't set as claim
        as_claim = false;
        asClaimDisabled = true;
      }
    }
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    const saveButtonEnabled =
      this.state.newAttr.domain_name && this.state.newAttr.as_claim !== undefined;

    const selectItem = (
      <Select
        style={{ width: '100%' }}
        value={domain_name}
        onChange={(value) => this.onSelectChange(value)}
        placeholder="请选择"
      >
        {domain_name && (
          <Option key={domain_name} title={display_name}>
            {display_name}
          </Option>
        )}
        {/* {this.props.availableAttrs.map((attr) => {
          return (
            <Option key={attr.domain_name} title={this.attr[attr.domain_name] || attr.display_name}>
              {this.attr[attr.domain_name] || attr.display_name}
            </Option>
          );
        })} */}
      </Select>
    );
    return (
      <div>
        <Modal
          title={this.state.newAttr.domain_name ? '编辑' : '新增'}
          closable={false}
          open={this.props.showModal}
          footer={[
            <Button
              key="cancel"
              size="large"
              onClick={() => {
                // this.props.switchModel();
                this.props.switchModal(false, null, null);
              }}
            >
              取消
            </Button>,
            <Button
              key="save"
              size="large"
              type="primary"
              disabled={!saveButtonEnabled}
              onClick={() => {
                this.props.switchModal(false, this.state.newAttr, this.props.oldAttr);
              }}
            >
              确定
            </Button>,
          ]}
        >
          <FormItem label="属性名" {...formItemLayout}>
            {selectItem}
          </FormItem>
          <FormItem label="是否写入ID Token中" {...formItemLayout}>
            <Checkbox
              checked={as_claim}
              disabled={asClaimDisabled}
              onChange={this.handleAsClaim.bind(this)}
            />
          </FormItem>
        </Modal>
      </div>
    );
  }
}

export default AppInfoProfileAttrEdit;
