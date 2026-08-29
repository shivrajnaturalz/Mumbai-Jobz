// Mumbai Jobz V1 business rules for public job visibility.
// A job is publicly active only when it is paid, manually active, within its listing window,
// and has not passed its closing date. Listing freshness is also exposed for UI ranking.
export const LISTING_DURATION_DAYS = 30;
export const jobs = [
  { id:'job-001', title:'Waiter', skill:'Waiter', area:'Andheri East', salaryMin:18000, salaryMax:22000, lat:19.1197, lng:72.8468, tags:['new'], status:'active', paymentStatus:'paid', listingDate:'2026-08-29T10:00:00Z', expiresAt:'2026-09-28T23:59:59Z' },
  { id:'job-002', title:'Cook', skill:'Cook', area:'Andheri East', salaryMin:20000, salaryMax:26000, lat:19.1172, lng:72.8511, tags:['women-friendly'], status:'active', paymentStatus:'paid', listingDate:'2026-08-29T09:30:00Z', expiresAt:'2026-09-28T23:59:59Z' },
  { id:'job-003', title:'Electrician', skill:'Electrician', area:'Powai', salaryMin:20000, salaryMax:28000, lat:19.1176, lng:72.9060, tags:['urgent'], status:'active', paymentStatus:'paid', listingDate:'2026-08-29T09:00:00Z', expiresAt:'2026-09-28T23:59:59Z' },
  { id:'job-004', title:'Driver', skill:'Driver', area:'Powai', salaryMin:18000, salaryMax:24000, lat:19.1242, lng:72.9088, tags:['new'], status:'active', paymentStatus:'paid', listingDate:'2026-08-29T08:30:00Z', expiresAt:'2026-09-28T23:59:59Z' },
  { id:'job-005', title:'Helper', skill:'Helper', area:'Bandra West', salaryMin:16000, salaryMax:20000, lat:19.0596, lng:72.8295, tags:[], status:'active', paymentStatus:'paid', listingDate:'2026-08-28T18:00:00Z', expiresAt:'2026-09-27T23:59:59Z' },
  { id:'job-006', title:'Waiter', skill:'Waiter', area:'Kurla', salaryMin:17000, salaryMax:22000, lat:19.0726, lng:72.8826, tags:['urgent'], status:'active', paymentStatus:'paid', listingDate:'2026-08-28T16:00:00Z', expiresAt:'2026-09-27T23:59:59Z' },
  { id:'job-007', title:'Cook', skill:'Cook', area:'Goregaon', salaryMin:21000, salaryMax:28000, lat:19.1663, lng:72.8526, tags:['new'], status:'active', paymentStatus:'pending', listingDate:'2026-08-28T14:00:00Z', expiresAt:'2026-09-27T23:59:59Z' }
];

export function isJobActive(job, now = new Date()) {
  const listed = new Date(job.listingDate);
  const expires = new Date(job.expiresAt);
  return job.status === 'active' && job.paymentStatus === 'paid' && listed <= now && now <= expires;
}

export function getListingAgeDays(job, now = new Date()) {
  return Math.max(0, Math.floor((now - new Date(job.listingDate)) / 86400000));
}

export function getFreshnessLabel(job, now = new Date()) {
  const age = getListingAgeDays(job, now);
  if (age === 0) return 'Today';
  if (age === 1) return '1 day ago';
  if (age < 7) return `${age} days ago`;
  if (age < 30) return `${Math.floor(age / 7)} weeks ago`;
  return 'Older';
}

export function getActiveJobs(now = new Date()) {
  return jobs.filter(job => isJobActive(job, now)).sort((a,b) => new Date(b.listingDate) - new Date(a.listingDate));
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

// Employee availability rules: a candidate chooses an availability state and,
// when relevant, a date. The platform can automatically change the state to unavailable
// after hiring or when the candidate's stated availability window has ended.
export const availabilityStates = ['available','available_soon','unavailable','hired'];

export function isEmployeeAvailable(employee, now = new Date()) {
  if (!employee || employee.availabilityStatus !== 'available') return false;
  if (employee.availableUntil && new Date(employee.availableUntil) < now) return false;
  return true;
}

export function getAvailabilityLabel(employee, now = new Date()) {
  if (!employee) return 'Unknown';
  if (employee.availabilityStatus === 'hired') return 'Hired';
  if (employee.availabilityStatus === 'unavailable') return 'Not available';
  if (employee.availableFrom && new Date(employee.availableFrom) > now) return `Available ${new Date(employee.availableFrom).toLocaleDateString('en-IN')}`;
  if (employee.availableUntil && new Date(employee.availableUntil) < now) return 'Not available';
  if (employee.availabilityStatus === 'available_soon') return 'Available soon';
  return 'Available now';
}
