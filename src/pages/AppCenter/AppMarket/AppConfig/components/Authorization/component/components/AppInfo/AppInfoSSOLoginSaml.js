import { filterDangerousChars } from '@/utils/common.utils';
import { Button, Card, Col, Collapse, Form, Input, Modal, Row, Select, Table } from 'antd';
import { Component } from 'react';
import AppInfoSSOLoginSamlEdit from './AppInfoSSOLoginSamlEdit';

import { DeleteOutlined } from '@ant-design/icons';
const Panel = Collapse.Panel;
const Option = Select.Option,
  FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};

class AppInfoSSOLoginSaml extends Component {
  constructor(...args) {
    super(...args);
    const { config = {} } = this.props.appDetail;
    this.state = {
      showModal: false,
      assertion_attributes: config.assertion_attributes || [],
      config: config,
    };
    this.switchModal = this.switchModal.bind(this);
  }
  componentDidMount() {
    filterDangerousChars();
  }
  onGetSaveValue() {
    return this.state.assertion_attributes;
  }
  switchModal(show, newAttr, oldAttr) {
    if (newAttr) {
      const assertion_attributes = [...this.state.assertion_attributes];
      if (oldAttr) {
        //replace attr with new Attr
        assertion_attributes.forEach(function (item, i) {
          if (item.attribute_name === oldAttr.attribute_name) {
            assertion_attributes[i] = Object.assign({}, assertion_attributes[i], newAttr);
          }
        });
      } else {
        assertion_attributes.push(newAttr);
      }
      this.setState({
        assertion_attributes: assertion_attributes,
        showModal: show,
        oldAttr: null,
      });
    } else {
      this.setState({
        showModal: show,
        oldAttr: oldAttr,
      });
    }
  }
  renderSAML() {
    const { assertion_attributes = [], config = {} } = this.state;
    return (
      <Collapse
        defaultActiveKey={['samlBase', 'samlHigh']}
        bordered={false}
        style={{ backgroundColor: '#FFF' }}
      >
        <Panel header="SAML 基础配置" key="samlBase">
          <Row>
            <Col span={24}>
              <FormItem
                label="SSO URL"
                {...formItemLayout}
                name="sso_url"
                initialValue={config.sso_url}
              >
                <Input />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem
                label="接受者 URL"
                {...formItemLayout}
                name="recipient_url"
                initialValue={config.recipient_url}
              >
                <Input />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem
                label="目的 URL"
                {...formItemLayout}
                name="destination_url"
                initialValue={config.destination_url}
              >
                <Input />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem
                label="SP 实例 ID"
                {...formItemLayout}
                name="audience_restriction"
                initialValue={config.audience_restriction}
              >
                <Input />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem
                label="用户 ID 格式"
                {...formItemLayout}
                name="name_id_format"
                initialValue={config.name_id_format}
              >
                <Select allowClear={true} style={{ width: '300px' }} defaultValue="none">
                  <Option key="none" value="none">
                    不指定
                  </Option>
                  <Option key="email_address" value="email_address">
                    邮箱地址
                  </Option>
                  <Option key="cert_zhuti_name" value="cert_zhuti_name">
                    证书主体名称
                  </Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem
                label="应用用户名"
                {...formItemLayout}
                name="autofill_setting"
                initialValue={config.autofill_setting}
              >
                <Select allowClear={true} style={{ width: '300px' }} defaultValue="username">
                  <Option key="username" value="username">
                    用户名
                  </Option>
                  <Option key="username_prefix" value="username_prefix">
                    用户名前缀
                  </Option>
                  <Option key="email_address" value="email_address">
                    邮箱地址
                  </Option>
                  <Option key="email_prefix" value="email_prefix">
                    邮箱前缀
                  </Option>
                </Select>
              </FormItem>
            </Col>
          </Row>

          {/* 新添加 */}
          <Row>
            <Col span={24}>
              <FormItem
                label="Metadata地址："
                {...formItemLayout}
                name="autofill_setting"
                initialValue={config.autofill_setting}
              >
                <a href="#">{location.host + `/iam/saml2/${this.props.id_client}/metadata`}</a>
              </FormItem>
            </Col>
          </Row>
        </Panel>
        <Panel header="SAML 高级配置" key="samlHigh">
          <Row>
            <Col span={24}>
              <FormItem
                label="响应数据"
                {...formItemLayout}
                name="response_signed"
                initialValue={config.response_signed}
              >
                <Select allowClear={true} defaultValue={true}>
                  <Option key="true" value={true}>
                    签名
                  </Option>
                  <Option key="false" value={false}>
                    不签名
                  </Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem
                label="Assertion 签名"
                {...formItemLayout}
                name="assertion_signed"
                initialValue={config.assertion_signed}
              >
                <Select allowClear={true} style={{ width: '300px' }} defaultValue={true}>
                  <Option key="true" value={true}>
                    签名
                  </Option>
                  <Option key="false" value={false}>
                    不签名
                  </Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem
                label="签名算法"
                {...formItemLayout}
                name="signature_algorithm"
                initialValue={config.signature_algorithm}
              >
                <Select allowClear={true} style={{ width: '300px' }} defaultValue="RSA-SHA256">
                  <Option key="RSA-SHA256" value="RSA-SHA256">
                    RSA-SHA256
                  </Option>
                  <Option key="RSA-SHA1" value="RSA-SHA1">
                    RSA-SHA1
                  </Option>
                </Select>
              </FormItem>
              {/* <Row>
                        <Col offset={4} style={{ marginBottom: '20px' }}>
                           <Button type='primary'>下载证书</Button>
                        </Col>
                     </Row> */}
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem
                label="摘要算法"
                {...formItemLayout}
                name="digest_algorithm"
                initialValue={config.digest_algorithm}
              >
                <Select allowClear={true} style={{ width: '300px' }} defaultValue="SHA256">
                  <Option key="SHA256" value="SHA256">
                    SHA256
                  </Option>
                  <Option key="SHA1" value="SHA1">
                    SHA1
                  </Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <div style={{ lineHeight: '60px' }} className="addUser">
              <Row>
                <Col span={23}>
                  <div style={{ textAlign: 'right' }}>
                    <Button
                      type="primary"
                      className="addBtnBg"
                      onClick={() => this.switchModal(true, null, null)}
                    >
                      <i className="iconfont icon-add mr-10" />
                      添加属性
                    </Button>
                  </div>
                </Col>
              </Row>
            </div>
            <Col span={24}>
              <Table
                scroll={{ y: 540 }}
                rowKey="attribute_name"
                columns={this.initTable()}
                pagination={false}
                dataSource={assertion_attributes}
              />
            </Col>
            {
              <AppInfoSSOLoginSamlEdit
                oldAttr={this.state.oldAttr}
                showModal={this.state.showModal}
                switchModal={this.switchModal}
              />
            }
            <Modal
              title="删除属性"
              closable={false}
              open={this.state.showDelModal}
              footer={[
                <Button key="cancel" size="large" onClick={this.hideDelDialog.bind(this)}>
                  取消
                </Button>,
                <Button key="del" size="large" type="primary" onClick={this.deleteAttr.bind(this)}>
                  确定
                </Button>,
              ]}
            >
              <div style={{ lineHeight: '60px' }}>
                <p style={{ height: '60px', fontSize: '14px' }}>是否确认删除？</p>
              </div>
            </Modal>
          </Row>
        </Panel>
        <Panel header="SAML Assertion 预览" key="assertionPreview">
          {/* <div style={{ textAlign: "right" }}>
            <Button
              type="primary"
              className="assertionPreviewBtn"
            >
              SAML Assertion 预览
            </Button>
          </div> */}
          <Row>
            <Col span={24}>
              <Card>
                <pre>
                  {'<?xml version="1.0" encoding="UTF-8"?>\n' +
                    '<saml2:Assertion ID="id16051852957765531826023873" IssueInstant="2021-12-24T10:14:58.140Z" Version="2.0"\n' +
                    '    xmlns:saml2="urn:oasis:names:tc:SAML:2.0:assertion">\n' +
                    '    <saml2:Issuer Format="urn:oasis:names:tc:SAML:2.0:nameid-format:entity"/>\n' +
                    '    <saml2:Subject>\n' +
                    '        <saml2:NameID Format="urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress">userName</saml2:NameID>\n' +
                    '        <saml2:SubjectConfirmation Method="urn:oasis:names:tc:SAML:2.0:cm:bearer">\n' +
                    '            <saml2:SubjectConfirmationData NotOnOrAfter="2021-12-24T10:19:58.331Z" Recipient="https://www.digitalsee.cn/"/>\n' +
                    '        </saml2:SubjectConfirmation>\n' +
                    '    </saml2:Subject>\n' +
                    '    <saml2:Conditions NotBefore="2021-12-24T10:09:58.331Z" NotOnOrAfter="2021-12-24T10:19:58.331Z">\n' +
                    '        <saml2:AudienceRestriction>\n' +
                    '            <saml2:Audience>512B78BB650A6F917DA03B69211A0969</saml2:Audience>\n' +
                    '        </saml2:AudienceRestriction>\n' +
                    '    </saml2:Conditions>\n' +
                    '    <saml2:AuthnStatement AuthnInstant="2021-12-24T10:14:58.140Z">\n' +
                    '        <saml2:AuthnContext>\n' +
                    '            <saml2:AuthnContextClassRef>urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport</saml2:AuthnContextClassRef>\n' +
                    '        </saml2:AuthnContext>\n' +
                    '    </saml2:AuthnStatement>\n' +
                    '</saml2:Assertion>'}
                </pre>
              </Card>
            </Col>
          </Row>
        </Panel>
      </Collapse>
    );
  }
  deleteAttr() {
    const { attribute_name } = this.state.currRecord;
    const assertion_attributes = this.state.assertion_attributes.filter(
      (attr) => attr.attribute_name !== attribute_name,
    );
    this.setState({
      assertion_attributes,
      showDelModal: false,
    });
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
  initTable() {
    return [
      {
        title: '属性名称',
        dataIndex: 'attribute_name',
        key: 'attribute_name',
        width: '20%',
      },
      {
        title: '属性值',
        dataIndex: 'attribute_value',
        key: 'attribute_value',
        width: '20%',
      },
      {
        title: '属性格式',
        dataIndex: 'attribute_format',
        key: 'attribute_format',
        width: '20%',
      },
      {
        title: '操作',
        dataIndex: 'action',
        width: '20%',
        render: (text, record) => (
          <div>
            {/* <Button
                     icon="edit"
                     shape="circle"
                     disabled={record.domain_name === 'sub' || record.domain_name === 'username'}
                     title="编辑"
                     size="large"
                     onClick={() => this.switchModal(true, null, record)}
                  /> */}
            <Button
              icon={<DeleteOutlined />} //todo
              shape="circle"
              disabled={record.domain_name === 'sub' || record.domain_name === 'username'}
              title="删除"
              size="large"
              onClick={() => this.showDelDialog(record)}
            />
          </div>
        ),
      },
    ];
  }
  render() {
    return this.renderSAML();
  }
}
export default AppInfoSSOLoginSaml;
