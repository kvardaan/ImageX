import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="w-full bottom-0 p-3 md:p-4 border-t dark:border-white/25 dark:text-white">
      <div className="flex flex-col md:flex-row md:justify-between gap-3 py-2">
        <div>
          <Link
            href="/"
            className="flex gap-2 font-medium text-sm md:text-lg items-center"
          >
            ImageX
          </Link>
        </div>
      </div>
    </footer>
  );
};
