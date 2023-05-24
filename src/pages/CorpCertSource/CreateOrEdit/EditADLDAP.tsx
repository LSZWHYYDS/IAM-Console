import { errorCode, showErrorMessage, showSuccessMessage } from '@/utils/common.utils';
import { Button, Checkbox, Col, Collapse, Form, Input, Row, Spin, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import {
  add,
  edit,
  getData as getDataApi,
  getUserAttr,
  getAuthSourceTemplate,
  getIdpType,
} from '../service';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import EditOrEnter from '@/components/EditorEnter';
import JitComp from './JitComp';

const FormItem = Form.Item,
  Panel = Collapse.Panel;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 },
};

const formItemLayoutConfig = {
  wrapperCol: { span: 24 },
};

const EditADLDAP: React.FC<any> = (props: any) => {
  const { location } = props;
  const { query } = location;
  const IdpType = query?.type;
  const [LeftPrefix, setLeftPrefix] = useState<any>('');
  const [leftData, setLeftData] = useState([]);

  const [rightPrefix, setRightPrefix] = useState<any>('');
  const [userAttr, setUserAttr] = useState<any>([]);
  const [formBasic] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [jitGroupId, setJitGroupId] = useState('');
  const [data, setData] = useState({});
  // 保存IDPRS变量
  const [idpRs, setIdpRs] = useState<any>([]);

  if (query.type == 'AD') {
    // accountExpressOptions = AD_ACCOUNT_CONFIG;
  }
  if (query.type == 'LDAP') {
    // accountExpressOptions = LDAP_ACCOUNT_CONFIG;
  }

  const handleAddItem = () => {
    formBasic.setFieldsValue({
      account_link: [1],
    });
  };
  const loadData = () => {
    if (query.id) {
      getDataApi(query.id).then((res) => {
        // 对link请求的接口进行处理返回的target_path 因返回带有.
        res?.data?.account_link.forEach((forIs) => {
          forIs.target_path = forIs.target_path.split('.')[1];
        });
        if (!res.data.jit_config) {
          res.data.jit_config = {};
        }
        if (res?.data?.jit_config?.group_id) {
          res.data.jit_config.group_type = 'select';
        } else {
          res.data.jit_config.group_type = 'none';
        }
        formBasic.setFieldsValue({
          ...res?.data,
          account_express: res?.data?.account_express?.split('.')[1],
        });
        setData(res?.data);
        setJitGroupId(res?.data?.jit_config?.group_id || '');
      });
    } else {
      // 若不是编辑则首次调用form.list的add方法
      handleAddItem();
      formBasic.setFieldsValue({
        config: {
          user_filter:
            query.type == 'LDAP'
              ? '(&(objectClass=inetOrgPerson)(cn=%s))'
              : '(&(&(objectclass=user)(objectCategory=person))(cn=%s))',
        },
      });
    }
  };
  useEffect(() => {
    getUserAttr().then((res) => {
      setRightPrefix(res?.data?.name);
      res?.data?.sub_params.forEach((forIs, forIx) => {
        forIs.key = forIx;
      });
      setUserAttr(res?.data?.sub_params);
    });
    loadData();
    if (query?.id) {
      // 代表编辑
      // IdpRs = useRequest(() => getIdpType(query?.id, 'IDP'));
      getIdpType(query?.id, 'IDP').then((res) => {
        setIdpRs({ data: res });
      });
    } else {
      // 代表新建
      getAuthSourceTemplate(IdpType).then((res) => {
        setIdpRs({ data: res });
      });
      // IdpRs = useRequest(() => getAuthSourceTemplate(IdpType));
    }
  }, []);

  useEffect(() => {
    // 先存下拉列表的前缀名称
    setLeftPrefix?.(idpRs?.data?.data?.org_and_user_profile?.user_profile?.name);
    // 暂存下下拉列表的数据
    setLeftData(idpRs?.data?.data?.org_and_user_profile?.user_profile?.sub_params);
  }, [idpRs?.data]);

  const onSubmit = async () => {
    const dataObj = await formBasic.validateFields();
    // 查找value值的父级name
    [idpRs?.data?.data].forEach((forIs) => {
      if (forIs.sub_params) {
        forIs.sub_params.forEach((item) => {
          if (item.name == dataObj.account_express) {
            dataObj.account_express = `${forIs.name}.${dataObj.account_express}`;
          }
        });
      }
    });
    // 依次遍历account_link 给每个对象添加固定属性
    dataObj.account_link = dataObj?.account_link?.map((mapIs) => ({
      ...mapIs,
      exp_type: 'JS_EXP',
      source_exp: mapIs?.source_exp,
      target_path: rightPrefix + '.' + mapIs?.target_path,
    }));

    if (dataObj.config.tls == undefined) {
      dataObj.config.tls = false;
    }

    dataObj.idp_type = query.type;
    const { jit_config } = dataObj;
    // 只开启jit进行整理数据
    if (jit_config && jit_config.group_type === 'select') {
      jit_config.group_id = jitGroupId;
    } else {
      delete jit_config?.group_id;
    }
    dataObj.jit_config = jit_config;

    let p;
    if (!query.id) {
      p = add(dataObj);
    } else {
      p = edit(query.id, dataObj);
    }
    setLoading(true);
    p.then((res) => {
      setLoading(false);
      if (res.result) {
        showSuccessMessage();
        history.goBack();
      } else {
        showErrorMessage(errorCode[res.error]);
      }
    }).catch((error) => {
      setLoading(false);
      showErrorMessage(error);
    });
  };
  const onCancel = () => {
    history.goBack();
  };
  const renderBasicFormDefault = () => {
    return (
      <Panel header="基本内容" key="base">
        <Form form={formBasic}>
          <Row>
            <Col span="24">
              <FormItem
                name="name"
                label="名称"
                rules={[{ required: true, message: '请输入' }]}
                {...formItemLayout}
              >
                <Input type="text" readOnly={!!query.id} />
              </FormItem>
            </Col>
            <Col span="24">
              <FormItem
                name={['config', 'tls']}
                {...formItemLayout}
                label="TLS"
                valuePropName="checked"
              >
                <Checkbox>启用</Checkbox>
              </FormItem>
            </Col>

            <Col span="24">
              <FormItem label="用户ID映射" {...formItemLayout}>
                <Form.List name="account_link">
                  {(fields, { add: adds, remove }) => (
                    <div style={{ margin: '0 auto' }}>
                      {fields.map(({ key, name }, index) => (
                        <div key={key}>
                          <Form.Item noStyle shouldUpdate>
                            {() => (
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Form.Item
                                  {...formItemLayoutConfig}
                                  style={{ width: '80%' }}
                                  label=""
                                  colon={false}
                                  name={[name, 'source_exp']}
                                  rules={[{ required: true, message: '请选择您的字段' }]}
                                >
                                  <EditOrEnter
                                    dynamicId={'ref' + name}
                                    type={IdpType}
                                    componentData={{
                                      editOrEnterData: leftData,
                                      preFix: LeftPrefix,
                                    }}
                                  />
                                </Form.Item>
                                <div>
                                  <img
                                    src="/uc/images/arrow.png"
                                    alt="箭头"
                                    style={{
                                      objectFit: 'scale-down',
                                      width: 25,
                                      height: 25,
                                      margin: '0 5px',
                                      marginTop: 3,
                                    }}
                                  />
                                </div>
                                <Form.Item
                                  {...formItemLayoutConfig}
                                  style={{ width: '80%' }}
                                  label=""
                                  colon={false}
                                  name={[name, 'target_path']}
                                  rules={[{ required: true, message: '请选择您的字段' }]}
                                >
                                  <Select
                                    style={{ width: '100%' }}
                                    options={userAttr}
                                    fieldNames={{ label: 'description', value: 'name' }}
                                    filterOption
                                    showSearch
                                    allowClear
                                    listHeight={400}
                                    placeholder="请选择字段"
                                  />
                                </Form.Item>
                                <div
                                  style={{
                                    opacity: index ? 1 : 0,
                                    visibility: index ? 'visible' : 'hidden',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    position: 'relative',
                                    top: -5,
                                    cursor: 'pointer',
                                  }}
                                  onClick={() => remove(name)}
                                >
                                  <span
                                    style={{ fontWeight: 'bolder', color: '#999', marginLeft: 5 }}
                                  >
                                    OR
                                  </span>
                                  <MinusCircleOutlined
                                    style={{ fontSize: 20, marginTop: -5 }}
                                    className="dynamic-delete-button"
                                  />
                                </div>
                              </div>
                            )}
                          </Form.Item>
                        </div>
                      ))}
                      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                        <div style={{ width: '50%' }}>
                          <Button
                            block
                            type="dashed"
                            onClick={() => adds()}
                            icon={<PlusOutlined />}
                          >
                            增加字段
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </Form.List>
              </FormItem>
            </Col>

            <Col span="24">
              <FormItem
                name={['config', 'user_base_dn']}
                label="BaseDN"
                rules={[{ required: true, message: '请输入' }]}
                {...formItemLayout}
              >
                <Input type="text" />
              </FormItem>
            </Col>
            <Col span="24">
              <FormItem name={['config', 'admin_account']} label="管理员帐号" {...formItemLayout}>
                <Input type="text" />
              </FormItem>
            </Col>
            <Col span="24">
              <FormItem name={['config', 'admin_password']} label="管理员密码" {...formItemLayout}>
                <Input type="password" />
              </FormItem>
            </Col>
            <Col span="24">
              <FormItem
                name={['config', 'host']}
                label="服务器地址"
                rules={[{ required: true, message: '请输入' }]}
                {...formItemLayout}
              >
                <Input type="text" />
              </FormItem>
            </Col>
            <Col span="24">
              <FormItem
                name={['config', 'port']}
                label="服务器端口"
                rules={[{ required: true, message: '请输入' }]}
                {...formItemLayout}
              >
                <Input type="text" />
              </FormItem>
            </Col>
            <Col span="24">
              <FormItem
                name={['config', 'user_filter']}
                label="用户搜索条件"
                rules={[{ required: true, message: '请输入' }]}
                {...formItemLayout}
              >
                <Input type="text" />
              </FormItem>
            </Col>
            <JitComp
              form={formBasic}
              formItemLayout={formItemLayout}
              data={data}
              onCheck={(group_id: any) => {
                setJitGroupId(group_id);
              }}
            />
          </Row>
        </Form>
      </Panel>
    );
  };
  const render = () => {
    return (
      <Spin spinning={loading}>
        <Collapse defaultActiveKey={['base']} bordered={false}>
          {renderBasicFormDefault()}
        </Collapse>
        <div className="footerContainer">
          <Button type="ghost" className="ml-10" onClick={onCancel}>
            取消
          </Button>
          <Button type="primary" className="ml-10" onClick={() => onSubmit()}>
            保存
          </Button>
        </div>
      </Spin>
    );
  };
  return render();
};
const mapStateToProps = (state) => ({
  selectListfixCls: state.component_configs.selectListfixCls,
});
const mapDispatchToProps = (dispatch) => ({
  updateCustomeListPix: (params) =>
    dispatch({
      type: 'component_configs/modifyCustomeListPix',
      payload: params,
    }),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditADLDAP);
