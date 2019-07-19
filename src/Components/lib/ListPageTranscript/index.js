import React, { Component } from 'react';
import SearchBar from '../SearchBar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import CustomTranscriptCard from '../CustomTranscriptCard';
import includesText from '../../../Util/includes-text';

// TODO: add error handling, eg custom alert if server is not responding
class ListPageTranscript extends Component {
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

  render() {
    let itemsCards;
    let description;
    if (this.props.items) {
      itemsCards = this.props.items
        .map(item => {

          if (item.display) {
            return (
              <CustomTranscriptCard
                icon={ this.props.icon }
                key={ 'key__' + item.id }
                id={ item.id }
                projectId={ item.id }
                title={ item.title }
                subtitle={ item.description }
                handleEdit={ this.props.handleEdit }
                handleDelete={ () => {
                  this.props.handleDelete(item.id);
                } }
                // To be able to do REST for cards for - Projects, transcripts, paperedits
                showLink={ () => {
                  return this.props.showLinkPath(item.id);
                } }
                status={ item.status }
                description={ description }
                disabled={ item.status === 'done' ? true : false }
                errorMessage={ item.status === 'error' ? item.errorMessage : null }
              />
            );
          } else {
            return null;
          }
        })
        .filter(item => {
          return item !== null;
        });
    }

    let content;
    let searchEl;
    // TODO: better error handling
    // eg there should be a loading/fetching? and then if it gets error 404 or 505(?) from server
    // then it displays error from server
    // also add `navigator.onLine` to raise error if offline?

    if (this.props.items !== null && this.props.items.length !== 0) {
      searchEl = (<SearchBar
        handleSearch={ this.handleSearch }
      />);
    }
    if (this.props.items !== null && this.props.items.length !== 0) {
      content = (
        <>
          <section style={ { height: '75vh', overflow: 'scroll' } }>
            {itemsCards}
          </section>
        </>
      );
    }
    else {
      content = <i>No {this.props.model}, create a new one to get started </i>;
    }

    return (
      <>
        <Row>
          <Col sm={ 9 } md={ 9 } ld={ 9 } xl={ 9 }>
            {searchEl}
          </Col>
          <Col xs={ 12 } sm={ 3 } md={ 3 } ld={ 3 } xl={ 3 }>
            <Button onClick={ this.props.handleShowCreateNewItemForm } variant="outline-secondary" size="sm" block>
                New {this.props.model}
            </Button>
          </Col>
        </Row>
        {content}
      </>
    );
  }
}

export default ListPageTranscript;
