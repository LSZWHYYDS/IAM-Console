import React from 'react';
import EditAppAuthorities from './component/components/EditAppAuthorities';
import { Button, Card, Col, Row } from 'antd';
import { useLocation } from 'umi';
import { DoubleLeftOutlined } from '@ant-design/icons';
import { history } from 'umi';

const EditApp: React.FC<any> = (props: any) => {
  const handleStepsChange = props.handleStepsChange;
  const location: any = useLocation();
  const client_id = sessionStorage.getItem('transformClient') || location.query.client_id;

  return (
    <Card bordered={false}>
      <EditAppAuthorities id={client_id} />
      <Row justify={'end'}>
        <Col flex={'200px'}>
          <Button
            type="primary"
            icon={<DoubleLeftOutlined />}
            style={{ marginBottom: 10, marginRight: 60 }}
            onClick={() => handleStepsChange(1)}
          >
            上一步
          </Button>
        </Col>
        <Col flex={'200px'}>
          <Button
            type="primary"
            style={{ marginBottom: 10, marginRight: 300 }}
            onClick={() => history.push(`/apps/list`)}
          >
            返回列表
          </Button>
        </Col>
      </Row>
    </Card>
  );
};
export default EditApp;
