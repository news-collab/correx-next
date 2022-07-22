export default class SelectableRow {
  //item:any;
  //fields: string[];

  constructor(item, fields = []) {
    this.item = item;
    this.fields = fields;
  }

  dump() {
    const row = {};
    this.fields.forEach(field => row[field] = this.item[field]);
  }
}