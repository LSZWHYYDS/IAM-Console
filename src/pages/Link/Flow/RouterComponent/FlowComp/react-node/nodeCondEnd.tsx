import type { NsGraph } from '@antv/xflow';
import './nodeCondEnd.less';

const NodeCondEnd: NsGraph.INodeRender = () => {
  /** 条件 下面的节点
   * 1. 节点的数据、位置信息通过props取
   * 2. 当节点被触发更新时, props返回的数据也会动态更新, 触发节点重新渲染
   */
  return <div className="dot-cond" />;
};
export default NodeCondEnd;
