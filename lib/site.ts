/**
 * Site-wide config and content helpers.
 */

export const SITE_URL = "https://www.rlpeekpainting.com";

/** Base URL for images in S3 (rl-peek-public-resources, us-east-1). Use s3Image() for full paths. */
export const S3_IMAGE_BASE =
  "https://rl-peek-public-resources.s3.us-east-1.amazonaws.com";

/** Full S3 URL for an object key (e.g. "images/logo.png"). Encodes path segments for spaces/special chars. */
export function s3Image(key: string): string {
  const path = key.startsWith("images/") ? key : `images/${key}`;
  const encoded = path.split("/").map(encodeURIComponent).join("/");
  return `${S3_IMAGE_BASE}/${encoded}`;
}
export const SITE_NAME = "RL Peek Painting";
export const PHONE = "435-649-0158";
export const PHONE_LINK = "tel:+1-435-649-0158";
export const ADDRESS = {
  street: "1950 Woodbine Way #3",
  city: "Park City",
  region: "UT",
  postalCode: "84060",
};

/** Jobsuite API for estimate/contact form submissions */
export const JOBSUITE_API_BASE = "https://api.jobsuite.app";
export const JOBSUITE_CONTRACTOR_ID = "af7500d8-c3b9-4414-b49d-9f50f79dcbab";

export const AREAS_SERVED = [
  "Park City, UT",
  "Deer Valley, UT",
  "Summit County, UT",
  "Wasatch County, UT",
  "Heber City, UT",
  "Midway, UT",
  "Kamas, UT",
  "Oakley, UT",
  "Hideout, UT",
  "Francis, UT",
  "Charleston, UT",
];
