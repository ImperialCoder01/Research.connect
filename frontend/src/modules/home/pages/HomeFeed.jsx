import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { setQuery } from '../../../redux/slices/searchSlice';
import feedService from '../../../services/feed.service';
import scholarService from '../../../services/scholar.service';
import PublicationCard from '../../../components/common/cards/PublicationCard';
import { 
  Sparkles, Award, Star, Compass, Calendar, 
  Briefcase, TrendingUp, Users, RefreshCw, Flame, 
  Clock, CheckCircle, ArrowRight, BrainCircuit, BookOpen,
  Database, PlusCircle, Check, Network, HelpCircle, Download, Loader2
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const HomeFeed = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const { user, profile } = useSelector((state) => state.auth);
  const { communities } = useSelector((state) => state.community);

  const [activeTab, setActiveTab] = useState('recommended'); 
  const [refreshing, setRefreshing] = useState(false);
  const [sharingDataset, setSharingDataset] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // New dataset form state
  const [datasetTitle, setDatasetTitle] = useState('');
  const [datasetDesc, setDatasetDesc] = useState('');
  const [datasetFormat, setDatasetFormat] = useState('CSV');

  // React Query for the main active tab feed (Cached for 5 minutes)
  const { data: feedData, isLoading: feedLoading } = useQuery({
    queryKey: ['feed', activeTab],
    queryFn: async () => {
      let res;
      if (activeTab === 'recommended') res = await feedService.getFeed(1, 10);
      else if (activeTab === 'trending') res = await feedService.getTrending(1, 10);
      else if (activeTab === 'latest') res = await feedService.getLatest(1, 10);
      else if (activeTab === 'following') res = await feedService.getFollowingFeed(1, 10);
      else if (activeTab === 'projects') res = await feedService.getProjects(1, 10);
      else if (activeTab === 'questions') res = await feedService.getQuestions(1, 10);
      else if (activeTab === 'datasets') res = await feedService.getDatasets(1, 10);
      
      if (res && res.success) {
        if (activeTab === 'projects' || activeTab === 'datasets') {
          return res.data?.data?.docs || res.data?.docs || [];
        }
        return res.data?.docs || [];
      }
      return [];
    },
    staleTime: 5 * 60 * 1000,
    keepPreviousData: true
  });

  // React Query for suggested researchers widget (Cached for 10 minutes)
  const { data: suggestionsData, refetch: refetchSuggestions } = useQuery({
    queryKey: ['suggestedResearchers'],
    queryFn: async () => {
      const res = await feedService.getSuggestedResearchers();
      return res.success ? res.data?.data || [] : [];
    },
    staleTime: 10 * 60 * 1000
  });

  // React Query for upcoming conferences widget (Cached for 15 minutes)
  const { data: eventsData } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const res = await feedService.getEvents(1, 3);
      return res.success ? res.data?.docs || [] : [];
    },
    staleTime: 15 * 60 * 1000
  });

  // React Query for Google Scholar citations widget (Cached for 30 minutes)
  const { data: scholarData } = useQuery({
    queryKey: ['scholarProfile'],
    queryFn: async () => {
      try {
        const res = await scholarService.getProfile();
        if (res.success) {
          const [pubsRes, citesRes] = await Promise.all([
            scholarService.getPublications({ page: 1, limit: 5 }),
            scholarService.getCitations()
          ]);
          return {
            profile: res.data,
            publications: pubsRes.success ? pubsRes.data : null,
            citations: citesRes.success ? citesRes.data : null
          };
        }
      } catch (err) {
        console.log('Google Scholar not connected yet.');
      }
      return null;
    },
    retry: false,
    staleTime: 30 * 60 * 1000
  });

  const feed = feedData || [];
  const suggestedResearchers = suggestionsData || [];
  const events = eventsData || [];
  const scholarProfile = scholarData?.profile || null;
  const citations = scholarData?.citations || null;
  const loading = feedLoading;

  const handleRefresh = async () => {
    setRefreshing(true);
    await queryClient.refetchQueries({ queryKey: ['feed', activeTab] });
    setRefreshing(false);
    toast.success('Feed refreshed!');
  };

  const handleSyncScholar = async () => {
    setSyncing(true);
    try {
      const res = await scholarService.reimport();
      if (res.success) {
        toast.success('Scholar Sync started in background!');
        navigate('/research-identity');
      }
    } catch (err) {
      toast.error('Sync failed.');
    } finally {
      setSyncing(false);
    }
  };

  const handleFollowResearcher = async (userId) => {
    try {
      const res = await feedService.toggleFollow(userId);
      if (res.success) {
        toast.success(res.data.following ? 'Researcher followed' : 'Researcher unfollowed');
        refetchSuggestions();
        queryClient.invalidateQueries({ queryKey: ['feed'] });
      }
    } catch (err) {
      toast.error('Could not complete follow operation');
    }
  };

  const handleShareDatasetSubmit = async (e) => {
    e.preventDefault();
    if (!datasetTitle.trim() || !datasetDesc.trim()) return;

    try {
      const res = await feedService.createDataset({
        title: datasetTitle,
        description: datasetDesc,
        format: datasetFormat,
        size: '15 MB'
      });
      if (res.success) {
        toast.success('Dataset shared successfully!');
        setDatasetTitle('');
        setDatasetDesc('');
        setSharingDataset(false);
        queryClient.invalidateQueries({ queryKey: ['feed', 'datasets'] });
      }
    } catch (err) {
      toast.error('Failed to share dataset.');
    }
  };

  const renderCitationChart = () => {
    if (!citations || citations.length === 0) return null;
    const padding = 20;
    const width = 300;
    const height = 120;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;

    const maxCitations = Math.max(...citations.map(c => c.citations)) || 1;
    const years = citations.map(c => c.year);
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);
    const yearRange = maxYear - minYear || 1;

    const points = citations.map(c => {
      const x = padding + ((c.year - minYear) / yearRange) * chartWidth;
      const y = height - padding - (c.citations / maxCitations) * chartHeight;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg className="w-full h-28 mt-2 text-indigo-600 dark:text-indigo-400" viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.2"/>
            <stop offset="100%" stopColor="currentColor" stopOpacity="0"/>
          </linearGradient>
        </defs>
        <polyline fill="none" stroke="currentColor" strokeWidth="2" points={points} strokeLinecap="round" strokeLinejoin="round" />
        {citations.map((c, idx) => {
          const x = padding + ((c.year - minYear) / yearRange) * chartWidth;
          const y = height - padding - (c.citations / maxCitations) * chartHeight;
          return (
            <g key={idx} className="group">
              <circle cx={x} cy={y} r="2.5" className="fill-white stroke-indigo-600 dark:stroke-indigo-400 stroke-2 cursor-pointer" />
            </g>
          );
        })}
      </svg>
    );
  };

  const activeList = activeTab === 'communities' ? communities : feed;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* CENTER FEED SECTION (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Welcome Banner */}
          <div className="bg-[#DBEAFE]/40 border border-blue-100 p-6 sm:p-8 rounded-[18px] shadow-sm text-left relative overflow-hidden bg-gradient-to-r from-blue-50/50 via-[#DBEAFE]/30 to-indigo-50/20">
            <div className="relative z-10 space-y-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                  Welcome back, {user?.firstName || 'Scholar'} <Sparkles className="w-6 h-6 text-indigo-650 animate-pulse shrink-0" />
                </h1>
                <p className="text-sm text-slate-600 mt-1.5 leading-relaxed max-w-2xl font-normal">
                  Your research feed is dynamically optimized. You have <span className="font-bold text-blue-600">5 new publication citations</span> and your profile matches <span className="font-bold text-indigo-600">3 recommended collaborations</span>.
                </p>
              </div>
              
              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2.5 pt-1">
                <button 
                  onClick={() => navigate(user?.profileSlug ? `/profile/${user.profileSlug}` : '/profile')}
                  className="bg-blue-600 hover:bg-blue-750 text-white font-bold text-xs px-4.5 py-2 rounded-xl transition-all shadow-sm active:scale-[0.98]"
                >
                  Continue Profile
                </button>
                <button 
                  onClick={handleSyncScholar}
                  disabled={syncing}
                  className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-205 font-bold text-xs px-4.5 py-2 rounded-xl transition-all shadow-sm active:scale-[0.98] flex items-center gap-1.5"
                >
                  {syncing ? <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" /> : null}
                  Sync Scholar
                </button>
                <button 
                  onClick={() => toast.success('Upload Publication Modal')}
                  className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-205 font-bold text-xs px-4.5 py-2 rounded-xl transition-all shadow-sm active:scale-[0.98]"
                >
                  Create Publication
                </button>
                <button 
                  onClick={() => toast.success('Create Project Modal')}
                  className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-205 font-bold text-xs px-4.5 py-2 rounded-xl transition-all shadow-sm active:scale-[0.98]"
                >
                  Create Project
                </button>
              </div>
            </div>
            
            {/* Ambient Background decoration */}
            <div className="absolute -right-16 -top-16 w-48 h-48 bg-gradient-to-br from-blue-300/20 to-indigo-300/10 rounded-full blur-2xl pointer-events-none" />
          </div>

          {/* Feed Tabs Container */}
          <div className="flex overflow-x-auto whitespace-nowrap border-b border-slate-200 text-sm font-semibold text-slate-500 no-scrollbar">
            {[
              { id: 'recommended', label: 'AI Recommended', icon: Sparkles },
              { id: 'trending', label: 'Trending', icon: Flame },
              { id: 'latest', label: 'Latest', icon: Clock },
              { id: 'following', label: 'Following', icon: Users },
              { id: 'projects', label: 'Projects', icon: Briefcase },
              { id: 'questions', label: 'Q&A', icon: Compass },
              { id: 'datasets', label: 'Datasets', icon: Database },
              { id: 'communities', label: 'Communities', icon: Users }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-3 border-b-2 transition-all font-semibold ${
                    isActive 
                      ? 'border-blue-600 text-blue-600' 
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Share Dataset Form Popup overlay */}
          {sharingDataset && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
              <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white border border-slate-200 p-6 rounded-[18px] max-w-md w-full text-left space-y-4 shadow-xl">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <h3 className="font-extrabold text-sm text-slate-900">Share New Research Dataset</h3>
                  <button onClick={() => setSharingDataset(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                </div>
                <form onSubmit={handleShareDatasetSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">Dataset Title</label>
                    <input type="text" required value={datasetTitle} onChange={e => setDatasetTitle(e.target.value)} placeholder="e.g. Brain Wave recordings..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">Description & Methodology</label>
                    <textarea required value={datasetDesc} onChange={e => setDatasetDesc(e.target.value)} placeholder="Explain variables, frequency, and extraction..." rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">Format</label>
                    <select value={datasetFormat} onChange={e => setDatasetFormat(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600">
                      <option>CSV</option>
                      <option>JSON</option>
                      <option>HDF5</option>
                      <option>Parquet</option>
                    </select>
                  </div>
                  <button type="submit" className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm">
                    Post Shared Dataset
                  </button>
                </form>
              </motion.div>
            </div>
          )}

          {/* Feed List */}
          <div className="space-y-6">
            {loading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="bg-white border border-slate-200 rounded-[18px] p-6 space-y-4 animate-pulse shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-slate-100 rounded w-1/4"></div>
                      <div className="h-3 bg-slate-100 rounded w-1/3"></div>
                    </div>
                  </div>
                  <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                  <div className="h-20 bg-slate-100 rounded w-full"></div>
                </div>
              ))
            ) : activeList.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-[18px] p-12 text-center text-slate-500 shadow-sm">
                <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="font-bold text-sm text-slate-900">No items found in this section.</p>
                <p className="text-xs text-slate-500 mt-1">Try following other researchers or exploring trending papers.</p>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {activeTab === 'projects' ? (
                  activeList.map(proj => (
                    <motion.div 
                      key={proj._id}
                      className="bg-white border border-slate-200 p-6 rounded-[18px] shadow-sm text-left relative overflow-hidden transition-all hover:shadow-lg"
                      whileHover={{ y: -2 }}
                    >
                      <span className="absolute top-4 right-4 text-xs font-bold bg-[#DBEAFE] text-blue-600 px-2.5 py-0.5 rounded-full">
                        {proj.status}
                      </span>
                      <h3 className="font-bold text-base text-slate-900 leading-snug">{proj.title}</h3>
                      <p className="text-xs text-slate-500 mt-1">Lead: {proj.userId?.fullName || 'Researcher'} • {proj.researchAreas?.join(', ')}</p>
                      <p className="text-sm text-slate-600 mt-3 leading-relaxed font-normal">{proj.description}</p>
                    </motion.div>
                  ))
                ) : activeTab === 'questions' ? (
                  activeList.map(q => (
                    <motion.div 
                      key={q._id}
                      className="bg-white border border-slate-200 p-6 rounded-[18px] shadow-sm text-left hover:shadow-lg transition-all"
                      whileHover={{ y: -2 }}
                    >
                      <h3 className="font-bold text-base text-slate-900 flex items-center gap-2 leading-snug">
                        <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded text-xs font-bold">Q</span>
                        {q.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">Asked by {q.userId?.fullName || 'Scholar'} • {q.researchAreas?.join(', ')}</p>
                      <p className="text-sm text-slate-600 mt-3 leading-relaxed font-normal">{q.description}</p>
                    </motion.div>
                  ))
                ) : activeTab === 'datasets' ? (
                  <div className="space-y-4">
                    <div className="flex justify-end">
                      <button 
                        onClick={() => setSharingDataset(true)}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                      >
                        <PlusCircle className="w-4 h-4" /> Share Dataset
                      </button>
                    </div>
                    {activeList.map(ds => (
                      <motion.div 
                        key={ds._id}
                        className="bg-white border border-slate-200 p-6 rounded-[18px] shadow-sm text-left relative hover:shadow-lg transition-all"
                        whileHover={{ y: -2 }}
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <h3 className="font-bold text-base text-slate-900 flex items-center gap-1.5 leading-snug">
                              <Database className="w-4.5 h-4.5 text-blue-500" />
                              {ds.title}
                            </h3>
                            <p className="text-xs text-slate-500 mt-1">Shared by {ds.userId?.fullName || 'Scholar'} • Format: <span className="font-bold text-indigo-600">{ds.format}</span> ({ds.size || '12 MB'})</p>
                          </div>
                          <button 
                            onClick={() => {
                              toast.success('Downloading dataset...');
                              if (ds.url) window.open(ds.url, '_blank');
                            }}
                            className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 rounded-lg flex items-center gap-1.5 transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" /> Download
                          </button>
                        </div>
                        <p className="text-sm text-slate-600 mt-3 leading-relaxed font-normal">{ds.description}</p>
                      </motion.div>
                    ))}
                  </div>
                ) : activeTab === 'communities' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {activeList.map(comm => (
                      <motion.div
                        key={comm.id}
                        className="bg-white border border-slate-200 p-6 rounded-[18px] shadow-sm hover:shadow-lg transition-all text-left flex flex-col justify-between"
                        whileHover={{ y: -2 }}
                      >
                        <div className="space-y-2">
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-605 flex items-center justify-center font-bold">
                            <Users className="w-5 h-5" />
                          </div>
                          <h3 className="font-bold text-base text-slate-900 leading-snug">{comm.name}</h3>
                          <p className="text-xs text-slate-500 font-normal">{comm.members} active researchers</p>
                        </div>
                        <button 
                          onClick={() => toast.success(`Joined ${comm.name}!`)}
                          className="mt-4 w-full py-2 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 border border-slate-200 hover:border-blue-200 text-slate-750 rounded-xl text-xs font-bold transition-all"
                        >
                          Join Community
                        </button>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  activeList.map(pub => (
                    <PublicationCard 
                      key={pub._id || pub.id} 
                      pub={pub} 
                    />
                  ))
                )}
              </AnimatePresence>
            )}
          </div>

        </div>

        {/* RIGHT SIDEBAR SECTION (4 Cols) */}
        <div className="lg:col-span-4 space-y-6 text-left">
          
          {/* Widget 1: Research Score */}
          <div className="bg-white border border-slate-200 p-6 rounded-[18px] shadow-sm space-y-4">
            <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-500" /> Academic Standing
            </h3>
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path className="text-slate-100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="text-blue-600" strokeDasharray={`${profile?.metrics?.researchScore || 75}, 100`} strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <span className="absolute text-sm font-extrabold text-slate-900">{profile?.metrics?.researchScore || 75}</span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 leading-snug">Research Score</h4>
                <p className="text-[11px] text-slate-500 mt-1 font-normal">Global percentile computed from publications, citations and co-authors.</p>
              </div>
            </div>
          </div>

          {/* Widget 2: Google Scholar */}
          <div className="bg-white border border-slate-200 p-6 rounded-[18px] shadow-sm space-y-4">
            <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Network className="w-4 h-4 text-indigo-500" /> Google Scholar Profile
              </span>
              <button 
                onClick={handleSyncScholar}
                disabled={syncing}
                className="p-1 rounded hover:bg-slate-50 text-slate-500 transition-colors"
                title="Sync Profile"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin text-blue-600' : ''}`} />
              </button>
            </h3>
            {scholarProfile ? (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold">
                  <div className="p-2 bg-slate-50 border border-slate-100 rounded-xl">
                    <span className="text-[10px] text-slate-450 block font-normal">Citations</span>
                    <span className="font-extrabold text-sm text-slate-900">{scholarProfile.citations || 0}</span>
                  </div>
                  <div className="p-2 bg-slate-50 border border-slate-100 rounded-xl">
                    <span className="text-[10px] text-slate-450 block font-normal">h-index</span>
                    <span className="font-extrabold text-sm text-slate-900">{scholarProfile.hIndex || 0}</span>
                  </div>
                  <div className="p-2 bg-slate-50 border border-slate-100 rounded-xl">
                    <span className="text-[10px] text-slate-450 block font-normal">i10-index</span>
                    <span className="font-extrabold text-sm text-slate-900">{scholarProfile.i10Index || 0}</span>
                  </div>
                </div>
                {citations && citations.length > 0 && (
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">Citations History</span>
                    {renderCitationChart()}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3 text-center py-2">
                <p className="text-xs text-slate-500 leading-relaxed font-normal">Link your Google Scholar profile to import publication metrics automatically.</p>
                <button 
                  onClick={() => navigate('/research-identity')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-750 text-white rounded-xl text-xs font-bold transition-all w-full shadow-sm"
                >
                  Link Google Scholar Profile
                </button>
              </div>
            )}
          </div>

          {/* Widget 3: AI Research Insight */}
          <div className="bg-[#EDE9FE] border border-purple-200/60 p-6 rounded-[18px] shadow-sm space-y-4">
            <h3 className="font-bold text-xs text-indigo-700 uppercase tracking-wider flex items-center gap-1.5">
              <BrainCircuit className="w-4 h-4 text-indigo-600 animate-pulse" /> AI Research Insight
            </h3>
            <div className="space-y-3 text-xs text-indigo-950 font-normal">
              <p className="leading-relaxed">
                "We noticed an overlap between your interest in <span className="font-bold text-indigo-900">NLP</span> and Sarah's recent work on <span className="font-bold text-indigo-900">Attention multi-modal Search</span>."
              </p>
              <div className="pt-2 border-t border-indigo-200/40 space-y-2 text-[11px]">
                <div className="flex justify-between">
                  <span className="font-bold text-indigo-850">Research Gap:</span>
                  <span>Low-resource models</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-indigo-850">Suggested Paper:</span>
                  <span className="underline cursor-pointer hover:text-indigo-700 truncate max-w-[150px]">Attention is All You Need</span>
                </div>
              </div>
            </div>
          </div>

          {/* Widget 4: Upcoming Conferences */}
          <div className="bg-white border border-slate-200 p-6 rounded-[18px] shadow-sm space-y-4">
            <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-500" /> Upcoming Conferences
            </h3>
            <div className="space-y-3.5">
              {events.slice(0, 3).map((e, idx) => (
                <div key={idx} className="flex gap-3 text-xs text-left">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex flex-col items-center justify-center font-bold border border-emerald-100/60 shrink-0">
                    <span className="text-[10px] uppercase font-black">{e.type}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 hover:underline cursor-pointer leading-tight">{e.title}</h4>
                    <p className="text-[10px] text-slate-450 mt-1">Deadline: {new Date(e.date).toLocaleDateString()} • {e.organization}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Widget 5: Funding Opportunities [NEW] */}
          <div className="bg-[#FEF3C7] border border-amber-200/50 p-6 rounded-[18px] shadow-sm space-y-4">
            <h3 className="font-bold text-xs text-amber-800 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-600" /> Funding Opportunities
            </h3>
            <div className="space-y-3">
              <div className="text-xs">
                <h4 className="font-bold text-amber-950 leading-tight">NSF AI Research Grant 2026</h4>
                <p className="text-[10px] text-amber-800 mt-1">Up to $500,000 for foundational research in multi-modal LLMs.</p>
                <div className="flex justify-between items-center mt-3.5 pt-2 border-t border-amber-200/40">
                  <span className="text-[10px] font-bold text-amber-700">Deadline: Oct 15, 2026</span>
                  <button 
                    onClick={() => toast.success('Redirecting to grant portal...')}
                    className="bg-amber-650 hover:bg-amber-700 text-white font-bold px-3 py-1.5 rounded-lg text-[10px] transition-all shadow-sm active:scale-95"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Widget 6: Trending Keywords [NEW] */}
          <div className="bg-white border border-slate-200 p-6 rounded-[18px] shadow-sm space-y-4">
            <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-500" /> Trending Keywords
            </h3>
            <div className="flex flex-wrap gap-2">
              {['Multi-Modal', 'Transformers', 'NLP', 'Vector Search', 'AI Safety', 'Bio-Informatics'].map(tag => (
                <span 
                  key={tag}
                  onClick={() => {
                    dispatch(setQuery(tag));
                    navigate(`/search?q=${encodeURIComponent(tag)}`);
                  }}
                  className="text-xs bg-blue-50/60 hover:bg-[#DBEAFE] text-blue-600 px-2.5 py-1 rounded-full font-bold cursor-pointer transition-all duration-150"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Widget 7: Suggested Researchers */}
          <div className="bg-white border border-slate-200 p-6 rounded-[18px] shadow-sm space-y-4">
            <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-500" /> Suggested Researchers
            </h3>
            <div className="space-y-3">
              {suggestedResearchers.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-2">No recommendations at this time.</p>
              ) : (
                suggestedResearchers.map((res, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-2 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs overflow-hidden shrink-0 border border-slate-200">
                        {res.avatar ? (
                          <img src={res.avatar} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span>{res.name[0]}</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-xs text-slate-900 leading-tight truncate">{res.name}</h4>
                        <p className="text-[9px] text-slate-555 line-clamp-1">{res.designation || 'Scholar'} • {res.institution || 'Institute'}</p>
                        {res.mutualInterests?.length > 0 && (
                          <span className="text-[8px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded font-black mt-0.5 inline-block">
                            {res.mutualInterests[0]}
                          </span>
                        )}
                      </div>
                    </div>
                    <button 
                      onClick={() => handleFollowResearcher(res.userId)}
                      className="text-[10px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-2.5 py-1.5 rounded-lg shrink-0 transition-colors"
                    >
                      Follow
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Widget 8: Profile Completion [NEW] */}
          <div className="bg-white border border-slate-200 p-6 rounded-[18px] shadow-sm space-y-4">
            <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" /> Profile Completion
            </h3>
            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path className="text-slate-100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="text-emerald-500" strokeDasharray="80, 100" strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <span className="absolute text-xs font-black text-slate-900">80%</span>
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-xs text-slate-900 leading-tight">Almost complete!</h4>
                <p className="text-[10px] text-slate-450 leading-tight font-normal">Add remaining details to reach maximum visibility.</p>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 space-y-2 text-[11px] font-semibold text-slate-600">
              <div className="flex items-center gap-2 text-emerald-600">
                <Check className="w-3.5 h-3.5 shrink-0" /> Verified Email Address
              </div>
              <div className="flex items-center gap-2 text-emerald-600">
                <Check className="w-3.5 h-3.5 shrink-0" /> Academic Identifier Connected
              </div>
              <div 
                className="flex items-center gap-2 text-slate-500 hover:text-blue-600 cursor-pointer transition-colors" 
                onClick={() => navigate(user?.profileSlug ? `/profile/${user.profileSlug}` : '/profile')}
              >
                <PlusCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" /> Add Co-Authors & Affiliations
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default HomeFeed;
