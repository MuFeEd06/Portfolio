import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

// ── SUPABASE CONFIG ────────────────────────────────────────────────────────
// Credentials come from environment variables — NEVER hardcode these.
// Vite only exposes env vars prefixed with VITE_ to the browser bundle.
// Set these in a local .env file (gitignored) and in Vercel → Project
// Settings → Environment Variables for production. See README for setup.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error(
    "Missing Supabase environment variables. Create a .env file with " +
    "VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (see README.md)."
  );
}

const supabase = createClient(SUPABASE_URL || "", SUPABASE_ANON_KEY || "");

// ── THEME ────────────────────────────────────────────────────────────────────
const T = {
  bg: "#050509", s1: "#0d0d1a", s2: "#13132a",
  acc: "#7c6af7", acc2: "#c084fc", acc3: "#38bdf8",
  txt: "#e8e6ff", mut: "#7878a8",
  brd: "rgba(124,106,247,0.14)", glow: "rgba(124,106,247,0.22)",
};

// ── RESPONSIVE BREAKPOINTS ────────────────────────────────────────────────────
// Since the whole site uses inline style={{}} objects (no separate CSS file,
// so no real @media queries are possible), components read live viewport
// width via these hooks and branch their style objects accordingly.
const MOBILE_BP = 720;  // phones + small tablets — collapse nav, stack grids
const SMALL_BP   = 420;  // very narrow phones — tighten further

function useViewport() {
  const [w, setW] = useState(() => (typeof window !== "undefined" ? window.innerWidth : 1200));
  useEffect(() => {
    let raf = null;
    const onResize = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => { setW(window.innerWidth); raf = null; });
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return w;
}
const useIsMobile = () => useViewport() <= MOBILE_BP;
const useIsSmall  = () => useViewport() <= SMALL_BP;

// ── DEFAULT DATA ──────────────────────────────────────────────────────────────
const DEFAULT = {
  name: "Mufeed T",
  role: "Data Analytics & Tech Professional",
  desc: "Transforming raw data into actionable insights. Skilled in Python, SQL, Excel and Power BI. Let's turn your data into decisions.",
  about: "I'm a B.Tech Artificial Intelligence and data science student at EASA COLLEGE OF ENGINEERING, AnnaUniversity, passionate about transforming raw data into meaningful insights. With a strong academic background and hands-on knowledge of data tools, I'm ready to contribute and grow in a dynamic tech environment.",
  goal: "Seeking a challenging and rewarding opportunity in a progressive organization where I can utilize my technical expertise, innovative thinking, and collaborative spirit to drive business growth, enhance my skills, and achieve professional excellence.",
  availabilityText: "Available for Internship", // hero badge text — editable in admin
  photo: "", // profile photo (base64 or URL) — shown in the hero circle; falls back to emoji if empty
  infoCards: [
    { label: "Full Name", val: "Mufeed T" },
    { label: "Date of Birth", val: "09 Nov 2002" },
    { label: "Nationality", val: "Indian" },
    { label: "Marital Status", val: "Unmarried" },
    { label: "Location", val: "Palakkad, Kerala" },
    { label: "Email", val: "itz.me.mufeed@gmail.com" },
  ],
  stats: [
    { num: "5+", label: "Dashboards" },
    { num: "5000+", label: "Records Analysed" },
    { num: "4+", label: "Certifications" },
    { num: "6+", label: "Tech Skills" },
  ],
  socials: [
    { icon: "✉️", url: "mailto:itz.me.mufeed@gmail.com", label: "Email" },
    { icon: "💼", url: "#", label: "LinkedIn" },
    { icon: "🐙", url: "#", label: "GitHub" },
  ],
  skills: [
    { icon: "📊", name: "Microsoft Excel", desc: "Formulas, pivot tables, data analysis & reporting", level: 85 },
    { icon: "📈", name: "Power BI", desc: "Interactive dashboards & business intelligence", level: 80 },
    { icon: "🗄️", name: "SQL", desc: "Database queries, joins & data manipulation", level: 75 },
    { icon: "🐍", name: "Python", desc: "Programming, scripting & data processing", level: 70 },
    { icon: "☁️", name: "Google Workspace", desc: "Sheets, Drive, Slides & collaboration tools", level: 82 },
    { icon: "🤖", name: "AI / ChatGPT Tools", desc: "Prompt engineering & GenAI-powered analytics", level: 72 },
  ],
  // Projects now use CollectionSurfer format
  projects: [
    {
      id: 1,
      name: "Blinkit Grocery Sales Dashboard",
      tag: "Power BI",
      desc: "Retail Analytics Dashboard – comprehensive sales analysis with interactive Power BI visualizations, KPI tracking, and trend forecasting across multiple store locations.",
      url: "https://github.com/",
      thumb: "",           // card thumbnail (URL or base64)
      screenshots: [],    // up to 5 screenshot URLs or base64
      video: "",          // optional demo video (URL or base64), max 60s
    },
    {
      id: 2,
      name: "HR Attrition Analytics Dashboard",
      tag: "HR Analytics",
      desc: "Employee attrition analysis and predictive insights dashboard built with data visualization best practices. Includes department-wise breakdown and key risk indicators.",
      url: "https://github.com/",
      thumb: "",
      screenshots: [],
      video: "",
    },
  ],
  certs: [
    { icon: "📊", name: "30 Days Power BI Micro Course", issuer: "SkillCourse", date: "25 May 2026" },
    { icon: "🏢", name: "Deloitte Data Analytics Job Simulation", issuer: "Forage", date: "28 May 2026" },
    { icon: "🤖", name: "TATA GenAI Powered Data Analytics Job Simulation", issuer: "Forage", date: "1 June 2026" },
    { icon: "🛠️", name: "AI Tools and ChatGPT Workshop", issuer: "be10x", date: "31 May 2026" },
  ],
  experience: [],
  education: [
    { inst: "EASA College of Engineering", deg: "B.Tech – Artificial Intelligence and Data Science", period: "2024 – 2028", grade: "Currently Enrolled", note: "" },
  ],
  contact: [
    { icon: "✉️", label: "Email", val: "itz.me.mufeed@gmail.com" },
    { icon: "📍", label: "Address", val: "Palakkad, Kerala" },
  ],
  resumeUrl: "",
  autoScrollSpeed: 0.4,  // cards per second; 0 = paused
};

// ── STORAGE (Supabase — shared across all visitors) ──────────────────────────
async function loadData() {
  try {
    const { data, error } = await supabase
      .from("portfolio_data")
      .select("data")
      .eq("id", 1)
      .single();
    if (error) throw error;
    // If the row is empty ({}), fall back to defaults
    if (!data?.data || Object.keys(data.data).length === 0) {
      return JSON.parse(JSON.stringify(DEFAULT));
    }
    // Merge with DEFAULT so any new fields added later don't break old saved data
    return { ...JSON.parse(JSON.stringify(DEFAULT)), ...data.data };
  } catch (e) {
    console.error("Failed to load from Supabase, using local defaults:", e);
    return JSON.parse(JSON.stringify(DEFAULT));
  }
}

async function saveData(d) {
  try {
    const { error } = await supabase
      .from("portfolio_data")
      .update({ data: d, updated_at: new Date().toISOString() })
      .eq("id", 1);
    if (error) throw error;
    return true;
  } catch (e) {
    console.error("Failed to save to Supabase:", e);
    return false;
  }
}

// ── PARTICLES ─────────────────────────────────────────────────────────────────
function Particles() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; const ctx = c.getContext("2d");
    let W, H, pts, raf;
    const resize = () => { W = c.width = innerWidth; H = c.height = innerHeight; };
    const init = () => { pts = Array.from({ length: 55 }, () => ({ x: Math.random()*W, y: Math.random()*H, vx: (Math.random()-.5)*.32, vy: (Math.random()-.5)*.32, r: Math.random()*1.7+.5 })); };
    const draw = () => {
      ctx.clearRect(0,0,W,H);
      pts.forEach(p => { p.x+=p.vx; p.y+=p.vy; if(p.x<0||p.x>W)p.vx*=-1; if(p.y<0||p.y>H)p.vy*=-1; ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fillStyle="rgba(124,106,247,.38)"; ctx.fill(); });
      pts.forEach((a,i)=>pts.slice(i+1).forEach(b=>{const d=Math.hypot(a.x-b.x,a.y-b.y);if(d<115){ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.strokeStyle=`rgba(124,106,247,${.065*(1-d/115)})`;ctx.lineWidth=.7;ctx.stroke();}}));
      raf = requestAnimationFrame(draw);
    };
    window.addEventListener("resize",()=>{resize();init();}); resize(); init(); draw();
    return ()=>{ cancelAnimationFrame(raf); window.removeEventListener("resize",()=>{}); };
  },[]);
  return <canvas ref={ref} style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0}} />;
}

