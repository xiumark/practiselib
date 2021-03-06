/**
 * Created by a on 2017/7/26.
 */
import { HOST_IP, getHttpHeader, httpRequest } from '../util/network';

export function getAssetModelList(cb) {
  let headers = getHttpHeader();
  httpRequest(
    HOST_IP + '/summaries',
    {
      headers: headers,
      method: 'GET'
    },
    response => {
      cb && cb(response);
    }
  );
}

/**
 * 获取 model summary 通过 model ID
 * @param {String} modelID
 * @param {Function} cb
 * @return {Object}
 */
export function getModelSummariesByModelID(modelID, cb) {
  httpRequest(
    `${HOST_IP}/summaries/${modelID}`,
    {
      headers: getHttpHeader(),
      method: 'GET'
    },
    response => {
      cb && cb(response);
    }
  );
}

/**
 * 获取模型型号
 * @param modelId
 * @param cb
 */
export function getModelTypeByModel(modelId, cb) {
  const headers = getHttpHeader();
  httpRequest(
    HOST_IP + '/summaries/' + modelId + '/types',
    {
      headers: headers,
      method: 'GET'
    },
    response => {
      cb && cb(response);
    }
  );
}

/**
 * 更新模型型号
 * @param modelId
 * @param data
 * @param cb
 */
export function updateModelTypeByModel(modelId, data, cb, resparam, errCb) {
  const headers = getHttpHeader();
  // let querystring = JSON.stringify(data);
  // httpRequest(HOST_IP + '/summaries/' + modelId + '/types?types=' + encodeURIComponent(querystring), {
  httpRequest(
    HOST_IP + '/summaries/' + modelId + '/types',
    {
      headers: headers,
      method: 'PUT',
      body: JSON.stringify(data)
    },
    response => {
      cb && cb(response);
    },
    resparam,
    msg => {
      errCb && errCb(msg);
    }
  );
}

export function getAssetList(cb) {
  let headers = getHttpHeader();
  httpRequest(
    HOST_IP + '/assets',
    {
      headers: headers,
      method: 'GET'
    },
    response => {
      cb && cb(response);
    }
  );
}

export function getSearchAssets(domainId, model, name, offset, limit, cb) {
  let headers = getHttpHeader();
  let paramStr = JSON.stringify({
    include: ['extend'],
    where: getSearchParam(domainId, model, name),
    offset: offset,
    limit: limit
  });
  httpRequest(
    HOST_IP + '/assets?filter=' + encodeURIComponent(paramStr),
    {
      headers: headers,
      method: 'GET'
    },
    response => {
      // console.log("getSearchAssets:")
      // console.log("getSearchAssets:", response)
      cb && cb(response);
    }
  );
}

export function getSearchAssets2(model, name, cb) {
  let headers = getHttpHeader();
  let paramStr = JSON.stringify({
    include: ['extend'],
    where: getSearchParam(null, model, name)
  });
  httpRequest(
    HOST_IP + '/assets?filter=' + encodeURIComponent(paramStr),
    {
      headers: headers,
      method: 'GET'
    },
    response => {
      cb && cb(response);
    }
  );
}

export function getSearchCount(domainId, model, name, cb) {
  let headers = getHttpHeader();

  let paramStr = JSON.stringify(getSearchParam(domainId, model, name));

  httpRequest(
    HOST_IP + '/assets/count?where=' + encodeURIComponent(paramStr),
    {
      headers: headers,
      method: 'GET'
    },
    response => {
      cb && cb(response);
    }
  );
}

function getSearchParam(domainId, model, name) {
  let param = {};
  if (domainId) {
    Object.assign(param, { domainId: domainId });
  }
  if (model) {
    Object.assign(param, { extendType: model });
  }
  if (name) {
    Object.assign(param, { name: { like: `%${name}%` } });
  }

  return param;
}

