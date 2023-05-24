import type { NsGraph } from '@antv/xflow';
import './nodeEnd.less';

const NodeEnd: NsGraph.INodeRender = () => {
  /**
   * 1. 节点的数据、位置信息通过props取
   * 2. 当节点被触发更新时, props返回的数据也会动态更新, 触发节点重新渲染
   */
  return (
    <div className="end-container">
      <div className="dot" />
      <div style={{ marginTop: 30 }}>流程结束</div>
    </div>
  );
};
export default NodeEnd;
