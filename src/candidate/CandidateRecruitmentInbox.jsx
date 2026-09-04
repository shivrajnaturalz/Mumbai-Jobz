import React,{useEffect,useMemo,useState} from 'react';
import {Briefcase,Check,Clock3,MapPin,MessageCircle,ShieldCheck,X} from 'lucide-react';
import {getApproachRequests,respondToApproach} from '../chat/chatStore';
import {isEmployeeAvailable,getAvailabilityLabel} from '../data/jobs';

const demoCandidate={id:'C-001',name:'Amit Patil',role:'Waiter',area:'Andheri East',availabilityStatus:'available'};

function freshness(date){
  const days=Math.max(0,Math.floor((Date.now()-new Date(date).getTime())/86400000));
  return days===0?'Today':days===1?'Yesterday':`${days} days ago`;
}

export default function CandidateRecruitmentInbox({candidate=demoCandidate,onOpenChat}){
 const [requests,setRequests]=useState(()=>getApproachRequests(candidate.id));
 const refresh=()=>setRequests([...getApproachRequests(candidate.id)]);
 useEffect(()=>{
  const handler=event=>{if(event.detail?.candidateId===candidate.id||event.detail?.candidate?.id===candidate.id)refresh()};
  window.addEventListener('candidate-approached',handler);window.addEventListener('candidate-approach-updated',handler);
  return()=>{window.removeEventListener('candidate-approached',handler);window.removeEventListener('candidate-approach-updated',handler)};
 },[candidate.id]);
 const pending=useMemo(()=>requests.filter(r=>r.status==='pending'),[requests]);
 const respond=(request,response)=>{
  if(response==='accepted'&&!isEmployeeAvailable(candidate)) return;
  const updated=respondToApproach({requestId:request.id,response});
  if(updated){refresh();window.dispatchEvent(new CustomEvent('candidate-approach-updated',{detail:updated}));if(response==='accepted')onOpenChat?.(updated.conversationId)}
 };
 return <section className="candidateInbox"><div className="findHeader"><div><h2>Recruitment Requests</h2><p>Employers can approach you without seeing your personal WhatsApp number.</p></div><div className="findTotal"><MessageCircle size={18}/>{pending.length} pending</div></div><div className="inboxAvailability"><span><Clock3 size={16}/> {getAvailabilityLabel(candidate)}</span><small>Only active availability can accept a new approach.</small></div><div className="inboxList">{requests.length===0&&<div className="emptyMatches">No employer approaches yet. Keep your profile and availability updated.</div>}{requests.map(r=><article className={`approachCard ${r.status}`} key={r.id}><div className="approachTop"><div className="employerBadge"><Briefcase size={18}/></div><div><h3>{r.employerName}</h3><p>{r.jobTitle}</p></div><span className={`requestStatus ${r.status}`}>{r.status}</span></div><div className="approachMeta"><span><MapPin size={14}/>{r.area}</span><span><Clock3 size={14}/>{freshness(r.listingDate)}</span></div><div className="approachOffer"><b>Opportunity details</b><span>{r.salary}</span></div><p className="approachMessage">{r.message}</p>{r.status==='pending'&&<div className="approachActions"><button className="decline" onClick={()=>respond(r,'declined')}><X size={17}/> Decline</button><button className="accept" disabled={!isEmployeeAvailable(candidate)} onClick={()=>respond(r,'accepted')}><Check size={17}/> Accept & Chat</button></div>}{r.status==='accepted'&&<button className="acceptedChat" onClick={()=>onOpenChat?.(r.conversationId)}><MessageCircle size={17}/> Open private chat</button>}{r.status==='pending'&&!isEmployeeAvailable(candidate)&&<small className="availabilityWarning">You are currently {getAvailabilityLabel(candidate).toLowerCase()}, so this request cannot be accepted yet.</small>}</article>)}</div><div className="chatNotice"><ShieldCheck size={16}/> Your phone number and WhatsApp stay private. Share contact details only when you choose.</div></section>;
}
