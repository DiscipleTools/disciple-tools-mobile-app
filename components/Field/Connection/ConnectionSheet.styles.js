export const localStyles = ({ theme, isRTL }) => ({
  container: {
    backgroundColor: theme.background.primary,
    // shadow
    shadowColor: theme.text.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 2,
  },
  contentContainer: {
    backgroundColor: theme.surface.primary,
  },
  itemContainer: {
    //flexDirection: isRTL ? "row-reverse" : "row",
    borderTopColor: theme.background.primary,
    borderTopWidth: 1,
    alignItems: "center",
    minHeight: 50,
  },
  itemText: {
    fontSize: 32,
  },
  textContainer: {
    marginEnd: "auto",
    marginStart: 15,
  },
  sectionHeader: {
    backgroundColor: theme.background.primary,
    padding: 15,
  },
  avatar: {
    height: 16,
    width: 16,
    marginRight: 5,
  },
});
