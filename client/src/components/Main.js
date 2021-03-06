import React from 'react';
import Sidebar from './sidebar/Sidebar';
import Body from './body/Body';

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      communities: [],
      question: null
    }

    this.updateCommunities = this.updateCommunities.bind(this);
  }

  render() {
    return (
      <div className="container-fluid" style={{height: "90vh"}}>
        <div className="row" style={{flexWrap:"nowrap", height: "100%"}}>
          <div className="col bg-light" style={{minHeight: "100%", maxHeight: "100%", minWidth: "250px", padding: "0px", maxWidth:"250px"}}>
            <Sidebar 
              tokens={this.props.tokens}
              selectCommunity={this.props.selectCommunity}
              communities={this.state.communities}
              updateCommunities={this.updateCommunities}
            />
          </div>
          <div className="col" style={{minHeight: "100%", maxHeight: "100%", overflow: 'hidden'}}>
            <Body 
              tokens={this.props.tokens}
              community={this.props.community}
              communities={this.state.communities}
              updateCommunities={this.updateCommunities}
            />
          </div>
        </div>
      </div>
    )    
  }

  updateCommunities() {
    /**
     * Update information for Community list in sidebar
     */

    if (!this.props.tokens) {
      this.setState({
        communities: []
      })
      return;
    }
 
    fetch(
      `${process.env.REACT_APP_BACKEND_URL}/account/feed`, 
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.props.tokens.access_token}`
        }
    })
      .then(response => response.json())
      .then(data => {
        if (data.message) {
          console.log(data.message);
          return;
        } else {
          this.setState({
            communities: data
          })
        }
      });
  }

}

export default Main;