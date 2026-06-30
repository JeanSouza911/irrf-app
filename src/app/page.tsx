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

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-slate-50">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            IRRF App 🧮
          </h1>
          <p className="text-sm text-slate-500">
            Guia prático e calculadora de Imposto de Renda Retido na Fonte.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Demonstração dos Componentes</CardTitle>
            <CardDescription>
              Testando os componentes primitivos do shadcn/ui com Tailwind v4.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="test-input" className="text-sm font-medium text-slate-700">
                Campo de Exemplo
              </label>
              <Input id="test-input" placeholder="Digite algo aqui..." />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline">Cancelar</Button>
            <Button variant="default">Enviar</Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
