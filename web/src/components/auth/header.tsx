import { cn } from "@/lib/utils";
import { poppins } from "@/lib/utils/fonts";

interface HeaderProps {
  label: string;
}

export const Header = ({ label }: HeaderProps) => {
  return (
    <div className="w-full flex flex-col gap-y-4 items-center justify-center">
      <h1 className={cn("text-3xl font-semibold", poppins.className)}>
        ImageX
      </h1>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
};
