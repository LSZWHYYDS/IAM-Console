import { PageContainer } from '@ant-design/pro-layout';
import { Card } from 'antd';
import React from 'react';
import EditLinker from './EditLinker';
import EditAzure from './EditAzure';
import EditAddrBookInte from './EditAddrBookInte';
import EditExcel from './EditExcel';
import Scim from './Scim';
const CreateOrEditLinker: React.FC = (props: any) => {
  const getComp = () => {
    const { location }: any = props;
    const { query } = location;

    switch (query.type) {
      case 'ETL':
        return <EditAddrBookInte location={location} />;
      case 'AZUREAD':
        return <EditAzure type={query.type} location={location} />;
      case 'SCIM':
        // Azure AD  和SCIM  的界面一样
        return <Scim type={query.type} location={location} />;
      case 'EXCEL':
        return <EditExcel />;
      default:
        return <EditLinker type={query.type} location={location} />;
    }
  };
  return (
    <PageContainer title={false}>
      <Card>{getComp()}</Card>
    </PageContainer>
  );
};
export default CreateOrEditLinker;
