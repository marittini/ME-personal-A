var dt=Object.defineProperty;var ct=(e,r,a)=>r in e?dt(e,r,{enumerable:!0,configurable:!0,writable:!0,value:a}):e[r]=a;var I=(e,r,a)=>ct(e,typeof r!="symbol"?r+"":r,a);var O=globalThis.__MARINARA_HOST__;if(!O||O.version!==1||!O.queryClient)throw new Error("Marinara Engine does not provide its query client; this package needs capability API 1.341 or newer.");var ur=O.queryClient;function fe(){let e=O.api;if(!e?.api)throw new Error("\uC774 Marinara Engine\uC740 \uD328\uD0A4\uC9C0 API \uD074\uB77C\uC774\uC5B8\uD2B8\uB97C \uC81C\uACF5\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.");return e}function R(){return fe().api}function A(e,r){try{let a=e.payload;return typeof a?.message=="string"&&a.message?a.message:fe().getApiErrorMessage(e,r)}catch{return e instanceof Error&&e.message?e.message:r}}function K(e){let r=e.payload;return typeof r?.error=="string"?r.error:null}function U(){return typeof crypto<"u"&&typeof crypto.randomUUID=="function"?crypto.randomUUID():`${Date.now().toString(36)}-${Math.random().toString(36).slice(2,12)}`}function W(){if(typeof crypto<"u"&&typeof crypto.randomUUID=="function")return crypto.randomUUID();let e=crypto.getRandomValues(new Uint8Array(16));e[6]=e[6]&15|64,e[8]=e[8]&63|128;let r=[...e].map(a=>a.toString(16).padStart(2,"0")).join("");return`${r.slice(0,8)}-${r.slice(8,12)}-${r.slice(12,16)}-${r.slice(16,20)}-${r.slice(20)}`}var z="/forest-workshop",$={listWorlds:()=>R().get(`${z}/worlds`),createWorld:e=>R().post(`${z}/worlds`,e),getState:e=>R().get(`${z}/state?worldId=${encodeURIComponent(e)}`),sendCommand:e=>R().post(`${z}/commands`,e),getStorage:e=>R().get(`${z}/storage?worldId=${encodeURIComponent(e)}`),getBackup:e=>R().get(`${z}/backup?worldId=${encodeURIComponent(e)}`),listSources:e=>R().get(`${z}/sources?worldId=${encodeURIComponent(e)}`),previewSource:(e,r,a)=>R().get(`${z}/sources/preview?worldId=${encodeURIComponent(e)}&kind=${r}&id=${encodeURIComponent(a)}`),rebuildSuggestion:(e,r)=>R().post(`${z}/rebuild-suggestion`,{worldId:e,source:r}),uploadResidentImage:e=>{let r=new FormData;return r.append("worldId",e.worldId),r.append("residentId",e.residentId),r.append("uploadKey",e.uploadKey),r.append("file",e.file,e.file.name),R().upload(`${z}/residents/image`,r)},restore:(e,r)=>R().post(`${z}/restore`,{newWorldId:e,backup:r})};var ge="\uC232\uACB0 \uACF5\uBC29 \uBC31\uC5C5 \uD30C\uC77C\uC774 \uC544\uB2D9\uB2C8\uB2E4. \uC124\uC815 \u2192 \uC800\uC7A5\xB7\uBC31\uC5C5\uC5D0\uC11C \uB0B4\uBCF4\uB0B8 JSON \uD30C\uC77C\uC744 \uACE8\uB77C \uC8FC\uC138\uC694.";function be(e,r){return!e||typeof e!="object"||Array.isArray(e)?0:Object.values(e).filter(r).length}function he(e){let r=e;if(!r||r.format!=="forest-workshop-backup"||!r.world)return{ok:!1,message:ge};let{settings:a,wallet:n,inventory:i}=r.world;if(typeof a?.worldName!="string"||typeof a.playerNickname!="string")return{ok:!1,message:ge};let o=i&&typeof i=="object"?Object.values(i).filter(l=>typeof l=="number"&&l>0):[];return{ok:!0,summary:{worldName:a.worldName,playerNickname:a.playerNickname,gold:typeof n?.gold=="number"?n.gold:0,itemKinds:o.length,itemTotal:o.reduce((l,d)=>l+d,0),exportedAt:typeof r.exportedAt=="string"?r.exportedAt:"",residents:be(r.world.residents,()=>!0),pairs:be(r.world.pairs,l=>!l.archived),pictures:Array.isArray(r.assets)?r.assets.length:0}}}var re={tickets:{label:"\uCD08\uB300\uAD8C",phase:"P3"},weather:{label:"\uD604\uC2E4 \uB0A0\uC528",phase:"P5"},mail:{label:"\uC6B0\uD3B8\uD568",phase:"P4"},"work-report":{label:"\uC791\uC5C5 \uBCF4\uACE0",phase:"P3"},"offline-cap":{label:"\uBBF8\uC811\uC18D \uB204\uC801 \uC9C4\uD589",phase:"P3"},stories:{label:"\uC8FC\uBBFC \uC774\uC57C\uAE30",phase:"P4"},explore:{label:"\uD0D0\uC0AC",phase:"P4"},invite:{label:"\uCD08\uB300",phase:"P3"},"work-fields":{label:"\uBD84\uC57C\uBCC4 \uC791\uC5C5",phase:"P3"},"work-mode":{label:"\uC790\uB3D9 \uC6B4\uC601 \xB7 \uC9C0\uC815 \uD69F\uC218",phase:"P3"},"work-rules":{label:"\uC6B4\uC601 \uADDC\uCE59",phase:"P3"},"facility-upgrade":{label:"\uC2DC\uC124 \uAC15\uD654",phase:"P3"},"stock-protection":{label:"\uC7AC\uACE0 \uBCF4\uD638 \uD3B8\uC9D1",phase:"P3"},"auto-sell":{label:"\uC790\uB3D9 \uD310\uB9E4",phase:"P3"},"weather-effects":{label:"\uB0A0\uC528 \uD6A8\uACFC",phase:"P5"},"auto-read":{label:"\uC790\uB3D9 \uC77D\uAE30",phase:"P4"},"ai-guidelines":{label:"AI \uC9C0\uCE68 \uAD00\uB9AC",phase:"P4"},memory:{label:"\uAE30\uC5B5 \uAD00\uB9AC",phase:"P4"},specialty:{label:"\uC804\uBB38 \uBD84\uC57C",phase:"P3"},breakthrough:{label:"\uD328\uC2DC\uBE0C \xB7 \uB3CC\uD30C",phase:"P3"},"pair-memory":{label:"\uD398\uC5B4 \uAE30\uC5B5 \uBCF4\uAE30",phase:"P4"},"pair-guidelines":{label:"\uD398\uC5B4 \uC9C0\uCE68 \uAD00\uB9AC",phase:"P4"}};function q(e){return e in re}function we(e){return re[e]?.phase??""}function ye(e){let r=re[e];return r?`${r.label} \uAE30\uB2A5\uC740 \uC900\uBE44 \uC911\uC774\uC5D0\uC694. \uAC1C\uBC1C ${r.phase} \uB2E8\uACC4\uC5D0\uC11C \uC5F4\uB824\uC694.`:""}var ve="forest-workshop:font-size",T={min:12,max:22,default:16,step:1};function G(e){return Number.isFinite(e)?Math.min(T.max,Math.max(T.min,Math.round(e))):T.default}function xe(){try{let e=localStorage.getItem(ve);return e===null?T.default:G(Number(e))}catch{return T.default}}function ke(e){try{localStorage.setItem(ve,String(G(e)))}catch{}}function Ne(e){let r=e,a=new Set;return{get:()=>r,set(n){let i=typeof n=="function"?n(r):n;r={...r,...i};for(let o of a)o(r)},remember(n){let i=typeof n=="function"?n(r):n;r={...r,...i}},subscribe(n){return a.add(n),()=>a.delete(n)}}}function Se(e){let{store:r}=e;function a(o){r.set(l=>l.register?{register:{...l.register,...o}}:{})}function n(){let o=r.get().register?.pendingImage;o&&URL.revokeObjectURL(o.previewUrl)}async function i(){let o=e.currentWorld();if(o){a({sources:{state:"loading"}});try{let{sources:l}=await $.listSources(o.worldId);a({sources:{state:"ready",value:l}})}catch(l){a({sources:{state:"error",message:A(l,"\uCE90\uB9AD\uD130\xB7\uD398\uB974\uC18C\uB098 \uBAA9\uB85D\uC744 \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC5B4\uC694.")}})}}}return{openRegister(o=1){n(),r.set({register:{step:o,kindTab:"character",query:"",sources:{state:"loading"},selected:null,preview:null,draft:"",pendingImage:null,starterChoice:null}}),e.navigate("register"),o===1&&i()},closeRegister(){n(),r.set({register:null}),e.navigate("residents")},loadSources:i,setRegisterKind:o=>a({kindTab:o}),setRegisterQuery:o=>a({query:o}),backToSources:()=>a({step:1}),setDraft:o=>r.remember(l=>l.register?{register:{...l.register,draft:o}}:{}),setStarterChoice:o=>a({starterChoice:o}),async chooseSource(o){let l=e.currentWorld();if(l){a({step:2,selected:o,preview:{state:"loading"},draft:""});try{let d=await $.previewSource(l.worldId,o.kind,o.id);a({preview:{state:"ready",value:d}})}catch(d){a({preview:{state:"error",message:A(d,"\uC790\uB8CC\uB97C \uC77D\uC9C0 \uBABB\uD588\uC5B4\uC694.")}})}}},async suggestSetting(){let o=e.currentWorld(),l=r.get().register?.selected;if(!o||!l)return;let d=await e.track("rebuild-suggestion",()=>$.rebuildSuggestion(o.worldId,{kind:l.kind,id:l.id}),"\uC81C\uC548\uC744 \uBC1B\uC9C0 \uBABB\uD588\uC5B4\uC694. \uC9C1\uC811 \uC368\uB3C4 \uB3FC\uC694.");d&&a({draft:d.suggestion})},pickPendingImage(o){n(),a({pendingImage:{file:o,previewUrl:URL.createObjectURL(o)}})},clearPendingImage(){n(),a({pendingImage:null})},async confirmRegister(o,l){let d=r.get().register,m=d?.selected;if(!d||!m||!d.draft.trim())return;let p=`register:${m.kind}:${m.id}`,b=e.requestIdFor(`${p}:id`,p,W);if(!await e.runCommand(p,"residents.register",{residentId:b,source:{kind:m.kind,id:m.id},worldSetting:d.draft}))return;e.forgetRequest(`${p}:id`);let M=o?d.pendingImage:null;M&&await l(b,M.file),n();let L=e.currentWorld();if(L&&L.state.progress.starterResidentId===null){a({step:3,starterChoice:b,pendingImage:null,selected:null,preview:null,draft:""});return}r.set(D=>({register:null,residentsView:{...D.residentsView,selectedId:b}})),e.navigate("residents"),e.notify(`${m.name}\uC744(\uB97C) \uC8FC\uBBFC\uC73C\uB85C \uB4F1\uB85D\uD588\uC5B4\uC694.`)},async confirmStarter(){let o=r.get().register?.starterChoice;!o||!await e.runCommand("choose-starter","residents.chooseStarter",{residentId:o})||(r.set({register:null}),e.navigate("home"),e.notify("\uC2DC\uC791 \uC8FC\uBBFC\uC774 \uACF5\uBC29\uC5D0 \uC654\uC5B4\uC694."))},registerAnother(){a({step:1,query:""}),i()}}}function Re(e,r){let a=r.query.trim().toLowerCase();return Object.values(e.residents).filter(n=>r.tab==="all"||n.kind===r.tab).filter(n=>r.filter==="all"?!0:r.filter==="recruited"?n.recruited:!n.recruited).filter(n=>!a||n.displayName.toLowerCase().includes(a)||n.source.name.toLowerCase().includes(a)).sort((n,i)=>Number(i.recruited)-Number(n.recruited)||n.registeredAt.localeCompare(i.registeredAt))}function Ie(e){let{store:r}=e;function a(i){let o=e.currentWorld();return o&&i?o.state.residents[i]??null:null}function n(i){r.set(o=>({residentsView:{...o.residentsView,...i}}))}return{setResidentsTab:i=>n({tab:i}),setResidentsQuery:i=>n({query:i}),setResidentsFilter:i=>n({filter:i}),selectResident:i=>n({selectedId:i}),openResidents(i){i&&n({selectedId:i}),e.navigate("residents")},openRelations(i){r.set({focusResidentId:i}),e.navigate("relations")},openResidentImage(i){let o=a(i);r.set({focusResidentId:i,placementDraft:o?{...o.image.placement}:null}),e.navigate("resident-image")},openSheet(i){r.set({sheet:i,notice:null})},closeSheet(){r.set({sheet:null})},toggleRelationsEditing(){r.set(i=>({relationsEditing:!i.relationsEditing}))},async updateWorldSetting(i,o){let l=await e.runCommand(`resident-setting:${i}`,"residents.update",{residentId:i,worldSetting:o});return l&&e.notify("\uACF5\uBC29 \uC138\uACC4 \uC124\uC815\uC744 \uACE0\uCCE4\uC5B4\uC694. \uBCC0\uACBD \uC774\uB825\uC5D0 \uB0A8\uC558\uC5B4\uC694."),l},async addPair(i,o){let l=a(i),d=a(o);if(!l||!d)return;let[m,p]=l.kind==="character"?[l.residentId,d.residentId]:[d.residentId,l.residentId],b=`pair-add:${m}:${p}`,S=e.requestIdFor(`${b}:id`,b,W);await e.runCommand(b,"pairs.add",{pairId:S,characterResidentId:m,personaResidentId:p})&&(e.forgetRequest(`${b}:id`),r.set({sheet:null}),e.notify(`${l.displayName} \xD7 ${d.displayName} \uD398\uC5B4\uB97C \uB9CC\uB4E4\uC5C8\uC5B4\uC694.`))},archivePair:i=>e.runCommand(`pair-archive:${i}`,"pairs.archive",{pairId:i}),restorePair:i=>e.runCommand(`pair-restore:${i}`,"pairs.restore",{pairId:i}),setPlacementDraft(i){r.set(o=>o.placementDraft?{placementDraft:{...o.placementDraft,...i}}:{})},resetPlacementDraft(){let i=r.get().content?.residents.placement;i&&r.set({placementDraft:{scale:i.scale.default,offsetX:i.offsetX.default,markerHeight:i.markerHeight.default}})},async applyPlacement(i){let o=r.get().placementDraft;if(!o)return;await e.runCommand(`placement:${i}`,"residents.setPlacement",{residentId:i,placement:o})&&e.notify("\uBC30\uCE58\uB97C \uC801\uC6A9\uD588\uC5B4\uC694. \uADF8\uB9BC \uD30C\uC77C\uC740 \uADF8\uB300\uB85C\uC608\uC694.")},async uploadResidentImage(i,o){let l=e.currentWorld();if(!l)return null;let d=`image-upload:${i}`,m=e.requestIdFor(d,`${i}:${o.name}:${o.size}:${o.lastModified}`),p=await e.track(d,()=>$.uploadResidentImage({worldId:l.worldId,residentId:i,uploadKey:m,file:o}),"\uADF8\uB9BC\uC744 \uC800\uC7A5\uD558\uC9C0 \uBABB\uD588\uC5B4\uC694. \uAE30\uC874 \uADF8\uB9BC\uC740 \uADF8\uB300\uB85C\uC608\uC694.");if(!p)return null;let b=e.currentWorld()??l;return e.showWorld({worldId:b.worldId,revision:p.revision,updatedAt:new Date().toISOString(),state:p.state}),e.notify(p.duplicate?"\uC774\uBBF8 \uC800\uC7A5\uB41C \uADF8\uB9BC\uC774\uC5D0\uC694.":"\uADF8\uB9BC\uC744 WebP\uB85C \uC800\uC7A5\uD588\uC5B4\uC694."),p},async restoreResidentImage(i,o){await e.runCommand(`image-restore:${i}`,"residents.restoreImage",{residentId:i,reference:o})&&(r.set({sheet:null}),e.notify("\uC774\uC804 \uADF8\uB9BC\uC73C\uB85C \uB418\uB3CC\uB838\uC5B4\uC694."))},async clearImageHistory(){let i=await e.runCommand("image-history-clear","residents.clearImageHistory",{});if(!i)return;r.set({sheet:null});let o=Array.isArray(i.result.released)?i.result.released.length:0;e.notify(o?`\uC774\uC804 \uADF8\uB9BC ${o}\uC7A5\uC744 \uC815\uB9AC\uD588\uC5B4\uC694.`:"\uC815\uB9AC\uD560 \uC774\uC804 \uADF8\uB9BC\uC774 \uC5C6\uC5B4\uC694."),await e.refreshStorage()}}}var ae="forest-workshop:last-world";function mt(){try{return localStorage.getItem(ae)}catch{return null}}function Ce(e){try{e?localStorage.setItem(ae,e):localStorage.removeItem(ae)}catch{}}function pt(e){let r=e.status;return typeof r=="number"&&r>=400&&r<500&&K(e)!==null}function $e(){let e=Ne({route:"worlds",worlds:{state:"loading"},world:null,content:null,busy:{},notice:null,restore:null,fontSize:xe(),facilitiesTab:"facilities",storage:null,starterSheetHidden:!1,residentsView:{tab:"all",query:"",filter:"all",selectedId:null},focusResidentId:null,relationsEditing:!1,sheet:null,placementDraft:null,register:null}),r=new Map,a=4e3,n=null,i;e.subscribe(c=>{if(c.notice!==n&&(n=c.notice,clearTimeout(i),n?.kind==="info")){let g=n;i=setTimeout(()=>{e.get().notice===g&&e.set({notice:null})},a)}});function o(c,g,w=U){let k=r.get(c);if(k&&k.signature===g)return k.id;let C=w();return r.set(c,{id:C,signature:g}),C}function l(c,g){e.set(w=>({busy:{...w.busy,[c]:g}}))}async function d(c,g,w){if(e.get().busy[c])return null;l(c,!0),e.set({notice:null});try{let k=await g();return r.delete(c),k}catch(k){return pt(k)&&r.delete(c),e.set({notice:{kind:"error",text:A(k,w)}}),K(k)==="stale_view"&&M(),null}finally{l(c,!1)}}function m(c,g){Ce(c.worldId),e.set(w=>({world:{state:"ready",value:{worldId:c.worldId,revision:c.revision,updatedAt:c.updatedAt,state:c.state}},content:g??w.content,route:w.route==="worlds"?"home":w.route}))}async function p(){e.set({worlds:{state:"loading"}});try{let{worlds:c}=await $.listWorlds();return e.set({worlds:{state:"ready",value:c}}),c}catch(c){return e.set({worlds:{state:"error",message:A(c,"\uC138\uACC4 \uBAA9\uB85D\uC744 \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.")}}),null}}async function b(c){e.set({world:{state:"loading"},route:"home",notice:null});try{let g=await $.getState(c);m(g,g.content)}catch(g){K(g)==="world_not_found"&&Ce(null),e.set({world:{state:"error",message:A(g,"\uC138\uACC4\uB97C \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.")}})}}async function S(){let c=L();if(c){e.set({storage:{state:"loading"}});try{e.set({storage:{state:"ready",value:await $.getStorage(c.worldId)}})}catch(g){e.set({storage:{state:"error",message:A(g,"\uC800\uC7A5 \uACF5\uAC04\uC744 \uD655\uC778\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.")}})}}}async function M(){let c=e.get().world;c?.state==="ready"&&await b(c.value.worldId)}function L(){let c=e.get().world;return c?.state==="ready"?c.value:null}function D(c){e.set({route:c,notice:null,restore:null,sheet:null,relationsEditing:!1}),c==="worlds"&&p(),c==="backup"&&S()}async function ue(c,g,w={}){let k=L();if(!k)return null;let C=JSON.stringify([k.worldId,g,w]),lt=o(c,C),H=await d(c,()=>$.sendCommand({worldId:k.worldId,commandId:lt,expectedRevision:k.revision,type:g,payload:w}),"\uC694\uCCAD\uC744 \uCC98\uB9AC\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4. \uB2E4\uC2DC \uC2DC\uB3C4\uD574 \uC8FC\uC138\uC694.");return H?(m({worldId:k.worldId,revision:H.revision,updatedAt:new Date().toISOString(),state:H.state}),H):null}let te={store:e,track:d,runCommand:ue,currentWorld:L,requestIdFor:o,forgetRequest:c=>r.delete(c),showWorld:m,navigate:D,refreshStorage:S,notify:(c,g="info")=>e.set({notice:{kind:g,text:c}})};return{store:e,...Ie(te),...Se(te),async start(){let c=await p(),g=mt();c&&g&&c.some(w=>w.worldId===g&&w.readable)&&await b(g)},loadWorlds:p,openWorld:b,reloadWorld:M,navigate:D,notify:te.notify,notifyLocked(c){e.set({notice:{kind:"info",text:ye(c)}})},setFontSize(c){let g=G(c);ke(g),e.set({fontSize:g})},setFacilitiesTab(c){e.set({facilitiesTab:c})},hideStarterSheet(){e.set({starterSheetHidden:!0})},showStarterSheet(){e.set({starterSheetHidden:!1})},dismissNotice(){e.set({notice:null})},async createWorld(c,g){let w=JSON.stringify([c.trim(),g.trim()]),k=o("create-world",w,W),C=await d("create-world",()=>$.createWorld({worldId:k,worldName:c,playerNickname:g}),"\uC138\uACC4\uB97C \uB9CC\uB4E4\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.");C&&m(C,C.content)},runCommand:ue,async downloadBackup(){let c=L();if(!c)return;let g=await d("backup",()=>$.getBackup(c.worldId),"\uBC31\uC5C5\uC744 \uB9CC\uB4E4\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.");if(!g)return;let w=new Blob([`${JSON.stringify(g,null,2)}
`],{type:"application/json"}),k=URL.createObjectURL(w),C=document.createElement("a");C.href=k,C.download=`forest-workshop-${c.state.settings.worldName}-${g.exportedAt.slice(0,10)}.json`,document.body.append(C),C.click(),C.remove(),setTimeout(()=>URL.revokeObjectURL(k),1e4),e.set({notice:{kind:"info",text:"\uBC31\uC5C5 \uD30C\uC77C\uC744 \uC800\uC7A5\uD588\uC2B5\uB2C8\uB2E4. \uBE44\uBC00\uD0A4\uB294 \uB4E4\uC5B4 \uC788\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4."}})},async selectRestoreFile(c){let g;try{g=JSON.parse(await c.text())}catch{e.set({restore:null,notice:{kind:"error",text:"\uBC31\uC5C5 \uD30C\uC77C\uC744 \uC77D\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4. JSON \uBC31\uC5C5 \uD30C\uC77C\uC744 \uACE8\uB77C \uC8FC\uC138\uC694."}});return}let w=he(g);if(!w.ok){e.set({restore:null,notice:{kind:"error",text:w.message}});return}e.set({notice:null,restore:{fileName:c.name,signature:`${c.name}:${c.size}:${c.lastModified}`,backup:g,summary:w.summary}})},cancelRestore(){e.set({restore:null})},async confirmRestore(){let c=e.get().restore;if(!c)return;let g=o("restore",c.signature,W),w=await d("restore",()=>$.restore(g,c.backup),"\uBC31\uC5C5\uC744 \uBCF5\uC6D0\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.");w&&(m(w,w.content),e.set({route:"home",restore:null,notice:{kind:"info",text:`\uBC31\uC5C5\uC744 \uC0C8 \uC138\uACC4 '${w.state.settings.worldName}'(\uC73C)\uB85C \uBCF5\uC6D0\uD588\uC2B5\uB2C8\uB2E4. \uAE30\uC874 \uC138\uACC4\uB294 \uADF8\uB300\uB85C\uC785\uB2C8\uB2E4.`}}))}}}function t(e,r={},a=[]){let n=document.createElement(e);r.className&&(n.className=r.className),r.text!==void 0&&(n.textContent=r.text);for(let[i,o]of Object.entries(r.attrs??{}))o!==void 0&&n.setAttribute(i,o);for(let[i,o]of Object.entries(r.on??{}))o&&n.addEventListener(i,o);r.disabled!==void 0&&"disabled"in n&&(n.disabled=r.disabled);for(let i of a)i==null||i===!1||n.append(typeof i=="string"?document.createTextNode(i):i);return n}function x(e,r,a={}){return t("button",{className:a.variant==="secondary"?"button secondary":"button",text:e,attrs:{type:"button",...a.attrs},disabled:a.disabled,on:{click:r}})}function N(e){return t("p",{className:"muted",text:e,attrs:{role:"status"}})}function P(e){return t("p",{className:"error",text:e,attrs:{role:"alert"}})}function ne(e){return e>=1024*1024?`${(e/(1024*1024)).toFixed(1)}MiB`:e>=1024?`${Math.round(e/1024)}KiB`:`${e}B`}var ie="http://www.w3.org/2000/svg";function u(e){return(r="icon")=>{let a=document.createElementNS(ie,"svg");a.setAttribute("viewBox","0 0 24 24"),a.setAttribute("aria-hidden","true"),a.setAttribute("focusable","false"),a.setAttribute("class",r);for(let n of e){let i=typeof n=="string"?{d:n}:n,o=i.circle?document.createElementNS(ie,"circle"):document.createElementNS(ie,"path");i.circle?(o.setAttribute("cx",String(i.circle[0])),o.setAttribute("cy",String(i.circle[1])),o.setAttribute("r",String(i.circle[2]))):o.setAttribute("d",i.d??""),i.fill&&o.setAttribute("class","fill"),a.append(o)}return a}}var s={back:u(["M15 5l-7 7 7 7"]),chevron:u(["M9 5l7 7-7 7"]),gear:u([{circle:[12,12,3.2]},"M19.4 13.5l1.6 1.2-2 3.4-1.9-.7a7.6 7.6 0 0 1-2 1.2l-.3 2h-4l-.3-2a7.6 7.6 0 0 1-2-1.2l-1.9.7-2-3.4 1.6-1.2a7.6 7.6 0 0 1 0-3l-1.6-1.2 2-3.4 1.9.7a7.6 7.6 0 0 1 2-1.2l.3-2h4l.3 2a7.6 7.6 0 0 1 2 1.2l1.9-.7 2 3.4-1.6 1.2a7.6 7.6 0 0 1 0 3z"]),lock:u(["M7 11V8a5 5 0 0 1 10 0v3","M5.5 11h13v9h-13z"]),home:u(["M3.5 11.5L12 4l8.5 7.5","M6 10v10h12V10","M10 20v-5h4v5"]),hammer:u(["M14 4l6 6-2.5 2.5-6-6z","M12.5 8.5L4 17l3 3 8.5-8.5"]),compass:u([{circle:[12,12,8.5]},"M15.5 8.5l-2 5-5 2 2-5z"]),residents:u([{circle:[9,9,3.2]},{circle:[16.5,10,2.6]},"M3.5 19c.8-3.2 3-5 5.5-5s4.7 1.8 5.5 5","M14.5 15.5c2.6-.6 5 .8 6 3.5"]),ticket:u(["M4 7h16v3a2 2 0 0 0 0 4v3H4v-3a2 2 0 0 0 0-4z","M10 9.5c1.5 0 3 1 3 2.5s-1.5 2.5-3 2.5"]),mail:u(["M4 6.5h16v11H4z","M4.5 7l7.5 6 7.5-6"]),weather:u(["M7 18h10a3.5 3.5 0 0 0 .4-7A5 5 0 0 0 7.8 10 4 4 0 0 0 7 18z"]),clock:u([{circle:[12,12,8.5]},"M12 7.5V12l3 2"]),info:u([{circle:[12,12,8.5]},"M12 11v5.5","M12 7.6v.4"]),check:u(["M5 12.5l4.5 4.5L19 7.5"]),eye:u(["M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z",{circle:[12,12,2.8]}]),image:u(["M4 5h16v14H4z",{circle:[9,10,1.6]},"M4.5 17l5-5 4 4 2.5-2.5 3.5 3.5"]),landscape:u(["M4 5h16v14H4z","M4.5 17l5.5-6 4 4 2-2 3.5 4"]),document:u(["M7 3.5h7l4 4V20.5H7z","M14 3.5v4h4","M9.5 12h6","M9.5 15.5h6"]),folder:u(["M3.5 7h6l2 2h9v10h-17z"]),book:u(["M12 6.5c-2-1.3-4.7-1.6-8-1v13c3.3-.6 6-.3 8 1 2-1.3 4.7-1.6 8-1v-13c-3.3-.6-6-.3-8 1z","M12 6.5v13"]),flower:u([{circle:[12,12,2.4]},{circle:[12,6.5,2.6]},{circle:[17.2,10.3,2.6]},{circle:[15.2,16.5,2.6]},{circle:[8.8,16.5,2.6]},{circle:[6.8,10.3,2.6]}]),people:u([{circle:[8,8.5,2.8]},{circle:[16,8.5,2.8]},"M3 19c.6-3 2.5-4.6 5-4.6s4.4 1.6 5 4.6","M11 19c.6-3 2.5-4.6 5-4.6s4.4 1.6 5 4.6"]),pair:u([{circle:[9,12,4.5]},{circle:[15,12,4.5]}]),upload:u(["M12 15.5V4.5","M7.5 9l4.5-4.5L16.5 9","M5 14v5.5h14V14"]),download:u(["M12 4.5v11","M7.5 11l4.5 4.5 4.5-4.5","M5 14v5.5h14V14"]),restore:u(["M4.5 12a7.5 7.5 0 1 0 2.2-5.3","M4.5 4.5v4h4"]),leaf:u(["M5 19c0-8 5-13 14-14-1 9-6 14-14 14z","M5 19l7-7"]),sprout:u(["M12 20v-8","M12 12c0-3.5-2.5-6-6.5-6 0 3.5 2.5 6 6.5 6z","M12 12c0-3.5 2.5-6 6.5-6 0 3.5-2.5 6-6.5 6z"]),search:u([{circle:[10.5,10.5,6]},"M15 15l5 5"]),jar:u(["M8 4.5h8v3H8z","M7 7.5h10l1 3v8a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-8z","M9 14h6"]),box:u(["M3.5 8l8.5-4 8.5 4v9l-8.5 4-8.5-4z","M3.5 8l8.5 4 8.5-4","M12 12v9"]),house:u(["M4 11l8-6.5 8 6.5","M6.5 9.5V19h11V9.5","M10.5 19v-4.5h3V19"]),pencil:u(["M15.5 4.5l4 4L9 19H5v-4z","M13.5 6.5l4 4"]),swap:u(["M5 9h12l-3-3","M19 15H7l3 3"]),minus:u(["M6 12h12"]),plus:u(["M6 12h12","M12 6v12"]),grip:u([{circle:[9,7,1.2],fill:!0},{circle:[15,7,1.2],fill:!0},{circle:[9,12,1.2],fill:!0},{circle:[15,12,1.2],fill:!0},{circle:[9,17,1.2],fill:!0},{circle:[15,17,1.2],fill:!0}]),menu:u(["M5 8h14","M5 12h14","M5 16h14"]),filter:u(["M4 5.5h16l-6 7.5v5.5l-4 1.5v-7z"]),heart:u(["M12 19s-7-4.4-7-9.5A4 4 0 0 1 12 7a4 4 0 0 1 7 2.5C19 14.6 12 19 12 19z"]),sparkle:u(["M12 4l1.8 5.2L19 11l-5.2 1.8L12 18l-1.8-5.2L5 11l5.2-1.8z"]),zoom:u([{circle:[10.5,10.5,6]},"M15 15l5 5","M10.5 8v5","M8 10.5h5"]),arrows:u(["M4 12h16","M7.5 8.5L4 12l3.5 3.5","M16.5 8.5L20 12l-3.5 3.5"]),updown:u(["M12 4v16","M8.5 7.5L12 4l3.5 3.5","M8.5 16.5L12 20l3.5-3.5"]),archive:u(["M3.5 5h17v4h-17z","M5 9v10h14V9","M10 13h4"]),addImage:u(["M6 3.5h8l4 4v13H6z","M14 3.5v4h4","M9 16l2.5-3 2 2 1-1.2",{circle:[17.5,17.5,3.5]},"M17.5 16v3","M16 17.5h3"])};function _(e){return t("span",{className:"lock-tag",attrs:{"aria-hidden":"true"}},[s.lock("icon tiny"),we(e)])}function y(e,r,a){let n=q(r)||!a.onOpen;return t("button",{className:`${a.className}${n?" is-locked":""}`,attrs:{type:"button","aria-label":n?`${a.label} (\uC900\uBE44 \uC911)`:a.label},on:{click:()=>n?e.notifyLocked(r):a.onOpen?.()}},[...a.children,n?_(r):null])}function j(e,r,a,n=""){return t("div",{className:`locked-block ${n}`.trim(),attrs:{role:"button",tabindex:"0","aria-label":"\uC900\uBE44 \uC911\uC778 \uAE30\uB2A5 \u2014 \uB204\uB974\uBA74 \uC5F4\uB9AC\uB294 \uB2E8\uACC4\uB97C \uC54C\uB824 \uB4DC\uB824\uC694"},on:{click:()=>e.notifyLocked(r),keydown:i=>{let o=i.key;(o==="Enter"||o===" ")&&(i.preventDefault(),e.notifyLocked(r))}}},[...a,t("span",{className:"locked-veil"},[_(r),t("span",{text:"\uC900\uBE44 \uC911"})])])}var ut=[{label:"\uD648",icon:s.home,routes:["home","settings","backup","diagnostics"]},{label:"\uC791\uC5C5",icon:s.hammer,routes:["work","facilities"]},{label:"\uD0D0\uC0AC",icon:s.compass,routes:[],feature:"explore"},{label:"\uC8FC\uBBFC",icon:s.residents,routes:["residents","relations","resident-image"]},{label:"\uCD08\uB300",icon:s.ticket,routes:[],feature:"invite"}];function Ae(e,r){return t("nav",{className:"tabbar",attrs:{"aria-label":"\uACF5\uBC29 \uBA54\uB274"}},ut.map(a=>{let n=a.feature?q(a.feature):!1,i=a.routes.includes(e.route);return t("button",{className:`tab${i?" current":""}${n?" is-locked":""}`,attrs:{type:"button","aria-current":i?"page":void 0,"aria-label":n?`${a.label} (\uC900\uBE44 \uC911)`:a.label},on:{click:()=>{n&&a.feature?r.notifyLocked(a.feature):a.routes[0]&&r.navigate(a.routes[0])}}},[t("span",{className:"tab-icon"},[a.icon("icon tab-glyph"),n&&a.feature?_(a.feature):null]),t("span",{className:"tab-label",text:a.label})])}))}function Me(e,r){let a=e.world?.state==="ready"?e.world.value:null;if(!a)return null;let n=a.state.wallet.gold.toLocaleString("ko-KR");return t("div",{className:"resources"},[t("span",{className:"counter gold",attrs:{"aria-label":`\uACE8\uB4DC ${n}`}},[t("span",{className:"coin",attrs:{"aria-hidden":"true"}}),t("span",{className:"counter-value",text:n})]),y(r,"tickets",{className:"counter ticket",label:"\uCD08\uB300\uAD8C",children:[t("span",{className:"ticket-mark"},[s.ticket("icon")]),t("span",{className:"counter-value",text:"\u2013"})]}),e.route==="settings"?null:t("button",{className:"icon-button gear",attrs:{type:"button","aria-label":"\uC124\uC815"},on:{click:()=>r.navigate("settings")}},[s.gear()])])}function ze(e,r,a){if(a.kind==="home")return t("header",{className:"top top-home"},[t("div",{className:"top-row"},[t("h1",{className:"sign sign-home",text:"\uC232\uACB0 \uACF5\uBC29",attrs:{id:"fw-screen-title"}}),Me(e,r)]),t("div",{className:"top-row second"},[y(r,"weather",{className:"chip-button weather",label:"\uD604\uC2E4 \uB0A0\uC528",children:[s.weather(),t("span",{text:"\uB0A0\uC528"})]}),y(r,"mail",{className:"icon-button mail",label:"\uC6B0\uD3B8\uD568",children:[s.mail()]})])]);let n=a.back;return t("header",{className:`top top-sub${a.resources?" with-resources":""}`},[t("div",{className:"top-row"},[n?t("button",{className:"back-button",attrs:{type:"button","aria-label":`${n.label}(\uC73C)\uB85C \uB3CC\uC544\uAC00\uAE30`},on:{click:()=>r.navigate(n.route)}},[s.back()]):t("span",{className:"back-spacer",attrs:{"aria-hidden":"true"}}),t("h1",{className:"sign",text:a.title,attrs:{id:"fw-screen-title"}}),a.resources?Me(e,r):null]),a.subtitle?t("p",{className:"ribbon",text:a.subtitle}):null])}function ft(e,r){return e.notice?t("div",{className:`notice ${e.notice.kind}`,attrs:{role:e.notice.kind==="error"?"alert":"status"}},[t("p",{text:e.notice.text}),t("button",{className:"notice-close",text:"\uB2EB\uAE30",attrs:{type:"button","aria-label":"\uC54C\uB9BC \uB2EB\uAE30"},on:{click:()=>r.dismissNotice()}})]):null}function v(e,r,a){return t("div",{className:`shell backdrop-${a.backdrop}${a.nav?" has-nav":""}${e.notice?" has-notice":""}`},[t("div",{className:"scroll"},[t("div",{className:"column"},[ze(e,r,a.top),a.hero??null,t("main",{className:"page",attrs:{"aria-labelledby":"fw-screen-title"}},a.body)])]),ft(e,r),a.nav?Ae(e,r):null,a.sheet??null])}function h(e,r,a={}){return t("section",{className:`card ${a.className??""}`.trim(),attrs:a.id?{"aria-labelledby":a.id}:{}},[e?t("h2",{className:"section-title",text:e,attrs:a.id?{id:a.id}:{}}):null,...r])}var X="/forest-workshop/p0",gt={pass:"\uD1B5\uACFC",fail:"\uC2E4\uD328",unavailable:"\uC0AC\uC6A9 \uBD88\uAC00"};function f(e,r={},a=[]){let n=document.createElement(e);r.className&&(n.className=r.className),r.text!==void 0&&(n.textContent=r.text);for(let[i,o]of Object.entries(r.attrs??{}))n.setAttribute(i,o);for(let i of a)i&&n.append(i);return n}var J=class{constructor(){I(this,"node",f("div",{className:"diagnostics"}));I(this,"started",!1);I(this,"status",{state:"loading"});I(this,"probe",null);I(this,"image",{state:"loading"});I(this,"uploading",!1);I(this,"uploadError",null);I(this,"pendingUpload",null)}start(){this.started||(this.started=!0,this.render(),this.loadStatus(),this.loadImage())}async loadStatus(){this.status={state:"loading"},this.render();try{this.status={state:"ready",value:await R().get(`${X}/status`)}}catch(r){this.status={state:"error",message:A(r,"\uD328\uD0A4\uC9C0 \uC0C1\uD0DC\uB97C \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.")}}this.render()}async loadImage(){this.image={state:"loading"},this.render();try{let r=await R().get(`${X}/image`);this.image={state:"ready",value:r.current}}catch(r){this.image={state:"error",message:A(r,"\uC800\uC7A5\uB41C \uADF8\uB9BC\uC744 \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.")}}this.render()}async runProbe(){if(this.probe?.state!=="loading"){this.probe={state:"loading"},this.render();try{let r=await R().post(`${X}/probe`);this.probe={state:"ready",value:r.checks}}catch(r){this.probe={state:"error",message:A(r,"\uC5F0\uACB0 \uC810\uAC80\uC744 \uC2E4\uD589\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.")}}this.render()}}async upload(r){if(this.uploading)return;let a=this.pendingUpload?.file===r?this.pendingUpload:{file:r,key:U()};this.pendingUpload=a,this.uploading=!0,this.uploadError=null,this.render();try{let n=new FormData;n.append("uploadKey",a.key),n.append("file",r,r.name);let i=await R().upload(`${X}/image`,n);this.image={state:"ready",value:i.image},this.pendingUpload=null}catch(n){this.uploadError=A(n,"\uADF8\uB9BC\uC744 \uC62C\uB9AC\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4. \uAE30\uC874 \uADF8\uB9BC\uC740 \uADF8\uB300\uB85C\uC785\uB2C8\uB2E4.")}finally{this.uploading=!1,this.render()}}render(){this.node.replaceChildren(f("p",{className:"muted",text:"\uC5D4\uC9C4 \uC5F0\uACB0\uACFC \uC8FC\uBBFC \uADF8\uB9BC \uC800\uC7A5 \uACBD\uB85C\uB97C \uD655\uC778\uD569\uB2C8\uB2E4. \uACB0\uACFC\uB294 \uC138\uACC4\uC5D0 \uC601\uD5A5\uC744 \uC8FC\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4."}),this.renderStatus(),this.renderProbe(),this.renderImage())}retryButton(r,a){let n=f("button",{className:"button secondary",text:r,attrs:{type:"button"}});return n.addEventListener("click",a),n}renderStatus(){let r=f("section",{className:"card",attrs:{"aria-labelledby":"fw-status"}},[f("h2",{text:"\uC5D4\uC9C4 \uC5F0\uACB0",attrs:{id:"fw-status"}})]);if(this.status.state==="loading")r.append(f("p",{className:"muted",text:"\uBD88\uB7EC\uC624\uB294 \uC911\u2026",attrs:{role:"status"}}));else if(this.status.state==="error")r.append(f("p",{className:"error",text:this.status.message,attrs:{role:"alert"}}),this.retryButton("\uB2E4\uC2DC \uC2DC\uB3C4",()=>{this.loadStatus()}));else{let{value:a}=this.status;r.append(f("p",{className:"muted",text:`\uD328\uD0A4\uC9C0 ${a.version} \xB7 \uB2E8\uACC4 ${a.stage}`}),f("ul",{className:"list"},a.host.map(n=>f("li",{className:"row"},[f("span",{className:"name",text:n.name}),f("span",{className:`badge ${n.available?"pass":n.required?"fail":"unavailable"}`,text:n.available?"\uC788\uC74C":n.required?"\uC5C6\uC74C (\uD544\uC218)":"\uC5C6\uC74C"})]))))}return r}renderProbe(){let r=f("button",{className:"button",text:this.probe?.state==="loading"?"\uC810\uAC80 \uC911\u2026":"\uC5F0\uACB0 \uC810\uAC80 \uC2E4\uD589",attrs:{type:"button"}});r.disabled=this.probe?.state==="loading",r.addEventListener("click",()=>{this.runProbe()});let a=f("section",{className:"card",attrs:{"aria-labelledby":"fw-probe"}},[f("h2",{text:"\uC800\uC7A5\xB7\uC790\uB8CC\xB7\uBAA8\uB378 \uC810\uAC80",attrs:{id:"fw-probe"}}),f("p",{className:"muted",text:"\uC784\uC2DC \uBB38\uC11C\uB97C \uC4F0\uACE0 \uC9C0\uC6C1\uB2C8\uB2E4. \uCE90\uB9AD\uD130\xB7\uD398\uB974\uC18C\uB098 \uC6D0\uBCF8\uC740 \uC77D\uAE30\uB9CC \uD558\uBA70, \uBAA8\uB378 \uC0DD\uC131 \uC694\uCCAD\uC740 \uBCF4\uB0B4\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4."}),r]);return!this.probe||this.probe.state==="loading"?a:this.probe.state==="error"?(a.append(f("p",{className:"error",text:this.probe.message,attrs:{role:"alert"}})),a):(a.append(f("ul",{className:"list",attrs:{"aria-live":"polite"}},this.probe.value.map(n=>f("li",{className:"row stacked"},[f("div",{className:"row-head"},[f("span",{className:"name",text:n.label}),f("span",{className:`badge ${n.status}`,text:gt[n.status]})]),f("span",{className:"detail",text:n.detail})])))),a)}renderImage(){let r=f("input",{className:"file",attrs:{type:"file",accept:"image/png,image/webp",id:"fw-file"}});r.disabled=this.uploading,r.addEventListener("change",()=>{let n=r.files?.[0];n&&this.upload(n)});let a=f("section",{className:"card",attrs:{"aria-labelledby":"fw-image"}},[f("h2",{text:"\uC8FC\uBBFC \uADF8\uB9BC \uC800\uC7A5 \uC810\uAC80",attrs:{id:"fw-image"}}),f("p",{className:"muted",text:"PNG \uB610\uB294 \uC815\uC801 WebP(\uCD5C\uB300 20MiB, 4096\xD74096)\uB97C \uACE0\uB974\uBA74 \uD22C\uBA85\uB3C4\uB97C \uC720\uC9C0\uD55C WebP \uD488\uC9C895\uB85C \uBC14\uAFD4 \uC804\uC5ED \uAC24\uB7EC\uB9AC\uC5D0 \uC800\uC7A5\uD569\uB2C8\uB2E4. PNG \uC6D0\uBCF8\uC740 \uBCF4\uAD00\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4."}),f("label",{className:"field-label",text:"\uADF8\uB9BC \uD30C\uC77C \uACE0\uB974\uAE30",attrs:{for:"fw-file"}}),r]);if(this.uploading&&a.append(f("p",{className:"muted",text:"\uBCC0\uD658\uD558\uACE0 \uC800\uC7A5\uD558\uB294 \uC911\u2026",attrs:{role:"status"}})),this.uploadError){a.append(f("p",{className:"error",text:this.uploadError,attrs:{role:"alert"}}));let n=this.pendingUpload;n&&!this.uploading&&a.append(this.retryButton("\uAC19\uC740 \uD30C\uC77C\uB85C \uB2E4\uC2DC \uC2DC\uB3C4",()=>{this.upload(n.file)}))}if(this.image.state==="loading")a.append(f("p",{className:"muted",text:"\uBD88\uB7EC\uC624\uB294 \uC911\u2026",attrs:{role:"status"}}));else if(this.image.state==="error")a.append(f("p",{className:"error",text:this.image.message,attrs:{role:"alert"}}),this.retryButton("\uB2E4\uC2DC \uBD88\uB7EC\uC624\uAE30",()=>{this.loadImage()}));else if(!this.image.value)a.append(f("p",{className:"empty",text:"\uC544\uC9C1 \uC800\uC7A5\uB41C \uADF8\uB9BC\uC774 \uC5C6\uC2B5\uB2C8\uB2E4."}));else{let n=this.image.value,i=f("img",{className:"preview",attrs:{src:`${n.url}${n.url.includes("?")?"&":"?"}v=${n.imageVersion}`,alt:"\uC800\uC7A5\uB41C \uC8FC\uBBFC \uADF8\uB9BC \uBBF8\uB9AC\uBCF4\uAE30",width:String(n.width),height:String(n.height)}});a.append(f("div",{className:"stage"},[i]),f("dl",{className:"facts"},[f("dt",{text:"\uCC38\uC870"}),f("dd",{text:n.reference}),f("dt",{text:"\uD06C\uAE30"}),f("dd",{text:`${n.width}\xD7${n.height}`}),f("dt",{text:"\uC6A9\uB7C9"}),f("dd",{text:`\uC785\uB825 ${ne(n.inputBytes)} \u2192 WebP ${ne(n.outputBytes)}`}),f("dt",{text:"\uD22C\uBA85\uB3C4"}),f("dd",{text:n.hasTransparency?"\uD22C\uBA85 \uC601\uC5ED \uC788\uC74C (\uC720\uC9C0\uB428)":"\uBD88\uD22C\uBA85 \uADF8\uB9BC"}),f("dt",{text:"\uBC84\uC804"}),f("dd",{text:String(n.imageVersion)})]))}return a}};var bt="http://www.w3.org/2000/svg";function Le(e){let r=document.createElementNS(bt,"svg");return r.setAttribute("viewBox","0 0 60 80"),r.setAttribute("aria-hidden","true"),r.setAttribute("class",e),r.innerHTML='<circle cx="30" cy="24" r="15"/><path d="M6 80c0-17 11-29 24-29s24 12 24 29z"/>',r}function Te(e,r){let a=e.image.current;return t("img",{className:r,attrs:{src:`${a.url}${a.url.includes("?")?"&":"?"}v=${encodeURIComponent(a.reference)}`,alt:"",width:String(a.width),height:String(a.height),decoding:"async",loading:"lazy",draggable:"false"}})}function F(e,r={}){let a=r.placement??e.image.placement,n=t("span",{className:"figure",attrs:{"aria-hidden":"true"}});if(!e.image.current)return n.append(t("span",{className:"figure-empty"},[Le("figure-silhouette"),t("span",{className:"figure-empty-text",text:"PNG \uB4F1\uB85D"})])),n;let i=t("span",{className:"figure-body"},[Te(e,"figure-image")]);if(i.style.height=`${a.scale*.9}%`,i.style.left=`${50+a.offsetX*.5}%`,n.append(i),r.marker){let o=t("span",{className:"figure-marker"},[s.leaf("icon tiny")]);o.style.bottom=`calc(${a.scale*.9}% + ${a.markerHeight*.4}%)`,o.style.left=`${50+a.offsetX*.5}%`,n.append(o)}return n}function V(e,r="small"){let a=t("span",{className:`avatar ${r}`,attrs:{"aria-hidden":"true"}});return e?.image.current?a.append(Te(e,"avatar-image")):(a.append(Le("avatar-silhouette")),e||a.append(t("span",{className:"avatar-unknown",text:"?"}))),a}var B={character:"\uCE90\uB9AD\uD130",persona:"\uD398\uB974\uC18C\uB098"};function E(e){return t("span",{className:`tag ${e.kind}`,text:B[e.kind]})}var ht="http://www.w3.org/2000/svg";function wt(){let e=document.createElementNS(ht,"svg");return e.setAttribute("viewBox","0 0 390 300"),e.setAttribute("preserveAspectRatio","xMidYMax slice"),e.setAttribute("aria-hidden","true"),e.setAttribute("class","scene-art"),e.innerHTML=`
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
    <g fill="#c9a0d8"><circle cx="70" cy="232" r="3"/><circle cx="360" cy="244" r="3"/></g>`,e}function yt(e){let r=e.progress.starterResidentId;return Object.values(e.residents).filter(a=>a.recruited).sort((a,n)=>+(n.residentId===r)-+(a.residentId===r)||a.registeredAt.localeCompare(n.registeredAt)).slice(0,2)}function Pe(e,r,a,n){if(r)return t("button",{className:`resident-spot filled ${e}`,attrs:{type:"button","aria-label":`${r.displayName} \uBCF4\uAE30`},on:{click:()=>n.openResidents(r.residentId)}},[F(r),t("span",{className:"spot-name",text:r.displayName})]);if(a.progress.starterResidentId===null&&e==="left"){let i=Object.keys(a.residents).length>0;return t("button",{className:`resident-spot invite ${e}`,attrs:{type:"button"},on:{click:()=>n.openRegister(i?3:1)}},[t("span",{className:"spot-shadow"}),t("span",{className:"spot-text",text:i?"\uC2DC\uC791 \uC8FC\uBBFC \uACE0\uB974\uAE30":"\uC8FC\uBBFC \uB9DE\uC774\uD558\uAE30"})])}return y(n,"invite",{className:`resident-spot ${e}`,label:"\uC8FC\uBBFC \uC790\uB9AC",children:[t("span",{className:"spot-shadow"}),t("span",{className:"spot-text",text:"\uC8FC\uBBFC"})]})}function je(e,r){let a=e.world?.state==="ready"?e.world.value.state:null,n=a?yt(a):[];return t("section",{className:"scene",attrs:{"aria-label":"\uACF5\uBC29 \uC7A5\uBA74"}},[wt(),a?t("div",{className:"scene-stage"},[Pe("left",n[0]??null,a,r),Pe("right",n[1]??null,a,r)]):null,n.length===0?t("p",{className:"scene-caption"},[s.leaf("icon tiny"),"\uC8FC\uBBFC\uC744 \uB9DE\uC774\uD558\uBA74 \uC774\uACF3\uC5D0 \uBAA8\uC5EC\uC694"]):null])}function vt(e,r){return e.items.find(a=>a.id===r)?.name??r}function Fe(e,r){let a=e.world?.state==="ready"?e.world.value:null,n=e.content;if(!a||!n||a.state.progress.starterKitClaimed||e.starterSheetHidden)return null;let i=!!e.busy["claim-starter-kit"],o=n.starterKit;return t("div",{className:"sheet-backdrop"},[t("section",{className:"sheet card",attrs:{role:"dialog","aria-modal":"true","aria-labelledby":"fw-starter"}},[t("h2",{className:"section-title",text:"\uACF5\uBC29 \uC2DC\uC791 \uAFB8\uB7EC\uBBF8",attrs:{id:"fw-starter"}}),t("p",{className:"muted",text:"\uCCAB \uCC44\uC9D1\uACFC \uAC00\uACF5\uC744 \uC2DC\uC791\uD560 \uC7AC\uB8CC\uC608\uC694. \uD55C \uBC88\uB9CC \uBC1B\uC744 \uC218 \uC788\uC5B4\uC694."}),t("ul",{className:"kit"},[t("li",{className:"kit-item"},[t("span",{className:"coin"}),t("span",{text:"\uACE8\uB4DC"}),t("strong",{text:o.gold.toLocaleString("ko-KR")})]),...Object.entries(o.items).map(([l,d])=>t("li",{className:"kit-item"},[s.leaf("icon"),t("span",{text:vt(n,l)}),t("strong",{text:d.toLocaleString("ko-KR")})]))]),x(i?"\uBC1B\uB294 \uC911\u2026":"\uBC1B\uAE30",()=>{r.runCommand("claim-starter-kit","onboarding.claimStarterKit")},{disabled:i,attrs:{"data-wide":""}}),x("\uB098\uC911\uC5D0",()=>r.hideStarterSheet(),{variant:"secondary",attrs:{"data-wide":""}})])])}function xt(e){return h(null,[j(e,"work-report",[t("h2",{className:"report-title",text:"\uACF5\uBC29 \uC18C\uC2DD"}),t("div",{className:"report-body"},[t("div",{className:"report-items"},[t("div",{className:"report-slot"},[t("span",{className:"slot-art"}),t("span",{className:"slot-name",text:"\uC785\uACE0"}),t("strong",{text:"\u2013"})]),t("div",{className:"report-slot"},[t("span",{className:"slot-art"}),t("span",{className:"slot-name",text:"\uC785\uACE0"}),t("strong",{text:"\u2013"})])]),t("div",{className:"report-actions"},[t("span",{className:"button report-button",attrs:{"aria-hidden":"true"}},["\uC791\uC5C5 \uBCF4\uACE0",s.chevron("icon")]),t("span",{className:"report-caption"},[s.leaf("icon tiny"),"\uC790\uB3D9 \uC785\uACE0"])])])])],{className:"report-card"})}function kt(e){return y(e,"offline-cap",{className:"strip offline",label:"\uBBF8\uC811\uC18D \uB204\uC801 \uC9C4\uD589",children:[s.clock(),t("span",{text:"\uBBF8\uC811\uC18D \uB204\uC801 \u2013\uC2DC\uAC04 / \uCD5C\uB300 72\uC2DC\uAC04"}),s.info("icon muted-icon")]})}function Nt(e){return y(e,"stories",{className:"strip story",label:"\uC8FC\uBBFC \uC774\uC57C\uAE30",children:[t("span",{className:"story-art",attrs:{"aria-hidden":"true"}},[s.book("icon")]),t("span",{className:"story-text"},[t("strong",{text:"\uC8FC\uBBFC \uC774\uC57C\uAE30"}),t("span",{text:"\uB3C4\uCC29\uD55C \uC774\uC57C\uAE30\uAC00 \uC5EC\uAE30\uC5D0 \uBCF4\uC5EC\uC694"})]),t("span",{className:"round-arrow"},[s.chevron()])]})}function Be(e,r){let a=e.world;return!a||a.state!=="ready"?v(e,r,{top:{kind:"home"},backdrop:"forest",nav:!1,body:[a?.state==="error"?h(null,[P(a.message),x("\uC138\uACC4 \uBAA9\uB85D\uC73C\uB85C",()=>r.navigate("worlds"),{variant:"secondary"})]):N("\uC138\uACC4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026")]}):v(e,r,{top:{kind:"home"},backdrop:"forest",hero:je(e,r),body:[xt(r),kt(r),Nt(r)],nav:!0,sheet:Fe(e,r)})}var Ee,oe=!1;function Q(e){let r=()=>{clearTimeout(Ee),Ee=setTimeout(()=>{!oe&&a.isConnected&&e.onSearch(a.value)},300)},a=t("input",{className:"search-input",attrs:{id:e.id,type:"search",placeholder:e.placeholder,value:e.value,autocomplete:"off"},on:{compositionstart:()=>oe=!0,compositionend:()=>{oe=!1,r()},input:()=>r()}});return t("label",{className:"search-field",attrs:{for:e.id}},[s.search("icon"),t("span",{className:"visually-hidden",text:e.placeholder}),a])}function se(e){let r=(a,n)=>t("li",{className:`step-item${e===a?" current":e>a?" done":""}`,attrs:e===a?{"aria-current":"step"}:{}},[t("span",{className:"step-number",text:String(a)}),t("span",{className:"step-label",text:n})]);return t("ol",{className:"steps card",attrs:{"aria-label":"\uC8FC\uBBFC \uB4F1\uB85D \uB2E8\uACC4"}},[r(1,"\uC790\uB8CC \uC120\uD0DD"),t("li",{className:"step-arrow",attrs:{"aria-hidden":"true"},text:"\u2192"}),r(2,"\uC7AC\uAD6C\uCD95"),t("li",{className:"step-arrow",attrs:{"aria-hidden":"true"},text:"\u2192"}),r(3,"\uC2DC\uC791 \uC8FC\uBBFC")])}function St(e,r){if(e.sources.state==="loading")return N("\uCE90\uB9AD\uD130\xB7\uD398\uB974\uC18C\uB098\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026");if(e.sources.state==="error")return t("div",{},[P(e.sources.message),x("\uB2E4\uC2DC \uBD88\uB7EC\uC624\uAE30",()=>{r.loadSources()},{variant:"secondary"})]);let a=e.query.trim().toLowerCase(),n=e.sources.value.filter(i=>i.kind===e.kindTab).filter(i=>!a||i.name.toLowerCase().includes(a));return n.length===0?t("p",{className:"empty",text:a?"\uC774\uB984\uC774 \uB9DE\uB294 \uC790\uB8CC\uAC00 \uC5C6\uC5B4\uC694.":`${B[e.kindTab]}\uAC00 \uC544\uC9C1 \uC5C6\uC5B4\uC694. \uC5D4\uC9C4\uC758 \uC11C\uC7AC\uC5D0\uC11C \uBA3C\uC800 \uB9CC\uB4E4\uC5B4 \uC8FC\uC138\uC694.`}):t("ul",{className:"source-list"},n.map(i=>t("li",{},[t("button",{className:"menu-row source-row",attrs:{type:"button"},disabled:i.residentId!==null,on:{click:()=>{r.chooseSource(i)}}},[t("span",{className:"menu-icon light"},[s.document()]),t("span",{className:"menu-text"},[t("span",{className:"menu-title",text:i.name}),t("span",{className:"menu-detail",text:i.residentId?"\uC774\uBBF8 \uC774 \uC138\uACC4\uC758 \uC8FC\uBBFC\uC774\uC5D0\uC694":i.summary||"\uC124\uBA85 \uC5C6\uC74C"})]),t("span",{className:"menu-chevron"},[i.residentId?s.check():s.chevron()])])])))}function Rt(e,r){return[h("\uC790\uB8CC \uC120\uD0DD",[t("p",{className:"muted",text:"\uC8FC\uBBFC\uC73C\uB85C \uB9DE\uC774\uD560 \uCE90\uB9AD\uD130\uB098 \uD398\uB974\uC18C\uB098\uB97C \uACE8\uB77C \uC8FC\uC138\uC694. \uC6D0\uBCF8\uC740 \uC77D\uAE30\uB9CC \uD558\uACE0 \uBC14\uAFB8\uC9C0 \uC54A\uC544\uC694."}),t("div",{className:"pill-tabs two",attrs:{role:"tablist","aria-label":"\uC790\uB8CC \uC885\uB958"}},["character","persona"].map(a=>t("button",{className:`pill-tab${e.kindTab===a?" current":""}`,text:B[a],attrs:{type:"button",role:"tab","aria-selected":e.kindTab===a?"true":"false"},on:{click:()=>r.setRegisterKind(a)}}))),Q({id:"fw-source-search",value:e.query,placeholder:"\uC774\uB984\uC73C\uB85C \uCC3E\uAE30",onSearch:a=>r.setRegisterQuery(a)}),St(e,r)],{id:"fw-source-title"})]}function It(e){if(!e||e.state==="loading")return N("\uC6D0\uB798 \uC124\uC815\uC744 \uC77D\uB294 \uC911\u2026");if(e.state==="error")return P(e.message);let r=e.value;return t("div",{className:"readonly-box"},[t("p",{text:r.summary||"\uC6D0\uBCF8\uC5D0 \uC801\uD78C \uC124\uBA85\uC774 \uC5C6\uC5B4\uC694."})])}function Ct(e,r,a){let n=t("input",{className:"visually-hidden",attrs:{id:"fw-register-image",type:"file",accept:"image/png,image/webp"},on:{change:()=>{let o=n.files?.[0];if(n.value="",!!o){if(o.size>a){r.notify(`\uD30C\uC77C\uC774 ${Math.round(a/1024/1024)}MiB\uB97C \uB118\uC5B4\uC694. \uB2E4\uB978 \uADF8\uB9BC\uC744 \uACE8\uB77C \uC8FC\uC138\uC694.`,"error");return}r.pickPendingImage(o)}}}}),i=e.pendingImage;return t("div",{className:"image-drop"},[n,t("label",{className:"drop-zone checker",attrs:{for:"fw-register-image"}},[i?t("img",{className:"drop-preview",attrs:{src:i.previewUrl,alt:""}}):s.addImage("icon drop-icon"),t("span",{className:"drop-text"},[t("strong",{text:i?i.file.name:"\uC8FC\uBBFC \uADF8\uB9BC \uC9C1\uC811 \uB4F1\uB85D"}),t("span",{text:i?`${Math.max(1,Math.round(i.file.size/1024))} KB \xB7 \uB4F1\uB85D\uD558\uBA74 WebP\uB85C \uC800\uC7A5\uD574\uC694`:"PNG \xB7 WebP \u2192 WebP \uC800\uC7A5"})])]),i?x("\uACE0\uB978 \uADF8\uB9BC \uBE7C\uAE30",()=>r.clearPendingImage(),{variant:"secondary"}):null])}function $t(e,r,a){let n=e.selected,i=r.content?.residents.worldSettingMax??200,o=!!r.busy["rebuild-suggestion"],l=!!r.busy[`register:${n.kind}:${n.id}`],d=Object.keys(r.busy).some(M=>M.startsWith("image-upload:")&&r.busy[M]),m=l||d,p=t("span",{className:"counter-text",text:`${e.draft.length} / ${i}`,attrs:{id:"fw-draft-count"}}),b=t("textarea",{className:"textarea",attrs:{id:"fw-world-setting",maxlength:String(i),rows:"4",placeholder:"\uC774 \uC138\uACC4\uC5D0\uC11C \uC5B4\uB5A4 \uC8FC\uBBFC\uC778\uC9C0 \uC801\uC5B4 \uC8FC\uC138\uC694.","aria-describedby":"fw-draft-count"},on:{input:()=>{p.textContent=`${b.value.length} / ${i}`,a.setDraft(b.value)}}});b.value=e.draft;let S=e.preview?.state==="ready";return[t("section",{className:"card selected-source"},[t("button",{className:"menu-row quiet",attrs:{type:"button"},on:{click:()=>a.backToSources()}},[t("span",{className:"menu-icon light"},[s.document()]),t("span",{className:"menu-text"},[t("small",{className:"muted",text:"\uC120\uD0DD\uD55C \uC790\uB8CC"}),t("span",{className:"menu-title",text:`${B[n.kind]} \xB7 ${n.name}`})]),t("span",{className:"menu-chevron"},[s.chevron()])])]),t("section",{className:"card rebuild",attrs:{"aria-labelledby":"fw-original"}},[t("h2",{className:"section-title doc",text:"\uC6D0\uB798 \uC124\uC815",attrs:{id:"fw-original"}}),It(e.preview),t("label",{className:"section-title",text:"\uACF5\uBC29 \uC138\uACC4 \uC124\uC815",attrs:{for:"fw-world-setting"}}),t("div",{className:"textarea-wrap"},[b,p]),t("div",{className:"rule-actions even"},[t("button",{className:"button",attrs:{type:"button"},on:{click:()=>{b.focus(),b.setSelectionRange(b.value.length,b.value.length)}}},[s.pencil("icon"),t("span",{text:"\uC218\uC815"})]),t("button",{className:"button secondary",attrs:{type:"button"},disabled:o||!S,on:{click:()=>{a.suggestSetting()}}},[s.sparkle("icon"),t("span",{text:o?"\uC81C\uC548 \uBC1B\uB294 \uC911\u2026":"\uB2E4\uC2DC \uC81C\uC548"})])]),t("p",{className:"hint",text:"\uB2E4\uC2DC \uC81C\uC548\uC740 \uC5D4\uC9C4\uC758 \uAE30\uBCF8 \uC5B8\uC5B4 \uBAA8\uB378\uC5D0 \uD55C \uBC88 \uC694\uCCAD\uD574\uC694. \uD655\uC815\uD558\uAE30 \uC804\uC5D0\uB294 \uC800\uC7A5\uB418\uC9C0 \uC54A\uC544\uC694."})]),h("\uC8FC\uBBFC \uADF8\uB9BC \uC9C1\uC811 \uB4F1\uB85D",[Ct(e,a,r.content?.residents.maxImageBytes??20*1024*1024),t("p",{className:"hint center"},[s.info("icon"),"\uC6D0\uBCF8 \uD504\uB85C\uD544\uC740 \uBC14\uB00C\uC9C0 \uC54A\uC544\uC694."])],{id:"fw-register-image-title"}),t("button",{className:"button big-action",attrs:{type:"button","data-wide":""},disabled:m||!S,on:{click:()=>{a.confirmRegister(!0,(M,L)=>a.uploadResidentImage(M,L))}}},[s.leaf("icon"),t("span",{text:l?"\uB4F1\uB85D\uD558\uB294 \uC911\u2026":d?"\uADF8\uB9BC \uC800\uC7A5 \uC911\u2026":"\uC7AC\uAD6C\uCD95 \uD655\uC815"}),s.chevron("icon")]),t("button",{className:"button secondary",attrs:{type:"button","data-wide":""},disabled:m||!S,on:{click:()=>{a.confirmRegister(!1,async()=>{})}}},[s.clock("icon"),t("span",{text:"\uB098\uC911\uC5D0 \uADF8\uB9BC \uB4F1\uB85D"})])]}function At(e,r,a,n){let i=Object.values(r.state.residents),o=!!a.busy["choose-starter"];return[h("\uC2DC\uC791 \uC8FC\uBBFC",[t("p",{className:"muted",text:"\uACF5\uBC29\uC5D0\uC11C \uD568\uAED8 \uC2DC\uC791\uD560 \uC8FC\uBBFC \uD55C \uBA85\uC744 \uACE8\uB77C \uC8FC\uC138\uC694. \uB2E4\uB978 \uC8FC\uBBFC\uC740 \uCD08\uB300\uB85C \uB9DE\uC774\uD574\uC694."}),t("ul",{className:"starter-list",attrs:{role:"radiogroup","aria-label":"\uC2DC\uC791 \uC8FC\uBBFC"}},i.map(l=>t("li",{},[t("button",{className:`starter-option${e.starterChoice===l.residentId?" chosen":""}`,attrs:{type:"button",role:"radio","aria-checked":e.starterChoice===l.residentId?"true":"false"},on:{click:()=>n.setStarterChoice(l.residentId)}},[t("span",{className:"starter-stage"},[F(l)]),t("strong",{text:l.displayName}),E(l)])])))],{id:"fw-starter-title"}),t("button",{className:"button big-action",attrs:{type:"button","data-wide":""},disabled:o||!e.starterChoice,on:{click:()=>{n.confirmStarter()}}},[s.house("icon"),t("span",{text:o?"\uB9DE\uC774\uD558\uB294 \uC911\u2026":"\uC774 \uC8FC\uBBFC\uACFC \uC2DC\uC791\uD558\uAE30"})]),x("\uC8FC\uBBFC \uB354 \uB4F1\uB85D\uD558\uAE30",()=>n.registerAnother(),{variant:"secondary",attrs:{"data-wide":""}})]}function We(e,r){let a=e.world?.state==="ready"?e.world.value:null,n=e.register,i;return!a||!n?i=[N("\uC138\uACC4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026")]:n.step===3?i=[se(3),...At(n,a,e,r)]:n.step===2&&n.selected?i=[se(2),...$t(n,e,r)]:i=[se(1),...Rt(n,r)],v(e,r,{top:{kind:"sub",title:"\uC8FC\uBBFC \uB4F1\uB85D",back:{route:"residents",label:"\uC8FC\uBBFC"},resources:!1},backdrop:"wood",body:i,nav:!1})}var Oe="ABCDEFGHIJKLMNOPQRSTUVWXYZ";function Mt(e,r){return[...e?.relationStages??[]].reverse().find(n=>r>=n.from)?.label??"\u2013"}function Ve(e,r,a){let n=r.kind==="character"?e.personaResidentId:e.characterResidentId;return a.state.residents[n]??null}function zt(e,r){let a=r.map((n,i)=>`A\u2013${Oe[i+1]??"?"}`).join(" \xB7 ");return h(null,[t("div",{className:"relation-hero"},[V(e,"large"),t("span",{className:"hero-label",text:`\uACF5\uC720 \uC8FC\uBBFC \xB7 ${e.displayName}`}),t("strong",{className:"hero-pairs",text:r.length?a:"\uC544\uC9C1 \uD398\uC5B4\uAC00 \uC5C6\uC5B4\uC694"}),t("p",{className:"hero-note",text:r.length>1?"\uB450 \uAD00\uACC4\uB294 \uAC19\uC740 \uC138\uACC4\uC5D0\uC11C \uC774\uC5B4\uC838\uC694":r.length===1?"\uAC19\uC740 \uC138\uACC4\uC5D0\uC11C \uC774\uC5B4\uC9C0\uB294 \uAD00\uACC4\uC608\uC694":`${B[e.kind==="character"?"persona":"character"]} \uC8FC\uBBFC\uACFC \uD398\uC5B4\uB97C \uB9CC\uB4E4 \uC218 \uC788\uC5B4\uC694`})])],{className:"hero-card"})}function Lt(e,r,a,n,i,o){let l=Ve(e,a,n),d=i.relationsEditing,m=!!i.busy[`pair-archive:${e.pairId}`];return t("li",{className:"pair-row card"},[t("div",{className:"pair-faces"},[t("span",{className:"pair-letters"},[t("span",{className:"letter",text:"A"}),"\xD7",t("span",{className:"letter",text:Oe[r+1]??"?"})]),t("span",{className:"faces"},[V(a),t("span",{className:"times",text:"\xD7"}),V(l)]),t("span",{className:"partner-name",text:l?.displayName??"\uC54C \uC218 \uC5C6\uB294 \uC8FC\uBBFC"})]),t("div",{className:"pair-info"},[t("div",{className:"relation-now"},[t("small",{text:"\uD604\uC7AC \uAD00\uACC4"}),t("strong",{text:Mt(i.content,e.familiarity)})]),t("p",{className:"recent"},[t("span",{className:"recent-label",text:"\uCD5C\uADFC \uC0AC\uAC74"}),t("span",{text:e.lastEvent?.summary??"\uC544\uC9C1 \uC5C6\uC5B4\uC694"})]),d?t("div",{className:"pair-actions"},[x(m?"\uBCF4\uAD00 \uC911\u2026":"\uBCF4\uAD00",()=>{o.archivePair(e.pairId)},{variant:"secondary",disabled:m})]):t("div",{className:"pair-actions"},[y(o,"pair-memory",{className:"outline-button",label:"\uAE30\uC5B5 \uBCF4\uAE30",children:[s.book("icon"),t("span",{text:"\uAE30\uC5B5 \uBCF4\uAE30"})]}),y(o,"pair-guidelines",{className:"outline-button",label:"\uC9C0\uCE68 \uAD00\uB9AC",children:[s.gear("icon"),t("span",{text:"\uC9C0\uCE68 \uAD00\uB9AC"})]})])])])}function Tt(e,r,a,n,i){return e.length===0?null:h("\uBCF4\uAD00\uD55C \uD398\uC5B4",[t("ul",{className:"archived-list"},e.map(o=>{let l=Ve(o,r,a),d=!!n.busy[`pair-restore:${o.pairId}`];return t("li",{className:"archived-row"},[V(l),t("span",{className:"archived-name",text:`${r.displayName} \xD7 ${l?.displayName??"?"}`}),x(d?"\uB418\uB3CC\uB9AC\uB294 \uC911\u2026":"\uB418\uB3CC\uB9AC\uAE30",()=>{i.restorePair(o.pairId)},{variant:"secondary",disabled:d})])}))],{id:"fw-archived"})}function Pt(e,r,a,n){let i=e.kind==="character"?"persona":"character",o=new Set(Object.values(r.state.pairs).filter(d=>d.characterResidentId===e.residentId||d.personaResidentId===e.residentId).map(d=>e.kind==="character"?d.personaResidentId:d.characterResidentId)),l=Object.values(r.state.residents).filter(d=>d.kind===i);return t("div",{className:"sheet-backdrop"},[t("section",{className:"sheet card",attrs:{role:"dialog","aria-modal":"true","aria-labelledby":"fw-pair-add"}},[t("h2",{className:"section-title",text:"\uD398\uC5B4 \uCD94\uAC00",attrs:{id:"fw-pair-add"}}),t("p",{className:"muted",text:`${e.displayName}\uC640(\uACFC) \uC774\uC5B4\uC9C8 ${B[i]} \uC8FC\uBBFC\uC744 \uACE8\uB77C \uC8FC\uC138\uC694. \uC9C0\uB09C \uAE30\uC5B5\uC774 \uC0C8\uB85C \uC0DD\uAE30\uC9C0\uB294 \uC54A\uC544\uC694.`}),l.length===0?t("p",{className:"empty",text:`${B[i]} \uC8FC\uBBFC\uC774 \uC544\uC9C1 \uC5C6\uC5B4\uC694. \uC8FC\uBBFC \uBD88\uB7EC\uC624\uAE30\uC5D0\uC11C \uBA3C\uC800 \uB4F1\uB85D\uD574 \uC8FC\uC138\uC694.`}):t("ul",{className:"candidate-list"},l.map(d=>{let m=o.has(d.residentId),p=e.kind==="character"?`pair-add:${e.residentId}:${d.residentId}`:`pair-add:${d.residentId}:${e.residentId}`;return t("li",{},[t("button",{className:"candidate",attrs:{type:"button"},disabled:m||!!a.busy[p],on:{click:()=>{n.addPair(e.residentId,d.residentId)}}},[V(d),t("span",{className:"candidate-name",text:d.displayName}),E(d),t("span",{className:"candidate-state",text:m?"\uC774\uBBF8 \uD398\uC5B4":a.busy[p]?"\uB9CC\uB4DC\uB294 \uC911\u2026":"\uACE0\uB974\uAE30"})])])})),x("\uB2EB\uAE30",()=>n.closeSheet(),{variant:"secondary",attrs:{"data-wide":""}})])])}function De(e,r){let a=e.world?.state==="ready"?e.world.value:null,n=a?a.state.residents[e.focusResidentId??""]??null:null,i={top:{kind:"sub",title:"\uAD00\uACC4",subtitle:"\uAC19\uC740 \uC138\uACC4\uC5D0\uC11C \uC774\uC5B4\uC9C0\uB294 \uAD00\uACC4",back:{route:"residents",label:"\uC8FC\uBBFC"},resources:!1},backdrop:"forest",nav:!0};if(!a||!n)return v(e,r,{...i,body:[N(a?"\uC8FC\uBBFC\uC744 \uACE0\uB978 \uB4A4 \uAD00\uACC4\uB97C \uC5F4\uC5B4 \uC8FC\uC138\uC694.":"\uC138\uACC4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026")]});let o=Object.values(a.state.pairs).filter(d=>d.characterResidentId===n.residentId||d.personaResidentId===n.residentId).sort((d,m)=>d.createdAt.localeCompare(m.createdAt)),l=o.filter(d=>!d.archived);return v(e,r,{...i,body:[zt(n,l),t("ul",{className:"pair-list"},l.map((d,m)=>Lt(d,m,n,a,e,r))),t("p",{className:"notice-strip"},[t("span",{className:"bang",text:"!"}),"\uD398\uC5B4 \uC9C0\uC815\uC740 \uC5F0\uC778 \uC120\uC5B8\uC774 \uC544\uB2C8\uC5D0\uC694."]),t("div",{className:"rule-actions"},[t("button",{className:"button wide-main",attrs:{type:"button"},on:{click:()=>r.openSheet({kind:"pair-add",residentId:n.residentId})}},[s.people("icon"),t("span",{text:"\uD398\uC5B4 \uCD94\uAC00"})]),t("button",{className:`button secondary${e.relationsEditing?" pressed":""}`,attrs:{type:"button","aria-pressed":e.relationsEditing?"true":"false"},on:{click:()=>r.toggleRelationsEditing()}},[s.archive("icon"),t("span",{text:e.relationsEditing?"\uBCC0\uACBD \uB05D\uB0B4\uAE30":"\uBCC0\uACBD \xB7 \uBCF4\uAD00"})])]),e.relationsEditing?Tt(o.filter(d=>d.archived),n,a,e,r):null],sheet:e.sheet?.kind==="pair-add"?Pt(n,a,e,r):null})}function He(e){return`${Math.max(1,Math.round(e/1024)).toLocaleString("ko-KR")} KB`}function le(e,r,a,n,i,o,l){let d=`fw-placement-${e}`,m=t("span",{className:"slider-value",text:l(n)}),p=t("input",{className:"slider",attrs:{id:d,type:"range",min:String(i.min),max:String(i.max),step:"1",value:String(n),"aria-valuetext":l(n)},on:{input:()=>m.textContent=l(Number(p.value)),change:()=>o.setPlacementDraft({[e]:Number(p.value)})}});return t("div",{className:"setting-row slider-row"},[r("icon"),t("label",{className:"setting-label",text:a,attrs:{for:d}}),p,m])}function jt(e,r,a){let n=!!r.busy[`image-restore:${e.residentId}`],i=o=>t("li",{className:"history-item"},[t("span",{className:"history-thumb checker"},[t("img",{attrs:{src:o.url,alt:""}})]),t("span",{className:"menu-text"},[t("span",{className:"menu-title",text:o.fileName||"\uC774\uC804 \uADF8\uB9BC"}),t("span",{className:"menu-detail",text:`${o.width} \xD7 ${o.height} \xB7 ${He(o.bytes)}`})]),x(n?"\uB418\uB3CC\uB9AC\uB294 \uC911\u2026":"\uC774 \uADF8\uB9BC\uC73C\uB85C",()=>{a.restoreResidentImage(e.residentId,o.reference)},{disabled:n})]);return t("div",{className:"sheet-backdrop"},[t("section",{className:"sheet card",attrs:{role:"dialog","aria-modal":"true","aria-labelledby":"fw-image-history"}},[t("h2",{className:"section-title",text:"\uC774\uC804 \uADF8\uB9BC",attrs:{id:"fw-image-history"}}),e.image.history.length?t("ul",{className:"history-list"},e.image.history.map(i)):t("p",{className:"empty",text:"\uB418\uB3CC\uB9B4 \uC774\uC804 \uADF8\uB9BC\uC774 \uC5C6\uC5B4\uC694."}),t("p",{className:"hint",text:"\uCD5C\uADFC 3\uC7A5\uAE4C\uC9C0 \uBCF4\uAD00\uD574\uC694. \uC9C0\uB09C \uC774\uC57C\uAE30 \uB2E4\uC2DC\uBCF4\uAE30\uC5D0\uB3C4 \uC9C0\uAE08 \uADF8\uB9BC\uC774 \uC4F0\uC5EC\uC694."}),x("\uB2EB\uAE30",()=>a.closeSheet(),{variant:"secondary",attrs:{"data-wide":""}})])])}function Ft(e,r,a){let n=r.content?.residents.placement,i=r.placementDraft??e.image.placement,o=e.image.current,l=!!r.busy[`image-upload:${e.residentId}`],d=!!r.busy[`placement:${e.residentId}`],m=JSON.stringify(i)!==JSON.stringify(e.image.placement),p=t("input",{className:"visually-hidden",attrs:{id:"fw-image-file",type:"file",accept:"image/png,image/webp"},disabled:l,on:{change:()=>{let S=p.files?.[0];p.value="",S&&a.uploadResidentImage(e.residentId,S)}}}),b=S=>S>0?`+${S}`:String(S);return[t("section",{className:"card image-card"},[t("p",{className:"target-ribbon"},[t("span",{className:"muted",text:"\uB300\uC0C1"}),s.leaf("icon"),t("strong",{text:e.displayName})]),t("div",{className:"image-stage checker"},[F(e,{placement:i,marker:!0})]),t("div",{className:"file-facts"},o?[t("strong",{text:o.fileName||"resident.webp"}),t("span",{text:`${o.width} \xD7 ${o.height} / ${He(o.bytes)}`})]:[t("strong",{text:"\uC544\uC9C1 \uADF8\uB9BC\uC774 \uC5C6\uC5B4\uC694"}),t("span",{className:"muted",text:"\uADF8\uB9BC\uC774 \uC5C6\uC5B4\uB3C4 \uBAA8\uB4E0 \uAE30\uB2A5\uC744 \uC4F8 \uC218 \uC788\uC5B4\uC694"})]),p,t("label",{className:`button big-action file-button${l?" busy":""}`,attrs:{for:"fw-image-file","data-wide":"","aria-disabled":l?"true":"false"}},[t("span",{text:l?"WebP\uB85C \uC800\uC7A5\uD558\uB294 \uC911\u2026":o?"\uD30C\uC77C \uC120\uD0DD \xB7 \uAD50\uCCB4":"\uD30C\uC77C \uC120\uD0DD"})]),t("ul",{className:"rules"},[t("li",{text:"PNG \xB7 \uC815\uC801 WebP \uC5C5\uB85C\uB4DC (20MiB \xB7 4096px\uAE4C\uC9C0)"}),t("li",{text:"\uD22C\uBA85\uB3C4 \uC720\uC9C0 \xB7 WebP \uD488\uC9C8 95 \uC800\uC7A5"}),t("li",{text:"PNG \uC6D0\uBCF8\uC740 \uB530\uB85C \uBCF4\uAD00\uD558\uC9C0 \uC54A\uC544\uC694."})]),n?t("div",{className:"setting-block sliders"},[le("scale",s.zoom,"\uADF8\uB9BC \uD06C\uAE30",i.scale,n.scale,a,S=>`${S}%`),le("offsetX",s.arrows,"\uC88C\uC6B0 \uC704\uCE58",i.offsetX,n.offsetX,a,b),le("markerHeight",s.updown,"\uAE30\uD638 \uB192\uC774",i.markerHeight,n.markerHeight,a,b)]):null,t("button",{className:"button big-action",attrs:{type:"button","data-wide":""},disabled:d||!m,on:{click:()=>{a.applyPlacement(e.residentId)}}},[t("span",{text:d?"\uC801\uC6A9\uD558\uB294 \uC911\u2026":m?"\uC801\uC6A9":"\uC801\uC6A9\uB428"})]),t("div",{className:"rule-actions even"},[t("button",{className:"button secondary",attrs:{type:"button"},on:{click:()=>a.resetPlacementDraft()}},[s.restore("icon"),t("span",{text:"\uAE30\uBCF8 \uBC30\uCE58"})]),t("button",{className:"button secondary",attrs:{type:"button"},disabled:e.image.history.length===0,on:{click:()=>a.openSheet({kind:"image-history",residentId:e.residentId})}},[s.image("icon"),t("span",{text:`\uC774\uC804 \uADF8\uB9BC${e.image.history.length?` ${e.image.history.length}`:""}`})])])])]}function Ke(e,r){let a=e.world?.state==="ready"?e.world.value:null,n=a?a.state.residents[e.focusResidentId??""]??null:null;return v(e,r,{top:{kind:"sub",title:"\uC8FC\uBBFC \uADF8\uB9BC",back:{route:"residents",label:"\uC8FC\uBBFC"},resources:!1},backdrop:"wood",body:n?Ft(n,e,r):[N(a?"\uC8FC\uBBFC\uC744 \uACE0\uB978 \uB4A4 \uC8FC\uBBFC \uADF8\uB9BC\uC744 \uC5F4\uC5B4 \uC8FC\uC138\uC694.":"\uC138\uACC4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026")],nav:!0,sheet:n&&e.sheet?.kind==="image-history"?jt(n,e,r):null})}var Bt={registered:"\uB4F1\uB85D",setting:"\uC138\uACC4 \uC124\uC815 \uC218\uC815",name:"\uC774\uB984 \uC218\uC815",recruited:"\uC601\uC785",image:"\uADF8\uB9BC \uB4F1\uB85D",image_restored:"\uC774\uC804 \uADF8\uB9BC\uC73C\uB85C",image_history_cleared:"\uADF8\uB9BC \uC774\uB825 \uC815\uB9AC",placement:"\uBC30\uCE58 \uBCC0\uACBD"};function Ue(e){let r=new Date(e);return Number.isNaN(r.getTime())?e:new Intl.DateTimeFormat("ko-KR",{dateStyle:"medium",timeStyle:"short"}).format(r)}function de(e,r){return r?t("div",{className:"source-field"},[t("strong",{text:e}),t("p",{text:r})]):null}function Et(e){return t("li",{className:"change-row"},[t("span",{className:"change-kind",text:Bt[e.kind]??e.kind}),t("span",{className:"change-detail",text:e.detail}),t("time",{className:"change-time",text:Ue(e.at),attrs:{datetime:e.at}})])}function qe(e,r,a,n){let i=e.state.residents[n];if(!i)return null;let o=r.content?.residents.worldSettingMax??200,l=!!r.busy[`resident-setting:${n}`],d=t("span",{className:"counter-text",text:`${i.worldSetting.length} / ${o}`}),m=t("textarea",{className:"textarea",attrs:{id:"fw-profile-setting",maxlength:String(o),rows:"4","aria-describedby":"fw-profile-count"},on:{input:()=>d.textContent=`${m.value.length} / ${o}`}});m.value=i.worldSetting,d.id="fw-profile-count";let{source:p}=i;return t("div",{className:"sheet-backdrop"},[t("section",{className:"sheet card",attrs:{role:"dialog","aria-modal":"true","aria-labelledby":"fw-profile"}},[t("div",{className:"sheet-head"},[t("h2",{className:"section-title",text:`${i.displayName} \uD504\uB85C\uD544`,attrs:{id:"fw-profile"}}),E(i)]),t("div",{className:"compare"},[t("div",{className:"compare-box source"},[t("p",{className:"compare-title"},[s.document("icon"),"\uC6D0\uB798 \uC124\uC815"]),t("p",{className:"muted",text:`${p.name} \xB7 ${Ue(p.takenAt)}\uC5D0 \uC77D\uC74C \xB7 \uC6D0\uBCF8\uC740 \uBC14\uB00C\uC9C0 \uC54A\uC544\uC694`}),de("\uC124\uBA85",p.description),de("\uC131\uACA9",p.personality),de("\uC0C1\uD669",p.scenario),!p.description&&!p.personality&&!p.scenario?t("p",{className:"muted",text:"\uC6D0\uBCF8\uC5D0 \uC801\uD78C \uC124\uBA85\uC774 \uC5C6\uC5B4\uC694."}):null]),t("form",{className:"compare-box world",on:{submit:b=>{b.preventDefault(),m.value.trim()&&m.value!==i.worldSetting&&a.updateWorldSetting(n,m.value)}}},[t("label",{className:"compare-title",attrs:{for:"fw-profile-setting"}},[s.leaf("icon"),"\uACF5\uBC29 \uC138\uACC4 \uC124\uC815"]),m,d,t("button",{className:"button small",text:l?"\uC800\uC7A5 \uC911\u2026":"\uC218\uC815 \uC800\uC7A5",attrs:{type:"submit"},disabled:l})])]),t("h3",{className:"subhead",text:"\uBCC0\uACBD \uC774\uB825"}),t("ol",{className:"change-list"},i.changes.map(Et)),x("\uB2EB\uAE30",()=>a.closeSheet(),{variant:"secondary",attrs:{"data-wide":""}})])])}var Wt=[{id:"all",label:"\uC804\uCCB4"},{id:"character",label:"\uCE90\uB9AD\uD130"},{id:"persona",label:"\uD398\uB974\uC18C\uB098"}],Y=[{id:"all",label:"\uBAA8\uB450"},{id:"recruited",label:"\uC601\uC785\uD55C \uC8FC\uBBFC"},{id:"waiting",label:"\uCD08\uB300 \uB300\uAE30"}];function Ot(e,r){let a=Y[(Y.findIndex(i=>i.id===e.filter)+1)%Y.length],n=Y.find(i=>i.id===e.filter);return t("div",{className:"search-bar"},[Q({id:"fw-resident-search",value:e.query,placeholder:"\uC774\uB984\uC73C\uB85C \uCC3E\uAE30",onSearch:i=>r.setResidentsQuery(i)}),t("button",{className:`icon-button filter${e.filter==="all"?"":" active"}`,attrs:{type:"button","aria-label":`\uBCF4\uAE30: ${n.label} (\uB204\uB974\uBA74 ${a.label})`},on:{click:()=>r.setResidentsFilter(a.id)}},[s.filter()]),e.filter==="all"?null:t("span",{className:"filter-chip",text:n.label})])}function Vt(e,r){return t("div",{className:"pill-tabs",attrs:{role:"tablist","aria-label":"\uC8FC\uBBFC \uC885\uB958"}},Wt.map(a=>t("button",{className:`pill-tab${e.tab===a.id?" current":""}`,text:a.label,attrs:{type:"button",role:"tab","aria-selected":e.tab===a.id?"true":"false"},on:{click:()=>r.setResidentsTab(a.id)}})))}function Ge(e){return y(e,"specialty",{className:"tag field",label:"\uC804\uBB38 \uBD84\uC57C",children:[s.leaf("icon tiny"),t("span",{text:"\uBD84\uC57C"})]})}function Dt(e,r,a){return t("li",{className:`resident-card${r?" selected":""}`},[t("button",{className:"resident-card-main",attrs:{type:"button","aria-pressed":r?"true":"false","aria-label":`${e.displayName} \uBCF4\uAE30`},on:{click:()=>a.selectResident(e.residentId)}},[t("span",{className:"card-stage"},[F(e)]),t("strong",{className:"resident-name",text:e.displayName})]),t("span",{className:"tag-row"},[E(e),Ge(a)]),e.recruited?t("span",{className:"status-pill done",text:"\uC601\uC785 \uC644\uB8CC"}):y(a,"invite",{className:"status-pill waiting",label:"\uCD08\uB300\uD558\uAE30",children:[t("span",{text:"\uCD08\uB300 \uB300\uAE30"})]})])}function ce(e,r,a){return t("button",{className:"detail-action",attrs:{type:"button"},on:{click:a}},[e("icon"),t("span",{text:r})])}function Ht(e,r){return h(null,[t("div",{className:"resident-detail"},[t("span",{className:"detail-stage"},[F(e)]),t("div",{className:"detail-info"},[t("strong",{className:"detail-name",text:e.displayName}),t("span",{className:"tag-row"},[E(e),Ge(r)]),j(r,"breakthrough",[t("p",{className:"passive"},[s.leaf("icon tiny"),t("strong",{text:"\uD328\uC2DC\uBE0C"})," \u2013"]),t("p",{className:"muted",text:"\uAE30\uBCF8 \uD6A8\uACFC \u2013 \u2192 \uD604\uC7AC \u2013"}),t("p",{className:"breakthrough"},[t("span",{text:"\uB3CC\uD30C \u2013/\u2013"}),t("span",{className:"leaf-pips"},[1,2,3,4,5].map(()=>t("span",{className:"pip"})))])],"detail-locked")])]),t("div",{className:"detail-actions"},[ce(s.image,"\uC8FC\uBBFC \uADF8\uB9BC",()=>r.openResidentImage(e.residentId)),ce(s.document,"\uD504\uB85C\uD544",()=>r.openSheet({kind:"profile",residentId:e.residentId})),ce(s.heart,"\uAD00\uACC4",()=>r.openRelations(e.residentId))])],{className:"detail-card"})}function Kt(e,r,a){let n=r.residentsView,i=Object.values(e.state.residents),o=Re(e.state,n),l=e.state.residents[n.selectedId??""]??o[0]??null,d=i.length===0?t("div",{className:"empty-state"},[t("p",{text:"\uC544\uC9C1 \uC8FC\uBBFC\uC774 \uC5C6\uC5B4\uC694."}),t("p",{className:"muted",text:"\uCE90\uB9AD\uD130\uB098 \uD398\uB974\uC18C\uB098\uB97C \uBD88\uB7EC\uC640 \uC774 \uC138\uACC4\uC758 \uC8FC\uBBFC\uC73C\uB85C \uB9DE\uC774\uD574 \uBCF4\uC138\uC694."})]):o.length===0?t("p",{className:"empty",text:"\uC870\uAC74\uC5D0 \uB9DE\uB294 \uC8FC\uBBFC\uC774 \uC5C6\uC5B4\uC694."}):t("ul",{className:"resident-grid"},o.map(m=>Dt(m,m.residentId===l?.residentId,a)));return[Ot(n,a),t("section",{className:"card resident-board",attrs:{"aria-label":"\uC8FC\uBBFC \uBAA9\uB85D"}},[Vt(n,a),d]),l?Ht(l,a):null,t("button",{className:"button big-action",attrs:{type:"button","data-wide":""},on:{click:()=>a.openRegister(1)}},[s.people("icon"),t("span",{text:"\uC8FC\uBBFC \uBD88\uB7EC\uC624\uAE30"})])]}function _e(e,r){let a=e.world?.state==="ready"?e.world.value:null,n=e.sheet?.kind==="profile"&&a?qe(a,e,r,e.sheet.residentId):null;return v(e,r,{top:{kind:"sub",title:"\uC8FC\uBBFC",subtitle:"\uC232\uC744 \uD568\uAED8\uD558\uB294 \uC18C\uC911\uD55C \uC774\uC6C3\uB4E4",resources:!1},backdrop:"forest",body:a?Kt(a,e,r):[N("\uC138\uACC4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026")],nav:!0,sheet:n})}function me(e,r,a){return t("div",{className:"preview-row"},[e("icon"),t("span",{text:r}),t("strong",{text:a})])}function Z(e,r,a){let n=!!e.busy.restore,i=t("input",{className:"visually-hidden",attrs:{type:"file",accept:"application/json,.json",id:a},disabled:n,on:{change:()=>{let d=i.files?.[0];d&&r.selectRestoreFile(d),i.value=""}}}),o=e.restore,l=o?.summary;return t("div",{className:"restore"},[i,t("label",{className:"menu-row",attrs:{for:a}},[t("span",{className:"menu-icon"},[s.download()]),t("span",{className:"menu-text"},[t("span",{className:"menu-title",text:"\uBC31\uC5C5 \uBD88\uB7EC\uC624\uAE30"}),t("span",{className:"menu-detail",text:o?o.fileName:"\uC0C8 \uC138\uACC4\uB85C \uBCF5\uC6D0"})]),t("span",{className:"menu-chevron"},[s.chevron()])]),t("div",{className:"preview-box",attrs:{"aria-live":"polite"}},[t("p",{className:"preview-head"},[s.eye("icon"),t("strong",{text:"\uBCF5\uC6D0 \uBBF8\uB9AC\uBCF4\uAE30"})]),l?t("div",{className:"preview-rows"},[me(s.residents,"\uC8FC\uBBFC",`${l.residents}\uBA85`),me(s.pair,"\uD398\uC5B4",`${l.pairs}\uAC1C`),me(s.image,"\uADF8\uB9BC",`${l.pictures}\uAC1C`)]):t("p",{className:"muted",text:"\uBC31\uC5C5 \uD30C\uC77C\uC744 \uACE0\uB974\uBA74 \uB2F4\uAE34 \uB0B4\uC6A9\uC744 \uBA3C\uC800 \uBCF4\uC5EC \uB4DC\uB824\uC694."})]),t("button",{className:"button big-action",attrs:{type:"button","data-wide":""},disabled:!l||n,on:{click:()=>{r.confirmRestore()}}},[s.restore("icon"),t("span",{text:n?"\uBCF5\uC6D0\uD558\uB294 \uC911\u2026":"\uC0C8 \uC138\uACC4\uB85C \uBCF5\uC6D0"})]),t("p",{className:"hint center"},[s.info("icon"),"\uD604\uC7AC \uC138\uACC4\uB294 \uB36E\uC5B4\uC4F0\uC9C0 \uC54A\uC544\uC694."])])}function Ut(e){let r=new Date(e);if(Number.isNaN(r.getTime()))return"\uC54C \uC218 \uC5C6\uC74C";let a=new Intl.DateTimeFormat("ko-KR",{hour:"2-digit",minute:"2-digit",hour12:!1}).format(r);return r.toDateString()===new Date().toDateString()?`\uC624\uB298 ${a}`:`${new Intl.DateTimeFormat("ko-KR",{month:"long",day:"numeric"}).format(r)} ${a}`}function Je(e){return e>=1024*1024?`${(e/(1024*1024)).toFixed(1)} MB`:e>=1024?`${(e/1024).toFixed(1)} KB`:`${e} B`}function qt(e){let r=e.storage,a;if(!r||r.state==="loading")a=N("\uD655\uC778\uD558\uB294 \uC911\u2026");else if(r.state==="error")a=P(r.message);else{let n=[[s.image,"\uC8FC\uBBFC \uADF8\uB9BC","residentImagesBytes"],[s.landscape,"\uBC30\uACBD","backgroundsBytes"],[s.document,"\uAE30\uB85D","recordsBytes"]],i=Math.max(1,...n.map(([,,o])=>r.value[o]));a=t("div",{className:"usage-rows"},n.map(([o,l,d])=>{let m=r.value[d],p=t("span",{className:"usage-fill"});return p.style.width=m>0?`max(0.9em, ${Math.round(m/i*100)}%)`:"0",t("div",{className:"usage-row"},[o("icon"),t("span",{className:"usage-label",text:l}),t("span",{className:"usage-bar",attrs:{role:"presentation"}},[p]),t("span",{className:"usage-size",text:Je(m)})])}))}return h("\uC800\uC7A5 \uACF5\uAC04 \uC0AC\uC6A9\uB7C9",[a,t("p",{className:"hint center"},[s.info("icon"),"\uADF8\uB9BC\uC740 WebP\uB85C \uBCF4\uAD00\uD574\uC694."])],{id:"fw-usage"})}function Gt(e,r){let a=!!e.busy.backup;return t("button",{className:"menu-row",attrs:{type:"button"},disabled:a,on:{click:()=>{r.downloadBackup()}}},[t("span",{className:"menu-icon"},[s.upload()]),t("span",{className:"menu-text"},[t("span",{className:"menu-title",text:a?"\uBC31\uC5C5 \uB9CC\uB4DC\uB294 \uC911\u2026":"\uBC31\uC5C5 \uB0B4\uBCF4\uB0B4\uAE30"}),t("span",{className:"menu-detail",text:"\uC138\uACC4 \xB7 \uC7AC\uD654 \xB7 \uCC3D\uACE0 \uD3EC\uD568 \xB7 \uBE44\uBC00\uD0A4 \uC81C\uC678"})]),t("span",{className:"menu-chevron"},[s.chevron()])])}function Xe(e,r,a,n,i){return t("button",{className:"menu-row quiet",attrs:{type:"button"},on:{click:()=>e.navigate(r)}},[t("span",{className:"menu-icon quiet"},[a()]),t("span",{className:"menu-text"},[t("span",{className:"menu-title",text:n}),t("span",{className:"menu-detail",text:i})]),t("span",{className:"menu-chevron"},[s.chevron()])])}function Qe(e,r){let a=e.world?.state==="ready"?e.world.value:null,n=a?[t("section",{className:"card saved",attrs:{"aria-label":"\uC800\uC7A5 \uC0C1\uD0DC"}},[t("p",{className:"saved-title"},[t("span",{className:"check"},[s.check()]),"\uC800\uC7A5 \uC644\uB8CC"]),t("p",{className:"saved-time",text:`\uB9C8\uC9C0\uB9C9 \uC800\uC7A5 ${Ut(a.updatedAt)}`})]),qt(e),h(null,[Gt(e,r),Z(e,r,"fw-backup-restore")],{className:"menu"}),h(null,[t("button",{className:"menu-row",attrs:{type:"button"},on:{click:()=>r.openSheet({kind:"history-cleanup"})}},[t("span",{className:"menu-icon light"},[s.image()]),t("span",{className:"menu-text"},[t("span",{className:"menu-title",text:"\uADF8\uB9BC \uC774\uB825 \uC815\uB9AC"}),t("span",{className:"menu-detail",text:"\uB2E4\uB978 \uACF3\uC5D0\uC11C \uC4F0\uB294 \uADF8\uB9BC\uC740 \uC720\uC9C0"})]),t("span",{className:"menu-chevron"},[s.chevron()])]),Xe(r,"worlds",s.house,"\uB2E4\uB978 \uC138\uACC4","\uC138\uACC4 \uACE0\uB974\uAE30 \xB7 \uC0C8\uB85C \uB9CC\uB4E4\uAE30"),Xe(r,"diagnostics",s.info,"\uC5F0\uACB0 \uC810\uAC80","\uC5D4\uC9C4 \uC5F0\uACB0\uACFC \uADF8\uB9BC \uC800\uC7A5 \uACBD\uB85C \uD655\uC778")],{className:"menu"})]:[N("\uC138\uACC4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026")];return v(e,r,{top:{kind:"sub",title:"\uC800\uC7A5\xB7\uBC31\uC5C5",back:{route:"settings",label:"\uC124\uC815"},resources:!1},backdrop:"wood",body:n,nav:!0,sheet:a&&e.sheet?.kind==="history-cleanup"?_t(a.state,e,r):null})}function _t(e,r,a){let n=Object.values(e.residents).reduce((l,d)=>l+d.image.history.length,0),i=Object.values(e.residents).flatMap(l=>l.image.history).reduce((l,d)=>l+d.bytes,0),o=!!r.busy["image-history-clear"];return t("div",{className:"sheet-backdrop"},[t("section",{className:"sheet card",attrs:{role:"dialog","aria-modal":"true","aria-labelledby":"fw-history-cleanup"}},[t("h2",{className:"section-title",text:"\uADF8\uB9BC \uC774\uB825 \uC815\uB9AC",attrs:{id:"fw-history-cleanup"}}),n?t("p",{text:`\uC8FC\uBBFC\uB4E4\uC758 \uC774\uC804 \uADF8\uB9BC ${n}\uC7A5(${Je(i)})\uC744 \uC815\uB9AC\uD574\uC694. \uC9C0\uAE08 \uC4F0\uB294 \uADF8\uB9BC\uC740 \uADF8\uB300\uB85C\uC774\uACE0, \uC815\uB9AC\uD55C \uADF8\uB9BC\uC740 '\uC774\uC804 \uADF8\uB9BC'\uC5D0\uC11C \uB418\uB3CC\uB9B4 \uC218 \uC5C6\uC5B4\uC694.`}):t("p",{className:"empty",text:"\uC815\uB9AC\uD560 \uC774\uC804 \uADF8\uB9BC\uC774 \uC5C6\uC5B4\uC694."}),t("p",{className:"hint",text:"\uB2E4\uB978 \uACF3\uC5D0\uC11C \uC4F0\uB294 \uADF8\uB9BC \uD30C\uC77C\uC740 \uAC24\uB7EC\uB9AC\uC5D0 \uADF8\uB300\uB85C \uB0A8\uC544\uC694."}),n?x(o?"\uC815\uB9AC\uD558\uB294 \uC911\u2026":`${n}\uC7A5 \uC815\uB9AC\uD558\uAE30`,()=>{a.clearImageHistory()},{disabled:o,attrs:{"data-wide":""}}):null,x("\uB2EB\uAE30",()=>a.closeSheet(),{variant:"secondary",attrs:{"data-wide":""}})])])}function Xt(e,r,a){let n=!!r.busy["rename-nickname"],i=e.state.settings.playerNickname,o=t("input",{className:"input",attrs:{id:"fw-set-nick",maxlength:"24",autocomplete:"off",value:i}});return t("form",{className:"setting-row",on:{submit:l=>{l.preventDefault();let d=o.value.trim();d&&d!==i&&a.runCommand("rename-nickname","settings.update",{playerNickname:o.value})}}},[s.leaf("icon row-leaf"),t("label",{className:"setting-label",text:"\uB2C9\uB124\uC784",attrs:{for:"fw-set-nick"}}),t("span",{className:"setting-field"},[o,t("button",{className:"button small",text:n?"\uC800\uC7A5 \uC911\u2026":"\uC218\uC815",attrs:{type:"submit"},disabled:n})])])}function Jt(e){return t("div",{className:"setting-row"},[s.leaf("icon row-leaf"),t("span",{className:"setting-label",text:"\uD604\uC2E4 \uB0A0\uC528"}),t("span",{className:"setting-field"},[t("span",{className:"input readonly"},[s.weather("icon"),t("span",{text:"\uB3C4\uC2DC \uBBF8\uC124\uC815"})]),y(e,"weather",{className:"button small",label:"\uD604\uC2E4 \uB0A0\uC528 \uBCC0\uACBD",children:[t("span",{text:"\uBCC0\uACBD"})]})])])}function Qt(e,r){let a=t("input",{className:"slider",attrs:{id:"fw-font-size",type:"range",min:String(T.min),max:String(T.max),step:String(T.step),value:String(e.fontSize),"aria-valuetext":`${e.fontSize}px`},on:{change:()=>r.setFontSize(Number(a.value))}});return t("div",{className:"setting-block"},[t("div",{className:"setting-row slider-row"},[s.leaf("icon row-leaf"),t("label",{className:"setting-label",text:"\uAE00\uC790 \uD06C\uAE30",attrs:{for:"fw-font-size"}}),a,t("span",{className:"slider-value",text:`${e.fontSize}px`})]),t("p",{className:"font-preview",text:"\uC774\uB807\uAC8C \uD45C\uC2DC\uB3FC\uC694."})])}function Ye(e,r,a,n,i){return y(e,r,{className:"toggle-row",label:n,children:[t("span",{className:"toggle-icon"},[a("icon")]),t("span",{className:"toggle-text"},[t("strong",{text:n}),t("span",{text:i})]),t("span",{className:"switch off"},[t("span",{className:"knob"})])]})}function ee(e,r,a,n){let i=[t("span",{className:"manage-icon"},[r("icon")]),t("span",{className:"manage-title",text:a}),t("span",{className:"menu-chevron"},[s.chevron()])];return"route"in n?t("button",{className:"manage-row",attrs:{type:"button"},on:{click:()=>e.navigate(n.route)}},i):y(e,n.feature,{className:"manage-row",label:a,children:i})}function Ze(e,r){let a=e.world?.state==="ready"?e.world.value:null,n=a?[h("\uB0B4 \uACF5\uBC29",[Xt(a,e,r),Jt(r)],{id:"fw-mine"}),h("\uD45C\uC2DC",[Qt(e,r),Ye(r,"weather-effects",s.leaf,"\uB0A0\uC528 \uD6A8\uACFC","\uACF5\uBC29 \uBC30\uACBD\uC5D0 \uD604\uC7AC \uB0A0\uC528\uB97C \uBC18\uC601\uD574\uC694."),Ye(r,"auto-read",s.book,"\uC790\uB3D9 \uC77D\uAE30","\uC774\uC57C\uAE30\uB97C \uC790\uB3D9\uC73C\uB85C \uB118\uACA8\uC694.")],{id:"fw-display"}),h("\uAD00\uB9AC",[ee(r,s.image,"\uC8FC\uBBFC \uADF8\uB9BC \uAD00\uB9AC",{route:"residents"}),ee(r,s.flower,"AI \uC9C0\uCE68 \uAD00\uB9AC",{feature:"ai-guidelines"}),ee(r,s.people,"\uAE30\uC5B5 \uAD00\uB9AC",{feature:"memory"}),ee(r,s.folder,"\uC800\uC7A5 \xB7 \uBC31\uC5C5",{route:"backup"}),t("div",{className:"note-box"},[s.clock("icon"),t("span",{},[t("strong",{text:"\uBBF8\uC811\uC18D \uB204\uC801 \uC0C1\uD55C 72\uC2DC\uAC04"}),t("span",{text:"72\uC2DC\uAC04\uC774 \uC9C0\uB098\uBA74 \uC77C\uBD80 \uC790\uB3D9 \uC9C4\uD589\uC774 \uBA48\uCDB0\uC694."})])])],{id:"fw-manage"}),t("p",{className:"footnote",text:"\uC790\uB3D9\uD654 \uADDC\uCE59\uC740 \uC791\uC5C5 \uD654\uBA74\uC5D0\uC11C \uBC14\uAFC0 \uC218 \uC788\uC5B4\uC694."})]:[N("\uC138\uACC4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026")];return v(e,r,{top:{kind:"sub",title:"\uC124\uC815",back:{route:"home",label:"\uD648"},resources:!1},backdrop:"wood",body:n,nav:!0})}function et(e,r){let a=new Map(r?.items.map((n,i)=>[n.id,i]));return Object.entries(e.state.inventory).filter(([,n])=>n>0).sort(([n],[i])=>(a.get(n)??999)-(a.get(i)??999)).map(([n,i])=>({itemId:n,amount:i,name:r?.items.find(o=>o.id===n)?.name??n}))}function Yt(e,r){let a=(n,i,o)=>t("button",{className:`big-tab${e.facilitiesTab===n?" current":""}`,attrs:{type:"button",role:"tab","aria-selected":e.facilitiesTab===n?"true":"false"},on:{click:()=>r.setFacilitiesTab(n)}},[o,t("span",{text:i})]);return t("div",{className:"big-tabs",attrs:{role:"tablist","aria-label":"\uC2DC\uC124\uACFC \uCC3D\uACE0"}},[a("facilities","\uC2DC\uC124",s.house("icon big")),a("storage","\uCC3D\uACE0",s.box("icon big"))])}function Zt(e){return j(e,"facility-upgrade",[t("div",{className:"facility"},[t("span",{className:"facility-picture"},[s.house("icon huge")]),t("div",{className:"facility-info"},[t("strong",{className:"facility-name",text:"\uC2DC\uC124"}),t("span",{className:"facility-level"},["Lv. \u2013",t("span",{className:"level-next",text:" \u2192 Lv. \u2013"})]),t("div",{className:"effect-row"},[t("span",{text:"\uD6A8\uACFC"}),t("span",{text:"\u2013"})]),t("div",{className:"effect-row"},[t("span",{text:"\uB300\uAE30\uC5F4"}),t("span",{text:"\u2013"})]),t("p",{className:"muted",text:"\uBD84\uC57C\uBCC4 \uC2DC\uC124\uC744 \uAC15\uD654\uD558\uBA74 \uD6A8\uACFC\uAC00 \uC62C\uB77C\uAC00\uC694."}),t("span",{className:"gold-button"},[t("span",{className:"coin"}),"\u2013 G \xB7 \uAC15\uD654"])])])])}function er(e,r){let a=et(e,r);return a.length===0?t("p",{className:"empty",text:"\uCC3D\uACE0\uAC00 \uBE44\uC5B4 \uC788\uC5B4\uC694."}):t("table",{className:"stock"},[t("thead",{},[t("tr",{},["\uC544\uC774\uD15C","\uBCF4\uC720 \uC218\uB7C9","\uBCF4\uD638 \uC7AC\uACE0","\uC608\uC57D \uC7AC\uACE0","\uC0AC\uC6A9 \uAC00\uB2A5"].map(n=>t("th",{text:n,attrs:{scope:"col"}})))]),t("tbody",{},a.map(n=>t("tr",{},[t("th",{attrs:{scope:"row"}},[t("span",{className:"item-dot"}),n.name]),t("td",{className:"num",text:n.amount.toLocaleString("ko-KR")}),t("td",{className:"num",text:"\u2013"}),t("td",{className:"num",text:"\u2013"}),t("td",{className:"num available",text:n.amount.toLocaleString("ko-KR")})])))])}function tr(e,r,a){return h(null,[t("div",{className:"card-head"},[t("div",{},[t("h2",{className:"section-title",text:"\uC7AC\uACE0 \uBCF4\uD638",attrs:{id:"fw-protect"}}),t("p",{className:"muted",text:"\uC9C0\uC815\uD55C \uC218\uB7C9\uC740 \uC81C\uC791\uC5D0 \uC0AC\uC6A9\uD558\uC9C0 \uC54A\uC544\uC694."})]),y(a,"stock-protection",{className:"outline-button",label:"\uD3B8\uC9D1\uD558\uAE30",children:[s.pencil("icon"),t("span",{text:"\uD3B8\uC9D1\uD558\uAE30"})]})]),er(e,r),y(a,"auto-sell",{className:"toggle-row",label:"\uC790\uB3D9 \uD310\uB9E4",children:[t("span",{className:"toggle-icon"},[s.gear("icon")]),t("span",{className:"toggle-text"},[t("strong",{text:"\uC790\uB3D9 \uD310\uB9E4"}),t("span",{text:"\uBCF4\uD638 \xB7 \uC608\uC57D \uC7AC\uACE0\uB294 \uC0AC\uC6A9\uD558\uC9C0 \uC54A\uC544\uC694."})]),t("span",{className:"switch off"},[t("span",{className:"knob"}),t("span",{className:"switch-label",text:"\uAEBC\uC9D0"})])]})],{id:"fw-protect"})}function rr(e,r){let a=et(e,r);return h("\uCC3D\uACE0",[a.length===0?t("p",{className:"empty",text:"\uCC3D\uACE0\uAC00 \uBE44\uC5B4 \uC788\uC5B4\uC694."}):t("ul",{className:"storage-grid"},a.map(n=>t("li",{className:"storage-item"},[t("span",{className:"item-dot big"}),t("span",{className:"storage-name",text:n.name}),t("strong",{text:n.amount.toLocaleString("ko-KR")})])))],{id:"fw-storage"})}function tt(e,r){let a=e.world?.state==="ready"?e.world.value:null,n=a?[Yt(e,r),...e.facilitiesTab==="facilities"?[h(null,[Zt(r)],{className:"facility-card"}),tr(a,e.content,r)]:[rr(a,e.content)]]:[];return v(e,r,{top:{kind:"sub",title:"\uC2DC\uC124\uACFC \uCC3D\uACE0",back:{route:"work",label:"\uACF5\uBC29 \uC791\uC5C5"},resources:!0},backdrop:"forest",body:n,nav:!0})}var ar=[{label:"\uCC44\uC9D1",icon:s.leaf},{label:"\uC7AC\uBC30",icon:s.sprout},{label:"\uC870\uC0AC",icon:s.search},{label:"\uAC00\uACF5",icon:s.jar},{label:"\uC81C\uC791",icon:s.hammer}];function nr(e){return t("div",{className:"field-tabs",attrs:{role:"group","aria-label":"\uC791\uC5C5 \uBD84\uC57C"}},ar.map(r=>y(e,"work-fields",{className:"field-tab",label:r.label,children:[r.icon("icon field-glyph"),t("span",{text:r.label})]})))}function ir(e){return j(e,"work-mode",[t("div",{className:"segmented",attrs:{"aria-hidden":"true"}},[t("span",{className:"segment selected",text:"\uC790\uB3D9 \uC6B4\uC601"}),t("span",{className:"segment",text:"\uC9C0\uC815 \uD69F\uC218"})])],"slim")}function or(e){return t("div",{className:"facility-entry"},[t("button",{className:"facility-open",attrs:{type:"button","aria-label":"\uC2DC\uC124\uACFC \uCC3D\uACE0 \uC5F4\uAE30"},on:{click:()=>e.navigate("facilities")}},[t("span",{className:"facility-art"},[s.box("icon big")]),t("span",{className:"facility-text"},[t("strong",{text:"\uC2DC\uC124\uACFC \uCC3D\uACE0"}),t("span",{text:"\uCC3D\uACE0\uC758 \uC7AC\uB8CC\uC640 \uC7AC\uACE0 \uBCF4\uD638\uB97C \uD655\uC778\uD574\uC694."})])]),y(e,"work-fields",{className:"outline-button",label:"\uBC30\uCE58 \uBCC0\uACBD",children:[s.swap("icon"),t("span",{text:"\uBC30\uCE58 \uBCC0\uACBD"})]})])}function sr(e){return j(e,"work-rules",[t("div",{className:"recipe"},[t("span",{className:"recipe-art"},[s.jar("icon big")]),t("span",{className:"recipe-text"},[t("strong",{text:"\uC81C\uC791\uBC95"}),t("span",{text:"\uBD84\uC57C\uB97C \uACE0\uB974\uBA74 \uB9CC\uB4E4 \uC544\uC774\uD15C\uC774 \uC5EC\uAE30\uC5D0 \uBCF4\uC5EC\uC694."})])]),t("div",{className:"plan-row"},[t("span",{className:"plan-label",text:"\uBAA9\uD45C \uC7AC\uACE0"}),t("span",{className:"stepper"},[t("span",{className:"step"},[s.minus("icon")]),t("span",{className:"step-value",text:"\u2013"}),t("span",{className:"step plus"},[s.plus("icon")])]),t("span",{className:"plan-progress"},[t("span",{className:"muted",text:"\uD604\uC7AC \u2013 / \uBAA9\uD45C \u2013"}),t("span",{className:"bar"})])]),t("div",{className:"plan-block"},[t("span",{className:"plan-label",text:"\uC7AC\uB8CC \uC0AC\uC6A9 \uC124\uC815"}),t("div",{className:"usage"},[t("span",{className:"usage-item",text:"\uC7AC\uB8CC"}),...["\uBCF4\uC720","\uBCF4\uD638","\uC0AC\uC6A9 \uAC00\uB2A5"].map(r=>t("span",{className:"usage-cell"},[t("small",{text:r}),t("strong",{text:"\u2013"})]))])]),t("div",{className:"plan-block"},[t("span",{className:"plan-label"},["\uC81C\uC791 \uC6B0\uC120\uC21C\uC704 ",t("small",{text:"(\uC704\uC758 \uC544\uC774\uD15C\uBD80\uD130 \uC21C\uC11C\uB300\uB85C \uC81C\uC791\uD574\uC694)"})]),...[1,2].map(r=>t("div",{className:"priority-row"},[s.grip("icon muted-icon"),t("span",{className:"rank",text:String(r)}),t("span",{className:"priority-name",text:"\u2013"}),s.menu("icon muted-icon")]))]),t("div",{className:"plan-row"},[t("span",{className:"plan-label",text:"\uD604\uC7AC \uC791\uC5C5"}),t("span",{className:"plan-progress wide"},[t("span",{className:"muted",text:"\uC9C4\uD589 \uC911\uC778 \uC791\uC5C5 \uC5C6\uC74C"}),t("span",{className:"bar teal"})])]),t("p",{className:"hint"},[s.info("icon"),"\uC7AC\uB8CC\uAC00 \uBD80\uC871\uD558\uBA74 \uAE30\uB2E4\uB838\uB2E4 \uB2E4\uC2DC \uC2DC\uC791\uD574\uC694."])])}function lr(e){return t("div",{className:"rule-actions"},[y(e,"work-rules",{className:"button wide-main",label:"\uC6B4\uC601 \uADDC\uCE59 \uC801\uC6A9",children:[t("span",{text:"\uC6B4\uC601 \uADDC\uCE59 \uC801\uC6A9"})]}),y(e,"work-rules",{className:"button secondary",label:"\uCD94\uCC9C \uC124\uC815",children:[s.gear("icon"),t("span",{text:"\uCD94\uCC9C \uC124\uC815"})]})])}function rt(e,r){return v(e,r,{top:{kind:"sub",title:"\uACF5\uBC29 \uC791\uC5C5",back:{route:"home",label:"\uD648"},resources:!0},backdrop:"forest",body:[nr(r),h(null,[ir(r),or(r),sr(r)],{className:"work-card"}),lr(r)],nav:!0})}var at={world:40,nickname:24};function dr(e){let r=new Date(e);return Number.isNaN(r.getTime())?e:new Intl.DateTimeFormat("ko-KR",{dateStyle:"medium",timeStyle:"short"}).format(r)}function cr(e,r){let a=h("\uB0B4 \uC138\uACC4",[],{id:"fw-worlds"}),{worlds:n}=e;return n.state==="loading"?a.append(N("\uBD88\uB7EC\uC624\uB294 \uC911\u2026")):n.state==="error"?a.append(P(n.message),x("\uB2E4\uC2DC \uC2DC\uB3C4",()=>{r.loadWorlds()},{variant:"secondary"})):n.value.length===0?a.append(t("p",{className:"empty",text:"\uC544\uC9C1 \uC138\uACC4\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4. \uC544\uB798\uC5D0\uC11C \uC0C8\uB85C \uB9CC\uB4E4\uC5B4 \uC8FC\uC138\uC694."})):a.append(t("ul",{className:"menu-list"},n.value.map(i=>t("li",{},[t("button",{className:"menu-row",attrs:{type:"button"},disabled:!i.readable,on:{click:()=>{r.openWorld(i.worldId)}}},[t("span",{className:"menu-icon"},[s.house()]),t("span",{className:"menu-text"},[t("span",{className:"menu-title",text:i.worldName}),t("span",{className:"menu-detail",text:i.readable?`\uB9C8\uC9C0\uB9C9 \uC800\uC7A5 ${dr(i.updatedAt)}`:"\uC774 \uBC84\uC804\uC5D0\uC11C \uC77D\uC744 \uC218 \uC5C6\uB294 \uC138\uACC4"})]),t("span",{className:"menu-chevron"},[s.chevron()])])])))),a}function mr(e,r){let a=!!e.busy["create-world"],n=t("input",{className:"input",attrs:{id:"fw-world-name",name:"worldName",maxlength:String(at.world),autocomplete:"off",required:""}}),i=t("input",{className:"input",attrs:{id:"fw-nickname",name:"playerNickname",maxlength:String(at.nickname),autocomplete:"off",required:""}});return t("form",{className:"card form",attrs:{"aria-labelledby":"fw-create"},on:{submit:l=>{l.preventDefault(),!(!n.value.trim()||!i.value.trim())&&r.createWorld(n.value,i.value)}}},[t("h2",{className:"section-title",text:"\uC0C8 \uC138\uACC4 \uB9CC\uB4E4\uAE30",attrs:{id:"fw-create"}}),t("p",{className:"muted",text:"\uD50C\uB808\uC774\uC5B4\uB294 \uC678\uD615 \uC5C6\uC774 \uB2C9\uB124\uC784\uC73C\uB85C\uB9CC \uB4F1\uC7A5\uD569\uB2C8\uB2E4. \uB458 \uB2E4 \uB098\uC911\uC5D0 \uC124\uC815\uC5D0\uC11C \uBC14\uAFC0 \uC218 \uC788\uC2B5\uB2C8\uB2E4."}),t("label",{className:"field-label",text:"\uC138\uACC4 \uC774\uB984",attrs:{for:"fw-world-name"}}),n,t("label",{className:"field-label",text:"\uB0B4 \uB2C9\uB124\uC784",attrs:{for:"fw-nickname"}}),i,t("button",{className:"button",text:a?"\uB9CC\uB4DC\uB294 \uC911\u2026":"\uB9CC\uB4E4\uAE30",attrs:{type:"submit"},disabled:a})])}function nt(e,r){let a=e.world?.state==="ready";return v(e,r,{top:a?{kind:"sub",title:"\uC138\uACC4 \uACE0\uB974\uAE30",back:{route:"backup",label:"\uC800\uC7A5\xB7\uBC31\uC5C5"},resources:!1}:{kind:"sub",title:"\uC232\uACB0 \uACF5\uBC29",resources:!1},backdrop:"wood",body:[cr(e,r),mr(e,r),h("\uBC31\uC5C5\uC5D0\uC11C \uBCF5\uC6D0",[Z(e,r,"fw-worlds-restore")],{id:"fw-worlds-restore-title",className:"menu"})],nav:!1})}var it=`
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
/* While a toast shows, the page can scroll its last controls above it. */
.has-notice .page { padding-bottom: 6em; }
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
`;var ot=`
/* \u2500\u2500 Shared: ribbon, figure, avatar, tags \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.ribbon {
  justify-self: center;
  max-width: 100%;
  margin: -0.1em 0 0;
  padding: 0.2em 1.1em;
  border-radius: 0.5em;
  border: 1.5px solid var(--fw-border-strong);
  background: var(--fw-surface);
  color: var(--fw-text);
  font-size: calc(var(--fs) * 0.9);
  font-weight: 700;
  text-align: center;
}
.figure { position: relative; display: block; width: 100%; height: 100%; overflow: hidden; }
.figure-body { position: absolute; bottom: 4%; transform: translateX(-50%); display: flex; align-items: flex-end; justify-content: center; width: 100%; }
.figure-image { display: block; max-width: 100%; max-height: 100%; width: auto; height: 100%; object-fit: contain; object-position: 50% 100%; }
.figure-marker { position: absolute; transform: translate(-50%, 0); display: inline-flex; padding: 0.15em; border-radius: 50%; background: var(--fw-surface-3); color: var(--fw-leaf); border: 1.5px solid var(--fw-leaf); }
.figure-empty { position: absolute; inset: 0; display: grid; place-items: center; align-content: center; gap: 0.2em; color: rgba(107, 68, 38, 0.45); }
.figure-silhouette { width: 45%; max-width: 5em; fill: currentColor; }
.figure-empty-text { padding: 0.05em 0.6em; border-radius: 999px; background: rgba(255, 250, 240, 0.85); color: var(--fw-muted); font-size: calc(var(--fs) * 0.75); font-weight: 800; }
.checker {
  background-color: #f4efe3;
  background-image: linear-gradient(45deg, #e2dccd 25%, transparent 25%, transparent 75%, #e2dccd 75%),
    linear-gradient(45deg, #e2dccd 25%, transparent 25%, transparent 75%, #e2dccd 75%);
  background-size: 16px 16px;
  background-position: 0 0, 8px 8px;
}
.avatar { position: relative; flex: none; display: inline-grid; place-items: center; width: 3.4em; height: 3.4em; border-radius: 50%; overflow: hidden; border: 2px solid var(--fw-border-strong); background: var(--fw-surface-2); color: rgba(107, 68, 38, 0.5); }
.avatar.large { width: 6.5em; height: 6.5em; border-width: 3px; }
.avatar-image { width: 100%; height: 100%; object-fit: cover; object-position: 50% 12%; }
.avatar-silhouette { width: 70%; fill: currentColor; margin-top: 20%; }
.avatar-unknown { position: absolute; inset: 0; display: grid; place-items: center; color: #fff; font-size: calc(var(--fs) * 1.3); font-weight: 900; }
.tag-row { display: flex; flex-wrap: wrap; justify-content: center; gap: 0.3em; }
.tag { position: relative; display: inline-flex; align-items: center; gap: 0.2em; padding: 0.1em 0.65em; border-radius: 999px; border: 0; font: inherit; font-size: calc(var(--fs) * 0.78); font-weight: 800; }
.tag.character { background: #d6e7fb; color: #285a93; }
.tag.persona { background: #e9dcfa; color: #6a3f9c; }
.tag.field { background: var(--fw-leaf-soft); color: #3f5b33; cursor: pointer; }
.tag.is-locked { margin-right: 0.9em; }
.tag.is-locked > .lock-tag { top: -0.8em; right: -1.1em; }
.button.pressed { background: var(--fw-surface-2); box-shadow: inset 0 0.15em 0 var(--fw-border-strong); }
.textarea { width: 100%; min-height: 6em; padding: 0.6em 0.75em; border: 1.5px solid var(--fw-border-strong); border-radius: 0.7em; background: #fffdf6; color: var(--fw-text); font: inherit; line-height: 1.55; resize: vertical; }
.textarea-wrap { position: relative; display: grid; }
.textarea-wrap .textarea { padding-bottom: 1.8em; }
.textarea-wrap .counter-text { position: absolute; right: 0.75em; bottom: 0.45em; }
.counter-text { justify-self: end; color: var(--fw-muted); font-size: calc(var(--fs) * 0.8); font-variant-numeric: tabular-nums; }
.subhead { margin: 0.3em 0 0; font-size: calc(var(--fs) * 1.05); font-weight: 900; }
.empty-state { display: grid; justify-items: center; gap: 0.3em; padding: 1.2em 0.5em; text-align: center; }
.rule-actions.even { grid-template-columns: 1fr 1fr; }
.rule-actions.even .button { justify-self: stretch; }

/* \u2500\u2500 \uC8FC\uBBFC (03-1) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.search-bar { display: flex; align-items: center; gap: 0.5em; padding: 0.45em; border-radius: 0.9em; border: 2px solid var(--fw-border); background: var(--fw-surface); flex-wrap: wrap; }
.search-field { flex: 1 1 10em; display: flex; align-items: center; gap: 0.45em; min-width: 0; padding: 0 0.7em; border-radius: 0.7em; background: var(--fw-surface-2); color: var(--fw-wood-dark); }
.search-input { flex: 1; min-width: 0; min-height: 2.6em; border: 0; background: none; color: var(--fw-text); font: inherit; outline: none; }
.icon-button.filter.active { background: var(--fw-accent); color: var(--fw-on-accent); border-color: var(--fw-accent-strong); }
.filter-chip { padding: 0.1em 0.7em; border-radius: 999px; background: var(--fw-leaf-soft); color: #3f5b33; font-size: calc(var(--fs) * 0.8); font-weight: 800; }
.pill-tabs { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.4em; }
.pill-tabs.two { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.pill-tab { min-height: 2.6em; border-radius: 0.7em; border: 1.5px solid var(--fw-border-strong); background: var(--fw-surface-2); color: var(--fw-text); font: inherit; font-weight: 800; cursor: pointer; }
.pill-tab.current { background: #4f8f6e; border-color: #3b6f55; color: #fff; }
.resident-grid { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.6em; }
.resident-card { display: grid; justify-items: center; gap: 0.4em; padding: 0.5em 0.5em 0.65em; border-radius: 0.9em; border: 2px solid var(--fw-border); background: var(--fw-surface-3); min-width: 0; }
.resident-card.selected { border-color: #4f8f6e; box-shadow: 0 0 0 2px rgba(79, 143, 110, 0.35); }
.resident-card-main { display: grid; justify-items: center; gap: 0.35em; width: 100%; padding: 0; border: 0; background: none; color: inherit; font: inherit; cursor: pointer; }
.card-stage { display: block; width: 100%; aspect-ratio: 4 / 5; border-radius: 0.7em; background: radial-gradient(circle at 50% 35%, #fbf6e8, #ece2c6); }
.resident-name { font-size: calc(var(--fs) * 1.02); font-weight: 900; text-align: center; overflow-wrap: anywhere; }
.status-pill { position: relative; display: inline-flex; justify-content: center; align-items: center; width: 100%; min-height: 2.3em; padding: 0.2em 0.5em; border-radius: 0.7em; border: 0; font: inherit; font-weight: 800; }
.status-pill.done { background: #3f7c5e; color: #fff; }
.status-pill.waiting { background: var(--fw-surface-2); color: var(--fw-muted); border: 1.5px dashed var(--fw-border-strong); cursor: pointer; }
.detail-card { gap: 0.8em; }
.resident-detail { display: grid; grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr); gap: 0.75em; align-items: center; }
.detail-stage { display: block; aspect-ratio: 1; border-radius: 0.8em; overflow: hidden; background: radial-gradient(circle at 50% 35%, #fbf6e8, #ece2c6); }
.detail-info { display: grid; gap: 0.4em; min-width: 0; justify-items: start; }
.detail-info .tag-row { justify-content: flex-start; }
.detail-name { font-size: calc(var(--fs) * 1.2); font-weight: 900; overflow-wrap: anywhere; }
.detail-locked { width: 100%; gap: 0.2em; padding: 0.5em; background: var(--fw-surface-2); }
.passive, .breakthrough { display: flex; align-items: center; gap: 0.35em; flex-wrap: wrap; }
.leaf-pips { display: inline-flex; gap: 0.2em; }
.pip { width: 0.8em; height: 1em; border-radius: 0 70% 0 70%; background: var(--fw-border); }
.detail-actions { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.4em; }
.detail-action { display: flex; align-items: center; justify-content: center; gap: 0.35em; min-height: 3em; padding: 0.3em; border-radius: 0.8em; border: 1.5px solid var(--fw-border-strong); background: var(--fw-surface-3); color: var(--fw-text); font: inherit; font-weight: 800; cursor: pointer; }
.detail-action .icon { color: var(--fw-wood-dark); }

/* Home scene: residents standing in their places. */
.resident-spot.filled { width: 8.5em; height: 11em; border: 0; border-radius: 0; background: none; }
.resident-spot.filled .figure { position: absolute; inset: 0; }
.spot-name { position: absolute; left: 50%; bottom: -0.4em; transform: translateX(-50%); padding: 0.05em 0.6em; border-radius: 999px; background: rgba(255, 250, 240, 0.9); font-size: calc(var(--fs) * 0.78); font-weight: 800; white-space: nowrap; max-width: 100%; overflow: hidden; text-overflow: ellipsis; }
.resident-spot.invite { border-style: solid; border-color: var(--fw-accent); background: rgba(255, 250, 240, 0.7); color: var(--fw-accent); }
.resident-spot.invite .spot-text { margin: 0 0.4em 0.6em; text-align: center; }

/* \u2500\u2500 \uD504\uB85C\uD544 sheet \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.sheet-head { display: flex; align-items: center; justify-content: space-between; gap: 0.5em; }
.compare { display: grid; gap: 0.6em; }
.compare-box { display: grid; gap: 0.4em; padding: 0.7em; border-radius: 0.8em; border: 1.5px solid var(--fw-border); }
.compare-box.source { background: var(--fw-surface-2); }
.compare-box.world { background: var(--fw-leaf-soft); }
.compare-box .button { justify-self: end; }
.compare-title { display: flex; align-items: center; gap: 0.35em; font-weight: 900; }
.source-field { display: grid; gap: 0.1em; }
.source-field p { white-space: pre-wrap; max-height: 9em; overflow-y: auto; font-size: calc(var(--fs) * 0.9); }
.change-list { margin: 0; padding: 0; list-style: none; display: grid; gap: 0.3em; max-height: 14em; overflow-y: auto; }
.change-row { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 0 0.6em; padding: 0.4em 0.6em; border-radius: 0.6em; background: var(--fw-surface-3); font-size: calc(var(--fs) * 0.85); }
.change-kind { font-weight: 800; }
.change-detail { overflow-wrap: anywhere; }
.change-time { grid-column: 1 / -1; color: var(--fw-muted); font-size: calc(var(--fs) * 0.75); }

/* \u2500\u2500 \uAD00\uACC4 (03-2) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.hero-card { padding-top: 1.2em; }
.relation-hero { display: grid; justify-items: center; gap: 0.35em; text-align: center; }
.hero-label { margin-top: -0.9em; padding: 0.1em 0.9em; border-radius: 0.5em; border: 1.5px solid var(--fw-wood-dark); background: var(--fw-surface); font-weight: 800; z-index: 1; }
.hero-pairs { color: var(--fw-wood-dark); font-size: calc(var(--fs) * 1.8); font-weight: 900; letter-spacing: 0.02em; }
.hero-note { font-weight: 700; }
.pair-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.6em; }
.pair-row { grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.4fr); align-items: center; gap: 0.6em; }
.pair-faces { display: grid; justify-items: center; gap: 0.25em; }
.pair-letters { display: inline-flex; align-items: center; gap: 0.3em; color: var(--fw-muted); font-weight: 800; }
.letter { display: inline-grid; place-items: center; width: 1.6em; height: 1.6em; border-radius: 50%; background: var(--fw-wood-dark); color: #fff4dc; font-weight: 900; }
.faces { display: inline-flex; align-items: center; gap: 0.15em; }
.faces .avatar { width: 3em; height: 3em; }
.times { color: var(--fw-wood-dark); font-weight: 900; }
.partner-name { font-weight: 800; text-align: center; overflow-wrap: anywhere; font-size: calc(var(--fs) * 0.9); }
.pair-info { display: grid; gap: 0.45em; min-width: 0; }
.relation-now { display: grid; padding: 0.4em 0.7em; border-radius: 0.6em; border: 1.5px solid var(--fw-border); background: var(--fw-surface-3); }
.relation-now small { color: var(--fw-muted); font-size: calc(var(--fs) * 0.75); }
.relation-now strong { font-size: calc(var(--fs) * 1.1); font-weight: 900; }
.recent { display: flex; align-items: center; gap: 0.5em; flex-wrap: wrap; font-size: calc(var(--fs) * 0.9); }
.recent-label { padding: 0.05em 0.6em; border-radius: 0.5em; background: var(--fw-surface-2); color: var(--fw-muted); font-size: calc(var(--fs) * 0.8); }
.pair-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 0.35em; }
.pair-actions .outline-button { justify-content: center; min-height: 2.5em; padding: 0.2em 0.3em; gap: 0.2em; font-size: calc(var(--fs) * 0.82); white-space: nowrap; }
.pair-actions .outline-button .icon { width: 1.1em; height: 1.1em; }
.pair-actions .button { grid-column: 1 / -1; justify-self: stretch; }
.notice-strip { display: flex; align-items: center; justify-content: center; gap: 0.5em; padding: 0.5em 1em; border-radius: 0.9em; border: 1.5px solid var(--fw-border); background: var(--fw-surface); font-weight: 700; text-align: center; }
.bang { display: inline-grid; place-items: center; width: 1.6em; height: 1.6em; border-radius: 50%; background: var(--fw-wood-dark); color: #fff; font-weight: 900; }
.archived-list, .candidate-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.4em; }
.archived-row { display: flex; align-items: center; gap: 0.6em; padding: 0.4em; border-radius: 0.7em; background: var(--fw-surface-3); }
.archived-name { flex: 1; min-width: 0; font-weight: 800; overflow-wrap: anywhere; }
.candidate { display: flex; align-items: center; gap: 0.6em; width: 100%; padding: 0.45em 0.6em; border-radius: 0.8em; border: 1.5px solid var(--fw-border); background: var(--fw-surface-3); color: var(--fw-text); font: inherit; text-align: left; cursor: pointer; }
.candidate:disabled { opacity: 0.6; cursor: not-allowed; }
.candidate-name { flex: 1; min-width: 0; font-weight: 800; overflow-wrap: anywhere; }
.candidate-state { color: var(--fw-accent); font-weight: 800; font-size: calc(var(--fs) * 0.85); }

/* \u2500\u2500 \uC8FC\uBBFC \uB4F1\uB85D (05-3) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.steps { list-style: none; margin: 0; display: flex; align-items: center; justify-content: space-between; gap: 0.3em; padding: 0.7em 0.8em; }
.step-item { display: flex; align-items: center; gap: 0.35em; min-width: 0; }
.step-number { flex: none; display: inline-grid; place-items: center; width: 2em; height: 2em; border-radius: 50%; border: 2px solid var(--fw-border-strong); color: var(--fw-wood-dark); font-weight: 900; }
.step-item.current .step-number { background: var(--fw-accent); border-color: var(--fw-accent-strong); color: #fff; }
.step-item.done .step-number { background: var(--fw-leaf-soft); border-color: var(--fw-leaf); color: #3f5b33; }
.step-label { font-weight: 900; font-size: calc(var(--fs) * 0.92); white-space: nowrap; }
.step-arrow { color: var(--fw-muted); font-weight: 800; }
.source-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.45em; }
.source-row:disabled { opacity: 0.65; cursor: default; }
.selected-source { padding: 0.5em; }
.selected-source .menu-row { border: 0; background: none; }
.rebuild { gap: 0.65em; }
.readonly-box { padding: 0.6em 0.8em; border-radius: 0.7em; border: 1.5px solid var(--fw-border); background: var(--fw-surface-3); white-space: pre-wrap; }
.image-drop { display: grid; gap: 0.5em; }
.drop-zone { display: flex; align-items: center; justify-content: center; gap: 0.8em; min-height: 6.5em; padding: 0.8em; border-radius: 0.8em; border: 2px dashed var(--fw-border-strong); cursor: pointer; }
.drop-zone:focus-within { outline: 3px solid var(--fw-accent); outline-offset: 2px; }
.drop-icon { width: 3em; height: 3em; color: var(--fw-wood-dark); }
.drop-preview { max-height: 6em; max-width: 40%; object-fit: contain; }
.drop-text { display: grid; gap: 0.1em; min-width: 0; }
.drop-text strong { font-size: calc(var(--fs) * 1.1); font-weight: 900; overflow-wrap: anywhere; }
.drop-text span { color: var(--fw-muted); }
.starter-list { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.6em; }
.starter-option { display: grid; justify-items: center; gap: 0.3em; width: 100%; padding: 0.5em; border-radius: 0.9em; border: 2px solid var(--fw-border); background: var(--fw-surface-3); color: var(--fw-text); font: inherit; cursor: pointer; }
.starter-option.chosen { border-color: var(--fw-accent); box-shadow: 0 0 0 2px rgba(44, 116, 105, 0.3); }
.starter-stage { display: block; width: 100%; aspect-ratio: 4 / 5; border-radius: 0.7em; background: radial-gradient(circle at 50% 35%, #fbf6e8, #ece2c6); }

/* \u2500\u2500 \uC8FC\uBBFC \uADF8\uB9BC (04-2) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.image-card { gap: 0.7em; }
.target-ribbon { justify-self: center; display: inline-flex; align-items: center; gap: 0.5em; margin-top: -0.2em; padding: 0.3em 1.2em; border-radius: 0.6em; border: 1.5px solid var(--fw-border-strong); background: var(--fw-surface); }
.target-ribbon .icon { color: var(--fw-leaf); }
.target-ribbon strong { font-size: calc(var(--fs) * 1.1); font-weight: 900; }
.image-stage { display: block; aspect-ratio: 4 / 3.4; border-radius: 0.8em; border: 1.5px solid var(--fw-border); overflow: hidden; }
.file-facts { display: grid; justify-items: center; gap: 0.1em; padding: 0.5em; border-radius: 0.7em; border: 1.5px solid var(--fw-border); background: var(--fw-surface-3); text-align: center; }
.file-facts strong { overflow-wrap: anywhere; }
.file-button { cursor: pointer; }
.file-button.busy { opacity: 0.6; cursor: progress; }
.rules { margin: 0; padding: 0.6em 0.8em 0.6em 2em; border-radius: 0.7em; border: 1.5px solid var(--fw-border); background: var(--fw-surface-3); display: grid; gap: 0.15em; font-size: calc(var(--fs) * 0.9); }
.sliders { gap: 0.2em; }
.sliders .setting-row + .setting-row { border-top: 1px solid var(--fw-border); padding-top: 0.4em; }
.sliders .icon { color: var(--fw-wood-dark); }
.history-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.45em; }
.history-item { display: flex; align-items: center; gap: 0.6em; padding: 0.45em; border-radius: 0.8em; background: var(--fw-surface-3); flex-wrap: wrap; }
.history-thumb { flex: none; display: grid; place-items: center; width: 3.6em; height: 3.6em; border-radius: 0.5em; overflow: hidden; }
.history-thumb img { max-width: 100%; max-height: 100%; object-fit: contain; }

@media (max-width: 380px) {
  .resident-detail { grid-template-columns: 1fr; }
  .detail-stage { aspect-ratio: 4 / 3; }
  .pair-row { grid-template-columns: 1fr; }
  .steps { flex-wrap: wrap; justify-content: center; }
  .step-arrow { display: none; }
  .detail-action { flex-direction: column; gap: 0.1em; font-size: calc(var(--fs) * 0.85); }
}
`;var st="marinara-capability-forest-workshop",pe=class extends HTMLElement{constructor(){super();I(this,"root");I(this,"controller",null);I(this,"diagnostics",null);I(this,"unsubscribe",null);I(this,"styleNode",document.createElement("style"));I(this,"renderedRoute",null);this.root=this.attachShadow({mode:"open"}),this.styleNode.textContent=it+ot}connectedCallback(){this.controller||(this.controller=$e(),this.diagnostics=new J,this.controller.start()),this.unsubscribe?.(),this.unsubscribe=this.controller.store.subscribe(a=>this.render(a)),this.render(this.controller.store.get())}disconnectedCallback(){this.unsubscribe?.(),this.unsubscribe=null}screen(a,n){switch(a.route){case"home":return Be(a,n);case"work":return rt(a,n);case"facilities":return tt(a,n);case"settings":return Ze(a,n);case"backup":return Qe(a,n);case"residents":return _e(a,n);case"relations":return De(a,n);case"register":return We(a,n);case"resident-image":return Ke(a,n);case"diagnostics":return this.diagnostics.start(),v(a,n,{top:{kind:"sub",title:"\uC5F0\uACB0 \uC810\uAC80",back:{route:"backup",label:"\uC800\uC7A5\xB7\uBC31\uC5C5"},resources:!1},backdrop:"wood",body:[this.diagnostics.node],nav:!0});default:return nt(a,n)}}render(a){let n=this.screen(a,this.controller);this.style.setProperty("--fw-font-size",`${a.fontSize}px`);let i=this.root.activeElement,o=i?.id,l=i&&"selectionStart"in i&&typeof i.selectionStart=="number"?[i.selectionStart,i.selectionEnd??i.selectionStart]:null,d=a.route===this.renderedRoute?this.root.querySelector(".scroll")?.scrollTop??0:0;this.root.replaceChildren(this.styleNode,n),this.renderedRoute=a.route;let m=this.root.querySelector(".scroll");if(m&&(m.scrollTop=d),o){let p=this.root.getElementById(o);if(p?.focus({preventScroll:!0}),p&&l&&typeof p.setSelectionRange=="function")try{p.setSelectionRange(l[0],l[1])}catch{}}}};typeof customElements<"u"&&!customElements.get(st)&&customElements.define(st,pe);
