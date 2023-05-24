import request from 'umi-request';
import conf from '@/utils/conf';
import { createQueryString } from '@/utils/common.utils';

let extendedAttrAPI = {
  getAttrList(params) {
    return request(conf.getServiceUrl() + '/user_attrs' + createQueryString(params), {
      method: 'GET',
    });
  },
  // getAttrList(id) {
  //     return request(conf.getServiceUrl() + "/user_attrs/" + id, {
  //         method: 'GET',
  //     });
  // },
  addAttr(params) {
    return request(conf.getServiceUrl() + '/user_attrs', {
      method: 'POST',
      data: {
        ext_attrs: [params],
      },
    });
  },
  editAttr(id, params) {
    return request(conf.getServiceUrl() + '/user_attrs/' + id, {
      method: 'PATCH',
      data: params,
    });
  },
  getOrgAttrList(params) {
    return request(conf.getServiceUrl() + '/org_attrs/' + createQueryString(params), {
      method: 'GET',
    });
  },
};

export default extendedAttrAPI;