// ── NAV ───────────────────────────────────────────────────────────────────────
const NAVS = ["home","about","skills","projects","certifications","experience","education","contact"];
function Nav({ onAdmin, name, isAdmin }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  useEffect(()=>{ const h=()=>setScrolled(scrollY>30); window.addEventListener("scroll",h); return()=>window.removeEventListener("scroll",h); },[]);
  useEffect(()=>{ if(!isMobile) setMenuOpen(false); },[isMobile]);
  const go = id => { document.getElementById(id)?.scrollIntoView({behavior:"smooth"}); setMenuOpen(false); };

  return (
    <>
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,display:"flex",alignItems:"center",justifyContent:"space-between",padding:isMobile?".8rem 1.1rem":".9rem 2.2rem",background:(scrolled||menuOpen)?"rgba(5,5,9,.94)":"transparent",backdropFilter:(scrolled||menuOpen)?"blur(14px)":"none",borderBottom:`1px solid ${(scrolled||menuOpen)?T.brd:"transparent"}`,transition:"all .3s"}}>
        {/* Invisible spacer keeps the center nav links visually centered on desktop now that the logo is removed. Hidden on mobile so the hamburger can sit flush left. */}
        {!isMobile && <div style={{width:90,flexShrink:0}} aria-hidden="true" />}

        {isMobile ? (
          // Hamburger toggle replaces the full link row on small screens
          <button onClick={()=>setMenuOpen(o=>!o)} aria-label="Toggle navigation menu"
            style={{background:"none",border:`1px solid ${T.brd}`,borderRadius:8,width:38,height:38,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0}}>
            <div style={{width:18,height:13,position:"relative"}}>
              {[0,1,2].map(i=>(
                <span key={i} style={{position:"absolute",left:0,right:0,height:2,background:T.txt,borderRadius:1,top:i*5.5,
                  transform: menuOpen ? (i===0?"translateY(5.5px) rotate(45deg)":i===2?"translateY(-5.5px) rotate(-45deg)":"scaleX(0)") : "none",
                  opacity: menuOpen && i===1 ? 0 : 1, transition:"transform .25s ease, opacity .2s ease"}} />
              ))}
            </div>
          </button>
        ) : (
          <div style={{display:"flex",gap:"1.5rem"}}>
            {NAVS.map(id=><button key={id} onClick={()=>go(id)} style={{background:"none",border:"none",color:T.mut,cursor:"pointer",fontFamily:"'Space Grotesk',sans-serif",fontSize:".8rem",fontWeight:500,transition:"color .2s"}} onMouseEnter={e=>e.target.style.color=T.acc2} onMouseLeave={e=>e.target.style.color=T.mut}>{id}</button>)}
          </div>
        )}

        <button onClick={onAdmin} style={{background:`linear-gradient(135deg,${T.acc},${T.acc2})`,color:"#fff",border:"none",borderRadius:8,padding:isMobile?".42rem .8rem":".42rem 1rem",fontSize:isMobile?".72rem":".78rem",fontWeight:700,cursor:"pointer",fontFamily:"'Space Grotesk',sans-serif",display:"flex",alignItems:"center",gap:".4rem",flexShrink:0}}>
          {isAdmin && <span style={{width:6,height:6,borderRadius:"50%",background:"#4ade80",display:"inline-block"}} title="Signed in" />}
          ⚙ Admin
        </button>
      </nav>

      {/* Mobile slide-down menu */}
      {isMobile && (
        <div style={{
          position:"fixed", top:0, left:0, right:0, zIndex:99,
          background:"rgba(5,5,9,.97)", backdropFilter:"blur(16px)",
          borderBottom:`1px solid ${T.brd}`,
          maxHeight: menuOpen ? "min(80vh,560px)" : 0,
          overflow:"hidden",
          transition:"max-height .35s cubic-bezier(.22,1,.36,1)",
          paddingTop: menuOpen ? "4.2rem" : 0,
        }}>
          <div style={{display:"flex",flexDirection:"column",padding:"0 1.1rem 1.2rem"}}>
            {NAVS.map(id=>(
              <button key={id} onClick={()=>go(id)} style={{
                background:"none", border:"none", borderBottom:`1px solid ${T.brd}`,
                color:T.txt, cursor:"pointer", textAlign:"left",
                fontFamily:"'Space Grotesk',sans-serif", fontSize:"1rem", fontWeight:600,
                textTransform:"capitalize", padding:"1rem .2rem",
              }}>
                {id}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

// ── SECTION HEADER ────────────────────────────────────────────────────────────
function SH({ eye, title, hi }) {
  return (
    <div style={{textAlign:"center",marginBottom:"3rem"}}>
      <div style={{fontSize:".72rem",fontWeight:700,letterSpacing:".14em",color:T.acc,textTransform:"uppercase",marginBottom:".4rem"}}>{eye}</div>
      <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:"clamp(1.8rem,3vw,2.6rem)",fontWeight:800,margin:0}}>
        {title} <span style={{background:`linear-gradient(135deg,${T.acc},${T.acc2})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{hi}</span>
      </h2>
      <div style={{width:56,height:3,margin:".9rem auto 0",background:`linear-gradient(90deg,${T.acc},${T.acc2})`,borderRadius:2}} />
    </div>
  );
}

// ── SKILL BAR ─────────────────────────────────────────────────────────────────
function SkillBar({ level }) {
  const ref = useRef(null);
  const [w, setW] = useState(0);
  useEffect(()=>{
    const ob = new IntersectionObserver(([e])=>{ if(e.isIntersecting){ setW(level); ob.disconnect(); } },{rootMargin:"-60px"});
    if(ref.current) ob.observe(ref.current);
    return()=>ob.disconnect();
  },[level]);
  return <div ref={ref} style={{marginTop:".75rem",height:4,background:T.s2,borderRadius:2}}><div style={{height:"100%",borderRadius:2,background:`linear-gradient(90deg,${T.acc},${T.acc2})`,width:`${w}%`,transition:"width 1s cubic-bezier(.22,1,.36,1)"}}/></div>;
}

// ── REVEAL WRAPPER ────────────────────────────────────────────────────────────
function Reveal({ children, style }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(()=>{
    const ob = new IntersectionObserver(([e])=>{ if(e.isIntersecting){ setVis(true); ob.disconnect(); } },{rootMargin:"-60px"});
    if(ref.current) ob.observe(ref.current);
    return()=>ob.disconnect();
  },[]);
  return <div ref={ref} style={{opacity:vis?1:0,transform:vis?"translateY(0)":"translateY(28px)",transition:"opacity .6s ease,transform .6s ease",...style}}>{children}</div>;
}

// ── SCRAMBLE TEXT ──────────────────────────────────────────────────────────────
// Plain-JS port of the 21st.dev "SpecialText" effect — no TypeScript, no
// external `motion` package, no shadcn paths. Two phases:
//   Phase 1: random glitch characters fill in left-to-right
//   Phase 2: characters lock into place left-to-right while the rest
//            keeps glitching, until the full string is revealed
const SCRAMBLE_CHARS = "_!X$0-+*#";

function getScrambleChar(prevChar) {
  let c;
  do { c = SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]; }
  while (c === prevChar);
  return c;
}

// Renders `text` but lets the caller wrap parts of it (e.g. a colored <span>)
// by passing children as plain text only — for rich content like the
// gradient name, ScrambleText is used per-segment (see usage below).
function ScrambleText({ text, speed = 28, delay = 0, startWhenVisible = true, once = true, style }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(() => "\u00A0".repeat(text.length));
  const [started, setStarted] = useState(!startWhenVisible && delay <= 0);
  const phaseRef = useRef("phase1");
  const stepRef = useRef(0);
  const intervalRef = useRef(null);
  const startTORef = useRef(null);
  const firedRef = useRef(false);

  // Trigger on scroll-into-view (optional)
  useEffect(() => {
    if (!startWhenVisible) return;
    const el = ref.current; if (!el) return;
    const ob = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && (!once || !firedRef.current)) {
        firedRef.current = true;
        if (delay > 0) {
          startTORef.current = setTimeout(() => setStarted(true), delay * 1000);
        } else {
          setStarted(true);
        }
        if (once) ob.disconnect();
      }
    }, { rootMargin: "-80px" });
    ob.observe(el);
    return () => { ob.disconnect(); clearTimeout(startTORef.current); };
  }, [startWhenVisible, delay, once]);

  // Run the two-phase animation loop once started
  useEffect(() => {
    if (!started) return;
    phaseRef.current = "phase1";
    stepRef.current = 0;
    setDisplay("\u00A0".repeat(text.length));

    intervalRef.current = setInterval(() => {
      if (phaseRef.current === "phase1") {
        const maxSteps = text.length * 2;
        const currentLength = Math.min(stepRef.current + 1, text.length);
        const chars = [];
        for (let i = 0; i < currentLength; i++) chars.push(getScrambleChar(chars[i - 1]));
        for (let i = currentLength; i < text.length; i++) chars.push("\u00A0");
        setDisplay(chars.join(""));
        if (stepRef.current < maxSteps - 1) stepRef.current += 1;
        else { phaseRef.current = "phase2"; stepRef.current = 0; }
      } else {
        const revealed = Math.floor(stepRef.current / 2);
        const chars = [];
        for (let i = 0; i < revealed && i < text.length; i++) chars.push(text[i]);
        if (revealed < text.length) chars.push(stepRef.current % 2 === 0 ? "_" : getScrambleChar());
        for (let i = chars.length; i < text.length; i++) chars.push(getScrambleChar());
        setDisplay(chars.join(""));
        if (stepRef.current < text.length * 2 - 1) stepRef.current += 1;
        else { setDisplay(text); clearInterval(intervalRef.current); }
      }
    }, speed);

    return () => clearInterval(intervalRef.current);
  }, [started, text, speed]);

  return (
    <span ref={ref} style={{ fontFamily:"'Space Grotesk',monospace", display:"inline-block", whiteSpace:"pre", ...style }}>
      {display}
    </span>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// ── 3D COLLECTION SURFER (Projects) ─────────────────────────────────────────
// ════════════════════════════════════════════════════════════════════════════════

// ── MEDIA SWIPER INSIDE POPUP (video first, then screenshots) ───────────────
function MediaSwiper({ video, shots }) {
  const [idx, setIdx] = useState(0);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const swipeLocked = useRef(false);
  const videoRef = useRef(null);

  // Build a unified slide list: video (if present) first, then screenshots
  const slides = [
    ...(video ? [{ type: "video", src: video }] : []),
    ...(shots || []).map(src => ({ type: "image", src })),
  ];

  const prev = e => { e.stopPropagation(); setIdx(i => Math.max(0, i - 1)); };
  const next = e => { e.stopPropagation(); setIdx(i => Math.min(slides.length - 1, i + 1)); };

  const onTouchStart = e => { touchStartX.current = e.touches[0].clientX; touchStartY.current = e.touches[0].clientY; swipeLocked.current = false; };
  const onTouchEnd = e => {
    if (swipeLocked.current) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      dx < 0 ? setIdx(i => Math.min(slides.length - 1, i + 1)) : setIdx(i => Math.max(0, i - 1));
    }
  };

  // Pause video when swiping away from its slide
  useEffect(() => {
    if (videoRef.current && slides[idx]?.type !== "video") videoRef.current.pause();
  }, [idx]); // eslint-disable-line

  if (slides.length === 0) return (
    <div style={{height:220,background:T.s2,borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:"0.5rem",marginBottom:"1.2rem"}}>
      <span style={{fontSize:"2.5rem"}}>🖼️</span>
      <span style={{color:T.mut,fontSize:".8rem"}}>No media added yet</span>
    </div>
  );

  const current = slides[idx];

  return (
    <div style={{position:"relative",marginBottom:"1.2rem",userSelect:"none"}} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      {/* Main media */}
      <div style={{height:240,borderRadius:14,overflow:"hidden",background:"#000",position:"relative"}}>
        {current.type === "video" ? (
          <video
            ref={videoRef}
            src={current.src}
            controls
            playsInline
            style={{width:"100%",height:"100%",objectFit:"contain",display:"block",background:"#000"}}
          />
        ) : (
          <img src={current.src} alt={`screenshot ${idx+1}`} style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}} />
        )}
        {/* Gradient overlay + counter (skip overlay on video so controls stay visible) */}
        {current.type === "image" && (
          <div style={{position:"absolute",bottom:0,left:0,right:0,height:60,background:"linear-gradient(to top,rgba(5,5,9,.8),transparent)",pointerEvents:"none"}} />
        )}
        <div style={{position:"absolute",top:10,right:12,background:"rgba(0,0,0,.6)",color:"#fff",fontSize:".68rem",padding:"2px 8px",borderRadius:20,backdropFilter:"blur(4px)",pointerEvents:"none"}}>
          {current.type === "video" ? "▶ Demo" : `${idx+1} / ${slides.length}`}
        </div>
      </div>
      {/* Prev / Next arrows */}
      {idx > 0 && (
        <button onClick={prev} style={{position:"absolute",left:8,top:"50%",transform:"translateY(-50%)",background:"rgba(0,0,0,.55)",border:"1px solid rgba(255,255,255,.15)",color:"#fff",width:32,height:32,borderRadius:"50%",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1rem",backdropFilter:"blur(4px)"}}>‹</button>
      )}
      {idx < slides.length - 1 && (
        <button onClick={next} style={{position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",background:"rgba(0,0,0,.55)",border:"1px solid rgba(255,255,255,.15)",color:"#fff",width:32,height:32,borderRadius:"50%",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1rem",backdropFilter:"blur(4px)"}}>›</button>
      )}
      {/* Dots — video slide gets a small "▶" marker instead of a plain dot */}
      {slides.length > 1 && (
        <div style={{display:"flex",justifyContent:"center",gap:5,marginTop:8}}>
          {slides.map((s,i)=>(
            <button key={i} onClick={e=>{e.stopPropagation();setIdx(i);}}
              style={{width:i===idx?20:7,height:7,borderRadius:4,border:"none",cursor:"pointer",background:i===idx?T.acc:T.mut,transition:"all .2s",padding:0,position:"relative"}}
              title={s.type==="video" ? "Demo video" : `Screenshot ${i+1}`} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── PROJECT DETAIL POPUP ──────────────────────────────────────────────────────
function ProjectPopup({ project, onClose }) {
  const ref = useRef(null);
  const isMobile = useIsMobile();
  // Close on backdrop click
  const onBdClick = e => { if(e.target===ref.current) onClose(); };
  // Close on Escape
  useEffect(()=>{ const h=e=>{if(e.key==="Escape")onClose();}; window.addEventListener("keydown",h); return()=>window.removeEventListener("keydown",h); },[onClose]);
  // Prevent body scroll
  useEffect(()=>{ document.body.style.overflow="hidden"; return()=>{ document.body.style.overflow=""; }; },[]);

  return (
    <div ref={ref} onClick={onBdClick} style={{position:"fixed",inset:0,zIndex:500,background:"rgba(0,0,0,.82)",display:"flex",alignItems:isMobile?"flex-end":"center",justifyContent:"center",padding:isMobile?0:"1rem",backdropFilter:"blur(8px)"}}>
      <div style={{background:T.s1,border:`1px solid ${T.brd}`,borderRadius:isMobile?"22px 22px 0 0":22,width:"100%",maxWidth:520,maxHeight:isMobile?"92vh":"90vh",overflow:"hidden",display:"flex",flexDirection:"column",animation:isMobile?"slideUp .28s cubic-bezier(.22,1,.36,1)":"popIn .25s cubic-bezier(.22,1,.36,1)"}}>
        {/* Header bar */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:isMobile?".9rem 1.1rem":"1rem 1.4rem",borderBottom:`1px solid ${T.brd}`,flexShrink:0}}>
          <span style={{fontSize:".68rem",fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:T.acc2}}>{project.tag}</span>
          <button onClick={onClose} style={{background:"none",border:"none",color:T.mut,fontSize:"1.6rem",cursor:"pointer",lineHeight:1,padding:".3rem .5rem",minWidth:36,minHeight:36}}>×</button>
        </div>
        {/* Scrollable body */}
        <div style={{overflowY:"auto",padding:isMobile?"1.1rem":"1.4rem",flex:1}}>
          {/* Media swiper: demo video first (if present), then screenshots */}
          <MediaSwiper video={project.video} shots={project.screenshots || []} />
          {/* Project name */}
          <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:isMobile?"1.05rem":"1.2rem",margin:"0 0 .6rem"}}>{project.name}</h2>
          {/* Description */}
          <p style={{color:T.mut,fontSize:isMobile?".85rem":".9rem",lineHeight:1.75,margin:"0 0 1.4rem"}}>{project.desc}</p>
          {/* GitHub link */}
          {project.url && (
            <a href={project.url} target="_blank" rel="noreferrer"
              style={{display:"inline-flex",alignItems:"center",gap:".55rem",background:`linear-gradient(135deg,${T.acc},${T.acc2})`,color:"#fff",borderRadius:10,padding:".65rem 1.3rem",textDecoration:"none",fontWeight:700,fontSize:".88rem",fontFamily:"'Space Grotesk',sans-serif"}}>
              {/* GitHub SVG logo */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
              View on GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// ── COLLECTION SURFER SECTION ─────────────────────────────────────────────────
// Motion model:
//   • offset drives HORIZONTAL position only (X axis in the diagonal stack)
//   • Each card gets an independent sinusoidal vertical "wave" float tied to
//     real time + its own phase, giving a fluid ocean-wave feel
//   • Page scroll is NEVER prevented — the section passes wheel events through
//     unless the user is also dragging horizontally (touch/mouse only)
//   • Auto-scroll: a continuous slow drift driven by autoScrollSpeed (cards/s)
//     that pauses while the user is interacting, then resumes smoothly

const CARD_W = 300;
const CARD_H = 370;
const GAP    = 340;   // horizontal spacing between card centres
// Wave parameters per card
const WAVE_AMP   = 38;   // px amplitude of float
const WAVE_SPEED = 0.55; // radians per second
const WAVE_PHASE = 1.1;  // phase offset between adjacent cards (rad)

function ProjectsSurfer({ projects, autoScrollSpeed = 0.4 }) {
  const isMobile = useIsMobile();
  const cardW = isMobile ? 210 : CARD_W;
  const cardH = isMobile ? 260 : CARD_H;
  const gap   = isMobile ? 240 : GAP;

  const TOTAL      = Math.max(projects.length, 1);
  // Generous buffer so momentum/snap never outruns the rendered card range.
  const EXTRA      = Math.max(8, Math.ceil(14 / TOTAL) * TOTAL);
  const CARD_COUNT = TOTAL + EXTRA * 2;

  // offset = fractional card index; drives X placement
  const currentOffset = useRef(0);   // smoothed display value
  const targetOffset  = useRef(0);   // where we're easing toward
  const lastTs         = useRef(null); // for delta-time auto-scroll

  const [offset,  setOffset]  = useState(0);
  const [waveT,   setWaveT]   = useState(0); // time for wave animation (seconds)
  const [popup,   setPopup]   = useState(null);

  const isDragging    = useRef(false);
  const userInteract  = useRef(false); // true while the user is actively controlling the carousel
  const dragAccum     = useRef(0);     // total drag distance (in card units) since pointer-down
  const lastX         = useRef(0);
  const mouseDownPos  = useRef({ x: 0, y: 0 });
  const rafRef        = useRef(null);
  const containerRef  = useRef(null);

  // ── MAIN RAF LOOP ──────────────────────────────────────────────────────────
  const loop = useCallback((ts) => {
    if (lastTs.current === null) lastTs.current = ts;
    const dt = Math.min((ts - lastTs.current) / 1000, 0.1);
    lastTs.current = ts;

    // Auto-scroll drift — only runs when the user is NOT interacting.
    // This creates the "infinite loop when idle" behaviour.
    if (!userInteract.current && autoScrollSpeed > 0) {
      targetOffset.current += autoScrollSpeed * dt;
    }

    // Ease currentOffset → targetOffset (snappier easing while the user is
    // actively dragging so it tracks the pointer closely; same easing
    // handles the final settle-into-place after release too).
    const diff = targetOffset.current - currentOffset.current;
    const easeRate = userInteract.current ? 14 : 8;
    currentOffset.current += diff * Math.min(1, easeRate * dt);

    // Keep offsets bounded to avoid float drift over long sessions —
    // wrap both by TOTAL once they exceed a few cycles. Since position is
    // computed via modulo per-card anyway, shifting both by the same
    // multiple of TOTAL is visually seamless (true infinite loop).
    if (Math.abs(currentOffset.current) > TOTAL * 1000) {
      const wrap = Math.round(currentOffset.current / TOTAL) * TOTAL;
      currentOffset.current -= wrap;
      targetOffset.current  -= wrap;
    }

    setWaveT(ts / 1000);
    setOffset(currentOffset.current);

    rafRef.current = requestAnimationFrame(loop);
  }, [autoScrollSpeed, TOTAL]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [loop]);

  // Called the instant the user starts touching/dragging/scrolling —
  // pauses auto-scroll immediately.
  const beginInteract = useCallback(() => {
    userInteract.current = true;
  }, []);

  // Called when the user finishes a gesture (release/touchend/wheel-settle).
  // Snaps to the nearest whole card, THEN — after the snap completes and a
  // short idle delay — hands control back to auto-scroll. This satisfies
  // "stop at last card" for both directions while still resuming the loop
  // once the user is done.
  const endInteractAndSnap = useCallback(() => {
    targetOffset.current = Math.round(targetOffset.current);
    // Give the snap a moment to visually settle before auto-scroll resumes,
    // so it doesn't feel like the carousel yanks away immediately.
    clearTimeout(endInteractAndSnap._t);
    endInteractAndSnap._t = setTimeout(() => { userInteract.current = false; }, 700);
  }, []);

  // Live nudge while actively dragging/wheeling (no snapping mid-gesture).
  const nudge = useCallback((delta) => {
    beginInteract();
    targetOffset.current += delta;
  }, [beginInteract]);

  // ── WHEEL — horizontal axis only, NEVER trap vertical ─────────────────────
  useEffect(() => {
    const el = containerRef.current; if (!el) return;
    let settleTimer = null;
    const onWheel = e => {
      const horiz = Math.abs(e.deltaX) > Math.abs(e.deltaY)
        ? e.deltaX
        : (e.shiftKey ? e.deltaY : 0);
      if (horiz !== 0) {
        e.preventDefault();
        nudge(horiz / 320);
        // Debounce: once wheel events stop firing for a moment, treat the
        // gesture as finished and snap to the nearest card.
        clearTimeout(settleTimer);
        settleTimer = setTimeout(endInteractAndSnap, 150);
      }
      // Pure vertical scroll passes through naturally
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => { el.removeEventListener("wheel", onWheel); clearTimeout(settleTimer); };
  }, [nudge, endInteractAndSnap]);

  // ── TOUCH — horizontal swipe only, vertical scrolls page ──────────────────
  useEffect(() => {
    const el = containerRef.current; if (!el) return;
    let startX = 0, startY = 0, decided = false, isHoriz = false;

    const onTS = e => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      lastX.current = startX;
      decided = false; isHoriz = false;
    };
    const onTM = e => {
      const dx = e.touches[0].clientX - startX;
      const dy = e.touches[0].clientY - startY;
      if (!decided) {
        if (Math.hypot(dx, dy) < 6) return; // wait for intent
        isHoriz = Math.abs(dx) > Math.abs(dy);
        decided = true;
      }
      if (!isHoriz) return; // let page scroll vertically
      e.preventDefault();
      const ddx = e.touches[0].clientX - lastX.current;
      lastX.current = e.touches[0].clientX;
      nudge(-ddx / gap);
    };
    const onTE = () => {
      if (isHoriz) endInteractAndSnap(); // stop cleanly at the nearest card, no momentum overshoot
    };
    el.addEventListener("touchstart", onTS, { passive: true });
    el.addEventListener("touchmove",  onTM, { passive: false });
    el.addEventListener("touchend",   onTE);
    return () => {
      el.removeEventListener("touchstart", onTS);
      el.removeEventListener("touchmove",  onTM);
      el.removeEventListener("touchend",   onTE);
    };
  }, [nudge, endInteractAndSnap]);

  // ── MOUSE DRAG ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const el = containerRef.current; if (!el) return;
    const onMD = e => {
      isDragging.current = true;
      lastX.current = e.clientX;
      mouseDownPos.current = { x: e.clientX, y: e.clientY };
      dragAccum.current = 0;
      el.style.cursor = "grabbing";
    };
    const onMM = e => {
      if (!isDragging.current) return;
      const dx = e.clientX - lastX.current;
      lastX.current = e.clientX;
      const delta = -dx / 280;
      dragAccum.current += delta;
      nudge(delta);
    };
    const onMU = e => {
      if (!isDragging.current) return;
      isDragging.current = false;
      el.style.cursor = "grab";
      const moved = Math.hypot(e.clientX - mouseDownPos.current.x, e.clientY - mouseDownPos.current.y);
      if (moved < 6) {
        // Tap/click → open nearest center card
        const center = EXTRA + Math.floor(TOTAL / 2);
        const best = Array.from({ length: CARD_COUNT }, (_, i) => ({
          rel: i - center - currentOffset.current,
          proj: projects[((i % TOTAL) + TOTAL) % TOTAL],
        })).reduce((a, b) => Math.abs(a.rel) < Math.abs(b.rel) ? a : b);
        if (best && Math.abs(best.rel) < 1.5 && best.proj) setPopup(best.proj);
      } else {
        // Stop cleanly at the nearest card — no momentum/overshoot, satisfying
        // "carousel stops at last card" for both drag directions.
        endInteractAndSnap();
      }
    };
    el.addEventListener("mousedown", onMD);
    window.addEventListener("mousemove", onMM);
    window.addEventListener("mouseup",   onMU);
    return () => {
      el.removeEventListener("mousedown", onMD);
      window.removeEventListener("mousemove", onMM);
      window.removeEventListener("mouseup",   onMU);
    };
  }, [nudge, endInteractAndSnap, projects, TOTAL, CARD_COUNT, EXTRA]);

  // ── KEYBOARD ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = e => {
      if (e.key === "ArrowRight") { nudge(1); endInteractAndSnap(); }
      else if (e.key === "ArrowLeft")  { nudge(-1); endInteractAndSnap(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [nudge, endInteractAndSnap]);

  // ── BUILD CARD LIST ────────────────────────────────────────────────────────
  const center = EXTRA + Math.floor(TOTAL / 2);
  const GRADS = [
    "linear-gradient(135deg,#7c6af7,#38bdf8)",
    "linear-gradient(135deg,#c084fc,#7c6af7)",
    "linear-gradient(135deg,#38bdf8,#4ade80)",
    "linear-gradient(135deg,#f97316,#c084fc)",
    "linear-gradient(135deg,#4ade80,#38bdf8)",
    "linear-gradient(135deg,#f43f5e,#7c6af7)",
  ];

  const cards = Array.from({ length: CARD_COUNT }, (_, i) => {
    const rel   = i - center - offset;           // fractional position relative to center
    const dist  = Math.abs(rel);

    // ── Horizontal position only ──────────────────────────────────────────
    const x = rel * gap;

    // ── Wave: each card floats on a sine wave with its own phase ──────────
    // waveT is real time in seconds
    const phase = i * WAVE_PHASE;
    const y = Math.sin(waveT * WAVE_SPEED + phase) * WAVE_AMP;

    // ── Depth cue: cards further away scale down slightly ─────────────────
    const scale  = Math.max(0.55, 1 - dist * 0.12);

    // ── Brightness: centre is full, fade as distance increases ────────────
    const brightness = Math.max(0.2, 1 - dist * 0.09);

    // ── Tilt: cards left of centre lean right, right of centre lean left ─
    const rotY = rel * -12;   // degrees

    const transform = `translateX(${x}px) translateY(${y}px) scale(${scale}) rotateY(${rotY}deg)`;
    const isCenter  = dist < 0.55;
    const proj      = projects[((i % TOTAL) + TOTAL) % TOTAL];
    const label     = String(((i % TOTAL) + TOTAL) % TOTAL).padStart(2, "0");
    return { i, transform, brightness, isCenter, proj, label, dist };
  });

  return (
    <>
      <div
        ref={containerRef}
        style={{
          width:"100%", height:isMobile?"85vh":"100vh", background:"#000",
          overflow:"hidden", position:"relative",
          cursor:"grab", userSelect:"none",
          // CRITICAL: do NOT set touchAction:"none" — let vertical scroll pass through
          touchAction:"pan-y",
        }}
      >
        {/* Top-left title */}
        <div style={{position:"absolute",zIndex:50,top:isMobile?"6vw":"3vw",left:isMobile?"5vw":"3vw",fontFamily:"system-ui,sans-serif",pointerEvents:"none"}}>
          <div style={{color:"#fff",lineHeight:.9,fontWeight:300,fontSize:isMobile?"14px":"clamp(16px,2.8vw,44px)",letterSpacing:"-.02em",marginLeft:isMobile?"3vw":"2.5vw",opacity:.5}}>MY</div>
          <div style={{color:"#fff",lineHeight:.9,fontWeight:500,fontSize:isMobile?"30px":"clamp(22px,4vw,58px)",letterSpacing:"-.02em"}}>
            PROJECTS
            <sup style={{fontSize:".35em",marginLeft:4,position:"relative",top:".65em",verticalAlign:"top",fontWeight:600}}>({projects.length})</sup>
          </div>
        </div>

        {/* Bottom hint — stacked smaller on mobile so it doesn't crowd the edge */}
        <div style={{position:"absolute",zIndex:50,bottom:isMobile?"4vw":"3vw",right:isMobile?"5vw":"3vw",fontFamily:"monospace",fontSize:isMobile?8.5:10,letterSpacing:".06em",color:"rgba(255,255,255,.5)",textTransform:"uppercase",pointerEvents:"none",textAlign:"right"}}>
          {isMobile ? "swipe · tap to open" : "← drag / swipe → · tap to open"}
        </div>

        {/* 3D scene — flat perspective (no Z stacking, purely 2D wave) */}
        <div style={{
          position:"relative", width:"100%", height:"100%",
          display:"flex", alignItems:"center", justifyContent:"center",
          perspective:"1200px",
        }}>
          <div style={{position:"relative",transformStyle:"preserve-3d"}}>
            {cards.map(({ i, transform, brightness, isCenter, proj, label, dist }) => (
              <div
                key={i}
                style={{
                  width: cardW, height: cardH,
                  position:"absolute",
                  left: -cardW / 2, top: -cardH / 2,
                  transform,
                  filter:`brightness(${brightness})`,
                  // Smooth the brightness/scale but NOT the wave or position (RAF handles that)
                  transition:"filter .15s ease",
                  zIndex: Math.round(100 - dist * 10),
                  boxShadow:"0 30px 60px -15px rgba(0,0,0,.85)",
                  borderRadius:6,
                  overflow:"hidden",
                  willChange:"transform",
                }}
              >
                {/* Card face */}
                {proj?.thumb
                  ? <img src={proj.thumb} alt={proj?.name} style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}} loading="lazy" />
                  : (
                    <div style={{width:"100%",height:"100%",background:GRADS[i % GRADS.length],display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:isMobile?".5rem":".8rem",padding:"1rem"}}>
                      <span style={{fontSize:isMobile?"2.2rem":"3rem"}}>{proj?.icon || "📁"}</span>
                      <span style={{color:"rgba(255,255,255,.92)",fontWeight:700,fontSize:isMobile?".78rem":".88rem",textAlign:"center",fontFamily:"'Space Grotesk',sans-serif",lineHeight:1.35}}>{proj?.name}</span>
                      <span style={{color:"rgba(255,255,255,.55)",fontSize:isMobile?".62rem":".68rem",letterSpacing:".1em",textTransform:"uppercase"}}>{proj?.tag}</span>
                    </div>
                  )
                }

                {/* "Tap" badge on the front-most card */}
                {isCenter && (
                  <div style={{position:"absolute",bottom:10,left:"50%",transform:"translateX(-50%)",background:"rgba(124,106,247,.88)",color:"#fff",fontSize:isMobile?".6rem":".66rem",padding:isMobile?"3px 10px":"4px 14px",borderRadius:20,fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,whiteSpace:"nowrap",backdropFilter:"blur(6px)",boxShadow:"0 2px 12px rgba(124,106,247,.5)"}}>
                    Tap to view details
                  </div>
                )}

                {/* Index label */}
                <div style={{position:"absolute",top:-22,left:0,fontSize:9,letterSpacing:".06em",color:"rgba(255,255,255,.6)",fontFamily:"monospace"}}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Project detail popup */}
      {popup && <ProjectPopup project={popup} onClose={() => setPopup(null)} />}
    </>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// ── ADMIN PANEL ──────────────────────────────────────────────────────────────
// ════════════════════════════════════════════════════════════════════════════════
const TABS = ["Profile","Skills","Projects","Certifications","Experience","Education","Contact","Resume"];

function fileToBase64(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

function AdminModal({ data, setData, onClose, showToast, onSignOut, userEmail }) {
  const [tab, setTab] = useState("Profile");
  const [lvl, setLvl] = useState(75);
  const [editProjIdx, setEditProjIdx] = useState(null); // which project is being edited in detail

  const gv = id => document.getElementById("a_"+id)?.value?.trim()||"";
  const sv = (id, v) => { const el=document.getElementById("a_"+id); if(el) el.value=v||""; };

  const [saving, setSaving] = useState(false);

  useEffect(()=>{
    sv("name",data.name); sv("role",data.role); sv("desc",data.desc);
    sv("about",data.about); sv("goal",data.goal); sv("resumeUrl",data.resumeUrl||"");
    sv("availabilityText",data.availabilityText||"");
  },[]);

  const commit = async patch => {
    const d = {...data,...patch};
    setData(d); // update UI immediately (optimistic)
    setSaving(true);
    const ok = await saveData(d);
    setSaving(false);
    showToast(ok ? "✅ Saved to database!" : "⚠️ Save failed — check connection");
  };

  // Generic list ops
  const addItem = (key, obj, clearIds) => { commit({[key]:[...data[key],obj]}); clearIds.forEach(id=>sv(id,"")); };
  const removeItem = (key, i) => commit({[key]:data[key].filter((_,x)=>x!==i)});

  // Profile saves
  const saveProfile = () => commit({name:gv("name")||data.name,role:gv("role")||data.role,desc:gv("desc")||data.desc,about:gv("about")||data.about,goal:gv("goal")||data.goal,availabilityText:gv("availabilityText")||data.availabilityText});

  // Profile photo: upload (base64) or remove
  const [photoUploading, setPhotoUploading] = useState(false);
  const uploadPhoto = async (file) => {
    if (!file.type.startsWith("image/")) { showToast("⚠️ Please choose an image file"); return; }
    setPhotoUploading(true);
    try {
      const b64 = await fileToBase64(file);
      await commit({ photo: b64 });
    } finally {
      setPhotoUploading(false);
    }
  };
  const removePhoto = () => commit({ photo: "" });

  const addIC = () => { const l=gv("ic_l"),v=gv("ic_v"); if(!l||!v) return; addItem("infoCards",{label:l,val:v},["ic_l","ic_v"]); };
  const addStat = () => { const n=gv("st_n"),l=gv("st_l"); if(!n||!l) return; addItem("stats",{num:n,label:l},["st_n","st_l"]); };
  const addSocial = () => { const i=gv("sl_i"),u=gv("sl_u"),l=gv("sl_l"); if(!i||!u) return; addItem("socials",{icon:i,url:u,label:l||i},["sl_i","sl_u","sl_l"]); };

  // Skill
  const addSkill = () => { const i=gv("sk_i"),n=gv("sk_n"),d=gv("sk_d"); if(!n) return; addItem("skills",{icon:i||"🔧",name:n,desc:d,level:lvl},["sk_i","sk_n","sk_d"]); };

  // Projects
  const addProj = () => {
    const n=gv("pr_n"),t=gv("pr_t"),d=gv("pr_d"),u=gv("pr_u");
    if(!n) return;
    const np = {id:Date.now(),name:n,tag:t||"Project",desc:d,url:u,thumb:"",screenshots:[],video:""};
    commit({projects:[...data.projects,np]});
    ["pr_n","pr_t","pr_d","pr_u"].forEach(id=>sv(id,""));
  };
  const removeProj = i => { commit({projects:data.projects.filter((_,x)=>x!==i)}); if(editProjIdx===i) setEditProjIdx(null); };

  // Upload thumb for a project
  const uploadThumb = async (projIdx, file) => {
    const b64 = await fileToBase64(file);
    const updated = data.projects.map((p,i)=>i===projIdx?{...p,thumb:b64}:p);
    commit({projects:updated}); showToast("✅ Thumbnail saved!");
  };

  // Add screenshot to a project
  const addScreenshot = async (projIdx, file) => {
    const proj = data.projects[projIdx];
    if (proj.screenshots.length >= 5) { showToast("Max 5 screenshots per project"); return; }
    const b64 = await fileToBase64(file);
    const updated = data.projects.map((p,i)=>i===projIdx?{...p,screenshots:[...p.screenshots,b64]}:p);
    commit({projects:updated}); showToast("✅ Screenshot added!");
  };

  // Add screenshot via URL
  const addScreenshotURL = (projIdx) => {
    const url = prompt("Paste screenshot image URL:");
    if (!url) return;
    const proj = data.projects[projIdx];
    if (proj.screenshots.length >= 5) { showToast("Max 5 screenshots per project"); return; }
    const updated = data.projects.map((p,i)=>i===projIdx?{...p,screenshots:[...p.screenshots,url]}:p);
    commit({projects:updated});
  };

  const removeScreenshot = (projIdx, shotIdx) => {
    const updated = data.projects.map((p,i)=>i===projIdx?{...p,screenshots:p.screenshots.filter((_,x)=>x!==shotIdx)}:p);
    commit({projects:updated});
  };

  // ── VIDEO: duration check + upload/URL/remove ──────────────────────────────
  // Reads a video file/blob just long enough to get its duration metadata,
  // without fully decoding it — works for any browser-playable format.
  const getVideoDuration = (srcOrFile) => new Promise((resolve, reject) => {
    const v = document.createElement("video");
    v.preload = "metadata";
    v.onloadedmetadata = () => { resolve(v.duration); URL.revokeObjectURL?.(v.src); };
    v.onerror = () => reject(new Error("Could not read video metadata"));
    v.src = typeof srcOrFile === "string" ? srcOrFile : URL.createObjectURL(srcOrFile);
  });

  const MAX_VIDEO_SECONDS = 60;

  const addVideoFile = async (projIdx, file) => {
    if (!file.type.startsWith("video/")) { showToast("⚠️ Please choose a video file"); return; }
    try {
      const duration = await getVideoDuration(file);
      if (duration > MAX_VIDEO_SECONDS + 1) { // +1s tolerance for encoding rounding
        showToast(`⚠️ Video is ${Math.round(duration)}s — max ${MAX_VIDEO_SECONDS}s allowed`);
        return;
      }
      const b64 = await fileToBase64(file);
      const updated = data.projects.map((p,i)=>i===projIdx?{...p,video:b64}:p);
      commit({projects:updated}); showToast("✅ Demo video added!");
    } catch (e) {
      showToast("⚠️ Could not read video — try a different file");
    }
  };

  const addVideoURL = async (projIdx) => {
    const url = prompt("Paste video URL (must be a direct video file link, e.g. ending in .mp4):");
    if (!url) return;
    try {
      const duration = await getVideoDuration(url);
      if (duration > MAX_VIDEO_SECONDS + 1) {
        showToast(`⚠️ Video is ${Math.round(duration)}s — max ${MAX_VIDEO_SECONDS}s allowed`);
        return;
      }
      const updated = data.projects.map((p,i)=>i===projIdx?{...p,video:url}:p);
      commit({projects:updated}); showToast("✅ Demo video added!");
    } catch (e) {
      showToast("⚠️ Could not load that video URL — check it's a direct video link");
    }
  };

  const removeVideo = (projIdx) => {
    const updated = data.projects.map((p,i)=>i===projIdx?{...p,video:""}:p);
    commit({projects:updated});
  };

  // Certs
  const addCert = () => { const i=gv("ce_i"),n=gv("ce_n"),is=gv("ce_is"),d=gv("ce_d"); if(!n) return; addItem("certs",{icon:i||"🏆",name:n,issuer:is,date:d},["ce_i","ce_n","ce_is","ce_d"]); };
  // Exp
  const addExp = () => { const r=gv("ex_r"),c=gv("ex_c"),p=gv("ex_p"),t=gv("ex_t")||"Internship",d=gv("ex_d"); if(!r||!c) return; addItem("experience",{role:r,company:c,period:p,type:t,desc:d},["ex_r","ex_c","ex_p","ex_t","ex_d"]); };
  // Edu
  const addEdu = () => { const i=gv("ed_i"),d=gv("ed_d"),p=gv("ed_p"),g=gv("ed_g"),n=gv("ed_n"); if(!i||!d) return; addItem("education",{inst:i,deg:d,period:p,grade:g,note:n},["ed_i","ed_d","ed_p","ed_g","ed_n"]); };
  // Contact
  const addContact = () => { const i=gv("co_i"),l=gv("co_l"),v=gv("co_v"); if(!l||!v) return; addItem("contact",{icon:i||"📌",label:l,val:v},["co_i","co_l","co_v"]); };
  // Resume
  const saveResume = () => commit({resumeUrl:gv("resumeUrl")});

  // Styles
  const S = {
    fg: { marginBottom:".85rem" },
    label: { display:"block",fontSize:".73rem",color:T.mut,marginBottom:".3rem" },
    input: { background:T.bg,border:`1px solid ${T.brd}`,borderRadius:8,padding:".62rem .9rem",color:T.txt,fontFamily:"'Space Grotesk',sans-serif",fontSize:".86rem",width:"100%",outline:"none" },
    row2: { display:"grid",gridTemplateColumns:"1fr 1fr",gap:".8rem" },
    addBtn: { background:`linear-gradient(135deg,${T.acc},${T.acc2})`,color:"#fff",border:"none",borderRadius:8,padding:".58rem 1.2rem",fontSize:".84rem",fontWeight:700,cursor:"pointer",fontFamily:"'Space Grotesk',sans-serif",marginTop:".4rem" },
    saveBtn: { background:`linear-gradient(135deg,${T.acc},${T.acc2})`,color:"#fff",border:"none",borderRadius:12,padding:".85rem",fontSize:".94rem",fontWeight:800,cursor:"pointer",fontFamily:"'Space Grotesk',sans-serif",width:"100%",marginTop:"1.2rem" },
    stitle: { fontFamily:"'Syne',sans-serif",fontSize:".95rem",fontWeight:800,color:T.acc2,margin:"1.2rem 0 .6rem" },
    item: { background:T.bg,border:`1px solid ${T.brd}`,borderRadius:10,padding:".72rem 1rem",display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:".8rem",marginBottom:".55rem",fontSize:".84rem" },
    del: { background:"rgba(239,68,68,.1)",border:"1px solid rgba(239,68,68,.25)",color:"#ef4444",borderRadius:6,padding:".22rem .6rem",fontSize:".7rem",cursor:"pointer",fontFamily:"'Space Grotesk',sans-serif",flexShrink:0 },
    projCard: { background:T.bg,border:`1px solid ${T.brd}`,borderRadius:14,padding:"1rem",marginBottom:"1rem" },
    smallBtn: { background:"rgba(124,106,247,.15)",border:`1px solid ${T.brd}`,color:T.acc2,borderRadius:6,padding:".28rem .7rem",fontSize:".72rem",cursor:"pointer",fontFamily:"'Space Grotesk',sans-serif" },
  };

  const Inp = ({id,ph,type="text",style={}}) => <input id={"a_"+id} type={type} placeholder={ph} style={{...S.input,...style}} />;
  const Ta = ({id,ph,rows=2}) => <textarea id={"a_"+id} placeholder={ph} rows={rows} style={{...S.input,resize:"vertical"}} />;
  const Fg = ({label,children}) => <div style={S.fg}><label style={S.label}>{label}</label>{children}</div>;
  const Row2 = ({children}) => <div style={S.row2}>{children}</div>;
  const AList = ({items,lFn,dFn}) => !items.length ? <p style={{color:T.mut,fontSize:".78rem",margin:".3rem 0"}}>None yet.</p> : items.map((c,i)=>(
    <div key={i} style={S.item}><div style={{flex:1}} dangerouslySetInnerHTML={{__html:lFn(c,i)}} /><button style={S.del} onClick={()=>dFn(i)}>Remove</button></div>
  ));

  return (
    <div onClick={e=>{if(e.target===e.currentTarget)onClose();}} style={{position:"fixed",inset:0,zIndex:300,background:"rgba(0,0,0,.85)",display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem",backdropFilter:"blur(6px)"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:T.s1,border:`1px solid ${T.brd}`,borderRadius:22,width:"100%",maxWidth:840,maxHeight:"90vh",overflow:"hidden",display:"flex",flexDirection:"column",animation:"popIn .24s ease"}}>
        {/* Head */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"1.3rem 1.8rem",borderBottom:`1px solid ${T.brd}`,gap:"1rem",flexWrap:"wrap"}}>
          <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:"1.2rem",fontWeight:800,display:"flex",alignItems:"center",gap:".7rem"}}>
            ⚙ Admin Panel
            {saving && <span style={{fontSize:".7rem",fontWeight:600,color:T.acc2,display:"inline-flex",alignItems:"center",gap:".3rem"}}><span style={{width:6,height:6,borderRadius:"50%",background:T.acc2,display:"inline-block",animation:"pDot 1s infinite"}}/>Saving...</span>}
          </h2>
          <div style={{display:"flex",alignItems:"center",gap:".9rem"}}>
            {userEmail && <span style={{fontSize:".74rem",color:T.mut}}>{userEmail}</span>}
            <button onClick={onSignOut} style={{background:"rgba(239,68,68,.1)",border:"1px solid rgba(239,68,68,.25)",color:"#ef4444",borderRadius:6,padding:".3rem .8rem",fontSize:".72rem",fontWeight:600,cursor:"pointer",fontFamily:"'Space Grotesk',sans-serif"}}>Sign Out</button>
            <button onClick={onClose} style={{background:"none",border:"none",color:T.mut,fontSize:"1.5rem",cursor:"pointer"}}>×</button>
          </div>
        </div>
        {/* Tabs */}
        <div style={{display:"flex",overflowX:"auto",borderBottom:`1px solid ${T.brd}`,flexShrink:0}}>
          {TABS.map(t=><button key={t} onClick={()=>setTab(t)} style={{background:"none",border:"none",padding:".8rem 1.1rem",fontSize:".78rem",fontWeight:700,cursor:"pointer",whiteSpace:"nowrap",borderBottom:tab===t?`2px solid ${T.acc}`:"2px solid transparent",color:tab===t?T.acc:T.mut,fontFamily:"'Space Grotesk',sans-serif",transition:"color .2s"}}>{t}</button>)}
        </div>
        {/* Body */}
        <div style={{overflowY:"auto",padding:"1.6rem 1.8rem",flex:1}}>

          {/* PROFILE */}
          {tab==="Profile" && <>
            <div style={S.stitle}>Hero / Profile</div>
            <Row2><Fg label="Full Name"><Inp id="name" ph="Mufeed T"/></Fg><Fg label="Role / Title"><Inp id="role" ph="Data Analytics & Tech Professional"/></Fg></Row2>
            <Fg label="Hero Description"><Ta id="desc" ph="Short hero intro..." rows={2}/></Fg>
            <Fg label="Availability Badge Text"><Inp id="availabilityText" ph="Available for Internship"/></Fg>
            <Fg label="About Me Paragraph"><Ta id="about" ph="Longer about text..." rows={3}/></Fg>
            <Fg label="Career Objective"><Ta id="goal" ph="Career objective..." rows={2}/></Fg>
            <button style={S.saveBtn} onClick={saveProfile}>💾 Save Profile</button>

            <div style={S.stitle}>Profile Photo</div>
            <div style={{background:T.bg,border:`1px solid ${T.brd}`,borderRadius:12,padding:"1rem 1.2rem"}}>
              <div style={{display:"flex",gap:"1rem",alignItems:"center"}}>
                <div style={{width:72,height:72,borderRadius:"50%",overflow:"hidden",border:`2px solid ${T.brd}`,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",background:T.s2,fontSize:"1.8rem"}}>
                  {data.photo ? <img src={data.photo} alt="profile" style={{width:"100%",height:"100%",objectFit:"cover"}} /> : "🧑‍💻"}
                </div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",gap:".6rem",flexWrap:"wrap",marginBottom:".4rem"}}>
                    <label style={{cursor:"pointer"}}>
                      <span style={S.smallBtn}>{photoUploading ? "Uploading..." : "📁 Upload photo"}</span>
                      <input type="file" accept="image/*" style={{display:"none"}} disabled={photoUploading} onChange={e=>{if(e.target.files[0])uploadPhoto(e.target.files[0]);}} />
                    </label>
                    {data.photo && <button style={S.del} onClick={removePhoto}>Remove photo</button>}
                  </div>
                  <div style={{fontSize:".7rem",color:T.mut}}>Shown inside the hero circle. Falls back to the default emoji if removed. Square images work best.</div>
                </div>
              </div>
            </div>

            <div style={S.stitle}>Info Cards</div>
            <AList items={data.infoCards} lFn={c=>`<b>${c.label}</b>: ${c.val}`} dFn={i=>removeItem("infoCards",i)} />
            <Row2><Fg label="Label"><Inp id="ic_l" ph="Date of Birth"/></Fg><Fg label="Value"><Inp id="ic_v" ph="10 Dec 2006"/></Fg></Row2>
            <button style={S.addBtn} onClick={addIC}>+ Add Card</button>
            <div style={S.stitle}>Stats</div>
            <AList items={data.stats} lFn={c=>`<b>${c.num}</b> – ${c.label}`} dFn={i=>removeItem("stats",i)} />
            <Row2><Fg label="Number"><Inp id="st_n" ph="5+"/></Fg><Fg label="Label"><Inp id="st_l" ph="Dashboards"/></Fg></Row2>
            <button style={S.addBtn} onClick={addStat}>+ Add Stat</button>
            <div style={S.stitle}>Social Links</div>
            <AList items={data.socials} lFn={c=>`${c.icon} ${c.label} – ${c.url}`} dFn={i=>removeItem("socials",i)} />
            <Row2><Fg label="Emoji"><Inp id="sl_i" ph="💼"/></Fg><Fg label="Label"><Inp id="sl_l" ph="LinkedIn"/></Fg></Row2>
            <Fg label="URL"><Inp id="sl_u" ph="https://..."/></Fg>
            <button style={S.addBtn} onClick={addSocial}>+ Add Social</button>
          </>}

          {/* SKILLS */}
          {tab==="Skills" && <>
            <div style={S.stitle}>Add Skill</div>
            <Row2><Fg label="Icon"><Inp id="sk_i" ph="📊"/></Fg><Fg label="Name"><Inp id="sk_n" ph="Excel"/></Fg></Row2>
            <Fg label="Description"><Inp id="sk_d" ph="Formulas, pivot tables..."/></Fg>
            <Fg label={`Proficiency: ${lvl}%`}><input type="range" min={10} max={100} value={lvl} onChange={e=>setLvl(+e.target.value)} style={{accentColor:T.acc,width:"100%",padding:0,border:"none",background:"none",marginTop:".3rem"}}/></Fg>
            <button style={S.addBtn} onClick={addSkill}>+ Add Skill</button>
            <div style={S.stitle}>Current Skills</div>
            <AList items={data.skills} lFn={c=>`${c.icon} <b>${c.name}</b> – ${c.level}%`} dFn={i=>removeItem("skills",i)} />
          </>}

          {/* PROJECTS */}
          {tab==="Projects" && <>
            <div style={S.stitle}>Auto-Scroll Speed</div>
            <div style={{background:T.bg,border:`1px solid ${T.brd}`,borderRadius:12,padding:"1rem 1.2rem",marginBottom:"1rem"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:".5rem"}}>
                <span style={{fontSize:".8rem",color:T.mut}}>Cards per second</span>
                <span style={{fontSize:".9rem",fontWeight:700,color:T.acc}}>{data.autoScrollSpeed === 0 ? "Paused" : `${data.autoScrollSpeed.toFixed(1)} cards/s`}</span>
              </div>
              <input type="range" min={0} max={2} step={0.1}
                value={data.autoScrollSpeed ?? 0.4}
                onChange={e => commit({ autoScrollSpeed: parseFloat(e.target.value) })}
                style={{ accentColor:T.acc, width:"100%", padding:0, border:"none", background:"none" }} />
              <div style={{display:"flex",justifyContent:"space-between",fontSize:".68rem",color:T.mut,marginTop:".3rem"}}>
                <span>Paused</span><span>Slow</span><span>Fast</span>
              </div>
            </div>
            <div style={S.stitle}>Add New Project</div>
            <Row2><Fg label="Name"><Inp id="pr_n" ph="Blinkit Dashboard"/></Fg><Fg label="Tag"><Inp id="pr_t" ph="Power BI"/></Fg></Row2>
            <Fg label="Description"><Ta id="pr_d" ph="Project description..." rows={2}/></Fg>
            <Fg label="GitHub URL"><Inp id="pr_u" ph="https://github.com/..."/></Fg>
            <button style={S.addBtn} onClick={addProj}>+ Add Project</button>

            <div style={S.stitle}>Manage Projects</div>
            {data.projects.length===0 && <p style={{color:T.mut,fontSize:".8rem"}}>No projects yet.</p>}
            {data.projects.map((p,pi)=>(
              <div key={p.id||pi} style={S.projCard}>
                {/* Project header */}
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:".8rem"}}>
                  <div>
                    <div style={{fontWeight:700,fontSize:".9rem"}}>{p.name}</div>
                    <div style={{fontSize:".72rem",color:T.acc2,marginTop:".15rem",display:"flex",alignItems:"center",gap:".5rem"}}>
                      <span>{p.tag}</span>
                      {p.video && <span style={{color:T.mut}}>🎬 Video</span>}
                      {p.screenshots?.length > 0 && <span style={{color:T.mut}}>🖼️ {p.screenshots.length}/5</span>}
                    </div>
                  </div>
                  <div style={{display:"flex",gap:".5rem"}}>
                    <button style={S.smallBtn} onClick={()=>setEditProjIdx(editProjIdx===pi?null:pi)}>{editProjIdx===pi?"▲ Collapse":"▼ Edit Media"}</button>
                    <button style={{...S.del}} onClick={()=>removeProj(pi)}>Remove</button>
                  </div>
                </div>

                {/* Expanded media editor */}
                {editProjIdx===pi && <>
                  {/* Thumbnail */}
                  <div style={{borderTop:`1px solid ${T.brd}`,paddingTop:".8rem",marginBottom:".8rem"}}>
                    <div style={{fontSize:".75rem",color:T.mut,marginBottom:".5rem",fontWeight:600}}>CARD THUMBNAIL</div>
                    <div style={{display:"flex",gap:".8rem",alignItems:"flex-start"}}>
                      {p.thumb
                        ? <img src={p.thumb} alt="thumb" style={{width:80,height:80,objectFit:"cover",borderRadius:8,border:`1px solid ${T.brd}`,flexShrink:0}} />
                        : <div style={{width:80,height:80,background:T.s2,borderRadius:8,border:`1px dashed ${T.brd}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:"1.4rem"}}>🖼️</div>
                      }
                      <div>
                        <label style={{...S.label,cursor:"pointer"}}>
                          <span style={{...S.smallBtn,display:"inline-block",marginBottom:".4rem"}}>📁 Upload thumbnail</span>
                          <input type="file" accept="image/*" style={{display:"none"}} onChange={e=>{if(e.target.files[0])uploadThumb(pi,e.target.files[0]);}} />
                        </label>
                        <div style={{fontSize:".7rem",color:T.mut}}>Shown as 3D card face. Recommended: 320×384px</div>
                        {p.thumb && <button style={{...S.del,marginTop:".4rem",fontSize:".68rem"}} onClick={()=>{ const updated=data.projects.map((pr,i)=>i===pi?{...pr,thumb:""}:pr); commit({projects:updated}); }}>Remove thumbnail</button>}
                      </div>
                    </div>
                  </div>
                  {/* Demo Video */}
                  <div style={{borderTop:`1px solid ${T.brd}`,paddingTop:".8rem",marginBottom:".8rem"}}>
                    <div style={{fontSize:".75rem",color:T.mut,marginBottom:".5rem",fontWeight:600}}>DEMO VIDEO <span style={{opacity:.7}}>(optional, max 60s)</span></div>
                    {p.video ? (
                      <div style={{display:"flex",gap:".8rem",alignItems:"flex-start"}}>
                        <video src={p.video} style={{width:120,height:80,objectFit:"cover",borderRadius:8,border:`1px solid ${T.brd}`,flexShrink:0,background:"#000"}} muted />
                        <div>
                          <div style={{fontSize:".78rem",color:T.acc2,marginBottom:".4rem",fontWeight:600}}>✓ Video attached</div>
                          <div style={{fontSize:".7rem",color:T.mut,marginBottom:".4rem"}}>Shows as the first slide in the project popup, before screenshots.</div>
                          <button style={{...S.del,fontSize:".68rem"}} onClick={()=>removeVideo(pi)}>Remove video</button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div style={{display:"flex",gap:".6rem",flexWrap:"wrap",marginBottom:".4rem"}}>
                          <label style={{cursor:"pointer"}}>
                            <span style={S.smallBtn}>🎬 Upload video</span>
                            <input type="file" accept="video/*" style={{display:"none"}} onChange={e=>{if(e.target.files[0])addVideoFile(pi,e.target.files[0]);}} />
                          </label>
                          <button style={S.smallBtn} onClick={()=>addVideoURL(pi)}>🔗 Add video URL</button>
                        </div>
                        <div style={{fontSize:".7rem",color:T.mut}}>MP4/WebM recommended. Clips longer than 60s will be rejected automatically.</div>
                      </div>
                    )}
                  </div>
                  {/* Screenshots */}
                  <div style={{borderTop:`1px solid ${T.brd}`,paddingTop:".8rem"}}>
                    <div style={{fontSize:".75rem",color:T.mut,marginBottom:".5rem",fontWeight:600}}>PROJECT SCREENSHOTS ({p.screenshots.length}/5)</div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:".6rem",marginBottom:".7rem"}}>
                      {p.screenshots.map((s,si)=>(
                        <div key={si} style={{position:"relative",width:72,height:72}}>
                          <img src={s} alt={`shot-${si}`} style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:8,border:`1px solid ${T.brd}`}} />
                          <button onClick={()=>removeScreenshot(pi,si)} style={{position:"absolute",top:-6,right:-6,width:18,height:18,borderRadius:"50%",background:"#ef4444",border:"none",color:"#fff",fontSize:"10px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",lineHeight:1}}>×</button>
                        </div>
                      ))}
                    </div>
                    {p.screenshots.length < 5 && (
                      <div style={{display:"flex",gap:".6rem",flexWrap:"wrap"}}>
                        <label style={{cursor:"pointer"}}>
                          <span style={S.smallBtn}>📁 Upload image</span>
                          <input type="file" accept="image/*" style={{display:"none"}} onChange={e=>{if(e.target.files[0])addScreenshot(pi,e.target.files[0]);}} />
                        </label>
                        <button style={S.smallBtn} onClick={()=>addScreenshotURL(pi)}>🔗 Add URL</button>
                      </div>
                    )}
                  </div>
                </>}
              </div>
            ))}
          </>}

          {/* CERTIFICATIONS */}
          {tab==="Certifications" && <>
            <div style={S.stitle}>Add Certification</div>
            <Row2><Fg label="Emoji"><Inp id="ce_i" ph="🏆"/></Fg><Fg label="Name"><Inp id="ce_n" ph="Certificate Name"/></Fg></Row2>
            <Row2><Fg label="Issuer"><Inp id="ce_is" ph="Forage"/></Fg><Fg label="Date"><Inp id="ce_d" ph="25 May 2026"/></Fg></Row2>
            <button style={S.addBtn} onClick={addCert}>+ Add Certification</button>
            <div style={S.stitle}>Current Certifications</div>
            <AList items={data.certs} lFn={c=>`${c.icon} <b>${c.name}</b> – ${c.issuer}`} dFn={i=>removeItem("certs",i)} />
          </>}

          {/* EXPERIENCE */}
          {tab==="Experience" && <>
            <div style={S.stitle}>Add Work Experience</div>
            <Row2><Fg label="Role"><Inp id="ex_r" ph="Data Analyst Intern"/></Fg><Fg label="Company"><Inp id="ex_c" ph="Company Name"/></Fg></Row2>
            <Row2><Fg label="Period"><Inp id="ex_p" ph="Jan 2025 – Jun 2025"/></Fg><Fg label="Type"><Inp id="ex_t" ph="Internship"/></Fg></Row2>
            <Fg label="Description"><Ta id="ex_d" ph="Key responsibilities..." rows={2}/></Fg>
            <button style={S.addBtn} onClick={addExp}>+ Add Experience</button>
            <div style={S.stitle}>Current Experience</div>
            <AList items={data.experience} lFn={c=>`<b>${c.role}</b> @ ${c.company} · ${c.period}`} dFn={i=>removeItem("experience",i)} />
          </>}

          {/* EDUCATION */}
          {tab==="Education" && <>
            <div style={S.stitle}>Add Education</div>
            <Row2><Fg label="Institution"><Inp id="ed_i" ph="University Name"/></Fg><Fg label="Degree"><Inp id="ed_d" ph="B.Tech CSE"/></Fg></Row2>
            <Row2><Fg label="Period"><Inp id="ed_p" ph="2024 – 2028"/></Fg><Fg label="Grade"><Inp id="ed_g" ph="1st Class"/></Fg></Row2>
            <Fg label="Notes (optional)"><Inp id="ed_n" ph="Currently Enrolled..."/></Fg>
            <button style={S.addBtn} onClick={addEdu}>+ Add Education</button>
            <div style={S.stitle}>Current Education</div>
            <AList items={data.education} lFn={c=>`<b>${c.inst}</b> – ${c.deg} (${c.period})`} dFn={i=>removeItem("education",i)} />
          </>}

          {/* CONTACT */}
          {tab==="Contact" && <>
            <div style={S.stitle}>Contact Details</div>
            <AList items={data.contact} lFn={c=>`${c.icon} <b>${c.label}</b>: ${c.val}`} dFn={i=>removeItem("contact",i)} />
            <Row2><Fg label="Emoji"><Inp id="co_i" ph="✉️"/></Fg><Fg label="Label"><Inp id="co_l" ph="Email"/></Fg></Row2>
            <Fg label="Value"><Inp id="co_v" ph="itz.me.mufeed@gmail.com"/></Fg>
            <button style={S.addBtn} onClick={addContact}>+ Add Contact</button>
          </>}

          {/* RESUME */}
          {tab==="Resume" && <>
            <div style={S.stitle}>Resume Upload</div>
            <p style={{color:T.mut,fontSize:".84rem",marginBottom:"1.2rem"}}>Paste a Google Drive / Dropbox share link, or upload a PDF directly.</p>
            <Fg label="Resume URL (Google Drive / Dropbox)"><Inp id="resumeUrl" ph="https://drive.google.com/file/d/..."/></Fg>
            <Fg label="Or Upload PDF">
              <input type="file" accept=".pdf" onChange={async e=>{
                const f=e.target.files[0]; if(!f) return;
                const url=URL.createObjectURL(f);
                document.getElementById("a_resumeUrl").value="";
                commit({resumeUrl:url}); showToast("✅ PDF uploaded!");
              }} style={{color:T.txt,fontSize:".85rem",border:"none",background:"none",padding:0}} />
            </Fg>
            <button style={S.saveBtn} onClick={saveResume}>💾 Save Resume Link</button>
          </>}

        </div>
      </div>
    </div>
  );
}

