import type { CreateProductionRequest } from '@/types';

/**
 * Sample payloads for the optional demo mode (see README).
 *
 * These are deliberately RAW n8n-shaped payloads using the field names the live
 * workflow actually emits (`quality_review`, `revised_package`, `final_review`),
 * not pre-normalized objects — so demo mode exercises the same parser the real
 * response goes through. Enabled only when VITE_VERILYX_DEMO_MODE=true.
 */

export const DEMO_REQUEST: CreateProductionRequest = {
  project_name: 'Verilyx Automation',
  idea: 'Create a cinematic futuristic advertisement for an AI trading platform that feels intelligent, premium, and trustworthy.',
  duration: 30,
  style: 'Cinematic Futuristic',
  name: 'Amos Gerome',
  email: 'amosgerome03@gmail.com',
  website: 'https://verilyx.com',
};

const CREATIVE_DIRECTION = `CORE CONCEPT
An AI trading platform is not sold on speed alone — it is sold on composure. The spot positions Verilyx as the calm intelligence behind a volatile market: everything around the viewer moves, the product does not.

POSITIONING
- Audience: self-directed traders and small fund operators, 28-45, already tool-literate and sceptical of hype.
- Promise: institutional-grade signal, without an institution.
- Tone: measured, precise, quietly confident. No shouting, no rocket imagery, no green candles flying off screen.

VISUAL LANGUAGE
Deep charcoal environments lit by a single cool key. Data rendered as physical volume — glass planes, suspended lattices, thin cyan tracelines — rather than dashboard screenshots. Motion is slow and deliberate; cuts land on beats, never on effects.

COLOR
Charcoal base (#0B0D12) with restrained cyan (#22D3EE) for signal and a violet accent (#A78BFA) reserved for the moment of decision. Warm tones appear once, on the human face, to keep the piece from feeling clinical.

WHAT WE ARE NOT DOING
No stock trading-floor footage. No literal robots. No numbers ticking upward as a proxy for success.`;

const SCRIPT = `RUNTIME: 30 seconds
FORMAT: 16:9 primary, 9:16 safe-area respected

0:00-0:04 — COLD OPEN
VISUAL: Black. A single cyan trace draws itself across frame, then fractures into hundreds.
VO: "Every market moves faster than you can watch it."

0:04-0:10 — PRESSURE
VISUAL: The fractured traces multiply into a dense lattice. Camera pushes in; the lattice never resolves.
VO: "So most tools give you more to watch."
SFX: Layered data ticks, rising.

0:10-0:16 — TURN
VISUAL: Everything stills. One trace holds its cyan while the rest fall to grey.
VO: "Verilyx gives you less."
SFX: Cut to near-silence. Single low sub hit.

0:16-0:24 — PRODUCT
VISUAL: The held trace resolves into a clean signal card — entry, conviction, risk. A trader's face, warm-lit, reads it once.
VO: "Signal, reasoned and ranked. Not noise, reformatted."
ON SCREEN: Reasoned signals. Ranked by conviction.

0:24-0:30 — CLOSE
VISUAL: Pull back through the lattice, now ordered. Logo resolves in the negative space.
VO: "Verilyx. Intelligence that holds still."
ON SCREEN: verilyx.com`;

const SCENE_PLAN = `SCENE 1 — COLD OPEN (0:00-0:04)
Shot: Locked-off wide, black field.
Subject: Single cyan trace, 2px, drawing left to right, then shattering into ~200 fragments.
Camera: Static. No move.
Lighting: Self-illuminated trace only; no ambient.
Continuity: Trace thickness and cyan value are the reference for every later trace.

SCENE 2 — PRESSURE (0:04-0:10)
Shot: Slow dolly-in, 24mm equivalent, 6s duration.
Subject: Fragment field multiplies into a dense volumetric lattice filling frame depth.
Camera: Constant-velocity push, no easing — the discomfort is the point.
Lighting: Cool key from upper left at 20% to catch lattice edges.

SCENE 3 — THE TURN (0:10-0:16)
Shot: Same lens, motion halts on frame 1 of the beat.
Subject: All traces desaturate to grey over 8 frames except one, which holds full cyan.
Camera: Dead stop. Hold 2s before any further movement.
Lighting: Key drops to 8%; the held trace becomes the practical source.

SCENE 4 — PRODUCT (0:16-0:24)
Shot: Slow rack focus to a floating signal card, then a locked 50mm on the trader.
Camera: Rack focus, then static.
Continuity: The cyan card reflection must appear in the trader's eyeline.
Legibility: Card text held on screen 3.2s minimum.

SCENE 5 — CLOSE (0:24-0:30)
Shot: Reverse pull-back through the now-ordered lattice, 4s, easing out.
Subject: Lattice resolves into a hexagonal grid; logo occupies negative space centre.
Continuity: Grid geometry must match the Scene 2 lattice topology, reordered rather than replaced.`;

