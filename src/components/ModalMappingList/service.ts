import request from 'umi-request';

export async function getProfiledList() {
  return request(`/iam/api/appProfile`);
}

export async function getProfieldDetailsList(refId, type) {
  return request(`/iam/api/appProfile/${refId}/${type}`);
}

export async function getUserMapping() {
  return request(`/iam/api/appProfile/user/mapping`);
}

export async function ModifyUserMapping(refId, type, dataParams) {
  return request(`/iam/api/appProfile/${refId}/${type}`, {
    method: 'POST',
    data: dataParams,
  });
}
