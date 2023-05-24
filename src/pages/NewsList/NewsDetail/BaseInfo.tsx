import React, { useEffect, Fragment } from 'react';
import { Form, Row, Col, Input } from 'antd';
import { t } from '@/utils/common.utils';

const FormItem = Form.Item,
  { TextArea } = Input;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 },
};

const BaseInfo: React.FC<any> = (props) => {
  const [form] = Form.useForm();
  useEffect(() => {
    const { info } = props;
    form.setFieldsValue(info);
  }, [props.info]);
  const render = () => {
    const {
      sendTime,
      status,
      bizType,
      bizTypeName,
      type,
      text,
      title,
      url,
      mediaTitle,
      thirdMediaId,
    } = props.info;
    const { nType } = props;
    const toDoDiv = bizType === 1 && (
      <Fragment>
        <Col span="12">
          <FormItem name="title" label="待办标题" {...formItemLayout} initialValue={sendTime || ''}>
            <Input type="text" readOnly />
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem name="description" label="待办描述" {...formItemLayout}>
            <Input type="text" readOnly />
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem name="sendTime" label="创建时间" {...formItemLayout}>
            <Input type="text" readOnly />
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem name="endTime" label="截至时间" {...formItemLayout}>
            <Input type="text" readOnly />
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem name="sender" label="发起人" {...formItemLayout}>
            <Input type="text" readOnly />
          </FormItem>
        </Col>
      </Fragment>
    );
    return (
      <Form form={form} className="formPadding" layout="horizontal">
        <Row>
          {toDoDiv}
          {bizType !== 1 && (
            <Col span="12">
              <FormItem
                name="sendTime"
                label={t('news.sendTime')}
                {...formItemLayout}
                initialValue={sendTime || ''}
              >
                <Input type="text" placeholder={t('news.sendTime')} readOnly />
              </FormItem>
            </Col>
          )}
          <Col span="12">
            <FormItem
              name="status"
              label={t('news.sendStatus')}
              {...formItemLayout}
              initialValue={status || ''}
            >
              <Input type="text" placeholder={t('news.sendStatus')} readOnly />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem
              name="bizTypeName"
              label={t('news.noticeType')}
              {...formItemLayout}
              initialValue={bizTypeName || ''}
            >
              <Input type="text" placeholder={t('news.noticeType')} readOnly />
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem
              name="type"
              label={t('news.newsType')}
              {...formItemLayout}
              initialValue={type || ''}
            >
              <Input type="text" placeholder={t('news.newsType')} readOnly />
            </FormItem>
          </Col>
        </Row>
        {nType === 0 && (
          <Row>
            <Col span="12">
              <FormItem
                name="text"
                label={t('news.newsContent')}
                {...formItemLayout}
                initialValue={text || ''}
              >
                <TextArea rows={4} maxLength={100} placeholder={t('news.newsContent')} readOnly />
              </FormItem>
            </Col>
          </Row>
        )}
        {nType === 1 && (
          <Row>
            <Col span="12">
              <FormItem
                name="linkUrl"
                label={t('news.linkUrl')}
                {...formItemLayout}
                initialValue={url || ''}
              >
                <Input type="text" placeholder={t('news.linkUrl')} readOnly />
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem
                name="link_picName"
                label={t('news.picName')}
                {...formItemLayout}
                initialValue={mediaTitle || ''}
              >
                <Input type="text" placeholder={t('news.picName')} readOnly />
              </FormItem>
            </Col>
          </Row>
        )}
        {nType === 1 && (
          <Row>
            <Col span="12">
              <FormItem
                name="linkTitle"
                label={t('news.linkTitle')}
                {...formItemLayout}
                initialValue={title || ''}
              >
                <TextArea rows={4} maxLength={100} placeholder={t('news.linkTitle')} readOnly />
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem
                name="linkDesc"
                label={t('news.linkDesc')}
                {...formItemLayout}
                initialValue={text || ''}
              >
                <TextArea rows={4} maxLength={500} placeholder={t('news.linkDesc')} readOnly />
              </FormItem>
            </Col>
          </Row>
        )}
        {nType === 2 && (
          <Row>
            <Col span="12">
              <FormItem
                name="picName"
                label={t('news.picName')}
                {...formItemLayout}
                initialValue={mediaTitle || ''}
              >
                <Input type="text" placeholder={t('news.picName')} readOnly />
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem
                name="fileID"
                label={t('news.fileID')}
                {...formItemLayout}
                initialValue={thirdMediaId || ''}
              >
                <Input type="text" placeholder={t('news.fileID')} readOnly />
              </FormItem>
            </Col>
          </Row>
        )}
      </Form>
    );
  };
  return render();
};

export default BaseInfo;
