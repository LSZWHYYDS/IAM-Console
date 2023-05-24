import { Card } from 'antd';
import _ from 'lodash';
import { Table, Row, Col } from 'antd';
import React, { useEffect, useState, forwardRef, useImperativeHandle, useRef } from 'react';
import {
  updateNameInParams,
  updateFieldInParams,
  flatMapDepth,
  getUIID,
} from '@/utils/common.utils';

import ParamdDb from './ParamdDb';
import SqlForm from '../sqlForm';

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
//props: startObj, preActionNodes：前面的执行动作列表, leftTableDataList 左边表格数据
const ParamMappingDb: React.FC = (props: any, ref) => {
  const sqlFormRef = useRef<any>(null);
  const refIn = useRef();
  const refOut = useRef();
  const { actionObj } = props;
  const leftKey = props.leftKey || 'name';
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [param_schema_in, setParam_schema_in] = useState(
    props?.actionObj?.action_schema?.api_schema?.input_schema?.body_schema || [],
  );

  const [expandedRowKeysLeft, setExpandedRowKeysLeft] = useState<any[]>([]);
  const [leftDataList, setLeftDataList] = useState<DataType[]>([]);
  const [currentFocus, setCurrentFocus] = useState();
  useImperativeHandle(ref, () => ({
    getData: () => {
      const sqlValues = sqlFormRef.current.getData();
      const para = {
        config: {
          api_schema: {
            input_schema: {
              body_schema: refIn.current.getData(),
              sql_schema: sqlValues,
            },
            output_schema: {
              body_schema: refOut.current.getData(),
            },
          },
        },
      };
      return para;
    },
    setData: (newValue) => {
      sqlFormRef.current.setData(newValue.sql_schema.sql);
    },
  }));
  //如果输出参数有映射，就是动作输出，如果没有，就是api输出
  const getActionSchema = (obj) => {
    const { preActionDataList } = props;
    //todo actionDataList 只是当前连接器下的，要从所有连接器下的执行动作查询
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
    const { startObj, startDic } = props;
    let startParam;
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
    const { preActionNodes, leftTableDataList } = props;

    let paraList: any[] = [];
    const startParam = getStartPara();
    if (
      !startParam &&
      (!preActionNodes || preActionNodes.length === 0) &&
      (!leftTableDataList || !leftTableDataList.length)
    ) {
      return;
    }
    if (startParam) {
      paraList.push(startParam);
    }
    if (preActionNodes && preActionNodes.length) {
      preActionNodes.forEach((actionObjPara: any) => {
        const output_schema = getActionSchema(actionObjPara);
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
    if (leftTableDataList) {
      const newList = _.cloneDeep(leftTableDataList);
      updateNameInParams(newList);
      paraList = newList;
    }
    const list = flatMapDepth(paraList, 'sub_params', 2);
    const ids1 = _.map(list, leftKey);
    const topList = _.map(paraList, leftKey);
    setExpandedRowKeysLeft([...topList, ...ids1]);
    setLeftDataList(paraList);
  };

  useEffect(() => {
    getLeftDataList();
    const sql = props?.startObj?.action_schema?.api_schema?.input_schema?.sql_schema?.sql;
    sqlFormRef.current.addData(sql);
  }, [
    props.startDic,
    props.startObj,
    props.preActionNodes,
    props.leftTableDataList,
    props.preActionDataList,
  ]);
  const updateFieldValueBySelRow = (leftRow) => {
    console.log('currentFocus', currentFocus);
    const fieldName = leftRow.name;
    const fieldNames = fieldName && fieldName.split('.');
    const lastName = (fieldNames?.length && _.last(fieldNames)) || '';
    if (currentFocus === 'sql') {
      sqlFormRef.current.addData(lastName);
    } else if (currentFocus?.type) {
      const refObj = currentFocus.type === 'in' ? refIn : refOut;
      refObj.current.updateRowValue(currentFocus.row, lastName);
    }
  };
  const getLeftCol = () => {
    const leftColumns: (ColumnTypes[number] & { dataIndex: string })[] = [
      {
        title: '参数名',
        dataIndex: 'description',
        width: 200,
        ellipsis: true,
        render: (value, row) => {
          return (
            <a
              onClick={() => {
                updateFieldValueBySelRow(row);
              }}
            >
              {value}
            </a>
          );
        },
      },
    ];
    return leftColumns;
  };
  const onParserSqlSuccess = (res) => {
    const data = res.data || [];
    const dataList = data.map((item) => {
      return {
        name: ':' + item,
        value: '',
        ui_id: getUIID(),
      };
    });
    setParam_schema_in(dataList || []);
  };

  const onSelectChangeLeft = (newSelectedRowKeys: React.Key[], selectedRecords: any[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectedRows(selectedRecords);
    updateFieldValueBySelRow(selectedRecords[0]);
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
    const startRenderKey = _.get(props.startObj, 'renderKey');
    if (
      !leftDataList ||
      (startRenderKey === 'NODESTARTTIME' && (!leftDataList || !leftDataList.length))
    ) {
      return null;
    }
    const rowSelection = {
      selectedRowKeys,
      type: 'radio',
      onChange: onSelectChangeLeft,
      getCheckboxProps: (record: DataType) => ({
        disabled: ['header', 'body', 'path', 'query', 'action', 'start'].includes(record.paraLevel),
        name: record[leftKey],
      }),
    };
    return (
      <Col span={9}>
        <Card title={props.leftTitle || ''} size="small">
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
        </Card>
      </Col>
    );
  };
  const leftTable = getLeftTable();
  const rightCol = (leftTable && 14) || 24;
  const offset = (leftTable && 1) || 0;
  const param_schema_out =
    props?.actionObj?.action_schema?.api_schema?.output_schema?.body_schema || [];
  return (
    <Row>
      {leftTable}
      <Col offset={offset} span={rightCol}>
        <SqlForm
          ref={sqlFormRef}
          sql={props?.actionObj?.action_schema?.api_schema?.input_schema?.sql_schema?.sql}
          parserSqlSuccess={onParserSqlSuccess}
          onFocus={() => {
            setCurrentFocus('sql');
          }}
        />
        <Card title="入参映射" size="small">
          <ParamdDb
            list={param_schema_in || []}
            ref={refIn}
            onFocus={(row) => {
              setCurrentFocus({
                type: 'in',
                row,
              });
            }}
          />
        </Card>
        <Card title="出参配置" size="small">
          <ParamdDb
            list={param_schema_out || []}
            ref={refOut}
            onFocus={(row) => {
              setCurrentFocus({
                type: 'out',
                row,
              });
            }}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default forwardRef(ParamMappingDb);
