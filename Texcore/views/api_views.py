
import json
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.contrib.auth import login as auth_login, logout as auth_logout
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import ensure_csrf_cookie

from ..services import auth_service
from ..models import Profile

@ensure_csrf_cookie
@require_http_methods(["GET"])
def csrf_api(request):
    """
    Provides a CSRF token to the client.
    The @ensure_csrf_cookie decorator sets the cookie.
    """
    return JsonResponse({"message": "CSRF cookie set"})

@require_http_methods(["POST"])
def login_api(request):
    """
    API endpoint for user login. Expects a JSON body with username and password.
    """
    try:
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    user = auth_service.authenticate_user(request, username, password)

    if user is not None:
        auth_login(request, user)
        # Return user's role for frontend redirection
        role = user.profile.role if hasattr(user, 'profile') else 'default'
        return JsonResponse({"message": "Login successful", "role": role})
    
    return JsonResponse({"error": "Invalid credentials"}, status=401)


@require_http_methods(["POST"])
def logout_api(request):
    """
    API endpoint for user logout.
    """
    auth_logout(request)
    return JsonResponse({"message": "Logout successful"})


@login_required
@require_http_methods(["GET"])
def user_api(request):
    """
    API endpoint to get the current authenticated user's data.
    """
    user = request.user
    try:
        profile = user.profile
        profile_data = {
            "role": profile.get_role_display()
        }
    except Profile.DoesNotExist:
        profile_data = {
            "role": "No Profile"
        }

    user_data = {
        "id": user.id,
        "username": user.username,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "profile": profile_data
    }
    return JsonResponse(user_data)
