import React, { useState, useReducer, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';

// import { Card, Space, Pagination, Row, Col, Spin, Empty } from 'antd';
import { Card, Space, Spin, Empty } from 'antd';
import RenderRightInput from './components/RightInput';
import RenderContent from './components/RenderContent';

import type { ACTIONTYPE } from './data';
import { requestApplicationMarket } from './servers';

import styles from './index.less';

const tabListNoTitle = [
  {
    key: ' ',
    tab: '全部',
  },
  {
    key: 'office',
    tab: '协同办公',
  },
  {
    key: 'finance',
    tab: '营销管理',
  },
  {
    key: 'produce',
    tab: '项目管理',
  },
  {
    key: 'tools',
    tab: '开发工具',
  },
  {
    key: 'manpower',
    tab: '人力资源 ',
  },
  {
    key: 'outher',
    tab: '其他',
  },
];

type APPLICATIONLIST = { avatar: string; title: 'string'; details: 'string'; inner_category: [] };
// const tabTypeArr = ['office', 'finance', 'produce', 'tools', 'manpower'];

const Index: React.FC = () => {
  const initialState = { Total: '100', number: '1', pageSize: '100' };
  const [activeTabKey2, setActiveTabKey2] = useState<string>(' ');
  const [content, setContent] = useState<APPLICATIONLIST[]>();
  const [loading, setLoading] = useState(true);
  const [loading1, setLoading1] = useState(false);
  // const domRef = useRef<HTMLDivElement>(null);
  //  const [repair, setRepair] = useState<any>(0);
  // 保存其他应用
  const [outher, setOuther] = useState<any>([]);
  // const [spaceW, setSpaceW] = useState(100);
  // const getSpaceWidth = () => {
  //   // 获取窗口宽度
  //   let winWidth = 0;
  //   if (window.innerWidth) winWidth = window.innerWidth;
  //   else if (document.body && document.body.clientWidth) winWidth = document.body.clientWidth;

  //   // 通过深入 Document 内部对 body 进行检测，获取窗口大小
  //   if (
  //     document.documentElement &&
  //     document.documentElement.clientHeight &&
  //     document.documentElement.clientWidth
  //   ) {
  //     winWidth = document.documentElement.clientWidth;
  //   }
  //   const rightW = winWidth - 300;
  //   const colCount = Math.floor(rightW / 445);
  //   const spaceWidth = Math.floor((rightW - 445 * colCount) / 2);
  //   setSpaceW(spaceWidth);
  // };
  const reducer = (state: typeof initialState, action: ACTIONTYPE) => {
    switch (action.type) {
      case 'modifyTotal':
        return { ...state, Total: action.payload };
      case 'modifyNumber':
        return { ...state, number: action.payload };
      case 'modifyPageSize':
        return { ...state, pageSize: action.payload };
      default:
        throw new Error();
    }
  };

  // const resizeChangeWH = () => {
  //   if (document.getElementById('domRef')) {
  //     const childNodes = document.getElementById('domRef')!.childNodes;
  //     let row = 0,
  //       beforeNode = null;
  //     for (let i = 0; i < childNodes.length; i++) {
  //       const node = childNodes[i];
  //       if (!beforeNode) {
  //         beforeNode = node;
  //         continue;
  //       }
  //       if (node.offsetTop !== beforeNode.offsetTop) {
  //         row = i;
  //         break;
  //       }
  //     }
  //     setStrings(row);
  //     setRepair(
  //       row > 1
  //         ? content!.length % row == 0
  //           ? content!.length % row
  //           : row - (content!.length % row)
  //         : 0,
  //     );
  //   }
  // };

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (sessionStorage.getItem('pageNumber')) {
      dispatch({
        type: 'modifyNumber',
        payload: sessionStorage.getItem('pageNumber') || '',
      });
    }
    requestApplicationMarket({
      page: sessionStorage.getItem('pageNumber') || state.number,
      // size: state.pageSize,
      size: 100,
      category: sessionStorage.getItem('pageCorate') || activeTabKey2,
    }).then((rs) => {
      setContent(rs.data.items);
      setLoading(false);
      dispatch({
        type: 'modifyTotal',
        payload: rs.data.total,
      });
      setActiveTabKey2(sessionStorage.getItem('pageCorate') || ' ');
      //  保存数据进行筛选其他的应用
      setOuther(
        rs.data.items?.filter((filIS: any) => {
          // if (filIS?.inner_category.length) {
          //   return filIS?.inner_category.filter((forIs: any) => {
          //     return !tabTypeArr.includes(forIs)
          //   });
          // }
          return filIS?.inner_category.includes('Else');
        }),
      );
    });
    // 页面变化时获取浏览器窗口的大小
    // window.addEventListener('resize', getSpaceWidth);
    return () => {
      // 组件销毁时移除监听事件
      // window.removeEventListener('resize', getSpaceWidth);
    };
  }, []);
  // 切换Tab项处理函数
  const onTab2Change = (key: string) => {
    setLoading1(true);
    setActiveTabKey2(key);
    if (key != 'outher') {
      requestApplicationMarket({
        category: key,
        page: 1,
        // size: state.pageSize,
        size: 100,
      }).then((rs) => {
        setContent(rs.data.items);
        dispatch({
          type: 'modifyNumber',
          payload: '1',
        });
        dispatch({
          type: 'modifyTotal',
          payload: rs.data.total,
        });

        dispatch({
          type: 'modifyNumber',
          payload: '1',
        });
        setLoading1(false);
      });
    } else {
      dispatch({
        type: 'modifyTotal',
        payload: outher.length,
      });
      setLoading1(false);
      setContent(outher);
    }
  };
  // 渲染每个应用组件
  const RenderCom = () => {
    return content?.map((mapIs: any, mapInx: number) => {
      return (
        <div
          style={{
            marginBottom: '50px',
            textAlign: 'center',
            boxSizing: 'border-box',
            padding: '20px',
            width: '25%',
          }}
          key={mapInx}
        >
          <RenderContent
            key={mapInx}
            mapIs={mapIs}
            mapId={mapInx}
            client_id={mapIs.client_id}
            pageNumbers={state.number}
            pageCorate={activeTabKey2}
          />
        </div>
      );
    });
  };
  // const RenderComs = () => {
  //    return Array(repair)
  //       .fill(true)
  //       ?.map((mapIs: any, mapInx: number) => {
  //          return (
  //             <div style={{ marginBottom: '50px', width: '420px', height: '200px' }} key={mapInx}></div>
  //          );
  //       });
  // };

  // 点击分页页码事件
  // const handlePaginationChange = (number: number) => {
  //    if (activeTabKey2 == 'outher') {
  //       setContent(() => {
  //          const outhers = [...outher];
  //          return outhers.splice((number - 1) * 12, 12);
  //       });
  //    } else {
  //       setLoading1(true);
  //       // 发送接口时需要带上分类的key
  //       requestApplicationMarket({
  //          page: number,
  //          size: state.pageSize,
  //          category: activeTabKey2,
  //       }).then((rs) => {
  //          setContent(rs.data.items);
  //          setLoading1(false);
  //          dispatch({
  //             type: 'modifyNumber',
  //             payload: String(number),
  //          });
  //       });
  //    }
  // };
  // const onShowSizeChangeFunc = (current: number, size: number) => {
  //    setLoading(true);
  //    dispatch({
  //       type: 'modifyPageSize',
  //       payload: String(size),
  //    });
  //    // 发送接口时需要带上分类的key
  //    requestApplicationMarket({
  //       page: state.number,
  //       size: state.pageSize,
  //       category: activeTabKey2,
  //    }).then((rs) => {
  //       setContent(rs.data.items);
  //       setLoading(false);
  //    });
  // };

  // 处理搜索函数
  const handleSearchFunc = (value: string) => {
    setLoading1(true);
    // 会传递参数 发送接口重新请求数据 请求完毕后赋值setContent数组
    // console.log('子组件change事件函数'); value: string
    requestApplicationMarket({
      page: '1',
      size: state.pageSize,
      client_name: value,
    }).then((rs) => {
      setContent(rs.data.items);
      setLoading1(false);
    });
  };
  return (
    <PageContainer>
      <Spin
        spinning={loading}
        style={{ backgroundColor: '#fff', opacity: 1, maxHeight: 'unset', height: '100vh' }}
      >
        <Card
          style={{ width: '100%' }}
          tabList={tabListNoTitle}
          activeTabKey={activeTabKey2}
          tabBarExtraContent={<RenderRightInput sonComponHandleFunc={handleSearchFunc} />}
          onTabChange={(key) => {
            onTab2Change(key);
          }}
        >
          {content?.length ? (
            <Spin spinning={loading1} style={{ maxHeight: 'unset', background: '#fff' }}>
              <Space wrap align="center" style={{ width: '100%' }} className={styles.wrapper}>
                {
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'start',
                      flexWrap: 'wrap',
                      width: '100%',
                      // width: 'fit-content',
                      height: 'fit-content',
                      // marginLeft: spaceW + 'px',
                    }}
                    id="domRef"
                  >
                    {RenderCom()}
                    {/* {document.getElementById('domRef')
                                 ? new ResizeObserver(resizeChangeWH).observe(
                                    document.getElementById('domRef'),
                                 )
                                 : ''}
                              {RenderCom()}
                              {repair ? RenderComs() : ''}
                              {repair == 0 && strings !== 0 && content.length != 12
                                 ? Array(2)
                                    .fill(true)
                                    ?.map((mapIs: any, mapInx: number) => {
                                       return (
                                          <div
                                             style={{ marginBottom: '50px', width: '420px', height: '200px' }}
                                             key={mapInx}
                                          ></div>
                                       );
                                    })
                                 : ''} */}
                  </div>
                }
              </Space>
            </Spin>
          ) : (
            <Empty></Empty>
          )}
          {/* <Row justify="end" style={{ marginTop: '60px' }}>
            <Col style={{ marginRight: '30px' }}>
                <Pagination
                  current={Number(state.number)}
                  defaultCurrent={1}
                  total={Number(state.Total)}
                  defaultPageSize={12}
                  onChange={handlePaginationChange}
                  // onShowSizeChange={onShowSizeChangeFunc}
                  showSizeChanger={false}
                />
              </Col>
            </Row> */}
        </Card>
      </Spin>
    </PageContainer>
  );
};
export default Index;
