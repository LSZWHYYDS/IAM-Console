/**
 * Created by shaliantao on 2017/8/28.
 */
/*jshint esversion: 6 */
import React, { Component } from 'react';
import { Row, Col, Button, Checkbox, Modal } from 'antd';
import { showErrorMessage, showSuccessMessage } from '@/utils/common.utils';
import InfoItem from '@/components/InfoItem';
import { generateSecret } from '../service';

const SECRET = '********************';
class ClientSecret extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      showClientSecret: false,
      showConfirmModal: false,
    };
  }
  onCopy() {
    var textArea = document.createElement('textarea');
    textArea.value = this.props.clientSecret;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      showSuccessMessage('复制成功。');
    } catch (err) {
      throw new Error('Oops, unable to copy');
    }
    document.body.removeChild(textArea);
  }
  onRegenerate() {
    generateSecret(this.props.clientID).then(
      (response) => {
        const { client_secret } = response && response.data;
        this.props.mergeAppDetail(client_secret);
        showSuccessMessage();
        this.switchModal(false);
      },
      (error) => {
        showErrorMessage(error);
      },
    );
  }
  switchModal(show) {
    this.setState({
      showConfirmModal: show,
    });
  }
  onChange() {
    this.setState({
      showClientSecret: !this.state.showClientSecret,
    });
  }
  render() {
    const contentObj = (
      <div>
        <Row>
          <Col span={24}>{this.state.showClientSecret ? this.props.clientSecret : SECRET}</Col>
        </Row>
        <Row style={{ marginTop: '10px' }}>
          <Col>
            <Checkbox onChange={this.onChange.bind(this)}>显示Client Secret</Checkbox>
            <Button type="primary" onClick={this.onCopy.bind(this)}>
              拷贝
            </Button>
            {this.props.isEdit && (
              <Button className="ml-10" type="danger" onClick={this.switchModal.bind(this, true)}>
                重新生成
              </Button>
            )}
          </Col>
        </Row>
      </div>
    );
    return (
      <div>
        <InfoItem
          titleStr="Client Secret"
          contentObj={contentObj}
          titleSpan={6}
          contentSpan={12}
          isNormal={this.props.isEdit}
        />
        <Modal
          title="重新生成"
          closable={false}
          open={this.state.showConfirmModal}
          footer={[
            <Button key="del" size="large" type="primary" onClick={this.onRegenerate.bind(this)}>
              确定
            </Button>,
            <Button key="cancel" size="large" onClick={this.switchModal.bind(this, false)}>
              取消
            </Button>,
          ]}
        >
          <div style={{ lineHeight: '60px' }}>
            <p style={{ height: '60px', fontSize: '14px' }}>
              系统会重新生成Client Secret，应用必须使用新的Client Secret。
            </p>
          </div>
        </Modal>
      </div>
    );
  }
}

export default ClientSecret;
