import { IRRFFormData } from "./schema";

// 1. Definição das tabelas progressivas e deduções (Valores para o ano-calendário de 2025, declaração 2026)

/**
 * Tabela progressiva mensal para o cálculo do IRRF.
 * Baseada nas regras da Receita Federal para o ano-calendário de 2025 (declaração 2026).
 */
export const TABELA_PROGRESSIVA_MENSAL = [
  { limite: 2259.20, aliquota: 0, parcelaDeduzir: 0 },
  { limite: 2826.65, aliquota: 0.075, parcelaDeduzir: 169.44 },
  { limite: 3751.05, aliquota: 0.15, parcelaDeduzir: 381.93 },
  { limite: 4664.68, aliquota: 0.225, parcelaDeduzir: 662.90 },
  { limite: Infinity, aliquota: 0.275, parcelaDeduzir: 896.00 },
];

/**
 * Valor de dedução por dependente para o ano-calendário de 2025 (declaração 2026).
 */
export const DEDUCAO_POR_DEPENDENTE = 189.59;

/**
 * Limite anual de dedução com educação para o ano-calendário de 2025 (declaração 2026).
 */
export const LIMITE_DEDUCAO_EDUCACAO = 3561.50;

/**
 * Dedução padrão anual simplificada. Usada como alternativa às deduções legais.
 * Baseada nas regras da Receita Federal para o ano-calendário de 2025 (declaração 2026).
 */
export const DEDUCAO_SIMPLIFICADA_MENSAL = 564.80; // 25% do limite de isenção de R$ 2.259,20

// 2. Definição dos tipos de retorno e interfaces

export type TipoCalculo = "simplificado" | "completo";

export interface IRRFCalculationResult {
  rendimentoTributavelTotal: number;
  totalDeducoes: number;
  baseDeCalculo: number;
  impostoBruto: number; // Imposto calculado antes da parcela a deduzir
  parcelaDeduzir: number;
  impostoDevido: number;
  aliquotaEfetiva: number; // Imposto Devido / Rendimento Total
  tipoCalculoAplicado: TipoCalculo; // Indica se foi Simplificado ou Completo
}

// 3. Funções puras de cálculo

/**
 * Calcula as deduções legais mensais com base nos dados informados pelo usuário.
 * @param data Dados do formulário IRRF.
 * @returns O total de deduções legais aplicáveis.
 */
function calcularDeducoesLegais(data: IRRFFormData): number {
  let total = 0;

  // Previdência Oficial (sem limite)
  total += data.previdenciaOficial;

  // Dependentes
  total += data.dependentes * DEDUCAO_POR_DEPENDENTE;

  // Pensão Alimentícia (sem limite, se judicialmente estabelecida)
  total += data.pensaoAlimenticia;

  // Saúde (sem limite)
  total += data.saude;

  // Educação (com limite anual)
  // A dedução com educação é anual, precisamos considerar uma proporção mensal ou garantir que a base de cálculo seja anual
  // Para este motor de cálculo mensal, assumimos que o valor informado é mensal ou que a conversão será feita antes da chamada
  // Para simplificar no contexto mensal, vamos aplicar o limite anual de forma proporcional mensalmente
  const limiteMensalEducacao = LIMITE_DEDUCAO_EDUCACAO / 12; // Aproximadamente 296.79
  total += Math.min(data.educacao, limiteMensalEducacao);

  return total;
}

/**
 * Realiza o cálculo do IRRF utilizando a tabela progressiva.
 * @param baseDeCalculo A base de cálculo do imposto.
 * @returns Um objeto contendo a alíquota aplicada, a parcela a deduzir e o imposto bruto.
 */
function aplicarTabelaProgressiva(baseDeCalculo: number): { aliquota: number; parcelaDeduzir: number; impostoBruto: number } {
  for (const faixa of TABELA_PROGRESSIVA_MENSAL) {
    if (baseDeCalculo <= faixa.limite) {
      const impostoBruto = baseDeCalculo * faixa.aliquota;
      return { aliquota: faixa.aliquota, parcelaDeduzir: faixa.parcelaDeduzir, impostoBruto };
    }
  }
  // Caso a base de cálculo seja maior que a última faixa (Infinity), aplica a última alíquota e parcela
  const ultimaFaixa = TABELA_PROGRESSIVA_MENSAL[TABELA_PROGRESSIVA_MENSAL.length - 1];
  const impostoBruto = baseDeCalculo * ultimaFaixa.aliquota;
  return { aliquota: ultimaFaixa.aliquota, parcelaDeduzir: ultimaFaixa.parcelaDeduzir, impostoBruto };
}

/**
 * Função principal que calcula o IRRF com base nos dados do formulário.
 * Implementa o Strategy Pattern internamente para escolher entre cálculo simplificado e completo.
 * @param data Os dados brutos do formulário IRRF.
 * @returns Um objeto com os resultados detalhados do cálculo do IRRF.
 */
export function calcularIRRF(data: IRRFFormData): IRRFCalculationResult {
  // 1. Calcular o rendimento tributável total
  const rendimentoTributavelTotal = data.salarioBruto + data.alugueis + data.outrosGanhos;

  // 2. Calcular deduções legais
  const deducoesLegais = calcularDeducoesLegais(data);

  // 3. Calcular a dedução simplificada mensal
  const deducaoSimplificada = Math.min(DEDUCAO_SIMPLIFICADA_MENSAL, rendimentoTributavelTotal * 0.275); // Limite da dedução simplificada é 27.5% do rendimento ou o valor fixo

  let totalDeducoes: number;
  let tipoCalculoAplicado: TipoCalculo;

  // 4. Escolher o tipo de cálculo (simplificado vs. completo)
  if (deducaoSimplificada > deducoesLegais) {
    totalDeducoes = deducaoSimplificada;
    tipoCalculoAplicado = "simplificado";
  } else {
    totalDeducoes = deducoesLegais;
    tipoCalculoAplicado = "completo";
  }

  // 5. Calcular a base de cálculo
  const baseDeCalculo = Math.max(0, rendimentoTributavelTotal - totalDeducoes);

  // 6. Aplicar a tabela progressiva
  const { parcelaDeduzir, impostoBruto } = aplicarTabelaProgressiva(baseDeCalculo);

  // 7. Calcular o imposto devido
  const impostoDevido = Math.max(0, impostoBruto - parcelaDeduzir);

  // 8. Calcular a alíquota efetiva
  const aliquotaEfetiva = rendimentoTributavelTotal > 0 ? (impostoDevido / rendimentoTributavelTotal) : 0;

  return {
    rendimentoTributavelTotal,
    totalDeducoes,
    baseDeCalculo,
    impostoBruto,
    parcelaDeduzir,
    impostoDevido,
    aliquotaEfetiva,
    tipoCalculoAplicado,
  };
}
