// 上一步请求最新数据 下一步保存最新数据
import React, { useState, useRef, useEffect, forwardRef } from 'react';
import {
  Card,
  Steps,
  message,
  Button,
  Row,
  Col,
  Form,
  Input,
  Checkbox,
  Typography,
  Modal,
  Radio,
  Spin,
} from 'antd';
import { AppstoreAddOutlined, UserOutlined } from '@ant-design/icons';
import styles from './index.less';
import SignInConfig from './SignConfig';
const { Step } = Steps;
import { requestNetwork, generateSecret_ls, requestData, saveClass } from '../servers';
const { Paragraph } = Typography;
import ListPopupCom from '@/pages/AppCenter/Classification/components/ListComponent';
import { history, useLocation } from 'umi';
import { formatDateTime, useStateCallback } from '@/utils/common.utils';
import Authorization from './Authorization/Authorization';
import { getAppInfo } from '../../servers';
import _ from 'lodash';
interface STATUS {
  dataOrigin: string;
  entrance: string;
  getAccess: string;
  language: string;
  redirectUrl: string;
  systemCode: string;
  theKey: string;
  userCode: string;
  zhangSetCode: string;
}
const ListPopupComLS: React.FC<any> = forwardRef((props, ref: any) => {
  return <ListPopupCom ref={ref} {...props} />;
});
const Index: React.FC<any> = (props: any) => {
  const [loading, setLoading] = useState(true);
  const location: any = useLocation();
  const PopupComRef = useRef<any>();
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useStateCallback(0);
  const [form] = Form.useForm();
  const [appclassification, setAppclassification] = useState<any>([]);
  const [clientId, setClientId] = useState<string>(() => props.contents.client_id || '');
  const [appcheckBox, setAppcheckBox] = useState([]);
  const [, setfirst] = useState(true);
  const [saveSignStatus, setSaveSignStatus] = useState<STATUS>({
    dataOrigin: '',
    entrance: '',
    getAccess: '',
    language: '',
    redirectUrl: '',
    systemCode: '',
    theKey: '',
    userCode: '',
    zhangSetCode: '',
  });

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const signInConfigRef = useRef<any>(null);
  // 设置输入框的数据
  const [config, setConfig] = useState<any>(null);
  const [, setData_ls] = useStateCallback();
  const [renderVal, setRenderVal] = useState(true);
  const handleSignConfig = (value: any, aa: any) => {
    setData_ls(value, (data: any) => {
      signInConfigRef?.current?.setDisabledFunc();
      // 保存组件的状态值
      setSaveSignStatus(data);
      // 在这里发送接口
      generateSecret_ls(clientId, { ...data }, aa).then((rs) => {
        if (rs) {
          setCurrent(current + 1);
          message.success('编辑成功');
        }
      });
    });
  };

  // 请求分类接口函数
  const requestClassApplication = () => {
    // 请求分类接口
    requestData().then((rs) => {
      setAppclassification(() => {
        const tempArr: any = [];
        tempArr.push({});
        return rs.data.concat(tempArr);
      });
    });
  };

  useEffect(() => {
    sessionStorage.setItem(
      'custome_class',
      location?.state?.custom_class || JSON.parse(location?.stateRefresh || '{}')?.custom_class,
    );
    requestClassApplication();
    setAppcheckBox(
      location?.state?.custom_class ||
        JSON.parse(sessionStorage.getItem('stateRefresh') || '{}')?.custom_class ||
        sessionStorage.getItem('custome_class'),
    );

    if (location?.state?.link_id) {
      sessionStorage.setItem('LinkId', 'location?.state?.link_id');
    }

    setTimeout(() => {
      setLoading(false);
    }, 500);
    getAppInfo({ client_id: config?.client_id || props?.contents?.client_id }).then((rss) => {
      setConfig(_.cloneDeep(rss));
      setConfig(rss);
      setRenderVal((datas) => !datas);
    });
  }, []);

  // 点击新建分类弹窗
  const hanldeAddCustApp = () => {
    setVisible(true);
  };

  // ---------------------------------------------渲染分类是否允许申请------------------------------------------
  const returnJsxElement = (mapIs: any, mapInx: number) => {
    if (mapInx != appclassification.length - 1) {
      return (
        <Checkbox
          value={mapIs.id}
          key={mapInx}
          style={{ marginRight: '60px', marginBottom: '10px', marginLeft: 'unset', width: '100px' }}
        >
          {mapIs.category_name}
        </Checkbox>
      );
    } else {
      return (
        <Paragraph
          style={{ cursor: 'pointer', marginBottom: 'unset' }}
          onClick={hanldeAddCustApp}
          key={mapInx}
        >
          <AppstoreAddOutlined width={100} style={{ color: '#808080' }} />
          <span style={{ marginBottom: 'unset', color: '#808080' }}>添加应用分类</span>
        </Paragraph>
      );
    }
  };
  const renderCheckBox = () => {
    return appclassification.map((mapIs: any, mapInx: number) => {
      return returnJsxElement(mapIs, mapInx);
    });
  };
  // 复选框的事件
  const onChanges = (checkedValues: any) => {
    setAppcheckBox(checkedValues);
  };
  // Radio框的事件
  const onChangeRadio = (val: any) => {
    setfirst(val.target.value);
  };
  //***************************************** 新建分类功能事件 *************************************************** */
  // 模态框的确定事件
  const handleOk = () => {
    PopupComRef?.current?.againRequest();
    setConfirmLoading(true);
    setVisible(false);
    setConfirmLoading(false);
    setInputValue('');
    requestClassApplication();
  };
  // 模态框的取消事件
  const handleCancel = () => {
    PopupComRef?.current?.againRequest();
    setVisible(false);
    setInputValue('');
    requestClassApplication();
  };
  // 输入框的事件
  const handleChangeEvent = (e: any) => {
    setInputValue(e.target.value);
  };
  // 创建分组事件
  const createClassIfication = () => {
    if (inputValue) {
      PopupComRef?.current?.updateClassList(inputValue);
      requestClassApplication();
    } else {
      message.error('不能为空');
    }
  };

  const renderJSXElement = () => {
    return (
      <Spin spinning={loading} style={{ background: '#fff', maxHeight: 'unset' }}>
        <Form
          name="basic"
          initialValues={{
            username: props?.values,
            enable_apply: props.enable_apply,
            custom_class:
              location?.state?.custom_class ||
              JSON.parse(sessionStorage.getItem('stateRefresh') || '{}').custom_class ||
              sessionStorage.getItem('custome_class'),
          }}
          autoComplete="off"
          style={{ marginTop: '60px' }}
          form={form}
        >
          <Form.Item
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 6 }}
            labelAlign="right"
            label="自定义应用名称"
            name="username"
            rules={[{ required: true, message: '请输入你的应用名称参数' }]}
          >
            <Input placeholder="请输入你的应用名称参数" />
          </Form.Item>

          <Form.Item
            label="应用分类"
            name="custom_class"
            shouldUpdate
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 8 }}
          >
            <Checkbox.Group style={{ width: '100%' }} onChange={onChanges}>
              <Row style={{ marginTop: '5px' }}>{renderCheckBox()}</Row>
            </Checkbox.Group>
          </Form.Item>

          <Form.Item
            label="是否允许自助申请"
            name="enable_apply"
            shouldUpdate
            rules={[{ required: true }]}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 6 }}
          >
            <Radio.Group onChange={onChangeRadio}>
              <Radio value={true} style={{ marginRight: '100px' }}>
                允许
              </Radio>
              <Radio value={false}>不允许</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="首页地址"
            name="client_uri"
            shouldUpdate
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
          >
            {`${window.location.origin}/iam/other/${
              JSON.parse(location?.state?.items || '{}')?.client_id
            }/login`}
          </Form.Item>
          <Form.Item
            label="Client ID"
            shouldUpdate
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 10 }}
          >
            {JSON.parse(location?.state?.items || '{}')?.client_id ||
              JSON.parse(sessionStorage.getItem('stateRefresh') || '{}').client_id}
          </Form.Item>
          <Form.Item label="更新时间" shouldUpdate labelCol={{ span: 8 }} wrapperCol={{ span: 10 }}>
            {formatDateTime((JSON.parse(location?.state?.items || '{}')?.update_time || 0) * 1000)}
          </Form.Item>
        </Form>
      </Spin>
    );
  };
  /**
   * 步骤条change事件
   */
  const onChange = () => {
    let objs: any = {};
    const { validateFields } = form;
    validateFields().then((values) => {
      if (values) {
        if (!location?.state?.link_id || sessionStorage.getItem('LinkId')) {
          objs = {
            client_name: values.username,
            logo_uri: props.logo_uri,
            description: props.descript,
            auth_protocol: 'APPSTORE',
            link_client_id: props?.link_Url?.replaceAll('"', '')?.split('\\')[1],
            client_id: props?.client_id,
            // enable_apply: props.enable_apply,
            enable_apply: values.enable_apply,
            client_uri: values.client_uri,
          };
        } else {
          objs = {
            client_name: values.username,
            logo_uri: props.logo_uri,
            description: props.descript,
            auth_protocol: 'APPSTORE',
            link_client_id: props?.link_Url?.replaceAll('"', '')?.split('\\')[1],
            // enable_apply: props.enable_apply,
            enable_apply: values.enable_apply,
          };
        }
        if (current == 0) {
          requestNetwork(objs).then(async (rs: any) => {
            setClientId(rs.client_id);
            await saveClass(rs.client_id, appcheckBox).then(() => {});
            await getAppInfo({ client_id: rs.client_id || props?.contents?.client_id }).then(
              (rss) => {
                setConfig(rss);
                setCurrent(current + 1);
              },
            );
          });
        }
        if (current == 1) {
          signInConfigRef?.current?.handleFunc();
          getAppInfo({ client_id: clientId || props?.contents?.client_id }).then((rss) => {
            setConfig(rss);
          });
        }
      }
      return;
    });
    return;
  };

  // step的change事件
  const onChange_ls = (val: any) => {
    // 再看到下一步界面时候 要保存上一步的数据
    let objs: any = {};
    const { validateFields } = form;
    validateFields().then((values) => {
      if (values) {
        if (!location?.state?.link_id || sessionStorage.getItem('LinkId')) {
          objs = {
            client_name: values.username,
            logo_uri: props.logo_uri,
            description: props.descript,
            auth_protocol: 'APPSTORE',
            link_client_id: props?.link_Url?.replaceAll('"', '')?.split('\\')[1],
            client_id: props?.client_id,
            enable_apply: values.enable_apply,
            client_uri: values.client_uri,
          };
        } else {
          objs = {
            client_name: values.username,
            logo_uri: props.logo_uri,
            description: props.descript,
            auth_protocol: 'APPSTORE',
            link_client_id: props?.link_Url?.replaceAll('"', '')?.split('\\')[1],
            enable_apply: values.enable_apply,
          };
        }
        if (val == 0) {
          requestClassApplication();
        }
        if (val == 1) {
          if (val > current) {
            // 此处说明步骤条是一直前进状态 前进状态保存上一次的值
            requestNetwork(objs).then(async (rs: any) => {
              setClientId(rs.client_id);
              await saveClass(rs.client_id, appcheckBox);
            });
          } else {
            // 说明步骤条是后退状态 则请求接口刷新数据
            getAppInfo({ client_id: clientId || props?.contents?.client_id }).then((rss) => {
              setConfig(rss);
              setRenderVal((newValue) => !newValue);
            });
          }
        }
        if (val == 2) {
          signInConfigRef?.current?.handleFunc();
        }
        setCurrent(val);
      }
    });
  };

  const onPrevire = async () => {
    if (current == 1) {
      requestClassApplication(); // 等于1时候重新请求分类接口
    }
    if (current == 2) {
    }
    setCurrent(current - 1);
    getAppInfo({ client_id: clientId }).then((rs) => {
      setConfig(rs);
    });
    return;
  };
  const stepsy = [
    {
      content: renderJSXElement(),
    },
    {
      content: (
        <SignInConfig
          ref={signInConfigRef}
          handleSignConfig_={handleSignConfig}
          status={saveSignStatus}
          rs={config || props.contents}
          iscontrueBoolean={renderVal}
        />
      ),
    },
    {
      content: <Authorization id={clientId} />,
    },
  ];
  const onSaveInfo = () => {
    signInConfigRef?.current?.handleFunc();
  };
  const clearInput = () => {
    setInputValue('');
  };
  return (
    <>
      <Spin spinning={loading}>
        <Card bodyStyle={{ paddingTop: '10px' }}>
          <Steps
            type="navigation"
            size="default"
            current={current}
            className="site-navigation-steps"
            onChange={onChange_ls}
          >
            <Step title="基本信息" />
            <Step title="登录配置" />
            <Step title="授权范围" />
          </Steps>
          <div className={styles.stepsContent}>
            {stepsy[current].content ? stepsy[current].content : ''}
          </div>
          <Row justify="center" style={{ marginTop: '30px', marginBottom: '30px' }}>
            <Col span={2}>
              <Button
                type="primary"
                block
                onClick={onPrevire}
                size="large"
                disabled={current == 0 ? true : false}
              >
                上一步
              </Button>
            </Col>
            <Col span={2}></Col>
            {current == 1 ? (
              <Col span={2}>
                <Button type="primary" block onClick={onSaveInfo} size="large">
                  保存
                </Button>
              </Col>
            ) : (
              ''
            )}
            <Col span={2}></Col>
            {current == 2 ? (
              <Col span={2}>
                <Button
                  type="primary"
                  block
                  onClick={() => history.push(`/apps/list`)}
                  size="large"
                >
                  完成
                </Button>
              </Col>
            ) : (
              <Col span={2}>
                <Button
                  type="ghost"
                  block
                  onClick={onChange}
                  size="large"
                  disabled={current == 2 ? true : false}
                >
                  下一步
                </Button>
              </Col>
            )}
          </Row>
        </Card>
        <Modal
          title="编辑分类"
          visible={visible}
          onOk={handleOk}
          confirmLoading={confirmLoading}
          onCancel={handleCancel}
          width="750px"
          style={{ marginTop: '100px' }}
          okText="确定"
        >
          <Form
            labelCol={{ span: 3 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            autoComplete="off"
          >
            <Form.Item
              label="应用分组"
              name={'usename'}
              colon={false}
              rules={[{ required: true, message: 'Please input your username!' }]}
            ></Form.Item>
          </Form>
          <Row>
            <Col span={19}>
              <Input
                size="middle"
                placeholder="请填写分组名称"
                prefix={<UserOutlined />}
                value={inputValue}
                onChange={handleChangeEvent}
              />
            </Col>
            <Col span={1}></Col>
            <Col span={4}>
              <Button type="primary" onClick={createClassIfication}>
                创建分组
              </Button>
            </Col>
          </Row>
          <ListPopupComLS
            ref={PopupComRef}
            clearHandle={clearInput}
            againRequestClassList={requestClassApplication}
          />
        </Modal>
      </Spin>
    </>
  );
};

export default Index;
