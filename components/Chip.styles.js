import { ThemeConstants } from "constants";

export const localStyles = ({ theme, isRTL, isIOS }) => ({
  containerColor: (selected) => ({
    backgroundColor: selected ? theme.brand.primary : theme.background.primary,
    borderColor: selected ? theme.highlight : theme.disabled,
  }),
  container: {
    borderWidth: 1,
    borderRadius: 25,
    height: 30,
    margin: 2,
    paddingStart: 5,
    paddingEnd: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  label: (selected, isLink) => ({
    color: selected
      ? ThemeConstants.DARK === theme.mode
        ? theme.text.primary
        : theme.text.inverse
      : theme.text.primary,
    fontWeight: selected && !isLink ? "bold" : null,
    //textDecorationLine: "underline",
    paddingHorizontal: 2,
  }),
});
