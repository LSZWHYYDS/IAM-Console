import SearchBox from '@/components/SearchBox/index';
import OrgTree from '@/components/OrgTree';
import { createQueryString, exportToCsv, getTwoDates } from '@/utils/common.utils';
import type { ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { ShareAltOutlined, UpCircleOutlined, BorderOuterOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Row, Table, Layout, message, Dropdown } from 'antd';
import moment from 'moment';
import React, { useRef, useState, useEffect } from 'react';
// import { exportToCsvss } from './servers';
import { getOrgsList, getOrgInfo } from '@/pages/UserCenter/service';
const { RangePicker } = DatePicker;
const { Content, Sider } = Layout;
import type { MenuProps } from 'antd';
import styles from './index.less';
import PackageHistoryDrawer from './components/packageHistory';

// import { ExportPackaging, getPackaging } from './service'
import { ExportPackaging } from './service';

type OrgType = {
  children: OrgType[];
  description: string;
  id: string;
  name: string;
  readonly: boolean;
  parentRefId?: string;
  parent?: any;
  num_of_children?: number;
  num_of_users?: number;
  entitled?: boolean;
};
interface paramsType {
  audit_type: number;
  principal?: string;
  start_time?: number;
  end_time?: number;
  dept_id?: number | string;
}

const TableLog: React.FC<any> = (props) => {
  const [collapsed, setCollapsed] = useState(false);
  const [, setOrgKey] = useState<string>();
  const [orgTree, setOrgTree] = useState<any>([]);
  const [, setOrgInfo] = useState<Partial<OrgType>>();
  // 开始时间
  const [start, setStart] = useState<number>(moment().subtract(6, 'day').unix());
  const [end, setEnd] = useState(moment().endOf('day').unix());
  const [principal, setPrincipal] = useState(''); // 输入框的变量
  const [ids, setIds] = useState<string[]>([]); // 勾选表格的ID
  const [, setDeparentId] = useState<any[]>([]);
  const [deid, setDeid] = useState<any>(''); // 部门的ID
  const [pageSize, setPageSize] = useState(10);
  const actionRef = useRef<ActionType>();
  const actionRefs = useRef<ActionType>(null);
  const packageHistoryRef = useRef<any>(null);
  const [searchParams, setSearchParams] = useState<paramsType>({
    audit_type: 1,
    principal: undefined,
    start_time: moment().subtract(6, 'day').unix(),
    end_time: moment().endOf('day').unix(),
    dept_id: '',
  });

  const [searchParams_ls, setSearchParams_ls] = useState<any>({
    startTime: moment().subtract(6, 'day').unix(),
    endTime: moment().endOf('day').unix(),
    deptId: '',
  });
  const onPageSize = (_value, pageSizeValue) => {
    setPageSize(pageSizeValue);
  };

  const handleGetOrgsList = async () => {
    await getOrgsList({ depth: 0, attrs: 'id,name,description,readonly' }).then(async (res) => {
      if (res.error === '0' && res.data && res.data.length > 0) {
        setOrgTree(res.data);
      }
    });
  };

  const onClick: MenuProps['onClick'] = ({ key }) => {
    if (key == '1') {
      if (ids?.length == 0) {
        message.error('请至少勾选一个文件');
        return;
      }
      ExportPackaging({
        star_time: start,
        end_time: end,
        dept_id: deid,
        //   file_ids: ids,
        fileIds: ids,
        filter: principal,
      }).then(() => {
        actionRefs?.current?.clearSelected?.();
        message.success('操作成功，请稍后再打包历史中查看');
      });
    } else {
      packageHistoryRef?.current?.onOpen();
    }
  };

  const itemss = [
    {
      key: '1',
      label: (
        <span>
          <UpCircleOutlined style={{ fontSize: '16px', marginRight: '5px' }} />
          导出打包
        </span>
      ),
    },
    {
      key: '2',
      label: (
        <span>
          <BorderOuterOutlined style={{ fontSize: '16px', marginRight: '5px' }} />
          打包历史
        </span>
      ),
    },
  ];
  useEffect(() => {
    handleGetOrgsList();
  }, []);

  useEffect(() => {
    if (deid) {
      actionRefs.current?.reload?.();
    }
  }, [deid]);
  const [rangePickerOpen, setRangePickerOpen] = useState(false);
  const { apiFunc, hasExport, apiFuncs } = props;

  const modifyDeparentIds = (value: any) => {
    setDeparentId(value);
  };
  const onSearch = () => {
    // if (actionRefs.current) {
    //   actionRefs.current?.reload();
    // }
    actionRefs.current?.reload();
    actionRef.current?.reload();
  };
  const handleSearch = (searchKey: any) => {
    // 用户行为的参数
    setSearchParams({
      ...searchParams,
      principal: searchKey,
    });
    // 用户截屏的参数
    setSearchParams_ls({
      ...searchParams_ls,
      filter: searchKey,
    });
    setPrincipal(searchKey);
    onSearch();
  };
  const disableSearchTimeRange = (current: any) => {
    const maxAge = moment().subtract(90, 'days').startOf('day');
    return current && (current.isBefore(maxAge) || current.isAfter(moment().endOf('day')));
  };
  const defaultSearchRange = getTwoDates(moment().subtract(6, 'day'), moment().endOf('day'));
  const builtInRanges = {
    ['最近三小时']: getTwoDates(moment().subtract(3, 'hours'), moment()),
    ['今天']: getTwoDates(moment().startOf('day'), moment()),
    ['最近三天']: getTwoDates(moment().subtract(2, 'days').startOf('day'), moment()),
    ['最近一周']: getTwoDates(moment().subtract(6, 'days').startOf('day'), moment()),
  };
  const onSearchTimeRangeChanged = (value: any) => {
    // // 此处为了传递Tree组件设置变量
    // setStart(value[0].unix());
    // setEnd(value[1].unix());

    // if (value && value.length === 2) {
    //   setSearchParams({
    //     ...searchParams,
    //     start_time: value[0].unix(),
    //     end_time: value[1].unix(),
    //   });
    //   onSearch();
    // } else {
    //   const { start_time, end_time, ...obj } = searchParams;
    //   setSearchParams(obj);
    // }
    // 此处为了传递Tree组件设置变量
    setStart(value[0].unix());
    setEnd(value[1].unix());

    if (value && value.length === 2) {
      setSearchParams({
        ...searchParams,
        start_time: value[0].unix(),
        end_time: value[1].unix(),
      });
      onSearch();
    } else {
      const { start_time, end_time, ...obj } = searchParams;
      setSearchParams(obj);
    }

    if (!hasExport) {
      setSearchParams_ls({
        ...searchParams_ls,
        startTime: value[0].unix(),
        endTime: value[1].unix(),
      });
    }
  };
  const openChange = (state: boolean | ((prevState: boolean) => boolean)) => {
    setRangePickerOpen(state);
  };
  const getExportAPI = () => {
    return '/iam/api/auditlog/export'; //auditAPI.exportLog;
  };
  const handleExport = () => {
    const url = getExportAPI() + createQueryString(searchParams),
      filename = 'audit.csv';
    exportToCsv(url, filename);
  };
  // const handleDownFileFunc = () => {
  //   if (ids?.length == 0) {
  //     message.error('请至少勾选一个文件');
  //     return;
  //   }
  //   exportToCsvss(
  //     '/mdm/admin/devices/download',
  //     'download.tar.gz',
  //     ids,
  //     start,
  //     end,
  //     principal, // 输入框值
  //     // deparentId.join(','),
  //     deid,
  //   );
  // };
  // 选择勾选table表格
  const handleRowSelect = (key: any, items: any) => {
    const temp: any = [];
    items.forEach((item: any) => {
      temp.push(item.id);
    });
    setIds(temp);
  };

  // 点击部门列表 重新刷新表单
  const refreshTableData = (val: any) => {
    actionRefs.current?.reloadAndRest?.();
    setDeid(val[0]);
    setSearchParams_ls((state: any) => {
      const a = state;
      return {
        ...a,
        deptId: val[0],
      };
    });
  };
  const handleGetOrgInfo = async (id: string) => {
    const result = await getOrgInfo(id, {
      attrs: 'id,name,description,readonly,num_of_users,num_of_children',
    });
    if (result.error === '0') {
      setOrgInfo(result.data);
    }
  };
  const onSelect = (selectedKeys: any) => {
    setOrgKey(selectedKeys);
    handleGetOrgInfo(selectedKeys);
    actionRef.current?.reload?.();
  };
  const renderGroupTree = () => {
    return (
      <div
        style={{
          width: '200px',
          padding: '24px',
          background: '#fff',
          border: '1px solid #f1f2f6',
        }}
      >
        {orgTree && orgTree.length > 0 ? (
          <OrgTree
            checkable={false}
            selectable={true}
            orgs={orgTree}
            handleOnSelect={(values) => onSelect(values)}
            afterEdit={handleGetOrgsList}
            isShow={false}
            logTree={true}
            start={start}
            end={end}
            principals={principal}
            modifyIDs={modifyDeparentIds}
            modifyFatherData={refreshTableData}
          />
        ) : null}
      </div>
    );
  };

  return (
    <>
      <Row>
        <Col span={10}>
          <RangePicker
            showTime={{ format: 'HH:mm', hideDisabledOptions: true }}
            defaultValue={defaultSearchRange}
            disabledDate={disableSearchTimeRange}
            format="YYYY-MM-DD HH:mm"
            ranges={builtInRanges}
            allowClear={false}
            renderExtraFooter={() => (
              <span>建议尽可能缩小查询条件, 最多能查询90天内的数据, 默认显示当天数据.</span>
            )}
            onChange={onSearchTimeRangeChanged}
            open={rangePickerOpen}
            onOpenChange={openChange}
            style={{ width: '100%' }}
          />
        </Col>
        <Col offset={1} span={10}>
          <SearchBox
            placeholder={props.placeholder || '请输入用户名、姓名、手机号'}
            defaultSearchKey={searchParams && searchParams.principal}
            onSearch={handleSearch}
            showSearchButton={false}
            minLength={0}
            showClear={true}
          />
        </Col>
        {!hasExport && (
          <Col span={2} style={{ marginLeft: 10, width: 100 }}>
            <Dropdown menu={{ items: itemss, onClick }} placement="bottomRight">
              <Button type="primary" icon={<ShareAltOutlined />}>
                导出
              </Button>
            </Dropdown>
          </Col>
        )}
        {hasExport && (
          <Col span={2} style={{ marginLeft: 10, width: 100 }}>
            <Button type="primary" title="导出" onClick={handleExport} icon={<ShareAltOutlined />}>
              导出
            </Button>
          </Col>
        )}
      </Row>
      {!hasExport && (
        <Layout style={{ minHeight: '100vh', position: 'relative' }} className={styles.layouts}>
          <Layout className={styles.layouts}>
            <Content className={styles.calcStyle}>
              <ProTable
                actionRef={actionRefs}
                rowKey="id"
                className="minHeight"
                search={false}
                options={false}
                request={async (params: { pageSize: number; current: number }) => {
                  const result = await apiFuncs({
                    ...searchParams_ls,
                    page: params.current,
                    size: params.pageSize,
                  });

                  result.data.items.forEach((element: any) => {
                    element.info = element.error_code == '0' ? '成功' : '失败';
                    element.login =
                      element.event_subtype == 103 || element.event_subtype == 104
                        ? '登录'
                        : '默认';
                    element.name = element.name ? element.name : '——';
                  });

                  return {
                    data: result.data.items,
                    success: true,
                    total: result.data.total,
                  };
                }}
                columns={props.columns}
                pagination={{
                  pageSize: pageSize,
                  showSizeChanger: true,
                  hideOnSinglePage: false,
                  onChange: onPageSize,
                  // pageSizeOptions: ['10', '100', '300', '500'],
                }}
                tableAlertRender={false}
                rowSelection={
                  props.isAuth && {
                    selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
                    defaultSelectedRowKeys: [1],
                    onChange: (keys, rows) => {
                      handleRowSelect(keys, rows);
                    },
                  }
                }
              />
            </Content>
            <Sider
              collapsedWidth={0}
              theme="light"
              collapsible
              collapsed={collapsed}
              onCollapse={(value) => setCollapsed(value)}
              // style={{ position: 'absolute', right: '-36px', top: 0, }}
            >
              {renderGroupTree()}
            </Sider>
          </Layout>
        </Layout>
      )}
      {hasExport && (
        <ProTable
          actionRef={actionRef}
          rowKey="id"
          className="minHeight"
          search={false}
          options={false}
          request={async (params: { pageSize: number; current: number }) => {
            const result = await apiFunc({
              ...searchParams,
              page: params.current,
              size: params.pageSize,
            });
            result.data.items.forEach((element: any) => {
              element.info = element.error_code == '0' ? '成功' : '失败';
              element.login =
                element.event_subtype == 103 || element.event_subtype == 104 ? '登录' : '默认';
              element.name = element.name ? element.name : '——';
            });
            return {
              data: result.data.items || [],
              success: true,
              total: result.data.total,
            };
          }}
          columns={props.columns}
          pagination={{ pageSize, showSizeChanger: true, onChange: onPageSize }}
          tableAlertRender={false}
          rowSelection={
            props.isAuth && {
              selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
              defaultSelectedRowKeys: [1],
              onChange: (keys, rows) => {
                handleRowSelect(keys, rows);
              },
            }
          }
        />
      )}
      <PackageHistoryDrawer ref={packageHistoryRef} />
    </>
  );
};
export default TableLog;
