import ImageUploader from '@/components/ImageUploader';
import { formatDateTime } from '@/utils/common.utils';
import { lengthRange } from '@/utils/validator';
import { LoadingOutlined, AppstoreAddOutlined } from '@ant-design/icons';

import {
  Button,
  Card,
  Col,
  Form,
  Input,
  message,
  Row,
  Space,
  Radio,
  Checkbox,
  Typography,
  Modal,
} from 'antd';
import React, { useEffect, useState, forwardRef, useRef } from 'react';
import ListPopupCom from '@/pages/AppCenter/Classification/components/ListComponent';

import { UserOutlined } from '@ant-design/icons';
import { AppInfoType } from '../data';
import { createOrUpdateAppBaseInfo, requestData, saveClass } from '../service';
import appUtil from './appUtil';
import ClientSecret from './ClientSecret';
// import type { CheckboxValueType } from 'antd/es/checkbox/Group';
const { TextArea } = Input;
const FormItem = Form.Item;
const { Paragraph } = Typography;
const formLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 },
};
const formLayoutPng = {
  labelCol: { span: 10 },
  wrapperCol: { span: 12 },
};
interface returnObj {
  classList: any[];
}
type VerifyRef = {
  current: {
    context: any;
    props: any;
    refs: any;
    renderUlList: () => void;
    updateClassList: (a: string) => returnObj;
    againRequest: () => void;
    state: any;
  };
  againRequest: () => void;
  updateClassList: (a: string) => returnObj;
};

const ListPopupComLS: React.FC<any> = forwardRef((props, ref: any) => {
  return <ListPopupCom ref={ref} {...props} />;
});

