/* eslint-disable react-hooks/exhaustive-deps */
import { formatOSType } from '@/utils/common.utils';
import { Button, Card, Col, message, Modal, Popconfirm, Row, Table } from 'antd';
import React, { Fragment, useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { clientIntegrationDel, getClientIntegration } from '../service';
import FormDetail from './FormDetail';

const SDKList: React.FC<any> = (props) => {
  const { sdkNum } = props;
  const [sdkList, setSdkList] = useState([]);
  const [sdk, setSdk] = useState({});
  const [visible, setVisible] = useState(false);
  const loadData = async () => {
    await getClientIntegration().then(async (res) => setSdkList((res && res.data) || []));
  };

  useEffect(() => {
    loadData();
  }, []);
  const onAdd = () => {
    if (sdkNum <= sdkList.length) {
      message.warning(
        ` 企业应用数据防泄漏集成授权数量已经达上限，授权应用数${sdkNum}，已经达到上限，如需增加应用授权，请联系我们！`,
      );
      return;
    }
    setSdk({});
    setVisible(true);
  };
  const onEidt = (row: any) => {
    setSdk(row);
    setVisible(true);
  };
  const onDelete = async (row: any) => {
    await clientIntegrationDel(row.clientId).then(async () => {
      loadData();
      message.success('操作成功。');
    });
  };
  const onClose = () => {
    setVisible(false);
  };
  const onShowCopyMsg = () => {
    message.info('复制成功，请在需要的位置粘贴。');
  };

  const columnsSdk = [
    {
      key: 'clientName',
      title: '应用名称',
      dataIndex: 'clientName',
      width: 150,
    },
    {
      key: 'packageName',
      title: '应用包名',
      dataIndex: 'packageName',
      width: 150,
    },
    {
      key: 'appOs',
      title: '平台',
      dataIndex: 'appOs',
      width: 80,
      render: (value: string) => formatOSType(value),
    },
    {
      key: 'clientId',
      title: 'clientId',
      dataIndex: 'clientId',
      width: 100,
    },
    {
      key: 'signatureSecret',
      title: '密钥',
      dataIndex: 'signatureSecret',
      width: 100,
      render: (value: string) => (
        <CopyToClipboard text={value}>
          <Button onClick={onShowCopyMsg}>复制</Button>
        </CopyToClipboard>
      ),
    },
    {
      key: 'licenceCode',
      title: '授权码',
      dataIndex: 'licenceCode',
      width: 100,
    },
    {
      key: '操作',
      title: '操作',
      width: 200,
      render: (value: any, row: any) => (
        <Fragment>
          <Button style={{ marginRight: 10 }} onClick={() => onEidt(row)}>
            编辑
          </Button>
          <Popconfirm
            title="确定要删除吗？"
            okText="确定"
            cancelText="取消"
            onConfirm={() => onDelete(row)}
          >
            <Button>删除</Button>
          </Popconfirm>
        </Fragment>
      ),
    },
  ];
  const getSdk = () => {
    console.log(sdk);
    return (
      <Card title={`SDK授权 数量：${sdkNum}`}>
        <Row style={{ marginBottom: 10 }}>
          <Col span={3}>数据防泄漏</Col>
          <Col span={3}>
            <Button type="primary" onClick={onAdd}>
              添加应用
            </Button>
          </Col>
          <Modal
            title={(sdk.id && '编辑应用') || '添加应用'}
            open={visible}
            footer={null}
            closable={false}
            destroyOnClose
          >
            <FormDetail data={sdk} onClose={onClose} onSuccess={loadData} />
          </Modal>
        </Row>
        <Row>
          <Col span={24}>
            <Table rowKey="id" columns={columnsSdk} dataSource={sdkList} />
          </Col>
        </Row>
      </Card>
    );
  };

  return getSdk();
};

export default SDKList;
