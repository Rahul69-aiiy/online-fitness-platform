import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Bell, Shield, CreditCard } from "lucide-react";
import user from "@/assets/user.jpg"

export default function Settings() {
  return (
    <DashboardLayout role="student">
      <div className="max-w-4xl mx-auto space-y-8">
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
            ].map((item, i) => (
              <Button
                key={item.name}
                variant={i === 0 ? "secondary" : "ghost"}
                className="w-full justify-start gap-3"
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Button>
            ))}
          </nav>

          <div className="md:col-span-3 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Public Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-secondary overflow-hidden">
                    <img
                      src={user}
                      alt="Avatar"
                    />
                  </div>
                  <Button variant="outline">Change Avatar</Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground uppercase">
                      Full Name
                    </label>
                    <input
                      type="text"
                      defaultValue="John Doe"
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground uppercase">
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue="john@example.com"
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase">
                    Bio
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div className="flex justify-end">
                  <Button>Save Changes</Button>
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
                <Button variant="destructive">Delete Account</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
