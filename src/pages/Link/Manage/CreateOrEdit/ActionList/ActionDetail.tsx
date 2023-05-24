import { PageContainer } from '@ant-design/pro-layout';

import { Button, Card, Row, Space, Steps, Col } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { history } from 'umi';
import _ from 'lodash';
import ActionBaseInfo from './ActionBaseInfo';
import ActionIn from './ActionIn';
import ActionOut from './ActionOut';
import { createQueryString } from '@/utils/common.utils';

const ActionDetail: React.FC = (props: any) => {
  const [query, setQuery] = useState(props.location.query);
  const refBaseInfo = useRef();
  const refInInfo = useRef();
  const refOutInfo = useRef();

  const [current, setCurrent] = useState(parseInt(query?.activeKey || '0', 10));
  useEffect(() => {
    history.replace(
      `/link/manage/actionEdit` +
        createQueryString({
          actionId: query.actionId,
          linkId: query.linkId,
          activeKey: current,
        }),
    );
  }, [current, query]);
  const steps = [
    {
      title: '基本信息',
      content: <ActionBaseInfo ref={refBaseInfo} query={query} />,
    },
    {
      title: '入参配置',
      content: <ActionIn ref={refInInfo} query={query} />,
    },
    {
      title: '出参配置',
      content: <ActionOut ref={refOutInfo} query={query} />,
    },
  ];

  const next = (newData: any) => {
    if (newData) {
      const newObj = _.cloneDeep(query);
      newObj.id = newData.id;
      newObj.actionId = newData.id;
      setQuery(newObj);
    }
    setCurrent(current + 1);
  };
  const onSave = () => {
    switch (current) {
      case 0:
        refBaseInfo.current.onSave(next);
        break;
      case 1:
        refInInfo.current.onSave(next);
        break;
      default:
        refOutInfo.current.onSave(() => {
          history.go(-1);
        });
        break;
    }
  };
  const onCancel = () => {
    history.goBack();
  };

  const prev = () => {
    setCurrent(current - 1);
  };
  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  const render = () => {
    return (
      <PageContainer title={false}>
        <Card>
          <Steps current={current} items={items} />
          <div className="steps-content">{steps[current].content}</div>
          <Row justify="center">
            <Col>
              <Space>
                <Button onClick={() => onCancel()}>取消</Button>
                {current > 0 && <Button onClick={() => prev()}>上一步</Button>}
                {current < steps.length - 1 && (
                  <Button type="primary" onClick={() => onSave()}>
                    保存并下一步
                  </Button>
                )}
                {current === steps.length - 1 && (
                  <Button type="primary" onClick={() => onSave()}>
                    保存
                  </Button>
                )}
              </Space>
            </Col>
          </Row>
        </Card>
      </PageContainer>
    );
  };
  return render();
};

export default ActionDetail;
