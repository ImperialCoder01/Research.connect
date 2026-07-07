import React, { useState } from "react";
import {
  Share2,
  Home,
  User,
  Globe,
  FileText,
  FolderKanban,
  Users,
  MessageSquare,
  UserPlus,
  UserCheck,
  BarChart2,
  Settings,
  Search,
  Plus,
  ChevronDown,
  Filter,
  ArrowUpDown,
  Grid3x3,
  List,
  Bell,
  Upload,
} from "lucide-react";

import { STATS, TABS, PROJECTS, ACTIVITY, TOP_COLLABORATORS, OVERVIEW, SEED_APPLICATIONS, AVATAR_COLORS, avatarInitials } from "./data";

import DonutChart from "./components/DonutChart";
import NavItem from "./components/NavItem";
import ProjectCard from "./components/ProjectCard";
import ApplyModal from "./components/ApplyModal";
import ApplicationsModal from "./components/ApplicationsModal";

export default function ProjectsPage() {
  const [activeTab, setActiveTab] = useState("All Projects");
  const [search, setSearch] = useState("");
  const [projects, setProjects] = useState(PROJECTS);
  const [applyingProject, setApplyingProject] = useState(null);
  const [appliedIds, setAppliedIds] = useState(() => new Set());
  const [applications, setApplications] = useState(SEED_APPLICATIONS);
  const [viewingApplicationsProject, setViewingApplicationsProject] = useState(null);

  const filteredProjects = projects.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  function toggleOpenToCollaboration(id) {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, openToCollaboration: !p.openToCollaboration } : p
      )
    );
  }

  function handleApplySubmit(name, message) {
    setApplications((prev) => [
      ...prev,
      {
        id: `app-${Date.now()}`,
        projectId: applyingProject.id,
        applicantName: name,
        message,
        appliedAt: "Just now",
        status: "pending",
      },
    ]);
    setAppliedIds((prev) => new Set(prev).add(applyingProject.id));
    setApplyingProject(null);
    // In a real app: POST { projectId, name, message } to your collaboration-requests endpoint here.
  }

  function handleAcceptApplication(appId) {
    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: "accepted" } : a))
    );
    // In a real app: notify the applicant and add them to the project's collaborator list here.
  }

  function handleDeclineApplication(appId) {
    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: "declined" } : a))
    );
  }

  function pendingCountFor(projectId) {
    return applications.filter((a) => a.projectId === projectId && a.status === "pending").length;
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 font-sans text-slate-900">
      {/* ---------------- Top nav ---------------- */}
      <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Share2 size={18} />
            </div>
            <span className="text-lg font-bold text-slate-800">
              Research <span className="text-blue-600">Connect</span>
            </span>
          </div>
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-500 md:flex">
            <a className="hover:text-slate-900" href="#">Home</a>
            <a className="hover:text-slate-900" href="#">Research</a>
            <a className="hover:text-slate-900" href="#">Communities</a>
          </nav>
        </div>

        <div className="mx-6 hidden max-w-xl flex-1 items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 md:flex">
          <Search size={16} className="text-slate-400" />
          <input
            className="w-full bg-transparent text-sm text-slate-600 placeholder:text-slate-400 focus:outline-none"
            placeholder="Search researchers, papers, patents, keywords..."
          />
        </div>

        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
            <Plus size={16} /> Create <ChevronDown size={14} />
          </button>
          <UserPlus size={18} className="hidden text-slate-500 sm:block" />
          <MessageSquare size={18} className="hidden text-slate-500 sm:block" />
          <div className="relative hidden sm:block">
            <Bell size={18} className="text-slate-500" />
            <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              3
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-orange-300 to-orange-500" />
            <span className="hidden text-sm font-medium text-slate-700 sm:block">Sushil</span>
            <ChevronDown size={14} className="hidden text-slate-400 sm:block" />
          </div>
        </div>
      </header>

      <div className="flex">
        {/* ---------------- Sidebar ---------------- */}
        <aside className="hidden w-60 flex-shrink-0 flex-col justify-between border-r border-slate-200 bg-white p-4 lg:flex">
          <nav className="flex flex-col gap-1">
            <NavItem icon={Home} label="Home Feed" />
            <NavItem icon={User} label="Profile" />
            <NavItem icon={Globe} label="Research Identity" />
            <NavItem icon={FileText} label="Publications" />
            <NavItem icon={FolderKanban} label="Projects" active />
            <NavItem icon={Users} label="My Network" />
            <NavItem icon={MessageSquare} label="Messages" />
            <NavItem icon={UserPlus} label="Followers" />
            <NavItem icon={UserCheck} label="Following" />
            <NavItem icon={BarChart2} label="Analytics" />
            <NavItem icon={Settings} label="Settings" />
          </nav>
          <button className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
            <Upload size={16} /> Upload Publication
          </button>
        </aside>

        {/* ---------------- Main content ---------------- */}
        <main className="flex-1 px-6 py-6">
          <div className="flex flex-col gap-6 xl:flex-row">
            {/* Left / center column */}
            <div className="flex-1">
              <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">My Projects</h1>
                  <p className="text-sm text-slate-500">
                    Manage your research projects and collaborations
                  </p>
                </div>
                <button className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
                  <Plus size={16} /> Create New Project
                </button>
              </div>

              {/* Search + filter row */}
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5">
                  <Search size={16} className="text-slate-400" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search projects..."
                    className="w-full text-sm text-slate-600 placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
                <button className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50">
                  <Filter size={15} /> Filter
                </button>
                <button className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50">
                  <ArrowUpDown size={15} /> Sort: Most Recent <ChevronDown size={14} />
                </button>
                <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1">
                  <button className="rounded-md bg-blue-50 p-1.5 text-blue-600">
                    <Grid3x3 size={16} />
                  </button>
                  <button className="rounded-md p-1.5 text-slate-400 hover:bg-slate-50">
                    <List size={16} />
                  </button>
                </div>
              </div>

              {/* Stat cards */}
              <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
                {STATS.map((s) => {
                  const Icon = s.icon;
                  return (
                    <div
                      key={s.key}
                      className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4"
                    >
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${s.tint}`}>
                        <Icon size={18} />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">{s.label}</p>
                        <p className="text-xl font-bold text-slate-900">{s.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Tabs */}
              <div className="mb-2 flex gap-6 border-b border-slate-200 text-sm font-medium text-slate-500 overflow-x-auto">
                {TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`whitespace-nowrap border-b-2 pb-3 pt-1 transition-colors ${
                      activeTab === tab
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent hover:text-slate-700"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Project list */}
              <div className="rounded-xl border border-slate-200 bg-white px-5">
                {filteredProjects.length ? (
                  filteredProjects.map((p) => (
                    <ProjectCard
                      key={p.id}
                      project={p}
                      onToggleOpen={toggleOpenToCollaboration}
                      onApply={setApplyingProject}
                      hasApplied={appliedIds.has(p.id)}
                      pendingCount={pendingCountFor(p.id)}
                      onViewApplications={setViewingApplicationsProject}
                    />
                  ))
                ) : (
                  <p className="py-10 text-center text-sm text-slate-400">
                    No projects match your search.
                  </p>
                )}
              </div>
            </div>

            {/* Right sidebar */}
            <aside className="w-full flex-shrink-0 space-y-5 xl:w-80">
              <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
                <Plus size={16} /> Create New Project
              </button>

              {/* Overview */}
              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <h3 className="mb-4 text-sm font-semibold text-slate-800">Projects Overview</h3>
                <div className="flex items-center gap-6">
                  <DonutChart />
                  <div className="space-y-2 text-xs">
                    {OVERVIEW.map((o) => (
                      <div key={o.key} className="flex items-center gap-2">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: o.color }}
                        />
                        <span className="text-slate-500">{o.label} {o.value}</span>
                        {o.pct === 12.5 && (
                          <span className="text-slate-400">({o.pct}%)</span>
                        )}
                        {o.pct === 50 && o.key === "active2" && (
                          <span className="text-slate-400">({o.pct}%)</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <h3 className="mb-4 text-sm font-semibold text-slate-800">Recent Activity</h3>
                <div className="space-y-4">
                  {ACTIVITY.map((a) => {
                    const Icon = a.icon;
                    return (
                      <div key={a.id} className="flex gap-3">
                        <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${a.iconTint}`}>
                          <Icon size={14} />
                        </div>
                        <p className="text-sm leading-snug text-slate-600">
                          <span className="font-semibold text-slate-800">{a.name}</span>{" "}
                          {a.action}{" "}
                          <span className="font-medium text-blue-600">{a.target}</span>
                          <br />
                          <span className="text-xs text-slate-400">{a.time}</span>
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Top Collaborators */}
              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <h3 className="mb-4 text-sm font-semibold text-slate-800">Top Collaborators</h3>
                <div className="space-y-3">
                  {TOP_COLLABORATORS.map((c, i) => (
                    <div key={c.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold text-white ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}
                        >
                          {avatarInitials(c.name)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-800">{c.name}</p>
                          <p className="text-xs text-slate-400">{c.projects} Projects</p>
                        </div>
                      </div>
                      <button className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-slate-50">
                        View Profile
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>

      {applyingProject && (
        <ApplyModal
          project={applyingProject}
          onClose={() => setApplyingProject(null)}
          onSubmit={handleApplySubmit}
        />
      )}

      {viewingApplicationsProject && (
        <ApplicationsModal
          project={viewingApplicationsProject}
          applications={applications.filter(
            (a) => a.projectId === viewingApplicationsProject.id
          )}
          onClose={() => setViewingApplicationsProject(null)}
          onAccept={handleAcceptApplication}
          onDecline={handleDeclineApplication}
        />
      )}
    </div>
  );
}