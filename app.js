const itemsList = document.querySelector('.quiz-container')

window.addEventListener('DOMContentLoaded', renderData())

const correctAnswers = [];
const incorrectAnswers = [];
const answers = [];
let mixedAnswers = [];

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

    dataArray.forEach((question,index) => {
        html = html +
            `<div class="single-question-container">
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
};

// functions

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