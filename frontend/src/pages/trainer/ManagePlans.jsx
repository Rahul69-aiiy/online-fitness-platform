import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Pencil,
  Trash2,
  PackagePlus,
  Check,
  X,
  Clock,
  IndianRupee,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useMyPlans,
  useCreatePlan,
  useUpdatePlan,
  useDeletePlan,
} from "@/hooks/useSubscriptionQuery";
import Spinner from "@/components/ui/Spinner";
import useToastStore from "@/store/useToastStore";
import ConfirmationDialog from "@/components/ui/ConfirmationDialog";

const emptyForm = { name: "", description: "", price: "", durationDays: "" };

function PlanForm({ initial = emptyForm, onSubmit, onCancel, isPending, submitLabel }) {
  const [form, setForm] = useState(initial);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.durationDays) return;
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Plan Name *</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Monthly Basic"
            required
            className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium flex items-center gap-1">
            <IndianRupee className="w-3.5 h-3.5" /> Price (₹) *
          </label>
          <input
            name="price"
            type="number"
            min="1"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            placeholder="e.g. 999"
            required
            className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Duration (days) *
          </label>
          <input
            name="durationDays"
            type="number"
            min="1"
            value={form.durationDays}
            onChange={handleChange}
            placeholder="e.g. 30"
            required
            className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Description (optional)</label>
          <input
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Brief plan description..."
            className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>
      <div className="flex gap-2 pt-2">
        <Button type="submit" disabled={isPending} className="gap-2">
          {isPending ? <Spinner size="sm" /> : <Check className="w-4 h-4" />}
          {submitLabel}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="gap-2">
          <X className="w-4 h-4" />
          Cancel
        </Button>
      </div>
    </form>
  );
}

function PlanCard({ plan, onEdit, onDelete, isDeleting }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <Card className="hover:border-primary/30 transition-colors">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-base">{plan.name}</h3>
              {plan.description && (
                <p className="text-sm text-muted-foreground mt-0.5 truncate">{plan.description}</p>
              )}
              <div className="flex items-center gap-4 mt-3">
                <span className="flex items-center gap-1 text-primary font-bold text-xl">
                  ₹{Number(plan.price).toLocaleString("en-IN")}
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" />
                  {plan.durationDays} days
                </span>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onEdit(plan)}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                id={`edit-plan-${plan.id}`}
              >
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onDelete(plan.id)}
                disabled={isDeleting}
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                id={`delete-plan-${plan.id}`}
              >
                {isDeleting ? <Spinner size="sm" /> : <Trash2 className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function ManagePlans() {
  const toast = useToastStore((s) => s.toast);
  const { data: plans = [], isLoading } = useMyPlans();
  const createMutation = useCreatePlan();
  const updateMutation = useUpdatePlan();
  const deleteMutation = useDeletePlan();

  const [showCreate, setShowCreate] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [planIdToDelete, setPlanIdToDelete] = useState(null);

  const handleCreate = async (form) => {
    try {
      await createMutation.mutateAsync(form);
      toast.success("Plan created successfully!");
      setShowCreate(false);
    } catch (err) {
      toast.error(err?.message || "Failed to create plan");
    }
  };

  const handleUpdate = async (form) => {
    try {
      await updateMutation.mutateAsync({ planId: editingPlan.id, ...form });
      toast.success("Plan updated!");
      setEditingPlan(null);
    } catch (err) {
      toast.error(err?.message || "Failed to update plan");
    }
  };

  const handleDelete = (planId) => {
    setPlanIdToDelete(planId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!planIdToDelete) return;
    const planId = planIdToDelete;
    setShowDeleteConfirm(false);
    setPlanIdToDelete(null);
    setDeletingId(planId);
    try {
      await deleteMutation.mutateAsync(planId);
      toast.success("Plan deleted.");
    } catch (err) {
      toast.error(err?.message || "Failed to delete plan");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <DashboardLayout role="trainer">
      <div className="space-y-6 max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Subscription Plans</h1>
            <p className="text-muted-foreground mt-1">
              Create and manage the plans that students can subscribe to.
            </p>
          </div>
          {!showCreate && (
            <Button
              onClick={() => { setShowCreate(true); setEditingPlan(null); }}
              className="gap-2"
              id="add-plan-btn"
            >
              <Plus className="w-4 h-4" />
              Add Plan
            </Button>
          )}
        </div>

        {/* Create Form */}
        <AnimatePresence>
          {showCreate && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Card className="border-primary/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <PackagePlus className="w-4 h-4 text-primary" />
                    New Subscription Plan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <PlanForm
                    onSubmit={handleCreate}
                    onCancel={() => setShowCreate(false)}
                    isPending={createMutation.isPending}
                    submitLabel="Create Plan"
                  />
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Plans List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : plans.length === 0 && !showCreate ? (
          <Card>
            <CardContent className="flex flex-col items-center py-16 text-center">
              <PackagePlus className="w-16 h-16 text-muted-foreground mb-4 opacity-30" />
              <h3 className="text-xl font-bold mb-2">No plans yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first subscription plan to start accepting students.
              </p>
              <Button onClick={() => setShowCreate(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Create First Plan
              </Button>
            </CardContent>
          </Card>
        ) : (
          <AnimatePresence>
            {plans.map((plan) => (
              editingPlan?.id === plan.id ? (
                <motion.div
                  key={plan.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Card className="border-primary/30">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Pencil className="w-4 h-4 text-primary" />
                        Editing: {plan.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <PlanForm
                        initial={{
                          name: plan.name,
                          description: plan.description || "",
                          price: String(plan.price),
                          durationDays: String(plan.durationDays),
                        }}
                        onSubmit={handleUpdate}
                        onCancel={() => setEditingPlan(null)}
                        isPending={updateMutation.isPending}
                        submitLabel="Save Changes"
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  onEdit={(p) => { setEditingPlan(p); setShowCreate(false); }}
                  onDelete={handleDelete}
                  isDeleting={deletingId === plan.id}
                />
              )
            ))}
          </AnimatePresence>
        )}

        {/* Info box */}
        {plans.length > 0 && (
          <div className="flex items-start gap-3 p-4 bg-primary/5 border border-primary/20 rounded-xl text-sm">
            <AlertCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">Tip:</span> Students see these plans on your profile page.
              Clear plan names and competitive pricing help attract more subscribers.
            </p>
          </div>
        )}
      </div>

      <ConfirmationDialog
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setPlanIdToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Plan"
        description="Are you absolutely sure you want to delete this subscription plan? This action cannot be undone."
        confirmText="Delete Plan"
      />
    </DashboardLayout>
  );
}
