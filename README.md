# Portal de Processamento

O **Portal de Processamento** é uma plataforma centralizada de monitoramento e gestão de fluxos de dados. Ele foi projetado para automatizar e acompanhar o processamento de informações vindas de diferentes fontes (carteiras), garantindo que as operações ocorram sem falhas e com visibilidade total para os administradores.

## 🎯 Utilidade e Objetivos

Este sistema resolve a complexidade de gerenciar múltiplos processos de importação de dados através de:
- **Monitoramento Centralizado**: Dashboard visual com taxas de sucesso, erros e status por carteira.
- **Automação**: Interface para execução e acompanhamento de scripts de processamento em background.
- **Gestão de Incidentes**: Sistema de tickets integrado para resolução de problemas técnicos.
- **Comunicação Ativa**: Notificações em tempo real sobre o estado do sistema e alertas de manutenção.
- **Segurança**: Controle de acesso robusto com diferentes níveis de permissão.

---


## 📁 Estrutura do Projeto

```
portal-2025.09.03/
├── backend/                    # API Backend (Express.js)
│   ├── scripts/               # Scripts Python de processamento
│   ├── server.js              # Servidor principal
│   ├── package.json           # Dependências backend
│   └── .env.example           # Configurações backend
├── src/                       # Frontend (React + Vite)
│   ├── components/            # Componentes React
│   ├── contexts/              # Contextos (Auth, Theme)
│   ├── hooks/                 # Hooks customizados
│   ├── pages/                 # Páginas da aplicação
│   └── config/                # Configurações (Firebase)
├── public/                    # Assets estáticos
├── package.json               # Dependências frontend
├── .env.example               # Configurações frontend
└── vite.config.ts             # Configuração Vite
```

## 🚀 Como Executar

### 1. Instalar Dependências

```bash
# Instalar dependências do frontend
npm install

# Instalar dependências do backend
npm run install:backend
```

### 2. Configurar Ambiente

#### Frontend (.env)
```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_API_URL=http://localhost:3001
```

#### Backend (.env)
```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
# Firebase Admin SDK credentials (quando implementar)
```

### 3. Executar o Sistema

```bash
# Executar frontend e backend juntos
npm run dev:full

# Ou executar separadamente:
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run dev
```

## 🔐 Autenticação Firebase

### Funcionalidades Implementadas
- ✅ **Login com email/senha**
- ✅ **Cadastro de novos usuários**
- ✅ **Verificação de email obrigatória**
- ✅ **Recuperação de senha**
- ✅ **Logout automático por inatividade**
- ✅ **Proteção de rotas autenticadas**
- ✅ **Controle de permissões por email**

### Credenciais de Teste
- **Email:** admin@portal.com
- **Senha:** admin123

### Usuário Admin
- **Email:** admin@admin
- **Senha:** admin123
- **Permissões:** Acesso total ao sistema, gerenciamento de notificações

## ️ Migração para Supabase

### Contexto da Migração
O sistema foi migrado parcialmente do Firebase Firestore para Supabase para otimizar custos e performance:

- **Firebase mantido**: Autenticação de usuários e sistema de notificações
- **Supabase implementado**: Armazenamento e consulta de tickets
- **Motivo**: Redução de custos de leitura do Firebase Firestore

### Estrutura dos Dados - Tickets
```sql
-- Tabela: tickets (Supabase)
CREATE TABLE tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  assunto TEXT NOT NULL,
  operador TEXT NOT NULL,
  status TEXT NOT NULL,
  alterado_ha TEXT NOT NULL,
  alterado_em_segundos INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Configuração Supabase
```env
# Adicionar ao .env do frontend
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Funcionalidades Migradas
- ✅ **Busca de tickets** - Migração completa para Supabase
- ✅ **Cache inteligente** - Mantido e otimizado
- ✅ **Filtros e busca** - Funcionando com novos campos
- ✅ **Ordenação** - Por tempo de alteração (segundos)
- ✅ **Cache no login** - Dados carregados automaticamente no login

### Otimização de Performance
- 🔄 **Cache automático no login** - Dados carregados em background após autenticação
- 🔄 **Cache persistente** - Dados disponíveis instantaneamente na tela
- 🔄 **Refresh em background** - Atualização automática sem travar interface
- 🔄 **Sem loading na navegação** - Experiência fluida para o usuário

## �🔔 Sistema de Notificações

