import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import { getPositions } from '@/pages/AppCenter/AppList/service';
import type { SelectProps } from 'antd/es/select';

const { Option } = Select;

export interface SelectPositionsProps<ValueType = any>
  extends Omit<SelectProps<ValueType>, 'options' | 'children'> {
  client_id: string;
}

const SelectPositions: React.FC<SelectPositionsProps> = (props) => {
  const { client_id, value, ...rest } = props;

  const [positions, setPositions] = useState<string[]>([]);

  // 获取Positions列表
  const fetchPositions = async () => {
    const result = await getPositions();
    if (result.error === '0' && result.data && result.data.length > 0) {
      setPositions(result.data);
    }
  };

  useEffect(() => {
    fetchPositions();
  }, [client_id]);

  return (
    <Select
      mode="multiple"
      value={value}
      style={{ width: '100%' }}
      placeholder="选择身份"
      optionLabelProp="label"
      notFoundContent="您的组织架构中无任何身份"
      {...rest}
    >
      {positions && positions.length > 0
        ? positions.map((position: string, index: number) => {
            return (
              <Option value={position} label={position} key={`${position}_${index}`}>
                <div className="demo-option-label-item">{position}</div>
              </Option>
            );
          })
        : null}
    </Select>
  );
};

export default SelectPositions;
