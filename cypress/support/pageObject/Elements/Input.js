import BaseElements from "./BaseElements";

class Input extends BaseElements {
    constructor(Path, Xpath = false){
        super(Path, Xpath)
    }

    Type(string){
        return this.cy.type(string);
    }
}
export default Input;