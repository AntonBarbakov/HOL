/// <reference types="cypress" />
/// <reference types="cypress-xpath" />
import Button from "../Elements/Button";
import Input from "../Elements/Input";

class InstanceCoursePage_PO {
   clickSkipLessonFlag(lessons_numbers){
      cy.xpath(`(//div[@id='main-experiments']//label[@class='checkbox-label-inmenu'])[${lessons_numbers}]`).click({force:true})
   }

   get SidebarButton () { return new Button("//div[@id='instructor-nav']/div", true) }
   get LessonsSidebarButton () { return new Button ("//div[contains(@aria-expanded, 'true')]/following-sibling::ul//li[contains(.,'Lessons')]", true) }
   get CourseDashboardSidebarButton () { return new Button ("//div[contains(@aria-expanded, 'true')]/following-sibling::ul//li[contains(.,'Course Dashboard')]", true) }
   get ClassListSidebarButton () { return new Button ("//div[contains(@aria-expanded, 'true')]/following-sibling::ul//li[contains(.,'Class List')]", true) }
}

export default InstanceCoursePage_PO;