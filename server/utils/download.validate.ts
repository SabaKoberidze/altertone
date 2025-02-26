export function validateQueryForDownload(genre: string, fileType: string) {
  if (!genre) {
    return {
      status: 400,
      error: "genre is required",
    };
  }

  if (
    genre !== "rock" &&
    genre !== "punk" &&
    genre !== "jazz" &&
    genre !== "blues" &&
    genre !== "metal"
  ) {
    return {
      status: 400,
      error: "genre can only be one of this: rock, punk, jazz, blues, metal",
    };
  }

  if (!fileType) {
    return {
      status: 400,
      error: "fileType is required",
    };
  }

  if (
    fileType !== "Vocal" &&
    fileType !== "Music" &&
    fileType !== "Drums" &&
    fileType !== "Bass"
  ) {
    return {
      status: 400,
      error: "fileType can only be one of this: vocal, music, drums, bass",
    };
  }
}

export function validateBodyForDownload(body: string) {
  if (!body) {
    return {
      status: 400,
      error: "File path is required",
    };
  }
}
