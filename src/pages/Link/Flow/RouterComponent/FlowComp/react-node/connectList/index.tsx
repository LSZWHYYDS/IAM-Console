import { forwardRef, useEffect, useState } from 'react';
import { Row, Col, Input, Tooltip } from 'antd';
import { getConnecct } from '@/pages/Link/Flow/service';
import { SearchOutlined } from '@ant-design/icons';
import _ from 'lodash';

import styles from './index.less';
/**
 * 渲染连接器列表组件
 */
const ConnectList = (props: any) => {
  const [list, setList] = useState([]);
  const [filterList, setFilterList] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    getConnecct().then((rs) => {
      setList(rs?.data?.items || []);
    });
  }, []);
  useEffect(() => {
    const objList: any[] =
      (searchValue &&
        _.filter(list, (item: any) => {
          return item.name.includes(searchValue);
        })) ||
      list;
    setFilterList(objList);
  }, [searchValue, list]);
  const SearchConnectHandle = (event: any) => {
    setSearchValue(event.target.value);
  };
  const renderNullDiv = () => {
    return (
      (filterList.length === 0 && (
        <Row style={{ marginTop: 50 }}>
          <Col span={24} style={{ textAlign: 'center' }}>
            暂无符合条件的连接器数据
          </Col>
        </Row>
      )) ||
      null
    );
  };

  const renderList = () => {
    return (
      (filterList.length && (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {filterList.map((item) => {
            return (
              <div
                className={styles.item___2Ymoq}
                title={item.name}
                onClick={() => props.modifyToggleHandles(item)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <div style={{ marginRight: 5 }}>
                  <img
                    src={item.icon || '/uc/images/link/connect.png'}
                    alt="连接器图片"
                    className={styles.imgClass}
                  />
                </div>
                <Tooltip placement="top" title={item.name} arrowPointAtCenter>
                  <div className={styles.testEllipsis}>{item.name}</div>
                </Tooltip>
              </div>
            );
          })}
        </div>
      )) ||
      null
    );
  };

  return (
    <div className={styles.wrapper} style={{ width: '100%' }}>
      <Input
        prefix={<SearchOutlined />}
        allowClear
        placeholder="请搜索连接器名称"
        onChange={SearchConnectHandle}
        value={searchValue}
      />
      {renderNullDiv()}
      {renderList()}
    </div>
  );
};
export default forwardRef(ConnectList);
