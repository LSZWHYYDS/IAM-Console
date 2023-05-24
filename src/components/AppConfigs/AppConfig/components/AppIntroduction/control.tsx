import { useSetState } from 'ahooks';
export default () => {
  const [state] = useSetState<any>({
    content: {},
  });
  return {
    state,
  };
};
