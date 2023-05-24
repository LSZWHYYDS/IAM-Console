import type { InputRef } from 'antd';
import { Form, Input, Table, Select, Checkbox } from 'antd';
import type { FormInstance } from 'antd/es/form';
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';

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
  const getInputComp = () => {
    switch (inputType) {
      case 'select':
        return <Select options={options} onBlur={save} />;
      case 'checkbox':
        return <Checkbox onChange={save} />;
      default:
        return <Input ref={inputRef} onPressEnter={save} onBlur={save} />;
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

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

const EditTable: React.FC = (props: any, ref) => {
  const [dataSource, setDataSource] = useState<any[]>(props.list.length && props.list);
  useEffect(() => {
    setDataSource(props.list.length && props.list);
  }, [props.list]);
  useImperativeHandle(ref, () => ({
    getData: () => {
      return (dataSource.length && dataSource) || [];
    },
  }));

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = props.columns.map((col: any) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record: any) => ({
        record,
        ...col,
        editable: () => {
          let editable;
          if (typeof col.editable === 'function') {
            editable = col.editable(record);
          } else {
            editable = col.editable;
          }
          return editable;
        },
        handleSave: props.handleSave,
      }),
    };
  });
  return (
    <div>
      <Table
        rowKey={props.rowKey}
        components={components}
        rowClassName={() => 'editable-row'}
        bordered={false}
        dataSource={dataSource}
        columns={columns as ColumnTypes}
        pagination={false}
        expandable={props.expandable}
      />
    </div>
  );
};

export default forwardRef(EditTable);
