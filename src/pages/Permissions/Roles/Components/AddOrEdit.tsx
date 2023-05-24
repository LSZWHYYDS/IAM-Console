import React, { useState } from 'react';
import { Drawer, Tabs, Space, Button, Checkbox, Form, Input, message } from 'antd';
import PermSetTree from './PermSetTree';
import { addRole, editRole } from '../../service';
import { validateName } from '@/utils/validator';
import type { RoleType } from '../../data';

const { TabPane } = Tabs;

interface DrawerProps {
  drawerVisible: boolean;
  canEdit: boolean;
  isAddCont?: boolean;
  onClose: (flag?: boolean) => void;
  onAdd?: (isAddCont: boolean) => void;
  role?: RoleType;
}

const FormItem = Form.Item;
const formLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};
const { TextArea } = Input;

const AddOrEditRole: React.FC<DrawerProps> = (props) => {
  const [form] = Form.useForm();
  const { drawerVisible, canEdit, isAddCont, onClose: setDrawerVisible, onAdd, role } = props;
  const [currentTab, setCurrentTab] = useState<string>('1');
  const [permission_sets, setPermission_sets] = useState(props.role?.permission_sets || []);
  const [addCont, setAddCont] = useState(isAddCont);

  const onSave = async () => {
    const fn = (role && role.name && editRole) || addRole;
    try {
      let values = await form.validateFields();
      if (!values.name) {
        values = props.role;
      }
      values.permission_sets = permission_sets;
      values.tags = [];
      const addResult = await fn(values);
      if (addResult.error === '0') {
        setDrawerVisible(false);
        if (addCont && typeof onAdd === 'function') {
          onAdd(addCont);
        }
        message.success('保存成功。');
      } else {
        message.success('保存失败。');
      }
    } catch (error) {
      message.success('保存失败。');
    }
  };
  const onCheckPerm = (chekedPerm: any) => {
    setPermission_sets(chekedPerm);
  };
  const validateRoleName = function (_rule: any, value: string, callback: any) {
    validateName(_rule, value, callback, '角色名称格式不正确');
  };
  return (
    <Drawer
      title={`${role ? '编辑' : '添加'}角色`}
      closable={true}
      maskClosable={false}
      width={'600px'}
      bodyStyle={{ backgroundColor: '#f1f2f6' }}
      open={drawerVisible}
      onClose={() => {
        setDrawerVisible(false);
      }}
      footerStyle={{ display: 'flex', justifyContent: 'flex-end' }}
      footer={
        <Space>
          {!(role && role.name) && (
            <Checkbox
              checked={addCont}
              onChange={() => {
                setAddCont(true);
              }}
            >
              继续添加
            </Checkbox>
          )}
          <Button onClick={() => setDrawerVisible(false)}>取消</Button>
          {canEdit && (
            <Button type="primary" onClick={onSave}>
              保存
            </Button>
          )}
        </Space>
      }
    >
      <Form form={form} {...formLayout} initialValues={role}>
        <Tabs
          defaultActiveKey="1"
          activeKey={currentTab}
          onChange={(activeKey: string) => setCurrentTab(activeKey)}
        >
          <TabPane tab="基本信息" key="1">
            <>
              <FormItem
                label="角色名称"
                name="name"
                shouldUpdate
                rules={[
                  { required: true, message: '请输入用户名' },
                  { validator: validateRoleName },
                ]}
              >
                <Input readOnly={!canEdit} />
              </FormItem>
              <FormItem label="显示名称" name="display_name" shouldUpdate>
                <Input readOnly={!canEdit} />
              </FormItem>
              <FormItem label="描述" name="description" shouldUpdate>
                <TextArea readOnly={!canEdit} />
              </FormItem>
            </>
          </TabPane>
          <TabPane tab="权限组" key="2">
            <PermSetTree
              readOnly={!canEdit}
              permission_sets={permission_sets}
              onCheck={onCheckPerm}
            />
          </TabPane>
        </Tabs>
      </Form>
    </Drawer>
  );
};

export default AddOrEditRole;
