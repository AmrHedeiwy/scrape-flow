import { TExecutionEnvironment } from "@/types/executor";
import { ExtractDataWithAITask } from "../task/ExtractDataWithAI";
import prisma from "@/lib/primsa";
import { symmtericDecrypt } from "@/lib/encryption";

import OpenAI from "openai";

export const ExtractDataWithAIExecutor = async (
  environment: TExecutionEnvironment<typeof ExtractDataWithAITask>,
) => {
  try {
    const credentials = environment.getInput("Credentials");
    if (!credentials) {
      environment.log.error("input->credentials is not defined");
      return false;
    }

    const prompt = environment.getInput("Prompt");
    if (!prompt) {
      environment.log.error("input->prompt is not defined");
      return false;
    }

    const content = environment.getInput("Content");
    if (!content) {
      environment.log.error("input->content is not defined");
      return false;
    }

    const credential = await prisma.credential.findUnique({
      where: {
        id: credentials,
      },
    });
    if (!credential) {
      environment.log.error("credential not found");
      return false;
    }

    const plainCredentialValue = symmtericDecrypt(credential.value);
    if (!plainCredentialValue) {
      environment.log.error("failed to decrypt credential");
      return false;
    }

    // const openai = new OpenAI({ apiKey: plainCredentialValue });
    // const response = await openai.chat.completions.create({
    //   model: "gpt-4o-mini",
    //   messages: [
    //     {
    //       role: "system",
    //       content:
    //         "You are a webscraper helper that extracts data from HTML or text. You will be given a piece of text or HTML content as input and also the prompt with the data you have to extract. The reponse should always be only the extracted data as a JSON array or object, without any additional words or explanations. Analyze the input carefully and extract data precisely based on the prompt. If no data is found, return an empty JSON array. Work with only the provided content and ensure the output is always a valid JSON array without any surrounding text.",
    //     },
    //     { role: "user", content },
    //     { role: "user", content: prompt },
    //   ],
    //   temperature: 0.6,
    // });

    // environment.log.info(`Prompt tokens: ${response.usage?.prompt_tokens}`);
    // environment.log.info(
    //   `Completion tokens: ${response.usage?.completion_tokens}`,
    // );

    // const result = response.choices[0].message.content;
    // if (!result) {
    //   environment.log.error("empty response from AI");
    //   return false;
    // }
    const result = {
      usernameSelector: "#username",
      passwordSelector: "#password",
      loginSelector: "body > div > form > input.btn.btn-primary",
    };

    environment.setOutput("Extracted Data", JSON.stringify(result));

    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
};
