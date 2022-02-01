export const localStyles = ({ theme, isRTL, isIOS }) => ({
  container: (isStatusField, backgroundColor) => ({
    alignItems: 'center',
    paddingStart: 15,
    backgroundColor: isStatusField ? backgroundColor : null,
    borderWidth: 0,
    borderRadius: 5,
    height: "100%",
  }),
});