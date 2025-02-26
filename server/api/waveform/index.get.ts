import { validateQueryForDownload } from "~/server/utils/download.validate";
import { getWaveforms } from "~/server/utils/waveform.service";

export default defineEventHandler(async (event) => {
  try {
    let genre, fileType;

    try {
      const query = getQuery(event);
      genre = query.genre as string;
      fileType = query.fileType as string;
    } catch (e) {
      return {
        status: 400,
        error: "Invalid request query",
      };
    }

    const queryValidation = validateQueryForDownload(
      genre,
      capitalizeFirstLetter(fileType)
    );

    if (queryValidation) {
      return queryValidation;
    }

    return getWaveforms(genre, fileType);
  } catch (error) {
    return {
      status: 500,
      error:
        error instanceof Error ? error.message : "Failed to get wave forms",
    };
  }
});
