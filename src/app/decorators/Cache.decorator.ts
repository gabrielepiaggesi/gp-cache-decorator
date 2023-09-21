import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface CacheOptions {
  // we may add additional parameters here
  duration?: number;
  cacheKey?: string;
}

function computeOriginalArguments(
  originalFunc: Function
): null | (string | number)[] {
  const stringified: string = originalFunc.toString();
      const startBracket = stringified.indexOf('(');
  if (startBracket < 0) {
    return null;
  }
  const endBracket = stringified.indexOf(')', startBracket);
  if (endBracket < 0) {
    return null;
  }
  const paramsString = stringified.substring(startBracket + 1, endBracket);
  if (paramsString.length === 0) {
    return [];
  }
  let params = paramsString.split(',').map((e) => e.trim());
  let newParams: any = [];
  params.forEach((p: any) => {
    const equalIdx = p.indexOf('=');
    if (equalIdx == -1) {
      p = p.trim();
    } else {
      p = p.substring(0, equalIdx > 1 ? equalIdx - 1 : p.length);
      p = !isNaN(p as any) ? +p : p;
    }
    newParams.push(p);
  });
  return newParams;
}

export function Cache(params: CacheOptions = {}) {
  const defaultValues: Partial<CacheOptions> = {
    duration: 10000, // 10 sec
    cacheKey: 'withCache'
  };

  const newParams = {
    ...defaultValues,
    ...params,
  };
  newParams.cacheKey = newParams.cacheKey || 'withCache';

  let originalFunc: Function;

  let result: Promise<any> | Observable<any> | any;
  let value: any;
  let funcType: string;
  let cacheUntil: Date;

  let inProgress = false;

  const cacheValue = (val: any, now: any) => {
    // console.log('caching', funcType);
    cacheUntil = new Date(now.getTime() + newParams.duration);
    value = val;
  };

  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    originalFunc = descriptor.value;
    const funcParams = computeOriginalArguments(originalFunc);
    descriptor.value = function (...args: any[]) {
      
      let fromCache = true;
      if (funcParams) {
        const withCacheIdx = funcParams.indexOf(newParams.cacheKey || 'withCache');
        if (withCacheIdx >= 0 && args.length >= withCacheIdx) {
            fromCache = !!args[withCacheIdx];
        }
      }

      const now = new Date();
      fromCache = fromCache && value && cacheUntil && cacheUntil > now;

      if (fromCache) {
        console.debug(originalFunc.name + ' withCache', !!fromCache);
        // console.log('from cache');
        switch (funcType) {
          case 'observable':
            return of(value);
          case 'promise':
            return Promise.resolve(value);
          default:
            return value;
        }
      } else {
        console.debug(originalFunc.name + ' withCache', !!fromCache);
      }

      if (inProgress) {
        return result;
      }
      inProgress = true;
      result = originalFunc.apply(this, args);

      if (result instanceof Observable) {
        funcType = 'observable';
        return result.pipe(
          tap((val) => {
            cacheValue(val, now);
            inProgress = false;
          })
        );
      } else if (result instanceof Promise) {
        funcType = 'promise';
        return result.then((value) => {
          cacheValue(value, now);
          inProgress = false;
          return value;
        });
      } else {
        funcType = 'value';
        cacheValue(result, now);
        inProgress = false;
        return result;
      }
    };
  };
}
