/* Workshop-wide gate: optional "I am not <the couple>" checkbox + password (soft, client-side).
   The password is stored only as a hash so the plaintext is not in the source. One unlock covers
   every project page for the browser session. */
(function(){
function hashStr(s){ let h=5381; for(let i=0;i<s.length;i++) h=((h<<5)+h+s.charCodeAt(i))>>>0; return h; }
const GATE_HASH=160275652; // djb2 of the password, lowercased and trimmed
const g=document.getElementById("gate"); if(!g) return;
try{ if(sessionStorage.getItem("jg_gate")==="1"){ g.remove(); return; } }catch(e){}
document.body.style.overflow="hidden";
const ack=document.getElementById("gateAck"), pass=document.getElementById("gatePass"),
      btn=document.getElementById("gateBtn"), err=document.getElementById("gateErr");
const upd=()=>{ btn.disabled=!!ack&&!ack.checked; if(err) err.hidden=true; };
if(ack) ack.addEventListener("change",upd); upd();
const tryUnlock=()=>{
  if(ack&&!ack.checked) return;
  if(hashStr((pass.value||"").trim().toLowerCase())===GATE_HASH){
    try{ sessionStorage.setItem("jg_gate","1"); }catch(e){}
    document.body.style.overflow=""; g.remove();
  } else { if(err) err.hidden=false; pass.value=""; pass.focus(); }
};
btn.addEventListener("click",tryUnlock);
pass.addEventListener("keydown",e=>{ if(e.key==="Enter"){ e.preventDefault(); tryUnlock(); } });
(ack||pass).focus();
})();
