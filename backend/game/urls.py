from django.urls import path
from .views import index, pig_cpu_view, pig_human_view, reset, roll_dice, hold, restart

urlpatterns = [
    path('', index, name='index'),
    path('pig/human', pig_human_view, name='pig_human_view'),
    path('pig/cpu', pig_cpu_view, name='pig_cpu_view'),
    path('reset/', reset, name='reset'),
    path('roll/', roll_dice, name='roll_dice'),
    path('hold/', hold, name='hold'),
    path('restart/', restart, name='restart')
]