export function getAssetsCount(cb) {
  let headers = getHttpHeader();
  httpRequest(
    HOST_IP + '/assets/count',
    {
      headers: headers,
      method: 'GET'
    },
    response => {
      cb && cb(response);
    }
  );
}

/**
 *
 * @param model(资产模型类型)
 */
export function getAssetsByModel(model, cb) {
  let models = model == 'ssads' || model == 'sses' ? model : `${model}s`;
  let headers = getHttpHeader();
  httpRequest(
    HOST_IP + '/' + models,
    {
      headers: headers,
      method: 'GET'
    },
    response => {
      cb && cb(response);
    }
  );
}

export function getAssetsBaseByModel(model, cb) {
  let headers = getHttpHeader();

  let paramStr = JSON.stringify({ where: getSearchParam('', model, '') });

  httpRequest(
    HOST_IP + '/assets?filter=' + encodeURIComponent(paramStr),
    {
      headers: headers,
      method: 'GET'
    },
    response => {
      cb && cb(response);
    }
  );
}

export function getAssetsBaseById(id, cb) {
  let headers = getHttpHeader();
  httpRequest(
    HOST_IP + '/assets/' + id,
    {
      headers: headers,
      method: 'GET'
    },
    response => {
      cb && cb(response);
    },
    null,
    err => {
      cb && cb({});
    }
  );
}
/**
 * 通过设备种类和域获取设备基本属性
 * @param model
 * @param name
 * @param cb
 */
export function getAssetsBaseByModelWithDomain(model, domainId, cb) {
  let headers = getHttpHeader();

  let paramStr = JSON.stringify({ where: getSearchParam(domainId, model, '') });

  httpRequest(
    HOST_IP + '/assets?filter=' + encodeURIComponent(paramStr),
    {
      headers: headers,
      method: 'GET'
    },
    response => {
      cb && cb(response);
    }
  );
}

export function getAssetsBaseByDomain(domainId, cb) {
  let headers = getHttpHeader();
  httpRequest(
    HOST_IP +
      '/assets?filter=' +
      encodeURIComponent(JSON.stringify({ where: { domainId: domainId } })),
    {
      headers: headers,
      method: 'GET'
    },
    response => {
      cb && cb(response);
    }
  );
}
/**
 *
 * @param model(资产模型类型)
 */
export function getAssetsCountByModel(model, cb) {
  let headers = getHttpHeader();
  httpRequest(
    HOST_IP + '/' + model + 's/count',
    {
      headers: headers,
      method: 'GET'
    },
    response => {
      cb && cb(response);
    }
  );
}

/**
 * 通过设备种类和名称获取设备基本属性
 * @param model
 * @param name
 * @param cb
 */
export function getAssetsBaseByModelWithName(model, name, cb) {
  let headers = getHttpHeader();
  let paramStr = JSON.stringify({ where: getSearchParam('', model, name) });
  httpRequest(
    HOST_IP + '/assets?filter=' + encodeURIComponent(paramStr),
    {
      headers: headers,
      method: 'GET'
    },
    response => {
      cb && cb(response);
    }
  );
}
/**
 * param data({modelId:设备型号})
 *
 */
export function postAssetsByModel(model, data, cb) {
  let headers = getHttpHeader();
  let models = model == 'ssads' || model == 'sses' ? model : `${model}s`;
  let dat = {
    id: data.id,
    type: data.model,
    base: {
      name: data.name,
      geoPoint: { lat: data.lat, lng: data.lng },
      extendType: model,
      domainId: data.domainId
    }
  };
  httpRequest(
    HOST_IP + '/' + models,
    {
      headers: headers,
      method: 'POST',
      body: JSON.stringify(dat)
    },
    response => {
      cb && cb(response);
    }
  );
}

/**
 * param data({modelId:设备型号})
 *
 */
