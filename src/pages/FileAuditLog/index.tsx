import React, { useState, useRef, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Form, Row, Col, DatePicker, Tag, Button } from 'antd';
import type { ProColumns } from '@ant-design/pro-table';
import { formatDateTime, createQueryString, exportToCsv, getTwoDates } from '@/utils/common.utils';

import moment from 'moment';
import ProTable from '@ant-design/pro-table';
import type { ActionType } from '@ant-design/pro-table';
import { DownOutlined, ShareAltOutlined, UpOutlined } from '@ant-design/icons';
import SearchBox from '@/components/SearchBox/index';
import { getLog } from './service';

const { CheckableTag } = Tag;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
interface paramsType {
  filter?: string;
  start_time?: number;
  end_time?: number;
  event_type?: number;
}

const FileAuditLog: React.FC = () => {
  const [form] = Form.useForm();
  const [queryMore, setQueryMore] = useState(false);
  const [selectedTags, setSelectedTags] = useState('不限');
  const [rangePickerOpen, setRangePickerOpen] = useState(false);
  const actionRef = useRef<ActionType>();
  const [searchParams, setSearchParams] = useState<paramsType>({
    start_time: Date.parse(moment().startOf('day')),
    end_time: Date.parse(moment().endOf('day')),
    filter: undefined,
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

  const columns: ProColumns<any>[] = [
    {
      title: '操作者',
      dataIndex: 'operator_name',
      key: 'operator_name',
      onFilter: true,
    },
    {
      title: '操作类型',
      dataIndex: 'action',
      key: 'action',
      valueType: 'select',
      hideInSearch: false,
      valueEnum: {
        '': { text: '全部' },
        0: {
          text: '上传',
        },
        1: {
          text: '删除',
        },
        2: {
          text: '下载',
        },
        3: {
          text: '预览',
        },
        4: {
          text: '覆盖',
        },
        5: {
          text: '创建外链分享',
        },
        6: {
          text: '重命名',
        },
        7: {
          text: '移动',
        },
        8: {
          text: '复制或转发',
        },
        9: {
          text: '离职转交',
        },
        10: {
          text: '创建文档',
        },
        11: {
          text: '删除文档',
        },
        12: {
          text: '导出文档',
        },
        13: {
          text: '预览文档',
        },
        14: {
          text: '回滚文档',
        },
        15: {
          text: '分享文档',
        },
        16: {
          text: '移动文档',
        },
        17: {
          text: '创建副本',
        },
        18: {
          text: '评论文档',
        },
        19: {
          text: '导入文档',
        },
        20: {
          text: '更改协作者',
        },
        21: {
          text: '重命名',
        },
      },
    },
    {
      title: '接收人',
      dataIndex: 'receiver_name',
      key: 'receiver_name',
    },
    {
      title: '操作时间',
      dataIndex: 'gmt_create',
      key: 'gmt_create',
      search: false,
      render: (_, record) => formatDateTime(record.gmt_create),
    },
    {
      title: '空间类型',
      dataIndex: 'receiver_type',
      key: 'receiver_type',
      valueEnum: {
        '': { text: '全部' },
        0: {
          text: '单聊',
        },
        1: {
          text: '群聊',
        },
        2: {
          text: '钉盘',
        },
        3: {
          text: '在线文档',
        },
      },
    },
    {
      title: '文件名称',
      dataIndex: 'resource',
      key: 'resource',
      search: false,
    },
    {
      title: '文件类型',
      dataIndex: 'resource_extension',
      key: 'resource_extension',
      valueEnum: {
        '': { text: '全部' },
        word: {
          text: 'Word',
        },
        excel: {
          text: 'Excel',
        },
        ppt: {
          text: 'PPT',
        },
        pdf: {
          text: 'PDF',
        },
        code: {
          text: '代码',
        },
        image: {
          text: '图片',
        },
        video: {
          text: '视频',
        },
        other: {
          text: '其他',
        },
      },
    },
    {
      title: '操作设备',
      dataIndex: 'platform',
      key: 'platform',
      valueEnum: {
        '': { text: '全部' },

        0: {
          text: 'iOS',
        },
        1: {
          text: 'Android',
        },
        2: {
          text: 'WEB',
        },
        4: {
          text: 'System',
        },
        8: {
          text: 'DINGDING',
        },
        11: {
          text: 'Windows',
        },
        12: {
          text: 'MAC',
        },
      },
    },
  ];

  const handleSearch = (searchKey: any) => {
    const params = { ...searchParams };
    if (searchKey) {
      params.filter = searchKey;
    } else {
      delete params.filter;
    }
    setSearchParams(params);
  };
  const defaultSearchRange = getTwoDates(moment().subtract(6, 'day'), moment().endOf('day'));
  const builtInRanges = {
    ['今天']: getTwoDates(moment().startOf('day'), moment()),
    ['最近一周']: getTwoDates(moment().subtract(6, 'days').startOf('day'), moment()),
    ['最近一月']: getTwoDates(moment().subtract(1, 'month'), moment()),
    ['最近三月']: getTwoDates(moment().subtract(2, 'month'), moment()),
  };
  const onSearchTimeRangeChanged = (value: any) => {
    const params = { ...searchParams };
    if (value && value.length === 2) {
      params.start_time = Date.parse(value[0]);
      params.end_time = Date.parse(value[1]);
    } else {
      delete params.start_time;
      delete params.end_time;
    }
    setSearchParams(params);
  };
  const openChange = (state: boolean | ((prevState: boolean) => boolean)) => {
    setRangePickerOpen(state);
  };
  const handleChange = (tag: string, checked: boolean) => {
    setSelectedTags((checked && tag) || '');
  };
  const onQueryMore = () => {
    setQueryMore(!queryMore);
  };
  const onExport = () => {
    const url =
        '/iam/api/dingaudit/export' +
        createQueryString({ ...searchParams, dingAuditFile: 'audit.csv' }),
      filename = 'audit.csv';
    exportToCsv(url, filename);
  };
  const render = () => {
    const tagsData = ['不限'];
    const searchProps =
      (queryMore && {
        collapseRender: false,
        collapsed: false,
      }) ||
      false;
    return (
      <>
        <Row>
          <Col span={10} style={{ marginLeft: 22 }}>
            <SearchBox
              placeholder="请输入用户名、文件名称"
              defaultSearchKey={searchParams && searchParams.filter}
              onSearch={handleSearch}
              showSearchButton={false}
              minLength={0}
              showClear={true}
            />
          </Col>
          <Col span={2} style={{ marginLeft: 100 }}>
            <Button
              type="primary"
              icon={(!queryMore && <DownOutlined />) || <UpOutlined />}
              onClick={onQueryMore}
            >
              高级筛选
            </Button>
          </Col>
          <Col>
            <Button type="primary" icon={<ShareAltOutlined />} onClick={onExport}>
              导出
            </Button>
          </Col>
        </Row>
        <Form form={form}>
          {queryMore && (
            <>
              <Row>
                <Col span={3} style={{ marginLeft: '2%' }}>
                  <FormItem label="操作时间" name="name" shouldUpdate>
                    {tagsData.map((tag) => (
                      <CheckableTag
                        key={tag}
                        checked={selectedTags.indexOf(tag) > -1}
                        onChange={(checked) => handleChange(tag, checked)}
                        style={{ width: 40 }}
                      >
                        {tag}
                      </CheckableTag>
                    ))}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col style={{ marginLeft: '2%' }}>
                  <FormItem label="选择时间" name="time" wrapperCol={{ span: 18 }} shouldUpdate>
                    <RangePicker
                      showTime={{ format: 'HH:mm', hideDisabledOptions: true }}
                      defaultValue={defaultSearchRange}
                      format="YYYY-MM-DD HH:mm:ss"
                      ranges={builtInRanges}
                      allowClear={false}
                      renderExtraFooter={() => (
                        <span>
                          建议尽可能缩小查询条件, 最多能查询90天内的数据, 默认显示当天数据.
                        </span>
                      )}
                      onChange={onSearchTimeRangeChanged}
                      open={rangePickerOpen}
                      onOpenChange={openChange}
                    />
                  </FormItem>
                </Col>
              </Row>
            </>
          )}
        </Form>
        <ProTable
          actionRef={actionRef}
          rowKey="id"
          search={searchProps}
          options={false}
          request={async (params: any) => {
            const cloned = _.cloneDeep(params);
            cloned.page = params.current;
            cloned.size = params.pageSize;
            delete cloned.current;
            delete cloned.pageSize;
            if (selectedTags === '不限') {
              delete searchParams.start_time;
              delete searchParams.end_time;
            }
            const result = await getLog(searchParams, cloned);
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
export default FileAuditLog;
