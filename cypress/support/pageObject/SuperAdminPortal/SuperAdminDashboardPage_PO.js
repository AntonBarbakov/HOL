/// <reference types="cypress" />
/// <reference types="cypress-xpath" />
import Button from "../Elements/Button";
import Input from "../Elements/Input";
import Table from "../Elements/Table";
import Label from "../Elements/Label"

class SuperAdminDashboardPage_PO {
    open() {
        cy.intercept('/getAuthorDashboard?courses=true&lessons=true').as('Table')
        cy.visit('https://test.myhol.holscience.com');
        cy.xpath("//div[@id='author-dashboard']", { timeout: 10000 }).should('be.visible');
        cy.wait('@Table').then(interception => {
            expect(interception.response.statusCode).to.eq(200)
        })
    }
    selectDiscipline(discipline){
        cy.xpath(`//ul[@id='discipline-list']//span[text()='${discipline}']`).click()
    }
    selectLesson(lesson){
        cy.xpath(`(//ul[@class="lessons-list"]//span[text()="${lesson}"])[1]`).click()
    }

    get TableLable() { return new Label("//h2[contains(., 'Authoring In Progress')]", true) }
    // get LessonsTable() { return new Table("//div[@id='DataTables_Table_3_wrapper']", true) }
    get LessonsTab() { return new Button("//li[contains(@href, '#/dashboard/lessons')]//span", true) }
    get CoursesTab() { return new Button("//li[contains(@href, '#/dashboard/courses')]//span", true) }
    get SearchInput() { return new Input("//input[@name='lessonSearch']", true) }
    get ViewLessonButton() { return new Button('//span[@id="edit-lesson"]', true) }
}

export default SuperAdminDashboardPage_PO