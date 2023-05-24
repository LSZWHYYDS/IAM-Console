import _ from 'lodash';
import { Table } from 'antd';
import React, { useEffect, useState, forwardRef } from 'react';
import { updateNameInParams, updateFieldInParams, flatMapDepth } from '@/utils/common.utils';

import { getActionsByIds, getTrigger } from '@/pages/Link/Manage/service';

type EditableTableProps = Parameters<typeof Table>[0];

interface DataType {
  ui_id: string;
  name: string;
  description: string;
  type: string;
  value_type: string;
  value: string;
  paraLevel?: string;
  sub_params: any;
}

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;
//props: nodeId 当前节点Id leftKey onAdd
const PreActionStart: React.FC = (props: any) => {
  const leftKey = props.leftKey || 'name';
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const [expandedRowKeysLeft, setExpandedRowKeysLeft] = useState<any[]>([]);
  const [leftDataList, setLeftDataList] = useState<DataType[]>([]);

  //触发对象的字典数据
  const [startDic, setStartDic] = useState({});
  const [preActionDataList, setPreActionDataList] = useState<any>();
  useEffect(() => {
    const triggerId = _.get(props.startObj, 'info.nodeData.config.start.trigger_id');
    if (triggerId) {
      getTrigger(triggerId).then((resp: any) => {
        setStartDic(resp.data);
      });
    } else {
      setStartDic({});
    }
    const preActionIds = _.map(props.preActionNodes, 'info.action.action_id');

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
  }, [props]);

  //如果输出参数有映射，就是动作输出，如果没有，就是api输出
  const getActionSchema = (obj) => {
    const actionId = _.get(obj, 'info.action.action_id');
    const actionDic = _.find(preActionDataList, {
      id: actionId,
    });
    if (actionDic) {
      const output_schema = _.get(actionDic, 'config.output_schema');
      const schema = output_schema || _.get(actionDic, 'config.api_schema.output_schema') || {};
      return _.cloneDeep(schema);
    } else {
      const output_schema = _.get(obj, 'info.action.action_schema.output_schema');
      const schema =
        output_schema || _.get(obj, 'info.action.action_schema.api_schema.output_schema') || {};
      return _.cloneDeep(schema);
    }
  };
  const getStartPara = () => {
    let startParam;
    const { startObj } = props;
    if (startDic && startDic.config) {
      startParam = (startDic && _.cloneDeep(_.get(startDic, 'config.body_schema'))) || null;
    } else if (startObj) {
      startParam =
        (startObj && _.cloneDeep(_.get(startObj, 'info.nodeData.config.start.body_schema'))) ||
        null;
    }
    if (startParam) {
      startParam.description = _.get(startObj, 'info.nodeData.config.start_name');
      startParam.name = 'start';
      startParam.paraLevel = 'start';
      updateNameInParams([startParam]);
      return startParam;
    }
    return null;
  };
  const getLeftDataList = () => {
    const { preActionNodes } = props;
    const paraList: any[] = [];
    const startParam = getStartPara();
    if (!startParam && (!preActionNodes || preActionNodes.length === 0)) {
      return;
    }
    if (startParam) {
      paraList.push(startParam);
    }
    if (preActionNodes && preActionNodes.length) {
      preActionNodes.forEach((actionObj: any) => {
        const output_schema = getActionSchema(actionObj);
        if (output_schema) {
          const param1 = output_schema.header_schema || {};
          param1.description = '应答头';
          param1.name = 'header';
          param1.type = 'OBJECT';
          param1.paraLevel = 'header';
          param1.ui_id = 'header';
          const param2 = output_schema.body_schema || {};
          param2.description = '应答体';
          param2.name = 'body';
          param2.type = 'OBJECT';
          param2.paraLevel = 'body';
          param2.ui_id = 'body';
          const paramObj = {
            name: actionObj.id,
            description: actionObj.info.action.nodeName,
            type: 'OBJECT',
            paraLevel: 'action',
            sub_params: [param1, param2],
            ui_id: actionObj.id,
          };
          updateNameInParams([paramObj]);
          updateFieldInParams([paramObj], 'ui_id');
          paraList.push(paramObj);
        }
      });
    }
    const list = flatMapDepth(paraList, 'sub_params', 2);
    const ids1 = _.map(list, leftKey);
    const topList = _.map(paraList, leftKey);
    setExpandedRowKeysLeft([...topList, ...ids1]);
    setLeftDataList(paraList);
  };

  useEffect(() => {
    getLeftDataList();
  }, [startDic, preActionDataList]);

  const getLeftCol = () => {
    const leftColumns: (ColumnTypes[number] & { dataIndex: string })[] = [
      {
        title: '参数名',
        dataIndex: 'description',
        width: 200,
        ellipsis: true,
        render: (value, row) => {
          if (props.checkboxVisible) {
            return value;
          }
          return (
            <a title="点击添加到右侧表达式编辑框" onClick={() => props.onAdd(row.name)}>
              {value}
            </a>
          );
        },
      },
    ];
    return leftColumns;
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const onExpandByIdLeft = (expanded: boolean, name) => {
    const newList: any[] = _.cloneDeep(expandedRowKeysLeft) || [];
    if (expanded) {
      newList.push(name);
    } else {
      _.pull(newList, name);
    }
    setExpandedRowKeysLeft(newList);
  };
  const onExpandLeft = (expanded: boolean, record: object) => {
    onExpandByIdLeft(expanded, record[leftKey]);
  };

  const getLeftTable = () => {
    const startRenderKey = (props.startObj && _.get(props.startObj, 'renderKey')) || '';
    if (!leftDataList || (!startRenderKey && (!leftDataList || !leftDataList.length))) {
      return null;
    }
    const rowSelection =
      (props.checkboxVisible && {
        selectedRowKeys,
        type: 'radio',
        onChange: onSelectChange,
        getCheckboxProps: (record: DataType) => ({
          disabled: ['header', 'body', 'path', 'query', 'action', 'start'].includes(
            record.paraLevel,
          ),
          name: record[leftKey],
        }),
      }) ||
      null;
    return (
      <Table
        rowKey={leftKey || 'name'}
        rowSelection={rowSelection}
        size="small"
        dataSource={leftDataList}
        columns={getLeftCol() as ColumnTypes}
        pagination={false}
        expandable={{
          childrenColumnName: 'sub_params',
          defaultExpandAllRows: true,
          expandedRowKeys: expandedRowKeysLeft,
          onExpand: onExpandLeft,
        }}
      />
    );
  };
  const leftTable = getLeftTable();
  return leftTable;
};

export default forwardRef(PreActionStart);
