// src/components/admin/ReportList.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";

type Report = {
  id: string;
  reason: string;
  createdAt: string;
  reporter: {
    name: string | null;
    email: string;
  };
  document: {
    id: string;
    type: string;
  } | null;
};

export default function ReportList() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const res = await fetch("/api/admin/reports");
      if (!res.ok) throw new Error("Failed to fetch reports");
      const data = await res.json();
      setReports(data);
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to load reports" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const resolveReport = async (reportId: string) => {
    try {
      const res = await fetch("/api/admin/reports", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId }),
      });
      if (!res.ok) throw new Error("Failed to resolve report");
      setReports((prev) => prev.filter((r) => r.id !== reportId));
      toast({ title: "Success", description: "Report successfully resolved" });
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Could not resolve report" });
    }
  };

  if (loading) return <p className="text-muted-foreground">Loading reports...</p>;
  if (reports.length === 0) return <p className="text-muted-foreground">No reports pending review.</p>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Document Type</TableHead>
          <TableHead>Reporter</TableHead>
          <TableHead>Reason</TableHead>
          <TableHead>Date Filed</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reports.map((report) => (
          <TableRow key={report.id}>
            <TableCell>{report.document ? report.document.type : "Unknown"}</TableCell>
            <TableCell>{report.reporter.name || report.reporter.email}</TableCell>
            <TableCell>{report.reason}</TableCell>
            <TableCell>{new Date(report.createdAt).toLocaleDateString()}</TableCell>
            <TableCell>
              <Button size="sm" variant="outline" onClick={() => resolveReport(report.id)}>
                Dismiss
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
