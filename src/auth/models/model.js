'use strict';
class Model {

  constructor(schema) {
    this.schema = schema;
  }

  read(_id) {
    console.log(_id);
    let queryObject = _id !== undefined ? { username: _id } : {};
    // .find(queryObject) : {_id: _id}, {}
    return this.schema.find(queryObject);
  }


  create(record) {
    let newRecord = new this.schema(record);
    return newRecord.save();
  }

  update(_id, record) {
    return this.schema.findByIdAndUpdate(_id, record, { new: true });
  }

  delete(_id) {
    // return promise
    return this.schema.findByIdAndDelete(_id);
  }

}


module.exports = Model;