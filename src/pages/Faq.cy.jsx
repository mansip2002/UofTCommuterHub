import React from 'react'
import Faq from './Faq'
import { BrowserRouter as Router } from 'react-router-dom';


describe('<Faq />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(
      <Router>
        <Faq />
      </Router>
    )
  })

  it('Contains all of the FAQ content', () => {
    cy.mount(
      <Router>
        <Faq />
      </Router>
    )

    cy.contains('h2', 'FAQ').should('be.visible');
    cy.contains('h4', 'What is UofT Commuter Hub?').should('be.visible');
    cy.contains('div', 'UofT Commuter Hub is a platform').should('be.visible');
    cy.contains('h4', 'What is a commute buddy?').should('be.visible');
    cy.contains('div', 'A commute buddy is someone you\'re paired with').should('be.visible');
    cy.contains('h4', 'How do I find a match?').should('be.visible');
    cy.contains('div', 'UofT Commuter Hub uses your travel details').should('be.visible');
    cy.contains('h4', 'Do I need a car to participate?').should('be.visible');
    cy.contains('div', 'You don\'t need a car to participate!').should('be.visible');

    cy.contains('Have more questions?').should('be.visible');
    cy.contains('Contact us').should('be.visible');
    cy.contains('Contact us').should('have.attr', 'href', 'mailto:uoftcommuterhub@gmail.com');
  });
})