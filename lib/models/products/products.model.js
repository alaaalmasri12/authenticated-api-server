const Model = require('../mongo');
const schema = require('../products/products.schema');

class Product extends Model {
  constructor() {
    super(schema);
  }
}

module.exports = new Product();