import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHighlighter } from '@fortawesome/free-solid-svg-icons';

import MediaPlayer from '@bbc/react-transcript-editor/MediaPlayer';
import VideoPlayer from '@bbc/react-transcript-editor/VideoPlayer';
import { secondsToTimecode } from '@bbc/react-transcript-editor/timecodeConverter';

import onlyCallOnce from '../../../Util/only-call-once/index.js';
import CustomNavbar from '../../lib/CustomNavbar/index.js';
import CustomBreadcrumb from '../../lib/CustomBreadcrumb/index.js';
import CustomFooter from '../../lib/CustomFooter/index.js';
import LabelsList from './LabelsList/index.js';

import Paragraphs from './Paragraphs/index.js';
import SearchBar from './SearchBar/index.js';
import ApiWrapper from '../../../ApiWrapper/index.js';
import navbarLinks from '../../lib/custom-navbar-links';
import getTimeFromUserWordsSelection from './get-user-selection.js';
import CustomAlert from '../../lib/CustomAlert/index.js';
import './index.css';

/**
 * Makes list of unique speakers
 * from transcript.paragraphs list
 * to be used in react-select component
 *
 * TODO: decide if to move server side, and return unique list of speaker to client
 * Or if to move to separate file as util, perhaps generalise as reusable funciton?
 *
 * https://codeburst.io/javascript-array-distinct-5edc93501dc4
 */
function makeListOfUniqueSpeakers(array) {
  const result = [];
  const map = new Map();
  for (const item of array) {
    if (!map.has(item.speaker)) {
      map.set(item.speaker, true); // set any value to Map
      result.push({
        value: item.speaker,
        label: item.speaker
      });
    }
  }

  return result;
}

class TranscriptAnnotate extends Component {
  constructor(props) {
    super(props);
    this.videoRef = React.createRef();

    this.state = {
      projectId: this.props.match.params.projectId,
      transcriptId:  this.props.match.params.transcriptId,
      projectTitle: '',
      transcriptJson: null,
      transcriptTitle: '',
      url: null,
      mediaDuration: '00:00:00:00',
      currentTime: 0,
      timecodeOffset: 0,
      searchString: '',
      sentenceToSearchCSS: '',
      sentenceToSearchCSSInHighlights: '',
      wordsToSearchCSS: '',
      showTextSearchPreferences: false,
      showLabelsSearchPreferences: false,
      showSpeakersSearchPreferences: false,
      showSelectedOptionLabelSearch: false,
      selectedOptionLabelSearch: [],
      selectedOptionSpeakerSearch: [],
      showParagraphsMatchingSearch: false,
      notification: null,
      annotations: [],
      // TODO: this needs to be called using API
      labelsOptions: [],
      // TODO: combine with transcript + timecodes
      speakersOptions : [
        // { value: 'TBC 00', label: 'TBC 00' },
        // { value: 'TBC 1', label: 'TBC 1' },
        // { value: 'Emily', label: 'Emily' },
        // { value: 'Jennifer', label: 'Jennifer' },
        // { value: 'Esther', label: 'Esther' },
        // { value: 'Ben', label: 'Ben' },
        // { value: 'Eleanor', label: 'Eleanor' },
        // { value: 'Summer', label: 'Summer' },
        // { value: 'Kohinoor', label: 'Kohinoor' },
        // { value: 'Cooper', label: 'Cooper' }
      ]
    };
  }

  componentDidMount = () => {
    ApiWrapper.getAnnotations(this.state.projectId, this.state.transcriptId)
      // TODO: add error handling
      .then(json => {
        console.log(json.labels);
        this.setState({
          projectTitle: json.projectTitle,
          transcriptJson: json.transcript,
          annotations: json.annotations,
          transcriptTitle: json.transcriptTitle,
          url: json.url,
          labelsOptions: json.labels,
          speakersOptions: makeListOfUniqueSpeakers(json.transcript.paragraphs)
        });
      })
      .catch((e) => {
        this.setState({
          notification:<CustomAlert
            dismissable={ true }
            variant={ 'danger' }
            heading={ 'Server Error' }
            message={ <p>Error reaching the server to fetch transcript </p> }
          />
        });
      });
  };

