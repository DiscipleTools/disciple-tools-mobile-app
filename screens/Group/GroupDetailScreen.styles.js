import { Dimensions, Platform, StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';

const containerPadding = 20;
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const circleSideSize = windowWidth / 3 + 20;
export const styles = StyleSheet.create({
  activeImage: {
    opacity: 1,
    height: '100%',
    width: '100%',
  },
  inactiveImage: {
    opacity: 0.15,
    height: '100%',
    width: '100%',
  },
  toggleText: {
    textAlign: 'center',
  },
  activeToggleText: {
    color: '#000000',
    fontSize: 9,
  },
  inactiveToggleText: {
    color: '#D9D5DC',
    fontSize: 9,
  },
  tabBarUnderlineStyle: {
    backgroundColor: Colors.tintColor,
  },
  tabStyle: { backgroundColor: '#FFFFFF' },
  fieldsIcons: {
    height: 22,
    width: 22,
  },
  addRemoveIcons: {
    fontSize: 30,
    marginRight: 0,
    color: Colors.addRemoveIcons,
  },
  addIcons: { color: 'green' },
  removeIcons: { color: 'red' },
  // Comments Section
  container: {
    paddingLeft: 19,
    paddingRight: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.mainBackgroundColor,
  },
  image: {
    height: 16,
    marginTop: 10,
    width: 16,
  },
  content: {
    backgroundColor: Colors.contentBackgroundColor,
    borderRadius: 5,
    flex: 1,
    marginLeft: 16,
    padding: 10,
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  name: {
    color: Colors.tintColor,
    fontSize: 13,
    fontWeight: 'bold',
  },
  time: {
    color: Colors.tintColor,
    fontSize: 10,
  },
  groupFABIcon: {
    color: 'white',
    fontSize: 20,
  },
  // Form
  formContainer: {
    paddingTop: 10,
    paddingBottom: 100,
    paddingLeft: containerPadding,
    paddingRight: containerPadding,
  },
  formRow: {
    paddingTop: 15,
    paddingBottom: 15,
    width: '100%',
  },
  formIconLabel: { marginLeft: 10, width: 'auto' },
  formIconLabelMarginLeft: {
    marginLeft: containerPadding + 10,
  },
  formIconLabelMargin: {
    marginRight: containerPadding + 10,
    marginTop: 25,
    marginBottom: 15,
  },
  formIcon: {
    color: Colors.tintColor,
    fontSize: 25,
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  formParentLabel: {
    width: 'auto',
    maxWidth: 75,
  },
  formLabel: {
    color: Colors.tintColor,
    fontSize: 12,
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  formDivider: {
    borderBottomColor: '#CCCCCC',
    borderBottomWidth: 1,
  },
  formDivider2: {
    marginTop: 25,
    marginBottom: 15,
  },
  formDivider2Margin: {
    marginTop: 25,
    marginBottom: 15,
    marginLeft: containerPadding + 10,
    marginRight: containerPadding + 10,
  },
  formIconLabelCol: {
    width: 35,
    marginRight: 10,
  },
  formIconLabelView: {
    alignItems: 'center',
  },
  formFieldPadding: {
    paddingTop: 30,
  },
  formContainerNoPadding: {
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
  },
  // Groups section
  groupCircleParentContainer: {
    height: circleSideSize,
  },
  groupCircleContainer: {
    height: '100%',
    width: circleSideSize,
  },
  groupCircle: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    position: 'absolute',
    height: '85%',
    width: '85%',
    marginTop: '7.5%',
    marginRight: '7.5%',
    marginBottom: '7.5%',
    marginLeft: '7.5%',
  },
  groupCenterIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    position: 'absolute',
    height: '40%',
    width: '40%',
    marginTop: '25%',
    resizeMode: 'contain',
  },
  groupCircleName: {
    justifyContent: 'center',
    marginTop: '20%',
    marginLeft: '20%',
    marginRight: '20%',
  },
  groupCircleNameText: { fontSize: 11, textAlign: 'center' },
  groupCircleCounter: {
    justifyContent: 'center',
    marginTop: '-5%',
  },
  groupIcons: {
    height: 30,
    width: 32,
  },
  progressIconText: {
    fontSize: 9,
    textAlign: 'center',
    width: '100%',
  },
  membersIconActive: {
    opacity: 1,
  },
  membersIconInactive: {
    opacity: 0.15,
  },
  membersLeaderIcon: {
    height: 30,
    width: 18,
    marginLeft: 0,
  },
  membersCloseIcon: {
    color: Colors.grayDark,
    fontSize: 25,
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  offlineBar: {
    height: 20,
    backgroundColor: '#FCAB10',
  },
  offlineBarText: {
    fontSize: 14,
    color: 'white',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  noCommentsContainer: {
    padding: 20,
    height: '90%',
    transform: [{ scaleY: -1 }],
  },
  noCommentsImage: {
    opacity: 0.5,
    height: 70,
    width: 70,
    padding: 10,
  },
  noCommentsText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#A8A8A8',
    marginTop: 10,
  },
  membersCount: {
    color: Colors.tintColor,
    fontSize: 15,
  },
  addMembersHyperlink: {
    paddingTop: 150,
    textAlign: 'center',
    color: '#A8A8A8',
    fontSize: 18,
    opacity: 0.7,
  },
  groupTextField: {
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: '#B4B4B4',
    height: 50,
    fontSize: 15,
  },
  groupTextRoundField: {
    borderWidth: 1,
    borderRadius: 5,
    borderStyle: 'solid',
    borderColor: '#B4B4B4',
    height: 50,
    fontSize: 15,
  },
  selectizeField: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#B4B4B4',
    borderBottomWidth: 1.5,
    borderBottomColor: '#B4B4B4',
    borderRadius: 5,
    minHeight: 50,
    marginTop: -15,
    padding: 10,
  },
  statusFieldContainer: Platform.select({
    default: {
      borderStyle: 'solid',
      borderWidth: 2,
      borderRadius: 3,
    },
    ios: {},
  }),
  validationErrorMessage: {
    color: Colors.errorBackground,
  },
  dateIcons: {
    width: 20,
    height: 20,
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  linkingText: {
    paddingTop: 4,
    paddingBottom: 8,
    textDecorationLine: 'underline',
  },
  suggestionsRowContainer: {
    flexDirection: 'row',
  },
  userIconBox: {
    height: 45,
    width: 45,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.tintColor,
  },
  usernameInitials: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14,
  },
  userDetailsBox: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 10,
    paddingRight: 15,
  },
  displayNameText: {
    fontSize: 13,
    fontWeight: '500',
  },
  usernameText: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.6)',
  },
  // Edit/Delete comment dialog
  dialogBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  dialogBox: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginLeft: 'auto',
    marginRight: 'auto',
    height: windowHeight - windowHeight * 0.55,
    width: windowWidth - windowWidth * 0.1,
    marginTop: windowHeight * 0.1,
  },
  dialogButton: {
    backgroundColor: Colors.tintColor,
    borderRadius: 5,
    width: 100,
    marginTop: 20,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  dialogContent: {
    height: '100%',
    width: '100%',
    fontSize: 20,
    textAlign: 'center',
    color: Colors.grayDark,
    marginBottom: 5,
  },
  commentsActionButtons: {
    borderRadius: 80,
    height: 40,
    width: 40,
    marginBottom: 10,
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  formFieldMargin: {
    marginTop: 20,
    marginBottom: 10,
  },
});
