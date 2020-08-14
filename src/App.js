import React, { useState } from 'react';
import './App.css';
import _ from 'lodash';

const category = {
  HIGHLY: 'Highly Recommended',
  NOT: 'Not Recommended',
  RECOMMENDED: 'Recommended',
};
class App extends React.Component {
  state = {
    profiles: [],
  };
  setValues = (values) => {
    this.setState({ profiles: values });
  };
  render() {
    return (
      <>
        <div className="header">{this.props.title}</div>
        <Form getProfiles={this.setValues} />
        <Display message={this.state.profiles} />
      </>
    );
  }
}

function Display(props) {
  const result = _.groupBy(props.message, 'suggestion');
  return (
    <div className="details-wrapper">
      {Object.entries(result).map((company, index) => (
        <div className="company-details">
          <h3 className={company[0].toLocaleLowerCase().split(' ').join('-')}>{company[0]}</h3>
          <CompanyDetails key={index} details={company[1]} />
        </div>
      ))}
    </div>
  );
}

function CompanyDetails(props) {
  return (
    <div>
      <table className="company-details-table">
        <col />
        <colgroup span="1"></colgroup>
        <colgroup span="2"></colgroup>
        <tr>
          <td rowspan="2"></td>
          <th colspan="1" scope="colgroup"></th>
          <th colspan="2" scope="colgroup">
            Growth
          </th>
        </tr>
        <tr>
          <th scope="col">Sector</th>
          <th scope="col">YTD - 2</th>
          <th scope="col">YTD - 1</th>
        </tr>
        {props.details.map((values) => (
          <tr>
            <th scope="row">{values.name}</th>
            <td>{values.sector}</td>
            <td>{values.growthCurrentMinus2Year}</td>
            <td>{values.growthCurrentMinus1Year}</td>
          </tr>
        ))}
      </table>
    </div>
  );
}
class Form extends React.Component {
  state = { sectorName: '' };
  handleSubmit = async (event) => {
    event.preventDefault();
    const resp = await fetch(`http://localhost:8080/decisions/${this.state.sectorName}`);
    const companyDetails = await resp.json();
    this.props.getProfiles(companyDetails);
    this.setState({ sectorName: '' });
  };
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          type="text"
          value={this.state.sectorName}
          placeholder="Enter Sector"
          onChange={(event) => this.setState({ sectorName: event.target.value })}
        />
        <button>Check Investment</button>
      </form>
    );
  }
}
export default App;
