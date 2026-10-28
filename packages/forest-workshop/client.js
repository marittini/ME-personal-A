var Ua=Object.defineProperty;var Ka=(e,a,r)=>a in e?Ua(e,a,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[a]=r;var P=(e,a,r)=>Ka(e,typeof a!="symbol"?a+"":a,r);var ce=globalThis.__MARINARA_HOST__;if(!ce||ce.version!==1||!ce.queryClient)throw new Error("Marinara Engine does not provide its query client; this package needs capability API 1.341 or newer.");var Dn=ce.queryClient;function ot(){let e=ce.api;if(!e?.api)throw new Error("\uC774 Marinara Engine\uC740 \uD328\uD0A4\uC9C0 API \uD074\uB77C\uC774\uC5B8\uD2B8\uB97C \uC81C\uACF5\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.");return e}function z(){return ot().api}function W(e,a){try{let r=e.payload;return typeof r?.message=="string"&&r.message?r.message:ot().getApiErrorMessage(e,a)}catch{return e instanceof Error&&e.message?e.message:a}}function me(e){let a=e.payload;return typeof a?.error=="string"?a.error:null}function ke(){return typeof crypto<"u"&&typeof crypto.randomUUID=="function"?crypto.randomUUID():`${Date.now().toString(36)}-${Math.random().toString(36).slice(2,12)}`}function Q(){if(typeof crypto<"u"&&typeof crypto.randomUUID=="function")return crypto.randomUUID();let e=crypto.getRandomValues(new Uint8Array(16));e[6]=e[6]&15|64,e[8]=e[8]&63|128;let a=[...e].map(r=>r.toString(16).padStart(2,"0")).join("");return`${a.slice(0,8)}-${a.slice(8,12)}-${a.slice(12,16)}-${a.slice(16,20)}-${a.slice(20)}`}var B="/forest-workshop",T={listWorlds:()=>z().get(`${B}/worlds`),createWorld:e=>z().post(`${B}/worlds`,e),getState:e=>z().get(`${B}/state?worldId=${encodeURIComponent(e)}`),getStoryOverview:e=>z().get(`${B}/stories?worldId=${encodeURIComponent(e)}`),getStory:(e,a)=>z().get(`${B}/stories/${encodeURIComponent(a)}?worldId=${encodeURIComponent(e)}`),generateStory:(e,a,r)=>z().post(`${B}/stories/generate`,{worldId:e,pairId:a,episode:r}),getDeliveries:e=>z().get(`${B}/deliveries?worldId=${encodeURIComponent(e)}`),heartbeat:e=>z().post(`${B}/heartbeat`,{worldId:e}),sendCommand:e=>z().post(`${B}/commands`,e),getStorage:e=>z().get(`${B}/storage?worldId=${encodeURIComponent(e)}`),getBackup:e=>z().get(`${B}/backup?worldId=${encodeURIComponent(e)}`),listSources:e=>z().get(`${B}/sources?worldId=${encodeURIComponent(e)}`),previewSource:(e,a,r)=>z().get(`${B}/sources/preview?worldId=${encodeURIComponent(e)}&kind=${a}&id=${encodeURIComponent(r)}`),rebuildSuggestion:(e,a)=>z().post(`${B}/rebuild-suggestion`,{worldId:e,source:a}),uploadResidentImage:e=>{let a=new FormData;return a.append("worldId",e.worldId),a.append("residentId",e.residentId),a.append("uploadKey",e.uploadKey),a.append("file",e.file,e.file.name),z().upload(`${B}/residents/image`,a)},restore:(e,a)=>z().post(`${B}/restore`,{newWorldId:e,backup:a})};var st="\uC232\uACB0 \uACF5\uBC29 \uBC31\uC5C5 \uD30C\uC77C\uC774 \uC544\uB2D9\uB2C8\uB2E4. \uC124\uC815 \u2192 \uC800\uC7A5\xB7\uBC31\uC5C5\uC5D0\uC11C \uB0B4\uBCF4\uB0B8 JSON \uD30C\uC77C\uC744 \uACE8\uB77C \uC8FC\uC138\uC694.";function lt(e,a){return!e||typeof e!="object"||Array.isArray(e)?0:Object.values(e).filter(a).length}function dt(e){let a=e;if(!a||a.format!=="forest-workshop-backup"||!a.world)return{ok:!1,message:st};let{settings:r,wallet:n,inventory:i}=a.world;if(typeof r?.worldName!="string"||typeof r.playerNickname!="string")return{ok:!1,message:st};let o=i&&typeof i=="object"?Object.values(i).filter(s=>typeof s=="number"&&s>0):[];return{ok:!0,summary:{worldName:r.worldName,playerNickname:r.playerNickname,gold:typeof n?.gold=="number"?n.gold:0,itemKinds:o.length,itemTotal:o.reduce((s,l)=>s+l,0),exportedAt:typeof a.exportedAt=="string"?a.exportedAt:"",residents:lt(a.world.residents,()=>!0),pairs:lt(a.world.pairs,s=>!s.archived),pictures:Array.isArray(a.assets)?a.assets.length:0}}}var ct={weather:{label:"\uD604\uC2E4 \uB0A0\uC528",phase:"P5"},mail:{label:"\uC6B0\uD3B8\uD568",phase:"P4b"},"survey-patrol":{label:"\uC870\uC0AC \xB7 \uC21C\uCC30",phase:"P4b"},"weather-effects":{label:"\uB0A0\uC528 \uD6A8\uACFC",phase:"P5"},"auto-read":{label:"\uC790\uB3D9 \uC77D\uAE30",phase:"P4b"},"ai-guidelines":{label:"AI \uC9C0\uCE68 \uAD00\uB9AC",phase:"P4b"},memory:{label:"\uAE30\uC5B5 \uAD00\uB9AC",phase:"P4b"},"pair-memory":{label:"\uD398\uC5B4 \uAE30\uC5B5 \uBCF4\uAE30",phase:"P4b"},"pair-guidelines":{label:"\uD398\uC5B4 \uC9C0\uCE68 \uAD00\uB9AC",phase:"P4b"}};function Ne(e){return e in ct}function mt(e){let a=ct[e];return a?`${a.label} \uAE30\uB2A5\uC740 \uC544\uC9C1 \uC900\uBE44 \uC911\uC774\uC5D0\uC694.`:""}var pt="forest-workshop:font-size",Z={min:12,max:22,default:16,step:1};function Se(e){return Number.isFinite(e)?Math.min(Z.max,Math.max(Z.min,Math.round(e))):Z.default}function ut(){try{let e=localStorage.getItem(pt);return e===null?Z.default:Se(Number(e))}catch{return Z.default}}function ft(e){try{localStorage.setItem(pt,String(Se(e)))}catch{}}var gt="forest-workshop:season",Qa=["auto","spring","summer","autumn","winter"];function bt(){try{let e=localStorage.getItem(gt);return Qa.includes(e)?e:"auto"}catch{return"auto"}}function ht(e){try{localStorage.setItem(gt,e)}catch{}}function Oe(e){let a=e.getMonth();return a>=2&&a<=4?"spring":a>=5&&a<=7?"summer":a>=8&&a<=10?"autumn":"winter"}function wt(e,a=new Date){return e==="auto"?Oe(a):e}var vt={spring:"\uBD04",summer:"\uC5EC\uB984",autumn:"\uAC00\uC744",winter:"\uACA8\uC6B8"};var Ya="forest-workshop",Ja=`/api/capability-packages/${Ya}/assets/assets/`,xt=["spring","summer","autumn","winter"],Xa=new Set(["wild-berry","herb","wood","pinecone","acorn","wheat","flower","pumpkin","cotton","tea-leaf","honey","mushroom","beeswax","feather","clover","berry-jam","dried-herb","flour","plank","thread","herb-tea","pumpkin-puree","acorn-flour","herb-sachet","berry-pie","wooden-tray","beeswax-candle","knit-scarf","flower-wreath","pumpkin-soup","honey-cake","birdhouse","acorn-cookie","tea-gift","apple","reed","carrot","flax","clay","salt","dried-apple","apple-jam","linen","reed-cord","prepared-clay","herb-salt","apple-bread","carrot-potage","mushroom-skewer","linen-handkerchief","herb-pillow","reed-basket","wooden-spoon","desk-organizer","clay-planter","wind-chime","apple-gift","picnic-wrap"]),kt={"gather-yard":"facilities/gather-yard.webp","grow-plot":"facilities/grow-plot.webp","survey-desk":"facilities/survey-desk.webp","process-bench":"facilities/process-bench.webp","craft-bench":"facilities/craft-bench.webp"},de={spring:{base:"backgrounds/workshop-base-spring.webp",scene:"backgrounds/workshop-scene-spring.webp"},summer:{base:"backgrounds/workshop-base-summer.webp",scene:"backgrounds/workshop-scene-summer.webp"},autumn:{base:"backgrounds/workshop-base-autumn.webp",scene:"backgrounds/workshop-scene-autumn.webp"},winter:{base:"backgrounds/workshop-base-winter.webp",scene:"backgrounds/workshop-scene-winter.webp"}},Ve={joy:"emotions/joy.webp",affection:"emotions/affection.webp",curiosity:"emotions/curiosity.webp",fluster:"emotions/fluster.webp",inspiration:"emotions/inspiration.webp",annoyance:"emotions/annoyance.webp"},le={gift:"ui/gift.webp",titleSign:"ui/title-sign.webp",primaryButton:"ui/primary-button.webp",paperPanel:"ui/paper-panel.webp",woodPanel:"ui/wood-panel.webp"};function Be(e){return`${Ja}${e}`}function Nt(e){return Xa.has(e)?`items/${e}.webp`:null}var $e=new Set;function ie(e,a){if(!e||$e.has(e))return a.fallback();let r=document.createElement("img");return r.className=a.className,r.alt=a.alt??"",r.decoding="async",r.draggable=!1,a.lazy&&(r.loading="lazy"),r.addEventListener("error",()=>{$e.add(e),r.replaceWith(a.fallback())},{once:!0}),r.src=Be(e),r}function fe(e){return`url("${Be(e)}")`}var yt=new Map;function St(e){let a=yt.get(e);return a||(a=new Promise(r=>{if($e.has(e))return r(!1);let n=new Image;n.decoding="async",n.onload=()=>r(!0),n.onerror=()=>{$e.add(e),r(!1)},n.src=Be(e)}),yt.set(e,a)),a}function Fe(e){return[{path:de[e].base,flag:"art-base"},{path:le.titleSign,flag:"art-sign"},{path:le.primaryButton,flag:"art-button"},{path:le.paperPanel,flag:"art-paper"}]}function $t(e){let a=e,r=new Set;return{get:()=>a,set(n){let i=typeof n=="function"?n(a):n;a={...a,...i};for(let o of r)o(a)},remember(n){let i=typeof n=="function"?n(a):n;a={...a,...i}},subscribe(n){return r.add(n),()=>r.delete(n)}}}var Ce=class{constructor(){P(this,"epoch",0)}beginNavigation(){return this.epoch+=1,this.epoch}isCurrentNavigation(a){return a===this.epoch}acceptsUpdate(a,r){return!a||a.worldId!==r.worldId?!1:r.revision>=a.revision}};function Ct(e){let{store:a}=e;function r(o){a.set(s=>s.register?{register:{...s.register,...o}}:{})}function n(){let o=a.get().register?.pendingImage;o&&URL.revokeObjectURL(o.previewUrl)}async function i(){let o=e.currentWorld();if(o){r({sources:{state:"loading"}});try{let{sources:s}=await T.listSources(o.worldId);r({sources:{state:"ready",value:s}})}catch(s){r({sources:{state:"error",message:W(s,"\uCE90\uB9AD\uD130\xB7\uD398\uB974\uC18C\uB098 \uBAA9\uB85D\uC744 \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC5B4\uC694.")}})}}}return{openRegister(o=1){n(),a.set({register:{step:o,kindTab:"character",query:"",sources:{state:"loading"},selected:null,preview:null,draft:"",pendingImage:null,starterChoice:null}}),e.navigate("register"),o===1&&i()},closeRegister(){n(),a.set({register:null}),e.navigate("residents")},loadSources:i,setRegisterKind:o=>r({kindTab:o,sourcePage:0}),setRegisterQuery:o=>r({query:o,sourcePage:0}),setRegisterSourcePage:o=>r({sourcePage:Math.max(0,o)}),setRegisterStarterPage:o=>r({starterPage:Math.max(0,o)}),backToSources:()=>r({step:1}),setRegisterPanel:o=>r({panel:o}),setDraft:o=>a.remember(s=>s.register?{register:{...s.register,draft:o}}:{}),setStarterChoice:o=>r({starterChoice:o}),async chooseSource(o){let s=e.currentWorld();if(s){r({step:2,panel:"source",selected:o,preview:{state:"loading"},draft:""});try{let l=await T.previewSource(s.worldId,o.kind,o.id);r({preview:{state:"ready",value:l}})}catch(l){r({preview:{state:"error",message:W(l,"\uC790\uB8CC\uB97C \uC77D\uC9C0 \uBABB\uD588\uC5B4\uC694.")}})}}},async suggestSetting(){let o=e.currentWorld(),s=a.get().register?.selected;if(!o||!s)return;let l=await e.track("rebuild-suggestion",()=>T.rebuildSuggestion(o.worldId,{kind:s.kind,id:s.id}),"\uC81C\uC548\uC744 \uBC1B\uC9C0 \uBABB\uD588\uC5B4\uC694. \uC9C1\uC811 \uC368\uB3C4 \uB3FC\uC694.");l&&r({draft:l.suggestion})},pickPendingImage(o){n(),r({pendingImage:{file:o,previewUrl:URL.createObjectURL(o)}})},clearPendingImage(){n(),r({pendingImage:null})},async confirmRegister(o,s){let l=a.get().register,m=l?.selected;if(!l||!m||!l.draft.trim())return;let d=`register:${m.kind}:${m.id}`,p=e.requestIdFor(`${d}:id`,d,Q);if(!await e.runCommand(d,"residents.register",{residentId:p,source:{kind:m.kind,id:m.id},worldSetting:l.draft}))return;e.forgetRequest(`${d}:id`);let h=o?l.pendingImage:null;h&&await s(p,h.file),n();let f=e.currentWorld();if(f&&f.state.progress.starterResidentId===null){r({step:3,starterChoice:p,pendingImage:null,selected:null,preview:null,draft:""});return}a.set(b=>({register:null,residentsView:{...b.residentsView,selectedId:p}})),e.navigate("residents"),e.notify(`${m.name}\uC744(\uB97C) \uC8FC\uBBFC\uC73C\uB85C \uB4F1\uB85D\uD588\uC5B4\uC694.`)},async confirmStarter(){let o=a.get().register?.starterChoice;!o||!await e.runCommand("choose-starter","residents.chooseStarter",{residentId:o})||(a.set({register:null}),e.navigate("home"),e.notify("\uC2DC\uC791 \uC8FC\uBBFC\uC774 \uACF5\uBC29\uC5D0 \uC654\uC5B4\uC694."))},registerAnother(){r({step:1,query:""}),i()}}}var Za=6e4;function It(e){return e.map((a,r)=>({rule:a,index:r})).sort((a,r)=>a.rule.priority-r.rule.priority||a.index-r.index).map(({rule:a})=>a)}function De(e){return e.map((a,r)=>({...a,priority:Math.min(5,r+1)}))}function qe(e,a,r){return e.work.drafts[r]??It(a.facilities[r]?.rules??[])}function Rt(e,a,r){let n=e.work.drafts[r];return!!n&&JSON.stringify(n)!==JSON.stringify(It(a.facilities[r]?.rules??[]))}function Ie(e){let{activity:a,simMs:r,...n}=e.production;return JSON.stringify([e.inventory,e.wallet,n,a.lastAbsence])}function Mt(e){let{store:a}=e,r,n=!1;function i(){return a.get().content}function o(d){a.set(p=>({work:{...p.work,...d}}))}function s(d,p){let u=e.currentWorld();if(!u)return;let h=qe(a.get(),u.state.production,d);o({drafts:{...a.get().work.drafts,[d]:p(h.map(f=>({...f})))}})}async function l(){let d=e.currentWorld();if(!(!d||n)&&!(typeof document<"u"&&(document.visibilityState!=="visible"||!document.hasFocus()))){n=!0;try{let p=await T.heartbeat(d.worldId),u=e.currentWorld();if(!u||u.worldId!==p.worldId)return;Ie(u.state)===Ie(p.state)?e.rememberWorld(p):e.showWorld(p)}catch{}finally{n=!1}}}async function m(){let d=e.currentWorld();if(d)try{let p=await T.getState(d.worldId),u=e.currentWorld();if(!u||u.worldId!==p.worldId)return;Ie(u.state)===Ie(p.state)?e.rememberWorld(p):e.showWorld(p)}catch{}}return{heartbeat:l,refreshProduction:m,startHeartbeat(){clearInterval(r),r=setInterval(()=>{l()},Za),l()},stopHeartbeat(){clearInterval(r),r=void 0},selectFacility(d){o({facilityId:d,section:"status",queueView:void 0,queuePage:0,priorityPage:0})},setWorkSection(d){o({section:d})},setInventoryPage(d){o({inventoryPage:Math.max(0,d)})},setQueueView(d){o({queueView:d})},setQueuePage(d){o({queuePage:Math.max(0,d)})},setPriorityPage(d){o({priorityPage:Math.max(0,d)})},rememberQueueCount(d,p){a.remember(u=>({work:{...u.work,queueCounts:{...u.work.queueCounts,[d]:p}}}))},rememberProtection(d){a.remember(p=>{if(p.sheet?.kind!=="protect-edit")return{};let u={...p.sheet.drafts};return d.itemId!==void 0&&d.amount!==void 0&&(u[d.itemId]=d.amount),{sheet:{...p.sheet,page:d.page??p.sheet.page,drafts:u}}})},selectRule(d,p){o({selected:{...a.get().work.selected,[d]:p}})},changeTarget(d,p,u){let h=i()?.production.targetStock??{min:1,max:999};s(d,f=>f.map(b=>b.policyId===p?{...b,targetStock:Math.min(h.max,Math.max(h.min,b.targetStock+u))}:b))},toggleRule(d,p){s(d,u=>u.map(h=>h.policyId===p?{...h,enabled:!h.enabled}:h))},moveRule(d,p,u){s(d,h=>{let f=h.findIndex($=>$.policyId===p),b=f+u;if(f<0||b<0||b>=h.length)return h;let v=[...h];return[v[f],v[b]]=[v[b],v[f]],De(v)})},addRule(d,p){let u=i()?.production.recommendedRules[d]?.find(f=>f.recipeId===p),h=Q();s(d,f=>De([...f,{policyId:h,enabled:!0,recipeId:p,targetStock:u?.targetStock??10,priority:5}])),o({selected:{...a.get().work.selected,[d]:h}})},removeRule(d,p){s(d,u=>De(u.filter(h=>h.policyId!==p)))},recommendRules(d){let p=e.currentWorld(),u=i()?.production.recommendedRules[d]??[];if(!p)return;let h=p.state.production.facilities[d]?.rules??[],f=u.map(b=>({policyId:h.find(v=>v.recipeId===b.recipeId)?.policyId??Q(),enabled:!0,recipeId:b.recipeId,targetStock:b.targetStock,priority:b.priority}));o({drafts:{...a.get().work.drafts,[d]:f}}),e.notify("\uCD94\uCC9C \uC124\uC815\uC744 \uBD88\uB7EC\uC654\uC5B4\uC694. \uD655\uC778\uD55C \uB4A4 '\uC6B4\uC601 \uADDC\uCE59 \uC801\uC6A9'\uC744 \uB204\uB974\uBA74 \uBC14\uB00C\uC5B4\uC694.")},discardDraft(d){let p={...a.get().work.drafts};delete p[d],o({drafts:p})},async applyRules(d){let p=a.get().work.drafts[d];if(!p||!await e.runCommand(`rules:${d}`,"production.setRules",{facilityId:d,rules:p}))return;let h={...a.get().work.drafts};delete h[d],o({drafts:h}),e.notify("\uC6B4\uC601 \uADDC\uCE59\uC744 \uC801\uC6A9\uD588\uC5B4\uC694. \uC9C0\uAE08 \uC791\uC5C5\uC740 \uADF8\uB300\uB85C \uC774\uC5B4\uC9C0\uACE0 \uB2E4\uC74C \uD68C\uCC28\uBD80\uD130 \uBC14\uB00C\uC5B4\uC694.")},async upgradeFacility(d,p){let u=await e.runCommand(`upgrade:${d}:${p}`,"production.upgradeFacility",{facilityId:d,fromLevel:p});u&&e.notify(`Lv. ${String(u.result.level)}\uB85C \uAC15\uD654\uD588\uC5B4\uC694. \uB2E4\uC74C \uD68C\uCC28\uBD80\uD130 \uBE68\uB77C\uC838\uC694.`)},async setProtected(d,p){await e.runCommand(`protect:${d}`,"production.setProtected",{itemId:d,amount:p})&&a.remember(h=>{if(h.sheet?.kind!=="protect-edit"||h.sheet.drafts?.[d]!==p)return{};let f={...h.sheet.drafts};return delete f[d],{sheet:{...h.sheet,drafts:f}}})},async sell(d,p){let u=await e.runCommand(`sell:${d}`,"economy.sell",{itemId:d,amount:p});u&&(a.set({sheet:null}),e.notify(`${p}\uAC1C\uB97C \uD314\uC544 ${String(u.result.gold)} G\uB97C \uBC1B\uC558\uC5B4\uC694.`))},async unlockFacility(d){let p=await e.runCommand(`unlock:${d}`,"production.unlockFacility",{facilityId:d});p&&!p.result.alreadyOpen&&e.notify("\uC2DC\uC124\uC774 \uC5F4\uB838\uC5B4\uC694. \uCD94\uCC9C \uADDC\uCE59\uC73C\uB85C \uBC14\uB85C \uC77C\uC744 \uC2DC\uC791\uD574\uC694.")},async setMode(d,p){(await e.runCommand(`mode:${d}`,"production.setMode",{facilityId:d,mode:p}))?.result.running&&e.notify("\uC9C0\uAE08 \uC791\uC5C5\uC774 \uB05D\uB098\uBA74 \uBC14\uB010 \uBC29\uC2DD\uC73C\uB85C \uC774\uC5B4\uC838\uC694.")},selectQueueRecipe(d,p){o({queueRecipe:{...a.get().work.queueRecipe,[d]:p}})},async addQueue(d,p,u){let h=`queue-entry:${d}`,f=e.requestIdFor(h,JSON.stringify([p,u]),Q);await e.runCommand(`queue:${d}`,"production.queueAdd",{facilityId:d,entryId:f,recipeId:p,count:u})&&e.forgetRequest(h)},async removeQueue(d,p){await e.runCommand(`queue-remove:${p}`,"production.queueRemove",{facilityId:d,entryId:p})},async assignResident(d,p){await e.runCommand(`assign:${d}`,"production.assignResident",{facilityId:d,residentId:p})&&a.set({sheet:null})},async setAutoSell(d,p){await e.runCommand(`auto-sell:${d}`,"economy.setAutoSell",{itemId:d,setting:p})&&e.notify(p.enabled?"\uC790\uB3D9 \uD310\uB9E4 \uC124\uC815\uC744 \uC800\uC7A5\uD588\uC5B4\uC694.":"\uC790\uB3D9 \uD310\uB9E4\uB97C \uAED0\uC5B4\uC694.")},async readReports(d){await e.runCommand("reports-read","production.markReportsRead",{throughReportId:d})&&a.set({sheet:null})}}}function At(e,a){let r=a.query.trim().toLowerCase();return Object.values(e.residents).filter(n=>a.tab==="all"||n.kind===a.tab).filter(n=>a.filter==="all"?!0:a.filter==="recruited"?n.recruited:!n.recruited).filter(n=>!r||n.displayName.toLowerCase().includes(r)||n.source.name.toLowerCase().includes(r)).sort((n,i)=>Number(i.recruited)-Number(n.recruited)||n.registeredAt.localeCompare(i.registeredAt))}function Ge(e,a){return`pair-add:${[e,a].sort().join(":")}`}function _e(e,a){return e.residentIds[0]===a?e.residentIds[1]:e.residentIds[0]}function Pt(e){let{store:a}=e;function r(i){let o=e.currentWorld();return o&&i?o.state.residents[i]??null:null}function n(i){a.set(o=>({residentsView:{...o.residentsView,...i}}))}return{setResidentsTab:i=>n({tab:i,page:0}),setResidentsQuery:i=>n({query:i,page:0}),setResidentsFilter:i=>n({filter:i,page:0}),setResidentsPage:i=>n({page:Math.max(0,i)}),showResidentsList:()=>n({detailOpen:!1}),selectResident:i=>n({selectedId:i,detailOpen:!0}),openResidents(i){n(i?{selectedId:i,detailOpen:!0}:{detailOpen:!1}),e.navigate("residents")},openRelations(i){a.set({focusResidentId:i}),e.navigate("relations")},openResidentImage(i){let o=r(i);a.set({focusResidentId:i,placementDraft:o?{...o.image.placement}:null}),e.navigate("resident-image")},openSheet(i){a.set({sheet:i,notice:null})},closeSheet(){a.set({sheet:null})},rememberProfile(i){a.remember(o=>o.sheet?.kind==="profile"?{sheet:{...o.sheet,...i}}:{})},toggleRelationsEditing(){a.set(i=>({relationsEditing:!i.relationsEditing}))},async updateWorldSetting(i,o){let s=await e.runCommand(`resident-setting:${i}`,"residents.update",{residentId:i,worldSetting:o});return s&&(a.remember(l=>l.sheet?.kind==="profile"?{sheet:{...l.sheet,draft:void 0}}:{}),e.notify("\uACF5\uBC29 \uC138\uACC4 \uC124\uC815\uC744 \uACE0\uCCE4\uC5B4\uC694. \uBCC0\uACBD \uC774\uB825\uC5D0 \uB0A8\uC558\uC5B4\uC694.")),s},async addPair(i,o){let s=r(i),l=r(o);if(!s||!l)return;let m=Ge(s.residentId,l.residentId),d=e.requestIdFor(`${m}:id`,m,Q);await e.runCommand(m,"pairs.add",{pairId:d,residentIds:[s.residentId,l.residentId]})&&(e.forgetRequest(`${m}:id`),a.set({sheet:null}),e.notify(`${s.displayName} \xD7 ${l.displayName} \uD398\uC5B4\uB97C \uB9CC\uB4E4\uC5C8\uC5B4\uC694.`))},archivePair:i=>e.runCommand(`pair-archive:${i}`,"pairs.archive",{pairId:i}),restorePair:i=>e.runCommand(`pair-restore:${i}`,"pairs.restore",{pairId:i}),setPlacementDraft(i){a.set(o=>o.placementDraft?{placementDraft:{...o.placementDraft,...i}}:{})},resetPlacementDraft(){let i=a.get().content?.residents.placement;i&&a.set({placementDraft:{scale:i.scale.default,offsetX:i.offsetX.default,markerHeight:i.markerHeight.default}})},async applyPlacement(i){let o=a.get().placementDraft;if(!o)return;await e.runCommand(`placement:${i}`,"residents.setPlacement",{residentId:i,placement:o})&&e.notify("\uBC30\uCE58\uB97C \uC801\uC6A9\uD588\uC5B4\uC694. \uADF8\uB9BC \uD30C\uC77C\uC740 \uADF8\uB300\uB85C\uC608\uC694.")},async uploadResidentImage(i,o){let s=e.currentWorld();if(!s)return null;let l=`image-upload:${i}`,m=e.requestIdFor(l,`${i}:${o.name}:${o.size}:${o.lastModified}`),d=await e.track(l,()=>T.uploadResidentImage({worldId:s.worldId,residentId:i,uploadKey:m,file:o}),"\uADF8\uB9BC\uC744 \uC800\uC7A5\uD558\uC9C0 \uBABB\uD588\uC5B4\uC694. \uAE30\uC874 \uADF8\uB9BC\uC740 \uADF8\uB300\uB85C\uC608\uC694.");if(!d)return null;let p=e.currentWorld()??s;return e.showWorld({worldId:p.worldId,revision:d.revision,updatedAt:new Date().toISOString(),state:d.state}),e.notify(d.duplicate?"\uC774\uBBF8 \uC800\uC7A5\uB41C \uADF8\uB9BC\uC774\uC5D0\uC694.":"\uADF8\uB9BC\uC744 WebP\uB85C \uC800\uC7A5\uD588\uC5B4\uC694."),d},async restoreResidentImage(i,o){await e.runCommand(`image-restore:${i}`,"residents.restoreImage",{residentId:i,reference:o})&&(a.set({sheet:null}),e.notify("\uC774\uC804 \uADF8\uB9BC\uC73C\uB85C \uB418\uB3CC\uB838\uC5B4\uC694."))},async clearImageHistory(){let i=await e.runCommand("image-history-clear","residents.clearImageHistory",{});if(!i)return;a.set({sheet:null});let o=Array.isArray(i.result.released)?i.result.released.length:0;e.notify(o?`\uC774\uC804 \uADF8\uB9BC ${o}\uC7A5\uC744 \uC815\uB9AC\uD588\uC5B4\uC694.`:"\uC815\uB9AC\uD560 \uC774\uC804 \uADF8\uB9BC\uC774 \uC5C6\uC5B4\uC694."),await e.refreshStorage()}}}function Tt(e){let{store:a}=e;async function r(){let n=e.currentWorld();if(n){a.set({deliveries:{state:"loading"}});try{a.set({deliveries:{state:"ready",value:await T.getDeliveries(n.worldId)}})}catch(i){a.set({deliveries:{state:"error",message:W(i,"\uB0A9\uD488 \uC758\uB8B0\uB97C \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.")}})}}}return{setInviteTab(n){a.set({inviteTab:n,invitePage:0})},setInvitePage(n){a.set({invitePage:Math.max(0,n)})},setInviteSheetPage(n){a.set(i=>{let o=i.sheet;return!o||o.kind!=="invite-result"&&o.kind!=="invite-chances"&&o.kind!=="invite-log"&&o.kind!=="invite-wish"?{}:{sheet:{...o,page:Math.max(0,n)}}})},async draw(n){let i=await e.runCommand(`invite:${n}`,"invite.draw",{count:n});i&&a.set({sheet:{kind:"invite-result",draws:i.result.draws}})},async setWish(n){await e.runCommand("invite-wish","invite.setWish",{residentId:n})&&a.set({sheet:null})},async exchange(n){let i=await e.runCommand(`exchange:${n}`,"invite.exchange",{residentId:n});i&&a.set({sheet:{kind:"invite-result",draws:[i.result]}})},openDeliveries(){a.set({sheet:{kind:"deliveries"}}),r()},async deliver(n){let i=await e.runCommand(`deliver:${n}`,"economy.deliver",{orderId:n});if(!i)return;let o=i.result.reward;e.notify(`\uB0A9\uD488\uD588\uC5B4\uC694. \uCD08\uB300\uAD8C ${o.tickets}\uC7A5\uACFC ${o.gold} G\uB97C \uBC1B\uC558\uC5B4\uC694.`),await r()}}}var er=2800;function Lt(e){let{store:a}=e,r,n=-1,i="";function o(f){a.set(b=>({explore:{...b.explore,...f}}))}function s(f){a.set(b=>b.reader?{reader:{...b.reader,...f}}:{})}async function l(f=!1){let b=e.currentWorld();if(b){f||o({overview:{state:"loading"}});try{let v=await T.getStoryOverview(b.worldId),$=a.get().explore.pairId;o({overview:{state:"ready",value:v},pairId:v.pairs.some(A=>A.pairId===$)?$:v.pairs[0]?.pairId??null})}catch(v){f||o({overview:{state:"error",message:W(v,"\uC774\uC57C\uAE30\uB97C \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.")}})}}}a.subscribe(f=>{f.route!==i&&(i=f.route,f.route==="explore"&&l(f.explore.overview?.state==="ready"));let b=f.world?.state==="ready"?f.world.value.revision:-1;b!==n&&(n=b,(f.route==="explore"||f.route==="home")&&f.explore.overview?.state==="ready"&&l(!0))});function m(){clearInterval(r),r=void 0}function d(){let f=a.get().reader;return f?.story.state==="ready"?f.story.value.segments:[]}function p(){let f=a.get().reader,b=e.currentWorld();if(!f||!b)return!1;let v=b.state.stories.pairs[f.pairId],A=[v?.current,...v?.completed??[]].find(L=>L?.episodes[f.episode]?.storyId===f.storyId)?.episodes[f.episode];return!!A?.choice||A?.state==="read"}function u(){let f=a.get().reader;if(!f)return;let b=d();b[f.index]?.kind==="choice"&&!p()||(f.index<b.length&&s({index:f.index+1,choiceView:"question"}),f.index+1>=b.length&&m())}async function h(){let f=a.get().reader,b=e.currentWorld();if(!(!f||!b)){s({story:{state:"loading"}});try{let v;try{v=await T.getStory(b.worldId,f.storyId)}catch($){if(me($)!=="story_not_found")throw $;v=await T.generateStory(b.worldId,f.pairId,f.episode)}if(a.get().reader?.storyId!==f.storyId)return;s({story:{state:"ready",value:v},index:0})}catch(v){if(a.get().reader?.storyId!==f.storyId)return;s({story:{state:"error",message:W(v,"\uC774\uC57C\uAE30\uB97C \uC4F0\uC9C0 \uBABB\uD588\uC5B4\uC694. \uAC19\uC740 \uC774\uC57C\uAE30\uB85C \uB2E4\uC2DC \uC2DC\uB3C4\uD560 \uC218 \uC788\uC5B4\uC694.")}})}}}return{loadStoryOverview:l,openExplore(){e.navigate("explore")},setExploreTab(f){o({tab:f})},setExploreSection(f){o({section:f})},setExploreHistoryPage(f){o({historyPage:Math.max(0,f)})},selectStoryPair(f){o({pairId:f,historyPage:0})},async depart(f,b){let v=await e.runCommand(`depart:${f}:${b}`,"stories.depart",{pairId:f,episode:b});v&&(e.notify(`\uD0D0\uD5D8\uC744 \uB5A0\uB0AC\uC5B4\uC694. ${String(v.result.minutes)}\uBD84 \uB4A4\uC5D0 \uC774\uC57C\uAE30\uAC00 \uC5F4\uB824\uC694.`),await l(!0))},async cancelExpedition(){await e.runCommand("expedition-cancel","stories.cancel",{})&&(e.notify("\uD0D0\uD5D8\uC744 \uCDE8\uC18C\uD588\uC5B4\uC694. \uC900\uBE44\uBB3C\uC740 \uBAA8\uB450 \uB3CC\uB824\uBC1B\uC558\uC5B4\uC694."),await l(!0))},openStory(f,b,v){m();let $=a.get().route==="story"?"explore":a.get().route;a.set({reader:{pairId:f,episode:b,storyId:v,story:{state:"loading"},index:0,auto:!1,backlog:!1,from:$}}),e.navigate("story"),h()},retryStory(){h()},advanceStory:u,setChoiceView(f){s({choiceView:f})},toggleAuto(){let f=a.get().reader;if(f){if(f.auto){m(),s({auto:!1});return}s({auto:!0}),r=setInterval(()=>{if(!a.get().reader?.auto||a.get().route!=="story")return m();u()},er)}},toggleBacklog(){let f=a.get().reader;f&&s({backlog:!f.backlog,backlogPage:void 0})},setBacklogPage(f){s({backlogPage:Math.max(0,f)})},async chooseAnswer(f){let b=a.get().reader;if(!b)return;await e.runCommand(`choose:${b.storyId}`,"stories.choose",{pairId:b.pairId,episode:b.episode,storyId:b.storyId,optionId:f})&&u()},async finishStory(){let f=a.get().reader;if(!f)return;m();let b=await e.runCommand(`read:${f.storyId}`,"stories.markRead",{pairId:f.pairId,episode:f.episode,storyId:f.storyId});b&&(o({tab:"story",section:"history",pairId:f.pairId,historyPage:0}),a.set({reader:null}),e.navigate("explore"),b.result.alreadyRead||e.notify(b.result.arcDone?"\uC774 \uD0D0\uD5D8\uC758 \uC774\uC57C\uAE30\uB97C \uBAA8\uB450 \uC77D\uC5C8\uC5B4\uC694. \uB2E4\uC74C \uD0D0\uD5D8\uC774 \uC5F4\uB838\uC5B4\uC694.":"\uC774\uC57C\uAE30\uB97C \uB2E4 \uC77D\uC5C8\uC5B4\uC694. \uB2E4\uC74C \uC774\uC57C\uAE30\uB97C \uB5A0\uB0A0 \uC218 \uC788\uB294\uC9C0 \uD655\uC778\uD574 \uBCF4\uC138\uC694."),await l(!0))},closeStory(){let f=a.get().reader;m(),a.set({reader:null}),e.navigate(f?.from&&f.from!=="story"?f.from:"explore")}}}var He="forest-workshop:last-world";function tr(){try{return localStorage.getItem(He)}catch{return null}}function zt(e){try{e?localStorage.setItem(He,e):localStorage.removeItem(He)}catch{}}function ar(e){let a=e.status;return typeof a=="number"&&a>=400&&a<500&&me(e)!==null}function Et(){let e=$t({route:"worlds",worlds:{state:"loading"},world:null,content:null,busy:{},notice:null,restore:null,fontSize:ut(),seasonChoice:bt(),artReady:[],facilitiesTab:"facilities",storage:null,starterSheetHidden:!1,residentsView:{tab:"all",query:"",filter:"all",selectedId:null},focusResidentId:null,relationsEditing:!1,sheet:null,placementDraft:null,register:null,work:{facilityId:"gather-yard",drafts:{},selected:{},queueRecipe:{}},inviteTab:"invite",deliveries:null,explore:{tab:"story",pairId:null,overview:null},reader:null,worldReceivedAt:Date.now()}),a=new Map,r=new Ce;function n(){for(let{path:g}of Fe(oe(e.get())))St(g).then(x=>{x&&!e.get().artReady.includes(g)&&e.set(k=>({artReady:[...k.artReady,g]}))})}n();let i=4e3,o=null,s;e.subscribe(g=>{if(g.notice!==o&&(o=g.notice,clearTimeout(s),o?.kind==="info")){let x=o;s=setTimeout(()=>{e.get().notice===x&&e.set({notice:null})},i)}});function l(g,x,k=ke){let C=a.get(g);if(C&&C.signature===x)return C.id;let M=k();return a.set(g,{id:M,signature:x}),M}function m(g,x){e.set(k=>({busy:{...k.busy,[g]:x}}))}async function d(g,x,k){if(e.get().busy[g])return null;m(g,!0),e.set({notice:null});try{let C=await x();return a.delete(g),C}catch(C){return ar(C)&&a.delete(g),e.set({notice:{kind:"error",text:W(C,k)}}),me(C)==="stale_view"&&A(),null}finally{m(g,!1)}}function p(g,x){zt(g.worldId),e.set(k=>({world:{state:"ready",value:{worldId:g.worldId,revision:g.revision,updatedAt:g.updatedAt,state:g.state}},worldReceivedAt:Date.now(),work:k.world?.state==="ready"&&k.world.value.worldId===g.worldId?k.work:{facilityId:k.work.facilityId,drafts:{},selected:{},queueRecipe:{}},content:x??k.content,route:k.route==="worlds"?"home":k.route}))}function u(g,x){r.acceptsUpdate(L(),g)&&p(g,x)}function h(g,x){r.beginNavigation(),p(g,x)}function f(g){r.acceptsUpdate(L(),g)&&e.remember({world:{state:"ready",value:{worldId:g.worldId,revision:g.revision,updatedAt:g.updatedAt,state:g.state}},worldReceivedAt:Date.now()})}async function b(){e.set({worlds:{state:"loading"}});try{let{worlds:g}=await T.listWorlds();return e.set({worlds:{state:"ready",value:g}}),g}catch(g){return e.set({worlds:{state:"error",message:W(g,"\uC138\uACC4 \uBAA9\uB85D\uC744 \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.")}}),null}}async function v(g){let x=r.beginNavigation();e.set({world:{state:"loading"},route:"home",notice:null});try{let k=await T.getState(g);if(!r.isCurrentNavigation(x))return;p(k,k.content)}catch(k){if(!r.isCurrentNavigation(x))return;me(k)==="world_not_found"&&zt(null),e.set({world:{state:"error",message:W(k,"\uC138\uACC4\uB97C \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.")}})}}async function $(){let g=L();if(g){e.set({storage:{state:"loading"}});try{e.set({storage:{state:"ready",value:await T.getStorage(g.worldId)}})}catch(x){e.set({storage:{state:"error",message:W(x,"\uC800\uC7A5 \uACF5\uAC04\uC744 \uD655\uC778\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.")}})}}}async function A(){let g=e.get().world;g?.state==="ready"&&await v(g.value.worldId)}function L(){let g=e.get().world;return g?.state==="ready"?g.value:null}function X(g){e.set({route:g,notice:null,restore:null,sheet:null,relationsEditing:!1}),g==="worlds"&&b(),g==="backup"&&$()}async function F(g,x,k={}){let C=L();if(!C)return null;let M=JSON.stringify([C.worldId,x,k]),K=l(g,M),ne=await d(g,()=>T.sendCommand({worldId:C.worldId,commandId:K,expectedRevision:C.revision,type:x,payload:k}),"\uC694\uCCAD\uC744 \uCC98\uB9AC\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4. \uB2E4\uC2DC \uC2DC\uB3C4\uD574 \uC8FC\uC138\uC694.");return!ne||L()?.worldId!==C.worldId?null:(u({worldId:C.worldId,revision:ne.revision,updatedAt:new Date().toISOString(),state:ne.state}),ne)}let q={store:e,track:d,runCommand:F,currentWorld:L,requestIdFor:l,forgetRequest:g=>a.delete(g),showWorld:u,rememberWorld:f,navigate:X,refreshStorage:$,notify:(g,x="info")=>e.set({notice:{kind:x,text:g}})};return{store:e,...Pt(q),...Ct(q),...Mt(q),...Tt(q),...Lt(q),async start(){let g=await b(),x=tr();g&&x&&g.some(k=>k.worldId===x&&k.readable)&&await v(x)},loadWorlds:b,openWorld:v,reloadWorld:A,setWorldsPage(g){e.set({worldsPage:Math.max(0,g)})},rememberWorldDraft(g){e.remember({worldDraft:g})},rememberWorldCreateOpen(g){e.remember({worldCreateOpen:g})},navigate:X,notify:q.notify,notifyLocked(g){e.set({notice:{kind:"info",text:mt(g)}})},setSeasonChoice(g){ht(g),e.set({seasonChoice:g}),n()},setFontSize(g){let x=Se(g);ft(x),e.set({fontSize:x})},setFacilitiesTab(g){e.set(x=>({facilitiesTab:g,work:{...x.work,inventoryPage:0}}))},setSettingsSection(g){e.set({settingsSection:g})},rememberSettingsNickname(g,x){e.remember({settingsNicknameDraft:{worldId:g,value:x}})},async saveSettingsNickname(g,x){let k=await F("rename-nickname","settings.update",{playerNickname:x}),C=e.get().settingsNicknameDraft;return k&&C?.worldId===g&&C.value===x&&e.remember({settingsNicknameDraft:void 0}),k},hideStarterSheet(){e.set({starterSheetHidden:!0})},showStarterSheet(){e.set({starterSheetHidden:!1})},dismissNotice(){e.set({notice:null})},async createWorld(g,x){let k=JSON.stringify([g.trim(),x.trim()]),C=l("create-world",k,Q),M=await d("create-world",()=>T.createWorld({worldId:C,worldName:g,playerNickname:x}),"\uC138\uACC4\uB97C \uB9CC\uB4E4\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.");M&&(e.remember({worldDraft:void 0,worldCreateOpen:!1}),h(M,M.content))},runCommand:F,async downloadBackup(){let g=L();if(!g)return;let x=await d("backup",()=>T.getBackup(g.worldId),"\uBC31\uC5C5\uC744 \uB9CC\uB4E4\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.");if(!x)return;let k=new Blob([`${JSON.stringify(x,null,2)}
`],{type:"application/json"}),C=URL.createObjectURL(k),M=document.createElement("a");M.href=C,M.download=`forest-workshop-${g.state.settings.worldName}-${x.exportedAt.slice(0,10)}.json`,document.body.append(M),M.click(),M.remove(),setTimeout(()=>URL.revokeObjectURL(C),1e4),e.set({notice:{kind:"info",text:"\uBC31\uC5C5 \uD30C\uC77C\uC744 \uC800\uC7A5\uD588\uC2B5\uB2C8\uB2E4. \uBE44\uBC00\uD0A4\uB294 \uB4E4\uC5B4 \uC788\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4."}})},async selectRestoreFile(g){let x;try{x=JSON.parse(await g.text())}catch{e.set({restore:null,notice:{kind:"error",text:"\uBC31\uC5C5 \uD30C\uC77C\uC744 \uC77D\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4. JSON \uBC31\uC5C5 \uD30C\uC77C\uC744 \uACE8\uB77C \uC8FC\uC138\uC694."}});return}let k=dt(x);if(!k.ok){e.set({restore:null,notice:{kind:"error",text:k.message}});return}e.set({notice:null,restore:{fileName:g.name,signature:`${g.name}:${g.size}:${g.lastModified}`,backup:x,summary:k.summary}})},cancelRestore(){e.set({restore:null})},async confirmRestore(){let g=e.get().restore;if(!g)return;let x=l("restore",g.signature,Q),k=await d("restore",()=>T.restore(x,g.backup),"\uBC31\uC5C5\uC744 \uBCF5\uC6D0\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.");k&&(h(k,k.content),e.set({route:"home",restore:null,notice:{kind:"info",text:`\uBC31\uC5C5\uC744 \uC0C8 \uC138\uACC4 '${k.state.settings.worldName}'(\uC73C)\uB85C \uBCF5\uC6D0\uD588\uC2B5\uB2C8\uB2E4. \uAE30\uC874 \uC138\uACC4\uB294 \uADF8\uB300\uB85C\uC785\uB2C8\uB2E4.`}}))}}}function oe(e){return wt(e.seasonChoice)}function Wt(e){return Fe(oe(e)).filter(({path:a})=>e.artReady.includes(a)).map(({flag:a})=>` ${a}`).join("")}function jt(e){return e.route==="residents"?e.residentsView.detailOpen?`residents:detail:${e.residentsView.selectedId}`:`residents:list:${e.residentsView.page??0}`:e.route==="work"?`work:${e.work.facilityId}:${e.work.section??"status"}:${e.work.queueView??""}:${e.work.queuePage??0}:${e.work.priorityPage??0}`:e.route==="facilities"?`facilities:${e.facilitiesTab}:${e.work.inventoryPage??0}`:e.route==="settings"?`settings:${e.settingsSection??"workshop"}`:e.route==="explore"?`explore:${e.explore?.pairId??""}:${e.explore?.section??"episode"}:${e.explore?.historyPage??0}`:e.route==="invite"?`invite:${e.inviteTab??"invite"}:${e.invitePage??0}`:e.route==="register"?`register:${e.register?.step??1}:${e.register?.panel??"source"}:${e.register?.sourcePage??0}:${e.register?.starterPage??0}`:e.route==="worlds"?`worlds:${e.worldsPage??0}`:e.route}function t(e,a={},r=[]){let n=document.createElement(e);a.className&&(n.className=a.className),a.text!==void 0&&(n.textContent=a.text);for(let[i,o]of Object.entries(a.attrs??{}))o!==void 0&&n.setAttribute(i,o);for(let[i,o]of Object.entries(a.on??{}))o&&n.addEventListener(i,o);a.disabled!==void 0&&"disabled"in n&&(n.disabled=a.disabled);for(let i of r)i==null||i===!1||n.append(typeof i=="string"?document.createTextNode(i):i);return n}function w(e,a,r={}){return t("button",{className:r.variant==="secondary"?"button secondary":"button",text:e,attrs:{type:"button",...r.attrs},disabled:r.disabled,on:{click:a}})}function I(e){return t("p",{className:"muted",text:e,attrs:{role:"status"}})}function _(e){return t("p",{className:"error",text:e,attrs:{role:"alert"}})}function Ue(e){return e>=1024*1024?`${(e/(1024*1024)).toFixed(1)}MiB`:e>=1024?`${Math.round(e/1024)}KiB`:`${e}B`}var Ke="http://www.w3.org/2000/svg";function y(e){return(a="icon")=>{let r=document.createElementNS(Ke,"svg");r.setAttribute("viewBox","0 0 24 24"),r.setAttribute("aria-hidden","true"),r.setAttribute("focusable","false"),r.setAttribute("class",a);for(let n of e){let i=typeof n=="string"?{d:n}:n,o=i.circle?document.createElementNS(Ke,"circle"):document.createElementNS(Ke,"path");i.circle?(o.setAttribute("cx",String(i.circle[0])),o.setAttribute("cy",String(i.circle[1])),o.setAttribute("r",String(i.circle[2]))):o.setAttribute("d",i.d??""),i.fill&&o.setAttribute("class","fill"),r.append(o)}return r}}var c={back:y(["M15 5l-7 7 7 7"]),chevron:y(["M9 5l7 7-7 7"]),gear:y([{circle:[12,12,3.2]},"M19.4 13.5l1.6 1.2-2 3.4-1.9-.7a7.6 7.6 0 0 1-2 1.2l-.3 2h-4l-.3-2a7.6 7.6 0 0 1-2-1.2l-1.9.7-2-3.4 1.6-1.2a7.6 7.6 0 0 1 0-3l-1.6-1.2 2-3.4 1.9.7a7.6 7.6 0 0 1 2-1.2l.3-2h4l.3 2a7.6 7.6 0 0 1 2 1.2l1.9-.7 2 3.4-1.6 1.2a7.6 7.6 0 0 1 0 3z"]),lock:y(["M7 11V8a5 5 0 0 1 10 0v3","M5.5 11h13v9h-13z"]),home:y(["M3.5 11.5L12 4l8.5 7.5","M6 10v10h12V10","M10 20v-5h4v5"]),hammer:y(["M14 4l6 6-2.5 2.5-6-6z","M12.5 8.5L4 17l3 3 8.5-8.5"]),compass:y([{circle:[12,12,8.5]},"M15.5 8.5l-2 5-5 2 2-5z"]),residents:y([{circle:[9,9,3.2]},{circle:[16.5,10,2.6]},"M3.5 19c.8-3.2 3-5 5.5-5s4.7 1.8 5.5 5","M14.5 15.5c2.6-.6 5 .8 6 3.5"]),ticket:y(["M4 7h16v3a2 2 0 0 0 0 4v3H4v-3a2 2 0 0 0 0-4z","M10 9.5c1.5 0 3 1 3 2.5s-1.5 2.5-3 2.5"]),mail:y(["M4 6.5h16v11H4z","M4.5 7l7.5 6 7.5-6"]),weather:y(["M7 18h10a3.5 3.5 0 0 0 .4-7A5 5 0 0 0 7.8 10 4 4 0 0 0 7 18z"]),clock:y([{circle:[12,12,8.5]},"M12 7.5V12l3 2"]),info:y([{circle:[12,12,8.5]},"M12 11v5.5","M12 7.6v.4"]),check:y(["M5 12.5l4.5 4.5L19 7.5"]),eye:y(["M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z",{circle:[12,12,2.8]}]),image:y(["M4 5h16v14H4z",{circle:[9,10,1.6]},"M4.5 17l5-5 4 4 2.5-2.5 3.5 3.5"]),landscape:y(["M4 5h16v14H4z","M4.5 17l5.5-6 4 4 2-2 3.5 4"]),document:y(["M7 3.5h7l4 4V20.5H7z","M14 3.5v4h4","M9.5 12h6","M9.5 15.5h6"]),folder:y(["M3.5 7h6l2 2h9v10h-17z"]),book:y(["M12 6.5c-2-1.3-4.7-1.6-8-1v13c3.3-.6 6-.3 8 1 2-1.3 4.7-1.6 8-1v-13c-3.3-.6-6-.3-8 1z","M12 6.5v13"]),flower:y([{circle:[12,12,2.4]},{circle:[12,6.5,2.6]},{circle:[17.2,10.3,2.6]},{circle:[15.2,16.5,2.6]},{circle:[8.8,16.5,2.6]},{circle:[6.8,10.3,2.6]}]),people:y([{circle:[8,8.5,2.8]},{circle:[16,8.5,2.8]},"M3 19c.6-3 2.5-4.6 5-4.6s4.4 1.6 5 4.6","M11 19c.6-3 2.5-4.6 5-4.6s4.4 1.6 5 4.6"]),pair:y([{circle:[9,12,4.5]},{circle:[15,12,4.5]}]),upload:y(["M12 15.5V4.5","M7.5 9l4.5-4.5L16.5 9","M5 14v5.5h14V14"]),download:y(["M12 4.5v11","M7.5 11l4.5 4.5 4.5-4.5","M5 14v5.5h14V14"]),restore:y(["M4.5 12a7.5 7.5 0 1 0 2.2-5.3","M4.5 4.5v4h4"]),leaf:y(["M5 19c0-8 5-13 14-14-1 9-6 14-14 14z","M5 19l7-7"]),sprout:y(["M12 20v-8","M12 12c0-3.5-2.5-6-6.5-6 0 3.5 2.5 6 6.5 6z","M12 12c0-3.5 2.5-6 6.5-6 0 3.5-2.5 6-6.5 6z"]),search:y([{circle:[10.5,10.5,6]},"M15 15l5 5"]),jar:y(["M8 4.5h8v3H8z","M7 7.5h10l1 3v8a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-8z","M9 14h6"]),box:y(["M3.5 8l8.5-4 8.5 4v9l-8.5 4-8.5-4z","M3.5 8l8.5 4 8.5-4","M12 12v9"]),house:y(["M4 11l8-6.5 8 6.5","M6.5 9.5V19h11V9.5","M10.5 19v-4.5h3V19"]),pencil:y(["M15.5 4.5l4 4L9 19H5v-4z","M13.5 6.5l4 4"]),swap:y(["M5 9h12l-3-3","M19 15H7l3 3"]),minus:y(["M6 12h12"]),plus:y(["M6 12h12","M12 6v12"]),grip:y([{circle:[9,7,1.2],fill:!0},{circle:[15,7,1.2],fill:!0},{circle:[9,12,1.2],fill:!0},{circle:[15,12,1.2],fill:!0},{circle:[9,17,1.2],fill:!0},{circle:[15,17,1.2],fill:!0}]),menu:y(["M5 8h14","M5 12h14","M5 16h14"]),filter:y(["M4 5.5h16l-6 7.5v5.5l-4 1.5v-7z"]),heart:y(["M12 19s-7-4.4-7-9.5A4 4 0 0 1 12 7a4 4 0 0 1 7 2.5C19 14.6 12 19 12 19z"]),sparkle:y(["M12 4l1.8 5.2L19 11l-5.2 1.8L12 18l-1.8-5.2L5 11l5.2-1.8z"]),zoom:y([{circle:[10.5,10.5,6]},"M15 15l5 5","M10.5 8v5","M8 10.5h5"]),arrows:y(["M4 12h16","M7.5 8.5L4 12l3.5 3.5","M16.5 8.5L20 12l-3.5 3.5"]),updown:y(["M12 4v16","M8.5 7.5L12 4l3.5 3.5","M8.5 16.5L12 20l3.5-3.5"]),archive:y(["M3.5 5h17v4h-17z","M5 9v10h14V9","M10 13h4"]),berry:y([{circle:[9,13,3.6]},{circle:[15,13,3.6]},{circle:[12,17.5,3.6]},"M12 9.5V5","M12 6.5c1.5-1.8 3.5-2 5-1.5"]),log:y([{circle:[7.5,12,3.8]},"M7.5 8.2h11a3.8 3.8 0 0 1 0 7.6h-11",{circle:[7.5,12,1.3]}]),hourglass:y(["M7 4h10","M7 20h10","M8 4c0 5 8 5 8 8s-8 3-8 8","M16 4c0 5-8 5-8 8s8 3 8 8"]),up:y(["M6 15l6-6 6 6"]),down:y(["M6 9l6 6 6-6"]),addImage:y(["M6 3.5h8l4 4v13H6z","M14 3.5v4h4","M9 16l2.5-3 2 2 1-1.2",{circle:[17.5,17.5,3.5]},"M17.5 16v3","M16 17.5h3"]),acorn:y(["M6 10.5h12a6 6 0 0 1-12 0z","M5.5 10.5c0-3 3-4.5 6.5-4.5s6.5 1.5 6.5 4.5z","M12 6V3.5"]),pinecone:y(["M12 3.5c3.5 3 5 6.5 5 10a5 5 0 0 1-10 0c0-3.5 1.5-7 5-10z","M8 11h8","M7.5 15h9","M10 7.5h4"]),feather:y(["M19 4.5C11 5 6 10 5.5 19.5","M19 4.5c.5 7-4 12-11 12.5","M9 14l4-4"]),pumpkin:y(["M12 7.5c-4.5 0-7 2.8-7 6s2.5 6 7 6 7-2.8 7-6-2.5-6-7-6z","M12 7.5v12","M12 7.5c0-2 1-3.5 2.5-4"]),candle:y(["M9 9.5h6v10.5H9z","M12 9.5V7","M12 3.5c1.3 1.3 1.3 2.7 0 3.5-1.3-.8-1.3-2.2 0-3.5z"]),cup:y(["M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5z","M16 10.5h1.5a2.5 2.5 0 0 1 0 5H16","M9 4.5c0 1.5 1 1.5 1 3","M12.5 4.5c0 1.5 1 1.5 1 3"]),cake:y(["M5 12h14v8H5z","M5 15.5c2.3 1.4 4.7 1.4 7 0s4.7-1.4 7 0","M12 12V8.5",{circle:[12,6.5,1.4]}]),scarf:y(["M6 5h12v5H6z","M13 10v9l3-1V10","M8 7.5h1M11 7.5h1M14 7.5h1"]),wheat:y(["M12 20.5V7","M12 7c-2 0-3-1.5-3-3.5 2 0 3 1.5 3 3.5zM12 7c2 0 3-1.5 3-3.5-2 0-3 1.5-3 3.5z","M12 12c-2 0-3-1.5-3-3.5 2 0 3 1.5 3 3.5zM12 12c2 0 3-1.5 3-3.5-2 0-3 1.5-3 3.5z","M12 17c-2 0-3-1.5-3-3.5 2 0 3 1.5 3 3.5zM12 17c2 0 3-1.5 3-3.5-2 0-3 1.5-3 3.5z"]),clover:y([{circle:[9.5,9.5,2.8]},{circle:[14.5,9.5,2.8]},{circle:[9.5,14.5,2.8]},{circle:[14.5,14.5,2.8]},"M14 17l3.5 4"]),spool:y(["M7 4.5h10","M7 19.5h10","M9 4.5v15","M15 4.5v15","M9 8l6 3M9 12l6 3"]),mushroom:y(["M4.5 12a7.5 7.5 0 0 1 15 0z","M10 12v6.5a2 2 0 0 0 4 0V12"])};function D(e,a,r,n=""){return t("div",{className:"sheet-backdrop"},[t("section",{className:`sheet card ${n}`.trim(),attrs:{role:"dialog","aria-modal":"true","aria-labelledby":e}},[t("h2",{className:"section-title",text:a,attrs:{id:e}}),...r])])}function se(e,a,r,n,i={}){let o=Math.min(n,Math.max(r,a)),s=t("output",{className:"step-value big",text:String(o),attrs:{id:e,"aria-live":"polite",...i.label?{"aria-label":i.label}:{}}}),l=d=>t("button",{className:"step",text:d>0?`+${d}`:String(d),attrs:{type:"button","aria-label":`${i.label??""} ${d>0?"\uB298\uB9AC\uAE30":"\uC904\uC774\uAE30"} ${Math.abs(d)}`.trim()},on:{click:()=>{o=Math.min(n,Math.max(r,o+d)),s.textContent=String(o),i.onChange?.(o)}}}),m=i.small?[l(-1),s,l(1)]:[l(-10),l(-1),s,l(1),l(10)];return{node:t("div",{className:`stepper wide${i.small?" compact":""}`},m),read:()=>o}}var rr={"wild-berry":c.berry,herb:c.leaf,wood:c.log,pinecone:c.pinecone,acorn:c.acorn,wheat:c.wheat,flower:c.flower,pumpkin:c.pumpkin,cotton:c.weather,"tea-leaf":c.sprout,honey:c.jar,mushroom:c.mushroom,beeswax:c.box,feather:c.feather,clover:c.clover,"berry-jam":c.jar,"dried-herb":c.leaf,flour:c.box,plank:c.log,thread:c.spool,"herb-tea":c.cup,"pumpkin-puree":c.pumpkin,"acorn-flour":c.acorn,"herb-sachet":c.heart,"berry-pie":c.cake,"wooden-tray":c.log,"beeswax-candle":c.candle,"knit-scarf":c.scarf,"flower-wreath":c.flower,"pumpkin-soup":c.cup,"honey-cake":c.cake,birdhouse:c.house,"acorn-cookie":c.acorn,"tea-gift":c.clover},J={gather:"\uCC44\uC9D1",grow:"\uC7AC\uBC30",survey:"\uC870\uC0AC",process:"\uAC00\uACF5",craft:"\uC81C\uC791"},pe={gather:c.leaf,grow:c.sprout,survey:c.search,process:c.jar,craft:c.hammer};function O(e,a){return e?.items.find(r=>r.id===a)?.name??a}function nr(e,a="icon"){return(rr[e]??c.box)(a)}function j(e,a="small"){return t("span",{className:`item-tile ${a} item-${e}`,attrs:{"aria-hidden":"true"}},[ie(Nt(e),{className:"item-art",lazy:!0,fallback:()=>nr(e,"icon")})])}function ge(e,a="big"){return ie(kt[e]??null,{className:`facility-image ${a}`,fallback:()=>c.house(`icon ${a}`)})}function ee(e,a){return e?.recipes.find(r=>r.id===a)??null}function Y(e,a){return e?.facilities.find(r=>r.id===a)??null}function be(e){let a=Math.max(0,Math.ceil(e/1e3)),r=Math.floor(a/3600),n=Math.floor(a%3600/60),i=a%60,o=s=>String(s).padStart(2,"0");return r?`${r}:${o(n)}:${o(i)}`:`${o(n)}:${o(i)}`}function he(e){let a=e/36e5;return a>=10||Number.isInteger(a)?`${Math.floor(a)}`:a.toFixed(1)}function Ot(e,a,r,n=0){return Math.max(6e4,Math.round(a.minutes*6e4/(1+e.production.speedBonusPerLevel*(r-1)+n)))}function te(e,a){let r=Math.min(e.crew.maxBreakthrough,Math.max(0,a));return Math.round((e.crew.passiveBase+e.crew.passivePerBreakthrough*r)*1e3)/1e3}function ae(e,a,r){let n=new Set(Object.values(a.production.facilities).map(u=>u.residentId).filter(u=>u!==null)),i=Object.values(a.pairs).filter(u=>!u.archived&&u.residentIds.every(h=>n.has(h))).length,o=Math.min(e.crew.setBonusMax,Math.round(e.crew.setBonusPerPair*i*1e3)/1e3),s=a.production.facilities[r]?.residentId??null,l=s?a.residents[s]:void 0,m=l!==void 0&&l.field===Y(e,r)?.field,d=m?te(e,l.breakthrough):0,p=m?re(e,l.talentId)??null:null;return{resident:l??null,matches:m,passive:d,set:o,talent:p,total:Math.round((d+o)*1e3)/1e3}}function re(e,a){return e?.talents.find(r=>r.id===a)}function Re(e,a){let r={...e.inputs},n=a.total,i=a.talent?.effect,o=!1;return i&&i.recipeId===e.id&&(o=!0,i.kind==="speed"?n+=i.bonus:r[i.itemId]!==void 0&&(r[i.itemId]=Math.max(1,r[i.itemId]-i.amount))),{extraBonus:Math.round(n*1e3)/1e3,inputs:r,talentApplies:o}}function V(e){return`${Math.round(e*1e3)/10}%`}function Vt(e,a,r){let n=Y(e,r)?.unlock;if(!n)return[];let i=[];if(n.facilityLevel){let o=a.production.facilities[n.facilityLevel.facilityId],s=o?.unlocked?o.level:0,l=n.facilityLevel.level,m=Y(e,n.facilityLevel.facilityId)?.name??"";i.push({text:`${m} Lv. ${l} \uC774\uC0C1`,have:s,need:l,met:s>=l})}if(n.made){let o=a.production.made[n.made.itemId]??0,s=n.made.amount;i.push({text:`${O(e,n.made.itemId)} ${s}\uAC1C \uB9CC\uB4E4\uAE30`,have:o,need:s,met:o>=s})}return i}function Bt(e,a){return e.production.queueSlotLevels.filter(r=>a>=r).length}function we(e,a){return Math.round((e?.production.speedBonusPerLevel??0)*(a-1)*100)}function ir(e,a,r){return e.worldReceivedAt+(r.endsSim-a.state.production.simMs)}function ve(e,a,r){let n=ir(e,a,r),i=r.endsSim-r.startedSim,o=t("span",{className:"bar-fill",attrs:{"data-progress-end":String(n),"data-progress-total":String(i)}}),s=Math.max(0,n-Date.now());return o.style.width=`${Math.round((i-s)/Math.max(1,i)*100)}%`,{bar:t("span",{className:"bar teal"},[o]),countdown:t("span",{className:"countdown",text:be(s),attrs:{"data-countdown-end":String(n)}})}}function Ft(e,a){if(!a)return"";if(a.reason==="no_rules")return"\uCF1C \uB454 \uC6B4\uC601 \uADDC\uCE59\uC774 \uC5C6\uC5B4 \uC26C\uACE0 \uC788\uC5B4\uC694.";if(a.reason==="target_reached")return"\uBAA8\uB4E0 \uBAA9\uD45C \uC7AC\uACE0\uB97C \uCC44\uC6CC \uC26C\uACE0 \uC788\uC5B4\uC694. \uC7AC\uACE0\uAC00 \uC904\uBA74 \uB2E4\uC2DC \uC2DC\uC791\uD574\uC694.";if(a.reason==="queue_empty")return"\uC9C0\uC815 \uD69F\uC218 \uB300\uAE30\uC5F4\uC774 \uBE44\uC5B4 \uC26C\uACE0 \uC788\uC5B4\uC694.";if(a.reason==="locked")return"\uC544\uC9C1 \uC5F4\uB9AC\uC9C0 \uC54A\uC740 \uC2DC\uC124\uC774\uC5D0\uC694.";let r=O(e,a.itemId??""),n=a.protectedAmount?` (\uBCF4\uD638 ${a.protectedAmount}\uAC1C\uB294 \uC4F0\uC9C0 \uC54A\uC544\uC694)`:"";return`${r}\uC774(\uAC00) \uBD80\uC871\uD574 \uAE30\uB2E4\uB9AC\uB294 \uC911: \uD55C \uBC88\uC5D0 ${a.needed??"?"}\uAC1C \uD544\uC694, \uC4F8 \uC218 \uC788\uB294 \uC591 ${a.usable??0}\uAC1C${n}.`}function or(e,a,r,n,i){let o=e.content,s=d=>Math.max(0,(a.state.inventory[d]??0)-(a.state.production.protectedStock[d]??0)),l=Object.entries(r.items).every(([d,p])=>s(d)>=p),m=!!e.busy[`deliver:${r.id}`];return t("li",{className:`order${n?" done":""}`},[t("strong",{className:"order-title",text:r.title}),t("ul",{className:"order-items"},Object.entries(r.items).map(([d,p])=>t("li",{className:s(d)>=p?"enough":"short"},[j(d),t("span",{text:`${O(o,d)} ${p}`}),t("small",{className:"muted",text:`\uC4F8 \uC218 \uC788\uB294 \uC591 ${s(d)}`})]))),t("p",{className:"order-reward"},[c.ticket("icon tiny"),` \uCD08\uB300\uAD8C ${r.reward.tickets}\uC7A5 \xB7 ${r.reward.gold} G`]),n?t("span",{className:"status-pill done",text:"\uB0A9\uD488 \uC644\uB8CC"}):w(m?"\uB0A9\uD488\uD558\uB294 \uC911\u2026":l?"\uB0A9\uD488\uD558\uAE30":"\uC7AC\uB8CC\uAC00 \uBD80\uC871\uD574\uC694",()=>{i.deliver(r.id)},{disabled:m||!l,variant:l?void 0:"secondary"})])}function Dt(e,a){let r=e.world?.state==="ready"?e.world.value:null,n=e.deliveries,i=!r||!n||n.state==="loading"?[I("\uC624\uB298\uC758 \uB0A9\uD488 \uC758\uB8B0\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026")]:n.state==="error"?[_(n.message)]:[t("p",{className:"muted",text:"\uC758\uB8B0\uB294 \uD558\uB8E8(UTC \uAE30\uC900)\uB9C8\uB2E4 \uBC14\uB00C\uC5B4\uC694. \uC9C0\uB09C \uB0A0\uC758 \uC758\uB8B0\uB294 \uBAA8\uC544 \uB450\uC9C0 \uC54A\uC544\uC694. \uBCF4\uD638\uD55C \uC7AC\uACE0\uB294 \uB0A9\uD488\uD558\uC9C0 \uC54A\uC544\uC694."}),t("ul",{className:"order-list"},n.value.orders.map(o=>or(e,r,o,n.value.done.includes(o.id),a)))];return D("fw-deliveries","\uCD08\uB300\uAD8C \uBC1B\uAE30 \xB7 \uC624\uB298\uC758 \uB0A9\uD488",[...i,w("\uB2EB\uAE30",()=>a.closeSheet(),{variant:"secondary",attrs:{"data-wide":""}})])}function Qe(e){return t("span",{className:"lock-tag",attrs:{"aria-hidden":"true"}},[c.lock("icon tiny"),"\uC900\uBE44 \uC911"])}function H(e,a,r){let n=Ne(a)||!r.onOpen;return t("button",{className:`${r.className}${n?" is-locked":""}`,attrs:{type:"button","aria-label":n?`${r.label} (\uC900\uBE44 \uC911)`:r.label},on:{click:()=>n?e.notifyLocked(a):r.onOpen?.()}},[...r.children,n?Qe(a):null])}var sr=[{label:"\uD648",icon:c.home,routes:["home","settings","backup","diagnostics"]},{label:"\uC791\uC5C5",icon:c.hammer,routes:["work","facilities"]},{label:"\uD0D0\uC0AC",icon:c.compass,routes:["explore","story"]},{label:"\uC8FC\uBBFC",icon:c.residents,routes:["residents","relations","resident-image"]},{label:"\uCD08\uB300",icon:c.ticket,routes:["invite"]}];function qt(e,a){return t("nav",{className:"tabbar",attrs:{"aria-label":"\uACF5\uBC29 \uBA54\uB274"}},sr.map(r=>{let n=r.feature?Ne(r.feature):!1,i=r.routes.includes(e.route);return t("button",{className:`tab${i?" current":""}${n?" is-locked":""}`,attrs:{type:"button","aria-current":i?"page":void 0,"aria-label":n?`${r.label} (\uC900\uBE44 \uC911)`:r.label},on:{click:()=>{n&&r.feature?a.notifyLocked(r.feature):r.routes[0]==="residents"?a.openResidents():r.routes[0]&&a.navigate(r.routes[0])}}},[t("span",{className:"tab-icon"},[r.icon("icon tab-glyph"),n&&r.feature?Qe(r.feature):null]),t("span",{className:"tab-label",text:r.label})])}))}function lr(e){if(!document.fullscreenEnabled)return null;let a=t("button",{className:"fullscreen-toggle",text:document.fullscreenElement?"\uC804\uCCB4 \uD654\uBA74 \uC885\uB8CC":"\uC804\uCCB4 \uD654\uBA74",attrs:{type:"button"},on:{click:()=>{let r=a.getRootNode(),n=r instanceof ShadowRoot?r.host:a.closest(".shell");if(!n)return;(document.fullscreenElement?document.exitFullscreen():n.requestFullscreen()).then(()=>{a.textContent=document.fullscreenElement?"\uC804\uCCB4 \uD654\uBA74 \uC885\uB8CC":"\uC804\uCCB4 \uD654\uBA74"}).catch(()=>e.notify("\uC774 \uD658\uACBD\uC5D0\uC11C\uB294 \uC804\uCCB4 \uD654\uBA74\uC744 \uC5F4 \uC218 \uC5C6\uC5B4\uC694."))}}});return a}function dr(e,a){let n=(e.world?.state==="ready"?e.world.value:null)?.state.wallet.tickets??0;return t("button",{className:"counter ticket",attrs:{type:"button","aria-label":`\uCD08\uB300\uAD8C ${n}\uC7A5 \u2014 \uCD08\uB300\uAD8C \uBC1B\uAE30`},on:{click:()=>a.openDeliveries()}},[t("span",{className:"ticket-mark"},[c.ticket("icon")]),t("span",{className:"counter-value",text:String(n)})])}function Gt(e,a){let r=e.world?.state==="ready"?e.world.value:null;if(!r)return null;let n=r.state.wallet.gold.toLocaleString("ko-KR");return t("div",{className:"resources"},[t("span",{className:"counter gold",attrs:{"aria-label":`\uACE8\uB4DC ${n}`}},[t("span",{className:"coin",attrs:{"aria-hidden":"true"}}),t("span",{className:"counter-value",text:n})]),dr(e,a),e.route==="settings"?null:t("button",{className:"icon-button gear",attrs:{type:"button","aria-label":"\uC124\uC815"},on:{click:()=>a.navigate("settings")}},[c.gear()])])}function _t(e,a,r){if(r.kind==="home")return t("header",{className:"top top-home"},[t("div",{className:"top-row"},[t("h1",{className:"sign sign-home",text:"\uC232\uACB0 \uACF5\uBC29",attrs:{id:"fw-screen-title"}}),Gt(e,a)]),t("div",{className:"top-row second"},[H(a,"weather",{className:"chip-button weather",label:"\uD604\uC2E4 \uB0A0\uC528",children:[c.weather(),t("span",{text:"\uB0A0\uC528"})]}),lr(a),H(a,"mail",{className:"icon-button mail",label:"\uC6B0\uD3B8\uD568",children:[c.mail()]})])]);let n=r.back;return t("header",{className:`top top-sub${r.resources||r.counters?" with-resources":""}`},[t("div",{className:"top-row"},[n?t("button",{className:"back-button",attrs:{type:"button","aria-label":`${n.label}(\uC73C)\uB85C \uB3CC\uC544\uAC00\uAE30`},on:{click:()=>a.navigate(n.route)}},[c.back()]):t("span",{className:"back-spacer",attrs:{"aria-hidden":"true"}}),t("h1",{className:"sign",text:r.title,attrs:{id:"fw-screen-title"}}),r.resources?Gt(e,a):r.counters??null]),r.subtitle?t("p",{className:"ribbon",text:r.subtitle}):null])}function cr(e,a){return e.notice?t("div",{className:`notice ${e.notice.kind}`,attrs:{role:e.notice.kind==="error"?"alert":"status"}},[t("p",{text:e.notice.text}),t("button",{className:"notice-close",text:"\uB2EB\uAE30",attrs:{type:"button","aria-label":"\uC54C\uB9BC \uB2EB\uAE30"},on:{click:()=>a.dismissNotice()}})]):null}function R(e,a,r){return t("div",{className:`shell backdrop-${r.backdrop} season-${oe(e)}${Wt(e)}${r.nav?" has-nav":""}${r.homeLayout?" home-layout":""}${r.storyLayout?" story-layout":""}${e.notice?" has-notice":""}`},[t("div",{className:"scroll"},[t("div",{className:"column"},[_t(e,a,r.top),r.hero??null,t("main",{className:"page",attrs:{"aria-labelledby":"fw-screen-title"}},r.body)])]),cr(e,a),r.nav?qt(e,a):null,r.sheet??(e.sheet?.kind==="deliveries"?Dt(e,a):null)])}function S(e,a,r={}){return t("section",{className:`card ${r.className??""}`.trim(),attrs:r.id?{"aria-labelledby":r.id}:{}},[e?t("h2",{className:"section-title",text:e,attrs:r.id?{id:r.id}:{}}):null,...a])}var Me="/forest-workshop/p0",mr={pass:"\uD1B5\uACFC",fail:"\uC2E4\uD328",unavailable:"\uC0AC\uC6A9 \uBD88\uAC00"};function N(e,a={},r=[]){let n=document.createElement(e);a.className&&(n.className=a.className),a.text!==void 0&&(n.textContent=a.text);for(let[i,o]of Object.entries(a.attrs??{}))n.setAttribute(i,o);for(let i of r)i&&n.append(i);return n}var Ae=class{constructor(){P(this,"node",N("div",{className:"diagnostics"}));P(this,"started",!1);P(this,"status",{state:"loading"});P(this,"probe",null);P(this,"image",{state:"loading"});P(this,"uploading",!1);P(this,"uploadError",null);P(this,"pendingUpload",null)}start(){this.started||(this.started=!0,this.render(),this.loadStatus(),this.loadImage())}async loadStatus(){this.status={state:"loading"},this.render();try{this.status={state:"ready",value:await z().get(`${Me}/status`)}}catch(a){this.status={state:"error",message:W(a,"\uD328\uD0A4\uC9C0 \uC0C1\uD0DC\uB97C \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.")}}this.render()}async loadImage(){this.image={state:"loading"},this.render();try{let a=await z().get(`${Me}/image`);this.image={state:"ready",value:a.current}}catch(a){this.image={state:"error",message:W(a,"\uC800\uC7A5\uB41C \uADF8\uB9BC\uC744 \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.")}}this.render()}async runProbe(){if(this.probe?.state!=="loading"){this.probe={state:"loading"},this.render();try{let a=await z().post(`${Me}/probe`);this.probe={state:"ready",value:a.checks}}catch(a){this.probe={state:"error",message:W(a,"\uC5F0\uACB0 \uC810\uAC80\uC744 \uC2E4\uD589\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.")}}this.render()}}async upload(a){if(this.uploading)return;let r=this.pendingUpload?.file===a?this.pendingUpload:{file:a,key:ke()};this.pendingUpload=r,this.uploading=!0,this.uploadError=null,this.render();try{let n=new FormData;n.append("uploadKey",r.key),n.append("file",a,a.name);let i=await z().upload(`${Me}/image`,n);this.image={state:"ready",value:i.image},this.pendingUpload=null}catch(n){this.uploadError=W(n,"\uADF8\uB9BC\uC744 \uC62C\uB9AC\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4. \uAE30\uC874 \uADF8\uB9BC\uC740 \uADF8\uB300\uB85C\uC785\uB2C8\uB2E4.")}finally{this.uploading=!1,this.render()}}render(){this.node.replaceChildren(N("p",{className:"muted",text:"\uC5D4\uC9C4 \uC5F0\uACB0\uACFC \uC8FC\uBBFC \uADF8\uB9BC \uC800\uC7A5 \uACBD\uB85C\uB97C \uD655\uC778\uD569\uB2C8\uB2E4. \uACB0\uACFC\uB294 \uC138\uACC4\uC5D0 \uC601\uD5A5\uC744 \uC8FC\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4."}),this.renderStatus(),this.renderProbe(),this.renderImage())}retryButton(a,r){let n=N("button",{className:"button secondary",text:a,attrs:{type:"button"}});return n.addEventListener("click",r),n}renderStatus(){let a=N("section",{className:"card",attrs:{"aria-labelledby":"fw-status"}},[N("h2",{text:"\uC5D4\uC9C4 \uC5F0\uACB0",attrs:{id:"fw-status"}})]);if(this.status.state==="loading")a.append(N("p",{className:"muted",text:"\uBD88\uB7EC\uC624\uB294 \uC911\u2026",attrs:{role:"status"}}));else if(this.status.state==="error")a.append(N("p",{className:"error",text:this.status.message,attrs:{role:"alert"}}),this.retryButton("\uB2E4\uC2DC \uC2DC\uB3C4",()=>{this.loadStatus()}));else{let{value:r}=this.status;a.append(N("p",{className:"muted",text:`\uD328\uD0A4\uC9C0 ${r.version} \xB7 \uB2E8\uACC4 ${r.stage}`}),N("ul",{className:"list"},r.host.map(n=>N("li",{className:"row"},[N("span",{className:"name",text:n.name}),N("span",{className:`badge ${n.available?"pass":n.required?"fail":"unavailable"}`,text:n.available?"\uC788\uC74C":n.required?"\uC5C6\uC74C (\uD544\uC218)":"\uC5C6\uC74C"})]))))}return a}renderProbe(){let a=N("button",{className:"button",text:this.probe?.state==="loading"?"\uC810\uAC80 \uC911\u2026":"\uC5F0\uACB0 \uC810\uAC80 \uC2E4\uD589",attrs:{type:"button"}});a.disabled=this.probe?.state==="loading",a.addEventListener("click",()=>{this.runProbe()});let r=N("section",{className:"card",attrs:{"aria-labelledby":"fw-probe"}},[N("h2",{text:"\uC800\uC7A5\xB7\uC790\uB8CC\xB7\uBAA8\uB378 \uC810\uAC80",attrs:{id:"fw-probe"}}),N("p",{className:"muted",text:"\uC784\uC2DC \uBB38\uC11C\uB97C \uC4F0\uACE0 \uC9C0\uC6C1\uB2C8\uB2E4. \uCE90\uB9AD\uD130\xB7\uD398\uB974\uC18C\uB098 \uC6D0\uBCF8\uC740 \uC77D\uAE30\uB9CC \uD558\uBA70, \uBAA8\uB378 \uC0DD\uC131 \uC694\uCCAD\uC740 \uBCF4\uB0B4\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4."}),a]);return!this.probe||this.probe.state==="loading"?r:this.probe.state==="error"?(r.append(N("p",{className:"error",text:this.probe.message,attrs:{role:"alert"}})),r):(r.append(N("ul",{className:"list",attrs:{"aria-live":"polite"}},this.probe.value.map(n=>N("li",{className:"row stacked"},[N("div",{className:"row-head"},[N("span",{className:"name",text:n.label}),N("span",{className:`badge ${n.status}`,text:mr[n.status]})]),N("span",{className:"detail",text:n.detail})])))),r)}renderImage(){let a=N("input",{className:"file",attrs:{type:"file",accept:"image/png,image/webp",id:"fw-file"}});a.disabled=this.uploading,a.addEventListener("change",()=>{let n=a.files?.[0];n&&this.upload(n)});let r=N("section",{className:"card",attrs:{"aria-labelledby":"fw-image"}},[N("h2",{text:"\uC8FC\uBBFC \uADF8\uB9BC \uC800\uC7A5 \uC810\uAC80",attrs:{id:"fw-image"}}),N("p",{className:"muted",text:"PNG \uB610\uB294 \uC815\uC801 WebP(\uCD5C\uB300 20MiB, 4096\xD74096)\uB97C \uACE0\uB974\uBA74 \uD22C\uBA85\uB3C4\uB97C \uC720\uC9C0\uD55C WebP \uD488\uC9C895\uB85C \uBC14\uAFD4 \uC804\uC5ED \uAC24\uB7EC\uB9AC\uC5D0 \uC800\uC7A5\uD569\uB2C8\uB2E4. PNG \uC6D0\uBCF8\uC740 \uBCF4\uAD00\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4."}),N("label",{className:"field-label",text:"\uADF8\uB9BC \uD30C\uC77C \uACE0\uB974\uAE30",attrs:{for:"fw-file"}}),a]);if(this.uploading&&r.append(N("p",{className:"muted",text:"\uBCC0\uD658\uD558\uACE0 \uC800\uC7A5\uD558\uB294 \uC911\u2026",attrs:{role:"status"}})),this.uploadError){r.append(N("p",{className:"error",text:this.uploadError,attrs:{role:"alert"}}));let n=this.pendingUpload;n&&!this.uploading&&r.append(this.retryButton("\uAC19\uC740 \uD30C\uC77C\uB85C \uB2E4\uC2DC \uC2DC\uB3C4",()=>{this.upload(n.file)}))}if(this.image.state==="loading")r.append(N("p",{className:"muted",text:"\uBD88\uB7EC\uC624\uB294 \uC911\u2026",attrs:{role:"status"}}));else if(this.image.state==="error")r.append(N("p",{className:"error",text:this.image.message,attrs:{role:"alert"}}),this.retryButton("\uB2E4\uC2DC \uBD88\uB7EC\uC624\uAE30",()=>{this.loadImage()}));else if(!this.image.value)r.append(N("p",{className:"empty",text:"\uC544\uC9C1 \uC800\uC7A5\uB41C \uADF8\uB9BC\uC774 \uC5C6\uC2B5\uB2C8\uB2E4."}));else{let n=this.image.value,i=N("img",{className:"preview",attrs:{src:`${n.url}${n.url.includes("?")?"&":"?"}v=${n.imageVersion}`,alt:"\uC800\uC7A5\uB41C \uC8FC\uBBFC \uADF8\uB9BC \uBBF8\uB9AC\uBCF4\uAE30",width:String(n.width),height:String(n.height)}});r.append(N("div",{className:"stage"},[i]),N("dl",{className:"facts"},[N("dt",{text:"\uCC38\uC870"}),N("dd",{text:n.reference}),N("dt",{text:"\uD06C\uAE30"}),N("dd",{text:`${n.width}\xD7${n.height}`}),N("dt",{text:"\uC6A9\uB7C9"}),N("dd",{text:`\uC785\uB825 ${Ue(n.inputBytes)} \u2192 WebP ${Ue(n.outputBytes)}`}),N("dt",{text:"\uD22C\uBA85\uB3C4"}),N("dd",{text:n.hasTransparency?"\uD22C\uBA85 \uC601\uC5ED \uC788\uC74C (\uC720\uC9C0\uB428)":"\uBD88\uD22C\uBA85 \uADF8\uB9BC"}),N("dt",{text:"\uBC84\uC804"}),N("dd",{text:String(n.imageVersion)})]))}return r}};var pr="http://www.w3.org/2000/svg";function Ht(e){let a=document.createElementNS(pr,"svg");return a.setAttribute("viewBox","0 0 60 80"),a.setAttribute("aria-hidden","true"),a.setAttribute("class",e),a.innerHTML='<circle cx="30" cy="24" r="15"/><path d="M6 80c0-17 11-29 24-29s24 12 24 29z"/>',a}function Ut(e,a){let r=e.image.current;return t("img",{className:a,attrs:{src:`${r.url}${r.url.includes("?")?"&":"?"}v=${encodeURIComponent(r.reference)}`,alt:"",width:String(r.width),height:String(r.height),decoding:"async",draggable:"false"}})}function U(e,a={}){let r=a.placement??e.image.placement,n=t("span",{className:"figure",attrs:{"aria-hidden":"true"}});if(!e.image.current)return n.append(t("span",{className:"figure-empty"},[Ht("figure-silhouette"),t("span",{className:"figure-empty-text",text:"PNG \uB4F1\uB85D"})])),n;let i=t("span",{className:"figure-body"},[Ut(e,"figure-image")]);if(i.style.height=`${r.scale*.9}%`,i.style.left=`${50+r.offsetX*.5}%`,n.append(i),a.marker){let o=t("span",{className:"figure-marker"},[c.leaf("icon tiny")]);o.style.bottom=`calc(${r.scale*.9}% + ${r.markerHeight*.4}%)`,o.style.left=`${50+r.offsetX*.5}%`,n.append(o)}return n}function E(e,a="small"){let r=t("span",{className:`avatar ${a}`,attrs:{"aria-hidden":"true"}});return e?.image.current?r.append(Ut(e,"avatar-image")):(r.append(Ht("avatar-silhouette")),e||r.append(t("span",{className:"avatar-unknown",text:"?"}))),r}var ye={character:"\uCE90\uB9AD\uD130",persona:"\uD398\uB974\uC18C\uB098"};function G(e){return t("span",{className:`tag ${e.kind}`,text:ye[e.kind]})}var ur="http://www.w3.org/2000/svg";function fr(){let e=document.createElementNS(ur,"svg");return e.setAttribute("viewBox","0 0 390 300"),e.setAttribute("preserveAspectRatio","xMidYMax slice"),e.setAttribute("aria-hidden","true"),e.setAttribute("class","scene-art"),e.innerHTML=`
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
    </g>`,e}function gr(e){let a=e.progress.starterResidentId;return Object.values(e.residents).filter(r=>r.recruited).sort((r,n)=>+(n.residentId===a)-+(r.residentId===a)||r.registeredAt.localeCompare(n.registeredAt)).slice(0,2)}function Kt(e,a,r,n){if(a)return t("button",{className:`resident-spot filled ${e}`,attrs:{type:"button","aria-label":`${a.displayName} \uD504\uB85C\uD544 \uBCF4\uAE30`},on:{click:()=>{n.openResidents(a.residentId),n.openSheet({kind:"profile",residentId:a.residentId})}}},[U(a),t("span",{className:"spot-name",text:a.displayName})]);if(r.progress.starterResidentId===null&&e==="left"){let i=Object.keys(r.residents).length>0;return t("button",{className:`resident-spot invite ${e}`,attrs:{type:"button"},on:{click:()=>n.openRegister(i?3:1)}},[t("span",{className:"spot-shadow"}),t("span",{className:"spot-text",text:i?"\uC2DC\uC791 \uC8FC\uBBFC \uACE0\uB974\uAE30":"\uC8FC\uBBFC \uB9DE\uC774\uD558\uAE30"})])}return t("button",{className:`resident-spot ${e}`,attrs:{type:"button","aria-label":"\uBE48 \uC790\uB9AC \u2014 \uCD08\uB300\uB85C \uC0C8 \uC8FC\uBBFC \uB9DE\uC774\uD558\uAE30"},on:{click:()=>n.navigate("invite")}},[t("span",{className:"spot-shadow"}),t("span",{className:"spot-text",text:"\uCD08\uB300"})])}function Qt(e,a){let r=e.world?.state==="ready"?e.world.value.state:null,n=r?gr(r):[];return t("section",{className:"scene",attrs:{"aria-label":"\uACF5\uBC29 \uC7A5\uBA74"}},[ie(de[oe(e)].scene,{className:"scene-art",fallback:fr}),r?t("div",{className:"scene-stage"},[Kt("left",n[0]??null,r,a),Kt("right",n[1]??null,r,a)]):null,n.length===0?t("p",{className:"scene-caption"},[c.leaf("icon tiny"),"\uC8FC\uBBFC\uC744 \uB9DE\uC774\uD558\uBA74 \uC774\uACF3\uC5D0 \uBAA8\uC5EC\uC694"]):null])}function br(e,a){return e.items.find(r=>r.id===a)?.name??a}function Yt(e,a){let r=e.world?.state==="ready"?e.world.value:null,n=e.content;if(!r||!n||r.state.progress.starterKitClaimed||e.starterSheetHidden)return null;let i=!!e.busy["claim-starter-kit"],o=n.starterKit;return t("div",{className:"sheet-backdrop"},[t("section",{className:"sheet card",attrs:{role:"dialog","aria-modal":"true","aria-labelledby":"fw-starter"}},[t("h2",{className:"section-title",text:"\uACF5\uBC29 \uC2DC\uC791 \uAFB8\uB7EC\uBBF8",attrs:{id:"fw-starter"}}),t("p",{className:"muted",text:"\uCCAB \uCC44\uC9D1\uACFC \uAC00\uACF5\uC744 \uC2DC\uC791\uD560 \uC7AC\uB8CC\uC608\uC694. \uD55C \uBC88\uB9CC \uBC1B\uC744 \uC218 \uC788\uC5B4\uC694."}),t("ul",{className:"kit"},[t("li",{className:"kit-item"},[t("span",{className:"coin"}),t("span",{text:"\uACE8\uB4DC"}),t("strong",{text:o.gold.toLocaleString("ko-KR")})]),o.tickets?t("li",{className:"kit-item"},[c.ticket("icon"),t("span",{text:"\uCD08\uB300\uAD8C"}),t("strong",{text:`${o.tickets}\uC7A5`})]):null,...Object.entries(o.items).map(([s,l])=>t("li",{className:"kit-item"},[c.leaf("icon"),t("span",{text:br(n,s)}),t("strong",{text:l.toLocaleString("ko-KR")})]))]),w(i?"\uBC1B\uB294 \uC911\u2026":"\uBC1B\uAE30",()=>{a.runCommand("claim-starter-kit","onboarding.claimStarterKit")},{disabled:i,attrs:{"data-wide":""}}),w("\uB098\uC911\uC5D0",()=>a.hideStarterSheet(),{variant:"secondary",attrs:{"data-wide":""}})])])}function Xt(e){let a=e.state.production.reportsReadThrough;return e.state.production.reports.filter(r=>r.reportId>a)}function Ye(e,a){let r={};for(let n of e)for(let[i,o]of Object.entries(n[a]))r[i]=(r[i]??0)+o;return r}function Jt(e){let a=Object.values(e.state.production.facilities);return a.some(r=>r.waiting?.reason==="materials")?"\uC7AC\uB8CC\uB97C \uAE30\uB2E4\uB9AC\uB294 \uC2DC\uC124\uC774 \uC788\uC5B4\uC694":a.some(r=>r.job)?"\uACF5\uBC29\uC774 \uC798 \uB3CC\uC544\uAC00\uACE0 \uC788\uC5B4\uC694":"\uACF5\uBC29\uC774 \uC26C\uACE0 \uC788\uC5B4\uC694"}function Zt(e,a){let r=Xt(e).length;return t("button",{className:"home-summary work-summary",attrs:{type:"button","aria-label":`${Jt(e)} \xB7 ${r?`\uC0C8 \uBCF4\uACE0 ${r}\uAC1C`:"\uC0C8 \uBCF4\uACE0 \uC5C6\uC74C"} \xB7 \uC791\uC5C5 \uBCF4\uACE0 \uC5F4\uAE30`},on:{click:()=>a.openSheet({kind:"work-report"})}},[t("span",{className:"home-summary-copy"},[t("strong",{text:Jt(e)}),t("span",{text:r?`\uC0C8 \uC791\uC5C5 \uBCF4\uACE0 ${r}\uAC1C`:"\uC791\uC5C5 \uBCF4\uACE0 \uBCF4\uAE30"})]),c.chevron("icon")])}function ea(e,a,r){let n=e.state.production.activity.lastAbsence,i=a?.production.absenceLimitMs??72*36e5;return t("button",{className:"strip offline",attrs:{type:"button"},on:{click:()=>r.notify(n&&n.totalMs>n.creditedMs?`\uC9C0\uB09C\uBC88\uC5D4 ${he(n.totalMs)}\uC2DC\uAC04 \uBE44\uC6E0\uACE0, \uADF8\uC911 \uCD5C\uB300 72\uC2DC\uAC04\uB9CC \uACF5\uBC29\uC774 \uC77C\uD588\uC5B4\uC694. \uB0A8\uC740 \uC791\uC5C5\uC740 \uBA48\uCD98 \uC790\uB9AC\uC5D0\uC11C \uC774\uC5B4\uC838\uC694.`:"\uC790\uB9AC\uB97C \uBE44\uC6B4 \uB3D9\uC548\uC5D0\uB3C4 \uCD5C\uB300 72\uC2DC\uAC04\uAE4C\uC9C0 \uACF5\uBC29\uC774 \uC77C\uD574\uC694. \uADF8 \uB4A4\uC5D4 \uBA48\uCD98 \uC790\uB9AC\uC5D0\uC11C \uAE30\uB2E4\uB824\uC694.")}},[c.clock(),t("span",{},["\uBBF8\uC811\uC18D \uB204\uC801 ",t("strong",{text:`${n?he(n.creditedMs):"0"}\uC2DC\uAC04`}),` / \uCD5C\uB300 ${he(i)}\uC2DC\uAC04`]),c.info("icon muted-icon")])}function hr(e){let a=new Date(e);return Number.isNaN(a.getTime())?e:new Intl.DateTimeFormat("ko-KR",{month:"numeric",day:"numeric",hour:"2-digit",minute:"2-digit",hour12:!1}).format(a)}function ue(e,a,r){let n=Object.entries(a);return n.length?n.map(([i,o])=>`${O(e,i)} ${r}${o}`).join(" \xB7 "):"\uC5C6\uC74C"}function ta(e,a,r){let n=e.content,i=a.state.production.reports,o=Xt(a),s=!!e.busy["reports-read"];return t("div",{className:"sheet-backdrop"},[t("section",{className:"sheet card",attrs:{role:"dialog","aria-modal":"true","aria-labelledby":"fw-work-report"}},[t("h2",{className:"section-title",text:"\uC791\uC5C5 \uBCF4\uACE0",attrs:{id:"fw-work-report"}}),t("p",{className:"muted",text:"\uB9CC\uB4E0 \uBB3C\uAC74\uC740 \uB9CC\uB4E4\uC5B4\uC9C4 \uC21C\uAC04 \uCC3D\uACE0\uC5D0 \uB4E4\uC5B4\uAC14\uC5B4\uC694. \uBCF4\uACE0\uB97C \uC77D\uC5B4\uB3C4 \uB2E4\uC2DC \uC9C0\uAE09\uB418\uC9C0 \uC54A\uC544\uC694."}),o.length?t("div",{className:"report-total"},[t("p",{},[t("strong",{text:"\uC0C8\uB85C \uB4E4\uC5B4\uC628 \uAC83 "}),ue(n,Ye(o,"produced"),"+")]),t("p",{},[t("strong",{text:"\uC7AC\uB8CC\uB85C \uC4F4 \uAC83 "}),ue(n,Ye(o,"consumed"),"\u2212")]),o.some(l=>l.gold>0)?t("p",{},[t("strong",{text:"\uC790\uB3D9 \uD310\uB9E4 "}),`${ue(n,Ye(o,"sold"),"\u2212")} \u2192 +${o.reduce((l,m)=>l+m.gold,0)} G`]):null]):t("p",{className:"empty",text:"\uC0C8 \uBCF4\uACE0\uAC00 \uC5C6\uC5B4\uC694."}),i.length?t("ol",{className:"report-list"},i.slice(0,10).map(l=>t("li",{className:`report-entry${l.reportId>a.state.production.reportsReadThrough?" new":""}`},[t("span",{className:"report-time",text:`${hr(l.at)}${l.offlineMs?` \xB7 \uBE44\uC6B4 \uB3D9\uC548 ${he(l.offlineMs)}\uC2DC\uAC04`:""}`}),t("span",{text:[l.runs?`${l.runs}\uD68C \uC644\uB8CC`:"",Object.keys(l.produced).length?`\uB4E4\uC5B4\uC634 ${ue(n,l.produced,"+")}`:"",Object.keys(l.consumed).length?`\uC7AC\uB8CC ${ue(n,l.consumed,"\u2212")}`:"",l.gold?`\uC790\uB3D9 \uD310\uB9E4 ${ue(n,l.sold,"\u2212")} +${l.gold} G`:""].filter(Boolean).join(" \xB7 ")})]))):null,o.length?w(s?"\uD655\uC778\uD558\uB294 \uC911\u2026":"\uD655\uC778",()=>{r.readReports(i[0].reportId)},{disabled:s,attrs:{"data-wide":""}}):null,w("\uB2EB\uAE30",()=>r.closeSheet(),{variant:"secondary",attrs:{"data-wide":""}})])])}function aa(e,a){let r=i=>a?.stories.arcs.find(o=>o.id===i)?.title??"\uC774\uC57C\uAE30";for(let i of Object.values(e.stories.pairs)){let o=i.current;if(o?.episodes.some(s=>s.state==="unlocked"))return`\uC0C8 \uC774\uC57C\uAE30\uAC00 \uC5F4\uB838\uC5B4\uC694 \xB7 ${r(o.arcId)}`}let n=e.stories.expedition;if(n){let i=e.stories.pairs[n.pairId]?.current;return`\uD0D0\uD5D8 \uC911 \xB7 ${i?r(i.arcId):"\uC774\uC57C\uAE30 \uD0D0\uD5D8"}`}return Object.keys(e.pairs).length?"\uD0D0\uC0AC\uC5D0\uC11C \uC774\uC57C\uAE30 \uD0D0\uD5D8\uC744 \uB5A0\uB0A0 \uC218 \uC788\uC5B4\uC694":"\uD398\uC5B4\uB97C \uB9CC\uB4E4\uBA74 \uB450 \uC8FC\uBBFC\uC758 \uC774\uC57C\uAE30\uAC00 \uC5F4\uB824\uC694"}function wr(e,a,r){return t("button",{className:"strip story",attrs:{type:"button","aria-label":`\uC8FC\uBBFC \uC774\uC57C\uAE30 \u2014 ${aa(e,a)}`},on:{click:()=>r.openExplore()}},[t("span",{className:"story-art",attrs:{"aria-hidden":"true"}},[c.book("icon")]),t("span",{className:"story-text"},[t("strong",{text:"\uC8FC\uBBFC \uC774\uC57C\uAE30"}),t("span",{text:aa(e,a)})]),t("span",{className:"round-arrow"},[c.chevron()])])}function ra(e,a){let r=e.world;return!r||r.state!=="ready"?R(e,a,{top:{kind:"home"},backdrop:"forest",nav:!1,body:[r?.state==="error"?S(null,[_(r.message),w("\uC138\uACC4 \uBAA9\uB85D\uC73C\uB85C",()=>a.navigate("worlds"),{variant:"secondary"})]):I("\uC138\uACC4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026")]}):R(e,a,{top:{kind:"home"},backdrop:"forest",hero:Qt(e,a),homeLayout:!0,body:[Zt(r.value,a),wr(r.value.state,e.content,a),ea(r.value,e.content,a)],nav:!0,sheet:e.sheet?.kind==="work-report"?ta(e,r.value,a):Yt(e,a)})}var Je={new:"\uC0C8 \uC8FC\uBBFC",breakthrough:"\uB3CC\uD30C",token:"\uC885\uD45C"};function na(e,a){return e.outcome==="new"?"\uACF5\uBC29\uC5D0 \uC654\uC5B4\uC694!":e.outcome==="breakthrough"?`\uB3CC\uD30C ${e.breakthrough}/${a}`:"\uCD5C\uB300 \uB3CC\uD30C\uB77C \uC885\uD45C 1\uAC1C\uAC00 \uB410\uC5B4\uC694"}function Pe(e){return w("\uB2EB\uAE30",()=>e.closeSheet(),{variant:"secondary",attrs:{"data-wide":""}})}function Te(e,a,r,n,i=!1){let o=e.sheet,s=o&&(o.kind==="invite-result"||o.kind==="invite-chances"||o.kind==="invite-log"||o.kind==="invite-wish")?o.page??0:0,l=Math.max(1,Math.ceil(r.length/2)),m=Math.min(s,l-1);return t("div",{className:"paged-rows"},[t(i?"ol":"ul",{className:n},r.slice(m*2,m*2+2)),l>1?t("div",{className:"resident-pages"},[w("\uC774\uC804",()=>a.setInviteSheetPage(m-1),{variant:"secondary",disabled:m===0}),t("span",{text:`${m+1} / ${l}`,attrs:{"aria-live":"polite"}}),w("\uB2E4\uC74C",()=>a.setInviteSheetPage(m+1),{variant:"secondary",disabled:m+1>=l})]):null])}function vr(e,a,r,n,i){let o=n.length===1?n[0]:null,s=o?a.state.residents[o.residentId]:null;return D("fw-invite-result",n.length>1?`${n.length}\uD68C \uCD08\uB300 \uACB0\uACFC`:"\uCD08\uB300 \uACB0\uACFC",[o&&s?t("div",{className:"result-hero"},[t("span",{className:"result-stage"},[U(s)]),t("strong",{className:"result-name",text:s.displayName}),t("span",{className:`result-badge ${o.outcome}`,text:Je[o.outcome]}),t("p",{className:"muted",text:na(o,r.crew.maxBreakthrough)})]):Te(e,i,n.map(l=>{let m=a.state.residents[l.residentId];return t("li",{className:`result-row ${l.outcome}`},[E(m??null),t("strong",{text:m?.displayName??"\uC8FC\uBBFC"}),t("span",{className:`result-badge ${l.outcome}`,text:Je[l.outcome]}),t("small",{className:"muted",text:`${na(l,r.crew.maxBreakthrough)}${l.via==="guarantee"?" \xB7 \uBCF4\uC7A5":""}`})])}),"result-list",!0),Pe(i)])}function yr(e,a,r,n){let i=Object.keys(a.state.residents).sort(),o=a.state.invite.wishResidentId,s=m=>m===o?r.invite.wishWeight:r.invite.baseWeight,l=i.reduce((m,d)=>m+s(d),0);return D("fw-invite-chances","\uD655\uB960 \uBCF4\uAE30",[t("p",{className:"muted",text:`\uB4F1\uB85D\uB41C \uC8FC\uBBFC\uC740 \uBAA8\uB450 \uAC19\uC740 \uD655\uB960\uC774\uC5D0\uC694(\uB4F1\uAE09 \uC5C6\uC74C). \uD76C\uB9DD \uC8FC\uBBFC\uC740 ${r.invite.wishWeight}\uBC30\uB85C \uB9CC\uB098\uC694. \uC0C8 \uC8FC\uBBFC \uC5C6\uC774 ${r.invite.guaranteeAfter}\uBC88\uC774 \uC9C0\uB098\uBA74 \uB2E4\uC74C \uCD08\uB300\uB294 \uC544\uC9C1 \uC624\uC9C0 \uC54A\uC740 \uC8FC\uBBFC\uC774\uC5D0\uC694(\uD76C\uB9DD \uC8FC\uBBFC\uC774 \uAE30\uB2E4\uB9AC\uBA74 \uADF8 \uC8FC\uBBFC). 10\uD68C \uCD08\uB300\uB294 \uD55C \uBC88\uC529 \uCC28\uB840\uB85C \uC801\uC6A9\uB3FC\uC694.`}),i.length===0?t("p",{className:"empty",text:"\uB4F1\uB85D\uB41C \uC8FC\uBBFC\uC774 \uC5C6\uC5B4\uC694."}):Te(e,n,i.map(m=>{let d=a.state.residents[m],p=l?s(m)/l*100:0;return t("li",{className:"chance-row"},[E(d),t("span",{className:"chance-name"},[t("strong",{text:d.displayName}),m===o?t("span",{className:"tag wish",text:"\uD76C\uB9DD"}):null]),t("strong",{className:"chance-value",text:`${p.toFixed(p<10?2:1)}%`})])}),"chance-list"),t("p",{className:"muted",text:`\uCC98\uC74C \uB9CC\uB098\uBA74 \uC601\uC785, \uB2E4\uC2DC \uB9CC\uB098\uBA74 \uB3CC\uD30C(\uCD5C\uB300 ${r.crew.maxBreakthrough}), \uCD5C\uB300 \uB3CC\uD30C \uB4A4\uC5D0\uB294 \uC885\uD45C 1\uAC1C. \uC885\uD45C ${r.invite.tokensPerExchange}\uAC1C\uB85C \uC6D0\uD558\uB294 \uC8FC\uBBFC\uC744 \uACE0\uB97C \uC218 \uC788\uC5B4\uC694.`}),Pe(n)])}function xr(e,a,r,n){let i=a.state.invite.log,o=new Intl.DateTimeFormat("ko-KR",{dateStyle:"short",timeStyle:"short"});return D("fw-invite-log","\uCD08\uB300 \uAE30\uB85D",[i.length===0?t("p",{className:"empty",text:"\uC544\uC9C1 \uCD08\uB300 \uAE30\uB85D\uC774 \uC5C6\uC5B4\uC694."}):Te(e,n,i.map(s=>t("li",{className:`result-row ${s.outcome}`},[E(a.state.residents[s.residentId]??null),t("strong",{text:a.state.residents[s.residentId]?.displayName??s.name}),t("span",{className:`result-badge ${s.outcome}`,text:Je[s.outcome]}),t("small",{className:"muted",text:`${o.format(new Date(s.at))}${s.via==="guarantee"?" \xB7 \uBCF4\uC7A5":s.via==="exchange"?" \xB7 \uC885\uD45C \uAD50\uD658":""}${s.outcome==="breakthrough"?` \xB7 \uB3CC\uD30C ${s.breakthrough}/${r.crew.maxBreakthrough}`:""}`})])),"result-list",!0),t("p",{className:"muted",text:`\uCD5C\uADFC ${r.invite.logLimit}\uAC74\uAE4C\uC9C0 \uBCF4\uAD00\uD574\uC694.`}),Pe(n)])}function kr(e,a,r){let n=a.state.invite.wishResidentId,i=!!e.busy["invite-wish"],o=Object.values(a.state.residents).sort((s,l)=>s.displayName.localeCompare(l.displayName,"ko"));return D("fw-invite-wish","\uD76C\uB9DD \uC8FC\uBBFC \uC124\uC815",[t("p",{className:"muted",text:"\uB4F1\uB85D\uB41C \uCE90\uB9AD\uD130\xB7\uD398\uB974\uC18C\uB098 \uC911 \uD55C \uBA85\uC744 \uACE0\uB974\uBA74 \uADF8 \uC8FC\uBBFC\uC744 \uB354 \uC798 \uB9CC\uB098\uC694."}),o.length===0?t("p",{className:"empty",text:"\uB4F1\uB85D\uB41C \uC8FC\uBBFC\uC774 \uC5C6\uC5B4\uC694."}):Te(e,r,o.map(s=>t("li",{},[t("button",{className:`pick-row${s.residentId===n?" selected":""}`,attrs:{type:"button","aria-pressed":s.residentId===n?"true":"false"},disabled:i,on:{click:()=>{r.setWish(s.residentId)}}},[E(s),t("strong",{text:s.displayName}),G(s),t("small",{className:"muted",text:s.recruited?"\uC601\uC785 \uC644\uB8CC":"\uCD08\uB300 \uB300\uAE30"}),s.residentId===n?c.check("icon"):null])])),"pick-list"),n?w("\uD76C\uB9DD \uC8FC\uBBFC \uD574\uC81C",()=>{r.setWish(null)},{variant:"secondary",disabled:i}):null,Pe(r)])}function ia(e,a,r,n){let i=e.sheet;return i?i.kind==="invite-result"?vr(e,a,r,i.draws,n):i.kind==="invite-chances"?yr(e,a,r,n):i.kind==="invite-log"?xr(e,a,r,n):i.kind==="invite-wish"?kr(e,a,n):null:null}function Nr(e,a){let r=e.world?.state==="ready"?e.world.value:null;if(!r)return null;let{tickets:n,tokens:i}=r.state.wallet;return t("div",{className:"resources invite-counters"},[t("button",{className:"counter ticket",attrs:{type:"button","aria-label":`\uCD08\uB300\uAD8C ${n}\uC7A5 \u2014 \uCD08\uB300\uAD8C \uBC1B\uAE30`},on:{click:()=>a.openDeliveries()}},[t("span",{className:"ticket-mark"},[c.ticket("icon")]),t("span",{className:"counter-value",text:String(n)}),t("span",{className:"counter-plus"},[c.plus("icon tiny")])]),t("span",{className:"counter token",attrs:{"aria-label":`\uC885\uD45C ${i}\uAC1C`}},[t("span",{className:"token-mark"},[c.leaf("icon")]),t("span",{className:"counter-value",text:String(i)})])])}function Sr(e,a){let r=(n,i,o)=>t("button",{className:`segment${e.inviteTab===n?" selected":""}`,attrs:{type:"button",role:"tab","aria-selected":e.inviteTab===n?"true":"false"},on:{click:()=>a.setInviteTab(n)}},[o,t("span",{text:i})]);return t("div",{className:"segmented invite-tabs",attrs:{role:"tablist","aria-label":"\uCD08\uB300"}},[r("invite","\uC8FC\uBBFC \uCD08\uB300",c.sprout("icon")),r("exchange","\uC885\uD45C \uAD50\uD658",c.leaf("icon"))])}function oa(e,a,r,n,i){let o=n*r.invite.ticketsPerDraw,s=Math.max(0,o-a.state.wallet.tickets),l=Object.keys(a.state.residents).length===0,m=!!e.busy[`invite:${n}`];return t("button",{className:`draw-button${s?" short":""}`,attrs:{type:"button","aria-label":`${n}\uD68C \uCD08\uB300 \u2014 \uCD08\uB300\uAD8C ${o}\uC7A5${s?`, ${s}\uC7A5 \uBD80\uC871`:""}`},disabled:m||s>0||l||a.state.progress.starterResidentId===null,on:{click:()=>{i.draw(n)}}},[t("strong",{className:"draw-title",text:m?"\uCD08\uB300\uD558\uB294 \uC911\u2026":`${n}\uD68C \uCD08\uB300`}),t("span",{className:"draw-cost"},[c.ticket("icon"),`${o}\uC7A5`]),s?t("span",{className:"draw-short"},[c.info("icon tiny"),`\uCD08\uB300\uAD8C ${s}\uC7A5 \uBD80\uC871`]):null])}function $r(e,a,r,n){let i=Object.values(a.state.residents),o=a.state.invite.wishResidentId?a.state.residents[a.state.invite.wishResidentId]:null,s=i.filter(p=>!p.recruited).length,l=r.invite.guaranteeAfter-a.state.invite.sinceNew+1,m=a.state.wallet.tokens,d=r.invite.tokensPerExchange;return[S(null,[t("button",{className:"menu-row wish-row",attrs:{type:"button"},on:{click:()=>n.openSheet({kind:"invite-wish"})}},[t("span",{className:"menu-icon light"},[c.sprout("icon")]),t("span",{className:"menu-text"},[t("span",{className:"menu-title",text:"\uD76C\uB9DD \uC8FC\uBBFC \uC124\uC815"}),t("span",{className:"menu-detail",text:o?`${o.displayName} \xB7 \uB2E4\uB978 \uC8FC\uBBFC\uBCF4\uB2E4 \uC798 \uB9CC\uB098\uC694`:"\uB4F1\uB85D\uB41C \uCE90\uB9AD\uD130\xB7\uD398\uB974\uC18C\uB098 \uC911\uC5D0\uC11C \uB9CC\uB098\uC694."})]),t("span",{className:"menu-chevron"},[c.chevron()])]),i.length===0?t("div",{className:"invite-empty"},[t("p",{className:"empty",text:"\uCD08\uB300\uD560 \uC8FC\uBBFC\uC774 \uC5C6\uC5B4\uC694. \uBA3C\uC800 \uCE90\uB9AD\uD130\uB098 \uD398\uB974\uC18C\uB098\uB97C \uBD88\uB7EC\uC640 \uC8FC\uC138\uC694."}),w("\uC8FC\uBBFC \uBD88\uB7EC\uC624\uAE30",()=>n.navigate("residents"))]):a.state.progress.starterResidentId===null?t("div",{className:"invite-empty"},[t("p",{className:"empty",text:"\uC2DC\uC791 \uC8FC\uBBFC\uC744 \uBA3C\uC800 \uC815\uD558\uBA74 \uCD08\uB300\uD560 \uC218 \uC788\uC5B4\uC694."}),w("\uC8FC\uBBFC \uD654\uBA74\uC73C\uB85C",()=>n.navigate("residents"))]):null,t("div",{className:"draw-row"},[oa(e,a,r,1,n),oa(e,a,r,r.invite.multiDraw,n)]),t("p",{className:"hint center",text:i.length===0?"\uB4F1\uB85D\uD55C \uC8FC\uBBFC \uC911\uC5D0\uC11C \uC0C8\uB85C\uC6B4 \uC778\uC5F0\uC744 \uB9CC\uB0A0 \uC218 \uC788\uC5B4\uC694.":s>0?`\uC544\uC9C1 \uC624\uC9C0 \uC54A\uC740 \uC8FC\uBBFC ${s}\uBA85 \xB7 \uB2A6\uC5B4\uB3C4 ${Math.max(1,l)}\uBC88\uC9F8 \uCD08\uB300\uC5D0\uB294 \uC0C8 \uC8FC\uBBFC\uC744 \uB9CC\uB098\uC694.`:"\uBAA8\uB450 \uACF5\uBC29\uC5D0 \uC654\uC5B4\uC694. \uB2E4\uC2DC \uB9CC\uB098\uBA74 \uB3CC\uD30C, \uCD5C\uB300 \uB3CC\uD30C \uB4A4\uC5D0\uB294 \uC885\uD45C\uAC00 \uB3FC\uC694."}),t("div",{className:"link-row"},[t("button",{className:"link-button with-icon",attrs:{type:"button"},on:{click:()=>n.openSheet({kind:"invite-chances"})}},[c.info("icon"),t("span",{text:"\uD655\uB960 \uBCF4\uAE30"})]),t("button",{className:"link-button with-icon",attrs:{type:"button"},on:{click:()=>n.openSheet({kind:"invite-log"})}},[c.document("icon"),t("span",{text:"\uCD08\uB300 \uAE30\uB85D"})])])]),S(null,[t("button",{className:"exchange-card",attrs:{type:"button","aria-label":`\uC885\uD45C \uAD50\uD658 ${m} / ${d} \u2014 \uC6D0\uD558\uB294 \uC8FC\uBBFC \uC120\uD0DD`},on:{click:()=>n.setInviteTab("exchange")}},[t("span",{className:"token-coin big"},[c.leaf("icon big")]),t("span",{className:"exchange-count"},[t("strong",{text:"\uC885\uD45C \uAD50\uD658"}),t("span",{className:"count-pill",text:`${m} / ${d}`})]),t("span",{className:"exchange-text"},[t("strong",{},[c.people("icon")," \uC6D0\uD558\uB294 \uC8FC\uBBFC \uC120\uD0DD"]),t("span",{className:"muted",text:"\uCD5C\uB300 \uB3CC\uD30C \uC774\uD6C4 \uC911\uBCF5\uC740 \uC885\uD45C\uB85C."})]),t("span",{className:"menu-chevron"},[c.chevron()])])])]}function Cr(e,a,r,n,i){let o=r.crew.maxBreakthrough,s=a.recruited&&a.breakthrough>=o,l=!!e.busy[`exchange:${a.residentId}`],m=a.recruited?s?"\uCD5C\uB300 \uB3CC\uD30C":`\uB3CC\uD30C ${a.breakthrough}/${o} \u2192 ${a.breakthrough+1}`:"\uCD08\uB300 \uB300\uAE30 \u2192 \uC601\uC785";return t("li",{className:"exchange-row"},[E(a),t("span",{className:"exchange-name"},[t("strong",{text:a.displayName}),t("span",{className:"tag-row"},[G(a),t("small",{className:"muted",text:m})])]),t("button",{className:"button small",text:l?"\uAD50\uD658 \uC911\u2026":"\uAD50\uD658",attrs:{type:"button","aria-label":`${a.displayName}\uC640(\uACFC) \uC885\uD45C \uAD50\uD658`},disabled:l||s||n<r.invite.tokensPerExchange,on:{click:()=>{i.exchange(a.residentId)}}})])}function Ir(e,a,r,n){let i=a.state.wallet.tokens,o=Object.values(a.state.residents).sort((m,d)=>Number(m.recruited)-Number(d.recruited)||m.displayName.localeCompare(d.displayName,"ko")),s=Math.max(1,Math.ceil(o.length/2)),l=Math.min(e.invitePage??0,s-1);return[S("\uC885\uD45C \uAD50\uD658",[t("p",{className:"exchange-summary"},[t("span",{className:"token-coin"},[c.leaf("icon")]),t("strong",{text:`${i} / ${r.invite.tokensPerExchange}`}),t("span",{className:"muted",text:` \uC885\uD45C ${r.invite.tokensPerExchange}\uAC1C\uB85C \uC6D0\uD558\uB294 \uC8FC\uBBFC\uC744 \uBC14\uB85C \uB9DE\uC774\uD558\uAC70\uB098 \uB3CC\uD30C\uD574\uC694.`})]),o.length===0?t("p",{className:"empty",text:"\uB4F1\uB85D\uB41C \uC8FC\uBBFC\uC774 \uC5C6\uC5B4\uC694."}):t("ul",{className:"exchange-list"},o.slice(l*2,l*2+2).map(m=>Cr(e,m,r,i,n))),s>1?t("div",{className:"resident-pages"},[w("\uC774\uC804",()=>n.setInvitePage(l-1),{variant:"secondary",disabled:l===0}),t("span",{text:`${l+1} / ${s}`,attrs:{"aria-live":"polite"}}),w("\uB2E4\uC74C",()=>n.setInvitePage(l+1),{variant:"secondary",disabled:l+1>=s})]):null])]}function sa(e,a){let r=e.world?.state==="ready"?e.world.value:null,n=e.content,i=r&&n;return R(e,a,{top:{kind:"sub",title:"\uCD08\uB300",subtitle:"\uC0C8\uB85C\uC6B4 \uC778\uC5F0\uC744 \uB9DE\uC774\uD574\uC694",resources:!1,counters:Nr(e,a)},backdrop:"forest",body:i?[Sr(e,a),...e.inviteTab==="invite"?$r(e,r,n,a):Ir(e,r,n,a)]:[I("\uC138\uACC4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026")],nav:!0,sheet:i?ia(e,r,n,a):null})}var Rr="http://www.w3.org/2000/svg",la={locked:"\uC7A0\uAE40",available:"\uCD9C\uBC1C \uAC00\uB2A5",running:"\uD0D0\uD5D8 \uC911",unlocked:"\uC774\uC57C\uAE30 \uC5F4\uB9BC",read:"\uC77D\uC74C"};function Le(e){return t("div",{className:"field-tabs explore-tabs",attrs:{role:"tablist","aria-label":"\uD0D0\uC0AC"}},[H(e,"survey-patrol",{className:"field-tab",label:"\uC870\uC0AC",children:[c.search("icon field-glyph"),t("span",{text:"\uC870\uC0AC"})]}),H(e,"survey-patrol",{className:"field-tab",label:"\uC21C\uCC30",children:[c.compass("icon field-glyph"),t("span",{text:"\uC21C\uCC30"})]}),t("button",{className:"field-tab current",attrs:{type:"button",role:"tab","aria-selected":"true"}},[c.leaf("icon field-glyph"),t("span",{text:"\uC774\uC57C\uAE30 \uD0D0\uD5D8"})])])}function Mr(e,a){let r=document.createElementNS(Rr,"svg");r.setAttribute("viewBox","0 0 360 170"),r.setAttribute("class","trail-art"),r.setAttribute("aria-hidden","true");let n=[[60,120],[170,92],[285,60]],i=o=>e.episodes[o].status==="read"?"#5a9a44":o===a?"#fff8e8":"#cdbf9f";return r.innerHTML=`
    <g stroke="#4b2e1a" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
      <rect width="360" height="170" fill="#cfe5c0" stroke="none"/>
      <path d="M-5 150 Q90 110 170 130 T365 105 V175 H-5z" fill="#a9cc86"/>
      <path d="M200 -5 Q215 60 190 95 T230 175 H262 Q240 120 262 85 T236 -5z" fill="#9fd0e6"/>
      <circle cx="30" cy="40" r="26" fill="#8fbf6e"/><circle cx="330" cy="140" r="22" fill="#8fbf6e"/>
      <rect x="300" y="22" width="34" height="46" rx="4" fill="#cdbf9f"/><path d="M308 68 V40 a9 9 0 0 1 18 0 V68" fill="#a9cc86"/>
      <path d="M20 135 Q60 120 ${n[0][0]} ${n[0][1]} Q120 100 ${n[1][0]} ${n[1][1]} Q230 80 ${n[2][0]} ${n[2][1]}"
        fill="none" stroke="#fff8e8" stroke-width="6" stroke-dasharray="10 8"/>
      ${n.map(([o,s],l)=>`<circle cx="${o}" cy="${s}" r="11" fill="${i(l)}"/>`).join("")}
      <g transform="translate(${n[a][0]-14} ${n[a][1]-46})">
        <path d="M14 30 L8 22 H4 a4 4 0 0 1-4-4 V4 a4 4 0 0 1 4-4 H24 a4 4 0 0 1 4 4 V18 a4 4 0 0 1-4 4 H20z" fill="#fff8e8"/>
        <path d="M14 18 c0-6 0-9 0-12 M14 12 c-4-1-6-4-6-7 4 1 6 3 6 7z M14 10 c4-1 5-4 5-7-4 1-5 3-5 7z" fill="#5a9a44" stroke-width="2"/>
      </g>
    </g>`,r}function Ar(e,a,r,n){if(r.length<2)return null;let i=t("select",{className:"input",attrs:{"aria-label":"\uD398\uC5B4 \uACE0\uB974\uAE30"},on:{change:()=>n.selectStoryPair(i.value)}},r.map(o=>{let s=a.state.pairs[o.pairId].residentIds.map(l=>a.state.residents[l]?.displayName??"\uC8FC\uBBFC");return t("option",{text:s.join(" \xB7 "),attrs:{value:o.pairId}})}));return i.value=r.some(o=>o.pairId===e.explore.pairId)?e.explore.pairId:r[0].pairId,i}function Pr(e,a){return t("ol",{className:"episode-row",attrs:{"aria-label":"\uC774\uC57C\uAE30 \uD3B8"}},e.episodes.map(r=>t("li",{className:`episode-tile ${r.status}${r.index===a?" selected":""}`},[t("span",{className:"episode-icon"},[(r.status==="locked"?c.lock:c.book)("icon big"),r.status==="read"?t("span",{className:"episode-check"},[c.check("icon tiny")]):null]),t("span",{className:"episode-text"},[t("strong",{text:`${r.index+1}\uD3B8`}),t("span",{text:r.title}),t("small",{text:r.status==="locked"?r.reasons[0]??la.locked:la[r.status]})])])))}function Tr(e,a,r,n,i,o){let s=v=>Math.max(0,(a.state.inventory[v]??0)-(a.state.production.protectedStock[v]??0)),l=Object.entries(i.preparations),m=l.every(([v,$])=>s(v)>=$),d=i.participants.map(v=>a.state.residents[v]).filter(Boolean),p=a.state.stories.expedition,u=p&&p.pairId===n.pairId&&p.episode===i.index,h=v=>!!e.busy[v],f=d.filter(v=>Object.values(a.state.production.facilities).some($=>$.residentId===v.residentId)),b;if(i.status==="available"){let v=`depart:${n.pairId}:${i.index}`;b=w(h(v)?"\uCD9C\uBC1C\uD558\uB294 \uC911\u2026":m?"\uD0D0\uD5D8 \uCD9C\uBC1C":"\uC900\uBE44\uBB3C\uC774 \uBD80\uC871\uD574\uC694",()=>{o.depart(n.pairId,i.index)},{disabled:h(v)||!m,attrs:{"data-wide":""}})}else if(i.status==="running"&&u){let v=ve(e,a,p);b=t("div",{className:"expedition-running"},[t("p",{className:"running-line"},[c.compass("icon"),t("strong",{text:"\uD0D0\uD5D8 \uC911"}),v.countdown]),v.bar,w(h("expedition-cancel")?"\uCDE8\uC18C\uD558\uB294 \uC911\u2026":"\uD0D0\uD5D8 \uCDE8\uC18C (\uC900\uBE44\uBB3C\uC740 \uBAA8\uB450 \uB3CC\uB824\uBC1B\uC544\uC694)",()=>{o.cancelExpedition()},{variant:"secondary",disabled:h("expedition-cancel")})])}else if((i.status==="unlocked"||i.status==="read")&&i.storyId){let v=i.storyId;b=w(i.status==="read"?"\uB2E4\uC2DC \uC77D\uAE30":i.written?"\uC774\uC5B4 \uC77D\uAE30":"\uC774\uC57C\uAE30 \uC77D\uAE30",()=>o.openStory(n.pairId,i.index,v),{attrs:{"data-wide":""}})}else b=t("div",{className:"locked-reasons"},[t("p",{className:"hint",text:"\uC544\uC9C1 \uB5A0\uB0A0 \uC218 \uC5C6\uC5B4\uC694:"}),t("ul",{},i.reasons.map(v=>t("li",{text:v})))]);return t("div",{className:"expedition-details"},[t("div",{className:"detail-grid"},[t("div",{className:"detail-cell"},[c.clock("icon big"),t("span",{},[t("small",{text:"\uC18C\uC694 \uC2DC\uAC04"}),t("strong",{text:`${i.minutes}\uBD84`})])]),t("div",{className:"detail-cell"},[c.people("icon big"),t("span",{},[t("small",{text:"\uCC38\uC5EC \uC8FC\uBBFC"}),t("strong",{text:`${d.length}\uBA85`})]),t("span",{className:"avatar-row"},d.map(v=>E(v)))]),t("div",{className:"detail-cell wide"},[c.box("icon big"),t("span",{},[t("small",{text:"\uC900\uBE44\uBB3C"}),t("span",{className:"prep-list"},l.map(([v,$])=>t("span",{className:`prep${s(v)>=$?" ok":""}`},[j(v),`${O(r,v)} ${Math.min(s(v),$)}/${$}`,s(v)>=$?c.check("icon tiny"):null])))])]),t("div",{className:"detail-cell wide"},[c.sparkle("icon big"),t("span",{},[t("small",{text:"\uBC1C\uACAC\uD560 \uC218 \uC788\uB294 \uAC83"}),t("strong",{text:n.arc.discovery})])])]),t("p",{className:"hint",text:f.length?`${f.map(v=>v.displayName).join(", ")}\uC740(\uB294) \uCD9C\uBC1C\uD558\uBA74 \uC2DC\uC124\uC5D0\uC11C \uBE60\uC838\uC694. \uC2DC\uC124\uC740 \uAE30\uBCF8 \uD6A8\uC728\uB85C \uACC4\uC18D \uC77C\uD558\uACE0, \uC9C4\uD589 \uC911\uC778 \uC791\uC5C5\uC740 \uCDE8\uC18C\uD558\uC9C0 \uC54A\uC544\uC694.`:"\uC2DC\uC124\uC740 \uADF8\uB300\uB85C \uC77C\uD574\uC694. \uD0D0\uD5D8\uC740 \uC77C\uC0C1 \uC0DD\uC0B0\uACFC \uB530\uB85C \uD558\uB098\uC529 \uB5A0\uB098\uC694."}),b])}function Lr(e,a,r){let i=(e.world?.state==="ready"?e.world.value.state.stories.pairs?.[a.pairId]?.current:null)?.episodes.flatMap((l,m)=>l.state==="read"?[{index:m,storyId:l.storyId}]:[])??[];if(a.completed.length===0&&i.length===0)return S("\uC77D\uC740 \uC774\uC57C\uAE30",[t("p",{className:"empty",text:"\uC544\uC9C1 \uC77D\uC740 \uC774\uC57C\uAE30\uAC00 \uC5C6\uC5B4\uC694."})]);let o=Math.max(1,Math.ceil(a.completed.length/2)),s=Math.min(e.explore.historyPage??0,o-1);return S("\uC77D\uC740 \uC774\uC57C\uAE30",[i.length&&s===0?t("div",{className:"completed-arc"},[t("strong",{text:a.arc.title}),...i.map(({index:l,storyId:m})=>w(`${l+1}\uD3B8 \uB2E4\uC2DC \uC77D\uAE30`,()=>r.openStory(a.pairId,l,m),{variant:"secondary"}))]):null,t("ul",{className:"menu-list"},a.completed.slice().reverse().slice(s*2,s*2+2).map(l=>t("li",{className:"completed-arc"},[t("strong",{text:l.title}),t("span",{className:"row-actions"},l.storyIds.map((m,d)=>t("button",{className:"outline-button small",text:`${d+1}\uD3B8`,attrs:{type:"button","aria-label":`${l.title} ${d+1}\uD3B8 \uB2E4\uC2DC \uC77D\uAE30`},on:{click:()=>r.openStory(a.pairId,d,m)}})))]))),o>1?t("div",{className:"resident-pages"},[w("\uC774\uC804",()=>r.setExploreHistoryPage(s-1),{variant:"secondary",disabled:s===0}),t("span",{text:`${s+1} / ${o}`,attrs:{"aria-live":"polite"}}),w("\uB2E4\uC74C",()=>r.setExploreHistoryPage(s+1),{variant:"secondary",disabled:s+1>=o})]):null])}function zr(e,a,r,n){let i=a.state.stories.expedition,o=i?r.find(m=>m.pairId===i.pairId):null,s=Math.round(n.production.absenceLimitMs/36e5);if(!i||!o)return t("div",{className:"strip offline explore-strip"},[c.compass(),t("span",{text:"\uC9C0\uAE08\uC740 \uB5A0\uB09C \uD0D0\uD5D8\uC774 \uC5C6\uC5B4\uC694."}),t("small",{className:"muted",text:`\uBC29\uCE58 \uB204\uC801 \uCD5C\uB300 ${s}\uC2DC\uAC04`})]);let l=ve(e,a,i);return t("div",{className:"strip offline explore-strip"},[c.compass(),t("span",{className:"strip-progress"},[t("span",{},[`${o.episodes[i.episode].title} \xB7 `,l.countdown," \uB0A8\uC74C"]),l.bar]),t("small",{className:"muted",text:`\uBC29\uCE58 \uB204\uC801 \uCD5C\uB300 ${s}\uC2DC\uAC04`})])}function Er(e,a,r,n){let i=e.explore.overview;if(!i||i.state==="loading")return[Le(n),I("\uC774\uC57C\uAE30\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026")];if(i.state==="error")return[Le(n),S(null,[_(i.message),w("\uB2E4\uC2DC \uBD88\uB7EC\uC624\uAE30",()=>{n.loadStoryOverview()})])];let o=i.value.pairs.filter(p=>e.explore.section==="history"||!a.state.pairs[p.pairId]?.archived);if(o.length===0)return[Le(n),S(null,[t("p",{text:"\uD398\uC5B4\uB97C \uB9CC\uB4E4\uBA74 \uB450 \uC8FC\uBBFC\uC758 \uC774\uC57C\uAE30 \uD0D0\uD5D8\uC774 \uC5F4\uB824\uC694."}),t("p",{className:"muted",text:"1\uD3B8\uC740 \uD55C \uC8FC\uBBFC\uB9CC \uACF5\uBC29\uC5D0 \uC640 \uC788\uC5B4\uB3C4 \uB5A0\uB0A0 \uC218 \uC788\uC5B4\uC694."}),w("\uC8FC\uBBFC \uD654\uBA74\uC73C\uB85C",()=>n.navigate("residents"),{variant:"secondary"})])];let s=o.find(p=>p.pairId===e.explore.pairId)??o[0],l=s.episodes.find(p=>p.status!=="read")?.index??2,m=e.explore.section??"episode",d=[["episode","\uD0D0\uD5D8 \uC900\uBE44"],["journey","\uC5EC\uC815"],["history","\uC77D\uC740 \uC774\uC57C\uAE30"]];return[Le(n),Ar(e,a,o,n),t("div",{className:"pill-tabs",attrs:{role:"group","aria-label":"\uC774\uC57C\uAE30 \uD654\uBA74"}},d.map(([p,u])=>t("button",{className:`pill-tab${m===p?" current":""}`,text:u,attrs:{type:"button","aria-pressed":m===p?"true":"false"},on:{click:()=>n.setExploreSection(p)}}))),m==="journey"?t("section",{className:"card trail-card",attrs:{"aria-label":`${s.arc.place} \uC9C0\uB3C4`}},[Mr(s,l),t("span",{className:"place-sign",text:s.arc.place})]):null,m==="episode"?S(s.arc.title,[Pr(s,l),Tr(e,a,r,s,s.episodes[l],n)],{className:"arc-card"}):null,m==="journey"?zr(e,a,o,r):null,m==="history"?Lr(e,s,n):null]}function da(e,a){let r=e.world?.state==="ready"?e.world.value:null;return R(e,a,{top:{kind:"sub",title:"\uD0D0\uC0AC",back:{route:"home",label:"\uD648"},resources:!0},backdrop:"forest",body:r&&e.content?Er(e,r,e.content,a):[I("\uC138\uACC4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026")],nav:!0})}var Wr={calm:"affection",surprise:"curiosity",worry:"fluster",thinking:"inspiration",shy:"fluster"},jr={joy:"\u266A",affection:"\u2661",curiosity:"?",fluster:"\u{1F4A7}",inspiration:"\u2726",annoyance:"\u{1F4A2}"};function ca(e){let a=e in Ve?e:Wr[e];return a?ie(Ve[a],{className:"emotion-bubble emotion-art",fallback:()=>t("span",{className:"emotion-bubble",text:jr[a]})}):null}function xe(e,a){return e.state.residents[a]?.displayName??"\uC8FC\uBBFC"}function Or(e,a,r,n){let i=r?.participants??[],o=n?.kind==="line"?n.speakerId:n?.kind==="choice"?n.askerId:null;return t("section",{className:"story-stage",attrs:{"aria-hidden":"true"}},[ie(de[e].scene,{className:"stage-art",fallback:()=>t("span",{className:"stage-shelf"})}),t("div",{className:`stage-cast cast-${i.length}`},i.map(s=>{let l=a.state.residents[s];if(!l)return null;let m=o!==s?null:n?.kind==="line"?ca(n.emotion):ca("curiosity");return t("span",{className:`stage-spot${o===s?" speaking":""}`},[m,U(l)])}))])}function Vr(e,a,r,n){if(r.story.state==="loading")return t("div",{className:"dialogue-box loading",attrs:{role:"status"}},[t("p",{text:"\uC774\uC57C\uAE30\uB97C \uC4F0\uB294 \uC911\uC774\uC5D0\uC694\u2026"}),t("p",{className:"muted",text:"\uCC98\uC74C \uC5EC\uB294 \uC774\uC57C\uAE30\uB294 \uC5B8\uC5B4 \uBAA8\uB378\uC774 \uC9C0\uAE08 \uC368\uC694. \uC7A0\uC2DC \uAC78\uB9B4 \uC218 \uC788\uC5B4\uC694."})]);if(r.story.state==="error")return t("div",{className:"dialogue-box error",attrs:{role:"alert"}},[t("p",{text:r.story.message}),t("div",{className:"row-actions"},[w("\uAC19\uC740 \uC774\uC57C\uAE30\uB85C \uB2E4\uC2DC \uC2DC\uB3C4",()=>n.retryStory()),w("\uB2EB\uAE30",()=>n.closeStory(),{variant:"secondary"})])]);let o=r.story.value.segments;if(r.index>=o.length){let m=!!e.busy[`read:${r.storyId}`];return t("div",{className:"dialogue-box end"},[t("p",{className:"end-line",text:"\uC774\uC57C\uAE30\uB294 \uC5EC\uAE30\uAE4C\uC9C0\uC608\uC694."}),t("p",{className:"muted",text:"\uB2E4 \uC77D\uC73C\uBA74 \uC774 \uC7A5\uBA74\uC744 \uD568\uAED8\uD55C \uC8FC\uBBFC\uB4E4\uC758 \uAE30\uC5B5\uC5D0 \uB0A8\uC544\uC694."}),w(m?"\uAE30\uB85D\uD558\uB294 \uC911\u2026":"\uB2E4 \uC77D\uC74C",()=>{n.finishStory()},{disabled:m,attrs:{"data-wide":""}})])}let l=o[r.index];if(l.kind==="choice"){let m=Xe(a,r),d=m?.choice?.optionId??null,p=!!e.busy[`choose:${r.storyId}`],u=l.question.length+l.options.reduce((h,f)=>h+f.text.length,0)>150;return u&&(r.choiceView??"question")==="question"?t("div",{className:"dialogue-box choice"},[t("span",{className:"speaker-tag"},[c.leaf("icon tiny"),xe(a,l.askerId)]),t("p",{className:"line",text:l.question}),w("\uB2F5\uBCC0 \uACE0\uB974\uAE30",()=>n.setChoiceView("answers"))]):t("div",{className:"dialogue-box choice"},[t("span",{className:"speaker-tag"},[c.leaf("icon tiny"),xe(a,l.askerId)]),u?w("\uC9C8\uBB38 \uB2E4\uC2DC \uBCF4\uAE30",()=>n.setChoiceView("question"),{variant:"secondary"}):t("p",{className:"line",text:l.question}),t("div",{className:"choice-options",attrs:{role:"group","aria-label":"\uB300\uB2F5 \uACE0\uB974\uAE30"}},l.options.map(h=>t("button",{className:`choice-option${d===h.optionId?" chosen":""}`,text:h.text,attrs:{type:"button","aria-pressed":d===h.optionId?"true":"false"},disabled:p||d!==null||m?.state==="read",on:{click:()=>{n.chooseAnswer(h.optionId)}}}))),d||m?.state==="read"?t("p",{className:"muted",text:d?"\uC774\uBBF8 \uB300\uB2F5\uD588\uC5B4\uC694.":"\uB2E4\uC2DC \uC77D\uC744 \uB54C\uB294 \uB300\uB2F5\uC774 \uB0A8\uC9C0 \uC54A\uC544\uC694."}):t("p",{className:"muted",text:"\uB300\uB2F5\uC740 \uD55C \uBC88\uB9CC \uD560 \uC218 \uC788\uC5B4\uC694. \uBB3C\uC5B4\uBCF8 \uC8FC\uBBFC\uB9CC \uAE30\uC5B5\uD574\uC694."})])}return t("div",{className:`dialogue-box${l.kind==="narration"?" narration-only":""}`},[l.kind==="line"?t("span",{className:"speaker-tag"},[c.leaf("icon tiny"),xe(a,l.speakerId)]):null,t("p",{className:l.kind==="line"?"line":"narration",text:l.text})])}function Xe(e,a){let r=e.state.stories.pairs[a.pairId];return[r?.current,...r?.completed??[]].find(i=>i?.episodes[a.episode]?.storyId===a.storyId)?.episodes[a.episode]}function Br(e,a,r){let n=a.story.state==="ready"?a.story.value:null,i=n?n.segments.slice(0,Math.min(a.index+1,n.segments.length)):[],o=Math.max(1,i.length),s=Math.min(a.backlogPage??o-1,o-1);return D("fw-backlog","\uAE30\uB85D",[t("ol",{className:"backlog-list"},i.slice(s,s+1).map(l=>t("li",{className:`backlog-${l.kind}`},[l.kind==="line"?t("strong",{text:xe(e,l.speakerId)}):l.kind==="choice"?t("strong",{text:xe(e,l.askerId)}):null,t("span",{text:l.kind==="choice"?l.question:l.text})]))),o>1?t("div",{className:"resident-pages"},[w("\uC774\uC804",()=>r.setBacklogPage(s-1),{variant:"secondary",disabled:s===0}),t("span",{text:`${s+1} / ${o}`,attrs:{"aria-live":"polite"}}),w("\uB2E4\uC74C",()=>r.setBacklogPage(s+1),{variant:"secondary",disabled:s+1>=o})]):null,w("\uB2EB\uAE30",()=>r.toggleBacklog(),{variant:"secondary",attrs:{"data-wide":""}})])}function ma(e,a){let r=e.world?.state==="ready"?e.world.value:null,n=e.reader;if(!r||!n)return R(e,a,{top:{kind:"sub",title:"\uACF5\uBC29 \uC774\uC57C\uAE30",back:{route:"explore",label:"\uD0D0\uC0AC"},resources:!1},backdrop:"wood",body:[t("p",{className:"muted",text:"\uC5F4\uB9B0 \uC774\uC57C\uAE30\uAC00 \uC5C6\uC5B4\uC694."})],nav:!0});let i=n.story.state==="ready"?n.story.value:null,o=i?.segments.length??0,s=i?.segments[n.index],l=s?.kind==="choice"&&!Xe(r,n)?.choice&&Xe(r,n)?.state!=="read",m=t("div",{className:"resources reader-tools"},[t("button",{className:"chip-button",attrs:{type:"button","aria-pressed":n.backlog?"true":"false"},disabled:!i,on:{click:()=>a.toggleBacklog()}},[c.book("icon"),t("span",{text:"\uAE30\uB85D"})]),t("button",{className:`chip-button${n.auto?" active":""}`,attrs:{type:"button","aria-pressed":n.auto?"true":"false"},disabled:!i,on:{click:()=>a.toggleAuto()}},[c.chevron("icon"),t("span",{text:n.auto?"\uC790\uB3D9 \uB044\uAE30":"\uC790\uB3D9"})])]),d=R(e,a,{top:{kind:"sub",title:"\uACF5\uBC29 \uC774\uC57C\uAE30",subtitle:i?.title??"\uC774\uC57C\uAE30",resources:!1,counters:m},backdrop:"wood",storyLayout:!0,body:[Or(oe(e),r,i,s),Vr(e,r,n,a),i&&n.index<o?t("div",{className:"reader-foot"},[t("span",{className:"count-pill",text:`${n.index+1} / ${o}`}),w(n.index===o-1?"\uB2E4 \uC77D\uACE0 \uBCF4\uAD00":"\uACC4\uC18D",()=>{n.index===o-1?a.finishStory():a.advanceStory()},{disabled:l,attrs:{"data-wide":""}})]):null],nav:!1,sheet:n.backlog?Br(r,n,a):null}),p=d.querySelector(".back-button, .back-spacer");if(p){let u=t("button",{className:"back-button",attrs:{type:"button","aria-label":"\uC774\uC57C\uAE30 \uB2EB\uAE30"},on:{click:()=>a.closeStory()}},[c.back()]);p.replaceWith(u)}return d}var pa,Ze=!1;function ze(e){let a=()=>{clearTimeout(pa),pa=setTimeout(()=>{!Ze&&r.isConnected&&e.onSearch(r.value)},300)},r=t("input",{className:"search-input",attrs:{id:e.id,type:"search",placeholder:e.placeholder,value:e.value,autocomplete:"off"},on:{compositionstart:()=>Ze=!0,compositionend:()=>{Ze=!1,a()},input:()=>a()}});return t("label",{className:"search-field",attrs:{for:e.id}},[c.search("icon"),t("span",{className:"visually-hidden",text:e.placeholder}),r])}function et(e){let a=(r,n)=>t("li",{className:`step-item${e===r?" current":e>r?" done":""}`,attrs:e===r?{"aria-current":"step"}:{}},[t("span",{className:"step-number",text:String(r)}),t("span",{className:"step-label",text:n})]);return t("ol",{className:"steps card",attrs:{"aria-label":"\uC8FC\uBBFC \uB4F1\uB85D \uB2E8\uACC4"}},[a(1,"\uC790\uB8CC \uC120\uD0DD"),t("li",{className:"step-arrow",attrs:{"aria-hidden":"true"},text:"\u2192"}),a(2,"\uC7AC\uAD6C\uCD95"),t("li",{className:"step-arrow",attrs:{"aria-hidden":"true"},text:"\u2192"}),a(3,"\uC2DC\uC791 \uC8FC\uBBFC")])}function Fr(e,a){if(e.sources.state==="loading")return I("\uCE90\uB9AD\uD130\xB7\uD398\uB974\uC18C\uB098\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026");if(e.sources.state==="error")return t("div",{},[_(e.sources.message),w("\uB2E4\uC2DC \uBD88\uB7EC\uC624\uAE30",()=>{a.loadSources()},{variant:"secondary"})]);let r=e.query.trim().toLowerCase(),n=e.sources.value.filter(s=>s.kind===e.kindTab).filter(s=>!r||s.name.toLowerCase().includes(r));if(n.length===0)return t("p",{className:"empty",text:r?"\uC774\uB984\uC774 \uB9DE\uB294 \uC790\uB8CC\uAC00 \uC5C6\uC5B4\uC694.":`${ye[e.kindTab]}\uAC00 \uC544\uC9C1 \uC5C6\uC5B4\uC694. \uC5D4\uC9C4\uC758 \uC11C\uC7AC\uC5D0\uC11C \uBA3C\uC800 \uB9CC\uB4E4\uC5B4 \uC8FC\uC138\uC694.`});let i=Math.ceil(n.length/2),o=Math.min(e.sourcePage??0,i-1);return t("div",{className:"source-pages"},[t("ul",{className:"source-list"},n.slice(o*2,o*2+2).map(s=>t("li",{},[t("button",{className:"menu-row source-row",attrs:{type:"button"},disabled:s.residentId!==null,on:{click:()=>{a.chooseSource(s)}}},[t("span",{className:"menu-icon light"},[c.document()]),t("span",{className:"menu-text"},[t("span",{className:"menu-title",text:s.name}),t("span",{className:"menu-detail",text:s.residentId?"\uC774\uBBF8 \uC774 \uC138\uACC4\uC758 \uC8FC\uBBFC\uC774\uC5D0\uC694":s.summary||"\uC124\uBA85 \uC5C6\uC74C"})]),t("span",{className:"menu-chevron"},[s.residentId?c.check():c.chevron()])])]))),i>1?t("div",{className:"resident-pages"},[w("\uC774\uC804",()=>a.setRegisterSourcePage(o-1),{variant:"secondary",disabled:o===0}),t("span",{text:`${o+1} / ${i}`,attrs:{"aria-live":"polite"}}),w("\uB2E4\uC74C",()=>a.setRegisterSourcePage(o+1),{variant:"secondary",disabled:o+1>=i})]):null])}function Dr(e,a){return[S("\uC790\uB8CC \uC120\uD0DD",[t("p",{className:"muted",text:"\uC8FC\uBBFC\uC73C\uB85C \uB9DE\uC774\uD560 \uCE90\uB9AD\uD130\uB098 \uD398\uB974\uC18C\uB098\uB97C \uACE8\uB77C \uC8FC\uC138\uC694. \uC6D0\uBCF8\uC740 \uC77D\uAE30\uB9CC \uD558\uACE0 \uBC14\uAFB8\uC9C0 \uC54A\uC544\uC694."}),t("div",{className:"pill-tabs two",attrs:{role:"tablist","aria-label":"\uC790\uB8CC \uC885\uB958"}},["character","persona"].map(r=>t("button",{className:`pill-tab${e.kindTab===r?" current":""}`,text:ye[r],attrs:{type:"button",role:"tab","aria-selected":e.kindTab===r?"true":"false"},on:{click:()=>a.setRegisterKind(r)}}))),ze({id:"fw-source-search",value:e.query,placeholder:"\uC774\uB984\uC73C\uB85C \uCC3E\uAE30",onSearch:r=>a.setRegisterQuery(r)}),Fr(e,a)],{id:"fw-source-title"})]}function qr(e){if(!e||e.state==="loading")return I("\uC6D0\uB798 \uC124\uC815\uC744 \uC77D\uB294 \uC911\u2026");if(e.state==="error")return _(e.message);let a=e.value;return t("div",{className:"readonly-box"},[t("p",{text:a.summary||"\uC6D0\uBCF8\uC5D0 \uC801\uD78C \uC124\uBA85\uC774 \uC5C6\uC5B4\uC694."})])}function Gr(e,a){if(!a||a.state!=="ready"||!e.content)return null;let r=re(e.content,a.value.talent.talentId),n=a.value.talent.field;return t("div",{className:"talent-card",attrs:{"aria-label":"\uB9DE\uC774\uD558\uBA74 \uC815\uD574\uC9C0\uB294 \uC804\uBB38 \uBD84\uC57C\uC640 \uD2B9\uAE30"}},[t("p",{className:"talent-field"},[pe[n]("icon"),t("strong",{text:`\uC804\uBB38 \uBD84\uC57C \xB7 ${J[n]}`})]),r?t("p",{className:"talent-name"},[t("strong",{text:`\uD2B9\uAE30 \xB7 ${r.name}`}),t("span",{text:r.description})]):null,t("p",{className:"muted",text:"\uC6D0\uB798 \uC124\uC815\uC744 \uBC14\uD0D5\uC73C\uB85C \uC815\uD574\uC838\uC694. \uC8FC\uBBFC\uC744 \uB9DE\uC774\uD558\uBA74 \uBC14\uB00C\uC9C0 \uC54A\uC544\uC694."})])}function _r(e,a,r){let n=t("input",{className:"visually-hidden",attrs:{id:"fw-register-image",type:"file",accept:"image/png,image/webp"},on:{change:()=>{let o=n.files?.[0];if(n.value="",!!o){if(o.size>r){a.notify(`\uD30C\uC77C\uC774 ${Math.round(r/1024/1024)}MiB\uB97C \uB118\uC5B4\uC694. \uB2E4\uB978 \uADF8\uB9BC\uC744 \uACE8\uB77C \uC8FC\uC138\uC694.`,"error");return}a.pickPendingImage(o)}}}}),i=e.pendingImage;return t("div",{className:"image-drop"},[n,t("label",{className:"drop-zone checker",attrs:{for:"fw-register-image"}},[i?t("img",{className:"drop-preview",attrs:{src:i.previewUrl,alt:""}}):c.addImage("icon drop-icon"),t("span",{className:"drop-text"},[t("strong",{text:i?i.file.name:"\uC8FC\uBBFC \uADF8\uB9BC \uC9C1\uC811 \uB4F1\uB85D"}),t("span",{text:i?`${Math.max(1,Math.round(i.file.size/1024))} KB \xB7 \uB4F1\uB85D\uD558\uBA74 WebP\uB85C \uC800\uC7A5\uD574\uC694`:"PNG \xB7 WebP \u2192 WebP \uC800\uC7A5"})])]),i?w("\uACE0\uB978 \uADF8\uB9BC \uBE7C\uAE30",()=>a.clearPendingImage(),{variant:"secondary"}):null])}function Hr(e,a,r){let n=e.selected,i=a.content?.residents.worldSettingMax??200,o=!!a.busy["rebuild-suggestion"],s=!!a.busy[`register:${n.kind}:${n.id}`],l=Object.keys(a.busy).some(b=>b.startsWith("image-upload:")&&a.busy[b]),m=s||l,d=t("span",{className:"counter-text",text:`${e.draft.length} / ${i}`,attrs:{id:"fw-draft-count"}}),p=t("textarea",{className:"textarea",attrs:{id:"fw-world-setting",maxlength:String(i),rows:"4",placeholder:"\uC774 \uC138\uACC4\uC5D0\uC11C \uC5B4\uB5A4 \uC8FC\uBBFC\uC778\uC9C0 \uC801\uC5B4 \uC8FC\uC138\uC694.","aria-describedby":"fw-draft-count"},on:{input:()=>{d.textContent=`${p.value.length} / ${i}`,r.setDraft(p.value),f.disabled=!p.value.trim()}}});p.value=e.draft;let u=e.preview?.state==="ready",h=e.panel??"source",f=w("\uB2E4\uC74C: \uC8FC\uBBFC \uADF8\uB9BC",()=>r.setRegisterPanel("image"),{disabled:!e.draft.trim()});return[t("section",{className:"card selected-source"},[t("button",{className:"menu-row quiet",attrs:{type:"button"},on:{click:()=>r.backToSources()}},[t("span",{className:"menu-icon light"},[c.document()]),t("span",{className:"menu-text"},[t("small",{className:"muted",text:"\uC120\uD0DD\uD55C \uC790\uB8CC"}),t("span",{className:"menu-title",text:`${ye[n.kind]} \xB7 ${n.name}`})]),t("span",{className:"menu-chevron"},[c.chevron()])])]),h==="source"?t("section",{className:"card rebuild",attrs:{"aria-labelledby":"fw-original"}},[t("h2",{className:"section-title doc",text:"\uC6D0\uB798 \uC124\uC815",attrs:{id:"fw-original"}}),qr(e.preview),Gr(a,e.preview),w("\uB2E4\uC74C: \uACF5\uBC29 \uC124\uC815",()=>r.setRegisterPanel("setting"),{disabled:!u})]):null,h==="setting"?t("section",{className:"card rebuild"},[t("label",{className:"section-title",text:"\uACF5\uBC29 \uC138\uACC4 \uC124\uC815",attrs:{for:"fw-world-setting"}}),t("div",{className:"textarea-wrap"},[p,d]),t("div",{className:"rule-actions even"},[t("button",{className:"button",attrs:{type:"button"},on:{click:()=>{p.focus(),p.setSelectionRange(p.value.length,p.value.length)}}},[c.pencil("icon"),t("span",{text:"\uC218\uC815"})]),t("button",{className:"button secondary",attrs:{type:"button"},disabled:o||!u,on:{click:()=>{r.suggestSetting()}}},[c.sparkle("icon"),t("span",{text:o?"\uC81C\uC548 \uBC1B\uB294 \uC911\u2026":"\uB2E4\uC2DC \uC81C\uC548"})])]),t("p",{className:"hint",text:"\uB2E4\uC2DC \uC81C\uC548\uC740 \uC5D4\uC9C4\uC758 \uAE30\uBCF8 \uC5B8\uC5B4 \uBAA8\uB378\uC5D0 \uD55C \uBC88 \uC694\uCCAD\uD574\uC694. \uD655\uC815\uD558\uAE30 \uC804\uC5D0\uB294 \uC800\uC7A5\uB418\uC9C0 \uC54A\uC544\uC694."}),t("div",{className:"rule-actions even"},[w("\uC774\uC804",()=>r.setRegisterPanel("source"),{variant:"secondary"}),f])]):null,h==="image"?S("\uC8FC\uBBFC \uADF8\uB9BC \uC9C1\uC811 \uB4F1\uB85D",[_r(e,r,a.content?.residents.maxImageBytes??20*1024*1024),t("p",{className:"hint center"},[c.info("icon"),"\uC6D0\uBCF8 \uD504\uB85C\uD544\uC740 \uBC14\uB00C\uC9C0 \uC54A\uC544\uC694."])],{id:"fw-register-image-title"}):null,h==="image"?t("button",{className:"button big-action",attrs:{type:"button","data-wide":""},disabled:m||!u,on:{click:()=>{r.confirmRegister(!0,(b,v)=>r.uploadResidentImage(b,v))}}},[c.leaf("icon"),t("span",{text:s?"\uB4F1\uB85D\uD558\uB294 \uC911\u2026":l?"\uADF8\uB9BC \uC800\uC7A5 \uC911\u2026":"\uC7AC\uAD6C\uCD95 \uD655\uC815"}),c.chevron("icon")]):null,h==="image"?t("button",{className:"button secondary",attrs:{type:"button","data-wide":""},disabled:m||!u,on:{click:()=>{r.confirmRegister(!1,async()=>{})}}},[c.clock("icon"),t("span",{text:"\uB098\uC911\uC5D0 \uADF8\uB9BC \uB4F1\uB85D"})]):null,h==="image"?w("\uC774\uC804: \uACF5\uBC29 \uC124\uC815",()=>r.setRegisterPanel("setting"),{variant:"secondary"}):null]}function Ur(e,a,r,n){let i=Object.values(a.state.residents),o=!!r.busy["choose-starter"],s=Math.max(1,i.length),l=Math.min(e.starterPage??0,s-1);return[S("\uC2DC\uC791 \uC8FC\uBBFC",[t("p",{className:"muted",text:"\uACF5\uBC29\uC5D0\uC11C \uD568\uAED8 \uC2DC\uC791\uD560 \uC8FC\uBBFC \uD55C \uBA85\uC744 \uACE8\uB77C \uC8FC\uC138\uC694. \uB2E4\uB978 \uC8FC\uBBFC\uC740 \uCD08\uB300\uB85C \uB9DE\uC774\uD574\uC694."}),t("ul",{className:"starter-list",attrs:{role:"radiogroup","aria-label":"\uC2DC\uC791 \uC8FC\uBBFC"}},i.slice(l,l+1).map(m=>t("li",{},[t("button",{className:`starter-option${e.starterChoice===m.residentId?" chosen":""}`,attrs:{type:"button",role:"radio","aria-checked":e.starterChoice===m.residentId?"true":"false"},on:{click:()=>n.setStarterChoice(m.residentId)}},[t("span",{className:"starter-stage"},[U(m)]),t("strong",{text:m.displayName}),G(m)])]))),s>1?t("div",{className:"resident-pages"},[w("\uC774\uC804",()=>n.setRegisterStarterPage(l-1),{variant:"secondary",disabled:l===0}),t("span",{text:`${l+1} / ${s}`,attrs:{"aria-live":"polite"}}),w("\uB2E4\uC74C",()=>n.setRegisterStarterPage(l+1),{variant:"secondary",disabled:l+1>=s})]):null],{id:"fw-starter-title"}),t("button",{className:"button big-action",attrs:{type:"button","data-wide":""},disabled:o||!e.starterChoice,on:{click:()=>{n.confirmStarter()}}},[c.house("icon"),t("span",{text:o?"\uB9DE\uC774\uD558\uB294 \uC911\u2026":e.starterChoice?`${a.state.residents[e.starterChoice]?.displayName??"\uC120\uD0DD\uD55C \uC8FC\uBBFC"}\uACFC(\uC640) \uC2DC\uC791\uD558\uAE30`:"\uC8FC\uBBFC\uC744 \uACE8\uB77C \uC8FC\uC138\uC694"})]),w("\uC8FC\uBBFC \uB354 \uB4F1\uB85D\uD558\uAE30",()=>n.registerAnother(),{variant:"secondary",attrs:{"data-wide":""}})]}function ua(e,a){let r=e.world?.state==="ready"?e.world.value:null,n=e.register,i;return!r||!n?i=[I("\uC138\uACC4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026")]:n.step===3?i=[et(3),...Ur(n,r,e,a)]:n.step===2&&n.selected?i=[et(2),...Hr(n,e,a)]:i=[et(1),...Dr(n,a)],R(e,a,{top:{kind:"sub",title:"\uC8FC\uBBFC \uB4F1\uB85D",back:{route:"residents",label:"\uC8FC\uBBFC"},resources:!1},backdrop:"wood",body:i,nav:!1})}var fa="ABCDEFGHIJKLMNOPQRSTUVWXYZ";function Kr(e,a){return[...e?.relationStages??[]].reverse().find(n=>a>=n.from)?.label??"\u2013"}function ga(e,a,r){return r.state.residents[_e(e,a.residentId)]??null}function Qr(e,a){let r=a.map((n,i)=>`A\u2013${fa[i+1]??"?"}`).join(" \xB7 ");return S(null,[t("div",{className:"relation-hero"},[E(e,"large"),t("span",{className:"hero-label",text:`\uACF5\uC720 \uC8FC\uBBFC \xB7 ${e.displayName}`}),t("strong",{className:"hero-pairs",text:a.length?r:"\uC544\uC9C1 \uD398\uC5B4\uAC00 \uC5C6\uC5B4\uC694"}),t("p",{className:"hero-note",text:a.length>1?"\uB450 \uAD00\uACC4\uB294 \uAC19\uC740 \uC138\uACC4\uC5D0\uC11C \uC774\uC5B4\uC838\uC694":a.length===1?"\uAC19\uC740 \uC138\uACC4\uC5D0\uC11C \uC774\uC5B4\uC9C0\uB294 \uAD00\uACC4\uC608\uC694":"\uB2E4\uB978 \uC8FC\uBBFC\uACFC \uD398\uC5B4\uB97C \uB9CC\uB4E4 \uC218 \uC788\uC5B4\uC694"})])],{className:"hero-card"})}function Yr(e,a,r,n,i,o){let s=ga(e,r,n),l=i.relationsEditing,m=!!i.busy[`pair-archive:${e.pairId}`];return t("li",{className:"pair-row card"},[t("div",{className:"pair-faces"},[t("span",{className:"pair-letters"},[t("span",{className:"letter",text:"A"}),"\xD7",t("span",{className:"letter",text:fa[a+1]??"?"})]),t("span",{className:"faces"},[E(r),t("span",{className:"times",text:"\xD7"}),E(s)]),t("span",{className:"partner-name",text:s?.displayName??"\uC54C \uC218 \uC5C6\uB294 \uC8FC\uBBFC"})]),t("div",{className:"pair-info"},[t("div",{className:"relation-now"},[t("small",{text:"\uD604\uC7AC \uAD00\uACC4"}),t("strong",{text:Kr(i.content,e.familiarity)})]),t("p",{className:"recent"},[t("span",{className:"recent-label",text:"\uCD5C\uADFC \uC0AC\uAC74"}),t("span",{text:e.lastEvent?.summary??"\uC544\uC9C1 \uC5C6\uC5B4\uC694"})]),l?t("div",{className:"pair-actions"},[w(m?"\uBCF4\uAD00 \uC911\u2026":"\uBCF4\uAD00",()=>{o.archivePair(e.pairId)},{variant:"secondary",disabled:m})]):t("div",{className:"pair-actions"},[H(o,"pair-memory",{className:"outline-button",label:"\uAE30\uC5B5 \uBCF4\uAE30",children:[c.book("icon"),t("span",{text:"\uAE30\uC5B5 \uBCF4\uAE30"})]}),H(o,"pair-guidelines",{className:"outline-button",label:"\uC9C0\uCE68 \uAD00\uB9AC",children:[c.gear("icon"),t("span",{text:"\uC9C0\uCE68 \uAD00\uB9AC"})]})])])])}function Jr(e,a,r,n,i){return e.length===0?null:S("\uBCF4\uAD00\uD55C \uD398\uC5B4",[t("ul",{className:"archived-list"},e.map(o=>{let s=ga(o,a,r),l=!!n.busy[`pair-restore:${o.pairId}`];return t("li",{className:"archived-row"},[E(s),t("span",{className:"archived-name",text:`${a.displayName} \xD7 ${s?.displayName??"?"}`}),w(l?"\uB418\uB3CC\uB9AC\uB294 \uC911\u2026":"\uB418\uB3CC\uB9AC\uAE30",()=>{i.restorePair(o.pairId)},{variant:"secondary",disabled:l})])}))],{id:"fw-archived"})}function Xr(e,a,r,n){let i=new Map(Object.values(a.state.pairs).filter(s=>s.residentIds.includes(e.residentId)).map(s=>[_e(s,e.residentId),s.archived])),o=Object.values(a.state.residents).filter(s=>s.residentId!==e.residentId);return t("div",{className:"sheet-backdrop"},[t("section",{className:"sheet card",attrs:{role:"dialog","aria-modal":"true","aria-labelledby":"fw-pair-add"}},[t("h2",{className:"section-title",text:"\uD398\uC5B4 \uCD94\uAC00",attrs:{id:"fw-pair-add"}}),t("p",{className:"muted",text:`${e.displayName}\uC640(\uACFC) \uC774\uC5B4\uC9C8 \uC8FC\uBBFC\uC744 \uACE8\uB77C \uC8FC\uC138\uC694. \uCE90\uB9AD\uD130\uB4E0 \uD398\uB974\uC18C\uB098\uB4E0 \uAD1C\uCC2E\uC544\uC694. \uC9C0\uB09C \uAE30\uC5B5\uC774 \uC0C8\uB85C \uC0DD\uAE30\uC9C0\uB294 \uC54A\uC544\uC694.`}),o.length===0?t("p",{className:"empty",text:"\uD568\uAED8\uD560 \uB2E4\uB978 \uC8FC\uBBFC\uC774 \uC544\uC9C1 \uC5C6\uC5B4\uC694. \uC8FC\uBBFC \uBD88\uB7EC\uC624\uAE30\uC5D0\uC11C \uBA3C\uC800 \uB4F1\uB85D\uD574 \uC8FC\uC138\uC694."}):t("ul",{className:"candidate-list"},o.map(s=>{let l=i.has(s.residentId),m=Ge(e.residentId,s.residentId);return t("li",{},[t("button",{className:"candidate",attrs:{type:"button"},disabled:l||!!r.busy[m],on:{click:()=>{n.addPair(e.residentId,s.residentId)}}},[E(s),t("span",{className:"candidate-name",text:s.displayName}),G(s),t("span",{className:"candidate-state",text:l?i.get(s.residentId)?"\uBCF4\uAD00\uD568\uC5D0 \uC788\uC5B4\uC694":"\uC774\uBBF8 \uD398\uC5B4":r.busy[m]?"\uB9CC\uB4DC\uB294 \uC911\u2026":"\uACE0\uB974\uAE30"})])])})),w("\uB2EB\uAE30",()=>n.closeSheet(),{variant:"secondary",attrs:{"data-wide":""}})])])}function ba(e,a){let r=e.world?.state==="ready"?e.world.value:null,n=r?r.state.residents[e.focusResidentId??""]??null:null,i={top:{kind:"sub",title:"\uAD00\uACC4",subtitle:"\uAC19\uC740 \uC138\uACC4\uC5D0\uC11C \uC774\uC5B4\uC9C0\uB294 \uAD00\uACC4",back:{route:"residents",label:"\uC8FC\uBBFC"},resources:!1},backdrop:"forest",nav:!0};if(!r||!n)return R(e,a,{...i,body:[I(r?"\uC8FC\uBBFC\uC744 \uACE0\uB978 \uB4A4 \uAD00\uACC4\uB97C \uC5F4\uC5B4 \uC8FC\uC138\uC694.":"\uC138\uACC4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026")]});let o=Object.values(r.state.pairs).filter(l=>l.residentIds.includes(n.residentId)).sort((l,m)=>l.createdAt.localeCompare(m.createdAt)),s=o.filter(l=>!l.archived);return R(e,a,{...i,body:[Qr(n,s),t("ul",{className:"pair-list"},s.map((l,m)=>Yr(l,m,n,r,e,a))),t("p",{className:"notice-strip"},[t("span",{className:"bang",text:"!"}),"\uD398\uC5B4 \uC9C0\uC815\uC740 \uC5F0\uC778 \uC120\uC5B8\uC774 \uC544\uB2C8\uC5D0\uC694."]),t("div",{className:"rule-actions"},[t("button",{className:"button wide-main",attrs:{type:"button"},on:{click:()=>a.openSheet({kind:"pair-add",residentId:n.residentId})}},[c.people("icon"),t("span",{text:"\uD398\uC5B4 \uCD94\uAC00"})]),t("button",{className:`button secondary${e.relationsEditing?" pressed":""}`,attrs:{type:"button","aria-pressed":e.relationsEditing?"true":"false"},on:{click:()=>a.toggleRelationsEditing()}},[c.archive("icon"),t("span",{text:e.relationsEditing?"\uBCC0\uACBD \uB05D\uB0B4\uAE30":"\uBCC0\uACBD \xB7 \uBCF4\uAD00"})])]),e.relationsEditing?Jr(o.filter(l=>l.archived),n,r,e,a):null],sheet:e.sheet?.kind==="pair-add"?Xr(n,r,e,a):null})}function ha(e){return`${Math.max(1,Math.round(e/1024)).toLocaleString("ko-KR")} KB`}function tt(e,a,r,n,i,o,s){let l=`fw-placement-${e}`,m=t("span",{className:"slider-value",text:s(n)}),d=t("input",{className:"slider",attrs:{id:l,type:"range",min:String(i.min),max:String(i.max),step:"1",value:String(n),"aria-valuetext":s(n)},on:{input:()=>m.textContent=s(Number(d.value)),change:()=>o.setPlacementDraft({[e]:Number(d.value)})}});return t("div",{className:"setting-row slider-row"},[a("icon"),t("label",{className:"setting-label",text:r,attrs:{for:l}}),d,m])}function Zr(e,a,r){let n=!!a.busy[`image-restore:${e.residentId}`],i=o=>t("li",{className:"history-item"},[t("span",{className:"history-thumb checker"},[t("img",{attrs:{src:o.url,alt:""}})]),t("span",{className:"menu-text"},[t("span",{className:"menu-title",text:o.fileName||"\uC774\uC804 \uADF8\uB9BC"}),t("span",{className:"menu-detail",text:`${o.width} \xD7 ${o.height} \xB7 ${ha(o.bytes)}`})]),w(n?"\uB418\uB3CC\uB9AC\uB294 \uC911\u2026":"\uC774 \uADF8\uB9BC\uC73C\uB85C",()=>{r.restoreResidentImage(e.residentId,o.reference)},{disabled:n})]);return t("div",{className:"sheet-backdrop"},[t("section",{className:"sheet card",attrs:{role:"dialog","aria-modal":"true","aria-labelledby":"fw-image-history"}},[t("h2",{className:"section-title",text:"\uC774\uC804 \uADF8\uB9BC",attrs:{id:"fw-image-history"}}),e.image.history.length?t("ul",{className:"history-list"},e.image.history.map(i)):t("p",{className:"empty",text:"\uB418\uB3CC\uB9B4 \uC774\uC804 \uADF8\uB9BC\uC774 \uC5C6\uC5B4\uC694."}),t("p",{className:"hint",text:"\uCD5C\uADFC 3\uC7A5\uAE4C\uC9C0 \uBCF4\uAD00\uD574\uC694. \uC9C0\uB09C \uC774\uC57C\uAE30 \uB2E4\uC2DC\uBCF4\uAE30\uC5D0\uB3C4 \uC9C0\uAE08 \uADF8\uB9BC\uC774 \uC4F0\uC5EC\uC694."}),w("\uB2EB\uAE30",()=>r.closeSheet(),{variant:"secondary",attrs:{"data-wide":""}})])])}function en(e,a,r){let n=a.content?.residents.placement,i=a.placementDraft??e.image.placement,o=e.image.current,s=!!a.busy[`image-upload:${e.residentId}`],l=!!a.busy[`placement:${e.residentId}`],m=JSON.stringify(i)!==JSON.stringify(e.image.placement),d=t("input",{className:"visually-hidden",attrs:{id:"fw-image-file",type:"file",accept:"image/png,image/webp"},disabled:s,on:{change:()=>{let u=d.files?.[0];d.value="",u&&r.uploadResidentImage(e.residentId,u)}}}),p=u=>u>0?`+${u}`:String(u);return[t("section",{className:"card image-card"},[t("p",{className:"target-ribbon"},[t("span",{className:"muted",text:"\uB300\uC0C1"}),c.leaf("icon"),t("strong",{text:e.displayName})]),t("div",{className:"image-stage checker"},[U(e,{placement:i,marker:!0})]),t("div",{className:"file-facts"},o?[t("strong",{text:o.fileName||"resident.webp"}),t("span",{text:`${o.width} \xD7 ${o.height} / ${ha(o.bytes)}`})]:[t("strong",{text:"\uC544\uC9C1 \uADF8\uB9BC\uC774 \uC5C6\uC5B4\uC694"}),t("span",{className:"muted",text:"\uADF8\uB9BC\uC774 \uC5C6\uC5B4\uB3C4 \uBAA8\uB4E0 \uAE30\uB2A5\uC744 \uC4F8 \uC218 \uC788\uC5B4\uC694"})]),d,t("label",{className:`button big-action file-button${s?" busy":""}`,attrs:{for:"fw-image-file","data-wide":"","aria-disabled":s?"true":"false"}},[t("span",{text:s?"WebP\uB85C \uC800\uC7A5\uD558\uB294 \uC911\u2026":o?"\uD30C\uC77C \uC120\uD0DD \xB7 \uAD50\uCCB4":"\uD30C\uC77C \uC120\uD0DD"})]),t("ul",{className:"rules"},[t("li",{text:"PNG \xB7 \uC815\uC801 WebP \uC5C5\uB85C\uB4DC (20MiB \xB7 4096px\uAE4C\uC9C0)"}),t("li",{text:"\uD22C\uBA85\uB3C4 \uC720\uC9C0 \xB7 WebP \uD488\uC9C8 95 \uC800\uC7A5"}),t("li",{text:"PNG \uC6D0\uBCF8\uC740 \uB530\uB85C \uBCF4\uAD00\uD558\uC9C0 \uC54A\uC544\uC694."})]),n?t("div",{className:"setting-block sliders"},[tt("scale",c.zoom,"\uADF8\uB9BC \uD06C\uAE30",i.scale,n.scale,r,u=>`${u}%`),tt("offsetX",c.arrows,"\uC88C\uC6B0 \uC704\uCE58",i.offsetX,n.offsetX,r,p),tt("markerHeight",c.updown,"\uAE30\uD638 \uB192\uC774",i.markerHeight,n.markerHeight,r,p)]):null,t("button",{className:"button big-action",attrs:{type:"button","data-wide":""},disabled:l||!m,on:{click:()=>{r.applyPlacement(e.residentId)}}},[t("span",{text:l?"\uC801\uC6A9\uD558\uB294 \uC911\u2026":m?"\uC801\uC6A9":"\uC801\uC6A9\uB428"})]),t("div",{className:"rule-actions even"},[t("button",{className:"button secondary",attrs:{type:"button"},on:{click:()=>r.resetPlacementDraft()}},[c.restore("icon"),t("span",{text:"\uAE30\uBCF8 \uBC30\uCE58"})]),t("button",{className:"button secondary",attrs:{type:"button"},disabled:e.image.history.length===0,on:{click:()=>r.openSheet({kind:"image-history",residentId:e.residentId})}},[c.image("icon"),t("span",{text:`\uC774\uC804 \uADF8\uB9BC${e.image.history.length?` ${e.image.history.length}`:""}`})])])])]}function wa(e,a){let r=e.world?.state==="ready"?e.world.value:null,n=r?r.state.residents[e.focusResidentId??""]??null:null;return R(e,a,{top:{kind:"sub",title:"\uC8FC\uBBFC \uADF8\uB9BC",back:{route:"residents",label:"\uC8FC\uBBFC"},resources:!1},backdrop:"wood",body:n?en(n,e,a):[I(r?"\uC8FC\uBBFC\uC744 \uACE0\uB978 \uB4A4 \uC8FC\uBBFC \uADF8\uB9BC\uC744 \uC5F4\uC5B4 \uC8FC\uC138\uC694.":"\uC138\uACC4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026")],nav:!0,sheet:n&&e.sheet?.kind==="image-history"?Zr(n,e,a):null})}function va(e,a,r,n){let i=a.state.residents[n],o=e.content;if(!i||!o)return null;let s=re(o,i.talentId),l=o.facilities.find(m=>m.field===i.field);return D("fw-field",`${i.displayName}\uC758 \uC804\uBB38 \uBD84\uC57C \xB7 \uD2B9\uAE30`,[t("div",{className:"talent-card"},[t("p",{className:"talent-field"},[pe[i.field]("icon"),t("strong",{text:`${J[i.field]} \uBD84\uC57C`}),t("span",{className:"muted",text:` \xB7 ${l?.name??""}`})]),t("p",{className:"muted",text:`${l?.name??"\uAC19\uC740 \uBD84\uC57C \uC2DC\uC124"}\uC5D0 \uBC30\uCE58\uD558\uBA74 \uCC98\uB9AC \uC18D\uB3C4\uAC00 \uBE68\uB77C\uC838\uC694: \uAE30\uBCF8 ${V(te(o,0))} \u2192 \uC9C0\uAE08 ${V(te(o,i.breakthrough))} (\uB3CC\uD30C ${i.breakthrough}/${o.crew.maxBreakthrough}).`}),s?t("p",{className:"talent-name"},[t("strong",{text:`\uD2B9\uAE30 \xB7 ${s.name}`}),t("span",{text:s.description})]):null]),t("p",{className:"hint",text:"\uC804\uBB38 \uBD84\uC57C\uC640 \uD2B9\uAE30\uB294 \uC8FC\uBBFC\uC744 \uB9DE\uC774\uD560 \uB54C \uC6D0\uB798 \uC124\uC815\uC744 \uBC14\uD0D5\uC73C\uB85C \uC815\uD574\uC84C\uC5B4\uC694. \uC6D0\uBCF8 \uCE74\uB4DC\uB294 \uBC14\uB00C\uC9C0 \uC54A\uC544\uC694."}),w("\uB2EB\uAE30",()=>r.closeSheet(),{variant:"secondary",attrs:{"data-wide":""}})])}var tn={registered:"\uB4F1\uB85D",setting:"\uC138\uACC4 \uC124\uC815 \uC218\uC815",name:"\uC774\uB984 \uC218\uC815",recruited:"\uC601\uC785",image:"\uADF8\uB9BC \uB4F1\uB85D",image_restored:"\uC774\uC804 \uADF8\uB9BC\uC73C\uB85C",image_history_cleared:"\uADF8\uB9BC \uC774\uB825 \uC815\uB9AC",placement:"\uBC30\uCE58 \uBCC0\uACBD"};function ya(e){let a=new Date(e);return Number.isNaN(a.getTime())?e:new Intl.DateTimeFormat("ko-KR",{dateStyle:"medium",timeStyle:"short"}).format(a)}function at(e,a){return a?t("div",{className:"source-field"},[t("strong",{text:e}),t("p",{text:a})]):null}function an(e){return t("li",{className:"change-row"},[t("span",{className:"change-kind",text:tn[e.kind]??e.kind}),t("span",{className:"change-detail",text:e.detail}),t("time",{className:"change-time",text:ya(e.at),attrs:{datetime:e.at}})])}function xa(e,a,r,n){let i=e.state.residents[n];if(!i)return null;let o=a.content?.residents.worldSettingMax??200,s=!!a.busy[`resident-setting:${n}`],l=a.sheet?.kind==="profile"&&a.sheet.residentId===n?a.sheet:null,m=l?.draft??i.worldSetting,d=t("span",{className:"counter-text",text:`${m.length} / ${o}`}),p=t("textarea",{className:"textarea",attrs:{id:"fw-profile-setting",maxlength:String(o),rows:"4","aria-describedby":"fw-profile-count"},on:{input:()=>{d.textContent=`${p.value.length} / ${o}`,r.rememberProfile({draft:p.value})}}});p.value=m,d.id="fw-profile-count";let{source:u}=i,h=t("div",{className:"compare-box source"},[t("h3",{className:"compare-title"},[c.document("icon"),"\uC6D0\uB798 \uC124\uC815"]),t("p",{className:"muted",text:`${u.name} \xB7 ${ya(u.takenAt)}\uC5D0 \uC77D\uC74C \xB7 \uC6D0\uBCF8\uC740 \uBC14\uB00C\uC9C0 \uC54A\uC544\uC694`}),at("\uC124\uBA85",u.description),at("\uC131\uACA9",u.personality),at("\uC0C1\uD669",u.scenario),!u.description&&!u.personality&&!u.scenario?t("p",{className:"muted",text:"\uC6D0\uBCF8\uC5D0 \uC801\uD78C \uC124\uBA85\uC774 \uC5C6\uC5B4\uC694."}):null]),f=t("div",{className:"profile-panel"},[t("form",{className:"compare-box world",on:{submit:M=>{M.preventDefault(),p.value.trim()&&p.value!==i.worldSetting&&r.updateWorldSetting(n,p.value)}}},[t("label",{className:"compare-title",attrs:{for:"fw-profile-setting"}},[c.leaf("icon"),"\uACF5\uBC29 \uC138\uACC4 \uC124\uC815"]),p,d,t("button",{className:"button small",text:s?"\uC800\uC7A5 \uC911\u2026":"\uC218\uC815 \uC800\uC7A5",attrs:{type:"submit"},disabled:s})])]),b=t("div",{className:"profile-panel"},[h]),v=t("ol",{className:"change-list"}),$=Math.max(1,Math.ceil(i.changes.length/2)),A=Math.min(l?.historyPage??0,$-1),L=t("span",{attrs:{"aria-live":"polite"}}),X=w("\uC774\uC804",()=>q(A-1),{variant:"secondary"}),F=w("\uB2E4\uC74C",()=>q(A+1),{variant:"secondary"});function q(M){A=Math.max(0,Math.min($-1,M)),r.rememberProfile({historyPage:A}),v.replaceChildren(...i.changes.slice(A*2,A*2+2).map(an)),L.textContent=`${A+1} / ${$}`,X.disabled=A===0,F.disabled=A===$-1}q(A);let g=t("div",{className:"profile-panel"},[t("h3",{className:"subhead",text:"\uBCC0\uACBD \uC774\uB825"}),i.changes.length?v:t("p",{className:"muted",text:"\uC544\uC9C1 \uBCC0\uACBD \uC774\uB825\uC774 \uC5C6\uC5B4\uC694."}),$>1?t("div",{className:"resident-pages"},[X,L,F]):null]),x=[f,b,g],k=["\uACF5\uBC29 \uC124\uC815","\uC6D0\uB798 \uC124\uC815","\uBCC0\uACBD \uC774\uB825"].map((M,K)=>t("button",{className:"profile-tab",text:M,attrs:{type:"button","aria-pressed":K===0?"true":"false"},on:{click:()=>{r.rememberProfile({panel:K}),C(K)}}}));function C(M){x.forEach((K,ne)=>K.hidden=ne!==M),k.forEach((K,ne)=>K.setAttribute("aria-pressed",ne===M?"true":"false"))}return C(l?.panel??0),t("div",{className:"sheet-backdrop"},[t("section",{className:"sheet card",attrs:{role:"dialog","aria-modal":"true","aria-labelledby":"fw-profile"}},[t("div",{className:"sheet-head"},[t("h2",{className:"section-title",text:`${i.displayName} \uD504\uB85C\uD544`,attrs:{id:"fw-profile"}}),G(i),w("\uB2EB\uAE30",()=>r.closeSheet(),{variant:"secondary"})]),t("div",{className:"profile-tabs",attrs:{"aria-label":"\uD504\uB85C\uD544 \uB0B4\uC6A9 \uC120\uD0DD"}},k),...x])])}var rn=[{id:"all",label:"\uC804\uCCB4"},{id:"character",label:"\uCE90\uB9AD\uD130"},{id:"persona",label:"\uD398\uB974\uC18C\uB098"}],Ee=[{id:"all",label:"\uBAA8\uB450"},{id:"recruited",label:"\uC601\uC785\uD55C \uC8FC\uBBFC"},{id:"waiting",label:"\uCD08\uB300 \uB300\uAE30"}];function nn(e,a){let r=Ee[(Ee.findIndex(i=>i.id===e.filter)+1)%Ee.length],n=Ee.find(i=>i.id===e.filter);return t("div",{className:"search-bar"},[ze({id:"fw-resident-search",value:e.query,placeholder:"\uC774\uB984\uC73C\uB85C \uCC3E\uAE30",onSearch:i=>a.setResidentsQuery(i)}),t("button",{className:`icon-button filter${e.filter==="all"?"":" active"}`,attrs:{type:"button","aria-label":`\uBCF4\uAE30: ${n.label} (\uB204\uB974\uBA74 ${r.label})`},on:{click:()=>a.setResidentsFilter(r.id)}},[c.filter()]),e.filter==="all"?null:t("span",{className:"filter-chip",text:n.label})])}function on(e,a){return t("div",{className:"pill-tabs",attrs:{role:"tablist","aria-label":"\uC8FC\uBBFC \uC885\uB958"}},rn.map(r=>t("button",{className:`pill-tab${e.tab===r.id?" current":""}`,text:r.label,attrs:{type:"button",role:"tab","aria-selected":e.tab===r.id?"true":"false"},on:{click:()=>a.setResidentsTab(r.id)}})))}function sn(e,a){let r=J[e.field];return t("button",{className:"tag field",attrs:{type:"button","aria-label":`${e.displayName} \uC804\uBB38 \uBD84\uC57C ${r} \u2014 \uD2B9\uAE30 \uBCF4\uAE30`},on:{click:()=>a.openSheet({kind:"field",residentId:e.residentId})}},[pe[e.field]("icon tiny"),t("span",{text:r})])}function ln(e,a){return t("li",{className:"resident-list-item"},[t("button",{className:"resident-list-open",attrs:{type:"button","aria-label":`${e.displayName} \uC790\uC138\uD788 \uBCF4\uAE30`},on:{click:()=>a.selectResident(e.residentId)}},[E(e),t("span",{className:"resident-list-copy"},[t("strong",{text:e.displayName}),t("span",{text:`${J[e.field]} \xB7 ${e.recruited?"\uC601\uC785 \uC644\uB8CC":"\uCD08\uB300 \uB300\uAE30"}`})]),c.chevron("icon")])])}function rt(e,a,r){return t("button",{className:"detail-action",attrs:{type:"button"},on:{click:r}},[e("icon"),t("span",{text:a})])}function dn(e,a,r){let n=r?.crew.maxBreakthrough??5,i=r?te(r,0):0,o=r?te(r,e.breakthrough):0,s=re(r,e.talentId),l=Object.entries(a.state.production.facilities).find(([,p])=>p.residentId===e.residentId)?.[0],m=r?.facilities.find(p=>p.id===l),d=e.recruited?m?m.field===e.field?`${m.name}\uC5D0\uC11C \uCC98\uB9AC \uC18D\uB3C4 +${V(o)}`:`${m.name}\uC5D0 \uC788\uC9C0\uB9CC \uBD84\uC57C\uAC00 \uB2EC\uB77C \uD6A8\uACFC\uAC00 \uC5C6\uC5B4\uC694.`:"\uC544\uC9C1 \uBC30\uCE58\uD558\uC9C0 \uC54A\uC558\uC5B4\uC694. \uACF5\uBC29 \uC791\uC5C5 \u2192 \uBC30\uCE58 \uBCC0\uACBD.":"\uCD08\uB300\uD558\uBA74 \uC2DC\uC124\uC5D0 \uBC30\uCE58\uD560 \uC218 \uC788\uC5B4\uC694.";return t("div",{className:"passive-block"},[t("p",{className:"passive"},[c.leaf("icon tiny"),t("strong",{text:"\uD328\uC2DC\uBE0C"}),` ${J[e.field]} \uC2DC\uC124 \uCC98\uB9AC \uC18D\uB3C4`]),s?t("p",{className:"talent-line"},[c.sparkle("icon tiny"),t("strong",{text:`\uD2B9\uAE30 ${s.name}`}),` ${s.description}`]):null,t("p",{className:"muted",text:`\uAE30\uBCF8 \uD6A8\uACFC ${V(i)} \u2192 \uD604\uC7AC ${V(o)} \xB7 ${d}`}),t("p",{className:"breakthrough"},[t("span",{text:`\uB3CC\uD30C ${e.breakthrough}/${n}`}),t("span",{className:"leaf-pips",attrs:{"aria-hidden":"true"}},Array.from({length:n},(p,u)=>t("span",{className:`pip${u<e.breakthrough?" on":""}`})))])])}function cn(e,a,r,n){return S(null,[t("div",{className:"resident-detail"},[t("span",{className:"detail-stage"},[U(e)]),t("div",{className:"detail-info"},[t("strong",{className:"detail-name",text:e.displayName}),t("span",{className:"tag-row"},[G(e),sn(e,n)]),dn(e,a,r)])]),t("div",{className:"detail-actions"},[rt(c.image,"\uC8FC\uBBFC \uADF8\uB9BC",()=>n.openResidentImage(e.residentId)),rt(c.document,"\uD504\uB85C\uD544",()=>n.openSheet({kind:"profile",residentId:e.residentId})),rt(c.heart,"\uAD00\uACC4",()=>n.openRelations(e.residentId))]),e.recruited?null:t("button",{className:"button",text:"\uCD08\uB300\uD558\uB7EC \uAC00\uAE30",attrs:{type:"button"},on:{click:()=>n.navigate("invite")}})],{className:"detail-card"})}function mn(e,a,r){let n=a.residentsView,i=Object.values(e.state.residents),o=At(e.state,n),s=e.state.residents[n.selectedId??""]??null;if(n.detailOpen&&s)return[t("button",{className:"outline-button residents-back",text:"\u2190 \uC8FC\uBBFC \uBAA9\uB85D",attrs:{type:"button"},on:{click:()=>r.showResidentsList()}}),cn(s,e,a.content,r)];let l=2,m=Math.max(1,Math.ceil(o.length/l)),d=Math.min(n.page??0,m-1),p=i.length===0?t("div",{className:"empty-state"},[t("p",{text:"\uC544\uC9C1 \uC8FC\uBBFC\uC774 \uC5C6\uC5B4\uC694."}),t("p",{className:"muted",text:"\uCE90\uB9AD\uD130\uB098 \uD398\uB974\uC18C\uB098\uB97C \uBD88\uB7EC\uC640 \uC774 \uC138\uACC4\uC758 \uC8FC\uBBFC\uC73C\uB85C \uB9DE\uC774\uD574 \uBCF4\uC138\uC694."})]):o.length===0?t("p",{className:"empty",text:"\uC870\uAC74\uC5D0 \uB9DE\uB294 \uC8FC\uBBFC\uC774 \uC5C6\uC5B4\uC694."}):t("ul",{className:"resident-grid"},o.slice(d*l,(d+1)*l).map(u=>ln(u,r)));return[nn(n,r),t("section",{className:"card resident-board",attrs:{"aria-label":"\uC8FC\uBBFC \uBAA9\uB85D"}},[on(n,r),p,m>1?t("div",{className:"resident-pages",attrs:{"aria-label":"\uC8FC\uBBFC \uBAA9\uB85D \uD398\uC774\uC9C0"}},[t("button",{className:"outline-button",text:"\uC774\uC804",attrs:{type:"button"},disabled:d===0,on:{click:()=>r.setResidentsPage(d-1)}}),t("span",{text:`${d+1} / ${m}`,attrs:{"aria-live":"polite"}}),t("button",{className:"outline-button",text:"\uB2E4\uC74C",attrs:{type:"button"},disabled:d+1===m,on:{click:()=>r.setResidentsPage(d+1)}})]):null]),t("button",{className:"button big-action",attrs:{type:"button","data-wide":""},on:{click:()=>r.openRegister(1)}},[c.people("icon"),t("span",{text:"\uC8FC\uBBFC \uBD88\uB7EC\uC624\uAE30"})])]}function ka(e,a){let r=e.world?.state==="ready"?e.world.value:null,n=e.sheet?.kind==="profile"&&r?xa(r,e,a,e.sheet.residentId):e.sheet?.kind==="field"&&r?va(e,r,a,e.sheet.residentId):null;return R(e,a,{top:{kind:"sub",title:"\uC8FC\uBBFC",resources:!1},backdrop:"forest",body:r?mn(r,e,a):[I("\uC138\uACC4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026")],nav:!0,sheet:n})}function nt(e,a,r){return t("div",{className:"preview-row"},[e("icon"),t("span",{text:a}),t("strong",{text:r})])}function We(e,a,r){let n=!!e.busy.restore,i=t("input",{className:"visually-hidden",attrs:{type:"file",accept:"application/json,.json",id:r},disabled:n,on:{change:()=>{let l=i.files?.[0];l&&a.selectRestoreFile(l),i.value=""}}}),o=e.restore,s=o?.summary;return t("div",{className:"restore"},[i,t("label",{className:"menu-row",attrs:{for:r}},[t("span",{className:"menu-icon"},[c.download()]),t("span",{className:"menu-text"},[t("span",{className:"menu-title",text:"\uBC31\uC5C5 \uBD88\uB7EC\uC624\uAE30"}),t("span",{className:"menu-detail",text:o?o.fileName:"\uC0C8 \uC138\uACC4\uB85C \uBCF5\uC6D0"})]),t("span",{className:"menu-chevron"},[c.chevron()])]),t("div",{className:"preview-box",attrs:{"aria-live":"polite"}},[t("p",{className:"preview-head"},[c.eye("icon"),t("strong",{text:"\uBCF5\uC6D0 \uBBF8\uB9AC\uBCF4\uAE30"})]),s?t("div",{className:"preview-rows"},[nt(c.residents,"\uC8FC\uBBFC",`${s.residents}\uBA85`),nt(c.pair,"\uD398\uC5B4",`${s.pairs}\uAC1C`),nt(c.image,"\uADF8\uB9BC",`${s.pictures}\uAC1C`)]):t("p",{className:"muted",text:"\uBC31\uC5C5 \uD30C\uC77C\uC744 \uACE0\uB974\uBA74 \uB2F4\uAE34 \uB0B4\uC6A9\uC744 \uBA3C\uC800 \uBCF4\uC5EC \uB4DC\uB824\uC694."})]),t("button",{className:"button big-action",attrs:{type:"button","data-wide":""},disabled:!s||n,on:{click:()=>{a.confirmRestore()}}},[c.restore("icon"),t("span",{text:n?"\uBCF5\uC6D0\uD558\uB294 \uC911\u2026":"\uC0C8 \uC138\uACC4\uB85C \uBCF5\uC6D0"})]),t("p",{className:"hint center"},[c.info("icon"),"\uD604\uC7AC \uC138\uACC4\uB294 \uB36E\uC5B4\uC4F0\uC9C0 \uC54A\uC544\uC694."])])}function pn(e){let a=new Date(e);if(Number.isNaN(a.getTime()))return"\uC54C \uC218 \uC5C6\uC74C";let r=new Intl.DateTimeFormat("ko-KR",{hour:"2-digit",minute:"2-digit",hour12:!1}).format(a);return a.toDateString()===new Date().toDateString()?`\uC624\uB298 ${r}`:`${new Intl.DateTimeFormat("ko-KR",{month:"long",day:"numeric"}).format(a)} ${r}`}function Sa(e){return e>=1024*1024?`${(e/(1024*1024)).toFixed(1)} MB`:e>=1024?`${(e/1024).toFixed(1)} KB`:`${e} B`}function un(e){let a=e.storage,r;if(!a||a.state==="loading")r=I("\uD655\uC778\uD558\uB294 \uC911\u2026");else if(a.state==="error")r=_(a.message);else{let n=[[c.image,"\uC8FC\uBBFC \uADF8\uB9BC","residentImagesBytes"],[c.landscape,"\uBC30\uACBD","backgroundsBytes"],[c.document,"\uAE30\uB85D","recordsBytes"]],i=Math.max(1,...n.map(([,,o])=>a.value[o]));r=t("div",{className:"usage-rows"},n.map(([o,s,l])=>{let m=a.value[l],d=t("span",{className:"usage-fill"});return d.style.width=m>0?`max(0.9em, ${Math.round(m/i*100)}%)`:"0",t("div",{className:"usage-row"},[o("icon"),t("span",{className:"usage-label",text:s}),t("span",{className:"usage-bar",attrs:{role:"presentation"}},[d]),t("span",{className:"usage-size",text:Sa(m)})])}))}return S("\uC800\uC7A5 \uACF5\uAC04 \uC0AC\uC6A9\uB7C9",[r,t("p",{className:"hint center"},[c.info("icon"),"\uADF8\uB9BC\uC740 WebP\uB85C \uBCF4\uAD00\uD574\uC694."])],{id:"fw-usage"})}function fn(e,a){let r=!!e.busy.backup;return t("button",{className:"menu-row",attrs:{type:"button"},disabled:r,on:{click:()=>{a.downloadBackup()}}},[t("span",{className:"menu-icon"},[c.upload()]),t("span",{className:"menu-text"},[t("span",{className:"menu-title",text:r?"\uBC31\uC5C5 \uB9CC\uB4DC\uB294 \uC911\u2026":"\uBC31\uC5C5 \uB0B4\uBCF4\uB0B4\uAE30"}),t("span",{className:"menu-detail",text:"\uC138\uACC4 \xB7 \uC7AC\uD654 \xB7 \uCC3D\uACE0 \uD3EC\uD568 \xB7 \uBE44\uBC00\uD0A4 \uC81C\uC678"})]),t("span",{className:"menu-chevron"},[c.chevron()])])}function Na(e,a,r,n,i){return t("button",{className:"menu-row quiet",attrs:{type:"button"},on:{click:()=>e.navigate(a)}},[t("span",{className:"menu-icon quiet"},[r()]),t("span",{className:"menu-text"},[t("span",{className:"menu-title",text:n}),t("span",{className:"menu-detail",text:i})]),t("span",{className:"menu-chevron"},[c.chevron()])])}function $a(e,a){let r=e.world?.state==="ready"?e.world.value:null,n=r?[t("section",{className:"card saved",attrs:{"aria-label":"\uC800\uC7A5 \uC0C1\uD0DC"}},[t("p",{className:"saved-title"},[t("span",{className:"check"},[c.check()]),"\uC800\uC7A5 \uC644\uB8CC"]),t("p",{className:"saved-time",text:`\uB9C8\uC9C0\uB9C9 \uC800\uC7A5 ${pn(r.updatedAt)}`})]),un(e),S(null,[fn(e,a),We(e,a,"fw-backup-restore")],{className:"menu"}),S(null,[t("button",{className:"menu-row",attrs:{type:"button"},on:{click:()=>a.openSheet({kind:"history-cleanup"})}},[t("span",{className:"menu-icon light"},[c.image()]),t("span",{className:"menu-text"},[t("span",{className:"menu-title",text:"\uADF8\uB9BC \uC774\uB825 \uC815\uB9AC"}),t("span",{className:"menu-detail",text:"\uB2E4\uB978 \uACF3\uC5D0\uC11C \uC4F0\uB294 \uADF8\uB9BC\uC740 \uC720\uC9C0"})]),t("span",{className:"menu-chevron"},[c.chevron()])]),Na(a,"worlds",c.house,"\uB2E4\uB978 \uC138\uACC4","\uC138\uACC4 \uACE0\uB974\uAE30 \xB7 \uC0C8\uB85C \uB9CC\uB4E4\uAE30"),Na(a,"diagnostics",c.info,"\uC5F0\uACB0 \uC810\uAC80","\uC5D4\uC9C4 \uC5F0\uACB0\uACFC \uADF8\uB9BC \uC800\uC7A5 \uACBD\uB85C \uD655\uC778")],{className:"menu"})]:[I("\uC138\uACC4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026")];return R(e,a,{top:{kind:"sub",title:"\uC800\uC7A5\xB7\uBC31\uC5C5",back:{route:"settings",label:"\uC124\uC815"},resources:!1},backdrop:"wood",body:n,nav:!0,sheet:r&&e.sheet?.kind==="history-cleanup"?gn(r.state,e,a):null})}function gn(e,a,r){let n=Object.values(e.residents).reduce((s,l)=>s+l.image.history.length,0),i=Object.values(e.residents).flatMap(s=>s.image.history).reduce((s,l)=>s+l.bytes,0),o=!!a.busy["image-history-clear"];return t("div",{className:"sheet-backdrop"},[t("section",{className:"sheet card",attrs:{role:"dialog","aria-modal":"true","aria-labelledby":"fw-history-cleanup"}},[t("h2",{className:"section-title",text:"\uADF8\uB9BC \uC774\uB825 \uC815\uB9AC",attrs:{id:"fw-history-cleanup"}}),n?t("p",{text:`\uC8FC\uBBFC\uB4E4\uC758 \uC774\uC804 \uADF8\uB9BC ${n}\uC7A5(${Sa(i)})\uC744 \uC815\uB9AC\uD574\uC694. \uC9C0\uAE08 \uC4F0\uB294 \uADF8\uB9BC\uC740 \uADF8\uB300\uB85C\uC774\uACE0, \uC815\uB9AC\uD55C \uADF8\uB9BC\uC740 '\uC774\uC804 \uADF8\uB9BC'\uC5D0\uC11C \uB418\uB3CC\uB9B4 \uC218 \uC5C6\uC5B4\uC694.`}):t("p",{className:"empty",text:"\uC815\uB9AC\uD560 \uC774\uC804 \uADF8\uB9BC\uC774 \uC5C6\uC5B4\uC694."}),t("p",{className:"hint",text:"\uB2E4\uB978 \uACF3\uC5D0\uC11C \uC4F0\uB294 \uADF8\uB9BC \uD30C\uC77C\uC740 \uAC24\uB7EC\uB9AC\uC5D0 \uADF8\uB300\uB85C \uB0A8\uC544\uC694."}),n?w(o?"\uC815\uB9AC\uD558\uB294 \uC911\u2026":`${n}\uC7A5 \uC815\uB9AC\uD558\uAE30`,()=>{r.clearImageHistory()},{disabled:o,attrs:{"data-wide":""}}):null,w("\uB2EB\uAE30",()=>r.closeSheet(),{variant:"secondary",attrs:{"data-wide":""}})])])}function bn(e,a,r){let n=!!a.busy["rename-nickname"],i=e.state.settings.playerNickname,o=t("input",{className:"input",attrs:{id:"fw-set-nick",maxlength:"24",autocomplete:"off",value:a.settingsNicknameDraft?.worldId===e.worldId?a.settingsNicknameDraft.value:i},on:{input:()=>r.rememberSettingsNickname(e.worldId,o.value)}});return t("form",{className:"setting-row",on:{submit:s=>{s.preventDefault();let l=o.value.trim();l&&l!==i&&r.saveSettingsNickname(e.worldId,o.value)}}},[c.leaf("icon row-leaf"),t("label",{className:"setting-label",text:"\uB2C9\uB124\uC784",attrs:{for:"fw-set-nick"}}),t("span",{className:"setting-field"},[o,t("button",{className:"button small",text:n?"\uC800\uC7A5 \uC911\u2026":"\uC218\uC815",attrs:{type:"submit"},disabled:n})])])}function hn(e){return t("div",{className:"setting-row"},[c.leaf("icon row-leaf"),t("span",{className:"setting-label",text:"\uD604\uC2E4 \uB0A0\uC528"}),t("span",{className:"setting-field"},[t("span",{className:"input readonly"},[c.weather("icon"),t("span",{text:"\uB3C4\uC2DC \uBBF8\uC124\uC815"})]),H(e,"weather",{className:"button small",label:"\uD604\uC2E4 \uB0A0\uC528 \uBCC0\uACBD",children:[t("span",{text:"\uBCC0\uACBD"})]})])])}function wn(e,a){let r=t("input",{className:"slider",attrs:{id:"fw-font-size",type:"range",min:String(Z.min),max:String(Z.max),step:String(Z.step),value:String(e.fontSize),"aria-valuetext":`${e.fontSize}px`},on:{change:()=>a.setFontSize(Number(r.value))}});return t("div",{className:"setting-block"},[t("div",{className:"setting-row slider-row"},[c.leaf("icon row-leaf"),t("label",{className:"setting-label",text:"\uAE00\uC790 \uD06C\uAE30",attrs:{for:"fw-font-size"}}),r,t("span",{className:"slider-value",text:`${e.fontSize}px`})]),t("p",{className:"font-preview",text:"\uC774\uB807\uAC8C \uD45C\uC2DC\uB3FC\uC694."})])}function vn(e,a){let r=[{id:"auto",label:`\uC790\uB3D9 (${vt[Oe(new Date)]})`},{id:"spring",label:"\uBD04"},{id:"summer",label:"\uC5EC\uB984"},{id:"autumn",label:"\uAC00\uC744"},{id:"winter",label:"\uACA8\uC6B8"}];return t("div",{className:"setting-block"},[t("div",{className:"setting-row"},[c.leaf("icon row-leaf"),t("span",{className:"setting-label",text:"\uACC4\uC808",attrs:{id:"fw-season-label"}})]),t("div",{className:"chip-row season-chips",attrs:{role:"group","aria-labelledby":"fw-season-label"}},r.map(n=>t("button",{className:`pill-tab${e.seasonChoice===n.id?" current":""}`,text:n.label,attrs:{type:"button","aria-pressed":e.seasonChoice===n.id?"true":"false"},on:{click:()=>a.setSeasonChoice(n.id)}}))),t("p",{className:"hint",text:"\uC790\uB3D9\uC740 \uC624\uB298 \uB0A0\uC9DC(\uBD81\uBC18\uAD6C)\uB97C \uB530\uB77C\uC694. \uB3C4\uC2DC\uB97C \uC120\uD0DD\uD558\uB294 \uD604\uC2E4 \uB0A0\uC528\uB294 \uC900\uBE44 \uC911\uC774\uC5D0\uC694. \uACC4\uC808\uC740 \uADF8\uB9BC\uB9CC \uBC14\uAFB8\uACE0 \uC0DD\uC0B0 \xB7 \uD310\uB9E4 \xB7 \uC120\uBB3C\uC5D0\uB294 \uC601\uD5A5\uC774 \uC5C6\uC5B4\uC694."})])}function Ca(e,a,r,n,i){return H(e,a,{className:"toggle-row",label:n,children:[t("span",{className:"toggle-icon"},[r("icon")]),t("span",{className:"toggle-text"},[t("strong",{text:n}),t("span",{text:i})]),t("span",{className:"switch off"},[t("span",{className:"knob"})])]})}function je(e,a,r,n){let i=[t("span",{className:"manage-icon"},[a("icon")]),t("span",{className:"manage-title",text:r}),t("span",{className:"menu-chevron"},[c.chevron()])];return"route"in n?t("button",{className:"manage-row",attrs:{type:"button"},on:{click:()=>e.navigate(n.route)}},i):H(e,n.feature,{className:"manage-row",label:r,children:i})}function Ia(e,a){let r=e.world?.state==="ready"?e.world.value:null,n=e.settingsSection??"workshop",o=r?[t("div",{className:"pill-tabs",attrs:{role:"group","aria-label":"\uC124\uC815 \uD56D\uBAA9"}},[["workshop","\uB0B4 \uACF5\uBC29"],["display","\uD45C\uC2DC"],["manage","\uAD00\uB9AC"]].map(([s,l])=>t("button",{className:`pill-tab${n===s?" current":""}`,text:l,attrs:{type:"button","aria-pressed":n===s?"true":"false"},on:{click:()=>a.setSettingsSection(s)}}))),n==="workshop"?S("\uB0B4 \uACF5\uBC29",[bn(r,e,a),hn(a)],{id:"fw-mine"}):null,n==="display"?S("\uD45C\uC2DC",[wn(e,a),vn(e,a),Ca(a,"weather-effects",c.leaf,"\uB0A0\uC528 \uD6A8\uACFC","\uACF5\uBC29 \uBC30\uACBD\uC5D0 \uD604\uC7AC \uB0A0\uC528\uB97C \uBC18\uC601\uD574\uC694."),Ca(a,"auto-read",c.book,"\uC790\uB3D9 \uC77D\uAE30","\uC774\uC57C\uAE30\uB97C \uC790\uB3D9\uC73C\uB85C \uB118\uACA8\uC694.")],{id:"fw-display"}):null,n==="manage"?S("\uAD00\uB9AC",[je(a,c.image,"\uC8FC\uBBFC \uADF8\uB9BC \uAD00\uB9AC",{route:"residents"}),je(a,c.flower,"AI \uC9C0\uCE68 \uAD00\uB9AC",{feature:"ai-guidelines"}),je(a,c.people,"\uAE30\uC5B5 \uAD00\uB9AC",{feature:"memory"}),je(a,c.folder,"\uC800\uC7A5 \xB7 \uBC31\uC5C5",{route:"backup"}),t("div",{className:"note-box"},[c.clock("icon"),t("span",{},[t("strong",{text:"\uBBF8\uC811\uC18D \uB204\uC801 \uC0C1\uD55C 72\uC2DC\uAC04"}),t("span",{text:"72\uC2DC\uAC04\uC774 \uC9C0\uB098\uBA74 \uC77C\uBD80 \uC790\uB3D9 \uC9C4\uD589\uC774 \uBA48\uCDB0\uC694."})])])],{id:"fw-manage"}):null,n==="manage"?t("p",{className:"footnote",text:"\uC790\uB3D9\uD654 \uADDC\uCE59\uC740 \uC791\uC5C5 \uD654\uBA74\uC5D0\uC11C \uBC14\uAFC0 \uC218 \uC788\uC5B4\uC694."}):null]:[I("\uC138\uACC4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026")];return R(e,a,{top:{kind:"sub",title:"\uC124\uC815",back:{route:"home",label:"\uD648"},resources:!1},backdrop:"wood",body:o,nav:!0})}function yn(e,a,r,n,i){let o=0;for(let s of Object.values(e.state.production.facilities))if(!(!s.unlocked||s.mode!=="auto"))for(let l of s.rules){let m=a.recipes.find(d=>d.id===l.recipeId);l.enabled&&m&&Object.keys(m.outputs)[0]===r&&(o=Math.max(o,l.targetStock))}return{floor:Math.max(n,i?0:o,e.state.production.protectedStock[r]??0),target:o}}function Ra(e,a,r,n){let i=new Date().toISOString().slice(0,10),o=a.state.production.sales,l=r.items.filter(m=>(a.state.inventory[m.id]??0)>0||a.state.production.autoSell[m.id]?.enabled).map(m=>{let d=a.state.production.autoSell[m.id]??{enabled:!1,keep:0,dailyMax:10},p=se(`fw-keep-${m.id}`,d.keep,0,999,{label:`${m.name} \uB0A8\uAE38 \uC218\uB7C9`}),u=se(`fw-daily-${m.id}`,d.dailyMax,1,999,{label:`${m.name} \uD558\uB8E8 \uCD5C\uB300`}),h=t("input",{attrs:{type:"checkbox",id:`fw-continuous-${m.id}`}});h.checked=!!d.continuous;let{floor:f,target:b}=yn(a,r,m.id,d.keep,!!(d.continuous&&d.enabled)),v=o.day===i?o.sold[m.id]??0:0,$=!!e.busy[`auto-sell:${m.id}`],A=L=>{n.setAutoSell(m.id,{enabled:L,keep:p.read(),dailyMax:u.read(),continuous:h.checked})};return t("li",{className:`auto-sell-row${d.enabled?" on":""}`},[t("div",{className:"auto-sell-head"},[j(m.id),t("span",{className:"protect-name"},[t("strong",{text:m.name}),t("small",{className:"muted",text:`\uBCF4\uC720 ${a.state.inventory[m.id]??0} \xB7 1\uAC1C ${m.sellPrice} G \xB7 \uC624\uB298 \uD310\uB9E4 ${v}`})]),t("span",{className:`switch ${d.enabled?"on":"off"}`},[t("span",{className:"knob"}),t("span",{className:"switch-label",text:d.enabled?"\uCF1C\uC9D0":"\uAEBC\uC9D0"})])]),t("div",{className:"auto-sell-fields"},[t("label",{className:"field-label",text:"\uD310\uB9E4 \uD6C4 \uB0A8\uAE38 \uC218\uB7C9",attrs:{for:`fw-keep-${m.id}`}}),p.node,t("label",{className:"field-label",text:"\uD558\uB8E8 \uCD5C\uB300 \uD310\uB9E4\uB7C9",attrs:{for:`fw-daily-${m.id}`}}),u.node]),t("label",{attrs:{for:`fw-continuous-${m.id}`}},[h," \uD310\uB9E4\uD560 \uB9CC\uD07C \uACC4\uC18D \uC0DD\uC0B0\uD558\uAE30"]),t("p",{className:"hint",text:d.enabled&&d.continuous?`\uD604\uC7AC \uD310\uB9E4 \uC2DC ${f}\uAC1C \uC774\uC0C1 \uB0A8\uACA8\uC694. \uD310\uB9E4 \uD55C\uB3C4\uC5D0 \uB3C4\uB2EC\uD558\uBA74 \uC77C\uBC18 \uC0DD\uC0B0 \uBAA9\uD45C ${b}\uAC1C\uB97C \uB530\uB985\uB2C8\uB2E4.`:`\uD604\uC7AC ${f}\uAC1C \uC774\uC0C1 \uB0A8\uACA8\uC694 (\uBCF4\uAD00\uB7C9 \xB7 \uC0DD\uC0B0 \uBAA9\uD45C ${b} \xB7 \uBCF4\uD638 \uC7AC\uACE0 \uC911 \uAC00\uC7A5 \uD070 \uAC12).`}),t("div",{className:"row-actions"},[w($?"\uC800\uC7A5 \uC911\u2026":d.enabled?"\uC124\uC815 \uC800\uC7A5":"\uCF1C\uAE30",()=>A(!0),{disabled:$}),d.enabled?w("\uB044\uAE30",()=>A(!1),{variant:"secondary",disabled:$}):null])])});return D("fw-auto-sell","\uC790\uB3D9 \uD310\uB9E4",[t("p",{className:"muted",text:"\uCF20 \uD488\uBAA9\uC744 \uD558\uB8E8(UTC \uAE30\uC900) \uD310\uB9E4 \uD55C\uB3C4\uAE4C\uC9C0 \uD314\uC544\uC694. \uACC4\uC18D \uC0DD\uC0B0\uC744 \uC120\uD0DD\uD558\uBA74 \uB0A8\uAE38 \uC218\uB7C9\uACFC \uBCF4\uD638 \uC7AC\uACE0\uB97C \uC9C0\uD0A4\uBA70 \uD310\uB9E4\uD560 \uB9CC\uD07C \uB9CC\uB4E4\uC5B4\uC694."}),l.length?t("ul",{className:"protect-list"},l):t("p",{className:"empty",text:"\uCC3D\uACE0\uAC00 \uBE44\uC5B4 \uC788\uC5B4\uC694."}),w("\uB2EB\uAE30",()=>n.closeSheet(),{variant:"secondary",attrs:{"data-wide":""}})])}function Ma(e,a){let r=new Map(a?.items.map((n,i)=>[n.id,i]));return Object.entries(e.state.inventory).filter(([,n])=>n>0).sort(([n],[i])=>(r.get(n)??999)-(r.get(i)??999)).map(([n,i])=>({itemId:n,amount:i,name:O(a,n)}))}function xn(e,a){let r=(n,i,o)=>t("button",{className:`big-tab${e.facilitiesTab===n?" current":""}`,attrs:{type:"button",role:"tab","aria-selected":e.facilitiesTab===n?"true":"false"},on:{click:()=>a.setFacilitiesTab(n)}},[o,t("span",{text:i})]);return t("div",{className:"big-tabs",attrs:{role:"tablist","aria-label":"\uC2DC\uC124\uACFC \uCC3D\uACE0"}},[r("facilities","\uC2DC\uC124",c.house("icon big")),r("protection","\uC7AC\uACE0 \uBCF4\uD638",c.lock("icon big")),r("storage","\uCC3D\uACE0",c.box("icon big"))])}function kn(e,a,r,n){let i=e.work.facilityId,o=r.state.production.facilities[i],s=Y(a,i),l=a.production.maxLevel,m=o.level>=l,d=m?null:a.production.upgradeCosts[o.level-1],p=!!e.busy[`upgrade:${i}:${o.level}`],u=d!==null&&r.state.wallet.gold<d,h=!o.unlocked,f=ae(a,r.state,i);return S(null,[t("div",{className:"chip-row",attrs:{role:"group","aria-label":"\uC2DC\uC124 \uACE0\uB974\uAE30"}},a.facilities.map(b=>t("button",{className:`pill-tab${b.id===i?" current":""}`,attrs:{type:"button","aria-pressed":b.id===i?"true":"false","aria-label":r.state.production.facilities[b.id]?.unlocked?b.name:`${b.name} (\uD574\uAE08 \uC804)`},on:{click:()=>n.selectFacility(b.id)}},[t("span",{text:b.name}),r.state.production.facilities[b.id]?.unlocked?null:c.lock("icon tiny")]))),t("div",{className:"facility"},[t("span",{className:`facility-picture${h?" closed":""}`},[ge(i,"huge")]),t("div",{className:"facility-info"},[t("strong",{className:"facility-name",text:s?.name??i}),t("span",{className:"facility-level"},[`Lv. ${o.level}`,m?null:t("span",{className:"level-next",text:` \u2192 Lv. ${o.level+1}`})]),t("div",{className:"effect-row"},[t("span",{text:"\uCC98\uB9AC \uC18D\uB3C4"}),t("span",{},[`+${we(a,o.level)}%`,m?null:t("span",{className:"level-next",text:` \u2192 +${we(a,o.level+1)}%`})])]),t("div",{className:"effect-row"},[t("span",{text:"\uC791\uC5C5 \uBC29\uC2DD"}),t("span",{text:h?"\uD574\uAE08 \uC804":o.mode==="auto"?"\uC790\uB3D9 \uC6B4\uC601":"\uC9C0\uC815 \uD69F\uC218"})]),t("div",{className:"effect-row"},[t("span",{text:"\uC8FC\uBBFC \uD6A8\uACFC"}),t("span",{text:`+${V(f.total)}${f.resident?` (${f.resident.displayName})`:""}`})]),t("p",{className:"muted",text:s?.description??""}),h?t("p",{className:"hint",text:"\uACF5\uBC29 \uC791\uC5C5\uC5D0\uC11C \uD574\uAE08 \uC870\uAC74\uC744 \uCC44\uC6B0\uACE0 \uC2DC\uC124\uC744 \uC5F4\uBA74 \uAC15\uD654\uD560 \uC218 \uC788\uC5B4\uC694."}):null,t("button",{className:"gold-button",attrs:{type:"button"},disabled:h||m||p||u,on:{click:()=>{n.upgradeFacility(i,o.level)}}},m?[t("span",{text:"\uCD5C\uACE0 \uB2E8\uACC4"})]:[t("span",{className:"coin"}),t("span",{text:p?"\uAC15\uD654\uD558\uB294 \uC911\u2026":`${d.toLocaleString("ko-KR")} G \xB7 \uAC15\uD654`})]),u?t("p",{className:"hint",text:`\uACE8\uB4DC\uAC00 ${(d-r.state.wallet.gold).toLocaleString("ko-KR")} G \uBD80\uC871\uD574\uC694.`}):null])])],{className:"facility-card"})}function Nn(e,a){let r=Object.values(e.state.production.autoSell).filter(n=>n.enabled).length;return t("button",{className:"toggle-row",attrs:{type:"button","aria-label":`\uC790\uB3D9 \uD310\uB9E4 ${r?`\uCF1C\uC9D0 (${r}\uAC1C \uD488\uBAA9)`:"\uAEBC\uC9D0"} \u2014 \uC124\uC815 \uC5F4\uAE30`},on:{click:()=>a.openSheet({kind:"auto-sell"})}},[t("span",{className:"toggle-icon"},[c.gear("icon")]),t("span",{className:"toggle-text"},[t("strong",{text:r?`\uC790\uB3D9 \uD310\uB9E4 \xB7 ${r}\uAC1C \uD488\uBAA9`:"\uC790\uB3D9 \uD310\uB9E4"}),t("span",{text:"\uBCF4\uD638 \xB7 \uC608\uC57D \uC7AC\uACE0\uB294 \uC0AC\uC6A9\uD558\uC9C0 \uC54A\uC544\uC694."})]),t("span",{className:`switch ${r?"on":"off"}`},[t("span",{className:"knob"}),t("span",{className:"switch-label",text:r?"\uCF1C\uC9D0":"\uAEBC\uC9D0"})])])}function Aa(e,a,r){let n=Math.max(1,Math.ceil(a/3));return n===1?null:t("div",{className:"resident-pages",attrs:{"aria-label":"\uC7AC\uACE0 \uD398\uC774\uC9C0"}},[w("\uC774\uC804",()=>r.setInventoryPage(e-1),{disabled:e===0,variant:"secondary"}),t("span",{text:`${e+1} / ${n}`,attrs:{"aria-live":"polite"}}),w("\uB2E4\uC74C",()=>r.setInventoryPage(e+1),{disabled:e+1>=n,variant:"secondary"})])}function Sn(e,a,r,n){let i=Ma(a,r),o=Math.min(e.work.inventoryPage??0,Math.max(0,Math.ceil(i.length/3)-1)),s=a.state.production.protectedStock;return S(null,[t("div",{className:"card-head"},[t("div",{},[t("h2",{className:"section-title",text:"\uC7AC\uACE0 \uBCF4\uD638",attrs:{id:"fw-protect"}}),t("p",{className:"muted",text:"\uC9C0\uC815\uD55C \uC218\uB7C9\uC740 \uC81C\uC791\uACFC \uD310\uB9E4\uC5D0 \uC0AC\uC6A9\uD558\uC9C0 \uC54A\uC544\uC694."})]),t("button",{className:"outline-button",attrs:{type:"button"},on:{click:()=>n.openSheet({kind:"protect-edit"})}},[c.pencil("icon"),t("span",{text:"\uD3B8\uC9D1\uD558\uAE30"})])]),i.length===0?t("p",{className:"empty",text:"\uCC3D\uACE0\uAC00 \uBE44\uC5B4 \uC788\uC5B4\uC694."}):t("table",{className:"stock"},[t("thead",{},[t("tr",{},["\uC544\uC774\uD15C","\uBCF4\uC720 \uC218\uB7C9","\uBCF4\uD638 \uC7AC\uACE0","\uC608\uC57D \uC7AC\uACE0","\uC0AC\uC6A9 \uAC00\uB2A5"].map(l=>t("th",{text:l,attrs:{scope:"col"}})))]),t("tbody",{},i.slice(o*3,o*3+3).map(l=>{let m=s[l.itemId]??0;return t("tr",{},[t("th",{attrs:{scope:"row"}},[j(l.itemId),l.name]),t("td",{className:"num",text:l.amount.toLocaleString("ko-KR")}),t("td",{className:`num${m?" protected":""}`,text:m?String(m):"\u2013"}),t("td",{className:"num",text:"\u2013"}),t("td",{className:"num available",text:Math.max(0,l.amount-m).toLocaleString("ko-KR")})])}))]),Aa(o,i.length,n),Nn(a,n)],{id:"fw-protect"})}function $n(e,a,r,n){let i=Ma(a,r),o=Math.min(e.work.inventoryPage??0,Math.max(0,Math.ceil(i.length/3)-1));return S("\uCC3D\uACE0",[i.length===0?t("p",{className:"empty",text:"\uCC3D\uACE0\uAC00 \uBE44\uC5B4 \uC788\uC5B4\uC694."}):t("ul",{className:"storage-grid"},i.slice(o*3,o*3+3).map(s=>t("li",{className:"storage-item"},[j(s.itemId),t("span",{className:"storage-name",text:s.name}),t("strong",{text:s.amount.toLocaleString("ko-KR")}),t("button",{className:"outline-button small",attrs:{type:"button","aria-label":`${s.name} \uD314\uAE30`},on:{click:()=>n.openSheet({kind:"sell",itemId:s.itemId})}},[t("span",{text:"\uD314\uAE30"})])]))),Aa(o,i.length,n)],{id:"fw-storage"})}function Cn(e,a,r,n){let i=r.production.protectedStock,o=e.sheet?.kind==="protect-edit"?e.sheet:null,s=r.items.map(f=>{let b=se(`fw-protect-${f.id}`,o?.drafts?.[f.id]??a.state.production.protectedStock[f.id]??0,i.min,i.max,{onChange:$=>n.rememberProtection({itemId:f.id,amount:$})}),v=!!e.busy[`protect:${f.id}`];return t("li",{className:"protect-row"},[j(f.id),t("span",{className:"protect-name"},[t("strong",{text:f.name}),t("small",{className:"muted",text:`\uBCF4\uC720 ${a.state.inventory[f.id]??0}`})]),b.node,w(v?"\uC800\uC7A5 \uC911\u2026":"\uC800\uC7A5",()=>{n.setProtected(f.id,b.read())},{disabled:v,attrs:{"aria-label":`${f.name} \uBCF4\uD638 \uC218\uB7C9 \uC800\uC7A5`}})])}),l=Math.max(0,Math.min(s.length-1,o?.page??0)),m=t("span",{attrs:{"aria-live":"polite"}}),d=w("\uC774\uC804",()=>h(l-1),{variant:"secondary"}),p=w("\uB2E4\uC74C",()=>h(l+1),{variant:"secondary"}),u=t("select",{className:"input",attrs:{"aria-label":"\uBCF4\uD638\uD560 \uC544\uC774\uD15C"},on:{change:()=>h(Number(u.value))}},r.items.map((f,b)=>t("option",{text:f.name,attrs:{value:String(b)}})));function h(f){l=Math.max(0,Math.min(s.length-1,f)),s.forEach((b,v)=>b.hidden=v!==l),u.value=String(l),m.textContent=s.length?`${l+1} / ${s.length}`:"0 / 0",d.disabled=l===0,p.disabled=l>=s.length-1,n.rememberProtection({page:l})}return h(l),t("div",{className:"sheet-backdrop"},[t("section",{className:"sheet card",attrs:{role:"dialog","aria-modal":"true","aria-labelledby":"fw-protect-edit"}},[t("h2",{className:"section-title",text:"\uC7AC\uACE0 \uBCF4\uD638 \uD3B8\uC9D1",attrs:{id:"fw-protect-edit"}}),t("p",{className:"muted",text:"\uBCF4\uD638\uD55C \uC218\uB7C9\uC740 \uC790\uB3D9 \uC81C\uC791\uACFC \uD310\uB9E4\uC5D0 \uC4F0\uC9C0 \uC54A\uC544\uC694. 0\uC774\uBA74 \uBCF4\uD638\uD558\uC9C0 \uC54A\uC544\uC694."}),u,t("ul",{className:"protect-list"},s),t("div",{className:"resident-pages"},[d,m,p]),w("\uB2EB\uAE30",()=>n.closeSheet(),{variant:"secondary",attrs:{"data-wide":""}})])])}function In(e,a,r,n,i){let o=r.items.find(p=>p.id===i),s=a.state.inventory[i]??0,l=Math.max(0,s-(a.state.production.protectedStock[i]??0)),m=se("fw-sell-amount",Math.min(l,1),l?1:0,l),d=!!e.busy[`sell:${i}`];return t("div",{className:"sheet-backdrop"},[t("section",{className:"sheet card",attrs:{role:"dialog","aria-modal":"true","aria-labelledby":"fw-sell"}},[t("h2",{className:"section-title",text:`${o?.name??i} \uD314\uAE30`,attrs:{id:"fw-sell"}}),t("p",{className:"muted",text:`1\uAC1C ${o?.sellPrice??0} G \xB7 \uD314 \uC218 \uC788\uB294 \uC591 ${l}\uAC1C (\uBCF4\uC720 ${s}\uAC1C, \uBCF4\uD638\uBD84 \uC81C\uC678)`}),l?m.node:t("p",{className:"empty",text:"\uBCF4\uD638\uBD84\uC744 \uBE7C\uBA74 \uD314 \uC218 \uC788\uB294 \uC591\uC774 \uC5C6\uC5B4\uC694."}),l?w(d?"\uD30C\uB294 \uC911\u2026":"\uD314\uAE30",()=>{n.sell(i,m.read())},{disabled:d,attrs:{"data-wide":""}}):null,w("\uB2EB\uAE30",()=>n.closeSheet(),{variant:"secondary",attrs:{"data-wide":""}})])])}function Pa(e,a){let r=e.world?.state==="ready"?e.world.value:null,n=e.content,i=r&&n,o=i&&e.sheet?.kind==="protect-edit"?Cn(e,r,n,a):i&&e.sheet?.kind==="sell"?In(e,r,n,a,e.sheet.itemId):i&&e.sheet?.kind==="auto-sell"?Ra(e,r,n,a):null;return R(e,a,{top:{kind:"sub",title:"\uC2DC\uC124\uACFC \uCC3D\uACE0",back:{route:"work",label:"\uACF5\uBC29 \uC791\uC5C5"},resources:!0},backdrop:"forest",body:i?[xn(e,a),...e.facilitiesTab==="facilities"?[kn(e,n,r,a)]:e.facilitiesTab==="protection"?[Sn(e,r,n,a)]:[$n(e,r,n,a)]]:[I("\uC138\uACC4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026")],nav:!0,sheet:o})}function Ta(e,a,r,n,i){let o=Y(r,i),s=a.state.production.facilities[i]?.residentId??null,l=!!e.busy[`assign:${i}`],m=u=>Object.entries(a.state.production.facilities).find(([,h])=>h.residentId===u)?.[0]??null,d=Object.values(a.state.residents).filter(u=>u.recruited).sort((u,h)=>+(h.field===o?.field)-+(u.field===o?.field)||u.displayName.localeCompare(h.displayName,"ko")),p=ae(r,a.state,i);return D("fw-assign",`${o?.name??"\uC2DC\uC124"} \uBC30\uCE58 \uBCC0\uACBD`,[t("p",{className:"muted",text:`${o?J[o.field]:""} \uBD84\uC57C \uC8FC\uBBFC\uC744 \uB450\uBA74 \uCC98\uB9AC \uC18D\uB3C4\uAC00 \uBE68\uB77C\uC838\uC694. \uC9C0\uAE08 \uC791\uC5C5\uC740 \uC2DC\uC791\uD55C \uC18D\uB3C4 \uADF8\uB300\uB85C \uB05D\uB098\uACE0, \uB2E4\uC74C \uD68C\uCC28\uBD80\uD130 \uC801\uC6A9\uB3FC\uC694. \uD398\uC5B4 \uB450 \uC0AC\uB78C\uC774 \uBAA8\uB450 \uBC30\uCE58\uB418\uBA74 \uBAA8\uB4E0 \uC2DC\uC124 +${V(r.crew.setBonusPerPair)}(\uCD5C\uB300 ${V(r.crew.setBonusMax)}).`}),t("p",{className:"assign-now"},[t("strong",{text:"\uC9C0\uAE08 "}),p.resident?p.resident.displayName:"\uBC30\uCE58\uD55C \uC8FC\uBBFC \uC5C6\uC74C",` \xB7 \uC8FC\uBBFC \uD6A8\uACFC +${V(p.total)}`]),d.length===0?t("p",{className:"empty",text:"\uACF5\uBC29\uC5D0 \uC628 \uC8FC\uBBFC\uC774 \uC5C6\uC5B4\uC694. \uCD08\uB300\uB85C \uC8FC\uBBFC\uC744 \uB9DE\uC774\uD574 \uC8FC\uC138\uC694."}):t("ul",{className:"pick-list"},d.map(u=>{let h=u.field===o?.field,f=m(u.residentId),b=re(r,u.talentId),v=[h?`+${V(te(r,u.breakthrough))}${b?` \xB7 \uD2B9\uAE30 ${b.name}: ${b.description}`:""}`:`${J[u.field]} \uBD84\uC57C\uB77C \uD6A8\uACFC \uC5C6\uC74C`,f&&f!==i?`${Y(r,f)?.name??""}\uC5D0\uC11C \uC62E\uACA8 \uC640\uC694`:""].filter(Boolean).join(" \xB7 ");return t("li",{},[t("button",{className:`pick-row${u.residentId===s?" selected":""}`,attrs:{type:"button","aria-pressed":u.residentId===s?"true":"false"},disabled:l||u.residentId===s,on:{click:()=>{n.assignResident(i,u.residentId)}}},[E(u),t("strong",{text:u.displayName}),G(u),t("small",{className:h?"good":"muted",text:v})])])})),s?w("\uBC30\uCE58 \uD574\uC81C",()=>{n.assignResident(i,null)},{variant:"secondary",disabled:l}):null,w("\uB2EB\uAE30",()=>n.closeSheet(),{variant:"secondary",attrs:{"data-wide":""}})])}function La(e,a,r,n,i){let o=r.state.production.facilities[n],s=a.recipes.filter(g=>g.facilityId===n),l=Bt(a,o.level),m=o.queue.length>=l,d=e.work.queueRecipe[n]??s[0]?.id??"",p=ee(a,d),u=t("p",{className:"hint"}),h=ae(a,r.state,n),f=g=>{let x=p?Object.entries(Re(p,h).inputs):[];u.textContent=x.length?`\uC608\uC0C1 \uC7AC\uB8CC ${x.map(([k,C])=>`${O(a,k)} ${C*g}`).join(" \xB7 ")} \u2014 \uD55C \uD68C\uCC28\uC529 \uC2DC\uC791\uD560 \uB54C \uAEBC\uB0B4\uC694. \uC7AC\uB8CC \uD655\uBCF4\uB97C \uBBF8\uB9AC \uBCF4\uC7A5\uD558\uC9C0 \uC54A\uC544\uC694.`:"\uC7AC\uB8CC \uC5C6\uC774 \uC232\uC5D0\uC11C \uBC14\uB85C \uBAA8\uC544\uC694."},b=a.production.queueCount,v=e.work.queueCounts?.[n]??1,$=se(`fw-queue-count-${n}`,v,b.min,b.max,{label:"\uD69F\uC218",onChange:g=>{f(g),i.rememberQueueCount(n,g)}});f(v);let A=!!e.busy[`queue:${n}`],L=e.work.queueView??(o.queue.length?"list":"add"),X=Math.max(1,Math.ceil(o.queue.length/2)),F=Math.min(e.work.queuePage??0,X-1),q=t("select",{className:"input",attrs:{"aria-label":"\uC81C\uC791\uBC95 \uACE0\uB974\uAE30"},on:{change:()=>i.selectQueueRecipe(n,q.value)}},s.map(g=>t("option",{text:g.name,attrs:{value:g.id}})));return q.value=d,t("div",{className:"plan-block queue"},[t("span",{className:"plan-label"},["\uC9C0\uC815 \uD69F\uC218 \uB300\uAE30\uC5F4 ",t("small",{text:`(${o.queue.length}/${l}\uCE78 \xB7 \uC704\uC5D0\uC11C\uBD80\uD130 \uCC28\uB840\uB85C \uB9CC\uB4E4\uC5B4\uC694)`})]),t("div",{className:"pill-tabs two",attrs:{role:"group","aria-label":"\uB300\uAE30\uC5F4 \uD654\uBA74"}},[t("button",{className:`pill-tab${L==="list"?" current":""}`,text:"\uB300\uAE30\uC5F4 \uBCF4\uAE30",attrs:{type:"button","aria-pressed":L==="list"?"true":"false"},on:{click:()=>i.setQueueView("list")}}),t("button",{className:`pill-tab${L==="add"?" current":""}`,text:"\uC791\uC5C5 \uCD94\uAC00",attrs:{type:"button","aria-pressed":L==="add"?"true":"false"},on:{click:()=>i.setQueueView("add")}})]),L!=="list"?null:o.queue.length===0?t("p",{className:"empty",text:"\uB300\uAE30\uC5F4\uC774 \uBE44\uC5B4 \uC788\uC5B4\uC694."}):t("ol",{className:"queue-list"},o.queue.slice(F*2,F*2+2).map((g,x)=>{let k=F*2+x,C=ee(a,g.recipeId),M=C?Object.keys(C.outputs)[0]:"",K=!!e.busy[`queue-remove:${g.entryId}`];return t("li",{className:"queue-row"},[t("span",{className:"rank",text:String(k+1)}),j(M),t("span",{className:"queue-name"},[t("strong",{text:C?.name??g.recipeId}),t("small",{className:"muted",text:`\uC2DC\uC791 ${g.started} / ${g.total}\uD68C`})]),t("button",{className:"outline-button small",attrs:{type:"button","aria-label":`${C?.name??""} \uB0A8\uC740 \uD69F\uC218 \uBE7C\uAE30`},disabled:K,on:{click:()=>{i.removeQueue(n,g.entryId)}}},[t("span",{text:"\uBE7C\uAE30"})])])})),L==="list"&&X>1?t("div",{className:"resident-pages"},[w("\uC774\uC804",()=>i.setQueuePage(F-1),{variant:"secondary",disabled:F===0}),t("span",{text:`${F+1} / ${X}`,attrs:{"aria-live":"polite"}}),w("\uB2E4\uC74C",()=>i.setQueuePage(F+1),{variant:"secondary",disabled:F+1>=X})]):null,L==="add"?t("div",{className:"queue-add"},[q,$.node,u,t("button",{className:"button",attrs:{type:"button","data-wide":""},disabled:A||m||!p,on:{click:()=>{i.addQueue(n,d,$.read())}}},[c.plus("icon"),t("span",{text:m?"\uB300\uAE30\uC5F4\uC774 \uAC00\uB4DD \uCC3C\uC5B4\uC694":A?"\uCD94\uAC00\uD558\uB294 \uC911\u2026":"\uB300\uAE30\uC5F4\uC5D0 \uCD94\uAC00"})])]):null])}var Rn=[{field:"gather",label:"\uCC44\uC9D1",icon:c.leaf},{field:"grow",label:"\uC7AC\uBC30",icon:c.sprout},{field:"survey",label:"\uC870\uC0AC",icon:c.search},{field:"process",label:"\uAC00\uACF5",icon:c.jar},{field:"craft",label:"\uC81C\uC791",icon:c.hammer}];function za(e,a,r,n){return t("div",{className:"field-tabs",attrs:{role:"tablist","aria-label":"\uC791\uC5C5 \uBD84\uC57C"}},Rn.map(i=>{let o=e.facilities.find(m=>m.field===i.field);if(!o)return null;let s=o.id===r,l=a.state.production.facilities[o.id]?.unlocked??!1;return t("button",{className:`field-tab${s?" current":""}${l?"":" closed"}`,attrs:{type:"button",role:"tab","aria-selected":s?"true":"false","aria-label":l?i.label:`${i.label} (\uD574\uAE08 \uC804)`},on:{click:()=>n.selectFacility(o.id)}},[i.icon("icon field-glyph"),t("span",{text:i.label}),l?null:t("span",{className:"lock-tag"},[c.lock("icon tiny")])])}))}function Mn(e,a,r,n){let i=!!e.busy[`mode:${a}`],o=(s,l)=>t("button",{className:`segment${r.mode===s?" selected":""}`,text:l,attrs:{type:"button","aria-pressed":r.mode===s?"true":"false"},disabled:i,on:{click:()=>r.mode===s?void 0:void n.setMode(a,s)}});return t("div",{className:"segmented",attrs:{role:"group","aria-label":"\uC791\uC5C5 \uBC29\uC2DD"}},[o("auto","\uC790\uB3D9 \uC6B4\uC601"),o("count","\uC9C0\uC815 \uD69F\uC218")])}function An(e,a,r,n,i){let o=Y(a,n),s=Vt(a,r.state,n),l=s.every(d=>d.met),m=!!e.busy[`unlock:${n}`];return S(null,[t("div",{className:"facility-entry"},[t("span",{className:"facility-open closed"},[t("span",{className:"facility-art closed"},[ge(n),t("span",{className:"facility-lock"},[c.lock("icon")])]),t("span",{className:"facility-text"},[t("strong",{text:`${o?.name??n} \xB7 \uD574\uAE08 \uC804`}),t("span",{text:o?.description??""})])])]),t("div",{className:"plan-block"},[t("span",{className:"plan-label",text:"\uD574\uAE08 \uC870\uAC74"}),t("ul",{className:"unlock-list"},s.map(d=>t("li",{className:d.met?"met":""},[(d.met?c.check:c.hourglass)("icon"),t("span",{text:d.text}),t("strong",{text:`${Math.min(d.have,d.need)} / ${d.need}`})])))]),t("button",{className:"button",attrs:{type:"button","data-wide":""},disabled:!l||m,on:{click:()=>{i.unlockFacility(n)}}},[t("span",{text:m?"\uC5EC\uB294 \uC911\u2026":l?"\uC2DC\uC124 \uC5F4\uAE30":"\uC870\uAC74\uC744 \uCC44\uC6B0\uBA74 \uC5F4 \uC218 \uC788\uC5B4\uC694"})])],{className:"work-card"})}function Pn(e,a,r,n,i){let o=Y(e,r),s=ae(e,a.state,r);return t("div",{className:"facility-entry"},[t("button",{className:"facility-open",attrs:{type:"button","aria-label":`${o?.name??"\uC2DC\uC124"} \u2014 \uC2DC\uC124\uACFC \uCC3D\uACE0 \uC5F4\uAE30`},on:{click:()=>i.navigate("facilities")}},[t("span",{className:"facility-art"},[ge(r)]),t("span",{className:"facility-text"},[t("strong",{text:`${o?.name??r} Lv. ${n.level}`}),t("span",{text:`${o?.description??""} \uCC98\uB9AC \uC18D\uB3C4 +${we(e,n.level)}%`}),t("span",{className:"crew-line"},[s.resident?E(s.resident):null,s.resident?`${s.resident.displayName} \xB7 ${s.matches?`+${V(s.passive)}${s.talent?` \xB7 \uD2B9\uAE30 ${s.talent.name}`:""}`:"\uBD84\uC57C\uAC00 \uB2EC\uB77C \uD6A8\uACFC \uC5C6\uC74C"}`:"\uBC30\uCE58\uD55C \uC8FC\uBBFC \uC5C6\uC74C",s.set?` \xB7 \uC138\uD2B8 +${V(s.set)}`:""])])]),t("button",{className:"outline-button",attrs:{type:"button","aria-label":`${o?.name??"\uC2DC\uC124"} \uBC30\uCE58 \uBCC0\uACBD`},on:{click:()=>i.openSheet({kind:"assign",facilityId:r})}},[c.swap("icon"),t("span",{text:"\uBC30\uCE58 \uBCC0\uACBD"})])])}function Tn(e,a,r,n){let i=a?ee(e,a.recipeId):null;if(!i)return t("div",{className:"recipe"},[t("span",{className:"recipe-art"},[c.jar("icon big")]),t("span",{className:"recipe-text"},[t("strong",{text:"\uC81C\uC791\uBC95"}),t("span",{text:"\uC544\uB798 \uC6B0\uC120\uC21C\uC704\uC5D0\uC11C \uC81C\uC791\uBC95\uC744 \uCD94\uAC00\uD574 \uC8FC\uC138\uC694."})])]);let o=Object.keys(i.outputs)[0],s=Re(i,n),l=Ot(e,i,r,s.extraBonus),m=Object.entries(s.inputs).map(([d,p])=>`${O(e,d)} ${p}`);return t("div",{className:"recipe"},[t("span",{className:"recipe-art"},[j(o,"big")]),t("span",{className:"recipe-text"},[t("strong",{text:i.name}),t("span",{text:i.description}),t("span",{className:"recipe-flow",text:`${m.length?`${m.join(" \xB7 ")} \u2192 `:""}${Object.entries(i.outputs).map(([d,p])=>`${O(e,d)} ${p}`).join(" \xB7 ")} \xB7 1\uD68C ${be(l)}`}),s.talentApplies&&n.talent?t("span",{className:"talent-note"},[c.sparkle("icon tiny"),` \uD2B9\uAE30 ${n.talent.name}: ${n.talent.description}`]):null])])}function Ln(e,a,r,n,i){let o=ee(e,n.recipeId),s=o?Object.keys(o.outputs)[0]:"",l=a.state.production,m=a.state.inventory[s]??0,d=Object.values(l.facilities).reduce((h,f)=>h+(f.job?.outputs[s]??0),0),p=t("span",{className:"bar-fill red"});p.style.width=`${Math.min(100,Math.round((m+d)/Math.max(1,n.targetStock)*100))}%`;let u=(h,f,b,v=!1)=>t("button",{className:`step${v?" plus":""}`,attrs:{type:"button","aria-label":b},on:{click:()=>i.changeTarget(r,n.policyId,h)}},[f("icon")]);return t("div",{className:"plan-row"},[t("span",{className:"plan-label",text:"\uBAA9\uD45C \uC7AC\uACE0"}),t("span",{className:"stepper"},[u(-1,c.minus,"\uBAA9\uD45C 1 \uC904\uC774\uAE30"),t("span",{className:"step-value",text:String(n.targetStock),attrs:{"aria-live":"polite"}}),u(1,c.plus,"\uBAA9\uD45C 1 \uB298\uB9AC\uAE30",!0)]),t("span",{className:"plan-progress"},[t("span",{className:"muted"},[`\uD604\uC7AC ${O(e,s)} `,t("strong",{text:String(m)}),d?` (+${d} \uC9C4\uD589 \uC911)`:""," / \uBAA9\uD45C ",t("strong",{text:String(n.targetStock)})]),t("span",{className:"bar"},[p])])])}function zn(e,a,r){let n=r?ee(e,r.recipeId):null,i=n?Object.entries(n.inputs):[],o=a.state.production;return t("div",{className:"plan-block"},[t("span",{className:"plan-label",text:"\uC7AC\uB8CC \uC0AC\uC6A9 \uC124\uC815"}),i.length===0?t("p",{className:"muted",text:"\uC774 \uC81C\uC791\uBC95\uC740 \uC7AC\uB8CC \uC5C6\uC774 \uC232\uC5D0\uC11C \uBC14\uB85C \uBAA8\uC544\uC694."}):t("div",{className:"usage-list"},i.map(([s])=>{let l=a.state.inventory[s]??0,m=o.protectedStock[s]??0;return t("div",{className:"usage"},[t("span",{className:"usage-item"},[j(s),t("span",{text:O(e,s)})]),t("span",{className:"usage-cell"},[t("small",{text:"\uBCF4\uC720"}),t("strong",{text:String(l)})]),t("span",{className:"usage-cell"},[t("small",{text:"\uBCF4\uD638"}),t("strong",{text:String(m)})]),t("span",{className:"usage-cell available"},[t("small",{text:"\uC0AC\uC6A9 \uAC00\uB2A5"}),t("strong",{text:String(Math.max(0,l-m))})])])}))])}function En(e,a,r,n,i,o){let s=new Set(n.map(u=>u.recipeId)),l=a.recipes.filter(u=>u.facilityId===r&&!s.has(u.id)),m=Math.max(1,Math.ceil(n.length/2)),d=Math.min(e.work.priorityPage??0,m-1),p=t("select",{className:"input",attrs:{"aria-label":"\uCD94\uAC00\uD560 \uC81C\uC791\uBC95"}},l.map(u=>t("option",{text:u.name,attrs:{value:u.id}})));return t("div",{className:"plan-block"},[t("span",{className:"plan-label"},["\uC81C\uC791 \uC6B0\uC120\uC21C\uC704 ",t("small",{text:"(\uC704\uC758 \uC544\uC774\uD15C\uBD80\uD130 \uC21C\uC11C\uB300\uB85C \uC81C\uC791\uD574\uC694)"})]),...n.slice(d*2,d*2+2).map((u,h)=>{let f=d*2+h,b=ee(a,u.recipeId),v=b?Object.keys(b.outputs)[0]:"";return t("div",{className:`priority-row${u.policyId===i?" selected":""}${u.enabled?"":" off"}`},[t("span",{className:"rank",text:String(f+1)}),t("button",{className:"priority-main",attrs:{type:"button","aria-pressed":u.policyId===i?"true":"false"},on:{click:()=>{o.selectRule(r,u.policyId),o.setWorkSection("recipe")}}},[j(v),t("span",{className:"priority-name",text:b?.name??u.recipeId}),t("small",{className:"muted",text:`\uBAA9\uD45C ${u.targetStock}`})]),t("button",{className:`chip-toggle${u.enabled?" on":""}`,text:u.enabled?"\uCF1C\uC9D0":"\uAEBC\uC9D0",attrs:{type:"button","aria-pressed":u.enabled?"true":"false","aria-label":`${b?.name??""} ${u.enabled?"\uB044\uAE30":"\uCF1C\uAE30"}`},on:{click:()=>o.toggleRule(r,u.policyId)}}),t("span",{className:"order-buttons"},[t("button",{className:"mini",attrs:{type:"button","aria-label":"\uC704\uB85C"},disabled:f===0,on:{click:()=>o.moveRule(r,u.policyId,-1)}},[c.up("icon")]),t("button",{className:"mini",attrs:{type:"button","aria-label":"\uC544\uB798\uB85C"},disabled:f===n.length-1,on:{click:()=>o.moveRule(r,u.policyId,1)}},[c.down("icon")])])])}),m>1?t("div",{className:"resident-pages"},[t("button",{className:"outline-button",text:"\uC774\uC804",attrs:{type:"button"},disabled:d===0,on:{click:()=>o.setPriorityPage(d-1)}}),t("span",{text:`${d+1} / ${m}`,attrs:{"aria-live":"polite"}}),t("button",{className:"outline-button",text:"\uB2E4\uC74C",attrs:{type:"button"},disabled:d+1>=m,on:{click:()=>o.setPriorityPage(d+1)}})]):null,l.length?t("div",{className:"add-rules"},[p,t("button",{className:"outline-button",text:"\uC81C\uC791\uBC95 \uCD94\uAC00",attrs:{type:"button"},on:{click:()=>o.addRule(r,p.value)}})]):null])}function Wn(e,a,r,n){if(!n.job)return t("div",{className:"plan-row"},[t("span",{className:"plan-label",text:"\uD604\uC7AC \uC791\uC5C5"}),t("span",{className:"plan-progress wide"},[t("span",{className:"muted",text:"\uC26C\uB294 \uC911"}),t("span",{className:"bar"})])]);let i=ee(a,n.job.recipeId),o=Object.keys(n.job.outputs)[0],s=ve(e,r,n.job);return t("div",{className:"plan-row current-work"},[t("span",{className:"plan-label",text:"\uD604\uC7AC \uC791\uC5C5"}),j(o),t("span",{className:"plan-progress"},[t("span",{className:"muted",text:`${i?.name??""} \uB9CC\uB4DC\uB294 \uC911\u2026`}),s.bar]),s.countdown])}function jn(e,a,r,n){let i=e.work.facilityId,o=r.state.production.facilities[i];if(!o)return[I("\uC2DC\uC124\uC744 \uBD88\uB7EC\uC624\uB294 \uC911\u2026")];if(!o.unlocked)return[za(a,r,i,n),An(e,a,r,i,n)];let s=qe(e,r.state.production,i),l=s.find(b=>b.policyId===e.work.selected[i])??s[0],m=Rt(e,r.state.production,i),d=!!e.busy[`rules:${i}`],p=o.mode==="auto",u=ae(a,r.state,i),h=!p&&e.work.section==="priority"?"recipe":e.work.section??"status",f=p?[["status","\uD604\uC7AC \uC791\uC5C5"],["recipe","\uC81C\uC791 \uC124\uC815"],["priority","\uC21C\uC11C\xB7\uC801\uC6A9"]]:[["status","\uD604\uC7AC \uC791\uC5C5"],["recipe","\uB300\uAE30\uC5F4"]];return[za(a,r,i,n),t("div",{className:"work-sections",attrs:{role:"group","aria-label":"\uC791\uC5C5 \uD654\uBA74"}},f.map(([b,v])=>t("button",{className:"pill-tab",text:v,attrs:{type:"button","aria-pressed":h===b?"true":"false"},on:{click:()=>n.setWorkSection(b)}}))),S(null,[...h==="status"?[Mn(e,i,o,n),Pn(a,r,i,o,n),Wn(e,a,r,o),t("p",{className:"hint center"},[c.info("icon"),o.waiting?Ft(a,o.waiting):"\uC7AC\uB8CC\uAC00 \uBD80\uC871\uD558\uBA74 \uAE30\uB2E4\uB838\uB2E4 \uB2E4\uC2DC \uC2DC\uC791\uD574\uC694."])]:[],...h==="recipe"&&p?[Tn(a,l,o.level,u),l?Ln(a,r,i,l,n):null,zn(a,r,l)]:h==="recipe"?[La(e,a,r,i,n)]:[],h==="priority"&&p?En(e,a,i,s,l?.policyId,n):null,h==="status"&&p&&o.queue.length?t("p",{className:"hint center",text:`\uC9C0\uC815 \uD69F\uC218 \uB300\uAE30\uC5F4 ${o.queue.length}\uAC1C\uB294 \uBA48\uCD98 \uCC44 \uADF8\uB300\uB85C \uB0A8\uC544 \uC788\uC5B4\uC694.`}):null,p&&m?t("p",{className:"draft-note"},[h==="priority"?"\uBC14\uAFBC \uADDC\uCE59\uC740 \uC544\uC9C1 \uC801\uC6A9 \uC804\uC774\uC5D0\uC694. ":"\uBC14\uAFBC \uADDC\uCE59\uC740 \uC544\uC9C1 \uC801\uC6A9 \uC804\uC774\uC5D0\uC694. \u2018\uC21C\uC11C\xB7\uC801\uC6A9\u2019\uC5D0\uC11C \uC801\uC6A9\uD574 \uC8FC\uC138\uC694. ",t("button",{className:"link-button",text:"\uB418\uB3CC\uB9AC\uAE30",attrs:{type:"button"},on:{click:()=>n.discardDraft(i)}})]):null],{className:"work-card"}),p&&h==="priority"?t("div",{className:"rule-actions"},[t("button",{className:"button wide-main",attrs:{type:"button"},disabled:!m||d,on:{click:()=>{n.applyRules(i)}}},[t("span",{text:d?"\uC801\uC6A9\uD558\uB294 \uC911\u2026":m?"\uC6B4\uC601 \uADDC\uCE59 \uC801\uC6A9":"\uC801\uC6A9\uB428"})]),t("button",{className:"button secondary",attrs:{type:"button"},on:{click:()=>n.recommendRules(i)}},[c.gear("icon"),t("span",{text:"\uCD94\uCC9C \uC124\uC815"})])]):null]}function Ea(e,a){let r=e.world?.state==="ready"?e.world.value:null,n=r&&e.content&&e.sheet?.kind==="assign"?Ta(e,r,e.content,a,e.sheet.facilityId):null;return R(e,a,{top:{kind:"sub",title:"\uACF5\uBC29 \uC791\uC5C5",back:{route:"home",label:"\uD648"},resources:!0},backdrop:"forest",body:r&&e.content?jn(e,e.content,r,a):[I("\uC138\uACC4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026")],nav:!0,sheet:n})}var Wa={world:40,nickname:24};function On(e){let a=new Date(e);return Number.isNaN(a.getTime())?e:new Intl.DateTimeFormat("ko-KR",{dateStyle:"medium",timeStyle:"short"}).format(a)}function Vn(e,a){let r=S("\uB0B4 \uC138\uACC4",[],{id:"fw-worlds"}),{worlds:n}=e;if(n.state==="loading")r.append(I("\uBD88\uB7EC\uC624\uB294 \uC911\u2026"));else if(n.state==="error")r.append(_(n.message),w("\uB2E4\uC2DC \uC2DC\uB3C4",()=>{a.loadWorlds()},{variant:"secondary"}));else if(n.value.length===0)r.append(t("p",{className:"empty",text:"\uC544\uC9C1 \uC138\uACC4\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4. \uC544\uB798\uC5D0\uC11C \uC0C8\uB85C \uB9CC\uB4E4\uC5B4 \uC8FC\uC138\uC694."}));else{let i=Math.ceil(n.value.length/2),o=Math.min(e.worldsPage??0,i-1);r.append(t("ul",{className:"menu-list"},n.value.slice(o*2,o*2+2).map(s=>t("li",{},[t("button",{className:"menu-row",attrs:{type:"button"},disabled:!s.readable,on:{click:()=>{a.openWorld(s.worldId)}}},[t("span",{className:"menu-icon"},[c.house()]),t("span",{className:"menu-text"},[t("span",{className:"menu-title",text:s.worldName}),t("span",{className:"menu-detail",text:s.readable?`\uB9C8\uC9C0\uB9C9 \uC800\uC7A5 ${On(s.updatedAt)}`:"\uC774 \uBC84\uC804\uC5D0\uC11C \uC77D\uC744 \uC218 \uC5C6\uB294 \uC138\uACC4"})]),t("span",{className:"menu-chevron"},[c.chevron()])])])))),i>1&&r.append(t("div",{className:"resident-pages"},[w("\uC774\uC804",()=>a.setWorldsPage(o-1),{variant:"secondary",disabled:o===0}),t("span",{text:`${o+1} / ${i}`,attrs:{"aria-live":"polite"}}),w("\uB2E4\uC74C",()=>a.setWorldsPage(o+1),{variant:"secondary",disabled:o+1>=i})]))}return r}function ja(e,a){let r=!!e.busy["create-world"],n=t("input",{className:"input",attrs:{id:"fw-world-name",name:"worldName",maxlength:String(Wa.world),autocomplete:"off",required:"",value:e.worldDraft?.worldName??""},on:{input:()=>a.rememberWorldDraft({worldName:n.value,nickname:i.value})}}),i=t("input",{className:"input",attrs:{id:"fw-nickname",name:"playerNickname",maxlength:String(Wa.nickname),autocomplete:"off",required:"",value:e.worldDraft?.nickname??""},on:{input:()=>a.rememberWorldDraft({worldName:n.value,nickname:i.value})}});return t("form",{className:"card form",attrs:{"aria-labelledby":"fw-create"},on:{submit:s=>{s.preventDefault(),!(!n.value.trim()||!i.value.trim())&&a.createWorld(n.value,i.value)}}},[t("h2",{className:"section-title",text:"\uC0C8 \uC138\uACC4 \uB9CC\uB4E4\uAE30",attrs:{id:"fw-create"}}),t("p",{className:"muted",text:"\uD50C\uB808\uC774\uC5B4\uB294 \uC678\uD615 \uC5C6\uC774 \uB2C9\uB124\uC784\uC73C\uB85C\uB9CC \uB4F1\uC7A5\uD569\uB2C8\uB2E4. \uB458 \uB2E4 \uB098\uC911\uC5D0 \uC124\uC815\uC5D0\uC11C \uBC14\uAFC0 \uC218 \uC788\uC2B5\uB2C8\uB2E4."}),t("label",{className:"field-label",text:"\uC138\uACC4 \uC774\uB984",attrs:{for:"fw-world-name"}}),n,t("label",{className:"field-label",text:"\uB0B4 \uB2C9\uB124\uC784",attrs:{for:"fw-nickname"}}),i,t("button",{className:"button",text:r?"\uB9CC\uB4DC\uB294 \uC911\u2026":"\uB9CC\uB4E4\uAE30",attrs:{type:"submit"},disabled:r})])}function Oa(e,a){let r=e.world?.state==="ready",n=e.worlds.state==="ready"&&e.worlds.value.length===0,i=n?null:t("details",{className:"card restore-details",attrs:{open:e.worldCreateOpen?"":void 0},on:{toggle:()=>a.rememberWorldCreateOpen(!!i?.open)}},[t("summary",{className:"section-title",text:"\uC0C8 \uC138\uACC4 \uB9CC\uB4E4\uAE30"}),ja(e,a)]),o=n?ja(e,a):i,s=t("details",{className:"card restore-details",attrs:{open:e.restore?"":void 0}},[t("summary",{className:"section-title",text:"\uBC31\uC5C5\uC5D0\uC11C \uBCF5\uC6D0"}),We(e,a,"fw-worlds-restore")]);return R(e,a,{top:r?{kind:"sub",title:"\uC138\uACC4 \uACE0\uB974\uAE30",back:{route:"backup",label:"\uC800\uC7A5\xB7\uBC31\uC5C5"},resources:!1}:{kind:"sub",title:"\uC232\uACB0 \uACF5\uBC29",resources:!1},backdrop:"wood",body:[n?null:Vn(e,a),o,s],nav:!1})}var Va=`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 48'%3E%3Cpath d='M0 0h120v26c-8 0-10 12-20 12S88 22 78 22 66 36 56 36 44 20 34 20 22 34 12 34 4 26 0 26z' fill='%2394bf74' stroke='%235f8f45' stroke-width='3'/%3E%3C/svg%3E")`,Ba=`
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
  background-image: ${Va}, linear-gradient(#94bf74, #94bf74);
  background-repeat: repeat-x, no-repeat;
  background-size: 7.5em 3em, 100% 5.2em;
  background-position: 0 5.1em, 0 0;
}
.backdrop-wood { background: #a8703f; }
.backdrop-wood .scroll {
  background-color: #a8703f;
  background-image: ${Va}, linear-gradient(#94bf74, #94bf74),
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
.big-tabs { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.3em; margin-bottom: -0.95em; }
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
.storage-grid { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.35em; }
.storage-item { display: flex; align-items: center; gap: 0.5em; min-height: 3em; padding: 0.3em 0.5em; border-radius: 0.9em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); text-align: left; }
.storage-name { flex: 1; min-width: 0; font-weight: 800; overflow-wrap: anywhere; }
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
`;var Fa=`
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
.protect-row[hidden] { display: none; }
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
`;var Da=`
.paged-rows { display: grid; gap: 0.5em; }
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
`;var qa=`
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
.story-layout .column { height: 100%; min-height: 0; }
.story-layout .page { display: flex; flex: 1 1 auto; min-height: 0; flex-direction: column; gap: 0.45em; }
.story-layout .story-stage { flex: 1 1 auto; height: auto; min-height: 3em; }
.story-layout .dialogue-box { flex: none; margin-top: 0; min-height: 0; padding: 0.85em 1em; border-radius: 0.7em; }
.story-layout .speaker-tag { position: static; justify-self: start; padding: 0; border: 0; background: transparent; color: var(--fw-wood-dark); }
.story-layout .dialogue-box .line { font-size: var(--fs); font-weight: 600; line-height: 1.45; }
.story-layout .reader-foot { flex: none; display: flex; align-items: center; margin-top: 0; }
.story-layout .reader-foot .button { flex: 1; }
.reader-tools { gap: 0.35em; }
.reader-tools .chip-button { min-height: 2.2em; padding: 0.1em 0.7em; }
.chip-button.active { background: var(--fw-accent); color: var(--fw-on-accent); }
.story-stage { position: relative; height: clamp(15em, 52vh, 26em); border-radius: 1.1em; border: var(--line) solid var(--ink); background: #e9c995; overflow: hidden; box-shadow: var(--drop); }
.stage-shelf { position: absolute; left: 0; right: 0; top: 0; height: 58%; border-bottom: var(--line) solid var(--ink); background: #c58a52; }
.stage-shelf::before { content: ""; position: absolute; left: 8%; right: 8%; top: 35%; height: 0.6em; border: var(--line-in) solid var(--ink); border-radius: 0.3em; background: #8a5a33; }
.stage-cast { position: absolute; inset: 0; display: grid; grid-auto-flow: column; grid-auto-columns: 1fr; align-items: end; padding: 0 4%; }
.stage-spot { position: relative; display: block; height: 92%; }
.stage-spot .figure { position: absolute; inset: 0; }
.emotion-bubble { position: absolute; z-index: 2; bottom: 78%; left: 50%; transform: translateX(-50%); display: inline-grid; place-items: center; min-width: 2.2em; height: 2.2em; padding: 0 0.4em; border-radius: 999px; border: var(--line-in) solid var(--ink); background: #fff8e8; font-weight: 900; font-size: calc(var(--fs) * 1.2); }
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
`;var Bn=xt.map(e=>`.season-${e}.art-base.backdrop-forest .scroll { background: var(--fw-page) ${fe(de[e].base)} center top / cover no-repeat; }`).join(`
`),Ga=`
/* Season backdrop (portrait). It scrolls with the page so the column keeps its full width on tall phones. */
${Bn}
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
  background: ${fe(le.titleSign)} center / 100% 100% no-repeat;
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
  border-image: ${fe(le.primaryButton)} 70 138 fill / 16px 32px / 0 stretch;
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
  border-image: ${fe(le.paperPanel)} 105 154 fill / 30px 44px / 0 stretch;
  background: transparent;
  box-shadow: none;
}
.art-paper .card { padding: 1.1em 1.2em; }
.art-paper .resident-board { padding: 0.8em 1em; }
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
`;var _a=`
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
.resident-spot.filled.left { animation: fw-stroll-left 12s ease-in-out infinite; }
.resident-spot.filled.right { animation: fw-stroll-right 15s ease-in-out infinite; }
@keyframes fw-stroll-left { 0%, 100% { transform: translate(0, 0); } 25% { transform: translate(0.65em, -0.15em); } 50% { transform: translate(1.2em, 0); } 75% { transform: translate(0.65em, -0.15em); } }
@keyframes fw-stroll-right { 0%, 100% { transform: translate(0, 0); } 25% { transform: translate(-0.6em, -0.15em); } 50% { transform: translate(-1.1em, 0); } 75% { transform: translate(-0.6em, -0.15em); } }
@media (prefers-reduced-motion: reduce) { .resident-spot.filled { animation: none; } }
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
.change-list { margin: 0; padding: 0; list-style: none; display: grid; gap: 0.3em; }
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
.source-pages { display: grid; gap: 0.5em; }
.source-row .menu-detail { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
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
`;var Ha="marinara-capability-forest-workshop",it=class extends HTMLElement{constructor(){super();P(this,"root");P(this,"controller",null);P(this,"diagnostics",null);P(this,"unsubscribe",null);P(this,"styleNode",document.createElement("style"));P(this,"renderedRoute",null);P(this,"renderedPage",null);P(this,"ticker");P(this,"refreshedEnds",new Set);P(this,"onPresence",()=>{this.controller?.heartbeat()});P(this,"onFullscreenChange",()=>{let r=this.root.querySelector(".fullscreen-toggle");r&&(r.textContent=document.fullscreenElement?"\uC804\uCCB4 \uD654\uBA74 \uC885\uB8CC":"\uC804\uCCB4 \uD654\uBA74")});P(this,"presentWorld",null);this.root=this.attachShadow({mode:"open"}),this.styleNode.textContent=Ba+Fa+_a+Da+qa+Ga}connectedCallback(){this.controller||(this.controller=Et(),this.diagnostics=new Ae,this.controller.start()),this.unsubscribe?.(),this.unsubscribe=this.controller.store.subscribe(r=>this.render(r)),this.render(this.controller.store.get()),this.controller.startHeartbeat(),document.addEventListener("visibilitychange",this.onPresence),document.addEventListener("fullscreenchange",this.onFullscreenChange),window.addEventListener("focus",this.onPresence),clearInterval(this.ticker),this.ticker=setInterval(()=>this.tick(),1e3)}disconnectedCallback(){this.unsubscribe?.(),this.unsubscribe=null,this.controller?.stopHeartbeat(),document.removeEventListener("visibilitychange",this.onPresence),document.removeEventListener("fullscreenchange",this.onFullscreenChange),window.removeEventListener("focus",this.onPresence),clearInterval(this.ticker)}tick(){let r=Date.now();for(let n of this.root.querySelectorAll("[data-countdown-end]")){let i=Number(n.dataset.countdownEnd);n.textContent=be(i-r),i<=r&&!this.refreshedEnds.has(n.dataset.countdownEnd)&&(this.refreshedEnds.add(n.dataset.countdownEnd),setTimeout(()=>{this.controller?.refreshProduction()},1500))}for(let n of this.root.querySelectorAll("[data-progress-end]")){let i=Number(n.dataset.progressEnd),o=Math.max(1,Number(n.dataset.progressTotal));n.style.width=`${Math.min(100,Math.max(0,Math.round((o-Math.max(0,i-r))/o*100)))}%`}}screen(r,n){switch(r.route){case"home":return ra(r,n);case"work":return Ea(r,n);case"facilities":return Pa(r,n);case"settings":return Ia(r,n);case"backup":return $a(r,n);case"residents":return ka(r,n);case"relations":return ba(r,n);case"register":return ua(r,n);case"resident-image":return wa(r,n);case"invite":return sa(r,n);case"explore":return da(r,n);case"story":return ma(r,n);case"diagnostics":return this.diagnostics.start(),R(r,n,{top:{kind:"sub",title:"\uC5F0\uACB0 \uC810\uAC80",back:{route:"backup",label:"\uC800\uC7A5\xB7\uBC31\uC5C5"},resources:!1},backdrop:"wood",body:[this.diagnostics.node],nav:!0});default:return Oa(r,n)}}render(r){let n=r.world?.state==="ready"?r.world.value.worldId:null;n&&n!==this.presentWorld&&(this.presentWorld=n,queueMicrotask(()=>{this.controller?.heartbeat()}));let i=this.screen(r,this.controller);this.style.setProperty("--fw-font-size",`${r.fontSize}px`);let o=this.root.activeElement,s=o?.id,l=o&&"selectionStart"in o&&typeof o.selectionStart=="number"?[o.selectionStart,o.selectionEnd??o.selectionStart]:null,m=jt(r),d=r.route===this.renderedRoute&&m===this.renderedPage?this.root.querySelector(".scroll")?.scrollTop??0:0;this.root.replaceChildren(this.styleNode,i),this.renderedRoute=r.route,this.renderedPage=m;let p=this.root.querySelector(".scroll");if(p&&(p.scrollTop=d),s){let u=this.root.getElementById(s);if(u?.focus({preventScroll:!0}),u&&l&&typeof u.setSelectionRange=="function")try{u.setSelectionRange(l[0],l[1])}catch{}}}};typeof customElements<"u"&&!customElements.get(Ha)&&customElements.define(Ha,it);
