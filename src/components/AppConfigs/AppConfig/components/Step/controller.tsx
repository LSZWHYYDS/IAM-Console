import { useSetState } from 'ahooks';

export default (viewRef) => {
  const [state, setState] = useSetState<any>({
    current: 0,
  });

  /**
   * steps组件的Change函数
   */
  const handleStepsChange = async (currents: number) => {
    if (currents == 2 && viewRef?.current?.formSubmit) {
      const result = await viewRef?.current?.formSubmit?.();
      if (!result) return;
    }
    if (currents == 1 && viewRef?.current?.onFormSubmit) {
      const result = await viewRef?.current?.onFormSubmit?.();
      if (!result) return;
    }

    setState({
      current: currents,
    });
  };

  const btnClick = (current: number) => {
    setState({
      current,
    });
  };

  return {
    state,
    handleStepsChange,
    btnClick,
  };
};
