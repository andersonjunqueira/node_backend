export default function makeTokensDb({ makeDb, Id }) {

  return Object.freeze({
    findByAccessToken,
    insert
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

  async function insert({ id: _id = Id.makeId(), ...tokenInfo }) {
    const db = await makeDb()
    const result = await db.collection('tokens')
      .insertOne({ _id, ...tokenInfo })
    const { _id: id, ...insertedInfo } = result.ops[0]
    return { id, ...insertedInfo }
  }

}
