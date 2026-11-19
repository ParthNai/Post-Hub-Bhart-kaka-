export interface LoginExperienceConfig {
  brandName: string;
  brandTagline: string;
  welcomeTitle: string;
  welcomeSubtitle: string;
  footerTagline: string;
  heroImageUrl: string;
  googleEnabled: boolean;
  emailEnabled: boolean;
  mobileEnabled: boolean;
  signupEnabled: boolean;
}

export const DEFAULT_LOGIN_EXPERIENCE: LoginExperienceConfig = {
  brandName: "Post Hub",
  brandTagline: "Design  ·  Create  ·  Inspire",
  welcomeTitle: "Welcome Back!",
  welcomeSubtitle: "Sign in to continue creating amazing designs with Post Hub 💜",
  footerTagline: "Turn Your Ideas Into Stunning Designs ✨",
  heroImageUrl: "",
  googleEnabled: true,
  emailEnabled: true,
  mobileEnabled: true,
  signupEnabled: true,
};
