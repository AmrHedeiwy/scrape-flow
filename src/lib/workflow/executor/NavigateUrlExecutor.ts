import { TExecutionEnvironment } from "@/types/executor";
import { ClickElementTask } from "../task/ClickElement";
import { NavigateUrlTask } from "../task/NavigateUrl";

export const NavigateUrlExecutorExecutor = async (
  environment: TExecutionEnvironment<typeof NavigateUrlTask>,
) => {
  try {
    const url = environment.getInput("URL");
    if (!url) {
      environment.log.error("input->url is not defined");
      return false;
    }

    await environment.getPage()!.goto(url, { waitUntil: "domcontentloaded" });
    environment.log.info(`visited ${url}`);
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
};
