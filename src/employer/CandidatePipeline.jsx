import React,{useMemo,useState} from 'react';
import {MessageCircle,Phone,Check,UserRound,ChevronRight} from 'lucide-react';
import {getAvailabilityLabel,isEmployeeAvailable} from '../data/jobs';

const stages=['Applied','Shortlisted','Approached','Hired'];
const initialCandidates=[
 {id:'C-001',name:'Amit Patil',role:'Waiter',area:'Andheri East',stage:'Applied',experience:'2 yrs',available:'Immediate',availabilityStatus:'available'},
 {id:'C-002',name:'Rahul Jadhav',role:'Cook',area:'Powai',stage:'Shortlisted',experience:'4 yrs',available:'Immediate',availabilityStatus:'available'},
 {id:'C-003',name:'Sahil Khan',role:'Delivery Executive',area:'Bandra West',stage:'Approached',experience:'1 yr',available:'7 days',availabilityStatus:'available_soon',availableFrom:'2026-09-02T00:00:00+05:30'}
];

export default function CandidatePipeline(){
 const [candidates,setCandidates]=useState(initialCandidates); const [filter,setFilter]=useState('All');
 const visible=useMemo(()=>filter==='All'?candidates:candidates.filter(c=>c.stage===filter),[candidates,filter]);
 const move=(id)=>setCandidates(cs=>cs.map(c=>{if(c.id!==id)return c;const i=stages.indexOf(c.stage);if(i>=stages.length-1)return c;const next=stages[i+1];return next==='Hired'?{...c,stage:next,availabilityStatus:'hired'}:{...c,stage:next};}));
 const markUnavailable=(id)=>setCandidates(cs=>cs.map(c=>c.id===id?{...c,availabilityStatus:'unavailable'}:c));
 return <section className="candidatePipeline"><div className="pipelineHeader"><div><h2>Candidate Pipeline</h2><p>Applied → Shortlisted → Approached → Hired. Availability updates with hiring status.</p></div><div className="pipelineTotal"><UserRound size={18}/>{candidates.length} candidates</div></div>
  <div className="stageTabs">{['All',...stages].map(s=><button className={filter===s?'selected':''} onClick={()=>setFilter(s)} key={s}>{s}<b>{s==='All'?candidates.length:candidates.filter(c=>c.stage===s).length}</b></button>)}</div>
  <div className="candidateList">{visible.map(c=>{const available=isEmployeeAvailable(c);return <article className="candidateCard" key={c.id}><div className="candidateAvatar">{c.name.split(' ').map(x=>x[0]).join('')}</div><div className="candidateInfo"><div className="candidateName"><h3>{c.name}</h3><em>{c.stage}</em></div><p>{c.role} · {c.area}</p><small>{c.experience} experience · {getAvailabilityLabel(c)}</small></div><div className="candidateActions"><button title="In-app chat"><MessageCircle size={17}/></button>{c.stage==='Approached'&&available&&<button title="Call via platform"><Phone size={17}/></button>}{c.stage!=='Hired'&&available&&<button className="advance" onClick={()=>move(c.id)}>{c.stage==='Approached'?'Mark hired':'Move forward'} <ChevronRight size={16}/></button>}{c.stage!=='Hired'&&available&&<button title="Mark not available" onClick={()=>markUnavailable(c.id)}>Not available</button>}{c.stage==='Hired'&&<Check size={20}/>}</div></article>})}</div>
 </section>
}
