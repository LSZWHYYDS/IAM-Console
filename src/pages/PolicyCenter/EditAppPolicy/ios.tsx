import { useEffect, forwardRef, useImperativeHandle } from 'react';
import { Form, Row, Col, Checkbox, Card } from 'antd';

const FormItem = Form.Item;

export const IOS = forwardRef((props: { iosWrappConf: any }, ref) => {
  const [form] = Form.useForm();
  const { iosWrappConf = {} } = props;
  useEffect(() => {
    // todo
    if (iosWrappConf['noRecordScreen']) {
      iosWrappConf['noRecordScreen'] = 0;
    } else {
      iosWrappConf['noRecordScreen'] = 1;
    }
    form.setFieldsValue(iosWrappConf);
  });
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
        initialValues={iosWrappConf}
      >
        <Card title="数据防泄漏">
          <Row>
            <Col span="4">
              <FormItem name="screenCaptureStatistics" valuePropName="checked">
                <Checkbox>截屏审计</Checkbox>
              </FormItem>
            </Col>
            <Col span="4">
              <FormItem name="openIn" valuePropName="checked">
                <Checkbox>禁止文件向外分享</Checkbox>
              </FormItem>
            </Col>
            <Col span="4">
              <FormItem name="enableCallPrint" valuePropName="checked">
                <Checkbox>禁止调用打印功能</Checkbox>
              </FormItem>
            </Col>
            <Col span="5">
              <FormItem name="past" valuePropName="checked">
                <Checkbox>仅可在安全应用内复制粘贴</Checkbox>
              </FormItem>
            </Col>
            <Col span="4">
              <FormItem name="noRecordScreen" valuePropName="checked">
                <Checkbox>禁止录屏</Checkbox>
              </FormItem>
            </Col>
            {/* 临时加 */}
            <Col span="4">
              <FormItem name="screenShot" valuePropName="checked">
                <Checkbox>禁止截屏提示</Checkbox>
              </FormItem>
            </Col>
          </Row>
        </Card>
      </Form>
    );
  };
  return render();
});
