let onlineUsers = new Map();

const addUserToList = (user, socketId) => {
    onlineUsers.set(user._id, {data: user, socketId: socketId})
}


const getOnlineFriends = (friends) => {
    let onlineFriends = [];
    friends.forEach(friend => {
        if (onlineUsers.has(friend)) {
            onlineFriends.push(onlineUsers.get(friend))
        }
    })
    return onlineFriends;
}

const deleteUser = (id) => {
    onlineUsers.delete(id)
}

const updateUsers = (list) => {
    onlineUsers = list
}

module.exports = {
    addUserToList,
    getOnlineFriends,
    deleteUser,
    updateUsers
}