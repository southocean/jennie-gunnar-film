/* Jennie & Gunnar - wedding film story builder (v3: chapters, dark mode, timeline) */
(function(){
"use strict";
const DATA = window.DATA;
const LS_KEY = "jennie_story_v5";
const EVENTS = DATA.events;
const MON=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const byId = {};
DATA.videos.forEach(v=>{v.type="video";byId[v.id]=v;});
DATA.images.forEach(m=>{m.type="image";byId[m.id]=m;});
let anaType = "video";

/* ---------- state (two switchable story versions) ---------- */
let state = load();
function buildVersion(chapters){
  const meta={}, chs=[];
  chapters.forEach((ch,i)=>{ const items=[]; ch.items.forEach(b=>{ items.push(b.item); meta[b.item]={beat:b.beat||"",dur:b.dur|0}; }); chs.push({id:"ch"+i,title:ch.title,collapsed:false,items:items}); });
  return {chapters:chs, meta:meta};
}
function defaultState(){
  const saved={}; Object.keys(DATA.stories).forEach(k=>{ saved[k]=buildVersion(DATA.stories[k].chapters); });
  const active = saved.jennie ? "jennie" : Object.keys(saved)[0];
  const st={saved:saved, active:active, ratings:{}, seq:99, theme:"light", version:4};
  st.chapters=saved[active].chapters; st.meta=saved[active].meta; return st;
}
function scrub(s){ return typeof s==="string" ? s.replace(/[—–]/g,"-") : s; }
function sanitizeState(st){ // strip any em/en dashes left in already-saved captions & titles
  if(st&&st.saved) Object.keys(st.saved).forEach(k=>{ const v=st.saved[k];
    if(v.chapters) v.chapters.forEach(ch=>{ ch.title=scrub(ch.title); });
    if(v.meta) Object.keys(v.meta).forEach(id=>{ if(v.meta[id]) v.meta[id].beat=scrub(v.meta[id].beat); });
  });
  return st;
}
function load(){
  let st=null;
  try{ const s=JSON.parse(localStorage.getItem(LS_KEY));
    if(s&&s.version===5&&s.saved){ if(!s.saved[s.active]) s.active=Object.keys(s.saved)[0]; st=s; }
  }catch(e){}
  if(!st){ // migrate v4: keep First-draft edits + ratings/theme, refresh Jennie's story to the new template
    try{ const s4=JSON.parse(localStorage.getItem("jennie_story_v4"));
      if(s4&&s4.version===4&&s4.saved){ st=defaultState(); if(s4.saved.draft1) st.saved.draft1=s4.saved.draft1; if(s4.ratings)st.ratings=s4.ratings; if(s4.theme)st.theme=s4.theme; st.active=(s4.active&&st.saved[s4.active])?s4.active:"jennie"; }
    }catch(e){}
  }
  if(!st){ try{ const old=JSON.parse(localStorage.getItem("jennie_story_v3"));
    if(old&&old.version===3&&old.chapters){ st=defaultState(); st.saved.draft1={chapters:old.chapters,meta:old.meta||{}}; st.active="draft1"; if(old.ratings)st.ratings=old.ratings; if(old.theme)st.theme=old.theme; }
  }catch(e){} }
  if(!st) st=defaultState();
  sanitizeState(st);
  st.chapters=st.saved[st.active].chapters; st.meta=st.saved[st.active].meta;
  try{ localStorage.setItem(LS_KEY, JSON.stringify({saved:st.saved,active:st.active,ratings:st.ratings,theme:st.theme,seq:st.seq,version:5})); }catch(e){}
  return st;
}
function save(){ localStorage.setItem(LS_KEY, JSON.stringify({saved:state.saved,active:state.active,ratings:state.ratings,theme:state.theme,seq:state.seq,version:5})); }
function loadVersion(v){ if(!state.saved[v])return; state.active=v; state.chapters=state.saved[v].chapters; state.meta=state.saved[v].meta; save(); updateVersionButtons(); renderAll(); const nm=DATA.stories[v]?DATA.stories[v].name:v; toast("Now editing: "+nm); }
function shortVerName(v){ const n=(DATA.stories[v]?DATA.stories[v].name:v)||v; return n.split("(")[0].trim(); }
function updateVersionButtons(){ const vs=$("#verSelect"); if(vs) vs.value=state.active; const rb=$("#btnReset"); if(rb){ rb.textContent="↺ Reset "+shortVerName(state.active); rb.title="Reset "+shortVerName(state.active)+" back to its original"; } }
function ratingOf(id){ return state.ratings[id]!=null ? state.ratings[id] : (byId[id]?byId[id].rating:0); }

/* ---------- helpers ---------- */
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
function fmt(t){t=Math.max(0,Math.round(t));return Math.floor(t/60)+":"+String(t%60).padStart(2,"0");}
function posterOf(m){ return m.type==="video" ? `media/vid/${m.id}/poster.jpg` : `media/img/${m.id}.jpg`; }
function framesOf(m){ return m.type==="video" ? [1,2,3,4,5].map(n=>`media/vid/${m.id}/f${n}.jpg`) : [posterOf(m)]; }
function evOf(m){ return EVENTS[m.event] || {label:m.event||"-",color:"#999"}; }
function monYear(d){ if(!d||d.length<7) return ""; return MON[+d.slice(5,7)-1]+" "+d.slice(0,4); }
function dateLabel(m){ if(!m.date) return ""; return (m.dateApprox?"~":"")+monYear(m.date); }
function defaultDur(m){ return m.type==="video" ? (m.dur>8?6:(m.dur||5)) : 3; }
/* relationship timeline anchors (dating screenshot has no EXIF, so earliest photo = start) */
const REL_START="2023-10-22"; let REL_END="2026-07-20";
(function(){ let mx=REL_START; [...DATA.videos,...DATA.images].forEach(m=>{ if(m.date&&m.date>mx) mx=m.date; });
  let t; try{ t=new Date().toISOString().slice(0,10); }catch(e){ t=mx; } REL_END = t>mx?t:mx; })();
function dnum(d){ return Date.parse(d+"T00:00:00"); }
function posOf(m){ if(!m||!m.date) return null; const s=dnum(REL_START),e=dnum(REL_END),x=dnum(m.date); if(!(e>s)) return null; return Math.max(0,Math.min(1,(x-s)/(e-s))); }
function timelineBar(m){ const p=posOf(m); if(p==null) return ""; const pc=(p*100).toFixed(1);
  return `<div class="tl" title="${dateLabel(m)}"><div class="tl-fill" style="width:${pc}%"></div><div class="tl-dot" style="left:${pc}%"></div></div>`; }
function typeTag(m){ return m.type==="video" ? "🎬" : "🖼"; }
function modalTimeline(m){ // labeled scale: first date --> now, with this clip marked at its date
  const p=posOf(m), startLbl=monYear(REL_START)||"the start";
  if(p==null) return `<div class="mtl"><div class="mtl-scale"><div class="mtl-track"><div class="mtl-fill" style="width:0"></div></div><div class="mtl-ends"><span>First date · ${startLbl}</span><span>Now</span></div></div><div class="mtl-note">no date on this clip</div></div>`;
  const pc=(p*100).toFixed(1), fpc=Math.max(9,Math.min(91,p*100)).toFixed(1), lbl=dateLabel(m);
  return `<div class="mtl"><div class="mtl-scale">
    <div class="mtl-flag" style="left:${fpc}%"><span>${lbl}</span></div>
    <div class="mtl-track"><div class="mtl-fill" style="width:${pc}%"></div><div class="mtl-dot" style="left:${pc}%"></div></div>
    <div class="mtl-ends"><span>First date · ${startLbl}</span><span>Now</span></div>
  </div></div>`;
}
const HEAD_H=36;
function pieFor(idx){ const times=state.chapters.map(chapterTime); const total=times.reduce((a,b)=>a+b,0)||1; let acc=0,segs=[];
  times.forEach((t,i)=>{ const a=acc/total*360, b=(acc+t)/total*360; segs.push(`${i===idx?"var(--accent)":"var(--pie-dim)"} ${a.toFixed(1)}deg ${b.toFixed(1)}deg`); acc+=t; });
  return `conic-gradient(${segs.join(",")})`; }
function toast(msg){ const t=$("#toast"); t.textContent=msg; t.hidden=false; clearTimeout(t._t); t._t=setTimeout(()=>t.hidden=true,1900); }
function hoverCycle(imgEl,frames){
  if(!imgEl||frames.length<2)return;
  const wrap=imgEl.parentElement; let i=0,t=null;
  wrap.addEventListener("mouseenter",()=>{t=setInterval(()=>{i=(i+1)%frames.length;imgEl.src=frames[i];},430);});
  wrap.addEventListener("mouseleave",()=>{clearInterval(t);i=0;imgEl.src=frames[0];});
}
function sorter(k){
  if(k==="rating") return (a,b)=> ratingOf(b.id)-ratingOf(a.id)||a.id.localeCompare(b.id);
  if(k==="date")   return (a,b)=> (a.date||"9999").localeCompare(b.date||"9999")||a.id.localeCompare(b.id);
  if(k==="event")  return (a,b)=> (a.event||"").localeCompare(b.event||"")||(a.date||"").localeCompare(b.date||"");
  if(k==="loc")    return (a,b)=> (a.loc||"").localeCompare(b.loc||"")||a.id.localeCompare(b.id);
  if(k==="dur")    return (a,b)=> (b.dur||0)-(a.dur||0);
  return (a,b)=> a.id.localeCompare(b.id);
}

/* ---------- stars ---------- */
function starsEl(id,readonly){
  const cur=ratingOf(id), el=document.createElement("div");
  el.className="stars"+(readonly?" readonly":""); el.dataset.for=id;
  for(let n=1;n<=5;n++){ const s=document.createElement("span"); s.className="s"+(n<=cur?" on":""); s.textContent="★"; s.dataset.n=n;
    if(!readonly) s.addEventListener("click",e=>{e.stopPropagation();setRating(id,n);}); el.appendChild(s); }
  return el;
}
function setRating(id,n){ state.ratings[id]=n; save(); $$('.stars[data-for="'+id+'"]').forEach(el=>{const c=ratingOf(id);$$(".s",el).forEach(s=>s.classList.toggle("on",+s.dataset.n<=c));}); renderPoolRatings(id); toast("Rating updated - saved."); }
function renderPoolRatings(id){ $$('#poolList .pcard[data-id="'+id+'"] .prate').forEach(e=>e.textContent="★".repeat(ratingOf(id))); }

/* ---------- pool ---------- */
function allStoryIds(){ const a=[]; state.chapters.forEach(c=>a.push(...c.items)); return a; }
function inStory(id){ return allStoryIds().indexOf(id)>=0; }
function poolCard(m){
  const ev=evOf(m), c=document.createElement("div"); c.className="pcard"; c.dataset.id=m.id;
  c.innerHTML=`<div class="pev" style="background:${ev.color}"></div>
   <div class="pthumb"><img src="${posterOf(m)}" loading="lazy" alt="">
     <span class="ptype">${typeTag(m)}</span>
     ${m.type==="video"?`<span class="pdur">${m.dur}s</span>`:""}
     <div class="pbot">
       <div class="pln">📍 ${m.loc||"-"}</div>
       ${timelineBar(m)}
       <div class="prate">${"★".repeat(ratingOf(m.id))}<span class="proff">${"★".repeat(5-ratingOf(m.id))}</span></div>
     </div></div>`;
  hoverCycle($("img",c),framesOf(m));
  c.addEventListener("click",()=>{ if(clickBlocked())return; openModal(m.id); });
  return c;
}
function renderPool(){
  const list=$("#poolList"); list.innerHTML="";
  const q=$("#poolSearch").value.trim().toLowerCase(), ty=$("#poolType").value, evf=$("#poolEvent").value, minR=+$("#poolRating").value, sort=$("#poolSort").value;
  let items=[...DATA.videos,...DATA.images].filter(m=>!inStory(m.id));
  if(ty) items=items.filter(m=>m.type===ty);
  if(evf) items=items.filter(m=>m.event===evf);
  if(minR) items=items.filter(m=>ratingOf(m.id)>=minR);
  if(q) items=items.filter(m=>((m.loc||"")+" "+(m.ctx||"")+" "+(m.beat||"")+" "+evOf(m).label+" "+dateLabel(m)).toLowerCase().includes(q));
  items.sort(sorter(sort));
  items.forEach(m=>list.appendChild(poolCard(m)));
  $("#poolCount").textContent=items.length;
}

/* ---------- story: chapters ---------- */
function chById(id){ return state.chapters.find(c=>c.id===id); }
function chapterTime(ch){ return ch.items.reduce((s,id)=>s+((state.meta[id]&&state.meta[id].dur)||0),0); }
function renderStory(){
  const list=$("#storyList"); list.innerHTML="";
  let globalNum=0;
  state.chapters.forEach((ch,idx)=>{
    // header + body are DIRECT children of the scroller so headers stack (sticky) as you scroll past acts
    const head=document.createElement("div"); head.className="ch-head"+(ch.collapsed?" is-collapsed":""); head.dataset.ch=ch.id;
    head.innerHTML=`<button class="ch-toggle" aria-label="Collapse or expand">${ch.collapsed?"▸":"▾"}</button>
      <span class="ch-pie" title="share of total runtime" style="background:${pieFor(idx)}"></span>
      <input class="ch-title" value="${(ch.title||"").replace(/"/g,'&quot;')}">
      <span class="ch-meta"><span class="ch-time" title="chapter runtime">⏱ ${fmt(chapterTime(ch))}</span><span class="ch-cnt">${ch.items.length}🎞</span></span>
      <button class="ch-x" title="Delete chapter (clips return to the pool)">✕</button>`;
    $(".ch-toggle",head).addEventListener("click",()=>{ ch.collapsed=!ch.collapsed; save(); renderStory(); });
    const ti=$(".ch-title",head); ti.addEventListener("input",()=>{ch.title=ti.value;save();});
    $(".ch-x",head).addEventListener("click",()=>{ if(ch.items.length===0||confirm('Delete "'+ch.title+'"? Its clips go back to the pool.')){ state.chapters=state.chapters.filter(c=>c.id!==ch.id); save(); renderStory(); renderPool(); }});
    list.appendChild(head);

    if(ch.collapsed){
      const strip=document.createElement("div"); strip.className="ch-strip"+(ch.items.length?"":" empty"); strip.dataset.ch=ch.id;
      ch.items.slice(0,20).forEach(id=>{ const m=byId[id]; if(!m)return; const im=document.createElement("img"); im.src=posterOf(m); im.loading="lazy"; im.title=m.loc||""; strip.appendChild(im); });
      if(ch.items.length>20){ const s=document.createElement("span"); s.className="more"; s.textContent="+"+(ch.items.length-20); strip.appendChild(s); }
      list.appendChild(strip);
    } else {
      const body=document.createElement("div"); body.className="ch-body"+(ch.items.length?"":" empty"); body.dataset.ch=ch.id;
      ch.items.forEach(id=>{ const m=byId[id]; if(!m)return; globalNum++; body.appendChild(beatCard(m,globalNum)); });
      list.appendChild(body);
    }
  });
  $("#storyEmpty").hidden=true;
  updateRuntime();
  initStorySortables();
}
function beatCard(m,num){
  const meta=state.meta[m.id]||(state.meta[m.id]={beat:m.beat||"",dur:defaultDur(m)});
  const el=document.createElement("div"); el.className="beat"; el.dataset.id=m.id;
  el.innerHTML=`<div class="bthumb"><img src="${posterOf(m)}" loading="lazy" alt="">
      <span class="bnum">${num}</span><span class="btype">${typeTag(m)} ${m.type==="video"?meta.dur+"s":"photo"}</span>
      <div class="bbot"><div class="bln">📍 ${m.loc||"-"}</div>${timelineBar(m)}</div></div>
    <div class="bbody">
      <textarea placeholder="beat / caption…">${(meta.beat||"").replace(/</g,"&lt;")}</textarea>
      <div class="bctrl">⏱<input class="bdurin" type="number" min="1" max="60" value="${meta.dur}">s
        <button class="bi" title="Full notes">ⓘ</button><button class="bx" title="Remove">✕</button></div>
    </div>`;
  hoverCycle($("img",el),framesOf(m));
  const ta=$("textarea",el); ta.addEventListener("input",()=>{meta.beat=ta.value;save();});
  const di=$(".bdurin",el); di.addEventListener("input",()=>{meta.dur=Math.max(1,+di.value||1);if(m.type==="video")$(".btype",el).textContent=typeTag(m)+" "+meta.dur+"s";save();updateRuntime();updateChapterTimes();});
  $(".bi",el).addEventListener("click",()=>openModal(m.id));
  const bt=$(".bthumb",el); bt.title="Click for info · press and drag to reorder";
  bt.addEventListener("click",()=>{ if(clickBlocked())return; openModal(m.id); });
  $(".bx",el).addEventListener("click",()=>{ const ch=state.chapters.find(c=>c.items.indexOf(m.id)>=0); if(ch){ch.items=ch.items.filter(x=>x!==m.id);save();renderStory();renderPool();} });
  return el;
}
function updateChapterTimes(){ $$("#storyList .ch-head").forEach(head=>{ const idx=state.chapters.findIndex(c=>c.id===head.dataset.ch); if(idx<0)return; const ch=state.chapters[idx]; $(".ch-time",head).textContent="⏱ "+fmt(chapterTime(ch)); const pie=$(".ch-pie",head); if(pie)pie.style.background=pieFor(idx); }); }
function updateRuntime(){
  let total=0,beats=0; state.chapters.forEach(c=>c.items.forEach(id=>{const mt=state.meta[id];if(mt){total+=mt.dur;beats++;}}));
  $("#runTotal").textContent=fmt(total); $("#beatCount").textContent=beats;
  const target=DATA.targetSec||135; $("#runTarget").textContent=fmt(target);
  const fill=$("#runFill"); fill.style.width=Math.min(100,total/target*100)+"%";
  fill.style.background= total>target*1.15 ? "linear-gradient(90deg,var(--danger),var(--gold))" : "linear-gradient(90deg,var(--accent2),var(--gold))";
  const h=$("#runHint");
  h.textContent = total<80 ? "A touch short - room for a few more beats." : (total<=150 ? "Right in the sweet spot for a 2-2½ min film. ✨" : "Getting long - trim a few beat durations or clips.");
}

/* ---------- drag/drop across chapters + pool ---------- */
let chapterSortables=[], poolSortable=null, refreshT=null, sortDragging=false, lastDragEnd=0;
function clickBlocked(){ return sortDragging || (Date.now()-lastDragEnd)<250; } // ignore clicks during/just-after a drag
function scheduleRefresh(){ if(refreshT)return; refreshT=setTimeout(()=>{refreshT=null; syncFromDOM(); save(); renderStory(); renderPool();},0); }
function syncFromDOM(){
  $$("#storyList .ch-body").forEach(body=>{ const ch=chById(body.dataset.ch); if(!ch)return;
    ch.items=$$(":scope > .beat, :scope > .pcard",body).map(n=>n.dataset.id); });
  allStoryIds().forEach(id=>{ if(!state.meta[id]) state.meta[id]={beat:(byId[id]&&byId[id].beat)||"",dur:defaultDur(byId[id])}; });
}
function initStorySortables(){
  chapterSortables.forEach(s=>{try{s.destroy();}catch(e){}}); chapterSortables=[];
  $$("#storyList .ch-body").forEach(body=>{
    chapterSortables.push(new Sortable(body,{group:{name:"media",pull:true,put:true},draggable:".beat",handle:".bthumb",animation:150,
      onStart:()=>{sortDragging=true;}, onEnd:()=>{sortDragging=false;lastDragEnd=Date.now();},
      onAdd:scheduleRefresh,onUpdate:scheduleRefresh,onRemove:scheduleRefresh}));
  });
}
function initPoolSortable(){ poolSortable=new Sortable($("#poolList"),{group:{name:"media",pull:true,put:false},sort:false,draggable:".pcard",animation:150,
  onStart:()=>{sortDragging=true;}, onEnd:()=>{sortDragging=false;lastDragEnd=Date.now();scheduleRefresh();}}); }

/* ---------- modal ---------- */
function openModal(id){
  const m=byId[id]; if(!m)return; const ev=evOf(m);
  const frames=framesOf(m).map(f=>`<img src="${f}" alt="">`).join("");
  const dl=dateLabel(m);
  const b=$("#modalBody");
  b.innerHTML=`<img class="mhero" src="${posterOf(m)}" alt="">
    <div class="mbody"><h3>${m.loc||"-"}</h3>
      <div class="mrow"><span class="k">Rating</span><span class="starhost"></span></div>
      <div class="mrow"><span class="k">Type</span><span>${m.type==="video"?"🎬 Video · "+m.dur+"s · "+m.orient:"🖼 Photo · "+m.orient}</span></div>
      <div class="mrow mtlrow"><span class="k">When</span>${modalTimeline(m)}</div>
      <div class="mrow"><span class="k">Trip / event</span><span><span class="a-badge" style="background:${ev.color};color:#fff;padding:1px 7px;border-radius:6px">${ev.label}</span></span></div>
      <div class="mrow"><span class="k">Who</span><span>${m.people||"-"}</span></div>
      <div class="mrow"><span class="k">What</span><span>${m.ctx||"-"}</span></div>
      ${m.beat?`<div class="mrow"><span class="k">Story idea</span><span><em>“${m.beat}”</em></span></div>`:""}
      <div class="mrow"><span class="k">File</span><span style="font-size:12px;color:var(--muted)">${m.file}</span></div>
      ${m.type==="video"?`<div class="mframes">${frames}</div>`:""}
    </div>`;
  const st=starsEl(id,false); $(".starhost",b).appendChild(st);
  $("#modal").hidden=false;
}
function closeModal(){ $("#modal").hidden=true; }

/* ---------- analysis ---------- */
function renderAnalysis(){
  const grid=$("#anaGrid"); grid.className="ana-grid "+(anaType==="image"?"img":"vid"); grid.innerHTML="";
  const q=$("#anaSearch").value.trim().toLowerCase(), evf=$("#anaEvent").value, minR=+$("#anaRating").value, sort=$("#anaSort").value;
  let items=(anaType==="image"?DATA.images:DATA.videos).slice();
  if(evf) items=items.filter(m=>m.event===evf);
  if(minR) items=items.filter(m=>ratingOf(m.id)>=minR);
  if(q) items=items.filter(m=>((m.loc||"")+" "+(m.ctx||"")+" "+evOf(m).label+" "+dateLabel(m)).toLowerCase().includes(q));
  items.sort(sorter(sort));
  items.forEach(m=>grid.appendChild(anaCard(m)));
}
function anaCard(m){
  const ev=evOf(m), c=document.createElement("div"); c.className="acard"; c.dataset.id=m.id;
  c.innerHTML=`<div class="aev" style="background:${ev.color}"></div>
    <div class="athumb"><img src="${posterOf(m)}" loading="lazy" alt="">
      <span class="a-tl">${typeTag(m)} ${m.id}</span>
      <span class="a-tr">${m.type==="video"?`<span class="a-badge">⏱ ${m.dur}s</span>`:""}<span class="a-badge">${m.orient}</span></span>
      <div class="a-bot">
        <div class="ln">📍 ${m.loc||"-"}</div>
        ${m.ctx?`<div class="ln ctx">${m.ctx}</div>`:""}
        ${timelineBar(m)}
        <div class="a-starsrow"></div>
      </div></div>`;
  const st=starsEl(m.id,false); st.classList.add("sm"); $(".a-starsrow",c).appendChild(st);
  hoverCycle($("img",c),framesOf(m));
  $(".athumb",c).addEventListener("click",e=>{ if(e.target.closest(".a-starsrow"))return; openModal(m.id); });
  return c;
}

/* ---------- filters / tabs ---------- */
function fillEventSelects(){
  const opts=Object.entries(EVENTS).map(([k,v])=>`<option value="${k}">${v.label}</option>`).join("");
  $("#poolEvent").insertAdjacentHTML("beforeend",opts); $("#anaEvent").insertAdjacentHTML("beforeend",opts);
}
function switchTab(name){
  $$(".tab").forEach(t=>t.classList.toggle("active",t.dataset.tab===name));
  $$(".tabpane").forEach(p=>p.classList.remove("active"));
  $("#tab-"+name).classList.add("active");
  if(name==="analysis") renderAnalysis();
  if(name==="make") renderMake();
}

/* ---------- theme ---------- */
function applyTheme(t){ document.documentElement.setAttribute("data-theme",t); $("#btnTheme").textContent=(t==="dark"?"☀️":"🌙"); }
function toggleTheme(){ state.theme=(state.theme==="dark"?"light":"dark"); applyTheme(state.theme); save(); }

/* ---------- import / export ---------- */
function exportStory(){
  const nm=DATA.stories[state.active]?DATA.stories[state.active].name:state.active;
  const blob=new Blob([JSON.stringify({storyName:nm,active:state.active,chapters:state.chapters,meta:state.meta,ratings:state.ratings,theme:state.theme,version:4,exportedAt:new Date().toISOString()},null,2)],{type:"application/json"});
  const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download=("jennie-gunnar-"+state.active+".json"); a.click(); URL.revokeObjectURL(a.href);
  toast("Exported “"+nm+"” - send this file back to collaborate.");
}
function importStory(file){
  const r=new FileReader();
  r.onload=()=>{ try{ const s=JSON.parse(r.result);
    const chapters = s.chapters || (s.saved && s.active && s.saved[s.active] && s.saved[s.active].chapters);
    const meta = s.meta || (s.saved && s.active && s.saved[s.active] && s.saved[s.active].meta) || {};
    if(chapters){ state.saved[state.active]={chapters:chapters,meta:meta}; state.chapters=chapters; state.meta=meta; }
    if(s.ratings)state.ratings=s.ratings; if(s.theme){state.theme=s.theme;applyTheme(state.theme);}
    save(); renderAll(); toast("Imported into “"+(DATA.stories[state.active]?DATA.stories[state.active].name:state.active)+"” ✔");
  }catch(e){ toast("Could not read that file."); } };
  r.readAsText(file);
}

/* ---------- about ---------- */
function renderAbout(){
  $("#aboutBody").innerHTML=`<h2>How to use this together 💛</h2>
    <p>A shared workspace for shaping Jennie &amp; Gunnar's wedding film. Everything you change autosaves in your browser.</p>
    <h3>Story Builder</h3>
    <p><strong>Two versions</strong> up top: <em>① First draft</em> (my initial arc) and <em>② Jennie's story</em> (built from Jennie's storyline doc, grouped into bigger chapters). Switch anytime - each keeps its own edits. We're now working on Jennie's story.</p>
    <ol><li>The left panel is every clip &amp; photo - the <em>content pool</em> (small thumbnails; hover a video to preview, click any for full notes).</li>
    <li>Drag items into the <em>chapters</em> on the right. Each chapter lays its beats out left-to-right and scrolls horizontally; the header shows the chapter's running time. Collapse a chapter (▾) to just its thumbnails.</li>
    <li>Each beat has an editable caption and a duration. The top bar tracks total runtime vs our ~2¼ min target.</li></ol>
    <h3>Content Analysis</h3>
    <p>Switch between the <strong>Videos</strong> and <strong>Photos</strong> tabs. Every item shows its location and date on the thumbnail. <strong>Click the stars to re-rate</strong> - you know these moments better than I do. Sort by rating, date, location or trip.</p>
    <h3>Collaborating</h3>
    <p>This is a static site, so it can't sync live. Edit freely, hit <code>⬇ Export story</code> (a small JSON), send it back, and the other person hits <code>⬆ Import</code>. Pass the cut back and forth until it feels right.</p>
    <h3>About the dates</h3>
    <p>Photo dates are real (from EXIF). Video files had only export dates, so each video shows an <em>approximate</em> date (~) inherited from the trip it belongs to. The real timeline runs Dec 2023 (Poland) → 2024 home life → Vietnam Apr 2025 → the big Asia trip Nov-Dec 2025.</p>`;
}

/* ---------- boot ---------- */
/* ---------- make the video (shot list) ---------- */
function buildShotList(){
  const rows=[]; let t=0,n=0;
  state.chapters.forEach(ch=>{ rows.push({type:"act",title:ch.title});
    ch.items.forEach(id=>{ const m=byId[id]; if(!m)return; const meta=state.meta[id]||{}; const dur=meta.dur||defaultDur(m); n++;
      rows.push({type:"beat",n:n,tc:fmt(t),dur:dur,file:m.file,kind:m.type,cap:(meta.beat||"").trim(),loc:m.loc||""}); t+=dur; }); });
  return {rows,total:t,beats:n};
}
function shotListText(){
  const {rows,total,beats}=buildShotList(); const nm=DATA.stories[state.active]?DATA.stories[state.active].name:state.active;
  let s="JENNIE & GUNNAR - WEDDING FILM SHOT LIST\n"+nm+"  -  "+beats+" shots, "+fmt(total)+" total\n";
  rows.forEach(r=>{ if(r.type==="act") s+="\n== "+r.title+" ==\n";
    else s+=String(r.n).padStart(2," ")+".  ["+r.tc+"]  "+r.dur+"s  "+(r.kind==="video"?"[VIDEO] ":"[PHOTO] ")+r.file+"\n       "+(r.cap||"(no caption)")+"\n"; });
  return s;
}
function downloadShotList(){ const b=new Blob([shotListText()],{type:"text/plain"}); const a=document.createElement("a"); a.href=URL.createObjectURL(b); a.download="jennie-gunnar-shotlist-"+state.active+".txt"; a.click(); URL.revokeObjectURL(a.href); toast("Shot list downloaded."); }
function copyShotList(){ if(navigator.clipboard) navigator.clipboard.writeText(shotListText()).then(()=>toast("Shot list copied."),()=>toast("Copy failed - use Download.")); else toast("Use Download."); }
function renderMake(){
  const {rows,total,beats}=buildShotList(); const nm=DATA.stories[state.active]?DATA.stories[state.active].name:state.active;
  let list="";
  rows.forEach(r=>{ if(r.type==="act") list+=`<tr class="sl-act"><td colspan="4">${r.title}</td></tr>`;
    else list+=`<tr><td class="sl-n">${r.n}</td><td class="sl-tc">${r.tc}<br><b>${r.dur}s</b></td><td class="sl-file">${r.kind==="video"?"🎬":"🖼"} ${r.file}${r.loc?`<div class="sl-loc">${r.loc}</div>`:""}</td><td class="sl-cap">${r.cap||'<span class="muted">(no caption)</span>'}</td></tr>`; });
  $("#makeBody").innerHTML=`
    <h2>Make the video 🎬</h2>
    <p>You're viewing <strong>${nm}</strong> - <strong>${beats} shots, ${fmt(total)}</strong>. This turns the current timeline into a shot list you can follow in any editor; it updates whenever you edit the story or switch version.</p>
    <div class="make-actions"><button class="btn" id="btnCopySL">⧉ Copy shot list</button><button class="btn" id="btnDlSL">⬇ Download (.txt)</button></div>
    <h3>Fastest path: CapCut (free, phone or desktop)</h3>
    <ol>
      <li>Open the Drive folder of clips &amp; photos - the shot list below uses the names Jennie gave them.</li>
      <li>New project, canvas <strong>9:16 (portrait)</strong>.</li>
      <li>Add media <strong>in the order below</strong>, trimming each to about the seconds shown. For photos, set the duration and add a slow zoom (Ken Burns).</li>
      <li>Add each caption as a short text layer, bottom-centre.</li>
      <li>Lay one music track across the whole edit; let the summit act land on the biggest swell.</li>
      <li>Add 0.3-0.5s cross-dissolves; export 1080x1920.</li>
    </ol>
    <p class="hint">Want more control on desktop? <strong>DaVinci Resolve</strong> (free) works the same way: portrait timeline, clips in order, captions, one music bed.</p>
    <h3>Format &amp; feel</h3>
    <ul>
      <li><strong>Portrait 9:16, aim ~2.5 min.</strong> ~90% of the footage is vertical. The few landscape clips (Ha Long kayak, sky-bike, trekker line) can be letterboxed or punched-in.</li>
      <li><strong>Music:</strong> one warm, building track - gentle at the start, lifting through the trips, peaking at the summits, settling for the ending.</li>
      <li><strong>Captions:</strong> the beat texts are written to read as on-screen lines.</li>
    </ul>
    <h3>Or: I can build a rough cut for you</h3>
    <p>I have the original files. Tell me to <strong>"make the rough cut"</strong> and I'll assemble a real portrait .mp4 - clips and photos in this exact order, with the durations, cross-dissolves and burned-in captions (plus a music bed if you drop a track in the folder) - for you to refine.</p>
    <h3>Shot list - ${nm}</h3>
    <div class="sl-wrap"><table class="shotlist"><thead><tr><th>#</th><th>Time</th><th>Clip / photo</th><th>Caption</th></tr></thead><tbody>${list}</tbody></table></div>`;
  $("#btnCopySL").addEventListener("click",copyShotList);
  $("#btnDlSL").addEventListener("click",downloadShotList);
}
function renderAll(){ renderPool(); renderStory(); if($("#tab-analysis").classList.contains("active")) renderAnalysis(); if($("#tab-make").classList.contains("active")) renderMake(); }
function bind(){
  $$(".tab").forEach(t=>t.addEventListener("click",()=>switchTab(t.dataset.tab)));
  ["#poolSearch","#poolType","#poolEvent","#poolRating","#poolSort"].forEach(s=>$(s).addEventListener("input",renderPool));
  ["#anaSearch","#anaEvent","#anaRating","#anaSort"].forEach(s=>$(s).addEventListener("input",renderAnalysis));
  $$(".subtab").forEach(t=>t.addEventListener("click",()=>{ anaType=t.dataset.atype; $$(".subtab").forEach(x=>x.classList.toggle("active",x===t)); renderAnalysis(); }));
  $("#btnExport").addEventListener("click",exportStory);
  $("#importFile").addEventListener("change",e=>{ if(e.target.files[0])importStory(e.target.files[0]); e.target.value=""; });
  $("#btnReset").addEventListener("click",()=>{ const nm=DATA.stories[state.active]?DATA.stories[state.active].name:state.active; if(confirm("Reset “"+nm+"” back to its original? (The other version and your ratings are kept.)")){ const fresh=buildVersion(DATA.stories[state.active].chapters); state.saved[state.active]=fresh; state.chapters=fresh.chapters; state.meta=fresh.meta; save(); renderAll(); toast("Reset “"+nm+"”."); }});
  $("#btnTheme").addEventListener("click",toggleTheme);
  const vs=$("#verSelect"); if(vs) vs.addEventListener("change",()=>loadVersion(vs.value));
  $("#btnAddChapter").addEventListener("click",()=>{ state.chapters.push({id:"ch"+(state.seq++),title:"New chapter",collapsed:false,items:[]}); save(); renderStory(); $("#storyList").scrollTop=$("#storyList").scrollHeight; });
  $("#btnCollapseAll").addEventListener("click",()=>{ const anyOpen=state.chapters.some(c=>!c.collapsed); state.chapters.forEach(c=>c.collapsed=anyOpen); save(); renderStory(); $("#btnCollapseAll").textContent=anyOpen?"⊞ Expand all":"⊟ Collapse all"; });
  $$("[data-close]").forEach(el=>el.addEventListener("click",closeModal));
  document.addEventListener("keydown",e=>{ if(e.key==="Escape")closeModal(); });
}
function renderAppVer(){ const el=$("#appVer"); if(el) el.textContent="v"+(DATA.appVersion||"?")+" · updated "+(DATA.appUpdated||"-"); }
applyTheme(state.theme||"light"); fillEventSelects(); bind(); renderAbout(); renderAppVer(); initPoolSortable(); updateVersionButtons(); renderAll();
})();
