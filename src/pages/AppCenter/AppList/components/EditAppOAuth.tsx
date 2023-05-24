import { SearchOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Form, Input, Row, Select, Space, Table } from 'antd';
import React, { Component } from 'react';
export default class EditAppOAuth extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.ls_form = React.createRef();
  }
  componentDidMount() {
    this.ls_form.current.setFieldsValue({ http_sAddres: 'Hi, man!' });
  }

  render() {
    const columns = [
      {
        title: '属性名称',
        dataIndex: 'name',
        key: 'name',
        width: '200px',
      },
      {
        title: '属性格式',
        dataIndex: 'age',
        key: 'age',
        width: '200px',
      },
      {
        title: '属性值',
        dataIndex: 'address',
        key: 'address',
        width: '200px',
      },
      {
        title: '操作',
        key: 'action',
        width: '200px',
        render: (_, record) => (
          <Space size="middle">
            <a>Invite {record.name}</a>
          </Space>
        ),
      },
    ];

    const data = [
      {
        key: '1',
        name: '属性名称',
        age: 32,
        address: <Input />,
      },
      {
        key: '2',
        name: '属性格式',
        age: 42,
        address: 'London No. 1 Lake Park',
      },
      {
        key: '3',
        name: '属性值',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
      },
      {
        key: '4',
        name: '操作',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
      },
    ];
    return (
      <>
        <div style={{ marginTop: '20px' }}>基本信息:</div>
        <Divider style={{ margin: '20px 0' }} />

        <Form labelCol={{ span: 8 }} wrapperCol={{ span: 6 }} ref={this.ls_form}>
          <Form.Item label="UserInfo接口:" labelCol={{ offset: 1, span: 2 }}>
            <Input />
          </Form.Item>

          <Form.Item label="RedirectUrl:" name="http_sAddres" labelCol={{ offset: 1, span: 2 }}>
            <Input />
          </Form.Item>
        </Form>

        <div style={{ marginTop: '20px' }}>UserToken设置:</div>
        <Divider style={{ margin: '20px 0' }} />
        <Form labelCol={{ span: 8 }} wrapperCol={{ span: 6 }}>
          <Form.Item label="UserInfo接口:" labelCol={{ offset: 1, span: 2 }}>
            <Select defaultValue="demo">
              <Select.Option value="demo">不指定</Select.Option>
              <Select.Option value="demo1">ls_zwh</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label=" " labelCol={{ offset: 1, span: 2 }}>
            <span>签名密钥:***************************</span>
          </Form.Item>

          <Form.Item label="UserToken属性" labelCol={{ offset: 1, span: 2 }}>
            <Button type="primary" icon={<SearchOutlined />}>
              添加属性
            </Button>
          </Form.Item>
        </Form>

        <Row style={{ marginTop: '15px' }}>
          <Col offset={3}>
            <Table columns={columns} dataSource={data} pagination={false} />
          </Col>
        </Row>
      </>
    );
  }
}
