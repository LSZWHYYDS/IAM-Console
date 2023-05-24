// /* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Row, Card, Popconfirm, Col, Button } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import SearchBox from '@/components/SearchBox/index';
import ProTable from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table';
import type { ActionType } from '@ant-design/pro-table';
import { PushDetail } from './PushDetail/index';
import Push from './Push/index';
import { history } from 'umi';
import { getPoliciesList, deletePolicy, changeStatus } from './service';
import { ContactsOutlined } from '@ant-design/icons';

const PolicyCenterPage: React.FC = () => {
  const path = window.location.pathname;
  const path_one = path.replaceAll('/uc', '');
  const subType =
    ((path_one === '/policy/appPolicy' || path_one === '/policy/appPolicy/') && 'APP_CONFIG') ||
    'DEVICE_ACCESS_CONFIG';
  const policyTableRef = useRef<ActionType>();
  const pushDetailRef = useRef<any>(null);
  const [searchParams, setSearchParams] = useState({ name: undefined });
  const [policyId, setPolicyId] = useState(null);
  const [pushDialogVisible, setPushDialogVisible] = useState(false);
  const [pageSize, setPageSize] = useState(10);

  const refreshTablePolicy = () => {
    if (policyTableRef.current) {
      policyTableRef.current.reload();
    }
  };
  useEffect(() => {
    refreshTablePolicy();
  }, [searchParams]);

  const onDeletePolicy = (policyId1: string) => {
    deletePolicy(policyId1).then((response) => {
      if (response.code === '0') {
        refreshTablePolicy();
      }
    });
  };
  const toggleActive = (entry: { id: any }, status: any) => {
    const params = { policyIds: [entry.id], status };
    changeStatus(params).then((res) => {
      if (res.code === '0') {
        refreshTablePolicy();
      }
    });
  };
  const openDrawer = (entry: any) => {
    if (pushDetailRef.current) {
      pushDetailRef.current.onOpen(entry);
    }
  };
  const pushDialogShow = (entry: any) => {
    setPolicyId(entry.id);
    setPushDialogVisible(true);
  };
  const onRenderAction = (text: any, record: any) => {
    const enableBtn = (
      <a className="text-col1" title="启用" onClick={() => toggleActive(record, 'ENABLED')}>
        启用
      </a>
    );
    const disableBtn = (
      <a className="text-col1" title="禁用" onClick={() => toggleActive(record, 'DISABLED')}>
        禁用
      </a>
    );
    return (
      <div className="table-action">
        <a title="生效范围" onClick={() => openDrawer(record)}>
          生效范围
        </a>
        <Link
          className="detail-link"
          to={{
            pathname: `${path_one}/editPolicy`,
            search: `?id=${record.id}`,
          }}
        >
          <span className="text-col1" title="编辑">
            编辑
          </span>
        </Link>

        <Popconfirm
          title="确定要删除吗？"
          okText="确定"
          cancelText="取消"
          onConfirm={() => onDeletePolicy(record.id)}
        >
          <a title="删除">删除</a>
        </Popconfirm>
        {record.status === 'ENABLED' ? disableBtn : enableBtn}
        <a
          title="下发"
          onClick={() => {
            pushDialogShow(record);
          }}
        >
          下发
        </a>
      </div>
    );
  };
  const cols: ProColumns<any>[] = [
    {
      title: '策略名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text) => (text === 'ENABLED' ? '已启用' : '已禁用'),
    },
    {
      title: '创建人',
      dataIndex: 'createBy',
      key: 'createBy',
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: onRenderAction,
    },
  ];
  const handleSearch = (searchKey: any) => {
    setSearchParams({
      ...searchParams,
      name: searchKey,
    });
  };
  const onClosePushDlg = () => {
    setPushDialogVisible(false);
  };
  const newCreated = () => {
    // /policy/appPolicy/editPolicy  策略
    // /policy/deviceAdmitPolicy/editPolicy设备
    if (['/policy/appPolicy', '/policy/appPolicy/'].includes(path_one)) {
      history.push({
        pathname: `/policy/appPolicy/editPolicy`,
        search: `?subCategory=${subType}`,
      });
    } else {
      history.push({
        pathname: `/policy/deviceAdmitPolicy/editPolicy`,
        search: `?subCategory=${subType}`,
      });
    }
  };
  const onPageSize = (_value, pageSizeValue) => {
    setPageSize(pageSizeValue);
  };
  return (
    <PageContainer title={false}>
      <Card>
        <Row>
          <Col offset={16} span={6}>
            <SearchBox
              placeholder="请输入策略名称"
              showClear={true}
              defaultSearchKey={searchParams && searchParams.name}
              onSearch={handleSearch}
            />
          </Col>
          <Col style={{ paddingLeft: 10, paddingRight: 20 }} span={2}>
            {/* <Link
                     className="detail-link"
                     to={{
                        pathname: `/policy/${path_one}/editPolicy`,
                        search: `?subCategory=${subType}`,
                     }}
                  > */}
            <Button
              type="primary"
              icon={<ContactsOutlined />}
              className="detail-link"
              onClick={newCreated}
            >
              新建
            </Button>
            {/* </Link> */}
          </Col>
        </Row>
        <ProTable
          actionRef={policyTableRef}
          rowKey="id"
          className="minHeight"
          search={false}
          options={false}
          request={async (params: { pageSize: number; current: number }) => {
            const result = await getPoliciesList(subType, {
              ...searchParams,
              page: params.current,
              size: params.pageSize,
            });
            return {
              data: result.data.items,
              success: true,
              total: result.data.total,
            };
          }}
          columns={cols}
          pagination={{ pageSize, showSizeChanger: true, onChange: onPageSize }}
        />
      </Card>
      <Push policyId={policyId} pushDialogShow={pushDialogVisible} onCloseDlg={onClosePushDlg} />
      <PushDetail ref={pushDetailRef} />
    </PageContainer>
  );
};

export default PolicyCenterPage;
