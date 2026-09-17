import type { NormalizedProduction } from '@/types';
import { statusBadgeLabel } from './normalize';

interface Part {
  heading: string;
  body: string;
}

/** Ordered, human-readable sections — used by Copy All and the download. */
export function packageParts(production: NormalizedProduction): Part[] {
  const parts: Part[] = [
    { heading: 'Creative Direction', body: production.creativeDirection },
    { heading: 'Script', body: production.script },
    { heading: 'Scene Plan', body: production.scenePlan },
    { heading: 'Generation Prompts', body: production.generationPrompts },
  ];

  if (production.revised) {
    parts.push(
      { heading: 'Original Quality Review', body: production.initialReview },
      { heading: 'Revised Production Package', body: production.revisedPackage },
      { heading: 'Final Quality Review', body: production.finalReview },
    );
  } else {
    parts.push({ heading: 'Quality Review', body: production.finalReview });
  }

  return parts.filter((part) => part.body.trim().length > 0);
}

/** Flattens the whole package into markdown for clipboard or file download. */
export function buildPackageText(production: NormalizedProduction): string {
  const lines: string[] = [];

  lines.push(`# ${production.projectName || 'Verilyx Production'}`);
  lines.push('');
  lines.push(`Status: ${statusBadgeLabel(production)}`);
  if (production.finalQualityScore !== null) {
    lines.push(`Final quality score: ${production.finalQualityScore}/100`);
  }
  if (production.revised && production.initialQualityScore !== null) {
    lines.push(`Initial quality score: ${production.initialQualityScore}/100`);
  }
  if (production.duration !== null) lines.push(`Duration: ${production.duration}s`);
  if (production.visualStyle) lines.push(`Visual style: ${production.visualStyle}`);
  lines.push(`Agents run: ${production.agentsRun} of ${production.agentsTotal}`);

  if (production.idea) {
    lines.push('');
    lines.push('## Brief');
    lines.push('');
    lines.push(production.idea);
  }

  for (const part of packageParts(production)) {
    lines.push('');
    lines.push(`## ${part.heading}`);
    lines.push('');
    lines.push(part.body.trim());
  }

  lines.push('');
  lines.push('---');
  lines.push('Generated with Verilyx — AI-assisted, quality reviewed.');

  return lines.join('\n');
}

/** Filesystem-safe slug for the download filename. */
export function slugify(input: string): string {
  const slug = input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug.length > 0 ? slug.slice(0, 60) : 'verilyx-production';
}

/** Triggers a client-side markdown download of the package. */
export function downloadPackage(production: NormalizedProduction): void {
  try {
    const text = buildPackageText(production);
    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${slugify(production.projectName || 'verilyx-production')}-verilyx.md`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch (error) {
    console.error('[Verilyx] Download failed.', error);
  }
}
