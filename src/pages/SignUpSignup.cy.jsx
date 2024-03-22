import React from 'react'
import Signup from './SignUp'
import {mount} from '@cypress/react18'
import { BrowserRouter as Router } from 'react-router-dom';

describe('<Signup />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(
      <Router>
      <Signup />
      </Router>)

    cy.get('input[type="email"]').should('exist');
    cy.get('input[type="password"]').should('exist');
    cy.get('input[type="text"]').should('exist');
    cy.get('button[type="button"]').contains('Sign Up').should('exist');
    cy.get('p').contains('Already have an account?').should('exist');
  })

  it('submits form it data is valid', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(
      <Router>
      <Signup />
      </Router>)

    cy.get('input[type="text"]').type('Mansi Patel');
    cy.get('input[type="email"]').type('mansii.patel@mail.utoronto.ca');
    cy.get('input[type="password"]').type('passwordhere');
    cy.get('button[type="button"]').contains('Sign Up').click();
    cy.url().should('include', '/register');
  })

  it('submits form it data is not valid', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(
      <Router>
      <Signup />
      </Router>)

    cy.get('input[type="text"]').type('Jane Doe');
    cy.get('input[type="email"]').type('email@not-uoft.com');
    cy.get('input[type="password"]').type('passwordhere');
    cy.get('button[type="button"]').contains('Sign Up').click();
    cy.get('.text-danger').should('be.visible');
  })
})