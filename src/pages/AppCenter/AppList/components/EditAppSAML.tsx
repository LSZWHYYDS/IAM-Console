import { SearchOutlined } from '@ant-design/icons';
import { Button, Card, Col, Divider, Form, Input, Row, Select, Space, Table } from 'antd';
import { Component } from 'react';
export default class EditAppSAML extends Component {
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
        <div style={{ marginTop: '20px' }}>端点信息:</div>
        <Divider style={{ margin: '20px 0' }} />

        <Form
          name="basic"
          initialValues={{ remember: true }}
          autoComplete="off"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 4 }}
          ref={this.formRefs_ls}
        >
          <Form.Item label="SSO URL:" labelCol={{ offset: 1, span: 2 }}>
            <Input />
          </Form.Item>
          <Form.Item label="接收者 URL:" name="textUrl" labelCol={{ offset: 1, span: 2 }}>
            <Input />
          </Form.Item>
          <Form.Item label="目的 URL:" name="textUrl" labelCol={{ offset: 1, span: 2 }}>
            <Input />
          </Form.Item>
          <Form.Item label="SP 实例ID:" name="textUrl" labelCol={{ offset: 1, span: 2 }}>
            <Input />
          </Form.Item>
          <Form.Item label="用户ID格式:" name="textUrl" labelCol={{ offset: 1, span: 2 }}>
            <Select defaultValue="demo">
              <Select.Option value="demo">不指定</Select.Option>
              <Select.Option value="demo1">ls_zwh</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="应用用户名:" name="textUrl" labelCol={{ offset: 1, span: 2 }}>
            <Select defaultValue="demo">
              <Select.Option value="demo">不指定</Select.Option>
              <Select.Option value="demo1">ls_zwh</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Metadata地:" name="textUrl" labelCol={{ offset: 1, span: 2 }}>
            <span>https://www.baidu.com</span>
          </Form.Item>
        </Form>

        <div style={{ marginTop: '20px' }}>SAML高级设置:</div>
        <Divider style={{ margin: '20px 0' }} />
        <Form
          name="basic"
          initialValues={{ remember: true }}
          autoComplete="off"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 6 }}
          ref={this.formRefs_ls}
        >
          <Form.Item label="响应数据:" labelCol={{ offset: 1, span: 2 }}>
            <Select defaultValue="demo">
              <Select.Option value="demo">不指定</Select.Option>
              <Select.Option value="demo1">ls_zwh</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Assertion签名:" name="textUrl" labelCol={{ offset: 1, span: 2 }}>
            <Select defaultValue="demo">
              <Select.Option value="demo">不指定</Select.Option>
              <Select.Option value="demo1">ls_zwh</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="签名算法:" name="textUrl" labelCol={{ offset: 1, span: 2 }}>
            <Select defaultValue="demo">
              <Select.Option value="demo">不指定</Select.Option>
              <Select.Option value="demo1">ls_zwh</Select.Option>
            </Select>

            <Row style={{ marginTop: '10px' }}>
              <Col offset={1}>
                <Button type="primary" style={{ marginLeft: '-15px' }}>
                  下载证书
                </Button>
              </Col>
            </Row>
          </Form.Item>

          <Form.Item label="签名摘要:" name="" labelCol={{ offset: 1, span: 2 }}>
            <Select defaultValue="demo">
              <Select.Option value="demo">SHA256</Select.Option>
              <Select.Option value="demo1">ls_zwh</Select.Option>
            </Select>
          </Form.Item>
        </Form>

        <Row>
          <Col offset={2}>
            <Button type="primary" icon={<SearchOutlined />}>
              {' '}
              添加属性{' '}
            </Button>
          </Col>
        </Row>

        <Row style={{ marginTop: '15px' }}>
          <Col offset={2}>
            <Table columns={columns} dataSource={data} pagination={false} />
          </Col>
        </Row>

        <div style={{ marginTop: '20px' }}>SAML Assertion:</div>
        <Divider style={{ margin: '20px 0' }} />

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
      </>
    );
  }
}
