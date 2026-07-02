import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import WizardForm from "./wizard-form";

// Mock do PointerEvent porque o Radix UI Tooltip depende dele no jsdom
if (typeof window !== "undefined") {
  window.PointerEvent = class PointerEvent extends Event {
    constructor(type: string, params: PointerEventInit = {}) {
      super(type, params);
    }
  } as unknown as typeof window.PointerEvent;
}

describe("WizardForm Component", () => {
  it("deve renderizar a Etapa 1 (Ganhos) inicialmente", () => {
    render(<WizardForm />);
    
    expect(screen.getByText("Etapa 1: Seus Rendimentos e Ganhos")).toBeInTheDocument();
    expect(screen.getByLabelText("Salário Bruto Mensal / Anual")).toBeInTheDocument();
    expect(screen.getByLabelText("Aluguéis Recebidos")).toBeInTheDocument();
    expect(screen.getByLabelText("Outros Ganhos Tributáveis")).toBeInTheDocument();
  });

  it("deve exibir mensagem de erro para valores negativos", async () => {
    render(<WizardForm />);
    
    const salarioInput = screen.getByLabelText("Salário Bruto Mensal / Anual");
    fireEvent.change(salarioInput, { target: { value: "-100" } });
    
    await waitFor(() => {
      expect(screen.getByText("O salário bruto não pode ser negativo")).toBeInTheDocument();
    });
  });

  it("deve avançar para a Etapa 2 ao clicar em avançar após preencher os dados", async () => {
    render(<WizardForm />);
    
    const salarioInput = screen.getByLabelText("Salário Bruto Mensal / Anual");
    fireEvent.change(salarioInput, { target: { value: "3000" } });

    const avancarBtn = screen.getByRole("button", { name: /Avançar para Deduções/i });
    
    await waitFor(() => {
      expect(avancarBtn).not.toBeDisabled();
    });
    
    fireEvent.click(avancarBtn);
    
    await waitFor(() => {
      expect(screen.getByText("Etapa 2: Gastos e Deduções Legais")).toBeInTheDocument();
    });
  });

  it("deve navegar pelo fluxo inteiro até o resultado e permitir recomeçar", async () => {
    render(<WizardForm />);
    
    // Etapa 1 -> Preencher e avançar
    const salarioInput = screen.getByLabelText("Salário Bruto Mensal / Anual");
    fireEvent.change(salarioInput, { target: { value: "5000" } });
    
    const avancarBtn1 = screen.getByRole("button", { name: /Avançar para Deduções/i });
    
    await waitFor(() => {
      expect(avancarBtn1).not.toBeDisabled();
    });
    
    fireEvent.click(avancarBtn1);
    
    // Etapa 2 -> Preencher e avançar
    await waitFor(() => {
      expect(screen.getByText("Etapa 2: Gastos e Deduções Legais")).toBeInTheDocument();
    });
    
    const previdenciaInput = screen.getByLabelText("Previdência Oficial (INSS)");
    fireEvent.change(previdenciaInput, { target: { value: "500" } });
    
    const avancarBtn2 = screen.getByRole("button", { name: /Ver Resultado/i });
    
    await waitFor(() => {
      expect(avancarBtn2).not.toBeDisabled();
    });
    
    fireEvent.click(avancarBtn2);
    
    // Etapa 3 -> Verificar resultado mockado e reiniciar
    await waitFor(() => {
      expect(screen.getByText("Etapa 3: Resultado Estimado (Mockup)")).toBeInTheDocument();
    });
    
    // Rendimento total: 5000, Deduções totais: 500, Base cálculo: 4500, Imposto estimado (15%): 675
    expect(screen.getByText("R$ 5.000,00")).toBeInTheDocument();
    expect(screen.getByText("R$ 500,00")).toBeInTheDocument();
    expect(screen.getAllByText("R$ 675,00").length).toBeGreaterThan(0);
    
    // Testar recomeçar simulação
    const recomecarBtn = screen.getByRole("button", { name: /Recomeçar Simulação/i });
    fireEvent.click(recomecarBtn);
    
    await waitFor(() => {
      expect(screen.getByText("Etapa 1: Seus Rendimentos e Ganhos")).toBeInTheDocument();
    });
  });
});
