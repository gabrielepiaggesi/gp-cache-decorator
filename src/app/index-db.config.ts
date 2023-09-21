import { DBConfig } from 'ngx-indexed-db';

export const dbConfig: DBConfig = {
  name: 'InsooreDb',
  version: 1,
  objectStoresMeta: [
    {
      store: 'cache',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'key', keypath: 'key', options: { unique: true } },
        { name: 'created_at', keypath: 'created_at', options: { unique: false } },
      ],
    },
    {
      store: 'companies',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'name', keypath: 'name', options: { unique: false } },
      ],
    },
    {
      store: 'values',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        {
          name: 'company_id',
          keypath: 'company_id',
          options: { unique: false },
        },
        { name: 'value', keypath: 'value', options: { unique: false } },
      ],
    },
  ],
};
