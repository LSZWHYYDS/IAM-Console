import type { FC } from 'react';
import { useState, useEffect } from 'react';
import moment from 'moment';
import { Button, Card, Empty, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { getVppTokenInfo, uploadVppToken } from '@/pages/AppCenter/service';
import type { VppTokenType } from '@/pages/AppCenter/data';
import type { RcFile } from 'antd/lib/upload/interface';
import styles from '../style.less';

const TokenManagement: FC = () => {
  const [vppToken, setVppToken] = useState<VppTokenType>();
  const [loading, setLoading] = useState<boolean>();

  // 获取默认应用
  const handleGetVppToken = async () => {
    setLoading(true);
    try {
      const result = await getVppTokenInfo();
      setVppToken(result.data);
      setLoading(false);
      return true;
    } catch (error) {
      setLoading(false);
      return false;
    }
  };

  useEffect(() => {
    handleGetVppToken();
  }, []);

  const beforeUpload = (file: RcFile) => {
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('文件大小不能超过2MB!');
    }
    return isLt2M;
  };

  const customRequest = async (option: any) => {
    const hide = message.loading('正在上传');
    const reader = new FileReader();
    reader.readAsBinaryString(option.file);
    reader.onloadend = async (e: any) => {
      if (e && e.target && e.target.result) {
        option.onSuccess();
        const sToken = e.target.result;
        await uploadVppToken({ sToken })
          .then(async (res) => {
            if (res.code === '0') {
              hide();
              handleGetVppToken();
              message.success('上传成功');
            } else {
              hide();
              message.error('上传失败，请重试');
            }
          })
          .catch((error) => {
            message.error(error);
          });
      }
    };
  };

  const uploadTokenProps = {
    accept: '.vpptoken',
    customRequest,
    showUploadList: false,
    name: 'file',
    beforeUpload: (file: RcFile) => beforeUpload(file),
  };

  const uploadTokenBtn = () => {
    return (
      <Upload {...uploadTokenProps}>
        <Button type={'primary'}>
          <UploadOutlined /> 上传令牌
        </Button>
      </Upload>
    );
  };

  return (
    <Card
      title="令牌信息"
      bordered={false}
      loading={loading}
      className={styles.appInfoCard}
      style={{ minHeight: '60vh' }}
      extra={uploadTokenBtn()}
    >
      {vppToken ? (
        <div className={styles.section}>
          <div className={styles.sectionItem}>
            <span className={styles.sectionLabel}>组织信息: </span>
            <span className={styles.sectionContent}>{vppToken?.orgName}</span>
          </div>
          <div className={styles.sectionItem}>
            <span className={styles.sectionLabel}>过期时间: </span>
            <span className={styles.sectionContent}>
              {moment(vppToken?.expDate).format('YYYY-MM-DD HH:mm:ss')}
            </span>
          </div>
        </div>
      ) : (
        <Empty description={'您还没有上传令牌'}>{uploadTokenBtn()}</Empty>
      )}
    </Card>
  );
};
export default TokenManagement;
