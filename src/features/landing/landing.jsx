import Hero from "./components/Hero";
import Illustration from "./components/Illustration";
import InstallCard from "./components/InstallCard";
import GuestButton from "./components/GuestButton";
import AuthLinks from "./components/AuthLinks";

export default function Landing() {
  return (
    <main className="min-h-screen bg-white flex flex-col">
      <Hero />

      <Illustration />

      <InstallCard />

      <GuestButton />

      <AuthLinks />
    </main>
  );
}