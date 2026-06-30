import { AppLayout } from '../components/layout/AppLayout';

interface PlaceholderPageProps {
  title: string;
}

/** Página temporária para rotas ainda não implementadas */
export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div
          className="neu-card rounded-[20px] px-10 py-8 text-center max-w-md"
        >
          <p className="text-[13px] font-bold uppercase tracking-[1px] mb-2" style={{ color: 'var(--text-soft)' }}>
            Em construção
          </p>
          <h2 className="text-[24px] font-extrabold tracking-[-0.5px]">
            {title}
          </h2>
          <p className="text-[13px] mt-3" style={{ color: 'var(--text-muted)' }}>
            Esta tela será integrada com a API em breve.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
