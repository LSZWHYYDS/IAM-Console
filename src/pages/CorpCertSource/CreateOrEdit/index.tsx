import { PageContainer } from '@ant-design/pro-layout';
import { Card } from 'antd';
import React from 'react';
import EditAzure from './EditAzure';
import EditDingDing from './EditDingDing';
import EditOIDC from './EditOIDC';
import EditADLDAP from './EditADLDAP';
import Cas from './Cas';
const CreateOrEditLinker: React.FC = (props: any) => {
  const getComp = () => {
    const { location } = props;
    const { query } = location;
    // AD  windows AD
    // LDAP  LDAP
    // DINGDING  钉钉
    // WEWORK  企业微信
    // FEISHU   飞书
    // AZUREAD  azure AD
    // OAUTH2   Oauth2
    // OIDC  OIDC
    // 企业微信也还没有
    switch (query.type) {
      //oauth2   飞书  AZURE
      case 'AZUREAD':
      case 'OAUTH2':
      case 'FEISHU':
        return <EditAzure location={location} />;
      case 'OIDC':
        return <EditOIDC location={location} />;
      case 'AD':
      case 'LDAP':
        return <EditADLDAP location={location} />;
      case 'CAS':
        return <Cas location={location} />;
      default:
        return <EditDingDing location={location} />;
    }
  };
  return (
    <PageContainer title={false}>
      <Card>{getComp()}</Card>
    </PageContainer>
  );
};
export default CreateOrEditLinker;
