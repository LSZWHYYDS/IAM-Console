import { Drawer, Space, Button, Tooltip, Row, Col, Select, Card } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import ProTable from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table';
import type { ActionType } from '@ant-design/pro-table';
import type { Key } from 'antd/es/table/interface';
import { app } from '@/utils/map.js';
import { showErrorMessage, showSuccessMessage } from '@/utils/common.utils';
import { snsList } from '@/pages/EditEnt/service';
import { getDingAppList, addDingApp } from '@/pages/AppCenter/AppList/service';

interface DrawerProps {
  drawerVisible: boolean;
  onClose: (flag?: boolean) => void;
  afterSubmit: () => void;
}

const Option = Select.Option;

const AddDingdingApp: React.FC<DrawerProps> = (props) => {
  const actionRef = useRef<ActionType>();
  const { drawerVisible, onClose: setDrawerVisible, afterSubmit } = props;
  const [optionList, setOptionList] = useState([]);
  const [compId, setCompId] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const getCompanyList = () => {
    snsList().then((response) => {
      setOptionList(response.data.items);
    });
  };
  useEffect(() => {
    getCompanyList();
  }, []);
  const renderImg = (text: string, record: any) => {
    return (
      <Tooltip title={record.homepage_link}>
        <img
          src={record.app_icon || app.getDefaultAppIcon(record.application_type)}
          style={{
            width: '30px',
            height: '30px',
            verticalAlign: 'middle',
            cursor: record.homepage_link && 'pointer',
          }}
        />
      </Tooltip>
    );
  };
  const initTable = () => {
    const cols: ProColumns<any>[] = [
      {
        title: '图标',
        dataIndex: 'app_icon',
        key: 'img',
        width: 80,
        render: renderImg,
      },
      {
        title: '应用名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '应用状态',
        dataIndex: 'app_status',
        key: 'app_status',
        width: 120,
        render: (text: string) => app.getAppStatus(text),
      },
    ];
    return cols;
  };
  const handleChange = (value: string) => {
    setCompId(value);
    actionRef.current?.reload?.();
  };
  const handleRowSelect = async (selectedKeys: Key[], selectedRowsP: any) => {
    setSelectedRowKeys(selectedKeys);
    setSelectedRows(selectedRowsP);
  };
  const onSubmit = () => {
    if (selectedRows.length > 0) {
      const req = {
        sns_id: compId,
        third_party_apps: selectedRows,
      };
      setLoading(true);
      addDingApp(req).then(
        (response) => {
          setLoading(false);
          if (response.data) {
            showSuccessMessage();
            props.onClose();
            afterSubmit();
          }
        },
        (error) => {
          setLoading(false);
          showErrorMessage(error);
        },
      );
    } else {
      showErrorMessage('请先选择应用');
    }
  };
  return (
    <Drawer
      title={'创建钉钉应用'}
      closable={true}
      maskClosable={false}
      width={'600px'}
      open={drawerVisible}
      onClose={() => {
        setDrawerVisible(false);
      }}
      footer={
        <Space>
          <Button onClick={() => setDrawerVisible(false)}>取消</Button>
          <Button type="primary" onClick={onSubmit}>
            保存
          </Button>
        </Space>
      }
      footerStyle={{ display: 'flex', justifyContent: 'flex-end' }}
    >
      <Card bordered={false} loading={loading}>
        <Row>
          <Col span={4}>选择企业</Col>
          <Col span={18}>
            <Select
              placeholder="请选择企业"
              allowClear={true}
              style={{ width: 400 }}
              onChange={handleChange}
            >
              {optionList.length > 0 &&
                optionList.map((item) => (
                  <Option value={item.id} key={item.id}>
                    {item.name}
                  </Option>
                ))}
            </Select>
          </Col>
        </Row>
        <ProTable
          actionRef={actionRef}
          rowKey="agent_id"
          search={false}
          options={false}
          request={async (pagination) => {
            const params: any = {
              size: pagination?.pageSize,
              page: pagination?.current,
              sns_id: compId || '0',
            };
            const result: any = await getDingAppList(params);
            return result;
          }}
          columns={initTable()}
          pagination={{ pageSize: 10 }}
          rowSelection={{
            selectedRowKeys,
            onChange: (keys, rows) => {
              handleRowSelect(keys, rows);
            },
          }}
        />
      </Card>
    </Drawer>
  );
};

export default AddDingdingApp;
