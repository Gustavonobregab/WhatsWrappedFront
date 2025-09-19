# Internacionalização (i18n) - ZapLove

Este projeto agora suporta internacionalização com três idiomas:
- **Português (pt)** - Idioma padrão
- **Inglês (en)** - English
- **Espanhol (es)** - Español

## Como funciona

### Detecção automática de idioma
O sistema detecta automaticamente o idioma preferido do navegador do usuário e exibe o conteúdo no idioma correspondente.

### URLs com idioma
- Português: `https://seusite.com/pt/` ou `https://seusite.com/` (padrão)
- Inglês: `https://seusite.com/en/`
- Espanhol: `https://seusite.com/es/`

### Seletor de idioma
Os usuários podem alterar o idioma manualmente usando o seletor de idioma no header do site.

## Estrutura de arquivos

```
messages/
├── pt.json    # Traduções em português
├── en.json    # Traduções em inglês
└── es.json    # Traduções em espanhol

i18n.ts        # Configuração do next-intl
middleware.ts   # Middleware para roteamento de idiomas
```

## Correções Implementadas

### Problema: `notFound() is not allowed to use in root layout`
**Solução:** Removido o uso de `notFound()` da configuração do i18n e simplificado a configuração para evitar conflitos no layout raiz.

### Problema: `Cannot find module './undefined.json'`
**Solução:** 
- Criada estrutura de pastas correta com `app/[locale]/`
- Movidas todas as páginas para dentro da pasta `[locale]`
- Criado layout específico para a pasta `[locale]`
- Adicionada validação de locale no `i18n.ts`

### Problema: `No locale was returned from getRequestConfig`
**Solução:** 
- Adicionado retorno do `locale` na configuração do `i18n.ts`
- Ajustado middleware para usar `localePrefix: 'always'`
- Criada página de redirecionamento na raiz

### Problema: Site sempre mostra conteúdo em português (continuação)
**Solução adicional:** 
- Ajustado layout para usar `getMessages({ locale })`
- Desabilitado detecção automática de idioma no middleware
- Adicionado logs para debug
- Ajustado seletor de idioma para usar `window.location.href`
- Criada página de teste com mais informações de debug

### Configuração Atual
- Estrutura de pastas: `app/[locale]/` para todas as páginas (corrigida)
- Layout específico para internacionalização em `app/[locale]/layout.tsx`
- Configuração do `i18n.ts` retornando `locale` e `messages`
- Middleware configurado com `localePrefix: 'always'`
- Página de redirecionamento na raiz (`app/page.tsx`)
- Componente de debug para verificar locale
- Página de teste em `/test/` para verificar traduções

## Como adicionar novas traduções

1. Adicione a nova chave nos três arquivos de tradução (`messages/pt.json`, `messages/en.json`, `messages/es.json`)
2. Use a função `useTranslations()` nos componentes para acessar as traduções

### Exemplo:

```tsx
import { useTranslations } from 'next-intl';

function MeuComponente() {
  const t = useTranslations();
  
  return (
    <div>
      <h1>{t('common.brand')}</h1>
      <p>{t('hero.subtitle')}</p>
    </div>
  );
}
```

## Componentes atualizados

- ✅ Página principal (`app/page.tsx`)
- ✅ Hero Section (`components/hero-section.tsx`)
- ✅ Pricing Section (`components/pricing-section.tsx`)
- ✅ Página de sucesso (`app/success/[email]/page.tsx`)
- ✅ Página comece-agora (`app/comece-agora/page.tsx`)
- ✅ Layout principal (`app/layout.tsx`)
- ✅ Seletor de idioma (`components/language-selector.tsx`)

## Testando a implementação

1. Execute o projeto: `npm run dev`
2. Acesse diferentes URLs para testar:
   - `http://localhost:3000/` (português - padrão)
   - `http://localhost:3000/en/` (inglês)
   - `http://localhost:3000/es/` (espanhol)
   - `http://localhost:3000/test/` (página de teste)
3. Teste o seletor de idioma no header
4. Verifique se o conteúdo muda conforme o idioma selecionado

## Solução de Problemas

### Erro: `notFound() is not allowed to use in root layout`
- **Causa:** Uso de `notFound()` na configuração do i18n
- **Solução:** Removido `notFound()` e simplificada a configuração

### Erro: `Cannot find module './undefined.json'`
- **Causa:** Locale chegando como `undefined` e estrutura de pastas incorreta
- **Solução:** Criada estrutura `app/[locale]/` e adicionada validação de locale

### Erro: Site sempre mostra conteúdo em português
- **Causa:** Estrutura duplicada de pastas e layout não usando locale dos parâmetros
- **Solução:** Corrigida estrutura de pastas e ajustado layout

## Notas importantes

- O idioma padrão é português
- O sistema detecta automaticamente o idioma do navegador
- Os usuários podem alterar o idioma manualmente
- Todas as páginas principais foram traduzidas
- O metadata (título e descrição) também é traduzido dinamicamente
- Configuração simplificada para evitar conflitos no layout raiz
