import http.cookiejar, urllib.request, urllib.parse, json

BASE='http://127.0.0.1:8000'
ORIGIN='http://localhost:3000'

cj = http.cookiejar.CookieJar()
opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))

def get(path):
    req = urllib.request.Request(BASE+path, method='GET')
    req.add_header('Origin', ORIGIN)
    with opener.open(req, timeout=10) as r:
        return r.status, r.read().decode(), r.getheaders()

def post(path, data):
    data = urllib.parse.urlencode(data).encode()
    req = urllib.request.Request(BASE+path, data=data, method='POST')
    req.add_header('Origin', ORIGIN)
    # get csrftoken from cookies
    csrf = None
    for c in cj:
        if c.name=='csrftoken':
            csrf = c.value
    if csrf:
        req.add_header('X-CSRFToken', csrf)
    req.add_header('Content-Type', 'application/x-www-form-urlencoded')
    req.add_header('Referer', BASE + '/')
    try:
        with opener.open(req, timeout=10) as r:
            return r.status, r.read().decode(), r.getheaders()
    except Exception as e:
        if hasattr(e, 'read'):
            try:
                body = e.read().decode()
            except Exception:
                body = str(e)
        else:
            body = str(e)
        return getattr(e, 'code', None), body, {}

if __name__=='__main__':
    print('Fetching CSRF...')
    s, b, h = get('/auth/csrf/')
    print('CSRF status', s)
    print('Cookies:', [(c.name,c.value) for c in cj])

    print('Attempt login...')
    status, body, headers = post('/auth/login/', {'username':'admin','password':'Admin123!'})
    print('Login status', status)
    print(body)

    print('Fetch user...')
    s, b, h = get('/auth/user/')
    print('User status', s)
    print(b)

    # Check Django admin/dashboard page access after login
    print('Checking access to Django admin dashboard...')
    try:
        status, body, headers = get('/dashboard/admin/')
        print('Dashboard status', status)
        print('Dashboard body (truncated):')
        print(body[:800])
    except Exception as e:
        print('Dashboard check error', e)
