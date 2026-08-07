import { isAdminAuthenticated } from "../lib/adminActions";
import { getSettings } from "../lib/settings";
import AdminLogin from "./login";
import AdminPanel from "./panel";

export default async function AdminPage() {
  const authed = await isAdminAuthenticated();

  if (!authed) {
    return <AdminLogin />;
  }

  const settings = getSettings();
  return <AdminPanel initialSettings={settings} />;
}
