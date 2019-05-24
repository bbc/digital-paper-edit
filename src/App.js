import React, { Component } from 'react';
import { Switch, Route, HashRouter } from 'react-router-dom';
import Home from './Components/Home';

import Projects from './Components/Projects/index.js';
import Project from './Components/Projects/Project.js';
// import newProject from './Components/Projects/ProjectForm.js';
import Users from './Components/Users/index.js';

import Transcripts from './Components/Transcripts/index.js';
import Transcript from './Components/Transcripts/Transcript.js';
import TranscriptForm from './Components/Transcripts/TranscriptForm.js';
import TranscriptAnnotate from './Components/Transcripts/TranscriptAnnotate/index.js';
import TranscriptCorrect from './Components/Transcripts/TranscriptCorrect.js';

import PaperEdits from './Components/PaperEdits/index.js';
import PaperEdit from './Components/PaperEdits/PaperEdit';
import PaperEditForm from './Components/PaperEdits/NewPaperEdit.js';

// import UserManual from './Components/UserManual';

import './App.css';
// import Transcript from './Components/PaperEdits/PaperEdit.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transcriptJson: null
    };
  }
  // eslint-disable-next-line class-methods-use-this
  render() {
    return (
      <HashRouter>
        <Switch>
          <Route exact path="/" component={ Projects } />
          {/* <Route exact path="/projects/new" component={ newProject } /> */}
          <Route exact path="/projects" component={ Projects } />
          <Route exact path="/projects/:projectId" component={ Project } />
          {/* <Route
            exact
            path="/projects/:projectId/edit"
            component={ newProject }
          /> */}
          <Route exact path="/projects/:projectId/users" component={ Users } />
          <Route
            exact
            path="/projects/:projectId/transcripts/new"
            component={ TranscriptForm }
          />
          <Route
            exact
            path="/projects/:projectId/transcripts"
            component={ Transcripts }
          />
          <Route
            exact
            path="/projects/:projectId/transcripts/:transcriptId"
            component={ Transcript }
          />
          <Route
            exact
            path="/projects/:projectId/transcripts/:transcriptId/correct"
            component={ TranscriptCorrect }
          />
          <Route
            exact
            path="/projects/:projectId/transcripts/:transcriptId/annotate"
            component={ TranscriptAnnotate }
          />
          <Route
            exact
            path="/projects/:projectId/paperedits/new"
            component={ PaperEditForm }
          />
          <Route
            exact
            path="/projects/:projectId/paperedits"
            component={ PaperEdits }
          />
          <Route
            exact
            path="/projects/:projectId/paperedits/:papereditId"
            component={ PaperEdit }
          />
          {/* <Route exact path="/user-manual" component={ UserManual } /> */}
          {/* Guide route --> user manual  */}
          {/* Help route  */}
        </Switch>
      </HashRouter>
    );
  }
}

export default App;
