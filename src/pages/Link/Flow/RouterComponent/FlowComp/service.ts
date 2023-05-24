/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NODE_WIDTH, NODE_HEIGHT } from './constant';
import { NsGraph, NsGraphStatusCommand } from '@antv/xflow';
import type { NsNodeCmd, NsEdgeCmd, NsGraphCmd } from '@antv/xflow';
import type { NsDeployDagCmd } from './cmd-extensions/cmd-deploy';
import { getFlowDefails } from '../../service';
import { parseQueryString } from '@/utils/common.utils';
import { getMinSecond, getNewPorts, isTrigger } from './common';
import { history } from 'umi';
/** mock 后端接口调用 */
export namespace ServiceApi {
  let dbData = {};
  export const NODE_COMMON_PROPS = {
    // renderKey: DND_RENDER_ID,
    width: NODE_WIDTH,
    height: NODE_HEIGHT,
  } as const;

  export const getDbData = () => {
    return dbData;
  };
  /** 查图的meta元信息 */
  export const queryGraphMeta: NsGraphCmd.GraphMeta.IArgs['graphMetaService'] = async (args) => {
    console.log('queryMeta', args);
    return { ...args, flowId: args.meta.flowId };
  };
  const getFlowFromServer = async () => {
    const query = parseQueryString();
    let data = {};
    if (query.id) {
      const resp = await getFlowDefails(query.id);
      data = resp.data;
      if (!data.config) {
        data.config = {
          cron: null,
          start: {},
          start_name: (isTrigger(data) && '请选择触发事件') || '定时触发',
        };
      }
      dbData = data;
    } else {
      history.push('/link/flow');
    }
    return data;
  };
  const getDefaultEdges = (nodeId2: string) => {
    return [
      {
        id: 'start-action1',
        source: 'start',
        target: nodeId2,
        renderKey: 'EDGEACTION',
        label: '配置',
        edgeContentWidth: 60,
        edgeContentHeight: 60,
        info: { lineType: 'action' },
        sourcePortId: 'start-output-1',
        targetPortId: nodeId2 + '-input-1',
      },
      {
        id: 'action1-end',
        label: '配置',
        source: nodeId2,
        target: 'end',
        renderKey: 'EDGEACTION',
        edgeContentWidth: 60,
        edgeContentHeight: 60,
        info: { lineType: 'action' },
        sourcePortId: nodeId2 + '-output-1',
        targetPortId: 'end-input-1',
      },
    ];
  };
  const getDefaultNodes = (data: any) => {
    const nodeId = getMinSecond();
    const nodes = [
      {
        id: 'start',
        ...NODE_COMMON_PROPS,
        x: 100,
        y: 0,
        renderKey: (isTrigger(data) && 'NODETRIGGER') || 'NODESTARTTIME',
        info: {
          nodeData: data,
          nextNodeIds: ['action' + nodeId],
        },
        ports: [
          {
            id: 'start-output-1',
            type: NsGraph.AnchorType.OUTPUT,
            group: NsGraph.AnchorGroup.BOTTOM,
            // tooltip: '输出桩',
          },
        ] as NsGraph.INodeAnchor[],
      },
    ];
    nodes.push({
      id: 'action' + nodeId,
      ...NODE_COMMON_PROPS,
      x: 100,
      y: 200,
      renderKey: 'ACTION',
      info: {
        action: {
          action_name: '', //执行动作名称
          action_id: '',
          nodeName: '执行动作' + nodeId, //节点名称
        },
      },
      ports: getNewPorts('action' + nodeId),
    });
    nodes.push({
      id: 'end',
      ...NODE_COMMON_PROPS,
      x: 100,
      y: 400,
      renderKey: 'END',
      info: { text: 'end' },
      ports: [
        {
          id: 'end-input-1',
          type: NsGraph.AnchorType.INPUT,
          group: NsGraph.AnchorGroup.TOP,
          // tooltip: '输入桩',
        },
      ] as NsGraph.INodeAnchor[],
    });
    return nodes;
  };
  /** 加载图数据的api */
  export const loadGraphData = async () => {
    const data = await getFlowFromServer();
    let nodes: NsGraph.INodeConfig[];
    const step_schemas = data.config?.nodes || [];
    if (step_schemas.length) {
      nodes = step_schemas;
    } else {
      nodes = getDefaultNodes(data);
    }
    const nodeId2 = nodes[1].id;
    const lines = data.config?.lines || [];
    const edges: NsGraph.IEdgeConfig[] = lines && lines.length ? lines : getDefaultEdges(nodeId2);
    return { nodes, edges };
  };
  /** 保存图数据的api */
  export const saveGraphData: NsGraphCmd.SaveGraphData.IArgs['saveGraphDataService'] = async (
    meta: NsGraph.IGraphMeta,
    graphData: NsGraph.IGraphData,
  ) => {
    return {
      success: true,
      data: graphData,
    };
  };
  /** 部署图数据的api */
  export const deployDagService: NsDeployDagCmd.IDeployDagService = async (
    meta: NsGraph.IGraphMeta,
    graphData: NsGraph.IGraphData,
  ) => {
    return {
      success: true,
      data: graphData,
    };
  };

