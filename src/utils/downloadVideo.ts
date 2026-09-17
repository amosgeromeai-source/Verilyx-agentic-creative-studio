/**
 * Download the finished MP4 as an actual file.
 *
 * The `download` attribute is ignored for cross-origin URLs, so a plain anchor
 * would open the video in a tab instead of saving it. Fetching the file and
 * saving the blob gives a real download with the right filename; if CORS blocks
 * that fetch we fall back to opening the URL, which at least never fails
 * silently or leaves the user with nothing.
 */

export type VideoDownloadOutcome = 'downloaded' | 'opened' | 'failed';

function saveBlob(blob: Blob, fileName: string): void {
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = objectUrl;
  anchor.download = fileName;
  anchor.rel = 'noopener';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
}

function openInNewTab(url: string): void {
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.target = '_blank';
  anchor.rel = 'noopener noreferrer';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
}

export async function downloadVideo(
  url: string,
  fileName: string,
  signal?: AbortSignal,
): Promise<VideoDownloadOutcome> {
  if (!url) return 'failed';

  try {
    const response = await fetch(url, { mode: 'cors', signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const blob = await response.blob();
    if (blob.size === 0) throw new Error('empty body');

    saveBlob(blob, fileName || 'verilyx-production.mp4');
    return 'downloaded';
  } catch (error) {
    if (signal?.aborted) return 'failed';

    // Almost always CORS on the merger. Opening the URL still gets the user
    // their file via the browser's own download handling.
    console.warn('[Verilyx] direct video download failed, opening the URL instead.', error);
    try {
      openInNewTab(url);
      return 'opened';
    } catch (fallbackError) {
      console.error('[Verilyx] could not open the video URL.', fallbackError);
      return 'failed';
    }
  }
}
