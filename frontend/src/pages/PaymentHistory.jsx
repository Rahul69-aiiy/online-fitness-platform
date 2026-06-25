import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  ExternalLink,
  ReceiptText,
  CalendarDays,
} from "lucide-react";
import { Link } from "react-router-dom";
import { usePaymentHistory } from "@/hooks/useSubscriptionQuery";
import Spinner from "@/components/ui/Spinner";


const STATUS_CONFIG = {
  SUCCESS: {
    label: "Paid",
    icon: CheckCircle2,
    className: "bg-green-500/10 text-green-500 border-green-500/20",
  },
  PENDING: {
    label: "Pending",
    icon: Clock,
    className: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  },
  FAILED: {
    label: "Failed",
    icon: XCircle,
    className: "bg-red-500/10 text-red-500 border-red-500/20",
  },
  REFUNDED: {
    label: "Refunded",
    icon: RefreshCw,
    className: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  },
};

function formatDate(dateStr) {
  try {
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

export default function PaymentHistory() {
  const { data: payments = [], isLoading } = usePaymentHistory();

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <ReceiptText className="w-8 h-8 text-primary" />
              Payment History
            </h1>
            <p className="text-muted-foreground mt-1">
              All your subscription payments in one place.
            </p>
          </div>
          <Link to="/trainers">
            <Button variant="outline" className="gap-2">
              <ExternalLink className="w-4 h-4" />
              Find Trainers
            </Button>
          </Link>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner size="lg" />
          </div>
        ) : payments.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-20 text-center">
              <CreditCard className="w-16 h-16 text-muted-foreground mb-4 opacity-30" />
              <h3 className="text-xl font-bold mb-2">No payments yet</h3>
              <p className="text-muted-foreground mb-6">
                Subscribe to a trainer to see your payment history here.
              </p>
              <Link to="/trainers">
                <Button>Explore Trainers</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {payments.map((payment) => {
              const status = STATUS_CONFIG[payment.status] || STATUS_CONFIG.PENDING;
              const StatusIcon = status.icon;
              const trainer = payment.subscription?.trainer;
              const trainerName = trainer?.user?.name || "Trainer";
              const trainerAvatar = trainer?.user?.avatar || "/user.jpg";
              const plan = payment.subscription?.plan;

              return (
                <Card
                  key={payment.id}
                  className="hover:border-primary/30 transition-colors"
                >
                  <CardContent className="p-5">
                    <div className="flex items-center gap-4 flex-wrap md:flex-nowrap">
                      {/* Trainer Avatar */}
                      <img
                        src={trainerAvatar}
                        alt={trainerName}
                        className="w-12 h-12 rounded-xl object-cover border border-border shrink-0"
                      />

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <div>
                            <p className="font-bold text-base">{trainerName}</p>
                            <p className="text-sm text-primary font-medium">
                              {plan?.name || "Subscription Plan"}
                            </p>
                          </div>
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${status.className}`}
                          >
                            <StatusIcon className="w-3.5 h-3.5" />
                            {status.label}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-4 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <CalendarDays className="w-3.5 h-3.5" />
                            {formatDate(payment.createdAt)}
                          </span>
                          {plan && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {plan.durationDays} day plan
                            </span>
                          )}
                          {payment.gatewayPaymentId && (
                            <span className="font-mono opacity-60">
                              ID: {payment.gatewayPaymentId}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Amount */}
                      <div className="text-right shrink-0">
                        <p className="text-xl font-bold">
                          ₹{Number(payment.amount).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
