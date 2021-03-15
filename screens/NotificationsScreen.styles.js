import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  notificationContainer: {
    padding: 20,
  },
  prettyTime: {
    color: '#8A8A8A',
    fontSize: 10,
  },
  loadMoreFooterText: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    color: '#3f729b',
  },
  buttoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 35,
    padding: 5,
  },
  notificationUnreadButton: {
    borderRadius: 100,
    width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3f729b',
  },
  notificationReadButton: {
    borderRadius: 100,
    width: 25,
    height: 25,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#3f729b',
  },
  newHeader: {
    fontWeight: 'bold',
    marginBottom: 'auto',
    fontSize: 12,
  },
  newHeaderNumber: {
    marginRight: 5,
    fontSize: 12,
    padding: 2,
    backgroundColor: 'red',
    borderRadius: 100,
    color: 'white',
    marginBottom: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
  },
  markAllHeader: {
    color: '#3f729b',
    fontSize: 12,
    marginLeft: 'auto',
    marginBottom: 'auto',
  },
  marketButton: {
    borderRadius: 5,
    padding: 10,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    backgroundColor: '#3f729b',
  },
  marketButtonText: {
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: 14,
  },
  unmarketButton: {
    borderRadius: 5,
    padding: 10,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#3f729b',
  },
  unmarketButtonText: {
    alignItems: 'center',
    justifyContent: 'center',
    color: '#3f729b',
    fontSize: 14,
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
  dontHaveNotificationsText: {
    fontSize: 14,
    color: 'black',
    fontWeight: 'bold',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
