import DefaultPage_PO from "../../../support/pageObject/DefaultPage_PO";
import LoginPage_PO from "../../../support/pageObject/LoginPage_PO";
/// <reference types="cypress" />
/// <reference types="cypress-xpath" />

describe("User login HOL page verification",()=>{
    const LoginPage = new LoginPage_PO();
    const DefaultPage = new DefaultPage_PO();

    it("Full user log in simulation",()=>{
        LoginPage.open()
        LoginPage.EmailInput.cy.should("be.visible")
        LoginPage.EmailInput.Type(Cypress.env('TEST_USERNAME'))
        LoginPage.PasswordInput.Type(Cypress.env('PASSWORD'))
        LoginPage.SubmitButton.Click()
        cy.url().should('include', 'https://test.myhol.holscience.com/#/institutions/405')
    });

    it("Short login via POST request",()=>{
        LoginPage.sendCredentialsViaREST(Cypress.env('TEST_USERNAME'), Cypress.env('PASSWORD'))
        DefaultPage.open();
        cy.url().should('include', 'https://test.myhol.holscience.com/#/institutions/405')
    });
});
