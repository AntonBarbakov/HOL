// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
Cypress.Commands.add("sendLoginCredentials", (username, password) => {
    cy.request({
        method: 'POST',
        url: '/oauth/token',
        form: true,
        body: {
            grant_type:"session",
            username: username,
            password: password,
            client_id: 2,
            client_secret: "Is5eqV4YDcb9cUEcYmlFm0wkl5RnMlFyQ8X5kad0"
        }
    })
})

Cypress.Commands.add("setLessonOrder", (instance_id ,lessons, lessonName, order) => {
    let previosNumber;
    /*SET NEW ORDER NUMBER TO LESSON*/
    for(let i = 0; i< lessons.length;i++){
        if(lessons[i].name===lessonName){
            previosNumber = lessons[i].order
            lessons[i].order = order
        }
    }
    /*SET PREVIOUS NUMBER TO LESSON WITH THE SAME ORDER NUMBER*/
    for(let i = 0; i< lessons.length;i++){
        if(lessons[i].name!==lessonName && lessons[i].order === order){
            lessons[i].order = previosNumber
        }
    }
    /*SORT ARRAY*/
    lessons.sort((a,b)=>{ return a.order - b.order })
    /*SEND PUT REQUEST*/
    cy.getCookie('XSRF-TOKEN').then((cookie)=>{
        cy.request({
            method:'PUT',
            url: `instances/${instance_id}/updateLessonOrder`,
            form: true,
            body: {lessons : lessons},
            headers: {
                // Base64 encoded string was URI encoded in headers. Decode it.
                'X-XSRF-TOKEN': decodeURIComponent(cookie.value)
            }
        }).then(resp=>{
            expect(resp.status).to.eq(200)
        })
    })
})

Cypress.Commands.add("cloneCourse",(instanse_id, course_name)=>{
    let course_id;
    let instructor_id;
    cy._getMasterCourseIdByName(course_name).then((resp)=>{
        course_id = resp
    })

    cy.request({
        method: 'GET',
        url: `institutions/405`,
    }).then(resp=>{
        for(let i=0; i < resp.body.users.length; i++) {
            if(resp.body.users[i].full_name === Cypress.env('TEST_INSTRUCTOR_FULLNAME')){
                instructor_id = resp.body.users[i].id
            }
        }
    })
    .then(()=>{
        cy.getCookie('XSRF-TOKEN').then((cookie)=>{
            cy.request({
                method: 'POST',
                url: `institutions/instances/${instanse_id}/duplicate`,
                body: {
                    class_start_date:"2023-01-01T22:00:00.000Z",
                    closes_on: "2023-05-30T22:00:00.000Z",
                    opens_on: "2023-01-01T22:00:00.000Z",
                    course_id: course_id,
                    enable_student_report_download: true,
                    has_lms_restrictions: 0,
                    instance_tier: "premier",
                    instructor_authoring: true,
                    instructor_id: instructor_id,
                    keep_notes: true,
                    lti_enabled: 0,
                    lti_grade_enabled: 0,
                    maintain_grade_weights: false,
                    override_enabled: false,
                    require_lms_link_access: 0,
                    section_name: course_name,
                    session_name: "Spring 2023",
                    shopping_cart_disabled: true,
                    wave_expedited_processing: false
                },
                headers: {
                    // Base64 encoded string was URI encoded in headers. Decode it.
                    'X-XSRF-TOKEN': decodeURIComponent(cookie.value)
                }
            }).then(resp=>{
                expect(resp.status).to.eq(200)
            })
        })
    }) 
})

Cypress.Commands.add("deleteInstitutionCourseByID",(instanse_id)=>{
    cy.getCookie('XSRF-TOKEN').then((cookie)=>{
        cy.request({
            method: 'DELETE',
            url: `instances/${instanse_id}`,
            headers: {
                // Base64 encoded string was URI encoded in headers. Decode it.
                'X-XSRF-TOKEN': decodeURIComponent(cookie.value)
            }
        }).then((resp)=>{
            expect(resp.status).to.eq(200)
        })
    })
});

