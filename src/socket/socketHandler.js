const globalSocket = require('../utils/socket/globalSocket')
const Quiz = require('../models/quiz.model')
const loadash = require('lodash')
const Bot = require('../utils/bot/Bot')
const { faker } = require('@faker-js/faker')
const UserTracking = require('../utils/statistical/userTracking')
// const { verifyAccessTokenForSocket } = require('./verifyAccessTokenSocket')
// const redisClient = require('../redis/redisClient')
let dataUserPending = []
let connectedSocket = {}
let list = []
let bot = null
let listBot = []
let userForUserTracking = {
  total: 0,
  array: [],
}
let glbSocket = new globalSocket(dataUserPending)
const timeoutEntriesBot = {}
const pvpNamespaces = '/pvp'

async function socketHandler(connectingSockets) {
  return async (socket) => {
    // socket.auth = false
    socket.on('login', ({ username, id }) => {
      const trackUser = new UserTracking(id, userForUserTracking)
      trackUser.updateStatisticalData()
      console.log('==== TOTAL USER === ', userForUserTracking.total)
      console.log('==== DETAIL USER === ', userForUserTracking.array)
      /// verify accessToken
      // verifyAccessTokenForSocket(accessToken, (err, result) => {
      //   if (!err || result) {
      //     console.log(
      //       '::::::::::::::SOCKET - LOGIN:::::::::::::::::::::::::::ID:::',
      //       socket.id,
      //     )
      //     // register socket name
      //     // each sockets represents an user
      //     connectedSocket[username] = socket
      //     socket.username = username
      //   }
      // })
      console.log(
        '::::::::::::::SOCKET - LOGIN:::::::::::::::::::::::::::ID:::',
        socket.id,
      )
      // connectedSocket[username] = socket
      // socket.username = username
      const randomId = 'User_' + Date.now().toString()
      connectedSocket[randomId] = socket
      socket.username = randomId
      socket.emit('userId', randomId)
      /// when user does not provide accessToken --- not allow connect to socket server
      // setTimeout(function () {
      //   if (!socket.auth) {
      //     console.log('Disconnecting socket ', socket.id)
      //     socket.disconnect('unauthorized')
      //   }
      // }, 1000)
    })
    socket.on('needAllRoom', () => {
      socket.emit('allRoom', listGlobal.getAllUserPendding())
    })

    socket.on('killAllRoom', () => {
      glbSocket.removeAllRoom()
    })
    socket.on('killRoom', ({ roomId }) => {
      glbSocket.removeRoomFromList(roomId)
    })
    /// event join user to room --- play game
    socket.on('join', ({ room, username }) => {
      socket.join(room)
      console.log('::::::::::::::SOCKET - JOIN::::::::::::::::::::::::::::')
      socket.broadcast
        .to(room)
        .emit('newuser', `${username} has joined the room`)
    })

    /// random quizz by category -- loading all quizzs on first approach at room
    socket.on('streamQuizs', async (data) => {
      const { username, roomId, category, optionLanguage = 'En' } = data
      let query = category.replaceAll('+', '\\+')
      // send data to all client online in room except  sender
      const quiz = await Quiz.find({
        category: { $regex: new RegExp('^' + query + '$'), $options: 'gi' },
      }).limit(40)
      let randDomSample = loadash.sampleSize(quiz, process.env.PVP_MAX_QUESTION)
      const AllQuestForBot = randDomSample
      randDomSample = randDomSample.map((item) => {
        const listAnswer = [...item.questionAnswer['lists' + optionLanguage]]
        const randomInsert = Math.floor(Math.random() * 4)
        listAnswer.splice(randomInsert, 0, item.correctOption.optionEn)
        return {
          _id: item._id,
          questionAnswer: listAnswer,
          createdBy: item.createdBy,
          questionTitle: item.questionTitle['lists' + optionLanguage],
          hashtags: item.hashtags,
          category: item.category,
        }
      })
      const findRoom = listBot.find((m) => m.roomID === roomId)
      if (findRoom) {
        findRoom.bot.setQuestion(AllQuestForBot)
        findRoom.bot.FirstQuestion()
      }
      connectingSockets.io.of(pvpNamespaces).in(roomId).emit('allQuiz', {
        allData: randDomSample,
        username: username,
      })
    })

    /// check correct anwser from client
    socket.on('checkAnswer', async (data) => {
      const {
        quizId,
        quizIndex,
        answer,
        username,
        roomId,
        totalCorrect,
        totalIncorrect,
        point,
        option = 'En',
      } = data
      console.log('=========SOCKET CHECKED ==== :', username)
      const quizz = await Quiz.findById(quizId)
      const { correctOption } = quizz
      let result = null
      if (answer !== '' || answer !== null || answer !== undefined) {
        if (correctOption['option' + option] === answer) {
          result = correctOption['option' + option]
        }

        // connectingSockets.io
        //   .of(pvpNamespaces)
        //   .in(roomId)
        //   .emit('hasdonepvp', {
        //     totalCorrect: totalCorrect ?? 0,
        //     totalIncorrect: totalIncorrect ?? 0,
        //     point: point ?? 0,
        //     username: username ?? 'random',
        //   })
        const findRoom = glbSocket.getInfoRoom(roomId)
        if (findRoom.status === 'playing') {
          glbSocket.updateStatusRoom(roomId, 'user1done')
        } else {
          if (findRoom.status === 'user1done') {
            glbSocket.updateStatusRoom(roomId, 'done')
          }
        }
        socket.to(roomId).emit('statusCheck', {
          status: result ? true : false,
          result: result ?? '@',
          username: username,
        })
        socket.emit('statusCheck', {
          status: result ? true : false,
          result: result ?? '@',
          username: username,
        })
      }
    })
    // handle event user wanna stop find opponent (cancel)
    socket.on('cancelfindopponent', (data) => {
      const { roomId } = data
      console.log('::::::::::::::SOCKET - CANCEL FINDOPPENT:::::::::::::::::::')
      /// check if user findOpponent but in the middle time user cancel find opponent
      /// remove Room user has created before
      glbSocket.removeRoomFromList(roomId)
      /// emit leave room
      socket.leave(roomId)
    })
    // event match opponent
    socket.on('findopponent', (data) => {
      console.log('::::::::::::::SOCKET - FINDOPPENT:::::::::::::::::::')
      const { id, displayname, category } = data
      const userInfo = {
        id,
        displayname,
      }
      /// check exits room to play
      const RoomIDCheck = glbSocket.checkRoomPlay(list, category)
      glbSocket.addUserToRoom(RoomIDCheck, userInfo, category)
      timeoutEntriesBot.RoomIDCheck = setTimeout(() => {
        console.log('===============SOCKET - BOT==============')
        const max = 1000
        const min = 10
        const checkRoom = glbSocket.getInfoRoom(RoomIDCheck)
        if (checkRoom.users.length < 2) {
          bot = new Bot(
            faker.name,
            Math.random() * (max - min) + min,
            RoomIDCheck,
            category,
          )
          listBot.splice(listBot.length, 0, {
            roomID: RoomIDCheck,
            bot: bot,
          })
        }
      }, 10000)

      /// send room id to client and client will join with that room di
      socket.emit('roomserver', { roomId: RoomIDCheck })
      /// loading - done - when room has enough 2 players
      const getInfoRoom = glbSocket.getInfoRoom(RoomIDCheck)
      if (getInfoRoom && getInfoRoom.status === 'playing') {
        clearTimeout(timeoutEntriesBot.RoomIDCheck)
        delete timeoutEntriesBot.RoomIDCheck
        socket
          .to(getInfoRoom.room)
          .emit('searching', { loading: false, users: getInfoRoom.users })
        socket.emit('searching', { loading: false, users: getInfoRoom.users })
      }
      console.log(
        '::::::::::::::SOCKET - ROOMLIST :::::::::::::::::::::::',
        glbSocket.getAllUserPendding(),
      )
    })
    /// event that server listen client disconnect
    socket.on('end', ({ username, roomID }) => {
      socket.leave(roomID)
      const findUser = glbSocket.getInfoRoomByUserName(username)
      if (findUser) {
        glbSocket.removeUserFromRoom(username)
      }
    })
    /// event that server listen client disconnect
    socket.on('disconnect', (reason) => {
      const findUser = glbSocket.getInfoRoomByUserName(socket.username)
      if (findUser) {
        glbSocket.removeUserFromRoom(socket.username)
      }
      console.log(reason)
      delete connectedSocket[socket.username]
    })
    setInterval(() => {
      console.log(
        '::::::::::::::SOCKET - ROOMLIST - REFRESH:::::::::::::::::::::::',
        glbSocket.removeRoomTimeout(Date.now()),
      )
    }, process.env.TIME_TO_REFRESH_REMOVE_ROOM * 1000)
  }
}

module.exports = {
  socketHandler,
  userForUserTracking,
}
