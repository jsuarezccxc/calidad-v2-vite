/**
 * Vite-compatible image loader utility
 * Replaces CRA's require() pattern with import.meta.glob
 */

// Load all SVG images from assets/images
const imageModules = import.meta.glob<{ default: string }>(
  '../assets/images/**/*.svg',
  { eager: true }
);

// Load all PNG images from assets/images
const pngModules = import.meta.glob<{ default: string }>(
  '../assets/images/**/*.png',
  { eager: true }
);

// Merge all image modules
const allImages = { ...imageModules, ...pngModules };

/**
 * Get image source by path
 * @param imagePath - Path relative to src/assets/images (e.g., 'icon-name' or 'sidebar/icon-name')
 * @param extension - File extension (default: 'svg')
 * @returns Image source URL or empty string if not found
 */
export const getImageSrc = (imagePath: string, extension: string = 'svg'): string => {
  // Try different path patterns
  const patterns = [
    `../assets/images/${imagePath}.${extension}`,
    `../assets/images/${imagePath}`,
  ];

  for (const pattern of patterns) {
    const module = allImages[pattern];
    if (module?.default) {
      return module.default;
    }
  }

  // Log warning in development
  if (import.meta.env.DEV) {
    console.warn(`Image not found: ${imagePath}.${extension}`);
  }

  return '';
};

/**
 * Get SVG icon from assets/images
 * @param iconName - Icon name without extension
 * @returns Icon source URL
 */
export const getIconImage = (iconName: string): string => {
  return getImageSrc(iconName, 'svg');
};

/**
 * Get sidebar icon
 * @param iconName - Icon name without path or extension
 * @returns Icon source URL
 */
export const getSidebarIcon = (iconName: string): string => {
  return getImageSrc(`sidebar/${iconName}`, 'svg');
};

/**
 * Get electronic documents icon
 * @param iconName - Icon name without path or extension
 * @returns Icon source URL
 */
export const getElectronicDocIcon = (iconName: string): string => {
  return getImageSrc(`electronic-documents/${iconName}`, 'svg');
};

/**
 * Get plans icon
 * @param subPath - Sub path within plans folder (e.g., 'electronic-documents/detail1')
 * @returns Icon source URL
 */
export const getPlansIcon = (subPath: string): string => {
  return getImageSrc(`plans/${subPath}`, 'svg');
};

/**
 * Get template icon
 * @param iconName - Icon name without path or extension
 * @returns Icon source URL
 */
export const getTemplateIcon = (iconName: string): string => {
  return getImageSrc(`template/${iconName}`, 'svg');
};

/**
 * Get payment gateway icon
 * @param subPath - Sub path (e.g., 'wompi/instruction-name')
 * @param extension - File extension (default: 'png')
 * @returns Icon source URL
 */
export const getPaymentGatewayImage = (subPath: string, extension: string = 'png'): string => {
  return getImageSrc(`payment-gateway/${subPath}`, extension);
};

export default {
  getImageSrc,
  getIconImage,
  getSidebarIcon,
  getElectronicDocIcon,
  getPlansIcon,
  getTemplateIcon,
  getPaymentGatewayImage,
};
