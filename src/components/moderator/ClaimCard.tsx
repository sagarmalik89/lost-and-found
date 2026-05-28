"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";

type ClaimCardProps = {
  claim: {
    id: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    reason?: string | null;
    claimant: {
      email: string;
    };
    document: {
      id: string;
      type: string;
    };
  };
};

export default function ClaimCard({ claim }: ClaimCardProps) {
  const [status, setStatus] = useState<"PENDING" | "APPROVED" | "REJECTED">(claim.status);
  const [loading, setLoading] = useState(false);

  const handleAction = async (newStatus: "APPROVED" | "REJECTED") => {
    setLoading(true);
    try {
      const res = await fetch(`/api/claims/${claim.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Action failed");
      setStatus(newStatus);
      toast({
        title: "Success",
        description: `Claim has been ${newStatus.toLowerCase()}`,
        variant: "success",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update claim status",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-bold">
          {claim.document.type} (ID: {claim.document.id.substring(0, 8)}...)
        </CardTitle>
        <Badge variant={status === "PENDING" ? "secondary" : status === "APPROVED" ? "success" : "destructive"}>
          {status}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3 pt-2">
        <div className="text-sm text-slate-600 dark:text-slate-400">
          <p>
            <strong className="text-slate-900 dark:text-white">Claimant:</strong> {claim.claimant.email}
          </p>
          <p className="mt-1">
            <strong className="text-slate-900 dark:text-white">Reason/Proof:</strong> {claim.reason ?? "Not provided"}
          </p>
        </div>
        {status === "PENDING" && (
          <div className="flex space-x-2 pt-2">
            <Button
              size="sm"
              variant="default"
              disabled={loading}
              onClick={() => handleAction("APPROVED")}
            >
              Approve
            </Button>
            <Button
              size="sm"
              variant="destructive"
              disabled={loading}
              onClick={() => handleAction("REJECTED")}
            >
              Reject
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
