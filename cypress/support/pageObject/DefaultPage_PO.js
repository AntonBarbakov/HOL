/// <reference types="cypress" />
/// <reference types="cypress-xpath" />
import Button from "./Elements/Button";
import Input from "./Elements/Input";

class DefaultPage_PO {
    open() {
        cy.visit('https://test.myhol.holscience.com')
    }
}

export default DefaultPage_PO;