  handleWordClick = e => {
    if (e.target.className === 'words' ) {
      const wordEl = e.target;
      this.videoRef.current.currentTime = wordEl.dataset.start;
      this.videoRef.current.play();
    }
  };

  handleTimecodeClick= e => {
    if ( e.target.className === 'timecode') {
      const wordEl = e.target;
      this.videoRef.current.currentTime = wordEl.dataset.start;
      this.videoRef.current.play();
    }
  };

  handleSearch = (e, searchPreferences) => {
    // TODO: debounce to optimise
    if (e.target.value !== '') {
      const searchString = e.target.value;
      this.setState({ searchString: searchString.toLowerCase() });
      //  "debounce" to optimise
      onlyCallOnce(this.highlightWords (searchString), 500);
    }
    // if empty string reset
    else if (e.target.value === '') {
      this.setState({
        sentenceToSearchCSS: '',
        searchString: ''
      });
    }
  };

  // TODO: bug, when highlights a sentence, within a paragraph, it also highlights
  // lose words belonging to that sentence, in the paragraph.
  // eg 'a day not so long ago' it will also highlight all the occurrences of 'a'
  // and other words in the sentence
  // there might be a way to narrow down with CSS selector
  highlightWords = searchString => {
    const listOfSearchWords = searchString.toLowerCase().trim().split(' ');
    const pCSS = `.paragraph[data-paragraph-text*="${ listOfSearchWords.join(' ') }"]`;

    const wordsToSearchCSS = listOfSearchWords.map((searchWord, index) => {
      let res = `${ pCSS } > div > span.words[data-text="${ searchWord
        .toLowerCase()
        .trim() }"]`;
      if (index < listOfSearchWords.length - 1) {
        // console.log(index, listOfSearchWords.length);
        res += ', ';
      }

      return res;
    });
    // Need to add an extra span to search annotation hilights
    // TODO: refactor to make more DRY
    const wordsToSearchCSSInHighlights = listOfSearchWords.map((searchWord, index) => {
      let res = `${ pCSS } > div  > span >span.words[data-text="${ searchWord
        .toLowerCase()
        .trim() }"]`;
      if (index < listOfSearchWords.length - 1) {
        res += ', ';
      }

      return res;
    });
    this.setState({
      sentenceToSearchCSS: wordsToSearchCSS.join(' '),
      sentenceToSearchCSSInHighlights: wordsToSearchCSSInHighlights.join(' ')
    });
  };

  onLabelsUpdated = (newLabelsOptions) => {
    this.setState({ labelsOptions: newLabelsOptions });
  }

  handleTimeUpdate = (e) => {
    const currentTime = e.target.currentTime;
    this.setState({
      currentTime
    });
  }
  onLoadedDataGetDuration = e => {
    const currentDuration = e.target.duration;
    const currentDurationWithOffset = currentDuration + this.state.timecodeOffset;
    const durationInSeconds = secondsToTimecode(currentDurationWithOffset);

    this.setState({
      mediaDuration: durationInSeconds
    });
  };

  handleShowParagraphsMatchingSearch = () => {
    this.setState((state) => {
      return { showParagraphsMatchingSearch: !state.showParagraphsMatchingSearch };
    });
  }

  saveToServer = () => {
    // TODO API call save annotations to server
    alert('save to server');
  }

  handleAnnotation = (e) => {
    const element = e.target;
    window.element = element;
    const selection = getTimeFromUserWordsSelection();
    if (selection) {
      this.setState((state) => {
        const { annotations } = state;
        selection.labelId = parseInt(element.dataset.labelId);
        const customNoteText = '';
        selection.note = customNoteText ? customNoteText : '';
        // TODO: Temporary workaround to calculate label Id
        // there's got to be a more robust way to make id for label
        // eg use: `const buf = crypto.randomBytes(16); buf.toString('hex');`
        // and should this be done client side or server side?
        const lastAnnotation = annotations[annotations.length - 1];
        const lastAnnotationId = lastAnnotation.id;
        const newAnnotationId = lastAnnotationId + 1;
        selection.id = newAnnotationId;
        annotations.push(selection);

        return {
          annotations: annotations
        };
      });
    }
    else {
      alert('Select some text in the transcript to highlight ');
    }

  }

