import {
  FolderKanban,
  Users,
  BarChart2,
  UserCheck,
  UserPlus,
  FileText,
  MessageSquare,
  Brain,
  HeartPulse,
  ScanLine,
  Boxes,
} from "lucide-react";

// ---------------------------------------------------------------------------
// MOCK DATA — swap these out for real API calls later.
// Every shape here (projects, stats, activity, collaborators) is deliberately
// kept flat and simple so it's obvious what a backend response should look
// like when this gets wired up for real.
// ---------------------------------------------------------------------------

export const STATS = [
  { key: "total", label: "Total Projects", value: 8, icon: FolderKanban, tint: "bg-blue-50 text-blue-600" },
  { key: "collaborators", label: "Collaborators", value: 24, icon: Users, tint: "bg-emerald-50 text-emerald-600" },
  { key: "active", label: "Active Projects", value: 6, icon: BarChart2, tint: "bg-violet-50 text-violet-600" },
  { key: "completed", label: "Completed", value: 2, icon: UserCheck, tint: "bg-teal-50 text-teal-600" },
];

export const TABS = ["All Projects", "Owned by Me", "Collaborating", "Invited", "Completed", "Archived"];

export const TAG_STYLES = {
  "AI/ML": "bg-blue-50 text-blue-600",
  "Information Retrieval": "bg-purple-50 text-purple-600",
  NLP: "bg-rose-50 text-rose-600",
  Healthcare: "bg-emerald-50 text-emerald-600",
  IoT: "bg-cyan-50 text-cyan-600",
  "Edge Computing": "bg-rose-50 text-rose-600",
  "Computer Vision": "bg-blue-50 text-blue-600",
  "Medical Imaging": "bg-emerald-50 text-emerald-600",
  Blockchain: "bg-rose-50 text-rose-600",
  "Research Ethics": "bg-blue-50 text-blue-600",
  "Data Security": "bg-orange-50 text-orange-600",
};

export const AVATAR_COLORS = ["bg-orange-300", "bg-indigo-300", "bg-pink-300", "bg-emerald-300", "bg-sky-300"];

export function avatarInitials(seed) {
  return seed.slice(0, 2).toUpperCase();
}

export const PROJECTS = [
  {
    id: 1,
    title: "AI-Powered Research Discovery Engine",
    description:
      "Building an intelligent system to recommend relevant research papers, authors, and collaboration opportunities using machine learning.",
    tags: ["AI/ML", "Information Retrieval", "NLP"],
    collaborators: 8,
    extraAvatars: 5,
    status: "Active",
    statusColor: "bg-emerald-500",
    created: "12 May 2024",
    updated: "2 days ago",
    icon: Brain,
    cover: "from-slate-900 via-slate-800 to-indigo-950",
    coverIconColor: "text-cyan-400",
    openToCollaboration: true,
  },
  {
    id: 2,
    title: "Smart Healthcare Monitoring System",
    description:
      "IoT and edge computing based real-time health monitoring and alert system for remote patients.",
    tags: ["Healthcare", "IoT", "Edge Computing"],
    collaborators: 6,
    extraAvatars: 3,
    status: "Active",
    statusColor: "bg-emerald-500",
    created: "28 Apr 2024",
    updated: "5 days ago",
    icon: HeartPulse,
    cover: "from-slate-900 via-slate-800 to-blue-950",
    coverIconColor: "text-red-400",
    openToCollaboration: false,
  },
  {
    id: 3,
    title: "Explainable AI for Medical Imaging",
    description:
      "Research on interpretable deep learning models for medical image classification and diagnosis.",
    tags: ["AI/ML", "Computer Vision", "Medical Imaging"],
    collaborators: 7,
    extraAvatars: 4,
    status: "Active",
    statusColor: "bg-emerald-500",
    created: "15 Mar 2024",
    updated: "1 week ago",
    icon: ScanLine,
    cover: "from-slate-900 via-slate-800 to-cyan-950",
    coverIconColor: "text-cyan-300",
    openToCollaboration: true,
  },
  {
    id: 4,
    title: "Blockchain for Research Integrity",
    description:
      "Exploring blockchain solutions to ensure transparency, reproducibility, and integrity in scientific research.",
    tags: ["Blockchain", "Research Ethics", "Data Security"],
    collaborators: 5,
    extraAvatars: 2,
    status: "In Progress",
    statusColor: "bg-blue-500",
    created: "10 Feb 2024",
    updated: "2 weeks ago",
    icon: Boxes,
    cover: "from-slate-900 via-slate-800 to-purple-950",
    coverIconColor: "text-cyan-300",
    openToCollaboration: false,
  },
];

export const ACTIVITY = [
  {
    id: 0,
    name: "Pragya Singh",
    action: "joined the project",
    target: "Explainable AI for Medical Imaging",
    time: "1 day ago",
    icon: UserPlus,
    iconTint: "bg-blue-50 text-blue-500",
  },
  {
    id: 1,
    name: "Pragya Sharma",
    action: "joined the project",
    target: "AI-Powered Research Discovery Engine",
    time: "2 days ago",
    icon: UserPlus,
    iconTint: "bg-blue-50 text-blue-500",
  },
  {
    id: 2,
    name: "Abhishek Patel",
    action: "uploaded a document in",
    target: "Smart Healthcare Monitoring System",
    time: "5 days ago",
    icon: FileText,
    iconTint: "bg-blue-50 text-blue-500",
  },
  {
    id: 3,
    name: "Vishal Tripathi",
    action: "commented on a task in",
    target: "Explainable AI for Medical Imaging",
    time: "1 week ago",
    icon: MessageSquare,
    iconTint: "bg-blue-50 text-blue-500",
  },
  {
    id: 4,
    name: "Binore Mohapatra",
    action: "completed a milestone in",
    target: "Blockchain for Research Integrity",
    time: "2 weeks ago",
    icon: UserCheck,
    iconTint: "bg-emerald-50 text-emerald-500",
  },
];

export const TOP_COLLABORATORS = [
  { id: 1, name: "Pragya Sharma", projects: 5 },
  { id: 2, name: "Abhishek Patel", projects: 4 },
  { id: 3, name: "Pragya Singh", projects: 3 },
];

export const OVERVIEW = [
  { key: "active", label: "Active", value: 6, pct: 50, color: "#10b981" },
  { key: "active2", label: "Active", value: 6, pct: 50, color: "#3b82f6" },
  { key: "completed", label: "Completed", value: 2, pct: 12.5, color: "#9ca3af" },
  { key: "archived", label: "Archived", value: 1, pct: 12.5, color: "#8b5cf6" },
];

// Seed a couple of existing applications so the "pending applications" view
// has something to show right away. Real data would come from your backend.
export const SEED_APPLICATIONS = [
  {
    id: "app-1",
    projectId: 1,
    applicantName: "Rhea Kapoor",
    message:
      "I've published two papers on retrieval-augmented recommendation systems and would love to help with the ranking model.",
    appliedAt: "3 days ago",
    status: "pending",
  },
  {
    id: "app-2",
    projectId: 3,
    applicantName: "Karan Mehta",
    message:
      "I work on model interpretability for radiology imaging and can contribute to the saliency-map evaluation pipeline.",
    appliedAt: "6 days ago",
    status: "pending",
  },
  {
    id: "app-3",
    projectId: 1,
    applicantName: "Pragya Singh",
    message: "Happy to help annotate the training set and review the NLP pipeline.",
    appliedAt: "1 week ago",
    status: "accepted",
  },
];