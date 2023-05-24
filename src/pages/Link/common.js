import { nanoid } from 'nanoid';
export const fieldTypes = [
  {
    value: 'STRING',
    label: '字符串',
  },
  { value: 'BOOLEAN', label: '布尔' },
  {
    value: 'NUMBER',
    label: '数字',
  },
  {
    value: 'OBJECT',
    label: '对象',
  },
];
export const getUIID = (prefix = '') => {
  return nanoid();
};
export const getDefaultRootParam = (parentId = '') => {
  return [
    {
      ui_id: getUIID(parentId),
      name: 'root',
      type: 'OBJECT',
      description: 'root',
      sub_params: [],
    },
  ];
};
export const getNewField = (parentId = '') => {
  const ui_id = getUIID(parentId);
  return {
    ui_id,
    name: 'field' + ui_id,
    type: 'STRING',
    description: 'field' + ui_id,
  };
};
