module.exports = ({ makeDb }) => {

  const findById = async ({ id: _id }) => {
    const db = await makeDb();
    const result = await db.collection('users').find({ _id });
    const found = await result.toArray();
    if (found.length === 0) {
      return null;
    }
    const { _id: id, ...info } = found[0];
    return { id, ...info };
  }

  const findByEmail = async ({ email }) => {
    const db = await makeDb();
    const result = await db.collection('users').find({ email });
    const found = await result.toArray();
    if (found.length === 0) {
      return null;
    }

    const { _id: id, ...info } = found[0];
    return { id, ...info };
  }

  const findAll = async () => {
    const db = await makeDb();
    const result = await db.collection('users').find({ });
    const found = await result.toArray();
    return found;
  }

  const insert = async ({ id: _id, ...userInfo }) => {
    const db = await makeDb();
    const result = await db
      .collection('users')
      .insertOne({ _id, ...userInfo });
    const { _id: id, ...insertedInfo } = result.ops[0];
    return { id, ...insertedInfo };
  }

  const update = async ({ id: _id, ...userInfo }) => {
    const db = await makeDb();
    const result = await db
      .collection('users')
      .updateOne({ _id }, { $set: { ...userInfo } });
    return result.modifiedCount > 0 ? { id: _id, ...userInfo } : null;
  }

  return Object.freeze({
    findById,
    findByEmail,
    findAll,
    insert,
    update
  })
};