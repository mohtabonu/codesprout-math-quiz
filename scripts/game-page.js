import {
  checkAnswer,
  getNextQuestion,
  state,
  startTimer,
  MAX_QUESTION_COUNT,
  restart,
  goHome,
  getGameOverMessage
} from './db.js'
import { renderStartPage } from './start-page.js'

// HANDLE FUNCTIONS
function handleCheckAnswer () {
  const input = document.getElementById('answerInput')
  const questionArea = document.getElementById('question-area')

  const answer = input.value

  const isCorrect = checkAnswer(Number(answer))
  const style = isCorrect ? 'correct' : 'incorrect'
  questionArea.classList.add(style)
  input.value = ''

  setTimeout(() => {
    const question = getNextQuestion()
    renderQuestion(question)
    renderGameHeader()
    renderTimer()
    renderGameOver()
  }, 1000)
}

function handleRestartGame () {
  restart()
  const question = getNextQuestion()
  renderQuestion(question)
  renderGameHeader()
  renderTimer()
  renderGameOver()
}

function handleToHome () {
  goHome()
  renderStartPage()
}

// UI FUNCTIONS
export function renderGamePage (firstQuestion) {
  const gameContainer = document.createElement('div')
  gameContainer.className = 'game-container'

  // --- gameArea ---
  const gameArea = document.createElement('div')
  gameArea.id = 'gameArea'

  // header
  const gameHeader = document.createElement('div')
  gameHeader.className = 'game-header'

  // score-box container
  const scoreBox = document.createElement('div')
  scoreBox.className = 'score-box'
  const scoreLabel = document.createElement('div')
  scoreLabel.className = 'header-label'
  scoreLabel.textContent = 'Score'
  const scoreValue = document.createElement('div')
  scoreValue.className = 'header-value'
  scoreValue.id = 'score'

  scoreBox.append(scoreLabel, scoreValue)

  // question-box container
  const questionBox = document.createElement('div')
  questionBox.className = 'question-box'
  const qLabel = document.createElement('div')
  qLabel.className = 'header-label'
  qLabel.textContent = 'Question'
  const qValue = document.createElement('div')
  qValue.id = 'question-value'
  qValue.className = 'header-value'

  questionBox.append(qLabel, qValue)

  // timer-box container
  const timerBox = document.createElement('timer-box')
  timerBox.className = 'timer-box'
  timerBox.id = 'timer-box'
  const tLabel = document.createElement('div')
  tLabel.className = 'header-label'
  tLabel.textContent = 'Time'
  const tValue = document.createElement('div')
  tValue.className = 'header-value'
  tValue.id = 'timer'

  timerBox.append(tLabel, tValue)

  gameHeader.append(scoreBox, questionBox, timerBox)

  // progress-container
  const progressContainer = document.createElement('div')
  progressContainer.className = 'progress-container'
  const progressBar = document.createElement('div')
  progressBar.className = 'progress-bar'
  progressBar.id = 'progress-bar'

  progressContainer.appendChild(progressBar)

  // question-area container
  const questionArea = document.createElement('div')
  questionArea.id = 'question-area'
  questionArea.className = 'show'

  // feedback
  const feedback = document.createElement('div')
  feedback.className = 'feedback'
  feedback.id = 'feedback'

  gameArea.append(gameHeader, progressContainer, questionArea, feedback)

  // --- gameOver ---
  const gameOver = document.createElement('div')
  gameOver.className = 'game-over close'
  gameOver.id = 'game-over'

  const goTitle = document.createElement('h1')
  goTitle.style.color = '#4a5568'
  goTitle.style.fontSize = '2.5rem'
  goTitle.style.marginBottom = '20px'
  goTitle.textContent = '🎉 Game Over!'

  const finalScore = document.createElement('div')
  finalScore.className = 'final-score'
  finalScore.id = 'finalScore'
  finalScore.textContent = '0'

  const scoreMessage = document.createElement('div')
  scoreMessage.className = 'score-message'
  scoreMessage.id = 'scoreMessage'
  scoreMessage.textContent = 'Great result!'

  const restartBtn = document.createElement('button')
  restartBtn.className = 'restart-btn'
  restartBtn.textContent = '🔄 Play Again'
  restartBtn.addEventListener('click', handleRestartGame)

  const homeBtn = document.createElement('button')
  homeBtn.className = 'home-btn'
  homeBtn.textContent = '🏠 Home'
  homeBtn.addEventListener('click', handleToHome)

  gameOver.append(goTitle, finalScore, scoreMessage, restartBtn, homeBtn)

  gameContainer.append(gameArea, gameOver)
  document.body.replaceChildren(gameContainer)

  renderQuestion(firstQuestion)
  renderGameHeader()
  renderTimer()
}

function renderQuestion ({ number1, number2, operation }) {
  // question-area
  const questionArea = document.getElementById('question-area')
  questionArea.innerHTML = ''
  questionArea.className = 'question-area'

  const question = document.createElement('div')
  question.className = 'question'
  question.id = 'question'
  question.textContent = `${number1} ${operation} ${number2} = ?`

  const hint = document.createElement('div')
  hint.className = 'question-hint'
  hint.textContent = 'Enter your answer'

  const answerInput = document.createElement('input')
  answerInput.type = 'number'
  answerInput.className = 'answer-input'
  answerInput.id = 'answerInput'
  answerInput.placeholder = '?'

  const submitBtn = document.createElement('button')
  submitBtn.className = 'submit-btn'
  submitBtn.textContent = 'Check Answer'
  submitBtn.addEventListener('click', handleCheckAnswer)

  questionArea.append(
    question,
    hint,
    answerInput,
    document.createElement('br'),
    submitBtn
  )
}

function renderGameHeader () {
  // score box
  const scoreValue = document.getElementById('score')
  scoreValue.textContent = state.score

  // question-box
  const currentQuestionIdx = state.questions.indexOf(state.currentQuestion)

  const qValue = document.getElementById('question-value')
  qValue.innerHTML = `<span>${currentQuestionIdx + 1}</span>/10`

  // progress-bar
  const progressBar = document.getElementById('progress-bar')
  progressBar.style.width = `${((currentQuestionIdx + 1) / 10) * 100}%`
}

function renderTimer () {
  // timer-box
  const tValue = document.getElementById('timer')
  const tBox = document.getElementById('timer-box')
  tValue.textContent = '30'
  tBox.classList.remove('warning')

  state.onTimerUpdate = time => {
    tValue.textContent = time
    if (tValue.textContent <= '10') {
      tBox.classList.add('warning')
    }
  }

  state.onTimeEnd = () => {
    const question = getNextQuestion()
    renderQuestion(question)
    renderGameHeader()
    renderTimer()
    renderGameOver()
  }

  startTimer()
}

function renderGameOver () {
  const questionArea = document.getElementById('question-area')
  const gameOver = document.getElementById('game-over')
  const tValue = document.getElementById('timer')
  const finalScore = document.getElementById('finalScore')
  const scoreMessage = document.getElementById('scoreMessage')

  gameOver.classList.remove('show')
  gameOver.classList.add('close')

  if (state.questions.length === MAX_QUESTION_COUNT) {
    questionArea.classList.add('close')
    questionArea.classList.remove('show')
    gameOver.classList.add('show')
    gameOver.classList.remove('close')

    const message = getGameOverMessage(state.score)

    finalScore.textContent = state.score
    scoreMessage.textContent = message

    state.onTimeEnd = () => {
      tValue.textContent = '30'
    }
    startTimer()
  }
}
