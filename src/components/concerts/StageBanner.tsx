/** Dark concert-stage header card used at the top of concert, artist and city pages. */
export default function StageBanner({ children }: { children: React.ReactNode }) {
  return (
    <div className="stage-bg relative overflow-hidden rounded-3xl px-6 py-8 text-white shadow-[0_20px_50px_rgb(20_15_45/0.35)]">
      <div className="stage-beams pointer-events-none absolute inset-0" />
      <div className="relative">{children}</div>
    </div>
  );
}
