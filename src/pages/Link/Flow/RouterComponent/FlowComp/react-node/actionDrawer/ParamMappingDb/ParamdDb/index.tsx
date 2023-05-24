import { CloseOutlined, PlusCircleOutlined } from '@ant-design/icons';
import type { InputRef } from 'antd';
import _ from 'lodash';
import { Form, Input, Popconfirm, Table, Select, Checkbox } from 'antd';
import type { FormInstance } from 'antd/es/form';
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import styles from './index.less';
import { getDefaultRootParam, getNewField } from '@/pages/Link/common';
import { showErrorMessage, flatMapDeep } from '@/utils/common.utils';

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
  ui_id: string;
  name: string;
  description: string;
  type: string;
  value_type: string;
  value: string;
  sub_params: [Item];
}

interface EditableRowProps {
  index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof Item;
  record: Item;
  required: boolean;
  inputType: string;
  options?: any;
  handleSave: (record: Item) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  inputType,
  required,
  record,
  options,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current!.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();

      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };
  const onChange = (e) => {
    const newObj = {};
    newObj[dataIndex] = e.target.value;
    handleSave({ ...record, ...newObj });
  };
  const getInputComp = () => {
    switch (inputType) {
      case 'select':
        return <Select options={options} onBlur={save} />;
      case 'checkbox':
        return <Checkbox onChange={save} />;
      default:
        return <Input ref={inputRef} onPressEnter={save} onBlur={save} onChange={onChange} />;
    }
  };

  let childNode = children;
  if (editable) {
    const valuePropName =
      (inputType === 'checkbox' && {
        valuePropName: 'checked',
      }) ||
      {};
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: !!required,
            message: `${title} 必填.`,
          },
        ]}
        {...valuePropName}
      >
        {getInputComp()}
      </Form.Item>
    ) : (
      <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }} onClick={toggleEdit}>
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table>[0];

// sub_params (Array[ParamProfile], optional): 子参数，当type为object时才有意义 ,
// type (string): 数据类型 = ['STRING', 'BOOLEAN', 'NUMBER', 'OBJECT']stringEnum:"STRING", "BOOLEAN", "NUMBER", "OBJECT",
// value (string): 映射值 ,
// value_type (string): 映射类型 = ['JSON_PATH', 'FIX_VALUE',
interface DataType {
  ui_id: string;
  name: string;
  description: string;
  type: string;
  value_type: string;
  value: string;
  sub_params: any;
}

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

