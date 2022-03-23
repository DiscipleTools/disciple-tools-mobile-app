export const localStyles = ({ theme, isRTL, isIOS }) => ({
  container: (idx) => ({
    alignItems: "center",
    borderTopWidth: idx !== 0 ? 1 : null,
    borderTopColor: idx !== 0 ? theme.surface.primary : null,
    paddingVertical: 10
  }),
  title: {
    color: theme.text.primary, 
    fontSize: 18,
    fontStyle: "italic",
  },
  buttonRowContainer: {
    justifyContent: "center",
    paddingBottom: 10,
    width: "100%",
  },
  buttonContainer: {
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    margin: 5,
  },
  buttonText: {
    color: theme.text.primary
  },
  placeholderContainer: {
    //justifyContent: "center"
    alignItems: "center",
    padding: 5
  },
  placeholderText: {
    color: theme.text.primary,
    fontStyle: "italic",
  }
});