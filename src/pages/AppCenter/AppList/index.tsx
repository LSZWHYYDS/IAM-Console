import type { TableListPagination } from '@/pages/AppCenter/data';
import {
  BorderOuterOutlined,
  DingdingOutlined,
  DownOutlined,
  PlusOutlined,
  TrademarkCircleOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Avatar, Button, Dropdown, message, Popconfirm, Space } from 'antd';
// import moment from 'moment';
import React, { useRef, useState, useEffect } from 'react';
import { history } from 'umi';
import AddCustomApp from './components/CustomApp';
import AddDingdingApp from './components/DingdingApp';
import type { AppListItemType } from './data';
import { changeAppStatus, deleteApp, getAppList, getAppInfo, requestData } from './service';
import mapUrl from '../../../utils/pictureMap';
// const statusMap = {
//   ALL: '全部',
//   ACTIVE: '已启用',
//   INACTIVE: '未启用',
// };

const AppList: React.FC = () => {
  const [keyword, setKeyword] = useState<string>('');
  const actionRef = useRef<ActionType>();
  // const [appInfo, setAppInfo] = useState();
  const [ddDrawer, showDdDrawer] = useState(false);
  const [customDrawer, showCustomDrawer] = useState(false);

  const [classification, setClassification] = useState<any>([]);
  const [pageSize, setPageSize] = useState(10);
  // 启用/禁用应用
  const handleChangeAppStatus = async (app: AppListItemType) => {
    const action = app.status === 'ACTIVE' ? '禁用' : '启用';
    const hide = message.info(`正在${action}`);
    try {
      const result: any = await changeAppStatus(
        { status: app.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' },
        { client_id: app.client_id },
      );
      if (result.error === '0') {
        hide();
        message.success(`${action}成功`);
        actionRef.current?.reloadAndRest?.();
      } else {
        hide();
        message.error(`${action}失败，请重试`);
      }
    } catch (error) {
      message.error('服务器错误，请重试');
    }
  };
  // 删除应用
  const hancleDeleteApp = async (app: AppListItemType) => {
    const { client_id } = app;
    const hide = message.info('正在删除');
    try {
      const result = await deleteApp({ client_id });
      if (result.error === '0') {
        message.success('应用已删除');
        hide();
        actionRef.current?.reloadAndRest?.();
      } else {
        message.error('应用删除失败');
        hide();
      }
    } catch (error) {
      message.error('删除失败，请重试');
    }
  };
  // 添加自定义应用
  const handleAddCustomApp = async (values: any) => {
    message.info(values[0].foo);
  };

  useEffect(() => {
    requestData().then((rs) => {
      setClassification(rs.data);
    });
  }, []);
  // const handleGetAppInfo = async (id: any) => {
  //   if (id) {
  //     await getAppInfo({ client_id: id })
  //       .then(async (res) => {
  //         if (res) {
  //           setAppInfo(res);
  //         }
  //       })
  //       .finally(() => console.log('eeee')
  //       );
  //   }
  // };
  // 列表
  const handleAppClassification = (cust_class: string[]) => {
    if (cust_class) {
      const arrChangeMap = new Map(
        classification.map((value: any) => [value.id, value.category_name]),
      );
      const className: any = [];

      cust_class.slice(0, 3).forEach((forIs: any) => {
        className.push(arrChangeMap.get(forIs));
      });
      return className.join(', ');
    }
    return;
  };

  const columns: ProColumns<AppListItemType>[] = [
    {
      title: '应用名称',
      dataIndex: 'client_name',
      width: '20%',
      render: (_, record: AppListItemType) => (
        <>
          {record?.link_client_id ? (
            <a
              href="#"
              onClick={() => {
                getAppInfo({ client_id: record.client_id }).then((rs) => {
                  if (rs.link_client_id) {
                    history.push({
                      pathname: '/apps/TemplateConfig',
                      query: {
                        client_id: rs.client_id,
                      },
                    });
                  } else {
                    history.push(`/apps/list/appEdit?id=${record.client_id}`);
                  }
                });
              }}
            >
              <Space>
                {record.logo_uri ? (
                  <Avatar src={record.logo_uri} shape="square" />
                ) : (
                  <Avatar
                    src={
                      mapUrl.get(record.client_id)
                        ? `/uc/images/logo/${mapUrl.get(record.client_id)}`
                        : mapUrl.get(record.link_client_id)
                        ? `/uc/images/logo/${mapUrl.get(record.link_client_id)}`
                        : `/uc/images/web.png`
                    }
                    shape="square"
                  />
                )}
                {record.client_name}
              </Space>
            </a>
          ) : (
            <a onClick={() => history.push(`/apps/list/appEdit?id=${record.client_id}`)}>
              <Space>
                {record.logo_uri ? (
                  <Avatar src={record.logo_uri} shape="square" />
                ) : (
                  <Avatar
                    src={
                      mapUrl.get(record.client_id)
                        ? `/uc/images/logo/${mapUrl.get(record.client_id)}`
                        : mapUrl.get(record.link_client_id)
                        ? `/uc/images/logo/${mapUrl.get(record.link_client_id)}`
                        : `/uc/images/web.png`
                    }
                    shape="square"
                  />
                )}
                {record.client_name}
              </Space>
            </a>
          )}
        </>
      ),
    },

    {
      title: '应用来源',
      dataIndex: 'app_src',
      hideInSearch: true,
      width: '20%',
      render: (_, record: AppListItemType) => (record.app_src ? record.app_src : '自定义'),
    },

    {
      title: '应用集成',
      dataIndex: 'auth_protocol',
      width: '17%',
      hideInSearch: true,
      render: (_, record: AppListItemType) => {
        if (record.auth_protocol == 'APPSTORE') {
          return '非标协议';
        }
        return record.auth_protocol ? record.auth_protocol : '未启用';
      },
    },
    {
      title: '应用分类',
      dataIndex: 'custom_class',
      width: '17%',
      hideInSearch: true,
      render: (_, record: AppListItemType) => {
        return handleAppClassification(record.custom_class);
      },
    },
    // {
    //   title: '更新时间',
    //   dataIndex: 'update_time',
    //   hideInSearch: true,
    //   render: (_, record: AppListItemType) =>
    //     record.update_time ? moment(record.update_time * 1000).format('YYYY-MM-DD HH:mm:ss') : '-',
    // },

    {
      title: '状态',
      dataIndex: 'status',
      hideInSearch: true,
      width: '10%',
      render: (_, record: AppListItemType) =>
        record.status == 'ACTIVE' ? '启用' : record.status == 'INACTIVE' ? '未启用' : '删除',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      align: 'center',
      width: '20%',
      render: (_, record: AppListItemType) =>
        record.tenant_owner !== 'iam'
          ? [
              <Button
                key="EDIT"
                type="link"
                onClick={() => {
                  getAppInfo({ client_id: record.client_id }).then((rs) => {
                    if (rs.link_client_id) {
                      history.push({
                        pathname: '/apps/TemplateConfig',
                        query: {
                          client_id: rs.client_id,
                        },
                      });
                    } else {
                      history.push(`/apps/list/appEdit?id=${record.client_id}`);
                    }
                  });
                }}
              >
                编辑
              </Button>,
              <Button key="ENABLE" type="link" onClick={() => handleChangeAppStatus(record)}>
                {record.status === 'ACTIVE' ? '禁用' : '启用'}
              </Button>,
              <Popconfirm
                key="DELETE"
                placement="topRight"
                title={() => (
                  <>
                    <h4>确定要删除所选应用吗？</h4>
                    <p style={{ color: '#f00' }}>
                      应用删除后相关功能失效，删除操作不可恢复，请谨慎操作！
                    </p>
                  </>
                )}
                onConfirm={() => hancleDeleteApp(record)}
                okText="确定删除"
                cancelText="取消"
              >
                <Button type="link">删除</Button>
              </Popconfirm>,
            ]
          : [
              <Button key="ENABLE" type="link" onClick={() => {}}>
                查看
              </Button>,
            ],
    },
  ];
  const onPageSize = (_value, pageSizeValue) => {
    setPageSize(pageSizeValue);
  };
  // 点击添加应用菜单
  const handleMenuClick = (e: any) => {
    if (e.key === 'DINGDING') {
      showDdDrawer(true);
    }
    if (e.key === 'CUSTOM') {
      showCustomDrawer(true);
      history.push(`/apps/appAdd`);
    }
    if (e.key === 'MARKET') {
      // showCustomDrawer(true);
      history.push(`/apps/applicMaket`);
    }
  };
  // 添加应用菜单选项
  // const actionsMenu = (
  //    <Menu onClick={handleMenuClick}>
  //       <Menu.Item key="DINGDING" icon={<DingdingOutlined />}>
  //          钉钉应用
  //       </Menu.Item>
  //       <Menu.Item key="CUSTOM" icon={<BorderOuterOutlined />}>
  //          自定义应用
  //       </Menu.Item>
  //       <Menu.Item key="MARKET" icon={<TrademarkCircleOutlined />}>
  //          应用市场
  //       </Menu.Item>
  //    </Menu>
  // );

  const items = [
    {
      key: 'DINGDING',
      label: (
        <>
          <DingdingOutlined style={{ marginRight: 10 }} />
          钉钉应用
        </>
      ),
    },
    {
      key: 'MARKET',
      label: (
        <>
          <TrademarkCircleOutlined style={{ marginRight: 10 }} />
          应用市场
        </>
      ),
    },
    {
      key: 'CUSTOM',
      label: (
        <>
          <BorderOuterOutlined style={{ marginRight: 10 }} />
          自定义应用
        </>
      ),
    },
  ];

  return (
    <PageContainer title={false}>
      {/* {classification.length ? ( */}
      <ProTable<AppListItemType, TableListPagination>
        headerTitle="应用列表"
        className="minHeight"
        actionRef={actionRef}
        rowKey="client_id"
        search={false}
        options={false}
        toolBarRender={() => [
          <Dropdown
            key="DROPDOWN"
            menu={{ items, onClick: handleMenuClick }}
            placement="bottom"
            arrow
          >
            <Button type="primary">
              <PlusOutlined />
              添加应用 <DownOutlined />
            </Button>
          </Dropdown>,
        ]}
        toolbar={{
          search: {
            onSearch: (value: string) => {
              setKeyword(value);
              actionRef.current?.reloadAndRest?.();
            },
            style: {
              width: '300px',
            },
            placeholder: '请输入应用名称或者应用ClientID',
            allowClear: true,
          },
        }}
        request={async (pagination) => {
          const params: any = {
            size: pagination.pageSize,
            page: pagination.current,
          };
          if (keyword) {
            params.filter = keyword;
          }
          const result: any = await getAppList(params);
          return result;
        }}
        columns={columns}
        pagination={{ pageSize, showSizeChanger: true, onChange: onPageSize }}
      />
      {ddDrawer ? (
        <AddDingdingApp
          onClose={() => showDdDrawer(false)}
          afterSubmit={() => {
            actionRef.current?.reloadAndRest?.();
          }}
          drawerVisible={ddDrawer}
        />
      ) : null}
      {customDrawer ? (
        <AddCustomApp
          onClose={() => showCustomDrawer(false)}
          onSubmit={(values: any) => handleAddCustomApp(values)}
          drawerVisible={customDrawer}
        />
      ) : null}
    </PageContainer>
  );
};
export default AppList;
