import { PlusOutlined } from '@ant-design/icons';
import { message, Modal, Upload } from 'antd';
import type { RcFile, UploadChangeParam, UploadFile } from 'antd/lib/upload/interface';
import React, { useEffect, useState } from 'react';
import styles from './index.less';
import ImgCrop from 'antd-img-crop';
interface PicturesWallProps {
  value?: string;
  maxSize?: number; //kb
  onChange?: (file: string) => void;
}
export interface UploadSignData {
  requestId?: string;
  dir?: string;
  bucket?: string;
  expiration?: number;
  uri?: string;
  method?: 'POST';
  policy?: string;
  authorization?: string;
  host?: string;
  baseUrl?: string;
}

const PicturesWall: React.FC<PicturesWallProps> = (props) => {
  const { value, onChange } = props;
  const [imageFileList, setFileList] = useState<any>([]);
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState();
  const [isShow, setIsShow] = useState(true);
  const [isTailoring, setIsTailoring] = useState<boolean>(false);

  useEffect(() => {
    if (value) {
      const imageList: any = [];
      imageList.push({
        uid: '0',
        name: `image_0.png`,
        status: 'done',
        url: value,
      });
      setFileList(imageList);
    }
  }, [value]);

  const getBase64 = (file: any) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  const checkFile = (file: any, showMsg?: boolean) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      if (showMsg) {
        message.error('只支持上传JPG/PNG 文件!');
      }
      return false;
    }
    // file.size == 单位字节
    const isLt2M = file.size / 1024 < (props.maxSize || 1024);

    if (!isLt2M) {
      if (showMsg) {
        setIsShow(false);
        message.error('文件大小不能超过50KB');
        setIsTailoring(true);
      }
      return false;
    } else {
      setIsShow(true);
    }
    return isJpgOrPng && isLt2M;
  };
  const beforeUpload = (file: RcFile) => {
    return checkFile(file, true);
  };

  const handleChange = async (info: UploadChangeParam<UploadFile<any>>) => {
    if (isShow) {
      const { fileList, file } = info;
      if (file && file.status === 'done' && !checkFile(file, false)) {
        return;
      }
      setFileList(fileList);
      if (file.status === 'done') {
        if (onChange) {
          const base64Img: any = await getBase64(file.originFileObj);
          onChange(base64Img);
        }
      } else {
        if (onChange) {
          onChange('');
        }
      }
    }
  };

  const handlePreview = async (file: UploadFile) => {
    let preview: any;
    if (!file.url) {
      preview = await getBase64(file.originFileObj);
    } else {
      preview = file.url;
    }
    setPreviewVisible(true);
    setPreviewImage(preview);
  };

  const uploadProps = {
    fileList: imageFileList,
    defaultFileList: imageFileList,
    name: 'file',
    onChange: handleChange,
    beforeUpload: (file: RcFile) => beforeUpload(file),
    onPreview: handlePreview,
  };

  const handleCancel = () => setPreviewVisible(false);
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div className={styles.text}>上传</div>
    </div>
  );
  return (
    <>
      {isTailoring ? (
        <ImgCrop rotate>
          <Upload {...uploadProps} listType="picture-card">
            {imageFileList.length >= 1 ? null : uploadButton}
          </Upload>
        </ImgCrop>
      ) : (
        <ImgCrop rotate>
          <Upload {...uploadProps} listType="picture-card">
            {imageFileList.length >= 1 ? null : uploadButton}
          </Upload>
        </ImgCrop>
      )}

      <Modal open={previewVisible} footer={null} onCancel={handleCancel}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );
};

export default PicturesWall;
