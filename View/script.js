$(document).ready(function () {

    //GLOBAL VARIABLES
    const radius = 20;
    const displacement = radius + 10;
    var courses, arrows, catalog;

    //IMPORT DATA
    d3.json("./ViewModel_Test.json").then(function (data) {
        courses = data.Classes;
        arrows = data.Connections;
    });
    d3.json("../Model/CS_major.json").then(function (data) {
        catalog = data;
    });

    //SET UP JSPLUMB. instance will be the variable which controls jsPlumb draggable behavior.
    var instance = jsPlumb.getInstance({
        Connector: ["Straight"],
        DragOptions: {cursor: "pointer", zIndex: 5},
        PaintStyle: {stroke: "black", strokeWidth: 2},
    });

    /*Make courses draggable. Notice that the courses inside the top bar and the ones
      in the graph have different programs controlling their drag behavior. This is
      necessary for drag-and-drop to work with line drawing.
     */
    var availableCourses = $(".draggable.available");
    var graphCourses = $(".inGraph");

    availableCourses.draggable({revert: true});
    instance.draggable(graphCourses);

    //DECLARE DRAGGABLE BEHAVIOR
    $("#svgNotTaken").droppable({accept: '.draggable'});
    $("#graph").droppable({
        drop: function (e, ui) {
            var x = ui.helper.clone();
            ui.helper.remove();
            x.css({
                top: e.clientY - displacement,
                left: e.clientX - displacement,
                position: 'absolute'
            });
            x.addClass("inGraph");
            $("#graph").append(x);

            //JULIET'S ALGORITHM HERE
            availableCourses = $(".draggable.available");
            graphCourses = $(".inGraph");

            availableCourses.draggable({revert: true});
            instance.draggable(graphCourses);
        }
    });

    $(".draggable").bind("mousedown", function () {
        var course = findCourse(catalog, this);
        var description = course.courseInfo;
        var name = course.name;
        var title = course.dept + course.courseNum;
        $("#name").replaceWith("<p id='name'>" + title + "<br>" + name + "</p>");
        $("#courseDescription").replaceWith("<p id='courseDescription'>" + description + "</p>");
    });

    let sourceTarget = [
        {
            source: "COMP123",
            target: "COMP127"
        },
        {
            source: "COMP127",
            target: "COMP128"
        },
        {
            source: "COMP128",
            target: "COMP221"
        },
        {
            source: "MATH279",
            target: "COMP221"
        },
        {
            source: "COMP128",
            target: "COMP240"
        }
    ];

    initializeConnections();
    jsPlumb.fire("jsPlumbDemoLoaded", instance);


    //-----------     HELPER FUNCTIONS     -----------

    //Draw the connections between imported courses.
    function initializeConnections() {
        sourceTarget.forEach((function (entry) {
            instance.connect({
                source: entry.source,
                target: entry.target,
                endpoint: "Blank",
                anchors: [
                    ["Perimeter", {shape: "Diamond", anchorCount: 150}],
                    ["Perimeter", {shape: "Diamond", anchorCount: 150}]
                ]
            })
        }));
    }

    function findCourse(data, course) {
        let ID = course.id;
        for (let object of data) {
            if ((object.dept + object.courseNum) === ID) {
                return object;
            }
        }
    }
});