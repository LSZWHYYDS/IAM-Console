// import PicturesWall from '@/components/ImageUploader';
import { Button, Col, Drawer, Form, Input, message, Row, Select } from 'antd';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { editAppInfo } from '../../service';
import { useIntl, FormattedMessage } from 'umi';
import UploadApp from './UploadApp';
const WindowsDrawer = (props: any, ref: any) => {
  const [open, setOpen] = useState(false);
  // const [fileId, setFileId] = useState<string>('');
  const [form] = Form.useForm();
  const intl = useIntl();

  const showDrawer = () => {
    form.resetFields();
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  useImperativeHandle(ref, () => ({
    showDrawer,
    onClose,
  }));

  const onFinish = () => {
    form.validateFields().then((values) => {
      const dataValues = {
        ...values,
        platform: props.platform,
        pkgName: values?.appName,
        fileId: sessionStorage.getItem('fileId'),
      };
      editAppInfo(dataValues)
        .then((res) => {
          if (!res.data) {
            message.error(intl.formatMessage({ id: 'global.errTips' }));
            onClose();
            return;
          }
          props.reloadTable();
          props?.reloadSonTable();
          onClose();
        })
        .catch(() => {
          message.error(intl.formatMessage({ id: 'global.errTips' }));
        });
    });
  };

  return (
    <>
      <Drawer
        title="创建"
        width={'600px'}
        placement="right"
        onClose={onClose}
        destroyOnClose={true}
        open={open}
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={() => onClose()} style={{ marginRight: '30px' }}>
              取消
            </Button>
            <Button type="primary" onClick={onFinish}>
              保存
            </Button>
          </div>
        }
      >
        <Row>
          <Col span={24}>
            <Form
              name="forms"
              form={form}
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 18 }}
              initialValues={{ remember: true }}
              onFinish={onFinish}
              autoComplete="off"
            >
              <Form.Item
                label="应用图标"
                name="picture"
                shouldUpdate
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage id="EnterpriseAppDistribution.inputTips.pleaseUpload" />
                    ),
                  },
                ]}
              >
                <UploadApp
                  platformName="WINDOWS"
                  onFinished={(id: any) => {
                    sessionStorage.setItem('fileId', id);
                  }}
                ></UploadApp>
              </Form.Item>

              <Form.Item
                label={intl.formatMessage({ id: 'EnterpriseAppDistribution.inputTips.username' })}
                name="appName"
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage id="EnterpriseAppDistribution.inputTips.pleaseUsername" />
                    ),
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label={intl.formatMessage({
                  id: 'EnterpriseAppDistribution.inputTips.applicationVersion',
                })}
                name="version"
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage id="EnterpriseAppDistribution.inputTips.pleaseApplicationVersion" />
                    ),
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label={intl.formatMessage({
                  id: 'EnterpriseAppDistribution.inputTips.downloadAddress',
                })}
                name="downloadUrl"
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage id="EnterpriseAppDistribution.inputTips.pleaseDownloadAddress" />
                    ),
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label={intl.formatMessage({
                  id: 'EnterpriseAppDistribution.inputTips.systemRequirements',
                })}
                name="osVersion"
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage id="EnterpriseAppDistribution.inputTips.pleaseSystemRequirements" />
                    ),
                  },
                ]}
              >
                <Select
                  showSearch
                  placeholder={
                    <FormattedMessage id="EnterpriseAppDistribution.inputTips.pleaseSystemRequirements" />
                  }
                  options={
                    props.platform == 'WINDOWS'
                      ? [
                          {
                            value: '7.0',
                            label: '7.0',
                          },
                          {
                            value: '8.0',
                            label: '8.0',
                          },
                          {
                            value: '9.0',
                            label: '9.0',
                          },
                          {
                            value: '10.0',
                            label: '10.0',
                          },
                          {
                            value: '11.0',
                            label: '11.0',
                          },
                        ]
                      : [
                          {
                            value: '9.0',
                            label: '9.0',
                          },
                          {
                            value: '10.0',
                            label: '10.0',
                          },
                          {
                            value: '11.0',
                            label: '11.0',
                          },
                          {
                            value: '12.0',
                            label: '12.0',
                          },
                        ]
                  }
                />
              </Form.Item>

              <Form.Item
                label={intl.formatMessage({ id: 'EnterpriseAppDistribution.inputTips.developer' })}
                name="company"
                rules={[
                  {
                    message: (
                      <FormattedMessage id="EnterpriseAppDistribution.inputTips.pleaseDevelopers" />
                    ),
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label={intl.formatMessage({
                  id: 'EnterpriseAppDistribution.inputTips.introduction',
                })}
                name="comment"
                rules={[
                  {
                    message: (
                      <FormattedMessage id="EnterpriseAppDistribution.inputTips.pleaseIntroduction" />
                    ),
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Drawer>
    </>
  );
};

export default forwardRef(WindowsDrawer);
