import React from 'react';
import List from '../List';
import includesText from '../../../Util/includes-text/index.js';
import SearchBar from '../SearchBar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showSearchInput: false
    };
  }

  handleSearch = searchText => {
    const results = this.props.items.filter(project => {
      if (
        includesText(project.title, searchText) ||
        includesText(project.description, searchText)
      ) {
        project.display = true;

        return project;
      } else {
        project.display = false;

        return project;
      }
    });
    this.props.handleUpdateList(results);
  };

  handleShowSearchBar = () => {
    this.setState(state => {
      return { showSearchInput: !state.showSearchInput };
    });
  }

  render() {

    return (<>

      <Row>
        <Col sm={ 9 } md={ 9 } ld={ 9 } xl={ 9 }>
          <SearchBar
            handleSearch={ this.handleSearch }
          />
        </Col>
        <Col xs={ 12 } sm={ 3 } md={ 3 } ld={ 3 } xl={ 3 }>
          <Button onClick={ this.props.handleShowCreateNewItemForm } variant="outline-secondary" size="sm" block>
                New {this.props.model}
          </Button>
        </Col>
      </Row>

      {this.props.items ?
        <List
          items={ this.props.items }
          handleEdit={ this.props.handleEdit }
          handleDelete={ this.props.handleDelete }
          showLinkPath={ this.props.showLinkPath }
        /> : 'There are no items'}

    </>);
  }
}

export default Page;
