import BaseElements from "./BaseElements";

class Checkbox extends BaseElements{
    constructor(Path, Xpath = false){
        super(Path, Xpath)
    }

    Check(value = null){
        return this.cy.check(value)
    }
}
export default Checkbox;