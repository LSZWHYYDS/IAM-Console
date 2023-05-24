import { forwardRef, useState, useEffect, useRef } from 'react';
import { Drawer, Input, Row, Col, Space, Button, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import _ from 'lodash';
import ConnectList from '../connectList';
import ActionList from './actionList';
import { saveFlowCanvas } from '../../common';
import { getConnecctById } from '@/pages/Link/Flow/service';

/**
 * 抽屉组件又按内容拆分出两个单独小组件且在当前一个文件内（ RenderTriggerList 、RenderConnectList两个组件）
 */
const ActionDrawer = (props: any) => {
  const refActionList = useRef<any>(null);
  const flowData = _.get(props, 'flowData');
  const actionObj = _.get(flowData, 'info.action') || {};
  const nodeName = _.get(flowData, 'info.action.nodeName') || '请选择执行动作';
  const { open } = props;
  const [connectObj, setConnectObj] = useState({});
  const [isOrEdit, setIsOrEdit] = useState(true);

  const [titleString, setTitleString] = useState(nodeName);

  const [toggleConnect, setToggleConnect] = useState(!actionObj || !actionObj.action_id);
  const [action, setAction] = useState(actionObj || null);
  useEffect(() => {
    setTitleString(nodeName);
  }, [nodeName]);

  useEffect(() => {
    if (actionObj && actionObj.api_link_id) {
      getConnecctById(actionObj.api_link_id).then((rs) => {
        setToggleConnect(false);
        setConnectObj(rs.data || {});
      });
    }
  }, [actionObj]);

  /**
   * 抽屉关闭时切换回链接器列表
   */
  const afterOpenChange = () => {
    setToggleConnect(!actionObj || !actionObj.action_id);
  };

  const editTitleHandle = () => {
    setIsOrEdit(false);
  };

  const modifyValue = (event: any) => {
    setTitleString(event.target.value);
  };
  const onBlur = (event: any) => {
    setTitleString(event.target.value || '未命名');
    setIsOrEdit(true);
  };

  const TitleNodes = (
    <>
      {isOrEdit ? (
        <h4 style={{ marginTop: '8px', cursor: 'pointer' }} onClick={editTitleHandle}>
          {titleString}
          <EditOutlined />
        </h4>
      ) : (
        <Input value={titleString} onChange={modifyValue} onBlur={onBlur} onPressEnter={onBlur} />
      )}
    </>
  );

  const modifyToggleHandle = (bool: boolean, obj?: any) => {
    setToggleConnect(bool);
    if (obj) {
      setConnectObj(obj);
    }
  };
  const onSave = () => {
    if (!titleString) {
      message.error('请输入执行动作名称');
      return;
    }
    if (!action || !refActionList.current) {
      message.error('请选择执行动作');
      return;
    }
    const actionData = refActionList.current.getData();
    console.log('actionData', actionData);
    saveFlowCanvas({
      preFlowData: flowData,
      fieldName: 'info.action',
      newValue: {
        api_link_id: action.api_link_id,
        action_id: action.action_id || action.id,
        nodeName: titleString,
        action_name: action.action_name || action.name,
        action_schema: actionData.config,
      },
    });
    props.onClose();
  };
  const footerOpt = (
    <Row>
      <Col span={24} style={{ textAlign: 'right' }}>
        <Space>
          <Button onClick={props.onClose}>取消</Button>
          <Button type="primary" onClick={onSave}>
            保存
          </Button>
        </Space>
      </Col>
    </Row>
  );
  return (
    <>
      <Drawer
        title={TitleNodes}
        closable={false}
        placement="right"
        destroyOnClose
        onClose={props.onClose}
        open={open}
        width={1000}
        afterOpenChange={afterOpenChange}
        footer={footerOpt}
      >
        {toggleConnect ? (
          <div>
            <ConnectList modifyToggleHandles={(obj) => modifyToggleHandle(false, obj)} />
          </div>
        ) : (
          <>
            <ActionList
              ref={refActionList}
              connectObj={connectObj}
              actionObj={actionObj}
              nodeId={flowData.id}
              modifyToggleHandle={() => modifyToggleHandle(true)}
              onSelect={(obj: any) => {
                setAction(obj);
              }}
            />
          </>
        )}
      </Drawer>
    </>
  );
};
export default forwardRef(ActionDrawer);
