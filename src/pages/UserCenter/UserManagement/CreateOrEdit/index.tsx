import React, { useEffect, useState } from 'react';
import PicturesWall from '@/components/ImageUploader';
import { PageContainer } from '@ant-design/pro-layout';
// import { CaretRightOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Space,
  Form,
  Input,
  Col,
  Row,
  Radio,
  message,
  Checkbox,
  DatePicker,
  Divider,
  Spin,
  Select,
} from 'antd';
import { history, useLocation } from 'umi';
import _, { find } from 'lodash';
import SelectOrgs from '@/components/SelectOrgs';
import type { OrgType, UserAnotherType } from '../../data';
import { addOrEditUser, getOrgsList, getUserInfo, editSelfInfo } from '../../service';
import { getBaseUserInfo } from './server';
import { getConfigsPolicies, currentUser } from '@/services/digitalsee/api';
import { validateName } from '@/utils/validator';
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
import type { Moment } from 'moment';
import moment from 'moment';
const FormItem = Form.Item;
import Authorization from './Authorization/Authorization';
import { useStateCallback } from '@/utils/common.utils';
import { useIntl } from 'umi';

const formLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const genderOptions = [
  { label: '保密', value: 'SECRET' },
  { label: '男性', value: 'MALE' },
  { label: '女性', value: 'FEMALE' },
];

