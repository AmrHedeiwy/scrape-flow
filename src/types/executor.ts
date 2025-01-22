import { Browser, Page } from "puppeteer";
import { TWorkflowTask } from "./workflow";

export type TEnvironment = {
  browser?: Browser;
  page?: Page;
  phases: Record<
    string, // nodeId
    {
      inputs: Record<string, string>;
      outputs: Record<string, string>;
    }
  >;
};

export type TExecutionEnvironment<T extends TWorkflowTask> = {
  getInput(name: T["inputs"][number]["name"]): string;
  setOutput(name: T["outputs"][number]["name"], value: string): void;

  getBrowser(): Browser | undefined;
  setBrowser(browser: Browser): void;

  getPage(): Page | undefined;
  setPage(page: Page): void;
};
