import os
import time
import hvac
from django.core.management.base import BaseCommand
from keycloak import KeycloakAdmin

class Command(BaseCommand):
    help = 'Configura Keycloak y HashiCorp Vault para el proyecto'

    def handle(self, *args, **options):
        self.setup_vault()
        self.setup_keycloak()

    def setup_vault(self):
        self.stdout.write("🔐 Configurando Vault...")
        vault_url = os.environ.get('VAULT_URL', 'http://vault:8200')
        vault_token = os.environ.get('VAULT_TOKEN', 'root')
        
        client = hvac.Client(url=vault_url, token=vault_token)
        
        try:
            # Habilitar motor de transit
            if 'transit/' not in client.sys.list_mounted_secrets_engines():
                client.sys.enable_secrets_engine('transit')
                self.stdout.write(self.style.SUCCESS("✅ Motor 'transit' habilitado"))
            
            # Crear llave de encriptación
            client.secrets.transit.create_key(name='textil-key')
            self.stdout.write(self.style.SUCCESS("✅ Llave 'textil-key' creada"))
        except Exception as e:
            self.stdout.write(self.style.WARNING(f"⚠️ Error en Vault (posiblemente ya configurado): {e}"))

    def setup_keycloak(self):
        self.stdout.write("🔑 Configurando Keycloak...")
        server_url = os.environ.get('KEYCLOAK_URL', 'http://keycloak:8080')
        admin_user = os.environ.get('KEYCLOAK_ADMIN', 'admin')
        admin_pass = os.environ.get('KEYCLOAK_ADMIN_PASSWORD', 'admin')
        realm_name = os.environ.get('KC_REALM', 'textil-realm')
        
        # Esperar a que Keycloak esté listo
        max_retries = 10
        for i in range(max_retries):
            try:
                keycloak_admin = KeycloakAdmin(
                    server_url=server_url,
                    username=admin_user,
                    password=admin_pass,
                    realm_name='master',
                    verify=True
                )
                break
            except Exception:
                self.stdout.write(f"Esperando a Keycloak... ({i+1}/{max_retries})")
                time.sleep(10)
        else:
            self.stdout.write(self.style.ERROR("❌ No se pudo conectar con Keycloak"))
            return

        try:
            # Crear Realm
            if realm_name not in [r['realm'] for r in keycloak_admin.get_realms()]:
                keycloak_admin.create_realm(payload={"realm": realm_name, "enabled": True})
                self.stdout.write(self.style.SUCCESS(f"✅ Realm '{realm_name}' creado"))
            
            keycloak_admin.realm_name = realm_name
            
            # Crear Cliente para Sistema A
            client_id = os.environ.get('KC_CLIENT_ID', 'textil-app-a')
            clients = keycloak_admin.get_clients()
            if client_id not in [c['clientId'] for c in clients]:
                keycloak_admin.create_client(payload={
                    "clientId": client_id,
                    "enabled": True,
                    "clientAuthenticatorType": "client-secret",
                    "redirectUris": ["*"],
                    "webOrigins": ["*"],
                    "publicClient": False,
                    "protocol": "openid-connect"
                })
                self.stdout.write(self.style.SUCCESS(f"✅ Cliente '{client_id}' creado"))
            
            # Crear Roles
            for role in ['admin', 'operario', 'preparador']:
                try:
                    keycloak_admin.create_realm_role(payload={"name": role})
                    self.stdout.write(self.style.SUCCESS(f"✅ Rol '{role}' creado"))
                except Exception:
                    pass

        except Exception as e:
            self.stdout.write(self.style.ERROR(f"❌ Error en Keycloak: {e}"))