const GENERATION_PROMPTS = `GLOBAL PARAMETERS
Aspect: 16:9 · Frame rate: 24fps · Look: anamorphic, subtle halation, fine grain
Palette lock: charcoal #0B0D12, cyan #22D3EE, violet #A78BFA, warm skin key 3200K
Negative: text artifacts, stock trading floor, candlestick charts, humanoid robots, lens flares

SCENE 1
"A single thin cyan light trace drawing horizontally across a pure black void, then shattering into hundreds of fragments, macro depth, volumetric darkness, anamorphic, cinematic, no camera movement, 24fps"

SCENE 2
"Dense three-dimensional lattice of cyan data traces filling volumetric darkness, slow constant-velocity dolly push, cool key light from upper left, deep charcoal environment, cinematic anamorphic, shallow atmospheric haze"

SCENE 3
"A vast grey desaturated lattice of light traces with one single trace holding vivid cyan, absolute stillness, low ambient, the cyan trace acting as the only practical light source, cinematic, high contrast, anamorphic"

SCENE 4
"A floating glass signal card with minimal typographic data readouts, sharp focus, suspended in dark volumetric space, cyan edge lighting, shallow depth of field, rack focus, premium product cinematography"

SCENE 5
"Slow pull-back through an ordered hexagonal lattice of cyan traces resolving into geometric symmetry around empty centre space, cinematic, anamorphic, easing camera move, deep charcoal void"`;

const REVIEW_PASS_91 = `QUALITY SCORE: 91
STATUS: APPROVED

CONTINUITY — PASS
Trace thickness, cyan value and lattice topology are specified once in Scene 1 and referenced consistently through Scene 5.

TIMING — PASS
Beats total 30.0s with no overrun. Scene 4 holds card text for 3.2s, above the 2.5s legibility floor for the format.

TECHNICAL FEASIBILITY — PASS WITH NOTE
All shots are achievable with generated footage plus one live-action or licensed portrait plate.

AUDIO — PASS
The mix leaves the turn to the drop. The Scene 3 desaturation must land within 2 frames of the audio cut.

BRANDING — PASS
Palette is locked at the prompt level, so drift between scenes is constrained.

PRODUCTION RISKS
- Low: lattice density in Scene 2 may render inconsistently across generations; specify a seed.
- Low: Scene 4 skin tone may pull cyan from ambient; grade the plate separately.

FINAL VERDICT: APPROVED
Approved for production as written.`;

const REVIEW_FAIL_70 = `QUALITY SCORE: 70
STATUS: NEEDS REVISION

CONTINUITY — FAIL
The lattice in Scene 2 and the grid in Scene 5 are described as separate constructions with no stated relationship. As written, the close reads as a new environment rather than the resolution of the opening.

TIMING — FAIL
Scene beats total 33.5s against a 30s runtime. The overrun sits in Scene 4, which does not account for the 1.5s of near-silence the audio design requires at the turn.

AUDIO — WARNING
The score is described as continuous, but the script's turn depends on a drop. These two specifications contradict each other.

BRANDING — WARNING
Palette values are given in the creative direction but not carried into the generation prompts, so cross-scene colour drift is likely.

PRODUCTION RISKS
- High: runtime overrun will force an edit-stage cut that lands mid-beat.
- Medium: lattice/grid discontinuity undermines the concept.

RECOMMENDATION: NEEDS REVISION
Reconcile runtime to 30.0s, establish the lattice-to-grid relationship, resolve the score/drop contradiction, and lock palette values into every generation prompt.`;

