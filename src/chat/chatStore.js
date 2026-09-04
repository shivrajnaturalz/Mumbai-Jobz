const conversations = new Map();
const approachRequests = new Map();

export function getConversationId(employerId, candidateId) {
  return `CH-${employerId || 'EMP'}-${candidateId}`;
}

export function ensureConversation({ employerId='EMP-001', candidate }) {
  const id=getConversationId(employerId,candidate.id);
  if(!conversations.has(id)) conversations.set(id,{id,employerId,candidateId:candidate.id,name:candidate.name,role:`${candidate.role} · ${candidate.area}`,stage:candidate.stage||'Approached',unread:0,messages:[]});
  return conversations.get(id);
}

export function approachCandidate({ employerId='EMP-001', employerName='Employer', candidate, job }) {
  const id=`AR-${employerId}-${candidate.id}-${job?.id||'JOB'}`;
  const existing=approachRequests.get(id);
  if(existing) return existing;
  const request={id,employerId,employerName,candidateId:candidate.id,candidateName:candidate.name,jobId:job?.id||null,jobTitle:job?.title||candidate.role,area:job?.location||candidate.area,salary:job?.salary||`${candidate.salaryMin?.toLocaleString?.()||candidate.salaryMin||''}–₹${candidate.salaryMax?.toLocaleString?.()||candidate.salaryMax||''}`,listingDate:job?.listingDate||new Date().toISOString(),message:job?.approachMessage||`We would like to discuss an opportunity for ${job?.title||candidate.role}.`,status:'pending',createdAt:new Date().toISOString()};
  approachRequests.set(id,request);
  return request;
}

export function getApproachRequests(candidateId) {
  return Array.from(approachRequests.values()).filter(r=>r.candidateId===candidateId);
}

export function respondToApproach({requestId,response}) {
  const request=approachRequests.get(requestId);
  if(!request || !['accepted','declined'].includes(response)) return null;
  request.status=response;
  request.respondedAt=new Date().toISOString();
  if(response==='accepted') {
    const candidate={id:request.candidateId,name:request.candidateName,role:request.jobTitle,area:request.area};
    const conversation=ensureConversation({employerId:request.employerId,candidate});
    conversation.stage='Approached';
    request.conversationId=conversation.id;
  }
  return request;
}

export function markCandidateHired({ employerId='EMP-001', candidate }) {
  const conversation=ensureConversation({employerId,candidate});
  conversation.stage='Hired';
  Array.from(approachRequests.values()).filter(r=>r.candidateId===candidate.id&&r.status==='pending').forEach(r=>{r.status='closed';r.closedReason='hired';});
  return conversation;
}

export function sendRecruitmentMessage({ conversationId, from='employer', text, time }) {
  const conversation=conversations.get(conversationId);
  if(!conversation || !text?.trim()) return null;
  conversation.messages.push({from,text:text.trim(),time:time||new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})});
  if(from!=='employer') conversation.unread=(conversation.unread||0)+1;
  return conversation;
}

export function getConversations() { return Array.from(conversations.values()); }
export function upsertConversation(conversation) { conversations.set(conversation.id,{...conversation,messages:[...(conversation.messages||[])]}); return conversations.get(conversation.id); }
