import React, { useEffect, useState } from 'react';
import { Form, Input, Collapse, Row, Col, Button, Select, Checkbox } from 'antd';
import { history } from 'umi';
import InfoItem from '@/components/InfoItem';
import {
  errorCode,
  showErrorMessage,
  showSuccessMessage,
  formatDateTime,
} from '@/utils/common.utils';
import { getImportConfigTips, getLink, add, edit, getSelectList } from '../service';
import LinkerMapAttrsComponent from './LinkerMapAttrsComponet';

const FormItem = Form.Item,
  Panel = Collapse.Panel;
const configTips: any = {};
let initData: any = null;

const EditAddrBookInte: React.FC = (props: any) => {
  const { location } = props;
  const { query } = location;
  const id = query.id;
  const [form] = Form.useForm();
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(false);
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
    getImportConfigTips()
      .then((resp) => {
        const tips = resp.data;
        tips.forEach((tip: { ds_type: string | number }) => {
          configTips[tip.ds_type] = formatData(tip);
        });
      })
      .then(() => {
        if (id) {
          if (JSON.stringify(data) == '{}') {
            getLink(id).then((res) => {
              initData = formatData(res.data);
              setAccount_link(initData?.account_link);
              setData(initData);
              form.setFieldsValue(initData);
            });
          } else {
            initData = formatData(data);
            setData(initData);
            form.setFieldsValue(initData);
          }
        } else {
          setData(configTips.ETL);
        }
      })
      .catch(function (error) {
        showErrorMessage(error);
      });
    getSelectList().then((res) => {
      setRightData(res?.data?.sub_params || []);
    });
  };
  useEffect(() => {
    loadData();
  }, []);
  const getData = (callback: any) => {
    const { validateFields } = form;
    validateFields().then(
      (values: {
        ds_type: string | number;
        profile_name: any;
        delete_limit: string;
        datasource_id: any;
        etl_server: any;
        etl_port: any;
        etl_user: any;
        etl_password: any;
        import_orgs: boolean;
        import_period: any;
        create_default_org: any;
        userFormMappedAttrMap: any;
      }) => {
        const dataObj: any = {
          ds_type: values.ds_type,
          profile_name: values.profile_name,
          delete_limit: parseInt(values.delete_limit),
          config: {
            datasource_id: data?.config?.datasource_id,
            etl_server: values.etl_server,
            etl_port: values.etl_port,
            etl_user: values.etl_user,
            etl_password: values.etl_password,
          },
          import_orgs: values?.import_orgs,
          import_period: values?.import_period,
          create_default_org: values?.create_default_org,
          account_link: [],

          email_verified: true,
          phone_number_verified: true,
          map_attrs: configTips[values.ds_type]?.map_attrs,
          map_org_attrs: configTips[values.ds_type]?.map_org_attrs,
        };
        if (id) {
          dataObj.id = query?.NumberId;
        }
        values?.userFormMappedAttrMap?.forEach?.((forIs) => {
          dataObj?.account_link?.push({
            source_exp: forIs?.fieldValue,
            exp_type: 'JS_EXP',
            target_path: forIs?.fieldName,
          });
        });

        if (typeof callback === 'function') {
          callback(dataObj);
        }
      },
    );
  };
  const onSubmit = () => {
    getData((dataObj: any) => {
      let p;
      if (!id) {
        p = add(dataObj);
      } else {
        p = edit(dataObj);
      }
      setLoading(true);
      p.then((res) => {
        setLoading(false);
        if (res.result) {
          showSuccessMessage();
          history.push('/users/linker');
        } else {
          showErrorMessage(errorCode[res.data.code]);
        }
      }).catch((error) => {
        setLoading(false);
        showErrorMessage(error);
      });
    });
  };
  const onCancel = () => {
    history.goBack();
  };
  const render = () => {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 12 },
    };
    const { delete_limit, last_import_start_datetime, last_import_finish_datetime } = data || {};

    const { startTime } = data || {};
    return (
      <div>
        <Form
          className="formPadding"
          layout="horizontal"
          form={form}
          {...formItemLayout}
          initialValues={{
            import_orgs: false,
            create_default_org: false,
          }}
        >
          <Collapse
            defaultActiveKey={['base', 'syncPolicy', 'syncstatus', 'userMappingPolicy']}
            bordered={false}
          >
            <Panel header="基本参数" key="base">
              <Row>
                <Col span="12" style={{ display: 'none' }}>
                  <FormItem
                    name="ds_type"
                    label="类型"
                    initialValue="ETL"
                    rules={[{ required: true, message: '请输入' }]}
                  >
                    <Input disabled />
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem
                    name="profile_name"
                    label="名称"
                    rules={[{ required: true, message: '请输入' }]}
                  >
                    <Input readOnly={!!id} disabled={query.NumberId ? true : false} />
                  </FormItem>
                </Col>
                {data?.config?.datasource_id && id ? (
                  <Col span="12">
                    <FormItem
                      name={['config', 'datasource_id']}
                      label="sourceID"
                      rules={[{ required: true, message: '请输入' }]}
                    >
                      <Input disabled />
                    </FormItem>
                  </Col>
                ) : (
                  ''
                )}
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
            {id && (
              <Panel header="上次同步" key="syncstatus">
                <Row>
                  <Col span="12">
                    <InfoItem
                      titleStr="开始时间"
                      contentObj={formatDateTime(last_import_start_datetime)}
                      contentSpan={14}
                    />
                  </Col>
                  <Col span="12">
                    <InfoItem
                      titleStr="结束时间"
                      contentObj={formatDateTime(last_import_finish_datetime)}
                      contentSpan={14}
                    />
                  </Col>
                </Row>
              </Panel>
            )}
          </Collapse>
        </Form>
        <div className="footerContainer" style={{ margin: '0 20px' }}>
          <Button
            type="primary"
            className="ml-10"
            loading={loading}
            // disabled={util.disabledBtnByFields(getFieldsError(), getFieldsValue(requiredFields))}
            onClick={() => onSubmit()}
          >
            保存
          </Button>
          <Button type="ghost" className="ml-10" onClick={onCancel}>
            取消
          </Button>
        </div>
      </div>
    );
  };
  return render();
};

export default EditAddrBookInte;
