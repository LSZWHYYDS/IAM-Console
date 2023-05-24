import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Form, Row, Col, Checkbox, Card } from 'antd';

const FormItem = Form.Item;

export const Android = forwardRef((props: { androidWrappConf: any }, ref) => {
  const [isDataIsolation, setIsDataIsolation] = useState(false);
  const [form] = Form.useForm();
  const { androidWrappConf = {} } = props;
  const [formData, setFormData] = useState(androidWrappConf);

  const changeDataIsolation = (e: any) => {
    setIsDataIsolation(e.target.checked);
    const newObj = { ...formData, dataIsolation: e.target.checked };
    if (e.target.checked) {
      newObj.openIn = true;
    }
    form.setFieldsValue(newObj);
  };
  useEffect(() => {
    // todo
    if (isNaN(androidWrappConf.dataIsolation)) {
      // 是NaN  则不做处理
    } else {
      if (!androidWrappConf?.microphone && androidWrappConf?.microphone != undefined) {
        // 为0则重新设置为true
        androidWrappConf.microphone = true;
      } else {
        androidWrappConf.microphone = false;
      }
    }
    form.setFieldsValue(androidWrappConf);
    setFormData(androidWrappConf);
    changeDataIsolation({
      target: {
        checked: androidWrappConf.dataIsolation,
      },
    });
  }, [androidWrappConf]);
  useImperativeHandle(ref, () => ({
    getValues: () => {
      return form.getFieldsValue();
    },
  }));
  const render = () => {
    return (
      <Form
        form={form}
        className="formPadding policyForm"
        layout="horizontal"
        initialValues={androidWrappConf}
        onChange={(values) => {
          setFormData(values);
        }}
      >
        <Card title="数据防泄漏">
          <Row>
            <Col span={5}>
              <FormItem name="screenCaptureStatistics" valuePropName="checked">
                <Checkbox>截屏审计</Checkbox>
              </FormItem>
            </Col>
            <Col span={5}>
              <FormItem name="screenShot" valuePropName="checked">
                <Checkbox>禁止截屏</Checkbox>
              </FormItem>
            </Col>
            <Col span={5}>
              <FormItem name="dataIsolation" valuePropName="checked">
                <Checkbox onChange={changeDataIsolation}>
                  应用数据隔离
                  {/* <MsgTip msg='开启数据隔离后，数据将被永久保护' /> */}
                </Checkbox>
              </FormItem>
            </Col>
            <Col span={5}>
              <FormItem name="openIn" valuePropName="checked">
                <Checkbox disabled={isDataIsolation}>禁止文件向外分享</Checkbox>
              </FormItem>
            </Col>
            <Col span={5}>
              <FormItem name="enableCallPrint" valuePropName="checked">
                <Checkbox>禁止调用打印功能</Checkbox>
              </FormItem>
            </Col>
            <Col span={5}>
              <FormItem name="past" valuePropName="checked">
                <Checkbox>仅可在安全应用内复制粘贴</Checkbox>
              </FormItem>
            </Col>

            {/* 临时加 */}
            <Col span={5}>
              <FormItem name="microphone" valuePropName="checked">
                <Checkbox>禁止录音</Checkbox>
              </FormItem>
            </Col>
          </Row>
        </Card>
      </Form>
    );
  };
  return render();
});
