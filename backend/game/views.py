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


def pig_view(request):
    """
    Renders the 'pig.html' template and initializes a new game session.

    Parameters:
    - request: The HTTP request object.

    Returns:
    - A rendered HTML response
    """

    if 'game' not in request.session:
        request.session['game'] = PigGame().to_dict()
        print(request.session['game'])

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

    dice_roll = game.roll_dice()
    request.session['game'] = game.to_dict()

    response = {
        'status': 'success',
        'roll': dice_roll,
        'current_score': game.current_score,
        'current_turn': game.current_turn
    }

    return JsonResponse(response)
