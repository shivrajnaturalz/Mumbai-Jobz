import React from 'react';
import { createRoot } from 'react-dom/client';
import { MapPin, Search, Bell, Briefcase, Users, ChevronRight } from 'lucide-react';
import './styles.css';

const jobs=[
 {title:'Waiter',company:'Premium Family Restaurant',area:'Andheri East',salary:'₹18,000–₹22,000',tag:'New job'},
 {title:'Electrician',company:'Construction Company',area:'Powai',salary:'₹20,000–₹28,000',tag:'Urgent'},
 {title:'Cook',company:'Hotel & Restaurant',area:'Bandra West',salary:'₹22,000–₹30,000',tag:'Job for women'}
];
const skills=[['Waiter',42],['Cook',28],['Electrician',19],['Driver',15],['Helper',11]];
function App(){return <main className="app">
 <header><div><div className="brand">Mumbai Jobz</div><div className="tagline">Find work. Find people. Nearby.</div></div><button className="icon"><Bell size={20}/><span>3</span></button></header>
 <section className="hero"><div className="mapTop"><strong>Jobs near you</strong><div className="mapCount"><Briefcase size={16}/> 115 jobs</div></div><div className="map"><div className="road r1"/><div className="road r2"/><div className="road r3"/><div className="area a1">Andheri</div><div className="area a2">Powai</div><div className="area a3">Bandra</div>{[['Andheri',42,26],['Powai',28,48],['Bandra',19,69],['Kurla',15,36],['Goregaon',11,80]].map(([n,c,l],i)=><div className="pin" style={{left:`${l}%`,top:`${20+i*13}%`}} key={n}><MapPin size={17}/><b>{c}</b><small>{n}</small></div>)}</div><div className="skillRow">{skills.slice(0,4).map(([s,c])=><div className="skill" key={s}><b>{c}</b><span>{s}</span></div>)}</div></section>
 <div className="search"><Search size={19}/><input placeholder="Search jobs, skills or area"/><button>Search</button></div>
 <section className="jobs"><div className="sectionTitle"><div><h2>Newly listed jobs</h2><p>Fresh opportunities around Mumbai</p></div><button className="see">See all <ChevronRight size={17}/></button></div>{jobs.map(j=><article className="job" key={j.title+j.area}><div className="jobIcon"><Briefcase size={20}/></div><div className="jobMain"><div className="jobHead"><h3>{j.title}</h3><em>{j.tag}</em></div><p>{j.company}</p><div className="meta"><span><MapPin size={14}/>{j.area}</span><strong>{j.salary}</strong></div></div></article>)}</section>
 <nav><button className="active"><MapPin size={20}/><span>Jobs Map</span></button><button><Briefcase size={20}/><span>My Jobs</span></button><button><Bell size={20}/><span>Alerts</span></button><button><Users size={20}/><span>Profile</span></button></nav>
 </main>}
createRoot(document.getElementById('root')).render(<App/>);