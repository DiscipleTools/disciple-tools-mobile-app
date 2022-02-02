export const localStyles = ({ theme, isRTL, isIOS }) => ({
  formRow: {
    backgroundColor: theme.surface.primary,
    paddingTop: 15,
    paddingBottom: 15,
    width: "100%",
  },
  formDivider: {
    borderBottomColor: theme.divider,
    borderBottomWidth: 1,
  },
  formIconLabel: {
    marginLeft: 10,
    marginBottom: "auto",
    width: "auto",
  },
  formLabel: {
    color: theme.text.primary,
    fontSize: 12,
    marginBottom: "auto",
  },
  formComponent: {
    marginRight: 10,
  },
  formControls: {
    marginRight: 5,
  },
  field: {
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 5,
    borderStyle: "solid",
    borderColor: theme.divider,
    height: "auto",
    fontSize: 14,
    minHeight: 40, 
  },
});