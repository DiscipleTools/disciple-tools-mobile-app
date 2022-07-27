const usePlugins = () => {
  // Mobile App Plugin
  const mobileAppPlugin = {
    enabled: true, // TODO
    label: "Mobile App", // TODO: i18n
    link: "https://disciple.tools/plugins/mobile-app/",
  };

  // TODO: 2FA Plugin

  return {
    mobileAppPlugin,
  };
};
export default usePlugins;
