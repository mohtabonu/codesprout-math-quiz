import { changeLevel, getNextQuestion } from './db.js'
import { renderGamePage } from './game-page.js'

// HANDLE FUNCTIONS
function showModal () {
  const modal = document.getElementById('infoModal')
  modal.classList.add('show')
  modal.classList.remove('close')
}
function closeModal () {
  const modal = document.getElementById('infoModal')
  modal.classList.remove('show')
  modal.classList.add('close')
}
function selectDifficulty () {
  document.querySelectorAll('.difficulty-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      document
        .querySelectorAll('.difficulty-btn')
        .forEach(b => (b.style.opacity = '0.7'))

      this.style.opacity = '1'

      changeLevel(this.dataset.level)
    })
  })
}

// UI FUNCTIONS
export function renderStartPage () {
  const container = document.createElement('div')
  container.className = 'container'

  // title
  const title = document.createElement('h1')
  title.className = 'title'
  title.textContent = '🧮 Math Quiz'
  container.appendChild(title)

  // difficulty section
  const difficultySection = document.createElement('div')
  difficultySection.className = 'difficulty-section'

  const diffTitle = document.createElement('h1')
  diffTitle.className = 'difficulty-title'
  diffTitle.textContent = 'Choose difficulty level:'
  difficultySection.appendChild(diffTitle)

  const diffButtons = document.createElement('div')
  diffButtons.className = 'difficulty-buttons'

  const easyBtn = document.createElement('button')
  easyBtn.className = 'difficulty-btn easy'
  easyBtn.dataset.level = 'easy'
  easyBtn.textContent = '🟢 Easy'

  const mediumBtn = document.createElement('button')
  mediumBtn.className = 'difficulty-btn medium'
  mediumBtn.dataset.level = 'medium'
  mediumBtn.textContent = '🟡 Medium'

  const hardBtn = document.createElement('button')
  hardBtn.className = 'difficulty-btn hard'
  hardBtn.dataset.level = 'hard'
  hardBtn.textContent = '🔴 Hard'

  diffButtons.append(easyBtn, mediumBtn, hardBtn)
  difficultySection.appendChild(diffButtons)

  container.appendChild(difficultySection)

  // start button
  const startBtn = document.createElement('button')
  startBtn.className = 'start-btn'
  startBtn.textContent = '🚀 Start Game'
  startBtn.addEventListener('click', showModal)
  container.appendChild(startBtn)

  // append container to body
  document.body.replaceChildren(container)

  // --- info modal ---
  const modal = document.createElement('div')
  modal.id = 'infoModal'
  modal.className = 'modal close'

  const modalContent = document.createElement('div')
  modalContent.className = 'modal-content'

  const closeBtn = document.createElement('span')
  closeBtn.className = 'close-btn'
  closeBtn.textContent = '×'
  closeBtn.addEventListener('click', closeModal)

  const modalTitle = document.createElement('h2')
  modalTitle.className = 'modal-title'
  modalTitle.textContent = '🎯 Game Rules'

  const modalText = document.createElement('p')
  modalText.className = 'modal-text'
  modalText.textContent =
    'Solve math problems correctly and collect the highest score!'

  const difficultyInfo = document.createElement('div')
  difficultyInfo.className = 'difficulty-info'
  const difficultyItems = [
    '⏱️ 30 seconds per question',
    '✅ Correct answer: +10 points',
    '❌ Wrong answer: -5 points',
    '🎯 Total of 10 questions'
  ]
  difficultyItems.forEach(text => {
    const infoItem = document.createElement('div')
    infoItem.className = 'info-item'
    infoItem.textContent = text
    difficultyInfo.appendChild(infoItem)
  })

  const modalBtn = document.createElement('button')
  modalBtn.className = 'modal-btn'
  modalBtn.textContent = "Got it, let's start!"
  modalBtn.addEventListener('click', () => {
    const question = getNextQuestion()
    renderGamePage(question)
  })

  modalContent.append(closeBtn, modalTitle, modalText, difficultyInfo, modalBtn)
  modal.appendChild(modalContent)

  document.body.appendChild(modal)
  selectDifficulty()
}

window.addEventListener('load', () => {
  renderStartPage()
})
