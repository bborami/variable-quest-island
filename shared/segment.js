/* 퀘스트 섬 공통: 상단 과목 세그먼트(변액·생명·손해) + 공유 프로필
   사용법: <html data-subject="variable|life|nonlife"> 에
   <script src="(루트기준)shared/segment.js" defer></script> 를 넣고,
   버튼을 넣을 자리에 <div data-quest-seg></div> 를 두면 그 안에 그려짐.
   자리가 없으면 화면 왼쪽 아래에 떠 있는 버튼으로 표시됨. */
(function(){
  var SUBJECTS=[
    {id:"variable",name:"변액",ic:"📘",path:"",c:"#7b5cc7",d:"#6447b0",h:"#efe6ff"},
    {id:"life",name:"생명",ic:"💚",path:"life/",c:"#3a86c8",d:"#2c6ea8",h:"#e2f3ff"},
    {id:"nonlife",name:"손해",ic:"🛡",path:"nonlife/",c:"#2f9c78",d:"#237e60",h:"#dcf6ec"}
  ];
  var me=document.currentScript||[].slice.call(document.scripts).filter(function(s){return /shared\/segment\.js/.test(s.src)})[0];
  var ROOT=me?me.src.replace(/shared\/segment\.js.*$/,""):"./";
  var cur=document.documentElement.getAttribute("data-subject")||"variable";

  // 과목 간 공유 프로필(닉네임·옷 색). 각 섬은 QuestCommon.profile()/saveProfile() 사용
  var PK="quest-profile";
  window.QuestCommon={
    subjects:SUBJECTS,current:cur,root:ROOT,
    profile:function(){try{return JSON.parse(localStorage.getItem(PK)||"{}")}catch(e){return {}}},
    saveProfile:function(p){var o=this.profile();for(var k in p)o[k]=p[k];localStorage.setItem(PK,JSON.stringify(o));return o}
  };

  var css=".qseg{display:inline-flex;gap:4px;padding:5px;border-radius:999px;background:#fff6fb;box-shadow:6px 8px 18px rgba(120,90,170,.25),inset -3px -3px 6px rgba(150,110,200,.14),inset 3px 3px 6px #fff;font-family:inherit}"+
  ".qseg a{display:flex;align-items:center;gap:5px;padding:7px 14px;border-radius:999px;color:#7b6aa0;text-decoration:none;font-size:14px;white-space:nowrap;transition:background .15s}"+
  ".qseg a:hover{background:var(--qh)}.qseg a.on{background:var(--qc);color:#fff;box-shadow:inset -3px -4px 0 var(--qd);font-weight:700}"+
  ".qseg-float{position:fixed;left:14px;bottom:14px;z-index:50}"+
  ".qkakao{position:fixed;right:16px;bottom:16px;z-index:60;display:flex;align-items:center;gap:7px;padding:10px 16px;border-radius:999px;background:#FEE500;color:#3C1E1E;text-decoration:none;font-size:14px;font-weight:700;box-shadow:5px 7px 16px rgba(120,90,170,.28),inset -3px -4px 0 rgba(0,0,0,.08)}"+
  ".qkakao:hover{filter:brightness(.97)}.qkakao svg{width:18px;height:18px}"+
  "html.mobile .qkakao{right:12px;bottom:12px;padding:12px}html.mobile .qkakao span{display:none}"+
  "html.mobile #home{padding-bottom:84px!important}"+
"[data-quest-seg]{margin-top:10px}[data-quest-seg] .qseg{max-width:100%}";
  var st=document.createElement("style");st.textContent=css;document.head.appendChild(st);

  function build(){var w=document.createElement("nav");w.className="qseg";w.setAttribute("aria-label","과목 선택");
    SUBJECTS.forEach(function(s){var a=document.createElement("a");a.href=ROOT+s.path;a.innerHTML="<span>"+s.ic+"</span>"+s.name;a.style.setProperty("--qc",s.c);a.style.setProperty("--qd",s.d);a.style.setProperty("--qh",s.h);
      if(s.id===cur){a.className="on";a.setAttribute("aria-current","page")}w.appendChild(a)});return w}
  function mount(){var spots=document.querySelectorAll("[data-quest-seg]");
    if(spots.length){[].forEach.call(spots,function(m){m.innerHTML="";m.appendChild(build())})}
    else{var f=build();f.classList.add("qseg-float");document.body.appendChild(f)}}
  var KAKAO="https://pf.kakao.com/_xnhINX";
  function kakao(){if(document.querySelector(".qkakao"))return;var a=document.createElement("a");a.className="qkakao";a.href=KAKAO;a.target="_blank";a.rel="noopener";a.title="카카오톡 채널로 문의하기";
    a.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#3C1E1E" d="M12 3C6.5 3 2 6.6 2 11c0 2.8 1.9 5.3 4.7 6.7l-1 3.6c-.1.3.3.6.6.4l4.2-2.8c.5.1 1 .1 1.5.1 5.5 0 10-3.6 10-8S17.5 3 12 3z"/></svg><span>카카오 문의</span>';document.body.appendChild(a)}
  function mountAll(){mount();kakao()}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mountAll);else mountAll();
})();
