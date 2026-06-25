import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "./button";
import { X } from "lucide-react";

export default function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you absolutely sure?",
  description = "This action cannot be undone. This will permanently delete this item.",
  confirmText = "Delete",
  cancelText = "Cancel",
  variant = "destructive",
}) {
  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AnimatePresence>
        {isOpen && (
          <DialogPrimitive.Portal forceMount>
            {/* Backdrop Overlay */}
            <DialogPrimitive.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              />
            </DialogPrimitive.Overlay>

            {/* Modal Container */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <DialogPrimitive.Content asChild>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 15 }}
                  transition={{ duration: 0.2 }}
                  className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-[#121212]/95 backdrop-blur-md p-6 shadow-2xl relative glass"
                >
                  <DialogPrimitive.Close className="absolute right-4 top-4 text-muted-foreground hover:text-white transition-colors">
                    <X className="w-4 h-4" />
                  </DialogPrimitive.Close>

                  <DialogPrimitive.Title className="text-lg font-bold text-white mb-2">
                    {title}
                  </DialogPrimitive.Title>

                  <DialogPrimitive.Description className="text-sm text-muted-foreground mb-6">
                    {description}
                  </DialogPrimitive.Description>

                  <div className="flex justify-end gap-3">
                    <DialogPrimitive.Close asChild>
                      <Button variant="outline" size="sm" onClick={onClose}>
                        {cancelText}
                      </Button>
                    </DialogPrimitive.Close>
                    <Button
                      variant={variant}
                      size="sm"
                      onClick={() => {
                        onConfirm();
                        onClose();
                      }}
                    >
                      {confirmText}
                    </Button>
                  </div>
                </motion.div>
              </DialogPrimitive.Content>
            </div>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
}
