import request from '../../utils/request';
import { _local } from '../../api/local';


export function repertoryDetail(options) {
  return request(`${_local}/a/StoreDetail/getRoomRepertoryDetail`, {
    method: 'POST',
    type: 'formData',
    body: options
  })
};

//打印
export function stockInquiryExport(options) {
  return request(`${_local}/a/statics/storeSelect/export`, {
    method: 'POST',
    type: 'json',
    body: options,
    export: true
  })
}