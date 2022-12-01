const IT = {
  HTML: 'HTML',
  CSS: 'CSS',
  JAVASCRIPT: 'JAVASCRIPT',
  C: 'C',
  CPLUS: 'C++',
  PYTHON: 'PYTHON',
}
function CategoryTracking(userId, userForCategoryTracking, category) {
  this.userId = userId
  this.category = category.toUpperCase()
  this.detail = userForCategoryTracking.array
  this.now = new Date()
  this.getDetail = function () {
    return this.detail
  }
  this.checkUserExists = function (userID, id, date) {
    return this.detail
      .find((m) => m.date == date)
      .details?.find((k) => k.id === id)
      .users.find((h) => h === userID)
  }
  this.addItem = function (category, userId) {
    /// test version
    if (this.detail.length > 0) {
      const findDateIndex = this.detail.findIndex(
        (m) => m.date === this.now.toLocaleDateString('en-US'),
      )
      const sizeOfDetails = this.detail.length
      if (findDateIndex !== -1) {
        const findIndexDetails = this.detail[findDateIndex].details.findIndex(
          (m) => m.id === IT['ID_' + category],
        )
        if (findIndexDetails !== -1) {
          const checkUserExists = this.detail[findDateIndex].details[
            findIndexDetails
          ].users.find((m) => m === userId)
          const updateDetails = this.detail[findDateIndex].details.map((p) =>
            p.id === IT['ID_' + category]
              ? {
                  ...this.detail[findDateIndex].details[findIndexDetails],
                  users: checkUserExists
                    ? this.detail[findDateIndex].details[findIndexDetails].users
                    : [
                        ...this.detail[findDateIndex].details[findIndexDetails]
                          .users,
                        userId,
                      ],
                }
              : p,
          )
          this.detail.splice(findDateIndex, 1, {
            date: this.now.toLocaleDateString('en-US'),
            count: this.detail[findDateIndex].count + 1,
            details: updateDetails,
          })
        }
      } else {
        this.detail.splice(sizeOfDetails, 0, {
          date: this.now.toLocaleDateString('en-US'),
          count: 1,
          details: [
            {
              id: 'ID_' + IT[category],
              category: IT[category],
              users: [userId],
            },
          ],
        })
      }
    } else {
      this.detail.splice(0, 0, {
        date: this.now.toLocaleDateString('en-US'),
        count: 1,
        details: [
          {
            id: 'ID_' + IT[category],
            category: IT[category],
            users: [userId],
          },
        ],
      })
    }
  }
  this.updateStatisticalData = function () {
    this.addItem(this.category, this.userId)
    this.totalUser++
    userForCategoryTracking.total++
    userForCategoryTracking.array = this.detail
  }
}

module.exports = CategoryTracking
