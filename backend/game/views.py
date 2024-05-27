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
    - A rendered HTML response along.

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
