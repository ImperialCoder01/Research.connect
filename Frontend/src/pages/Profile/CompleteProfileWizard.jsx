import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Building, 
  Globe, 
  Camera, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft,
  Microscope,
  Info,
  Link2,
  FileText,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Input from '@/components/common/Input.jsx';
import Button from '@/components/common/Button.jsx';
import api from '@/services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';

const CompleteProfileWizard = () => {
  const navigate = useNavigate();
  const { user, syncProfile } = useAuth();

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form states mapping all 5 steps
  
  // Step 1: Basic Information
  const [gender, setGender] = useState('prefer-not-to-say');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [country, setCountry] = useState(user?.country || '');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');

  // Step 2: Professional Information
  const [institution, setInstitution] = useState(user?.institution || '');
  const [department, setDepartment] = useState('');
  const [designation, setDesignation] = useState('');
  const [experience, setExperience] = useState('0');
  const [academicLevel, setAcademicLevel] = useState('Other');
  const [employmentType, setEmploymentType] = useState('Other');
  const [skillsInput, setSkillsInput] = useState('');
  const [skills, setSkills] = useState([]);
  const [languagesInput, setLanguagesInput] = useState('');
  const [languages, setLanguages] = useState([]);
  const [researchAreaInput, setResearchAreaInput] = useState('');
  const [researchAreas, setResearchAreas] = useState([]);
  const [researchInterestsInput, setResearchInterestsInput] = useState('');
  const [researchInterests, setResearchInterests] = useState([]);

  // Step 3: Research Profiles
  const [googleScholarUrl, setGoogleScholarUrl] = useState('');
  const [orcidId, setOrcidId] = useState('');
  const [researchGateUrl, setResearchGateUrl] = useState('');
  const [scopusId, setScopusId] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [personalWebsite, setPersonalWebsite] = useState('');

  // Step 4: Uploads
  const [photoPreview, setPhotoPreview] = useState(user?.profilePhoto || '');
  const [coverPreview, setCoverPreview] = useState(user?.coverPhoto || '');
  const [cvPreview, setCvPreview] = useState(user?.cvUrl || '');
  
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingCV, setUploadingCV] = useState(false);

  // Helper arrays addition
  const handleAddSkill = () => {
    const val = skillsInput.trim();
    if (val && !skills.includes(val)) {
      setSkills([...skills, val]);
      setSkillsInput('');
    }
  };

  const handleAddLanguage = () => {
    const val = languagesInput.trim();
    if (val && !languages.includes(val)) {
      setLanguages([...languages, val]);
      setLanguagesInput('');
    }
  };

  const handleAddResearchArea = () => {
    const val = researchAreaInput.trim();
    if (val && !researchAreas.includes(val)) {
      setResearchAreas([...researchAreas, val]);
      setResearchAreaInput('');
    }
  };

  const handleAddResearchInterest = () => {
    const val = researchInterestsInput.trim();
    if (val && !researchInterests.includes(val)) {
      setResearchInterests([...researchInterests, val]);
      setResearchInterestsInput('');
    }
  };

  // Upload handlers
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('photo', file);

    setUploadingPhoto(true);
    setError('');
    try {
      const response = await api.post('/profile/upload-photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data?.profile?.profilePhoto) {
        setPhotoPreview(response.data.profile.profilePhoto);
        setSuccess('Profile photo uploaded successfully.');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload profile photo.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleCoverUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('cover', file);

    setUploadingCover(true);
    setError('');
    try {
      const response = await api.post('/profile/upload-cover', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data?.profile?.coverPhoto) {
        setCoverPreview(response.data.profile.coverPhoto);
        setSuccess('Cover photo uploaded successfully.');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload cover photo.');
    } finally {
      setUploadingCover(false);
    }
  };

  const handleCVUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('cv', file);

    setUploadingCV(true);
    setError('');
    try {
      const response = await api.post('/profile/upload-cv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data?.profile?.cvUrl) {
        setCvPreview(response.data.profile.cvUrl);
        setSuccess('CV document uploaded successfully.');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload CV document.');
    } finally {
      setUploadingCV(false);
    }
  };

  // Step Validator
  const validateStep = () => {
    setError('');
    if (step === 1) {
      if (!country.trim()) {
        setError('Country is required.');
        return false;
      }
    }
    if (step === 2) {
      if (!institution.trim()) {
        setError('Institution/Affiliation is required.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setError('');
    setStep(step - 1);
  };

  // Submit complete wizard
  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');
    try {
      // 1. Submit Profile details and flag completion
      await api.put('/profile', {
        displayName: user?.fullName || user?.displayName,
        bio,
        designation,
        department,
        institution,
        country,
        state,
        city,
        experience: parseInt(experience) || 0,
        academicLevel,
        employmentType,
        phone,
        gender,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth).toISOString() : undefined,
        website: personalWebsite,
        languages,
        socialLinks: {
          linkedin: linkedinUrl,
          researchgate: researchGateUrl,
          orcid: orcidId,
          twitter: '',
          github: githubUrl
        },
        isWizardSubmit: true // Sets isProfileComplete = true in User model
      });

      // 2. Submit Research Interests (research areas and keywords)
      const allKeywords = [...researchInterests, ...skills];
      if (researchAreas.length > 0 || allKeywords.length > 0) {
        await api.patch('/profile/research', {
          researchAreas,
          keywords: allKeywords
        });
      }

      setSuccess('Profile wizard complete! Welcome to ResearchConnect.');
      setTimeout(async () => {
        // Sync new complete profile context
        await syncProfile();
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete profile registration. Please review input values.');
    } finally {
      setIsLoading(false);
    }
  };

  const stepsList = [
    'Basic Information',
    'Professional Details',
    'Research Profiles',
    'Upload Documents',
    'Review & Submit'
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-2xl w-full bg-white border border-slate-200 shadow-xl rounded-3xl p-8 space-y-6">
        
        {/* Wizard Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center">
              <Microscope className="w-4 h-4" />
            </div>
            <span className="text-base font-bold text-slate-800 font-display">ResearchConnect</span>
          </div>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
            Researcher Wizard
          </span>
        </div>

        {/* Multi-step progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Step {step} of 5: {stepsList[step - 1]}</span>
            <span>{Math.round((step / 5) * 100)}% Complete</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Global messages */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold rounded-2xl flex items-center gap-2">
            <Info className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold rounded-2xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Steps contents */}
        <div className="min-h-[300px]">
          <AnimatePresence mode="wait">
            
            {/* Step 1: Basic Information */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4 text-left"
              >
                <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" /> Basic Details
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-600 focus:bg-white transition-all shadow-sm"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">Prefer Not To Say</option>
                    </select>
                  </div>
                  <Input
                    label="Date of Birth"
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    label="Country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="United States"
                    required
                  />
                  <Input
                    label="State / Region"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="California"
                  />
                  <Input
                    label="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Stanford"
                  />
                </div>

                <Input
                  label="Phone Number (Optional)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (650) 123-4567"
                />

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Short Biography / Bio</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows="3"
                    maxLength="500"
                    placeholder="Briefly describe your academic background, scientific interests, or research mission statement..."
                    className="w-full px-3.5 py-2.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white transition-all shadow-sm resize-none"
                  ></textarea>
                </div>
              </motion.div>
            )}

            {/* Step 2: Professional Information */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4 text-left"
              >
                <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Building className="w-5 h-5 text-blue-600" /> Academic & Professional Affiliation
                </h4>

                <Input
                  label="Institution / Organization"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="Stanford University"
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Department"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="Department of Computer Science"
                  />
                  <Input
                    label="Designation / Academic Rank"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="Assistant Professor / Ph.D. Candidate"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Years of Research Experience"
                    type="number"
                    min="0"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                  />
                  <div>
                    <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Languages</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={languagesInput}
                        onChange={(e) => setLanguagesInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddLanguage())}
                        placeholder="English"
                        className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition-all shadow-sm"
                      />
                      <Button type="button" onClick={handleAddLanguage} size="sm">Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {languages.map((l, i) => (
                        <span key={i} className="px-2 py-1 bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold rounded-lg flex items-center gap-1">
                          {l}
                          <button type="button" onClick={() => setLanguages(languages.filter((_, idx) => idx !== i))} className="text-slate-400 hover:text-slate-600 font-bold">&times;</button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Academic Level</label>
                    <select
                      value={academicLevel}
                      onChange={(e) => setAcademicLevel(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-600 focus:bg-white transition-all shadow-sm"
                    >
                      <option value="Undergraduate">Undergraduate</option>
                      <option value="Graduate">Graduate</option>
                      <option value="Ph.D. Candidate">Ph.D. Candidate</option>
                      <option value="Postdoctoral Researcher">Postdoctoral Researcher</option>
                      <option value="Professor">Professor</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Employment Type</label>
                    <select
                      value={employmentType}
                      onChange={(e) => setEmploymentType(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-600 focus:bg-white transition-all shadow-sm"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Self-employed">Self-employed</option>
                      <option value="Unemployed">Unemployed</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Research Areas */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Broad Research Areas</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={researchAreaInput}
                        onChange={(e) => setResearchAreaInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddResearchArea())}
                        placeholder="Artificial Intelligence"
                        className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition-all shadow-sm"
                      />
                      <Button type="button" onClick={handleAddResearchArea} size="sm">Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {researchAreas.map((area, i) => (
                        <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 border border-blue-100 text-[10px] font-bold rounded-lg flex items-center gap-1">
                          {area}
                          <button type="button" onClick={() => setResearchAreas(researchAreas.filter((_, idx) => idx !== i))} className="text-blue-400 hover:text-blue-650 font-bold">&times;</button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Research Interests / Keywords */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Keywords / Interests</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={researchInterestsInput}
                        onChange={(e) => setResearchInterestsInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddResearchInterest())}
                        placeholder="Graphene, NLP"
                        className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition-all shadow-sm"
                      />
                      <Button type="button" onClick={handleAddResearchInterest} size="sm">Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {researchInterests.map((interest, i) => (
                        <span key={i} className="px-2 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-bold rounded-lg flex items-center gap-1">
                          {interest}
                          <button type="button" onClick={() => setResearchInterests(researchInterests.filter((_, idx) => idx !== i))} className="text-indigo-400 hover:text-indigo-650 font-bold">&times;</button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Skills & Technical Competencies</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={skillsInput}
                      onChange={(e) => setSkillsInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                      placeholder="Data Analysis, PyTorch"
                      className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition-all shadow-sm"
                    />
                    <Button type="button" onClick={handleAddSkill} size="sm">Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {skills.map((s, i) => (
                      <span key={i} className="px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold rounded-lg flex items-center gap-1">
                        {s}
                        <button type="button" onClick={() => setSkills(skills.filter((_, idx) => idx !== i))} className="text-emerald-400 hover:text-emerald-650 font-bold">&times;</button>
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Research Profiles */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4 text-left"
              >
                <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Link2 className="w-5 h-5 text-blue-600" /> Academic Identities & Links
                </h4>
                <p className="text-xs text-slate-500">Provide links to synchronize your publications and establish your verified scholarly credentials:</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Google Scholar Profile URL"
                    value={googleScholarUrl}
                    onChange={(e) => setGoogleScholarUrl(e.target.value)}
                    placeholder="https://scholar.google.com/citations?user=..."
                  />
                  <Input
                    label="ORCID ID"
                    value={orcidId}
                    onChange={(e) => setOrcidId(e.target.value)}
                    placeholder="0000-0002-1825-0097"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="ResearchGate Profile URL"
                    value={researchGateUrl}
                    onChange={(e) => setResearchGateUrl(e.target.value)}
                    placeholder="https://www.researchgate.net/profile/..."
                  />
                  <Input
                    label="Scopus Author ID"
                    value={scopusId}
                    onChange={(e) => setScopusId(e.target.value)}
                    placeholder="57204899600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="LinkedIn Profile URL"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://www.linkedin.com/in/username"
                  />
                  <Input
                    label="GitHub Profile URL"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/username"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Personal / Lab Website"
                    value={personalWebsite}
                    onChange={(e) => setPersonalWebsite(e.target.value)}
                    placeholder="https://mylabs.science"
                  />
                </div>
              </motion.div>
            )}

            {/* Step 4: Uploads */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-5 text-left"
              >
                <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Camera className="w-5 h-5 text-blue-600" /> Upload Professional Media
                </h4>
                <p className="text-xs text-slate-500">Provide photos and your curriculum vitae to enhance profile visibility:</p>

                {/* Profile and Cover Photo upload cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Profile Photo */}
                  <div className="p-5 border border-slate-200 rounded-2xl space-y-4 text-center bg-slate-50 shadow-inner">
                    <span className="text-xs font-bold text-slate-700 block uppercase">Profile Photo</span>
                    <div className="w-24 h-24 mx-auto rounded-full bg-slate-200 border border-slate-300 relative flex items-center justify-center overflow-hidden group shadow-sm">
                      {photoPreview ? (
                        <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-10 h-10 text-slate-400" />
                      )}
                      <label className="absolute inset-0 bg-black/50 text-white text-[9px] font-bold uppercase tracking-wider flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                        Upload
                        <input type="file" onChange={handlePhotoUpload} className="hidden" accept="image/*" disabled={uploadingPhoto} />
                      </label>
                      {uploadingPhoto && (
                        <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                          <div className="w-6 h-6 border-2 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-450 block leading-normal">JPEG, PNG, or WEBP up to 2MB.</span>
                  </div>

                  {/* Cover Photo */}
                  <div className="p-5 border border-slate-200 rounded-2xl space-y-4 text-center bg-slate-50 shadow-inner">
                    <span className="text-xs font-bold text-slate-700 block uppercase">Profile Cover Banner</span>
                    <div className="w-full h-24 bg-slate-200 border border-slate-300 relative flex items-center justify-center overflow-hidden rounded-xl group shadow-sm">
                      {coverPreview ? (
                        <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-slate-450 text-xs font-bold font-display uppercase tracking-wider">Cover Image</span>
                      )}
                      <label className="absolute inset-0 bg-black/50 text-white text-[9px] font-bold uppercase tracking-wider flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                        Upload
                        <input type="file" onChange={handleCoverUpload} className="hidden" accept="image/*" disabled={uploadingCover} />
                      </label>
                      {uploadingCover && (
                        <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                          <div className="w-6 h-6 border-2 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-450 block leading-normal">Recommended ratio 16:9. Up to 2MB.</span>
                  </div>
                </div>

                {/* CV Document Upload */}
                <div className="p-5 border border-slate-200 rounded-2xl space-y-3 bg-slate-50 shadow-inner">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 block uppercase">Curriculum Vitae (CV)</span>
                    {cvPreview && (
                      <a href={cvPreview} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-blue-600 flex items-center gap-1 hover:underline">
                        <Eye className="w-3.5 h-3.5" /> View Current CV
                      </a>
                    )}
                  </div>
                  <div className="border-2 border-dashed border-slate-300 hover:border-blue-600 rounded-xl p-6 text-center transition-all bg-white relative">
                    <input 
                      type="file" 
                      onChange={handleCVUpload} 
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                      accept=".pdf,.doc,.docx"
                      disabled={uploadingCV}
                    />
                    <div className="flex flex-col items-center gap-2">
                      <FileText className={`w-8 h-8 ${cvPreview ? 'text-emerald-500 animate-pulse' : 'text-slate-400'}`} />
                      <span className="text-xs font-bold text-slate-700">
                        {uploadingCV ? 'Uploading CV document...' : cvPreview ? 'CV Linked Successfully' : 'Drag & Drop or Click to Upload CV'}
                      </span>
                      <span className="text-[10px] text-slate-400">PDF, DOC, or DOCX formats accepted. Max size 10MB.</span>
                    </div>
                    {uploadingCV && (
                      <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-xl">
                        <div className="w-6 h-6 border-2 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 5: Review & Submit */}
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-5 text-left"
              >
                <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 animate-pulse" /> Final Review & Activation
                </h4>
                <p className="text-xs text-slate-500">Confirm all details are correct. Completing the wizard activates your profile in the researcher directory:</p>

                <div className="border border-slate-200 rounded-2xl bg-white p-5 font-sans space-y-4 shadow-sm relative overflow-hidden">
                  <div className="h-1.5 bg-blue-600 absolute top-0 inset-x-0"></div>

                  <div className="flex gap-4 items-center">
                    <div className="w-14 h-14 rounded-full border border-slate-200 bg-slate-50 overflow-hidden shrink-0">
                      {photoPreview ? (
                        <img src={photoPreview} alt="User" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-full h-full p-2 text-slate-300" />
                      )}
                    </div>
                    <div className="space-y-0.5">
                      <h3 className="text-base font-bold text-slate-950 font-display">
                        {user?.fullName || 'Scholarly Researcher'}
                      </h3>
                      <p className="text-xs font-semibold text-slate-500">
                        {designation || 'Researcher'} • {department || 'Department'}
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        {institution || 'Stanford University'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-2 border-t border-slate-100">
                    <div>
                      <span className="text-slate-400 font-bold uppercase text-[9px] block">Location</span>
                      <span className="font-semibold text-slate-850">{city ? `${city}, ` : ''}{country}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold uppercase text-[9px] block">Research Category</span>
                      <span className="font-semibold text-slate-850 capitalize">{user?.researcherType || 'Research Scholar'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold uppercase text-[9px] block">Academic Level</span>
                      <span className="font-semibold text-slate-850">{academicLevel}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold uppercase text-[9px] block">Employment Type</span>
                      <span className="font-semibold text-slate-850">{employmentType}</span>
                    </div>
                  </div>

                  {bio && (
                    <div className="space-y-1">
                      <span className="text-slate-400 font-bold uppercase text-[9px] block">Biography Summary</span>
                      <p className="text-xs text-slate-600 leading-relaxed font-medium italic">{bio}</p>
                    </div>
                  )}

                  {(researchAreas.length > 0 || researchInterests.length > 0) && (
                    <div className="space-y-1.5 pt-2">
                      <span className="text-slate-400 font-bold uppercase text-[9px] block">Expertise & Specialties</span>
                      <div className="flex flex-wrap gap-1">
                        {researchAreas.map((a, i) => (
                          <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[9px] font-extrabold uppercase">{a}</span>
                        ))}
                        {researchInterests.map((t, i) => (
                          <span key={i} className="px-2 py-0.5 bg-indigo-50 text-indigo-750 rounded text-[9px] font-extrabold">{t}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {(googleScholarUrl || orcidId || researchGateUrl || linkedinUrl || githubUrl) && (
                    <div className="space-y-1.5 pt-2">
                      <span className="text-slate-400 font-bold uppercase text-[9px] block">Academic Identifiers Linked</span>
                      <div className="flex flex-wrap gap-2 text-[10px] text-slate-500 font-semibold">
                        {googleScholarUrl && <span>🌐 Google Scholar</span>}
                        {orcidId && <span>🆔 ORCID: {orcidId}</span>}
                        {researchGateUrl && <span>🔬 ResearchGate</span>}
                        {linkedinUrl && <span>💼 LinkedIn</span>}
                        {githubUrl && <span>💻 GitHub</span>}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Wizard Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={step === 1 || isLoading}
            className="px-5 border-slate-200 text-slate-500"
          >
            <ChevronLeft className="w-4 h-4 mr-1.5" /> Back
          </Button>

          {step < 5 ? (
            <Button
              type="button"
              onClick={handleNext}
              disabled={isLoading}
              className="px-6 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
            >
              Continue <ChevronRight className="w-4 h-4 ml-1.5" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              isLoading={isLoading}
              className="px-6 bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/10 cursor-pointer animate-pulse"
            >
              Activate Researcher Account <CheckCircle2 className="w-4 h-4 ml-1.5" />
            </Button>
          )}
        </div>

      </div>
    </div>
  );
};

export default CompleteProfileWizard;
