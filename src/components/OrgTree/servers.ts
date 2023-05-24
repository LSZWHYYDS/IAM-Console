import { request } from 'umi';

// 获取组织信息
export async function getTreeTableData(id: any, start: any, end: any, principals: any) {
  return request(`/mdm/admin/devices/fileList`, {
    method: 'GET',
    params: {
      audit_type: 1,
      principal: principals,
      start_time: start,
      end_time: end,
      page: 1,
      size: 10,
      filter: principals,
      dept_id: id,
    },
  });
}
