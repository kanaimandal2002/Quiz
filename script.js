// Quiz questions
const questions = [
    {
        question: "What is the capital of France?",
        options: ["Paris", "London", "Berlin", "Madrid"],
        answer: 0
    },
    {
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        answer: 1
    },
    {
        question: "What is the largest mammal in the world?",
        options: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
        answer: 1
    },
    {
        question: "Which element has the chemical symbol 'O'?",
        options: ["Gold", "Oxygen", "Osmium", "Oganesson"],
        answer: 1
    },
    {
        question: "Who painted the Mona Lisa?",
        options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
        answer: 2
    }
];

// DOM elements
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const scoreElement = document.getElementById('score');
const timeElement = document.getElementById('time');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const currentQuestionElement = document.getElementById('current-question');
const finalScoreElement = document.getElementById('final-score');
const highScoreList = document.getElementById('high-score-list');
const feedbackElement = document.getElementById('feedback');

// Screens
const welcomeScreen = document.querySelector('.welcome-screen');
const quizScreen = document.querySelector('.quiz-screen');
const resultScreen = document.querySelector('.result-screen');

// Game state
let currentQuestion = 0;
let score = 0;
let timer;
let timeLeft = 30;
let selectedOption = null;
let userAnswers = new Array(questions.length).fill(null);
let highScores = JSON.parse(localStorage.getItem('quizHighScores')) || [];

// Start the quiz
startBtn.addEventListener('click', startQuiz);
restartBtn.addEventListener('click', restartQuiz);

// Navigation buttons
prevBtn.addEventListener('click', () => navigateQuestion(-1));
nextBtn.addEventListener('click', () => navigateQuestion(1));

function startQuiz() {
    welcomeScreen.style.display = 'none';
    quizScreen.style.display = 'block';
    currentQuestion = 0;
    score = 0;
    scoreElement.textContent = score;
    userAnswers.fill(null);
    loadQuestion();
    startTimer();
}

function restartQuiz() {
    resultScreen.style.display = 'none';
    quizScreen.style.display = 'block';
    currentQuestion = 0;
    score = 0;
    scoreElement.textContent = score;
    userAnswers.fill(null);
    loadQuestion();
    startTimer();
}

function loadQuestion() {
    clearInterval(timer);
    const question = questions[currentQuestion];
    questionText.textContent = question.question;
    currentQuestionElement.textContent = currentQuestion + 1;
    
    // Clear options container
    optionsContainer.innerHTML = '';
    
    // Add options
    question.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.classList.add('option');
        optionElement.textContent = option;
        
        // If user has already answered this question
        if (userAnswers[currentQuestion] === index) {
            optionElement.classList.add('selected');
            selectedOption = index;
            
            // Show if correct or incorrect
            if (index === question.answer) {
                optionElement.classList.add('correct');
            } else {
                optionElement.classList.add('incorrect');
            }
        }
        
        optionElement.addEventListener('click', () => selectOption(index));
        optionsContainer.appendChild(optionElement);
    });
    
    // Update navigation buttons
    prevBtn.disabled = currentQuestion === 0;
    
    // Reset timer
    timeLeft = 30;
    timeElement.textContent = timeLeft;
    startTimer();
    
    // Clear feedback
    feedbackElement.textContent = '';
    feedbackElement.className = 'question-feedback';
}

function selectOption(index) {
    // If already answered this question, don't allow changing answer
    if (userAnswers[currentQuestion] !== null) return;
    
    const options = document.querySelectorAll('.option');
    options.forEach(option => option.classList.remove('selected'));
    
    options[index].classList.add('selected');
    selectedOption = index;
    
    // Check if answer is correct
    const question = questions[currentQuestion];
    if (index === question.answer) {
        score += 10;
        scoreElement.textContent = score;
        options[index].classList.add('correct');
        feedbackElement.textContent = 'Correct!';
        feedbackElement.classList.add('correct-feedback');
    } else {
        options[index].classList.add('incorrect');
        // Also show the correct answer
        options[question.answer].classList.add('correct');
        feedbackElement.textContent = 'Incorrect!';
        feedbackElement.classList.add('incorrect-feedback');
    }
    
    // Store user's answer
    userAnswers[currentQuestion] = index;
    
    // Stop timer
    clearInterval(timer);
    
    // Auto move to next question after a delay
    setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
            navigateQuestion(1);
        } else {
            endQuiz();
        }
    }, 1500);
}

function navigateQuestion(direction) {
    currentQuestion += direction;
    loadQuestion();
}

function startTimer() {
    clearInterval(timer);
    timeLeft = 30;
    timeElement.textContent = timeLeft;
    
    timer = setInterval(() => {
        timeLeft--;
        timeElement.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            // Auto move to next question if time runs out
            if (currentQuestion < questions.length - 1) {
                navigateQuestion(1);
            } else {
                endQuiz();
            }
        }
    }, 1000);
}

function endQuiz() {
    clearInterval(timer);
    quizScreen.style.display = 'none';
    resultScreen.style.display = 'block';
    
    finalScoreElement.textContent = score;
    
    // Add to high scores
    highScores.push(score);
    highScores.sort((a, b) => b - a);
    highScores = highScores.slice(0, 5); // Keep only top 5
    
    // Save to local storage
    localStorage.setItem('quizHighScores', JSON.stringify(highScores));
    
    // Display high scores
    highScoreList.innerHTML = '';
    highScores.forEach((highScore, index) => {
        const li = document.createElement('li');
        li.innerHTML = `<span>#${index + 1}</span> <span>${highScore} points</span>`;
        highScoreList.appendChild(li);
    });
}
