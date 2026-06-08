from django.shortcuts import redirect
from django.urls import reverse
import os

class SilentSSOMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # 1. Si el usuario ya está autenticado, continuar
        if request.user.is_authenticated:
            return self.get_response(request)

        # 2. Rutas exentas
        path = request.path
        try:
            exempt_paths = [
                reverse('login'),
                reverse('callback'),
                reverse('logout'),
                '/admin/',
                '/static/',
            ]
        except:
            # Fallback si las URLs no están listas
            exempt_paths = ['/login/', '/callback/', '/logout/', '/admin/', '/static/']
        
        if any(path.startswith(p) for p in exempt_paths):
            return self.get_response(request)

        # 3. Silent SSO: Intentar solo una vez por sesión
        if not request.session.get('sso_checked', False):
            request.session['sso_checked'] = True
            
            # Construir la URL de login
            redirect_uri = request.build_absolute_uri(reverse('callback'))
            
            # Forzar HTTPS en producción (onrender.com)
            if '.onrender.com' in request.get_host():
                redirect_uri = redirect_uri.replace('http://', 'https://')
            
            from .security import keycloak_manager
            # Keycloak detectará la sesión activa y redirigirá de vuelta sin pedir login
            return redirect(keycloak_manager.get_login_url(redirect_uri))

        return self.get_response(request)
