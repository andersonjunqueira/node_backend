const notFound = () => {
  return {
    headers: {
      'Content-Type': 'application/json'
    },
    body: { error: 'Not found.' },
    statusCode: 404
  }
}
export default notFound