export function postXes(model, data, cb) {
  let headers = getHttpHeader();
  let dat = {
    id: data.id,
    type: data.model,
    base: {
      name: data.name,
      geoPoint: { lat: data.lat, lng: data.lng },
      extendType: model,
      domainId: data.domainId
    }
  };
  httpRequest(
    HOST_IP + '/xes',
    {
      headers: headers,
      method: 'POST',
      body: JSON.stringify(dat)
    },
    response => {
      cb && cb(response);
    }
  );
}

/**
 * param data({modelId:设备型号})
 *
 */
export function updateAssetsByModel(model, data, cb) {
  let headers = getHttpHeader();
  let models = model == 'ssads' || model == 'sses' ? model : `${model}s`;
  let dat = { type: data.model };
  httpRequest(
    HOST_IP + '/' + models + '/' + data.id,
    {
      headers: headers,
      method: 'PATCH',
      body: JSON.stringify(dat)
    },
    response => {
      updateAssetsById(
        response.id,
        {
          name: data.name,
          geoPoint: { lat: data.lat, lng: data.lng },
          extendType: model,
          domainId: data.domainId
        },
        cb
      );
    }
  );
}

export function updateXes(model, data, cb) {
  let headers = getHttpHeader();
  let dat = {
    geoType: 0,
    name: data.name,
    geoPoint: {
      lat: data.lat,
      lng: data.lng
    },
    extendType: model,
    domainId: data.domainId
  };
  httpRequest(
    HOST_IP + '/assets/' + data.id,
    {
      headers: headers,
      method: 'PATCH',
      body: JSON.stringify(dat)
    },
    response => {
      cb && cb(response);
    }
  );
}

export function delAssetsByModel(model, id, cb) {
  let headers = getHttpHeader();
  let models = model == 'ssads' || model == 'sses' ? model : `${model}s`;
  httpRequest(
    HOST_IP + '/' + models + '/' + id,
    {
      headers: headers,
      method: 'DELETE'
    },
    response => {
      cb && cb(response);
    }
  );
}

export function delXes(model, id, cb) {
  let headers = getHttpHeader();
  httpRequest(
    HOST_IP + '/xes/' + id,
    {
      headers: headers,
      method: 'DELETE'
    },
    response => {
      cb && cb(response);
    }
  );
}

export function updateAssetsById(id, data, cb) {
  let headers = getHttpHeader();
  let dat = Object.assign({}, { geoType: 0 }, data);
  httpRequest(
    HOST_IP + '/assets/' + id,
    {
      headers: headers,
      method: 'PATCH',
      body: JSON.stringify(dat)
    },
    response => {
      cb && cb(response);
    }
  );
}

export function updateDataOrigin(data, key) {}

export function getAssetsByDomainLevelWithCenter(
  domainLevel,
  map,
  model,
  timestamp,
  cb
) {
  let headers = getHttpHeader();
  let nearParam = { maxDistance: map.distance / 1000, unit: 'kilometers' };

  if (domainLevel == 1) {
    nearParam = {};
  }

  let param = { geoPoint: Object.assign({}, { near: map.center }, nearParam) };
  if (model) {
    param = Object.assign({}, param, { extendType: model });
  }

  httpRequest(
    HOST_IP +
      '/assets?filter=' +
      encodeURIComponent(JSON.stringify({ where: param })),
    {
      headers: headers,
      method: 'GET'
    },
    (response, res, param) => {
      cb && cb(response, param);
    },
    timestamp
  );
}

export function getSearchAssetsByDomainWithCenter(domain, map, model, name, offset, limit, cb) {
  const headers = getHttpHeader();
  let nearParam = { maxDistance: map.distance / 1000, unit: 'kilometers' };
  if (domain.level == 1) {
    nearParam = {};
  }

  const param = {
    geoPoint: Object.assign({}, { near: map.center }, nearParam)
  };
  let paramStr = JSON.stringify({
    include: ['extend'],
    where: Object.assign({}, param, getSearchParam(domain.id, model, name)),
    offset: offset,
    limit: limit
  });
  httpRequest(
    HOST_IP + '/assets?filter=' + encodeURIComponent(paramStr),
    {
      headers: headers,
      method: 'GET'
    },
    response => {
      cb && cb(response);
    }
  );
}

