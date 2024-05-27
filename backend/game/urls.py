from django.urls import path
from .views import index, pig_view, reset

urlpatterns = [
    path('', index, name='index'),
    path('pig', pig_view, name='pig_view'),
    path('reset/', reset, name='reset')
]
