import Logo from "@/components/Logo";

export default function Loading() {
  return (
    <div className="fixed flex items-center justify-center top-0 left-0 w-full h-[100vh] bg-slate-50">
      <div className="animate-blink">
        <Logo/>
      </div>
    </div>
  );
}
