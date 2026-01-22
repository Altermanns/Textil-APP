from django.http import JsonResponse
from django.shortcuts import redirect
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from django.views.decorators.http import require_POST
from django.contrib.auth import login as auth_login, logout as auth_logout
from ..services import auth_service


@ensure_csrf_cookie
def csrf_view(request):
    return JsonResponse({'ok': True})


def user_view(request):
    user = request.user
    if user.is_authenticated:
        profile = None
        if hasattr(user, 'profile'):
            profile = {
                'is_admin': getattr(user.profile, 'is_admin', False),
                'is_preparador': getattr(user.profile, 'is_preparador', False),
            }
        data = {
            'id': user.id,
            'username': user.username,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email,
            'profile': profile,
        }
        return JsonResponse(data)
    return JsonResponse({'detail': 'Unauthenticated'}, status=401)


@csrf_exempt
@require_POST
def login_view(request):
    # Accept form-encoded or JSON bodies
    username = request.POST.get('username')
    password = request.POST.get('password')
    if not username and request.content_type == 'application/json':
        try:
            import json
            payload = json.loads(request.body.decode('utf-8'))
            username = payload.get('username')
            password = payload.get('password')
        except Exception:
            pass
    user = auth_service.authenticate_user(request, username, password)
    if user is not None:
        auth_login(request, user)
        # If the request included a `next` parameter (form POST from browser),
        # redirect there so the browser follows the navigation and the
        # session cookie is used for subsequent requests (e.g. dashboard).
        next_url = request.POST.get('next') or request.GET.get('next')
        if next_url:
            return redirect(next_url)
        return JsonResponse({'success': True})
    return JsonResponse({'success': False, 'detail': 'Invalid credentials'}, status=400)


@csrf_exempt
@require_POST
def logout_view(request):
    auth_logout(request)
    return JsonResponse({'success': True})
