var ae=Object.defineProperty;var oe=(t,e,r)=>e in t?ae(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r;var p=(t,e,r)=>oe(t,typeof e!="symbol"?e+"":e,r);var C=globalThis.__MARINARA_HOST__;if(!C||C.version!==1||!C.queryClient)throw new Error("Marinara Engine does not provide its query client; this package needs capability API 1.341 or newer.");var he=C.queryClient;function H(){let t=C.api;if(!t?.api)throw new Error("\uC774 Marinara Engine\uC740 \uD328\uD0A4\uC9C0 API \uD074\uB77C\uC774\uC5B8\uD2B8\uB97C \uC81C\uACF5\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.");return t}function w(){return H().api}function x(t,e){try{let r=t.payload;return typeof r?.message=="string"&&r.message?r.message:H().getApiErrorMessage(t,e)}catch{return t instanceof Error&&t.message?t.message:e}}function L(t){let e=t.payload;return typeof e?.error=="string"?e.error:null}function I(){return typeof crypto<"u"&&typeof crypto.randomUUID=="function"?crypto.randomUUID():`${Date.now().toString(36)}-${Math.random().toString(36).slice(2,12)}`}function W(){if(typeof crypto<"u"&&typeof crypto.randomUUID=="function")return crypto.randomUUID();let t=crypto.getRandomValues(new Uint8Array(16));t[6]=t[6]&15|64,t[8]=t[8]&63|128;let e=[...t].map(r=>r.toString(16).padStart(2,"0")).join("");return`${e.slice(0,8)}-${e.slice(8,12)}-${e.slice(12,16)}-${e.slice(16,20)}-${e.slice(20)}`}var A="/forest-workshop",N={listWorlds:()=>w().get(`${A}/worlds`),createWorld:t=>w().post(`${A}/worlds`,t),getState:t=>w().get(`${A}/state?worldId=${encodeURIComponent(t)}`),sendCommand:t=>w().post(`${A}/commands`,t),getBackup:t=>w().get(`${A}/backup?worldId=${encodeURIComponent(t)}`),restore:(t,e)=>w().post(`${A}/restore`,{newWorldId:t,backup:e})};var U="\uC232\uACB0 \uACF5\uBC29 \uBC31\uC5C5 \uD30C\uC77C\uC774 \uC544\uB2D9\uB2C8\uB2E4. \uC124\uC815 \u2192 \uC800\uC7A5\xB7\uBC31\uC5C5\uC5D0\uC11C \uB0B4\uBCF4\uB0B8 JSON \uD30C\uC77C\uC744 \uACE8\uB77C \uC8FC\uC138\uC694.";function z(t){let e=t;if(!e||e.format!=="forest-workshop-backup"||!e.world)return{ok:!1,message:U};let{settings:r,wallet:a,inventory:n}=e.world;if(typeof r?.worldName!="string"||typeof r.playerNickname!="string")return{ok:!1,message:U};let l=n&&typeof n=="object"?Object.values(n).filter(m=>typeof m=="number"&&m>0):[];return{ok:!0,summary:{worldName:r.worldName,playerNickname:r.playerNickname,gold:typeof a?.gold=="number"?a.gold:0,itemKinds:l.length,itemTotal:l.reduce((m,b)=>m+b,0),exportedAt:typeof e.exportedAt=="string"?e.exportedAt:"",assetCount:Array.isArray(e.assets)?e.assets.length:0}}}function K(t){let e=t,r=new Set;return{get:()=>e,set(a){let n=typeof a=="function"?a(e):a;e={...e,...n};for(let l of r)l(e)},subscribe(a){return r.add(a),()=>r.delete(a)}}}var E="forest-workshop:last-world";function ne(){try{return localStorage.getItem(E)}catch{return null}}function q(t){try{t?localStorage.setItem(E,t):localStorage.removeItem(E)}catch{}}function se(t){let e=t.status;return typeof e=="number"&&e>=400&&e<500&&L(t)!==null}function V(){let t=K({route:"worlds",worlds:{state:"loading"},world:null,content:null,busy:{},notice:null,restore:null}),e=new Map;function r(s,d,c=I){let u=e.get(s);if(u&&u.signature===d)return u.id;let f=c();return e.set(s,{id:f,signature:d}),f}function a(s,d){t.set(c=>({busy:{...c.busy,[s]:d}}))}async function n(s,d,c){if(t.get().busy[s])return null;a(s,!0),t.set({notice:null});try{let u=await d();return e.delete(s),u}catch(u){return se(u)&&e.delete(s),t.set({notice:{kind:"error",text:x(u,c)}}),L(u)==="stale_view"&&v(),null}finally{a(s,!1)}}function l(s,d){q(s.worldId),t.set(c=>({world:{state:"ready",value:{worldId:s.worldId,revision:s.revision,updatedAt:s.updatedAt,state:s.state}},content:d??c.content,route:c.route==="worlds"?"home":c.route}))}async function m(){t.set({worlds:{state:"loading"}});try{let{worlds:s}=await N.listWorlds();return t.set({worlds:{state:"ready",value:s}}),s}catch(s){return t.set({worlds:{state:"error",message:x(s,"\uC138\uACC4 \uBAA9\uB85D\uC744 \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.")}}),null}}async function b(s){t.set({world:{state:"loading"},route:"home",notice:null});try{let d=await N.getState(s);l(d,d.content)}catch(d){L(d)==="world_not_found"&&q(null),t.set({world:{state:"error",message:x(d,"\uC138\uACC4\uB97C \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.")}})}}async function v(){let s=t.get().world;s?.state==="ready"&&await b(s.value.worldId)}function O(){let s=t.get().world;return s?.state==="ready"?s.value:null}return{store:t,async start(){let s=await m(),d=ne();s&&d&&s.some(c=>c.worldId===d&&c.readable)&&await b(d)},loadWorlds:m,openWorld:b,reloadWorld:v,navigate(s){t.set({route:s,notice:null,restore:null}),s==="worlds"&&m()},dismissNotice(){t.set({notice:null})},async createWorld(s,d){let c=JSON.stringify([s.trim(),d.trim()]),u=r("create-world",c,W),f=await n("create-world",()=>N.createWorld({worldId:u,worldName:s,playerNickname:d}),"\uC138\uACC4\uB97C \uB9CC\uB4E4\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.");f&&l(f,f.content)},async runCommand(s,d,c={}){let u=O();if(!u)return null;let f=JSON.stringify([u.worldId,d,c]),re=r(s,f),R=await n(s,()=>N.sendCommand({worldId:u.worldId,commandId:re,expectedRevision:u.revision,type:d,payload:c}),"\uC694\uCCAD\uC744 \uCC98\uB9AC\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4. \uB2E4\uC2DC \uC2DC\uB3C4\uD574 \uC8FC\uC138\uC694.");return R?(l({worldId:u.worldId,revision:R.revision,updatedAt:new Date().toISOString(),state:R.state}),R):null},async downloadBackup(){let s=O();if(!s)return;let d=await n("backup",()=>N.getBackup(s.worldId),"\uBC31\uC5C5\uC744 \uB9CC\uB4E4\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.");if(!d)return;let c=new Blob([`${JSON.stringify(d,null,2)}
`],{type:"application/json"}),u=URL.createObjectURL(c),f=document.createElement("a");f.href=u,f.download=`forest-workshop-${s.state.settings.worldName}-${d.exportedAt.slice(0,10)}.json`,document.body.append(f),f.click(),f.remove(),setTimeout(()=>URL.revokeObjectURL(u),1e4),t.set({notice:{kind:"info",text:"\uBC31\uC5C5 \uD30C\uC77C\uC744 \uC800\uC7A5\uD588\uC2B5\uB2C8\uB2E4. \uBE44\uBC00\uD0A4\uB294 \uB4E4\uC5B4 \uC788\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4."}})},async selectRestoreFile(s){let d;try{d=JSON.parse(await s.text())}catch{t.set({restore:null,notice:{kind:"error",text:"\uBC31\uC5C5 \uD30C\uC77C\uC744 \uC77D\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4. JSON \uBC31\uC5C5 \uD30C\uC77C\uC744 \uACE8\uB77C \uC8FC\uC138\uC694."}});return}let c=z(d);if(!c.ok){t.set({restore:null,notice:{kind:"error",text:c.message}});return}t.set({notice:null,restore:{fileName:s.name,signature:`${s.name}:${s.size}:${s.lastModified}`,backup:d,summary:c.summary}})},cancelRestore(){t.set({restore:null})},async confirmRestore(){let s=t.get().restore;if(!s)return;let d=r("restore",s.signature,W),c=await n("restore",()=>N.restore(d,s.backup),"\uBC31\uC5C5\uC744 \uBCF5\uC6D0\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.");c&&(l(c,c.content),t.set({route:"home",restore:null,notice:{kind:"info",text:`\uBC31\uC5C5\uC744 \uC0C8 \uC138\uACC4 '${c.state.settings.worldName}'(\uC73C)\uB85C \uBCF5\uC6D0\uD588\uC2B5\uB2C8\uB2E4. \uAE30\uC874 \uC138\uACC4\uB294 \uADF8\uB300\uB85C\uC785\uB2C8\uB2E4.`}}))}}}function o(t,e={},r=[]){let a=document.createElement(t);e.className&&(a.className=e.className),e.text!==void 0&&(a.textContent=e.text);for(let[n,l]of Object.entries(e.attrs??{}))l!==void 0&&a.setAttribute(n,l);for(let[n,l]of Object.entries(e.on??{}))l&&a.addEventListener(n,l);e.disabled!==void 0&&"disabled"in a&&(a.disabled=e.disabled);for(let n of r)n==null||n===!1||a.append(typeof n=="string"?document.createTextNode(n):n);return a}function k(t,e,r={}){return o("button",{className:r.variant==="secondary"?"button secondary":"button",text:t,attrs:{type:"button",...r.attrs},disabled:r.disabled,on:{click:e}})}function y(t){return o("p",{className:"muted",text:t,attrs:{role:"status"}})}function $(t){return o("p",{className:"error",text:t,attrs:{role:"alert"}})}function D(t){return t>=1024*1024?`${(t/(1024*1024)).toFixed(1)}MiB`:t>=1024?`${Math.round(t/1024)}KiB`:`${t}B`}var F="http://www.w3.org/2000/svg";function S(t,e="0 0 24 24"){return()=>{let r=document.createElementNS(F,"svg");r.setAttribute("viewBox",e),r.setAttribute("aria-hidden","true"),r.setAttribute("focusable","false"),r.setAttribute("class","icon");for(let a of t){let n=document.createElementNS(F,"path");n.setAttribute("d",a),r.append(n)}return r}}var g={back:S(["M15 5l-7 7 7 7"]),chevron:S(["M9 5l7 7-7 7"]),gear:S(["M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z","M19.4 13.5l1.6 1.2-2 3.4-1.9-.7a7.6 7.6 0 0 1-2 1.2l-.3 2h-4l-.3-2a7.6 7.6 0 0 1-2-1.2l-1.9.7-2-3.4 1.6-1.2a7.6 7.6 0 0 1 0-3l-1.6-1.2 2-3.4 1.9.7a7.6 7.6 0 0 1 2-1.2l.3-2h4l.3 2a7.6 7.6 0 0 1 2 1.2l1.9-.7 2 3.4-1.6 1.2a7.6 7.6 0 0 1 0 3z"]),upload:S(["M12 16V4","M7 9l5-5 5 5","M5 20h14"]),download:S(["M12 4v12","M7 11l5 5 5-5","M5 20h14"]),check:S(["M5 12.5l4.5 4.5L19 7.5"]),info:S(["M12 11v6","M12 7.5v.5","M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z"])};function ie(t,e){let r=t.world?.state==="ready"?t.world.value:null;return r?o("div",{className:"world-bar"},[o("span",{className:"counter",attrs:{"aria-label":`\uACE8\uB4DC ${r.state.wallet.gold.toLocaleString("ko-KR")}`}},[o("span",{className:"coin",attrs:{"aria-hidden":"true"}}),o("span",{text:r.state.wallet.gold.toLocaleString("ko-KR")})]),t.route==="settings"?null:o("button",{className:"icon-button",attrs:{type:"button","aria-label":"\uC124\uC815"},on:{click:()=>e.navigate("settings")}},[g.gear()])]):null}function h(t,e,r){let a=t.notice?o("div",{className:`notice ${t.notice.kind}`,attrs:{role:t.notice.kind==="error"?"alert":"status"}},[o("p",{text:t.notice.text}),o("button",{className:"notice-close",text:"\uB2EB\uAE30",attrs:{type:"button","aria-label":"\uC54C\uB9BC \uB2EB\uAE30"},on:{click:()=>e.dismissNotice()}})]):null,n=o("header",{className:"top"},[o("div",{className:"top-row"},[r.back?o("button",{className:"icon-button back",attrs:{type:"button","aria-label":`${r.back.label}(\uC73C)\uB85C \uB3CC\uC544\uAC00\uAE30`},on:{click:()=>e.navigate(r.back.route)}},[g.back()]):null,o("h1",{className:"plaque",text:r.title,attrs:{id:"fw-screen-title"}}),r.showWorldBar?ie(t,e):null]),r.subtitle?o("p",{className:"ribbon",text:r.subtitle}):null]);return o("div",{className:"shell"},[o("main",{className:"page",attrs:{"aria-labelledby":"fw-screen-title"}},[n,a,...r.body])])}function le(t){let e=new Date(t);return Number.isNaN(e.getTime())?"\uC54C \uC218 \uC5C6\uC74C":new Intl.DateTimeFormat("ko-KR",{dateStyle:"medium",timeStyle:"short"}).format(e)}function M(t,e,r){let a=!!t.busy.restore,n=o("input",{className:"visually-hidden",attrs:{type:"file",accept:"application/json,.json",id:r},disabled:a,on:{change:()=>{let v=n.files?.[0];v&&e.selectRestoreFile(v),n.value=""}}}),l=o("label",{className:"menu-row",attrs:{for:r}},[o("span",{className:"menu-icon"},[g.download()]),o("span",{className:"menu-text"},[o("span",{className:"menu-title",text:"\uBC31\uC5C5 \uBD88\uB7EC\uC624\uAE30"}),o("span",{className:"menu-detail",text:"\uC0C8 \uC138\uACC4\uB85C \uBCF5\uC6D0"})]),o("span",{className:"menu-chevron"},[g.chevron()])]),m=t.restore,b=m?o("div",{className:"preview-box",attrs:{"aria-labelledby":`${r}-preview`}},[o("h3",{className:"subhead",text:"\uBCF5\uC6D0 \uBBF8\uB9AC\uBCF4\uAE30",attrs:{id:`${r}-preview`}}),o("dl",{className:"facts"},[o("dt",{text:"\uD30C\uC77C"}),o("dd",{text:m.fileName}),o("dt",{text:"\uC138\uACC4"}),o("dd",{text:m.summary.worldName}),o("dt",{text:"\uB2C9\uB124\uC784"}),o("dd",{text:m.summary.playerNickname}),o("dt",{text:"\uACE8\uB4DC"}),o("dd",{text:m.summary.gold.toLocaleString("ko-KR")}),o("dt",{text:"\uCC3D\uACE0"}),o("dd",{text:`${m.summary.itemKinds}\uC885 \xB7 ${m.summary.itemTotal.toLocaleString("ko-KR")}\uAC1C`}),o("dt",{text:"\uBC31\uC5C5 \uC2DC\uAC01"}),o("dd",{text:le(m.summary.exportedAt)})]),k(a?"\uBCF5\uC6D0\uD558\uB294 \uC911\u2026":"\uC0C8 \uC138\uACC4\uB85C \uBCF5\uC6D0",()=>{e.confirmRestore()},{disabled:a,attrs:{"data-wide":""}}),a?y("\uBCF5\uC6D0\uD558\uB294 \uC911\u2026"):k("\uCDE8\uC18C",()=>e.cancelRestore(),{variant:"secondary"})]):null;return o("div",{className:"restore"},[n,l,b,o("p",{className:"hint"},[g.info(),"\uD604\uC7AC \uC138\uACC4\uB294 \uB36E\uC5B4\uC4F0\uC9C0 \uC54A\uC544\uC694. \uBC31\uC5C5\uC740 \uD56D\uC0C1 \uC0C8 \uC138\uACC4\uB85C \uBCF5\uC6D0\uB429\uB2C8\uB2E4."])])}function de(t){let e=new Date(t);if(Number.isNaN(e.getTime()))return"\uC54C \uC218 \uC5C6\uC74C";let r=new Date,a=e.toDateString()===r.toDateString(),n=new Intl.DateTimeFormat("ko-KR",{hour:"2-digit",minute:"2-digit"}).format(e);return a?`\uC624\uB298 ${n}`:new Intl.DateTimeFormat("ko-KR",{dateStyle:"medium",timeStyle:"short"}).format(e)}function G(t,e){let r=t.world?.state==="ready"?t.world.value:null,a=!!t.busy.backup,n=r?[o("section",{className:"card saved",attrs:{"aria-label":"\uC800\uC7A5 \uC0C1\uD0DC"}},[o("p",{className:"saved-title"},[o("span",{className:"check"},[g.check()]),"\uC800\uC7A5 \uC644\uB8CC"]),o("p",{className:"muted",text:`\uB9C8\uC9C0\uB9C9 \uC800\uC7A5 ${de(r.updatedAt)}`})]),o("section",{className:"card menu",attrs:{"aria-label":"\uBC31\uC5C5"}},[o("button",{className:"menu-row",attrs:{type:"button"},disabled:a,on:{click:()=>{e.downloadBackup()}}},[o("span",{className:"menu-icon"},[g.upload()]),o("span",{className:"menu-text"},[o("span",{className:"menu-title",text:a?"\uBC31\uC5C5 \uB9CC\uB4DC\uB294 \uC911\u2026":"\uBC31\uC5C5 \uB0B4\uBCF4\uB0B4\uAE30"}),o("span",{className:"menu-detail",text:"\uC138\uACC4 \uC124\uC815 \xB7 \uC7AC\uD654 \xB7 \uCC3D\uACE0 \xB7 \uBE44\uBC00\uD0A4 \uC81C\uC678"})]),o("span",{className:"menu-chevron"},[g.chevron()])]),M(t,e,"fw-backup-restore")])]:[y("\uC138\uACC4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026")];return h(t,e,{title:"\uC800\uC7A5\xB7\uBC31\uC5C5",back:{route:"settings",label:"\uC124\uC815"},showWorldBar:!1,body:n})}var B="/forest-workshop/p0",ce={pass:"\uD1B5\uACFC",fail:"\uC2E4\uD328",unavailable:"\uC0AC\uC6A9 \uBD88\uAC00"};function i(t,e={},r=[]){let a=document.createElement(t);e.className&&(a.className=e.className),e.text!==void 0&&(a.textContent=e.text);for(let[n,l]of Object.entries(e.attrs??{}))a.setAttribute(n,l);for(let n of r)n&&a.append(n);return a}var T=class{constructor(){p(this,"node",i("div",{className:"diagnostics"}));p(this,"started",!1);p(this,"status",{state:"loading"});p(this,"probe",null);p(this,"image",{state:"loading"});p(this,"uploading",!1);p(this,"uploadError",null);p(this,"pendingUpload",null)}start(){this.started||(this.started=!0,this.render(),this.loadStatus(),this.loadImage())}async loadStatus(){this.status={state:"loading"},this.render();try{this.status={state:"ready",value:await w().get(`${B}/status`)}}catch(e){this.status={state:"error",message:x(e,"\uD328\uD0A4\uC9C0 \uC0C1\uD0DC\uB97C \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.")}}this.render()}async loadImage(){this.image={state:"loading"},this.render();try{let e=await w().get(`${B}/image`);this.image={state:"ready",value:e.current}}catch(e){this.image={state:"error",message:x(e,"\uC800\uC7A5\uB41C \uADF8\uB9BC\uC744 \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.")}}this.render()}async runProbe(){if(this.probe?.state!=="loading"){this.probe={state:"loading"},this.render();try{let e=await w().post(`${B}/probe`);this.probe={state:"ready",value:e.checks}}catch(e){this.probe={state:"error",message:x(e,"\uC5F0\uACB0 \uC810\uAC80\uC744 \uC2E4\uD589\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.")}}this.render()}}async upload(e){if(this.uploading)return;let r=this.pendingUpload?.file===e?this.pendingUpload:{file:e,key:I()};this.pendingUpload=r,this.uploading=!0,this.uploadError=null,this.render();try{let a=new FormData;a.append("uploadKey",r.key),a.append("file",e,e.name);let n=await w().upload(`${B}/image`,a);this.image={state:"ready",value:n.image},this.pendingUpload=null}catch(a){this.uploadError=x(a,"\uADF8\uB9BC\uC744 \uC62C\uB9AC\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4. \uAE30\uC874 \uADF8\uB9BC\uC740 \uADF8\uB300\uB85C\uC785\uB2C8\uB2E4.")}finally{this.uploading=!1,this.render()}}render(){this.node.replaceChildren(i("p",{className:"muted",text:"\uC5D4\uC9C4 \uC5F0\uACB0\uACFC \uC8FC\uBBFC \uADF8\uB9BC \uC800\uC7A5 \uACBD\uB85C\uB97C \uD655\uC778\uD569\uB2C8\uB2E4. \uACB0\uACFC\uB294 \uC138\uACC4\uC5D0 \uC601\uD5A5\uC744 \uC8FC\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4."}),this.renderStatus(),this.renderProbe(),this.renderImage())}retryButton(e,r){let a=i("button",{className:"button secondary",text:e,attrs:{type:"button"}});return a.addEventListener("click",r),a}renderStatus(){let e=i("section",{className:"card",attrs:{"aria-labelledby":"fw-status"}},[i("h2",{text:"\uC5D4\uC9C4 \uC5F0\uACB0",attrs:{id:"fw-status"}})]);if(this.status.state==="loading")e.append(i("p",{className:"muted",text:"\uBD88\uB7EC\uC624\uB294 \uC911\u2026",attrs:{role:"status"}}));else if(this.status.state==="error")e.append(i("p",{className:"error",text:this.status.message,attrs:{role:"alert"}}),this.retryButton("\uB2E4\uC2DC \uC2DC\uB3C4",()=>{this.loadStatus()}));else{let{value:r}=this.status;e.append(i("p",{className:"muted",text:`\uD328\uD0A4\uC9C0 ${r.version} \xB7 \uB2E8\uACC4 ${r.stage}`}),i("ul",{className:"list"},r.host.map(a=>i("li",{className:"row"},[i("span",{className:"name",text:a.name}),i("span",{className:`badge ${a.available?"pass":a.required?"fail":"unavailable"}`,text:a.available?"\uC788\uC74C":a.required?"\uC5C6\uC74C (\uD544\uC218)":"\uC5C6\uC74C"})]))))}return e}renderProbe(){let e=i("button",{className:"button",text:this.probe?.state==="loading"?"\uC810\uAC80 \uC911\u2026":"\uC5F0\uACB0 \uC810\uAC80 \uC2E4\uD589",attrs:{type:"button"}});e.disabled=this.probe?.state==="loading",e.addEventListener("click",()=>{this.runProbe()});let r=i("section",{className:"card",attrs:{"aria-labelledby":"fw-probe"}},[i("h2",{text:"\uC800\uC7A5\xB7\uC790\uB8CC\xB7\uBAA8\uB378 \uC810\uAC80",attrs:{id:"fw-probe"}}),i("p",{className:"muted",text:"\uC784\uC2DC \uBB38\uC11C\uB97C \uC4F0\uACE0 \uC9C0\uC6C1\uB2C8\uB2E4. \uCE90\uB9AD\uD130\xB7\uD398\uB974\uC18C\uB098 \uC6D0\uBCF8\uC740 \uC77D\uAE30\uB9CC \uD558\uBA70, \uBAA8\uB378 \uC0DD\uC131 \uC694\uCCAD\uC740 \uBCF4\uB0B4\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4."}),e]);return!this.probe||this.probe.state==="loading"?r:this.probe.state==="error"?(r.append(i("p",{className:"error",text:this.probe.message,attrs:{role:"alert"}})),r):(r.append(i("ul",{className:"list",attrs:{"aria-live":"polite"}},this.probe.value.map(a=>i("li",{className:"row stacked"},[i("div",{className:"row-head"},[i("span",{className:"name",text:a.label}),i("span",{className:`badge ${a.status}`,text:ce[a.status]})]),i("span",{className:"detail",text:a.detail})])))),r)}renderImage(){let e=i("input",{className:"file",attrs:{type:"file",accept:"image/png,image/webp",id:"fw-file"}});e.disabled=this.uploading,e.addEventListener("change",()=>{let a=e.files?.[0];a&&this.upload(a)});let r=i("section",{className:"card",attrs:{"aria-labelledby":"fw-image"}},[i("h2",{text:"\uC8FC\uBBFC \uADF8\uB9BC \uC800\uC7A5 \uC810\uAC80",attrs:{id:"fw-image"}}),i("p",{className:"muted",text:"PNG \uB610\uB294 \uC815\uC801 WebP(\uCD5C\uB300 20MiB, 4096\xD74096)\uB97C \uACE0\uB974\uBA74 \uD22C\uBA85\uB3C4\uB97C \uC720\uC9C0\uD55C WebP \uD488\uC9C895\uB85C \uBC14\uAFD4 \uC804\uC5ED \uAC24\uB7EC\uB9AC\uC5D0 \uC800\uC7A5\uD569\uB2C8\uB2E4. PNG \uC6D0\uBCF8\uC740 \uBCF4\uAD00\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4."}),i("label",{className:"field-label",text:"\uADF8\uB9BC \uD30C\uC77C \uACE0\uB974\uAE30",attrs:{for:"fw-file"}}),e]);if(this.uploading&&r.append(i("p",{className:"muted",text:"\uBCC0\uD658\uD558\uACE0 \uC800\uC7A5\uD558\uB294 \uC911\u2026",attrs:{role:"status"}})),this.uploadError){r.append(i("p",{className:"error",text:this.uploadError,attrs:{role:"alert"}}));let a=this.pendingUpload;a&&!this.uploading&&r.append(this.retryButton("\uAC19\uC740 \uD30C\uC77C\uB85C \uB2E4\uC2DC \uC2DC\uB3C4",()=>{this.upload(a.file)}))}if(this.image.state==="loading")r.append(i("p",{className:"muted",text:"\uBD88\uB7EC\uC624\uB294 \uC911\u2026",attrs:{role:"status"}}));else if(this.image.state==="error")r.append(i("p",{className:"error",text:this.image.message,attrs:{role:"alert"}}),this.retryButton("\uB2E4\uC2DC \uBD88\uB7EC\uC624\uAE30",()=>{this.loadImage()}));else if(!this.image.value)r.append(i("p",{className:"empty",text:"\uC544\uC9C1 \uC800\uC7A5\uB41C \uADF8\uB9BC\uC774 \uC5C6\uC2B5\uB2C8\uB2E4."}));else{let a=this.image.value,n=i("img",{className:"preview",attrs:{src:`${a.url}${a.url.includes("?")?"&":"?"}v=${a.imageVersion}`,alt:"\uC800\uC7A5\uB41C \uC8FC\uBBFC \uADF8\uB9BC \uBBF8\uB9AC\uBCF4\uAE30",width:String(a.width),height:String(a.height)}});r.append(i("div",{className:"stage"},[n]),i("dl",{className:"facts"},[i("dt",{text:"\uCC38\uC870"}),i("dd",{text:a.reference}),i("dt",{text:"\uD06C\uAE30"}),i("dd",{text:`${a.width}\xD7${a.height}`}),i("dt",{text:"\uC6A9\uB7C9"}),i("dd",{text:`\uC785\uB825 ${D(a.inputBytes)} \u2192 WebP ${D(a.outputBytes)}`}),i("dt",{text:"\uD22C\uBA85\uB3C4"}),i("dd",{text:a.hasTransparency?"\uD22C\uBA85 \uC601\uC5ED \uC788\uC74C (\uC720\uC9C0\uB428)":"\uBD88\uD22C\uBA85 \uADF8\uB9BC"}),i("dt",{text:"\uBC84\uC804"}),i("dd",{text:String(a.imageVersion)})]))}return r}};function _(t,e){return t?.items.find(r=>r.id===e)?.name??e}function me(t,e,r,a){if(t.state.progress.starterKitClaimed||!e)return null;let n=!!r.busy["claim-starter-kit"],l=e.starterKit;return o("section",{className:"card highlight",attrs:{"aria-labelledby":"fw-starter"}},[o("h2",{className:"section-title",text:"\uACF5\uBC29 \uC2DC\uC791 \uAFB8\uB7EC\uBBF8",attrs:{id:"fw-starter"}}),o("p",{className:"muted",text:"\uCCAB \uCC44\uC9D1\uACFC \uAC00\uACF5\uC744 \uC2DC\uC791\uD560 \uC7AC\uB8CC\uC785\uB2C8\uB2E4. \uD55C \uBC88\uB9CC \uBC1B\uC744 \uC218 \uC788\uC5B4\uC694."}),o("ul",{className:"chips"},[o("li",{className:"chip",text:`\uACE8\uB4DC ${l.gold.toLocaleString("ko-KR")}`}),...Object.entries(l.items).map(([m,b])=>o("li",{className:"chip",text:`${_(e,m)} ${b}`}))]),k(n?"\uBC1B\uB294 \uC911\u2026":"\uBC1B\uAE30",()=>{a.runCommand("claim-starter-kit","onboarding.claimStarterKit")},{disabled:n,attrs:{"data-wide":""}})])}function ue(t,e){let r=Object.entries(t.state.inventory).filter(([,n])=>n>0),a=new Map(e?.items.map((n,l)=>[n.id,l]));return r.sort(([n],[l])=>(a.get(n)??999)-(a.get(l)??999)),o("section",{className:"card",attrs:{"aria-labelledby":"fw-storeroom"}},[o("h2",{className:"section-title",text:"\uCC3D\uACE0",attrs:{id:"fw-storeroom"}}),r.length===0?o("p",{className:"empty",text:"\uCC3D\uACE0\uAC00 \uBE44\uC5B4 \uC788\uC2B5\uB2C8\uB2E4."}):o("table",{className:"stock"},[o("thead",{},[o("tr",{},[o("th",{text:"\uC544\uC774\uD15C",attrs:{scope:"col"}}),o("th",{text:"\uBCF4\uC720 \uC218\uB7C9",attrs:{scope:"col"}})])]),o("tbody",{},r.map(([n,l])=>o("tr",{},[o("th",{text:_(e,n),attrs:{scope:"row"}}),o("td",{className:"amount",text:l.toLocaleString("ko-KR")})])))])])}function J(t,e){let r=t.world;if(!r||r.state!=="ready")return h(t,e,{title:"\uC232\uACB0 \uACF5\uBC29",showWorldBar:!1,body:[r?.state==="error"?o("section",{className:"card"},[$(r.message),k("\uC138\uACC4 \uBAA9\uB85D\uC73C\uB85C",()=>e.navigate("worlds"),{variant:"secondary"})]):y("\uC138\uACC4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026")]});let a=r.value;return h(t,e,{title:"\uC232\uACB0 \uACF5\uBC29",subtitle:`${a.state.settings.worldName} \xB7 ${a.state.settings.playerNickname}\uB2D8\uC758 \uACF5\uBC29`,showWorldBar:!0,body:[me(a,t.content,t,e),ue(a,t.content)]})}function Y(t,e,r,a,n,l){let m=o("input",{className:"input",attrs:{id:e,maxlength:String(a),autocomplete:"off",value:r}});return o("form",{className:"field-row",on:{submit:b=>{b.preventDefault();let v=m.value.trim();v&&v!==r&&l(m.value)}}},[o("label",{className:"field-row-label",text:t,attrs:{for:e}}),m,o("button",{className:"button small",text:n?"\uC800\uC7A5 \uC911\u2026":"\uC218\uC815",attrs:{type:"submit"},disabled:n})])}function pe(t,e,r){let{settings:a}=t.state;return o("section",{className:"card",attrs:{"aria-labelledby":"fw-mine"}},[o("h2",{className:"section-title",text:"\uB0B4 \uACF5\uBC29",attrs:{id:"fw-mine"}}),Y("\uB2C9\uB124\uC784","fw-set-nick",a.playerNickname,24,!!e.busy["rename-nickname"],n=>{r.runCommand("rename-nickname","settings.update",{playerNickname:n})}),Y("\uC138\uACC4 \uC774\uB984","fw-set-world",a.worldName,40,!!e.busy["rename-world"],n=>{r.runCommand("rename-world","settings.update",{worldName:n})})])}function P(t,e,r,a){return o("button",{className:"menu-row",attrs:{type:"button"},on:{click:()=>t.navigate(e)}},[o("span",{className:"menu-text"},[o("span",{className:"menu-title",text:r}),o("span",{className:"menu-detail",text:a})]),o("span",{className:"menu-chevron"},[g.chevron()])])}function Q(t,e){let r=t.world?.state==="ready"?t.world.value:null,a=r?[pe(r,t,e),o("section",{className:"card menu",attrs:{"aria-labelledby":"fw-manage"}},[o("h2",{className:"section-title",text:"\uAD00\uB9AC",attrs:{id:"fw-manage"}}),P(e,"backup","\uC800\uC7A5 \xB7 \uBC31\uC5C5","\uBC31\uC5C5 \uB0B4\uBCF4\uB0B4\uAE30 \xB7 \uC0C8 \uC138\uACC4\uB85C \uBCF5\uC6D0"),P(e,"worlds","\uB2E4\uB978 \uC138\uACC4","\uC138\uACC4 \uACE0\uB974\uAE30 \xB7 \uC0C8\uB85C \uB9CC\uB4E4\uAE30"),P(e,"diagnostics","\uC5F0\uACB0 \uC810\uAC80","\uC5D4\uC9C4 \uC5F0\uACB0\uACFC \uC8FC\uBBFC \uADF8\uB9BC \uC800\uC7A5 \uACBD\uB85C \uD655\uC778")])]:[y("\uC138\uACC4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026")];return h(t,e,{title:"\uC124\uC815",back:{route:"home",label:"\uD648"},showWorldBar:!0,body:a})}var X={world:40,nickname:24};function fe(t){let e=new Date(t);return Number.isNaN(e.getTime())?t:new Intl.DateTimeFormat("ko-KR",{dateStyle:"medium",timeStyle:"short"}).format(e)}function ge(t,e){let r=o("section",{className:"card",attrs:{"aria-labelledby":"fw-worlds"}},[o("h2",{className:"section-title",text:"\uB0B4 \uC138\uACC4",attrs:{id:"fw-worlds"}})]),{worlds:a}=t;return a.state==="loading"?r.append(y("\uBD88\uB7EC\uC624\uB294 \uC911\u2026")):a.state==="error"?r.append($(a.message),k("\uB2E4\uC2DC \uC2DC\uB3C4",()=>{e.loadWorlds()},{variant:"secondary"})):a.value.length===0?r.append(o("p",{className:"empty",text:"\uC544\uC9C1 \uC138\uACC4\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4. \uC544\uB798\uC5D0\uC11C \uC0C8\uB85C \uB9CC\uB4E4\uC5B4 \uC8FC\uC138\uC694."})):r.append(o("ul",{className:"list"},a.value.map(n=>o("li",{},[o("button",{className:"row-button",attrs:{type:"button"},disabled:!n.readable,on:{click:()=>{e.openWorld(n.worldId)}}},[o("span",{className:"name",text:n.worldName}),o("span",{className:"detail",text:n.readable?`\uB9C8\uC9C0\uB9C9 \uC800\uC7A5 ${fe(n.updatedAt)}`:"\uC774 \uBC84\uC804\uC5D0\uC11C \uC77D\uC744 \uC218 \uC5C6\uB294 \uC138\uACC4"})])])))),r}function we(t,e){let r=!!t.busy["create-world"],a=o("input",{className:"input",attrs:{id:"fw-world-name",name:"worldName",maxlength:String(X.world),autocomplete:"off",required:""}}),n=o("input",{className:"input",attrs:{id:"fw-nickname",name:"playerNickname",maxlength:String(X.nickname),autocomplete:"off",required:""}});return o("form",{className:"card form",attrs:{"aria-labelledby":"fw-create"},on:{submit:m=>{m.preventDefault(),!(!a.value.trim()||!n.value.trim())&&e.createWorld(a.value,n.value)}}},[o("h2",{className:"section-title",text:"\uC0C8 \uC138\uACC4 \uB9CC\uB4E4\uAE30",attrs:{id:"fw-create"}}),o("p",{className:"muted",text:"\uD50C\uB808\uC774\uC5B4\uB294 \uC678\uD615 \uC5C6\uC774 \uB2C9\uB124\uC784\uC73C\uB85C\uB9CC \uB4F1\uC7A5\uD569\uB2C8\uB2E4. \uB458 \uB2E4 \uB098\uC911\uC5D0 \uC124\uC815\uC5D0\uC11C \uBC14\uAFC0 \uC218 \uC788\uC2B5\uB2C8\uB2E4."}),o("label",{className:"field-label",text:"\uC138\uACC4 \uC774\uB984",attrs:{for:"fw-world-name"}}),a,o("label",{className:"field-label",text:"\uB0B4 \uB2C9\uB124\uC784",attrs:{for:"fw-nickname"}}),n,o("button",{className:"button",text:r?"\uB9CC\uB4DC\uB294 \uC911\u2026":"\uB9CC\uB4E4\uAE30",attrs:{type:"submit"},disabled:r})])}function Z(t,e){let r=t.world?.state==="ready";return h(t,e,{title:"\uC138\uACC4 \uACE0\uB974\uAE30",subtitle:"\uC232\uACB0 \uACF5\uBC29",back:r?{route:"settings",label:"\uC124\uC815"}:void 0,showWorldBar:!1,body:[ge(t,e),we(t,e),o("section",{className:"card menu",attrs:{"aria-label":"\uBC31\uC5C5\uC5D0\uC11C \uBCF5\uC6D0"}},[M(t,e,"fw-worlds-restore")])]})}var ee=`
:host {
  --fw-page: #efe2c2;
  --fw-surface: #fbf4e2;
  --fw-surface-2: #f4e9cd;
  --fw-border: #d9c296;
  --fw-border-strong: #c2a473;
  --fw-text: #46301f;
  --fw-muted: #765d44;
  --fw-accent: #2c7469;
  --fw-accent-strong: #215a51;
  --fw-on-accent: #fffaf0;
  --fw-wood: #9a6a3e;
  --fw-wood-dark: #6e4628;
  --fw-on-wood: #fff4d8;
  --fw-leaf: #5c9447;
  --fw-gold: #e3b23c;
  --fw-pass: #2f6e34;
  --fw-fail: #a93a2f;
  --fw-unavailable: #7f6418;
  display: block;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  background: linear-gradient(180deg, #dfe9c8 0, var(--fw-page) 9rem);
  color: var(--fw-text);
  color-scheme: light;
  font: 400 1rem/1.5 system-ui, -apple-system, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif;
  -webkit-text-size-adjust: 100%;
}
* { box-sizing: border-box; }
.shell { min-height: 100%; }
.page {
  width: 100%;
  max-width: 520px;
  margin: 0 auto;
  padding: 0.75rem 1rem calc(1.5rem + env(safe-area-inset-bottom, 0px));
  display: grid;
  gap: 0.875rem;
  align-content: start;
}
.page > *, .card > * { min-width: 0; }

/* Header: back \xB7 plaque \xB7 gold and gear */
.top { display: grid; gap: 0.4rem; justify-items: center; }
.top-row { display: flex; align-items: center; gap: 0.5rem; width: 100%; min-width: 0; }
.plaque {
  flex: 1 1 auto;
  min-width: 0;
  margin: 0;
  padding: 0.35rem 1rem;
  border-radius: 0.6rem;
  border: 2px solid var(--fw-wood-dark);
  background: linear-gradient(180deg, #b07d4c, var(--fw-wood));
  color: var(--fw-on-wood);
  font-size: 1.35rem;
  font-weight: 800;
  line-height: 1.25;
  letter-spacing: 0.02em;
  text-align: center;
  text-shadow: 0 2px 0 var(--fw-wood-dark);
  box-shadow: 0 3px 0 var(--fw-wood-dark);
  overflow-wrap: anywhere;
}
.ribbon {
  margin: 0;
  max-width: 100%;
  padding: 0.15rem 0.9rem;
  border-radius: 999px;
  border: 1px solid var(--fw-border-strong);
  background: var(--fw-surface);
  color: var(--fw-muted);
  font-size: 0.85rem;
  text-align: center;
  overflow-wrap: anywhere;
}
.world-bar { display: flex; align-items: center; gap: 0.4rem; flex: none; }
.counter {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  min-height: 2.25rem;
  padding: 0 0.65rem 0 0.35rem;
  border-radius: 999px;
  border: 1px solid var(--fw-border-strong);
  background: var(--fw-surface);
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}
.coin {
  width: 1.35rem;
  height: 1.35rem;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #fbe39a, var(--fw-gold) 60%, #b98420);
  border: 1px solid #a8761c;
}
.icon-button {
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  border: 2px solid var(--fw-border-strong);
  background: var(--fw-surface);
  color: var(--fw-wood-dark);
  cursor: pointer;
}
.icon { width: 1.35rem; height: 1.35rem; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }

/* Cards and sections */
.card {
  display: grid;
  gap: 0.75rem;
  align-content: start;
  padding: 1rem;
  border-radius: 0.9rem;
  border: 1px solid var(--fw-border);
  background: var(--fw-surface);
  box-shadow: 0 2px 0 rgba(110, 70, 40, 0.12);
}
.card.highlight { border: 2px solid var(--fw-leaf); }
.section-title, .card h2 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  font-size: 1.1rem;
  font-weight: 800;
}
.section-title::before {
  content: "";
  flex: none;
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 0 70% 0 70%;
  background: var(--fw-leaf);
}
.subhead { margin: 0; font-size: 1rem; font-weight: 800; }
.card p { margin: 0; }
.muted { color: var(--fw-muted); font-size: 0.9rem; }
.empty { color: var(--fw-muted); }
.error { color: var(--fw-fail); font-weight: 700; overflow-wrap: anywhere; }
.hint { display: flex; align-items: flex-start; gap: 0.4rem; margin: 0; color: var(--fw-muted); font-size: 0.85rem; }
.hint .icon { flex: none; width: 1.1rem; height: 1.1rem; margin-top: 0.1rem; }

/* Buttons */
.button {
  justify-self: start;
  min-height: 2.75rem;
  padding: 0.5rem 1.25rem;
  border-radius: 0.8rem;
  border: 2px solid var(--fw-accent-strong);
  background: var(--fw-accent);
  color: var(--fw-on-accent);
  font: inherit;
  font-weight: 800;
  box-shadow: 0 3px 0 var(--fw-accent-strong);
  cursor: pointer;
}
.button[data-wide] { justify-self: stretch; font-size: 1.05rem; }
.button.small { min-height: 2.5rem; padding: 0.35rem 0.9rem; font-size: 0.9rem; }
.button.secondary { background: var(--fw-surface); color: var(--fw-wood-dark); border-color: var(--fw-border-strong); box-shadow: 0 2px 0 var(--fw-border-strong); }
.button:disabled { opacity: 0.6; cursor: progress; }

/* Forms */
.form { gap: 0.5rem; }
.form .button { margin-top: 0.5rem; }
.field-label { font-weight: 700; }
.input {
  width: 100%;
  min-width: 0;
  min-height: 2.75rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--fw-border-strong);
  border-radius: 0.6rem;
  background: #fffaf0;
  color: var(--fw-text);
  font: inherit;
}
.field-row { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: 0.5rem; }
.field-row-label { font-weight: 700; min-width: 4.5rem; }
@media (max-width: 360px) {
  .field-row { grid-template-columns: minmax(0, 1fr) auto; }
  .field-row-label { grid-column: 1 / -1; }
}

/* Menu rows (\uC124\uC815 \xB7 \uAD00\uB9AC, \uC800\uC7A5\xB7\uBC31\uC5C5) */
.menu { gap: 0.5rem; }
.menu-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  min-height: 3.5rem;
  padding: 0.6rem 0.75rem;
  border-radius: 0.7rem;
  border: 1px solid var(--fw-border);
  background: var(--fw-surface-2);
  color: var(--fw-text);
  font: inherit;
  text-align: left;
  cursor: pointer;
}
.menu-row:disabled { opacity: 0.6; cursor: progress; }
.menu-icon {
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.6rem;
  background: var(--fw-accent);
  color: var(--fw-on-accent);
}
.menu-text { display: grid; flex: 1; min-width: 0; }
.menu-title { font-weight: 800; }
.menu-detail { color: var(--fw-muted); font-size: 0.85rem; overflow-wrap: anywhere; }
.menu-chevron { flex: none; color: var(--fw-wood-dark); display: inline-flex; }
.restore { display: grid; gap: 0.6rem; }
.preview-box { display: grid; gap: 0.6rem; padding: 0.75rem; border-radius: 0.7rem; border: 1px dashed var(--fw-border-strong); background: #fffaf0; }
.saved-title { display: flex; align-items: center; gap: 0.5rem; font-size: 1.2rem; font-weight: 800; }
.check { display: inline-flex; width: 2rem; height: 2rem; align-items: center; justify-content: center; border-radius: 50%; background: var(--fw-pass); color: #fff; }
.visually-hidden { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }
label.menu-row:focus-within { outline: 3px solid var(--fw-accent); outline-offset: 2px; }

/* Lists, chips, stock table */
.list { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.5rem; }
.row { display: flex; justify-content: space-between; align-items: center; gap: 0.75rem; min-width: 0; }
.row.stacked { display: grid; gap: 0.25rem; padding-bottom: 0.5rem; border-bottom: 1px solid var(--fw-border); }
.row.stacked:last-child { border-bottom: 0; padding-bottom: 0; }
.row-head { display: flex; justify-content: space-between; align-items: center; gap: 0.75rem; }
.name { min-width: 0; overflow-wrap: anywhere; }
.detail { color: var(--fw-muted); font-size: 0.85rem; overflow-wrap: anywhere; }
.row-button {
  display: grid;
  gap: 0.15rem;
  width: 100%;
  min-height: 3rem;
  padding: 0.6rem 0.75rem;
  border: 1px solid var(--fw-border);
  border-radius: 0.7rem;
  background: var(--fw-surface-2);
  color: var(--fw-text);
  font: inherit;
  font-weight: 700;
  text-align: left;
  cursor: pointer;
}
.row-button .detail { font-weight: 400; }
.row-button:disabled { opacity: 0.6; cursor: not-allowed; }
.chips { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 0.4rem; }
.chip { padding: 0.2rem 0.7rem; border-radius: 999px; border: 1px solid var(--fw-border-strong); background: #fffaf0; font-size: 0.9rem; font-weight: 700; }
.stock { width: 100%; border-collapse: separate; border-spacing: 0 0.35rem; }
.stock th, .stock td { padding: 0.45rem 0.6rem; text-align: left; }
.stock thead th { color: var(--fw-muted); font-size: 0.8rem; font-weight: 700; }
.stock tbody th, .stock tbody td { background: var(--fw-surface-2); }
.stock tbody th { border-radius: 0.5rem 0 0 0.5rem; font-weight: 700; }
.stock tbody td { border-radius: 0 0.5rem 0.5rem 0; }
.stock .amount, .stock thead th:last-child { text-align: right; }
.amount { font-variant-numeric: tabular-nums; font-weight: 800; }

/* Status badges (\uC5F0\uACB0 \uC810\uAC80) */
.badge { flex: none; font-size: 0.8rem; font-weight: 800; padding: 0.1rem 0.55rem; border-radius: 999px; border: 1px solid currentColor; background: #fffaf0; }
.badge.pass { color: var(--fw-pass); }
.badge.fail { color: var(--fw-fail); }
.badge.unavailable { color: var(--fw-unavailable); }
.diagnostics { display: grid; gap: 0.875rem; min-width: 0; }

/* Notice */
.notice { display: flex; align-items: flex-start; gap: 0.75rem; padding: 0.75rem 1rem; border-radius: 0.8rem; border: 2px solid var(--fw-leaf); background: var(--fw-surface); }
.notice p { margin: 0; flex: 1; min-width: 0; overflow-wrap: anywhere; }
.notice.error { border-color: var(--fw-fail); color: var(--fw-fail); background: #fbe9e4; }
.notice-close { flex: none; min-height: 2.75rem; border: 0; background: none; color: inherit; font: inherit; font-weight: 700; text-decoration: underline; cursor: pointer; }

/* Picture checks (\uC5F0\uACB0 \uC810\uAC80) */
.file { width: 100%; max-width: 100%; font: inherit; min-height: 2.75rem; }
.stage {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  min-height: 12rem;
  padding: 0.75rem;
  border-radius: 0.6rem;
  background-color: #efe6d0;
  background-image: linear-gradient(45deg, #ddd0b2 25%, transparent 25%, transparent 75%, #ddd0b2 75%),
    linear-gradient(45deg, #ddd0b2 25%, transparent 25%, transparent 75%, #ddd0b2 75%);
  background-size: 16px 16px;
  background-position: 0 0, 8px 8px;
}
.preview { max-width: 100%; max-height: 22rem; width: auto; height: auto; object-fit: contain; }
.facts { margin: 0; display: grid; grid-template-columns: max-content minmax(0, 1fr); gap: 0.25rem 0.75rem; font-size: 0.9rem; }
.facts dt { color: var(--fw-muted); }
.facts dd { margin: 0; overflow-wrap: anywhere; font-weight: 700; }

/* Focus */
.button:focus-visible, .icon-button:focus-visible, .menu-row:focus-visible, .row-button:focus-visible,
.notice-close:focus-visible, .input:focus-visible, .file:focus-visible {
  outline: 3px solid var(--fw-accent);
  outline-offset: 2px;
}
@media (prefers-reduced-motion: reduce) { * { scroll-behavior: auto; } }
`;var te="marinara-capability-forest-workshop",j=class extends HTMLElement{constructor(){super();p(this,"root");p(this,"controller",null);p(this,"diagnostics",null);p(this,"unsubscribe",null);p(this,"styleNode",document.createElement("style"));this.root=this.attachShadow({mode:"open"}),this.styleNode.textContent=ee}connectedCallback(){this.controller||(this.controller=V(),this.diagnostics=new T,this.controller.start()),this.unsubscribe?.(),this.unsubscribe=this.controller.store.subscribe(r=>this.render(r)),this.render(this.controller.store.get())}disconnectedCallback(){this.unsubscribe?.(),this.unsubscribe=null}render(r){let a=this.controller,n;switch(r.route){case"home":n=J(r,a);break;case"settings":n=Q(r,a);break;case"backup":n=G(r,a);break;case"diagnostics":this.diagnostics.start(),n=h(r,a,{title:"\uC5F0\uACB0 \uC810\uAC80",back:{route:"settings",label:"\uC124\uC815"},showWorldBar:!1,body:[this.diagnostics.node]});break;default:n=Z(r,a)}let l=this.root.activeElement?.id;this.root.replaceChildren(this.styleNode,n),l&&this.root.getElementById(l)?.focus()}};typeof customElements<"u"&&!customElements.get(te)&&customElements.define(te,j);
