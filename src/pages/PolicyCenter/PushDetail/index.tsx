import { useState, forwardRef, useImperativeHandle } from 'react';
import { Row, Drawer, Col, Table, Popconfirm } from 'antd';
import { showErrorMessage, requestMsg, useStateCallback } from '@/utils/common.utils';
import SearchBox from '@/components/SearchBox/index';
import {
  repushPolicy,
  deleteRelationships,
  policyPushedUsers,
  policyPushedDevices,
} from '@/pages/PolicyCenter/service';

export const PushDetail = forwardRef((props, ref) => {
  let policyDetails = {};
  const queryParams = { q: undefined, policyId: '' };
  const [policyId, setPolicyId] = useState('');
  const [visible, setVisible] = useState(false);
  const [dataEffect, setDataEffect] = useState([]);
  const [expandedData, setExpandedData] = useState({});
  const [loading, setLoading] = useState(false);
  // todo
  const [policeId, setPoliceID] = useState<any>('');
  const [pagination, setPagination] = useStateCallback({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const onCloseDrawer = () => {
    setVisible(false);
  };
  const queryPushData = () => {
    const newPage = {
      size: pagination.pageSize,
      page: pagination.current,
      q: queryParams.q || undefined,
    };
    setLoading(true);
    policyPushedUsers(queryParams.policyId || policeId, newPage)
      .then((response) => {
        if (response.code === '0') {
          const itemsList = response.data.items.filter((item: { id: any }) => {
            return item.id;
          });
          itemsList.forEach(
            (item: {
              activeDevicePolicyNum: number;
              activeDeviceNum: number;
              effectiveState: string;
            }) => {
              const activeDevicePolicyNum = item.activeDevicePolicyNum || 0;
              const activeDeviceNum = item.activeDeviceNum || 0;
              item.effectiveState = `${activeDevicePolicyNum}/${activeDeviceNum}`;
            },
          );
          pagination.total = response.data.total;
          setDataEffect(itemsList);
          setLoading(false);
          setPagination(pagination, () => {});
        }
      })
      .catch((error) => {
        showErrorMessage(error);
      });
  };
  const queryPushData1 = (paginations) => {
    const newPage = {
      size: paginations.pageSize,
      page: paginations.current,
      q: queryParams.q || undefined,
    };
    setLoading(true);
    policyPushedUsers(queryParams.policyId || policeId, newPage)
      .then((response) => {
        if (response.code === '0') {
          const itemsList = response.data.items.filter((item: { id: any }) => {
            return item.id;
          });
          itemsList.forEach(
            (item: {
              activeDevicePolicyNum: number;
              activeDeviceNum: number;
              effectiveState: string;
            }) => {
              const activeDevicePolicyNum = item.activeDevicePolicyNum || 0;
              const activeDeviceNum = item.activeDeviceNum || 0;
              item.effectiveState = `${activeDevicePolicyNum}/${activeDeviceNum}`;
            },
          );
          pagination.total = response.data.total;
          pagination.current = response.data.page;
          pagination.pageSize = response.data.size;
          setDataEffect(itemsList);
          setPagination(pagination, () => {
            setLoading(false);
          });
        }
      })
      .catch((error) => {
        showErrorMessage(error);
      });
  };
  const onSearch = (value: any) => {
    queryParams.q = value;
    queryPushData();
  };
  const deleteEffectUser = (entry: { id: any }) => {
    const users: any[] = [];
    users.push(entry.id);
    const params = {
      users,
    };
    deleteRelationships(policeId, params).then((response) => {
      requestMsg(response);
      if (response.data && response.code === '0') {
        queryPushData();
      }
    });
  };
  const handleRepush = () => {
    repushPolicy(policyId)
      .then((response) => {
        requestMsg(response);
      })
      .catch((error) => {
        showErrorMessage(error);
      });
  };
  const openDrawer = () => {
    setVisible(true);
    policyDetails = {};
  };
  useImperativeHandle(ref, () => ({
    onOpen: (entry: any) => {
      setPolicyId(entry.id);
      queryParams.policyId = entry.id;
      setPoliceID(queryParams.policyId);
      queryPushData();
      openDrawer();
    },
  }));
  const onEffectRenderAction = (text: any, record: any) => {
    return (
      <div className="table-action">
        <Popconfirm title="确定要删除吗？" onConfirm={() => deleteEffectUser(record)}>
          <a className="text-col1" title="删除">
            删除
          </a>
        </Popconfirm>
        <a className="text-col1" onClick={handleRepush} title="向未生效设备推送">
          重新推送
        </a>
      </div>
    );
  };
  const initTableEffect = () => {
    const cols = [
      {
        title: `已生效/设备总数`,
        dataIndex: 'effectiveState',
        key: 'effectiveState',
        with: 100,
      },
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        with: 100,
      },
      {
        title: '账号',
        dataIndex: 'loginId',
        key: 'loginId',
        with: 100,
      },
      {
        title: '所属组织',
        dataIndex: 'orgNames',
        key: 'orgNames',
        with: 120,
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        with: 180,
        render: onEffectRenderAction,
      },
    ];
    return cols;
  };
  const expandedRowRender = (entry: { id: any }) => {
    const { id } = entry;
    const columns = [
      {
        title: '生效状态',
        dataIndex: 'devicePolicyStatus',
        key: 'devicePolicyStatus',
        render: (text: number) => (text === 1 && '已生效') || '未生效',
      },
      {
        title: '设备型号',
        dataIndex: 'model',
        key: 'model',
      },
      {
        title: '钉钉版本',
        dataIndex: 'clientVersion',
        key: 'clientVersion',
      },
      {
        title: '策略生效时间',
        dataIndex: 'effectedTime',
        key: 'effectedTime',
      },
      {
        title: '设备激活时间',
        dataIndex: 'activateTime',
        key: 'activateTime',
      },
    ];
    return (
      <Table
        rowKey={'deviceid'}
        columns={columns}
        dataSource={expandedData[id]}
        pagination={false}
      />
    );
  };
  const onTableChange = (pagination1: any) => {
    setPagination(pagination1);
    setPagination(pagination1, (value: any) => {
      queryPushData1(value);
    });
  };
  const onExpand = (expanded: any, record: { id: any }) => {
    const { id } = record;
    if (!policyDetails[id]) {
      policyPushedDevices(id, policyId)
        .then((response) => {
          if (response.code === '0') {
            policyDetails[id] = (response.data && response.data.items && response.data.items) || [];
            expandedRowRender(id);
            setExpandedData(policyDetails);
          }
        })
        .catch((error) => {
          showErrorMessage(error);
        });
    }
  };
  const render = () => {
    return (
      <Drawer title="生效范围" width="800" open={visible} onClose={onCloseDrawer}>
        <Row>
          <Col offset={6} span={18}>
            <SearchBox
              placeholder="请输入账号、手机号码"
              defaultSearchKey={queryParams && queryParams.q}
              onSearch={onSearch}
            />
          </Col>
        </Row>
        <div className="pd-lr-20">
          <Table
            rowKey="id"
            loading={loading}
            columns={initTableEffect()}
            expandedRowRender={expandedRowRender}
            dataSource={dataEffect}
            onExpand={onExpand}
            pagination={pagination}
            onChange={onTableChange}
          />
        </div>
      </Drawer>
    );
  };
  return render();
});
