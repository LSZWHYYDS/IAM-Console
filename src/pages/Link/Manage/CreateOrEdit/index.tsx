import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Tabs, Row, Col } from 'antd';
import React, { useEffect, useState, useRef } from 'react';
import { history } from 'umi';
import { showErrorMessage, showSuccessMessage } from '@/utils/common.utils';
import BaseLinker from './BaseLinker';
import EventList from './EventList';
import ActionList from './ActionList';
import { getLink, editLink } from '../service';
import DbLinker from './DbLinker';
import HttpLinker from './HttpLinker';

const CreateOrEditLinker: React.FC = (props: any) => {
  const baseLinkerRef = useRef();
  const settingLinkerRef = useRef();
  const { location } = props;
  const { query } = location;
  const id = query.id;
  const defaultActiveKey = query.activeKey || 'basic';

  const [data, setData] = useState({});
  const onChange = (activeKey: string) => {
    // setactiveKey(activeKey);
    history.push(`/link/manage/edit?id=${id}&activeKey=` + activeKey);
  };
  const queryData = async () => {
    const result = await getLink(location.query.id);
    setData(result.data);
    if (baseLinkerRef?.current) {
      baseLinkerRef?.current?.setData(result.data);
    }
    if (settingLinkerRef.current) {
      settingLinkerRef.current.setData(result.data);
    }
  };
  useEffect(() => {
    queryData();
  }, []);
  const getComp = () => {
    if (!data) {
      return '';
    }
    const items = [
      {
        key: 'basic',
        label: '基本信息',
        children: <BaseLinker location={location} data={data} ref={baseLinkerRef} />,
      },
    ];
    if (data.type === 'DATABASE') {
      items.push({
        key: 'setting',
        label: '数据库配置',
        children: (
          <DbLinker location={location} data={data.data_base_info || {}} ref={settingLinkerRef} />
        ),
      });
    } else {
      items.push({
        key: 'setting',
        label: 'HTTP配置',
        children: <HttpLinker location={location} data={data} ref={settingLinkerRef} />,
      });
    }
    items.push({
      key: 'event',
      label: '触发事件',
      children: <EventList location={location} />,
    });
    items.push({
      key: 'action',
      label: '执行动作',
      children: <ActionList location={location} />,
    });
    console.log(defaultActiveKey);
    return <Tabs defaultActiveKey={defaultActiveKey} items={items} onChange={onChange} />;
  };
  const onCancel = () => {
    history.push(`/link/manage`);
  };
  const onSave = async () => {
    let baseData = data;
    if (baseLinkerRef.current) {
      const base = await baseLinkerRef.current.getData();
      baseData = {
        ...baseData,
        ...base,
      };
    }
    if (settingLinkerRef.current) {
      const settinginfo = await settingLinkerRef.current.getDataOnSave();
      if (baseData.type === 'HTTP') {
        baseData = {
          ...baseData,
          ...settinginfo,
        };
      } else {
        baseData.data_base_info = settinginfo;
      }
    }
    const p = editLink(baseData.id, baseData);
    p.then(() => {
      showSuccessMessage();
      history.push(`/link/manage`);
    }).catch((error: any) => {
      showErrorMessage(error.message);
    });
  };
  const getOpt = () => {
    if (['basic', 'setting'].includes(defaultActiveKey)) {
      return (
        <Row>
          <Col offset={6} span={6}>
            <Button onClick={onCancel}>取消</Button>
          </Col>
          <Col span={12}>
            <Button type="primary" onClick={onSave}>
              保存
            </Button>
          </Col>
        </Row>
      );
    }
  };
  return (
    <PageContainer title={false}>
      <Card>
        {getComp()}
        {getOpt()}
      </Card>
    </PageContainer>
  );
};
export default CreateOrEditLinker;
