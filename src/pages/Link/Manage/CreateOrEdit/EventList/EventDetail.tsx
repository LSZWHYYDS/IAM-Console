import { PageContainer } from '@ant-design/pro-layout';
import { showErrorMessage, showSuccessMessage } from '@/utils/common.utils';
import { Button, Col, Form, Input, Row, Collapse } from 'antd';
import React, { useEffect, useState, useRef } from 'react';
import { history } from 'umi';
import _ from 'lodash';
import { addTrigger, editTrigger, getTrigger } from '@/pages/Link/Manage/service';
import EventDetailParam from '@/pages/Link/Manage/Components/EventDetailParam';

const FormItem = Form.Item,
  Panel = Collapse.Panel;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 },
};

const EventDetail: React.FC = (props: any) => {
  const { location } = props;
  const { query } = location;
  const { triggerId, linkId } = query;
  const [formBasic] = Form.useForm();
  const refInBody = useRef();
  const [data, setData] = useState<any>({});

  const loadData = () => {
    if (triggerId) {
      getTrigger(triggerId).then((resp: any) => {
        const obj = resp.data;
        setData(obj);
        formBasic.setFieldsValue(obj);
      });
    }
  };
  useEffect(() => {
    loadData();
  }, []);
  const getFormData = async (callback: any) => {
    const basicData = await formBasic.validateFields();
    if (typeof callback === 'function') {
      callback({ ...basicData, api_link_id: linkId, status: 1 });
    }
  };
  const onSubmit = () => {
    getFormData((formObj: any) => {
      const dataObj = { ...formObj };
      const body_schema = refInBody && refInBody.current && refInBody.current.getData();
      if (typeof body_schema === 'boolean') {
        showErrorMessage('请先填写参数名称。');
        return;
      }
      _.set(dataObj, 'config.body_schema', body_schema);
      let p;
      if (!triggerId) {
        p = addTrigger(dataObj);
      } else {
        p = editTrigger(triggerId, dataObj);
      }
      p.then(() => {
        showSuccessMessage();
        history.goBack();
      }).catch((error) => {
        showErrorMessage(error);
      });
    });
  };
  const onCancel = () => {
    history.goBack();
  };

  const renderBasicForm = () => {
    return (
      <Panel header="基本内容" key="base">
        <Form form={formBasic}>
          <Row>
            <Col span="24">
              <FormItem
                name="name"
                label="触发事件名称"
                rules={[{ required: true, message: '请输入' }]}
                {...formItemLayout}
              >
                <Input type="text" />
              </FormItem>
            </Col>
            <Col span="24">
              <FormItem name="description" label="描述" {...formItemLayout}>
                <Input.TextArea />
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Panel>
    );
  };
  const renderModelForm = () => {
    const body_schemaIn = _.get(data, 'config.body_schema');
    return (
      <Panel header="模型参数" key="modelPnlIn">
        <EventDetailParam
          list={(body_schemaIn && [body_schemaIn]) || []}
          ref={refInBody}
          // parentId={data.id}
        />
      </Panel>
    );
  };
  const render = () => {
    return (
      <PageContainer title={false}>
        <div id="content" className="content">
          <Collapse defaultActiveKey={['base', 'modelPnlIn']} bordered={false}>
            {renderBasicForm()}
            {renderModelForm()}
          </Collapse>
          <div className="footerContainer">
            <Button type="ghost" className="ml-10" onClick={onCancel}>
              取消
            </Button>
            <Button type="primary" className="ml-10" onClick={() => onSubmit()}>
              保存
            </Button>
          </div>
        </div>
      </PageContainer>
    );
  };
  return render();
};

export default EventDetail;
