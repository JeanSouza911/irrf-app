import { z } from "zod";

export const irrfFormSchema = z.object({
  // Ganhos (Etapa 1)
  salarioBruto: z.coerce
    .number()
    .min(0, "O salário bruto não pode ser negativo")
    .default(0),
  alugueis: z.coerce
    .number()
    .min(0, "O valor de aluguéis não pode ser negativo")
    .default(0),
  outrosGanhos: z.coerce
    .number()
    .min(0, "Outros ganhos não podem ser negativos")
    .default(0),

  // Gastos/Deduções (Etapa 2)
  previdenciaOficial: z.coerce
    .number()
    .min(0, "A previdência oficial não pode ser negativa")
    .default(0),
  dependentes: z.coerce
    .number()
    .int("Número de dependentes deve ser um número inteiro")
    .min(0, "Número de dependentes não pode ser negativo")
    .default(0),
  pensaoAlimenticia: z.coerce
    .number()
    .min(0, "A pensão alimentícia não pode ser negativa")
    .default(0),
  saude: z.coerce
    .number()
    .min(0, "Os gastos com saúde não podem ser negativos")
    .default(0),
  educacao: z.coerce
    .number()
    .min(0, "Os gastos com educação não podem ser negativos")
    .default(0),
});

export type IRRFFormData = z.infer<typeof irrfFormSchema>;
