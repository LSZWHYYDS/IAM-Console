import { Button, Col, Collapse, Form, Input, Row, Select, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import { errorCode, showErrorMessage, showSuccessMessage } from '@/utils/common.utils';
import { add, edit, getData, getUserAttr, getAuthSourceTemplate, getIdpType } from '../service';
import {
  // FEISHU_ACCOUNT_CONFIG,
  // OAUTH2_ACCOUNT_CONFIG,
  // AZUREAD_ACCOUNT_CONFIG,
  SCOPE,
} from './CorpCertSourceConfig';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import EditOrEnter from '@/components/EditorEnter';
import JitComp from './JitComp';

// import { handleGetOrgsList } from './utils';
const FormItem = Form.Item,
  Panel = Collapse.Panel;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 },
};
const formItemLayoutConfig = {
  wrapperCol: { span: 24 },
};

const EditAzure: React.FC<any> = (props: any) => {
  const { location } = props;
  const { query } = location;
  const id = query.id;
  const IdpType = query?.type;

  const [loading, setLoading] = useState(false);
  const [formBasic] = Form.useForm();
  const [formConfig] = Form.useForm();
  const [data, setData] = useState<any>({});
  const [userAttr, setUserAttr] = useState<any>([]);

  const [LeftPrefix, setLeftPrefix] = useState<any>('');
  const [leftData, setLeftData] = useState([]);
  // 保存IDPRS变量
  const [idpRs, setIdpRs] = useState<any>([]);

  const [rightPrefix, setRightPrefix] = useState<any>('');
  const [jitGroupId, setJitGroupId] = useState('');
  const enable_jit = Form.useWatch('enable_jit', formConfig);
  // 监听变量进行是否显示部门树

  // let accountExpressOptions: any = [];
  let redirect_uris: string = '';
  const rediretUri: string = `${window.location.protocol}//${window.location.host}`;
  if (query.type == 'FEISHU') {
    redirect_uris = `${rediretUri}/login/oauth/feishu`;
  }
  if (query.type == 'AZUREAD') {
    redirect_uris = `${rediretUri}/login/oauth/azure`;
  }
  if (query.type == 'OAUTH2') {
    redirect_uris = `${rediretUri}/login/oauth/oauth2`;
  }
  const setFormData = (formData: any = {}) => {
    formBasic.setFieldsValue({
      ...formData,
      account_express: formData?.account_express?.split('.')[1],
    });
    formConfig.setFieldsValue(formData);
  };

  const handleAddItem = () => {
    formBasic.setFieldsValue({
      account_link: [1],
    });
  };

  const loadData = () => {
    if (id) {
      getData(id).then((res) => {
        try {
          // 对link请求的接口进行处理返回的target_path 因返回带有.
          setData(res.data);
          res?.data?.account_link.forEach((forIs) => {
            forIs.target_path = forIs.target_path.split('.')[1];
          });
          if (res?.data && !res?.data?.jit_config) {
            res.data.jit_config = {};
          }
          if (res?.data?.jit_config?.group_id) {
            res.data.jit_config.group_type = 'select';
          } else {
            res.data.jit_config.group_type = 'none';
          }
          res.data.config.scope = res.data?.config?.scope?.split(' ');
          setFormData(res.data);
          setData(res.data);
          setJitGroupId(res?.data?.jit_config?.group_id || '');
        } catch (err) {}
      });
    } else {
      // 若不是编辑则首次调用form.list的add方法
      handleAddItem();
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
      // IdpRs = useRequest(() => getAuthSourceTemplate(IdpType));
      getAuthSourceTemplate(IdpType).then((res) => {
        setIdpRs({ data: res });
      });
    }
  }, []);
  useEffect(() => {
    // 先存下拉列表的前缀名称
    setLeftPrefix?.(idpRs?.data?.data?.org_and_user_profile?.user_profile?.name);
    // 暂存下下拉列表的数据
    setLeftData(idpRs?.data?.data?.org_and_user_profile?.user_profile?.sub_params);
  }, [idpRs?.data]);

  const onSubmit = async () => {
    const basicData = await formBasic.validateFields();
    [idpRs?.data?.data].forEach((forIs) => {
      if (forIs.sub_params) {
        forIs.sub_params.forEach((item) => {
          if (item.name == basicData.account_express) {
            basicData.account_express = `${forIs.name}.${basicData.account_express}`;
          }
        });
      }
    });
    const configData = await formConfig.validateFields();
    const { jit_config } = configData;

    try {
      // 只开启jit进行整理数据
      if (jit_config && jit_config.group_type === 'select') {
        jit_config.group_id = jitGroupId;
      } else {
        delete jit_config?.group_id;
      }
      configData.jit_config = jit_config;

      const newconfig = {
        config: { ...configData.config, redirect_uri: basicData?.redirect_uri },
        enable_jit,
        jit_config,
      };
      newconfig.config.scope = newconfig.config.scope.join(' ');
      delete basicData.redirect_uri;

      // 依次遍历account_link 给每个对象添加固定属性
      basicData.account_link = basicData?.account_link?.map((mapIs) => ({
        ...mapIs,
        exp_type: 'JS_EXP',
        source_exp: mapIs?.source_exp,
        target_path: rightPrefix + '.' + mapIs?.target_path,
      }));

      const dataObj = {
        idp_type: query.type,
        ...basicData,
        ...newconfig,
      };
      let p;
      if (!id) {
        p = add(dataObj);
      } else {
        p = edit(id, dataObj);
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
    } catch (err) {}
  };

  const onCancel = () => {
    history.goBack();
  };
  const onValuesChange = (formvalue) => {
    const issuer = `${formvalue?.config?.issuer}`;
    if (formvalue?.config?.issuer) {
      formConfig?.setFieldsValue({
        config: {
          authorization_endpoint: `${issuer}/authorize`,
          token_endpoint: `${issuer}/token`,
          userinfo_endpoint: `${issuer}/userinfo`,
        },
      });
    }
  };

  const renderBasicForm = () => {
    return (
      <Panel header="基础配置" key="base">
        <Form form={formBasic} initialValues={data} {...formItemLayout}>
          <Row>
            <Col span="24">
              <FormItem name="name" label="名称" rules={[{ required: true, message: '请输入' }]}>
                <Input />
              </FormItem>
            </Col>
            <Col span="24">
              <FormItem name="redirect_uri" label="回调地址" initialValue={redirect_uris}>
                <Input disabled />
              </FormItem>
            </Col>
            <Col span="24">
              <FormItem label="用户ID映射">
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
          </Row>
        </Form>
      </Panel>
    );
  };

  // selete change
  const renderConfigForm = () => {
    return (
      <Panel header="高级配置" key="config">
        <Form
          form={formConfig}
          initialValues={data}
          {...formItemLayout}
          onValuesChange={onValuesChange}
        >
          <Row>
            <Col span="24">
              <FormItem
                name={['config', 'client_id']}
                label="客户端ID"
                rules={[{ required: true, message: '请输入' }]}
              >
                <Input />
              </FormItem>
            </Col>
            <Col span="24">
              <FormItem
                name={['config', 'client_secret']}
                label="客户端密钥"
                rules={[{ required: true, message: '请输入' }]}
              >
                <Input />
              </FormItem>
            </Col>
            <Col span="24">
              <FormItem
                name={['config', 'issuer']}
                label="端点地址"
                rules={[{ required: true, message: '请输入' }]}
              >
                <Input />
              </FormItem>
            </Col>
            <Col span="24">
              <FormItem name={['config', 'authorization_endpoint']} label="授权端点地址">
                <Input type="text" />
              </FormItem>
            </Col>
            <Col span="24">
              <FormItem name={['config', 'token_endpoint']} label="token端点地址">
                <Input type="text" />
              </FormItem>
            </Col>
            <Col span="24">
              <FormItem name={['config', 'userinfo_endpoint']} label="用户信息端点地址">
                <Input type="text" />
              </FormItem>
            </Col>
            <Col span="24">
              <FormItem
                name={['config', 'scope']}
                label="连接范围"
                rules={[{ required: true, message: '请选择' }]}
              >
                <Select
                  mode="multiple"
                  options={SCOPE}
                  filterOption
                  showSearch
                  allowClear
                  listHeight={400}
                />
              </FormItem>
            </Col>
            <JitComp
              form={formConfig}
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
      <div id="content" className="content">
        <Spin spinning={loading}>
          <Collapse defaultActiveKey={['base', 'config']} bordered={false}>
            {renderBasicForm()}
            {renderConfigForm()}
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
      </div>
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
export default connect(mapStateToProps, mapDispatchToProps)(EditAzure);
