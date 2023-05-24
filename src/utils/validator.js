export const lengthRange = function (min, max, rule, value, callback) {
  if (value) {
    let len = value.trim().length;
    if (len < min || len > max) {
      callback('请输入' + min + '-' + max + '个字符');
    } else {
      callback();
    }
  } else {
    callback();
  }
};
export const validateName = function (_rule, value, callback, title) {
  const regExp = /^\+?[0-9a-zA-Z_-]{2,50}$/;
  if (value && !regExp.test(value)) {
    callback(title);
  } else {
    callback();
  }
};
export const isGroupName = function (rule, value, callback) {
  const regExp = /^[\w\_\u4e00-\u9fa5]+$/;
  if (value && !regExp.test(value)) {
    callback('只能由字母、数字、_或汉字组成');
  } else {
    callback();
  }
};
export const isEmail = (str) => {
  var pattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
  return pattern.test(str);
};
