import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, message, Modal, Progress, Upload } from 'antd';
import type { RcFile, UploadChangeParam, UploadFile, UploadProps } from 'antd/lib/upload/interface';
import React, { useState } from 'react';

// interface UploadAppProps {
//    platformName: string;
//    onFinished: (fieldsValue: any) => void;
// }
const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
const UploadApp: React.FC<any> = (props) => {
  const { platformName, onFinished: handleGetUploadedAppInfo } = props;
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const [fileName, setFileName] = useState<string>('');
  const [uploadPercent, setUploadPercent] = useState<number>(0);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  // 上传钱检查文件体积，不能超过 2MB
  const beforeUpload = (file: RcFile) => {
    const isLt1G = file.size / 1024 / 1024 < 1024;
    if (!isLt1G) {
      message.error('文件大小不能超过1GB!');
    }
    return isLt1G;
  };

  const handleCancelUpload = () => {
    // setUploadModalVisible(false);
  };
  const handleBusinessType = () => {
    if (['WINDOWS', 'MACOS'].includes(platformName)) {
      return 'PIC';
    } else {
      return `${platformName}_APP`;
    }
  };

  const hanldeAccept = () => {
    if (['WINDOWS', 'MACOS'].includes(platformName)) {
      return '.png';
    } else {
      return platformName === 'IOS' ? '.ipa' : '.apk';
    }
  };

  const handleModelTitle = () => {
    if (platformName === 'ANDROID') {
      return 'Android 应用上传';
    } else if (platformName === 'IOS') {
      return 'iOS 应用上传';
    } else if (platformName === 'WINDOWS') {
      return 'WINDOWS 应用上传';
    } else {
      return 'MACOS 应用上传';
    }
  };
  const uploadProps = {
    accept: hanldeAccept(),
    action: '/adm/admin/clientapps/upload',
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
    },
    data: { platform: platformName, businessType: handleBusinessType() },
    showUploadList: false,
    onChange(info: UploadChangeParam<UploadFile<any>>) {
      if (info.file.status !== 'uploading') {
        const res = info.file.response;
        console.log(res);

        if (res && res.code === '0') {
          handleGetUploadedAppInfo(res.data);
          props?.onChange?.(res.data);
        }
      }
      if (info.file.status === 'done') {
        setUploadModalVisible(false);
        setUploadPercent(0);
        props?.onChange?.('done');
      } else if (info.file.status === 'error') {
        setUploadModalVisible(false);
        message.error(`${info.file.name} file upload failed.`);
      }

      const { event } = info;

      if (event) {
        const percent = Math.floor(event.percent);
        setFileName(info.file.name);
        setUploadPercent(percent);
        setUploadModalVisible(true);
      }
    },
    beforeUpload,
  };
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>上传</div>
    </div>
  );
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  };
  const handleCancel = () => setPreviewOpen(false);
  const handleChange: UploadProps['onChange'] = (info: any) => {
    if (info.file.status !== 'uploading') {
      const res = info.file.response;
      if (res && res.code === '0') {
        handleGetUploadedAppInfo(res.data);
      }
    }
    props?.onChange?.(info.fileList);
    setFileList(info.fileList);
  };

  return (
    <>
      {['WINDOWS', 'MACOS'].includes(platformName) ? (
        <Upload
          {...uploadProps}
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          showUploadList={true}
          onChange={handleChange}
        >
          {fileList.length >= 1 ? null : uploadButton}
        </Upload>
      ) : (
        <Upload {...uploadProps}>
          <Button type="primary" key="primary">
            <UploadOutlined /> 上传
          </Button>
        </Upload>
      )}
      {uploadPercent ? (
        <Modal
          title={handleModelTitle()}
          open={uploadModalVisible}
          footer={null}
          onCancel={handleCancelUpload}
          maskClosable={false}
          destroyOnClose={true}
          closable={false}
        >
          <p>正在上传: {fileName}</p>
          <Progress percent={uploadPercent} status="active"></Progress>
        </Modal>
      ) : null}

      <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );
};

export default UploadApp;
