const ClientSocket = require('socket.io-client')
const HundrArr = Array.from({ length: 100 }, (_, i) => i + 1)
const definedRate = [
  {
    id: 1,
    level: 1,
    desc: 'this level so easy',
    proportion: {
      correct: HundrArr.filter((m) => m < 20 && m > 0),
    },
  },
  {
    id: 2,
    level: 2,
    desc: 'this level so hard',
    proportion: {
      correct: HundrArr.filter((m) => m >= 20 && m <= 100),
    },
  },
]
class Bot {
  constructor(point, country, roomId, category) {
    // this.name = faker.name.fullName()
    this.name = 'bot_' + this.getRandomInt(1, 1000)
    this.level = this.getRandomInt(0, 1)
    this.point = point
    this.country = country
    this.question = null
    this.socket = ClientSocket(process.env.SERVER_URL)
    this.roomId = roomId
    this.currentIndex = 0
    this.category = category
    this.timoutAnswer = null
    this.timeoutFirstAppoarch = null
    console.log('========BOT LEVEL========', this.level)
    ///
    let that = this
    that.OnCheckAnswer()
    /// first question
    that.Join()
  }

  FirstQuestion() {
    this.timeoutFirstAppoarch = setTimeout(() => {
      this.Run(0)
    }, 3000)
  }
  Join() {
    /// login
    this.socket.emit('findopponent', {
      id: this.name,
      displayname: this.name,
      category: this.category,
    })
  }
  OnCheckAnswer() {
    this.socket.on('statusCheck', (data) => {
      const { username: identifiedFromServer } = data
      if (this.currentIndex < this.question.length) {
        if (this.name === identifiedFromServer) {
          this.Run(this.currentIndex + 1)
          this.currentIndex = this.currentIndex + 1
        } else {
          clearTimeout(this.timeout)
          clearTimeout(this.timeoutFirstAppoarch)
          clearTimeout(this.timoutAnswer)
        }
      }
    })
  }
  getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1) + min) // The maximum is exclusive and the minimum is inclusive
  }
  chooseAnswer(index, listIncorrect, correct) {
    let finalAnswer = null
    let timeAnswer = null
    const startTime = Date.now()
    const listAnswer = [...listIncorrect, correct]
    const getLevel = definedRate[this.level]
    const RandomPropAnswer = this.getRandomInt(0, 100)
    if (getLevel.proportion.correct.includes(RandomPropAnswer)) {
      finalAnswer = listAnswer[listAnswer.length - 1]
    } else {
      const randomWrongAnswer = Math.floor(Math.random() * 3)
      finalAnswer = listAnswer[randomWrongAnswer]
    }
    if (getLevel.level === 2) {
      timeAnswer = this.getRandomInt(2, 4) * 1000
    } else timeAnswer = this.getRandomInt(5, 10) * 1000

    return {
      finalAnswer,
      timeAnswer,
      totalInMs: `${Date.now() - startTime} ms`,
    }
  }
  Run(index) {
    if (index < this.question.length) {
      const botAnswer = this.chooseAnswer(
        index,
        this.question[index].questionAnswer['listsEn'],
        this.question[index].correctOption.optionEn,
      )
      this.timoutAnswer = setTimeout(() => {
        console.log('==========BOT-ANWSER==========')
        console.log('ID: ', this.question[index]._id)
        console.log('INDEX: ', index)
        console.log('ANSWER: ', botAnswer.finalAnswer)
        console.log('ROOMID: ', this.roomId)
        console.log('TIME: ', botAnswer.timeAnswer)
        this.socket.emit('checkAnswer', {
          quizId: this.question[index]._id,
          quizIndex: index,
          answer: botAnswer.finalAnswer,
          username: this.name,
          roomId: this.roomId,
        })
      }, botAnswer.timeAnswer)
    }
  }
  getName() {
    return this.name
  }
  getLevel() {
    return this.level
  }
  getPoint() {
    return this.point
  }
  getCountry() {
    return this.country
  }
  getAllQuestion() {
    return this.question
  }
  getRoom() {
    return this.room
  }
  setQuestion(question) {
    this.question = question
  }
}

module.exports = Bot
