import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Col, Form, Input, message, Row, Spin, Tabs } from 'antd';
import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { createPolicy, getPolicy, savePolicy } from '../service';
import { Android } from './android';
import { IOS } from './ios';

const FormItem = Form.Item;
const { TabPane } = Tabs;
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 12 },
};

const EditAppPolicy: React.FC<any> = (props) => {
  const andiosroidRef = useRef<any>(null);
  const iosRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [policyData, setPolicyData] = useState({
    content: {
      wrappingConf: {},
    },
  });
  const [form] = Form.useForm();
  const { id, subCategory } = props.location.query;
  const fieldsReverse_android = ['dataIsolation', 'screenShot', 'openIn', 'enableCallPrint'];
  //check: 1
  const otherFields_android = ['screenCaptureStatistics'];
  const otherFields_ios = ['screenCaptureStatistics'];
  const fieldsReverse_ios = ['enableCallPrint', 'openIn', 'noRecordScreen'];
  const loadData = async () => {
    setIsLoading(true);
    await getPolicy(id).then(async (res) => {
      setPolicyData(res.data);
      form.setFieldsValue(res.data);
      setIsLoading(false);
    });
  };
  const saveData = async (data: any) => {
    setIsLoading(true);
    if (id) {
      await savePolicy(id, data).then(async () => {
        message.success('保存成功。');
        setIsLoading(false);
        props.history.push('/policy/appPolicy');
      });
    } else {
      await createPolicy({
        ...data,
        subCategory,
        category: 'CONFIG',
        createBy: sessionStorage.getItem('loginId') || 'admin',
      }).then(async (data1: any) => {
        if (data1.code === '0') {
          message.success('保存成功。');
          props.history.push('/policy/appPolicy');
        } else {
          message.error('操作失败：' + data1.message + '。');
        }
        setIsLoading(false);
      });
    }
  };

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, []);
  const beforeFormValue = (androidWrappConf: any, iosWrappConf: any) => {
    const copyData1 = { ...androidWrappConf };
    // 需要求反的字段，api: 返回为0时 check
    fieldsReverse_android.forEach((field) => {
      copyData1[field] = 1 - copyData1[field];
    });
    // 仅可在安全应用内复制粘贴 check:0  unchecked: 2
    copyData1.past = androidWrappConf.past === 0 ? true : false;

    const copyData2 = { ...iosWrappConf };
    // 需要求反的字段，就是 check 为0
    fieldsReverse_ios.forEach((field) => {
      copyData2[field] = 1 - copyData2[field];
    });
    // 仅可在安全应用内复制粘贴 check:0  unchecked: 2
    copyData2.past = (iosWrappConf.past === 0 && 1) || 0;
    return {
      androidWrappConf: copyData1,
      iosWrappConf: copyData2,
    };
  };

  const getWatermaker = () => {
    return {
      targetPages: [
        {
          name: 'contactList',
          value: '1',
        },
        {
          name: 'contactDetail',
          value: '1',
        },
        {
          name: 'chat',
          value: '1',
        },
        {
          name: 'docPreview',
          value: '1',
        },
        {
          name: 'h5Page',
          value: '1',
        },
        {
          name: 'meetingDetail',
          value: '1',
        },
      ],
      watermarkShowDensity: 0,
      fontDiaphaneity: '90',
      contentCustom: '',
      fontSize: 0,
      fontStyle: 0,
      contentType: [1, 2],
      watermarkStatus: 1,
      fontColor: 1,
    };
  };
  // 保存前转换
  const beforeSaveValue = (androidWrappConf: any, iosWrappConf: any) => {
    let copyData1: any;
    let copyData2: any;
    if (androidWrappConf) {
      copyData1 = { ...androidWrappConf };
      // 需要求反的字段，api: 返回为0时 check
      fieldsReverse_android.forEach((field) => {
        copyData1[field] = 1 - (copyData1[field] || 0);
      });
      // 仅可在安全应用内复制粘贴 check:0  unchecked: 2
      copyData1.past = androidWrappConf.past ? 0 : 2;
      otherFields_android.forEach((field) => {
        if (copyData1.hasOwnProperty(field)) {
          copyData1[field] = (copyData1[field] && 1) || 0;
        }
      });
      copyData1.bluetooth = 1;
      copyData1.camera = 1;
      // todo 0勾选  1未勾选
      if (copyData1?.microphone) {
        copyData1.microphone = 0;
      } else {
        copyData1.microphone = 1;
      }
    }
    if (iosWrappConf) {
      copyData2 = { ...iosWrappConf };
      // 需要求反的字段，就是 check 为0
      fieldsReverse_ios.forEach((field) => {
        copyData2[field] = 1 - (copyData2[field] || 0);
      });
      // 仅可在安全应用内复制粘贴 check:0  unchecked: 1
      copyData2.past = iosWrappConf.past ? 0 : 1;
      otherFields_ios.forEach((field) => {
        if (copyData2.hasOwnProperty(field)) {
          copyData2[field] = (copyData2[field] && 1) || 0;
        }
      });
      // todo
      if (copyData2['noRecordScreen']) {
        copyData2['noRecordScreen'] = 0;
      } else {
        copyData2['noRecordScreen'] = 1;
      }

      // todo 新增截屏提示  勾选1  0不勾选
      if (copyData2?.screenShot) {
        copyData2.screenShot = 1;
      } else {
        copyData2.screenShot = 0;
      }
    }
    const data = {
      androidWrappConf: copyData1,
      iosWrappConf: copyData2,
    };
    data.androidWrappConf.watermark = getWatermaker();
    if (!copyData2) {
      delete data.iosWrappConf;
    } else {
      data.iosWrappConf.watermark = getWatermaker();
    }
    return data;
  };
  const onCancel = () => {
    props.history.push('/policy/appPolicy');
  };
  const onSubmit = () => {
    const other = beforeSaveValue(
      (andiosroidRef.current && andiosroidRef.current.getValues()) || null,
      (iosRef.current && iosRef.current.getValues()) || null,
    );
    let formData = _.cloneDeep(policyData);
    formData = { ...formData, ...form.getFieldsValue() };
    formData.content = {
      wrappingConf: { ...formData.content.wrappingConf, ...other },
      name: formData.name,
      description: formData.description,
      type: formData.subCategory || subCategory,
    };
    saveData(formData);
  };
  const render = () => {
    const androidWrappConf = _.get(policyData, 'content.wrappingConf.androidWrappConf', {});
    const iosWrappConf = _.get(policyData, 'content.wrappingConf.iosWrappConf', {});
    const copyData = beforeFormValue(androidWrappConf, iosWrappConf);
    return (
      <Spin
        spinning={isLoading}
        style={{
          position: 'fixed',
          left: '55%',
          top: '48%',
          height: 0,
          width: 0,
        }}
      >
        <PageContainer title={false}>
          <Card className="pd-lr-20" title="基本信息">
            <Form
              form={form}
              className="formPadding policyForm"
              layout="horizontal"
              initialValues={policyData}
              onFinish={onSubmit}
            >
              <Row>
                <Col span="12">
                  <FormItem
                    {...formItemLayout}
                    label="策略名称"
                    name="name"
                    rules={[{ required: true }]}
                  >
                    <Input maxLength={50} placeholder="请输入策略名称" />
                  </FormItem>
                </Col>
              </Row>
              <Tabs defaultActiveKey="android">
                <TabPane tab="Android" key="android">
                  <Android ref={andiosroidRef} androidWrappConf={copyData.androidWrappConf} />
                </TabPane>
                <TabPane tab="iOS" key="ios">
                  <IOS ref={iosRef} iosWrappConf={copyData.iosWrappConf} />
                </TabPane>
              </Tabs>
              <Row className="footerContainer">
                <Col offset={4} span={4}>
                  <Button type="ghost" onClick={onCancel}>
                    取消
                  </Button>
                </Col>
                <Col span={4}>
                  <Button type="primary" className="ml-10" htmlType="submit">
                    保存
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card>
        </PageContainer>
      </Spin>
    );
  };
  return render();
};
export default EditAppPolicy;
