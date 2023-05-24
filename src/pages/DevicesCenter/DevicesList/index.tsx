import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Popconfirm, Button, message } from 'antd';
import ProTable from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { getDevicesList, wipeDingtalkData } from '../service';
import type { DeviceType, SortType } from '../data';
import DeviceDetails from './DeviceDetails';

const DevicesList: React.FC = () => {
  const [keyword, setKeyword] = useState<string>('');
  const actionRef = useRef<ActionType>();
  const [showDetails, handleShowDetails] = useState(false);
  const [deviceId, setDeviceId] = useState<string>('');
  const [sorterInfo, setSorterInfo] = useState<SortType>({});

  const handleWipeDingtalkData = async (id: string) => {
    const hide = message.loading('正在清除');
    await wipeDingtalkData({ target: { devices: [id] } })
      .then(async (res) => {
        if (res.code === '0') {
          message.success('清除成功');
        } else {
          message.error('清除失败，请重试');
        }
      })
      .finally(() => hide());
  };

  // 列表
  const columns: ProColumns<DeviceType>[] = [
    {
      title: '系统',
      dataIndex: 'type',
      hideInSearch: true,
      render: (value: string, record) => {
        const osImgs = {
          '1': {
            '0': 'android_green.png',
            '1': 'android_red.png',
          },
          '2': {
            '0': 'ios_blue.png',
            '1': 'ios_red.png',
          },
          '5': {
            '0': 'windows_blue.png',
            '1': 'windows_red.png',
          },
          '7': {
            '0': 'macos_blue.png',
            '1': 'macos_red.png',
          },
        };
        const osImg = osImgs[value] || {};
        return (
          <img
            src={`/uc/images/os/` + (osImg[record.rootFlag] || 'android-green.png')}
            style={{ verticalAlign: 'middle', width: '24px', height: '24px' }}
          />
        );
      },
    },
    {
      title: '姓名',
      dataIndex: 'userName',
      render: (value) => {
        return value || 'sys';
      },
    },
    {
      title: '账号',
      dataIndex: 'loginId',
      hideInSearch: true,
      render: (value) => {
        return value || 'sys';
      },
    },
    {
      title: '设备型号',
      dataIndex: 'model',
      hideInSearch: true,
    },
    {
      // 设备状态需提供枚举值，越狱 Root 正常 风险：设备存在中/高风险项或者整体评分低于80
      title: '设备状态',
      dataIndex: 'rootFlag',
      hideInSearch: true,
      render: (value: any, record) => {
        const status = {
          '1': {
            '0': '正常',
            '1': 'Root',
          },
          '2': {
            '0': '正常',
            '1': '越狱',
          },
          '5': {
            '0': '正常',
            '1': '异常',
          },
          '7': {
            '0': '正常',
            '1': '越狱',
          },
        };
        const os = status[record.type];
        return (os && os[value]) || '--';
      },
    },
    {
      title: '最后上线时间',
      dataIndex: 'lastOnlineTime',
      hideInSearch: true,
      sorter: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record: DeviceType) => [
        <Button
          key="VIEW"
          type="link"
          onClick={() => {
            handleShowDetails(true);
            setDeviceId(record.id);
          }}
        >
          查看详情
        </Button>,
        <Popconfirm
          key="DELETE"
          placement="topRight"
          title={'确定要清除应用数据吗？'}
          onConfirm={() => {
            handleWipeDingtalkData(record.id);
          }}
          okText="确定"
          cancelText="取消"
        >
          <Button type="link">清除应用数据</Button>
        </Popconfirm>,
      ],
    },
  ];
  const onTableChange = (pagination: any, filters: any, sorter: any) => {
    const columnKey = (sorter && sorter.columnKey) || '';
    const { order } = sorter;
    let orderValue = '';
    if (order === 'ascend') {
      orderValue = 'ASC';
    } else if (order === 'descend') {
      orderValue = 'DESC';
    }
    setSorterInfo({
      columnKey: (orderValue && columnKey) || '',
      order: orderValue,
    });
  };
  return (
    <PageContainer title={false}>
      <ProTable
        actionRef={actionRef}
        headerTitle="所有设备"
        className="minHeight"
        rowKey="id"
        search={false}
        options={false}
        request={async (pagination) => {
          let params: any = {
            size: pagination?.pageSize,
            page: pagination?.current,
            sort: sorterInfo && sorterInfo.columnKey,
            order: sorterInfo && sorterInfo.order,
          };

          if (keyword) {
            params = { ...params, q: keyword };
          }

          const result: any = await getDevicesList(params);

          return result;
        }}
        toolBarRender={() => {
          return [<Button key="show">新增设备</Button>];
        }}
        toolbar={{
          title: '所有设备',
          search: {
            onSearch: (value: string) => {
              setKeyword(value);
              actionRef.current?.reloadAndRest?.();
            },
            style: {
              width: '300px',
            },
            placeholder: '请输设备账号名称搜索',
            allowClear: true,
          },
        }}
        columns={columns}
        pagination={{ pageSize: 10 }}
        onChange={onTableChange}
      />
      {showDetails ? (
        <DeviceDetails
          drawerVisible={showDetails}
          onClose={() => {
            handleShowDetails(false);
          }}
          id={deviceId}
        />
      ) : null}
    </PageContainer>
  );
};
export default DevicesList;
