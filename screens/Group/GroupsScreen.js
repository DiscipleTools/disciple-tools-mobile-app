import React from 'react';
import { connect } from 'react-redux';
import {
  View,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  Text,
} from 'react-native';
import { Fab, Container } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-easy-toast';

import PropTypes from 'prop-types';
import { SearchBar } from 'react-native-elements';
import Colors from '../../constants/Colors';
import { getAll } from '../../store/actions/groups.actions';
import i18n from '../../languages';


const styles = StyleSheet.create({
  flatListItem: {
    height: 90,
    backgroundColor: 'white',
    padding: 20,
  },
  groupSubtitle: {
    paddingTop: 6,
    fontWeight: '200',
    color: 'rgba(0,0,0,0.6)',
  },
  errorText: {
    textAlign: 'center',
    height: 100,
    padding: 20,
    color: 'rgba(0,0,0,0.4)',
  },
  searchBarContainer: {
    borderBottomWidth: 1,
    backgroundColor: Colors.tabBar,
    borderTopColor: '#FFF',
    borderBottomColor: '#FFF',
    borderColor: '#F2F2F2',
    paddingBottom: 10,
    marginBottom: 1,
    elevation: 5,
  },
  searchBarInput: {
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: 'white',
    borderColor: '#DDDDDD',
    borderBottomWidth: 1,
    borderWidth: 1
  },
  offlineBar:{
    height: 20,
    backgroundColor: '#FCAB10',
  },
  offlineBarText:{
    fontSize: 14,
    color: 'white',
    textAlignVertical: 'center',
    textAlign: 'center'
  }
});

let toastError;

class GroupsScreen extends React.Component {

  /* eslint-enable react/sort-comp */
  state = {
    refresh: false,
    search: '',
    dataSourceGroups: this.props.groups
  };

  componentDidUpdate(prevProps) {
    const { error } = this.props;
    if (prevProps.error !== error && error) {
      toastError.show(
        <View>
          <Text style={{ fontWeight: 'bold', color: Colors.errorText }}>
            {i18n.t('global.error.code')}
          </Text>
          <Text style={{ color: Colors.errorText }}>{error.code}</Text>
          <Text style={{ fontWeight: 'bold', color: Colors.errorText }}>
            {i18n.t('global.error.message')}
          </Text>
          <Text style={{ color: Colors.errorText }}>{error.message}</Text>
        </View>,
        3000,
      );
    }
  }

  renderRow = group => (
    <TouchableOpacity
      onPress={() => this.goToGroupDetailScreen(group)}
      style={styles.flatListItem}
      key={group.ID}
    >
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <Text style={{ fontWeight: 'bold' }}>{group.title}</Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          {this.props.groupSettings.group_status.values[group.group_status] ? (
            <Text style={styles.groupSubtitle}>
              {this.props.groupSettings.group_status.values[group.group_status].label}
            </Text>
          ) : <Text />}
          {this.props.groupSettings.group_status.values[group.group_status] && this.props.groupSettings.group_type.values[group.group_type] ? (
            <Text style={styles.groupSubtitle}>
               • 
            </Text>
          ) : <Text />}
          {(this.props.groupSettings.group_type.values[group.group_type]) ? (
            <Text style={styles.groupSubtitle}>
              {((this.props.groupSettings.group_type.values[group.group_type].label) ? this.props.groupSettings.group_type.values[group.group_type].label : '')}
            </Text>
          ) : <Text />}
          {this.props.groupSettings.group_type.values[group.group_type] && group.member_count ? (
            <Text style={styles.groupSubtitle}>
               • 
            </Text>
          ) : <Text />}
          {group.member_count ? (
            <Text style={styles.groupSubtitle}>
              {group.member_count}
            </Text>
          ) : <Text />}
        </View>
      </View>
    </TouchableOpacity>
  );

  flatListItemSeparator = () => (
    <View
      style={{
        height: 1,
        width: '100%',
        backgroundColor: '#dddddd',
      }}
    />
  );

  onRefresh = () => {
    this.props.getAllGroups(this.props.userData.domain, this.props.userData.token);
    this.setState({
      refresh: true,
    }, () => {
      this.setState({
        dataSourceGroups: this.props.groups,
        refresh: false
      })
    })
  };

