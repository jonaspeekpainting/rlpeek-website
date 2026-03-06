/**
 * Approximate center coordinates for each service area (Summit/Wasatch region, Utah).
 * Used to place markers on the service areas map.
 */
export const SERVICE_AREA_COORDINATES: Record<string, [number, number]> = {
  "summit-county-ut-painting": [40.6461, -111.498],   // Park City area
  "kamas-ut-painting": [40.6433, -111.278],
  "oakley-ut-painting": [40.7147, -111.274],
  "park-city-ut-painting": [40.6461, -111.498],
  "deer-valley-ut-painting": [40.6374, -111.478],
  "wasatch-county-ut-painting": [40.5061, -111.414],  // Heber area
  "charleston-ut-painting": [40.4666, -111.469],
  "heber-ut-painting": [40.5061, -111.414],
  "hideout-ut-painting": [40.6161, -111.418],
  "midway-ut-painting": [40.5122, -111.474],
  "francis-ut-painting": [40.6127, -111.28],
};

/** Default map center: between Park City and Heber Valley */
export const MAP_CENTER: [number, number] = [40.55, -111.4];
export const MAP_DEFAULT_ZOOM = 10;
