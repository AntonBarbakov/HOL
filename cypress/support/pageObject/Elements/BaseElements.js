/// <reference types="cypress" />
/// <reference types="cypress-xpath" />
class BaseElements {
    constructor(Path,XPath = false){
        if(XPath){
            this.cy = cy.xpath(Path);
        }else{
            this.cy = cy.get(Path);
        }
    }
    Click(){
        return this.cy.click();
    }

}
export default BaseElements;