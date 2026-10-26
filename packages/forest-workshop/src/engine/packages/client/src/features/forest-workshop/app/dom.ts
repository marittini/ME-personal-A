// The only DOM helper the screens use. Screens build plain nodes with `h()`; nothing renders HTML strings, so text
// from the server or the player can never become markup.

export interface ElementOptions {
  className?: string;
  text?: string;
  attrs?: Record<string, string | undefined>;
  /** Event listeners, e.g. { click: () => … }. */
  on?: Partial<Record<keyof HTMLElementEventMap, (event: Event) => void>>;
  disabled?: boolean;
}

export type Child = Node | string | null | undefined | false;

export function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  options: ElementOptions = {},
  children: Child[] = [],
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (options.className) node.className = options.className;
  if (options.text !== undefined) node.textContent = options.text;
  for (const [name, value] of Object.entries(options.attrs ?? {})) {
    if (value !== undefined) node.setAttribute(name, value);
  }
  for (const [type, listener] of Object.entries(options.on ?? {})) {
    if (listener) node.addEventListener(type, listener);
  }
  if (options.disabled !== undefined && "disabled" in node) (node as HTMLButtonElement).disabled = options.disabled;
  for (const child of children) {
    if (child === null || child === undefined || child === false) continue;
    node.append(typeof child === "string" ? document.createTextNode(child) : child);
  }
  return node;
}

export function button(
  label: string,
  onClick: () => void,
  options: { variant?: "primary" | "secondary"; disabled?: boolean; attrs?: Record<string, string> } = {},
) {
  return h("button", {
    className: options.variant === "secondary" ? "button secondary" : "button",
    text: label,
    attrs: { type: "button", ...options.attrs },
    disabled: options.disabled,
    on: { click: onClick },
  });
}

/** A loading / error / ready value. Every screen renders all three; there is no blank state. */
export type Loadable<T> = { state: "loading" } | { state: "error"; message: string } | { state: "ready"; value: T };

export function statusLine(text: string) {
  return h("p", { className: "muted", text, attrs: { role: "status" } });
}

export function errorLine(text: string) {
  return h("p", { className: "error", text, attrs: { role: "alert" } });
}

export function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)}MiB`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)}KiB`;
  return `${bytes}B`;
}
