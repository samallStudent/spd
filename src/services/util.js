import request from '../utils/request';

export const fileRemove = filename => request('/api/remove', {
  body: { name: filename }
})