'use strict';


// Elements
const player0NameEl = document.getElementById('player0');
const player1NameEl = document.getElementById('player1');
const totalScore0El = document.getElementById('score--0');
const totalScore1El = document.getElementById('score--1');
const currentScore0El = document.getElementById('current-score--0');
const currentScore1El = document.getElementById('current-score--1');

/**
 * Rolls the dice and updates the game state based on the result.
 */
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

            // If it is the computer's turn, add 2 seconds delay on computer dice rolls
            // TODO: FIX CPU MOVE
            if (data.current_turn === 1 || player1NameEl.classList.contains('active')) {
                setTimeout(rollDice(), 2000);
                console.log('Computer rolled a ' + roll);
            }
        }
    });
};

/**
 * Sends a request to the server to hold the current score and updates the game state accordingly.
 */
const hold = () => {
    fetch('/hold')
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {

            const playerTotalScoreEl = document.getElementById(`score--${data.current_turn}`);
            const totalScore = data.scores[data.current_turn];

            if (totalScore >= 100) {
                const winnerEl = document.getElementById(`player${data.current_turn}`);
                winnerEl.classList.add('winner');
                winnerEl.appendChild(document.createTextNode('🎉 Winner! 🎉'));
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

/**
 * Resets the session by making a fetch request to the '/reset' endpoint and redirecting to the home page if successful.
 */
const resetSession = () => {
    fetch('/reset')
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            window.location.href = '/';
        }
    });
};

/**
 * Changes the turn by toggling the active class on player names and resetting the current scores.
 */
const changeTurn = () => {
    player0NameEl.classList.toggle('active');
    player1NameEl.classList.toggle('active');
    currentScore0El.innerText = 'Current Score: 0';
    currentScore1El.innerText = 'Current Score: 0';
};

/**
 * Restarts the game by making a fetch request to the '/restart' endpoint and updating the game state.
 */
const restartGame = () => {
    fetch('/restart')
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {

            totalScore0El.innerText = '0';
            totalScore1El.innerText = '0';
            currentScore0El.innerText = 'Current Score: 0';
            currentScore1El.innerText = 'Current Score: 0';

            player0NameEl.classList.add('active');
            player1NameEl.classList.remove('active');
            player0NameEl.classList.remove('winner');
            player1NameEl.classList.remove('winner');

            if (player0NameEl.lastChild.textContent === '🎉 Winner! 🎉') {
                player0NameEl.removeChild(player0NameEl.lastChild);
            }

            if (player1NameEl.lastChild.textContent === '🎉 Winner! 🎉') {
                player1NameEl.removeChild(player1NameEl.lastChild);
            }

            document.getElementById('dice-pic').src = '/static/assets/dice-1.png';

        }
    });
};
