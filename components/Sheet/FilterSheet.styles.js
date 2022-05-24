export const localStyles = ({ theme, isRTL }) => ({
  itemContainer: {
    flexDirection: isRTL ? "row-reverse" : "row",
    backgroundColor: theme.surface.primary,
    borderTopColor: theme.background.primary,
    borderTopWidth: 1,
    alignItems: "center",
    paddingStart: 15,
    minHeight: 50,
  },
  itemSubFilterContainer: (subfilter) => ({
    marginStart: subfilter ? 25 : null,
    marginEnd: "auto",
  }),
  itemSubFilterText: (subfilter) => ({
    fontStyle: subfilter ? "italic" : null,
  }),
  itemText: {
    color: theme.text.primary,
  },
  selectedIcon: {
    fontSize: 24,
    //marginStart: "auto",
    color: theme.text.link,
  },
});
