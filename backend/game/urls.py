from django.urls import path
from .views import index, pig_view, reset, roll_dice, hold, restart

urlpatterns = [
    path('', index, name='index'),
    path('pig', pig_view, name='pig_view'),
    path('reset/', reset, name='reset'),
    path('roll/', roll_dice, name='roll_dice'),
    path('hold/', hold, name='hold'),
    path('restart/', restart, name='restart')
]
