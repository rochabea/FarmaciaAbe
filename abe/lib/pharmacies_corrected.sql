-- Script SQL CORRIGIDO para criar a tabela de farmácias no Supabase
-- Execute este script no SQL Editor do Supabase

CREATE TABLE IF NOT EXISTS pharmacies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  endereco VARCHAR(500) NOT NULL,
  cidade VARCHAR(100) NOT NULL,
  estado VARCHAR(2) NOT NULL,
  cep VARCHAR(10) NOT NULL,
  telefone VARCHAR(20),
  distancia VARCHAR(20),
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índice para busca rápida por nome
CREATE INDEX IF NOT EXISTS idx_pharmacies_nome ON pharmacies(nome);
CREATE INDEX IF NOT EXISTS idx_pharmacies_ativo ON pharmacies(ativo);

-- Habilitar RLS (Row Level Security)
ALTER TABLE pharmacies ENABLE ROW LEVEL SECURITY;

-- Política: Todos podem ler farmácias ativas
CREATE POLICY "Farmácias ativas são públicas"
  ON pharmacies
  FOR SELECT
  USING (ativo = true);

-- Política: Apenas administradores podem inserir/atualizar/deletar
-- (Ajuste conforme sua lógica de autenticação)
CREATE POLICY "Apenas admins podem inserir farmácias"
  ON pharmacies
  FOR INSERT
  WITH CHECK (true); -- Ajuste para verificar se é admin

CREATE POLICY "Apenas admins podem atualizar farmácias"
  ON pharmacies
  FOR UPDATE
  USING (true); -- Ajuste para verificar se é admin

CREATE POLICY "Apenas admins podem deletar farmácias"
  ON pharmacies
  FOR DELETE
  USING (true); -- Ajuste para verificar se é admin

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_pharmacies_updated_at
  BEFORE UPDATE ON pharmacies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Inserção de dados (CORRIGIDO - removido user_id)
INSERT INTO pharmacies (
  id, nome, endereco, cidade, estado, cep,
  telefone, distancia, ativo, created_at, updated_at
) VALUES
-- 1 — Brasília
('1f7b8c1a-4c2e-4a99-9d10-1a3ef7b90111', 'Farmácia Saúde Viva', 'SQN 210 Bloco A, Asa Norte', 'Brasília', 'DF', '70862-010', '(61) 3344-1111', '1.2 km', TRUE, NOW(), NOW()),

-- 2 — Brasília
('8a21e1de-95b8-451c-98cd-23cb48c7f200', 'Farmácia Popular Asa Sul', 'CLS 204, Asa Sul', 'Brasília', 'DF', '70234-520', '(61) 3222-5566', '900 m', TRUE, NOW(), NOW()),

-- 3 — Brasília
('c81bc5d8-119f-4c71-b3c1-a7f421ba3321', 'Drogaria Central Brasília', 'SCLN 405 Bloco C', 'Brasília', 'DF', '70845-530', '(61) 3337-9090', '2 km', TRUE, NOW(), NOW()),

-- 4 — Brasília
('b93f75ab-b866-4476-9dd9-42ad71c1d221', 'Drogavet Plano Piloto', 'Setor Hospitalar Norte, Quadra 2', 'Brasília', 'DF', '70710-100', '(61) 3107-4500', '3.4 km', TRUE, NOW(), NOW()),

-- 5 — Brasília
('d712320b-e8cd-4edb-aa09-f3af0b87e522', 'Farmácia Vida & Saúde Lago Sul', 'QI 11 Conjunto 5', 'Brasília', 'DF', '71625-110', '(61) 3366-7788', '4 km', TRUE, NOW(), NOW()),

-- 6 — São Paulo
('fe31c1a1-f574-4c9f-9f67-228ab388d551', 'Drogaria Paulista', 'Av. Paulista, 900', 'São Paulo', 'SP', '01310-100', '(11) 3250-1122', '600 m', TRUE, NOW(), NOW()),

-- 7 — São Paulo
('e1cd4f56-247c-49a1-b581-f3a0f5040f99', 'Farmácia Saúde SP', 'Rua Augusta, 1500', 'São Paulo', 'SP', '01305-100', '(11) 3333-9988', '1 km', TRUE, NOW(), NOW()),

