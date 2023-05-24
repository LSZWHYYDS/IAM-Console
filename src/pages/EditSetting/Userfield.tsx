import React, { useState, useRef } from 'react';
import { Button, Checkbox, Input, message, Popover, Radio, RadioChangeEvent, Space } from 'antd';
import DeleteModalCom from './components/ModelCom';
import CustomVaildtorCom from './components/CustomVaildtorDrawer';

import { getTotalUserInfo, deleteUserInfo } from './service';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { PlusOutlined } from '@ant-design/icons';
import { useStateCallback } from '@/utils/common.utils';
let content;
const Index: React.FC = () => {
  const tableRef = useRef<any>(null);
  const [pageSize, setPageSize] = useState(10);
  const [visible_delete, setVisible_delete] = useState<boolean>(false);
  const [keyID, setKeyId] = useState<string>('');
  const [visibleDrawer, setVisibleDrawer] = useState<boolean>(false);
  const [tableId, setTableId] = useState<any>();
  const [currentRow, setCurrentRow] = useState<any>({});
  const [range, setRange] = useStateCallback('all');
  const [mandatory, setMandatory] = useStateCallback('all');
  const [saveSeach, setSaveSearch] = useStateCallback('');
  const resetScreenCondition = () => {
    setRange('all');
    setMandatory('all');
    tableRef.current?.reloadAndRest?.();
  };
  const text = (
    <div style={{ display: 'flex' }}>
      <h3>筛选</h3>
      <Button size="small" style={{ marginLeft: 10, marginTop: 2 }} onClick={resetScreenCondition}>
        重置
      </Button>
    </div>
  );
  const onRangeChanges = ({ target: { value } }: RadioChangeEvent) => {
    setRange(value, () => {
      tableRef.current?.reloadAndRest?.();
    });
  };
  const onMandatoryChanges = ({ target: { value } }: RadioChangeEvent) => {
    setMandatory(value, () => {
      tableRef.current?.reloadAndRest?.();
    });
  };

  content = (
    <div>
      <div>
        <span style={{ marginRight: 10 }}>属性类型:</span>
        <Radio.Group
          options={[
            {
              label: '所有',
              value: 'all',
            },
            {
              label: '基础属性',
              value: 'base',
            },
            {
              label: '扩展属性',
              value: 'custom',
            },
          ]}
          value={range}
          onChange={onRangeChanges}
        />
      </div>
      <div style={{ marginTop: 10 }}>
        <span style={{ marginRight: 10 }}>是否必填:</span>
        <Radio.Group
          options={[
            {
              label: '全部',
              value: 'all',
            },
            {
              label: '是',
              value: 'mandatoryTrue',
            },
            {
              label: '否',
              value: 'mandatoryFalse',
            },
          ]}
          value={mandatory}
          onChange={onMandatoryChanges}
        />
      </div>
    </div>
  );

  /**
   * 请求用户自定义字段
   */
  const requestCustomeInfo = () => tableRef.current?.reloadAndRest?.();

  // 自定义字段表格中的编辑事件
  const handleCustVaildtorFunc = (row: any) => {
    setCurrentRow(row);
    setVisibleDrawer(true);
  };
  const onPageSize = (_value, pageSizeValue) => {
    setPageSize(pageSizeValue);
  };
  // 自定义字段表格的删除事件
  const handleDelete = (key: string) => {
    setVisible_delete(true); // 先让其显示二次确认框
    setKeyId(key); // 把选中的ID存起来
  };

  // two表格的Columns
  const columnsTwo: any = [
    {
      title: '全局名称',
      dataIndex: 'domain_name',
      width: 300,
    },
    {
      title: '属性名称',
      dataIndex: 'display_name',
      width: 300,
    },
    {
      title: '数据类型',
      dataIndex: 'data_type',
      width: 300,
      render: (_, record) => {
        const obj = {
          INT: '数字',
          STRING: '字符串',
          DATETIME: '时间',
          LONG: '整型',
          BOOL: '布尔',
          ENUM: '枚举',
          UNIXTIME: '时间戳',
        };
        return <>{obj[record.data_type]}</>;
      },
    },
    {
      title: '属性类型',
      dataIndex: 'data_type',
      width: 300,
      render: (_, record) => {
        return <>{record.basic_attribute ? '基础属性' : '扩展属性'}</>;
      },
    },
    {
      title: '是否必填',
      dataIndex: 'mandatory',
      width: 200,
      render: (_, record) => {
        return (
          <>
            <Checkbox checked={record.mandatory} disabled />
          </>
        );
      },
    },
    // {
    //    title: '是否作为查询条件',
    //    dataIndex: 'searchable',
    //    width: 200,
    //    render: (value) => {
    //       return (
    //          <>
    //             <Checkbox checked={value} disabled />
    //          </>
    //       );
    //    },
    // },
    // {
    //    title: '是否作为映射关系',
    //    dataIndex: 'as_import',
    //    width: 200,
    //    render: (value) => {
    //       return (
    //          <>
    //             <Checkbox checked={value} disabled />
    //          </>
    //       );
    //    },
    // },
    // {
    //    title: '是否作为用户画像属性',
    //    dataIndex: 'as_profile',
    //    width: 200,
    //    render: (value) => {
    //       return (
    //          <>
    //             <Checkbox checked={value} disabled />
    //          </>
    //       );
    //    },
    // },
    {
      title: '操作',
      width: 300,
      render: (_, record) => {
        return (
          <Space>
            <Button
              type="link"
              style={{ color: '#008DFF', fontWeight: '400' }}
              onClick={() => handleCustVaildtorFunc(record)}
            >
              编辑
            </Button>
            <Button
              type="link"
              style={{
                color: record.basic_attribute ? 'rgb(188 195 200)' : '#008DFF',
                fontWeight: '400',
              }}
              onClick={() => handleDelete(record.domain_name)}
              disabled={record.basic_attribute ? true : false}
            >
              删除
            </Button>
          </Space>
        );
      },
    },
  ];

  // 打开新增字段的抽屉框
  const openDrawer = () => {
    setVisibleDrawer(true);
    setCurrentRow({});
  };
  // 确认框的事件
  const ModalConfimFunc = () => {
    setVisible_delete(false);
    // 发送接口带上keyID   keyID是自定义字段选中的行ID   keyId: string
    deleteUserInfo(keyID).then(() => {
      tableRef.current?.reloadAndRest?.();
      message.success('删除成功');
    });
  };
  // 确认框的取消事件
  const ModalCancleFunc = () => {
    setVisible_delete(false);
  };
  // 自定义弹窗的关闭函数
  const close_ls = () => {
    setVisibleDrawer(false);
  };
  // 更换点击class
  const getRowClassName = (record: any) => {
    return record.id === tableId ? 'clickRowStyl' : '';
  };

  const renderExpendField = () => {
    return (
      <ProTable
        headerTitle="用户属性列表"
        actionRef={tableRef}
        columns={columnsTwo}
        search={false}
        options={false}
        bordered={false}
        rowKey={(record) => record.id}
        onRow={(record) => {
          return {
            onClick: () => {
              setTableId(record.id);
              getRowClassName(record);
            },
          };
        }}
        rowClassName={getRowClassName}
        request={async (pagination) => {
          const params: any = {
            size: pagination.pageSize,
            page: pagination.current,
            basic: range == 'base' ? true : range == 'custom' ? false : false,
            mandatory:
              mandatory == 'mandatoryTrue' ? true : range == 'mandatoryFalse' ? false : false,
            q: saveSeach,
          };
          if (range == 'all') {
            delete params?.basic;
          }
          if (mandatory == 'all') {
            delete params?.mandatory;
          }
          const result: any = await getTotalUserInfo(params);
          return result;
        }}
        pagination={{ pageSize, showSizeChanger: true, onChange: onPageSize }}
        toolBarRender={() => [
          <Popover placement="bottom" title={text} content={content} trigger="click">
            <Button style={{ padding: '5px 8px' }}>
              <img src="/uc/images/shaixuan.png" style={{ width: 15, height: 15, marginTop: -2 }} />
            </Button>
          </Popover>,
          <Input.Search
            placeholder="请输字段的属性名称、全局名称"
            onSearch={(searchValue) => {
              setSaveSearch(searchValue, () => {
                tableRef.current?.reloadAndRest?.();
              });
            }}
            allowClear
            style={{ width: '300px' }}
          />,
          <Button type="primary" key="add" onClick={openDrawer}>
            <PlusOutlined />
            新增属性
          </Button>,
        ]}
      />
    );
  };

  return (
    <>
      <PageContainer title={false}>
        {renderExpendField()}
        <DeleteModalCom
          visible_delete={visible_delete}
          handleDeleteOk={ModalConfimFunc}
          handleDeleteCancel={ModalCancleFunc}
        />
        {visibleDrawer ? (
          <CustomVaildtorCom
            visibles_ls={visibleDrawer}
            onCloses_ls={close_ls}
            data={currentRow}
            refreshData_custom={requestCustomeInfo}
          />
        ) : undefined}
      </PageContainer>
    </>
  );
};

export default Index;
/**
 * 两个列表的表格头统一
 * 增加高级搜索按钮
 * 点击字段弹出右侧抽屉 都进行统一
 */
