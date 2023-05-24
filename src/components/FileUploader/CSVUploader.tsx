import { Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

const { Dragger } = Upload;

interface CsvUploaderProps {
  type?: string;
  maxCount: number;
  onChange: (data: string[]) => void;
}

const CSVUploader: React.FC<CsvUploaderProps> = (props) => {
  const { type, maxCount, onChange } = props;
  // 检查手机号和邮箱格式
  const validateEmailOrPhone = (str: string) => {
    if (type === 'phone' && /^1[3-9]\d{9}$/.test(str)) {
      return true;
    }

    if (type === 'email' && /^[0-9a-zA-Z_.-]+[@][0-9a-zA-Z_.-]+([.][a-zA-Z]+){1,2}$/.test(str)) {
      return true;
    }
    return false;
  };

  // 处理 CSV 文件
  const customRequest = (option: any) => {
    const reader = new FileReader();
    const inviteType = type === 'phone' ? '手机号' : '邮箱';
    reader.readAsText(option.file);
    reader.onload = async (e: any) => {
      const fileData = e.target && e.target.result ? e.target.result.split('\n') : [];
      fileData.shift();
      if (fileData.length > 0) {
        const targets: string[] = [];

        // 判断数据长度
        if (fileData.length > maxCount) {
          message.error(`${inviteType}数量超过${maxCount}，请检查后重新上传`);
          option.onError();
        }

        // 校验手机号或邮箱
        let validStatus = true;
        await fileData.map(async (item: string) => {
          const target = item.replace('\r', '');
          const isValid = validateEmailOrPhone(target);
          if (!isValid) {
            message.error(`文件包含非法${inviteType}，请检查后重新上传`);
            validStatus = false;
          } else {
            targets.push(target);
          }
        });

        if (validStatus) {
          onChange(targets);
          option.onSuccess();
        } else {
          option.onError();
        }
      } else {
        message.error(`${inviteType}未包含合法数据，请检查后重新上传`);
        option.onError();
      }
    };
  };

  const UploadProps = {
    name: 'file',
    accept: '.csv',
    multiple: false,
    customRequest,
  };

  return (
    <Dragger {...UploadProps}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">将文件拖到此处，或点击上传</p>
      <p className="ant-upload-hint">
        接收{type === 'phone' ? '手机号' : '邮箱'}需以文件形式提交，仅支持 csv 文件
      </p>
    </Dragger>
  );
};
export default CSVUploader;
