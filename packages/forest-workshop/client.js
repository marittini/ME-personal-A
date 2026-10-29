var ra=Object.defineProperty;var aa=(e,r,a)=>r in e?ra(e,r,{enumerable:!0,configurable:!0,writable:!0,value:a}):e[r]=a;var P=(e,r,a)=>aa(e,typeof r!="symbol"?r+"":r,a);var ce=globalThis.__MARINARA_HOST__;if(!ce||ce.version!==1||!ce.queryClient)throw new Error("Marinara Engine does not provide its query client; this package needs capability API 1.341 or newer.");var Jn=ce.queryClient;function pt(){let e=ce.api;if(!e?.api)throw new Error("\uC774 Marinara Engine\uC740 \uD328\uD0A4\uC9C0 API \uD074\uB77C\uC774\uC5B8\uD2B8\uB97C \uC81C\uACF5\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.");return e}function z(){return pt().api}function j(e,r){try{let a=e.payload;return typeof a?.message=="string"&&a.message?a.message:pt().getApiErrorMessage(e,r)}catch{return e instanceof Error&&e.message?e.message:r}}function pe(e){let r=e.payload;return typeof r?.error=="string"?r.error:null}function Ne(){return typeof crypto<"u"&&typeof crypto.randomUUID=="function"?crypto.randomUUID():`${Date.now().toString(36)}-${Math.random().toString(36).slice(2,12)}`}function Y(){if(typeof crypto<"u"&&typeof crypto.randomUUID=="function")return crypto.randomUUID();let e=crypto.getRandomValues(new Uint8Array(16));e[6]=e[6]&15|64,e[8]=e[8]&63|128;let r=[...e].map(a=>a.toString(16).padStart(2,"0")).join("");return`${r.slice(0,8)}-${r.slice(8,12)}-${r.slice(12,16)}-${r.slice(16,20)}-${r.slice(20)}`}var F="/forest-workshop",T={listWorlds:()=>z().get(`${F}/worlds`),createWorld:e=>z().post(`${F}/worlds`,e),getState:e=>z().get(`${F}/state?worldId=${encodeURIComponent(e)}`),getStoryOverview:e=>z().get(`${F}/stories?worldId=${encodeURIComponent(e)}`),getStory:(e,r)=>z().get(`${F}/stories/${encodeURIComponent(r)}?worldId=${encodeURIComponent(e)}`),generateStory:(e,r,a)=>z().post(`${F}/stories/generate`,{worldId:e,pairId:r,episode:a}),getDeliveries:e=>z().get(`${F}/deliveries?worldId=${encodeURIComponent(e)}`),heartbeat:e=>z().post(`${F}/heartbeat`,{worldId:e}),sendCommand:e=>z().post(`${F}/commands`,e),getStorage:e=>z().get(`${F}/storage?worldId=${encodeURIComponent(e)}`),getBackup:e=>z().get(`${F}/backup?worldId=${encodeURIComponent(e)}`),listSources:e=>z().get(`${F}/sources?worldId=${encodeURIComponent(e)}`),previewSource:(e,r,a)=>z().get(`${F}/sources/preview?worldId=${encodeURIComponent(e)}&kind=${r}&id=${encodeURIComponent(a)}`),rebuildSuggestion:(e,r)=>z().post(`${F}/rebuild-suggestion`,{worldId:e,source:r}),uploadResidentImage:e=>{let r=new FormData;return r.append("worldId",e.worldId),r.append("residentId",e.residentId),r.append("uploadKey",e.uploadKey),r.append("file",e.file,e.file.name),z().upload(`${F}/residents/image`,r)},restore:(e,r)=>z().post(`${F}/restore`,{newWorldId:e,backup:r})};var mt="\uC232\uACB0 \uACF5\uBC29 \uBC31\uC5C5 \uD30C\uC77C\uC774 \uC544\uB2D9\uB2C8\uB2E4. \uC124\uC815 \u2192 \uC800\uC7A5\xB7\uBC31\uC5C5\uC5D0\uC11C \uB0B4\uBCF4\uB0B8 JSON \uD30C\uC77C\uC744 \uACE8\uB77C \uC8FC\uC138\uC694.";function ut(e,r){return!e||typeof e!="object"||Array.isArray(e)?0:Object.values(e).filter(r).length}function ft(e){let r=e;if(!r||r.format!=="forest-workshop-backup"||!r.world)return{ok:!1,message:mt};let{settings:a,wallet:n,inventory:i}=r.world;if(typeof a?.worldName!="string"||typeof a.playerNickname!="string")return{ok:!1,message:mt};let o=i&&typeof i=="object"?Object.values(i).filter(s=>typeof s=="number"&&s>0):[];return{ok:!0,summary:{worldName:a.worldName,playerNickname:a.playerNickname,gold:typeof n?.gold=="number"?n.gold:0,itemKinds:o.length,itemTotal:o.reduce((s,l)=>s+l,0),exportedAt:typeof r.exportedAt=="string"?r.exportedAt:"",residents:ut(r.world.residents,()=>!0),pairs:ut(r.world.pairs,s=>!s.archived),pictures:Array.isArray(r.assets)?r.assets.length:0}}}var gt={weather:{label:"\uD604\uC2E4 \uB0A0\uC528",phase:"P5"},mail:{label:"\uC6B0\uD3B8\uD568",phase:"P4b"},"survey-patrol":{label:"\uC870\uC0AC \xB7 \uC21C\uCC30",phase:"P4b"},"weather-effects":{label:"\uB0A0\uC528 \uD6A8\uACFC",phase:"P5"},"auto-read":{label:"\uC790\uB3D9 \uC77D\uAE30",phase:"P4b"},"ai-guidelines":{label:"AI \uC9C0\uCE68 \uAD00\uB9AC",phase:"P4b"},"pair-guidelines":{label:"\uD398\uC5B4 \uC9C0\uCE68 \uAD00\uB9AC",phase:"P4b"}};function Se(e){return e in gt}function bt(e){let r=gt[e];return r?`${r.label} \uAE30\uB2A5\uC740 \uC544\uC9C1 \uC900\uBE44 \uC911\uC774\uC5D0\uC694.`:""}var ht="forest-workshop:font-size",Z={min:12,max:22,default:16,step:1};function $e(e){return Number.isFinite(e)?Math.min(Z.max,Math.max(Z.min,Math.round(e))):Z.default}function wt(){try{let e=localStorage.getItem(ht);return e===null?Z.default:$e(Number(e))}catch{return Z.default}}function yt(e){try{localStorage.setItem(ht,String($e(e)))}catch{}}var vt="forest-workshop:season",na=["auto","spring","summer","autumn","winter"];function xt(){try{let e=localStorage.getItem(vt);return na.includes(e)?e:"auto"}catch{return"auto"}}function kt(e){try{localStorage.setItem(vt,e)}catch{}}function Oe(e){let r=e.getMonth();return r>=2&&r<=4?"spring":r>=5&&r<=7?"summer":r>=8&&r<=10?"autumn":"winter"}function Nt(e,r=new Date){return e==="auto"?Oe(r):e}var St={spring:"\uBD04",summer:"\uC5EC\uB984",autumn:"\uAC00\uC744",winter:"\uACA8\uC6B8"};var ia="forest-workshop",oa=`/api/capability-packages/${ia}/assets/assets/`,It=["spring","summer","autumn","winter"],sa=new Set(["wild-berry","herb","wood","pinecone","acorn","wheat","flower","pumpkin","cotton","tea-leaf","honey","mushroom","beeswax","feather","clover","berry-jam","dried-herb","flour","plank","thread","herb-tea","pumpkin-puree","acorn-flour","herb-sachet","berry-pie","wooden-tray","beeswax-candle","knit-scarf","flower-wreath","pumpkin-soup","honey-cake","birdhouse","acorn-cookie","tea-gift","apple","reed","carrot","flax","clay","salt","dried-apple","apple-jam","linen","reed-cord","prepared-clay","herb-salt","apple-bread","carrot-potage","mushroom-skewer","linen-handkerchief","herb-pillow","reed-basket","wooden-spoon","desk-organizer","clay-planter","wind-chime","apple-gift","picnic-wrap"]),Ct={"gather-yard":"facilities/gather-yard.webp","grow-plot":"facilities/grow-plot.webp","survey-desk":"facilities/survey-desk.webp","process-bench":"facilities/process-bench.webp","craft-bench":"facilities/craft-bench.webp"},le={spring:{base:"backgrounds/workshop-base-spring.webp",scene:"backgrounds/workshop-scene-spring.webp"},summer:{base:"backgrounds/workshop-base-summer.webp",scene:"backgrounds/workshop-scene-summer.webp"},autumn:{base:"backgrounds/workshop-base-autumn.webp",scene:"backgrounds/workshop-scene-autumn.webp"},winter:{base:"backgrounds/workshop-base-winter.webp",scene:"backgrounds/workshop-scene-winter.webp"}},Ve={joy:"emotions/joy.webp",affection:"emotions/affection.webp",curiosity:"emotions/curiosity.webp",fluster:"emotions/fluster.webp",inspiration:"emotions/inspiration.webp",annoyance:"emotions/annoyance.webp"},se={gift:"ui/gift.webp",titleSign:"ui/title-sign.webp",primaryButton:"ui/primary-button.webp",paperPanel:"ui/paper-panel.webp",woodPanel:"ui/wood-panel.webp"};function Be(e){return`${oa}${e}`}function Rt(e){return sa.has(e)?`items/${e}.webp`:null}var Ie=new Set;function ne(e,r){if(!e||Ie.has(e))return r.fallback();let a=document.createElement("img");return a.className=r.className,a.alt=r.alt??"",a.decoding="async",a.draggable=!1,r.lazy&&(a.loading="lazy"),a.addEventListener("error",()=>{Ie.add(e),a.replaceWith(r.fallback())},{once:!0}),a.src=Be(e),a}function fe(e){return`url("${Be(e)}")`}var $t=new Map;function Mt(e){let r=$t.get(e);return r||(r=new Promise(a=>{if(Ie.has(e))return a(!1);let n=new Image;n.decoding="async",n.onload=()=>a(!0),n.onerror=()=>{Ie.add(e),a(!1)},n.src=Be(e)}),$t.set(e,r)),r}function De(e){return[{path:le[e].base,flag:"art-base"},{path:se.titleSign,flag:"art-sign"},{path:se.primaryButton,flag:"art-button"},{path:se.paperPanel,flag:"art-paper"}]}function At(e){let r=e,a=new Set;return{get:()=>r,set(n){let i=typeof n=="function"?n(r):n;r={...r,...i};for(let o of a)o(r)},remember(n){let i=typeof n=="function"?n(r):n;r={...r,...i}},subscribe(n){return a.add(n),()=>a.delete(n)}}}var Ce=class{constructor(){P(this,"epoch",0)}beginNavigation(){return this.epoch+=1,this.epoch}isCurrentNavigation(r){return r===this.epoch}acceptsUpdate(r,a){return!r||r.worldId!==a.worldId?!1:a.revision>=r.revision}};function Pt(e){let{store:r}=e;function a(o){r.set(s=>s.register?{register:{...s.register,...o}}:{})}function n(){let o=r.get().register?.pendingImage;o&&URL.revokeObjectURL(o.previewUrl)}async function i(){let o=e.currentWorld();if(o){a({sources:{state:"loading"}});try{let{sources:s}=await T.listSources(o.worldId);a({sources:{state:"ready",value:s}})}catch(s){a({sources:{state:"error",message:j(s,"\uCE90\uB9AD\uD130\xB7\uD398\uB974\uC18C\uB098 \uBAA9\uB85D\uC744 \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC5B4\uC694.")}})}}}return{openRegister(o=1){n(),r.set({register:{step:o,kindTab:"character",query:"",sources:{state:"loading"},selected:null,preview:null,draft:"",pendingImage:null,starterChoice:null}}),e.navigate("register"),o===1&&i()},closeRegister(){n(),r.set({register:null}),e.navigate("residents")},loadSources:i,setRegisterKind:o=>a({kindTab:o,sourcePage:0}),setRegisterQuery:o=>a({query:o,sourcePage:0}),setRegisterSourcePage:o=>a({sourcePage:Math.max(0,o)}),setRegisterStarterPage:o=>a({starterPage:Math.max(0,o)}),backToSources:()=>a({step:1}),setRegisterPanel:o=>a({panel:o}),setDraft:o=>r.remember(s=>s.register?{register:{...s.register,draft:o}}:{}),setStarterChoice:o=>a({starterChoice:o}),async chooseSource(o){let s=e.currentWorld();if(s){a({step:2,panel:"source",selected:o,preview:{state:"loading"},draft:""});try{let l=await T.previewSource(s.worldId,o.kind,o.id);a({preview:{state:"ready",value:l}})}catch(l){a({preview:{state:"error",message:j(l,"\uC790\uB8CC\uB97C \uC77D\uC9C0 \uBABB\uD588\uC5B4\uC694.")}})}}},async suggestSetting(){let o=e.currentWorld(),s=r.get().register?.selected;if(!o||!s)return;let l=await e.track("rebuild-suggestion",()=>T.rebuildSuggestion(o.worldId,{kind:s.kind,id:s.id}),"\uC81C\uC548\uC744 \uBC1B\uC9C0 \uBABB\uD588\uC5B4\uC694. \uC9C1\uC811 \uC368\uB3C4 \uB3FC\uC694.");l&&a({draft:l.suggestion})},pickPendingImage(o){n(),a({pendingImage:{file:o,previewUrl:URL.createObjectURL(o)}})},clearPendingImage(){n(),a({pendingImage:null})},async confirmRegister(o,s){let l=r.get().register,c=l?.selected;if(!l||!c||!l.draft.trim())return;let d=`register:${c.kind}:${c.id}`,p=e.requestIdFor(`${d}:id`,d,Y);if(!await e.runCommand(d,"residents.register",{residentId:p,source:{kind:c.kind,id:c.id},worldSetting:l.draft}))return;e.forgetRequest(`${d}:id`);let g=o?l.pendingImage:null;g&&await s(p,g.file),n();let u=e.currentWorld();if(u&&u.state.progress.starterResidentId===null){a({step:3,starterChoice:p,pendingImage:null,selected:null,preview:null,draft:""});return}r.set(b=>({register:null,residentsView:{...b.residentsView,selectedId:p}})),e.navigate("residents"),e.notify(`${c.name}\uC744(\uB97C) \uC8FC\uBBFC\uC73C\uB85C \uB4F1\uB85D\uD588\uC5B4\uC694.`)},async confirmStarter(){let o=r.get().register?.starterChoice;!o||!await e.runCommand("choose-starter","residents.chooseStarter",{residentId:o})||(r.set({register:null}),e.navigate("home"),e.notify("\uC2DC\uC791 \uC8FC\uBBFC\uC774 \uACF5\uBC29\uC5D0 \uC654\uC5B4\uC694."))},registerAnother(){a({step:1,query:""}),i()}}}var la=6e4;function Tt(e){return e.map((r,a)=>({rule:r,index:a})).sort((r,a)=>r.rule.priority-a.rule.priority||r.index-a.index).map(({rule:r})=>r)}function Fe(e){return e.map((r,a)=>({...r,priority:Math.min(5,a+1)}))}function Ge(e,r,a){return e.work.drafts[a]??Tt(r.facilities[a]?.rules??[])}function Et(e,r,a){let n=e.work.drafts[a];return!!n&&JSON.stringify(n)!==JSON.stringify(Tt(r.facilities[a]?.rules??[]))}function Re(e){let{activity:r,simMs:a,...n}=e.production;return JSON.stringify([e.inventory,e.wallet,n,r.lastAbsence])}function zt(e){let{store:r}=e,a,n=!1;function i(){return r.get().content}function o(d){r.set(p=>({work:{...p.work,...d}}))}function s(d,p){let f=e.currentWorld();if(!f)return;let g=Ge(r.get(),f.state.production,d);o({drafts:{...r.get().work.drafts,[d]:p(g.map(u=>({...u})))}})}async function l(){let d=e.currentWorld();if(!(!d||n)&&!(typeof document<"u"&&(document.visibilityState!=="visible"||!document.hasFocus()))){n=!0;try{let p=await T.heartbeat(d.worldId),f=e.currentWorld();if(!f||f.worldId!==p.worldId)return;Re(f.state)===Re(p.state)?e.rememberWorld(p):e.showWorld(p)}catch{}finally{n=!1}}}async function c(){let d=e.currentWorld();if(d)try{let p=await T.getState(d.worldId),f=e.currentWorld();if(!f||f.worldId!==p.worldId)return;Re(f.state)===Re(p.state)?e.rememberWorld(p):e.showWorld(p)}catch{}}return{heartbeat:l,refreshProduction:c,startHeartbeat(){clearInterval(a),a=setInterval(()=>{l()},la),l()},stopHeartbeat(){clearInterval(a),a=void 0},selectFacility(d){o({facilityId:d,section:"status",queueView:void 0,queuePage:0,priorityPage:0})},setWorkSection(d){o({section:d})},setInventoryPage(d){o({inventoryPage:Math.max(0,d)})},setQueueView(d){o({queueView:d})},setQueuePage(d){o({queuePage:Math.max(0,d)})},setPriorityPage(d){o({priorityPage:Math.max(0,d)})},rememberQueueCount(d,p){r.remember(f=>({work:{...f.work,queueCounts:{...f.work.queueCounts,[d]:p}}}))},rememberProtection(d){r.remember(p=>{if(p.sheet?.kind!=="protect-edit")return{};let f={...p.sheet.drafts};return d.itemId!==void 0&&d.amount!==void 0&&(f[d.itemId]=d.amount),{sheet:{...p.sheet,page:d.page??p.sheet.page,drafts:f}}})},selectRule(d,p){o({selected:{...r.get().work.selected,[d]:p}})},changeTarget(d,p,f){let g=i()?.production.targetStock??{min:1,max:999};s(d,u=>u.map(b=>b.policyId===p?{...b,targetStock:Math.min(g.max,Math.max(g.min,b.targetStock+f))}:b))},toggleRule(d,p){s(d,f=>f.map(g=>g.policyId===p?{...g,enabled:!g.enabled}:g))},moveRule(d,p,f){s(d,g=>{let u=g.findIndex($=>$.policyId===p),b=u+f;if(u<0||b<0||b>=g.length)return g;let w=[...g];return[w[u],w[b]]=[w[b],w[u]],Fe(w)})},addRule(d,p){let f=i()?.production.recommendedRules[d]?.find(u=>u.recipeId===p),g=Y();s(d,u=>Fe([...u,{policyId:g,enabled:!0,recipeId:p,targetStock:f?.targetStock??10,priority:5}])),o({selected:{...r.get().work.selected,[d]:g}})},removeRule(d,p){s(d,f=>Fe(f.filter(g=>g.policyId!==p)))},recommendRules(d){let p=e.currentWorld(),f=i()?.production.recommendedRules[d]??[];if(!p)return;let g=p.state.production.facilities[d]?.rules??[],u=f.map(b=>({policyId:g.find(w=>w.recipeId===b.recipeId)?.policyId??Y(),enabled:!0,recipeId:b.recipeId,targetStock:b.targetStock,priority:b.priority}));o({drafts:{...r.get().work.drafts,[d]:u}}),e.notify("\uCD94\uCC9C \uC124\uC815\uC744 \uBD88\uB7EC\uC654\uC5B4\uC694. \uD655\uC778\uD55C \uB4A4 '\uC6B4\uC601 \uADDC\uCE59 \uC801\uC6A9'\uC744 \uB204\uB974\uBA74 \uBC14\uB00C\uC5B4\uC694.")},discardDraft(d){let p={...r.get().work.drafts};delete p[d],o({drafts:p})},async applyRules(d){let p=r.get().work.drafts[d];if(!p||!await e.runCommand(`rules:${d}`,"production.setRules",{facilityId:d,rules:p}))return;let g={...r.get().work.drafts};delete g[d],o({drafts:g}),e.notify("\uC6B4\uC601 \uADDC\uCE59\uC744 \uC801\uC6A9\uD588\uC5B4\uC694. \uC9C0\uAE08 \uC791\uC5C5\uC740 \uADF8\uB300\uB85C \uC774\uC5B4\uC9C0\uACE0 \uB2E4\uC74C \uD68C\uCC28\uBD80\uD130 \uBC14\uB00C\uC5B4\uC694.")},async upgradeFacility(d,p){let f=await e.runCommand(`upgrade:${d}:${p}`,"production.upgradeFacility",{facilityId:d,fromLevel:p});f&&e.notify(`Lv. ${String(f.result.level)}\uB85C \uAC15\uD654\uD588\uC5B4\uC694. \uB2E4\uC74C \uD68C\uCC28\uBD80\uD130 \uBE68\uB77C\uC838\uC694.`)},async setProtected(d,p){await e.runCommand(`protect:${d}`,"production.setProtected",{itemId:d,amount:p})&&r.remember(g=>{if(g.sheet?.kind!=="protect-edit"||g.sheet.drafts?.[d]!==p)return{};let u={...g.sheet.drafts};return delete u[d],{sheet:{...g.sheet,drafts:u}}})},async sell(d,p){let f=await e.runCommand(`sell:${d}`,"economy.sell",{itemId:d,amount:p});f&&(r.set({sheet:null}),e.notify(`${p}\uAC1C\uB97C \uD314\uC544 ${String(f.result.gold)} G\uB97C \uBC1B\uC558\uC5B4\uC694.`))},async unlockFacility(d){let p=await e.runCommand(`unlock:${d}`,"production.unlockFacility",{facilityId:d});p&&!p.result.alreadyOpen&&e.notify("\uC2DC\uC124\uC774 \uC5F4\uB838\uC5B4\uC694. \uCD94\uCC9C \uADDC\uCE59\uC73C\uB85C \uBC14\uB85C \uC77C\uC744 \uC2DC\uC791\uD574\uC694.")},async setMode(d,p){(await e.runCommand(`mode:${d}`,"production.setMode",{facilityId:d,mode:p}))?.result.running&&e.notify("\uC9C0\uAE08 \uC791\uC5C5\uC774 \uB05D\uB098\uBA74 \uBC14\uB010 \uBC29\uC2DD\uC73C\uB85C \uC774\uC5B4\uC838\uC694.")},selectQueueRecipe(d,p){o({queueRecipe:{...r.get().work.queueRecipe,[d]:p}})},async addQueue(d,p,f){let g=`queue-entry:${d}`,u=e.requestIdFor(g,JSON.stringify([p,f]),Y);await e.runCommand(`queue:${d}`,"production.queueAdd",{facilityId:d,entryId:u,recipeId:p,count:f})&&e.forgetRequest(g)},async removeQueue(d,p){await e.runCommand(`queue-remove:${p}`,"production.queueRemove",{facilityId:d,entryId:p})},async assignResident(d,p){await e.runCommand(`assign:${d}`,"production.assignResident",{facilityId:d,residentId:p})&&r.set({sheet:null})},async setAutoSell(d,p){await e.runCommand(`auto-sell:${d}`,"economy.setAutoSell",{itemId:d,setting:p})&&e.notify(p.enabled?"\uC790\uB3D9 \uD310\uB9E4 \uC124\uC815\uC744 \uC800\uC7A5\uD588\uC5B4\uC694.":"\uC790\uB3D9 \uD310\uB9E4\uB97C \uAED0\uC5B4\uC694.")},async readReports(d){await e.runCommand("reports-read","production.markReportsRead",{throughReportId:d})&&r.set({sheet:null})}}}function Wt(e,r){let a=r.query.trim().toLowerCase();return Object.values(e.residents).filter(n=>r.tab==="all"||n.kind===r.tab).filter(n=>r.filter==="all"?!0:r.filter==="recruited"?n.recruited:!n.recruited).filter(n=>!a||n.displayName.toLowerCase().includes(a)||n.source.name.toLowerCase().includes(a)).sort((n,i)=>Number(i.recruited)-Number(n.recruited)||n.registeredAt.localeCompare(i.registeredAt))}function qe(e,r){return`pair-add:${[e,r].sort().join(":")}`}function _e(e,r){return e.residentIds[0]===r?e.residentIds[1]:e.residentIds[0]}function Lt(e){let{store:r}=e;function a(i){let o=e.currentWorld();return o&&i?o.state.residents[i]??null:null}function n(i){r.set(o=>({residentsView:{...o.residentsView,...i}}))}return{openMemory(i){r.set({sheet:{kind:"memory",pairId:i,page:0}})},updateMemoryView(i){r.set(o=>o.sheet?.kind==="memory"?{sheet:{...o.sheet,...i}}:{})},rememberMemoryDraft(i){r.remember(o=>o.sheet?.kind==="memory"?{sheet:{...o.sheet,draft:i}}:{})},async correctMemory(i,o){let s=await e.runCommand(`memory:${i}`,"memory.correct",{factId:i,text:o});s&&(r.set(l=>l.sheet?.kind==="memory"?{sheet:{...l.sheet,factId:Number(s.result.factId),draft:void 0}}:{}),e.notify("\uAE30\uC5B5\uC744 \uC815\uC815\uD588\uC5B4\uC694. \uC6D0\uBB38\uC740 \uC774\uB825\uC5D0 \uB0A8\uC544\uC694."))},async setMemoryStatus(i,o){await e.runCommand(`memory:${i}`,"memory.setStatus",{factId:i,active:o})},setResidentsTab:i=>n({tab:i,page:0}),setResidentsQuery:i=>n({query:i,page:0}),setResidentsFilter:i=>n({filter:i,page:0}),setResidentsPage:i=>n({page:Math.max(0,i)}),showResidentsList:()=>n({detailOpen:!1}),selectResident:i=>n({selectedId:i,detailOpen:!0}),openResidents(i){n(i?{selectedId:i,detailOpen:!0}:{detailOpen:!1}),e.navigate("residents")},openRelations(i){r.set({focusResidentId:i}),e.navigate("relations")},openResidentImage(i){let o=a(i);r.set({focusResidentId:i,placementDraft:o?{...o.image.placement}:null}),e.navigate("resident-image")},openSheet(i){r.set({sheet:i,notice:null})},closeSheet(){r.set({sheet:null})},rememberProfile(i){r.remember(o=>o.sheet?.kind==="profile"?{sheet:{...o.sheet,...i}}:{})},toggleRelationsEditing(){r.set(i=>({relationsEditing:!i.relationsEditing}))},async updateWorldSetting(i,o){let s=await e.runCommand(`resident-setting:${i}`,"residents.update",{residentId:i,worldSetting:o});return s&&(r.remember(l=>l.sheet?.kind==="profile"?{sheet:{...l.sheet,draft:void 0}}:{}),e.notify("\uACF5\uBC29 \uC138\uACC4 \uC124\uC815\uC744 \uACE0\uCCE4\uC5B4\uC694. \uBCC0\uACBD \uC774\uB825\uC5D0 \uB0A8\uC558\uC5B4\uC694.")),s},async addPair(i,o){let s=a(i),l=a(o);if(!s||!l)return;let c=qe(s.residentId,l.residentId),d=e.requestIdFor(`${c}:id`,c,Y);await e.runCommand(c,"pairs.add",{pairId:d,residentIds:[s.residentId,l.residentId]})&&(e.forgetRequest(`${c}:id`),r.set({sheet:null}),e.notify(`${s.displayName} \xD7 ${l.displayName} \uD398\uC5B4\uB97C \uB9CC\uB4E4\uC5C8\uC5B4\uC694.`))},archivePair:i=>e.runCommand(`pair-archive:${i}`,"pairs.archive",{pairId:i}),restorePair:i=>e.runCommand(`pair-restore:${i}`,"pairs.restore",{pairId:i}),setPlacementDraft(i){r.set(o=>o.placementDraft?{placementDraft:{...o.placementDraft,...i}}:{})},resetPlacementDraft(){let i=r.get().content?.residents.placement;i&&r.set({placementDraft:{scale:i.scale.default,offsetX:i.offsetX.default,markerHeight:i.markerHeight.default}})},async applyPlacement(i){let o=r.get().placementDraft;if(!o)return;await e.runCommand(`placement:${i}`,"residents.setPlacement",{residentId:i,placement:o})&&e.notify("\uBC30\uCE58\uB97C \uC801\uC6A9\uD588\uC5B4\uC694. \uADF8\uB9BC \uD30C\uC77C\uC740 \uADF8\uB300\uB85C\uC608\uC694.")},async uploadResidentImage(i,o){let s=e.currentWorld();if(!s)return null;let l=`image-upload:${i}`,c=e.requestIdFor(l,`${i}:${o.name}:${o.size}:${o.lastModified}`),d=await e.track(l,()=>T.uploadResidentImage({worldId:s.worldId,residentId:i,uploadKey:c,file:o}),"\uADF8\uB9BC\uC744 \uC800\uC7A5\uD558\uC9C0 \uBABB\uD588\uC5B4\uC694. \uAE30\uC874 \uADF8\uB9BC\uC740 \uADF8\uB300\uB85C\uC608\uC694.");if(!d)return null;let p=e.currentWorld()??s;return e.showWorld({worldId:p.worldId,revision:d.revision,updatedAt:new Date().toISOString(),state:d.state}),e.notify(d.duplicate?"\uC774\uBBF8 \uC800\uC7A5\uB41C \uADF8\uB9BC\uC774\uC5D0\uC694.":"\uADF8\uB9BC\uC744 WebP\uB85C \uC800\uC7A5\uD588\uC5B4\uC694."),d},async restoreResidentImage(i,o){await e.runCommand(`image-restore:${i}`,"residents.restoreImage",{residentId:i,reference:o})&&(r.set({sheet:null}),e.notify("\uC774\uC804 \uADF8\uB9BC\uC73C\uB85C \uB418\uB3CC\uB838\uC5B4\uC694."))},async clearImageHistory(){let i=await e.runCommand("image-history-clear","residents.clearImageHistory",{});if(!i)return;r.set({sheet:null});let o=Array.isArray(i.result.released)?i.result.released.length:0;e.notify(o?`\uC774\uC804 \uADF8\uB9BC ${o}\uC7A5\uC744 \uC815\uB9AC\uD588\uC5B4\uC694.`:"\uC815\uB9AC\uD560 \uC774\uC804 \uADF8\uB9BC\uC774 \uC5C6\uC5B4\uC694."),await e.refreshStorage()}}}function jt(e){let{store:r}=e,a=0;async function n(){let i=e.currentWorld();if(!i)return;let o=++a;r.set({deliveries:{state:"loading"}});try{let s=await T.getDeliveries(i.worldId);o===a&&e.currentWorld()?.worldId===i.worldId&&r.set({deliveries:{state:"ready",value:s}})}catch(s){o===a&&e.currentWorld()?.worldId===i.worldId&&r.set({deliveries:{state:"error",message:j(s,"\uB0A9\uD488 \uC758\uB8B0\uB97C \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.")}})}}return{setInviteTab(i){r.set({inviteTab:i,invitePage:0})},setInvitePage(i){r.set({invitePage:Math.max(0,i)})},setInviteSheetPage(i){r.set(o=>{let s=o.sheet;return!s||s.kind!=="invite-result"&&s.kind!=="invite-chances"&&s.kind!=="invite-log"&&s.kind!=="invite-wish"?{}:{sheet:{...s,page:Math.max(0,i)}}})},async draw(i){let o=await e.runCommand(`invite:${i}`,"invite.draw",{count:i});o&&r.set({sheet:{kind:"invite-result",draws:o.result.draws}})},async setWish(i){await e.runCommand("invite-wish","invite.setWish",{residentId:i})&&r.set({sheet:null})},async exchange(i){let o=await e.runCommand(`exchange:${i}`,"invite.exchange",{residentId:i});o&&r.set({sheet:{kind:"invite-result",draws:[o.result]}})},openDeliveries(){r.set({sheet:{kind:"deliveries"}}),n()},selectDelivery(i){r.set(o=>o.sheet?.kind==="deliveries"?{sheet:{...o.sheet,selectedOrderId:i}}:{})},async deliver(i){let o=await e.runCommand(`deliver:${i}`,"economy.deliver",{orderId:i});if(!o)return;let s=o.result.reward;e.notify(`\uB0A9\uD488\uD588\uC5B4\uC694. \uCD08\uB300\uAD8C ${s.tickets}\uC7A5\uACFC ${s.gold} G\uB97C \uBC1B\uC558\uC5B4\uC694.`),await n()}}}function ge(e){if(!e||e.kind==="choice")return[];let r=Array.from(e.text),a=[];for(let n=0;n<r.length;n+=52)a.push(r.slice(n,n+52).join(""));return a}var da=2800;function Ot(e){let{store:r}=e,a,n=-1,i="";function o(u){r.set(b=>({explore:{...b.explore,...u}}))}function s(u){r.set(b=>b.reader?{reader:{...b.reader,...u}}:{})}async function l(u=!1){let b=e.currentWorld();if(b){u||o({overview:{state:"loading"}});try{let w=await T.getStoryOverview(b.worldId),$=r.get().explore.pairId;o({overview:{state:"ready",value:w},pairId:w.pairs.some(W=>W.pairId===$)?$:w.pairs[0]?.pairId??null})}catch(w){u||o({overview:{state:"error",message:j(w,"\uC774\uC57C\uAE30\uB97C \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.")}})}}}r.subscribe(u=>{u.route!==i&&(i=u.route,u.route==="explore"&&l(u.explore.overview?.state==="ready"));let b=u.world?.state==="ready"?u.world.value.revision:-1;b!==n&&(n=b,(u.route==="explore"||u.route==="home")&&u.explore.overview?.state==="ready"&&l(!0))});function c(){clearInterval(a),a=void 0}function d(){let u=r.get().reader;return u?.story.state==="ready"?u.story.value.segments:[]}function p(){let u=r.get().reader,b=e.currentWorld();if(!u||!b)return!1;let w=b.state.stories.pairs[u.pairId],W=[w?.current,...w?.completed??[]].find(A=>A?.episodes[u.episode]?.storyId===u.storyId)?.episodes[u.episode];return!!W?.choice||W?.state==="read"}function f(){let u=r.get().reader;if(!u)return;let b=d(),w=b[u.index],$=ge(w);if((u.textPage??0)+1<$.length){s({textPage:(u.textPage??0)+1});return}w?.kind==="choice"&&!p()||(u.index<b.length&&s({index:u.index+1,textPage:0,choiceView:"question"}),u.index+1>=b.length&&c())}async function g(){let u=r.get().reader,b=e.currentWorld();if(!(!u||!b)){s({story:{state:"loading"}});try{let w;try{w=await T.getStory(b.worldId,u.storyId)}catch($){if(pe($)!=="story_not_found")throw $;w=await T.generateStory(b.worldId,u.pairId,u.episode)}if(r.get().reader?.storyId!==u.storyId)return;s({story:{state:"ready",value:w},index:0})}catch(w){if(r.get().reader?.storyId!==u.storyId)return;s({story:{state:"error",message:j(w,"\uC774\uC57C\uAE30\uB97C \uC4F0\uC9C0 \uBABB\uD588\uC5B4\uC694. \uAC19\uC740 \uC774\uC57C\uAE30\uB85C \uB2E4\uC2DC \uC2DC\uB3C4\uD560 \uC218 \uC788\uC5B4\uC694.")}})}}}return{loadStoryOverview:l,openExplore(){e.navigate("explore")},setExploreTab(u){o({tab:u})},setExploreSection(u){o({section:u})},setExploreHistoryPage(u){o({historyPage:Math.max(0,u)})},selectStoryPair(u){o({pairId:u,historyPage:0,selectedEpisode:void 0})},selectStoryEpisode(u){o({selectedEpisode:u})},async depart(u,b){let w=await e.runCommand(`depart:${u}:${b}`,"stories.depart",{pairId:u,episode:b});w&&(e.notify(`\uD0D0\uD5D8\uC744 \uB5A0\uB0AC\uC5B4\uC694. ${String(w.result.minutes)}\uBD84 \uB4A4\uC5D0 \uC774\uC57C\uAE30\uAC00 \uC5F4\uB824\uC694.`),await l(!0))},async cancelExpedition(){await e.runCommand("expedition-cancel","stories.cancel",{})&&(e.notify("\uD0D0\uD5D8\uC744 \uCDE8\uC18C\uD588\uC5B4\uC694. \uC900\uBE44\uBB3C\uC740 \uBAA8\uB450 \uB3CC\uB824\uBC1B\uC558\uC5B4\uC694."),await l(!0))},openStory(u,b,w){c();let $=r.get().route==="story"?"explore":r.get().route;r.set({reader:{pairId:u,episode:b,storyId:w,story:{state:"loading"},index:0,auto:!1,backlog:!1,from:$}}),e.navigate("story"),g()},retryStory(){g()},advanceStory:f,setChoiceView(u){s({choiceView:u})},toggleAuto(){let u=r.get().reader;if(u){if(u.auto){c(),s({auto:!1});return}s({auto:!0}),a=setInterval(()=>{if(!r.get().reader?.auto||r.get().route!=="story")return c();f()},da)}},toggleBacklog(){let u=r.get().reader;u&&s({backlog:!u.backlog,backlogPage:void 0})},setBacklogPage(u){s({backlogPage:Math.max(0,u)})},async chooseAnswer(u){let b=r.get().reader;if(!b)return;await e.runCommand(`choose:${b.storyId}`,"stories.choose",{pairId:b.pairId,episode:b.episode,storyId:b.storyId,optionId:u})&&f()},async finishStory(){let u=r.get().reader;if(!u)return;c();let b=await e.runCommand(`read:${u.storyId}`,"stories.markRead",{pairId:u.pairId,episode:u.episode,storyId:u.storyId});b&&(o({tab:"story",section:"history",pairId:u.pairId,historyPage:0}),r.set({reader:null}),e.navigate("explore"),b.result.alreadyRead||e.notify(b.result.arcDone?"\uC774 \uD0D0\uD5D8\uC758 \uC774\uC57C\uAE30\uB97C \uBAA8\uB450 \uC77D\uC5C8\uC5B4\uC694. \uB2E4\uC74C \uD0D0\uD5D8\uC774 \uC5F4\uB838\uC5B4\uC694.":"\uC774\uC57C\uAE30\uB97C \uB2E4 \uC77D\uC5C8\uC5B4\uC694. \uB2E4\uC74C \uC774\uC57C\uAE30\uB97C \uB5A0\uB0A0 \uC218 \uC788\uB294\uC9C0 \uD655\uC778\uD574 \uBCF4\uC138\uC694."),await l(!0))},closeStory(){let u=r.get().reader;c(),r.set({reader:null}),e.navigate(u?.from&&u.from!=="story"?u.from:"explore")}}}var He="forest-workshop:last-world";function ca(){try{return localStorage.getItem(He)}catch{return null}}function Vt(e){try{e?localStorage.setItem(He,e):localStorage.removeItem(He)}catch{}}function pa(e){let r=e.status;return typeof r=="number"&&r>=400&&r<500&&pe(e)!==null}function Bt(){let e=At({route:"worlds",worlds:{state:"loading"},world:null,content:null,busy:{},notice:null,restore:null,fontSize:wt(),seasonChoice:xt(),artReady:[],facilitiesTab:"facilities",storage:null,starterSheetHidden:!1,residentsView:{tab:"all",query:"",filter:"all",selectedId:null},focusResidentId:null,relationsEditing:!1,sheet:null,placementDraft:null,register:null,work:{facilityId:"gather-yard",drafts:{},selected:{},queueRecipe:{}},inviteTab:"invite",deliveries:null,explore:{tab:"story",pairId:null,overview:null},reader:null,worldReceivedAt:Date.now()}),r=new Map,a=new Ce;function n(){for(let{path:h}of De(ie(e.get())))Mt(h).then(v=>{v&&!e.get().artReady.includes(h)&&e.set(k=>({artReady:[...k.artReady,h]}))})}n();let i=4e3,o=null,s;e.subscribe(h=>{if(h.notice!==o&&(o=h.notice,clearTimeout(s),o?.kind==="info")){let v=o;s=setTimeout(()=>{e.get().notice===v&&e.set({notice:null})},i)}});function l(h,v,k=Ne){let I=r.get(h);if(I&&I.signature===v)return I.id;let L=k();return r.set(h,{id:L,signature:v}),L}function c(h,v){e.set(k=>({busy:{...k.busy,[h]:v}}))}async function d(h,v,k){if(e.get().busy[h])return null;c(h,!0),e.set({notice:null});try{let I=await v();return r.delete(h),I}catch(I){return pa(I)&&r.delete(h),e.set({notice:{kind:"error",text:j(I,k)}}),pe(I)==="stale_view"&&W(),null}finally{c(h,!1)}}function p(h,v){Vt(h.worldId),e.set(k=>({world:{state:"ready",value:{worldId:h.worldId,revision:h.revision,updatedAt:h.updatedAt,state:h.state}},worldReceivedAt:Date.now(),work:k.world?.state==="ready"&&k.world.value.worldId===h.worldId?k.work:{facilityId:k.work.facilityId,drafts:{},selected:{},queueRecipe:{}},content:v??k.content,route:k.route==="worlds"?"home":k.route}))}function f(h,v){a.acceptsUpdate(A(),h)&&p(h,v)}function g(h,v){a.beginNavigation(),p(h,v)}function u(h){a.acceptsUpdate(A(),h)&&e.remember({world:{state:"ready",value:{worldId:h.worldId,revision:h.revision,updatedAt:h.updatedAt,state:h.state}},worldReceivedAt:Date.now()})}async function b(){e.set({worlds:{state:"loading"}});try{let{worlds:h}=await T.listWorlds();return e.set({worlds:{state:"ready",value:h}}),h}catch(h){return e.set({worlds:{state:"error",message:j(h,"\uC138\uACC4 \uBAA9\uB85D\uC744 \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.")}}),null}}async function w(h){let v=a.beginNavigation();e.set({world:{state:"loading"},route:"home",notice:null});try{let k=await T.getState(h);if(!a.isCurrentNavigation(v))return;p(k,k.content)}catch(k){if(!a.isCurrentNavigation(v))return;pe(k)==="world_not_found"&&Vt(null),e.set({world:{state:"error",message:j(k,"\uC138\uACC4\uB97C \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.")}})}}async function $(){let h=A();if(h){e.set({storage:{state:"loading"}});try{e.set({storage:{state:"ready",value:await T.getStorage(h.worldId)}})}catch(v){e.set({storage:{state:"error",message:j(v,"\uC800\uC7A5 \uACF5\uAC04\uC744 \uD655\uC778\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.")}})}}}async function W(){let h=e.get().world;h?.state==="ready"&&await w(h.value.worldId)}function A(){let h=e.get().world;return h?.state==="ready"?h.value:null}function ae(h){e.set({route:h,notice:null,restore:null,sheet:null,relationsEditing:!1}),h==="worlds"&&b(),h==="backup"&&$()}async function Q(h,v,k={}){let I=A();if(!I)return null;let L=JSON.stringify([I.worldId,v,k]),ta=l(h,L),ke=await d(h,()=>T.sendCommand({worldId:I.worldId,commandId:ta,expectedRevision:I.revision,type:v,payload:k}),"\uC694\uCCAD\uC744 \uCC98\uB9AC\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4. \uB2E4\uC2DC \uC2DC\uB3C4\uD574 \uC8FC\uC138\uC694.");return!ke||A()?.worldId!==I.worldId?null:(f({worldId:I.worldId,revision:ke.revision,updatedAt:new Date().toISOString(),state:ke.state}),ke)}let M={store:e,track:d,runCommand:Q,currentWorld:A,requestIdFor:l,forgetRequest:h=>r.delete(h),showWorld:f,rememberWorld:u,navigate:ae,refreshStorage:$,notify:(h,v="info")=>e.set({notice:{kind:v,text:h}})};return{store:e,...Lt(M),...Pt(M),...zt(M),...jt(M),...Ot(M),async start(){let h=await b(),v=ca();h&&v&&h.some(k=>k.worldId===v&&k.readable)&&await w(v)},loadWorlds:b,openWorld:w,reloadWorld:W,setWorldsPage(h){e.set({worldsPage:Math.max(0,h)})},rememberWorldDraft(h){e.remember({worldDraft:h})},rememberWorldCreateOpen(h){e.remember({worldCreateOpen:h})},navigate:ae,notify:M.notify,notifyLocked(h){e.set({notice:{kind:"info",text:bt(h)}})},setSeasonChoice(h){kt(h),e.set({seasonChoice:h}),n()},setFontSize(h){let v=$e(h);yt(v),e.set({fontSize:v})},setFacilitiesTab(h){e.set(v=>({facilitiesTab:h,work:{...v.work,inventoryPage:0}}))},setSettingsSection(h){e.set({settingsSection:h})},rememberSettingsNickname(h,v){e.remember({settingsNicknameDraft:{worldId:h,value:v}})},async saveSettingsNickname(h,v){let k=await Q("rename-nickname","settings.update",{playerNickname:v}),I=e.get().settingsNicknameDraft;return k&&I?.worldId===h&&I.value===v&&e.remember({settingsNicknameDraft:void 0}),k},openGroundEditor(){let h=A();h&&(ae("home"),e.set({groundEditingWorld:h.worldId,settingsGroundDraft:{worldId:h.worldId,value:{...h.state.settings.ground}}}))},resetGroundEditor(){let h=A();h&&e.set({settingsGroundDraft:{worldId:h.worldId,value:{left:12,right:88,top:58,bottom:90}}})},cancelGroundEditor(){e.set({groundEditingWorld:void 0,settingsGroundDraft:void 0})},rememberGround(h,v){e.remember({settingsGroundDraft:{worldId:h,value:{...v}}})},async saveGround(h){let v=A()?.worldId,k={...h},I=await Q("ground-save","settings.update",{ground:k});if(I){let L=e.get().settingsGroundDraft;L&&L.worldId===v&&JSON.stringify(L.value)===JSON.stringify(k)&&e.remember({settingsGroundDraft:void 0,groundEditingWorld:void 0}),M.notify("\uC9C0\uBA74 \uC124\uC815\uC744 \uC800\uC7A5\uD588\uC5B4\uC694.")}return I},hideStarterSheet(){e.set({starterSheetHidden:!0})},showStarterSheet(){e.set({starterSheetHidden:!1})},dismissNotice(){e.set({notice:null})},async createWorld(h,v){let k=JSON.stringify([h.trim(),v.trim()]),I=l("create-world",k,Y),L=await d("create-world",()=>T.createWorld({worldId:I,worldName:h,playerNickname:v}),"\uC138\uACC4\uB97C \uB9CC\uB4E4\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.");L&&(e.remember({worldDraft:void 0,worldCreateOpen:!1}),g(L,L.content))},runCommand:Q,async downloadBackup(){let h=A();if(!h)return;let v=await d("backup",()=>T.getBackup(h.worldId),"\uBC31\uC5C5\uC744 \uB9CC\uB4E4\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.");if(!v)return;let k=new Blob([`${JSON.stringify(v,null,2)}
`],{type:"application/json"}),I=URL.createObjectURL(k),L=document.createElement("a");L.href=I,L.download=`forest-workshop-${h.state.settings.worldName}-${v.exportedAt.slice(0,10)}.json`,document.body.append(L),L.click(),L.remove(),setTimeout(()=>URL.revokeObjectURL(I),1e4),e.set({notice:{kind:"info",text:"\uBC31\uC5C5 \uD30C\uC77C\uC744 \uC800\uC7A5\uD588\uC2B5\uB2C8\uB2E4. \uBE44\uBC00\uD0A4\uB294 \uB4E4\uC5B4 \uC788\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4."}})},async selectRestoreFile(h){let v;try{v=JSON.parse(await h.text())}catch{e.set({restore:null,notice:{kind:"error",text:"\uBC31\uC5C5 \uD30C\uC77C\uC744 \uC77D\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4. JSON \uBC31\uC5C5 \uD30C\uC77C\uC744 \uACE8\uB77C \uC8FC\uC138\uC694."}});return}let k=ft(v);if(!k.ok){e.set({restore:null,notice:{kind:"error",text:k.message}});return}e.set({notice:null,restore:{fileName:h.name,signature:`${h.name}:${h.size}:${h.lastModified}`,backup:v,summary:k.summary}})},cancelRestore(){e.set({restore:null})},async confirmRestore(){let h=e.get().restore;if(!h)return;let v=l("restore",h.signature,Y),k=await d("restore",()=>T.restore(v,h.backup),"\uBC31\uC5C5\uC744 \uBCF5\uC6D0\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.");k&&(g(k,k.content),e.set({route:"home",restore:null,notice:{kind:"info",text:`\uBC31\uC5C5\uC744 \uC0C8 \uC138\uACC4 '${k.state.settings.worldName}'(\uC73C)\uB85C \uBCF5\uC6D0\uD588\uC2B5\uB2C8\uB2E4. \uAE30\uC874 \uC138\uACC4\uB294 \uADF8\uB300\uB85C\uC785\uB2C8\uB2E4.`}}))}}}function ie(e){return Nt(e.seasonChoice)}function Dt(e){return De(ie(e)).filter(({path:r})=>e.artReady.includes(r)).map(({flag:r})=>` ${r}`).join("")}function Ft(e){return e.route==="residents"?e.residentsView.detailOpen?`residents:detail:${e.residentsView.selectedId}`:`residents:list:${e.residentsView.page??0}`:e.route==="work"?`work:${e.work.facilityId}:${e.work.section??"status"}:${e.work.queueView??""}:${e.work.queuePage??0}:${e.work.priorityPage??0}`:e.route==="facilities"?`facilities:${e.facilitiesTab}:${e.work.inventoryPage??0}`:e.route==="settings"?`settings:${e.settingsSection??"workshop"}`:e.route==="explore"?`explore:${e.explore?.pairId??""}:${e.explore?.section??"episode"}:${e.explore?.historyPage??0}`:e.route==="invite"?`invite:${e.inviteTab??"invite"}:${e.invitePage??0}`:e.route==="register"?`register:${e.register?.step??1}:${e.register?.panel??"source"}:${e.register?.sourcePage??0}:${e.register?.starterPage??0}`:e.route==="worlds"?`worlds:${e.worldsPage??0}`:e.route}function t(e,r={},a=[]){let n=document.createElement(e);r.className&&(n.className=r.className),r.text!==void 0&&(n.textContent=r.text);for(let[i,o]of Object.entries(r.attrs??{}))o!==void 0&&n.setAttribute(i,o);for(let[i,o]of Object.entries(r.on??{}))o&&n.addEventListener(i,o);r.disabled!==void 0&&"disabled"in n&&(n.disabled=r.disabled);for(let i of a)i==null||i===!1||n.append(typeof i=="string"?document.createTextNode(i):i);return n}function y(e,r,a={}){return t("button",{className:a.variant==="secondary"?"button secondary":"button",text:e,attrs:{type:"button",...a.attrs},disabled:a.disabled,on:{click:r}})}function C(e){return t("p",{className:"muted",text:e,attrs:{role:"status"}})}function _(e){return t("p",{className:"error",text:e,attrs:{role:"alert"}})}function Ue(e){return e>=1024*1024?`${(e/(1024*1024)).toFixed(1)}MiB`:e>=1024?`${Math.round(e/1024)}KiB`:`${e}B`}function O(e,r,a,n=""){return t("div",{className:"sheet-backdrop"},[t("section",{className:`sheet card ${n}`.trim(),attrs:{role:"dialog","aria-modal":"true","aria-labelledby":e}},[t("h2",{className:"section-title",text:r,attrs:{id:e}}),...a])])}function oe(e,r,a,n,i={}){let o=Math.min(n,Math.max(a,r)),s=t("output",{className:"step-value big",text:String(o),attrs:{id:e,"aria-live":"polite",...i.label?{"aria-label":i.label}:{}}}),l=d=>t("button",{className:"step",text:d>0?`+${d}`:String(d),attrs:{type:"button","aria-label":`${i.label??""} ${d>0?"\uB298\uB9AC\uAE30":"\uC904\uC774\uAE30"} ${Math.abs(d)}`.trim()},on:{click:()=>{o=Math.min(n,Math.max(a,o+d)),s.textContent=String(o),i.onChange?.(o)}}}),c=i.small?[l(-1),s,l(1)]:[l(-10),l(-1),s,l(1),l(10)];return{node:t("div",{className:`stepper wide${i.small?" compact":""}`},c),read:()=>o}}function G(e,r,a,n){if(a.length<=1)return null;let i=t("select",{className:"input page-picker",attrs:{"aria-label":e},on:{change:()=>n(Number(i.value))}},a.map((o,s)=>t("option",{text:o,attrs:{value:String(s)}})));return i.value=String(r),i}var Ke={active:"\uC0AC\uC6A9 \uC911",corrected:"\uC815\uC815 \uC804 \uC6D0\uBB38",invalidated:"\uC0AC\uC6A9 \uC911\uC9C0"},ma={event:"\uC0AC\uAC74",feeling:"\uAC10\uC815",player:"\uD50C\uB808\uC774\uC5B4 \uB2F5\uBCC0"};function Gt(e,r){let a=e.sheet,n=e.world?.state==="ready"?e.world.value:null;if(a?.kind!=="memory"||!n)return null;let i=a.pairId?n.state.pairs[a.pairId]:null,o=n.state.memory.facts.filter(b=>!a.pairId||i&&(b.visibility==="public"||i.residentIds.every(w=>b.knowerIds.includes(w)))).filter(b=>!a.status||a.status==="all"||b.status===a.status).filter(b=>!a.residentId||b.visibility==="public"||b.knowerIds.includes(a.residentId)).slice().reverse(),s=o.find(b=>b.factId===a.factId)??o[0],l=Math.max(0,Math.min(a.page??0,Math.ceil(o.length/3)-1)),c=s?!!e.busy[`memory:${s.factId}`]:!1,d=a.draft??s?.text??"",p=b=>{let w=r.store.get().sheet;if(w?.kind==="memory"&&w.draft!==void 0&&w.draft!==s?.text){r.notify("\uC815\uC815\uBB38\uC744 \uC800\uC7A5\uD55C \uB4A4 \uD544\uD130\uB97C \uBC14\uAFD4 \uC8FC\uC138\uC694.");return}r.updateMemoryView({...b,page:0,factId:void 0,draft:void 0})},f=t("select",{className:"input",attrs:{"aria-label":"\uAE30\uC5B5 \uC0C1\uD0DC \uD544\uD130"},on:{change:()=>p({status:f.value})}},[t("option",{text:"\uBAA8\uB4E0 \uC0C1\uD0DC",attrs:{value:"all"}}),...Object.entries(Ke).map(([b,w])=>t("option",{text:w,attrs:{value:b}}))]);f.value=a.status??"all";let g=t("select",{className:"input",attrs:{"aria-label":"\uAE30\uC5B5 \uC778\uC9C0 \uC8FC\uBBFC \uD544\uD130"},on:{change:()=>p({residentId:g.value})}},[t("option",{text:"\uBAA8\uB4E0 \uC778\uC9C0 \uC8FC\uBBFC",attrs:{value:""}}),...Object.entries(n.state.residents).map(([b,w])=>t("option",{text:w.displayName,attrs:{value:b}}))]);g.value=a.residentId??"";let u=t("textarea",{className:"textarea",attrs:{"aria-label":"\uAE30\uC5B5 \uC815\uC815\uBB38",maxlength:"160",rows:"3"},on:{input:()=>r.rememberMemoryDraft(u.value)}});return u.value=d,O("fw-memory",a.pairId?"\uD398\uC5B4 \uACF5\uC720 \uAE30\uC5B5":"\uAE30\uC5B5 \uAD00\uB9AC",[t("p",{className:"muted",text:a.pairId?"\uB450 \uC8FC\uBBFC\uC774 \uD568\uAED8 \uC544\uB294 \uAE30\uC5B5\uACFC \uACF5\uAC1C \uAE30\uC5B5\uB9CC \uBCF4\uC5EC\uC694. \uC815\uC815\uD574\uB3C4 \uC778\uC9C0 \uBC94\uC704\uB294 \uBC14\uB00C\uC9C0 \uC54A\uC544\uC694.":"\uC138\uACC4 \uAD00\uB9AC\uC790\uB294 \uC804\uCCB4 \uAE30\uC5B5\uC744 \uBCFC \uC218 \uC788\uC5B4\uC694. \uC8FC\uBBFC\uC740 \uC790\uC2E0\uC774 \uC544\uB294 \uAE30\uC5B5\uACFC \uACF5\uAC1C \uAE30\uC5B5\uB9CC \uC0AC\uC6A9\uD574\uC694."}),t("div",{className:"memory-filters"},[f,g]),o.length?t("div",{className:"memory-choices",attrs:{role:"group","aria-label":"\uAE30\uC5B5 \uC120\uD0DD"}},o.slice(l*3,l*3+3).map(b=>y(`#${b.factId} \xB7 ${Ke[b.status]} \xB7 ${b.text.slice(0,32)}`,()=>{let w=r.store.get().sheet;if(w?.kind==="memory"&&w.draft!==void 0&&w.draft!==s?.text){r.notify("\uC815\uC815\uBB38\uC744 \uC800\uC7A5\uD55C \uB4A4 \uB2E4\uB978 \uAE30\uC5B5\uC744 \uC120\uD0DD\uD574 \uC8FC\uC138\uC694.");return}r.updateMemoryView({factId:b.factId,draft:void 0})},{variant:"secondary",attrs:{"aria-pressed":String(b.factId===s?.factId)}}))):t("p",{className:"empty",text:"\uC544\uC9C1 \uAE30\uB85D\uB41C \uAE30\uC5B5\uC774 \uC5C6\uC5B4\uC694."}),G("\uAE30\uC5B5 \uBAA9\uB85D \uACE0\uB974\uAE30",l,Array.from({length:Math.ceil(o.length/3)},(b,w)=>`${w+1} \xB7 ${w*3+1}\u2013${Math.min(o.length,w*3+3)}`),b=>r.updateMemoryView({page:b})),s?t("section",{className:"memory-detail"},[t("strong",{text:`#${s.factId} \xB7 ${ma[s.factType]} \xB7 ${Ke[s.status]}`}),t("p",{text:s.text}),t("p",{className:"muted",text:`\uC544\uB294 \uC8FC\uBBFC: ${s.visibility==="public"?"\uBAA8\uB450":s.knowerIds.map(b=>n.state.residents[b]?.displayName??"\uC8FC\uBBFC").join(", ")}`}),t("p",{className:"muted",text:`${s.occurredAt.slice(0,10)} \xB7 ${s.storyId?`\uCD9C\uCC98 \uC774\uC57C\uAE30 ${s.storyId}`:"\uACF5\uBC29 \uAE30\uB85D"}${s.supersedes?` \xB7 \uC815\uC815 \uC6D0\uBB38 #${s.supersedes}`:""}`}),s.status==="active"?t("form",{on:{submit:b=>{b.preventDefault(),u.value.trim()&&u.value.trim()!==s.text&&r.correctMemory(s.factId,u.value)}}},[t("label",{className:"compare-title",text:"\uAE30\uC5B5 \uC815\uC815\uBB38"}),u,t("p",{className:"muted",text:"\uC6D0\uBB38\uACFC \uCD9C\uCC98\uB294 \uBCF4\uC874\uD558\uBA70 \uB2E4\uC74C \uC0DD\uC131\uBD80\uD130 \uC815\uC815\uBCF8\uC744 \uC0AC\uC6A9\uD574\uC694. \uC774\uBBF8 \uC4F4 \uC774\uC57C\uAE30\uB294 \uBC14\uB00C\uC9C0 \uC54A\uC544\uC694."}),t("button",{className:"button",text:"\uC815\uC815 \uC800\uC7A5",attrs:{type:"submit"},disabled:c})]):null,s.status!=="corrected"?y(s.status==="active"?"\uC0AC\uC6A9 \uC911\uC9C0":"\uB2E4\uC2DC \uC0AC\uC6A9",()=>{r.setMemoryStatus(s.factId,s.status!=="active")},{variant:"secondary",disabled:c}):null]):null,y("\uB2EB\uAE30",()=>r.closeSheet(),{variant:"secondary"})],"memory-sheet")}var Qe="http://www.w3.org/2000/svg";function x(e){return(r="icon")=>{let a=document.createElementNS(Qe,"svg");a.setAttribute("viewBox","0 0 24 24"),a.setAttribute("aria-hidden","true"),a.setAttribute("focusable","false"),a.setAttribute("class",r);for(let n of e){let i=typeof n=="string"?{d:n}:n,o=i.circle?document.createElementNS(Qe,"circle"):document.createElementNS(Qe,"path");i.circle?(o.setAttribute("cx",String(i.circle[0])),o.setAttribute("cy",String(i.circle[1])),o.setAttribute("r",String(i.circle[2]))):o.setAttribute("d",i.d??""),i.fill&&o.setAttribute("class","fill"),a.append(o)}return a}}var m={back:x(["M15 5l-7 7 7 7"]),chevron:x(["M9 5l7 7-7 7"]),gear:x([{circle:[12,12,3.2]},"M19.4 13.5l1.6 1.2-2 3.4-1.9-.7a7.6 7.6 0 0 1-2 1.2l-.3 2h-4l-.3-2a7.6 7.6 0 0 1-2-1.2l-1.9.7-2-3.4 1.6-1.2a7.6 7.6 0 0 1 0-3l-1.6-1.2 2-3.4 1.9.7a7.6 7.6 0 0 1 2-1.2l.3-2h4l.3 2a7.6 7.6 0 0 1 2 1.2l1.9-.7 2 3.4-1.6 1.2a7.6 7.6 0 0 1 0 3z"]),lock:x(["M7 11V8a5 5 0 0 1 10 0v3","M5.5 11h13v9h-13z"]),home:x(["M3.5 11.5L12 4l8.5 7.5","M6 10v10h12V10","M10 20v-5h4v5"]),hammer:x(["M14 4l6 6-2.5 2.5-6-6z","M12.5 8.5L4 17l3 3 8.5-8.5"]),compass:x([{circle:[12,12,8.5]},"M15.5 8.5l-2 5-5 2 2-5z"]),residents:x([{circle:[9,9,3.2]},{circle:[16.5,10,2.6]},"M3.5 19c.8-3.2 3-5 5.5-5s4.7 1.8 5.5 5","M14.5 15.5c2.6-.6 5 .8 6 3.5"]),ticket:x(["M4 7h16v3a2 2 0 0 0 0 4v3H4v-3a2 2 0 0 0 0-4z","M10 9.5c1.5 0 3 1 3 2.5s-1.5 2.5-3 2.5"]),mail:x(["M4 6.5h16v11H4z","M4.5 7l7.5 6 7.5-6"]),weather:x(["M7 18h10a3.5 3.5 0 0 0 .4-7A5 5 0 0 0 7.8 10 4 4 0 0 0 7 18z"]),clock:x([{circle:[12,12,8.5]},"M12 7.5V12l3 2"]),info:x([{circle:[12,12,8.5]},"M12 11v5.5","M12 7.6v.4"]),check:x(["M5 12.5l4.5 4.5L19 7.5"]),eye:x(["M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z",{circle:[12,12,2.8]}]),image:x(["M4 5h16v14H4z",{circle:[9,10,1.6]},"M4.5 17l5-5 4 4 2.5-2.5 3.5 3.5"]),landscape:x(["M4 5h16v14H4z","M4.5 17l5.5-6 4 4 2-2 3.5 4"]),document:x(["M7 3.5h7l4 4V20.5H7z","M14 3.5v4h4","M9.5 12h6","M9.5 15.5h6"]),folder:x(["M3.5 7h6l2 2h9v10h-17z"]),book:x(["M12 6.5c-2-1.3-4.7-1.6-8-1v13c3.3-.6 6-.3 8 1 2-1.3 4.7-1.6 8-1v-13c-3.3-.6-6-.3-8 1z","M12 6.5v13"]),flower:x([{circle:[12,12,2.4]},{circle:[12,6.5,2.6]},{circle:[17.2,10.3,2.6]},{circle:[15.2,16.5,2.6]},{circle:[8.8,16.5,2.6]},{circle:[6.8,10.3,2.6]}]),people:x([{circle:[8,8.5,2.8]},{circle:[16,8.5,2.8]},"M3 19c.6-3 2.5-4.6 5-4.6s4.4 1.6 5 4.6","M11 19c.6-3 2.5-4.6 5-4.6s4.4 1.6 5 4.6"]),pair:x([{circle:[9,12,4.5]},{circle:[15,12,4.5]}]),upload:x(["M12 15.5V4.5","M7.5 9l4.5-4.5L16.5 9","M5 14v5.5h14V14"]),download:x(["M12 4.5v11","M7.5 11l4.5 4.5 4.5-4.5","M5 14v5.5h14V14"]),restore:x(["M4.5 12a7.5 7.5 0 1 0 2.2-5.3","M4.5 4.5v4h4"]),leaf:x(["M5 19c0-8 5-13 14-14-1 9-6 14-14 14z","M5 19l7-7"]),sprout:x(["M12 20v-8","M12 12c0-3.5-2.5-6-6.5-6 0 3.5 2.5 6 6.5 6z","M12 12c0-3.5 2.5-6 6.5-6 0 3.5-2.5 6-6.5 6z"]),search:x([{circle:[10.5,10.5,6]},"M15 15l5 5"]),jar:x(["M8 4.5h8v3H8z","M7 7.5h10l1 3v8a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-8z","M9 14h6"]),box:x(["M3.5 8l8.5-4 8.5 4v9l-8.5 4-8.5-4z","M3.5 8l8.5 4 8.5-4","M12 12v9"]),house:x(["M4 11l8-6.5 8 6.5","M6.5 9.5V19h11V9.5","M10.5 19v-4.5h3V19"]),pencil:x(["M15.5 4.5l4 4L9 19H5v-4z","M13.5 6.5l4 4"]),swap:x(["M5 9h12l-3-3","M19 15H7l3 3"]),minus:x(["M6 12h12"]),plus:x(["M6 12h12","M12 6v12"]),grip:x([{circle:[9,7,1.2],fill:!0},{circle:[15,7,1.2],fill:!0},{circle:[9,12,1.2],fill:!0},{circle:[15,12,1.2],fill:!0},{circle:[9,17,1.2],fill:!0},{circle:[15,17,1.2],fill:!0}]),menu:x(["M5 8h14","M5 12h14","M5 16h14"]),filter:x(["M4 5.5h16l-6 7.5v5.5l-4 1.5v-7z"]),heart:x(["M12 19s-7-4.4-7-9.5A4 4 0 0 1 12 7a4 4 0 0 1 7 2.5C19 14.6 12 19 12 19z"]),sparkle:x(["M12 4l1.8 5.2L19 11l-5.2 1.8L12 18l-1.8-5.2L5 11l5.2-1.8z"]),zoom:x([{circle:[10.5,10.5,6]},"M15 15l5 5","M10.5 8v5","M8 10.5h5"]),arrows:x(["M4 12h16","M7.5 8.5L4 12l3.5 3.5","M16.5 8.5L20 12l-3.5 3.5"]),updown:x(["M12 4v16","M8.5 7.5L12 4l3.5 3.5","M8.5 16.5L12 20l3.5-3.5"]),archive:x(["M3.5 5h17v4h-17z","M5 9v10h14V9","M10 13h4"]),berry:x([{circle:[9,13,3.6]},{circle:[15,13,3.6]},{circle:[12,17.5,3.6]},"M12 9.5V5","M12 6.5c1.5-1.8 3.5-2 5-1.5"]),log:x([{circle:[7.5,12,3.8]},"M7.5 8.2h11a3.8 3.8 0 0 1 0 7.6h-11",{circle:[7.5,12,1.3]}]),hourglass:x(["M7 4h10","M7 20h10","M8 4c0 5 8 5 8 8s-8 3-8 8","M16 4c0 5-8 5-8 8s8 3 8 8"]),up:x(["M6 15l6-6 6 6"]),down:x(["M6 9l6 6 6-6"]),addImage:x(["M6 3.5h8l4 4v13H6z","M14 3.5v4h4","M9 16l2.5-3 2 2 1-1.2",{circle:[17.5,17.5,3.5]},"M17.5 16v3","M16 17.5h3"]),acorn:x(["M6 10.5h12a6 6 0 0 1-12 0z","M5.5 10.5c0-3 3-4.5 6.5-4.5s6.5 1.5 6.5 4.5z","M12 6V3.5"]),pinecone:x(["M12 3.5c3.5 3 5 6.5 5 10a5 5 0 0 1-10 0c0-3.5 1.5-7 5-10z","M8 11h8","M7.5 15h9","M10 7.5h4"]),feather:x(["M19 4.5C11 5 6 10 5.5 19.5","M19 4.5c.5 7-4 12-11 12.5","M9 14l4-4"]),pumpkin:x(["M12 7.5c-4.5 0-7 2.8-7 6s2.5 6 7 6 7-2.8 7-6-2.5-6-7-6z","M12 7.5v12","M12 7.5c0-2 1-3.5 2.5-4"]),candle:x(["M9 9.5h6v10.5H9z","M12 9.5V7","M12 3.5c1.3 1.3 1.3 2.7 0 3.5-1.3-.8-1.3-2.2 0-3.5z"]),cup:x(["M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5z","M16 10.5h1.5a2.5 2.5 0 0 1 0 5H16","M9 4.5c0 1.5 1 1.5 1 3","M12.5 4.5c0 1.5 1 1.5 1 3"]),cake:x(["M5 12h14v8H5z","M5 15.5c2.3 1.4 4.7 1.4 7 0s4.7-1.4 7 0","M12 12V8.5",{circle:[12,6.5,1.4]}]),scarf:x(["M6 5h12v5H6z","M13 10v9l3-1V10","M8 7.5h1M11 7.5h1M14 7.5h1"]),wheat:x(["M12 20.5V7","M12 7c-2 0-3-1.5-3-3.5 2 0 3 1.5 3 3.5zM12 7c2 0 3-1.5 3-3.5-2 0-3 1.5-3 3.5z","M12 12c-2 0-3-1.5-3-3.5 2 0 3 1.5 3 3.5zM12 12c2 0 3-1.5 3-3.5-2 0-3 1.5-3 3.5z","M12 17c-2 0-3-1.5-3-3.5 2 0 3 1.5 3 3.5zM12 17c2 0 3-1.5 3-3.5-2 0-3 1.5-3 3.5z"]),clover:x([{circle:[9.5,9.5,2.8]},{circle:[14.5,9.5,2.8]},{circle:[9.5,14.5,2.8]},{circle:[14.5,14.5,2.8]},"M14 17l3.5 4"]),spool:x(["M7 4.5h10","M7 19.5h10","M9 4.5v15","M15 4.5v15","M9 8l6 3M9 12l6 3"]),mushroom:x(["M4.5 12a7.5 7.5 0 0 1 15 0z","M10 12v6.5a2 2 0 0 0 4 0V12"])};var ua={"wild-berry":m.berry,herb:m.leaf,wood:m.log,pinecone:m.pinecone,acorn:m.acorn,wheat:m.wheat,flower:m.flower,pumpkin:m.pumpkin,cotton:m.weather,"tea-leaf":m.sprout,honey:m.jar,mushroom:m.mushroom,beeswax:m.box,feather:m.feather,clover:m.clover,"berry-jam":m.jar,"dried-herb":m.leaf,flour:m.box,plank:m.log,thread:m.spool,"herb-tea":m.cup,"pumpkin-puree":m.pumpkin,"acorn-flour":m.acorn,"herb-sachet":m.heart,"berry-pie":m.cake,"wooden-tray":m.log,"beeswax-candle":m.candle,"knit-scarf":m.scarf,"flower-wreath":m.flower,"pumpkin-soup":m.cup,"honey-cake":m.cake,birdhouse:m.house,"acorn-cookie":m.acorn,"tea-gift":m.clover},J={gather:"\uCC44\uC9D1",grow:"\uC7AC\uBC30",survey:"\uC870\uC0AC",process:"\uAC00\uACF5",craft:"\uC81C\uC791"},me={gather:m.leaf,grow:m.sprout,survey:m.search,process:m.jar,craft:m.hammer};function V(e,r){return e?.items.find(a=>a.id===r)?.name??r}function fa(e,r="icon"){return(ua[e]??m.box)(r)}function B(e,r="small"){return t("span",{className:`item-tile ${r} item-${e}`,attrs:{"aria-hidden":"true"}},[ne(Rt(e),{className:"item-art",lazy:!0,fallback:()=>fa(e,"icon")})])}function be(e,r="big"){return ne(Ct[e]??null,{className:`facility-image ${r}`,fallback:()=>m.house(`icon ${r}`)})}function H(e,r){return e?.recipes.find(a=>a.id===r)??null}function X(e,r){return e?.facilities.find(a=>a.id===r)??null}function he(e){let r=Math.max(0,Math.ceil(e/1e3)),a=Math.floor(r/3600),n=Math.floor(r%3600/60),i=r%60,o=s=>String(s).padStart(2,"0");return a?`${a}:${o(n)}:${o(i)}`:`${o(n)}:${o(i)}`}function we(e){let r=e/36e5;return r>=10||Number.isInteger(r)?`${Math.floor(r)}`:r.toFixed(1)}function qt(e,r,a,n=0){return Math.max(6e4,Math.round(r.minutes*6e4/(1+e.production.speedBonusPerLevel*(a-1)+n)))}function ee(e,r){let a=Math.min(e.crew.maxBreakthrough,Math.max(0,r));return Math.round((e.crew.passiveBase+e.crew.passivePerBreakthrough*a)*1e3)/1e3}function te(e,r,a){let n=new Set(Object.values(r.production.facilities).map(f=>f.residentId).filter(f=>f!==null)),i=Object.values(r.pairs).filter(f=>!f.archived&&f.residentIds.every(g=>n.has(g))).length,o=Math.min(e.crew.setBonusMax,Math.round(e.crew.setBonusPerPair*i*1e3)/1e3),s=r.production.facilities[a]?.residentId??null,l=s?r.residents[s]:void 0,c=l!==void 0&&l.field===X(e,a)?.field,d=c?ee(e,l.breakthrough):0,p=c?re(e,l.talentId)??null:null;return{resident:l??null,matches:c,passive:d,set:o,talent:p,total:Math.round((d+o)*1e3)/1e3}}function re(e,r){return e?.talents.find(a=>a.id===r)}function Me(e,r){let a={...e.inputs},n=r.total,i=r.talent?.effect,o=!1;return i&&i.recipeId===e.id&&(o=!0,i.kind==="speed"?n+=i.bonus:a[i.itemId]!==void 0&&(a[i.itemId]=Math.max(1,a[i.itemId]-i.amount))),{extraBonus:Math.round(n*1e3)/1e3,inputs:a,talentApplies:o}}function D(e){return`${Math.round(e*1e3)/10}%`}function _t(e,r,a){let n=X(e,a)?.unlock;if(!n)return[];let i=[];if(n.facilityLevel){let o=r.production.facilities[n.facilityLevel.facilityId],s=o?.unlocked?o.level:0,l=n.facilityLevel.level,c=X(e,n.facilityLevel.facilityId)?.name??"";i.push({text:`${c} Lv. ${l} \uC774\uC0C1`,have:s,need:l,met:s>=l})}if(n.made){let o=r.production.made[n.made.itemId]??0,s=n.made.amount;i.push({text:`${V(e,n.made.itemId)} ${s}\uAC1C \uB9CC\uB4E4\uAE30`,have:o,need:s,met:o>=s})}return i}function Ht(e,r){return e.production.queueSlotLevels.filter(a=>r>=a).length}function Ye(e,r){return Math.round((e?.production.speedBonusPerLevel??0)*(r-1)*100)}function ga(e,r,a){return e.worldReceivedAt+(a.endsSim-r.state.production.simMs)}function de(e,r,a){let n=ga(e,r,a),i=a.endsSim-a.startedSim,o=t("span",{className:"bar-fill",attrs:{"data-progress-end":String(n),"data-progress-total":String(i)}}),s=Math.max(0,n-Date.now());return o.style.width=`${Math.round((i-s)/Math.max(1,i)*100)}%`,{bar:t("span",{className:"bar teal"},[o]),countdown:t("span",{className:"countdown",text:he(s),attrs:{"data-countdown-end":String(n)}})}}function Ut(e,r){if(!r)return"";if(r.reason==="no_rules")return"\uCF1C \uB454 \uC6B4\uC601 \uADDC\uCE59\uC774 \uC5C6\uC5B4 \uC26C\uACE0 \uC788\uC5B4\uC694.";if(r.reason==="target_reached")return"\uBAA8\uB4E0 \uBAA9\uD45C \uC7AC\uACE0\uB97C \uCC44\uC6CC \uC26C\uACE0 \uC788\uC5B4\uC694. \uC7AC\uACE0\uAC00 \uC904\uBA74 \uB2E4\uC2DC \uC2DC\uC791\uD574\uC694.";if(r.reason==="queue_empty")return"\uC9C0\uC815 \uD69F\uC218 \uB300\uAE30\uC5F4\uC774 \uBE44\uC5B4 \uC26C\uACE0 \uC788\uC5B4\uC694.";if(r.reason==="locked")return"\uC544\uC9C1 \uC5F4\uB9AC\uC9C0 \uC54A\uC740 \uC2DC\uC124\uC774\uC5D0\uC694.";let a=V(e,r.itemId??""),n=r.protectedAmount?` (\uBCF4\uD638 ${r.protectedAmount}\uAC1C\uB294 \uC4F0\uC9C0 \uC54A\uC544\uC694)`:"";return`${a}\uC774(\uAC00) \uBD80\uC871\uD574 \uAE30\uB2E4\uB9AC\uB294 \uC911: \uD55C \uBC88\uC5D0 ${r.needed??"?"}\uAC1C \uD544\uC694, \uC4F8 \uC218 \uC788\uB294 \uC591 ${r.usable??0}\uAC1C${n}.`}function ba(e,r,a,n,i){let o=e.content,s=d=>Math.max(0,(r.state.inventory[d]??0)-(r.state.production.protectedStock[d]??0)),l=Object.entries(a.items).every(([d,p])=>s(d)>=p),c=!!e.busy[`deliver:${a.id}`];return t("div",{className:`order${n?" done":""}`},[t("strong",{className:"order-title",text:a.title}),t("ul",{className:"order-items"},Object.entries(a.items).map(([d,p])=>{let f=r.state.inventory[d]??0,g=r.state.production.protectedStock[d]??0;return t("li",{className:s(d)>=p?"enough":"short"},[B(d),t("span",{text:`${V(o,d)} ${s(d)}/${p}`}),g?t("small",{className:"muted",text:`\uBCF4\uC720 ${f} \xB7 \uBCF4\uD638 ${g}`}):null])})),t("p",{className:"order-reward"},[m.ticket("icon tiny"),` \uCD08\uB300\uAD8C ${a.reward.tickets}\uC7A5 \xB7 ${a.reward.gold} G`]),n?t("span",{className:"status-pill done",text:"\uB0A9\uD488 \uC644\uB8CC"}):y(c?"\uB0A9\uD488\uD558\uB294 \uC911\u2026":l?"\uB0A9\uD488\uD558\uAE30":"\uC7AC\uB8CC\uAC00 \uBD80\uC871\uD574\uC694",()=>{i.deliver(a.id)},{disabled:c||!l,variant:l?void 0:"secondary"})])}function ha(e,r,a,n,i){let o=e.sheet?.kind==="deliveries"?e.sheet.selectedOrderId:void 0,s=a.find(l=>l.id===o)??a.find(l=>!n.includes(l.id))??a[0];return s?t("div",{className:"delivery-board"},[t("div",{className:"delivery-choices",attrs:{role:"group","aria-label":"\uB0A9\uD488 \uC758\uB8B0 \uC120\uD0DD"}},a.map(l=>{let c=Object.keys(l.items)[0]??"";return t("button",{className:`delivery-choice${l.id===s.id?" selected":""}`,attrs:{type:"button","aria-pressed":l.id===s.id?"true":"false","aria-label":`${l.title}${n.includes(l.id)?" \uB0A9\uD488 \uC644\uB8CC":""}`},on:{click:()=>i.selectDelivery(l.id)}},[B(c),t("span",{text:l.title}),t("small",{text:n.includes(l.id)?"\uC644\uB8CC":`\uCD08\uB300\uAD8C ${l.reward.tickets} \xB7 ${l.reward.gold} G`})])})),ba(e,r,s,n.includes(s.id),i)]):t("p",{className:"empty",text:"\uC624\uB298\uC758 \uC758\uB8B0\uAC00 \uC5C6\uC5B4\uC694."})}function Kt(e,r){let a=e.world?.state==="ready"?e.world.value:null,n=e.deliveries,i=!a||!n||n.state==="loading"?[C("\uC624\uB298\uC758 \uB0A9\uD488 \uC758\uB8B0\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026")]:n.state==="error"?[_(n.message)]:[t("p",{className:"muted",text:"\uC758\uB8B0\uB294 \uD558\uB8E8(UTC \uAE30\uC900)\uB9C8\uB2E4 \uBC14\uB00C\uC5B4\uC694. \uC9C0\uB09C \uB0A0\uC758 \uC758\uB8B0\uB294 \uBAA8\uC544 \uB450\uC9C0 \uC54A\uC544\uC694. \uBCF4\uD638\uD55C \uC7AC\uACE0\uB294 \uB0A9\uD488\uD558\uC9C0 \uC54A\uC544\uC694."}),ha(e,a,n.value.orders,n.value.done,r)];return O("fw-deliveries","\uCD08\uB300\uAD8C \uBC1B\uAE30 \xB7 \uC624\uB298\uC758 \uB0A9\uD488",[...i,y("\uB2EB\uAE30",()=>r.closeSheet(),{variant:"secondary",attrs:{"data-wide":""}})])}function Xe(e){return t("span",{className:"lock-tag",attrs:{"aria-hidden":"true"}},[m.lock("icon tiny"),"\uC900\uBE44 \uC911"])}function U(e,r,a){let n=Se(r)||!a.onOpen;return t("button",{className:`${a.className}${n?" is-locked":""}`,attrs:{type:"button","aria-label":n?`${a.label} (\uC900\uBE44 \uC911)`:a.label},on:{click:()=>n?e.notifyLocked(r):a.onOpen?.()}},[...a.children,n?Xe(r):null])}var wa=[{label:"\uD648",icon:m.home,routes:["home","settings","backup","diagnostics"]},{label:"\uC791\uC5C5",icon:m.hammer,routes:["work","facilities"]},{label:"\uD0D0\uC0AC",icon:m.compass,routes:["explore","story"]},{label:"\uC8FC\uBBFC",icon:m.residents,routes:["residents","relations","resident-image"]},{label:"\uCD08\uB300",icon:m.ticket,routes:["invite"]}];function Qt(e,r){return t("nav",{className:"tabbar",attrs:{"aria-label":"\uACF5\uBC29 \uBA54\uB274"}},wa.map(a=>{let n=a.feature?Se(a.feature):!1,i=a.routes.includes(e.route);return t("button",{className:`tab${i?" current":""}${n?" is-locked":""}`,attrs:{type:"button","aria-current":i?"page":void 0,"aria-label":n?`${a.label} (\uC900\uBE44 \uC911)`:a.label},on:{click:()=>{n&&a.feature?r.notifyLocked(a.feature):a.routes[0]==="residents"?r.openResidents():a.routes[0]&&r.navigate(a.routes[0])}}},[t("span",{className:"tab-icon"},[a.icon("icon tab-glyph"),n&&a.feature?Xe(a.feature):null]),t("span",{className:"tab-label",text:a.label})])}))}function ya(e,r){let n=(e.world?.state==="ready"?e.world.value:null)?.state.wallet.tickets??0;return t("button",{className:"counter ticket",attrs:{type:"button","aria-label":`\uCD08\uB300\uAD8C ${n}\uC7A5 \u2014 \uCD08\uB300\uAD8C \uBC1B\uAE30`},on:{click:()=>r.openDeliveries()}},[t("span",{className:"ticket-mark"},[m.ticket("icon")]),t("span",{className:"counter-value",text:String(n)})])}function Yt(e,r){let a=e.world?.state==="ready"?e.world.value:null;if(!a)return null;let n=a.state.wallet.gold.toLocaleString("ko-KR");return t("div",{className:"resources"},[t("span",{className:"counter gold",attrs:{"aria-label":`\uACE8\uB4DC ${n}`}},[t("span",{className:"coin",attrs:{"aria-hidden":"true"}}),t("span",{className:"counter-value",text:n})]),ya(e,r),e.route==="settings"?null:t("button",{className:"icon-button gear",attrs:{type:"button","aria-label":"\uC124\uC815"},on:{click:()=>r.navigate("settings")}},[m.gear()])])}function Xt(e,r,a){if(a.kind==="home")return t("header",{className:"top top-home"},[t("div",{className:"top-row"},[t("h1",{className:"sign sign-home",text:"\uC232\uACB0 \uACF5\uBC29",attrs:{id:"fw-screen-title"}}),Yt(e,r)]),t("div",{className:"top-row second"},[U(r,"weather",{className:"chip-button weather",label:"\uD604\uC2E4 \uB0A0\uC528",children:[m.weather(),t("span",{text:"\uB0A0\uC528"})]}),U(r,"mail",{className:"icon-button mail",label:"\uC6B0\uD3B8\uD568",children:[m.mail()]})])]);let n=a.back;return t("header",{className:`top top-sub${a.resources||a.counters?" with-resources":""}`},[t("div",{className:"top-row"},[n?t("button",{className:"back-button",attrs:{type:"button","aria-label":`${n.label}(\uC73C)\uB85C \uB3CC\uC544\uAC00\uAE30`},on:{click:()=>r.navigate(n.route)}},[m.back()]):t("span",{className:"back-spacer",attrs:{"aria-hidden":"true"}}),t("h1",{className:"sign",text:a.title,attrs:{id:"fw-screen-title"}}),a.resources?Yt(e,r):a.counters??null]),a.subtitle?t("p",{className:"ribbon",text:a.subtitle}):null])}function va(e,r){return e.notice?t("div",{className:`notice ${e.notice.kind}`,attrs:{role:e.notice.kind==="error"?"alert":"status"}},[t("p",{text:e.notice.text}),t("button",{className:"notice-close",text:"\uB2EB\uAE30",attrs:{type:"button","aria-label":"\uC54C\uB9BC \uB2EB\uAE30"},on:{click:()=>r.dismissNotice()}})]):null}function R(e,r,a){return t("div",{className:`shell backdrop-${a.backdrop} season-${ie(e)}${Dt(e)}${a.nav?" has-nav":""}${a.homeLayout?" home-layout":""}${a.storyLayout?" story-layout":""}${e.notice?" has-notice":""}`},[t("div",{className:"scroll"},[t("div",{className:"column"},[Xt(e,r,a.top),a.hero??null,t("main",{className:"page",attrs:{"aria-labelledby":"fw-screen-title"}},a.body)])]),va(e,r),a.nav?Qt(e,r):null,a.sheet??(e.sheet?.kind==="memory"?Gt(e,r):e.sheet?.kind==="deliveries"?Kt(e,r):null)])}function S(e,r,a={}){return t("section",{className:`card ${a.className??""}`.trim(),attrs:a.id?{"aria-labelledby":a.id}:{}},[e?t("h2",{className:"section-title",text:e,attrs:a.id?{id:a.id}:{}}):null,...r])}var Ae="/forest-workshop/p0",xa={pass:"\uD1B5\uACFC",fail:"\uC2E4\uD328",unavailable:"\uC0AC\uC6A9 \uBD88\uAC00"};function N(e,r={},a=[]){let n=document.createElement(e);r.className&&(n.className=r.className),r.text!==void 0&&(n.textContent=r.text);for(let[i,o]of Object.entries(r.attrs??{}))n.setAttribute(i,o);for(let i of a)i&&n.append(i);return n}var Pe=class{constructor(){P(this,"node",N("div",{className:"diagnostics"}));P(this,"started",!1);P(this,"status",{state:"loading"});P(this,"probe",null);P(this,"image",{state:"loading"});P(this,"uploading",!1);P(this,"uploadError",null);P(this,"pendingUpload",null)}start(){this.started||(this.started=!0,this.render(),this.loadStatus(),this.loadImage())}async loadStatus(){this.status={state:"loading"},this.render();try{this.status={state:"ready",value:await z().get(`${Ae}/status`)}}catch(r){this.status={state:"error",message:j(r,"\uD328\uD0A4\uC9C0 \uC0C1\uD0DC\uB97C \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.")}}this.render()}async loadImage(){this.image={state:"loading"},this.render();try{let r=await z().get(`${Ae}/image`);this.image={state:"ready",value:r.current}}catch(r){this.image={state:"error",message:j(r,"\uC800\uC7A5\uB41C \uADF8\uB9BC\uC744 \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.")}}this.render()}async runProbe(){if(this.probe?.state!=="loading"){this.probe={state:"loading"},this.render();try{let r=await z().post(`${Ae}/probe`);this.probe={state:"ready",value:r.checks}}catch(r){this.probe={state:"error",message:j(r,"\uC5F0\uACB0 \uC810\uAC80\uC744 \uC2E4\uD589\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.")}}this.render()}}async upload(r){if(this.uploading)return;let a=this.pendingUpload?.file===r?this.pendingUpload:{file:r,key:Ne()};this.pendingUpload=a,this.uploading=!0,this.uploadError=null,this.render();try{let n=new FormData;n.append("uploadKey",a.key),n.append("file",r,r.name);let i=await z().upload(`${Ae}/image`,n);this.image={state:"ready",value:i.image},this.pendingUpload=null}catch(n){this.uploadError=j(n,"\uADF8\uB9BC\uC744 \uC62C\uB9AC\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4. \uAE30\uC874 \uADF8\uB9BC\uC740 \uADF8\uB300\uB85C\uC785\uB2C8\uB2E4.")}finally{this.uploading=!1,this.render()}}render(){this.node.replaceChildren(N("p",{className:"muted",text:"\uC5D4\uC9C4 \uC5F0\uACB0\uACFC \uC8FC\uBBFC \uADF8\uB9BC \uC800\uC7A5 \uACBD\uB85C\uB97C \uD655\uC778\uD569\uB2C8\uB2E4. \uACB0\uACFC\uB294 \uC138\uACC4\uC5D0 \uC601\uD5A5\uC744 \uC8FC\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4."}),this.renderStatus(),this.renderProbe(),this.renderImage())}retryButton(r,a){let n=N("button",{className:"button secondary",text:r,attrs:{type:"button"}});return n.addEventListener("click",a),n}renderStatus(){let r=N("section",{className:"card",attrs:{"aria-labelledby":"fw-status"}},[N("h2",{text:"\uC5D4\uC9C4 \uC5F0\uACB0",attrs:{id:"fw-status"}})]);if(this.status.state==="loading")r.append(N("p",{className:"muted",text:"\uBD88\uB7EC\uC624\uB294 \uC911\u2026",attrs:{role:"status"}}));else if(this.status.state==="error")r.append(N("p",{className:"error",text:this.status.message,attrs:{role:"alert"}}),this.retryButton("\uB2E4\uC2DC \uC2DC\uB3C4",()=>{this.loadStatus()}));else{let{value:a}=this.status;r.append(N("p",{className:"muted",text:`\uD328\uD0A4\uC9C0 ${a.version} \xB7 \uB2E8\uACC4 ${a.stage}`}),N("ul",{className:"list"},a.host.map(n=>N("li",{className:"row"},[N("span",{className:"name",text:n.name}),N("span",{className:`badge ${n.available?"pass":n.required?"fail":"unavailable"}`,text:n.available?"\uC788\uC74C":n.required?"\uC5C6\uC74C (\uD544\uC218)":"\uC5C6\uC74C"})]))))}return r}renderProbe(){let r=N("button",{className:"button",text:this.probe?.state==="loading"?"\uC810\uAC80 \uC911\u2026":"\uC5F0\uACB0 \uC810\uAC80 \uC2E4\uD589",attrs:{type:"button"}});r.disabled=this.probe?.state==="loading",r.addEventListener("click",()=>{this.runProbe()});let a=N("section",{className:"card",attrs:{"aria-labelledby":"fw-probe"}},[N("h2",{text:"\uC800\uC7A5\xB7\uC790\uB8CC\xB7\uBAA8\uB378 \uC810\uAC80",attrs:{id:"fw-probe"}}),N("p",{className:"muted",text:"\uC784\uC2DC \uBB38\uC11C\uB97C \uC4F0\uACE0 \uC9C0\uC6C1\uB2C8\uB2E4. \uCE90\uB9AD\uD130\xB7\uD398\uB974\uC18C\uB098 \uC6D0\uBCF8\uC740 \uC77D\uAE30\uB9CC \uD558\uBA70, \uBAA8\uB378 \uC0DD\uC131 \uC694\uCCAD\uC740 \uBCF4\uB0B4\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4."}),r]);return!this.probe||this.probe.state==="loading"?a:this.probe.state==="error"?(a.append(N("p",{className:"error",text:this.probe.message,attrs:{role:"alert"}})),a):(a.append(N("ul",{className:"list",attrs:{"aria-live":"polite"}},this.probe.value.map(n=>N("li",{className:"row stacked"},[N("div",{className:"row-head"},[N("span",{className:"name",text:n.label}),N("span",{className:`badge ${n.status}`,text:xa[n.status]})]),N("span",{className:"detail",text:n.detail})])))),a)}renderImage(){let r=N("input",{className:"file",attrs:{type:"file",accept:"image/png,image/webp",id:"fw-file"}});r.disabled=this.uploading,r.addEventListener("change",()=>{let n=r.files?.[0];n&&this.upload(n)});let a=N("section",{className:"card",attrs:{"aria-labelledby":"fw-image"}},[N("h2",{text:"\uC8FC\uBBFC \uADF8\uB9BC \uC800\uC7A5 \uC810\uAC80",attrs:{id:"fw-image"}}),N("p",{className:"muted",text:"PNG \uB610\uB294 \uC815\uC801 WebP(\uCD5C\uB300 20MiB, 4096\xD74096)\uB97C \uACE0\uB974\uBA74 \uD22C\uBA85\uB3C4\uB97C \uC720\uC9C0\uD55C WebP \uD488\uC9C895\uB85C \uBC14\uAFD4 \uC804\uC5ED \uAC24\uB7EC\uB9AC\uC5D0 \uC800\uC7A5\uD569\uB2C8\uB2E4. PNG \uC6D0\uBCF8\uC740 \uBCF4\uAD00\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4."}),N("label",{className:"field-label",text:"\uADF8\uB9BC \uD30C\uC77C \uACE0\uB974\uAE30",attrs:{for:"fw-file"}}),r]);if(this.uploading&&a.append(N("p",{className:"muted",text:"\uBCC0\uD658\uD558\uACE0 \uC800\uC7A5\uD558\uB294 \uC911\u2026",attrs:{role:"status"}})),this.uploadError){a.append(N("p",{className:"error",text:this.uploadError,attrs:{role:"alert"}}));let n=this.pendingUpload;n&&!this.uploading&&a.append(this.retryButton("\uAC19\uC740 \uD30C\uC77C\uB85C \uB2E4\uC2DC \uC2DC\uB3C4",()=>{this.upload(n.file)}))}if(this.image.state==="loading")a.append(N("p",{className:"muted",text:"\uBD88\uB7EC\uC624\uB294 \uC911\u2026",attrs:{role:"status"}}));else if(this.image.state==="error")a.append(N("p",{className:"error",text:this.image.message,attrs:{role:"alert"}}),this.retryButton("\uB2E4\uC2DC \uBD88\uB7EC\uC624\uAE30",()=>{this.loadImage()}));else if(!this.image.value)a.append(N("p",{className:"empty",text:"\uC544\uC9C1 \uC800\uC7A5\uB41C \uADF8\uB9BC\uC774 \uC5C6\uC2B5\uB2C8\uB2E4."}));else{let n=this.image.value,i=N("img",{className:"preview",attrs:{src:`${n.url}${n.url.includes("?")?"&":"?"}v=${n.imageVersion}`,alt:"\uC800\uC7A5\uB41C \uC8FC\uBBFC \uADF8\uB9BC \uBBF8\uB9AC\uBCF4\uAE30",width:String(n.width),height:String(n.height)}});a.append(N("div",{className:"stage"},[i]),N("dl",{className:"facts"},[N("dt",{text:"\uCC38\uC870"}),N("dd",{text:n.reference}),N("dt",{text:"\uD06C\uAE30"}),N("dd",{text:`${n.width}\xD7${n.height}`}),N("dt",{text:"\uC6A9\uB7C9"}),N("dd",{text:`\uC785\uB825 ${Ue(n.inputBytes)} \u2192 WebP ${Ue(n.outputBytes)}`}),N("dt",{text:"\uD22C\uBA85\uB3C4"}),N("dd",{text:n.hasTransparency?"\uD22C\uBA85 \uC601\uC5ED \uC788\uC74C (\uC720\uC9C0\uB428)":"\uBD88\uD22C\uBA85 \uADF8\uB9BC"}),N("dt",{text:"\uBC84\uC804"}),N("dd",{text:String(n.imageVersion)})]))}return a}};function ye(e){return!!e.groundEditingWorld&&e.world?.state==="ready"&&e.groundEditingWorld===e.world.value.worldId}function Jt(e,r,a){if(e.world?.state!=="ready")return null;let n=e.world.value,i={...e.settingsGroundDraft?.worldId===n.worldId?e.settingsGroundDraft.value:n.state.settings.ground},o=t("div",{className:"ground-overlay",attrs:{"aria-label":"\uD648 \uC774\uB3D9\uC601\uC5ED \uD3B8\uC9D1"}}),s=t("div",{className:"ground-selection"},[t("span",{className:"ground-caption",text:"\uC8FC\uBBFC \uC774\uB3D9 \uAC00\uB2A5 \uC601\uC5ED"})]),l=()=>{let c=`left:${i.left}%;top:${i.top}%;width:${i.right-i.left}%;height:${i.bottom-i.top}%;`;s.style.cssText=c,a&&(a.style.cssText=c+"right:auto;bottom:auto;padding:0;")};for(let[c,d]of[["left","\uC67C\uCABD"],["right","\uC624\uB978\uCABD"],["top","\uC704\uCABD"],["bottom","\uC544\uB798\uCABD"]]){let p=t("button",{className:`ground-handle ${c}`,text:c==="left"||c==="right"?"\u2194":"\u2195",attrs:{type:"button","aria-label":`\uC774\uB3D9\uC601\uC5ED ${d} \uACBD\uACC4 \uC870\uC808`}}),f=g=>{let u=c==="left"?0:c==="right"?i.left+20:c==="top"?35:Math.max(55,i.top+10),b=c==="left"?i.right-20:c==="right"?100:c==="top"?Math.min(85,i.bottom-10):100;i[c]=Math.round(Math.max(u,Math.min(b,g))),r.rememberGround(n.worldId,i),p.setAttribute("aria-label",`\uC774\uB3D9\uC601\uC5ED ${d} \uACBD\uACC4 ${i[c]}%`),l()};p.addEventListener("pointerdown",g=>{g.button===0&&(g.preventDefault(),p.setPointerCapture(g.pointerId))}),p.addEventListener("pointermove",g=>{if(!p.hasPointerCapture(g.pointerId))return;let u=o.getBoundingClientRect();!u.width||!u.height||f(c==="left"||c==="right"?(g.clientX-u.left)/u.width*100:(g.clientY-u.top)/u.height*100)}),p.addEventListener("pointerup",g=>{p.hasPointerCapture(g.pointerId)&&p.releasePointerCapture(g.pointerId)}),p.addEventListener("keydown",g=>{let u=g.key==="ArrowLeft"||g.key==="ArrowUp"?-1:g.key==="ArrowRight"||g.key==="ArrowDown"?1:0;u&&(g.preventDefault(),f(i[c]+u))}),s.append(p)}return o.append(s),l(),o}function Zt(e,r){let a=e.world?.state==="ready"?e.world.value:null;if(!a)return null;let n=!!e.busy["ground-save"];return t("div",{className:"ground-actions"},[t("p",{text:"\uBC30\uACBD \uC704 \uACBD\uACC4\uB97C \uB04C\uC5B4 \uC8FC\uBBFC\uC774 \uB2E4\uB2D0 \uACF3\uC744 \uC815\uD574 \uC8FC\uC138\uC694. \uC800\uC7A5 \uC804\uC5D0\uB294 \uC801\uC6A9\uB418\uC9C0 \uC54A\uC544\uC694."}),t("div",{className:"ground-action-row"},[y("\uAE30\uBCF8 \uBC94\uC704",()=>r.resetGroundEditor(),{variant:"secondary",disabled:n}),y("\uCDE8\uC18C",()=>r.cancelGroundEditor(),{variant:"secondary",disabled:n}),y(n?"\uC800\uC7A5 \uC911\u2026":"\uC800\uC7A5",()=>{r.saveGround(r.store.get().settingsGroundDraft?.value??a.state.settings.ground)},{disabled:n})])])}var ka="http://www.w3.org/2000/svg";function er(e){let r=document.createElementNS(ka,"svg");return r.setAttribute("viewBox","0 0 60 80"),r.setAttribute("aria-hidden","true"),r.setAttribute("class",e),r.innerHTML='<circle cx="30" cy="24" r="15"/><path d="M6 80c0-17 11-29 24-29s24 12 24 29z"/>',r}function tr(e,r){let a=e.image.current;return t("img",{className:r,attrs:{src:`${a.url}${a.url.includes("?")?"&":"?"}v=${encodeURIComponent(a.reference)}`,alt:"",width:String(a.width),height:String(a.height),decoding:"async",draggable:"false"}})}function Je(e){return{bottom:Math.max(15,Math.min(82,4+e.scale*.9-12+e.markerHeight*.4)),left:Math.max(10,Math.min(90,50+e.offsetX*.5))}}function K(e,r={}){let a=r.placement??e.image.placement,n=t("span",{className:"figure",attrs:{"aria-hidden":"true"}});if(!e.image.current)n.append(t("span",{className:"figure-empty"},[er("figure-silhouette"),t("span",{className:"figure-empty-text",text:"PNG \uB4F1\uB85D"})]));else{let i=t("span",{className:"figure-body"},[tr(e,"figure-image")]);i.style.height=`${a.scale*.9}%`,i.style.left=`${50+a.offsetX*.5}%`,n.append(i)}if(r.marker){let i=t("span",{className:"emotion-bubble",text:"?"}),o=Je(a);i.style.bottom=`${o.bottom}%`,i.style.left=`${o.left}%`,n.append(i)}return n}function E(e,r="small"){let a=t("span",{className:`avatar ${r}`,attrs:{"aria-hidden":"true"}});return e?.image.current?a.append(tr(e,"avatar-image")):(a.append(er("avatar-silhouette")),e||a.append(t("span",{className:"avatar-unknown",text:"?"}))),a}var ve={character:"\uCE90\uB9AD\uD130",persona:"\uD398\uB974\uC18C\uB098"};function q(e){return t("span",{className:`tag ${e.kind}`,text:ve[e.kind]})}var Na="http://www.w3.org/2000/svg";function Sa(){let e=document.createElementNS(Na,"svg");return e.setAttribute("viewBox","0 0 390 300"),e.setAttribute("preserveAspectRatio","xMidYMax slice"),e.setAttribute("aria-hidden","true"),e.setAttribute("class","scene-art"),e.innerHTML=`
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
    </g>`,e}function $a(e){let r=e.progress.starterResidentId;return Object.values(e.residents).filter(a=>a.recruited).sort((a,n)=>+(n.residentId===r)-+(a.residentId===r)||a.registeredAt.localeCompare(n.registeredAt)).slice(0,2)}function rr(e,r,a,n){if(r)return t("button",{className:`resident-spot filled ${e}`,attrs:{type:"button","aria-label":`${r.displayName} \uD504\uB85C\uD544 \uBCF4\uAE30`},on:{click:()=>{n.openResidents(r.residentId),n.openSheet({kind:"profile",residentId:r.residentId})}}},[K(r)]);if(a.progress.starterResidentId===null&&e==="left"){let i=Object.keys(a.residents).length>0;return t("button",{className:`resident-spot invite ${e}`,attrs:{type:"button"},on:{click:()=>n.openRegister(i?3:1)}},[t("span",{className:"spot-shadow"}),t("span",{className:"spot-text",text:i?"\uC2DC\uC791 \uC8FC\uBBFC \uACE0\uB974\uAE30":"\uC8FC\uBBFC \uB9DE\uC774\uD558\uAE30"})])}return t("button",{className:`resident-spot ${e}`,attrs:{type:"button","aria-label":"\uBE48 \uC790\uB9AC \u2014 \uCD08\uB300\uB85C \uC0C8 \uC8FC\uBBFC \uB9DE\uC774\uD558\uAE30"},on:{click:()=>n.navigate("invite")}},[t("span",{className:"spot-shadow"}),t("span",{className:"spot-text",text:"\uCD08\uB300"})])}function ar(e,r){let a=e.world?.state==="ready"?e.world.value.state:null,n=a?$a(a):[],i=a?.settings.ground??{left:12,right:88,top:58,bottom:90},o=a?t("div",{className:"scene-stage ground-stage"},[rr("left",n[0]??null,a,r),rr("right",n[1]??null,a,r)]):null;return o&&(o.style.cssText=`left:${i.left}%;top:${i.top}%;width:${i.right-i.left}%;height:${i.bottom-i.top}%;right:auto;bottom:auto;padding:0;`),t("section",{className:`scene${ye(e)?" editing-ground":""}`,attrs:{"aria-label":"\uACF5\uBC29 \uC7A5\uBA74"}},[ne(le[ie(e)].scene,{className:"scene-art",fallback:Sa}),o,ye(e)?Jt(e,r,o):a?t("button",{className:"ground-launch outline-button",text:"\uC9C0\uBA74 \uD3B8\uC9D1",attrs:{type:"button"},on:{click:()=>r.openGroundEditor()}}):null,n.length===0?t("p",{className:"scene-caption"},[m.leaf("icon tiny"),"\uC8FC\uBBFC\uC744 \uB9DE\uC774\uD558\uBA74 \uC774\uACF3\uC5D0 \uBAA8\uC5EC\uC694"]):null])}function Ia(e,r){return e.items.find(a=>a.id===r)?.name??r}function nr(e,r){let a=e.world?.state==="ready"?e.world.value:null,n=e.content;if(!a||!n||a.state.progress.starterKitClaimed||e.starterSheetHidden)return null;let i=!!e.busy["claim-starter-kit"],o=n.starterKit;return t("div",{className:"sheet-backdrop"},[t("section",{className:"sheet card",attrs:{role:"dialog","aria-modal":"true","aria-labelledby":"fw-starter"}},[t("h2",{className:"section-title",text:"\uACF5\uBC29 \uC2DC\uC791 \uAFB8\uB7EC\uBBF8",attrs:{id:"fw-starter"}}),t("p",{className:"muted",text:"\uCCAB \uCC44\uC9D1\uACFC \uAC00\uACF5\uC744 \uC2DC\uC791\uD560 \uC7AC\uB8CC\uC608\uC694. \uD55C \uBC88\uB9CC \uBC1B\uC744 \uC218 \uC788\uC5B4\uC694."}),t("ul",{className:"kit"},[t("li",{className:"kit-item"},[t("span",{className:"coin"}),t("span",{text:"\uACE8\uB4DC"}),t("strong",{text:o.gold.toLocaleString("ko-KR")})]),o.tickets?t("li",{className:"kit-item"},[m.ticket("icon"),t("span",{text:"\uCD08\uB300\uAD8C"}),t("strong",{text:`${o.tickets}\uC7A5`})]):null,...Object.entries(o.items).map(([s,l])=>t("li",{className:"kit-item"},[m.leaf("icon"),t("span",{text:Ia(n,s)}),t("strong",{text:l.toLocaleString("ko-KR")})]))]),y(i?"\uBC1B\uB294 \uC911\u2026":"\uBC1B\uAE30",()=>{r.runCommand("claim-starter-kit","onboarding.claimStarterKit")},{disabled:i,attrs:{"data-wide":""}}),y("\uB098\uC911\uC5D0",()=>r.hideStarterSheet(),{variant:"secondary",attrs:{"data-wide":""}})])])}function or(e){let r=e.state.production.reportsReadThrough;return e.state.production.reports.filter(a=>a.reportId>r)}function Ze(e,r){let a={};for(let n of e)for(let[i,o]of Object.entries(n[r]))a[i]=(a[i]??0)+o;return a}function ir(e){let r=Object.values(e.state.production.facilities);return r.some(a=>a.waiting?.reason==="materials")?"\uC7AC\uB8CC\uB97C \uAE30\uB2E4\uB9AC\uB294 \uC2DC\uC124\uC774 \uC788\uC5B4\uC694":r.some(a=>a.job)?"\uACF5\uBC29\uC774 \uC798 \uB3CC\uC544\uAC00\uACE0 \uC788\uC5B4\uC694":"\uACF5\uBC29\uC774 \uC26C\uACE0 \uC788\uC5B4\uC694"}function sr(e,r,a){let n=or(r).length,i=Object.entries(r.state.production.facilities).find(([,c])=>c.job),o=i?.[1].job,s=o?H(e.content,o.recipeId):null,l=!!(o&&i&&!n);return t("button",{className:"home-summary work-summary",attrs:{type:"button","aria-label":l?`${s?.name??"\uC791\uC5C5"} \uC9C4\uD589 \uC911 \xB7 \uC791\uC5C5 \uAD00\uB9AC \uC5F4\uAE30`:`${ir(r)} \xB7 ${n?`\uC0C8 \uBCF4\uACE0 ${n}\uAC1C`:"\uC0C8 \uBCF4\uACE0 \uC5C6\uC74C"} \xB7 \uC791\uC5C5 \uBCF4\uACE0 \uC5F4\uAE30`},on:{click:()=>{l&&i?(a.selectFacility(i[0]),a.navigate("work")):a.openSheet({kind:"work-report"})}}},[t("span",{className:"home-summary-copy"},[t("strong",{text:l?`${s?.name??"\uC791\uC5C5"} \uC9C4\uD589 \uC911`:ir(r)}),l&&o?t("span",{},["\uB0A8\uC740 \uC2DC\uAC04 ",de(e,r,o).countdown]):t("span",{text:n?`\uC0C8 \uC791\uC5C5 \uBCF4\uACE0 ${n}\uAC1C`:"\uC791\uC5C5 \uBCF4\uACE0 \uBCF4\uAE30"})]),m.chevron("icon")])}function lr(e,r,a){let n=e.state.production.activity.lastAbsence,i=r?.production.absenceLimitMs??72*36e5;return t("button",{className:"strip offline",attrs:{type:"button"},on:{click:()=>a.notify(n&&n.totalMs>n.creditedMs?`\uC9C0\uB09C\uBC88\uC5D4 ${we(n.totalMs)}\uC2DC\uAC04 \uBE44\uC6E0\uACE0, \uADF8\uC911 \uCD5C\uB300 72\uC2DC\uAC04\uB9CC \uACF5\uBC29\uC774 \uC77C\uD588\uC5B4\uC694. \uB0A8\uC740 \uC791\uC5C5\uC740 \uBA48\uCD98 \uC790\uB9AC\uC5D0\uC11C \uC774\uC5B4\uC838\uC694.`:"\uC790\uB9AC\uB97C \uBE44\uC6B4 \uB3D9\uC548\uC5D0\uB3C4 \uCD5C\uB300 72\uC2DC\uAC04\uAE4C\uC9C0 \uACF5\uBC29\uC774 \uC77C\uD574\uC694. \uADF8 \uB4A4\uC5D4 \uBA48\uCD98 \uC790\uB9AC\uC5D0\uC11C \uAE30\uB2E4\uB824\uC694.")}},[m.clock(),t("span",{},["\uBBF8\uC811\uC18D \uB204\uC801 ",t("strong",{text:`${n?we(n.creditedMs):"0"}\uC2DC\uAC04`}),` / \uCD5C\uB300 ${we(i)}\uC2DC\uAC04`]),m.info("icon muted-icon")])}function Ca(e){let r=new Date(e);return Number.isNaN(r.getTime())?e:new Intl.DateTimeFormat("ko-KR",{month:"numeric",day:"numeric",hour:"2-digit",minute:"2-digit",hour12:!1}).format(r)}function ue(e,r,a){let n=Object.entries(r);return n.length?n.map(([i,o])=>`${V(e,i)} ${a}${o}`).join(" \xB7 "):"\uC5C6\uC74C"}function dr(e,r,a){let n=e.content,i=r.state.production.reports,o=or(r),s=!!e.busy["reports-read"];return t("div",{className:"sheet-backdrop"},[t("section",{className:"sheet card",attrs:{role:"dialog","aria-modal":"true","aria-labelledby":"fw-work-report"}},[t("h2",{className:"section-title",text:"\uC791\uC5C5 \uBCF4\uACE0",attrs:{id:"fw-work-report"}}),t("p",{className:"muted",text:"\uB9CC\uB4E0 \uBB3C\uAC74\uC740 \uB9CC\uB4E4\uC5B4\uC9C4 \uC21C\uAC04 \uCC3D\uACE0\uC5D0 \uB4E4\uC5B4\uAC14\uC5B4\uC694. \uBCF4\uACE0\uB97C \uC77D\uC5B4\uB3C4 \uB2E4\uC2DC \uC9C0\uAE09\uB418\uC9C0 \uC54A\uC544\uC694."}),o.length?t("div",{className:"report-total"},[t("p",{},[t("strong",{text:"\uC0C8\uB85C \uB4E4\uC5B4\uC628 \uAC83 "}),ue(n,Ze(o,"produced"),"+")]),t("p",{},[t("strong",{text:"\uC7AC\uB8CC\uB85C \uC4F4 \uAC83 "}),ue(n,Ze(o,"consumed"),"\u2212")]),o.some(l=>l.gold>0)?t("p",{},[t("strong",{text:"\uC790\uB3D9 \uD310\uB9E4 "}),`${ue(n,Ze(o,"sold"),"\u2212")} \u2192 +${o.reduce((l,c)=>l+c.gold,0)} G`]):null]):t("p",{className:"empty",text:"\uC0C8 \uBCF4\uACE0\uAC00 \uC5C6\uC5B4\uC694."}),i.length?t("ol",{className:"report-list"},i.slice(0,10).map(l=>t("li",{className:`report-entry${l.reportId>r.state.production.reportsReadThrough?" new":""}`},[t("span",{className:"report-time",text:`${Ca(l.at)}${l.offlineMs?` \xB7 \uBE44\uC6B4 \uB3D9\uC548 ${we(l.offlineMs)}\uC2DC\uAC04`:""}`}),t("span",{text:[l.runs?`${l.runs}\uD68C \uC644\uB8CC`:"",Object.keys(l.produced).length?`\uB4E4\uC5B4\uC634 ${ue(n,l.produced,"+")}`:"",Object.keys(l.consumed).length?`\uC7AC\uB8CC ${ue(n,l.consumed,"\u2212")}`:"",l.gold?`\uC790\uB3D9 \uD310\uB9E4 ${ue(n,l.sold,"\u2212")} +${l.gold} G`:""].filter(Boolean).join(" \xB7 ")})]))):null,o.length?y(s?"\uD655\uC778\uD558\uB294 \uC911\u2026":"\uD655\uC778",()=>{a.readReports(i[0].reportId)},{disabled:s,attrs:{"data-wide":""}}):null,y("\uB2EB\uAE30",()=>a.closeSheet(),{variant:"secondary",attrs:{"data-wide":""}})])])}function cr(e,r){let a=i=>r?.stories.arcs.find(o=>o.id===i)?.title??"\uC774\uC57C\uAE30";for(let i of Object.values(e.stories.pairs)){let o=i.current;if(o?.episodes.some(s=>s.state==="unlocked"))return`\uC0C8 \uC774\uC57C\uAE30\uAC00 \uC5F4\uB838\uC5B4\uC694 \xB7 ${a(o.arcId)}`}let n=e.stories.expedition;if(n){let i=e.stories.pairs[n.pairId]?.current;return`\uD0D0\uD5D8 \uC911 \xB7 ${i?a(i.arcId):"\uC774\uC57C\uAE30 \uD0D0\uD5D8"}`}return Object.keys(e.pairs).length?"\uD0D0\uC0AC\uC5D0\uC11C \uC774\uC57C\uAE30 \uD0D0\uD5D8\uC744 \uB5A0\uB0A0 \uC218 \uC788\uC5B4\uC694":"\uD398\uC5B4\uB97C \uB9CC\uB4E4\uBA74 \uB450 \uC8FC\uBBFC\uC758 \uC774\uC57C\uAE30\uAC00 \uC5F4\uB824\uC694"}function Ra(e,r,a){return t("button",{className:"strip story",attrs:{type:"button","aria-label":`\uC8FC\uBBFC \uC774\uC57C\uAE30 \u2014 ${cr(e,r)}`},on:{click:()=>a.openExplore()}},[t("span",{className:"story-art",attrs:{"aria-hidden":"true"}},[m.book("icon")]),t("span",{className:"story-text"},[t("strong",{text:"\uC8FC\uBBFC \uC774\uC57C\uAE30"}),t("span",{text:cr(e,r)})]),t("span",{className:"round-arrow"},[m.chevron()])])}function pr(e,r){let a=e.world;return!a||a.state!=="ready"?R(e,r,{top:{kind:"home"},backdrop:"forest",nav:!1,body:[a?.state==="error"?S(null,[_(a.message),y("\uC138\uACC4 \uBAA9\uB85D\uC73C\uB85C",()=>r.navigate("worlds"),{variant:"secondary"})]):C("\uC138\uACC4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026")]}):R(e,r,{top:{kind:"home"},backdrop:"forest",hero:ar(e,r),homeLayout:!0,body:ye(e)?[Zt(e,r)]:[sr(e,a.value,r),Ra(a.value.state,e.content,r),lr(a.value,e.content,r)],nav:!0,sheet:e.sheet?.kind==="work-report"?dr(e,a.value,r):nr(e,r)})}var et={new:"\uC0C8 \uC8FC\uBBFC",breakthrough:"\uB3CC\uD30C",token:"\uC885\uD45C"};function mr(e,r){return e.outcome==="new"?"\uACF5\uBC29\uC5D0 \uC654\uC5B4\uC694!":e.outcome==="breakthrough"?`\uB3CC\uD30C ${e.breakthrough}/${r}`:"\uCD5C\uB300 \uB3CC\uD30C\uB77C \uC885\uD45C 1\uAC1C\uAC00 \uB410\uC5B4\uC694"}function Te(e){return y("\uB2EB\uAE30",()=>e.closeSheet(),{variant:"secondary",attrs:{"data-wide":""}})}function Ee(e,r,a,n,i=!1){let o=e.sheet,s=o&&(o.kind==="invite-result"||o.kind==="invite-chances"||o.kind==="invite-log"||o.kind==="invite-wish")?o.page??0:0,l=Math.max(1,Math.ceil(a.length/2)),c=Math.min(s,l-1);return t("div",{className:"paged-rows"},[t(i?"ol":"ul",{className:n},a.slice(c*2,c*2+2)),G("\uCD08\uB300 \uBAA9\uB85D \uACE0\uB974\uAE30",c,Array.from({length:l},(d,p)=>`${p*2+1}\u2013${Math.min(a.length,p*2+2)} / ${a.length}`),d=>r.setInviteSheetPage(d))])}function Ma(e,r,a,n,i){let o=n.length===1?n[0]:null,s=o?r.state.residents[o.residentId]:null;return O("fw-invite-result",n.length>1?`${n.length}\uD68C \uCD08\uB300 \uACB0\uACFC`:"\uCD08\uB300 \uACB0\uACFC",[o&&s?t("div",{className:"result-hero"},[t("span",{className:"result-stage"},[K(s)]),t("strong",{className:"result-name",text:s.displayName}),t("span",{className:`result-badge ${o.outcome}`,text:et[o.outcome]}),t("p",{className:"muted",text:mr(o,a.crew.maxBreakthrough)})]):Ee(e,i,n.map(l=>{let c=r.state.residents[l.residentId];return t("li",{className:`result-row ${l.outcome}`},[E(c??null),t("strong",{text:c?.displayName??"\uC8FC\uBBFC"}),t("span",{className:`result-badge ${l.outcome}`,text:et[l.outcome]}),t("small",{className:"muted",text:`${mr(l,a.crew.maxBreakthrough)}${l.via==="guarantee"?" \xB7 \uBCF4\uC7A5":""}`})])}),"result-list",!0),Te(i)])}function Aa(e,r,a,n){let i=Object.keys(r.state.residents).sort(),o=r.state.invite.wishResidentId,s=c=>c===o?a.invite.wishWeight:a.invite.baseWeight,l=i.reduce((c,d)=>c+s(d),0);return O("fw-invite-chances","\uD655\uB960 \uBCF4\uAE30",[t("p",{className:"muted",text:`\uB4F1\uB85D\uB41C \uC8FC\uBBFC\uC740 \uBAA8\uB450 \uAC19\uC740 \uD655\uB960\uC774\uC5D0\uC694(\uB4F1\uAE09 \uC5C6\uC74C). \uD76C\uB9DD \uC8FC\uBBFC\uC740 ${a.invite.wishWeight}\uBC30\uB85C \uB9CC\uB098\uC694. \uC0C8 \uC8FC\uBBFC \uC5C6\uC774 ${a.invite.guaranteeAfter}\uBC88\uC774 \uC9C0\uB098\uBA74 \uB2E4\uC74C \uCD08\uB300\uB294 \uC544\uC9C1 \uC624\uC9C0 \uC54A\uC740 \uC8FC\uBBFC\uC774\uC5D0\uC694(\uD76C\uB9DD \uC8FC\uBBFC\uC774 \uAE30\uB2E4\uB9AC\uBA74 \uADF8 \uC8FC\uBBFC). 10\uD68C \uCD08\uB300\uB294 \uD55C \uBC88\uC529 \uCC28\uB840\uB85C \uC801\uC6A9\uB3FC\uC694.`}),i.length===0?t("p",{className:"empty",text:"\uB4F1\uB85D\uB41C \uC8FC\uBBFC\uC774 \uC5C6\uC5B4\uC694."}):Ee(e,n,i.map(c=>{let d=r.state.residents[c],p=l?s(c)/l*100:0;return t("li",{className:"chance-row"},[E(d),t("span",{className:"chance-name"},[t("strong",{text:d.displayName}),c===o?t("span",{className:"tag wish",text:"\uD76C\uB9DD"}):null]),t("strong",{className:"chance-value",text:`${p.toFixed(p<10?2:1)}%`})])}),"chance-list"),t("p",{className:"muted",text:`\uCC98\uC74C \uB9CC\uB098\uBA74 \uC601\uC785, \uB2E4\uC2DC \uB9CC\uB098\uBA74 \uB3CC\uD30C(\uCD5C\uB300 ${a.crew.maxBreakthrough}), \uCD5C\uB300 \uB3CC\uD30C \uB4A4\uC5D0\uB294 \uC885\uD45C 1\uAC1C. \uC885\uD45C ${a.invite.tokensPerExchange}\uAC1C\uB85C \uC6D0\uD558\uB294 \uC8FC\uBBFC\uC744 \uACE0\uB97C \uC218 \uC788\uC5B4\uC694.`}),Te(n)])}function Pa(e,r,a,n){let i=r.state.invite.log,o=new Intl.DateTimeFormat("ko-KR",{dateStyle:"short",timeStyle:"short"});return O("fw-invite-log","\uCD08\uB300 \uAE30\uB85D",[i.length===0?t("p",{className:"empty",text:"\uC544\uC9C1 \uCD08\uB300 \uAE30\uB85D\uC774 \uC5C6\uC5B4\uC694."}):Ee(e,n,i.map(s=>t("li",{className:`result-row ${s.outcome}`},[E(r.state.residents[s.residentId]??null),t("strong",{text:r.state.residents[s.residentId]?.displayName??s.name}),t("span",{className:`result-badge ${s.outcome}`,text:et[s.outcome]}),t("small",{className:"muted",text:`${o.format(new Date(s.at))}${s.via==="guarantee"?" \xB7 \uBCF4\uC7A5":s.via==="exchange"?" \xB7 \uC885\uD45C \uAD50\uD658":""}${s.outcome==="breakthrough"?` \xB7 \uB3CC\uD30C ${s.breakthrough}/${a.crew.maxBreakthrough}`:""}`})])),"result-list",!0),t("p",{className:"muted",text:`\uCD5C\uADFC ${a.invite.logLimit}\uAC74\uAE4C\uC9C0 \uBCF4\uAD00\uD574\uC694.`}),Te(n)])}function Ta(e,r,a){let n=r.state.invite.wishResidentId,i=!!e.busy["invite-wish"],o=Object.values(r.state.residents).sort((s,l)=>s.displayName.localeCompare(l.displayName,"ko"));return O("fw-invite-wish","\uD76C\uB9DD \uC8FC\uBBFC \uC124\uC815",[t("p",{className:"muted",text:"\uB4F1\uB85D\uB41C \uCE90\uB9AD\uD130\xB7\uD398\uB974\uC18C\uB098 \uC911 \uD55C \uBA85\uC744 \uACE0\uB974\uBA74 \uADF8 \uC8FC\uBBFC\uC744 \uB354 \uC798 \uB9CC\uB098\uC694."}),o.length===0?t("p",{className:"empty",text:"\uB4F1\uB85D\uB41C \uC8FC\uBBFC\uC774 \uC5C6\uC5B4\uC694."}):Ee(e,a,o.map(s=>t("li",{},[t("button",{className:`pick-row${s.residentId===n?" selected":""}`,attrs:{type:"button","aria-pressed":s.residentId===n?"true":"false"},disabled:i,on:{click:()=>{a.setWish(s.residentId)}}},[E(s),t("strong",{text:s.displayName}),q(s),t("small",{className:"muted",text:s.recruited?"\uC601\uC785 \uC644\uB8CC":"\uCD08\uB300 \uB300\uAE30"}),s.residentId===n?m.check("icon"):null])])),"pick-list"),n?y("\uD76C\uB9DD \uC8FC\uBBFC \uD574\uC81C",()=>{a.setWish(null)},{variant:"secondary",disabled:i}):null,Te(a)])}function ur(e,r,a,n){let i=e.sheet;return i?i.kind==="invite-result"?Ma(e,r,a,i.draws,n):i.kind==="invite-chances"?Aa(e,r,a,n):i.kind==="invite-log"?Pa(e,r,a,n):i.kind==="invite-wish"?Ta(e,r,n):null:null}function Ea(e,r){let a=e.world?.state==="ready"?e.world.value:null;if(!a)return null;let{tickets:n,tokens:i}=a.state.wallet;return t("div",{className:"resources invite-counters"},[t("button",{className:"counter ticket",attrs:{type:"button","aria-label":`\uCD08\uB300\uAD8C ${n}\uC7A5 \u2014 \uCD08\uB300\uAD8C \uBC1B\uAE30`},on:{click:()=>r.openDeliveries()}},[t("span",{className:"ticket-mark"},[m.ticket("icon")]),t("span",{className:"counter-value",text:String(n)}),t("span",{className:"counter-plus"},[m.plus("icon tiny")])]),t("span",{className:"counter token",attrs:{"aria-label":`\uC885\uD45C ${i}\uAC1C`}},[t("span",{className:"token-mark"},[m.leaf("icon")]),t("span",{className:"counter-value",text:String(i)})])])}function za(e,r){let a=(n,i,o)=>t("button",{className:`segment${e.inviteTab===n?" selected":""}`,attrs:{type:"button",role:"tab","aria-selected":e.inviteTab===n?"true":"false"},on:{click:()=>r.setInviteTab(n)}},[o,t("span",{text:i})]);return t("div",{className:"segmented invite-tabs",attrs:{role:"tablist","aria-label":"\uCD08\uB300"}},[a("invite","\uC8FC\uBBFC \uCD08\uB300",m.sprout("icon")),a("exchange","\uC885\uD45C \uAD50\uD658",m.leaf("icon"))])}function fr(e,r,a,n,i){let o=n*a.invite.ticketsPerDraw,s=Math.max(0,o-r.state.wallet.tickets),l=Object.keys(r.state.residents).length===0,c=!!e.busy[`invite:${n}`];return t("button",{className:`draw-button${s?" short":""}`,attrs:{type:"button","aria-label":`${n}\uD68C \uCD08\uB300 \u2014 \uCD08\uB300\uAD8C ${o}\uC7A5${s?`, ${s}\uC7A5 \uBD80\uC871`:""}`},disabled:c||s>0||l||r.state.progress.starterResidentId===null,on:{click:()=>{i.draw(n)}}},[t("strong",{className:"draw-title",text:c?"\uCD08\uB300\uD558\uB294 \uC911\u2026":`${n}\uD68C \uCD08\uB300`}),t("span",{className:"draw-cost"},[m.ticket("icon"),`${o}\uC7A5`]),s?t("span",{className:"draw-short"},[m.info("icon tiny"),`\uCD08\uB300\uAD8C ${s}\uC7A5 \uBD80\uC871`]):null])}function Wa(e,r,a,n){let i=Object.values(r.state.residents),o=r.state.invite.wishResidentId?r.state.residents[r.state.invite.wishResidentId]:null,s=i.filter(c=>!c.recruited).length,l=a.invite.guaranteeAfter-r.state.invite.sinceNew+1;return[S(null,[t("button",{className:"menu-row wish-row",attrs:{type:"button"},on:{click:()=>n.openSheet({kind:"invite-wish"})}},[t("span",{className:"menu-icon light"},[m.sprout("icon")]),t("span",{className:"menu-text"},[t("span",{className:"menu-title",text:"\uD76C\uB9DD \uC8FC\uBBFC \uC124\uC815"}),t("span",{className:"menu-detail",text:o?`${o.displayName} \xB7 \uB2E4\uB978 \uC8FC\uBBFC\uBCF4\uB2E4 \uC798 \uB9CC\uB098\uC694`:"\uB4F1\uB85D\uB41C \uCE90\uB9AD\uD130\xB7\uD398\uB974\uC18C\uB098 \uC911\uC5D0\uC11C \uB9CC\uB098\uC694."})]),t("span",{className:"menu-chevron"},[m.chevron()])]),i.length===0?t("div",{className:"invite-empty"},[t("p",{className:"empty",text:"\uCD08\uB300\uD560 \uC8FC\uBBFC\uC774 \uC5C6\uC5B4\uC694. \uBA3C\uC800 \uCE90\uB9AD\uD130\uB098 \uD398\uB974\uC18C\uB098\uB97C \uBD88\uB7EC\uC640 \uC8FC\uC138\uC694."}),y("\uC8FC\uBBFC \uBD88\uB7EC\uC624\uAE30",()=>n.navigate("residents"))]):r.state.progress.starterResidentId===null?t("div",{className:"invite-empty"},[t("p",{className:"empty",text:"\uC2DC\uC791 \uC8FC\uBBFC\uC744 \uBA3C\uC800 \uC815\uD558\uBA74 \uCD08\uB300\uD560 \uC218 \uC788\uC5B4\uC694."}),y("\uC8FC\uBBFC \uD654\uBA74\uC73C\uB85C",()=>n.navigate("residents"))]):null,t("div",{className:"draw-row"},[fr(e,r,a,1,n),fr(e,r,a,a.invite.multiDraw,n)]),t("p",{className:"hint center",text:i.length===0?"\uB4F1\uB85D\uD55C \uC8FC\uBBFC \uC911\uC5D0\uC11C \uC0C8\uB85C\uC6B4 \uC778\uC5F0\uC744 \uB9CC\uB0A0 \uC218 \uC788\uC5B4\uC694.":s>0?`\uC544\uC9C1 \uC624\uC9C0 \uC54A\uC740 \uC8FC\uBBFC ${s}\uBA85 \xB7 \uB2A6\uC5B4\uB3C4 ${Math.max(1,l)}\uBC88\uC9F8 \uCD08\uB300\uC5D0\uB294 \uC0C8 \uC8FC\uBBFC\uC744 \uB9CC\uB098\uC694.`:"\uBAA8\uB450 \uACF5\uBC29\uC5D0 \uC654\uC5B4\uC694. \uB2E4\uC2DC \uB9CC\uB098\uBA74 \uB3CC\uD30C, \uCD5C\uB300 \uB3CC\uD30C \uB4A4\uC5D0\uB294 \uC885\uD45C\uAC00 \uB3FC\uC694."}),t("div",{className:"link-row"},[t("button",{className:"link-button with-icon",attrs:{type:"button"},on:{click:()=>n.openSheet({kind:"invite-chances"})}},[m.info("icon"),t("span",{text:"\uD655\uB960 \uBCF4\uAE30"})]),t("button",{className:"link-button with-icon",attrs:{type:"button"},on:{click:()=>n.openSheet({kind:"invite-log"})}},[m.document("icon"),t("span",{text:"\uCD08\uB300 \uAE30\uB85D"})])])])]}function La(e,r,a,n,i){let o=a.crew.maxBreakthrough,s=r.recruited&&r.breakthrough>=o,l=!!e.busy[`exchange:${r.residentId}`],c=r.recruited?s?"\uCD5C\uB300 \uB3CC\uD30C":`\uB3CC\uD30C ${r.breakthrough}/${o} \u2192 ${r.breakthrough+1}`:"\uCD08\uB300 \uB300\uAE30 \u2192 \uC601\uC785";return t("li",{className:"exchange-row"},[E(r),t("span",{className:"exchange-name"},[t("strong",{text:r.displayName}),t("span",{className:"tag-row"},[q(r),t("small",{className:"muted",text:c})])]),t("button",{className:"button small",text:l?"\uAD50\uD658 \uC911\u2026":"\uAD50\uD658",attrs:{type:"button","aria-label":`${r.displayName}\uC640(\uACFC) \uC885\uD45C \uAD50\uD658`},disabled:l||s||n<a.invite.tokensPerExchange,on:{click:()=>{i.exchange(r.residentId)}}})])}function ja(e,r,a,n){let i=r.state.wallet.tokens,o=Object.values(r.state.residents).sort((c,d)=>Number(c.recruited)-Number(d.recruited)||c.displayName.localeCompare(d.displayName,"ko")),s=Math.max(1,Math.ceil(o.length/2)),l=Math.min(e.invitePage??0,s-1);return[S("\uC885\uD45C \uAD50\uD658",[t("p",{className:"exchange-summary"},[t("span",{className:"token-coin"},[m.leaf("icon")]),t("strong",{text:`${i} / ${a.invite.tokensPerExchange}`}),t("span",{className:"muted",text:` \uC885\uD45C ${a.invite.tokensPerExchange}\uAC1C\uB85C \uC6D0\uD558\uB294 \uC8FC\uBBFC\uC744 \uBC14\uB85C \uB9DE\uC774\uD558\uAC70\uB098 \uB3CC\uD30C\uD574\uC694.`})]),o.length===0?t("p",{className:"empty",text:"\uB4F1\uB85D\uB41C \uC8FC\uBBFC\uC774 \uC5C6\uC5B4\uC694."}):t("ul",{className:"exchange-list"},o.slice(l*2,l*2+2).map(c=>La(e,c,a,i,n))),G("\uAD50\uD658 \uC8FC\uBBFC \uBAA9\uB85D \uACE0\uB974\uAE30",l,Array.from({length:s},(c,d)=>`${d+1} \xB7 ${o.slice(d*2,d*2+2).map(p=>p.displayName).join(" \xB7 ")}`),c=>n.setInvitePage(c))])]}function gr(e,r){let a=e.world?.state==="ready"?e.world.value:null,n=e.content,i=a&&n;return R(e,r,{top:{kind:"sub",title:"\uCD08\uB300",subtitle:"\uC0C8\uB85C\uC6B4 \uC778\uC5F0\uC744 \uB9DE\uC774\uD574\uC694",resources:!1,counters:Ea(e,r)},backdrop:"forest",body:i?[za(e,r),...e.inviteTab==="invite"?Wa(e,a,n,r):ja(e,a,n,r)]:[C("\uC138\uACC4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026")],nav:!0,sheet:i?ur(e,a,n,r):null})}var Oa="http://www.w3.org/2000/svg",tt={locked:"\uC7A0\uAE40",available:"\uCD9C\uBC1C \uAC00\uB2A5",running:"\uD0D0\uD5D8 \uC911",unlocked:"\uC774\uC57C\uAE30 \uC5F4\uB9BC",read:"\uC77D\uC74C"};function ze(e){return t("div",{className:"field-tabs explore-tabs",attrs:{role:"tablist","aria-label":"\uD0D0\uC0AC"}},[U(e,"survey-patrol",{className:"field-tab",label:"\uC870\uC0AC",children:[m.search("icon field-glyph"),t("span",{text:"\uC870\uC0AC"})]}),U(e,"survey-patrol",{className:"field-tab",label:"\uC21C\uCC30",children:[m.compass("icon field-glyph"),t("span",{text:"\uC21C\uCC30"})]}),t("button",{className:"field-tab current",attrs:{type:"button",role:"tab","aria-selected":"true"}},[m.leaf("icon field-glyph"),t("span",{text:"\uC774\uC57C\uAE30 \uD0D0\uD5D8"})])])}function Va(e,r){let a=document.createElementNS(Oa,"svg");a.setAttribute("viewBox","0 0 360 170"),a.setAttribute("class","trail-art"),a.setAttribute("aria-hidden","true");let n=[[60,120],[170,92],[285,60]],i=o=>e.episodes[o].status==="read"?"#5a9a44":o===r?"#fff8e8":"#cdbf9f";return a.innerHTML=`
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
    </g>`,a}function Ba(e,r,a,n){if(a.length<2)return null;let i=t("select",{className:"input",attrs:{"aria-label":"\uD398\uC5B4 \uACE0\uB974\uAE30"},on:{change:()=>n.selectStoryPair(i.value)}},a.map(o=>{let s=r.state.pairs[o.pairId].residentIds.map(l=>r.state.residents[l]?.displayName??"\uC8FC\uBBFC");return t("option",{text:s.join(" \xB7 "),attrs:{value:o.pairId}})}));return i.value=a.some(o=>o.pairId===e.explore.pairId)?e.explore.pairId:a[0].pairId,i}function Da(e,r,a){return t("ol",{className:"episode-row",attrs:{"aria-label":"\uC774\uC57C\uAE30 \uD3B8"}},e.episodes.map(n=>t("li",{},[t("button",{className:`episode-tile ${n.status}${n.index===r?" selected":""}`,attrs:{type:"button","aria-pressed":n.index===r?"true":"false","aria-label":`${n.index+1}\uD3B8 ${n.title} ${tt[n.status]}`},on:{click:()=>a.selectStoryEpisode(n.index)}},[t("span",{className:"episode-icon"},[(n.status==="locked"?m.lock:m.book)("icon big"),n.status==="read"?t("span",{className:"episode-check"},[m.check("icon tiny")]):null]),t("span",{className:"episode-text"},[t("strong",{text:`${n.index+1}\uD3B8`}),t("span",{text:n.title}),t("small",{text:n.status==="locked"?n.reasons[0]??tt.locked:tt[n.status]})])])])))}function Fa(e,r,a,n,i,o){let s=w=>Math.max(0,(r.state.inventory[w]??0)-(r.state.production.protectedStock[w]??0)),l=Object.entries(i.preparations),c=l.every(([w,$])=>s(w)>=$),d=i.participants.map(w=>r.state.residents[w]).filter(Boolean),p=r.state.stories.expedition,f=p&&p.pairId===n.pairId&&p.episode===i.index,g=w=>!!e.busy[w],u=d.filter(w=>Object.values(r.state.production.facilities).some($=>$.residentId===w.residentId)),b;if(i.status==="available"){let w=`depart:${n.pairId}:${i.index}`;b=y(g(w)?"\uCD9C\uBC1C\uD558\uB294 \uC911\u2026":c?"\uD0D0\uD5D8 \uCD9C\uBC1C":"\uC900\uBE44\uBB3C\uC774 \uBD80\uC871\uD574\uC694",()=>{o.depart(n.pairId,i.index)},{disabled:g(w)||!c,attrs:{"data-wide":""}})}else if(i.status==="running"&&f){let w=de(e,r,p);b=t("div",{className:"expedition-running"},[t("p",{className:"running-line"},[m.compass("icon"),t("strong",{text:"\uD0D0\uD5D8 \uC911"}),w.countdown]),w.bar,y(g("expedition-cancel")?"\uCDE8\uC18C\uD558\uB294 \uC911\u2026":"\uD0D0\uD5D8 \uCDE8\uC18C (\uC900\uBE44\uBB3C\uC740 \uBAA8\uB450 \uB3CC\uB824\uBC1B\uC544\uC694)",()=>{o.cancelExpedition()},{variant:"secondary",disabled:g("expedition-cancel")})])}else if((i.status==="unlocked"||i.status==="read")&&i.storyId){let w=i.storyId;b=y(i.status==="read"?"\uB2E4\uC2DC \uC77D\uAE30":i.written?"\uC774\uC5B4 \uC77D\uAE30":"\uC774\uC57C\uAE30 \uC77D\uAE30",()=>o.openStory(n.pairId,i.index,w),{attrs:{"data-wide":""}})}else b=t("div",{className:"locked-reasons"},[t("p",{className:"hint",text:"\uC544\uC9C1 \uB5A0\uB0A0 \uC218 \uC5C6\uC5B4\uC694:"}),t("ul",{},i.reasons.map(w=>t("li",{text:w})))]);return t("div",{className:"expedition-details"},[t("div",{className:"detail-grid"},[t("div",{className:"detail-cell"},[m.clock("icon big"),t("span",{},[t("small",{text:"\uC18C\uC694 \uC2DC\uAC04"}),t("strong",{text:`${i.minutes}\uBD84`})])]),t("div",{className:"detail-cell"},[m.people("icon big"),t("span",{},[t("small",{text:"\uCC38\uC5EC \uC8FC\uBBFC"}),t("strong",{text:`${d.length}\uBA85`})]),t("span",{className:"avatar-row"},d.map(w=>E(w)))]),t("div",{className:"detail-cell wide"},[m.box("icon big"),t("span",{},[t("small",{text:"\uC900\uBE44\uBB3C"}),t("span",{className:"prep-list"},l.map(([w,$])=>t("span",{className:`prep${s(w)>=$?" ok":""}`},[B(w),`${V(a,w)} ${Math.min(s(w),$)}/${$}`,s(w)>=$?m.check("icon tiny"):null])))])]),t("div",{className:"detail-cell wide"},[m.sparkle("icon big"),t("span",{},[t("small",{text:"\uBC1C\uACAC\uD560 \uC218 \uC788\uB294 \uAC83"}),t("strong",{text:n.arc.discovery})])])]),t("p",{className:"hint",text:u.length?`${u.map(w=>w.displayName).join(", ")}\uC740(\uB294) \uCD9C\uBC1C\uD558\uBA74 \uC2DC\uC124\uC5D0\uC11C \uBE60\uC838\uC694. \uC2DC\uC124\uC740 \uAE30\uBCF8 \uD6A8\uC728\uB85C \uACC4\uC18D \uC77C\uD558\uACE0, \uC9C4\uD589 \uC911\uC778 \uC791\uC5C5\uC740 \uCDE8\uC18C\uD558\uC9C0 \uC54A\uC544\uC694.`:"\uC2DC\uC124\uC740 \uADF8\uB300\uB85C \uC77C\uD574\uC694. \uD0D0\uD5D8\uC740 \uC77C\uC0C1 \uC0DD\uC0B0\uACFC \uB530\uB85C \uD558\uB098\uC529 \uB5A0\uB098\uC694."}),b])}function Ga(e,r,a){let i=(e.world?.state==="ready"?e.world.value.state.stories.pairs?.[r.pairId]?.current:null)?.episodes.flatMap((l,c)=>l.state==="read"?[{index:c,storyId:l.storyId}]:[])??[];if(r.completed.length===0&&i.length===0)return S("\uC77D\uC740 \uC774\uC57C\uAE30",[t("p",{className:"empty",text:"\uC544\uC9C1 \uC77D\uC740 \uC774\uC57C\uAE30\uAC00 \uC5C6\uC5B4\uC694."})]);let o=Math.max(1,Math.ceil(r.completed.length/2)),s=Math.min(e.explore.historyPage??0,o-1);return S("\uC77D\uC740 \uC774\uC57C\uAE30",[i.length&&s===0?t("div",{className:"completed-arc"},[t("strong",{text:r.arc.title}),...i.map(({index:l,storyId:c})=>y(`${l+1}\uD3B8 \uB2E4\uC2DC \uC77D\uAE30`,()=>a.openStory(r.pairId,l,c),{variant:"secondary"}))]):null,t("ul",{className:"menu-list"},r.completed.slice().reverse().slice(s*2,s*2+2).map(l=>t("li",{className:"completed-arc"},[t("strong",{text:l.title}),t("span",{className:"row-actions"},l.storyIds.map((c,d)=>t("button",{className:"outline-button small",text:`${d+1}\uD3B8`,attrs:{type:"button","aria-label":`${l.title} ${d+1}\uD3B8 \uB2E4\uC2DC \uC77D\uAE30`},on:{click:()=>a.openStory(r.pairId,d,c)}})))]))),G("\uC77D\uC740 \uC774\uC57C\uAE30 \uBAA9\uB85D \uACE0\uB974\uAE30",s,Array.from({length:o},(l,c)=>`${c+1} \xB7 ${r.completed.slice().reverse().slice(c*2,c*2+2).map(d=>d.title).join(" \xB7 ")}`),l=>a.setExploreHistoryPage(l))])}function qa(e,r,a,n){let i=r.state.stories.expedition,o=i?a.find(c=>c.pairId===i.pairId):null,s=Math.round(n.production.absenceLimitMs/36e5);if(!i||!o)return t("div",{className:"strip offline explore-strip"},[m.compass(),t("span",{text:"\uC9C0\uAE08\uC740 \uB5A0\uB09C \uD0D0\uD5D8\uC774 \uC5C6\uC5B4\uC694."}),t("small",{className:"muted",text:`\uBC29\uCE58 \uB204\uC801 \uCD5C\uB300 ${s}\uC2DC\uAC04`})]);let l=de(e,r,i);return t("div",{className:"strip offline explore-strip"},[m.compass(),t("span",{className:"strip-progress"},[t("span",{},[`${o.episodes[i.episode].title} \xB7 `,l.countdown," \uB0A8\uC74C"]),l.bar]),t("small",{className:"muted",text:`\uBC29\uCE58 \uB204\uC801 \uCD5C\uB300 ${s}\uC2DC\uAC04`})])}function _a(e,r,a,n){let i=e.explore.overview;if(!i||i.state==="loading")return[ze(n),C("\uC774\uC57C\uAE30\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026")];if(i.state==="error")return[ze(n),S(null,[_(i.message),y("\uB2E4\uC2DC \uBD88\uB7EC\uC624\uAE30",()=>{n.loadStoryOverview()})])];let o=i.value.pairs.filter(p=>e.explore.section==="history"||!r.state.pairs[p.pairId]?.archived);if(o.length===0)return[ze(n),S(null,[t("p",{text:"\uD398\uC5B4\uB97C \uB9CC\uB4E4\uBA74 \uB450 \uC8FC\uBBFC\uC758 \uC774\uC57C\uAE30 \uD0D0\uD5D8\uC774 \uC5F4\uB824\uC694."}),t("p",{className:"muted",text:"1\uD3B8\uC740 \uD55C \uC8FC\uBBFC\uB9CC \uACF5\uBC29\uC5D0 \uC640 \uC788\uC5B4\uB3C4 \uB5A0\uB0A0 \uC218 \uC788\uC5B4\uC694."}),y("\uC8FC\uBBFC \uD654\uBA74\uC73C\uB85C",()=>n.navigate("residents"),{variant:"secondary"})])];let s=o.find(p=>p.pairId===e.explore.pairId)??o[0],l=s.episodes.some(p=>p.index===e.explore.selectedEpisode)?e.explore.selectedEpisode:s.episodes.find(p=>p.status!=="read")?.index??2,c=e.explore.section??"episode",d=[["episode","\uD0D0\uD5D8 \uC900\uBE44"],["journey","\uC5EC\uC815"],["history","\uC77D\uC740 \uC774\uC57C\uAE30"]];return[ze(n),Ba(e,r,o,n),t("div",{className:"pill-tabs",attrs:{role:"group","aria-label":"\uC774\uC57C\uAE30 \uD654\uBA74"}},d.map(([p,f])=>t("button",{className:`pill-tab${c===p?" current":""}`,text:f,attrs:{type:"button","aria-pressed":c===p?"true":"false"},on:{click:()=>n.setExploreSection(p)}}))),c==="journey"?t("section",{className:"card trail-card",attrs:{"aria-label":`${s.arc.place} \uC9C0\uB3C4`}},[Va(s,l),t("span",{className:"place-sign",text:s.arc.place})]):null,c==="episode"?S(s.arc.title,[Da(s,l,n),Fa(e,r,a,s,s.episodes[l],n)],{className:"arc-card"}):null,c==="journey"?qa(e,r,o,a):null,c==="history"?Ga(e,s,n):null]}function br(e,r){let a=e.world?.state==="ready"?e.world.value:null;return R(e,r,{top:{kind:"sub",title:"\uD0D0\uC0AC",back:{route:"home",label:"\uD648"},resources:!0},backdrop:"forest",body:a&&e.content?_a(e,a,e.content,r):[C("\uC138\uACC4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026")],nav:!0})}var Ha={calm:"affection",surprise:"curiosity",worry:"fluster",thinking:"inspiration",shy:"fluster"},Ua={joy:"\u266A",affection:"\u2661",curiosity:"?",fluster:"\u{1F4A7}",inspiration:"\u2726",annoyance:"\u{1F4A2}"};function hr(e){let r=e in Ve?e:Ha[e];return r?ne(Ve[r],{className:"emotion-bubble emotion-art",fallback:()=>t("span",{className:"emotion-bubble",text:Ua[r]})}):null}function xe(e,r){return e.state.residents[r]?.displayName??"\uC8FC\uBBFC"}function Ka(e,r,a,n){let i=a?.participants??[],o=n?.kind==="line"?n.speakerId:n?.kind==="choice"?n.askerId:null;return t("section",{className:"story-stage",attrs:{"aria-hidden":"true"}},[ne(le[e].scene,{className:"stage-art",fallback:()=>t("span",{className:"stage-shelf"})}),t("div",{className:`stage-cast cast-${i.length}`},i.map(s=>{let l=r.state.residents[s];if(!l)return null;let c=o!==s?null:n?.kind==="line"?hr(n.emotion):hr("curiosity"),d=t("span",{className:`stage-spot${o===s?" speaking":""}`},[c,K(l)]),p=Je(l.image.placement);return d.style.setProperty("--mark-bottom",`${p.bottom}%`),d.style.setProperty("--mark-left",`${p.left}%`),d}))])}function Qa(e,r,a,n){if(a.story.state==="loading")return t("div",{className:"dialogue-box loading",attrs:{role:"status"}},[t("p",{text:"\uC774\uC57C\uAE30\uB97C \uC4F0\uB294 \uC911\uC774\uC5D0\uC694\u2026"}),t("p",{className:"muted",text:"\uCC98\uC74C \uC5EC\uB294 \uC774\uC57C\uAE30\uB294 \uC5B8\uC5B4 \uBAA8\uB378\uC774 \uC9C0\uAE08 \uC368\uC694. \uC7A0\uC2DC \uAC78\uB9B4 \uC218 \uC788\uC5B4\uC694."})]);if(a.story.state==="error")return t("div",{className:"dialogue-box error",attrs:{role:"alert"}},[t("p",{text:a.story.message}),t("div",{className:"row-actions"},[y("\uAC19\uC740 \uC774\uC57C\uAE30\uB85C \uB2E4\uC2DC \uC2DC\uB3C4",()=>n.retryStory()),y("\uB2EB\uAE30",()=>n.closeStory(),{variant:"secondary"})])]);let o=a.story.value.segments;if(a.index>=o.length){let c=!!e.busy[`read:${a.storyId}`];return t("div",{className:"dialogue-box end"},[t("p",{className:"end-line",text:"\uC774\uC57C\uAE30\uB294 \uC5EC\uAE30\uAE4C\uC9C0\uC608\uC694."}),t("p",{className:"muted",text:"\uB2E4 \uC77D\uC73C\uBA74 \uC774 \uC7A5\uBA74\uC744 \uD568\uAED8\uD55C \uC8FC\uBBFC\uB4E4\uC758 \uAE30\uC5B5\uC5D0 \uB0A8\uC544\uC694."}),y(c?"\uAE30\uB85D\uD558\uB294 \uC911\u2026":"\uB2E4 \uC77D\uC74C",()=>{n.finishStory()},{disabled:c,attrs:{"data-wide":""}})])}let l=o[a.index];if(l.kind==="choice"){let c=rt(r,a),d=c?.choice?.optionId??null,p=!!e.busy[`choose:${a.storyId}`],f=l.question.length+l.options.reduce((g,u)=>g+u.text.length,0)>150;return f&&(a.choiceView??"question")==="question"?t("div",{className:"dialogue-box choice"},[t("span",{className:"speaker-tag"},[m.leaf("icon tiny"),xe(r,l.askerId)]),t("p",{className:"line",text:l.question}),y("\uB2F5\uBCC0 \uACE0\uB974\uAE30",()=>n.setChoiceView("answers"))]):t("div",{className:"dialogue-box choice"},[t("span",{className:"speaker-tag"},[m.leaf("icon tiny"),xe(r,l.askerId)]),f?y("\uC9C8\uBB38 \uB2E4\uC2DC \uBCF4\uAE30",()=>n.setChoiceView("question"),{variant:"secondary"}):t("p",{className:"line",text:l.question}),t("div",{className:"choice-options",attrs:{role:"group","aria-label":"\uB300\uB2F5 \uACE0\uB974\uAE30"}},l.options.map(g=>t("button",{className:`choice-option${d===g.optionId?" chosen":""}`,text:g.text,attrs:{type:"button","aria-pressed":d===g.optionId?"true":"false"},disabled:p||d!==null||c?.state==="read",on:{click:()=>{n.chooseAnswer(g.optionId)}}}))),d||c?.state==="read"?t("p",{className:"muted",text:d?"\uC774\uBBF8 \uB300\uB2F5\uD588\uC5B4\uC694.":"\uB2E4\uC2DC \uC77D\uC744 \uB54C\uB294 \uB300\uB2F5\uC774 \uB0A8\uC9C0 \uC54A\uC544\uC694."}):t("p",{className:"muted",text:"\uB300\uB2F5\uC740 \uD55C \uBC88\uB9CC \uD560 \uC218 \uC788\uC5B4\uC694. \uBB3C\uC5B4\uBCF8 \uC8FC\uBBFC\uB9CC \uAE30\uC5B5\uD574\uC694."})])}return t("div",{className:`dialogue-box${l.kind==="narration"?" narration-only":""}`},[l.kind==="line"?t("span",{className:"speaker-tag"},[m.leaf("icon tiny"),xe(r,l.speakerId)]):null,t("p",{className:l.kind==="line"?"line":"narration",text:ge(l)[a.textPage??0]??l.text})])}function rt(e,r){let a=e.state.stories.pairs[r.pairId];return[a?.current,...a?.completed??[]].find(i=>i?.episodes[r.episode]?.storyId===r.storyId)?.episodes[r.episode]}function Ya(e,r,a){let n=r.story.state==="ready"?r.story.value:null,i=n?n.segments.slice(0,Math.min(r.index+1,n.segments.length)):[],o=Math.max(1,i.length),s=Math.min(r.backlogPage??o-1,o-1);return O("fw-backlog","\uAE30\uB85D",[t("ol",{className:"backlog-list"},i.slice(s,s+1).map(l=>t("li",{className:`backlog-${l.kind}`},[l.kind==="line"?t("strong",{text:xe(e,l.speakerId)}):l.kind==="choice"?t("strong",{text:xe(e,l.askerId)}):null,t("span",{text:l.kind==="choice"?l.question:l.text})]))),o>1?t("div",{className:"resident-pages"},[y("\uC774\uC804",()=>a.setBacklogPage(s-1),{variant:"secondary",disabled:s===0}),t("span",{text:`${s+1} / ${o}`,attrs:{"aria-live":"polite"}}),y("\uB2E4\uC74C",()=>a.setBacklogPage(s+1),{variant:"secondary",disabled:s+1>=o})]):null,y("\uB2EB\uAE30",()=>a.toggleBacklog(),{variant:"secondary",attrs:{"data-wide":""}})])}function wr(e,r){let a=e.world?.state==="ready"?e.world.value:null,n=e.reader;if(!a||!n)return R(e,r,{top:{kind:"sub",title:"\uACF5\uBC29 \uC774\uC57C\uAE30",back:{route:"explore",label:"\uD0D0\uC0AC"},resources:!1},backdrop:"wood",body:[t("p",{className:"muted",text:"\uC5F4\uB9B0 \uC774\uC57C\uAE30\uAC00 \uC5C6\uC5B4\uC694."})],nav:!0});let i=n.story.state==="ready"?n.story.value:null,o=i?.segments.length??0,s=i?.segments[n.index],l=ge(s),c=(n.textPage??0)>=l.length-1,d=s?.kind==="choice"&&!rt(a,n)?.choice&&rt(a,n)?.state!=="read",p=t("div",{className:"resources reader-tools"},[t("button",{className:"chip-button",attrs:{type:"button","aria-pressed":n.backlog?"true":"false"},disabled:!i,on:{click:()=>r.toggleBacklog()}},[m.book("icon"),t("span",{text:"\uAE30\uB85D"})]),t("button",{className:`chip-button${n.auto?" active":""}`,attrs:{type:"button","aria-pressed":n.auto?"true":"false"},disabled:!i,on:{click:()=>r.toggleAuto()}},[m.chevron("icon"),t("span",{text:n.auto?"\uC790\uB3D9 \uB044\uAE30":"\uC790\uB3D9"})])]),f=R(e,r,{top:{kind:"sub",title:"\uACF5\uBC29 \uC774\uC57C\uAE30",subtitle:i?.title??"\uC774\uC57C\uAE30",resources:!1,counters:p},backdrop:"wood",storyLayout:!0,body:[Ka(ie(e),a,i,s),Qa(e,a,n,r),i&&n.index<o?t("div",{className:"reader-foot"},[t("span",{className:"count-pill",text:`${n.index+1} / ${o}`}),y(n.index===o-1&&c?"\uB2E4 \uC77D\uACE0 \uBCF4\uAD00":"\uACC4\uC18D",()=>{n.index===o-1&&c?r.finishStory():r.advanceStory()},{disabled:d||!!e.busy[`read:${n.storyId}`],attrs:{"data-wide":""}})]):null],nav:!1,sheet:n.backlog?Ya(a,n,r):null}),g=f.querySelector(".back-button, .back-spacer");if(g){let u=t("button",{className:"back-button",attrs:{type:"button","aria-label":"\uC774\uC57C\uAE30 \uB2EB\uAE30"},on:{click:()=>r.closeStory()}},[m.back()]);g.replaceWith(u)}return f}var yr,at=!1;function We(e){let r=()=>{clearTimeout(yr),yr=setTimeout(()=>{!at&&a.isConnected&&e.onSearch(a.value)},300)},a=t("input",{className:"search-input",attrs:{id:e.id,type:"search",placeholder:e.placeholder,value:e.value,autocomplete:"off"},on:{compositionstart:()=>at=!0,compositionend:()=>{at=!1,r()},input:()=>r()}});return t("label",{className:"search-field",attrs:{for:e.id}},[m.search("icon"),t("span",{className:"visually-hidden",text:e.placeholder}),a])}function nt(e){let r=(a,n)=>t("li",{className:`step-item${e===a?" current":e>a?" done":""}`,attrs:e===a?{"aria-current":"step"}:{}},[t("span",{className:"step-number",text:String(a)}),t("span",{className:"step-label",text:n})]);return t("ol",{className:"steps card",attrs:{"aria-label":"\uC8FC\uBBFC \uB4F1\uB85D \uB2E8\uACC4"}},[r(1,"\uC790\uB8CC \uC120\uD0DD"),t("li",{className:"step-arrow",attrs:{"aria-hidden":"true"},text:"\u2192"}),r(2,"\uC7AC\uAD6C\uCD95"),t("li",{className:"step-arrow",attrs:{"aria-hidden":"true"},text:"\u2192"}),r(3,"\uC2DC\uC791 \uC8FC\uBBFC")])}function Xa(e,r){if(e.sources.state==="loading")return C("\uCE90\uB9AD\uD130\xB7\uD398\uB974\uC18C\uB098\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026");if(e.sources.state==="error")return t("div",{},[_(e.sources.message),y("\uB2E4\uC2DC \uBD88\uB7EC\uC624\uAE30",()=>{r.loadSources()},{variant:"secondary"})]);let a=e.query.trim().toLowerCase(),n=e.sources.value.filter(s=>s.kind===e.kindTab).filter(s=>!a||s.name.toLowerCase().includes(a));if(n.length===0)return t("p",{className:"empty",text:a?"\uC774\uB984\uC774 \uB9DE\uB294 \uC790\uB8CC\uAC00 \uC5C6\uC5B4\uC694.":`${ve[e.kindTab]}\uAC00 \uC544\uC9C1 \uC5C6\uC5B4\uC694. \uC5D4\uC9C4\uC758 \uC11C\uC7AC\uC5D0\uC11C \uBA3C\uC800 \uB9CC\uB4E4\uC5B4 \uC8FC\uC138\uC694.`});let i=Math.ceil(n.length/2),o=Math.min(e.sourcePage??0,i-1);return t("div",{className:"source-pages"},[t("ul",{className:"source-list"},n.slice(o*2,o*2+2).map(s=>t("li",{},[t("button",{className:"menu-row source-row",attrs:{type:"button"},disabled:s.residentId!==null,on:{click:()=>{r.chooseSource(s)}}},[t("span",{className:"menu-icon light"},[m.document()]),t("span",{className:"menu-text"},[t("span",{className:"menu-title",text:s.name}),t("span",{className:"menu-detail",text:s.residentId?"\uC774\uBBF8 \uC774 \uC138\uACC4\uC758 \uC8FC\uBBFC\uC774\uC5D0\uC694":s.summary||"\uC124\uBA85 \uC5C6\uC74C"})]),t("span",{className:"menu-chevron"},[s.residentId?m.check():m.chevron()])])]))),i>1?t("div",{className:"resident-pages"},[y("\uC774\uC804",()=>r.setRegisterSourcePage(o-1),{variant:"secondary",disabled:o===0}),t("span",{text:`${o+1} / ${i}`,attrs:{"aria-live":"polite"}}),y("\uB2E4\uC74C",()=>r.setRegisterSourcePage(o+1),{variant:"secondary",disabled:o+1>=i})]):null])}function Ja(e,r){return[S("\uC790\uB8CC \uC120\uD0DD",[t("p",{className:"muted",text:"\uC8FC\uBBFC\uC73C\uB85C \uB9DE\uC774\uD560 \uCE90\uB9AD\uD130\uB098 \uD398\uB974\uC18C\uB098\uB97C \uACE8\uB77C \uC8FC\uC138\uC694. \uC6D0\uBCF8\uC740 \uC77D\uAE30\uB9CC \uD558\uACE0 \uBC14\uAFB8\uC9C0 \uC54A\uC544\uC694."}),t("div",{className:"pill-tabs two",attrs:{role:"tablist","aria-label":"\uC790\uB8CC \uC885\uB958"}},["character","persona"].map(a=>t("button",{className:`pill-tab${e.kindTab===a?" current":""}`,text:ve[a],attrs:{type:"button",role:"tab","aria-selected":e.kindTab===a?"true":"false"},on:{click:()=>r.setRegisterKind(a)}}))),We({id:"fw-source-search",value:e.query,placeholder:"\uC774\uB984\uC73C\uB85C \uCC3E\uAE30",onSearch:a=>r.setRegisterQuery(a)}),Xa(e,r)],{id:"fw-source-title"})]}function Za(e){if(!e||e.state==="loading")return C("\uC6D0\uB798 \uC124\uC815\uC744 \uC77D\uB294 \uC911\u2026");if(e.state==="error")return _(e.message);let r=e.value;return t("div",{className:"readonly-box"},[t("p",{text:r.summary||"\uC6D0\uBCF8\uC5D0 \uC801\uD78C \uC124\uBA85\uC774 \uC5C6\uC5B4\uC694."})])}function en(e,r){if(!r||r.state!=="ready"||!e.content)return null;let a=re(e.content,r.value.talent.talentId),n=r.value.talent.field;return t("div",{className:"talent-card",attrs:{"aria-label":"\uB9DE\uC774\uD558\uBA74 \uC815\uD574\uC9C0\uB294 \uC804\uBB38 \uBD84\uC57C\uC640 \uD2B9\uAE30"}},[t("p",{className:"talent-field"},[me[n]("icon"),t("strong",{text:`\uC804\uBB38 \uBD84\uC57C \xB7 ${J[n]}`})]),a?t("p",{className:"talent-name"},[t("strong",{text:`\uD2B9\uAE30 \xB7 ${a.name}`}),t("span",{text:a.description})]):null,t("p",{className:"muted",text:"\uC6D0\uB798 \uC124\uC815\uC744 \uBC14\uD0D5\uC73C\uB85C \uC815\uD574\uC838\uC694. \uC8FC\uBBFC\uC744 \uB9DE\uC774\uD558\uBA74 \uBC14\uB00C\uC9C0 \uC54A\uC544\uC694."})])}function tn(e,r,a){let n=t("input",{className:"visually-hidden",attrs:{id:"fw-register-image",type:"file",accept:"image/png,image/webp"},on:{change:()=>{let o=n.files?.[0];if(n.value="",!!o){if(o.size>a){r.notify(`\uD30C\uC77C\uC774 ${Math.round(a/1024/1024)}MiB\uB97C \uB118\uC5B4\uC694. \uB2E4\uB978 \uADF8\uB9BC\uC744 \uACE8\uB77C \uC8FC\uC138\uC694.`,"error");return}r.pickPendingImage(o)}}}}),i=e.pendingImage;return t("div",{className:"image-drop"},[n,t("label",{className:"drop-zone checker",attrs:{for:"fw-register-image"}},[i?t("img",{className:"drop-preview",attrs:{src:i.previewUrl,alt:""}}):m.addImage("icon drop-icon"),t("span",{className:"drop-text"},[t("strong",{text:i?i.file.name:"\uC8FC\uBBFC \uADF8\uB9BC \uC9C1\uC811 \uB4F1\uB85D"}),t("span",{text:i?`${Math.max(1,Math.round(i.file.size/1024))} KB \xB7 \uB4F1\uB85D\uD558\uBA74 WebP\uB85C \uC800\uC7A5\uD574\uC694`:"PNG \xB7 WebP \u2192 WebP \uC800\uC7A5"})])]),i?y("\uACE0\uB978 \uADF8\uB9BC \uBE7C\uAE30",()=>r.clearPendingImage(),{variant:"secondary"}):null])}function rn(e,r,a){let n=e.selected,i=r.content?.residents.worldSettingMax??200,o=!!r.busy["rebuild-suggestion"],s=!!r.busy[`register:${n.kind}:${n.id}`],l=Object.keys(r.busy).some(b=>b.startsWith("image-upload:")&&r.busy[b]),c=s||l,d=t("span",{className:"counter-text",text:`${e.draft.length} / ${i}`,attrs:{id:"fw-draft-count"}}),p=t("textarea",{className:"textarea",attrs:{id:"fw-world-setting",maxlength:String(i),rows:"4",placeholder:"\uC774 \uC138\uACC4\uC5D0\uC11C \uC5B4\uB5A4 \uC8FC\uBBFC\uC778\uC9C0 \uC801\uC5B4 \uC8FC\uC138\uC694.","aria-describedby":"fw-draft-count"},on:{input:()=>{d.textContent=`${p.value.length} / ${i}`,a.setDraft(p.value),u.disabled=!p.value.trim()}}});p.value=e.draft;let f=e.preview?.state==="ready",g=e.panel??"source",u=y("\uB2E4\uC74C: \uC8FC\uBBFC \uADF8\uB9BC",()=>a.setRegisterPanel("image"),{disabled:!e.draft.trim()});return[t("section",{className:"card selected-source"},[t("button",{className:"menu-row quiet",attrs:{type:"button"},on:{click:()=>a.backToSources()}},[t("span",{className:"menu-icon light"},[m.document()]),t("span",{className:"menu-text"},[t("small",{className:"muted",text:"\uC120\uD0DD\uD55C \uC790\uB8CC"}),t("span",{className:"menu-title",text:`${ve[n.kind]} \xB7 ${n.name}`})]),t("span",{className:"menu-chevron"},[m.chevron()])])]),g==="source"?t("section",{className:"card rebuild",attrs:{"aria-labelledby":"fw-original"}},[t("h2",{className:"section-title doc",text:"\uC6D0\uB798 \uC124\uC815",attrs:{id:"fw-original"}}),Za(e.preview),en(r,e.preview),y("\uB2E4\uC74C: \uACF5\uBC29 \uC124\uC815",()=>a.setRegisterPanel("setting"),{disabled:!f})]):null,g==="setting"?t("section",{className:"card rebuild"},[t("label",{className:"section-title",text:"\uACF5\uBC29 \uC138\uACC4 \uC124\uC815",attrs:{for:"fw-world-setting"}}),t("div",{className:"textarea-wrap"},[p,d]),t("div",{className:"rule-actions even"},[t("button",{className:"button",attrs:{type:"button"},on:{click:()=>{p.focus(),p.setSelectionRange(p.value.length,p.value.length)}}},[m.pencil("icon"),t("span",{text:"\uC218\uC815"})]),t("button",{className:"button secondary",attrs:{type:"button"},disabled:o||!f,on:{click:()=>{a.suggestSetting()}}},[m.sparkle("icon"),t("span",{text:o?"\uC81C\uC548 \uBC1B\uB294 \uC911\u2026":"\uB2E4\uC2DC \uC81C\uC548"})])]),t("p",{className:"hint",text:"\uB2E4\uC2DC \uC81C\uC548\uC740 \uC5D4\uC9C4\uC758 \uAE30\uBCF8 \uC5B8\uC5B4 \uBAA8\uB378\uC5D0 \uD55C \uBC88 \uC694\uCCAD\uD574\uC694. \uD655\uC815\uD558\uAE30 \uC804\uC5D0\uB294 \uC800\uC7A5\uB418\uC9C0 \uC54A\uC544\uC694."}),t("div",{className:"rule-actions even"},[y("\uC774\uC804",()=>a.setRegisterPanel("source"),{variant:"secondary"}),u])]):null,g==="image"?S("\uC8FC\uBBFC \uADF8\uB9BC \uC9C1\uC811 \uB4F1\uB85D",[tn(e,a,r.content?.residents.maxImageBytes??20*1024*1024),t("p",{className:"hint center"},[m.info("icon"),"\uC6D0\uBCF8 \uD504\uB85C\uD544\uC740 \uBC14\uB00C\uC9C0 \uC54A\uC544\uC694."])],{id:"fw-register-image-title"}):null,g==="image"?t("button",{className:"button big-action",attrs:{type:"button","data-wide":""},disabled:c||!f,on:{click:()=>{a.confirmRegister(!0,(b,w)=>a.uploadResidentImage(b,w))}}},[m.leaf("icon"),t("span",{text:s?"\uB4F1\uB85D\uD558\uB294 \uC911\u2026":l?"\uADF8\uB9BC \uC800\uC7A5 \uC911\u2026":"\uC7AC\uAD6C\uCD95 \uD655\uC815"}),m.chevron("icon")]):null,g==="image"?t("button",{className:"button secondary",attrs:{type:"button","data-wide":""},disabled:c||!f,on:{click:()=>{a.confirmRegister(!1,async()=>{})}}},[m.clock("icon"),t("span",{text:"\uB098\uC911\uC5D0 \uADF8\uB9BC \uB4F1\uB85D"})]):null,g==="image"?y("\uC774\uC804: \uACF5\uBC29 \uC124\uC815",()=>a.setRegisterPanel("setting"),{variant:"secondary"}):null]}function an(e,r,a,n){let i=Object.values(r.state.residents),o=!!a.busy["choose-starter"],s=Math.max(1,i.length),l=Math.min(e.starterPage??0,s-1);return[S("\uC2DC\uC791 \uC8FC\uBBFC",[t("p",{className:"muted",text:"\uACF5\uBC29\uC5D0\uC11C \uD568\uAED8 \uC2DC\uC791\uD560 \uC8FC\uBBFC \uD55C \uBA85\uC744 \uACE8\uB77C \uC8FC\uC138\uC694. \uB2E4\uB978 \uC8FC\uBBFC\uC740 \uCD08\uB300\uB85C \uB9DE\uC774\uD574\uC694."}),t("ul",{className:"starter-list",attrs:{role:"radiogroup","aria-label":"\uC2DC\uC791 \uC8FC\uBBFC"}},i.slice(l,l+1).map(c=>t("li",{},[t("button",{className:`starter-option${e.starterChoice===c.residentId?" chosen":""}`,attrs:{type:"button",role:"radio","aria-checked":e.starterChoice===c.residentId?"true":"false"},on:{click:()=>n.setStarterChoice(c.residentId)}},[t("span",{className:"starter-stage"},[K(c)]),t("strong",{text:c.displayName}),q(c)])]))),s>1?t("div",{className:"resident-pages"},[y("\uC774\uC804",()=>n.setRegisterStarterPage(l-1),{variant:"secondary",disabled:l===0}),t("span",{text:`${l+1} / ${s}`,attrs:{"aria-live":"polite"}}),y("\uB2E4\uC74C",()=>n.setRegisterStarterPage(l+1),{variant:"secondary",disabled:l+1>=s})]):null],{id:"fw-starter-title"}),t("button",{className:"button big-action",attrs:{type:"button","data-wide":""},disabled:o||!e.starterChoice,on:{click:()=>{n.confirmStarter()}}},[m.house("icon"),t("span",{text:o?"\uB9DE\uC774\uD558\uB294 \uC911\u2026":e.starterChoice?`${r.state.residents[e.starterChoice]?.displayName??"\uC120\uD0DD\uD55C \uC8FC\uBBFC"}\uACFC(\uC640) \uC2DC\uC791\uD558\uAE30`:"\uC8FC\uBBFC\uC744 \uACE8\uB77C \uC8FC\uC138\uC694"})]),y("\uC8FC\uBBFC \uB354 \uB4F1\uB85D\uD558\uAE30",()=>n.registerAnother(),{variant:"secondary",attrs:{"data-wide":""}})]}function vr(e,r){let a=e.world?.state==="ready"?e.world.value:null,n=e.register,i;return!a||!n?i=[C("\uC138\uACC4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026")]:n.step===3?i=[nt(3),...an(n,a,e,r)]:n.step===2&&n.selected?i=[nt(2),...rn(n,e,r)]:i=[nt(1),...Ja(n,r)],R(e,r,{top:{kind:"sub",title:"\uC8FC\uBBFC \uB4F1\uB85D",back:{route:"residents",label:"\uC8FC\uBBFC"},resources:!1},backdrop:"wood",body:i,nav:!1})}var xr="ABCDEFGHIJKLMNOPQRSTUVWXYZ";function nn(e,r){return[...e?.relationStages??[]].reverse().find(n=>r>=n.from)?.label??"\u2013"}function kr(e,r,a){return a.state.residents[_e(e,r.residentId)]??null}function on(e,r){let a=r.map((n,i)=>`A\u2013${xr[i+1]??"?"}`).join(" \xB7 ");return S(null,[t("div",{className:"relation-hero"},[E(e,"large"),t("span",{className:"hero-label",text:`\uACF5\uC720 \uC8FC\uBBFC \xB7 ${e.displayName}`}),t("strong",{className:"hero-pairs",text:r.length?a:"\uC544\uC9C1 \uD398\uC5B4\uAC00 \uC5C6\uC5B4\uC694"}),t("p",{className:"hero-note",text:r.length>1?"\uB450 \uAD00\uACC4\uB294 \uAC19\uC740 \uC138\uACC4\uC5D0\uC11C \uC774\uC5B4\uC838\uC694":r.length===1?"\uAC19\uC740 \uC138\uACC4\uC5D0\uC11C \uC774\uC5B4\uC9C0\uB294 \uAD00\uACC4\uC608\uC694":"\uB2E4\uB978 \uC8FC\uBBFC\uACFC \uD398\uC5B4\uB97C \uB9CC\uB4E4 \uC218 \uC788\uC5B4\uC694"})])],{className:"hero-card"})}function sn(e,r,a,n,i,o){let s=kr(e,a,n),l=i.relationsEditing,c=!!i.busy[`pair-archive:${e.pairId}`];return t("li",{className:"pair-row card"},[t("div",{className:"pair-faces"},[t("span",{className:"pair-letters"},[t("span",{className:"letter",text:"A"}),"\xD7",t("span",{className:"letter",text:xr[r+1]??"?"})]),t("span",{className:"faces"},[E(a),t("span",{className:"times",text:"\xD7"}),E(s)]),t("span",{className:"partner-name",text:s?.displayName??"\uC54C \uC218 \uC5C6\uB294 \uC8FC\uBBFC"})]),t("div",{className:"pair-info"},[t("div",{className:"relation-now"},[t("small",{text:"\uD604\uC7AC \uAD00\uACC4"}),t("strong",{text:nn(i.content,e.familiarity)})]),t("p",{className:"recent"},[t("span",{className:"recent-label",text:"\uCD5C\uADFC \uC0AC\uAC74"}),t("span",{text:e.lastEvent?.summary??"\uC544\uC9C1 \uC5C6\uC5B4\uC694"})]),l?t("div",{className:"pair-actions"},[y(c?"\uBCF4\uAD00 \uC911\u2026":"\uBCF4\uAD00",()=>{o.archivePair(e.pairId)},{variant:"secondary",disabled:c})]):t("div",{className:"pair-actions"},[y("\uAE30\uC5B5 \uBCF4\uAE30",()=>o.openMemory(e.pairId),{variant:"secondary"}),U(o,"pair-guidelines",{className:"outline-button",label:"\uC9C0\uCE68 \uAD00\uB9AC",children:[m.gear("icon"),t("span",{text:"\uC9C0\uCE68 \uAD00\uB9AC"})]})])])])}function ln(e,r,a,n,i){return e.length===0?null:S("\uBCF4\uAD00\uD55C \uD398\uC5B4",[t("ul",{className:"archived-list"},e.map(o=>{let s=kr(o,r,a),l=!!n.busy[`pair-restore:${o.pairId}`];return t("li",{className:"archived-row"},[E(s),t("span",{className:"archived-name",text:`${r.displayName} \xD7 ${s?.displayName??"?"}`}),y(l?"\uB418\uB3CC\uB9AC\uB294 \uC911\u2026":"\uB418\uB3CC\uB9AC\uAE30",()=>{i.restorePair(o.pairId)},{variant:"secondary",disabled:l})])}))],{id:"fw-archived"})}function dn(e,r,a,n){let i=new Map(Object.values(r.state.pairs).filter(s=>s.residentIds.includes(e.residentId)).map(s=>[_e(s,e.residentId),s.archived])),o=Object.values(r.state.residents).filter(s=>s.residentId!==e.residentId);return t("div",{className:"sheet-backdrop"},[t("section",{className:"sheet card",attrs:{role:"dialog","aria-modal":"true","aria-labelledby":"fw-pair-add"}},[t("h2",{className:"section-title",text:"\uD398\uC5B4 \uCD94\uAC00",attrs:{id:"fw-pair-add"}}),t("p",{className:"muted",text:`${e.displayName}\uC640(\uACFC) \uC774\uC5B4\uC9C8 \uC8FC\uBBFC\uC744 \uACE8\uB77C \uC8FC\uC138\uC694. \uCE90\uB9AD\uD130\uB4E0 \uD398\uB974\uC18C\uB098\uB4E0 \uAD1C\uCC2E\uC544\uC694. \uC9C0\uB09C \uAE30\uC5B5\uC774 \uC0C8\uB85C \uC0DD\uAE30\uC9C0\uB294 \uC54A\uC544\uC694.`}),o.length===0?t("p",{className:"empty",text:"\uD568\uAED8\uD560 \uB2E4\uB978 \uC8FC\uBBFC\uC774 \uC544\uC9C1 \uC5C6\uC5B4\uC694. \uC8FC\uBBFC \uBD88\uB7EC\uC624\uAE30\uC5D0\uC11C \uBA3C\uC800 \uB4F1\uB85D\uD574 \uC8FC\uC138\uC694."}):t("ul",{className:"candidate-list"},o.map(s=>{let l=i.has(s.residentId),c=qe(e.residentId,s.residentId);return t("li",{},[t("button",{className:"candidate",attrs:{type:"button"},disabled:l||!!a.busy[c],on:{click:()=>{n.addPair(e.residentId,s.residentId)}}},[E(s),t("span",{className:"candidate-name",text:s.displayName}),q(s),t("span",{className:"candidate-state",text:l?i.get(s.residentId)?"\uBCF4\uAD00\uD568\uC5D0 \uC788\uC5B4\uC694":"\uC774\uBBF8 \uD398\uC5B4":a.busy[c]?"\uB9CC\uB4DC\uB294 \uC911\u2026":"\uACE0\uB974\uAE30"})])])})),y("\uB2EB\uAE30",()=>n.closeSheet(),{variant:"secondary",attrs:{"data-wide":""}})])])}function Nr(e,r){let a=e.world?.state==="ready"?e.world.value:null,n=a?a.state.residents[e.focusResidentId??""]??null:null,i={top:{kind:"sub",title:"\uAD00\uACC4",subtitle:"\uAC19\uC740 \uC138\uACC4\uC5D0\uC11C \uC774\uC5B4\uC9C0\uB294 \uAD00\uACC4",back:{route:"residents",label:"\uC8FC\uBBFC"},resources:!1},backdrop:"forest",nav:!0};if(!a||!n)return R(e,r,{...i,body:[C(a?"\uC8FC\uBBFC\uC744 \uACE0\uB978 \uB4A4 \uAD00\uACC4\uB97C \uC5F4\uC5B4 \uC8FC\uC138\uC694.":"\uC138\uACC4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026")]});let o=Object.values(a.state.pairs).filter(l=>l.residentIds.includes(n.residentId)).sort((l,c)=>l.createdAt.localeCompare(c.createdAt)),s=o.filter(l=>!l.archived);return R(e,r,{...i,body:[on(n,s),t("ul",{className:"pair-list"},s.map((l,c)=>sn(l,c,n,a,e,r))),t("p",{className:"notice-strip"},[t("span",{className:"bang",text:"!"}),"\uD398\uC5B4 \uC9C0\uC815\uC740 \uC5F0\uC778 \uC120\uC5B8\uC774 \uC544\uB2C8\uC5D0\uC694."]),t("div",{className:"rule-actions"},[t("button",{className:"button wide-main",attrs:{type:"button"},on:{click:()=>r.openSheet({kind:"pair-add",residentId:n.residentId})}},[m.people("icon"),t("span",{text:"\uD398\uC5B4 \uCD94\uAC00"})]),t("button",{className:`button secondary${e.relationsEditing?" pressed":""}`,attrs:{type:"button","aria-pressed":e.relationsEditing?"true":"false"},on:{click:()=>r.toggleRelationsEditing()}},[m.archive("icon"),t("span",{text:e.relationsEditing?"\uBCC0\uACBD \uB05D\uB0B4\uAE30":"\uBCC0\uACBD \xB7 \uBCF4\uAD00"})])]),e.relationsEditing?ln(o.filter(l=>l.archived),n,a,e,r):null],sheet:e.sheet?.kind==="pair-add"?dn(n,a,e,r):null})}function Sr(e){return`${Math.max(1,Math.round(e/1024)).toLocaleString("ko-KR")} KB`}function it(e,r,a,n,i,o,s){let l=`fw-placement-${e}`,c=t("span",{className:"slider-value",text:s(n)}),d=t("input",{className:"slider",attrs:{id:l,type:"range",min:String(i.min),max:String(i.max),step:"1",value:String(n),"aria-valuetext":s(n)},on:{input:()=>c.textContent=s(Number(d.value)),change:()=>o.setPlacementDraft({[e]:Number(d.value)})}});return t("div",{className:"setting-row slider-row"},[r("icon"),t("label",{className:"setting-label",text:a,attrs:{for:l}}),d,c])}function cn(e,r,a){let n=!!r.busy[`image-restore:${e.residentId}`],i=o=>t("li",{className:"history-item"},[t("span",{className:"history-thumb checker"},[t("img",{attrs:{src:o.url,alt:""}})]),t("span",{className:"menu-text"},[t("span",{className:"menu-title",text:o.fileName||"\uC774\uC804 \uADF8\uB9BC"}),t("span",{className:"menu-detail",text:`${o.width} \xD7 ${o.height} \xB7 ${Sr(o.bytes)}`})]),y(n?"\uB418\uB3CC\uB9AC\uB294 \uC911\u2026":"\uC774 \uADF8\uB9BC\uC73C\uB85C",()=>{a.restoreResidentImage(e.residentId,o.reference)},{disabled:n})]);return t("div",{className:"sheet-backdrop"},[t("section",{className:"sheet card",attrs:{role:"dialog","aria-modal":"true","aria-labelledby":"fw-image-history"}},[t("h2",{className:"section-title",text:"\uC774\uC804 \uADF8\uB9BC",attrs:{id:"fw-image-history"}}),e.image.history.length?t("ul",{className:"history-list"},e.image.history.map(i)):t("p",{className:"empty",text:"\uB418\uB3CC\uB9B4 \uC774\uC804 \uADF8\uB9BC\uC774 \uC5C6\uC5B4\uC694."}),t("p",{className:"hint",text:"\uCD5C\uADFC 3\uC7A5\uAE4C\uC9C0 \uBCF4\uAD00\uD574\uC694. \uC9C0\uB09C \uC774\uC57C\uAE30 \uB2E4\uC2DC\uBCF4\uAE30\uC5D0\uB3C4 \uC9C0\uAE08 \uADF8\uB9BC\uC774 \uC4F0\uC5EC\uC694."}),y("\uB2EB\uAE30",()=>a.closeSheet(),{variant:"secondary",attrs:{"data-wide":""}})])])}function pn(e,r,a){let n=r.content?.residents.placement,i=r.placementDraft??e.image.placement,o=e.image.current,s=!!r.busy[`image-upload:${e.residentId}`],l=!!r.busy[`placement:${e.residentId}`],c=JSON.stringify(i)!==JSON.stringify(e.image.placement),d=t("input",{className:"visually-hidden",attrs:{id:"fw-image-file",type:"file",accept:"image/png,image/webp"},disabled:s,on:{change:()=>{let f=d.files?.[0];d.value="",f&&a.uploadResidentImage(e.residentId,f)}}}),p=f=>f>0?`+${f}`:String(f);return[t("section",{className:"card image-card"},[t("p",{className:"target-ribbon"},[t("span",{className:"muted",text:"\uB300\uC0C1"}),m.leaf("icon"),t("strong",{text:e.displayName})]),t("div",{className:"image-stage checker"},[K(e,{placement:i,marker:!0})]),t("div",{className:"file-facts"},o?[t("strong",{text:o.fileName||"resident.webp"}),t("span",{text:`${o.width} \xD7 ${o.height} / ${Sr(o.bytes)}`})]:[t("strong",{text:"\uC544\uC9C1 \uADF8\uB9BC\uC774 \uC5C6\uC5B4\uC694"}),t("span",{className:"muted",text:"\uADF8\uB9BC\uC774 \uC5C6\uC5B4\uB3C4 \uBAA8\uB4E0 \uAE30\uB2A5\uC744 \uC4F8 \uC218 \uC788\uC5B4\uC694"})]),d,t("label",{className:`button big-action file-button${s?" busy":""}`,attrs:{for:"fw-image-file","data-wide":"","aria-disabled":s?"true":"false"}},[t("span",{text:s?"WebP\uB85C \uC800\uC7A5\uD558\uB294 \uC911\u2026":o?"\uD30C\uC77C \uC120\uD0DD \xB7 \uAD50\uCCB4":"\uD30C\uC77C \uC120\uD0DD"})]),t("ul",{className:"rules"},[t("li",{text:"PNG \xB7 \uC815\uC801 WebP \uC5C5\uB85C\uB4DC (20MiB \xB7 4096px\uAE4C\uC9C0)"}),t("li",{text:"\uD22C\uBA85\uB3C4 \uC720\uC9C0 \xB7 WebP \uD488\uC9C8 95 \uC800\uC7A5"}),t("li",{text:"PNG \uC6D0\uBCF8\uC740 \uB530\uB85C \uBCF4\uAD00\uD558\uC9C0 \uC54A\uC544\uC694."})]),n?t("div",{className:"setting-block sliders"},[it("scale",m.zoom,"\uADF8\uB9BC \uD06C\uAE30",i.scale,n.scale,a,f=>`${f}%`),it("offsetX",m.arrows,"\uC88C\uC6B0 \uC704\uCE58",i.offsetX,n.offsetX,a,p),it("markerHeight",m.updown,"\uAC10\uC815 \uD45C\uC2DC \uB192\uC774",i.markerHeight,n.markerHeight,a,p)]):null,t("button",{className:"button big-action",attrs:{type:"button","data-wide":""},disabled:l||!c,on:{click:()=>{a.applyPlacement(e.residentId)}}},[t("span",{text:l?"\uC801\uC6A9\uD558\uB294 \uC911\u2026":c?"\uC801\uC6A9":"\uC801\uC6A9\uB428"})]),t("div",{className:"rule-actions even"},[t("button",{className:"button secondary",attrs:{type:"button"},on:{click:()=>a.resetPlacementDraft()}},[m.restore("icon"),t("span",{text:"\uAE30\uBCF8 \uBC30\uCE58"})]),t("button",{className:"button secondary",attrs:{type:"button"},disabled:e.image.history.length===0,on:{click:()=>a.openSheet({kind:"image-history",residentId:e.residentId})}},[m.image("icon"),t("span",{text:`\uC774\uC804 \uADF8\uB9BC${e.image.history.length?` ${e.image.history.length}`:""}`})])])])]}function $r(e,r){let a=e.world?.state==="ready"?e.world.value:null,n=a?a.state.residents[e.focusResidentId??""]??null:null;return R(e,r,{top:{kind:"sub",title:"\uC8FC\uBBFC \uADF8\uB9BC",back:{route:"residents",label:"\uC8FC\uBBFC"},resources:!1},backdrop:"wood",body:n?pn(n,e,r):[C(a?"\uC8FC\uBBFC\uC744 \uACE0\uB978 \uB4A4 \uC8FC\uBBFC \uADF8\uB9BC\uC744 \uC5F4\uC5B4 \uC8FC\uC138\uC694.":"\uC138\uACC4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026")],nav:!0,sheet:n&&e.sheet?.kind==="image-history"?cn(n,e,r):null})}function Ir(e,r,a,n){let i=r.state.residents[n],o=e.content;if(!i||!o)return null;let s=re(o,i.talentId),l=o.facilities.find(c=>c.field===i.field);return O("fw-field",`${i.displayName}\uC758 \uC804\uBB38 \uBD84\uC57C \xB7 \uD2B9\uAE30`,[t("div",{className:"talent-card"},[t("p",{className:"talent-field"},[me[i.field]("icon"),t("strong",{text:`${J[i.field]} \uBD84\uC57C`}),t("span",{className:"muted",text:` \xB7 ${l?.name??""}`})]),t("p",{className:"muted",text:`${l?.name??"\uAC19\uC740 \uBD84\uC57C \uC2DC\uC124"}\uC5D0 \uBC30\uCE58\uD558\uBA74 \uCC98\uB9AC \uC18D\uB3C4\uAC00 \uBE68\uB77C\uC838\uC694: \uAE30\uBCF8 ${D(ee(o,0))} \u2192 \uC9C0\uAE08 ${D(ee(o,i.breakthrough))} (\uB3CC\uD30C ${i.breakthrough}/${o.crew.maxBreakthrough}).`}),s?t("p",{className:"talent-name"},[t("strong",{text:`\uD2B9\uAE30 \xB7 ${s.name}`}),t("span",{text:s.description})]):null]),t("p",{className:"hint",text:"\uC804\uBB38 \uBD84\uC57C\uC640 \uD2B9\uAE30\uB294 \uC8FC\uBBFC\uC744 \uB9DE\uC774\uD560 \uB54C \uC6D0\uB798 \uC124\uC815\uC744 \uBC14\uD0D5\uC73C\uB85C \uC815\uD574\uC84C\uC5B4\uC694. \uC6D0\uBCF8 \uCE74\uB4DC\uB294 \uBC14\uB00C\uC9C0 \uC54A\uC544\uC694."}),y("\uB2EB\uAE30",()=>a.closeSheet(),{variant:"secondary",attrs:{"data-wide":""}})])}var Cr={registered:"\uB4F1\uB85D",setting:"\uC138\uACC4 \uC124\uC815 \uC218\uC815",name:"\uC774\uB984 \uC218\uC815",recruited:"\uC601\uC785",image:"\uADF8\uB9BC \uB4F1\uB85D",image_restored:"\uC774\uC804 \uADF8\uB9BC\uC73C\uB85C",image_history_cleared:"\uADF8\uB9BC \uC774\uB825 \uC815\uB9AC",placement:"\uBC30\uCE58 \uBCC0\uACBD"};function Rr(e){let r=new Date(e);return Number.isNaN(r.getTime())?e:new Intl.DateTimeFormat("ko-KR",{dateStyle:"medium",timeStyle:"short"}).format(r)}function ot(e,r){return r?t("div",{className:"source-field"},[t("strong",{text:e}),t("p",{text:r})]):null}function mn(e){return t("li",{className:"change-row"},[t("span",{className:"change-kind",text:Cr[e.kind]??e.kind}),t("span",{className:"change-detail",text:e.detail}),t("time",{className:"change-time",text:Rr(e.at),attrs:{datetime:e.at}})])}function Mr(e,r,a,n){let i=e.state.residents[n];if(!i)return null;let o=r.content?.residents.worldSettingMax??200,s=!!r.busy[`resident-setting:${n}`],l=r.sheet?.kind==="profile"&&r.sheet.residentId===n?r.sheet:null,c=l?.draft??i.worldSetting,d=t("span",{className:"counter-text",text:`${c.length} / ${o}`}),p=t("textarea",{className:"textarea",attrs:{id:"fw-profile-setting",maxlength:String(o),rows:"4","aria-describedby":"fw-profile-count"},on:{input:()=>{d.textContent=`${p.value.length} / ${o}`,a.rememberProfile({draft:p.value})}}});p.value=c,d.id="fw-profile-count";let{source:f}=i,g=t("div",{className:"compare-box source"},[t("h3",{className:"compare-title"},[m.document("icon"),"\uC6D0\uB798 \uC124\uC815"]),t("p",{className:"muted",text:`${f.name} \xB7 ${Rr(f.takenAt)}\uC5D0 \uC77D\uC74C \xB7 \uC6D0\uBCF8\uC740 \uBC14\uB00C\uC9C0 \uC54A\uC544\uC694`}),ot("\uC124\uBA85",f.description),ot("\uC131\uACA9",f.personality),ot("\uC0C1\uD669",f.scenario),!f.description&&!f.personality&&!f.scenario?t("p",{className:"muted",text:"\uC6D0\uBCF8\uC5D0 \uC801\uD78C \uC124\uBA85\uC774 \uC5C6\uC5B4\uC694."}):null]),u=t("div",{className:"profile-panel"},[t("form",{className:"compare-box world",on:{submit:v=>{v.preventDefault(),p.value.trim()&&p.value!==i.worldSetting&&a.updateWorldSetting(n,p.value)}}},[t("label",{className:"compare-title",attrs:{for:"fw-profile-setting"}},[m.leaf("icon"),"\uACF5\uBC29 \uC138\uACC4 \uC124\uC815"]),p,d,t("button",{className:"button small",text:s?"\uC800\uC7A5 \uC911\u2026":"\uC218\uC815 \uC800\uC7A5",attrs:{type:"submit"},disabled:s})])]),b=t("div",{className:"profile-panel"},[g]),w=t("ol",{className:"change-list"}),$=Math.max(1,Math.ceil(i.changes.length/2)),W=Math.min(l?.historyPage??0,$-1);function A(v){W=Math.max(0,Math.min($-1,v)),a.rememberProfile({historyPage:W}),w.replaceChildren(...i.changes.slice(W*2,W*2+2).map(mn))}A(W);let ae=t("div",{className:"profile-panel"},[t("h3",{className:"subhead",text:"\uBCC0\uACBD \uC774\uB825"}),i.changes.length?w:t("p",{className:"muted",text:"\uC544\uC9C1 \uBCC0\uACBD \uC774\uB825\uC774 \uC5C6\uC5B4\uC694."}),G("\uBCC0\uACBD \uC774\uB825 \uACE0\uB974\uAE30",W,Array.from({length:$},(v,k)=>`${k+1} \xB7 ${i.changes.slice(k*2,k*2+2).map(I=>Cr[I.kind]??I.kind).join(" \xB7 ")}`),A)]),Q=[u,b,ae],M=["\uACF5\uBC29 \uC124\uC815","\uC6D0\uB798 \uC124\uC815","\uBCC0\uACBD \uC774\uB825"].map((v,k)=>t("button",{className:"profile-tab",text:v,attrs:{type:"button","aria-pressed":k===0?"true":"false"},on:{click:()=>{a.rememberProfile({panel:k}),h(k)}}}));function h(v){Q.forEach((k,I)=>k.hidden=I!==v),M.forEach((k,I)=>k.setAttribute("aria-pressed",I===v?"true":"false"))}return h(l?.panel??0),t("div",{className:"sheet-backdrop"},[t("section",{className:"sheet card",attrs:{role:"dialog","aria-modal":"true","aria-labelledby":"fw-profile"}},[t("div",{className:"sheet-head"},[t("h2",{className:"section-title",text:`${i.displayName} \uD504\uB85C\uD544`,attrs:{id:"fw-profile"}}),q(i),y("\uB2EB\uAE30",()=>a.closeSheet(),{variant:"secondary"})]),t("div",{className:"profile-identity"},[E(i,"large"),t("div",{className:"profile-identity-text"},[t("strong",{text:i.displayName}),t("span",{text:i.recruited?"\uACF5\uBC29 \uC8FC\uBBFC":"\uCD08\uB300 \uB300\uAE30"}),t("button",{className:"outline-button",text:"\uAD00\uACC4 \uBCF4\uAE30",attrs:{type:"button"},on:{click:()=>{if(p.value!==i.worldSetting){a.notify("\uC218\uC815\uD55C \uACF5\uBC29 \uC124\uC815\uC744 \uC800\uC7A5\uD55C \uB4A4 \uAD00\uACC4\uB97C \uBCFC \uC218 \uC788\uC5B4\uC694.");return}a.openRelations(n)}}})])]),t("div",{className:"profile-tabs",attrs:{"aria-label":"\uD504\uB85C\uD544 \uB0B4\uC6A9 \uC120\uD0DD"}},M),...Q])])}var un=[{id:"all",label:"\uC804\uCCB4"},{id:"character",label:"\uCE90\uB9AD\uD130"},{id:"persona",label:"\uD398\uB974\uC18C\uB098"}],Le=[{id:"all",label:"\uBAA8\uB450"},{id:"recruited",label:"\uC601\uC785\uD55C \uC8FC\uBBFC"},{id:"waiting",label:"\uCD08\uB300 \uB300\uAE30"}];function fn(e,r){let a=Le[(Le.findIndex(i=>i.id===e.filter)+1)%Le.length],n=Le.find(i=>i.id===e.filter);return t("div",{className:"search-bar"},[We({id:"fw-resident-search",value:e.query,placeholder:"\uC774\uB984\uC73C\uB85C \uCC3E\uAE30",onSearch:i=>r.setResidentsQuery(i)}),t("button",{className:`icon-button filter${e.filter==="all"?"":" active"}`,attrs:{type:"button","aria-label":`\uBCF4\uAE30: ${n.label} (\uB204\uB974\uBA74 ${a.label})`},on:{click:()=>r.setResidentsFilter(a.id)}},[m.filter()]),e.filter==="all"?null:t("span",{className:"filter-chip",text:n.label})])}function gn(e,r){return t("div",{className:"pill-tabs",attrs:{role:"tablist","aria-label":"\uC8FC\uBBFC \uC885\uB958"}},un.map(a=>t("button",{className:`pill-tab${e.tab===a.id?" current":""}`,text:a.label,attrs:{type:"button",role:"tab","aria-selected":e.tab===a.id?"true":"false"},on:{click:()=>r.setResidentsTab(a.id)}})))}function bn(e,r){let a=J[e.field];return t("button",{className:"tag field",attrs:{type:"button","aria-label":`${e.displayName} \uC804\uBB38 \uBD84\uC57C ${a} \u2014 \uD2B9\uAE30 \uBCF4\uAE30`},on:{click:()=>r.openSheet({kind:"field",residentId:e.residentId})}},[me[e.field]("icon tiny"),t("span",{text:a})])}function hn(e,r){return t("li",{className:"resident-list-item"},[t("button",{className:"resident-list-open",attrs:{type:"button","aria-label":`${e.displayName} \uC790\uC138\uD788 \uBCF4\uAE30`},on:{click:()=>r.selectResident(e.residentId)}},[E(e),t("span",{className:"resident-list-copy"},[t("strong",{text:e.displayName}),t("span",{text:`${J[e.field]} \xB7 ${e.recruited?"\uC601\uC785 \uC644\uB8CC":"\uCD08\uB300 \uB300\uAE30"}`})]),m.chevron("icon")])])}function st(e,r,a){return t("button",{className:"detail-action",attrs:{type:"button"},on:{click:a}},[e("icon"),t("span",{text:r})])}function wn(e,r,a){let n=a?.crew.maxBreakthrough??5,i=a?ee(a,0):0,o=a?ee(a,e.breakthrough):0,s=re(a,e.talentId),l=Object.entries(r.state.production.facilities).find(([,p])=>p.residentId===e.residentId)?.[0],c=a?.facilities.find(p=>p.id===l),d=e.recruited?c?c.field===e.field?`${c.name}\uC5D0\uC11C \uCC98\uB9AC \uC18D\uB3C4 +${D(o)}`:`${c.name}\uC5D0 \uC788\uC9C0\uB9CC \uBD84\uC57C\uAC00 \uB2EC\uB77C \uD6A8\uACFC\uAC00 \uC5C6\uC5B4\uC694.`:"\uC544\uC9C1 \uBC30\uCE58\uD558\uC9C0 \uC54A\uC558\uC5B4\uC694. \uACF5\uBC29 \uC791\uC5C5 \u2192 \uBC30\uCE58 \uBCC0\uACBD.":"\uCD08\uB300\uD558\uBA74 \uC2DC\uC124\uC5D0 \uBC30\uCE58\uD560 \uC218 \uC788\uC5B4\uC694.";return t("div",{className:"passive-block"},[t("p",{className:"passive"},[m.leaf("icon tiny"),t("strong",{text:"\uD328\uC2DC\uBE0C"}),` ${J[e.field]} \uC2DC\uC124 \uCC98\uB9AC \uC18D\uB3C4`]),s?t("p",{className:"talent-line"},[m.sparkle("icon tiny"),t("strong",{text:`\uD2B9\uAE30 ${s.name}`}),` ${s.description}`]):null,t("p",{className:"muted",text:`\uAE30\uBCF8 \uD6A8\uACFC ${D(i)} \u2192 \uD604\uC7AC ${D(o)} \xB7 ${d}`}),t("p",{className:"breakthrough"},[t("span",{text:`\uB3CC\uD30C ${e.breakthrough}/${n}`}),t("span",{className:"leaf-pips",attrs:{"aria-hidden":"true"}},Array.from({length:n},(p,f)=>t("span",{className:`pip${f<e.breakthrough?" on":""}`})))])])}function yn(e,r,a,n){return S(null,[t("div",{className:"resident-detail"},[t("span",{className:"detail-stage"},[K(e)]),t("div",{className:"detail-info"},[t("strong",{className:"detail-name",text:e.displayName}),t("span",{className:"tag-row"},[q(e),bn(e,n)]),wn(e,r,a)])]),t("div",{className:"detail-actions"},[st(m.image,"\uC8FC\uBBFC \uADF8\uB9BC",()=>n.openResidentImage(e.residentId)),st(m.document,"\uD504\uB85C\uD544",()=>n.openSheet({kind:"profile",residentId:e.residentId})),st(m.heart,"\uAD00\uACC4",()=>n.openRelations(e.residentId))]),e.recruited?null:t("button",{className:"button",text:"\uCD08\uB300\uD558\uB7EC \uAC00\uAE30",attrs:{type:"button"},on:{click:()=>n.navigate("invite")}})],{className:"detail-card"})}function vn(e,r,a){let n=r.residentsView,i=Object.values(e.state.residents),o=Wt(e.state,n),s=e.state.residents[n.selectedId??""]??null;if(n.detailOpen&&s)return[t("button",{className:"outline-button residents-back",text:"\u2190 \uC8FC\uBBFC \uBAA9\uB85D",attrs:{type:"button"},on:{click:()=>a.showResidentsList()}}),yn(s,e,r.content,a)];let l=2,c=Math.max(1,Math.ceil(o.length/l)),d=Math.min(n.page??0,c-1),p=i.length===0?t("div",{className:"empty-state"},[t("p",{text:"\uC544\uC9C1 \uC8FC\uBBFC\uC774 \uC5C6\uC5B4\uC694."}),t("p",{className:"muted",text:"\uCE90\uB9AD\uD130\uB098 \uD398\uB974\uC18C\uB098\uB97C \uBD88\uB7EC\uC640 \uC774 \uC138\uACC4\uC758 \uC8FC\uBBFC\uC73C\uB85C \uB9DE\uC774\uD574 \uBCF4\uC138\uC694."})]):o.length===0?t("p",{className:"empty",text:"\uC870\uAC74\uC5D0 \uB9DE\uB294 \uC8FC\uBBFC\uC774 \uC5C6\uC5B4\uC694."}):t("ul",{className:"resident-grid"},o.slice(d*l,(d+1)*l).map(f=>hn(f,a)));return[fn(n,a),t("section",{className:"card resident-board",attrs:{"aria-label":"\uC8FC\uBBFC \uBAA9\uB85D"}},[gn(n,a),p,G("\uC8FC\uBBFC \uBAA9\uB85D \uACE0\uB974\uAE30",d,Array.from({length:c},(f,g)=>`${g+1} \xB7 ${o.slice(g*l,(g+1)*l).map(u=>u.displayName).join(" \xB7 ")}`),f=>a.setResidentsPage(f))]),t("button",{className:"button big-action",attrs:{type:"button","data-wide":""},on:{click:()=>a.openRegister(1)}},[m.people("icon"),t("span",{text:"\uC8FC\uBBFC \uBD88\uB7EC\uC624\uAE30"})])]}function Ar(e,r){let a=e.world?.state==="ready"?e.world.value:null,n=e.sheet?.kind==="profile"&&a?Mr(a,e,r,e.sheet.residentId):e.sheet?.kind==="field"&&a?Ir(e,a,r,e.sheet.residentId):null;return R(e,r,{top:{kind:"sub",title:"\uC8FC\uBBFC",resources:!1},backdrop:"forest",body:a?vn(a,e,r):[C("\uC138\uACC4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026")],nav:!0,sheet:n})}function lt(e,r,a){return t("div",{className:"preview-row"},[e("icon"),t("span",{text:r}),t("strong",{text:a})])}function je(e,r,a){let n=!!e.busy.restore,i=t("input",{className:"visually-hidden",attrs:{type:"file",accept:"application/json,.json",id:a},disabled:n,on:{change:()=>{let l=i.files?.[0];l&&r.selectRestoreFile(l),i.value=""}}}),o=e.restore,s=o?.summary;return t("div",{className:"restore"},[i,t("label",{className:"menu-row",attrs:{for:a}},[t("span",{className:"menu-icon"},[m.download()]),t("span",{className:"menu-text"},[t("span",{className:"menu-title",text:"\uBC31\uC5C5 \uBD88\uB7EC\uC624\uAE30"}),t("span",{className:"menu-detail",text:o?o.fileName:"\uC0C8 \uC138\uACC4\uB85C \uBCF5\uC6D0"})]),t("span",{className:"menu-chevron"},[m.chevron()])]),t("div",{className:"preview-box",attrs:{"aria-live":"polite"}},[t("p",{className:"preview-head"},[m.eye("icon"),t("strong",{text:"\uBCF5\uC6D0 \uBBF8\uB9AC\uBCF4\uAE30"})]),s?t("div",{className:"preview-rows"},[lt(m.residents,"\uC8FC\uBBFC",`${s.residents}\uBA85`),lt(m.pair,"\uD398\uC5B4",`${s.pairs}\uAC1C`),lt(m.image,"\uADF8\uB9BC",`${s.pictures}\uAC1C`)]):t("p",{className:"muted",text:"\uBC31\uC5C5 \uD30C\uC77C\uC744 \uACE0\uB974\uBA74 \uB2F4\uAE34 \uB0B4\uC6A9\uC744 \uBA3C\uC800 \uBCF4\uC5EC \uB4DC\uB824\uC694."})]),t("button",{className:"button big-action",attrs:{type:"button","data-wide":""},disabled:!s||n,on:{click:()=>{r.confirmRestore()}}},[m.restore("icon"),t("span",{text:n?"\uBCF5\uC6D0\uD558\uB294 \uC911\u2026":"\uC0C8 \uC138\uACC4\uB85C \uBCF5\uC6D0"})]),t("p",{className:"hint center"},[m.info("icon"),"\uD604\uC7AC \uC138\uACC4\uB294 \uB36E\uC5B4\uC4F0\uC9C0 \uC54A\uC544\uC694."])])}function xn(e){let r=new Date(e);if(Number.isNaN(r.getTime()))return"\uC54C \uC218 \uC5C6\uC74C";let a=new Intl.DateTimeFormat("ko-KR",{hour:"2-digit",minute:"2-digit",hour12:!1}).format(r);return r.toDateString()===new Date().toDateString()?`\uC624\uB298 ${a}`:`${new Intl.DateTimeFormat("ko-KR",{month:"long",day:"numeric"}).format(r)} ${a}`}function Tr(e){return e>=1024*1024?`${(e/(1024*1024)).toFixed(1)} MB`:e>=1024?`${(e/1024).toFixed(1)} KB`:`${e} B`}function kn(e){let r=e.storage,a;if(!r||r.state==="loading")a=C("\uD655\uC778\uD558\uB294 \uC911\u2026");else if(r.state==="error")a=_(r.message);else{let n=[[m.image,"\uC8FC\uBBFC \uADF8\uB9BC","residentImagesBytes"],[m.landscape,"\uBC30\uACBD","backgroundsBytes"],[m.document,"\uAE30\uB85D","recordsBytes"]],i=Math.max(1,...n.map(([,,o])=>r.value[o]));a=t("div",{className:"usage-rows"},n.map(([o,s,l])=>{let c=r.value[l],d=t("span",{className:"usage-fill"});return d.style.width=c>0?`max(0.9em, ${Math.round(c/i*100)}%)`:"0",t("div",{className:"usage-row"},[o("icon"),t("span",{className:"usage-label",text:s}),t("span",{className:"usage-bar",attrs:{role:"presentation"}},[d]),t("span",{className:"usage-size",text:Tr(c)})])}))}return S("\uC800\uC7A5 \uACF5\uAC04 \uC0AC\uC6A9\uB7C9",[a,t("p",{className:"hint center"},[m.info("icon"),"\uADF8\uB9BC\uC740 WebP\uB85C \uBCF4\uAD00\uD574\uC694."])],{id:"fw-usage"})}function Nn(e,r){let a=!!e.busy.backup;return t("button",{className:"menu-row",attrs:{type:"button"},disabled:a,on:{click:()=>{r.downloadBackup()}}},[t("span",{className:"menu-icon"},[m.upload()]),t("span",{className:"menu-text"},[t("span",{className:"menu-title",text:a?"\uBC31\uC5C5 \uB9CC\uB4DC\uB294 \uC911\u2026":"\uBC31\uC5C5 \uB0B4\uBCF4\uB0B4\uAE30"}),t("span",{className:"menu-detail",text:"\uC138\uACC4 \xB7 \uC7AC\uD654 \xB7 \uCC3D\uACE0 \uD3EC\uD568 \xB7 \uBE44\uBC00\uD0A4 \uC81C\uC678"})]),t("span",{className:"menu-chevron"},[m.chevron()])])}function Pr(e,r,a,n,i){return t("button",{className:"menu-row quiet",attrs:{type:"button"},on:{click:()=>e.navigate(r)}},[t("span",{className:"menu-icon quiet"},[a()]),t("span",{className:"menu-text"},[t("span",{className:"menu-title",text:n}),t("span",{className:"menu-detail",text:i})]),t("span",{className:"menu-chevron"},[m.chevron()])])}function Er(e,r){let a=e.world?.state==="ready"?e.world.value:null,n=a?[t("section",{className:"card saved",attrs:{"aria-label":"\uC800\uC7A5 \uC0C1\uD0DC"}},[t("p",{className:"saved-title"},[t("span",{className:"check"},[m.check()]),"\uC800\uC7A5 \uC644\uB8CC"]),t("p",{className:"saved-time",text:`\uB9C8\uC9C0\uB9C9 \uC800\uC7A5 ${xn(a.updatedAt)}`})]),kn(e),S(null,[Nn(e,r),je(e,r,"fw-backup-restore")],{className:"menu"}),S(null,[t("button",{className:"menu-row",attrs:{type:"button"},on:{click:()=>r.openSheet({kind:"history-cleanup"})}},[t("span",{className:"menu-icon light"},[m.image()]),t("span",{className:"menu-text"},[t("span",{className:"menu-title",text:"\uADF8\uB9BC \uC774\uB825 \uC815\uB9AC"}),t("span",{className:"menu-detail",text:"\uB2E4\uB978 \uACF3\uC5D0\uC11C \uC4F0\uB294 \uADF8\uB9BC\uC740 \uC720\uC9C0"})]),t("span",{className:"menu-chevron"},[m.chevron()])]),Pr(r,"worlds",m.house,"\uB2E4\uB978 \uC138\uACC4","\uC138\uACC4 \uACE0\uB974\uAE30 \xB7 \uC0C8\uB85C \uB9CC\uB4E4\uAE30"),Pr(r,"diagnostics",m.info,"\uC5F0\uACB0 \uC810\uAC80","\uC5D4\uC9C4 \uC5F0\uACB0\uACFC \uADF8\uB9BC \uC800\uC7A5 \uACBD\uB85C \uD655\uC778")],{className:"menu"})]:[C("\uC138\uACC4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026")];return R(e,r,{top:{kind:"sub",title:"\uC800\uC7A5\xB7\uBC31\uC5C5",back:{route:"settings",label:"\uC124\uC815"},resources:!1},backdrop:"wood",body:n,nav:!0,sheet:a&&e.sheet?.kind==="history-cleanup"?Sn(a.state,e,r):null})}function Sn(e,r,a){let n=Object.values(e.residents).reduce((s,l)=>s+l.image.history.length,0),i=Object.values(e.residents).flatMap(s=>s.image.history).reduce((s,l)=>s+l.bytes,0),o=!!r.busy["image-history-clear"];return t("div",{className:"sheet-backdrop"},[t("section",{className:"sheet card",attrs:{role:"dialog","aria-modal":"true","aria-labelledby":"fw-history-cleanup"}},[t("h2",{className:"section-title",text:"\uADF8\uB9BC \uC774\uB825 \uC815\uB9AC",attrs:{id:"fw-history-cleanup"}}),n?t("p",{text:`\uC8FC\uBBFC\uB4E4\uC758 \uC774\uC804 \uADF8\uB9BC ${n}\uC7A5(${Tr(i)})\uC744 \uC815\uB9AC\uD574\uC694. \uC9C0\uAE08 \uC4F0\uB294 \uADF8\uB9BC\uC740 \uADF8\uB300\uB85C\uC774\uACE0, \uC815\uB9AC\uD55C \uADF8\uB9BC\uC740 '\uC774\uC804 \uADF8\uB9BC'\uC5D0\uC11C \uB418\uB3CC\uB9B4 \uC218 \uC5C6\uC5B4\uC694.`}):t("p",{className:"empty",text:"\uC815\uB9AC\uD560 \uC774\uC804 \uADF8\uB9BC\uC774 \uC5C6\uC5B4\uC694."}),t("p",{className:"hint",text:"\uB2E4\uB978 \uACF3\uC5D0\uC11C \uC4F0\uB294 \uADF8\uB9BC \uD30C\uC77C\uC740 \uAC24\uB7EC\uB9AC\uC5D0 \uADF8\uB300\uB85C \uB0A8\uC544\uC694."}),n?y(o?"\uC815\uB9AC\uD558\uB294 \uC911\u2026":`${n}\uC7A5 \uC815\uB9AC\uD558\uAE30`,()=>{a.clearImageHistory()},{disabled:o,attrs:{"data-wide":""}}):null,y("\uB2EB\uAE30",()=>a.closeSheet(),{variant:"secondary",attrs:{"data-wide":""}})])])}function $n(e,r,a){let n=!!r.busy["rename-nickname"],i=e.state.settings.playerNickname,o=t("input",{className:"input",attrs:{id:"fw-set-nick",maxlength:"24",autocomplete:"off",value:r.settingsNicknameDraft?.worldId===e.worldId?r.settingsNicknameDraft.value:i},on:{input:()=>a.rememberSettingsNickname(e.worldId,o.value)}});return t("form",{className:"setting-row",on:{submit:s=>{s.preventDefault();let l=o.value.trim();l&&l!==i&&a.saveSettingsNickname(e.worldId,o.value)}}},[m.leaf("icon row-leaf"),t("label",{className:"setting-label",text:"\uB2C9\uB124\uC784",attrs:{for:"fw-set-nick"}}),t("span",{className:"setting-field"},[o,t("button",{className:"button small",text:n?"\uC800\uC7A5 \uC911\u2026":"\uC218\uC815",attrs:{type:"submit"},disabled:n})])])}function In(e,r,a){return t("div",{className:"setting-row"},[t("span",{className:"setting-label",text:"\uC9C0\uBA74 \uC124\uC815"}),t("button",{className:"button small",text:"\uD648\uC5D0\uC11C \uC601\uC5ED \uD3B8\uC9D1",attrs:{type:"button"},on:{click:()=>a.openGroundEditor()}})])}function Cn(e){return t("div",{className:"setting-row"},[m.leaf("icon row-leaf"),t("span",{className:"setting-label",text:"\uD604\uC2E4 \uB0A0\uC528"}),t("span",{className:"setting-field"},[t("span",{className:"input readonly"},[m.weather("icon"),t("span",{text:"\uB3C4\uC2DC \uBBF8\uC124\uC815"})]),U(e,"weather",{className:"button small",label:"\uD604\uC2E4 \uB0A0\uC528 \uBCC0\uACBD",children:[t("span",{text:"\uBCC0\uACBD"})]})])])}function Rn(e,r){let a=t("input",{className:"slider",attrs:{id:"fw-font-size",type:"range",min:String(Z.min),max:String(Z.max),step:String(Z.step),value:String(e.fontSize),"aria-valuetext":`${e.fontSize}px`},on:{change:()=>r.setFontSize(Number(a.value))}});return t("div",{className:"setting-block"},[t("div",{className:"setting-row slider-row"},[m.leaf("icon row-leaf"),t("label",{className:"setting-label",text:"\uAE00\uC790 \uD06C\uAE30",attrs:{for:"fw-font-size"}}),a,t("span",{className:"slider-value",text:`${e.fontSize}px`})]),t("p",{className:"font-preview",text:"\uC774\uB807\uAC8C \uD45C\uC2DC\uB3FC\uC694."})])}function Mn(e,r){let a=[{id:"auto",label:`\uC790\uB3D9 (${St[Oe(new Date)]})`},{id:"spring",label:"\uBD04"},{id:"summer",label:"\uC5EC\uB984"},{id:"autumn",label:"\uAC00\uC744"},{id:"winter",label:"\uACA8\uC6B8"}];return t("div",{className:"setting-block"},[t("div",{className:"setting-row"},[m.leaf("icon row-leaf"),t("span",{className:"setting-label",text:"\uACC4\uC808",attrs:{id:"fw-season-label"}})]),t("div",{className:"chip-row season-chips",attrs:{role:"group","aria-labelledby":"fw-season-label"}},a.map(n=>t("button",{className:`pill-tab${e.seasonChoice===n.id?" current":""}`,text:n.label,attrs:{type:"button","aria-pressed":e.seasonChoice===n.id?"true":"false"},on:{click:()=>r.setSeasonChoice(n.id)}}))),t("p",{className:"hint",text:"\uC790\uB3D9\uC740 \uC624\uB298 \uB0A0\uC9DC(\uBD81\uBC18\uAD6C)\uB97C \uB530\uB77C\uC694. \uB3C4\uC2DC\uB97C \uC120\uD0DD\uD558\uB294 \uD604\uC2E4 \uB0A0\uC528\uB294 \uC900\uBE44 \uC911\uC774\uC5D0\uC694. \uACC4\uC808\uC740 \uADF8\uB9BC\uB9CC \uBC14\uAFB8\uACE0 \uC0DD\uC0B0 \xB7 \uD310\uB9E4 \xB7 \uC120\uBB3C\uC5D0\uB294 \uC601\uD5A5\uC774 \uC5C6\uC5B4\uC694."})])}function zr(e,r,a,n,i){return U(e,r,{className:"toggle-row",label:n,children:[t("span",{className:"toggle-icon"},[a("icon")]),t("span",{className:"toggle-text"},[t("strong",{text:n}),t("span",{text:i})]),t("span",{className:"switch off"},[t("span",{className:"knob"})])]})}function dt(e,r,a,n){let i=[t("span",{className:"manage-icon"},[r("icon")]),t("span",{className:"manage-title",text:a}),t("span",{className:"menu-chevron"},[m.chevron()])];return"route"in n?t("button",{className:"manage-row",attrs:{type:"button"},on:{click:()=>e.navigate(n.route)}},i):U(e,n.feature,{className:"manage-row",label:a,children:i})}function Wr(e,r){let a=e.world?.state==="ready"?e.world.value:null,n=e.settingsSection??"workshop",o=a?[t("div",{className:"pill-tabs",attrs:{role:"group","aria-label":"\uC124\uC815 \uD56D\uBAA9"}},[["workshop","\uB0B4 \uACF5\uBC29"],["display","\uD45C\uC2DC"],["manage","\uAD00\uB9AC"]].map(([s,l])=>t("button",{className:`pill-tab${n===s?" current":""}`,text:l,attrs:{type:"button","aria-pressed":n===s?"true":"false"},on:{click:()=>r.setSettingsSection(s)}}))),n==="workshop"?S("\uB0B4 \uACF5\uBC29",[$n(a,e,r),In(a,e,r),Cn(r)],{id:"fw-mine"}):null,n==="display"?S("\uD45C\uC2DC",[Rn(e,r),Mn(e,r),zr(r,"weather-effects",m.leaf,"\uB0A0\uC528 \uD6A8\uACFC","\uACF5\uBC29 \uBC30\uACBD\uC5D0 \uD604\uC7AC \uB0A0\uC528\uB97C \uBC18\uC601\uD574\uC694."),zr(r,"auto-read",m.book,"\uC790\uB3D9 \uC77D\uAE30","\uC774\uC57C\uAE30\uB97C \uC790\uB3D9\uC73C\uB85C \uB118\uACA8\uC694.")],{id:"fw-display"}):null,n==="manage"?S("\uAD00\uB9AC",[dt(r,m.image,"\uC8FC\uBBFC \uADF8\uB9BC \uAD00\uB9AC",{route:"residents"}),dt(r,m.flower,"AI \uC9C0\uCE68 \uAD00\uB9AC",{feature:"ai-guidelines"}),t("button",{className:"manage-row",text:"\uAE30\uC5B5 \uAD00\uB9AC",attrs:{type:"button"},on:{click:()=>r.openMemory()}}),dt(r,m.folder,"\uC800\uC7A5 \xB7 \uBC31\uC5C5",{route:"backup"}),t("div",{className:"note-box"},[m.clock("icon"),t("span",{},[t("strong",{text:"\uBBF8\uC811\uC18D \uB204\uC801 \uC0C1\uD55C 72\uC2DC\uAC04"}),t("span",{text:"72\uC2DC\uAC04\uC774 \uC9C0\uB098\uBA74 \uC77C\uBD80 \uC790\uB3D9 \uC9C4\uD589\uC774 \uBA48\uCDB0\uC694."})])])],{id:"fw-manage"}):null,n==="manage"?t("p",{className:"footnote",text:"\uC790\uB3D9\uD654 \uADDC\uCE59\uC740 \uC791\uC5C5 \uD654\uBA74\uC5D0\uC11C \uBC14\uAFC0 \uC218 \uC788\uC5B4\uC694."}):null]:[C("\uC138\uACC4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026")];return R(e,r,{top:{kind:"sub",title:"\uC124\uC815",back:{route:"home",label:"\uD648"},resources:!1},backdrop:"wood",body:o,nav:!0})}function An(e,r,a,n,i){let o=0;for(let s of Object.values(e.state.production.facilities))if(!(!s.unlocked||s.mode!=="auto"))for(let l of s.rules){let c=r.recipes.find(d=>d.id===l.recipeId);l.enabled&&c&&Object.keys(c.outputs)[0]===a&&(o=Math.max(o,l.targetStock))}return{floor:Math.max(n,i?0:o,e.state.production.protectedStock[a]??0),target:o}}function Lr(e,r,a,n){let i=new Date().toISOString().slice(0,10),o=r.state.production.sales,l=a.items.filter(c=>(r.state.inventory[c.id]??0)>0||r.state.production.autoSell[c.id]?.enabled).map(c=>{let d=r.state.production.autoSell[c.id]??{enabled:!1,keep:0,dailyMax:10},p=oe(`fw-keep-${c.id}`,d.keep,0,999,{label:`${c.name} \uB0A8\uAE38 \uC218\uB7C9`}),f=oe(`fw-daily-${c.id}`,d.dailyMax,1,999,{label:`${c.name} \uD558\uB8E8 \uCD5C\uB300`}),g=t("input",{attrs:{type:"checkbox",id:`fw-continuous-${c.id}`}});g.checked=!!d.continuous;let{floor:u,target:b}=An(r,a,c.id,d.keep,!!(d.continuous&&d.enabled)),w=o.day===i?o.sold[c.id]??0:0,$=!!e.busy[`auto-sell:${c.id}`],W=A=>{n.setAutoSell(c.id,{enabled:A,keep:p.read(),dailyMax:f.read(),continuous:g.checked})};return t("li",{className:`auto-sell-row${d.enabled?" on":""}`},[t("div",{className:"auto-sell-head"},[B(c.id),t("span",{className:"protect-name"},[t("strong",{text:c.name}),t("small",{className:"muted",text:`\uBCF4\uC720 ${r.state.inventory[c.id]??0} \xB7 1\uAC1C ${c.sellPrice} G \xB7 \uC624\uB298 \uD310\uB9E4 ${w}`})]),t("span",{className:`switch ${d.enabled?"on":"off"}`},[t("span",{className:"knob"}),t("span",{className:"switch-label",text:d.enabled?"\uCF1C\uC9D0":"\uAEBC\uC9D0"})])]),t("div",{className:"auto-sell-fields"},[t("label",{className:"field-label",text:"\uD310\uB9E4 \uD6C4 \uB0A8\uAE38 \uC218\uB7C9",attrs:{for:`fw-keep-${c.id}`}}),p.node,t("label",{className:"field-label",text:"\uD558\uB8E8 \uCD5C\uB300 \uD310\uB9E4\uB7C9",attrs:{for:`fw-daily-${c.id}`}}),f.node]),t("label",{attrs:{for:`fw-continuous-${c.id}`}},[g," \uD310\uB9E4\uD560 \uB9CC\uD07C \uACC4\uC18D \uC0DD\uC0B0\uD558\uAE30"]),t("p",{className:"hint",text:d.enabled&&d.continuous?`\uD604\uC7AC \uD310\uB9E4 \uC2DC ${u}\uAC1C \uC774\uC0C1 \uB0A8\uACA8\uC694. \uD310\uB9E4 \uD55C\uB3C4\uC5D0 \uB3C4\uB2EC\uD558\uBA74 \uC77C\uBC18 \uC0DD\uC0B0 \uBAA9\uD45C ${b}\uAC1C\uB97C \uB530\uB985\uB2C8\uB2E4.`:`\uD604\uC7AC ${u}\uAC1C \uC774\uC0C1 \uB0A8\uACA8\uC694 (\uBCF4\uAD00\uB7C9 \xB7 \uC0DD\uC0B0 \uBAA9\uD45C ${b} \xB7 \uBCF4\uD638 \uC7AC\uACE0 \uC911 \uAC00\uC7A5 \uD070 \uAC12).`}),t("div",{className:"row-actions"},[y($?"\uC800\uC7A5 \uC911\u2026":d.enabled?"\uC124\uC815 \uC800\uC7A5":"\uCF1C\uAE30",()=>W(!0),{disabled:$}),d.enabled?y("\uB044\uAE30",()=>W(!1),{variant:"secondary",disabled:$}):null])])});return O("fw-auto-sell","\uC790\uB3D9 \uD310\uB9E4",[t("p",{className:"muted",text:"\uCF20 \uD488\uBAA9\uC744 \uD558\uB8E8(UTC \uAE30\uC900) \uD310\uB9E4 \uD55C\uB3C4\uAE4C\uC9C0 \uD314\uC544\uC694. \uACC4\uC18D \uC0DD\uC0B0\uC744 \uC120\uD0DD\uD558\uBA74 \uB0A8\uAE38 \uC218\uB7C9\uACFC \uBCF4\uD638 \uC7AC\uACE0\uB97C \uC9C0\uD0A4\uBA70 \uD310\uB9E4\uD560 \uB9CC\uD07C \uB9CC\uB4E4\uC5B4\uC694."}),l.length?t("ul",{className:"protect-list"},l):t("p",{className:"empty",text:"\uCC3D\uACE0\uAC00 \uBE44\uC5B4 \uC788\uC5B4\uC694."}),y("\uB2EB\uAE30",()=>n.closeSheet(),{variant:"secondary",attrs:{"data-wide":""}})])}function jr(e,r){let a=new Map(r?.items.map((n,i)=>[n.id,i]));return Object.entries(e.state.inventory).filter(([,n])=>n>0).sort(([n],[i])=>(a.get(n)??999)-(a.get(i)??999)).map(([n,i])=>({itemId:n,amount:i,name:V(r,n)}))}function Pn(e,r){let a=(n,i,o)=>t("button",{className:`big-tab${e.facilitiesTab===n?" current":""}`,attrs:{type:"button",role:"tab","aria-selected":e.facilitiesTab===n?"true":"false"},on:{click:()=>r.setFacilitiesTab(n)}},[o,t("span",{text:i})]);return t("div",{className:"big-tabs",attrs:{role:"tablist","aria-label":"\uC2DC\uC124\uACFC \uCC3D\uACE0"}},[a("facilities","\uC2DC\uC124",m.house("icon big")),a("protection","\uC7AC\uACE0 \uBCF4\uD638",m.lock("icon big")),a("storage","\uCC3D\uACE0",m.box("icon big"))])}function Tn(e,r,a,n){let i=e.work.facilityId,o=a.state.production.facilities[i],s=X(r,i),l=r.production.maxLevel,c=o.level>=l,d=c?null:r.production.upgradeCosts[o.level-1],p=!!e.busy[`upgrade:${i}:${o.level}`],f=d!==null&&a.state.wallet.gold<d,g=!o.unlocked,u=te(r,a.state,i);return S(null,[t("div",{className:"chip-row",attrs:{role:"group","aria-label":"\uC2DC\uC124 \uACE0\uB974\uAE30"}},r.facilities.map(b=>t("button",{className:`pill-tab${b.id===i?" current":""}`,attrs:{type:"button","aria-pressed":b.id===i?"true":"false","aria-label":a.state.production.facilities[b.id]?.unlocked?b.name:`${b.name} (\uD574\uAE08 \uC804)`},on:{click:()=>n.selectFacility(b.id)}},[t("span",{text:b.name}),a.state.production.facilities[b.id]?.unlocked?null:m.lock("icon tiny")]))),t("div",{className:"facility"},[t("span",{className:`facility-picture${g?" closed":""}`},[be(i,"huge")]),t("div",{className:"facility-info"},[t("strong",{className:"facility-name",text:s?.name??i}),t("span",{className:"facility-level"},[`Lv. ${o.level}`,c?null:t("span",{className:"level-next",text:` \u2192 Lv. ${o.level+1}`})]),t("div",{className:"effect-row"},[t("span",{text:"\uCC98\uB9AC \uC18D\uB3C4"}),t("span",{},[`+${Ye(r,o.level)}%`,c?null:t("span",{className:"level-next",text:` \u2192 +${Ye(r,o.level+1)}%`})])]),t("div",{className:"effect-row"},[t("span",{text:"\uC791\uC5C5 \uBC29\uC2DD"}),t("span",{text:g?"\uD574\uAE08 \uC804":o.mode==="auto"?"\uC790\uB3D9 \uC6B4\uC601":"\uC9C0\uC815 \uD69F\uC218"})]),t("div",{className:"effect-row"},[t("span",{text:"\uC8FC\uBBFC \uD6A8\uACFC"}),t("span",{text:`+${D(u.total)}${u.resident?` (${u.resident.displayName})`:""}`})]),t("p",{className:"muted",text:s?.description??""}),g?t("p",{className:"hint",text:"\uACF5\uBC29 \uC791\uC5C5\uC5D0\uC11C \uD574\uAE08 \uC870\uAC74\uC744 \uCC44\uC6B0\uACE0 \uC2DC\uC124\uC744 \uC5F4\uBA74 \uAC15\uD654\uD560 \uC218 \uC788\uC5B4\uC694."}):null,t("button",{className:"gold-button",attrs:{type:"button"},disabled:g||c||p||f,on:{click:()=>{n.upgradeFacility(i,o.level)}}},c?[t("span",{text:"\uCD5C\uACE0 \uB2E8\uACC4"})]:[t("span",{className:"coin"}),t("span",{text:p?"\uAC15\uD654\uD558\uB294 \uC911\u2026":`${d.toLocaleString("ko-KR")} G \xB7 \uAC15\uD654`})]),f?t("p",{className:"hint",text:`\uACE8\uB4DC\uAC00 ${(d-a.state.wallet.gold).toLocaleString("ko-KR")} G \uBD80\uC871\uD574\uC694.`}):null])])],{className:"facility-card"})}function En(e,r){let a=Object.values(e.state.production.autoSell).filter(n=>n.enabled).length;return t("button",{className:"toggle-row",attrs:{type:"button","aria-label":`\uC790\uB3D9 \uD310\uB9E4 ${a?`\uCF1C\uC9D0 (${a}\uAC1C \uD488\uBAA9)`:"\uAEBC\uC9D0"} \u2014 \uC124\uC815 \uC5F4\uAE30`},on:{click:()=>r.openSheet({kind:"auto-sell"})}},[t("span",{className:"toggle-icon"},[m.gear("icon")]),t("span",{className:"toggle-text"},[t("strong",{text:a?`\uC790\uB3D9 \uD310\uB9E4 \xB7 ${a}\uAC1C \uD488\uBAA9`:"\uC790\uB3D9 \uD310\uB9E4"}),t("span",{text:"\uBCF4\uD638 \xB7 \uC608\uC57D \uC7AC\uACE0\uB294 \uC0AC\uC6A9\uD558\uC9C0 \uC54A\uC544\uC694."})]),t("span",{className:`switch ${a?"on":"off"}`},[t("span",{className:"knob"}),t("span",{className:"switch-label",text:a?"\uCF1C\uC9D0":"\uAEBC\uC9D0"})])])}function Or(e,r,a){let n=Array.from({length:Math.ceil(r.length/3)},(i,o)=>{let s=r.slice(o*3,o*3+3);return`${o+1} \xB7 ${s.map(l=>l.name).join(" \xB7 ")}`});return G("\uC7AC\uACE0 \uBAA9\uB85D \uACE0\uB974\uAE30",e,n,i=>a.setInventoryPage(i))}function zn(e,r,a,n){let i=jr(r,a),o=Math.min(e.work.inventoryPage??0,Math.max(0,Math.ceil(i.length/3)-1)),s=r.state.production.protectedStock;return S(null,[t("div",{className:"card-head"},[t("div",{},[t("h2",{className:"section-title",text:"\uC7AC\uACE0 \uBCF4\uD638",attrs:{id:"fw-protect"}}),t("p",{className:"muted",text:"\uC9C0\uC815\uD55C \uC218\uB7C9\uC740 \uC81C\uC791\uACFC \uD310\uB9E4\uC5D0 \uC0AC\uC6A9\uD558\uC9C0 \uC54A\uC544\uC694."})]),t("button",{className:"outline-button",attrs:{type:"button"},on:{click:()=>n.openSheet({kind:"protect-edit"})}},[m.pencil("icon"),t("span",{text:"\uD3B8\uC9D1\uD558\uAE30"})])]),i.length===0?t("p",{className:"empty",text:"\uCC3D\uACE0\uAC00 \uBE44\uC5B4 \uC788\uC5B4\uC694."}):t("table",{className:"stock"},[t("thead",{},[t("tr",{},["\uC544\uC774\uD15C","\uBCF4\uC720 \uC218\uB7C9","\uBCF4\uD638 \uC7AC\uACE0","\uC608\uC57D \uC7AC\uACE0","\uC0AC\uC6A9 \uAC00\uB2A5"].map(l=>t("th",{text:l,attrs:{scope:"col"}})))]),t("tbody",{},i.slice(o*3,o*3+3).map(l=>{let c=s[l.itemId]??0;return t("tr",{},[t("th",{attrs:{scope:"row"}},[B(l.itemId),l.name]),t("td",{className:"num",text:l.amount.toLocaleString("ko-KR")}),t("td",{className:`num${c?" protected":""}`,text:c?String(c):"\u2013"}),t("td",{className:"num",text:"\u2013"}),t("td",{className:"num available",text:Math.max(0,l.amount-c).toLocaleString("ko-KR")})])}))]),Or(o,i,n),En(r,n)],{id:"fw-protect"})}function Wn(e,r,a,n){let i=jr(r,a),o=Math.min(e.work.inventoryPage??0,Math.max(0,Math.ceil(i.length/3)-1));return S("\uCC3D\uACE0",[i.length===0?t("p",{className:"empty",text:"\uCC3D\uACE0\uAC00 \uBE44\uC5B4 \uC788\uC5B4\uC694."}):t("ul",{className:"storage-grid"},i.slice(o*3,o*3+3).map(s=>t("li",{className:"storage-item"},[B(s.itemId),t("span",{className:"storage-name",text:s.name}),t("strong",{text:s.amount.toLocaleString("ko-KR")}),t("button",{className:"outline-button small",attrs:{type:"button","aria-label":`${s.name} \uD314\uAE30`},on:{click:()=>n.openSheet({kind:"sell",itemId:s.itemId})}},[t("span",{text:"\uD314\uAE30"})])]))),Or(o,i,n)],{id:"fw-storage"})}function Ln(e,r,a,n){let i=a.production.protectedStock,o=e.sheet?.kind==="protect-edit"?e.sheet:null,s=a.items.map(p=>{let f=oe(`fw-protect-${p.id}`,o?.drafts?.[p.id]??r.state.production.protectedStock[p.id]??0,i.min,i.max,{onChange:u=>n.rememberProtection({itemId:p.id,amount:u})}),g=!!e.busy[`protect:${p.id}`];return t("li",{className:"protect-row"},[B(p.id),t("span",{className:"protect-name"},[t("strong",{text:p.name}),t("small",{className:"muted",text:`\uBCF4\uC720 ${r.state.inventory[p.id]??0}`})]),f.node,y(g?"\uC800\uC7A5 \uC911\u2026":"\uC800\uC7A5",()=>{n.setProtected(p.id,f.read())},{disabled:g,attrs:{"aria-label":`${p.name} \uBCF4\uD638 \uC218\uB7C9 \uC800\uC7A5`}})])}),l=Math.max(0,Math.min(s.length-1,o?.page??0)),c=t("select",{className:"input",attrs:{"aria-label":"\uBCF4\uD638\uD560 \uC544\uC774\uD15C"},on:{change:()=>d(Number(c.value))}},a.items.map((p,f)=>t("option",{text:p.name,attrs:{value:String(f)}})));function d(p){l=Math.max(0,Math.min(s.length-1,p)),s.forEach((f,g)=>f.hidden=g!==l),c.value=String(l),n.rememberProtection({page:l})}return d(l),t("div",{className:"sheet-backdrop"},[t("section",{className:"sheet card",attrs:{role:"dialog","aria-modal":"true","aria-labelledby":"fw-protect-edit"}},[t("h2",{className:"section-title",text:"\uC7AC\uACE0 \uBCF4\uD638 \uD3B8\uC9D1",attrs:{id:"fw-protect-edit"}}),t("p",{className:"muted",text:"\uBCF4\uD638\uD55C \uC218\uB7C9\uC740 \uC790\uB3D9 \uC81C\uC791\uACFC \uD310\uB9E4\uC5D0 \uC4F0\uC9C0 \uC54A\uC544\uC694. 0\uC774\uBA74 \uBCF4\uD638\uD558\uC9C0 \uC54A\uC544\uC694."}),c,t("ul",{className:"protect-list"},s),y("\uB2EB\uAE30",()=>n.closeSheet(),{variant:"secondary",attrs:{"data-wide":""}})])])}function jn(e,r,a,n,i){let o=a.items.find(p=>p.id===i),s=r.state.inventory[i]??0,l=Math.max(0,s-(r.state.production.protectedStock[i]??0)),c=oe("fw-sell-amount",Math.min(l,1),l?1:0,l),d=!!e.busy[`sell:${i}`];return t("div",{className:"sheet-backdrop"},[t("section",{className:"sheet card",attrs:{role:"dialog","aria-modal":"true","aria-labelledby":"fw-sell"}},[t("h2",{className:"section-title",text:`${o?.name??i} \uD314\uAE30`,attrs:{id:"fw-sell"}}),t("p",{className:"muted",text:`1\uAC1C ${o?.sellPrice??0} G \xB7 \uD314 \uC218 \uC788\uB294 \uC591 ${l}\uAC1C (\uBCF4\uC720 ${s}\uAC1C, \uBCF4\uD638\uBD84 \uC81C\uC678)`}),l?c.node:t("p",{className:"empty",text:"\uBCF4\uD638\uBD84\uC744 \uBE7C\uBA74 \uD314 \uC218 \uC788\uB294 \uC591\uC774 \uC5C6\uC5B4\uC694."}),l?y(d?"\uD30C\uB294 \uC911\u2026":"\uD314\uAE30",()=>{n.sell(i,c.read())},{disabled:d,attrs:{"data-wide":""}}):null,y("\uB2EB\uAE30",()=>n.closeSheet(),{variant:"secondary",attrs:{"data-wide":""}})])])}function Vr(e,r){let a=e.world?.state==="ready"?e.world.value:null,n=e.content,i=a&&n,o=i&&e.sheet?.kind==="protect-edit"?Ln(e,a,n,r):i&&e.sheet?.kind==="sell"?jn(e,a,n,r,e.sheet.itemId):i&&e.sheet?.kind==="auto-sell"?Lr(e,a,n,r):null;return R(e,r,{top:{kind:"sub",title:"\uC2DC\uC124\uACFC \uCC3D\uACE0",back:{route:"work",label:"\uACF5\uBC29 \uC791\uC5C5"},resources:!0},backdrop:"forest",body:i?[Pn(e,r),...e.facilitiesTab==="facilities"?[Tn(e,n,a,r)]:e.facilitiesTab==="protection"?[zn(e,a,n,r)]:[Wn(e,a,n,r)]]:[C("\uC138\uACC4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026")],nav:!0,sheet:o})}function Br(e,r,a,n,i){let o=X(a,i),s=r.state.production.facilities[i]?.residentId??null,l=!!e.busy[`assign:${i}`],c=f=>Object.entries(r.state.production.facilities).find(([,g])=>g.residentId===f)?.[0]??null,d=Object.values(r.state.residents).filter(f=>f.recruited).sort((f,g)=>+(g.field===o?.field)-+(f.field===o?.field)||f.displayName.localeCompare(g.displayName,"ko")),p=te(a,r.state,i);return O("fw-assign",`${o?.name??"\uC2DC\uC124"} \uBC30\uCE58 \uBCC0\uACBD`,[t("p",{className:"muted",text:`${o?J[o.field]:""} \uBD84\uC57C \uC8FC\uBBFC\uC744 \uB450\uBA74 \uCC98\uB9AC \uC18D\uB3C4\uAC00 \uBE68\uB77C\uC838\uC694. \uC9C0\uAE08 \uC791\uC5C5\uC740 \uC2DC\uC791\uD55C \uC18D\uB3C4 \uADF8\uB300\uB85C \uB05D\uB098\uACE0, \uB2E4\uC74C \uD68C\uCC28\uBD80\uD130 \uC801\uC6A9\uB3FC\uC694. \uD398\uC5B4 \uB450 \uC0AC\uB78C\uC774 \uBAA8\uB450 \uBC30\uCE58\uB418\uBA74 \uBAA8\uB4E0 \uC2DC\uC124 +${D(a.crew.setBonusPerPair)}(\uCD5C\uB300 ${D(a.crew.setBonusMax)}).`}),t("p",{className:"assign-now"},[t("strong",{text:"\uC9C0\uAE08 "}),p.resident?p.resident.displayName:"\uBC30\uCE58\uD55C \uC8FC\uBBFC \uC5C6\uC74C",` \xB7 \uC8FC\uBBFC \uD6A8\uACFC +${D(p.total)}`]),d.length===0?t("p",{className:"empty",text:"\uACF5\uBC29\uC5D0 \uC628 \uC8FC\uBBFC\uC774 \uC5C6\uC5B4\uC694. \uCD08\uB300\uB85C \uC8FC\uBBFC\uC744 \uB9DE\uC774\uD574 \uC8FC\uC138\uC694."}):t("ul",{className:"pick-list"},d.map(f=>{let g=f.field===o?.field,u=c(f.residentId),b=re(a,f.talentId),w=[g?`+${D(ee(a,f.breakthrough))}${b?` \xB7 \uD2B9\uAE30 ${b.name}: ${b.description}`:""}`:`${J[f.field]} \uBD84\uC57C\uB77C \uD6A8\uACFC \uC5C6\uC74C`,u&&u!==i?`${X(a,u)?.name??""}\uC5D0\uC11C \uC62E\uACA8 \uC640\uC694`:""].filter(Boolean).join(" \xB7 ");return t("li",{},[t("button",{className:`pick-row${f.residentId===s?" selected":""}`,attrs:{type:"button","aria-pressed":f.residentId===s?"true":"false"},disabled:l||f.residentId===s,on:{click:()=>{n.assignResident(i,f.residentId)}}},[E(f),t("strong",{text:f.displayName}),q(f),t("small",{className:g?"good":"muted",text:w})])])})),s?y("\uBC30\uCE58 \uD574\uC81C",()=>{n.assignResident(i,null)},{variant:"secondary",disabled:l}):null,y("\uB2EB\uAE30",()=>n.closeSheet(),{variant:"secondary",attrs:{"data-wide":""}})])}function Dr(e,r,a,n,i){let o=a.state.production.facilities[n],s=r.recipes.filter(M=>M.facilityId===n),l=Ht(r,o.level),c=o.queue.length>=l,d=e.work.queueRecipe[n]??s[0]?.id??"",p=H(r,d),f=t("p",{className:"hint"}),g=te(r,a.state,n),u=M=>{let h=p?Object.entries(Me(p,g).inputs):[];f.textContent=h.length?`\uC608\uC0C1 \uC7AC\uB8CC ${h.map(([v,k])=>`${V(r,v)} ${k*M}`).join(" \xB7 ")} \u2014 \uD55C \uD68C\uCC28\uC529 \uC2DC\uC791\uD560 \uB54C \uAEBC\uB0B4\uC694. \uC7AC\uB8CC \uD655\uBCF4\uB97C \uBBF8\uB9AC \uBCF4\uC7A5\uD558\uC9C0 \uC54A\uC544\uC694.`:"\uC7AC\uB8CC \uC5C6\uC774 \uC232\uC5D0\uC11C \uBC14\uB85C \uBAA8\uC544\uC694."},b=r.production.queueCount,w=e.work.queueCounts?.[n]??1,$=oe(`fw-queue-count-${n}`,w,b.min,b.max,{label:"\uD69F\uC218",onChange:M=>{u(M),i.rememberQueueCount(n,M)}});u(w);let W=!!e.busy[`queue:${n}`],A=e.work.queueView??(o.queue.length?"list":"add"),ae=t("select",{className:"input",attrs:{"aria-label":"\uB300\uAE30 \uC911\uC778 \uC791\uC5C5"}},o.queue.map((M,h)=>t("option",{text:`${h+1}. ${H(r,M.recipeId)?.name??M.recipeId} \xB7 ${M.started}/${M.total}\uD68C`,attrs:{value:M.entryId}}))),Q=t("select",{className:"input",attrs:{"aria-label":"\uC81C\uC791\uBC95 \uACE0\uB974\uAE30"},on:{change:()=>i.selectQueueRecipe(n,Q.value)}},s.map(M=>t("option",{text:M.name,attrs:{value:M.id}})));return Q.value=d,t("div",{className:"plan-block queue"},[t("span",{className:"plan-label"},["\uC9C0\uC815 \uD69F\uC218 \uB300\uAE30\uC5F4 ",t("small",{text:`(${o.queue.length}/${l}\uCE78 \xB7 \uC704\uC5D0\uC11C\uBD80\uD130 \uCC28\uB840\uB85C \uB9CC\uB4E4\uC5B4\uC694)`})]),t("div",{className:"pill-tabs two",attrs:{role:"group","aria-label":"\uB300\uAE30\uC5F4 \uD654\uBA74"}},[t("button",{className:`pill-tab${A==="list"?" current":""}`,text:"\uB300\uAE30\uC5F4 \uBCF4\uAE30",attrs:{type:"button","aria-pressed":A==="list"?"true":"false"},on:{click:()=>i.setQueueView("list")}}),t("button",{className:`pill-tab${A==="add"?" current":""}`,text:"\uC791\uC5C5 \uCD94\uAC00",attrs:{type:"button","aria-pressed":A==="add"?"true":"false"},on:{click:()=>i.setQueueView("add")}})]),A==="list"?o.queue.length===0?t("p",{className:"empty",text:"\uB300\uAE30\uC5F4\uC774 \uBE44\uC5B4 \uC788\uC5B4\uC694."}):t("div",{className:"queue-add"},[ae,t("button",{className:"outline-button",text:"\uC120\uD0DD\uD55C \uC791\uC5C5 \uBE7C\uAE30",attrs:{type:"button"},disabled:Object.keys(e.busy).some(M=>M.startsWith("queue-remove:")&&e.busy[M]),on:{click:()=>{i.removeQueue(n,ae.value)}}})]):null,A==="add"?t("div",{className:"queue-add"},[Q,$.node,f,t("button",{className:"button",attrs:{type:"button","data-wide":""},disabled:W||c||!p,on:{click:()=>{i.addQueue(n,d,$.read())}}},[m.plus("icon"),t("span",{text:c?"\uB300\uAE30\uC5F4\uC774 \uAC00\uB4DD \uCC3C\uC5B4\uC694":W?"\uCD94\uAC00\uD558\uB294 \uC911\u2026":"\uB300\uAE30\uC5F4\uC5D0 \uCD94\uAC00"})])]):null])}var On=[{field:"gather",label:"\uCC44\uC9D1",icon:m.leaf},{field:"grow",label:"\uC7AC\uBC30",icon:m.sprout},{field:"survey",label:"\uC870\uC0AC",icon:m.search},{field:"process",label:"\uAC00\uACF5",icon:m.jar},{field:"craft",label:"\uC81C\uC791",icon:m.hammer}];function Fr(e,r,a,n){return t("div",{className:"field-tabs work-fields",attrs:{role:"tablist","aria-label":"\uC791\uC5C5 \uBD84\uC57C"}},On.map(i=>{let o=e.facilities.find(c=>c.field===i.field);if(!o)return null;let s=o.id===a,l=r.state.production.facilities[o.id]?.unlocked??!1;return t("button",{className:`field-tab${s?" current":""}${l?"":" closed"}`,attrs:{type:"button",role:"tab","aria-selected":s?"true":"false","aria-label":l?i.label:`${i.label} (\uD574\uAE08 \uC804)`},on:{click:()=>n.selectFacility(o.id)}},[i.icon("icon field-glyph"),t("span",{text:i.label}),l?null:t("span",{className:"lock-tag"},[m.lock("icon tiny")])])}))}function Vn(e,r,a,n){let i=!!e.busy[`mode:${r}`],o=(s,l)=>t("button",{className:`segment${a.mode===s?" selected":""}`,text:l,attrs:{type:"button","aria-pressed":a.mode===s?"true":"false"},disabled:i,on:{click:()=>a.mode===s?void 0:void n.setMode(r,s)}});return t("div",{className:"segmented",attrs:{role:"group","aria-label":"\uC791\uC5C5 \uBC29\uC2DD"}},[o("auto","\uC790\uB3D9 \uC6B4\uC601"),o("count","\uC9C0\uC815 \uD69F\uC218")])}function Bn(e,r,a,n,i){let o=X(r,n),s=_t(r,a.state,n),l=s.every(d=>d.met),c=!!e.busy[`unlock:${n}`];return S(null,[t("div",{className:"facility-entry"},[t("span",{className:"facility-open closed"},[t("span",{className:"facility-art closed"},[be(n),t("span",{className:"facility-lock"},[m.lock("icon")])]),t("span",{className:"facility-text"},[t("strong",{text:`${o?.name??n} \xB7 \uD574\uAE08 \uC804`}),t("span",{text:o?.description??""})])])]),t("div",{className:"plan-block"},[t("span",{className:"plan-label",text:"\uD574\uAE08 \uC870\uAC74"}),t("ul",{className:"unlock-list"},s.map(d=>t("li",{className:d.met?"met":""},[(d.met?m.check:m.hourglass)("icon"),t("span",{text:d.text}),t("strong",{text:`${Math.min(d.have,d.need)} / ${d.need}`})])))]),t("button",{className:"button",attrs:{type:"button","data-wide":""},disabled:!l||c,on:{click:()=>{i.unlockFacility(n)}}},[t("span",{text:c?"\uC5EC\uB294 \uC911\u2026":l?"\uC2DC\uC124 \uC5F4\uAE30":"\uC870\uAC74\uC744 \uCC44\uC6B0\uBA74 \uC5F4 \uC218 \uC788\uC5B4\uC694"})])],{className:"work-card"})}function Dn(e,r,a,n,i,o){let s=X(r,n),l=te(r,a.state,n),c=i.level<r.production.maxLevel?r.production.upgradeCosts[i.level-1]:void 0;return t("div",{className:"facility-entry"},[t("button",{className:"facility-open",attrs:{type:"button","aria-label":`${s?.name??"\uC2DC\uC124"} \u2014 \uC2DC\uC124\uACFC \uCC3D\uACE0 \uC5F4\uAE30`},on:{click:()=>{o.setFacilitiesTab("facilities"),o.navigate("facilities")}}},[t("span",{className:"facility-art"},[be(n)]),t("span",{className:"facility-text"},[t("strong",{text:`${s?.name??n} Lv. ${i.level}`}),t("span",{className:"crew-line"},[l.resident?E(l.resident):null,l.resident?`${l.resident.displayName} \xB7 ${l.matches?`+${D(l.passive)}${l.talent?` \xB7 \uD2B9\uAE30 ${l.talent.name}`:""}`:"\uBD84\uC57C\uAC00 \uB2EC\uB77C \uD6A8\uACFC \uC5C6\uC74C"}`:"\uBC30\uCE58\uD55C \uC8FC\uBBFC \uC5C6\uC74C",l.set?` \xB7 \uC138\uD2B8 +${D(l.set)}`:""])])]),c!==void 0?t("button",{className:"outline-button",text:`${c.toLocaleString("ko-KR")} G \xB7 \uAC15\uD654`,attrs:{type:"button","aria-label":`${s?.name??"\uC2DC\uC124"} \uAC15\uD654 ${c} \uACE8\uB4DC`},disabled:a.state.wallet.gold<c||!!e.busy[`upgrade:${n}:${i.level}`],on:{click:()=>{o.upgradeFacility(n,i.level)}}}):null,t("button",{className:"outline-button",attrs:{type:"button","aria-label":`${s?.name??"\uC2DC\uC124"} \uBC30\uCE58 \uBCC0\uACBD`},on:{click:()=>o.openSheet({kind:"assign",facilityId:n})}},[m.swap("icon"),t("span",{text:"\uBC30\uCE58 \uBCC0\uACBD"})])])}function Fn(e,r,a,n){let i=r?H(e,r.recipeId):null;if(!i)return t("div",{className:"recipe"},[t("span",{className:"recipe-art"},[m.jar("icon big")]),t("span",{className:"recipe-text"},[t("strong",{text:"\uC81C\uC791\uBC95"}),t("span",{text:"\uC544\uB798 \uC6B0\uC120\uC21C\uC704\uC5D0\uC11C \uC81C\uC791\uBC95\uC744 \uCD94\uAC00\uD574 \uC8FC\uC138\uC694."})])]);let o=Object.keys(i.outputs)[0],s=Me(i,n),l=qt(e,i,a,s.extraBonus),c=Object.entries(s.inputs).map(([d,p])=>`${V(e,d)} ${p}`);return t("div",{className:"recipe"},[t("span",{className:"recipe-art"},[B(o,"big")]),t("span",{className:"recipe-text"},[t("strong",{text:i.name}),t("span",{text:i.description}),t("span",{className:"recipe-flow",text:`${c.length?`${c.join(" \xB7 ")} \u2192 `:""}${Object.entries(i.outputs).map(([d,p])=>`${V(e,d)} ${p}`).join(" \xB7 ")} \xB7 1\uD68C ${he(l)}`}),s.talentApplies&&n.talent?t("span",{className:"talent-note"},[m.sparkle("icon tiny"),` \uD2B9\uAE30 ${n.talent.name}: ${n.talent.description}`]):null])])}function Gn(e,r,a,n,i){let o=H(e,n.recipeId),s=o?Object.keys(o.outputs)[0]:"",l=r.state.production,c=r.state.inventory[s]??0,d=Object.values(l.facilities).reduce((g,u)=>g+(u.job?.outputs[s]??0),0),p=t("span",{className:"bar-fill red"});p.style.width=`${Math.min(100,Math.round((c+d)/Math.max(1,n.targetStock)*100))}%`;let f=(g,u,b,w=!1)=>t("button",{className:`step${w?" plus":""}`,attrs:{type:"button","aria-label":b},on:{click:()=>i.changeTarget(a,n.policyId,g)}},[u("icon")]);return t("div",{className:"plan-row"},[t("span",{className:"plan-label",text:"\uBAA9\uD45C \uC7AC\uACE0"}),t("span",{className:"stepper"},[f(-1,m.minus,"\uBAA9\uD45C 1 \uC904\uC774\uAE30"),t("span",{className:"step-value",text:String(n.targetStock),attrs:{"aria-live":"polite"}}),f(1,m.plus,"\uBAA9\uD45C 1 \uB298\uB9AC\uAE30",!0)]),t("span",{className:"plan-progress"},[t("span",{className:"muted"},[`\uD604\uC7AC ${V(e,s)} `,t("strong",{text:String(c)}),d?` (+${d} \uC9C4\uD589 \uC911)`:""," / \uBAA9\uD45C ",t("strong",{text:String(n.targetStock)})]),t("span",{className:"bar"},[p])])])}function qn(e,r,a){let n=a?H(e,a.recipeId):null,i=n?Object.entries(n.inputs):[],o=r.state.production;return t("div",{className:"plan-block"},[t("span",{className:"plan-label",text:"\uC7AC\uB8CC \uC0AC\uC6A9 \uC124\uC815"}),i.length===0?t("p",{className:"muted",text:"\uC774 \uC81C\uC791\uBC95\uC740 \uC7AC\uB8CC \uC5C6\uC774 \uC232\uC5D0\uC11C \uBC14\uB85C \uBAA8\uC544\uC694."}):t("div",{className:"usage-list"},i.map(([s])=>{let l=r.state.inventory[s]??0,c=o.protectedStock[s]??0;return t("div",{className:"usage"},[t("span",{className:"usage-item"},[B(s),t("span",{text:V(e,s)})]),t("span",{className:"usage-cell"},[t("small",{text:"\uBCF4\uC720"}),t("strong",{text:String(l)})]),t("span",{className:"usage-cell"},[t("small",{text:"\uBCF4\uD638"}),t("strong",{text:String(c)})]),t("span",{className:"usage-cell available"},[t("small",{text:"\uC0AC\uC6A9 \uAC00\uB2A5"}),t("strong",{text:String(Math.max(0,l-c))})])])}))])}function _n(e,r,a,n,i){let o=new Set(a.map(p=>p.recipeId)),s=e.recipes.filter(p=>p.facilityId===r&&!o.has(p.id)),l=a.find(p=>p.policyId===n)??a[0],c=t("select",{className:"input",attrs:{"aria-label":"\uC21C\uC11C\uC640 \uCF1C\uC9D0\uC744 \uBC14\uAFC0 \uC0DD\uC0B0 \uBB3C\uD488"},on:{change:()=>i.selectRule(r,c.value)}},a.map((p,f)=>t("option",{text:`${f+1}. ${H(e,p.recipeId)?.name??p.recipeId}${p.enabled?"":" (\uAEBC\uC9D0)"}`,attrs:{value:p.policyId}})));c.value=l?.policyId??"";let d=t("select",{className:"input",attrs:{"aria-label":"\uCD94\uAC00\uD560 \uC81C\uC791\uBC95"}},s.map(p=>t("option",{text:p.name,attrs:{value:p.id}})));return t("div",{className:"plan-block"},[t("span",{className:"plan-label"},["\uC81C\uC791 \uC6B0\uC120\uC21C\uC704 ",t("small",{text:"(\uC704\uC758 \uC544\uC774\uD15C\uBD80\uD130 \uC21C\uC11C\uB300\uB85C \uC81C\uC791\uD574\uC694)"})]),a.length?c:null,...a.filter(p=>p===l).map(p=>{let f=a.indexOf(p),g=H(e,p.recipeId),u=g?Object.keys(g.outputs)[0]:"";return t("div",{className:`priority-row${p.policyId===n?" selected":""}${p.enabled?"":" off"}`},[t("span",{className:"rank",text:String(f+1)}),t("button",{className:"priority-main",attrs:{type:"button","aria-pressed":p.policyId===n?"true":"false"},on:{click:()=>{i.selectRule(r,p.policyId),i.setWorkSection("recipe")}}},[B(u),t("span",{className:"priority-name",text:g?.name??p.recipeId}),t("small",{className:"muted",text:`\uBAA9\uD45C ${p.targetStock}`})]),t("button",{className:`chip-toggle${p.enabled?" on":""}`,text:p.enabled?"\uCF1C\uC9D0":"\uAEBC\uC9D0",attrs:{type:"button","aria-pressed":p.enabled?"true":"false","aria-label":`${g?.name??""} ${p.enabled?"\uB044\uAE30":"\uCF1C\uAE30"}`},on:{click:()=>i.toggleRule(r,p.policyId)}}),t("span",{className:"order-buttons"},[t("button",{className:"mini",attrs:{type:"button","aria-label":"\uC704\uB85C"},disabled:f===0,on:{click:()=>i.moveRule(r,p.policyId,-1)}},[m.up("icon")]),t("button",{className:"mini",attrs:{type:"button","aria-label":"\uC544\uB798\uB85C"},disabled:f===a.length-1,on:{click:()=>i.moveRule(r,p.policyId,1)}},[m.down("icon")])])])}),s.length?t("div",{className:"add-rules"},[d,t("button",{className:"outline-button",text:"\uC81C\uC791\uBC95 \uCD94\uAC00",attrs:{type:"button"},on:{click:()=>i.addRule(r,d.value)}})]):null])}function Hn(e,r,a,n){if(!n.job)return t("div",{className:"plan-row"},[t("span",{className:"plan-label",text:"\uD604\uC7AC \uC791\uC5C5"}),t("span",{className:"plan-progress wide"},[t("span",{className:"muted",text:"\uC26C\uB294 \uC911"}),t("span",{className:"bar"})])]);let i=H(r,n.job.recipeId),o=Object.keys(n.job.outputs)[0],s=de(e,a,n.job);return t("div",{className:"plan-row current-work"},[t("span",{className:"plan-label",text:"\uD604\uC7AC \uC791\uC5C5"}),B(o),t("span",{className:"plan-progress"},[t("span",{className:"muted",text:`${i?.name??""} \uB9CC\uB4DC\uB294 \uC911\u2026`}),s.bar]),s.countdown])}function Un(e,r,a,n){let i=e.work.facilityId,o=a.state.production.facilities[i];if(!o)return[C("\uC2DC\uC124\uC744 \uBD88\uB7EC\uC624\uB294 \uC911\u2026")];if(!o.unlocked)return[Fr(r,a,i,n),Bn(e,r,a,i,n)];let s=Ge(e,a.state.production,i),l=s.find(w=>w.policyId===e.work.selected[i])??s[0],c=Et(e,a.state.production,i),d=!!e.busy[`rules:${i}`],p=o.mode==="auto",f=te(r,a.state,i),g=!p&&e.work.section==="priority"?"recipe":e.work.section??"status",u=t("select",{className:"input work-recipe-select",attrs:{"aria-label":"\uC0DD\uC0B0 \uBB3C\uD488 \uACE0\uB974\uAE30"},on:{change:()=>n.selectRule(i,u.value)}},s.map(w=>t("option",{text:`${H(r,w.recipeId)?.name??w.recipeId}${w.enabled?"":" (\uAEBC\uC9D0)"}`,attrs:{value:w.policyId}})));u.value=l?.policyId??"";let b=p?[["status","\uD604\uC7AC \uC791\uC5C5"],["recipe","\uC81C\uC791 \uC124\uC815"],["priority","\uC21C\uC11C\xB7\uC801\uC6A9"]]:[["status","\uD604\uC7AC \uC791\uC5C5"],["recipe","\uB300\uAE30\uC5F4"]];return[Fr(r,a,i,n),t("div",{className:"work-sections",attrs:{role:"group","aria-label":"\uC791\uC5C5 \uD654\uBA74"}},b.map(([w,$])=>t("button",{className:"pill-tab",text:$,attrs:{type:"button","aria-pressed":g===w?"true":"false"},on:{click:()=>n.setWorkSection(w)}}))),S(null,[g!=="status"?Vn(e,i,o,n):null,...g==="status"?[Hn(e,r,a,o),Dn(e,r,a,i,o,n),o.waiting?t("p",{className:"hint center",text:Ut(r,o.waiting)}):null,t("div",{className:"work-stock-actions",attrs:{role:"group","aria-label":"\uC7AC\uACE0 \uAD00\uB9AC"}},[t("button",{className:"outline-button",text:"\uC7AC\uACE0 \uBCF4\uD638",attrs:{type:"button"},on:{click:()=>{n.setFacilitiesTab("protection"),n.navigate("facilities")}}}),t("button",{className:"outline-button",text:"\uCC3D\uACE0 \xB7 \uD310\uB9E4",attrs:{type:"button"},on:{click:()=>{n.setFacilitiesTab("storage"),n.navigate("facilities")}}})])]:[],...g==="recipe"&&p?[s.length?u:null,Fn(r,l,o.level,f),l?Gn(r,a,i,l,n):null,qn(r,a,l)]:g==="recipe"?[Dr(e,r,a,i,n)]:[],g==="priority"&&p?_n(r,i,s,l?.policyId,n):null,g==="status"&&p&&o.queue.length?t("p",{className:"hint center",text:`\uC9C0\uC815 \uD69F\uC218 \uB300\uAE30\uC5F4 ${o.queue.length}\uAC1C\uB294 \uBA48\uCD98 \uCC44 \uADF8\uB300\uB85C \uB0A8\uC544 \uC788\uC5B4\uC694.`}):null,p&&c?t("p",{className:"draft-note"},["\uC801\uC6A9 \uC804",g!=="priority"?t("button",{className:"link-button",text:d?"\uC801\uC6A9 \uC911\u2026":"\uC801\uC6A9\uD558\uAE30",disabled:d,attrs:{type:"button"},on:{click:()=>{n.applyRules(i)}}}):null,t("button",{className:"link-button",text:"\uB418\uB3CC\uB9AC\uAE30",attrs:{type:"button"},on:{click:()=>n.discardDraft(i)}})]):null],{className:"work-card"}),p&&(g==="priority"||g==="status"&&!c)?t("div",{className:"rule-actions"},[g==="priority"?t("button",{className:"button wide-main",attrs:{type:"button"},disabled:!c||d,on:{click:()=>{n.applyRules(i)}}},[t("span",{text:d?"\uC801\uC6A9\uD558\uB294 \uC911\u2026":c?"\uC6B4\uC601 \uADDC\uCE59 \uC801\uC6A9":"\uC801\uC6A9\uB428"})]):null,g==="priority"||g==="status"&&!c?t("button",{className:"button secondary",attrs:{type:"button"},on:{click:()=>n.recommendRules(i)}},[m.gear("icon"),t("span",{text:"\uCD94\uCC9C \uC124\uC815"})]):null]):null]}function Gr(e,r){let a=e.world?.state==="ready"?e.world.value:null,n=a&&e.content&&e.sheet?.kind==="assign"?Br(e,a,e.content,r,e.sheet.facilityId):null;return R(e,r,{top:{kind:"sub",title:"\uACF5\uBC29 \uC791\uC5C5",back:{route:"home",label:"\uD648"},resources:!0},backdrop:"forest",body:a&&e.content?Un(e,e.content,a,r):[C("\uC138\uACC4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026")],nav:!0,sheet:n})}var qr={world:40,nickname:24};function Kn(e){let r=new Date(e);return Number.isNaN(r.getTime())?e:new Intl.DateTimeFormat("ko-KR",{dateStyle:"medium",timeStyle:"short"}).format(r)}function Qn(e,r){let a=S("\uB0B4 \uC138\uACC4",[],{id:"fw-worlds"}),{worlds:n}=e;if(n.state==="loading")a.append(C("\uBD88\uB7EC\uC624\uB294 \uC911\u2026"));else if(n.state==="error")a.append(_(n.message),y("\uB2E4\uC2DC \uC2DC\uB3C4",()=>{r.loadWorlds()},{variant:"secondary"}));else if(n.value.length===0)a.append(t("p",{className:"empty",text:"\uC544\uC9C1 \uC138\uACC4\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4. \uC544\uB798\uC5D0\uC11C \uC0C8\uB85C \uB9CC\uB4E4\uC5B4 \uC8FC\uC138\uC694."}));else{let i=Math.ceil(n.value.length/2),o=Math.min(e.worldsPage??0,i-1);a.append(t("ul",{className:"menu-list"},n.value.slice(o*2,o*2+2).map(s=>t("li",{},[t("button",{className:"menu-row",attrs:{type:"button"},disabled:!s.readable,on:{click:()=>{r.openWorld(s.worldId)}}},[t("span",{className:"menu-icon"},[m.house()]),t("span",{className:"menu-text"},[t("span",{className:"menu-title",text:s.worldName}),t("span",{className:"menu-detail",text:s.readable?`\uB9C8\uC9C0\uB9C9 \uC800\uC7A5 ${Kn(s.updatedAt)}`:"\uC774 \uBC84\uC804\uC5D0\uC11C \uC77D\uC744 \uC218 \uC5C6\uB294 \uC138\uACC4"})]),t("span",{className:"menu-chevron"},[m.chevron()])])])))),i>1&&a.append(t("div",{className:"resident-pages"},[y("\uC774\uC804",()=>r.setWorldsPage(o-1),{variant:"secondary",disabled:o===0}),t("span",{text:`${o+1} / ${i}`,attrs:{"aria-live":"polite"}}),y("\uB2E4\uC74C",()=>r.setWorldsPage(o+1),{variant:"secondary",disabled:o+1>=i})]))}return a}function _r(e,r){let a=!!e.busy["create-world"],n=t("input",{className:"input",attrs:{id:"fw-world-name",name:"worldName",maxlength:String(qr.world),autocomplete:"off",required:"",value:e.worldDraft?.worldName??""},on:{input:()=>r.rememberWorldDraft({worldName:n.value,nickname:i.value})}}),i=t("input",{className:"input",attrs:{id:"fw-nickname",name:"playerNickname",maxlength:String(qr.nickname),autocomplete:"off",required:"",value:e.worldDraft?.nickname??""},on:{input:()=>r.rememberWorldDraft({worldName:n.value,nickname:i.value})}});return t("form",{className:"card form",attrs:{"aria-labelledby":"fw-create"},on:{submit:s=>{s.preventDefault(),!(!n.value.trim()||!i.value.trim())&&r.createWorld(n.value,i.value)}}},[t("h2",{className:"section-title",text:"\uC0C8 \uC138\uACC4 \uB9CC\uB4E4\uAE30",attrs:{id:"fw-create"}}),t("p",{className:"muted",text:"\uD50C\uB808\uC774\uC5B4\uB294 \uC678\uD615 \uC5C6\uC774 \uB2C9\uB124\uC784\uC73C\uB85C\uB9CC \uB4F1\uC7A5\uD569\uB2C8\uB2E4. \uB458 \uB2E4 \uB098\uC911\uC5D0 \uC124\uC815\uC5D0\uC11C \uBC14\uAFC0 \uC218 \uC788\uC2B5\uB2C8\uB2E4."}),t("label",{className:"field-label",text:"\uC138\uACC4 \uC774\uB984",attrs:{for:"fw-world-name"}}),n,t("label",{className:"field-label",text:"\uB0B4 \uB2C9\uB124\uC784",attrs:{for:"fw-nickname"}}),i,t("button",{className:"button",text:a?"\uB9CC\uB4DC\uB294 \uC911\u2026":"\uB9CC\uB4E4\uAE30",attrs:{type:"submit"},disabled:a})])}function Hr(e,r){let a=e.world?.state==="ready",n=e.worlds.state==="ready"&&e.worlds.value.length===0,i=n?null:t("details",{className:"card restore-details",attrs:{open:e.worldCreateOpen?"":void 0},on:{toggle:()=>r.rememberWorldCreateOpen(!!i?.open)}},[t("summary",{className:"section-title",text:"\uC0C8 \uC138\uACC4 \uB9CC\uB4E4\uAE30"}),_r(e,r)]),o=n?_r(e,r):i,s=t("details",{className:"card restore-details",attrs:{open:e.restore?"":void 0}},[t("summary",{className:"section-title",text:"\uBC31\uC5C5\uC5D0\uC11C \uBCF5\uC6D0"}),je(e,r,"fw-worlds-restore")]);return R(e,r,{top:a?{kind:"sub",title:"\uC138\uACC4 \uACE0\uB974\uAE30",back:{route:"backup",label:"\uC800\uC7A5\xB7\uBC31\uC5C5"},resources:!1}:{kind:"sub",title:"\uC232\uACB0 \uACF5\uBC29",resources:!1},backdrop:"wood",body:[n?null:Qn(e,r),o,s],nav:!1})}var Ur=`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 48'%3E%3Cpath d='M0 0h120v26c-8 0-10 12-20 12S88 22 78 22 66 36 56 36 44 20 34 20 22 34 12 34 4 26 0 26z' fill='%2394bf74' stroke='%235f8f45' stroke-width='3'/%3E%3C/svg%3E")`,Kr=`
.ground-preview { position: relative; height: 110px; background: #dcebc4; border: 2px solid var(--ink); border-radius: 12px; }
.ground-area { position: absolute; border: 2px dashed var(--fw-accent); background: #8fbf6e; }
.ground-editor { display: grid; gap: 0.5em; }
.ground-row { display: grid; grid-template-columns: 3em minmax(0,1fr) 2em; gap: 0.5em; align-items: center; min-height: 44px; }
.ground-row input { width: 100%; min-height: 44px; }

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
  background-image: ${Ur}, linear-gradient(#94bf74, #94bf74);
  background-repeat: repeat-x, no-repeat;
  background-size: 7.5em 3em, 100% 5.2em;
  background-position: 0 5.1em, 0 0;
}
.backdrop-wood { background: #a8703f; }
.backdrop-wood .scroll {
  background-color: #a8703f;
  background-image: ${Ur}, linear-gradient(#94bf74, #94bf74),
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
@media (max-height: 480px) { .home-layout .scroll { overflow-y: auto; } .home-layout .column { height: auto; min-height: 100%; } .home-layout .scene { flex: none; min-height: 12em; } }

.page-picker { min-height: 44px; width: 100%; }
button:focus-visible, select:focus-visible, input:focus-visible, textarea:focus-visible { outline: 3px solid #315eac; outline-offset: 2px; }
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
`;var Qr=`
.work-card { gap: 0.35em; }
.work-stock-actions { display: flex; gap: 0.4em; }
.work-stock-actions .outline-button { flex: 1; min-width: 0; min-height: 44px; }
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
.facility-entry { display: grid; grid-template-columns: 1fr 1fr; }
.facility-entry .facility-open { grid-column: 1 / -1; min-width: 0; }
.facility-entry .outline-button { min-width: 0; }

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
.mini { min-width: 44px; min-height: 44px; display: inline-grid; place-items: center; width: 2.2em; height: 2.2em; border-radius: 0.55em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); color: var(--ink); cursor: pointer; }
.mini:disabled { opacity: 0.35; cursor: default; }
.mini .icon { stroke-width: 3; }
.add-rules { display: flex; flex-wrap: wrap; gap: 0.4em; }
.outline-button.small { min-height: 44px; padding: 0.2em 0.7em; font-size: calc(var(--fs) * 0.85); box-shadow: 0 0.15em 0 var(--ink); }
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
`;var Yr=`
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
.delivery-board { display: grid; gap: 0.5em; }
.delivery-choices { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.35em; }
.delivery-choice { display: grid; justify-items: center; gap: 0.15em; min-width: 0; min-height: 44px; padding: 0.35em 0.2em; border: 2px solid var(--ink); border-radius: 0.7em; background: var(--fw-surface-3); color: var(--fw-text); font: inherit; text-align: center; cursor: pointer; }
.delivery-choice span:not(.item-tile) { overflow-wrap: anywhere; font-weight: 800; font-size: calc(var(--fs) * 0.8); }
.delivery-choice small { font-size: calc(var(--fs) * 0.7); }
.delivery-choice.selected { background: var(--fw-leaf-soft); outline: 2px solid var(--fw-accent); }
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
`;var Xr=`
/* \uD0D0\uC0AC */
.explore-tabs { grid-template-columns: 1fr 1fr 1.4fr; }
.explore-tabs .field-tab span { white-space: nowrap; }
.pair-chips { margin-top: 0.4em; }
.trail-card { position: relative; padding: 0; overflow: hidden; }
.trail-art { display: block; width: 100%; height: auto; }
.place-sign { position: absolute; left: 0.8em; top: 0.8em; padding: 0.3em 0.9em; border-radius: 0.6em; border: var(--line) solid var(--ink); background: #e2b57a; color: var(--ink); font-weight: 900; box-shadow: var(--drop); }
.arc-card > .section-title { justify-content: center; }
.episode-row { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.4em; }
.episode-tile { width: 100%; min-height: 44px; font: inherit; color: var(--fw-text); cursor: pointer; display: grid; justify-items: center; gap: 0.25em; padding: 0.5em 0.35em; border-radius: 0.9em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); text-align: center; }
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
.story-layout .dialogue-box:not(.choice):not(.loading):not(.error):not(.end) { height: 9em; overflow-y: auto; align-content: start; }
.story-layout .speaker-tag { position: static; justify-self: start; padding: 0; border: 0; background: transparent; color: var(--fw-wood-dark); }
.story-layout .dialogue-box .line { font-size: var(--fs); font-weight: 600; line-height: 1.45; }
.story-layout .reader-foot { flex: none; display: flex; align-items: center; margin-top: 0; }
.story-layout .reader-foot .button { flex: 1; }
.reader-tools { gap: 0.35em; }
.reader-tools .chip-button { min-height: 44px; padding: 0.1em 0.7em; }
.chip-button.active { background: var(--fw-accent); color: var(--fw-on-accent); }
.story-stage { position: relative; height: clamp(15em, 52vh, 26em); border-radius: 1.1em; border: var(--line) solid var(--ink); background: #e9c995; overflow: hidden; box-shadow: var(--drop); }
.stage-shelf { position: absolute; left: 0; right: 0; top: 0; height: 58%; border-bottom: var(--line) solid var(--ink); background: #c58a52; }
.stage-shelf::before { content: ""; position: absolute; left: 8%; right: 8%; top: 35%; height: 0.6em; border: var(--line-in) solid var(--ink); border-radius: 0.3em; background: #8a5a33; }
.stage-cast { position: absolute; inset: 0; display: grid; grid-auto-flow: column; grid-auto-columns: 1fr; align-items: end; padding: 0 4%; }
.stage-spot { position: relative; display: block; height: 92%; }
.stage-spot .figure { position: absolute; inset: 0; }
.emotion-bubble { position: absolute; z-index: 2; bottom: var(--mark-bottom, 78%); left: var(--mark-left, 50%); transform: translateX(-50%); display: inline-grid; place-items: center; min-width: 2.2em; height: 2.2em; padding: 0 0.4em; border-radius: 999px; border: var(--line-in) solid var(--ink); background: #fff8e8; font-weight: 900; font-size: calc(var(--fs) * 1.2); }
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
`;var Yn=It.map(e=>`.season-${e}.art-base.backdrop-forest .scroll { background: var(--fw-page) ${fe(le[e].base)} center top / cover no-repeat; }`).join(`
`),Jr=`
/* Season backdrop (portrait). It scrolls with the page so the column keeps its full width on tall phones. */
${Yn}
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
  background: ${fe(se.titleSign)} center / 100% 100% no-repeat;
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
  border-image: ${fe(se.primaryButton)} 70 138 fill / 16px 32px / 0 stretch;
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
  border-image: ${fe(se.paperPanel)} 105 154 fill / 30px 44px / 0 stretch;
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
.work-card .facility-entry:has(.facility-image) > .outline-button { width: 100%; margin: 0; justify-content: center; text-align: center; white-space: nowrap; font-size: calc(var(--fs) * 0.85); }
.work-stock-actions .outline-button { justify-content: center; text-align: center; }
.work-fields { margin-bottom: 0; }
.work-fields .field-tab { min-height: 44px; padding: 0.3em 0.1em; border-bottom: var(--line) solid var(--ink); border-radius: 0.65em; }
.work-fields .field-glyph { display: none; }
.work-card .facility-art, .work-card .facility-image { width: 44px; height: 44px; }
.work-card .facility-text strong { font-size: var(--fs); }
.work-card .facility-open { gap: 0.4em; }
.work-card .segment { min-height: 44px; }
.work-card .facility-entry .outline-button { min-height: 44px; }
.work-card .plan-row.current-work { grid-template-columns: auto minmax(0, 1fr) auto; }
.work-card .current-work .plan-label { grid-column: 1 / -1; }
.work-card .current-work .plan-progress { grid-column: auto; }
.art-paper .work-card { padding: 0.6em 0.8em; gap: 0.25em; }
`;var Zr=`
.memory-choices { display: grid; gap: 0.35em; }
.memory-choices .button { min-height: 44px; justify-content: flex-start; text-align: left; font-size: calc(var(--fs) * 0.85); }
.memory-choices [aria-pressed="true"] { outline: 2px solid var(--fw-accent); }
.memory-detail { display: grid; gap: 0.5em; padding: 0.7em; border-radius: 0.8em; background: var(--fw-surface-3); overflow-wrap: anywhere; }
.memory-detail form { display: grid; gap: 0.5em; }

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

.ground-launch { position: absolute; right: 0.6em; bottom: 0.5em; z-index: 4; min-height: 44px; }
.ground-overlay { position: absolute; inset: 0; z-index: 5; }
.ground-selection { position: absolute; border: 3px dashed #fff; outline: 2px solid #286c4b; background: #4f8f6e55; }
.ground-caption { position: absolute; top: 0; left: 50%; transform: translate(-50%, -100%); padding: 0.2em 0.4em; white-space: nowrap; color: #fff; background: #286c4b; font-size: 12px; }
.ground-handle { position: absolute; width: 44px; height: 44px; border: 2px solid #286c4b; border-radius: 50%; color: #243d2c; background: #fff8e8; font: inherit; font-weight: 900; touch-action: none; cursor: grab; padding: 0; }
.ground-handle.left { left: 0; top: 50%; transform: translate(-50%, -50%); }
.ground-handle.right { right: 0; top: 50%; transform: translate(50%, -50%); }
.ground-handle.top { left: 50%; top: 0; transform: translate(-50%, -50%); }
.ground-handle.bottom { left: 50%; bottom: 0; transform: translate(-50%, 50%); }
.editing-ground .resident-spot { pointer-events: none; }
.editing-ground .resident-spot:not(.filled) { visibility: hidden; }
.editing-ground .resident-spot.filled, .editing-ground .resident-spot.filled .figure { animation-play-state: paused; }
.ground-actions { grid-column: 1 / -1; display: grid; gap: 0.4em; font-size: calc(var(--fs) * 0.85); }
.ground-action-row { display: grid; grid-template-columns: 1.4fr 1fr 1fr; gap: 0.3em; }
.ground-action-row .button { min-width: 0; min-height: 44px; padding: 0.3em; }
/* Foot positions follow the saved world's ground rectangle. */
.ground-stage .resident-spot { position: absolute; transform: translate(-50%, -100%); top: 65%; }
.ground-stage .resident-spot.left { left: 22%; }
.ground-stage .resident-spot.right { left: 78%; }
.ground-stage .resident-spot.filled.left { animation: fw-ground-left 18s ease-in-out infinite; }
.ground-stage .resident-spot.filled.right { animation: fw-ground-right 18s ease-in-out infinite; }
@keyframes fw-ground-left { 0%, 20%, 95%, 100% { left: 22%; top: 65%; } 45%, 70% { left: 40%; top: 35%; } }
@keyframes fw-ground-right { 0%, 20%, 95%, 100% { left: 78%; top: 40%; } 45%, 70% { left: 60%; top: 65%; } }
@media (prefers-reduced-motion: reduce) { .ground-stage .resident-spot.filled.left, .ground-stage .resident-spot.filled.right { animation: none; } }
/* Home scene: residents standing in their places. */
.resident-spot.filled { width: 8.5em; height: 11em; border: 0; border-radius: 0; background: none; }
.resident-spot.filled.left { animation: fw-stroll-left 12s ease-in-out infinite; }
.resident-spot.filled.right { animation: fw-stroll-right 15s ease-in-out infinite; }
@keyframes fw-stroll-left { 0%, 20%, 95%, 100% { transform: translate(0, 0); } 45%, 70% { transform: translate(2.5em, 0); } }
@keyframes fw-stroll-right { 0%, 20%, 95%, 100% { transform: translate(0, 0); } 45%, 70% { transform: translate(-2.5em, 0); } }
@media (prefers-reduced-motion: reduce) { .resident-spot.filled.left, .resident-spot.filled.right { animation: none; } }
@keyframes fw-facing-left { 0%, 69% { transform: scaleX(1); } 70%, 94% { transform: scaleX(-1); } 95%, 100% { transform: scaleX(1); } }
@keyframes fw-facing-right { 0%, 69% { transform: scaleX(-1); } 70%, 94% { transform: scaleX(1); } 95%, 100% { transform: scaleX(-1); } }
.resident-spot.filled .figure { position: absolute; inset: 0; }
.resident-spot.filled.left .figure { animation: fw-facing-left 12s step-end infinite; }
.resident-spot.filled.right .figure { animation: fw-facing-right 15s step-end infinite; }
@media (prefers-reduced-motion: reduce) { .resident-spot.filled.left .figure, .resident-spot.filled.right .figure { animation: none; } }
.spot-name { position: absolute; left: 50%; bottom: -0.4em; transform: translateX(-50%); padding: 0.05em 0.6em; border-radius: 999px; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); font-size: calc(var(--fs) * 0.78); font-weight: 800; white-space: nowrap; max-width: 100%; overflow: hidden; text-overflow: ellipsis; }
.resident-spot.invite { border-style: solid; background: var(--fw-surface-3); color: var(--fw-accent); box-shadow: var(--drop); }
.resident-spot.invite .spot-text { margin: 0 0.4em 0.6em; text-align: center; }

/* \u2500\u2500 \uD504\uB85C\uD544 sheet \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.sheet-head { display: flex; align-items: center; justify-content: space-between; gap: 0.5em; }
.profile-identity { display: flex; align-items: center; gap: 0.8em; padding: 0.6em; border-radius: 0.9em; background: var(--fw-surface-3); }
.profile-identity-text { display: grid; gap: 0.2em; min-width: 0; }
.profile-identity-text strong { overflow-wrap: anywhere; font-size: calc(var(--fs) * 1.1); }
.profile-identity-text .outline-button { min-height: 44px; justify-content: center; }
.profile-tabs { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.35em; }
.profile-tab { min-height: 44px; padding: 0.3em; border: 2px solid var(--ink); border-radius: 0.6em; background: var(--fw-surface-3); color: var(--fw-text); font: inherit; font-weight: 700; cursor: pointer; }
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
`;var ea="marinara-capability-forest-workshop",ct=class extends HTMLElement{constructor(){super();P(this,"root");P(this,"controller",null);P(this,"diagnostics",null);P(this,"unsubscribe",null);P(this,"styleNode",document.createElement("style"));P(this,"renderedRoute",null);P(this,"renderedPage",null);P(this,"ticker");P(this,"refreshedEnds",new Set);P(this,"onPresence",()=>{this.controller?.heartbeat()});P(this,"presentWorld",null);this.root=this.attachShadow({mode:"open"}),this.styleNode.textContent=Kr+Qr+Zr+Yr+Xr+Jr}connectedCallback(){this.controller||(this.controller=Bt(),this.diagnostics=new Pe,this.controller.start()),this.unsubscribe?.(),this.unsubscribe=this.controller.store.subscribe(a=>this.render(a)),this.render(this.controller.store.get()),this.controller.startHeartbeat(),document.addEventListener("visibilitychange",this.onPresence),window.addEventListener("focus",this.onPresence),clearInterval(this.ticker),this.ticker=setInterval(()=>this.tick(),1e3)}disconnectedCallback(){this.unsubscribe?.(),this.unsubscribe=null,this.controller?.stopHeartbeat(),document.removeEventListener("visibilitychange",this.onPresence),window.removeEventListener("focus",this.onPresence),clearInterval(this.ticker)}tick(){let a=Date.now();for(let n of this.root.querySelectorAll("[data-countdown-end]")){let i=Number(n.dataset.countdownEnd);n.textContent=he(i-a),i<=a&&!this.refreshedEnds.has(n.dataset.countdownEnd)&&(this.refreshedEnds.add(n.dataset.countdownEnd),setTimeout(()=>{this.controller?.refreshProduction()},1500))}for(let n of this.root.querySelectorAll("[data-progress-end]")){let i=Number(n.dataset.progressEnd),o=Math.max(1,Number(n.dataset.progressTotal));n.style.width=`${Math.min(100,Math.max(0,Math.round((o-Math.max(0,i-a))/o*100)))}%`}}screen(a,n){switch(a.route){case"home":return pr(a,n);case"work":return Gr(a,n);case"facilities":return Vr(a,n);case"settings":return Wr(a,n);case"backup":return Er(a,n);case"residents":return Ar(a,n);case"relations":return Nr(a,n);case"register":return vr(a,n);case"resident-image":return $r(a,n);case"invite":return gr(a,n);case"explore":return br(a,n);case"story":return wr(a,n);case"diagnostics":return this.diagnostics.start(),R(a,n,{top:{kind:"sub",title:"\uC5F0\uACB0 \uC810\uAC80",back:{route:"backup",label:"\uC800\uC7A5\xB7\uBC31\uC5C5"},resources:!1},backdrop:"wood",body:[this.diagnostics.node],nav:!0});default:return Hr(a,n)}}render(a){let n=a.world?.state==="ready"?a.world.value.worldId:null;n&&n!==this.presentWorld&&(this.presentWorld=n,queueMicrotask(()=>{this.controller?.heartbeat()}));let i=this.screen(a,this.controller);this.style.setProperty("--fw-font-size",`${a.fontSize}px`);let o=this.root.activeElement,s=o?.id,l=o&&"selectionStart"in o&&typeof o.selectionStart=="number"?[o.selectionStart,o.selectionEnd??o.selectionStart]:null,c=Ft(a),d=a.route===this.renderedRoute&&c===this.renderedPage?this.root.querySelector(".scroll")?.scrollTop??0:0;this.root.replaceChildren(this.styleNode,i),this.renderedRoute=a.route,this.renderedPage=c;let p=this.root.querySelector(".scroll");if(p&&(p.scrollTop=d),s){let f=this.root.getElementById(s);if(f?.focus({preventScroll:!0}),f&&l&&typeof f.setSelectionRange=="function")try{f.setSelectionRange(l[0],l[1])}catch{}}}};typeof customElements<"u"&&!customElements.get(ea)&&customElements.define(ea,ct);
