// V1 demo data contract. Replace this module with the Supabase query layer later.
// Only jobs with status === 'active' are eligible for public map aggregation.
export const jobs = [
  { id:'job-001', title:'Waiter', skill:'Waiter', area:'Andheri East', salaryMin:18000, salaryMax:22000, lat:19.1197, lng:72.8468, tags:['new'], status:'active', createdAt:'2026-08-29T10:00:00Z' },
  { id:'job-002', title:'Cook', skill:'Cook', area:'Andheri East', salaryMin:20000, salaryMax:26000, lat:19.1172, lng:72.8511, tags:['women-friendly'], status:'active', createdAt:'2026-08-29T09:30:00Z' },
  { id:'job-003', title:'Electrician', skill:'Electrician', area:'Powai', salaryMin:20000, salaryMax:28000, lat:19.1176, lng:72.9060, tags:['urgent'], status:'active', createdAt:'2026-08-29T09:00:00Z' },
  { id:'job-004', title:'Driver', skill:'Driver', area:'Powai', salaryMin:18000, salaryMax:24000, lat:19.1242, lng:72.9088, tags:['new'], status:'active', createdAt:'2026-08-29T08:30:00Z' },
  { id:'job-005', title:'Helper', skill:'Helper', area:'Bandra West', salaryMin:16000, salaryMax:20000, lat:19.0596, lng:72.8295, tags:[], status:'active', createdAt:'2026-08-28T18:00:00Z' },
  { id:'job-006', title:'Waiter', skill:'Waiter', area:'Kurla', salaryMin:17000, salaryMax:22000, lat:19.0726, lng:72.8826, tags:['urgent'], status:'active', createdAt:'2026-08-28T16:00:00Z' },
  { id:'job-007', title:'Cook', skill:'Cook', area:'Goregaon', salaryMin:21000, salaryMax:28000, lat:19.1663, lng:72.8526, tags:['new'], status:'inactive', createdAt:'2026-08-28T14:00:00Z' }
];

export function getActiveJobs() {
  return jobs.filter(job => job.status === 'active');
}

export function aggregateByArea(activeJobs = getActiveJobs()) {
  return activeJobs.reduce((acc, job) => {
    const key = job.area;
    if (!acc[key]) acc[key] = { area:key, total:0, skills:{} };
    acc[key].total += 1;
    acc[key].skills[job.skill] = (acc[key].skills[job.skill] || 0) + 1;
    return acc;
  }, {});
}

export function aggregateBySkill(activeJobs = getActiveJobs()) {
  return activeJobs.reduce((acc, job) => {
    acc[job.skill] = (acc[job.skill] || 0) + 1;
    return acc;
  }, {});
}
