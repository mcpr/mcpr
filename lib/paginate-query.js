const paginateQuery = (Model, pagination, conditions) => {
  // pagination
  const perPage = pagination.perPage
    ? Math.max(0, parseFloat(pagination.perPage))
    : 50
  const page = pagination.page ? Math.max(0, parseFloat(pagination.page)) : 0
  const start = perPage * page

  // sorting
  const sortDirection = pagination.sortDirection || 'desc'
  const orderBy = pagination.orderBy || 'created_at'
  const sort = {
    [orderBy]: sortDirection
  }

  // query
  const query = Model.find(conditions)
    .sort(sort)
    .skip(start)
    .limit(perPage)

  return query
}

module.exports = { paginateQuery }