  handleDeleteAnnotation = (annotationId) => {
    const { annotations } = this.state;
    const newAnnotationsSet = annotations.filter((annotation) => {
      return annotation.id !== annotationId;
    });

    this.setState({
      annotations: newAnnotationsSet
    });
  }

  // similar to handleDeleteAnnotation filter to find annotation then replace text
  handleEditAnnotation = (annotationId) => {
    const { annotations } = this.state;
    const newAnnotationsSet = annotations.filter((annotation) => {
      return annotation.id !== annotationId;
    });

    const newAnnotationToEdit = annotations.find((annotation) => {
      return annotation.id === annotationId;
    });
    const newNote = prompt('Edit the text note of the annotation', newAnnotationToEdit.note);
    if (newNote) {
      newAnnotationToEdit.note = newNote;
      newAnnotationsSet.push(newAnnotationToEdit);
      this.setState({
        annotations: newAnnotationsSet
      });
    }
    else {
      alert('all good nothing changed');
    }
  }

  handleLabelsSearchChange = (selectedOptionLabelSearch) => {
    // console.log('selectedOptionLabelSearch', selectedOptionLabelSearch);
    this.setState({
      selectedOptionLabelSearch
    });
  }

  handleSpeakersSearchChange = (selectedOptionSpeakerSearch) => {
    // console.log('selectedOptionSpeakerSearch', selectedOptionSpeakerSearch);
    this.setState({
      selectedOptionSpeakerSearch
    });
  }

