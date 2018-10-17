import querystring from 'querystring';
import {_local} from '../api/local';
import {message} from 'antd';
export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach((node) => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

export function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

/**
 * @desc get static data
 * @param { string } type 
 * @param { function } callback 
 * @author vania
 * @returns data
 */
export const CommonData = (type, cb, params={}, url) => {
  if(localStorage.getItem(type)) {
    cb(JSON.parse(localStorage.getItem(type)));
  } else {
    fetch(url || `${_local}/staticData/commonData?type=` + type, {
      credentials: 'include',
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: querystring.stringify(params)
    })
    .then((res) => res.json())
    .then((json) => {
      cb(json.result)
      localStorage.setItem(type, JSON.stringify(json.result));
    })
    .catch((err) => cb(err))
  }
}
/**
 * json obj 比较
 * @param {*} obj1 
 * @param {*} obj2 
 * @param {*} except 不比较项
 */
export const objCompare = (obj1, obj2) => {
  if (typeof obj1 !== 'object' || obj1 === null) {
    return false;
  }
  if (typeof obj2 !== 'object' || obj2 === null) {
    return false;
  }
  // get all key
  var aProps = Object.getOwnPropertyNames(obj1);  
  var bProps = Object.getOwnPropertyNames(obj2);
  if (aProps.length !== bProps.length) {  
    return false;  
  }  
  for (let i = 0; i < aProps.length; i++) {  
    let propName = aProps[i];  
    if ((obj1[propName] !== obj2[propName])) {  
      return false;  
    }  
  }  
  return true;
}

export const getMenuData  = (key, menuList) => {
  try {
    return menuList.filter(item => item.path === `/${key}`)[0].subMenus
  } catch (error) {
    return [];
  }
}


export const menuFormat = (menuData,returnToggle,returnIndex) => {
    let menuIndex = returnIndex ? 1: 2;
    let menuList = returnIndex ? JSON.parse(JSON.stringify( menuData )) : menuData;
    
    for (let i=0; i<menuList.length; i++) {
      menuList[i].parentIds = menuList[i].parentIds.split(',')
      menuList[i].parentIds.pop();
      if(!menuList[i].children){
        delete menuList[i].children
      }
    }
    // let index = 1, tree = [], currentNode = '';
    let tree = [];
    menuList.sort(function(a, b) {
      return a.parentIds.length - b.parentIds.length;
    })
    let max = menuList[menuList.length - 1].parentIds.length;
    function genRoot(keyNodes, target) {
      for (let i=0; i<target.length; i++) {
        if (target[i].id === keyNodes.parentId) {
          target[i].children = target[i].children || [];
          target[i].children = [ ...target[i].children, keyNodes ];
        } else if (target[i].children){
          genRoot(keyNodes, target[i].children)
        }
      }
    }
    function genTree(index) {
      for (let i=0; i<menuList.length; i++) {
        if (menuList[i].parentIds.length === index) {
          if (index === menuIndex) {
            tree.push(menuList[i])
          } else {
            genRoot(menuList[i], tree);
          }
        }
      }
    }
    // 排序
    function dabendan(tree) {
      tree.sort((a, b)=>a.sort - b.sort);
      for (var i in tree) {
        if(tree[i].children) {
          dabendan(tree[i].children)
        }
      }
    }
    let min = 1;
    while (min < max + 1) {
      genTree(min);
      min++;
    }
    // console.log(JSON.stringify(tree),'tree');
    if(returnToggle){
      dabendan(tree);
      return tree
    }
}

export const validAmount = (value) => {
  let num = Number(value);
  if (/^\d+$/.test(num) && num !== 0) {
    return true;
  }else {
    message.error('请输入非0正整数！');
    return false;
  }
}