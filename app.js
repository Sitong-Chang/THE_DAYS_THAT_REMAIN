const DATA="data/records.json";let db=null,currentYear=1937,currentRecord=null;
const $=s=>document.querySelector(s);
function clean(s){return String(s??"").replace(/[<>]/g,"")}
function yearRecords(y){return db.records.filter(r=>r.year===y)}
function buildTabs(){
 const host=$("#yearTabs");host.innerHTML="";
 db.years.forEach(y=>{const b=document.createElement("button");b.className="year-tab"+(y.year===currentYear?" active":"");b.textContent=String(y.year).slice(2);b.title=String(y.year);b.onclick=()=>{currentYear=y.year;currentRecord=null;renderYear();closeReader();};host.appendChild(b);});
}
function chooseDisplay(r){
 // Keep the archival wording prominent. The quote is the primary visual; summary is explicitly secondary.
 return r.excerpt_zh || r.summary_zh;
}
function renderYear(){
 buildTabs();const meta=db.years.find(y=>y.year===currentYear);const list=yearRecords(currentYear);
 $("#eraLabel").textContent=meta.era;$("#yearLabel").textContent=currentYear;
 $("#yearTally").textContent=String(list.length).padStart(2,"0")+" FRAGMENTS";
 const host=$("#fragments");host.innerHTML="";
 list.forEach((r,i)=>{
  const el=document.createElement("article");el.className="fragment";el.tabIndex=0;
  const date=document.createElement("div");date.className="frag-date";date.textContent=`${r.date} / ${r.page}`;
  const words=document.createElement("div");words.className="frag-words";words.textContent=chooseDisplay(r);
  const metaLine=document.createElement("div");metaLine.className="frag-meta";metaLine.textContent=`${r.title_zh}  ·  OPEN RECORD ↗`;
  const arrow=document.createElement("span");arrow.className="frag-arrow";arrow.textContent="↗";
  el.append(date,words,metaLine,arrow);el.onclick=()=>openRecord(r.id);el.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();openRecord(r.id);}};
  host.appendChild(el);
 });
 $("#stageCounter").textContent=`${String(1).padStart(2,"0")} / ${String(list.length).padStart(2,"0")}`;
}
function openRecord(id){
 const r=db.records.find(x=>x.id===id);if(!r)return;currentRecord=r;
 $("#readerIndex").textContent=`DOCUMENT / ${String(db.records.indexOf(r)+1).padStart(3,"0")}`;
 $("#readerEra").textContent=r.era;$("#readerLunar").textContent=r.date;$("#readerGregorian").textContent=r.year;
 $("#readerQuote").textContent=r.excerpt_zh||r.title_zh;
 $("#readerSummary").textContent=r.summary_zh;
 $("#readerPage").textContent=`SOURCE PAGE ${r.page}`;
 $("#readerSource").textContent=r.source;
 $("#reader").classList.add("open");
 $("#reader").scrollIntoView({behavior:"smooth",block:"start"});
}
function closeReader(){$("#reader").classList.remove("open");}
function renderIndex(){
 const host=$("#allRecords");host.innerHTML="";
 db.records.forEach(r=>{
  const el=document.createElement("div");el.className="index-record";el.innerHTML=`<span class="index-year">${r.year}</span><div><div class="index-title">${clean(r.title_zh)}</div><div class="index-date">${clean(r.date)} · P.${clean(r.page)}</div></div>`;
  el.onclick=()=>{currentYear=r.year;renderYear();openRecord(r.id);$("#archive").scrollIntoView({behavior:"smooth"});};host.appendChild(el);
 });
}
function setupScroll(){
 const label=$("#progressLabel");
 const update=()=>{const max=document.documentElement.scrollHeight-innerHeight;const p=max>0?Math.round(scrollY/max*100):0;label.textContent=`${p}% / IN THE RECORD`;};
 addEventListener("scroll",update,{passive:true});update();
 const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add("seen");}),{threshold:.15});
 document.querySelectorAll(".threshold,.archive,.interlude,.final-record").forEach(el=>observer.observe(el));
}
async function init(){
 const res=await fetch(DATA);db=await res.json();renderYear();renderIndex();
 $("#readerClose").onclick=closeReader;

 setupScroll();
}
init().catch(e=>{console.error(e);$("#fragments").textContent="Archive data unavailable. Run this site through a local server.";});
