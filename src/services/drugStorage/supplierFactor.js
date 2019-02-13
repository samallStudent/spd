/*
 * @Author: wwb 
 * @Date: 2018-08-31 21:28:10 
 * @Last Modified by: wwb
 * @Last Modified time: 2018-09-06 19:08:43
 */

import request from '../../utils/request';
import { _local } from '../../api/local';

//上传企业资质保存
export function saveSupplierFactor(options) {
    return request(`${_local}/lic/depotlicinfo/saveLic`, {
        method: 'POST',
        type: 'json',
        body: options
    })
}

//上传企业资质删除
export function deleteSupplierFactor(options) {
    return request(`${_local}/lic/depotlicinfo/batchDelete`, {
        method: 'POST',
        type: 'json',
        body: options
    })
}

//上传药品资质保存
export function saveDrugFactor(options) {
    return request(`${_local}/lic/depotdruglicinfo/saveLic`, {
        method: 'POST',
        type: 'json',
        body: options
    })
}

//上传药品资质删除
export function deleteDrugFactor(options) {
    return request(`${_local}/lic/depotdruglicinfo/batchDelete`, {
        method: 'POST',
        type: 'json',
        body: options
    })
}