### Funcionalidades
- ✅ **Notificações em Tempo Real**: Atualização automática via Firebase Firestore
- ✅ **Painel de Notificações**: Interface dedicada para visualizar notificações
- ✅ **Marcar como Lida/Não Lida**: Controle individual por usuário
- ✅ **Sistema de Prioridades**: Baixa, Média, Alta, Crítica
- ✅ **Tipos de Notificação**: Informação, Aviso, Alerta, Manutenção
- ✅ **Painel Admin**: Criação e gerenciamento de notificações (apenas admin)
- ✅ **Indicador Visual**: Badge com contador de notificações não lidas

### Como Usar
1. **Visualizar Notificações**: Clique no ícone de sino no header
2. **Marcar como Lida**: Clique no ícone de check individual
3. **Filtrar**: Use as abas "Todas" ou "Não Lidas"
4. **Gerenciar (Admin)**: Acesse "Gerenciar Notificações" no menu lateral

### Painel Admin de Notificações
- **Criar Notificação**: Formulário completo com título, conteúdo, prioridade e tipo
- **Listar Todas**: Visualização de todas as notificações ativas
- **Inativar Notificação**: Remover notificações do sistema
- **Controle de Acesso**: Apenas usuário admin pode acessar

## � Funcionalidades

### ✅ Implementadas
- ✅ **Sistema de Notificações Completo**: Tempo real com painel admin
- ✅ **Autenticação Firebase Completa**: Login, cadastro, verificação de email
- ✅ **Dashboard com Métricas**: Cards em tempo real e seletor de carteira
- ✅ **Sistema de Tickets**: Consulta, filtros e atualização de status
- ✅ **Monitoramento de Importações**: Status de 16 carteiras com execução automática
- ✅ **Tema Dark/Light**: Alternância automática com persistência
- ✅ **Interface Responsiva**: Adaptada para desktop e mobile
- ✅ **Scripts Python Organizados**: 16 scripts para processamento de carteiras

## 📊 Dashboard

### Funcionalidades Implementadas
- ✅ **Métricas em Tempo Real**: Cards com estatísticas atualizadas
- ✅ **Seletor de Carteira**: Filtro por carteira específica
- ✅ **Atividade Recente**: Histórico das últimas ações
- ✅ **Responsividade**: Interface adaptada para desktop e mobile
- ✅ **Tema Automático**: Dark/Light mode com persistência

### Componentes do Dashboard
- **MetricCard**: Cards de métricas com ícones e valores
- **CarteiraSelector**: Dropdown para seleção de carteira
- **RecentActivity**: Lista de atividades recentes com timestamps

## 🎫 Sistema de Tickets

### Funcionalidades
- ✅ **Consulta de Tickets**: Busca e filtro completo
- ✅ **Atualização de Status**: Mudança de status dos tickets
- ✅ **Estatísticas**: Contadores por status e categoria
- ✅ **Busca Avançada**: Filtros por status, prioridade e categoria
- ✅ **Interface Responsiva**: Adaptada para diferentes dispositivos

### Como Usar
1. **Buscar Tickets**: Digite no campo de busca
2. **Filtrar**: Use os dropdowns de status e prioridade
3. **Atualizar Status**: Clique nos botões de ação dos tickets
4. **Visualizar Detalhes**: Expandir tickets para ver informações completas

## 📥 Sistema de Importações

### Funcionalidades
- ✅ **Monitoramento em Tempo Real**: Status de todas as carteiras
- ✅ **Execução Automática**: Script principal `EnvioT.py`
- ✅ **16 Scripts Python**: Processamento individual por carteira
- ✅ **Relatório Formatado**: Status detalhado de cada importação
- ✅ **Interface Web**: Botão "Executar Verificação" no frontend

### Carteiras Suportadas
- Amigavel, OMEGA, OMEGA, GAMMA, Banco Master
- Banestes, BETA, OMEGA, BETA, BETA
- BETA PF, Use (e outras)

### Status Possíveis
- **Concluído**: Importação finalizada com sucesso
- **Em curso**: Importação em andamento
- **Erro**: Falha na importação
- **Não iniciado**: Aguardando execução

### Como Executar
1. Acesse "Status Importação" no menu lateral
2. Clique em "Executar Verificação"
3. Aguarde o processamento dos scripts
4. Visualize o status atualizado

## 🎨 Tema e Interface

### Funcionalidades
- ✅ **Dark/Light Mode**: Alternância automática/manual
- ✅ **Persistência**: Preferência salva no localStorage
- ✅ **Design Responsivo**: Adaptado para todos os dispositivos
- ✅ **Tailwind CSS**: Framework de estilização moderno
- ✅ **Ícones Lucide**: Biblioteca de ícones consistente

### Como Alterar Tema
- Clique no ícone de sol/lua no header
- A preferência é automaticamente salva

## 🛠️ Tecnologias

### Frontend
- **React 18** - Framework principal
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Estilização
- **React Router** - Roteamento
- **Firebase** - Autenticação e notificações
- **Supabase** - Banco de dados para tickets

