import { Button, Form, Input, Popconfirm, Select, Table } from 'antd';
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
} from 'react';
import tagAPI from '../tagAPI';
const EditableContext = React.createContext(null);
const { Option } = Select;

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  fieldType,
  children,
  dataIndex,
  record,
  options,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    // form.setFieldsValue({
    //   [dataIndex]: record[dataIndex],
    // });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      handleSave({ ...record, ...values });
      toggleEdit();
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;
  let optionsList = options;
  const typeValue = form.getFieldValue('type');
  if (dataIndex === 'attribute') {
    optionsList = options[typeValue] || [];
  }
  if (editable) {
    childNode = (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        // rules={[
        //   {
        //     required: true,
        //     message: `${title} is required.`,
        //   },
        // ]}
        initialValue={record[dataIndex]}
      >
        {(fieldType === 'select' && (
          <Select ref={inputRef} options={optionsList} onPressEnter={save} onBlur={save} />
        )) || <Input ref={inputRef} onPressEnter={save} onBlur={save} />}
      </Form.Item>
    );
  }
  delete restProps.fieldType;
  delete restProps.onPressEnter;
  delete restProps.options;
  return <td {...restProps}>{childNode}</td>;
};

const EditTagDynamicField = forwardRef((props, ref) => {
  const [userFields, setUserFields] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [count, setCount] = useState(2);
  useEffect(() => {
    tagAPI.getUserAttrs().then((res) => {
      setUserFields(
        res.data.items.map((item) => {
          return { label: item.display_name, value: item.domain_name };
        }),
      );
    });
  }, []);
  useEffect(() => {
    setDataSource(props.dataList);
  }, [props.dataList]);
  const handleDelete = (field_id) => {
    const newData = dataSource.filter((item) => item.field_id !== field_id);
    setDataSource(newData);
  };
  const getFields = () => {
    return dataSource;
  };
  useImperativeHandle(ref, () => ({
    getFields,
  }));

  const defaultColumns = [
    {
      title: '分类',
      dataIndex: 'type',
      width: '20%',
      editable: true,
      fieldType: 'select',
      options: [
        {
          value: 'user',
          label: '用户',
        },
        {
          value: 'device',
          label: '设备',
        },
      ],
    },
    {
      title: '属性',
      dataIndex: 'attribute',
      width: '20%',
      editable: true,
      fieldType: 'select',
      options: {
        user: userFields,
        device: [],
      },
    },
    {
      title: '条件',
      dataIndex: 'op',
      width: '20%',
      editable: true,
      fieldType: 'select',
      options: [
        {
          value: 'eq',
          label: '=',
        },
        {
          value: 'ne',
          label: '!=',
        },
        {
          value: 'gt',
          label: '>',
        },
        {
          value: 'ge',
          label: '>=',
        },
        {
          value: 'lt',
          label: '<',
        },
        {
          value: 'le',
          label: '<=',
        },
        {
          value: 'sw',
          label: 'start with',
        },
        {
          value: 'ew',
          label: 'end with',
        },
        {
          value: 'co',
          label: 'contains',
        },
        {
          value: 'pr',
          label: 'present(has value)',
        },
      ],
    },
    {
      title: '值',
      dataIndex: 'value',
      width: '20%',
      editable: true,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: '20%',
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <Popconfirm
            title="确定删除吗?"
            okText="确定"
            cancelText="取消"
            onConfirm={() => handleDelete(record.field_id)}
          >
            <a>删除</a>
          </Popconfirm>
        ) : null,
    },
  ];
  const handleAdd = () => {
    const newData = {
      field_id: Date.now().toString(),
      type: 'user',
      attribute: '',
      op: 'eq',
      value: '',
    };
    setDataSource([...dataSource, newData]);
    setCount(count + 1);
  };

  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.field_id === item.field_id);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    setDataSource(newData);
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
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        options: col.options,
        fieldType: col.fieldType,
        handleSave,
      }),
    };
  });
  return (
    <div>
      <Button
        onClick={handleAdd}
        type="primary"
        style={{
          marginBottom: 16,
        }}
      >
        增加条件
      </Button>
      <Table
        rowKey="field_id"
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={dataSource}
        columns={columns}
      />
    </div>
  );
});

export default EditTagDynamicField;
