# 🧪 Colmeia QA — Test Automation Project

Projeto de automação E2E para [teste-colmeia-qa.colmeia-corp.com](https://teste-colmeia-qa.colmeia-corp.com), cobrindo os principais fluxos da plataforma, **documentação de bugs ativos** e validação de comportamento esperado.

---

## 🎬 Walkthrough

> _Adicione aqui o link do vídeo de demonstração após a gravação._

---

## 🐞 Bugs Documentados

Os testes marcados com `[BUG-XX]` no título **documentam comportamentos incorretos ativos** na plataforma. Esses testes estão escritos para validar o comportamento **esperado** — ou seja, falharão enquanto o bug não for corrigido, servindo como alerta automático para o time de desenvolvimento.

| ID | Descrição | Severidade | Spec |
|---|---|---|---|
| BUG-01 | Login com credenciais válidas exibe modal de erro; usuário precisa clicar em "Continuar" | 🔴 Alta | `login.cy.ts` |
| BUG-02 | Botão "Arquivar" remove o banco do front em vez de movê-lo para a seção Arquivados | 🔴 Alta | `database.cy.ts` |
| BUG-03 | Ícone de atualizar (setinha) exclui o banco de dados em vez de recarregar o componente | 🔴 Alta | `database.cy.ts` |
| BUG-04 | Navegar para outro link da plataforma exclui o banco de dados criado | 🔴 Alta | `database.cy.ts` |
| BUG-05 | Botão "Colmeia Forms" redireciona para componente renderizado sem conteúdo | 🟡 Média | `navigation.cy.ts` |

---

## 📋 Visão Geral

O objetivo do projeto é validar os principais fluxos de usuário da plataforma Colmeia, com foco em:

- Autenticação e redirecionamento pós-login
- Gerenciamento de bancos de dados (criação, arquivamento, persistência)
- Navegação entre seções da plataforma
- Comportamento do módulo Colmeia Forms

A estratégia adotada documenta tanto os **happy paths** quanto os **bugs conhecidos**, garantindo que qualquer regressão seja detectada automaticamente no CI.

**Total de testes: 15 E2E**

---

## 🚀 Stack Tecnológica

| Ferramenta | Versão | Justificativa |
|---|---|---|
| **Cypress** | ^15.11.0 | Framework E2E maduro com excelente DX, runner visual, time-travel debugging e suporte nativo a TypeScript sem configuração extra |
| **TypeScript** | ^5.4 | Tipagem estática nos Page Objects elimina erros de seletor em tempo de desenvolvimento e melhora a manutenção |

---

## 🏗️ Arquitetura do Projeto

```
colmeia-cypress/
│
├── .github/
│   └── workflows/
│       └── cypress.yml              # Pipeline CI/CD
│
├── cypress/
│   ├── e2e/                         # Specs (15 testes)
│   │   ├── login.cy.ts              # Autenticação + BUG-01
│   │   ├── database.cy.ts           # Banco de dados + BUGs 02, 03, 04
│   │   └── navigation.cy.ts         # Navegação + BUG-05
│   │
│   ├── pages/                       # Page Objects (POM)
│   │   ├── LoginPage.ts
│   │   ├── DashboardPage.ts
│   │   └── DatabasePage.ts
│   │
│   ├── fixtures/
│   │   └── users.json               # Dados de teste centralizados
│   │
│   └── support/
│       ├── e2e.ts                   # Configurações globais
│       └── commands.ts              # Custom commands (loginWithBugWorkaround)
│
├── cypress.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🧩 Design Patterns

### Page Object Model (POM)

Cada área da aplicação tem sua classe TypeScript dedicada. Os seletores ficam **encapsulados** nas classes e nunca aparecem diretamente nos specs. Quando um seletor muda na aplicação, a correção acontece em **um único lugar**.

```typescript
// ❌ Sem POM — seletor espalhado pelo spec
cy.get('button[type="submit"]').click();

// ✅ Com POM — ação semanticamente clara
loginPage.clickLogin();
```

### Padrão AAA (Arrange, Act, Assert)

Todos os testes seguem a estrutura de três seções comentadas explicitamente:

```typescript
it("should do something", () => {
  // Arrange — prepara dados e estado inicial
  // Act     — executa a ação sendo testada
  // Assert  — verifica o resultado esperado
});
```

### Custom Command para Bug Workaround

O BUG-01 exige um passo extra de interação (clicar em "Continuar" no modal) para que o usuário chegue ao dashboard. Em vez de repetir essa lógica em todos os testes que precisam de login, ela foi encapsulada em um **custom command**:

```typescript
cy.loginWithBugWorkaround(email, password);
```

Quando o BUG-01 for corrigido, basta remover o clique no modal de dentro do comando — todos os testes continuarão funcionando sem alteração.

---

## 🤖 Integração com LLM — Processo de Geração

Este projeto foi desenvolvido através de um fluxo estruturado de **prompt engineering colaborativo** entre **ChatGPT-4o** (mapeamento exploratório da aplicação e classificação de bugs por severidade) e **Claude Sonnet** (geração de código de produção, arquitetura e documentação técnica).

O processo seguiu estas etapas:

1. **Análise de domínio e bug mapping com GPT-4o:** a partir da lista de bugs fornecida pelo QA Engineer, o GPT categorizou os problemas por severidade e identificou as dependências entre eles (ex: BUG-02 bloqueia a validação da tela de Arquivados).

2. **Definição de estratégia de teste com Claude:** os bugs foram classificados em dois tipos de testes — *documentação de comportamento atual* (testes que passam enquanto o bug existe) vs. *validação de comportamento esperado* (testes que falham enquanto o bug existe, quebrando o CI). Claude optou pela segunda abordagem por ser mais útil como safety net de regressão.

3. **Geração de código e refinamento iterativo:** cada módulo (Page Objects, specs, commands) foi gerado em contexto separado para manter qualidade e coesão, com revisão humana entre as etapas.

4. **Decisão arquitetural sobre o workaround do BUG-01:** Claude sugeriu isolar o workaround em um custom command (`loginWithBugWorkaround`) para que a correção futura do bug impacte apenas um arquivo, mantendo os specs estáveis.

---

## ⚙️ CI/CD — GitHub Actions

O workflow em `.github/workflows/cypress.yml` executa em **push** e **pull_request** para `main` e `develop`.

### Etapas do pipeline:

1. **Checkout** do repositório
2. **Setup Node.js 20** com cache npm
3. **`npm ci`** — instalação determinística
4. **Cypress GitHub Action oficial** — executa todos os specs em Chrome headless
5. **Upload de screenshots** em caso de falha (retido 7 dias)
6. **Upload de vídeos** sempre (retido 7 dias)

> **Nota sobre os testes de bug:** os testes `[BUG-XX]` estão escritos para validar o comportamento **esperado**, portanto **falharão no CI** enquanto os bugs estiverem ativos. Isso é intencional — serve como evidência automatizada do bug e como alerta de regressão quando a correção for deployada.

---

## ▶️ Como Rodar o Projeto

### Pré-requisitos

- Node.js >= 18
- npm >= 9

### Instalação

```bash
npm install
```

### Abrir o Cypress Runner (modo interativo)

```bash
npm run cy:open
```

### Executar todos os testes (headless)

```bash
npm run cy:run
```

### Executar por suite

```bash
# Apenas testes de login
npm run cy:run:login

# Apenas testes de banco de dados
npm run cy:run:database

# Apenas testes de navegação
npm run cy:run:navigation
```

---

## 💼 Business Case — Questões Relevantes

### 1. O modal de erro no login representa risco de perda de usuários?

Sim. Um usuário novo que não sabe que precisa clicar em "Continuar" pode interpretar o modal como falha de autenticação e abandonar a plataforma. **Recomendação:** priorizar correção do BUG-01 como blocker de release.

### 2. Os bugs de exclusão de banco de dados representam risco de perda de dados reais?

Os BUGs 02, 03 e 04 removem bancos do front, mas é necessário confirmar com o time de backend se a exclusão é apenas visual (estado não persiste no banco) ou se os dados são efetivamente deletados do servidor. Se for deleção real, o risco é **crítico**.

### 3. Como garantir que bugs corrigidos não regridam?

Com os testes `[BUG-XX]` escritos para o comportamento esperado, a própria suíte serve de safety net. Quando o bug for corrigido, o teste passará; se uma futura mudança reintroduzir o problema, o teste voltará a falhar e quebrará o CI automaticamente.
