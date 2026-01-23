
from django.urls import path
from .views import api_views, materia_api_views

urlpatterns = [
    # Auth
    path('auth/csrf/', api_views.csrf_api, name='csrf_api'),
    path('auth/login/', api_views.login_api, name='login_api'),
    path('auth/logout/', api_views.logout_api, name='logout_api'),
    path('auth/user/', api_views.user_api, name='user_api'),
    # Materias
    path('materias/', materia_api_views.list_materias_api, name='list_materias_api'),
    path('materias/create/', materia_api_views.create_materia_api, name='create_materia_api'),
    path('materias/<int:materia_id>/', materia_api_views.detail_materia_api, name='detail_materia_api'),
]