  goToGroupDetailScreen = (groupData = null) => {
    if (groupData) {
      // Detail
      this.props.navigation.push('GroupDetail', {
        groupId: groupData.ID,
        onlyView: true,
        groupName: groupData.title,
        previousList: [],
        onGoBack: () => this.onRefresh(),
      });
    } else {
      // Create
      this.props.navigation.push('GroupDetail', {
        previousList: [],
        onGoBack: () => this.onRefresh(),
      });
    }
  };


  SearchFilterFunction(text) {
    const itemsFiltered = []
    this.props.groups.filter(function (item) {
      const textData = text.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      const itemDataTitle = item.title.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      const filterByTitle = itemDataTitle.includes(textData)
      filterByTitle == true ? itemsFiltered.push(item) : null
      return itemsFiltered
    })
    this.setState({
        refresh: true,
      }, () => {
        this.setState({
          dataSourceGroups: itemsFiltered,
          search: text,
          refresh: false
        })
      }) 
  }

  renderHeader = () => {
    return (
      <View>        
        <SearchBar
          placeholder={i18n.t('global.search')}
          onChangeText={text => this.SearchFilterFunction(text)}
          autoCorrect={false}
          value={this.state.search}
          containerStyle={styles.searchBarContainer}
          inputContainerStyle={styles.searchBarInput}
        />
        {!this.props.isConnected && this.offlineBarRender()}
      </View>
    );
  };

  offlineBarRender = () =>{
    return (
      <View style={[styles.offlineBar]}>
        <Text style={[styles.offlineBarText]}>{i18n.t('global.offline')}</Text>
      </View>
    ) 
  }

  static navigationOptions = {
    title: i18n.t('global.groups'),
    headerLeft: null,
    headerStyle: {
      backgroundColor: Colors.tintColor,
    },
    headerTintColor: '#FFFFFF',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  };
  
  render() {
    return (
      <Container>
        <View style={{ flex: 1 }}>
          <FlatList
            ListHeaderComponent={this.renderHeader}
            data={this.state.dataSourceGroups}
            extraData={this.state.refresh}
            renderItem={item => this.renderRow(item.item)}
            ItemSeparatorComponent={this.flatListItemSeparator}
            refreshControl={(
              <RefreshControl
                refreshing={this.props.loading}
                onRefresh={this.onRefresh}
              />
            )}
            keyExtractor={item => item.ID.toString()}
          />
          <Fab
            style={{ backgroundColor: Colors.tintColor }}
            position="bottomRight"
            onPress={() => this.goToGroupDetailScreen()}
          >
            <Icon name="md-add" />
          </Fab>
          <Toast
            ref={(toast) => {
              toastError = toast;
            }}
            style={{ backgroundColor: Colors.errorBackground }}
            positionValue={210}
          />
        </View>
      </Container>
    );
  }
}

GroupsScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }).isRequired,
  userData: PropTypes.shape({
    domain: PropTypes.string,
    token: PropTypes.string,
  }).isRequired,
  getAllGroups: PropTypes.func.isRequired,
  /* eslint-disable */
  groups: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.number
    })
  ),
  /* eslint-enable */
  error: PropTypes.shape({
    code: PropTypes.any,
    message: PropTypes.string,
  }),
  loading: PropTypes.bool,
  groupSettings: PropTypes.shape({
    group_status: PropTypes.shape({
      values: PropTypes.shape({}),
    }),
    group_type: PropTypes.shape({
      values: PropTypes.shape({}),
    }),
  }),
};
GroupsScreen.defaultProps = {
  error: null,
  loading: false,
  groupSettings: null,
  isConnected: null,
};

const mapStateToProps = state => ({
  userData: state.userReducer.userData,
  groups: state.groupsReducer.groups,
  loading: state.groupsReducer.loading,
  error: state.groupsReducer.error,
  groupSettings: state.groupsReducer.settings,
  isConnected: state.networkConnectivityReducer.isConnected,
});
const mapDispatchToProps = dispatch => ({
  getAllGroups: (domain, token) => {
    dispatch(getAll(domain, token));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GroupsScreen);
