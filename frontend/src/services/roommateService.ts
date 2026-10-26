import { supabase } from '@/lib/supabase';
import { calculateCompatibility } from '@/utils/compatibility';
import { SEED_CANDIDATES } from '@/data/mockCandidates';
import type { Profile, Preferences, CandidateProfile, RoommateRequest, CompatibilityResult } from '@/types';

const LOCAL_SAVED_KEY = 'livsync_saved_ids';
const LOCAL_REQUESTS_KEY = 'livsync_requests_store';

function getLocalSavedIds(): Set<string> {
  try {
    const raw = localStorage.getItem(LOCAL_SAVED_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function setLocalSavedIds(ids: Set<string>) {
  try {
    localStorage.setItem(LOCAL_SAVED_KEY, JSON.stringify(Array.from(ids)));
  } catch (e) {
    console.error('Failed to save to local storage', e);
  }
}

function getLocalRequests(): RoommateRequest[] {
  try {
    const raw = localStorage.getItem(LOCAL_REQUESTS_KEY);
    if (!raw) {
      // Seed a sample incoming request from Aarav Sharma so user can experience "Accept / Decline" immediately
      const initial: RoommateRequest[] = [
        {
          id: 'demo-req-1',
          sender_id: 'user-aarav',
          recipient_id: 'current-user',
          status: 'pending',
          message: 'Hey! Loved your profile and routine. Would you like to check out 2BHK apartments together near SG Highway?',
          created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
          updated_at: new Date(Date.now() - 3600000 * 4).toISOString(),
        },
      ];
      localStorage.setItem(LOCAL_REQUESTS_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveLocalRequests(reqs: RoommateRequest[]) {
  try {
    localStorage.setItem(LOCAL_REQUESTS_KEY, JSON.stringify(reqs));
  } catch (e) {
    console.error('Failed to save requests', e);
  }
}

export const roommateService = {
  // Fetch all candidate profiles with compatibility
  async getCandidates(
    currentUserId: string | null,
    myPrefs: Preferences | null
  ): Promise<CandidateProfile[]> {
    const savedIds = await this.getSavedIds(currentUserId);
    const requests = await this.getAllRequests(currentUserId);

    const requestStatusMap = new Map<string, { status: CandidateProfile['requestStatus']; message?: string }>();
    for (const r of requests) {
      const isSender = r.sender_id === (currentUserId || 'current-user');
      const otherId = isSender ? r.recipient_id : r.sender_id;
      if (isSender) {
        requestStatusMap.set(otherId, { status: r.status, message: r.message });
      } else {
        requestStatusMap.set(otherId, {
          status: r.status === 'accepted' ? 'accepted' : r.status === 'rejected' ? 'rejected' : 'received',
          message: r.message,
        });
      }
    }

    // Try fetching from Supabase
    let remoteProfiles: Profile[] = [];
    let remotePrefs: Preferences[] = [];

    if (currentUserId) {
      try {
        const { data: pData } = await supabase
          .from('profiles')
          .select('*')
          .eq('is_visible', true)
          .eq('profile_complete', true)
          .neq('id', currentUserId)
          .limit(30);

        if (pData && pData.length > 0) {
          remoteProfiles = pData;
          const uids = remoteProfiles.map((p) => p.id);
          const { data: prefData } = await supabase.from('preferences').select('*').in('user_id', uids);
          if (prefData) remotePrefs = prefData;
        }
      } catch (err) {
        console.warn('Supabase candidate fetch fallback:', err);
      }
    }

    const prefMap = new Map<string, Preferences>();
    remotePrefs.forEach((p) => prefMap.set(p.user_id, p));

    // Combine remote with seed candidates to guarantee a rich pool
    const pool = new Map<string, { profile: Profile; preferences: Preferences | null }>();

    // Add seed candidates first (excluding self if match)
    for (const seed of SEED_CANDIDATES) {
      if (seed.profile.id !== currentUserId) {
        pool.set(seed.profile.id, { profile: seed.profile, preferences: seed.preferences });
      }
    }

    // Overlay or add remote candidates
    for (const remote of remoteProfiles) {
      pool.set(remote.id, {
        profile: remote,
        preferences: prefMap.get(remote.id) ?? null,
      });
    }

    const defaultCompatibility: CompatibilityResult = {
      score: 0,
      label: 'Lower',
      factors: [],
      availableWeight: 0,
      isPartial: true,
      strengths: [],
      differences: [],
      missingFactors: ['Preferences not configured'],
    };

    const candidates: CandidateProfile[] = [];

    pool.forEach(({ profile, preferences }) => {
      let compatibility = defaultCompatibility;
      if (myPrefs && preferences) {
        compatibility = calculateCompatibility(myPrefs, preferences);
      }

      const reqInfo = requestStatusMap.get(profile.id);

      candidates.push({
        profile,
        preferences,
        compatibility,
        isSaved: savedIds.has(profile.id),
        requestStatus: reqInfo?.status ?? 'none',
        requestMessage: reqInfo?.message,
      });
    });

    // Sort by compatibility descending
    candidates.sort((a, b) => b.compatibility.score - a.compatibility.score);
    return candidates;
  },

  // Saved profiles operations
  async getSavedIds(userId: string | null): Promise<Set<string>> {
    const local = getLocalSavedIds();
    if (userId) {
      try {
        const { data } = await supabase.from('saved_profiles').select('candidate_id').eq('user_id', userId);
        if (data && data.length > 0) {
          data.forEach((row: { candidate_id: string }) => local.add(row.candidate_id));
          setLocalSavedIds(local);
        }
      } catch (err) {
        console.warn('Supabase saved_profiles fetch error, using local:', err);
      }
    }
    return local;
  },

  async toggleSave(userId: string | null, candidateId: string, currentIsSaved: boolean): Promise<boolean> {
    const saved = getLocalSavedIds();
    const newSaved = !currentIsSaved;
    if (newSaved) {
      saved.add(candidateId);
    } else {
      saved.delete(candidateId);
    }
    setLocalSavedIds(saved);

    if (userId) {
      try {
        if (newSaved) {
          await supabase.from('saved_profiles').insert({ candidate_id: candidateId });
        } else {
          await supabase.from('saved_profiles').delete().eq('user_id', userId).eq('candidate_id', candidateId);
        }
      } catch (err) {
        console.warn('Supabase toggleSave fallback:', err);
      }
    }
    return newSaved;
  },

  // Roommate requests operations
  async getAllRequests(userId: string | null): Promise<RoommateRequest[]> {
    const local = getLocalRequests();
    const effectiveUserId = userId || 'current-user';

    if (userId) {
      try {
        const { data } = await supabase
          .from('roommate_requests')
          .select('*')
          .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`);

        if (data && data.length > 0) {
          // Merge remote requests into local
          const map = new Map<string, RoommateRequest>();
          local.forEach((r) => map.set(r.id, r));
          data.forEach((r: RoommateRequest) => map.set(r.id, r));
          const merged = Array.from(map.values());
          saveLocalRequests(merged);
          return merged.filter((r) => r.sender_id === effectiveUserId || r.recipient_id === effectiveUserId);
        }
      } catch (err) {
        console.warn('Supabase requests fetch fallback:', err);
      }
    }

    return local.filter((r) => r.sender_id === effectiveUserId || r.recipient_id === effectiveUserId);
  },

  async sendRequest(userId: string | null, recipientId: string, message: string = ''): Promise<RoommateRequest> {
    const senderId = userId || 'current-user';
    const newReq: RoommateRequest = {
      id: `req-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      sender_id: senderId,
      recipient_id: recipientId,
      status: 'pending',
      message: message.trim() || 'Hi! I reviewed your profile on LivSync and think our routines and living habits align nicely. Would love to connect!',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const current = getLocalRequests().filter(
      (r) => !(r.sender_id === senderId && r.recipient_id === recipientId)
    );
    current.unshift(newReq);
    saveLocalRequests(current);

    if (userId) {
      try {
        await supabase.from('roommate_requests').insert({
          recipient_id: recipientId,
          message: newReq.message,
        });
      } catch (err) {
        console.warn('Supabase sendRequest fallback:', err);
      }
    }

    return newReq;
  },

  async updateRequestStatus(
    userId: string | null,
    requestId: string,
    status: 'accepted' | 'rejected'
  ): Promise<void> {
    const current = getLocalRequests();
    const target = current.find((r) => r.id === requestId);
    if (target) {
      target.status = status;
      target.updated_at = new Date().toISOString();
      saveLocalRequests(current);
    }

    if (userId) {
      try {
        await supabase.from('roommate_requests').update({
          status,
          updated_at: new Date().toISOString(),
        }).eq('id', requestId);
      } catch (err) {
        console.warn('Supabase updateRequestStatus fallback:', err);
      }
    }
  },

  async cancelRequest(userId: string | null, requestId: string): Promise<void> {
    const current = getLocalRequests().filter((r) => r.id !== requestId);
    saveLocalRequests(current);

    if (userId) {
      try {
        await supabase.from('roommate_requests').delete().eq('id', requestId);
      } catch (err) {
        console.warn('Supabase cancelRequest fallback:', err);
      }
    }
  },

  // Get confirmed matches (requests that are accepted)
  async getConfirmedMatches(
    currentUserId: string | null,
    myPrefs: Preferences | null
  ): Promise<CandidateProfile[]> {
    const effectiveUserId = currentUserId || 'current-user';
    const requests = await this.getAllRequests(currentUserId);
    const acceptedRequests = requests.filter(
      (r) => r.status === 'accepted' && (r.sender_id === effectiveUserId || r.recipient_id === effectiveUserId)
    );

    if (acceptedRequests.length === 0) return [];

    const candidates = await this.getCandidates(currentUserId, myPrefs);
    const candidateMap = new Map<string, CandidateProfile>();
    candidates.forEach((c) => candidateMap.set(c.profile.id, c));

    const matches: CandidateProfile[] = [];
    for (const req of acceptedRequests) {
      const otherId = req.sender_id === effectiveUserId ? req.recipient_id : req.sender_id;
      const candidate = candidateMap.get(otherId);
      if (candidate) {
        matches.push({
          ...candidate,
          requestStatus: 'accepted',
          requestMessage: req.message,
        });
      }
    }

    return matches;
  },
};
