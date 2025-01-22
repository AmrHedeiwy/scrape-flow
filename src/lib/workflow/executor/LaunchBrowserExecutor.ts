import { TExecutionEnvironment } from "@/types/executor";

import puppeteer from "puppeteer";
import { LaunchBrowserTask } from "../task/LaunchBrowser";

export const LaunchBrowserExecutor = async (
  environment: TExecutionEnvironment<typeof LaunchBrowserTask>,
) => {
  try {
    const webSiteUrl = environment.getInput("Website Url");

    const browser = await puppeteer.launch({
      headless: true,
    });

    environment.log.info("Browser launched successfully");
    environment.setBrowser(browser);

    const page = await browser.newPage();
    await page.goto(webSiteUrl);

    environment.setPage(page);
    environment.log.info(`Opened page at ${webSiteUrl}`);

    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
};
