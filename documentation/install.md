# Instructions for local usage

### Install:

Clone the project "git clone https://github.com/Tartsi/Pig-Dice-Game"

Install Poetry dependencies

```bash
poetry install --no-root
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

Note: Use python or python3 depending on your operating system. On Windows, python is typically correct, while on macOS/Linux, you may need to use python3.

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

Now you can use the application locally!

### Usage

- Select whether you want to play against a Human player or a CPU-opponent.
- Game rules are mentioned above.
- Have fun!
