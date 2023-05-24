import request from 'umi-request';
import { message } from 'antd';
export const exportToCsvss = (
  url: string,
  filename: any,
  idsArr: any,
  start: any,
  end: any,
  principal: any,
  selectedKeys: any,
) => {
  if (navigator.userAgent.indexOf('Trident') > 0 || navigator.userAgent.indexOf('Edge') > 0) {
    window.open(url + '&tcode=' + sessionStorage.getItem('tcode'));
  } else {
    document.body.style.cursor = 'progress';
    request(url, {
      method: 'POST',
      data: {
        // fileIds: idsArr.length ? idsArr.join(',') : '',
        fileIds: idsArr.length ? idsArr : '',
        endTime: start + '000',
        deptId: [selectedKeys], // 部门ID
        startTime: end + '000',
        filter: principal, // 输入框
      },
      responseType: 'blob',
    })
      .then((result) => {
        if (result.code == '3019002') {
          message.error('当前下载数为0');
          return;
        }
        if (result.code == '3019001') {
          message.error('下载数超过最大值');
          return;
        }
        const alink = document.createElement('a');
        document.body.appendChild(alink);
        alink.style.display = 'none';
        alink.href = window.URL.createObjectURL(result);
        alink.setAttribute('download', filename);
        alink.click();
        document.body.removeChild(alink);
      })
      .catch(() => {
        document.body.style.cursor = 'default';
      });
  }
};
