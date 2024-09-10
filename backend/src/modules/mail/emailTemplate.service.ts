import { readFile } from "fs/promises";
import handlebars from "handlebars";
import path from "path";

export const compileTemplate = async (templateName: string, context: any): Promise<string> => {
  try {
    const filePath = path.join(__dirname, "templates", `${templateName}.hbs`);
    const templateFile = await readFile(filePath, "utf8");
    const template = handlebars.compile(templateFile);
    return template(context);
  } catch (error) {
    console.error("Error compiling template:", error);
    throw error;
  }
};
