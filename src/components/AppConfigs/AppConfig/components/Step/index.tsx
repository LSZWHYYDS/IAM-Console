import { Steps } from 'antd';
import React, { useRef } from 'react';

import BaseInfo from './components/baseInfo';
import LoginType from './components/loginConfig';
import AuthorScope from './components/authorScope/Authorization';
import controller from './controller';
import styles from './index.less';

const contentTitle = [
  {
    title: '基本信息',
  },

  {
    title: '登录配置',
  },

  {
    title: '授权范围',
  },
];
const Index: React.FC<any> = () => {
  const viewRef = useRef(null);
  const {
    state: { current },
    handleStepsChange,
    btnClick,
  } = controller(viewRef);

  return (
    <>
      <Steps
        type="navigation"
        current={current}
        onChange={handleStepsChange}
        items={contentTitle.map((item) => ({ key: item.title, title: item.title }))}
      />
      <div className={styles.stepsContent}>
        {current == 0 ? (
          <BaseInfo {...{ handleStepsChange: btnClick }} ref={viewRef} />
        ) : current == 1 ? (
          <LoginType {...{ handleStepsChange: btnClick }} ref={viewRef} />
        ) : (
          <AuthorScope {...{ handleStepsChange: btnClick }} ref={viewRef} />
        )}
      </div>
    </>
  );
};

export default Index;
