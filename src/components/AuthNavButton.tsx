import { Link } from "@tanstack/react-router";
import { useAuthSession } from "@/hooks/useAuthSession";

const buttonClass =
  "bg-foreground px-5 py-2.5 text-[10px] font-bold tracking-[0.15em] text-background transition-opacity hover:opacity-80 md:text-xs";

export default function AuthNavButton() {
  const { isAuthenticated, loading } = useAuthSession();

  if (loading) {
    return <span className={`${buttonClass} invisible`} aria-hidden="true" />;
  }

  if (isAuthenticated) {
    return (
      <Link to="/compte" className={buttonClass}>
        MON COMPTE
      </Link>
    );
  }

  return (
    <Link to="/auth" className={buttonClass}>
      S'INSCRIRE / SE CONNECTER
    </Link>
  );
}
