import { requestData } from '../../../../../../server';
import { message } from 'antd';
import { useImperativeHandle, useRef } from 'react';
import { useSetState } from 'ahooks';
export const Controls = (ref: any, againRequestClass) => {
  const PopupComRef = useRef<any>();
  const [state, setState] = useSetState({
    visible: false,
    confirmLoading: false,
    appclassification: [],
    inputValue: '',
  });
  // 请求分类
  const requestClassApplication = () => {
    requestData().then((rs) => {
      setState(() => {
        const tempArr: any = [];
        return rs.data.concat(tempArr);
      });
    });
  };
  // 输入框的打开事件
  const handleOpen = () => {
    setState({
      visible: true,
    });
  };
  // 模态框的确定事件
  const handleOk = () => {
    PopupComRef?.current?.againRequest();
    setState({
      inputValue: '',
      visible: false,
      confirmLoading: false,
    });
    requestClassApplication();
    againRequestClass();
  };
  // 模态框的取消事件
  const handleCancel = () => {
    PopupComRef?.current?.againRequest();
    setState({
      inputValue: '',
      visible: false,
      confirmLoading: false,
    });
    requestClassApplication();
  };
  // 输入框的事件
  const handleChangeEvent = (e: any) => {
    setState({
      inputValue: e.target.value,
    });
  };
  // 创建分组事件
  const createClassIfication = () => {
    if (state.inputValue) {
      PopupComRef?.current?.updateClassList(state.inputValue);
      requestClassApplication();
    } else {
      message.error('不能为空');
    }
  };
  const clearInput = () => {
    setState({
      inputValue: '',
    });
  };
  useImperativeHandle(ref, () => ({
    handleOpen,
  }));
  return {
    setState,
    state,
    clearInput,
    createClassIfication,
    requestClassApplication,
    handleChangeEvent,
    handleCancel,
    handleOk,
    PopupComRef,
  };
};
