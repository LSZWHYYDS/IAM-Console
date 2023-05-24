import { Input } from 'antd';
import React from 'react';

const { Search } = Input;
interface Iprops {
  sonComponHandleFunc: (value: string) => void;
}
const Index: React.FC<Iprops> = ({ sonComponHandleFunc }) => {
  const onSearch = (value: string) => {
    sonComponHandleFunc(value);
    return;
  };
  return (
    <div style={{ width: '400px' }}>
      <Search
        placeholder="请输入应用名称"
        allowClear
        enterButton="搜索"
        size="large"
        onSearch={onSearch}
      />
    </div>
  );
};

export default Index;
