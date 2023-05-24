import request from 'umi-request';

export async function getPolicies() {
  return request<API.ResponseData>('/iam/api/configs/policies', {
    headers: {
      Authorization: ``,
    },
  });
}
export async function editPolicies(params: any) {
  return request<API.ResponseData>('/iam/api/configs/policies', {
    method: 'PATCH',
    data: params,
    // headers: {
    //    'Accept': 'text/html'
    // }
  });
}

// getPolicies() {
//   axios.defaults.baseURL = conf.getServiceUrl();
//   return axios.get("/configs/policies", {
//       transformRequest: [(data, headers) => {
//           delete headers.common.Authorization;
//           return data;
//       }],
//       headers: {
//           "tcode": sessionStorage.getItem("tcode")
//       }
//   });
// },

export async function getTotalUserInfo(params: any) {
  const result = await request('/iam/api/user_attrs', {
    method: 'GET',
    params: {
      ...params,
    },
    headers: {
      authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
    },
  });
  const response = {
    data: result.data.items,
    current: result.data.page,
    pageSize: result.data.size,
    total: result.data.total,
  };
  return response;
}

export async function modifyUserInfo(id: any, params: any) {
  return request(`/iam/api/user_attrs/${id}`, {
    method: 'PATCH',
    data: params,
  });
}

export async function addUserField(data: any) {
  return request(`/iam/api/user_attrs`, {
    method: 'POST',
    data,
    headers: {
      authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
    },
  });
}

export async function deleteUserInfo(idName: any) {
  return request(`/iam/api/user_attrs/${idName}`, {
    method: 'DELETE',
  });
}
