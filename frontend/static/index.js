'use strict';

// Handles the dice-animation on the homepage
document.addEventListener('DOMContentLoaded', function() {
    const dice = document.getElementById('dice');

    // Start the dice animation
    dice.classList.remove('hidden');

    // Hide the dice after 3 second (the duration of the animation)
    // setTimeout(function() {
    //     dice.classList.add('hidden');
    // }, 3000);
});
