// import { getTwoDates } from '@/utils/common.utils';
// import { ProFormDatePicker } from '@ant-design/pro-form';
import { Checkbox, Col, DatePicker, Form, Input, Radio, Row, Select } from 'antd';
// import moment from 'moment';
import React from 'react';

const { RangePicker } = DatePicker;

type RulesType = {
  required: boolean;
  message: string;
}[];
type optionsType = {
  value: string;
  label: string;
};

type DateTypes = {
  label: string;
  name: string;
  rules: RulesType;
  controlType: string;
  placeholder?: string;
  checkOptions?: optionsType[];
  RadioOptions?: optionsType[];
  checkboxOptions?: optionsType[];
  options?: optionsType[];
};

type DataType = {
  arr: DateTypes[][];
  address?: any;
};

const DynamicRender: React.FC<DataType> = (props) => {
  const renderControl = () => {
    return props?.arr?.map((mapIs, mapIx) => {
      return (
        <div style={{ width: '70%', margin: '0 auto' }} key={mapIx}>
          <Row>
            <Col span={24} style={{ position: 'relative', left: -13 }}>
              <Form.Item
                name={'address'}
                label={'访问地址'}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 18 }}
                initialValue={
                  window?.location?.origin +
                  '/iam/other/' +
                  sessionStorage.getItem('transformClient') +
                  '/login'
                }
              >
                <Input bordered={false} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row justify="space-between">
            {mapIs?.map?.((forIs, forIx) => {
              if (forIs?.controlType === 'input') {
                return (
                  <Col span={11} key={forIx}>
                    <Form.Item
                      name={forIs?.name}
                      label={forIs?.label}
                      rules={forIs?.rules}
                      labelCol={{ span: 8 }}
                      wrapperCol={{ span: 18 }}
                    >
                      <Input placeholder={forIs?.placeholder} />
                    </Form.Item>
                  </Col>
                );
              }
              if (forIs?.controlType === 'select') {
                return (
                  <Col span={11} key={forIx}>
                    <Form.Item
                      name={forIs?.name}
                      label={forIs?.label}
                      rules={forIs?.rules}
                      labelCol={{ span: 8 }}
                      wrapperCol={{ span: 18 }}
                    >
                      <Select
                        allowClear
                        options={forIs?.options}
                        placeholder={forIs?.placeholder}
                      />
                    </Form.Item>
                  </Col>
                );
              }
              if (forIs?.controlType === 'radioBox') {
                return (
                  <Col span={11} key={forIx}>
                    <Form.Item
                      name={forIs?.name}
                      label={forIs?.label}
                      rules={forIs?.rules}
                      labelCol={{ span: 8 }}
                      wrapperCol={{ span: 18 }}
                    >
                      <Radio.Group options={forIs?.options} />
                    </Form.Item>
                  </Col>
                );
              }
              if (forIs?.controlType === 'checkBox') {
                return (
                  <Col span={11} key={forIx}>
                    <Form.Item
                      name={forIs?.name}
                      label={forIs?.label}
                      rules={forIs?.rules}
                      labelCol={{ span: 8 }}
                      wrapperCol={{ span: 18 }}
                    >
                      <Checkbox.Group options={forIs?.options} />
                    </Form.Item>
                  </Col>
                );
              }
              if (forIs?.controlType === 'datePick') {
                return (
                  <Col span={12} key={forIx}>
                    <Form.Item
                      name={['times', forIs?.name]}
                      label={forIs?.label}
                      rules={forIs?.rules}
                      labelCol={{ span: 8 }}
                      wrapperCol={{ span: 18 }}
                    >
                      <RangePicker style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                );
              }
              return;
            })}
          </Row>
        </div>
      );
    });
  };
  return <>{renderControl()}</>;
};
export default DynamicRender;
