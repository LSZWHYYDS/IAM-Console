export default {
  namespace: 'OrgTree',
  state: {
    selectTreeValue: '',
  },
  reducers: {
    // 修改自定义组件下拉列表的前缀
    modifySelectTreeValue(state, { payload }) {
      return {
        ...state,
        selectTreeValue: payload,
      };
    },
  },
};
