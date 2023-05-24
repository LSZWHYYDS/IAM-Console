import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Tabs } from 'antd';
import { Link } from 'react-router-dom';
import type { ProColumns } from '@ant-design/pro-table';
import { t } from '@/utils/common.utils';
import TableData from './TableData';
import { getMessages, getMessagesSendings } from './service';

const TabPane = Tabs.TabPane;

const NewsList: React.FC = () => {
  const [tabkey, setTabkey] = useState('1');
  const columns: ProColumns<any>[] = [
    {
      title: '发送时间',
      dataIndex: 'sendTime',
      key: 'sendTime',
    },
    {
      title: '消息标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '消息内容',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
    },
    {
      title: '消息类型',
      dataIndex: 'type',
      key: 'type',
      render: (text: any) => {
        const map = {
          0: t('news.text'),
          1: t('news.link'),
          2: t('news.image'),
          3: t('news.voice'),
          4: t('news.file'),
          5: t('news.card'),
          100: t('news.work'),
        };
        return map[text];
      },
    },
    {
      title: '通知类型',
      dataIndex: 'bizType',
      key: 'bizType',
      render: (text: any) => {
        const map = {
          0: t('news.workNotice'),
          1: '待办',
        };
        return map[text];
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text: any) => {
        const map = {
          0: t('news.untreated'),
          1: t('news.processing'),
          2: t('news.finished'),
          3: t('news.fail'),
        };
        return map[text];
      },
    },
    {
      title: '操作',
      render: (text, record) => {
        return (
          <div className="table-action">
            <Link
              to={{
                pathname: `/newsList/newsList/newsDetail`,
                search: `?id=` + record.id + `&t=` + tabkey,
              }}
            >
              <span className="text-col1" title="查看">
                查看
              </span>
            </Link>
          </div>
        );
      },
    },
  ];
  const onTabChange = (tabKey: string) => {
    setTabkey(tabKey);
  };
  return (
    <PageContainer title={false}>
      <Card>
        <Tabs defaultActiveKey="1" style={{ padding: '0 20px' }} onChange={onTabChange}>
          <TabPane tab="已发送" key="1">
            <TableData columns={columns} apiFunc={getMessages} hasExport={false} />
          </TabPane>
          <TabPane tab="处理中" key="2">
            <TableData columns={columns} apiFunc={getMessagesSendings} hasExport={false} />
          </TabPane>
        </Tabs>
      </Card>
    </PageContainer>
  );
};
export default NewsList;
