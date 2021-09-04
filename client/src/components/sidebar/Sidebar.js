import React from 'react';

import CommunitySearch from './CommunitySearch';

class Sidebar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showAddCommunity: false
        }
        this.showAddCommunity = this.showAddCommunity.bind(this);
        this.hideAddCommunity = this.hideAddCommunity.bind(this);
        this.finishedAddCommunity = this.finishedAddCommunity.bind(this);
    }

    render () {
        return (
            <div style={{height: '100%', overflowY: "auto", padding: "5px"}}>
                {this.genCommunityList()}
                <h5 className="mt-3">Explore</h5>
                {this.genCommunityButton()}
                <CommunityForm 
                    show={this.state.showAddCommunity}
                    close={this.hideAddCommunity}
                    finished={this.finishedAddCommunity}
                    tokens={this.props.tokens}/>
                <CommunitySearch 
                    selectCommunity={this.props.selectCommunity}/>
                
            </div>
        )
    }

    componentDidMount () {
        if (this.props.tokens) {
            this.props.updateCommunities();
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.tokens && prevProps.tokens !== this.props.tokens) {
            this.props.updateCommunities()
        }
    }

    
    genCommunityList() {
        if(!this.props.tokens) {
            return null;
        }

        const items = this.props.communities.map(comm => (
            <a 
                href="#" 
                className="list-group-item list-group-item-action" 
                key={comm._id}
                id={comm._id}
                onClick={this.props.selectCommunity}>
                    {comm.name}
            </a>
            ))

        return (
            <div className="mb-5">
                <h5 className="mt-3">Your Communities</h5>
                <ul className="list-group" >
                    {items}
                </ul>
            </div>
        )
    }

    genCommunityButton() {
        if (!this.props.tokens) {
            return null;
        }

        if(this.state.showAddCommunity) {
            return null;
        }

        return (
            <button
                type="button"
                className="btn btn-primary mb-2"
                style={{width: "100%"}}
                onClick={this.showAddCommunity}>
                    Create a Community
            </button>
        );
    }
    showAddCommunity() {
        this.setState({
            showAddCommunity: true
        })
    }
    hideAddCommunity() {
        this.setState({
            showAddCommunity: false
        })
    }
    finishedAddCommunity() {
        this.hideAddCommunity()
        this.props.updateCommunities();
    }

    
}

class CommunityForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            communityTitle: '',
            communityContent: ''
        }

        this.handleChange = this.handleChange.bind(this);
        this.submitAnswer = this.submitAnswer.bind(this);
    }

    render() {
        if (!this.props.show) {
            return null;
        }

        return (
        <form className="container-fluid card" style={{width: "100%"}}>
            <div className="mb-3">
                <input
                    type="text"
                    id="communityTitle"
                    className="form-control"
                    maxLength={35}
                    placeholder="Community name..."
                    onChange={this.handleChange}
                    required/>
            </div>
            <div className="mb-3">
                <textarea 
                    className="form-control" 
                    rows="3" 
                    placeholder="Description..."
                    id="communityContent"
                    onChange={this.handleChange}></textarea>
            </div>
            <button 
                type="button"
                className="btn btn-primary mb-1"
                style={{width: "100%"}}
                onClick={this.submitAnswer}>
                    Submit
            </button>
            <button
                type="button"
                className="btn btn-outline-secondary"
                style={{width: "100%"}}
                onClick={this.props.close}>
                    Cancel
            </button>
        </form>
        );
    }

    handleChange(ev) {
        this.setState({
            [ev.target.id]: ev.target.value
        })
    }

    submitAnswer() {
        if (this.state.communityTitle === "" || this.state.communityContent === "") {
            return;
        }

        const community = {
            name: this.state.communityTitle,
            description: this.state.communityContent
        }

        fetch(`${process.env.REACT_APP_BACKEND_URL}/c/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.props.tokens.access_token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(community)
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                console.log(data);
                return;
            }
            document.querySelector('#communityTitle').value = '';
            document.querySelector('#communityContent').value = '';
            this.setState({
                communityTitle: '',
                communityContent: ''
            })
            this.props.finished();
        })
    }
}



export default Sidebar;