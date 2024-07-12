from django.http import JsonResponse
from django.shortcuts import redirect, render
from .game_logic import PigGame


def index(request):
    """
    Renders the index.html template.

    Parameters:
    - request: The HTTP request object.

    Returns:
    - A rendered HTML response.
    """
    return render(request, 'index.html')


def pig_human_view(request):
    """
    Renders the 'pig.html' template and initializes a new game session.

    Parameters:
    - request: The HTTP request object.

    Returns:
    - A rendered HTML response
    """

    if 'game' not in request.session:
        request.session['game'] = PigGame().to_dict()

    return render(request, 'pig.html')


def pig_cpu_view(request):
    """
    Renders the 'pig.html' template and initializes a new game session with vs_cpu-flag turned on.

    Parameters:
    - request: The HTTP request object.

    Returns:
    - A rendered HTML response
    """

    if 'game' not in request.session:
        request.session['game'] = PigGame().to_dict()

    game = PigGame.from_dict(request.session['game'])
    game.vs_cpu = True
    request.session['game'] = game.to_dict()

    return render(request, 'pig.html')


def reset(request):
    """
    Resets the game session and redirects the user to index-page.

    Args:
        request (HttpRequest): The HTTP request object.

    Returns:
        JsonResponse: A JSON response indicating the status of the reset operation.
        - If the game session exists and is deleted, response will have a 'status' of 'success'.
        - If the game session does not exist, the response will have a 'status' of 'error'.
    """

    if 'game' in request.session:
        del request.session['game']
        return JsonResponse({'status': 'success'})

    return JsonResponse({'status': 'error'})


def restart(request):
    """
    Restarts the Pig Dice Game.

    Args:
        request (HttpRequest): The HTTP request object.

    Returns:
    - JsonResponse: A JSON response containing the games status restarted.
    """

    if 'game' in request.session:
        game = PigGame.from_dict(request.session['game'])
    else:
        print('No game session!')
        return JsonResponse({'status': 'error, no game session found!'})

    game.restart()
    request.session['game'] = game.to_dict()

    response = {
        'status': 'success',
        'scores': game.scores,
        'current_score': game.current_score,
        'current_turn': game.current_turn,
        'vs_cpu': game.vs_cpu
    }

    return JsonResponse(response)


def roll_dice(request):
    """
    Rolls the dice for the Pig Dice Game.

    Args:
        request (HttpRequest): The HTTP request object.

    Returns:
    - JsonResponse: Response containing the status, roll amount, current score, and current turn.
    - Important to note that the current turn informs which player will play next.
    """

    if 'game' in request.session:
        game = PigGame.from_dict(request.session['game'])
    else:
        print('No game session!')
        return JsonResponse({'status': 'error, no game session found!'})

    if game.current_turn == 0 or game.current_turn == 1 and not game.vs_cpu:
        dice_roll = game.roll_dice()
    else:
        # CPU player's turn, this method includes rolling the dice and making a move
        message, dice_roll = game.cpu_move()

        print('CPU move:', message, dice_roll)

        if message in ['target score reached, holding', 'winning score reached, holding']:

            request.session['game'] = game.to_dict()

            response = {
                'status': 'success',
                'roll': dice_roll,
                'current_score': game.current_score,
                'current_turn': game.current_turn,
                'message': True,
                'vs_cpu': game.vs_cpu
            }

            return JsonResponse(response)

    request.session['game'] = game.to_dict()

    response = {
        'status': 'success',
        'roll': dice_roll,
        'current_score': game.current_score,
        'current_turn': game.current_turn,
        'vs_cpu': game.vs_cpu
    }

    return JsonResponse(response)


def hold(request):
    """
    Handles the hold action in the Pig Dice Game.

    Args:
        request (HttpRequest): The HTTP request object.

    Returns:
    - JsonResponse: A JSON response containing the game status, scores, and current turn.
    """

    if 'game' in request.session:
        game = PigGame.from_dict(request.session['game'])
    else:
        print('No game session!')
        return JsonResponse({'status': 'error, no game session found!'})

    game.hold()
    request.session['game'] = game.to_dict()

    # Toggle the current turn to switch to the next player
    # After the current player has held their score
    game.current_turn = 1 if game.current_turn == 0 else 0

    response = {
        'status': 'success',
        'scores': game.scores,
        'current_turn': game.current_turn,
        'vs_cpu': game.vs_cpu
    }

    return JsonResponse(response)
