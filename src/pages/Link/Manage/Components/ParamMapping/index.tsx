import { Card, Input, message, Modal, Space } from 'antd';
import _ from 'lodash';
import { Table, Row, Col, Dropdown, Form } from 'antd';
import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { getDefaultRootParam } from '@/pages/Link/common';
import {
  genFieldListFromParams,
  findInPara,
  updateNameInParams,
  updateFieldInParams,
  flatMapDepth,
} from '@/utils/common.utils';
import {
  NodeIndexOutlined,
  StopOutlined,
  CalculatorOutlined,
  FunctionOutlined,
} from '@ant-design/icons';
import AceEditorComp from '@/components/AceEditorComp';
import PreActionStart from '../PreActionStart';

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
const ParamMapping: React.FC = (props: any, ref) => {
  let hasLeftTable = true; //是否为触发器开始的
  const leftKey = props.leftKey || 'name';
  const [formFixValue] = Form.useForm();
  const [currentRow, setCurrentRow] = useState<any>({});
  const [codeValue, setCodeValue] = useState(currentRow.value || '');
  const [fixValueVisible, setFixValueVisible] = useState(false);
  const [exprVisible, setExprVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState<any[]>([]);
  const [fieldDicList, setFieldDicList] = useState<any[]>([]);

  const [expandedRowKeysLeft, setExpandedRowKeysLeft] = useState<any[]>([]);
  const [rightList, setDataSource] = useState<DataType[]>(
    (props.list && props.list.length && props.list) || getDefaultRootParam(),
  );
  const [leftDataList, setLeftDataList] = useState<DataType[]>([]);
  const { onChange } = props;
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
    if (leftTableDataList) {
      const newList = _.cloneDeep(leftTableDataList);
      updateNameInParams(newList);
      paraList = newList;
    }
    const fieldDicLists = genFieldListFromParams(paraList || []);
    const list = flatMapDepth(paraList, 'sub_params', 2);
    const ids1 = _.map(list, leftKey);
    const topList = _.map(paraList, leftKey);
    setExpandedRowKeysLeft([...topList, ...ids1]);
    setLeftDataList(paraList);
    setFieldDicList(fieldDicLists);
  };

  useEffect(() => {
    getLeftDataList();
  }, [
    props.startDic,
    props.startObj,
    props.preActionNodes,
    props.leftTableDataList,
    props.preActionDataList,
  ]);

  useEffect(() => {
    const list = (props.list && props.list.length && props.list) || [];
    setDataSource(list);
    const ids = _.map(list, 'ui_id');
    setExpandedRowKeys(ids);
  }, [props.list]);
  useImperativeHandle(ref, () => ({
    getData: () => {
      return (rightList.length && rightList) || [];
    },
  }));

  const getLeftCol = () => {
    const leftColumns: (ColumnTypes[number] & { dataIndex: string })[] = [
      {
        title: '参数名',
        dataIndex: 'description',
        width: 200,
        ellipsis: true,
      },
    ];
    return leftColumns;
  };
  const onLink = (row: any) => {
    if (!selectedRowKeys.length) {
      message.error('请在左边选中要映射参数');
      return;
    }
    const list = _.cloneDeep(rightList);
    const currRow = findInPara(list, row.ui_id);
    currRow.value = selectedRows[0].fullName || selectedRows[0].name;
    currRow.value_type = 'JSON_PATH';
    setDataSource(list);
    if (typeof onChange === 'function') {
      onChange(list);
    }
  };
  const onUnLink = (row: any) => {
    const list = _.cloneDeep(rightList);
    const currRow = findInPara(list, row.ui_id);
    currRow.value = '';
    setDataSource(list);
    if (typeof onChange === 'function') {
      onChange(list);
    }
  };
  const onClickMore = (key: string, row: any) => {
    setCurrentRow(row);
    if (key === 'fixValue') {
      setFixValueVisible(true);
      formFixValue.setFieldValue('fixValue', (row.value_type === 'FIX_VALUE' && row.value) || '');
    } else {
      setCodeValue(row.value);
      setExprVisible(true);
    }
  };
  const getJSFixValueBtns = (row) => {
    return (
      <Space>
        <a title="表达式" onClick={() => onClickMore('js', row)}>
          <CalculatorOutlined />
        </a>
        <a title="固定值" onClick={() => onClickMore('fixValue', row)}>
          <FunctionOutlined />
        </a>
      </Space>
    );
  };
  const getRightCol = () => {
    const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
      {
        title: '参数名',
        dataIndex: 'description',
        width: 150,
        ellipsis: true,
      },
      {
        title: '映射值',
        dataIndex: 'value',
        width: 200,
        ellipsis: true,
        render: (text, row: any) => {
          const obj =
            (row.value_type === 'JSON_PATH' &&
              _.find(fieldDicList, {
                value: text,
              })) ||
            null;
          return (obj && obj.label) || text;
        },
      },
      {
        title: '映射',
        dataIndex: 'op',
        width: 50,
        render: (val, row: any) => {
          const fields = 'header,body,query,path';
          if (
            fields.includes(row.name) ||
            ['header', 'body', 'path', 'query', 'action', 'start'].includes(row.paraLevel)
          ) {
            return null;
          }
          const items = [
            {
              label: '固定值',
              key: 'fixValue',
            },
            {
              label: '表达式',
              key: 'js',
            },
          ];
          const jsFixValueBtns = getJSFixValueBtns(row);
          if (!hasLeftTable) {
            return jsFixValueBtns;
          }
          const cancelBtn =
            (hasLeftTable && row.value && (
              <a onClick={() => onUnLink(row)}>
                <StopOutlined />
              </a>
            )) ||
            null;
          return (
            <Space>
              {(hasLeftTable && (
                <a title="点击可以与左边选中参数映射" onClick={() => onLink(row)}>
                  <NodeIndexOutlined />
                </a>
              )) ||
                null}
              {cancelBtn}
              <Dropdown
                menu={{
                  items,
                  onClick: ({ key }) => {
                    onClickMore(key, row);
                  },
                }}
              >
                <a>...</a>
              </Dropdown>
            </Space>
          );
        },
      },
    ];
    return defaultColumns;
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[], selectedRecords: any[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectedRows(selectedRecords);
  };
  const onSetFixValue = () => {
    formFixValue.validateFields().then((values) => {
      const list = _.cloneDeep(rightList);
      const currRow = findInPara(list, currentRow.ui_id);
      currRow.value = values.fixValue;
      currRow.value_type = 'FIX_VALUE';
      setDataSource(list);
      setFixValueVisible(false);
      if (typeof onChange === 'function') {
        onChange(list);
      }
      formFixValue.resetFields();
    });
  };
  const onSetExprValue = () => {
    const list = _.cloneDeep(rightList);
    const currRow = findInPara(list, currentRow.ui_id);
    currRow.value = codeValue;
    currRow.value_type = 'JS_EXP';
    setDataSource(list);
    setExprVisible(false);
    if (typeof onChange === 'function') {
      onChange(list);
    }
  };
  const onAddToExp = (value) => {
    setCodeValue((codeValue || '') + ' ' + value);
  };

  const renderEditor = () => {
    return (
      <Modal
        open={exprVisible}
        title="表达式"
        width={1000}
        onCancel={() => {
          setExprVisible(false);
        }}
        onOk={() => {
          onSetExprValue();
        }}
      >
        <Row>
          {(hasLeftTable && props.nodeId && (
            <Col span={8}>
              <PreActionStart
                startObj={props.startObj}
                preActionNodes={props.preActionNodes}
                leftKey="ui_id"
                onAdd={onAddToExp}
              />
            </Col>
          )) ||
            null}
          <Col span={(hasLeftTable && 16) || 24}>
            <AceEditorComp
              value={codeValue} //
              onChange={(value: string) => setCodeValue(value)} // 获取输入框的 代码
            />
          </Col>
        </Row>
      </Modal>
    );
  };
  const renderFixValue = () => {
    return (
      <Modal
        open={fixValueVisible}
        title="固定值"
        destroyOnClose
        onCancel={() => {
          formFixValue.resetFields();
          setFixValueVisible(false);
        }}
        onOk={() => {
          onSetFixValue();
        }}
      >
        <Form form={formFixValue}>
          <Form.Item label="固定值" name="fixValue">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    );
  };
  const onExpandById = (expanded: boolean, ui_id) => {
    const newList: any[] = _.cloneDeep(expandedRowKeys) || [];
    if (expanded) {
      newList.push(ui_id);
    } else {
      _.pull(newList, ui_id);
    }
    setExpandedRowKeys(newList);
  };
  const onExpand = (expanded: boolean, record: object) => {
    onExpandById(expanded, record.ui_id);
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
      hasLeftTable = false;
      return null;
    }
    const rowSelection = {
      selectedRowKeys,
      type: 'radio',
      onChange: onSelectChange,
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
  return (
    <Row>
      {leftTable}
      {renderFixValue()}
      {renderEditor()}
      <Col offset={offset} span={rightCol}>
        <Card title={props.rightTitle || ''} size="small">
          <Table
            rowKey="ui_id"
            rowClassName={() => 'editable-row'}
            bordered={false}
            dataSource={rightList}
            columns={getRightCol() as ColumnTypes}
            pagination={false}
            expandable={{
              childrenColumnName: 'sub_params',
              defaultExpandAllRows: true,
              expandedRowKeys,
              onExpand,
            }}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default forwardRef(ParamMapping);
