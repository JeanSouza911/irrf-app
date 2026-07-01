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
import { Coins, PiggyBank, Receipt, ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";

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
    defaultValues: {
      salarioBruto: 0,
      alugueis: 0,
      outrosGanhos: 0,
      previdenciaOficial: 0,
      dependentes: 0,
      pensaoAlimenticia: 0,
      saude: 0,
      educacao: 0,
    },
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

  // Cálculo fictício simples (apenas mockado) para ilustrar na Etapa 3
  const totalGanhos =
    Number(formData.salarioBruto || 0) +
    Number(formData.alugueis || 0) +
    Number(formData.outrosGanhos || 0);

  const totalDeducoes =
    Number(formData.previdenciaOficial || 0) +
    Number(formData.dependentes || 0) * 189.59 + // dedução padrão por dependente fictícia/real
    Number(formData.pensaoAlimenticia || 0) +
    Number(formData.saude || 0) +
    Number(formData.educacao || 0);

  const baseCalculoFicticia = Math.max(0, totalGanhos - totalDeducoes);
  const impostoFicticio = baseCalculoFicticia * 0.15; // taxa fictícia de 15% para o mockup do Bloco 2

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
                <label htmlFor="salarioBruto" className="text-sm font-semibold text-slate-700 flex justify-between">
                  <span>Salário Bruto Mensal / Anual</span>
                  <span className="text-xs text-slate-500">Rendimento Principal</span>
                </label>
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
                  <label htmlFor="alugueis" className="text-sm font-semibold text-slate-700">
                    Aluguéis Recebidos
                  </label>
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
                  <label htmlFor="outrosGanhos" className="text-sm font-semibold text-slate-700">
                    Outros Ganhos Tributáveis
                  </label>
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
                  <label htmlFor="previdenciaOficial" className="text-sm font-semibold text-slate-700">
                    Previdência Oficial (INSS)
                  </label>
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
                  <label htmlFor="dependentes" className="text-sm font-semibold text-slate-700">
                    Número de Dependentes
                  </label>
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
                <label htmlFor="pensaoAlimenticia" className="text-sm font-semibold text-slate-700">
                  Pensão Alimentícia Paga
                </label>
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
                  <label htmlFor="saude" className="text-sm font-semibold text-slate-700">
                    Despesas Médicas / Saúde
                  </label>
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
                  <label htmlFor="educacao" className="text-sm font-semibold text-slate-700">
                    Despesas com Educação
                  </label>
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
                <CardTitle className="text-xl">Etapa 3: Resultado Estimado (Mockup)</CardTitle>
              </div>
              <CardDescription className="text-emerald-800">
                Esta tela exibe resultados preliminares calculados de forma simplificada e fictícia para esta etapa de design.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Rendimento Total</p>
                  <p className="text-2xl font-bold text-slate-800 mt-1">
                    R$ {totalGanhos.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                    R$ {impostoFicticio.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-3">
                <h3 className="font-semibold text-slate-800 text-sm">Resumo da Simulação</h3>
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex justify-between border-b border-dashed border-slate-100 pb-1">
                    <span>Base de Cálculo Estimada:</span>
                    <span className="font-medium text-slate-800">
                      R$ {baseCalculoFicticia.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-dashed border-slate-100 pb-1">
                    <span>Alíquota de Referência (Fictícia):</span>
                    <span className="font-medium text-slate-800">15.00%</span>
                  </div>
                  <div className="flex justify-between pb-1">
                    <span>Imposto Devido Estimado:</span>
                    <span className="font-bold text-emerald-600">
                      R$ {impostoFicticio.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
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
