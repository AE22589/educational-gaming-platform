export function TitleBranch({ side }: { side: "left" | "right" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 96 60" className={`shop-title-branch branch-${side}`}>
      <path d="M6 54C31 42 58 26 88 7" fill="none" stroke="#8f6638" strokeWidth="3" strokeLinecap="round" />
      <g fill="#79bd39" stroke="#4c9634" strokeWidth="2">
        <path d="M23 45C10 46 5 39 5 30c13 0 21 5 23 13z" />
        <path d="M34 39c-2-13 4-20 14-23 4 12 0 21-10 26z" />
        <path d="M50 30c-13-1-18-9-17-19 13 1 20 7 21 17z" />
        <path d="M61 22c1-13 8-18 19-18 0 12-6 20-17 22z" />
        <path d="M71 15c9-9 17-8 24-2-7 10-15 12-25 6z" />
      </g>
    </svg>
  );
}
