import {Profile} from "../Model/profile.js";
import {scope} from "./ViewConnections.js";


let VMtoView = function () {
    //IMPORT DATA
    let ViewModel;
    d3.json("../Model/ViewModel_Test.json").then(function (data) {
        ViewModel = data;
        draw(data);
    });

    function draw(ViewModel) {

        const radius = 20;

        let Classes = ViewModel.Classes;
        let taken = Classes.filter(course => course.taken === true);
        let requiredNotTaken = Classes.filter(course => (course.taken === false && course.required === true));
        let available = Classes.filter(course => (course.taken === false && course.required === false));


        //NOT TAKEN COURSES. Color: Red
        let svg = d3.select("body")
            .select("#GUI")
            .append("div")
            .attr("id", "svgNotTaken");

        let svgGroups = svg.selectAll("notTaken")
            .data(available)
            .enter().append("div")
            .attr("id", function (d) {
                return String(d.dept) + String(d.course)
            })
            .html(function (d) {
                return String(d.course)
            })
            .classed("draggable available outGraph", true);

        //TAKEN COURSES. Color: Green
        let svgNotTakenDivs = d3.select("body")
            .select("#GUI")
            .append("div")
            .attr("id", "graph");

        let svgContainer = svgNotTakenDivs.selectAll("taken")
            .data(taken)
            .enter().append("div")
            .attr("id", function (d) {
                return String(d.dept) + String(d.course)
            })
            .html(function (d) {
                return String(d.course)
            })
            .attr("class", "draggable taken inGraph");


        //REQUIRED, NOT TAKEN COURSES Color: Gray
        let svgRequiredGroups = svgNotTakenDivs.selectAll("taken")
            .data(requiredNotTaken)
            .enter().append("div")
            .attr("id", function (d) {
                return String(d.dept) + String(d.course)
            })
            .html(function (d) {
                return String(d.course)
            })
            .attr("class", "draggable required inGraph");

        let buttonBar = d3.select("body")
            .select("#GUI")
            .append("div")
            .attr("id", "buttonBar");

        buttonBar.append("button")
                 .attr("id","markTaken")
                 .html("Mark as Taken")
                 .on("click", markTaken);

        buttonBar.append("button")
                 .attr("id","markUntaken")
                 .html("Mark as Untaken")
                 .on("click", markUntaken);

        positionPreReqs();
        positionTopBar();


        //-----------     HELPER FUNCTIONS     -----------

        function positionTopBar() {
            let topCourses = $(".draggable.available");
            const length = topCourses.length;
            const width = $("#svgNotTaken").width() - 75;
            const placement = width / length;
            let i = 1;
            for (let course of topCourses) {
                $(course).css({
                    top: $("#svgNotTaken").height() / 2 - (radius + 10),
                    left: i * placement - 40
                });
                i++;
            }
        }
        //TODO: THINK ABOUT THIS. Do you add and remove required? If so, how?
        //Do you want your users to have this ability? Should they?

        function markTaken(){
            scope.addClass("taken").removeClass("available")
        }

        function markUntaken(){
            scope.addClass("available").removeClass("taken")
        }

        function positionPreReqs() {
            $("#COMP123").css({
                top: 250,
                left: 50
            });
            $("#COMP127").css({
                top: 200,
                left: 150
            });
            $("#COMP128").css({
                top: 230,
                left: 250
            });
            $("#MATH279").css({
                top: 330,
                left: 250
            });
            $("#COMP240").css({
                top: 130,
                left: 400
            });
            $("#COMP221").css({
                top: 230,
                left: 400
            });
            $("#COMP225").css({
                top: 330,
                left: 400
            });
            $("#COMP261").css({
                top: 430,
                left: 400
            });
        }
    }
};


export { VMtoView }