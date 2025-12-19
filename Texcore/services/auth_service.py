"""
Auth service implementing Dependency Inversion + Strategy pattern.

This module keeps a backward-compatible `authenticate_user` helper while
providing `AuthService` that depends on abstract `UserRepository`
and `AuthStrategy` implementations.
"""
from typing import Optional, Dict

from .repositories import DjangoUserRepository, UserRepository
from .auth_strategies import AuthStrategy, PasswordStrategy
from django.contrib.auth.models import User


class AuthService:
    """Service responsible for authentication logic.

    Depends on abstractions: a `UserRepository` and an `AuthStrategy`.
    """

    def __init__(self, user_repo: UserRepository, strategy: AuthStrategy):
        self.user_repo = user_repo
        self.strategy = strategy

    def authenticate(self, request, credentials: Dict) -> Optional[User]:
        return self.strategy.authenticate(request, credentials)


# Backwards-compatible helper used elsewhere in the codebase.
def authenticate_user(request, username: str, password: str) -> Optional[User]:
    """Compatibility wrapper that uses the default repository and strategy.

    This preserves the existing call-sites in views while enabling the
    project to be refactored progressively to use `AuthService` directly.
    """
    repo = DjangoUserRepository()
    strategy = PasswordStrategy()
    service = AuthService(repo, strategy)
    return service.authenticate(request, {'username': username, 'password': password})

