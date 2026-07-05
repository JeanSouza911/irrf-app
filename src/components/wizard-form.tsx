"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { irrfFormSchema, type IRRFFormData } from "@/lib/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Coins, PiggyBank, Receipt, ArrowLeft, ArrowRight, RotateCcw, Info } from "lucide-react";
import { calcularIRRF } from "@/lib/irrf-calculator";

type Step = 1 | 2 | 3;

export default function WizardForm() {
  const [step, setStep] = useState<Step>(1);

  const {
    register,
    control,
    reset,
    formState: { errors, isValid },
  } = useForm<IRRFFormData>({
    resolver: zodResolver(irrfFormSchema) as import("react-hook-form").Resolver<IRRFFormData>,
    mode: "onChange",
  });

  const formData = useWatch({ control });

  const handleNextStep = () => {
    if (step < 3) {
      setStep((prev) => (prev + 1) as Step);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as Step);
    }
  };

  const handleReset = () => {
    reset();
    setStep(1);
  };

  const result = calcularIRRF({
    salarioBruto: Number(formData.salarioBruto || 0),
    alugueis: Number(formData.alugueis || 0),
    outrosGanhos: Number(formData.outrosGanhos || 0),
    previdenciaOficial: Number(formData.previdenciaOficial || 0),
    dependentes: Number(formData.dependentes || 0),
    pensaoAlimenticia: Number(formData.pensaoAlimenticia || 0),
    saude: Number(formData.saude || 0),
    educacao: Number(formData.educacao || 0),
  });

  const {
    rendimentoTributavelTotal,
    totalDeducoes,
    baseDeCalculo,
    impostoDevido,
    aliquotaEfetiva,
    tipoCalculoAplicado,
  } = result;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Barra de Progresso Visual */}
      <nav aria-label="Progresso das etapas" className="mb-8">
        <ol className="flex items-center justify-between w-full relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
          
          {/* Etapa 1 */}
          <li className="z-10 flex flex-col items-center">
            <span
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 font-semibold transition-all duration-300 ${
                step >= 1
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "bg-white border-slate-300 text-slate-500"
              }`}
            >
              1
            </span>
            <span className="text-xs font-medium mt-2 text-slate-700">Ganhos</span>
          </li>

          {/* Etapa 2 */}
          <li className="z-10 flex flex-col items-center">
            <span
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 font-semibold transition-all duration-300 ${
                step >= 2
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "bg-white border-slate-300 text-slate-500"
              }`}
            >
              2
            </span>
            <span className="text-xs font-medium mt-2 text-slate-700">Deduções</span>
          </li>

          {/* Etapa 3 */}
          <li className="z-10 flex flex-col items-center">
            <span
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 font-semibold transition-all duration-300 ${
                step === 3
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "bg-white border-slate-300 text-slate-500"
              }`}
            >
              3
            </span>
            <span className="text-xs font-medium mt-2 text-slate-700">Resultado</span>
          </li>
        </ol>
      </nav>

      {/* Formulário Wizard */}
      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        {step === 1 && (
          <Card>
            <CardHeader className="space-y-1">
              <div className="flex items-center gap-2 text-blue-600">
                <Coins className="w-5 h-5" />
                <CardTitle className="text-xl">Etapa 1: Seus Rendimentos e Ganhos</CardTitle>
              </div>
              <CardDescription>
                Informe todos os valores recebidos por você ao longo do ano para compor sua base de rendimentos tributáveis.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="salarioBruto" className="text-sm font-semibold text-slate-700">
                    Salário Bruto Mensal / Anual
                  </label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-4 h-4 text-slate-400 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Informe o total de rendimentos, incluindo salário, pró-labore e outras remunerações.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">R$</span>
                  <Input
                    id="salarioBruto"
                    type="number"
                    step="0.01"
                    className="pl-9"
                    placeholder="0,00"
                    {...register("salarioBruto")}
                  />
                </div>
                {errors.salarioBruto && (
                  <p className="text-xs text-red-500 font-medium">{errors.salarioBruto.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="alugueis" className="text-sm font-semibold text-slate-700">
                      Aluguéis Recebidos
                    </label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-4 h-4 text-slate-400 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Declare os valores de aluguéis recebidos de pessoas físicas ou jurídicas.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">R$</span>
                    <Input
                      id="alugueis"
                      type="number"
                      step="0.01"
                      className="pl-9"
                      placeholder="0,00"
                      {...register("alugueis")}
                    />
                  </div>
                  {errors.alugueis && (
                    <p className="text-xs text-red-500 font-medium">{errors.alugueis.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="outrosGanhos" className="text-sm font-semibold text-slate-700">
                      Outros Ganhos Tributáveis
                    </label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-4 h-4 text-slate-400 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Inclua aqui outras rendas tributáveis, como trabalho autônomo, MEI, ou rendimentos do exterior.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">R$</span>
                    <Input
                      id="outrosGanhos"
                      type="number"
                      step="0.01"
                      className="pl-9"
                      placeholder="0,00"
                      {...register("outrosGanhos")}
                    />
                  </div>
                  {errors.outrosGanhos && (
                    <p className="text-xs text-red-500 font-medium">{errors.outrosGanhos.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end pt-4 border-t border-slate-100">
              <Button type="button" onClick={handleNextStep} disabled={!isValid} className="gap-2">
                Avançar para Deduções <ArrowRight className="w-4 h-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader className="space-y-1">
              <div className="flex items-center gap-2 text-blue-600">
                <PiggyBank className="w-5 h-5" />
                <CardTitle className="text-xl">Etapa 2: Gastos e Deduções Legais</CardTitle>
              </div>
              <CardDescription>
                Gastos permitidos por lei que ajudam a reduzir legalmente o valor sobre o qual o imposto será calculado.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="previdenciaOficial" className="text-sm font-semibold text-slate-700">
                      Previdência Oficial (INSS)
                    </label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-4 h-4 text-slate-400 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Valores pagos à Previdência Social ou a regimes próprios de previdência.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">R$</span>
                    <Input
                      id="previdenciaOficial"
                      type="number"
                      step="0.01"
                      className="pl-9"
                      placeholder="0,00"
                      {...register("previdenciaOficial")}
                    />
                  </div>
                  {errors.previdenciaOficial && (
                    <p className="text-xs text-red-500 font-medium">{errors.previdenciaOficial.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="dependentes" className="text-sm font-semibold text-slate-700">
                      Número de Dependentes
                    </label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-4 h-4 text-slate-400 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Cada dependente permite uma dedução anual específica.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input
                    id="dependentes"
                    type="number"
                    placeholder="0"
                    {...register("dependentes")}
                  />
                  {errors.dependentes && (
                    <p className="text-xs text-red-500 font-medium">{errors.dependentes.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="pensaoAlimenticia" className="text-sm font-semibold text-slate-700">
                    Pensão Alimentícia Paga
                  </label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-4 h-4 text-slate-400 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Valores de pensão alimentícia judicialmente homologada.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">R$</span>
                  <Input
                    id="pensaoAlimenticia"
                    type="number"
                    step="0.01"
                    className="pl-9"
                    placeholder="0,00"
                    {...register("pensaoAlimenticia")}
                  />
                </div>
                {errors.pensaoAlimenticia && (
                  <p className="text-xs text-red-500 font-medium">{errors.pensaoAlimenticia.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="saude" className="text-sm font-semibold text-slate-700">
                      Despesas Médicas / Saúde
                    </label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-4 h-4 text-slate-400 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Gastos com médicos, dentistas, psicólogos e hospitais.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">R$</span>
                    <Input
                      id="saude"
                      type="number"
                      step="0.01"
                      className="pl-9"
                      placeholder="0,00"
                      {...register("saude")}
                    />
                  </div>
                  {errors.saude && (
                    <p className="text-xs text-red-500 font-medium">{errors.saude.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="educacao" className="text-sm font-semibold text-slate-700">
                      Despesas com Educação
                    </label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-4 h-4 text-slate-400 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Gastos com ensino infantil, fundamental, médio, superior, pós-graduação e cursos técnicos.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">R$</span>
                    <Input
                      id="educacao"
                      type="number"
                      step="0.01"
                      className="pl-9"
                      placeholder="0,00"
                      {...register("educacao")}
                    />
                  </div>
                  {errors.educacao && (
                    <p className="text-xs text-red-500 font-medium">{errors.educacao.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-4 border-t border-slate-100">
              <Button type="button" variant="outline" onClick={handlePrevStep} className="gap-2">
                <ArrowLeft className="w-4 h-4" /> Voltar para Ganhos
              </Button>
              <Button type="button" onClick={handleNextStep} disabled={!isValid} className="gap-2">
                Ver Resultado <ArrowRight className="w-4 h-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {step === 3 && (
          <Card className="border-emerald-200 bg-emerald-50/20">
            <CardHeader className="space-y-1">
              <div className="flex items-center gap-2 text-emerald-600">
                <Receipt className="w-5 h-5" />
                <CardTitle className="text-xl">Etapa 3: Seu Resultado Estimado</CardTitle>
              </div>
              <CardDescription className="text-emerald-800">
                Aqui está o resumo da sua simulação do IRRF, baseado nos dados que você informou.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Rendimento Total</p>
                  <p className="text-2xl font-bold text-slate-800 mt-1">
                    R$ {rendimentoTributavelTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Deduções Totais</p>
                  <p className="text-2xl font-bold text-slate-800 mt-1">
                    R$ {totalDeducoes.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="bg-emerald-600 p-4 rounded-xl shadow-sm text-center text-white">
                  <p className="text-xs font-semibold uppercase tracking-wider opacity-90">Imposto Estimado</p>
                  <p className="text-2xl font-bold mt-1">
                    R$ {impostoDevido.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-3">
                <h3 className="font-semibold text-slate-800 text-sm">Resumo da Simulação</h3>
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex justify-between border-b border-dashed border-slate-100 pb-1">
                    <span>Base de Cálculo:</span>
                    <span className="font-medium text-slate-800">
                      R$ {baseDeCalculo.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-dashed border-slate-100 pb-1">
                    <span>Alíquota Efetiva:</span>
                    <span className="font-medium text-slate-800">
                      {aliquotaEfetiva.toLocaleString("pt-BR", { style: "percent", minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-dashed border-slate-100 pb-1">
                    <span>Tipo de Cálculo Aplicado:</span>
                    <span className="font-medium text-slate-800">{tipoCalculoAplicado}</span>
                  </div>
                  <div className="flex justify-between pb-1">
                    <span>Imposto Devido:</span>
                    <span className="font-bold text-emerald-600">
                      R$ {impostoDevido.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card de Pagamento Independente ou Isenção */}
              {impostoDevido > 0 ? (
                <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="font-semibold text-slate-800 text-base flex items-center gap-2">
                    <Coins className="w-5 h-5 text-blue-600" /> Como efetuar o seu pagamento de forma independente
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Como você possui imposto estimado a pagar, você pode realizar o pagamento de forma autônoma e segura. Veja o passo a passo de como proceder:
                  </p>
                  <ul className="space-y-3 text-sm text-slate-600 pl-1">
                    <li className="flex gap-2">
                      <span className="font-bold text-blue-600">1.</span>
                      <span>
                        <strong>Emissão do DARF:</strong> Acesse o portal <strong>e-CAC</strong> (Centro Virtual de Atendimento da Receita Federal) ou utilize o programa oficial do IRPF para gerar o Documento de Arrecadação de Receitas Federais (DARF).
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-blue-600">2.</span>
                      <span>
                        <strong>Opções de Parcelamento:</strong> Se preferir, você pode parcelar o imposto devido em <strong>até 8 cotas mensais</strong> (com valor mínimo por cota estipulado pela Receita). Há também a opção de colocar a cota única ou as demais parcelas em débito automático para sua comodidade.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-blue-600">3.</span>
                      <span>
                        <strong>Pagamento Descomplicado:</strong> Realize o pagamento de forma instantânea utilizando o <strong>QR Code Pix</strong> impresso no próprio DARF, ou utilize o código de barras diretamente no aplicativo do seu banco preferido.
                      </span>
                    </li>
                  </ul>
                </div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 shadow-sm">
                  <p className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <span className="font-semibold text-slate-800">Você está livre do Leão! 🦁</span> Nenhuma ação de pagamento é necessária para este cálculo.
                  </p>
                </div>
              )}

              {/* Guia Prático Educativo Real */}
              <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="font-semibold text-slate-800 text-base flex items-center gap-2">
                  <Info className="w-5 h-5 text-blue-600" /> Guia Prático Educativo: Entenda o seu Imposto
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Para ajudá-lo a compreender exatamente como o seu imposto foi calculado de forma 100% autônoma, detalhamos o significado de cada linha do cálculo abaixo:
                </p>
                <div className="space-y-4 pt-1">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-800">1. Rendimento Total</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      É a soma de todas as suas receitas tributáveis informadas (salários, aluguéis recebidos, pró-labore e outros ganhos). Representa o ponto de partida do cálculo, antes de qualquer desconto.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-800">2. Deduções Legais</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      São despesas previstas por lei (como previdência oficial, dependentes, pensão alimentícia, gastos com saúde e educação) que a Receita Federal permite abater diretamente do seu rendimento total para diminuir o montante sobre o qual o imposto será calculado. No modelo simplificado, esse abatimento é substituído por um desconto padrão fixo (atualmente de 20% dos rendimentos, limitado a um teto).
                    </p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-800">3. Base de Cálculo</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      É o valor líquido real obtido subtraindo-se as Deduções Legais (ou o desconto simplificado) do Rendimento Total. É sobre esse montante que as alíquotas da tabela progressiva mensal ou anual da Receita Federal serão aplicadas para definir a sua faixa de imposto.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-800">4. Alíquota Efetiva</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      É a porcentagem real e definitiva de imposto descontada do seu rendimento. Diferente da alíquota nominal de cada faixa (que pode chegar a 27,5%), a alíquota efetiva mostra o impacto real no seu bolso, dividindo o Imposto Estimado pelo Rendimento Total.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-4 border-t border-slate-100 bg-white rounded-b-xl">
              <Button type="button" variant="outline" onClick={handlePrevStep} className="gap-2">
                <ArrowLeft className="w-4 h-4" /> Ajustar Deduções
              </Button>
              <Button type="button" onClick={handleReset} variant="destructive" className="gap-2">
                <RotateCcw className="w-4 h-4" /> Recomeçar Simulação
              </Button>
            </CardFooter>
          </Card>
        )}
      </form>
    </div>
  );
}
