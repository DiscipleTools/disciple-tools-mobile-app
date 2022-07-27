import { ThemeConstants } from "constants";

export const localStyles = ({ theme, isRTL, isIOS }) => ({
  container: {
    alignItems: "center",
    marginHorizontal: 5,
  },
  optionContainer: (selected) => ({
    backgroundColor: selected ? theme.brand.primary : theme.background.primary,
    borderColor: selected ? theme.highlight : theme.disabled,
    borderWidth: 1,
    borderRadius: 25,
    height: 30,
    marginStart: 3,
    marginEnd: 3,
    paddingStart: 5,
    paddingEnd: 5,
    alignItems: "center",
    justifyContent: "center",
  }),
  optionText: (selected) => ({
    color: selected
      ? ThemeConstants.DARK === theme.mode
        ? theme.text.primary
        : theme.text.inverse
      : theme.text.secondary,
    fontWeight: selected ? "bold" : null,
    paddingHorizontal: 2,
  }),
  optionCaret: (selected) => ({
    color: selected
      ? ThemeConstants.DARK === theme.mode
        ? theme.text.primary
        : theme.text.inverse
      : theme.text.secondary,
    fontSize: 20,
  }),
  optionCount: (selected) => ({
    backgroundColor: selected ? theme.text.primary : theme.background.primary,
    borderRadius: 10,
    paddingBottom: 2,
    marginStart: 3,
  }),
  optionCountText: (selected) => ({
    color: selected ? theme.primaryBrand : theme.text.primary,
    fontWeight: "bold",
    padding: 1,
  }),
  optionCountIcon: (selected) => ({
    color: selected ? theme.primaryBrand : theme.text.primary,
  }),
  clearFiltersIcon: (filtering) => ({
    color: filtering ? theme.text.primary : theme.disabled,
  }),
});
