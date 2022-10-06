const itemsList = document.querySelector('.quiz-container');
const startBtn = document.querySelector('.start-btn');
const checkBtn = document.querySelector('.check-btn');
const resetBtn = document.querySelector('.reset-btn');
const alertInfo = document.querySelector('.alert-container');
const counter = document.querySelector('.score-container');

window.addEventListener('DOMContentLoaded', renderData())

const correctAnswers = [];
const incorrectAnswers = [];
const answers = [];
let mixedAnswers = [];
let choosenAnswers = [];
let quizFinished = false;

async function fetchData() {
    let url = 'https://opentdb.com/api.php?amount=5&type=multiple';
    try {
        let response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.log(error);
    }
}

async function renderData() {
    let fetchedData = await fetchData();
    let dataArray = fetchedData.results;

    let html = '';

    getCorrectAnswers(dataArray);
    getIncorrectAnswers(dataArray);
    addAnswers(correctAnswers, incorrectAnswers);
    shuffleAnswers(answers);

    // rendering quiz


    startBtn.addEventListener('click', showQuiz)

    function showQuiz() {
        startBtn.classList.add('display-hide');
        checkBtn.classList.add('display-block');

        dataArray.forEach((question, index) => {
            let id = index;
            html = html +
                `<div class="single-question-container" dataset-id=${id}>
            <p class="question">${question.question}</p>
            <div class="answers-container">
                <button class="answer-btn">${mixedAnswers[index][0]}</button>
                <button class="answer-btn">${mixedAnswers[index][1]}</button>
                <button class="answer-btn">${mixedAnswers[index][2]}</button>
                <button class="answer-btn">${mixedAnswers[index][3]}</button>
            </div>
        </div>`
        });
        itemsList.innerHTML = html;

        // only one button clicked 

        const btns = document.querySelectorAll('.answer-btn');
        btns.forEach((btn) => {
            btn.addEventListener('click', onlyOneBtn)
        }
        )
    }
};
// checking answers

checkBtn.addEventListener('click', () => {
    let correctCounter = 0;
    window.scrollTo(0,0);
    let selectedAnswers = document.querySelectorAll('.clicked')
    if (selectedAnswers.length === 5) {
        alertInfo.classList.remove('visibility-show')
        selectedAnswers.forEach((answer, index) => {
            if (answer.innerHTML !== correctAnswers[index]) {
                answer.classList.remove('clicked');
                answer.classList.add('incorrect');
            } else if (answer.innerHTML === correctAnswers[index]) {
                answer.classList.remove('clicked')
                answer.classList.add('correct')
                correctCounter++;
            }
        })
        // show your score
        counter.innerHTML = `Your score is: <b>${correctCounter} correct answers`;
        if(correctCounter <1 ){
            counter.classList.add('score-negative')
        }
        counter.classList.add('visibility-show');
        // change buttons
        checkBtn.classList.remove('display-block');
        resetBtn.classList.add('display-block');
        resetBtn.addEventListener('click', reloadPage);
        quizFinished = !quizFinished;
    } else {
        // alert if not all answers checked
        alertInfo.classList.add('visibility-show');
        setTimeout(() => {
            alertInfo.classList.remove('visibility-show')
        }, 2000);
    }
})

// functions --------------------------------------

function getCorrectAnswers(array) {
    if (array.length > 0) {
        array.map(item => {
            correctAnswers.push(item.correct_answer);
        });
    };
};

function getIncorrectAnswers(array) {
    if (array.length > 0) {
        array.map(item => {
            incorrectAnswers.push(item.incorrect_answers);
        });
    };
};

function addAnswers(correct, incorrect) {
    if (correct.length > 0 && incorrect.length > 0) {
        incorrect.map((item, index) => {
            answers.push(item.concat(correct[index]));
        });
    };
};

function shuffleAnswers(arrays) {
    arrays.map(item => {
        mixedAnswers.push(shuffle(item))
    })
};

function onlyOneBtn(e) {
    if (!quizFinished) {
        let clickedElementBtn = e.currentTarget;

        const parent = e.currentTarget.parentElement.parentElement;

        let elementBtns = parent.querySelectorAll('.answer-btn');

        parent.addEventListener('click', parentOneBtn(elementBtns, clickedElementBtn))
    }
}

function parentOneBtn(elements, clickedElements) {
    elements.forEach((elementBtn) => {
        elementBtn.classList.remove('clicked')
        clickedElements.classList.add('clicked')
    })
}

function reloadPage() {
    window.location.reload();
}

// external functions

function shuffle(array) {
    const newArray = [...array]
    const length = newArray.length

    for (let start = 0; start < length; start++) {
        const randomPosition = Math.floor((newArray.length - start) * Math.random())
        const randomItem = newArray.splice(randomPosition, 1)

        newArray.push(...randomItem)
    }

    return newArray
};