export function AnimatedBackground() {
  return (
    <div className="absolute w-full max-w-[100rem] max-h-[50rem] left-0 right-0 mr-auto ml-auto z-[-1] h-full overflow-hidden blur-3xl top-0">
      <div className="hero relative h-full bg-gradient-to-tl from-green to-blue-500 via-violet-700 opacity-70 dark:opacity-70"></div>
    </div>
  );
}
