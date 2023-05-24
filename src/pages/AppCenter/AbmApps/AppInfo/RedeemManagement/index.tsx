import type { CdKeyType } from '@/pages/AppCenter/data';
import { exportCdKeySummary } from '@/pages/AppCenter/service';
import { DownloadOutlined, LoadingOutlined, UploadOutlined } from '@ant-design/icons';
import {
  Alert,
  Button,
  Card,
  Descriptions,
  Drawer,
  Form,
  InputNumber,
  message,
  Space,
  Upload,
} from 'antd';
import type { RcFile, UploadChangeParam, UploadFile } from 'antd/lib/upload/interface';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import QRCode from 'qrcode';
import React, { useState } from 'react';

export interface RedeemManagementProps {
  onClose: (flag?: boolean) => void;
  onDownloadRedeemCode: () => void;
  redeemManagementVisiable: boolean;
  cdKeySummary: Partial<CdKeyType>;
}

const formLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 12 },
};

const RedeemManagement: React.FC<RedeemManagementProps> = (props) => {
  const [form] = Form.useForm();
  const {
    onClose: handleRedeemManagementVisiable,
    onDownloadRedeemCode: handleGetCdKey,
    redeemManagementVisiable,
    cdKeySummary,
  } = props;
  const [uploading, setUploading] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);

  // 计算剩余可消耗兑换码
  const remains = () => {
    const { totalNum = 0, assignedNum = 0 } = cdKeySummary;
    return Math.max(0, totalNum - assignedNum);
  };

  // 上传尚未测试，以及上传成功后的逻辑处理 @chada @todo
  const handleUploadChange = (info: UploadChangeParam<UploadFile<any>>) => {
    if (info.file.status === 'uploading') {
      setUploading(true);
    }
    if (info.file.status === 'done') {
      setUploading(false);
      message.success('导入成功');
      handleGetCdKey();
    }
  };

  // 上传钱检查文件体积，不能超过 2MB
  const beforeUpload = (file: RcFile) => {
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('文件大小不能超过2MB!');
    }
    return isLt2M;
  };

  // 下载兑换码
  const handleDownload = async () => {
    setDownloading(true);
    const fieldsValue = await form.validateFields();
    const { num } = fieldsValue;
    await exportCdKeySummary({ num })
      .then(async (res) => {
        const urlList = (res && res.data) || [];
        const zip = new JSZip();
        const qrCode: any = zip.folder('兑换码');

        return Promise.all(
          // 生成二维码
          urlList.map((url: string) =>
            QRCode.toDataURL(url)
              .then((base64Url) => {
                qrCode.file(
                  `${url.replace(/[/:\\?]{1,3}/g, '-')}.png`,
                  base64Url.replace('data:image/png;base64,', ''),
                  { base64: true },
                );
              })
              .catch(() => {}),
          ),
        ).then(() => {
          // 将二维码打包成 zip 文件
          zip.generateAsync({ type: 'blob' }).then((content) => {
            saveAs(content, '兑换码.zip');
          });

          // 刷新 cdKeySummary
          handleGetCdKey();
        });
      })
      .finally(() => {
        setDownloading(false);
      });
  };

  // 上传参数设置
  const uploadProps = {
    accept: '.xls',
    action: '/adm/admin/vpps/uploadCdKey/file',
    showUploadList: false,
    onChange: (info: UploadChangeParam<UploadFile<any>>) => handleUploadChange(info),
    beforeUpload: (file: RcFile) => beforeUpload(file),
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
    },
  };

  return (
    <Drawer
      width={'50%'}
      destroyOnClose
      title="授权管理"
      open={redeemManagementVisiable}
      onClose={() => handleRedeemManagementVisiable()}
      bodyStyle={{ background: '#f1f2f6' }}
    >
      <Card title="导入兑换码文件" style={{ marginBottom: '24px' }}>
        <Descriptions column={1} labelStyle={{ color: '#6a6a6a' }}>
          <Descriptions.Item label="已购买代码数量">{cdKeySummary.totalNum}</Descriptions.Item>
          <Descriptions.Item label="已消耗代码数量">{cdKeySummary.assignedNum}</Descriptions.Item>
          <Descriptions.Item label="可用代码数量">{remains()}</Descriptions.Item>
        </Descriptions>
        <Upload {...uploadProps}>
          <Button type="primary">
            {uploading ? <LoadingOutlined /> : <UploadOutlined />} 导入
          </Button>
        </Upload>
      </Card>
      <Card title="导出兑换码">
        {remains() > 0 ? (
          <Space direction="vertical" style={{ width: '100%' }}>
            <Alert message="将已有兑换码以二维码形式导出，最多可导出200个" type="info" showIcon />
            <Form form={form} {...formLayout} layout="vertical">
              <Form.Item
                label="请输入导出数量"
                name="num"
                rules={[{ required: true, message: '请输入导出数量' }]}
              >
                <InputNumber
                  placeholder="请输入导出数量"
                  max={200}
                  min={1}
                  style={{ width: '100%' }}
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" onClick={() => handleDownload()}>
                  {downloading ? <LoadingOutlined /> : <DownloadOutlined />} 导出
                </Button>
              </Form.Item>
            </Form>
          </Space>
        ) : (
          <Alert message="所有兑换码已经消耗完，请重新导入后再进行下载" type="error" showIcon />
        )}
      </Card>
    </Drawer>
  );
};

export default RedeemManagement;