const REVISED_PACKAGE = `REVISED PRODUCTION PACKAGE

CHANGES APPLIED
1. Runtime reconciled to 30.0s. The 1.5s near-silence moved into Scene 3's tail where it belongs structurally; Scene 5 shortened from 7.5s to 6.0s.
2. Lattice continuity established. Scene 5's hexagonal grid is now specified as a reorder of the Scene 2 lattice topology — same node count, same trace lengths, resolved positions.
3. Audio contradiction resolved. The bed is a sub-bass drone with a melodic figure entering at 0:16; the "drop" is a removal of the tick layer at 0:14, not a scored downbeat.
4. Palette locked at prompt level across every scene prompt.

REVISED TIMING
0:00-0:04 Cold open (4.0s)
0:04-0:10 Pressure (6.0s)
0:10-0:16 Turn, including 1.5s near-silence tail (6.0s)
0:16-0:24 Product, two shots at 4.0s each (8.0s)
0:24-0:30 Close (6.0s)
TOTAL: 30.0s

REVISED CONTINUITY NOTE
Scene 2 lattice: 214 nodes, trace length 0.4-2.1 units, seed locked.
Scene 5 grid: identical node count and trace lengths, hexagonal positions, same seed.

UNCHANGED
Creative direction, shot list, lensing and lighting are carried forward without modification.`;

const FINAL_REVIEW_92 = `QUALITY SCORE: 92
STATUS: APPROVED

CONTINUITY — PASS
The lattice-to-grid relationship is now explicit and measurable: matching node count and a locked seed give an editor something to verify against.

TIMING — PASS
Runtime reconciles to 30.0s exactly. Moving the near-silence into Scene 3's tail is the right fix.

AUDIO — PASS
The score/drop contradiction is resolved cleanly, and the frame-accurate dependency with Scene 3 is now achievable in an edit.

BRANDING — PASS
Palette values now prefix every prompt, which is the only place a generation model will honour them.

PREVIOUS ISSUES
- Runtime overrun — resolved.
- Lattice/grid discontinuity — resolved.
- Score/drop contradiction — resolved.
- Unlocked palette — resolved.

REMAINING ISSUES
- Low: Scene 4 skin tone may still pull cyan from ambient; grade the plate separately.
- Low: seed locking constrains but does not eliminate generation variance.

REQUIRED EXTERNAL INPUTS
- One performer plate or licensed portrait for Scene 4.

FINAL VERDICT: APPROVED
Approved for production. The revision addressed all blocking findings without disturbing the creative direction.`;

const FINAL_REVIEW_78 = `QUALITY SCORE: 78
STATUS: NEEDS HUMAN REVIEW

CONTINUITY — PASS
The lattice-to-grid relationship is now explicit.

TIMING — WARNING
Runtime reconciles to 30.0s on paper, but Scene 4 still allocates 3.2s of on-screen text inside a 4.0s shot that also carries a rack focus. That is achievable but tight, and it is the third revision of this beat.

TECHNICAL FEASIBILITY — FAIL
The revised package still depends on a performer plate that no brief, asset list or budget line accounts for. Automatic revision cannot source it.

PREVIOUS ISSUES
- Runtime overrun — resolved.
- Palette drift — resolved.

REMAINING ISSUES
- The Scene 4 performer plate is unsourced and cannot be generated within the stated palette constraints.
- Scene 4 text legibility is marginal at 9:16 crop.

REQUIRED EXTERNAL INPUTS
- A decision on the Scene 4 plate: licence, shoot, or replace the beat.

FINAL VERDICT: NEEDS HUMAN REVIEW
The package cannot be approved automatically. A producer decision is required on the Scene 4 plate before this goes to generation.`;

/** 1. Approved on the first quality review — no revision agents ran. */
export const DEMO_FIRST_PASS: unknown = {
  success: true,
  status: 'completed_first_pass',
  project_name: 'Verilyx Automation',
  creative_direction: CREATIVE_DIRECTION,
  script: SCRIPT,
  scene_plan: SCENE_PLAN,
  generation_prompts: GENERATION_PROMPTS,
  quality_review: REVIEW_PASS_91,
  metadata: {
    idea: DEMO_REQUEST.idea,
    duration: 30,
    style: 'Cinematic Futuristic',
    email: DEMO_REQUEST.email,
  },
};

/** 2. Failed the first review, revised automatically, then approved.
 *  Wrapped in an n8n item array to exercise envelope unwrapping. */
