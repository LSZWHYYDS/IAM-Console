/* eslint-disable @typescript-eslint/no-namespace */
import type { IToolbarItemOptions } from '@antv/xflow';
import { createToolbarConfig } from '@antv/xflow';
import type { IModelService } from '@antv/xflow';
import { NsGraphStatusCommand, MODELS, IconStore } from '@antv/xflow';
import {
  UngroupOutlined,
  CloudSyncOutlined,
  GroupOutlined,
  GatewayOutlined,
  PlaySquareOutlined,
  StopOutlined,
} from '@ant-design/icons';

export namespace NSToolbarConfig {
  /** 注册icon 类型 */
  // IconStore.set('SaveOutlined', SaveOutlined);
  IconStore.set('CloudSyncOutlined', CloudSyncOutlined);
  IconStore.set('GatewayOutlined', GatewayOutlined);
  IconStore.set('GroupOutlined', GroupOutlined);
  IconStore.set('UngroupOutlined', UngroupOutlined);
  IconStore.set('PlaySquareOutlined', PlaySquareOutlined);
  IconStore.set('StopOutlined', StopOutlined);

  /** toolbar依赖的状态 */
  export interface IToolbarState {
    isMultiSelectionActive: boolean;
    isNodeSelected: boolean;
    isGroupSelected: boolean;
    isProcessing: boolean;
  }

  export const getDependencies = async (modelService: IModelService) => {
    return [
      await MODELS.SELECTED_CELLS.getModel(modelService),
      await MODELS.GRAPH_ENABLE_MULTI_SELECT.getModel(modelService),
      await NsGraphStatusCommand.MODEL.getModel(modelService),
    ];
  };

  /** toolbar依赖的状态 */
  export const getToolbarState = async (modelService: IModelService) => {
    // isMultiSelectionActive
    const { isEnable: isMultiSelectionActive } = await MODELS.GRAPH_ENABLE_MULTI_SELECT.useValue(
      modelService,
    );
    // isGroupSelected
    const isGroupSelected = await MODELS.IS_GROUP_SELECTED.useValue(modelService);
    // isNormalNodesSelected: node不能是GroupNode
    const isNormalNodesSelected = await MODELS.IS_NORMAL_NODES_SELECTED.useValue(modelService);
    // statusInfo
    const statusInfo = await NsGraphStatusCommand.MODEL.useValue(modelService);

    return {
      isNodeSelected: isNormalNodesSelected,
      isGroupSelected,
      isMultiSelectionActive,
      isProcessing: statusInfo.graphStatus === NsGraphStatusCommand.StatusEnum.PROCESSING,
    } as NSToolbarConfig.IToolbarState;
  };
  export const getToolbarItems = async () => {
    const toolbarGroup1: IToolbarItemOptions[] = [];
    const toolbarGroup2: IToolbarItemOptions[] = [];
    const toolbarGroup3: IToolbarItemOptions[] = [];

    return [
      { name: 'graphData', items: toolbarGroup1 },
      { name: 'groupOperations', items: toolbarGroup2 },
      {
        name: 'customCmd',
        items: toolbarGroup3,
      },
    ];
  };
}
export const useToolbarConfig = createToolbarConfig((toolbarConfig) => {
  /** 生产 toolbar item */
  toolbarConfig.setToolbarModelService(async (toolbarModel, modelService, toDispose) => {
    const updateToolbarModel = async () => {
      const state = await NSToolbarConfig.getToolbarState(modelService);
      const toolbarItems = await NSToolbarConfig.getToolbarItems(state);
      toolbarModel.setValue((toolbar) => {
        toolbar.mainGroups = toolbarItems;
      });
    };
    const models = await NSToolbarConfig.getDependencies(modelService);
    const subscriptions = models.map((model) => {
      return model.watch(async () => {
        updateToolbarModel();
      });
    });
    toDispose.pushAll(subscriptions);
  });
});
