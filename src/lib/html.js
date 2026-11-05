/**
 * Minimal, safe HTML templating.
 *
 * Every interpolated value is HTML-escaped unless it is already a SafeHtml
 * (returned by `html` itself or explicitly by `raw`). This keeps markup
 * composable while making XSS through content data impossible by default.
 */

class SafeHtml {
  constructor(value) {
    this.value = value;
  }

  toString() {
    return this.value;
  }
}

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export const escape = (value) => String(value).replace(/[&<>"']/g, (char) => ESCAPES[char]);

/** Marks trusted markup (e.g. static SVG) as safe. Never pass user input. */
export const raw = (value) => new SafeHtml(String(value));

const render = (value) => {
  if (value == null || value === false) return '';
  if (Array.isArray(value)) return value.map(render).join('');
  if (value instanceof SafeHtml) return value.value;
  return escape(value);
};

export function html(strings, ...values) {
  let out = strings[0];
  for (let i = 0; i < values.length; i += 1) {
    out += render(values[i]) + strings[i + 1];
  }
  return new SafeHtml(out);
}
