# IRRF App - Project Execution Plan

Este documento serve como o mapa de etapas para o desenvolvimento do IRRF App. Os agentes de IA (Cline/Cursor) devem seguir esta ordem sequencial estritamente, atualizando os checkboxes conforme avançam.

## 📊 Progresso Geral
- [x] Bloco 1: Inicialização do Ambiente e Design System Base
- [x] Bloco 2: Engenharia de Interface & Layout (UI/UX)
- [x] Bloco 3: Engenharia de Testes & Pipeline de CI
- [x] Bloco 4: Engenharia de Negócio (Lógica & Motor de Cálculo)
- [x] Bloco 5: Conexão Final & Ajustes de Acessibilidade

---

## 🧱 Detalhamento dos Blocos de Trabalho

### Bloco 1: Inicialização do Ambiente e Design System Base
**Objetivo:** Preparar o esqueleto do Next.js 15+ e configurar a identidade visual usando Tailwind v4 e shadcn/ui primitivos.
- [x] **Tarefa 1.1:** Inicializar o projeto Next.js com TypeScript em Strict Mode, removendo arquivos desnecessários.
- [x] **Tarefa 1.2:** Configurar o Tailwind v4 injetando a paleta de cores padrão (Slate) e variáveis globais via `@theme` no `src/app/globals.css`. **Garantir que nenhum `tailwind.config` seja criado.**
- [x] **Tarefa 1.3:** Instalar e testar os primeiros componentes primitivos do shadcn/ui necessários para formulários (Button, Input, Card).

### Bloco 2: Engenharia de Interface & Layout (UI/UX)
**Objetivo:** Construir toda a experiência visual do usuário e os formulários de captação de dados, utilizando dados mockados (fictícios) para os resultados.
- [x] **Tarefa 2.1:** Criar a estrutura da página principal com cabeçalho educativo, explicando de forma simples o propósito do app.
- [x] **Tarefa 2.2:** Desenvolver uma interface guiada em etapas (**Wizard Interface**) para os inputs do usuário usando *React Hook Form* e *Zod*, dividida em:
  - *Etapa 1 (Ganhos):* Inputs para Salário Bruto, Aluguéis e outras fontes.
  - *Etapa 2 (Gastos/Deduções):* Inputs para Previdência Oficial, Dependentes, Pensão Alimentícia, Saúde e Educação.
  - *Etapa 3 (Resultado):* Painel de resposta rápida com gráficos ou resumos visuais.
- [x] **Tarefa 2.3:** Implementar componentes de ajuda contextual (**Tooltips** ou **HoverCards** do shadcn/ui) em termos complexos (como "Dedução Legal", "Base de Cálculo", "PGBL/VGBL", "Parcela a Deduzir") para traduzir o "economês" em linguagem acessível.
- [x] **Tarefa 2.4:** Desenvolver a tela/painel de resultado visual (exibindo faixas de imposto, alíquota efetiva e o Guia Teórico explicativo de como declarar por conta própria), operando temporariamente com dados estáticos de forma reativa e instantânea (**Foco em UX de Resposta Rápida**).

### Bloco 3: Engenharia de Testes & Pipeline de CI
**Objetivo:** Isolar o ecossistema de testes com Vitest e configurar a esteira de automação do GitHub Actions antes de escrever a lógica matemática.
- [x] **Tarefa 3.1:** Instalar e configurar o Vitest (`vitest.config.ts`) integrado ao ambiente TypeScript do Next.js.
- [x] **Tarefa 3.2:** Criar os arquivos de testes unitários (`.test.ts`) definindo a estrutura de contratos de dados (Interfaces) que o motor de cálculo irá receber e retornar.
- [x] **Tarefa 3.3:** Mapear e escrever os casos de teste exaustivos no Vitest (cenários de salários isentos, limites exatos de faixas da tabela progressiva, múltiplos dependentes, valores zerados e tratamento de erros de valores negativos). *Nota: No Bloco 4, com o desacoplamento do motor de cálculo, estes casos serão consolidados no motor de estratégia.*
- [x] **Tarefa 3.4:** Criar o arquivo de workflow do **GitHub Actions** (`.github/workflows/ci.yml`) para automatizar o processo a cada push/PR, executando: Linting, Type Check (`tsc`) e a bateria de testes do Vitest.

### Bloco 4: Engenharia de Negócio (Lógica & Motor de Cálculo)
**Objetivo:** Implementar o algoritmo matemático de cálculo do IRRF de forma 100% desacoplada da interface, utilizando padrões de projeto e orientada a testes (TDD).
- [x] **Tarefa 4.1:** Desenvolver a interface da estratégia de cálculo utilizando o **Strategy Pattern** (`IRRFCalculationStrategy.ts`).
- [x] **Tarefa 4.2:** Implementar as funções puras de cálculo para os regimes tributários necessários (Simplificado vs. Deduções Legais) e faixas do ano-calendário vigente.
- [x] **Tarefa 4.3:** Criar a Factory simples para gerenciar a chamada da estratégia correta em tempo de execução.
- [x] **Tarefa 4.4:** Rodar localmente o Vitest de forma iterativa até que **100% dos testes unitários passem com sucesso**, cobrindo todos os cenários extremos.

### Bloco 5: Conexão Final & Ajustes de Acessibilidade
**Objetivo:** Acoplar o motor de cálculo à interface do usuário para processamento em tempo real e realizar os refinamentos de produto.
- [x] **Tarefa 5.1:** Conectar os formulários do Bloco 2 ao motor de cálculo do Bloco 4, fazendo com que o painel de resultados reaja instantaneamente a cada caractere digitado (Real-time recalculation).
- [x] **Tarefa 5.2:** Realizar uma auditoria completa de acessibilidade (a11y) garantindo que as tags HTML sejam semânticas e os leitores de tela interpretem os resultados financeiros perfeitamente.
- [x] **Tarefa 5.3:** Simular o fluxo completo de ponta a ponta e disparar o Pull Request final para validar o comportamento da Pipeline de CI e o deploy automático de visualização na Vercel.

### Bloco 6: Guia Prático e Textos Educativos
**Objetivo:** Guiar o usuário para que o mesmo possa efetuar o pagamento do seu imposto de forma independente.
- [ ] Implementar card informativo dinâmico na Etapa 3 (Painel de Resultados) ensinando o usuário a emitir o DARF e pagar via PIX/Bancos de forma independente (exibir apenas se o imposto devido for maior que zero).