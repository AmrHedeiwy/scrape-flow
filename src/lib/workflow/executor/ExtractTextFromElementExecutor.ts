import { TExecutionEnvironment } from "@/types/executor";
import { ExtractTextFromElementTask } from "../task/ExtractTextFromElement";

import * as cheerio from "cheerio";

export const ExtractTextFromElementExecutor = async (
  environment: TExecutionEnvironment<typeof ExtractTextFromElementTask>,
) => {
  try {
    const selector = environment.getInput("Selector");
    if (!selector) {
      environment.log.error("selector not defined");
      return false;
    }
    const html = environment.getInput("Html");
    if (!html) {
      environment.log.error("html not defined");
      return false;
    }

    const $ = cheerio.load(html);
    const element = $(selector);

    if (!element.length) {
      environment.log.error("element not defined");
      return false;
    }

    const extractedText = $.text(element);
    if (!extractedText) {
      environment.log.error("Element has no text");
      return false;
    }

    environment.setOutput("Extracted Text", extractedText);

    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
};
