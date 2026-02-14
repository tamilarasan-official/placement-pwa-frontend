import { useState, useEffect } from 'react';
import { companyService } from '../../services/companyService';
import { tpoService } from '../../services/tpoService';
import { CompanyDrive, RecruiterAccount } from '../../types';
import toast from 'react-hot-toast';
import { HiOutlineX, HiOutlineClipboardCopy } from 'react-icons/hi';

interface Props {
  drive?: CompanyDrive | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function CompanyDriveForm({ drive, onClose, onSaved }: Props) {
  const [form, setForm] = useState({
    company_name: drive?.company_name || '',
    role: drive?.role || '',
    min_gpa: drive?.min_gpa || 0,
    allowed_backlogs: drive?.allowed_backlogs || 0,
    drive_date: drive?.drive_date || '',
    required_skills: drive?.required_skills || [] as string[],
  });
  const [skillInput, setSkillInput] = useState('');
  const [saving, setSaving] = useState(false);

  // Recruiter section (only for new drives)
  const [recruiterMode, setRecruiterMode] = useState<'none' | 'new' | 'existing'>('none');
  const [recruiterName, setRecruiterName] = useState('');
  const [recruiterEmail, setRecruiterEmail] = useState('');
  const [recruiterPassword, setRecruiterPassword] = useState('');
  const [existingRecruiterId, setExistingRecruiterId] = useState('');
  const [existingRecruiters, setExistingRecruiters] = useState<RecruiterAccount[]>([]);
  const [createdCredentials, setCreatedCredentials] = useState<{
    name: string;
    email: string;
    password: string;
  } | null>(null);

  useEffect(() => {
    if (!drive) {
      tpoService.getRecruiters().then((res) => {
        if (res.success) {
          setExistingRecruiters(res.recruiters);
        }
      }).catch(() => {});
    }
  }, [drive]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (drive?.id) {
        await companyService.updateCompany(drive.id, form);
        toast.success('Drive updated!');
        onSaved();
        onClose();
      } else {
        // Build request with optional recruiter fields
        const payload: Record<string, unknown> = { ...form };
        if (recruiterMode === 'new') {
          payload.recruiter_name = recruiterName;
          payload.recruiter_email = recruiterEmail;
          payload.recruiter_password = recruiterPassword;
        } else if (recruiterMode === 'existing' && existingRecruiterId) {
          payload.existing_recruiter_id = existingRecruiterId;
        }

        const res = await companyService.createCompany(payload as Partial<CompanyDrive>);
        toast.success('Drive created!');

        // Check if recruiter credentials were returned
        const fullRes = res as Record<string, unknown>;
        if (fullRes.recruiter && typeof fullRes.recruiter === 'object') {
          const rec = fullRes.recruiter as { name: string; email: string; password: string };
          setCreatedCredentials({
            name: rec.name,
            email: rec.email,
            password: rec.password,
          });
          // Don't close - show credentials first
          onSaved();
        } else {
          onSaved();
          onClose();
        }
      }
    } catch {
      toast.error('Failed to save drive');
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    const skill = skillInput.trim();
    if (skill && !form.required_skills.includes(skill)) {
      setForm({ ...form, required_skills: [...form.required_skills, skill] });
      setSkillInput('');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  // Show credentials banner after successful creation
  if (createdCredentials) {
    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 animate-slide-up">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recruiter Account Created</h2>
          <p className="text-sm text-gray-600 mb-4">
            Share these credentials with the company recruiter:
          </p>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-xs text-gray-500">Name</span>
                <p className="font-medium text-gray-900">{createdCredentials.name}</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <span className="text-xs text-gray-500">Email</span>
                <p className="font-medium text-gray-900">{createdCredentials.email}</p>
              </div>
              <button
                onClick={() => copyToClipboard(createdCredentials.email)}
                className="text-gray-400 hover:text-gray-600"
              >
                <HiOutlineClipboardCopy className="h-5 w-5" />
              </button>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <span className="text-xs text-gray-500">Password</span>
                <p className="font-mono font-medium text-gray-900">{createdCredentials.password}</p>
              </div>
              <button
                onClick={() => copyToClipboard(createdCredentials.password)}
                className="text-gray-400 hover:text-gray-600"
              >
                <HiOutlineClipboardCopy className="h-5 w-5" />
              </button>
            </div>
          </div>

          <p className="text-xs text-amber-600 mt-3">
            Make sure to save these credentials. The password cannot be recovered later.
          </p>

          <div className="flex justify-end mt-5">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-lg font-bold text-gray-900">
            {drive ? 'Edit Company Drive' : 'Create Company Drive'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <HiOutlineX className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
            <input
              type="text"
              value={form.company_name}
              onChange={(e) => setForm({ ...form, company_name: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Role</label>
            <input
              type="text"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min GPA</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={form.min_gpa}
                onChange={(e) => setForm({ ...form, min_gpa: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Allowed Backlogs</label>
              <input
                type="number"
                min="0"
                value={form.allowed_backlogs}
                onChange={(e) => setForm({ ...form, allowed_backlogs: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Drive Date</label>
            <input
              type="date"
              value={form.drive_date}
              onChange={(e) => setForm({ ...form, drive_date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Required Skills</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Add skill..."
              />
              <button type="button" onClick={addSkill} className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm">
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.required_skills.map((skill) => (
                <span key={skill} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                  {skill}
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, required_skills: form.required_skills.filter((s) => s !== skill) })}
                  >
                    <HiOutlineX className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Recruiter Account Section - only for new drives */}
          {!drive && (
            <div className="border-t border-gray-200 pt-4">
              <label className="block text-sm font-semibold text-gray-800 mb-2">Recruiter Account</label>
              <div className="flex gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setRecruiterMode('none')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    recruiterMode === 'none'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 text-gray-600 hover:border-gray-400'
                  }`}
                >
                  No Recruiter
                </button>
                <button
                  type="button"
                  onClick={() => setRecruiterMode('new')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    recruiterMode === 'new'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 text-gray-600 hover:border-gray-400'
                  }`}
                >
                  Create New
                </button>
                {existingRecruiters.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setRecruiterMode('existing')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      recruiterMode === 'existing'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    Use Existing
                  </button>
                )}
              </div>

              {recruiterMode === 'new' && (
                <div className="space-y-3 bg-gray-50 rounded-lg p-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Recruiter Name</label>
                    <input
                      type="text"
                      value={recruiterName}
                      onChange={(e) => setRecruiterName(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="Sneha Iyer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Recruiter Email</label>
                    <input
                      type="email"
                      value={recruiterEmail}
                      onChange={(e) => setRecruiterEmail(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="sneha@infosys.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Recruiter Password</label>
                    <input
                      type="text"
                      value={recruiterPassword}
                      onChange={(e) => setRecruiterPassword(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="recruiter123"
                    />
                  </div>
                </div>
              )}

              {recruiterMode === 'existing' && existingRecruiters.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Select Recruiter</label>
                  <select
                    value={existingRecruiterId}
                    onChange={(e) => setExistingRecruiterId(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="">Choose a recruiter...</option>
                    {existingRecruiters.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} ({r.email})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-800">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : drive ? 'Update Drive' : 'Create Drive'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
