# Requirements Definition for the project:

### Game Setup

- The game shall provide option to play against a CPU opponent or another human player locally.
- The user shall be able to start a new game from the index-page or restart the current game during gameplay.

### User Interface

- The game shall have a graphical user interface (GUI) with the following - elements:
  - Display of current player’s name, roll result, turn points (current score), and total accumulated points.
  - Buttons for "Roll", "Hold", "Quit" and "Restart".
  - Display of opponent’s total points.
  - The user shall receive visual feedback for actions (e.g., dice roll result, - score updates).
  - The interface shall indicate the current player's turn.

### Game Mechanics

- The game shall simulate rolling a six-sided die.
- The game shall automatically handle turn transitions and score calculations.
- The game shall provide an option to restart the game anytime during gameplay.

### AI Behavior

- The game shall include a CPU opponent with a predefined strategy when deciding moves.
  - This predefined strategy is determined to be the best possible strategy against 'optimal play', thus proving a similar challenge for more experienced players and newcomers alike.

#### Conclusion

This requirements definition outlines the essential features and functionalities for developing a small-scale, web-based Pig Dice Game that is engaging and fun to play. The use of Python (Django) for the backend and HTML, CSS, and JavaScript for the frontend will provide a solid foundation for building and maintaining the game.
