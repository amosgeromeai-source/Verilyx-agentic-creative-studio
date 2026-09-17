import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clapperboard,
  Download,
  ExternalLink,
  Film,
  Loader2,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { downloadVideo } from '@/utils';
import type { NormalizedProduction } from '@/types';
import type { VideoStatusResult } from '@/hooks';

interface FinalVideoProps {
  production: NormalizedProduction;
  status: VideoStatusResult;
  onStartNew: () => void;
}

function Shell({
  eyebrow,
  title,
  children,
  tone = 'default',
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  tone?: 'default' | 'warning';
}) {
  return (
    <section
      className={`glass-strong relative overflow-hidden p-5 sm:p-7 ${
        tone === 'warning' ? 'border-amber-400/20' : 'border-cyan-400/[0.16]'
      }`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-8rem] top-[-8rem] h-72 w-72 rounded-full opacity-[0.16] blur-[90px]"
        style={{
          background:
            tone === 'warning'
              ? 'radial-gradient(closest-side, #fbbf24, transparent 72%)'
              : 'radial-gradient(closest-side, #22d3ee, transparent 72%)',
        }}
      />
      <div className="relative">
        <div className="flex items-center gap-2.5">
          <span
            className={`inline-flex h-9 w-9 flex-none items-center justify-center rounded-lg border ${
              tone === 'warning'
                ? 'border-amber-400/25 bg-amber-400/[0.08]'
                : 'border-cyan-400/25 bg-cyan-400/[0.08]'
            }`}
          >
            {tone === 'warning' ? (
              <AlertTriangle className="h-4 w-4 text-amber-300" />
            ) : (
              <Film className="h-4 w-4 text-cyan-300" />
            )}
          </span>
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-widest2 text-slate-400">
              {eyebrow}
            </p>
            <h2 className="mt-0.5 text-[17px] font-semibold tracking-tight text-slate-50 sm:text-[19px]">
              {title}
            </h2>
          </div>
        </div>
        {children}
      </div>
    </section>
  );
}

/** Player + download actions, shown once a playable URL exists. */
function ReadyVideo({
  production,
  onStartNew,
}: {
  production: NormalizedProduction;
  onStartNew: () => void;
}) {
  const { video } = production;
  const [playbackFailed, setPlaybackFailed] = useState(false);
  const [downloadState, setDownloadState] = useState<'idle' | 'working' | 'opened' | 'failed'>(
    'idle',
  );
  const abort = useRef<AbortController | null>(null);

  useEffect(() => {
    setPlaybackFailed(false);
    return () => abort.current?.abort();
  }, [video.url]);

  const handleDownload = useCallback(async () => {
    setDownloadState('working');
    abort.current?.abort();
    abort.current = new AbortController();

    const outcome = await downloadVideo(video.url, video.fileName, abort.current.signal);
    setDownloadState(outcome === 'downloaded' ? 'idle' : outcome === 'opened' ? 'opened' : 'failed');
  }, [video.url, video.fileName]);

  if (playbackFailed) {
    return (
      <Shell eyebrow="Final production" title="Video link unavailable" tone="warning">
        <p className="mt-4 text-[14.5px] leading-[1.75] text-slate-400">
          Your production was completed, but the video link is currently unavailable. This usually
          means the link has expired. Your full production package is preserved below.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <a
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost px-4 py-2.5 text-[13.5px]"
          >
            <ExternalLink className="h-4 w-4" />
            Try opening the video
          </a>
          <button type="button" onClick={onStartNew} className="btn-quiet px-4 py-2.5 text-[13.5px]">
            <Plus className="h-4 w-4" />
            Start New Project
          </button>
        </div>
      </Shell>
    );
  }

  return (
    <Shell eyebrow="Verilyx production complete" title="Your final video is ready">
      <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_30px_80px_-40px_rgba(0,0,0,0.95)]">
        <video
          key={video.url}
          src={video.url}
          controls
          playsInline
          preload="metadata"
          controlsList="nodownload"
          onError={() => {
            console.error('[Verilyx] video element failed to load its source.');
            setPlaybackFailed(true);
          }}
          className="aspect-video w-full bg-black"
        >
          Your browser cannot play this video.
        </video>
      </div>

      <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center">
        <button
          type="button"
          onClick={() => void handleDownload()}
          disabled={downloadState === 'working'}
          className="btn-primary w-full px-5 py-3 text-[14.5px] sm:w-auto"
        >
          {downloadState === 'working' ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Preparing download…
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              Download Final Video
            </>
          )}
        </button>

        <a
          href={video.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost w-full px-4 py-3 text-[13.5px] sm:w-auto"
        >
          <ExternalLink className="h-4 w-4" />
          Open Video
        </a>

        <button
          type="button"
          onClick={onStartNew}
          className="btn-quiet w-full px-4 py-3 text-[13.5px] sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          Start New Project
        </button>
      </div>

      {downloadState === 'opened' && (
        <p className="mt-3 text-[12.5px] text-slate-500">
          The video opened in a new tab — use your browser&rsquo;s save option if the download
          didn&rsquo;t start.
        </p>
      )}
      {downloadState === 'failed' && (
        <p className="mt-3 text-[12.5px] text-amber-300/90">
          The download couldn&rsquo;t be started. Try &ldquo;Open Video&rdquo; and save it from
          there.
        </p>
      )}

      <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/[0.06] pt-5">
        <div>
          <dt className="text-[11px] font-medium uppercase tracking-widest2 text-slate-500">
            Production
          </dt>
          <dd className="mt-1 text-[13.5px] text-slate-200">
            {production.projectName || 'Verilyx production'}
          </dd>
        </div>
        {production.duration !== null && (
          <div>
            <dt className="text-[11px] font-medium uppercase tracking-widest2 text-slate-500">
              Duration
            </dt>
            <dd className="mt-1 text-[13.5px] text-slate-200">{production.duration} seconds</dd>
          </div>
        )}
        {production.visualStyle && (
          <div>
            <dt className="text-[11px] font-medium uppercase tracking-widest2 text-slate-500">
              Visual style
            </dt>
            <dd className="mt-1 text-[13.5px] text-slate-200">{production.visualStyle}</dd>
          </div>
        )}
        {video.clipCount !== null && video.clipCount > 0 && (
          <div>
            <dt className="text-[11px] font-medium uppercase tracking-widest2 text-slate-500">
              Clips merged
            </dt>
            <dd className="mt-1 text-[13.5px] text-slate-200">{video.clipCount}</dd>
          </div>
        )}
        <div>
          <dt className="text-[11px] font-medium uppercase tracking-widest2 text-slate-500">
            Status
          </dt>
          <dd className="mt-1 flex items-center gap-1.5 text-[13.5px] text-emerald-300">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Complete
          </dd>
        </div>
      </dl>
    </Shell>
  );
}

