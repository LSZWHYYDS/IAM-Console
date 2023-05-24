import { Button, Modal } from 'antd';
import React, { useState, useRef } from 'react';
import BaseLinker from './BaseLinker';
import HttpLinker from './HttpLinker';
import { addLink } from '../service';
import { showErrorMessage, showSuccessMessage } from '@/utils/common.utils';
import DbLinker from './DbLinker';

const AddLinker: React.FC = (props: any) => {
  const baseLinkerRef = useRef();
  const settingLinkerRef = useRef();
  const [step, setStep] = useState(1);
  const [baseData, setBaseData] = useState({});
  const [settingData, setSettingData] = useState({});

  const onCancel = () => {
    props.onClose();
  };
  const onSubmit = async () => {
    const data_base_info = await settingLinkerRef.current.getDataOnSave();
    let payload = {
      ...baseData,
    };
    if (baseData.type !== 'HTTP') {
      payload.data_base_info = data_base_info;
    } else {
      payload = {
        ...payload,
        ...data_base_info,
      };
    }
    const p = addLink(payload);
    p.then(() => {
      showSuccessMessage();
      props.onClose();
    }).catch((error: any) => {
      showErrorMessage(error.message);
    });
  };

  const onNext = async () => {
    const baseFormData = await baseLinkerRef.current.getData();
    setBaseData(baseFormData);
    setStep(2);
  };
  const onPre = async () => {
    const baseFormData = await settingLinkerRef.current.getData();
    setSettingData(baseFormData);
    setStep(1);
  };
  const render = () => {
    const { visible, onClose } = props;
    const isHttp = baseData.type === 'HTTP';
    return (
      <Modal
        title="新增连接器"
        width={1100}
        destroyOnClose
        open={visible}
        footer={null}
        onCancel={onClose}
      >
        {(step === 1 && <BaseLinker ref={baseLinkerRef} data={baseData} />) || null}
        {(step === 2 && isHttp && <HttpLinker ref={settingLinkerRef} data={settingData} />) || null}
        {(step === 2 && !isHttp && <DbLinker ref={settingLinkerRef} data={settingData} />) || null}
        <div className="footerContainer">
          <Button type="ghost" className="ml-10" onClick={onCancel}>
            取消
          </Button>
          {(step === 1 && (
            <Button type="primary" onClick={onNext}>
              下一步
            </Button>
          )) ||
            null}
          {(step === 2 && (
            <Button type="primary" onClick={onPre}>
              上一步
            </Button>
          )) ||
            null}
          {(step === 2 && (
            <Button type="primary" className="ml-10" onClick={() => onSubmit()}>
              保存
            </Button>
          )) ||
            null}
        </div>
      </Modal>
    );
  };
  return render();
};

export default AddLinker;