### Backend
- **Node.js + Express** - API REST
- **Python** - Scripts de processamento
- **Firebase Admin SDK** - Autenticação server-side
- **CORS** - Controle de acesso cross-origin

### Banco de Dados
- **Firebase Firestore** - Autenticação e notificações em tempo real
- **Supabase** - Banco de dados para tickets (migrado de Firebase Firestore)
- **Coleções/Tabelas**:
  - `notificacoes` (Firebase) - Sistema de notificações
  - `tickets` (Supabase) - Dados dos tickets do

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Frontend apenas
npm run server           # Backend apenas
npm run dev:full         # Frontend + Backend

# Build
npm run build            # Build de produção
npm run preview          # Preview do build

# Utilitários
npm run lint             # Verificar código
npm run setup            # Instalar todas dependências
```

## 🔧 Configuração Firebase

### Passos para Configuração
1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Crie um novo projeto
3. Ative Authentication (Email/Senha)
4. Configure Firestore Database
5. Copie as credenciais para os arquivos .env

### Regras de Segurança Firestore
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir leitura para usuários autenticados
    match /notificacoes/{document} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.token.email == 'admin@admin';
    }
  }
}
```

## 📊 Funcionalidades por Página

### Home (Dashboard)
- Métricas gerais do sistema
- Seletor de carteira
- Atividade recente
- Acesso rápido às principais funções

### Consulta Tickets
- Busca e filtro de tickets
- Atualização de status
- Estatísticas por categoria
- Interface detalhada de tickets

### Status Importação
- Monitoramento de importações
- Execução de verificação
- Status em tempo real
- Relatórios de processamento

### Gerenciar Notificações (Admin)
- Criar novas notificações
- Listar notificações ativas
- Inativar notificações
- Controle administrativo

### Login/Cadastro
- Autenticação Firebase
- Verificação de email
- Recuperação de senha
- Redirecionamento automático

## 🔒 Segurança

### Implementações
- ✅ **Proteção de Rotas**: EmailVerificationGuard e ProtectedRoute
- ✅ **Controle de Acesso**: Verificação de permissões por email
- ✅ **Sessão Expirada**: Logout automático por inatividade
- ✅ **Firebase Security Rules**: Controle de acesso ao banco

### Usuários Especiais
- **Admin**: admin@admin (acesso total)
- **Usuários Regulares**: Acesso às funcionalidades básicas

## 📞 Suporte

Para dúvidas ou problemas, verifique:
1. Arquivos `.env.example` para configurações
2. Logs do terminal para erros
3. Documentação do Firebase para auth issues

---

**Status:** 🟡 Preparado para integração Firebase
**Versão:** 1.0.0
- Responsável técnico
- Datas de criação e atualização
- Tags para categorização
- Tempo de resolução (quando aplicável)

## Arquitetura Técnica

### Frontend
- **React 18** com TypeScript
- **Tailwind CSS** para estilização
- **Lucide React** para ícones
- **Vite** como bundler

### Serviços
- **Service**: Simulação da API da plataforma
- **useDashboardData**: Hook personalizado para gerenciamento de estado
- **Mock Data**: Dados de exemplo para demonstração

### Componentes Principais
- `ConsultaTickets`: Página principal de tickets
- `Home`: Dashboard com métricas e resumo
- `Sidebar`: Navegação entre módulos
- `RecentActivity`: Atividades recentes do sistema

## Como Usar

### 1. Navegação
- Use o menu lateral para navegar entre as diferentes seções
- A seção "Consulta Tickets" é a nova funcionalidade principal

### 2. Consulta de Tickets
- **Busca**: Digite no campo de busca para encontrar tickets específicos
- **Filtros**: Use os dropdowns para filtrar por status, prioridade ou categoria
- **Estatísticas**: Clique nos contadores para filtrar automaticamente

### 3. Gerenciamento de Tickets
- **Atualização de Status**: Use os botões de ação para mudar o status dos tickets
- **Visualização**: Cada ticket mostra informações completas incluindo tags e responsável
- **Responsividade**: Interface adaptada para diferentes tamanhos de tela

### 4. Dashboard
- **Métricas**: Visualize totais e estatísticas em tempo real
- **Seletor de Carteira**: Filtre dados por carteira específica
- **Atividade Recente**: Acompanhe as últimas ações do sistema

### 5. Monitoramento de Importações
- **Página Status Importação**: Acesse via menu lateral
- **Botão "Executar Verificação"**: Clique para executar o script e atualizar status
- **Status em Tempo Real**: Visualize o estado atual de cada carteira
- **Horário de Conclusão**: Para importações finalizadas

