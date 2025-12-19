"""
Authentication views - handles login, logout, and landing page.
"""
from django.shortcuts import render, redirect
from django.contrib.auth import login as auth_login, logout as auth_logout
from django.contrib import messages
from ..services import auth_service
from ..services.repositories import DjangoUserRepository
from ..services.auth_strategies import PasswordStrategy
from ..services.auth_service import AuthService


def inicio(request):
    """Landing page: public and minimal."""
    return render(request, 'paginas/inicio.html')


def login(request):
    """
    Authenticate and log the user in.
    
    Authentication logic is delegated to auth_service for easier
    testing and separation of concerns.
    """
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        # Use the new AuthService (DIP + Strategy). Keep compatibility fallback
        # via `auth_service.authenticate_user` is still available project-wide.
        repo = DjangoUserRepository()
        strategy = PasswordStrategy()
        service = AuthService(repo, strategy)
        user = service.authenticate(request, {'username': username, 'password': password})
        
        if user is not None:
            auth_login(request, user)
            # Redirect based on user role
            if hasattr(user, 'profile'):
                if user.profile.is_admin:
                    return redirect('admin_dashboard')
                elif user.profile.is_preparador:
                    return redirect('preparador_dashboard')
                else:
                    return redirect('operario_dashboard')
            return redirect('index')
        
        messages.error(request, 'Usuario o contraseña inválidos')
        return redirect('login')

    return render(request, 'paginas/login.html')


def logout(request):
    """Log out the current user and redirect to the public landing page."""
    auth_logout(request)
    return redirect('inicio')