Cypress.Commands.add("getMasterCourseID",(name)=>{
    cy.getCookie('XSRF-TOKEN').then((cookie)=>{
        cy.request({
            method:'GET',
            url: `getAuthorDashboard?courses=true&lessons=true`,
            headers: {
                // Base64 encoded string was URI encoded in headers. Decode it.
                'X-XSRF-TOKEN': cookie.value
            }
        }).then(resp=>{
            expect(resp.status).to.eq(200)
            cy.wrap(resp.body)
        }).then(body=>{
            let course_id;
            for(let i = 0; i< body.master_courses.length; i++){
                if(body.master_courses[i].sku === name){
                    course_id = body.master_courses[i].id
                }
            }
            for(const prop in body.master_instances){
                if(body.master_instances[prop].course_id == course_id){
                    return body.master_instances[prop].id
                }
            }
        })
    })
})

Cypress.Commands.add('getInstitutionCourseID', (name, instructor_id = Cypress.env('TEST_INSTRUCTOR_ID'))=>{
    let ID;
    cy.getInstructorInstances().then((resp)=>{
        for(let i=0; i < resp.length; i++){
            if(resp[i].length > 0){
                for(let x =0; x < resp[i].length; x++){
                    if(resp[i][x].instructor_id == instructor_id && resp[i][x].section == name) {
                        console.log(ID)
                        return ID = resp[i][x].id
                    }
                }
            }
        }
    }).then(()=>{
        cy.wrap(ID)
    })
});

/*DEPRICATED*/
/*NEED TO REFACTOR!*/
Cypress.Commands.add("addNewLessonToCourse", (lesson, instance_id, sku)=>{
    let lessons;
    /*GET COURSE*/
    cy.request({
        method: 'GET',
        url: `/instances/${instance_id}/edit`
    }).then((course)=>{
        lessons = course.body.lessons;
        lessons.push(lesson)
    })
    /*ADD LESSON*/
    cy.getCookie('XSRF-TOKEN').then((cookie)=>{    
        cy.request({
            method: 'PUT',
            url: `/instances/${instance_id}`,
            body: {
                closes_on: "2023-08-30",
                course_discipline: "Physics",
                course_sku: sku,
                dragdrop: true,
                gated_experiments: 1,
                is_content_digital_only: 0,
                lessons: lessons,
                opens_on: "2016-07-28",
                prereq_checked: 1,
                publish: false,
                virtual_microscope: 0,
                vscope_require_paywall: 0
            },
            headers: {
                // Base64 encoded string was URI encoded in headers. Decode it.
                'X-XSRF-TOKEN':decodeURIComponent(cookie.value)
            }
        })
    })
})

/*DEPRICATED*/
/*NEED TO REFACTOR!*/
Cypress.Commands.add("addCourseToTestInstitution", (course_name)=>{
    let course_id;
    cy._getMasterCourseIdByName(course_name).then((resp)=>{
        console.log(resp)
        course_id = resp
    })

    cy.getCookie('XSRF-TOKEN').then((cookie)=>{    
        cy.request({
            method: 'POST',
            url: `/institutions/405/instances`,
            body: {
                bso_line_no: null,
                bso_no: "",
                class_start_date: "2023-01-01T22:00:00.000Z",
                closes_on: "2023-08-30T21:00:00.000Z",
                course_id: course_id,
                enable_student_report_download: false,
                has_lms_restrictions: 0,
                instance_tier: "standard",
                instructor_authoring: false,
                instructor_id: Cypress.env('TEST_INSTRUCTOR_ID'),
                lti_enabled: 0,
                lti_grade_enabled: 0,
                opens_on: "2022-12-31T22:00:00.000Z", 
                override_enabled: false,
                override_price: null,
                override_reason: "",
                require_lms_link_access: 0,
                section_name: course_name,
                session_name: "Spring-Summer",
                shopping_cart_disabled: true,
                wave_expedited_processing: false
            },
            headers: {
                // Base64 encoded string was URI encoded in headers. Decode it.
                'X-XSRF-TOKEN':decodeURIComponent(cookie.value)
            }
        })
    })
});

/*Method for determine internal master course id for make others API requests*/
Cypress.Commands.add("_getMasterCourseIdByName", (course_name)=>{
    let course_id;
    cy.getCookie('XSRF-TOKEN').then((cookie)=>{
        cy.request({
            method:'GET',
            url: `getAuthorDashboard?courses=true&lessons=true`,
            headers: {
                // Base64 encoded string was URI encoded in headers. Decode it.
                'X-XSRF-TOKEN': cookie.value
            }
        }).then(resp=>{
            expect(resp.status).to.eq(200)
            cy.wrap(resp.body)
        }).then(body=>{
            for(let i = 0; i< body.master_courses.length; i++){
                if(body.master_courses[i].sku === course_name){
                    course_id = body.master_courses[i].id
                }
            }
        })
    }).then(()=>{
        cy.wrap(course_id)
    })
})

