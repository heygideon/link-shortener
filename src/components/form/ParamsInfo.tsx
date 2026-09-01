import { Accordion } from "@base-ui/react/accordion";
import { CaretDownIcon } from "@phosphor-icons/react";

export default function ParamsInfo() {
  return (
    <Accordion.Root>
      <Accordion.Item className="border border-neutral-700 data-open:bg-neutral-800">
        <Accordion.Header>
          <Accordion.Trigger className="group flex h-10 w-full items-center px-4 text-left text-sm">
            <span className="min-w-0 flex-1">
              using dynamic links (with parameters)
            </span>
            <CaretDownIcon
              weight="bold"
              className="size-3 group-data-panel-open:-rotate-180"
            />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Panel className="h-(--accordion-panel-height) overflow-hidden transition-[height] duration-300 ease-[steps(8)] data-ending-style:h-0 data-starting-style:h-0">
          <div className="space-y-2 p-4 pt-1 text-sm text-pretty text-neutral-400">
            {/* <p>
              you can only create dynamic links if you own the domain.{" "}
              <i>
                (if you want to get yours set up,{" "}
                <a
                  href="https://hackclub.enterprise.slack.com/team/U09D42Q0ARJ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-white"
                >
                  dm me!
                </a>
                )
              </i>
            </p> */}
            <p>
              define parameters like{" "}
              <span className="text-cyan-300">:name</span>, using a colon and a
              name. use <span className="text-cyan-300">:splat*</span> to match
              the rest of the path.
            </p>
            <p>
              then, include them in the destination url with the same syntax,
              and they'll be replaced!
            </p>
            <ul className="list-inside list-disc space-y-1.5 *:pl-2">
              <li>
                <span className="text-cyan-300">/user/:id</span> matches
                /user/123 and /user/456
              </li>
              <li>
                <span className="text-cyan-300">/event/:id/signup</span> matches
                /event/123/signup
              </li>
              <li>
                <span className="text-cyan-300">/blog/:path*</span> matches
                /blog/2023 and /blog/2023/06/01 (but not /blog)
              </li>
            </ul>
          </div>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion.Root>
  );
}
