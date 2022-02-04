export const localStyles = ({ theme, isRTL, isIOS }) => ({
  icon: (focused) => ({
    color: focused ? theme.brand.primary : theme.disabled,
    marginBottom: -3,
    fontSize: 26,
  })
});