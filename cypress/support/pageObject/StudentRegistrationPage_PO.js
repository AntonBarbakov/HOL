/// <reference types="cypress" />
/// <reference types="cypress-xpath" />
import Button from "./Elements/Button";
import Input from "./Elements/Input";

class StudentRegistrationPage_PO {

    get FirstNameInput () { return new Input('//input[@name="first_name"]', true) }
    get LastNameInput () { return new Input('//input[@name="last_name"]', true) }
    get EmailInput () { return new Input('//input[@name="email"]', true) }
    get PasswordInput () { return new Input('//input[@name="password"]', true) }
    get VerifyPasswordInput () { return new Input('//input[@name="confirm-password"]', true)}
    get SubmitButton () { return new Button('//input[@type="submit"]', true) }
}
export default StudentRegistrationPage_PO;