from abc import ABC, abstractmethod
from typing import Optional, Dict
from django.contrib.auth import authenticate
from django.contrib.auth.models import User


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
