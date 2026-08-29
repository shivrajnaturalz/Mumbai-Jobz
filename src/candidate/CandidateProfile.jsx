import React,{useState} from 'react';
import {UserRound,MapPin,Briefcase,IndianRupee,CheckCircle2,Clock3} from 'lucide-react';
import {availabilityStates,getAvailabilityLabel} from '../data/jobs';

export default function CandidateProfile(){
 const [profile,setProfile]=useState({name:'Amit Patil',role:'Waiter',skills:['Waiter','Hotel Service'],area:'Andheri East',salaryMin:18000,salaryMax:22000,availabilityStatus:'available',availableFrom:'',availableUntil:''});
 const set=(key,value)=>setProfile(p=>({...p,[key]:value}));
 const save=()=>window.dispatchEvent(new CustomEvent('candidate-profile-updated',{detail:profile}));
 return <section className="candidateProfile"><header className="profileHeader"><div className="profileAvatar"><UserRound/></div><div><h2>My Work Profile</h2><p>Keep your profile updated so employers see the right availability.</p></div></header>
  <div className="availabilityCard"><div><span className="eyebrow">CURRENT AVAILABILITY</span><h3>{getAvailabilityLabel(profile)}</h3><p>Employers can only approach you when your profile says you're available.</p></div><div className="availabilityIcon">{profile.availabilityStatus==='available'?<CheckCircle2/>:<Clock3/>}</div></div>
  <label>Full name<input value={profile.name} onChange={e=>set('name',e.target.value)}/></label>
  <label>Primary job / skill<input value={profile.role} onChange={e=>set('role',e.target.value)} placeholder="e.g. Machine Operator"/></label>
  <label>Skills<input value={profile.skills.join(', ')} onChange={e=>set('skills',e.target.value.split(',').map(s=>s.trim()).filter(Boolean))} placeholder="e.g. Welding, CNC, Packing"/></label>
  <label>Preferred work area<div className="inputIcon"><MapPin size={17}/><input value={profile.area} onChange={e=>set('area',e.target.value)}/></div></label>
  <div className="twoCol"><label>Minimum salary<div className="inputIcon"><IndianRupee size={16}/><input type="number" value={profile.salaryMin} onChange={e=>set('salaryMin',Number(e.target.value))}/></div></label><label>Maximum salary<div className="inputIcon"><IndianRupee size={16}/><input type="number" value={profile.salaryMax} onChange={e=>set('salaryMax',Number(e.target.value))}/></div></label></div>
  <div className="availabilitySection"><h3>Availability</h3><div className="availabilityOptions">{availabilityStates.filter(s=>s!=='hired').map(s=><button className={profile.availabilityStatus===s?'selected':''} onClick={()=>set('availabilityStatus',s)} key={s}>{s==='available'?'Available now':s==='available_soon'?'Available soon':'Not available'}</button>)}</div></div>
  {profile.availabilityStatus==='available_soon'&&<label>Available from<input type="date" value={profile.availableFrom?.slice(0,10)||''} onChange={e=>set('availableFrom',e.target.value+'T00:00:00+05:30')}/></label>}
  {profile.availabilityStatus==='available'&&<label>Available until (optional)<input type="date" value={profile.availableUntil?.slice(0,10)||''} onChange={e=>set('availableUntil',e.target.value?e.target.value+'T23:59:59+05:30':'' )}/></label>}
  <button className="saveProfile" onClick={save}><Briefcase size={17}/> Save work profile</button>
 </section>
}
