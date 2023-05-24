import type { IProps } from './index';
import type { NsGraph, NsNodeCmd } from '@antv/xflow';
import { XFlowNodeCommands } from '@antv/xflow';
import { createHookConfig, DisposableCollection } from '@antv/xflow';
import NodeTrigger from './react-node/nodeTrigger';
import NodeStartTime from './react-node/nodeStartTime';
import NodeAction from './react-node/nodeAction';
import NodeCond from './react-node/nodeCond';
import NodeSwitch from './react-node/nodeSwitch';
import NodeEnd from './react-node/nodeEnd';
import NodeCondEnd from './react-node/nodeCondEnd';
import EdgeAction from './react-edge/edgeAction';

export const useGraphHookConfig = createHookConfig<IProps>((config, proxy) => {
  // 获取 Props
  const props = proxy.getValue();
  console.log('get main props', props);
  config.setRegisterHook((hooks) => {
    const disposableList = [
      // 注册增加 react Node Render
      hooks.reactNodeRender.registerHook({
        name: 'add react node',
        handler: async (renderMap) => {
          renderMap.set('NODETRIGGER', NodeTrigger);
          renderMap.set('NODESTARTTIME', NodeStartTime);
          renderMap.set('ACTION', NodeAction);
          renderMap.set('NODESWITCH', NodeSwitch);
          renderMap.set('CONDITION', NodeCond);
          renderMap.set('CONDEND', NodeCondEnd);
          renderMap.set('END', NodeEnd);
        },
      }),
      hooks.reactEdgeLabelRender.registerHook({
        name: 'add react edge',
        handler: async (renderMap) => {
          renderMap.set('EDGEACTION', EdgeAction);
        },
      }),
      // 注册修改graphOptions配置的钩子
      hooks.graphOptions.registerHook({
        name: 'custom-x6-options',
        after: 'dag-extension-x6-options',
        handler: async (options) => {
          options.grid = false;
          options.scaling = {
            min: 1,
            max: 2,
          };
          // options.interacting = {
          //   nodeMovable: false,
          //   /** 边上标签默认不可以被移动 */
          //   edgeLabelMovable: false,
          // };
          options.keyboard = {
            enabled: true,
          };
          //是否设置 没有看成变化
          options.connecting = {
            snap: true,
            dangling: false,
            anchor: 'center',
            highlight: false,
            connectionPoint: 'boundary',
            router: { name: 'er' },
            connector: {
              name: 'normal',
              args: {
                radius: 0,
              },
            },
          };
        },
      }),
      // 注册增加 graph event
      hooks.x6Events.registerHook({
        name: 'add',
        handler: async (events) => {
          events.push({
            eventName: 'node:moved',
            callback: (e, cmds) => {
              const { node } = e;
              cmds.executeCommand<NsNodeCmd.MoveNode.IArgs>(XFlowNodeCommands.MOVE_NODE.id, {
                id: node.id,
                position: node.getPosition(),
              });
            },
          } as NsGraph.IEvent<'node:moved'>);
        },
      }),
    ];
    const toDispose = new DisposableCollection();
    toDispose.pushAll(disposableList);
    return toDispose;
  });
});
