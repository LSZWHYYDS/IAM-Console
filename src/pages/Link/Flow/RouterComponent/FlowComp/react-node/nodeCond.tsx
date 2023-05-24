import type { NsGraph } from '@antv/xflow';
import { Button } from 'antd';
import './nodeCond.css';
import { addCondSwitchOnNode } from '../common';

const NodeCond: NsGraph.INodeRender = (props) => {
  const onAddCond = () => {
    const condData = props.data;
    addCondSwitchOnNode(condData);
  };
  /**
   * 1. 节点的数据、位置信息通过props取
   * 2. 当节点被触发更新时, props返回的数据也会动态更新, 触发节点重新渲染
   */
  return (
    <div className="cond-box">
      <Button shape="round" className="cond-btn" onClick={onAddCond}>
        添加条件
      </Button>
    </div>
  );
};
export default NodeCond;
