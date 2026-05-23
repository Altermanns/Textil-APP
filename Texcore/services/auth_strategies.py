from abc import ABC, abstractmethod
import json
from typing import Optional, Dict
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from ..security import keycloak_manager


class AuthStrategy(ABC):
    """Strategy interface for authentication mechanisms."""

    @abstractmethod
    def authenticate(self, request, credentials: Dict) -> Optional[User]:
        raise NotImplementedError()


class PasswordStrategy(AuthStrategy):
    """Authenticate using username/password via Django's `authenticate`."""

    def authenticate(self, request, credentials: Dict) -> Optional[User]:
        username = credentials.get('username')
        password = credentials.get('password')
        if username is None or password is None:
            return None
        return authenticate(request, username=username, password=password)


class TokenStrategy(AuthStrategy):
    """Stub token strategy: expects `token` in credentials.

    (Provide a concrete implementation if you add token auth later.)
    """

    def authenticate(self, request, credentials: Dict) -> Optional[User]:
        token = credentials.get('token')
        if not token:
            return None
        # Example: look up a user by a token model (not implemented here)
        return None

class KeycloakStrategy(AuthStrategy):
    """Autenticación mediante Keycloak (OIDC)."""

    def authenticate(self, request, credentials: Dict) -> Optional[User]:
        code = credentials.get('code')
        redirect_uri = credentials.get('redirect_uri')
        
        if not code or not redirect_uri:
            return None
            
        try:
            # Obtener tokens de Keycloak
            token_response = keycloak_manager.get_token(code, redirect_uri)
            access_token = token_response['access_token']
            
            # Obtener info del usuario
            try:
                user_info = keycloak_manager.get_user_info(access_token)
            except Exception:
                # Fallback: Decodificar el JWT directamente si la API userinfo falla
                user_info = keycloak_manager.keycloak_openid.decode_token(access_token)
            
            username = user_info.get('preferred_username') or user_info.get('sub')
            email = user_info.get('email', '')
            first_name = user_info.get('given_name', '')
            last_name = user_info.get('family_name', '')
            
            # Obtener o crear usuario localmente
            user, created = User.objects.get_or_create(
                username=username, 
                defaults={
                    'email': email,
                    'first_name': first_name,
                    'last_name': last_name
                }
            )
            
            # Sincronizar roles de Keycloak
            # Buscamos roles en resource_access -> client_id -> roles
            client_id = keycloak_manager.client_id
            roles = user_info.get('resource_access', {}).get(client_id, {}).get('roles', [])
            
            if hasattr(user, 'profile'):
                profile = user.profile
                # Mapeo simple: tomamos el primer rol coincidente
                if 'admin' in roles:
                    profile.role = 'admin'
                elif 'preparador' in roles:
                    profile.role = 'preparador'
                elif 'operario' in roles:
                    profile.role = 'operario'
                profile.save()
            
            return user
        except Exception as e:
            import logging
            logger = logging.getLogger(__name__)
            # Intentar extraer más detalle si es un error de la librería keycloak
            error_msg = str(e)
            if hasattr(e, 'response_body'):
                try:
                    detail = json.loads(e.response_body)
                    error_msg += f" - Detalle: {detail}"
                except:
                    error_msg += f" - Body: {e.response_body}"
            
            logger.error(f"Error en KeycloakStrategy: {error_msg}", exc_info=True)
            return None
