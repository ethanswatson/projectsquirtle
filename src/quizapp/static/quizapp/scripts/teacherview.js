// Dummy data. Will be replaced with data from websockets
// let quiz = {
//     quizName: 'Dummy Quiz',
//     questions: [
//         {
//             questionText: 'A Fake Question',
//             answers: [
//                 {
//                     id: 1,
//                     text:'Option 1'
//                 },
//                 {
//                     id: 2,
//                     text: 'Option 2'
//                 },
//                 {
//                     id: 3,
//                     text: 'Option 3'
//                 },
//                 {
//                     id: 4,
//                     text: 'Option 4'
//                 },
//                 {
//                     id: 5,
//                     text: 'Option 5'
//                 },
//                 {
//                     id: 6,
//                     text: 'Option 6'
//                 },
//             ]
//         }
//     ]
// }

// let users = ['user a', 'user b', 'user c', 'user d', 'user e', 'user f', 'user g', 'user h', 'user i', 'user j']

let sessionId;

let chatSocket;

let voteData;

let curMessage;
let nextMessage;

let connectToSocket = function (roomName) {
    sessionId = roomName;
    chatSocket = new WebSocket(
        'ws://' + window.location.host +
        '/ws/quizapp/host/' + roomName + '/');

    chatSocket.onmessage = function(e) {
        var data = JSON.parse(e.data);
        var message = data['message'];
        var msgType = data['msgType'];
        if (msgType=='msgJoin') {
            landingAddUser(message['userName']);
        } else if(msgType=='msgVote') {
            console.log(message['answerID']); //Testing to see if answerID comes through
            incrementVote(message['answerID']-1); //database values start at 1 instead of 0
        } else if(msgType == 'msgQuestion') {
            curMessage = message;
            renderQuestion(message);
        } else if(msgType == 'msgAnswerResults') { // Answer results
            renderQueResults(message);
        } else if(msgType == 'msgResults') { // Final results
            renderFinalPage(message);
        }
    };
        
    chatSocket.onclose = function(e) {
        console.error('Chat socket closed unexpectedly');
    };
};

function clearPage() {
    let main = document.querySelector('main');
    main.innerHTML = '';
}

function landingAddUser(username) {
    let userSection = document.querySelector('.user-section');
    let userText = document.createElement('p');
    userText.setAttribute('class', 'user-name-text');
    userText.textContent = username;
    userSection.appendChild(userText);
    
}

function setNextState() {
    chatSocket.send(JSON.stringify({
        'message': '',
        'msgType': 'msgNext'
    }));
}

function renderLanding(quizNameText) {
    clearPage();
    document.title = quizNameText;
    let main = document.querySelector('main');
    let quizNameSection = document.createElement('section');
    quizNameSection.setAttribute('class', 'quiz-name-section');
    let quizName = document.createElement('p');
    quizName.setAttribute('class', 'quiz-name-text');
    quizName.textContent = quizNameText;
    quizNameSection.appendChild(quizName);
    let sessionIdText = document.createElement('p');
    sessionIdText.setAttribute('class', 'session-id-text');
    sessionIdText.textContent = 'Session ID: ' + sessionId;
    quizNameSection.appendChild(sessionIdText);
    let startButton = document.createElement('button');
    startButton.setAttribute('class', 'start-quiz-btn');
    startButton.textContent = 'Start Quiz';
    startButton.onclick = setNextState;
    quizNameSection.appendChild(startButton);
    main.appendChild(quizNameSection);
    let userSection = document.createElement('section');
    userSection.setAttribute('class', 'user-section');
    main.appendChild(userSection);
    for (let i = 0; i < users.length; i++) {
        let username = users[i];
        landingAddUser(username);
    }
}

