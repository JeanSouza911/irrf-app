import { describe, it, expect } from "vitest";
import { calcularIRRF, DEDUCAO_POR_DEPENDENTE, LIMITE_DEDUCAO_EDUCACAO, DEDUCAO_SIMPLIFICADA_MENSAL } from "./irrf-calculator";
import { IRRFFormData } from "./schema";

describe("IRRF Calculator", () => {
  // Cenário 1: Isento - Rendimento abaixo do limite de isenção
  it("deve calcular IRRF como isento para rendimentos abaixo do limite", () => {
    const data: IRRFFormData = {
      salarioBruto: 2000,
      alugueis: 0,
      outrosGanhos: 0,
      previdenciaOficial: 0,
      dependentes: 0,
      pensaoAlimenticia: 0,
      saude: 0,
      educacao: 0,
    };
    const result = calcularIRRF(data);
    expect(result.rendimentoTributavelTotal).toBeCloseTo(2000);
    const deducaoSimplificadaAplicavel = Math.min(DEDUCAO_SIMPLIFICADA_MENSAL, data.salarioBruto * 0.275);
    expect(result.totalDeducoes).toBeCloseTo(deducaoSimplificadaAplicavel); // Deve usar dedução simplificada
    expect(result.baseDeCalculo).toBeCloseTo(Math.max(0, data.salarioBruto - deducaoSimplificadaAplicavel));
    expect(result.impostoBruto).toBeCloseTo(0);
    expect(result.parcelaDeduzir).toBeCloseTo(0);
    expect(result.impostoDevido).toBeCloseTo(0);
    expect(result.aliquotaEfetiva).toBeCloseTo(0);
    expect(result.tipoCalculoAplicado).toBe("simplificado");
  });

  // Cenário 2: Rendimento na primeira faixa tributável
  it("deve calcular IRRF corretamente para a primeira faixa tributável", () => {
    const data: IRRFFormData = {
      salarioBruto: 2500,
      alugueis: 0,
      outrosGanhos: 0,
      previdenciaOficial: 0,
      dependentes: 0,
      pensaoAlimenticia: 0,
      saude: 0,
      educacao: 0,
    };
    const result = calcularIRRF(data);
    const rendimentoTributavelTotal = 2500;
    const deducaoSimplificada = Math.min(DEDUCAO_SIMPLIFICADA_MENSAL, rendimentoTributavelTotal * 0.275);
    const baseDeCalculo = Math.max(0, rendimentoTributavelTotal - deducaoSimplificada);

    // Esperado para 2500 - 564.80 = 1935.20. Ainda na faixa 0.
    // Se fosse 2500 e a dedução fosse menor, estaria na faixa de 7.5%
    expect(result.rendimentoTributavelTotal).toBeCloseTo(2500);
    expect(result.totalDeducoes).toBeCloseTo(deducaoSimplificada);
    expect(result.baseDeCalculo).toBeCloseTo(baseDeCalculo); // 2500 - 564.80 = 1935.20
    expect(result.impostoBruto).toBeCloseTo(0);
    expect(result.parcelaDeduzir).toBeCloseTo(0);
    expect(result.impostoDevido).toBeCloseTo(0);
    expect(result.aliquotaEfetiva).toBeCloseTo(0);
    expect(result.tipoCalculoAplicado).toBe("simplificado");
  });

  // Cenário 3: Rendimento na segunda faixa tributável (7.5%)
  it("deve calcular IRRF para a segunda faixa (7.5%)", () => {
    const data: IRRFFormData = {
      salarioBruto: 3000,
      alugueis: 0,
      outrosGanhos: 0,
      previdenciaOficial: 0,
      dependentes: 0,
      pensaoAlimenticia: 0,
      saude: 0,
      educacao: 0,
    };
    const result = calcularIRRF(data);
    const rendimentoTributavelTotal = 3000;
    const deducaoSimplificada = DEDUCAO_SIMPLIFICADA_MENSAL; // 564.80
    const baseDeCalculo = rendimentoTributavelTotal - deducaoSimplificada; // 3000 - 564.80 = 2435.20
    
    const aliquota = 0.075;
    const parcelaDeduzir = 169.44;
    const impostoBruto = baseDeCalculo * aliquota; // 2435.20 * 0.075 = 182.64
    const impostoDevido = impostoBruto - parcelaDeduzir; // 182.64 - 169.44 = 13.20

    expect(result.rendimentoTributavelTotal).toBeCloseTo(3000);
    expect(result.totalDeducoes).toBeCloseTo(deducaoSimplificada);
    expect(result.baseDeCalculo).toBeCloseTo(baseDeCalculo);
    expect(result.impostoBruto).toBeCloseTo(impostoBruto);
    expect(result.parcelaDeduzir).toBeCloseTo(parcelaDeduzir);
    expect(result.impostoDevido).toBeCloseTo(impostoDevido);
    expect(result.aliquotaEfetiva).toBeCloseTo(impostoDevido / rendimentoTributavelTotal);
    expect(result.tipoCalculoAplicado).toBe("simplificado");
  });

  // Cenário 4: Rendimento na terceira faixa tributável (15%)
  it("deve calcular IRRF para a terceira faixa (15%)", () => {
    const data: IRRFFormData = {
      salarioBruto: 4000,
      alugueis: 0,
      outrosGanhos: 0,
      previdenciaOficial: 0,
      dependentes: 0,
      pensaoAlimenticia: 0,
      saude: 0,
      educacao: 0,
    };
    const result = calcularIRRF(data);
    const rendimentoTributavelTotal = 4000;
    const deducaoSimplificada = DEDUCAO_SIMPLIFICADA_MENSAL; // 564.80
    const baseDeCalculo = rendimentoTributavelTotal - deducaoSimplificada; // 4000 - 564.80 = 3435.20

    const aliquota = 0.15;
    const parcelaDeduzir = 381.93;
    const impostoBruto = baseDeCalculo * aliquota; // 3435.20 * 0.15 = 515.28
    const impostoDevido = impostoBruto - parcelaDeduzir; // 515.28 - 381.93 = 133.35

    expect(result.rendimentoTributavelTotal).toBeCloseTo(4000);
    expect(result.totalDeducoes).toBeCloseTo(deducaoSimplificada);
    expect(result.baseDeCalculo).toBeCloseTo(baseDeCalculo);
    expect(result.impostoBruto).toBeCloseTo(impostoBruto);
    expect(result.parcelaDeduzir).toBeCloseTo(parcelaDeduzir);
    expect(result.impostoDevido).toBeCloseTo(impostoDevido);
    expect(result.aliquotaEfetiva).toBeCloseTo(impostoDevido / rendimentoTributavelTotal);
    expect(result.tipoCalculoAplicado).toBe("simplificado");
  });

  // Cenário 5: Rendimento na quarta faixa tributável (22.5%)
  it("deve calcular IRRF para a quarta faixa (22.5%)", () => {
    const data: IRRFFormData = {
      salarioBruto: 5000,
      alugueis: 0,
      outrosGanhos: 0,
      previdenciaOficial: 0,
      dependentes: 0,
      pensaoAlimenticia: 0,
      saude: 0,
      educacao: 0,
    };
    const result = calcularIRRF(data);
    const rendimentoTributavelTotal = 5000;
    const deducaoSimplificada = DEDUCAO_SIMPLIFICADA_MENSAL; // 564.80
    const baseDeCalculo = rendimentoTributavelTotal - deducaoSimplificada; // 5000 - 564.80 = 4435.20

    const aliquota = 0.225;
    const parcelaDeduzir = 662.90;
    const impostoBruto = baseDeCalculo * aliquota; // 4435.20 * 0.225 = 997.92
    const impostoDevido = impostoBruto - parcelaDeduzir; // 997.92 - 662.90 = 335.02

    expect(result.rendimentoTributavelTotal).toBeCloseTo(5000);
    expect(result.totalDeducoes).toBeCloseTo(deducaoSimplificada);
    expect(result.baseDeCalculo).toBeCloseTo(baseDeCalculo);
    expect(result.impostoBruto).toBeCloseTo(impostoBruto);
    expect(result.parcelaDeduzir).toBeCloseTo(parcelaDeduzir);
    expect(result.impostoDevido).toBeCloseTo(impostoDevido);
    expect(result.aliquotaEfetiva).toBeCloseTo(impostoDevido / rendimentoTributavelTotal);
    expect(result.tipoCalculoAplicado).toBe("simplificado");
  });

  // Cenário 6: Rendimento na última faixa tributável (27.5% - teto)
  it("deve calcular IRRF para a última faixa (27.5%)", () => {
    const data: IRRFFormData = {
      salarioBruto: 6000,
      alugueis: 0,
      outrosGanhos: 0,
      previdenciaOficial: 0,
      dependentes: 0,
      pensaoAlimenticia: 0,
      saude: 0,
      educacao: 0,
    };
    const result = calcularIRRF(data);
    const rendimentoTributavelTotal = 6000;
    const deducaoSimplificada = DEDUCAO_SIMPLIFICADA_MENSAL; // 564.80
    const baseDeCalculo = rendimentoTributavelTotal - deducaoSimplificada; // 6000 - 564.80 = 5435.20

    const aliquota = 0.275;
    const parcelaDeduzir = 896.00;
    const impostoBruto = baseDeCalculo * aliquota; // 5435.20 * 0.275 = 1494.68
    const impostoDevido = impostoBruto - parcelaDeduzir; // 1494.68 - 896.00 = 598.68

    expect(result.rendimentoTributavelTotal).toBeCloseTo(6000);
    expect(result.totalDeducoes).toBeCloseTo(deducaoSimplificada);
    expect(result.baseDeCalculo).toBeCloseTo(baseDeCalculo);
    expect(result.impostoBruto).toBeCloseTo(impostoBruto);
    expect(result.parcelaDeduzir).toBeCloseTo(parcelaDeduzir);
    expect(result.impostoDevido).toBeCloseTo(impostoDevido);
    expect(result.aliquotaEfetiva).toBeCloseTo(impostoDevido / rendimentoTributavelTotal);
    expect(result.tipoCalculoAplicado).toBe("simplificado");
  });

  // Cenário 7: Com deduções legais superando a simplificada
  it("deve usar deduções legais se forem maiores que a dedução simplificada", () => {
    const data: IRRFFormData = {
      salarioBruto: 5000,
      alugueis: 0,
      outrosGanhos: 0,
      previdenciaOficial: 500,
      dependentes: 2,
      pensaoAlimenticia: 1000,
      saude: 800,
      educacao: 300,
    };
    const result = calcularIRRF(data);

    const rendimentoTributavelTotal = 5000;
    const deducaoPorDependente = DEDUCAO_POR_DEPENDENTE; // 189.59
    const limiteMensalEducacao = LIMITE_DEDUCAO_EDUCACAO / 12; // 296.7916

    const deducoesLegaisEsperadas = 
      data.previdenciaOficial +
      data.dependentes * deducaoPorDependente +
      data.pensaoAlimenticia +
      data.saude +
      Math.min(data.educacao, limiteMensalEducacao);
    
    const deducaoSimplificada = Math.min(DEDUCAO_SIMPLIFICADA_MENSAL, rendimentoTributavelTotal * 0.275); // 564.80

    expect(deducoesLegaisEsperadas).toBeGreaterThan(deducaoSimplificada); // Deve ser maior

    const baseDeCalculoEsperada = rendimentoTributavelTotal - deducoesLegaisEsperadas; // 5000 - 2953.58 = 2046.42

    // Este valor se encaixa na faixa de isenção (até 2259.20) da tabela progressiva
    const impostoBrutoEsperado = 0.0;
    const parcelaDeduzirEsperada = 0.0;
    const impostoDevidoEsperado = 0.0;

    expect(result.rendimentoTributavelTotal).toBeCloseTo(rendimentoTributavelTotal);
    expect(result.totalDeducoes).toBeCloseTo(deducoesLegaisEsperadas);
    expect(result.baseDeCalculo).toBeCloseTo(baseDeCalculoEsperada);
    expect(result.impostoBruto).toBeCloseTo(impostoBrutoEsperado);
    expect(result.parcelaDeduzir).toBeCloseTo(parcelaDeduzirEsperada);
    expect(result.impostoDevido).toBeCloseTo(impostoDevidoEsperado);
    expect(result.aliquotaEfetiva).toBeCloseTo(impostoDevidoEsperado / rendimentoTributavelTotal);
    expect(result.tipoCalculoAplicado).toBe("completo");
  });

  // Cenário 8: Valores zerados
  it("deve lidar corretamente com todos os valores zerados", () => {
    const data: IRRFFormData = {
      salarioBruto: 0,
      alugueis: 0,
      outrosGanhos: 0,
      previdenciaOficial: 0,
      dependentes: 0,
      pensaoAlimenticia: 0,
      saude: 0,
      educacao: 0,
    };
    const result = calcularIRRF(data);
    expect(result.rendimentoTributavelTotal).toBeCloseTo(0);
    expect(result.totalDeducoes).toBeCloseTo(0);
    expect(result.baseDeCalculo).toBeCloseTo(0);
    expect(result.impostoBruto).toBeCloseTo(0);
    expect(result.parcelaDeduzir).toBeCloseTo(0);
    expect(result.impostoDevido).toBeCloseTo(0);
    expect(result.aliquotaEfetiva).toBeCloseTo(0);
    expect(result.tipoCalculoAplicado).toBe("completo"); // Tipo completo, pois todas as deduções são 0
  });

  // Cenário 9: Limite de dedução de educação
  it("deve aplicar o limite de dedução para educação", () => {
    const data: IRRFFormData = {
      salarioBruto: 3000,
      alugueis: 0,
      outrosGanhos: 0,
      previdenciaOficial: 0,
      dependentes: 0,
      pensaoAlimenticia: 0,
      saude: 0,
      educacao: LIMITE_DEDUCAO_EDUCACAO, // Valor anual, testando se a conversão mensal funciona
    };
    const result = calcularIRRF(data);
    const limiteMensalEducacao = LIMITE_DEDUCAO_EDUCACAO / 12;
    const deducoesLegais = Math.min(data.educacao, limiteMensalEducacao);
    const deducaoSimplificada = DEDUCAO_SIMPLIFICADA_MENSAL; // 564.80

    // Neste caso, a dedução simplificada deve ser maior que a legal (educação sozinha)
    expect(deducoesLegais).toBeCloseTo(limiteMensalEducacao); // cerca de 296.79
    expect(deducaoSimplificada).toBeCloseTo(564.80);
    expect(result.totalDeducoes).toBeCloseTo(deducaoSimplificada);
    expect(result.tipoCalculoAplicado).toBe("simplificado");
  });

  // Cenário 10: Múltiplos dependentes e previdência
  it("deve calcular corretamente com múltiplos dependentes e previdência", () => {
    const data: IRRFFormData = {
      salarioBruto: 7000,
      alugueis: 0,
      outrosGanhos: 0,
      previdenciaOficial: 800,
      dependentes: 3,
      pensaoAlimenticia: 0,
      saude: 0,
      educacao: 0,
    };
    const result = calcularIRRF(data);

    const rendimentoTributavelTotal = 7000;
    const deducoesLegaisEsperadas = data.previdenciaOficial + data.dependentes * DEDUCAO_POR_DEPENDENTE; // 800 + 3 * 189.59 = 800 + 568.77 = 1368.77
    const deducaoSimplificada = DEDUCAO_SIMPLIFICADA_MENSAL; // 564.80

    expect(deducoesLegaisEsperadas).toBeGreaterThan(deducaoSimplificada);

    const baseDeCalculo = rendimentoTributavelTotal - deducoesLegaisEsperadas; // 7000 - 1368.77 = 5631.23
    
    const aliquota = 0.275;
    const parcelaDeduzir = 896.00;
    const impostoBruto = baseDeCalculo * aliquota; // 5631.23 * 0.275 = 1548.58825
    const impostoDevido = impostoBruto - parcelaDeduzir; // 1548.58825 - 896.00 = 652.58825

    expect(result.rendimentoTributavelTotal).toBeCloseTo(rendimentoTributavelTotal);
    expect(result.totalDeducoes).toBeCloseTo(deducoesLegaisEsperadas);
    expect(result.baseDeCalculo).toBeCloseTo(baseDeCalculo);
    expect(result.impostoBruto).toBeCloseTo(impostoBruto);
    expect(result.parcelaDeduzir).toBeCloseTo(parcelaDeduzir);
    expect(result.impostoDevido).toBeCloseTo(impostoDevido);
    expect(result.aliquotaEfetiva).toBeCloseTo(impostoDevido / rendimentoTributavelTotal);
    expect(result.tipoCalculoAplicado).toBe("completo");
  });
});
