// src/app/moderator/claims/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import prisma from "@/src/lib/prisma";
import { redirect } from "next/navigation";
import ClaimCard from "@/components/moderator/ClaimCard";

export default async function ModeratorClaimsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/api/auth/signin");
  const role = (session.user as any).role;
  if (role !== "MODERATOR" && role !== "ADMIN") redirect("/");

  const pendingClaims = await prisma.claim.findMany({
    where: { status: "PENDING" },
    include: {
      document: {
        select: { id: true, type: true },
      },
      claimant: {
        select: { email: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold tracking-tight">Pending Claims</h1>
        <p className="text-sm text-slate-500">Review, approve, or reject claim requests filed by users</p>
      </div>

      {pendingClaims.length === 0 ? (
        <div className="text-center p-8 border border-dashed rounded-xl bg-slate-50 dark:bg-slate-900/50">
          <p className="text-sm text-slate-500">No pending claims found.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {pendingClaims.map((claim) => (
            <ClaimCard key={claim.id} claim={claim} />
          ))}
        </div>
      )}
    </div>
  );
}
