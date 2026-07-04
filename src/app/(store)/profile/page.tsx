import { createClient } from "@/utils/supabase/server";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LogOut, LayoutDashboard, Package } from "lucide-react";
import { logout } from "@/app/(auth)/actions";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [profile, orders] = await Promise.all([
    db.profile.findUnique({
      where: { id: user.id },
    }),
    db.order.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    })
  ]);

  if (!profile) {
    redirect("/login");
  }

  let addressString = "Not provided yet";
  if (orders.length > 0 && orders[0].shippingAddress) {
    const addr = orders[0].shippingAddress as any;
    addressString = `${addr.line1}, ${addr.city}, ${addr.state}, ${addr.postal_code}`;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            My Profile
          </h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            View your account details and order history.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {profile.role === "admin" && (
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              <LayoutDashboard className="h-4 w-4" />
              Admin Dashboard
            </Link>
          )}
          <form action={logout}>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-900/50"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Profile Info */}
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-4">Account Details</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Full Name</label>
                <p className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-50">
                  {profile.fullName || "Not provided"}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Email Address</label>
                <p className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-50">
                  {profile.email}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Account Type</label>
                <p className="mt-1 inline-flex rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-800 capitalize dark:bg-zinc-800 dark:text-zinc-200">
                  {profile.role}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Last Used Address</label>
                <p className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-50 truncate" title={addressString}>
                  {addressString}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Order History */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center gap-2 mb-6">
              <Package className="h-5 w-5 text-zinc-900 dark:text-zinc-50" />
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Order History</h2>
            </div>

            {orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Package className="h-12 w-12 text-zinc-300 dark:text-zinc-700 mb-4" />
                <p className="text-zinc-500 dark:text-zinc-400">You haven't placed any orders yet.</p>
                <Link
                  href="/shop"
                  className="mt-4 inline-flex items-center text-sm font-medium text-zinc-900 dark:text-zinc-50 hover:underline"
                >
                  Start Shopping &rarr;
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                          Order #{order.id.slice(0, 8).toUpperCase()}
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                          Placed on {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="mt-2 sm:mt-0 flex items-center gap-4">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize
                          ${order.status === 'paid' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' : 
                            order.status === 'pending' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' : 
                            'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300'}`}
                        >
                          {order.status}
                        </span>
                        <span className="font-bold text-zinc-900 dark:text-zinc-50">
                          ₹{Number(order.totalPrice).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {order.orderItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 overflow-hidden rounded-md border border-zinc-200 dark:border-zinc-800">
                              {item.product.images[0] ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={item.product.images[0]} alt={item.product.name} className="h-full w-full object-cover" />
                              ) : (
                                <div className="h-full w-full bg-zinc-100 dark:bg-zinc-800" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{item.product.name}</p>
                              <p className="text-xs text-zinc-500 dark:text-zinc-400">Qty: {item.quantity}</p>
                            </div>
                          </div>
                          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                            ₹{(Number(item.price) * item.quantity).toLocaleString("en-IN")}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
