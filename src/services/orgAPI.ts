import request from 'umi-request';
import { createQueryString } from '@/utils/common.utils';

export async function getOrgTree() {
  return request<API.ResponseData>(
    `/iam/api/orgs/_root/subs?depth=0&attrs=id,name,description,readonly`,
    {
      noTip: true,
    },
  );
}
export async function getFullOrgTree() {
  return request<API.ResponseData>(
    `/orgs/_root/subs?depth=0&attrs=id,name,description,readonly&type=no_scope`,
  );
}
export async function getOrg(id: any) {
  const params = {
    attrs: 'id,name,description,readonly,num_of_users,num_of_children',
  };
  return request<API.ResponseData>(`/orgs/${id}${createQueryString(params)}`);
}
