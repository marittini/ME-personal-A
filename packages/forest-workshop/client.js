var _r=Object.defineProperty;var Hr=(e,r,a)=>r in e?_r(e,r,{enumerable:!0,configurable:!0,writable:!0,value:a}):e[r]=a;var A=(e,r,a)=>Hr(e,typeof r!="symbol"?r+"":r,a);var le=globalThis.__MARINARA_HOST__;if(!le||le.version!==1||!le.queryClient)throw new Error("Marinara Engine does not provide its query client; this package needs capability API 1.341 or newer.");var Vn=le.queryClient;function nt(){let e=le.api;if(!e?.api)throw new Error("\uC774 Marinara Engine\uC740 \uD328\uD0A4\uC9C0 API \uD074\uB77C\uC774\uC5B8\uD2B8\uB97C \uC81C\uACF5\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.");return e}function T(){return nt().api}function P(e,r){try{let a=e.payload;return typeof a?.message=="string"&&a.message?a.message:nt().getApiErrorMessage(e,r)}catch{return e instanceof Error&&e.message?e.message:r}}function de(e){let r=e.payload;return typeof r?.error=="string"?r.error:null}function ye(){return typeof crypto<"u"&&typeof crypto.randomUUID=="function"?crypto.randomUUID():`${Date.now().toString(36)}-${Math.random().toString(36).slice(2,12)}`}function Q(){if(typeof crypto<"u"&&typeof crypto.randomUUID=="function")return crypto.randomUUID();let e=crypto.getRandomValues(new Uint8Array(16));e[6]=e[6]&15|64,e[8]=e[8]&63|128;let r=[...e].map(a=>a.toString(16).padStart(2,"0")).join("");return`${r.slice(0,8)}-${r.slice(8,12)}-${r.slice(12,16)}-${r.slice(16,20)}-${r.slice(20)}`}var V="/forest-workshop",M={listWorlds:()=>T().get(`${V}/worlds`),createWorld:e=>T().post(`${V}/worlds`,e),getState:e=>T().get(`${V}/state?worldId=${encodeURIComponent(e)}`),getStoryOverview:e=>T().get(`${V}/stories?worldId=${encodeURIComponent(e)}`),getStory:(e,r)=>T().get(`${V}/stories/${encodeURIComponent(r)}?worldId=${encodeURIComponent(e)}`),generateStory:(e,r,a)=>T().post(`${V}/stories/generate`,{worldId:e,pairId:r,episode:a}),getDeliveries:e=>T().get(`${V}/deliveries?worldId=${encodeURIComponent(e)}`),heartbeat:e=>T().post(`${V}/heartbeat`,{worldId:e}),sendCommand:e=>T().post(`${V}/commands`,e),getStorage:e=>T().get(`${V}/storage?worldId=${encodeURIComponent(e)}`),getBackup:e=>T().get(`${V}/backup?worldId=${encodeURIComponent(e)}`),listSources:e=>T().get(`${V}/sources?worldId=${encodeURIComponent(e)}`),previewSource:(e,r,a)=>T().get(`${V}/sources/preview?worldId=${encodeURIComponent(e)}&kind=${r}&id=${encodeURIComponent(a)}`),rebuildSuggestion:(e,r)=>T().post(`${V}/rebuild-suggestion`,{worldId:e,source:r}),uploadResidentImage:e=>{let r=new FormData;return r.append("worldId",e.worldId),r.append("residentId",e.residentId),r.append("uploadKey",e.uploadKey),r.append("file",e.file,e.file.name),T().upload(`${V}/residents/image`,r)},restore:(e,r)=>T().post(`${V}/restore`,{newWorldId:e,backup:r})};var it="\uC232\uACB0 \uACF5\uBC29 \uBC31\uC5C5 \uD30C\uC77C\uC774 \uC544\uB2D9\uB2C8\uB2E4. \uC124\uC815 \u2192 \uC800\uC7A5\xB7\uBC31\uC5C5\uC5D0\uC11C \uB0B4\uBCF4\uB0B8 JSON \uD30C\uC77C\uC744 \uACE8\uB77C \uC8FC\uC138\uC694.";function ot(e,r){return!e||typeof e!="object"||Array.isArray(e)?0:Object.values(e).filter(r).length}function st(e){let r=e;if(!r||r.format!=="forest-workshop-backup"||!r.world)return{ok:!1,message:it};let{settings:a,wallet:n,inventory:i}=r.world;if(typeof a?.worldName!="string"||typeof a.playerNickname!="string")return{ok:!1,message:it};let o=i&&typeof i=="object"?Object.values(i).filter(s=>typeof s=="number"&&s>0):[];return{ok:!0,summary:{worldName:a.worldName,playerNickname:a.playerNickname,gold:typeof n?.gold=="number"?n.gold:0,itemKinds:o.length,itemTotal:o.reduce((s,l)=>s+l,0),exportedAt:typeof r.exportedAt=="string"?r.exportedAt:"",residents:ot(r.world.residents,()=>!0),pairs:ot(r.world.pairs,s=>!s.archived),pictures:Array.isArray(r.assets)?r.assets.length:0}}}var lt={weather:{label:"\uD604\uC2E4 \uB0A0\uC528",phase:"P5"},mail:{label:"\uC6B0\uD3B8\uD568",phase:"P4b"},"survey-patrol":{label:"\uC870\uC0AC \xB7 \uC21C\uCC30",phase:"P4b"},"weather-effects":{label:"\uB0A0\uC528 \uD6A8\uACFC",phase:"P5"},"auto-read":{label:"\uC790\uB3D9 \uC77D\uAE30",phase:"P4b"},"ai-guidelines":{label:"AI \uC9C0\uCE68 \uAD00\uB9AC",phase:"P4b"},memory:{label:"\uAE30\uC5B5 \uAD00\uB9AC",phase:"P4b"},"pair-memory":{label:"\uD398\uC5B4 \uAE30\uC5B5 \uBCF4\uAE30",phase:"P4b"},"pair-guidelines":{label:"\uD398\uC5B4 \uC9C0\uCE68 \uAD00\uB9AC",phase:"P4b"}};function xe(e){return e in lt}function dt(e){let r=lt[e];return r?`${r.label} \uAE30\uB2A5\uC740 \uC544\uC9C1 \uC900\uBE44 \uC911\uC774\uC5D0\uC694.`:""}var ct="forest-workshop:font-size",X={min:12,max:22,default:16,step:1};function ke(e){return Number.isFinite(e)?Math.min(X.max,Math.max(X.min,Math.round(e))):X.default}function pt(){try{let e=localStorage.getItem(ct);return e===null?X.default:ke(Number(e))}catch{return X.default}}function mt(e){try{localStorage.setItem(ct,String(ke(e)))}catch{}}var ut="forest-workshop:season",Ur=["auto","spring","summer","autumn","winter"];function ft(){try{let e=localStorage.getItem(ut);return Ur.includes(e)?e:"auto"}catch{return"auto"}}function gt(e){try{localStorage.setItem(ut,e)}catch{}}function Pe(e){let r=e.getMonth();return r>=2&&r<=4?"spring":r>=5&&r<=7?"summer":r>=8&&r<=10?"autumn":"winter"}function bt(e,r=new Date){return e==="auto"?Pe(r):e}var ht={spring:"\uBD04",summer:"\uC5EC\uB984",autumn:"\uAC00\uC744",winter:"\uACA8\uC6B8"};var Kr="forest-workshop",Qr=`/api/capability-packages/${Kr}/assets/assets/`,vt=["spring","summer","autumn","winter"],Yr=new Set(["wild-berry","herb","wood","pinecone","acorn","wheat","flower","pumpkin","cotton","tea-leaf","honey","mushroom","beeswax","feather","clover","berry-jam","dried-herb","flour","plank","thread","herb-tea","pumpkin-puree","acorn-flour","herb-sachet","berry-pie","wooden-tray","beeswax-candle","knit-scarf","flower-wreath","pumpkin-soup","honey-cake","birdhouse","acorn-cookie","tea-gift","apple","reed","carrot","flax","clay","salt","dried-apple","apple-jam","linen","reed-cord","prepared-clay","herb-salt","apple-bread","carrot-potage","mushroom-skewer","linen-handkerchief","herb-pillow","reed-basket","wooden-spoon","desk-organizer","clay-planter","wind-chime","apple-gift","picnic-wrap"]),yt={"gather-yard":"facilities/gather-yard.webp","grow-plot":"facilities/grow-plot.webp","survey-desk":"facilities/survey-desk.webp","process-bench":"facilities/process-bench.webp","craft-bench":"facilities/craft-bench.webp"},se={spring:{base:"backgrounds/workshop-base-spring.webp",scene:"backgrounds/workshop-scene-spring.webp"},summer:{base:"backgrounds/workshop-base-summer.webp",scene:"backgrounds/workshop-scene-summer.webp"},autumn:{base:"backgrounds/workshop-base-autumn.webp",scene:"backgrounds/workshop-scene-autumn.webp"},winter:{base:"backgrounds/workshop-base-winter.webp",scene:"backgrounds/workshop-scene-winter.webp"}},je={joy:"emotions/joy.webp",affection:"emotions/affection.webp",curiosity:"emotions/curiosity.webp",fluster:"emotions/fluster.webp",inspiration:"emotions/inspiration.webp",annoyance:"emotions/annoyance.webp"},oe={gift:"ui/gift.webp",titleSign:"ui/title-sign.webp",primaryButton:"ui/primary-button.webp",paperPanel:"ui/paper-panel.webp",woodPanel:"ui/wood-panel.webp"};function Oe(e){return`${Qr}${e}`}function xt(e){return Yr.has(e)?`items/${e}.webp`:null}var Ne=new Set;function ae(e,r){if(!e||Ne.has(e))return r.fallback();let a=document.createElement("img");return a.className=r.className,a.alt=r.alt??"",a.decoding="async",a.draggable=!1,r.lazy&&(a.loading="lazy"),a.addEventListener("error",()=>{Ne.add(e),a.replaceWith(r.fallback())},{once:!0}),a.src=Oe(e),a}function me(e){return`url("${Oe(e)}")`}var wt=new Map;function kt(e){let r=wt.get(e);return r||(r=new Promise(a=>{if(Ne.has(e))return a(!1);let n=new Image;n.decoding="async",n.onload=()=>a(!0),n.onerror=()=>{Ne.add(e),a(!1)},n.src=Oe(e)}),wt.set(e,r)),r}function Be(e){return[{path:se[e].base,flag:"art-base"},{path:oe.titleSign,flag:"art-sign"},{path:oe.primaryButton,flag:"art-button"},{path:oe.paperPanel,flag:"art-paper"}]}function Nt(e){let r=e,a=new Set;return{get:()=>r,set(n){let i=typeof n=="function"?n(r):n;r={...r,...i};for(let o of a)o(r)},remember(n){let i=typeof n=="function"?n(r):n;r={...r,...i}},subscribe(n){return a.add(n),()=>a.delete(n)}}}var Se=class{constructor(){A(this,"epoch",0)}beginNavigation(){return this.epoch+=1,this.epoch}isCurrentNavigation(r){return r===this.epoch}acceptsUpdate(r,a){return!r||r.worldId!==a.worldId?!1:a.revision>=r.revision}};function St(e){let{store:r}=e;function a(o){r.set(s=>s.register?{register:{...s.register,...o}}:{})}function n(){let o=r.get().register?.pendingImage;o&&URL.revokeObjectURL(o.previewUrl)}async function i(){let o=e.currentWorld();if(o){a({sources:{state:"loading"}});try{let{sources:s}=await M.listSources(o.worldId);a({sources:{state:"ready",value:s}})}catch(s){a({sources:{state:"error",message:P(s,"\uCE90\uB9AD\uD130\xB7\uD398\uB974\uC18C\uB098 \uBAA9\uB85D\uC744 \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC5B4\uC694.")}})}}}return{openRegister(o=1){n(),r.set({register:{step:o,kindTab:"character",query:"",sources:{state:"loading"},selected:null,preview:null,draft:"",pendingImage:null,starterChoice:null}}),e.navigate("register"),o===1&&i()},closeRegister(){n(),r.set({register:null}),e.navigate("residents")},loadSources:i,setRegisterKind:o=>a({kindTab:o}),setRegisterQuery:o=>a({query:o}),backToSources:()=>a({step:1}),setDraft:o=>r.remember(s=>s.register?{register:{...s.register,draft:o}}:{}),setStarterChoice:o=>a({starterChoice:o}),async chooseSource(o){let s=e.currentWorld();if(s){a({step:2,selected:o,preview:{state:"loading"},draft:""});try{let l=await M.previewSource(s.worldId,o.kind,o.id);a({preview:{state:"ready",value:l}})}catch(l){a({preview:{state:"error",message:P(l,"\uC790\uB8CC\uB97C \uC77D\uC9C0 \uBABB\uD588\uC5B4\uC694.")}})}}},async suggestSetting(){let o=e.currentWorld(),s=r.get().register?.selected;if(!o||!s)return;let l=await e.track("rebuild-suggestion",()=>M.rebuildSuggestion(o.worldId,{kind:s.kind,id:s.id}),"\uC81C\uC548\uC744 \uBC1B\uC9C0 \uBABB\uD588\uC5B4\uC694. \uC9C1\uC811 \uC368\uB3C4 \uB3FC\uC694.");l&&a({draft:l.suggestion})},pickPendingImage(o){n(),a({pendingImage:{file:o,previewUrl:URL.createObjectURL(o)}})},clearPendingImage(){n(),a({pendingImage:null})},async confirmRegister(o,s){let l=r.get().register,p=l?.selected;if(!l||!p||!l.draft.trim())return;let c=`register:${p.kind}:${p.id}`,m=e.requestIdFor(`${c}:id`,c,Q);if(!await e.runCommand(c,"residents.register",{residentId:m,source:{kind:p.kind,id:p.id},worldSetting:l.draft}))return;e.forgetRequest(`${c}:id`);let h=o?l.pendingImage:null;h&&await s(m,h.file),n();let f=e.currentWorld();if(f&&f.state.progress.starterResidentId===null){a({step:3,starterChoice:m,pendingImage:null,selected:null,preview:null,draft:""});return}r.set(g=>({register:null,residentsView:{...g.residentsView,selectedId:m}})),e.navigate("residents"),e.notify(`${p.name}\uC744(\uB97C) \uC8FC\uBBFC\uC73C\uB85C \uB4F1\uB85D\uD588\uC5B4\uC694.`)},async confirmStarter(){let o=r.get().register?.starterChoice;!o||!await e.runCommand("choose-starter","residents.chooseStarter",{residentId:o})||(r.set({register:null}),e.navigate("home"),e.notify("\uC2DC\uC791 \uC8FC\uBBFC\uC774 \uACF5\uBC29\uC5D0 \uC654\uC5B4\uC694."))},registerAnother(){a({step:1,query:""}),i()}}}var Jr=6e4;function $t(e){return e.map((r,a)=>({rule:r,index:a})).sort((r,a)=>r.rule.priority-a.rule.priority||r.index-a.index).map(({rule:r})=>r)}function Ve(e){return e.map((r,a)=>({...r,priority:Math.min(5,a+1)}))}function Fe(e,r,a){return e.work.drafts[a]??$t(r.facilities[a]?.rules??[])}function Ct(e,r,a){let n=e.work.drafts[a];return!!n&&JSON.stringify(n)!==JSON.stringify($t(r.facilities[a]?.rules??[]))}function $e(e){let{activity:r,simMs:a,...n}=e.production;return JSON.stringify([e.inventory,e.wallet,n,r.lastAbsence])}function It(e){let{store:r}=e,a,n=!1;function i(){return r.get().content}function o(c){r.set(m=>({work:{...m.work,...c}}))}function s(c,m){let u=e.currentWorld();if(!u)return;let h=Fe(r.get(),u.state.production,c);o({drafts:{...r.get().work.drafts,[c]:m(h.map(f=>({...f})))}})}async function l(){let c=e.currentWorld();if(!(!c||n)&&!(typeof document<"u"&&(document.visibilityState!=="visible"||!document.hasFocus()))){n=!0;try{let m=await M.heartbeat(c.worldId),u=e.currentWorld();if(!u||u.worldId!==m.worldId)return;$e(u.state)===$e(m.state)?e.rememberWorld(m):e.showWorld(m)}catch{}finally{n=!1}}}async function p(){let c=e.currentWorld();if(c)try{let m=await M.getState(c.worldId),u=e.currentWorld();if(!u||u.worldId!==m.worldId)return;$e(u.state)===$e(m.state)?e.rememberWorld(m):e.showWorld(m)}catch{}}return{heartbeat:l,refreshProduction:p,startHeartbeat(){clearInterval(a),a=setInterval(()=>{l()},Jr),l()},stopHeartbeat(){clearInterval(a),a=void 0},selectFacility(c){o({facilityId:c,section:"status"})},setWorkSection(c){o({section:c})},selectRule(c,m){o({selected:{...r.get().work.selected,[c]:m}})},changeTarget(c,m,u){let h=i()?.production.targetStock??{min:1,max:999};s(c,f=>f.map(g=>g.policyId===m?{...g,targetStock:Math.min(h.max,Math.max(h.min,g.targetStock+u))}:g))},toggleRule(c,m){s(c,u=>u.map(h=>h.policyId===m?{...h,enabled:!h.enabled}:h))},moveRule(c,m,u){s(c,h=>{let f=h.findIndex($=>$.policyId===m),g=f+u;if(f<0||g<0||g>=h.length)return h;let w=[...h];return[w[f],w[g]]=[w[g],w[f]],Ve(w)})},addRule(c,m){let u=i()?.production.recommendedRules[c]?.find(f=>f.recipeId===m),h=Q();s(c,f=>Ve([...f,{policyId:h,enabled:!0,recipeId:m,targetStock:u?.targetStock??10,priority:5}])),o({selected:{...r.get().work.selected,[c]:h}})},removeRule(c,m){s(c,u=>Ve(u.filter(h=>h.policyId!==m)))},recommendRules(c){let m=e.currentWorld(),u=i()?.production.recommendedRules[c]??[];if(!m)return;let h=m.state.production.facilities[c]?.rules??[],f=u.map(g=>({policyId:h.find(w=>w.recipeId===g.recipeId)?.policyId??Q(),enabled:!0,recipeId:g.recipeId,targetStock:g.targetStock,priority:g.priority}));o({drafts:{...r.get().work.drafts,[c]:f}}),e.notify("\uCD94\uCC9C \uC124\uC815\uC744 \uBD88\uB7EC\uC654\uC5B4\uC694. \uD655\uC778\uD55C \uB4A4 '\uC6B4\uC601 \uADDC\uCE59 \uC801\uC6A9'\uC744 \uB204\uB974\uBA74 \uBC14\uB00C\uC5B4\uC694.")},discardDraft(c){let m={...r.get().work.drafts};delete m[c],o({drafts:m})},async applyRules(c){let m=r.get().work.drafts[c];if(!m||!await e.runCommand(`rules:${c}`,"production.setRules",{facilityId:c,rules:m}))return;let h={...r.get().work.drafts};delete h[c],o({drafts:h}),e.notify("\uC6B4\uC601 \uADDC\uCE59\uC744 \uC801\uC6A9\uD588\uC5B4\uC694. \uC9C0\uAE08 \uC791\uC5C5\uC740 \uADF8\uB300\uB85C \uC774\uC5B4\uC9C0\uACE0 \uB2E4\uC74C \uD68C\uCC28\uBD80\uD130 \uBC14\uB00C\uC5B4\uC694.")},async upgradeFacility(c,m){let u=await e.runCommand(`upgrade:${c}:${m}`,"production.upgradeFacility",{facilityId:c,fromLevel:m});u&&e.notify(`Lv. ${String(u.result.level)}\uB85C \uAC15\uD654\uD588\uC5B4\uC694. \uB2E4\uC74C \uD68C\uCC28\uBD80\uD130 \uBE68\uB77C\uC838\uC694.`)},async setProtected(c,m){await e.runCommand(`protect:${c}`,"production.setProtected",{itemId:c,amount:m})},async sell(c,m){let u=await e.runCommand(`sell:${c}`,"economy.sell",{itemId:c,amount:m});u&&(r.set({sheet:null}),e.notify(`${m}\uAC1C\uB97C \uD314\uC544 ${String(u.result.gold)} G\uB97C \uBC1B\uC558\uC5B4\uC694.`))},async unlockFacility(c){let m=await e.runCommand(`unlock:${c}`,"production.unlockFacility",{facilityId:c});m&&!m.result.alreadyOpen&&e.notify("\uC2DC\uC124\uC774 \uC5F4\uB838\uC5B4\uC694. \uCD94\uCC9C \uADDC\uCE59\uC73C\uB85C \uBC14\uB85C \uC77C\uC744 \uC2DC\uC791\uD574\uC694.")},async setMode(c,m){(await e.runCommand(`mode:${c}`,"production.setMode",{facilityId:c,mode:m}))?.result.running&&e.notify("\uC9C0\uAE08 \uC791\uC5C5\uC774 \uB05D\uB098\uBA74 \uBC14\uB010 \uBC29\uC2DD\uC73C\uB85C \uC774\uC5B4\uC838\uC694.")},selectQueueRecipe(c,m){o({queueRecipe:{...r.get().work.queueRecipe,[c]:m}})},async addQueue(c,m,u){let h=`queue-entry:${c}`,f=e.requestIdFor(h,JSON.stringify([m,u]),Q);await e.runCommand(`queue:${c}`,"production.queueAdd",{facilityId:c,entryId:f,recipeId:m,count:u})&&e.forgetRequest(h)},async removeQueue(c,m){await e.runCommand(`queue-remove:${m}`,"production.queueRemove",{facilityId:c,entryId:m})},async assignResident(c,m){await e.runCommand(`assign:${c}`,"production.assignResident",{facilityId:c,residentId:m})&&r.set({sheet:null})},async setAutoSell(c,m){await e.runCommand(`auto-sell:${c}`,"economy.setAutoSell",{itemId:c,setting:m})&&e.notify(m.enabled?"\uC790\uB3D9 \uD310\uB9E4 \uC124\uC815\uC744 \uC800\uC7A5\uD588\uC5B4\uC694.":"\uC790\uB3D9 \uD310\uB9E4\uB97C \uAED0\uC5B4\uC694.")},async readReports(c){await e.runCommand("reports-read","production.markReportsRead",{throughReportId:c})&&r.set({sheet:null})}}}function Rt(e,r){let a=r.query.trim().toLowerCase();return Object.values(e.residents).filter(n=>r.tab==="all"||n.kind===r.tab).filter(n=>r.filter==="all"?!0:r.filter==="recruited"?n.recruited:!n.recruited).filter(n=>!a||n.displayName.toLowerCase().includes(a)||n.source.name.toLowerCase().includes(a)).sort((n,i)=>Number(i.recruited)-Number(n.recruited)||n.registeredAt.localeCompare(i.registeredAt))}function De(e,r){return`pair-add:${[e,r].sort().join(":")}`}function Ge(e,r){return e.residentIds[0]===r?e.residentIds[1]:e.residentIds[0]}function At(e){let{store:r}=e;function a(i){let o=e.currentWorld();return o&&i?o.state.residents[i]??null:null}function n(i){r.set(o=>({residentsView:{...o.residentsView,...i}}))}return{setResidentsTab:i=>n({tab:i,page:0}),setResidentsQuery:i=>n({query:i,page:0}),setResidentsFilter:i=>n({filter:i,page:0}),setResidentsPage:i=>n({page:Math.max(0,i)}),showResidentsList:()=>n({detailOpen:!1}),selectResident:i=>n({selectedId:i,detailOpen:!0}),openResidents(i){n(i?{selectedId:i,detailOpen:!0}:{detailOpen:!1}),e.navigate("residents")},openRelations(i){r.set({focusResidentId:i}),e.navigate("relations")},openResidentImage(i){let o=a(i);r.set({focusResidentId:i,placementDraft:o?{...o.image.placement}:null}),e.navigate("resident-image")},openSheet(i){r.set({sheet:i,notice:null})},closeSheet(){r.set({sheet:null})},rememberProfile(i){r.remember(o=>o.sheet?.kind==="profile"?{sheet:{...o.sheet,...i}}:{})},toggleRelationsEditing(){r.set(i=>({relationsEditing:!i.relationsEditing}))},async updateWorldSetting(i,o){let s=await e.runCommand(`resident-setting:${i}`,"residents.update",{residentId:i,worldSetting:o});return s&&(r.remember(l=>l.sheet?.kind==="profile"?{sheet:{...l.sheet,draft:void 0}}:{}),e.notify("\uACF5\uBC29 \uC138\uACC4 \uC124\uC815\uC744 \uACE0\uCCE4\uC5B4\uC694. \uBCC0\uACBD \uC774\uB825\uC5D0 \uB0A8\uC558\uC5B4\uC694.")),s},async addPair(i,o){let s=a(i),l=a(o);if(!s||!l)return;let p=De(s.residentId,l.residentId),c=e.requestIdFor(`${p}:id`,p,Q);await e.runCommand(p,"pairs.add",{pairId:c,residentIds:[s.residentId,l.residentId]})&&(e.forgetRequest(`${p}:id`),r.set({sheet:null}),e.notify(`${s.displayName} \xD7 ${l.displayName} \uD398\uC5B4\uB97C \uB9CC\uB4E4\uC5C8\uC5B4\uC694.`))},archivePair:i=>e.runCommand(`pair-archive:${i}`,"pairs.archive",{pairId:i}),restorePair:i=>e.runCommand(`pair-restore:${i}`,"pairs.restore",{pairId:i}),setPlacementDraft(i){r.set(o=>o.placementDraft?{placementDraft:{...o.placementDraft,...i}}:{})},resetPlacementDraft(){let i=r.get().content?.residents.placement;i&&r.set({placementDraft:{scale:i.scale.default,offsetX:i.offsetX.default,markerHeight:i.markerHeight.default}})},async applyPlacement(i){let o=r.get().placementDraft;if(!o)return;await e.runCommand(`placement:${i}`,"residents.setPlacement",{residentId:i,placement:o})&&e.notify("\uBC30\uCE58\uB97C \uC801\uC6A9\uD588\uC5B4\uC694. \uADF8\uB9BC \uD30C\uC77C\uC740 \uADF8\uB300\uB85C\uC608\uC694.")},async uploadResidentImage(i,o){let s=e.currentWorld();if(!s)return null;let l=`image-upload:${i}`,p=e.requestIdFor(l,`${i}:${o.name}:${o.size}:${o.lastModified}`),c=await e.track(l,()=>M.uploadResidentImage({worldId:s.worldId,residentId:i,uploadKey:p,file:o}),"\uADF8\uB9BC\uC744 \uC800\uC7A5\uD558\uC9C0 \uBABB\uD588\uC5B4\uC694. \uAE30\uC874 \uADF8\uB9BC\uC740 \uADF8\uB300\uB85C\uC608\uC694.");if(!c)return null;let m=e.currentWorld()??s;return e.showWorld({worldId:m.worldId,revision:c.revision,updatedAt:new Date().toISOString(),state:c.state}),e.notify(c.duplicate?"\uC774\uBBF8 \uC800\uC7A5\uB41C \uADF8\uB9BC\uC774\uC5D0\uC694.":"\uADF8\uB9BC\uC744 WebP\uB85C \uC800\uC7A5\uD588\uC5B4\uC694."),c},async restoreResidentImage(i,o){await e.runCommand(`image-restore:${i}`,"residents.restoreImage",{residentId:i,reference:o})&&(r.set({sheet:null}),e.notify("\uC774\uC804 \uADF8\uB9BC\uC73C\uB85C \uB418\uB3CC\uB838\uC5B4\uC694."))},async clearImageHistory(){let i=await e.runCommand("image-history-clear","residents.clearImageHistory",{});if(!i)return;r.set({sheet:null});let o=Array.isArray(i.result.released)?i.result.released.length:0;e.notify(o?`\uC774\uC804 \uADF8\uB9BC ${o}\uC7A5\uC744 \uC815\uB9AC\uD588\uC5B4\uC694.`:"\uC815\uB9AC\uD560 \uC774\uC804 \uADF8\uB9BC\uC774 \uC5C6\uC5B4\uC694."),await e.refreshStorage()}}}function Mt(e){let{store:r}=e;async function a(){let n=e.currentWorld();if(n){r.set({deliveries:{state:"loading"}});try{r.set({deliveries:{state:"ready",value:await M.getDeliveries(n.worldId)}})}catch(i){r.set({deliveries:{state:"error",message:P(i,"\uB0A9\uD488 \uC758\uB8B0\uB97C \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.")}})}}}return{setInviteTab(n){r.set({inviteTab:n})},async draw(n){let i=await e.runCommand(`invite:${n}`,"invite.draw",{count:n});i&&r.set({sheet:{kind:"invite-result",draws:i.result.draws}})},async setWish(n){await e.runCommand("invite-wish","invite.setWish",{residentId:n})&&r.set({sheet:null})},async exchange(n){let i=await e.runCommand(`exchange:${n}`,"invite.exchange",{residentId:n});i&&r.set({sheet:{kind:"invite-result",draws:[i.result]}})},openDeliveries(){r.set({sheet:{kind:"deliveries"}}),a()},async deliver(n){let i=await e.runCommand(`deliver:${n}`,"economy.deliver",{orderId:n});if(!i)return;let o=i.result.reward;e.notify(`\uB0A9\uD488\uD588\uC5B4\uC694. \uCD08\uB300\uAD8C ${o.tickets}\uC7A5\uACFC ${o.gold} G\uB97C \uBC1B\uC558\uC5B4\uC694.`),await a()}}}var Xr=2800;function Tt(e){let{store:r}=e,a,n=-1,i="";function o(f){r.set(g=>({explore:{...g.explore,...f}}))}function s(f){r.set(g=>g.reader?{reader:{...g.reader,...f}}:{})}async function l(f=!1){let g=e.currentWorld();if(g){f||o({overview:{state:"loading"}});try{let w=await M.getStoryOverview(g.worldId),$=r.get().explore.pairId;o({overview:{state:"ready",value:w},pairId:w.pairs.some(R=>R.pairId===$)?$:w.pairs[0]?.pairId??null})}catch(w){f||o({overview:{state:"error",message:P(w,"\uC774\uC57C\uAE30\uB97C \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.")}})}}}r.subscribe(f=>{f.route!==i&&(i=f.route,f.route==="explore"&&l(f.explore.overview?.state==="ready"));let g=f.world?.state==="ready"?f.world.value.revision:-1;g!==n&&(n=g,(f.route==="explore"||f.route==="home")&&f.explore.overview?.state==="ready"&&l(!0))});function p(){clearInterval(a),a=void 0}function c(){let f=r.get().reader;return f?.story.state==="ready"?f.story.value.segments:[]}function m(){let f=r.get().reader,g=e.currentWorld();if(!f||!g)return!1;let w=g.state.stories.pairs[f.pairId],R=[w?.current,...w?.completed??[]].find(E=>E?.episodes[f.episode]?.storyId===f.storyId)?.episodes[f.episode];return!!R?.choice||R?.state==="read"}function u(){let f=r.get().reader;if(!f)return;let g=c();g[f.index]?.kind==="choice"&&!m()||(f.index<g.length&&s({index:f.index+1}),f.index+1>=g.length&&p())}async function h(){let f=r.get().reader,g=e.currentWorld();if(!(!f||!g)){s({story:{state:"loading"}});try{let w;try{w=await M.getStory(g.worldId,f.storyId)}catch($){if(de($)!=="story_not_found")throw $;w=await M.generateStory(g.worldId,f.pairId,f.episode)}if(r.get().reader?.storyId!==f.storyId)return;s({story:{state:"ready",value:w},index:0})}catch(w){if(r.get().reader?.storyId!==f.storyId)return;s({story:{state:"error",message:P(w,"\uC774\uC57C\uAE30\uB97C \uC4F0\uC9C0 \uBABB\uD588\uC5B4\uC694. \uAC19\uC740 \uC774\uC57C\uAE30\uB85C \uB2E4\uC2DC \uC2DC\uB3C4\uD560 \uC218 \uC788\uC5B4\uC694.")}})}}}return{loadStoryOverview:l,openExplore(){e.navigate("explore")},setExploreTab(f){o({tab:f})},selectStoryPair(f){o({pairId:f})},async depart(f,g){let w=await e.runCommand(`depart:${f}:${g}`,"stories.depart",{pairId:f,episode:g});w&&(e.notify(`\uD0D0\uD5D8\uC744 \uB5A0\uB0AC\uC5B4\uC694. ${String(w.result.minutes)}\uBD84 \uB4A4\uC5D0 \uC774\uC57C\uAE30\uAC00 \uC5F4\uB824\uC694.`),await l(!0))},async cancelExpedition(){await e.runCommand("expedition-cancel","stories.cancel",{})&&(e.notify("\uD0D0\uD5D8\uC744 \uCDE8\uC18C\uD588\uC5B4\uC694. \uC900\uBE44\uBB3C\uC740 \uBAA8\uB450 \uB3CC\uB824\uBC1B\uC558\uC5B4\uC694."),await l(!0))},openStory(f,g,w){p();let $=r.get().route==="story"?"explore":r.get().route;r.set({reader:{pairId:f,episode:g,storyId:w,story:{state:"loading"},index:0,auto:!1,backlog:!1,from:$}}),e.navigate("story"),h()},retryStory(){h()},advanceStory:u,toggleAuto(){let f=r.get().reader;if(f){if(f.auto){p(),s({auto:!1});return}s({auto:!0}),a=setInterval(()=>{if(!r.get().reader?.auto||r.get().route!=="story")return p();u()},Xr)}},toggleBacklog(){let f=r.get().reader;f&&s({backlog:!f.backlog})},async chooseAnswer(f){let g=r.get().reader;if(!g)return;await e.runCommand(`choose:${g.storyId}`,"stories.choose",{pairId:g.pairId,episode:g.episode,storyId:g.storyId,optionId:f})&&u()},async finishStory(){let f=r.get().reader;if(!f)return;p();let g=await e.runCommand(`read:${f.storyId}`,"stories.markRead",{pairId:f.pairId,episode:f.episode,storyId:f.storyId});g&&(r.set({reader:null}),e.navigate(f.from==="story"?"explore":f.from),g.result.alreadyRead||e.notify(g.result.arcDone?"\uC774 \uD0D0\uD5D8\uC758 \uC774\uC57C\uAE30\uB97C \uBAA8\uB450 \uC77D\uC5C8\uC5B4\uC694. \uB2E4\uC74C \uD0D0\uD5D8\uC774 \uC5F4\uB838\uC5B4\uC694.":"\uC774\uC57C\uAE30\uB97C \uB2E4 \uC77D\uC5C8\uC5B4\uC694. \uB2E4\uC74C \uC774\uC57C\uAE30\uB97C \uB5A0\uB0A0 \uC218 \uC788\uB294\uC9C0 \uD655\uC778\uD574 \uBCF4\uC138\uC694."),await l(!0))},closeStory(){let f=r.get().reader;p(),r.set({reader:null}),e.navigate(f?.from&&f.from!=="story"?f.from:"explore")}}}var qe="forest-workshop:last-world";function Zr(){try{return localStorage.getItem(qe)}catch{return null}}function zt(e){try{e?localStorage.setItem(qe,e):localStorage.removeItem(qe)}catch{}}function ea(e){let r=e.status;return typeof r=="number"&&r>=400&&r<500&&de(e)!==null}function Lt(){let e=Nt({route:"worlds",worlds:{state:"loading"},world:null,content:null,busy:{},notice:null,restore:null,fontSize:pt(),seasonChoice:ft(),artReady:[],facilitiesTab:"facilities",storage:null,starterSheetHidden:!1,residentsView:{tab:"all",query:"",filter:"all",selectedId:null},focusResidentId:null,relationsEditing:!1,sheet:null,placementDraft:null,register:null,work:{facilityId:"gather-yard",drafts:{},selected:{},queueRecipe:{}},inviteTab:"invite",deliveries:null,explore:{tab:"story",pairId:null,overview:null},reader:null,worldReceivedAt:Date.now()}),r=new Map,a=new Se;function n(){for(let{path:b}of Be(ne(e.get())))kt(b).then(x=>{x&&!e.get().artReady.includes(b)&&e.set(N=>({artReady:[...N.artReady,b]}))})}n();let i=4e3,o=null,s;e.subscribe(b=>{if(b.notice!==o&&(o=b.notice,clearTimeout(s),o?.kind==="info")){let x=o;s=setTimeout(()=>{e.get().notice===x&&e.set({notice:null})},i)}});function l(b,x,N=ye){let z=r.get(b);if(z&&z.signature===x)return z.id;let G=N();return r.set(b,{id:G,signature:x}),G}function p(b,x){e.set(N=>({busy:{...N.busy,[b]:x}}))}async function c(b,x,N){if(e.get().busy[b])return null;p(b,!0),e.set({notice:null});try{let z=await x();return r.delete(b),z}catch(z){return ea(z)&&r.delete(b),e.set({notice:{kind:"error",text:P(z,N)}}),de(z)==="stale_view"&&R(),null}finally{p(b,!1)}}function m(b,x){zt(b.worldId),e.set(N=>({world:{state:"ready",value:{worldId:b.worldId,revision:b.revision,updatedAt:b.updatedAt,state:b.state}},worldReceivedAt:Date.now(),work:N.world?.state==="ready"&&N.world.value.worldId===b.worldId?N.work:{facilityId:N.work.facilityId,drafts:{},selected:{},queueRecipe:{}},content:x??N.content,route:N.route==="worlds"?"home":N.route}))}function u(b,x){a.acceptsUpdate(E(),b)&&m(b,x)}function h(b,x){a.beginNavigation(),m(b,x)}function f(b){a.acceptsUpdate(E(),b)&&e.remember({world:{state:"ready",value:{worldId:b.worldId,revision:b.revision,updatedAt:b.updatedAt,state:b.state}},worldReceivedAt:Date.now()})}async function g(){e.set({worlds:{state:"loading"}});try{let{worlds:b}=await M.listWorlds();return e.set({worlds:{state:"ready",value:b}}),b}catch(b){return e.set({worlds:{state:"error",message:P(b,"\uC138\uACC4 \uBAA9\uB85D\uC744 \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.")}}),null}}async function w(b){let x=a.beginNavigation();e.set({world:{state:"loading"},route:"home",notice:null});try{let N=await M.getState(b);if(!a.isCurrentNavigation(x))return;m(N,N.content)}catch(N){if(!a.isCurrentNavigation(x))return;de(N)==="world_not_found"&&zt(null),e.set({world:{state:"error",message:P(N,"\uC138\uACC4\uB97C \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.")}})}}async function $(){let b=E();if(b){e.set({storage:{state:"loading"}});try{e.set({storage:{state:"ready",value:await M.getStorage(b.worldId)}})}catch(x){e.set({storage:{state:"error",message:P(x,"\uC800\uC7A5 \uACF5\uAC04\uC744 \uD655\uC778\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.")}})}}}async function R(){let b=e.get().world;b?.state==="ready"&&await w(b.value.worldId)}function E(){let b=e.get().world;return b?.state==="ready"?b.value:null}function B(b){e.set({route:b,notice:null,restore:null,sheet:null,relationsEditing:!1}),b==="worlds"&&g(),b==="backup"&&$()}async function D(b,x,N={}){let z=E();if(!z)return null;let G=JSON.stringify([z.worldId,x,N]),qr=l(b,G),ve=await c(b,()=>M.sendCommand({worldId:z.worldId,commandId:qr,expectedRevision:z.revision,type:x,payload:N}),"\uC694\uCCAD\uC744 \uCC98\uB9AC\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4. \uB2E4\uC2DC \uC2DC\uB3C4\uD574 \uC8FC\uC138\uC694.");return!ve||E()?.worldId!==z.worldId?null:(u({worldId:z.worldId,revision:ve.revision,updatedAt:new Date().toISOString(),state:ve.state}),ve)}let U={store:e,track:c,runCommand:D,currentWorld:E,requestIdFor:l,forgetRequest:b=>r.delete(b),showWorld:u,rememberWorld:f,navigate:B,refreshStorage:$,notify:(b,x="info")=>e.set({notice:{kind:x,text:b}})};return{store:e,...At(U),...St(U),...It(U),...Mt(U),...Tt(U),async start(){let b=await g(),x=Zr();b&&x&&b.some(N=>N.worldId===x&&N.readable)&&await w(x)},loadWorlds:g,openWorld:w,reloadWorld:R,navigate:B,notify:U.notify,notifyLocked(b){e.set({notice:{kind:"info",text:dt(b)}})},setSeasonChoice(b){gt(b),e.set({seasonChoice:b}),n()},setFontSize(b){let x=ke(b);mt(x),e.set({fontSize:x})},setFacilitiesTab(b){e.set({facilitiesTab:b})},hideStarterSheet(){e.set({starterSheetHidden:!0})},showStarterSheet(){e.set({starterSheetHidden:!1})},dismissNotice(){e.set({notice:null})},async createWorld(b,x){let N=JSON.stringify([b.trim(),x.trim()]),z=l("create-world",N,Q),G=await c("create-world",()=>M.createWorld({worldId:z,worldName:b,playerNickname:x}),"\uC138\uACC4\uB97C \uB9CC\uB4E4\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.");G&&h(G,G.content)},runCommand:D,async downloadBackup(){let b=E();if(!b)return;let x=await c("backup",()=>M.getBackup(b.worldId),"\uBC31\uC5C5\uC744 \uB9CC\uB4E4\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.");if(!x)return;let N=new Blob([`${JSON.stringify(x,null,2)}
`],{type:"application/json"}),z=URL.createObjectURL(N),G=document.createElement("a");G.href=z,G.download=`forest-workshop-${b.state.settings.worldName}-${x.exportedAt.slice(0,10)}.json`,document.body.append(G),G.click(),G.remove(),setTimeout(()=>URL.revokeObjectURL(z),1e4),e.set({notice:{kind:"info",text:"\uBC31\uC5C5 \uD30C\uC77C\uC744 \uC800\uC7A5\uD588\uC2B5\uB2C8\uB2E4. \uBE44\uBC00\uD0A4\uB294 \uB4E4\uC5B4 \uC788\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4."}})},async selectRestoreFile(b){let x;try{x=JSON.parse(await b.text())}catch{e.set({restore:null,notice:{kind:"error",text:"\uBC31\uC5C5 \uD30C\uC77C\uC744 \uC77D\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4. JSON \uBC31\uC5C5 \uD30C\uC77C\uC744 \uACE8\uB77C \uC8FC\uC138\uC694."}});return}let N=st(x);if(!N.ok){e.set({restore:null,notice:{kind:"error",text:N.message}});return}e.set({notice:null,restore:{fileName:b.name,signature:`${b.name}:${b.size}:${b.lastModified}`,backup:x,summary:N.summary}})},cancelRestore(){e.set({restore:null})},async confirmRestore(){let b=e.get().restore;if(!b)return;let x=l("restore",b.signature,Q),N=await c("restore",()=>M.restore(x,b.backup),"\uBC31\uC5C5\uC744 \uBCF5\uC6D0\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.");N&&(h(N,N.content),e.set({route:"home",restore:null,notice:{kind:"info",text:`\uBC31\uC5C5\uC744 \uC0C8 \uC138\uACC4 '${N.state.settings.worldName}'(\uC73C)\uB85C \uBCF5\uC6D0\uD588\uC2B5\uB2C8\uB2E4. \uAE30\uC874 \uC138\uACC4\uB294 \uADF8\uB300\uB85C\uC785\uB2C8\uB2E4.`}}))}}}function ne(e){return bt(e.seasonChoice)}function Et(e){return Be(ne(e)).filter(({path:r})=>e.artReady.includes(r)).map(({flag:r})=>` ${r}`).join("")}function Wt(e){return e.route==="residents"?e.residentsView.detailOpen?`residents:detail:${e.residentsView.selectedId}`:`residents:list:${e.residentsView.page??0}`:e.route==="work"?`work:${e.work.facilityId}:${e.work.section??"status"}`:e.route}function t(e,r={},a=[]){let n=document.createElement(e);r.className&&(n.className=r.className),r.text!==void 0&&(n.textContent=r.text);for(let[i,o]of Object.entries(r.attrs??{}))o!==void 0&&n.setAttribute(i,o);for(let[i,o]of Object.entries(r.on??{}))o&&n.addEventListener(i,o);r.disabled!==void 0&&"disabled"in n&&(n.disabled=r.disabled);for(let i of a)i==null||i===!1||n.append(typeof i=="string"?document.createTextNode(i):i);return n}function y(e,r,a={}){return t("button",{className:a.variant==="secondary"?"button secondary":"button",text:e,attrs:{type:"button",...a.attrs},disabled:a.disabled,on:{click:r}})}function C(e){return t("p",{className:"muted",text:e,attrs:{role:"status"}})}function _(e){return t("p",{className:"error",text:e,attrs:{role:"alert"}})}function _e(e){return e>=1024*1024?`${(e/(1024*1024)).toFixed(1)}MiB`:e>=1024?`${Math.round(e/1024)}KiB`:`${e}B`}var He="http://www.w3.org/2000/svg";function v(e){return(r="icon")=>{let a=document.createElementNS(He,"svg");a.setAttribute("viewBox","0 0 24 24"),a.setAttribute("aria-hidden","true"),a.setAttribute("focusable","false"),a.setAttribute("class",r);for(let n of e){let i=typeof n=="string"?{d:n}:n,o=i.circle?document.createElementNS(He,"circle"):document.createElementNS(He,"path");i.circle?(o.setAttribute("cx",String(i.circle[0])),o.setAttribute("cy",String(i.circle[1])),o.setAttribute("r",String(i.circle[2]))):o.setAttribute("d",i.d??""),i.fill&&o.setAttribute("class","fill"),a.append(o)}return a}}var d={back:v(["M15 5l-7 7 7 7"]),chevron:v(["M9 5l7 7-7 7"]),gear:v([{circle:[12,12,3.2]},"M19.4 13.5l1.6 1.2-2 3.4-1.9-.7a7.6 7.6 0 0 1-2 1.2l-.3 2h-4l-.3-2a7.6 7.6 0 0 1-2-1.2l-1.9.7-2-3.4 1.6-1.2a7.6 7.6 0 0 1 0-3l-1.6-1.2 2-3.4 1.9.7a7.6 7.6 0 0 1 2-1.2l.3-2h4l.3 2a7.6 7.6 0 0 1 2 1.2l1.9-.7 2 3.4-1.6 1.2a7.6 7.6 0 0 1 0 3z"]),lock:v(["M7 11V8a5 5 0 0 1 10 0v3","M5.5 11h13v9h-13z"]),home:v(["M3.5 11.5L12 4l8.5 7.5","M6 10v10h12V10","M10 20v-5h4v5"]),hammer:v(["M14 4l6 6-2.5 2.5-6-6z","M12.5 8.5L4 17l3 3 8.5-8.5"]),compass:v([{circle:[12,12,8.5]},"M15.5 8.5l-2 5-5 2 2-5z"]),residents:v([{circle:[9,9,3.2]},{circle:[16.5,10,2.6]},"M3.5 19c.8-3.2 3-5 5.5-5s4.7 1.8 5.5 5","M14.5 15.5c2.6-.6 5 .8 6 3.5"]),ticket:v(["M4 7h16v3a2 2 0 0 0 0 4v3H4v-3a2 2 0 0 0 0-4z","M10 9.5c1.5 0 3 1 3 2.5s-1.5 2.5-3 2.5"]),mail:v(["M4 6.5h16v11H4z","M4.5 7l7.5 6 7.5-6"]),weather:v(["M7 18h10a3.5 3.5 0 0 0 .4-7A5 5 0 0 0 7.8 10 4 4 0 0 0 7 18z"]),clock:v([{circle:[12,12,8.5]},"M12 7.5V12l3 2"]),info:v([{circle:[12,12,8.5]},"M12 11v5.5","M12 7.6v.4"]),check:v(["M5 12.5l4.5 4.5L19 7.5"]),eye:v(["M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z",{circle:[12,12,2.8]}]),image:v(["M4 5h16v14H4z",{circle:[9,10,1.6]},"M4.5 17l5-5 4 4 2.5-2.5 3.5 3.5"]),landscape:v(["M4 5h16v14H4z","M4.5 17l5.5-6 4 4 2-2 3.5 4"]),document:v(["M7 3.5h7l4 4V20.5H7z","M14 3.5v4h4","M9.5 12h6","M9.5 15.5h6"]),folder:v(["M3.5 7h6l2 2h9v10h-17z"]),book:v(["M12 6.5c-2-1.3-4.7-1.6-8-1v13c3.3-.6 6-.3 8 1 2-1.3 4.7-1.6 8-1v-13c-3.3-.6-6-.3-8 1z","M12 6.5v13"]),flower:v([{circle:[12,12,2.4]},{circle:[12,6.5,2.6]},{circle:[17.2,10.3,2.6]},{circle:[15.2,16.5,2.6]},{circle:[8.8,16.5,2.6]},{circle:[6.8,10.3,2.6]}]),people:v([{circle:[8,8.5,2.8]},{circle:[16,8.5,2.8]},"M3 19c.6-3 2.5-4.6 5-4.6s4.4 1.6 5 4.6","M11 19c.6-3 2.5-4.6 5-4.6s4.4 1.6 5 4.6"]),pair:v([{circle:[9,12,4.5]},{circle:[15,12,4.5]}]),upload:v(["M12 15.5V4.5","M7.5 9l4.5-4.5L16.5 9","M5 14v5.5h14V14"]),download:v(["M12 4.5v11","M7.5 11l4.5 4.5 4.5-4.5","M5 14v5.5h14V14"]),restore:v(["M4.5 12a7.5 7.5 0 1 0 2.2-5.3","M4.5 4.5v4h4"]),leaf:v(["M5 19c0-8 5-13 14-14-1 9-6 14-14 14z","M5 19l7-7"]),sprout:v(["M12 20v-8","M12 12c0-3.5-2.5-6-6.5-6 0 3.5 2.5 6 6.5 6z","M12 12c0-3.5 2.5-6 6.5-6 0 3.5-2.5 6-6.5 6z"]),search:v([{circle:[10.5,10.5,6]},"M15 15l5 5"]),jar:v(["M8 4.5h8v3H8z","M7 7.5h10l1 3v8a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-8z","M9 14h6"]),box:v(["M3.5 8l8.5-4 8.5 4v9l-8.5 4-8.5-4z","M3.5 8l8.5 4 8.5-4","M12 12v9"]),house:v(["M4 11l8-6.5 8 6.5","M6.5 9.5V19h11V9.5","M10.5 19v-4.5h3V19"]),pencil:v(["M15.5 4.5l4 4L9 19H5v-4z","M13.5 6.5l4 4"]),swap:v(["M5 9h12l-3-3","M19 15H7l3 3"]),minus:v(["M6 12h12"]),plus:v(["M6 12h12","M12 6v12"]),grip:v([{circle:[9,7,1.2],fill:!0},{circle:[15,7,1.2],fill:!0},{circle:[9,12,1.2],fill:!0},{circle:[15,12,1.2],fill:!0},{circle:[9,17,1.2],fill:!0},{circle:[15,17,1.2],fill:!0}]),menu:v(["M5 8h14","M5 12h14","M5 16h14"]),filter:v(["M4 5.5h16l-6 7.5v5.5l-4 1.5v-7z"]),heart:v(["M12 19s-7-4.4-7-9.5A4 4 0 0 1 12 7a4 4 0 0 1 7 2.5C19 14.6 12 19 12 19z"]),sparkle:v(["M12 4l1.8 5.2L19 11l-5.2 1.8L12 18l-1.8-5.2L5 11l5.2-1.8z"]),zoom:v([{circle:[10.5,10.5,6]},"M15 15l5 5","M10.5 8v5","M8 10.5h5"]),arrows:v(["M4 12h16","M7.5 8.5L4 12l3.5 3.5","M16.5 8.5L20 12l-3.5 3.5"]),updown:v(["M12 4v16","M8.5 7.5L12 4l3.5 3.5","M8.5 16.5L12 20l3.5-3.5"]),archive:v(["M3.5 5h17v4h-17z","M5 9v10h14V9","M10 13h4"]),berry:v([{circle:[9,13,3.6]},{circle:[15,13,3.6]},{circle:[12,17.5,3.6]},"M12 9.5V5","M12 6.5c1.5-1.8 3.5-2 5-1.5"]),log:v([{circle:[7.5,12,3.8]},"M7.5 8.2h11a3.8 3.8 0 0 1 0 7.6h-11",{circle:[7.5,12,1.3]}]),hourglass:v(["M7 4h10","M7 20h10","M8 4c0 5 8 5 8 8s-8 3-8 8","M16 4c0 5-8 5-8 8s8 3 8 8"]),up:v(["M6 15l6-6 6 6"]),down:v(["M6 9l6 6 6-6"]),addImage:v(["M6 3.5h8l4 4v13H6z","M14 3.5v4h4","M9 16l2.5-3 2 2 1-1.2",{circle:[17.5,17.5,3.5]},"M17.5 16v3","M16 17.5h3"]),acorn:v(["M6 10.5h12a6 6 0 0 1-12 0z","M5.5 10.5c0-3 3-4.5 6.5-4.5s6.5 1.5 6.5 4.5z","M12 6V3.5"]),pinecone:v(["M12 3.5c3.5 3 5 6.5 5 10a5 5 0 0 1-10 0c0-3.5 1.5-7 5-10z","M8 11h8","M7.5 15h9","M10 7.5h4"]),feather:v(["M19 4.5C11 5 6 10 5.5 19.5","M19 4.5c.5 7-4 12-11 12.5","M9 14l4-4"]),pumpkin:v(["M12 7.5c-4.5 0-7 2.8-7 6s2.5 6 7 6 7-2.8 7-6-2.5-6-7-6z","M12 7.5v12","M12 7.5c0-2 1-3.5 2.5-4"]),candle:v(["M9 9.5h6v10.5H9z","M12 9.5V7","M12 3.5c1.3 1.3 1.3 2.7 0 3.5-1.3-.8-1.3-2.2 0-3.5z"]),cup:v(["M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5z","M16 10.5h1.5a2.5 2.5 0 0 1 0 5H16","M9 4.5c0 1.5 1 1.5 1 3","M12.5 4.5c0 1.5 1 1.5 1 3"]),cake:v(["M5 12h14v8H5z","M5 15.5c2.3 1.4 4.7 1.4 7 0s4.7-1.4 7 0","M12 12V8.5",{circle:[12,6.5,1.4]}]),scarf:v(["M6 5h12v5H6z","M13 10v9l3-1V10","M8 7.5h1M11 7.5h1M14 7.5h1"]),wheat:v(["M12 20.5V7","M12 7c-2 0-3-1.5-3-3.5 2 0 3 1.5 3 3.5zM12 7c2 0 3-1.5 3-3.5-2 0-3 1.5-3 3.5z","M12 12c-2 0-3-1.5-3-3.5 2 0 3 1.5 3 3.5zM12 12c2 0 3-1.5 3-3.5-2 0-3 1.5-3 3.5z","M12 17c-2 0-3-1.5-3-3.5 2 0 3 1.5 3 3.5zM12 17c2 0 3-1.5 3-3.5-2 0-3 1.5-3 3.5z"]),clover:v([{circle:[9.5,9.5,2.8]},{circle:[14.5,9.5,2.8]},{circle:[9.5,14.5,2.8]},{circle:[14.5,14.5,2.8]},"M14 17l3.5 4"]),spool:v(["M7 4.5h10","M7 19.5h10","M9 4.5v15","M15 4.5v15","M9 8l6 3M9 12l6 3"]),mushroom:v(["M4.5 12a7.5 7.5 0 0 1 15 0z","M10 12v6.5a2 2 0 0 0 4 0V12"])};function F(e,r,a,n=""){return t("div",{className:"sheet-backdrop"},[t("section",{className:`sheet card ${n}`.trim(),attrs:{role:"dialog","aria-modal":"true","aria-labelledby":e}},[t("h2",{className:"section-title",text:r,attrs:{id:e}}),...a])])}function ie(e,r,a,n,i={}){let o=Math.min(n,Math.max(a,r)),s=t("output",{className:"step-value big",text:String(o),attrs:{id:e,"aria-live":"polite",...i.label?{"aria-label":i.label}:{}}}),l=c=>t("button",{className:"step",text:c>0?`+${c}`:String(c),attrs:{type:"button","aria-label":`${i.label??""} ${c>0?"\uB298\uB9AC\uAE30":"\uC904\uC774\uAE30"} ${Math.abs(c)}`.trim()},on:{click:()=>{o=Math.min(n,Math.max(a,o+c)),s.textContent=String(o),i.onChange?.(o)}}}),p=i.small?[l(-1),s,l(1)]:[l(-10),l(-1),s,l(1),l(10)];return{node:t("div",{className:`stepper wide${i.small?" compact":""}`},p),read:()=>o}}var ta={"wild-berry":d.berry,herb:d.leaf,wood:d.log,pinecone:d.pinecone,acorn:d.acorn,wheat:d.wheat,flower:d.flower,pumpkin:d.pumpkin,cotton:d.weather,"tea-leaf":d.sprout,honey:d.jar,mushroom:d.mushroom,beeswax:d.box,feather:d.feather,clover:d.clover,"berry-jam":d.jar,"dried-herb":d.leaf,flour:d.box,plank:d.log,thread:d.spool,"herb-tea":d.cup,"pumpkin-puree":d.pumpkin,"acorn-flour":d.acorn,"herb-sachet":d.heart,"berry-pie":d.cake,"wooden-tray":d.log,"beeswax-candle":d.candle,"knit-scarf":d.scarf,"flower-wreath":d.flower,"pumpkin-soup":d.cup,"honey-cake":d.cake,birdhouse:d.house,"acorn-cookie":d.acorn,"tea-gift":d.clover},J={gather:"\uCC44\uC9D1",grow:"\uC7AC\uBC30",survey:"\uC870\uC0AC",process:"\uAC00\uACF5",craft:"\uC81C\uC791"},ce={gather:d.leaf,grow:d.sprout,survey:d.search,process:d.jar,craft:d.hammer};function j(e,r){return e?.items.find(a=>a.id===r)?.name??r}function ra(e,r="icon"){return(ta[e]??d.box)(r)}function W(e,r="small"){return t("span",{className:`item-tile ${r} item-${e}`,attrs:{"aria-hidden":"true"}},[ae(xt(e),{className:"item-art",lazy:!0,fallback:()=>ra(e,"icon")})])}function ue(e,r="big"){return ae(yt[e]??null,{className:`facility-image ${r}`,fallback:()=>d.house(`icon ${r}`)})}function Z(e,r){return e?.recipes.find(a=>a.id===r)??null}function Y(e,r){return e?.facilities.find(a=>a.id===r)??null}function fe(e){let r=Math.max(0,Math.ceil(e/1e3)),a=Math.floor(r/3600),n=Math.floor(r%3600/60),i=r%60,o=s=>String(s).padStart(2,"0");return a?`${a}:${o(n)}:${o(i)}`:`${o(n)}:${o(i)}`}function ge(e){let r=e/36e5;return r>=10||Number.isInteger(r)?`${Math.floor(r)}`:r.toFixed(1)}function Pt(e,r,a,n=0){return Math.max(6e4,Math.round(r.minutes*6e4/(1+e.production.speedBonusPerLevel*(a-1)+n)))}function ee(e,r){let a=Math.min(e.crew.maxBreakthrough,Math.max(0,r));return Math.round((e.crew.passiveBase+e.crew.passivePerBreakthrough*a)*1e3)/1e3}function te(e,r,a){let n=new Set(Object.values(r.production.facilities).map(u=>u.residentId).filter(u=>u!==null)),i=Object.values(r.pairs).filter(u=>!u.archived&&u.residentIds.every(h=>n.has(h))).length,o=Math.min(e.crew.setBonusMax,Math.round(e.crew.setBonusPerPair*i*1e3)/1e3),s=r.production.facilities[a]?.residentId??null,l=s?r.residents[s]:void 0,p=l!==void 0&&l.field===Y(e,a)?.field,c=p?ee(e,l.breakthrough):0,m=p?re(e,l.talentId)??null:null;return{resident:l??null,matches:p,passive:c,set:o,talent:m,total:Math.round((c+o)*1e3)/1e3}}function re(e,r){return e?.talents.find(a=>a.id===r)}function Ce(e,r){let a={...e.inputs},n=r.total,i=r.talent?.effect,o=!1;return i&&i.recipeId===e.id&&(o=!0,i.kind==="speed"?n+=i.bonus:a[i.itemId]!==void 0&&(a[i.itemId]=Math.max(1,a[i.itemId]-i.amount))),{extraBonus:Math.round(n*1e3)/1e3,inputs:a,talentApplies:o}}function O(e){return`${Math.round(e*1e3)/10}%`}function jt(e,r,a){let n=Y(e,a)?.unlock;if(!n)return[];let i=[];if(n.facilityLevel){let o=r.production.facilities[n.facilityLevel.facilityId],s=o?.unlocked?o.level:0,l=n.facilityLevel.level,p=Y(e,n.facilityLevel.facilityId)?.name??"";i.push({text:`${p} Lv. ${l} \uC774\uC0C1`,have:s,need:l,met:s>=l})}if(n.made){let o=r.production.made[n.made.itemId]??0,s=n.made.amount;i.push({text:`${j(e,n.made.itemId)} ${s}\uAC1C \uB9CC\uB4E4\uAE30`,have:o,need:s,met:o>=s})}return i}function Ot(e,r){return e.production.queueSlotLevels.filter(a=>r>=a).length}function be(e,r){return Math.round((e?.production.speedBonusPerLevel??0)*(r-1)*100)}function aa(e,r,a){return e.worldReceivedAt+(a.endsSim-r.state.production.simMs)}function he(e,r,a){let n=aa(e,r,a),i=a.endsSim-a.startedSim,o=t("span",{className:"bar-fill",attrs:{"data-progress-end":String(n),"data-progress-total":String(i)}}),s=Math.max(0,n-Date.now());return o.style.width=`${Math.round((i-s)/Math.max(1,i)*100)}%`,{bar:t("span",{className:"bar teal"},[o]),countdown:t("span",{className:"countdown",text:fe(s),attrs:{"data-countdown-end":String(n)}})}}function Bt(e,r){if(!r)return"";if(r.reason==="no_rules")return"\uCF1C \uB454 \uC6B4\uC601 \uADDC\uCE59\uC774 \uC5C6\uC5B4 \uC26C\uACE0 \uC788\uC5B4\uC694.";if(r.reason==="target_reached")return"\uBAA8\uB4E0 \uBAA9\uD45C \uC7AC\uACE0\uB97C \uCC44\uC6CC \uC26C\uACE0 \uC788\uC5B4\uC694. \uC7AC\uACE0\uAC00 \uC904\uBA74 \uB2E4\uC2DC \uC2DC\uC791\uD574\uC694.";if(r.reason==="queue_empty")return"\uC9C0\uC815 \uD69F\uC218 \uB300\uAE30\uC5F4\uC774 \uBE44\uC5B4 \uC26C\uACE0 \uC788\uC5B4\uC694.";if(r.reason==="locked")return"\uC544\uC9C1 \uC5F4\uB9AC\uC9C0 \uC54A\uC740 \uC2DC\uC124\uC774\uC5D0\uC694.";let a=j(e,r.itemId??""),n=r.protectedAmount?` (\uBCF4\uD638 ${r.protectedAmount}\uAC1C\uB294 \uC4F0\uC9C0 \uC54A\uC544\uC694)`:"";return`${a}\uC774(\uAC00) \uBD80\uC871\uD574 \uAE30\uB2E4\uB9AC\uB294 \uC911: \uD55C \uBC88\uC5D0 ${r.needed??"?"}\uAC1C \uD544\uC694, \uC4F8 \uC218 \uC788\uB294 \uC591 ${r.usable??0}\uAC1C${n}.`}function na(e,r,a,n,i){let o=e.content,s=c=>Math.max(0,(r.state.inventory[c]??0)-(r.state.production.protectedStock[c]??0)),l=Object.entries(a.items).every(([c,m])=>s(c)>=m),p=!!e.busy[`deliver:${a.id}`];return t("li",{className:`order${n?" done":""}`},[t("strong",{className:"order-title",text:a.title}),t("ul",{className:"order-items"},Object.entries(a.items).map(([c,m])=>t("li",{className:s(c)>=m?"enough":"short"},[W(c),t("span",{text:`${j(o,c)} ${m}`}),t("small",{className:"muted",text:`\uC4F8 \uC218 \uC788\uB294 \uC591 ${s(c)}`})]))),t("p",{className:"order-reward"},[d.ticket("icon tiny"),` \uCD08\uB300\uAD8C ${a.reward.tickets}\uC7A5 \xB7 ${a.reward.gold} G`]),n?t("span",{className:"status-pill done",text:"\uB0A9\uD488 \uC644\uB8CC"}):y(p?"\uB0A9\uD488\uD558\uB294 \uC911\u2026":l?"\uB0A9\uD488\uD558\uAE30":"\uC7AC\uB8CC\uAC00 \uBD80\uC871\uD574\uC694",()=>{i.deliver(a.id)},{disabled:p||!l,variant:l?void 0:"secondary"})])}function Vt(e,r){let a=e.world?.state==="ready"?e.world.value:null,n=e.deliveries,i=!a||!n||n.state==="loading"?[C("\uC624\uB298\uC758 \uB0A9\uD488 \uC758\uB8B0\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026")]:n.state==="error"?[_(n.message)]:[t("p",{className:"muted",text:"\uC758\uB8B0\uB294 \uD558\uB8E8(UTC \uAE30\uC900)\uB9C8\uB2E4 \uBC14\uB00C\uC5B4\uC694. \uC9C0\uB09C \uB0A0\uC758 \uC758\uB8B0\uB294 \uBAA8\uC544 \uB450\uC9C0 \uC54A\uC544\uC694. \uBCF4\uD638\uD55C \uC7AC\uACE0\uB294 \uB0A9\uD488\uD558\uC9C0 \uC54A\uC544\uC694."}),t("ul",{className:"order-list"},n.value.orders.map(o=>na(e,a,o,n.value.done.includes(o.id),r)))];return F("fw-deliveries","\uCD08\uB300\uAD8C \uBC1B\uAE30 \xB7 \uC624\uB298\uC758 \uB0A9\uD488",[...i,y("\uB2EB\uAE30",()=>r.closeSheet(),{variant:"secondary",attrs:{"data-wide":""}})])}function Ue(e){return t("span",{className:"lock-tag",attrs:{"aria-hidden":"true"}},[d.lock("icon tiny"),"\uC900\uBE44 \uC911"])}function H(e,r,a){let n=xe(r)||!a.onOpen;return t("button",{className:`${a.className}${n?" is-locked":""}`,attrs:{type:"button","aria-label":n?`${a.label} (\uC900\uBE44 \uC911)`:a.label},on:{click:()=>n?e.notifyLocked(r):a.onOpen?.()}},[...a.children,n?Ue(r):null])}var ia=[{label:"\uD648",icon:d.home,routes:["home","settings","backup","diagnostics"]},{label:"\uC791\uC5C5",icon:d.hammer,routes:["work","facilities"]},{label:"\uD0D0\uC0AC",icon:d.compass,routes:["explore","story"]},{label:"\uC8FC\uBBFC",icon:d.residents,routes:["residents","relations","resident-image"]},{label:"\uCD08\uB300",icon:d.ticket,routes:["invite"]}];function Ft(e,r){return t("nav",{className:"tabbar",attrs:{"aria-label":"\uACF5\uBC29 \uBA54\uB274"}},ia.map(a=>{let n=a.feature?xe(a.feature):!1,i=a.routes.includes(e.route);return t("button",{className:`tab${i?" current":""}${n?" is-locked":""}`,attrs:{type:"button","aria-current":i?"page":void 0,"aria-label":n?`${a.label} (\uC900\uBE44 \uC911)`:a.label},on:{click:()=>{n&&a.feature?r.notifyLocked(a.feature):a.routes[0]==="residents"?r.openResidents():a.routes[0]&&r.navigate(a.routes[0])}}},[t("span",{className:"tab-icon"},[a.icon("icon tab-glyph"),n&&a.feature?Ue(a.feature):null]),t("span",{className:"tab-label",text:a.label})])}))}function oa(e){if(!document.fullscreenEnabled)return null;let r=t("button",{className:"fullscreen-toggle",text:document.fullscreenElement?"\uC804\uCCB4 \uD654\uBA74 \uC885\uB8CC":"\uC804\uCCB4 \uD654\uBA74",attrs:{type:"button"},on:{click:()=>{let a=r.getRootNode(),n=a instanceof ShadowRoot?a.host:r.closest(".shell");if(!n)return;(document.fullscreenElement?document.exitFullscreen():n.requestFullscreen()).then(()=>{r.textContent=document.fullscreenElement?"\uC804\uCCB4 \uD654\uBA74 \uC885\uB8CC":"\uC804\uCCB4 \uD654\uBA74"}).catch(()=>e.notify("\uC774 \uD658\uACBD\uC5D0\uC11C\uB294 \uC804\uCCB4 \uD654\uBA74\uC744 \uC5F4 \uC218 \uC5C6\uC5B4\uC694."))}}});return r}function sa(e,r){let n=(e.world?.state==="ready"?e.world.value:null)?.state.wallet.tickets??0;return t("button",{className:"counter ticket",attrs:{type:"button","aria-label":`\uCD08\uB300\uAD8C ${n}\uC7A5 \u2014 \uCD08\uB300\uAD8C \uBC1B\uAE30`},on:{click:()=>r.openDeliveries()}},[t("span",{className:"ticket-mark"},[d.ticket("icon")]),t("span",{className:"counter-value",text:String(n)})])}function Dt(e,r){let a=e.world?.state==="ready"?e.world.value:null;if(!a)return null;let n=a.state.wallet.gold.toLocaleString("ko-KR");return t("div",{className:"resources"},[t("span",{className:"counter gold",attrs:{"aria-label":`\uACE8\uB4DC ${n}`}},[t("span",{className:"coin",attrs:{"aria-hidden":"true"}}),t("span",{className:"counter-value",text:n})]),sa(e,r),e.route==="settings"?null:t("button",{className:"icon-button gear",attrs:{type:"button","aria-label":"\uC124\uC815"},on:{click:()=>r.navigate("settings")}},[d.gear()])])}function Gt(e,r,a){if(a.kind==="home")return t("header",{className:"top top-home"},[t("div",{className:"top-row"},[t("h1",{className:"sign sign-home",text:"\uC232\uACB0 \uACF5\uBC29",attrs:{id:"fw-screen-title"}}),Dt(e,r)]),t("div",{className:"top-row second"},[H(r,"weather",{className:"chip-button weather",label:"\uD604\uC2E4 \uB0A0\uC528",children:[d.weather(),t("span",{text:"\uB0A0\uC528"})]}),oa(r),H(r,"mail",{className:"icon-button mail",label:"\uC6B0\uD3B8\uD568",children:[d.mail()]})])]);let n=a.back;return t("header",{className:`top top-sub${a.resources||a.counters?" with-resources":""}`},[t("div",{className:"top-row"},[n?t("button",{className:"back-button",attrs:{type:"button","aria-label":`${n.label}(\uC73C)\uB85C \uB3CC\uC544\uAC00\uAE30`},on:{click:()=>r.navigate(n.route)}},[d.back()]):t("span",{className:"back-spacer",attrs:{"aria-hidden":"true"}}),t("h1",{className:"sign",text:a.title,attrs:{id:"fw-screen-title"}}),a.resources?Dt(e,r):a.counters??null]),a.subtitle?t("p",{className:"ribbon",text:a.subtitle}):null])}function la(e,r){return e.notice?t("div",{className:`notice ${e.notice.kind}`,attrs:{role:e.notice.kind==="error"?"alert":"status"}},[t("p",{text:e.notice.text}),t("button",{className:"notice-close",text:"\uB2EB\uAE30",attrs:{type:"button","aria-label":"\uC54C\uB9BC \uB2EB\uAE30"},on:{click:()=>r.dismissNotice()}})]):null}function I(e,r,a){return t("div",{className:`shell backdrop-${a.backdrop} season-${ne(e)}${Et(e)}${a.nav?" has-nav":""}${a.homeLayout?" home-layout":""}${e.notice?" has-notice":""}`},[t("div",{className:"scroll"},[t("div",{className:"column"},[Gt(e,r,a.top),a.hero??null,t("main",{className:"page",attrs:{"aria-labelledby":"fw-screen-title"}},a.body)])]),la(e,r),a.nav?Ft(e,r):null,a.sheet??(e.sheet?.kind==="deliveries"?Vt(e,r):null)])}function S(e,r,a={}){return t("section",{className:`card ${a.className??""}`.trim(),attrs:a.id?{"aria-labelledby":a.id}:{}},[e?t("h2",{className:"section-title",text:e,attrs:a.id?{id:a.id}:{}}):null,...r])}var Ie="/forest-workshop/p0",da={pass:"\uD1B5\uACFC",fail:"\uC2E4\uD328",unavailable:"\uC0AC\uC6A9 \uBD88\uAC00"};function k(e,r={},a=[]){let n=document.createElement(e);r.className&&(n.className=r.className),r.text!==void 0&&(n.textContent=r.text);for(let[i,o]of Object.entries(r.attrs??{}))n.setAttribute(i,o);for(let i of a)i&&n.append(i);return n}var Re=class{constructor(){A(this,"node",k("div",{className:"diagnostics"}));A(this,"started",!1);A(this,"status",{state:"loading"});A(this,"probe",null);A(this,"image",{state:"loading"});A(this,"uploading",!1);A(this,"uploadError",null);A(this,"pendingUpload",null)}start(){this.started||(this.started=!0,this.render(),this.loadStatus(),this.loadImage())}async loadStatus(){this.status={state:"loading"},this.render();try{this.status={state:"ready",value:await T().get(`${Ie}/status`)}}catch(r){this.status={state:"error",message:P(r,"\uD328\uD0A4\uC9C0 \uC0C1\uD0DC\uB97C \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.")}}this.render()}async loadImage(){this.image={state:"loading"},this.render();try{let r=await T().get(`${Ie}/image`);this.image={state:"ready",value:r.current}}catch(r){this.image={state:"error",message:P(r,"\uC800\uC7A5\uB41C \uADF8\uB9BC\uC744 \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.")}}this.render()}async runProbe(){if(this.probe?.state!=="loading"){this.probe={state:"loading"},this.render();try{let r=await T().post(`${Ie}/probe`);this.probe={state:"ready",value:r.checks}}catch(r){this.probe={state:"error",message:P(r,"\uC5F0\uACB0 \uC810\uAC80\uC744 \uC2E4\uD589\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.")}}this.render()}}async upload(r){if(this.uploading)return;let a=this.pendingUpload?.file===r?this.pendingUpload:{file:r,key:ye()};this.pendingUpload=a,this.uploading=!0,this.uploadError=null,this.render();try{let n=new FormData;n.append("uploadKey",a.key),n.append("file",r,r.name);let i=await T().upload(`${Ie}/image`,n);this.image={state:"ready",value:i.image},this.pendingUpload=null}catch(n){this.uploadError=P(n,"\uADF8\uB9BC\uC744 \uC62C\uB9AC\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4. \uAE30\uC874 \uADF8\uB9BC\uC740 \uADF8\uB300\uB85C\uC785\uB2C8\uB2E4.")}finally{this.uploading=!1,this.render()}}render(){this.node.replaceChildren(k("p",{className:"muted",text:"\uC5D4\uC9C4 \uC5F0\uACB0\uACFC \uC8FC\uBBFC \uADF8\uB9BC \uC800\uC7A5 \uACBD\uB85C\uB97C \uD655\uC778\uD569\uB2C8\uB2E4. \uACB0\uACFC\uB294 \uC138\uACC4\uC5D0 \uC601\uD5A5\uC744 \uC8FC\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4."}),this.renderStatus(),this.renderProbe(),this.renderImage())}retryButton(r,a){let n=k("button",{className:"button secondary",text:r,attrs:{type:"button"}});return n.addEventListener("click",a),n}renderStatus(){let r=k("section",{className:"card",attrs:{"aria-labelledby":"fw-status"}},[k("h2",{text:"\uC5D4\uC9C4 \uC5F0\uACB0",attrs:{id:"fw-status"}})]);if(this.status.state==="loading")r.append(k("p",{className:"muted",text:"\uBD88\uB7EC\uC624\uB294 \uC911\u2026",attrs:{role:"status"}}));else if(this.status.state==="error")r.append(k("p",{className:"error",text:this.status.message,attrs:{role:"alert"}}),this.retryButton("\uB2E4\uC2DC \uC2DC\uB3C4",()=>{this.loadStatus()}));else{let{value:a}=this.status;r.append(k("p",{className:"muted",text:`\uD328\uD0A4\uC9C0 ${a.version} \xB7 \uB2E8\uACC4 ${a.stage}`}),k("ul",{className:"list"},a.host.map(n=>k("li",{className:"row"},[k("span",{className:"name",text:n.name}),k("span",{className:`badge ${n.available?"pass":n.required?"fail":"unavailable"}`,text:n.available?"\uC788\uC74C":n.required?"\uC5C6\uC74C (\uD544\uC218)":"\uC5C6\uC74C"})]))))}return r}renderProbe(){let r=k("button",{className:"button",text:this.probe?.state==="loading"?"\uC810\uAC80 \uC911\u2026":"\uC5F0\uACB0 \uC810\uAC80 \uC2E4\uD589",attrs:{type:"button"}});r.disabled=this.probe?.state==="loading",r.addEventListener("click",()=>{this.runProbe()});let a=k("section",{className:"card",attrs:{"aria-labelledby":"fw-probe"}},[k("h2",{text:"\uC800\uC7A5\xB7\uC790\uB8CC\xB7\uBAA8\uB378 \uC810\uAC80",attrs:{id:"fw-probe"}}),k("p",{className:"muted",text:"\uC784\uC2DC \uBB38\uC11C\uB97C \uC4F0\uACE0 \uC9C0\uC6C1\uB2C8\uB2E4. \uCE90\uB9AD\uD130\xB7\uD398\uB974\uC18C\uB098 \uC6D0\uBCF8\uC740 \uC77D\uAE30\uB9CC \uD558\uBA70, \uBAA8\uB378 \uC0DD\uC131 \uC694\uCCAD\uC740 \uBCF4\uB0B4\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4."}),r]);return!this.probe||this.probe.state==="loading"?a:this.probe.state==="error"?(a.append(k("p",{className:"error",text:this.probe.message,attrs:{role:"alert"}})),a):(a.append(k("ul",{className:"list",attrs:{"aria-live":"polite"}},this.probe.value.map(n=>k("li",{className:"row stacked"},[k("div",{className:"row-head"},[k("span",{className:"name",text:n.label}),k("span",{className:`badge ${n.status}`,text:da[n.status]})]),k("span",{className:"detail",text:n.detail})])))),a)}renderImage(){let r=k("input",{className:"file",attrs:{type:"file",accept:"image/png,image/webp",id:"fw-file"}});r.disabled=this.uploading,r.addEventListener("change",()=>{let n=r.files?.[0];n&&this.upload(n)});let a=k("section",{className:"card",attrs:{"aria-labelledby":"fw-image"}},[k("h2",{text:"\uC8FC\uBBFC \uADF8\uB9BC \uC800\uC7A5 \uC810\uAC80",attrs:{id:"fw-image"}}),k("p",{className:"muted",text:"PNG \uB610\uB294 \uC815\uC801 WebP(\uCD5C\uB300 20MiB, 4096\xD74096)\uB97C \uACE0\uB974\uBA74 \uD22C\uBA85\uB3C4\uB97C \uC720\uC9C0\uD55C WebP \uD488\uC9C895\uB85C \uBC14\uAFD4 \uC804\uC5ED \uAC24\uB7EC\uB9AC\uC5D0 \uC800\uC7A5\uD569\uB2C8\uB2E4. PNG \uC6D0\uBCF8\uC740 \uBCF4\uAD00\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4."}),k("label",{className:"field-label",text:"\uADF8\uB9BC \uD30C\uC77C \uACE0\uB974\uAE30",attrs:{for:"fw-file"}}),r]);if(this.uploading&&a.append(k("p",{className:"muted",text:"\uBCC0\uD658\uD558\uACE0 \uC800\uC7A5\uD558\uB294 \uC911\u2026",attrs:{role:"status"}})),this.uploadError){a.append(k("p",{className:"error",text:this.uploadError,attrs:{role:"alert"}}));let n=this.pendingUpload;n&&!this.uploading&&a.append(this.retryButton("\uAC19\uC740 \uD30C\uC77C\uB85C \uB2E4\uC2DC \uC2DC\uB3C4",()=>{this.upload(n.file)}))}if(this.image.state==="loading")a.append(k("p",{className:"muted",text:"\uBD88\uB7EC\uC624\uB294 \uC911\u2026",attrs:{role:"status"}}));else if(this.image.state==="error")a.append(k("p",{className:"error",text:this.image.message,attrs:{role:"alert"}}),this.retryButton("\uB2E4\uC2DC \uBD88\uB7EC\uC624\uAE30",()=>{this.loadImage()}));else if(!this.image.value)a.append(k("p",{className:"empty",text:"\uC544\uC9C1 \uC800\uC7A5\uB41C \uADF8\uB9BC\uC774 \uC5C6\uC2B5\uB2C8\uB2E4."}));else{let n=this.image.value,i=k("img",{className:"preview",attrs:{src:`${n.url}${n.url.includes("?")?"&":"?"}v=${n.imageVersion}`,alt:"\uC800\uC7A5\uB41C \uC8FC\uBBFC \uADF8\uB9BC \uBBF8\uB9AC\uBCF4\uAE30",width:String(n.width),height:String(n.height)}});a.append(k("div",{className:"stage"},[i]),k("dl",{className:"facts"},[k("dt",{text:"\uCC38\uC870"}),k("dd",{text:n.reference}),k("dt",{text:"\uD06C\uAE30"}),k("dd",{text:`${n.width}\xD7${n.height}`}),k("dt",{text:"\uC6A9\uB7C9"}),k("dd",{text:`\uC785\uB825 ${_e(n.inputBytes)} \u2192 WebP ${_e(n.outputBytes)}`}),k("dt",{text:"\uD22C\uBA85\uB3C4"}),k("dd",{text:n.hasTransparency?"\uD22C\uBA85 \uC601\uC5ED \uC788\uC74C (\uC720\uC9C0\uB428)":"\uBD88\uD22C\uBA85 \uADF8\uB9BC"}),k("dt",{text:"\uBC84\uC804"}),k("dd",{text:String(n.imageVersion)})]))}return a}};var ca="http://www.w3.org/2000/svg";function qt(e){let r=document.createElementNS(ca,"svg");return r.setAttribute("viewBox","0 0 60 80"),r.setAttribute("aria-hidden","true"),r.setAttribute("class",e),r.innerHTML='<circle cx="30" cy="24" r="15"/><path d="M6 80c0-17 11-29 24-29s24 12 24 29z"/>',r}function _t(e,r){let a=e.image.current;return t("img",{className:r,attrs:{src:`${a.url}${a.url.includes("?")?"&":"?"}v=${encodeURIComponent(a.reference)}`,alt:"",width:String(a.width),height:String(a.height),decoding:"async",draggable:"false"}})}function K(e,r={}){let a=r.placement??e.image.placement,n=t("span",{className:"figure",attrs:{"aria-hidden":"true"}});if(!e.image.current)return n.append(t("span",{className:"figure-empty"},[qt("figure-silhouette"),t("span",{className:"figure-empty-text",text:"PNG \uB4F1\uB85D"})])),n;let i=t("span",{className:"figure-body"},[_t(e,"figure-image")]);if(i.style.height=`${a.scale*.9}%`,i.style.left=`${50+a.offsetX*.5}%`,n.append(i),r.marker){let o=t("span",{className:"figure-marker"},[d.leaf("icon tiny")]);o.style.bottom=`calc(${a.scale*.9}% + ${a.markerHeight*.4}%)`,o.style.left=`${50+a.offsetX*.5}%`,n.append(o)}return n}function L(e,r="small"){let a=t("span",{className:`avatar ${r}`,attrs:{"aria-hidden":"true"}});return e?.image.current?a.append(_t(e,"avatar-image")):(a.append(qt("avatar-silhouette")),e||a.append(t("span",{className:"avatar-unknown",text:"?"}))),a}var we={character:"\uCE90\uB9AD\uD130",persona:"\uD398\uB974\uC18C\uB098"};function q(e){return t("span",{className:`tag ${e.kind}`,text:we[e.kind]})}var pa="http://www.w3.org/2000/svg";function ma(){let e=document.createElementNS(pa,"svg");return e.setAttribute("viewBox","0 0 390 300"),e.setAttribute("preserveAspectRatio","xMidYMax slice"),e.setAttribute("aria-hidden","true"),e.setAttribute("class","scene-art"),e.innerHTML=`
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
    </g>`,e}function ua(e){let r=e.progress.starterResidentId;return Object.values(e.residents).filter(a=>a.recruited).sort((a,n)=>+(n.residentId===r)-+(a.residentId===r)||a.registeredAt.localeCompare(n.registeredAt)).slice(0,2)}function Ht(e,r,a,n){if(r)return t("button",{className:`resident-spot filled ${e}`,attrs:{type:"button","aria-label":`${r.displayName} \uD504\uB85C\uD544 \uBCF4\uAE30`},on:{click:()=>{n.openResidents(r.residentId),n.openSheet({kind:"profile",residentId:r.residentId})}}},[K(r),t("span",{className:"spot-name",text:r.displayName})]);if(a.progress.starterResidentId===null&&e==="left"){let i=Object.keys(a.residents).length>0;return t("button",{className:`resident-spot invite ${e}`,attrs:{type:"button"},on:{click:()=>n.openRegister(i?3:1)}},[t("span",{className:"spot-shadow"}),t("span",{className:"spot-text",text:i?"\uC2DC\uC791 \uC8FC\uBBFC \uACE0\uB974\uAE30":"\uC8FC\uBBFC \uB9DE\uC774\uD558\uAE30"})])}return t("button",{className:`resident-spot ${e}`,attrs:{type:"button","aria-label":"\uBE48 \uC790\uB9AC \u2014 \uCD08\uB300\uB85C \uC0C8 \uC8FC\uBBFC \uB9DE\uC774\uD558\uAE30"},on:{click:()=>n.navigate("invite")}},[t("span",{className:"spot-shadow"}),t("span",{className:"spot-text",text:"\uCD08\uB300"})])}function Ut(e,r){let a=e.world?.state==="ready"?e.world.value.state:null,n=a?ua(a):[];return t("section",{className:"scene",attrs:{"aria-label":"\uACF5\uBC29 \uC7A5\uBA74"}},[ae(se[ne(e)].scene,{className:"scene-art",fallback:ma}),a?t("div",{className:"scene-stage"},[Ht("left",n[0]??null,a,r),Ht("right",n[1]??null,a,r)]):null,n.length===0?t("p",{className:"scene-caption"},[d.leaf("icon tiny"),"\uC8FC\uBBFC\uC744 \uB9DE\uC774\uD558\uBA74 \uC774\uACF3\uC5D0 \uBAA8\uC5EC\uC694"]):null])}function fa(e,r){return e.items.find(a=>a.id===r)?.name??r}function Kt(e,r){let a=e.world?.state==="ready"?e.world.value:null,n=e.content;if(!a||!n||a.state.progress.starterKitClaimed||e.starterSheetHidden)return null;let i=!!e.busy["claim-starter-kit"],o=n.starterKit;return t("div",{className:"sheet-backdrop"},[t("section",{className:"sheet card",attrs:{role:"dialog","aria-modal":"true","aria-labelledby":"fw-starter"}},[t("h2",{className:"section-title",text:"\uACF5\uBC29 \uC2DC\uC791 \uAFB8\uB7EC\uBBF8",attrs:{id:"fw-starter"}}),t("p",{className:"muted",text:"\uCCAB \uCC44\uC9D1\uACFC \uAC00\uACF5\uC744 \uC2DC\uC791\uD560 \uC7AC\uB8CC\uC608\uC694. \uD55C \uBC88\uB9CC \uBC1B\uC744 \uC218 \uC788\uC5B4\uC694."}),t("ul",{className:"kit"},[t("li",{className:"kit-item"},[t("span",{className:"coin"}),t("span",{text:"\uACE8\uB4DC"}),t("strong",{text:o.gold.toLocaleString("ko-KR")})]),o.tickets?t("li",{className:"kit-item"},[d.ticket("icon"),t("span",{text:"\uCD08\uB300\uAD8C"}),t("strong",{text:`${o.tickets}\uC7A5`})]):null,...Object.entries(o.items).map(([s,l])=>t("li",{className:"kit-item"},[d.leaf("icon"),t("span",{text:fa(n,s)}),t("strong",{text:l.toLocaleString("ko-KR")})]))]),y(i?"\uBC1B\uB294 \uC911\u2026":"\uBC1B\uAE30",()=>{r.runCommand("claim-starter-kit","onboarding.claimStarterKit")},{disabled:i,attrs:{"data-wide":""}}),y("\uB098\uC911\uC5D0",()=>r.hideStarterSheet(),{variant:"secondary",attrs:{"data-wide":""}})])])}function Yt(e){let r=e.state.production.reportsReadThrough;return e.state.production.reports.filter(a=>a.reportId>r)}function Ke(e,r){let a={};for(let n of e)for(let[i,o]of Object.entries(n[r]))a[i]=(a[i]??0)+o;return a}function Qt(e){let r=Object.values(e.state.production.facilities);return r.some(a=>a.waiting?.reason==="materials")?"\uC7AC\uB8CC\uB97C \uAE30\uB2E4\uB9AC\uB294 \uC2DC\uC124\uC774 \uC788\uC5B4\uC694":r.some(a=>a.job)?"\uACF5\uBC29\uC774 \uC798 \uB3CC\uC544\uAC00\uACE0 \uC788\uC5B4\uC694":"\uACF5\uBC29\uC774 \uC26C\uACE0 \uC788\uC5B4\uC694"}function Jt(e,r){let a=Yt(e).length;return t("button",{className:"home-summary work-summary",attrs:{type:"button","aria-label":`${Qt(e)} \xB7 ${a?`\uC0C8 \uBCF4\uACE0 ${a}\uAC1C`:"\uC0C8 \uBCF4\uACE0 \uC5C6\uC74C"} \xB7 \uC791\uC5C5 \uBCF4\uACE0 \uC5F4\uAE30`},on:{click:()=>r.openSheet({kind:"work-report"})}},[t("span",{className:"home-summary-copy"},[t("strong",{text:Qt(e)}),t("span",{text:a?`\uC0C8 \uC791\uC5C5 \uBCF4\uACE0 ${a}\uAC1C`:"\uC791\uC5C5 \uBCF4\uACE0 \uBCF4\uAE30"})]),d.chevron("icon")])}function Xt(e,r,a){let n=e.state.production.activity.lastAbsence,i=r?.production.absenceLimitMs??72*36e5;return t("button",{className:"strip offline",attrs:{type:"button"},on:{click:()=>a.notify(n&&n.totalMs>n.creditedMs?`\uC9C0\uB09C\uBC88\uC5D4 ${ge(n.totalMs)}\uC2DC\uAC04 \uBE44\uC6E0\uACE0, \uADF8\uC911 \uCD5C\uB300 72\uC2DC\uAC04\uB9CC \uACF5\uBC29\uC774 \uC77C\uD588\uC5B4\uC694. \uB0A8\uC740 \uC791\uC5C5\uC740 \uBA48\uCD98 \uC790\uB9AC\uC5D0\uC11C \uC774\uC5B4\uC838\uC694.`:"\uC790\uB9AC\uB97C \uBE44\uC6B4 \uB3D9\uC548\uC5D0\uB3C4 \uCD5C\uB300 72\uC2DC\uAC04\uAE4C\uC9C0 \uACF5\uBC29\uC774 \uC77C\uD574\uC694. \uADF8 \uB4A4\uC5D4 \uBA48\uCD98 \uC790\uB9AC\uC5D0\uC11C \uAE30\uB2E4\uB824\uC694.")}},[d.clock(),t("span",{},["\uBBF8\uC811\uC18D \uB204\uC801 ",t("strong",{text:`${n?ge(n.creditedMs):"0"}\uC2DC\uAC04`}),` / \uCD5C\uB300 ${ge(i)}\uC2DC\uAC04`]),d.info("icon muted-icon")])}function ga(e){let r=new Date(e);return Number.isNaN(r.getTime())?e:new Intl.DateTimeFormat("ko-KR",{month:"numeric",day:"numeric",hour:"2-digit",minute:"2-digit",hour12:!1}).format(r)}function pe(e,r,a){let n=Object.entries(r);return n.length?n.map(([i,o])=>`${j(e,i)} ${a}${o}`).join(" \xB7 "):"\uC5C6\uC74C"}function Zt(e,r,a){let n=e.content,i=r.state.production.reports,o=Yt(r),s=!!e.busy["reports-read"];return t("div",{className:"sheet-backdrop"},[t("section",{className:"sheet card",attrs:{role:"dialog","aria-modal":"true","aria-labelledby":"fw-work-report"}},[t("h2",{className:"section-title",text:"\uC791\uC5C5 \uBCF4\uACE0",attrs:{id:"fw-work-report"}}),t("p",{className:"muted",text:"\uB9CC\uB4E0 \uBB3C\uAC74\uC740 \uB9CC\uB4E4\uC5B4\uC9C4 \uC21C\uAC04 \uCC3D\uACE0\uC5D0 \uB4E4\uC5B4\uAC14\uC5B4\uC694. \uBCF4\uACE0\uB97C \uC77D\uC5B4\uB3C4 \uB2E4\uC2DC \uC9C0\uAE09\uB418\uC9C0 \uC54A\uC544\uC694."}),o.length?t("div",{className:"report-total"},[t("p",{},[t("strong",{text:"\uC0C8\uB85C \uB4E4\uC5B4\uC628 \uAC83 "}),pe(n,Ke(o,"produced"),"+")]),t("p",{},[t("strong",{text:"\uC7AC\uB8CC\uB85C \uC4F4 \uAC83 "}),pe(n,Ke(o,"consumed"),"\u2212")]),o.some(l=>l.gold>0)?t("p",{},[t("strong",{text:"\uC790\uB3D9 \uD310\uB9E4 "}),`${pe(n,Ke(o,"sold"),"\u2212")} \u2192 +${o.reduce((l,p)=>l+p.gold,0)} G`]):null]):t("p",{className:"empty",text:"\uC0C8 \uBCF4\uACE0\uAC00 \uC5C6\uC5B4\uC694."}),i.length?t("ol",{className:"report-list"},i.slice(0,10).map(l=>t("li",{className:`report-entry${l.reportId>r.state.production.reportsReadThrough?" new":""}`},[t("span",{className:"report-time",text:`${ga(l.at)}${l.offlineMs?` \xB7 \uBE44\uC6B4 \uB3D9\uC548 ${ge(l.offlineMs)}\uC2DC\uAC04`:""}`}),t("span",{text:[l.runs?`${l.runs}\uD68C \uC644\uB8CC`:"",Object.keys(l.produced).length?`\uB4E4\uC5B4\uC634 ${pe(n,l.produced,"+")}`:"",Object.keys(l.consumed).length?`\uC7AC\uB8CC ${pe(n,l.consumed,"\u2212")}`:"",l.gold?`\uC790\uB3D9 \uD310\uB9E4 ${pe(n,l.sold,"\u2212")} +${l.gold} G`:""].filter(Boolean).join(" \xB7 ")})]))):null,o.length?y(s?"\uD655\uC778\uD558\uB294 \uC911\u2026":"\uD655\uC778",()=>{a.readReports(i[0].reportId)},{disabled:s,attrs:{"data-wide":""}}):null,y("\uB2EB\uAE30",()=>a.closeSheet(),{variant:"secondary",attrs:{"data-wide":""}})])])}function er(e,r){let a=i=>r?.stories.arcs.find(o=>o.id===i)?.title??"\uC774\uC57C\uAE30";for(let i of Object.values(e.stories.pairs)){let o=i.current;if(o?.episodes.some(s=>s.state==="unlocked"))return`\uC0C8 \uC774\uC57C\uAE30\uAC00 \uC5F4\uB838\uC5B4\uC694 \xB7 ${a(o.arcId)}`}let n=e.stories.expedition;if(n){let i=e.stories.pairs[n.pairId]?.current;return`\uD0D0\uD5D8 \uC911 \xB7 ${i?a(i.arcId):"\uC774\uC57C\uAE30 \uD0D0\uD5D8"}`}return Object.keys(e.pairs).length?"\uD0D0\uC0AC\uC5D0\uC11C \uC774\uC57C\uAE30 \uD0D0\uD5D8\uC744 \uB5A0\uB0A0 \uC218 \uC788\uC5B4\uC694":"\uD398\uC5B4\uB97C \uB9CC\uB4E4\uBA74 \uB450 \uC8FC\uBBFC\uC758 \uC774\uC57C\uAE30\uAC00 \uC5F4\uB824\uC694"}function ba(e,r,a){return t("button",{className:"strip story",attrs:{type:"button","aria-label":`\uC8FC\uBBFC \uC774\uC57C\uAE30 \u2014 ${er(e,r)}`},on:{click:()=>a.openExplore()}},[t("span",{className:"story-art",attrs:{"aria-hidden":"true"}},[d.book("icon")]),t("span",{className:"story-text"},[t("strong",{text:"\uC8FC\uBBFC \uC774\uC57C\uAE30"}),t("span",{text:er(e,r)})]),t("span",{className:"round-arrow"},[d.chevron()])])}function tr(e,r){let a=e.world;return!a||a.state!=="ready"?I(e,r,{top:{kind:"home"},backdrop:"forest",nav:!1,body:[a?.state==="error"?S(null,[_(a.message),y("\uC138\uACC4 \uBAA9\uB85D\uC73C\uB85C",()=>r.navigate("worlds"),{variant:"secondary"})]):C("\uC138\uACC4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026")]}):I(e,r,{top:{kind:"home"},backdrop:"forest",hero:Ut(e,r),homeLayout:!0,body:[Jt(a.value,r),ba(a.value.state,e.content,r),Xt(a.value,e.content,r)],nav:!0,sheet:e.sheet?.kind==="work-report"?Zt(e,a.value,r):Kt(e,r)})}var Qe={new:"\uC0C8 \uC8FC\uBBFC",breakthrough:"\uB3CC\uD30C",token:"\uC885\uD45C"};function rr(e,r){return e.outcome==="new"?"\uACF5\uBC29\uC5D0 \uC654\uC5B4\uC694!":e.outcome==="breakthrough"?`\uB3CC\uD30C ${e.breakthrough}/${r}`:"\uCD5C\uB300 \uB3CC\uD30C\uB77C \uC885\uD45C 1\uAC1C\uAC00 \uB410\uC5B4\uC694"}function Ae(e){return y("\uB2EB\uAE30",()=>e.closeSheet(),{variant:"secondary",attrs:{"data-wide":""}})}function ha(e,r,a,n){let i=a.length===1?a[0]:null,o=i?e.state.residents[i.residentId]:null;return F("fw-invite-result",a.length>1?`${a.length}\uD68C \uCD08\uB300 \uACB0\uACFC`:"\uCD08\uB300 \uACB0\uACFC",[i&&o?t("div",{className:"result-hero"},[t("span",{className:"result-stage"},[K(o)]),t("strong",{className:"result-name",text:o.displayName}),t("span",{className:`result-badge ${i.outcome}`,text:Qe[i.outcome]}),t("p",{className:"muted",text:rr(i,r.crew.maxBreakthrough)})]):t("ol",{className:"result-list"},a.map(s=>{let l=e.state.residents[s.residentId];return t("li",{className:`result-row ${s.outcome}`},[L(l??null),t("strong",{text:l?.displayName??"\uC8FC\uBBFC"}),t("span",{className:`result-badge ${s.outcome}`,text:Qe[s.outcome]}),t("small",{className:"muted",text:`${rr(s,r.crew.maxBreakthrough)}${s.via==="guarantee"?" \xB7 \uBCF4\uC7A5":""}`})])})),Ae(n)])}function wa(e,r,a){let n=Object.keys(e.state.residents).sort(),i=e.state.invite.wishResidentId,o=l=>l===i?r.invite.wishWeight:r.invite.baseWeight,s=n.reduce((l,p)=>l+o(p),0);return F("fw-invite-chances","\uD655\uB960 \uBCF4\uAE30",[t("p",{className:"muted",text:`\uB4F1\uB85D\uB41C \uC8FC\uBBFC\uC740 \uBAA8\uB450 \uAC19\uC740 \uD655\uB960\uC774\uC5D0\uC694(\uB4F1\uAE09 \uC5C6\uC74C). \uD76C\uB9DD \uC8FC\uBBFC\uC740 ${r.invite.wishWeight}\uBC30\uB85C \uB9CC\uB098\uC694. \uC0C8 \uC8FC\uBBFC \uC5C6\uC774 ${r.invite.guaranteeAfter}\uBC88\uC774 \uC9C0\uB098\uBA74 \uB2E4\uC74C \uCD08\uB300\uB294 \uC544\uC9C1 \uC624\uC9C0 \uC54A\uC740 \uC8FC\uBBFC\uC774\uC5D0\uC694(\uD76C\uB9DD \uC8FC\uBBFC\uC774 \uAE30\uB2E4\uB9AC\uBA74 \uADF8 \uC8FC\uBBFC). 10\uD68C \uCD08\uB300\uB294 \uD55C \uBC88\uC529 \uCC28\uB840\uB85C \uC801\uC6A9\uB3FC\uC694.`}),n.length===0?t("p",{className:"empty",text:"\uB4F1\uB85D\uB41C \uC8FC\uBBFC\uC774 \uC5C6\uC5B4\uC694."}):t("ul",{className:"chance-list"},n.map(l=>{let p=e.state.residents[l],c=s?o(l)/s*100:0;return t("li",{className:"chance-row"},[L(p),t("span",{className:"chance-name"},[t("strong",{text:p.displayName}),l===i?t("span",{className:"tag wish",text:"\uD76C\uB9DD"}):null]),t("strong",{className:"chance-value",text:`${c.toFixed(c<10?2:1)}%`})])})),t("p",{className:"muted",text:`\uCC98\uC74C \uB9CC\uB098\uBA74 \uC601\uC785, \uB2E4\uC2DC \uB9CC\uB098\uBA74 \uB3CC\uD30C(\uCD5C\uB300 ${r.crew.maxBreakthrough}), \uCD5C\uB300 \uB3CC\uD30C \uB4A4\uC5D0\uB294 \uC885\uD45C 1\uAC1C. \uC885\uD45C ${r.invite.tokensPerExchange}\uAC1C\uB85C \uC6D0\uD558\uB294 \uC8FC\uBBFC\uC744 \uACE0\uB97C \uC218 \uC788\uC5B4\uC694.`}),Ae(a)])}function va(e,r,a){let n=e.state.invite.log,i=new Intl.DateTimeFormat("ko-KR",{dateStyle:"short",timeStyle:"short"});return F("fw-invite-log","\uCD08\uB300 \uAE30\uB85D",[n.length===0?t("p",{className:"empty",text:"\uC544\uC9C1 \uCD08\uB300 \uAE30\uB85D\uC774 \uC5C6\uC5B4\uC694."}):t("ol",{className:"result-list"},n.map(o=>t("li",{className:`result-row ${o.outcome}`},[L(e.state.residents[o.residentId]??null),t("strong",{text:e.state.residents[o.residentId]?.displayName??o.name}),t("span",{className:`result-badge ${o.outcome}`,text:Qe[o.outcome]}),t("small",{className:"muted",text:`${i.format(new Date(o.at))}${o.via==="guarantee"?" \xB7 \uBCF4\uC7A5":o.via==="exchange"?" \xB7 \uC885\uD45C \uAD50\uD658":""}${o.outcome==="breakthrough"?` \xB7 \uB3CC\uD30C ${o.breakthrough}/${r.crew.maxBreakthrough}`:""}`})]))),t("p",{className:"muted",text:`\uCD5C\uADFC ${r.invite.logLimit}\uAC74\uAE4C\uC9C0 \uBCF4\uAD00\uD574\uC694.`}),Ae(a)])}function ya(e,r,a){let n=r.state.invite.wishResidentId,i=!!e.busy["invite-wish"],o=Object.values(r.state.residents).sort((s,l)=>s.displayName.localeCompare(l.displayName,"ko"));return F("fw-invite-wish","\uD76C\uB9DD \uC8FC\uBBFC \uC124\uC815",[t("p",{className:"muted",text:"\uB4F1\uB85D\uB41C \uCE90\uB9AD\uD130\xB7\uD398\uB974\uC18C\uB098 \uC911 \uD55C \uBA85\uC744 \uACE0\uB974\uBA74 \uADF8 \uC8FC\uBBFC\uC744 \uB354 \uC798 \uB9CC\uB098\uC694."}),o.length===0?t("p",{className:"empty",text:"\uB4F1\uB85D\uB41C \uC8FC\uBBFC\uC774 \uC5C6\uC5B4\uC694."}):t("ul",{className:"pick-list"},o.map(s=>t("li",{},[t("button",{className:`pick-row${s.residentId===n?" selected":""}`,attrs:{type:"button","aria-pressed":s.residentId===n?"true":"false"},disabled:i,on:{click:()=>{a.setWish(s.residentId)}}},[L(s),t("strong",{text:s.displayName}),q(s),t("small",{className:"muted",text:s.recruited?"\uC601\uC785 \uC644\uB8CC":"\uCD08\uB300 \uB300\uAE30"}),s.residentId===n?d.check("icon"):null])]))),n?y("\uD76C\uB9DD \uC8FC\uBBFC \uD574\uC81C",()=>{a.setWish(null)},{variant:"secondary",disabled:i}):null,Ae(a)])}function ar(e,r,a,n){let i=e.sheet;return i?i.kind==="invite-result"?ha(r,a,i.draws,n):i.kind==="invite-chances"?wa(r,a,n):i.kind==="invite-log"?va(r,a,n):i.kind==="invite-wish"?ya(e,r,n):null:null}function xa(e,r){let a=e.world?.state==="ready"?e.world.value:null;if(!a)return null;let{tickets:n,tokens:i}=a.state.wallet;return t("div",{className:"resources invite-counters"},[t("button",{className:"counter ticket",attrs:{type:"button","aria-label":`\uCD08\uB300\uAD8C ${n}\uC7A5 \u2014 \uCD08\uB300\uAD8C \uBC1B\uAE30`},on:{click:()=>r.openDeliveries()}},[t("span",{className:"ticket-mark"},[d.ticket("icon")]),t("span",{className:"counter-value",text:String(n)}),t("span",{className:"counter-plus"},[d.plus("icon tiny")])]),t("span",{className:"counter token",attrs:{"aria-label":`\uC885\uD45C ${i}\uAC1C`}},[t("span",{className:"token-mark"},[d.leaf("icon")]),t("span",{className:"counter-value",text:String(i)})])])}function ka(e,r){let a=(n,i,o)=>t("button",{className:`segment${e.inviteTab===n?" selected":""}`,attrs:{type:"button",role:"tab","aria-selected":e.inviteTab===n?"true":"false"},on:{click:()=>r.setInviteTab(n)}},[o,t("span",{text:i})]);return t("div",{className:"segmented invite-tabs",attrs:{role:"tablist","aria-label":"\uCD08\uB300"}},[a("invite","\uC8FC\uBBFC \uCD08\uB300",d.sprout("icon")),a("exchange","\uC885\uD45C \uAD50\uD658",d.leaf("icon"))])}function nr(e,r,a,n,i){let o=n*a.invite.ticketsPerDraw,s=Math.max(0,o-r.state.wallet.tickets),l=Object.keys(r.state.residents).length===0,p=!!e.busy[`invite:${n}`];return t("button",{className:`draw-button${s?" short":""}`,attrs:{type:"button","aria-label":`${n}\uD68C \uCD08\uB300 \u2014 \uCD08\uB300\uAD8C ${o}\uC7A5${s?`, ${s}\uC7A5 \uBD80\uC871`:""}`},disabled:p||s>0||l||r.state.progress.starterResidentId===null,on:{click:()=>{i.draw(n)}}},[t("strong",{className:"draw-title",text:p?"\uCD08\uB300\uD558\uB294 \uC911\u2026":`${n}\uD68C \uCD08\uB300`}),t("span",{className:"draw-cost"},[d.ticket("icon"),`${o}\uC7A5`]),s?t("span",{className:"draw-short"},[d.info("icon tiny"),`\uCD08\uB300\uAD8C ${s}\uC7A5 \uBD80\uC871`]):null])}function Na(e,r,a,n){let i=Object.values(r.state.residents),o=r.state.invite.wishResidentId?r.state.residents[r.state.invite.wishResidentId]:null,s=i.filter(m=>!m.recruited).length,l=a.invite.guaranteeAfter-r.state.invite.sinceNew+1,p=r.state.wallet.tokens,c=a.invite.tokensPerExchange;return[S(null,[t("button",{className:"menu-row wish-row",attrs:{type:"button"},on:{click:()=>n.openSheet({kind:"invite-wish"})}},[t("span",{className:"menu-icon light"},[d.sprout("icon")]),t("span",{className:"menu-text"},[t("span",{className:"menu-title",text:"\uD76C\uB9DD \uC8FC\uBBFC \uC124\uC815"}),t("span",{className:"menu-detail",text:o?`${o.displayName} \xB7 \uB2E4\uB978 \uC8FC\uBBFC\uBCF4\uB2E4 \uC798 \uB9CC\uB098\uC694`:"\uB4F1\uB85D\uB41C \uCE90\uB9AD\uD130\xB7\uD398\uB974\uC18C\uB098 \uC911\uC5D0\uC11C \uB9CC\uB098\uC694."})]),t("span",{className:"menu-chevron"},[d.chevron()])]),i.length===0?t("div",{className:"invite-empty"},[t("p",{className:"empty",text:"\uCD08\uB300\uD560 \uC8FC\uBBFC\uC774 \uC5C6\uC5B4\uC694. \uBA3C\uC800 \uCE90\uB9AD\uD130\uB098 \uD398\uB974\uC18C\uB098\uB97C \uBD88\uB7EC\uC640 \uC8FC\uC138\uC694."}),y("\uC8FC\uBBFC \uBD88\uB7EC\uC624\uAE30",()=>n.navigate("residents"))]):r.state.progress.starterResidentId===null?t("div",{className:"invite-empty"},[t("p",{className:"empty",text:"\uC2DC\uC791 \uC8FC\uBBFC\uC744 \uBA3C\uC800 \uC815\uD558\uBA74 \uCD08\uB300\uD560 \uC218 \uC788\uC5B4\uC694."}),y("\uC8FC\uBBFC \uD654\uBA74\uC73C\uB85C",()=>n.navigate("residents"))]):null,t("div",{className:"draw-row"},[nr(e,r,a,1,n),nr(e,r,a,a.invite.multiDraw,n)]),t("p",{className:"hint center",text:i.length===0?"\uB4F1\uB85D\uD55C \uC8FC\uBBFC \uC911\uC5D0\uC11C \uC0C8\uB85C\uC6B4 \uC778\uC5F0\uC744 \uB9CC\uB0A0 \uC218 \uC788\uC5B4\uC694.":s>0?`\uC544\uC9C1 \uC624\uC9C0 \uC54A\uC740 \uC8FC\uBBFC ${s}\uBA85 \xB7 \uB2A6\uC5B4\uB3C4 ${Math.max(1,l)}\uBC88\uC9F8 \uCD08\uB300\uC5D0\uB294 \uC0C8 \uC8FC\uBBFC\uC744 \uB9CC\uB098\uC694.`:"\uBAA8\uB450 \uACF5\uBC29\uC5D0 \uC654\uC5B4\uC694. \uB2E4\uC2DC \uB9CC\uB098\uBA74 \uB3CC\uD30C, \uCD5C\uB300 \uB3CC\uD30C \uB4A4\uC5D0\uB294 \uC885\uD45C\uAC00 \uB3FC\uC694."}),t("div",{className:"link-row"},[t("button",{className:"link-button with-icon",attrs:{type:"button"},on:{click:()=>n.openSheet({kind:"invite-chances"})}},[d.info("icon"),t("span",{text:"\uD655\uB960 \uBCF4\uAE30"})]),t("button",{className:"link-button with-icon",attrs:{type:"button"},on:{click:()=>n.openSheet({kind:"invite-log"})}},[d.document("icon"),t("span",{text:"\uCD08\uB300 \uAE30\uB85D"})])])]),S(null,[t("button",{className:"exchange-card",attrs:{type:"button","aria-label":`\uC885\uD45C \uAD50\uD658 ${p} / ${c} \u2014 \uC6D0\uD558\uB294 \uC8FC\uBBFC \uC120\uD0DD`},on:{click:()=>n.setInviteTab("exchange")}},[t("span",{className:"token-coin big"},[d.leaf("icon big")]),t("span",{className:"exchange-count"},[t("strong",{text:"\uC885\uD45C \uAD50\uD658"}),t("span",{className:"count-pill",text:`${p} / ${c}`})]),t("span",{className:"exchange-text"},[t("strong",{},[d.people("icon")," \uC6D0\uD558\uB294 \uC8FC\uBBFC \uC120\uD0DD"]),t("span",{className:"muted",text:"\uCD5C\uB300 \uB3CC\uD30C \uC774\uD6C4 \uC911\uBCF5\uC740 \uC885\uD45C\uB85C."})]),t("span",{className:"menu-chevron"},[d.chevron()])])])]}function Sa(e,r,a,n,i){let o=a.crew.maxBreakthrough,s=r.recruited&&r.breakthrough>=o,l=!!e.busy[`exchange:${r.residentId}`],p=r.recruited?s?"\uCD5C\uB300 \uB3CC\uD30C":`\uB3CC\uD30C ${r.breakthrough}/${o} \u2192 ${r.breakthrough+1}`:"\uCD08\uB300 \uB300\uAE30 \u2192 \uC601\uC785";return t("li",{className:"exchange-row"},[L(r),t("span",{className:"exchange-name"},[t("strong",{text:r.displayName}),t("span",{className:"tag-row"},[q(r),t("small",{className:"muted",text:p})])]),t("button",{className:"button small",text:l?"\uAD50\uD658 \uC911\u2026":"\uAD50\uD658",attrs:{type:"button","aria-label":`${r.displayName}\uC640(\uACFC) \uC885\uD45C \uAD50\uD658`},disabled:l||s||n<a.invite.tokensPerExchange,on:{click:()=>{i.exchange(r.residentId)}}})])}function $a(e,r,a,n){let i=r.state.wallet.tokens,o=Object.values(r.state.residents).sort((s,l)=>Number(s.recruited)-Number(l.recruited)||s.displayName.localeCompare(l.displayName,"ko"));return[S("\uC885\uD45C \uAD50\uD658",[t("p",{className:"exchange-summary"},[t("span",{className:"token-coin"},[d.leaf("icon")]),t("strong",{text:`${i} / ${a.invite.tokensPerExchange}`}),t("span",{className:"muted",text:` \uC885\uD45C ${a.invite.tokensPerExchange}\uAC1C\uB85C \uC6D0\uD558\uB294 \uC8FC\uBBFC\uC744 \uBC14\uB85C \uB9DE\uC774\uD558\uAC70\uB098 \uB3CC\uD30C\uD574\uC694.`})]),o.length===0?t("p",{className:"empty",text:"\uB4F1\uB85D\uB41C \uC8FC\uBBFC\uC774 \uC5C6\uC5B4\uC694."}):t("ul",{className:"exchange-list"},o.map(s=>Sa(e,s,a,i,n)))])]}function ir(e,r){let a=e.world?.state==="ready"?e.world.value:null,n=e.content,i=a&&n;return I(e,r,{top:{kind:"sub",title:"\uCD08\uB300",subtitle:"\uC0C8\uB85C\uC6B4 \uC778\uC5F0\uC744 \uB9DE\uC774\uD574\uC694",resources:!1,counters:xa(e,r)},backdrop:"forest",body:i?[ka(e,r),...e.inviteTab==="invite"?Na(e,a,n,r):$a(e,a,n,r)]:[C("\uC138\uACC4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026")],nav:!0,sheet:i?ar(e,a,n,r):null})}var Ca="http://www.w3.org/2000/svg",or={locked:"\uC7A0\uAE40",available:"\uCD9C\uBC1C \uAC00\uB2A5",running:"\uD0D0\uD5D8 \uC911",unlocked:"\uC774\uC57C\uAE30 \uC5F4\uB9BC",read:"\uC77D\uC74C"};function Me(e){return t("div",{className:"field-tabs explore-tabs",attrs:{role:"tablist","aria-label":"\uD0D0\uC0AC"}},[H(e,"survey-patrol",{className:"field-tab",label:"\uC870\uC0AC",children:[d.search("icon field-glyph"),t("span",{text:"\uC870\uC0AC"})]}),H(e,"survey-patrol",{className:"field-tab",label:"\uC21C\uCC30",children:[d.compass("icon field-glyph"),t("span",{text:"\uC21C\uCC30"})]}),t("button",{className:"field-tab current",attrs:{type:"button",role:"tab","aria-selected":"true"}},[d.leaf("icon field-glyph"),t("span",{text:"\uC774\uC57C\uAE30 \uD0D0\uD5D8"})])])}function Ia(e,r){let a=document.createElementNS(Ca,"svg");a.setAttribute("viewBox","0 0 360 170"),a.setAttribute("class","trail-art"),a.setAttribute("aria-hidden","true");let n=[[60,120],[170,92],[285,60]],i=o=>e.episodes[o].status==="read"?"#5a9a44":o===r?"#fff8e8":"#cdbf9f";return a.innerHTML=`
    <g stroke="#4b2e1a" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
      <rect width="360" height="170" fill="#cfe5c0" stroke="none"/>
      <path d="M-5 150 Q90 110 170 130 T365 105 V175 H-5z" fill="#a9cc86"/>
      <path d="M200 -5 Q215 60 190 95 T230 175 H262 Q240 120 262 85 T236 -5z" fill="#9fd0e6"/>
      <circle cx="30" cy="40" r="26" fill="#8fbf6e"/><circle cx="330" cy="140" r="22" fill="#8fbf6e"/>
      <rect x="300" y="22" width="34" height="46" rx="4" fill="#cdbf9f"/><path d="M308 68 V40 a9 9 0 0 1 18 0 V68" fill="#a9cc86"/>
      <path d="M20 135 Q60 120 ${n[0][0]} ${n[0][1]} Q120 100 ${n[1][0]} ${n[1][1]} Q230 80 ${n[2][0]} ${n[2][1]}"
        fill="none" stroke="#fff8e8" stroke-width="6" stroke-dasharray="10 8"/>
      ${n.map(([o,s],l)=>`<circle cx="${o}" cy="${s}" r="11" fill="${i(l)}"/>`).join("")}
      <g transform="translate(${n[r][0]-14} ${n[r][1]-46})">
        <path d="M14 30 L8 22 H4 a4 4 0 0 1-4-4 V4 a4 4 0 0 1 4-4 H24 a4 4 0 0 1 4 4 V18 a4 4 0 0 1-4 4 H20z" fill="#fff8e8"/>
        <path d="M14 18 c0-6 0-9 0-12 M14 12 c-4-1-6-4-6-7 4 1 6 3 6 7z M14 10 c4-1 5-4 5-7-4 1-5 3-5 7z" fill="#5a9a44" stroke-width="2"/>
      </g>
    </g>`,a}function Ra(e,r,a,n){return a.length<2?null:t("div",{className:"chip-row pair-chips",attrs:{role:"group","aria-label":"\uD398\uC5B4 \uACE0\uB974\uAE30"}},a.map(i=>{let o=r.state.pairs[i.pairId].residentIds.map(l=>r.state.residents[l]?.displayName??"\uC8FC\uBBFC"),s=i.pairId===e.explore.pairId;return t("button",{className:`pill-tab${s?" current":""}`,attrs:{type:"button","aria-pressed":s?"true":"false"},on:{click:()=>n.selectStoryPair(i.pairId)}},[t("span",{text:o.join(" \xB7 ")})])}))}function Aa(e,r){return t("ol",{className:"episode-row",attrs:{"aria-label":"\uC774\uC57C\uAE30 \uD3B8"}},e.episodes.map(a=>t("li",{className:`episode-tile ${a.status}${a.index===r?" selected":""}`},[t("span",{className:"episode-icon"},[(a.status==="locked"?d.lock:d.book)("icon big"),a.status==="read"?t("span",{className:"episode-check"},[d.check("icon tiny")]):null]),t("span",{className:"episode-text"},[t("strong",{text:`${a.index+1}\uD3B8`}),t("span",{text:a.title}),t("small",{text:a.status==="locked"?a.reasons[0]??or.locked:or[a.status]})])])))}function Ma(e,r,a,n,i,o){let s=w=>Math.max(0,(r.state.inventory[w]??0)-(r.state.production.protectedStock[w]??0)),l=Object.entries(i.preparations),p=l.every(([w,$])=>s(w)>=$),c=i.participants.map(w=>r.state.residents[w]).filter(Boolean),m=r.state.stories.expedition,u=m&&m.pairId===n.pairId&&m.episode===i.index,h=w=>!!e.busy[w],f=c.filter(w=>Object.values(r.state.production.facilities).some($=>$.residentId===w.residentId)),g;if(i.status==="available"){let w=`depart:${n.pairId}:${i.index}`;g=y(h(w)?"\uCD9C\uBC1C\uD558\uB294 \uC911\u2026":p?"\uD0D0\uD5D8 \uCD9C\uBC1C":"\uC900\uBE44\uBB3C\uC774 \uBD80\uC871\uD574\uC694",()=>{o.depart(n.pairId,i.index)},{disabled:h(w)||!p,attrs:{"data-wide":""}})}else if(i.status==="running"&&u){let w=he(e,r,m);g=t("div",{className:"expedition-running"},[t("p",{className:"running-line"},[d.compass("icon"),t("strong",{text:"\uD0D0\uD5D8 \uC911"}),w.countdown]),w.bar,y(h("expedition-cancel")?"\uCDE8\uC18C\uD558\uB294 \uC911\u2026":"\uD0D0\uD5D8 \uCDE8\uC18C (\uC900\uBE44\uBB3C\uC740 \uBAA8\uB450 \uB3CC\uB824\uBC1B\uC544\uC694)",()=>{o.cancelExpedition()},{variant:"secondary",disabled:h("expedition-cancel")})])}else if((i.status==="unlocked"||i.status==="read")&&i.storyId){let w=i.storyId;g=y(i.status==="read"?"\uB2E4\uC2DC \uC77D\uAE30":i.written?"\uC774\uC5B4 \uC77D\uAE30":"\uC774\uC57C\uAE30 \uC77D\uAE30",()=>o.openStory(n.pairId,i.index,w),{attrs:{"data-wide":""}})}else g=t("div",{className:"locked-reasons"},[t("p",{className:"hint",text:"\uC544\uC9C1 \uB5A0\uB0A0 \uC218 \uC5C6\uC5B4\uC694:"}),t("ul",{},i.reasons.map(w=>t("li",{text:w})))]);return t("div",{className:"expedition-details"},[t("div",{className:"detail-grid"},[t("div",{className:"detail-cell"},[d.clock("icon big"),t("span",{},[t("small",{text:"\uC18C\uC694 \uC2DC\uAC04"}),t("strong",{text:`${i.minutes}\uBD84`})])]),t("div",{className:"detail-cell"},[d.people("icon big"),t("span",{},[t("small",{text:"\uCC38\uC5EC \uC8FC\uBBFC"}),t("strong",{text:`${c.length}\uBA85`})]),t("span",{className:"avatar-row"},c.map(w=>L(w)))]),t("div",{className:"detail-cell wide"},[d.box("icon big"),t("span",{},[t("small",{text:"\uC900\uBE44\uBB3C"}),t("span",{className:"prep-list"},l.map(([w,$])=>t("span",{className:`prep${s(w)>=$?" ok":""}`},[W(w),`${j(a,w)} ${Math.min(s(w),$)}/${$}`,s(w)>=$?d.check("icon tiny"):null])))])]),t("div",{className:"detail-cell wide"},[d.sparkle("icon big"),t("span",{},[t("small",{text:"\uBC1C\uACAC\uD560 \uC218 \uC788\uB294 \uAC83"}),t("strong",{text:n.arc.discovery})])])]),t("p",{className:"hint",text:f.length?`${f.map(w=>w.displayName).join(", ")}\uC740(\uB294) \uCD9C\uBC1C\uD558\uBA74 \uC2DC\uC124\uC5D0\uC11C \uBE60\uC838\uC694. \uC2DC\uC124\uC740 \uAE30\uBCF8 \uD6A8\uC728\uB85C \uACC4\uC18D \uC77C\uD558\uACE0, \uC9C4\uD589 \uC911\uC778 \uC791\uC5C5\uC740 \uCDE8\uC18C\uD558\uC9C0 \uC54A\uC544\uC694.`:"\uC2DC\uC124\uC740 \uADF8\uB300\uB85C \uC77C\uD574\uC694. \uD0D0\uD5D8\uC740 \uC77C\uC0C1 \uC0DD\uC0B0\uACFC \uB530\uB85C \uD558\uB098\uC529 \uB5A0\uB098\uC694."}),g])}function Ta(e,r){return e.completed.length===0?null:S("\uC77D\uC740 \uC774\uC57C\uAE30",[t("ul",{className:"menu-list"},e.completed.slice().reverse().map(a=>t("li",{className:"completed-arc"},[t("strong",{text:a.title}),t("span",{className:"row-actions"},a.storyIds.map((n,i)=>t("button",{className:"outline-button small",text:`${i+1}\uD3B8`,attrs:{type:"button","aria-label":`${a.title} ${i+1}\uD3B8 \uB2E4\uC2DC \uC77D\uAE30`},on:{click:()=>r.openStory(e.pairId,i,n)}})))])))])}function za(e,r,a,n){let i=r.state.stories.expedition,o=i?a.find(p=>p.pairId===i.pairId):null,s=Math.round(n.production.absenceLimitMs/36e5);if(!i||!o)return t("div",{className:"strip offline explore-strip"},[d.compass(),t("span",{text:"\uC9C0\uAE08\uC740 \uB5A0\uB09C \uD0D0\uD5D8\uC774 \uC5C6\uC5B4\uC694."}),t("small",{className:"muted",text:`\uBC29\uCE58 \uB204\uC801 \uCD5C\uB300 ${s}\uC2DC\uAC04`})]);let l=he(e,r,i);return t("div",{className:"strip offline explore-strip"},[d.compass(),t("span",{className:"strip-progress"},[t("span",{},[`${o.episodes[i.episode].title} \xB7 `,l.countdown," \uB0A8\uC74C"]),l.bar]),t("small",{className:"muted",text:`\uBC29\uCE58 \uB204\uC801 \uCD5C\uB300 ${s}\uC2DC\uAC04`})])}function La(e,r,a,n){let i=e.explore.overview;if(!i||i.state==="loading")return[Me(n),C("\uC774\uC57C\uAE30\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026")];if(i.state==="error")return[Me(n),S(null,[_(i.message),y("\uB2E4\uC2DC \uBD88\uB7EC\uC624\uAE30",()=>{n.loadStoryOverview()})])];let o=i.value.pairs.filter(p=>!r.state.pairs[p.pairId]?.archived);if(o.length===0)return[Me(n),S(null,[t("p",{text:"\uD398\uC5B4\uB97C \uB9CC\uB4E4\uBA74 \uB450 \uC8FC\uBBFC\uC758 \uC774\uC57C\uAE30 \uD0D0\uD5D8\uC774 \uC5F4\uB824\uC694."}),t("p",{className:"muted",text:"1\uD3B8\uC740 \uD55C \uC8FC\uBBFC\uB9CC \uACF5\uBC29\uC5D0 \uC640 \uC788\uC5B4\uB3C4 \uB5A0\uB0A0 \uC218 \uC788\uC5B4\uC694."}),y("\uC8FC\uBBFC \uD654\uBA74\uC73C\uB85C",()=>n.navigate("residents"),{variant:"secondary"})])];let s=o.find(p=>p.pairId===e.explore.pairId)??o[0],l=s.episodes.find(p=>p.status!=="read")?.index??2;return[Me(n),Ra(e,r,o,n),t("section",{className:"card trail-card",attrs:{"aria-label":`${s.arc.place} \uC9C0\uB3C4`}},[Ia(s,l),t("span",{className:"place-sign",text:s.arc.place})]),S(s.arc.title,[Aa(s,l),Ma(e,r,a,s,s.episodes[l],n)],{className:"arc-card"}),za(e,r,o,a),Ta(s,n)]}function sr(e,r){let a=e.world?.state==="ready"?e.world.value:null;return I(e,r,{top:{kind:"sub",title:"\uD0D0\uC0AC",back:{route:"home",label:"\uD648"},resources:!0},backdrop:"forest",body:a&&e.content?La(e,a,e.content,r):[C("\uC138\uACC4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026")],nav:!0})}var Ea={calm:"affection",surprise:"curiosity",worry:"fluster",thinking:"inspiration",shy:"fluster"},Wa={joy:"\u266A",affection:"\u2661",curiosity:"?",fluster:"\u{1F4A7}",inspiration:"\u2726",annoyance:"\u{1F4A2}"};function lr(e){let r=e in je?e:Ea[e];return r?ae(je[r],{className:"emotion-bubble emotion-art",fallback:()=>t("span",{className:"emotion-bubble",text:Wa[r]})}):null}function Te(e,r){return e.state.residents[r]?.displayName??"\uC8FC\uBBFC"}function Pa(e,r,a,n){let i=a?.participants??[],o=n?.kind==="line"?n.speakerId:n?.kind==="choice"?n.askerId:null;return t("section",{className:"story-stage",attrs:{"aria-hidden":"true"}},[ae(se[e].scene,{className:"stage-art",fallback:()=>t("span",{className:"stage-shelf"})}),t("div",{className:`stage-cast cast-${i.length}`},i.map(s=>{let l=r.state.residents[s];if(!l)return null;let p=o!==s?null:n?.kind==="line"?lr(n.emotion):lr("curiosity");return t("span",{className:`stage-spot${o===s?" speaking":""}`},[p,K(l)])}))])}function ja(e,r,a,n){if(a.story.state==="loading")return t("div",{className:"dialogue-box loading",attrs:{role:"status"}},[t("p",{text:"\uC774\uC57C\uAE30\uB97C \uC4F0\uB294 \uC911\uC774\uC5D0\uC694\u2026"}),t("p",{className:"muted",text:"\uCC98\uC74C \uC5EC\uB294 \uC774\uC57C\uAE30\uB294 \uC5B8\uC5B4 \uBAA8\uB378\uC774 \uC9C0\uAE08 \uC368\uC694. \uC7A0\uC2DC \uAC78\uB9B4 \uC218 \uC788\uC5B4\uC694."})]);if(a.story.state==="error")return t("div",{className:"dialogue-box error",attrs:{role:"alert"}},[t("p",{text:a.story.message}),t("div",{className:"row-actions"},[y("\uAC19\uC740 \uC774\uC57C\uAE30\uB85C \uB2E4\uC2DC \uC2DC\uB3C4",()=>n.retryStory()),y("\uB2EB\uAE30",()=>n.closeStory(),{variant:"secondary"})])]);let o=a.story.value.segments;if(a.index>=o.length){let p=!!e.busy[`read:${a.storyId}`];return t("div",{className:"dialogue-box end"},[t("p",{className:"end-line",text:"\uC774\uC57C\uAE30\uB294 \uC5EC\uAE30\uAE4C\uC9C0\uC608\uC694."}),t("p",{className:"muted",text:"\uB2E4 \uC77D\uC73C\uBA74 \uC774 \uC7A5\uBA74\uC744 \uD568\uAED8\uD55C \uC8FC\uBBFC\uB4E4\uC758 \uAE30\uC5B5\uC5D0 \uB0A8\uC544\uC694."}),y(p?"\uAE30\uB85D\uD558\uB294 \uC911\u2026":"\uB2E4 \uC77D\uC74C",()=>{n.finishStory()},{disabled:p,attrs:{"data-wide":""}})])}let l=o[a.index];if(l.kind==="choice"){let p=Ye(r,a),c=p?.choice?.optionId??null,m=!!e.busy[`choose:${a.storyId}`];return t("div",{className:"dialogue-box choice"},[t("span",{className:"speaker-tag"},[d.leaf("icon tiny"),Te(r,l.askerId)]),t("p",{className:"line",text:l.question}),t("div",{className:"choice-options",attrs:{role:"group","aria-label":"\uB300\uB2F5 \uACE0\uB974\uAE30"}},l.options.map(u=>t("button",{className:`choice-option${c===u.optionId?" chosen":""}`,text:u.text,attrs:{type:"button","aria-pressed":c===u.optionId?"true":"false"},disabled:m||c!==null||p?.state==="read",on:{click:()=>{n.chooseAnswer(u.optionId)}}}))),c||p?.state==="read"?t("p",{className:"muted",text:c?"\uC774\uBBF8 \uB300\uB2F5\uD588\uC5B4\uC694.":"\uB2E4\uC2DC \uC77D\uC744 \uB54C\uB294 \uB300\uB2F5\uC774 \uB0A8\uC9C0 \uC54A\uC544\uC694."}):t("p",{className:"muted",text:"\uB300\uB2F5\uC740 \uD55C \uBC88\uB9CC \uD560 \uC218 \uC788\uC5B4\uC694. \uBB3C\uC5B4\uBCF8 \uC8FC\uBBFC\uB9CC \uAE30\uC5B5\uD574\uC694."})])}return t("div",{className:`dialogue-box${l.kind==="narration"?" narration-only":""}`},[l.kind==="line"?t("span",{className:"speaker-tag"},[d.leaf("icon tiny"),Te(r,l.speakerId)]):null,t("p",{className:l.kind==="line"?"line":"narration",text:l.text})])}function Ye(e,r){let a=e.state.stories.pairs[r.pairId];return[a?.current,...a?.completed??[]].find(i=>i?.episodes[r.episode]?.storyId===r.storyId)?.episodes[r.episode]}function Oa(e,r,a){let n=r.story.state==="ready"?r.story.value:null,i=n?n.segments.slice(0,Math.min(r.index+1,n.segments.length)):[];return F("fw-backlog","\uAE30\uB85D",[t("ol",{className:"backlog-list"},i.map(o=>t("li",{className:`backlog-${o.kind}`},[o.kind==="line"?t("strong",{text:Te(e,o.speakerId)}):o.kind==="choice"?t("strong",{text:Te(e,o.askerId)}):null,t("span",{text:o.kind==="choice"?o.question:o.text})]))),y("\uB2EB\uAE30",()=>a.toggleBacklog(),{variant:"secondary",attrs:{"data-wide":""}})])}function dr(e,r){let a=e.world?.state==="ready"?e.world.value:null,n=e.reader;if(!a||!n)return I(e,r,{top:{kind:"sub",title:"\uACF5\uBC29 \uC774\uC57C\uAE30",back:{route:"explore",label:"\uD0D0\uC0AC"},resources:!1},backdrop:"wood",body:[t("p",{className:"muted",text:"\uC5F4\uB9B0 \uC774\uC57C\uAE30\uAC00 \uC5C6\uC5B4\uC694."})],nav:!0});let i=n.story.state==="ready"?n.story.value:null,o=i?.segments.length??0,s=i?.segments[n.index],l=s?.kind==="choice"&&!Ye(a,n)?.choice&&Ye(a,n)?.state!=="read",p=t("div",{className:"resources reader-tools"},[t("button",{className:"chip-button",attrs:{type:"button","aria-pressed":n.backlog?"true":"false"},disabled:!i,on:{click:()=>r.toggleBacklog()}},[d.book("icon"),t("span",{text:"\uAE30\uB85D"})]),t("button",{className:`chip-button${n.auto?" active":""}`,attrs:{type:"button","aria-pressed":n.auto?"true":"false"},disabled:!i,on:{click:()=>r.toggleAuto()}},[d.chevron("icon"),t("span",{text:n.auto?"\uC790\uB3D9 \uB044\uAE30":"\uC790\uB3D9"})])]),c=I(e,r,{top:{kind:"sub",title:"\uACF5\uBC29 \uC774\uC57C\uAE30",subtitle:i?.title??"\uC774\uC57C\uAE30",resources:!1,counters:p},backdrop:"wood",body:[Pa(ne(e),a,i,s),ja(e,a,n,r),i&&n.index<o?t("div",{className:"reader-foot"},[t("span",{className:"count-pill",text:`${n.index+1} / ${o}`}),y("\uACC4\uC18D",()=>r.advanceStory(),{disabled:l,attrs:{"data-wide":""}})]):null],nav:!1,sheet:n.backlog?Oa(a,n,r):null}),m=c.querySelector(".back-button, .back-spacer");if(m){let u=t("button",{className:"back-button",attrs:{type:"button","aria-label":"\uC774\uC57C\uAE30 \uB2EB\uAE30"},on:{click:()=>r.closeStory()}},[d.back()]);m.replaceWith(u)}return c}var cr,Je=!1;function ze(e){let r=()=>{clearTimeout(cr),cr=setTimeout(()=>{!Je&&a.isConnected&&e.onSearch(a.value)},300)},a=t("input",{className:"search-input",attrs:{id:e.id,type:"search",placeholder:e.placeholder,value:e.value,autocomplete:"off"},on:{compositionstart:()=>Je=!0,compositionend:()=>{Je=!1,r()},input:()=>r()}});return t("label",{className:"search-field",attrs:{for:e.id}},[d.search("icon"),t("span",{className:"visually-hidden",text:e.placeholder}),a])}function Xe(e){let r=(a,n)=>t("li",{className:`step-item${e===a?" current":e>a?" done":""}`,attrs:e===a?{"aria-current":"step"}:{}},[t("span",{className:"step-number",text:String(a)}),t("span",{className:"step-label",text:n})]);return t("ol",{className:"steps card",attrs:{"aria-label":"\uC8FC\uBBFC \uB4F1\uB85D \uB2E8\uACC4"}},[r(1,"\uC790\uB8CC \uC120\uD0DD"),t("li",{className:"step-arrow",attrs:{"aria-hidden":"true"},text:"\u2192"}),r(2,"\uC7AC\uAD6C\uCD95"),t("li",{className:"step-arrow",attrs:{"aria-hidden":"true"},text:"\u2192"}),r(3,"\uC2DC\uC791 \uC8FC\uBBFC")])}function Ba(e,r){if(e.sources.state==="loading")return C("\uCE90\uB9AD\uD130\xB7\uD398\uB974\uC18C\uB098\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026");if(e.sources.state==="error")return t("div",{},[_(e.sources.message),y("\uB2E4\uC2DC \uBD88\uB7EC\uC624\uAE30",()=>{r.loadSources()},{variant:"secondary"})]);let a=e.query.trim().toLowerCase(),n=e.sources.value.filter(i=>i.kind===e.kindTab).filter(i=>!a||i.name.toLowerCase().includes(a));return n.length===0?t("p",{className:"empty",text:a?"\uC774\uB984\uC774 \uB9DE\uB294 \uC790\uB8CC\uAC00 \uC5C6\uC5B4\uC694.":`${we[e.kindTab]}\uAC00 \uC544\uC9C1 \uC5C6\uC5B4\uC694. \uC5D4\uC9C4\uC758 \uC11C\uC7AC\uC5D0\uC11C \uBA3C\uC800 \uB9CC\uB4E4\uC5B4 \uC8FC\uC138\uC694.`}):t("ul",{className:"source-list"},n.map(i=>t("li",{},[t("button",{className:"menu-row source-row",attrs:{type:"button"},disabled:i.residentId!==null,on:{click:()=>{r.chooseSource(i)}}},[t("span",{className:"menu-icon light"},[d.document()]),t("span",{className:"menu-text"},[t("span",{className:"menu-title",text:i.name}),t("span",{className:"menu-detail",text:i.residentId?"\uC774\uBBF8 \uC774 \uC138\uACC4\uC758 \uC8FC\uBBFC\uC774\uC5D0\uC694":i.summary||"\uC124\uBA85 \uC5C6\uC74C"})]),t("span",{className:"menu-chevron"},[i.residentId?d.check():d.chevron()])])])))}function Va(e,r){return[S("\uC790\uB8CC \uC120\uD0DD",[t("p",{className:"muted",text:"\uC8FC\uBBFC\uC73C\uB85C \uB9DE\uC774\uD560 \uCE90\uB9AD\uD130\uB098 \uD398\uB974\uC18C\uB098\uB97C \uACE8\uB77C \uC8FC\uC138\uC694. \uC6D0\uBCF8\uC740 \uC77D\uAE30\uB9CC \uD558\uACE0 \uBC14\uAFB8\uC9C0 \uC54A\uC544\uC694."}),t("div",{className:"pill-tabs two",attrs:{role:"tablist","aria-label":"\uC790\uB8CC \uC885\uB958"}},["character","persona"].map(a=>t("button",{className:`pill-tab${e.kindTab===a?" current":""}`,text:we[a],attrs:{type:"button",role:"tab","aria-selected":e.kindTab===a?"true":"false"},on:{click:()=>r.setRegisterKind(a)}}))),ze({id:"fw-source-search",value:e.query,placeholder:"\uC774\uB984\uC73C\uB85C \uCC3E\uAE30",onSearch:a=>r.setRegisterQuery(a)}),Ba(e,r)],{id:"fw-source-title"})]}function Fa(e){if(!e||e.state==="loading")return C("\uC6D0\uB798 \uC124\uC815\uC744 \uC77D\uB294 \uC911\u2026");if(e.state==="error")return _(e.message);let r=e.value;return t("div",{className:"readonly-box"},[t("p",{text:r.summary||"\uC6D0\uBCF8\uC5D0 \uC801\uD78C \uC124\uBA85\uC774 \uC5C6\uC5B4\uC694."})])}function Da(e,r){if(!r||r.state!=="ready"||!e.content)return null;let a=re(e.content,r.value.talent.talentId),n=r.value.talent.field;return t("div",{className:"talent-card",attrs:{"aria-label":"\uB9DE\uC774\uD558\uBA74 \uC815\uD574\uC9C0\uB294 \uC804\uBB38 \uBD84\uC57C\uC640 \uD2B9\uAE30"}},[t("p",{className:"talent-field"},[ce[n]("icon"),t("strong",{text:`\uC804\uBB38 \uBD84\uC57C \xB7 ${J[n]}`})]),a?t("p",{className:"talent-name"},[t("strong",{text:`\uD2B9\uAE30 \xB7 ${a.name}`}),t("span",{text:a.description})]):null,t("p",{className:"muted",text:"\uC6D0\uB798 \uC124\uC815\uC744 \uBC14\uD0D5\uC73C\uB85C \uC815\uD574\uC838\uC694. \uC8FC\uBBFC\uC744 \uB9DE\uC774\uD558\uBA74 \uBC14\uB00C\uC9C0 \uC54A\uC544\uC694."})])}function Ga(e,r,a){let n=t("input",{className:"visually-hidden",attrs:{id:"fw-register-image",type:"file",accept:"image/png,image/webp"},on:{change:()=>{let o=n.files?.[0];if(n.value="",!!o){if(o.size>a){r.notify(`\uD30C\uC77C\uC774 ${Math.round(a/1024/1024)}MiB\uB97C \uB118\uC5B4\uC694. \uB2E4\uB978 \uADF8\uB9BC\uC744 \uACE8\uB77C \uC8FC\uC138\uC694.`,"error");return}r.pickPendingImage(o)}}}}),i=e.pendingImage;return t("div",{className:"image-drop"},[n,t("label",{className:"drop-zone checker",attrs:{for:"fw-register-image"}},[i?t("img",{className:"drop-preview",attrs:{src:i.previewUrl,alt:""}}):d.addImage("icon drop-icon"),t("span",{className:"drop-text"},[t("strong",{text:i?i.file.name:"\uC8FC\uBBFC \uADF8\uB9BC \uC9C1\uC811 \uB4F1\uB85D"}),t("span",{text:i?`${Math.max(1,Math.round(i.file.size/1024))} KB \xB7 \uB4F1\uB85D\uD558\uBA74 WebP\uB85C \uC800\uC7A5\uD574\uC694`:"PNG \xB7 WebP \u2192 WebP \uC800\uC7A5"})])]),i?y("\uACE0\uB978 \uADF8\uB9BC \uBE7C\uAE30",()=>r.clearPendingImage(),{variant:"secondary"}):null])}function qa(e,r,a){let n=e.selected,i=r.content?.residents.worldSettingMax??200,o=!!r.busy["rebuild-suggestion"],s=!!r.busy[`register:${n.kind}:${n.id}`],l=Object.keys(r.busy).some(h=>h.startsWith("image-upload:")&&r.busy[h]),p=s||l,c=t("span",{className:"counter-text",text:`${e.draft.length} / ${i}`,attrs:{id:"fw-draft-count"}}),m=t("textarea",{className:"textarea",attrs:{id:"fw-world-setting",maxlength:String(i),rows:"4",placeholder:"\uC774 \uC138\uACC4\uC5D0\uC11C \uC5B4\uB5A4 \uC8FC\uBBFC\uC778\uC9C0 \uC801\uC5B4 \uC8FC\uC138\uC694.","aria-describedby":"fw-draft-count"},on:{input:()=>{c.textContent=`${m.value.length} / ${i}`,a.setDraft(m.value)}}});m.value=e.draft;let u=e.preview?.state==="ready";return[t("section",{className:"card selected-source"},[t("button",{className:"menu-row quiet",attrs:{type:"button"},on:{click:()=>a.backToSources()}},[t("span",{className:"menu-icon light"},[d.document()]),t("span",{className:"menu-text"},[t("small",{className:"muted",text:"\uC120\uD0DD\uD55C \uC790\uB8CC"}),t("span",{className:"menu-title",text:`${we[n.kind]} \xB7 ${n.name}`})]),t("span",{className:"menu-chevron"},[d.chevron()])])]),t("section",{className:"card rebuild",attrs:{"aria-labelledby":"fw-original"}},[t("h2",{className:"section-title doc",text:"\uC6D0\uB798 \uC124\uC815",attrs:{id:"fw-original"}}),Fa(e.preview),Da(r,e.preview),t("label",{className:"section-title",text:"\uACF5\uBC29 \uC138\uACC4 \uC124\uC815",attrs:{for:"fw-world-setting"}}),t("div",{className:"textarea-wrap"},[m,c]),t("div",{className:"rule-actions even"},[t("button",{className:"button",attrs:{type:"button"},on:{click:()=>{m.focus(),m.setSelectionRange(m.value.length,m.value.length)}}},[d.pencil("icon"),t("span",{text:"\uC218\uC815"})]),t("button",{className:"button secondary",attrs:{type:"button"},disabled:o||!u,on:{click:()=>{a.suggestSetting()}}},[d.sparkle("icon"),t("span",{text:o?"\uC81C\uC548 \uBC1B\uB294 \uC911\u2026":"\uB2E4\uC2DC \uC81C\uC548"})])]),t("p",{className:"hint",text:"\uB2E4\uC2DC \uC81C\uC548\uC740 \uC5D4\uC9C4\uC758 \uAE30\uBCF8 \uC5B8\uC5B4 \uBAA8\uB378\uC5D0 \uD55C \uBC88 \uC694\uCCAD\uD574\uC694. \uD655\uC815\uD558\uAE30 \uC804\uC5D0\uB294 \uC800\uC7A5\uB418\uC9C0 \uC54A\uC544\uC694."})]),S("\uC8FC\uBBFC \uADF8\uB9BC \uC9C1\uC811 \uB4F1\uB85D",[Ga(e,a,r.content?.residents.maxImageBytes??20*1024*1024),t("p",{className:"hint center"},[d.info("icon"),"\uC6D0\uBCF8 \uD504\uB85C\uD544\uC740 \uBC14\uB00C\uC9C0 \uC54A\uC544\uC694."])],{id:"fw-register-image-title"}),t("button",{className:"button big-action",attrs:{type:"button","data-wide":""},disabled:p||!u,on:{click:()=>{a.confirmRegister(!0,(h,f)=>a.uploadResidentImage(h,f))}}},[d.leaf("icon"),t("span",{text:s?"\uB4F1\uB85D\uD558\uB294 \uC911\u2026":l?"\uADF8\uB9BC \uC800\uC7A5 \uC911\u2026":"\uC7AC\uAD6C\uCD95 \uD655\uC815"}),d.chevron("icon")]),t("button",{className:"button secondary",attrs:{type:"button","data-wide":""},disabled:p||!u,on:{click:()=>{a.confirmRegister(!1,async()=>{})}}},[d.clock("icon"),t("span",{text:"\uB098\uC911\uC5D0 \uADF8\uB9BC \uB4F1\uB85D"})])]}function _a(e,r,a,n){let i=Object.values(r.state.residents),o=!!a.busy["choose-starter"];return[S("\uC2DC\uC791 \uC8FC\uBBFC",[t("p",{className:"muted",text:"\uACF5\uBC29\uC5D0\uC11C \uD568\uAED8 \uC2DC\uC791\uD560 \uC8FC\uBBFC \uD55C \uBA85\uC744 \uACE8\uB77C \uC8FC\uC138\uC694. \uB2E4\uB978 \uC8FC\uBBFC\uC740 \uCD08\uB300\uB85C \uB9DE\uC774\uD574\uC694."}),t("ul",{className:"starter-list",attrs:{role:"radiogroup","aria-label":"\uC2DC\uC791 \uC8FC\uBBFC"}},i.map(s=>t("li",{},[t("button",{className:`starter-option${e.starterChoice===s.residentId?" chosen":""}`,attrs:{type:"button",role:"radio","aria-checked":e.starterChoice===s.residentId?"true":"false"},on:{click:()=>n.setStarterChoice(s.residentId)}},[t("span",{className:"starter-stage"},[K(s)]),t("strong",{text:s.displayName}),q(s)])])))],{id:"fw-starter-title"}),t("button",{className:"button big-action",attrs:{type:"button","data-wide":""},disabled:o||!e.starterChoice,on:{click:()=>{n.confirmStarter()}}},[d.house("icon"),t("span",{text:o?"\uB9DE\uC774\uD558\uB294 \uC911\u2026":"\uC774 \uC8FC\uBBFC\uACFC \uC2DC\uC791\uD558\uAE30"})]),y("\uC8FC\uBBFC \uB354 \uB4F1\uB85D\uD558\uAE30",()=>n.registerAnother(),{variant:"secondary",attrs:{"data-wide":""}})]}function pr(e,r){let a=e.world?.state==="ready"?e.world.value:null,n=e.register,i;return!a||!n?i=[C("\uC138\uACC4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026")]:n.step===3?i=[Xe(3),..._a(n,a,e,r)]:n.step===2&&n.selected?i=[Xe(2),...qa(n,e,r)]:i=[Xe(1),...Va(n,r)],I(e,r,{top:{kind:"sub",title:"\uC8FC\uBBFC \uB4F1\uB85D",back:{route:"residents",label:"\uC8FC\uBBFC"},resources:!1},backdrop:"wood",body:i,nav:!1})}var mr="ABCDEFGHIJKLMNOPQRSTUVWXYZ";function Ha(e,r){return[...e?.relationStages??[]].reverse().find(n=>r>=n.from)?.label??"\u2013"}function ur(e,r,a){return a.state.residents[Ge(e,r.residentId)]??null}function Ua(e,r){let a=r.map((n,i)=>`A\u2013${mr[i+1]??"?"}`).join(" \xB7 ");return S(null,[t("div",{className:"relation-hero"},[L(e,"large"),t("span",{className:"hero-label",text:`\uACF5\uC720 \uC8FC\uBBFC \xB7 ${e.displayName}`}),t("strong",{className:"hero-pairs",text:r.length?a:"\uC544\uC9C1 \uD398\uC5B4\uAC00 \uC5C6\uC5B4\uC694"}),t("p",{className:"hero-note",text:r.length>1?"\uB450 \uAD00\uACC4\uB294 \uAC19\uC740 \uC138\uACC4\uC5D0\uC11C \uC774\uC5B4\uC838\uC694":r.length===1?"\uAC19\uC740 \uC138\uACC4\uC5D0\uC11C \uC774\uC5B4\uC9C0\uB294 \uAD00\uACC4\uC608\uC694":"\uB2E4\uB978 \uC8FC\uBBFC\uACFC \uD398\uC5B4\uB97C \uB9CC\uB4E4 \uC218 \uC788\uC5B4\uC694"})])],{className:"hero-card"})}function Ka(e,r,a,n,i,o){let s=ur(e,a,n),l=i.relationsEditing,p=!!i.busy[`pair-archive:${e.pairId}`];return t("li",{className:"pair-row card"},[t("div",{className:"pair-faces"},[t("span",{className:"pair-letters"},[t("span",{className:"letter",text:"A"}),"\xD7",t("span",{className:"letter",text:mr[r+1]??"?"})]),t("span",{className:"faces"},[L(a),t("span",{className:"times",text:"\xD7"}),L(s)]),t("span",{className:"partner-name",text:s?.displayName??"\uC54C \uC218 \uC5C6\uB294 \uC8FC\uBBFC"})]),t("div",{className:"pair-info"},[t("div",{className:"relation-now"},[t("small",{text:"\uD604\uC7AC \uAD00\uACC4"}),t("strong",{text:Ha(i.content,e.familiarity)})]),t("p",{className:"recent"},[t("span",{className:"recent-label",text:"\uCD5C\uADFC \uC0AC\uAC74"}),t("span",{text:e.lastEvent?.summary??"\uC544\uC9C1 \uC5C6\uC5B4\uC694"})]),l?t("div",{className:"pair-actions"},[y(p?"\uBCF4\uAD00 \uC911\u2026":"\uBCF4\uAD00",()=>{o.archivePair(e.pairId)},{variant:"secondary",disabled:p})]):t("div",{className:"pair-actions"},[H(o,"pair-memory",{className:"outline-button",label:"\uAE30\uC5B5 \uBCF4\uAE30",children:[d.book("icon"),t("span",{text:"\uAE30\uC5B5 \uBCF4\uAE30"})]}),H(o,"pair-guidelines",{className:"outline-button",label:"\uC9C0\uCE68 \uAD00\uB9AC",children:[d.gear("icon"),t("span",{text:"\uC9C0\uCE68 \uAD00\uB9AC"})]})])])])}function Qa(e,r,a,n,i){return e.length===0?null:S("\uBCF4\uAD00\uD55C \uD398\uC5B4",[t("ul",{className:"archived-list"},e.map(o=>{let s=ur(o,r,a),l=!!n.busy[`pair-restore:${o.pairId}`];return t("li",{className:"archived-row"},[L(s),t("span",{className:"archived-name",text:`${r.displayName} \xD7 ${s?.displayName??"?"}`}),y(l?"\uB418\uB3CC\uB9AC\uB294 \uC911\u2026":"\uB418\uB3CC\uB9AC\uAE30",()=>{i.restorePair(o.pairId)},{variant:"secondary",disabled:l})])}))],{id:"fw-archived"})}function Ya(e,r,a,n){let i=new Map(Object.values(r.state.pairs).filter(s=>s.residentIds.includes(e.residentId)).map(s=>[Ge(s,e.residentId),s.archived])),o=Object.values(r.state.residents).filter(s=>s.residentId!==e.residentId);return t("div",{className:"sheet-backdrop"},[t("section",{className:"sheet card",attrs:{role:"dialog","aria-modal":"true","aria-labelledby":"fw-pair-add"}},[t("h2",{className:"section-title",text:"\uD398\uC5B4 \uCD94\uAC00",attrs:{id:"fw-pair-add"}}),t("p",{className:"muted",text:`${e.displayName}\uC640(\uACFC) \uC774\uC5B4\uC9C8 \uC8FC\uBBFC\uC744 \uACE8\uB77C \uC8FC\uC138\uC694. \uCE90\uB9AD\uD130\uB4E0 \uD398\uB974\uC18C\uB098\uB4E0 \uAD1C\uCC2E\uC544\uC694. \uC9C0\uB09C \uAE30\uC5B5\uC774 \uC0C8\uB85C \uC0DD\uAE30\uC9C0\uB294 \uC54A\uC544\uC694.`}),o.length===0?t("p",{className:"empty",text:"\uD568\uAED8\uD560 \uB2E4\uB978 \uC8FC\uBBFC\uC774 \uC544\uC9C1 \uC5C6\uC5B4\uC694. \uC8FC\uBBFC \uBD88\uB7EC\uC624\uAE30\uC5D0\uC11C \uBA3C\uC800 \uB4F1\uB85D\uD574 \uC8FC\uC138\uC694."}):t("ul",{className:"candidate-list"},o.map(s=>{let l=i.has(s.residentId),p=De(e.residentId,s.residentId);return t("li",{},[t("button",{className:"candidate",attrs:{type:"button"},disabled:l||!!a.busy[p],on:{click:()=>{n.addPair(e.residentId,s.residentId)}}},[L(s),t("span",{className:"candidate-name",text:s.displayName}),q(s),t("span",{className:"candidate-state",text:l?i.get(s.residentId)?"\uBCF4\uAD00\uD568\uC5D0 \uC788\uC5B4\uC694":"\uC774\uBBF8 \uD398\uC5B4":a.busy[p]?"\uB9CC\uB4DC\uB294 \uC911\u2026":"\uACE0\uB974\uAE30"})])])})),y("\uB2EB\uAE30",()=>n.closeSheet(),{variant:"secondary",attrs:{"data-wide":""}})])])}function fr(e,r){let a=e.world?.state==="ready"?e.world.value:null,n=a?a.state.residents[e.focusResidentId??""]??null:null,i={top:{kind:"sub",title:"\uAD00\uACC4",subtitle:"\uAC19\uC740 \uC138\uACC4\uC5D0\uC11C \uC774\uC5B4\uC9C0\uB294 \uAD00\uACC4",back:{route:"residents",label:"\uC8FC\uBBFC"},resources:!1},backdrop:"forest",nav:!0};if(!a||!n)return I(e,r,{...i,body:[C(a?"\uC8FC\uBBFC\uC744 \uACE0\uB978 \uB4A4 \uAD00\uACC4\uB97C \uC5F4\uC5B4 \uC8FC\uC138\uC694.":"\uC138\uACC4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026")]});let o=Object.values(a.state.pairs).filter(l=>l.residentIds.includes(n.residentId)).sort((l,p)=>l.createdAt.localeCompare(p.createdAt)),s=o.filter(l=>!l.archived);return I(e,r,{...i,body:[Ua(n,s),t("ul",{className:"pair-list"},s.map((l,p)=>Ka(l,p,n,a,e,r))),t("p",{className:"notice-strip"},[t("span",{className:"bang",text:"!"}),"\uD398\uC5B4 \uC9C0\uC815\uC740 \uC5F0\uC778 \uC120\uC5B8\uC774 \uC544\uB2C8\uC5D0\uC694."]),t("div",{className:"rule-actions"},[t("button",{className:"button wide-main",attrs:{type:"button"},on:{click:()=>r.openSheet({kind:"pair-add",residentId:n.residentId})}},[d.people("icon"),t("span",{text:"\uD398\uC5B4 \uCD94\uAC00"})]),t("button",{className:`button secondary${e.relationsEditing?" pressed":""}`,attrs:{type:"button","aria-pressed":e.relationsEditing?"true":"false"},on:{click:()=>r.toggleRelationsEditing()}},[d.archive("icon"),t("span",{text:e.relationsEditing?"\uBCC0\uACBD \uB05D\uB0B4\uAE30":"\uBCC0\uACBD \xB7 \uBCF4\uAD00"})])]),e.relationsEditing?Qa(o.filter(l=>l.archived),n,a,e,r):null],sheet:e.sheet?.kind==="pair-add"?Ya(n,a,e,r):null})}function gr(e){return`${Math.max(1,Math.round(e/1024)).toLocaleString("ko-KR")} KB`}function Ze(e,r,a,n,i,o,s){let l=`fw-placement-${e}`,p=t("span",{className:"slider-value",text:s(n)}),c=t("input",{className:"slider",attrs:{id:l,type:"range",min:String(i.min),max:String(i.max),step:"1",value:String(n),"aria-valuetext":s(n)},on:{input:()=>p.textContent=s(Number(c.value)),change:()=>o.setPlacementDraft({[e]:Number(c.value)})}});return t("div",{className:"setting-row slider-row"},[r("icon"),t("label",{className:"setting-label",text:a,attrs:{for:l}}),c,p])}function Ja(e,r,a){let n=!!r.busy[`image-restore:${e.residentId}`],i=o=>t("li",{className:"history-item"},[t("span",{className:"history-thumb checker"},[t("img",{attrs:{src:o.url,alt:""}})]),t("span",{className:"menu-text"},[t("span",{className:"menu-title",text:o.fileName||"\uC774\uC804 \uADF8\uB9BC"}),t("span",{className:"menu-detail",text:`${o.width} \xD7 ${o.height} \xB7 ${gr(o.bytes)}`})]),y(n?"\uB418\uB3CC\uB9AC\uB294 \uC911\u2026":"\uC774 \uADF8\uB9BC\uC73C\uB85C",()=>{a.restoreResidentImage(e.residentId,o.reference)},{disabled:n})]);return t("div",{className:"sheet-backdrop"},[t("section",{className:"sheet card",attrs:{role:"dialog","aria-modal":"true","aria-labelledby":"fw-image-history"}},[t("h2",{className:"section-title",text:"\uC774\uC804 \uADF8\uB9BC",attrs:{id:"fw-image-history"}}),e.image.history.length?t("ul",{className:"history-list"},e.image.history.map(i)):t("p",{className:"empty",text:"\uB418\uB3CC\uB9B4 \uC774\uC804 \uADF8\uB9BC\uC774 \uC5C6\uC5B4\uC694."}),t("p",{className:"hint",text:"\uCD5C\uADFC 3\uC7A5\uAE4C\uC9C0 \uBCF4\uAD00\uD574\uC694. \uC9C0\uB09C \uC774\uC57C\uAE30 \uB2E4\uC2DC\uBCF4\uAE30\uC5D0\uB3C4 \uC9C0\uAE08 \uADF8\uB9BC\uC774 \uC4F0\uC5EC\uC694."}),y("\uB2EB\uAE30",()=>a.closeSheet(),{variant:"secondary",attrs:{"data-wide":""}})])])}function Xa(e,r,a){let n=r.content?.residents.placement,i=r.placementDraft??e.image.placement,o=e.image.current,s=!!r.busy[`image-upload:${e.residentId}`],l=!!r.busy[`placement:${e.residentId}`],p=JSON.stringify(i)!==JSON.stringify(e.image.placement),c=t("input",{className:"visually-hidden",attrs:{id:"fw-image-file",type:"file",accept:"image/png,image/webp"},disabled:s,on:{change:()=>{let u=c.files?.[0];c.value="",u&&a.uploadResidentImage(e.residentId,u)}}}),m=u=>u>0?`+${u}`:String(u);return[t("section",{className:"card image-card"},[t("p",{className:"target-ribbon"},[t("span",{className:"muted",text:"\uB300\uC0C1"}),d.leaf("icon"),t("strong",{text:e.displayName})]),t("div",{className:"image-stage checker"},[K(e,{placement:i,marker:!0})]),t("div",{className:"file-facts"},o?[t("strong",{text:o.fileName||"resident.webp"}),t("span",{text:`${o.width} \xD7 ${o.height} / ${gr(o.bytes)}`})]:[t("strong",{text:"\uC544\uC9C1 \uADF8\uB9BC\uC774 \uC5C6\uC5B4\uC694"}),t("span",{className:"muted",text:"\uADF8\uB9BC\uC774 \uC5C6\uC5B4\uB3C4 \uBAA8\uB4E0 \uAE30\uB2A5\uC744 \uC4F8 \uC218 \uC788\uC5B4\uC694"})]),c,t("label",{className:`button big-action file-button${s?" busy":""}`,attrs:{for:"fw-image-file","data-wide":"","aria-disabled":s?"true":"false"}},[t("span",{text:s?"WebP\uB85C \uC800\uC7A5\uD558\uB294 \uC911\u2026":o?"\uD30C\uC77C \uC120\uD0DD \xB7 \uAD50\uCCB4":"\uD30C\uC77C \uC120\uD0DD"})]),t("ul",{className:"rules"},[t("li",{text:"PNG \xB7 \uC815\uC801 WebP \uC5C5\uB85C\uB4DC (20MiB \xB7 4096px\uAE4C\uC9C0)"}),t("li",{text:"\uD22C\uBA85\uB3C4 \uC720\uC9C0 \xB7 WebP \uD488\uC9C8 95 \uC800\uC7A5"}),t("li",{text:"PNG \uC6D0\uBCF8\uC740 \uB530\uB85C \uBCF4\uAD00\uD558\uC9C0 \uC54A\uC544\uC694."})]),n?t("div",{className:"setting-block sliders"},[Ze("scale",d.zoom,"\uADF8\uB9BC \uD06C\uAE30",i.scale,n.scale,a,u=>`${u}%`),Ze("offsetX",d.arrows,"\uC88C\uC6B0 \uC704\uCE58",i.offsetX,n.offsetX,a,m),Ze("markerHeight",d.updown,"\uAE30\uD638 \uB192\uC774",i.markerHeight,n.markerHeight,a,m)]):null,t("button",{className:"button big-action",attrs:{type:"button","data-wide":""},disabled:l||!p,on:{click:()=>{a.applyPlacement(e.residentId)}}},[t("span",{text:l?"\uC801\uC6A9\uD558\uB294 \uC911\u2026":p?"\uC801\uC6A9":"\uC801\uC6A9\uB428"})]),t("div",{className:"rule-actions even"},[t("button",{className:"button secondary",attrs:{type:"button"},on:{click:()=>a.resetPlacementDraft()}},[d.restore("icon"),t("span",{text:"\uAE30\uBCF8 \uBC30\uCE58"})]),t("button",{className:"button secondary",attrs:{type:"button"},disabled:e.image.history.length===0,on:{click:()=>a.openSheet({kind:"image-history",residentId:e.residentId})}},[d.image("icon"),t("span",{text:`\uC774\uC804 \uADF8\uB9BC${e.image.history.length?` ${e.image.history.length}`:""}`})])])])]}function br(e,r){let a=e.world?.state==="ready"?e.world.value:null,n=a?a.state.residents[e.focusResidentId??""]??null:null;return I(e,r,{top:{kind:"sub",title:"\uC8FC\uBBFC \uADF8\uB9BC",back:{route:"residents",label:"\uC8FC\uBBFC"},resources:!1},backdrop:"wood",body:n?Xa(n,e,r):[C(a?"\uC8FC\uBBFC\uC744 \uACE0\uB978 \uB4A4 \uC8FC\uBBFC \uADF8\uB9BC\uC744 \uC5F4\uC5B4 \uC8FC\uC138\uC694.":"\uC138\uACC4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026")],nav:!0,sheet:n&&e.sheet?.kind==="image-history"?Ja(n,e,r):null})}function hr(e,r,a,n){let i=r.state.residents[n],o=e.content;if(!i||!o)return null;let s=re(o,i.talentId),l=o.facilities.find(p=>p.field===i.field);return F("fw-field",`${i.displayName}\uC758 \uC804\uBB38 \uBD84\uC57C \xB7 \uD2B9\uAE30`,[t("div",{className:"talent-card"},[t("p",{className:"talent-field"},[ce[i.field]("icon"),t("strong",{text:`${J[i.field]} \uBD84\uC57C`}),t("span",{className:"muted",text:` \xB7 ${l?.name??""}`})]),t("p",{className:"muted",text:`${l?.name??"\uAC19\uC740 \uBD84\uC57C \uC2DC\uC124"}\uC5D0 \uBC30\uCE58\uD558\uBA74 \uCC98\uB9AC \uC18D\uB3C4\uAC00 \uBE68\uB77C\uC838\uC694: \uAE30\uBCF8 ${O(ee(o,0))} \u2192 \uC9C0\uAE08 ${O(ee(o,i.breakthrough))} (\uB3CC\uD30C ${i.breakthrough}/${o.crew.maxBreakthrough}).`}),s?t("p",{className:"talent-name"},[t("strong",{text:`\uD2B9\uAE30 \xB7 ${s.name}`}),t("span",{text:s.description})]):null]),t("p",{className:"hint",text:"\uC804\uBB38 \uBD84\uC57C\uC640 \uD2B9\uAE30\uB294 \uC8FC\uBBFC\uC744 \uB9DE\uC774\uD560 \uB54C \uC6D0\uB798 \uC124\uC815\uC744 \uBC14\uD0D5\uC73C\uB85C \uC815\uD574\uC84C\uC5B4\uC694. \uC6D0\uBCF8 \uCE74\uB4DC\uB294 \uBC14\uB00C\uC9C0 \uC54A\uC544\uC694."}),y("\uB2EB\uAE30",()=>a.closeSheet(),{variant:"secondary",attrs:{"data-wide":""}})])}var Za={registered:"\uB4F1\uB85D",setting:"\uC138\uACC4 \uC124\uC815 \uC218\uC815",name:"\uC774\uB984 \uC218\uC815",recruited:"\uC601\uC785",image:"\uADF8\uB9BC \uB4F1\uB85D",image_restored:"\uC774\uC804 \uADF8\uB9BC\uC73C\uB85C",image_history_cleared:"\uADF8\uB9BC \uC774\uB825 \uC815\uB9AC",placement:"\uBC30\uCE58 \uBCC0\uACBD"};function wr(e){let r=new Date(e);return Number.isNaN(r.getTime())?e:new Intl.DateTimeFormat("ko-KR",{dateStyle:"medium",timeStyle:"short"}).format(r)}function et(e,r){return r?t("div",{className:"source-field"},[t("strong",{text:e}),t("p",{text:r})]):null}function en(e){return t("li",{className:"change-row"},[t("span",{className:"change-kind",text:Za[e.kind]??e.kind}),t("span",{className:"change-detail",text:e.detail}),t("time",{className:"change-time",text:wr(e.at),attrs:{datetime:e.at}})])}function vr(e,r,a,n){let i=e.state.residents[n];if(!i)return null;let o=r.content?.residents.worldSettingMax??200,s=!!r.busy[`resident-setting:${n}`],l=r.sheet?.kind==="profile"&&r.sheet.residentId===n?r.sheet:null,p=l?.draft??i.worldSetting,c=t("span",{className:"counter-text",text:`${p.length} / ${o}`}),m=t("textarea",{className:"textarea",attrs:{id:"fw-profile-setting",maxlength:String(o),rows:"4","aria-describedby":"fw-profile-count"},on:{input:()=>{c.textContent=`${m.value.length} / ${o}`,a.rememberProfile({draft:m.value})}}});m.value=p,c.id="fw-profile-count";let{source:u}=i,h=t("div",{className:"compare-box source"},[t("h3",{className:"compare-title"},[d.document("icon"),"\uC6D0\uB798 \uC124\uC815"]),t("p",{className:"muted",text:`${u.name} \xB7 ${wr(u.takenAt)}\uC5D0 \uC77D\uC74C \xB7 \uC6D0\uBCF8\uC740 \uBC14\uB00C\uC9C0 \uC54A\uC544\uC694`}),et("\uC124\uBA85",u.description),et("\uC131\uACA9",u.personality),et("\uC0C1\uD669",u.scenario),!u.description&&!u.personality&&!u.scenario?t("p",{className:"muted",text:"\uC6D0\uBCF8\uC5D0 \uC801\uD78C \uC124\uBA85\uC774 \uC5C6\uC5B4\uC694."}):null]),f=t("div",{className:"profile-panel"},[t("form",{className:"compare-box world",on:{submit:B=>{B.preventDefault(),m.value.trim()&&m.value!==i.worldSetting&&a.updateWorldSetting(n,m.value)}}},[t("label",{className:"compare-title",attrs:{for:"fw-profile-setting"}},[d.leaf("icon"),"\uACF5\uBC29 \uC138\uACC4 \uC124\uC815"]),m,c,t("button",{className:"button small",text:s?"\uC800\uC7A5 \uC911\u2026":"\uC218\uC815 \uC800\uC7A5",attrs:{type:"submit"},disabled:s})])]),g=t("div",{className:"profile-panel"},[h]),w=t("div",{className:"profile-panel"},[t("h3",{className:"subhead",text:"\uBCC0\uACBD \uC774\uB825"}),i.changes.length?t("ol",{className:"change-list"},i.changes.map(en)):t("p",{className:"muted",text:"\uC544\uC9C1 \uBCC0\uACBD \uC774\uB825\uC774 \uC5C6\uC5B4\uC694."})]),$=[f,g,w],R=["\uACF5\uBC29 \uC124\uC815","\uC6D0\uB798 \uC124\uC815","\uBCC0\uACBD \uC774\uB825"].map((B,D)=>t("button",{className:"profile-tab",text:B,attrs:{type:"button","aria-pressed":D===0?"true":"false"},on:{click:()=>{a.rememberProfile({panel:D}),E(D)}}}));function E(B){$.forEach((D,U)=>D.hidden=U!==B),R.forEach((D,U)=>D.setAttribute("aria-pressed",U===B?"true":"false"))}return E(l?.panel??0),t("div",{className:"sheet-backdrop"},[t("section",{className:"sheet card",attrs:{role:"dialog","aria-modal":"true","aria-labelledby":"fw-profile"}},[t("div",{className:"sheet-head"},[t("h2",{className:"section-title",text:`${i.displayName} \uD504\uB85C\uD544`,attrs:{id:"fw-profile"}}),q(i),y("\uB2EB\uAE30",()=>a.closeSheet(),{variant:"secondary"})]),t("div",{className:"profile-tabs",attrs:{"aria-label":"\uD504\uB85C\uD544 \uB0B4\uC6A9 \uC120\uD0DD"}},R),...$])])}var tn=[{id:"all",label:"\uC804\uCCB4"},{id:"character",label:"\uCE90\uB9AD\uD130"},{id:"persona",label:"\uD398\uB974\uC18C\uB098"}],Le=[{id:"all",label:"\uBAA8\uB450"},{id:"recruited",label:"\uC601\uC785\uD55C \uC8FC\uBBFC"},{id:"waiting",label:"\uCD08\uB300 \uB300\uAE30"}];function rn(e,r){let a=Le[(Le.findIndex(i=>i.id===e.filter)+1)%Le.length],n=Le.find(i=>i.id===e.filter);return t("div",{className:"search-bar"},[ze({id:"fw-resident-search",value:e.query,placeholder:"\uC774\uB984\uC73C\uB85C \uCC3E\uAE30",onSearch:i=>r.setResidentsQuery(i)}),t("button",{className:`icon-button filter${e.filter==="all"?"":" active"}`,attrs:{type:"button","aria-label":`\uBCF4\uAE30: ${n.label} (\uB204\uB974\uBA74 ${a.label})`},on:{click:()=>r.setResidentsFilter(a.id)}},[d.filter()]),e.filter==="all"?null:t("span",{className:"filter-chip",text:n.label})])}function an(e,r){return t("div",{className:"pill-tabs",attrs:{role:"tablist","aria-label":"\uC8FC\uBBFC \uC885\uB958"}},tn.map(a=>t("button",{className:`pill-tab${e.tab===a.id?" current":""}`,text:a.label,attrs:{type:"button",role:"tab","aria-selected":e.tab===a.id?"true":"false"},on:{click:()=>r.setResidentsTab(a.id)}})))}function nn(e,r){let a=J[e.field];return t("button",{className:"tag field",attrs:{type:"button","aria-label":`${e.displayName} \uC804\uBB38 \uBD84\uC57C ${a} \u2014 \uD2B9\uAE30 \uBCF4\uAE30`},on:{click:()=>r.openSheet({kind:"field",residentId:e.residentId})}},[ce[e.field]("icon tiny"),t("span",{text:a})])}function on(e,r){return t("li",{className:"resident-list-item"},[t("button",{className:"resident-list-open",attrs:{type:"button","aria-label":`${e.displayName} \uC790\uC138\uD788 \uBCF4\uAE30`},on:{click:()=>r.selectResident(e.residentId)}},[L(e),t("span",{className:"resident-list-copy"},[t("strong",{text:e.displayName}),t("span",{text:`${J[e.field]} \xB7 ${e.recruited?"\uC601\uC785 \uC644\uB8CC":"\uCD08\uB300 \uB300\uAE30"}`})]),d.chevron("icon")])])}function tt(e,r,a){return t("button",{className:"detail-action",attrs:{type:"button"},on:{click:a}},[e("icon"),t("span",{text:r})])}function sn(e,r,a){let n=a?.crew.maxBreakthrough??5,i=a?ee(a,0):0,o=a?ee(a,e.breakthrough):0,s=re(a,e.talentId),l=Object.entries(r.state.production.facilities).find(([,m])=>m.residentId===e.residentId)?.[0],p=a?.facilities.find(m=>m.id===l),c=e.recruited?p?p.field===e.field?`${p.name}\uC5D0\uC11C \uCC98\uB9AC \uC18D\uB3C4 +${O(o)}`:`${p.name}\uC5D0 \uC788\uC9C0\uB9CC \uBD84\uC57C\uAC00 \uB2EC\uB77C \uD6A8\uACFC\uAC00 \uC5C6\uC5B4\uC694.`:"\uC544\uC9C1 \uBC30\uCE58\uD558\uC9C0 \uC54A\uC558\uC5B4\uC694. \uACF5\uBC29 \uC791\uC5C5 \u2192 \uBC30\uCE58 \uBCC0\uACBD.":"\uCD08\uB300\uD558\uBA74 \uC2DC\uC124\uC5D0 \uBC30\uCE58\uD560 \uC218 \uC788\uC5B4\uC694.";return t("div",{className:"passive-block"},[t("p",{className:"passive"},[d.leaf("icon tiny"),t("strong",{text:"\uD328\uC2DC\uBE0C"}),` ${J[e.field]} \uC2DC\uC124 \uCC98\uB9AC \uC18D\uB3C4`]),s?t("p",{className:"talent-line"},[d.sparkle("icon tiny"),t("strong",{text:`\uD2B9\uAE30 ${s.name}`}),` ${s.description}`]):null,t("p",{className:"muted",text:`\uAE30\uBCF8 \uD6A8\uACFC ${O(i)} \u2192 \uD604\uC7AC ${O(o)} \xB7 ${c}`}),t("p",{className:"breakthrough"},[t("span",{text:`\uB3CC\uD30C ${e.breakthrough}/${n}`}),t("span",{className:"leaf-pips",attrs:{"aria-hidden":"true"}},Array.from({length:n},(m,u)=>t("span",{className:`pip${u<e.breakthrough?" on":""}`})))])])}function ln(e,r,a,n){return S(null,[t("div",{className:"resident-detail"},[t("span",{className:"detail-stage"},[K(e)]),t("div",{className:"detail-info"},[t("strong",{className:"detail-name",text:e.displayName}),t("span",{className:"tag-row"},[q(e),nn(e,n)]),sn(e,r,a)])]),t("div",{className:"detail-actions"},[tt(d.image,"\uC8FC\uBBFC \uADF8\uB9BC",()=>n.openResidentImage(e.residentId)),tt(d.document,"\uD504\uB85C\uD544",()=>n.openSheet({kind:"profile",residentId:e.residentId})),tt(d.heart,"\uAD00\uACC4",()=>n.openRelations(e.residentId))]),e.recruited?null:t("button",{className:"button",text:"\uCD08\uB300\uD558\uB7EC \uAC00\uAE30",attrs:{type:"button"},on:{click:()=>n.navigate("invite")}})],{className:"detail-card"})}function dn(e,r,a){let n=r.residentsView,i=Object.values(e.state.residents),o=Rt(e.state,n),s=e.state.residents[n.selectedId??""]??null;if(n.detailOpen&&s)return[t("button",{className:"outline-button residents-back",text:"\u2190 \uC8FC\uBBFC \uBAA9\uB85D",attrs:{type:"button"},on:{click:()=>a.showResidentsList()}}),ln(s,e,r.content,a)];let l=2,p=Math.max(1,Math.ceil(o.length/l)),c=Math.min(n.page??0,p-1),m=i.length===0?t("div",{className:"empty-state"},[t("p",{text:"\uC544\uC9C1 \uC8FC\uBBFC\uC774 \uC5C6\uC5B4\uC694."}),t("p",{className:"muted",text:"\uCE90\uB9AD\uD130\uB098 \uD398\uB974\uC18C\uB098\uB97C \uBD88\uB7EC\uC640 \uC774 \uC138\uACC4\uC758 \uC8FC\uBBFC\uC73C\uB85C \uB9DE\uC774\uD574 \uBCF4\uC138\uC694."})]):o.length===0?t("p",{className:"empty",text:"\uC870\uAC74\uC5D0 \uB9DE\uB294 \uC8FC\uBBFC\uC774 \uC5C6\uC5B4\uC694."}):t("ul",{className:"resident-grid"},o.slice(c*l,(c+1)*l).map(u=>on(u,a)));return[rn(n,a),t("section",{className:"card resident-board",attrs:{"aria-label":"\uC8FC\uBBFC \uBAA9\uB85D"}},[an(n,a),m,p>1?t("div",{className:"resident-pages",attrs:{"aria-label":"\uC8FC\uBBFC \uBAA9\uB85D \uD398\uC774\uC9C0"}},[t("button",{className:"outline-button",text:"\uC774\uC804",attrs:{type:"button"},disabled:c===0,on:{click:()=>a.setResidentsPage(c-1)}}),t("span",{text:`${c+1} / ${p}`,attrs:{"aria-live":"polite"}}),t("button",{className:"outline-button",text:"\uB2E4\uC74C",attrs:{type:"button"},disabled:c+1===p,on:{click:()=>a.setResidentsPage(c+1)}})]):null]),t("button",{className:"button big-action",attrs:{type:"button","data-wide":""},on:{click:()=>a.openRegister(1)}},[d.people("icon"),t("span",{text:"\uC8FC\uBBFC \uBD88\uB7EC\uC624\uAE30"})])]}function yr(e,r){let a=e.world?.state==="ready"?e.world.value:null,n=e.sheet?.kind==="profile"&&a?vr(a,e,r,e.sheet.residentId):e.sheet?.kind==="field"&&a?hr(e,a,r,e.sheet.residentId):null;return I(e,r,{top:{kind:"sub",title:"\uC8FC\uBBFC",resources:!1},backdrop:"forest",body:a?dn(a,e,r):[C("\uC138\uACC4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026")],nav:!0,sheet:n})}function rt(e,r,a){return t("div",{className:"preview-row"},[e("icon"),t("span",{text:r}),t("strong",{text:a})])}function Ee(e,r,a){let n=!!e.busy.restore,i=t("input",{className:"visually-hidden",attrs:{type:"file",accept:"application/json,.json",id:a},disabled:n,on:{change:()=>{let l=i.files?.[0];l&&r.selectRestoreFile(l),i.value=""}}}),o=e.restore,s=o?.summary;return t("div",{className:"restore"},[i,t("label",{className:"menu-row",attrs:{for:a}},[t("span",{className:"menu-icon"},[d.download()]),t("span",{className:"menu-text"},[t("span",{className:"menu-title",text:"\uBC31\uC5C5 \uBD88\uB7EC\uC624\uAE30"}),t("span",{className:"menu-detail",text:o?o.fileName:"\uC0C8 \uC138\uACC4\uB85C \uBCF5\uC6D0"})]),t("span",{className:"menu-chevron"},[d.chevron()])]),t("div",{className:"preview-box",attrs:{"aria-live":"polite"}},[t("p",{className:"preview-head"},[d.eye("icon"),t("strong",{text:"\uBCF5\uC6D0 \uBBF8\uB9AC\uBCF4\uAE30"})]),s?t("div",{className:"preview-rows"},[rt(d.residents,"\uC8FC\uBBFC",`${s.residents}\uBA85`),rt(d.pair,"\uD398\uC5B4",`${s.pairs}\uAC1C`),rt(d.image,"\uADF8\uB9BC",`${s.pictures}\uAC1C`)]):t("p",{className:"muted",text:"\uBC31\uC5C5 \uD30C\uC77C\uC744 \uACE0\uB974\uBA74 \uB2F4\uAE34 \uB0B4\uC6A9\uC744 \uBA3C\uC800 \uBCF4\uC5EC \uB4DC\uB824\uC694."})]),t("button",{className:"button big-action",attrs:{type:"button","data-wide":""},disabled:!s||n,on:{click:()=>{r.confirmRestore()}}},[d.restore("icon"),t("span",{text:n?"\uBCF5\uC6D0\uD558\uB294 \uC911\u2026":"\uC0C8 \uC138\uACC4\uB85C \uBCF5\uC6D0"})]),t("p",{className:"hint center"},[d.info("icon"),"\uD604\uC7AC \uC138\uACC4\uB294 \uB36E\uC5B4\uC4F0\uC9C0 \uC54A\uC544\uC694."])])}function cn(e){let r=new Date(e);if(Number.isNaN(r.getTime()))return"\uC54C \uC218 \uC5C6\uC74C";let a=new Intl.DateTimeFormat("ko-KR",{hour:"2-digit",minute:"2-digit",hour12:!1}).format(r);return r.toDateString()===new Date().toDateString()?`\uC624\uB298 ${a}`:`${new Intl.DateTimeFormat("ko-KR",{month:"long",day:"numeric"}).format(r)} ${a}`}function kr(e){return e>=1024*1024?`${(e/(1024*1024)).toFixed(1)} MB`:e>=1024?`${(e/1024).toFixed(1)} KB`:`${e} B`}function pn(e){let r=e.storage,a;if(!r||r.state==="loading")a=C("\uD655\uC778\uD558\uB294 \uC911\u2026");else if(r.state==="error")a=_(r.message);else{let n=[[d.image,"\uC8FC\uBBFC \uADF8\uB9BC","residentImagesBytes"],[d.landscape,"\uBC30\uACBD","backgroundsBytes"],[d.document,"\uAE30\uB85D","recordsBytes"]],i=Math.max(1,...n.map(([,,o])=>r.value[o]));a=t("div",{className:"usage-rows"},n.map(([o,s,l])=>{let p=r.value[l],c=t("span",{className:"usage-fill"});return c.style.width=p>0?`max(0.9em, ${Math.round(p/i*100)}%)`:"0",t("div",{className:"usage-row"},[o("icon"),t("span",{className:"usage-label",text:s}),t("span",{className:"usage-bar",attrs:{role:"presentation"}},[c]),t("span",{className:"usage-size",text:kr(p)})])}))}return S("\uC800\uC7A5 \uACF5\uAC04 \uC0AC\uC6A9\uB7C9",[a,t("p",{className:"hint center"},[d.info("icon"),"\uADF8\uB9BC\uC740 WebP\uB85C \uBCF4\uAD00\uD574\uC694."])],{id:"fw-usage"})}function mn(e,r){let a=!!e.busy.backup;return t("button",{className:"menu-row",attrs:{type:"button"},disabled:a,on:{click:()=>{r.downloadBackup()}}},[t("span",{className:"menu-icon"},[d.upload()]),t("span",{className:"menu-text"},[t("span",{className:"menu-title",text:a?"\uBC31\uC5C5 \uB9CC\uB4DC\uB294 \uC911\u2026":"\uBC31\uC5C5 \uB0B4\uBCF4\uB0B4\uAE30"}),t("span",{className:"menu-detail",text:"\uC138\uACC4 \xB7 \uC7AC\uD654 \xB7 \uCC3D\uACE0 \uD3EC\uD568 \xB7 \uBE44\uBC00\uD0A4 \uC81C\uC678"})]),t("span",{className:"menu-chevron"},[d.chevron()])])}function xr(e,r,a,n,i){return t("button",{className:"menu-row quiet",attrs:{type:"button"},on:{click:()=>e.navigate(r)}},[t("span",{className:"menu-icon quiet"},[a()]),t("span",{className:"menu-text"},[t("span",{className:"menu-title",text:n}),t("span",{className:"menu-detail",text:i})]),t("span",{className:"menu-chevron"},[d.chevron()])])}function Nr(e,r){let a=e.world?.state==="ready"?e.world.value:null,n=a?[t("section",{className:"card saved",attrs:{"aria-label":"\uC800\uC7A5 \uC0C1\uD0DC"}},[t("p",{className:"saved-title"},[t("span",{className:"check"},[d.check()]),"\uC800\uC7A5 \uC644\uB8CC"]),t("p",{className:"saved-time",text:`\uB9C8\uC9C0\uB9C9 \uC800\uC7A5 ${cn(a.updatedAt)}`})]),pn(e),S(null,[mn(e,r),Ee(e,r,"fw-backup-restore")],{className:"menu"}),S(null,[t("button",{className:"menu-row",attrs:{type:"button"},on:{click:()=>r.openSheet({kind:"history-cleanup"})}},[t("span",{className:"menu-icon light"},[d.image()]),t("span",{className:"menu-text"},[t("span",{className:"menu-title",text:"\uADF8\uB9BC \uC774\uB825 \uC815\uB9AC"}),t("span",{className:"menu-detail",text:"\uB2E4\uB978 \uACF3\uC5D0\uC11C \uC4F0\uB294 \uADF8\uB9BC\uC740 \uC720\uC9C0"})]),t("span",{className:"menu-chevron"},[d.chevron()])]),xr(r,"worlds",d.house,"\uB2E4\uB978 \uC138\uACC4","\uC138\uACC4 \uACE0\uB974\uAE30 \xB7 \uC0C8\uB85C \uB9CC\uB4E4\uAE30"),xr(r,"diagnostics",d.info,"\uC5F0\uACB0 \uC810\uAC80","\uC5D4\uC9C4 \uC5F0\uACB0\uACFC \uADF8\uB9BC \uC800\uC7A5 \uACBD\uB85C \uD655\uC778")],{className:"menu"})]:[C("\uC138\uACC4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026")];return I(e,r,{top:{kind:"sub",title:"\uC800\uC7A5\xB7\uBC31\uC5C5",back:{route:"settings",label:"\uC124\uC815"},resources:!1},backdrop:"wood",body:n,nav:!0,sheet:a&&e.sheet?.kind==="history-cleanup"?un(a.state,e,r):null})}function un(e,r,a){let n=Object.values(e.residents).reduce((s,l)=>s+l.image.history.length,0),i=Object.values(e.residents).flatMap(s=>s.image.history).reduce((s,l)=>s+l.bytes,0),o=!!r.busy["image-history-clear"];return t("div",{className:"sheet-backdrop"},[t("section",{className:"sheet card",attrs:{role:"dialog","aria-modal":"true","aria-labelledby":"fw-history-cleanup"}},[t("h2",{className:"section-title",text:"\uADF8\uB9BC \uC774\uB825 \uC815\uB9AC",attrs:{id:"fw-history-cleanup"}}),n?t("p",{text:`\uC8FC\uBBFC\uB4E4\uC758 \uC774\uC804 \uADF8\uB9BC ${n}\uC7A5(${kr(i)})\uC744 \uC815\uB9AC\uD574\uC694. \uC9C0\uAE08 \uC4F0\uB294 \uADF8\uB9BC\uC740 \uADF8\uB300\uB85C\uC774\uACE0, \uC815\uB9AC\uD55C \uADF8\uB9BC\uC740 '\uC774\uC804 \uADF8\uB9BC'\uC5D0\uC11C \uB418\uB3CC\uB9B4 \uC218 \uC5C6\uC5B4\uC694.`}):t("p",{className:"empty",text:"\uC815\uB9AC\uD560 \uC774\uC804 \uADF8\uB9BC\uC774 \uC5C6\uC5B4\uC694."}),t("p",{className:"hint",text:"\uB2E4\uB978 \uACF3\uC5D0\uC11C \uC4F0\uB294 \uADF8\uB9BC \uD30C\uC77C\uC740 \uAC24\uB7EC\uB9AC\uC5D0 \uADF8\uB300\uB85C \uB0A8\uC544\uC694."}),n?y(o?"\uC815\uB9AC\uD558\uB294 \uC911\u2026":`${n}\uC7A5 \uC815\uB9AC\uD558\uAE30`,()=>{a.clearImageHistory()},{disabled:o,attrs:{"data-wide":""}}):null,y("\uB2EB\uAE30",()=>a.closeSheet(),{variant:"secondary",attrs:{"data-wide":""}})])])}function fn(e,r,a){let n=!!r.busy["rename-nickname"],i=e.state.settings.playerNickname,o=t("input",{className:"input",attrs:{id:"fw-set-nick",maxlength:"24",autocomplete:"off",value:i}});return t("form",{className:"setting-row",on:{submit:s=>{s.preventDefault();let l=o.value.trim();l&&l!==i&&a.runCommand("rename-nickname","settings.update",{playerNickname:o.value})}}},[d.leaf("icon row-leaf"),t("label",{className:"setting-label",text:"\uB2C9\uB124\uC784",attrs:{for:"fw-set-nick"}}),t("span",{className:"setting-field"},[o,t("button",{className:"button small",text:n?"\uC800\uC7A5 \uC911\u2026":"\uC218\uC815",attrs:{type:"submit"},disabled:n})])])}function gn(e){return t("div",{className:"setting-row"},[d.leaf("icon row-leaf"),t("span",{className:"setting-label",text:"\uD604\uC2E4 \uB0A0\uC528"}),t("span",{className:"setting-field"},[t("span",{className:"input readonly"},[d.weather("icon"),t("span",{text:"\uB3C4\uC2DC \uBBF8\uC124\uC815"})]),H(e,"weather",{className:"button small",label:"\uD604\uC2E4 \uB0A0\uC528 \uBCC0\uACBD",children:[t("span",{text:"\uBCC0\uACBD"})]})])])}function bn(e,r){let a=t("input",{className:"slider",attrs:{id:"fw-font-size",type:"range",min:String(X.min),max:String(X.max),step:String(X.step),value:String(e.fontSize),"aria-valuetext":`${e.fontSize}px`},on:{change:()=>r.setFontSize(Number(a.value))}});return t("div",{className:"setting-block"},[t("div",{className:"setting-row slider-row"},[d.leaf("icon row-leaf"),t("label",{className:"setting-label",text:"\uAE00\uC790 \uD06C\uAE30",attrs:{for:"fw-font-size"}}),a,t("span",{className:"slider-value",text:`${e.fontSize}px`})]),t("p",{className:"font-preview",text:"\uC774\uB807\uAC8C \uD45C\uC2DC\uB3FC\uC694."})])}function hn(e,r){let a=[{id:"auto",label:`\uC790\uB3D9 (${ht[Pe(new Date)]})`},{id:"spring",label:"\uBD04"},{id:"summer",label:"\uC5EC\uB984"},{id:"autumn",label:"\uAC00\uC744"},{id:"winter",label:"\uACA8\uC6B8"}];return t("div",{className:"setting-block"},[t("div",{className:"setting-row"},[d.leaf("icon row-leaf"),t("span",{className:"setting-label",text:"\uACC4\uC808",attrs:{id:"fw-season-label"}})]),t("div",{className:"chip-row season-chips",attrs:{role:"group","aria-labelledby":"fw-season-label"}},a.map(n=>t("button",{className:`pill-tab${e.seasonChoice===n.id?" current":""}`,text:n.label,attrs:{type:"button","aria-pressed":e.seasonChoice===n.id?"true":"false"},on:{click:()=>r.setSeasonChoice(n.id)}}))),t("p",{className:"hint",text:"\uC790\uB3D9\uC740 \uC624\uB298 \uB0A0\uC9DC(\uBD81\uBC18\uAD6C)\uB97C \uB530\uB77C\uC694. \uB3C4\uC2DC\uB97C \uC120\uD0DD\uD558\uB294 \uD604\uC2E4 \uB0A0\uC528\uB294 \uC900\uBE44 \uC911\uC774\uC5D0\uC694. \uACC4\uC808\uC740 \uADF8\uB9BC\uB9CC \uBC14\uAFB8\uACE0 \uC0DD\uC0B0 \xB7 \uD310\uB9E4 \xB7 \uC120\uBB3C\uC5D0\uB294 \uC601\uD5A5\uC774 \uC5C6\uC5B4\uC694."})])}function Sr(e,r,a,n,i){return H(e,r,{className:"toggle-row",label:n,children:[t("span",{className:"toggle-icon"},[a("icon")]),t("span",{className:"toggle-text"},[t("strong",{text:n}),t("span",{text:i})]),t("span",{className:"switch off"},[t("span",{className:"knob"})])]})}function We(e,r,a,n){let i=[t("span",{className:"manage-icon"},[r("icon")]),t("span",{className:"manage-title",text:a}),t("span",{className:"menu-chevron"},[d.chevron()])];return"route"in n?t("button",{className:"manage-row",attrs:{type:"button"},on:{click:()=>e.navigate(n.route)}},i):H(e,n.feature,{className:"manage-row",label:a,children:i})}function $r(e,r){let a=e.world?.state==="ready"?e.world.value:null,n=a?[S("\uB0B4 \uACF5\uBC29",[fn(a,e,r),gn(r)],{id:"fw-mine"}),S("\uD45C\uC2DC",[bn(e,r),hn(e,r),Sr(r,"weather-effects",d.leaf,"\uB0A0\uC528 \uD6A8\uACFC","\uACF5\uBC29 \uBC30\uACBD\uC5D0 \uD604\uC7AC \uB0A0\uC528\uB97C \uBC18\uC601\uD574\uC694."),Sr(r,"auto-read",d.book,"\uC790\uB3D9 \uC77D\uAE30","\uC774\uC57C\uAE30\uB97C \uC790\uB3D9\uC73C\uB85C \uB118\uACA8\uC694.")],{id:"fw-display"}),S("\uAD00\uB9AC",[We(r,d.image,"\uC8FC\uBBFC \uADF8\uB9BC \uAD00\uB9AC",{route:"residents"}),We(r,d.flower,"AI \uC9C0\uCE68 \uAD00\uB9AC",{feature:"ai-guidelines"}),We(r,d.people,"\uAE30\uC5B5 \uAD00\uB9AC",{feature:"memory"}),We(r,d.folder,"\uC800\uC7A5 \xB7 \uBC31\uC5C5",{route:"backup"}),t("div",{className:"note-box"},[d.clock("icon"),t("span",{},[t("strong",{text:"\uBBF8\uC811\uC18D \uB204\uC801 \uC0C1\uD55C 72\uC2DC\uAC04"}),t("span",{text:"72\uC2DC\uAC04\uC774 \uC9C0\uB098\uBA74 \uC77C\uBD80 \uC790\uB3D9 \uC9C4\uD589\uC774 \uBA48\uCDB0\uC694."})])])],{id:"fw-manage"}),t("p",{className:"footnote",text:"\uC790\uB3D9\uD654 \uADDC\uCE59\uC740 \uC791\uC5C5 \uD654\uBA74\uC5D0\uC11C \uBC14\uAFC0 \uC218 \uC788\uC5B4\uC694."})]:[C("\uC138\uACC4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026")];return I(e,r,{top:{kind:"sub",title:"\uC124\uC815",back:{route:"home",label:"\uD648"},resources:!1},backdrop:"wood",body:n,nav:!0})}function wn(e,r,a,n,i){let o=0;for(let s of Object.values(e.state.production.facilities))if(!(!s.unlocked||s.mode!=="auto"))for(let l of s.rules){let p=r.recipes.find(c=>c.id===l.recipeId);l.enabled&&p&&Object.keys(p.outputs)[0]===a&&(o=Math.max(o,l.targetStock))}return{floor:Math.max(n,i?0:o,e.state.production.protectedStock[a]??0),target:o}}function Cr(e,r,a,n){let i=new Date().toISOString().slice(0,10),o=r.state.production.sales,l=a.items.filter(p=>(r.state.inventory[p.id]??0)>0||r.state.production.autoSell[p.id]?.enabled).map(p=>{let c=r.state.production.autoSell[p.id]??{enabled:!1,keep:0,dailyMax:10},m=ie(`fw-keep-${p.id}`,c.keep,0,999,{label:`${p.name} \uB0A8\uAE38 \uC218\uB7C9`}),u=ie(`fw-daily-${p.id}`,c.dailyMax,1,999,{label:`${p.name} \uD558\uB8E8 \uCD5C\uB300`}),h=t("input",{attrs:{type:"checkbox",id:`fw-continuous-${p.id}`}});h.checked=!!c.continuous;let{floor:f,target:g}=wn(r,a,p.id,c.keep,!!(c.continuous&&c.enabled)),w=o.day===i?o.sold[p.id]??0:0,$=!!e.busy[`auto-sell:${p.id}`],R=E=>{n.setAutoSell(p.id,{enabled:E,keep:m.read(),dailyMax:u.read(),continuous:h.checked})};return t("li",{className:`auto-sell-row${c.enabled?" on":""}`},[t("div",{className:"auto-sell-head"},[W(p.id),t("span",{className:"protect-name"},[t("strong",{text:p.name}),t("small",{className:"muted",text:`\uBCF4\uC720 ${r.state.inventory[p.id]??0} \xB7 1\uAC1C ${p.sellPrice} G \xB7 \uC624\uB298 \uD310\uB9E4 ${w}`})]),t("span",{className:`switch ${c.enabled?"on":"off"}`},[t("span",{className:"knob"}),t("span",{className:"switch-label",text:c.enabled?"\uCF1C\uC9D0":"\uAEBC\uC9D0"})])]),t("div",{className:"auto-sell-fields"},[t("label",{className:"field-label",text:"\uD310\uB9E4 \uD6C4 \uB0A8\uAE38 \uC218\uB7C9",attrs:{for:`fw-keep-${p.id}`}}),m.node,t("label",{className:"field-label",text:"\uD558\uB8E8 \uCD5C\uB300 \uD310\uB9E4\uB7C9",attrs:{for:`fw-daily-${p.id}`}}),u.node]),t("label",{attrs:{for:`fw-continuous-${p.id}`}},[h," \uD310\uB9E4\uD560 \uB9CC\uD07C \uACC4\uC18D \uC0DD\uC0B0\uD558\uAE30"]),t("p",{className:"hint",text:c.enabled&&c.continuous?`\uD604\uC7AC \uD310\uB9E4 \uC2DC ${f}\uAC1C \uC774\uC0C1 \uB0A8\uACA8\uC694. \uD310\uB9E4 \uD55C\uB3C4\uC5D0 \uB3C4\uB2EC\uD558\uBA74 \uC77C\uBC18 \uC0DD\uC0B0 \uBAA9\uD45C ${g}\uAC1C\uB97C \uB530\uB985\uB2C8\uB2E4.`:`\uD604\uC7AC ${f}\uAC1C \uC774\uC0C1 \uB0A8\uACA8\uC694 (\uBCF4\uAD00\uB7C9 \xB7 \uC0DD\uC0B0 \uBAA9\uD45C ${g} \xB7 \uBCF4\uD638 \uC7AC\uACE0 \uC911 \uAC00\uC7A5 \uD070 \uAC12).`}),t("div",{className:"row-actions"},[y($?"\uC800\uC7A5 \uC911\u2026":c.enabled?"\uC124\uC815 \uC800\uC7A5":"\uCF1C\uAE30",()=>R(!0),{disabled:$}),c.enabled?y("\uB044\uAE30",()=>R(!1),{variant:"secondary",disabled:$}):null])])});return F("fw-auto-sell","\uC790\uB3D9 \uD310\uB9E4",[t("p",{className:"muted",text:"\uCF20 \uD488\uBAA9\uC744 \uD558\uB8E8(UTC \uAE30\uC900) \uD310\uB9E4 \uD55C\uB3C4\uAE4C\uC9C0 \uD314\uC544\uC694. \uACC4\uC18D \uC0DD\uC0B0\uC744 \uC120\uD0DD\uD558\uBA74 \uB0A8\uAE38 \uC218\uB7C9\uACFC \uBCF4\uD638 \uC7AC\uACE0\uB97C \uC9C0\uD0A4\uBA70 \uD310\uB9E4\uD560 \uB9CC\uD07C \uB9CC\uB4E4\uC5B4\uC694."}),l.length?t("ul",{className:"protect-list"},l):t("p",{className:"empty",text:"\uCC3D\uACE0\uAC00 \uBE44\uC5B4 \uC788\uC5B4\uC694."}),y("\uB2EB\uAE30",()=>n.closeSheet(),{variant:"secondary",attrs:{"data-wide":""}})])}function Ir(e,r){let a=new Map(r?.items.map((n,i)=>[n.id,i]));return Object.entries(e.state.inventory).filter(([,n])=>n>0).sort(([n],[i])=>(a.get(n)??999)-(a.get(i)??999)).map(([n,i])=>({itemId:n,amount:i,name:j(r,n)}))}function vn(e,r){let a=(n,i,o)=>t("button",{className:`big-tab${e.facilitiesTab===n?" current":""}`,attrs:{type:"button",role:"tab","aria-selected":e.facilitiesTab===n?"true":"false"},on:{click:()=>r.setFacilitiesTab(n)}},[o,t("span",{text:i})]);return t("div",{className:"big-tabs",attrs:{role:"tablist","aria-label":"\uC2DC\uC124\uACFC \uCC3D\uACE0"}},[a("facilities","\uC2DC\uC124",d.house("icon big")),a("storage","\uCC3D\uACE0",d.box("icon big"))])}function yn(e,r,a,n){let i=e.work.facilityId,o=a.state.production.facilities[i],s=Y(r,i),l=r.production.maxLevel,p=o.level>=l,c=p?null:r.production.upgradeCosts[o.level-1],m=!!e.busy[`upgrade:${i}:${o.level}`],u=c!==null&&a.state.wallet.gold<c,h=!o.unlocked,f=te(r,a.state,i);return S(null,[t("div",{className:"chip-row",attrs:{role:"group","aria-label":"\uC2DC\uC124 \uACE0\uB974\uAE30"}},r.facilities.map(g=>t("button",{className:`pill-tab${g.id===i?" current":""}`,attrs:{type:"button","aria-pressed":g.id===i?"true":"false","aria-label":a.state.production.facilities[g.id]?.unlocked?g.name:`${g.name} (\uD574\uAE08 \uC804)`},on:{click:()=>n.selectFacility(g.id)}},[t("span",{text:g.name}),a.state.production.facilities[g.id]?.unlocked?null:d.lock("icon tiny")]))),t("div",{className:"facility"},[t("span",{className:`facility-picture${h?" closed":""}`},[ue(i,"huge")]),t("div",{className:"facility-info"},[t("strong",{className:"facility-name",text:s?.name??i}),t("span",{className:"facility-level"},[`Lv. ${o.level}`,p?null:t("span",{className:"level-next",text:` \u2192 Lv. ${o.level+1}`})]),t("div",{className:"effect-row"},[t("span",{text:"\uCC98\uB9AC \uC18D\uB3C4"}),t("span",{},[`+${be(r,o.level)}%`,p?null:t("span",{className:"level-next",text:` \u2192 +${be(r,o.level+1)}%`})])]),t("div",{className:"effect-row"},[t("span",{text:"\uC791\uC5C5 \uBC29\uC2DD"}),t("span",{text:h?"\uD574\uAE08 \uC804":o.mode==="auto"?"\uC790\uB3D9 \uC6B4\uC601":"\uC9C0\uC815 \uD69F\uC218"})]),t("div",{className:"effect-row"},[t("span",{text:"\uC8FC\uBBFC \uD6A8\uACFC"}),t("span",{text:`+${O(f.total)}${f.resident?` (${f.resident.displayName})`:""}`})]),t("p",{className:"muted",text:s?.description??""}),h?t("p",{className:"hint",text:"\uACF5\uBC29 \uC791\uC5C5\uC5D0\uC11C \uD574\uAE08 \uC870\uAC74\uC744 \uCC44\uC6B0\uACE0 \uC2DC\uC124\uC744 \uC5F4\uBA74 \uAC15\uD654\uD560 \uC218 \uC788\uC5B4\uC694."}):null,t("button",{className:"gold-button",attrs:{type:"button"},disabled:h||p||m||u,on:{click:()=>{n.upgradeFacility(i,o.level)}}},p?[t("span",{text:"\uCD5C\uACE0 \uB2E8\uACC4"})]:[t("span",{className:"coin"}),t("span",{text:m?"\uAC15\uD654\uD558\uB294 \uC911\u2026":`${c.toLocaleString("ko-KR")} G \xB7 \uAC15\uD654`})]),u?t("p",{className:"hint",text:`\uACE8\uB4DC\uAC00 ${(c-a.state.wallet.gold).toLocaleString("ko-KR")} G \uBD80\uC871\uD574\uC694.`}):null])])],{className:"facility-card"})}function xn(e,r){let a=Object.values(e.state.production.autoSell).filter(n=>n.enabled).length;return t("button",{className:"toggle-row",attrs:{type:"button","aria-label":`\uC790\uB3D9 \uD310\uB9E4 ${a?`\uCF1C\uC9D0 (${a}\uAC1C \uD488\uBAA9)`:"\uAEBC\uC9D0"} \u2014 \uC124\uC815 \uC5F4\uAE30`},on:{click:()=>r.openSheet({kind:"auto-sell"})}},[t("span",{className:"toggle-icon"},[d.gear("icon")]),t("span",{className:"toggle-text"},[t("strong",{text:a?`\uC790\uB3D9 \uD310\uB9E4 \xB7 ${a}\uAC1C \uD488\uBAA9`:"\uC790\uB3D9 \uD310\uB9E4"}),t("span",{text:"\uBCF4\uD638 \xB7 \uC608\uC57D \uC7AC\uACE0\uB294 \uC0AC\uC6A9\uD558\uC9C0 \uC54A\uC544\uC694."})]),t("span",{className:`switch ${a?"on":"off"}`},[t("span",{className:"knob"}),t("span",{className:"switch-label",text:a?"\uCF1C\uC9D0":"\uAEBC\uC9D0"})])])}function kn(e,r,a){let n=Ir(e,r),i=e.state.production.protectedStock;return S(null,[t("div",{className:"card-head"},[t("div",{},[t("h2",{className:"section-title",text:"\uC7AC\uACE0 \uBCF4\uD638",attrs:{id:"fw-protect"}}),t("p",{className:"muted",text:"\uC9C0\uC815\uD55C \uC218\uB7C9\uC740 \uC81C\uC791\uACFC \uD310\uB9E4\uC5D0 \uC0AC\uC6A9\uD558\uC9C0 \uC54A\uC544\uC694."})]),t("button",{className:"outline-button",attrs:{type:"button"},on:{click:()=>a.openSheet({kind:"protect-edit"})}},[d.pencil("icon"),t("span",{text:"\uD3B8\uC9D1\uD558\uAE30"})])]),n.length===0?t("p",{className:"empty",text:"\uCC3D\uACE0\uAC00 \uBE44\uC5B4 \uC788\uC5B4\uC694."}):t("table",{className:"stock"},[t("thead",{},[t("tr",{},["\uC544\uC774\uD15C","\uBCF4\uC720 \uC218\uB7C9","\uBCF4\uD638 \uC7AC\uACE0","\uC608\uC57D \uC7AC\uACE0","\uC0AC\uC6A9 \uAC00\uB2A5"].map(o=>t("th",{text:o,attrs:{scope:"col"}})))]),t("tbody",{},n.map(o=>{let s=i[o.itemId]??0;return t("tr",{},[t("th",{attrs:{scope:"row"}},[W(o.itemId),o.name]),t("td",{className:"num",text:o.amount.toLocaleString("ko-KR")}),t("td",{className:`num${s?" protected":""}`,text:s?String(s):"\u2013"}),t("td",{className:"num",text:"\u2013"}),t("td",{className:"num available",text:Math.max(0,o.amount-s).toLocaleString("ko-KR")})])}))]),xn(e,a)],{id:"fw-protect"})}function Nn(e,r,a){let n=Ir(e,r);return S("\uCC3D\uACE0",[n.length===0?t("p",{className:"empty",text:"\uCC3D\uACE0\uAC00 \uBE44\uC5B4 \uC788\uC5B4\uC694."}):t("ul",{className:"storage-grid"},n.map(i=>t("li",{className:"storage-item"},[W(i.itemId,"big"),t("span",{className:"storage-name",text:i.name}),t("strong",{text:i.amount.toLocaleString("ko-KR")}),t("button",{className:"outline-button small",attrs:{type:"button","aria-label":`${i.name} \uD314\uAE30`},on:{click:()=>a.openSheet({kind:"sell",itemId:i.itemId})}},[t("span",{text:"\uD314\uAE30"})])])))],{id:"fw-storage"})}function Sn(e,r,a,n){let i=a.production.protectedStock,o=a.items.map(s=>{let l=ie(`fw-protect-${s.id}`,r.state.production.protectedStock[s.id]??0,i.min,i.max),p=!!e.busy[`protect:${s.id}`];return t("li",{className:"protect-row"},[W(s.id),t("span",{className:"protect-name"},[t("strong",{text:s.name}),t("small",{className:"muted",text:`\uBCF4\uC720 ${r.state.inventory[s.id]??0}`})]),l.node,y(p?"\uC800\uC7A5 \uC911\u2026":"\uC800\uC7A5",()=>{n.setProtected(s.id,l.read())},{disabled:p,attrs:{"aria-label":`${s.name} \uBCF4\uD638 \uC218\uB7C9 \uC800\uC7A5`}})])});return t("div",{className:"sheet-backdrop"},[t("section",{className:"sheet card",attrs:{role:"dialog","aria-modal":"true","aria-labelledby":"fw-protect-edit"}},[t("h2",{className:"section-title",text:"\uC7AC\uACE0 \uBCF4\uD638 \uD3B8\uC9D1",attrs:{id:"fw-protect-edit"}}),t("p",{className:"muted",text:"\uBCF4\uD638\uD55C \uC218\uB7C9\uC740 \uC790\uB3D9 \uC81C\uC791\uACFC \uD310\uB9E4\uC5D0 \uC4F0\uC9C0 \uC54A\uC544\uC694. 0\uC774\uBA74 \uBCF4\uD638\uD558\uC9C0 \uC54A\uC544\uC694."}),t("ul",{className:"protect-list"},o),y("\uB2EB\uAE30",()=>n.closeSheet(),{variant:"secondary",attrs:{"data-wide":""}})])])}function $n(e,r,a,n,i){let o=a.items.find(m=>m.id===i),s=r.state.inventory[i]??0,l=Math.max(0,s-(r.state.production.protectedStock[i]??0)),p=ie("fw-sell-amount",Math.min(l,1),l?1:0,l),c=!!e.busy[`sell:${i}`];return t("div",{className:"sheet-backdrop"},[t("section",{className:"sheet card",attrs:{role:"dialog","aria-modal":"true","aria-labelledby":"fw-sell"}},[t("h2",{className:"section-title",text:`${o?.name??i} \uD314\uAE30`,attrs:{id:"fw-sell"}}),t("p",{className:"muted",text:`1\uAC1C ${o?.sellPrice??0} G \xB7 \uD314 \uC218 \uC788\uB294 \uC591 ${l}\uAC1C (\uBCF4\uC720 ${s}\uAC1C, \uBCF4\uD638\uBD84 \uC81C\uC678)`}),l?p.node:t("p",{className:"empty",text:"\uBCF4\uD638\uBD84\uC744 \uBE7C\uBA74 \uD314 \uC218 \uC788\uB294 \uC591\uC774 \uC5C6\uC5B4\uC694."}),l?y(c?"\uD30C\uB294 \uC911\u2026":"\uD314\uAE30",()=>{n.sell(i,p.read())},{disabled:c,attrs:{"data-wide":""}}):null,y("\uB2EB\uAE30",()=>n.closeSheet(),{variant:"secondary",attrs:{"data-wide":""}})])])}function Rr(e,r){let a=e.world?.state==="ready"?e.world.value:null,n=e.content,i=a&&n,o=i&&e.sheet?.kind==="protect-edit"?Sn(e,a,n,r):i&&e.sheet?.kind==="sell"?$n(e,a,n,r,e.sheet.itemId):i&&e.sheet?.kind==="auto-sell"?Cr(e,a,n,r):null;return I(e,r,{top:{kind:"sub",title:"\uC2DC\uC124\uACFC \uCC3D\uACE0",back:{route:"work",label:"\uACF5\uBC29 \uC791\uC5C5"},resources:!0},backdrop:"forest",body:i?[vn(e,r),...e.facilitiesTab==="facilities"?[yn(e,n,a,r),kn(a,n,r)]:[Nn(a,n,r)]]:[C("\uC138\uACC4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026")],nav:!0,sheet:o})}function Ar(e,r,a,n,i){let o=Y(a,i),s=r.state.production.facilities[i]?.residentId??null,l=!!e.busy[`assign:${i}`],p=u=>Object.entries(r.state.production.facilities).find(([,h])=>h.residentId===u)?.[0]??null,c=Object.values(r.state.residents).filter(u=>u.recruited).sort((u,h)=>+(h.field===o?.field)-+(u.field===o?.field)||u.displayName.localeCompare(h.displayName,"ko")),m=te(a,r.state,i);return F("fw-assign",`${o?.name??"\uC2DC\uC124"} \uBC30\uCE58 \uBCC0\uACBD`,[t("p",{className:"muted",text:`${o?J[o.field]:""} \uBD84\uC57C \uC8FC\uBBFC\uC744 \uB450\uBA74 \uCC98\uB9AC \uC18D\uB3C4\uAC00 \uBE68\uB77C\uC838\uC694. \uC9C0\uAE08 \uC791\uC5C5\uC740 \uC2DC\uC791\uD55C \uC18D\uB3C4 \uADF8\uB300\uB85C \uB05D\uB098\uACE0, \uB2E4\uC74C \uD68C\uCC28\uBD80\uD130 \uC801\uC6A9\uB3FC\uC694. \uD398\uC5B4 \uB450 \uC0AC\uB78C\uC774 \uBAA8\uB450 \uBC30\uCE58\uB418\uBA74 \uBAA8\uB4E0 \uC2DC\uC124 +${O(a.crew.setBonusPerPair)}(\uCD5C\uB300 ${O(a.crew.setBonusMax)}).`}),t("p",{className:"assign-now"},[t("strong",{text:"\uC9C0\uAE08 "}),m.resident?m.resident.displayName:"\uBC30\uCE58\uD55C \uC8FC\uBBFC \uC5C6\uC74C",` \xB7 \uC8FC\uBBFC \uD6A8\uACFC +${O(m.total)}`]),c.length===0?t("p",{className:"empty",text:"\uACF5\uBC29\uC5D0 \uC628 \uC8FC\uBBFC\uC774 \uC5C6\uC5B4\uC694. \uCD08\uB300\uB85C \uC8FC\uBBFC\uC744 \uB9DE\uC774\uD574 \uC8FC\uC138\uC694."}):t("ul",{className:"pick-list"},c.map(u=>{let h=u.field===o?.field,f=p(u.residentId),g=re(a,u.talentId),w=[h?`+${O(ee(a,u.breakthrough))}${g?` \xB7 \uD2B9\uAE30 ${g.name}: ${g.description}`:""}`:`${J[u.field]} \uBD84\uC57C\uB77C \uD6A8\uACFC \uC5C6\uC74C`,f&&f!==i?`${Y(a,f)?.name??""}\uC5D0\uC11C \uC62E\uACA8 \uC640\uC694`:""].filter(Boolean).join(" \xB7 ");return t("li",{},[t("button",{className:`pick-row${u.residentId===s?" selected":""}`,attrs:{type:"button","aria-pressed":u.residentId===s?"true":"false"},disabled:l||u.residentId===s,on:{click:()=>{n.assignResident(i,u.residentId)}}},[L(u),t("strong",{text:u.displayName}),q(u),t("small",{className:h?"good":"muted",text:w})])])})),s?y("\uBC30\uCE58 \uD574\uC81C",()=>{n.assignResident(i,null)},{variant:"secondary",disabled:l}):null,y("\uB2EB\uAE30",()=>n.closeSheet(),{variant:"secondary",attrs:{"data-wide":""}})])}function Mr(e,r,a,n,i){let o=a.state.production.facilities[n],s=r.recipes.filter(R=>R.facilityId===n),l=Ot(r,o.level),p=o.queue.length>=l,c=e.work.queueRecipe[n]??s[0]?.id??"",m=Z(r,c),u=t("p",{className:"hint"}),h=te(r,a.state,n),f=R=>{let E=m?Object.entries(Ce(m,h).inputs):[];u.textContent=E.length?`\uC608\uC0C1 \uC7AC\uB8CC ${E.map(([B,D])=>`${j(r,B)} ${D*R}`).join(" \xB7 ")} \u2014 \uD55C \uD68C\uCC28\uC529 \uC2DC\uC791\uD560 \uB54C \uAEBC\uB0B4\uC694. \uC7AC\uB8CC \uD655\uBCF4\uB97C \uBBF8\uB9AC \uBCF4\uC7A5\uD558\uC9C0 \uC54A\uC544\uC694.`:"\uC7AC\uB8CC \uC5C6\uC774 \uC232\uC5D0\uC11C \uBC14\uB85C \uBAA8\uC544\uC694."},g=r.production.queueCount,w=ie(`fw-queue-count-${n}`,1,g.min,g.max,{label:"\uD69F\uC218",onChange:f});f(1);let $=!!e.busy[`queue:${n}`];return t("div",{className:"plan-block queue"},[t("span",{className:"plan-label"},["\uC9C0\uC815 \uD69F\uC218 \uB300\uAE30\uC5F4 ",t("small",{text:`(${o.queue.length}/${l}\uCE78 \xB7 \uC704\uC5D0\uC11C\uBD80\uD130 \uCC28\uB840\uB85C \uB9CC\uB4E4\uC5B4\uC694)`})]),o.queue.length===0?t("p",{className:"empty",text:"\uB300\uAE30\uC5F4\uC774 \uBE44\uC5B4 \uC788\uC5B4\uC694."}):t("ol",{className:"queue-list"},o.queue.map((R,E)=>{let B=Z(r,R.recipeId),D=B?Object.keys(B.outputs)[0]:"",U=!!e.busy[`queue-remove:${R.entryId}`];return t("li",{className:"queue-row"},[t("span",{className:"rank",text:String(E+1)}),W(D),t("span",{className:"queue-name"},[t("strong",{text:B?.name??R.recipeId}),t("small",{className:"muted",text:`\uC2DC\uC791 ${R.started} / ${R.total}\uD68C`})]),t("button",{className:"outline-button small",attrs:{type:"button","aria-label":`${B?.name??""} \uB0A8\uC740 \uD69F\uC218 \uBE7C\uAE30`},disabled:U,on:{click:()=>{i.removeQueue(n,R.entryId)}}},[t("span",{text:"\uBE7C\uAE30"})])])})),t("div",{className:"queue-add"},[t("div",{className:"chip-row",attrs:{role:"group","aria-label":"\uC81C\uC791\uBC95 \uACE0\uB974\uAE30"}},s.map(R=>t("button",{className:`pill-tab${R.id===c?" current":""}`,attrs:{type:"button","aria-pressed":R.id===c?"true":"false"},on:{click:()=>i.selectQueueRecipe(n,R.id)}},[W(Object.keys(R.outputs)[0]),t("span",{text:R.name})]))),w.node,u,t("button",{className:"button",attrs:{type:"button","data-wide":""},disabled:$||p||!m,on:{click:()=>{i.addQueue(n,c,w.read())}}},[d.plus("icon"),t("span",{text:p?"\uB300\uAE30\uC5F4\uC774 \uAC00\uB4DD \uCC3C\uC5B4\uC694":$?"\uCD94\uAC00\uD558\uB294 \uC911\u2026":"\uB300\uAE30\uC5F4\uC5D0 \uCD94\uAC00"})])])])}var Cn=[{field:"gather",label:"\uCC44\uC9D1",icon:d.leaf},{field:"grow",label:"\uC7AC\uBC30",icon:d.sprout},{field:"survey",label:"\uC870\uC0AC",icon:d.search},{field:"process",label:"\uAC00\uACF5",icon:d.jar},{field:"craft",label:"\uC81C\uC791",icon:d.hammer}];function Tr(e,r,a,n){return t("div",{className:"field-tabs",attrs:{role:"tablist","aria-label":"\uC791\uC5C5 \uBD84\uC57C"}},Cn.map(i=>{let o=e.facilities.find(p=>p.field===i.field);if(!o)return null;let s=o.id===a,l=r.state.production.facilities[o.id]?.unlocked??!1;return t("button",{className:`field-tab${s?" current":""}${l?"":" closed"}`,attrs:{type:"button",role:"tab","aria-selected":s?"true":"false","aria-label":l?i.label:`${i.label} (\uD574\uAE08 \uC804)`},on:{click:()=>n.selectFacility(o.id)}},[i.icon("icon field-glyph"),t("span",{text:i.label}),l?null:t("span",{className:"lock-tag"},[d.lock("icon tiny")])])}))}function In(e,r,a,n){let i=!!e.busy[`mode:${r}`],o=(s,l)=>t("button",{className:`segment${a.mode===s?" selected":""}`,text:l,attrs:{type:"button","aria-pressed":a.mode===s?"true":"false"},disabled:i,on:{click:()=>a.mode===s?void 0:void n.setMode(r,s)}});return t("div",{className:"segmented",attrs:{role:"group","aria-label":"\uC791\uC5C5 \uBC29\uC2DD"}},[o("auto","\uC790\uB3D9 \uC6B4\uC601"),o("count","\uC9C0\uC815 \uD69F\uC218")])}function Rn(e,r,a,n,i){let o=Y(r,n),s=jt(r,a.state,n),l=s.every(c=>c.met),p=!!e.busy[`unlock:${n}`];return S(null,[t("div",{className:"facility-entry"},[t("span",{className:"facility-open closed"},[t("span",{className:"facility-art closed"},[ue(n),t("span",{className:"facility-lock"},[d.lock("icon")])]),t("span",{className:"facility-text"},[t("strong",{text:`${o?.name??n} \xB7 \uD574\uAE08 \uC804`}),t("span",{text:o?.description??""})])])]),t("div",{className:"plan-block"},[t("span",{className:"plan-label",text:"\uD574\uAE08 \uC870\uAC74"}),t("ul",{className:"unlock-list"},s.map(c=>t("li",{className:c.met?"met":""},[(c.met?d.check:d.hourglass)("icon"),t("span",{text:c.text}),t("strong",{text:`${Math.min(c.have,c.need)} / ${c.need}`})])))]),t("button",{className:"button",attrs:{type:"button","data-wide":""},disabled:!l||p,on:{click:()=>{i.unlockFacility(n)}}},[t("span",{text:p?"\uC5EC\uB294 \uC911\u2026":l?"\uC2DC\uC124 \uC5F4\uAE30":"\uC870\uAC74\uC744 \uCC44\uC6B0\uBA74 \uC5F4 \uC218 \uC788\uC5B4\uC694"})])],{className:"work-card"})}function An(e,r,a,n,i){let o=Y(e,a),s=te(e,r.state,a);return t("div",{className:"facility-entry"},[t("button",{className:"facility-open",attrs:{type:"button","aria-label":`${o?.name??"\uC2DC\uC124"} \u2014 \uC2DC\uC124\uACFC \uCC3D\uACE0 \uC5F4\uAE30`},on:{click:()=>i.navigate("facilities")}},[t("span",{className:"facility-art"},[ue(a)]),t("span",{className:"facility-text"},[t("strong",{text:`${o?.name??a} Lv. ${n.level}`}),t("span",{text:`${o?.description??""} \uCC98\uB9AC \uC18D\uB3C4 +${be(e,n.level)}%`}),t("span",{className:"crew-line"},[s.resident?L(s.resident):null,s.resident?`${s.resident.displayName} \xB7 ${s.matches?`+${O(s.passive)}${s.talent?` \xB7 \uD2B9\uAE30 ${s.talent.name}`:""}`:"\uBD84\uC57C\uAC00 \uB2EC\uB77C \uD6A8\uACFC \uC5C6\uC74C"}`:"\uBC30\uCE58\uD55C \uC8FC\uBBFC \uC5C6\uC74C",s.set?` \xB7 \uC138\uD2B8 +${O(s.set)}`:""])])]),t("button",{className:"outline-button",attrs:{type:"button","aria-label":`${o?.name??"\uC2DC\uC124"} \uBC30\uCE58 \uBCC0\uACBD`},on:{click:()=>i.openSheet({kind:"assign",facilityId:a})}},[d.swap("icon"),t("span",{text:"\uBC30\uCE58 \uBCC0\uACBD"})])])}function Mn(e,r,a,n){let i=r?Z(e,r.recipeId):null;if(!i)return t("div",{className:"recipe"},[t("span",{className:"recipe-art"},[d.jar("icon big")]),t("span",{className:"recipe-text"},[t("strong",{text:"\uC81C\uC791\uBC95"}),t("span",{text:"\uC544\uB798 \uC6B0\uC120\uC21C\uC704\uC5D0\uC11C \uC81C\uC791\uBC95\uC744 \uCD94\uAC00\uD574 \uC8FC\uC138\uC694."})])]);let o=Object.keys(i.outputs)[0],s=Ce(i,n),l=Pt(e,i,a,s.extraBonus),p=Object.entries(s.inputs).map(([c,m])=>`${j(e,c)} ${m}`);return t("div",{className:"recipe"},[t("span",{className:"recipe-art"},[W(o,"big")]),t("span",{className:"recipe-text"},[t("strong",{text:i.name}),t("span",{text:i.description}),t("span",{className:"recipe-flow",text:`${p.length?`${p.join(" \xB7 ")} \u2192 `:""}${Object.entries(i.outputs).map(([c,m])=>`${j(e,c)} ${m}`).join(" \xB7 ")} \xB7 1\uD68C ${fe(l)}`}),s.talentApplies&&n.talent?t("span",{className:"talent-note"},[d.sparkle("icon tiny"),` \uD2B9\uAE30 ${n.talent.name}: ${n.talent.description}`]):null])])}function Tn(e,r,a,n,i){let o=Z(e,n.recipeId),s=o?Object.keys(o.outputs)[0]:"",l=r.state.production,p=r.state.inventory[s]??0,c=Object.values(l.facilities).reduce((h,f)=>h+(f.job?.outputs[s]??0),0),m=t("span",{className:"bar-fill red"});m.style.width=`${Math.min(100,Math.round((p+c)/Math.max(1,n.targetStock)*100))}%`;let u=(h,f,g,w=!1)=>t("button",{className:`step${w?" plus":""}`,attrs:{type:"button","aria-label":g},on:{click:()=>i.changeTarget(a,n.policyId,h)}},[f("icon")]);return t("div",{className:"plan-row"},[t("span",{className:"plan-label",text:"\uBAA9\uD45C \uC7AC\uACE0"}),t("span",{className:"stepper"},[u(-1,d.minus,"\uBAA9\uD45C 1 \uC904\uC774\uAE30"),t("span",{className:"step-value",text:String(n.targetStock),attrs:{"aria-live":"polite"}}),u(1,d.plus,"\uBAA9\uD45C 1 \uB298\uB9AC\uAE30",!0)]),t("span",{className:"plan-progress"},[t("span",{className:"muted"},[`\uD604\uC7AC ${j(e,s)} `,t("strong",{text:String(p)}),c?` (+${c} \uC9C4\uD589 \uC911)`:""," / \uBAA9\uD45C ",t("strong",{text:String(n.targetStock)})]),t("span",{className:"bar"},[m])])])}function zn(e,r,a){let n=a?Z(e,a.recipeId):null,i=n?Object.entries(n.inputs):[],o=r.state.production;return t("div",{className:"plan-block"},[t("span",{className:"plan-label",text:"\uC7AC\uB8CC \uC0AC\uC6A9 \uC124\uC815"}),i.length===0?t("p",{className:"muted",text:"\uC774 \uC81C\uC791\uBC95\uC740 \uC7AC\uB8CC \uC5C6\uC774 \uC232\uC5D0\uC11C \uBC14\uB85C \uBAA8\uC544\uC694."}):t("div",{className:"usage-list"},i.map(([s])=>{let l=r.state.inventory[s]??0,p=o.protectedStock[s]??0;return t("div",{className:"usage"},[t("span",{className:"usage-item"},[W(s),t("span",{text:j(e,s)})]),t("span",{className:"usage-cell"},[t("small",{text:"\uBCF4\uC720"}),t("strong",{text:String(l)})]),t("span",{className:"usage-cell"},[t("small",{text:"\uBCF4\uD638"}),t("strong",{text:String(p)})]),t("span",{className:"usage-cell available"},[t("small",{text:"\uC0AC\uC6A9 \uAC00\uB2A5"}),t("strong",{text:String(Math.max(0,l-p))})])])}))])}function Ln(e,r,a,n,i){let o=new Set(a.map(l=>l.recipeId)),s=e.recipes.filter(l=>l.facilityId===r&&!o.has(l.id));return t("div",{className:"plan-block"},[t("span",{className:"plan-label"},["\uC81C\uC791 \uC6B0\uC120\uC21C\uC704 ",t("small",{text:"(\uC704\uC758 \uC544\uC774\uD15C\uBD80\uD130 \uC21C\uC11C\uB300\uB85C \uC81C\uC791\uD574\uC694)"})]),...a.map((l,p)=>{let c=Z(e,l.recipeId),m=c?Object.keys(c.outputs)[0]:"";return t("div",{className:`priority-row${l.policyId===n?" selected":""}${l.enabled?"":" off"}`},[t("span",{className:"rank",text:String(p+1)}),t("button",{className:"priority-main",attrs:{type:"button","aria-pressed":l.policyId===n?"true":"false"},on:{click:()=>{i.selectRule(r,l.policyId),i.setWorkSection("recipe")}}},[W(m),t("span",{className:"priority-name",text:c?.name??l.recipeId}),t("small",{className:"muted",text:`\uBAA9\uD45C ${l.targetStock}`})]),t("button",{className:`chip-toggle${l.enabled?" on":""}`,text:l.enabled?"\uCF1C\uC9D0":"\uAEBC\uC9D0",attrs:{type:"button","aria-pressed":l.enabled?"true":"false","aria-label":`${c?.name??""} ${l.enabled?"\uB044\uAE30":"\uCF1C\uAE30"}`},on:{click:()=>i.toggleRule(r,l.policyId)}}),t("span",{className:"order-buttons"},[t("button",{className:"mini",attrs:{type:"button","aria-label":"\uC704\uB85C"},disabled:p===0,on:{click:()=>i.moveRule(r,l.policyId,-1)}},[d.up("icon")]),t("button",{className:"mini",attrs:{type:"button","aria-label":"\uC544\uB798\uB85C"},disabled:p===a.length-1,on:{click:()=>i.moveRule(r,l.policyId,1)}},[d.down("icon")])])])}),s.length?t("div",{className:"add-rules"},s.map(l=>t("button",{className:"outline-button small",attrs:{type:"button"},on:{click:()=>i.addRule(r,l.id)}},[d.plus("icon"),t("span",{text:l.name})]))):null])}function En(e,r,a,n){if(!n.job)return t("div",{className:"plan-row"},[t("span",{className:"plan-label",text:"\uD604\uC7AC \uC791\uC5C5"}),t("span",{className:"plan-progress wide"},[t("span",{className:"muted",text:"\uC26C\uB294 \uC911"}),t("span",{className:"bar"})])]);let i=Z(r,n.job.recipeId),o=Object.keys(n.job.outputs)[0],s=he(e,a,n.job);return t("div",{className:"plan-row current-work"},[t("span",{className:"plan-label",text:"\uD604\uC7AC \uC791\uC5C5"}),W(o),t("span",{className:"plan-progress"},[t("span",{className:"muted",text:`${i?.name??""} \uB9CC\uB4DC\uB294 \uC911\u2026`}),s.bar]),s.countdown])}function Wn(e,r,a,n){let i=e.work.facilityId,o=a.state.production.facilities[i];if(!o)return[C("\uC2DC\uC124\uC744 \uBD88\uB7EC\uC624\uB294 \uC911\u2026")];if(!o.unlocked)return[Tr(r,a,i,n),Rn(e,r,a,i,n)];let s=Fe(e,a.state.production,i),l=s.find(g=>g.policyId===e.work.selected[i])??s[0],p=Ct(e,a.state.production,i),c=!!e.busy[`rules:${i}`],m=o.mode==="auto",u=te(r,a.state,i),h=!m&&e.work.section==="priority"?"recipe":e.work.section??"status",f=m?[["status","\uD604\uC7AC \uC791\uC5C5"],["recipe","\uC81C\uC791 \uC124\uC815"],["priority","\uC21C\uC11C\xB7\uC801\uC6A9"]]:[["status","\uD604\uC7AC \uC791\uC5C5"],["recipe","\uB300\uAE30\uC5F4"]];return[Tr(r,a,i,n),t("div",{className:"work-sections",attrs:{role:"group","aria-label":"\uC791\uC5C5 \uD654\uBA74"}},f.map(([g,w])=>t("button",{className:"pill-tab",text:w,attrs:{type:"button","aria-pressed":h===g?"true":"false"},on:{click:()=>n.setWorkSection(g)}}))),S(null,[...h==="status"?[In(e,i,o,n),An(r,a,i,o,n),En(e,r,a,o),t("p",{className:"hint center"},[d.info("icon"),o.waiting?Bt(r,o.waiting):"\uC7AC\uB8CC\uAC00 \uBD80\uC871\uD558\uBA74 \uAE30\uB2E4\uB838\uB2E4 \uB2E4\uC2DC \uC2DC\uC791\uD574\uC694."])]:[],...h==="recipe"&&m?[Mn(r,l,o.level,u),l?Tn(r,a,i,l,n):null,zn(r,a,l)]:h==="recipe"?[Mr(e,r,a,i,n)]:[],h==="priority"&&m?Ln(r,i,s,l?.policyId,n):null,h==="status"&&m&&o.queue.length?t("p",{className:"hint center",text:`\uC9C0\uC815 \uD69F\uC218 \uB300\uAE30\uC5F4 ${o.queue.length}\uAC1C\uB294 \uBA48\uCD98 \uCC44 \uADF8\uB300\uB85C \uB0A8\uC544 \uC788\uC5B4\uC694.`}):null,m&&p?t("p",{className:"draft-note"},[h==="priority"?"\uBC14\uAFBC \uADDC\uCE59\uC740 \uC544\uC9C1 \uC801\uC6A9 \uC804\uC774\uC5D0\uC694. ":"\uBC14\uAFBC \uADDC\uCE59\uC740 \uC544\uC9C1 \uC801\uC6A9 \uC804\uC774\uC5D0\uC694. \u2018\uC21C\uC11C\xB7\uC801\uC6A9\u2019\uC5D0\uC11C \uC801\uC6A9\uD574 \uC8FC\uC138\uC694. ",t("button",{className:"link-button",text:"\uB418\uB3CC\uB9AC\uAE30",attrs:{type:"button"},on:{click:()=>n.discardDraft(i)}})]):null],{className:"work-card"}),m&&h==="priority"?t("div",{className:"rule-actions"},[t("button",{className:"button wide-main",attrs:{type:"button"},disabled:!p||c,on:{click:()=>{n.applyRules(i)}}},[t("span",{text:c?"\uC801\uC6A9\uD558\uB294 \uC911\u2026":p?"\uC6B4\uC601 \uADDC\uCE59 \uC801\uC6A9":"\uC801\uC6A9\uB428"})]),t("button",{className:"button secondary",attrs:{type:"button"},on:{click:()=>n.recommendRules(i)}},[d.gear("icon"),t("span",{text:"\uCD94\uCC9C \uC124\uC815"})])]):null]}function zr(e,r){let a=e.world?.state==="ready"?e.world.value:null,n=a&&e.content&&e.sheet?.kind==="assign"?Ar(e,a,e.content,r,e.sheet.facilityId):null;return I(e,r,{top:{kind:"sub",title:"\uACF5\uBC29 \uC791\uC5C5",back:{route:"home",label:"\uD648"},resources:!0},backdrop:"forest",body:a&&e.content?Wn(e,e.content,a,r):[C("\uC138\uACC4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026")],nav:!0,sheet:n})}var Lr={world:40,nickname:24};function Pn(e){let r=new Date(e);return Number.isNaN(r.getTime())?e:new Intl.DateTimeFormat("ko-KR",{dateStyle:"medium",timeStyle:"short"}).format(r)}function jn(e,r){let a=S("\uB0B4 \uC138\uACC4",[],{id:"fw-worlds"}),{worlds:n}=e;return n.state==="loading"?a.append(C("\uBD88\uB7EC\uC624\uB294 \uC911\u2026")):n.state==="error"?a.append(_(n.message),y("\uB2E4\uC2DC \uC2DC\uB3C4",()=>{r.loadWorlds()},{variant:"secondary"})):n.value.length===0?a.append(t("p",{className:"empty",text:"\uC544\uC9C1 \uC138\uACC4\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4. \uC544\uB798\uC5D0\uC11C \uC0C8\uB85C \uB9CC\uB4E4\uC5B4 \uC8FC\uC138\uC694."})):a.append(t("ul",{className:"menu-list"},n.value.map(i=>t("li",{},[t("button",{className:"menu-row",attrs:{type:"button"},disabled:!i.readable,on:{click:()=>{r.openWorld(i.worldId)}}},[t("span",{className:"menu-icon"},[d.house()]),t("span",{className:"menu-text"},[t("span",{className:"menu-title",text:i.worldName}),t("span",{className:"menu-detail",text:i.readable?`\uB9C8\uC9C0\uB9C9 \uC800\uC7A5 ${Pn(i.updatedAt)}`:"\uC774 \uBC84\uC804\uC5D0\uC11C \uC77D\uC744 \uC218 \uC5C6\uB294 \uC138\uACC4"})]),t("span",{className:"menu-chevron"},[d.chevron()])])])))),a}function Er(e,r){let a=!!e.busy["create-world"],n=t("input",{className:"input",attrs:{id:"fw-world-name",name:"worldName",maxlength:String(Lr.world),autocomplete:"off",required:""}}),i=t("input",{className:"input",attrs:{id:"fw-nickname",name:"playerNickname",maxlength:String(Lr.nickname),autocomplete:"off",required:""}});return t("form",{className:"card form",attrs:{"aria-labelledby":"fw-create"},on:{submit:s=>{s.preventDefault(),!(!n.value.trim()||!i.value.trim())&&r.createWorld(n.value,i.value)}}},[t("h2",{className:"section-title",text:"\uC0C8 \uC138\uACC4 \uB9CC\uB4E4\uAE30",attrs:{id:"fw-create"}}),t("p",{className:"muted",text:"\uD50C\uB808\uC774\uC5B4\uB294 \uC678\uD615 \uC5C6\uC774 \uB2C9\uB124\uC784\uC73C\uB85C\uB9CC \uB4F1\uC7A5\uD569\uB2C8\uB2E4. \uB458 \uB2E4 \uB098\uC911\uC5D0 \uC124\uC815\uC5D0\uC11C \uBC14\uAFC0 \uC218 \uC788\uC2B5\uB2C8\uB2E4."}),t("label",{className:"field-label",text:"\uC138\uACC4 \uC774\uB984",attrs:{for:"fw-world-name"}}),n,t("label",{className:"field-label",text:"\uB0B4 \uB2C9\uB124\uC784",attrs:{for:"fw-nickname"}}),i,t("button",{className:"button",text:a?"\uB9CC\uB4DC\uB294 \uC911\u2026":"\uB9CC\uB4E4\uAE30",attrs:{type:"submit"},disabled:a})])}function Wr(e,r){let a=e.world?.state==="ready",n=e.worlds.state==="ready"&&e.worlds.value.length===0,i=n?Er(e,r):t("details",{className:"card restore-details"},[t("summary",{className:"section-title",text:"\uC0C8 \uC138\uACC4 \uB9CC\uB4E4\uAE30"}),Er(e,r)]),o=t("details",{className:"card restore-details",attrs:{open:e.restore?"":void 0}},[t("summary",{className:"section-title",text:"\uBC31\uC5C5\uC5D0\uC11C \uBCF5\uC6D0"}),Ee(e,r,"fw-worlds-restore")]);return I(e,r,{top:a?{kind:"sub",title:"\uC138\uACC4 \uACE0\uB974\uAE30",back:{route:"backup",label:"\uC800\uC7A5\xB7\uBC31\uC5C5"},resources:!1}:{kind:"sub",title:"\uC232\uACB0 \uACF5\uBC29",resources:!1},backdrop:"wood",body:[n?null:jn(e,r),i,o],nav:!1})}var Pr=`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 48'%3E%3Cpath d='M0 0h120v26c-8 0-10 12-20 12S88 22 78 22 66 36 56 36 44 20 34 20 22 34 12 34 4 26 0 26z' fill='%2394bf74' stroke='%235f8f45' stroke-width='3'/%3E%3C/svg%3E")`,jr=`
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
:host(:fullscreen) { width: 100%; height: 100%; padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left); background: var(--fw-page); }
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
  background-image: ${Pr}, linear-gradient(#94bf74, #94bf74);
  background-repeat: repeat-x, no-repeat;
  background-size: 7.5em 3em, 100% 5.2em;
  background-position: 0 5.1em, 0 0;
}
.backdrop-wood { background: #a8703f; }
.backdrop-wood .scroll {
  background-color: #a8703f;
  background-image: ${Pr}, linear-gradient(#94bf74, #94bf74),
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

/* Home fits the available host viewport; detail sheets keep the full existing content. */
.home-layout .scroll { overflow: hidden; }
.home-layout .column { height: 100%; min-height: 0; position: relative; }
.home-layout .top-home { position: absolute; inset: 0 0 auto; z-index: 3; }
.home-layout .scene { flex: 1 1 auto; min-height: 0; aspect-ratio: auto; margin: 0; }
.home-layout .scene-stage { bottom: 0.65em; }
.home-layout .scene-caption { bottom: 0.2em; }
.home-layout .page { flex: none; display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 0.4em; padding: 0.4em 0.6em 0.55em; }
.home-summary, .home-layout .strip.story, .home-layout .strip.offline {
  min-width: 0; min-height: 3.2em; padding: 0.4em 0.6em; border: var(--line-in) solid var(--ink);
  border-radius: 0.8em; background: var(--fw-surface); color: var(--fw-text); font: inherit; cursor: pointer;
}
.home-summary { display: flex; align-items: center; justify-content: space-between; gap: 0.3em; text-align: left; }
.home-summary-copy { display: grid; min-width: 0; line-height: 1.25; }
.home-summary-copy strong, .home-layout .story-text strong { font-size: calc(var(--fs) * 0.86); }
.home-summary-copy span, .home-layout .story-text span { color: var(--fw-muted); font-size: calc(var(--fs) * 0.75); }
.home-layout .strip.story { justify-content: space-between; text-align: left; gap: 0.25em; }
.home-layout .story-art { display: none; }
.home-layout .round-arrow { width: 1.5em; height: 1.5em; border: 0; background: none; color: var(--ink); }
.home-layout .strip.offline { grid-column: 1 / -1; min-height: 2.75em; font-size: calc(var(--fs) * 0.8); }
.fullscreen-toggle { min-height: 2.75em; padding: 0.35em 0.65em; border: var(--line-in) solid var(--ink); border-radius: 0.7em; background: var(--fw-surface); color: var(--fw-text); font: inherit; font-size: calc(var(--fs) * 0.8); font-weight: 800; cursor: pointer; }
@media (max-height: 480px) { .home-layout .scroll { overflow-y: auto; } .home-layout .column { height: auto; min-height: 100%; } .home-layout .scene { flex: none; min-height: 12em; } }

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
.restore-details > summary { cursor: pointer; min-height: 2.75em; }
.restore-details[open] > .restore { margin-top: 0.75em; }
.invite-empty { display: grid; gap: 0.65em; justify-items: start; }

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
`;var Or=`
.work-sections { display: flex; gap: 0.4em; }
.work-sections .pill-tab { flex: 1; min-width: 0; padding: 0.25em; }
.work-sections .pill-tab[aria-pressed="true"] { background: #4f8f6e; color: #fff; }
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
`;var Br=`
/* Top counters (\uCD08\uB300\uAD8C + \xB7 \uC885\uD45C) */
.invite-counters { gap: 0.35em; }
.counter-plus { display: inline-flex; align-items: center; justify-content: center; width: 1.45em; height: 1.45em; margin-left: 0.1em; border-radius: 50%; border: 2px solid var(--ink); background: var(--fw-accent); color: var(--fw-on-accent); }
.counter-plus .icon { stroke-width: 3; }
.token-mark, .token-coin { flex: none; display: inline-flex; align-items: center; justify-content: center; width: 1.65em; height: 1.65em; border-radius: 50%; border: var(--line-in) solid var(--ink); background: #b9cf7a; color: #2f4a26; }
.token-coin.big { width: 3.6em; height: 3.6em; border-width: var(--line); box-shadow: var(--drop); }
.token-coin.big .icon { width: 1.8em; height: 1.8em; }

/* Tabs and the envelope */
.invite-tabs .segment { gap: 0.45em; }
.invite-tabs .segment .icon { width: 1.2em; height: 1.2em; }
.invite-stage { display: grid; place-items: center; padding: 0.4em 0 0; }
.invite-envelope { width: min(76%, 300px); height: auto; filter: drop-shadow(0 0.25em 0 rgba(75, 46, 26, 0.35)); }

/* \uD76C\uB9DD \uC8FC\uBBFC \xB7 1\uD68C / 10\uD68C \uCD08\uB300 */
.wish-row .menu-detail { overflow-wrap: anywhere; }
.draw-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.6em; }
.draw-button {
  position: relative;
  display: grid;
  justify-items: center;
  gap: 0.2em;
  min-height: 6.4em;
  padding: 0.7em 0.5em 1.1em;
  border-radius: 1em;
  border: var(--line) solid var(--ink);
  background: var(--fw-accent);
  color: var(--fw-on-accent);
  box-shadow: var(--drop);
  font: inherit;
  cursor: pointer;
}
.draw-button:disabled { background: #a29a8b; color: #f7f1e6; cursor: not-allowed; }
.draw-title { font-size: calc(var(--fs) * 1.35); font-weight: 900; }
.draw-cost { display: inline-flex; align-items: center; gap: 0.3em; font-size: calc(var(--fs) * 1.1); font-weight: 900; }
.draw-short { position: absolute; left: 50%; bottom: -0.85em; transform: translateX(-50%); display: inline-flex; align-items: center; gap: 0.25em; padding: 0.1em 0.6em; border-radius: 999px; border: 2px solid var(--ink); background: var(--fw-surface-3); color: var(--fw-fail); font-size: calc(var(--fs) * 0.8); font-weight: 900; white-space: nowrap; }
.draw-row + .hint { margin-top: 0.6em; }
.link-row { display: flex; justify-content: space-between; gap: 0.5em; padding-top: 0.4em; border-top: var(--line-in) dashed var(--fw-track); }
.link-button.with-icon { display: inline-flex; align-items: center; gap: 0.35em; color: var(--fw-text); }

/* \uC885\uD45C \uAD50\uD658 card and list */
.exchange-card { display: grid; grid-template-columns: auto auto 1fr auto; align-items: center; gap: 0.7em; width: 100%; padding: 0.2em; border: 0; background: none; color: var(--fw-text); font: inherit; text-align: left; cursor: pointer; }
.exchange-count { display: grid; justify-items: center; gap: 0.25em; padding-right: 0.7em; border-right: var(--line-in) solid var(--fw-track); }
.exchange-count strong { font-size: calc(var(--fs) * 1.1); }
.count-pill { padding: 0.1em 0.8em; border-radius: 999px; border: 2px solid var(--ink); background: var(--fw-surface-2); font-weight: 900; font-size: calc(var(--fs) * 1.15); }
.exchange-text { display: grid; gap: 0.2em; min-width: 0; }
.exchange-text strong { display: inline-flex; align-items: center; gap: 0.3em; }
.exchange-summary { display: flex; align-items: center; flex-wrap: wrap; gap: 0.4em; margin: 0; }
.exchange-list, .pick-list, .result-list, .chance-list, .order-list, .queue-list, .unlock-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.45em; }
.exchange-row, .chance-row, .result-row { display: flex; align-items: center; gap: 0.6em; padding: 0.45em 0.6em; border-radius: 0.85em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); }
.exchange-name, .chance-name { display: grid; gap: 0.2em; flex: 1; min-width: 0; }
.chance-value { font-variant-numeric: tabular-nums; }
.tag.wish { background: var(--fw-gold); color: var(--ink); }

/* Pick rows (\uD76C\uB9DD \uC8FC\uBBFC, \uBC30\uCE58 \uBCC0\uACBD, \uC804\uBB38 \uBD84\uC57C) */
.pick-row { display: flex; align-items: center; flex-wrap: wrap; gap: 0.5em; width: 100%; min-height: 3.2em; padding: 0.45em 0.7em; border-radius: 0.85em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); color: var(--fw-text); font: inherit; text-align: left; cursor: pointer; }
.pick-row > strong { flex: 1 1 6em; min-width: 0; overflow-wrap: anywhere; }
.pick-row.selected { background: var(--fw-leaf-soft); box-shadow: inset 0 0 0 2px var(--fw-leaf); }
.pick-row:disabled { cursor: default; }
.pick-row .good { color: var(--fw-pass); font-weight: 900; }
.pick-list.fields .pick-row .icon { width: 1.5em; height: 1.5em; color: var(--fw-accent); }
.assign-now { margin: 0; padding: 0.45em 0.7em; border-radius: 0.8em; border: 2px dashed var(--ink); background: var(--fw-surface); }

/* Results */
.result-hero { display: grid; justify-items: center; gap: 0.35em; text-align: center; }
.result-stage { position: relative; display: block; width: 9em; height: 11em; border-radius: 1em; border: var(--line) solid var(--ink); background: var(--fw-leaf-soft); overflow: hidden; }
.result-name { font-size: calc(var(--fs) * 1.4); }
.result-row > strong { flex: 1; min-width: 0; overflow-wrap: anywhere; }
.result-row > small { flex-basis: 100%; padding-left: 2.9em; }
.result-row { flex-wrap: wrap; }
.result-badge { padding: 0.05em 0.6em; border-radius: 999px; border: 2px solid var(--ink); font-weight: 900; font-size: calc(var(--fs) * 0.82); }
.result-badge.new { background: var(--fw-gold); color: var(--ink); }
.result-badge.breakthrough { background: var(--fw-leaf-soft); color: #2f4a26; }
.result-badge.token { background: #b9cf7a; color: #2f4a26; }

/* \uCD08\uB300\uAD8C \uBC1B\uAE30 \xB7 \uB0A9\uD488 */
.order { display: grid; gap: 0.45em; padding: 0.7em; border-radius: 0.9em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); }
.order.done { background: var(--fw-surface-2); }
.order-title { font-size: calc(var(--fs) * 1.05); }
.order-items { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.3em; }
.order-items li { display: flex; align-items: center; flex-wrap: wrap; gap: 0.45em; font-weight: 800; }
.order-items li.short > span { color: var(--fw-fail); }
.order-reward { display: flex; align-items: center; gap: 0.3em; margin: 0; font-weight: 900; color: var(--fw-accent); }
.order .status-pill { justify-self: start; }

/* \uC791\uC5C5: closed tabs, \uD574\uAE08, crew line, \uC9C0\uC815 \uD69F\uC218 */
.field-tab.closed { background: var(--fw-surface-2); color: var(--fw-muted); }
.field-tab .lock-tag { position: absolute; top: 0.2em; right: 0.2em; }
.facility-open.closed { cursor: default; }
.unlock-list li { display: flex; align-items: center; gap: 0.5em; padding: 0.45em 0.6em; border-radius: 0.8em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); font-weight: 800; }
.unlock-list li > span { flex: 1; min-width: 0; }
.unlock-list li.met { background: var(--fw-leaf-soft); }
.unlock-list li.met .icon { color: var(--fw-pass); }
.crew-line { display: inline-flex; align-items: center; flex-wrap: wrap; gap: 0.35em; font-weight: 800; color: var(--fw-text); }
.crew-line .avatar { width: 1.8em; height: 1.8em; }
.queue-row { display: flex; align-items: center; gap: 0.5em; padding: 0.4em 0.55em; border-radius: 0.8em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); }
.queue-name { display: grid; flex: 1; min-width: 0; }
.queue-add { display: grid; gap: 0.55em; padding-top: 0.5em; border-top: var(--line-in) dashed var(--fw-track); }
.queue-add .pill-tab { display: inline-flex; align-items: center; gap: 0.35em; }
.queue-add .pill-tab .item-tile { width: 1.6em; height: 1.6em; }

/* \uC790\uB3D9 \uD310\uB9E4 */
.auto-sell-row { display: grid; gap: 0.5em; padding: 0.7em; border-radius: 0.9em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); }
.auto-sell-row.on { background: var(--fw-leaf-soft); }
.auto-sell-head { display: flex; align-items: center; gap: 0.55em; }
.auto-sell-head .protect-name { flex: 1; min-width: 0; display: grid; }
.auto-sell-fields { display: grid; gap: 0.3em; }
.row-actions { display: flex; flex-wrap: wrap; gap: 0.5em; }
.row-actions .button { flex: 1; }

/* \uC8FC\uBBFC: \uD2B9\uAE30 and lit \uB3CC\uD30C leaves */
.talent-card { display: grid; gap: 0.35em; padding: 0.65em 0.75em; border-radius: 0.9em; border: var(--line-in) solid var(--ink); background: var(--fw-leaf-soft); }
.talent-card p { margin: 0; }
.talent-field { display: flex; align-items: center; gap: 0.4em; font-size: calc(var(--fs) * 1.05); }
.talent-field .icon { color: var(--fw-accent); }
.talent-name { display: grid; gap: 0.15em; }
.talent-line, .talent-note { display: flex; align-items: center; flex-wrap: wrap; gap: 0.3em; margin: 0; color: #2f4a26; font-weight: 800; }
.pip.on { background: var(--fw-leaf); }
.passive-block { display: grid; gap: 0.25em; }
.passive-block p { margin: 0; }

@media (max-width: 360px) {
  .draw-title { font-size: calc(var(--fs) * 1.15); }
  .exchange-card { grid-template-columns: auto 1fr auto; }
  .exchange-count { justify-items: start; border-right: 0; }
  .exchange-text { grid-column: 1 / -1; order: 5; }
}
`;var Vr=`
/* \uD0D0\uC0AC */
.explore-tabs { grid-template-columns: 1fr 1fr 1.4fr; }
.explore-tabs .field-tab span { white-space: nowrap; }
.pair-chips { margin-top: 0.4em; }
.trail-card { position: relative; padding: 0; overflow: hidden; }
.trail-art { display: block; width: 100%; height: auto; }
.place-sign { position: absolute; left: 0.8em; top: 0.8em; padding: 0.3em 0.9em; border-radius: 0.6em; border: var(--line) solid var(--ink); background: #e2b57a; color: var(--ink); font-weight: 900; box-shadow: var(--drop); }
.arc-card > .section-title { justify-content: center; }
.episode-row { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.4em; }
.episode-tile { display: grid; justify-items: center; gap: 0.25em; padding: 0.5em 0.35em; border-radius: 0.9em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); text-align: center; }
.episode-tile.selected { background: var(--fw-accent); color: var(--fw-on-accent); box-shadow: var(--drop); }
.episode-tile.selected small { color: var(--fw-on-accent); }
.episode-tile.locked.selected { color: var(--fw-text); box-shadow: inset 0 0 0 0.2em var(--fw-accent), var(--drop); }
.episode-tile.locked.selected small { color: var(--fw-muted); }
.episode-tile.locked { background: var(--fw-surface-2); color: var(--fw-muted); }
.episode-icon { position: relative; display: inline-flex; }
.episode-check { position: absolute; right: -0.4em; bottom: -0.2em; display: inline-flex; border-radius: 50%; border: 2px solid var(--ink); background: var(--fw-leaf); color: #fff; }
.episode-text { display: grid; gap: 0.1em; min-width: 0; }
.episode-text strong { font-size: calc(var(--fs) * 1.05); }
.episode-text span { font-weight: 800; font-size: calc(var(--fs) * 0.88); overflow-wrap: anywhere; }
.episode-text small { color: var(--fw-muted); font-size: calc(var(--fs) * 0.75); overflow-wrap: anywhere; }
.expedition-details { display: grid; gap: 0.6em; }
.detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.4em; padding: 0.6em; border-radius: 0.9em; border: var(--line-in) solid var(--ink); background: var(--fw-surface); }
.detail-cell { display: flex; align-items: center; flex-wrap: wrap; gap: 0.45em; min-width: 0; }
.detail-cell.wide { grid-column: 1 / -1; }
.detail-cell > span { display: grid; min-width: 0; }
.detail-cell small { color: var(--fw-muted); font-size: calc(var(--fs) * 0.8); }
.detail-cell strong { font-size: calc(var(--fs) * 1.05); }
.detail-cell > .icon { color: var(--fw-wood-dark); }
.avatar-row { display: inline-flex !important; grid-auto-flow: column; gap: 0.2em; margin-left: auto; }
.prep-list { display: flex !important; flex-wrap: wrap; gap: 0.4em; }
.prep { display: inline-flex; align-items: center; gap: 0.3em; font-weight: 900; color: var(--fw-fail); }
.prep.ok { color: var(--fw-text); }
.prep.ok .icon { color: var(--fw-pass); }
.locked-reasons ul { margin: 0; padding-left: 1.2em; font-weight: 800; }
.expedition-running { display: grid; gap: 0.45em; }
.running-line { display: flex; align-items: center; gap: 0.45em; margin: 0; }
.running-line .countdown { margin-left: auto; }
.explore-strip { cursor: default; justify-content: flex-start; flex-wrap: wrap; }
.strip-progress { display: grid; flex: 1; gap: 0.25em; min-width: 10em; }
.completed-arc { display: flex; align-items: center; flex-wrap: wrap; gap: 0.5em; padding: 0.45em 0.6em; border-radius: 0.8em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); }
.completed-arc strong { flex: 1; }

/* \uACF5\uBC29 \uC774\uC57C\uAE30 */
.reader-tools { gap: 0.35em; }
.reader-tools .chip-button { min-height: 2.2em; padding: 0.1em 0.7em; }
.chip-button.active { background: var(--fw-accent); color: var(--fw-on-accent); }
.story-stage { position: relative; height: clamp(15em, 52vh, 26em); border-radius: 1.1em; border: var(--line) solid var(--ink); background: #e9c995; overflow: hidden; box-shadow: var(--drop); }
.stage-shelf { position: absolute; left: 0; right: 0; top: 0; height: 58%; border-bottom: var(--line) solid var(--ink); background: #c58a52; }
.stage-shelf::before { content: ""; position: absolute; left: 8%; right: 8%; top: 35%; height: 0.6em; border: var(--line-in) solid var(--ink); border-radius: 0.3em; background: #8a5a33; }
.stage-cast { position: absolute; inset: 0; display: grid; grid-auto-flow: column; grid-auto-columns: 1fr; align-items: end; padding: 0 4%; }
.stage-spot { position: relative; display: block; height: 92%; }
.stage-spot .figure { position: absolute; inset: 0; }
.emotion-bubble { position: absolute; z-index: 2; top: 2%; left: 50%; transform: translateX(-50%); display: inline-grid; place-items: center; min-width: 2.2em; height: 2.2em; padding: 0 0.4em; border-radius: 999px; border: var(--line-in) solid var(--ink); background: #fff8e8; font-weight: 900; font-size: calc(var(--fs) * 1.2); }
.dialogue-box { position: relative; display: grid; gap: 0.5em; margin-top: -2.4em; padding: 1.4em 1.1em 1em; border-radius: 1.1em; border: var(--line) solid var(--ink); background: var(--fw-surface-3); box-shadow: var(--drop); min-height: 7.5em; }
.dialogue-box p { margin: 0; }
.speaker-tag { position: absolute; top: -1.1em; left: 0.9em; display: inline-flex; align-items: center; gap: 0.3em; padding: 0.25em 0.9em; border-radius: 0.6em; border: var(--line-in) solid var(--ink); background: #f2e2bd; font-weight: 900; }
.dialogue-box .line { font-size: calc(var(--fs) * 1.15); font-weight: 800; line-height: 1.55; }
.dialogue-box .narration { color: var(--fw-muted); line-height: 1.55; }
.dialogue-box.narration-only .narration { color: var(--fw-text); }
.dialogue-box.end { text-align: center; }
.end-line { font-size: calc(var(--fs) * 1.15); font-weight: 900; }
.choice-options { display: grid; gap: 0.4em; }
.choice-option { min-height: 2.8em; padding: 0.4em 0.8em; border-radius: 0.8em; border: var(--line-in) solid var(--ink); background: #fff; color: var(--fw-text); font: inherit; font-weight: 800; text-align: left; cursor: pointer; }
.choice-option.chosen { background: var(--fw-leaf-soft); box-shadow: inset 0 0 0 2px var(--fw-leaf); }
.choice-option:disabled { cursor: default; }
.reader-foot { display: grid; justify-items: center; gap: 0.5em; margin-top: 0.6em; }
.reader-foot .count-pill { background: #8a5a33; color: #fff4dc; }
.backlog-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.45em; }
.backlog-list li { display: grid; gap: 0.1em; padding: 0.4em 0.6em; border-radius: 0.7em; border: 2px solid var(--fw-track); background: var(--fw-surface-3); }
.backlog-narration span { color: var(--fw-muted); }
@media (max-width: 360px) {
  .explore-tabs { grid-template-columns: 1fr 1fr 1.6fr; }
  .detail-grid { grid-template-columns: 1fr; }
}
`;var On=vt.map(e=>`.season-${e}.art-base.backdrop-forest .scroll { background: var(--fw-page) ${me(se[e].base)} center top / cover no-repeat; }`).join(`
`),Fr=`
/* Season backdrop (portrait). It scrolls with the page so the column keeps its full width on tall phones. */
${On}
.art-base.backdrop-forest .scroll:has(.scene img.scene-art) { background: var(--fw-page); }

/* Item, facility and emotion pictures: drawn straight on the panel like the mockups, no tile frame around them. */
.item-tile { width: 2em; height: 2em; }
.item-tile:has(.item-art) { border: 0; border-radius: 0; background: none; }
.item-tile .item-art { width: 100%; height: 100%; object-fit: contain; display: block; filter: drop-shadow(0 1px 0 rgba(75, 46, 26, 0.25)); }
.item-tile.big:has(.item-art) { width: 3.6em; height: 3.6em; }
.stock tbody th .item-tile, .queue-add .pill-tab .item-tile { width: 2em; height: 2em; }
.facility-image { display: block; object-fit: contain; }
.facility-image.big, .facility-image.huge { width: 100%; height: 100%; }
.facility-art { position: relative; }
.facility-art:has(.facility-image) { width: 6em; height: 4.8em; border: 0; border-radius: 0; background: none; }
.recipe-art:has(.item-art) { border: 0; border-radius: 0; background: none; }
.recipe-art .item-tile.big:has(.item-art) { width: 4.6em; height: 4.6em; }
.facility-picture:has(.facility-image) { border: 0; border-radius: 0; background: none; aspect-ratio: auto; min-height: 0; }
.facility-image.huge { max-height: 11em; }
.facility-picture.closed .facility-image, .facility-art.closed .facility-image { filter: grayscale(0.85) brightness(0.92); }
.facility-lock { position: absolute; right: 0; bottom: 0; display: inline-grid; place-items: center; width: 1.8em; height: 1.8em; border-radius: 50%; border: var(--line-in) solid var(--ink); background: var(--fw-wood); color: var(--ink); }
.facility-lock .icon { width: 1.1em; height: 1.1em; }
.facility-entry:has(.facility-image) { padding: 0.35em 0.5em; }
.facility-entry:has(.facility-image) .facility-text strong { white-space: nowrap; }
img.scene-art { object-fit: cover; object-position: 50% 60%; }
.story-stage .stage-art { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 50% 60%; display: block; }
.art-sign .reader-tools .chip-button { white-space: nowrap; }
img.emotion-bubble.emotion-art { min-width: 0; width: 2.6em; height: 2.6em; padding: 0; border: 0; border-radius: 0; background: none; object-fit: contain; }

/* \uD648 (board 01-1): the workshop scene fills the top of the screen and the sign, money and \uB0A0\uC528 sit on it. */
.column:has(> .scene img.scene-art) { position: relative; }
.column:has(> .scene img.scene-art) > .top-home { position: absolute; z-index: 3; top: 0; left: 0; right: 0; }
.scene:has(img.scene-art) { aspect-ratio: 390 / 470; min-height: 22em; margin-bottom: 0; }
.home-layout .scene:has(img.scene-art) { min-height: 0; aspect-ratio: auto; margin: 0; }
@media (max-height: 480px) { .home-layout .scene:has(img.scene-art) { min-height: 12em; } }

/* Wooden sign (title-sign.webp) on every screen; the DOM title sits in its empty middle (textSafeRect 22\u201378 % \xD7 36\u201374 %). */
.art-sign .sign {
  flex: none;
  aspect-ratio: 768 / 359;
  width: min(12em, 52vw);
  display: grid;
  place-items: center;
  padding: 7% 17% 3%;
  border: 0;
  border-radius: 0;
  background: ${me(oe.titleSign)} center / 100% 100% no-repeat;
  box-shadow: none;
  color: #4b2e1a;
  font-size: calc(var(--fs) * 1.6);
  font-weight: 900;
  letter-spacing: 0.04em;
  overflow: visible;
}
.art-sign .sign::before, .art-sign .sign::after { content: none; }
.art-sign .sign-home { width: min(10.5em, 44vw); font-size: calc(var(--fs) * 1.45); }
/* The gear on the scene: a cream disc so it reads over leaves (board 01-1). */
.art-base .icon-button.gear { border-radius: 50%; background: rgba(255, 248, 232, 0.85); }
.art-sign .top-sub .sign { margin-right: 0; }
.art-sign .top-sub:not(.with-resources) .top-row { justify-content: center; }
.art-sign .top-sub:not(.with-resources) .back-button { position: absolute; left: 0.75em; }
.art-sign .top-sub.with-resources .sign { width: min(9.5em, 40vw); font-size: calc(var(--fs) * 1.15); padding-left: 14%; padding-right: 14%; }

/* Narrow phones: the sign and its title shrink with the bar so the money and the gear keep their row. */
.art-sign .top { container-type: inline-size; }
@container (max-width: 380px) {
  .art-sign .sign-home { width: 40cqi; font-size: 5cqi; padding-left: 13%; padding-right: 13%; }
  .art-sign .top-sub.with-resources .sign { width: 37cqi; font-size: 4.3cqi; padding-left: 10%; padding-right: 10%; letter-spacing: 0; }
}
/* Large teal calls to action: primary-button.webp as nine-slice. Small, inline and secondary buttons stay drawn. */
.art-button .button:not(.secondary):not(.small):not(.is-locked):not(:disabled):not(.pressed):not(.setting-field > .button) {
  border-color: transparent;
  border-width: 0;
  border-image: ${me(oe.primaryButton)} 70 138 fill / 16px 32px / 0 stretch;
  background: transparent;
  box-shadow: none;
  padding-left: 1.8em;
  padding-right: 1.8em;
  text-shadow: 0 1px 0 rgba(37, 22, 12, 0.45);
}

.art-button .button.report-button:not(:disabled) { padding-left: 1.1em; padding-right: 1.1em; }

/* Cards, sheets and the story dialogue: paper-panel.webp (cream paper with leaf corners, as on every board). */
.art-paper .card, .art-paper .sheet, .art-paper .dialogue-box {
  border-color: transparent;
  border-width: 0;
  border-image: ${me(oe.paperPanel)} 105 154 fill / 30px 44px / 0 stretch;
  background: transparent;
  box-shadow: none;
}
.art-paper .card { padding: 1.1em 1.2em; }
/* Inside the paper, rows and boxes use a light tan line and no ink frame, as on the boards. */
.art-paper .card :is(.facility-entry, .recipe, .plan-row, .plan-block, .setting-block, .detail-grid, .report-slot, .kit-item, .completed-arc, .segmented, .episode-tile:not(.selected)) {
  border-color: #dcc49a;
  border-width: 2px;
}
.art-paper .sheet, .art-paper .dialogue-box { padding: 1.5em 1.6em; }
/* With the 96 px picture the facility text needs the row: the action button wraps under it on phones. */
.facility-entry:has(.facility-image) { flex-wrap: wrap; }
.facility-entry:has(.facility-image) .facility-open { flex: 1 1 13em; }
.facility-entry:has(.facility-image) .outline-button { white-space: nowrap; }
.facility-entry:has(.facility-image) > :not(.facility-open) { margin-left: auto; }
`;var Dr=`
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
.resident-grid { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: 1fr; gap: 0.4em; }
.resident-list-open { display: flex; align-items: center; gap: 0.65em; width: 100%; min-height: 4.2em; padding: 0.35em 0.55em; border: var(--line-in) solid var(--ink); border-radius: 0.8em; background: var(--fw-surface-3); color: var(--fw-text); font: inherit; text-align: left; cursor: pointer; }
.resident-list-copy { display: grid; flex: 1; min-width: 0; line-height: 1.3; }
.resident-list-copy strong { overflow-wrap: anywhere; }
.resident-list-copy span { color: var(--fw-muted); font-size: calc(var(--fs) * 0.85); }
.resident-pages { display: flex; align-items: center; justify-content: space-between; gap: 0.5em; }
.resident-pages .outline-button { min-width: 4em; }
.residents-back { justify-self: start; }
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
.profile-tabs { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.35em; }
.profile-tab { min-height: 3em; padding: 0.3em; border: 2px solid var(--ink); border-radius: 0.6em; background: var(--fw-surface-3); color: var(--fw-text); font: inherit; font-weight: 700; cursor: pointer; }
.profile-tab[aria-pressed="true"] { background: var(--fw-accent); color: var(--fw-on-accent); }
.profile-panel[hidden] { display: none; }
.compare { display: grid; gap: 0.6em; }
.compare-box { display: grid; gap: 0.4em; padding: 0.7em; border-radius: 0.8em; border: var(--line-in) solid var(--ink); }
.compare-box.source { background: var(--fw-surface-2); }
.compare-box.world { background: var(--fw-leaf-soft); }
.compare-box .button { justify-self: end; }
.compare-title { display: flex; align-items: center; gap: 0.35em; font-weight: 900; }
.source-field { display: grid; gap: 0.1em; }
.source-field p { white-space: pre-wrap; font-size: calc(var(--fs) * 0.9); }
.source-details { display: block; }
.source-details summary { cursor: pointer; min-height: 2.75em; }
.source-details[open] > :not(summary) { margin-top: 0.6em; }
.sheet-head { flex-wrap: wrap; }
.sheet-head .section-title { flex: 1 1 10em; }
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
`;var Gr="marinara-capability-forest-workshop",at=class extends HTMLElement{constructor(){super();A(this,"root");A(this,"controller",null);A(this,"diagnostics",null);A(this,"unsubscribe",null);A(this,"styleNode",document.createElement("style"));A(this,"renderedRoute",null);A(this,"renderedPage",null);A(this,"ticker");A(this,"refreshedEnds",new Set);A(this,"onPresence",()=>{this.controller?.heartbeat()});A(this,"onFullscreenChange",()=>{let a=this.root.querySelector(".fullscreen-toggle");a&&(a.textContent=document.fullscreenElement?"\uC804\uCCB4 \uD654\uBA74 \uC885\uB8CC":"\uC804\uCCB4 \uD654\uBA74")});A(this,"presentWorld",null);this.root=this.attachShadow({mode:"open"}),this.styleNode.textContent=jr+Or+Dr+Br+Vr+Fr}connectedCallback(){this.controller||(this.controller=Lt(),this.diagnostics=new Re,this.controller.start()),this.unsubscribe?.(),this.unsubscribe=this.controller.store.subscribe(a=>this.render(a)),this.render(this.controller.store.get()),this.controller.startHeartbeat(),document.addEventListener("visibilitychange",this.onPresence),document.addEventListener("fullscreenchange",this.onFullscreenChange),window.addEventListener("focus",this.onPresence),clearInterval(this.ticker),this.ticker=setInterval(()=>this.tick(),1e3)}disconnectedCallback(){this.unsubscribe?.(),this.unsubscribe=null,this.controller?.stopHeartbeat(),document.removeEventListener("visibilitychange",this.onPresence),document.removeEventListener("fullscreenchange",this.onFullscreenChange),window.removeEventListener("focus",this.onPresence),clearInterval(this.ticker)}tick(){let a=Date.now();for(let n of this.root.querySelectorAll("[data-countdown-end]")){let i=Number(n.dataset.countdownEnd);n.textContent=fe(i-a),i<=a&&!this.refreshedEnds.has(n.dataset.countdownEnd)&&(this.refreshedEnds.add(n.dataset.countdownEnd),setTimeout(()=>{this.controller?.refreshProduction()},1500))}for(let n of this.root.querySelectorAll("[data-progress-end]")){let i=Number(n.dataset.progressEnd),o=Math.max(1,Number(n.dataset.progressTotal));n.style.width=`${Math.min(100,Math.max(0,Math.round((o-Math.max(0,i-a))/o*100)))}%`}}screen(a,n){switch(a.route){case"home":return tr(a,n);case"work":return zr(a,n);case"facilities":return Rr(a,n);case"settings":return $r(a,n);case"backup":return Nr(a,n);case"residents":return yr(a,n);case"relations":return fr(a,n);case"register":return pr(a,n);case"resident-image":return br(a,n);case"invite":return ir(a,n);case"explore":return sr(a,n);case"story":return dr(a,n);case"diagnostics":return this.diagnostics.start(),I(a,n,{top:{kind:"sub",title:"\uC5F0\uACB0 \uC810\uAC80",back:{route:"backup",label:"\uC800\uC7A5\xB7\uBC31\uC5C5"},resources:!1},backdrop:"wood",body:[this.diagnostics.node],nav:!0});default:return Wr(a,n)}}render(a){let n=a.world?.state==="ready"?a.world.value.worldId:null;n&&n!==this.presentWorld&&(this.presentWorld=n,queueMicrotask(()=>{this.controller?.heartbeat()}));let i=this.screen(a,this.controller);this.style.setProperty("--fw-font-size",`${a.fontSize}px`);let o=this.root.activeElement,s=o?.id,l=o&&"selectionStart"in o&&typeof o.selectionStart=="number"?[o.selectionStart,o.selectionEnd??o.selectionStart]:null,p=Wt(a),c=a.route===this.renderedRoute&&p===this.renderedPage?this.root.querySelector(".scroll")?.scrollTop??0:0;this.root.replaceChildren(this.styleNode,i),this.renderedRoute=a.route,this.renderedPage=p;let m=this.root.querySelector(".scroll");if(m&&(m.scrollTop=c),s){let u=this.root.getElementById(s);if(u?.focus({preventScroll:!0}),u&&l&&typeof u.setSelectionRange=="function")try{u.setSelectionRange(l[0],l[1])}catch{}}}};typeof customElements<"u"&&!customElements.get(Gr)&&customElements.define(Gr,at);
