module.exports = ({ makeDb }) => {

  const findByAccessToken = async (accessToken) => {
    const db = await makeDb();
    const result = await db.collection('tokens')
      .find({ accessToken });
    const found = await result.toArray();
    if (found.length === 0) {
      return null;
    }
    const { _id: id, ...info } = found[0];
    return { id, ...info };
  };

  const insert = async ({ id: _id, ...tokenInfo }) => {
    const db = await makeDb();
    const result = await db.collection('tokens')
      .insertOne({ _id, ...tokenInfo });
    const { _id: id, ...insertedInfo } = result.ops[0];
    return { id, ...insertedInfo };
  };

  const remove = async ({ id: _id }) => {
    const db = await makeDb();
    const result = await db.collection('tokens').deleteOne({ _id });
    return result.deletedCount;
  };

  return Object.freeze({
    findByAccessToken,
    insert,
    remove
  })
};