/// <reference types="cypress" />
/// <reference types="cypress-xpath" />
import Button from "../Elements/Button";
import Input from "../Elements/Input";

class InstructorPortalPage_PO {
    chooseCourseByNumber(number) {
        cy.xpath(`//div[@class="course-row ng-scope instructor"][${number}]`).click();
    }

    get ActiveCoursesButton() { return new Button("//button[contains(.,'Active Courses')]", true)}
}

export default InstructorPortalPage_PO;