import { TExecutionEnvironment } from "@/types/executor";
import { ClickElementTask } from "../task/ClickElement";
import { DeliverViaWebhookTask } from "../task/DeliverViaWebhook";

export const DeliverViaWebhookExecutor = async (
  environment: TExecutionEnvironment<typeof DeliverViaWebhookTask>,
) => {
  try {
    const targetUrl = environment.getInput("Target URL");
    if (!targetUrl) {
      environment.log.error("input->targetUrl is not defined");
      return false;
    }

    const body = environment.getInput("Body");
    if (!body) {
      environment.log.error("input->body is not defined");
      return false;
    }

    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const status = response.status;
    if (status !== 200) {
      environment.log.error(`status code: ${status}`);
    }

    const responseBody = await response.json();
    environment.log.info(JSON.stringify(responseBody, null, 4));

    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
};
