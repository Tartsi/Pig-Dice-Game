'use strict';

const player0NameEl = document.getElementById('player0');
const player1NameEl = document.getElementById('player1');
const currentScore0El = document.getElementById('current-score--0');
const currentScore1El = document.getElementById('current-score--1');

const rollDice = () => {
    fetch('/roll')
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {

            const playerCurrentScoreEl = document.getElementById(`current-score--${data.current_turn}`);
            const roll = Number(data.roll);
            let currentScore = parseInt(playerCurrentScoreEl.innerText.split(':')[1].trim());

            currentScore += roll;

            if (roll === 1) {
                currentScore = 0;
                changeTurn();
            }

            playerCurrentScoreEl.innerText = `Current Score: ${currentScore}`;
            document.getElementById('dice-pic').src = `/static/assets/dice-${roll}.png`;
        }
    });
};

const hold = () => {
    fetch('/hold')
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {

            const playerTotalScoreEl = document.getElementById(`score--${data.current_turn}`);
            const totalScore = data.scores[data.current_turn];

            if (totalScore >= 100) {
                const winnerEl = document.getElementById(`player${data.current_turn}`);
                winnerEl.appendChild(document.createElement('br'));
                winnerEl.appendChild(document.createTextNode('Winner!'));
                winnerEl.classList.add('winner');
                player0NameEl.classList.remove('active');
                player1NameEl.classList.remove('active');
                document.getElementById('dice-pic').src = '/static/assets/dice-1.png';
            } else {
                playerTotalScoreEl.innerText = `${totalScore}`;
                changeTurn();
            }
        }
    });
};

const resetSession = () => {
    fetch('/reset')
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            window.location.href = '/';
        }
    });
};

const changeTurn = () => {
    player0NameEl.classList.toggle('active');
    player1NameEl.classList.toggle('active');
    currentScore0El.innerText = 'Current Score: 0';
    currentScore1El.innerText = 'Current Score: 0';
};