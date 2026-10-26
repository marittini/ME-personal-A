var Me=Object.defineProperty;var ze=(t,r,a)=>r in t?Me(t,r,{enumerable:!0,configurable:!0,writable:!0,value:a}):t[r]=a;var w=(t,r,a)=>ze(t,typeof r!="symbol"?r+"":r,a);var I=globalThis.__MARINARA_HOST__;if(!I||I.version!==1||!I.queryClient)throw new Error("Marinara Engine does not provide its query client; this package needs capability API 1.341 or newer.");var st=I.queryClient;function Z(){let t=I.api;if(!t?.api)throw new Error("\uC774 Marinara Engine\uC740 \uD328\uD0A4\uC9C0 API \uD074\uB77C\uC774\uC5B8\uD2B8\uB97C \uC81C\uACF5\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.");return t}function y(){return Z().api}function k(t,r){try{let a=t.payload;return typeof a?.message=="string"&&a.message?a.message:Z().getApiErrorMessage(t,r)}catch{return t instanceof Error&&t.message?t.message:r}}function B(t){let r=t.payload;return typeof r?.error=="string"?r.error:null}function $(){return typeof crypto<"u"&&typeof crypto.randomUUID=="function"?crypto.randomUUID():`${Date.now().toString(36)}-${Math.random().toString(36).slice(2,12)}`}function U(){if(typeof crypto<"u"&&typeof crypto.randomUUID=="function")return crypto.randomUUID();let t=crypto.getRandomValues(new Uint8Array(16));t[6]=t[6]&15|64,t[8]=t[8]&63|128;let r=[...t].map(a=>a.toString(16).padStart(2,"0")).join("");return`${r.slice(0,8)}-${r.slice(8,12)}-${r.slice(12,16)}-${r.slice(16,20)}-${r.slice(20)}`}var M="/forest-workshop",C={listWorlds:()=>y().get(`${M}/worlds`),createWorld:t=>y().post(`${M}/worlds`,t),getState:t=>y().get(`${M}/state?worldId=${encodeURIComponent(t)}`),sendCommand:t=>y().post(`${M}/commands`,t),getStorage:t=>y().get(`${M}/storage?worldId=${encodeURIComponent(t)}`),getBackup:t=>y().get(`${M}/backup?worldId=${encodeURIComponent(t)}`),restore:(t,r)=>y().post(`${M}/restore`,{newWorldId:t,backup:r})};var Q="\uC232\uACB0 \uACF5\uBC29 \uBC31\uC5C5 \uD30C\uC77C\uC774 \uC544\uB2D9\uB2C8\uB2E4. \uC124\uC815 \u2192 \uC800\uC7A5\xB7\uBC31\uC5C5\uC5D0\uC11C \uB0B4\uBCF4\uB0B8 JSON \uD30C\uC77C\uC744 \uACE8\uB77C \uC8FC\uC138\uC694.";function X(t){let r=t;if(!r||r.format!=="forest-workshop-backup"||!r.world)return{ok:!1,message:Q};let{settings:a,wallet:o,inventory:n}=r.world;if(typeof a?.worldName!="string"||typeof a.playerNickname!="string")return{ok:!1,message:Q};let l=n&&typeof n=="object"?Object.values(n).filter(u=>typeof u=="number"&&u>0):[];return{ok:!0,summary:{worldName:a.worldName,playerNickname:a.playerNickname,gold:typeof o?.gold=="number"?o.gold:0,itemKinds:l.length,itemTotal:l.reduce((u,h)=>u+h,0),exportedAt:typeof r.exportedAt=="string"?r.exportedAt:"",residents:Array.isArray(r.world.residents)?r.world.residents.length:0,pairs:Array.isArray(r.world.pairs)?r.world.pairs.length:0,pictures:Array.isArray(r.assets)?r.assets.length:0}}}var G={tickets:{label:"\uCD08\uB300\uAD8C",phase:"P3"},weather:{label:"\uD604\uC2E4 \uB0A0\uC528",phase:"P5"},mail:{label:"\uC6B0\uD3B8\uD568",phase:"P4"},residents:{label:"\uC8FC\uBBFC",phase:"P2"},"work-report":{label:"\uC791\uC5C5 \uBCF4\uACE0",phase:"P3"},"offline-cap":{label:"\uBBF8\uC811\uC18D \uB204\uC801 \uC9C4\uD589",phase:"P3"},stories:{label:"\uC8FC\uBBFC \uC774\uC57C\uAE30",phase:"P4"},explore:{label:"\uD0D0\uC0AC",phase:"P4"},invite:{label:"\uCD08\uB300",phase:"P3"},"work-fields":{label:"\uBD84\uC57C\uBCC4 \uC791\uC5C5",phase:"P3"},"work-mode":{label:"\uC790\uB3D9 \uC6B4\uC601 \xB7 \uC9C0\uC815 \uD69F\uC218",phase:"P3"},"work-rules":{label:"\uC6B4\uC601 \uADDC\uCE59",phase:"P3"},"facility-upgrade":{label:"\uC2DC\uC124 \uAC15\uD654",phase:"P3"},"stock-protection":{label:"\uC7AC\uACE0 \uBCF4\uD638 \uD3B8\uC9D1",phase:"P3"},"auto-sell":{label:"\uC790\uB3D9 \uD310\uB9E4",phase:"P3"},"weather-effects":{label:"\uB0A0\uC528 \uD6A8\uACFC",phase:"P5"},"auto-read":{label:"\uC790\uB3D9 \uC77D\uAE30",phase:"P4"},"resident-images":{label:"\uC8FC\uBBFC \uADF8\uB9BC \uAD00\uB9AC",phase:"P2"},"ai-guidelines":{label:"AI \uC9C0\uCE68 \uAD00\uB9AC",phase:"P4"},memory:{label:"\uAE30\uC5B5 \uAD00\uB9AC",phase:"P4"},"image-history":{label:"\uADF8\uB9BC \uC774\uB825 \uC815\uB9AC",phase:"P2"}};function j(t){return t in G}function ee(t){return G[t]?.phase??""}function te(t){let r=G[t];return r?`${r.label} \uAE30\uB2A5\uC740 \uC900\uBE44 \uC911\uC774\uC5D0\uC694. \uAC1C\uBC1C ${r.phase} \uB2E8\uACC4\uC5D0\uC11C \uC5F4\uB824\uC694.`:""}var re="forest-workshop:font-size",N={min:12,max:22,default:16,step:1};function P(t){return Number.isFinite(t)?Math.min(N.max,Math.max(N.min,Math.round(t))):N.default}function ae(){try{let t=localStorage.getItem(re);return t===null?N.default:P(Number(t))}catch{return N.default}}function oe(t){try{localStorage.setItem(re,String(P(t)))}catch{}}function ne(t){let r=t,a=new Set;return{get:()=>r,set(o){let n=typeof o=="function"?o(r):o;r={...r,...n};for(let l of a)l(r)},subscribe(o){return a.add(o),()=>a.delete(o)}}}var K="forest-workshop:last-world";function Ae(){try{return localStorage.getItem(K)}catch{return null}}function ie(t){try{t?localStorage.setItem(K,t):localStorage.removeItem(K)}catch{}}function Ie(t){let r=t.status;return typeof r=="number"&&r>=400&&r<500&&B(t)!==null}function se(){let t=ne({route:"worlds",worlds:{state:"loading"},world:null,content:null,busy:{},notice:null,restore:null,fontSize:ae(),facilitiesTab:"facilities",storage:null,starterSheetHidden:!1}),r=new Map;function a(s,d,p=$){let g=r.get(s);if(g&&g.signature===d)return g.id;let x=p();return r.set(s,{id:x,signature:d}),x}function o(s,d){t.set(p=>({busy:{...p.busy,[s]:d}}))}async function n(s,d,p){if(t.get().busy[s])return null;o(s,!0),t.set({notice:null});try{let g=await d();return r.delete(s),g}catch(g){return Ie(g)&&r.delete(s),t.set({notice:{kind:"error",text:k(g,p)}}),B(g)==="stale_view"&&T(),null}finally{o(s,!1)}}function l(s,d){ie(s.worldId),t.set(p=>({world:{state:"ready",value:{worldId:s.worldId,revision:s.revision,updatedAt:s.updatedAt,state:s.state}},content:d??p.content,route:p.route==="worlds"?"home":p.route}))}async function u(){t.set({worlds:{state:"loading"}});try{let{worlds:s}=await C.listWorlds();return t.set({worlds:{state:"ready",value:s}}),s}catch(s){return t.set({worlds:{state:"error",message:k(s,"\uC138\uACC4 \uBAA9\uB85D\uC744 \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.")}}),null}}async function h(s){t.set({world:{state:"loading"},route:"home",notice:null});try{let d=await C.getState(s);l(d,d.content)}catch(d){B(d)==="world_not_found"&&ie(null),t.set({world:{state:"error",message:k(d,"\uC138\uACC4\uB97C \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.")}})}}async function R(){let s=D();if(s){t.set({storage:{state:"loading"}});try{t.set({storage:{state:"ready",value:await C.getStorage(s.worldId)}})}catch(d){t.set({storage:{state:"error",message:k(d,"\uC800\uC7A5 \uACF5\uAC04\uC744 \uD655\uC778\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.")}})}}}async function T(){let s=t.get().world;s?.state==="ready"&&await h(s.value.worldId)}function D(){let s=t.get().world;return s?.state==="ready"?s.value:null}return{store:t,async start(){let s=await u(),d=Ae();s&&d&&s.some(p=>p.worldId===d&&p.readable)&&await h(d)},loadWorlds:u,openWorld:h,reloadWorld:T,navigate(s){t.set({route:s,notice:null,restore:null}),s==="worlds"&&u(),s==="backup"&&R()},notifyLocked(s){t.set({notice:{kind:"info",text:te(s)}})},setFontSize(s){let d=P(s);oe(d),t.set({fontSize:d})},setFacilitiesTab(s){t.set({facilitiesTab:s})},hideStarterSheet(){t.set({starterSheetHidden:!0})},showStarterSheet(){t.set({starterSheetHidden:!1})},dismissNotice(){t.set({notice:null})},async createWorld(s,d){let p=JSON.stringify([s.trim(),d.trim()]),g=a("create-world",p,U),x=await n("create-world",()=>C.createWorld({worldId:g,worldName:s,playerNickname:d}),"\uC138\uACC4\uB97C \uB9CC\uB4E4\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.");x&&l(x,x.content)},async runCommand(s,d,p={}){let g=D();if(!g)return null;let x=JSON.stringify([g.worldId,d,p]),Ce=a(s,x),F=await n(s,()=>C.sendCommand({worldId:g.worldId,commandId:Ce,expectedRevision:g.revision,type:d,payload:p}),"\uC694\uCCAD\uC744 \uCC98\uB9AC\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4. \uB2E4\uC2DC \uC2DC\uB3C4\uD574 \uC8FC\uC138\uC694.");return F?(l({worldId:g.worldId,revision:F.revision,updatedAt:new Date().toISOString(),state:F.state}),F):null},async downloadBackup(){let s=D();if(!s)return;let d=await n("backup",()=>C.getBackup(s.worldId),"\uBC31\uC5C5\uC744 \uB9CC\uB4E4\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.");if(!d)return;let p=new Blob([`${JSON.stringify(d,null,2)}
`],{type:"application/json"}),g=URL.createObjectURL(p),x=document.createElement("a");x.href=g,x.download=`forest-workshop-${s.state.settings.worldName}-${d.exportedAt.slice(0,10)}.json`,document.body.append(x),x.click(),x.remove(),setTimeout(()=>URL.revokeObjectURL(g),1e4),t.set({notice:{kind:"info",text:"\uBC31\uC5C5 \uD30C\uC77C\uC744 \uC800\uC7A5\uD588\uC2B5\uB2C8\uB2E4. \uBE44\uBC00\uD0A4\uB294 \uB4E4\uC5B4 \uC788\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4."}})},async selectRestoreFile(s){let d;try{d=JSON.parse(await s.text())}catch{t.set({restore:null,notice:{kind:"error",text:"\uBC31\uC5C5 \uD30C\uC77C\uC744 \uC77D\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4. JSON \uBC31\uC5C5 \uD30C\uC77C\uC744 \uACE8\uB77C \uC8FC\uC138\uC694."}});return}let p=X(d);if(!p.ok){t.set({restore:null,notice:{kind:"error",text:p.message}});return}t.set({notice:null,restore:{fileName:s.name,signature:`${s.name}:${s.size}:${s.lastModified}`,backup:d,summary:p.summary}})},cancelRestore(){t.set({restore:null})},async confirmRestore(){let s=t.get().restore;if(!s)return;let d=a("restore",s.signature,U),p=await n("restore",()=>C.restore(d,s.backup),"\uBC31\uC5C5\uC744 \uBCF5\uC6D0\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.");p&&(l(p,p.content),t.set({route:"home",restore:null,notice:{kind:"info",text:`\uBC31\uC5C5\uC744 \uC0C8 \uC138\uACC4 '${p.state.settings.worldName}'(\uC73C)\uB85C \uBCF5\uC6D0\uD588\uC2B5\uB2C8\uB2E4. \uAE30\uC874 \uC138\uACC4\uB294 \uADF8\uB300\uB85C\uC785\uB2C8\uB2E4.`}}))}}}function e(t,r={},a=[]){let o=document.createElement(t);r.className&&(o.className=r.className),r.text!==void 0&&(o.textContent=r.text);for(let[n,l]of Object.entries(r.attrs??{}))l!==void 0&&o.setAttribute(n,l);for(let[n,l]of Object.entries(r.on??{}))l&&o.addEventListener(n,l);r.disabled!==void 0&&"disabled"in o&&(o.disabled=r.disabled);for(let n of a)n==null||n===!1||o.append(typeof n=="string"?document.createTextNode(n):n);return o}function z(t,r,a={}){return e("button",{className:a.variant==="secondary"?"button secondary":"button",text:t,attrs:{type:"button",...a.attrs},disabled:a.disabled,on:{click:r}})}function S(t){return e("p",{className:"muted",text:t,attrs:{role:"status"}})}function L(t){return e("p",{className:"error",text:t,attrs:{role:"alert"}})}function q(t){return t>=1024*1024?`${(t/(1024*1024)).toFixed(1)}MiB`:t>=1024?`${Math.round(t/1024)}KiB`:`${t}B`}var _="http://www.w3.org/2000/svg";function m(t){return(r="icon")=>{let a=document.createElementNS(_,"svg");a.setAttribute("viewBox","0 0 24 24"),a.setAttribute("aria-hidden","true"),a.setAttribute("focusable","false"),a.setAttribute("class",r);for(let o of t){let n=typeof o=="string"?{d:o}:o,l=n.circle?document.createElementNS(_,"circle"):document.createElementNS(_,"path");n.circle?(l.setAttribute("cx",String(n.circle[0])),l.setAttribute("cy",String(n.circle[1])),l.setAttribute("r",String(n.circle[2]))):l.setAttribute("d",n.d??""),n.fill&&l.setAttribute("class","fill"),a.append(l)}return a}}var i={back:m(["M15 5l-7 7 7 7"]),chevron:m(["M9 5l7 7-7 7"]),gear:m([{circle:[12,12,3.2]},"M19.4 13.5l1.6 1.2-2 3.4-1.9-.7a7.6 7.6 0 0 1-2 1.2l-.3 2h-4l-.3-2a7.6 7.6 0 0 1-2-1.2l-1.9.7-2-3.4 1.6-1.2a7.6 7.6 0 0 1 0-3l-1.6-1.2 2-3.4 1.9.7a7.6 7.6 0 0 1 2-1.2l.3-2h4l.3 2a7.6 7.6 0 0 1 2 1.2l1.9-.7 2 3.4-1.6 1.2a7.6 7.6 0 0 1 0 3z"]),lock:m(["M7 11V8a5 5 0 0 1 10 0v3","M5.5 11h13v9h-13z"]),home:m(["M3.5 11.5L12 4l8.5 7.5","M6 10v10h12V10","M10 20v-5h4v5"]),hammer:m(["M14 4l6 6-2.5 2.5-6-6z","M12.5 8.5L4 17l3 3 8.5-8.5"]),compass:m([{circle:[12,12,8.5]},"M15.5 8.5l-2 5-5 2 2-5z"]),residents:m([{circle:[9,9,3.2]},{circle:[16.5,10,2.6]},"M3.5 19c.8-3.2 3-5 5.5-5s4.7 1.8 5.5 5","M14.5 15.5c2.6-.6 5 .8 6 3.5"]),ticket:m(["M4 7h16v3a2 2 0 0 0 0 4v3H4v-3a2 2 0 0 0 0-4z","M10 9.5c1.5 0 3 1 3 2.5s-1.5 2.5-3 2.5"]),mail:m(["M4 6.5h16v11H4z","M4.5 7l7.5 6 7.5-6"]),weather:m(["M7 18h10a3.5 3.5 0 0 0 .4-7A5 5 0 0 0 7.8 10 4 4 0 0 0 7 18z"]),clock:m([{circle:[12,12,8.5]},"M12 7.5V12l3 2"]),info:m([{circle:[12,12,8.5]},"M12 11v5.5","M12 7.6v.4"]),check:m(["M5 12.5l4.5 4.5L19 7.5"]),eye:m(["M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z",{circle:[12,12,2.8]}]),image:m(["M4 5h16v14H4z",{circle:[9,10,1.6]},"M4.5 17l5-5 4 4 2.5-2.5 3.5 3.5"]),landscape:m(["M4 5h16v14H4z","M4.5 17l5.5-6 4 4 2-2 3.5 4"]),document:m(["M7 3.5h7l4 4V20.5H7z","M14 3.5v4h4","M9.5 12h6","M9.5 15.5h6"]),folder:m(["M3.5 7h6l2 2h9v10h-17z"]),book:m(["M12 6.5c-2-1.3-4.7-1.6-8-1v13c3.3-.6 6-.3 8 1 2-1.3 4.7-1.6 8-1v-13c-3.3-.6-6-.3-8 1z","M12 6.5v13"]),flower:m([{circle:[12,12,2.4]},{circle:[12,6.5,2.6]},{circle:[17.2,10.3,2.6]},{circle:[15.2,16.5,2.6]},{circle:[8.8,16.5,2.6]},{circle:[6.8,10.3,2.6]}]),people:m([{circle:[8,8.5,2.8]},{circle:[16,8.5,2.8]},"M3 19c.6-3 2.5-4.6 5-4.6s4.4 1.6 5 4.6","M11 19c.6-3 2.5-4.6 5-4.6s4.4 1.6 5 4.6"]),pair:m([{circle:[9,12,4.5]},{circle:[15,12,4.5]}]),upload:m(["M12 15.5V4.5","M7.5 9l4.5-4.5L16.5 9","M5 14v5.5h14V14"]),download:m(["M12 4.5v11","M7.5 11l4.5 4.5 4.5-4.5","M5 14v5.5h14V14"]),restore:m(["M4.5 12a7.5 7.5 0 1 0 2.2-5.3","M4.5 4.5v4h4"]),leaf:m(["M5 19c0-8 5-13 14-14-1 9-6 14-14 14z","M5 19l7-7"]),sprout:m(["M12 20v-8","M12 12c0-3.5-2.5-6-6.5-6 0 3.5 2.5 6 6.5 6z","M12 12c0-3.5 2.5-6 6.5-6 0 3.5-2.5 6-6.5 6z"]),search:m([{circle:[10.5,10.5,6]},"M15 15l5 5"]),jar:m(["M8 4.5h8v3H8z","M7 7.5h10l1 3v8a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-8z","M9 14h6"]),box:m(["M3.5 8l8.5-4 8.5 4v9l-8.5 4-8.5-4z","M3.5 8l8.5 4 8.5-4","M12 12v9"]),house:m(["M4 11l8-6.5 8 6.5","M6.5 9.5V19h11V9.5","M10.5 19v-4.5h3V19"]),pencil:m(["M15.5 4.5l4 4L9 19H5v-4z","M13.5 6.5l4 4"]),swap:m(["M5 9h12l-3-3","M19 15H7l3 3"]),minus:m(["M6 12h12"]),plus:m(["M6 12h12","M12 6v12"]),grip:m([{circle:[9,7,1.2],fill:!0},{circle:[15,7,1.2],fill:!0},{circle:[9,12,1.2],fill:!0},{circle:[15,12,1.2],fill:!0},{circle:[9,17,1.2],fill:!0},{circle:[15,17,1.2],fill:!0}]),menu:m(["M5 8h14","M5 12h14","M5 16h14"])};function E(t){return e("span",{className:"lock-tag",attrs:{"aria-hidden":"true"}},[i.lock("icon tiny"),ee(t)])}function f(t,r,a){let o=j(r)||!a.onOpen;return e("button",{className:`${a.className}${o?" is-locked":""}`,attrs:{type:"button","aria-label":o?`${a.label} (\uC900\uBE44 \uC911)`:a.label},on:{click:()=>o?t.notifyLocked(r):a.onOpen?.()}},[...a.children,o?E(r):null])}function A(t,r,a,o=""){return e("div",{className:`locked-block ${o}`.trim(),attrs:{role:"button",tabindex:"0","aria-label":"\uC900\uBE44 \uC911\uC778 \uAE30\uB2A5 \u2014 \uB204\uB974\uBA74 \uC5F4\uB9AC\uB294 \uB2E8\uACC4\uB97C \uC54C\uB824 \uB4DC\uB824\uC694"},on:{click:()=>t.notifyLocked(r),keydown:n=>{let l=n.key;(l==="Enter"||l===" ")&&(n.preventDefault(),t.notifyLocked(r))}}},[...a,e("span",{className:"locked-veil"},[E(r),e("span",{text:"\uC900\uBE44 \uC911"})])])}var Le=[{label:"\uD648",icon:i.home,routes:["home","settings","backup","diagnostics"]},{label:"\uC791\uC5C5",icon:i.hammer,routes:["work","facilities"]},{label:"\uD0D0\uC0AC",icon:i.compass,routes:[],feature:"explore"},{label:"\uC8FC\uBBFC",icon:i.residents,routes:[],feature:"residents"},{label:"\uCD08\uB300",icon:i.ticket,routes:[],feature:"invite"}];function le(t,r){return e("nav",{className:"tabbar",attrs:{"aria-label":"\uACF5\uBC29 \uBA54\uB274"}},Le.map(a=>{let o=a.feature?j(a.feature):!1,n=a.routes.includes(t.route);return e("button",{className:`tab${n?" current":""}${o?" is-locked":""}`,attrs:{type:"button","aria-current":n?"page":void 0,"aria-label":o?`${a.label} (\uC900\uBE44 \uC911)`:a.label},on:{click:()=>{o&&a.feature?r.notifyLocked(a.feature):a.routes[0]&&r.navigate(a.routes[0])}}},[e("span",{className:"tab-icon"},[a.icon("icon tab-glyph"),o&&a.feature?E(a.feature):null]),e("span",{className:"tab-label",text:a.label})])}))}function ce(t,r){let a=t.world?.state==="ready"?t.world.value:null;if(!a)return null;let o=a.state.wallet.gold.toLocaleString("ko-KR");return e("div",{className:"resources"},[e("span",{className:"counter gold",attrs:{"aria-label":`\uACE8\uB4DC ${o}`}},[e("span",{className:"coin",attrs:{"aria-hidden":"true"}}),e("span",{className:"counter-value",text:o})]),f(r,"tickets",{className:"counter ticket",label:"\uCD08\uB300\uAD8C",children:[e("span",{className:"ticket-mark"},[i.ticket("icon")]),e("span",{className:"counter-value",text:"\u2013"})]}),t.route==="settings"?null:e("button",{className:"icon-button gear",attrs:{type:"button","aria-label":"\uC124\uC815"},on:{click:()=>r.navigate("settings")}},[i.gear()])])}function de(t,r,a){if(a.kind==="home")return e("header",{className:"top top-home"},[e("div",{className:"top-row"},[e("h1",{className:"sign sign-home",text:"\uC232\uACB0 \uACF5\uBC29",attrs:{id:"fw-screen-title"}}),ce(t,r)]),e("div",{className:"top-row second"},[f(r,"weather",{className:"chip-button weather",label:"\uD604\uC2E4 \uB0A0\uC528",children:[i.weather(),e("span",{text:"\uB0A0\uC528"})]}),f(r,"mail",{className:"icon-button mail",label:"\uC6B0\uD3B8\uD568",children:[i.mail()]})])]);let o=a.back;return e("header",{className:`top top-sub${a.resources?" with-resources":""}`},[e("div",{className:"top-row"},[o?e("button",{className:"back-button",attrs:{type:"button","aria-label":`${o.label}(\uC73C)\uB85C \uB3CC\uC544\uAC00\uAE30`},on:{click:()=>r.navigate(o.route)}},[i.back()]):e("span",{className:"back-spacer",attrs:{"aria-hidden":"true"}}),e("h1",{className:"sign",text:a.title,attrs:{id:"fw-screen-title"}}),a.resources?ce(t,r):null])])}function Re(t,r){return t.notice?e("div",{className:`notice ${t.notice.kind}`,attrs:{role:t.notice.kind==="error"?"alert":"status"}},[e("p",{text:t.notice.text}),e("button",{className:"notice-close",text:"\uB2EB\uAE30",attrs:{type:"button","aria-label":"\uC54C\uB9BC \uB2EB\uAE30"},on:{click:()=>r.dismissNotice()}})]):null}function v(t,r,a){return e("div",{className:`shell backdrop-${a.backdrop}${a.nav?" has-nav":""}`},[e("div",{className:"scroll"},[e("div",{className:"column"},[de(t,r,a.top),a.hero??null,e("main",{className:"page",attrs:{"aria-labelledby":"fw-screen-title"}},a.body)])]),Re(t,r),a.nav?le(t,r):null,a.sheet??null])}function b(t,r,a={}){return e("section",{className:`card ${a.className??""}`.trim(),attrs:a.id?{"aria-labelledby":a.id}:{}},[t?e("h2",{className:"section-title",text:t,attrs:a.id?{id:a.id}:{}}):null,...r])}var W="/forest-workshop/p0",Te={pass:"\uD1B5\uACFC",fail:"\uC2E4\uD328",unavailable:"\uC0AC\uC6A9 \uBD88\uAC00"};function c(t,r={},a=[]){let o=document.createElement(t);r.className&&(o.className=r.className),r.text!==void 0&&(o.textContent=r.text);for(let[n,l]of Object.entries(r.attrs??{}))o.setAttribute(n,l);for(let n of a)n&&o.append(n);return o}var O=class{constructor(){w(this,"node",c("div",{className:"diagnostics"}));w(this,"started",!1);w(this,"status",{state:"loading"});w(this,"probe",null);w(this,"image",{state:"loading"});w(this,"uploading",!1);w(this,"uploadError",null);w(this,"pendingUpload",null)}start(){this.started||(this.started=!0,this.render(),this.loadStatus(),this.loadImage())}async loadStatus(){this.status={state:"loading"},this.render();try{this.status={state:"ready",value:await y().get(`${W}/status`)}}catch(r){this.status={state:"error",message:k(r,"\uD328\uD0A4\uC9C0 \uC0C1\uD0DC\uB97C \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.")}}this.render()}async loadImage(){this.image={state:"loading"},this.render();try{let r=await y().get(`${W}/image`);this.image={state:"ready",value:r.current}}catch(r){this.image={state:"error",message:k(r,"\uC800\uC7A5\uB41C \uADF8\uB9BC\uC744 \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.")}}this.render()}async runProbe(){if(this.probe?.state!=="loading"){this.probe={state:"loading"},this.render();try{let r=await y().post(`${W}/probe`);this.probe={state:"ready",value:r.checks}}catch(r){this.probe={state:"error",message:k(r,"\uC5F0\uACB0 \uC810\uAC80\uC744 \uC2E4\uD589\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.")}}this.render()}}async upload(r){if(this.uploading)return;let a=this.pendingUpload?.file===r?this.pendingUpload:{file:r,key:$()};this.pendingUpload=a,this.uploading=!0,this.uploadError=null,this.render();try{let o=new FormData;o.append("uploadKey",a.key),o.append("file",r,r.name);let n=await y().upload(`${W}/image`,o);this.image={state:"ready",value:n.image},this.pendingUpload=null}catch(o){this.uploadError=k(o,"\uADF8\uB9BC\uC744 \uC62C\uB9AC\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4. \uAE30\uC874 \uADF8\uB9BC\uC740 \uADF8\uB300\uB85C\uC785\uB2C8\uB2E4.")}finally{this.uploading=!1,this.render()}}render(){this.node.replaceChildren(c("p",{className:"muted",text:"\uC5D4\uC9C4 \uC5F0\uACB0\uACFC \uC8FC\uBBFC \uADF8\uB9BC \uC800\uC7A5 \uACBD\uB85C\uB97C \uD655\uC778\uD569\uB2C8\uB2E4. \uACB0\uACFC\uB294 \uC138\uACC4\uC5D0 \uC601\uD5A5\uC744 \uC8FC\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4."}),this.renderStatus(),this.renderProbe(),this.renderImage())}retryButton(r,a){let o=c("button",{className:"button secondary",text:r,attrs:{type:"button"}});return o.addEventListener("click",a),o}renderStatus(){let r=c("section",{className:"card",attrs:{"aria-labelledby":"fw-status"}},[c("h2",{text:"\uC5D4\uC9C4 \uC5F0\uACB0",attrs:{id:"fw-status"}})]);if(this.status.state==="loading")r.append(c("p",{className:"muted",text:"\uBD88\uB7EC\uC624\uB294 \uC911\u2026",attrs:{role:"status"}}));else if(this.status.state==="error")r.append(c("p",{className:"error",text:this.status.message,attrs:{role:"alert"}}),this.retryButton("\uB2E4\uC2DC \uC2DC\uB3C4",()=>{this.loadStatus()}));else{let{value:a}=this.status;r.append(c("p",{className:"muted",text:`\uD328\uD0A4\uC9C0 ${a.version} \xB7 \uB2E8\uACC4 ${a.stage}`}),c("ul",{className:"list"},a.host.map(o=>c("li",{className:"row"},[c("span",{className:"name",text:o.name}),c("span",{className:`badge ${o.available?"pass":o.required?"fail":"unavailable"}`,text:o.available?"\uC788\uC74C":o.required?"\uC5C6\uC74C (\uD544\uC218)":"\uC5C6\uC74C"})]))))}return r}renderProbe(){let r=c("button",{className:"button",text:this.probe?.state==="loading"?"\uC810\uAC80 \uC911\u2026":"\uC5F0\uACB0 \uC810\uAC80 \uC2E4\uD589",attrs:{type:"button"}});r.disabled=this.probe?.state==="loading",r.addEventListener("click",()=>{this.runProbe()});let a=c("section",{className:"card",attrs:{"aria-labelledby":"fw-probe"}},[c("h2",{text:"\uC800\uC7A5\xB7\uC790\uB8CC\xB7\uBAA8\uB378 \uC810\uAC80",attrs:{id:"fw-probe"}}),c("p",{className:"muted",text:"\uC784\uC2DC \uBB38\uC11C\uB97C \uC4F0\uACE0 \uC9C0\uC6C1\uB2C8\uB2E4. \uCE90\uB9AD\uD130\xB7\uD398\uB974\uC18C\uB098 \uC6D0\uBCF8\uC740 \uC77D\uAE30\uB9CC \uD558\uBA70, \uBAA8\uB378 \uC0DD\uC131 \uC694\uCCAD\uC740 \uBCF4\uB0B4\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4."}),r]);return!this.probe||this.probe.state==="loading"?a:this.probe.state==="error"?(a.append(c("p",{className:"error",text:this.probe.message,attrs:{role:"alert"}})),a):(a.append(c("ul",{className:"list",attrs:{"aria-live":"polite"}},this.probe.value.map(o=>c("li",{className:"row stacked"},[c("div",{className:"row-head"},[c("span",{className:"name",text:o.label}),c("span",{className:`badge ${o.status}`,text:Te[o.status]})]),c("span",{className:"detail",text:o.detail})])))),a)}renderImage(){let r=c("input",{className:"file",attrs:{type:"file",accept:"image/png,image/webp",id:"fw-file"}});r.disabled=this.uploading,r.addEventListener("change",()=>{let o=r.files?.[0];o&&this.upload(o)});let a=c("section",{className:"card",attrs:{"aria-labelledby":"fw-image"}},[c("h2",{text:"\uC8FC\uBBFC \uADF8\uB9BC \uC800\uC7A5 \uC810\uAC80",attrs:{id:"fw-image"}}),c("p",{className:"muted",text:"PNG \uB610\uB294 \uC815\uC801 WebP(\uCD5C\uB300 20MiB, 4096\xD74096)\uB97C \uACE0\uB974\uBA74 \uD22C\uBA85\uB3C4\uB97C \uC720\uC9C0\uD55C WebP \uD488\uC9C895\uB85C \uBC14\uAFD4 \uC804\uC5ED \uAC24\uB7EC\uB9AC\uC5D0 \uC800\uC7A5\uD569\uB2C8\uB2E4. PNG \uC6D0\uBCF8\uC740 \uBCF4\uAD00\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4."}),c("label",{className:"field-label",text:"\uADF8\uB9BC \uD30C\uC77C \uACE0\uB974\uAE30",attrs:{for:"fw-file"}}),r]);if(this.uploading&&a.append(c("p",{className:"muted",text:"\uBCC0\uD658\uD558\uACE0 \uC800\uC7A5\uD558\uB294 \uC911\u2026",attrs:{role:"status"}})),this.uploadError){a.append(c("p",{className:"error",text:this.uploadError,attrs:{role:"alert"}}));let o=this.pendingUpload;o&&!this.uploading&&a.append(this.retryButton("\uAC19\uC740 \uD30C\uC77C\uB85C \uB2E4\uC2DC \uC2DC\uB3C4",()=>{this.upload(o.file)}))}if(this.image.state==="loading")a.append(c("p",{className:"muted",text:"\uBD88\uB7EC\uC624\uB294 \uC911\u2026",attrs:{role:"status"}}));else if(this.image.state==="error")a.append(c("p",{className:"error",text:this.image.message,attrs:{role:"alert"}}),this.retryButton("\uB2E4\uC2DC \uBD88\uB7EC\uC624\uAE30",()=>{this.loadImage()}));else if(!this.image.value)a.append(c("p",{className:"empty",text:"\uC544\uC9C1 \uC800\uC7A5\uB41C \uADF8\uB9BC\uC774 \uC5C6\uC2B5\uB2C8\uB2E4."}));else{let o=this.image.value,n=c("img",{className:"preview",attrs:{src:`${o.url}${o.url.includes("?")?"&":"?"}v=${o.imageVersion}`,alt:"\uC800\uC7A5\uB41C \uC8FC\uBBFC \uADF8\uB9BC \uBBF8\uB9AC\uBCF4\uAE30",width:String(o.width),height:String(o.height)}});a.append(c("div",{className:"stage"},[n]),c("dl",{className:"facts"},[c("dt",{text:"\uCC38\uC870"}),c("dd",{text:o.reference}),c("dt",{text:"\uD06C\uAE30"}),c("dd",{text:`${o.width}\xD7${o.height}`}),c("dt",{text:"\uC6A9\uB7C9"}),c("dd",{text:`\uC785\uB825 ${q(o.inputBytes)} \u2192 WebP ${q(o.outputBytes)}`}),c("dt",{text:"\uD22C\uBA85\uB3C4"}),c("dd",{text:o.hasTransparency?"\uD22C\uBA85 \uC601\uC5ED \uC788\uC74C (\uC720\uC9C0\uB428)":"\uBD88\uD22C\uBA85 \uADF8\uB9BC"}),c("dt",{text:"\uBC84\uC804"}),c("dd",{text:String(o.imageVersion)})]))}return a}};var Fe="http://www.w3.org/2000/svg";function Be(){let t=document.createElementNS(Fe,"svg");return t.setAttribute("viewBox","0 0 390 300"),t.setAttribute("preserveAspectRatio","xMidYMax slice"),t.setAttribute("aria-hidden","true"),t.setAttribute("class","scene-art"),t.innerHTML=`
    <defs>
      <linearGradient id="fw-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe3c2"/><stop offset="1" stop-color="#eef0d2"/></linearGradient>
      <linearGradient id="fw-roof" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3f8a86"/><stop offset="1" stop-color="#2c6b68"/></linearGradient>
    </defs>
    <rect width="390" height="300" fill="url(#fw-sky)"/>
    <circle cx="40" cy="40" r="70" fill="#7ea866" opacity=".55"/><circle cx="360" cy="30" r="80" fill="#d9a05a" opacity=".5"/>
    <circle cx="330" cy="70" r="55" fill="#8bb26d" opacity=".55"/><circle cx="80" cy="95" r="45" fill="#9cbf78" opacity=".6"/>
    <path d="M0 215 Q100 190 200 205 T390 200 V300 H0z" fill="#9bbd7a"/>
    <g transform="translate(150 70)">
      <rect x="0" y="62" width="170" height="108" rx="6" fill="#a87a4e"/>
      <rect x="10" y="74" width="150" height="96" fill="#c99a69"/>
      <path d="M-22 70 L85 8 L192 70 Z" fill="url(#fw-roof)"/>
      <rect x="66" y="104" width="38" height="66" rx="4" fill="#6e4628"/>
      <rect x="20" y="96" width="34" height="30" rx="3" fill="#f6dc94"/><rect x="116" y="96" width="34" height="30" rx="3" fill="#f6dc94"/>
      <rect x="58" y="80" width="54" height="16" rx="3" fill="#f3e6c6"/>
      <circle cx="148" cy="84" r="7" fill="#f5c45c"/>
    </g>
    <path d="M150 300 Q190 240 235 240 Q280 240 300 300z" fill="#dccaa0"/>
    <g fill="#5d8f47"><circle cx="40" cy="230" r="26"/><circle cx="75" cy="245" r="20"/><circle cx="350" cy="232" r="24"/><circle cx="320" cy="250" r="18"/></g>
    <g fill="#fff6e4"><circle cx="30" cy="222" r="3"/><circle cx="52" cy="238" r="3"/><circle cx="345" cy="226" r="3"/><circle cx="327" cy="244" r="3"/></g>
    <g fill="#c9a0d8"><circle cx="70" cy="232" r="3"/><circle cx="360" cy="244" r="3"/></g>`,t}function me(t){return e("section",{className:"scene",attrs:{"aria-label":"\uACF5\uBC29 \uC7A5\uBA74"}},[Be(),e("div",{className:"scene-stage"},[f(t,"residents",{className:"resident-spot left",label:"\uC8FC\uBBFC \uC790\uB9AC",children:[e("span",{className:"spot-shadow"}),e("span",{className:"spot-text",text:"\uC8FC\uBBFC"})]}),f(t,"residents",{className:"resident-spot right",label:"\uC8FC\uBBFC \uC790\uB9AC",children:[e("span",{className:"spot-shadow"}),e("span",{className:"spot-text",text:"\uC8FC\uBBFC"})]})]),e("p",{className:"scene-caption"},[i.leaf("icon tiny"),"\uC8FC\uBBFC\uC744 \uCD08\uB300\uD558\uBA74 \uC774\uACF3\uC5D0 \uBAA8\uC5EC\uC694"])])}function $e(t,r){return t.items.find(a=>a.id===r)?.name??r}function pe(t,r){let a=t.world?.state==="ready"?t.world.value:null,o=t.content;if(!a||!o||a.state.progress.starterKitClaimed||t.starterSheetHidden)return null;let n=!!t.busy["claim-starter-kit"],l=o.starterKit;return e("div",{className:"sheet-backdrop"},[e("section",{className:"sheet card",attrs:{role:"dialog","aria-modal":"true","aria-labelledby":"fw-starter"}},[e("h2",{className:"section-title",text:"\uACF5\uBC29 \uC2DC\uC791 \uAFB8\uB7EC\uBBF8",attrs:{id:"fw-starter"}}),e("p",{className:"muted",text:"\uCCAB \uCC44\uC9D1\uACFC \uAC00\uACF5\uC744 \uC2DC\uC791\uD560 \uC7AC\uB8CC\uC608\uC694. \uD55C \uBC88\uB9CC \uBC1B\uC744 \uC218 \uC788\uC5B4\uC694."}),e("ul",{className:"kit"},[e("li",{className:"kit-item"},[e("span",{className:"coin"}),e("span",{text:"\uACE8\uB4DC"}),e("strong",{text:l.gold.toLocaleString("ko-KR")})]),...Object.entries(l.items).map(([u,h])=>e("li",{className:"kit-item"},[i.leaf("icon"),e("span",{text:$e(o,u)}),e("strong",{text:h.toLocaleString("ko-KR")})]))]),z(n?"\uBC1B\uB294 \uC911\u2026":"\uBC1B\uAE30",()=>{r.runCommand("claim-starter-kit","onboarding.claimStarterKit")},{disabled:n,attrs:{"data-wide":""}}),z("\uB098\uC911\uC5D0",()=>r.hideStarterSheet(),{variant:"secondary",attrs:{"data-wide":""}})])])}function je(t){return b(null,[A(t,"work-report",[e("h2",{className:"report-title",text:"\uACF5\uBC29 \uC18C\uC2DD"}),e("div",{className:"report-body"},[e("div",{className:"report-items"},[e("div",{className:"report-slot"},[e("span",{className:"slot-art"}),e("span",{className:"slot-name",text:"\uC785\uACE0"}),e("strong",{text:"\u2013"})]),e("div",{className:"report-slot"},[e("span",{className:"slot-art"}),e("span",{className:"slot-name",text:"\uC785\uACE0"}),e("strong",{text:"\u2013"})])]),e("div",{className:"report-actions"},[e("span",{className:"button report-button",attrs:{"aria-hidden":"true"}},["\uC791\uC5C5 \uBCF4\uACE0",i.chevron("icon")]),e("span",{className:"report-caption"},[i.leaf("icon tiny"),"\uC790\uB3D9 \uC785\uACE0"])])])])],{className:"report-card"})}function Pe(t){return f(t,"offline-cap",{className:"strip offline",label:"\uBBF8\uC811\uC18D \uB204\uC801 \uC9C4\uD589",children:[i.clock(),e("span",{text:"\uBBF8\uC811\uC18D \uB204\uC801 \u2013\uC2DC\uAC04 / \uCD5C\uB300 72\uC2DC\uAC04"}),i.info("icon muted-icon")]})}function Ee(t){return f(t,"stories",{className:"strip story",label:"\uC8FC\uBBFC \uC774\uC57C\uAE30",children:[e("span",{className:"story-art",attrs:{"aria-hidden":"true"}},[i.book("icon")]),e("span",{className:"story-text"},[e("strong",{text:"\uC8FC\uBBFC \uC774\uC57C\uAE30"}),e("span",{text:"\uB3C4\uCC29\uD55C \uC774\uC57C\uAE30\uAC00 \uC5EC\uAE30\uC5D0 \uBCF4\uC5EC\uC694"})]),e("span",{className:"round-arrow"},[i.chevron()])]})}function ue(t,r){let a=t.world;return!a||a.state!=="ready"?v(t,r,{top:{kind:"home"},backdrop:"forest",nav:!1,body:[a?.state==="error"?b(null,[L(a.message),z("\uC138\uACC4 \uBAA9\uB85D\uC73C\uB85C",()=>r.navigate("worlds"),{variant:"secondary"})]):S("\uC138\uACC4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026")]}):v(t,r,{top:{kind:"home"},backdrop:"forest",hero:me(r),body:[je(r),Pe(r),Ee(r)],nav:!0,sheet:pe(t,r)})}function J(t,r,a){return e("div",{className:"preview-row"},[t("icon"),e("span",{text:r}),e("strong",{text:a})])}function H(t,r,a){let o=!!t.busy.restore,n=e("input",{className:"visually-hidden",attrs:{type:"file",accept:"application/json,.json",id:a},disabled:o,on:{change:()=>{let h=n.files?.[0];h&&r.selectRestoreFile(h),n.value=""}}}),l=t.restore,u=l?.summary;return e("div",{className:"restore"},[n,e("label",{className:"menu-row",attrs:{for:a}},[e("span",{className:"menu-icon"},[i.download()]),e("span",{className:"menu-text"},[e("span",{className:"menu-title",text:"\uBC31\uC5C5 \uBD88\uB7EC\uC624\uAE30"}),e("span",{className:"menu-detail",text:l?l.fileName:"\uC0C8 \uC138\uACC4\uB85C \uBCF5\uC6D0"})]),e("span",{className:"menu-chevron"},[i.chevron()])]),e("div",{className:"preview-box",attrs:{"aria-live":"polite"}},[e("p",{className:"preview-head"},[i.eye("icon"),e("strong",{text:"\uBCF5\uC6D0 \uBBF8\uB9AC\uBCF4\uAE30"})]),u?e("div",{className:"preview-rows"},[J(i.residents,"\uC8FC\uBBFC",`${u.residents}\uBA85`),J(i.pair,"\uD398\uC5B4",`${u.pairs}\uAC1C`),J(i.image,"\uADF8\uB9BC",`${u.pictures}\uAC1C`)]):e("p",{className:"muted",text:"\uBC31\uC5C5 \uD30C\uC77C\uC744 \uACE0\uB974\uBA74 \uB2F4\uAE34 \uB0B4\uC6A9\uC744 \uBA3C\uC800 \uBCF4\uC5EC \uB4DC\uB824\uC694."})]),e("button",{className:"button big-action",attrs:{type:"button","data-wide":""},disabled:!u||o,on:{click:()=>{r.confirmRestore()}}},[i.restore("icon"),e("span",{text:o?"\uBCF5\uC6D0\uD558\uB294 \uC911\u2026":"\uC0C8 \uC138\uACC4\uB85C \uBCF5\uC6D0"})]),e("p",{className:"hint center"},[i.info("icon"),"\uD604\uC7AC \uC138\uACC4\uB294 \uB36E\uC5B4\uC4F0\uC9C0 \uC54A\uC544\uC694."])])}function We(t){let r=new Date(t);if(Number.isNaN(r.getTime()))return"\uC54C \uC218 \uC5C6\uC74C";let a=new Intl.DateTimeFormat("ko-KR",{hour:"2-digit",minute:"2-digit",hour12:!1}).format(r);return r.toDateString()===new Date().toDateString()?`\uC624\uB298 ${a}`:`${new Intl.DateTimeFormat("ko-KR",{month:"long",day:"numeric"}).format(r)} ${a}`}function Oe(t){return t>=1024*1024?`${(t/(1024*1024)).toFixed(1)} MB`:t>=1024?`${(t/1024).toFixed(1)} KB`:`${t} B`}function He(t){let r=t.storage,a;if(!r||r.state==="loading")a=S("\uD655\uC778\uD558\uB294 \uC911\u2026");else if(r.state==="error")a=L(r.message);else{let o=[[i.image,"\uC8FC\uBBFC \uADF8\uB9BC","residentImagesBytes"],[i.landscape,"\uBC30\uACBD","backgroundsBytes"],[i.document,"\uAE30\uB85D","recordsBytes"]],n=Math.max(1,...o.map(([,,l])=>r.value[l]));a=e("div",{className:"usage-rows"},o.map(([l,u,h])=>{let R=r.value[h],T=e("span",{className:"usage-fill"});return T.style.width=R>0?`max(0.9em, ${Math.round(R/n*100)}%)`:"0",e("div",{className:"usage-row"},[l("icon"),e("span",{className:"usage-label",text:u}),e("span",{className:"usage-bar",attrs:{role:"presentation"}},[T]),e("span",{className:"usage-size",text:Oe(R)})])}))}return b("\uC800\uC7A5 \uACF5\uAC04 \uC0AC\uC6A9\uB7C9",[a,e("p",{className:"hint center"},[i.info("icon"),"\uADF8\uB9BC\uC740 WebP\uB85C \uBCF4\uAD00\uD574\uC694."])],{id:"fw-usage"})}function Ve(t,r){let a=!!t.busy.backup;return e("button",{className:"menu-row",attrs:{type:"button"},disabled:a,on:{click:()=>{r.downloadBackup()}}},[e("span",{className:"menu-icon"},[i.upload()]),e("span",{className:"menu-text"},[e("span",{className:"menu-title",text:a?"\uBC31\uC5C5 \uB9CC\uB4DC\uB294 \uC911\u2026":"\uBC31\uC5C5 \uB0B4\uBCF4\uB0B4\uAE30"}),e("span",{className:"menu-detail",text:"\uC138\uACC4 \xB7 \uC7AC\uD654 \xB7 \uCC3D\uACE0 \uD3EC\uD568 \xB7 \uBE44\uBC00\uD0A4 \uC81C\uC678"})]),e("span",{className:"menu-chevron"},[i.chevron()])])}function fe(t,r,a,o,n){return e("button",{className:"menu-row quiet",attrs:{type:"button"},on:{click:()=>t.navigate(r)}},[e("span",{className:"menu-icon quiet"},[a()]),e("span",{className:"menu-text"},[e("span",{className:"menu-title",text:o}),e("span",{className:"menu-detail",text:n})]),e("span",{className:"menu-chevron"},[i.chevron()])])}function ge(t,r){let a=t.world?.state==="ready"?t.world.value:null,o=a?[e("section",{className:"card saved",attrs:{"aria-label":"\uC800\uC7A5 \uC0C1\uD0DC"}},[e("p",{className:"saved-title"},[e("span",{className:"check"},[i.check()]),"\uC800\uC7A5 \uC644\uB8CC"]),e("p",{className:"saved-time",text:`\uB9C8\uC9C0\uB9C9 \uC800\uC7A5 ${We(a.updatedAt)}`})]),He(t),b(null,[Ve(t,r),H(t,r,"fw-backup-restore")],{className:"menu"}),b(null,[f(r,"image-history",{className:"menu-row",label:"\uADF8\uB9BC \uC774\uB825 \uC815\uB9AC",children:[e("span",{className:"menu-icon light"},[i.image()]),e("span",{className:"menu-text"},[e("span",{className:"menu-title",text:"\uADF8\uB9BC \uC774\uB825 \uC815\uB9AC"}),e("span",{className:"menu-detail",text:"\uB2E4\uB978 \uACF3\uC5D0\uC11C \uC4F0\uB294 \uADF8\uB9BC\uC740 \uC720\uC9C0"})]),e("span",{className:"menu-chevron"},[i.chevron()])]}),fe(r,"worlds",i.house,"\uB2E4\uB978 \uC138\uACC4","\uC138\uACC4 \uACE0\uB974\uAE30 \xB7 \uC0C8\uB85C \uB9CC\uB4E4\uAE30"),fe(r,"diagnostics",i.info,"\uC5F0\uACB0 \uC810\uAC80","\uC5D4\uC9C4 \uC5F0\uACB0\uACFC \uADF8\uB9BC \uC800\uC7A5 \uACBD\uB85C \uD655\uC778")],{className:"menu"})]:[S("\uC138\uACC4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026")];return v(t,r,{top:{kind:"sub",title:"\uC800\uC7A5\xB7\uBC31\uC5C5",back:{route:"settings",label:"\uC124\uC815"},resources:!1},backdrop:"wood",body:o,nav:!0})}function De(t,r,a){let o=!!r.busy["rename-nickname"],n=t.state.settings.playerNickname,l=e("input",{className:"input",attrs:{id:"fw-set-nick",maxlength:"24",autocomplete:"off",value:n}});return e("form",{className:"setting-row",on:{submit:u=>{u.preventDefault();let h=l.value.trim();h&&h!==n&&a.runCommand("rename-nickname","settings.update",{playerNickname:l.value})}}},[i.leaf("icon row-leaf"),e("label",{className:"setting-label",text:"\uB2C9\uB124\uC784",attrs:{for:"fw-set-nick"}}),e("span",{className:"setting-field"},[l,e("button",{className:"button small",text:o?"\uC800\uC7A5 \uC911\u2026":"\uC218\uC815",attrs:{type:"submit"},disabled:o})])])}function Ue(t){return e("div",{className:"setting-row"},[i.leaf("icon row-leaf"),e("span",{className:"setting-label",text:"\uD604\uC2E4 \uB0A0\uC528"}),e("span",{className:"setting-field"},[e("span",{className:"input readonly"},[i.weather("icon"),e("span",{text:"\uB3C4\uC2DC \uBBF8\uC124\uC815"})]),f(t,"weather",{className:"button small",label:"\uD604\uC2E4 \uB0A0\uC528 \uBCC0\uACBD",children:[e("span",{text:"\uBCC0\uACBD"})]})])])}function Ge(t,r){let a=e("input",{className:"slider",attrs:{id:"fw-font-size",type:"range",min:String(N.min),max:String(N.max),step:String(N.step),value:String(t.fontSize),"aria-valuetext":`${t.fontSize}px`},on:{change:()=>r.setFontSize(Number(a.value))}});return e("div",{className:"setting-block"},[e("div",{className:"setting-row slider-row"},[i.leaf("icon row-leaf"),e("label",{className:"setting-label",text:"\uAE00\uC790 \uD06C\uAE30",attrs:{for:"fw-font-size"}}),a,e("span",{className:"slider-value",text:`${t.fontSize}px`})]),e("p",{className:"font-preview",text:"\uC774\uB807\uAC8C \uD45C\uC2DC\uB3FC\uC694."})])}function be(t,r,a,o,n){return f(t,r,{className:"toggle-row",label:o,children:[e("span",{className:"toggle-icon"},[a("icon")]),e("span",{className:"toggle-text"},[e("strong",{text:o}),e("span",{text:n})]),e("span",{className:"switch off"},[e("span",{className:"knob"})])]})}function V(t,r,a,o){let n=[e("span",{className:"manage-icon"},[r("icon")]),e("span",{className:"manage-title",text:a}),e("span",{className:"menu-chevron"},[i.chevron()])];return"route"in o?e("button",{className:"manage-row",attrs:{type:"button"},on:{click:()=>t.navigate(o.route)}},n):f(t,o.feature,{className:"manage-row",label:a,children:n})}function we(t,r){let a=t.world?.state==="ready"?t.world.value:null,o=a?[b("\uB0B4 \uACF5\uBC29",[De(a,t,r),Ue(r)],{id:"fw-mine"}),b("\uD45C\uC2DC",[Ge(t,r),be(r,"weather-effects",i.leaf,"\uB0A0\uC528 \uD6A8\uACFC","\uACF5\uBC29 \uBC30\uACBD\uC5D0 \uD604\uC7AC \uB0A0\uC528\uB97C \uBC18\uC601\uD574\uC694."),be(r,"auto-read",i.book,"\uC790\uB3D9 \uC77D\uAE30","\uC774\uC57C\uAE30\uB97C \uC790\uB3D9\uC73C\uB85C \uB118\uACA8\uC694.")],{id:"fw-display"}),b("\uAD00\uB9AC",[V(r,i.image,"\uC8FC\uBBFC \uADF8\uB9BC \uAD00\uB9AC",{feature:"resident-images"}),V(r,i.flower,"AI \uC9C0\uCE68 \uAD00\uB9AC",{feature:"ai-guidelines"}),V(r,i.people,"\uAE30\uC5B5 \uAD00\uB9AC",{feature:"memory"}),V(r,i.folder,"\uC800\uC7A5 \xB7 \uBC31\uC5C5",{route:"backup"}),e("div",{className:"note-box"},[i.clock("icon"),e("span",{},[e("strong",{text:"\uBBF8\uC811\uC18D \uB204\uC801 \uC0C1\uD55C 72\uC2DC\uAC04"}),e("span",{text:"72\uC2DC\uAC04\uC774 \uC9C0\uB098\uBA74 \uC77C\uBD80 \uC790\uB3D9 \uC9C4\uD589\uC774 \uBA48\uCDB0\uC694."})])])],{id:"fw-manage"}),e("p",{className:"footnote",text:"\uC790\uB3D9\uD654 \uADDC\uCE59\uC740 \uC791\uC5C5 \uD654\uBA74\uC5D0\uC11C \uBC14\uAFC0 \uC218 \uC788\uC5B4\uC694."})]:[S("\uC138\uACC4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026")];return v(t,r,{top:{kind:"sub",title:"\uC124\uC815",back:{route:"home",label:"\uD648"},resources:!1},backdrop:"wood",body:o,nav:!0})}function he(t,r){let a=new Map(r?.items.map((o,n)=>[o.id,n]));return Object.entries(t.state.inventory).filter(([,o])=>o>0).sort(([o],[n])=>(a.get(o)??999)-(a.get(n)??999)).map(([o,n])=>({itemId:o,amount:n,name:r?.items.find(l=>l.id===o)?.name??o}))}function Ke(t,r){let a=(o,n,l)=>e("button",{className:`big-tab${t.facilitiesTab===o?" current":""}`,attrs:{type:"button",role:"tab","aria-selected":t.facilitiesTab===o?"true":"false"},on:{click:()=>r.setFacilitiesTab(o)}},[l,e("span",{text:n})]);return e("div",{className:"big-tabs",attrs:{role:"tablist","aria-label":"\uC2DC\uC124\uACFC \uCC3D\uACE0"}},[a("facilities","\uC2DC\uC124",i.house("icon big")),a("storage","\uCC3D\uACE0",i.box("icon big"))])}function qe(t){return A(t,"facility-upgrade",[e("div",{className:"facility"},[e("span",{className:"facility-picture"},[i.house("icon huge")]),e("div",{className:"facility-info"},[e("strong",{className:"facility-name",text:"\uC2DC\uC124"}),e("span",{className:"facility-level"},["Lv. \u2013",e("span",{className:"level-next",text:" \u2192 Lv. \u2013"})]),e("div",{className:"effect-row"},[e("span",{text:"\uD6A8\uACFC"}),e("span",{text:"\u2013"})]),e("div",{className:"effect-row"},[e("span",{text:"\uB300\uAE30\uC5F4"}),e("span",{text:"\u2013"})]),e("p",{className:"muted",text:"\uBD84\uC57C\uBCC4 \uC2DC\uC124\uC744 \uAC15\uD654\uD558\uBA74 \uD6A8\uACFC\uAC00 \uC62C\uB77C\uAC00\uC694."}),e("span",{className:"gold-button"},[e("span",{className:"coin"}),"\u2013 G \xB7 \uAC15\uD654"])])])])}function _e(t,r){let a=he(t,r);return a.length===0?e("p",{className:"empty",text:"\uCC3D\uACE0\uAC00 \uBE44\uC5B4 \uC788\uC5B4\uC694."}):e("table",{className:"stock"},[e("thead",{},[e("tr",{},["\uC544\uC774\uD15C","\uBCF4\uC720 \uC218\uB7C9","\uBCF4\uD638 \uC7AC\uACE0","\uC608\uC57D \uC7AC\uACE0","\uC0AC\uC6A9 \uAC00\uB2A5"].map(o=>e("th",{text:o,attrs:{scope:"col"}})))]),e("tbody",{},a.map(o=>e("tr",{},[e("th",{attrs:{scope:"row"}},[e("span",{className:"item-dot"}),o.name]),e("td",{className:"num",text:o.amount.toLocaleString("ko-KR")}),e("td",{className:"num",text:"\u2013"}),e("td",{className:"num",text:"\u2013"}),e("td",{className:"num available",text:o.amount.toLocaleString("ko-KR")})])))])}function Je(t,r,a){return b(null,[e("div",{className:"card-head"},[e("div",{},[e("h2",{className:"section-title",text:"\uC7AC\uACE0 \uBCF4\uD638",attrs:{id:"fw-protect"}}),e("p",{className:"muted",text:"\uC9C0\uC815\uD55C \uC218\uB7C9\uC740 \uC81C\uC791\uC5D0 \uC0AC\uC6A9\uD558\uC9C0 \uC54A\uC544\uC694."})]),f(a,"stock-protection",{className:"outline-button",label:"\uD3B8\uC9D1\uD558\uAE30",children:[i.pencil("icon"),e("span",{text:"\uD3B8\uC9D1\uD558\uAE30"})]})]),_e(t,r),f(a,"auto-sell",{className:"toggle-row",label:"\uC790\uB3D9 \uD310\uB9E4",children:[e("span",{className:"toggle-icon"},[i.gear("icon")]),e("span",{className:"toggle-text"},[e("strong",{text:"\uC790\uB3D9 \uD310\uB9E4"}),e("span",{text:"\uBCF4\uD638 \xB7 \uC608\uC57D \uC7AC\uACE0\uB294 \uC0AC\uC6A9\uD558\uC9C0 \uC54A\uC544\uC694."})]),e("span",{className:"switch off"},[e("span",{className:"knob"}),e("span",{className:"switch-label",text:"\uAEBC\uC9D0"})])]})],{id:"fw-protect"})}function Ye(t,r){let a=he(t,r);return b("\uCC3D\uACE0",[a.length===0?e("p",{className:"empty",text:"\uCC3D\uACE0\uAC00 \uBE44\uC5B4 \uC788\uC5B4\uC694."}):e("ul",{className:"storage-grid"},a.map(o=>e("li",{className:"storage-item"},[e("span",{className:"item-dot big"}),e("span",{className:"storage-name",text:o.name}),e("strong",{text:o.amount.toLocaleString("ko-KR")})])))],{id:"fw-storage"})}function ve(t,r){let a=t.world?.state==="ready"?t.world.value:null,o=a?[Ke(t,r),...t.facilitiesTab==="facilities"?[b(null,[qe(r)],{className:"facility-card"}),Je(a,t.content,r)]:[Ye(a,t.content)]]:[];return v(t,r,{top:{kind:"sub",title:"\uC2DC\uC124\uACFC \uCC3D\uACE0",back:{route:"work",label:"\uACF5\uBC29 \uC791\uC5C5"},resources:!0},backdrop:"forest",body:o,nav:!0})}var Ze=[{label:"\uCC44\uC9D1",icon:i.leaf},{label:"\uC7AC\uBC30",icon:i.sprout},{label:"\uC870\uC0AC",icon:i.search},{label:"\uAC00\uACF5",icon:i.jar},{label:"\uC81C\uC791",icon:i.hammer}];function Qe(t){return e("div",{className:"field-tabs",attrs:{role:"group","aria-label":"\uC791\uC5C5 \uBD84\uC57C"}},Ze.map(r=>f(t,"work-fields",{className:"field-tab",label:r.label,children:[r.icon("icon field-glyph"),e("span",{text:r.label})]})))}function Xe(t){return A(t,"work-mode",[e("div",{className:"segmented",attrs:{"aria-hidden":"true"}},[e("span",{className:"segment selected",text:"\uC790\uB3D9 \uC6B4\uC601"}),e("span",{className:"segment",text:"\uC9C0\uC815 \uD69F\uC218"})])],"slim")}function et(t){return e("div",{className:"facility-entry"},[e("button",{className:"facility-open",attrs:{type:"button","aria-label":"\uC2DC\uC124\uACFC \uCC3D\uACE0 \uC5F4\uAE30"},on:{click:()=>t.navigate("facilities")}},[e("span",{className:"facility-art"},[i.box("icon big")]),e("span",{className:"facility-text"},[e("strong",{text:"\uC2DC\uC124\uACFC \uCC3D\uACE0"}),e("span",{text:"\uCC3D\uACE0\uC758 \uC7AC\uB8CC\uC640 \uC7AC\uACE0 \uBCF4\uD638\uB97C \uD655\uC778\uD574\uC694."})])]),f(t,"work-fields",{className:"outline-button",label:"\uBC30\uCE58 \uBCC0\uACBD",children:[i.swap("icon"),e("span",{text:"\uBC30\uCE58 \uBCC0\uACBD"})]})])}function tt(t){return A(t,"work-rules",[e("div",{className:"recipe"},[e("span",{className:"recipe-art"},[i.jar("icon big")]),e("span",{className:"recipe-text"},[e("strong",{text:"\uC81C\uC791\uBC95"}),e("span",{text:"\uBD84\uC57C\uB97C \uACE0\uB974\uBA74 \uB9CC\uB4E4 \uC544\uC774\uD15C\uC774 \uC5EC\uAE30\uC5D0 \uBCF4\uC5EC\uC694."})])]),e("div",{className:"plan-row"},[e("span",{className:"plan-label",text:"\uBAA9\uD45C \uC7AC\uACE0"}),e("span",{className:"stepper"},[e("span",{className:"step"},[i.minus("icon")]),e("span",{className:"step-value",text:"\u2013"}),e("span",{className:"step plus"},[i.plus("icon")])]),e("span",{className:"plan-progress"},[e("span",{className:"muted",text:"\uD604\uC7AC \u2013 / \uBAA9\uD45C \u2013"}),e("span",{className:"bar"})])]),e("div",{className:"plan-block"},[e("span",{className:"plan-label",text:"\uC7AC\uB8CC \uC0AC\uC6A9 \uC124\uC815"}),e("div",{className:"usage"},[e("span",{className:"usage-item",text:"\uC7AC\uB8CC"}),...["\uBCF4\uC720","\uBCF4\uD638","\uC0AC\uC6A9 \uAC00\uB2A5"].map(r=>e("span",{className:"usage-cell"},[e("small",{text:r}),e("strong",{text:"\u2013"})]))])]),e("div",{className:"plan-block"},[e("span",{className:"plan-label"},["\uC81C\uC791 \uC6B0\uC120\uC21C\uC704 ",e("small",{text:"(\uC704\uC758 \uC544\uC774\uD15C\uBD80\uD130 \uC21C\uC11C\uB300\uB85C \uC81C\uC791\uD574\uC694)"})]),...[1,2].map(r=>e("div",{className:"priority-row"},[i.grip("icon muted-icon"),e("span",{className:"rank",text:String(r)}),e("span",{className:"priority-name",text:"\u2013"}),i.menu("icon muted-icon")]))]),e("div",{className:"plan-row"},[e("span",{className:"plan-label",text:"\uD604\uC7AC \uC791\uC5C5"}),e("span",{className:"plan-progress wide"},[e("span",{className:"muted",text:"\uC9C4\uD589 \uC911\uC778 \uC791\uC5C5 \uC5C6\uC74C"}),e("span",{className:"bar teal"})])]),e("p",{className:"hint"},[i.info("icon"),"\uC7AC\uB8CC\uAC00 \uBD80\uC871\uD558\uBA74 \uAE30\uB2E4\uB838\uB2E4 \uB2E4\uC2DC \uC2DC\uC791\uD574\uC694."])])}function rt(t){return e("div",{className:"rule-actions"},[f(t,"work-rules",{className:"button wide-main",label:"\uC6B4\uC601 \uADDC\uCE59 \uC801\uC6A9",children:[e("span",{text:"\uC6B4\uC601 \uADDC\uCE59 \uC801\uC6A9"})]}),f(t,"work-rules",{className:"button secondary",label:"\uCD94\uCC9C \uC124\uC815",children:[i.gear("icon"),e("span",{text:"\uCD94\uCC9C \uC124\uC815"})]})])}function xe(t,r){return v(t,r,{top:{kind:"sub",title:"\uACF5\uBC29 \uC791\uC5C5",back:{route:"home",label:"\uD648"},resources:!0},backdrop:"forest",body:[Qe(r),b(null,[Xe(r),et(r),tt(r)],{className:"work-card"}),rt(r)],nav:!0})}var ye={world:40,nickname:24};function at(t){let r=new Date(t);return Number.isNaN(r.getTime())?t:new Intl.DateTimeFormat("ko-KR",{dateStyle:"medium",timeStyle:"short"}).format(r)}function ot(t,r){let a=b("\uB0B4 \uC138\uACC4",[],{id:"fw-worlds"}),{worlds:o}=t;return o.state==="loading"?a.append(S("\uBD88\uB7EC\uC624\uB294 \uC911\u2026")):o.state==="error"?a.append(L(o.message),z("\uB2E4\uC2DC \uC2DC\uB3C4",()=>{r.loadWorlds()},{variant:"secondary"})):o.value.length===0?a.append(e("p",{className:"empty",text:"\uC544\uC9C1 \uC138\uACC4\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4. \uC544\uB798\uC5D0\uC11C \uC0C8\uB85C \uB9CC\uB4E4\uC5B4 \uC8FC\uC138\uC694."})):a.append(e("ul",{className:"menu-list"},o.value.map(n=>e("li",{},[e("button",{className:"menu-row",attrs:{type:"button"},disabled:!n.readable,on:{click:()=>{r.openWorld(n.worldId)}}},[e("span",{className:"menu-icon"},[i.house()]),e("span",{className:"menu-text"},[e("span",{className:"menu-title",text:n.worldName}),e("span",{className:"menu-detail",text:n.readable?`\uB9C8\uC9C0\uB9C9 \uC800\uC7A5 ${at(n.updatedAt)}`:"\uC774 \uBC84\uC804\uC5D0\uC11C \uC77D\uC744 \uC218 \uC5C6\uB294 \uC138\uACC4"})]),e("span",{className:"menu-chevron"},[i.chevron()])])])))),a}function nt(t,r){let a=!!t.busy["create-world"],o=e("input",{className:"input",attrs:{id:"fw-world-name",name:"worldName",maxlength:String(ye.world),autocomplete:"off",required:""}}),n=e("input",{className:"input",attrs:{id:"fw-nickname",name:"playerNickname",maxlength:String(ye.nickname),autocomplete:"off",required:""}});return e("form",{className:"card form",attrs:{"aria-labelledby":"fw-create"},on:{submit:u=>{u.preventDefault(),!(!o.value.trim()||!n.value.trim())&&r.createWorld(o.value,n.value)}}},[e("h2",{className:"section-title",text:"\uC0C8 \uC138\uACC4 \uB9CC\uB4E4\uAE30",attrs:{id:"fw-create"}}),e("p",{className:"muted",text:"\uD50C\uB808\uC774\uC5B4\uB294 \uC678\uD615 \uC5C6\uC774 \uB2C9\uB124\uC784\uC73C\uB85C\uB9CC \uB4F1\uC7A5\uD569\uB2C8\uB2E4. \uB458 \uB2E4 \uB098\uC911\uC5D0 \uC124\uC815\uC5D0\uC11C \uBC14\uAFC0 \uC218 \uC788\uC2B5\uB2C8\uB2E4."}),e("label",{className:"field-label",text:"\uC138\uACC4 \uC774\uB984",attrs:{for:"fw-world-name"}}),o,e("label",{className:"field-label",text:"\uB0B4 \uB2C9\uB124\uC784",attrs:{for:"fw-nickname"}}),n,e("button",{className:"button",text:a?"\uB9CC\uB4DC\uB294 \uC911\u2026":"\uB9CC\uB4E4\uAE30",attrs:{type:"submit"},disabled:a})])}function ke(t,r){let a=t.world?.state==="ready";return v(t,r,{top:a?{kind:"sub",title:"\uC138\uACC4 \uACE0\uB974\uAE30",back:{route:"backup",label:"\uC800\uC7A5\xB7\uBC31\uC5C5"},resources:!1}:{kind:"sub",title:"\uC232\uACB0 \uACF5\uBC29",resources:!1},backdrop:"wood",body:[ot(t,r),nt(t,r),b("\uBC31\uC5C5\uC5D0\uC11C \uBCF5\uC6D0",[H(t,r,"fw-worlds-restore")],{id:"fw-worlds-restore-title",className:"menu"})],nav:!1})}var Ne=`
:host {
  --fs: var(--fw-font-size, 16px);
  --fw-page: #efe2c2;
  --fw-surface: #fbf4e2;
  --fw-surface-2: #f3e7c9;
  --fw-surface-3: #fffaf0;
  --fw-border: #dcc69a;
  --fw-border-strong: #c2a473;
  --fw-dash: #d8bf8e;
  --fw-text: #46301f;
  --fw-muted: #765d44;
  --fw-accent: #2c7469;
  --fw-accent-strong: #1f564e;
  --fw-on-accent: #fffaf0;
  --fw-wood: #a5703f;
  --fw-wood-light: #c99a63;
  --fw-wood-dark: #6b4426;
  --fw-on-wood: #3d2614;
  --fw-leaf: #5c9447;
  --fw-leaf-soft: #e3edd0;
  --fw-gold: #e9b93f;
  --fw-gold-dark: #b98420;
  --fw-pass: #3b7d3a;
  --fw-fail: #b0372b;
  --fw-blue: #2f63b5;
  --fw-unavailable: #7f6418;
  --fw-track: #d9d2c2;
  display: block;
  height: 100%;
  overflow: hidden;
  color: var(--fw-text);
  color-scheme: light;
  font: 400 var(--fs)/1.5 system-ui, -apple-system, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif;
  -webkit-text-size-adjust: 100%;
  word-break: keep-all;
  overflow-wrap: anywhere;
}
* { box-sizing: border-box; }
p { margin: 0; }
.icon { width: 1.35em; height: 1.35em; flex: none; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.icon .fill { fill: currentColor; stroke: none; }
.icon.tiny { width: 0.95em; height: 0.95em; }
.icon.big { width: 2.2em; height: 2.2em; }
.icon.huge { width: 4.5em; height: 4.5em; stroke-width: 1.4; }
.muted-icon { color: var(--fw-muted); }
.visually-hidden { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }

/* \u2500\u2500 Frame \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.shell { position: relative; height: 100%; display: flex; flex-direction: column; overflow: hidden; }
.scroll { flex: 1 1 auto; min-height: 0; overflow-y: auto; overflow-x: hidden; overscroll-behavior: contain; }
.column { width: 100%; max-width: 520px; margin: 0 auto; min-height: 100%; display: flex; flex-direction: column; }
.backdrop-forest { background: #e9dcb9; }
.backdrop-forest .scroll {
  background:
    radial-gradient(120% 18em at 20% -4em, #8db86e 0, rgba(141, 184, 110, 0) 70%),
    radial-gradient(90% 16em at 95% -3em, #d8a35a 0, rgba(216, 163, 90, 0) 70%),
    linear-gradient(180deg, #b9d39c 0, #dfe6c2 9em, var(--fw-page) 16em);
}
.backdrop-wood { background: var(--fw-wood-dark); }
.backdrop-wood .scroll {
  background:
    linear-gradient(180deg, rgba(141, 184, 110, 0.75) 0, rgba(141, 184, 110, 0) 7em),
    repeating-linear-gradient(90deg, #8a5a32 0 0.35em, #9a6a3e 0.35em 1.1em, #7d5130 1.1em 1.3em, #a5703f 1.3em 2.4em);
}
.backdrop-wood .page { padding-left: 0.75em; padding-right: 0.75em; }
.page {
  flex: 1 0 auto;
  display: grid;
  gap: 0.75em;
  align-content: start;
  padding: 0.5em 0.9em 1.25em;
}
.page > * { min-width: 0; }
.muted { color: var(--fw-muted); font-size: calc(var(--fs) * 0.875); }
.empty { color: var(--fw-muted); }
.error { color: var(--fw-fail); font-weight: 700; overflow-wrap: anywhere; }
.hint { display: flex; align-items: center; gap: 0.4em; color: var(--fw-muted); font-size: calc(var(--fs) * 0.85); }
.hint.center { justify-content: center; text-align: center; }

/* Toast: the answer to a tap (locked feature, saved, errors), just above the bottom bar. */
.notice {
  position: absolute;
  z-index: 5;
  left: 50%;
  bottom: calc(1em + env(safe-area-inset-bottom, 0px));
  transform: translateX(-50%);
  width: min(calc(100% - 1.5em), 480px);
  display: flex;
  align-items: center;
  gap: 0.75em;
  padding: 0.6em 0.6em 0.6em 1em;
  border-radius: 0.9em;
  border: 2px solid var(--fw-leaf);
  background: var(--fw-surface-3);
  box-shadow: 0 0.4em 1.2em rgba(60, 35, 15, 0.28);
}
.has-nav .notice { bottom: calc(5.6em + env(safe-area-inset-bottom, 0px)); }
.notice p { flex: 1; min-width: 0; overflow-wrap: anywhere; font-weight: 600; }
.notice.error { border-color: var(--fw-fail); color: var(--fw-fail); background: #fbe9e4; }
.notice-close { flex: none; min-height: 2.75em; padding: 0 0.6em; border: 0; background: none; color: inherit; font: inherit; font-weight: 700; text-decoration: underline; cursor: pointer; }

/* \u2500\u2500 Top bar \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.top { display: grid; gap: 0.45em; padding: 0.75em 0.75em 0.4em; }
.top-row { display: flex; align-items: center; gap: 0.45em; min-width: 0; }
.top-row.second { justify-content: space-between; }
.sign {
  position: relative;
  margin: 0;
  min-width: 0;
  padding: 0.3em 0.9em;
  border-radius: 0.55em;
  border: 2px solid var(--fw-wood-dark);
  background: linear-gradient(180deg, #e6bf86, var(--fw-wood-light) 55%, #b9844f);
  color: var(--fw-on-wood);
  font-size: calc(var(--fs) * 1.35);
  font-weight: 900;
  line-height: 1.2;
  letter-spacing: 0.02em;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  box-shadow: 0 0.2em 0 var(--fw-wood-dark), inset 0 0 0 2px rgba(255, 240, 210, 0.35);
}
.sign::before, .sign::after {
  content: "";
  position: absolute;
  top: 50%;
  width: 0.35em;
  height: 0.35em;
  margin-top: -0.175em;
  border-radius: 50%;
  background: var(--fw-wood-dark);
  opacity: 0.55;
}
.sign::before { left: 0.35em; }
.sign::after { right: 0.35em; }
.sign-home { flex: 0 1 auto; font-size: calc(var(--fs) * 1.6); padding: 0.25em 0.7em; }
.top-sub .sign { flex: 1 1 auto; }
.top-sub.with-resources .sign { flex: 0 1 auto; font-size: calc(var(--fs) * 1.15); padding: 0.3em 0.6em; }
.top-sub:not(.with-resources) .sign { margin-right: 3.2em; }
.back-button, .back-spacer { flex: none; width: 2.75em; height: 2.75em; }
.back-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.7em;
  border: 2px solid var(--fw-wood-dark);
  background: var(--fw-surface);
  color: var(--fw-wood-dark);
  box-shadow: 0 0.15em 0 var(--fw-wood-dark);
  cursor: pointer;
}
.resources { display: flex; align-items: center; gap: 0.3em; margin-left: auto; min-width: 0; }
.counter {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.3em;
  min-width: 0;
  min-height: 2.2em;
  padding: 0 0.6em 0 0.2em;
  border-radius: 999px;
  border: 1.5px solid var(--fw-border-strong);
  background: var(--fw-surface);
  color: var(--fw-text);
  font: inherit;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
}
.counter-value { font-size: calc(var(--fs) * 0.9); white-space: nowrap; }
button.counter { cursor: pointer; }
.coin {
  flex: none;
  display: inline-block;
  width: 1.6em;
  height: 1.6em;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #fde9a6, var(--fw-gold) 58%, var(--fw-gold-dark));
  border: 1.5px solid #9c6c17;
}
.ticket-mark { display: inline-flex; color: var(--fw-leaf); padding-left: 0.2em; }
.icon-button {
  position: relative;
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.6em;
  height: 2.6em;
  border-radius: 0.7em;
  border: 2px solid var(--fw-border-strong);
  background: var(--fw-surface);
  color: var(--fw-wood-dark);
  cursor: pointer;
}
.icon-button.gear { border: 0; background: none; }
.icon-button.gear .icon { width: 1.8em; height: 1.8em; }
.chip-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.4em;
  min-height: 2.4em;
  padding: 0.2em 0.9em;
  border-radius: 0.7em;
  border: 1.5px solid var(--fw-border-strong);
  background: var(--fw-surface);
  color: var(--fw-text);
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

/* \u2500\u2500 Cards \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.card {
  position: relative;
  display: grid;
  gap: 0.7em;
  align-content: start;
  padding: 1em;
  border-radius: 1em;
  border: 2px solid var(--fw-border);
  background: var(--fw-surface);
  box-shadow: 0 0.2em 0 rgba(107, 68, 38, 0.18);
  outline: 1.5px dashed var(--fw-dash);
  outline-offset: -0.45em;
}
.card > * { min-width: 0; }
.section-title {
  display: flex;
  align-items: center;
  gap: 0.5em;
  margin: 0;
  font-size: calc(var(--fs) * 1.25);
  font-weight: 900;
}
.section-title::before {
  content: "";
  flex: none;
  width: 0.85em;
  height: 0.85em;
  border-radius: 0 70% 0 70%;
  background: var(--fw-leaf);
  box-shadow: 0.3em 0.25em 0 -0.12em #7fb35f;
}
.section-title::after { content: ""; flex: 1; border-top: 1.5px dashed var(--fw-dash); margin-left: 0.25em; }
.card-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 0.75em; }
.card-head > div { display: grid; gap: 0.2em; min-width: 0; }

/* \u2500\u2500 Buttons \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.button {
  position: relative;
  justify-self: start;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45em;
  min-height: 2.75em;
  padding: 0.45em 1.2em;
  border-radius: 0.8em;
  border: 2px solid var(--fw-accent-strong);
  background: linear-gradient(180deg, #3a8a7e, var(--fw-accent));
  color: var(--fw-on-accent);
  font: inherit;
  font-weight: 800;
  box-shadow: 0 0.2em 0 var(--fw-accent-strong);
  cursor: pointer;
}
.button[data-wide] { justify-self: stretch; width: 100%; font-size: calc(var(--fs) * 1.1); }
.button.small { min-height: 2.5em; padding: 0.3em 0.9em; font-size: calc(var(--fs) * 0.95); }
.button.secondary { background: var(--fw-surface); color: var(--fw-wood-dark); border-color: var(--fw-border-strong); box-shadow: 0 0.15em 0 var(--fw-border-strong); }
.button.big-action { min-height: 3.2em; border-radius: 1em; font-size: calc(var(--fs) * 1.2); }
.button:disabled { opacity: 0.55; cursor: not-allowed; }
.outline-button {
  position: relative;
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: 0.35em;
  min-height: 2.75em;
  padding: 0.3em 0.9em;
  border-radius: 0.8em;
  border: 2px solid var(--fw-border-strong);
  background: var(--fw-surface-3);
  color: var(--fw-text);
  font: inherit;
  font-weight: 800;
  cursor: pointer;
}

/* \u2500\u2500 Locked (\uC900\uBE44 \uC911) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.lock-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.15em;
  padding: 0.05em 0.4em;
  border-radius: 999px;
  background: rgba(70, 48, 31, 0.86);
  color: #fff4dc;
  font-size: calc(var(--fs) * 0.68);
  font-weight: 800;
  line-height: 1.5;
  white-space: nowrap;
}
.is-locked { position: relative; cursor: pointer; }
.is-locked > .lock-tag { position: absolute; top: -0.45em; right: -0.25em; z-index: 1; }
.is-locked > :not(.lock-tag) { opacity: 0.72; }
.is-locked.button, .is-locked.outline-button, .is-locked.chip-button { filter: saturate(0.55); }
.locked-block { position: relative; display: grid; gap: 0.7em; border-radius: 0.8em; cursor: pointer; }
/* A block that opens its card puts the tag on the card's top edge, clear of the block's title. */
.card > .locked-block:first-child > .locked-veil { top: -1.75em; }
.locked-block > :not(.locked-veil) { opacity: 0.58; filter: saturate(0.6); }
/* Sits on the block's top edge so it never covers the block's own title. */
.locked-veil {
  position: absolute;
  top: -0.75em;
  right: 0.3em;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: 0.35em;
  padding: 0.15em 0.6em 0.15em 0.2em;
  border-radius: 999px;
  background: var(--fw-surface-3);
  border: 1.5px solid var(--fw-border-strong);
  color: var(--fw-text);
  font-size: calc(var(--fs) * 0.8);
  font-weight: 800;
}

/* \u2500\u2500 Bottom bar \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.tabbar {
  position: relative;
  z-index: 3;
  flex: none;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  width: 100%;
  max-width: 520px;
  margin: 0 auto;
  padding: 0.35em 0.4em calc(0.35em + env(safe-area-inset-bottom, 0px));
  border-radius: 1.2em 1.2em 0 0;
  border: 2px solid var(--fw-border-strong);
  border-bottom: 0;
  background: var(--fw-surface);
  box-shadow: 0 -0.2em 0.6em rgba(60, 35, 15, 0.15);
}
.tab {
  position: relative;
  display: grid;
  justify-items: center;
  gap: 0.1em;
  min-width: 0;
  min-height: 3.6em;
  padding: 0.25em 0.1em;
  border: 0;
  border-radius: 0.8em;
  background: none;
  color: var(--fw-text);
  font: inherit;
  cursor: pointer;
}
.tab + .tab::before { content: ""; position: absolute; left: 0; top: 20%; bottom: 20%; border-left: 1.5px dashed var(--fw-dash); }
.tab-icon { position: relative; display: inline-flex; color: var(--fw-wood-dark); }
.tab-glyph { width: 1.9em; height: 1.9em; }
.tab-icon .lock-tag { position: absolute; top: -0.3em; right: -1.2em; }
.tab-label { font-size: calc(var(--fs) * 0.85); font-weight: 800; }
.tab.current .tab-label { padding: 0 0.9em; border-radius: 0.5em; background: #5f9a4a; color: #fff; }
.tab.current .tab-icon { color: var(--fw-accent); }
.tab.is-locked .tab-glyph { opacity: 0.6; }

/* \u2500\u2500 \uD648 (01-1) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.top-home { padding-bottom: 0; }
.chip-button.weather { color: var(--fw-text); }
.scene { position: relative; margin: 0 0 -1.6em; min-height: 17em; aspect-ratio: 390 / 300; }
.scene-art { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
.scene-stage { position: absolute; left: 0; right: 0; bottom: 2.6em; display: flex; justify-content: space-around; padding: 0 1em; }
.resident-spot {
  position: relative;
  display: grid;
  justify-items: center;
  align-content: end;
  width: 6.5em;
  height: 8.5em;
  border: 2px dashed rgba(107, 68, 38, 0.45);
  border-radius: 3em 3em 1em 1em;
  background: rgba(255, 250, 240, 0.35);
  color: var(--fw-wood-dark);
  font: inherit;
  cursor: pointer;
}
.spot-shadow { width: 4.5em; height: 0.8em; margin-bottom: 0.35em; border-radius: 50%; background: rgba(70, 48, 31, 0.22); }
.spot-text { margin-bottom: 0.5em; font-weight: 800; font-size: calc(var(--fs) * 0.85); }
.scene-caption {
  position: absolute;
  left: 50%;
  bottom: 2em;
  transform: translateX(-50%);
  display: inline-flex;
  align-items: center;
  gap: 0.3em;
  padding: 0.1em 0.75em;
  border-radius: 999px;
  background: rgba(255, 250, 240, 0.88);
  color: var(--fw-muted);
  font-size: calc(var(--fs) * 0.78);
  white-space: nowrap;
}
.report-card { z-index: 1; }
.report-title { margin: 0; text-align: center; font-size: calc(var(--fs) * 1.4); font-weight: 900; }
.report-body { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 0.6em; align-items: center; }
.report-items { display: grid; grid-template-columns: 1fr 1fr; gap: 0.4em; padding-right: 0.6em; border-right: 1.5px solid var(--fw-border); }
.report-slot { display: grid; justify-items: center; gap: 0.1em; padding: 0.5em 0.2em; border-radius: 0.7em; background: var(--fw-surface-2); }
.slot-art { width: 2.6em; height: 2.6em; border-radius: 0.6em; background: var(--fw-border); }
.slot-name { font-size: calc(var(--fs) * 0.85); font-weight: 700; }
.report-slot strong { font-size: calc(var(--fs) * 1.2); }
.report-actions { display: grid; justify-items: center; gap: 0.4em; }
.report-button { justify-self: stretch; white-space: nowrap; padding-left: 0.6em; padding-right: 0.6em; font-size: calc(var(--fs) * 1.15); }
.report-caption { display: inline-flex; align-items: center; gap: 0.25em; color: var(--fw-muted); font-size: calc(var(--fs) * 0.85); }
.strip {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5em;
  width: 100%;
  min-height: 2.9em;
  padding: 0.5em 1em;
  border-radius: 0.9em;
  border: 2px solid var(--fw-border);
  background: var(--fw-surface);
  color: var(--fw-text);
  font: inherit;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
  outline: 1.5px dashed var(--fw-dash);
  outline-offset: -0.4em;
}
.strip.story { justify-content: flex-start; gap: 0.8em; padding: 0.6em; min-height: 5em; }
.story-art { flex: none; display: inline-flex; align-items: center; justify-content: center; width: 6em; height: 3.8em; border-radius: 0.7em; background: linear-gradient(135deg, #e7d2a6, #c99a63); color: var(--fw-wood-dark); }
.story-text { flex: 1; display: grid; min-width: 0; }
.story-text strong { font-size: calc(var(--fs) * 1.1); font-weight: 900; }
.story-text span { color: var(--fw-muted); font-size: calc(var(--fs) * 0.85); }
.round-arrow { flex: none; display: inline-flex; align-items: center; justify-content: center; width: 2.6em; height: 2.6em; border-radius: 50%; background: var(--fw-wood-dark); color: #fff4dc; }

/* \u2500\u2500 \uACF5\uBC29 \uC791\uC5C5 (01-2) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.field-tabs { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 0.3em; margin-bottom: -0.85em; padding: 0 0.15em; }
.field-tab {
  display: grid;
  justify-items: center;
  gap: 0.1em;
  min-width: 0;
  min-height: 4.4em;
  padding: 0.45em 0.1em 0.9em;
  border-radius: 0.8em 0.8em 0 0;
  border: 2px solid var(--fw-border-strong);
  border-bottom: 0;
  background: var(--fw-surface);
  color: var(--fw-text);
  font: inherit;
  font-weight: 800;
  cursor: pointer;
}
.field-glyph { width: 1.8em; height: 1.8em; color: var(--fw-leaf); }
.work-card { gap: 0.8em; }
.segmented { display: grid; grid-template-columns: 1fr 1fr; padding: 0.2em; border-radius: 999px; border: 2px solid var(--fw-border-strong); background: var(--fw-surface-3); }
.segment { display: flex; align-items: center; justify-content: center; min-height: 2.6em; border-radius: 999px; font-size: calc(var(--fs) * 1.1); font-weight: 900; }
.segment.selected { background: var(--fw-accent); color: var(--fw-on-accent); }
.facility-entry { display: flex; align-items: center; gap: 0.5em; padding: 0.5em; border-radius: 0.9em; border: 1.5px solid var(--fw-border); background: var(--fw-surface-3); }
.facility-entry .outline-button { padding: 0.3em 0.6em; }
.facility-open { flex: 1; min-width: 0; display: flex; align-items: center; gap: 0.7em; padding: 0.2em; border: 0; border-radius: 0.7em; background: none; color: inherit; font: inherit; text-align: left; cursor: pointer; }
.facility-art, .recipe-art { flex: none; display: inline-flex; align-items: center; justify-content: center; width: 3.4em; height: 3.6em; border-radius: 0.6em; background: var(--fw-surface-2); color: var(--fw-wood-dark); }
.facility-text, .recipe-text { display: grid; min-width: 0; }
.facility-text strong, .recipe-text strong { font-size: calc(var(--fs) * 1.15); font-weight: 900; }
.facility-text span, .recipe-text span { color: var(--fw-muted); font-size: calc(var(--fs) * 0.85); }
.recipe { display: flex; align-items: center; gap: 0.8em; padding: 0.6em; border-radius: 0.9em; background: var(--fw-surface-3); }
.recipe-art { width: 5.5em; height: 5em; }
.plan-row, .plan-block { display: grid; gap: 0.5em; padding: 0.6em 0.75em; border-radius: 0.8em; background: var(--fw-surface-2); }
.plan-row { grid-template-columns: auto auto minmax(0, 1fr); align-items: center; }
.plan-label { font-weight: 900; }
.plan-label small { color: var(--fw-muted); font-weight: 500; font-size: calc(var(--fs) * 0.75); }
.stepper { display: inline-flex; align-items: center; border-radius: 0.6em; border: 1.5px solid var(--fw-border-strong); background: var(--fw-surface-3); }
.step { display: inline-flex; align-items: center; justify-content: center; width: 2.2em; height: 2.2em; border-radius: 0.5em; }
.step.plus { background: var(--fw-accent); color: var(--fw-on-accent); }
.step-value { min-width: 2.2em; text-align: center; font-weight: 800; }
.plan-progress { display: grid; gap: 0.25em; min-width: 0; font-size: calc(var(--fs) * 0.85); }
.plan-progress.wide { grid-column: 2 / -1; }
.bar { display: block; height: 0.7em; border-radius: 999px; background: var(--fw-track); }
.usage { display: grid; grid-template-columns: minmax(0, 1.3fr) repeat(3, minmax(0, 1fr)); align-items: center; padding: 0.4em; border-radius: 0.6em; background: var(--fw-surface-3); }
.usage-item { font-weight: 800; padding-left: 0.4em; }
.usage-cell { display: grid; justify-items: center; border-left: 1.5px solid var(--fw-border); }
.usage-cell small { color: var(--fw-muted); font-size: calc(var(--fs) * 0.75); }
.priority-row { display: flex; align-items: center; gap: 0.6em; padding: 0.45em 0.6em; border-radius: 0.6em; background: var(--fw-surface-3); }
.rank { display: inline-flex; align-items: center; justify-content: center; width: 1.8em; height: 1.8em; border-radius: 0.4em; background: var(--fw-surface-2); font-weight: 900; }
.priority-name { flex: 1; font-weight: 800; }
.rule-actions { display: grid; grid-template-columns: minmax(0, 1.8fr) minmax(0, 1fr); gap: 0.6em; }
.rule-actions .button { justify-self: stretch; min-height: 3.1em; }
.button.wide-main { font-size: calc(var(--fs) * 1.15); }

/* \u2500\u2500 \uC2DC\uC124\uACFC \uCC3D\uACE0 (01-3) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.big-tabs { display: grid; grid-template-columns: 1fr 1fr; gap: 0.3em; margin-bottom: -0.85em; }
.big-tab {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5em;
  min-height: 3.6em;
  padding-bottom: 0.6em;
  border-radius: 1em 1em 0 0;
  border: 2px solid var(--fw-border-strong);
  border-bottom: 0;
  background: var(--fw-surface);
  color: var(--fw-text);
  font: inherit;
  font-size: calc(var(--fs) * 1.25);
  font-weight: 900;
  cursor: pointer;
}
.big-tab.current { background: var(--fw-accent); border-color: var(--fw-accent-strong); color: var(--fw-on-accent); }
.facility { display: grid; grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr); gap: 0.8em; align-items: start; }
.facility-picture { display: flex; align-items: center; justify-content: center; aspect-ratio: 1; border-radius: 0.9em; background: var(--fw-surface-2); color: var(--fw-wood-dark); }
.facility-info { display: grid; gap: 0.45em; min-width: 0; }
.facility-name { font-size: calc(var(--fs) * 1.3); font-weight: 900; }
.facility-level { font-size: calc(var(--fs) * 1.3); font-weight: 900; }
.level-next { color: var(--fw-accent); }
.effect-row { display: grid; grid-template-columns: 1fr 1fr; padding: 0.35em 0.6em; border-radius: 0.5em; background: var(--fw-surface-2); font-weight: 700; }
.gold-button { display: flex; align-items: center; justify-content: center; gap: 0.4em; min-height: 3em; border-radius: 0.9em; border: 2px solid var(--fw-gold-dark); background: linear-gradient(180deg, #f8d671, var(--fw-gold)); font-size: calc(var(--fs) * 1.1); font-weight: 900; }
.stock { width: 100%; border-collapse: separate; border-spacing: 0 0.3em; table-layout: fixed; }
.stock th, .stock td { padding: 0.5em 0.25em; text-align: center; overflow-wrap: anywhere; }
.stock thead th { padding: 0.4em 0.2em; background: var(--fw-surface-2); color: var(--fw-muted); font-size: calc(var(--fs) * 0.78); font-weight: 700; }
.stock thead th:first-child { border-radius: 0.5em 0 0 0.5em; width: 28%; }
.stock thead th:last-child { border-radius: 0 0.5em 0.5em 0; }
.stock tbody th, .stock tbody td { background: var(--fw-surface-3); border-top: 1px solid var(--fw-border); border-bottom: 1px solid var(--fw-border); }
.stock tbody th { display: table-cell; text-align: left; font-weight: 800; border-left: 1px solid var(--fw-border); border-radius: 0.6em 0 0 0.6em; }
.stock tbody td:last-child { border-right: 1px solid var(--fw-border); border-radius: 0 0.6em 0.6em 0; }
.num { font-variant-numeric: tabular-nums; font-weight: 900; font-size: calc(var(--fs) * 1.05); }
.num.protected { color: var(--fw-fail); }
.num.reserved { color: var(--fw-blue); }
.num.available { color: var(--fw-pass); }
.item-dot { display: inline-block; width: 1.1em; height: 1.1em; margin-right: 0.35em; vertical-align: -0.15em; border-radius: 50%; background: radial-gradient(circle at 35% 35%, #f2c48d, var(--fw-wood)); }
.item-dot.big { width: 2.2em; height: 2.2em; margin: 0; }
.storage-grid { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(6.5em, 1fr)); gap: 0.5em; }
.storage-item { display: grid; justify-items: center; gap: 0.2em; padding: 0.7em 0.3em; border-radius: 0.8em; border: 1.5px solid var(--fw-border); background: var(--fw-surface-3); text-align: center; }
.storage-name { font-weight: 700; overflow-wrap: anywhere; }
.storage-item strong { font-size: calc(var(--fs) * 1.2); font-variant-numeric: tabular-nums; }
.toggle-row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.7em;
  width: 100%;
  min-height: 3.6em;
  padding: 0.55em 0.75em;
  border-radius: 0.8em;
  border: 1.5px solid var(--fw-border);
  background: var(--fw-surface-3);
  color: var(--fw-text);
  font: inherit;
  text-align: left;
  cursor: pointer;
}
.toggle-icon { flex: none; display: inline-flex; color: var(--fw-leaf); }
.toggle-text { flex: 1; display: grid; min-width: 0; }
.toggle-text strong { font-size: calc(var(--fs) * 1.05); font-weight: 900; }
.toggle-text span { color: var(--fw-muted); font-size: calc(var(--fs) * 0.82); }
.switch { flex: none; position: relative; display: inline-flex; align-items: center; justify-content: flex-end; width: 3.4em; height: 1.9em; padding: 0 0.5em; border-radius: 999px; background: #8a8378; }
.switch.on { background: var(--fw-leaf); justify-content: flex-start; }
.switch .knob { position: absolute; top: 0.2em; left: 0.2em; width: 1.5em; height: 1.5em; border-radius: 50%; background: #fff; box-shadow: 0 0.1em 0.2em rgba(0, 0, 0, 0.25); }
.switch.on .knob { left: auto; right: 0.2em; }
.switch:has(.switch-label) { width: 4.8em; }
.switch-label { color: #fff; font-size: calc(var(--fs) * 0.75); font-weight: 800; }

/* \u2500\u2500 \uC124\uC815 (04-1) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
/* Flex with wrap: at large text sizes or on narrow phones the field drops to its own line instead of shrinking. */
.setting-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5em;
  padding: 0.55em 0.6em;
  border-radius: 0.8em;
  border: 1.5px solid var(--fw-border);
  background: var(--fw-surface-3);
}
.row-leaf { color: var(--fw-leaf); }
.setting-label { font-weight: 800; white-space: nowrap; }
.input {
  width: 100%;
  min-width: 0;
  min-height: 2.6em;
  padding: 0.35em 0.7em;
  border: 1.5px solid var(--fw-border-strong);
  border-radius: 0.6em;
  background: #fffdf6;
  color: var(--fw-text);
  font: inherit;
}
.input.readonly { display: inline-flex; align-items: center; gap: 0.4em; color: var(--fw-muted); overflow: hidden; white-space: nowrap; }
.setting-block { display: grid; gap: 0.5em; padding: 0.55em 0.6em 0.75em; border-radius: 0.8em; border: 1.5px solid var(--fw-border); background: var(--fw-surface-3); }
.setting-block .setting-row { padding: 0; border: 0; background: none; }
/* The field and its button wrap together. */
.setting-field { flex: 1 1 12em; min-width: 0; display: flex; align-items: center; gap: 0.5em; }
.setting-field > .input { flex: 1 1 auto; }
.setting-field > .button { flex: none; white-space: nowrap; }
.setting-row > .slider { flex: 1 1 6em; width: auto; }
.setting-row > .button, .setting-row > .icon, .setting-label, .slider-value { flex: none; }
.slider { width: 100%; min-width: 0; min-height: 2.6em; accent-color: var(--fw-leaf); }
.slider-value { min-width: 3em; text-align: right; font-weight: 700; font-variant-numeric: tabular-nums; }
.font-preview { margin: 0 0.5em; padding: 0.6em; border-radius: 0.6em; border: 1.5px dashed var(--fw-border-strong); background: var(--fw-surface-2); text-align: center; font-size: var(--fs); }
.manage-row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.75em;
  width: 100%;
  min-height: 3.1em;
  padding: 0.4em 0.75em;
  border: 1.5px solid var(--fw-border);
  border-radius: 0.7em;
  background: var(--fw-surface-3);
  color: var(--fw-text);
  font: inherit;
  text-align: left;
  cursor: pointer;
}
.manage-icon { flex: none; display: inline-flex; color: var(--fw-wood); }
.manage-title { flex: 1; font-weight: 800; }
.menu-chevron { flex: none; display: inline-flex; color: var(--fw-wood-dark); }
.note-box { display: flex; align-items: center; gap: 0.75em; padding: 0.65em 0.9em; border-radius: 0.8em; background: var(--fw-leaf-soft); color: #3f5b33; }
.note-box .icon { width: 1.8em; height: 1.8em; }
.note-box > span { display: grid; }
.note-box strong { font-weight: 800; }
.note-box span span { font-size: calc(var(--fs) * 0.85); }
.footnote { justify-self: center; max-width: 100%; padding: 0.3em 1.1em; border-radius: 999px; border: 1.5px solid var(--fw-border-strong); background: var(--fw-surface); color: var(--fw-muted); font-size: calc(var(--fs) * 0.85); text-align: center; }

/* \u2500\u2500 \uC800\uC7A5\xB7\uBC31\uC5C5 (05-2) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.card.saved { justify-items: center; gap: 0.3em; padding: 1.2em 1em; }
.saved-title { display: flex; align-items: center; gap: 0.5em; font-size: calc(var(--fs) * 1.7); font-weight: 900; }
.check { display: inline-flex; width: 1.7em; height: 1.7em; align-items: center; justify-content: center; border-radius: 50%; background: var(--fw-pass); color: #fff; }
.check .icon { width: 1.1em; height: 1.1em; stroke-width: 3; }
.saved-time { color: var(--fw-muted); font-size: calc(var(--fs) * 1.05); }
.usage-rows { display: grid; padding: 0.3em 0.75em; border-radius: 0.8em; border: 1.5px solid var(--fw-border); background: var(--fw-surface-3); }
.usage-row { display: grid; grid-template-columns: auto 4.6em minmax(0, 1fr) 4.6em; align-items: center; gap: 0.6em; padding: 0.55em 0; }
.usage-row + .usage-row { border-top: 1px solid var(--fw-border); }
.usage-row .icon { color: var(--fw-wood-dark); }
.usage-label { font-weight: 700; }
.usage-bar { display: block; height: 0.9em; border-radius: 999px; background: var(--fw-track); overflow: hidden; }
.usage-fill { display: block; height: 100%; border-radius: 999px; background: #2f9a7f; }
.usage-size { text-align: right; font-weight: 700; font-variant-numeric: tabular-nums; }
.menu { gap: 0.55em; }
.menu-row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.8em;
  width: 100%;
  min-height: 3.8em;
  padding: 0.6em 0.75em;
  border-radius: 0.8em;
  border: 1.5px solid var(--fw-border);
  background: var(--fw-surface-3);
  color: var(--fw-text);
  font: inherit;
  text-align: left;
  cursor: pointer;
}
.menu-row:disabled { opacity: 0.55; cursor: not-allowed; }
.menu-icon { flex: none; display: inline-flex; align-items: center; justify-content: center; width: 2.9em; height: 2.9em; border-radius: 0.7em; background: var(--fw-accent); color: var(--fw-on-accent); box-shadow: 0 0.15em 0 var(--fw-accent-strong); }
.menu-icon.light, .menu-icon.quiet { background: var(--fw-surface-2); color: var(--fw-wood-dark); box-shadow: none; border: 1.5px solid var(--fw-border); }
.menu-text { display: grid; flex: 1; min-width: 0; }
.menu-title { font-size: calc(var(--fs) * 1.1); font-weight: 900; overflow-wrap: anywhere; }
.menu-row.quiet .menu-title { font-size: var(--fs); }
.menu-detail { color: var(--fw-muted); font-size: calc(var(--fs) * 0.85); overflow-wrap: anywhere; }
.menu-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.5em; }
label.menu-row:focus-within { outline: 3px solid var(--fw-accent); outline-offset: 2px; }
.restore { display: grid; gap: 0.55em; }
.preview-box { display: grid; gap: 0.45em; padding: 0.75em; border-radius: 0.8em; border: 1.5px dashed var(--fw-border-strong); background: var(--fw-surface); }
.preview-head { display: flex; align-items: center; gap: 0.45em; font-size: calc(var(--fs) * 1.05); }
.preview-head .icon { color: var(--fw-accent); }
.preview-rows { display: grid; padding: 0.2em 0.75em; border-radius: 0.6em; border: 1px solid var(--fw-border); background: var(--fw-surface-3); }
.preview-row { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: 0.75em; padding: 0.4em 0; }
.preview-row + .preview-row { border-top: 1px solid var(--fw-border); }
.preview-row .icon { color: var(--fw-wood); }
.preview-row strong { font-variant-numeric: tabular-nums; }

/* \u2500\u2500 \uC138\uACC4 \uACE0\uB974\uAE30 \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.form { gap: 0.5em; }
.form .button { margin-top: 0.4em; }
.field-label { font-weight: 800; }

/* \u2500\u2500 \uC2DC\uC791 \uAFB8\uB7EC\uBBF8 (sheet) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.sheet-backdrop { position: absolute; inset: 0; z-index: 10; display: flex; align-items: flex-end; justify-content: center; padding: 0.75em; background: rgba(40, 25, 12, 0.45); }
.sheet { width: min(100%, 480px); max-height: 100%; overflow-y: auto; gap: 0.75em; padding: 1.25em; }
.kit { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.4em; }
.kit-item { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: 0.6em; padding: 0.55em 0.8em; border-radius: 0.7em; background: var(--fw-surface-2); font-weight: 700; }
.kit-item .icon { color: var(--fw-leaf); }
.kit-item strong { font-variant-numeric: tabular-nums; }

/* \u2500\u2500 \uC5F0\uACB0 \uC810\uAC80 \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.diagnostics { display: grid; gap: 0.75em; min-width: 0; }
.list { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.5em; }
.row { display: flex; justify-content: space-between; align-items: center; gap: 0.75em; min-width: 0; }
.row.stacked { display: grid; gap: 0.25em; padding-bottom: 0.5em; border-bottom: 1px solid var(--fw-border); }
.row.stacked:last-child { border-bottom: 0; padding-bottom: 0; }
.row-head { display: flex; justify-content: space-between; align-items: center; gap: 0.75em; }
.name { min-width: 0; overflow-wrap: anywhere; }
.detail { color: var(--fw-muted); font-size: calc(var(--fs) * 0.85); overflow-wrap: anywhere; }
.badge { flex: none; font-size: calc(var(--fs) * 0.8); font-weight: 800; padding: 0.1em 0.55em; border-radius: 999px; border: 1px solid currentColor; background: var(--fw-surface-3); }
.badge.pass { color: var(--fw-pass); }
.badge.fail { color: var(--fw-fail); }
.badge.unavailable { color: var(--fw-unavailable); }
.file { width: 100%; max-width: 100%; font: inherit; min-height: 2.75em; }
.stage {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  min-height: 12em;
  padding: 0.75em;
  border-radius: 0.6em;
  background-color: #efe6d0;
  background-image: linear-gradient(45deg, #ddd0b2 25%, transparent 25%, transparent 75%, #ddd0b2 75%),
    linear-gradient(45deg, #ddd0b2 25%, transparent 25%, transparent 75%, #ddd0b2 75%);
  background-size: 16px 16px;
  background-position: 0 0, 8px 8px;
}
.preview { max-width: 100%; max-height: 22em; width: auto; height: auto; object-fit: contain; }
.facts { margin: 0; display: grid; grid-template-columns: max-content minmax(0, 1fr); gap: 0.25em 0.75em; font-size: calc(var(--fs) * 0.9); }
.facts dt { color: var(--fw-muted); }
.facts dd { margin: 0; overflow-wrap: anywhere; font-weight: 700; }

/* \u2500\u2500 Narrow phones \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
@media (max-width: 380px) {
  .top { padding-left: 0.5em; padding-right: 0.5em; }
  .sign-home { font-size: calc(var(--fs) * 1.3); }
  .top-sub.with-resources .sign { font-size: var(--fs); padding: 0.3em 0.45em; }
  .coin { width: 1.3em; height: 1.3em; }
  .counter { padding-right: 0.45em; }
  .icon-button.gear { width: 2.2em; }
  .field-tab { font-size: calc(var(--fs) * 0.85); }
  .report-body { grid-template-columns: 1fr; }
  .report-items { padding-right: 0; border-right: 0; }
  .facility { grid-template-columns: 1fr; }
  .facility-picture { aspect-ratio: auto; min-height: 6em; }
  .plan-row { grid-template-columns: auto minmax(0, 1fr); }
  .plan-row .plan-progress { grid-column: 1 / -1; }
  .usage-row { grid-template-columns: auto minmax(0, 1fr) auto; }
  .usage-row .usage-label { grid-column: 2; }
  .usage-row .usage-bar { grid-column: 1 / -1; grid-row: 2; }
}

/* \u2500\u2500 Focus \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
button:focus-visible, .locked-block:focus-visible, .input:focus-visible, .slider:focus-visible, .file:focus-visible {
  outline: 3px solid var(--fw-accent);
  outline-offset: 2px;
}
@media (prefers-reduced-motion: reduce) { * { scroll-behavior: auto; } }
`;var Se="marinara-capability-forest-workshop",Y=class extends HTMLElement{constructor(){super();w(this,"root");w(this,"controller",null);w(this,"diagnostics",null);w(this,"unsubscribe",null);w(this,"styleNode",document.createElement("style"));w(this,"renderedRoute",null);this.root=this.attachShadow({mode:"open"}),this.styleNode.textContent=Ne}connectedCallback(){this.controller||(this.controller=se(),this.diagnostics=new O,this.controller.start()),this.unsubscribe?.(),this.unsubscribe=this.controller.store.subscribe(a=>this.render(a)),this.render(this.controller.store.get())}disconnectedCallback(){this.unsubscribe?.(),this.unsubscribe=null}screen(a,o){switch(a.route){case"home":return ue(a,o);case"work":return xe(a,o);case"facilities":return ve(a,o);case"settings":return we(a,o);case"backup":return ge(a,o);case"diagnostics":return this.diagnostics.start(),v(a,o,{top:{kind:"sub",title:"\uC5F0\uACB0 \uC810\uAC80",back:{route:"backup",label:"\uC800\uC7A5\xB7\uBC31\uC5C5"},resources:!1},backdrop:"wood",body:[this.diagnostics.node],nav:!0});default:return ke(a,o)}}render(a){let o=this.screen(a,this.controller);this.style.setProperty("--fw-font-size",`${a.fontSize}px`);let n=this.root.activeElement?.id,l=a.route===this.renderedRoute?this.root.querySelector(".scroll")?.scrollTop??0:0;this.root.replaceChildren(this.styleNode,o),this.renderedRoute=a.route;let u=this.root.querySelector(".scroll");u&&(u.scrollTop=l),n&&this.root.getElementById(n)?.focus({preventScroll:!0})}};typeof customElements<"u"&&!customElements.get(Se)&&customElements.define(Se,Y);
