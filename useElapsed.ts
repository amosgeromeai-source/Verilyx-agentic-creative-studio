import { useEffect, useRef, useState } from 'react';

/**
 * Wall-clock seconds since `running` became true.
 * Uses Date.now() rather than counting ticks so a backgrounded tab
 * (where timers are throttled) still reports the real elapsed time.
 */
export function useElapsed(running: boolean): number {
  const [seconds, setSeconds] = useState(0);
  const startedAt = useRef<number | null>(null);

  useEffect(() => {
    if (!running) {
      startedAt.current = null;
      setSeconds(0);
      return;
    }

    startedAt.current = Date.now();
    setSeconds(0);

    const tick = () => {
      if (startedAt.current === null) return;
      setSeconds(Math.floor((Date.now() - startedAt.current) / 1000));
    };

    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [running]);

  return seconds;
}
