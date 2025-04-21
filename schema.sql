-- Tabela para armazenar as métricas e IDs de compartilhamento
CREATE TABLE metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  data JSONB NOT NULL,
  share_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  
  -- Índices para melhorar a performance das consultas
  CONSTRAINT unique_email UNIQUE (email)
);

-- Índices para consultas frequentes
CREATE INDEX idx_metrics_share_id ON metrics(share_id);
CREATE INDEX idx_metrics_email ON metrics(email);
CREATE INDEX idx_metrics_expires_at ON metrics(expires_at);
