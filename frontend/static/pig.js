'use strict';

// Elements
const player0NameEl = document.getElementById('player0');
const player1NameEl = document.getElementById('player1');
const totalScore0El = document.getElementById('score--0');
const totalScore1El = document.getElementById('score--1');
const currentScore0El = document.getElementById('current-score--0');
const currentScore1El = document.getElementById('current-score--1');
const rollButton = document.querySelector('.btn.roll');
const holdButton = document.querySelector('.btn.hold');
const restartButton = document.querySelector('.btn.restart');

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
                changeTurn(data.vs_cpu);
            }

            showRollBonus(data.current_turn, roll);
            playerCurrentScoreEl.innerText = `Current Score: ${currentScore}`;
            document.getElementById('dice-pic').src = `/static/assets/dice-${roll}.png`;

            // If it is the computer's turn, add delay on computer dice rolls
            if (data.vs_cpu) {
                if (data.current_turn === 1 || player1NameEl.classList.contains('active')) {
                    disableButtons(data.vs_cpu);

                    if (data.message) {
                        setTimeout(hold, 2000);
                        return;
                    }

                    setTimeout(rollDice, 2000);
                } else {
                    enableButtons();
                }
            }
        }
    });
};

/**
 * Shows the rolled dice number as a quickly fading number.
 */
function showRollBonus(player_turn, rolled_number) {

    if (rolled_number === 1) {

        // Change the player turn if the rolled number is 1 to display the effect above the correct player
        const otherPlayerDiv = document.getElementById(`player${player_turn === 0 ? 1 : 0}`);

        const oneEl = document.createElement('div');
        oneEl.textContent = '-1';
        oneEl.style.position = 'absolute';
        oneEl.style.bottom = '-60px';
        oneEl.style.left = '50%';
        oneEl.style.transform = 'translateX(-50%)';
        oneEl.style.fontSize = '2.5rem';
        oneEl.style.color = 'red';
        oneEl.style.opacity = '1';
        oneEl.style.transition = 'opacity 0.5s ease, bottom 0.5s ease';

        otherPlayerDiv.appendChild(oneEl);

        // Fade out the one element
        setTimeout(() => {
            oneEl.style.opacity = '0';
            oneEl.style.bottom = '-80px';
            setTimeout(() => oneEl.remove(), 500);
        }, 500);

        return;
    }

    const playerDiv = document.getElementById(`player${player_turn}`);
    const bonusEl = document.createElement('div');
    bonusEl.textContent = `+${rolled_number}`;
    bonusEl.style.position = 'absolute';
    bonusEl.style.top = '-60px';
    bonusEl.style.left = '50%';
    bonusEl.style.transform = 'translateX(-50%)';
    bonusEl.style.fontSize = '2.5rem';
    bonusEl.style.color = 'green';
    bonusEl.style.opacity = '1';
    bonusEl.style.transition = 'opacity 0.5s ease, top 0.5s ease';

    playerDiv.appendChild(bonusEl);

    // Fade out the bonus element
    setTimeout(() => {
        bonusEl.style.opacity = '0';
        bonusEl.style.top = '-80px';
        setTimeout(() => bonusEl.remove(), 500);
    }, 500);
}

/**
 * Sends a request to the server to hold the current score and updates the game state accordingly.
 */
const hold = () => {
    fetch('/hold')
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {

            const playerTotalScoreEl = document.getElementById(`score--${data.current_turn}`);
            const playerCurrentScoreEl = document.getElementById(`current-score--${data.current_turn}`);
            const totalScore = data.scores[data.current_turn];

            if (totalScore >= 100) {
                const winnerEl = document.getElementById(`player${data.current_turn}`);
                playerCurrentScoreEl.innerText = 'Current Score: 0';
                playerTotalScoreEl.innerText = `${totalScore}`;
                winnerEl.classList.add('winner');
                winnerEl.appendChild(document.createTextNode('🎉 Winner! 🎉'));
                player0NameEl.classList.remove('active');
                player1NameEl.classList.remove('active');
                document.getElementById('dice-pic').src = '/static/assets/dice-1.png';
                disableButtons(false);
                restartButton.disabled = false;
                restartButton.classList.remove('disabled');
                return;
            } else {
                playerTotalScoreEl.innerText = `${totalScore}`;
                changeTurn(data.vs_cpu);

                if (data.vs_cpu && player1NameEl.classList.contains('active')) {
                    setTimeout(rollDice, 2000);
                }
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
const changeTurn = (cpu) => {
    player0NameEl.classList.toggle('active');
    player1NameEl.classList.toggle('active');
    currentScore0El.innerText = 'Current Score: 0';
    currentScore1El.innerText = 'Current Score: 0';

    if (cpu && player1NameEl.classList.contains('active')) {
        disableButtons(cpu);
    } else {
        enableButtons();
    }
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
            enableButtons();
        }
    });
};

/**
 * Disables the roll, hold, and restart buttons with a visual cue.
 */
const disableButtons = (cpu) => {
    rollButton.disabled = true;
    holdButton.disabled = true;

    if (cpu) {
        restartButton.disabled = true;
        restartButton.classList.add('disabled');
    }

    rollButton.classList.add('disabled');
    holdButton.classList.add('disabled');
};

/**
 * Enables the roll, hold, and restart buttons.
 */
const enableButtons = () => {
    rollButton.disabled = false;
    holdButton.disabled = false;
    restartButton.disabled = false;

    rollButton.classList.remove('disabled');
    holdButton.classList.remove('disabled');
    restartButton.classList.remove('disabled');
};
