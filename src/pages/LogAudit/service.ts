import request from 'umi-request';

export async function getLog(params = { page: 0, size: 50 }) {
  return request<API.ResponseData>(`/iam/api/auditlog`, {
    params: {
      ...params,
    },
  });
}
export async function getDevices(params: any) {
  return request<API.ResponseData>(`/mdm/admin/devices/fileList`, {
    params: {
      ...params,
      start_time: params.start_time + `000`,
      end_time: params.end_time + `000`,
      filter: params.principal,
    },
  });
}

// 用户截屏接口
export async function getDevices_ls(params: any) {
  return request<API.ResponseData>(`/mdm/admin/devices/fileList`, {
    params: {
      ...params,
    },
  });
}

// 用户截屏打包接口
export async function ExportPackaging(params: any) {
  return request(`/mdm/admin/devices/package`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// 用户截屏获取打包接口
export async function getPackaging() {
  return request(`/mdm/admin/devices/packageLog`, {
    method: 'GET',
  });
}

// 用户截屏删除打包接口
export async function DeletePackage(deleteID: number) {
  return request(`/mdm/admin/devices/packageLog/${deleteID}`, {
    method: 'DELETE',
  });
}

// 用户截屏下载打包接口
export async function DownloadPackage(downloadID: number) {
  return request(`/mdm/admin/devices/download`, {
    method: 'GET',
    params: {
      id: downloadID,
    },
  });
}

// 用户截屏下载图片接口
export async function DownloadPicture(downloadID: number) {
  return request(`/mdm/admin/devices/downloadUrl`, {
    method: 'GET',
    params: {
      path: downloadID,
    },
  });
}
