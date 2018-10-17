import request from '../utils/request';

export function init(options) {
  return request(`/api/app`, options);
}

