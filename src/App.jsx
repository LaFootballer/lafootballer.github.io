import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUp, CaretDown, X } from '@phosphor-icons/react';
import { copy } from './content';

function initialLanguage() {
 const query = new URLSearchParams(window.location.search).get('lang');
 if (query === 'ru' || query === 'en') return query;
 try { return localStorage.getItem('portfolio-language') === 'ru' ? 'ru' : 'en'; } catch { return 'en'; }
}
function Tags({items}) { return <ul className="tags">{items.map(tag=><li key={tag}>{tag}</li>)}</ul>; }
function ExperienceRow({role}) {
 return <li className="experience-row"><div className="period">{role.period}</div><div className="role-content"><h3>{role.company}</h3><p className="role-title">{role.title}</p><p>{role.description}</p>{role.result&&<p className="result">{role.result}</p>}{role.tags&&<Tags items={role.tags}/>}</div></li>;
}
export function App() {
 const [language,setLanguage]=useState(initialLanguage);
 const [activeSection,setActiveSection]=useState('projects');
 const [selected,setSelected]=useState(null);
 const dialogRef=useRef(null);
 const c=copy[language], project=c.projectsList.find(item=>item.id===selected);
 useEffect(()=>{
  document.documentElement.lang=language;
  document.title=`${c.name} — Product Manager`;
  document.querySelector('meta[name="description"]').setAttribute('content',c.intro);
  try{localStorage.setItem('portfolio-language',language);}catch{/* optional preference */}
 },[language,c]);
 useEffect(()=>{
  function trackSection(){const experience=document.getElementById('experience');if(experience.getBoundingClientRect().top<window.innerHeight*.4)setActiveSection('experience');else if(window.scrollY>60)setActiveSection('projects');}
  window.addEventListener('scroll',trackSection,{passive:true});return()=>window.removeEventListener('scroll',trackSection);
 },[]);
 useEffect(()=>{
  const dialog=dialogRef.current;
  if(selected&&!dialog.open){dialog.showModal();document.body.style.overflow='hidden';}
  if(!selected&&dialog.open)dialog.close();
  return()=>{document.body.style.overflow='';};
 },[selected]);
 function changeLanguage(next){setLanguage(next);const url=new URL(window.location.href);url.searchParams.set('lang',next);window.history.replaceState({},'',url);}
 function navigate(section,event){setActiveSection(section);if(section==='about'){event.preventDefault();window.history.replaceState({},'',`${window.location.pathname}${window.location.search}#about`);window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}}
 function closeProject(){dialogRef.current.close();setSelected(null);}
 return <>
  <a className="skip-link" href="#main">{c.skip}</a>
  <div className="page-shell">
   <div className="language-switch" role="group" aria-label={language==='en'?'Language':'Язык'}><button lang="en" aria-label="English" aria-pressed={language==='en'} onClick={()=>changeLanguage('en')}>EN</button><span aria-hidden="true">/</span><button lang="ru" aria-label="Русский" aria-pressed={language==='ru'} onClick={()=>changeLanguage('ru')}>RU</button></div>
   <header className="identity"><div><h1>{c.name}</h1><p className="profession">{c.role}</p><p className="tagline">{c.tagline}</p></div><nav aria-label={language==='en'?'Main navigation':'Основная навигация'}>{['about','experience','projects'].map(id=><a key={id} href={`#${id}`} className={activeSection===id?'active':''} aria-current={activeSection===id?'location':undefined} onClick={event=>navigate(id,event)}><span className="nav-line" aria-hidden="true"/><span>{c.nav[id]}</span></a>)}</nav></header>
   <main id="main" tabIndex={-1}>
    <section id="about" aria-label={c.nav.about} className="about-section"><p>{c.intro}</p></section>
    <section id="projects" aria-labelledby="projects-heading" className="projects-section"><h2 id="projects-heading">{c.projects}</h2><ul className="projects-list">{c.projectsList.map(item=><li key={item.id}><button className="project-row" aria-label={`${c.details} ${item.name}`} onClick={()=>setSelected(item.id)}><span className="project-image"><img src={`/images/${item.id}.webp`} alt="" width="456" height="220"/></span><span className="project-description"><span className="project-name">{item.name}</span><span className="project-summary">{item.summary}</span><span className="tags" aria-hidden="true">{item.tags.map(tag=><span key={tag}>{tag}</span>)}</span></span><ArrowRight className="project-arrow" size={26} weight="light" aria-hidden="true"/></button></li>)}</ul></section>
    <section id="experience" className="experience-section" aria-labelledby="experience-heading"><h2 id="experience-heading">{c.experience}</h2><ol className="experience-list">{c.roles.map(role=><ExperienceRow key={role.company} role={role}/>)}</ol><details className="earlier-experience"><summary>{c.earlier}<CaretDown size={18} aria-hidden="true"/></summary><ol className="experience-list">{c.earlyRoles.map(role=><ExperienceRow key={role.company} role={role}/>)}</ol></details><div className="education"><h2>{c.education}</h2><p>{c.degree}</p><p className="university">{c.university}</p></div></section>
    <footer><p>{c.footer}</p><a href="#about" onClick={event=>navigate('about',event)}>{c.top}<ArrowUp size={16} aria-hidden="true"/></a></footer>
   </main>
  </div>
  <dialog ref={dialogRef} className="project-dialog" aria-labelledby="project-dialog-title" onClose={()=>setSelected(null)} onClick={event=>{if(event.target===event.currentTarget)closeProject();}}>{project&&<article><button className="close-dialog" aria-label={c.close} onClick={closeProject}><X size={24}/></button><figure><img src={`/images/${project.id}.webp`} alt="" width="912" height="440"/><figcaption>{c.illustration}</figcaption></figure><h2 id="project-dialog-title">{project.name}</h2><p className="dialog-summary">{project.summary}</p><h3>{c.problem}</h3><p>{project.idea}</p><h3>{c.solution}</h3><p>{project.solution}</p><h3>{c.stack}</h3><Tags items={project.stack}/><button className="back-link" onClick={closeProject}>{c.back}<ArrowRight size={19} aria-hidden="true"/></button></article>}</dialog>
 </>;
}
