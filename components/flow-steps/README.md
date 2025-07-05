# Componentes do Fluxo - WhatsWrapped

Esta pasta contém os componentes separados para cada etapa do fluxo de criação do ZapLove.

## 📁 Estrutura

```
components/flow-steps/
├── index.ts                    # Exportações centralizadas
├── instructions-step.tsx       # Etapa 1: Instruções de exportação
├── form-step.tsx              # Etapa 2: Formulário e upload
├── plan-step.tsx              # Etapa 3: Seleção de plano
├── progress-bar.tsx           # Barra de progresso
└── README.md                  # Esta documentação
```

## 🧩 Componentes

### InstructionsStep
- **Props**: `onContinue: () => void`
- **Função**: Exibe as instruções para exportar a conversa do WhatsApp
- **Eventos**: Chama `onContinue` quando o usuário clica em "Já exportei, continuar"

### FormStep
- **Props**: 
  - `formData: FormData`
  - `errors: FormErrors`
  - `selectedFile: File | null`
  - `isLoading: boolean`
  - `onInputChange: (e) => void`
  - `onFileChange: (e) => void`
  - `onSubmit: (e) => void`
- **Função**: Formulário com campos de dados pessoais e upload de arquivo
- **Eventos**: Gerencia mudanças nos inputs, seleção de arquivo e submissão

### PlanStep
- **Props**:
  - `selectedPlan: "BASIC" | "PREMIUM" | null`
  - `onPlanSelect: (plan) => void`
  - `onContinue: () => void`
- **Função**: Seleção entre planos Básico e Premium
- **Eventos**: Gerencia seleção de plano e continuação

### ProgressBar
- **Props**:
  - `currentStep: number`
  - `totalSteps: number`
- **Função**: Barra de progresso visual com indicadores de etapas
- **Estados**: Mostra progresso atual e etapas completadas

## 🚀 Como Usar

```tsx
import { 
  InstructionsStep, 
  FormStep, 
  PlanStep, 
  ProgressBar 
} from "@/components/flow-steps"

// Na sua página principal
{step === "INSTRUCTIONS" && (
  <InstructionsStep onContinue={() => setStep("FORM")} />
)}

{step === "FORM" && (
  <FormStep
    formData={formData}
    errors={errors}
    selectedFile={selectedFile}
    isLoading={isLoading}
    onInputChange={handleInputChange}
    onFileChange={handleFileChange}
    onSubmit={handleSubmit}
  />
)}
```

## 💡 Benefícios da Separação

1. **Manutenibilidade**: Cada componente tem uma responsabilidade específica
2. **Reutilização**: Componentes podem ser reutilizados em outros contextos
3. **Testabilidade**: Mais fácil de testar componentes isoladamente
4. **Legibilidade**: Código mais limpo e organizado
5. **Performance**: Melhor tree-shaking e lazy loading

## 🔄 Fluxo de Dados

```
Page Principal (Estado Global)
    ↓
ProgressBar (Apenas visualização)
    ↓
InstructionsStep → FormStep → PlanStep → PaymentStep
    ↓              ↓         ↓         ↓
Event Handlers → Event Handlers → Event Handlers → Event Handlers
```

## 🎨 Estilização

Todos os componentes usam:
- Tailwind CSS para estilização
- Gradientes pink/purple consistentes
- Componentes UI do shadcn/ui
- Responsividade mobile-first 