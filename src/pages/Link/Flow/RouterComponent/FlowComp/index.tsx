import React from 'react';
import { Row, Col, Button, Space, message } from 'antd';
import { history } from 'umi';
/** app 核心组件 */
import { XFlow, XFlowCanvas } from '@antv/xflow';
import type { IApplication, IAppLoad, NsGraph } from '@antv/xflow';
/** 交互组件 */
import {
  /** 触发Command的交互组件 */
  CanvasScaleToolbar,
  /** Graph的扩展交互组件 */
  CanvasSnapline,
  CanvasNodePortTooltip,
  DagGraphExtension,
} from '@antv/xflow';

/** app 组件配置  */
/** 配置画布 */
import { useGraphHookConfig } from './config-graph';
/** 配置Command */
import { useCmdConfig, initGraphCmds } from './config-cmd';
/** 配置Model */
import { useModelServiceConfig } from './config-model-service';

/** 配置Toolbar */
import {
  setFlowApp,
  setCurrentEdge,
  getAllData,
  getLinkSwitchNodes,
  getNextNodesByNode,
} from './common';
import { saveFlow } from '../../service';
import { ServiceApi } from './service';

import './index.less';
import '@antv/xflow/dist/index.css';

export interface IProps {
  meta: { flowId: string };
}

export const FlowComp: React.FC<IProps> = (props) => {
  const { meta } = props;
  const graphHooksConfig = useGraphHookConfig(props);
  const cmdConfig = useCmdConfig();
  const modelServiceConfig = useModelServiceConfig();

  const cache = React.useMemo<{ app: IApplication } | null>(
    () => ({
      app: null,
    }),
    [],
  );
  /**
   * @param app 当前XFlow工作空间
   * @param extensionRegistry 当前XFlow配置项
   */

  const onLoad: IAppLoad = async (app) => {
    cache.app = app;
    setFlowApp(app);
    initGraphCmds(cache.app);
    const graph = await app.getGraphInstance();
    graph.on('edge:click', ({ x, y, edge }) => {
      const edgeData: NsGraph.IEdgeConfig = edge.getData();
      setCurrentEdge(edgeData, x, y);
    });
  };

  /** 父组件meta属性更新时,执行initGraphCmds */
  React.useEffect(() => {
    if (cache.app) {
      initGraphCmds(cache.app);
    }
  }, [cache.app, meta]);
  const onGoback = () => {
    history.push(`/link/flow`);
  };

  const getCondition_schema = (nodes, edges, node) => {
    if (node.renderKey === 'CONDITION') {
      const switchNodes = getLinkSwitchNodes(nodes, node);
      return switchNodes.map((switchNode: any) => {
        const linkNode = getNextNodesByNode({ edges, nodes, node: switchNode });
        return {
          id: switchNode.id,
          expression: switchNode.info.switch.expression,
          next_step_id: linkNode?.id || '',
        };
      });
    }
    return [];
  };
  //获取节点数据，给服务端用
  const getSteps = (nodes, edges) => {
    const step_schemas = [];
    nodes.forEach((node: any) => {
      if (['ACTION', 'CONDITION'].includes(node.renderKey)) {
        const linkNode = getNextNodesByNode({ edges, nodes, node });
        const actionObj = node.info.action;
        const step = {
          id: node.id,
          step_type: node.renderKey,
          // step类型 = ['ACTION', 'CONDITION']
          action_schema: (actionObj && actionObj.action_schema) || {},
          api_link_id: actionObj && actionObj.api_link_id,
          // 分支模型参数 ,
          condition_schema: getCondition_schema(nodes, edges, node),
          next_id: linkNode?.id || '',
        };
        step_schemas.push(step);
      }
    });
    return step_schemas;
  };
  const onSave = async () => {
    getAllData(async (data) => {
      const { nodes, edges } = data;
      if (!data || !nodes.length) {
        message.error('请重新加载节点');
        return;
      }
      const saveData = ServiceApi.getDbData();
      const startNode = data.nodes[0]?.info?.nodeData?.config || saveData.config;
      if (startNode) {
        const { trigger_id } = startNode.start;
        if (data.nodes[0]?.info?.nodeData) {
          saveData.config = {
            ...saveData.config,
            ...startNode,
          };
        }

        saveData.config.lines = edges;
        saveData.config.nodes = nodes;
        saveData.config.step_schemas = getSteps(nodes, edges);
        saveData.trigger_id = trigger_id;
        console.log('saveGraphDataService', saveData);
      } else {
        message.error('请设置执行事件');
        return;
      }
      await saveFlow(saveData.id, saveData).then((result: any) => {
        if (result?.error_description == 'SUCCESS') {
          message.success('修改成功');
        }
      });
    });
  };
  return (
    <>
      <div
        id="flowDiv"
        style={{ height: props.height, marginBottom: 40, overflowX: 'scroll', overflowY: 'hidden' }}
      >
        <XFlow
          className="dag-user-custom-clz"
          hookConfig={graphHooksConfig}
          modelServiceConfig={modelServiceConfig}
          commandConfig={cmdConfig}
          onLoad={onLoad}
          meta={meta}
        >
          <DagGraphExtension />

          <XFlowCanvas
            position={{ top: 0, left: 0, right: 0, bottom: 0 }}
            style={{ height: 'fit-content' }}
          >
            <CanvasScaleToolbar position={{ top: 0, right: 0 }} />
            <CanvasSnapline color="#faad14" />
            <CanvasNodePortTooltip />
            {/* <CanvasContextMenu config={menucConfig} /> */}
          </XFlowCanvas>
        </XFlow>
      </div>
      <Row style={{ marginTop: 10 }} justify="center">
        <Col>
          <Space>
            <Button onClick={onGoback}>返回</Button>
            <Button type="primary" onClick={onSave}>
              保存
            </Button>
          </Space>
        </Col>
      </Row>
    </>
  );
};

export default FlowComp;

FlowComp.defaultProps = {
  meta: { flowId: 'test-meta-flow-id' },
};
