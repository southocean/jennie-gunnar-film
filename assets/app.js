/* Jennie & Gunnar - wedding film story builder (v3: chapters, dark mode, timeline) */
(function(){
"use strict";
const DATA = window.DATA;
const LS_KEY = "jennie_story_v8";
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
  const active = saved.song ? "song" : (saved.storytelling ? "storytelling" : (saved.jennie ? "jennie" : Object.keys(saved)[0]));
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
    if(s&&s.version===8&&s.saved){ if(!s.saved[s.active]) s.active=Object.keys(s.saved)[0]; st=s; }
  }catch(e){}
  if(!st){ // migrate older saves: keep First-draft edits + ratings/theme, refresh Jennie's story to the new template
    ["jennie_story_v7","jennie_story_v6","jennie_story_v5","jennie_story_v4"].some(function(k){ try{ const so=JSON.parse(localStorage.getItem(k)); if(so&&so.saved){ st=defaultState(); if(so.saved.draft1) st.saved.draft1=so.saved.draft1; if(so.ratings)st.ratings=so.ratings; if(so.theme)st.theme=so.theme; st.active="storytelling"; return true; } }catch(e){} return false; });
  }
  if(!st){ try{ const old=JSON.parse(localStorage.getItem("jennie_story_v3"));
    if(old&&old.version===3&&old.chapters){ st=defaultState(); st.saved.draft1={chapters:old.chapters,meta:old.meta||{}}; st.active="draft1"; if(old.ratings)st.ratings=old.ratings; if(old.theme)st.theme=old.theme; }
  }catch(e){} }
  if(!st) st=defaultState();
  sanitizeState(st);
  if(DATA.stories.song && !st.saved.song){ st.saved.song=buildVersion(DATA.stories.song.chapters); st.active="song"; } // one-time: add + switch to the music-first version
  if(!st.saved[st.active]) st.active=Object.keys(st.saved)[0];
  st.chapters=st.saved[st.active].chapters; st.meta=st.saved[st.active].meta;
  try{ localStorage.setItem(LS_KEY, JSON.stringify({saved:st.saved,active:st.active,ratings:st.ratings,theme:st.theme,seq:st.seq,version:8})); }catch(e){}
  return st;
}
function save(){ localStorage.setItem(LS_KEY, JSON.stringify({saved:state.saved,active:state.active,ratings:state.ratings,theme:state.theme,seq:state.seq,version:8})); }
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
function storySectionFor(ch){ const part=(ch.title||"").split("  ·  ")[0].trim(); return (DATA.storyboard||[]).find(function(s){return s.part===part;}); }
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
      const _sec=storySectionFor(ch), _stks=_sec?(_sec.assets||[]).filter(a=>a.kind==='stack'):[];
      if(_stks.length){ const sr=document.createElement("div"); sr.className="ep-stacks ch-stacks";
        sr.innerHTML=stackTilesHTML(_stks); bindStackClicks(sr); list.appendChild(sr); }
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
      <div class="bctrl">⏱<input class="bdurin" type="number" min="1" max="60" value="${meta.dur}">s
        <button class="bi" title="Full notes">ⓘ</button><button class="bx" title="Remove">✕</button></div>
    </div>`;
  hoverCycle($("img",el),framesOf(m));
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
  h.textContent = total<target*0.6 ? "Shorter than the song - room for more." : (total<=target*1.12 ? "About the song's length. ✨" : "Longer than the song - trim durations or clips.");
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
function openStack(sec, st){
  if(!st) return; const b=$("#modalBody");
  b.innerHTML=`<div class="mbody stackpop">
    <h3>🗂 ${esc(st.label)}</h3>
    <div class="mrow"><span class="k">Section</span><span>${esc(sec.part)} · <b>${esc(sec.tc)}</b></span></div>
    <div class="mrow"><span class="k">Stack</span><span><b>${st.count} photos</b> from <code>Jennies facebook/${esc(st.folder)}</code></span></div>
    ${st.note?`<div class="mrow"><span class="k">Note</span><span>${esc(st.note)}</span></div>`:""}
    <div class="mrow"><span class="k">How to use</span><span>Flash this bulk on the beat during this section, then keep the best on the timeline.</span></div>
    <p class="hint" style="margin-top:12px">The ${st.count} photos live in <code>Downloads/Jennies facebook/${esc(st.folder)}</code>. Once that media is synced into the pool, this popup lists them as thumbnails and you can drag more photos into the stack (iOS-group style).</p>
  </div>`;
  $("#modal").hidden=false;
}
/* --- photo stacks: real thumbnails (from local media/fb via window.FB_STACKS), chunked into ~2s micro-stacks --- */
function fbFiles(folder){ return (window.FB_STACKS && window.FB_STACKS[folder] && window.FB_STACKS[folder].files.length) ? window.FB_STACKS[folder] : null; }
function chunkArr(a,n){ const o=[]; for(let i=0;i<a.length;i+=n) o.push(a.slice(i,i+n)); return o; }
function stackTilesHTML(assets){
  return (assets||[]).map(function(a){
    const fb=fbFiles(a.folder);
    if(fb){
      const groups=chunkArr(fb.files,5);
      return groups.map(function(g,gi){
        const pile=g.slice(0,3).map(f=>'<img src="media/fb/'+fb.slug+'/'+f+'" loading="lazy" alt="">').join("");
        return '<button class="ep-stack has-thumbs" data-slug="'+fb.slug+'" data-files="'+g.join(',')+'" data-label="'+esc(a.label)+'" title="'+esc(a.note||'')+'">'
          +'<span class="ep-stack-pile">'+pile+'</span>'
          +'<span class="ep-stack-meta"><b>'+esc(a.label)+'</b><span class="ep-stack-cnt">'+g.length+' · ~2s ▸</span><span class="ep-stack-folder">'+esc(a.folder)+' ('+(gi+1)+'/'+groups.length+')</span></span></button>';
      }).join("");
    }
    return '<button class="ep-stack" data-fallback="1" data-folder="'+esc(a.folder)+'" data-count="'+a.count+'" data-label="'+esc(a.label)+'" data-note="'+esc(a.note||'')+'" title="'+esc(a.note||'')+'">'
      +'<span class="ep-stack-pile"><i></i><i></i><i></i></span>'
      +'<span class="ep-stack-meta"><b>'+esc(a.label)+'</b><span class="ep-stack-cnt">'+a.count+' photos ▸</span><span class="ep-stack-folder">'+esc(a.folder)+'</span></span></button>';
  }).join("");
}
function bindStackClicks(root){
  $$(".ep-stack",root).forEach(function(b){
    b.addEventListener("click",function(){
      if(b.dataset.slug) openStackGrid(b.dataset.label, b.dataset.slug, b.dataset.files.split(","));
      else openStackText(b.dataset.label, b.dataset.folder, b.dataset.count, b.dataset.note);
    });
  });
}
function openStackGrid(label, slug, files){
  const grid=files.map(f=>'<img src="media/fb/'+slug+'/'+f+'" loading="lazy" alt="">').join("");
  $("#modalBody").innerHTML='<div class="mbody stackpop"><h3>🗂 '+esc(label)+'</h3>'
    +'<p class="hint">'+files.length+' photos in this ~2s stack - flash them on the beat, keep the best.</p>'
    +'<div class="stackgrid">'+grid+'</div></div>';
  $("#modal").hidden=false;
}
function openStackText(label, folder, count, note){
  $("#modalBody").innerHTML='<div class="mbody stackpop"><h3>🗂 '+esc(label)+'</h3>'
    +'<div class="mrow"><span class="k">Stack</span><span><b>'+count+' photos</b> from <code>Jennies facebook/'+esc(folder)+'</code></span></div>'
    +(note?'<div class="mrow"><span class="k">Note</span><span>'+esc(note)+'</span></div>':'')
    +'<p class="hint" style="margin-top:10px">Thumbnails show once the media is synced locally (media/fb/).</p></div>';
  $("#modal").hidden=false;
}

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
const TABS=["story","analysis","music","edit","about","cuts"];
function switchTab(name){
  if(TABS.indexOf(name)<0) return;
  $$(".tab").forEach(t=>t.classList.toggle("active",t.dataset.tab===name));
  $$(".tabpane").forEach(p=>p.classList.remove("active"));
  $("#tab-"+name).classList.add("active");
  if(name==="analysis") renderAnalysis();
  if(name==="music") renderMusic();
  if(name==="edit") renderEditPlan();
  if(name==="cuts") renderCuts();
  try{ localStorage.setItem("jg_tab",name); }catch(e){}
}
function restoreTab(){
  let t; try{ t=localStorage.getItem("jg_tab"); }catch(e){}
  if(t && t!=="story" && TABS.indexOf(t)>=0) switchTab(t);
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

/* ---------- the song (music-first) ---------- */
function esc(s){ return (s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
let songVer=-1; /* index into DATA.songs; -1 = show the first (recommended) */
let songRev=-1; /* index into the current song's revs; -1 = latest */
function renderMusic(){
  const box=$("#musicBody"); if(!box) return;
  const list=DATA.songs||(DATA.song?[DATA.song]:[]);
  if(songVer<0||songVer>=list.length) songVer=0;
  const s=list[songVer]||DATA.song||{};
  const revs=(s.revs&&s.revs.length)?s.revs:[{rev:1,date:"",note:"",lyrics:s.lyrics||""}];
  const latest=revs.length-1;
  const ri=(songRev<0||songRev>=revs.length)?latest:songRev;
  const cur=revs[ri];
  const rows=(s.map||[]).map(m=>`<tr><td class="sl-tc">${esc(m.sec)}</td><td><b>${esc(m.part)}</b><div class="sl-loc">${esc(m.act)}</div></td><td class="sl-cap">${esc(m.show)}</td></tr>`).join("");
  const vers=list.length>1?`<div class="song-vers">${list.map((v,i)=>`<button class="btn songver${i===songVer?" on":""}" data-i="${i}">${esc(v.name||("Song "+(i+1)))}</button>`).join("")}</div>`:"";
  const revBar=revs.length>1?`<div class="song-revs"><span class="vlabel">Revisions</span>${revs.map((r,i)=>`<button class="btn small songrev${i===ri?" on":""}" data-r="${i}">rev ${r.rev}${i===latest?" (current)":""}</button>`).join("")}</div>`:"";
  const revNote=(cur.note||cur.date)?`<p class="hint song-revnote">${ri===latest?"Current":"<strong>Older revision</strong>"} - rev ${cur.rev}${cur.date?" ("+esc(cur.date)+")":""}: ${esc(cur.note||"")}${ri!==latest?` <a href="#" id="backToLatest">(back to current rev ${revs[latest].rev})</a>`:""}</p>`:"";
  box.innerHTML=`
    <h2>The song 🎵</h2>
    <p>We're going <strong>music first</strong>: the song is written, then the film is cut to it, and every transition lands on the beat. Get a take we love in <strong>Suno</strong> (v5.5), then I time the edit to it.</p>
    <p>A love story about <em>a girl and a guy</em> - never named - from her side. Run through <a href="LYRIC-CRAFT.md" target="_blank">the lyric-craft harness</a>: rhyming, economical, images over statements, hook last, her wandering shown as a <em>flex</em> (never loneliness), POV-correct pet names (he calls her <em>Boo-boo</em> in the proposal; she calls him <em>Dudu Bear</em> at the end). Two finalists now: <strong>Gravity</strong> (catchy pop) and <strong>The Long Way Home</strong> (country-folk storytelling). We are fine-tuning, so each keeps a <strong>revision history</strong> you can view and revert.</p>

    ${vers}
    ${s.note?`<p class="hint song-note">${esc(s.note)}</p>`:""}

    <h3>1. Suno style prompt</h3>
    <p class="hint">Paste into Suno's <strong>Style of Music</strong> box. Title: <strong>${esc(s.title||"")}</strong> ${s.altTitles&&s.altTitles.length?`(alts: ${s.altTitles.map(esc).join(", ")})`:""}.</p>
    <div class="make-actions"><button class="btn" id="btnCopySuno">⧉ Copy style prompt</button></div>
    <pre class="songbox" id="sunoBox">${esc(s.suno||"")}</pre>

    <h3>2. Lyrics</h3>
    <p class="hint">Paste into Suno's <strong>Lyrics</strong> box. Keep the bracket tags - they steer the dynamics.</p>
    ${revBar}
    ${revNote}
    <div class="make-actions"><button class="btn" id="btnCopyLyrics">⧉ Copy lyrics (rev ${cur.rev})</button>${cur.url?`<a class="btn" href="${esc(cur.url)}" target="_blank" rel="noopener">🎧 Listen to this rev (Suno)</a>`:""}</div>
    <pre class="songbox" id="lyricsBox">${esc(cur.lyrics||"")}</pre>

    <h3>3. How the song maps to the film</h3>
    <p class="hint">Rough map. Once you have a Suno take you like, send me its real section timings and I'll cut each act to fit.</p>
    <div class="sl-wrap"><table class="shotlist"><thead><tr><th>Section</th><th>Beat</th><th>What we show</th></tr></thead><tbody>${rows}</tbody></table></div>

    <h3>How to drive Suno (learned the hard way)</h3>
    <ul>
      <li><strong>Dynamics go INLINE in the lyrics, not the style box.</strong> The bracket tags per section (<code>[Bridge - almost silent, solo piano, no drums]</code>, <code>[Diminuendo]</code>, <code>[Crescendo]</code>, <code>[Chorus - key change up]</code>) are what Suno acts on. The style box only sets the overall vibe.</li>
      <li><strong>Length:</strong> Suno grows with the lyrics; each verse adds 30-60s. We keep it lean and add <code>[End]</code>. If a take runs long, crop the outro in Suno's editor.</li>
      <li><strong>Model:</strong> v5.5 for this - cleaner acoustic mixes and vocals.</li>
      <li>Generate 4-6 takes; keep the one whose bridge strips back most and whose final chorus lifts hardest on the key change.</li>
    </ul>`;
  const copy=(txt,ok)=>{ if(navigator.clipboard) navigator.clipboard.writeText(txt).then(()=>toast(ok),()=>toast("Copy failed - select and copy manually.")); else toast("Select and copy manually."); };
  $("#btnCopySuno").addEventListener("click",()=>copy(s.suno||"","Style prompt copied."));
  $("#btnCopyLyrics").addEventListener("click",()=>copy(cur.lyrics||"","Lyrics copied (rev "+cur.rev+")."));
  $$(".songver").forEach(b=>b.addEventListener("click",()=>{ songVer=+b.dataset.i; songRev=-1; renderMusic(); }));
  $$(".songrev").forEach(b=>b.addEventListener("click",()=>{ songRev=+b.dataset.r; renderMusic(); }));
  const bl=$("#backToLatest"); if(bl) bl.addEventListener("click",e=>{ e.preventDefault(); songRev=-1; renderMusic(); });
}

/* ---------- edit plan (CapCut footprint) ---------- */
function editPlanText(){
  const sb=DATA.storyboard||[]; let s="JENNIE & GUNNAR - EDIT PLAN (footprint for CapCut)\n";
  s+="Song: Gravity v3 (3:19, 99.4 BPM). Portrait 9:16. Lyrics burned on screen, synced per section. No story captions. Every clip/photo used ONCE.\n";
  sb.forEach(sec=>{ s+="\n["+sec.tc+"]  "+sec.part+"\n  lyric: "+sec.lyric.replace(/ \/ /g," / ")+"\n  show: "+sec.intent+"\n";
    sec.assets.forEach(a=>{
      if(a.kind==="stack") s+="   - [STACK] "+a.label+"  ->  "+(a.count||"?")+" photos from folder \""+a.folder+"\""+(a.note?"  ("+a.note+")":"")+"\n";
      else s+="   - "+(a.kind==="todo"?"[TODO] ":(a.kind==="photo"?"[photo] ":"[video] "))+a.label+"  ->  "+(a.file||"")+"\n";
    });
    if(sec.pending) s+="   PENDING: "+sec.pending+"\n";
  });
  return s;
}
function renderEditPlan(){
  const box=$("#editBody"); if(!box) return;
  const sb=DATA.storyboard||[];
  const cards=sb.map((sec,si)=>{
    const stacks=sec.assets.filter(a=>a.kind==='stack');
    const rest=sec.assets.filter(a=>a.kind!=='stack');
    const stackHTML = stacks.length ? `<div class="ep-stacks">`+stackTilesHTML(stacks)+`</div>` : "";
    const rows=rest.map(a=>`<tr class="${a.kind==='todo'?'ep-todo':''}"><td class="ep-lab">${a.kind==='todo'?'⚙ ':(a.kind==='photo'?'🖼 ':'🎬 ')}${esc(a.label)}</td><td class="ep-file">${esc(a.file||'')}</td></tr>`).join("");
    return `<div class="ep-sec">
      <div class="ep-head"><span class="ep-tc">${esc(sec.tc)}</span><strong>${esc(sec.part)}</strong></div>
      <p class="ep-lyric">${esc(sec.lyric)}</p>
      <p class="hint ep-intent">${esc(sec.intent)}</p>
      ${stackHTML}
      ${rows?`<table class="ep-tab"><tbody>${rows}</tbody></table>`:""}
      ${sec.pending?`<p class="hint ep-pending">Still needed: ${esc(sec.pending)}</p>`:""}
    </div>`;
  }).join("");
  box.innerHTML=`
    <h2>Edit plan 🎬 <span class="pill">footprint for CapCut</span></h2>
    <p>Second-by-second map cut to the <strong>song section breakdown</strong> (portrait 9:16). <strong>Lyrics burned on screen</strong>, synced per section; <strong>no story captions</strong>. Photo-heavy sections carry a <strong>stack</strong> (a bulk of candidates from a Facebook folder) - click a stack to see it; on the timeline you flash through the pile on the beat and keep the best.</p>
    <div class="make-actions"><button class="btn" id="btnCopyEDL">⧉ Copy plan</button><button class="btn" id="btnDlEDL">⬇ Download plan (.txt)</button></div>
    ${cards}
    <p class="hint">⚙ = to build / still to add. 🗂 stacks point at <code>Downloads/Jennies facebook/…</code>; once that media syncs into the pool, stacks show thumbnails and become drag-to-add.</p>`;
  bindStackClicks($("#editBody"));
  const copy=(t,ok)=>{ if(navigator.clipboard) navigator.clipboard.writeText(t).then(()=>toast(ok),()=>toast("Copy failed.")); };
  $("#btnCopyEDL").addEventListener("click",()=>copy(editPlanText(),"Edit plan copied."));
  $("#btnDlEDL").addEventListener("click",()=>{ const b=new Blob([editPlanText()],{type:"text/plain"}); const a=document.createElement("a"); a.href=URL.createObjectURL(b); a.download="jennie-gunnar-edit-plan.txt"; a.click(); URL.revokeObjectURL(a.href); toast("Edit plan downloaded."); });
}

/* ---------- watch the cuts (guarded by the global site gate) ---------- */
const CUTS=[
  {title:"Storytelling cut (Version 3) - about 1:55",
   note:"The current best arc: the spark, building a life, torn apart by distance, choosing each other, reaching the summit, and the next chapter. Watch this one first and rethink beats/scripts against it.",
   file:"Jennie-Gunnar-storytelling-cut.mp4"},
  {title:"“Distance” sequence - MVP - 15s",
   note:"A stylised world-map animation for the long-distance act: together in Stockholm, then Jennie moves home to Vietnam (both cry), a beat apart, then Gunnar crosses the world with heart-eyes, reunited. A proof of concept, not a finished shot.",
   file:"Jennie-Gunnar-distance-MVP.mp4"}
];
function renderCuts(){
  const box=$("#cutsBody"); if(!box) return;
  const url=(DATA&&DATA.cutsFolderUrl)||"";
  const items=CUTS.map(c=>`
    <div class="cut">
      <h3>${c.title}</h3>
      <p class="hint">${c.note}</p>
      <p class="cut-file">📄 ${c.file}</p>
    </div>`).join("");
  const linkBlock = url
    ? `<div class="make-actions"><a class="btn" href="${url}" target="_blank" rel="noopener">🎬 Open the video folder (Koofr)</a></div>`
    : `<p class="hint" style="color:var(--danger)">The Koofr folder link is not set yet. Paste the share link into <code>DATA.cutsFolderUrl</code> in <code>assets/data.js</code> (or send it to me) and it will appear here as a button.</p>`;
  box.innerHTML=`
    <h2>Draft cuts 🎬</h2>
    <p>To keep this site lightweight, the video files live in the shared <strong>Koofr</strong> folder, not on the page. The cuts below are in that folder; open it to watch or download. (The whole site is already behind the password, so no extra spoiler gate here.)</p>
    ${linkBlock}
    ${items}
    <p class="hint">Work in progress - not final. Watch, then tell me what to change: reorder beats, swap clips, rewrite captions, adjust the music.</p>`;
}
/* ---------- boot ---------- */
/* ---------- shot list (kept for reference / export) ---------- */
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
function renderAll(){ renderPool(); renderStory(); if($("#tab-analysis").classList.contains("active")) renderAnalysis(); if($("#tab-music").classList.contains("active")) renderMusic(); if($("#tab-edit").classList.contains("active")) renderEditPlan(); if($("#tab-cuts").classList.contains("active")) renderCuts(); }
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

/* ---------- global gate: confirm not-Jennie + password (soft, client-side) ---------- */
/* Password is stored only as a hash so the plaintext is not in the source. Unlock lasts for the browser session. */
function hashStr(s){ let h=5381; for(let i=0;i<s.length;i++) h=((h<<5)+h+s.charCodeAt(i))>>>0; return h; }
const GATE_HASH=160275652; // djb2 of the password, lowercased and trimmed
function initGate(){
  const g=$("#gate"); if(!g) return;
  try{ if(sessionStorage.getItem("jg_gate")==="1"){ g.remove(); return; } }catch(e){}
  document.body.style.overflow="hidden";
  const ack=$("#gateAck"), pass=$("#gatePass"), btn=$("#gateBtn"), err=$("#gateErr");
  const upd=()=>{ btn.disabled=!ack.checked; if(err) err.hidden=true; };
  ack.addEventListener("change",upd);
  const tryUnlock=()=>{
    if(!ack.checked) return;
    if(hashStr((pass.value||"").trim().toLowerCase())===GATE_HASH){
      try{ sessionStorage.setItem("jg_gate","1"); }catch(e){}
      document.body.style.overflow=""; g.remove();
    } else { if(err) err.hidden=false; pass.value=""; pass.focus(); }
  };
  btn.addEventListener("click",tryUnlock);
  pass.addEventListener("keydown",e=>{ if(e.key==="Enter"){ e.preventDefault(); tryUnlock(); } });
  ack.focus();
}

initGate();
applyTheme(state.theme||"light"); fillEventSelects(); bind(); renderAbout(); renderAppVer(); initPoolSortable(); updateVersionButtons(); renderAll(); restoreTab();
})();