-- 8 — Curitiba
('c13d0a1a-122c-47d9-a8dd-239bfa553188', 'Drogaria Boa Saúde', 'Rua XV de Novembro, 251', 'Curitiba', 'PR', '80020-310', '(41) 3222-7666', '1.3 km', TRUE, NOW(), NOW()),

-- 9 — Florianópolis
('4fd0c1f9-9f31-4a3c-8333-2a4492de3001', 'Farmácia Catarinense', 'Av. Beira Mar Norte, 700', 'Florianópolis', 'SC', '88015-701', '(48) 3223-1991', '850 m', TRUE, NOW(), NOW()),

-- 10 — Belo Horizonte
('3c102a1a-7a81-4ad9-b123-7cfe190ffa88', 'Drogaria Central BH', 'Av. Afonso Pena, 1500', 'Belo Horizonte', 'MG', '30130-003', '(31) 3224-8811', '2.2 km', TRUE, NOW(), NOW()),

-- 11 — Recife
('b1f0322b-4aad-4b11-afeb-0f122ce87733', 'Farmácia Vida Recife', 'Rua da Aurora, 500', 'Recife', 'PE', '50050-005', '(81) 3228-6600', '1 km', TRUE, NOW(), NOW()),

-- 12 — Manaus
('7e0c2fa1-afd2-4be0-ad22-c8c571bb8e77', 'Drogaria Amazônia', 'Av. Eduardo Ribeiro, 231', 'Manaus', 'AM', '69010-100', '(92) 3233-5544', '1.9 km', TRUE, NOW(), NOW()),

-- 13 — Teresina
('6db1e3ac-1c33-4593-a2a1-9c33b8071c33', 'Farmácia Piauí', 'Av. Frei Serafim, 900', 'Teresina', 'PI', '64000-020', '(86) 3233-1122', '3 km', TRUE, NOW(), NOW()),

-- 14 — Campina Grande
('e91ad19b-cb10-4271-b8cc-2aef0c355112', 'Drogaria Sertão', 'Rua Coronel João, 220', 'Campina Grande', 'PB', '58400-150', '(83) 3344-9911', '5 km', TRUE, NOW(), NOW()),

-- 15 — Porto Alegre
('e91a912e-1193-4c77-a40b-398cfcbac312', 'Farmácia Beira Rio', 'Av. Presidente Vargas, 700', 'Porto Alegre', 'RS', '90030-041', '(51) 3221-8899', '1.1 km', TRUE, NOW(), NOW()),

-- 16 — Boa Vista
('f1d2c3b4-2234-4a11-bb11-0f11eadb9088', 'Drogaria do Norte', 'Av. Brasil, 1250', 'Boa Vista', 'RR', '69301-130', '(95) 3222-4566', '2.4 km', TRUE, NOW(), NOW()),

-- 17 — Rio Branco
('cda21b12-55bb-4c81-8812-123baa77cd11', 'Farmácia Vida Norte', 'Rua Ceará, 899', 'Rio Branco', 'AC', '69900-230', '(68) 3223-6655', '4.8 km', TRUE, NOW(), NOW()),

-- 18 — Goiânia
('001a3c21-f123-4cc3-a1d1-228fb776aa21', 'Drogaria Goiana', 'Rua 5, Setor Central', 'Goiânia', 'GO', '74015-050', '(62) 3221-7788', '600 m', TRUE, NOW(), NOW()),

-- 19 — Salvador
('f8817f81-7812-4a98-b221-8890c55ab411', 'Drogaria 24h Salvador', 'Av. Tancredo Neves, 3000', 'Salvador', 'BA', '41820-020', '(71) 3333-1199', '3.3 km', TRUE, NOW(), NOW()),

-- 20 — João Pessoa
('f91aa2b1-1182-4d88-9aa3-5512a1e7b992', 'Farmácia Atlântico', 'Av. Cabo Branco, 1000', 'João Pessoa', 'PB', '58045-010', '(83) 3221-7711', '900 m', TRUE, NOW(), NOW()),

-- 21 — Natal
('bb91c2e2-7712-4adb-9001-4412a7250c88', 'Drogaria Potiguar', 'Av. Salgado Filho, 2330', 'Natal', 'RN', '59056-000', '(84) 3223-9000', '1.5 km', TRUE, NOW(), NOW()),

-- 22 — Aracaju
('8c21aa71-22b1-4c81-8833-aa2211d0ff87', 'Farmácia Sergipe', 'Av. Beira Mar, 200', 'Aracaju', 'SE', '49035-010', '(79) 3222-9988', '2 km', TRUE, NOW(), NOW()),

