const conversations = new Map();

export function getConversationId(employerId, candidateId) {
  return `CH-${employerId || 'EMP'}-${candidateId}`;
}

export function ensureConversation({ employerId='EMP-001', candidate }) {
  const id=getConversationId(employerId,candidate.id);
  if(!conversations.has(id)) conversations.set(id,{id,employerId,candidateId:candidate.id,name:candidate.name,role:`${candidate.role} · ${candidate.area}`,stage:candidate.stage||'Approached',unread:0,messages:[]});
  return conversations.get(id);
}

export function approachCandidate({ employerId='EMP-001', candidate }) {
  const conversation=ensureConversation({employerId,candidate});
  conversation.stage='Approached';
  return conversation;
}

export function markCandidateHired({ employerId='EMP-001', candidate }) {
  const conversation=ensureConversation({employerId,candidate});
  conversation.stage='Hired';
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
