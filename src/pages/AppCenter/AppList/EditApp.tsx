import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { history } from 'umi';
import { PageLoading } from '@ant-design/pro-layout';
import EditAppDetails from './components/EditAppDetails';
// import EditAppGateways from './components/EditAppGateways';
import EditAppSso from './components/EditAppSso';
// import EditAppAuthorities from './components/EditAppAuthorities';
import { Card, Tabs } from 'antd';
import { getAppInfo } from './service';
import { AppInfoType } from './data';
import EditAppAuthorities from './components/EditAppAuthorities';
// const TabPane = Tabs.TabPane;
const EditApp: React.FC = (props: any) => {
  const { location } = props;
  const { query } = location;
  const { id, tabkey, marketIdent } = query;
  const [appInfo, setAppInfo] = useState<AppInfoType>();
  const [loading, setLoading] = useState(false);
  const [selectKey, setSelectKey] = useState('1');
  const [zid, setZid] = useState('');
  const handleGetAppInfo = async () => {
    if (id) {
      setLoading(true);
      await getAppInfo({ client_id: id })
        .then(async (res) => {
          if (res) {
            setAppInfo(res);
          }
        })
        .finally(() => setLoading(false));
    }
  };
  const onSelect = (key: string) => {
    setSelectKey(key);
  };
  useEffect(() => {
    handleGetAppInfo();
    if (tabkey) {
      onSelect(tabkey);
    }
  }, [id, tabkey]);
  if (loading) {
    return <PageLoading />;
  }
  const mergeAppDetail = (data: any) => {
    setAppInfo({
      ...appInfo,
      ...data,
    });
  };
  const onSuccessAdd = (appId: string) => {
    history.push('/apps/list/appEdit?id=' + appId + '&tabkey=2');
  };

  if (!id || marketIdent) {
    return (
      <PageContainer title={false}>
        <Card>
          {/* <EditAppDetails id={id} appInfo={appInfo} onSave={onSuccessAdd} /> */}
          <EditAppDetails id={id} appInfo={appInfo} onSave={onSuccessAdd} />
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer title={false}>
      <Card>
        <Tabs
          defaultActiveKey="1"
          activeKey={selectKey}
          style={{ padding: '0 20px' }}
          onChange={onSelect}
          items={[
            {
              label: `应用基本信息`,
              key: '1',
              children: (
                <EditAppDetails
                  id={id}
                  appInfo={appInfo}
                  onSave={(val: any) => {
                    setZid(val);
                    onSelect('2');
                  }}
                />
              ),
            },
            {
              label: `单点配置`,
              key: '2',
              children: (
                <EditAppSso
                  client_id={marketIdent ? zid : id}
                  appDetail={appInfo}
                  mergeAppDetail={mergeAppDetail}
                  onClose={() => {
                    setSelectKey('1');
                  }}
                />
              ),
            },
            {
              label: `授权范围`,
              key: '4',
              children: <EditAppAuthorities id={marketIdent ? zid : id} />,
            },
          ]}
        ></Tabs>
      </Card>
    </PageContainer>
  );
};
export default EditApp;
