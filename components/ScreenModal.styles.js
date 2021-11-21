import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    //margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 5,
    paddingTop: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    height: '95%',
    width: '95%',
  },
  buttonClose: {
    position: 'absolute',
    right: 15,
  },
  modalHeader: {
    flexDirection: 'row',
  },
  textHeader: {
    position: 'relative',
    top: 5,
    left: 10,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalContent: {
    paddingTop: 30,
    //padding: 5,
    width: '100%',
  },
});
