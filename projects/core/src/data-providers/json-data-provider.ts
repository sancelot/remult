import { Entity } from '../entity';
import { EntityDataProvider, EntityDataProviderFindOptions, DataProvider } from '../data-interfaces';
import { Filter } from '../filter/filter-interfaces';
import { ArrayEntityDataProvider } from './array-entity-data-provider';

export interface JsonEntityStorage {
  getItem(entityDbName: string): string;
  setItem(entityDbName: string, json: string);

}

export class JsonDataProvider implements DataProvider {
  constructor(private storage: JsonEntityStorage) {

  }
  getEntityDataProvider(entity: Entity): EntityDataProvider {
    return new JsonEntityDataProvider(entity, this.storage);
  }
  async transaction(action: (dataProvider: DataProvider) => Promise<void>): Promise<void> {
    await action(this);
  }
}

class JsonEntityDataProvider implements EntityDataProvider {

  constructor(private entity: Entity, private helper: JsonEntityStorage) {

  }
  async loadEntityData(what: (dp: EntityDataProvider, save: () => void) => any): Promise<any> {
    let data = [];
    let s = this.helper.getItem(this.entity.defs.dbName);
    if (s)
      data = JSON.parse(s);
    let dp = new ArrayEntityDataProvider(this.entity, data);
    return what(dp, () => this.helper.setItem(this.entity.defs.dbName, JSON.stringify(data, undefined, 2)));
  }
  p: Promise<any> = Promise.resolve();
  find(options?: EntityDataProviderFindOptions): Promise<any[]> {
    return this.p = this.p.then(() => this.loadEntityData((dp, save) => dp.find(options)));
  }
  count(where?: Filter): Promise<number> {
    return this.p = this.p.then(() => this.loadEntityData((dp, save) => dp.count(where)));
  }


  update(id: any, data: any): Promise<any> {
    return this.p = this.p.then(() => this.loadEntityData((dp, save) => dp.update(id, data).then(x => {
      save();
      return x;
    })));

  }
  delete(id: any): Promise<void> {
    return this.p = this.p.then(() => this.loadEntityData((dp, save) => dp.delete(id).then(x => {
      save();
      return x;
    })));
  }
  insert(data: any): Promise<any> {
    return this.p = this.p.then(() => this.loadEntityData((dp, save) => dp.insert(data).then(x => {
      save();
      return x;
    })));
  }

}
