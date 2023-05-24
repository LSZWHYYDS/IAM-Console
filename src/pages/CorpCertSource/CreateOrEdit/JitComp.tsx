import { Checkbox, Col, Form, Select } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import OrgTreeSingle from '@/components/OrgTreeSingle';

const FormItem = Form.Item;

// const formItemLayout = {
//   labelCol: { span: 6 },
//   wrapperCol: { span: 12 },
// };

const JitComp: React.FC<any> = (props: any) => {
  const userGroupRef = useRef();
  const { form, data = {} } = props;
  const [jitGroupId, setJitGroupId] = useState('');
  const enable_jit = Form.useWatch('enable_jit', form);
  // 监听变量进行是否显示部门树
  const [isDepartmentTree, setIsDepartmentTree] = useState(
    data.jit_config?.group_type === 'select',
  );
  const handleChange = (value) => {
    setIsDepartmentTree(value === 'select');
  };
  useEffect(() => {
    console.log(props?.data);
    setJitGroupId(props?.data?.jit_config?.group_id || '');
    setIsDepartmentTree(data.jit_config?.group_type === 'select');
  }, [props.data]);
  const onShowNode = (node) => {
    return !node.readonly && node.key !== '-2';
  };
  const render = () => {
    const { formItemLayout = {} } = props;
    return (
      <>
        <Col span="24">
          <FormItem
            name="enable_jit"
            label="无匹配用户自动创建(JIT)"
            valuePropName="checked"
            initialValue={data.enable_jit}
            {...formItemLayout}
          >
            <Checkbox>开启</Checkbox>
          </FormItem>
        </Col>
        {enable_jit ? (
          <Col span="24">
            <FormItem
              name={['jit_config', 'update_user']}
              valuePropName="checked"
              label="JIT配置"
              {...formItemLayout}
            >
              <Checkbox>更新已有用户的属性</Checkbox>
            </FormItem>
          </Col>
        ) : null}

        {enable_jit ? (
          <Col span="24">
            <FormItem
              {...formItemLayout}
              name={['jit_config', 'group_type']}
              label="用户组"
              initialValue={'none'}
            >
              <Select
                placeholder="请选择是否指定用户组"
                onChange={handleChange}
                options={[
                  {
                    value: 'none',
                    label: '不指定用户组',
                  },
                  {
                    value: 'select',
                    label: '指定用户组',
                  },
                ]}
              />
            </FormItem>
          </Col>
        ) : null}
        <Col offset={formItemLayout.labelCol.span} span={24}>
          <div style={{ width: '51%' }}>
            {isDepartmentTree ? (
              <OrgTreeSingle
                checkedKeys={jitGroupId}
                ref={userGroupRef}
                onShowNode={onShowNode}
                onCheck={(checkedKeys) => {
                  setJitGroupId(checkedKeys);
                  props.onCheck(checkedKeys);
                }}
              />
            ) : (
              ''
            )}
          </div>
        </Col>
      </>
    );
  };
  return render();
};
export default JitComp;
