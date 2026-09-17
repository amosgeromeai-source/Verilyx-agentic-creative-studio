import { useMemo, useRef, useState, type FormEvent } from 'react';
import { AlertCircle, Loader2, Sparkles, TriangleAlert } from 'lucide-react';
import { DURATION_OPTIONS, IS_WEBHOOK_CONFIGURED, STYLE_OPTIONS } from '@/config';
import { validateProjectForm, type FormErrors, type ProjectFormValues } from '@/utils/validation';
import { normalizeWebsite } from '@/utils/validation';
import type { CreateProductionRequest } from '@/types';

const IDEA_PLACEHOLDER =
  'Create a cinematic futuristic advertisement for an AI trading platform that feels intelligent, premium, and trustworthy.';

const INITIAL_VALUES: ProjectFormValues = {
  projectName: '',
  website: '',
  idea: '',
  duration: 30,
  style: 'Cinematic Futuristic',
  customStyle: '',
  name: '',
  email: '',
};

interface ProjectFormProps {
  onSubmit: (payload: CreateProductionRequest) => void;
  isSubmitting: boolean;
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 flex items-start gap-1.5 text-[12.5px] text-rose-300">
      <AlertCircle className="mt-0.5 h-3.5 w-3.5 flex-none" />
      {message}
    </p>
  );
}

