import Image from "next/image";

export default function Logo({ w, h }: { w: number; h: number }) {
  return (
    <Image
      width={w}
      height={h}
      src="/logo.png"
      alt="logo"
      className="drop-shadow-xl"
      style={{ width: "auto", height: "auto" }}
      priority
    />
  );
}
