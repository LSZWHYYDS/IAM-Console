import { message, Modal, Upload } from 'antd';
import { useEffect, useState } from 'react';
import type { RcFile, UploadProps } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
import { PlusOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const UploadLogo = (props: any) => {
  const { value, onChange } = props;
  const [previewImage, setPreviewImage] = useState(''); // 预览图的src路径
  const [previewVisible, setPreviewVisible] = useState<boolean>(false); // 控制预览弹窗是否显示
  const [fileLists, setFileLists] = useState<UploadFile[]>([]);
  const [isShow, setIsShow] = useState(true); // 控制是否显示上传图片
  useEffect(() => {
    if (value) {
      const imageList: any = [];
      imageList.push({
        uid: '0',
        name: `image_0.png`,
        status: 'done',
        url: value,
      });
      setFileLists(imageList);
    }
  }, [value]);

  /**
   * 处理点击预览图片
   */
  const handlePreview = async (file: UploadFile) => {
    let preview: any;
    if (!file.url) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    } else {
      preview = file.url;
    }
    setPreviewVisible(true);
    setPreviewImage(preview);
  };
  /**
   * 上传前进行检查图片规范
   */
  const checkFile = (file: any, showMsg?: boolean) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      if (showMsg) {
        message.error('只支持上传JPG/PNG 文件!');
      }
      return false;
    }
    const isLt2M = file.size / 1024 < (props.maxSize || 1024);

    if (!isLt2M) {
      if (showMsg) {
        setIsShow(false);
        message.error('文件大小不能超过200KB');
      }
      return false;
    } else {
      setIsShow(true);
    }
    return isJpgOrPng && isLt2M;
  };
  /**
   * 图片上传中处理函数
   */
  const handleChange: UploadProps['onChange'] = async (info: any) => {
    if (isShow) {
      const { fileList, file } = info;
      setFileLists(fileList);
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

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>上传</div>
    </div>
  );
  return (
    <>
      <ImgCrop rotate>
        <Upload
          name="file"
          listType="picture-card"
          beforeUpload={(file: RcFile) => checkFile(file, true)}
          fileList={fileLists}
          onPreview={handlePreview}
          onChange={handleChange}
        >
          {fileLists.length >= 1 ? null : uploadButton}
        </Upload>
      </ImgCrop>
      <Modal open={previewVisible} footer={null} onCancel={() => setPreviewVisible(false)}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );
};

export default UploadLogo;
