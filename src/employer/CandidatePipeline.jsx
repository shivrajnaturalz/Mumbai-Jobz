import React,{useMemo,useState} from 'react';
import {MessageCircle,Phone,Check,UserRound,ChevronRight} from 'lucide-react';

const stages=['Applied','Shortlisted','Approached','Hired'];
const initialCandidates=[
 {id:'C-001',name:'Amit Patil',role:'Waiter',area:'Andheri East',stage:'Applied',experience:'2 yrs',available:'Immediate'},
 {id:'C-002',name:'Rahul Jadhav',role:'Cook',area:'Powai',stage:'Shortlisted',experience:'4 yrs',available:'Immediate'},
 {id:'C-003',name:'Sahil Khan',role:'Delivery Executive',area:'Bandra West',stage:'Approached',experience:'1 yr',available:'7 days'}
];

export default function CandidatePipeline(){
 const [candidates,setCandidates]=useState(initialCandidates); const [filter,setFilter]=useState('All');
 const visible=useMemo(()=>filter==='All'?candidates:candidates.filter(c=>c.stage===filter),[candidates,filter]);
 const move=(id)=>setCandidates(cs=>cs.map(c=>{if(c.id!==id)return c;const i=stages.indexOf(c.stage);return i<stages.length-1?{...c,stage:stages[i+1]}:c;}));
 return <section className="candidatePipeline"><div className="pipelineHeader"><div><h2>Candidate Pipeline</h2><p>Move candidates from application to hiring without sharing personal numbers.</p></div><div className="pipelineTotal"><UserRound size={18}/>{candidates.length} candidates</div></div>
  <div className="stageTabs">{['All',...stages].map(s=><button className={filter===s?'selected':''} onClick={()=>setFilter(s)} key={s}>{s}<b>{s==='All'?candidates.length:candidates.filter(c=>c.stage===s).length}</b></button>)}</div>
  <div className="candidateList">{visible.map(c=><article className="candidateCard" key={c.id}><div className="candidateAvatar">{c.name.split(' ').map(x=>x[0]).join('')}</div><div className="candidateInfo"><div className="candidateName"><h3>{c.name}</h3><em>{c.stage}</em></div><p>{c.role} · {c.area}</p><small>{c.experience} experience · Available {c.available}</small></div><div className="candidateActions"><button title="In-app chat"><MessageCircle size={17}/></button>{c.stage==='Approached'&&<button title="Call via platform"><Phone size={17}/></button>}{c.stage!=='Hired'&&<button className="advance" onClick={()=>move(c.id)}>{c.stage==='Approached'?'Mark hired':'Move forward'} <ChevronRight size={16}/></button>}{c.stage==='Hired'&&<Check size={20}/>}</div></article>)}</div>
 </section>
}
