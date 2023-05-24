/* jshint esversion: 6 */
import React, { useEffect, useState } from 'react';
import { Tabs, Card } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import CommonTmplEdit from './CommonTmplEdit';
import type { TmplDataProps } from './data';
import { getTemplates } from './service';

const { TabPane } = Tabs;

const Templates: React.FC = () => {
  const [templates, setTemplates] = useState<TmplDataProps>({});
  const loadData = async () => {
    return await getTemplates().then(async (res) => {
      setTemplates(res.data || []);
      return res;
    });
  };
  useEffect(() => {
    loadData();
  }, []);
  const render = () => {
    if (!templates || !templates.resetpwd_email) {
      return <div />;
    }
    return (
      <PageContainer title={false}>
        <Card>
          <Tabs defaultActiveKey="0">
            <TabPane tab="邮件邀请模板" key="1">
              <CommonTmplEdit data={templates.welcome_email} type="1" />
            </TabPane>
            <TabPane tab="邮箱验证模板" key="2">
              <CommonTmplEdit data={templates.verify_email} type="2" />
            </TabPane>
            <TabPane tab="密码重置模板" key="3">
              <CommonTmplEdit data={templates.resetpwd_email} type="3" />
            </TabPane>
            <TabPane tab="短信模板" key="4">
              <CommonTmplEdit
                data={templates.code_sms}
                type="4"
                isText={true}
                hideToolbar={true}
                title="短信主题"
                content="短信内容"
              />
            </TabPane>
          </Tabs>
        </Card>
      </PageContainer>
    );
  };
  return render();
};

export default Templates;
