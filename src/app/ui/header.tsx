import Logo from "./logo";

export default function Header() {
  return (
    <header className="shrink-0 items-end rounded-lg bg-grey p-2">
      <Logo w={60} h={80} />
    </header>
  )
}