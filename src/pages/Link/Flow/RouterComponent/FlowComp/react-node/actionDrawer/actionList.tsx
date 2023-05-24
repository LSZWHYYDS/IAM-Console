import { forwardRef, useEffect, useRef, useState, useImperativeHandle } from 'react';
import { Button, Select, Card } from 'antd';
import _ from 'lodash';
import { UnorderedListOutlined } from '@ant-design/icons';
import { getEnableActionList, getActionsByIds, getTrigger } from '@/pages/Link/Manage/service';
import styles from './index.less';
import ParamMapping from '@/pages/Link/Manage/Components/ParamMapping';
import ParamMappingDb from './ParamMappingDb';
import { getAllData, getPreActionNodes, getMinSecond } from '../../common';

const ActionList = (props: any, ref) => {
  //当前执行动作节点数据
  const { actionObj } = props;
  const refMappingHeader = useRef<any>(null);
  const paramMappingDbRef = useRef();

  const [actionDataList, setActionDataList] = useState<any>();
  const [selectId, setSelectId] = useState((actionObj && actionObj.action_id) || '');
  const [currAction, setCurrAction] = useState<any>(actionObj);
  //触发事件对象
  const [startObj, setStartObj] = useState({});
  //触发对象的字典数据
  const [startDic, setStartDic] = useState({});
  const [preActionNodes, setPreActionNodes] = useState([]);
  const [preActionDataList, setPreActionDataList] = useState<any>();
  useEffect(() => {
    if (props.connectObj) {
      getEnableActionList(props.connectObj.id).then((rs) => {
        setActionDataList(
          rs.data.filter((item) => {
            return !!item.config;
          }),
        );
        if (props.connectObj.id !== currAction.api_link_id) {
          setSelectId('');
        }
      });
    } else {
      setActionDataList([]);
    }
    getAllData((data: any) => {
      const { nodes } = data;
      const startNode = _.find(nodes, (item) => {
        return ['NODETRIGGER', 'NODESTARTTIME'].includes(item.renderKey);
      });
      if (!startNode) {
        return;
      }
      setStartObj(startNode);
      const preActionNodeList = getPreActionNodes({ ...data, nodeId: props.nodeId }) || [];
      setPreActionNodes(preActionNodeList);
    });
  }, [props]);
  useEffect(() => {
    const preActionIds = _.map(preActionNodes, 'info.action.action_id');

    const noNullIds = _.filter(preActionIds, (id) => {
      return !!id;
    });
    if (noNullIds.length) {
      getActionsByIds(noNullIds.join(',')).then((rs) => {
        setPreActionDataList(
          rs.data.filter((item) => {
            return !!item.config;
          }),
        );
      });
    } else {
      setPreActionDataList([]);
    }
  }, [preActionNodes]);
  useEffect(() => {
    const triggerId = _.get(startObj, 'info.nodeData.config.start.trigger_id');
    if (triggerId) {
      getTrigger(triggerId).then((resp: any) => {
        setStartDic(resp.data);
      });
    } else {
      setStartDic({});
    }
  }, [startObj]);

  useImperativeHandle(ref, () => ({
    getData: () => {
      let actionData = _.find(actionDataList, {
        id: selectId,
      });
      if (props.connectObj.type === 'HTTP') {
        const dataList = refMappingHeader.current.getData();
        actionData.config.api_schema.input_schema = {
          header_schema: dataList.length >= 1 && dataList[0],
          body_schema: dataList.length >= 2 && dataList[1],
          query_schema: dataList.length >= 3 && dataList[2],
          path_schema: dataList.length >= 4 && dataList[3],
        };
        return actionData;
      }
      actionData = paramMappingDbRef.current.getData();
      return actionData;
    },
  }));
  const returnListHandle = () => {
    props.modifyToggleHandle();
  };

  const selectHandle = (key: any) => {
    setSelectId(key);
    const obj = _.find(actionDataList, {
      id: key,
    });
    setCurrAction(obj);
    props.onSelect(obj);
  };
  //如果在连接器那里开启了入参映射就是，就是执行动作的入参，否则就api入参
  const getActionSchema = (obj) => {
    let oldApi_schema = null;
    if (obj && actionObj && actionObj.action_id === obj.id) {
      oldApi_schema = actionObj.action_schema?.api_schema.input_schema || {};
    }
    const input_schema = _.get(obj, 'config.input_schema');

    const newApi_schema = input_schema || _.get(obj, 'config.api_schema.input_schema') || {};
    //如果原来有值，更新到新数组中 todo
    return oldApi_schema || newApi_schema;
  };
  const renderInPara = () => {
    if (props.connectObj.type === 'DATABASE') {
      return null;
    }
    if (!selectId || !actionDataList) {
      return;
    }
    const obj = _.find(actionDataList, {
      id: selectId,
    });
    const schema = getActionSchema(obj);
    const header_schemaIn = schema.header_schema || {};
    header_schemaIn.description = '请求头';
    header_schemaIn.name = 'header_schema';
    header_schemaIn.type = 'OBJECT';
    header_schemaIn.paraLevel = 'header';
    if (!header_schemaIn.ui_id) {
      header_schemaIn.ui_id = 'action_header_' + getMinSecond();
    }

    const body_schemaIn = schema.body_schema || {};
    body_schemaIn.description = '请求体';
    body_schemaIn.name = 'body_schema';
    body_schemaIn.type = 'OBJECT';
    body_schemaIn.isParam = false;
    body_schemaIn.paraLevel = 'body';
    if (!body_schemaIn.ui_id) {
      body_schemaIn.ui_id = 'action_body_' + getMinSecond();
    }
    const query_schemaIn = schema?.query_schema || {};
    query_schemaIn.description = 'Query参数';
    query_schemaIn.name = 'query_schema';
    query_schemaIn.type = 'OBJECT';
    query_schemaIn.paraLevel = 'query';
    if (!query_schemaIn.ui_id) {
      query_schemaIn.ui_id = 'action_query_' + getMinSecond();
    }
    const path_schemaIn = schema.path_schema || {};
    path_schemaIn.description = 'Path参数';
    path_schemaIn.name = 'path_schema';
    path_schemaIn.type = 'OBJECT';
    path_schemaIn.paraLevel = 'path';
    if (!path_schemaIn.ui_id) {
      path_schemaIn.ui_id = 'action_path_' + getMinSecond();
    }
    return (
      <>
        <h3 style={{ marginTop: '10px' }}>执行动作</h3>
        <Select
          style={{ width: '100%' }}
          placeholder="请选择执行动作名称"
          // defaultValue={selectId}
          value={selectId}
          allowClear
          options={actionDataList}
          fieldNames={{ label: 'name', value: 'id' }}
          onSelect={selectHandle}
        />
        <Card title="入参映射" size="small">
          <ParamMapping
            list={[header_schemaIn, body_schemaIn, query_schemaIn, path_schemaIn] || []}
            ref={refMappingHeader}
            startObj={startObj}
            startDic={startDic}
            preActionNodes={preActionNodes || []}
            actionDataList={actionDataList}
            preActionDataList={preActionDataList}
            leftKey="ui_id"
            nodeId={props.nodeId}
          />
        </Card>
      </>
    );
  };
  const renderInParaDb = () => {
    if (props.connectObj.type === 'DATABASE') {
      return (
        <>
          <Card title="入参映射" size="small">
            <ParamMappingDb
              ref={paramMappingDbRef}
              actionObj={actionObj}
              startObj={startObj}
              startDic={startDic}
              preActionNodes={preActionNodes || []}
              actionDataList={actionDataList}
              preActionDataList={preActionDataList}
              leftKey="ui_id"
              nodeId={props.nodeId}
              connectObj={props.connectObj}
              selectHandle={selectHandle}
            />
          </Card>
        </>
      );
    }
    return null;
  };
  const render = () => {
    const { connectObj } = props;
    if (!connectObj) {
      return null;
    }

    return (
      <>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <img
              src={connectObj?.icon || '/uc/images/link/connect.png'}
              className={styles.imgClass}
              style={{ marginLeft: '0' }}
            />
            <span>{connectObj.name}</span>
          </div>
          <div>
            <Button onClick={() => returnListHandle()} icon={<UnorderedListOutlined />}>
              切换其他
            </Button>
          </div>
        </div>

        {renderInPara()}
        {renderInParaDb()}
      </>
    );
  };
  return render();
};

export default forwardRef(ActionList);
