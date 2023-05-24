import React, { useEffect, useImperativeHandle, useRef } from 'react';

import { Empty, Form, message, Modal, Spin } from 'antd';
import { useEventEmitter, useSafeState, useUnmount, useUpdate } from 'ahooks';
import loadsh from 'lodash';

import styles from './index.less';
import Mapping from './Mapping';
import { getProfieldDetailsList, getUserMapping, ModifyUserMapping } from './service';
import { handleInputListEcho, handleUserMappingNull } from './utils';

type MappingEventEmitterType = {
  fieldType?: string;
  value?: string;
  [propName: string]: any;
};
export interface ChildRef {
  showModal: () => void;
}
interface ChildProps<T> {
  id: T;
  type: T;
  name: T;
  logoType: T;
  updateProfileData?: any;
  closePopup?: () => void;
}

type nullOrUndefined = null | string;
type appProfileItemKey =
  | 'id'
  | 'name'
  | 'org_and_user_profile'
  | 'org_mapping'
  | 'ref_id'
  | 'ref_type'
  | 'user_mapping';

// 此处包裹一层为了解决传递的ID可能是任意类型 因此传递泛型来解决
const WrappedComponent = <T extends unknown>() => {
  return React.forwardRef<ChildRef, ChildProps<T>>((props, ref) => {
    const { id, type, name, logoType } = props;
    // alert(String(`${logoType}`)?.toLowerCase())
    const update = useUpdate();

    const [isModalOpen, setIsModalOpen] = useSafeState<boolean>(false);

    const [confirmLoading, setConfirmLoading] = useSafeState<boolean>(false);

    const inputSelectListRef = useRef<Record<appProfileItemKey, nullOrUndefined>[]>([]);

    const [spinLoading, setSpinLoading] = useSafeState<boolean>(true);

    const [saveProfileAnswer, setSaveProfileAnswer] = useSafeState<any>();

    let [timer] = useSafeState<any>('');

    const [form] = Form.useForm();
    // 声明全局通信事件线
    const MappingEventEmitter = useEventEmitter<MappingEventEmitterType>();

    MappingEventEmitter.useSubscription((fieldObject: any) => {
      // 只针对在输入框输入的逻辑
      if (fieldObject?.fieldType) {
        form.setFieldsValue({
          [fieldObject?.fieldType]: fieldObject?.value,
        });
      }
    });

    const showModal = () => {
      setIsModalOpen(true);
    };
    const handleOk = () => {
      setConfirmLoading(true);
      form?.validateFields().then((values) => {
        try {
          const { user_mapping } = saveProfileAnswer;
          if (user_mapping == null) {
            const copySaveProfileAnswer = loadsh?.cloneDeep(saveProfileAnswer);
            copySaveProfileAnswer.user_mapping = handleUserMappingNull(values, inputSelectListRef);
            // 修改用户映射关系
            ModifyUserMapping(id, type, copySaveProfileAnswer).then((res) => {
              if (res.error === '0') {
                setConfirmLoading(false);
                setIsModalOpen(false);
                props?.updateProfileData?.(saveProfileAnswer);
                props?.closePopup?.();
                message.success('修改成功!');
              } else {
                message.warning('服务异常!');
              }
            });
          } else {
            for (const item in values) {
              inputSelectListRef.current?.forEach((is: any) => {
                if (is.name === item) {
                  is.value = values[item];
                }
              });
            }
            saveProfileAnswer.user_mapping.to_iam.sub_params = inputSelectListRef.current;
            // 修改用户映射关系
            ModifyUserMapping(id, type, saveProfileAnswer).then((res) => {
              if (res.error === '0') {
                props?.updateProfileData?.(saveProfileAnswer);
                setConfirmLoading(false);
                props?.closePopup?.();
                setIsModalOpen(false);
                message.success('修改成功!');
              } else {
                message.warning('服务异常!');
              }
            });
          }
        } catch (error) {
          console.log('返回结果异常' + error);
          // message.warning('返回结果异常' + error);
        }
      });
    };
    const handleCancel = () => {
      setIsModalOpen(false);
      props?.closePopup?.();
    };

    useImperativeHandle(ref, () => ({
      showModal,
    }));

    useEffect(() => {
      if (id && type) {
        getProfieldDetailsList(id, type).then((res) => {
          try {
            const {
              data: { org_and_user_profile, user_mapping },
            } = res;
            setSaveProfileAnswer(res?.data);
            // 解构下拉列表的数组信息
            const { user_profile } = org_and_user_profile;
            const { sub_params = [] } = user_profile;
            // 请求输入框列表接口
            getUserMapping().then((rs) => {
              const inputSelectListSubparams = rs?.data?.sub_params;
              // 设置数组进行遍历渲染页面
              inputSelectListRef.current = inputSelectListSubparams;
              update();
              // 解构user_mapping 进行遍历查找对应的映射值 渲染完毕页面后进行回显
              handleInputListEcho(form, user_mapping, rs);
              // 渲染完毕后转递下拉列表数据
              MappingEventEmitter?.emit({
                sub_params,
                mappingPrefix: user_profile?.name,
              });
              setSpinLoading(false);
            });
          } catch (error) {
            // 打开loading
            timer = setTimeout(() => {
              setSpinLoading(false);
            }, 300);
            console.log('返回结果异常' + error);
            // message.warning('返回结果异常' + error);
          }
        });
      }
    }, [id, type]);

    useUnmount(() => {
      clearTimeout(timer);
    });
    const mapCallback = (item, index) => (
      <div key={index}>
        <Form.Item style={{ marginBottom: 0 }} colon={false} name={[item?.name]}>
          <Mapping
            dynamicBtnId={index}
            dynamicOperListId={index}
            item={item}
            MappingEventEmitter={MappingEventEmitter}
          />
        </Form.Item>
      </div>
    );
    const renderFormItem = inputSelectListRef?.current?.map(mapCallback);

    return (
      <div className={styles.modalStyle}>
        <Modal
          forceRender
          className={styles.modalStyle}
          title="用户属性映射"
          maskClosable={false}
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          width={1000}
          confirmLoading={confirmLoading}
        >
          <Spin
            spinning={spinLoading}
            style={{
              background: '#fff',
              opacity: '1',
              maxHeight: 'unset',
              minHeight: '100vh',
              width: '105%',
              marginLeft: -24,
              marginRight: -24,
            }}
          >
            <div
              style={{
                border: '1px solid #f0f0f0',
                width: '100%',
                display: 'flex',
                flexFlow: 'column',
              }}
            >
              {/* 弹窗标题部分 */}
              <div
                style={{
                  height: 80,
                  display: 'flex',
                  borderBottom: '1px solid #d7d7dc',
                }}
              >
                <div className={styles.leftDiv}>
                  <div className={styles.displayWrapper}>
                    {logoType && String(`${logoType}`)?.toLowerCase() ? (
                      <img
                        src={`/uc/images/linker/${String(`${logoType}`)?.toLowerCase()}.png`}
                        style={{ width: 75, height: 75 }}
                      />
                    ) : (
                      <img src={`/uc/images/web_type.png`} style={{ width: 75, height: 75 }} />
                    )}
                    <div>
                      <span>{name}-Profile</span>
                    </div>
                  </div>
                </div>
                <div className={styles.rightDiv}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      height: '100%',
                      marginLeft: 20,
                    }}
                  >
                    <img src="/uc/images/favicon.png" style={{ width: 50, height: 50 }} />
                    <div>
                      <span>{name}-Profile</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* 弹窗主体部分 */}
              <Form name="basic" style={{ width: '100%' }} autoComplete="off" form={form}>
                {inputSelectListRef?.current.length ? renderFormItem : <Empty />}
              </Form>
            </div>
          </Spin>
        </Modal>
      </div>
    );
  });
};

export default WrappedComponent;
