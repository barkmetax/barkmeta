const GRADERS = ['PSA', 'BGS', 'CGC'];

export default function Grading() {
  return (
    <section className="border-y-[3px] border-ink bg-doge">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 py-10 md:flex-row">
        <div>
          <h2 className="font-display text-4xl uppercase leading-none sm:text-5xl">Built to be Graded</h2>
          <p className="mt-2 max-w-xl font-semibold text-ink/80">
            Doginal Dogs TCG cards are printed to premium collectible standards and gradeable by all major
            grading services.
          </p>
        </div>
        <div className="flex gap-4">
          {GRADERS.map((grader) => (
            <span
              key={grader}
              className="flex h-20 w-20 items-center justify-center rounded-xl border-[3px] border-ink bg-paper font-display text-2xl shadow-[4px_4px_0_rgba(26,20,9,0.85)]"
            >
              {grader}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
