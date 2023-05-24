import { getAppInfo, requestData } from '../../../../server';
import { useMount, useSetState } from 'ahooks';
import { useLocation } from 'umi';
import { saveBaseInfo, saveClass } from '../../../../server';

import { useRef } from 'react';
export default ({ form, dispatch, handleStepsChange }: any) => {
  const location: any = useLocation();
  const client_id = location.query.client_id || sessionStorage.getItem('appClientId');
  const editAddPopupRef: any = useRef(null);
  const [state, setState] = useSetState<any>({
    appclassification: [],
    appBaseInfoData: {},
    visible: false,
    client_secret: '',
  });
  // 请求分类接口函数
  const requestClassApplication = () => {
    return requestData().then((rs) => {
      setState(() => {
        const tempArr: any = [];
        return {
          appclassification: rs.data.concat(tempArr),
        };
      });
    });
  };
  // 请求基本信息的回显数据
  const requestBaseInfoData = () => {
    return getAppInfo({ client_id }).then((rs) => {
      form.setFieldsValue({
        username: rs.client_name,
        custom_class: rs.custom_class,
        enable_apply: rs.enable_apply,
        client_uri: rs?.client_uri,
      });
      setState({
        appBaseInfoData: rs,
        client_secret: rs?.client_secret,
      });
    });
  };
  // 点击显示新建分类弹窗
  const hanldeAddCustApp = () => {
    editAddPopupRef?.current?.handleOpen();
  };
  const onFormSubmit = () => {
    const { validateFields } = form;
    validateFields().then((values) => {
      const obj = {
        client_name: values.username,
        logo_uri: state.appBaseInfoData.logo_uri,
        description: state.appBaseInfoData.description,
        auth_protocol: state?.appBaseInfoData?.auth_protocol,
        link_client_id: state.appBaseInfoData?.link_client_id,
        enable_apply: values.enable_apply,
        client_id: state.appBaseInfoData?.client_id,
        template_config: state.appBaseInfoData?.template_config,
      };
      if (state.appBaseInfoData?.link_client_id) {
        obj['client_id'] = state.appBaseInfoData?.client_id;
        obj['client_uri'] = values.client_uri;
      } else {
        obj['client_uri'] = values.client_uri;
      }
      saveBaseInfo(obj).then(async (rs) => {
        sessionStorage.setItem('transformClient', rs.client_id);
        await saveClass(rs.client_id, values?.custom_class);
        handleStepsChange(1);
      });
    });
  };
  useMount(async () => {
    dispatch({
      type: 'component_configs/modifyTestPageLoading',
      payload: true,
    });
    await requestClassApplication();
    await requestBaseInfoData();
    dispatch({
      type: 'component_configs/modifyTestPageLoading',
      payload: false,
    });
  });

  const onSuccessRegenerate = (newValue: string) => {
    form.setFieldsValue({
      client_secret: newValue,
    });
    setState({
      client_secret: newValue,
    });
  };

  return {
    state,
    editAddPopupRef,
    requestClassApplication,
    requestBaseInfoData,
    hanldeAddCustApp,
    onFormSubmit,
    onSuccessRegenerate,
  };
};
