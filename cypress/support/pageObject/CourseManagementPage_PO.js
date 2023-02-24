/// <reference types="cypress" />
/// <reference types="cypress-xpath" />
import Button from "./Elements/Button";
import Checkbox from "./Elements/Checkbox";
import Input from "./Elements/Input";
import Label from "./Elements/Label";

class CourseManagementPage_PO {

    _DATE = new Date();
    _CURRENT_YEAR = this._DATE.getFullYear();
    _CURRENT_MONTH = this._DATE.getMonth()+1;
    _MONTHS = {
        "January":1,
        "February":2,
        "March":3,
        "April":4,
        "May":5,
        "June":6,
        "July":7,
        "August":8,
        "September":9,
        "October":10,
        "November":11,
        "December":12
    }

    /**
     * @param {string} Input
     * @param {string} Day
     * @param {number} Month
     * @param {number} Year
     * !!!IMPORTANT!!!
     * - Input value can be only one of them => "Start", "End", "Class-Start"
     */
    selectDate(Input, Day, Month, Year) {
        const selector = Input === "Start" ? '#session-start' : Input === "End" ? '#session-end' : '#course-start-date';

        cy.get(selector).click().then(()=>{
            const MONTH_STR = this._getKeyByValue(this._MONTHS, Month);
            const MONTH_YEAR = `${MONTH_STR} ${Year}`;
            const DATE_MOVE_BUTTON = this._defineDateMoveButton(this._MONTHS[MONTH_STR], Year);
            
            if(DATE_MOVE_BUTTON){
                this._clickAndCheck(DATE_MOVE_BUTTON, MONTH_YEAR);
            }
        })
        cy.xpath(`//button[contains(@ng-click,'select(dt.date)')]//span[contains(text(),'${Day}')][not(contains(@class,'ng-binding text-muted'))]`)
          .click();
    }

    waitForFullyLoad() {
        cy.intercept('institutions/*/instances').as('courseInstanse')
        cy.wait('@courseInstanse').its('response.statusCode').should('eq', 200)
    }

    _defineDateMoveButton(Month, Year){
        if(Year == this._CURRENT_YEAR){
            if(Month == this._CURRENT_MONTH) {
                return null;
            }else if(Month > this._CURRENT_MONTH){
                return this.ForwardButton;
            }else{
                return this.BackButton;
            }
        }else if(Year > this._CURRENT_YEAR){
            return this.ForwardButton;
        }else{
            return this.BackButton;
        }
    }

    /* Need to refactor call method */
    _getKeyByValue(object, value) {
        return Object.keys(object).find(key => object[key] === value);
    }

    /**
     * @param {Button} Button
     * @param {string} Check
     */
    _clickAndCheck(Button, Check) {
        this.DatePickerLabel.cy.invoke('text').then(text1=>{
            if(text1 == Check){
                return
            }
            cy.wait(300)
            Button.Click()
            this._clickAndCheck(Button, Check);
        })
    }

    get DatePickerLabel () { return new Label("//button[contains(@ng-click,'move(-1)')]/../following-sibling::th//button[contains(@id,'datepicker')]//strong", true) }
    get ForwardButton () { return new Button("//button[contains(@ng-click,'move(1)')]", true) }
    get BackButton () { return new Button("//button[contains(@ng-click,'move(-1)')]", true) }
    get DatePickerButton () { return new Button("//button[contains(@ng-click,'move(-1)')]/../following-sibling::th//button[contains(@id,'datepicker')]", true) } 
    get CancelButton () { return new Button("//a[contains(text(),'Cancel')]", true ) }
    get PreviewButton () { return new Button("//button[contains(.,'Preview')]", true) }
    get SaveButton () { return new Button("//button[contains(.,'Save')]", true) }
    get AllowStudentPdfCheckbox () { return new Checkbox('#allow-student-pdf-checkbox') }
    get CourseNameInput () { return new Input("//h3[contains(., 'Course Name')]/following-sibling::input", true) }
    get RemoveCourseButton () { return new Button("//button[contains(.,'Remove Course')]", true) }
    get ConfirmRemoveButton () { return new Button("//button[contains(text(),'Remove Course')]", true) }
}

export default CourseManagementPage_PO;