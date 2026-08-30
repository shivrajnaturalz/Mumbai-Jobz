import React,{useEffect,useMemo,useState} from 'react';
import {Send,MessageCircle,UserRound,Paperclip,ShieldCheck,Clock3} from 'lucide-react';
import {getConversations,sendRecruitmentMessage} from './chatStore';

const seed=[
 {id:'CH-EMP-001-C-001',candidateId:'C-001',name:'Amit Patil',role:'Waiter · Andheri East',stage:'Approached',unread:2,messages:[{from:'candidate',text:'Hello, I am available immediately.',time:'09:12'}]},
 {id:'CH-EMP-001-C-002',candidateId:'C-002',name:'Rahul Jadhav',role:'Cook · Powai',stage:'Shortlisted',unread:0,messages:[]}
];
function bootstrap(){seed.forEach(c=>{if(!getConversations().some(x=>x.id===c.id)){const store={...c,messages:[...c.messages]};getConversations().push(store);}});return getConversations();}
export default function RecruitmentChat({conversationId}){
 const [conversations,setConversations]=useState(bootstrap);const [selectedId,setSelectedId]=useState(conversationId||conversations[0]?.id);const [draft,setDraft]=useState('');
 useEffect(()=>{if(conversationId)setSelectedId(conversationId)},[conversationId]);
 const selected=useMemo(()=>conversations.find(c=>c.id===selectedId)||conversations[0],[conversations,selectedId]);
 const refresh=()=>setConversations([...getConversations()]);
 const send=()=>{if(!selected||!draft.trim())return;sendRecruitmentMessage({conversationId:selected.id,text:draft});setDraft('');refresh()};
 return <section className="recruitmentChat"><div className="chatHeader"><div><h2>Recruitment Chat</h2><p>Private conversations inside Mumbai Jobz — no personal WhatsApp number required.</p></div><div className="chatSecure"><ShieldCheck size={17}/> Protected</div></div><div className="chatLayout"><aside className="conversationList">{conversations.map(c=><button className={selected?.id===c.id?'selected':''} onClick={()=>setSelectedId(c.id)} key={c.id}><div className="chatAvatar">{c.name.split(' ').map(x=>x[0]).join('')}</div><div><b>{c.name}</b><span>{c.role}</span><small>{c.messages[c.messages.length-1]?.text||'Start conversation'}</small></div>{c.unread>0&&<em>{c.unread}</em>}</button>)}</aside><div className="chatWindow">{selected&&<><header><div className="chatAvatar"><UserRound size={18}/></div><div><b>{selected.name}</b><span>{selected.role}</span></div><span className="stageBadge">{selected.stage}</span></header><div className="messages">{selected.messages.map((m,i)=><div className={`bubbleRow ${m.from==='employer'?'mine':''}`} key={i}><div className="bubble">{m.text}<small><Clock3 size={11}/>{m.time}</small></div></div>)}</div><div className="composer"><button title="Attach"><Paperclip size={19}/></button><input value={draft} onChange={e=>setDraft(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')send()}} placeholder="Write a message..."/><button className="send" onClick={send}><Send size={18}/></button></div></>}</div></div><div className="chatNotice"><MessageCircle size={16}/> Contact details stay private until both sides choose to share them.</div></section>;
}
