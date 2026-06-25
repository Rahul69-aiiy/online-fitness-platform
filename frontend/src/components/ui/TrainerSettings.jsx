import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import userImg from "@/assets/user.jpg";
import api from "@/lib/api";
import useAuthStore from "@/store/useAuthStore";
import useToastStore from "@/store/useToastStore";
import ConfirmationDialog from "./ConfirmationDialog";

export default function TrainerSettings() {
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [experience, setExperience] = useState("");
  const [bio, setBio] = useState("");
  const [primaryLocation, setPrimaryLocation] = useState("");
  const [certifications, setCertifications] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [newCertification, setNewCertification] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const toast = useToastStore((s) => s.toast);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/auth/me");
        if (res.data?.success && res.data?.user) {
          const u = res.data.user;
          setName(u.name || "");
          setAvatar(u.avatar || "");
          if (u.trainerProfile) {
            setSpecialization(u.trainerProfile.specialization || "");
            setExperience(u.trainerProfile.experience !== undefined && u.trainerProfile.experience !== null ? String(u.trainerProfile.experience) : "");
            setBio(u.trainerProfile.bio || "");
            setPrimaryLocation(u.trainerProfile.primaryLocation || "");
            setCertifications(u.trainerProfile.certifications || []);
            setCategories(u.trainerProfile.categories || []);
          }
        }
      } catch (err) {
        console.error("Error loading trainer profile", err);
      }
    };
    fetchProfile();
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addCertification = () => {
    if (newCertification) {
      setCertifications([...certifications, newCertification]);
      setNewCertification("");
    }
  };

  const removeCertification = (index) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await api.put("/trainers/profile", {
        name,
        avatar,
        specialization,
        experience,
        bio,
        primaryLocation,
        certifications,
        categories,
      });
      if (res.data?.success) {
        updateProfile({ name, avatar });
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.message || "Failed to update profile";
      toast.error(errMsg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDeleteAccount = async () => {
    try {
      await api.delete("/users/account");
      toast.success("Account deleted successfully.");
      window.location.href = "/login";
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.message || "Failed to delete account";
      toast.error(errMsg);
    }
  };


  const categoryOptions = [
    "STRENGTH",
    "YOGA",
    "HIIT",
    "CARDIO",
    "PILATES",
    "BOXING",
    "MEDITATION",
    "CROSSFIT",
  ];

  const toggleCategory = (cat) => {
    if (categories.includes(cat)) {
      setCategories(categories.filter((c) => c !== cat));
    } else {
      setCategories([...categories, cat]);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader>
            <CardTitle>Public Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left side: Basic Info */}
            <div className="lg:col-span-5 space-y-6">
              <h3 className="text-xs font-semibold text-foreground border-b pb-2 uppercase tracking-wider">Basic Information</h3>
              
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-secondary overflow-hidden flex items-center justify-center shrink-0">
                  <img src={avatar || userImg} alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  className="hidden"
                  accept="image/*"
                />
                <Button variant="outline" type="button" size="sm" onClick={() => fileInputRef.current?.click()}>
                  Change Avatar
                </Button>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase">Experience (Years)</label>
                <input
                  type="number"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase">Primary Location</label>
                <input
                  type="text"
                  value={primaryLocation}
                  onChange={(e) => setPrimaryLocation(e.target.value)}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>

            {/* Right side: Professional Details */}
            <div className="lg:col-span-7 space-y-6">
              <h3 className="text-xs font-semibold text-foreground border-b pb-2 uppercase tracking-wider">Professional Details</h3>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase">Specialization</label>
                <input
                  type="text"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase">Bio</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase">Certifications</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCertification}
                    onChange={(e) => setNewCertification(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addCertification()}
                    className="flex-1 px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="e.g. NASM-CPT"
                  />
                  <Button onClick={addCertification} variant="secondary" size="sm">Add</Button>
                </div>
                {certifications.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {certifications.map((cert, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 px-3 py-1 bg-secondary rounded-full text-sm">
                        <span>{cert}</span>
                        <button onClick={() => removeCertification(idx)} className="text-muted-foreground hover:text-destructive transition-colors">×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase">Categories</label>
                <div className="grid grid-cols-2 gap-2">
                  {categoryOptions.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
                        categories.includes(cat)
                          ? "bg-primary text-white border-primary"
                          : "bg-background border-border hover:bg-secondary"
                      }`}
                    >
                      {cat.charAt(0) + cat.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-border mt-6">
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/20 bg-destructive/5 mt-6">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Permanently delete your account and all your data. This action
            cannot be undone.
          </p>
          <Button variant="destructive" onClick={() => setShowDeleteConfirm(true)}>
            Delete Account
          </Button>
        </CardContent>
      </Card>

      <ConfirmationDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDeleteAccount}
        title="Delete Account"
        description="Are you absolutely sure you want to delete your account? This action is permanent and cannot be undone."
        confirmText="Permanently Delete"
      />
    </div>
  );
}
