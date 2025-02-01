import { TExecutionEnvironment } from "@/types/executor";
import { WaitForElementTask } from "../task/WaitForElement";

export const WaitForElementExecutor = async (
  environment: TExecutionEnvironment<typeof WaitForElementTask>,
) => {
  try {
    const selector = environment.getInput("Selector");
    if (!selector) {
      environment.log.error("input->selector is not defined");
      return false;
    }

    const visibility = environment.getInput("Visibility");
    if (!visibility) {
      environment.log.error("input->visibility is not defined");
      return false;
    }

    await environment.getPage()!.waitForSelector(selector, {
      visible: visibility === "visible",
      hidden: visibility === "hidden",
    });
    environment.log.info(`Element ${selector} became ${visibility}`);
    return true;
  } catch (error: any) {
    console.log(error);
    environment.log.error(error.message);
    return false;
  }
};
