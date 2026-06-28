import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  PieChart, Pie, RadarChart, PolarGrid, PolarAngleAxis, 
  PolarRadiusAxis, Radar, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip
} from 'recharts';
import { 
  Sparkles, BookOpen, TrendingUp, Award, Plus, Bookmark, 
  ExternalLink, ChevronRight, UserPlus, Calendar, Users, 
  ArrowUpRight, ArrowDownRight, Eye, Download, MessageSquare, 
  Bell, FileText, Settings, ShieldAlert, CheckCircle, RefreshCw
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

// Color definitions matching design system
const COLORS = ['#2563EB', '#4F46E5', '#22C55E', '#F59E0B', '#EF4444', '#EC4899'];

const DashboardHome = () => {
  const { user } = useAuth();
  
  // States
  const [metrics, setMetrics] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [collaborations, setCollaborations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Top Publications active table tab & filters
  const [pubTableTab, setPubTableTab] = useState('mostViewed');
  const [filterYear, setFilterYear] = useState('');
  const [filterType, setFilterType] = useState('');

  // Notification drawer state
  const [notifDrawerOpen, setNotifDrawerOpen] = useState(false);
  const [recentNotifications, setRecentNotifications] = useState([]);

  // Fetch all dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      const [metricsRes, analyticsRes, recsRes, collabRes, notifRes] = await Promise.all([
        api.get('/dashboard/metrics'),
        api.get('/dashboard/analytics'),
        api.get('/dashboard/recommendations'),
        api.get('/collaborations'),
        api.get('/notifications?limit=5')
      ]);

      setMetrics(metricsRes.data.data);
      setAnalytics(analyticsRes.data.data);
      setRecommendations(recsRes.data.data);
      setCollaborations(collabRes.data.data);
      setRecentNotifications(notifRes.data.data || []);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError('Could not load all dashboard analytics. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse text-left py-4">
        {/* Welcome Banner Skeleton */}
        <div className="h-44 bg-slate-200 rounded-3xl"></div>
        {/* Metric Cards Skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(n => <div key={n} className="h-28 bg-slate-200 rounded-2xl"></div>)}
        </div>
        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-80 bg-slate-200 rounded-2xl lg:col-span-2"></div>
          <div className="h-80 bg-slate-200 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-white border border-red-200 rounded-2xl shadow-sm text-red-500 max-w-lg mx-auto mt-12">
        <ShieldAlert className="w-12 h-12 mx-auto mb-3" />
        <h3 className="font-extrabold text-lg">Failed to Load Dashboard</h3>
        <p className="text-sm mt-1 mb-4">{error}</p>
        <button 
          onClick={fetchDashboardData}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all"
        >
          Retry Fetch
        </button>
      </div>
    );
  }

  // Filters for top publications list
  const getFilteredPublicationsList = () => {
    if (!analytics?.topPublications) return [];
    let list = analytics.topPublications[pubTableTab] || [];
    if (filterYear) {
      list = list.filter(p => p.publicationYear === parseInt(filterYear, 10));
    }
    if (filterType) {
      list = list.filter(p => p.publicationType.toLowerCase() === filterType.toLowerCase());
    }
    return list;
  };

  const filteredPubs = getFilteredPublicationsList();

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 max-w-7xl mx-auto px-1 py-2 text-left relative">
      
      {/* Main Dashboard Panel (3 columns) */}
      <div className="xl:col-span-3 space-y-8">
        
        {/* 1. Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-blue-500/10 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-10 translate-x-12 translate-y-12">
            <Award className="w-64 h-64" />
          </div>
          <div className="flex items-center gap-4 relative z-10">
            <img 
              src={metrics?.profilePhoto || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'}
              alt={user.fullName}
              className="w-16 h-16 rounded-full object-cover border-2 border-white/20 shadow-md"
            />
            <div className="space-y-1">
              <span className="text-xs font-bold bg-white/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
                Researcher Profile
              </span>
              <h2 className="text-xl md:text-2xl font-extrabold font-display">
                Welcome Back, Dr. {user.fullName}
              </h2>
              <p className="text-white/80 text-xs font-medium">
                {metrics?.institution || 'Stanford University'} • {metrics?.country || 'United States'}
              </p>
            </div>
          </div>

          {/* Profile Completion Tracker */}
          <div className="shrink-0 flex flex-col justify-center bg-white/10 border border-white/15 rounded-2xl p-4 min-w-[200px] relative z-10">
            <div className="flex justify-between items-center text-xs font-bold mb-2">
              <span>Profile Completion</span>
              <span>{metrics?.profileCompletion || 0}%</span>
            </div>
            <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-400 h-full rounded-full transition-all duration-500" 
                style={{ width: `${metrics?.profileCompletion || 0}%` }}
              ></div>
            </div>
            <Link to="/profile" className="text-[10px] font-extrabold text-blue-200 hover:text-white mt-3 block text-right">
              Complete Profile &rarr;
            </Link>
          </div>
        </div>

        {/* 2. Today's Activity & Quick Stats Cards */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Publications', val: metrics?.totalPublications || 0, icon: <FileText className="w-4 h-4 text-blue-600" />, trend: metrics?.monthlyGrowth },
            { label: 'Citations', val: metrics?.totalCitations || 0, icon: <Award className="w-4 h-4 text-emerald-600" />, trend: metrics?.citationGrowth },
            { label: 'h-index', val: metrics?.hIndex || 0, icon: <TrendingUp className="w-4 h-4 text-indigo-600" />, sub: `i10-index: ${metrics?.i10Index || 0}` },
            { label: 'Impact Score', val: metrics?.researchScore || 0, icon: <Sparkles className="w-4 h-4 text-amber-600" />, sub: 'Top 5% in field' }
          ].map((item, index) => (
            <div 
              key={index} 
              className="bg-white border border-slate-200/80 rounded-2xl p-5 hover:border-blue-500/20 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{item.label}</span>
                <div className="p-1.5 bg-slate-50 border border-slate-100 rounded-lg">{item.icon}</div>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight font-display">{item.val}</h3>
                <div className="flex items-center gap-1 mt-1 text-[10px] font-bold">
                  {item.trend !== undefined ? (
                    <span className="text-emerald-600 flex items-center gap-0.5">
                      <ArrowUpRight className="w-3.5 h-3.5" /> +{item.trend}%
                    </span>
                  ) : (
                    <span className="text-slate-400 font-semibold">{item.sub}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* 3. Research Metrics mini-growth sections */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 border-t border-slate-200/60 pt-6">
          {[
            { label: 'Reads', count: metrics?.reads, change: '+12.4%', up: true },
            { label: 'Downloads', count: metrics?.downloads, change: '+8.3%', up: true },
            { label: 'Profile Views', count: metrics?.profileViews, change: '-2.1%', up: false },
            { label: 'Followers', count: metrics?.followers, change: '+15.2%', up: true }
          ].map((item, index) => (
            <div key={index} className="p-4 bg-slate-50 rounded-xl border border-slate-200/40 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{item.label}</span>
                <h4 className="text-base font-extrabold text-slate-800 mt-0.5">{item.count}</h4>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                item.up ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
              }`}>
                {item.change}
              </span>
            </div>
          ))}
        </section>

        {/* 4. Publication Analytics Charts */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Area: Citation Growth (Line Chart) & Publication Growth (Area Chart) */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-4.5 h-4.5 text-blue-600" /> Research Impact Growth
              </h3>
              <span className="text-[10px] font-bold text-slate-400">Last 6 Months</span>
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics?.citationGrowth || []}>
                  <defs>
                    <linearGradient id="colorCitations" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tickLine={false} tick={{ fill: '#64748B', fontSize: 10, fontWeight: 700 }} />
                  <YAxis tickLine={false} tick={{ fill: '#64748B', fontSize: 10, fontWeight: 700 }} />
                  <Tooltip contentStyle={{ background: '#0F172A', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="citations" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#colorCitations)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Radar Chart: Research Areas Distribution */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4.5 h-4.5 text-indigo-600" /> Focus Distribution
              </h3>
            </div>

            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={analytics?.radarData || []}>
                  <PolarGrid stroke="#E2E8F0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748B', fontSize: 8, fontWeight: 700 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                  <Radar name="My Focus" dataKey="A" stroke="#2563EB" fill="#2563EB" fillOpacity={0.4} />
                  <Radar name="Peer Average" dataKey="B" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.1} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* 5. Additional Charts: Publications Per Year & Types */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-6">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-blue-600" /> Publications Per Year
            </h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics?.publicationsPerYear || []}>
                  <XAxis dataKey="year" tickLine={false} tick={{ fill: '#64748B', fontSize: 10, fontWeight: 700 }} />
                  <YAxis tickLine={false} tick={{ fill: '#64748B', fontSize: 10, fontWeight: 700 }} />
                  <Tooltip contentStyle={{ background: '#0F172A', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '11px' }} />
                  <Bar dataKey="count" fill="#2563EB" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-6">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-indigo-600" /> Publication Types
            </h3>
            <div className="h-56 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics?.publicationTypes || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {(analytics?.publicationTypes || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#0F172A', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-1.5 text-xs text-slate-500 font-semibold self-center pl-4 shrink-0">
                {(analytics?.publicationTypes || []).map((type, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                    <span>{type.name}: {type.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 6. Top Publications Responsive Table */}
        <section className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/60 pb-4 gap-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Top Performing Publications</h3>
            
            {/* Filters & Tab Switchers */}
            <div className="flex flex-wrap gap-2.5">
              <select 
                value={filterYear} 
                onChange={(e) => setFilterYear(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 focus:outline-none"
              >
                <option value="">All Years</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
              </select>

              <select 
                value={filterType} 
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 focus:outline-none"
              >
                <option value="">All Types</option>
                <option value="Journal">Journal</option>
                <option value="Conference">Conference</option>
                <option value="Preprint">Preprint</option>
              </select>
            </div>
          </div>

          {/* Table Tab selector */}
          <div className="flex gap-2">
            {[
              { id: 'mostViewed', label: 'Most Viewed' },
              { id: 'mostDownloaded', label: 'Most Downloaded' },
              { id: 'mostCited', label: 'Most Cited' },
              { id: 'recentlyUploaded', label: 'Recently Uploaded' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setPubTableTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                  pubTableTab === tab.id 
                    ? 'bg-slate-900 border-slate-900 text-white' 
                    : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Responsive Table */}
          <div className="overflow-x-auto border border-slate-100 rounded-2xl">
            <table className="w-full text-left border-collapse text-xs font-semibold text-slate-600">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/60 uppercase tracking-wider text-[10px] text-slate-400">
                  <th className="px-6 py-3.5">Title</th>
                  <th className="px-6 py-3.5">Type</th>
                  <th className="px-6 py-3.5 text-center">Views</th>
                  <th className="px-6 py-3.5 text-center">Downloads</th>
                  <th className="px-6 py-3.5 text-center">Citations</th>
                  <th className="px-6 py-3.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPubs.map((pub) => (
                  <tr key={pub._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900 truncate max-w-[280px]">
                      {pub.title}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[9px] font-bold border border-blue-100/50 uppercase">
                        {pub.publicationType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">{pub.viewCount || 0}</td>
                    <td className="px-6 py-4 text-center">{pub.downloadCount || 0}</td>
                    <td className="px-6 py-4 text-center font-extrabold text-slate-800">{pub.citationCount || 0}</td>
                    <td className="px-6 py-4 text-center">
                      <Link 
                        to={`/publications/${pub._id}`}
                        className="text-blue-600 hover:text-blue-700 font-bold hover:underline"
                      >
                        Detail
                      </Link>
                    </td>
                  </tr>
                ))}

                {filteredPubs.length === 0 && (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-400 italic">
                      No publications matching standard filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

      </div>

      {/* Right Sidebar Widgets Panel (1 column) */}
      <div className="space-y-8 text-left">
        
        {/* Widget 1: AI Recommendation Engine */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-4 shadow-sm">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 font-display">
            <Sparkles className="w-4.5 h-4.5 text-blue-600" /> AI Recommendations
          </h3>
          
          <div className="space-y-4">
            {/* Publications */}
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-2">Publications</span>
              {recommendations?.recommendedPublications?.slice(0, 2).map((pub) => (
                <div key={pub._id} className="p-3 bg-slate-50 border border-slate-200/40 rounded-xl space-y-1 hover:border-blue-500/20 transition-all mb-2">
                  <h4 className="font-bold text-xs text-slate-900 line-clamp-2 leading-snug">{pub.title}</h4>
                  <div className="flex justify-between items-center text-[9px] text-slate-400 pt-1 font-semibold">
                    <span>IF: {pub.impactFactor || '8.2'}</span>
                    <span className="text-blue-600">{pub.score || 95}% Match</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Researchers */}
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-2">Colleagues</span>
              {recommendations?.recommendedResearchers?.slice(0, 2).map((rec) => (
                <div key={rec.user._id} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition-all">
                  <img 
                    src={rec.profile?.profilePhoto || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'}
                    alt={rec.user.fullName}
                    className="w-8 h-8 rounded-full object-cover border border-slate-100"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-xs text-slate-900 leading-none truncate">{rec.user.fullName}</h4>
                    <span className="text-[9px] text-slate-400 truncate block mt-0.5">{rec.profile?.institution || 'Stanford University'}</span>
                  </div>
                  <span className="text-[10px] font-bold text-blue-600 shrink-0">{rec.finalMatch}%</span>
                </div>
              ))}
            </div>

            {/* Conferences */}
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-2">Conferences</span>
              {recommendations?.recommendedConferences?.slice(0, 1).map((conf, index) => (
                <div key={index} className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl space-y-1">
                  <h4 className="font-bold text-xs text-indigo-900 leading-snug">{conf.title}</h4>
                  <p className="text-[9px] text-indigo-600/80 font-medium">{conf.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Widget 2: Collaboration Widget Panel */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-4 shadow-sm">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 font-display">
              <Users className="w-4.5 h-4.5 text-indigo-600" /> Collaboration Portal
            </h3>
            <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              Score: {collaborations?.collaborationScore || 0}
            </span>
          </div>

          <div className="space-y-4">
            {/* Pending Requests */}
            {collaborations?.pendingReceived?.length > 0 ? (
              <div>
                <span className="text-[10px] text-orange-500 font-bold uppercase tracking-wider block mb-2">Pending Request</span>
                {collaborations.pendingReceived.slice(0, 1).map((reqItem) => (
                  <div key={reqItem._id} className="p-3 bg-orange-50/50 border border-orange-100 rounded-xl space-y-2">
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 leading-none">{reqItem.sender?.fullName}</h4>
                      <span className="text-[9px] text-slate-400 font-semibold mt-1 block">{reqItem.projectTitle}</span>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-2.5 py-1.5 bg-blue-600 text-white rounded-lg text-[9px] font-bold hover:bg-blue-700 transition-all cursor-pointer">
                        Accept
                      </button>
                      <button className="px-2.5 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-[9px] font-bold transition-all cursor-pointer">
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[10px] text-slate-400 italic">No pending requests received.</p>
            )}

            {/* Suggested Collaborators */}
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-2">Suggested Partners</span>
              {collaborations?.suggestedCollaborators?.slice(0, 2).map((collabRec) => (
                <div key={collabRec.user._id} className="flex items-center justify-between pb-3 border-b border-slate-100 last:border-b-0 last:pb-0">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                      {collabRec.user.fullName.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs text-slate-900 leading-none truncate">{collabRec.user.fullName}</h4>
                      <span className="text-[9px] text-slate-400 truncate block mt-0.5">{collabRec.profile?.institution || 'Stanford Research'}</span>
                    </div>
                  </div>
                  <button className="text-[10px] font-extrabold text-blue-600 hover:underline">
                    Connect
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Widget 3: Quick Action Buttons */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-4 shadow-sm">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-display">Quick Actions</h3>
          <div className="flex flex-col gap-2.5">
            <Link to="/publications/upload" className="w-full">
              <button className="w-full flex items-center justify-between px-4 py-2.5 bg-blue-50 hover:bg-blue-100 border border-blue-200/20 text-xs font-bold text-blue-600 rounded-xl transition-all cursor-pointer shadow-sm">
                <span>Upload Publication</span>
                <Plus className="w-4 h-4" />
              </button>
            </Link>
            <Link to="/profile" className="w-full">
              <button className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/50 text-xs font-bold text-slate-700 rounded-xl transition-all cursor-pointer">
                <span>Edit Profile</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </Link>
            <Link to="/discovery" className="w-full">
              <button className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/50 text-xs font-bold text-slate-700 rounded-xl transition-all cursor-pointer">
                <span>Find Collaborators</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
};

export default DashboardHome;
