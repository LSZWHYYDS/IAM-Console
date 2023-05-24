export default {
  namespace: 'component_configs',
  state: {
    siblingRef$: null,
    testPageLoading: true,

    useSelectKey: [],
    editTree: [],

    selectListfixCls: '',
  },
  reducers: {
    archiveEventLine(state, { payload }) {
      return {
        ...state,
        siblingRef$: payload,
      };
    },
    modifyTestPageLoading(state, { payload }) {
      return {
        ...state,
        testPageLoading: payload,
      };
    },

    modifUseSelectKey(state, { payload }) {
      return {
        ...state,
        useSelectKey: payload,
      };
    },

    modifEditTree(state, { payload }) {
      return {
        ...state,
        editTree: payload,
      };
    },

    // 修改自定义组件下拉列表的前缀
    modifyCustomeListPix(state, { payload }) {
      return {
        ...state,
        selectListfixCls: payload,
      };
    },
  },
};
