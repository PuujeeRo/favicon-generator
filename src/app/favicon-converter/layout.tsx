
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This runs only once on the initial load of this layout
  // e.g. when the user signs in/up or on hard reload
  return (
    <>
        {children}
    </>
  );
}