import { Col, Drawer, Form, Row } from 'antd';
import React, { useState } from 'react';
import DingdingDesc from './DingdingDesc';
import FeishuDesc from './FeishuDesc';
import WxDesc from './WxDesc';

export type ItemProps = {
  visible: boolean;
  onSubmit: (type: string) => void;
  onClose: () => void;
};

const AddDialog: React.FC<ItemProps> = (props: any) => {
  const { visible, onClose: setVisible, onSubmit } = props;
  const [certType, setCertType] = useState('');
  const onTypeChange = (type: any) => {
    setCertType(type);
    onSubmit(type);
  };
  const render = () => {
    return (
      <Drawer
        forceRender={true}
        title={'平台集成类型'}
        closable={true}
        destroyOnClose={true}
        width={'400px'}
        open={visible}
        onClose={() => {
          setVisible(false);
        }}
        footer={null}
        footerStyle={{ display: 'flex', justifyContent: 'flex-end' }}
      >
        <Form>
          <Row justify="space-around">
            <Col offset={1} span={22}>
              <DingdingDesc certType={certType} onTypeChange={onTypeChange} />
            </Col>
            <Col offset={1} span={22}>
              <WxDesc certType={certType} onTypeChange={onTypeChange} />
            </Col>
            <Col offset={1} span={22}>
              <FeishuDesc certType={certType} onTypeChange={onTypeChange} />
            </Col>
          </Row>
        </Form>
      </Drawer>
    );
  };
  return render();
};
export default AddDialog;
