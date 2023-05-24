/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import tagAPI from '@/pages/UserCenter/tagAPI';
import type { SelectProps } from 'antd/es/select';

const { Option } = Select;

export interface SelectTagsProps<ValueType = any>
  extends Omit<SelectProps<ValueType>, 'options' | 'children'> {
  client_id: string;
}

const SelectTags: React.FC<SelectTagsProps> = (props) => {
  const { client_id, value, ...rest } = props;

  const [tags, setTags] = useState<string[]>([]);

  // 获取tags列表
  const fetchList = async () => {
    const result = await tagAPI.getTagList();
    if (result.error === '0' && result.data && result.data.length > 0) {
      setTags(result.data);
    }
  };

  useEffect(() => {
    fetchList();
  }, [client_id]);

  return (
    <Select
      mode="multiple"
      value={value}
      style={{ width: '100%' }}
      placeholder="选择标签"
      optionLabelProp="label"
      notFoundContent="无标签"
      {...rest}
    >
      {tags && tags.length > 0
        ? tags.map((tag: any, index: number) => {
            return (
              <Option value={tag.name} label={tag.name} key={`${tag}_${index}`}>
                <div className="demo-option-label-item">{tag.name}</div>
              </Option>
            );
          })
        : null}
    </Select>
  );
};

export default SelectTags;