Cypress.Commands.add("getCourseLessonsByInstanceId", (instance_id)=>{
    cy.request({
        method: 'GET',
        url: `instances/${instance_id}/getExperiments`
    }).then((resp)=>{
        cy.wrap(resp.body.lessons)
    })
})

/**
* @param {string} lesson_name
* @param {boolean} flag_status
* @param {object} lesson_list 
* flag_status - set true to skip lesson
*/
Cypress.Commands.add('updateSkipFlag', (lesson_name, flag_status, lesson_list)=>{
    let exp_inst_id;
    flag_status = flag_status === false ? 0 : 1;
    lesson_list = lesson_list.map(e=>{
        if(e.name===lesson_name){
            exp_inst_id = e.exp_inst_id
        }
    })
    /*SET FLAG STATUS*/
    cy.getCookie('XSRF-TOKEN').then((cookie)=>{    
        cy.request({
            method: 'PUT',
            url: `/expInstances/${exp_inst_id}/updateSkipFlag`,
            body: {skip: flag_status},
            headers: {
                // Base64 encoded string was URI encoded in headers. Decode it.
                'X-XSRF-TOKEN':decodeURIComponent(cookie.value)
            }
        })
    })
    .then((resp)=>{
        expect(resp.status).to.eq(200)
    })
})

Cypress.Commands.add('getInstructorInstances', ()=>{
    cy.request({
        method: 'GET',
        url: `/institutions/405`
    }).then(resp=>{
        expect(resp.status).to.eq(200)
        cy.wrap(resp.body.instructor_instances)
    })
});

Cypress.Commands.add('getEnrollmentURL', (courseID, instructor_id = Cypress.env('TEST_INSTRUCTOR_ID'))=>{
    let ID;
    cy.getInstructorInstances().then(resp=>{
        for(let i=0; i < resp.length; i++){
            if(resp[i].length > 0){
                for(let x =0; x < resp[i].length; x++){
                    if(resp[i][x].instructor_id == instructor_id && resp[i][x].id == courseID) {
                        return ID = resp[i][x].code
                    }
                }
            }
        }
    }).then(()=>{
        cy.wrap(`https://test.myhol.holscience.com/enroll/${ID}`)
    })
})

Cypress.Commands.add('updatePage', (pageNumber, name, text, lessonName, discipline, hotfix = true)=>{
    const date = new Date().toJSON();
    let masterLessonID;

    cy._getMasterLessonID(lessonName, discipline).then(masterLessonID=>{
        masterLessonID = masterLessonID;

        cy.getCookie('XSRF-TOKEN').then((cookie)=>{    
            cy.request({
                method: 'GET',
                url: `/lessons/${masterLessonID}/checkoutLesson`,
                headers: {
                    // Base64 encoded string was URI encoded in headers. Decode it.
                    'X-XSRF-TOKEN':decodeURIComponent(cookie.value)
                }
            }).then((resp)=>{
                expect(resp.status).to.eq(200)
                masterLessonID = resp.body.id;
            })
        })
        
        cy.getCookie('XSRF-TOKEN').then((cookie)=>{    
            cy.request({
                method: 'POST',
                url: `/experiments/${masterLessonID}/updatePage`,
                body: {
                    "page_id": 0,
                    "name": name,
                    "elements": [
                      {
                        "content": {
                          "content_type": "editor",
                          "text": "<p>"+text+"</p>",
                          "beyond_labz_url": "Beyond Labz"
                        }
                      }
                    ],
                    "page_number": pageNumber,
                    "modal_element": {
                      "content": [],
                      "customLesson": false
                    },
                    "section": "exploration"
                  },
                headers: {
                    // Base64 encoded string was URI encoded in headers. Decode it.
                    'X-XSRF-TOKEN':decodeURIComponent(cookie.value)
                }
            }).then(resp=>{
                expect(resp.status).to.eq(200)
            })
        })

        cy.getCookie('XSRF-TOKEN').then((cookie)=>{    
            cy.request({
                method: 'POST',
                url: `lessons/${masterLessonID}/submitLesson`,
                body:{
                    internal_note: "Test submit",
                    release_note: "Test submit"
                },
                headers: {
                    // Base64 encoded string was URI encoded in headers. Decode it.
                    'X-XSRF-TOKEN':decodeURIComponent(cookie.value)
                }
            }).then(resp=>{
                expect(resp.status).to.eq(200)
            })
        }).then(()=>{
            if(hotfix){
                cy.getCookie('XSRF-TOKEN').then((cookie)=>{    
                    cy.request({
                        method: 'POST',
                        url: `/lessons/${masterLessonID}/publishLesson`,
                        body: {
                            date : `${date}`,
                            name: "",
                            sku: "",
                            type: "hotfix"
                        },
                        headers: {
                            // Base64 encoded string was URI encoded in headers. Decode it.
                            'X-XSRF-TOKEN':decodeURIComponent(cookie.value)
                        }
                    }).then(resp=>{
                        expect(resp.status).to.eq(200)
                    })
                })
            }
        })    
    })
})

