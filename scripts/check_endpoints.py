import urllib.request
import urllib.error
import json

BASE = 'http://127.0.0.1:8000'
ORIGIN = 'http://localhost:3000'
ENDPOINTS = [
    '/api/',
    '/api/hilaturas/',
    '/api/preparaciones/',
    '/api/materias/',
    '/api/users/',
    # auth endpoints we added
    '/auth/csrf/',
    '/auth/user/',
    '/auth/login/',
    '/auth/logout/',
]

def do_request(path, method='GET'):
    url = BASE + path
    req = urllib.request.Request(url, method=method)
    req.add_header('Origin', ORIGIN)
    req.add_header('Accept', 'application/json')
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            status = resp.getcode()
            headers = dict(resp.getheaders())
            body = resp.read(2048).decode('utf-8', errors='replace')
            return status, headers, body
    except urllib.error.HTTPError as e:
        headers = dict(e.headers) if e.headers else {}
        try:
            body = e.read(2048).decode('utf-8', errors='replace')
        except Exception:
            body = ''
        return e.code, headers, body
    except Exception as e:
        return None, {}, str(e)

if __name__ == '__main__':
    results = {}
    for ep in ENDPOINTS:
        print(f'--- {ep} ---')
        status, headers, body = do_request(ep, method='OPTIONS')
        print('OPTIONS ->', status)
        print('Headers:', json.dumps(headers, indent=2)[:1000])
        print()
        status, headers, body = do_request(ep, method='GET')
        print('GET ->', status)
        print('Headers:', json.dumps(headers, indent=2)[:1000])
        print('Body (truncated):')
        print(body[:1000])
        print('\n')
