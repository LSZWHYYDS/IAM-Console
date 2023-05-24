import type { NsGraph } from '@antv/xflow';
import { useState, useEffect } from 'react';
import { Row, Col, Input, Button } from 'antd';
import _ from 'lodash';
import './nodeStartTime.css';
import { RightOutlined } from '@ant-design/icons';
import StartTimeDrawer from './startTimeDrawer';
import { saveFlowCanvas } from '../common';

const NodeStartTime: NsGraph.INodeRender = (props) => {
  const nodeData = _.get(props, 'data.info.nodeData') || {};
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(nodeData?.config?.start_name);
  const onOpen = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    setValue(nodeData?.config?.start_name);
  }, [props?.data?.info?.nodeData?.config?.start_name]);
  const onChangeName = (e: any) => {
    setValue(e.target.value);
    saveFlowCanvas({
      preFlowData: props.data,
      fieldName: 'info.nodeData.config.start_name',
      newValue: e.target.value,
    });
  };
  const onBlur = (e: any) => {
    const inputV = e.target.value || '定时触发';
    setValue(inputV);
    saveFlowCanvas({
      preFlowData: props.data,
      fieldName: 'info.nodeData.config.start_name',
      newValue: inputV,
    });
  };
  /**
   * 1. 节点的数据、位置信息通过props取 189 145 63
   * 2. 当节点被触发更新时, props返回的数据也会动态更新, 触发节点重新渲染
   */

  const getStartTitle = () => {
    const startObj = nodeData.config?.start;
    let title = '';
    if (startObj && startObj.period) {
      const options = [
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
      ];
      const label = _.find(options, {
        value: startObj.period,
      });
      title = (label && label.label) || '';
      // if (startObj.start_date && startObj.end_date) {
      //   title += '(' + startObj.start_date + '-' + startObj.end_date + ')';
      // }
    }
    return title;
  };
  return (
    <div className="node1-container">
      <div>
        <Input
          bordered={false}
          value={value}
          style={{ backgroundColor: '#BD913F', fontSize: 10, color: 'white' }}
          onChange={onChangeName}
          onBlur={onBlur}
        />
      </div>
      <Row>
        <Col span={20}>
          <Button type="link" style={{ wordWrap: 'break-word' }} onClick={onOpen}>
            {getStartTitle() || '请设置'}
          </Button>
        </Col>
        <Col span={2}>
          <RightOutlined style={{ marginTop: 10 }} />
        </Col>
      </Row>
      <StartTimeDrawer open={open} flowData={props.data} onClose={onClose} />
    </div>
  );
};
export default NodeStartTime;
