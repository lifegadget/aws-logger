import * as _ from 'lodash';

export function without (dict: IDictionary<any>, ...without: string[]) {
  const narrow = _.assign({}, dict);
  without.map((i: string) => delete narrow[i]);
  return narrow;
}

export function onlyWith (dict: IDictionary<any>, ...toInclude: string[]) {
  const without = Object.keys(dict).filter(key => toInclude.filter(f => f === key).length === 0);
  
  return this.without(dict, ...without);
}

export function parseProperty(dict: IDictionary<any>, ...parse: string[]) {
  const copy = _.assign({}, dict);
  parse.map(key => {
    copy[key] = JSON.parse(copy[key]);
  });
  return copy;
}