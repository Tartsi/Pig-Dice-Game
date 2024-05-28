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
                player0NameEl.classList.toggle('active');
                player1NameEl.classList.toggle('active');
                currentScore0El.innerText = 'Current Score: 0';
                currentScore1El.innerText = 'Current Score: 0';
            }

            playerCurrentScoreEl.innerText = `Current Score: ${currentScore}`;
            document.getElementById('dice-pic').src = `/static/assets/dice-${roll}.png`;
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
