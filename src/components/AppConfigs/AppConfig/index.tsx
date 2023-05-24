import { useLocation, connect } from 'umi';
import { Card, Spin } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';

import AppIntroduction from './components/AppIntroduction';
import Steps from './components/Step/index';

import { useEventEmitter } from 'ahooks';
import styles from './index.less';
const mapStateToProps = (state) => {
  return {
    siblingRef$: state.component_configs.siblingRef$,
    testPageLoading: state.component_configs.testPageLoading,
  };
};
const Index = (props) => {
  const location: any = useLocation();
  /**
   * 防止token失效后端重定向地址会覆盖掉原来前端地址栏中的query参数
   */
  if (location.query.client_id) {
    sessionStorage.setItem('appClientId', location.query.client_id);
  }

  /**
   * 父组件实例化全局事件线 存档到全局store(提供给按钮组件使用实例)
   */
  const siblingRef$ = useEventEmitter<any>();
  props?.dispatch?.({
    type: 'component_configs/archiveEventLine',
    payload: siblingRef$,
  });
  return (
    <PageContainer className={styles.wrapper} title={false}>
      <AppIntroduction
        client_id={location.query.client_id || sessionStorage.getItem('appClientId')}
      />
      <Card bodyStyle={{ padding: '10px 30px 0 30px' }}>
        <Spin spinning={props.testPageLoading} style={{ background: '#fff', maxHeight: 'unset' }}>
          <Steps siblingRef$={siblingRef$} />
        </Spin>
      </Card>
    </PageContainer>
  );
};
export default connect(mapStateToProps)(Index);
