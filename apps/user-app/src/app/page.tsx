export default function Home() {
  return (
    <div className="flex justify-center items-center h-screen">
      ImageX
      {process.env.REDIS_PORT}
    </div>
  );
}
