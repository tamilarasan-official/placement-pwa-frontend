import { useState, useEffect } from 'react';
import { studentService } from '../../services/studentService';
import { StudentProfile } from '../../types';
import toast from 'react-hot-toast';
import { HiOutlineUpload, HiOutlineX } from 'react-icons/hi';

export default function ProfileEditor() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [skillInput, setSkillInput] = useState('');

  const [form, setForm] = useState({
    name: '',
    department: '',
    gpa: 0,
    backlogs: 0,
    github: '',
    linkedin: '',
    portfolio: '',
    skills: [] as string[],
  });

  useEffect(() => {
    studentService.getProfile().then((res) => {
      if (res.success && res.profile) {
        setProfile(res.profile);
        setForm({
          name: res.profile.name || '',
          department: res.profile.department || '',
          gpa: res.profile.gpa || 0,
          backlogs: res.profile.backlogs || 0,
          github: res.profile.github || '',
          linkedin: res.profile.linkedin || '',
          portfolio: res.profile.portfolio || '',
          skills: res.profile.skills || [],
        });
      }
    }).catch(() => toast.error('Failed to load profile'))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await studentService.updateProfile(form);
      toast.success('Profile updated successfully!');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File must be under 5MB');
      return;
    }
    try {
      const res = await studentService.uploadResume(file);
      if (res.success) {
        toast.success('Resume uploaded!');
        setProfile((prev) => prev ? { ...prev, resume_url: res.resume_url } : prev);
      }
    } catch {
      toast.error('Failed to upload resume');
    }
  };

  const addSkill = () => {
    const skill = skillInput.trim();
    if (skill && !form.skills.includes(skill)) {
      setForm({ ...form, skills: [...form.skills, skill] });
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setForm({ ...form, skills: form.skills.filter((s) => s !== skill) });
  };

  if (loading) return <div className="animate-pulse bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 h-64 rounded-xl" />;

  const inputClass = "w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">My Profile</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Department</label>
          <select
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
            className={inputClass}
          >
            <option value="">Select Department</option>
            <option value="CSE">Computer Science</option>
            <option value="ECE">Electronics</option>
            <option value="ME">Mechanical</option>
            <option value="CE">Civil</option>
            <option value="EE">Electrical</option>
            <option value="IT">Information Technology</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">GPA</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="10"
            value={form.gpa}
            onChange={(e) => setForm({ ...form, gpa: parseFloat(e.target.value) || 0 })}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Backlogs</label>
          <input
            type="number"
            min="0"
            value={form.backlogs}
            onChange={(e) => setForm({ ...form, backlogs: parseInt(e.target.value) || 0 })}
            className={inputClass}
          />
        </div>

        {/* Divider */}
        <div className="md:col-span-2 border-t border-gray-100 pt-4 -mt-1">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Links & Social</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">GitHub</label>
          <input
            type="text"
            value={form.github}
            onChange={(e) => setForm({ ...form, github: e.target.value })}
            className={inputClass}
            placeholder="github.com/username"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">LinkedIn</label>
          <input
            type="text"
            value={form.linkedin}
            onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
            className={inputClass}
            placeholder="linkedin.com/in/username"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Portfolio (Optional)</label>
          <input
            type="text"
            value={form.portfolio}
            onChange={(e) => setForm({ ...form, portfolio: e.target.value })}
            className={inputClass}
            placeholder="your-portfolio.com"
          />
        </div>

        {/* Divider */}
        <div className="md:col-span-2 border-t border-gray-100 pt-4 -mt-1">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Skills & Resume</p>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Skills</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              className={`flex-1 ${inputClass}`}
              placeholder="Add a skill..."
            />
            <button
              type="button"
              onClick={addSkill}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.skills.map((skill) => (
              <span key={skill} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                {skill}
                <button onClick={() => removeSkill(skill)} className="hover:text-blue-900 transition-colors">
                  <HiOutlineX className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Resume (PDF)</label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg cursor-pointer transition-colors">
              <HiOutlineUpload className="h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-700 font-medium">Upload Resume</span>
              <input type="file" accept=".pdf" onChange={handleResumeUpload} className="hidden" />
            </label>
            {profile?.resume_url && (
              <a href={profile.resume_url} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline">
                View current resume
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end border-t border-gray-100 pt-5">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg transition-all shadow-sm disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </div>
  );
}
