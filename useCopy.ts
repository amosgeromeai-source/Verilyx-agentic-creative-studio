import { useCallback, useEffect, useRef, useState } from 'react';
import { copyText } from '@/utils';

/** Copy-to-clipboard with a transient "Copied" confirmation. */
export function useCopy(resetAfterMs = 1800) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    },
    [],
  );

  const copy = useCallback(
    async (text: string) => {
      const ok = await copyText(text);
      setState(ok ? 'copied' : 'failed');
      if (timer.current !== null) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setState('idle'), resetAfterMs);
      return ok;
    },
    [resetAfterMs],
  );

  return { state, copy };
}
