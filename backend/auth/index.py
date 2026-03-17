"""
Аутентификация BraBrey: email/пароль + Google OAuth 2.0. v3
Эндпоинты:
  POST /auth?action=register  — регистрация email+пароль
  POST /auth?action=email_login — вход email+пароль
  GET  /auth?action=login     — редирект на Google
  GET  /auth?action=callback  — Google OAuth callback
  GET  /auth?action=me        — текущий пользователь
  POST /auth?action=logout    — завершить сессию
"""

import os
import json
import secrets
import hashlib
import urllib.parse
import urllib.request
import psycopg2

SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 't_p91204118_real_time_jam_platfo')
GOOGLE_CLIENT_ID = os.environ.get('GOOGLE_CLIENT_ID', '')
GOOGLE_CLIENT_SECRET = os.environ.get('GOOGLE_CLIENT_SECRET', '')
FRONTEND_URL = os.environ.get('FRONTEND_URL', 'https://p91204118.poehali.dev')

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
}


def get_db():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def hash_password(password: str) -> str:
    salt = os.environ.get('FRONTEND_URL', 'brabrey_salt_2024')
    return hashlib.sha256((password + salt).encode()).hexdigest()


def create_session(cur, user_id) -> str:
    token = secrets.token_urlsafe(32)
    cur.execute(
        f"INSERT INTO {SCHEMA}.sessions (token, user_id) VALUES (%s, %s)",
        (token, str(user_id)),
    )
    return token


