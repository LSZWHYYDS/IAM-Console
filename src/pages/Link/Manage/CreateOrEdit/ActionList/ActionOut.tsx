import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { showErrorMessage, showSuccessMessage } from '@/utils/common.utils';
import { Button, Form, Input, Tabs, Select, Card, Space, Checkbox } from 'antd';
import React, { useEffect, useState, useRef, useImperativeHandle, forwardRef } from 'react';
import _ from 'lodash';
import { editAction, getAction } from '@/pages/Link/Manage/service';
import EventDetailParam from '@/pages/Link/Manage/Components/EventDetailParam';
import ParamMapping from '@/pages/Link/Manage/Components/ParamMapping';
import { genPlatFieldListFullName } from '@/utils/common.utils';

const ActionOut: React.FC = (props: any, ref) => {
  const { query } = props;
  const [formOut] = Form.useForm();
  const [condForm] = Form.useForm();

  const refMappingOut = useRef();
  const refHeader_out_api = useRef();
  const refBody_out_api = useRef();
  const refHeader_out_action = useRef();

  const refBody_out_action = useRef();
  const [data, setData] = useState<any>({});
  const [actionId, setAcationId] = useState(query?.actionId);
  const out_mapping = Form.useWatch('out_mapping', formOut);

  const loadData = () => {
    if (actionId) {
      getAction(actionId).then((resp: any) => {
        const obj = resp.data;
        setData(obj);

        let success_condition = _.get(obj, 'config.api_schema.success_condition');
        if (!success_condition || success_condition.length === 0) {
          success_condition = [
            {
              path: 'httpStatus',
              op: 'eq',
              value: '200',
            },
          ];
        }
        condForm.setFieldsValue({ success_condition });
        const output_schema = _.get(obj, 'config.output_schema');
        formOut.setFieldsValue({
          out_mapping: !!output_schema,
        });
      });
    } else {
      const success_condition = [
        {
          path: 'httpStatus',
          op: 'eq',
          value: '200',
        },
      ];
      condForm.setFieldsValue({ success_condition });
    }
  };
  useEffect(() => {
    setAcationId(query.actionId);
  }, [props]);
  useEffect(() => {
    loadData();
  }, [actionId]);
  const getFormData = async (callback: any) => {
    const basicData = _.cloneDeep(data);
    if (condForm) {
      const obj = await condForm.validateFields();
      _.set(basicData, 'config.api_schema.success_condition', obj.success_condition);
    }
    if (typeof callback === 'function') {
      callback(basicData);
    }
  };
  const onSubmit = (callback) => {
    getFormData((dataObj: any) => {
      function setParamsValue({ isMapping, refTable, fieldName, title }) {
        let schema = _.get(dataObj, 'config.' + fieldName);
        if (isMapping && refTable && refTable.current) {
          schema = refTable.current.getData();
          if (typeof schema === 'boolean') {
            showErrorMessage('请先填写参数名:' + title);
            return false;
          }
        } else if (!isMapping) {
          schema = null;
        }
        _.set(dataObj, 'config.' + fieldName, schema);
        return true;
      }

      if (refHeader_out_api && refHeader_out_api.current) {
        const fieldList = refHeader_out_api.current.getData();
        if (typeof fieldList === 'boolean') {
          showErrorMessage('请先填写：API入参-应答头-参数名。');
          return;
        }
        _.set(dataObj, 'config.api_schema.output_schema.header_schema', fieldList);
      }
      if (refBody_out_api && refBody_out_api.current) {
        const fieldList1 = refBody_out_api.current.getData();
        if (typeof fieldList1 === 'boolean') {
          showErrorMessage('请先填写：API入参-应答体-参数名。');
          return;
        }
        _.set(dataObj, 'config.api_schema.output_schema.body_schema', fieldList1);
      }
      if (out_mapping) {
        //执行动作出参数
        let valid = setParamsValue({
          isMapping: out_mapping,
          refTable: refHeader_out_action,
          fieldName: 'output_schema.header_schema',
          title: '执行动作出参-应答头',
        });
        if (!valid) {
          return;
        }
        valid = setParamsValue({
          isMapping: out_mapping,
          refTable: refBody_out_action,
          fieldName: 'output_schema.body_schema',
          title: '执行动作出参-应答体',
        });
        if (!valid) {
          return;
        }
      } else {
        dataObj.config.output_schema = null;
      }

      const p = editAction(actionId, dataObj);
      p.then(() => {
        showSuccessMessage();
        if (typeof callback === 'function') {
          callback();
        }
      }).catch((error) => {
        showErrorMessage(error);
      });
    });
  };

  useImperativeHandle(ref, () => ({
    onSave: async (callback) => {
      onSubmit(callback);
    },
  }));
  const renderrenderMappingCondOp = (index, remove) => {
    const conds = condForm.getFieldValue('success_condition');
    const cond = conds[index];
    if (!cond || cond.path !== 'httpStatus') {
      return <MinusCircleOutlined style={{ fontSize: 20 }} onClick={() => remove(index)} />;
    }
    return null;
  };
  const getDisableByPath = (index) => {
    const conds = condForm.getFieldValue('success_condition');
    const cond = conds[index];
    return cond && cond.path === 'httpStatus';
  };
  const renderMappingForm = () => {
    const outputList: any[] = [];
    const apiOutParamsHeader = _.get(data, 'config.api_schema.output_schema.header_schema') || {};
    const newObj1 = _.cloneDeep(apiOutParamsHeader);
    newObj1.name = 'header';
    newObj1.description = '应答头';
    outputList.push(newObj1);
    const apiOutParamsBody = _.get(data, 'config.api_schema.output_schema.body_schema') || {};
    const newObj2 = _.cloneDeep(apiOutParamsBody);
    newObj2.name = 'body';
    newObj2.description = '应答体';
    outputList.push(newObj2);
    const fieldList: any[] = genPlatFieldListFullName(outputList);
    fieldList.unshift({
      label: 'HTTP状态码',
      value: 'httpStatus',
      type: 'string',
      disabled: true,
    });
    return (
      <Card size="small" title="调用成功条件">
        <Form form={condForm} name="condForm" autoComplete="off">
          <Form.List name="success_condition">
            {(fields, { add, remove }) => (
              <>
                <Form.Item>
                  <Button
                    type="primary"
                    style={{ width: 200 }}
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    添加配置项
                  </Button>
                </Form.Item>
                {fields.map((field, index) => (
                  <div key={field.key}>
                    <Space key={field.key} align="baseline">
                      <Form.Item
                        noStyle
                        shouldUpdate={(prevValues, curValues) =>
                          JSON.stringify(prevValues) !== JSON.stringify(curValues)
                        }
                      >
                        {() => (
                          <Form.Item
                            {...field}
                            name={[field.name, 'path']}
                            rules={[{ required: true, message: '参数必填' }]}
                          >
                            <Select
                              style={{ width: 400 }}
                              options={fieldList}
                              disabled={getDisableByPath(index)}
                            />
                          </Form.Item>
                        )}
                      </Form.Item>
                      <Form.Item
                        {...field}
                        name={[field.name, 'op']}
                        rules={[{ required: true, message: '操作符必填' }]}
                      >
                        <Select
                          style={{ width: 130 }}
                          options={[
                            {
                              label: '等于',
                              value: 'eq',
                            },
                            {
                              labbel: '包含',
                              value: 'in',
                            },
                            {
                              labbel: 'co',
                              value: 'co',
                            },
                          ]}
                        />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        name={[field.name, 'value']}
                        rules={[{ required: true, message: '值必填' }]}
                      >
                        <Input style={{ width: 400 }} />
                      </Form.Item>
                      {renderrenderMappingCondOp(index, remove)}
                    </Space>
                  </div>
                ))}
              </>
            )}
          </Form.List>
        </Form>
      </Card>
    );
  };
  const onChangeParams = (list, field) => {
    const newData = _.cloneDeep(data);
    const newValue = _.cloneDeep(list[0]);
    newValue.name = 'root';
    _.set(newData, 'config.' + field, newValue);
    setData(newData);
  };
  const onChangeParamsRows = (list: any) => {
    const newData = _.cloneDeep(data);
    list.forEach((row) => {
      const { rootName } = row;
      const newRow = _.cloneDeep(row);
      newRow.name = 'root';
      delete newRow.rootName;
      _.set(newData, rootName, newRow);
    });
    setData(newData);
  };

  const getArrayFromObject = (fields: any, titles: any) => {
    const list: any[] = [];
    const newData = _.cloneDeep(data);
    fields.forEach((field: string, index: number) => {
      const value = _.get(newData, field);
      if (value) {
        const newValue = _.cloneDeep(value);
        newValue.rootName = field;
        const fieldList1 = field.split('.');
        const fieldList2 = _.last(fieldList1)?.split('_');
        newValue.name = _.first(fieldList2);
        newValue.description = titles[index];
        newValue.paraLevel = newValue.name;
        list.push(newValue);
      }
    });
    return list;
  };
  const onChangeOutParamsHeader = (list: any) => {
    const newData = _.cloneDeep(data);
    _.set(newData, 'config.output_schema.header_schema', list[0]);
    setData(newData);
  };
  const onChangeOutParamsBody = (list: any) => {
    const newData = _.cloneDeep(data);
    _.set(newData, 'config.output_schema.body_schema', list[0]);
    setData(newData);
  };
  const renderOutMapping = () => {
    if (!data.id) {
      return null;
    }
    const leftFields = [
      'config.api_schema.output_schema.header_schema',
      'config.api_schema.output_schema.body_schema',
      'config.api_schema.output_schema.query_schema',
      'config.api_schema.output_schema.path_schema',
    ];
    const leftLabel = ['应答头', '应答体', 'URL查询参数', 'URL路径参数'];
    const leftList = getArrayFromObject(leftFields, leftLabel);

    const rightFields = [
      'config.output_schema.header_schema',
      'config.output_schema.body_schema',
      'config.output_schema.query_schema',
      'config.output_schema.path_schema',
    ];
    const rightLabel = ['应答头', '应答体', 'URL查询参数', 'URL路径参数'];
    const rightList = getArrayFromObject(rightFields, rightLabel);
    return (
      <ParamMapping
        list={rightList}
        ref={refMappingOut}
        leftTableDataList={leftList}
        leftTitle="API出参"
        rightTitle="执行动作出参"
        onChange={(list: any) => {
          onChangeParamsRows(list);
        }}
      />
    );
  };
  const renderModelFormOutAction = () => {
    if (!data.id) {
      return null;
    }
    const header_schema_out = _.get(data, 'config.output_schema.header_schema');
    const body_schema_out = _.get(data, 'config.output_schema.body_schema');
    return (
      <Card
        size="small"
        title={
          <>
            执行动作出参
            <Form form={formOut}>
              <Form.Item label="启用出参映射" name="out_mapping" valuePropName="checked">
                <Checkbox />
              </Form.Item>
            </Form>
          </>
        }
      >
        {out_mapping && (
          <div>
            <Tabs
              defaultActiveKey="header"
              items={[
                {
                  key: 'header',
                  label: '应答头',
                  children: (
                    <EventDetailParam
                      list={(header_schema_out && [header_schema_out]) || []}
                      ref={refHeader_out_action}
                      // hasMapping
                      onChange={onChangeOutParamsHeader}
                    />
                  ),
                },
                {
                  key: 'body',
                  label: '应答体',
                  children: (
                    <EventDetailParam
                      list={(body_schema_out && [body_schema_out]) || []}
                      ref={refBody_out_action}
                      // hasMapping
                      onChange={onChangeOutParamsBody}
                    />
                  ),
                },
              ]}
            />
            {renderOutMapping()}
          </div>
        )}
      </Card>
    );
  };
  const renderModelFormOut = () => {
    if (!data.id) {
      return null;
    }
    const header_schema_out_api = _.get(data, 'config.api_schema.output_schema.header_schema');
    const body_schema_out_api = _.get(data, 'config.api_schema.output_schema.body_schema');
    return (
      <Card bordered={false}>
        <Card size="small" title="API出参">
          <Tabs
            defaultActiveKey="header"
            items={[
              {
                key: 'header',
                label: '应答头',
                children: (
                  <EventDetailParam
                    list={(header_schema_out_api && [header_schema_out_api]) || []}
                    ref={refHeader_out_api}
                    onChange={(list: any) => {
                      onChangeParams(list, 'api_schema.output_schema.header_schema');
                    }}
                  />
                ),
              },
              {
                key: 'body',
                label: '应答体',
                children: (
                  <EventDetailParam
                    list={(body_schema_out_api && [body_schema_out_api]) || []}
                    ref={refBody_out_api}
                    onChange={(list: any) => {
                      onChangeParams(list, 'api_schema.output_schema.body_schema');
                    }}
                  />
                ),
              },
            ]}
          />
        </Card>
        {renderMappingForm()}
        {renderModelFormOutAction()}
      </Card>
    );
  };
  return renderModelFormOut();
};

export default forwardRef(ActionOut);