/** Placeholder where the player will appear, while Runway + merge are running. */
function RenderingVideo({ status }: { status: VideoStatusResult }) {
  return (
    <Shell eyebrow="Final video" title="Generating your production…">
      <div className="mt-5 flex aspect-video w-full flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-white/10 bg-white/[0.015] px-6 text-center">
        <span className="relative inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/25 bg-cyan-400/[0.06]">
          <Clapperboard className="h-6 w-6 text-cyan-300" />
          <span className="absolute inset-0 animate-pulse-ring rounded-2xl" />
        </span>
        <div>
          <p className="text-[14.5px] font-medium text-slate-200">
            Video generation and final rendering are still in progress.
          </p>
          <p className="mx-auto mt-2 max-w-md text-[13px] leading-relaxed text-slate-500">
            Your production package is complete and available below. Verilyx is now generating the
            clips and merging them into your final video.
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        {status.pollingEnabled ? (
          <>
            <span className="chip border-cyan-400/20 bg-cyan-400/[0.06] text-cyan-200/90">
              {status.isPolling ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Checking for your video
                </>
              ) : (
                'Waiting'
              )}
            </span>
            <button
              type="button"
              onClick={status.checkNow}
              className="btn-ghost px-3.5 py-2 text-[13px]"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Check now
            </button>
          </>
        ) : (
          <p className="text-[12.5px] leading-relaxed text-slate-500">
            Keep this page open. When video delivery is connected, the finished production will
            appear here automatically.
          </p>
        )}
      </div>

      {status.timedOut && (
        <p className="mt-3 text-[12.5px] text-amber-300/90">
          Still rendering after 30 minutes. Your package is safe — check back using the link sent to
          your email.
        </p>
      )}
    </Shell>
  );
}

/** Generation or merging failed; the package survives. */
function FailedVideo({
  production,
  onStartNew,
}: {
  production: NormalizedProduction;
  onStartNew: () => void;
}) {
  return (
    <Shell eyebrow="Final video" title="Video could not be completed" tone="warning">
      <p className="mt-4 text-[14.5px] leading-[1.75] text-slate-400">
        {production.video.message ||
          'Video generation could not be completed. Your production package has been preserved below.'}
      </p>
      <p className="mt-2 text-[13px] leading-relaxed text-slate-500">
        Everything the agents produced — creative direction, script, scene plan and generation
        prompts — is ready below and can be resubmitted.
      </p>
      <div className="mt-5">
        <button type="button" onClick={onStartNew} className="btn-ghost px-4 py-2.5 text-[13.5px]">
          <Plus className="h-4 w-4" />
          Start New Project
        </button>
      </div>
    </Shell>
  );
}

/**
 * The finished MP4 is the deliverable, so this sits at the top of the results
 * page in every state except an escalated run, where no video is expected.
 */
export function FinalVideo({ production, status, onStartNew }: FinalVideoProps) {
  const video = status.video;

  if (video.state === 'not_expected') return null;

  if (video.state === 'ready') {
    return <ReadyVideo production={{ ...production, video }} onStartNew={onStartNew} />;
  }

  if (video.state === 'failed' || video.state === 'unavailable') {
    return <FailedVideo production={{ ...production, video }} onStartNew={onStartNew} />;
  }

  return <RenderingVideo status={status} />;
}
