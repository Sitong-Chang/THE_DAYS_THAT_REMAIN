const DATA_URL = "data/records.json";
let archive = null;
let activeYear = 1937;
let selectedId = null;
let language = "en";

const translations = {
  en: {
    nav_calendar:"THE CALENDAR",nav_about:"ABOUT THE ARCHIVE",kicker:"A DIGITAL EXHIBITION · 1937—1945",
    eyebrow:"AN ARCHIVE OF RECORDED DAYS",hero_copy:"Eight years appear here not as a continuous story, but as the dates that remain in one person's record.",
    explore:"EXPLORE THE RECORD",source_short:"BASED ON 朱润苍《贞丰八年血泪录》",intro:"A date appears when the diary leaves a trace. A blank space does not tell us that nothing happened. It tells us only that this surviving text does not record that day.",
    reading_note:"HOW TO READ THIS EXHIBIT",calendar_title:"A calendar of traces",
    calendar_note:"Select a marked date to unfold its record. Dates follow the lunar calendar in the original diary.",
    legend_recorded:"A date represented in this exhibit",legend_gap:"No selected entry shown",year_note:"This is a curated selection, not a complete transcription.",
    reader_prompt:"Choose a marked date above.<br>The page will unfold here.",diary_fragment:"DIARY FRAGMENT",curatorial_note:"CURATORIAL NOTE",close:"CLOSE ×",
    closing_title:"“八年血泪<br><em>至此了结。</em>”",
    closing_copy:"The diary closes in 1945. Its ending belongs to the author's account; it does not mean that history, memory, or its consequences ended there.",
    about_title:"What this calendar can—and cannot—say",about_1_title:"One source, one perspective",
    about_1:"This exhibit is based on the diary attributed to Zhu Runcang and printed in <em>Modern Historical Materials</em>, issue 54. It presents the source as a situated historical record, not as a neutral or exhaustive account of every event.",
    about_2_title:"Lunar dates",about_2:"The author explicitly states that the dates in the compilation follow the lunar calendar. Gregorian years are supplied only to orient the timeline; individual lunar dates have not been converted into Gregorian dates.",
    about_3_title:"Silence is not evidence of absence",about_3:"The author also acknowledges that the account is selective and may omit details. Blank dates therefore mean “not represented in this selection / surviving text,” not that nothing happened.",
    about_4_title:"Selection and transcription",about_4:"The dates shown here are a curated sample selected to make the span of the diary explorable. Summaries are paraphrases. Short Chinese fragments are retained as quotations; OCR errors in the digitized PDF mean the scan should be checked before quoting at length.",
    primary_source:"PRIMARY SOURCE"
  },
  zh: {
    nav_calendar:"日记时间轴",nav_about:"关于档案",kicker:"数字档案展览 · 1937—1945",
    eyebrow:"一份关于被记录下来的日子",hero_copy:"这里的八年并不是一个连续完整的故事，而是一个人留下的记录中，仍然可见的那些日期。",
    explore:"进入档案",source_short:"基于朱润苍《贞丰八年血泪录》",intro:"当日记留下痕迹，一个日期便显现出来。空白并不意味着什么都没有发生，它只说明这份留存下来的文本没有记录那一天。",
    reading_note:"如何阅读本展览",calendar_title:"留下痕迹的日期",
    calendar_note:"点击标记日期，展开对应记录。原始日记中的日期以农历为准。",
    legend_recorded:"本展览选取的记录日期",legend_gap:"未展示选录条目",year_note:"这里呈现的是经过策展的选录，并非全文转录。",
    reader_prompt:"选择上方标记的日期。<br>日记页面将在这里展开。",diary_fragment:"日记片段",curatorial_note:"策展说明",close:"收起 ×",
    closing_title:"“八年血泪<br><em>至此了结。</em>”",
    closing_copy:"日记在1945年结束。这是作者叙述的终点，并不意味着历史、记忆或其影响也在此终止。",
    about_title:"这份日历能够——以及不能够——说明什么",about_1_title:"一种材料，一种视角",
    about_1:"本展览依据朱润苍编述、刊载于《近代史资料》第54号的日记。我们将其作为一份具有具体立场和处境的历史记录呈现，而非中立、完整涵盖所有事件的叙述。",
    about_2_title:"农历日期",about_2:"作者明确说明，本编年月日以农历为标准。网站以公历年份帮助读者理解时间跨度，但没有将每个农历日期擅自换算为公历日期。",
    about_3_title:"沉默不等于没有发生",about_3:"作者也承认记述只是大概，可能有所遗漏。因此，空白日期仅表示“现存文本或本次选录中没有呈现”，不能说明那一天什么都没有发生。",
    about_4_title:"选录与转录",about_4:"网站展示的是为便于探索而选取的部分日期，并非完整转录。内容摘要为转述；保留的中文短句为原文引语。数字化 PDF 的 OCR 存在识别错误，长篇引用前应回看原始扫描页。",
    primary_source:"主要档案来源"
  }
};