export function getSearchAssetCountByDomainWithCenter(domain, map, model, name, cb) {
  const headers = getHttpHeader();
  let nearParam = { maxDistance: map.distance / 1000, unit: 'kilometers' };
  if (domain.level == 1) {
    nearParam = {};
  }

  const param = {
    geoPoint: Object.assign({}, { near: map.center }, nearParam)
  };
  let paramStr = JSON.stringify({
    where: Object.assign({}, param, getSearchParam(domain.id, model, name))
  });
  httpRequest(
    HOST_IP + '/assets?filter=' + encodeURIComponent(paramStr),
    {
      headers: headers,
      method: 'GET'
    },
    response => {
      cb && cb({count:response?response.length:0});
    }
  );
}

//获取故障、告警列表
export function getFaultOrAlertList(model, domainId, level, start, end, offset, limit, cb) {
  const _querystring = JSON.stringify({
    where: {
      domain_id: domainId,
      level,
      update_time: {
        between: [start, end]
      }
    },
    offset,
    limit
  });
  const querystring = `/${model}?filter=${_querystring}`;
  httpRequest(
    HOST_IP + querystring,
    {
      headers: getHttpHeader(),
      method: 'GET'
    },
    response => {
      cb && cb(response);
    }
  );
}
/**
 * 获取设备的状态
 * @param {String} model
 * @param {String | Number} id
 */
export const getDeviceStatusByModelAndId = (model, id) => cb => {
  // if(model == 'xes') model = 'xe';
  let models = model == 'ssads' || model == 'sses' ? model : `${model}s`;
  httpRequest(
    `${HOST_IP}/${models}/${id}/status`,
    {
      headers: getHttpHeader(),
      method: 'GET'
    },
    response => {
      cb && cb(response);
    }
  );
};
export const getDeviceStatusById = (model,id,domainId, cb) => {
  let params=JSON.stringify({
    where:{
      model,
      domain_id:domainId
    }
  })
  httpRequest(
    `${HOST_IP}/statuses/${id}?filter=`+encodeURIComponent(params),
    {
      headers: getHttpHeader(),
      method: 'GET'
    },
    response => {
      cb && cb(response);
    }
  );
};
/**
 * 设备操作
 * @param {number | string } id
 * @param {object} data
 * @param {function} cb
 */
export const updateAssetsRpcById = (id,urlString, data, cb) => {
  httpRequest(
    `${HOST_IP}/assets/${id}/action/${urlString}`,
    {
      headers: getHttpHeader(),
      method: 'POST',
      body: JSON.stringify(data)
    },
    response => {
      cb && cb(response);
    }
  );
};

export const checkTimeRpcById=(id,urlString,data,cb)=>{
  httpRequest(
    `${HOST_IP}/assets/${id}/set/${urlString}`,
    {
      headers: getHttpHeader(),
      method: 'POST',
      body: JSON.stringify(data)
    },
    response => {
      cb && cb(response);
    }
  );
}
/**
 * 删除设备型号
 * @param {number | string } id
 * @param {function} cb
 */
// export const deleteModalTypesById = (id, cb) => {
//   // httpRequest(`${HOST_IP}/`, {
//   //   headers: getHttpHeader(),
//   //   method: 'DELETE',
//   // }, response => {
//   //   cb && cb();
//   // });
//   cb && cb();
// };

/**
 * 添加设备型号
 * @param {number | string } id
 * @param {function} cb
 */
export const addModalTypesById = (id, data, cb) => {
  // httpRequest(`${HOST_IP}/`, {
  //   headers: getHttpHeader(),
  //   method: 'POST',
  //   body: JSON.stringify(data),
  // }, response => {
  //   cb && cb(response);
  // });
  cb && cb();
};
