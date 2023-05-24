/*jshint esversion: 6 */
// import request from 'umi-request';
import { request } from 'umi';

import { createQueryString } from '@/utils/common.utils';

let tagAPI = {
  getTagList(params) {
    return request('/iam/api/tags' + createQueryString(params), {
      method: 'GET',
    });
  },
  getTag(name) {
    return request('/iam/api/tags/' + name, {
      method: 'GET',
    });
  },
  addTag(params, file) {
    return request('/iam/api/tags', {
      method: 'POST',
      data: { ...params },
    });
  },
  editTag(name, params, file) {
    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    }
    formData.append('description', params.description);
    // formData.append('data', params);
    return request('/iam/api/tags/' + name, {
      method: 'PATCH',
      data: formData,
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
    });
  },
  editTagNoFile(name, params) {
    return request('/iam/api/tags/' + name, {
      method: 'PUT',
      data: params,
    });
  },
  deleteTag(name) {
    return request('/iam/api/tags/' + name, {
      method: 'DELETE',
    });
  },
  getTagUsers(params = { page: 0, size: 20 }) {
    const { name } = params;
    params.attrs = 'sub,username,picture,email,phone_number,name';
    delete params.name;
    return request(
      '/iam/api/tags/' +
        name +
        '/users' +
        createQueryString(params, {
          method: 'GET',
        }),
    );
  },
  addUsersTag(name, payload) {
    return request('/iam/api/tags/' + name + '/users', {
      method: 'POST',
      data: { ...payload },
    });
  },
  removeUserTag(name, params) {
    return request('/iam/api/tags/' + name + '/users' + createQueryString(params), {
      method: 'DELETE',
    });
  },
  createConversation(tagId, payload) {
    return request('/iam/api/createConversation/' + tagId, {
      method: 'POST',
      data: { ...payload },
    });
  },
  importFile(file, payload) {
    // const formData = new FormData();
    // formData.append('multipart_file', file);
    // formData.append("tag_create", JSON.stringify(payload));
    return request('/iam/api/tags/importExcel', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
        'Content-Type': 'multipart/form-data',
        'media type': 'multipart/form-data',
      },
      data: {
        multipart_file: file,
        create_tag_excel: payload,
      },
    });
  },
  getUserAttrs() {
    return request('/iam/api/user_attrs', {
      method: 'GET',
      params: {
        searchable: true,
      },
    });
  },
};
export default tagAPI;
