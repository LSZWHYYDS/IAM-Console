import { forwardRef, useEffect, useRef, useState } from 'react';
import { Button, Select } from 'antd';
import _ from 'lodash';
import { UnorderedListOutlined } from '@ant-design/icons';
import { getTriggerList } from '@/pages/Link/Manage/service';
import styles from './index.less';
import TriggerParams from './triggerParams';

/**
 * 渲染触发事件列表组件
 */
const TriggerList = (props: any) => {
  const { connectObj, startObj } = props;
  const modalRef = useRef<any>(null);

  const [triggerEventList, setTriggerEventList] = useState<any>();
  const [selectId, setSelectId] = useState((startObj && startObj.trigger_id) || '');
  useEffect(() => {
    if (props.connectObj) {
      getTriggerList({ linkId: props.connectObj.id, page: 1, size: 10000 }).then((rs) => {
        setTriggerEventList(rs.data.items);
      });
    }
  }, [props]);
  const returnListHandle = () => {
    props.modifyToggleHandle();
  };

  const selectHandle = (key: any) => {
    setSelectId(key);
    const obj = _.find(triggerEventList, {
      id: key,
    });
    props.onSelect(obj);
  };
  const renderParams = () => {
    if (!selectId) {
      return;
    }
    const obj = _.find(triggerEventList, {
      id: selectId,
    });
    const body_schemaIn = _.get(obj, 'config.body_schema');
    return <TriggerParams ref={modalRef} body_schemaIn={body_schemaIn} />;
  };
  const render = () => {
    if (!connectObj) {
      return null;
    }

    return (
      <>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <img
              src={require('@/../public/images/link/connect.png')}
              className={styles.imgClass}
              style={{ marginLeft: '0' }}
            />
            <span>{connectObj.name}</span>
          </div>
          <div>
            <Button onClick={() => returnListHandle()} icon={<UnorderedListOutlined />}>
              切换其他
            </Button>
          </div>
        </div>
        <h3 style={{ marginTop: '10px' }}>触发事件</h3>
        <Select
          style={{ width: '100%' }}
          placeholder="请选择触发事件名称"
          defaultValue={selectId}
          allowClear
          options={triggerEventList}
          fieldNames={{ label: 'name', value: 'id' }}
          onSelect={selectHandle}
        />
        {selectId ? (
          <Button
            type="dashed"
            block
            style={{ marginTop: '30px' }}
            onClick={() => modalRef.current.onOpen()}
          >
            查看出参
          </Button>
        ) : (
          ''
        )}

        {renderParams()}
      </>
    );
  };
  return render();
};

export default forwardRef(TriggerList);
