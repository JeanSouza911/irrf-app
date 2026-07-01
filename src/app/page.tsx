import WizardForm from "@/components/wizard-form";
import { BookOpen, HelpCircle, ShieldAlert, HeartHandshake } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Cabeçalho Educativo Principal */}
      <header className="w-full bg-white border-b border-slate-200 py-8 px-6 shadow-xs">
        <div className="max-w-4xl mx-auto space-y-4 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                <BookOpen className="w-3.5 h-3.5" /> Guia Educativo do Cidadão
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
                Imposto de Renda sem Mistérios 🧮
              </h1>
              <p className="text-slate-500 max-w-2xl text-base">
                Aprenda a simular, calcular e entender o seu Imposto de Renda Retido na Fonte (IRRF) de maneira totalmente independente, clara e guiada passo a passo.
              </p>
            </div>
            
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl max-w-xs text-left hidden md:block">
              <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <ShieldAlert className="w-4 h-4 text-amber-500" /> Privacidade Total
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Nenhum dado digitado é enviado para servidores ou armazenado. Todo o processamento ocorre direto no seu navegador.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Seção Principal do Wizard de Simulação */}
      <main className="flex-1 py-10 px-4 md:px-6">
        <section className="max-w-4xl mx-auto space-y-12">
          {/* Instrução Inicial */}
          <div className="text-center space-y-2">
            <h2 className="text-xl md:text-2xl font-bold text-slate-800">
              Inicie sua Simulação Rápida
            </h2>
            <p className="text-sm text-slate-500 max-w-lg mx-auto">
              Siga os passos abaixo informando seus rendimentos e deduções autorizadas por lei.
            </p>
          </div>

          {/* Wizard Form Component */}
          <WizardForm />

          {/* Bloco de Ajuda Rápida / Educativo */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-200">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-600" />
                O que são Deduções Legais?
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                São gastos autorizados pela Receita Federal que você pode subtrair dos seus rendimentos totais (como saúde, educação, previdência e dependentes). Quanto maiores as deduções legais comprovadas, menor será o imposto final devido.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-blue-600" />
                Por que este simulador existe?
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Criamos este guia interativo para traduzir termos burocráticos e complexos em linguagem simples, ajudando você a tomar as melhores decisões na sua declaração anual com total clareza.
              </p>
            </div>
          </section>
        </section>
      </main>

      {/* Rodapé Semântico */}
      <footer className="w-full bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-400">
        <div className="max-w-4xl mx-auto px-6">
          <p>© {new Date().getFullYear()} IRRF App — Guia Educacional e Simulador Prático Próprio. Desenvolvido para fins de estudo e cidadania.</p>
        </div>
      </footer>
    </div>
  );
}
