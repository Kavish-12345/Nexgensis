import { redirect } from "next/navigation";

// The root has no content of its own. AuthGuard on /products sends
// logged-out users on to /login.
export default function Home() {
  redirect("/products");
}
