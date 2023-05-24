import { Button, Space, Popconfirm } from 'antd';
import './edgeAction.less';
import { addActionNodeAndEdge, addCondNodeOnEdge } from '../common';
import { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { useEffect } from 'react';

const EdgeAction = (props: any) => {
  const [actionDivOpen, setActionDivOpen] = useState(false);

  const infoData = props.data;
  const onAddAction = (e) => {
    addActionNodeAndEdge(infoData);
    setActionDivOpen(false);
    e.stopPropagation();
    e.preventDefault();
  };
  const onAddBranch = (e: any) => {
    addCondNodeOnEdge(infoData);
    setActionDivOpen(false);
    e.stopPropagation();
    e.preventDefault();
  };

  useEffect(() => {
    document.addEventListener('click', () => {
      setActionDivOpen(false);
    });
  }, []);

  return (
    <div className="edgeWrapper">
      <Popconfirm
        icon={null}
        showCancel={false}
        open={actionDivOpen}
        placement="right"
        okType="link"
        okText="关闭"
        onConfirm={() => {
          setActionDivOpen(false);
        }}
        title={
          <div>
            <Space>
              <Button type="link" onClick={onAddAction}>
                <img className={'icon-edge'} src={require('@/../public/images/link/action.svg')} />
                执行动作
              </Button>
              <Button type="link" onClick={onAddBranch}>
                <img className={'icon-edge'} src={require('@/../public/images/link/branch.svg')} />
                分支
              </Button>
            </Space>
          </div>
        }
      >
        {/* <PlusCircleFilled
          style={{
            color: '#498bef',
            fontSize: 20,
            margin: ' 0 auto',
            width: '100%',
          }}
          className="plusCircle"
          onClick={() => setActionDivOpen(!actionDivOpen)}
        /> */}
        <Button
          type="primary"
          shape="circle"
          icon={<PlusOutlined />}
          size={'small'}
          className="plusCircle"
          onClick={(e: any) => {
            e.stopPropagation();
            e.preventDefault();
            setActionDivOpen(!actionDivOpen);
          }}
        />
      </Popconfirm>
    </div>
  );
};
export default EdgeAction;
