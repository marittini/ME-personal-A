// Forest Workshop client (P0 connection proof). Registers <marinara-capability-forest-workshop>, which the Engine
// mounts as a Home browser tab. It renders into its own Shadow DOM with plain DOM nodes: no second React, no global
// CSS. Every request goes through the Engine's own API client (`__MARINARA_HOST__.api`), so admin access, CSRF and
// error handling are the Engine's. The game screens arrive from P1; this screen only proves the connections.
import { host } from "marinara:host";
import { STYLES } from "./styles";

interface HostApiClient {
  get<T>(path: string): Promise<T>;
  post<T>(path: string, body?: unknown): Promise<T>;
  upload<T>(path: string, formData: FormData): Promise<T>;
}

interface HostApiModule {
  api: HostApiClient;
  getApiErrorMessage(value: unknown, fallback: string): string;
}

interface HostMemberStatus {
  name: string;
  required: boolean;
  available: boolean;
}

interface StatusResponse {
  version: string;
  stage: string;
  host: HostMemberStatus[];
  imageRules: { maxInputBytes: number; maxDimension: number; quality: number };
}

interface ProbeCheck {
  id: string;
  label: string;
  status: "pass" | "fail" | "unavailable";
  detail: string;
}

interface StoredImage {
  reference: string;
  url: string;
  width: number;
  height: number;
  hasTransparency: boolean;
  inputBytes: number;
  outputBytes: number;
  quality: number;
  imageVersion: number;
}

const TAG = "marinara-capability-forest-workshop";
const ROUTE = "/forest-workshop/p0";
const STATUS_LABEL: Record<ProbeCheck["status"], string> = { pass: "통과", fail: "실패", unavailable: "사용 불가" };

function hostApi(): HostApiModule {
  const module = (host as Record<string, unknown>).api as HostApiModule | undefined;
  if (!module?.api) throw new Error("이 Marinara Engine은 패키지 API 클라이언트를 제공하지 않습니다.");
  return module;
}

function errorMessage(error: unknown, fallback: string): string {
  try {
    const payload = (error as { payload?: { message?: unknown } }).payload;
    if (typeof payload?.message === "string" && payload.message) return payload.message;
    return hostApi().getApiErrorMessage(error, fallback);
  } catch {
    return error instanceof Error && error.message ? error.message : fallback;
  }
}

function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)}MiB`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)}KiB`;
  return `${bytes}B`;
}

function element<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  options: { className?: string; text?: string; attrs?: Record<string, string> } = {},
  children: Array<Node | null> = [],
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (options.className) node.className = options.className;
  if (options.text !== undefined) node.textContent = options.text;
  for (const [name, value] of Object.entries(options.attrs ?? {})) node.setAttribute(name, value);
  for (const child of children) if (child) node.append(child);
  return node;
}

type Loadable<T> = { state: "loading" } | { state: "error"; message: string } | { state: "ready"; value: T };

