const checkNullInput = (input, requireField) => {
  for (const field of requireField) {
    if (!(field in input)) {
      throw new ApiError(404, `${field} does not exist`)
    }
  }
}

module.exports = {
  checkNullInput,
}
