import request from '../../utils/request';
import { _local } from '../../api/local';


export function goodsDetail(options) {
  return request(`${_local}/a/roomlocadjust/detail`, {
    method: 'GET',
    type: 'formData',
    body: options
  })
};

export function drugInformation(options) {
  return request(`${_local}/a/roomlocadjust/drugInformation`, {
    method: 'POST',
    type: 'json',
    body: options
  })
};

export function confirmAdjust(options) {
  return request(`${_local}/a/roomlocadjust/confirmAdjust`, {
    method: 'POST',
    type: 'json',
    body: options
  })
};