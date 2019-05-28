import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTags,
  faTag,
  faAngleDown,
  faAngleUp,
  faTimes,
  faPen,
  faSlidersH
} from '@fortawesome/free-solid-svg-icons';

import LabelModal from './LabelModal.js';
import { randomColor } from './css-color-names.js';

class LabelsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      labelsListOpen: false,
      isLabelmodalShown: false
    };
  }

  removeLabel = (id, e) => {
    // eslint-disable-next-line no-restricted-globals
    const response = confirm('Click OK to delete the label, Cancel if you changed your mind');
    if (response === true) {
      const newLabelsOptions = this.props.labelsOptions.filter((label) => {
        return label.id !== id;
      });
      // TODO: remove
      this.props.onLabelDelete(id);
    } else {
      alert('Your label was not deleted');
    }
  }

  // TODO: See if CreateNewLabelModal can be refactored to accomodate for edit label
  // if not then separate model to achieve same
  // https://stackoverflow.com/questions/43335452/pass-item-data-to-a-react-modal
  editLabel = (id, e) => {
    const labelToEdit = this.props.labelsOptions.filter((label) => {
      return label.id === id;
    });
    // this.props.onLabelsUpdate(newLabelsOptions);
    console.log('labelToEdit', labelToEdit);
    // alert('this functionality has not been implemented yet');
  }
  onLabelSaved = (newLabel) => {
    const { labelsOptions } = this.props;
    // if updated - labelId is diff from null
    if (newLabel.id) {
      // labelsOptions[newLabel.id] = newLabel;
      // update list of labels

      // if updated - PUT
      // TODO:
      this.props.onLabelUpdate(newLabel);
      // this.props.onLabelUpdated(labelsOptions);
    }
    // if created
    // if created - POST
    else {
      // newLabel.id = labelsOptions[labelsOptions.length - 1].id + 1;
      // labelsOptions.push(newLabel);
      // TODO:
      this.props.onLabelCreate(newLabel);
      // this.props.onLabelUpdated(labelsOptions);
    }
  }

  showLabelModal = () => {
    console.log(this.state.isLabelmodalShown);
    this.setState((state) => {
      return {
        isLabelmodalShown: !state.isLabelmodalShown
      };
    });
  }

  render() {
    // TODO: add CSS to label and description to constrain width?
    // move edit and X to the rigth
    let labelsListOptions;
    // Handle edge case if there's no labels
    if (this.props.labelsOptions) {

      labelsListOptions = this.props.labelsOptions.map((label, index) => {
        return (<ListGroup.Item key={ 'label_' + index }>
          <Row>
            {/* Col space for the label color */}
            <Col xs={ 1 } sm={ 1 } md={ 1 } lg={ 1 } xl={ 1 }
              style={ { backgroundColor: label.color } }
              title={ label.label }>
            </Col>
            <Col xs={ 7 } sm={ 7 } md={ 7 } lg={ 7 } xl={ 7 }>
              {label.label}
            </Col>

            <Col xs={ 1 } sm={ 1 } md={ 1 } lg={ 1 } xl={ 1 }>
              {/* Edit label */}

              {label.label.toLowerCase() !== 'default' ?
                <LabelModal
                  color={ label.color }
                  label={ label.label }
                  description={ label.description }
                  labelId={ label.id }
                  show={ this.state.isLabelmodalShown }
                  onLabelSaved={ this.onLabelSaved }
                  openBtn={ <span> <FontAwesomeIcon icon={ faPen } /></span> }
                /> : <Button title={ 'edit label' } variant="link" size="sm" disabled>
                  <FontAwesomeIcon icon={ faPen } /> </Button> }
            </Col>
            <Col xs={ 1 } sm={ 1 } md={ 1 } lg={ 1 } xl={ 1 }>
              <Button title={ 'delete label' } variant="link" size="sm"
                onClick={ (e) => {this.removeLabel(label.id, e);} }
                disabled={ label.label.toLowerCase() === 'default' ? true : false }>
                <FontAwesomeIcon icon={ faTimes } />
              </Button>
            </Col>

          </Row>
          <Row>
            {/* Spacing to align title and color */}
            <Col xs={ 1 } sm={ 1 } md={ 1 } lg={ 1 } xl={ 1 }
              title={ label.label }>
            </Col>
            <Col xs={ 10 } sm={ 10 } md={ 10 } lg={ 10 } xl={ 10 }>
              <Form.Text className="text-muted">
                {label.description}
              </Form.Text>
            </Col>
          </Row>
        </ListGroup.Item>);
      });
    }

    const labelsList = (<ListGroup style={ { height: '30vh', overflow: 'scroll' } }>{labelsListOptions}
    </ListGroup>);

    return (<>

      <Card>
        <Card.Header
          variant="outline-primary"
          onClick={ () => {this.setState((state) => {return { labelsListOpen: !state.labelsListOpen };});} }>
          <Nav justify variant="pills">
            <Nav.Item>
              <FontAwesomeIcon icon={ faTags } />  <FontAwesomeIcon icon={ faSlidersH } />  Labels
            </Nav.Item>
            <Nav.Item>
              <FontAwesomeIcon icon={ this.state.labelsListOpen ? faAngleDown : faAngleUp } />
            </Nav.Item>
          </Nav>
        </Card.Header>
        {this.state.labelsListOpen ? <> { labelsList }
          <Card.Footer className="text-muted">
            <LabelModal
              color={ randomColor() }
              label={ '' }
              description={ '' }
              labelId={ null }
              show={ this.state.isLabelmodalShown }
              onLabelSaved={ this.onLabelSaved }
              openBtn={ <span>Create New Label <FontAwesomeIcon icon={ faTag } />{' '}</span> }
            />
          </Card.Footer> </> : ''}
      </Card>
    </>
    );
  }
}

export default LabelsList;