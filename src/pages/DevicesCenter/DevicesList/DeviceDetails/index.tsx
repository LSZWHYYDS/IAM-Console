import React, { useEffect, useState } from 'react';
import { Drawer, Card, Descriptions, message } from 'antd';
import { PageLoading } from '@ant-design/pro-layout';
import { getDeviceDetails } from '../../service';
import type { DeviceDetailsType } from '../../data';
import styles from './style.less';

interface DrawerProps {
  drawerVisible: boolean;
  onClose: (flag?: boolean) => void;
  id: string;
}

const DeviceDetails: React.FC<DrawerProps> = (props) => {
  const { drawerVisible, onClose: setDrawerVisible, id } = props;
  const [loading, setLoading] = useState(true);
  const [deviceDetails, setDeviceDetails] = useState<DeviceDetailsType>();
  const handleGetDeviceDetails = async () => {
    await getDeviceDetails(id)
      .then(async (res) => {
        if (res.code === '0' && res.data) {
          setDeviceDetails(res.data);
        } else {
          message.error('获取设备详情失败，请重试');
        }
      })
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    handleGetDeviceDetails();
  }, [id]);

  return (
    <Drawer
      title={'设备详情'}
      closable={true}
      width={'50%'}
      bodyStyle={{ backgroundColor: '#f1f2f6' }}
      open={drawerVisible}
      onClose={() => {
        setDrawerVisible(false);
      }}
    >
      {!loading ? (
        <>
          <Card title="基础信息" className={styles.deviceDetails} style={{ marginBottom: '24px' }}>
            <Descriptions column={2}>
              <Descriptions.Item label="设备类型">{deviceDetails?.os}</Descriptions.Item>
              <Descriptions.Item label="系统版本">
                {deviceDetails?.versionNum || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="登录状态">
                {deviceDetails?.onlineFlag === 1 ? '在线' : '不在线'}
              </Descriptions.Item>
              <Descriptions.Item label="设备管理">
                {deviceDetails?.enablePermissionGuide === 1 ? '弱管控' : '强管控'}
              </Descriptions.Item>
              <Descriptions.Item label="违规信息">
                {deviceDetails?.violationCauses || '未违规'}
              </Descriptions.Item>
              <Descriptions.Item label="用户姓名">
                {deviceDetails?.user && deviceDetails?.user.userName
                  ? deviceDetails?.user.userName
                  : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="最后上线时间">
                {deviceDetails?.lastOnlineTime}
              </Descriptions.Item>
              <Descriptions.Item label="UMID">
                {deviceDetails?.udid || deviceDetails?.idfa}
              </Descriptions.Item>
            </Descriptions>
          </Card>
          <Card title="硬件信息" className={styles.deviceDetails}>
            <Descriptions column={2}>
              <Descriptions.Item label="设备厂商">
                {deviceDetails?.manufacturer || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="RAM">{deviceDetails?.ram || '-'}</Descriptions.Item>
              <Descriptions.Item label="WIFI MAC地址">
                {deviceDetails?.wifiMac || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="设备型号">{deviceDetails?.model || '-'}</Descriptions.Item>
              <Descriptions.Item label="ROM总容量">
                {deviceDetails?.romCapacity || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="电源状态">
                {deviceDetails?.powerStatus || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="CPU">{deviceDetails?.cpu || '-'}</Descriptions.Item>
              <Descriptions.Item label="设备序列号">
                {deviceDetails?.serialNum || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="系统Build号">
                {deviceDetails?.buildNumber || '-'}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </>
      ) : (
        <PageLoading />
      )}
    </Drawer>
  );
};

export default DeviceDetails;
