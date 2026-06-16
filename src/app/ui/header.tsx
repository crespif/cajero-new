import Logo from "./logo";

export default function Header() {
  return (
    <header className="site-header print:hidden">
      <Logo w={48} h={60} />
    </header>
  );
}
