import React, { Component } from 'react';

import { TranscriptEditor } from '@bbc/react-transcript-editor';
import PaperCutsPlayer from './PaperCutsPlayer/index.js';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import CustomNavbar from '../lib/CustomNavbar/index.js';
import CustomBreadcrumb from '../lib/CustomBreadcrumb/index.js';
import CustomFooter from '../lib/CustomFooter/index.js';

const playlist = [
  { type:'video', offset:0, start:0, duration:10, src:'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' },
  { type:'video', offset:0, start:5, duration:10, src:'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
  { type:'video', offset:10, start:10, duration:10, src:'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' }
];

class Transcript extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transcriptJson: null,
      title: null
    };

  }

  componentDidMount = () => {
    // TODO get id from props match
    fetch('http://localhost:5000/api/projects/1/paperedits/1', { mode: 'cors' })
      .then(res => res.json())
      .then((json) => {
        this.setState({ paperEditJson: json.paperEdit, title: json.title });
      });
  }

  render() {
    return (
      <Container fluid={ true }>

        <CustomNavbar/>
        <br/>

        {/* <CustomBreadcrumb /> */}
        {/* <Row> */}
        <CustomBreadcrumb
          items={ [ {
            name: 'Projects',
            link: '/projects'
          },
          {
            // TODO: need to get project name?
            // TODO: is this needed?
            name: 'Project',
            // link: `/projects/${ this.state.projectId }`
          },
          {
            name: 'PaperEdits',
            link:`/projects/${ this.state.projectId }/paperedits`
          },
          {
            name: `${ this.state.title }`
          }
          ] }
        />

        <h1>Paper Edit: {this.state.title}</h1>

        <PaperCutsPlayer playlist={ playlist } />

        <CustomFooter />
      </Container>
    );
  }
}

export default Transcript;