-- 23 — Maceió
('7d12aa21-aa23-4dd1-a876-83a7cd12aa93', 'Drogaria Alagoas', 'Ponta Verde, 123', 'Maceió', 'AL', '57035-170', '(82) 3232-2211', '2.7 km', TRUE, NOW(), NOW()),

-- 24 — Belém
('fd12ac76-bb23-4df1-bc93-9230fa12cd72', 'Farmácia Pará', 'Av. Nazaré, 700', 'Belém', 'PA', '66035-170', '(91) 3222-8800', '3.8 km', TRUE, NOW(), NOW()),

-- 25 — Macapá
('ad1276bc-2291-4fa1-93dc-99123aedbc76', 'Drogaria Macapá', 'Rua São José, 1800', 'Macapá', 'AP', '68900-110', '(96) 3223-5544', '1 km', TRUE, NOW(), NOW()),

-- 26 — São Luís
('bc1278dd-d221-4ab1-89dd-98321bbcc712', 'Farmácia Maranhão', 'Av. dos Holandeses, 233', 'São Luís', 'MA', '65075-650', '(98) 3221-9988', '1.9 km', TRUE, NOW(), NOW()),

-- 27 — Campo Grande
('ac92bd14-d2c2-4b97-8c22-93ddbb1198ac', 'Farmácia Pantanal', 'Av. Afonso Pena, 3000', 'Campo Grande', 'MS', '79002-071', '(67) 3322-9900', '2.5 km', TRUE, NOW(), NOW()),

-- 28 — Cuiabá
('cc87bb22-98ad-4dcd-9a11-882ac2ed77e1', 'Drogaria Cuiabá', 'Av. Getúlio Vargas, 450', 'Cuiabá', 'MT', '78020-900', '(65) 3222-1122', '3.1 km', TRUE, NOW(), NOW()),

-- 29 — Vitória
('de91ac21-123c-4c77-bb22-29acf221ee12', 'Farmácia Capixaba', 'Praia do Canto, 900', 'Vitória', 'ES', '29055-130', '(27) 3223-4411', '1.2 km', TRUE, NOW(), NOW()),

-- 30 — Rio de Janeiro
('f782ac11-98bb-4ad1-bb99-77aadc522111', 'Drogaria Carioca', 'Av. Atlântica, 2500', 'Rio de Janeiro', 'RJ', '22041-001', '(21) 3221-8899', '700 m', TRUE, NOW(), NOW()),

-- 31 — Santos
('aa12bc91-77cc-4c1a-b812-d11ab932c771', 'Farmácia do Porto', 'Rua João Pessoa, 180', 'Santos', 'SP', '11013-001', '(13) 3223-1122', '2 km', TRUE, NOW(), NOW()),

-- 32 — Ribeirão Preto
('bb12cd22-6621-4a18-a221-c19d7aa8aa71', 'Drogaria Ribeirão', 'Av. Independência, 990', 'Ribeirão Preto', 'SP', '14020-230', '(16) 3222-7788', '1.7 km', TRUE, NOW(), NOW()),

-- 33 — Uberlândia
('cc12de33-5511-4ab9-9911-bbaaccdd9911', 'Farmácia Triângulo', 'Av. Floriano Peixoto, 3555', 'Uberlândia', 'MG', '38400-709', '(34) 3223-2211', '3 km', TRUE, NOW(), NOW()),

-- 34 — Maringá
('dd12ef44-4412-4a78-aac2-9988ccaa5511', 'Drogaria Maringá', 'Av. Colombo, 1700', 'Maringá', 'PR', '87030-000', '(44) 3221-4433', '1 km', TRUE, NOW(), NOW()),

-- 35 — Londrina
('ee12fa55-3312-4a56-bb22-772299ccaa22', 'Farmácia Londrina', 'Rua Souza Naves, 900', 'Londrina', 'PR', '86020-430', '(43) 3222-1100', '2.1 km', TRUE, NOW(), NOW()),

-- 36 — Blumenau
('ff12ab66-2211-4c89-bb22-8822aa55bb11', 'Drogaria Blumenau', 'Rua XV de Novembro, 1560', 'Blumenau', 'SC', '89010-001', '(47) 3223-9988', '1 km', TRUE, NOW(), NOW()),

