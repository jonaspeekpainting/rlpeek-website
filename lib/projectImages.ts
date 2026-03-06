/**
 * Maps project URL slugs to S3 folder names (truncated in bucket) and featured image keys.
 * S3 base: rl-peek-public-resources / images/projects/<folder>/
 */

const S3_FOLDERS_BY_PREFIX: [string, string][] = [
  ["exterior-painting-project-in-park-city-ut", "exterior-painting-project-in-park-city-ut"],
  ["summer-2017-painting-projects-in-park-city-ut", "summer-2017-painting-projects-in-park-city-ut"],
  ["interior-painting-project-in-park-city-ut", "interior-painting-project-in-park-city-ut"],
  ["stunning-interior-transformation-fresh-paint-cabinet-revival", "stunning-interior-transfor"],
  ["giving-back-to-the-community", "giving-back-to-the-communi"],
  ["complete-exterior-wood-stain-and-front-door-refinish-in-hideout", "complete-exterior-wood-sta"],
  ["high-end-exterior-stain-and-finish-on-fascia-trim-and-beams-park-city-home", "high-end-exterior-stain-an"],
  ["luxury-bathroom-interior-repaint", "luxury-bathroom-interior-r"],
  ["full-exterior-solid-stain-project-high-end-home-in-park-meadows-park-city-ut", "full-exterior-solid-stain-"],
  ["exterior-metal-light-repaint-high-end-home-in-glenwild", "exterior-metal-light-repai"],
  ["full-exterior-stain-transformation-modernizing-a-home-from-dark-outdated-color-to-contemporary-style", "full-exterior-stain-transf"],
  ["high-end-interior-repaint-private-ski-in-ski-out-condo-in-deer-crest-park-city-ut", "high-end-interior-repaint-"],
  ["interior-paint-finish-upgrade-game-room-golf-simulator-space-in-exclusive-park-city-ski-condos", "interior-paintfinish-upg"],
  ["premium-interior-kitchen-paint-luxury-home-old-town-park-city-ut", "premium-interior-kitchen-p"],
  ["elegant-china-cabinet-repaint-precision-interior-painting", "elegant-china-cabinet-repa"],
  ["interior-painting-project-custom-home-gym-in-park-meadows-park-city-ut", "interior-painting-project-"],
  ["primary-bedroom-interior-repaint-park-city-ut", "primary-bedroom-interior-r"],
  ["interior-wall-wood-ceiling-painting-pinebrook-ut", "interior-wallwood-ceilin"],
  ["cabinet-paint-project-interior-update-in-hideout-ut", "cabinet-paint-projectint"],
  ["exterior-staining-project-custom-home-in-jeremy-ranch-park-city-ut", "exterior-staining-project-"],
  ["lime-wash-accent-wall-interior-paint-feature-in-park-city-ut", "lime-wash-accent-wallint"],
  ["interior-drywall-repair-painting-park-city-ut", "interior-drywall-repairp"],
  ["primary-bedroom-bathroom-drywall-repair-and-interior-paint-promontory", "primary-bedroombathroom-"],
];

/** First image key (filename only) per S3 folder for featured image */
const FIRST_IMAGE_BY_FOLDER: Record<string, string> = {
  "cabinet-paint-projectint": "1.png",
  "complete-exterior-wood-sta": "IMG_0221.JPG",
  "elegant-china-cabinet-repa": "IMG_1599 Large.jpeg",
  "exterior-metal-light-repai": "IMG_0056 Large.jpeg",
  "exterior-painting-project-in-park-city-ut": "exterior-painting-park-city-ut-1.jpg",
  "exterior-staining-project-": "IMG_0351 Large.jpeg",
  "full-exterior-solid-stain-": "IMG_0748 Large.jpeg",
  "full-exterior-stain-transf": "FullSizeRender (1) 3.jpeg",
  "giving-back-to-the-communi": "20250301-DJS14256-scaled.webp",
  "high-end-exterior-stain-an": "IMG_0242 Large.jpeg",
  "high-end-interior-repaint-": "IMG_1464 Large.jpeg",
  "interior-drywall-repairp": "IMG_0058.jpeg",
  "interior-paintfinish-upg": "IMG_8512.jpeg",
  "interior-painting-project-": "IMG_5107.jpg",
  "interior-painting-project-in-park-city-ut": "woodside-interior-painting-1.jpg",
  "interior-wallwood-ceilin": "IMG_0484 Large.jpeg",
  "lime-wash-accent-wallint": "IMG_0261 Large.jpeg",
  "luxury-bathroom-interior-r": "IMG_7845.jpeg",
  "premium-interior-kitchen-p": "1045 Woodside-13 Large.jpeg",
  "primary-bedroom-interior-r": "Daly 279-4 Large.jpeg",
  "primary-bedroombathroom-": "IMG_0411 Large.jpeg",
  "stunning-interior-transfor": "IMG_0449.jpeg",
  "summer-2017-painting-projects-in-park-city-ut": "bedroom-interior-painting-2.jpg",
};

export function getProjectImageFolder(slug: string): string | null {
  const entry = S3_FOLDERS_BY_PREFIX.find(([s]) => s === slug);
  return entry ? entry[1] : null;
}

/** Returns S3 key for the project's featured image, e.g. images/projects/foo/bar.jpg */
export function getProjectFeaturedImageKey(slug: string): string | null {
  const folder = getProjectImageFolder(slug);
  if (!folder) return null;
  const filename = FIRST_IMAGE_BY_FOLDER[folder];
  if (!filename) return null;
  return `images/projects/${folder}/${filename}`;
}