Cypress.Commands.add('_getLessons', ()=>{
    cy.getCookie('XSRF-TOKEN').then((cookie)=>{    
        cy.request({
            method: 'GET',
            url: `/getAuthorDashboard?courses=false&lessons=true`,
            headers: {
                // Base64 encoded string was URI encoded in headers. Decode it.
                'X-XSRF-TOKEN':decodeURIComponent(cookie.value)
            }
        }).then((resp)=>{
            console.log(resp)
            cy.wrap(resp.body)
        })
    })
});

Cypress.Commands.add('_getMasterLessonID', (name , discipline)=>{
    let ID;
    cy._getLessons().then(resp=>{
        for(const type in resp){
            let arr = resp[type];
            for(let i = 0; i < arr.length; i++){
                if(arr[i].name == discipline){
                    for(let x = 0; x < arr[i].experiments.length; x++){
                        if(arr[i].experiments[x].name == name){
                            return ID = arr[i].experiments[x].id
                        }
                    }
                }
            }
        }
    }).then(()=>{
        cy.log(ID)
        cy.wrap(ID)
    }).then(ID=>{
        cy.getCookie('XSRF-TOKEN').then((cookie)=>{    
            cy.request({
                method: 'GET',
                url: `/lessons/${ID}/lessonDetail`,
                headers: {
                    // Base64 encoded string was URI encoded in headers. Decode it.
                    'X-XSRF-TOKEN':decodeURIComponent(cookie.value)
                }
            }).then((resp)=>{
                console.log(resp)
                cy.wrap(resp.body.related_id)
            })
        })
    })
})

Cypress.Commands.add('getStudentCourseID', (name)=>{
    let ID;
    cy.getCookie('XSRF-TOKEN').then((cookie)=>{    
        cy.request({
            method: 'POST',
            url: `/user/hasAgreed`,
            body: {"user_has_agreed":true},
            headers: {
                // Base64 encoded string was URI encoded in headers. Decode it.
                'X-XSRF-TOKEN':decodeURIComponent(cookie.value)
            }
        }).then((resp)=>{
            expect(resp.status).to.eq(204)
        })
    })
    
    cy.getCookie('XSRF-TOKEN').then((cookie)=>{    
        cy.request({
            method: 'GET',
            url: `/dash/getUserInstances`,
            headers: {
                // Base64 encoded string was URI encoded in headers. Decode it.
                'X-XSRF-TOKEN':decodeURIComponent(cookie.value)
            }
        }).then((resp)=>{
            expect(resp.status).to.eq(200)
            cy.wrap(resp.body)
        }).then((resp)=>{
            for(let i = 0; i < resp.length; i++){
                if(resp[i].course_name == name){
                    return ID = resp[i].instance_id;
                }
            }
        }).then(()=>{
            cy.log(ID)
            cy.wrap(ID)
        })
    })
});

Cypress.Commands.add('getStudentLesson', (CourseID, LessonName)=>{
    let lesson;
    cy.getCookie('XSRF-TOKEN').then((cookie)=>{    
        cy.request({
            method: 'POST',
            url: `/instances/${CourseID}/getExperiments`,
            body: {"timezone_offset":-120},
            headers: {
                // Base64 encoded string was URI encoded in headers. Decode it.
                'X-XSRF-TOKEN':decodeURIComponent(cookie.value)
            }
        }).then(resp=>{
            expect(resp.status).to.eq(200)
            cy.wrap(resp.body.exp)
        }).then((resp)=>{
            for(let i = 0; i < resp.length; i++){
                if(resp[i].name == LessonName){
                    return lesson = resp[i];
                }
            }
        }).then(()=>{
            cy.log(lesson)
            cy.wrap(lesson)
        })
    })
});

