import { forwardRef, useState, useEffect } from 'react';
import { Drawer, Input, Row, Col, Space, Button, message, Form, Select, DatePicker } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import _ from 'lodash';
import moment from 'moment';
import { saveFlowCanvas } from '../../common';
import { createCron } from './cron';
const { RangePicker } = DatePicker;

const StartTimeDrawer = (props: any) => {
  const [form] = Form.useForm();
  const flowData = _.get(props, 'flowData');
  const startObj = _.get(flowData, 'info.nodeData.config.start') || {};
  const nodeName = _.get(flowData, 'info.nodeData.config.start_name') || '定时触发';
  const { open } = props;
  const [isOrEdit, setIsOrEdit] = useState(true);

  const [titleString, setTitleString] = useState(nodeName);
  const [period, setPeriod] = useState(startObj.period || 'day');

  useEffect(() => {
    setTitleString(nodeName);
  }, [nodeName]);

  const editTitleHandle = () => {
    setIsOrEdit(false);
  };

  const modifyValue = (event: any) => {
    setTitleString(event.target.value);
  };
  const onBlur = (event: any) => {
    setIsOrEdit(true);
    setTitleString(event.target.value);
  };

  const TitleNodes = (
    <>
      {isOrEdit ? (
        <h4 style={{ marginTop: '8px', cursor: 'pointer' }} onClick={editTitleHandle}>
          {titleString}
          <EditOutlined />
        </h4>
      ) : (
        <Input value={titleString} onChange={modifyValue} onBlur={onBlur} />
      )}
    </>
  );
  const onSave = async () => {
    if (!titleString) {
      message.error('请输入定时触发名称');
      return;
    }
    const formData = await form.validateFields();
    const { range } = formData;
    if (!range[0] || !range[1]) {
      message.error('请选择生效日期');
      return;
    }

    saveFlowCanvas({
      preFlowData: flowData,
      fieldName: 'info.nodeData.config.start_name',
      newValue: titleString,
    });
    const cron = {
      start_date: moment(formData.range[0]).format('YYYY-MM-DD'),
      end_date: moment(formData.range[1]).format('YYYY-MM-DD'),
      cycle: createCron(formData),
    };
    saveFlowCanvas({
      preFlowData: flowData,
      fieldName: 'info.nodeData.config.cron',
      newValue: cron,
    });
    saveFlowCanvas({
      preFlowData: flowData,
      fieldName: 'info.nodeData.config.start',
      newValue: {
        ...formData,
        start_date: moment(formData.range[0]).format('YYYY-MM-DD'),
        end_date: moment(formData.range[1]).format('YYYY-MM-DD'),
      },
    });
    props.onClose();
  };
  const footerOpt = (
    <Row>
      <Col span={24} style={{ textAlign: 'right' }}>
        <Space>
          <Button onClick={props.onClose}>取消</Button>
          <Button type="primary" onClick={onSave}>
            保存
          </Button>
        </Space>
      </Col>
    </Row>
  );
  const onChangPeriod = (value: string) => {
    setPeriod(value);
  };
  // 得到24小时列表
  const getTimes = () => {
    let index = 0;
    const list = [];
    while (index <= 23) {
      list.push({
        label: index + ':00',
        value: index,
      });
      index += 1;
    }
    return list;
  };
  const getWeekDays = () => {
    const list = [
      {
        value: 2,
        label: '周一',
      },
      {
        value: 3,
        label: '周二',
      },
      {
        value: 4,
        label: '周三',
      },
      {
        value: 5,
        label: '周四',
      },
      {
        value: 6,
        label: '周五',
      },
      {
        value: 7,
        label: '周六',
      },
      {
        value: 1,
        label: '周日',
      },
    ];

    return list;
  };
  // 得到月的日期列表
  const getDaysInMonth = () => {
    let index = 1;
    const list = [];
    while (index <= 31) {
      list.push({
        label: index + '号',
        value: index,
      });
      index += 1;
    }
    list.push({
      value: '0',
      label: '当月最后一天',
    });
    return list;
  };
  const renderForm = () => {
    const dateFormat = 'YYYY-MM-DD';
    return (
      <Form form={form} labelCol={{ span: 8 }} wrapperCol={{ span: 14 }} layout="vertical">
        <Form.Item
          label="生效日期"
          name="range"
          rules={[{ required: true, message: '请选择生效日期' }]}
          initialValue={[
            (startObj.start_date && moment(startObj.start_date, dateFormat)) || null,
            (startObj.end_date && moment(startObj.end_date, dateFormat)) || null,
          ]}
        >
          <RangePicker />
        </Form.Item>
        <Form.Item
          label="触发周期"
          name="period"
          rules={[{ required: true, message: '请选择触发周期' }]}
          initialValue={startObj.period || 'day'}
        >
          <Select
            options={[
              {
                label: '每天',
                value: 'day',
              },
              {
                label: '每周',
                value: 'week',
              },
              {
                label: '每月',
                value: 'month',
              },
            ]}
            onChange={(value: string) => onChangPeriod(value)}
          />
        </Form.Item>
        {(period === 'week' && (
          <Form.Item
            label="每周的执行日期"
            name="dayInWeek"
            rules={[{ required: true, message: '请选择每周的执行日期' }]}
            initialValue={startObj.dayInWeek || [2]}
          >
            <Select options={getWeekDays()} mode="multiple" />
          </Form.Item>
        )) ||
          null}
        {(period === 'month' && (
          <Form.Item
            label="每月的执行日期"
            name="dayInMonth"
            rules={[{ required: true, message: '请选择每月的执行日期' }]}
            initialValue={startObj.dayInMonth || [1]}
          >
            <Select options={getDaysInMonth()} mode="multiple" />
          </Form.Item>
        )) ||
          null}
        <Form.Item
          label="执行时间"
          name="opTime"
          rules={[{ required: true, message: '请选择执行时间' }]}
          initialValue={startObj.opTime || [0]}
        >
          <Select options={getTimes()} mode="multiple" />
        </Form.Item>
      </Form>
    );
  };

  return (
    <>
      <Drawer
        title={TitleNodes}
        closable={false}
        placement="right"
        destroyOnClose
        onClose={props.onClose}
        open={open}
        width={600}
        footer={footerOpt}
      >
        {renderForm()}
      </Drawer>
    </>
  );
};
export default forwardRef(StartTimeDrawer);