const EditAppDetails: React.FC<any> = (props) => {
  const PopupComRef = useRef<VerifyRef>();
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const { id, onSave } = props;

  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [appInfo, setAppInfo] = useState<AppInfoType>();
  const [first, setfirst] = useState(true);
  const [appclassification, setAppclassification] = useState<any>([]);
  const [appcheckBox, setAppcheckBox] = useState<any>([]);
  // const [, setReturnCheckbox] = useState<any>([]); // 后台回显数据

  const handleNext = async () => {
    const fieldsValue = await form.validateFields();
    setSubmitting(true);
    if (id) {
      fieldsValue.client_id = id;
    }
    fieldsValue.enable_apply = first == undefined ? true : first;
    // 处理后台回显
    fieldsValue.custom_class = [...appcheckBox].concat(appInfo?.custom_class);

    await createOrUpdateAppBaseInfo(fieldsValue)
      .then((res) => {
        if (res.client_id) {
          saveClass(
            res.client_id,
            appcheckBox
              .concat(appInfo?.custom_class)
              .filter((item: any) => item != 'undefined' && item != null),
          ).then((rs: any) => {
            if (rs.data) {
              onSave(res.client_id);
              message.success('更新成功');
            }
          });
        } else {
          message.error(`更新失败，请重试`);
        }
      })
      .catch((error) => message.error(`服务器或网络错误，错误原因：${error}`))
      .finally(() => setSubmitting(false));
  };

  // 请求分类接口函数
  const requestClassApplication = () => {
    // 请求分类接口
    requestData().then((rs) => {
      setAppclassification(() => {
        const tempArr = [];
        tempArr.push({});
        return rs.data.concat(tempArr);
      });
    });
  };
  useEffect(() => {
    setAppInfo(props.appInfo);

    const newAppInfo: any = {};
    // 回显操作
    form.setFieldsValue(Object.assign({}, props.appInfo, newAppInfo));
    // 请求分类接口
    requestClassApplication();
    // 控制复选框返回列表回显
    if (props?.customClass) {
      if (props?.customClass.length != 0) {
        // setReturnCheckbox(props?.customClass);
        setAppcheckBox(props?.customClass);
      }
    }

    // 控制单选框回显
    if (String(props?.appInfo?.enable_apply)) {
      setfirst(props?.appInfo?.enable_apply);
    }
  }, [id]);
  const onSuccessRegenerate = (newValue: string) => {
    form.setFieldsValue({
      ...appInfo,
      client_secret: newValue,
    });
    setAppInfo({
      ...appInfo,
      client_secret: newValue,
    });
  };
  const validateRoleName = function (_rule: any, value: string, callback: any) {
    lengthRange(2, 50, _rule, value, callback);
  };
  // 复选框的事件
  const onChange = (checkedValues: any) => {
    setAppcheckBox(checkedValues);
  };
  // Radio框的事件
  const onChangeRadio = (val: any) => {
    setfirst(val.target.value);
  };

  //***************************************** 新建分类功能事件 *************************************************** */
  // 点击新建分类弹窗
  const hanldeAddCustApp = () => {
    setVisible(true);
  };
  // 模态框的确定事件
  const handleOk = () => {
    PopupComRef?.current?.againRequest();
    setConfirmLoading(true);
    setVisible(false);
    setConfirmLoading(false);
    setInputValue('');
    requestClassApplication();
  };
  // 模态框的取消事件
  const handleCancel = () => {
    PopupComRef?.current?.againRequest();
    setVisible(false);
    setInputValue('');
    requestClassApplication();
  };
  // 输入框的事件
  const handleChangeEvent = (e: any) => {
    setInputValue(e.target.value);
  };
  // 创建分组事件
  const createClassIfication = () => {
    if (inputValue) {
      PopupComRef?.current?.updateClassList(inputValue);
      requestClassApplication();
    } else {
      message.error('不能为空');
    }
  };
  const clearInput = () => {
    setInputValue('');
  };
  const returnJsxElement = (mapIs: any, mapInx: number) => {
    if (mapInx != appclassification.length - 1) {
      return (
        <Col span={8} style={{ marginBottom: '20px' }} key={mapInx}>
          <Checkbox value={mapIs.id}>{mapIs.category_name}</Checkbox>
        </Col>
      );
    } else {
      return (
        <Col span={8} key={mapInx}>
          <Paragraph
            style={{ cursor: 'pointer', marginBottom: 'unset' }}
            onClick={hanldeAddCustApp}
          >
            <AppstoreAddOutlined
              width={60}
              style={{ width: '20px', height: '40px', color: '#1890FF', fontWeight: '600' }}
            />
            <span style={{ marginBottom: 'unset', color: '#1890FF' }}>添加应用分类</span>
          </Paragraph>
        </Col>
      );
    }
  };
  const renderCheckBox = () => {
    return appclassification.map((mapIs: any, mapInx: number) => {
      return returnJsxElement(mapIs, mapInx);
    });
  };
  return (
    <>
      {
        <Card title="基本信息" style={{ marginBottom: '24px' }}>
          <Form
            form={form}
            {...formLayout}
            initialValues={{
              radiogroups: first,
            }}
          >
            <Row>
              <Col span={14}>
                <FormItem
                  label="应用名称"
                  name="client_name"
                  rules={[{ required: true }, { validator: validateRoleName }]}
                  shouldUpdate
                >
                  <Input minLength={2} placeholder="应用名称" />
                </FormItem>
                <FormItem label="应用简介" name="description" shouldUpdate>
                  <TextArea autoSize={{ minRows: 3, maxRows: 6 }} placeholder="请输入应用简介" />
                </FormItem>
                <FormItem
                  label="应用分类"
                  name="custom_class"
                  shouldUpdate
                  rules={[{ required: true, message: '请勾选应用分类' }]}
                >
                  <Checkbox.Group style={{ width: '100%' }} onChange={onChange}>
                    <Row style={{ marginTop: '5px' }}>{renderCheckBox()}</Row>
                  </Checkbox.Group>
                </FormItem>
                <FormItem label="是否允许自助申请" name="enable_apply" shouldUpdate>
                  <Radio.Group name="radiogroups" onChange={onChangeRadio}>
                    <Radio value={true} style={{ marginLeft: '10px' }}>
                      允许
                    </Radio>
                    <Radio value={false} style={{ marginLeft: '20px' }}>
                      不允许
                    </Radio>
                  </Radio.Group>
                </FormItem>

                <FormItem label="首页地址" name="client_uri" shouldUpdate>
                  <Input placeholder="https://..." />
                </FormItem>

                {appInfo?.client_id && appInfo.client_id && (
                  <FormItem label="Client ID" shouldUpdate>
                    {appInfo?.client_id && appInfo.client_id}
                  </FormItem>
                )}

                {(appInfo?.update_time && (
                  <FormItem label="更新时间" shouldUpdate>
                    {formatDateTime((appInfo?.update_time || 0) * 1000)}
                  </FormItem>
                )) ||
                  null}

                {appUtil.hasClientSecret(appInfo) && (
                  <ClientSecret
                    clientSecret={appInfo?.client_secret}
                    isEdit={true}
                    clientID={appInfo?.client_id}
                    mergeAppDetail={onSuccessRegenerate}
                  />
                )}
              </Col>
              <Col span={10}>
                <FormItem
                  label="应用图标（50k以下）"
                  name="logo_uri"
                  shouldUpdate
                  {...formLayoutPng}
                >
                  <ImageUploader maxSize={50} onChange={() => {}} />
                </FormItem>
              </Col>
            </Row>
            <FormItem wrapperCol={{ span: 6, offset: 3 }}>
              <Space>
                <Button
                  type="primary"
                  onClick={() => handleNext()}
                  disabled={submitting}
                  style={{ marginLeft: '25px' }}
                >
                  {submitting ? <LoadingOutlined /> : null} 下一步
                </Button>
              </Space>
            </FormItem>
          </Form>
        </Card>
      }
      <Modal
        title="编辑分类"
        open={visible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        width="750px"
        okText="确定"
      >
        <Form
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          autoComplete="off"
        >
          <Form.Item
            label="应用分组"
            name={'usename'}
            colon={false}
            rules={[{ required: true, message: 'Please input your username!' }]}
          ></Form.Item>
        </Form>
        <Row>
          <Col span={19}>
            <Input
              size="middle"
              placeholder="请填写分组名称"
              prefix={<UserOutlined />}
              value={inputValue}
              onChange={handleChangeEvent}
            />
          </Col>
          <Col span={1}></Col>
          <Col span={4}>
            <Button type="primary" onClick={createClassIfication}>
              创建分组
            </Button>
          </Col>
        </Row>
        <ListPopupComLS
          ref={PopupComRef}
          clearHandle={clearInput}
          againRequestClassList={requestClassApplication}
        />
      </Modal>
    </>
  );
};
export default EditAppDetails;
