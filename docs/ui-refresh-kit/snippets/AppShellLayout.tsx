export function AppShellLayout({ top, board, bottom }: { top: React.ReactNode; board: React.ReactNode; bottom: React.ReactNode }) {
  return (
    <div className="app-shell">
      <header>{top}</header>
      <main>{board}</main>
      <footer>{bottom}</footer>
    </div>
  );
}
