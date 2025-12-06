import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="">
      hi
      <h1 className="text-5xl font-bold">The quick brown fox jumps over the lazy dog</h1>
      <Button asChild>
        <Link href="/editor/wqe">Editor </Link>
      </Button>
    </div>
  );
}
