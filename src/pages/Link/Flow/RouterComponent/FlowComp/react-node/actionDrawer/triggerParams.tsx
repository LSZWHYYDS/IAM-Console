import { Modal } from 'antd';
import { useState, useImperativeHandle, forwardRef } from 'react';
import EventDetailParam from '@/pages/Link/Manage/Components/EventDetailParam';

const TriggerParams = (props: any, ref: any) => {
  const [modal1Open, setModal1Open] = useState(false);

  const onOpen = () => {
    setModal1Open(true);
  };
  useImperativeHandle(ref, () => ({
    onOpen,
  }));

  const { body_schemaIn = [] } = props;
  return (
    <>
      <Modal
        title="查看Schema"
        style={{ top: 20 }}
        bodyStyle={{ paddingBottom: '400px' }}
        open={modal1Open}
        footer={null}
        onOk={() => setModal1Open(false)}
        onCancel={() => setModal1Open(false)}
        width={1000}
      >
        <EventDetailParam readOnly={true} list={(body_schemaIn && [body_schemaIn]) || []} />
      </Modal>
    </>
  );
};

export default forwardRef(TriggerParams);