Cypress.Commands.add("deleteLessonFromCourse", (lesson_name, instance_id)=>{
    let lessons;
    let closes_on;
    let course_discipline;
    let course_sku;
    let dragdrop;
    let gated_experiments;
    let is_content_digital_only;
    let opens_on;
    let prereq_checked;
    let publish;
    let virtual_microscope;
    let vscope_require_paywall;

    /*GET COURSE*/
    cy.request({
        method: 'GET',
        url: `/instances/${instance_id}/edit`
    }).then((course)=>{
        lessons = course.body.lessons.filter(e=>{return e.name.trim()!==lesson_name});
        closes_on = course.body.closes_on;
        course_discipline = course.body.discipline;
        course_sku = course.body.sku;
        dragdrop = course.body.dragdrop;
        gated_experiments = course.body.gated;
        is_content_digital_only = course.body.is_content_digital_only;
        opens_on = course.body.opens_on;
        prereq_checked = course.body.prereq;
        publish = course.body.published;
        virtual_microscope = course.body.virtual_microscope;
        vscope_require_paywall = course.body.vscope_require_paywall;
    })
    /*DELETE LESSON*/
    cy.getCookie('XSRF-TOKEN').then((cookie)=>{    
        cy.request({
            method: 'PUT',
            url: `/instances/${instance_id}`,
            body: {
                closes_on: closes_on,
                course_discipline: course_discipline,
                course_sku: course_sku,
                dragdrop: dragdrop,
                gated_experiments: gated_experiments,
                is_content_digital_only: is_content_digital_only,
                lessons: lessons,
                opens_on: opens_on,
                prereq_checked: prereq_checked,
                publish: publish,
                virtual_microscope: virtual_microscope,
                vscope_require_paywall: vscope_require_paywall
            },
            headers: {
                // Base64 encoded string was URI encoded in headers. Decode it.
                'X-XSRF-TOKEN':decodeURIComponent(cookie.value)
            }
        })
    })
});

Cypress.Commands.add('deletePage', (name, lessonName, discipline)=>{
    let masterLessonID;
    let pageID;

    cy._getMasterLessonID(lessonName, discipline).then(masterLessonID=>{
        masterLessonID = masterLessonID;

        cy.getCookie('XSRF-TOKEN').then((cookie)=>{    
            cy.request({
                method: 'GET',
                url: `/lessons/${masterLessonID}/checkoutLesson`,
                headers: {
                    // Base64 encoded string was URI encoded in headers. Decode it.
                    'X-XSRF-TOKEN':decodeURIComponent(cookie.value)
                }
            }).then((resp)=>{
                expect(resp.status).to.eq(200)
                masterLessonID = resp.body.id;
            })
        }).then(()=>{
            cy.request({
                method: 'GET',
                url: `/experiments/${masterLessonID}/getExplorationPages`
            }).then((resp)=>{
                for(let i = 0; i<resp.body.length; i++) {
                    if(resp.body[i].title == name){
                        return pageID = resp.body[i].id
                    }
                }
            })
        }).then(()=>{
            cy.log(pageID)
            cy.getCookie('XSRF-TOKEN').then((cookie)=>{    
                cy.request({
                    method: 'POST',
                    url: `/experiments/${masterLessonID}/detachPage`,
                    body: { "page_id" : pageID },
                    headers: {
                        // Base64 encoded string was URI encoded in headers. Decode it.
                        'X-XSRF-TOKEN':decodeURIComponent(cookie.value)
                    }
                }).then((resp)=>{
                    expect(resp.status).to.eq(200)
                })
            })
        })

        cy.getCookie('XSRF-TOKEN').then((cookie)=>{    
            cy.request({
                method: 'POST',
                url: `lessons/${masterLessonID}/submitLesson`,
                body:{
                    internal_note: "Test submit",
                    release_note: "Test submit"
                },
                headers: {
                    // Base64 encoded string was URI encoded in headers. Decode it.
                    'X-XSRF-TOKEN':decodeURIComponent(cookie.value)
                }
            }).then(resp=>{
                expect(resp.status).to.eq(200)
            })
        })
    })
})
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })