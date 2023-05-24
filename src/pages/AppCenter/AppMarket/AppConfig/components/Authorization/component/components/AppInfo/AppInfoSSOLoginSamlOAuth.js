import { filterDangerousChars } from '@/utils/common.utils';
import { Button, Collapse, Form, Select } from 'antd';
import { Component } from 'react';

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
  onGetSaveValue() {
    return {
      domains: this.state.profileAttrs.map((item, index) => {
        const { as_claim, domain_name } = item;
        return {
          as_claim,
          domain_name,
          sort_order: index,
        };
      }),
    };
  }
  renderSAML() {
    const { assertion_attributes = [], config = {} } = this.state;
    return (
      <Collapse
        defaultActiveKey={['samlBase', 'samlHigh']}
        bordered={false}
        style={{ backgroundColor: '#FFF' }}
      >
        {/* <Panel header="用户属性" key="samlHigh"> */}
        {/* <Row>
                  <Col span={24}>
                     <FormItem
                        label="响应数据"
                        {...formItemLayout}
                        name="response_signed"
                        initialValue={config.response_signed}
                     >
                        <Select allowClear={true}>
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
                        <Select allowClear={true} >
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
                        <Select allowClear={true}>
                           <Option key="RSA-SHA256" value="RSA-SHA256">
                              RSA-SHA256
                           </Option>
                           <Option key="RSA-SHA1" value="RSA-SHA1">
                              RSA-SHA1
                           </Option>
                        </Select>
                     </FormItem>
                  </Col>
               </Row>
               <Row>
                  <Col span={24}>
                     <FormItem
                        label="签名摘要"
                        {...formItemLayout}
                        name="digest_algorithm"
                        initialValue={config.digest_algorithm}
                     >
                        <Select allowClear={true} >
                           <Option key="SHA256" value="SHA256">
                              SHA256
                           </Option>
                           <Option key="SHA1" value="SHA1">
                              SHA1
                           </Option>
                        </Select>
                     </FormItem>
                  </Col>
               </Row> */}
        {/* <Row>
                  <Col span={24}>
                     <div style={{ textAlign: 'right', marginBottom: '20px' }}>
                        <Button
                           type="primary"
                           className="addBtnBg"
                           onClick={() => this.switchModal(true, null, null)}
                        >
                           <i className="iconfont icon-add mr-10"></i>
                           添加属性
                        </Button>
                     </div>
                  </Col>
               </Row>
               <Row>
                  <div style={{ lineHeight: '60px' }} className="addUser">

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
                     visible={this.state.showDelModal}
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
               </Row> */}

        {/* </Panel> */}
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
            <Button
              // icon="edit"todo
              shape="circle"
              disabled={record.domain_name === 'sub' || record.domain_name === 'username'}
              title="编辑"
              size="large"
              onClick={() => this.switchModal(true, null, record)}
            />
            <Button
              // icon="delete"//todo
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
