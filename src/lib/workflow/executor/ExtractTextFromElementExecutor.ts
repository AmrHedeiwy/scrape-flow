import { TExecutionEnvironment } from "@/types/executor";
import { ExtractTextFromElementTask } from "../task/ExtractTextFromElement";

import * as cheerio from "cheerio";

export const ExtractTextFromElementExecutor = async (
  environment: TExecutionEnvironment<typeof ExtractTextFromElementTask>,
) => {
  try {
    const selector = environment.getInput("Selector");
    if (!selector) {
      console.error("No selector found");
      return false;
    }
    const html = environment.getInput("Html");
    if (!html) {
      console.error("No html found");
      return false;
    }

    const $ = cheerio.load(html);
    const element = $(selector);

    if (!element.length) {
      console.error("No element found with selector", selector);
      return false;
    }

    const extractedText = $.text(element);
    if (!extractedText) {
      console.error("No text found in element", selector);
      return false;
    }

    environment.setOutput("Extracted Text", extractedText);

    return true;
  } catch (error) {
    console.error("Error extracting text from element:", error);
    return false;
  }
};
