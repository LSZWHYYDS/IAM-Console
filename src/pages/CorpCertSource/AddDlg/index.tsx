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
  // AD  windows AD
  // LDAP  LDAP
  // DINGDING  钉钉
  // WEWORK  企业微信
  // FEISHU   飞书
  // AZUREAD  azure AD
  // OAUTH2   Oauth2
  // OIDC  OIDC
  const types = [
    {
      title: 'Windows AD',
      desc: '标准协议',
      typeCode: 'AD',
      imgName: 'ad.png',
    },
    {
      title: 'OIDC',
      desc: '标准协议',
      typeCode: 'OIDC',
      imgName: 'oidc.png',
    },
    {
      title: '钉钉',
      desc: '企业应用',
      typeCode: 'DINGDING',
      imgName: 'dingding.png',
    },
    // { 暂时还没有
    //   title: '企业微信',
    //   desc: '办公应用',
    //   typeCode: 'WEWORK',
    //   imgName: 'wework.png',
    // },
    {
      title: 'AD Azure',
      desc: '企业应用',
      typeCode: 'AZUREAD',
      imgName: 'azure.png',
    },
    {
      title: '飞书',
      desc: '企业应用',
      typeCode: 'FEISHU',
      imgName: 'feishu.png',
    },
    {
      title: 'Oauth2',
      desc: '标准协议',
      typeCode: 'OAUTH2',
      imgName: 'oauth2.png',
    },
    {
      title: 'LDAP',
      desc: '标准协议',
      typeCode: 'LDAP',
      imgName: 'ldap.png',
    },
    {
      title: 'CAS',
      desc: '标准协议',
      typeCode: 'CAS',
      imgName: 'cas.png',
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
              justifyContent: 'start',
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
              justifyContent: 'start',
              flexWrap: 'wrap',
            }}
          >
            {filtered.map((item) => {
              return (
                <div key={item.typeCode} style={{ marginTop: 10, width: '23%', marginRight: '2%' }}>
                  <OneTypeDesc
                    title={item.title}
                    desc={item.desc}
                    typeCode={item.typeCode}
                    certType={certType}
                    imgName={item.imgName}
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