export function ProjectForm({ onSubmit, isSubmitting }: ProjectFormProps) {
  const [values, setValues] = useState<ProjectFormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<FormErrors>({});
  const [attempted, setAttempted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const ideaCount = values.idea.trim().length;

  const set = <K extends keyof ProjectFormValues>(key: K, value: ProjectFormValues[K]) => {
    setValues((prev) => {
      const next = { ...prev, [key]: value };
      if (attempted) setErrors(validateProjectForm(next));
      return next;
    });
  };

  const resolvedStyle = useMemo(
    () => (values.style === 'Custom' ? values.customStyle.trim() : values.style),
    [values.style, values.customStyle],
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    setAttempted(true);
    const nextErrors = validateProjectForm(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      const firstInvalid = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
      firstInvalid?.focus();
      firstInvalid?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    onSubmit({
      project_name: values.projectName.trim(),
      idea: values.idea.trim(),
      duration: values.duration,
      style: resolvedStyle,
      name: values.name.trim(),
      email: values.email.trim(),
      website: normalizeWebsite(values.website),
    });
  };

  const invalid = (key: keyof ProjectFormValues) => Boolean(errors[key]);
  const fieldClass = (key: keyof ProjectFormValues) => `field ${invalid(key) ? 'field-error' : ''}`;

  return (
    <section
      id="create"
      className="relative scroll-mt-24 border-t border-white/[0.05] px-5 py-16 sm:px-6 lg:px-8 lg:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-10 h-72 w-[42rem] max-w-full -translate-x-1/2 rounded-full opacity-[0.13] blur-[100px]"
        style={{ background: 'radial-gradient(closest-side, #a78bfa, transparent 72%)' }}
      />

      <div className="relative mx-auto max-w-3xl">
        <div className="text-center">
          <span className="eyebrow">Create</span>
          <h2 className="mt-3 text-[26px] font-semibold tracking-tight text-slate-100 sm:text-[32px]">
            Start a production
          </h2>
          <p className="mt-4 text-[15px] leading-[1.75] text-slate-400">
            One brief in. A reviewed production package and a finished video out.
          </p>
        </div>

        {!IS_WEBHOOK_CONFIGURED && (
          <div className="mt-8 flex items-start gap-3 rounded-xl border border-amber-400/25 bg-amber-400/[0.06] p-4">
            <TriangleAlert className="mt-0.5 h-4 w-4 flex-none text-amber-300" />
            <div className="text-[13px] leading-relaxed text-amber-100/90">
              <p className="font-medium">No backend configured for this build.</p>
              <p className="mt-1 text-amber-100/70">
                Set <code className="font-mono text-[12px]">VITE_N8N_WEBHOOK_URL</code> in your
                environment (locally in <code className="font-mono text-[12px]">.env</code>, on
                Netlify under Site settings → Environment variables) and rebuild.
              </p>
            </div>
          </div>
        )}

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          noValidate
          className="glass-strong mt-8 p-6 sm:p-8"
        >
          <fieldset disabled={isSubmitting} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="projectName">
                  Project / Brand Name <span className="text-cyan-400">*</span>
                </label>
                <input
                  id="projectName"
                  name="projectName"
                  type="text"
                  autoComplete="organization"
                  placeholder="Verilyx Automation"
                  className={fieldClass('projectName')}
                  value={values.projectName}
                  onChange={(event) => set('projectName', event.target.value)}
                  aria-invalid={invalid('projectName')}
                  aria-describedby={invalid('projectName') ? 'projectName-error' : undefined}
                />
                <FieldError id="projectName-error" message={errors.projectName} />
              </div>

              <div>
                <label className="label" htmlFor="website">
                  Website / Brand URL <span className="text-slate-600">(optional)</span>
                </label>
                <input
                  id="website"
                  name="website"
                  type="text"
                  inputMode="url"
                  autoComplete="url"
                  placeholder="verilyx.com"
                  className={fieldClass('website')}
                  value={values.website}
                  onChange={(event) => set('website', event.target.value)}
                  aria-invalid={invalid('website')}
                  aria-describedby={invalid('website') ? 'website-error' : undefined}
                />
                <FieldError id="website-error" message={errors.website} />
              </div>
            </div>

            <div>
              <div className="flex items-baseline justify-between gap-3">
                <label className="label" htmlFor="idea">
                  Creative Idea <span className="text-cyan-400">*</span>
                </label>
                <span
                  className={`text-[11.5px] tabular-nums ${
                    ideaCount > 4000 ? 'text-rose-300' : 'text-slate-600'
                  }`}
                >
                  {ideaCount.toLocaleString()} / 4,000
                </span>
              </div>
              <textarea
                id="idea"
                name="idea"
                rows={5}
                placeholder={IDEA_PLACEHOLDER}
                className={`${fieldClass('idea')} resize-y leading-[1.7]`}
                value={values.idea}
                onChange={(event) => set('idea', event.target.value)}
                aria-invalid={invalid('idea')}
                aria-describedby={invalid('idea') ? 'idea-error' : undefined}
              />
              <FieldError id="idea-error" message={errors.idea} />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="duration">
                  Duration <span className="text-cyan-400">*</span>
                </label>
                <select
                  id="duration"
                  name="duration"
                  className={fieldClass('duration')}
                  value={values.duration}
                  onChange={(event) => set('duration', Number(event.target.value))}
                  aria-invalid={invalid('duration')}
                >
                  {DURATION_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <FieldError id="duration-error" message={errors.duration} />
              </div>

              <div>
                <label className="label" htmlFor="style">
                  Visual Style <span className="text-cyan-400">*</span>
                </label>
                <select
                  id="style"
                  name="style"
                  className="field"
                  value={values.style}
                  onChange={(event) => set('style', event.target.value)}
                >
                  {STYLE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {values.style === 'Custom' && (
              <div className="animate-fade-in">
                <label className="label" htmlFor="customStyle">
                  Describe your style <span className="text-cyan-400">*</span>
                </label>
                <input
                  id="customStyle"
                  name="customStyle"
                  type="text"
                  placeholder="Grainy 16mm, warm practicals, handheld"
                  className={fieldClass('customStyle')}
                  value={values.customStyle}
                  onChange={(event) => set('customStyle', event.target.value)}
                  aria-invalid={invalid('customStyle')}
                  aria-describedby={invalid('customStyle') ? 'customStyle-error' : undefined}
                />
                <FieldError id="customStyle-error" message={errors.customStyle} />
              </div>
            )}

            <div className="divider" />

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="name">
                  Your Name <span className="text-cyan-400">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Amos Gerome"
                  className={fieldClass('name')}
                  value={values.name}
                  onChange={(event) => set('name', event.target.value)}
                  aria-invalid={invalid('name')}
                  aria-describedby={invalid('name') ? 'name-error' : undefined}
                />
                <FieldError id="name-error" message={errors.name} />
              </div>

              <div>
                <label className="label" htmlFor="email">
                  Email <span className="text-cyan-400">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  className={fieldClass('email')}
                  value={values.email}
                  onChange={(event) => set('email', event.target.value)}
                  aria-invalid={invalid('email')}
                  aria-describedby={invalid('email') ? 'email-error' : undefined}
                />
                <FieldError id="email-error" message={errors.email} />
              </div>
            </div>
          </fieldset>

          <div className="mt-8 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[12.5px] leading-relaxed text-slate-500">
              Runs take a few minutes. Keep this tab open — results appear here when the workflow
              finishes.
            </p>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full flex-none px-6 py-3 text-[15px] sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating…
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Production
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
