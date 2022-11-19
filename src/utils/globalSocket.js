const listUserPendding = []

const getListUser = () => {
  return listUserPendding
}
const getAllUserPendding = () => {
  return listUserPendding.length > 0 && listUserPendding
}
const getInfoRoom = (idRoom) => {
  return (
    listUserPendding.length > 0 &&
    listUserPendding.find((m) => m.room === idRoom)
  )
}

const getInfoRoomByUserName = (username) => {
  const find = listUserPendding.find((m) => m.users.includes(username))
  return find
}
const addRoomToList = (room) => {
  const find = listUserPendding.findIndex((m) => m.room === room)
  if (find < 0) {
    listUserPendding.push({
      room: room,
      users: [],
    })
  }
  return listUserPendding
}
const addUserToRoom = (room, userInfo, category) => {
  const { id, displayname } = userInfo
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
      listUser.push(listUserPendding[find].users[0], userInfo)
    } else listUser.push(userInfo)
    listUserPendding.splice(find, 1, {
      users: listUser,
      room: room,
      createdAt: Date.now(),
      category: category,
      status: listUser.length < 2 ? 'watting' : 'playing',
    })
  }
  return listUserPendding
}

const updateStatusRoom = (roomId, status) => {
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
const removeUserFromRoom = (username) => {
  const findRoom = listUserPendding.findIndex((m) => m.users.includes(username))
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
const removeRoomFromList = (roomID) => {
  const findRoom = listUserPendding.findIndex((m) => m.room === roomID)
  let checked = false
  if (findRoom !== -1) {
    listUserPendding.splice(findRoom, 1)
    checked = true
  }
  return checked
}
const checkRoomPlay = (listUser, listGlobal) => {
  let randomIdRoom = null
  let checked = false
  if (listUser.length === 0) {
    randomIdRoom = 'roomId_' + Date.now().toString()
    list = addRoomToList(randomIdRoom)
  } else {
    for (const item of list) {
      if (item.users.length < process.env.PVP_LIMIT_PERSON) checked = true
    }
    if (!checked) {
      randomIdRoom = 'roomId_' + Date.now().toString()
      list = addRoomToList(randomIdRoom)
      checked = false
    }
  }
  const filterRooms = list.filter(
    (m) => m.users?.length < process.env.PVP_LIMIT_PERSON,
  )
  return { filterRooms, listGlobal }
}

const removeAllRoom = () => {
  listUserPendding = []
  return listUserPendding.length === 0 ? true : false
}
const removeRoomTimeout = (now) => {
  return listUserPendding.filter(
    (m) =>
      m.status !== 'done' ||
      (m.status !== 'waitting' && now - m.createdAt >= 180000),
  )
}
module.exports = {
  getListUser,
  addUserToRoom,
  getAllUserPendding,
  getInfoRoom,
  addRoomToList,
  removeUserFromRoom,
  checkRoomPlay,
  updateStatusRoom,
  getInfoRoomByUserName,
  removeRoomFromList,
  removeAllRoom,
  removeRoomTimeout,
}