## Sistema de Importações

### Funcionamento
O sistema de importações utiliza o script `EnvioT.py` localizado em `src/import/` que:
1. Executa todos os scripts Python na pasta `src/import/scripts/`
2. Coleta o status de cada importação
3. Retorna um relatório formatado

### Formato do Relatório
```
📋 Resumo das importações:

NomeCarteira → Status da importação
NomeCarteira → Status da importação
...
```

### Status Possíveis
- **Importação concluída**: Status "Concluído"
- **Importação em curso**: Status "Em curso"
- **ERRO**: Status "Erro"
- **Outros**: Status "Não iniciado"

### Execução Manual do Script
Para testar o script Python diretamente:
```bash
python src/import/EnvioT.py
```

### Resolução do Erro de Codificação
O script foi corrigido para funcionar no Windows removendo emojis e usando codificação UTF-8 compatível.

### Formato de Saída Corrigido
```
RESUMO DAS IMPORTACOES:

NomeCarteira -> Status da importação
NomeCarteira -> Status da importação
...
```

### Status Mapeados
- **"Importação concluída"** → Status "Concluído"
- **"Importação em curso"** → Status "Em curso"  
- **"[ERRO]"** → Status "Erro"
- **Outros** → Status "Não iniciado"

## Configuração e Desenvolvimento

### Instalação
```bash
npm install
```

### Execução em Desenvolvimento
```bash
# Terminal 1: Servidor backend para execução de scripts
npm run server

# Terminal 2: Frontend
npm run dev
```

### Build para Produção
```bash
npm run build
```

### Servidor Backend
O sistema inclui um servidor Express simples (`server.js`) que:
- Executa o script Python `EnvioT.py`
- Fornece API REST para o frontend
- Roda na porta 3001

Para usar o botão "Executar Verificação" no frontend, mantenha o servidor backend rodando.

## Estrutura de Arquivos
```
src/
├── components/          # Componentes reutilizáveis
│   ├── Auth/           # Componentes de autenticação
│   ├── Dashboard/      # Componentes do dashboard
│   └── NotificationsPanel.tsx # Painel de notificações
├── contexts/           # Contextos React
├── hooks/              # Hooks customizados
├── pages/              # Páginas principais
├── services/           # Serviços de API
├── types/              # Definições TypeScript
├── config/             # Configurações (Firebase)
└── App.tsx            # Componente principal

backend/
├── scripts/            # Scripts Python de processamento
├── server.js           # Servidor Express
└── package.json        # Dependências backend
```

## Integração com

### Serviço Simulado
O `Service` simula a integração com a API real da plataforma:

- **getTickets()**: Busca todos os tickets
- **getTicketsByCarteira()**: Filtra por carteira
- **searchTickets()**: Busca por termo
- **updateTicketStatus()**: Atualiza status
- **getTicketStats()**: Estatísticas consolidadas

### Implementação Real
Para integrar com a API real do:

1. Substitua as chamadas mock no `Service`
2. Configure endpoints e autenticação
3. Implemente tratamento de erros adequado
4. Adicione cache e otimizações de performance

## 🚀 Melhorias Futuras

### Planejadas
- 🔄 **Push Notifications**: Notificações push no navegador
- 🔄 **Relatórios Avançados**: Gráficos e exportação PDF/Excel
- 🔄 **Sistema de Comentários**: Interação nos tickets
- 🔄 **Integração API Externa**: Conexão real com
- 🔄 **Dashboard Executivo**: KPIs avançados e analytics
- 🔄 **PWA**: Aplicativo web progressivo
- 🔄 **Testes Automatizados**: Cobertura completa de testes

### Otimizações Técnicas
- 🔄 **Lazy Loading**: Carregamento sob demanda
- 🔄 **Cache Inteligente**: Otimização de performance
- 🔄 **Offline Support**: Funcionamento offline básico

## Contribuição

### Padrões de Código
- **TypeScript**: Uso obrigatório para type safety
- **ESLint**: Configuração para manter qualidade do código
- **Prettier**: Formatação automática do código
- **Componentes funcionais**: Uso de hooks React modernos

### Estrutura de Commits
- `feat:` para novas funcionalidades
- `fix:` para correções de bugs
- `refactor:` para refatorações
- `docs:` para documentação

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique os logs do terminal para erros
2. Confirme as configurações nos arquivos `.env`
3. Teste a conectividade com Firebase
4. Entre em contato com a equipe de desenvolvimento

---

**Versão**: 3.0.0  
**Última Atualização**: Janeiro 2025  
**Status**: ✅ Sistema Completo e Funcional  

**Plataforma**: Portal de Processamento com Firebase 
