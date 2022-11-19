const redisClient = require('../redis/redisClient')

function buildJsonQueryString(field) {
  const keys = Object.keys(field)
  let first_value
  if (typeof field[keys[0]] == 'number') {
    first_value = `${field[keys[0]]}`
  } else {
    first_value = `\"${field[keys[0]]}\"`
  }
  let query_string = `@.${keys[0]}==${first_value}`
  for (let i = 1; i < keys.length; i++) {
    let value
    if (typeof field[keys[i]] == 'number') {
      value = `${field[keys[i]]}`
    } else {
      value = `\"${field[keys[i]]}\"`
    }
    query_string += `&& @.${keys[i]}==${value}`
  }
  return `$[?(${query_string})]`
}

function buildJsonPaginateString(skip, limit) {
  return `[${skip}:${skip + limit + 1}]`
}

class RedisSearchQuery {
  constructor(query, index) {
    this.query = query
    this.index = index
    this.redisQuery = ''
    this.options = []
  }
  filter() {
    const excludeFields = ['sort', 'limit', 'offset']
    const comparisonMatchings = { lte: '-inf ', gte: ' +inf' }
    if (Object.keys(this.query).length === 0) {
      this.redisQuery = '*'
      return this
    }
    for (const [key, value] of Object.entries(this.query)) {
      if (!excludeFields.includes(key)) {
        const [operator, operand] = value.split('.')
        switch (operator) {
          case 'gt':
            this.redisQuery += `@${key}:[${
              '(' + operand + comparisonMatchings.gte
            } ]`
            break
          case 'gte':
            this.redisQuery += `@${key}:[${operand + comparisonMatchings.gte} ]`
            break
          case 'lt':
            this.redisQuery += `@${key}:[${
              comparisonMatchings.lte + '(' + operand
            } ]`
            break
          case 'lte':
            this.redisQuery += `@${key}:[${comparisonMatchings.lte + operand}] `
            break
          default:
            this.redisQuery += `@${key}:${value} `
        }
      }
    }
    console.log(this.redisQuery)
    return this
  }
  sort() {
    if ('sort' in this.query) {
      const direction = this.query.sort.charAt(0)
      const by = this.query.sort.slice(1)
      this.options.push({
        SORTBY: {
          DIRECTION: direction === '+' ? 'ASC' : 'DESC',
          BY: by,
        },
      })
    }
    console.log(this.options)
    return this
  }
  paginate() {
    this.options.push({
      LIMIT: {
        from: 'offset' in this.query ? this.query.offset : '0',
        size: 'limit' in this.query ? this.query.limit : '10',
      },
    })
    return this
  }
  execute() {
    this.options.push({ RETURN: '$' })
    return redisClient.ft.search(this.index, this.redisQuery, ...this.options)
  }
}

module.exports = {
  buildJsonQueryString,
  buildJsonPaginateString,
  RedisSearchQuery,
}
