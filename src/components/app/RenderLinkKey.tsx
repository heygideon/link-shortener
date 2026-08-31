import { Fragment } from "react/jsx-runtime";

function RenderLinkKeyPart({ part }: { part: string }) {
  if (/^:[A-Za-z0-9_-]+\*?$/.test(part)) {
    return <span className="text-cyan-300">{part}</span>;
  }
  return part;
}

export default function RenderLinkKey({ children }: { children: string }) {
  return children.split("/").map((part, idx) => (
    <Fragment
      //biome-ignore lint/suspicious/noArrayIndexKey: intended
      key={idx}
    >
      {idx > 0 && <span>/</span>}
      <RenderLinkKeyPart part={part} />
    </Fragment>
  ));
}
