import { TExecutionEnvironment } from "@/types/executor";
import { AddPropertyFromJsonTask } from "../task/AddPropertyFromJson";

export const AddPropertyFromJsonExecutor = async (
  environment: TExecutionEnvironment<typeof AddPropertyFromJsonTask>,
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

    const propertyValue = environment.getInput("Property value");
    if (!propertyValue) {
      environment.log.error("input->propertyValue is not defined");
      return false;
    }

    const json = JSON.parse(jsonData);
    json[propertyName] = propertyValue;
    environment.setOutput("Updated JSON", JSON.stringify(json));

    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
};
