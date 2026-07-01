import { useCallback, useEffect, useState } from 'react';
import { api } from './api';

interface ApiResourceState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

/**
 * Hook para carregar um recurso GET da API com estados de loading/erro.
 * Passe `path = null` para não disparar a requisição (ex.: sem permissão).
 */
export function useApiResource<T>(path: string | null): ApiResourceState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(() => {
    if (path === null) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    api.get<T>(path)
      .then(setData)
      .catch(e => setError((e as Error).message || 'Erro ao carregar dados'))
      .finally(() => setLoading(false));
  }, [path]);

  useEffect(() => { reload(); }, [reload]);

  return { data, loading, error, reload };
}
