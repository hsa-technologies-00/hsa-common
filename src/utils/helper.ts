import _ from 'lodash';
import { PaginateResult, AggregatePaginateResult } from 'mongoose';
import __ from 'mongoose-paginate-v2';
import ___ from 'mongoose-aggregate-paginate-v2';
import { Pagination } from '../types/pagination';

export const pick = _.pick;

export const formatListResponse = <T>(results: PaginateResult<T> | AggregatePaginateResult<T>) => {
  const { docs: data, ...paginationOption } = results;
  const pagination: Pagination = pick(paginationOption, [
    'totalDocs',
    'limit',
    'hasPrevPage',
    'hasNextPage',
    'page',
    'totalPages',
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
  if (!pageSize) limit = 30;
  if (pageSize < 1) limit = 1;
  if (pageSize > 100) limit = 100;

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
    return { ...deepTrim(queryData), page: parseInt(String(page)), limit: parseInt(String(limit)) };
  }

  return { ...deepTrim(queryData) };
};
