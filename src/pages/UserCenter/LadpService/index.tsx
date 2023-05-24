import { useState, useEffect } from 'react';
import { Form, Card, Input } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { getLadpService } from './service';
import type { DataType } from './data';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 },
};
const LadpService = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<DataType>({});

  useEffect(() => {
    getLadpService().then((resp) => {
      setData(resp.data);
      form.setFieldsValue(resp.data);
    });
  }, []);
  const render = () => {
    const formItemLayoutTitle = {
      labelCol: { span: 6, style: { fontWeight: 700 } },
      wrapperCol: { span: 12 },
    };
    const { port = {}, base = {}, org = {}, user = {}, membership = {} } = data;
    return (
      <PageContainer title={false}>
        <div id="content" className="content">
          <Form form={form}>
            <Card title="管理员账户">
              <FormItem label="用 户 名" {...formItemLayout}>
                {data.username}
              </FormItem>
              <FormItem
                name="password"
                label="密    码"
                {...formItemLayout}
                initialValue={data.password}
              >
                <Input.Password readOnly />
              </FormItem>
            </Card>
            <Card title="配置信息">
              <FormItem label="服务器配置" colon={false} {...formItemLayoutTitle} />
              <FormItem label="地    址" {...formItemLayout}>
                {data.host}
              </FormItem>
              <FormItem label="端口" colon={false} {...formItemLayoutTitle} />
              <FormItem label="ldap" {...formItemLayout}>
                {port.ldap}
              </FormItem>
              <FormItem label="ldaps" {...formItemLayout}>
                {port.ldaps}
              </FormItem>
              {/* <FormItem label="TLS证书" {...formItemLayout}>
                ??
                <Button
                  icon="download"
                  style={{ marginLeft: "10px" }}
                  type="primary"
                  onClick={this.handleExport.bind(this)}
                >
                  下载
                </Button>
              </FormItem> */}
              <FormItem label="LDAP Schema配置" colon={false} {...formItemLayoutTitle} />
              <FormItem label="Base  DN" {...formItemLayout}>
                {base.baseDN}
              </FormItem>
              <FormItem label="User Schema配置" colon={false} {...formItemLayoutTitle} />
              {/* addDN: "ou=people"


  uniqueID: "entryUUID" */}
              <FormItem label="Additionnal User DN" {...formItemLayout}>
                {user.addDN}
              </FormItem>
              <FormItem label="displayName" {...formItemLayout}>
                {user.displayName}
              </FormItem>
              <FormItem label="User DN Attribute" {...formItemLayout}>
                {user.dn}
              </FormItem>
              <FormItem label="filter" {...formItemLayout}>
                {user.filter}
              </FormItem>
              <FormItem label="firstName" {...formItemLayout}>
                {user.firstName}
              </FormItem>
              <FormItem label="lastName" {...formItemLayout}>
                {user.lastName}
              </FormItem>
              <FormItem label="mail" {...formItemLayout}>
                {user.mail}
              </FormItem>
              <FormItem label="mobile" {...formItemLayout}>
                {user.mobile}
              </FormItem>
              <FormItem label="name" {...formItemLayout}>
                {user.name}
              </FormItem>
              <FormItem label="objectClass" {...formItemLayout}>
                {user.objectClass}
              </FormItem>
              <FormItem label="uniqueID" {...formItemLayout}>
                {user.uniqueID}
              </FormItem>
              <FormItem label="Organization Schema配置" colon={false} {...formItemLayoutTitle} />
              <FormItem label="Additionnal Organization DN" {...formItemLayout}>
                {org.addDN}
              </FormItem>
              <FormItem label="description" {...formItemLayout}>
                {org.description}
              </FormItem>
              <FormItem label="name" {...formItemLayout}>
                {org.name}
              </FormItem>
              <FormItem label="Object Class" {...formItemLayout}>
                {org.objectClass}
              </FormItem>
              <FormItem label="Object Filter" {...formItemLayout}>
                {org.filter}
              </FormItem>
              {/* <FormItem label="Group Schema配置" {...formItemLayout}>
                ??
              </FormItem>
              <FormItem label="Object Filter" {...formItemLayout}>
                ??
              </FormItem>
              <FormItem label="Posix Group Schema配置" {...formItemLayout}>
                ??
              </FormItem> */}
              <FormItem label="Membership Schema配置" colon={false} {...formItemLayoutTitle} />
              <FormItem label="orgUser" {...formItemLayout}>
                {membership.orgUser}
              </FormItem>
              <FormItem label="userOrg" {...formItemLayout}>
                {membership.userOrg}
              </FormItem>
            </Card>
          </Form>
        </div>
      </PageContainer>
    );
  };
  return render();
};
export default LadpService;
