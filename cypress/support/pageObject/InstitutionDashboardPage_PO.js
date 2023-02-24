/// <reference types="cypress" />
/// <reference types="cypress-xpath" />
import Button from "./Elements/Button";
import Checkbox from "./Elements/Checkbox";

class InstitutionDashboardPage_PO {
    open() {
        cy.visit('https://test.myhol.holscience.com');
        cy.xpath("//table[@class='institution-courses-table hol-table']//tbody", { timeout: 10000 }).should('be.visible');
    }

    /**
    *@param {string} courseName
    */
    clickCloneButton(courseName) {
        cy.xpath(`//td[contains(text(),'${courseName}')]/following-sibling::td//button`).click();
    }

    /**
    *@param {string} courseName
    *@param {boolean} clone
    */
    scrollToCourse(courseName, clone = false) {
        if(clone){
            cy.xpath(`(//td[contains(text(),'${courseName}')]/following-sibling::td//button)[2]`).scrollIntoView()
        }else{
            cy.xpath(`//td[contains(text(),'${courseName}')]/following-sibling::td//button`).scrollIntoView()
        }
    }

    /**
    *@param {string} courseName
    *@param {boolean} clone
    */
    clickToTheCourse(courseName, clone = false) {
        if(clone){
            cy.xpath(`(//td[contains(text(),'${courseName}')]/ancestor::tr/td[@class="sku"]/a)[2]`).click()
        }else{
            cy.xpath(`(//td[contains(text(),'${courseName}')]/ancestor::tr/td[@class="sku"]/a)[1]`).click()
        }
    }

    waitForFullyLoad() {
        cy.xpath("//table[@class='institution-courses-table hol-table']//tbody", { timeout: 30000 }).should('be.visible');
    }

    openInstructorPortal() {
        this.OpenInstructorPortalButton.cy.invoke('removeAttr', 'target').click()
    }

    get OpenInstructorPortalButton () { return new Button("//div/a/button[contains(.,'Open Instructor Portal')]/..", true) }
    get AddAnItemButton () { return new Button("//button[contains(.,'Add an Item')]", true) }
    get AddAnInstitutionUser () { return new Button("//button[contains(.,'Add an Institution User')]", true) }
    get ShowDeactivatedCoursesCheckbox () { return new Checkbox("#toggle-deactivated-courses")}
};

export default InstitutionDashboardPage_PO;