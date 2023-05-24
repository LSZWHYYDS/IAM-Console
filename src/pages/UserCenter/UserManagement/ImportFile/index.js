/*jshint esversion: 6 */
import React, { Component, Fragment } from 'react';
import { Upload, Form, Button, Card, Input, Col, Row, message, Space, Modal } from 'antd';
import { Link } from 'react-router-dom';
import { filterDangerousChars, showErrorMessage, showSuccessMessage } from '@/utils/common.utils';
import { PageContainer } from '@ant-design/pro-layout';
import { UploadOutlined, FileExcelOutlined } from '@ant-design/icons';
import ImportResult from '../ImportResult';
import { importUser } from '../../service';
import { getPolicies } from '@/pages/EditSetting/service';

const FormItem = Form.Item;

class ImportFile extends Component {
  constructor(...args) {
    super(...args);
    this.formRef = React.createRef();

    this.state = {
      data: {},
      batchNo: '',
      importResultVisible: false,
      file: null,
      user_create_verify: false,
    };
  }
  componentDidMount() {
    this.setState({
      importResultVisible: false,
    });
    getPolicies().then((res) => {
      this.setState({
        user_create_verify: _.get(res, 'data.user_policy.user_create_verify'),
      });
    });
  }

  onFileChange = ({ file }) => {
    if (file && file.status === 'error') {
      message.error('导入失败');
    } else if (file && file.status === 'done') {
      message.success('导入成功');
    }
  };
  onPostFileToForm = () => {
    const { user_create_verify, file } = this.state;
    if (!file) {
      message.error('请选择文件。');
      return false;
    }
    const values = user_create_verify && this.formRef.current.getFieldsValue();
    if (user_create_verify && (!values || !values.explain)) {
      message.error('请输入申请说明。');
      return false;
    }
    importUser(values.explain, file).then(
      (res) => {
        showSuccessMessage();
        this.setState({
          importResultVisible: true,
          batchNo: res.data,
        });
      },
      (error) => {
        showErrorMessage(error);
      },
    );
  };
  onCloseImportModal = () => {
    this.setState({
      importResultVisible: false,
      file: null,
    });
    this.props.onClose();
  };
  onCloseModal = () => {
    this.setState({
      file: null,
    });
    this.props.onClose();
  };
  render() {
    const { visible, allValues } = this.props;
    const { importResultVisible, batchNo, user_create_verify } = this.state;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
    };
    const importProps = {
      name: 'userExcelFile',
      maxCount: 1,
      showUploadList: {
        showRemoveIcon: false,
      },
      action: '/iam/api/users/importUser',
      headers: {
        authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
      },
      beforeUpload: (file) => {
        this.setState({
          file,
        });
        return false;
      },
    };
    const explainItem =
      (user_create_verify && (
        <Row style={{ marginTop: 20 }}>
          <Col span={22}>
            <Form
              className="formPadding"
              layout="vertical"
              ref={this.formRef}
              onFinish={this.onSubmit}
            >
              <FormItem
                label="3. 申请说明"
                {...formItemLayout}
                name="explain"
                rules={[
                  {
                    required: true,
                    message: '请输入申请说明',
                  },
                ]}
              >
                <Input.TextArea type="text" />
              </FormItem>
            </Form>
          </Col>
        </Row>
      )) ||
      null;
    return (
      <Modal
        title="导入用户"
        open={visible}
        width={800}
        destroyOnClose
        footer={null}
        onCancel={this.onCloseModal}
      >
        <Card className="mt-20" bordered={false}>
          <ImportResult
            visible={importResultVisible}
            batchNo={batchNo}
            onClose={this.onCloseImportModal}
          />
          <div className="new-attr-item" style={{ marginLeft: 40 }}>
            <Row>1. 下载模板，并根据模板要求录入用户信息</Row>
            <Row>
              <a href={location.origin + '/iam/api/users/importTemplate'}>模板下载</a>
            </Row>
            <Row style={{ paddingTop: 20 }}>2. 上传完善后的表格</Row>
            <Row>
              <Col offset={2} span={10}>
                <Upload {...importProps} key="import">
                  <Button key="key" type="primary">
                    <FileExcelOutlined /> 选择文件
                  </Button>
                </Upload>
              </Col>
            </Row>
            <Row style={{ paddingTop: 20 }}>
              <Col offset={2} span={10}>
                {this.state.file && '选中文件：' + this.state.file.name}
              </Col>
            </Row>
            {explainItem}
          </div>
        </Card>
        <div className="footerContainer">
          <Space>
            <Button type="ghost" className="ml-10" onClick={this.onCloseModal}>
              取消
            </Button>
            <Button type="primary" onClick={this.onPostFileToForm}>
              确定
            </Button>
          </Space>
        </div>
      </Modal>
    );
  }
}

export default ImportFile;
