import React, { useEffect, useState } from 'react';
import { Card, Form, Input, Col, Row, message } from 'antd';
import { getExpireUserInfo } from '../service';
import { parseQueryString } from '@/utils/common.utils';

const FormItem = Form.Item;

const formLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const genderMap = {
  MALE: '男性',
  FEMALE: '女性',
  SECRET: '保密',
};

const ExpireUserDetail: React.FC = () => {
  const [form] = Form.useForm();
  const [userinfo, setUserinfo] = useState<any>();
  const handleGetUserInfo = async (id) => {
    try {
      const userInfo = await getExpireUserInfo({ id });
      if (userInfo.error === '0') {
        setUserinfo(userInfo.data);
        form.setFieldsValue(userInfo.data);
      }
    } catch (error) {
      message.error(`服务器或网络错误，获取用户信息失败。错误信息: ${error}`);
    }
  };
  useEffect(() => {
    const params = parseQueryString(window.location.search) || {};
    if (params.a) {
      handleGetUserInfo(params.a);
    }
  }, []);
  return (
    <Card title="用户信息">
      <Form form={form} {...formLayout}>
        <Row gutter={[16, 16]}>
          <Col span={18}>
            <FormItem label="用户名" name="username" shouldUpdate>
              {userinfo?.username}
            </FormItem>
          </Col>
          <Col span={18}>
            <FormItem label="姓名" name="name" shouldUpdate>
              {userinfo?.name}
            </FormItem>
          </Col>
          <Col span={18}>
            <FormItem label="手机号" name="phone_number" shouldUpdate>
              {userinfo?.phone_number}
            </FormItem>
          </Col>
          <Col span={18}>
            <FormItem label="邮箱" name="email" shouldUpdate>
              {userinfo?.email}
            </FormItem>
          </Col>

          <Col span={18}>
            <FormItem label="昵称" name="nickname" shouldUpdate>
              {userinfo?.nickname}
            </FormItem>
          </Col>
          <Col span={18}>
            <FormItem label="性别" name="gender" shouldUpdate>
              {userinfo?.gender ? genderMap[userinfo?.gender] : '-'}
            </FormItem>
          </Col>
          <Col span={18}>
            <FormItem label="开始日期" name="start_date" shouldUpdate>
              {userinfo?.start_date}
            </FormItem>
          </Col>
          <Col span={18}>
            <FormItem label="结束日期" name="end_date" shouldUpdate>
              {userinfo?.end_date}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={18}>
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
              {userinfo?.org_ids}
            </FormItem>
          </Col>
        </Row>

        <Form.List name="group_positions">
          {(fields) => (
            <>
              {fields.map(({ key, name, fieldKey, ...restField }) => (
                <Row key={key} gutter={[16, 16]}>
                  <Col span={18}>
                    <Form.Item
                      {...restField}
                      label={
                        userinfo?.group_positions
                          ? `${userinfo?.group_positions[key].org_name}职位`
                          : '职位名称'
                      }
                      name={[name, 'position']}
                    >
                      <Input placeholder="输入职位名称" />
                    </Form.Item>
                  </Col>
                  <Col span={18}>
                    <Form.Item {...restField} label="职位编号" name={[name, 'user_code']}>
                      <Input placeholder="输入职位编号" />
                    </Form.Item>
                  </Col>
                </Row>
              ))}
            </>
          )}
        </Form.List>
      </Form>
    </Card>
  );
};
export default ExpireUserDetail;
