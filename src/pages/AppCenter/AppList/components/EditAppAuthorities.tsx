import OrgTree from '@/components/OrgTree';
import SearchUser from '@/components/SearchUser';
import SelectTags from '@/components/SelectTags';
import type { UserType } from '@/pages/UserCenter/data';
import { getUserList } from '@/pages/UserCenter/service';
import { PageLoading } from '@ant-design/pro-layout';
import type { ParamsType } from '@ant-design/pro-provider';
import { Card, Collapse, Form, message, Switch } from 'antd';
import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import type { AppUserType } from '../../data';
import {
  addOrRemoveUser,
  getAppInfo,
  getAppUsers,
  getOrgs,
  getAllowTags,
  updateAllowTags,
  updateOrgs,
  updatePublicAccess,
  removeAllowTags,
} from '../service';

const Panel = Collapse.Panel;

const FormItem = Form.Item;
const formLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 12 },
};

interface EditDetailsProps {
  id: string;
}

// Usage of DebounceSelect
interface UserSelectValue {
  label: string;
  value: string;
}
let preTags = [];
const EditAppAuthorities: React.FC<EditDetailsProps> = (props) => {
  const { id } = props;
  const [allowTagsForm] = Form.useForm();
  const [form] = Form.useForm();
  const [appInfoLoading, setAppInfoLoading] = useState<boolean>(true);
  const [publicAccess, setPublicAccess] = useState<boolean>(false);
  const [appOrgs, setAppOrgs] = useState<any>([]);

  const handleGetAppInfo = async () => {
    await getAppInfo({ client_id: id })
      .then(async (res) => {
        if (res) {
          const { public_access } = res;
          setPublicAccess(public_access);
          form.setFieldsValue({ public_access });
        }
      })
      .finally(() => setAppInfoLoading(false));
  };

  const handleGetAppOrgs = async () => {
    await getOrgs({ client_id: id }).then((res) => {
      if (res.error === '0') {
        setAppOrgs(res.data);
      }
    });
  };
  const getAllowTagsFunc = async () => {
    await getAllowTags({ client_id: id }).then((res) => {
      if (res.error === '0') {
        preTags = _.map(res.data, 'name');
        allowTagsForm.setFieldsValue({ tags: preTags });
      }
    });
  };

  useEffect(() => {
    handleGetAppInfo();
    handleGetAppOrgs();
    getAllowTagsFunc();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleUpdateAllowTags = async (tags: any) => {
    const isAdd = preTags.length < tags.length;
    const diffTags = _.xor(preTags, tags);
    const func = (isAdd && updateAllowTags) || removeAllowTags;
    await func({ client_id: id }, { tags: diffTags || null })
      .then(async (res) => {
        if (res.error === '0') {
          preTags = tags;
          message.success('标签授权更新成功');
        } else {
          message.error('标签授权更新失败，请重试');
        }
      })
      .catch((error) => {
        message.error(`更新失败，服务器错误： ${error}`);
      });
  };

  const handleSaveAllowTags = async () => {
    const allowPositionsValue: any = await allowTagsForm.validateFields();
    const { enableAllowTags, tags } = allowPositionsValue;
    if (enableAllowTags) {
      handleUpdateAllowTags(null);
    } else {
      handleUpdateAllowTags(tags);
    }
  };

  const handleUpdatePublicAccess = async () => {
    const fieldsValue: any = await form.validateFields();
    await updatePublicAccess({ client_id: id }, { enabled: fieldsValue.public_access })
      .then((res) => {
        if (res.error === '0') {
          message.success('组织机构授权更新成功');
          setPublicAccess(fieldsValue.public_access);
        } else {
          message.error('组织机构授权更新失败，请重试');
          form.setFieldsValue({ public_access: !fieldsValue.public_access });
        }
      })
      .catch(() => {
        message.error('服务器错误，请重试');
        form.setFieldsValue({ public_access: !fieldsValue.public_access });
      });
  };

  const handleUpdateAccessOrgs = async (beforeValues: any[], key: any[]) => {
    const method = beforeValues.indexOf(key[0]) > -1 ? 'DELETE' : 'POST';
    await updateOrgs(method, id, key[0])
      .then((res) => {
        if (res.error === '0') {
          message.success('更新组织结构授权成功');
        } else {
          message.error('更新组织机构授权失败，请重试');
        }
      })
      .catch((error) => {
        message.error(`更新组织机构失败，服务器或网络错误。错误信息：${error}`);
      });
  };

  // 获取用户列表
  async function handleSearchUsers(q: string): Promise<UserSelectValue[]> {
    const usersOptions: UserSelectValue[] = [];
    const usersResult = await getUserList({
      size: 100,
      q,
      attrs: 'sub,username,name,email,picture',
    });
    const users = usersResult.data;
    if (users && users.length > 0) {
      users.map(async (user: AppUserType) => {
        usersOptions.push({ label: user.name, value: user.username });
      });
    } else {
      message.error('没有找到符合条件的用户');
    }

    return usersOptions;
  }

  const handleUserSelect = async (users: UserSelectValue | UserSelectValue[]) => {
    const targets = [];
    if (Array.isArray(users)) {
      users.forEach((user) => {
        targets.push(user.value);
      });
    } else {
      targets.push(users.value);
    }
    try {
      const addResult = await addOrRemoveUser(id, 'add', { usernames: targets });
      if (addResult.error === '0') {
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const handleUserDelete = async (user: UserType) => {
    try {
      const addResult = await addOrRemoveUser(id, 'remove', { usernames: [user.username] });
      if (addResult.error === '0') {
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  return (
    <Collapse
      defaultActiveKey={['authTagPnl', 'allAuthPnl', 'apptoken', 'appcert']}
      bordered={false}
      style={{ backgroundColor: '#FFF' }}
    >
      <Panel key="allAuthPnl" header="全部授权" style={{ marginBottom: '24px' }}>
        {!appInfoLoading ? (
          <>
            <Form form={form} {...formLayout} onValuesChange={() => handleUpdatePublicAccess()}>
              <FormItem
                label="允许所有人使用"
                name="public_access"
                shouldUpdate
                valuePropName="checked"
              >
                <Switch />
              </FormItem>
            </Form>
            {!publicAccess ? (
              <>
                <Card title="组织机构授权" style={{ marginBottom: '24px' }}>
                  {appOrgs && appOrgs.length > 0 ? (
                    <OrgTree
                      checkable
                      selectable={false}
                      checkStrictly={true}
                      orgs={appOrgs}
                      handleOnCheck={(beforeValues: any, newValue, difference: any) =>
                        handleUpdateAccessOrgs(beforeValues, difference)
                      }
                    />
                  ) : null}
                </Card>
                <Card title="用户授权" style={{ marginBottom: '24px' }}>
                  <SearchUser
                    mode="multiple"
                    fetchOptions={handleSearchUsers}
                    tableOptions={(params: ParamsType) =>
                      getAppUsers(id, {
                        page: params.current,
                        size: params.pageSize,
                        attrs: 'sub,name,email,username,phone_number,picture',
                      })
                    }
                    onSubmit={handleUserSelect}
                    onDelete={handleUserDelete}
                  />
                </Card>
                <Card title="用户标签授权" style={{ marginBottom: '24px' }}>
                  <Form
                    form={allowTagsForm}
                    {...formLayout}
                    onValuesChange={() => handleSaveAllowTags()}
                  >
                    <FormItem label="选择允许使用的标签" name="tags" shouldUpdate>
                      <SelectTags client_id={id} />
                    </FormItem>
                  </Form>
                </Card>
              </>
            ) : null}
          </>
        ) : (
          <PageLoading />
        )}
      </Panel>
    </Collapse>
  );
};
export default EditAppAuthorities;
