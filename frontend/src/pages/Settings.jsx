import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { User, Bell, Shield, CreditCard } from "lucide-react";
import UserSettings from "@/components/ui/UserSettings";
import TrainerSettings from "@/components/ui/TrainerSettings";
import { useState } from "react";
import useAuthStore from "@/store/useAuthStore";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("Profile");
  const user = useAuthStore((s) => s.user);
  const role = user?.role === "TRAINER" ? "trainer" : "student";

  return (
    <DashboardLayout role={role}>
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <nav className="space-y-1">
            {[
              { name: "Profile", icon: User },
              { name: "Account", icon: Shield },
              { name: "Notifications", icon: Bell },
              { name: "Billing", icon: CreditCard },
            ].map((item) => (
              <Button
                key={item.name}
                variant={activeTab === item.name ? "secondary" : "ghost"}
                className="w-full justify-start gap-3"
                onClick={() => setActiveTab(item.name)}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Button>
            ))}
          </nav>

          <div className="md:col-span-3 space-y-6">
            {activeTab === "Profile" && (
              role === "trainer" ? <TrainerSettings /> : <UserSettings />
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
