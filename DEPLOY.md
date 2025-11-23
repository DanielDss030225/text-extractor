# Guia de Deploy - Text Extractor

Este guia fornece instruções passo a passo para publicar o Text Extractor no Render usando GitHub.

## Pré-requisitos

- Conta no GitHub
- Conta no Render (gratuita em https://render.com)
- Git instalado localmente

## Passo 1: Preparar o Repositório GitHub

### 1.1 Criar um novo repositório no GitHub

1. Acesse https://github.com/new
2. Nomeie o repositório como `text-extractor`
3. Escolha "Public" ou "Private" conforme preferir
4. Clique em "Create repository"

### 1.2 Fazer push do código para GitHub

```bash
# No diretório do projeto
cd text_extractor

# Inicializar git (se não estiver já inicializado)
git init

# Adicionar todos os arquivos
git add .

# Fazer commit
git commit -m "Initial commit: Text Extractor com OCR por IA"

# Adicionar remote (substitua USER e REPO pelo seu usuário e nome do repositório)
git remote add origin https://github.com/DanielDss030225/text-extractor.git

# Fazer push para main branch
git branch -M main
git push -u origin main
```

## Passo 2: Configurar no Render

### 2.1 Conectar GitHub ao Render

1. Acesse https://dashboard.render.com
2. Clique em "New +" e selecione "Web Service"
3. Escolha "Deploy an existing repository from GitHub"
4. Autorize o Render a acessar seus repositórios GitHub
5. Selecione o repositório `text-extractor`

### 2.2 Configurar o Serviço Web

1. **Name**: `text-extractor`
2. **Runtime**: `Node`
3. **Build Command**: `pnpm install && pnpm build`
4. **Start Command**: `pnpm start`
5. **Plan**: Free (ou pago se preferir melhor performance)

### 2.3 Configurar o Banco de Dados

1. Clique em "New +" e selecione "PostgreSQL"
2. **Name**: `text-extractor-db`
3. **Database**: `text_extractor`
4. **User**: `text_extractor_user`
5. **Plan**: Free

### 2.4 Adicionar Variáveis de Ambiente

No dashboard do Render, vá para o serviço web e adicione as seguintes variáveis de ambiente:

```
NODE_ENV= production

DATABASE_URL= postgres://text_extractor_user:H0puwLrKiI4qyCJVQsQTDXr1JTlTOIpx@dpg-d4hntdkhg0os738ijtag-a.oregon-postgres.render.com:5432/text_extractor

JWT_SECRET= 6fa2c1b09c2145c6a884b88ef2a99c83

VITE_APP_ID=<seu app ID Manus>

OAUTH_SERVER_URL=https://api.manus.im

VITE_OAUTH_PORTAL_URL=<seu portal URL Manus>

OWNER_OPEN_ID= 310519663107918407

OWNER_NAME= DANIEL SILVA

BUILT_IN_FORGE_API_URL=<URL da API Manus>

BUILT_IN_FORGE_API_KEY= sk-YO0A0FUnXlV3wZrGcly2k1yf6FtaIXXbYV5nK793VVC0KxxdTkoDKgelHIl2KgJ62Xc768GbnMJmFa8DYfBvd3cBkgc-

VITE_FRONTEND_FORGE_API_URL=<URL da API Manus>

VITE_FRONTEND_FORGE_API_KEY=sk-YO0A0FUnXlV3wZrGcly2k1yf6FtaIXXbYV5nK793VVC0KxxdTkoDKgelHIl2KgJ62Xc768GbnMJmFa8DYfBvd3cBkgc-

VITE_APP_TITLE=Text Extractor
VITE_ANALYTICS_ENDPOINT=<seu endpoint de analytics>
VITE_ANALYTICS_WEBSITE_ID=<seu website ID>
```

## Passo 3: Fazer Deploy

1. Após configurar todas as variáveis de ambiente, clique em "Create Web Service"
2. O Render começará automaticamente o build e deploy
3. Aguarde a conclusão (pode levar alguns minutos)
4. Acesse a URL fornecida pelo Render para testar

## Passo 4: Configurar Deploy Automático

O Render está configurado para fazer deploy automático quando você faz push para a branch `main`:

```bash
# Para fazer um novo deploy, basta fazer push
git add .
git commit -m "Descrição da mudança"
git push origin main
```

## Troubleshooting

### Erro de Banco de Dados

Se receber erro de conexão com o banco de dados:
1. Verifique se a variável `DATABASE_URL` está correta
2. Certifique-se de que o banco de dados foi criado
3. Verifique se as migrations foram executadas automaticamente

### Erro de Build

Se o build falhar:
1. Verifique os logs no dashboard do Render
2. Certifique-se de que todas as dependências estão no `package.json`
3. Verifique se há erros de TypeScript

### Erro de Variáveis de Ambiente

Se a aplicação não funcionar corretamente:
1. Verifique se todas as variáveis de ambiente estão configuradas
2. Certifique-se de que os valores estão corretos
3. Reinicie o serviço no Render

## Próximos Passos

- Configure um domínio customizado no Render
- Configure HTTPS (automático no Render)
- Configure backups do banco de dados
- Configure monitoramento e alertas

## Suporte

Para mais informações sobre deploy no Render, visite: https://render.com/docs
