import React, { useState, useRef, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { DownOutlined, ShareAltOutlined } from '@ant-design/icons';
import { Card, Dropdown, Menu, Tooltip, Row, Col, DatePicker, Button } from 'antd';
import type { ProColumns } from '@ant-design/pro-table';
import type { MenuProps } from 'antd';
import { t, createQueryString, exportToCsv, getTwoDates } from '@/utils/common.utils';
import moment from 'moment';
import ProTable from '@ant-design/pro-table';
import type { ActionType } from '@ant-design/pro-table';
import SearchBox from '@/components/SearchBox/index';
import auditUtil from './auditUtil';
import { getLog } from './service';

const MenuItem = Menu.Item;
const { RangePicker } = DatePicker;
interface paramsType {
  audit_type: number;
  principal?: string;
  start_time?: number;
  end_time?: number;
  event_type?: number;
  event_subtype?: number;
  client_id?: string;
}

const LoginLog: React.FC = () => {
  const EventType = {
    '0': 'ALL',
    iam_1: 'LOGIN',
    iam_2: 'USER',
    iam_3: 'ORG',
    iam_4: 'USER_EXT_ATTR',
    iam_5: 'ORG_EXT_ATTR',
    iam_6: 'APP',
    iam_7: 'TAG',
    iam_8: 'PORTAL',
    iam_9: 'SETTING',
    iam_10: 'SYNC',
    iam_11: 'DS',
    iam_12: 'PROFILE',
    iam_13: 'LOGIN_POLICY',
    iam_14: 'AUTH_FACTOR',
    iam_15: 'SNS_CONFIG',
    iam_16: 'PUSH_CONNECTOR',
    iam_17: 'ROLE',
    iam_18: 'DINGAUDIT',
    mdm_1: 'DEVICE',
    mdm_2: 'APP_POLICY',
    mdm_3: 'ACCESS_POLICY',
  };

  // const EventType_mdm = {
  //   1: 'DEVICE',
  //   2: 'APP_POLICY',
  //   3: 'ACCESS_POLICY',
  // }

  const [rangePickerOpen, setRangePickerOpen] = useState(false);
  const actionRef = useRef<ActionType>();
  const [event_type, setEvent_type] = useState(0);
  const [event_subtype, setEvent_subtype] = useState(0);
  const [searchParams, setSearchParams] = useState<paramsType>({
    audit_type: 2,
    start_time: moment().subtract(6, 'day').unix(),
    end_time: moment().endOf('day').unix(),
    principal: undefined,
  });
  const [pageSize, setPageSize] = useState(10);
  const onPageSize = (_value, pageSizeValue) => {
    setPageSize(pageSizeValue);
  };
  const onSearch = () => {
    if (actionRef.current) {
      actionRef.current.reload();
    }
  };
  useEffect(() => {
    onSearch();
  }, [searchParams]);

  const findKey = (obj: any, val: any) => {
    for (const key in obj) {
      if (obj[key] == val) {
        return key;
      }
    }
    return;
  };

  const filterByEventType = (evtType: any) => {
    const params = { ...searchParams };
    delete params.event_subtype;

    if (evtType == 0) {
      delete params.event_type;
    } else {
      params.event_type = evtType.split('_')[1];
      params.client_id = evtType.split('_')[0];
    }
    setSearchParams(params);
    setEvent_type(evtType);
    setEvent_subtype(0);
  };
  const selectedEvtType = event_type;

  const evtTypeMenuItems: MenuProps['items'] = Object.keys(auditUtil.EventType).map((typeItem) => {
    const type = findKey(EventType, typeItem);
    //disable the menu item of inplace filtering event type
    const isSelected = type === selectedEvtType;
    return {
      key: type,
      disabled: isSelected,
      label: isSelected ? (
        t(auditUtil.eventTypeI18nKey(EventType[type]))
      ) : (
        <>
          <a
            href="#"
            onClick={() => {
              return filterByEventType(type);
            }}
          >
            {t(auditUtil.eventTypeI18nKey(type && EventType[type]))}
          </a>
        </>
      ),
    };
  });

  /**
   * callback to filter all system log by event subtype
   * @param {number} evtSubType  event.event_subtype
   */
  const filterByEventSubType = (evtSubType: number | undefined) => {
    const params = { ...searchParams };
    if (evtSubType === 0) {
      delete params.event_subtype;
    } else {
      params.event_subtype = evtSubType;
    }
    setSearchParams(params);
    setEvent_subtype(evtSubType || 0);
  };
  /**
   * build event subtype filter dropdown menu item
   * @param {number} type event.event_type
   * @param {number} subtype event.event_subtype
   * @param {string} i1n8Key i1n8 key
   */
  const buildEventSubTypeMenuItem = (
    type: string | number,
    subtype: number | undefined,
    i1n8Key?: string | undefined,
  ) => {
    //disable the menu item of inplace filtering event type
    const isSelected = subtype === event_subtype,
      i18n =
        i1n8Key ||
        auditUtil.eventTypeI18nKey(EventType[type], subtype && auditUtil.EventSubtype[subtype]);

    return (
      <MenuItem key={subtype} disabled={isSelected}>
        {isSelected ? (
          t(i18n)
        ) : (
          <a href="#" onClick={() => filterByEventSubType(subtype)}>
            {t(i18n)}
          </a>
        )}
      </MenuItem>
    );
  };

  const buildEventSubTypeMenu = (type: any) => {
    const ALL = buildEventSubTypeMenuItem(type, 0, 'audit.system.evt_types.all.text');

    if (type && type === 0) {
      return <Menu>{ALL}</Menu>;
    }

    const menuItems = auditUtil.EventType[EventType[type].toLocaleUpperCase()].subtypes.map(
        (subtype: number) =>
          buildEventSubTypeMenuItem(type, findKey(auditUtil.EventSubtype, subtype)),
      ),
      evtSubTypeMenu = (
        <Menu>
          {ALL}
          {[...menuItems]}
        </Menu>
      );

    return evtSubTypeMenu;
  };

  // const evtTypeMenu = <Menu>{[...evtTypeMenuItems]}</Menu>;

  const evtTypeHeaderColText = auditUtil.eventTypeHeaderColText(EventType[selectedEvtType]);
  const evtSubTypeMenu = buildEventSubTypeMenu(event_type);
  const selectedEvetSubtype = event_subtype;
  const evtSubTypeHeaderColText = auditUtil.eventSubtypeHeaderColText(
    EventType[selectedEvtType],
    auditUtil.EventSubtype[selectedEvetSubtype],
  );
  console.log(evtSubTypeMenu);
  console.log(evtSubTypeHeaderColText);

  const columns: ProColumns<any>[] = [
    {
      title: '操作时间',
      dataIndex: 'occur_time',
      key: 'occur_time',
      renderText: (record: any) => moment(record.occur_time).format('YYYY-MM-DD'),
    },
    {
      title: '操作者',
      dataIndex: 'operator',
      key: 'operator',
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
      title: (
        <div>
          <Dropdown menu={{ items: evtTypeMenuItems }} trigger={['click']}>
            <span style={{ cursor: 'pointer', width: '130px', display: 'inline-block' }}>
              {evtTypeHeaderColText}
              <DownOutlined className="ml-5" />
            </span>
          </Dropdown>
        </div>
      ),
      dataIndex: 'event_type',
      key: 'event_type',
      render: (_, record) => {
        const type = record.client_id + '_' + record.event_type;
        return t(auditUtil.eventTypeI18nKey(EventType[type])) || EventType[type];
      },
    },
    {
      title: '具体操作',
      dataIndex: 'event_subtype',
      key: 'event_subtype',
      render: (_, record) => {
        const type = record.client_id + '_' + record.event_type;
        // const subtype = record.client_id + '_' + record.event_subtype;
        return (
          // t(auditUtil.eventTypeI18nKey(EventType[type], auditUtil.EventSubtype[subtype])) ||
          // auditUtil.EventSubtype[subtype]
          t(
            auditUtil.eventTypeI18nKey(
              EventType[type],
              auditUtil.EventSubtype[record.event_subtype],
            ),
          ) || auditUtil.EventSubtype[subtype]
        );
      },
    },
    {
      title: '操作对象',
      dataIndex: 'target_name',
      key: 'target_name',
      render: (_, record) => (
        <Tooltip title={auditUtil.renderTargetToolTip(record)}>
          <span>{auditUtil.renderTargetText(record)}</span>
        </Tooltip>
      ),
    },
    {
      title: '结果',
      dataIndex: 'error_code',
      key: 'error_code',
      render: (_, record) => (
        <span>{auditUtil.renderResultForSystemLog(record, EventType, auditUtil.EventSubtype)}</span>
      ),
    },
  ];

  const handleSearch = (searchKey: any) => {
    const params = { ...searchParams };
    if (searchKey) {
      params.principal = searchKey;
    } else {
      delete params.principal;
    }
    setSearchParams(params);
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
    const params = { ...searchParams };
    if (value && value.length === 2) {
      params.start_time = value[0].unix();
      params.end_time = value[1].unix();
    } else {
      delete params.start_time;
      delete params.end_time;
    }
    setSearchParams(params);
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
  const render = () => {
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
              style={{ width: '100%', marginLeft: '3%' }}
            />
          </Col>
          <Col offset={1} span={10}>
            <SearchBox
              placeholder="请输入操作者"
              defaultSearchKey={searchParams && searchParams.principal}
              onSearch={handleSearch}
              showSearchButton={false}
              minLength={0}
              showClear={true}
            />
          </Col>
          <Col offset={1} span={2}>
            <Button
              type="primary"
              title="导出"
              onClick={handleExport}
              style={{ padding: '0', width: 80 }}
              icon={<ShareAltOutlined />}
            >
              导出
            </Button>
            <a id="exportLink" target="_blank" className="hidden" />
          </Col>
        </Row>
        <ProTable
          actionRef={actionRef}
          rowKey="id"
          className="minHeight"
          search={false}
          options={false}
          request={async (params: { pageSize: number; current: number }) => {
            const result = await getLog({
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
          columns={columns}
          pagination={{ pageSize, showSizeChanger: true, onChange: onPageSize }}
        />
      </>
    );
  };
  return (
    <PageContainer title={false}>
      <Card>{render()}</Card>
    </PageContainer>
  );
};
export default LoginLog;
