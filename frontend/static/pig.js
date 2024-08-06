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
const helpButton = document.getElementById('helpButton');
const helpModal = document.getElementById('helpModal');

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

            showDiceRollVisual(data.current_turn, roll);
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
 * Helper function to create and animate an element that fades out and moves to a new position.
 */
function createAndAnimateElement(parentDiv, textContent, startPos, endPos, color) {
    const el = document.createElement('div');
    el.textContent = textContent;
    el.style.position = 'absolute';
    el.style[startPos.direction] = startPos.value;
    el.style.left = '50%';
    el.style.transform = 'translateX(-50%)';
    el.style.fontSize = '2.5rem';
    el.style.color = color;
    el.style.opacity = '1';
    el.style.transition = 'opacity 0.5s ease, ' + startPos.direction + ' 0.5s ease';

    parentDiv.appendChild(el);

    // Fade out the element
    setTimeout(() => {
        el.style.opacity = '0';
        el.style[startPos.direction] = endPos.value;
        setTimeout(() => el.remove(), 500);
    }, 500);
}

/**
 * Shows the rolled dice number as a quickly fading number.
 */
function showDiceRollVisual(player_turn, rolled_number) {
    if (rolled_number === 1) {
        // Change the player turn if the rolled number is 1 to display the effect above the correct player
        const otherPlayerDiv = document.getElementById(`player${player_turn === 0 ? 1 : 0}`);
        createAndAnimateElement(otherPlayerDiv, '-1', {direction: 'bottom', value: '-60px'}, {value: '-80px'}, 'red');
    } else {
        const playerDiv = document.getElementById(`player${player_turn}`);
        createAndAnimateElement(playerDiv, `+${rolled_number}`, {direction: 'top', value: '-60px'}, {value: '-80px'}, 'green');
    }
}

/**
 * Shows the held score number as a quickly fading number.
 */
function showHeldScoreVisual(player_turn, held_number) {
    const playerDiv = document.getElementById(`player${player_turn}`);

    // Create the element to display the score being added
    const scoreEl = document.createElement('div');
    scoreEl.textContent = `+${held_number}`;
    scoreEl.style.position = 'absolute';
    scoreEl.style.top = '88px';
    scoreEl.style.fontSize = '2.5rem';
    scoreEl.style.color = 'green';
    scoreEl.style.opacity = '1';

    // Set initial and final positions based on player turn
    if (player_turn === 0) {
        scoreEl.style.transition = 'opacity 1s ease, left 1s ease';
        scoreEl.style.left = '65%';
        scoreEl.style.transform = 'translateX(10px)';
        setTimeout(() => {
            scoreEl.style.opacity = '0';
            scoreEl.style.left = '50%';
            scoreEl.style.transform = 'translateX(-50%)';
            setTimeout(() => {
                scoreEl.remove();
            }, 1000);
        }, 1000);
    } else {
        scoreEl.style.transition = 'opacity 1s ease, right 1s ease';
        scoreEl.style.right = '65%';
        scoreEl.style.transform = 'translateX(-10px)';
        setTimeout(() => {
            scoreEl.style.opacity = '0';
            scoreEl.style.right = '50%';
            scoreEl.style.transform = 'translateX(50%)';
            setTimeout(() => {
                scoreEl.remove();
            }, 1000);
        }, 1000);
    }

    playerDiv.appendChild(scoreEl);
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

            showHeldScoreVisual(data.current_turn, parseInt(playerCurrentScoreEl.innerText.split(':')[1].trim()));

            if (totalScore >= 100) {
                const winnerEl = document.getElementById(`player${data.current_turn}`);
                const loserEl = document.getElementById(`player${data.current_turn === 0 ? 1 : 0}`);
                playerCurrentScoreEl.innerText = 'Current Score: 0';
                playerTotalScoreEl.innerText = `${totalScore}`;
                winnerEl.classList.add('winner');
                loserEl.classList.add('loser');
                winnerEl.appendChild(document.createTextNode('🎉 Winner! 🎉'));
                loserEl.appendChild(document.createTextNode('😡 Loser! 😡'));
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
            player0NameEl.classList.remove('loser');
            player1NameEl.classList.remove('loser');

            if (player0NameEl.lastChild.textContent === '🎉 Winner! 🎉' ||
                player0NameEl.lastChild.textContent === '😡 Loser! 😡') {
                player0NameEl.removeChild(player0NameEl.lastChild);
            }

            if (player1NameEl.lastChild.textContent === '🎉 Winner! 🎉' ||
                player1NameEl.lastChild.textContent === '😡 Loser! 😡') {
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

/**
 * Event listeners for the help-button hover effect, controlling the modal.
 */
helpButton.addEventListener('mouseenter', () => {
    helpModal.style.display = 'block';
});

helpButton.addEventListener('mouseleave', () => {
    // Set a timeout to ensure user has moved to the modal
    setTimeout(() => {
        if (!helpModal.matches(':hover')) {
            helpModal.style.display = 'none';
        }
    }, 200);
});

helpModal.addEventListener('mouseleave', () => {
    helpModal.style.display = 'none';
});