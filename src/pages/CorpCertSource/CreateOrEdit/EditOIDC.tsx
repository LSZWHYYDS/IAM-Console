import { Button, Col, Collapse, Form, Input, Radio, Row, Space, Select } from 'antd';
import React, { useState, useEffect } from 'react';
import { connect, history } from 'umi';
import { add, edit, getData, getUserAttr, getAuthSourceTemplate, getIdpType } from '../service';
import { errorCode, showErrorMessage, showSuccessMessage } from '@/utils/common.utils';
import { SCOPE, SIGNATURE } from './CorpCertSourceConfig';
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

const EditOIDC: React.FC<any> = (props: any) => {
  const [formBasic] = Form.useForm();
  const sign_alg = Form.useWatch(['config', 'sign_alg'], formBasic);

  const { location } = props;
  const { query } = location;
  const IdpType = query?.type;

  const [data, setData] = useState<any>({});
  const [userAttr, setUserAttr] = useState<any>([]);
  const [LeftPrefix, setLeftPrefix] = useState<any>('');
  const [leftData, setLeftData] = useState([]);
  const [rightPrefix, setRightPrefix] = useState<any>('');
  const [jitGroupId, setJitGroupId] = useState('');
  // 保存IDPRS变量
  const [idpRs, setIdpRs] = useState<any>([]);

  const id = query.id;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(false);
  // let accountExpressOptions: any = [];
  // accountExpressOptions = OIDC_ACCOUNT_CONFIG;
  let redirect_uris: string = '';
  const rediretUri: string = `${window.location.protocol}//${window.location.host}`;
  redirect_uris = `${rediretUri}/login/oauth/oidc`;
  const handleAddItem = () => {
    formBasic.setFieldsValue({
      account_link: [1],
    });
  };
  const loadData = () => {
    getUserAttr().then((res) => {
      setRightPrefix(res?.data?.name);
      res?.data?.sub_params.forEach((forIs, forIx) => {
        forIs.key = forIx;
      });
      setUserAttr(res?.data?.sub_params);
    });
    if (id) {
      getData(id).then((res) => {
        try {
          // 对link请求的接口进行处理返回的target_path 因返回带有.
          res?.data?.account_link.forEach((forIs) => {
            forIs.target_path = forIs.target_path.split('.')[1];
          });
          res.data.config.scope = res.data?.config?.scope?.split(' ');
          if (!res.data.jit_config) {
            res.data.jit_config = {};
          }
          if (res?.data?.jit_config?.group_id) {
            res.data.jit_config.group_type = 'select';
          } else {
            res.data.jit_config.group_type = 'none';
          }
          setData(res.data);
          setJitGroupId(res?.data?.jit_config?.group_id || '');
          formBasic.setFieldsValue({
            ...res.data,
            account_express: res?.data?.account_express?.split('.')[1],
          });
        } catch (err) {}
      });
    } else {
      // 若不是编辑则首次调用form.list的add方法
      handleAddItem();
    }
  };

  useEffect(() => {
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

  const onSave = async () => {
    const dataObj = await formBasic.validateFields();
    const { jit_config } = dataObj;
    // 只开启jit进行整理数据
    if (jit_config && jit_config.group_type === 'select') {
      jit_config.group_id = jitGroupId;
    } else {
      delete jit_config?.group_id;
    }
    dataObj.jit_config = jit_config;
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

    dataObj.config.scope = dataObj?.config?.scope?.join(' ');
    // 依次遍历account_link 给每个对象添加固定属性
    dataObj.account_link = dataObj?.account_link?.map((mapIs) => ({
      ...mapIs,
      exp_type: 'JS_EXP',
      source_exp: mapIs?.source_exp,
      target_path: rightPrefix + '.' + mapIs?.target_path,
    }));

    setLoading(true);
    let p;
    if (!id) {
      dataObj.idp_type = query.type;
      p = add(dataObj);
    } else {
      p = edit(id, { ...data, ...dataObj });
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
    });
  };
  const onCancel = () => {
    history.goBack();
  };
  const onValuesChange = (formvalue) => {
    const issuer = `${formvalue?.config?.issuer}`;
    const clientId = `${formBasic.getFieldsValue().config.client_id}`;
    if (formvalue?.config?.issuer) {
      formBasic.setFieldsValue({
        config: {
          authorization_endpoint: `${issuer}/authorize`,
          token_endpoint: `${issuer}/token`,
          userinfo_endpoint: `${issuer}/userinfo`,
        },
      });
    }
    if (formvalue?.config?.sign_alg) {
      if ('RS256' == formvalue.config.sign_alg) {
        formBasic.setFieldsValue({
          config: {
            jwks_key: `${
              issuer == 'undefined' ? `${formBasic.getFieldsValue().config.issuer}` : issuer
            }/jwk/${clientId}`,
          },
        });
      }
    }
  };

  const rendeelement = () => {
    if (sign_alg == 'HS256') {
      return (
        <Col span="24">
          <FormItem name={['config', 'sign_secret']} label="签名密钥">
            <Input />
          </FormItem>
        </Col>
      );
    } else {
      return (
        <>
          <Col span="24">
            <FormItem name={['config', 'jwks_key']} label="jwks公钥">
              <Input />
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem name={['config', 'public_key']} label="pem公钥">
              <Input />
            </FormItem>
          </Col>
        </>
      );
    }
  };

  const renderBasicForm = () => {
    return (
      <Panel header="基础配置" key="base">
        <Form form={formBasic} {...formItemLayout} onValuesChange={onValuesChange}>
          <Row>
            <Col span="24">
              <FormItem
                name="name"
                label="名称"
                initialValue=""
                rules={[{ required: true, message: '请输入' }]}
              >
                <Input />
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

            <Col span="24">
              <FormItem
                name={['config', 'client_id']}
                label="客户端ID"
                initialValue={''}
                rules={[{ required: true, message: '请输入' }]}
              >
                <Input />
              </FormItem>
            </Col>
            <Col span="24">
              <FormItem
                name={['config', 'client_secret']}
                label="客户端密钥"
                initialValue={''}
                rules={[{ required: true, message: '请输入' }]}
              >
                <Input type="text" />
              </FormItem>
            </Col>
            <Col span="24">
              <FormItem
                name={['config', 'redirect_uri']}
                label="回调地址"
                initialValue={redirect_uris}
              >
                <Input disabled />
              </FormItem>
            </Col>
            <Col span="24">
              <FormItem
                name={['config', 'client_auth_type']}
                label="客户端认证方式"
                initialValue={'client_secret_basic'}
              >
                <Radio.Group
                  options={[
                    {
                      label: 'Client Secret Basic',
                      value: 'client_secret_basic',
                    },
                    {
                      label: 'Client Secret Post',
                      value: 'client_secret_post',
                    },
                  ]}
                />
              </FormItem>
            </Col>
            <Col span="24">
              <FormItem
                name={['config', 'issuer']}
                label="端点地址"
                rules={[{ required: true, message: '请输入' }]}
              >
                <Input type="text" />
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
              <FormItem name={['config', 'scope']} label="连接范围">
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
            <Col span="24">
              <FormItem name={['config', 'sign_alg']} label="签名算法">
                <Select options={SIGNATURE} filterOption showSearch allowClear listHeight={400} />
              </FormItem>
            </Col>
            {rendeelement()}
            <JitComp
              form={formBasic}
              formItemLayout={formItemLayout}
              data={data}
              onCheck={(group_id: any) => {
                setJitGroupId(group_id);
              }}
            />
          </Row>
          <Row>
            <Col span="24" style={{ textAlign: 'center' }}>
              <Space>
                <Button onClick={onCancel}>取消</Button>
                <Button type="primary" onClick={onSave}>
                  保存
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Panel>
    );
  };

  //用户必填
  const render = () => {
    return (
      <div id="content" className="content">
        <Collapse defaultActiveKey={['base']} bordered={false}>
          {renderBasicForm()}
        </Collapse>
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
export default connect(mapStateToProps, mapDispatchToProps)(EditOIDC);
