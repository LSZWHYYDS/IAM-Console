import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import { Button, Input, List, Skeleton, Tooltip } from 'antd';
import { useClickAway } from 'ahooks';
import request from 'umi-request';
import type { ListType } from './index.d';
import styles from './index.less';
import { LinkedinOutlined } from '@ant-design/icons';
// import { history } from 'umi';

export async function getHaveIdIntegrationList(type) {
  return request(`/iam/api/appProfile/${type}`);
}
type IProps = {
  dynamicId: string | number;
  type?: any;
  value?: string;
  onChange?: any;
  requestNetwork?: any;
  styleObj?: any;
  componentData?: any;
};

const EditorEnter: React.FC<IProps> = (props) => {
  const {
    value,
    onChange,
    dynamicId,
    styleObj,
    // requestNetwork,
    componentData: { editOrEnterData, preFix },
  } = props;
  const [isShowSelectList, setIsShowSelectList] = useState<boolean>(false);
  // 如果使用组件的父组件传递请求网络函数 就优先使用传递过来的
  // const requestData = useRequest(
  //    () => {
  //       if (requestNetwork) return requestNetwork;
  //       else return getHaveIdIntegrationList(history?.location?.query?.type);
  //    },
  //    {
  //       throttleWait: 1000,
  //       manual: true,
  //    },
  // );

  const { data, loading, run: loadMoreData }: any = { data: [], loading: false, run: () => {} };
  useClickAway(() => {
    setIsShowSelectList(false);
  }, document.getElementById(String(dynamicId)) as HTMLDivElement);

  useEffect(() => {
    if (editOrEnterData) {
      // 代表调用组件者传递过来数据data 不需要自身再调用接口获取
    } else {
      loadMoreData();
    }
  }, [isShowSelectList]);

  return (
    <div id={String(dynamicId)} style={styleObj ? styleObj : { position: 'relative' }}>
      <Input.Search
        enterButton={
          <Button>
            <div
              style={{
                width: 10,
                height: 10,
                overflow: 'hidden',
                backgroundImage: 'url(/uc/images/rotate.png)',
                backgroundPosition: isShowSelectList ? '86px -4px' : '104px -4px',
              }}
            ></div>
          </Button>
        }
        value={value}
        onChange={onChange}
        onSearch={() => setIsShowSelectList(!isShowSelectList)}
        placeholder="请输入JavaScript表达式或下拉选择"
      ></Input.Search>
      <div
        id="scrollableDiv"
        style={{
          display: isShowSelectList ? 'block' : 'none',
          boxShadow: 'rgba(0, 0, 0, 0.25) 0px 25px 50px -12px',
          width: '100%',

          border: '1px solid rgba(140, 140, 140, 0.35)',
          position: 'absolute',
          borderRadius: 5,
          top: 40,
          left: 0,
          backgroundColor: '#fff',
          zIndex: 99999,
        }}
      >
        <InfiniteScroll
          dataLength={editOrEnterData ? editOrEnterData : data?.data?.sub_params?.length || 0}
          next={loadMoreData}
          hasMore={false}
          loader={<Skeleton avatar paragraph={{ rows: 0 }} active />}
          // endMessage={!loading ? <Divider plain>没有更多数据了 🤐</Divider> : null}
          scrollableTarget="scrollableDiv"
          style={{ overflow: 'auto', height: 342 }}
        >
          <List<ListType>
            loading={loading}
            dataSource={editOrEnterData ? editOrEnterData : data?.data?.sub_params}
            rowKey={(item) => item.name as string}
            renderItem={(item) => (
              <List.Item
                key={item.name}
                onClick={() => {
                  onChange?.(`${preFix}.${item.name}`);
                  setIsShowSelectList(false);
                }}
              >
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    textAlign: 'center',
                  }}
                >
                  <Tooltip title={item?.name}>
                    <h5
                      style={{
                        width: '33%',
                        color: 'rgba(0, 0, 0, 0.85)',
                        marginRight: 0,
                      }}
                      className={styles.ellipsis}
                    >
                      {item?.name || '--'}
                    </h5>
                  </Tooltip>

                  <Tooltip title={item?.type?.toLocaleLowerCase()}>
                    <h5 className={styles.ellipsis}>{item?.type?.toLocaleLowerCase() || '--'}</h5>
                  </Tooltip>

                  <Tooltip title={item?.description}>
                    <h5 className={styles.ellipsis}>{item?.description || '---'}</h5>
                  </Tooltip>
                </div>
              </List.Item>
            )}
          />
        </InfiniteScroll>
        <div className={styles.footerLink}>
          <LinkedinOutlined style={{ marginRight: 5, color: '#1890ff' }} />
          <a
            href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators"
            target="_blank"
            rel="noreferrer"
          >
            JavaScript表达式参考!
          </a>
        </div>
      </div>
    </div>
  );
};
// 防止其它页面调用组件 不传递componentData导致解构props报错
EditorEnter.defaultProps = {
  componentData: {},
};
export default EditorEnter;
