/// <reference types="cypress" />
/// <reference types="cypress-xpath" />

import LoginPage_PO from "../../../support/pageObject/LoginPage_PO";
import StudentRegistrationPage_PO from "../../../support/pageObject/StudentRegistrationPage_PO";

describe("Course cloning e2e api test cases",()=>{
    const LoginPage = new LoginPage_PO();
    const StudentRegistrationPage = new StudentRegistrationPage_PO();

    it('Change lessons sequential via API and clone the course',()=>{
        const COURSE_NAME = "His-Dark-Materials";
        let LessonsOrder = {};
        let CloneLessonsOrder = {};
        let ID;
        let CloneID;
        let orderNumder = Math.floor(Math.random()*10) + 1;

        LoginPage.sendCredentialsViaREST(Cypress.env('TEST_USERNAME'), Cypress.env('PASSWORD'));
        /*GET COURSE ID*/
        cy.request({
            method:'GET',
            url:'/dash/getInstructorInstances'
        }).then((resp)=>{
            expect(resp.status).to.eq(200)
            cy.wrap(resp.body).its('length').should('be.gte', 1)
            cy.wrap(resp.body)
        }).then((obj)=>{
            return obj.filter(elem=>{return elem.course_name === COURSE_NAME})
        }).then((data)=>{
            return cy.wrap(...data).then((data)=>{
                ID = data.instance_id
            })
        })
        /*GET LESSONS LIST*/
        .then(()=>{
            cy.request({
                method: 'GET',
                url: `instances/${ID}/getExperiments`
            }).then((resp)=>{
                expect(resp.status).to.eq(200)
                cy.wrap(resp.body.lessons)
            })
        })
        /*CHANGE LESSONS ORDER*/
        .then((lessons)=>{
            cy.setLessonOrder(ID,lessons,"Laboratory Safety", orderNumder)
        })
        /*SAVE NEW LESSONS ORDER*/
        .then(()=>{
            cy.request({
                method: 'GET',
                url: `instances/${ID}/getExperiments`
            }).then((resp)=>{
                resp.body.lessons.forEach(elem=>{
                    LessonsOrder[elem.name] = elem.order
                })
                expect(LessonsOrder["Laboratory Safety"]).to.eq(orderNumder)
            })
        })
        /*CLONE COURSE*/
        .then(()=>{
            cy.cloneCourse(ID, COURSE_NAME)
        })
        /*GET CLONE COURSE ID*/
        .then(()=>{
            cy.request({
                method:'GET',
                url:'/dash/getInstructorInstances'
            }).then((resp)=>{
                console.log(resp.body)
                CloneID = resp.body[resp.body.length-1].instance_id
            })
        })
        /*GET CLONE COURSE LESSONS ORDER AND VERIFY THAT CLONE LESSONS ORDER THE SAME*/
        .then(()=>{
            cy.request({
                method: 'GET',
                url: `instances/${CloneID}/getExperiments`
            }).then((resp)=>{
                resp.body.lessons.forEach(elem=>{
                    CloneLessonsOrder[elem.name] = elem.order
                })
                
                for (const prop in CloneLessonsOrder) {
                    expect(CloneLessonsOrder[prop]).to.eq(LessonsOrder[prop])
                }
            })
        })
        /*DELETE THE CLONE COURSE*/
        .then(()=>{
            cy.deleteInstitutionCourseByID(CloneID);
        });
    });
    
    it('Add new custom lesson via API. Master course instance is priority',()=>{
        const COURSE_NAME = 'Dark-Arts';
        const newLesson = {
            unlocked: 0,
            prereq: 0,
            name: "Horcrux",
            experiment_id: Cypress.env('TEST_LESSON_ID'),
            lti_lesson_id: "hol-mlesson-dmmprrpb",
            sku: "Horcrux",
            version_index: 2
        }
        let newID;
        let cloneID;
        let masterCourseLessons;
        let cloneCourseLessons;

        cy.sendLoginCredentials(Cypress.env('SUPER_ADMIN_USERNAME'), Cypress.env('SUPER_ADMIN_PASS')).then(resp=>{
            expect(resp.status).to.eq(200)
        })
        /*-FIND MASTER COURSE ID BY COURSE NAME*/
        cy.getMasterCourseID(COURSE_NAME)
        /*ADD NEW LESSON TO COURSE*/
        .then(instance_id=>{
            cy.addNewLessonToCourse(newLesson, instance_id, COURSE_NAME)
        })
        /*ADD UPDATED COURSE TO THE INSTITUTE*/
        .then(()=>{
            cy.addCourseToTestInstitution(COURSE_NAME).then((resp)=>{
                newID = resp.body.instance_id;
                console.log(newID)
            })
        })
        /*CLONE COURSE*/
        .then(()=>{
            cy.cloneCourse(newID, COURSE_NAME).then((resp)=>{
                cloneID = resp.body.instance_id;
                console.log(cloneID)
            })
        })
        /*VERIFY LESSONS*/
        .then(()=>{
            cy.getCourseLessonsByInstanceId(newID).then((lessons)=>{
                masterCourseLessons = lessons
            })
            cy.getCourseLessonsByInstanceId(cloneID).then((lessons)=>{
                cloneCourseLessons = lessons
            })
        })
        .then(()=>{
            expect(masterCourseLessons[masterCourseLessons.length-1].name.trim()).to.eq(newLesson.name)
            expect(cloneCourseLessons[cloneCourseLessons.length-1].name.trim()).to.eq(newLesson.name)
        })
        /*DELETE COURCES*/
        .then(()=>{
            cy.deleteInstitutionCourseByID(cloneID);
            cy.deleteInstitutionCourseByID(newID);
        })
        /*DELETE LESSON*/
        .then(()=>{
            cy.getMasterCourseID(COURSE_NAME).then(instance_id=>{
                cy.deleteLessonFromCourse(newLesson.name, instance_id)
            })
        })
    })

    it('Clonning of a course. (SCM-T11 (1.0))',()=>{
        const COURSE_NAME = 'Dark-Arts';
        const newLesson = {
            unlocked: 0,
            prereq: 0,
            name: "Horcrux",
            experiment_id: Cypress.env('TEST_LESSON_ID'),
            lti_lesson_id: "hol-mlesson-nnnpzktk",
            sku: "Horcrux",
            version_index: 2
        }
        let instance_ID;
        let instance_lessons;
        let cloneID;

        /*PRECONDITIONS*/
        cy.sendLoginCredentials(Cypress.env('SUPER_ADMIN_USERNAME'), Cypress.env('SUPER_ADMIN_PASS')).then(resp=>{
            expect(resp.status).to.eq(200)
        })

        /*STEP 1. Add instance to Institution*/
        cy.addCourseToTestInstitution(COURSE_NAME).then((resp)=>{
            instance_ID = resp.body.instance_id;
            console.log(instance_ID)
        })

        /*STEP 2. Make lessons change in instance course*/
        cy.sendLoginCredentials(Cypress.env('TEST_USERNAME'), Cypress.env('PASSWORD')).then(resp=>{
            expect(resp.status).to.eq(200)
        })
        /*-GET LESSONS LIST*/
        .then(()=>{
            cy.request({
                method: 'GET',
                url: `instances/${instance_ID}/getExperiments`
            }).then((resp)=>{
                expect(resp.status).to.eq(200)
                cy.wrap(resp.body.lessons)
            })
        })
        /*-MAKE SOME LESSONS UPDATE*/
        .then((lessons)=>{
            instance_lessons = lessons;
            console.log(instance_lessons)
            cy.setLessonOrder(instance_ID, instance_lessons,"Getting Started", 6)
            cy.updateSkipFlag('Acceleration', true, instance_lessons)
            cy.updateSkipFlag('OLD-Centripetal Acceleration', true, instance_lessons)
        })

        /*STEP 3. Add new lesson to master course*/
        cy.sendLoginCredentials(Cypress.env('SUPER_ADMIN_USERNAME'), Cypress.env('SUPER_ADMIN_PASS')).then(resp=>{
            expect(resp.status).to.eq(200)
        })
        /*-FIND MASTER COURSE ID BY COURSE NAME*/
        cy.getMasterCourseID(COURSE_NAME)
        /*-ADD NEW LESSON TO COURSE*/
        .then(instance_id=>{
            cy.addNewLessonToCourse(newLesson, instance_id, COURSE_NAME)
        })

        /*STEP 4. Clone istance course*/
        .then(()=>{
            cy.cloneCourse(instance_ID, COURSE_NAME).then((resp)=>{
                cloneID = resp.body.instance_id;
                console.log(cloneID)
            })
        })

        /*STEP 5. Verify clone data. Instance clone data priority*/
        .then(()=>{
            cy.request({
                method: 'GET',
                url: `instances/${cloneID}/getExperiments`
            }).then((resp)=>{
                expect(resp.status).to.eq(200)
                expect(resp.body.lessons[5].name).to.eq('Getting Started')
                expect(resp.body.lessons[resp.body.lessons.length-1].name).to.eq('Horcrux')
                expect(resp.body.lessons[1].skip).to.eq(1)
                expect(resp.body.lessons[2].skip).to.eq(1)
            })
        })

        /*STEP 6. Delete test data*/
        /*DELETE COURCES*/
        .then(()=>{
            cy.deleteInstitutionCourseByID(cloneID);
            cy.deleteInstitutionCourseByID(instance_ID);
        })
        /*DELETE LESSON*/
        .then(()=>{
            cy.getMasterCourseID(COURSE_NAME).then(instance_id=>{
                cy.deleteLessonFromCourse(newLesson.name, instance_id)
            })
        })
    });

    it('Clonning of a master lesson. (SCM-T12 (1.0))',()=>{
        const COURSE_NAME = 'His-Dark-Materials';
        let instance_ID;
        let URL;
        let random = Math.floor(Math.random() * 99999);
        let student_id;

        /*PRECONDITIONS*/
        cy.sendLoginCredentials(Cypress.env('SUPER_ADMIN_USERNAME'), Cypress.env('SUPER_ADMIN_PASS')).then(resp=>{
            expect(resp.status).to.eq(200)
        })

        /*ADD NEW COURSE TO INSTITUTION*/
        cy.addCourseToTestInstitution(COURSE_NAME).then((resp)=>{
            instance_ID = resp.body.instance_id;
            console.log(instance_ID)
        })

        cy.getInstructorInstances().then((resp)=>{
            for(let i = resp.length-1; i >= 0; i--){
                if(resp[i][0]){
                    if(resp[i][resp[i].length-1].course_id == 25){
                        URL = resp[i][resp[i].length-1].code
                        cy.wrap(URL)
                        break;
                    }
                }
            }
        })

        /*ADD NEW STUDENT TO COURSE*/ 
        .then((URL)=>{
            cy.clearCookies()
            cy.clearLocalStorage()

            cy.visit(`https://test.myhol.holscience.com/enroll/${URL}`)
            StudentRegistrationPage.FirstNameInput.Type('Ron')
            StudentRegistrationPage.LastNameInput.Type('Yuizly')
            StudentRegistrationPage.EmailInput.Type(`test${random}@gmail.com`)
            StudentRegistrationPage.PasswordInput.Type('13Warriors')
            StudentRegistrationPage.VerifyPasswordInput.Type('13Warriors')
            Cypress.config('pageLoadTimeout', 300000)
            StudentRegistrationPage.SubmitButton.Click();
        })

        .then(()=>{
            LoginPage.sendCredentialsViaREST(Cypress.env('TEST_USERNAME'), Cypress.env('PASSWORD'));
            
            cy.request({
                method: 'GET',
                url: `/instances/${instance_ID}/getStudents`
            }).then((resp)=>{
                student_id = resp.body.users[0].id
            })
        })
        .then(()=>{
            cy.getCookie('XSRF-TOKEN').then((cookie)=>{    
                cy.request({
                    method: 'POST',
                    url: `instances/${instance_ID}/removeStudent`,
                    body: {
                        student_id: 254122
                    },
                    headers: {
                        // Base64 encoded string was URI encoded in headers. Decode it.
                        'X-XSRF-TOKEN':decodeURIComponent(cookie.value)
                    }
                })
            })
        })
        .then(()=>{
            cy.deleteInstitutionCourseByID(instance_ID)
        })
    });
});