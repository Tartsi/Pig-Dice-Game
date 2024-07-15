# Pig Dice Game

[![CI](https://github.com/Tartsi/Pig-Dice-Game/actions/workflows/main.yml/badge.svg)](https://github.com/Tartsi/Pig-Dice-Game/actions/workflows/main.yml)

### Requirements Definition for the project:

- User can roll a normal 1-6 dice.
  - Users roll will be added to current points. These points are reset if the user rolls 1, and the turn changes. 

- User can hold a turn and receive current points gathered in the turn, which are then added to total points.

- First player to reach 100 points or over wins the game!

- This project will have a backend using Python (Django), with the frontend developed using HTML, CSS and JavaScript.

- The game has the option of playing vs CPU or vs a human player (locally).

### Install:

Clone the project "git clone https://github.com/Tartsi/Pig-Dice-Game"

Install Poetry dependencies

```bash
poetry install
```

Enter poetry shell

```bash
poetry shell
```
### Setup:

On your terminal, change to folder named 'backend'

```bash
cd .\backend\
```

Run migrations

```bash
python/python3 manage.py makemigrations
then
python/python3 manage.py migrate
```

Run the server

```bash
python/python3 manage.py runserver
```

Now you can use the application!

### Usage

- Select whether you want to play against a Human player or a CPU-opponent.
- Game rules are mentioned above.
- Have fun!
