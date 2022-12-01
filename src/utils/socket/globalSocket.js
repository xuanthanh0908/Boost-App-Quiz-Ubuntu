// defind class globalSocket - to utils all logic handle PVP
function globalSocket(listUserPendding) {
  this.getListUser = function () {
    return listUserPendding
  }
  this.getAllUserPendding = function () {
    return listUserPendding.length > 0 && listUserPendding
  }
  this.getInfoRoom = function (idRoom) {
    return (
      listUserPendding.length > 0 &&
      listUserPendding.find((m) => m.room === idRoom)
    )
  }

  this.getInfoRoomByUserName = function (username) {
    const find = listUserPendding.find((m) => m.users.includes(username))
    return find
  }
  this.addRoomToList = function (room, category) {
    const find = listUserPendding.findIndex((m) => m.room === room)
    if (find < 0) {
      listUserPendding.push({
        room: room,
        users: [],
        category: category,
      })
    }
    return listUserPendding
  }
  this.addUserToRoom = function (room, userInfo, category) {
    const { id } = userInfo
    const find = listUserPendding.findIndex((m) => m.room === room)
    if (find !== -1) {
      const listUser = []
      const checkNoExitsMyUser = listUserPendding[find].users.filter(
        (m) => m.id === id,
      )
      if (
        listUserPendding[find].users?.length > 0 &&
        checkNoExitsMyUser.length === 0 &&
        listUserPendding[find].status === 'watting' &&
        listUserPendding[find].category === category
      ) {
        listUser.splice(
          listUser.length,
          0,
          listUserPendding[find].users[0],
          userInfo,
        )
      } else listUser.splice(listUser.length, 0, userInfo)
      listUserPendding.splice(find, 1, {
        ...listUserPendding[find],
        users: listUser,
        createdAt: Date.now(),
        status: listUser.length < 2 ? 'watting' : 'playing',
      })
    }
    return listUserPendding
  }

  this.updateStatusRoom = function (roomId, status) {
    const findRoom = listUserPendding.findIndex((m) => m.room === roomId)
    if (findRoom !== -1) {
      listUserPendding.splice(findRoom, 1, {
        ...listUserPendding[findRoom],
        status: status,
        createdAt: Date.now(),
      })
    }
    return listUserPendding
  }
  this.removeUserFromRoom = function (username) {
    const findRoom = listUserPendding.findIndex((m) =>
      m.users.includes(username),
    )
    let result = false
    if (findRoom !== -1) {
      const userFilter = listUserPendding[findRoom].users.filter(
        (m) => m !== username,
      )
      if (userFilter.length == 0) {
        const isRemove = removeRoomFromList(listUserPendding[findRoom]['room'])
        result = isRemove
      } else {
        listUserPendding.splice(findRoom, 1, {
          ...listUserPendding[findRoom],
          users: [userFilter[0]],
        })
      }
      result = true
    }
    return result
  }
  this.removeRoomFromList = function (roomID) {
    const findRoom = listUserPendding.findIndex((m) => m.room === roomID)
    let checked = false
    if (findRoom !== -1) {
      listUserPendding.splice(findRoom, 1)
      checked = true
    }
    return checked
  }
  this.checkRoomPlay = function (listGlobal, category) {
    let randomIdRoom = null
    const checkExistRoomHasPlace = listUserPendding.filter(
      (m) =>
        m.users.length < process.env.PVP_LIMIT_PERSON &&
        m.category === category,
    )
    if (checkExistRoomHasPlace.length === 0) {
      randomIdRoom = 'roomId_' + Date.now().toString()
      this.addRoomToList(randomIdRoom, category)
    }

    return randomIdRoom ?? checkExistRoomHasPlace[0].room
  }

  this.removeAllRoom = function () {
    listUserPendding = []
    return listUserPendding.length === 0 ? true : false
  }
  this.removeRoomTimeout = function (now) {
    return listUserPendding.filter(
      (m) =>
        m.status !== 'done' ||
        (m.status !== 'waitting' && now - m.createdAt >= 180000),
    )
  }
}
module.exports = globalSocket
