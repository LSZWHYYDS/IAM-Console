import { Button, Checkbox, Col, Collapse, Form, Input, Row, Select, Space } from 'antd';
import React, { useState, useEffect } from 'react';
import { history } from 'umi';
import { add, edit, getLink, getSelectList, getToken, isExist } from '../service';
import { errorCode, showErrorMessage, showSuccessMessage } from '@/utils/common.utils';
import LinkerMapAttrsComponent from './LinkerMapAttrsComponet';
// import _ from 'lodash';

const FormItem = Form.Item,
  Panel = Collapse.Panel;

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 17 },
};
let initData: any = null;
const EditAzure: React.FC = (props: any) => {
  const [formBasic] = Form.useForm();
  const { location } = props;
  const { query } = location;
  const [data, setData] = useState<any>({});
  const id = query.id;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(false);
  const [token, setTokenValue] = useState('');
  // 存放右侧下拉列表数据
  const [rightData, setRightData] = useState<any>();
  const [account_link, setAccount_link] = useState<unknown[]>();
  const formatData = (dataObj: {
    profile_name?: any;
    delete_limit?: any;
    ds_type?: any;
    last_import_finish_datetime?: any;
    last_import_start_datetime?: any;
    map_attrs?: any;
    config?: any;
  }) => {
    const { map_attrs, config } = dataObj;
    const obj = {
      profile_name: dataObj.profile_name,
      delete_limit: dataObj.delete_limit,
      ds_type: dataObj.ds_type,
      endTime: dataObj.last_import_finish_datetime,
      startTime: dataObj.last_import_start_datetime,
    };
    return Object.assign({}, obj, map_attrs, dataObj, config);
  };

  const loadData = () => {
    if (id) {
      getLink(id).then((res) => {
        setData(res.data);
        formBasic.setFieldsValue(res.data);
        initData = formatData(res.data);
        setAccount_link(initData?.account_link);
      });
    }
    getSelectList().then((res) => {
      setRightData(res?.data?.sub_params || []);
    });
  };
  useEffect(() => {
    loadData();
  }, []);
  const onGetToken = async () => {
    const dataObj = await formBasic.validateFields();
    setLoading(true);
    delete dataObj.name;
    isExist(dataObj.config.client_id, dataObj.config.client_secret).then((rs) => {
      if (rs.data) {
        getToken(dataObj.config)
          .then((res) => {
            setLoading(false);
            setTokenValue(res?.access_token);
            formBasic.setFieldsValue({
              fetchToken: res?.access_token,
            });
            showSuccessMessage('获取token成功' + ' ' + res?.access_token, 2);
          })
          .catch((error) => {
            setLoading(false);
            showErrorMessage(error);
          });
      } else {
        // message.warning('该应用没找到');
      }
    });
    return;
  };
  const onSave = async () => {
    const dataObj = await formBasic?.validateFields();
    const tempObj = {};
    for (const item in dataObj) {
      if (typeof dataObj[item] != 'object') {
        tempObj[item] = dataObj[item];
      }
    }
    setLoading(true);
    let p;
    // dataObj.map_attrs = {};
    // dataObj.import_orgs = dataObj?.import_orgs;
    // dataObj.ds_type = query.type;account_link
    // dataObj.account_link = account_link;
    const account_links: any = [];
    dataObj?.userFormMappedAttrMap?.forEach?.((forIs) => {
      account_links?.push({
        source_exp: forIs?.fieldValue,
        exp_type: 'JS_EXP',
        target_path: forIs?.fieldName,
      });
    });
    const a: any = { ...tempObj };
    a.account_link = account_links;
    a.map_attrs = {};
    a.import_orgs = dataObj?.import_orgs;
    a.ds_type = query.type;
    a.config = dataObj?.config;
    if (!id) {
      dataObj.map_attrs = {};
      dataObj.ds_type = query.type;
      dataObj.account_link = account_links;
      delete dataObj.userFormMappedAttrMap;
      p = add(dataObj);
    } else {
      p = edit({ ...data, ...a });
    }
    setLoading(true);
    p.then((res) => {
      setLoading(false);
      if (res?.result) {
        showSuccessMessage();
        history.goBack();
      } else {
        showErrorMessage(errorCode[res?.error]);
      }
    });
  };
  const onCancel = () => {
    history.goBack();
  };
  const renderBasicForm = () => {
    const { startTime, delete_limit } = data || {};
    return (
      <>
        <Panel header="基础配置" key="base">
          <Row>
            <Col span="12">
              <FormItem
                name="profile_name"
                label="名称"
                initialValue=""
                rules={[{ required: true, message: '请输入' }]}
                // {...formItemLayoutName}
              >
                <Input disabled={query?.NumberId ? true : false} />
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem
                name={['config', 'client_id']}
                label="Client ID"
                initialValue={''}
                rules={[{ required: true, message: '请输入' }]}
              >
                <Input />
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem
                name={['config', 'client_secret']}
                label="Client Secret"
                initialValue={''}
                rules={[{ required: true, message: '请输入' }]}
              >
                <Input type="text" />
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem
                colon={false}
                name={'fetchToken'}
                initialValue=""
                label={
                  <Button type="link" onClick={onGetToken}>
                    获取token
                  </Button>
                }
              >
                <Input value={token} readOnly />
              </FormItem>
            </Col>
          </Row>
        </Panel>
        <Panel header="同步策略" key="syncPolicy">
          <Row>
            <Col span="12">
              <FormItem
                name="import_period"
                label="用户同步周期"
                rules={[{ required: true, message: '请选择同步周期' }]}
                {...formItemLayout}
              >
                <Select
                  placeholder={'请选择同步状态'}
                  options={[
                    {
                      value: 0,
                      label: '手动同步',
                    },
                  ]}
                />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <FormItem
                name="import_orgs"
                {...formItemLayout}
                label="同步用户组"
                valuePropName="checked"
                initialValue={false}
              >
                <Checkbox disabled={!!startTime}>启用</Checkbox>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem
                name="create_default_org"
                {...formItemLayout}
                label="是否创建默认组"
                valuePropName="checked"
                initialValue={false}
              >
                <Checkbox disabled={!!startTime} />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <FormItem
                name="delete_limit"
                label="删除用户阈值"
                initialValue={delete_limit || 5}
                {...formItemLayout}
                help="执行同步任务如数据源删除用户数等于或大于用户阈值，则链接器将不执行删除操作。如不希望在同步时删除用户，请将值设置为0，如不设删除上限，请将值配置为-1"
              >
                <Input type="number" min={-1} />
              </FormItem>
            </Col>
          </Row>
        </Panel>
        <Panel className="mb-20" header="账号关联" key="userMappingPolicy">
          <Row>
            <Col span="24">
              <LinkerMapAttrsComponent
                dataParamName="userFormMappedAttrMap"
                displayNameUtilPrefix="user.attr."
                rightData={rightData}
                echoData={account_link}
              />
            </Col>
          </Row>
        </Panel>
      </>
    );
  };

  //用户必填
  const render = () => {
    return (
      <div id="content" className="content">
        <Form form={formBasic} {...formItemLayout}>
          <Collapse defaultActiveKey={['base', 'syncPolicy', 'userMappingPolicy']} bordered={false}>
            {renderBasicForm()}
          </Collapse>
          <Row>
            <Col span="24" style={{ textAlign: 'center' }}>
              <Space>
                <Button onClick={onCancel}>取消</Button>
                <Button type="primary" onClick={onSave}>
                  保存
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </div>
    );
  };
  return render();
};

export default EditAzure;
