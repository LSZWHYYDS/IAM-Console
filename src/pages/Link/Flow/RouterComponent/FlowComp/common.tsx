//todo: 分支上有执行动作的删除其他分支
import type { NsGraphCmd, NsNodeCmd, NsEdgeCmd } from '@antv/xflow';
import { XFlowNodeCommands, XFlowGraphCommands, XFlowEdgeCommands, NsGraph } from '@antv/xflow';
import _ from 'lodash';
import { NODE_WIDTH, NODE_HEIGHT, NODE_COND_START, NODE_COND_END } from './constant';
import type { NodeType } from './data/dataType';

let flowApp: any;
let currentEdge: any = {};
//节点间隔
export const nodesep = 100;
const SEP_SWITCH = 220;
export const nodeSize = {
  width: NODE_WIDTH,
  height: NODE_HEIGHT,
};

export const setFlowApp = (app: any) => {
  flowApp = app;
};
export const getFlowApp = () => {
  return flowApp;
};
export const setCurrentEdge = (edgeData: any, x: number, y: number) => {
  currentEdge = {
    edgeData,
    x,
    y,
  };
};
export const getCurrentEdge = () => {
  return currentEdge;
};

export const getMinSecond = () => {
  return new Date().getTime();
};

export const isTrigger = (flowData: any) => {
  return flowData.flow_type === 'TRIGGER';
};
//查询此节点一个分支上的执行动作节点
export const getNextActionNodes = ({ edges, nodes, node }) => {
  const linkNodeActions: any[] = [];
  const linkLines = _.filter(edges, {
    source: node.id,
  });
  const targets = _.map(linkLines, 'target');
  let linkNodeAction = _.find(nodes, (item: any) => {
    return targets.includes(item.id) && ['ACTION'].includes(item.renderKey);
  });
  while (linkNodeAction) {
    if (linkNodeAction) {
      linkNodeActions.push(linkNodeAction);
    }
    const linkLines1 = _.filter(edges, {
      source: linkNodeAction.id,
    });
    const targets1 = _.map(linkLines1, 'target');
    linkNodeAction = _.find(nodes, (item: any) => {
      return targets1.includes(item.id) && ['ACTION'].includes(item.renderKey);
    });
  }
  return linkNodeActions;
};

