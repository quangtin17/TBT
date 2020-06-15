import { Injectable, Inject } from '@angular/core';
import { LOCAL_STORAGE } from '@ng-toolkit/universal';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  constructor(@Inject(LOCAL_STORAGE) private localStorage: any) {}

  getList(listName: string) {
    return this.localStorage.getItem(listName);
  }

  updateList(listName: string, data: any) {
    this.localStorage.setItem(listName, JSON.stringify(data));
  }

  getItemFromListByAlias(listName: string, inputAlias: string) {
    const list = this.localStorage.getItem(listName);
    let listJSON = [];
    if (!!list) {
      listJSON = JSON.parse(list);
    }
    console.log('[getItemFromListByAlias] listJSON: ', listJSON);

    let rs = listJSON.find(el => {
      if (el.alias === inputAlias) {
        return el;
      }
    });
    console.log('[getItemFromListByAlias] rs: ', rs);

    return rs;
  }

  addItemToListByAlias(listName: string, inputAlias: string, inputData: any) {
    const list = this.localStorage.getItem(listName);
    let listJSON = [];
    if (!!list) {
      listJSON = JSON.parse(list);
    }
    console.log('[addItemToListByAlias] listJSON: ', listJSON);
    const index = listJSON
      .map(el => {
        return el.alias;
      })
      .indexOf(inputAlias);

    // Found -> Update
    if (index >= 0) {
      console.log('[addItemToListByAlias] Found -> Update !');
      listJSON[index].data = inputData;
    } else {
      // Not Found -> Add New
      console.log('[addItemToListByAlias] Not Found -> Add New !');

      listJSON.push({
        alias: inputAlias,
        data: inputData
      });
    }

    // Update
    this.localStorage.setItem(listName, JSON.stringify(listJSON));
    console.log(
      `[addItemToListByAlias] Updated [${listName}] with [${inputAlias}].`
    );
  }

  removeItemToListByAlias(
    listName: string,
    inputAlias: string,
    inputData: any
  ) {
    const list = this.localStorage.getItem(listName);
    let listJSON = [];
    if (!!list) {
      listJSON = JSON.parse(list);
    }
    console.log('[removeItemToListByAlias] listJSON: ', listJSON);
    const index = listJSON
      .map(el => {
        return el.alias;
      })
      .indexOf(inputAlias);

    // Found -> Delete
    if (index >= 0) {
      console.log('[removeItemToListByAlias] Found -> Delete !');
      listJSON.splice(index, 1);
    }

    // Update
    this.localStorage.setItem(listName, JSON.stringify(listJSON));
    console.log(
      `[removeItemToListByAlias] Deleted [${listName}] with [${inputAlias}].`
    );
  }
}