const CreateOrEditUser: React.FC = (props: any) => {
  const intl = useIntl();
  const location = useLocation();
  const isSelf = location?.pathname == '/users/selfEdit' ? true : false;
  const [authVisibile, setAuthVisibile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [, setContent] = useStateCallback('');
  const [form] = Form.useForm();
  const [userinfo, setUserinfo] = useState<UserAnotherType>();
  const [configsPolicies, setConfigsPolicies] = useState<DIGITALSEE.ConfigsPolicies>();
  const [orgs, setOrgs] = useState<OrgType[]>([]);
  const [user_ExtendAttar, setUser_ExtendAttar] = useState<any>(null);
  const [custFiled, setCustFiled] = useState([]);
  const useLocationss = useLocation();
  // 同一个页面不同路由 此处区分如果是selfEdit路由是admin 普通用户则通过username地址栏传递
  const username = isSelf
    ? JSON.parse(sessionStorage.getItem('permMenus') || '{}').username
    : new URL(window.location.href)?.searchParams.get('username');

  const handleGetUserInfo = async () => {
    try {
      const userInfo = isSelf ? await currentUser() : await getUserInfo({ username });
      if (userInfo.error === '0') {
        if (userInfo.data) {
          for (const field in userInfo.data) {
            const isDate = _.find(user_ExtendAttar, {
              data_type: 'DATETIME',
              domain_name: field,
            });
            if (isDate && userInfo.data[field]) {
              userInfo.data[field] = moment(userInfo.data[field], 'YYYY-MM-DD HH:mm:ss');
            }
          }
        }
        setLoading(false);
        setUserinfo(userInfo.data);
        if (userInfo.data.start_date && userInfo.data.end_date) {
          form.setFieldsValue({
            startTimeendTime: [moment(userInfo.data.start_date), moment(userInfo.data.end_date)],
          });
        }
        for (const item in userInfo?.data) {
          if (typeof userInfo?.data[item] == 'string') {
            if (userInfo?.data[item].includes(' ')) {
              userInfo.data[item] = moment(userInfo?.data[item].split(' ')[0]);
            } else if (
              /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/.test(userInfo?.data[item])
            ) {
              userInfo.data[item] = moment(userInfo?.data[item]);
            }
          }
        }
        if (userInfo?.data?.password_status == 'NORMAL') {
          userInfo.data.password_status = false;
        } else {
          userInfo.data.password_status = true;
        }
        form.setFieldsValue(userInfo.data);
      }
    } catch (error) {
      message.error(`服务器或网络错误，获取用户信息失败。错误信息: ${error}`);
    }
  };

  const handleGetConfigsPolicy = async () => {
    const configsPolicy = await getConfigsPolicies();
    if (configsPolicy.error === '0') {
      setConfigsPolicies(configsPolicy.data);
    }
  };
  const handleGetOrgsList = async () => {
    const orgsResult = await getOrgsList({ depth: 0, attrs: 'id,name,description,readonly' });
    if (orgsResult.data && orgsResult.data.length > 0) {
      const newOrgs: OrgType[] = [];
      orgsResult.data.map((org: OrgType) => {
        if (!org.readonly) {
          newOrgs.push(org);
        }
      });
      setOrgs(newOrgs);
    }
  };
  const ApplyForHideModal = () => {
    setAuthVisibile(false);
  };
  useEffect(() => {
    handleGetConfigsPolicy();
    handleGetOrgsList();
    getBaseUserInfo().then((rs) => {
      setUser_ExtendAttar(rs.data.items);
      setLoading(false);
      const temp_ls: any = [];
      rs.data.items.forEach((forIs: any) => {
        temp_ls.push(forIs.domain_name);
      });
      setCustFiled(temp_ls);
    });
  }, [username]);
  useEffect(() => {
    if (username && user_ExtendAttar) {
      handleGetUserInfo();
    }
  }, [user_ExtendAttar]);

  // const defaultSearchRange = getTwoDates(moment().subtract(6, 'day'), moment().endOf('day'));

  const onSaveUser = async (apply_explain?: string) => {
    const fields = await form.validateFields();
    let newFields = fields;
    const arr: any = [];
    const tempObj: any = {};

    if (!newFields?.password_status) {
      newFields.password_status = null;
    }
    for (const item in newFields) {
      if (item.indexOf('name-') != -1) {
        arr.push(newFields[item]);
      }
    }
    custFiled.forEach((forIs: any, forIx: any) => {
      tempObj[forIs] = arr[forIx];
    });
    for (const item in newFields) {
      if (newFields[item]?._isAMomentObject) {
        newFields[item] = newFields[item]?.format('YYYY-MM-DD');
      }
    }

    newFields.apply_explain = apply_explain;
    newFields.org_ids = [];

    newFields?.group_positions?.forEach?.((item) => {
      const { org_id } = item;
      // const obj = {};
      if (typeof org_id === 'string') {
        // obj.org_id = org_id;
        newFields.org_ids.push(org_id);
      } else {
        // obj.org_id = org_id.value;
        newFields.org_ids.push(org_id.value);
      }
    });

    newFields = {
      // ...tempObj,
      ...newFields,
      group_positions: JSON.stringify(newFields?.group_positions),
      email_verified: true,
      phone_number_verified: true,
      // start_date: fields.startTimeendTime
      //   ? fields.startTimeendTime[0].format('YYYY-MM-DD')
      //   : defaultSearchRange[0].format('YYYY-MM-DD'),
      // end_date: fields.startTimeendTime
      //   ? fields.startTimeendTime[1].format('YYYY-MM-DD')
      //   : defaultSearchRange[1].format('YYYY-MM-DD'),
      start_date: fields.startTimeendTime ? fields.startTimeendTime[0].format('YYYY-MM-DD') : null,
      end_date: fields.startTimeendTime ? fields.startTimeendTime[1].format('YYYY-MM-DD') : null,
    };
    delete newFields.startTimeendTime;
    let method = 'POST';
    let action = '创建';
    let addOrEditUserParams = JSON.parse(JSON.stringify({ welcome: true }));
    if (username) {
      method = 'PATCH';
      action = '更新';
      addOrEditUserParams = JSON.parse(JSON.stringify({ username }));
    }
    const hide = message.loading(`正在${action}`);
    // todo   是自身修改则不传递这三个参数
    if (isSelf) {
      delete newFields?.password_status;
      delete newFields?.start_date;
      delete newFields?.end_date;
      delete newFields?.email_verified;
      delete newFields?.phone_number_verified;
      delete newFields.org_ids;
    }
    try {
      const res = isSelf
        ? await editSelfInfo(newFields)
        : await addOrEditUser(method, addOrEditUserParams, newFields);
      if (res.error === '0') {
        message.success(`${action}成功`);
        history.goBack();
      } else {
        message.error(`${action}失败，请重试，失败原因：${res.error}`);
      }
    } catch (error) {
      message.error(`服务器或网络错误，请重试。错误信息：${error}`);
    } finally {
      hide();
    }
  };
  const handleAddOrEditUser = async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const pathname = window.location.pathname;
    if (
      !(useLocationss.search == '?isPopup=true') &&
      (pathname.includes('users/add') || pathname.includes('users/users'))
    ) {
      if (configsPolicies!.user_policy!.user_create_verify) {
        setAuthVisibile(true);
      } else {
        onSaveUser('');
      }
    } else {
      onSaveUser('');
    }
  };
  const ApplyForOkModal = (value: string) => {
    if (!value.trim()) {
      message.error('输入内容不能为空');
      return;
    }
    setAuthVisibile(false);
    setContent(value, (newvalue: any) => {
      onSaveUser(newvalue);
    });
  };
  const validatePassword = function (customizeRules?: DIGITALSEE.PasswordComplexity) {
    return function (_rule: any, value: string, callback: any) {
      const regExpObj = {
        require_num: /\d/,
        require_spec_char: /[\!\"\#\$\%\&\'\(\)\*\+\,\-\.\/\:\;\<\=\>\?\@\[\\\]\^_\`\{\|\}\~]/,
        require_upper_char: /[A-Z]/,
        require_lower_char: /[a-z]/,
      };

      if (value && customizeRules) {
        const mainArr: any = [];
        const strArr: any = [];
        const lenPattern = new RegExp(`^.{${customizeRules.min_len},${customizeRules.max_len}}$`);
        const spacePattern = /\s/;
        if (!lenPattern.test(value)) {
          if (customizeRules.min_len !== customizeRules.max_len) {
            mainArr.push(`请输入${customizeRules.min_len}-${customizeRules.max_len}个字符`);
          } else {
            mainArr.push(`请输入${customizeRules.min_len}个字符`);
          }
        }
        if (spacePattern.test(value)) {
          mainArr.push(`不允许输入空格`);
        }
        for (const key in regExpObj) {
          if (regExpObj.hasOwnProperty(key) && customizeRules[key] === 1) {
            if (!regExpObj[key].test(value)) {
              switch (key) {
                case 'require_num':
                  strArr.push('数字');
                  break;
                case 'require_spec_char':
                  strArr.push('特殊字符');
                  break;
                case 'require_upper_char':
                  strArr.push('大写字母');
                  break;
                case 'require_lower_char':
                  strArr.push('小写字母');
              }
            }
          }
        }
        if (strArr.length !== 0) {
          strArr[0] = `还需包含${strArr[0]}`;
          mainArr.push(strArr.join('、'));
        }
        if (mainArr.length === 0) {
          callback();
        } else {
          callback(mainArr.join('；'));
        }
      } else {
        callback();
      }
    };
  };

  const validateUsername = function (_rule: any, value: string, callback: any) {
    validateName(_rule, value, callback, '用户名格式不正确');
  };

  const validatePhoneNumber = function (_rule: any, value: string, callback: any) {
    const regExp = /^\+?[0-9]{4,11}$/;
    if (value && !regExp.test(value)) {
      callback('电话号码格式不正确');
    } else {
      callback();
    }
  };

  // 当组织机构信息发生变化的时候，职位信息作相应调整。
  const handleOrgChange = async ({ checkedKeys, checkedNodeList }: any) => {
    const orgsChangeValues = form.getFieldsValue();
    let newOrgsChangeValues = orgsChangeValues;
    const { group_positions } = orgsChangeValues;
    const newGroupPositions: any[] = [];
    if (checkedNodeList.length > 0) {
      checkedNodeList.forEach((orgObj: any) => {
        const groupPosition = find(group_positions, { org_id: orgObj.org_id });
        if (groupPosition) {
          newGroupPositions.push(groupPosition);
        } else {
          newGroupPositions.push({
            position: '',
            user_code: '',
            org_id: orgObj.org_id,
            org_name: orgObj?.org_name,
          });
        }
      });
    }
    newOrgsChangeValues = {
      ...newOrgsChangeValues,
      group_positions: newGroupPositions,
      org_ids: checkedKeys,
    };
    setUserinfo(newOrgsChangeValues);
    form.setFieldsValue(newOrgsChangeValues);
  };
  const goBack = () => {
    const { onBack } = props;
    if (onBack) {
      onBack();
    } else {
      history.goBack();
    }
  };

  const isRequired = (fieldName: string) => {
    return configsPolicies?.signup_policy.mandatory_attrs.includes(fieldName);
  };

  // const onSearchTimeRangeChanged = (value: any) => {
  //   // 此处为了传递Tree组件设置变量
  //   setStart(value[0].unix());
  //   setEnd(value[1].unix());
  // };
  const handleStartDisabledDate = (current: Moment) => {
    return current < moment().add(-1, 'day');
  };
  const renderExtUserInfo = () => {
    if (!user_ExtendAttar || !user_ExtendAttar.length) {
      return null;
    }
    return (
      <>
        <h3
          style={{
            marginLeft: '6px',
            color: 'rgba(0, 0, 0, 0.85)',
            fontWeight: '500',
            fontSize: '16px',
          }}
        >
          用户扩展字段
        </h3>
        <Divider />
        <Spin spinning={loading}>
          <Row gutter={[16, 16]}>
            {user_ExtendAttar &&
              user_ExtendAttar.map((mapIs: any, mapIx: any) => {
                return (
                  <Col span={9} key={mapIx}>
                    <FormItem
                      label={mapIs.display_name}
                      name={`${mapIs.domain_name}`}
                      shouldUpdate
                      rules={[
                        {
                          type:
                            mapIs?.data_type == 'INT'
                              ? 'number'
                              : mapIs?.page_control == 'DATETIME'
                              ? 'date'
                              : 'string',
                          required: mapIs.mandatory,
                          message:
                            mapIs?.data_type == 'INT'
                              ? intl.formatMessage({
                                  id: 'ApplicationManagement.createUser.onlyEnterNumbers',
                                })
                              : intl.formatMessage({
                                  id: 'ApplicationManagement.createUser.extendedFieldTips',
                                }),
                          transform: (value: any) => {
                            if (value && mapIs?.data_type == 'INT') {
                              return Number(value);
                            }
                            if (value && mapIs?.page_control == 'DATETIME') {
                              return moment(value).format(dateFormat);
                            }
                            return value;
                          },
                        },
                      ]}
                    >
                      {mapIs?.page_control == 'DATETIME' ? (
                        <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
                      ) : mapIs?.page_control == 'SELECT' ? (
                        <Select
                          style={{ width: '100%' }}
                          options={JSON.parse(mapIs?.constraint_rule || '{}')?.range}
                        />
                      ) : (
                        <Input />
                      )}
                    </FormItem>
                  </Col>
                );
              })}
          </Row>
        </Spin>
      </>
    );
  };
  return (
    <PageContainer
      extra={
        <Space>
          <Button type="default" onClick={goBack}>
            返回
          </Button>
        </Space>
      }
    >
      <Card title="用户信息">
        <Form form={form} {...formLayout}>
          <Row gutter={[16, 16]}>
            <Col span={9}>
              <FormItem label="头像" name="picture" shouldUpdate extra="图片小于50k">
                <PicturesWall />
              </FormItem>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={9}>
              {username ? (
                <FormItem label="用户名" shouldUpdate>
                  <Input value={userinfo?.username} readOnly={true} disabled />
                </FormItem>
              ) : (
                <FormItem
                  label="用户名"
                  name="username"
                  rules={[
                    { required: isRequired('username'), message: '请输入用户名' },
                    { validator: validateUsername },
                  ]}
                  shouldUpdate
                >
                  <Input />
                </FormItem>
              )}
            </Col>

            {!username ? (
              <>
                <Col span={9}>
                  <FormItem
                    label="密码"
                    name="password"
                    rules={[
                      { required: isRequired('password'), message: '请输入密码' },
                      { validator: validatePassword(configsPolicies?.pwd_complexity) },
                    ]}
                    shouldUpdate
                  >
                    <Input type="password" />
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem name="password_status" valuePropName="checked" shouldUpdate>
                    <Checkbox>首次登录修改密码</Checkbox>
                  </FormItem>
                </Col>
              </>
            ) : null}
            <Col span={9}>
              <FormItem
                label="姓名"
                name="name"
                shouldUpdate
                rules={[{ required: isRequired('name'), message: '请输入姓名' }]}
              >
                <Input />
              </FormItem>
            </Col>
            {!isSelf && username ? (
              <Col span={6}>
                <FormItem name="password_status" valuePropName="checked" shouldUpdate>
                  <Checkbox>首次登录修改密码</Checkbox>
                </FormItem>
              </Col>
            ) : null}
            <Col span={9}>
              <FormItem
                label="手机号"
                name="phone_number"
                rules={[
                  { required: isRequired('phone_number'), message: '请输入手机号' },
                  { validator: validatePhoneNumber },
                ]}
                shouldUpdate
              >
                <Input />
              </FormItem>
            </Col>
            <Col span={9}>
              <FormItem
                label="邮箱"
                name="email"
                rules={[
                  { required: isRequired('email'), message: '请输入邮箱' },
                  {
                    type: 'email',
                    message: '邮箱格式不正确',
                  },
                ]}
                shouldUpdate
              >
                <Input />
              </FormItem>
            </Col>

            <Col span={9}>
              <FormItem
                label="昵称"
                name="nickname"
                shouldUpdate
                rules={[{ required: isRequired('nickname'), message: '请输入昵称' }]}
              >
                <Input />
              </FormItem>
            </Col>
            <Col span={9}>
              <FormItem
                label="性别"
                name="gender"
                shouldUpdate
                rules={[{ required: isRequired('gender'), message: '请输入昵称' }]}
              >
                <Radio.Group options={genderOptions} optionType="button" buttonStyle="solid" />
              </FormItem>
            </Col>
            {isSelf ? null : (
              <Col span={9}>
                <FormItem
                  label="有效期"
                  name="startTimeendTime"
                  shouldUpdate
                  rules={[{ required: isRequired('start_date'), message: '请输入时间' }]}
                >
                  <RangePicker disabledDate={handleStartDisabledDate} format={dateFormat} />
                </FormItem>
              </Col>
            )}
            <Col span={9}>
              <FormItem
                label="工号"
                name="user_job_number"
                shouldUpdate
                rules={[{ required: isRequired('user_job_number'), message: '请输入工号' }]}
              >
                <Input />
              </FormItem>
            </Col>
            {isSelf ? null : (
              <Col span={9}>
                <FormItem
                  label="组织机构"
                  name="org_ids"
                  rules={[
                    {
                      required: true,
                      message: '组织机构为必填选项',
                    },
                  ]}
                  shouldUpdate
                >
                  <SelectOrgs
                    checkedKeys={userinfo?.org_ids || []}
                    orgs={orgs}
                    handleOnCheck={handleOrgChange}
                  />
                </FormItem>
              </Col>
            )}
          </Row>
          {isSelf ? null : (
            <Form.List name="group_positions">
              {(fields) => (
                <>
                  {fields.map(({ key, name, fieldKey, ...restField }) => (
                    <Row key={key} gutter={[16, 16]}>
                      <Col span={9}>
                        <Form.Item
                          {...restField}
                          label={
                            userinfo?.group_positions
                              ? `${userinfo?.group_positions[key].org_name}职位`
                              : '职位名称'
                          }
                          name={[name, 'position']}
                          validateTrigger={['onChange', 'onBlur']}
                          rules={[
                            {
                              // required: userinfo?.group_positions[key].org_name == '默认组' ? false : true,
                              whitespace: true,
                              message: '请输入职位名称',
                            },
                          ]}
                        >
                          <Input placeholder="输入职位名称" />
                        </Form.Item>
                      </Col>
                      <Col span={9}>
                        <Form.Item
                          {...restField}
                          label="职位编号"
                          name={[name, 'user_code']}
                          validateTrigger={['onChange', 'onBlur']}
                          rules={[
                            {
                              // required: userinfo?.group_positions[key].org_name == '默认组' ? false : true,
                              whitespace: true,
                              message: '请输入职位编号',
                            },
                          ]}
                        >
                          <Input placeholder="输入职位编号" />
                        </Form.Item>
                      </Col>
                    </Row>
                  ))}
                </>
              )}
            </Form.List>
          )}
          {renderExtUserInfo()}
          <Row gutter={[16, 16]} justify="center">
            <Col span={9}>
              <FormItem wrapperCol={{ span: 8, offset: 5 }}>
                <Button
                  key="SAVE"
                  type="primary"
                  onClick={handleAddOrEditUser}
                  block
                  style={{ marginTop: '50px' }}
                >
                  保存
                </Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
        <Authorization
          ApplyForVisible={authVisibile}
          ApplyForOkModal={ApplyForOkModal}
          ApplyForHideModal={ApplyForHideModal}
        />
      </Card>
    </PageContainer>
  );
};
export default CreateOrEditUser;
