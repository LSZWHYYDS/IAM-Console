import React, { useEffect, useRef } from 'react';

import { Input, Drawer, Form, Radio, Row, Col, Button, Select, message } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Draggable, DragDropContext, Droppable } from 'react-beautiful-dnd';
const { Option } = Select;

import { modifyUserInfo, addUserField } from '../../service';
/**
 * 拖拽组件有可能返回数据结构为[{label:'1',name:'1'}]
 * 需要整理为[{label:'1'}]格式
 */
const handleValuesDataStructure = (formValues) => {
  if (typeof formValues == 'object') {
    const copyArray: any = [];
    formValues?.constraint_rule?.map?.((mapIs) => {
      copyArray.push({
        label: mapIs?.label,
        value: mapIs?.label,
      });
    });
    formValues.constraint_rule = JSON.stringify({
      range: copyArray,
    });
    return formValues;
  }
  return null;
};

const Index: React.FC<any> = (props) => {
  const [form] = Form.useForm();
  const controlType = Form.useWatch('page_control', form);
  const data_type = Form.useWatch('data_type', form);
  const formRef = useRef(null);
  let { data } = props;
  if (!data?.id) {
    data = {
      searchable: true,
      mandatory: false,
      as_import: true,
      as_profile: true,
      page_control: 'TEXT',
    };
  }

  useEffect(() => {
    if (!data?.id) {
      if (!form?.getFieldValue('constraint_rule')) {
        form?.resetFields();
        form?.setFieldsValue({
          constraint_rule: [{ key: '0', name: '0', value: '', label: '' }],
        });
      }
    } else {
      try {
        if (typeof data?.constraint_rule == 'string' && data?.basic_attribute !== true) {
          data.constraint_rule = JSON.parse(data?.constraint_rule || '{}')?.range;
        }
        // 为了兼容之前的数据 需要给之前创建的数据添加默认值
        if (!data?.page_control) {
          data.page_control = 'TEXT';
        }
        console.log(data);
        form?.setFieldsValue(data);
      } catch (error) {
        //   message.warning('JSON 解析异常 请检查constraint_rule字段!');
      }
    }
  }, [data]);

  const onFinish = async () => {
    const values = await form?.validateFields();
    if (data.id) {
      // 此处为了处理拖拽组件有时会传递数据结构异常 需要进行检查或统一
      const newValues = handleValuesDataStructure({ ...values });
      if (newValues?.page_control !== 'SELECT') {
        delete newValues?.constraint_rule;
      }
      modifyUserInfo(data.id, newValues).then((rs) => {
        if (rs.error == '0') {
          message.success('保存成功');
          props.refreshData_custom();
          props.onCloses_ls();
        }
      });
    } else {
      const obj: any = {};
      if (values.data_type == 'DATETIME') {
        obj.validate_rule = 'yyyy-MM-dd HH:mm:ss';
      }
      // 此处为了处理拖拽组件有时会传递数据结构异常 需要进行检查或统一
      const newValues = handleValuesDataStructure({ ...values });
      if (newValues?.page_control !== 'SELECT') {
        delete newValues?.constraint_rule;
      }
      addUserField({ ext_attrs: [{ ...newValues, ...obj }] }).then((rs) => {
        if (rs.error == '0') {
          message.success('保存成功');
          form?.resetFields();
          props.refreshData_custom();
          props.onCloses_ls();
        }
      });
    }
  };

  const onvaluesChange = (currentValue) => {
    if (Object.keys(currentValue).includes('page_control')) {
      form.setFieldValue('data_type', undefined);
    }
  };

  const handleDragEnd = ({ source, destination }) => {
    (document?.activeElement as HTMLElement)?.blur();
    const filterArr = form.getFieldValue('constraint_rule');
    if (!destination) {
      return;
    }
    const newFields = [...filterArr];
    const [removed] = newFields.splice(source.index, 1);
    newFields.splice(destination.index, 0, removed);
    form.setFieldsValue({
      constraint_rule: newFields,
    });
  };

  return (
    <div style={{ position: 'relative' }}>
      <Drawer
        title="编辑字段信息"
        placement="right"
        onClose={() => {
          form?.resetFields();
          props.onCloses_ls();
        }}
        open={props.visibles_ls}
        width={550}
        drawerStyle={{ position: 'relative' }}
        footer={[
          <Row justify="end">
            <Col>
              <Button
                type="default"
                size="large"
                block
                onClick={() => {
                  form.resetFields();
                  props.onCloses_ls();
                }}
              >
                取消
              </Button>
            </Col>
            <Col offset={2}>
              <Button type="primary" onClick={onFinish} size="large" block>
                确定
              </Button>
            </Col>
          </Row>,
        ]}
      >
        <Form
          name="userField"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 18 }}
          onFinish={onFinish}
          style={{ marginTop: '30px' }}
          initialValues={data}
          form={form}
          ref={formRef}
          onValuesChange={onvaluesChange}
        >
          <Form.Item
            label="字段名称"
            name="domain_name"
            validateTrigger="onBlur"
            rules={[
              {
                required: true,
                message: '字段必须为英文',
                validator: (_, value) => {
                  const Reg = /[^a-zA-Z_+]/g;
                  if (value) {
                    if (!Reg.test(value.trim())) {
                      return Promise.resolve();
                    } else {
                      console.log(value);
                      return Promise.reject('字段名称只能为英文');
                    }
                  } else {
                    return Promise.reject('不能为空');
                  }
                },
              },
            ]}
          >
            <Input disabled={!!data.id} placeholder="请输入你的名称" />
          </Form.Item>
          <Form.Item
            label="显示名称"
            name="display_name"
            rules={[{ required: true, message: '请输入显示名称' }]}
            validateFirst={true}
          >
            <Input placeholder="请输显示名称" />
          </Form.Item>
          <Form.Item
            label="字段类型"
            name="page_control"
            rules={[{ required: true, message: '请输入字段名' }]}
          >
            <Select
              style={{ width: '100%' }}
              placeholder={'请选择你的字段类型'}
              disabled={data?.basic_attribute && !!data.id}
            >
              <Option value="TEXT">文本框</Option>
              <Option value="DATETIME">时间框</Option>
              <Option value="SELECT">列表</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="数据类型"
            name="data_type"
            rules={[{ required: true, message: '请选择数据类型' }]}
          >
            <Select
              disabled={data?.basic_attribute && !!data.id}
              placeholder={'请输入数据类型'}
              style={{ width: '100%' }}
              options={
                controlType == 'STRING'
                  ? [
                      {
                        value: 'STRING',
                        label: '文本类型',
                      },
                      {
                        value: 'INT',
                        label: '数字类型',
                      },
                    ]
                  : controlType == 'DATETIME'
                  ? [
                      {
                        value: 'STRING',
                        label: '文本类型',
                      },
                    ]
                  : [
                      {
                        value: 'STRING',
                        label: '文本类型',
                      },
                      {
                        value: 'INT',
                        label: '数字类型',
                      },
                    ]
              }
            ></Select>
          </Form.Item>
          <Col span="24">
            <Form.Item name="description" label="字段描述">
              <Input.TextArea />
            </Form.Item>
          </Col>
          <Form.Item label="是否必填" name="mandatory">
            <Radio.Group style={{ width: '300px' }}>
              <Row>
                <Col span={10}>
                  <Radio value={true}>必填</Radio>
                </Col>
                <Col span={10}>
                  <Radio value={false}>选填</Radio>
                </Col>
              </Row>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="是否作为查询条件" name="searchable" style={{ display: 'none' }}>
            <Radio.Group style={{ width: '300px' }}>
              <Row>
                <Col span={10}>
                  <Radio value={true}>是</Radio>
                </Col>
                <Col span={10}>
                  <Radio value={false}>否</Radio>
                </Col>
              </Row>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="是否作为映射关系" name="as_import" style={{ display: 'none' }}>
            <Radio.Group style={{ width: '300px' }}>
              <Row>
                <Col span={10}>
                  <Radio value={true}>是</Radio>
                </Col>
                <Col span={10}>
                  <Radio value={false}>否</Radio>
                </Col>
              </Row>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="是否作为用户画像属性" name="as_profile" style={{ display: 'none' }}>
            <Radio.Group style={{ width: '300px' }}>
              <Row>
                <Col span={10}>
                  <Radio value={true}>是</Radio>
                </Col>
                <Col span={10}>
                  <Radio value={false}>否</Radio>
                </Col>
              </Row>
            </Radio.Group>
          </Form.Item>
          {controlType == 'SELECT' ? (
            <Form.List name="constraint_rule">
              {(fields, { add, remove }) => (
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId={'dropid'}>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.droppableProps}>
                        {fields.map((field, index: number) => (
                          <Draggable draggableId={String(index)} index={index}>
                            {(provideds) => (
                              <div {...provideds.draggableProps} ref={provideds.innerRef}>
                                <div style={{ display: 'flex' }}>
                                  <div
                                    {...provideds.dragHandleProps}
                                    style={{
                                      width: 30,
                                      height: 30,
                                      position: 'relative',
                                      left: 40,
                                      zIndex: 10,
                                    }}
                                  >
                                    <img
                                      src="/uc/images/drag.png"
                                      alt=""
                                      style={{ width: '100%', height: '100%' }}
                                    />
                                  </div>
                                  <div key={field?.key} style={{ width: '100%', display: 'flex' }}>
                                    <Form.Item
                                      {...field}
                                      style={{ width: '100%' }}
                                      label=" "
                                      colon={false}
                                      name={[field.name, 'label']}
                                      rules={[
                                        {
                                          required: true,
                                          type: data_type == 'INT' ? 'number' : 'string',
                                          message:
                                            data_type == 'INT'
                                              ? '请输入数字类型'
                                              : '请输入配置信息',
                                          transform: (value: any) => {
                                            if (value && data_type == 'INT') {
                                              return Number(value);
                                            }
                                            return value;
                                          },
                                        },
                                      ]}
                                    >
                                      <Input placeholder="请输入配置信息" />
                                    </Form.Item>
                                  </div>
                                  {fields.length > 1 ? (
                                    <MinusCircleOutlined
                                      style={{
                                        fontSize: 20,
                                        color: '#808080',
                                        position: 'relative',
                                        left: -30,
                                        top: 5,
                                      }}
                                      onClick={() => remove(field.name)}
                                    />
                                  ) : null}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                        <Row justify={'center'}>
                          <Col style={{ width: '90%' }}>
                            <Button
                              type="dashed"
                              onClick={() => {
                                add();
                              }}
                              block
                              icon={<PlusOutlined></PlusOutlined>}
                            >
                              增加一个配置项
                            </Button>
                          </Col>
                        </Row>
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              )}
            </Form.List>
          ) : null}
        </Form>
      </Drawer>
    </div>
  );
};

export default Index;
