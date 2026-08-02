/* Jennie & Gunnar — wedding film story builder (v3: chapters, dark mode, timeline) */
(function(){
"use strict";
const DATA = window.DATA;
const LS_KEY = "jennie_story_v3";
const EVENTS = DATA.events;
const MON=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const byId = {};
DATA.videos.forEach(v=>{v.type="video";byId[v.id]=v;});
DATA.images.forEach(m=>{m.type="image";byId[m.id]=m;});
let anaType = "video";

/* ---------- state ---------- */
let state = load();
function defaultState(){
  const meta={}, chapters=[];
  DATA.story.forEach((ch,i)=>{
    const items=[];
    ch.items.forEach(b=>{ items.push(b.item); meta[b.item]={beat:b.beat||"",dur:b.dur|0}; });
    chapters.push({id:"ch"+i, title:ch.title, collapsed:false, items:items});
  });
  return {chapters:chapters, meta:meta, ratings:{}, seq:chapters.length, theme:"light", version:3};
}
function load(){ try{const s=JSON.parse(localStorage.getItem(LS_KEY)); if(s&&s.version===3) return s;}catch(e){} return defaultState(); }
function save(){ localStorage.setItem(LS_KEY, JSON.stringify(state)); }
function ratingOf(id){ return state.ratings[id]!=null ? state.ratings[id] : (byId[id]?byId[id].rating:0); }

/* ---------- helpers ---------- */
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
function fmt(t){t=Math.max(0,Math.round(t));return Math.floor(t/60)+":"+String(t%60).padStart(2,"0");}
function posterOf(m){ return m.type==="video" ? `media/vid/${m.id}/poster.jpg` : `media/img/${m.id}.jpg`; }
function framesOf(m){ return m.type==="video" ? [1,2,3,4,5].map(n=>`media/vid/${m.id}/f${n}.jpg`) : [posterOf(m)]; }
function evOf(m){ return EVENTS[m.event] || {label:m.event||"—",color:"#999"}; }
function monYear(d){ if(!d||d.length<7) return ""; return MON[+d.slice(5,7)-1]+" "+d.slice(0,4); }
function dateLabel(m){ if(!m.date) return ""; return (m.dateApprox?"~":"")+monYear(m.date); }
function defaultDur(m){ return m.type==="video" ? (m.dur>8?6:(m.dur||5)) : 3; }
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
function setRating(id,n){ state.ratings[id]=n; save(); $$('.stars[data-for="'+id+'"]').forEach(el=>{const c=ratingOf(id);$$(".s",el).forEach(s=>s.classList.toggle("on",+s.dataset.n<=c));}); renderPoolRatings(id); toast("Rating updated — saved."); }
function renderPoolRatings(id){ $$('#poolList .pcard[data-id="'+id+'"] .prate').forEach(e=>e.textContent="★".repeat(ratingOf(id))); }

/* ---------- pool ---------- */
function allStoryIds(){ const a=[]; state.chapters.forEach(c=>a.push(...c.items)); return a; }
function inStory(id){ return allStoryIds().indexOf(id)>=0; }
function poolCard(m){
  const ev=evOf(m), c=document.createElement("div"); c.className="pcard"; c.dataset.id=m.id;
  c.innerHTML=`<div class="pev" style="background:${ev.color}"></div>
   <div class="pthumb"><img src="${posterOf(m)}" loading="lazy" alt="">
     <span class="ptype">${m.type==="video"?"🎬":"🖼"}</span>
     ${m.type==="video"?`<span class="pdur">${m.dur}s</span>`:""}
     <span class="prate">${"★".repeat(ratingOf(m.id))}</span></div>`;
  hoverCycle($("img",c),framesOf(m));
  c.addEventListener("click",()=>openModal(m.id));
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
  state.chapters.forEach(ch=>{
    const el=document.createElement("div"); el.className="chapter"+(ch.collapsed?" collapsed":""); el.dataset.ch=ch.id;
    const head=document.createElement("div"); head.className="ch-head";
    head.innerHTML=`<button class="ch-toggle">${ch.collapsed?"▸":"▾"}</button>
      <input class="ch-title" value="${(ch.title||"").replace(/"/g,'&quot;')}">
      <span class="ch-meta"><span class="ch-time">⏱ ${fmt(chapterTime(ch))}</span><span>${ch.items.length} clip${ch.items.length===1?"":"s"}</span></span>
      <button class="ch-x" title="Delete chapter (clips return to the pool)">✕</button>`;
    $(".ch-toggle",head).addEventListener("click",()=>{ ch.collapsed=!ch.collapsed; save(); renderStory(); });
    const ti=$(".ch-title",head); ti.addEventListener("input",()=>{ch.title=ti.value;save();});
    $(".ch-x",head).addEventListener("click",()=>{ if(ch.items.length===0||confirm('Delete "'+ch.title+'"? Its clips go back to the pool.')){ state.chapters=state.chapters.filter(c=>c.id!==ch.id); save(); renderStory(); renderPool(); }});
    el.appendChild(head);

    // strip (collapsed view)
    const strip=document.createElement("div"); strip.className="ch-strip";
    ch.items.slice(0,14).forEach(id=>{ const m=byId[id]; if(!m)return; const im=document.createElement("img"); im.src=posterOf(m); im.loading="lazy"; strip.appendChild(im); });
    if(ch.items.length>14){ const s=document.createElement("span"); s.className="more"; s.textContent="+"+(ch.items.length-14); strip.appendChild(s); }
    el.appendChild(strip);

    // body (expanded view)
    const body=document.createElement("div"); body.className="ch-body"+(ch.items.length?"":" empty");
    ch.items.forEach(id=>{ const m=byId[id]; if(!m)return; globalNum++; body.appendChild(beatCard(m,globalNum)); });
    el.appendChild(body);
    list.appendChild(el);
  });
  $("#storyEmpty").hidden=true;
  updateRuntime();
  initStorySortables();
}
function beatCard(m,num){
  const meta=state.meta[m.id]||(state.meta[m.id]={beat:m.beat||"",dur:defaultDur(m)});
  const el=document.createElement("div"); el.className="beat"; el.dataset.id=m.id;
  el.innerHTML=`<div class="bthumb"><img src="${posterOf(m)}" loading="lazy" alt="">
      <span class="bnum">${num}</span><span class="btype">${m.type==="video"?"🎬":"🖼"}</span>
      <span class="bdur">${meta.dur}s</span></div>
    <div class="bbody">
      <textarea placeholder="beat / caption…">${(meta.beat||"").replace(/</g,"&lt;")}</textarea>
      <div class="bctrl">⏱<input class="bdurin" type="number" min="1" max="60" value="${meta.dur}">s
        <button class="bi" title="Full notes">ⓘ</button><button class="bx" title="Remove">✕</button></div>
    </div>`;
  hoverCycle($("img",el),framesOf(m));
  const ta=$("textarea",el); ta.addEventListener("input",()=>{meta.beat=ta.value;save();});
  const di=$(".bdurin",el); di.addEventListener("input",()=>{meta.dur=Math.max(1,+di.value||1);$(".bdur",el).textContent=meta.dur+"s";save();updateRuntime();updateChapterTimes();});
  $(".bi",el).addEventListener("click",()=>openModal(m.id));
  $(".bx",el).addEventListener("click",()=>{ const ch=state.chapters.find(c=>c.items.indexOf(m.id)>=0); if(ch){ch.items=ch.items.filter(x=>x!==m.id);save();renderStory();renderPool();} });
  return el;
}
function updateChapterTimes(){ $$("#storyList .chapter").forEach(el=>{ const ch=chById(el.dataset.ch); if(ch){ $(".ch-time",el).textContent="⏱ "+fmt(chapterTime(ch)); }}); }
function updateRuntime(){
  let total=0,beats=0; state.chapters.forEach(c=>c.items.forEach(id=>{const mt=state.meta[id];if(mt){total+=mt.dur;beats++;}}));
  $("#runTotal").textContent=fmt(total); $("#beatCount").textContent=beats;
  const target=DATA.targetSec||135; $("#runTarget").textContent=fmt(target);
  const fill=$("#runFill"); fill.style.width=Math.min(100,total/target*100)+"%";
  fill.style.background= total>target*1.15 ? "linear-gradient(90deg,var(--danger),var(--gold))" : "linear-gradient(90deg,var(--accent2),var(--gold))";
  const h=$("#runHint");
  h.textContent = total<80 ? "A touch short — room for a few more beats." : (total<=150 ? "Right in the sweet spot for a 2–2½ min film. ✨" : "Getting long — trim a few beat durations or clips.");
}

/* ---------- drag/drop across chapters + pool ---------- */
let chapterSortables=[], poolSortable=null, refreshT=null;
function scheduleRefresh(){ if(refreshT)return; refreshT=setTimeout(()=>{refreshT=null; syncFromDOM(); save(); renderStory(); renderPool();},0); }
function syncFromDOM(){
  $$("#storyList .chapter").forEach(el=>{ const ch=chById(el.dataset.ch); if(!ch)return; const body=$(".ch-body",el); if(!body)return;
    ch.items=$$(":scope > .beat, :scope > .pcard",body).map(n=>n.dataset.id); });
  allStoryIds().forEach(id=>{ if(!state.meta[id]) state.meta[id]={beat:(byId[id]&&byId[id].beat)||"",dur:defaultDur(byId[id])}; });
}
function initStorySortables(){
  chapterSortables.forEach(s=>{try{s.destroy();}catch(e){}}); chapterSortables=[];
  $$("#storyList .chapter:not(.collapsed) .ch-body").forEach(body=>{
    chapterSortables.push(new Sortable(body,{group:{name:"media",pull:true,put:true},draggable:".beat",animation:150,
      onAdd:scheduleRefresh,onUpdate:scheduleRefresh,onRemove:scheduleRefresh}));
  });
}
function initPoolSortable(){ poolSortable=new Sortable($("#poolList"),{group:{name:"media",pull:true,put:false},sort:false,draggable:".pcard",animation:150,onEnd:scheduleRefresh}); }

/* ---------- modal ---------- */
function openModal(id){
  const m=byId[id]; if(!m)return; const ev=evOf(m);
  const frames=framesOf(m).map(f=>`<img src="${f}" alt="">`).join("");
  const dl=dateLabel(m);
  const b=$("#modalBody");
  b.innerHTML=`<img class="mhero" src="${posterOf(m)}" alt="">
    <div class="mbody"><h3>${m.loc||"—"}</h3>
      <div class="mrow"><span class="k">Rating</span><span class="starhost"></span></div>
      <div class="mrow"><span class="k">Type</span><span>${m.type==="video"?"🎬 Video · "+m.dur+"s · "+m.orient:"🖼 Photo · "+m.orient}</span></div>
      <div class="mrow"><span class="k">When</span><span>${dl?dl+(m.dateApprox?"  (approx — from the trip)":"  (from photo EXIF)"):"—"}</span></div>
      <div class="mrow"><span class="k">Trip / event</span><span><span class="a-badge" style="background:${ev.color};color:#fff;padding:1px 7px;border-radius:6px">${ev.label}</span></span></div>
      <div class="mrow"><span class="k">Who</span><span>${m.people||"—"}</span></div>
      <div class="mrow"><span class="k">What</span><span>${m.ctx||"—"}</span></div>
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
  const dl=dateLabel(m);
  const l2=[]; if(dl) l2.push("📅 "+dl); if(m.people&&m.people!=="—") l2.push("👥 "+m.people);
  c.innerHTML=`<div class="aev" style="background:${ev.color}"></div>
    <div class="athumb"><img src="${posterOf(m)}" loading="lazy" alt="">
      <span class="a-tl">${m.type==="video"?"🎬":"🖼"} ${m.id}</span>
      <span class="a-tr">${m.type==="video"?`<span class="a-badge">⏱ ${m.dur}s</span>`:""}<span class="a-badge">${m.orient}</span></span>
      <div class="a-bot">
        <div class="ln">📍 ${m.loc||"—"}</div>
        ${l2.length?`<div class="ln">${l2.join("  ·  ")}</div>`:""}
        ${m.ctx?`<div class="ln ctx">${m.ctx}</div>`:""}
      </div>
      <div class="a-stars"></div></div>`;
  const st=starsEl(m.id,false); st.classList.add("sm"); $(".a-stars",c).appendChild(st);
  hoverCycle($("img",c),framesOf(m));
  $(".athumb",c).addEventListener("click",e=>{ if(e.target.closest(".a-stars"))return; openModal(m.id); });
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
}

/* ---------- theme ---------- */
function applyTheme(t){ document.documentElement.setAttribute("data-theme",t); $("#btnTheme").textContent=(t==="dark"?"☀️":"🌙"); }
function toggleTheme(){ state.theme=(state.theme==="dark"?"light":"dark"); applyTheme(state.theme); save(); }

/* ---------- import / export ---------- */
function exportStory(){
  const blob=new Blob([JSON.stringify({chapters:state.chapters,meta:state.meta,ratings:state.ratings,theme:state.theme,version:3,exportedAt:new Date().toISOString()},null,2)],{type:"application/json"});
  const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download="jennie-gunnar-story.json"; a.click(); URL.revokeObjectURL(a.href);
  toast("Story exported — send this file back to collaborate.");
}
function importStory(file){
  const r=new FileReader();
  r.onload=()=>{ try{ const s=JSON.parse(r.result);
    state.chapters=s.chapters||[]; state.meta=s.meta||{}; state.ratings=s.ratings||{}; if(s.theme)state.theme=s.theme; state.seq=(s.chapters||[]).length; state.version=3;
    save(); applyTheme(state.theme||"light"); renderAll(); toast("Story imported ✔");
  }catch(e){ toast("Could not read that file."); } };
  r.readAsText(file);
}

/* ---------- about ---------- */
function renderAbout(){
  $("#aboutBody").innerHTML=`<h2>How to use this together 💛</h2>
    <p>A shared workspace for shaping Jennie &amp; Gunnar's wedding film. Everything you change autosaves in your browser.</p>
    <h3>Story Builder</h3>
    <ol><li>The left panel is every clip &amp; photo — the <em>content pool</em> (small thumbnails; hover a video to preview, click any for full notes).</li>
    <li>Drag items into the <em>chapters</em> on the right. Each chapter lays its beats out left-to-right and scrolls horizontally; the header shows the chapter's running time. Collapse a chapter (▾) to just its thumbnails.</li>
    <li>Each beat has an editable caption and a duration. The top bar tracks total runtime vs our ~2¼ min target.</li></ol>
    <h3>Content Analysis</h3>
    <p>Switch between the <strong>Videos</strong> and <strong>Photos</strong> tabs. Every item shows its location and date on the thumbnail. <strong>Click the stars to re-rate</strong> — you know these moments better than I do. Sort by rating, date, location or trip.</p>
    <h3>Collaborating</h3>
    <p>This is a static site, so it can't sync live. Edit freely, hit <code>⬇ Export story</code> (a small JSON), send it back, and the other person hits <code>⬆ Import</code>. Pass the cut back and forth until it feels right.</p>
    <h3>About the dates</h3>
    <p>Photo dates are real (from EXIF). Video files had only export dates, so each video shows an <em>approximate</em> date (~) inherited from the trip it belongs to. The real timeline runs Dec 2023 (Poland) → 2024 home life → Vietnam Apr 2025 → the big Asia trip Nov–Dec 2025.</p>`;
}

/* ---------- boot ---------- */
function renderAll(){ renderPool(); renderStory(); if($("#tab-analysis").classList.contains("active")) renderAnalysis(); }
function bind(){
  $$(".tab").forEach(t=>t.addEventListener("click",()=>switchTab(t.dataset.tab)));
  ["#poolSearch","#poolType","#poolEvent","#poolRating","#poolSort"].forEach(s=>$(s).addEventListener("input",renderPool));
  ["#anaSearch","#anaEvent","#anaRating","#anaSort"].forEach(s=>$(s).addEventListener("input",renderAnalysis));
  $$(".subtab").forEach(t=>t.addEventListener("click",()=>{ anaType=t.dataset.atype; $$(".subtab").forEach(x=>x.classList.toggle("active",x===t)); renderAnalysis(); }));
  $("#btnExport").addEventListener("click",exportStory);
  $("#importFile").addEventListener("change",e=>{ if(e.target.files[0])importStory(e.target.files[0]); e.target.value=""; });
  $("#btnReset").addEventListener("click",()=>{ if(confirm("Reset the story and all ratings back to the original draft?")){ localStorage.removeItem(LS_KEY); const th=state.theme; state=defaultState(); state.theme=th; save(); renderAll(); toast("Reset to the original draft."); }});
  $("#btnTheme").addEventListener("click",toggleTheme);
  $("#btnAddChapter").addEventListener("click",()=>{ state.chapters.push({id:"ch"+(state.seq++),title:"New chapter",collapsed:false,items:[]}); save(); renderStory(); $("#storyList").scrollTop=$("#storyList").scrollHeight; });
  $("#btnCollapseAll").addEventListener("click",()=>{ const anyOpen=state.chapters.some(c=>!c.collapsed); state.chapters.forEach(c=>c.collapsed=anyOpen); save(); renderStory(); $("#btnCollapseAll").textContent=anyOpen?"⊞ Expand all":"⊟ Collapse all"; });
  $$("[data-close]").forEach(el=>el.addEventListener("click",closeModal));
  document.addEventListener("keydown",e=>{ if(e.key==="Escape")closeModal(); });
}
applyTheme(state.theme||"light"); fillEventSelects(); bind(); renderAbout(); initPoolSortable(); renderAll();
})();