//查询条件分支中的条件组
export const getNextCondNode = ({ edges, nodes, node }) => {
  const linkLine = _.find(edges, {
    source: node.id,
  });
  const condNode = _.find(nodes, {
    id: linkLine.target,
  });
  return (condNode && condNode.renderKey === 'CONDITION' && condNode) || null;
};
//查询此节点相邻的执行动作节点(执行动作 条件组节点)
export const getNextNodesByNode = ({ edges, nodes, node }) => {
  const linkLines =
    _.filter(edges, {
      source: node.id,
    }) || [];
  const targets = _.map(linkLines, 'target');
  const linkNodeAction =
    _.find(nodes, (item: any) => {
      return targets.includes(item.id) && !['END', 'NODESWITCH'].includes(item.renderKey);
    }) || {};
  const { renderKey } = linkNodeAction;
  if (renderKey === 'ACTION' || renderKey === 'CONDITION') {
    return linkNodeAction;
  }
  if (renderKey === 'CONDEND') {
    return getNextNodesByNode({
      edges,
      nodes,
      node: linkNodeAction,
    });
  }
  return linkNodeAction;
};
//查询此节点相邻的条件节点
export const getLinkSwitchNodes = (nodes: any, node: { id: any }) => {
  const linkNodeSwitches = _.filter(nodes, (item: any) => {
    return item.info.condId === node.id && ['NODESWITCH'].includes(item.renderKey);
  });
  return linkNodeSwitches;
};
//更新节点属性
export const saveFlowCanvas = ({ preFlowData, fieldName, newValue }) => {
  _.set(preFlowData, fieldName, newValue);
  flowApp.executeCommand<NsNodeCmd.UpdateNode.IArgs>(XFlowNodeCommands.UPDATE_NODE.id, {
    nodeConfig: {
      ...preFlowData,
    },
  });
};
export const getAllData = (callback: any) => {
  flowApp.executeCommand<NsGraphCmd.SaveGraphData.IArgs>(XFlowGraphCommands.SAVE_GRAPH_DATA.id, {
    saveGraphDataService: async (meta: any, data: any) => {
      callback(data);
    },
  });
};
//得到当前边，更新节点
const getUpdateEdge = (newNodeId: string) => {
  const { edgeData } = currentEdge;
  const newEdge = _.cloneDeep(edgeData);
  newEdge.target = newNodeId;
  newEdge.targetPort = newNodeId + '-input-1';
  newEdge.targetPortId = newNodeId + '-input-1';
  return newEdge;
};
// 得到新增边
const getNewEdge = (newNodeId: string) => {
  const { edgeData } = currentEdge;
  const newEdge = {
    id: 'edge' + getMinSecond(),
    label: '+',
    source: newNodeId,
    target: edgeData.target,
    renderKey: 'EDGEACTION',
    edgeContentWidth: 60,
    edgeContentHeight: 60,
    info: { lineType: 'action' },
    sourcePortId: newNodeId + '-output-1',
    targetPortId: edgeData.targetPortId,
    sourcePort: newNodeId + '-output-1',
    targetPort: edgeData.targetPort,
  };
  return newEdge;
};
// 得到新增边
const getNewEdgeByNode = ({ source, target, sourcePort, targetPort }) => {
  const newEdge = {
    id: 'edge' + getMinSecond(),
    label: '+',
    source,
    target,
    renderKey: 'EDGEACTION',
    edgeContentWidth: 60,
    edgeContentHeight: 60,
    info: { lineType: 'action' },
    sourcePortId: sourcePort,
    targetPortId: targetPort,
    sourcePort: sourcePort,
    targetPort: targetPort,
  };
  return newEdge;
};
// 得到条件新增边
const getNewSwitchEdge = ({ source, target, sourcePort, targetPort }) => {
  const newEdge = {
    id: 'switch' + getMinSecond(),
    source,
    target,
    renderKey: 'EDGESWITCH',
    edgeContentWidth: 60,
    edgeContentHeight: 60,
    info: { lineType: 'switch' },
    sourcePortId: sourcePort,
    targetPortId: targetPort,
    sourcePort,
    targetPort,
  };
  return newEdge;
};
export const getNewPorts = (nodeId: string) => {
  return [
    {
      id: nodeId + '-input-1',
      type: NsGraph.AnchorType.INPUT,
      group: NsGraph.AnchorGroup.TOP,
      // tooltip: '输入桩',
    },
    {
      id: nodeId + '-output-1',
      type: NsGraph.AnchorType.OUTPUT,
      group: NsGraph.AnchorGroup.BOTTOM,
      // tooltip: '输出桩',
    },
  ];
};
export const newActionNode = () => {
  const nodeId = getMinSecond();
  const nodeConfig = {
    id: 'action' + nodeId,
    ...nodeSize,
    x: currentEdge.x - NODE_WIDTH / 2,
    y: currentEdge.y + nodesep / 3,
    renderKey: 'ACTION',
    info: {
      action: {
        action_name: '', //执行动作名称
        action_id: '',
        nodeName: '执行动作' + nodeId, //节点名称
      },
    },
    ports: getNewPorts('action' + nodeId),
  };
  return nodeConfig;
};
export const newSwitchNode = (deltaX: number, deltaY: number, nodeIndex: number): NodeType => {
  const nodeId = getMinSecond();
  const nodeConfig = {
    id: 'switch' + nodeId,
    ...nodeSize,
    x: currentEdge.x - NODE_WIDTH / 2 + deltaX,
    y: currentEdge.y + nodesep + deltaY,
    renderKey: 'NODESWITCH',
    ports: getNewPorts('switch' + nodeId),
    info: {
      switch: {
        switch_name: '', //执行动作名称
        switch_id: '',
        nodeName: '条件' + nodeId, //节点名称,
        nodeIndex: nodeIndex,
      },
    },
  };
  return nodeConfig;
};
export const newSwitchNodeByXY = (x: any, y: any, condId: any, nodeIndex): NodeType => {
  const nodeId = getMinSecond();
  const nodeConfig = {
    id: 'switch' + nodeId,
    ...nodeSize,
    x,
    y,
    renderKey: 'NODESWITCH',
    ports: getNewPorts('switch' + nodeId),
    info: {
      condId,
      switch: {
        switch_name: '', //执行动作名称
        switch_id: '',
        nodeName: '条件' + nodeId, //节点名称
        nodeIndex: nodeIndex,
      },
    },
  };
  return nodeConfig;
};
const newCondNode = () => {
  const nodeId = getMinSecond();
  const nodeConfig = {
    id: 'cond' + nodeId,
    height: 40,
    width: NODE_COND_START,
    x: currentEdge.x - NODE_COND_START / 2,
    y: currentEdge.y + nodesep / 2,
    renderKey: 'CONDITION',
    info: {},
    ports: [
      {
        id: 'cond' + nodeId + '-top',
        type: 'input',
        group: 'top',
        // tooltip: '输入',
      },
      {
        id: 'cond' + nodeId + '-left',
        type: 'output',
        group: 'left',
        // tooltip: '输出',
      },
      {
        id: 'cond' + nodeId + '-right',
        type: 'output',
        group: 'right',
        // tooltip: '输出',
      },
      {
        id: 'cond' + nodeId + '-bottom',
        type: 'output',
        group: 'bottom',
        // tooltip: '输出',
      },
    ],
  };
  return nodeConfig;
};
//新建 条件结束节点
const newCondEndNode = (): NodeType => {
  const nodeId = getMinSecond();
  const nodeConfig = {
    id: 'condEnd' + nodeId,
    width: 20,
    height: 20,
    x: currentEdge.x - NODE_COND_END / 2,
    y: currentEdge.y + nodesep * 2.5,
    renderKey: 'CONDEND',
    info: {},
    ports: [
      {
        id: 'condEnd' + nodeId + '-left',
        type: 'input',
        group: 'left',
        // tooltip: '输入',
      },
      {
        id: 'condEnd' + nodeId + '-right',
        type: 'input',
        group: 'right',
        // tooltip: '输入',
      },
      {
        id: 'condEnd' + nodeId + '-bottom',
        type: 'output',
        group: 'bottom',
        // tooltip: '输出',
      },
      {
        id: 'condEnd' + nodeId + '-top',
        type: 'input',
        group: 'top',
        // tooltip: '输出',
      },
    ],
  };
  return nodeConfig;
};
//更新分支，分支的结束节点不用更新
const updateNextNodesPosByEdge = async ({ nodeCondEndId, edge, edges, nodes, deltaY }) => {
  let targetId = edge?.target;
  const deltaYNum = deltaY || nodesep;
  while (targetId) {
    const node = _.find(nodes, {
      id: targetId,
    });
    if (node.id === nodeCondEndId) {
      break;
    }
    node.y = node.y + deltaYNum;
    const nextEdges = _.filter(edges, {
      source: targetId,
    });
    if (nextEdges.length === 0) {
      break;
    } else if (nextEdges.length === 1) {
      targetId = nextEdges[0]?.target;
    } else {
      nextEdges.forEach((nextEdge) => {
        updateNextNodesPosByEdge({ nodeCondEndId, edge: nextEdge, edges, nodes, deltaY });
      });
      break;
    }
  }
};
//更新当前边的下面节点位置
const updateNextNodesPos = async ({ nextNodeId, edges, nodes, deltaY }) => {
  let targetId = nextNodeId;
  const deltaYNum = deltaY || nodesep;
  while (targetId) {
    const node = _.find(nodes, {
      id: targetId,
    });
    if (!node) {
      break;
    }
    node.y = node.y + deltaYNum;
    const nextEdges = _.filter(edges, {
      source: targetId,
    });
    if (nextEdges.length === 0) {
      break;
    } else if (nextEdges.length === 1) {
      targetId = nextEdges[0]?.target;
    } else {
      //下面连接 条件分支
      // eslint-disable-next-line @typescript-eslint/no-loop-func
      const conEndNode = _.find(nodes, (item: any) => {
        return item.info.condId === targetId && item.renderKey === 'CONDEND';
      });
      targetId = conEndNode.id;
      //更新条件分支结束点
      nextEdges.forEach((nextEdge) => {
        updateNextNodesPosByEdge({
          nodeCondEndId: conEndNode.id,
          edge: nextEdge,
          edges,
          nodes,
          deltaY,
        });
      });
    }
  }
};
const updateNextNodesPosByApp = (nextNodeId, deltaY: number, callback) => {
  getAllData((data: any) => {
    const { edges, nodes } = data;
    updateNextNodesPos({ nextNodeId, edges, nodes, deltaY });
    flowApp.executeCommand(XFlowGraphCommands.GRAPH_RENDER.id, {
      graphData: {
        nodes,
        edges,
      },
    } as NsGraphCmd.GraphRender.IArgs);
    if (typeof callback === 'function') {
      callback(nodes);
    }
  });
};
const updateCanvasSizeByNodes = async (nodes) => {
  const maxNodeY = _.maxBy(nodes, 'y');
  const maxNodeX = _.maxBy(nodes, 'x');
  if (maxNodeY || maxNodeX) {
    const clientHeight = document.body.clientHeight * 1.2;
    const clientWidth = (document.body.clientWidth - 200) * 1.2;
    const maxY = _.max([(maxNodeY.y || 0) + 300, clientHeight]);
    const maxX = _.max([(maxNodeX.x * 2 || 0) + 200, clientWidth]);
    const divObj = document.getElementById('flowDiv') || {};
    if (divObj) {
      divObj.style.height = maxY + 'px';
      // divObj.style.width = maxX + 'px';
      const graph = await flowApp.getGraphInstance();
      await graph.resize(maxX, maxY);
      await graph.zoomToFit();
      await graph.zoomTo(1);
    }
  }
};
//边上点击弹框中的执行动作：添加执行动作及边
export const addActionNodeAndEdge = async (edgeData: any) => {
  //先把原来的线删除，估计是线更新问题，不删除的话，原来的线连接的点不变
  await flowApp.executeCommand<NsEdgeCmd.DelEdge.IArgs>(XFlowEdgeCommands.DEL_EDGE.id, {
    edgeConfig: edgeData,
  });
  const nodeConfig = newActionNode();
  await flowApp.executeCommand<NsNodeCmd.AddNode.IArgs>(XFlowNodeCommands.ADD_NODE.id, {
    nodeConfig,
  });
  const newEdge = getNewEdge(nodeConfig.id);
  await flowApp.executeCommand<NsEdgeCmd.AddEdge.IArgs>(XFlowEdgeCommands.ADD_EDGE.id, {
    edgeConfig: newEdge,
  });
  const updateEdge = getUpdateEdge(nodeConfig.id);
  await flowApp.executeCommand<NsEdgeCmd.AddEdge.IArgs>(XFlowEdgeCommands.ADD_EDGE.id, {
    edgeConfig: updateEdge,
  });
  updateNextNodesPosByApp(edgeData.target, 200, updateCanvasSizeByNodes);
};
//更新分支上的其他下面节点的X坐标
const updateNextNodePosXByApp = async ({ edges, nodes, nodeId, condEndId, nodeX }) => {
  const nextLine = _.find(edges, (node) => {
    return node.source === nodeId;
  });
  if (!nextLine) {
    return;
  }
  const nextNode = _.find(nodes, {
    id: nextLine.target,
  });
  if (nextNode && nextNode.id === condEndId) {
    return;
  }

  if (nextNode.renderKey === 'ACTION') {
    nextNode.x = nodeX;
    updateNextNodePosXByApp({ edges, nodes, nodeId: nextNode.id, condEndId, nodeX });
  } else if (nextNode.renderKey === 'CONDITION') {
    //连接线的x坐标： nodeX + NODE_WIDTH / 2 , 条件组起点= 线x- NODE_COND_START / 2
    nextNode.x = nodeX + NODE_WIDTH / 2 - NODE_COND_START / 2;
    const brothers = _.filter(nodes, (node) => {
      return node.info.condId === nextNode.id && node.renderKey === 'NODESWITCH';
    });
    const condEnd = _.find(nodes, (node) => {
      return node.info.condId === nextNode.id && node.renderKey === 'CONDEND';
    });
    condEnd.x = nodeX + NODE_WIDTH / 2 - NODE_COND_END / 2;
    //先更新条件分组x坐标
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    await updateBrotherNodesXByApp({
      edges,
      nodes,
      brotherNodes: brothers,
      brotherNodeCount: brothers.length,
      condId: nextNode.id,
      nodeCondEndId: condEnd.id,
      condX: nodeX,
      deltaX: SEP_SWITCH,
      callback: () => {},
    });
    //再更新条件分组下的节点x坐标
    await updateNextNodePosXByApp({ edges, nodes, nodeId: condEnd.id, condEndId, nodeX });
  }
};

