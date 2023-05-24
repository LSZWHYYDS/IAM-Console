import { forwardRef, useState, useEffect } from 'react';
import { Drawer, Input, Row, Col, Space, Button, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import _ from 'lodash';
import ConnectList from '../connectList';
import TriggerList from './triggerList';
import { saveFlowCanvas } from '../../common';
import { getConnecctById } from '@/pages/Link/Flow/service';

/**
 * 抽屉组件又按内容拆分出两个单独小组件且在当前一个文件内（ RenderTriggerList 、RenderConnectList两个组件）
 */
const TriggerDrawer = (props: any) => {
  const flowData = _.get(props, 'flowData');
  const startObj = props.flowData?.info?.nodeData?.config.start;
  const { open } = props;
  const [connectObj, setConnectObj] = useState({});
  const [isOrEdit, setIsOrEdit] = useState(true);

  const [titleString, setTitleString] = useState(
    _.get(flowData, 'info.nodeData.config.start_name') || '请选择触发事件',
  );

  const [toggleConnect, setToggleConnect] = useState(!startObj || !startObj.trigger_id);
  const [trigger, setTrigger] = useState<any>(null);

  useEffect(() => {
    setTitleString(_.get(flowData, 'info.nodeData.config.start_name') || '请选择触发事件');
  }, [props.flowData.info?.nodeData?.config?.start_name]);
  useEffect(() => {
    if (startObj && startObj.api_link_id) {
      getConnecctById(startObj.api_link_id).then((rs) => {
        setToggleConnect(false);
        setConnectObj(rs.data || {});
      });
    }
  }, [props.flowData.info?.nodeData?.config.start]);
  /**
   * 抽屉关闭时切换回链接器列表
   */
  const afterOpenChange = () => {
    setToggleConnect(!startObj || !startObj.trigger_id);
  };

  const editTitleHandle = () => {
    setIsOrEdit(false);
  };

  const modifyValue = (event: any) => {
    setTitleString(event.target.value);
  };

  const TitleNodes = (
    <>
      {isOrEdit ? (
        <h4 style={{ marginTop: '8px', cursor: 'pointer' }} onClick={editTitleHandle}>
          {titleString}
          <EditOutlined />
        </h4>
      ) : (
        <Input value={titleString} onChange={modifyValue} onBlur={() => setIsOrEdit(true)} />
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
      message.error('请输入触发器名称');
      return;
    }
    if (!trigger) {
      message.error('请选择触发事件');
      return;
    }
    saveFlowCanvas({
      preFlowData: flowData,
      fieldName: 'info.nodeData.config.start_name',
      newValue: titleString,
    });
    saveFlowCanvas({
      preFlowData: flowData,
      fieldName: 'info.nodeData.config.start',
      newValue: {
        trigger_id: trigger.id,
        trigger_name: trigger.name,
        api_link_id: trigger.api_link_id,
        body_schema: _.get(trigger, 'config.body_schema'),
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
        width={600}
        afterOpenChange={afterOpenChange}
        footer={footerOpt}
      >
        {toggleConnect ? (
          <div>
            <ConnectList modifyToggleHandles={(obj) => modifyToggleHandle(false, obj)} />
          </div>
        ) : (
          <TriggerList
            connectObj={connectObj}
            startObj={startObj}
            modifyToggleHandle={() => modifyToggleHandle(true)}
            onSelect={(obj: any) => {
              setTrigger(obj);
            }}
          />
        )}
      </Drawer>
    </>
  );
};
export default forwardRef(TriggerDrawer);
