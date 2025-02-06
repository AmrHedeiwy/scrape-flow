import { TExecutionEnvironment } from "@/types/executor";
import { ClickElementTask } from "../task/ClickElement";
import { waitFor } from "@/lib/helper/waitFor";

export const ClickElementExecutor = async (
  environment: TExecutionEnvironment<typeof ClickElementTask>,
) => {
  try {
    const selector = environment.getInput("Selector");
    if (!selector) {
      environment.log.error("input->selector is not defined");
      return false;
    }

    await environment.getPage()!.click(selector);

    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
};
