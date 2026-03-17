ALTER TABLE t_p91204118_real_time_jam_platfo.users
  ADD COLUMN IF NOT EXISTS password_hash TEXT;

ALTER TABLE t_p91204118_real_time_jam_platfo.users
  ALTER COLUMN google_id SET DEFAULT NULL;

UPDATE t_p91204118_real_time_jam_platfo.users
  SET google_id = NULL WHERE google_id = '';
