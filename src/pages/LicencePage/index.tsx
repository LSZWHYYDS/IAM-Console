/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Row, Card } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import FormText from '@/components/FormText';
import LicItem from './LicItem';
import SDKList from './SDKList';
import { tenantLicense } from './service';

const LicencePage: React.FC = () => {
  const defaultLic = {
    adm: {
      checked_value: false,
      dates: [],
    },
    app_sso: {
      checked_value: false,
      dates: [],
    },
    dlp: {
      checked_value: false,
      dates: [],
      sdk_num: 0,
    },
    file_audit: {
      checked_value: false,
      dates: [],
    },
    gateway: {
      checked_value: false,
      dates: [],
    },
    risk_monitor: {
      checked_value: false,
      dates: [],
    },
    user_join: {
      checked_value: false,
      dates: [],
    },
  };
  const [licenseNum, setLicenseNum] = useState(0);
  const [licData, setLicData] = useState(defaultLic);
  const loadData = async () => {
    await tenantLicense().then(async (res) => {
      setLicData((res && res.data && res.data.license_config) || defaultLic);
      setLicenseNum((res && res.data && res.data.license_num) || 0);
    });
  };

  useEffect(() => {
    loadData();
  }, []);
  const getPermit = () => {
    return (
      <Card title="基础授权信息">
        <Row>
          <FormText label="授权用户" value={`${licenseNum}人`} />
        </Row>
        <Row>授权模块</Row>
        <Row style={{ marginLeft: 100 }}>
          <LicItem label="授权模块" label1="授权时间" />
          <LicItem label="授权模块" label1="授权时间" />
        </Row>
        <Row style={{ marginLeft: 100 }}>
          <LicItem label="用户连接" data={licData.user_join} />
          <LicItem label="应用SSO" data={licData.app_sso} />
          <LicItem label="安全基线监测/设备准入" data={licData.risk_monitor} />
          <LicItem label="文件审计" data={licData.file_audit} />
          <LicItem label="应用分发" data={licData.adm} />
          <LicItem label="数据防泄漏" data={licData.dlp} />
          <LicItem label="安全接入网关" data={licData.gateway} />
        </Row>
      </Card>
    );
  };

  return (
    <PageContainer title={false}>
      <Card>
        {getPermit()}
        {licData.dlp.checked_value && <SDKList sdkNum={licData.dlp.sdk_num} />}
      </Card>
    </PageContainer>
  );
};

export default LicencePage;
