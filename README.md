# IRRF App 🧮

O **IRRF App** é um guia prático, educativo e focado em acessibilidade universal, projetado para desmistificar o Imposto de Renda Retido na Fonte (IRRF). O objetivo primordial do aplicativo é transformar termos burocráticos em respostas acionáveis, permitindo que qualquer cidadão entenda se precisa pagar, quando, como, quanto e a que se refere o seu imposto, capacitando-o a declarar de forma totalmente independente.

---

## 🎯 Missão e Objetivos do Produto

1. **Clareza Educativa:** Explicar de forma simples todas as fontes e variações que geram IRRF (indo além do salário tradicional). Usar assistentes contextuais (Tooltips/HoverCards) para traduzir o "economês".
2. **Independência do Usuário:** Ensinar o usuário a realizar a sua declaração por conta própria e fornecer as opções/caminhos para a emissão e pagamento de guias.
3. **Privacidade e Simplicidade Extrema:** O aplicativo **não possui banco de dados, telas de login ou cadastros**. O processamento é 100% local (*Client-Side*). O usuário entra, insere os dados de forma anônima e obtém o resultado imediatamente.
4. **Acessibilidade Universal (a11y):** Interface fluida, direta e sem barreiras de complexidade, garantindo conformidade com padrões de navegação por teclado e leitores de tela.

---

## 🛠️ Stack Tecnológico & Justificativa de Engenharia

O ecossistema do projeto foi blindado utilizando tecnologias de ponta, selecionadas estrategicamente para garantir performance, tipagem estática forte e uma experiência de desenvolvimento ágil:

### Core Stack

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
* **Justificativa:** O **Next.js 15+ (App Router)** foi escolhido por ser o padrão de mercado para aplicações React modernas. Ele nos dá uma estrutura de rotas robusta, excelente otimização de assets e total flexibilidade caso decidamos mover partes do conteúdo educativo para Server-Side Rendering (SSR) no futuro visando otimização de SEO, mantendo o motor de cálculo instantâneo no Client-Side.

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
* **Justificativa:** Como lidamos com dados financeiros sensíveis (valores monetários, alíquotas, faixas tributárias), o **TypeScript em Strict Mode** é indispensável. Ele blinda o código contra erros em tempo de compilação (como operar valores nulos ou indefinidos) e garante contratos de dados idôneos para o nosso motor de cálculo.

![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
* **Justificativa:** O **Tailwind CSS v4** adota uma abordagem *CSS-First*, eliminando arquivos de configuração JavaScript complexos e utilizando a diretiva `@theme` diretamente no CSS global. Isso garante builds muito mais velozes e uma integração limpa com variáveis nativas do CSS para o nosso Design System.

![shadcn/ui](https://img.shields.io/badge/shadcn/ui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)
* **Justificativa:** Em vez de reinventar a roda criando componentes do zero, o **shadcn/ui** nos fornece componentes primitivos de altíssima qualidade (baseados em Radix UI). Ele garante acessibilidade nativa (a11y), suporte completo a leitores de tela e navegação por teclado, atendendo ao requisito de ser um "App para todos".

### Ecossistema Auxiliar & Qualidade

![Zod](https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white)
* **Justificativa:** Utilizado para criar esquemas de validação rígidos no lado do cliente. O **Zod** intercepta as entradas dos formulários, garantindo que o usuário digite apenas dados válidos (como números positivos e strings sanitizadas) antes mesmo de a informação tocar as funções de cálculo.

![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)
* **Justificativa:** O **Vitest** substitui o Jest por sua velocidade brutal através da execução nativa baseada em ESM. Como nosso projeto tem como premissa uma cobertura exaustiva de testes de unidade nas regras de negócio, o Vitest reduz o tempo de feedback na pipeline de CI local e remota.

![React Hook Form](https://img.shields.io/badge/React_Hook_Form-EC5990?style=for-the-badge&logo=reacthookform&logoColor=white)
* **Justificativa:** Gerencia o estado dos formulários de entrada de dados de maneira performática. Diferente do estado tradicional do React, ele evita re-renderizações desnecessárias a cada caractere digitado pelo usuário, mantendo a experiência fluida mesmo em dispositivos de baixo desempenho.

![Lucide Icons](https://img.shields.io/badge/Lucide_React-F59E0B?style=for-the-badge&logo=lucide&logoColor=white)
* **Justificativa:** Pacote de ícones leve, consistente e altamente customizável via classes do Tailwind, perfeito para sinalizar alertas, dicas visuais e guias passo a passo de forma elegante.

---

## 📐 Engenharia e Arquitetura de Software

Para garantir que o projeto seja escalável e resiliente a futuras mudanças anuais de tabelas da Receita Federal, aplicamos rigorosos padrões de arquitetura:

### 1. Desacoplamento do Motor de Cálculo
Toda a lógica de negócio (tabelas progressivas, alíquotas, deduções por dependente, tetos de previdência) deve ser completamente isolada dos componentes visuais de interface.

### 2. Design Patterns
- **Strategy Pattern:** Implementação de funções puras TypeScript (`.ts`) isoladas para cada tipo de cálculo, ano-calendário ou regime de tributação (Simplificado vs. Deduções Legais).
- **Factory Pattern:** Uma fábrica simples instanciará a estratégia correta em tempo de execução com base nas seleções do usuário.

### 3. Esteira de Qualidade (Pipeline CI)
O repositório utiliza **GitHub Actions** para rodar uma esteira de Integração Contínua (CI) a cada *Push* ou *Pull Request*:
- Validação de tipagem (`tsc --noEmit`).
- Verificação de padrões de Clean Code (Linting).
- Execução exaustiva da bateria de testes no Vitest (Foco em 100% de cobertura no motor de cálculo, testando cenários de limites de faixas, valores zerados e negativos).

### 4. Deploy Automatizado
Hospedagem e deploy contínuo via **Vercel**, gerando URLs de *Preview* automáticas para validação de layout a cada Pull Request e deploy em produção apenas após a aprovação da esteira de CI na branch principal.

---

## 🚦 Diretrizes de Desenvolvimento (Boas Práticas)

- **Semantic Commits:** Uso estrito do padrão *Conventional Commits* (ex: `feat(core): ...`, `test(core): ...`, `style(ui): ...`).
- **Tailwind v4 Constraint:** **NUNCA** crie ou modifique um arquivo `tailwind.config.js/ts`. Toda e qualquer customização de tema e paleta de cores deve ser feita centralizada no arquivo de estilo global (`src/app/globals.css`) usando a diretiva `@theme`.
- **Formulários e Validação:** Todos os inputs do usuário devem ser blindados e sanitizados via esquemas do **Zod** antes de atingirem o motor de cálculo.
- **Evolução Progressiva:** O desenvolvimento seguirá estritamente o fluxo planejado: primeiro a validação visual do layout, seguida pelo isolamento de contratos de dados, testes unitários exaustivos e, por fim, a implementação da lógica matemática.