  /** 添加节点api */
  export const addNode: NsNodeCmd.AddNode.IArgs['createNodeService'] = async (
    args: NsNodeCmd.AddNode.IArgs,
  ) => {
    const { groupChildren } = args.nodeConfig;
    /** 这里添加连线桩 */
    const node: NsNodeCmd.AddNode.IArgs['nodeConfig'] = {
      ...NODE_COMMON_PROPS,
      ...args.nodeConfig,
      // ports: (ports as NsGraph.INodeAnchor[]).map((port) => {
      //   return { ...port, id: uuidv4() };
      // }),
    };
    /** group没有链接桩 */
    if (groupChildren && groupChildren.length) {
      node.ports = [];
    }
    return node;
  };

  /** 更新节点 name，可能依赖接口判断是否重名，返回空字符串时，不更新 */
  export const renameNode: NsRenameNodeCmd.IUpdateNodeNameService = async (
    name,
    node,
    graphMeta,
  ) => {
    console.log('rename node', node, name, graphMeta);
    return { err: null, nodeName: name };
  };

  /** 删除节点的api */
  export const delNode: NsNodeCmd.DelNode.IArgs['deleteNodeService'] = async (args) => {
    console.info('delNode service running, del node:', args.nodeConfig.id);
    return true;
  };

  /** 添加边的api */
  export const addEdge: NsEdgeCmd.AddEdge.IArgs['createEdgeService'] = async (args) => {
    const { edgeConfig } = args;
    return {
      ...edgeConfig,
    };
  };

  /** 删除边的api */
  export const delEdge: NsEdgeCmd.DelEdge.IArgs['deleteEdgeService'] = async (args) => {
    console.info('delEdge service running, del edge:', args);
    return true;
  };
  let runningNodeId = 0;
  const statusMap = {} as NsGraphStatusCommand.IStatusInfo['statusMap'];
  let graphStatus: NsGraphStatusCommand.StatusEnum = NsGraphStatusCommand.StatusEnum.DEFAULT;
  export const graphStatusService: NsGraphStatusCommand.IArgs['graphStatusService'] = async () => {
    if (runningNodeId < 4) {
      statusMap[`node${runningNodeId}`] = { status: NsGraphStatusCommand.StatusEnum.SUCCESS };
      statusMap[`node${runningNodeId + 1}`] = {
        status: NsGraphStatusCommand.StatusEnum.PROCESSING,
      };
      runningNodeId += 1;
      graphStatus = NsGraphStatusCommand.StatusEnum.PROCESSING;
    } else {
      runningNodeId = 0;
      statusMap.node4 = { status: NsGraphStatusCommand.StatusEnum.SUCCESS };
      graphStatus = NsGraphStatusCommand.StatusEnum.SUCCESS;
    }
    return {
      graphStatus: graphStatus,
      statusMap: statusMap,
    };
  };
  export const stopGraphStatusService: NsGraphStatusCommand.IArgs['graphStatusService'] =
    async () => {
      Object.entries(statusMap).forEach(([, val]) => {
        const { status } = val as { status: NsGraphStatusCommand.StatusEnum };
        if (status === NsGraphStatusCommand.StatusEnum.PROCESSING) {
          val.status = NsGraphStatusCommand.StatusEnum.ERROR;
        }
      });
      return {
        graphStatus: NsGraphStatusCommand.StatusEnum.ERROR,
        statusMap: statusMap,
      };
    };
}
