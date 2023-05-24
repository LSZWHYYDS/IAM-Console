/*jshint esversion: 6 */
import React, { Component } from 'react';
import { Row, Col, Button, Checkbox, Modal } from 'antd';
// import util from "../../common/util";
import { showSuccessMessage } from '@/utils/common.utils';
import InfoItem from '@/components/InfoItem';
import { generateSignatureSecret } from '../../service';
import { showErrorMessage } from '@/utils/common.utils.ts';

const SECRET = '********************';
class SignatureSecret extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      showSecret: false,
      showConfirmModal: false,
    };
  }
  onCopy() {
    var textArea = document.createElement('textarea');
    textArea.value = this.props.signature_secret;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      showSuccessMessage('复制成功');
    } catch (err) {
      throw new Error('Oops, unable to copy');
    }
    document.body.removeChild(textArea);
  }
  onRegenerate() {
    generateSignatureSecret(this.props.clientID).then(
      (response) => {
        this.props.mergeAppDetail(response && response.data);
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
      showSecret: !this.state.showSecret,
    });
  }
  render() {
    const contentObj = (
      <div>
        <Row>
          <Col span={24}>{this.state.showSecret ? this.props.signature_secret : SECRET}</Col>
        </Row>
        <Row>
          <Col>
            <Checkbox onChange={this.onChange.bind(this)}>显示秘钥</Checkbox>
            <Button type="primary" onClick={this.onCopy.bind(this)}>
              复制
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
          titleStr="对称签名秘钥"
          contentObj={contentObj}
          contentSpan={14}
          isNormal={this.props.isEdit}
        />
        <Modal
          title="重新生成对称秘钥"
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
              系统会重新生成秘钥，应用必须使用新的秘钥。
            </p>
          </div>
        </Modal>
      </div>
    );
  }
}

export default SignatureSecret;
