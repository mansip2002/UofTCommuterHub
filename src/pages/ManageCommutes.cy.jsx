import React from 'react'
import ManageCommutes from './ManageCommutes'
import { useNavigate } from "react-router-dom";
import { getStorage } from "../lib/storage";
import { BACKEND_URL, START_TIME_OPTIONS } from "../lib/globals";
import { BrowserRouter as Router } from 'react-router-dom';


describe('<ManageCommutes />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(
    <Router>
      <ManageCommutes />
    </Router>
    )
  })

  it('renders correctly', () => {
    cy.mount(
      <Router>
        <ManageCommutes />
      </Router>
    )

    cy.get('input#startLocation').should('exist');
    cy.get('input#endLocation').should('exist');
    cy.get('select#dayOfWeek').should('exist');
    cy.get('select#startTime').should('exist');
    cy.get('button').contains('Add').should('exist');
    cy.contains('th', 'Day').should('exist');
    cy.contains('th', 'Start Location').should('exist');
    cy.contains('th', 'End Location').should('exist');
    cy.contains('th', 'Time').should('exist');

    cy.get('.text-danger').should('not.exist');
    cy.get('.text-success').should('not.exist');

  });

  it('can add a commute', () => {
    cy.mount(
      <Router>
      <ManageCommutes />
      </Router>
      )

      cy.get('input#startLocation').type('Work');
      cy.get('input#endLocation').type('Home');
      cy.get("select[name='dayOfWeek']").select('Monday')
      cy.get("select[name='startTime']").select('08:00')
      cy.get("select[name='returnTime']").select('09:00')
  
      cy.get('button').contains('Add').click();
  
      cy.contains('.text-success', 'Successfully added commute.').should('exist');
  
      cy.contains('td', 'Monday').should('exist');
      cy.contains('td', 'Work').should('exist');
      cy.contains('td', 'Home').should('exist');
      cy.contains('td', '08:00 AM').should('exist');
  });
})