import { useState, useEffect, useCallback } from 'react';
import {
  Inbox,
  Send,
  Check,
  X,
  Clock,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Sparkles,
  MapPin,
  Briefcase,
  Compass,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { roommateService } from '@/services/roommateService';
import { CompatibilityBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type { CandidateProfile, RoommateRequest } from '@/types';

interface RequestsPageProps {
  onViewProfile?: (candidate: CandidateProfile) => void;
  onGoToDiscover?: () => void;
}

interface EnrichedRequestItem {
  request: RoommateRequest;
  candidate: CandidateProfile | null;
}

export function RequestsPage({ onViewProfile, onGoToDiscover }: RequestsPageProps) {
  const { user, preferences } = useAuth();
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  const [receivedList, setReceivedList] = useState<EnrichedRequestItem[]>([]);
  const [sentList, setSentList] = useState<EnrichedRequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionInProgressId, setActionInProgressId] = useState<string | null>(null);

  const loadAll = useCallback(async () => {
    setLoading(true);
    const effectiveUid = user?.id || 'current-user';
    const allCandidates = await roommateService.getCandidates(user?.id ?? null, preferences);
    const candidateMap = new Map<string, CandidateProfile>();
    allCandidates.forEach((c) => candidateMap.set(c.profile.id, c));

    const requests = await roommateService.getAllRequests(user?.id ?? null);

    const received: EnrichedRequestItem[] = [];
    const sent: EnrichedRequestItem[] = [];

    for (const r of requests) {
      if (r.recipient_id === effectiveUid) {
        received.push({
          request: r,
          candidate: candidateMap.get(r.sender_id) ?? null,
        });
      } else if (r.sender_id === effectiveUid) {
        sent.push({
          request: r,
          candidate: candidateMap.get(r.recipient_id) ?? null,
        });
      }
    }

    setReceivedList(received);
    setSentList(sent);
    setLoading(false);
  }, [user, preferences]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const handleUpdateStatus = async (requestId: string, status: 'accepted' | 'rejected') => {
    setActionInProgressId(requestId);
    await roommateService.updateRequestStatus(user?.id ?? null, requestId, status);
    setReceivedList((prev) =>
      prev.map((item) =>
        item.request.id === requestId
          ? { ...item, request: { ...item.request, status } }
          : item
      )
    );
    setActionInProgressId(null);
  };

  const handleCancelRequest = async (requestId: string) => {
    setActionInProgressId(requestId);
    await roommateService.cancelRequest(user?.id ?? null, requestId);
    setSentList((prev) => prev.filter((item) => item.request.id !== requestId));
    setActionInProgressId(null);
  };

  const pendingReceivedCount = receivedList.filter((r) => r.request.status === 'pending').length;

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-5 pt-6 pb-3 sticky top-0 z-10 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Roommate Requests</h1>
        <p className="text-sm text-[#647488] mt-0.5">
          Manage incoming invitations and your sent requests
        </p>

        {/* Tab Switcher */}
        <div className="flex bg-[#F1F5F9] p-1 rounded-2xl mt-4">
          <button
            onClick={() => setActiveTab('received')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'received'
                ? 'bg-white text-[#5B5BFF] shadow-sm'
                : 'text-[#647488] hover:text-[#0F172A]'
            }`}
          >
            <Inbox size={15} />
            Received
            {pendingReceivedCount > 0 && (
              <span className="w-4 h-4 bg-[#EF4444] text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                {pendingReceivedCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'sent'
                ? 'bg-white text-[#5B5BFF] shadow-sm'
                : 'text-[#647488] hover:text-[#0F172A]'
            }`}
          >
            <Send size={15} />
            Sent Requests ({sentList.length})
          </button>
        </div>
      </div>

      {/* Main List */}
      <div className="px-4 py-4 flex-1">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-8 h-8 border-3 border-[#5B5BFF] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-[#647488]">Loading requests…</p>
          </div>
        ) : activeTab === 'received' ? (
          /* Received Requests Tab */
          receivedList.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 border border-gray-100 text-center flex flex-col items-center my-6 shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-[#5B5BFF]/10 text-[#5B5BFF] flex items-center justify-center mb-3">
                <Inbox size={28} />
              </div>
              <h3 className="text-base font-bold text-[#0F172A]">No incoming requests</h3>
              <p className="text-xs text-[#647488] max-w-xs mt-1 mb-5 leading-relaxed">
                When someone wants to connect with you based on your lifestyle profile, their request will appear here.
              </p>
              {onGoToDiscover && (
                <Button variant="secondary" size="sm" onClick={onGoToDiscover}>
                  <Compass size={14} />
                  Explore Roommates
                </Button>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {receivedList.map(({ request, candidate }) => {
                if (!candidate) return null;
                const photo =
                  candidate.profile.avatar_url ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.profile.display_name)}&background=5B5BFF&color=fff&size=200`;

                return (
                  <div
                    key={request.id}
                    className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm flex flex-col gap-3"
                  >
                    {/* Top Row with Avatar & Name */}
                    <div
                      className="flex items-start gap-3 cursor-pointer"
                      onClick={() => onViewProfile && onViewProfile(candidate)}
                    >
                      <div className="relative w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100">
                        <img
                          src={photo}
                          alt={candidate.profile.display_name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-[#0F172A] text-base truncate">
                            {candidate.profile.display_name}
                          </h3>
                          <CompatibilityBadge score={candidate.compatibility.score} />
                        </div>

                        <div className="flex items-center gap-2 text-xs text-[#647488] mt-0.5">
                          <span className="flex items-center gap-1">
                            <Briefcase size={12} /> {candidate.profile.occupation || 'Professional'}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin size={12} /> {candidate.profile.city || 'Ahmedabad'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Note message */}
                    {request.message && (
                      <div className="bg-[#F8FAFC] rounded-2xl p-3 text-xs text-[#0F172A] border border-gray-100 italic">
                        "{request.message}"
                      </div>
                    )}

                    {/* Action buttons */}
                    {request.status === 'pending' ? (
                      <div className="flex gap-2 pt-1">
                        <Button
                          variant="secondary"
                          size="sm"
                          fullWidth
                          loading={actionInProgressId === request.id}
                          onClick={() => handleUpdateStatus(request.id, 'rejected')}
                        >
                          <X size={14} className="text-red-500" />
                          Decline
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          fullWidth
                          loading={actionInProgressId === request.id}
                          onClick={() => handleUpdateStatus(request.id, 'accepted')}
                        >
                          <Check size={14} />
                          Accept &amp; Connect
                        </Button>
                      </div>
                    ) : (
                      <div
                        className={`text-center py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 ${
                          request.status === 'accepted'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-red-50 text-red-600'
                        }`}
                      >
                        {request.status === 'accepted' ? (
                          <>
                            <CheckCircle2 size={14} />
                            Accepted — Added to Confirmed Matches!
                          </>
                        ) : (
                          <>
                            <XCircle size={14} />
                            Request Declined
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )
        ) : (
          /* Sent Requests Tab */
          sentList.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 border border-gray-100 text-center flex flex-col items-center my-6 shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 text-[#647488] flex items-center justify-center mb-3">
                <Send size={28} />
              </div>
              <h3 className="text-base font-bold text-[#0F172A]">No requests sent yet</h3>
              <p className="text-xs text-[#647488] max-w-xs mt-1 mb-5">
                Browse profiles on the Discover tab and send requests to people who match your lifestyle.
              </p>
              {onGoToDiscover && (
                <Button variant="primary" size="sm" onClick={onGoToDiscover}>
                  <Compass size={14} />
                  Discover Roommates
                </Button>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {sentList.map(({ request, candidate }) => {
                if (!candidate) return null;
                const photo =
                  candidate.profile.avatar_url ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.profile.display_name)}&background=5B5BFF&color=fff&size=200`;

                return (
                  <div
                    key={request.id}
                    className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm flex flex-col gap-3"
                  >
                    <div
                      className="flex items-center gap-3 cursor-pointer"
                      onClick={() => onViewProfile && onViewProfile(candidate)}
                    >
                      <div className="w-12 h-12 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100">
                        <img
                          src={photo}
                          alt={candidate.profile.display_name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-[#0F172A] text-sm truncate">
                            {candidate.profile.display_name}
                          </h4>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              request.status === 'accepted'
                                ? 'bg-emerald-100 text-emerald-700'
                                : request.status === 'pending'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-red-100 text-red-600'
                            }`}
                          >
                            {request.status === 'accepted'
                              ? 'Accepted'
                              : request.status === 'pending'
                              ? 'Pending'
                              : 'Declined'}
                          </span>
                        </div>
                        <p className="text-xs text-[#647488] mt-0.5">
                          {candidate.profile.city || 'Ahmedabad'} • {candidate.compatibility.score}% Match
                        </p>
                      </div>
                    </div>

                    {request.status === 'pending' && (
                      <div className="flex justify-end pt-1 border-t border-gray-50">
                        <button
                          onClick={() => handleCancelRequest(request.id)}
                          disabled={actionInProgressId === request.id}
                          className="text-xs text-[#647488] hover:text-[#EF4444] font-medium"
                        >
                          Cancel Request
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>
    </div>
  );
}