export const DEMO_REVISED: unknown = [
  {
    json: {
      success: true,
      status: 'completed_after_revision',
      project_name: 'Verilyx Automation',
      creative_direction: CREATIVE_DIRECTION,
      script: SCRIPT,
      scene_plan: SCENE_PLAN,
      generation_prompts: GENERATION_PROMPTS,
      quality_review: REVIEW_FAIL_70,
      revised_package: REVISED_PACKAGE,
      final_review: FINAL_REVIEW_92,
      metadata: {
        idea: DEMO_REQUEST.idea,
        duration: 30,
        style: 'Cinematic Futuristic',
        email: DEMO_REQUEST.email,
      },
    },
  },
];

/** 3. Revision ran but the final review still asks for a person.
 *  The backend status says "completed_after_revision"; the final verdict wins. */
export const DEMO_HUMAN_REVIEW: unknown = {
  success: true,
  status: 'completed_after_revision',
  project_name: 'Verilyx Automation',
  creative_direction: CREATIVE_DIRECTION,
  script: SCRIPT,
  scene_plan: SCENE_PLAN,
  generation_prompts: GENERATION_PROMPTS,
  quality_review: REVIEW_FAIL_70,
  revised_package: REVISED_PACKAGE,
  final_review: FINAL_REVIEW_78,
  metadata: {
    idea: DEMO_REQUEST.idea,
    duration: 30,
    style: 'Cinematic Futuristic',
    email: DEMO_REQUEST.email,
  },
};

/**
 * Same-origin sample clip shipped in /public, so demo mode needs no network and
 * no VITE_VERILYX_VIDEO_BASE_URL. Real runs use whatever URL the backend returns.
 */
const DEMO_VIDEO_URL =
  typeof window !== 'undefined'
    ? `${window.location.origin}/verilyx-demo.mp4`
    : '/verilyx-demo.mp4';

/** 4. Everything finished, including the merged MP4. */
export const DEMO_VIDEO_READY: unknown = {
  success: true,
  status: 'completed_after_revision',
  project_name: 'Verilyx Automation',
  creative_direction: CREATIVE_DIRECTION,
  script: SCRIPT,
  scene_plan: SCENE_PLAN,
  generation_prompts: GENERATION_PROMPTS,
  quality_review: REVIEW_FAIL_70,
  revised_package: REVISED_PACKAGE,
  final_review: FINAL_REVIEW_92,
  // Deliberately uses the generic `download_url` shape the merger returns.
  download_url: DEMO_VIDEO_URL,
  file: 'verilyx-demo.mp4',
  clip_count: 5,
  job_id: 'demo-job-0001',
  metadata: {
    idea: DEMO_REQUEST.idea,
    duration: 30,
    style: 'Cinematic Futuristic',
    email: DEMO_REQUEST.email,
  },
};

/** 5. Package approved, clips still rendering — no video field at all. */
export const DEMO_RENDERING: unknown = {
  success: true,
  status: 'completed',
  project_name: 'Verilyx Automation',
  creative_direction: CREATIVE_DIRECTION,
  script: SCRIPT,
  scene_plan: SCENE_PLAN,
  generation_prompts: GENERATION_PROMPTS,
  quality_review: REVIEW_PASS_91,
  job_id: 'demo-job-0002',
  metadata: {
    idea: DEMO_REQUEST.idea,
    duration: 30,
    style: 'Cinematic Futuristic',
    email: DEMO_REQUEST.email,
  },
};

/** 6. Clips generated but the merge failed — the package must survive. */
export const DEMO_VIDEO_FAILED: unknown = {
  success: true,
  status: 'completed',
  project_name: 'Verilyx Automation',
  creative_direction: CREATIVE_DIRECTION,
  script: SCRIPT,
  scene_plan: SCENE_PLAN,
  generation_prompts: GENERATION_PROMPTS,
  quality_review: REVIEW_PASS_91,
  video_status: 'failed',
  video_error: 'merge step exited non-zero',
  metadata: {
    idea: DEMO_REQUEST.idea,
    duration: 30,
    style: 'Cinematic Futuristic',
    email: DEMO_REQUEST.email,
  },
};

export const DEMO_SCENARIOS: Record<string, unknown> = {
  first: DEMO_FIRST_PASS,
  revised: DEMO_REVISED,
  human: DEMO_HUMAN_REVIEW,
  video: DEMO_VIDEO_READY,
  rendering: DEMO_RENDERING,
  'video-failed': DEMO_VIDEO_FAILED,
};
