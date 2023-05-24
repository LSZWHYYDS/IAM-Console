import { Button, Checkbox, Col, Form, Input, Radio, Row } from 'antd';
import Control from './controls';
import { AppstoreAddOutlined, DoubleRightOutlined } from '@ant-design/icons';
import { formatDateTime } from '@/utils/common.utils';
import { connect } from 'umi';
import EditClassModel from './components/editClassModel';
import ClientSecret from '../authorScope/component/components/ClientSecret';
import { forwardRef, useImperativeHandle } from 'react';
/**
 * 渲染分类列表
 */
const RenderingClassificationGroup = (props: any) => {
  return props.appclassification.map((mapIs: any, mapInx: number) => {
    return (
      <Checkbox
        value={mapIs.id}
        key={mapInx}
        style={{ marginRight: '60px', marginBottom: '10px', marginLeft: 'unset', width: '100px' }}
      >
        {mapIs.category_name}
      </Checkbox>
    );
  });
};
const mapStateToProps = (state) => {
  return {
    siblingRef$: state.component_configs.siblingRef$,
  };
};
const BaseInfo = (props, ref: any) => {
  const [form] = Form.useForm();
  const handleStepsChange = props.handleStepsChange;
  const {
    state,
    hanldeAddCustApp,
    editAddPopupRef,
    requestClassApplication,
    onSuccessRegenerate,
    onFormSubmit,
  } = Control({
    form,
    dispatch: props.dispatch,
    handleStepsChange,
  });

  /**
   * @param { appclassification } 渲染分类数组
   * @param { appBaseInfoData }   后台返回该应用的一些基本信息
   */
  const {
    appclassification,
    appBaseInfoData: { client_id, update_time },
  } = state;

  useImperativeHandle(ref, () => ({
    onFormSubmit,
  }));

  return (
    <>
      <Form name="basicInfo" autoComplete="off" form={form}>
        <Form.Item
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 6 }}
          labelAlign="right"
          label="自定义应用名称"
          name="username"
          rules={[{ required: true, message: '请输入你的应用名称参数' }]}
        >
          <Input placeholder="请输入你的应用名称参数" />
        </Form.Item>

        <Form.Item
          label="应用分类"
          name="custom_class"
          shouldUpdate
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 8 }}
        >
          <Checkbox.Group style={{ width: '100%' }}>
            <Row style={{ marginTop: 5 }}>
              <RenderingClassificationGroup appclassification={appclassification} />
              <div onClick={hanldeAddCustApp} style={{ cursor: 'pointer' }}>
                <AppstoreAddOutlined width={100} />
                <span style={{ marginBottom: 'unset' }}>添加应用分类</span>
              </div>
            </Row>
          </Checkbox.Group>
        </Form.Item>

        <Form.Item
          label="是否允许自助申请"
          name="enable_apply"
          shouldUpdate
          rules={[{ required: true }]}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 6 }}
        >
          <Radio.Group>
            <Radio value={true} style={{ marginRight: '100px' }}>
              允许
            </Radio>
            <Radio value={false}>不允许</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="首页地址"
          name="client_uri"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
        >
          <Input style={{ width: '50%' }} />
        </Form.Item>

        <Form.Item label="Client ID" shouldUpdate labelCol={{ span: 8 }} wrapperCol={{ span: 10 }}>
          {client_id}
        </Form.Item>

        <Form.Item label="更新时间" shouldUpdate labelCol={{ span: 8 }} wrapperCol={{ span: 10 }}>
          {formatDateTime((update_time || 0) * 1000)}
        </Form.Item>
        <Form.Item colon={false} label=" " labelCol={{ span: 5 }} wrapperCol={{ span: 16 }}>
          <ClientSecret
            clientSecret={state?.client_secret}
            isEdit={true}
            clientID={client_id}
            mergeAppDetail={onSuccessRegenerate}
          />
        </Form.Item>
      </Form>
      <Row justify={'end'}>
        <Col flex={'200px'}>
          <Button
            type="primary"
            icon={<DoubleRightOutlined />}
            style={{ marginBottom: 20, marginRight: 260 }}
            onClick={onFormSubmit}
          >
            下一步
          </Button>
        </Col>
      </Row>
      <EditClassModel ref={editAddPopupRef} againRequestClass={requestClassApplication} />
    </>
  );
};

export default connect(mapStateToProps, null, null, { forwardRef: true })(forwardRef(BaseInfo));
