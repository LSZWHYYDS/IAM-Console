import React from 'react';

import { Form } from 'antd';
import { useClickAway, useSafeState, useUpdateEffect } from 'ahooks';
import { EventEmitter } from 'ahooks/lib/useEventEmitter';

import styles from './operation.less';
import EditOrEnter from '@/components/EditorEnter';
import { getProfiledList } from './service';

type MappingEventEmitterType = {
  fieldType?: string;
  value?: string;
  [propName: string]: any;
};

type IProps = {
  dynamicBtnId: string | number;
  dynamicOperListId: string | number;
  value?: string;
  onChange?: () => void;
  item?: any;
  MappingEventEmitter?: EventEmitter<MappingEventEmitterType>;
};

const Operation: React.FC<IProps> = (props) => {
  const { dynamicBtnId, dynamicOperListId, value, onChange, MappingEventEmitter, item } = props;

  const [isShowSelectList, setIsShowSelectList] = useSafeState<boolean>(false);

  const [switchOperationPicture, setSwitchOperationPicture] = useSafeState<boolean>(false);

  const [editOrEnterData, setEditOrEnterData] = useSafeState<any>();

  const form = Form.useFormInstance();

  useClickAway(() => {
    setIsShowSelectList(false);
  }, [
    document.getElementById('btn' + dynamicBtnId), // 必须给操作按钮绑定hook 否则点击按钮导致下拉列表异常
    document.getElementById('operationList' + dynamicOperListId),
  ]);
  /**
   * @description 此处监听有两处作用
   *    1. 监听用户在输入框输入内容或者删除内容 中间图标自动更换相应状态
   *    2. 若后台回显时候有值 则自动更换映射的图标
   */
  useUpdateEffect(() => {
    if (value?.trim()) {
      setSwitchOperationPicture(true);
    } else {
      setSwitchOperationPicture(false);
    }
  }, [value]);

  const liTagEventDelegation = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    const getFieldValue = form?.getFieldValue(`${item.name}`);
    const liTagInnerText = (e.target as HTMLUListElement)?.innerText;
    if (liTagInnerText === '启用映射' && getFieldValue) {
      setSwitchOperationPicture(true);
    } else {
      MappingEventEmitter?.emit({ fieldType: `${item.name}`, value: '' });
      setSwitchOperationPicture(false);
    }
    // 无论点击哪一个操作按钮 都将关闭下拉列表
    setIsShowSelectList(false);
  };

  const openSelectList = () => {
    setIsShowSelectList(!isShowSelectList);
  };

  MappingEventEmitter?.useSubscription((fieldObject: any) => {
    if (fieldObject?.sub_params && fieldObject?.sub_params?.length !== 0) {
      setEditOrEnterData(fieldObject);
    }
  });

  return (
    <>
      <div className={styles.leftDiv}>
        <div className={styles.mappingWrapper}>
          <div className={styles.mappingWrapper_select}>
            <EditOrEnter
              value={value}
              onChange={onChange}
              dynamicId={dynamicBtnId}
              requestNetwork={getProfiledList}
              componentData={{
                editOrEnterData: editOrEnterData?.sub_params || [],
                preFix: editOrEnterData?.mappingPrefix || '',
              }}
            />
          </div>
          <button
            id={'btn' + dynamicBtnId}
            className={styles.mappingWrapper_operationBtn}
            onClick={openSelectList}
          >
            {/* imgWraps 灰色图标 */}
            <div
              className={switchOperationPicture ? `${styles.imgWrap}` : `${styles.imgWraps}`}
            ></div>
            <div className={styles.icon}></div>
            <div
              id={'operationList' + dynamicOperListId}
              className={styles.operary_block}
              style={{ display: isShowSelectList ? 'block' : 'none' }}
            >
              <ul className={styles.ul} onClick={liTagEventDelegation}>
                <li>
                  <div
                    style={{
                      width: 45,
                      height: 14,
                      margin: '5px 0 0 7px',
                    }}
                    className={styles.MappingIcon}
                  ></div>
                  <span>启用映射</span>
                </li>
                <li>
                  <div
                    style={{ width: 35, height: 14, margin: '5px 10px 0 7px' }}
                    className={styles.notMappingIcon}
                  ></div>
                  <span>不映射</span>
                </li>
              </ul>
            </div>
          </button>
        </div>
      </div>

      <div className={styles.rightDiv}>
        <div className={styles.mappingWrapper}>
          <div className={styles.mappingWrapper_select}>{item?.description}</div>
          <div className={styles.mappingWrapper_operationBtn}>{item?.type}</div>
        </div>
      </div>
    </>
  );
};
export default Operation;
