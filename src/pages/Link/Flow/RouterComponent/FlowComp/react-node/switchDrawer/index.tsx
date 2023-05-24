import { forwardRef, useState, useEffect } from 'react';
import { Drawer, Input, Row, Col, Space, Button, message, Card } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import _ from 'lodash';
import 'ace-builds/src-noconflict/mode-sql'; // sql模式的包
import 'ace-builds/src-noconflict/mode-mysql'; // mysql模式的包
import 'ace-builds/src-noconflict/theme-xcode'; // xcode,(亮白)的主题样式
import 'ace-builds/src-noconflict/theme-twilight'; // twilight,(暗黑)的主题样式
import 'ace-builds/src-noconflict/ext-language_tools'; //（编译代码的文件）
import {
  getAllData,
  getPreActionNodeTiggerFieldList,
  saveFlowCanvas,
} from '@/pages/Link/Flow/RouterComponent/FlowComp/common';
import PreActionStart from '@/pages/Link/Manage/Components/PreActionStart';

const SwitchDrawer = (props: any) => {
  const [preActionNodes, setPreActionNodes] = useState([]);

  //触发事件对象
  const [startObj, setStartObj] = useState({});
  const flowData = _.get(props, 'flowData');
  const switchObj = _.get(flowData, 'info.switch') || {};
  const nodeName = switchObj.nodeName || '请输入条件名称';
  const { open } = props;
  const [isOrEdit, setIsOrEdit] = useState(true);

  const [titleString, setTitleString] = useState(nodeName);
  const [codeValue, setCodeValue] = useState(switchObj.expression || '');

  useEffect(() => {
    setTitleString(nodeName);
  }, [nodeName]);

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
  useEffect(() => {
    getAllData((data: any) => {
      const triggerPreActions = getPreActionNodeTiggerFieldList(data, flowData.id);
      setStartObj(triggerPreActions.startTrigger);
      setPreActionNodes(triggerPreActions.preActionNodes || []);
    });
  }, [props]);

  const onSave = () => {
    if (!titleString) {
      message.error('请输入条件名称');
      return;
    }
    saveFlowCanvas({
      preFlowData: flowData,
      fieldName: 'info.switch',
      newValue: {
        ...switchObj,
        nodeName: titleString,
        expression: codeValue,
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
  const onAddToExp = (value) => {
    setCodeValue((preState) => {
      const testAreaID: any = document.getElementById('textArea') as HTMLElement;
      const strPrefix = preState?.substr(0, testAreaID.selectionStart);
      const strlastFix =
        strPrefix + ' ' + value + ' ' + preState?.substr(testAreaID.selectionStart);
      return strlastFix;
    });
  };
  const renderEditor = () => {
    const hasLeftTable = startObj || preActionNodes.length;
    const leftTableObj =
      (hasLeftTable && (
        <Col span={8}>
          <PreActionStart
            leftKey="ui_id"
            startObj={startObj}
            preActionNodes={preActionNodes}
            onAdd={onAddToExp}
          />
        </Col>
      )) ||
      null;

    return (
      <Card title="请输入表达式" size="small">
        <Row>
          {leftTableObj}
          <Col span={(hasLeftTable && 16) || 24}>
            <textarea
              id="textArea"
              value={codeValue}
              onChange={(value) => setCodeValue(value.target.value)}
            ></textarea>
          </Col>
        </Row>
      </Card>
    );
  };

  return (
    <>
      <Drawer
        title={TitleNodes}
        placement="right"
        closable={false}
        destroyOnClose
        onClose={props.onClose}
        open={open}
        width={600}
        footer={footerOpt}
      >
        <Row>请设置表达式规则，表达式执行为true时，将执行该条件分支</Row>
        {renderEditor()}
      </Drawer>
    </>
  );
};
export default forwardRef(SwitchDrawer);
