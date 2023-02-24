import CourseManagementPage_PO from "../../../support/pageObject/CourseManagementPage_PO";
import InstitutionDashboardPage_PO from "../../../support/pageObject/InstitutionDashboardPage_PO";
import InstanceCoursePage_PO from "../../../support/pageObject/InstructorPortal/InstanceCoursePage_PO";
import InstructorPortalPage_PO from "../../../support/pageObject/InstructorPortal/InstructorPortalPage_PO";
import LoginPage_PO from "../../../support/pageObject/LoginPage_PO";
/// <reference types="cypress" />
/// <reference types="cypress-xpath" />

describe("Course cloning integration ui test cases",()=>{
    const LoginPage = new LoginPage_PO();
    const InstitutionDashboardPage = new InstitutionDashboardPage_PO();
    const CourseManagementPage = new CourseManagementPage_PO();
    const InstructorPortalPage = new InstructorPortalPage_PO();
    const InstanceCoursePage = new InstanceCoursePage_PO();

    beforeEach(() => {
        LoginPage.sendCredentialsViaREST(Cypress.env('TEST_USERNAME'), Cypress.env('PASSWORD'));
    })

    it("Simple ui course clonning procces",()=>{
        InstitutionDashboardPage.open();
        InstitutionDashboardPage.scrollToCourse('His-Dark-Materials-UI');
        InstitutionDashboardPage.clickCloneButton('His-Dark-Materials-UI');
        CourseManagementPage.waitForFullyLoad();
        CourseManagementPage.selectDate("Start","01",1,2023);
        CourseManagementPage.selectDate("End","01",6,2023);
        CourseManagementPage.selectDate("Class-Start", "01",1,2023);
        CourseManagementPage.SaveButton.Click();
        InstitutionDashboardPage.waitForFullyLoad();
        InstitutionDashboardPage.scrollToCourse('His-Dark-Materials-UI', true);
        InstitutionDashboardPage.clickToTheCourse('His-Dark-Materials-UI', true);
        CourseManagementPage.waitForFullyLoad();
        CourseManagementPage.RemoveCourseButton.Click();
        CourseManagementPage.ConfirmRemoveButton.Click();
        InstitutionDashboardPage.waitForFullyLoad();
    });

    it("Change lessons visibility via instructor portal",()=>{
        InstitutionDashboardPage.open();
        InstitutionDashboardPage.openInstructorPortal();
        InstructorPortalPage.chooseCourseByNumber(2);
        InstanceCoursePage.SidebarButton.Click();
        InstanceCoursePage.LessonsSidebarButton.Click();
        InstanceCoursePage.clickSkipLessonFlag(1)
        /*CHECK CLICKING ON SKIP FLAG*/
        cy.xpath('(//div[@id="main-experiments"]//input)[2]').should("have.attr", "aria-label").and("contain", "Add Lesson Diffraction Grating")
        
        InstitutionDashboardPage.open();
        InstitutionDashboardPage.scrollToCourse('His-Dark-Materials-UI');
        InstitutionDashboardPage.clickCloneButton('His-Dark-Materials-UI');
        CourseManagementPage.waitForFullyLoad();
        CourseManagementPage.selectDate("Start","01",1,2023);
        CourseManagementPage.selectDate("End","01",6,2023);
        CourseManagementPage.selectDate("Class-Start", "01",1,2023);
        CourseManagementPage.SaveButton.Click();
        InstitutionDashboardPage.waitForFullyLoad();
        InstitutionDashboardPage.openInstructorPortal();
        InstructorPortalPage.chooseCourseByNumber(3);
        InstanceCoursePage.SidebarButton.Click();
        InstanceCoursePage.LessonsSidebarButton.Click();

        /*CHECK THE SKIP FLAG IS CLIKED IN CLONE COURSE*/
        cy.xpath('(//div[@id="main-experiments"]//input)[2]').should("have.attr", "aria-label").and("contain", "Add Lesson Diffraction Grating")

        InstitutionDashboardPage.open();
        InstitutionDashboardPage.scrollToCourse('His-Dark-Materials-UI', true);
        InstitutionDashboardPage.clickToTheCourse('His-Dark-Materials-UI', true);
        CourseManagementPage.waitForFullyLoad();
        CourseManagementPage.RemoveCourseButton.Click();
        CourseManagementPage.ConfirmRemoveButton.Click();
        InstitutionDashboardPage.waitForFullyLoad();
        InstitutionDashboardPage.openInstructorPortal();
        InstructorPortalPage.chooseCourseByNumber(2);
        InstanceCoursePage.SidebarButton.Click();
        InstanceCoursePage.LessonsSidebarButton.Click();
        InstanceCoursePage.clickSkipLessonFlag(1)

        /*CHECK THAT SKIP FLAG IS FALSE*/
        cy.xpath('(//div[@id="main-experiments"]//input)[2]').should("have.attr", "aria-label").and("contain", "Remove Lesson Diffraction Grating")
    });
});