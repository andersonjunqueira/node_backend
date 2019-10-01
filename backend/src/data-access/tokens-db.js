export default function makeTokensDb({ makeDb }) {

  return Object.freeze({
    findByAccessToken,
    insert,
    remove
  })

  async function findByAccessToken(accessToken) {
    const db = await makeDb()
    const result = await db.collection('tokens')
      .find({ accessToken })
    const found = await result.toArray()
    if (found.length === 0) {
      return null
    }
    const { _id: id, ...info } = found[0]
    return { id, ...info }
  }

  async function insert({ id: _id, ...tokenInfo }) {
    const db = await makeDb()
    const result = await db.collection('tokens')
      .insertOne({ _id, ...tokenInfo })
    const { _id: id, ...insertedInfo } = result.ops[0]
    return { id, ...insertedInfo }
  }

  async function remove({ id: _id }) {
    const db = await makeDb()
    const result = await db.collection('tokens').deleteOne({ _id })
    return result.deletedCount
  }

}
