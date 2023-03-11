import Constants from "constants";

export const localStyles = ({ theme, isRTL }) => ({
  container: {
    flex: 1,
    backgroundColor: theme.surface.primary,
    borderBottomColor: theme.background.primary,
    borderBottomWidth: 1,
    height: Constants.LIST_ITEM_HEIGHT,
  },
  subcontainer: {
    flex: 12,
  },
  subsubcontainer: {
    flex: 1,
    paddingVertical: 5,
    alignItems: "flex-start",
    marginEnd: "auto",
    flexWrap: "wrap",
  },
  detailsContainer: {
    flex: 10.5,
    //flexWrap: "wrap",
    alignItems: "flex-start",
    marginEnd: "auto",
  },
  title: {
    fontWeight: "bold",
  },
  caption: {
    color: theme.placeholder,
    fontSize: 11,
  },
  lastModifiedDateText: {
    flex: 1.5,
    color: theme.placeholder,
    fontStyle: "italic",
  },
  icon: {
    height: "100%",
    justifyContent: "center",
    marginStart: "auto",
    paddingEnd: 10,
  },
  infoIconContainer: {
    justifyContent: "center",
    marginTop: 2,
  },
  infoIcon: {
    margin: "auto",
    fontSize: 15,
  },
  alertIcon: {
    color: theme.error,
  },
  actionIcon: {
    paddingEnd: 20,
  },
});
