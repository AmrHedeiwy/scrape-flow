import { TExecutionEnvironment } from "@/types/executor";
import { ReadPropertyFromJsonTask } from "../task/ReadPropertyFromJson";

export const ReadPropertyFromJsonExecutor = async (
  environment: TExecutionEnvironment<typeof ReadPropertyFromJsonTask>,
) => {
  try {
    const jsonData = environment.getInput("JSON");
    if (!jsonData) {
      environment.log.error("input->jsonData is not defined");
      return false;
    }

    const propertyName = environment.getInput("Property name");
    if (!propertyName) {
      environment.log.error("input->propertyName is not defined");
      return false;
    }

    const json = JSON.parse(jsonData);
    const propertyValue = json[propertyName];
    if (!propertyValue) {
      environment.log.error("property not found");
      return false;
    }

    environment.setOutput("Property value", propertyValue);
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
};
