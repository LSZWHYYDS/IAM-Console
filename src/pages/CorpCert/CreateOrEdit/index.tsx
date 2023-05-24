import { LeftCircleFilled } from '@ant-design/icons';
import { Button, Col, Drawer, Form, message, Row, Space } from 'antd';
import React, { useEffect } from 'react';
import _ from 'lodash';
import { add, edit } from '../service';
import { showErrorMessage } from '@/utils/common.utils';
import Dingding from './Dingding';
import Feishu from './Feishu';
import Wx from './Wx';
import modal from 'antd/lib/modal';

export type ItemProps = {
  visible: boolean;
  certType: string;
  data: any;
  onBack: () => void;
  onClose: () => void;
  refresh: () => void;
};
const dingdingDef = {
  account_process_config: {
    process_key: 'ACCOUNT_CREATE_OR_RENEWAL',
    process_code: '',
    form_fields: [
      {
        name: '类型',
        attr: 'apply_type',
      },
      {
        name: '人员数量',
        attr: 'user_number',
      },
      {
        name: '申请说明',
        attr: 'apply_explain',
      },
      {
        name: '人员列表',
        attr: 'detail_url',
      },
      {
        name: '开始时间',
        attr: 'end_date',
      },
    ],
  },
  app_process_config: {
    process_key: 'APP_AUTH',
    process_code: '',
    form_fields: [
      {
        name: '应用名称',
        attr: 'client_name',
      },
      {
        name: '应用简介',
        attr: 'client_brief',
      },
      {
        name: '申请理由',
        attr: 'reason',
      },
      {
        name: '开始时间',
        attr: 'start_date',
      },
      {
        name: '结束时间',
        attr: 'end_date',
      },
    ],
  },
};
const CreateOrEdit: React.FC<ItemProps> = (props: any) => {
  const [formRef] = Form.useForm();
  const { visible, data, certType, onBack, onClose, refresh } = props;
  const config = (data.config && JSON.parse(data.config)) || {};
  // const copyConfig = _.cloneDeep(config);
  useEffect(() => {
    if (certType === 'DINGDING') {
      try {
        if (config.account_process_config) {
          if (_.isString(config.account_process_config)) {
            config.account_process_config = JSON.parse(config.account_process_config);
          }
        } else {
          config.account_process_config = _.cloneDeep(dingdingDef.account_process_config);
        }
        config.account_process_config = config.account_process_config?.process_code;
        if (config.app_process_config) {
          if (_.isString(config.app_process_config)) {
            config.app_process_config = JSON.parse(config.app_process_config);
          }
        } else {
          config.app_process_config = _.cloneDeep(dingdingDef.app_process_config);
        }
        config.app_process_config = config.app_process_config?.process_code;
      } catch (err: any) {
        modal.error({
          title: '抽屉组件错误',
          content: <>{err.message}</>,
        });
      }
    }
    formRef.resetFields();
    formRef.setFieldsValue({ ...config, name: data.name });
  }, [data, visible]);

  const onSave = async (values: any) => {
    const obj = { ...values };
    console.log(values);

    const configs = (data.config && JSON.parse(data.config)) || {};
    /**
     * 首先判断类型必须是钉钉类型
     * 拿输入框的ID去跟返回的config对象做对比 若对比上则使用匹配上的对象
     */
    if (typeof configs?.account_process_config == 'object') {
      configs.account_process_config = JSON.stringify(configs?.account_process_config);
    }
    if (typeof configs?.app_process_config == 'object') {
      configs.app_process_config = JSON.stringify(configs?.app_process_config);
    }

    const temp1 = JSON.parse(configs.account_process_config || '{}');
    temp1.process_code = obj.account_process_config;
    const temp2 = JSON.parse(configs.app_process_config || '{}');
    temp2.process_code = obj.app_process_config;

    obj.account_process_config = temp1;
    obj.app_process_config = temp2;

    delete obj.name;
    const params = {
      config: obj,
      corp_id: obj.corp_id,
      default: true,
      name: values.name,
      type: certType || 'DINGDING',
    };
    if (params.type === 'DINGDING') {
      params.config.api_base_url = 'https://oapi.dingtalk.com';
    }
    if (obj.process_enable == undefined) {
      obj.process_enable = false;
    }
    if (data.id) {
      await edit(data.id, params)
        .then(async () => {
          message.success('保存成功。');
          onClose();
        })
        .catch((error) => {
          showErrorMessage(error);
        });
    } else {
      const copyDingingDef = { ...dingdingDef };
      copyDingingDef.account_process_config.process_code = values?.account_process_config;
      copyDingingDef.app_process_config.process_code = values?.app_process_config;
      params.config = { ...params?.config, ...copyDingingDef };
      await add(params)
        .then(async () => {
          message.success('保存成功。');
          onClose();
        })
        .catch((error) => {
          showErrorMessage(error);
        });
    }
  };
  const onSubmit = async () => {
    formRef.validateFields().then((values) => {
      onSave(values);
      refresh();
    });
  };
  // type (string): 目标目录服务类型 = ['AD', 'LDAP', 'DINGDING', 'WEWORK', 'ETL']stringEnum:"AD", "LDAP", "DINGDING", "WEWORK", "ETL"
  const render = () => {
    const names = {
      DINGDING: '企业认证-钉钉',
      AD: '企业认证-AD',
      LDAP: '企业认证-LDAP',
      WEWORK: '企业认证-微信',
      FEISHU: '企业认证-飞书',
    };
    const backBtn = !data.name && <Button icon={<LeftCircleFilled onClick={onBack} />} />;
    const title = (
      <Row>
        <Col span={2}>{backBtn}</Col>
        <Col span={21} style={{ textAlign: 'right' }}>
          {names[certType]}
        </Col>
      </Row>
    );
    return (
      <Drawer
        forceRender={true}
        title={title}
        closable={true}
        width={800}
        destroyOnClose={true}
        open={visible}
        onClose={onClose}
        footer={
          <Space>
            <Button onClick={() => onClose()}>取消</Button>
            <Button type="primary" onClick={onSubmit}>
              保存
            </Button>
          </Space>
        }
        footerStyle={{ display: 'flex', justifyContent: 'flex-end' }}
      >
        <Form form={formRef} size="small">
          {certType === 'DINGDING' && <Dingding form={formRef} />}
          {certType === 'WEWORK' && <Wx data={data} />}
          {certType === 'FEISHU' && <Feishu data={data} />}
        </Form>
      </Drawer>
    );
  };
  return render();
};
export default CreateOrEdit;
