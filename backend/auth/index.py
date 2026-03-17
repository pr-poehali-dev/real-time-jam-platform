"""
Аутентификация BraBrey через Google OAuth 2.0.
Эндпоинты:
  GET /auth?action=login   — редирект на Google
  GET /auth?action=callback&code=... — обмен кода на токен, создание сессии
  GET /auth?action=me      — получить текущего пользователя по токену
  POST /auth?action=logout — завершить сессию
"""

import os
import json
import secrets
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


def google_redirect_url(base_url: str) -> str:
    return base_url.rstrip('/') + '/auth?action=callback'


def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': {**CORS_HEADERS, 'Access-Control-Max-Age': '86400'}, 'body': ''}

    method = event.get('httpMethod', 'GET')
    params = event.get('queryStringParameters') or {}
    action = params.get('action', '')

    # Базовый URL функции для redirect_uri
    request_ctx = event.get('requestContext', {})
    host = (event.get('headers') or {}).get('host', '')
    base_url = f"https://{host}" if host else FRONTEND_URL

    # --- GET /auth?action=login ---
    if method == 'GET' and action == 'login':
        redirect_uri = google_redirect_url(base_url)
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
        return {
            'statusCode': 302,
            'headers': {**CORS_HEADERS, 'Location': oauth_url},
            'body': '',
        }

    # --- GET /auth?action=callback&code=... ---
    if method == 'GET' and action == 'callback':
        code = params.get('code', '')
        error = params.get('error', '')

        if error or not code:
            return _redirect_frontend(f'/login?error={error or "no_code"}')

        redirect_uri = google_redirect_url(base_url)

        # Обмен code → access_token
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

        # Получить данные пользователя
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

        # Upsert пользователя и создать сессию
        session_token = secrets.token_urlsafe(32)
        conn = get_db()
        cur = conn.cursor()
        cur.execute(
            f"""
            INSERT INTO {SCHEMA}.users (google_id, email, name, avatar_url)
            VALUES (%s, %s, %s, %s)
            ON CONFLICT (google_id) DO UPDATE
              SET email = EXCLUDED.email,
                  name = EXCLUDED.name,
                  avatar_url = EXCLUDED.avatar_url,
                  updated_at = NOW()
            RETURNING id
            """,
            (google_id, email, name, avatar),
        )
        user_id = cur.fetchone()[0]
        cur.execute(
            f"INSERT INTO {SCHEMA}.sessions (token, user_id) VALUES (%s, %s)",
            (session_token, str(user_id)),
        )
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

        return _json(200, {
            'id': str(row[0]),
            'email': row[1],
            'name': row[2],
            'avatar_url': row[3],
        })

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
        'body': json.dumps(body),
    }


def _redirect_frontend(path: str) -> dict:
    return {
        'statusCode': 302,
        'headers': {**CORS_HEADERS, 'Location': FRONTEND_URL + path},
        'body': '',
    }
