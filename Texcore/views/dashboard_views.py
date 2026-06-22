"""
Dashboard views - role-specific dashboard pages.
"""
from typing import Any
from django.shortcuts import render, redirect
from ..decorators import (
    admin_required,
    operario_required,
    preparador_required,
    any_role_required
)
from ..services import dashboard_service
from ..security import kms_manager
import requests
import os

@admin_required
def send_encrypted_message(request):
    """Encripta y envía una trama de mensaje de texto al Sistema B usando AWS KMS y Keycloak JWT."""
    from ..security import keycloak_manager
    import httpx
    
    if request.method == 'POST':
        message = request.POST.get('message', '')
        
        # 1. Encriptar trama usando AWS KMS
        ciphertext = kms_manager.encrypt(message)
        
        # 2. Obtener Token de Keycloak
        token_status = "Trama cifrada. No se pudo obtener token de Keycloak para el envío."
        access_token = None
        
        try:
            token_response = keycloak_manager.keycloak_openid.token(
                grant_type='client_credentials'
            )
            access_token = token_response.get('access_token')
            if access_token:
                token_status = "Trama cifrada y token JWT obtenido."
        except Exception as ke:
            token_status = f"Trama cifrada. Error al conectar con Keycloak: {str(ke)}"
            
        # 3. Intentar realizar el envío real al Sistema B
        sistema_b_url = os.environ.get('CATEQUESIS_API_URL') or 'http://localhost:8001/api/v1/sync-textil/'
        
        if access_token and ciphertext:
            headers = {
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "application/json"
            }
            try:
                with httpx.Client(timeout=10.0) as client:
                    resp = client.post(sistema_b_url, json={"ciphertext": ciphertext}, headers=headers)
                if resp.status_code == 200:
                    token_status = f"Trama cifrada, autenticada y enviada con éxito. Respuesta de Sistema B: {resp.json().get('message', 'OK')}"
                else:
                    token_status = f"Envío fallido. El receptor respondió con código {resp.status_code}."
            except Exception as e:
                token_status = f"Trama cifrada pero falló la conexión con el endpoint de destino: {str(e)}"
                
        context = {
            'original_message': message,
            'ciphertext': ciphertext,
            'target_url': sistema_b_url,
            'status': token_status
        }
        return render(request, 'paginas/kms_demo.html', context)
        
    return render(request, 'paginas/kms_demo.html')


@any_role_required
def dashboard(request: Any):
    """Authenticated dashboard view - redirects based on role."""
    if hasattr(request.user, 'profile'):
        if request.user.profile.is_admin:
            return redirect('admin_dashboard')
        elif request.user.profile.is_preparador:
            return redirect('preparador_dashboard')
        elif request.user.profile.is_operario:
            return redirect('operario_dashboard')
    return render(request, 'paginas/dashboard.html')


@admin_required
def admin_dashboard(request):
    """Administrative dashboard with statistics and reports."""
    context = dashboard_service.get_admin_dashboard_stats()
    return render(request, 'paginas/admin_dashboard.html', context)


@operario_required
def operario_dashboard(request):
    """Operario dashboard with quick access to common tasks."""
    context = dashboard_service.get_operario_dashboard_stats(request.user)
    return render(request, 'paginas/operario_dashboard.html', context)


@preparador_required
def preparador_dashboard(request):
    """Dashboard específico para preparadores de materias primas."""
    context = dashboard_service.get_preparador_dashboard_stats(request.user)
    return render(request, 'paginas/preparador_dashboard.html', context)
