import { redirect } from 'next/navigation';

export default function RootPage() {
  // Redirecionar para o idioma padrão
  redirect('/pt');
}