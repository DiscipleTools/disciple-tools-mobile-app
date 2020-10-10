import { MaterialIcons } from '@expo/vector-icons';
import { Input, Item } from 'native-base';
import React from 'react';
import {
  Platform,
  ScrollView,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Colors from '../constants/Colors';
import i18n from '../languages';
import Accordion from 'react-native-collapsible/Accordion';
import PropTypes from 'prop-types';
import { CheckBox } from 'react-native-elements';
import { Header } from 'react-navigation-stack';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

const styles = StyleSheet.create({
  searchBarContainer: {
    borderBottomWidth: 1,
    backgroundColor: Colors.tabBar,
    borderBottomColor: '#FFF',
  },
  searchBarScrollView: {
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 9,
    minHeight: 60,
  },
  searchBarItem: {
    borderColor: '#DDDDDD',
    borderRadius: 3,
    borderWidth: 10,
  },
  searchBarIcons: {
    fontSize: 20,
    color: 'gray',
    padding: 10,
  },
  searchBarInput: {
    color: 'gray',
    height: 41,
    fontSize: 18,
  },
  chip: {
    borderColor: '#c2e0ff',
    borderWidth: 1,
    backgroundColor: '#ecf5fc',
    borderRadius: 2,
    padding: 4,
    marginRight: 4,
    marginBottom: 4,
  },
});

const windowHeight = Dimensions.get('window').height,
  headerHeight = Header.HEIGHT;

let initialState = {
  search: '',
  filter: {
    toggle: false,
    ID: '',
    query: {},
    name: '',
  },
  sections: [],
  activeSections: [],
};

class SearchBar extends React.Component {
  state = {
    ...initialState,
  };

  filterByText = (text) => {
    this.setState(
      {
        search: text,
        activeSections: initialState.activeSections,
        // Reset option filter to their initial state
        filter: {
          ...initialState.filter,
        },
      },
      () => {
        this.props.onTextFilter(text);
      },
    );
  };

  filterByOption = (filterId, filterQuery, filterName) => {
    this.setState(
      {
        filter: {
          ID: filterId,
          toggle: false,
          query: {
            ...filterQuery,
          },
          name: filterName,
        },
        activeSections: initialState.activeSections,
        // Reset text filter to their initial state
        search: initialState.search,
      },
      () => {
        this.props.onSelectFilter({
          ...filterQuery,
        });
      },
    );
  };

  clearTextFilter = () => {
    this.setState(
      {
        search: initialState.search,
      },
      () => {
        this.props.onClearTextFilter('');
      },
    );
  };

  resetFilters = () => {
    this.setState(
      (prevState) => ({
        ...initialState,
        sections: [...prevState.sections],
      }),
      () => {
        this.props.onClearTextFilter('');
      },
    );
  };

  // Function used to update render on Contact/Group screens when current filter its active
  refreshFilter = () => {
    if (this.state.search.length > 0) {
      this.filterByText(this.state.search);
    } else if (this.state.filter.ID.length > 0) {
      this.filterByOption(this.state.filter.ID, this.state.filter.query, this.state.filter.name);
    }
  };

  renderSectionHeader = (section, index, isActive, sections) => {
    return (
      <View
        style={[
          {
            backgroundColor: isActive ? Colors.primary : '#FFFFFF',
            height: 50,
            paddingLeft: 15,
            paddingRight: 15,
            flexDirection: 'row',
            borderWidth: 1,
            borderColor: Colors.grayLight,
          },
        ]}>
        <Text
          style={{
            color: isActive ? '#FFFFFF' : Colors.primary,
            marginTop: 'auto',
            marginBottom: 'auto',
            fontWeight: 'bold',
          }}>
          {section.label}
        </Text>
        {section.count ? (
          <Text
            style={{
              color: isActive ? '#FFFFFF' : Colors.primary,
              marginTop: 'auto',
              marginBottom: 'auto',
            }}>
            {` (${section.count})`}
          </Text>
        ) : null}
        <Text
          style={{
            color: isActive ? '#FFFFFF' : Colors.primary,
            marginTop: 'auto',
            marginBottom: 'auto',
            marginLeft: 'auto',
          }}>
          {isActive ? '-' : '+'}
        </Text>
      </View>
    );
  };

  renderSectionContent = (section, index, isActive, sections) => {
    let content = this.props.filterConfig.filters.filter(
      (filter) => filter.tab === section.key && !filter.type,
    );
    return (
      <View
        key={index}
        style={{
          borderWidth: 1,
          borderColor: Colors.grayLight,
          padding: 15,
        }}>
        {content.map((filter) => (
          <TouchableOpacity
            key={filter.ID}
            activeOpacity={0.5}
            onPress={() => {
              this.filterByOption(filter.ID, filter.query, filter.name);
            }}>
            <View
              style={{
                flexDirection: 'row',
                height: 50,
                paddingLeft: filter.subfilter ? 20 : 0,
              }}>
              <CheckBox
                Component={TouchableWithoutFeedback}
                checked={filter.ID === this.state.filter.ID}
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                containerStyle={{
                  padding: 0,
                  margin: 0,
                }}
              />
              <Text
                style={{
                  paddingTop: Platform.OS === 'ios' ? 4 : 0,
                }}>
                {filter.name}
              </Text>
              <Text
                style={{
                  marginLeft: 'auto',
                  paddingTop: Platform.OS === 'ios' ? 4 : 0,
                }}>
                {filter.count}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  showFiltersPanel = () => {
    this.setState((previousState) => ({
      filter: {
        ...previousState.filter,
        toggle: !previousState.filter.toggle,
      },
    }));
  };

  updateSections = (activeSections) => {
    this.setState({ activeSections });
  };

  render() {
    return (
      <View
        style={[
          styles.searchBarContainer,
          Platform.OS == 'ios'
            ? { borderBottomColor: Colors.grayLight, borderBottomWidth: 1 }
            : { elevation: 5 },
          {},
        ]}
        onLayout={(event) => {
          let viewHeight = event.nativeEvent.layout.height;
          // headerHeight * 2 because headerHeight + bottomBarNavigation height
          this.props.onLayout(
            windowHeight - (viewHeight + headerHeight * 2) < 100 && Platform.OS == 'android',
          );
        }}>
        <ScrollView style={styles.searchBarScrollView}>
          <Item regular style={styles.searchBarItem}>
            <MaterialIcons name="search" style={styles.searchBarIcons} />
            <Input
              placeholder={i18n.t('global.search')}
              onChangeText={this.filterByText}
              autoCorrect={false}
              value={this.state.search}
              style={styles.searchBarInput}
            />
            {this.state.search.length > 0 ? (
              <MaterialIcons
                name="clear"
                style={[styles.searchBarIcons, { marginRight: 10 }]}
                onPress={this.clearTextFilter}
              />
            ) : null}
            <MaterialIcons
              name="filter-list"
              style={styles.searchBarIcons}
              onPress={() => this.showFiltersPanel()}
            />
          </Item>
          {!this.state.filter.toggle &&
            (this.state.search.length > 0 || this.state.filter.name.length > 0) && (
              <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>
                {this.state.search.length > 0 && (
                  <Text style={styles.chip}>{this.state.search}</Text>
                )}
                {this.state.filter.name.length > 0 && (
                  <Text style={styles.chip}>{this.state.filter.name}</Text>
                )}
                <Text style={styles.chip}>{i18n.t('global.sortByLastModified')}</Text>
              </View>
            )}
          {this.state.filter.toggle ? (
            <View style={{ marginTop: 20, marginBottom: 20 }}>
              <Accordion
                activeSections={this.state.activeSections}
                sections={this.props.filterConfig.tabs}
                renderHeader={this.renderSectionHeader}
                renderContent={this.renderSectionContent}
                onChange={this.updateSections}
              />
            </View>
          ) : null}
        </ScrollView>
      </View>
    );
  }
}

SearchBar.propTypes = {
  filterConfig: PropTypes.shape({
    tabs: PropTypes.arrayOf(PropTypes.object).isRequired,
    filters: PropTypes.arrayOf(PropTypes.object).isRequired,
  }),
  onSelectFilter: PropTypes.func,
  onTextFilter: PropTypes.func,
  onClearTextFilter: PropTypes.func,
  onLayout: PropTypes.func,
};

SearchBar.defaultProps = {
  filterConfig: {
    tabs: [],
    filters: [],
  },
};

export default SearchBar;