-- 37 — Joinville
('aa98bc77-5512-4cd9-a981-cc11aa77dd22', 'Farmácia Joinville', 'Rua Dr. João Colin, 1555', 'Joinville', 'SC', '89204-001', '(47) 3221-1133', '3.3 km', TRUE, NOW(), NOW()),

-- 38 — Pelotas
('bba9cd88-6611-4dd1-a882-aa33bb88ee33', 'Drogaria Pelotas', 'Rua Andrade Neves, 1600', 'Pelotas', 'RS', '96010-170', '(53) 3222-4411', '3 km', TRUE, NOW(), NOW()),

-- 39 — Santa Maria
('cc89de99-7721-4ab1-bb11-8822aaccee44', 'Farmácia Santa Maria', 'Av. Rio Branco, 800', 'Santa Maria', 'RS', '97010-003', '(55) 3221-7700', '2.4 km', TRUE, NOW(), NOW()),

-- 40 — Criciúma
('dd78ef00-8821-4cc2-a882-cc22bbddff55', 'Drogaria Criciúma', 'Av. Centenário, 2000', 'Criciúma', 'SC', '88800-000', '(48) 3221-9988', '1.5 km', TRUE, NOW(), NOW()),

-- 41 — Foz do Iguaçu
('ee67fa11-9912-4dd3-8aa1-aa33bbccdd66', 'Farmácia Cataratas', 'Av. Paraná, 500', 'Foz do Iguaçu', 'PR', '85852-000', '(45) 3222-1133', '4 km', TRUE, NOW(), NOW()),

-- 42 — Ipatinga
('ff56ab22-aa11-4ee4-9bb2-aabbccddeeff', 'Drogaria Vale do Aço', 'Av. Brasil, 1333', 'Ipatinga', 'MG', '35160-000', '(31) 3223-4400', '2 km', TRUE, NOW(), NOW()),

-- 43 — Mossoró
('aa45bc33-bb21-4ff5-8cc3-dd1122aabb44', 'Farmácia Mossoró', 'Av. Alberto Maranhão, 2000', 'Mossoró', 'RN', '59600-000', '(84) 3321-7788', '3.6 km', TRUE, NOW(), NOW()),

-- 44 — Sobral
('bb34cd44-cc21-4aa6-9dd4-cc22bb11aa66', 'Drogaria Sobral', 'Rua Dom José, 1500', 'Sobral', 'CE', '62010-290', '(88) 3222-1133', '5 km', TRUE, NOW(), NOW()),

-- 45 — Juazeiro do Norte
('cc23de55-dd22-4bb7-8ee5-aa33cc44bb77', 'Farmácia Cariri', 'Av. Padre Cícero, 3333', 'Juazeiro do Norte', 'CE', '63010-020', '(88) 3221-5566', '4.7 km', TRUE, NOW(), NOW()),

-- 46 — Palmas
('dd12ef66-ee33-4cc8-9ff6-bb55dd66cc88', 'Drogaria Palmas', 'Av. JK, 300', 'Palmas', 'TO', '77001-020', '(63) 3222-1100', '1.8 km', TRUE, NOW(), NOW()),

-- 47 — Porto Velho
('ee01fa77-ff44-4dd9-a112-cc44ee77bb99', 'Farmácia Rondônia', 'Av. Sete de Setembro, 1770', 'Porto Velho', 'RO', '76801-060', '(69) 3221-7700', '2 km', TRUE, NOW(), NOW()),

-- 48 — Caruaru
('ff90ab88-1122-4cca-bb22-aa55bb66cc88', 'Drogaria Agreste', 'Av. Rui Barbosa, 900', 'Caruaru', 'PE', '55002-010', '(81) 3222-1100', '1.2 km', TRUE, NOW(), NOW()),

-- 49 — Bauru
('aa80bc99-2211-4bb2-cc33-bb44cc77dd99', 'Farmácia Bauru', 'Rua Batista de Carvalho, 1550', 'Bauru', 'SP', '17010-120', '(14) 3221-7788', '900 m', TRUE, NOW(), NOW()),

-- 50 — Franca
('bb70cdaa-3311-4cd3-dd44-cc55bb88aa11', 'Drogaria Franca', 'Rua do Comércio, 177', 'Franca', 'SP', '14400-100', '(16) 3223-6655', '2.9 km', TRUE, NOW(), NOW());


