import AdminNav from "@/components/AdminNav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-vault-black">
      <AdminNav />
      <main className="lg:pl-64 pt-16 lg:pt-0 min-h-screen">
        {children}
      </main>
    </div>
  );
}