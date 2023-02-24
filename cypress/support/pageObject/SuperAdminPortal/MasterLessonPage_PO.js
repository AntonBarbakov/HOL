/// <reference types="cypress" />
/// <reference types="cypress-xpath" />
import Button from "../Elements/Button";
import Input from "../Elements/Input";
import Table from "../Elements/Table";
import Label from "../Elements/Label"
import Tab from "../Elements/Tab";

class MasterLessonPage_PO {

    get OverviewSidebarTab() { return new Tab("//ul//li[contains(.,'Overview')]", true) }
    get ExplorationTab() { return new Tab("//ul//li[contains(.,'Exploration')]", true) }
    get ExperimentationTab() { return new Tab("//ul//li[contains(.,'Experimentation')]", true) }
    get EvaluationTab() { return new Tab("//ul//li[contains(.,'Evaluation')]", true) }
}

export default MasterLessonPage_PO