
class Fiat {
  constructor() {
  }

  async getTransaction(options) {
    throw new Error(`You have to implement getTransaction function in child class`);
  }

  async getOrder(options) {
    throw new Error(`You have to implement getOrder function in child class`);
  }

}

module.exports = Fiat;