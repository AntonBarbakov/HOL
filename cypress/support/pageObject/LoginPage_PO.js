/// <reference types="cypress" />
/// <reference types="cypress-xpath" />
import Button from "./Elements/Button";
import Input from "./Elements/Input";

class LoginPage_PO {
    open() {
        cy.visit('https://test.myhol.holscience.com/auth/login')
    }
    sendCredentialsViaREST(username, password) {
        cy.sendLoginCredentials(username, password).then((resp)=>{ expect(resp.status).to.eq(200) });
    }

    get SubmitButton () { return new Button("#js-form-submit-btn") }
    get EmailInput () { return new Input("#email") }
    get PasswordInput () { return new Input("#password") }
    get ForgotPasswordButton () { return new Button("//p[@id='forgot-password-link']//a", true) }
}

export default LoginPage_PO;