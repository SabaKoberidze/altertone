import { createClient } from "@supabase/supabase-js";
import { defineEventHandler, readBody, getQuery } from "h3";
import {
  validateBodyForDownload,
  validateQueryForDownload,
} from "~/server/utils/download.validate";
import { capitalizeFirstLetter } from "~/server/utils/helper";

export default defineEventHandler(async (event) => {
  try {
    let filePath, bucketName, genre, fileType;

    try {
      const body = await readBody(event);
      const query = getQuery(event);
      genre = query.genre as string;
      fileType = capitalizeFirstLetter(query.fileType as string);
      filePath = body?.path;
      bucketName = body?.bucket || "altertone";
    } catch (e) {
      console.error("Error reading request body:", e);
      return {
        status: 400,
        error: "Invalid request body",
      };
    }

    const queryValidation = validateQueryForDownload(genre, fileType);
    const bodyValidation = validateBodyForDownload(filePath);

    if (queryValidation) {
      return queryValidation;
    }
    if (bodyValidation) {
      return bodyValidation;
    }

    const config = useRuntimeConfig();

    if (!config.supabaseUrl || !config.supabaseKey) {
      throw new Error("Supabase credentials are not properly configured");
    }

    const supabase = createClient(config.supabaseUrl, config.supabaseKey);

    const { data, error } = await supabase.storage
      .from(bucketName)
      .download(`${filePath}/${genre}/${fileType}.mp3`);

    if (error) {
      console.error("Supabase download error:", error);
      return {
        status: 404,
        error: "File not found or inaccessible",
      };
    }

    if (!data) {
      return {
        status: 404,
        error: "No data returned from storage",
      };
    }

    const arrayBuffer = await data.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    setResponseHeaders(event, {
      "Content-Type": data.type,
      "Content-Disposition": `attachment; filename="${fileType}.mp3"`,
      "Content-Length": buffer.length.toString(),
    });

    return buffer;
  } catch (error) {
    console.error("Download route error:", error);
    return {
      status: 500,
      error: error instanceof Error ? error.message : "Failed to download file",
    };
  }
});
