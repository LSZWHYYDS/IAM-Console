import React, { Component } from 'react';
import { Button, Checkbox, Col, Row, Table, Modal } from 'antd';
import { filterDangerousChars } from '@/utils/common.utils';
import extendedAttrAPI from '../../extendedAttrAPI';
import AppInfoProfileAttrEdit from './AppInfoProfileAttrEdit';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getAppInfo } from '../../../service';
import _ from 'lodash';
class AppInfoProfile extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      optionalAttrs: [],
      profileAttrs: [],
      oldAttr: null,
      showModal: false,
      requiredAttr: [],
      showDelModal: false,
      currRecord: null,
    };
    this.requiredFields = ['id', 'name'];
    this.switchModal = this.switchModal.bind(this);
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
    this.saveTableRef = React.createRef(null);
  }

  handleGetAppInfo = async () => {
    if (new URL(window.location.href)?.searchParams.get('client_id')) {
      await getAppInfo({
        client_id: new URL(window.location.href)?.searchParams.get('client_id'),
      }).then(async (res) => {
        if (res) {
          const defaultSubOrUsernameData = [];
          this.state.optionalAttrs.filter((filIs, filIx) => {
            if (filIs.domain_name === 'sub' || filIs.domain_name === 'username') {
              let temporary = { ...filIs };
              temporary.claim_name = filIs.domain_name;
              temporary.fix_value = '--';
              defaultSubOrUsernameData.push(temporary);
            }
          });
          const filterArr = defaultSubOrUsernameData
            ?.concat(res?.user_profile_detail?.domains)
            .filter((item) => item);
          const duplicateRemove = _.uniqBy(filterArr, 'claim_name');
          this.setState({
            profileAttrs: duplicateRemove || [],
          });
          this.saveTableRef.current = duplicateRemove || [];
        }
      });
    }
  };

  async componentDidMount() {
    await filterDangerousChars();
    await this.handleGetAppInfo();
    let params = { page: 1, size: 100, as_profile: true };
    extendedAttrAPI.getAttrList(params).then((response) => {
      if (response.data) {
        const claimAttrs = [...response.data.items];
        const requiredAttr = [];
        claimAttrs.forEach((item) => {
          if (item.domain_name === 'sub' || item.domain_name === 'username') {
            let temporary = { ...item };
            temporary.claim_name = item.domain_name;
            temporary.fix_value = '--';
            requiredAttr.push(temporary);
          }
        });
        this.setState({
          optionalAttrs: claimAttrs,
        });
        if (!this.state.profileAttrs.length) {
          this.setState({
            profileAttrs: _.compact(
              _.unionBy(
                requiredAttr.concat(this.props?.appDetail?.config?.user_profile?.domains),
                'domain_name',
              ),
            ),
          });
          this.saveTableRef.current = requiredAttr;
        }
      }
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // if (Object.prototype.toString.call(this.state.profileAttrs) !== Object.prototype.toString.call(nextProps.appDetail) && this.state.isMounted) {
    //    this.setState({
    //       profileAttrs: nextProps.appDetail?.config?.user_profile?.domains,
    //    });
    // }
  }

  switchModal(show, newAttr, oldAttr) {
    if (newAttr) {
      newAttr.as_claim = true;
      const profileAttrs = [...this.state.profileAttrs];
      if (oldAttr) {
        //replace attr with new Attr
        profileAttrs.forEach(function (item, i) {
          if (item.domain_name === oldAttr.domain_name) {
            profileAttrs[i] = Object.assign({}, profileAttrs[i], newAttr);
          }
        });
      } else {
        //insert new Attr
        profileAttrs.push(newAttr);
      }
      this.setState({
        profileAttrs: profileAttrs,
        showModal: show,
        oldAttr: null,
      });
      this.saveTableRef.current = profileAttrs;
    } else {
      this.setState({
        showModal: show,
        oldAttr: oldAttr,
      });
    }
  }

  deleteProfileAttr() {
    const { domain_name } = this.state.currRecord;
    const profileAttrs = this.state.profileAttrs.filter((attr) => attr.domain_name !== domain_name);
    this.setState({
      profileAttrs,
      showDelModal: false,
    });
    this.saveTableRef.current = profileAttrs;
  }

  showDelDialog(record) {
    this.setState({
      showDelModal: true,
      currRecord: record,
    });
  }

  hideDelDialog() {
    this.setState({
      showDelModal: false,
      currRecord: null,
    });
  }

  onGetSaveValue() {
    return {
      domains: this.saveTableRef.current?.map?.((item, index) => {
        const { as_claim, domain_name, claim_name, fix_value } = item;
        return {
          as_claim,
          domain_name,
          claim_name,
          fix_value,
          sort_order: index,
        };
      }),
    };
  }

  initTable() {
    const optionalAttrs = this.state.optionalAttrs;
    return [
      {
        title: '属性名',
        key: 'display_name',
        width: '20%',
        render: (text, record) => {
          const { domain_name } = record;
          let attr = optionalAttrs?.find((ele) => ele?.domain_name === record?.domain_name);
          if (attr) {
            const nameToDisplay = this.attr[domain_name] || attr?.display_name;
            return <div>{nameToDisplay}</div>;
          } else {
            return <div>{domain_name}</div>;
          }
        },
      },
      // {
      //    title: '是否写入ID Token中',
      //    dataIndex: 'as_claim',
      //    key: 'as_claim',
      //    width: '20%',
      //    render: (text, record) => <Checkbox checked={record.as_claim} disabled />,
      // },
      {
        title: '声明名称',
        key: 'claim_name',
        width: '20%',
        render: (text, record) => {
          return <div>{record?.claim_name}</div>;
        },
      },
      {
        title: '重写值',
        key: 'fix_value',
        width: '20%',
        render: (text, record) => {
          return <div>{record?.fix_value}</div>;
        },
      },
      {
        title: '操作',
        dataIndex: 'action',
        width: '20%',
        render: (text, record) => (
          <div>
            <Button
              icon={<EditOutlined />}
              shape="circle"
              title="编辑"
              onClick={() => this.switchModal(true, null, record)}
            />
            <Button
              icon={<DeleteOutlined />}
              shape="circle"
              title="删除"
              onClick={() => this.showDelDialog(record)}
            />
          </div>
        ),
      },
    ];
  }
  // UNSAFE_componentWillReceiveProps(nextProps) {
  //    const { user_profile_detail = {} } = nextProps.appDetail;
  //    if (user_profile_detail.domains) {
  //       this.setState({
  //          profileAttrs: user_profile_detail.domains,
  //       });
  //    }
  // }

  render() {
    const { profileAttrs } = this.state;
    const availableAttrs = this.state?.optionalAttrs.filter((attr) => {
      const domain_name = attr?.domain_name;
      if (
        this.state.newAttr &&
        this.state.newAttr.domain_name &&
        this.state.newAttr.domain_name === domain_name
      )
        return true;

      const profileAttr = this.state?.profileAttrs?.find((ele) => ele?.domain_name === domain_name);
      if (profileAttr) {
        // already has this, don't add to options
        return false;
      } else {
        return true;
      }
    });

    return (
      <div>
        <div style={{ lineHeight: '60px' }} className="addUser">
          <Row>
            <Col span={23}>
              <div style={{ textAlign: 'right' }}>
                <Button
                  type="primary"
                  className="addBtnBg"
                  disabled={availableAttrs.length === 0}
                  onClick={() => this.switchModal(true, null, null)}
                >
                  <i className="iconfont icon-add mr-10"></i>
                  添加属性
                </Button>
              </div>
            </Col>
          </Row>
        </div>
        <div>
          <Row>
            <Col span={23}>
              <Table
                scroll={{ y: 540 }}
                rowKey={(record) => record?.domain_name}
                columns={this.initTable()}
                pagination={false}
                dataSource={profileAttrs}
              />
            </Col>
          </Row>
        </div>

        {this.state.optionalAttrs.length > 0 && (
          <AppInfoProfileAttrEdit
            optionalAttrs={this.state.optionalAttrs}
            availableAttrs={availableAttrs}
            oldAttr={this.state.oldAttr}
            showModal={this.state.showModal}
            switchModal={this.switchModal}
          />
        )}
        <Modal
          title="删除属性"
          closable={false}
          open={this.state.showDelModal}
          footer={[
            <Button key="cancel" size="large" onClick={this.hideDelDialog.bind(this)}>
              取消
            </Button>,
            <Button
              key="del"
              size="large"
              type="primary"
              onClick={this.deleteProfileAttr.bind(this)}
            >
              确定
            </Button>,
          ]}
        >
          <div style={{ lineHeight: '60px' }}>
            <p style={{ height: '60px', fontSize: '14px' }}>是否确认删除？</p>
          </div>
        </Modal>
      </div>
    );
  }
}
export default AppInfoProfile;
