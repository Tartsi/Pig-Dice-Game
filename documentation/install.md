# Instructions

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
