import { useState } from "react";
import { Star, Pencil, Trash2 } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import api from "@/lib/api";
import useToastStore from "@/store/useToastStore";
import ConfirmationDialog from "./ConfirmationDialog";

export default function ReviewCard({ review, currentUserId, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editRating, setEditRating] = useState(review.rating);
  const [editComment, setEditComment] = useState(review.comment);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const toast = useToastStore((s) => s.toast);

  const isOwner = currentUserId === review.userId;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await api.put(`/reviews/${review.id}`, {
        rating: editRating,
        comment: editComment
      });
      onUpdate(res.data.data);
      setIsEditing(false);
      toast.success("Review updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to update review");
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/reviews/${review.id}`);
      onDelete(review.id);
      toast.success("Review deleted successfully!");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to delete review");
    } finally {
      setIsDeleting(false);
    }
  };


  if (isEditing) {
    return (
      <div className="border-b border-border pb-6">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-bold">{review.user?.name || "User"}</h4>
          <div className="flex items-center gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setEditRating(i + 1)}
                className="text-yellow-500"
              >
                <Star
                  className={cn(
                    "w-3 h-3",
                    i < editRating ? "fill-current" : "text-muted",
                  )}
                />
              </button>
            ))}
          </div>
        </div>
        <textarea
          value={editComment}
          onChange={(e) => setEditComment(e.target.value)}
          className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none mb-2"
          rows={3}
        />
        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save"}
          </Button>
          <Button variant="outline" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div key={review.id} className="border-b border-border pb-6">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-bold">{review.user?.name || "User"}</h4>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-yellow-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-3 h-3",
                  i < review.rating ? "fill-current" : "text-muted",
                )}
              />
            ))}
          </div>
          {isOwner && (
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="w-4 h-4"/>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-red-500"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isDeleting}
              >
                <Trash2 className="w-4 h-4"/>
              </Button>
            </div>
          )}
        </div>
      </div>
      <p className="text-muted-foreground text-sm mb-2">
        {review.comment}
      </p>
      <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
        {new Date(review.date).toLocaleDateString()}
      </span>

      <ConfirmationDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Review"
        description="Are you sure you want to delete this review? This action cannot be undone."
        confirmText={isDeleting ? "Deleting..." : "Delete"}
      />
    </div>
  );
}

