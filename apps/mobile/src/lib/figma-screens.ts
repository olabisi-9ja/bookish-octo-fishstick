/**
 * Every route in this app and the Figma frame it is built from.
 *
 * `built: true` means the screen has been implemented from get_design_context
 * on that node and checked against get_screenshot. `built: false` means the
 * route exists and navigates, but the screen is still a placeholder - it has
 * NOT been drawn from Figma yet. Nothing here is guessed from a screenshot.
 *
 * Source: Figma tGWQGJbGogndVTvpVjzxYa, page "app design" 39:456, 38 frames,
 * all 402 x 874. Mirrored in design/figma-manifest.json.
 */
export interface ScreenRef {
  route: string;
  node: string;
  figmaName: string;
  built: boolean;
}

export const SCREENS: ScreenRef[] = [
  // onboarding - 5
  { route: '/(onboarding)/splash', node: '42:3', figmaName: 'onboarding', built: false },
  { route: '/(onboarding)/intro-1', node: '42:5', figmaName: 'Splash screen 1', built: true },
  { route: '/(onboarding)/intro-2', node: '191:429', figmaName: 'Splash screen 2', built: true },
  { route: '/(onboarding)/intro-3', node: '198:446', figmaName: 'Splash screen 3', built: true },
  { route: '/(onboarding)/intro-4', node: '200:463', figmaName: 'Splash screen 4', built: true },

  // auth - 14
  { route: '/(auth)/signup', node: '46:9', figmaName: 'Create an Account - Email', built: false },
  { route: '/(auth)/signup-details', node: '58:197', figmaName: 'Create an Account - Email', built: false },
  { route: '/(auth)/login', node: '58:256', figmaName: 'Login - Phone Number', built: false },
  { route: '/(auth)/login-password', node: '62:314', figmaName: 'Login - Phone Number', built: false },
  { route: '/(auth)/otp-email', node: '65:76', figmaName: 'OTP verification - Email', built: false },
  { route: '/(auth)/otp-email-filled', node: '65:185', figmaName: 'OTP verification - Email', built: false },
  { route: '/(auth)/otp-phone', node: '65:157', figmaName: 'OTP verification - phone number', built: false },
  { route: '/(auth)/otp-phone-filled', node: '65:213', figmaName: 'OTP verification - Phone number', built: false },
  { route: '/(auth)/reset-email', node: '62:368', figmaName: 'Reset Password - Email', built: false },
  { route: '/(auth)/reset-phone', node: '65:48', figmaName: 'Reset Password - Phone', built: false },
  { route: '/(auth)/reset-otp', node: '65:241', figmaName: 'Reset Password - Phone', built: false },
  { route: '/(auth)/reset-new', node: '69:269', figmaName: 'Reset Password - Phone', built: false },
  { route: '/(auth)/reset-confirm', node: '228:264', figmaName: 'Reset Password - Phone', built: false },
  { route: '/(auth)/reset-done', node: '103:708', figmaName: 'Reset Password - Phone', built: false },

  // kyc - 5
  { route: '/(kyc)/identity', node: '73:303', figmaName: 'Verify your identity', built: false },
  { route: '/(kyc)/nin', node: '91:222', figmaName: 'Verify your identity - NIN', built: false },
  { route: '/(kyc)/licence', node: '99:255', figmaName: "Verify your identity - Driver's Licence", built: false },
  { route: '/(kyc)/licence-filled', node: '99:327', figmaName: "Verify your identity - Driver's Licence", built: false },
  { route: '/(kyc)/licence-review', node: '99:397', figmaName: "Verify your identity - Driver's Licence", built: false },

  // role - 1
  { route: '/role', node: '99:437', figmaName: 'role selection', built: false },

  // driver onboarding - 5
  { route: '/(driver)/licence-upload', node: '103:497', figmaName: "Driver's license upload", built: false },
  { route: '/(driver)/vehicle', node: '103:534', figmaName: 'Tell us about your vehicle', built: false },
  { route: '/(driver)/documents', node: '103:584', figmaName: 'Confirm your vehicle documents', built: false },
  { route: '/(driver)/selfie', node: '103:609', figmaName: 'Selfie capture', built: false },
  { route: '/(driver)/payout', node: '103:679', figmaName: 'Where should we send your earnings?', built: false },

  // rider - 8
  { route: '/(rider)/home', node: '118:137', figmaName: 'rider homepage', built: false },
  { route: '/(rider)/home-search', node: '158:908', figmaName: 'rider homepage', built: false },
  { route: '/(rider)/home-results', node: '162:1076', figmaName: 'rider homepage', built: false },
  { route: '/(rider)/datetime', node: '163:1151', figmaName: 'date and time picker', built: false },
  { route: '/(rider)/pickup', node: '151:450', figmaName: 'rider pickup search', built: false },
  { route: '/(rider)/pickup-results', node: '153:670', figmaName: 'rider pickup search', built: false },
  { route: '/(rider)/dropoff', node: '158:983', figmaName: 'rider drop off search', built: false },
  { route: '/(rider)/dropoff-results', node: '158:1028', figmaName: 'rider drop off search', built: false },
];

export const FIGMA_FILE = 'tGWQGJbGogndVTvpVjzxYa';
export const figmaUrl = (node: string) =>
  `https://www.figma.com/design/${FIGMA_FILE}/comuta?node-id=${node.replace(':', '-')}`;

export const builtCount = () => SCREENS.filter((s) => s.built).length;
