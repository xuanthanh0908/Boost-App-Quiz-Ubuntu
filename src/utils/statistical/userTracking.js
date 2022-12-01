const IDDATEOFCHECK = {
  ZERO_FIVE: 1,
  FIVE_TWELVE: 2,
  TWELVE_SEVENTEEN: 3,
  SEVENTEEN_TWENTYTWO: 4,
  TWENTYTWO_TWENTYFOUR: 5,
}
const DATE = {
  ZERO_FIVE: '0h-4h',
  FIVE_TWELVE: '5h-12h',
  TWELVE_SEVENTEEN: '13h-17h',
  SEVENTEEN_TWENTYTWO: '18h-21h',
  TWENTYTWO_TWENTYFOUR: '22h-24h',
}
function UserTracking(userId, userForUserTracking) {
  this.userId = userId
  this.totalUser = userForUserTracking.total.length > 0 ?? 0
  this.detail = userForUserTracking.array
  this.now = new Date()
  this.getTotalUser = function () {
    return this.totalUser
  }
  this.getDetail = function () {
    return this.detail
  }
  this.checkUserExists = function (userID, id, date) {
    return this.detail
      .find((m) => m.date == date)
      .details?.find((k) => k.id === id)
      .users.find((h) => h === userID)
  }
  this.addItem = function (time, userId) {
    // if (this.detail.length > 0) {
    //   this.detail.map((item) =>
    //     item.date === this.now.toLocaleDateString('en-US')
    //       ? {
    //           ...item,
    //           count: item.count + 1,
    //           details: item.details.map((m) =>
    //             m.id === IDDATEOFCHECK[time]
    //               ? {
    //                   ...m,
    //                   users: m.users.find((m) => m === this.userId)
    //                     ? m.users
    //                     : m.users.splice(m.users.length, 0, this.userId),
    //                 }
    //               : m,
    //           ),
    //         }
    //       : item,
    //   )
    // } else {
    //   this.detail.splice(0, 0, {
    //     date: this.now.toLocaleDateString('en-US'),
    //     count: 1,
    //     details: [
    //       {
    //         id: IDDATEOFCHECK[time],
    //         time: DATE[time],
    //         users: [userId],
    //       },
    //     ],
    //   })
    // }

    /// test version
    if (this.detail.length > 0) {
      const findDateIndex = this.detail.findIndex(
        (m) => m.date === this.now.toLocaleDateString('en-US'),
      )
      const sizeOfDetails = this.detail.length
      if (findDateIndex !== -1) {
        const findIndexDetails = this.detail[findDateIndex].details.findIndex(
          (m) => m.id === IDDATEOFCHECK[time],
        )
        if (findIndexDetails !== -1) {
          const checkUserExists = this.detail[findDateIndex].details[
            findIndexDetails
          ].users.find((m) => m === userId)
          const updateDetails = this.detail[findDateIndex].details.map((p) =>
            p.id === IDDATEOFCHECK[time]
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
              id: IDDATEOFCHECK[time],
              time: DATE[time],
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
            id: IDDATEOFCHECK[time],
            time: DATE[time],
            users: [userId],
          },
        ],
      })
    }
  }
  this.updateStatisticalData = function () {
    if (this.now.getHours() >= 0 && this.now.getHours() < 5) {
      this.addItem('ZERO_FIVE', this.userId)
    } else if (this.now.getHours() <= 12) {
      this.addItem('FIVE_TWELVE', this.userId)
    } else if (this.now.getHours() <= 17) {
      this.addItem('TWELVE_SEVENTEEN', this.userId)
    } else if (this.now.getHours() < 22) {
      this.addItem('SEVENTEEN_TWENTYTWO', this.userId)
    } else {
      this.addItem('TWENTYTWO_TWENTYFOUR', this.userId)
    }

    this.totalUser++
    userForUserTracking.total++
    userForUserTracking.array = this.detail
  }
}

module.exports = UserTracking
