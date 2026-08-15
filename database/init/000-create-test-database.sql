SELECT 'CREATE DATABASE crm_back_test'
WHERE NOT EXISTS (
  SELECT FROM pg_database WHERE datname = 'crm_back_test'
) \gexec
