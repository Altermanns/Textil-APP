from types import SimpleNamespace
from unittest.mock import Mock, patch

from django.test import SimpleTestCase

from Texcore.services.auth_service import AuthService, authenticate_user
from Texcore.services.auth_strategies import AuthStrategy


class DummyStrategy(AuthStrategy):
    def __init__(self, result=None):
        self.result = result
        self.called_with = None

    def authenticate(self, request, credentials):
        self.called_with = (request, credentials)
        return self.result


class AuthServiceTests(SimpleTestCase):
    def test_strategy_is_called_and_result_returned(self):
        repo = Mock()
        user = SimpleNamespace(username='u')
        strategy = DummyStrategy(user)
        service = AuthService(repo, strategy)

        result = service.authenticate(request=None, credentials={'a': 1})

        self.assertIs(result, user)
        self.assertEqual(strategy.called_with, (None, {'a': 1}))

    def test_strategy_can_be_swapped(self):
        repo = Mock()
        strategy1 = DummyStrategy(None)
        strategy2 = DummyStrategy(SimpleNamespace(username='x'))
        service = AuthService(repo, strategy1)

        self.assertIsNone(service.authenticate(None, {}))
        service.strategy = strategy2
        self.assertIsNotNone(service.authenticate(None, {}))

    @patch('django.contrib.auth.authenticate')
    def test_authenticate_user_wrapper_calls_django_authenticate(self, mock_auth):
        dummy = SimpleNamespace(username='wrapuser')
        mock_auth.return_value = dummy

        user = authenticate_user(request=None, username='u', password='p')

        mock_auth.assert_called_once_with(None, username='u', password='p')
        self.assertIs(user, dummy)
