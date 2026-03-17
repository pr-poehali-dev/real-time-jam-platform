import { useState, useEffect, useCallback } from 'react';

const AUTH_URL = 'https://functions.poehali.dev/3a71915d-a1c1-4f09-a977-02a8611bd302';
const TOKEN_KEY = 'brabrey_token';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const getToken = () => localStorage.getItem(TOKEN_KEY);

  const fetchMe = useCallback(async (token: string) => {
    try {
      const res = await fetch(`${AUTH_URL}?action=me`, {
        headers: { 'X-Auth-Token': token },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        return true;
      }
    } catch (_e) {
      // ignore fetch errors
    }
    return false;
  }, []);

  useEffect(() => {
    // Проверяем токен из URL после редиректа от Google
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get('token');

    if (tokenFromUrl) {
      localStorage.setItem(TOKEN_KEY, tokenFromUrl);
      // Убираем токен из URL без перезагрузки
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, '', cleanUrl);
      fetchMe(tokenFromUrl).finally(() => setLoading(false));
      return;
    }

    const savedToken = getToken();
    if (savedToken) {
      fetchMe(savedToken).then(ok => {
        if (!ok) localStorage.removeItem(TOKEN_KEY);
      }).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [fetchMe]);

  const logout = async () => {
    const token = getToken();
    if (token) {
      await fetch(`${AUTH_URL}?action=logout`, {
        method: 'POST',
        headers: { 'X-Auth-Token': token },
      }).catch(() => {});
      localStorage.removeItem(TOKEN_KEY);
    }
    setUser(null);
  };

  return { user, loading, logout };
}