const updateNodeX = (id, dx) => {
  flowApp.executeCommand<NsNodeCmd.MoveNode.IArgs>(XFlowNodeCommands.MOVE_NODE.id, {
    id,
    position: {
      dx,
    },
  });
};
const updateNodeY = (id, dy) => {
  flowApp.executeCommand<NsNodeCmd.MoveNode.IArgs>(XFlowNodeCommands.MOVE_NODE.id, {
    id,
    position: {
      dy,
    },
  });
};
//更新同级条件节点的x坐标
const updateBrotherNodesXByApp = async ({
  nodes,
  edges,
  brotherNodes,
  brotherNodeCount,
  condId,
  nodeCondEndId,
  condX,
  deltaX,
  callback,
}) => {
  const midIndex = Math.ceil(brotherNodeCount / 2);
  const modValue = brotherNodeCount % 2;

  console.log('brotherNodes', brotherNodes);
  brotherNodes.forEach(async (node) => {
    const nodeIndex = node.info.switch.nodeIndex;
    // node.info.switch.nodeIndex 从1开始
    let newX;
    if (modValue === 1) {
      //总数为奇数，
      if (nodeIndex === midIndex) {
        newX = condX - nodeSize.width / 3;
      } else {
        newX = condX + (nodeIndex - midIndex) * deltaX - nodeSize.width / 2;
      }
      updateNodeX(node.id, newX - node.x);
    } else {
      //偶数
      let nodeX;
      if (nodeIndex <= midIndex) {
        nodeX = condX + (nodeIndex - midIndex - 1) * deltaX;
      } else {
        nodeX = condX + (nodeIndex - midIndex) * deltaX - nodeSize.width / 2;
      }
      updateNodeX(node.id, nodeX - node.x);
      //更新node的连接节点的X坐标
      await updateNextNodePosXByApp({
        edges,
        nodes,
        nodeId: node.id,
        condEndId: nodeCondEndId,
        nodeX,
      });
    }
  });
  //更新连接条件起点和终点的线的方位：左右各一半
  brotherNodes.forEach(async (node) => {
    const nodeIndex = node.info.switch.nodeIndex;
    // node.info.switch.nodeIndex 从1开始
    const topEdge = _.find(edges, {
      source: condId,
      target: node.id,
    });
    const bottomEdge = _.find(edges, {
      source: node.id,
      target: nodeCondEndId,
    });
    if (topEdge) {
      await flowApp.executeCommand<NsEdgeCmd.DelEdge.IArgs>(XFlowEdgeCommands.DEL_EDGE.id, {
        edgeConfig: topEdge,
      });
    }

    if (bottomEdge) {
      await flowApp.executeCommand<NsEdgeCmd.DelEdge.IArgs>(XFlowEdgeCommands.DEL_EDGE.id, {
        edgeConfig: bottomEdge,
      });
    }

    if (modValue === 1) {
      //总数为奇数，
      if (nodeIndex < midIndex) {
        if (topEdge) {
          topEdge.sourcePort = condId + '-left';
          topEdge.sourcePortId = topEdge.sourcePort;
        }
        if (bottomEdge) {
          bottomEdge.targetPort = nodeCondEndId + '-left';
          bottomEdge.targetPortId = bottomEdge.targetPort;
        }
      } else if (nodeIndex === midIndex) {
        if (topEdge) {
          topEdge.sourcePort = condId + '-bottom';
          topEdge.sourcePortId = topEdge.sourcePort;
        }
        if (bottomEdge) {
          bottomEdge.targetPort = nodeCondEndId + '-top';
          bottomEdge.targetPortId = bottomEdge.targetPort;
        }
      } else {
        if (topEdge) {
          topEdge.sourcePort = condId + '-right';
          topEdge.sourcePortId = topEdge.sourcePort;
        }
        if (bottomEdge) {
          bottomEdge.targetPort = nodeCondEndId + '-right';
          bottomEdge.targetPortId = bottomEdge.targetPort;
        }
      }
    } else {
      //偶数
      if (nodeIndex <= midIndex) {
        if (topEdge) {
          topEdge.sourcePort = condId + '-left';
          topEdge.sourcePortId = topEdge.sourcePort;
        }
        if (bottomEdge) {
          bottomEdge.targetPort = nodeCondEndId + '-left';
          bottomEdge.targetPortId = bottomEdge.targetPort;
        }
      } else {
        if (topEdge) {
          topEdge.sourcePort = condId + '-right';
          topEdge.sourcePortId = topEdge.sourcePort;
        }
        if (bottomEdge) {
          bottomEdge.targetPort = nodeCondEndId + '-right';
          bottomEdge.targetPortId = bottomEdge.targetPort;
        }
      }
    }
    if (topEdge) {
      await flowApp.executeCommand<NsEdgeCmd.AddEdge.IArgs>(XFlowEdgeCommands.ADD_EDGE.id, {
        edgeConfig: topEdge,
      });
    }
    if (bottomEdge) {
      await flowApp.executeCommand<NsEdgeCmd.AddEdge.IArgs>(XFlowEdgeCommands.ADD_EDGE.id, {
        edgeConfig: bottomEdge,
      });
    }
  });
  if (typeof callback === 'function') {
    callback(nodes);
  }
};
//点击添加条件添加条件分支
export const addCondSwitchOnNode = async (nodeData: any) => {
  getAllData(async (data: any) => {
    const { nodes, edges } = data;
    const condId = nodeData.id;
    const brotherNodes = _.filter(nodes, (node) => {
      return node.info.condId === condId && node.renderKey === 'NODESWITCH';
    });

    const nodeCondEnd = _.find(nodes, (node) => {
      return node.info.condId === condId && node.renderKey === 'CONDEND';
    });
    const onAddCondSwitch = () => {
      const lastNode = brotherNodes[brotherNodes.length - 1];
      const node1: NodeType = newSwitchNodeByXY(
        lastNode.x + SEP_SWITCH,
        lastNode.y,
        condId,
        brotherNodes.length + 1 || 1,
      );
      flowApp.executeCommand<NsNodeCmd.AddNode.IArgs>(XFlowNodeCommands.ADD_NODE.id, {
        nodeConfig: node1,
      });
      const newSwitchEdge1 = getNewSwitchEdge({
        source: condId,
        target: node1.id,
        sourcePort: condId + '-right',
        targetPort: node1.id + '-input-1',
      });
      flowApp.executeCommand<NsEdgeCmd.AddEdge.IArgs>(XFlowEdgeCommands.ADD_EDGE.id, {
        edgeConfig: newSwitchEdge1,
      });
      const condEndEdge1 = getNewEdgeByNode({
        source: node1.id,
        target: nodeCondEnd.id,
        sourcePort: node1.id + '-output-1',
        targetPort: nodeCondEnd.id + '-right',
      });
      flowApp.executeCommand<NsEdgeCmd.AddEdge.IArgs>(XFlowEdgeCommands.ADD_EDGE.id, {
        edgeConfig: condEndEdge1,
      });
      updateCanvasSizeByNodes([...nodes, node1]);
      return node1;
    };
    // const newNode = onAddCondSwitch();
    // console.log("newNode", newNode);
    // brotherNodes.push(newNode);
    //重新画之前的节点
    updateBrotherNodesXByApp({
      nodes,
      edges,
      brotherNodes,
      brotherNodeCount: brotherNodes.length + 1,
      deltaX: SEP_SWITCH,
      condX: nodeData.x,
      condId: nodeData.id,
      nodeCondEndId: nodeCondEnd.id,
      callback: onAddCondSwitch,
    });
  });
};

