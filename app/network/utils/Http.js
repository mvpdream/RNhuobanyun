'use strict';

//const SERVER = 'http://i-test.huobanyun.cn';
//const SERVER = 'http://i.huobanyun.cn';
const SERVER = 'http://192.168.0.150';
//const SERVER = 'http://i-preview.huobanyun.cn';
const MOBILE_API = `${SERVER}/Mobile`;

/**
 * 构建表单数据对象
 * @param params 表单参数
 * @returns {*} 构建后的FormData对象
 */
var createFormData = function (params) {
  var data = new FormData();
  //我们需要将FormData里的数组和特殊对象扁平处理
  var flattenFormData = function (args, formDataObj) {
    for (let key in args) {
      //将参数附加到表单中
      if (args.hasOwnProperty(key) && args[key] !== null && args[key] !== undefined) {
        //图片特殊处理
        if (key.toLowerCase() === 'files' && null != args[key] && args[key] !== undefined) {
          var files = args[key];
          for (let i = 0; i < files.length; i++) {
            formDataObj.append('Files', {
              uri: files[i]['uri'],
              name: files[i]['name'],
              type: 'application/octet-stream'
            })
          }
        }
        /*
         判断是否是数组对象
         如果是数组 不可以直接作为FormData项提交
         需要FormData append的value必须是基本对象
         */
        else if (Array.isArray(args[key])) {
          var arr = args[key];
          for (let i = 0; i < arr.length; i++) {
            if (null != arr[i] && arr[i] !== undefined) {
              flattenFormData({[key]: arr[i]}, formDataObj)
            }
          }
        }
        // 复杂对象
        else if (typeof args[key] == "object") {
          flattenFormData(args[key], formDataObj)
        }
        // 简单对象 String/Number/Boolean
        else {
          formDataObj.append(key, args[key])
        }
      }
    }
  };
  flattenFormData(params, data);
  return data
};
var errConsumer, errQueue = [];

/**
 * 尝试消费错误,如果没有指定消费函数,则加入队列
 * @param err
 */
var tryConsumeErr = function (err) {
  if (!!errConsumer && typeof errConsumer === 'function') {
    if (err) {
      errConsumer(err);
    } else if (errQueue.length > 0) {
      errQueue.map(errConsumer);
    }
  } else {
    errQueue[errQueue.length] = err;
  }
};

/**
 * 设置错误队列消费函数,唯一
 * @param consumeFunc
 */
export function setErrConsumeFunction(consumeFunc) {
  errConsumer = consumeFunc;
  tryConsumeErr();
}

/**
 * 发送get请求
 * @param {string} action action地址
 * @returns {Promise.<T>}
 */
export function getData(action) {
  return fetch(`${MOBILE_API}/${action}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }).then((res)=>res.json()).catch(err=> {
    tryConsumeErr(err);
    return err;
  });
}

/**
 * 发送post请求
 * @param {string} action action地址
 * @param {object} params 参数
 * @returns {Promise.<T>} ?
 */
export function postData(action, params) {
  for (let key in params) {
    //将参数附加到表单中
    if (params[key] === null || params[key] === undefined) {
      delete params[key]
    }
  }
  return fetch(`${MOBILE_API}/${action}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  }).then((res)=>res.json()).catch(err=> {
    tryConsumeErr("系统错误:" + err);
    return err;
  });
}

/**
 * post提交表单
 * @param action 提交地址
 * @param formParams 表单参数
 */
export function postFormData(action, formParams) {
  var _formData = createFormData(formParams);
  return fetch(`${MOBILE_API}/${action}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'multipart/form-data'
    },
    body: _formData
  }).then(res=>res.json()).catch(err=> {
    tryConsumeErr("系统错误:" + err);
    return err;
  });
}
