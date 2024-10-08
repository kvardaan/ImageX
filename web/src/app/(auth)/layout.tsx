interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex items-center justify-center h-screen">{children}</div>
  );
}
