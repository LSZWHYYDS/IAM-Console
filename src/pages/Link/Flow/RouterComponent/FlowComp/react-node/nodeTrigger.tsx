import type { NsGraph } from '@antv/xflow';
import { useState, useEffect } from 'react';
import { Row, Col, Input, Button } from 'antd';
import _ from 'lodash';
import './nodeTrigger.css';
import { RightOutlined } from '@ant-design/icons';
import TriggerDrawer from './triggerDrawer';
import { saveFlowCanvas } from '../common';

const NodeTrigger: NsGraph.INodeRender = (props) => {
  const nodeData = _.get(props, 'data.info.nodeData') || {};
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(nodeData?.config?.start_name || '请选择触发事件');
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
  /**
   * 1. 节点的数据、位置信息通过props取
   * 2. 当节点被触发更新时, props返回的数据也会动态更新, 触发节点重新渲染
   */

  return (
    <div className="node-trigger-container">
      <div>
        <Input
          bordered={false}
          value={value}
          style={{ backgroundColor: '#58c065', fontSize: 14, color: '#fff' }}
          onChange={onChangeName}
        />
      </div>
      <Row>
        <Col span={20}>
          <Button type="link" onClick={onOpen}>
            {nodeData.config?.start?.trigger_name || '请设置'}
          </Button>
        </Col>
        <Col span={2}>
          <RightOutlined style={{ marginTop: 10 }} />
        </Col>
      </Row>
      <TriggerDrawer open={open} flowData={props.data} onClose={onClose} />
    </div>
  );
};
export default NodeTrigger;
