from django.shortcuts import render

from .game_logic import PigGame

# Create your views here.


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
    Renders the 'pig.html' template.

    Parameters:
    - request: The HTTP request object.

    Returns:
    - A rendered HTML response.

    """
    return render(request, 'pig.html')
