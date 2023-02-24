import LoginPage_PO from "../../../support/pageObject/LoginPage_PO";
import MasterLessonPage_PO from "../../../support/pageObject/SuperAdminPortal/MasterLessonPage_PO";
import SuperAdminDashboardPage_PO from "../../../support/pageObject/SuperAdminPortal/SuperAdminDashboardPage_PO";
/// <reference types="cypress" />
/// <reference types="cypress-xpath" />

describe("Master lesson integration ui test cases",()=>{
    const LoginPage = new LoginPage_PO();
    const SuperAdminDashboard = new SuperAdminDashboardPage_PO();
    const MasterLessonPage = new MasterLessonPage_PO();

    beforeEach(() => {
        LoginPage.sendCredentialsViaREST(Cypress.env('SUPER_ADMIN_USERNAME'), Cypress.env('SUPER_ADMIN_PASS'));
    })

    it("Simple ui master lesson view interface verification",()=>{
        SuperAdminDashboard.open();
        SuperAdminDashboard.CoursesTab.cy.click({force:true});
        SuperAdminDashboard.LessonsTab.cy.click({force:true});
        SuperAdminDashboard.SearchInput.Type("Hor")
        SuperAdminDashboard.selectDiscipline("Physics")
        SuperAdminDashboard.selectLesson("Horcrux")
        SuperAdminDashboard.ViewLessonButton.cy.scrollIntoView().should('be.visible')
        cy.wait(3000)
        SuperAdminDashboard.ViewLessonButton.Click()
    })

    it("Master lesson page tabs verification",()=>{
        SuperAdminDashboard.open();
        SuperAdminDashboard.CoursesTab.cy.click({force:true});
        SuperAdminDashboard.LessonsTab.cy.click({force:true});
        SuperAdminDashboard.SearchInput.Type("Hor")
        SuperAdminDashboard.selectDiscipline("Physics")
        SuperAdminDashboard.selectLesson("Horcrux")
        SuperAdminDashboard.ViewLessonButton.cy.scrollIntoView().should('be.visible')
        cy.wait(3000)
        SuperAdminDashboard.ViewLessonButton.Click()
        cy.xpath('//h2[contains(.,"Exploration Overview")]').should('be.visible')
        MasterLessonPage.ExperimentationTab.cy.click({force:true})
        cy.xpath('//h2[contains(.,"Experimentation Overview")]').should('be.visible')
        MasterLessonPage.EvaluationTab.cy.click({force:true})
        cy.xpath('//h2[contains(.,"Evaluation Overview")]').should('be.visible')
        MasterLessonPage.OverviewSidebarTab.cy.should('be.visible')
    })

    it.skip("Master lesson page main fields verification",()=>{

    })
})