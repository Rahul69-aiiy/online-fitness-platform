import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import userImg from "@/assets/user.jpg";
import api from "@/lib/api";
import useAuthStore from "@/store/useAuthStore";
import useToastStore from "@/store/useToastStore";
import ConfirmationDialog from "./ConfirmationDialog";

export default function UserSettings() {
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const toast = useToastStore((s) => s.toast);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me");
        if (res.data?.success && res.data?.user) {
          setName(res.data.user.name || "");
          setAvatar(res.data.user.avatar || "");
        }
      } catch (err) {
        console.error("Error fetching user profile", err);
      }
    };
    fetchUser();
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

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await api.put("/users/profile", { name, avatar });
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


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Public Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-secondary overflow-hidden flex items-center justify-center">
              <img
                src={avatar || userImg}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              className="hidden"
              accept="image/*"
            />
            <Button variant="outline" type="button" onClick={() => fileInputRef.current?.click()}>
              Change Avatar
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/20 bg-destructive/5">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Permanently delete your account and all your data. This action
            cannot be undone.
          </p>
          <Button variant="destructive" onClick={() => setShowDeleteConfirm(true)}>Delete Account</Button>
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
