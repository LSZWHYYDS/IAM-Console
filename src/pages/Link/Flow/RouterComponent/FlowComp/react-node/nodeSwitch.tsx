import type { NsGraph } from '@antv/xflow';
import { useState, useEffect } from 'react';
import { Row, Col, Input, Button } from 'antd';
import _ from 'lodash';
import './nodeSwitch.less';
import { RightOutlined, CloseOutlined } from '@ant-design/icons';
import SwitchDrawer from './switchDrawer';
import { saveFlowCanvas, deleteNode } from '../common';

const NodeSwitch: NsGraph.INodeRender = (props) => {
  const nodeData = _.get(props, 'data.info');
  const nodeName = nodeData?.switch.nodeName || '条件';
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(nodeName);
  const onOpen = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    setValue(nodeName);
  }, [nodeName]);
  const onChangeName = (e: any) => {
    setValue(e.target.value);
    saveFlowCanvas({
      preFlowData: props.data,
      fieldName: 'info.switch.nodeName',
      newValue: e.target.value,
    });
  };
  const onDelete = () => {
    deleteNode(props.data);
  };
  /**
   * 1. 节点的数据、位置信息通过props取
   * 2. 当节点被触发更新时, props返回的数据也会动态更新, 触发节点重新渲染
   */
  return (
    <div className="node1-container">
      <Row style={{ fontSize: 10 }}>
        <Col span={16}>
          <Input
            value={value}
            style={{ fontSize: 14, color: '#15bc83', border: 0, outline: 'none' }}
            onChange={onChangeName}
          />
        </Col>
        <Col span={6} style={{ marginTop: 5, fontSize: 12 }}>
          {'优先级' + nodeData.switch.nodeIndex}
        </Col>
        <Col span={2}>
          <a onClick={onDelete}>
            <CloseOutlined style={{ paddingTop: 8, fontSize: 15 }} />
          </a>
        </Col>
      </Row>
      <Row>
        <Col span={20}>
          <Button type="link" onClick={onOpen}>
            {nodeData?.switch.expression || '请设置'}
          </Button>
        </Col>
        <Col span={2}>
          <RightOutlined style={{ marginTop: 10 }} />
        </Col>
      </Row>
      <SwitchDrawer open={open} flowData={props.data} onClose={onClose} />
    </div>
  );
};
export default NodeSwitch;