// ── LOGIN MODAL ───────────────────────────────────────────────────────────────
// ── LOGIN MODAL (Supabase Auth) ───────────────────────────────────────────────
function LoginModal({ onSuccess, onClose }) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!email || !pw) { setErr("Enter both email and password."); return; }
    setLoading(true);
    setErr("");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: pw });
    setLoading(false);
    if (error) {
      setErr("Invalid email or password.");
      return;
    }
    if (data?.session) onSuccess();
  };

  return (
    <div onClick={e=>{if(e.target===e.currentTarget)onClose();}} style={{position:"fixed",inset:0,zIndex:300,background:"rgba(0,0,0,.85)",display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem",backdropFilter:"blur(6px)"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:T.s1,border:`1px solid ${T.brd}`,borderRadius:22,padding:"2.5rem",width:"100%",maxWidth:380,animation:"popIn .22s ease"}}>
        <h2 style={{fontFamily:"'Syne',sans-serif",textAlign:"center",marginBottom:"1.4rem",fontSize:"1.35rem",fontWeight:800}}>🔐 Admin Login</h2>
        <div style={{marginBottom:"1rem"}}>
          <label style={{display:"block",fontSize:".78rem",color:T.mut,marginBottom:".35rem"}}>Email</label>
          <input type="email" value={email} onChange={e=>{setEmail(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&submit()} placeholder="you@example.com" autoComplete="username"
            style={{width:"100%",background:T.bg,border:`1px solid ${err?"#ef4444":T.brd}`,borderRadius:8,padding:".75rem 1rem",color:T.txt,fontFamily:"'Space Grotesk',sans-serif",fontSize:".9rem",outline:"none"}} />
        </div>
        <div style={{marginBottom:"1rem"}}>
          <label style={{display:"block",fontSize:".78rem",color:T.mut,marginBottom:".35rem"}}>Password</label>
          <input type="password" value={pw} onChange={e=>{setPw(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&submit()} placeholder="Enter your password" autoComplete="current-password"
            style={{width:"100%",background:T.bg,border:`1px solid ${err?"#ef4444":T.brd}`,borderRadius:8,padding:".75rem 1rem",color:T.txt,fontFamily:"'Space Grotesk',sans-serif",fontSize:".9rem",outline:"none"}} />
          {err && <p style={{color:"#ef4444",fontSize:".78rem",marginTop:".4rem"}}>{err}</p>}
        </div>
        <button onClick={submit} disabled={loading} style={{width:"100%",background:`linear-gradient(135deg,${T.acc},${T.acc2})`,color:"#fff",border:"none",borderRadius:10,padding:".8rem",fontWeight:700,fontSize:".95rem",cursor:loading?"default":"pointer",fontFamily:"'Space Grotesk',sans-serif",marginBottom:".75rem",opacity:loading?.7:1}}>
          {loading ? "Logging in..." : "Login"}
        </button>
        <button onClick={onClose} style={{width:"100%",background:"none",border:`1px solid ${T.brd}`,borderRadius:10,padding:".75rem",color:T.mut,cursor:"pointer",fontFamily:"'Space Grotesk',sans-serif",fontSize:".9rem"}}>Cancel</button>
      </div>
    </div>
  );
}


// ── TOAST ─────────────────────────────────────────────────────────────────────
function Toast({ msg, show }) {
  return (
    <div style={{position:"fixed",bottom:"5rem",left:"50%",transform:"translateX(-50%)",background:T.s1,border:`1px solid ${T.acc}`,color:T.txt,padding:".7rem 1.4rem",borderRadius:50,fontSize:".85rem",zIndex:400,opacity:show?1:0,transition:"opacity .3s",pointerEvents:"none",whiteSpace:"nowrap"}}>
      {msg}
    </div>
  );
}

// ── BACK TO TOP ───────────────────────────────────────────────────────────────
function BackTop() {
  const [vis, setVis] = useState(false);
  useEffect(()=>{ const h=()=>setVis(scrollY>400); window.addEventListener("scroll",h); return()=>window.removeEventListener("scroll",h); },[]);
  if (!vis) return null;
  return <button onClick={()=>scrollTo({top:0,behavior:"smooth"})} style={{position:"fixed",bottom:"2rem",right:"2rem",zIndex:99,width:44,height:44,borderRadius:"50%",background:`linear-gradient(135deg,${T.acc},${T.acc2})`,color:"#fff",fontSize:"1.1rem",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>↑</button>;
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [data, setData] = useState(null); // null = still loading from Supabase
  const [loadError, setLoadError] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [session, setSession] = useState(null); // Supabase Auth session, null = signed out
  const [toast, setToast] = useState({ msg:"", show:false });
  const typerRef = useRef(null);
  const isMobile = useIsMobile();
  const isSmall  = useIsSmall();

  const showToast = useCallback(msg => {
    setToast({ msg, show:true });
    setTimeout(() => setToast(t=>({...t,show:false})), 2500);
  }, []);

  // Track Supabase Auth session — fires on load and on every sign-in/out
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setShowAdmin(false);
    showToast("Signed out");
  };

  // Load portfolio data from Supabase on mount
  useEffect(() => {
    let mounted = true;
    loadData().then(d => {
      if (mounted) setData(d);
    }).catch(() => {
      if (mounted) { setData(JSON.parse(JSON.stringify(DEFAULT))); setLoadError(true); }
    });
    return () => { mounted = false; };
  }, []);

  // Fonts
  useEffect(()=>{
    const l=document.createElement("link"); l.rel="stylesheet";
    l.href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Syne:wght@700;800;900&display=swap";
    document.head.appendChild(l);
    document.body.style.cssText="background:#050509;color:#e8e6ff;font-family:'Space Grotesk',sans-serif;margin:0;overflow-x:hidden";
    const style=document.createElement("style");
    style.textContent="@keyframes popIn{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:scale(1)}} @keyframes slideUp{from{opacity:0;transform:translateY(100%)}to{opacity:1;transform:translateY(0)}} @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}} @keyframes blink{0%,100%{opacity:1}50%{opacity:0}} @keyframes pDot{0%,100%{opacity:1}50%{opacity:.3}} @keyframes sCW{to{transform:rotate(360deg)}} @keyframes sCCW{to{transform:rotate(-360deg)}} @keyframes sBounce{0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(8px)}} ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:#7c6af7;border-radius:4px} html{-webkit-text-size-adjust:100%;touch-action:manipulation;} body{overscroll-behavior-y:none;}";
    document.head.appendChild(style);
  },[]);

  useEffect(()=>{ if(data) document.title = data.name + " | Portfolio"; },[data?.name]);

  // Typewriter
  useEffect(()=>{
    if (!data) return;
    clearInterval(typerRef.current); let i=0; const el=document.getElementById("typed"); if(!el) return;
    el.textContent="";
    typerRef.current=setInterval(()=>{ if(i>=data.role.length){clearInterval(typerRef.current);return;} el.textContent=data.role.slice(0,++i); },44);
    return()=>clearInterval(typerRef.current);
  },[data?.role]);

  const go = id => document.getElementById(id)?.scrollIntoView({behavior:"smooth"});

  // Show a loading screen while fetching from Supabase
  if (!data) {
    return (
      <div style={{background:T.bg,color:T.txt,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:"1rem",fontFamily:"'Space Grotesk',sans-serif"}}>
        <div style={{width:40,height:40,borderRadius:"50%",border:`3px solid ${T.brd}`,borderTopColor:T.acc,animation:"sCW 0.8s linear infinite"}}/>
        <div style={{color:T.mut,fontSize:".9rem"}}>Loading portfolio...</div>
      </div>
    );
  }

  // Card styles
  const card = (extra={}) => ({background:T.s1,border:`1px solid ${T.brd}`,borderRadius:16,padding:"1.5rem",transition:"border-color .2s,transform .2s,box-shadow .2s",...extra});
  const gradTxt = {background:`linear-gradient(135deg,${T.acc},${T.acc2})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"};

  return (
    <div style={{background:T.bg,color:T.txt,minHeight:"100vh"}}>
      <Particles />
      <Nav onAdmin={()=>session ? setShowAdmin(true) : setShowLogin(true)} name={data.name} isAdmin={!!session} />

      {/* ── HERO ── */}
      <section id="home" style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:"8rem 2rem 4rem",position:"relative",zIndex:1}}>
        <div style={{display:"inline-flex",alignItems:"center",gap:".5rem",background:"rgba(124,106,247,.1)",border:`1px solid ${T.brd}`,borderRadius:50,padding:".32rem 1rem",fontSize:".77rem",color:T.acc2,marginBottom:"2rem",animation:"fadeUp .6s .1s both"}}>
          <span style={{width:8,height:8,borderRadius:"50%",background:"#4ade80",display:"inline-block",animation:"pDot 2s infinite"}}/>
          {data.availabilityText || "Available for Internship"}
        </div>
        <div style={{position:"relative",width:isMobile?140:185,height:isMobile?140:185,margin:"0 auto 1.6rem",animation:"fadeUp .6s .2s both"}}>
          <div style={{position:"absolute",inset:0,borderRadius:"50%",border:"2px solid transparent",borderTopColor:T.acc,borderRightColor:T.acc2,animation:"sCW 4s linear infinite"}}/>
          <div style={{position:"absolute",inset:10,borderRadius:"50%",border:"1.5px solid transparent",borderBottomColor:T.acc3,animation:"sCCW 7s linear infinite"}}/>
          <div style={{position:"absolute",inset:isMobile?12:16,borderRadius:"50%",overflow:"hidden",border:`3px solid ${T.acc}`,boxShadow:`0 0 40px ${T.glow}`,background:`linear-gradient(135deg,${T.s2},${T.bg})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:isMobile?"2.6rem":"3.5rem"}}>
            {data.photo
              ? <img src={data.photo} alt={data.name} style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}} />
              : "🧑‍💻"}
          </div>
        </div>
        <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:"clamp(2rem,8vw,4rem)",fontWeight:900,lineHeight:1.1,margin:"0 0 .5rem",animation:"fadeUp .6s .3s both",padding:isMobile?"0 .5rem":0}}>
          <ScrambleText key={"greet"} text="Hi, I'm " speed={26} delay={0.1} style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:"inherit",color:T.txt}} />
          <ScrambleText key={data.name} text={data.name} speed={26} delay={0.3} style={{...gradTxt,fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:"inherit"}} />
        </h1>
        <div style={{fontSize:isMobile?".88rem":"1.02rem",color:T.acc3,fontWeight:500,marginBottom:"1rem",minHeight:"1.5em",animation:"fadeUp .6s .4s both",padding:isMobile?"0 1rem":0}}>
          <span id="typed"/><span style={{animation:"blink .8s infinite",display:"inline-block"}}>|</span>
        </div>
        <p style={{maxWidth:560,color:T.mut,fontSize:isMobile?".88rem":".97rem",margin:"0 auto 2rem",lineHeight:1.75,animation:"fadeUp .6s .5s both",padding:isMobile?"0 1.2rem":0}}>{data.desc}</p>
        <div style={{display:"flex",gap:isMobile?".7rem":"1rem",justifyContent:"center",flexWrap:"wrap",animation:"fadeUp .6s .6s both",width:isMobile?"100%":"auto",padding:isMobile?"0 1.2rem":0}}>
          <a href={data.resumeUrl||"#"} target={data.resumeUrl?"_blank":"_self"} rel="noreferrer" onClick={!data.resumeUrl?e=>{e.preventDefault();alert("No resume yet. Use Admin → Resume tab.");}:undefined}
            style={{background:`linear-gradient(135deg,${T.acc},${T.acc2})`,color:"#fff",borderRadius:12,padding:isMobile?".75rem 1.4rem":".8rem 2rem",fontWeight:700,textDecoration:"none",fontFamily:"'Space Grotesk',sans-serif",fontSize:isMobile?".85rem":".95rem",display:"inline-flex",alignItems:"center",justifyContent:"center",gap:".4rem",flex:isMobile?"1 1 auto":"none",minWidth:isMobile?140:"auto"}}>
            ⬇ Download Resume
          </a>
          <button onClick={()=>go("contact")} style={{background:"transparent",color:T.txt,border:`1px solid ${T.brd}`,borderRadius:12,padding:isMobile?".75rem 1.4rem":".8rem 2rem",fontWeight:700,cursor:"pointer",fontFamily:"'Space Grotesk',sans-serif",fontSize:isMobile?".85rem":".95rem",flex:isMobile?"1 1 auto":"none",minWidth:isMobile?140:"auto"}}>✉ Hire / Contact Me</button>
        </div>
        <div style={{display:"flex",gap:".8rem",justifyContent:"center",marginTop:"1.8rem",animation:"fadeUp .6s .7s both"}}>
          {data.socials.map((s,i)=>(
            <a key={i} href={s.url} target="_blank" rel="noreferrer" title={s.label}
              style={{width:isMobile?38:42,height:isMobile?38:42,borderRadius:"50%",background:T.s1,border:`1px solid ${T.brd}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:isMobile?"1rem":"1.1rem",textDecoration:"none",transition:"border-color .2s,transform .2s"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=T.acc;e.currentTarget.style.transform="translateY(-3px)";}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=T.brd;e.currentTarget.style.transform="";}}>
              {s.icon}
            </a>
          ))}
        </div>
        <div style={{display:isMobile?"grid":"flex",gridTemplateColumns:isMobile?"repeat(2,1fr)":undefined,gap:isMobile?".8rem":"1.1rem",justifyContent:"center",marginTop:"2.6rem",flexWrap:"wrap",animation:"fadeUp .6s .8s both",width:isMobile?"100%":"auto",padding:isMobile?"0 1.2rem":0,maxWidth:isMobile?340:"none",marginLeft:isMobile?"auto":0,marginRight:isMobile?"auto":0}}>
          {data.stats.map((s,i)=>(
            <div key={i} style={card({padding:isMobile?".85rem 1rem":"1rem 1.5rem",textAlign:"center",minWidth:isMobile?"auto":110})} onMouseEnter={e=>{e.currentTarget.style.borderColor=T.acc;e.currentTarget.style.transform="translateY(-4px)";}} onMouseLeave={e=>{e.currentTarget.style.borderColor=T.brd;e.currentTarget.style.transform="";}}>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:isMobile?"1.5rem":"1.85rem",fontWeight:900,...gradTxt}}>{s.num}</div>
              <div style={{fontSize:isMobile?".68rem":".72rem",color:T.mut,marginTop:".15rem"}}>{s.label}</div>
            </div>
          ))}
        </div>
        {!isMobile && <div onClick={()=>go("about")} style={{position:"absolute",bottom:"2.2rem",left:"50%",animation:"sBounce 2s infinite",color:T.mut,fontSize:"1.3rem",cursor:"pointer"}}>↓</div>}
      </section>

      {/* ── ABOUT ── */}
      <section id="about" style={{padding:isMobile?"4rem 0":"6.5rem 0",position:"relative",zIndex:1}}>
        <div style={{maxWidth:1100,margin:"0 auto",padding:isMobile?"0 1.2rem":"0 2rem"}}>
          <Reveal><SH eye="Who I Am" title="About" hi="Me" /></Reveal>
          <Reveal style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:isMobile?"2rem":"3.5rem",alignItems:"start"}}>
            <div>
              <p style={{color:T.mut,lineHeight:1.8,marginBottom:"1.4rem",fontSize:isMobile?".9rem":".96rem"}}>{data.about}</p>
              <div style={{display:"grid",gridTemplateColumns:isSmall?"1fr":"1fr 1fr",gap:".75rem"}}>
                {data.infoCards.map((c,i)=>(
                  <div key={i} style={card({padding:".8rem 1rem"})} onMouseEnter={e=>e.currentTarget.style.borderColor=T.acc} onMouseLeave={e=>e.currentTarget.style.borderColor=T.brd}>
                    <div style={{fontSize:".67rem",color:T.mut,textTransform:"uppercase",letterSpacing:".07em"}}>{c.label}</div>
                    <div style={{fontSize:".87rem",fontWeight:600,marginTop:".2rem",wordBreak:"break-word"}}>{c.val}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={card({padding:isMobile?"1.4rem":"2rem"})}>
              <h3 style={{fontFamily:"'Syne',sans-serif",fontSize:"1.25rem",fontWeight:800,marginBottom:"1rem",...gradTxt}}>Career Objective</h3>
              <p style={{color:T.mut,fontSize:".93rem",lineHeight:1.8}}>{data.goal}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section id="skills" style={{padding:isMobile?"4rem 0":"6.5rem 0",background:T.s1,position:"relative",zIndex:1}}>
        <div style={{maxWidth:1100,margin:"0 auto",padding:isMobile?"0 1.2rem":"0 2rem"}}>
          <Reveal><SH eye="What I Know" title="Technical" hi="Skills" /></Reveal>
          <Reveal style={{display:"grid",gridTemplateColumns:isSmall?"1fr":"repeat(auto-fill,minmax(230px,1fr))",gap:"1.4rem"}}>
            {data.skills.map((s,i)=>(
              <div key={i} style={card()} onMouseEnter={e=>{e.currentTarget.style.borderColor=T.acc;e.currentTarget.style.transform="translateY(-5px)";e.currentTarget.style.boxShadow=`0 12px 30px ${T.glow}`;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=T.brd;e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="";}}>
                <div style={{fontSize:"2rem",marginBottom:".6rem"}}>{s.icon}</div>
                <div style={{fontWeight:700,fontSize:"1.02rem",marginBottom:".28rem"}}>{s.name}</div>
                <div style={{fontSize:".78rem",color:T.mut}}>{s.desc}</div>
                <SkillBar level={s.level} />
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ── PROJECTS (3D COLLECTION SURFER) ── */}
      <section id="projects" style={{position:"relative",zIndex:1}}>
        <ProjectsSurfer projects={data.projects} autoScrollSpeed={data.autoScrollSpeed ?? 0.4} />
      </section>

      {/* ── CERTIFICATIONS ── */}
      <section id="certifications" style={{padding:isMobile?"4rem 0":"6.5rem 0",background:T.s1,position:"relative",zIndex:1}}>
        <div style={{maxWidth:1100,margin:"0 auto",padding:isMobile?"0 1.2rem":"0 2rem"}}>
          <Reveal><SH eye="Achievements" title="My" hi="Certifications" /></Reveal>
          <Reveal style={{display:"grid",gridTemplateColumns:isSmall?"1fr":"repeat(auto-fill,minmax(260px,1fr))",gap:"1.4rem"}}>
            {data.certs.map((c,i)=>(
              <div key={i} style={{background:T.bg,border:`1px solid ${T.brd}`,borderRadius:14,padding:"1.4rem",position:"relative",overflow:"hidden",transition:"border-color .2s,transform .2s"}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=T.acc;e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.querySelector(".cside").style.transform="scaleY(1)";}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=T.brd;e.currentTarget.style.transform="";e.currentTarget.querySelector(".cside").style.transform="scaleY(0)";}}>
                <div className="cside" style={{position:"absolute",top:0,left:0,width:4,height:"100%",background:`linear-gradient(to bottom,${T.acc},${T.acc2})`,transform:"scaleY(0)",transformOrigin:"top",transition:"transform .4s ease"}}/>
                <div style={{fontSize:"2rem",marginBottom:".65rem"}}>{c.icon}</div>
                <div style={{fontWeight:700,fontSize:".92rem",marginBottom:".28rem"}}>{c.name}</div>
                <div style={{fontSize:".76rem",color:T.acc2,marginBottom:".25rem"}}>{c.issuer}</div>
                <div style={{fontSize:".72rem",color:T.mut}}>{c.date}</div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ── EXPERIENCE ── */}
      <section id="experience" style={{padding:isMobile?"4rem 0":"6.5rem 0",position:"relative",zIndex:1}}>
        <div style={{maxWidth:800,margin:"0 auto",padding:isMobile?"0 1.2rem":"0 2rem"}}>
          <Reveal><SH eye="Work History" title="Work" hi="Experience" /></Reveal>
          <Reveal style={{position:"relative",paddingLeft:isMobile?"1.5rem":"2.1rem"}}>
            <div style={{position:"absolute",left:6,top:0,bottom:0,width:2,background:`linear-gradient(to bottom,${T.acc},transparent)`}}/>
            {data.experience.length
              ? data.experience.map((e,i)=>(
                <div key={i} style={{position:"relative",marginBottom:"2.2rem"}}>
                  <div style={{position:"absolute",left:isMobile?"-1.35rem":"-1.85rem",top:8,width:13,height:13,borderRadius:"50%",background:T.acc,border:`3px solid ${T.bg}`,boxShadow:`0 0 12px ${T.glow}`}}/>
                  <div style={card()} onMouseEnter={el=>el.currentTarget.style.borderColor=T.acc} onMouseLeave={el=>el.currentTarget.style.borderColor=T.brd}>
                    <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:"1.02rem"}}>{e.role}</div>
                    <div style={{color:T.acc2,fontSize:".87rem",margin:".2rem 0"}}>{e.company} · {e.type}</div>
                    <div style={{fontSize:".74rem",color:T.mut,marginBottom:".7rem"}}>{e.period}</div>
                    {e.desc && <div style={{fontSize:".84rem",color:T.mut}}>{e.desc}</div>}
                  </div>
                </div>
              ))
              : <p style={{color:T.mut,paddingLeft:".5rem"}}>No experience added yet. Use Admin → Experience tab.</p>}
          </Reveal>
        </div>
      </section>

      {/* ── EDUCATION ── */}
      <section id="education" style={{padding:isMobile?"4rem 0":"6.5rem 0",background:T.s1,position:"relative",zIndex:1}}>
        <div style={{maxWidth:800,margin:"0 auto",padding:isMobile?"0 1.2rem":"0 2rem"}}>
          <Reveal><SH eye="Academic Journey" title="My" hi="Education" /></Reveal>
          <Reveal style={{position:"relative",paddingLeft:isMobile?"1.5rem":"2.1rem"}}>
            <div style={{position:"absolute",left:6,top:0,bottom:0,width:2,background:`linear-gradient(to bottom,${T.acc},transparent)`}}/>
            {data.education.map((e,i)=>(
              <div key={i} style={{position:"relative",marginBottom:"2.2rem"}}>
                <div style={{position:"absolute",left:isMobile?"-1.35rem":"-1.85rem",top:8,width:13,height:13,borderRadius:"50%",background:T.acc,border:`3px solid ${T.s1}`,boxShadow:`0 0 12px ${T.glow}`}}/>
                <div style={card()} onMouseEnter={el=>el.currentTarget.style.borderColor=T.acc} onMouseLeave={el=>el.currentTarget.style.borderColor=T.brd}>
                  <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:"1.02rem"}}>{e.inst}</div>
                  <div style={{color:T.acc2,fontSize:".87rem",margin:".2rem 0"}}>{e.deg}</div>
                  <div style={{fontSize:".74rem",color:T.mut,marginBottom:e.note?".5rem":0}}>{e.period} · {e.grade}</div>
                  {e.note && e.note.length > 3 && <div style={{fontSize:".82rem",color:T.mut}}>{e.note}</div>}
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" style={{padding:isMobile?"4rem 0":"6.5rem 0",position:"relative",zIndex:1}}>
        <div style={{maxWidth:1100,margin:"0 auto",padding:isMobile?"0 1.2rem":"0 2rem"}}>
          <Reveal><SH eye="Get In Touch" title="Let's" hi="Connect" /></Reveal>
          <Reveal style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1.5fr",gap:isMobile?"2rem":"4rem",alignItems:"start"}}>
            <ul style={{listStyle:"none",padding:0,margin:0}}>
              {data.contact.map((c,i)=>(
                <li key={i} style={{display:"flex",alignItems:"center",gap:"1rem",background:T.s1,border:`1px solid ${T.brd}`,borderRadius:12,padding:"1rem 1.2rem",marginBottom:".9rem",transition:"border-color .2s,transform .2s"}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=T.acc;e.currentTarget.style.transform="translateX(4px)";}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor=T.brd;e.currentTarget.style.transform="";}}>
                  <span style={{fontSize:"1.3rem"}}>{c.icon}</span>
                  <span style={{fontSize:".88rem",wordBreak:"break-word"}}><strong>{c.label}:</strong> {c.val}</span>
                </li>
              ))}
            </ul>
            <div style={card({padding:isMobile?"1.4rem":"2rem"})}>
              <h3 style={{fontFamily:"'Syne',sans-serif",fontWeight:700,marginBottom:"1.4rem",fontSize:"1.1rem"}}>Send a Message</h3>
              {["Mobile Number","Subject"].map(l=>(
                <div key={l} style={{marginBottom:"1rem"}}>
                  <label style={{display:"block",fontSize:".78rem",color:T.mut,marginBottom:".35rem"}}>{l}</label>
                  <input placeholder={l==="Mobile Number"?"+91 XXXXX XXXXX":"How can I help you?"} style={{width:"100%",background:T.bg,border:`1px solid ${T.brd}`,borderRadius:8,padding:".7rem 1rem",color:T.txt,fontFamily:"'Space Grotesk',sans-serif",fontSize:".88rem",outline:"none"}} />
                </div>
              ))}
              <div style={{marginBottom:"1rem"}}>
                <label style={{display:"block",fontSize:".78rem",color:T.mut,marginBottom:".35rem"}}>Message</label>
                <textarea rows={4} placeholder="Write your message here..." style={{width:"100%",background:T.bg,border:`1px solid ${T.brd}`,borderRadius:8,padding:".7rem 1rem",color:T.txt,fontFamily:"'Space Grotesk',sans-serif",fontSize:".88rem",outline:"none",resize:"vertical"}} />
              </div>
              <button onClick={()=>alert("Message noted! Please contact via email directly.")} style={{width:"100%",background:`linear-gradient(135deg,${T.acc},${T.acc2})`,color:"#fff",border:"none",borderRadius:10,padding:".85rem",fontWeight:700,fontSize:".95rem",cursor:"pointer",fontFamily:"'Space Grotesk',sans-serif"}}>✈ Send Message</button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{background:T.s1,borderTop:`1px solid ${T.brd}`,textAlign:"center",padding:"2rem",color:T.mut,fontSize:".84rem",position:"relative",zIndex:1}}>
        <div style={{fontFamily:"'Syne',sans-serif",fontSize:"1.45rem",fontWeight:900,...gradTxt,marginBottom:".4rem"}}>{(()=>{ const p=(data.name||"").trim().split(/\s+/).filter(Boolean); const ini=p.length>=2?[p[0][0],p[p.length-1][0]]:[(p[0]||"?")[0],(p[0]||"?")[1]||""]; return `${ini[0]}.${ini[1]}`; })()}</div>
        <p>Designed & Built by <strong style={{color:T.txt}}>{data.name}</strong> &copy; 2026. All rights reserved.</p>
      </footer>

      <BackTop />
      <Toast msg={toast.msg} show={toast.show} />

      {showLogin && !session && <LoginModal onSuccess={()=>{setShowLogin(false);setShowAdmin(true);}} onClose={()=>setShowLogin(false)} />}
      {showAdmin && session && <AdminModal data={data} setData={setData} onClose={()=>setShowAdmin(false)} showToast={showToast} onSignOut={signOut} userEmail={session.user?.email} />}
    </div>
  );
}
