import React, { useRef, useState, forwardRef, useEffect } from 'react';
import { Avatar, Table, Space, Button, Select, Modal, Input, Form, Row, Col, message } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import { EditOutlined, FolderAddTwoTone, DeleteTwoTone, UserOutlined } from '@ant-design/icons';
import type { AppListItemType, TableListPagination, VerifyRef } from './data';
import PopupWindowListCom from './components/ListComponent/index';
import ChangePopup from './components/ChangePopup/index';
import DeletePopup from './components/DeletePopup/index';
import moment from 'moment';
import {
  getAppList,
  getUserClassification,
  addApplicationClassific,
  deleteApplication,
} from './servers';
const ForwardTransCom: React.FC<any> = forwardRef((props, ref: any) => {
  return <PopupWindowListCom ref={ref} {...props} />;
});

const Index: React.FC<any> = () => {
  const { Option } = Select;
  const actionRef = useRef<ActionType>(null);
  const PopupComRef = useRef<VerifyRef>();
  const [cities, setCities] = useState<any>([]);
  const [visible, setVisible] = useState(false);
  const [visible_delete, setVisible_delete] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [, setSelectValue] = useState<any>();
  const [visible_add, setVisible_add] = useState<boolean>(false);
  const [confirmLoading_add, setConfirmLoading_add] = useState<boolean>(false);
  const [confirmLoading_delete, setConfirmLoading_delete] = useState<boolean>(false);
  const [popupRadio, setPopupRadio] = useState('');
  const [popupDeleteRadio, setPopupDeleteRadio] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [params, setParams] = useState<any>({ category_id: '' });
  const [selectIdArr, setSelectIdArr] = useState<any>([]);
  const [refreshs, setRefreshs] = useState(false);
  const [isAddClass, setIsAddClass] = useState(true);
  // const [isDeleteApp, setIsDeleteApp] = useState(true)
  useEffect(() => {
    if (refreshs) {
      setTimeout(() => setRefreshs(false));
    }
  }, [refreshs]);
  useEffect(() => {
    // 获取下拉框值
    getUserClassification().then((rs) => {
      const temporaryArr: any = [];
      rs.data.reduce((preTotal: any, items: any) => {
        temporaryArr.push(items);
      }, []);
      setCities(temporaryArr.concat({ category_name: '全部分类', id: 0 }));
    });
  }, []);
  const againRequest = () => {
    getUserClassification().then((rs) => {
      const temporaryArr: any = [];
      rs.data.reduce((preTotal: any, items: any) => {
        temporaryArr.push(items);
      }, []);
      setCities(temporaryArr.concat({ category_name: '全部分类', id: 0 }));
    });
  };
  const doRefresh = () => {
    setRefreshs(true);
    againRequest();
  };
  const onSecondCityChange = (value: any) => {
    if (value) {
      if (JSON.parse(value).id) {
        setSelectValue(JSON.parse(value).id);
        setParams({ category_id: JSON.parse(value).id });
      } else {
        setParams({ category_id: '' });
      }
      actionRef!.current!.clearSelected?.();
    }
  };
  // 模态框的确定事件
  const handleOk = () => {
    setConfirmLoading(true);
    setVisible(false);
    setConfirmLoading(false);
    setInputValue('');
    doRefresh();
  };
  // 模态框的打开事件
  const showModal = () => {
    setVisible(true);
    PopupComRef?.current?.againRequest();
  };
  // 模态框的取消事件
  const handleCancel = () => {
    setVisible(false);
    setInputValue('');
    doRefresh();
  };
  // 选中某一行数据
  const handleRowSelect = (keys: any, row: any) => {
    const tempIdArr: any = [];
    row.forEach((is: any) => {
      tempIdArr.push(is.client_id);
    });
    setSelectIdArr(tempIdArr);
    if (row.length) setIsAddClass(false);
    else setIsAddClass(true);
  };
  // 添加分类
  const handleAddClassIfication = () => {
    setVisible_add(true);
  };
  // 列表
  const columns: ProColumns<AppListItemType>[] = [
    {
      title: '应用名称',
      dataIndex: 'client_name',
      render: (_, record: AppListItemType) => (
        <a href="#">
          <Space>
            {record.logo_uri ? (
              <Avatar src={record.logo_uri} shape="square" />
            ) : (
              record.application_type && (
                <Avatar
                  src={`/images/${record.application_type.toLowerCase()}.png`}
                  shape="square"
                />
              )
            )}
            {record.client_name}
          </Space>
        </a>
      ),
    },
    {
      title: '应用来源',
      dataIndex: 'app_src',
      hideInSearch: true,
      width: '15%',
      render: (_, record: AppListItemType) => (record.app_src ? record.app_src : '自定义'),
    },

    {
      title: '创建时间',
      dataIndex: 'update_time',
      hideInSearch: true,
      render: (_, record: AppListItemType) =>
        record.update_time ? moment(record.update_time * 1000).format('YYYY-MM-DD HH:mm:ss') : '-',
    },
    {
      title: '应用集成',
      dataIndex: 'auth_protocol',
      hideInSearch: true,
      render: (_, record: AppListItemType) =>
        record.auth_protocol ? record.auth_protocol : '未指定',
    },
    {
      title: '状态',
      dataIndex: 'status',
      hideInSearch: true,
      render: (_, record: AppListItemType) =>
        record.status === 'ACTIVE' ? <span style={{ color: '#909090' }}>已禁用</span> : '已启用',
    },
  ];
  // 创建分组事件
  const createClassIfication = () => {
    if (inputValue) {
      PopupComRef?.current?.updateClassList(inputValue);
    } else {
      message.error('不能为空');
    }
  };
  // 添加分类的弹窗(确定事件)
  const handleOk_add = () => {
    // selectIdArr 选中的所有ID数组  popupRadio 选中的分类ID
    const requestArr: any = [];
    selectIdArr.forEach((is: any) => {
      requestArr.push({
        category_id: popupRadio,
        client_id: is,
      });
    });
    addApplicationClassific(requestArr).then((rs: any) => {
      if (!Number(rs.error)) {
        message.success('添加成功');
        setConfirmLoading_add(false);
        setVisible_add(false);
        actionRef?.current?.clearSelected?.();
        doRefresh();
      }
    });
  };
  // 添加分类
  const hanldeRadios = (value: any) => {
    setPopupRadio(value);
  };
  // 删除的事件
  const hanldeRadios_delete = (value: any) => {
    setPopupDeleteRadio(value);
  };
  const hanldeDeleteApplication = () => setVisible_delete(true);
  // 删除框的确定按钮
  const handleOk_delete = () => {
    const requestArr: any = [];
    selectIdArr.forEach((is: any) => {
      requestArr.push({
        category_id: popupDeleteRadio,
        client_id: is,
      });
    });
    deleteApplication(requestArr).then((rs: any) => {
      if (!Number(rs.error)) {
        message.success('移除成功');
        setConfirmLoading_delete(false);
        setVisible_delete(false);
        setIsAddClass(true);
        actionRef?.current?.reload();
        doRefresh();
      }
    });
  };
  // 输入框的事件
  const handleChangeEvent = (e: any) => {
    setInputValue(e.target.value);
  };
  const clearInput = () => {
    setInputValue('');
  };
  return (
    <PageContainer title={false}>
      <ProTable<AppListItemType, TableListPagination>
        headerTitle="应用分类"
        actionRef={actionRef}
        rowKey="client_id"
        search={false}
        options={false}
        params={params}
        request={async (pagination) => {
          const result: any = await getAppList({
            size: pagination.pageSize,
            page: pagination.current,
            category_id: params.category_id,
          });
          return result;
        }}
        columns={columns}
        pagination={{ pageSize: 15 }}
        toolBarRender={() => [
          <Select
            style={{ width: 200, marginRight: '20px' }}
            defaultValue="全部分组"
            onChange={onSecondCityChange}
          >
            {cities.map((city: any) => (
              <Option key={JSON.stringify({ id: city.id, category_name: city.category_name })}>
                {city.category_name}
              </Option>
            ))}
          </Select>,
          <Button type="primary" onClick={showModal}>
            编辑分类
            <EditOutlined />
          </Button>,
        ]}
        rowSelection={{
          selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
          defaultSelectedRowKeys: [1],
          onChange: (keys, rows) => {
            handleRowSelect(keys, rows);
          },
        }}
        tableAlertRender={false}
        toolbar={{
          title: (
            <Space size={[28, 16]}>
              <span>分类应用</span>
              <Button
                type="dashed"
                size={'middle'}
                onClick={handleAddClassIfication}
                disabled={isAddClass}
              >
                加入分类
                <FolderAddTwoTone />
              </Button>
              <Button
                type="dashed"
                size={'middle'}
                onClick={hanldeDeleteApplication}
                disabled={isAddClass}
              >
                移除应用
                <DeleteTwoTone />
              </Button>
            </Space>
          ),
        }}
      />
      <Modal
        title="编辑分组"
        open={visible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        width="750px"
        okText="关闭"
      >
        <Form
          name="basic"
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          autoComplete="off"
        >
          <Form.Item
            label="应用分组"
            // name="username"
            colon={false}
            rules={[{ required: true, message: 'Please input your username!' }]}
          ></Form.Item>
        </Form>
        <Row>
          <Col span={19}>
            <Input
              size="middle"
              placeholder="请填写分组名称"
              prefix={<UserOutlined />}
              value={inputValue}
              onChange={handleChangeEvent}
            />
          </Col>
          <Col span={1}></Col>
          <Col span={4}>
            <Button type="primary" onClick={createClassIfication}>
              创建分组
            </Button>
          </Col>
        </Row>
        <ForwardTransCom ref={PopupComRef} clearHandle={clearInput} />
      </Modal>
      <Modal
        title="加入分类"
        open={visible_add}
        onOk={handleOk_add}
        confirmLoading={confirmLoading_add}
        onCancel={() => {
          setVisible_add(false);
          actionRef?.current?.clearSelected?.();
        }}
        width="600px"
        okText="确定"
        style={{ height: '600px' }}
      >
        <ChangePopup fatherHandleRadio={hanldeRadios} />
      </Modal>
      <Modal
        title="移除分类"
        open={visible_delete}
        onOk={handleOk_delete}
        confirmLoading={confirmLoading_delete}
        onCancel={() => setVisible_delete(false)}
        width="600px"
        style={{ height: '600px' }}
      >
        <DeletePopup fatherDeleteHandleRadio={hanldeRadios_delete} />
      </Modal>
    </PageContainer>
  );
};

export default Index;

/**
 * 函数组件中使用ref调用子组件方法
 * import React, {
      useImperativeHandle,
      forwardRef
    } from 'react';

  const ForwardRef = forwardRef((props, ref) => {

  useImperativeHandle(ref, () => ({
    test,
  }));

  const test = () => {
    console.log('我是ForwardRef组件的test方法')
  }

  return (
    <div>
      ForwardRef组件
    </div>
  )
})

export default ForwardRef;
*/
