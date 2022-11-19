const globalChat = require('../utils/globalChat')
const Message = require('../models/message.model')
const Room = require('../models/room.model')
const User = require('../models/user.model')
const loadash = require('lodash')
const uuid = require('uuid')
const { verifyAccessTokenForSocket } = require('./verifyAccessTokenSocket')

const chatHandler = async (connectingSockets) => {
    return async (socket) => {
        socket.on('getRooms', async () => {
            rooms = await Room.find();
            socket.emit('rooms', rooms)
        })

        socket.on('deleteRooms', async () => {
            await Room.deleteMany();
        })

        /**
         *  Listen once when the user log into the app.
         * 
         *  @param: information of the logged user (user)
         */
        socket.on('login', async (user) => {
            socket.data = user;
            friends = user.friends;
            let onlineFriends = globalChat.getOnlineFriends(user.friends)
            globalChat.addUserToList(user, socket.id)
            socket.emit('onlineFriends', onlineFriends)
        })

        socket.on('createRoom', async ({friends}) => {
            let roomId
            const room = await Room.findOne({users: {$all: friends}})   
            //Check if the room between users exists
            if (!room) {
                roomId = uuid.v4();
                Room.create({users: friends, roomId: roomId})
            } else {
                roomId = room.roomId
            }
            // Send roomId to the client 
            socket.emit('roomCreated', roomId)
        })


        /**
         * Join the room with specified room id.
         */
        socket.on('join', (data) => {
            const {room, ...user} = data
            socket.join(room)
            socket.broadcast
              .to(room)
              .emit('joinRoom', `user ${user.username} joined`)
        })

        /**
         * send massage to the specified room.
         */
        socket.on('message', async (data) => {
            const {room, ...mess} = data
            const message = await Message.create(mess)
            socket.to(room).emit('newMessage', message)
        })


        /**
         * Check online players and emit it to every connecting users.
         */
        socket.on('checkOnline', async (user) => {
            let friends = user.friends;
            let onlineUsers = globalChat.getOnlineFriends(friends)
            // Send list of online users to the client 
            socket.emit('onlineUsers', onlineUsers)
        })

        socket.on('disconnect', (reason) => {
            console.log(reason)
            globalChat.deleteUser(socket.data._id)
        })
    }
}

module.exports = {chatHandler}