//边上点击分支：添加条件组，包括俩条件节点及边
export const addCondNodeOnEdge = async (edgeData: any) => {
  //先把原来的线删除，估计是线更新问题，不删除的话，原来的线连接的点不变
  await flowApp.executeCommand<NsEdgeCmd.DelEdge.IArgs>(XFlowEdgeCommands.DEL_EDGE.id, {
    edgeConfig: edgeData,
  });
  const nodeCond = newCondNode();
  await flowApp.executeCommand<NsNodeCmd.AddNode.IArgs>(XFlowNodeCommands.ADD_NODE.id, {
    nodeConfig: nodeCond,
  });
  const newEdge = getNewEdgeByNode({
    source: edgeData.source,
    target: nodeCond.id,
    sourcePort: edgeData.source + '-output-1',
    targetPort: nodeCond.id + '-top',
  });
  await flowApp.executeCommand<NsEdgeCmd.AddEdge.IArgs>(XFlowEdgeCommands.ADD_EDGE.id, {
    edgeConfig: newEdge,
  });
  const node1 = newSwitchNode(-220, 50, (edgeData.data?.ports?.length || 0) + 1 || 1);
  node1.info.condId = nodeCond.id;
  await flowApp.executeCommand<NsNodeCmd.AddNode.IArgs>(XFlowNodeCommands.ADD_NODE.id, {
    nodeConfig: node1,
  });
  const newSwitchEdge1 = getNewSwitchEdge({
    source: nodeCond.id,
    target: node1.id,
    sourcePort: nodeCond.id + '-left',
    targetPort: node1.id + '-input-1',
  });
  await flowApp.executeCommand<NsEdgeCmd.AddEdge.IArgs>(XFlowEdgeCommands.ADD_EDGE.id, {
    edgeConfig: newSwitchEdge1,
  });

  const node2: NodeType = newSwitchNode(220, 50, (edgeData.data?.ports?.length || 0) + 2 || 2);
  node2.info.condId = nodeCond.id;
  await flowApp.executeCommand<NsNodeCmd.AddNode.IArgs>(XFlowNodeCommands.ADD_NODE.id, {
    nodeConfig: node2,
  });
  const newSwitchEdge2 = getNewSwitchEdge({
    source: nodeCond.id,
    target: node2.id,
    sourcePort: nodeCond.id + '-right',
    targetPort: node2.id + '-input-1',
  });
  await flowApp.executeCommand<NsEdgeCmd.AddEdge.IArgs>(XFlowEdgeCommands.ADD_EDGE.id, {
    edgeConfig: newSwitchEdge2,
  });

  const nodeCondEnd = newCondEndNode();
  nodeCondEnd.info.condId = nodeCond.id;
  await flowApp.executeCommand<NsNodeCmd.AddNode.IArgs>(XFlowNodeCommands.ADD_NODE.id, {
    nodeConfig: nodeCondEnd,
  });
  const condEndEdge1 = getNewEdgeByNode({
    source: node1.id,
    target: nodeCondEnd.id,
    sourcePort: node1.id + '-output-1',
    targetPort: nodeCondEnd.id + '-left',
  });
  await flowApp.executeCommand<NsEdgeCmd.AddEdge.IArgs>(XFlowEdgeCommands.ADD_EDGE.id, {
    edgeConfig: condEndEdge1,
  });
  const condEndEdge2 = getNewEdgeByNode({
    source: node2.id,
    target: nodeCondEnd.id,
    sourcePort: node2.id + '-output-1',
    targetPort: nodeCondEnd.id + '-right',
  });
  await flowApp.executeCommand<NsEdgeCmd.AddEdge.IArgs>(XFlowEdgeCommands.ADD_EDGE.id, {
    edgeConfig: condEndEdge2,
  });
  //条件分支合并后连接下面的线
  const condEndNext = getNewEdgeByNode({
    source: nodeCondEnd.id,
    target: edgeData.target,
    sourcePort: nodeCondEnd.id + '-bottom',
    targetPort: edgeData.targetPort,
    targetPortId: edgeData.targetPortId,
  });
  await flowApp.executeCommand<NsEdgeCmd.AddEdge.IArgs>(XFlowEdgeCommands.ADD_EDGE.id, {
    edgeConfig: condEndNext,
  });
  updateNextNodesPosByApp(edgeData.target, 400, updateCanvasSizeByNodes);
};
//删除条件组
export const deleteCondNode = async ({ nodes, edges, condNode }) => {
  const condId = condNode.id;
  const brotherNodes = _.filter(nodes, (node) => {
    return node.info.condId === condId || node.id === condId;
  });
  console.log('brotherNodes', brotherNodes);
  brotherNodes.forEach(async (item) => {
    const linkCondNode =
      (item.renderKey === 'NODESWITCH' && getNextCondNode({ edges, nodes, node: item })) || null;
    if (linkCondNode) {
      await deleteCondNode({ nodes, edges, condNode: linkCondNode });
    }
    // 先删除此节点连接的执行动作节点
    await flowApp.executeCommand<NsNodeCmd.DelNode.IArgs>(XFlowNodeCommands.DEL_NODE.id, {
      nodeConfig: item,
    });
  });
};
//删除 节点及下面连接的点 线 返回值：
const deleteNodeAndNext = async ({ nodes, edges, endNode, nodeConfig }) => {
  //删除此分支上的节点
  let nextNode = nodeConfig;
  let lastNodeY = nodeConfig.y;
  while (nextNode) {
    lastNodeY = nextNode.y;
    await flowApp.executeCommand<NsNodeCmd.DelNode.IArgs>(XFlowNodeCommands.DEL_NODE.id, {
      nodeConfig: nextNode,
    });
    const linkEdge = _.find(edges, {
      source: nextNode.id,
    });
    const nextNodeId = linkEdge && linkEdge.target;
    nextNode =
      (nextNodeId &&
        _.find(nodes, {
          id: nextNodeId,
        })) ||
      null;
    if (nextNode && nextNode.renderKey === 'CONDITION') {
      const currentCondEnd =
        // eslint-disable-next-line @typescript-eslint/no-loop-func
        _.find(nodes, (node1: any) => {
          return node1.renderKey === 'CONDEND' && node1.info.condId === nextNode.id;
        }) || null;
      const nextLine =
        currentCondEnd &&
        _.find(edges, (node) => {
          return node.source === currentCondEnd.id;
        });
      const newNextNode =
        nextLine &&
        _.find(nodes, {
          id: nextLine.target,
        });
      try {
        //遇到条件组，整个删除
        await deleteCondNode({
          nodes,
          edges,
          condNode: nextNode,
        });
      } catch (ex) {
        console.log('deleteCondNode', ex);
      }
      lastNodeY = currentCondEnd.y;
      nextNode = newNextNode;
    }
    if (nextNode && (nextNode.id === endNode.id || nextNode.renderKey === 'END')) {
      return lastNodeY;
    }
  }
  return lastNodeY;
};
//删除condId整个条件分组
const deleteCondGroup = async ({
  brotherNodes,
  edges,
  nodes,
  condId,
  preLine,
  endLine,
  condStartY,
  condEndY,
}) => {
  brotherNodes.forEach((item) => {
    //先删除此节点连接的执行动作节点
    const linkNodeActions =
      (item.renderKey === 'NODESWITCH' && getNextActionNodes({ edges, nodes, node: item })) || [];
    const actionNodeIds = _.map(linkNodeActions, 'id');
    _.remove(nodes, (node: any) => {
      return node.id === item.id || node.id === condId || actionNodeIds.includes(node.id);
    });
    //删除各个分支连接的条件组
    const linkCondNode =
      (item.renderKey === 'NODESWITCH' && getNextCondNode({ edges, nodes, node: item })) || null;
    if (linkCondNode) {
      deleteCondNode({ nodes, edges, condNode: linkCondNode });
    }
  });
  const endCondNode = _.find(nodes, (node) => {
    return node.renderKey === 'CONDEND' && node.info.condId === condId;
  });
  if (endCondNode) {
    flowApp.executeCommand<NsNodeCmd.DelNode.IArgs>(XFlowNodeCommands.DEL_NODE.id, {
      nodeConfig: endCondNode,
    });
    _.remove(edges, {
      source: endCondNode.id,
    });
  }
  const newLinkLine = getNewEdgeByNode({
    source: preLine.source,
    target: endLine.target,
    sourcePort: preLine.sourcePort,
    targetPort: endLine.targetPort,
  });
  edges.push(newLinkLine);
  console.log('endCondNode', endCondNode);
  console.log('edges', edges);

  //将上下节点连接
  await flowApp.executeCommand(XFlowGraphCommands.GRAPH_RENDER.id, {
    graphData: {
      nodes,
      edges,
    },
  } as NsGraphCmd.GraphRender.IArgs);
  updateNextNodesPosByApp(endLine.target, condStartY - condEndY - nodesep, updateCanvasSizeByNodes);
};
const updateYNodeAndNext = ({ nodes, edges, endNode, nodeConfig, startY }) => {
  let nextNode = nodeConfig;
  let nextY = startY;
  while (nextNode) {
    nextY = nextY + nodesep * 1.2;
    if (nextNode && nextNode.renderKey === 'CONDITION') {
      const currentCondEnd =
        // eslint-disable-next-line @typescript-eslint/no-loop-func
        _.find(nodes, (node1: any) => {
          return node1.renderKey === 'CONDEND' && node1.info.condId === nextNode.id;
        }) || null;
      updateNodeY(nextNode.id, nextY - nextNode.y);
      // eslint-disable-next-line @typescript-eslint/no-loop-func
      const switches = _.filter(nodes, (node1: any) => {
        return node1.renderKey === 'NODESWITCH' && node1.info.condId === nextNode.id;
      });
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      nextY = updateSwitchesX({
        startY: nextY,
        brotherNodes: switches,
        nodes,
        edges,
        condEndNode: currentCondEnd,
      });
      nextNode = currentCondEnd;
    } else {
      updateNodeY(nextNode.id, nextY - nextNode.y);
      if (nextNode && (nextNode.id === endNode.id || nextNode.renderKey === 'END')) {
        return nextY;
      }
      const linkEdge = _.find(edges, {
        source: nextNode.id,
      });
      nextNode =
        (linkEdge &&
          _.find(nodes, {
            id: linkEdge.target,
          })) ||
        null;
    }
  }
  return nextY;
};
//更新条件分支组的x
const updateSwitchesX = ({ startY, brotherNodes, nodes, edges, condEndNode }) => {
  let maxY = startY;
  brotherNodes.forEach((node) => {
    const branchY = updateYNodeAndNext({
      nodes,
      edges,
      endNode: condEndNode,
      nodeConfig: node,
      startY,
    });
    if (branchY > maxY) {
      maxY = branchY;
    }
  });
  return maxY;
};
//删除条件分支节点及连接的其他点线
export const deleteSwitchNode = async (nodes: any, edges: any, nodeConfig: any) => {
  const condId = nodeConfig.info.condId;
  const constStart = _.find(nodes, {
    id: condId,
  });
  const condStartY = constStart.y;
  const brotherNodes = _.filter(nodes, (node) => {
    return node.info.condId === condId && node.renderKey === 'NODESWITCH';
  });
  const preLine = _.find(edges, {
    target: condId,
  });
  const endNode = _.find(nodes, (node) => {
    return node.renderKey === 'CONDEND' && node.info.condId === condId;
  });

  const condEndY = endNode.y;
  const endLine = _.find(edges, {
    source: endNode.id,
  });
  if (brotherNodes.length < 3) {
    await deleteCondGroup({
      brotherNodes,
      edges,
      nodes,
      condId,
      preLine,
      endLine,
      condStartY,
      condEndY,
    });
  } else {
    //只删除当前节点及连线
    const nodeIndex = nodeConfig.info.switch.nodeIndex;
    const nextBrother = _.filter(brotherNodes, (node) => {
      const index = node?.info?.switch?.nodeIndex || -1;
      return node.renderKey === 'NODESWITCH' && index > nodeIndex;
    });

    //右边的兄弟更新优先级和位置
    await nextBrother.forEach(async (node) => {
      const index = node.info.switch.nodeIndex;
      // node.x = node.x - nodeSize.width;
      await saveFlowCanvas({
        preFlowData: node,
        fieldName: 'info.switch.nodeIndex',
        newValue: index - 1,
      });
    });
    await deleteNodeAndNext({
      nodes,
      edges,
      endNode,
      nodeConfig,
    });
    const brotherNodesAfterDel = _.filter(brotherNodes, (item) => {
      return item.renderKey === 'NODESWITCH' && item.id !== nodeConfig.id;
    });
    //如果删除中间的，则不需要更新x坐标
    if (nodeIndex !== (brotherNodes.length + 1) / 2) {
      await updateBrotherNodesXByApp({
        nodes,
        edges,
        brotherNodes: brotherNodesAfterDel,
        brotherNodeCount: brotherNodesAfterDel.length,
        deltaX: SEP_SWITCH,
        condX: constStart.x,
        condId: constStart.id,
        nodeCondEndId: endNode.id,
        callback: async () => {},
      });
    }
    const startNode = _.find(nodes, {
      id: condId,
    });
    const startY = startNode.y;
    //后面的兄弟更新位置y
    const maxY = updateSwitchesX({
      startY,
      brotherNodes: brotherNodesAfterDel,
      nodes,
      edges,
      condEndNode: endNode,
    });
    updateYNodeAndNext({
      nodes,
      edges,
      endNode: {},
      nodeConfig: endNode,
      startY: maxY + nodesep,
    });
  }
};
//删除节点，包括删除执行动作或者条件分支节点上点击删除
export const deleteNode = async (nodeConfig: any) => {
  getAllData(async (data: any) => {
    const { edges, nodes } = data;
    if (nodeConfig.renderKey === 'NODESWITCH') {
      deleteSwitchNode(nodes, edges, nodeConfig);
      return;
    }
    const preLine = _.find(edges, {
      target: nodeConfig.id,
    });
    const nextLine = _.find(edges, {
      source: nodeConfig.id,
    });
    await flowApp.executeCommand<NsNodeCmd.DelNode.IArgs>(XFlowNodeCommands.DEL_NODE.id, {
      nodeConfig,
    });
    //将这个节点两侧的节点连接
    if (nextLine) {
      await flowApp.executeCommand(XFlowEdgeCommands.ADD_EDGE.id, {
        edgeConfig: {
          ...preLine,
          target: nextLine.target,
          targetPort: nextLine.targetPort,
          targetPortId: nextLine.targetPortId,
        },
      } as NsEdgeCmd.AddEdge.IArgs);
      updateNextNodesPosByApp(nextLine.target, -200, updateCanvasSizeByNodes);
    }
  });
};
//获取指定节点前的执行动作节点
export const getPreActionNodes = ({ nodes, edges, nodeId }) => {
  let preActions: _.List<any> | null | undefined = [];
  let preNodes = [{ id: nodeId }];
  while (preNodes.length) {
    if (preNodes.length === 1 && preNodes[0].id === 'start') {
      break;
    }
    // eslint-disable-next-line @typescript-eslint/no-loop-func
    const preEdges = _.filter(edges, (line) => {
      return _.map(preNodes, 'id').includes(line.target);
    });
    const preNodeIds = _.map(preEdges, 'source');
    preNodes = _.filter(nodes, (item: any) => {
      return preNodeIds.includes(item.id);
    });
    preActions = _.concat(
      preActions,
      _.filter(preNodes, {
        renderKey: 'ACTION',
      }),
    );
  }
  preActions = _.uniqBy(preActions, 'id');
  return preActions;
};
//得到触发器 和前面的执行动作
export const getPreActionNodeTiggerFieldList = (flowData: any, nodeId: string) => {
  const { nodes } = flowData;
  const startNode = _.find(nodes, (item) => {
    return ['NODETRIGGER'].includes(item.renderKey);
  });

  const dataList = getPreActionNodes({ ...flowData, nodeId }) || [];
  return {
    startTrigger: startNode,
    preActionNodes: dataList,
  };
};
