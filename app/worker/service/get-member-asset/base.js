class GetMemberAsset {
  constructor() {
  }
  async get(address) {
    throw new Error(`You have to implement get function in child class`)
  }
}
module.exports = GetMemberAsset;
