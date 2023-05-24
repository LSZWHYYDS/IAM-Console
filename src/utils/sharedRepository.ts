class SharedRepository {
  // public name: string;
  // public sex: string;
  // constructor() { }
  DownloadLink(data: string, fileName: string): HTMLAnchorElement {
    const text = data;
    const element = document.createElement('a');
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`);
    element.setAttribute('download', fileName);

    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();

    return document.body.removeChild(element);
  }
}
export default new SharedRepository();
