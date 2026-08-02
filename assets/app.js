/* Jennie & Gunnar — wedding film story builder
   Static app. State persists to localStorage and travels via Export/Import JSON. */
(function(){
"use strict";
const DATA = window.DATA;
const LS_KEY = "jennie_story_v2";
const EVENTS = DATA.events; // {code:{label,color}}
const byId = {};
DATA.videos.forEach(v=>{v.type="video";byId[v.id]=v;});
DATA.images.forEach(m=>{m.type="image";byId[m.id]=m;});

/* ---------- state ---------- */
let state = load();
function defaultState(){
  const meta={};
  DATA.story.forEach(b=>{ if(b.item) meta[b.item]={section:b.section||"",beat:b.beat||"",dur:b.dur|0}; });
  return {
    order: DATA.story.map(b=> b.item ? b.item : ("§"+ (b.section||"Section"))),
    meta,                      // itemId -> {section,beat,dur}
    sections:{},               // synthetic section-break id -> title
    ratings:{},                // id -> user rating override
    version:2
  };
}
function load(){
  try{const s=JSON.parse(localStorage.getItem(LS_KEY)); if(s&&s.version===2) return s;}catch(e){}
  return defaultState();
}
function save(){ localStorage.setItem(LS_KEY, JSON.stringify(state)); }
function ratingOf(id){ return state.ratings[id] != null ? state.ratings[id] : (byId[id]? byId[id].rating : 0); }

/* ---------- helpers ---------- */
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
function fmt(t){t=Math.max(0,Math.round(t));return Math.floor(t/60)+":"+String(t%60).padStart(2,"0");}
function posterOf(m){ return m.type==="video" ? `media/vid/${m.id}/poster.jpg` : `media/img/${m.id}.jpg`; }
function framesOf(m){ return m.type==="video" ? [1,2,3,4,5].map(n=>`media/vid/${m.id}/f${n}.jpg`) : [posterOf(m)]; }
function evOf(m){ return EVENTS[m.event] || {label:m.event||"—",color:"#999"}; }
function toast(msg){ const t=$("#toast"); t.textContent=msg; t.hidden=false; clearTimeout(t._t); t._t=setTimeout(()=>t.hidden=true,1900); }

function hoverCycle(imgEl, frames){
  let i=0, timer=null;
  const wrap=imgEl.closest(".thumbwrap")||imgEl.parentElement;
  wrap.addEventListener("mouseenter",()=>{ if(frames.length<2)return; timer=setInterval(()=>{i=(i+1)%frames.length; imgEl.src=frames[i];},420); });
  wrap.addEventListener("mouseleave",()=>{ clearInterval(timer); i=0; imgEl.src=frames[0]; });
}

function starsEl(id, readonly){
  const cur=ratingOf(id);
  const el=document.createElement("div");
  el.className="stars"+(readonly?" readonly":"");
  for(let n=1;n<=5;n++){
    const s=document.createElement("span"); s.className="s"+(n<=cur?" on":""); s.textContent="★"; s.dataset.n=n;
    if(!readonly) s.addEventListener("click",e=>{ e.stopPropagation(); setRating(id,n); });
    el.appendChild(s);
  }
  return el;
}
function setRating(id,n){
  if(state.ratings[id]===n) n=0; // click same star toggles off to 0? keep simple: set n
  state.ratings[id]=n; save();
  $$('.stars[data-for="'+id+'"]').forEach(refreshStars);
  toast("Rating updated — saved.");
}
function refreshStars(el){ const id=el.dataset.for, cur=ratingOf(id); $$(".s",el).forEach(s=>s.classList.toggle("on",+s.dataset.n<=cur)); }

/* ---------- pool card ---------- */
function mediaCard(m){
  const c=document.createElement("div");
  c.className="card"; c.dataset.id=m.id;
  const ev=evOf(m);
  const dur = m.type==="video" ? `<span class="badge dur">${m.dur}s</span>` : "";
  c.innerHTML=`
    <div class="thumbwrap">
      <img src="${posterOf(m)}" loading="lazy" alt="">
      <span class="badge">${m.type==="video"?"🎬":"🖼"} ${m.id}</span>
      ${dur}
      <span class="orient">${m.orient}</span>
    </div>
    <div class="meta">
      <div class="loc">${m.loc||"—"}</div>
      <div class="sub2">
        <span class="evtag" style="background:${ev.color}">${ev.label}</span>
      </div>
      <div class="sub2"></div>
    </div>`;
  const st=starsEl(m.id,false); st.dataset.for=m.id;
  $(".sub2:last-child",c).appendChild(st);
  const img=$("img",c); hoverCycle(img, framesOf(m));
  c.addEventListener("click",()=>openModal(m.id));
  return c;
}

/* ---------- pool render ---------- */
function inStory(id){ return state.order.includes(id); }
function renderPool(){
  const list=$("#poolList"); list.innerHTML="";
  const q=$("#poolSearch").value.trim().toLowerCase();
  const ty=$("#poolType").value, evf=$("#poolEvent").value, minR=+$("#poolRating").value, sort=$("#poolSort").value;
  let items=[...DATA.videos,...DATA.images].filter(m=>!inStory(m.id));
  if(ty) items=items.filter(m=>m.type===ty);
  if(evf) items=items.filter(m=>m.event===evf);
  if(minR) items=items.filter(m=>ratingOf(m.id)>=minR);
  if(q) items=items.filter(m=>((m.loc||"")+" "+(m.ctx||"")+" "+(m.beat||"")+" "+evOf(m).label).toLowerCase().includes(q));
  items.sort(sorter(sort));
  items.forEach(m=>list.appendChild(mediaCard(m)));
  $("#poolCount").textContent=items.length;
}
function sorter(k){
  if(k==="rating") return (a,b)=> ratingOf(b.id)-ratingOf(a.id) || a.id.localeCompare(b.id);
  if(k==="event")  return (a,b)=> (a.event||"").localeCompare(b.event||"") || a.id.localeCompare(b.id);
  if(k==="dur")    return (a,b)=> (b.dur||0)-(a.dur||0);
  return (a,b)=> a.id.localeCompare(b.id);
}

/* ---------- story timeline ---------- */
function isSection(x){ return typeof x==="string" && x[0]==="§"; }
function renderStory(){
  const list=$("#storyList"); list.innerHTML="";
  let num=0;
  state.order.forEach(entry=>{
    if(isSection(entry)){ list.appendChild(sectionRow(entry)); return; }
    const m=byId[entry]; if(!m) return;
    num++; list.appendChild(beatRow(m,num));
  });
  $("#storyEmpty").hidden = state.order.filter(x=>!isSection(x)).length>0;
  updateRuntime();
}
function sectionRow(sid){
  const row=document.createElement("div");
  row.className="section-break"; row.dataset.section=sid;
  const inp=document.createElement("input");
  inp.value = state.sections[sid] || sid.slice(1);
  inp.addEventListener("input",()=>{ state.sections[sid]=inp.value; save(); });
  const x=document.createElement("button"); x.className="x"; x.textContent="✕";
  x.title="Remove section break";
  x.addEventListener("click",()=>{ state.order=state.order.filter(e=>e!==sid); save(); renderStory(); });
  row.append("§",inp,x);
  return row;
}
function beatRow(m,num){
  const meta = state.meta[m.id] || (state.meta[m.id]={section:"",beat:m.beat||"",dur:defaultDur(m)});
  const row=document.createElement("div");
  row.className="beat"; row.dataset.id=m.id;
  row.innerHTML=`
    <div class="bthumb"><img src="${posterOf(m)}" loading="lazy" alt=""><span class="dur">${m.type==="video"?"🎬 ":""}${meta.dur}s</span></div>
    <div class="body">
      <div class="row1"><span class="num">${num}</span>
        <span class="evtag" style="background:${evOf(m).color}">${evOf(m).label}</span>
        <span class="hint" style="margin:0">${m.id} · ${m.loc||""}</span>
      </div>
      <textarea rows="2" placeholder="Emotional beat / caption…">${meta.beat||""}</textarea>
      <div class="ctrls">
        <label>⏱ <input class="durin" type="number" min="1" max="60" value="${meta.dur}"> s</label>
        <button class="info">ⓘ full notes</button>
        <button class="x" title="Remove from story">✕</button>
      </div>
    </div>`;
  const img=$("img",row); hoverCycle(img, framesOf(m));
  const ta=$("textarea",row);
  ta.addEventListener("input",()=>{ meta.beat=ta.value; save(); });
  const din=$(".durin",row);
  din.addEventListener("input",()=>{ meta.dur=Math.max(1,+din.value||1); $(".dur",row).textContent=(m.type==="video"?"🎬 ":"")+meta.dur+"s"; save(); updateRuntime(); });
  $(".info",row).addEventListener("click",()=>openModal(m.id));
  $(".bthumb",row).addEventListener("click",e=>{ if(e.target.tagName!=="IMG")return; });
  $(".x",row).addEventListener("click",()=>{ state.order=state.order.filter(e=>e!==m.id); save(); renderStory(); renderPool(); });
  return row;
}
function defaultDur(m){ return m.type==="video" ? Math.min(m.dur||5, m.dur>10?6:m.dur||5) : 3; }
function updateRuntime(){
  let total=0, beats=0;
  state.order.forEach(e=>{ if(isSection(e))return; const meta=state.meta[e]; if(meta){total+=meta.dur; beats++;} });
  $("#runTotal").textContent=fmt(total);
  $("#beatCount").textContent=beats;
  const target=DATA.targetSec||120;
  $("#runTarget").textContent=fmt(target);
  const pct=Math.min(140,total/target*100);
  const fill=$("#runFill"); fill.style.width=Math.min(100,pct)+"%";
  fill.style.background = total>target*1.15 ? "linear-gradient(90deg,#c0625a,#d8a94b)" : "linear-gradient(90deg,#7a9e8e,#d8a94b)";
  const h=$("#runHint");
  if(total<70) h.textContent="A touch short — you have room to add a few more beats.";
  else if(total<=145) h.textContent="Right in the sweet spot for a 2–2½ min film. ✨";
  else h.textContent="Getting long — consider trimming beat durations or dropping a few clips.";
}

/* ---------- sortable wiring ---------- */
function readTimelineOrder(){
  const nodes=$$("#storyList > *");
  state.order = nodes.map(n=> n.dataset.section ? n.dataset.section : n.dataset.id ).filter(Boolean);
}
function initSortables(){
  new Sortable($("#poolList"),{group:{name:"media",pull:"clone",put:false},sort:false,animation:150,
    onEnd:function(){/* pool order handled by filters */}});
  new Sortable($("#storyList"),{group:{name:"media",pull:true,put:true},animation:150,handle:null,
    onAdd:function(evt){
      const id=evt.item.dataset.id;
      // item dropped from pool is a clone of a card; replace with a beat
      if(id && !state.meta[id]) state.meta[id]={section:"",beat:byId[id].beat||"",dur:defaultDur(byId[id])};
      evt.item.remove();
      readTimelineOrder();
      // ensure id present at correct index
      save(); renderStory(); renderPool();
    },
    onUpdate:function(){ readTimelineOrder(); save(); renderStory(); },
    onRemove:function(){ readTimelineOrder(); save(); renderPool(); }
  });
}

/* ---------- modal ---------- */
function openModal(id){
  const m=byId[id]; if(!m)return;
  const ev=evOf(m);
  const frames = framesOf(m).map(f=>`<img src="${f}" alt="">`).join("");
  const b=$("#modalBody");
  b.innerHTML=`
    <img class="mhero" src="${posterOf(m)}" alt="">
    <div class="mbody">
      <h3>${m.loc||"—"}</h3>
      <div class="mrow"><span class="k">Rating</span><span class="starhost"></span></div>
      <div class="mrow"><span class="k">Type</span><span>${m.type==="video"?"🎬 Video · "+m.dur+"s · "+m.orient:"🖼 Photo · "+m.orient}</span></div>
      <div class="mrow"><span class="k">Event</span><span><span class="evtag" style="background:${ev.color}">${ev.label}</span></span></div>
      <div class="mrow"><span class="k">Who</span><span>${m.people||"—"}</span></div>
      <div class="mrow"><span class="k">What</span><span>${m.ctx||"—"}</span></div>
      ${m.beat?`<div class="mrow"><span class="k">Story idea</span><span><em>“${m.beat}”</em></span></div>`:""}
      ${m.note?`<div class="mrow"><span class="k">Note</span><span>${m.note}</span></div>`:""}
      <div class="mrow"><span class="k">File</span><span style="font-size:12px;color:var(--muted)">${m.file}</span></div>
      ${m.type==="video"?`<div class="mframes">${frames}</div>`:""}
    </div>`;
  const sh=$(".starhost",b); const st=starsEl(id,false); st.dataset.for=id; sh.appendChild(st);
  $("#modal").hidden=false;
}
function closeModal(){ $("#modal").hidden=true; }

/* ---------- analysis tab ---------- */
function renderAnalysis(){
  const grid=$("#anaGrid"); grid.innerHTML="";
  const q=$("#anaSearch").value.trim().toLowerCase();
  const ty=$("#anaType").value, evf=$("#anaEvent").value, minR=+$("#anaRating").value, sort=$("#anaSort").value;
  let items=(ty==="image"?DATA.images:DATA.videos).slice();
  if(evf) items=items.filter(m=>m.event===evf);
  if(minR) items=items.filter(m=>ratingOf(m.id)>=minR);
  if(q) items=items.filter(m=>((m.loc||"")+" "+(m.ctx||"")+" "+evOf(m).label).toLowerCase().includes(q));
  items.sort(sorter(sort));
  items.forEach(m=>{
    const ev=evOf(m);
    const c=document.createElement("div"); c.className="ana-card";
    c.innerHTML=`
      <div class="thumbwrap">
        <img src="${posterOf(m)}" loading="lazy" alt="">
        <span class="badge">${m.type==="video"?"🎬":"🖼"} ${m.id}</span>
        ${m.type==="video"?`<span class="badge dur">${m.dur}s</span>`:""}
        <span class="orient">${m.orient}</span>
      </div>
      <div class="meta">
        <div class="loc">${m.loc||"—"}</div>
        <div class="ctx">${m.ctx||""}</div>
        <div class="foot"><span class="evtag" style="background:${ev.color}">${ev.label}</span><span class="starhost"></span></div>
      </div>`;
    const st=starsEl(m.id,false); st.dataset.for=m.id; $(".starhost",c).appendChild(st);
    hoverCycle($("img",c), framesOf(m));
    $("img",c).style.cursor="pointer"; $("img",c).addEventListener("click",()=>openModal(m.id));
    grid.appendChild(c);
  });
}

/* ---------- filters populate ---------- */
function fillEventSelects(){
  const opts=Object.entries(EVENTS).map(([k,v])=>`<option value="${k}">${v.label}</option>`).join("");
  $("#poolEvent").insertAdjacentHTML("beforeend",opts);
  $("#anaEvent").insertAdjacentHTML("beforeend",opts);
}

/* ---------- import / export ---------- */
function exportStory(){
  const blob=new Blob([JSON.stringify({order:state.order,meta:state.meta,sections:state.sections,ratings:state.ratings,version:2,exportedAt:new Date().toISOString()},null,2)],{type:"application/json"});
  const a=document.createElement("a"); a.href=URL.createObjectURL(blob);
  a.download="jennie-gunnar-story.json"; a.click(); URL.revokeObjectURL(a.href);
  toast("Story exported — send this file back to collaborate.");
}
function importStory(file){
  const r=new FileReader();
  r.onload=()=>{ try{
    const s=JSON.parse(r.result);
    state.order=s.order||[]; state.meta=s.meta||{}; state.sections=s.sections||{}; state.ratings=s.ratings||{}; state.version=2;
    save(); renderAll(); toast("Story imported ✔");
  }catch(e){ toast("Could not read that file."); } };
  r.readAsText(file);
}

/* ---------- tabs ---------- */
function switchTab(name){
  $$(".tab").forEach(t=>t.classList.toggle("active",t.dataset.tab===name));
  $$(".tabpane").forEach(p=>p.classList.remove("active"));
  $("#tab-"+name).classList.add("active");
  if(name==="analysis") renderAnalysis();
}

/* ---------- about ---------- */
function renderAbout(){
  $("#aboutBody").innerHTML=`
    <h2>How to use this together 💛</h2>
    <p>This is a shared workspace for shaping Jennie &amp; Gunnar's wedding film. Everything you change saves automatically in your browser.</p>
    <h3>The two tabs</h3>
    <ol>
      <li><strong>Story Builder</strong> — the left panel is every clip &amp; photo (the <em>content pool</em>). Drag cards into the timeline on the right. Each row is one <em>beat</em>: write the emotion, set how many seconds it holds. Drag rows to reorder. The bar up top tracks total runtime against our ~2 minute target.</li>
      <li><strong>Content Analysis</strong> — my notes and star ratings on every video and photo. <strong>Click the stars to re-rate anything</strong> — you know these moments better than I do.</li>
    </ol>
    <h3>How we collaborate (important)</h3>
    <p>This is a simple static site, so it can't sync between us live. Instead:</p>
    <ol>
      <li>Play with the draft. Reorder, rewrite beats, re-rate, add or drop clips.</li>
      <li>Hit <code>⬇ Export story</code> — it downloads a tiny <code>.json</code> file.</li>
      <li>Send that file back. The other person hits <code>⬆ Import</code> to load your exact version.</li>
    </ol>
    <p>That way we can pass the cut back and forth until it feels right, then I turn the final beat sheet into the real edit.</p>
    <h3>A note on the draft</h3>
    <p>I've pre-filled a first-pass story (a relationship arc that climbs to the mountain summits — our metaphor for the wedding). It's a starting point to react to, not a finished cut. Tear it apart freely.</p>
    <p class="hint">Dates were rebuilt from each clip's GPS since the file timestamps were all export dates. If any location looks off, just fix the beat text — nothing here is locked.</p>`;
}

/* ---------- boot ---------- */
function renderAll(){ renderPool(); renderStory(); if($("#tab-analysis").classList.contains("active")) renderAnalysis(); }
function bind(){
  $$(".tab").forEach(t=>t.addEventListener("click",()=>switchTab(t.dataset.tab)));
  ["#poolSearch","#poolType","#poolEvent","#poolRating","#poolSort"].forEach(s=>$(s).addEventListener("input",renderPool));
  ["#anaSearch","#anaType","#anaEvent","#anaRating","#anaSort"].forEach(s=>$(s).addEventListener("input",renderAnalysis));
  $("#btnExport").addEventListener("click",exportStory);
  $("#importFile").addEventListener("change",e=>{ if(e.target.files[0]) importStory(e.target.files[0]); e.target.value=""; });
  $("#btnReset").addEventListener("click",()=>{ if(confirm("Reset the story and all ratings back to the original draft?")){ localStorage.removeItem(LS_KEY); state=defaultState(); save(); renderAll(); toast("Reset to the original draft."); }});
  $("#btnAddSection").addEventListener("click",()=>{ const sid="§"+("Section "+(Object.keys(state.sections).length+1))+"|"+Date.now(); state.sections[sid]="New section"; state.order.push(sid); save(); renderStory(); });
  $$("[data-close]").forEach(el=>el.addEventListener("click",closeModal));
  document.addEventListener("keydown",e=>{ if(e.key==="Escape") closeModal(); });
}
fillEventSelects(); bind(); renderAbout(); initSortables(); renderAll();
})();
