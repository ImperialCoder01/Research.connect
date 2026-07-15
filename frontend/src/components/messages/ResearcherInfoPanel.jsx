import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMessaging } from '../../context/MessagingContext';
import profileService from '../../services/profile.service';
import feedService from '../../services/feed.service';
import { ResearcherSkeleton } from './Skeletons';
import { useCountUp } from '../../hooks/useCountUp';
import { Beaker, Cloud, Globe } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Avatar from '../ui/Avatar';

function IconByName({ name, className, style }) {
  if (name === 'beaker') return <Beaker size={16} className={className} style={style} />;
  if (name === 'cloud') return <Cloud size={16} className={className} style={style} />;
  return <Globe size={16} className={className} style={style} />;
}

export default function ResearcherInfoPanel() {
  const navigate = useNavigate();
  const { activeConversationId, getOtherParticipant } = useMessaging();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const otherParticipant = getOtherParticipant(activeConversationId);
  const userId = otherParticipant?.profileSlug || otherParticipant?.backendId || otherParticipant?._id;

  useEffect(() => {
    if (!userId) {
      setProfile(null);
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    profileService.getPublicProfile(userId)
      .then(res => {
        if (isMounted) setProfile(res.data || res);
      })
      .catch(err => {
        if (isMounted) {
          // toast.error("Failed to load profile"); // Silent fail or log
          console.error("Failed to load profile:", err);
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => { isMounted = false; };
  }, [userId]);

  const citations = useCountUp(profile?.metrics?.citationsCount || profile?.metrics?.totalCitations || 0, 1500);
  const hIndex = useCountUp(profile?.metrics?.hIndex || 0, 1000);

  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);

  useEffect(() => {
    // Check if we are following this user
    if (userId) {
      feedService.getFollowingList().then(res => {
        const following = res?.data || res || [];
        // Support array of ids or array of objects
        const isFollowed = following.some(f => f === userId || f._id === userId || f.id === userId);
        setIsFollowing(isFollowed);
      }).catch(err => console.error("Failed to fetch following list", err));
    }
  }, [userId]);

  const handleFollowToggle = async () => {
    if (isFollowLoading) return;
    setIsFollowLoading(true);
    try {
      await feedService.toggleFollow(userId);
      setIsFollowing(!isFollowing);
      if (!isFollowing) {
        toast.success(`You are now following ${profile?.fullName}`);
      } else {
        toast.info(`Unfollowed ${profile?.fullName}`);
      }
    } catch (err) {
      toast.error('Failed to toggle follow status');
    } finally {
      setIsFollowLoading(false);
    }
  };

  if (!activeConversationId || !otherParticipant) return null;

  return (
    <aside className="w-full h-full flex flex-col overflow-y-auto custom-scrollbar anim-panel-slide-in">
      {isLoading || !profile ? (
        <ResearcherSkeleton />
      ) : (
        <>
          {/* Profile Top */}
          <div className="p-6 flex flex-col items-center text-center border-b border-[#E2E8F0] group">
            <div className="profile-avatar-wrapper mb-4 cursor-pointer anim-breathe group hover:scale-105 transition-transform duration-300">
              <Avatar
                src={profile.profileImage || profile.avatarUrlLg || profile.avatarUrl}
                name={profile.fullName}
                size="3xl"
                showBorder
              />
            </div>
            <h2 className="font-bold text-lg text-[#0F172A] group-hover:text-[#2563EB] transition-colors">{profile.fullName}</h2>
            <p className="text-sm text-[#475569] mt-0.5">
              {[profile.positionTitle, profile.institution || profile.department].filter(Boolean).join(' • ')}
            </p>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => navigate(`/profile/${profile?.profileSlug || profile?.username || userId}`)}
                className="px-4 py-2 bg-[#DBEAFE] text-[#2563EB] rounded-lg text-sm font-semibold hover:bg-[#BFDBFE] transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-sm"
              >
                Profile
              </button>
              <button
                onClick={handleFollowToggle}
                disabled={isFollowLoading}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-sm ${
                  isFollowLoading ? 'opacity-70 cursor-wait' : ''
                } ${isFollowing
                    ? 'bg-[#10B981] text-white hover:bg-[#059669] border border-transparent'
                    : 'border border-[#E2E8F0] text-[#0F172A] hover:bg-[#DBEAFE] hover:border-[#BFDBFE] hover:text-[#2563EB]'
                  }`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>
          </div>

          {/* Body sections */}
          <div className="p-6 space-y-7">
            {/* About Section */}
            {(profile.bio || profile.about) && (
              <div className="anim-fade-up" style={{ animationDelay: '100ms' }}>
                <h4 className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-widest mb-3">
                  About
                </h4>
                <p className="text-xs text-[#475569] leading-relaxed">
                  {profile.bio || profile.about}
                </p>
              </div>
            )}

            {/* Research Areas */}
            {profile.skills?.length > 0 && (
              <div className="anim-fade-up" style={{ animationDelay: '150ms' }}>
                <h4 className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-widest mb-3">
                  Research Areas
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {profile.skills.map((skill, idx) => {
                    const tag = typeof skill === 'string' ? skill : skill.name;
                    if (!tag) return null;
                    return (
                      <span
                        key={idx}
                        className="px-2.5 py-1.5 bg-blue-50/60 text-[#2563EB] rounded-lg text-[10px] font-bold"
                      >
                        {tag}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Research Impact */}
            <div className="anim-fade-up" style={{ animationDelay: '200ms' }}>
              <h4 className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-widest mb-3">
                Research Impact
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0] flex-1">
                  <span className="text-[10px] font-bold text-[#64748B] tracking-wider uppercase mb-1 block">Citations</span>
                  <span className="text-2xl font-bold text-[#2563EB] hover-num-pop">{citations.toLocaleString()}</span>
                </div>
                <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0] flex-1">
                  <span className="text-[10px] font-bold text-[#64748B] tracking-wider uppercase mb-1 block">H-Index</span>
                  <span className="text-2xl font-bold text-[#2563EB] hover-num-pop">{hIndex}</span>
                </div>
              </div>
            </div>

            {/* Top Publications */}
            {profile.topPublications?.length > 0 && (
              <div className="anim-fade-up" style={{ animationDelay: '300ms' }}>
                <h4 className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-widest mb-3">
                  Top Publications
                </h4>
                <div className="space-y-4">
                  {profile.topPublications.map((pub, idx) => (
                    <div
                      key={idx}
                      className="pub-row cursor-pointer"
                      onClick={() => navigate(`/profile/${profile?.profileSlug || profile?.username || userId}`)}
                    >
                      <p className="pub-title text-sm font-medium text-[#0F172A] line-clamp-2">
                        {pub.title}
                      </p>
                      <p className="text-xs text-[#475569] mt-0.5">{pub.journal} • {pub.year}</p>
                    </div>
                  ))}
                  <button
                    onClick={() => navigate(`/profile/${profile?.profileSlug || profile?.username || userId}`)}
                    className="view-all-btn block mx-auto text-xs font-bold text-[#2563EB] py-1"
                  >
                    View all publications
                  </button>
                </div>
              </div>
            )}

            {/* Shared Projects */}
            {profile.sharedProjects?.length > 0 && (
              <div className="anim-fade-up" style={{ animationDelay: '400ms' }}>
                <h4 className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-widest mb-3">
                  Shared Projects
                </h4>
                <div className="space-y-2">
                  {profile.sharedProjects.map(proj => (
                    <div key={proj.id} className="project-row flex items-center gap-3 p-2 rounded-lg cursor-pointer">
                      <div
                        className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0 border-l-4"
                        style={{ background: proj.bgColor, borderColor: proj.color }}
                      >
                        <IconByName name={proj.icon} className="project-icon" style={{ color: proj.color }} />
                      </div>
                      <span className="text-sm font-medium text-[#0F172A]">{proj.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </aside>
  );
}
