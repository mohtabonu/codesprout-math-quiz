export const state = {
  level: ['easy', 'medium', 'hard'],
  currentLevel: 'easy',
  questions: [],
  currentQuestion: null,
  score: 0,
  time: 30,

  intervalId: null,
  onTimerUpdate: null,
  onTimeEnd: null
}

export const MAX_QUESTION_COUNT = 10

function getMaxNumber () {
  if (state.currentLevel === 'medium') return 100
  if (state.currentLevel === 'hard') return 1000
  return 10
}

export function changeLevel (level) {
  state.currentLevel = level
}

export function generateNumber (maxNumber) {
  const number = Math.floor(Math.random() * maxNumber)

  return number
}

export function generateOperation () {
  const operations =
    state.currentLevel === 'easy'
      ? ['+', '-']
      : state.currentLevel === 'medium'
      ? ['+', '-', '*']
      : state.currentLevel === 'hard'
      ? ['+', '-', '*', '/']
      : []

  const randomIdx = generateNumber(operations.length)
  const operation = operations[randomIdx]

  return operation
}

export function calculateAnswer (number1, number2, operation) {
  switch (operation) {
    case '+':
      return number1 + number2
    case '-':
      return number1 - number2
    case '*':
      return number1 * number2
    case '/':
      return number1 / number2
  }
}

export function getNextQuestion () {
  if (state.questions.length === MAX_QUESTION_COUNT) return

  const number1 = generateNumber(getMaxNumber())
  const number2 = generateNumber(getMaxNumber()) || 1
  const operation = generateOperation()
  const correctAnswer = calculateAnswer(number1, number2, operation)
  const question = {
    number1,
    number2,
    operation,
    correctAnswer,
    status: 'unanswered'
  }

  state.questions.push(question)
  state.currentQuestion = question
  state.time = 30

  return question
}

export function checkAnswer (answer) {
  const isCorrect = answer === state.currentQuestion.correctAnswer
  state.currentQuestion.status = isCorrect ? 'correct' : 'incorrect'

  if (isCorrect) state.score += 10
  else state.score -= 5

  return isCorrect
}

export function timerTick () {
  state.time--

  if (state.time <= 0) {
    clearInterval(state.intervalId)
    return false
  }

  return true
}

export function startTimer () {
  if (state.intervalId) clearInterval(state.intervalId)

  state.time = 30
  state.intervalId = setInterval(() => {
    const stillRunning = timerTick()

    if (state.onTimerUpdate) state.onTimerUpdate(state.time)

    if (!stillRunning && state.onTimeEnd) {
      state.onTimeEnd()
    }

    if (state.questions.length === MAX_QUESTION_COUNT){
      state.time = 30
      state.onTimeEnd()
    }
  }, 1000)
}

export function restart(){
  if (state.intervalId) clearInterval(state.intervalId)

  state.questions = []
  state.currentQuestion = null
  state.score =  0
  state.time = 30

  state.intervalId = null
  state.onTimerUpdate = null
  state.onTimeEnd = null
}

export function goHome(){
  restart()
  state.currentLevel = 'easy'
}

export function getGameOverMessage(score) {
  if (score <= 0) {
    return "Oops... your score is negative. Try again!"
  } else if (score > 0 && score < 10) {
    return "Not bad for a start, keep practicing!"
  } else if (score > 10 && score < 30) {
    return "Good effort, but you can do even better!"
  } else if (score >= 50 && score < 80) {
    return "Great results! Keep it up!"
  } else {
    return "Amazing! You're a real master! 🎉"
  }
}