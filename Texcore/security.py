import os
import json
import base64
import hvac
from keycloak import KeycloakOpenID
from django.conf import settings

class KeycloakManager:
    def __init__(self):
        self.server_url = os.environ.get('KEYCLOAK_URL', 'http://localhost:8080')
        self.realm_name = os.environ.get('KC_REALM', 'textil-realm')
        self.client_id = os.environ.get('KC_CLIENT_ID', 'textil-app-a')
        self.client_secret = os.environ.get('KC_CLIENT_SECRET', '')
        
        self.keycloak_openid = KeycloakOpenID(
            server_url=self.server_url,
            client_id=self.client_id,
            realm_name=self.realm_name,
            client_secret_key=self.client_secret
        )

    def get_login_url(self, redirect_uri):
        return self.keycloak_openid.auth_url(
            redirect_uri=redirect_uri,
            scope="openid profile email"
        )

    def get_token(self, code, redirect_uri):
        return self.keycloak_openid.token(
            grant_type='authorization_code',
            code=code,
            redirect_uri=redirect_uri
        )

    def get_user_info(self, token):
        return self.keycloak_openid.userinfo(token)

    def get_logout_url(self, redirect_uri):
        # La forma más robusta es construir la URL de logout de Keycloak
        # para que el navegador del usuario la visite.
        return f"{self.server_url}/realms/{self.realm_name}/protocol/openid-connect/logout?post_logout_redirect_uri={redirect_uri}&client_id={self.client_id}"

class KMSManager:
    def __init__(self):
        self.vault_url = os.environ.get('VAULT_URL', 'http://localhost:8200')
        self.vault_token = os.environ.get('VAULT_TOKEN', 'root')
        self.client = hvac.Client(url=self.vault_url, token=self.vault_token)

    def encrypt(self, plaintext, key_name='textil-key'):
        # Ensure transit engine is enabled and key exists (this would be done in setup)
        try:
            encrypt_data_response = self.client.secrets.transit.encrypt_data(
                name=key_name,
                plaintext=base64.b64encode(plaintext.encode()).decode()
            )
            return encrypt_data_response['data']['ciphertext']
        except Exception as e:
            print(f"Error encrypting: {e}")
            return None

    def decrypt(self, ciphertext, key_name='textil-key'):
        try:
            decrypt_data_response = self.client.secrets.transit.decrypt_data(
                name=key_name,
                ciphertext=ciphertext
            )
            return base64.b64decode(decrypt_data_response['data']['plaintext']).decode()
        except Exception as e:
            print(f"Error decrypting: {e}")
            return None

kms_manager = KMSManager()
keycloak_manager = KeycloakManager()
