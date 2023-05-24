import React, { useState, useEffect, useRef } from 'react';
import { Button, Avatar, Space, Tag, message, Popconfirm, Table } from 'antd';
import ProTable from '@ant-design/pro-table';
import moment from 'moment';
import {
  getAppVersionsListById,
  pushAppVersion,
  deleteAppVersion,
  getAndroidAppList,
  getAppParseInfo,
  editAppInfo,
} from '@/pages/AppCenter/service';
import type {
  AppType,
  AppListItemType,
  TableListPagination,
  AppVersionType,
} from '@/pages/AppCenter/data';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import UploadApp from '../conponents/UploadApp';
import ConfirmUpload from '../conponents/ConfrimUpload';
import EditAppVersion from '../conponents/EditApp';

const AndroidAppList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [currentApp, setCurrentApp] = useState<AppListItemType>();
  const [currentAppVersion, setCurrentAppVersion] = useState<Partial<AppType>>({});
  const [currentRowKeys, setCurrentRowKeys] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [appList, setAppList] = useState<AppListItemType[]>([]);
  const [confirmUploadModalVisiblels, setConfirmUploadModalVisiblels] = useState(false);
  const [appVerionInfo, setAppVersionInfo] = useState<AppVersionType>({});
  const [appVersionId, setAppVersionId] = useState<string>('');
  const [appEditVisible, setAppEditVisible] = useState(false);
  const [controlSontableRefresh, setControlSontableRefresh] = useState<any>(0);
  const [subList, setSubList] = useState([]);
  const [expandeId, setExpandeId] = useState<any>(0);

  // 加载应用列表
  const handleGetAppList = async () => {
    setLoading(true);
    await getAndroidAppList()
      .then(async (res) => {
        if (res.code === '0') {
          setAppList(res.data);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const getAppVersionsList = async (id: string) => {
    setLoading(true);
    const dataList = await getAppVersionsListById({ id });
    setLoading(false);
    setSubList(dataList.data || []);
  };
  useEffect(() => {
    handleGetAppList();
  }, []);

  // 上架/下架应用
  const handlePushVersion = async (id: any) => {
    const action = controlSontableRefresh ? '下架' : '上架';
    const actionReverse = controlSontableRefresh ? 0 : 1;
    const hide = message.loading(`正在${action}`);
    await pushAppVersion({ id, status: actionReverse })
      .then(async (res) => {
        if (res.code === '0') {
          hide();
          message.success(`${action}成功`);
          await handleGetAppList();
          await getAppVersionsList(expandeId);
          actionRef.current?.reloadAndRest?.();
        } else {
          hide();
          message.error(`${action}失败，请重试`);
        }
      })
      .finally();
  };

  // 删除版本
  const handleDeleteVersion = async (id: string) => {
    const hide = message.loading(`正在删除`);
    await deleteAppVersion({ id })
      .then(async (res) => {
        if (res.code === '0') {
          hide();
          message.success(`删除成功`);
          await handleGetAppList();
          await getAppVersionsList(expandeId);
          actionRef.current?.reloadAndRest?.();
        } else {
          hide();
          message.error(`删除失败，请重试`);
        }
      })
      .finally();
  };

  // 切换展开 row key
  const changeRowsKey = (expanded: boolean, record: AppListItemType) => {
    const temp: any = [];
    if (expanded) {
      temp.push(record.id);
    }
    setCurrentApp(record);
    setCurrentRowKeys(temp);
    setExpandeId(record.id);
    getAppVersionsList(record.id);
  };

  // 获取上传应用的信息
  const handleGetUploadedAppInfo = async (id: string) => {
    await getAppParseInfo({ id }).then(async (res) => {
      if (res.code == '0') {
        setConfirmUploadModalVisiblels(true);
        setAppVersionInfo(res.data.app);
        setAppVersionId(id);
      } else {
        message.error('系统内部错误，请重试上传');
      }
    });
  };

  // 编辑应用信息
  const handleSaveAppVersion = async (fields: any, actionType: string) => {
    let appFields = {};
    const hide = message.loading(`正在${actionType === 'save' ? '上传' : '更新'}`);
    if (actionType === 'save') {
      appFields = { ...fields, platform: 'ANDROID', fileId: appVersionId };
    } else {
      appFields = fields;
    }
    try {
      const result = await editAppInfo(appFields);
      if (result.code === '0') {
        hide();
        if (actionType === 'save') {
          message.success('应用上传成功！');
        } else {
          message.success('应用保存成功！');
        }
        setAppVersionId('');
        handleGetAppList();
        actionRef.current?.reloadAndRest?.();
        return true;
      }
      hide();
      message.error('保存应用失败，请重试！');
      return false;
    } catch (error) {
      return false;
    }
  };

  // 列表 1上架 0 下架
  const columns: ProColumns<AppListItemType>[] = [
    {
      title: '应用名',
      dataIndex: 'name',
      render: (_, record) => (
        <Space>
          <Avatar shape="square" src={record.icon} />
          {record.appName}
        </Space>
      ),
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      hideInSearch: true,
      render: (_, record: AppListItemType) =>
        moment(record?.updateTime).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '状态',
      dataIndex: 'status',
      hideInSearch: true,
      render: (_, record) =>
        record.status ? <Tag color="success">已上架</Tag> : <Tag color="default">未上架</Tag>,
    },
  ];

  // 展开列表
  const expandColumns = [
    {
      title: '应用版本',
      dataIndex: 'version',
      key: 'version',
    },
    {
      title: '应用大小',
      dataIndex: 'size',
      key: 'size',
      render: (_, appVersion: AppType) =>
        appVersion.size ? `${Math.round(appVersion.size / 1024 / 1024)}MB` : '--',
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      valueType: 'option',
      render: (_, appVersion) => {
        return [
          <Popconfirm
            placement="topRight"
            key={appVersion.status}
            title={`您当前${controlSontableRefresh ? '下架' : '上架'}的是【${
              currentApp?.appName
            }】客户端，版本号是：${appVersion.version}。`}
            onConfirm={() => {
              setControlSontableRefresh((state: any) => {
                return !state;
              });
              handlePushVersion(appVersion.id);
            }}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link">{controlSontableRefresh ? '下架' : '上架'}</Button>
          </Popconfirm>,
          <Popconfirm
            placement="topRight"
            key="Delete"
            title={`您当前要删除的的是【${currentApp?.appName}】客户端，版本号是：${appVersion.version}。`}
            onConfirm={() => {
              if (!controlSontableRefresh) {
                handleDeleteVersion(appVersion.id);
              } else {
                message.warning('请将该应用下架后再进行删除');
              }
            }}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link">删除</Button>
          </Popconfirm>,
          <Button
            type="link"
            key="Edit"
            onClick={() => {
              if (!controlSontableRefresh) {
                setCurrentAppVersion(appVersion);
                setAppEditVisible(true);
              } else {
                message.warning('请将该应用下架后再进行编辑');
              }
            }}
          >
            编辑
          </Button>,
        ];
      },
    },
  ];

  // 列表展开设置
  const expandedRowRender = () => {
    return (
      <Table
        key={Math.random() * 10}
        rowKey="appId"
        columns={expandColumns}
        pagination={false}
        dataSource={subList}
      />
    );
  };

  return (
    <>
      <ProTable<AppListItemType, TableListPagination>
        headerTitle="应用列表"
        rowKey="id"
        className="minHeight"
        actionRef={actionRef}
        search={false}
        options={false}
        pagination={false}
        loading={loading}
        dataSource={appList}
        expandable={{
          indentSize: 0,
          expandedRowRender: (record) => {
            setControlSontableRefresh(record.status);
            return expandedRowRender();
          },
        }}
        expandedRowKeys={currentRowKeys}
        onExpand={(expanded, record) => changeRowsKey(expanded, record)}
        toolBarRender={() => [
          <UploadApp platformName="ANDROID" onFinished={(id) => handleGetUploadedAppInfo(id)} />,
        ]}
        columns={columns}
      />
      <ConfirmUpload
        appVersionInfo={appVerionInfo}
        platformName="ANDROID"
        confirmModalVisible={confirmUploadModalVisiblels}
        onCancel={() => {
          setConfirmUploadModalVisiblels(false);
          setAppVersionInfo({});
        }}
        onSubmit={async (value) => {
          const success = await handleSaveAppVersion(value, 'save');
          if (success) {
            setConfirmUploadModalVisiblels(false);
            setAppVersionInfo({});
          }
        }}
      />
      {currentAppVersion && currentAppVersion.id ? (
        <EditAppVersion
          platformName="ANDROID"
          currentAppVersion={currentAppVersion}
          onSubmit={async (fields) => {
            const success = await handleSaveAppVersion(fields, 'update');
            if (success) {
              setAppEditVisible(false);
              setCurrentAppVersion({});
            }
          }}
          onClose={() => {
            setAppEditVisible(true);
            setCurrentAppVersion({});
          }}
          showEditDrawer={appEditVisible}
        />
      ) : null}
    </>
  );
};

export default AndroidAppList;
