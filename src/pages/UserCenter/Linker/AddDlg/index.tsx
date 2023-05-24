import { LeftOutlined } from '@ant-design/icons';
import { Col, Card, Form, Row, Input, Button } from 'antd';
import React, { useState } from 'react';
import OneTypeDesc from './OneTypeDesc';

export type ItemProps = {
  visible: boolean;
  onSubmit: (type: string) => void;
  onClose: () => void;
};

const AddDialog: React.FC<ItemProps> = (props: any) => {
  const { onClose: setVisible, onSubmit } = props;
  const [certType, setCertType] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const types = [
    {
      title: 'Windows AD',
      desc: '标准协议',
      typeCode: 'AD',
      imgName: 'ad.png',
    },
    {
      title: 'ETL',
      desc: 'ETL',
      typeCode: 'ETL',
      imgName: 'etl.png',
    },
    {
      title: '钉钉',
      desc: '企业应用',
      typeCode: 'DINGDING',
      imgName: 'dingding.png',
    },
    {
      title: 'Excel',
      desc: 'Excel',
      typeCode: 'EXCEL',
      imgName: 'etl.svg',
    },
    {
      title: '飞书',
      desc: '企业应用',
      typeCode: 'FEISHU',
      imgName: 'feishu.png',
      toDev: true,
    },
    {
      title: 'LDAP   ',
      desc: '标准协议',
      typeCode: 'LDAP',
      imgName: 'ldap.png',
    },
    {
      title: 'AzureAD',
      desc: '企业应用',
      typeCode: 'AZUREAD',
      imgName: 'azure.png',
    },
    {
      title: 'SCIM',
      desc: '标准协议',
      typeCode: 'SCIM',
      imgName: 'scim.png',
    },
  ];
  const onTypeChange = (type: any) => {
    setCertType(type);
    onSubmit(type);
  };
  const onSearch = (value: string) => {
    setSearchValue(value);
  };
  const render = () => {
    const filtered =
      (searchValue &&
        types.filter((item) => {
          const value = searchValue.toLowerCase();
          return (
            item.typeCode.toLowerCase().includes(value) ||
            item.title.toLowerCase().includes(value) ||
            item.desc.toLowerCase().includes(value)
          );
        })) ||
      types;
    const title = (
      <Row>
        <Col span={24}>
          <Button
            type="link"
            icon={<LeftOutlined />}
            onClick={() => {
              setVisible(false);
            }}
          >
            返回
          </Button>
        </Col>
        <Col span={5}>创建链接器类型</Col>
      </Row>
    );
    return (
      <Card title={title}>
        <Form>
          <div
            style={{
              width: '90%',
              margin: '0 auto',
              display: 'flex',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
            }}
          >
            <Input.Search onSearch={onSearch} style={{ width: '98%' }} enterButton="搜索" />
          </div>

          <div
            style={{
              width: '90%',
              margin: '0 auto',
              display: 'flex',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
            }}
          >
            {filtered.map((item) => {
              return (
                <div key={item.typeCode} style={{ marginTop: 10, width: '24%' }}>
                  <OneTypeDesc
                    title={item.title}
                    desc={item.desc}
                    typeCode={item.typeCode}
                    certType={certType}
                    imgName={item.imgName}
                    toDev={item.toDev}
                    onTypeChange={onTypeChange}
                  />
                </div>
              );
            })}
          </div>
        </Form>
      </Card>
    );
  };
  return render();
};
export default AddDialog;
