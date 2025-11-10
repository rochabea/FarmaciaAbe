import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'csv-parse/sync';

// credeciais
const SUPABASE_URL = "https://yepmdpmkrnvlubiypkhe.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllcG1kcG1rcm52bHViaXlwa2hlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjEwNjQ3NCwiZXhwIjoyMDc3NjgyNDc0fQ.QEJ_sJ_M6vI_pkFdpQFRUeQ5FyW7mOyZzoa6axZGMuE";

// client admin
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Lê o arquivo CSV com os usuários
const csvPath = path.resolve(process.cwd(), 'users.csv');
const csv = fs.readFileSync(csvPath, 'utf8');
const rows = parse(csv, { columns: true, skip_empty_lines: true });

for (const u of rows) {
  const { data, error } = await supabase.auth.admin.createUser({
    email: u.email,
    password: u.password,
    email_confirm: true,
    user_metadata: {
      display_name: u.display_name || '',
      role: u.role || 'user',
    },
  });

  if (error) {
    if (String(error.message).toLowerCase().includes('already exists')) {
      console.log(`Usuário já existe: ${u.email} — atualizando profile...`);
      const { error: upErr } = await supabase
        .from('profiles')
        .update({
          display_name: u.display_name || null,
          role: u.role || 'user',
        })
        .eq('email', u.email);
      if (upErr)
        console.error(`Falha ao atualizar profile de ${u.email}:`, upErr.message);
      else console.log(`Profile atualizado: ${u.email}`);
    } else {
      console.error(`Erro criando ${u.email}:`, error.message);
    }
  } else {
    console.log(`✅ Criado: ${u.email} (id: ${data.user?.id})`);
  }
}

console.log('🚀 Seed concluído!');
