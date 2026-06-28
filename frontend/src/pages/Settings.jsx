import DashboardLayout from "@/components/layout/DashboardLayout";
import UserSettings from "@/components/ui/UserSettings";
import TrainerSettings from "@/components/ui/TrainerSettings";
import useAuthStore from "@/store/useAuthStore";

export default function Settings() {
  const user = useAuthStore((s) => s.user);
  const role = user?.role === "TRAINER" ? "trainer" : "student";

  return (
    <DashboardLayout role={role}>
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Profile Settings</h1>
        </div>

        <div className="space-y-6">
          {role === "trainer" ? <TrainerSettings /> : <UserSettings />}
        </div>
      </div>
    </DashboardLayout>
  );
}

