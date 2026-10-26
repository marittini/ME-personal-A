var Et=Object.defineProperty;var Ft=(e,r,a)=>r in e?Et(e,r,{enumerable:!0,configurable:!0,writable:!0,value:a}):e[r]=a;var $=(e,r,a)=>Ft(e,typeof r!="symbol"?r+"":r,a);var D=globalThis.__MARINARA_HOST__;if(!D||D.version!==1||!D.queryClient)throw new Error("Marinara Engine does not provide its query client; this package needs capability API 1.341 or newer.");var Qr=D.queryClient;function $e(){let e=D.api;if(!e?.api)throw new Error("\uC774 Marinara Engine\uC740 \uD328\uD0A4\uC9C0 API \uD074\uB77C\uC774\uC5B8\uD2B8\uB97C \uC81C\uACF5\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.");return e}function M(){return $e().api}function T(e,r){try{let a=e.payload;return typeof a?.message=="string"&&a.message?a.message:$e().getApiErrorMessage(e,r)}catch{return e instanceof Error&&e.message?e.message:r}}function Y(e){let r=e.payload;return typeof r?.error=="string"?r.error:null}function Z(){return typeof crypto<"u"&&typeof crypto.randomUUID=="function"?crypto.randomUUID():`${Date.now().toString(36)}-${Math.random().toString(36).slice(2,12)}`}function E(){if(typeof crypto<"u"&&typeof crypto.randomUUID=="function")return crypto.randomUUID();let e=crypto.getRandomValues(new Uint8Array(16));e[6]=e[6]&15|64,e[8]=e[8]&63|128;let r=[...e].map(a=>a.toString(16).padStart(2,"0")).join("");return`${r.slice(0,8)}-${r.slice(8,12)}-${r.slice(12,16)}-${r.slice(16,20)}-${r.slice(20)}`}var P="/forest-workshop",A={listWorlds:()=>M().get(`${P}/worlds`),createWorld:e=>M().post(`${P}/worlds`,e),getState:e=>M().get(`${P}/state?worldId=${encodeURIComponent(e)}`),heartbeat:e=>M().post(`${P}/heartbeat`,{worldId:e}),sendCommand:e=>M().post(`${P}/commands`,e),getStorage:e=>M().get(`${P}/storage?worldId=${encodeURIComponent(e)}`),getBackup:e=>M().get(`${P}/backup?worldId=${encodeURIComponent(e)}`),listSources:e=>M().get(`${P}/sources?worldId=${encodeURIComponent(e)}`),previewSource:(e,r,a)=>M().get(`${P}/sources/preview?worldId=${encodeURIComponent(e)}&kind=${r}&id=${encodeURIComponent(a)}`),rebuildSuggestion:(e,r)=>M().post(`${P}/rebuild-suggestion`,{worldId:e,source:r}),uploadResidentImage:e=>{let r=new FormData;return r.append("worldId",e.worldId),r.append("residentId",e.residentId),r.append("uploadKey",e.uploadKey),r.append("file",e.file,e.file.name),M().upload(`${P}/residents/image`,r)},restore:(e,r)=>M().post(`${P}/restore`,{newWorldId:e,backup:r})};var Me="\uC232\uACB0 \uACF5\uBC29 \uBC31\uC5C5 \uD30C\uC77C\uC774 \uC544\uB2D9\uB2C8\uB2E4. \uC124\uC815 \u2192 \uC800\uC7A5\xB7\uBC31\uC5C5\uC5D0\uC11C \uB0B4\uBCF4\uB0B8 JSON \uD30C\uC77C\uC744 \uACE8\uB77C \uC8FC\uC138\uC694.";function Ae(e,r){return!e||typeof e!="object"||Array.isArray(e)?0:Object.values(e).filter(r).length}function ze(e){let r=e;if(!r||r.format!=="forest-workshop-backup"||!r.world)return{ok:!1,message:Me};let{settings:a,wallet:n,inventory:i}=r.world;if(typeof a?.worldName!="string"||typeof a.playerNickname!="string")return{ok:!1,message:Me};let o=i&&typeof i=="object"?Object.values(i).filter(s=>typeof s=="number"&&s>0):[];return{ok:!0,summary:{worldName:a.worldName,playerNickname:a.playerNickname,gold:typeof n?.gold=="number"?n.gold:0,itemKinds:o.length,itemTotal:o.reduce((s,l)=>s+l,0),exportedAt:typeof r.exportedAt=="string"?r.exportedAt:"",residents:Ae(r.world.residents,()=>!0),pairs:Ae(r.world.pairs,s=>!s.archived),pictures:Array.isArray(r.assets)?r.assets.length:0}}}var pe={tickets:{label:"\uCD08\uB300\uAD8C",phase:"P3"},weather:{label:"\uD604\uC2E4 \uB0A0\uC528",phase:"P5"},mail:{label:"\uC6B0\uD3B8\uD568",phase:"P4"},stories:{label:"\uC8FC\uBBFC \uC774\uC57C\uAE30",phase:"P4"},explore:{label:"\uD0D0\uC0AC",phase:"P4"},invite:{label:"\uCD08\uB300",phase:"P3"},"work-fields":{label:"\uC7AC\uBC30 \xB7 \uC870\uC0AC \xB7 \uC81C\uC791 \uC2DC\uC124",phase:"P3"},"work-mode":{label:"\uC9C0\uC815 \uD69F\uC218 \uC81C\uC791",phase:"P3"},"auto-sell":{label:"\uC790\uB3D9 \uD310\uB9E4",phase:"P3"},"assign-residents":{label:"\uC8FC\uBBFC \uBC30\uCE58",phase:"P3"},"weather-effects":{label:"\uB0A0\uC528 \uD6A8\uACFC",phase:"P5"},"auto-read":{label:"\uC790\uB3D9 \uC77D\uAE30",phase:"P4"},"ai-guidelines":{label:"AI \uC9C0\uCE68 \uAD00\uB9AC",phase:"P4"},memory:{label:"\uAE30\uC5B5 \uAD00\uB9AC",phase:"P4"},specialty:{label:"\uC804\uBB38 \uBD84\uC57C",phase:"P3"},breakthrough:{label:"\uD328\uC2DC\uBE0C \xB7 \uB3CC\uD30C",phase:"P3"},"pair-memory":{label:"\uD398\uC5B4 \uAE30\uC5B5 \uBCF4\uAE30",phase:"P4"},"pair-guidelines":{label:"\uD398\uC5B4 \uC9C0\uCE68 \uAD00\uB9AC",phase:"P4"}};function ee(e){return e in pe}function Te(e){return pe[e]?.phase??""}function Le(e){let r=pe[e];return r?`${r.label} \uAE30\uB2A5\uC740 \uC900\uBE44 \uC911\uC774\uC5D0\uC694. \uAC1C\uBC1C ${r.phase} \uB2E8\uACC4\uC5D0\uC11C \uC5F4\uB824\uC694.`:""}var Pe="forest-workshop:font-size",F={min:12,max:22,default:16,step:1};function te(e){return Number.isFinite(e)?Math.min(F.max,Math.max(F.min,Math.round(e))):F.default}function je(){try{let e=localStorage.getItem(Pe);return e===null?F.default:te(Number(e))}catch{return F.default}}function We(e){try{localStorage.setItem(Pe,String(te(e)))}catch{}}function Ee(e){let r=e,a=new Set;return{get:()=>r,set(n){let i=typeof n=="function"?n(r):n;r={...r,...i};for(let o of a)o(r)},remember(n){let i=typeof n=="function"?n(r):n;r={...r,...i}},subscribe(n){return a.add(n),()=>a.delete(n)}}}function Fe(e){let{store:r}=e;function a(o){r.set(s=>s.register?{register:{...s.register,...o}}:{})}function n(){let o=r.get().register?.pendingImage;o&&URL.revokeObjectURL(o.previewUrl)}async function i(){let o=e.currentWorld();if(o){a({sources:{state:"loading"}});try{let{sources:s}=await A.listSources(o.worldId);a({sources:{state:"ready",value:s}})}catch(s){a({sources:{state:"error",message:T(s,"\uCE90\uB9AD\uD130\xB7\uD398\uB974\uC18C\uB098 \uBAA9\uB85D\uC744 \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC5B4\uC694.")}})}}}return{openRegister(o=1){n(),r.set({register:{step:o,kindTab:"character",query:"",sources:{state:"loading"},selected:null,preview:null,draft:"",pendingImage:null,starterChoice:null}}),e.navigate("register"),o===1&&i()},closeRegister(){n(),r.set({register:null}),e.navigate("residents")},loadSources:i,setRegisterKind:o=>a({kindTab:o}),setRegisterQuery:o=>a({query:o}),backToSources:()=>a({step:1}),setDraft:o=>r.remember(s=>s.register?{register:{...s.register,draft:o}}:{}),setStarterChoice:o=>a({starterChoice:o}),async chooseSource(o){let s=e.currentWorld();if(s){a({step:2,selected:o,preview:{state:"loading"},draft:""});try{let l=await A.previewSource(s.worldId,o.kind,o.id);a({preview:{state:"ready",value:l}})}catch(l){a({preview:{state:"error",message:T(l,"\uC790\uB8CC\uB97C \uC77D\uC9C0 \uBABB\uD588\uC5B4\uC694.")}})}}},async suggestSetting(){let o=e.currentWorld(),s=r.get().register?.selected;if(!o||!s)return;let l=await e.track("rebuild-suggestion",()=>A.rebuildSuggestion(o.worldId,{kind:s.kind,id:s.id}),"\uC81C\uC548\uC744 \uBC1B\uC9C0 \uBABB\uD588\uC5B4\uC694. \uC9C1\uC811 \uC368\uB3C4 \uB3FC\uC694.");l&&a({draft:l.suggestion})},pickPendingImage(o){n(),a({pendingImage:{file:o,previewUrl:URL.createObjectURL(o)}})},clearPendingImage(){n(),a({pendingImage:null})},async confirmRegister(o,s){let l=r.get().register,p=l?.selected;if(!l||!p||!l.draft.trim())return;let c=`register:${p.kind}:${p.id}`,m=e.requestIdFor(`${c}:id`,c,E);if(!await e.runCommand(c,"residents.register",{residentId:m,source:{kind:p.kind,id:p.id},worldSetting:l.draft}))return;e.forgetRequest(`${c}:id`);let h=o?l.pendingImage:null;h&&await s(m,h.file),n();let x=e.currentWorld();if(x&&x.state.progress.starterResidentId===null){a({step:3,starterChoice:m,pendingImage:null,selected:null,preview:null,draft:""});return}r.set(I=>({register:null,residentsView:{...I.residentsView,selectedId:m}})),e.navigate("residents"),e.notify(`${p.name}\uC744(\uB97C) \uC8FC\uBBFC\uC73C\uB85C \uB4F1\uB85D\uD588\uC5B4\uC694.`)},async confirmStarter(){let o=r.get().register?.starterChoice;!o||!await e.runCommand("choose-starter","residents.chooseStarter",{residentId:o})||(r.set({register:null}),e.navigate("home"),e.notify("\uC2DC\uC791 \uC8FC\uBBFC\uC774 \uACF5\uBC29\uC5D0 \uC654\uC5B4\uC694."))},registerAnother(){a({step:1,query:""}),i()}}}var Bt=6e4;function Be(e){return e.map((r,a)=>({rule:r,index:a})).sort((r,a)=>r.rule.priority-a.rule.priority||r.index-a.index).map(({rule:r})=>r)}function ue(e){return e.map((r,a)=>({...r,priority:Math.min(5,a+1)}))}function fe(e,r,a){return e.work.drafts[a]??Be(r.facilities[a]?.rules??[])}function Oe(e,r,a){let n=e.work.drafts[a];return!!n&&JSON.stringify(n)!==JSON.stringify(Be(r.facilities[a]?.rules??[]))}function re(e){let{activity:r,simMs:a,...n}=e.production;return JSON.stringify([e.inventory,e.wallet,n,r.lastAbsence])}function Ve(e){let{store:r}=e,a,n=!1;function i(){return r.get().content}function o(c){r.set(m=>({work:{...m.work,...c}}))}function s(c,m){let f=e.currentWorld();if(!f)return;let h=fe(r.get(),f.state.production,c);o({drafts:{...r.get().work.drafts,[c]:m(h.map(x=>({...x})))}})}async function l(){let c=e.currentWorld();if(!(!c||n)&&!(typeof document<"u"&&(document.visibilityState!=="visible"||!document.hasFocus()))){n=!0;try{let m=await A.heartbeat(c.worldId),f=e.currentWorld();if(!f||f.worldId!==m.worldId)return;re(f.state)===re(m.state)?e.rememberWorld(m):e.showWorld(m)}catch{}finally{n=!1}}}async function p(){let c=e.currentWorld();if(c)try{let m=await A.getState(c.worldId),f=e.currentWorld();if(!f||f.worldId!==m.worldId)return;re(f.state)===re(m.state)?e.rememberWorld(m):e.showWorld(m)}catch{}}return{heartbeat:l,refreshProduction:p,startHeartbeat(){clearInterval(a),a=setInterval(()=>{l()},Bt),l()},stopHeartbeat(){clearInterval(a),a=void 0},selectFacility(c){o({facilityId:c})},selectRule(c,m){o({selected:{...r.get().work.selected,[c]:m}})},changeTarget(c,m,f){let h=i()?.production.targetStock??{min:1,max:999};s(c,x=>x.map(I=>I.policyId===m?{...I,targetStock:Math.min(h.max,Math.max(h.min,I.targetStock+f))}:I))},toggleRule(c,m){s(c,f=>f.map(h=>h.policyId===m?{...h,enabled:!h.enabled}:h))},moveRule(c,m,f){s(c,h=>{let x=h.findIndex(J=>J.policyId===m),I=x+f;if(x<0||I<0||I>=h.length)return h;let L=[...h];return[L[x],L[I]]=[L[I],L[x]],ue(L)})},addRule(c,m){let f=i()?.production.recommendedRules[c]?.find(x=>x.recipeId===m),h=E();s(c,x=>ue([...x,{policyId:h,enabled:!0,recipeId:m,targetStock:f?.targetStock??10,priority:5}])),o({selected:{...r.get().work.selected,[c]:h}})},removeRule(c,m){s(c,f=>ue(f.filter(h=>h.policyId!==m)))},recommendRules(c){let m=e.currentWorld(),f=i()?.production.recommendedRules[c]??[];if(!m)return;let h=m.state.production.facilities[c]?.rules??[],x=f.map(I=>({policyId:h.find(L=>L.recipeId===I.recipeId)?.policyId??E(),enabled:!0,recipeId:I.recipeId,targetStock:I.targetStock,priority:I.priority}));o({drafts:{...r.get().work.drafts,[c]:x}}),e.notify("\uCD94\uCC9C \uC124\uC815\uC744 \uBD88\uB7EC\uC654\uC5B4\uC694. \uD655\uC778\uD55C \uB4A4 '\uC6B4\uC601 \uADDC\uCE59 \uC801\uC6A9'\uC744 \uB204\uB974\uBA74 \uBC14\uB00C\uC5B4\uC694.")},discardDraft(c){let m={...r.get().work.drafts};delete m[c],o({drafts:m})},async applyRules(c){let m=r.get().work.drafts[c];if(!m||!await e.runCommand(`rules:${c}`,"production.setRules",{facilityId:c,rules:m}))return;let h={...r.get().work.drafts};delete h[c],o({drafts:h}),e.notify("\uC6B4\uC601 \uADDC\uCE59\uC744 \uC801\uC6A9\uD588\uC5B4\uC694. \uC9C0\uAE08 \uC791\uC5C5\uC740 \uADF8\uB300\uB85C \uC774\uC5B4\uC9C0\uACE0 \uB2E4\uC74C \uD68C\uCC28\uBD80\uD130 \uBC14\uB00C\uC5B4\uC694.")},async upgradeFacility(c,m){let f=await e.runCommand(`upgrade:${c}:${m}`,"production.upgradeFacility",{facilityId:c,fromLevel:m});f&&e.notify(`Lv. ${String(f.result.level)}\uB85C \uAC15\uD654\uD588\uC5B4\uC694. \uB2E4\uC74C \uD68C\uCC28\uBD80\uD130 \uBE68\uB77C\uC838\uC694.`)},async setProtected(c,m){await e.runCommand(`protect:${c}`,"production.setProtected",{itemId:c,amount:m})},async sell(c,m){let f=await e.runCommand(`sell:${c}`,"economy.sell",{itemId:c,amount:m});f&&(r.set({sheet:null}),e.notify(`${m}\uAC1C\uB97C \uD314\uC544 ${String(f.result.gold)} G\uB97C \uBC1B\uC558\uC5B4\uC694.`))},async readReports(c){await e.runCommand("reports-read","production.markReportsRead",{throughReportId:c})&&r.set({sheet:null})}}}function De(e,r){let a=r.query.trim().toLowerCase();return Object.values(e.residents).filter(n=>r.tab==="all"||n.kind===r.tab).filter(n=>r.filter==="all"?!0:r.filter==="recruited"?n.recruited:!n.recruited).filter(n=>!a||n.displayName.toLowerCase().includes(a)||n.source.name.toLowerCase().includes(a)).sort((n,i)=>Number(i.recruited)-Number(n.recruited)||n.registeredAt.localeCompare(i.registeredAt))}function ge(e,r){return`pair-add:${[e,r].sort().join(":")}`}function be(e,r){return e.residentIds[0]===r?e.residentIds[1]:e.residentIds[0]}function He(e){let{store:r}=e;function a(i){let o=e.currentWorld();return o&&i?o.state.residents[i]??null:null}function n(i){r.set(o=>({residentsView:{...o.residentsView,...i}}))}return{setResidentsTab:i=>n({tab:i}),setResidentsQuery:i=>n({query:i}),setResidentsFilter:i=>n({filter:i}),selectResident:i=>n({selectedId:i}),openResidents(i){i&&n({selectedId:i}),e.navigate("residents")},openRelations(i){r.set({focusResidentId:i}),e.navigate("relations")},openResidentImage(i){let o=a(i);r.set({focusResidentId:i,placementDraft:o?{...o.image.placement}:null}),e.navigate("resident-image")},openSheet(i){r.set({sheet:i,notice:null})},closeSheet(){r.set({sheet:null})},toggleRelationsEditing(){r.set(i=>({relationsEditing:!i.relationsEditing}))},async updateWorldSetting(i,o){let s=await e.runCommand(`resident-setting:${i}`,"residents.update",{residentId:i,worldSetting:o});return s&&e.notify("\uACF5\uBC29 \uC138\uACC4 \uC124\uC815\uC744 \uACE0\uCCE4\uC5B4\uC694. \uBCC0\uACBD \uC774\uB825\uC5D0 \uB0A8\uC558\uC5B4\uC694."),s},async addPair(i,o){let s=a(i),l=a(o);if(!s||!l)return;let p=ge(s.residentId,l.residentId),c=e.requestIdFor(`${p}:id`,p,E);await e.runCommand(p,"pairs.add",{pairId:c,residentIds:[s.residentId,l.residentId]})&&(e.forgetRequest(`${p}:id`),r.set({sheet:null}),e.notify(`${s.displayName} \xD7 ${l.displayName} \uD398\uC5B4\uB97C \uB9CC\uB4E4\uC5C8\uC5B4\uC694.`))},archivePair:i=>e.runCommand(`pair-archive:${i}`,"pairs.archive",{pairId:i}),restorePair:i=>e.runCommand(`pair-restore:${i}`,"pairs.restore",{pairId:i}),setPlacementDraft(i){r.set(o=>o.placementDraft?{placementDraft:{...o.placementDraft,...i}}:{})},resetPlacementDraft(){let i=r.get().content?.residents.placement;i&&r.set({placementDraft:{scale:i.scale.default,offsetX:i.offsetX.default,markerHeight:i.markerHeight.default}})},async applyPlacement(i){let o=r.get().placementDraft;if(!o)return;await e.runCommand(`placement:${i}`,"residents.setPlacement",{residentId:i,placement:o})&&e.notify("\uBC30\uCE58\uB97C \uC801\uC6A9\uD588\uC5B4\uC694. \uADF8\uB9BC \uD30C\uC77C\uC740 \uADF8\uB300\uB85C\uC608\uC694.")},async uploadResidentImage(i,o){let s=e.currentWorld();if(!s)return null;let l=`image-upload:${i}`,p=e.requestIdFor(l,`${i}:${o.name}:${o.size}:${o.lastModified}`),c=await e.track(l,()=>A.uploadResidentImage({worldId:s.worldId,residentId:i,uploadKey:p,file:o}),"\uADF8\uB9BC\uC744 \uC800\uC7A5\uD558\uC9C0 \uBABB\uD588\uC5B4\uC694. \uAE30\uC874 \uADF8\uB9BC\uC740 \uADF8\uB300\uB85C\uC608\uC694.");if(!c)return null;let m=e.currentWorld()??s;return e.showWorld({worldId:m.worldId,revision:c.revision,updatedAt:new Date().toISOString(),state:c.state}),e.notify(c.duplicate?"\uC774\uBBF8 \uC800\uC7A5\uB41C \uADF8\uB9BC\uC774\uC5D0\uC694.":"\uADF8\uB9BC\uC744 WebP\uB85C \uC800\uC7A5\uD588\uC5B4\uC694."),c},async restoreResidentImage(i,o){await e.runCommand(`image-restore:${i}`,"residents.restoreImage",{residentId:i,reference:o})&&(r.set({sheet:null}),e.notify("\uC774\uC804 \uADF8\uB9BC\uC73C\uB85C \uB418\uB3CC\uB838\uC5B4\uC694."))},async clearImageHistory(){let i=await e.runCommand("image-history-clear","residents.clearImageHistory",{});if(!i)return;r.set({sheet:null});let o=Array.isArray(i.result.released)?i.result.released.length:0;e.notify(o?`\uC774\uC804 \uADF8\uB9BC ${o}\uC7A5\uC744 \uC815\uB9AC\uD588\uC5B4\uC694.`:"\uC815\uB9AC\uD560 \uC774\uC804 \uADF8\uB9BC\uC774 \uC5C6\uC5B4\uC694."),await e.refreshStorage()}}}var he="forest-workshop:last-world";function Ot(){try{return localStorage.getItem(he)}catch{return null}}function Ge(e){try{e?localStorage.setItem(he,e):localStorage.removeItem(he)}catch{}}function Vt(e){let r=e.status;return typeof r=="number"&&r>=400&&r<500&&Y(e)!==null}function Ke(){let e=Ee({route:"worlds",worlds:{state:"loading"},world:null,content:null,busy:{},notice:null,restore:null,fontSize:je(),facilitiesTab:"facilities",storage:null,starterSheetHidden:!1,residentsView:{tab:"all",query:"",filter:"all",selectedId:null},focusResidentId:null,relationsEditing:!1,sheet:null,placementDraft:null,register:null,work:{facilityId:"gather-yard",drafts:{},selected:{}},worldReceivedAt:Date.now()}),r=new Map,a=4e3,n=null,i;e.subscribe(u=>{if(u.notice!==n&&(n=u.notice,clearTimeout(i),n?.kind==="info")){let w=n;i=setTimeout(()=>{e.get().notice===w&&e.set({notice:null})},a)}});function o(u,w,v=Z){let C=r.get(u);if(C&&C.signature===w)return C.id;let z=v();return r.set(u,{id:z,signature:w}),z}function s(u,w){e.set(v=>({busy:{...v.busy,[u]:w}}))}async function l(u,w,v){if(e.get().busy[u])return null;s(u,!0),e.set({notice:null});try{let C=await w();return r.delete(u),C}catch(C){return Vt(C)&&r.delete(u),e.set({notice:{kind:"error",text:T(C,v)}}),Y(C)==="stale_view"&&x(),null}finally{s(u,!1)}}function p(u,w){Ge(u.worldId),e.set(v=>({world:{state:"ready",value:{worldId:u.worldId,revision:u.revision,updatedAt:u.updatedAt,state:u.state}},worldReceivedAt:Date.now(),work:v.world?.state==="ready"&&v.world.value.worldId===u.worldId?v.work:{facilityId:v.work.facilityId,drafts:{},selected:{}},content:w??v.content,route:v.route==="worlds"?"home":v.route}))}function c(u){e.remember({world:{state:"ready",value:{worldId:u.worldId,revision:u.revision,updatedAt:u.updatedAt,state:u.state}},worldReceivedAt:Date.now()})}async function m(){e.set({worlds:{state:"loading"}});try{let{worlds:u}=await A.listWorlds();return e.set({worlds:{state:"ready",value:u}}),u}catch(u){return e.set({worlds:{state:"error",message:T(u,"\uC138\uACC4 \uBAA9\uB85D\uC744 \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.")}}),null}}async function f(u){e.set({world:{state:"loading"},route:"home",notice:null});try{let w=await A.getState(u);p(w,w.content)}catch(w){Y(w)==="world_not_found"&&Ge(null),e.set({world:{state:"error",message:T(w,"\uC138\uACC4\uB97C \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.")}})}}async function h(){let u=I();if(u){e.set({storage:{state:"loading"}});try{e.set({storage:{state:"ready",value:await A.getStorage(u.worldId)}})}catch(w){e.set({storage:{state:"error",message:T(w,"\uC800\uC7A5 \uACF5\uAC04\uC744 \uD655\uC778\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.")}})}}}async function x(){let u=e.get().world;u?.state==="ready"&&await f(u.value.worldId)}function I(){let u=e.get().world;return u?.state==="ready"?u.value:null}function L(u){e.set({route:u,notice:null,restore:null,sheet:null,relationsEditing:!1}),u==="worlds"&&m(),u==="backup"&&h()}async function J(u,w,v={}){let C=I();if(!C)return null;let z=JSON.stringify([C.worldId,w,v]),Wt=o(u,z),X=await l(u,()=>A.sendCommand({worldId:C.worldId,commandId:Wt,expectedRevision:C.revision,type:w,payload:v}),"\uC694\uCCAD\uC744 \uCC98\uB9AC\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4. \uB2E4\uC2DC \uC2DC\uB3C4\uD574 \uC8FC\uC138\uC694.");return X?(p({worldId:C.worldId,revision:X.revision,updatedAt:new Date().toISOString(),state:X.state}),X):null}let Q={store:e,track:l,runCommand:J,currentWorld:I,requestIdFor:o,forgetRequest:u=>r.delete(u),showWorld:p,rememberWorld:c,navigate:L,refreshStorage:h,notify:(u,w="info")=>e.set({notice:{kind:w,text:u}})};return{store:e,...He(Q),...Fe(Q),...Ve(Q),async start(){let u=await m(),w=Ot();u&&w&&u.some(v=>v.worldId===w&&v.readable)&&await f(w)},loadWorlds:m,openWorld:f,reloadWorld:x,navigate:L,notify:Q.notify,notifyLocked(u){e.set({notice:{kind:"info",text:Le(u)}})},setFontSize(u){let w=te(u);We(w),e.set({fontSize:w})},setFacilitiesTab(u){e.set({facilitiesTab:u})},hideStarterSheet(){e.set({starterSheetHidden:!0})},showStarterSheet(){e.set({starterSheetHidden:!1})},dismissNotice(){e.set({notice:null})},async createWorld(u,w){let v=JSON.stringify([u.trim(),w.trim()]),C=o("create-world",v,E),z=await l("create-world",()=>A.createWorld({worldId:C,worldName:u,playerNickname:w}),"\uC138\uACC4\uB97C \uB9CC\uB4E4\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.");z&&p(z,z.content)},runCommand:J,async downloadBackup(){let u=I();if(!u)return;let w=await l("backup",()=>A.getBackup(u.worldId),"\uBC31\uC5C5\uC744 \uB9CC\uB4E4\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.");if(!w)return;let v=new Blob([`${JSON.stringify(w,null,2)}
`],{type:"application/json"}),C=URL.createObjectURL(v),z=document.createElement("a");z.href=C,z.download=`forest-workshop-${u.state.settings.worldName}-${w.exportedAt.slice(0,10)}.json`,document.body.append(z),z.click(),z.remove(),setTimeout(()=>URL.revokeObjectURL(C),1e4),e.set({notice:{kind:"info",text:"\uBC31\uC5C5 \uD30C\uC77C\uC744 \uC800\uC7A5\uD588\uC2B5\uB2C8\uB2E4. \uBE44\uBC00\uD0A4\uB294 \uB4E4\uC5B4 \uC788\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4."}})},async selectRestoreFile(u){let w;try{w=JSON.parse(await u.text())}catch{e.set({restore:null,notice:{kind:"error",text:"\uBC31\uC5C5 \uD30C\uC77C\uC744 \uC77D\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4. JSON \uBC31\uC5C5 \uD30C\uC77C\uC744 \uACE8\uB77C \uC8FC\uC138\uC694."}});return}let v=ze(w);if(!v.ok){e.set({restore:null,notice:{kind:"error",text:v.message}});return}e.set({notice:null,restore:{fileName:u.name,signature:`${u.name}:${u.size}:${u.lastModified}`,backup:w,summary:v.summary}})},cancelRestore(){e.set({restore:null})},async confirmRestore(){let u=e.get().restore;if(!u)return;let w=o("restore",u.signature,E),v=await l("restore",()=>A.restore(w,u.backup),"\uBC31\uC5C5\uC744 \uBCF5\uC6D0\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.");v&&(p(v,v.content),e.set({route:"home",restore:null,notice:{kind:"info",text:`\uBC31\uC5C5\uC744 \uC0C8 \uC138\uACC4 '${v.state.settings.worldName}'(\uC73C)\uB85C \uBCF5\uC6D0\uD588\uC2B5\uB2C8\uB2E4. \uAE30\uC874 \uC138\uACC4\uB294 \uADF8\uB300\uB85C\uC785\uB2C8\uB2E4.`}}))}}}function t(e,r={},a=[]){let n=document.createElement(e);r.className&&(n.className=r.className),r.text!==void 0&&(n.textContent=r.text);for(let[i,o]of Object.entries(r.attrs??{}))o!==void 0&&n.setAttribute(i,o);for(let[i,o]of Object.entries(r.on??{}))o&&n.addEventListener(i,o);r.disabled!==void 0&&"disabled"in n&&(n.disabled=r.disabled);for(let i of a)i==null||i===!1||n.append(typeof i=="string"?document.createTextNode(i):i);return n}function y(e,r,a={}){return t("button",{className:a.variant==="secondary"?"button secondary":"button",text:e,attrs:{type:"button",...a.attrs},disabled:a.disabled,on:{click:r}})}function N(e){return t("p",{className:"muted",text:e,attrs:{role:"status"}})}function B(e){return t("p",{className:"error",text:e,attrs:{role:"alert"}})}function we(e){return e>=1024*1024?`${(e/(1024*1024)).toFixed(1)}MiB`:e>=1024?`${Math.round(e/1024)}KiB`:`${e}B`}var ve="http://www.w3.org/2000/svg";function g(e){return(r="icon")=>{let a=document.createElementNS(ve,"svg");a.setAttribute("viewBox","0 0 24 24"),a.setAttribute("aria-hidden","true"),a.setAttribute("focusable","false"),a.setAttribute("class",r);for(let n of e){let i=typeof n=="string"?{d:n}:n,o=i.circle?document.createElementNS(ve,"circle"):document.createElementNS(ve,"path");i.circle?(o.setAttribute("cx",String(i.circle[0])),o.setAttribute("cy",String(i.circle[1])),o.setAttribute("r",String(i.circle[2]))):o.setAttribute("d",i.d??""),i.fill&&o.setAttribute("class","fill"),a.append(o)}return a}}var d={back:g(["M15 5l-7 7 7 7"]),chevron:g(["M9 5l7 7-7 7"]),gear:g([{circle:[12,12,3.2]},"M19.4 13.5l1.6 1.2-2 3.4-1.9-.7a7.6 7.6 0 0 1-2 1.2l-.3 2h-4l-.3-2a7.6 7.6 0 0 1-2-1.2l-1.9.7-2-3.4 1.6-1.2a7.6 7.6 0 0 1 0-3l-1.6-1.2 2-3.4 1.9.7a7.6 7.6 0 0 1 2-1.2l.3-2h4l.3 2a7.6 7.6 0 0 1 2 1.2l1.9-.7 2 3.4-1.6 1.2a7.6 7.6 0 0 1 0 3z"]),lock:g(["M7 11V8a5 5 0 0 1 10 0v3","M5.5 11h13v9h-13z"]),home:g(["M3.5 11.5L12 4l8.5 7.5","M6 10v10h12V10","M10 20v-5h4v5"]),hammer:g(["M14 4l6 6-2.5 2.5-6-6z","M12.5 8.5L4 17l3 3 8.5-8.5"]),compass:g([{circle:[12,12,8.5]},"M15.5 8.5l-2 5-5 2 2-5z"]),residents:g([{circle:[9,9,3.2]},{circle:[16.5,10,2.6]},"M3.5 19c.8-3.2 3-5 5.5-5s4.7 1.8 5.5 5","M14.5 15.5c2.6-.6 5 .8 6 3.5"]),ticket:g(["M4 7h16v3a2 2 0 0 0 0 4v3H4v-3a2 2 0 0 0 0-4z","M10 9.5c1.5 0 3 1 3 2.5s-1.5 2.5-3 2.5"]),mail:g(["M4 6.5h16v11H4z","M4.5 7l7.5 6 7.5-6"]),weather:g(["M7 18h10a3.5 3.5 0 0 0 .4-7A5 5 0 0 0 7.8 10 4 4 0 0 0 7 18z"]),clock:g([{circle:[12,12,8.5]},"M12 7.5V12l3 2"]),info:g([{circle:[12,12,8.5]},"M12 11v5.5","M12 7.6v.4"]),check:g(["M5 12.5l4.5 4.5L19 7.5"]),eye:g(["M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z",{circle:[12,12,2.8]}]),image:g(["M4 5h16v14H4z",{circle:[9,10,1.6]},"M4.5 17l5-5 4 4 2.5-2.5 3.5 3.5"]),landscape:g(["M4 5h16v14H4z","M4.5 17l5.5-6 4 4 2-2 3.5 4"]),document:g(["M7 3.5h7l4 4V20.5H7z","M14 3.5v4h4","M9.5 12h6","M9.5 15.5h6"]),folder:g(["M3.5 7h6l2 2h9v10h-17z"]),book:g(["M12 6.5c-2-1.3-4.7-1.6-8-1v13c3.3-.6 6-.3 8 1 2-1.3 4.7-1.6 8-1v-13c-3.3-.6-6-.3-8 1z","M12 6.5v13"]),flower:g([{circle:[12,12,2.4]},{circle:[12,6.5,2.6]},{circle:[17.2,10.3,2.6]},{circle:[15.2,16.5,2.6]},{circle:[8.8,16.5,2.6]},{circle:[6.8,10.3,2.6]}]),people:g([{circle:[8,8.5,2.8]},{circle:[16,8.5,2.8]},"M3 19c.6-3 2.5-4.6 5-4.6s4.4 1.6 5 4.6","M11 19c.6-3 2.5-4.6 5-4.6s4.4 1.6 5 4.6"]),pair:g([{circle:[9,12,4.5]},{circle:[15,12,4.5]}]),upload:g(["M12 15.5V4.5","M7.5 9l4.5-4.5L16.5 9","M5 14v5.5h14V14"]),download:g(["M12 4.5v11","M7.5 11l4.5 4.5 4.5-4.5","M5 14v5.5h14V14"]),restore:g(["M4.5 12a7.5 7.5 0 1 0 2.2-5.3","M4.5 4.5v4h4"]),leaf:g(["M5 19c0-8 5-13 14-14-1 9-6 14-14 14z","M5 19l7-7"]),sprout:g(["M12 20v-8","M12 12c0-3.5-2.5-6-6.5-6 0 3.5 2.5 6 6.5 6z","M12 12c0-3.5 2.5-6 6.5-6 0 3.5-2.5 6-6.5 6z"]),search:g([{circle:[10.5,10.5,6]},"M15 15l5 5"]),jar:g(["M8 4.5h8v3H8z","M7 7.5h10l1 3v8a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-8z","M9 14h6"]),box:g(["M3.5 8l8.5-4 8.5 4v9l-8.5 4-8.5-4z","M3.5 8l8.5 4 8.5-4","M12 12v9"]),house:g(["M4 11l8-6.5 8 6.5","M6.5 9.5V19h11V9.5","M10.5 19v-4.5h3V19"]),pencil:g(["M15.5 4.5l4 4L9 19H5v-4z","M13.5 6.5l4 4"]),swap:g(["M5 9h12l-3-3","M19 15H7l3 3"]),minus:g(["M6 12h12"]),plus:g(["M6 12h12","M12 6v12"]),grip:g([{circle:[9,7,1.2],fill:!0},{circle:[15,7,1.2],fill:!0},{circle:[9,12,1.2],fill:!0},{circle:[15,12,1.2],fill:!0},{circle:[9,17,1.2],fill:!0},{circle:[15,17,1.2],fill:!0}]),menu:g(["M5 8h14","M5 12h14","M5 16h14"]),filter:g(["M4 5.5h16l-6 7.5v5.5l-4 1.5v-7z"]),heart:g(["M12 19s-7-4.4-7-9.5A4 4 0 0 1 12 7a4 4 0 0 1 7 2.5C19 14.6 12 19 12 19z"]),sparkle:g(["M12 4l1.8 5.2L19 11l-5.2 1.8L12 18l-1.8-5.2L5 11l5.2-1.8z"]),zoom:g([{circle:[10.5,10.5,6]},"M15 15l5 5","M10.5 8v5","M8 10.5h5"]),arrows:g(["M4 12h16","M7.5 8.5L4 12l3.5 3.5","M16.5 8.5L20 12l-3.5 3.5"]),updown:g(["M12 4v16","M8.5 7.5L12 4l3.5 3.5","M8.5 16.5L12 20l3.5-3.5"]),archive:g(["M3.5 5h17v4h-17z","M5 9v10h14V9","M10 13h4"]),berry:g([{circle:[9,13,3.6]},{circle:[15,13,3.6]},{circle:[12,17.5,3.6]},"M12 9.5V5","M12 6.5c1.5-1.8 3.5-2 5-1.5"]),log:g([{circle:[7.5,12,3.8]},"M7.5 8.2h11a3.8 3.8 0 0 1 0 7.6h-11",{circle:[7.5,12,1.3]}]),hourglass:g(["M7 4h10","M7 20h10","M8 4c0 5 8 5 8 8s-8 3-8 8","M16 4c0 5-8 5-8 8s8 3 8 8"]),up:g(["M6 15l6-6 6 6"]),down:g(["M6 9l6 6 6-6"]),addImage:g(["M6 3.5h8l4 4v13H6z","M14 3.5v4h4","M9 16l2.5-3 2 2 1-1.2",{circle:[17.5,17.5,3.5]},"M17.5 16v3","M16 17.5h3"])};function ae(e){return t("span",{className:"lock-tag",attrs:{"aria-hidden":"true"}},[d.lock("icon tiny"),Te(e)])}function S(e,r,a){let n=ee(r)||!a.onOpen;return t("button",{className:`${a.className}${n?" is-locked":""}`,attrs:{type:"button","aria-label":n?`${a.label} (\uC900\uBE44 \uC911)`:a.label},on:{click:()=>n?e.notifyLocked(r):a.onOpen?.()}},[...a.children,n?ae(r):null])}function qe(e,r,a,n=""){return t("div",{className:`locked-block ${n}`.trim(),attrs:{role:"button",tabindex:"0","aria-label":"\uC900\uBE44 \uC911\uC778 \uAE30\uB2A5 \u2014 \uB204\uB974\uBA74 \uC5F4\uB9AC\uB294 \uB2E8\uACC4\uB97C \uC54C\uB824 \uB4DC\uB824\uC694"},on:{click:()=>e.notifyLocked(r),keydown:i=>{let o=i.key;(o==="Enter"||o===" ")&&(i.preventDefault(),e.notifyLocked(r))}}},[...a,t("span",{className:"locked-veil"},[ae(r),t("span",{text:"\uC900\uBE44 \uC911"})])])}var Dt=[{label:"\uD648",icon:d.home,routes:["home","settings","backup","diagnostics"]},{label:"\uC791\uC5C5",icon:d.hammer,routes:["work","facilities"]},{label:"\uD0D0\uC0AC",icon:d.compass,routes:[],feature:"explore"},{label:"\uC8FC\uBBFC",icon:d.residents,routes:["residents","relations","resident-image"]},{label:"\uCD08\uB300",icon:d.ticket,routes:[],feature:"invite"}];function Ue(e,r){return t("nav",{className:"tabbar",attrs:{"aria-label":"\uACF5\uBC29 \uBA54\uB274"}},Dt.map(a=>{let n=a.feature?ee(a.feature):!1,i=a.routes.includes(e.route);return t("button",{className:`tab${i?" current":""}${n?" is-locked":""}`,attrs:{type:"button","aria-current":i?"page":void 0,"aria-label":n?`${a.label} (\uC900\uBE44 \uC911)`:a.label},on:{click:()=>{n&&a.feature?r.notifyLocked(a.feature):a.routes[0]&&r.navigate(a.routes[0])}}},[t("span",{className:"tab-icon"},[a.icon("icon tab-glyph"),n&&a.feature?ae(a.feature):null]),t("span",{className:"tab-label",text:a.label})])}))}function _e(e,r){let a=e.world?.state==="ready"?e.world.value:null;if(!a)return null;let n=a.state.wallet.gold.toLocaleString("ko-KR");return t("div",{className:"resources"},[t("span",{className:"counter gold",attrs:{"aria-label":`\uACE8\uB4DC ${n}`}},[t("span",{className:"coin",attrs:{"aria-hidden":"true"}}),t("span",{className:"counter-value",text:n})]),S(r,"tickets",{className:"counter ticket",label:"\uCD08\uB300\uAD8C",children:[t("span",{className:"ticket-mark"},[d.ticket("icon")]),t("span",{className:"counter-value",text:"\u2013"})]}),e.route==="settings"?null:t("button",{className:"icon-button gear",attrs:{type:"button","aria-label":"\uC124\uC815"},on:{click:()=>r.navigate("settings")}},[d.gear()])])}function Je(e,r,a){if(a.kind==="home")return t("header",{className:"top top-home"},[t("div",{className:"top-row"},[t("h1",{className:"sign sign-home",text:"\uC232\uACB0 \uACF5\uBC29",attrs:{id:"fw-screen-title"}}),_e(e,r)]),t("div",{className:"top-row second"},[S(r,"weather",{className:"chip-button weather",label:"\uD604\uC2E4 \uB0A0\uC528",children:[d.weather(),t("span",{text:"\uB0A0\uC528"})]}),S(r,"mail",{className:"icon-button mail",label:"\uC6B0\uD3B8\uD568",children:[d.mail()]})])]);let n=a.back;return t("header",{className:`top top-sub${a.resources?" with-resources":""}`},[t("div",{className:"top-row"},[n?t("button",{className:"back-button",attrs:{type:"button","aria-label":`${n.label}(\uC73C)\uB85C \uB3CC\uC544\uAC00\uAE30`},on:{click:()=>r.navigate(n.route)}},[d.back()]):t("span",{className:"back-spacer",attrs:{"aria-hidden":"true"}}),t("h1",{className:"sign",text:a.title,attrs:{id:"fw-screen-title"}}),a.resources?_e(e,r):null]),a.subtitle?t("p",{className:"ribbon",text:a.subtitle}):null])}function Ht(e,r){return e.notice?t("div",{className:`notice ${e.notice.kind}`,attrs:{role:e.notice.kind==="error"?"alert":"status"}},[t("p",{text:e.notice.text}),t("button",{className:"notice-close",text:"\uB2EB\uAE30",attrs:{type:"button","aria-label":"\uC54C\uB9BC \uB2EB\uAE30"},on:{click:()=>r.dismissNotice()}})]):null}function R(e,r,a){return t("div",{className:`shell backdrop-${a.backdrop}${a.nav?" has-nav":""}${e.notice?" has-notice":""}`},[t("div",{className:"scroll"},[t("div",{className:"column"},[Je(e,r,a.top),a.hero??null,t("main",{className:"page",attrs:{"aria-labelledby":"fw-screen-title"}},a.body)])]),Ht(e,r),a.nav?Ue(e,r):null,a.sheet??null])}function k(e,r,a={}){return t("section",{className:`card ${a.className??""}`.trim(),attrs:a.id?{"aria-labelledby":a.id}:{}},[e?t("h2",{className:"section-title",text:e,attrs:a.id?{id:a.id}:{}}):null,...r])}var ne="/forest-workshop/p0",Gt={pass:"\uD1B5\uACFC",fail:"\uC2E4\uD328",unavailable:"\uC0AC\uC6A9 \uBD88\uAC00"};function b(e,r={},a=[]){let n=document.createElement(e);r.className&&(n.className=r.className),r.text!==void 0&&(n.textContent=r.text);for(let[i,o]of Object.entries(r.attrs??{}))n.setAttribute(i,o);for(let i of a)i&&n.append(i);return n}var ie=class{constructor(){$(this,"node",b("div",{className:"diagnostics"}));$(this,"started",!1);$(this,"status",{state:"loading"});$(this,"probe",null);$(this,"image",{state:"loading"});$(this,"uploading",!1);$(this,"uploadError",null);$(this,"pendingUpload",null)}start(){this.started||(this.started=!0,this.render(),this.loadStatus(),this.loadImage())}async loadStatus(){this.status={state:"loading"},this.render();try{this.status={state:"ready",value:await M().get(`${ne}/status`)}}catch(r){this.status={state:"error",message:T(r,"\uD328\uD0A4\uC9C0 \uC0C1\uD0DC\uB97C \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.")}}this.render()}async loadImage(){this.image={state:"loading"},this.render();try{let r=await M().get(`${ne}/image`);this.image={state:"ready",value:r.current}}catch(r){this.image={state:"error",message:T(r,"\uC800\uC7A5\uB41C \uADF8\uB9BC\uC744 \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.")}}this.render()}async runProbe(){if(this.probe?.state!=="loading"){this.probe={state:"loading"},this.render();try{let r=await M().post(`${ne}/probe`);this.probe={state:"ready",value:r.checks}}catch(r){this.probe={state:"error",message:T(r,"\uC5F0\uACB0 \uC810\uAC80\uC744 \uC2E4\uD589\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.")}}this.render()}}async upload(r){if(this.uploading)return;let a=this.pendingUpload?.file===r?this.pendingUpload:{file:r,key:Z()};this.pendingUpload=a,this.uploading=!0,this.uploadError=null,this.render();try{let n=new FormData;n.append("uploadKey",a.key),n.append("file",r,r.name);let i=await M().upload(`${ne}/image`,n);this.image={state:"ready",value:i.image},this.pendingUpload=null}catch(n){this.uploadError=T(n,"\uADF8\uB9BC\uC744 \uC62C\uB9AC\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4. \uAE30\uC874 \uADF8\uB9BC\uC740 \uADF8\uB300\uB85C\uC785\uB2C8\uB2E4.")}finally{this.uploading=!1,this.render()}}render(){this.node.replaceChildren(b("p",{className:"muted",text:"\uC5D4\uC9C4 \uC5F0\uACB0\uACFC \uC8FC\uBBFC \uADF8\uB9BC \uC800\uC7A5 \uACBD\uB85C\uB97C \uD655\uC778\uD569\uB2C8\uB2E4. \uACB0\uACFC\uB294 \uC138\uACC4\uC5D0 \uC601\uD5A5\uC744 \uC8FC\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4."}),this.renderStatus(),this.renderProbe(),this.renderImage())}retryButton(r,a){let n=b("button",{className:"button secondary",text:r,attrs:{type:"button"}});return n.addEventListener("click",a),n}renderStatus(){let r=b("section",{className:"card",attrs:{"aria-labelledby":"fw-status"}},[b("h2",{text:"\uC5D4\uC9C4 \uC5F0\uACB0",attrs:{id:"fw-status"}})]);if(this.status.state==="loading")r.append(b("p",{className:"muted",text:"\uBD88\uB7EC\uC624\uB294 \uC911\u2026",attrs:{role:"status"}}));else if(this.status.state==="error")r.append(b("p",{className:"error",text:this.status.message,attrs:{role:"alert"}}),this.retryButton("\uB2E4\uC2DC \uC2DC\uB3C4",()=>{this.loadStatus()}));else{let{value:a}=this.status;r.append(b("p",{className:"muted",text:`\uD328\uD0A4\uC9C0 ${a.version} \xB7 \uB2E8\uACC4 ${a.stage}`}),b("ul",{className:"list"},a.host.map(n=>b("li",{className:"row"},[b("span",{className:"name",text:n.name}),b("span",{className:`badge ${n.available?"pass":n.required?"fail":"unavailable"}`,text:n.available?"\uC788\uC74C":n.required?"\uC5C6\uC74C (\uD544\uC218)":"\uC5C6\uC74C"})]))))}return r}renderProbe(){let r=b("button",{className:"button",text:this.probe?.state==="loading"?"\uC810\uAC80 \uC911\u2026":"\uC5F0\uACB0 \uC810\uAC80 \uC2E4\uD589",attrs:{type:"button"}});r.disabled=this.probe?.state==="loading",r.addEventListener("click",()=>{this.runProbe()});let a=b("section",{className:"card",attrs:{"aria-labelledby":"fw-probe"}},[b("h2",{text:"\uC800\uC7A5\xB7\uC790\uB8CC\xB7\uBAA8\uB378 \uC810\uAC80",attrs:{id:"fw-probe"}}),b("p",{className:"muted",text:"\uC784\uC2DC \uBB38\uC11C\uB97C \uC4F0\uACE0 \uC9C0\uC6C1\uB2C8\uB2E4. \uCE90\uB9AD\uD130\xB7\uD398\uB974\uC18C\uB098 \uC6D0\uBCF8\uC740 \uC77D\uAE30\uB9CC \uD558\uBA70, \uBAA8\uB378 \uC0DD\uC131 \uC694\uCCAD\uC740 \uBCF4\uB0B4\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4."}),r]);return!this.probe||this.probe.state==="loading"?a:this.probe.state==="error"?(a.append(b("p",{className:"error",text:this.probe.message,attrs:{role:"alert"}})),a):(a.append(b("ul",{className:"list",attrs:{"aria-live":"polite"}},this.probe.value.map(n=>b("li",{className:"row stacked"},[b("div",{className:"row-head"},[b("span",{className:"name",text:n.label}),b("span",{className:`badge ${n.status}`,text:Gt[n.status]})]),b("span",{className:"detail",text:n.detail})])))),a)}renderImage(){let r=b("input",{className:"file",attrs:{type:"file",accept:"image/png,image/webp",id:"fw-file"}});r.disabled=this.uploading,r.addEventListener("change",()=>{let n=r.files?.[0];n&&this.upload(n)});let a=b("section",{className:"card",attrs:{"aria-labelledby":"fw-image"}},[b("h2",{text:"\uC8FC\uBBFC \uADF8\uB9BC \uC800\uC7A5 \uC810\uAC80",attrs:{id:"fw-image"}}),b("p",{className:"muted",text:"PNG \uB610\uB294 \uC815\uC801 WebP(\uCD5C\uB300 20MiB, 4096\xD74096)\uB97C \uACE0\uB974\uBA74 \uD22C\uBA85\uB3C4\uB97C \uC720\uC9C0\uD55C WebP \uD488\uC9C895\uB85C \uBC14\uAFD4 \uC804\uC5ED \uAC24\uB7EC\uB9AC\uC5D0 \uC800\uC7A5\uD569\uB2C8\uB2E4. PNG \uC6D0\uBCF8\uC740 \uBCF4\uAD00\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4."}),b("label",{className:"field-label",text:"\uADF8\uB9BC \uD30C\uC77C \uACE0\uB974\uAE30",attrs:{for:"fw-file"}}),r]);if(this.uploading&&a.append(b("p",{className:"muted",text:"\uBCC0\uD658\uD558\uACE0 \uC800\uC7A5\uD558\uB294 \uC911\u2026",attrs:{role:"status"}})),this.uploadError){a.append(b("p",{className:"error",text:this.uploadError,attrs:{role:"alert"}}));let n=this.pendingUpload;n&&!this.uploading&&a.append(this.retryButton("\uAC19\uC740 \uD30C\uC77C\uB85C \uB2E4\uC2DC \uC2DC\uB3C4",()=>{this.upload(n.file)}))}if(this.image.state==="loading")a.append(b("p",{className:"muted",text:"\uBD88\uB7EC\uC624\uB294 \uC911\u2026",attrs:{role:"status"}}));else if(this.image.state==="error")a.append(b("p",{className:"error",text:this.image.message,attrs:{role:"alert"}}),this.retryButton("\uB2E4\uC2DC \uBD88\uB7EC\uC624\uAE30",()=>{this.loadImage()}));else if(!this.image.value)a.append(b("p",{className:"empty",text:"\uC544\uC9C1 \uC800\uC7A5\uB41C \uADF8\uB9BC\uC774 \uC5C6\uC2B5\uB2C8\uB2E4."}));else{let n=this.image.value,i=b("img",{className:"preview",attrs:{src:`${n.url}${n.url.includes("?")?"&":"?"}v=${n.imageVersion}`,alt:"\uC800\uC7A5\uB41C \uC8FC\uBBFC \uADF8\uB9BC \uBBF8\uB9AC\uBCF4\uAE30",width:String(n.width),height:String(n.height)}});a.append(b("div",{className:"stage"},[i]),b("dl",{className:"facts"},[b("dt",{text:"\uCC38\uC870"}),b("dd",{text:n.reference}),b("dt",{text:"\uD06C\uAE30"}),b("dd",{text:`${n.width}\xD7${n.height}`}),b("dt",{text:"\uC6A9\uB7C9"}),b("dd",{text:`\uC785\uB825 ${we(n.inputBytes)} \u2192 WebP ${we(n.outputBytes)}`}),b("dt",{text:"\uD22C\uBA85\uB3C4"}),b("dd",{text:n.hasTransparency?"\uD22C\uBA85 \uC601\uC5ED \uC788\uC74C (\uC720\uC9C0\uB428)":"\uBD88\uD22C\uBA85 \uADF8\uB9BC"}),b("dt",{text:"\uBC84\uC804"}),b("dd",{text:String(n.imageVersion)})]))}return a}};var Kt="http://www.w3.org/2000/svg";function Qe(e){let r=document.createElementNS(Kt,"svg");return r.setAttribute("viewBox","0 0 60 80"),r.setAttribute("aria-hidden","true"),r.setAttribute("class",e),r.innerHTML='<circle cx="30" cy="24" r="15"/><path d="M6 80c0-17 11-29 24-29s24 12 24 29z"/>',r}function Xe(e,r){let a=e.image.current;return t("img",{className:r,attrs:{src:`${a.url}${a.url.includes("?")?"&":"?"}v=${encodeURIComponent(a.reference)}`,alt:"",width:String(a.width),height:String(a.height),decoding:"async",draggable:"false"}})}function O(e,r={}){let a=r.placement??e.image.placement,n=t("span",{className:"figure",attrs:{"aria-hidden":"true"}});if(!e.image.current)return n.append(t("span",{className:"figure-empty"},[Qe("figure-silhouette"),t("span",{className:"figure-empty-text",text:"PNG \uB4F1\uB85D"})])),n;let i=t("span",{className:"figure-body"},[Xe(e,"figure-image")]);if(i.style.height=`${a.scale*.9}%`,i.style.left=`${50+a.offsetX*.5}%`,n.append(i),r.marker){let o=t("span",{className:"figure-marker"},[d.leaf("icon tiny")]);o.style.bottom=`calc(${a.scale*.9}% + ${a.markerHeight*.4}%)`,o.style.left=`${50+a.offsetX*.5}%`,n.append(o)}return n}function H(e,r="small"){let a=t("span",{className:`avatar ${r}`,attrs:{"aria-hidden":"true"}});return e?.image.current?a.append(Xe(e,"avatar-image")):(a.append(Qe("avatar-silhouette")),e||a.append(t("span",{className:"avatar-unknown",text:"?"}))),a}var K={character:"\uCE90\uB9AD\uD130",persona:"\uD398\uB974\uC18C\uB098"};function V(e){return t("span",{className:`tag ${e.kind}`,text:K[e.kind]})}var qt="http://www.w3.org/2000/svg";function Ut(){let e=document.createElementNS(qt,"svg");return e.setAttribute("viewBox","0 0 390 300"),e.setAttribute("preserveAspectRatio","xMidYMax slice"),e.setAttribute("aria-hidden","true"),e.setAttribute("class","scene-art"),e.innerHTML=`
    <g stroke="#4b2e1a" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
      <rect width="390" height="300" fill="#cfe5c0" stroke="none"/>
      <path d="M-10 70 Q20 10 70 30 Q100 -10 150 20 L150 -10 H-10z" fill="#8fbf6e"/>
      <path d="M400 80 Q370 20 320 40 Q300 -5 250 15 L250 -10 H400z" fill="#e2a55a"/>
      <circle cx="60" cy="120" r="34" fill="#8fbf6e"/>
      <circle cx="335" cy="115" r="30" fill="#8fbf6e"/>
      <path d="M-5 215 Q100 188 200 203 T395 198 V305 H-5z" fill="#a9cc86"/>
      <g transform="translate(150 70)">
        <rect x="0" y="62" width="170" height="108" rx="6" fill="#b98250"/>
        <rect x="10" y="74" width="150" height="96" fill="#dcb07c"/>
        <path d="M-22 70 L85 8 L192 70 Z" fill="#3f8a86"/>
        <path d="M10 62 L85 20 L160 62" fill="none" stroke-width="2.5"/>
        <rect x="66" y="104" width="38" height="66" rx="4" fill="#7a4b2a"/>
        <rect x="20" y="96" width="34" height="30" rx="3" fill="#f8de98"/>
        <rect x="116" y="96" width="34" height="30" rx="3" fill="#f8de98"/>
        <rect x="56" y="78" width="58" height="18" rx="3" fill="#f6e9cb"/>
        <circle cx="147" cy="84" r="7" fill="#f5c45c"/>
      </g>
      <path d="M150 305 Q190 240 235 240 Q280 240 302 305z" fill="#ead6a8"/>
      <circle cx="40" cy="232" r="25" fill="#6fa452"/><circle cx="76" cy="248" r="19" fill="#6fa452"/>
      <circle cx="350" cy="232" r="23" fill="#6fa452"/><circle cx="318" cy="250" r="17" fill="#6fa452"/>
      <g stroke-width="2"><circle cx="30" cy="224" r="4" fill="#fff6e4"/><circle cx="54" cy="240" r="4" fill="#fff6e4"/>
      <circle cx="345" cy="226" r="4" fill="#fff6e4"/><circle cx="326" cy="246" r="4" fill="#fff6e4"/>
      <circle cx="70" cy="232" r="4" fill="#d5a9e3"/><circle cx="360" cy="246" r="4" fill="#d5a9e3"/></g>
    </g>`,e}function _t(e){let r=e.progress.starterResidentId;return Object.values(e.residents).filter(a=>a.recruited).sort((a,n)=>+(n.residentId===r)-+(a.residentId===r)||a.registeredAt.localeCompare(n.registeredAt)).slice(0,2)}function Ye(e,r,a,n){if(r)return t("button",{className:`resident-spot filled ${e}`,attrs:{type:"button","aria-label":`${r.displayName} \uBCF4\uAE30`},on:{click:()=>n.openResidents(r.residentId)}},[O(r),t("span",{className:"spot-name",text:r.displayName})]);if(a.progress.starterResidentId===null&&e==="left"){let i=Object.keys(a.residents).length>0;return t("button",{className:`resident-spot invite ${e}`,attrs:{type:"button"},on:{click:()=>n.openRegister(i?3:1)}},[t("span",{className:"spot-shadow"}),t("span",{className:"spot-text",text:i?"\uC2DC\uC791 \uC8FC\uBBFC \uACE0\uB974\uAE30":"\uC8FC\uBBFC \uB9DE\uC774\uD558\uAE30"})])}return S(n,"invite",{className:`resident-spot ${e}`,label:"\uC8FC\uBBFC \uC790\uB9AC",children:[t("span",{className:"spot-shadow"}),t("span",{className:"spot-text",text:"\uC8FC\uBBFC"})]})}function Ze(e,r){let a=e.world?.state==="ready"?e.world.value.state:null,n=a?_t(a):[];return t("section",{className:"scene",attrs:{"aria-label":"\uACF5\uBC29 \uC7A5\uBA74"}},[Ut(),a?t("div",{className:"scene-stage"},[Ye("left",n[0]??null,a,r),Ye("right",n[1]??null,a,r)]):null,n.length===0?t("p",{className:"scene-caption"},[d.leaf("icon tiny"),"\uC8FC\uBBFC\uC744 \uB9DE\uC774\uD558\uBA74 \uC774\uACF3\uC5D0 \uBAA8\uC5EC\uC694"]):null])}function Jt(e,r){return e.items.find(a=>a.id===r)?.name??r}function et(e,r){let a=e.world?.state==="ready"?e.world.value:null,n=e.content;if(!a||!n||a.state.progress.starterKitClaimed||e.starterSheetHidden)return null;let i=!!e.busy["claim-starter-kit"],o=n.starterKit;return t("div",{className:"sheet-backdrop"},[t("section",{className:"sheet card",attrs:{role:"dialog","aria-modal":"true","aria-labelledby":"fw-starter"}},[t("h2",{className:"section-title",text:"\uACF5\uBC29 \uC2DC\uC791 \uAFB8\uB7EC\uBBF8",attrs:{id:"fw-starter"}}),t("p",{className:"muted",text:"\uCCAB \uCC44\uC9D1\uACFC \uAC00\uACF5\uC744 \uC2DC\uC791\uD560 \uC7AC\uB8CC\uC608\uC694. \uD55C \uBC88\uB9CC \uBC1B\uC744 \uC218 \uC788\uC5B4\uC694."}),t("ul",{className:"kit"},[t("li",{className:"kit-item"},[t("span",{className:"coin"}),t("span",{text:"\uACE8\uB4DC"}),t("strong",{text:o.gold.toLocaleString("ko-KR")})]),...Object.entries(o.items).map(([s,l])=>t("li",{className:"kit-item"},[d.leaf("icon"),t("span",{text:Jt(n,s)}),t("strong",{text:l.toLocaleString("ko-KR")})]))]),y(i?"\uBC1B\uB294 \uC911\u2026":"\uBC1B\uAE30",()=>{r.runCommand("claim-starter-kit","onboarding.claimStarterKit")},{disabled:i,attrs:{"data-wide":""}}),y("\uB098\uC911\uC5D0",()=>r.hideStarterSheet(),{variant:"secondary",attrs:{"data-wide":""}})])])}var Qt={"wild-berry":d.berry,herb:d.leaf,wood:d.log,"berry-jam":d.jar};function j(e,r){return e?.items.find(a=>a.id===r)?.name??r}function Xt(e,r="icon"){return(Qt[e]??d.box)(r)}function W(e,r="small"){return t("span",{className:`item-tile ${r} item-${e}`,attrs:{"aria-hidden":"true"}},[Xt(e,"icon")])}function G(e,r){return e?.recipes.find(a=>a.id===r)??null}function oe(e,r){return e?.facilities.find(a=>a.id===r)??null}function q(e){let r=Math.max(0,Math.ceil(e/1e3)),a=Math.floor(r/3600),n=Math.floor(r%3600/60),i=r%60,o=s=>String(s).padStart(2,"0");return a?`${a}:${o(n)}:${o(i)}`:`${o(n)}:${o(i)}`}function U(e){let r=e/36e5;return r>=10||Number.isInteger(r)?`${Math.floor(r)}`:r.toFixed(1)}function tt(e,r,a){return Math.max(6e4,Math.round(r.minutes*6e4/(1+e.production.speedBonusPerLevel*(a-1))))}function _(e,r){return Math.round((e?.production.speedBonusPerLevel??0)*(r-1)*100)}function Yt(e,r,a){return e.worldReceivedAt+(a.endsSim-r.state.production.simMs)}function rt(e,r,a){let n=Yt(e,r,a),i=a.endsSim-a.startedSim,o=t("span",{className:"bar-fill",attrs:{"data-progress-end":String(n),"data-progress-total":String(i)}}),s=Math.max(0,n-Date.now());return o.style.width=`${Math.round((i-s)/Math.max(1,i)*100)}%`,{bar:t("span",{className:"bar teal"},[o]),countdown:t("span",{className:"countdown",text:q(s),attrs:{"data-countdown-end":String(n)}})}}function at(e,r){if(!r)return"";if(r.reason==="no_rules")return"\uCF1C \uB454 \uC6B4\uC601 \uADDC\uCE59\uC774 \uC5C6\uC5B4 \uC26C\uACE0 \uC788\uC5B4\uC694.";if(r.reason==="target_reached")return"\uBAA8\uB4E0 \uBAA9\uD45C \uC7AC\uACE0\uB97C \uCC44\uC6CC \uC26C\uACE0 \uC788\uC5B4\uC694. \uC7AC\uACE0\uAC00 \uC904\uBA74 \uB2E4\uC2DC \uC2DC\uC791\uD574\uC694.";let a=j(e,r.itemId??""),n=r.protectedAmount?` (\uBCF4\uD638 ${r.protectedAmount}\uAC1C\uB294 \uC4F0\uC9C0 \uC54A\uC544\uC694)`:"";return`${a}\uC774(\uAC00) \uBD80\uC871\uD574 \uAE30\uB2E4\uB9AC\uB294 \uC911: \uD55C \uBC88\uC5D0 ${r.needed??"?"}\uAC1C \uD544\uC694, \uC4F8 \uC218 \uC788\uB294 \uC591 ${r.usable??0}\uAC1C${n}.`}function nt(e){let r=e.state.production.reportsReadThrough;return e.state.production.reports.filter(a=>a.reportId>r)}function ye(e,r){let a={};for(let n of e)for(let[i,o]of Object.entries(n[r]))a[i]=(a[i]??0)+o;return a}function Zt(e){let r=Object.values(e.state.production.facilities);return r.some(a=>a.waiting?.reason==="materials")?"\uC7AC\uB8CC\uB97C \uAE30\uB2E4\uB9AC\uB294 \uC2DC\uC124\uC774 \uC788\uC5B4\uC694":r.some(a=>a.job)?"\uACF5\uBC29\uC774 \uC798 \uB3CC\uC544\uAC00\uACE0 \uC788\uC5B4\uC694":"\uACF5\uBC29\uC774 \uC26C\uACE0 \uC788\uC5B4\uC694"}function it(e,r,a){let n=nt(e),i=Object.entries(ye(n,"produced")).sort(([,s],[,l])=>l-s),o=s=>s?t("div",{className:"report-slot"},[W(s[0],"big"),t("span",{className:"slot-name",text:j(r,s[0])}),t("strong",{text:`+${s[1]}`})]):t("div",{className:"report-slot empty"},[t("span",{className:"slot-art"}),t("span",{className:"slot-name",text:"\uC0C8 \uC785\uACE0 \uC5C6\uC74C"}),t("strong",{text:"\u2013"})]);return k(null,[t("h2",{className:"report-title",text:Zt(e)}),t("div",{className:"report-body"},[t("div",{className:"report-items"},[o(i[0]),o(i[1])]),t("div",{className:"report-actions"},[t("button",{className:"button report-button",attrs:{type:"button"},on:{click:()=>a.openSheet({kind:"work-report"})}},[t("span",{text:"\uC791\uC5C5 \uBCF4\uACE0"}),n.length?t("span",{className:"count-badge",text:String(n.length)}):null,d.chevron("icon")]),t("span",{className:"report-caption"},[d.leaf("icon tiny"),"\uC790\uB3D9 \uC785\uACE0 \uC644\uB8CC"])])])],{className:"report-card"})}function ot(e,r,a){let n=e.state.production.activity.lastAbsence,i=r?.production.absenceLimitMs??72*36e5;return t("button",{className:"strip offline",attrs:{type:"button"},on:{click:()=>a.notify(n&&n.totalMs>n.creditedMs?`\uC9C0\uB09C\uBC88\uC5D4 ${U(n.totalMs)}\uC2DC\uAC04 \uBE44\uC6E0\uACE0, \uADF8\uC911 \uCD5C\uB300 72\uC2DC\uAC04\uB9CC \uACF5\uBC29\uC774 \uC77C\uD588\uC5B4\uC694. \uB0A8\uC740 \uC791\uC5C5\uC740 \uBA48\uCD98 \uC790\uB9AC\uC5D0\uC11C \uC774\uC5B4\uC838\uC694.`:"\uC790\uB9AC\uB97C \uBE44\uC6B4 \uB3D9\uC548\uC5D0\uB3C4 \uCD5C\uB300 72\uC2DC\uAC04\uAE4C\uC9C0 \uACF5\uBC29\uC774 \uC77C\uD574\uC694. \uADF8 \uB4A4\uC5D4 \uBA48\uCD98 \uC790\uB9AC\uC5D0\uC11C \uAE30\uB2E4\uB824\uC694.")}},[d.clock(),t("span",{},["\uBBF8\uC811\uC18D \uB204\uC801 ",t("strong",{text:`${n?U(n.creditedMs):"0"}\uC2DC\uAC04`}),` / \uCD5C\uB300 ${U(i)}\uC2DC\uAC04`]),d.info("icon muted-icon")])}function er(e){let r=new Date(e);return Number.isNaN(r.getTime())?e:new Intl.DateTimeFormat("ko-KR",{month:"numeric",day:"numeric",hour:"2-digit",minute:"2-digit",hour12:!1}).format(r)}function se(e,r,a){let n=Object.entries(r);return n.length?n.map(([i,o])=>`${j(e,i)} ${a}${o}`).join(" \xB7 "):"\uC5C6\uC74C"}function st(e,r,a){let n=e.content,i=r.state.production.reports,o=nt(r),s=!!e.busy["reports-read"];return t("div",{className:"sheet-backdrop"},[t("section",{className:"sheet card",attrs:{role:"dialog","aria-modal":"true","aria-labelledby":"fw-work-report"}},[t("h2",{className:"section-title",text:"\uC791\uC5C5 \uBCF4\uACE0",attrs:{id:"fw-work-report"}}),t("p",{className:"muted",text:"\uB9CC\uB4E0 \uBB3C\uAC74\uC740 \uB9CC\uB4E4\uC5B4\uC9C4 \uC21C\uAC04 \uCC3D\uACE0\uC5D0 \uB4E4\uC5B4\uAC14\uC5B4\uC694. \uBCF4\uACE0\uB97C \uC77D\uC5B4\uB3C4 \uB2E4\uC2DC \uC9C0\uAE09\uB418\uC9C0 \uC54A\uC544\uC694."}),o.length?t("div",{className:"report-total"},[t("p",{},[t("strong",{text:"\uC0C8\uB85C \uB4E4\uC5B4\uC628 \uAC83 "}),se(n,ye(o,"produced"),"+")]),t("p",{},[t("strong",{text:"\uC7AC\uB8CC\uB85C \uC4F4 \uAC83 "}),se(n,ye(o,"consumed"),"\u2212")])]):t("p",{className:"empty",text:"\uC0C8 \uBCF4\uACE0\uAC00 \uC5C6\uC5B4\uC694."}),i.length?t("ol",{className:"report-list"},i.slice(0,10).map(l=>t("li",{className:`report-entry${l.reportId>r.state.production.reportsReadThrough?" new":""}`},[t("span",{className:"report-time",text:`${er(l.at)}${l.offlineMs?` \xB7 \uBE44\uC6B4 \uB3D9\uC548 ${U(l.offlineMs)}\uC2DC\uAC04`:""}`}),t("span",{text:[`${l.runs}\uD68C \uC644\uB8CC`,Object.keys(l.produced).length?`\uB4E4\uC5B4\uC634 ${se(n,l.produced,"+")}`:"",Object.keys(l.consumed).length?`\uC7AC\uB8CC ${se(n,l.consumed,"\u2212")}`:""].filter(Boolean).join(" \xB7 ")})]))):null,o.length?y(s?"\uD655\uC778\uD558\uB294 \uC911\u2026":"\uD655\uC778",()=>{a.readReports(i[0].reportId)},{disabled:s,attrs:{"data-wide":""}}):null,y("\uB2EB\uAE30",()=>a.closeSheet(),{variant:"secondary",attrs:{"data-wide":""}})])])}function tr(e){return S(e,"stories",{className:"strip story",label:"\uC8FC\uBBFC \uC774\uC57C\uAE30",children:[t("span",{className:"story-art",attrs:{"aria-hidden":"true"}},[d.book("icon")]),t("span",{className:"story-text"},[t("strong",{text:"\uC8FC\uBBFC \uC774\uC57C\uAE30"}),t("span",{text:"\uB3C4\uCC29\uD55C \uC774\uC57C\uAE30\uAC00 \uC5EC\uAE30\uC5D0 \uBCF4\uC5EC\uC694"})]),t("span",{className:"round-arrow"},[d.chevron()])]})}function lt(e,r){let a=e.world;return!a||a.state!=="ready"?R(e,r,{top:{kind:"home"},backdrop:"forest",nav:!1,body:[a?.state==="error"?k(null,[B(a.message),y("\uC138\uACC4 \uBAA9\uB85D\uC73C\uB85C",()=>r.navigate("worlds"),{variant:"secondary"})]):N("\uC138\uACC4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026")]}):R(e,r,{top:{kind:"home"},backdrop:"forest",hero:Ze(e,r),body:[it(a.value,e.content,r),ot(a.value,e.content,r),tr(r)],nav:!0,sheet:e.sheet?.kind==="work-report"?st(e,a.value,r):et(e,r)})}var dt,ke=!1;function le(e){let r=()=>{clearTimeout(dt),dt=setTimeout(()=>{!ke&&a.isConnected&&e.onSearch(a.value)},300)},a=t("input",{className:"search-input",attrs:{id:e.id,type:"search",placeholder:e.placeholder,value:e.value,autocomplete:"off"},on:{compositionstart:()=>ke=!0,compositionend:()=>{ke=!1,r()},input:()=>r()}});return t("label",{className:"search-field",attrs:{for:e.id}},[d.search("icon"),t("span",{className:"visually-hidden",text:e.placeholder}),a])}function xe(e){let r=(a,n)=>t("li",{className:`step-item${e===a?" current":e>a?" done":""}`,attrs:e===a?{"aria-current":"step"}:{}},[t("span",{className:"step-number",text:String(a)}),t("span",{className:"step-label",text:n})]);return t("ol",{className:"steps card",attrs:{"aria-label":"\uC8FC\uBBFC \uB4F1\uB85D \uB2E8\uACC4"}},[r(1,"\uC790\uB8CC \uC120\uD0DD"),t("li",{className:"step-arrow",attrs:{"aria-hidden":"true"},text:"\u2192"}),r(2,"\uC7AC\uAD6C\uCD95"),t("li",{className:"step-arrow",attrs:{"aria-hidden":"true"},text:"\u2192"}),r(3,"\uC2DC\uC791 \uC8FC\uBBFC")])}function rr(e,r){if(e.sources.state==="loading")return N("\uCE90\uB9AD\uD130\xB7\uD398\uB974\uC18C\uB098\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026");if(e.sources.state==="error")return t("div",{},[B(e.sources.message),y("\uB2E4\uC2DC \uBD88\uB7EC\uC624\uAE30",()=>{r.loadSources()},{variant:"secondary"})]);let a=e.query.trim().toLowerCase(),n=e.sources.value.filter(i=>i.kind===e.kindTab).filter(i=>!a||i.name.toLowerCase().includes(a));return n.length===0?t("p",{className:"empty",text:a?"\uC774\uB984\uC774 \uB9DE\uB294 \uC790\uB8CC\uAC00 \uC5C6\uC5B4\uC694.":`${K[e.kindTab]}\uAC00 \uC544\uC9C1 \uC5C6\uC5B4\uC694. \uC5D4\uC9C4\uC758 \uC11C\uC7AC\uC5D0\uC11C \uBA3C\uC800 \uB9CC\uB4E4\uC5B4 \uC8FC\uC138\uC694.`}):t("ul",{className:"source-list"},n.map(i=>t("li",{},[t("button",{className:"menu-row source-row",attrs:{type:"button"},disabled:i.residentId!==null,on:{click:()=>{r.chooseSource(i)}}},[t("span",{className:"menu-icon light"},[d.document()]),t("span",{className:"menu-text"},[t("span",{className:"menu-title",text:i.name}),t("span",{className:"menu-detail",text:i.residentId?"\uC774\uBBF8 \uC774 \uC138\uACC4\uC758 \uC8FC\uBBFC\uC774\uC5D0\uC694":i.summary||"\uC124\uBA85 \uC5C6\uC74C"})]),t("span",{className:"menu-chevron"},[i.residentId?d.check():d.chevron()])])])))}function ar(e,r){return[k("\uC790\uB8CC \uC120\uD0DD",[t("p",{className:"muted",text:"\uC8FC\uBBFC\uC73C\uB85C \uB9DE\uC774\uD560 \uCE90\uB9AD\uD130\uB098 \uD398\uB974\uC18C\uB098\uB97C \uACE8\uB77C \uC8FC\uC138\uC694. \uC6D0\uBCF8\uC740 \uC77D\uAE30\uB9CC \uD558\uACE0 \uBC14\uAFB8\uC9C0 \uC54A\uC544\uC694."}),t("div",{className:"pill-tabs two",attrs:{role:"tablist","aria-label":"\uC790\uB8CC \uC885\uB958"}},["character","persona"].map(a=>t("button",{className:`pill-tab${e.kindTab===a?" current":""}`,text:K[a],attrs:{type:"button",role:"tab","aria-selected":e.kindTab===a?"true":"false"},on:{click:()=>r.setRegisterKind(a)}}))),le({id:"fw-source-search",value:e.query,placeholder:"\uC774\uB984\uC73C\uB85C \uCC3E\uAE30",onSearch:a=>r.setRegisterQuery(a)}),rr(e,r)],{id:"fw-source-title"})]}function nr(e){if(!e||e.state==="loading")return N("\uC6D0\uB798 \uC124\uC815\uC744 \uC77D\uB294 \uC911\u2026");if(e.state==="error")return B(e.message);let r=e.value;return t("div",{className:"readonly-box"},[t("p",{text:r.summary||"\uC6D0\uBCF8\uC5D0 \uC801\uD78C \uC124\uBA85\uC774 \uC5C6\uC5B4\uC694."})])}function ir(e,r,a){let n=t("input",{className:"visually-hidden",attrs:{id:"fw-register-image",type:"file",accept:"image/png,image/webp"},on:{change:()=>{let o=n.files?.[0];if(n.value="",!!o){if(o.size>a){r.notify(`\uD30C\uC77C\uC774 ${Math.round(a/1024/1024)}MiB\uB97C \uB118\uC5B4\uC694. \uB2E4\uB978 \uADF8\uB9BC\uC744 \uACE8\uB77C \uC8FC\uC138\uC694.`,"error");return}r.pickPendingImage(o)}}}}),i=e.pendingImage;return t("div",{className:"image-drop"},[n,t("label",{className:"drop-zone checker",attrs:{for:"fw-register-image"}},[i?t("img",{className:"drop-preview",attrs:{src:i.previewUrl,alt:""}}):d.addImage("icon drop-icon"),t("span",{className:"drop-text"},[t("strong",{text:i?i.file.name:"\uC8FC\uBBFC \uADF8\uB9BC \uC9C1\uC811 \uB4F1\uB85D"}),t("span",{text:i?`${Math.max(1,Math.round(i.file.size/1024))} KB \xB7 \uB4F1\uB85D\uD558\uBA74 WebP\uB85C \uC800\uC7A5\uD574\uC694`:"PNG \xB7 WebP \u2192 WebP \uC800\uC7A5"})])]),i?y("\uACE0\uB978 \uADF8\uB9BC \uBE7C\uAE30",()=>r.clearPendingImage(),{variant:"secondary"}):null])}function or(e,r,a){let n=e.selected,i=r.content?.residents.worldSettingMax??200,o=!!r.busy["rebuild-suggestion"],s=!!r.busy[`register:${n.kind}:${n.id}`],l=Object.keys(r.busy).some(h=>h.startsWith("image-upload:")&&r.busy[h]),p=s||l,c=t("span",{className:"counter-text",text:`${e.draft.length} / ${i}`,attrs:{id:"fw-draft-count"}}),m=t("textarea",{className:"textarea",attrs:{id:"fw-world-setting",maxlength:String(i),rows:"4",placeholder:"\uC774 \uC138\uACC4\uC5D0\uC11C \uC5B4\uB5A4 \uC8FC\uBBFC\uC778\uC9C0 \uC801\uC5B4 \uC8FC\uC138\uC694.","aria-describedby":"fw-draft-count"},on:{input:()=>{c.textContent=`${m.value.length} / ${i}`,a.setDraft(m.value)}}});m.value=e.draft;let f=e.preview?.state==="ready";return[t("section",{className:"card selected-source"},[t("button",{className:"menu-row quiet",attrs:{type:"button"},on:{click:()=>a.backToSources()}},[t("span",{className:"menu-icon light"},[d.document()]),t("span",{className:"menu-text"},[t("small",{className:"muted",text:"\uC120\uD0DD\uD55C \uC790\uB8CC"}),t("span",{className:"menu-title",text:`${K[n.kind]} \xB7 ${n.name}`})]),t("span",{className:"menu-chevron"},[d.chevron()])])]),t("section",{className:"card rebuild",attrs:{"aria-labelledby":"fw-original"}},[t("h2",{className:"section-title doc",text:"\uC6D0\uB798 \uC124\uC815",attrs:{id:"fw-original"}}),nr(e.preview),t("label",{className:"section-title",text:"\uACF5\uBC29 \uC138\uACC4 \uC124\uC815",attrs:{for:"fw-world-setting"}}),t("div",{className:"textarea-wrap"},[m,c]),t("div",{className:"rule-actions even"},[t("button",{className:"button",attrs:{type:"button"},on:{click:()=>{m.focus(),m.setSelectionRange(m.value.length,m.value.length)}}},[d.pencil("icon"),t("span",{text:"\uC218\uC815"})]),t("button",{className:"button secondary",attrs:{type:"button"},disabled:o||!f,on:{click:()=>{a.suggestSetting()}}},[d.sparkle("icon"),t("span",{text:o?"\uC81C\uC548 \uBC1B\uB294 \uC911\u2026":"\uB2E4\uC2DC \uC81C\uC548"})])]),t("p",{className:"hint",text:"\uB2E4\uC2DC \uC81C\uC548\uC740 \uC5D4\uC9C4\uC758 \uAE30\uBCF8 \uC5B8\uC5B4 \uBAA8\uB378\uC5D0 \uD55C \uBC88 \uC694\uCCAD\uD574\uC694. \uD655\uC815\uD558\uAE30 \uC804\uC5D0\uB294 \uC800\uC7A5\uB418\uC9C0 \uC54A\uC544\uC694."})]),k("\uC8FC\uBBFC \uADF8\uB9BC \uC9C1\uC811 \uB4F1\uB85D",[ir(e,a,r.content?.residents.maxImageBytes??20*1024*1024),t("p",{className:"hint center"},[d.info("icon"),"\uC6D0\uBCF8 \uD504\uB85C\uD544\uC740 \uBC14\uB00C\uC9C0 \uC54A\uC544\uC694."])],{id:"fw-register-image-title"}),t("button",{className:"button big-action",attrs:{type:"button","data-wide":""},disabled:p||!f,on:{click:()=>{a.confirmRegister(!0,(h,x)=>a.uploadResidentImage(h,x))}}},[d.leaf("icon"),t("span",{text:s?"\uB4F1\uB85D\uD558\uB294 \uC911\u2026":l?"\uADF8\uB9BC \uC800\uC7A5 \uC911\u2026":"\uC7AC\uAD6C\uCD95 \uD655\uC815"}),d.chevron("icon")]),t("button",{className:"button secondary",attrs:{type:"button","data-wide":""},disabled:p||!f,on:{click:()=>{a.confirmRegister(!1,async()=>{})}}},[d.clock("icon"),t("span",{text:"\uB098\uC911\uC5D0 \uADF8\uB9BC \uB4F1\uB85D"})])]}function sr(e,r,a,n){let i=Object.values(r.state.residents),o=!!a.busy["choose-starter"];return[k("\uC2DC\uC791 \uC8FC\uBBFC",[t("p",{className:"muted",text:"\uACF5\uBC29\uC5D0\uC11C \uD568\uAED8 \uC2DC\uC791\uD560 \uC8FC\uBBFC \uD55C \uBA85\uC744 \uACE8\uB77C \uC8FC\uC138\uC694. \uB2E4\uB978 \uC8FC\uBBFC\uC740 \uCD08\uB300\uB85C \uB9DE\uC774\uD574\uC694."}),t("ul",{className:"starter-list",attrs:{role:"radiogroup","aria-label":"\uC2DC\uC791 \uC8FC\uBBFC"}},i.map(s=>t("li",{},[t("button",{className:`starter-option${e.starterChoice===s.residentId?" chosen":""}`,attrs:{type:"button",role:"radio","aria-checked":e.starterChoice===s.residentId?"true":"false"},on:{click:()=>n.setStarterChoice(s.residentId)}},[t("span",{className:"starter-stage"},[O(s)]),t("strong",{text:s.displayName}),V(s)])])))],{id:"fw-starter-title"}),t("button",{className:"button big-action",attrs:{type:"button","data-wide":""},disabled:o||!e.starterChoice,on:{click:()=>{n.confirmStarter()}}},[d.house("icon"),t("span",{text:o?"\uB9DE\uC774\uD558\uB294 \uC911\u2026":"\uC774 \uC8FC\uBBFC\uACFC \uC2DC\uC791\uD558\uAE30"})]),y("\uC8FC\uBBFC \uB354 \uB4F1\uB85D\uD558\uAE30",()=>n.registerAnother(),{variant:"secondary",attrs:{"data-wide":""}})]}function ct(e,r){let a=e.world?.state==="ready"?e.world.value:null,n=e.register,i;return!a||!n?i=[N("\uC138\uACC4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026")]:n.step===3?i=[xe(3),...sr(n,a,e,r)]:n.step===2&&n.selected?i=[xe(2),...or(n,e,r)]:i=[xe(1),...ar(n,r)],R(e,r,{top:{kind:"sub",title:"\uC8FC\uBBFC \uB4F1\uB85D",back:{route:"residents",label:"\uC8FC\uBBFC"},resources:!1},backdrop:"wood",body:i,nav:!1})}var mt="ABCDEFGHIJKLMNOPQRSTUVWXYZ";function lr(e,r){return[...e?.relationStages??[]].reverse().find(n=>r>=n.from)?.label??"\u2013"}function pt(e,r,a){return a.state.residents[be(e,r.residentId)]??null}function dr(e,r){let a=r.map((n,i)=>`A\u2013${mt[i+1]??"?"}`).join(" \xB7 ");return k(null,[t("div",{className:"relation-hero"},[H(e,"large"),t("span",{className:"hero-label",text:`\uACF5\uC720 \uC8FC\uBBFC \xB7 ${e.displayName}`}),t("strong",{className:"hero-pairs",text:r.length?a:"\uC544\uC9C1 \uD398\uC5B4\uAC00 \uC5C6\uC5B4\uC694"}),t("p",{className:"hero-note",text:r.length>1?"\uB450 \uAD00\uACC4\uB294 \uAC19\uC740 \uC138\uACC4\uC5D0\uC11C \uC774\uC5B4\uC838\uC694":r.length===1?"\uAC19\uC740 \uC138\uACC4\uC5D0\uC11C \uC774\uC5B4\uC9C0\uB294 \uAD00\uACC4\uC608\uC694":"\uB2E4\uB978 \uC8FC\uBBFC\uACFC \uD398\uC5B4\uB97C \uB9CC\uB4E4 \uC218 \uC788\uC5B4\uC694"})])],{className:"hero-card"})}function cr(e,r,a,n,i,o){let s=pt(e,a,n),l=i.relationsEditing,p=!!i.busy[`pair-archive:${e.pairId}`];return t("li",{className:"pair-row card"},[t("div",{className:"pair-faces"},[t("span",{className:"pair-letters"},[t("span",{className:"letter",text:"A"}),"\xD7",t("span",{className:"letter",text:mt[r+1]??"?"})]),t("span",{className:"faces"},[H(a),t("span",{className:"times",text:"\xD7"}),H(s)]),t("span",{className:"partner-name",text:s?.displayName??"\uC54C \uC218 \uC5C6\uB294 \uC8FC\uBBFC"})]),t("div",{className:"pair-info"},[t("div",{className:"relation-now"},[t("small",{text:"\uD604\uC7AC \uAD00\uACC4"}),t("strong",{text:lr(i.content,e.familiarity)})]),t("p",{className:"recent"},[t("span",{className:"recent-label",text:"\uCD5C\uADFC \uC0AC\uAC74"}),t("span",{text:e.lastEvent?.summary??"\uC544\uC9C1 \uC5C6\uC5B4\uC694"})]),l?t("div",{className:"pair-actions"},[y(p?"\uBCF4\uAD00 \uC911\u2026":"\uBCF4\uAD00",()=>{o.archivePair(e.pairId)},{variant:"secondary",disabled:p})]):t("div",{className:"pair-actions"},[S(o,"pair-memory",{className:"outline-button",label:"\uAE30\uC5B5 \uBCF4\uAE30",children:[d.book("icon"),t("span",{text:"\uAE30\uC5B5 \uBCF4\uAE30"})]}),S(o,"pair-guidelines",{className:"outline-button",label:"\uC9C0\uCE68 \uAD00\uB9AC",children:[d.gear("icon"),t("span",{text:"\uC9C0\uCE68 \uAD00\uB9AC"})]})])])])}function mr(e,r,a,n,i){return e.length===0?null:k("\uBCF4\uAD00\uD55C \uD398\uC5B4",[t("ul",{className:"archived-list"},e.map(o=>{let s=pt(o,r,a),l=!!n.busy[`pair-restore:${o.pairId}`];return t("li",{className:"archived-row"},[H(s),t("span",{className:"archived-name",text:`${r.displayName} \xD7 ${s?.displayName??"?"}`}),y(l?"\uB418\uB3CC\uB9AC\uB294 \uC911\u2026":"\uB418\uB3CC\uB9AC\uAE30",()=>{i.restorePair(o.pairId)},{variant:"secondary",disabled:l})])}))],{id:"fw-archived"})}function pr(e,r,a,n){let i=new Map(Object.values(r.state.pairs).filter(s=>s.residentIds.includes(e.residentId)).map(s=>[be(s,e.residentId),s.archived])),o=Object.values(r.state.residents).filter(s=>s.residentId!==e.residentId);return t("div",{className:"sheet-backdrop"},[t("section",{className:"sheet card",attrs:{role:"dialog","aria-modal":"true","aria-labelledby":"fw-pair-add"}},[t("h2",{className:"section-title",text:"\uD398\uC5B4 \uCD94\uAC00",attrs:{id:"fw-pair-add"}}),t("p",{className:"muted",text:`${e.displayName}\uC640(\uACFC) \uC774\uC5B4\uC9C8 \uC8FC\uBBFC\uC744 \uACE8\uB77C \uC8FC\uC138\uC694. \uCE90\uB9AD\uD130\uB4E0 \uD398\uB974\uC18C\uB098\uB4E0 \uAD1C\uCC2E\uC544\uC694. \uC9C0\uB09C \uAE30\uC5B5\uC774 \uC0C8\uB85C \uC0DD\uAE30\uC9C0\uB294 \uC54A\uC544\uC694.`}),o.length===0?t("p",{className:"empty",text:"\uD568\uAED8\uD560 \uB2E4\uB978 \uC8FC\uBBFC\uC774 \uC544\uC9C1 \uC5C6\uC5B4\uC694. \uC8FC\uBBFC \uBD88\uB7EC\uC624\uAE30\uC5D0\uC11C \uBA3C\uC800 \uB4F1\uB85D\uD574 \uC8FC\uC138\uC694."}):t("ul",{className:"candidate-list"},o.map(s=>{let l=i.has(s.residentId),p=ge(e.residentId,s.residentId);return t("li",{},[t("button",{className:"candidate",attrs:{type:"button"},disabled:l||!!a.busy[p],on:{click:()=>{n.addPair(e.residentId,s.residentId)}}},[H(s),t("span",{className:"candidate-name",text:s.displayName}),V(s),t("span",{className:"candidate-state",text:l?i.get(s.residentId)?"\uBCF4\uAD00\uD568\uC5D0 \uC788\uC5B4\uC694":"\uC774\uBBF8 \uD398\uC5B4":a.busy[p]?"\uB9CC\uB4DC\uB294 \uC911\u2026":"\uACE0\uB974\uAE30"})])])})),y("\uB2EB\uAE30",()=>n.closeSheet(),{variant:"secondary",attrs:{"data-wide":""}})])])}function ut(e,r){let a=e.world?.state==="ready"?e.world.value:null,n=a?a.state.residents[e.focusResidentId??""]??null:null,i={top:{kind:"sub",title:"\uAD00\uACC4",subtitle:"\uAC19\uC740 \uC138\uACC4\uC5D0\uC11C \uC774\uC5B4\uC9C0\uB294 \uAD00\uACC4",back:{route:"residents",label:"\uC8FC\uBBFC"},resources:!1},backdrop:"forest",nav:!0};if(!a||!n)return R(e,r,{...i,body:[N(a?"\uC8FC\uBBFC\uC744 \uACE0\uB978 \uB4A4 \uAD00\uACC4\uB97C \uC5F4\uC5B4 \uC8FC\uC138\uC694.":"\uC138\uACC4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026")]});let o=Object.values(a.state.pairs).filter(l=>l.residentIds.includes(n.residentId)).sort((l,p)=>l.createdAt.localeCompare(p.createdAt)),s=o.filter(l=>!l.archived);return R(e,r,{...i,body:[dr(n,s),t("ul",{className:"pair-list"},s.map((l,p)=>cr(l,p,n,a,e,r))),t("p",{className:"notice-strip"},[t("span",{className:"bang",text:"!"}),"\uD398\uC5B4 \uC9C0\uC815\uC740 \uC5F0\uC778 \uC120\uC5B8\uC774 \uC544\uB2C8\uC5D0\uC694."]),t("div",{className:"rule-actions"},[t("button",{className:"button wide-main",attrs:{type:"button"},on:{click:()=>r.openSheet({kind:"pair-add",residentId:n.residentId})}},[d.people("icon"),t("span",{text:"\uD398\uC5B4 \uCD94\uAC00"})]),t("button",{className:`button secondary${e.relationsEditing?" pressed":""}`,attrs:{type:"button","aria-pressed":e.relationsEditing?"true":"false"},on:{click:()=>r.toggleRelationsEditing()}},[d.archive("icon"),t("span",{text:e.relationsEditing?"\uBCC0\uACBD \uB05D\uB0B4\uAE30":"\uBCC0\uACBD \xB7 \uBCF4\uAD00"})])]),e.relationsEditing?mr(o.filter(l=>l.archived),n,a,e,r):null],sheet:e.sheet?.kind==="pair-add"?pr(n,a,e,r):null})}function ft(e){return`${Math.max(1,Math.round(e/1024)).toLocaleString("ko-KR")} KB`}function Ne(e,r,a,n,i,o,s){let l=`fw-placement-${e}`,p=t("span",{className:"slider-value",text:s(n)}),c=t("input",{className:"slider",attrs:{id:l,type:"range",min:String(i.min),max:String(i.max),step:"1",value:String(n),"aria-valuetext":s(n)},on:{input:()=>p.textContent=s(Number(c.value)),change:()=>o.setPlacementDraft({[e]:Number(c.value)})}});return t("div",{className:"setting-row slider-row"},[r("icon"),t("label",{className:"setting-label",text:a,attrs:{for:l}}),c,p])}function ur(e,r,a){let n=!!r.busy[`image-restore:${e.residentId}`],i=o=>t("li",{className:"history-item"},[t("span",{className:"history-thumb checker"},[t("img",{attrs:{src:o.url,alt:""}})]),t("span",{className:"menu-text"},[t("span",{className:"menu-title",text:o.fileName||"\uC774\uC804 \uADF8\uB9BC"}),t("span",{className:"menu-detail",text:`${o.width} \xD7 ${o.height} \xB7 ${ft(o.bytes)}`})]),y(n?"\uB418\uB3CC\uB9AC\uB294 \uC911\u2026":"\uC774 \uADF8\uB9BC\uC73C\uB85C",()=>{a.restoreResidentImage(e.residentId,o.reference)},{disabled:n})]);return t("div",{className:"sheet-backdrop"},[t("section",{className:"sheet card",attrs:{role:"dialog","aria-modal":"true","aria-labelledby":"fw-image-history"}},[t("h2",{className:"section-title",text:"\uC774\uC804 \uADF8\uB9BC",attrs:{id:"fw-image-history"}}),e.image.history.length?t("ul",{className:"history-list"},e.image.history.map(i)):t("p",{className:"empty",text:"\uB418\uB3CC\uB9B4 \uC774\uC804 \uADF8\uB9BC\uC774 \uC5C6\uC5B4\uC694."}),t("p",{className:"hint",text:"\uCD5C\uADFC 3\uC7A5\uAE4C\uC9C0 \uBCF4\uAD00\uD574\uC694. \uC9C0\uB09C \uC774\uC57C\uAE30 \uB2E4\uC2DC\uBCF4\uAE30\uC5D0\uB3C4 \uC9C0\uAE08 \uADF8\uB9BC\uC774 \uC4F0\uC5EC\uC694."}),y("\uB2EB\uAE30",()=>a.closeSheet(),{variant:"secondary",attrs:{"data-wide":""}})])])}function fr(e,r,a){let n=r.content?.residents.placement,i=r.placementDraft??e.image.placement,o=e.image.current,s=!!r.busy[`image-upload:${e.residentId}`],l=!!r.busy[`placement:${e.residentId}`],p=JSON.stringify(i)!==JSON.stringify(e.image.placement),c=t("input",{className:"visually-hidden",attrs:{id:"fw-image-file",type:"file",accept:"image/png,image/webp"},disabled:s,on:{change:()=>{let f=c.files?.[0];c.value="",f&&a.uploadResidentImage(e.residentId,f)}}}),m=f=>f>0?`+${f}`:String(f);return[t("section",{className:"card image-card"},[t("p",{className:"target-ribbon"},[t("span",{className:"muted",text:"\uB300\uC0C1"}),d.leaf("icon"),t("strong",{text:e.displayName})]),t("div",{className:"image-stage checker"},[O(e,{placement:i,marker:!0})]),t("div",{className:"file-facts"},o?[t("strong",{text:o.fileName||"resident.webp"}),t("span",{text:`${o.width} \xD7 ${o.height} / ${ft(o.bytes)}`})]:[t("strong",{text:"\uC544\uC9C1 \uADF8\uB9BC\uC774 \uC5C6\uC5B4\uC694"}),t("span",{className:"muted",text:"\uADF8\uB9BC\uC774 \uC5C6\uC5B4\uB3C4 \uBAA8\uB4E0 \uAE30\uB2A5\uC744 \uC4F8 \uC218 \uC788\uC5B4\uC694"})]),c,t("label",{className:`button big-action file-button${s?" busy":""}`,attrs:{for:"fw-image-file","data-wide":"","aria-disabled":s?"true":"false"}},[t("span",{text:s?"WebP\uB85C \uC800\uC7A5\uD558\uB294 \uC911\u2026":o?"\uD30C\uC77C \uC120\uD0DD \xB7 \uAD50\uCCB4":"\uD30C\uC77C \uC120\uD0DD"})]),t("ul",{className:"rules"},[t("li",{text:"PNG \xB7 \uC815\uC801 WebP \uC5C5\uB85C\uB4DC (20MiB \xB7 4096px\uAE4C\uC9C0)"}),t("li",{text:"\uD22C\uBA85\uB3C4 \uC720\uC9C0 \xB7 WebP \uD488\uC9C8 95 \uC800\uC7A5"}),t("li",{text:"PNG \uC6D0\uBCF8\uC740 \uB530\uB85C \uBCF4\uAD00\uD558\uC9C0 \uC54A\uC544\uC694."})]),n?t("div",{className:"setting-block sliders"},[Ne("scale",d.zoom,"\uADF8\uB9BC \uD06C\uAE30",i.scale,n.scale,a,f=>`${f}%`),Ne("offsetX",d.arrows,"\uC88C\uC6B0 \uC704\uCE58",i.offsetX,n.offsetX,a,m),Ne("markerHeight",d.updown,"\uAE30\uD638 \uB192\uC774",i.markerHeight,n.markerHeight,a,m)]):null,t("button",{className:"button big-action",attrs:{type:"button","data-wide":""},disabled:l||!p,on:{click:()=>{a.applyPlacement(e.residentId)}}},[t("span",{text:l?"\uC801\uC6A9\uD558\uB294 \uC911\u2026":p?"\uC801\uC6A9":"\uC801\uC6A9\uB428"})]),t("div",{className:"rule-actions even"},[t("button",{className:"button secondary",attrs:{type:"button"},on:{click:()=>a.resetPlacementDraft()}},[d.restore("icon"),t("span",{text:"\uAE30\uBCF8 \uBC30\uCE58"})]),t("button",{className:"button secondary",attrs:{type:"button"},disabled:e.image.history.length===0,on:{click:()=>a.openSheet({kind:"image-history",residentId:e.residentId})}},[d.image("icon"),t("span",{text:`\uC774\uC804 \uADF8\uB9BC${e.image.history.length?` ${e.image.history.length}`:""}`})])])])]}function gt(e,r){let a=e.world?.state==="ready"?e.world.value:null,n=a?a.state.residents[e.focusResidentId??""]??null:null;return R(e,r,{top:{kind:"sub",title:"\uC8FC\uBBFC \uADF8\uB9BC",back:{route:"residents",label:"\uC8FC\uBBFC"},resources:!1},backdrop:"wood",body:n?fr(n,e,r):[N(a?"\uC8FC\uBBFC\uC744 \uACE0\uB978 \uB4A4 \uC8FC\uBBFC \uADF8\uB9BC\uC744 \uC5F4\uC5B4 \uC8FC\uC138\uC694.":"\uC138\uACC4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026")],nav:!0,sheet:n&&e.sheet?.kind==="image-history"?ur(n,e,r):null})}var gr={registered:"\uB4F1\uB85D",setting:"\uC138\uACC4 \uC124\uC815 \uC218\uC815",name:"\uC774\uB984 \uC218\uC815",recruited:"\uC601\uC785",image:"\uADF8\uB9BC \uB4F1\uB85D",image_restored:"\uC774\uC804 \uADF8\uB9BC\uC73C\uB85C",image_history_cleared:"\uADF8\uB9BC \uC774\uB825 \uC815\uB9AC",placement:"\uBC30\uCE58 \uBCC0\uACBD"};function bt(e){let r=new Date(e);return Number.isNaN(r.getTime())?e:new Intl.DateTimeFormat("ko-KR",{dateStyle:"medium",timeStyle:"short"}).format(r)}function Se(e,r){return r?t("div",{className:"source-field"},[t("strong",{text:e}),t("p",{text:r})]):null}function br(e){return t("li",{className:"change-row"},[t("span",{className:"change-kind",text:gr[e.kind]??e.kind}),t("span",{className:"change-detail",text:e.detail}),t("time",{className:"change-time",text:bt(e.at),attrs:{datetime:e.at}})])}function ht(e,r,a,n){let i=e.state.residents[n];if(!i)return null;let o=r.content?.residents.worldSettingMax??200,s=!!r.busy[`resident-setting:${n}`],l=t("span",{className:"counter-text",text:`${i.worldSetting.length} / ${o}`}),p=t("textarea",{className:"textarea",attrs:{id:"fw-profile-setting",maxlength:String(o),rows:"4","aria-describedby":"fw-profile-count"},on:{input:()=>l.textContent=`${p.value.length} / ${o}`}});p.value=i.worldSetting,l.id="fw-profile-count";let{source:c}=i;return t("div",{className:"sheet-backdrop"},[t("section",{className:"sheet card",attrs:{role:"dialog","aria-modal":"true","aria-labelledby":"fw-profile"}},[t("div",{className:"sheet-head"},[t("h2",{className:"section-title",text:`${i.displayName} \uD504\uB85C\uD544`,attrs:{id:"fw-profile"}}),V(i)]),t("div",{className:"compare"},[t("div",{className:"compare-box source"},[t("p",{className:"compare-title"},[d.document("icon"),"\uC6D0\uB798 \uC124\uC815"]),t("p",{className:"muted",text:`${c.name} \xB7 ${bt(c.takenAt)}\uC5D0 \uC77D\uC74C \xB7 \uC6D0\uBCF8\uC740 \uBC14\uB00C\uC9C0 \uC54A\uC544\uC694`}),Se("\uC124\uBA85",c.description),Se("\uC131\uACA9",c.personality),Se("\uC0C1\uD669",c.scenario),!c.description&&!c.personality&&!c.scenario?t("p",{className:"muted",text:"\uC6D0\uBCF8\uC5D0 \uC801\uD78C \uC124\uBA85\uC774 \uC5C6\uC5B4\uC694."}):null]),t("form",{className:"compare-box world",on:{submit:m=>{m.preventDefault(),p.value.trim()&&p.value!==i.worldSetting&&a.updateWorldSetting(n,p.value)}}},[t("label",{className:"compare-title",attrs:{for:"fw-profile-setting"}},[d.leaf("icon"),"\uACF5\uBC29 \uC138\uACC4 \uC124\uC815"]),p,l,t("button",{className:"button small",text:s?"\uC800\uC7A5 \uC911\u2026":"\uC218\uC815 \uC800\uC7A5",attrs:{type:"submit"},disabled:s})])]),t("h3",{className:"subhead",text:"\uBCC0\uACBD \uC774\uB825"}),t("ol",{className:"change-list"},i.changes.map(br)),y("\uB2EB\uAE30",()=>a.closeSheet(),{variant:"secondary",attrs:{"data-wide":""}})])])}var hr=[{id:"all",label:"\uC804\uCCB4"},{id:"character",label:"\uCE90\uB9AD\uD130"},{id:"persona",label:"\uD398\uB974\uC18C\uB098"}],de=[{id:"all",label:"\uBAA8\uB450"},{id:"recruited",label:"\uC601\uC785\uD55C \uC8FC\uBBFC"},{id:"waiting",label:"\uCD08\uB300 \uB300\uAE30"}];function wr(e,r){let a=de[(de.findIndex(i=>i.id===e.filter)+1)%de.length],n=de.find(i=>i.id===e.filter);return t("div",{className:"search-bar"},[le({id:"fw-resident-search",value:e.query,placeholder:"\uC774\uB984\uC73C\uB85C \uCC3E\uAE30",onSearch:i=>r.setResidentsQuery(i)}),t("button",{className:`icon-button filter${e.filter==="all"?"":" active"}`,attrs:{type:"button","aria-label":`\uBCF4\uAE30: ${n.label} (\uB204\uB974\uBA74 ${a.label})`},on:{click:()=>r.setResidentsFilter(a.id)}},[d.filter()]),e.filter==="all"?null:t("span",{className:"filter-chip",text:n.label})])}function vr(e,r){return t("div",{className:"pill-tabs",attrs:{role:"tablist","aria-label":"\uC8FC\uBBFC \uC885\uB958"}},hr.map(a=>t("button",{className:`pill-tab${e.tab===a.id?" current":""}`,text:a.label,attrs:{type:"button",role:"tab","aria-selected":e.tab===a.id?"true":"false"},on:{click:()=>r.setResidentsTab(a.id)}})))}function wt(e){return S(e,"specialty",{className:"tag field",label:"\uC804\uBB38 \uBD84\uC57C",children:[d.leaf("icon tiny"),t("span",{text:"\uBD84\uC57C"})]})}function yr(e,r,a){return t("li",{className:`resident-card${r?" selected":""}`},[t("button",{className:"resident-card-main",attrs:{type:"button","aria-pressed":r?"true":"false","aria-label":`${e.displayName} \uBCF4\uAE30`},on:{click:()=>a.selectResident(e.residentId)}},[t("span",{className:"card-stage"},[O(e)]),t("strong",{className:"resident-name",text:e.displayName})]),t("span",{className:"tag-row"},[V(e),wt(a)]),e.recruited?t("span",{className:"status-pill done",text:"\uC601\uC785 \uC644\uB8CC"}):S(a,"invite",{className:"status-pill waiting",label:"\uCD08\uB300\uD558\uAE30",children:[t("span",{text:"\uCD08\uB300 \uB300\uAE30"})]})])}function Re(e,r,a){return t("button",{className:"detail-action",attrs:{type:"button"},on:{click:a}},[e("icon"),t("span",{text:r})])}function kr(e,r){return k(null,[t("div",{className:"resident-detail"},[t("span",{className:"detail-stage"},[O(e)]),t("div",{className:"detail-info"},[t("strong",{className:"detail-name",text:e.displayName}),t("span",{className:"tag-row"},[V(e),wt(r)]),qe(r,"breakthrough",[t("p",{className:"passive"},[d.leaf("icon tiny"),t("strong",{text:"\uD328\uC2DC\uBE0C"})," \u2013"]),t("p",{className:"muted",text:"\uAE30\uBCF8 \uD6A8\uACFC \u2013 \u2192 \uD604\uC7AC \u2013"}),t("p",{className:"breakthrough"},[t("span",{text:"\uB3CC\uD30C \u2013/\u2013"}),t("span",{className:"leaf-pips"},[1,2,3,4,5].map(()=>t("span",{className:"pip"})))])],"detail-locked")])]),t("div",{className:"detail-actions"},[Re(d.image,"\uC8FC\uBBFC \uADF8\uB9BC",()=>r.openResidentImage(e.residentId)),Re(d.document,"\uD504\uB85C\uD544",()=>r.openSheet({kind:"profile",residentId:e.residentId})),Re(d.heart,"\uAD00\uACC4",()=>r.openRelations(e.residentId))])],{className:"detail-card"})}function xr(e,r,a){let n=r.residentsView,i=Object.values(e.state.residents),o=De(e.state,n),s=e.state.residents[n.selectedId??""]??o[0]??null,l=i.length===0?t("div",{className:"empty-state"},[t("p",{text:"\uC544\uC9C1 \uC8FC\uBBFC\uC774 \uC5C6\uC5B4\uC694."}),t("p",{className:"muted",text:"\uCE90\uB9AD\uD130\uB098 \uD398\uB974\uC18C\uB098\uB97C \uBD88\uB7EC\uC640 \uC774 \uC138\uACC4\uC758 \uC8FC\uBBFC\uC73C\uB85C \uB9DE\uC774\uD574 \uBCF4\uC138\uC694."})]):o.length===0?t("p",{className:"empty",text:"\uC870\uAC74\uC5D0 \uB9DE\uB294 \uC8FC\uBBFC\uC774 \uC5C6\uC5B4\uC694."}):t("ul",{className:"resident-grid"},o.map(p=>yr(p,p.residentId===s?.residentId,a)));return[wr(n,a),t("section",{className:"card resident-board",attrs:{"aria-label":"\uC8FC\uBBFC \uBAA9\uB85D"}},[vr(n,a),l]),s?kr(s,a):null,t("button",{className:"button big-action",attrs:{type:"button","data-wide":""},on:{click:()=>a.openRegister(1)}},[d.people("icon"),t("span",{text:"\uC8FC\uBBFC \uBD88\uB7EC\uC624\uAE30"})])]}function vt(e,r){let a=e.world?.state==="ready"?e.world.value:null,n=e.sheet?.kind==="profile"&&a?ht(a,e,r,e.sheet.residentId):null;return R(e,r,{top:{kind:"sub",title:"\uC8FC\uBBFC",subtitle:"\uC232\uC744 \uD568\uAED8\uD558\uB294 \uC18C\uC911\uD55C \uC774\uC6C3\uB4E4",resources:!1},backdrop:"forest",body:a?xr(a,e,r):[N("\uC138\uACC4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026")],nav:!0,sheet:n})}function Ie(e,r,a){return t("div",{className:"preview-row"},[e("icon"),t("span",{text:r}),t("strong",{text:a})])}function ce(e,r,a){let n=!!e.busy.restore,i=t("input",{className:"visually-hidden",attrs:{type:"file",accept:"application/json,.json",id:a},disabled:n,on:{change:()=>{let l=i.files?.[0];l&&r.selectRestoreFile(l),i.value=""}}}),o=e.restore,s=o?.summary;return t("div",{className:"restore"},[i,t("label",{className:"menu-row",attrs:{for:a}},[t("span",{className:"menu-icon"},[d.download()]),t("span",{className:"menu-text"},[t("span",{className:"menu-title",text:"\uBC31\uC5C5 \uBD88\uB7EC\uC624\uAE30"}),t("span",{className:"menu-detail",text:o?o.fileName:"\uC0C8 \uC138\uACC4\uB85C \uBCF5\uC6D0"})]),t("span",{className:"menu-chevron"},[d.chevron()])]),t("div",{className:"preview-box",attrs:{"aria-live":"polite"}},[t("p",{className:"preview-head"},[d.eye("icon"),t("strong",{text:"\uBCF5\uC6D0 \uBBF8\uB9AC\uBCF4\uAE30"})]),s?t("div",{className:"preview-rows"},[Ie(d.residents,"\uC8FC\uBBFC",`${s.residents}\uBA85`),Ie(d.pair,"\uD398\uC5B4",`${s.pairs}\uAC1C`),Ie(d.image,"\uADF8\uB9BC",`${s.pictures}\uAC1C`)]):t("p",{className:"muted",text:"\uBC31\uC5C5 \uD30C\uC77C\uC744 \uACE0\uB974\uBA74 \uB2F4\uAE34 \uB0B4\uC6A9\uC744 \uBA3C\uC800 \uBCF4\uC5EC \uB4DC\uB824\uC694."})]),t("button",{className:"button big-action",attrs:{type:"button","data-wide":""},disabled:!s||n,on:{click:()=>{r.confirmRestore()}}},[d.restore("icon"),t("span",{text:n?"\uBCF5\uC6D0\uD558\uB294 \uC911\u2026":"\uC0C8 \uC138\uACC4\uB85C \uBCF5\uC6D0"})]),t("p",{className:"hint center"},[d.info("icon"),"\uD604\uC7AC \uC138\uACC4\uB294 \uB36E\uC5B4\uC4F0\uC9C0 \uC54A\uC544\uC694."])])}function Nr(e){let r=new Date(e);if(Number.isNaN(r.getTime()))return"\uC54C \uC218 \uC5C6\uC74C";let a=new Intl.DateTimeFormat("ko-KR",{hour:"2-digit",minute:"2-digit",hour12:!1}).format(r);return r.toDateString()===new Date().toDateString()?`\uC624\uB298 ${a}`:`${new Intl.DateTimeFormat("ko-KR",{month:"long",day:"numeric"}).format(r)} ${a}`}function kt(e){return e>=1024*1024?`${(e/(1024*1024)).toFixed(1)} MB`:e>=1024?`${(e/1024).toFixed(1)} KB`:`${e} B`}function Sr(e){let r=e.storage,a;if(!r||r.state==="loading")a=N("\uD655\uC778\uD558\uB294 \uC911\u2026");else if(r.state==="error")a=B(r.message);else{let n=[[d.image,"\uC8FC\uBBFC \uADF8\uB9BC","residentImagesBytes"],[d.landscape,"\uBC30\uACBD","backgroundsBytes"],[d.document,"\uAE30\uB85D","recordsBytes"]],i=Math.max(1,...n.map(([,,o])=>r.value[o]));a=t("div",{className:"usage-rows"},n.map(([o,s,l])=>{let p=r.value[l],c=t("span",{className:"usage-fill"});return c.style.width=p>0?`max(0.9em, ${Math.round(p/i*100)}%)`:"0",t("div",{className:"usage-row"},[o("icon"),t("span",{className:"usage-label",text:s}),t("span",{className:"usage-bar",attrs:{role:"presentation"}},[c]),t("span",{className:"usage-size",text:kt(p)})])}))}return k("\uC800\uC7A5 \uACF5\uAC04 \uC0AC\uC6A9\uB7C9",[a,t("p",{className:"hint center"},[d.info("icon"),"\uADF8\uB9BC\uC740 WebP\uB85C \uBCF4\uAD00\uD574\uC694."])],{id:"fw-usage"})}function Rr(e,r){let a=!!e.busy.backup;return t("button",{className:"menu-row",attrs:{type:"button"},disabled:a,on:{click:()=>{r.downloadBackup()}}},[t("span",{className:"menu-icon"},[d.upload()]),t("span",{className:"menu-text"},[t("span",{className:"menu-title",text:a?"\uBC31\uC5C5 \uB9CC\uB4DC\uB294 \uC911\u2026":"\uBC31\uC5C5 \uB0B4\uBCF4\uB0B4\uAE30"}),t("span",{className:"menu-detail",text:"\uC138\uACC4 \xB7 \uC7AC\uD654 \xB7 \uCC3D\uACE0 \uD3EC\uD568 \xB7 \uBE44\uBC00\uD0A4 \uC81C\uC678"})]),t("span",{className:"menu-chevron"},[d.chevron()])])}function yt(e,r,a,n,i){return t("button",{className:"menu-row quiet",attrs:{type:"button"},on:{click:()=>e.navigate(r)}},[t("span",{className:"menu-icon quiet"},[a()]),t("span",{className:"menu-text"},[t("span",{className:"menu-title",text:n}),t("span",{className:"menu-detail",text:i})]),t("span",{className:"menu-chevron"},[d.chevron()])])}function xt(e,r){let a=e.world?.state==="ready"?e.world.value:null,n=a?[t("section",{className:"card saved",attrs:{"aria-label":"\uC800\uC7A5 \uC0C1\uD0DC"}},[t("p",{className:"saved-title"},[t("span",{className:"check"},[d.check()]),"\uC800\uC7A5 \uC644\uB8CC"]),t("p",{className:"saved-time",text:`\uB9C8\uC9C0\uB9C9 \uC800\uC7A5 ${Nr(a.updatedAt)}`})]),Sr(e),k(null,[Rr(e,r),ce(e,r,"fw-backup-restore")],{className:"menu"}),k(null,[t("button",{className:"menu-row",attrs:{type:"button"},on:{click:()=>r.openSheet({kind:"history-cleanup"})}},[t("span",{className:"menu-icon light"},[d.image()]),t("span",{className:"menu-text"},[t("span",{className:"menu-title",text:"\uADF8\uB9BC \uC774\uB825 \uC815\uB9AC"}),t("span",{className:"menu-detail",text:"\uB2E4\uB978 \uACF3\uC5D0\uC11C \uC4F0\uB294 \uADF8\uB9BC\uC740 \uC720\uC9C0"})]),t("span",{className:"menu-chevron"},[d.chevron()])]),yt(r,"worlds",d.house,"\uB2E4\uB978 \uC138\uACC4","\uC138\uACC4 \uACE0\uB974\uAE30 \xB7 \uC0C8\uB85C \uB9CC\uB4E4\uAE30"),yt(r,"diagnostics",d.info,"\uC5F0\uACB0 \uC810\uAC80","\uC5D4\uC9C4 \uC5F0\uACB0\uACFC \uADF8\uB9BC \uC800\uC7A5 \uACBD\uB85C \uD655\uC778")],{className:"menu"})]:[N("\uC138\uACC4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026")];return R(e,r,{top:{kind:"sub",title:"\uC800\uC7A5\xB7\uBC31\uC5C5",back:{route:"settings",label:"\uC124\uC815"},resources:!1},backdrop:"wood",body:n,nav:!0,sheet:a&&e.sheet?.kind==="history-cleanup"?Ir(a.state,e,r):null})}function Ir(e,r,a){let n=Object.values(e.residents).reduce((s,l)=>s+l.image.history.length,0),i=Object.values(e.residents).flatMap(s=>s.image.history).reduce((s,l)=>s+l.bytes,0),o=!!r.busy["image-history-clear"];return t("div",{className:"sheet-backdrop"},[t("section",{className:"sheet card",attrs:{role:"dialog","aria-modal":"true","aria-labelledby":"fw-history-cleanup"}},[t("h2",{className:"section-title",text:"\uADF8\uB9BC \uC774\uB825 \uC815\uB9AC",attrs:{id:"fw-history-cleanup"}}),n?t("p",{text:`\uC8FC\uBBFC\uB4E4\uC758 \uC774\uC804 \uADF8\uB9BC ${n}\uC7A5(${kt(i)})\uC744 \uC815\uB9AC\uD574\uC694. \uC9C0\uAE08 \uC4F0\uB294 \uADF8\uB9BC\uC740 \uADF8\uB300\uB85C\uC774\uACE0, \uC815\uB9AC\uD55C \uADF8\uB9BC\uC740 '\uC774\uC804 \uADF8\uB9BC'\uC5D0\uC11C \uB418\uB3CC\uB9B4 \uC218 \uC5C6\uC5B4\uC694.`}):t("p",{className:"empty",text:"\uC815\uB9AC\uD560 \uC774\uC804 \uADF8\uB9BC\uC774 \uC5C6\uC5B4\uC694."}),t("p",{className:"hint",text:"\uB2E4\uB978 \uACF3\uC5D0\uC11C \uC4F0\uB294 \uADF8\uB9BC \uD30C\uC77C\uC740 \uAC24\uB7EC\uB9AC\uC5D0 \uADF8\uB300\uB85C \uB0A8\uC544\uC694."}),n?y(o?"\uC815\uB9AC\uD558\uB294 \uC911\u2026":`${n}\uC7A5 \uC815\uB9AC\uD558\uAE30`,()=>{a.clearImageHistory()},{disabled:o,attrs:{"data-wide":""}}):null,y("\uB2EB\uAE30",()=>a.closeSheet(),{variant:"secondary",attrs:{"data-wide":""}})])])}function Cr(e,r,a){let n=!!r.busy["rename-nickname"],i=e.state.settings.playerNickname,o=t("input",{className:"input",attrs:{id:"fw-set-nick",maxlength:"24",autocomplete:"off",value:i}});return t("form",{className:"setting-row",on:{submit:s=>{s.preventDefault();let l=o.value.trim();l&&l!==i&&a.runCommand("rename-nickname","settings.update",{playerNickname:o.value})}}},[d.leaf("icon row-leaf"),t("label",{className:"setting-label",text:"\uB2C9\uB124\uC784",attrs:{for:"fw-set-nick"}}),t("span",{className:"setting-field"},[o,t("button",{className:"button small",text:n?"\uC800\uC7A5 \uC911\u2026":"\uC218\uC815",attrs:{type:"submit"},disabled:n})])])}function $r(e){return t("div",{className:"setting-row"},[d.leaf("icon row-leaf"),t("span",{className:"setting-label",text:"\uD604\uC2E4 \uB0A0\uC528"}),t("span",{className:"setting-field"},[t("span",{className:"input readonly"},[d.weather("icon"),t("span",{text:"\uB3C4\uC2DC \uBBF8\uC124\uC815"})]),S(e,"weather",{className:"button small",label:"\uD604\uC2E4 \uB0A0\uC528 \uBCC0\uACBD",children:[t("span",{text:"\uBCC0\uACBD"})]})])])}function Mr(e,r){let a=t("input",{className:"slider",attrs:{id:"fw-font-size",type:"range",min:String(F.min),max:String(F.max),step:String(F.step),value:String(e.fontSize),"aria-valuetext":`${e.fontSize}px`},on:{change:()=>r.setFontSize(Number(a.value))}});return t("div",{className:"setting-block"},[t("div",{className:"setting-row slider-row"},[d.leaf("icon row-leaf"),t("label",{className:"setting-label",text:"\uAE00\uC790 \uD06C\uAE30",attrs:{for:"fw-font-size"}}),a,t("span",{className:"slider-value",text:`${e.fontSize}px`})]),t("p",{className:"font-preview",text:"\uC774\uB807\uAC8C \uD45C\uC2DC\uB3FC\uC694."})])}function Nt(e,r,a,n,i){return S(e,r,{className:"toggle-row",label:n,children:[t("span",{className:"toggle-icon"},[a("icon")]),t("span",{className:"toggle-text"},[t("strong",{text:n}),t("span",{text:i})]),t("span",{className:"switch off"},[t("span",{className:"knob"})])]})}function me(e,r,a,n){let i=[t("span",{className:"manage-icon"},[r("icon")]),t("span",{className:"manage-title",text:a}),t("span",{className:"menu-chevron"},[d.chevron()])];return"route"in n?t("button",{className:"manage-row",attrs:{type:"button"},on:{click:()=>e.navigate(n.route)}},i):S(e,n.feature,{className:"manage-row",label:a,children:i})}function St(e,r){let a=e.world?.state==="ready"?e.world.value:null,n=a?[k("\uB0B4 \uACF5\uBC29",[Cr(a,e,r),$r(r)],{id:"fw-mine"}),k("\uD45C\uC2DC",[Mr(e,r),Nt(r,"weather-effects",d.leaf,"\uB0A0\uC528 \uD6A8\uACFC","\uACF5\uBC29 \uBC30\uACBD\uC5D0 \uD604\uC7AC \uB0A0\uC528\uB97C \uBC18\uC601\uD574\uC694."),Nt(r,"auto-read",d.book,"\uC790\uB3D9 \uC77D\uAE30","\uC774\uC57C\uAE30\uB97C \uC790\uB3D9\uC73C\uB85C \uB118\uACA8\uC694.")],{id:"fw-display"}),k("\uAD00\uB9AC",[me(r,d.image,"\uC8FC\uBBFC \uADF8\uB9BC \uAD00\uB9AC",{route:"residents"}),me(r,d.flower,"AI \uC9C0\uCE68 \uAD00\uB9AC",{feature:"ai-guidelines"}),me(r,d.people,"\uAE30\uC5B5 \uAD00\uB9AC",{feature:"memory"}),me(r,d.folder,"\uC800\uC7A5 \xB7 \uBC31\uC5C5",{route:"backup"}),t("div",{className:"note-box"},[d.clock("icon"),t("span",{},[t("strong",{text:"\uBBF8\uC811\uC18D \uB204\uC801 \uC0C1\uD55C 72\uC2DC\uAC04"}),t("span",{text:"72\uC2DC\uAC04\uC774 \uC9C0\uB098\uBA74 \uC77C\uBD80 \uC790\uB3D9 \uC9C4\uD589\uC774 \uBA48\uCDB0\uC694."})])])],{id:"fw-manage"}),t("p",{className:"footnote",text:"\uC790\uB3D9\uD654 \uADDC\uCE59\uC740 \uC791\uC5C5 \uD654\uBA74\uC5D0\uC11C \uBC14\uAFC0 \uC218 \uC788\uC5B4\uC694."})]:[N("\uC138\uACC4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026")];return R(e,r,{top:{kind:"sub",title:"\uC124\uC815",back:{route:"home",label:"\uD648"},resources:!1},backdrop:"wood",body:n,nav:!0})}function Rt(e,r){let a=new Map(r?.items.map((n,i)=>[n.id,i]));return Object.entries(e.state.inventory).filter(([,n])=>n>0).sort(([n],[i])=>(a.get(n)??999)-(a.get(i)??999)).map(([n,i])=>({itemId:n,amount:i,name:j(r,n)}))}function Ar(e,r){let a=(n,i,o)=>t("button",{className:`big-tab${e.facilitiesTab===n?" current":""}`,attrs:{type:"button",role:"tab","aria-selected":e.facilitiesTab===n?"true":"false"},on:{click:()=>r.setFacilitiesTab(n)}},[o,t("span",{text:i})]);return t("div",{className:"big-tabs",attrs:{role:"tablist","aria-label":"\uC2DC\uC124\uACFC \uCC3D\uACE0"}},[a("facilities","\uC2DC\uC124",d.house("icon big")),a("storage","\uCC3D\uACE0",d.box("icon big"))])}function zr(e,r,a,n){let i=e.work.facilityId,o=a.state.production.facilities[i],s=oe(r,i),l=r.production.maxLevel,p=o.level>=l,c=p?null:r.production.upgradeCosts[o.level-1],m=!!e.busy[`upgrade:${i}:${o.level}`],f=c!==null&&a.state.wallet.gold<c;return k(null,[t("div",{className:"chip-row",attrs:{role:"group","aria-label":"\uC2DC\uC124 \uACE0\uB974\uAE30"}},r.facilities.map(h=>t("button",{className:`pill-tab${h.id===i?" current":""}`,text:h.name,attrs:{type:"button","aria-pressed":h.id===i?"true":"false"},on:{click:()=>n.selectFacility(h.id)}}))),t("div",{className:"facility"},[t("span",{className:"facility-picture"},[d.house("icon huge")]),t("div",{className:"facility-info"},[t("strong",{className:"facility-name",text:s?.name??i}),t("span",{className:"facility-level"},[`Lv. ${o.level}`,p?null:t("span",{className:"level-next",text:` \u2192 Lv. ${o.level+1}`})]),t("div",{className:"effect-row"},[t("span",{text:"\uCC98\uB9AC \uC18D\uB3C4"}),t("span",{},[`+${_(r,o.level)}%`,p?null:t("span",{className:"level-next",text:` \u2192 +${_(r,o.level+1)}%`})])]),t("div",{className:"effect-row"},[t("span",{text:"\uC791\uC5C5 \uBC29\uC2DD"}),t("span",{text:"\uC790\uB3D9 \uC6B4\uC601"})]),t("p",{className:"muted",text:s?.description??""}),t("button",{className:"gold-button",attrs:{type:"button"},disabled:p||m||f,on:{click:()=>{n.upgradeFacility(i,o.level)}}},p?[t("span",{text:"\uCD5C\uACE0 \uB2E8\uACC4"})]:[t("span",{className:"coin"}),t("span",{text:m?"\uAC15\uD654\uD558\uB294 \uC911\u2026":`${c.toLocaleString("ko-KR")} G \xB7 \uAC15\uD654`})]),f?t("p",{className:"hint",text:`\uACE8\uB4DC\uAC00 ${(c-a.state.wallet.gold).toLocaleString("ko-KR")} G \uBD80\uC871\uD574\uC694.`}):null])])],{className:"facility-card"})}function Tr(e,r,a){let n=Rt(e,r),i=e.state.production.protectedStock;return k(null,[t("div",{className:"card-head"},[t("div",{},[t("h2",{className:"section-title",text:"\uC7AC\uACE0 \uBCF4\uD638",attrs:{id:"fw-protect"}}),t("p",{className:"muted",text:"\uC9C0\uC815\uD55C \uC218\uB7C9\uC740 \uC81C\uC791\uACFC \uD310\uB9E4\uC5D0 \uC0AC\uC6A9\uD558\uC9C0 \uC54A\uC544\uC694."})]),t("button",{className:"outline-button",attrs:{type:"button"},on:{click:()=>a.openSheet({kind:"protect-edit"})}},[d.pencil("icon"),t("span",{text:"\uD3B8\uC9D1\uD558\uAE30"})])]),n.length===0?t("p",{className:"empty",text:"\uCC3D\uACE0\uAC00 \uBE44\uC5B4 \uC788\uC5B4\uC694."}):t("table",{className:"stock"},[t("thead",{},[t("tr",{},["\uC544\uC774\uD15C","\uBCF4\uC720 \uC218\uB7C9","\uBCF4\uD638 \uC7AC\uACE0","\uC608\uC57D \uC7AC\uACE0","\uC0AC\uC6A9 \uAC00\uB2A5"].map(o=>t("th",{text:o,attrs:{scope:"col"}})))]),t("tbody",{},n.map(o=>{let s=i[o.itemId]??0;return t("tr",{},[t("th",{attrs:{scope:"row"}},[W(o.itemId),o.name]),t("td",{className:"num",text:o.amount.toLocaleString("ko-KR")}),t("td",{className:`num${s?" protected":""}`,text:s?String(s):"\u2013"}),t("td",{className:"num",text:"\u2013"}),t("td",{className:"num available",text:Math.max(0,o.amount-s).toLocaleString("ko-KR")})])}))]),S(a,"auto-sell",{className:"toggle-row",label:"\uC790\uB3D9 \uD310\uB9E4",children:[t("span",{className:"toggle-icon"},[d.gear("icon")]),t("span",{className:"toggle-text"},[t("strong",{text:"\uC790\uB3D9 \uD310\uB9E4"}),t("span",{text:"\uBCF4\uD638 \xB7 \uC608\uC57D \uC7AC\uACE0\uB294 \uC0AC\uC6A9\uD558\uC9C0 \uC54A\uC544\uC694."})]),t("span",{className:"switch off"},[t("span",{className:"knob"}),t("span",{className:"switch-label",text:"\uAEBC\uC9D0"})])]})],{id:"fw-protect"})}function Lr(e,r,a){let n=Rt(e,r);return k("\uCC3D\uACE0",[n.length===0?t("p",{className:"empty",text:"\uCC3D\uACE0\uAC00 \uBE44\uC5B4 \uC788\uC5B4\uC694."}):t("ul",{className:"storage-grid"},n.map(i=>t("li",{className:"storage-item"},[W(i.itemId,"big"),t("span",{className:"storage-name",text:i.name}),t("strong",{text:i.amount.toLocaleString("ko-KR")}),t("button",{className:"outline-button small",attrs:{type:"button","aria-label":`${i.name} \uD314\uAE30`},on:{click:()=>a.openSheet({kind:"sell",itemId:i.itemId})}},[t("span",{text:"\uD314\uAE30"})])])))],{id:"fw-storage"})}function It(e,r,a,n){let i=Math.min(n,Math.max(a,r)),o=t("output",{className:"step-value big",text:String(i),attrs:{id:e,"aria-live":"polite"}}),s=l=>t("button",{className:"step",text:l>0?`+${l}`:String(l),attrs:{type:"button","aria-label":`${l>0?"\uB298\uB9AC\uAE30":"\uC904\uC774\uAE30"} ${Math.abs(l)}`},on:{click:()=>{i=Math.min(n,Math.max(a,i+l)),o.textContent=String(i)}}});return{node:t("div",{className:"stepper wide"},[s(-10),s(-1),o,s(1),s(10)]),read:()=>i}}function Pr(e,r,a,n){let i=a.production.protectedStock,o=a.items.map(s=>{let l=It(`fw-protect-${s.id}`,r.state.production.protectedStock[s.id]??0,i.min,i.max),p=!!e.busy[`protect:${s.id}`];return t("li",{className:"protect-row"},[W(s.id),t("span",{className:"protect-name"},[t("strong",{text:s.name}),t("small",{className:"muted",text:`\uBCF4\uC720 ${r.state.inventory[s.id]??0}`})]),l.node,y(p?"\uC800\uC7A5 \uC911\u2026":"\uC800\uC7A5",()=>{n.setProtected(s.id,l.read())},{disabled:p,attrs:{"aria-label":`${s.name} \uBCF4\uD638 \uC218\uB7C9 \uC800\uC7A5`}})])});return t("div",{className:"sheet-backdrop"},[t("section",{className:"sheet card",attrs:{role:"dialog","aria-modal":"true","aria-labelledby":"fw-protect-edit"}},[t("h2",{className:"section-title",text:"\uC7AC\uACE0 \uBCF4\uD638 \uD3B8\uC9D1",attrs:{id:"fw-protect-edit"}}),t("p",{className:"muted",text:"\uBCF4\uD638\uD55C \uC218\uB7C9\uC740 \uC790\uB3D9 \uC81C\uC791\uACFC \uD310\uB9E4\uC5D0 \uC4F0\uC9C0 \uC54A\uC544\uC694. 0\uC774\uBA74 \uBCF4\uD638\uD558\uC9C0 \uC54A\uC544\uC694."}),t("ul",{className:"protect-list"},o),y("\uB2EB\uAE30",()=>n.closeSheet(),{variant:"secondary",attrs:{"data-wide":""}})])])}function jr(e,r,a,n,i){let o=a.items.find(m=>m.id===i),s=r.state.inventory[i]??0,l=Math.max(0,s-(r.state.production.protectedStock[i]??0)),p=It("fw-sell-amount",Math.min(l,1),l?1:0,l),c=!!e.busy[`sell:${i}`];return t("div",{className:"sheet-backdrop"},[t("section",{className:"sheet card",attrs:{role:"dialog","aria-modal":"true","aria-labelledby":"fw-sell"}},[t("h2",{className:"section-title",text:`${o?.name??i} \uD314\uAE30`,attrs:{id:"fw-sell"}}),t("p",{className:"muted",text:`1\uAC1C ${o?.sellPrice??0} G \xB7 \uD314 \uC218 \uC788\uB294 \uC591 ${l}\uAC1C (\uBCF4\uC720 ${s}\uAC1C, \uBCF4\uD638\uBD84 \uC81C\uC678)`}),l?p.node:t("p",{className:"empty",text:"\uBCF4\uD638\uBD84\uC744 \uBE7C\uBA74 \uD314 \uC218 \uC788\uB294 \uC591\uC774 \uC5C6\uC5B4\uC694."}),l?y(c?"\uD30C\uB294 \uC911\u2026":"\uD314\uAE30",()=>{n.sell(i,p.read())},{disabled:c,attrs:{"data-wide":""}}):null,y("\uB2EB\uAE30",()=>n.closeSheet(),{variant:"secondary",attrs:{"data-wide":""}})])])}function Ct(e,r){let a=e.world?.state==="ready"?e.world.value:null,n=e.content,i=a&&n,o=i&&e.sheet?.kind==="protect-edit"?Pr(e,a,n,r):i&&e.sheet?.kind==="sell"?jr(e,a,n,r,e.sheet.itemId):null;return R(e,r,{top:{kind:"sub",title:"\uC2DC\uC124\uACFC \uCC3D\uACE0",back:{route:"work",label:"\uACF5\uBC29 \uC791\uC5C5"},resources:!0},backdrop:"forest",body:i?[Ar(e,r),...e.facilitiesTab==="facilities"?[zr(e,n,a,r),Tr(a,n,r)]:[Lr(a,n,r)]]:[N("\uC138\uACC4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026")],nav:!0,sheet:o})}var Wr=[{field:"gather",label:"\uCC44\uC9D1",icon:d.leaf},{field:"grow",label:"\uC7AC\uBC30",icon:d.sprout},{field:"survey",label:"\uC870\uC0AC",icon:d.search},{field:"process",label:"\uAC00\uACF5",icon:d.jar},{field:"craft",label:"\uC81C\uC791",icon:d.hammer}];function Er(e,r,a){return t("div",{className:"field-tabs",attrs:{role:"tablist","aria-label":"\uC791\uC5C5 \uBD84\uC57C"}},Wr.map(n=>{let i=e.facilities.find(s=>s.field===n.field);if(!i)return S(a,"work-fields",{className:"field-tab",label:n.label,children:[n.icon("icon field-glyph"),t("span",{text:n.label})]});let o=i.id===r;return t("button",{className:`field-tab${o?" current":""}`,attrs:{type:"button",role:"tab","aria-selected":o?"true":"false"},on:{click:()=>a.selectFacility(i.id)}},[n.icon("icon field-glyph"),t("span",{text:n.label})])}))}function Fr(e){return t("div",{className:"segmented",attrs:{role:"group","aria-label":"\uC791\uC5C5 \uBC29\uC2DD"}},[t("span",{className:"segment selected",text:"\uC790\uB3D9 \uC6B4\uC601",attrs:{"aria-current":"true"}}),S(e,"work-mode",{className:"segment",label:"\uC9C0\uC815 \uD69F\uC218",children:[t("span",{text:"\uC9C0\uC815 \uD69F\uC218"})]})])}function Br(e,r,a,n){let i=oe(e,r);return t("div",{className:"facility-entry"},[t("button",{className:"facility-open",attrs:{type:"button","aria-label":`${i?.name??"\uC2DC\uC124"} \u2014 \uC2DC\uC124\uACFC \uCC3D\uACE0 \uC5F4\uAE30`},on:{click:()=>n.navigate("facilities")}},[t("span",{className:"facility-art"},[d.house("icon big")]),t("span",{className:"facility-text"},[t("strong",{text:`${i?.name??r} Lv. ${a.level}`}),t("span",{text:`${i?.description??""} \uCC98\uB9AC \uC18D\uB3C4 +${_(e,a.level)}%`})])]),S(n,"assign-residents",{className:"outline-button",label:"\uBC30\uCE58 \uBCC0\uACBD",children:[d.swap("icon"),t("span",{text:"\uBC30\uCE58 \uBCC0\uACBD"})]})])}function Or(e,r,a){let n=r?G(e,r.recipeId):null;if(!n)return t("div",{className:"recipe"},[t("span",{className:"recipe-art"},[d.jar("icon big")]),t("span",{className:"recipe-text"},[t("strong",{text:"\uC81C\uC791\uBC95"}),t("span",{text:"\uC544\uB798 \uC6B0\uC120\uC21C\uC704\uC5D0\uC11C \uC81C\uC791\uBC95\uC744 \uCD94\uAC00\uD574 \uC8FC\uC138\uC694."})])]);let i=Object.keys(n.outputs)[0],o=tt(e,n,a),s=[...Object.entries(n.inputs).map(([l,p])=>`${j(e,l)} ${p}`)];return t("div",{className:"recipe"},[t("span",{className:"recipe-art"},[W(i,"big")]),t("span",{className:"recipe-text"},[t("strong",{text:n.name}),t("span",{text:n.description}),t("span",{className:"recipe-flow",text:`${s.length?`${s.join(" \xB7 ")} \u2192 `:""}${Object.entries(n.outputs).map(([l,p])=>`${j(e,l)} ${p}`).join(" \xB7 ")} \xB7 1\uD68C ${q(o)}`})])])}function Vr(e,r,a,n,i){let o=G(e,n.recipeId),s=o?Object.keys(o.outputs)[0]:"",l=r.state.production,p=r.state.inventory[s]??0,c=Object.values(l.facilities).reduce((h,x)=>h+(x.job?.outputs[s]??0),0),m=t("span",{className:"bar-fill red"});m.style.width=`${Math.min(100,Math.round((p+c)/Math.max(1,n.targetStock)*100))}%`;let f=(h,x,I,L=!1)=>t("button",{className:`step${L?" plus":""}`,attrs:{type:"button","aria-label":I},on:{click:()=>i.changeTarget(a,n.policyId,h)}},[x("icon")]);return t("div",{className:"plan-row"},[t("span",{className:"plan-label",text:"\uBAA9\uD45C \uC7AC\uACE0"}),t("span",{className:"stepper"},[f(-1,d.minus,"\uBAA9\uD45C 1 \uC904\uC774\uAE30"),t("span",{className:"step-value",text:String(n.targetStock),attrs:{"aria-live":"polite"}}),f(1,d.plus,"\uBAA9\uD45C 1 \uB298\uB9AC\uAE30",!0)]),t("span",{className:"plan-progress"},[t("span",{className:"muted"},[`\uD604\uC7AC ${j(e,s)} `,t("strong",{text:String(p)}),c?` (+${c} \uC9C4\uD589 \uC911)`:""," / \uBAA9\uD45C ",t("strong",{text:String(n.targetStock)})]),t("span",{className:"bar"},[m])])])}function Dr(e,r,a){let n=a?G(e,a.recipeId):null,i=n?Object.entries(n.inputs):[],o=r.state.production;return t("div",{className:"plan-block"},[t("span",{className:"plan-label",text:"\uC7AC\uB8CC \uC0AC\uC6A9 \uC124\uC815"}),i.length===0?t("p",{className:"muted",text:"\uC774 \uC81C\uC791\uBC95\uC740 \uC7AC\uB8CC \uC5C6\uC774 \uC232\uC5D0\uC11C \uBC14\uB85C \uBAA8\uC544\uC694."}):t("div",{className:"usage-list"},i.map(([s])=>{let l=r.state.inventory[s]??0,p=o.protectedStock[s]??0;return t("div",{className:"usage"},[t("span",{className:"usage-item"},[W(s),t("span",{text:j(e,s)})]),t("span",{className:"usage-cell"},[t("small",{text:"\uBCF4\uC720"}),t("strong",{text:String(l)})]),t("span",{className:"usage-cell"},[t("small",{text:"\uBCF4\uD638"}),t("strong",{text:String(p)})]),t("span",{className:"usage-cell available"},[t("small",{text:"\uC0AC\uC6A9 \uAC00\uB2A5"}),t("strong",{text:String(Math.max(0,l-p))})])])}))])}function Hr(e,r,a,n,i){let o=new Set(a.map(l=>l.recipeId)),s=e.recipes.filter(l=>l.facilityId===r&&!o.has(l.id));return t("div",{className:"plan-block"},[t("span",{className:"plan-label"},["\uC81C\uC791 \uC6B0\uC120\uC21C\uC704 ",t("small",{text:"(\uC704\uC758 \uC544\uC774\uD15C\uBD80\uD130 \uC21C\uC11C\uB300\uB85C \uC81C\uC791\uD574\uC694)"})]),...a.map((l,p)=>{let c=G(e,l.recipeId),m=c?Object.keys(c.outputs)[0]:"";return t("div",{className:`priority-row${l.policyId===n?" selected":""}${l.enabled?"":" off"}`},[t("span",{className:"rank",text:String(p+1)}),t("button",{className:"priority-main",attrs:{type:"button","aria-pressed":l.policyId===n?"true":"false"},on:{click:()=>i.selectRule(r,l.policyId)}},[W(m),t("span",{className:"priority-name",text:c?.name??l.recipeId}),t("small",{className:"muted",text:`\uBAA9\uD45C ${l.targetStock}`})]),t("button",{className:`chip-toggle${l.enabled?" on":""}`,text:l.enabled?"\uCF1C\uC9D0":"\uAEBC\uC9D0",attrs:{type:"button","aria-pressed":l.enabled?"true":"false","aria-label":`${c?.name??""} ${l.enabled?"\uB044\uAE30":"\uCF1C\uAE30"}`},on:{click:()=>i.toggleRule(r,l.policyId)}}),t("span",{className:"order-buttons"},[t("button",{className:"mini",attrs:{type:"button","aria-label":"\uC704\uB85C"},disabled:p===0,on:{click:()=>i.moveRule(r,l.policyId,-1)}},[d.up("icon")]),t("button",{className:"mini",attrs:{type:"button","aria-label":"\uC544\uB798\uB85C"},disabled:p===a.length-1,on:{click:()=>i.moveRule(r,l.policyId,1)}},[d.down("icon")])])])}),s.length?t("div",{className:"add-rules"},s.map(l=>t("button",{className:"outline-button small",attrs:{type:"button"},on:{click:()=>i.addRule(r,l.id)}},[d.plus("icon"),t("span",{text:l.name})]))):null])}function Gr(e,r,a,n){if(!n.job)return t("div",{className:"plan-row"},[t("span",{className:"plan-label",text:"\uD604\uC7AC \uC791\uC5C5"}),t("span",{className:"plan-progress wide"},[t("span",{className:"muted",text:"\uC26C\uB294 \uC911"}),t("span",{className:"bar"})])]);let i=G(r,n.job.recipeId),o=Object.keys(n.job.outputs)[0],s=rt(e,a,n.job);return t("div",{className:"plan-row current-work"},[t("span",{className:"plan-label",text:"\uD604\uC7AC \uC791\uC5C5"}),W(o),t("span",{className:"plan-progress"},[t("span",{className:"muted",text:`${i?.name??""} \uB9CC\uB4DC\uB294 \uC911\u2026`}),s.bar]),s.countdown])}function Kr(e,r,a,n){let i=e.work.facilityId,o=a.state.production.facilities[i];if(!o)return[N("\uC2DC\uC124\uC744 \uBD88\uB7EC\uC624\uB294 \uC911\u2026")];let s=fe(e,a.state.production,i),l=s.find(m=>m.policyId===e.work.selected[i])??s[0],p=Oe(e,a.state.production,i),c=!!e.busy[`rules:${i}`];return[Er(r,i,n),k(null,[Fr(n),Br(r,i,o,n),Or(r,l,o.level),l?Vr(r,a,i,l,n):null,Dr(r,a,l),Hr(r,i,s,l?.policyId,n),Gr(e,r,a,o),t("p",{className:"hint center"},[d.info("icon"),o.waiting?at(r,o.waiting):"\uC7AC\uB8CC\uAC00 \uBD80\uC871\uD558\uBA74 \uAE30\uB2E4\uB838\uB2E4 \uB2E4\uC2DC \uC2DC\uC791\uD574\uC694."]),p?t("p",{className:"draft-note"},["\uBC14\uAFBC \uADDC\uCE59\uC740 \uC544\uC9C1 \uC801\uC6A9 \uC804\uC774\uC5D0\uC694. ",t("button",{className:"link-button",text:"\uB418\uB3CC\uB9AC\uAE30",attrs:{type:"button"},on:{click:()=>n.discardDraft(i)}})]):null],{className:"work-card"}),t("div",{className:"rule-actions"},[t("button",{className:"button wide-main",attrs:{type:"button"},disabled:!p||c,on:{click:()=>{n.applyRules(i)}}},[t("span",{text:c?"\uC801\uC6A9\uD558\uB294 \uC911\u2026":p?"\uC6B4\uC601 \uADDC\uCE59 \uC801\uC6A9":"\uC801\uC6A9\uB428"})]),t("button",{className:"button secondary",attrs:{type:"button"},on:{click:()=>n.recommendRules(i)}},[d.gear("icon"),t("span",{text:"\uCD94\uCC9C \uC124\uC815"})])])]}function $t(e,r){let a=e.world?.state==="ready"?e.world.value:null;return R(e,r,{top:{kind:"sub",title:"\uACF5\uBC29 \uC791\uC5C5",back:{route:"home",label:"\uD648"},resources:!0},backdrop:"forest",body:a&&e.content?Kr(e,e.content,a,r):[N("\uC138\uACC4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026")],nav:!0})}var Mt={world:40,nickname:24};function qr(e){let r=new Date(e);return Number.isNaN(r.getTime())?e:new Intl.DateTimeFormat("ko-KR",{dateStyle:"medium",timeStyle:"short"}).format(r)}function Ur(e,r){let a=k("\uB0B4 \uC138\uACC4",[],{id:"fw-worlds"}),{worlds:n}=e;return n.state==="loading"?a.append(N("\uBD88\uB7EC\uC624\uB294 \uC911\u2026")):n.state==="error"?a.append(B(n.message),y("\uB2E4\uC2DC \uC2DC\uB3C4",()=>{r.loadWorlds()},{variant:"secondary"})):n.value.length===0?a.append(t("p",{className:"empty",text:"\uC544\uC9C1 \uC138\uACC4\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4. \uC544\uB798\uC5D0\uC11C \uC0C8\uB85C \uB9CC\uB4E4\uC5B4 \uC8FC\uC138\uC694."})):a.append(t("ul",{className:"menu-list"},n.value.map(i=>t("li",{},[t("button",{className:"menu-row",attrs:{type:"button"},disabled:!i.readable,on:{click:()=>{r.openWorld(i.worldId)}}},[t("span",{className:"menu-icon"},[d.house()]),t("span",{className:"menu-text"},[t("span",{className:"menu-title",text:i.worldName}),t("span",{className:"menu-detail",text:i.readable?`\uB9C8\uC9C0\uB9C9 \uC800\uC7A5 ${qr(i.updatedAt)}`:"\uC774 \uBC84\uC804\uC5D0\uC11C \uC77D\uC744 \uC218 \uC5C6\uB294 \uC138\uACC4"})]),t("span",{className:"menu-chevron"},[d.chevron()])])])))),a}function _r(e,r){let a=!!e.busy["create-world"],n=t("input",{className:"input",attrs:{id:"fw-world-name",name:"worldName",maxlength:String(Mt.world),autocomplete:"off",required:""}}),i=t("input",{className:"input",attrs:{id:"fw-nickname",name:"playerNickname",maxlength:String(Mt.nickname),autocomplete:"off",required:""}});return t("form",{className:"card form",attrs:{"aria-labelledby":"fw-create"},on:{submit:s=>{s.preventDefault(),!(!n.value.trim()||!i.value.trim())&&r.createWorld(n.value,i.value)}}},[t("h2",{className:"section-title",text:"\uC0C8 \uC138\uACC4 \uB9CC\uB4E4\uAE30",attrs:{id:"fw-create"}}),t("p",{className:"muted",text:"\uD50C\uB808\uC774\uC5B4\uB294 \uC678\uD615 \uC5C6\uC774 \uB2C9\uB124\uC784\uC73C\uB85C\uB9CC \uB4F1\uC7A5\uD569\uB2C8\uB2E4. \uB458 \uB2E4 \uB098\uC911\uC5D0 \uC124\uC815\uC5D0\uC11C \uBC14\uAFC0 \uC218 \uC788\uC2B5\uB2C8\uB2E4."}),t("label",{className:"field-label",text:"\uC138\uACC4 \uC774\uB984",attrs:{for:"fw-world-name"}}),n,t("label",{className:"field-label",text:"\uB0B4 \uB2C9\uB124\uC784",attrs:{for:"fw-nickname"}}),i,t("button",{className:"button",text:a?"\uB9CC\uB4DC\uB294 \uC911\u2026":"\uB9CC\uB4E4\uAE30",attrs:{type:"submit"},disabled:a})])}function At(e,r){let a=e.world?.state==="ready";return R(e,r,{top:a?{kind:"sub",title:"\uC138\uACC4 \uACE0\uB974\uAE30",back:{route:"backup",label:"\uC800\uC7A5\xB7\uBC31\uC5C5"},resources:!1}:{kind:"sub",title:"\uC232\uACB0 \uACF5\uBC29",resources:!1},backdrop:"wood",body:[Ur(e,r),_r(e,r),k("\uBC31\uC5C5\uC5D0\uC11C \uBCF5\uC6D0",[ce(e,r,"fw-worlds-restore")],{id:"fw-worlds-restore-title",className:"menu"})],nav:!1})}var zt=`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 48'%3E%3Cpath d='M0 0h120v26c-8 0-10 12-20 12S88 22 78 22 66 36 56 36 44 20 34 20 22 34 12 34 4 26 0 26z' fill='%2394bf74' stroke='%235f8f45' stroke-width='3'/%3E%3C/svg%3E")`,Tt=`
:host {
  --fs: var(--fw-font-size, 16px);
  --ink: #4b2e1a;
  --line: 3px;
  --line-in: 2.5px;
  --drop: 0 0.22em 0 var(--ink);
  --fw-page: #f1e4c3;
  --fw-surface: #fbf1da;
  --fw-surface-2: #f2e2bd;
  --fw-surface-3: #fff8e8;
  --fw-text: #3f2717;
  --fw-muted: #7a5a3d;
  --fw-accent: #2e7f72;
  --fw-on-accent: #fffaf0;
  --fw-wood: #c58a52;
  --fw-wood-dark: #8a5a33;
  --fw-leaf: #5a9a44;
  --fw-leaf-soft: #dcebc4;
  --fw-gold: #f3c34a;
  --fw-pass: #3f8a3d;
  --fw-fail: #c0433a;
  --fw-blue: #3a6fc0;
  --fw-unavailable: #8a6a12;
  --fw-track: #e4d6b6;
  display: block;
  height: 100%;
  overflow: hidden;
  color: var(--fw-text);
  color-scheme: light;
  font: 500 var(--fs)/1.5 system-ui, -apple-system, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif;
  -webkit-text-size-adjust: 100%;
  word-break: keep-all;
  overflow-wrap: anywhere;
}
* { box-sizing: border-box; }
p { margin: 0; }
.icon { width: 1.35em; height: 1.35em; flex: none; fill: none; stroke: currentColor; stroke-width: 2.4; stroke-linecap: round; stroke-linejoin: round; }
.icon .fill { fill: currentColor; stroke: none; }
.icon.tiny { width: 0.95em; height: 0.95em; }
.icon.big { width: 2.2em; height: 2.2em; }
.icon.huge { width: 4.5em; height: 4.5em; stroke-width: 2; }
.muted-icon { color: var(--fw-muted); }
.visually-hidden { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }

/* \u2500\u2500 Frame \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.shell { position: relative; height: 100%; display: flex; flex-direction: column; overflow: hidden; }
.scroll { flex: 1 1 auto; min-height: 0; overflow-y: auto; overflow-x: hidden; overscroll-behavior: contain; }
.column { width: 100%; max-width: 520px; margin: 0 auto; min-height: 100%; display: flex; flex-direction: column; }
.backdrop-forest { background: var(--fw-page); }
.backdrop-forest .scroll {
  background-color: var(--fw-page);
  background-image: ${zt}, linear-gradient(#94bf74, #94bf74);
  background-repeat: repeat-x, no-repeat;
  background-size: 7.5em 3em, 100% 5.2em;
  background-position: 0 5.1em, 0 0;
}
.backdrop-wood { background: #a8703f; }
.backdrop-wood .scroll {
  background-color: #a8703f;
  background-image: ${zt}, linear-gradient(#94bf74, #94bf74),
    repeating-linear-gradient(90deg, #b07a46 0 2.4em, var(--ink) 2.4em calc(2.4em + 3px), #a8703f calc(2.4em + 3px) 4.8em, var(--ink) 4.8em calc(4.8em + 3px));
  background-repeat: repeat-x, no-repeat, repeat;
  background-size: 7.5em 3em, 100% 5.2em, auto;
  background-position: 0 5.1em, 0 0, 0 0;
}
.backdrop-wood .page { padding-left: 0.75em; padding-right: 0.75em; }
.page {
  flex: 1 0 auto;
  display: grid;
  gap: 0.85em;
  align-content: start;
  padding: 0.6em 0.9em 1.25em;
}
.page > * { min-width: 0; }
.muted { color: var(--fw-muted); font-size: calc(var(--fs) * 0.875); }
.empty { color: var(--fw-muted); }
.error { color: var(--fw-fail); font-weight: 800; overflow-wrap: anywhere; }
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
  border-radius: 1em;
  border: var(--line) solid var(--ink);
  background: var(--fw-surface-3);
  box-shadow: var(--drop);
}
.has-nav .notice { bottom: calc(5.8em + env(safe-area-inset-bottom, 0px)); }
/* While a toast shows, the page can scroll its last controls above it. */
.has-notice .page { padding-bottom: 6em; }
.notice p { flex: 1; min-width: 0; overflow-wrap: anywhere; font-weight: 700; }
.notice.error { color: var(--fw-fail); background: #fde9e2; }
.notice-close { flex: none; min-height: 2.75em; padding: 0 0.6em; border: 0; background: none; color: inherit; font: inherit; font-weight: 800; text-decoration: underline; text-decoration-thickness: 2px; cursor: pointer; }

/* \u2500\u2500 Top bar \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.top { display: grid; gap: 0.45em; padding: 0.75em 0.75em 0.4em; }
.top-row { display: flex; align-items: center; gap: 0.45em; min-width: 0; }
.top-row.second { justify-content: space-between; }
.sign {
  position: relative;
  margin: 0;
  min-width: 0;
  padding: 0.28em 1em;
  border-radius: 0.6em;
  border: var(--line) solid var(--ink);
  background: var(--fw-wood);
  color: var(--ink);
  font-size: calc(var(--fs) * 1.4);
  font-weight: 900;
  line-height: 1.2;
  letter-spacing: 0.02em;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  box-shadow: var(--drop), inset 0 -0.3em 0 #b07a46;
}
.sign::before, .sign::after {
  content: "";
  position: absolute;
  top: 50%;
  width: 0.38em;
  height: 0.38em;
  margin-top: -0.19em;
  border-radius: 50%;
  background: var(--ink);
}
.sign::before { left: 0.38em; }
.sign::after { right: 0.38em; }
.sign-home { flex: 0 1 auto; font-size: calc(var(--fs) * 1.6); padding: 0.22em 0.95em; }
.top-sub .sign { flex: 1 1 auto; }
.top-sub.with-resources .sign { flex: 0 1 auto; font-size: calc(var(--fs) * 1.05); padding: 0.32em 0.95em; }
.top-sub:not(.with-resources) .sign { margin-right: 3.2em; }
.back-button, .back-spacer { flex: none; width: 2.75em; height: 2.75em; }
.back-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.75em;
  border: var(--line) solid var(--ink);
  background: var(--fw-surface-3);
  color: var(--ink);
  box-shadow: var(--drop);
  cursor: pointer;
}
.back-button .icon { stroke-width: 3; }
.resources { display: flex; align-items: center; gap: 0.3em; margin-left: auto; min-width: 0; }
.counter {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.3em;
  min-width: 0;
  min-height: 2.2em;
  padding: 0 0.65em 0 0.15em;
  border-radius: 999px;
  border: var(--line-in) solid var(--ink);
  background: var(--fw-surface-3);
  color: var(--fw-text);
  font: inherit;
  font-weight: 900;
  font-variant-numeric: tabular-nums;
}
.counter-value { font-size: calc(var(--fs) * 0.9); white-space: nowrap; }
button.counter { cursor: pointer; }
.coin {
  flex: none;
  display: inline-block;
  width: 1.65em;
  height: 1.65em;
  border-radius: 50%;
  background: var(--fw-gold);
  border: var(--line-in) solid var(--ink);
  box-shadow: inset 0 0 0 0.22em var(--fw-gold), inset 0 0 0 0.36em #d9a22c;
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
  border-radius: 0.75em;
  border: var(--line) solid var(--ink);
  background: var(--fw-surface-3);
  color: var(--ink);
  box-shadow: var(--drop);
  cursor: pointer;
}
.icon-button.gear { border: 0; background: none; box-shadow: none; }
.icon-button.gear .icon { width: 1.9em; height: 1.9em; stroke-width: 2.6; }
.chip-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.4em;
  min-height: 2.4em;
  padding: 0.2em 0.9em;
  border-radius: 0.8em;
  border: var(--line) solid var(--ink);
  background: var(--fw-surface-3);
  color: var(--fw-text);
  font: inherit;
  font-weight: 800;
  box-shadow: var(--drop);
  cursor: pointer;
}

/* \u2500\u2500 Cards \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.card {
  position: relative;
  display: grid;
  gap: 0.75em;
  align-content: start;
  padding: 1em;
  border-radius: 1.1em;
  border: var(--line) solid var(--ink);
  background: var(--fw-surface);
  box-shadow: var(--drop);
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
/* A flat leaf with the same ink outline as everything else. */
.section-title::before {
  content: "";
  flex: none;
  width: 0.9em;
  height: 0.9em;
  border-radius: 0 75% 0 75%;
  border: var(--line-in) solid var(--ink);
  background: var(--fw-leaf);
}
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
  min-height: 2.8em;
  padding: 0.45em 1.2em;
  border-radius: 0.85em;
  border: var(--line) solid var(--ink);
  background: var(--fw-accent);
  color: var(--fw-on-accent);
  font: inherit;
  font-weight: 900;
  box-shadow: var(--drop);
  cursor: pointer;
}
.button:active:not(:disabled) { transform: translateY(0.15em); box-shadow: 0 0.07em 0 var(--ink); }
.button[data-wide] { justify-self: stretch; width: 100%; font-size: calc(var(--fs) * 1.1); }
.button.small { min-height: 2.5em; padding: 0.3em 0.9em; font-size: calc(var(--fs) * 0.95); }
.button.secondary { background: var(--fw-surface-3); color: var(--fw-text); }
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
  border-radius: 0.85em;
  border: var(--line) solid var(--ink);
  background: var(--fw-surface-3);
  color: var(--fw-text);
  font: inherit;
  font-weight: 900;
  box-shadow: var(--drop);
  cursor: pointer;
}

/* \u2500\u2500 Locked (\uC900\uBE44 \uC911) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.lock-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.15em;
  padding: 0.05em 0.45em;
  border-radius: 999px;
  border: 2px solid var(--fw-surface-3);
  background: var(--ink);
  color: #fff4dc;
  font-size: calc(var(--fs) * 0.68);
  font-weight: 900;
  line-height: 1.45;
  white-space: nowrap;
}
.is-locked { position: relative; cursor: pointer; }
.is-locked > .lock-tag { position: absolute; top: -0.55em; right: -0.35em; z-index: 1; }
.is-locked > :not(.lock-tag) { opacity: 0.6; }
.is-locked.button { background: #8fb3ab; }
.locked-block { position: relative; display: grid; gap: 0.75em; border-radius: 0.8em; cursor: pointer; }
/* A block that opens its card puts the tag on the card's top edge, clear of the block's title. */
.card > .locked-block:first-child > .locked-veil { top: -1.8em; }
.locked-block > :not(.locked-veil) { opacity: 0.55; }
/* Sits on the block's top edge so it never covers the block's own title. */
.locked-veil {
  position: absolute;
  top: -0.8em;
  right: 0.3em;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: 0.35em;
  padding: 0.12em 0.65em 0.12em 0.2em;
  border-radius: 999px;
  background: var(--fw-surface-3);
  border: var(--line-in) solid var(--ink);
  color: var(--fw-text);
  font-size: calc(var(--fs) * 0.8);
  font-weight: 900;
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
  padding: 0.4em 0.4em calc(0.4em + env(safe-area-inset-bottom, 0px));
  border-radius: 1.3em 1.3em 0 0;
  border: var(--line) solid var(--ink);
  border-bottom: 0;
  background: var(--fw-surface);
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
.tab + .tab::before { content: ""; position: absolute; left: -1px; top: 18%; bottom: 18%; border-left: var(--line-in) solid #d8bf93; }
.tab-icon { position: relative; display: inline-flex; color: var(--ink); }
.tab-glyph { width: 1.95em; height: 1.95em; stroke-width: 2.4; }
.tab-icon .lock-tag { position: absolute; top: -0.3em; right: -1.2em; }
.tab-label { font-size: calc(var(--fs) * 0.85); font-weight: 900; }
.tab.current .tab-label { padding: 0 0.9em; border-radius: 0.55em; border: var(--line-in) solid var(--ink); background: #5f9a4a; color: #fff; }
.tab.current .tab-icon { color: var(--fw-accent); }
.tab.is-locked .tab-glyph { opacity: 0.5; }

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
  border: var(--line) dashed var(--ink);
  border-radius: 3em 3em 1em 1em;
  background: rgba(255, 248, 232, 0.55);
  color: var(--ink);
  font: inherit;
  cursor: pointer;
}
.spot-shadow { width: 4.5em; height: 0.8em; margin-bottom: 0.35em; border-radius: 50%; background: rgba(75, 46, 26, 0.25); }
.spot-text { margin-bottom: 0.5em; font-weight: 900; font-size: calc(var(--fs) * 0.85); }
.scene-caption {
  position: absolute;
  left: 50%;
  bottom: 2em;
  transform: translateX(-50%);
  display: inline-flex;
  align-items: center;
  gap: 0.3em;
  padding: 0.1em 0.8em;
  border-radius: 999px;
  border: var(--line-in) solid var(--ink);
  background: var(--fw-surface-3);
  color: var(--fw-text);
  font-size: calc(var(--fs) * 0.78);
  font-weight: 800;
  white-space: nowrap;
}
.report-card { z-index: 1; }
.report-title { margin: 0; text-align: center; font-size: calc(var(--fs) * 1.45); font-weight: 900; }
.report-body { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 0.6em; align-items: center; }
.report-items { display: grid; grid-template-columns: 1fr 1fr; gap: 0.4em; padding-right: 0.6em; border-right: var(--line-in) solid #d8bf93; }
.report-slot { display: grid; justify-items: center; gap: 0.1em; padding: 0.5em 0.2em; border-radius: 0.8em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-2); }
.slot-art { width: 2.6em; height: 2.6em; border-radius: 0.6em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); }
.slot-name { font-size: calc(var(--fs) * 0.85); font-weight: 800; }
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
  border-radius: 1em;
  border: var(--line) solid var(--ink);
  background: var(--fw-surface);
  color: var(--fw-text);
  font: inherit;
  font-weight: 800;
  text-align: left;
  box-shadow: var(--drop);
  cursor: pointer;
}
.strip.story { justify-content: flex-start; gap: 0.8em; padding: 0.6em; min-height: 5em; }
.story-art { flex: none; display: inline-flex; align-items: center; justify-content: center; width: 6em; height: 3.8em; border-radius: 0.75em; border: var(--line-in) solid var(--ink); background: #e9c995; color: var(--ink); }
.story-text { flex: 1; display: grid; min-width: 0; }
.story-text strong { font-size: calc(var(--fs) * 1.1); font-weight: 900; }
.story-text span { color: var(--fw-muted); font-size: calc(var(--fs) * 0.85); }
.round-arrow { flex: none; display: inline-flex; align-items: center; justify-content: center; width: 2.6em; height: 2.6em; border-radius: 50%; border: var(--line) solid var(--ink); background: var(--fw-wood-dark); color: #fff4dc; }
.round-arrow .icon { stroke-width: 3; }

/* \u2500\u2500 \uACF5\uBC29 \uC791\uC5C5 (01-2) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.field-tabs { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 0.3em; margin-bottom: -0.95em; padding: 0 0.15em; }
.field-tab {
  display: grid;
  justify-items: center;
  gap: 0.1em;
  min-width: 0;
  min-height: 4.5em;
  padding: 0.45em 0.1em 1em;
  border-radius: 0.9em 0.9em 0 0;
  border: var(--line) solid var(--ink);
  border-bottom: 0;
  background: var(--fw-surface);
  color: var(--fw-text);
  font: inherit;
  font-weight: 900;
  cursor: pointer;
}
.field-glyph { width: 1.8em; height: 1.8em; color: var(--fw-leaf); }
.work-card { gap: 0.85em; }
.segmented { display: grid; grid-template-columns: 1fr 1fr; padding: 0.22em; border-radius: 999px; border: var(--line) solid var(--ink); background: var(--fw-surface-3); }
.segment { display: flex; align-items: center; justify-content: center; min-height: 2.6em; border-radius: 999px; font-size: calc(var(--fs) * 1.1); font-weight: 900; }
.segment.selected { border: var(--line-in) solid var(--ink); background: var(--fw-accent); color: var(--fw-on-accent); }
.facility-entry { display: flex; align-items: center; gap: 0.5em; padding: 0.5em; border-radius: 1em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); }
.facility-entry .outline-button { padding: 0.3em 0.6em; }
.facility-open { flex: 1; min-width: 0; display: flex; align-items: center; gap: 0.7em; padding: 0.2em; border: 0; border-radius: 0.7em; background: none; color: inherit; font: inherit; text-align: left; cursor: pointer; }
.facility-art, .recipe-art { flex: none; display: inline-flex; align-items: center; justify-content: center; width: 3.4em; height: 3.6em; border-radius: 0.7em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-2); color: var(--ink); }
.facility-text, .recipe-text { display: grid; min-width: 0; }
.facility-text strong, .recipe-text strong { font-size: calc(var(--fs) * 1.15); font-weight: 900; }
.facility-text span, .recipe-text span { color: var(--fw-muted); font-size: calc(var(--fs) * 0.85); }
.recipe { display: flex; align-items: center; gap: 0.8em; padding: 0.6em; border-radius: 1em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); }
.recipe-art { width: 5.5em; height: 5em; }
.plan-row, .plan-block { display: grid; gap: 0.5em; padding: 0.6em 0.75em; border-radius: 0.9em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-2); }
.plan-row { grid-template-columns: auto auto minmax(0, 1fr); align-items: center; }
.plan-label { font-weight: 900; }
.plan-label small { color: var(--fw-muted); font-weight: 600; font-size: calc(var(--fs) * 0.75); }
.stepper { display: inline-flex; align-items: center; border-radius: 0.7em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); overflow: hidden; }
.step { display: inline-flex; align-items: center; justify-content: center; width: 2.2em; height: 2.2em; }
.step.plus { background: var(--fw-accent); color: var(--fw-on-accent); border-left: var(--line-in) solid var(--ink); }
.step-value { min-width: 2.2em; text-align: center; font-weight: 900; }
.plan-progress { display: grid; gap: 0.25em; min-width: 0; font-size: calc(var(--fs) * 0.85); }
.plan-progress.wide { grid-column: 2 / -1; }
.bar { display: block; height: 0.85em; border-radius: 999px; border: var(--line-in) solid var(--ink); background: var(--fw-track); }
.usage { display: grid; grid-template-columns: minmax(0, 1.3fr) repeat(3, minmax(0, 1fr)); align-items: center; padding: 0.4em; border-radius: 0.7em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); }
.usage-item { font-weight: 900; padding-left: 0.4em; }
.usage-cell { display: grid; justify-items: center; border-left: var(--line-in) solid #d8bf93; }
.usage-cell small { color: var(--fw-muted); font-size: calc(var(--fs) * 0.75); }
.priority-row { display: flex; align-items: center; gap: 0.6em; padding: 0.45em 0.6em; border-radius: 0.7em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); }
.rank { display: inline-flex; align-items: center; justify-content: center; width: 1.8em; height: 1.8em; border-radius: 0.45em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-2); font-weight: 900; }
.priority-name { flex: 1; font-weight: 900; }
.rule-actions { display: grid; grid-template-columns: minmax(0, 1.8fr) minmax(0, 1fr); gap: 0.6em; }
.rule-actions .button { justify-self: stretch; min-height: 3.1em; }
.button.wide-main { font-size: calc(var(--fs) * 1.15); }

/* \u2500\u2500 \uC2DC\uC124\uACFC \uCC3D\uACE0 (01-3) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.big-tabs { display: grid; grid-template-columns: 1fr 1fr; gap: 0.3em; margin-bottom: -0.95em; }
.big-tab {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5em;
  min-height: 3.7em;
  padding-bottom: 0.7em;
  border-radius: 1.1em 1.1em 0 0;
  border: var(--line) solid var(--ink);
  border-bottom: 0;
  background: var(--fw-surface);
  color: var(--fw-text);
  font: inherit;
  font-size: calc(var(--fs) * 1.25);
  font-weight: 900;
  cursor: pointer;
}
.big-tab.current { background: var(--fw-accent); color: var(--fw-on-accent); }
.facility { display: grid; grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr); gap: 0.8em; align-items: start; }
.facility-picture { display: flex; align-items: center; justify-content: center; aspect-ratio: 1; border-radius: 1em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-2); color: var(--ink); }
.facility-info { display: grid; gap: 0.45em; min-width: 0; }
.facility-name { font-size: calc(var(--fs) * 1.3); font-weight: 900; }
.facility-level { font-size: calc(var(--fs) * 1.3); font-weight: 900; }
.level-next { color: var(--fw-accent); }
.effect-row { display: grid; grid-template-columns: 1fr 1fr; padding: 0.35em 0.6em; border-radius: 0.6em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-2); font-weight: 800; }
.gold-button { display: flex; align-items: center; justify-content: center; gap: 0.4em; min-height: 3em; border-radius: 1em; border: var(--line) solid var(--ink); background: var(--fw-gold); box-shadow: var(--drop); font-size: calc(var(--fs) * 1.1); font-weight: 900; }
.stock { width: 100%; border-collapse: separate; border-spacing: 0 0.35em; table-layout: fixed; }
.stock th, .stock td { padding: 0.5em 0.25em; text-align: center; overflow-wrap: anywhere; }
.stock thead th { padding: 0.4em 0.2em; background: var(--fw-surface-2); color: var(--fw-muted); font-size: calc(var(--fs) * 0.78); font-weight: 800; border-top: var(--line-in) solid var(--ink); border-bottom: var(--line-in) solid var(--ink); }
.stock thead th:first-child { border-left: var(--line-in) solid var(--ink); border-radius: 0.6em 0 0 0.6em; width: 28%; }
.stock thead th:last-child { border-right: var(--line-in) solid var(--ink); border-radius: 0 0.6em 0.6em 0; }
.stock tbody th, .stock tbody td { background: var(--fw-surface-3); border-top: var(--line-in) solid var(--ink); border-bottom: var(--line-in) solid var(--ink); }
.stock tbody th { display: table-cell; text-align: left; font-weight: 900; border-left: var(--line-in) solid var(--ink); border-radius: 0.7em 0 0 0.7em; }
.stock tbody td:last-child { border-right: var(--line-in) solid var(--ink); border-radius: 0 0.7em 0.7em 0; }
.num { font-variant-numeric: tabular-nums; font-weight: 900; font-size: calc(var(--fs) * 1.05); }
.num.protected { color: var(--fw-fail); }
.num.reserved { color: var(--fw-blue); }
.num.available { color: var(--fw-pass); }
.item-dot { display: inline-block; width: 1.1em; height: 1.1em; margin-right: 0.35em; vertical-align: -0.15em; border-radius: 50%; border: 2px solid var(--ink); background: var(--fw-wood); }
.item-dot.big { width: 2.2em; height: 2.2em; margin: 0; border-width: var(--line-in); }
.storage-grid { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(6.5em, 1fr)); gap: 0.55em; }
.storage-item { display: grid; justify-items: center; gap: 0.2em; padding: 0.7em 0.3em; border-radius: 0.9em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); text-align: center; }
.storage-name { font-weight: 800; overflow-wrap: anywhere; }
.storage-item strong { font-size: calc(var(--fs) * 1.2); font-variant-numeric: tabular-nums; }
.toggle-row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.7em;
  width: 100%;
  min-height: 3.6em;
  padding: 0.55em 0.75em;
  border-radius: 0.9em;
  border: var(--line-in) solid var(--ink);
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
.switch { flex: none; position: relative; display: inline-flex; align-items: center; justify-content: flex-end; width: 3.5em; height: 2em; padding: 0 0.5em; border-radius: 999px; border: var(--line-in) solid var(--ink); background: #9b8f80; }
.switch.on { background: var(--fw-leaf); justify-content: flex-start; }
.switch .knob { position: absolute; top: 0.12em; left: 0.12em; width: 1.45em; height: 1.45em; border-radius: 50%; border: var(--line-in) solid var(--ink); background: #fff; }
.switch.on .knob { left: auto; right: 0.12em; }
.switch:has(.switch-label) { width: 4.9em; }
.switch-label { color: #fff; font-size: calc(var(--fs) * 0.75); font-weight: 900; }

/* \u2500\u2500 \uC124\uC815 (04-1) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
/* Flex with wrap: at large text sizes or on narrow phones the field drops to its own line instead of shrinking. */
.setting-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5em;
  padding: 0.55em 0.65em;
  border-radius: 0.9em;
  border: var(--line-in) solid var(--ink);
  background: var(--fw-surface-3);
}
.row-leaf { color: var(--fw-leaf); }
.setting-label { font-weight: 900; white-space: nowrap; }
.input {
  width: 100%;
  min-width: 0;
  min-height: 2.6em;
  padding: 0.35em 0.7em;
  border: var(--line-in) solid var(--ink);
  border-radius: 0.7em;
  background: #fffdf6;
  color: var(--fw-text);
  font: inherit;
}
.input.readonly { display: inline-flex; align-items: center; gap: 0.4em; color: var(--fw-muted); overflow: hidden; white-space: nowrap; }
.setting-block { display: grid; gap: 0.5em; padding: 0.55em 0.65em 0.75em; border-radius: 0.9em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); }
.setting-block .setting-row { padding: 0; border: 0; background: none; }
/* The field and its button wrap together. */
.setting-field { flex: 1 1 12em; min-width: 0; display: flex; align-items: center; gap: 0.5em; }
.setting-field > .input { flex: 1 1 auto; }
.setting-field > .button { flex: none; white-space: nowrap; }
.setting-row > .slider { flex: 1 1 6em; width: auto; }
.setting-row > .button, .setting-row > .icon, .setting-label, .slider-value { flex: none; }
/* Range: a flat track with an ink outline and a round ink-outlined thumb. */
.slider { -webkit-appearance: none; appearance: none; width: 100%; min-width: 0; height: 2.6em; background: none; cursor: pointer; }
.slider::-webkit-slider-runnable-track { height: 0.85em; border-radius: 999px; border: var(--line-in) solid var(--ink); background: var(--fw-leaf); }
.slider::-moz-range-track { height: 0.85em; border-radius: 999px; border: var(--line-in) solid var(--ink); background: var(--fw-track); }
.slider::-moz-range-progress { height: 0.85em; border-radius: 999px; background: var(--fw-leaf); }
.slider::-webkit-slider-thumb { -webkit-appearance: none; width: 1.5em; height: 1.5em; margin-top: -0.5em; border-radius: 50%; border: var(--line) solid var(--ink); background: var(--fw-surface-3); }
.slider::-moz-range-thumb { width: 1.2em; height: 1.2em; border-radius: 50%; border: var(--line) solid var(--ink); background: var(--fw-surface-3); }
.slider-value { min-width: 3em; text-align: right; font-weight: 800; font-variant-numeric: tabular-nums; }
.font-preview { margin: 0 0.5em; padding: 0.6em; border-radius: 0.7em; border: var(--line-in) dashed var(--ink); background: var(--fw-surface-2); text-align: center; font-size: var(--fs); }
.manage-row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.75em;
  width: 100%;
  min-height: 3.1em;
  padding: 0.4em 0.75em;
  border: var(--line-in) solid var(--ink);
  border-radius: 0.85em;
  background: var(--fw-surface-3);
  color: var(--fw-text);
  font: inherit;
  text-align: left;
  cursor: pointer;
}
.manage-icon { flex: none; display: inline-flex; color: var(--fw-wood-dark); }
.manage-title { flex: 1; font-weight: 900; }
.menu-chevron { flex: none; display: inline-flex; color: var(--ink); }
.menu-chevron .icon { stroke-width: 3; }
.note-box { display: flex; align-items: center; gap: 0.75em; padding: 0.65em 0.9em; border-radius: 0.9em; border: var(--line-in) solid var(--ink); background: var(--fw-leaf-soft); color: #33502a; }
.note-box .icon { width: 1.8em; height: 1.8em; }
.note-box > span { display: grid; }
.note-box strong { font-weight: 900; }
.note-box span span { font-size: calc(var(--fs) * 0.85); }
.footnote { justify-self: center; max-width: 100%; padding: 0.3em 1.1em; border-radius: 999px; border: var(--line-in) solid var(--ink); background: var(--fw-surface); color: var(--fw-text); font-size: calc(var(--fs) * 0.85); font-weight: 700; text-align: center; }

/* \u2500\u2500 \uC800\uC7A5\xB7\uBC31\uC5C5 (05-2) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.card.saved { justify-items: center; gap: 0.3em; padding: 1.2em 1em; }
.saved-title { display: flex; align-items: center; gap: 0.5em; font-size: calc(var(--fs) * 1.7); font-weight: 900; }
.check { display: inline-flex; width: 1.75em; height: 1.75em; align-items: center; justify-content: center; border-radius: 50%; border: var(--line) solid var(--ink); background: var(--fw-pass); color: #fff; }
.check .icon { width: 1.1em; height: 1.1em; stroke-width: 3.4; }
.saved-time { color: var(--fw-muted); font-size: calc(var(--fs) * 1.05); }
.usage-rows { display: grid; padding: 0.3em 0.75em; border-radius: 0.9em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); }
.usage-row { display: grid; grid-template-columns: auto 4.6em minmax(0, 1fr) 4.6em; align-items: center; gap: 0.6em; padding: 0.55em 0; }
.usage-row + .usage-row { border-top: var(--line-in) solid #e3cfa6; }
.usage-row .icon { color: var(--ink); }
.usage-label { font-weight: 800; }
.usage-bar { display: block; height: 1em; border-radius: 999px; border: var(--line-in) solid var(--ink); background: var(--fw-track); overflow: hidden; }
.usage-fill { display: block; height: 100%; border-right: var(--line-in) solid var(--ink); border-radius: 999px; background: #3a9a80; }
.usage-size { text-align: right; font-weight: 800; font-variant-numeric: tabular-nums; }
.menu { gap: 0.6em; }
.menu-row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.8em;
  width: 100%;
  min-height: 3.8em;
  padding: 0.6em 0.75em;
  border-radius: 0.95em;
  border: var(--line-in) solid var(--ink);
  background: var(--fw-surface-3);
  color: var(--fw-text);
  font: inherit;
  text-align: left;
  cursor: pointer;
}
.menu-row:disabled { opacity: 0.55; cursor: not-allowed; }
.menu-icon { flex: none; display: inline-flex; align-items: center; justify-content: center; width: 2.9em; height: 2.9em; border-radius: 0.75em; border: var(--line-in) solid var(--ink); background: var(--fw-accent); color: var(--fw-on-accent); box-shadow: 0 0.15em 0 var(--ink); }
.menu-icon.light, .menu-icon.quiet { background: var(--fw-surface-2); color: var(--ink); }
.menu-text { display: grid; flex: 1; min-width: 0; }
.menu-title { font-size: calc(var(--fs) * 1.1); font-weight: 900; overflow-wrap: anywhere; }
.menu-row.quiet .menu-title { font-size: var(--fs); }
.menu-detail { color: var(--fw-muted); font-size: calc(var(--fs) * 0.85); overflow-wrap: anywhere; }
.menu-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.5em; }
label.menu-row:focus-within { outline: 3px solid var(--fw-accent); outline-offset: 2px; }
.restore { display: grid; gap: 0.6em; }
.preview-box { display: grid; gap: 0.45em; padding: 0.75em; border-radius: 0.9em; border: var(--line-in) dashed var(--ink); background: var(--fw-surface); }
.preview-head { display: flex; align-items: center; gap: 0.45em; font-size: calc(var(--fs) * 1.05); }
.preview-head .icon { color: var(--fw-accent); }
.preview-rows { display: grid; padding: 0.2em 0.75em; border-radius: 0.75em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); }
.preview-row { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: 0.75em; padding: 0.4em 0; }
.preview-row + .preview-row { border-top: var(--line-in) solid #e3cfa6; }
.preview-row .icon { color: var(--fw-wood-dark); }
.preview-row strong { font-variant-numeric: tabular-nums; }

/* \u2500\u2500 \uC138\uACC4 \uACE0\uB974\uAE30 \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.form { gap: 0.55em; }
.form .button { margin-top: 0.4em; }
.field-label { font-weight: 900; }

/* \u2500\u2500 Sheets (\uC2DC\uC791 \uAFB8\uB7EC\uBBF8 and the resident sheets) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.sheet-backdrop { position: absolute; inset: 0; z-index: 10; display: flex; align-items: flex-end; justify-content: center; padding: 0.75em; background: rgba(48, 29, 16, 0.5); }
.sheet { width: min(100%, 480px); max-height: 100%; overflow-y: auto; gap: 0.75em; padding: 1.25em; }
.kit { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.45em; }
.kit-item { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: 0.6em; padding: 0.55em 0.8em; border-radius: 0.8em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-2); font-weight: 800; }
.kit-item .icon { color: var(--fw-leaf); }
.kit-item strong { font-variant-numeric: tabular-nums; }

/* \u2500\u2500 \uC5F0\uACB0 \uC810\uAC80 \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.diagnostics { display: grid; gap: 0.85em; min-width: 0; }
.list { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.5em; }
.row { display: flex; justify-content: space-between; align-items: center; gap: 0.75em; min-width: 0; }
.row.stacked { display: grid; gap: 0.25em; padding-bottom: 0.5em; border-bottom: var(--line-in) solid #e3cfa6; }
.row.stacked:last-child { border-bottom: 0; padding-bottom: 0; }
.row-head { display: flex; justify-content: space-between; align-items: center; gap: 0.75em; }
.name { min-width: 0; overflow-wrap: anywhere; }
.detail { color: var(--fw-muted); font-size: calc(var(--fs) * 0.85); overflow-wrap: anywhere; }
.badge { flex: none; font-size: calc(var(--fs) * 0.8); font-weight: 900; padding: 0.1em 0.6em; border-radius: 999px; border: var(--line-in) solid currentColor; background: var(--fw-surface-3); }
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
  border-radius: 0.8em;
  border: var(--line-in) solid var(--ink);
  background-color: #f4efe3;
  background-image: linear-gradient(45deg, #e2dccd 25%, transparent 25%, transparent 75%, #e2dccd 75%),
    linear-gradient(45deg, #e2dccd 25%, transparent 25%, transparent 75%, #e2dccd 75%);
  background-size: 16px 16px;
  background-position: 0 0, 8px 8px;
}
.preview { max-width: 100%; max-height: 22em; width: auto; height: auto; object-fit: contain; }
.facts { margin: 0; display: grid; grid-template-columns: max-content minmax(0, 1fr); gap: 0.25em 0.75em; font-size: calc(var(--fs) * 0.9); }
.facts dt { color: var(--fw-muted); }
.facts dd { margin: 0; overflow-wrap: anywhere; font-weight: 800; }

/* \u2500\u2500 Narrow phones \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
@media (max-width: 380px) {
  :host { --line: 2.5px; --line-in: 2px; }
  .top { padding-left: 0.5em; padding-right: 0.5em; }
  .sign-home { font-size: calc(var(--fs) * 1.3); }
  .top-sub.with-resources .sign { font-size: var(--fs); padding: 0.3em 0.5em; }
  .coin { width: 1.35em; height: 1.35em; }
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
  outline-offset: 3px;
}
@media (prefers-reduced-motion: reduce) { * { scroll-behavior: auto; } .button:active:not(:disabled) { transform: none; } }
`;var Lt=`
/* Item tiles: the item's icon in a framed square until the illustrated item art (P5). */
.item-tile { flex: none; display: inline-grid; place-items: center; width: 1.9em; height: 1.9em; margin-right: 0.35em; vertical-align: middle; border-radius: 0.5em; border: 2px solid var(--ink); background: var(--fw-surface-3); color: var(--ink); }
.item-tile .icon { width: 1.25em; height: 1.25em; }
.item-tile.big { width: 3.2em; height: 3.2em; margin: 0; border-width: var(--line-in); border-radius: 0.75em; }
.item-tile.big .icon { width: 2em; height: 2em; }
.item-wild-berry { background: #fbd9d4; color: #a3262a; }
.item-herb { background: #dcebc4; color: #3f7a2d; }
.item-wood { background: #f1d6b2; color: #8a5a33; }
.item-berry-jam { background: #f9c6cf; color: #a3262a; }

/* \uACF5\uBC29 \uC791\uC5C5 */
.field-tab.current { background: var(--fw-accent); color: var(--fw-on-accent); }
.field-tab.current .field-glyph { color: var(--fw-on-accent); }
.segmented > .segment { border: 0; background: none; color: var(--fw-text); font: inherit; font-weight: 900; cursor: pointer; }
.segmented > .segment.selected { border: var(--line-in) solid var(--ink); background: var(--fw-accent); color: var(--fw-on-accent); }
.recipe-flow { margin-top: 0.15em; color: var(--fw-text); font-weight: 800; font-size: calc(var(--fs) * 0.8); }
.bar { position: relative; overflow: hidden; }
.bar-fill { position: absolute; inset: 0 auto 0 0; display: block; width: 0; border-right: var(--line-in) solid var(--ink); background: var(--fw-accent); }
.bar-fill.red { background: #d9534f; }
.bar-fill[style*="width: 0%"] { border-right: 0; }
.usage-list { display: grid; gap: 0.4em; }
.usage-item { display: inline-flex; align-items: center; min-width: 0; }
.usage-cell.available strong { color: var(--fw-pass); }
.priority-row { flex-wrap: wrap; }
.priority-row.selected { background: #eef6e2; box-shadow: inset 0 0 0 var(--line-in) #4f8f6e; }
.priority-row.off .priority-main { opacity: 0.55; }
.priority-main { flex: 1 1 8em; min-width: 0; display: flex; align-items: center; gap: 0.3em; padding: 0; border: 0; background: none; color: inherit; font: inherit; font-weight: 900; text-align: left; cursor: pointer; }
.priority-main .muted { margin-left: auto; white-space: nowrap; }
.chip-toggle { flex: none; min-height: 2.2em; padding: 0 0.7em; border-radius: 999px; border: var(--line-in) solid var(--ink); background: #b9ad9c; color: #fff; font: inherit; font-size: calc(var(--fs) * 0.8); font-weight: 900; cursor: pointer; }
.chip-toggle.on { background: var(--fw-leaf); }
.order-buttons { flex: none; display: inline-flex; gap: 0.25em; }
.mini { display: inline-grid; place-items: center; width: 2.2em; height: 2.2em; border-radius: 0.55em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); color: var(--ink); cursor: pointer; }
.mini:disabled { opacity: 0.35; cursor: default; }
.mini .icon { stroke-width: 3; }
.add-rules { display: flex; flex-wrap: wrap; gap: 0.4em; }
.outline-button.small { min-height: 2.3em; padding: 0.2em 0.7em; font-size: calc(var(--fs) * 0.85); box-shadow: 0 0.15em 0 var(--ink); }
.plan-row.current-work { grid-template-columns: auto auto minmax(0, 1fr) auto; }
.countdown { font-weight: 900; font-size: calc(var(--fs) * 1.2); font-variant-numeric: tabular-nums; }
.draft-note { display: flex; justify-content: center; align-items: center; gap: 0.3em; padding: 0.35em 0.8em; border-radius: 999px; border: var(--line-in) dashed var(--ink); background: #fff3c8; font-weight: 800; font-size: calc(var(--fs) * 0.85); }
.link-button { border: 0; background: none; padding: 0.2em; color: var(--fw-accent); font: inherit; font-weight: 900; text-decoration: underline; text-decoration-thickness: 2px; cursor: pointer; }

/* \uC2DC\uC124\uACFC \uCC3D\uACE0 */
.chip-row { display: flex; gap: 0.4em; flex-wrap: wrap; }
.chip-row .pill-tab { padding: 0 1em; }
.gold-button { width: 100%; color: var(--fw-text); font: inherit; font-weight: 900; cursor: pointer; }
.gold-button:disabled { opacity: 0.55; cursor: not-allowed; }
.gold-button .coin { width: 1.4em; height: 1.4em; }
.stock tbody th .item-tile { width: 1.7em; height: 1.7em; }
.storage-item .outline-button { margin-top: 0.2em; }
.stepper.wide { display: flex; justify-content: space-between; width: 100%; }
.stepper.wide .step { width: auto; flex: 1; min-height: 2.6em; border: 0; border-right: var(--line-in) solid var(--ink); background: var(--fw-surface-3); color: var(--fw-text); font: inherit; font-weight: 900; cursor: pointer; }
.stepper.wide .step:last-child { border-right: 0; border-left: var(--line-in) solid var(--ink); }
.stepper.wide .step:nth-child(4) { border-right: 0; border-left: var(--line-in) solid var(--ink); }
.step-value.big { flex: 1.4; display: grid; place-items: center; font-size: calc(var(--fs) * 1.25); }
.protect-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.55em; }
.protect-row { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; grid-template-areas: "tile name save" "picker picker picker"; align-items: center; gap: 0.45em 0.5em; padding: 0.55em; border-radius: 0.9em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); }
.protect-row > .item-tile { grid-area: tile; }
.protect-name { grid-area: name; display: grid; min-width: 0; }
.protect-row > .stepper { grid-area: picker; }
.protect-row > .button { grid-area: save; }

/* \uACF5\uBC29 \uC18C\uC2DD \xB7 \uC791\uC5C5 \uBCF4\uACE0 */
.report-slot.empty { opacity: 0.6; }
.report-slot .item-tile { margin-bottom: 0.1em; }
.count-badge { display: inline-grid; place-items: center; min-width: 1.5em; height: 1.5em; padding: 0 0.3em; border-radius: 999px; border: 2px solid var(--ink); background: #d9534f; color: #fff; font-size: calc(var(--fs) * 0.75); font-weight: 900; }
.strip.offline strong { margin: 0 0.15em; }
.report-total { display: grid; gap: 0.3em; padding: 0.7em 0.8em; border-radius: 0.9em; border: var(--line-in) solid var(--ink); background: var(--fw-leaf-soft); }
.report-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.4em; max-height: 16em; overflow-y: auto; }
.report-entry { display: grid; gap: 0.1em; padding: 0.5em 0.7em; border-radius: 0.75em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); font-size: calc(var(--fs) * 0.9); }
.report-entry.new { background: #fff3c8; }
.report-time { color: var(--fw-muted); font-size: calc(var(--fs) * 0.78); font-weight: 800; }

@media (max-width: 380px) {
  .plan-row.current-work { grid-template-columns: auto minmax(0, 1fr) auto; }
  .plan-row.current-work .plan-label { grid-column: 1 / -1; }
}
`;var Pt=`
/* \u2500\u2500 Shared: ribbon, figure, avatar, tags \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.ribbon {
  justify-self: center;
  max-width: 100%;
  margin: -0.1em 0 0;
  padding: 0.2em 1.1em;
  border-radius: 0.5em;
  border: var(--line-in) solid var(--ink);
  background: var(--fw-surface);
  color: var(--fw-text);
  font-size: calc(var(--fs) * 0.9);
  font-weight: 700;
  text-align: center;
}
.figure { position: relative; display: block; width: 100%; height: 100%; overflow: hidden; }
.figure-body { position: absolute; bottom: 4%; transform: translateX(-50%); display: flex; align-items: flex-end; justify-content: center; width: 100%; }
.figure-image { display: block; max-width: 100%; max-height: 100%; width: auto; height: 100%; object-fit: contain; object-position: 50% 100%; }
.figure-marker { position: absolute; transform: translate(-50%, 0); display: inline-flex; padding: 0.15em; border-radius: 50%; background: var(--fw-surface-3); color: var(--fw-leaf); border: var(--line-in) solid var(--ink); }
.figure-empty { position: absolute; inset: 0; display: grid; place-items: center; align-content: center; gap: 0.2em; color: #c9ad84; }
.figure-silhouette { width: 45%; max-width: 5em; fill: currentColor; stroke: var(--ink); stroke-width: 3; stroke-linejoin: round; }
.figure-empty-text { padding: 0.05em 0.6em; border-radius: 999px; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); color: var(--fw-muted); font-size: calc(var(--fs) * 0.75); font-weight: 800; }
.checker {
  background-color: #f4efe3;
  background-image: linear-gradient(45deg, #e2dccd 25%, transparent 25%, transparent 75%, #e2dccd 75%),
    linear-gradient(45deg, #e2dccd 25%, transparent 25%, transparent 75%, #e2dccd 75%);
  background-size: 16px 16px;
  background-position: 0 0, 8px 8px;
}
.avatar { position: relative; flex: none; display: inline-grid; place-items: center; width: 3.4em; height: 3.4em; border-radius: 50%; overflow: hidden; border: var(--line-in) solid var(--ink); background: var(--fw-surface-2); color: #c9ad84; }
.avatar.large { width: 6.5em; height: 6.5em; border-width: 3px; }
.avatar-image { width: 100%; height: 100%; object-fit: cover; object-position: 50% 12%; }
.avatar-silhouette { width: 70%; fill: currentColor; stroke: var(--ink); stroke-width: 3; margin-top: 20%; }
.avatar-unknown { position: absolute; inset: 0; display: grid; place-items: center; color: #fff; font-size: calc(var(--fs) * 1.3); font-weight: 900; }
.tag-row { display: flex; flex-wrap: wrap; justify-content: center; gap: 0.3em; }
.tag { position: relative; display: inline-flex; align-items: center; gap: 0.2em; padding: 0.1em 0.65em; border-radius: 999px; border: 2px solid var(--ink); font: inherit; font-size: calc(var(--fs) * 0.78); font-weight: 900; }
.tag.character { background: #d6e7fb; color: #285a93; }
.tag.persona { background: #e9dcfa; color: #6a3f9c; }
.tag.field { background: var(--fw-leaf-soft); color: #3f5b33; cursor: pointer; }
/* On a small tag the lock sits inside, after the word, instead of covering it. */
.tag.is-locked > .lock-tag { position: static; margin-left: 0.15em; border: 0; }
.button.pressed { background: var(--fw-surface-2); box-shadow: none; transform: translateY(0.15em); }
.textarea { width: 100%; min-height: 6em; padding: 0.6em 0.75em; border: var(--line-in) solid var(--ink); border-radius: 0.7em; background: #fffdf6; color: var(--fw-text); font: inherit; line-height: 1.55; resize: vertical; }
.textarea-wrap { position: relative; display: grid; }
.textarea-wrap .textarea { padding-bottom: 1.8em; }
.textarea-wrap .counter-text { position: absolute; right: 0.75em; bottom: 0.45em; }
.counter-text { justify-self: end; color: var(--fw-muted); font-size: calc(var(--fs) * 0.8); font-variant-numeric: tabular-nums; }
.subhead { margin: 0.3em 0 0; font-size: calc(var(--fs) * 1.05); font-weight: 900; }
.empty-state { display: grid; justify-items: center; gap: 0.3em; padding: 1.2em 0.5em; text-align: center; }
.rule-actions.even { grid-template-columns: 1fr 1fr; }
.rule-actions.even .button { justify-self: stretch; }

/* \u2500\u2500 \uC8FC\uBBFC (03-1) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.search-bar { display: flex; align-items: center; gap: 0.5em; padding: 0.45em; border-radius: 0.9em; border: var(--line-in) solid var(--ink); background: var(--fw-surface); flex-wrap: wrap; }
.search-field { flex: 1 1 10em; display: flex; align-items: center; gap: 0.45em; min-width: 0; padding: 0 0.7em; border-radius: 0.7em; background: var(--fw-surface-2); color: var(--fw-wood-dark); }
.search-input { flex: 1; min-width: 0; min-height: 2.6em; border: 0; background: none; color: var(--fw-text); font: inherit; outline: none; }
.icon-button.filter.active { background: var(--fw-accent); color: var(--fw-on-accent); }
.filter-chip { padding: 0.1em 0.7em; border-radius: 999px; background: var(--fw-leaf-soft); color: #3f5b33; font-size: calc(var(--fs) * 0.8); font-weight: 800; }
.pill-tabs { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.4em; }
.pill-tabs.two { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.pill-tab { min-height: 2.6em; border-radius: 0.7em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-2); color: var(--fw-text); font: inherit; font-weight: 800; cursor: pointer; }
.pill-tab.current { background: #4f8f6e; color: #fff; box-shadow: 0 0.15em 0 var(--ink); }
.resident-grid { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.6em; }
.resident-card { display: grid; justify-items: center; gap: 0.4em; padding: 0.5em 0.5em 0.65em; border-radius: 0.9em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); min-width: 0; }
.resident-card.selected { background: #eef6e2; box-shadow: 0 0 0 var(--line-in) #4f8f6e, var(--drop); }
.resident-card-main { display: grid; justify-items: center; gap: 0.35em; width: 100%; padding: 0; border: 0; background: none; color: inherit; font: inherit; cursor: pointer; }
.card-stage { display: block; width: 100%; aspect-ratio: 4 / 5; border-radius: 0.75em; border: var(--line-in) solid var(--ink); background: #f6ead0; overflow: hidden; }
.resident-name { font-size: calc(var(--fs) * 1.02); font-weight: 900; text-align: center; overflow-wrap: anywhere; }
.status-pill { position: relative; display: inline-flex; justify-content: center; align-items: center; width: 100%; min-height: 2.3em; padding: 0.2em 0.5em; border-radius: 0.75em; border: var(--line-in) solid var(--ink); font: inherit; font-weight: 900; }
.status-pill.done { background: #3f7c5e; color: #fff; }
.status-pill.waiting { background: var(--fw-surface-2); color: var(--fw-muted); border: var(--line-in) dashed var(--ink); cursor: pointer; }
.detail-card { gap: 0.8em; }
.resident-detail { display: grid; grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr); gap: 0.75em; align-items: center; }
.detail-stage { display: block; aspect-ratio: 1; border-radius: 0.85em; border: var(--line-in) solid var(--ink); overflow: hidden; background: #f6ead0; }
.detail-info { display: grid; gap: 0.4em; min-width: 0; justify-items: start; }
.detail-info .tag-row { justify-content: flex-start; }
.detail-name { font-size: calc(var(--fs) * 1.2); font-weight: 900; overflow-wrap: anywhere; }
.detail-locked { width: 100%; gap: 0.2em; padding: 0.5em; background: var(--fw-surface-2); }
.passive, .breakthrough { display: flex; align-items: center; gap: 0.35em; flex-wrap: wrap; }
.leaf-pips { display: inline-flex; gap: 0.2em; }
.pip { width: 0.85em; height: 1em; border-radius: 0 75% 0 75%; border: 2px solid var(--ink); background: var(--fw-surface-2); }
.detail-actions { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.4em; }
.detail-action { display: flex; align-items: center; justify-content: center; gap: 0.35em; min-height: 3em; padding: 0.3em; border-radius: 0.8em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); color: var(--fw-text); font: inherit; font-weight: 800; cursor: pointer; }
.detail-action .icon { color: var(--fw-wood-dark); }

/* Home scene: residents standing in their places. */
.resident-spot.filled { width: 8.5em; height: 11em; border: 0; border-radius: 0; background: none; }
.resident-spot.filled .figure { position: absolute; inset: 0; }
.spot-name { position: absolute; left: 50%; bottom: -0.4em; transform: translateX(-50%); padding: 0.05em 0.6em; border-radius: 999px; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); font-size: calc(var(--fs) * 0.78); font-weight: 800; white-space: nowrap; max-width: 100%; overflow: hidden; text-overflow: ellipsis; }
.resident-spot.invite { border-style: solid; background: var(--fw-surface-3); color: var(--fw-accent); box-shadow: var(--drop); }
.resident-spot.invite .spot-text { margin: 0 0.4em 0.6em; text-align: center; }

/* \u2500\u2500 \uD504\uB85C\uD544 sheet \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.sheet-head { display: flex; align-items: center; justify-content: space-between; gap: 0.5em; }
.compare { display: grid; gap: 0.6em; }
.compare-box { display: grid; gap: 0.4em; padding: 0.7em; border-radius: 0.8em; border: var(--line-in) solid var(--ink); }
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
.hero-label { margin-top: -0.9em; padding: 0.1em 0.9em; border-radius: 0.5em; border: var(--line-in) solid var(--ink); background: var(--fw-surface); font-weight: 800; z-index: 1; }
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
.relation-now { display: grid; padding: 0.4em 0.7em; border-radius: 0.6em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); }
.relation-now small { color: var(--fw-muted); font-size: calc(var(--fs) * 0.75); }
.relation-now strong { font-size: calc(var(--fs) * 1.1); font-weight: 900; }
.recent { display: flex; align-items: center; gap: 0.5em; flex-wrap: wrap; font-size: calc(var(--fs) * 0.9); }
.recent-label { padding: 0.05em 0.6em; border-radius: 0.5em; background: var(--fw-surface-2); color: var(--fw-muted); font-size: calc(var(--fs) * 0.8); }
.pair-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 0.35em; }
.pair-actions .outline-button { justify-content: center; min-height: 2.5em; padding: 0.2em 0.3em; gap: 0.2em; font-size: calc(var(--fs) * 0.82); white-space: nowrap; }
.pair-actions .outline-button .icon { display: none; }
.pair-actions .button { grid-column: 1 / -1; justify-self: stretch; }
.notice-strip { display: flex; align-items: center; justify-content: center; gap: 0.5em; padding: 0.5em 1em; border-radius: 0.9em; border: var(--line-in) solid var(--ink); background: var(--fw-surface); font-weight: 700; text-align: center; }
.bang { display: inline-grid; place-items: center; width: 1.6em; height: 1.6em; border-radius: 50%; background: var(--fw-wood-dark); color: #fff; font-weight: 900; }
.archived-list, .candidate-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.4em; }
.archived-row { display: flex; align-items: center; gap: 0.6em; padding: 0.4em; border-radius: 0.7em; background: var(--fw-surface-3); }
.archived-name { flex: 1; min-width: 0; font-weight: 800; overflow-wrap: anywhere; }
.candidate { display: flex; align-items: center; gap: 0.6em; width: 100%; padding: 0.45em 0.6em; border-radius: 0.8em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); color: var(--fw-text); font: inherit; text-align: left; cursor: pointer; }
.candidate:disabled { opacity: 0.6; cursor: not-allowed; }
.candidate-name { flex: 1; min-width: 0; font-weight: 800; overflow-wrap: anywhere; }
.candidate-state { color: var(--fw-accent); font-weight: 800; font-size: calc(var(--fs) * 0.85); }

/* \u2500\u2500 \uC8FC\uBBFC \uB4F1\uB85D (05-3) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.steps { list-style: none; margin: 0; display: flex; align-items: center; justify-content: space-between; gap: 0.3em; padding: 0.7em 0.8em; }
.step-item { display: flex; align-items: center; gap: 0.35em; min-width: 0; }
.step-number { flex: none; display: inline-grid; place-items: center; width: 2em; height: 2em; border-radius: 50%; border: var(--line-in) solid var(--ink); color: var(--fw-wood-dark); font-weight: 900; }
.step-item.current .step-number { background: var(--fw-accent); color: #fff; }
.step-item.done .step-number { background: var(--fw-leaf-soft); border-color: var(--fw-leaf); color: #3f5b33; }
.step-label { font-weight: 900; font-size: calc(var(--fs) * 0.92); white-space: nowrap; }
.step-arrow { color: var(--fw-muted); font-weight: 800; }
.source-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.45em; }
.source-row:disabled { opacity: 0.65; cursor: default; }
.selected-source { padding: 0.5em; }
.selected-source .menu-row { border: 0; background: none; }
.rebuild { gap: 0.65em; }
.readonly-box { padding: 0.6em 0.8em; border-radius: 0.7em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); white-space: pre-wrap; }
.image-drop { display: grid; gap: 0.5em; }
.drop-zone { display: flex; align-items: center; justify-content: center; gap: 0.8em; min-height: 6.5em; padding: 0.8em; border-radius: 0.8em; border: var(--line-in) dashed var(--ink); cursor: pointer; }
.drop-zone:focus-within { outline: 3px solid var(--fw-accent); outline-offset: 2px; }
.drop-icon { width: 3em; height: 3em; color: var(--fw-wood-dark); }
.drop-preview { max-height: 6em; max-width: 40%; object-fit: contain; }
.drop-text { display: grid; gap: 0.1em; min-width: 0; }
.drop-text strong { font-size: calc(var(--fs) * 1.1); font-weight: 900; overflow-wrap: anywhere; }
.drop-text span { color: var(--fw-muted); }
.starter-list { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.6em; }
.starter-option { display: grid; justify-items: center; gap: 0.3em; width: 100%; padding: 0.5em; border-radius: 0.9em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); color: var(--fw-text); font: inherit; cursor: pointer; }
.starter-option.chosen { border-color: var(--fw-accent); box-shadow: var(--drop); }
.starter-stage { display: block; width: 100%; aspect-ratio: 4 / 5; border-radius: 0.75em; border: var(--line-in) solid var(--ink); background: #f6ead0; overflow: hidden; }

/* \u2500\u2500 \uC8FC\uBBFC \uADF8\uB9BC (04-2) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.image-card { gap: 0.7em; }
.target-ribbon { justify-self: center; display: inline-flex; align-items: center; gap: 0.5em; margin-top: -0.2em; padding: 0.3em 1.2em; border-radius: 0.6em; border: var(--line-in) solid var(--ink); background: var(--fw-surface); }
.target-ribbon .icon { color: var(--fw-leaf); }
.target-ribbon strong { font-size: calc(var(--fs) * 1.1); font-weight: 900; }
.image-stage { display: block; aspect-ratio: 4 / 3.4; border-radius: 0.8em; border: var(--line-in) solid var(--ink); overflow: hidden; }
.file-facts { display: grid; justify-items: center; gap: 0.1em; padding: 0.5em; border-radius: 0.7em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); text-align: center; }
.file-facts strong { overflow-wrap: anywhere; }
.file-button { cursor: pointer; }
.file-button.busy { opacity: 0.6; cursor: progress; }
.rules { margin: 0; padding: 0.6em 0.8em 0.6em 2em; border-radius: 0.7em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); display: grid; gap: 0.15em; font-size: calc(var(--fs) * 0.9); }
.sliders { gap: 0.2em; }
.sliders .setting-row + .setting-row { border-top: var(--line-in) solid var(--ink); padding-top: 0.4em; }
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
`;var jt="marinara-capability-forest-workshop",Ce=class extends HTMLElement{constructor(){super();$(this,"root");$(this,"controller",null);$(this,"diagnostics",null);$(this,"unsubscribe",null);$(this,"styleNode",document.createElement("style"));$(this,"renderedRoute",null);$(this,"ticker");$(this,"refreshedEnds",new Set);$(this,"onPresence",()=>{this.controller?.heartbeat()});$(this,"presentWorld",null);this.root=this.attachShadow({mode:"open"}),this.styleNode.textContent=Tt+Lt+Pt}connectedCallback(){this.controller||(this.controller=Ke(),this.diagnostics=new ie,this.controller.start()),this.unsubscribe?.(),this.unsubscribe=this.controller.store.subscribe(a=>this.render(a)),this.render(this.controller.store.get()),this.controller.startHeartbeat(),document.addEventListener("visibilitychange",this.onPresence),window.addEventListener("focus",this.onPresence),clearInterval(this.ticker),this.ticker=setInterval(()=>this.tick(),1e3)}disconnectedCallback(){this.unsubscribe?.(),this.unsubscribe=null,this.controller?.stopHeartbeat(),document.removeEventListener("visibilitychange",this.onPresence),window.removeEventListener("focus",this.onPresence),clearInterval(this.ticker)}tick(){let a=Date.now();for(let n of this.root.querySelectorAll("[data-countdown-end]")){let i=Number(n.dataset.countdownEnd);n.textContent=q(i-a),i<=a&&!this.refreshedEnds.has(n.dataset.countdownEnd)&&(this.refreshedEnds.add(n.dataset.countdownEnd),setTimeout(()=>{this.controller?.refreshProduction()},1500))}for(let n of this.root.querySelectorAll("[data-progress-end]")){let i=Number(n.dataset.progressEnd),o=Math.max(1,Number(n.dataset.progressTotal));n.style.width=`${Math.min(100,Math.max(0,Math.round((o-Math.max(0,i-a))/o*100)))}%`}}screen(a,n){switch(a.route){case"home":return lt(a,n);case"work":return $t(a,n);case"facilities":return Ct(a,n);case"settings":return St(a,n);case"backup":return xt(a,n);case"residents":return vt(a,n);case"relations":return ut(a,n);case"register":return ct(a,n);case"resident-image":return gt(a,n);case"diagnostics":return this.diagnostics.start(),R(a,n,{top:{kind:"sub",title:"\uC5F0\uACB0 \uC810\uAC80",back:{route:"backup",label:"\uC800\uC7A5\xB7\uBC31\uC5C5"},resources:!1},backdrop:"wood",body:[this.diagnostics.node],nav:!0});default:return At(a,n)}}render(a){let n=a.world?.state==="ready"?a.world.value.worldId:null;n&&n!==this.presentWorld&&(this.presentWorld=n,queueMicrotask(()=>{this.controller?.heartbeat()}));let i=this.screen(a,this.controller);this.style.setProperty("--fw-font-size",`${a.fontSize}px`);let o=this.root.activeElement,s=o?.id,l=o&&"selectionStart"in o&&typeof o.selectionStart=="number"?[o.selectionStart,o.selectionEnd??o.selectionStart]:null,p=a.route===this.renderedRoute?this.root.querySelector(".scroll")?.scrollTop??0:0;this.root.replaceChildren(this.styleNode,i),this.renderedRoute=a.route;let c=this.root.querySelector(".scroll");if(c&&(c.scrollTop=p),s){let m=this.root.getElementById(s);if(m?.focus({preventScroll:!0}),m&&l&&typeof m.setSelectionRange=="function")try{m.setSelectionRange(l[0],l[1])}catch{}}}};typeof customElements<"u"&&!customElements.get(jt)&&customElements.define(jt,Ce);
