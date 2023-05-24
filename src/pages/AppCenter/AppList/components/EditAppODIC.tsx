/* eslint-disable react/no-array-index-key */
import {
  Button,
  Checkbox,
  Col,
  Divider,
  Form,
  Input,
  Radio,
  Row,
  Select,
  Space,
  Table,
  Tooltip,
  Typography,
} from 'antd';
import React, { Component } from 'react';
import UseModel from './AppInfo/AppInfoProfileAttrEdit';
import './EditAppODIC.less';
const { Text } = Typography;
class EditAppODIC extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputArray: [],
      signatureKey: false,
      isShowModel: true,
      optionalAttrs: [],
      isShowModel: false,
    };
    this.formRefs_ls = React.createRef();
  }

  componentDidMount() {
    // this.formRefs_ls.current.setFieldsValue({ textUrl: '192.168.1.1' });
  }

  addInput() {
    //todo
    this.setState((state) => {
      const arr = state.inputArray.slice();
      arr.push(1);

      return {
        inputArray: arr,
      };
    });
  }

  renderItem() {
    return this.state.inputArray.map((is: any, inx: number) => (
      // todo
      // eslint-disable-next-line react/jsx-key
      <Form.Item name={`ls${inx}`}>
        <Row>
          <Col offset={2}>
            <Input style={{ marginTop: '10px', width: '205px' }} key={`ls${inx}`} />
          </Col>
        </Row>
      </Form.Item>
    ));
  }
  // 认证设置
  onChangeLocalhost(val) {
    this.props.msgArr(val);
  }
  // access 数据
  selectOption(val) {
    this.props.accessHandle(val);
  }
  // 传递时间函数
  selectOption_Time(val) {
    this.props.refreshHandle(val);
  }
  // 传递idToken函数
  selectOption_Id_token(val) {
    this.props.idTokenHandle(val);
  }
  switchHandle() {
    this.setState({
      isShowModel: false,
    });
  }
  modifySigin() {
    this.setState((state) => {
      return {
        signatureKey: !state.signatureKey,
      };
    });
  }
  render() {
    const data: DataType[] = [
      {
        key: '1',
        name: '头像',
        age: <Checkbox />,
      },
      {
        key: '2',
        name: '用户名',
        age: 42,
      },
      {
        key: '3',
        name: '性别',
        age: 32,
      },
    ];

    const columns: ColumnsType<DataType> = [
      {
        title: '属性名称',
        dataIndex: 'name',
        key: 'name',
        className: 'column-money',
        width: '200px',
      },
      {
        title: '是否写入IDToken',
        dataIndex: 'age',
        key: 'age',
        className: 'column-money',
        width: '200px',
      },
      {
        title: '操作',
        key: 'action',
        className: 'column-money',
        width: '200px',
        render: (_, record) => (
          <Space size="middle">
            <a>Invite {record.name}</a>
          </Space>
        ),
      },
    ];

    return (
      <>
        <div style={{ marginTop: '20px' }}>端点信息:</div>
        <Divider style={{ margin: '20px 0' }} />
        <Form.Item label="    UserInfo接口 :">
          <a href="#">{window.location.host}</a>
        </Form.Item>

        <Form.Item label="    RedirectURi :">
          <Space>
            <Form.Item name="textUrl">
              <Input
                style={{
                  width: 205,
                  height: '30px',
                }}
              />
            </Form.Item>

            <Tooltip title="">
              <span
                style={{
                  marginLeft: '15px',
                  fontSize: '25px',
                  color: '#808080',
                  cursor: 'pointer',
                  verticalAlign: 'middle',
                  marginTop: '-30px',
                  display: 'inline-block',
                }}
                onClick={this.addInput.bind(this)}
              >
                +
              </span>
            </Tooltip>
          </Space>
        </Form.Item>
        {this.renderItem()}
        <div style={{ marginTop: '20px' }}>认证设置:</div>
        <Divider style={{ margin: '20px 0' }} />
        <Checkbox.Group onChange={this.onChangeLocalhost.bind(this)}>
          <Row wrap={false}>
            <Col span={3} offset={5}>
              <span>授权模式：</span>
            </Col>
            <Col offset={3}>
              <Checkbox value={'authorization_code'}>authorization_code</Checkbox>
            </Col>
            <Col offset={3}>
              <Checkbox value={'implicit'}>implicit</Checkbox>
            </Col>
            <Col offset={3}>
              <Checkbox value={'password'}>password</Checkbox>
            </Col>
            <Col offset={3}>
              <Checkbox value={'client_credentials'}>client_credentials</Checkbox>
            </Col>
            <Col offset={3}>
              <Checkbox value={'refresh_token'}>
                <Text underline>refresh_token</Text>
              </Checkbox>
              <span style={{ color: '#d9d9d9' }}>注解: 该选项可选</span>
            </Col>
          </Row>
        </Checkbox.Group>
        <div style={{ marginTop: '40px' }}>Token有效期:</div>
        <Divider style={{ margin: '20px 0' }} />
        <Form.Item label="Access Token有效期:">
          <Select
            defaultValue="1"
            onChange={this.selectOption.bind(this)}
            style={{ width: '300px' }}
          >
            <Select.Option value="1">1</Select.Option>
            <Select.Option value="2">2</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Refresh Token有效期:">
          <Radio.Group value={1}>
            <Radio value={1}>自定义</Radio>
            <Radio value={2}>永不过期</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="时间:">
          <Select
            defaultValue="1"
            onChange={this.selectOption_Time.bind(this)}
            style={{ width: '300px' }}
          >
            <Select.Option value="1">1</Select.Option>
            <Select.Option value="2">2</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="ID Token有效期:">
          <Select
            defaultValue="1"
            onChange={this.selectOption_Id_token.bind(this)}
            style={{ width: '300px' }}
          >
            <Select.Option value="1">1</Select.Option>
            <Select.Option value="2">2</Select.Option>
          </Select>
        </Form.Item>
        <div style={{ marginTop: '20px' }}>IDToken设置:</div>
        <Divider style={{ margin: '20px 0' }} />
        <Form labelCol={{ span: 3 }} wrapperCol={{ span: 6 }} layout="horizontal">
          <Form.Item label="签署设置:">
            <Select defaultValue="1">
              <Select.Option value="1">非对称密钥签名</Select.Option>
              <Select.Option value="2">对称密钥签名</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Row>
              <Col offset={8}>
                {this.state.signatureKey ? (
                  <span>签名密钥: 1234567890</span>
                ) : (
                  <span>签名密钥: ***********</span>
                )}
                <img
                  src="/images/fuzhi.png"
                  style={{ width: '20px', height: '20px', marginLeft: '10px', cursor: 'pointer' }}
                  onClick={this.modifySigin.bind(this)}
                />
                <button type="button" style={{ display: 'inline-block', marginLeft: '10px' }}>
                  重新生成
                </button>
              </Col>
            </Row>
          </Form.Item>
          <Form.Item label="IDToken属性:">
            <Button type="success" onClick={() => this.setState({ isShowModel: true })}>
              添加属性
            </Button>
          </Form.Item>
        </Form>
        <Row>
          <Col offset={3}>
            <Table columns={columns} dataSource={data} pagination={false} />
          </Col>
        </Row>
        {this.state.isShowModel ? (
          <UseModel
            optionalAttrs={this.state.optionalAttrs}
            switchModel={this.switchHandle.bind(this)}
            showModal={true}
          />
        ) : (
          ''
        )}
      </>
    );
  }
}

export default EditAppODIC;
