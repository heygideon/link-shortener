import { Accordion } from "@base-ui/react/accordion";
import { CaretDownIcon } from "@phosphor-icons/react";

export default function DomainsInfo() {
  return (
    <Accordion.Root>
      <Accordion.Item className="border border-neutral-700 data-open:bg-neutral-800">
        <Accordion.Header>
          <Accordion.Trigger className="group flex h-10 w-full items-center px-4 text-left text-sm">
            <span className="min-w-0 flex-1">adding your own domain</span>
            <CaretDownIcon
              weight="bold"
              className="size-3 group-data-panel-open:-rotate-180"
            />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Panel className="h-(--accordion-panel-height) overflow-hidden transition-[height] duration-300 ease-[steps(8)] data-ending-style:h-0 data-starting-style:h-0">
          <div className="space-y-2 p-4 pt-1 text-sm text-pretty text-neutral-400">
            <p>
              currently adding domains is done manually. if you want to get
              yours set up,{" "}
              <a
                href="https://hackclub.enterprise.slack.com/team/U09D42Q0ARJ"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-white"
              >
                dm me!
              </a>
            </p>
          </div>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion.Root>
  );
}
