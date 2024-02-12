import React from 'react'
import Login from './Login'
import {mount} from '@cypress/react18'
import { ToastProvider  } from "../lib/toast";
import { BrowserRouter as Router } from 'react-router-dom';


describe('<Login />', () => {

  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<
      ToastProvider>
      <Router>
            <Login />
      </Router>
      </ToastProvider>
    )
    cy.get('.loginForm').should('exist');
    cy.contains('Submit').click();
  })

  it('submits form with credentials and works', () => {
    cy.mount(<
      ToastProvider>
      <Router>
            <Login />
      </Router>
      </ToastProvider>
    )
    cy.get('input[type="email"]').type("mansii.patel@mail.utoronto.ca");
    cy.get('input[type="password"]').type("passwordhere");

    cy.get('button[type="button"]').click();
    cy.url().should('include', '/manage-commutes');
  })

  it('submits form with wrong credentials and does not work', () => {
    cy.mount(<
      ToastProvider>
      <Router>
            <Login />
      </Router>
      </ToastProvider>
    )
    cy.get('button[type="button"]').click();
    cy.get('.text-danger').should('be.visible');
  })

  it('navigates to signup page when signup button is clicked', () => {
    cy.mount(<
      ToastProvider>
      <Router>
            <Login />
      </Router>
      </ToastProvider>
    )

    cy.contains('Sign Up').click();
    cy.url().should('include', '/signup');
  })
})