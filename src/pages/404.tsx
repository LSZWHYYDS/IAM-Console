import { Result } from 'antd';
import React from 'react';

const NoFoundPage: React.FC = () => (
  <Result status="404" title="404" subTitle="对不起，您访问的页面不存在。" />
);

export default NoFoundPage;
