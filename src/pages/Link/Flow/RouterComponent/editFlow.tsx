import React, { useEffect } from 'react';
import { EditOutlined } from '@ant-design/icons';
import type { ActionType } from '@ant-design/pro-components';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card } from 'antd';
import _ from 'lodash';
import { history } from 'umi';
import { useRef, useState } from 'react';
import { useLocation } from 'umi';
import { getFlowDefails } from '../service';
import ModifyPopupWindow from './BaseInfo/ModifyPopupWindow';
import FlowComp from './FlowComp';

const BaseInfoCom: React.FC<any> = () => {
  const location: any = useLocation();
  if (!location.query.id) {
    history.push('/link/flow');
  }
  const actionRef = useRef<ActionType>();
  const modifyRef = useRef<any>(null);
  const [flowData, setFlowData] = useState({});

  const getFlowData = async () => {
    const result = await getFlowDefails(location.query.id);
    setFlowData(result.data);
  };
  useEffect(() => {
    getFlowData();
  }, []);
  const reloadTableData = () => {
    actionRef?.current?.reload();
  };
  const getFlowPnl = () => {
    const clientHeight = document.body.clientHeight * 1.2;
    if (!flowData?.id) {
      return null;
    }
    const endNode = _.find(flowData?.config?.nodes || [], {
      renderKey: 'END',
    });
    const height = _.max([clientHeight, endNode?.y || 0]) * 1.2;
    //todo 添加节点后更新下面div高度
    console.log('height', height);
    return <FlowComp height={height} />;
  };
  return (
    <PageContainer title={false}>
      <Card
        title={'流名称: ' + flowData.name}
        size="small"
        extra={
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => modifyRef.current.showModal()}
          >
            编辑
          </Button>
        }
      >
        <ModifyPopupWindow
          ref={modifyRef}
          id={location.query.id}
          reloadTableData={reloadTableData}
          flowData={flowData}
          // getFlowData={getFlowData}
        />
        {getFlowPnl()}
      </Card>
    </PageContainer>
  );
};

export default BaseInfoCom;
