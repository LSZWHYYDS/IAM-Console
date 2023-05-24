import InfoItem from '@/components/InfoItem';
import { getPolicies } from '@/pages/EditSetting/service';
import { getAttrList, getOrgAttrList, getSnsByType } from '@/pages/UserCenter/SyncGene/service';
import {
  errorCode,
  formatDateTime,
  replaceNull,
  showErrorMessage,
  showSuccessMessage,
  t,
} from '@/utils/common.utils';
import { Button, Checkbox, Col, Collapse, Form, Input, message, Row, Select } from 'antd';
import React, { Fragment, useEffect, useState } from 'react';
import { history } from 'umi';
import { add, edit, getImportConfigTips, getLink, getSelectList, sync, test } from '../service';
import type { ConfigTip, LinkerType, SubAttrType } from './data';
import LinkerMapAttrsComponent from './LinkerMapAttrsComponet';

const FormItem = Form.Item,
  Option = Select.Option,
  Panel = Collapse.Panel;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 },
};

const configTips: ConfigTip = {};
let initData: LinkerType = {};
let mandatoryAttrsArray: string[] = [];

const SettingLinker: React.FC = (props: any) => {
  const { location } = props;
  const { query } = location;
  const name = query.id;
  const [formBasic] = Form.useForm();
  const [formSyncPolicy] = Form.useForm();
  const [formSyncTest] = Form.useForm();
  const [formOrgAttr] = Form.useForm();
  const [formUserAttr] = Form.useForm();
  const [formMandUserAttr] = Form.useForm();

  const [data, setData] = useState<LinkerType>({});
  const [loading, setLoading] = useState(false);
  const [linkerType, setLinkerType] = useState(props.type);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [subBasicAttrs, setSubBasicAttrs] = useState<SubAttrType[]>([]);
  const [subExtendAttrs, setSubExtendAttrs] = useState<SubAttrType[]>([]);
  const [, setOrgBasicAttrs] = useState<SubAttrType[]>([]);
  const [, setOrgExtendAttrs] = useState<SubAttrType[]>([]);
  const [snsAll, setSnsAll] = useState([]);
  const [account_link, setAccount_link] = useState<unknown[]>();
  const [syncStatus, setSyncStatus] = useState(false); // 保存同步请求没有返回 然后操作其他接口进行提示
  const [testStatus, setTestStatus] = useState(false);

  // 存放右侧下拉列表数据
  const [rightData, setRightData] = useState<any>();

  const formatData = (dataObj: any) => {
    const { map_attrs, config } = dataObj;
    const obj = {
      import_period: dataObj.import_period,
      profile_name: dataObj.profile_name,
      ds_type: dataObj.ds_type,
      endTime: dataObj.last_import_finish_datetime,
      startTime: dataObj.last_import_start_datetime,
    };

    return Object.assign(
      {},
      obj,
      map_attrs,
      dataObj,
      config, //the original response from server.
    );
  };
  //将api 的转换为组件接收的
  const formatterMapItems = (mappedItems: any) => {
    const list: any = [];
    for (const fieldName in mappedItems) {
      list.push({
        fieldName: fieldName,
        fieldValue: mappedItems[fieldName],
      });
    }
    return list;
  };
  const getSnsAll = () => {
    getSnsByType(linkerType)
      .then((res) => {
        if (res.error === '0') {
          setSnsAll(res.data);
        } else {
          showErrorMessage(res.data.error_description);
        }
      })
      .catch((error) => {
        showErrorMessage(error);
      });
  };
  const setUserAttrFormData = () => {
    const { ds_type, map_attrs } = data || {};
    const { map_attrs: subAttrAdValueTip } = configTips.AD || {};
    const { map_attrs: subAttrLDAPValueTip } = configTips.LDAP || {};
    const subAttrValueTip = ds_type === 'AD' ? subAttrAdValueTip : subAttrLDAPValueTip;
    const mandFieldList = {};
    const userAttr = {};
    if (!map_attrs || !mandatoryAttrsArray.length) {
      return;
    }
    if (
      mandatoryAttrsArray.length > 0 &&
      subBasicAttrs.length > 0 &&
      map_attrs &&
      Object.keys(map_attrs).length > 0
    ) {
      const pwdPos = mandatoryAttrsArray.indexOf('password');
      if (pwdPos != -1) {
        mandatoryAttrsArray.splice(pwdPos, 1);
      }
      Object.keys(map_attrs).forEach((key) => {
        if (mandatoryAttrsArray.indexOf(key) != -1) {
          mandFieldList[key] = map_attrs[key];
        } else {
          userAttr[key] = map_attrs[key];
        }
      });
      if (Object.keys(mandFieldList).length == 0) {
        mandatoryAttrsArray.forEach((attr) => {
          mandFieldList[attr] = subAttrValueTip[attr];
        });
      }
    }

    formMandUserAttr.setFieldsValue({
      userFormMappedAttrMap: formatterMapItems(mandFieldList),
    });
  };
  const setFormData = (formData: any = {}) => {
    formBasic.setFieldsValue(formData);
    replaceNull(formData);
    formSyncPolicy.setFieldsValue(formData);
    formSyncTest.setFieldsValue(formData);
    if (data?.import_orgs) {
      formOrgAttr.setFieldsValue({
        orgFormMappedAttrMap: formatterMapItems(formData.map_org_attrs),
      });
    }
    setUserAttrFormData();
  };
  const loadData = () => {
    getSnsAll();
    getImportConfigTips()
      .then((resp) => {
        const tips = resp.data;
        tips.forEach((tip: any) => {
          configTips[tip.ds_type] = formatData(tip);
        });
      })
      .then(() => {
        if (name) {
          if (JSON.stringify(data) == '{}') {
            getLink(name).then((res) => {
              initData = formatData(res.data);
              setAccount_link(initData?.account_link);
              setData(initData);
              setFormData(initData);
              setFormData(initData?.config);
              setLinkerType(initData.ds_type);
            });
          } else {
            initData = formatData(data);
            setData(initData);
            setFormData(initData);
          }
        } else {
          setData(configTips[linkerType]);
          setFormData(configTips[linkerType]);
        }
      })
      .catch(function (error) {
        showErrorMessage(error);
      });
    getPolicies()
      .then((response) => {
        if (response.data) {
          const policyData = response.data;
          mandatoryAttrsArray = policyData.signup_policy.mandatory_attrs;
        }
      })
      .then(() => {
        const copyQuery = { ...query };
        delete copyQuery?.NumberId;
        const optionalAttrsRtn = getAttrList({ ...copyQuery, as_import: true });
        optionalAttrsRtn.then((rep) => {
          if (rep.data) {
            const subBasicAttrsList: any = [];
            const subExtendAttrsList: any = [];
            for (const attr of rep.data.items) {
              const subBasicAttr = {
                display_name: '',
                domain_name: '',
              };
              const subExtendAttr = {
                display_name: '',
                domain_name: '',
              };
              const { basic_attribute: isBasic } = attr;
              if (isBasic) {
                ({
                  display_name: subBasicAttr.display_name,
                  domain_name: subBasicAttr.domain_name,
                } = attr);
                const pos = mandatoryAttrsArray.indexOf(subBasicAttr.domain_name);
                if (pos == -1) {
                  subBasicAttrsList.push(subBasicAttr);
                }
              } else {
                ({
                  display_name: subExtendAttr.display_name,
                  domain_name: subExtendAttr.domain_name,
                } = attr);
                subExtendAttrsList.push(subExtendAttr);
              }
            }

            setSubBasicAttrs(subBasicAttrsList);
            setSubExtendAttrs(subExtendAttrsList);
          }
        });
      });

    getSelectList().then((res) => {
      setRightData(res?.data?.sub_params || []);
    });

    const orgAttrParams = { page: 1, size: 20, as_import: 1 };
    const optOrgAttrs = getOrgAttrList(orgAttrParams);
    optOrgAttrs.then((rep) => {
      if (rep.data) {
        const orgBasicAttrsList: any = [];
        const orgExtendAttrsList: any = [];
        for (const attr of rep.data.items) {
          const orgBasicAttr = {
            display_name: '',
            domain_name: '',
          };
          const orgExtendAttr = {
            display_name: '',
            domain_name: '',
          };
          const { basic_attribute: isBasic } = attr;
          if (isBasic) {
            ({ display_name: orgBasicAttr.display_name, domain_name: orgBasicAttr.domain_name } =
              attr);
            orgBasicAttrsList.push(orgBasicAttr);
          } else {
            ({ display_name: orgExtendAttr.display_name, domain_name: orgExtendAttr.domain_name } =
              attr);
            orgExtendAttrsList.push(orgExtendAttr);
          }
        }
        setOrgBasicAttrs(orgBasicAttrsList);
        setOrgExtendAttrs(orgExtendAttrsList);
      }
    });
  };
  useEffect(() => {
    loadData();
  }, []);
  useEffect(() => {
    setUserAttrFormData();
  }, [data, subBasicAttrs, subExtendAttrs]);
  const onFieldsChange = () => {
    if (userInfo) {
      setUserInfo(null);
    }
  };
  // 将 表单上数据给总对象，后面保存
  const setBasicFormDataForSave = (dataObj: any, basicData: any) => {
    dataObj.profile_name = basicData.profile_name;
    if (
      dataObj.ds_type &&
      linkerType !== 'DINGDING' &&
      linkerType !== 'WEWORK' &&
      linkerType !== 'FEISHU'
    ) {
      dataObj.config = {
        tls: basicData.tls,
        user_base_dn: basicData.user_base_dn,
        admin_account: basicData.admin_account,
        admin_password: basicData.admin_password,
        host: basicData.host,
        port: parseInt(basicData.port, 10),
        org_filter: basicData.org_filter,
        user_filter: basicData.user_filter,
      };
    }
    if (linkerType === 'DINGDING' || linkerType === 'WEWORK' || linkerType === 'FEISHU') {
      dataObj.config_id = basicData.config_id;
      dataObj.config = {
        org_filter: basicData.org_filter,
        user_filter: basicData.user_filter,
      };
    }
  };
  const setSyncFormDataForSave = (dataObj: any, syncFormData: any) => {
    Object.assign(dataObj, syncFormData);
  };
  const setUserAttrFormDataForSave = (dataObj: any, formData: any) => {
    // const dataList = formData.userFormMappedAttrMap;
    // const map_attrs = {};
    // dataList?.forEach?.((field: any) => {
    //    if (field.fieldValue && field.fieldName) {
    //       map_attrs[field.fieldName] = field.fieldValue;
    //    }
    // });
    // dataObj.map_attrs = map_attrs;
    formData?.userFormMappedAttrMap?.forEach?.((forIs) => {
      dataObj?.account_link?.push({
        source_exp: forIs?.fieldValue,
        exp_type: 'JS_EXP',
        target_path: forIs?.fieldName,
      });
    });
  };
  // const setUserMandAttrFormDataForSave = (dataObj: any, formData: any) => {
  //    const dataList = formData.userFormMappedAttrMap;
  //    const map_attrs = {};
  //    dataList?.forEach?.((field: any) => {
  //       if (field.fieldValue && field.fieldName) {
  //          map_attrs[field.fieldName] = field.fieldValue;
  //       }
  //    });
  //    dataObj.map_attrs = { ...map_attrs, ...dataObj.map_attrs };
  // };
  // const setOrgAttrFormDataForSave = (dataObj: any, formData: any) => {
  //    const dataList = formData.orgFormMappedAttrMap;
  //    const map_org_attrs = {};
  //    if (dataList) {
  //       dataList?.forEach?.((field: any) => {
  //          if (field.fieldValue && field.fieldName) {
  //             map_org_attrs[field.fieldName] = field.fieldValue;
  //          }
  //       });
  //    }
  //    dataObj.map_org_attrs = map_org_attrs;
  // };
  const getData = async (opType: any, callback: any) => {
    const basicData = await formBasic.validateFields();
    const syncFromData = await formSyncPolicy.validateFields();
    // const orgAttrs = await formOrgAttr.validateFields();
    const userAttrs = await formUserAttr.validateFields();
    // const userAttrsMand = await formMandUserAttr.validateFields();
    const formSyncTestData = await formSyncTest.validateFields();
    // 整理后台需要数据
    const dataObj: any = {
      id: (data && data.id) || undefined,
      ds_type: basicData.ds_type || query.type || data.ds_type,
      // map_org_attrs: [],
      // map_attrs: [],
      account_link: [],
    };
    setBasicFormDataForSave(dataObj, basicData);
    setSyncFormDataForSave(dataObj, syncFromData);
    Object.assign(dataObj, formSyncTestData);
    // setOrgAttrFormDataForSave(dataObj, orgAttrs);
    setUserAttrFormDataForSave(dataObj, userAttrs);
    // setUserMandAttrFormDataForSave(dataObj, userAttrsMand);
    if (typeof callback === 'function') {
      callback(dataObj);
    }
  };
  //callback： 测试成功后执行的
  const onTest = async (callback) => {
    await formBasic.validateFields();
    await formSyncPolicy.validateFields();
    await formUserAttr.validateFields();
    await formSyncTest.validateFields();
    if (testStatus) {
      message.warning('正在进行测试中,请耐心等待!');
      return;
    }
    setTestStatus(true);
    getData('test', (dataObj: any) => {
      setLoading(true);
      test(dataObj)
        .then((res) => {
          if (res.result) {
            setUserInfo(res.data);
            if (typeof callback === 'function') {
              callback();
            } else {
              showSuccessMessage('测试成功');
            }
            setLoading(false);
          } else {
            if (res?.code == '8001') {
              showErrorMessage('连接错误', '测试');
              setLoading(false);
              setTestStatus(false);
              return;
            }
            showErrorMessage(res.message, '测试');
          }
          setLoading(false);
          setTestStatus(false);
        })
        .catch((error) => {
          setLoading(false);
          setTestStatus(false);
          showErrorMessage(error, '测试');
        });
    });
  };
  const onSubmit = (isSync?: boolean) => {
    if (syncStatus) {
      message.warning('此连接器正在同步中，请耐心等待!');
      return;
    }
    getData('submit', (dataObj: any) => {
      setSyncStatus(true);
      let p;
      if (!name) {
        p = add(dataObj);
      } else {
        p = edit(dataObj);
      }
      setLoading(true);
      p.then((res) => {
        if (isSync) {
          sync(dataObj.profile_name)
            .then((linkerRes) => {
              if (linkerRes.result) {
                showSuccessMessage();
                history.push('/users/linker');
              } else {
                showErrorMessage(errorCode[linkerRes.error]);
              }
              setLoading(false);
              // 保存同步时候状态
              setSyncStatus(false);
            })
            .catch((error) => {
              setLoading(false);
              showErrorMessage(error);
              // 保存同步时候状态
              setSyncStatus(false);
            });
        } else {
          setLoading(false);
          if (res.result) {
            showSuccessMessage();
            history.push('/users/linker');
          } else {
            showErrorMessage(errorCode[res.error]);
          }
          // 保存同步时候状态
          setSyncStatus(false);
        }
      }).catch((error) => {
        setLoading(false);
        showErrorMessage(error);
      });
    });
  };
  const onCancel = () => {
    history.goBack();
  };
  const renderBasicFormDefault = () => {
    const {
      tls,
      admin_account,
      admin_password,
      port,
      org_filter,
      user_filter,
      user_base_dn,
      profile_name,
    } = data || {};
    return (
      <Panel header="基本内容" key="base">
        <Form form={formBasic} onChange={onFieldsChange}>
          <Row>
            <Col span="12">
              <FormItem
                name="profile_name"
                label="名称"
                initialValue={profile_name}
                rules={[{ required: true, message: '请输入' }]}
                {...formItemLayout}
              >
                <Input type="text" readOnly={!!name} disabled={query?.NumberId ? true : false} />
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem
                name="tls"
                {...formItemLayout}
                label="TLS"
                initialValue={tls === undefined ? true : tls}
                valuePropName="checked"
              >
                <Checkbox>启用</Checkbox>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem
                name="user_base_dn"
                label="BaseDN"
                initialValue={user_base_dn}
                rules={[{ required: true, message: '请输入' }]}
                {...formItemLayout}
              >
                <Input type="text" />
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem
                name="admin_account"
                label="管理员帐号"
                initialValue={admin_account}
                rules={[{ required: true, message: '请输入管理员帐号' }]}
                {...formItemLayout}
              >
                <Input type="text" />
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem
                rules={[{ required: true, message: '请输入' }]}
                name="admin_password"
                label="管理员密码"
                initialValue={admin_password}
                {...formItemLayout}
              >
                <Input type="password" />
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem
                name="host"
                label="服务器地址"
                rules={[{ required: true, message: '请输入' }]}
                {...formItemLayout}
              >
                <Input type="text" />
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem
                name="port"
                label="服务器端口"
                initialValue={port}
                rules={[{ required: true, message: '请输入' }]}
                {...formItemLayout}
              >
                <Input type="text" />
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem
                name="org_filter"
                label="用户组搜索条件"
                initialValue={org_filter}
                rules={[{ required: true, message: '请输入' }]}
                {...formItemLayout}
              >
                <Input type="text" />
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem
                name="user_filter"
                label="用户搜索条件"
                initialValue={user_filter}
                rules={[{ required: true, message: '请输入' }]}
                {...formItemLayout}
              >
                <Input type="text" />
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Panel>
    );
  };
  //带企业选择的
  const renderBasicFormWithEnt = () => {
    const { profile_name, config_id } = data || {};
    return (
      <Panel header="基本内容" key="base">
        <Form form={formBasic} onChange={onFieldsChange}>
          <Row>
            {(linkerType === 'DINGDING' || linkerType === 'WEWORK' || linkerType === 'FEISHU') && (
              <Col span="12" style={{ display: 'none' }}>
                <Row>
                  <Col span="6" className="ant-form-item-label">
                    类型：
                  </Col>
                  {linkerType === 'FEISHU' && (
                    <Col span="6" className="ant-form-item-control">
                      飞书用户同步
                    </Col>
                  )}
                  {linkerType === 'DINGDING' && (
                    <Col span="6" className="ant-form-item-control">
                      钉钉用户同步
                    </Col>
                  )}
                  {linkerType === 'WEWORK' && (
                    <Col span="6" className="ant-form-item-control">
                      企业微信用户同步
                    </Col>
                  )}
                </Row>
              </Col>
            )}
            <Col span="12">
              <FormItem
                name="profile_name"
                label="名称"
                initialValue={profile_name || undefined}
                rules={[{ required: true, message: '请输入' }]}
                {...formItemLayout}
              >
                <Input
                  type="text"
                  readOnly={!!name}
                  placeholder="请输入内容"
                  disabled={query?.NumberId ? true : false}
                />
              </FormItem>
            </Col>
            {(linkerType === 'DINGDING' || linkerType === 'WEWORK' || linkerType === 'FEISHU') && (
              <Fragment>
                <Col span="12">
                  <FormItem
                    name="config_id"
                    label="企业选择"
                    initialValue={config_id || undefined}
                    rules={[{ required: true, message: '请输入' }]}
                    {...formItemLayout}
                  >
                    <Select placeholder="请选择企业部门">
                      {snsAll.map((item: any) => {
                        return (
                          <Option key={item.id} value={item.id}>
                            {item.name}
                          </Option>
                        );
                      })}
                    </Select>
                  </FormItem>
                </Col>
              </Fragment>
            )}
          </Row>
        </Form>
      </Panel>
    );
  };
  const renderBasicForm = () => {
    switch (linkerType) {
      case 'DINGDING':
      case 'WEWORK':
      case 'FEISHU':
        return renderBasicFormWithEnt();
      default:
        return renderBasicFormDefault();
    }
  };
  const renderSyncForm = () => {
    const { import_period, delete_limit, startTime, import_orgs, create_default_org } = data || {};
    return (
      <Panel header="同步策略" key="syncpolicy">
        <Form form={formSyncPolicy} onChange={onFieldsChange}>
          <Row>
            <Col span="12">
              <FormItem
                name="import_period"
                label="用户同步周期"
                rules={[{ required: true, message: '请选择同步周期' }]}
                initialValue={
                  ((import_period || import_period === 0) && import_period.toString()) || ''
                }
                {...formItemLayout}
              >
                <Select>
                  <Option key="0" value={0}>
                    手动同步
                  </Option>
                  <Option key="30" value={30}>
                    30分钟
                  </Option>
                  <Option key="60" value={60}>
                    1小时
                  </Option>
                  <Option key="720" value={720}>
                    12小时
                  </Option>
                  <Option key="1440" value={1440}>
                    24小时
                  </Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <FormItem
                name="import_orgs"
                {...formItemLayout}
                label="同步用户组"
                valuePropName="checked"
                initialValue={import_orgs === undefined ? true : import_orgs}
              >
                <Checkbox
                  // onChange={(e) => onMarkerChange(e, 'import_orgs')}
                  disabled={!!startTime}
                >
                  启用
                </Checkbox>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem
                name="create_default_org"
                {...formItemLayout}
                label="是否创建默认组"
                valuePropName="checked"
                initialValue={create_default_org === undefined ? true : create_default_org}
              >
                <Checkbox
                  // onChange={(e) => onMarkerChange(e, 'create_default_org')}
                  disabled={!!startTime}
                />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <FormItem
                name="delete_limit"
                label="删除用户阈值"
                initialValue={(delete_limit == null ? false : delete_limit) || 5}
                {...formItemLayout}
                help="执行同步任务如数据源删除用户数等于或大于用户阈值，则链接器将不执行删除操作。如不希望在同步时删除用户，请将值设置为0，如不设删除上限，请将值配置为-1"
              >
                <Input type="number" min={-1} />
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Panel>
    );
  };
  //用户必填
  // const renderUserMandatoryAttrsForm = () => {
  //    const { ds_type, map_attrs } = data || {};
  //    const { map_attrs: subAttrAdValueTip } = configTips.AD || {};
  //    const { map_attrs: subAttrLDAPValueTip } = configTips.LDAP || {};
  //    const subAttrValueTip = ds_type === 'AD' ? subAttrAdValueTip : subAttrLDAPValueTip;
  //    if (
  //       mandatoryAttrsArray.length > 0 &&
  //       subBasicAttrs.length > 0 &&
  //       map_attrs &&
  //       Object.keys(map_attrs).length > 0
  //    ) {
  //       const pwdPos = mandatoryAttrsArray.indexOf('password');
  //       if (pwdPos != -1) {
  //          mandatoryAttrsArray.splice(pwdPos, 1);
  //       }
  //    }
  //    return (
  //       <Row>
  //          <Col span="24">
  //             <Form form={formMandUserAttr}>
  //                <LinkerMapAttrsComponent
  //                   dataParamName="userFormMappedAttrMap"
  //                   displayNameUtilPrefix="user.attr."
  //                   basicAttrs={subBasicAttrs}
  //                   extendAttrs={subExtendAttrs}
  //                   attrValueTips={subAttrValueTip}
  //                   noAdd={true}
  //                   leftReadOnly={true}
  //                   controlId={true}
  //                />
  //             </Form>
  //          </Col>
  //       </Row>
  //    );
  // };
  const renderUserAttrsForm = () => {
    const { ds_type } = data || {};
    const { map_attrs: subAttrAdValueTip } = configTips.AD || {};
    const { map_attrs: subAttrLDAPValueTip } = configTips.LDAP || {};
    const subAttrValueTip = ds_type === 'AD' ? subAttrAdValueTip : subAttrLDAPValueTip;

    return (
      <Panel className="mb-20" header="账号关联" key="userMappingPolicy">
        {/* {renderUserMandatoryAttrsForm()} */}
        <Row>
          <Col span="24">
            <Form form={formUserAttr}>
              <LinkerMapAttrsComponent
                dataParamName="userFormMappedAttrMap"
                displayNameUtilPrefix="user.attr."
                basicAttrs={subBasicAttrs}
                extendAttrs={subExtendAttrs}
                attrValueTips={subAttrValueTip}
                rightData={rightData}
                echoData={account_link}
              />
            </Form>
          </Col>
        </Row>
      </Panel>
    );
  };

  const renderTestForm = () => {
    let userInfoRow: any = null;
    let orgInfo: any = null;
    if (userInfo) {
      delete userInfo?.connector_org_ids;
      const userInfoItem: any = [];
      const orgInfoItem: any = [];
      const objAttrs = Object.keys(userInfo);
      objAttrs
        .filter((attrname) => attrname !== 'group_positions' && attrname !== 'group')
        .map((attrName) => {
          userInfoItem.push(
            <InfoItem
              titleSpan="3"
              contentSpan="10"
              key={attrName}
              titleStr={t('user.attr.' + attrName) || attrName}
              contentObj={userInfo[attrName]}
            />,
          );
        });
      objAttrs
        .filter((attrName) => attrName === 'group')
        .map(() => {
          const groupInfo = userInfo.group;
          Object.keys(groupInfo).map((orgAttrname) => {
            orgInfoItem.push(
              <InfoItem
                titleSpan="3"
                contentSpan="10"
                key={orgAttrname}
                titleStr={t('org.attr.' + orgAttrname) || orgAttrname}
                contentObj={groupInfo[orgAttrname]}
              />,
            );
          });
        });
      userInfoRow = (
        <Row>
          <Col span="24">{userInfoItem}</Col>
        </Row>
      );
      orgInfo = (
        <Row>
          <Col span="24">{orgInfoItem}</Col>
        </Row>
      );
    }
    return (
      <Panel header="测试" key="synctest">
        <Form form={formSyncTest}>
          <Row className="mb-20">
            <span>配置测试</span>
          </Row>
          <Row>
            <Col span="10">
              <FormItem
                name="test_account"
                label="测试账号"
                initialValue=""
                {...formItemLayout}
                rules={[{ required: true, message: '请输入' }]}
              >
                <Input type="text" maxLength={50} />
              </FormItem>
            </Col>
            <Col span="2">
              <Button type="primary" onClick={onTest}>
                {loading ? '测试中' : '测试'}
              </Button>
            </Col>
          </Row>
          {userInfoRow}
          {orgInfo}
        </Form>
      </Panel>
    );
  };
  const renderLastSyncInfo = () => {
    const { endTime, startTime } = data || {};
    return (
      <Panel header="上次同步" key="syncstatus">
        <Row>
          <Col span="12">
            <InfoItem
              titleStr="开始时间"
              contentObj={formatDateTime(startTime)}
              contentSpan={'14'}
            />
          </Col>
          <Col span="12">
            <InfoItem titleStr="结束时间" contentObj={formatDateTime(endTime)} contentSpan={'14'} />
          </Col>
        </Row>
      </Panel>
    );
  };
  const onSaveAndSyncClick = () => {
    onTest(() => onSubmit(true));
  };
  const render = () => {
    return (
      <div id="content" className="content">
        <Collapse
          defaultActiveKey={[
            'base',
            'userMappingPolicy',
            'orgMappingPolicy',
            'syncpolicy',
            'synctest',
            'syncstatus',
            'addressBookSync',
            'userAuth',
          ]}
          bordered={false}
        >
          {renderBasicForm()}
          {renderSyncForm()}
          {renderUserAttrsForm()}

          {renderTestForm()}
          {renderLastSyncInfo()}
        </Collapse>
        <div className="footerContainer">
          <Button type="primary" className="ml-10" onClick={onSaveAndSyncClick}>
            保存并同步
          </Button>
          <Button type="primary" className="ml-10" onClick={() => onSubmit(false)}>
            保存
          </Button>
          <Button type="ghost" className="ml-10" onClick={onCancel}>
            取消
          </Button>
        </div>
      </div>
    );
  };
  return render();
};

export default SettingLinker;
