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
  const { onClose, onSubmit } = props;
  const [certType, setCertType] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const types = [
    {
      title: '钉钉',
      desc: '企业应用',
      typeCode: 'DINGDING',
    },
    {
      title: 'LDAP',
      desc: '标准协议',
      typeCode: 'LDAP',
    },
    {
      title: 'SCIM',
      desc: '标准协议',
      typeCode: 'SCIM',
      imgName: 'saml',
      toDev: true,
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
          <Button type="link" icon={<LeftOutlined />} onClick={onClose}>
            返回
          </Button>
        </Col>
        <Col span={10}>创建同步链接器</Col>
      </Row>
    );
    return (
      <Card title={title}>
        <Form>
          <Row justify="center">
            <Col span={21}>
              <Input.Search onSearch={onSearch} enterButton="搜索" />
            </Col>
          </Row>
          <Row className="mt-20" justify="space-around">
            {filtered.map((item) => {
              return (
                <Col span={5} key={item.typeCode}>
                  <OneTypeDesc
                    title={item.title}
                    desc={item.desc}
                    typeCode={item.typeCode}
                    certType={certType}
                    toDev={item.toDev}
                    onTypeChange={onTypeChange}
                  />
                </Col>
              );
            })}
          </Row>
        </Form>
      </Card>
    );
  };
  return render();
};
export default AddDialog;
