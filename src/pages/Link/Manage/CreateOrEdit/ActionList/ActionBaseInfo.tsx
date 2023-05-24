import { Col, Form, Input, Row, Select, Card } from 'antd';
import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { addAction, editAction, getAction } from '@/pages/Link/Manage/service';
import { showErrorMessage, showSuccessMessage } from '@/utils/common.utils';
import _ from 'lodash';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 },
};

const ActionBaseInfo: React.FC = (props: any, ref) => {
  const { query } = props;
  const { actionId, linkId } = query;
  const [data, setData] = useState<any>({});
  const [formBasic] = Form.useForm();
  const loadData = () => {
    if (actionId) {
      getAction(actionId).then((resp: any) => {
        const obj = resp.data;
        setData(obj);
        formBasic.setFieldsValue(obj);
      });
    }
  };
  useEffect(() => {
    loadData();
  }, []);
  useImperativeHandle(ref, () => ({
    onSave: async (callback) => {
      const basicData = await formBasic.validateFields();
      const newData = _.cloneDeep(data);
      const dataObj = _.merge(newData, basicData);
      dataObj.api_link_id = linkId;
      dataObj.status = 1;
      let p;
      if (!actionId) {
        p = addAction(dataObj);
      } else {
        p = editAction(actionId, dataObj);
      }
      p.then((res) => {
        showSuccessMessage();
        if (typeof callback === 'function') {
          callback(res.data);
        }
      }).catch((error) => {
        showErrorMessage(error);
      });
    },
  }));
  const renderBasicForm = () => {
    return (
      <Card bordered={false}>
        <Form form={formBasic}>
          <Row>
            <Col span="24">
              <FormItem
                name="name"
                label="执行动作名称"
                rules={[{ required: true, message: '请输入' }]}
                {...formItemLayout}
              >
                <Input type="text" />
              </FormItem>
            </Col>
            <Col span="24">
              <FormItem name="description" label="描述" {...formItemLayout}>
                <Input.TextArea />
              </FormItem>
            </Col>
            <Col span="24">
              <FormItem
                name={['config', 'api_schema', 'content_type']}
                label="Content Type"
                {...formItemLayout}
                // initialValue={'application/json'}
              >
                <Select
                  options={[
                    {
                      label: 'application/json',
                      value: 'application/json',
                    },
                    {
                      label: 'x-www-form-urlencoded',
                      value: 'x-www-form-urlencoded',
                    },
                  ]}
                />
              </FormItem>
            </Col>
            <Col span="24">
              <Form.Item label="接口地址" {...formItemLayout}>
                <Input.Group compact>
                  <Form.Item
                    name={['config', 'api_schema', 'http_method']}
                    noStyle
                    rules={[{ required: true, message: 'api类型必填' }]}
                    // initialValue={'GET'}
                  >
                    <Select
                      placeholder="请选择api类型"
                      style={{ width: '25%' }}
                      options={['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE'].map((item) => {
                        return {
                          label: item,
                          value: item,
                        };
                      })}
                    />
                  </Form.Item>
                  <Form.Item
                    name={['config', 'api_schema', 'endpoint']}
                    noStyle
                    rules={[{ required: true, message: '接口地址必填' }]}
                  >
                    <Input style={{ width: '75%' }} placeholder="请输入接口地址" />
                  </Form.Item>
                </Input.Group>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    );
  };
  return renderBasicForm();
};

export default forwardRef(ActionBaseInfo);
