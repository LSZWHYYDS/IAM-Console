import { formatDateTime } from '@/utils/common.utils';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns } from '@ant-design/pro-table';
import { Card, Tabs } from 'antd';
import React from 'react';
import auditUtil from './auditUtil';
import { getDevices, getLog, getDevices_ls, DownloadPicture } from './service';
import TableLog from './TableLog';

const TabPane = Tabs.TabPane;

const LoginLog: React.FC = () => {
  const columns: ProColumns<any>[] = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '用户名',
      dataIndex: 'operator',
      key: 'operator',
    },
    {
      title: '登录时间',
      dataIndex: 'occur_time',
      key: 'occur_time',
      render: (text) => formatDateTime(text),
    },
    {
      title: '来源IP',
      dataIndex: 'src_ip',
      key: 'src_ip',
    },
    {
      title: '来源设备',
      dataIndex: 'src_device_model',
      key: 'src_device_model',
      render: (_, record) => auditUtil.renderDeviceModel(record),
    },
    {
      title: '结果',
      dataIndex: 'error_code',
      key: 'error_code',
      render: (text, record) => {
        if (auditUtil.isSuccess((String(text) && String(text).toString()) || '')) {
          return (
            <span>
              {auditUtil.renderResultForLoginLog(
                (String(text) && String(text).toString()) || ' ',
                record,
                auditUtil.EventSubtype,
              )}
            </span>
          );
        } else {
          return (
            <span>
              {auditUtil.renderResultForLoginLog(
                (String(text) && String(text).toString()) || '',
                record,
                auditUtil.EventSubtype,
              )}
            </span>
          );
        }
      },
    },
  ];
  const pictureFunc = (filePathID: any) => {
    DownloadPicture(filePathID).then((rs) => {
      window.location.href = rs.data;
    });
  };

  const columnsScreenShot: ProColumns<any>[] = [
    {
      title: '姓名',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: '账号',
      dataIndex: 'loginId',
      key: 'loginId',
    },
    {
      title: '部门',
      dataIndex: 'departName',
      key: 'departName',
      width: 200,
      ellipsis: true,
    },
    {
      title: '设备名称',
      dataIndex: 'deviceName',
      key: 'deviceName',
    },
    {
      title: '设备型号',
      dataIndex: 'deviceModel',
      key: 'deviceModel',
    },
    {
      title: '操作时间',
      dataIndex: 'occTime',
      key: 'occTime',
      render: (text) => formatDateTime(text),
    },
    {
      title: '截屏内容',
      dataIndex: 'filePath',
      key: 'filePath',
      render: (text, record) => {
        return (
          <span
            className="text-col1"
            onClick={() => pictureFunc(record.filePath)}
            style={{ cursor: 'pointer' }}
          >
            下载
          </span>
        );
      },
    },
  ];
  return (
    <PageContainer title={false}>
      <Card>
        <Tabs defaultActiveKey="1" style={{ padding: '0 20px' }}>
          <TabPane tab="用户账号行为" key="1">
            <TableLog columns={columns} apiFunc={getLog} hasExport={true} isAuth={false} />
          </TabPane>
          <TabPane tab="用户截屏行为" key="2">
            <TableLog
              columns={columnsScreenShot}
              placeholder="请输入姓名"
              apiFunc={getDevices}
              apiFuncs={getDevices_ls} // 用户截屏接口请求
              isAuth={true}
            />
          </TabPane>
        </Tabs>
      </Card>
    </PageContainer>
  );
};
export default LoginLog;
