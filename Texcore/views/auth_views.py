"""
Authentication views - handles login, logout, and landing page.
"""
from django.shortcuts import render, redirect
from django.contrib.auth import login as auth_login, logout as auth_logout
from django.contrib import messages
from ..services import auth_service
from ..services.repositories import DjangoUserRepository
from django.urls import reverse
from ..services.auth_strategies import PasswordStrategy, KeycloakStrategy
from ..security import keycloak_manager
from ..services.auth_service import AuthService


def inicio(request):
    """Landing page: public and minimal."""
    return render(request, 'paginas/inicio.html')


def get_dashboard_redirect(user):
    """Determina la URL de redirección basada en el rol del usuario."""
    if hasattr(user, 'profile'):
        if user.profile.is_admin:
            return 'admin_dashboard'
        elif user.profile.is_preparador:
            return 'preparador_dashboard'
        else:
            return 'operario_dashboard'
    return 'index'


def login(request):
    """
    Render the login page which now only contains the Keycloak option.
    """
    # Si el usuario ya está autenticado, enviarlo a su dashboard
    if request.user.is_authenticated:
        return redirect(get_dashboard_redirect(request.user))
        
    return render(request, 'paginas/login.html')


def logout(request):
    """Log out the current user and redirect to Keycloak logout then back home."""
    auth_logout(request)
    # Redirigir a Keycloak para cerrar la sesión global y que no "recuerde" al usuario
    redirect_uri = request.build_absolute_uri(reverse('inicio'))
    return redirect(keycloak_manager.get_logout_url(redirect_uri))

def keycloak_login(request):
    """Redirige al usuario a la página de login de Keycloak."""
    redirect_uri = request.build_absolute_uri(reverse('keycloak_callback'))
    return redirect(keycloak_manager.get_login_url(redirect_uri))

def keycloak_callback(request):
    """Procesa el callback de Keycloak tras el login exitoso."""
    code = request.GET.get('code')
    if not code:
        messages.error(request, 'No se recibió el código de autorización')
        return redirect('login')
    
    redirect_uri = request.build_absolute_uri(reverse('keycloak_callback'))
    
    repo = DjangoUserRepository()
    strategy = KeycloakStrategy()
    service = AuthService(repo, strategy)
    
    user = service.authenticate(request, {'code': code, 'redirect_uri': redirect_uri})
    
    if user:
        auth_login(request, user)
        messages.success(request, f'Bienvenido, {user.username}')
        return redirect(get_dashboard_redirect(user))
    
    messages.error(request, 'Error en la autenticación con Keycloak')
    return redirect('login')