function renderQuestion(question) {
    clearPage();
    console.log(question);
    document.title = 'Question';
    let main = document.querySelector('main');
    let questionTextSection = document.createElement('section');
    let questionText = document.createElement('p');
    questionText.setAttribute('class', 'question-text');
    questionText.textContent = question.questionText;
    questionTextSection.appendChild(questionText);
    main.appendChild(questionTextSection);
    let answerSection = document.createElement('section');
    answerSection.setAttribute('class', 'answer-section');
    let labels = ['A','B','C','D','E','F'];
    let newData = [];
    for (let i = 0; i < question.answers.length && i < labels.length; i++) {
        newData.push(0);
        let answer = question.answers[i];
        let label = labels[i];
        let answerBox = document.createElement('div');
        answerBox.setAttribute('class', 'answer-box');
        answerBox.setAttribute('value', label);
        let answerText = document.createElement('p');
        answerText.textContent = label + ': ' + answer.text;
        answerBox.appendChild(answerText);
        answerSection.appendChild(answerBox);
    }
    voteData = newData;
    main.appendChild(answerSection);
    createResultsButton();
}

function renderQueResults(message) {
    clearPage();
    console.log(message);
    document.title = 'Question Results';
    let main = document.querySelector('main');
    let questionTextSection = document.createElement('section');
    let questionText = document.createElement('p');
    questionText.setAttribute('class', 'question-text');
    questionText.textContent = message.questionText;
    questionTextSection.appendChild(questionText);
    main.appendChild(questionTextSection);
    let answerSection = document.createElement('section');
    answerSection.setAttribute('class', 'answer-section');
    let labels = ['A','B','C','D','E','F'];
    for (let i = 0; i < message.votes.length && i < labels.length; i++) {
        let vote  = message.votes[i];
        let label = labels[i];
        let answerBox = document.createElement('div');
        answerBox.setAttribute('class', 'answer-box');
        answerBox.setAttribute('value', label);
        let answerText = document.createElement('p');
        answerText.textContent = label + ': ' + vote.answerText + ': ' + vote.votes;
        answerBox.appendChild(answerText);
        answerSection.appendChild(answerBox);
    }
    main.appendChild(answerSection);
    createNextQueButton();
}

function renderFinalPage(question) {
    clearPage();
    console.log(question);
    document.title = 'Quiz Results';
    let main = document.querySelector('main');
    let questionTextSection = document.createElement('section');
    let questionText = document.createElement('p');
    questionText.setAttribute('class', 'question-text');
    questionText.textContent = 'Quiz Results';
    questionTextSection.appendChild(questionText);
    main.appendChild(questionTextSection);

    if (question.quizEnd == false) {
        createNextQueButton();
    }
    else {
        createEndQuizText();
    }
}

function createNextQueButton() {
    let main = document.querySelector('main');
    let nextSection = document.createElement('section');
    nextSection.setAttribute('class', 'answer-section');

    let nextBox = document.createElement('div');
    nextBox.setAttribute('class', 'answer-button');
    nextBox.setAttribute('style', 'width: 10%; padding: 20px;');
    let nextText = document.createElement('p');
    nextText.textContent = "Next Question";
    nextBox.appendChild(nextText);
    nextSection.appendChild(nextBox);
    main.appendChild(nextSection);

    nextBox.onclick = function () {
        setNextState();
    }
}

function createEndQuizText() {
    let main = document.querySelector('main');
    let nextSection = document.createElement('section');
    nextSection.setAttribute('class', 'answer-section');

    let nextBox = document.createElement('div');
    nextBox.setAttribute('class', 'answer-button');
    nextBox.setAttribute('style', 'width: 10%; padding: 20px;');
    let nextText = document.createElement('p');
    nextText.textContent = "Quiz has ended!";
    nextBox.appendChild(nextText);
    nextSection.appendChild(nextBox);
    main.appendChild(nextSection);
}

function createResultsButton() {
    let main = document.querySelector('main');
    let nextSection = document.createElement('section');
    nextSection.setAttribute('class', 'answer-section');

    let nextBox = document.createElement('div');
    nextBox.setAttribute('class', 'answer-button');
    nextBox.setAttribute('style', 'width: 10%; padding: 20px;');
    let nextText = document.createElement('p');
    nextText.textContent = "Go To Results";
    nextBox.appendChild(nextText);
    nextSection.appendChild(nextBox);
    main.appendChild(nextSection);

    nextBox.onclick = function () {
        console.log("Function entered");
        //sendQueResults();
        setNextState();
    }
}

function incrementVote( voteID ) {
    voteData[voteID] += 1;
}
