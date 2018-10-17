import request from '../../utils/request';

export function saveDeploy(options) {
  return request(`/deploy/saveDeploy`, {//添加或编辑部署
    method: 'POST',
    type: 'formData',
    body: options
  });
}

export function findDeployOrgList(options) {
  return request(`/deploy/findDeployOrgList`, {//查询部署机构(已部署/未部署)
    method: 'POST',
    type: 'formData',
    body: options
  });
}
/* 
  右侧列表搜索  要删除
*/
export function finRightOrgList(options) {
  return request(`/deploy/finRightOrgList`, {
    method: 'POST',
    type: 'formData',
    body: options
  });
}

export function deployModifyOrg(options) {
  return request(`/deploy/deployModifyOrg`, {//部署编辑机构
    method: 'POST',
    type: 'formData',
    body: options
  });
}

export function findOrgs(options) {
  return request(`/orgInfoController/findOrgs`, {//查询所有机构下拉列表
    method: 'POST',
    type: 'formData',
    body: options
  });
}

export function searchDeployList(options) {
  return request(`/deploy/searchDeployList`, {//部署列表查询
    method: 'POST',
    type: 'formData',
    body: options
  });
}