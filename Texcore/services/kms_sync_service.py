import os
import json
import httpx
from ..security import kms_manager, keycloak_manager
from ..models import Materia

def sync_materia_to_catequesis(materia_id: int) -> tuple[bool, str]:
    """
    Cifra los datos de la materia prima usando AWS KMS y los envía
    de forma segura al endpoint de Catequesis_SS, autenticándose
    previamente con el flujo Client Credentials de Keycloak.
    """
    try:
        # 1. Obtener la materia prima de la base de datos
        try:
            materia = Materia.objects.select_related('usuario_registro').get(pk=materia_id)
        except Materia.DoesNotExist:
            return False, f"La materia prima con ID {materia_id} no existe."

        # 2. Construir el payload en texto plano
        payload = {
            "id": materia.id,
            "tipo": materia.tipo,
            "cantidad": materia.cantidad,
            "unidad_medida": materia.unidad_medida,
            "lote": materia.lote,
            "fecha_ingreso": str(materia.fecha_ingreso) if materia.fecha_ingreso else None,
            "usuario_registro": materia.usuario_registro.username if materia.usuario_registro else None,
            "origen": "TextilApp"
        }
        
        # 3. Cifrar con AWS KMS (kms_manager)
        plaintext = json.dumps(payload)
        ciphertext = kms_manager.encrypt(plaintext)
        
        if not ciphertext:
            return False, "Fallo al cifrar el payload con AWS KMS."

        # 4. Obtener token de Keycloak (Client Credentials)
        # Esto autentica a la app de TextilApp como un servicio confiable
        try:
            token_response = keycloak_manager.keycloak_openid.token(
                grant_type='client_credentials'
            )
            access_token = token_response.get('access_token')
            if not access_token:
                return False, "Keycloak no retornó un token de acceso válido."
        except Exception as ke:
            return False, f"Error al autenticar con Keycloak: {str(ke)}"

        # 5. Enviar el payload cifrado por HTTP POST
        target_url = os.environ.get('CATEQUESIS_API_URL') or 'http://localhost:8001/api/v1/sync-textil/'
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
        
        print(f"[SECURITY INFO] Enviando payload cifrado a {target_url}...")
        
        with httpx.Client(timeout=15.0) as client:
            response = client.post(target_url, json={"ciphertext": ciphertext}, headers=headers)
            
        if response.status_code == 200:
            resp_data = response.json()
            return True, f"Sincronización exitosa: {resp_data.get('message', 'OK')}"
        else:
            return False, f"Error del servidor receptor ({response.status_code}): {response.text}"

    except Exception as e:
        return False, f"Error inesperado en la sincronización: {str(e)}"
