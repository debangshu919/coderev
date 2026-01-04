import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Dashboard | CodeRev",
    description: "AI Powered Code Review",
};

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
