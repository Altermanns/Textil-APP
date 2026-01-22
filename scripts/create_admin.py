import os
import django
import sys

# ensure project root is on sys.path
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if project_root not in sys.path:
    sys.path.insert(0, project_root)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'LoginCRUD.settings.development')
# fallback to base if development not present
try:
    django.setup()
except Exception:
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'LoginCRUD.settings')
    django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

username = 'admin'
password = 'Admin123!'
email = 'admin@example.com'

if not User.objects.filter(username=username).exists():
    print('Creating admin user...')
    user = User.objects.create_superuser(username=username, email=email, password=password)
    print('Created:', user.username)
else:
    print('Admin user already exists')

# Ensure the admin has the expected password (reset if necessary)
u = User.objects.filter(username=username).first()
if u is not None:
    u.set_password(password)
    u.is_superuser = True
    u.is_staff = True
    u.save()
    print('Ensured admin password and flags updated')
else:
    print('Admin user already exists')