function t(key){ return translations[language][key] || key; }
function setLanguage(){
  document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const key=el.dataset.i18n;
    if(translations[language][key]!==undefined) el.innerHTML=translations[language][key];
  });
  document.getElementById("langToggle").textContent = language==="en" ? "中文 / EN" : "EN / 中文";
  renderYear();
  if(selectedId) showRecord(selectedId);
}
function renderYears(){
  const rail=document.getElementById("yearRail");
  rail.innerHTML="";
  archive.years.forEach(item=>{
    const btn=document.createElement("button");
    btn.className="year-button"+(item.year===activeYear?" active":"");
    btn.innerHTML=`<span>${item.era}</span><strong>${item.year}</strong>`;
    btn.addEventListener("click",()=>{activeYear=item.year;selectedId=null;renderYear();clearReader();});
    rail.appendChild(btn);
  });
}
function renderYear(){
  renderYears();
  const year=archive.years.find(x=>x.year===activeYear);
  document.getElementById("activeYear").textContent=activeYear;
  document.getElementById("activeEra").textContent=year.era;
  const list=archive.records.filter(r=>r.year===activeYear);
  document.getElementById("yearCount").textContent=String(list.length).padStart(2,"0")+" SELECTED RECORD"+(list.length===1?"":"S");
  const container=document.getElementById("recordList");
  container.innerHTML="";
  list.forEach(record=>{
    const card=document.createElement("button");
    card.className="record-card"+(selectedId===record.id?" selected":"");
    card.dataset.id=record.id;
    card.innerHTML=`<span class="record-date">${record.label} · ${record.date}</span><h3>${language==="zh"?record.title_zh:record.title}</h3><p>${language==="zh"?record.summary_zh:record.summary_en}</p>`;
    card.addEventListener("click",()=>showRecord(record.id));
    container.appendChild(card);
  });
}
function showRecord(id){
  const r=archive.records.find(x=>x.id===id);
  if(!r)return;
  selectedId=id;
  document.querySelectorAll(".record-card").forEach(c=>c.classList.toggle("selected",c.dataset.id===id));
  document.getElementById("readerEmpty").classList.add("hidden");
  document.getElementById("readerPage").classList.remove("hidden");
  document.getElementById("readerDate").textContent=`${r.era} · ${r.date}`;
  document.getElementById("readerSource").textContent=language==="zh"?"档案记录 / "+r.page+"页":"ARCHIVE ENTRY / P. "+r.page;
  document.getElementById("readerTitleCn").textContent=r.title_zh;
  document.getElementById("readerExcerpt").textContent=r.excerpt_zh;
  document.getElementById("readerSummaryCn").textContent=r.summary_zh;
  document.getElementById("readerTitleEn").textContent=r.title;
  document.getElementById("readerSummaryEn").textContent=r.summary_en;
  document.getElementById("readerContext").textContent=r.context;
  document.getElementById("readerPageNo").textContent=r.source;
  document.getElementById("reader").scrollIntoView({behavior:"smooth",block:"nearest"});
}
function clearReader(){
  document.getElementById("readerEmpty").classList.remove("hidden");
  document.getElementById("readerPage").classList.add("hidden");
}
async function init(){
  try{
    const res=await fetch(DATA_URL);
    archive=await res.json();
    renderYear();
    document.getElementById("langToggle").addEventListener("click",()=>{language=language==="en"?"zh":"en";setLanguage();});
    document.getElementById("closeReader").addEventListener("click",()=>{selectedId=null;clearReader();document.querySelectorAll(".record-card").forEach(c=>c.classList.remove("selected"));});
  }catch(e){
    document.getElementById("recordList").textContent="The archive data could not be loaded. Please open this site through a local web server.";
  }
}
init();