  render() {
    return (
      <Container fluid={ true } style={ { backgroundColor: '#f9f9f9', marginBottom: '5em' } }>
        <style scoped>
          {''}
        </style>
        <style scoped>
          {/* This is to style of the Paragraph component programmatically */}
          {`${ this.state.sentenceToSearchCSS } { background-color: ${ 'yellow' }; text-shadow: 0 0 0.01px black }`}
          {`${ this.state.sentenceToSearchCSSInHighlights } { background-color: ${ 'yellow' }; text-shadow: 0 0 0.01px black }`}
        </style>

        <CustomNavbar
          links={ navbarLinks(this.state.projectId) }
        />
        <br />
        {this.state.notification}
        <Row>
          <Col sm={ 9 } md={ 9 } ld={ 9 } xl={ 9 }>
            <CustomBreadcrumb
              items={ [
                {
                  name: 'Projects',
                  link: '/projects'
                },
                {
                  // TODO: need to get project name?
                  // TODO: is this needed?
                  name: `Project: ${ this.state.projectTitle }`,
                  link: `/projects/${ this.state.projectId }`
                },
                {
                  name: 'Transcripts',
                  link: `/projects/${ this.state.projectId }/transcripts`
                },
                {
                  // Note: There is no individual transcript page only transcript index, annotate, and correct
                  name: `${ this.state.transcriptTitle }`,
                  link: `/projects/${ this.state.projectId }/transcripts/${ this.state.transcriptId }`
                },
                {
                  name: 'Annotate'
                }
              ] }
            />
          </Col>
          <Col xs={ 12 } sm={ 3 } md={ 3 } ld={ 3 } xl={ 3 }>
            <Button variant="outline-secondary" onClick={ this.saveToServer } size="lg" block>
            Save
            </Button>
            <br/>
          </Col>
        </Row>
        <Row>
          <Col xs={ 12 } sm={ 12 } md={ 12 } lg={ 12 } xl={ 12 }>
            <MediaPlayer
              title={ this.state.transcriptTitle ? this.state.transcriptTitle : '' }
              mediaDuration={ this.state.mediaDuration }
              hookSeek={ foo => (this.setCurrentTime = foo) }// <--
              hookPlayMedia={ foo => (this.playMedia = foo) }// <--
              hookIsPlaying={ foo => (this.isPlaying = foo) } // <--
              // rollBackValueInSeconds={ this.state.rollBackValueInSeconds }
              rollBackValueInSeconds={ 15 }
              timecodeOffset={ this.state.timecodeOffset }
              mediaUrl={ this.state.url }
              // handleAnalyticsEvents={ this.props.handleAnalyticsEvents }
              videoRef={ this.videoRef }
              // handleSaveTranscript={ this.handleSaveTranscript }
              handleSaveTranscript={ () => {alert('feature not implemented yet');} }
            />
            <br/>
          </Col>
        </Row>
        <Row>
          <Col xs={ 12 } sm={ 3 } md={ 3 } lg={ 3 } xl={ 3 } style={ { paddingRight:'0' } }>
            {this.state.transcriptJson !== null && (
              <VideoPlayer
                tabindex="0"
                role="button"
                aria-pressed="false"
                mediaUrl={ this.state.url }
                onTimeUpdate={ this.handleTimeUpdate }
                videoRef={ this.videoRef }
                previewIsDisplayed={ true }
                onLoadedDataGetDuration={ this.onLoadedDataGetDuration }
              />
            )}

            <LabelsList
              labelsOptions={ this.state.labelsOptions }
              onLabelsUpdated={ this.onLabelsUpdated }
            />

            <br/>
            <Dropdown as={ ButtonGroup } style={ { width: '100%' } } >
              <Button variant="warning" id="defaultHighlightBtn" data-label-id={ 0 } onClick={ this.handleAnnotation } > Highlight <FontAwesomeIcon icon={ faHighlighter } /></Button>
              <Dropdown.Toggle split variant="warning" id="dropdown-split-basic" data-lable-id={ 0 }/>
              <Dropdown.Menu onClick={ this.handleAnnotation }>
                {this.state.labelsOptions.map((label) => {
                  return (
                    <Dropdown.Item key={ `label_id_${ label.id }` } data-label-id={ label.id } >
                      <Row data-label-id={ label.id }>
                        <Col xs={ 1 } sm={ 1 } md={ 1 } lg={ 1 } xl={ 1 } style={ { backgroundColor: label.color } } data-label-id={ label.id }></Col>
                        <Col xs={ 1 } sm={ 1 } md={ 1 } lg={ 1 } xl={ 1 } data-label-id={ label.id }>{label.label}</Col>
                      </Row>
                    </Dropdown.Item>
                  );
                })}
              </Dropdown.Menu>
            </Dropdown>

            <Form.Text className="text-muted">
            Select some text in the transcript then click the highlight button.
              <br/>You can choose btween default or custom labels to categorise your annotations.
            </Form.Text>

          </Col>
          <Col xs={ 12 } sm={ 9 } md={ 9 } lg={ 9 } xl={ 9 }>

            <Card>
              <SearchBar
                labelsOptions={ this.state.labelsOptions }
                speakersOptions={ this.state.speakersOptions }
                handleSearch={ this.handleSearch }
                handleLabelsSearchChange={ this.handleLabelsSearchChange }
                handleSpeakersSearchChange={ this.handleSpeakersSearchChange }
                handleShowParagraphsMatchingSearch={ this.handleShowParagraphsMatchingSearch }
              />
              <Card.Body
                onDoubleClick={ this.handleWordClick }
                onClick={ this.handleTimecodeClick }
                style={ { height: '80vh', overflow: 'scroll' } }
              >
                {/* TODO: instead of null, if transcript is not provided, eg offline or server error, then add custom alert */}
                {this.state.transcriptJson
                && <Paragraphs

                  labelsOptions={ this.state.labelsOptions }
                  annotations={ this.state.annotations }
                  transcriptJson={ this.state.transcriptJson }
                  searchString={ this.state.searchString }
                  showParagraphsMatchingSearch={ this.state.showParagraphsMatchingSearch }
                  selectedOptionLabelSearch={ this.state.selectedOptionLabelSearch }
                  selectedOptionSpeakerSearch={ this.state.selectedOptionSpeakerSearch }
                  handleTimecodeClick={ this.handleTimecodeClick }
                  handleWordClick={ this.handleWordClick }
                  handleDeleteAnnotation={ this.handleDeleteAnnotation }
                  handleEditAnnotation={ this.handleEditAnnotation }
                />}
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <CustomFooter />
      </Container>
    );
  }
}

export default TranscriptAnnotate;
