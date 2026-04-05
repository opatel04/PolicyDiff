import { redirect } from "next/navigation";
import { auth0 } from "@/lib/auth0";
import LandingMain from "../../../landing-page/src/landing-main";

export default async function LandingPage() {
  const session = await auth0.getSession();

  if (session) {
    redirect("/");
  }

  return <LandingMain />;
}
