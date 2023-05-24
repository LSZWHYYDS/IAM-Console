import InfoItem from '@/components/InfoItem';
import UserGroupTree from '@/components/UserGroupTree';
import {
  errorCode,
  formatCSTTime,
  showErrorMessage,
  showSuccessMessage,
  t,
} from '@/utils/common.utils';
import { PageContainer } from '@ant-design/pro-layout';
import {
  Button,
  Card,
  Col,
  Collapse,
  Form,
  Input,
  Radio,
  Row,
  Select,
  Modal,
  Checkbox,
  message,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { history } from 'umi';
import _ from 'lodash';
const { confirm } = Modal;
import {
  getAttrList,
  getDsProfiles,
  getOrgAttrList,
  getPushLink,
  getSnsByType,
  pushAdd,
  pushEdit,
  pushSync,
  pushTest,
} from '../service';
import type { ConfigTip, SubAttrType } from './data';
import LinkerDingMapAttrsComponent from './LinkerDingMapAttrsComponent';
import { ExclamationCircleFilled } from '@ant-design/icons';

const FormItem = Form.Item,
  RadioGroup = Radio.Group,
  Option = Select.Option,
  Panel = Collapse.Panel;
const configTips: ConfigTip = {};
const orgAttrs = {};
let initData: any = null;
const CreateOrEditSyncGene: React.FC = (props: any) => {
  const { location } = props;
  const { query } = location;
  const { id } = query;
  const [formRef] = Form.useForm();
  const [mandatoryAttrsArray, setMandatoryAttrsArray] = useState({});
  const [loading, setLoading] = useState(false);
  const [treeShow, setTreeShow] = useState(false);
  const [data, setData] = useState<any>({});
  const [linkerType, setLinkerType] = useState(query.type || 'DINGDING');
  const [snsAll, setSnsAll] = useState<any>([]);
  const [testStatus, setTestStatus] = useState(false);
  const [syncStatus, setSyncStatus] = useState(false);

  const [subBasicAttrs, setSubBasicAttrs] = useState<SubAttrType[]>([]);
  const [subExtendAttrs, setSubExtendAttrs] = useState<SubAttrType[]>([]);
  const [selectedKey, setSelectedKey] = useState<any>([]);
  const [checkedKeys, setCheckedKeys] = useState<any>([]);

  const [treeDate, setTreeData] = useState([]);
  const [cacheTreeGroupId, setCacheTreeGroupId] = useState([]);
  const [tempArray, settempArray] = useState<any>([]);
  const filterCancle = (datas: any, arr: any) => {
    if (datas) {
      _.forEach(datas, function (forIs) {
        if (arr.includes(forIs['key'])) {
          settempArray((preState) => {
            preState.push(forIs['name']);
            return preState;
          });
        }
        if (forIs.children && forIs.children.length !== 0) {
          filterCancle(forIs.children, arr);
        }
        if (!forIs.children && forIs.children.length == 0) {
          return;
        }
      });
    }
    return tempArray;
  };

  const formatData = (dataObj: any) => {
    // const { conn_info, import_policy } = data;
    if (typeof dataObj.user_attrs === 'string') {
      dataObj.map_attrs = JSON.parse(dataObj.user_attrs);
    } else if (typeof dataObj.user_attrs === 'object') {
      dataObj.map_attrs = dataObj.user_attrs;
    }
    if (typeof dataObj.map_attrs === 'string') {
      dataObj.map_attrs = JSON.parse(dataObj.map_attrs);
    }
    const { map_attrs, config } = dataObj;
    let outer_dept = false;
    let account_type = '';
    if (dataObj.extra_config && typeof dataObj.extra_config === 'string') {
      const extra_config = JSON.parse(dataObj.extra_config);
      outer_dept = extra_config.outer_dept;
      account_type = extra_config.account_type;
    } else {
      outer_dept = false;
    }
    const obj = {
      push_period: dataObj.push_period,
      profile_name: dataObj.name,
      delete_limit: parseInt(dataObj.delete_limit),
      outer_dept,
      account_type,
      ds_type: dataObj.type,
      endTime: dataObj.push_end_time,
      startTime: dataObj.push_start_time,
    };
    return Object.assign({}, obj, map_attrs, dataObj, config);
  };
  const getSnsAll = () => {
    getSnsByType(linkerType)
      .then((res) => {
        if (res.error === '0') {
          setSnsAll(res.data);
        } else {
          showErrorMessage(res.error_description);
        }
      })
      .catch((error) => {
        showErrorMessage(error);
      });
  };
  const getAttrListFunc = () => {
    const optionalAttrsRtn = getAttrList({ page: 1, size: 50, as_import: true });
    optionalAttrsRtn.then((rep) => {
      if (rep.data) {
        const subBasicAttrsData: any = [];
        const subExtendAttrsData: any = [];
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
            ({ display_name: subBasicAttr.display_name, domain_name: subBasicAttr.domain_name } =
              attr);
            const mandatoryAttrsArrayData = mandatoryAttrsArray && mandatoryAttrsArray[linkerType];
            const mandatoryValueArray: any = [];
            if (Array.isArray(mandatoryAttrsArrayData)) {
              mandatoryAttrsArrayData.forEach((item) => {
                const value = configTips[linkerType].user_attrs[item];
                mandatoryValueArray.push(value);
              });
            }
            const pos =
              (mandatoryAttrsArrayData &&
                mandatoryAttrsArrayData.indexOf(subBasicAttr.domain_name)) ||
              -1;
            if (pos == -1) {
              subBasicAttrsData.push(subBasicAttr);
            }
          } else {
            ({ display_name: subExtendAttr.display_name, domain_name: subExtendAttr.domain_name } =
              attr);
            subExtendAttrsData.push(subExtendAttr);
          }
        }
        setSubBasicAttrs(subBasicAttrsData);
        setSubExtendAttrs(subExtendAttrsData);
      }
    });
  };
  const formatterMapItems = (mappedItems: any, ds_type: string) => {
    const list: any = [];
    const subAttrValueTip = configTips[ds_type] && configTips[ds_type].map_attrs;
    for (const fieldName in mappedItems) {
      if (!subAttrValueTip[fieldName]) {
        list.push({
          fieldName: fieldName,
          fieldValue: mappedItems[fieldName],
        });
      }
    }
    return list;
  };
  //得到以前输入的对应关系
  const getMandatoryAttrItems = (subAttrValueTipPara: any) => {
    const userFormMappedAttrMap = new Map();
    const mandatoryAttrItems: any = [];
    const mandatoryAttrsMap = new Map();
    const { map_attrs } = data;
    if (
      mandatoryAttrsArray[linkerType] &&
      mandatoryAttrsArray[linkerType].length > 0 &&
      subBasicAttrs.length > 0 &&
      map_attrs &&
      Object.keys(map_attrs).length > 0
    ) {
      const pwdPos = mandatoryAttrsArray[linkerType].indexOf('password');
      if (pwdPos != -1) {
        mandatoryAttrsArray[linkerType].splice(pwdPos, 1);
      }
      Object.keys(map_attrs).forEach((key) => {
        if (mandatoryAttrsArray[linkerType].indexOf(key) != -1) {
          mandatoryAttrsMap.set(key, map_attrs[key]);
        } else {
          userFormMappedAttrMap.set(key, map_attrs[key]);
        }
      });
      if (mandatoryAttrsMap.size == 0) {
        mandatoryAttrsArray[linkerType].forEach((attr: any) => {
          mandatoryAttrsMap.set(attr, subAttrValueTipPara && subAttrValueTipPara[attr]);
        });
      }
    }
    mandatoryAttrsMap.forEach((v, k) => {
      mandatoryAttrItems.push(
        <FormItem
          // {...formItemLayoutMappingUsername}
          // eslint-disable-next-line react/no-array-index-key
          key={`form-sub-${k}`}
          initialValue={k}
          rules={[{ required: true, message: '请输入' }]}
        >
          <Input
            style={{ marginLeft: '195px', width: '300px', height: '32px' }}
            disabled={true}
            value={k}
          />
          <Input
            value={t(`user.attr.${v}`)}
            style={{ marginLeft: '20px', width: '300px', height: '32px' }}
            disabled={true}
          />
        </FormItem>,
      );
    });
    return {
      mandatoryAttrItems,
      userFormMappedAttrMap,
    };
  };
  const getDsProfilesFunc = () => {
    getDsProfiles()
      .then((resp) => {
        const tips = resp.data;
        const mandatoryAttrsArrayData = {};
        tips.forEach((tip: any) => {
          configTips[tip.account_type] = formatData(tip);
          mandatoryAttrsArrayData[tip.account_type] = tip.user_fields;
          orgAttrs[tip.account_type] = tip.org_attrs;
        });
        setMandatoryAttrsArray(mandatoryAttrsArrayData);
      })
      .then(() => {
        if (id) {
          if (JSON.stringify(data) == '{}') {
            getPushLink(id).then((res) => {
              const resData = res.data;
              initData = formatData(resData);
              if (initData.root_group_id) {
                sessionStorage.setItem('checkedKeys', initData.root_group_id.join());
                setCheckedKeys(initData.root_group_id);
                setCacheTreeGroupId(initData.root_group_id);
              }
              setData(initData);
              setLinkerType(initData.ds_type);
              setTreeShow(initData.sync_type !== 'FULL');
              setSyncStatus(initData.status);
              const ds_type = initData.ds_type;
              initData.userFormMappedAttrMap = formatterMapItems(initData.map_attrs, ds_type);
              formRef.setFieldsValue(initData);
              // 取值
              const UserId = JSON.parse(initData?.extra_config || '{}');
              formRef.setFieldsValue({
                outer_dept: UserId?.outer_dept,
              });
              if (UserId?.user_id_mapping == 'username') {
                formRef.setFieldsValue({
                  user_id_mapping: true,
                });
              } else {
                formRef.setFieldsValue({
                  user_id_mapping: false,
                });
              }
            });
          } else {
            initData = formatData(data);
            setData(initData);
            formRef.setFieldsValue(initData);
          }
        } else {
          let type = '';
          switch (linkerType) {
            case 'DINGDING':
              type = 'DINGDING';
              break;
            case 'ADLDAP':
              type = 'AD';
              break;
            case 'WEWORK':
              type = 'WEWORK';
              break;
          }
          setData(configTips[type]);
        }
        getAttrListFunc();
      })
      .catch(function (error) {
        showErrorMessage(error);
      });
  };
  const getOrgAttrListFunc = () => {
    const orgAttrParams = { page: 1, size: 20, as_import: 1 };
    const optOrgAttrs = getOrgAttrList(orgAttrParams);
    optOrgAttrs.then((rep) => {
      if (rep.data) {
        const orgBasicAttrsData: any = [];
        const orgExtendAttrsData: any = [];
        for (const attr of rep.data.items) {
          const orgBasicAttr: any = {
            display_name: '',
            domain_name: '',
          };
          const orgExtendAttr: any = {
            display_name: '',
            domain_name: '',
          };
          const { basic_attribute: isBasic } = attr;
          if (isBasic) {
            ({ display_name: orgBasicAttr.display_name, domain_name: orgBasicAttr.domain_name } =
              attr);
            orgBasicAttrsData.push(orgBasicAttr);
          } else {
            ({ display_name: orgExtendAttr.display_name, domain_name: orgExtendAttr.domain_name } =
              attr);
            orgExtendAttrsData.push(orgExtendAttr);
          }
        }
      }
    });
  };
  const loadData = async () => {
    getSnsAll();
    getDsProfilesFunc();
    getOrgAttrListFunc();
  };
  useEffect(() => {
    loadData();
  }, []);
  const onCancel = () => {
    history.goBack();
  };
  const setUserAttrFormDataForSave = (dataObj: any, formData: any) => {
    const ds_type = dataObj.type;
    const subAttrValueTip = configTips[ds_type] && configTips[ds_type].map_attrs;
    const dataList = formData.userFormMappedAttrMap || [];

    const map_attrs = {};
    dataList.forEach((field: any) => {
      if (field.fieldValue && field.fieldName) {
        map_attrs[field.fieldName] = field.fieldValue;
      }
    });
    dataObj.map_attrs = { ...subAttrValueTip, ...map_attrs, ...dataObj.map_attrs };
  };
  const getData = (opType: any, callback: any) => {
    const { validateFields } = formRef;
    validateFields().then((values) => {
      let mappedOrgAttrsObj = {};
      if (values.orgFormMappedAttrMap) {
        values.orgFormMappedAttrMap.delete('');
        mappedOrgAttrsObj = Object.create(null);
        for (const k of values.orgFormMappedAttrMap.keys()) {
          mappedOrgAttrsObj[k] = values[`orgFormMappedAttrMap-${k}`];
        }
      }
      // 认证
      let mappedAgentAttrsObj = {};
      if (values.agentFormMappedAttrMap) {
        values.agentFormMappedAttrMap.delete('');
        mappedAgentAttrsObj = Object.create(null);
        for (const k of values.agentFormMappedAttrMap.keys()) {
          const value = values[`agentFormMappedAttrMap-${k}`];
          mappedAgentAttrsObj[k] = value;
        }
      }
      const orgAttrsData = orgAttrs[linkerType];
      const prevData = data;
      prevData.root_group_id = checkedKeys || null;

      setData(prevData);
      const dataObj: any = {
        id: values.id,
        config_id: values.config_id,
        map_org_attrs: orgAttrsData,
        name: values.profile_name,
        delete_limit: parseInt(values.delete_limit),
        push_period: parseInt(values.push_period, 10) || 0,
        extra_config: JSON.stringify({
          outer_dept: values.outer_dept,
          account_type: values.account_type,
          user_id_mapping: values?.user_id_mapping ? 'username' : 'id',
        }),
        sync_type: values.sync_type,
        type: 'DINGDING',
        status: syncStatus || 'ACTIVE',
      };
      if (values.sync_type === 'FULL') {
        dataObj.root_group_id = ['-1'];
      } else {
        const tempCheckedKeys = checkedKeys;
        if (!tempCheckedKeys || tempCheckedKeys.join() === '-1') {
          showErrorMessage('请选择组织范围');
          setLoading(false);
          return;
        }
        tempCheckedKeys.forEach((item, index) => {
          if (item === '-1') {
            tempCheckedKeys.splice(index, 1);
          }
        });
        dataObj.root_group_id = tempCheckedKeys;
      }
      setUserAttrFormDataForSave(dataObj, values);

      // const transObj: any = {};
      // for (const item in dataObj?.map_attrs) {
      //   if (!['name', 'mobile'].includes(item)) {
      //     transObj[dataObj?.map_attrs[item]] = item;
      //   } else {
      //     transObj[item] = dataObj?.map_attrs[item];
      //   }
      // }
      // dataObj.map_attrs = transObj;
      if (typeof callback === 'function') {
        callback(dataObj);
      }
    });
  };
  const onSubmit = (sync: boolean) => {
    getData('submit', (resData: any) => {
      if (resData?.root_group_id?.length == 0) {
        message.warning('请必须选择一个部门!');
        return;
      }
      let p;
      if (!id) {
        p = pushAdd(resData);
      } else {
        // 在同步时候 判断勾选部门是否比回显时候少 如果少则提示
        if (cacheTreeGroupId.every((item) => checkedKeys?.includes(item))) {
          p = pushEdit(id, resData);
        } else {
          // 让其不在新选择的数组里边的ID过滤出来
          const notNewArray = cacheTreeGroupId.filter(
            (filItem) => checkedKeys.indexOf(filItem) == -1,
          );
          const cancleArray = _.uniqWith(filterCancle(treeDate, notNewArray), _.isEqual);
          confirm({
            title: (
              <span style={{ fontSize: 14 }}>
                <span>您将取消</span>
                <span style={{ color: '#f40', margin: '0 3px' }}>
                  &quot;{cancleArray.join(',')}&quot;
                </span>
                <span>的部门同步，钉钉会删除部门下的用户请谨慎操作！</span>
              </span>
            ),
            icon: <ExclamationCircleFilled />,
            cancelText: '取消',
            okText: '保存',
            // content: '删除部门的名称为：' + cancleArray.join(','),
            onOk() {
              p = pushEdit(id, resData);
              setLoading(true);
              p.then((res) => {
                if (sync) {
                  pushSync(res.data, true)
                    .then((linkerRes) => {
                      if (linkerRes.result) {
                        setLoading(false);
                        showSuccessMessage();
                        history.push('/users/syncgene');
                      } else {
                        showErrorMessage(errorCode[linkerRes.data.code]);
                      }
                    })
                    .catch((error) => {
                      setLoading(false);
                      showErrorMessage(error);
                    });
                } else {
                  setLoading(false);
                  if (res.result) {
                    showSuccessMessage();
                    history.push('/users/syncgene');
                  } else {
                    showErrorMessage(errorCode[res.data.code]);
                  }
                }
              }).catch((error) => {
                setLoading(false);
                showErrorMessage(error);
              });
            },
            onCancel() {},
          });
          return;
        }
      }
      setLoading(true);
      p.then((res) => {
        if (sync) {
          pushSync(res.data, true)
            .then((linkerRes) => {
              if (linkerRes.result) {
                setLoading(false);
                showSuccessMessage();
                history.push('/users/syncgene');
              } else {
                showErrorMessage(errorCode[linkerRes.data.code]);
              }
            })
            .catch((error) => {
              setLoading(false);
              showErrorMessage(error);
            });
        } else {
          setLoading(false);
          if (res.result) {
            showSuccessMessage();
            history.push('/users/syncgene');
          } else {
            showErrorMessage(errorCode[res.data.code]);
          }
        }
      }).catch((error) => {
        setLoading(false);
        showErrorMessage(error);
      });
    });
  };
  const onTest = () => {
    getData('test', (resData: any) => {
      setLoading(true);
      pushTest(resData)
        .then((res) => {
          if (res.result && res.data) {
            setLoading(false);
            setTestStatus(true);
            showSuccessMessage('测试成功');
          } else {
            setLoading(false);
            showErrorMessage(res.error_description);
          }
        })
        .catch((error) => {
          setLoading(false);
          showErrorMessage(error);
        });
    });
  };
  const onSyncChange = (e: any) => {
    const value = e.target.value;
    const show = value === 'FULL' ? false : true;
    setTreeShow(show);
  };
  const onClickTreeNode = (key: any, e: any) => {
    if (!e || e.selected) {
      setSelectedKey(key);
    }
  };

  const onCheckNode = (checkedKeysPara: any) => {
    setCheckedKeys(checkedKeysPara);
  };
  const render = () => {
    const {
      ds_type = '',
      push_period,
      outer_dept,
      sync_type,
      profile_name,
      delete_limit,
      endTime,
      startTime,
      map_org_attrs,
      config_id,
      account_type,
    } = data || {};

    const orgFormMappedAttrMap = new Map();
    const subAttrValueTip = configTips[ds_type] && configTips[ds_type].map_attrs;

    if (map_org_attrs) {
      Object.keys(map_org_attrs).forEach((key) => {
        orgFormMappedAttrMap.set(key, map_org_attrs[key]);
      });
    }
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 12 },
    };
    const attrItemObj = getMandatoryAttrItems(subAttrValueTip);
    return (
      <div id="content" className="content">
        <Form form={formRef} className="formPadding" layout="horizontal" autoComplete="off">
          <Collapse
            defaultActiveKey={[
              'base',
              'userMappingPolicy',
              'orgMappingPolicy',
              'syncpolicy',
              'synctest',
              'syncstatus',
              'syncRange',
              'orgRange',
            ]}
            bordered={false}
          >
            <Panel header="基本内容" key="base">
              <Row>
                <Col span="12">
                  <Row>
                    <Col span="6" className="ant-form-item-label">
                      类型：
                    </Col>
                    <Col span="6" className="ant-form-item-control">
                      钉钉用户同步
                    </Col>
                  </Row>
                </Col>
                <Col span="12" style={{ display: 'none' }}>
                  <FormItem label="id" {...formItemLayout} name="id" initialValue={id || ''}>
                    <Input type="text" />
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem
                    label={<span title="名称">名称</span>}
                    {...formItemLayout}
                    name="profile_name"
                    initialValue={profile_name || ''}
                    rules={[{ required: true, message: '请输入' }]}
                  >
                    <Input type="text" disabled={query?.id ? true : false} />
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="12">
                  <FormItem
                    name="config_id"
                    label={<span title="企业选择">企业选择</span>}
                    {...formItemLayout}
                    initialValue={config_id || ''}
                    rules={[{ required: true, message: '请输入' }]}
                  >
                    <Select>
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
                <Col span="12">
                  <FormItem
                    name="account_type"
                    label="账号类型"
                    initialValue={account_type || ''}
                    rules={[{ required: true, message: '请输入' }]}
                    {...formItemLayout}
                  >
                    <Select>
                      <Option key="dingtalk" value="dingtalk">
                        专属账号
                      </Option>
                      <Option key="sso" value="sso">
                        专属SSO账号
                      </Option>
                      <Option key="standard" value="standard">
                        标准账号
                      </Option>
                    </Select>
                  </FormItem>
                </Col>
              </Row>
            </Panel>
            <Panel header="同步范围" key="syncRange">
              <Row>
                <Col span="12">
                  <FormItem
                    name="sync_type"
                    label="全部同步"
                    {...formItemLayout}
                    initialValue={sync_type || 'FULL'}
                  >
                    <RadioGroup onChange={onSyncChange}>
                      <Radio value="FULL">是</Radio>
                      <Radio value="INCR">否</Radio>
                    </RadioGroup>
                  </FormItem>
                </Col>
              </Row>
            </Panel>
            {treeShow && (
              <Panel header="组织结构范围" key="orgRange">
                <Row>
                  <Col span="12">
                    <UserGroupTree
                      defaultGroup
                      linkerGroup={true}
                      showCheckedTip={false}
                      showUserCount={true}
                      maxHeight={'390px'}
                      selectedKey={selectedKey}
                      defaultSelectedKey={selectedKey}
                      onClickTreeNode={onClickTreeNode}
                      onCheckNode={onCheckNode}
                      defaultCheckedKeys={checkedKeys}
                      checkStrictly={true}
                      setTreeData={setTreeData}
                    />
                  </Col>
                </Row>
              </Panel>
            )}
            <Panel header="同步策略" key="syncpolicy">
              <Row>
                <Col span="12">
                  <FormItem
                    name="push_period"
                    label="用户同步周期"
                    {...formItemLayout}
                    initialValue={
                      ((push_period || push_period === 0) && push_period.toString()) || ''
                    }
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
                    name="outer_dept"
                    label="通讯录设置"
                    {...formItemLayout}
                    initialValue={outer_dept}
                    valuePropName="checked"
                  >
                    <Checkbox>只能看到部门及下属部门通讯录</Checkbox>
                  </FormItem>
                </Col>
                <Col span={12} pull={3}>
                  <FormItem
                    name="user_id_mapping"
                    label=""
                    colon={false}
                    valuePropName="checked"
                    {...formItemLayout}
                  >
                    <Checkbox>用户名做钉钉userId</Checkbox>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="12">
                  <FormItem
                    name="delete_limit"
                    label="删除用户阈值"
                    initialValue={delete_limit || -1}
                    {...formItemLayout}
                    help="执行同步任务如数据源删除用户数等于或大于用户阈值，则链接器将不执行删除操作。如不希望在同步时删除用户，请将值设置为0，如不设删除上限，请将值配置为-1"
                  >
                    <Input type="number" min={-1} />
                  </FormItem>
                </Col>
              </Row>
            </Panel>
            <Panel className="mb-20" header="用户属性对应关系" key="userMappingPolicy">
              <Row>
                <Col span="24">
                  {attrItemObj.mandatoryAttrItems}
                  <LinkerDingMapAttrsComponent
                    dataParamName="userFormMappedAttrMap"
                    displayNameUtilPrefix="user.attr."
                    basicAttrs={subBasicAttrs}
                    extendAttrs={subExtendAttrs}
                    attrValueTips={subAttrValueTip}
                  />
                </Col>
              </Row>
            </Panel>
            <Panel header="测试" key="synctest">
              <Row className="mb-20">
                <span>通过调用“获取企业员工人数”接口以验证企业参数配置正确且鉴权通过</span>
              </Row>
              <Row>
                <Button
                  type="primary"
                  loading={loading}
                  // disabled={util.disabledBtnByFields(
                  //   getFieldsError(),
                  //   getFieldsValue(requiredFields),
                  // )}
                  onClick={onTest}
                >
                  {(loading && '测试中') || '测试'}
                </Button>
                {testStatus && <span style={{ marginLeft: '20px' }}>测试成功</span>}
              </Row>
            </Panel>
            {id && (
              <Panel header="上次同步" key="syncstatus">
                <Row>
                  <Col span="12">
                    <InfoItem
                      titleStr="开始时间"
                      contentObj={formatCSTTime(startTime)}
                      contentSpan={'14'}
                    />
                  </Col>
                  <Col span="12">
                    <InfoItem
                      titleStr="结束时间"
                      contentObj={formatCSTTime(endTime)}
                      contentSpan={'14'}
                    />
                  </Col>
                </Row>
              </Panel>
            )}
          </Collapse>
        </Form>
        <div className="footerContainer" style={{ margin: '0 20px' }}>
          <Button
            type="primary"
            className="ml-10"
            // disabled={
            //   util.disabledBtnByFields(getFieldsError(), getFieldsValue(requiredFields)) ||
            //   !testStatus ||
            //   syncStatus === 'INACTIVE'
            //todo }
            onClick={() => {
              onSubmit(true);
            }}
          >
            保存并同步
          </Button>
          <Button
            type="primary"
            className="ml-10"
            // disabled={
            //   util.disabledBtnByFields(getFieldsError(), getFieldsValue(requiredFields)) ||
            //   !testStatus
            // }
            onClick={() => {
              onSubmit(false);
            }}
          >
            保存
          </Button>
          <Button type="ghost" className="ml-10" onClick={onCancel}>
            取消
          </Button>
        </div>
      </div>
    );
  };
  return (
    <PageContainer title={false}>
      <Card title="链接器配置">{render()}</Card>
    </PageContainer>
  );
};
export default CreateOrEditSyncGene;
