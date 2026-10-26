var h=Object.defineProperty;var b=(s,i,t)=>i in s?h(s,i,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[i]=t;var n=(s,i,t)=>b(s,typeof i!="symbol"?i+"":i,t);var o=globalThis.__MARINARA_HOST__;if(!o||o.version!==1||!o.queryClient)throw new Error("Marinara Engine does not provide its query client; this package needs capability API 1.341 or newer.");var x=o.queryClient;var m=`
:host {
  --fw-bg: var(--background, #f6f3ea);
  --fw-surface: var(--card, #fffdf7);
  --fw-text: var(--foreground, #2f3a2c);
  --fw-muted: var(--muted-foreground, #5d6a57);
  --fw-border: var(--border, #d9d3c2);
  --fw-accent: #3f7a4a;
  --fw-accent-text: #ffffff;
  --fw-pass: #2f6b3a;
  --fw-fail: #a3372b;
  --fw-unavailable: #7a6a2f;
  display: block;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  background: var(--fw-bg);
  color: var(--fw-text);
  font: 400 1rem/1.5 system-ui, -apple-system, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif;
  -webkit-text-size-adjust: 100%;
}
* { box-sizing: border-box; }
.page {
  width: 100%;
  max-width: 520px;
  margin: 0 auto;
  padding: 1rem 1rem calc(1.5rem + env(safe-area-inset-bottom, 0px));
  display: grid;
  gap: 1rem;
}
.header h1 { margin: 0; font-size: 1.5rem; line-height: 1.2; }
.eyebrow { margin: 0 0 0.25rem; font-size: 0.8rem; color: var(--fw-muted); letter-spacing: 0.02em; }
.lead { margin: 0.5rem 0 0; color: var(--fw-muted); }
.card {
  background: var(--fw-surface);
  border: 1px solid var(--fw-border);
  border-radius: 0.75rem;
  padding: 1rem;
  display: grid;
  gap: 0.75rem;
  min-width: 0;
}
.card h2 { margin: 0; font-size: 1.05rem; }
.card p { margin: 0; }
.muted { color: var(--fw-muted); font-size: 0.9rem; }
.empty { color: var(--fw-muted); font-style: italic; }
.error { color: var(--fw-fail); font-weight: 600; overflow-wrap: anywhere; }
.list { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.5rem; }
.row { display: flex; justify-content: space-between; align-items: center; gap: 0.75rem; min-width: 0; }
.row.stacked { display: grid; gap: 0.25rem; padding-bottom: 0.5rem; border-bottom: 1px solid var(--fw-border); }
.row.stacked:last-child { border-bottom: 0; padding-bottom: 0; }
.row-head { display: flex; justify-content: space-between; align-items: center; gap: 0.75rem; }
.name { min-width: 0; overflow-wrap: anywhere; }
.detail { color: var(--fw-muted); font-size: 0.85rem; overflow-wrap: anywhere; }
.badge {
  flex: none;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 0.1rem 0.55rem;
  border-radius: 999px;
  border: 1px solid currentColor;
}
.badge.pass { color: var(--fw-pass); }
.badge.fail { color: var(--fw-fail); }
.badge.unavailable { color: var(--fw-unavailable); }
.button {
  justify-self: start;
  min-height: 2.75rem;
  padding: 0.5rem 1rem;
  border-radius: 0.6rem;
  border: 1px solid var(--fw-accent);
  background: var(--fw-accent);
  color: var(--fw-accent-text);
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}
.button.secondary { background: transparent; color: var(--fw-accent); }
.button:disabled { opacity: 0.6; cursor: progress; }
.button:focus-visible, .file:focus-visible { outline: 3px solid var(--fw-accent); outline-offset: 2px; }
.field-label { font-weight: 600; }
.file { max-width: 100%; font: inherit; min-height: 2.75rem; }
.stage {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  min-height: 12rem;
  padding: 0.75rem;
  border-radius: 0.6rem;
  background-color: #e9e4d6;
  background-image: linear-gradient(45deg, #d8d1bf 25%, transparent 25%, transparent 75%, #d8d1bf 75%),
    linear-gradient(45deg, #d8d1bf 25%, transparent 25%, transparent 75%, #d8d1bf 75%);
  background-size: 16px 16px;
  background-position: 0 0, 8px 8px;
}
.preview { max-width: 100%; max-height: 22rem; width: auto; height: auto; object-fit: contain; }
.facts { margin: 0; display: grid; grid-template-columns: max-content minmax(0, 1fr); gap: 0.25rem 0.75rem; font-size: 0.9rem; }
.facts dt { color: var(--fw-muted); }
.facts dd { margin: 0; overflow-wrap: anywhere; }
@media (prefers-reduced-motion: reduce) { * { scroll-behavior: auto; } }
`;var g="marinara-capability-forest-workshop",p="/forest-workshop/p0",w={pass:"\uD1B5\uACFC",fail:"\uC2E4\uD328",unavailable:"\uC0AC\uC6A9 \uBD88\uAC00"};function l(){let s=o.api;if(!s?.api)throw new Error("\uC774 Marinara Engine\uC740 \uD328\uD0A4\uC9C0 API \uD074\uB77C\uC774\uC5B8\uD2B8\uB97C \uC81C\uACF5\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.");return s}function c(s,i){try{let t=s.payload;return typeof t?.message=="string"&&t.message?t.message:l().getApiErrorMessage(s,i)}catch{return s instanceof Error&&s.message?s.message:i}}function f(s){return s>=1024*1024?`${(s/(1024*1024)).toFixed(1)}MiB`:s>=1024?`${Math.round(s/1024)}KiB`:`${s}B`}function e(s,i={},t=[]){let r=document.createElement(s);i.className&&(r.className=i.className),i.text!==void 0&&(r.textContent=i.text);for(let[a,d]of Object.entries(i.attrs??{}))r.setAttribute(a,d);for(let a of t)a&&r.append(a);return r}function v(){return typeof crypto<"u"&&typeof crypto.randomUUID=="function"?crypto.randomUUID():`${Date.now().toString(36)}-${Math.random().toString(36).slice(2,12)}`}var u=class extends HTMLElement{constructor(){super();n(this,"root");n(this,"connected",!1);n(this,"status",{state:"loading"});n(this,"probe",null);n(this,"image",{state:"loading"});n(this,"uploading",!1);n(this,"uploadError",null);n(this,"pendingUpload",null);this.root=this.attachShadow({mode:"open"})}connectedCallback(){this.connected=!0,this.render(),this.loadStatus(),this.loadImage()}disconnectedCallback(){this.connected=!1}async loadStatus(){this.status={state:"loading"},this.render();try{this.status={state:"ready",value:await l().api.get(`${p}/status`)}}catch(t){this.status={state:"error",message:c(t,"\uD328\uD0A4\uC9C0 \uC0C1\uD0DC\uB97C \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.")}}this.render()}async loadImage(){this.image={state:"loading"},this.render();try{let t=await l().api.get(`${p}/image`);this.image={state:"ready",value:t.current}}catch(t){this.image={state:"error",message:c(t,"\uC800\uC7A5\uB41C \uADF8\uB9BC\uC744 \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.")}}this.render()}async runProbe(){if(this.probe?.state!=="loading"){this.probe={state:"loading"},this.render();try{let t=await l().api.post(`${p}/probe`);this.probe={state:"ready",value:t.checks}}catch(t){this.probe={state:"error",message:c(t,"\uC5F0\uACB0 \uC810\uAC80\uC744 \uC2E4\uD589\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.")}}this.render()}}async upload(t){if(this.uploading)return;let r=this.pendingUpload?.file===t?this.pendingUpload:{file:t,key:v()};this.pendingUpload=r,this.uploading=!0,this.uploadError=null,this.render();try{let a=new FormData;a.append("uploadKey",r.key),a.append("file",t,t.name);let d=await l().api.upload(`${p}/image`,a);this.image={state:"ready",value:d.image},this.pendingUpload=null}catch(a){this.uploadError=c(a,"\uADF8\uB9BC\uC744 \uC62C\uB9AC\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4. \uAE30\uC874 \uADF8\uB9BC\uC740 \uADF8\uB300\uB85C\uC785\uB2C8\uB2E4.")}finally{this.uploading=!1,this.render()}}render(){if(!this.connected)return;let t=e("style",{text:m}),r=e("main",{className:"page",attrs:{"aria-labelledby":"fw-title"}},[e("header",{className:"header"},[e("p",{className:"eyebrow",text:"\uAC1C\uBC1C\uC6A9 \uC5F0\uACB0 \uC810\uAC80 \xB7 P0"}),e("h1",{text:"\uC232\uACB0 \uACF5\uBC29",attrs:{id:"fw-title"}}),e("p",{className:"lead",text:"\uAC8C\uC784 \uD654\uBA74\uC740 \uB2E4\uC74C \uB2E8\uACC4\uC5D0\uC11C \uC5F4\uB9BD\uB2C8\uB2E4. \uC9C0\uAE08\uC740 \uC5D4\uC9C4 \uC5F0\uACB0\uACFC \uC8FC\uBBFC \uADF8\uB9BC \uC800\uC7A5 \uACBD\uB85C\uB9CC \uD655\uC778\uD569\uB2C8\uB2E4."})]),this.renderStatus(),this.renderProbe(),this.renderImage()]);this.root.replaceChildren(t,r)}retryButton(t,r){let a=e("button",{className:"button secondary",text:t,attrs:{type:"button"}});return a.addEventListener("click",r),a}renderStatus(){let t=e("section",{className:"card",attrs:{"aria-labelledby":"fw-status"}},[e("h2",{text:"\uC5D4\uC9C4 \uC5F0\uACB0",attrs:{id:"fw-status"}})]);if(this.status.state==="loading")t.append(e("p",{className:"muted",text:"\uBD88\uB7EC\uC624\uB294 \uC911\u2026",attrs:{role:"status"}}));else if(this.status.state==="error")t.append(e("p",{className:"error",text:this.status.message,attrs:{role:"alert"}}),this.retryButton("\uB2E4\uC2DC \uC2DC\uB3C4",()=>{this.loadStatus()}));else{let{value:r}=this.status;t.append(e("p",{className:"muted",text:`\uD328\uD0A4\uC9C0 ${r.version} \xB7 \uB2E8\uACC4 ${r.stage}`}),e("ul",{className:"list"},r.host.map(a=>e("li",{className:"row"},[e("span",{className:"name",text:a.name}),e("span",{className:`badge ${a.available?"pass":a.required?"fail":"unavailable"}`,text:a.available?"\uC788\uC74C":a.required?"\uC5C6\uC74C (\uD544\uC218)":"\uC5C6\uC74C"})]))))}return t}renderProbe(){let t=e("button",{className:"button",text:this.probe?.state==="loading"?"\uC810\uAC80 \uC911\u2026":"\uC5F0\uACB0 \uC810\uAC80 \uC2E4\uD589",attrs:{type:"button"}});t.disabled=this.probe?.state==="loading",t.addEventListener("click",()=>{this.runProbe()});let r=e("section",{className:"card",attrs:{"aria-labelledby":"fw-probe"}},[e("h2",{text:"\uC800\uC7A5\xB7\uC790\uB8CC\xB7\uBAA8\uB378 \uC810\uAC80",attrs:{id:"fw-probe"}}),e("p",{className:"muted",text:"\uC784\uC2DC \uBB38\uC11C\uB97C \uC4F0\uACE0 \uC9C0\uC6C1\uB2C8\uB2E4. \uCE90\uB9AD\uD130\xB7\uD398\uB974\uC18C\uB098 \uC6D0\uBCF8\uC740 \uC77D\uAE30\uB9CC \uD558\uBA70, \uBAA8\uB378 \uC0DD\uC131 \uC694\uCCAD\uC740 \uBCF4\uB0B4\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4."}),t]);return!this.probe||this.probe.state==="loading"?r:this.probe.state==="error"?(r.append(e("p",{className:"error",text:this.probe.message,attrs:{role:"alert"}})),r):(r.append(e("ul",{className:"list",attrs:{"aria-live":"polite"}},this.probe.value.map(a=>e("li",{className:"row stacked"},[e("div",{className:"row-head"},[e("span",{className:"name",text:a.label}),e("span",{className:`badge ${a.status}`,text:w[a.status]})]),e("span",{className:"detail",text:a.detail})])))),r)}renderImage(){let t=e("input",{className:"file",attrs:{type:"file",accept:"image/png,image/webp",id:"fw-file"}});t.disabled=this.uploading,t.addEventListener("change",()=>{let a=t.files?.[0];a&&this.upload(a)});let r=e("section",{className:"card",attrs:{"aria-labelledby":"fw-image"}},[e("h2",{text:"\uC8FC\uBBFC \uADF8\uB9BC \uC800\uC7A5 \uC810\uAC80",attrs:{id:"fw-image"}}),e("p",{className:"muted",text:"PNG \uB610\uB294 \uC815\uC801 WebP(\uCD5C\uB300 20MiB, 4096\xD74096)\uB97C \uACE0\uB974\uBA74 \uD22C\uBA85\uB3C4\uB97C \uC720\uC9C0\uD55C WebP \uD488\uC9C895\uB85C \uBC14\uAFD4 \uC804\uC5ED \uAC24\uB7EC\uB9AC\uC5D0 \uC800\uC7A5\uD569\uB2C8\uB2E4. PNG \uC6D0\uBCF8\uC740 \uBCF4\uAD00\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4."}),e("label",{className:"field-label",text:"\uADF8\uB9BC \uD30C\uC77C \uACE0\uB974\uAE30",attrs:{for:"fw-file"}}),t]);if(this.uploading&&r.append(e("p",{className:"muted",text:"\uBCC0\uD658\uD558\uACE0 \uC800\uC7A5\uD558\uB294 \uC911\u2026",attrs:{role:"status"}})),this.uploadError){r.append(e("p",{className:"error",text:this.uploadError,attrs:{role:"alert"}}));let a=this.pendingUpload;a&&!this.uploading&&r.append(this.retryButton("\uAC19\uC740 \uD30C\uC77C\uB85C \uB2E4\uC2DC \uC2DC\uB3C4",()=>{this.upload(a.file)}))}if(this.image.state==="loading")r.append(e("p",{className:"muted",text:"\uBD88\uB7EC\uC624\uB294 \uC911\u2026",attrs:{role:"status"}}));else if(this.image.state==="error")r.append(e("p",{className:"error",text:this.image.message,attrs:{role:"alert"}}),this.retryButton("\uB2E4\uC2DC \uBD88\uB7EC\uC624\uAE30",()=>{this.loadImage()}));else if(!this.image.value)r.append(e("p",{className:"empty",text:"\uC544\uC9C1 \uC800\uC7A5\uB41C \uADF8\uB9BC\uC774 \uC5C6\uC2B5\uB2C8\uB2E4."}));else{let a=this.image.value,d=e("img",{className:"preview",attrs:{src:`${a.url}${a.url.includes("?")?"&":"?"}v=${a.imageVersion}`,alt:"\uC800\uC7A5\uB41C \uC8FC\uBBFC \uADF8\uB9BC \uBBF8\uB9AC\uBCF4\uAE30",width:String(a.width),height:String(a.height)}});r.append(e("div",{className:"stage"},[d]),e("dl",{className:"facts"},[e("dt",{text:"\uCC38\uC870"}),e("dd",{text:a.reference}),e("dt",{text:"\uD06C\uAE30"}),e("dd",{text:`${a.width}\xD7${a.height}`}),e("dt",{text:"\uC6A9\uB7C9"}),e("dd",{text:`\uC785\uB825 ${f(a.inputBytes)} \u2192 WebP ${f(a.outputBytes)}`}),e("dt",{text:"\uD22C\uBA85\uB3C4"}),e("dd",{text:a.hasTransparency?"\uD22C\uBA85 \uC601\uC5ED \uC788\uC74C (\uC720\uC9C0\uB428)":"\uBD88\uD22C\uBA85 \uADF8\uB9BC"}),e("dt",{text:"\uBC84\uC804"}),e("dd",{text:String(a.imageVersion)})]))}return r}};typeof customElements<"u"&&!customElements.get(g)&&customElements.define(g,u);
