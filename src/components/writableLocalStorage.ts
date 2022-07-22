import { writable } from 'svelte/store';

class fakeStorage {
  private data:any;
  constructor(){ 
    console.log("er, using fakeStorage");
    this.data = {};
  }
  getItem(key:string) { return this.data[key]; }
  setItem(key:string, value:any){ this.data[key] = value; }
}

const storage = window.localStorage;

function getItem(key:string){
  return storage.getItem(key);
}

function setItem(key:string, value:string) {
  storage.setItem(key, value);
}

function getJSONItem(key:string) {
  let item = getItem(key);
  if (typeof(item) == "string" ) {
    try { 
      item = JSON.parse(item);
    } catch { 
      console.log(`Unable to parse localStorage value (key: ${key}) ${item}`);
    }
  }
  return item;
}

function setJSONItem(key:string, value:any) {
  storage.setItem(key, JSON.stringify(value));
}

// cribbed from https://github.com/sveltejs/svelte/issues/3053#issuecomment-507877499
function localStorageWritable(key:string) {
  let initialValue = getItem(key);
  const { subscribe, set } = writable(initialValue);
  return {
    subscribe: subscribe,
    set: (value:any) => {
      setItem(key, value);
      return set(value);
    }
  }
}

function localStorageWritableJSON(key:string) {
  let initialValue:any = getJSONItem(key);
  const { subscribe, set } = writable(initialValue);
  return {
    subscribe: subscribe,
    set: (value:any) => {
      setJSONItem(key, value);
      return set(value);
    }
  }
}

export { 
  localStorageWritable,
  localStorageWritableJSON
}

/*

let myStore = writable(value);
let myStore = writableLocalStorage(key, "Number");
myStore.set(1234); // should this do type checking?

*/