import React from 'react';
import { Form, Input, Button, Select, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { t } from '@/utils/common.utils';
// import { showErrorMessage, t } from '@/utils/common.utils';
// import type { NamePath } from 'antd/lib/form/interface';

const { Option, OptGroup } = Select;

export type ItemProps = {
  attrValueTips: any;
  dataParamName: string;
  displayNameUtilPrefix: string;
  basicAttrs: any;
  extendAttrs: any;
};

const LinkerDingMapAttrsComponent: React.FC<ItemProps> = (props) => {
  const render = () => {
    const { basicAttrs, extendAttrs, displayNameUtilPrefix, dataParamName } = props;
    const formItemLayout = {
      labelCol: {
        span: '12',
        offset: '4',
      },
      wrapperCol: {
        span: '24',
        offset: '4',
      },
    };
    let formItems = null;
    if (basicAttrs.length > 0) {
      formItems = (
        <Form.List name={dataParamName}>
          {(fields, { add, remove }) => {
            return (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item {...restField} name={[name, 'fieldName']}>
                      <Input style={{ marginLeft: '195px', width: '300px', height: '32px' }} />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, 'fieldValue']}>
                      <Select
                        style={{ marginLeft: '10px', width: '300px', height: '32px' }}
                        allowClear={true}
                        placeholder="请选择"
                      >
                        <OptGroup label="基本参数">
                          {basicAttrs.map(
                            (basAttr: {
                              domain_name: string | number | undefined;
                              display_name: string | undefined;
                            }) => {
                              return (
                                <Option
                                  key={basAttr.domain_name}
                                  value={basAttr.domain_name || ''}
                                  title={basAttr.display_name}
                                >
                                  <span style={{ display: 'inline-block' }}>
                                    {' '}
                                    {t(`${displayNameUtilPrefix}` + basAttr.domain_name) ||
                                      basAttr.display_name}
                                  </span>
                                </Option>
                              );
                            },
                          )}
                        </OptGroup>
                        <OptGroup label="扩展属性">
                          {extendAttrs.map(
                            (extAttr: {
                              domain_name: string | number | undefined;
                              display_name: string | undefined;
                            }) => {
                              return (
                                <Option
                                  key={extAttr.domain_name}
                                  value={extAttr.domain_name || ''}
                                  title={extAttr.display_name}
                                >
                                  {extAttr.display_name}
                                </Option>
                              );
                            },
                          )}
                        </OptGroup>
                      </Select>
                    </Form.Item>
                    <MinusCircleOutlined
                      style={{ marginLeft: '20px' }}
                      onClick={() => remove(name)}
                    />
                  </Space>
                ))}
                {
                  <Form.Item {...formItemLayout}>
                    <Button
                      type="dashed"
                      onClick={add}
                      style={{ marginLeft: '20px', width: '40%' }}
                    >
                      <PlusOutlined />
                      增加
                    </Button>
                  </Form.Item>
                }
              </>
            );
          }}
        </Form.List>
      );
    } else {
      return <Select style={{ width: '100%' }} allowClear={true} placeholder="用户属性" />;
    }
    return <div>{formItems}</div>;
  };
  return render();
};
export default LinkerDingMapAttrsComponent;
