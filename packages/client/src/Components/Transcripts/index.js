import React, { Component } from 'react';

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import { LinkContainer } from 'react-router-bootstrap';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Container from 'react-bootstrap/Container';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import CustomNavbar from '../lib/CustomNavbar/index.js';
import CustomBreadcrumb from '../lib/CustomBreadcrumb/index.js';
import CustomCard from '../lib/CustomCard/index.js';

import CustomFooter from '../lib/CustomFooter/index.js';
import Api from '../../Api/index.js';

import './index.module.css';

class Transcripts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transcriptsList: null,
      projectId: this.props.match.params.projectId,
      projectTitle: ''
    };
  }

  componentDidMount = () => {
    // TODO: add user id in request?
    // TODO: add end point url in config
    // TODO: move fetch into a API class - to handle electron backend switch
    // fetch('http://localhost:5000/api/projects/1/transcripts', { mode: 'cors' })
    //   .then(res => res.json())
    //   .then((json) => {
    //     console.log(json);
    //     // add a display property for component cards search
    //     const tmpList = json.transcripts.map((item) => {
    //       item.display = true;

    //       return item;
    //     });
    //     this.setState({ transcriptsList: tmpList, projectTitle: json.projectTitle });
    //   });

    Api.getTranscripts(this.state.projectId)
      // TODO: add error handling
      .then(json => {
        console.log(json);
        // add a display property for component cards search
        const tmpList = json.transcripts.map((item) => {
          item.display = true;

          return item;
        });
        this.setState({
          projectTitle: json.projectTitle,
          transcriptsList: tmpList
        });
      });
  }

    // TODO: could be moved in utils
    // TODO: if moved, then search across client side code to remove duplicate
    includesText = (textOne, textTwo) => {
      return textOne.toLowerCase().trim().includes(textTwo.toLowerCase().trim());
    }

    handleSearch = (e) => {
      const searchText = e.target.value;
      const results = this.state.transcriptsList.filter((transcript) => {
        if (this.includesText(transcript.title, searchText)
        || this.includesText(transcript.description, searchText)
        ) {
          transcript.display = true;

          return transcript;
        } else {
          transcript.display = false;

          return transcript;
        }
      });

      this.setState({
        transcriptsList: results
      });
    }

    render() {
      let transcripts;
      if ( this.state.transcriptsList !== null) {
        transcripts = this.state.transcriptsList.map((transcript) => {
          if (transcript.display) {
            return ( <CustomCard
              key={ transcript.id }
              transcriptId={ transcript.id }
              projectId={ this.state.projectId }
              title={ transcript.title }
              subtitle={ transcript.description }
              links={ [
                {
                  name: 'Correct',
                  link: `/projects/${ this.state.projectId }/transcripts/${ transcript.id }`
                },
                {
                  name: 'Annotate',
                  link: `/projects/${ this.state.projectId }/transcripts/${ transcript.id }/annotate`
                } ] }
            // description={ 'test' } - optional
            // TODO: Add links
            />
            );
          } else {
            return null;
          }
        })
          .filter((transcript) => {
            return transcript !== null;
          });
      }

      return (
        <Container>
          <CustomNavbar
            links={ [
              {
                name: 'Projects',
                link: '/projects'
              },
              {
                name: 'New Projects',
                link: '/projects/new'
              },
              {
                name: 'Transcripts',
                link: `/projects/${ this.state.projectId }/transcripts`
              },
              {
                name: 'New Transcripts',
                link: `/projects/${ this.state.projectId }/transcripts/new`
              },
              {
                name: 'Paper Edits',
                link: `/projects/${ this.state.projectId }/paperedits`
              },
              {
                name: 'New Paper Edit',
                link: `/projects/${ this.state.projectId }/paperedits/new`
              },
              {
                name: 'Users',
                link: `/projects/${ this.state.projectId }/users`
              }
            ]
            }
          />
          <br/>
          <CustomBreadcrumb
            // className="d-none d-sm-block"
            className="hidden-xs"
            // xsHidden
            items={ [ {
              name: 'Projects',
              link: '/projects'
            },
            {
              // TODO: need to get project name
              // TODO: if using project name, only use first x char and add ...
              name: `Project: ${ this.state.projectTitle }`,
              link: `/projects/${ this.state.projectId }`
            },
            {
              name: 'Transcripts'
            }
            ] }
          />
          {/*
          <LinkContainer to={ `/projects/${ this.state.projectId }/transcripts/new` }>
            <Button variant="primary">New Transcript</Button>
          </LinkContainer>
          <br/><br/> */}

          <InputGroup className="mb-3">
            <FormControl
              onChange={ this.handleSearch }
              placeholder="Search for project title or description"
              aria-label="search"
              aria-describedby="search"
            />

            <InputGroup.Append>
              <InputGroup.Text id="basic-addon2">
                <FontAwesomeIcon icon={ faSearch } />
              </InputGroup.Text>
            </InputGroup.Append>
          </InputGroup>

          <section style={ { height: '80vh', overflow: 'scroll' } }>
            {transcripts}
          </section>

          <CustomFooter />
        </Container>

      );
    }
}

export default Transcripts;