def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': {**CORS_HEADERS, 'Access-Control-Max-Age': '86400'}, 'body': ''}

    method = event.get('httpMethod', 'GET')
    params = event.get('queryStringParameters') or {}
    action = params.get('action', '')

    host = (event.get('headers') or {}).get('host', '')
    base_url = f"https://{host}" if host else FRONTEND_URL

    # --- POST /auth?action=register ---
    if method == 'POST' and action == 'register':
        body = json.loads(event.get('body') or '{}')
        email = (body.get('email') or '').strip().lower()
        password = body.get('password') or ''
        name = (body.get('name') or '').strip()

        if not email or not password or not name:
            return _json(400, {'error': 'Заполни все поля'})
        if len(password) < 6:
            return _json(400, {'error': 'Пароль минимум 6 символов'})
        if len(name) < 2:
            return _json(400, {'error': 'Введи имя минимум 2 символа'})

        pw_hash = hash_password(password)
        conn = get_db()
        cur = conn.cursor()
        cur.execute(f"SELECT id FROM {SCHEMA}.users WHERE email = %s", (email,))
        if cur.fetchone():
            cur.close()
            conn.close()
            return _json(409, {'error': 'Этот email уже зарегистрирован'})

        cur.execute(
            f"INSERT INTO {SCHEMA}.users (email, name, password_hash) VALUES (%s, %s, %s) RETURNING id",
            (email, name, pw_hash),
        )
        user_id = cur.fetchone()[0]
        token = create_session(cur, user_id)
        conn.commit()
        cur.close()
        conn.close()
        return _json(200, {'token': token, 'name': name, 'email': email})

    # --- POST /auth?action=email_login ---
    if method == 'POST' and action == 'email_login':
        body = json.loads(event.get('body') or '{}')
        email = (body.get('email') or '').strip().lower()
        password = body.get('password') or ''

        if not email or not password:
            return _json(400, {'error': 'Введи email и пароль'})

        pw_hash = hash_password(password)
        conn = get_db()
        cur = conn.cursor()
        cur.execute(
            f"SELECT id, name, avatar_url FROM {SCHEMA}.users WHERE email = %s AND password_hash = %s",
            (email, pw_hash),
        )
        row = cur.fetchone()
        if not row:
            cur.close()
            conn.close()
            return _json(401, {'error': 'Неверный email или пароль'})

        user_id, name, avatar_url = row
        token = create_session(cur, user_id)
        conn.commit()
        cur.close()
        conn.close()
        return _json(200, {'token': token, 'name': name, 'email': email, 'avatar_url': avatar_url})

    # --- GET /auth?action=login (Google) ---
    if method == 'GET' and action == 'login':
        redirect_uri = base_url.rstrip('/') + '/auth?action=callback'
        oauth_url = (
            'https://accounts.google.com/o/oauth2/v2/auth?'
            + urllib.parse.urlencode({
                'client_id': GOOGLE_CLIENT_ID,
                'redirect_uri': redirect_uri,
                'response_type': 'code',
                'scope': 'openid email profile',
                'access_type': 'offline',
                'prompt': 'select_account',
            })
        )
        return {'statusCode': 302, 'headers': {**CORS_HEADERS, 'Location': oauth_url}, 'body': ''}

    # --- GET /auth?action=callback (Google) ---
    if method == 'GET' and action == 'callback':
        code = params.get('code', '')
        error = params.get('error', '')
        if error or not code:
            return _redirect_frontend(f'/?auth_error={error or "no_code"}')

        redirect_uri = base_url.rstrip('/') + '/auth?action=callback'
        token_data = urllib.parse.urlencode({
            'code': code,
            'client_id': GOOGLE_CLIENT_ID,
            'client_secret': GOOGLE_CLIENT_SECRET,
            'redirect_uri': redirect_uri,
            'grant_type': 'authorization_code',
        }).encode()

        req = urllib.request.Request(
            'https://oauth2.googleapis.com/token',
            data=token_data,
            method='POST',
            headers={'Content-Type': 'application/x-www-form-urlencoded'},
        )
        with urllib.request.urlopen(req) as resp:
            token_resp = json.loads(resp.read())

        access_token = token_resp.get('access_token', '')
        user_req = urllib.request.Request(
            'https://www.googleapis.com/oauth2/v2/userinfo',
            headers={'Authorization': f'Bearer {access_token}'},
        )
        with urllib.request.urlopen(user_req) as resp:
            google_user = json.loads(resp.read())

        google_id = google_user['id']
        email = google_user.get('email', '')
        name = google_user.get('name', '')
        avatar = google_user.get('picture', '')

        conn = get_db()
        cur = conn.cursor()
        cur.execute(f"SELECT id FROM {SCHEMA}.users WHERE google_id = %s", (google_id,))
        existing = cur.fetchone()
        if existing:
            user_id = existing[0]
            cur.execute(
                f"UPDATE {SCHEMA}.users SET email=%s, name=%s, avatar_url=%s, updated_at=NOW() WHERE id=%s",
                (email, name, avatar, str(user_id)),
            )
        else:
            cur.execute(
                f"INSERT INTO {SCHEMA}.users (google_id, email, name, avatar_url) VALUES (%s,%s,%s,%s) RETURNING id",
                (google_id, email, name, avatar),
            )
            user_id = cur.fetchone()[0]

        session_token = create_session(cur, user_id)
        conn.commit()
        cur.close()
        conn.close()
        return _redirect_frontend(f'/?token={session_token}')

    # --- GET /auth?action=me ---
    if method == 'GET' and action == 'me':
        token = (event.get('headers') or {}).get('x-auth-token', '')
        if not token:
            return _json(401, {'error': 'unauthorized'})

        conn = get_db()
        cur = conn.cursor()
        cur.execute(
            f"""
            SELECT u.id, u.email, u.name, u.avatar_url
            FROM {SCHEMA}.sessions s
            JOIN {SCHEMA}.users u ON u.id = s.user_id
            WHERE s.token = %s AND s.expires_at > NOW()
            """,
            (token,),
        )
        row = cur.fetchone()
        cur.close()
        conn.close()

        if not row:
            return _json(401, {'error': 'unauthorized'})

        return _json(200, {'id': str(row[0]), 'email': row[1], 'name': row[2], 'avatar_url': row[3]})

    # --- POST /auth?action=logout ---
    if method == 'POST' and action == 'logout':
        token = (event.get('headers') or {}).get('x-auth-token', '')
        if token:
            conn = get_db()
            cur = conn.cursor()
            cur.execute(f"UPDATE {SCHEMA}.sessions SET expires_at = NOW() WHERE token = %s", (token,))
            conn.commit()
            cur.close()
            conn.close()
        return _json(200, {'ok': True})

    return _json(404, {'error': 'not found'})


def _json(status: int, body: dict) -> dict:
    return {
        'statusCode': status,
        'headers': {**CORS_HEADERS, 'Content-Type': 'application/json'},
        'body': json.dumps(body, ensure_ascii=False),
    }


def _redirect_frontend(path: str) -> dict:
    return {
        'statusCode': 302,
        'headers': {**CORS_HEADERS, 'Location': FRONTEND_URL + path},
        'body': '',
    }
