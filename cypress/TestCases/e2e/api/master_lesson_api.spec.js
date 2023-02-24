/// <reference types="cypress" />
/// <reference types="cypress-xpath" />

import LoginPage_PO from "../../../support/pageObject/LoginPage_PO";
import StudentRegistrationPage_PO from "../../../support/pageObject/StudentRegistrationPage_PO";

describe("Master lesson e2e api test cases",()=>{
    const LoginPage = new LoginPage_PO();
    const StudentRegistrationPage = new StudentRegistrationPage_PO();

    it('Hotfix update of a master lesson.',()=>{
        const COURSE_NAME = 'His-Dark-Materials';
        let random = Math.floor(Math.random() * 99999);
        const TEST_STUDENT_LOGIN = `test${random}@gmail.com`;
        let clone_id;
        const newLesson = {
            unlocked: 0,
            prereq: 0,
            name: "Horcrux",
            experiment_id: Cypress.env('TEST_LESSON_ID'),
            lti_lesson_id: "hol-mlesson-nnnpzktk",
            sku: "Horcrux",
            version_index: 2
        }
        const newPageName = "<p>Test lesson page</p>";
        const deletePageName = "<span>Test lesson page</span>";
        const TEXT = "Lorem ipsum dolor sit amet. Vel veritatis deserunt ut nesciunt laudantium quo quia consectetur non voluptas maxime ad dignissimos ratione. Et iure sint ut culpa porro hic beatae modi."

        /*PRECONDITIONS*/
        cy.sendLoginCredentials(Cypress.env('SUPER_ADMIN_USERNAME'), Cypress.env('SUPER_ADMIN_PASS')).then(resp=>{
            expect(resp.status).to.eq(200)
        })
        
        /*-FIND MASTER COURSE ID BY COURSE NAME*/
        cy.getMasterCourseID(COURSE_NAME)
        /*-ADD NEW LESSON TO MASTER COURSE*/
        .then(master_instance_ID=>{
            cy.addNewLessonToCourse(newLesson, master_instance_ID, COURSE_NAME)
        })
        /*MAKE CLONE COURSE*/
        cy.getInstitutionCourseID(COURSE_NAME)
        .then((course_id)=>{
            cy.cloneCourse(course_id, COURSE_NAME).then((resp)=>{
                clone_id = resp.body.instance_id;
                console.log(clone_id)
            })
        })
        /*ADD NEW STUDENT TO THE COURSE*/
        .then(()=>{
            cy.getEnrollmentURL(clone_id).then(URL=>{
                cy.clearCookies()
                cy.clearLocalStorage()

                cy.visit(URL)
                StudentRegistrationPage.FirstNameInput.Type('Ron')
                StudentRegistrationPage.LastNameInput.Type('Yuizly')
                StudentRegistrationPage.EmailInput.Type(TEST_STUDENT_LOGIN)
                StudentRegistrationPage.PasswordInput.Type(Cypress.env('TEST_STUDENT_PASS'))
                StudentRegistrationPage.VerifyPasswordInput.Type(Cypress.env('TEST_STUDENT_PASS'))
                Cypress.config('pageLoadTimeout', 300000)
                StudentRegistrationPage.SubmitButton.Click();
            })
        })
        /*MAKE CHANGES IN LESSON*/
        .then(()=>{
            cy.sendLoginCredentials(Cypress.env('SUPER_ADMIN_USERNAME'), Cypress.env('SUPER_ADMIN_PASS')).then(resp=>{
                expect(resp.status).to.eq(200)
            })

            cy.updatePage(2, newPageName, TEXT, newLesson.name, "Physics")
        })
        /*STUDENT LOGIN AND VERIFY NEW LESSON*/
        .then(()=>{
            cy.sendLoginCredentials(TEST_STUDENT_LOGIN, Cypress.env('TEST_STUDENT_PASS')).then(resp=>{
                expect(resp.status).to.eq(200)
            })

            cy.getStudentCourseID(COURSE_NAME).then((ID)=>{
                cy.getStudentLesson(ID, newLesson.name).then(lesson=>{
                    expect(lesson.parts[1].pages[1].title).to.eq(newPageName)
                })
            })
        })
        /*DELETE CHANGES*/
        .then(()=>{
            cy.sendLoginCredentials(Cypress.env('TEST_USERNAME'), Cypress.env('PASSWORD')).then(resp=>{
                expect(resp.status).to.eq(200)
            })

            cy.deleteInstitutionCourseByID(clone_id)

            cy.sendLoginCredentials(Cypress.env('SUPER_ADMIN_USERNAME'), Cypress.env('SUPER_ADMIN_PASS')).then(resp=>{
                expect(resp.status).to.eq(200)
            })

            cy.getMasterCourseID(COURSE_NAME).then(instance_id=>{
                cy.deleteLessonFromCourse(newLesson.name, instance_id)
            })

            cy.deletePage(deletePageName, newLesson.name, "Physics")
        })
    });
});