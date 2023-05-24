import type { FC } from 'react';
import moment from 'moment';
import { useState, useEffect } from 'react';
import type { AppType, CdKeyType } from '@/pages/AppCenter/data';
import {
  Button,
  Card,
  Descriptions,
  Divider,
  Space,
  Avatar,
  Empty,
  message,
  Typography,
} from 'antd';
import { SyncOutlined, LoadingOutlined } from '@ant-design/icons';
import { formatDeviceType } from '@/utils/common.utils';
import { getCdKeySummary, getDefaultApp, getAppList } from '@/pages/AppCenter/service';
import styles from '../style.less';
import RedeemManagement from './RedeemManagement';
import AppList from './AppList';
import RedeemList from './RedeemList';

const { Paragraph } = Typography;
const { Meta } = Card;

const AppInfoPage: FC = () => {
  const [appInfo, setAppInfo] = useState<AppType>();
  const [cdKey, setCdKey] = useState<CdKeyType>();
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [redeemManagementVisiable, handleRedeemManagementVisiable] = useState<boolean>(false);
  const [appListVisiable, handleAppListVisiable] = useState<boolean>(false);
  const [redeemListVisible, handleRedeemListVisible] = useState<boolean>(false);

  // 获取默认应用
  const handleGetDefaultApp = async () => {
    setLoading(true);
    try {
      const result = await getDefaultApp();
      setAppInfo(result.data);
      setLoading(false);
      return true;
    } catch (error) {
      setLoading(false);
      return false;
    }
  };

  // 获取 cdKeySummary
  const handleGetCdKey = async () => {
    try {
      const result = await getCdKeySummary();
      setCdKey(result.data);
      return true;
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    handleGetDefaultApp();
    handleGetCdKey();
  }, []);

  // 刷新应用信息
  const handleRefreshList = async () => {
    const hide = message.loading('正在刷新');
    setRefreshing(true);
    await getAppList({ refresh: true })
      .then((res: any) => {
        if (res.code === '0') {
          res.data.forEach((app: AppType) => {
            if (app.defaultApp) {
              setAppInfo(app);
            }
          });
          hide();
          message.success('刷新成功');
        }
        hide();
        message.error('刷新失败，请重试');
      })
      .finally(() => {
        setRefreshing(false);
      });
  };

  return (
    <>
      <Card
        title="应用信息"
        bordered={false}
        loading={loading}
        className={styles.appInfoCard}
        extra={
          <Space>
            <Button
              type={'primary'}
              onClick={() => {
                handleRedeemManagementVisiable(true);
              }}
            >
              授权管理
            </Button>
            <Button
              onClick={() => {
                handleAppListVisiable(true);
              }}
            >
              应用选择
            </Button>
          </Space>
        }
      >
        {appInfo ? (
          <>
            <Meta
              avatar={<Avatar size={64} shape="square" src={appInfo.icon} />}
              title={appInfo.name || '未设置应用名称'}
              description={
                <Paragraph
                  ellipsis={{ rows: 2, expandable: true }}
                  style={{ whiteSpace: 'pre-line', color: '#6a6a6a' }}
                >
                  {appInfo.description || '未设置应用描述'}
                </Paragraph>
              }
            />
            <Divider style={{ marginBottom: 32 }} />
            <Descriptions title="详细信息" style={{ marginBottom: 32 }}>
              <Descriptions.Item label="供应商">{appInfo.company}</Descriptions.Item>
              <Descriptions.Item label="大小">
                {appInfo.appSize ? `${Math.round(appInfo.appSize / 1024 / 1024)}MB` : '--'}
              </Descriptions.Item>
              <Descriptions.Item label="当前版本">{appInfo.version}</Descriptions.Item>
              <Descriptions.Item label="兼容性">
                系统要求：{appInfo.osVersion || '--'}
                <br />
                兼容设备：{appInfo.modelType ? formatDeviceType(appInfo.modelType) : '--'}
              </Descriptions.Item>
              <Descriptions.Item label="语言">{appInfo.language || '简体中文'}</Descriptions.Item>
              <Descriptions.Item label="应用程序ID">{appInfo.pkgName}</Descriptions.Item>
            </Descriptions>
            <Divider style={{ marginBottom: 32 }} />
            <Descriptions title="授权信息" column={1}></Descriptions>
            <div className={styles.section}>
              <h4>
                <Space>
                  <span>VPP Code 兑换码状态</span>
                  <Button
                    type="primary"
                    size="small"
                    onClick={() => {
                      handleRedeemListVisible(true);
                    }}
                  >
                    查看详情
                  </Button>
                </Space>
              </h4>
              <div className={styles.sectionItem}>
                <span className={styles.sectionLabel}>已用/总数量: </span>
                <span className={styles.sectionContent}>
                  {cdKey?.assignedNum}/{cdKey?.totalNum}{' '}
                </span>
              </div>
              <div className={styles.sectionItem}>
                <span className={styles.sectionLabel}>导入时间: </span>
                <span className={styles.sectionContent}>
                  {moment(cdKey?.lastUploadTime).format('YYYY-MM-DD HH:mm:ss')}
                </span>
              </div>
            </div>
            <Divider style={{ marginBottom: 32 }} />
            <div className={styles.section}>
              <h4>
                <Space>
                  <span>Managed 授权码状态</span>
                  <Button
                    size="small"
                    onClick={() => {
                      handleRefreshList();
                    }}
                  >
                    {refreshing ? <LoadingOutlined /> : <SyncOutlined />}
                  </Button>
                </Space>
              </h4>
              <div className={styles.sectionItem}>
                <span className={styles.sectionLabel}>可用/可兑换数量: </span>
                <span className={styles.sectionContent}>
                  {appInfo.availableCount}/{appInfo.totalCount || '0'}
                </span>
              </div>
              <div className={styles.sectionItem}>
                <span className={styles.sectionLabel}>导入时间: </span>
                <span className={styles.sectionContent}>
                  {moment(appInfo.updateTime).format('YYYY-MM-DD HH:mm:ss')}
                </span>
              </div>
            </div>
          </>
        ) : (
          <Empty description={'您还没有上传任何应用'}></Empty>
        )}
      </Card>
      {cdKey ? (
        <RedeemManagement
          onClose={() => {
            handleRedeemManagementVisiable(false);
          }}
          onDownloadRedeemCode={() => {
            handleGetCdKey();
          }}
          cdKeySummary={cdKey || {}}
          redeemManagementVisiable={redeemManagementVisiable}
        />
      ) : null}
      <AppList
        onClose={() => {
          handleAppListVisiable(false);
        }}
        onDefaultAppChanged={() => {
          handleGetDefaultApp();
        }}
        appListVisiable={appListVisiable}
      />
      <RedeemList
        onClose={() => {
          handleRedeemListVisible(false);
        }}
        redeemListVisible={redeemListVisible}
      />
    </>
  );
};
export default AppInfoPage;
