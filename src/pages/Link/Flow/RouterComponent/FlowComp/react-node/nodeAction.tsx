import type { NsGraph } from '@antv/xflow';
import { useState, useEffect } from 'react';
import { Row, Col, Input, Button } from 'antd';
import _ from 'lodash';
import './nodeAction.css';
import { RightOutlined, CloseOutlined } from '@ant-design/icons';
import ActionDrawer from './actionDrawer';
import { saveFlowCanvas, deleteNode } from '../common';
const NodeAction: NsGraph.INodeRender = (props) => {
  const nodeData = _.get(props, 'data.info');
  const nodeName = nodeData?.action.nodeName;
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
    const inputVal = e.target.value;
    setValue(inputVal);
    saveFlowCanvas({
      preFlowData: props.data,
      fieldName: 'info.action.nodeName',
      newValue: inputVal,
    });
  };
  const onPressEnter = (e: any) => {
    const inputVal = e.target.value || '未命名';
    setValue(inputVal);
    saveFlowCanvas({
      preFlowData: props.data,
      fieldName: 'info.action.nodeName',
      newValue: inputVal,
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
    <div className="node-action-container">
      <Row style={{ backgroundColor: '#348af7', fontSize: 14, color: '#fff' }}>
        <Col span={20}>
          <Input
            bordered={false}
            value={value}
            style={{ backgroundColor: '#348af7', fontSize: 14, color: '#fff' }}
            onChange={onChangeName}
            onPressEnter={onPressEnter}
            onBlur={onPressEnter}
          />
        </Col>
        <Col span={2}>
          <a onClick={onDelete} className="closeIcon">
            <CloseOutlined style={{ paddingTop: 8, fontSize: 15, color: '#fff' }} />
          </a>
        </Col>
      </Row>
      <Row>
        <Col span={20}>
          <Button type="link" onClick={onOpen}>
            <span className="node-over-flow">{nodeData?.action.action_name || '请设置'}</span>
          </Button>
        </Col>
        <Col span={2}>
          <RightOutlined style={{ marginTop: 10 }} />
        </Col>
      </Row>
      <ActionDrawer open={open} flowData={props.data} onClose={onClose} />
    </div>
  );
};
export default NodeAction;
