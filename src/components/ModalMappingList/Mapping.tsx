import React from 'react';
import { EventEmitter } from 'ahooks/lib/useEventEmitter';

import Operation from './Operation';

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

const Mapping: React.FC<IProps> = (props) => {
  const { dynamicBtnId, dynamicOperListId, value, onChange, MappingEventEmitter, item } = props;

  return (
    <div style={{ display: 'flex' }}>
      <Operation
        dynamicBtnId={dynamicBtnId}
        dynamicOperListId={dynamicOperListId}
        value={value}
        onChange={onChange}
        item={item}
        MappingEventEmitter={MappingEventEmitter}
      />
    </div>
  );
};
export default Mapping;
