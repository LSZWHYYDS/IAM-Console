/*jshint esversion: 6 */
import React, { Component, Fragment } from 'react';
import { Upload, Form, Button, Card, Input, Col, Row, message, Space, Modal } from 'antd';
import { Link } from 'react-router-dom';
import { filterDangerousChars, showErrorMessage, showSuccessMessage } from '@/utils/common.utils';
import { PageContainer } from '@ant-design/pro-layout';
import { UploadOutlined } from '@ant-design/icons';
import tagAPI from '../tagAPI';
// import validator from '../../common/validator';
import TagUserList from './TagUserList';
const FormItem = Form.Item;

class ImportFile extends Component {
  constructor(...args) {
    super(...args);
    this.file = null;
    this.state = {
      data: {},
    };
  }

  onFileChange = ({ file }) => {
    if (file && file.status === 'error') {
      message.error('导入标签失败');
    } else if (file && file.status === 'done') {
      message.success('导入标签成功');
    }
  };
  onPostFileToForm = () => {
    this.props.onPostFile(this.file);
  };
  render() {
    const { visible, onClose, allValues } = this.props;
    const importProps = {
      accept: '.xlsx',
      action: '/iam/api/tags/' + allValues && allValues.name,
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
      },
      beforeUpload: (file) => {
        const values = this.props.allValues;
        if (!values || !values.name) {
          message.error('请输入标签名称。');
          return false;
        }
        this.file = file;
        if (this.props.isAdd) {
          return true;
        }
        return false;
      },
      onChange: this.onFileChange,
    };
    return (
      <Modal title="导入用户" open={visible} destroyOnClose footer={null} onCancel={onClose}>
        <Card className="mt-20" bordered={false}>
          <div className="new-attr-item">
            <Row>1. 下载模板，并根据模板要求录入用户信息</Row>
            <Row>
              <a href={'/uc/files/tagUserTmpl.xlsx'}>模板下载</a>
            </Row>
            <Row style={{ paddingTop: 20 }}>2. 上传完善后的表格</Row>
            <Row>
              <Col offset={6} span={10}>
                <Upload {...importProps}>
                  <Button icon={<UploadOutlined />}>选择文件</Button>
                </Upload>
              </Col>
            </Row>
          </div>
        </Card>
        <div className="footerContainer">
          <Space>
            <Button type="ghost" className="ml-10" onClick={onClose}>
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
