// /* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { useState, useEffect, useRef } from 'react';
import { Spin, Tabs, Form, Row, Col, Button, Input, Card, message } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import _ from 'lodash';
import { Root } from './root';
import { LowerVersion } from './lowerVersion';
import { getPolicy, savePolicy, createPolicy } from '../service';

const FormItem = Form.Item;
const { TabPane } = Tabs;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 },
};

const EditDevicePolicy: React.FC<any> = (props) => {
  const rootRef = useRef<any>(null);
  const lowerVersionRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [policyData, setPolicyData] = useState({
    content: {
      wrappingConf: {
        androidWrappConf: [],
        iosWrappConf: [],
        windowsWrappConf: [],
      },
    },
  });
  const androidWrappConf = _.get(policyData, 'content.wrappingConf.androidWrappConf', [{}, {}]);
  const iosWrappConf = _.get(policyData, 'content.wrappingConf.iosWrappConf', [{}, {}]);
  const [form] = Form.useForm();
  const { id, subCategory } = props.location.query;
  const loadData = async () => {
    setIsLoading(true);
    await getPolicy(id).then(async (res) => {
      setPolicyData(res.data);
      const { name } = res.data;
      form.setFieldsValue({ name });
      setIsLoading(false);
    });
  };
  const saveData = async (data: any) => {
    setIsLoading(true);
    if (id) {
      await savePolicy(id, data).then(async () => {
        message.success('保存成功。');
        setIsLoading(false);
        props.history.push('/policy/deviceAdmitPolicy');
      });
    } else {
      await createPolicy({
        ...data,
        subCategory,
        category: 'CONFIG',
        createBy: sessionStorage.getItem('loginId') || 'admin',
      }).then(async () => {
        message.success('保存成功。');
        setIsLoading(false);
        props.history.push('/policy/deviceAdmitPolicy');
      });
    }
  };

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, []);
  const onCancel = () => {
    props.history.push('/policy/deviceAdmitPolicy');
  };
  const onSubmit = () => {
    form.validateFields().then(() => {
      const rootData = rootRef.current && rootRef.current.getValues();
      if (rootData.check && (!rootData.handle || !rootData.handle.length)) {
        message.error('请选择设备ROOT/越狱的违规处置。');
        return;
      }
      const lowerVersionData = (lowerVersionRef.current && lowerVersionRef.current.getValues()) || {
        androidWrappConf: androidWrappConf[1],
        iosWrappConf: iosWrappConf[1],
      };
      if (
        lowerVersionData.androidWrappConf &&
        lowerVersionData.androidWrappConf.check &&
        (!lowerVersionData.androidWrappConf.handle ||
          !lowerVersionData.androidWrappConf.handle.length)
      ) {
        message.error('请选择系统版本过低的违规处置。');
        return;
      }
      const formData = form.getFieldsValue();
      formData.content = {
        wrappingConf: {
          androidWrappConf: [
            {
              ...rootData,
              threatName: 'root',
            },
            {
              ...lowerVersionData.androidWrappConf,
            },
          ],
          iosWrappConf: [
            {
              ...rootData.check,
              threatName: 'root',
            },
            {
              ...lowerVersionData.iosWrappConf,
            },
          ],
        },
      };
      saveData(formData);
    });
  };
  const render = () => {
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
          <Card className="pd-lr-20">
            <Row>
              <Col span="12">
                <Form form={form} className="formPadding policyForm" layout="horizontal">
                  <FormItem
                    {...formItemLayout}
                    label="设备准入策略名称"
                    name="name"
                    rules={[{ required: true }]}
                  >
                    <Input maxLength={50} placeholder="请输入设备准入策略名称" />
                  </FormItem>
                </Form>
              </Col>
            </Row>
            <Tabs defaultActiveKey="android">
              <TabPane tab="设备ROOT/越狱" key="root">
                <Root ref={rootRef} data={androidWrappConf[0]} />
              </TabPane>
              <TabPane tab="系统版本过低" key="lowerVersion">
                <LowerVersion
                  ref={lowerVersionRef}
                  androidWrappConf={androidWrappConf[1]}
                  iosWrappConf={iosWrappConf[1]}
                />
              </TabPane>
            </Tabs>
            <Row className="footerContainer">
              <Col offset={4} span={4}>
                <Button type="ghost" onClick={onCancel}>
                  取消
                </Button>
              </Col>
              <Col span={4}>
                <Button type="primary" className="ml-10" onClick={onSubmit}>
                  保存
                </Button>
              </Col>
            </Row>
          </Card>
        </PageContainer>
      </Spin>
    );
  };
  return render();
};
export default EditDevicePolicy;
