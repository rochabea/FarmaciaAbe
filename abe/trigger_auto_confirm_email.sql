-- Script para auto-confirmar emails no Supabase
-- Execute este script no SQL Editor do Supabase

-- Remove o trigger se já existir
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Remove a função se já existir
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Cria a função que auto-confirma o email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Confirma o email automaticamente quando um novo usuário é criado
  UPDATE auth.users
  SET email_confirmed_at = NOW()
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Cria o trigger que executa a função após inserir um novo usuário
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Mensagem de sucesso
SELECT 'Trigger criado com sucesso! Emails serão confirmados automaticamente.' AS resultado;

