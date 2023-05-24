/**
 * @param { form } 表单的formRef
 * @param { user_mapping } GET Profield接口的user_mapping字段
 * @param { rs } GET mapping接口的返回结果 拿rs里的数组进行和user_mapping里做对应回显
 */
export const handleInputListEcho = (form, user_mapping, rs) => {
  if (!user_mapping) return;
  const {
    to_iam: { sub_params },
  } = user_mapping;
  rs?.data?.sub_params.forEach((forIs) => {
    // 拿右边iam值去porfeil接口查 如有查到则设置回显
    sub_params?.forEach((subIs) => {
      if (forIs?.name === subIs?.name) {
        // [`field${mapIx}`]: `${rs?.data?.name}.${mapIs?.name}` // 带有前缀的回显
        form.setFieldsValue({
          [`${forIs?.name}`]: subIs?.value,
        });
      }
    });
  });
};

/**
 * @description 如果user_mapping为空,则拿取value的key跟请求的mapping接口列表做对比
 */
export const handleUserMappingNull = (values, inputSelectListRef) => {
  const user_mapping: any = {
    to_iam: {
      alias: null,
      description: 'user',
      multi_valued: false,
      name: 'user',
      type: 'OBJECT',
      ui_id: null,
      value: null,
      value_type: 'JSON_PATH',
      sub_params: [],
    },
  };

  for (const item in values) {
    inputSelectListRef.current?.forEach((is: any) => {
      console.log(is.name);
      console.log(is);

      // 有值进行push添加新的value值
      // if (values[item]) {
      if (is.name === item) {
        is.value = values[item];
        user_mapping.to_iam.sub_params?.push(is);
      }
      // }
    });
  }

  return user_mapping;
};