function newUploadKey(): string {
  return typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

class ForestWorkshopElement extends HTMLElement {
  private readonly root: ShadowRoot;
  private connected = false;
  private status: Loadable<StatusResponse> = { state: "loading" };
  private probe: Loadable<ProbeCheck[]> | null = null;
  private image: Loadable<StoredImage | null> = { state: "loading" };
  private uploading = false;
  private uploadError: string | null = null;
  /** Reused when the same file is retried, so a lost response cannot store the picture twice. */
  private pendingUpload: { file: File; key: string } | null = null;

  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.connected = true;
    this.render();
    void this.loadStatus();
    void this.loadImage();
  }

  disconnectedCallback() {
    this.connected = false;
  }

  private async loadStatus() {
    this.status = { state: "loading" };
    this.render();
    try {
      this.status = { state: "ready", value: await hostApi().api.get<StatusResponse>(`${ROUTE}/status`) };
    } catch (error) {
      this.status = { state: "error", message: errorMessage(error, "패키지 상태를 불러오지 못했습니다.") };
    }
    this.render();
  }

  private async loadImage() {
    this.image = { state: "loading" };
    this.render();
    try {
      const response = await hostApi().api.get<{ current: StoredImage | null }>(`${ROUTE}/image`);
      this.image = { state: "ready", value: response.current };
    } catch (error) {
      this.image = { state: "error", message: errorMessage(error, "저장된 그림을 불러오지 못했습니다.") };
    }
    this.render();
  }

  private async runProbe() {
    if (this.probe?.state === "loading") return;
    this.probe = { state: "loading" };
    this.render();
    try {
      const report = await hostApi().api.post<{ checks: ProbeCheck[] }>(`${ROUTE}/probe`);
      this.probe = { state: "ready", value: report.checks };
    } catch (error) {
      this.probe = { state: "error", message: errorMessage(error, "연결 점검을 실행하지 못했습니다.") };
    }
    this.render();
  }

  private async upload(file: File) {
    if (this.uploading) return;
    const pending = this.pendingUpload?.file === file ? this.pendingUpload : { file, key: newUploadKey() };
    this.pendingUpload = pending;
    this.uploading = true;
    this.uploadError = null;
    this.render();
    try {
      const form = new FormData();
      form.append("uploadKey", pending.key);
      form.append("file", file, file.name);
      const response = await hostApi().api.upload<{ image: StoredImage }>(`${ROUTE}/image`, form);
      this.image = { state: "ready", value: response.image };
      this.pendingUpload = null;
    } catch (error) {
      this.uploadError = errorMessage(error, "그림을 올리지 못했습니다. 기존 그림은 그대로입니다.");
    } finally {
      this.uploading = false;
      this.render();
    }
  }

  private render() {
    if (!this.connected) return;
    const style = element("style", { text: STYLES });
    const page = element("main", { className: "page", attrs: { "aria-labelledby": "fw-title" } }, [
      element("header", { className: "header" }, [
        element("p", { className: "eyebrow", text: "개발용 연결 점검 · P0" }),
        element("h1", { text: "숲결 공방", attrs: { id: "fw-title" } }),
        element("p", {
          className: "lead",
          text: "게임 화면은 다음 단계에서 열립니다. 지금은 엔진 연결과 주민 그림 저장 경로만 확인합니다.",
        }),
      ]),
      this.renderStatus(),
      this.renderProbe(),
      this.renderImage(),
    ]);
    this.root.replaceChildren(style, page);
  }

  private retryButton(label: string, action: () => void) {
    const button = element("button", { className: "button secondary", text: label, attrs: { type: "button" } });
    button.addEventListener("click", action);
    return button;
  }

  private renderStatus() {
    const section = element("section", { className: "card", attrs: { "aria-labelledby": "fw-status" } }, [
      element("h2", { text: "엔진 연결", attrs: { id: "fw-status" } }),
    ]);
    if (this.status.state === "loading") {
      section.append(element("p", { className: "muted", text: "불러오는 중…", attrs: { role: "status" } }));
    } else if (this.status.state === "error") {
      section.append(
        element("p", { className: "error", text: this.status.message, attrs: { role: "alert" } }),
        this.retryButton("다시 시도", () => void this.loadStatus()),
      );
    } else {
      const { value } = this.status;
      section.append(
        element("p", { className: "muted", text: `패키지 ${value.version} · 단계 ${value.stage}` }),
        element(
          "ul",
          { className: "list" },
          value.host.map((member) =>
            element("li", { className: "row" }, [
              element("span", { className: "name", text: member.name }),
              element("span", {
                className: `badge ${member.available ? "pass" : member.required ? "fail" : "unavailable"}`,
                text: member.available ? "있음" : member.required ? "없음 (필수)" : "없음",
              }),
            ]),
          ),
        ),
      );
    }
    return section;
  }

  private renderProbe() {
    const run = element("button", {
      className: "button",
      text: this.probe?.state === "loading" ? "점검 중…" : "연결 점검 실행",
      attrs: { type: "button" },
    });
    run.disabled = this.probe?.state === "loading";
    run.addEventListener("click", () => void this.runProbe());
    const section = element("section", { className: "card", attrs: { "aria-labelledby": "fw-probe" } }, [
      element("h2", { text: "저장·자료·모델 점검", attrs: { id: "fw-probe" } }),
      element("p", {
        className: "muted",
        text: "임시 문서를 쓰고 지웁니다. 캐릭터·페르소나 원본은 읽기만 하며, 모델 생성 요청은 보내지 않습니다.",
      }),
      run,
    ]);
    if (!this.probe || this.probe.state === "loading") return section;
    if (this.probe.state === "error") {
      section.append(element("p", { className: "error", text: this.probe.message, attrs: { role: "alert" } }));
      return section;
    }
    section.append(
      element(
        "ul",
        { className: "list", attrs: { "aria-live": "polite" } },
        this.probe.value.map((check) =>
          element("li", { className: "row stacked" }, [
            element("div", { className: "row-head" }, [
              element("span", { className: "name", text: check.label }),
              element("span", { className: `badge ${check.status}`, text: STATUS_LABEL[check.status] }),
            ]),
            element("span", { className: "detail", text: check.detail }),
          ]),
        ),
      ),
    );
    return section;
  }

  private renderImage() {
    const input = element("input", {
      className: "file",
      attrs: { type: "file", accept: "image/png,image/webp", id: "fw-file" },
    });
    input.disabled = this.uploading;
    input.addEventListener("change", () => {
      const file = input.files?.[0];
      if (file) void this.upload(file);
    });
    const section = element("section", { className: "card", attrs: { "aria-labelledby": "fw-image" } }, [
      element("h2", { text: "주민 그림 저장 점검", attrs: { id: "fw-image" } }),
      element("p", {
        className: "muted",
        text: "PNG 또는 정적 WebP(최대 20MiB, 4096×4096)를 고르면 투명도를 유지한 WebP 품질95로 바꿔 전역 갤러리에 저장합니다. PNG 원본은 보관하지 않습니다.",
      }),
      element("label", { className: "field-label", text: "그림 파일 고르기", attrs: { for: "fw-file" } }),
      input,
    ]);
    if (this.uploading) {
      section.append(element("p", { className: "muted", text: "변환하고 저장하는 중…", attrs: { role: "status" } }));
    }
    if (this.uploadError) {
      section.append(element("p", { className: "error", text: this.uploadError, attrs: { role: "alert" } }));
      const pending = this.pendingUpload;
      if (pending && !this.uploading) {
        section.append(this.retryButton("같은 파일로 다시 시도", () => void this.upload(pending.file)));
      }
    }
    if (this.image.state === "loading") {
      section.append(element("p", { className: "muted", text: "불러오는 중…", attrs: { role: "status" } }));
    } else if (this.image.state === "error") {
      section.append(
        element("p", { className: "error", text: this.image.message, attrs: { role: "alert" } }),
        this.retryButton("다시 불러오기", () => void this.loadImage()),
      );
    } else if (!this.image.value) {
      section.append(element("p", { className: "empty", text: "아직 저장된 그림이 없습니다." }));
    } else {
      const image = this.image.value;
      const preview = element("img", {
        className: "preview",
        attrs: {
          src: `${image.url}${image.url.includes("?") ? "&" : "?"}v=${image.imageVersion}`,
          alt: "저장된 주민 그림 미리보기",
          width: String(image.width),
          height: String(image.height),
        },
      });
      section.append(
        element("div", { className: "stage" }, [preview]),
        element("dl", { className: "facts" }, [
          element("dt", { text: "참조" }),
          element("dd", { text: image.reference }),
          element("dt", { text: "크기" }),
          element("dd", { text: `${image.width}×${image.height}` }),
          element("dt", { text: "용량" }),
          element("dd", { text: `입력 ${formatBytes(image.inputBytes)} → WebP ${formatBytes(image.outputBytes)}` }),
          element("dt", { text: "투명도" }),
          element("dd", { text: image.hasTransparency ? "투명 영역 있음 (유지됨)" : "불투명 그림" }),
          element("dt", { text: "버전" }),
          element("dd", { text: String(image.imageVersion) }),
        ]),
      );
    }
    return section;
  }
}

if (typeof customElements !== "undefined" && !customElements.get(TAG)) {
  customElements.define(TAG, ForestWorkshopElement);
}
