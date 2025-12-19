from abc import ABC, abstractmethod
from typing import Optional
from django.contrib.auth.models import User


class UserRepository(ABC):
    """Abstract repository for user-related data access (ISP/DIP)."""

    @abstractmethod
    def get_by_username(self, username: str) -> Optional[User]:
        raise NotImplementedError()

    @abstractmethod
    def get_by_email(self, email: str) -> Optional[User]:
        raise NotImplementedError()


class DjangoUserRepository(UserRepository):
    """Django ORM implementation of `UserRepository`."""

    def get_by_username(self, username: str) -> Optional[User]:
        try:
            return User.objects.get(username=username)
        except User.DoesNotExist:
            return None

    def get_by_email(self, email: str) -> Optional[User]:
        try:
            return User.objects.get(email=email)
        except User.DoesNotExist:
            return None
