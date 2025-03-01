import _ from 'lodash';
import { Pagination } from '../types/pagination';

export const pick = _.pick;

interface IResults<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  page?: number | undefined;
  totalPages: number;
  offset: number;
  prevPage?: number | null | undefined;
  nextPage?: number | null | undefined;
  pagingCounter: number;
  meta?: any;
  [customLabel: string]: T[] | number | boolean | null | undefined;
}

export const formatListResponse = <T>(results: IResults<T>) => {
  const { docs: data, ...paginationOption } = results;
  const pagination: Pagination = pick(paginationOption, [
    'totalDocs',
    'limit',
    'hasPrevPage',
    'hasNextPage',
    'page',
    'totalPages',
    'offset',
    'prevPage',
    'nextPage',
    'pagingCounter',
  ]);

  return {
    data,
    pagination,
  };
};

type QueryData = {
  page?: string | number;
  limit?: string | number;
  [key: string]: any;
};

export const trimQuery = (queryData: QueryData): QueryData => {
  let { page, limit } = queryData;

  const pageNumber = parseInt(String(page));
  const pageSize = parseInt(String(limit));

  page = !pageNumber || pageNumber < 1 ? 1 : pageNumber;
  limit = !pageSize || pageSize < 1 || pageSize > 30 ? 10 : pageSize;

  const isObject = (object: any): boolean => object !== null && typeof object === 'object';

  function deepTrim(obj: any): any {
    const keys = Object.keys(obj);
    for (let key of keys) {
      if (isObject(obj[key])) {
        deepTrim(obj[key]);
      } else {
        obj[key] = obj[key] === 'null' ? null : obj[key];
        obj[key] = obj[key] === 'undefined' ? undefined : obj[key];
      }
    }
    return obj;
  }

  if (queryData.page && queryData.limit) {
    return { ...deepTrim(queryData), page, limit };
  }

  return { ...deepTrim(queryData) };
};