const ParamdDb: React.FC = (props: any, ref) => {
  const [dataSource, setDataSource] = useState<DataType[]>(
    (props.list && props.list.length && props.list) || getDefaultRootParam(),
  );
  const { onChange } = props;

  useEffect(() => {
    const defList = getDefaultRootParam();
    const list = (props.list && props.list.length && props.list) || defList;
    setDataSource(list);
  }, [props.list]);

  useImperativeHandle(ref, () => ({
    getData: () => {
      const list = flatMapDeep(dataSource, 'sub_params');
      const hasNullValues = _.find(list, {
        name: '',
      });
      if (hasNullValues) {
        return false;
      }
      return (dataSource?.length && dataSource) || [];
    },
    updateRowValue: (row, fieldValue) => {
      const list = _.cloneDeep(dataSource);
      const newRow = _.find(list, {
        ui_id: row.ui_id,
      });
      newRow.value = fieldValue;
      setDataSource(list);
    },
  }));

  const deleteRow = (list: any, delId: string) => {
    const deledted = _.remove(list, {
      ui_id: delId,
    });
    if (!deledted.length) {
      let num = 0;
      while (num < list.length) {
        const item = list[num];
        const has = item.sub_params && deleteRow(item.sub_params, delId);
        if (has) {
          return true;
        }
        num += 1;
      }
      return false;
    }
    return true;
  };

  const onDelete = (ui_id: string) => {
    const newData = _.cloneDeep(dataSource);
    deleteRow(newData, ui_id);
    setDataSource(newData);
    if (typeof onChange === 'function') {
      onChange(newData);
    }
  };
  const renderDelOp = (record: DataType) => {
    return (
      <Popconfirm
        key="del"
        title="确定要删除吗?"
        okText="确定"
        cancelText="取消"
        onConfirm={() => onDelete(record.ui_id)}
      >
        <a key="DEL">
          <CloseOutlined
            style={{
              color: 'red',
            }}
            className={styles.iconInRow}
          />
        </a>
      </Popconfirm>
    );
  };
  const addBrotherToList = (dataList: any, brotherRow: DataType) => {
    if (dataList) {
      if (
        _.find(dataList, {
          ui_id: brotherRow.ui_id,
        })
      ) {
        dataList.push(getNewField());
        return true;
      } else {
        let index = 0;
        while (index < dataList.length) {
          const added = addBrotherToList(dataList[index], brotherRow);
          if (added) {
            return true;
          }
          index += 1;
        }
        return false;
      }
    }
    return false;
  };
  const onAddBrother = (brotherRow: any) => {
    const newList = _.cloneDeep(dataSource);
    addBrotherToList(newList, brotherRow);
    setDataSource(newList);
    if (typeof onChange === 'function') {
      onChange(newList);
    }
  };
  const renderAddBrotherMenu = (record: DataType) => {
    return (
      <a
        key="add"
        title="添加兄弟节点"
        onClick={() => {
          onAddBrother(record);
        }}
      >
        <PlusCircleOutlined key="addBrother" className={styles.iconInRow} />
      </a>
    );
  };

  const getNullValue = (value) => {
    return value || '  ';
  };

  const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
    {
      title: '参数名',
      dataIndex: 'name',
      width: 300,
      editable: props.readOnly !== true,
      required: true,
      render: getNullValue,
    },
    {
      title: '参数值',
      dataIndex: 'value',
      editable: props.readOnly !== true,
      width: 300,
      onFocus: (row) => {
        if (props.onFocus) {
          props.onFocus(row);
        }
      },
      render: getNullValue,
    },
  ];

  if (!props.readOnly) {
    defaultColumns.push({
      title: '操作',
      dataIndex: 'operation',
      width: 200,
      render: (value: any, record: DataType) => [renderAddBrotherMenu(record), renderDelOp(record)],
    });
  }

  //检查名城是否重复
  const checkNameRepeat = (list: any, row: DataType) => {
    const index = _.findIndex(list, (item: any) => {
      return item.name === row.name && item.ui_id !== row.ui_id;
    });
    return index;
  };
  const updateRow = (list: any, row: DataType) => {
    const index = list.findIndex((item: any) => row.ui_id === item.ui_id);
    if (index === -1) {
      let num = 0;
      while (num < list.length) {
        const item = list[num];
        const has = item.sub_params && updateRow(item.sub_params, row);
        if (has) {
          return true;
        }
        num += 1;
      }
      return false;
    } else {
      const repeatIndex = checkNameRepeat(list, row);
      if (repeatIndex !== -1) {
        showErrorMessage('名称[' + row.name + ']重复，重复行：' + (repeatIndex + 1));
        return false;
      }
      const item = list[index];
      list.splice(index, 1, {
        ...item,
        ...row,
      });
      return true;
    }
  };
  const handleSave = (row: DataType) => {
    const newData = [...dataSource];
    updateRow(newData, row);
    setDataSource(newData);
    if (typeof onChange === 'function') {
      onChange(newData);
    }
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        ...col,
        editable: col.editable,
        handleSave,
        onFocus: () => col.onFocus && col.onFocus(record),
      }),
    };
  });

  return (
    <div>
      <Table
        rowKey="ui_id"
        components={components}
        rowClassName={() => 'editable-row'}
        bordered={false}
        dataSource={dataSource}
        columns={columns as ColumnTypes}
        pagination={false}
      />
    </div>
  );
};

export default forwardRef(ParamdDb);
