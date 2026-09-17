/** Form shape and validation for the create-production card. */

export interface ProjectFormValues {
  projectName: string;
  website: string;
  idea: string;
  duration: number;
  style: string;
  customStyle: string;
  name: string;
  email: string;
}

export type FormErrors = Partial<Record<keyof ProjectFormValues, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;

/** Accepts "example.com" as well as a full URL; returns a normalized https URL. */
export function normalizeWebsite(input: string): string {
  const trimmed = input.trim();
  if (trimmed.length === 0) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function isPlausibleUrl(input: string): boolean {
  try {
    const url = new URL(normalizeWebsite(input));
    return (
      (url.protocol === 'http:' || url.protocol === 'https:') &&
      url.hostname.includes('.') &&
      !url.hostname.startsWith('.') &&
      !url.hostname.endsWith('.')
    );
  } catch {
    return false;
  }
}

export function validateProjectForm(values: ProjectFormValues): FormErrors {
  const errors: FormErrors = {};

  const projectName = values.projectName.trim();
  if (projectName.length === 0) {
    errors.projectName = 'Give the production a project or brand name.';
  } else if (projectName.length < 2) {
    errors.projectName = 'That looks a little short — use at least 2 characters.';
  } else if (projectName.length > 120) {
    errors.projectName = 'Keep the name under 120 characters.';
  }

  const idea = values.idea.trim();
  if (idea.length === 0) {
    errors.idea = 'Describe the creative idea you want produced.';
  } else if (idea.length < 20) {
    errors.idea = 'Add a little more detail — around 20 characters or more works best.';
  } else if (idea.length > 4000) {
    errors.idea = 'Trim the brief to under 4,000 characters.';
  }

  if (![15, 30, 60].includes(values.duration)) {
    errors.duration = 'Choose a duration.';
  }

  const style = values.style === 'Custom' ? values.customStyle.trim() : values.style.trim();
  if (style.length === 0) {
    errors.customStyle =
      values.style === 'Custom' ? 'Describe your custom visual style.' : 'Choose a visual style.';
  } else if (style.length > 120) {
    errors.customStyle = 'Keep the style under 120 characters.';
  }

  const name = values.name.trim();
  if (name.length === 0) {
    errors.name = 'Add your name so we know who to reply to.';
  } else if (name.length > 120) {
    errors.name = 'Keep your name under 120 characters.';
  }

  const email = values.email.trim();
  if (email.length === 0) {
    errors.email = 'Add an email address for the production results.';
  } else if (!EMAIL_RE.test(email)) {
    errors.email = 'That email address does not look right.';
  }

  if (values.website.trim().length > 0 && !isPlausibleUrl(values.website)) {
    errors.website = 'Enter a valid URL, for example verilyx.com';
  }

  return errors;
}
