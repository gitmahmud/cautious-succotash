//alert($("#sbox_3").find(":selected").val());

// parse request params
var q1 = $.url().param('q1');
$('input[name="q1"]').val(q1);
var q2 = $.url().param('q2');
$('input[name="q2"]').val(q2);

var queryParameters = [];
var searchParameters = [];
queryParameters = $.url().param();
var searchLabel = '<b>You have searched for employees ';

for (var key in queryParameters) {

    if (queryParameters.hasOwnProperty(key)) {

        if ($.url().param(key) === '') {
            continue;
        }


        // let queryId = parseInt(key.substring(1));
        // let selectBoxId = 'sbox_' + queryId;
        // //console.log('b Id ' + selectBoxId);
        // let selectedSearch = $("#" + selectBoxId).html();
        // //console.log('S ' + selectedSearch);


        if (key.includes('Skill')) {
            searchParameters.push('knows ' + $.url().param(key));
            searchLabel += 'who knows ' + $.url().param(key);

            $('.background_skill_index_page').css('background-color', 'yellow');
        }
        else if (key.includes('Age')) {
            searchParameters.push('age ' + $.url().param(key));

            searchLabel += 'whose age is ' + $.url().param(key)
            $('.background_birthday_index_page').css('background-color', 'yellow');


        }
        else if (key.includes('Experience')) {
            searchParameters.push('has ' + $.url().param(key) + ' of experience ');

            searchLabel += 'who has ' + $.url().param(key) + ' of experience '
            $('.background_joining_index_page').css('background-color', 'yellow');


        }
        else if (key.includes('Joining')) {
            searchParameters.push('Joined ' + $.url().param(key));
            searchLabel += 'who have joined ' + $.url().param(key);
            $('.background_joining_index_page').css('background-color', 'yellow');

        }
        else {
            searchParameters.push($.url().param(key));
            if (key.includes('Designation')) {
                searchLabel += 'whose designation is ' + $.url().param(key);
                $('.background_designation_index_page').css('background-color', 'yellow');
            }
            else if (key.includes('Department')) {
                searchLabel += 'who is in ' + $.url().param(key) + ' department';
                $('.background_department_index_page').css('background-color', 'yellow');
            }
            else if (key.includes('Major')) {
                searchLabel += 'who have majored in ' + $.url().param(key);
                $('.background_major_index_page').css('background-color', 'yellow');

            }
            else if (key.includes('School')) {
                searchLabel += 'who have studied in ' + $.url().param(key);
                $('.background_school_index_page').css('background-color', 'yellow');


            }
            else if (key.includes('Lives')) {
                searchLabel += 'who lives in ' + $.url().param(key);
                $('.background_city_index_page').css('background-color', 'yellow');
            }
            else if (key.includes('Nationality')) {

                searchLabel += 'who have ' + $.url().param(key) + ' nationality ';
                $('.background_nationality_index_page').css('background-color', 'yellow');


            }
            else if (key.includes('married')) {

                searchLabel += 'who is ' + $.url().param(key);

            }
            else if (key.includes('Project')) {
                searchLabel += 'who works in ' + $.url().param(key);
                $('.background_project_index_page').css('background-color', 'yellow');

            }
            else {
                ;
            }


        }

        searchLabel += ' and ';

    }
}

if (searchLabel.endsWith('and ')) {
    $('#search_result_label').html(searchLabel.substring(0, searchLabel.length - 4) + '.</b>');
}

console.log("aa ", searchParameters);


var emps, arr_task_emp;


$('#free_search_button').on('click', function () {
    let indexSearchLink = 'index.html?';
    let childSize = $('#free_search_group').children().length;
    $('#free_search_group').children().each(function (index) {
        let selectionBox = $(this).children().eq(0).val();
        let inputBox = $(this).children().eq(1).val();
        indexSearchLink += selectionBox + '=' + inputBox;
        //console.log(selectionBox);
        if (index < childSize - 1) {
            indexSearchLink += '&';
        }

    });

    // alert(indexSearchLink);
    window.location.replace(indexSearchLink);

})


function removeUncheckItemsFromEmp() {
    let empArr = [];
    $('.class_payroll_checkbox').each(function () {

        if ($(this).is(':checked')) {
            let arr = $(this).prop('class').split(" ");
            if (arr[arr.length - 1] !== 'class_payroll_id_all') {
                let arr2 = arr[arr.length - 1].split("_");
                empArr.push(parseInt(arr2[arr2.length - 1]));

            }


        }
    });

    console.log(empArr);

    for (let i = 0; i < emps.length; i++) {
        // console.log('index '+ empArr.findIndex(emps[i]["id"]));
        if (empArr.indexOf(emps[i]["id"]) === -1) {
            emps.splice(i, 1);
            i--;

        }
    }

}

function addPayrollModalStart() {
    removeUncheckItemsFromEmp();

    let empLabel = '';
    for (let i = 0; i < emps.length; i++) {
        empLabel += '<img height=40 class="img-circle" src="img/' + emps[i].id + '.jpg">' + emps[i]["name"] + '<br>';

    }
    $('#employee_name_show_add_pay_roll').html(empLabel);

    $('#addPayrollModal').modal('show');


}

function bonusDistributionModalStart() {
    removeUncheckItemsFromEmp();
    let str = '';
    for (let i = 0; i < emps.length; i++) {

        str += '<tr><td><img height=40 class="img-circle" src="img/' + emps[i].id + '.jpg"></td>';
        str += '<td>' + emps[i]["name"] + '</td>';
        str += '<td>' + emps[i]["desgn"] + '</td>';
        str += '<td><input style="width: 50px;" class="input-sm class_bonus_percentage class_bonus_employee_' + emps[i]["id"] + '" type="text" value="0"></td>';
        str += '<td><input class="class_bonus_amount  class_bonus_employee_' + emps[i]["id"] + '" type="number"></td>';
        str += '</tr>';

    }

    //console.log(str , emps);

    $('#tbody_bonus_distribution').html(str);

    $('#modalBonusDistribution').modal('show');


}


function checkAddPayrollValidation() {
    let pay_amount = parseInt($("#id_model_pay_amount").val());
    let pay_name = $("#id_payroll_item").val();
    if(pay_name === '')
    {
        alert("Please provide a payroll name . ");
        return false;
    }

    let bigAmountContinue = true;
    if (pay_amount > 5000 && !pay_name.includes("salary")) {
        bigAmountContinue = confirm("This payroll looks unusaually big . Do you want to continue ?");
        if (!bigAmountContinue) return false;
    }

    let isDeduct = $('#inlineRadio1').is(':checked') !== true;

    if (isDeduct) {
        let maximumDeductable = 99999999;
        for (let i = 0; i < emps.length; i++) {
            let arr = alasql('SELECT type , sum(amount) AS total from payroll where emp= ? group by type', [emps[i]["id"]]);
            if (arr.length === 0) {
                maximumDeductable = 0;

            }
            else if (arr.length === 1) {
                if (arr[0]["type"] === 'plus') {
                    maximumDeductable = arr[0]["total"];
                }
                else {
                    maximumDeductable = 0;
                }

            }
            else {

                maximumDeductable = Math.min(Math.abs(arr[0]["total"] - arr[1]["total"]), maximumDeductable);
            }

        }
        console.log("Max deductable "+maximumDeductable+' pay amount '+pay_amount);
        if (pay_amount > maximumDeductable) {
            alert("You can deduct maximum " + maximumDeductable + " dollar for selected employees . ");
            return false;
        }


    }

    return true;


}

$("#add_payroll_submit").on('click',
    function () {

        if (!checkAddPayrollValidation()) {
            return;
        }

        else {
            $('#addPayrollModal').modal('hide');
        }


        let newPayIds = [];

        let pay_name = $("#id_payroll_item").val();
        let pay_type = $('#inlineRadio1').is(':checked') === true ? "plus" : "minus";


        if ($('#id_modal_select_option').find(":selected").text() === "Payroll Amount") {
            let pay_amount = parseInt($("#id_model_pay_amount").val());
            console.log("pay amount " + pay_amount);
            let taxFlag = false;

            if (pay_name.includes("salary")) {
                taxFlag = confirm("You want to add tax with salary amount ? ");
            }


            for (let i = 0; i < emps.length; i++) {

                let pay_id = alasql("SELECT MAX(id) AS max_id from payroll")[0]["max_id"] + 1;

                alasql('INSERT INTO payroll VALUES(?,?,?,?,?);', [pay_id, emps[i]["id"], pay_name, pay_amount, pay_type]);
                newPayIds.push(pay_id);

                if (taxFlag) {
                    console.log("inserting")
                    let pay_id = alasql("SELECT MAX(id) AS max_id from payroll")[0]["max_id"] + 1;
                    let taxAmount = 0;
                    if (pay_amount > 5000) {
                        taxAmount = 3000 * 0.07 + (pay_amount - 5000) * 0.1;
                    }
                    else if (pay_amount > 2000) {
                        taxAmount = (pay_amount - 2000) * 0.07;
                    }
                    else {
                        taxAmount = 0;
                    }
                    alasql('INSERT INTO payroll VALUES(?,?,?,?,?);', [pay_id, emps[i]["id"], "Tax", taxAmount, 'minus']);
                    newPayIds.push(pay_id);


                }


            }
        }
        else {

            let pay_id = alasql("SELECT MAX(id) AS max_id from payroll")[0]["max_id"] + 1;
            let pay_existing = $('#id_modal_add_pay_item_select').find(":selected").text();
            let percentAmountString = $('#id_modal_input_percentage').val();
            let percentAmount;
            if (percentAmountString.indexOf(".") === -1) {
                percentAmount = parseInt(percentAmountString) / 100;

            }
            else {
                percentAmount = parseFloat(percentAmountString) / 100;

            }
            console.log("Percent Amount " + percentAmount);


            console.log("Percent " + percentAmount);

            for (let i = 0; i < emps.length; i++) {
                let pay_amount = parseFloat((alasql("SELECT amount from payroll where emp= ?  and item= ? ", [emps[i]["id"], pay_existing])[0]["amount"]
                * percentAmount).toFixed(2));
                //alert("pay amount "+pay_amount+" type "+typeof pay_amount);

                alasql("INSERT INTO payroll VALUES(?,?,?,?,?);", [pay_id + i, emps[i]["id"], pay_name, pay_amount, pay_type]);
                newPayIds.push(pay_id + i);

            }


        }


        //alert(pay_name+"\n"+pay_amount+"\n"+pay_type+"\n"+pay_id);
        console.log('new ' + newPayIds);

        generateReportPayroll(newPayIds, 'new');


    }
);


function generateReportPayroll(newIds, pay_label) {
    let str = '';

    for (let i = 0; i < emps.length; i++) {
        let emp = emps[i];

        str += '<tr><td><img height=40 class="img-circle" src="img/' + emp.id + '.jpg"></td>';
        str += '<td>' + emp.name + '</td><td>';

        let pays = alasql("SELECT * FROM payroll WHERE emp=?", [emp.id]);
        let total_pay = 0;
        for (let i = 0; i < pays.length; i++) {
            if (pays[i]["type"] === "plus") {
                total_pay += pays[i]["amount"];

                if (newIds.indexOf(pays[i]["id"]) === -1) {
                    str += pays[i]["item"] + ' :   ' + pays[i]["amount"] + ' <br>';
                }
                else {
                    str += pays[i]["item"] + ' :  ' + pays[i]["amount"] + '<span class="label label-warning">' + pay_label+ '</span> <br>';

                }
            }
            else {
                total_pay -= pays[i]["amount"];

                if (newIds.indexOf(pays[i]["id"]) === -1) {
                    str += pays[i]["item"] + ' :  -' + pays[i]["amount"] + ' <br>';
                }
                else {
                    str += pays[i]["item"] + ' :  -' + pays[i]["amount"] + '<span class="label label-warning">' + pay_label+ '</span> <br>';

                }
            }
        }
        str += '<b>Total : ' + total_pay + '</b></td></tr>';
    }


    $('#tbody_emps_add_payroll_report').html(str);
    if(pay_label === 'new'){

        $('#reportPayTitle').text('Add Payroll changes');
    }
    else
    {
        $('#reportPayTitle').text('Bonus inclusion changes . ');
    }

    $('#showAddPayrollModalReport').modal('show');


}
$('#modal_close_add_payroll').on('click', function () {

    $('#showAddPayrollModalReport').modal('hide');
    window.location.reload(true);
    $("#id_payroll_item").val('');
    $("#id_model_pay_amount").val(0);
    $('#id_modal_select_option').show();

});


$('#button_change_payroll').on('click', function () {
    removeUncheckItemsFromEmp();

    let linkPayroll = "change-payroll.html?p=";

    for (let i = 0; i < emps.length; i++) {
        linkPayroll += emps[i]["id"];
        if (i !== emps.length - 1) {
            linkPayroll += ",";
        }


    }
    // $("#button_change_payroll").attr("href", linkPayroll);

    window.location.replace(linkPayroll);


});

$("#id_skill_sort_btn_asc").on('click', function () {

    arr_task_emp.sort(function (a, b) {
        return a.skill_avg - b.skill_avg;
    });

    empSkillExpSortShow(arr_task_emp);


});

$("#id_skill_sort_btn_desc").on('click', function () {

    arr_task_emp.sort(function (a, b) {
        return -a.skill_avg + b.skill_avg;
    });

    empSkillExpSortShow(arr_task_emp);


});

$('#id_experience_sort_btn_asc').on('click', function () {

    arr_task_emp.sort(function (a, b) {
        return a.joining_time - b.joining_time;
    });

    empSkillExpSortShow(arr_task_emp);

});

$('#id_experience_sort_btn_desc').on('click', function () {

    arr_task_emp.sort(function (a, b) {
        return -a.joining_time + b.joining_time;
    });
    empSkillExpSortShow(arr_task_emp);

});


$("#hide_emp_checkbox").change(function () {
    if ($('#hide_emp_checkbox').prop('checked')) {
        $(' .busy_emp_class ').hide();

    }
    else {
        $(' .busy_emp_class ').show();

    }

});


$("#button_task_next").on('click', function () {
    let str = '';

    let proj_arr = alasql('SELECT * from role_project where type="project"');
    let proj_arr_select = '';
    for (let i = 0; i < proj_arr.length; i++) {
        proj_arr_select += '<option>' + proj_arr[i]["name"] + '</option>';
    }

    $('#id_project_selection').html(proj_arr_select);

    let role_arr = alasql('SELECT * from role_project where type="role"');
    let role_arr_select = '';

    for (let i = 0; i < role_arr.length; i++) {
        role_arr_select += '<option>' + role_arr[i]["name"] + '</option>';
    }


    for (let i = 0; i < arr_task_emp.length; i++) {
        if (arr_task_emp[i]["selectedEmp"]) {

            let indexDesgn = role_arr_select.indexOf(alasql('SELECT desgn from emp where id = ?', [arr_task_emp[i]["emp_id"]])[0]["desgn"]);
            if (indexDesgn >= 0) {
                role_arr_select = role_arr_select.slice(0, indexDesgn - 1) + " selected" + role_arr_select.slice(indexDesgn - 1, role_arr_select.length);
            }

            str +=
                '<tr>' +
                '<td>' + arr_task_emp[i]["name"] + '</td>' +
                '<td>' +
                '<select class="class_select_checkbox_role class_assign_employee_' + arr_task_emp[i]["emp_id"] + '">' + role_arr_select + '</select>' +
                '</td><td>' +
                '<div class="form-group">' +
                '<textarea class="form-control class_select_description_role class_assign_employee_' + arr_task_emp[i]["emp_id"] + '"  rows="4"></textarea>' +

                '</div></td>' +
                '<td><input class="class_employee_start_date class_assign_employee_'+ arr_task_emp[i]["emp_id"] + '" type="date"></td>'+
                '<td><input class="class_employee_end_date class_assign_employee_'+ arr_task_emp[i]["emp_id"] + '" type="date"></td>'+
                '</tr>'
        }
    }

    $("#tbody_assign_role").html(str);

});


$('#modal_add_task_finish').on('click', function () {

    if(!validateAssignDate()){
        alert("Error . Start date is greater than end date!");
        return ;
    }

    let proj_name = $('#id_project_selection').find(":selected").text();
    for (let i = 0; i < arr_task_emp.length; i++) {
        if (arr_task_emp[i]["selectedEmp"]) {

            let currentRole = $('.class_select_checkbox_role.class_assign_employee_' + arr_task_emp[i]["emp_id"]).find(":selected").text();
            let currentDescription = $('.class_select_description_role.class_assign_employee_' + arr_task_emp[i]["emp_id"]).val();

            let currentStartDate = $('.class_employee_start_date.class_assign_employee_'+ arr_task_emp[i]["emp_id"]).val()+'';
            let currentEndDate = $('.class_employee_end_date.class_assign_employee_'+ arr_task_emp[i]["emp_id"]).val()+'';

            console.log(currentEndDate + ' '+currentStartDate);

            // if(alasql('SELECT * from project where emp=?',[arr_task_emp[i]["emp_id"]]).length !== 0 ) {
            //
            //    alasql('UPDATE project SET name = ? , role= ? , description = ? WHERE emp=?',[proj_name , currentRole,currentDescription , arr_task_emp[i]["emp_id"]]);
            // }
            // else
            // {
            let row_id = alasql('SELECT MAX(id)+1 AS row_id from project')[0]['row_id'];
            alasql('INSERT INTO project VALUES(?,?,?,?,?,?,?,?);', [row_id, arr_task_emp[i]["emp_id"], proj_name, currentRole, currentDescription, new Date().getTime() ,currentStartDate, currentEndDate ]);

            //}

        }

    }


    window.location.reload(true);


});

function validateAssignDate() {
    for(let i = 0 ; i<arr_task_emp.length ; i++)
    {
        if (arr_task_emp[i]["selectedEmp"]) {
            let currentStartDate = $('.class_employee_start_date.class_assign_employee_'+ arr_task_emp[i]["emp_id"]).val();
            let currentEndDate = $('.class_employee_end_date.class_assign_employee_'+ arr_task_emp[i]["emp_id"]).val();

            if(currentStartDate > currentEndDate)
            {

                return false;
            }


        }


    }

    return true;

}


//console.log("q1 "+q1+" q2 "+q2+" q3 "+q3+" q4 "+q4+" q5 "+q5);
var directSearchJson = JSON.parse(localStorage.getItem("directSearchJson"));


if (searchParameters.length > 0) {
    emps = alasql('SELECT * FROM emp', []);


    for (let i = 0; i < searchParameters.length; i++) {

        let query = searchParameters[i];

        let tempEmps = parseSearchString(query);
        if (tempEmps === undefined) {
            tempEmps = [];
        }

        console.log(tempEmps);


        for (let i = 0; i < emps.length; i++) {
            let isFound = false;
            for (let j = 0; j < tempEmps.length; j++) {
                if (emps[i]["id"] === tempEmps[j]["id"]) {
                    isFound = true;
                    break;
                }
            }
            if (!isFound) {
                emps.splice(i, 1);
                i--;
            }
        }

    }


    let arr_pay_items = [];
    let first_items = alasql("SELECT * from payroll where emp = " + emps[0]["id"]);
    for (let i = 0; i < first_items.length; i++) {
        arr_pay_items.push(first_items[i]["item"]);
    }

    for (let i = 1; i < emps.length; i++) {
        let otherItems = alasql("SELECT * from payroll where emp = " + emps[i]["id"]);

        let temp_pay_items = [];
        for (let j = 0; j < otherItems.length; j++) {
            temp_pay_items.push(otherItems[j]["item"]);
        }

        for (let j = 0; j < arr_pay_items.length; j++) {
            if (temp_pay_items.indexOf(arr_pay_items[j]) === -1) {
                arr_pay_items.splice(j, 1);
                j--;
            }

        }

    }

    let selectStr = '';
    for (let i = 0; i < arr_pay_items.length; i++) {
        selectStr += '<option>' + arr_pay_items[i] + '</option>';

    }
    $("#id_modal_add_pay_item_select").append(selectStr);

    console.log('arr ' + arr_pay_items);

    //
    let arr_skill_sorted, arr_experience_sorted;

    arr_task_emp = [];
    let join_time_per_level = alasql('SELECT ? - MIN(joining) AS max_join_time from professional ', [new Date().getTime()])[0]["max_join_time"] / 3;
    console.log(join_time_per_level + typeof join_time_per_level);


    for (let i = 0; i < emps.length; i++) {
        let skill_avg = alasql("SELECT avg(rating) AS point from skill where emp=?", [emps[i]["id"]])[0]["point"];
        let skill_level, skill_bg_color;
        if (skill_avg > 4) {
            skill_level = 'Advanced';
            skill_bg_color = "bg-success text-white";

        }
        else if (skill_avg > 3) {
            skill_level = 'Intermediate';
            skill_bg_color = "bg-info text-white";

        }
        else {
            skill_level = 'Basic';
            skill_bg_color = "bg-warning text-white";
        }

        let joining_time = alasql("SELECT ? - joining  AS current_join from professional where emp = ?", [new Date().getTime(), emps[i]["id"]])[0]["current_join"];
        let join_level, join_bg_color;

        console.log(emps[i]["id"] + " " + joining_time);

        if (joining_time > 2 * join_time_per_level) {
            join_level = 'Veteran';
            join_bg_color = "bg-success text-white";

        }
        else if (joining_time > join_time_per_level) {
            join_level = 'Senior';
            join_bg_color = "bg-info text-white";
        }
        else {
            join_level = 'Junior';
            join_bg_color = "bg-warning text-white";
        }

        let isBusy = alasql('SELECT * from project where emp=?', [emps[i]["id"]]).length !== 0;

        arr_task_emp.push(
            {
                "emp_id": emps[i]["id"],
                "name": emps[i]["name"],
                "skill_level": skill_level,
                "experience": join_level,
                "skill_bg_color": skill_bg_color,
                "join_bg_color": join_bg_color,
                "skill_avg": skill_avg,
                "joining_time": joining_time,
                "is_busy": isBusy,
                "selectedEmp": false
            }
        );

    }

    arr_task_emp.sort(function (a, b) {
        return -a.skill_avg + b.skill_avg;
    });

    empSkillExpSortShow(arr_task_emp);


}
else {
    console.log("q1");


    if (q1) {
        emps = alasql('SELECT * FROM emp WHERE number LIKE ?', ['%' + q1 + '%']);
    } else if (q2) {
        emps = alasql('SELECT * FROM emp WHERE name LIKE ?', ['%' + q2 + '%']);
    }

    else {
        emps = alasql('SELECT * FROM emp', []);
    }


}

console.log(emps);

// create employee list
var tbody = $('#tbody-emps');
for (var i = 0; i < emps.length; i++) {


    var emp = emps[i];
    let temp = alasql("SELECT * from skill where emp=" + emp.id);

    let skills = "<ul>";
    for (let ii = 0; ii < temp.length; ii++) {
        skills += "<li>" + temp[ii]["name"] + "</li>";
    }
    skills += '</ul>';

    temp = alasql("SELECT * from project where emp=" + emp.id);
    let projects = "<ol>";
    for (let ii = 0; ii < temp.length; ii++) {
        projects += "<li>" + temp[ii]["name"] + "</li>";
    }
    projects += "</ol>";

    temp = alasql("SELECT * from professional where emp=" + emp.id)[0];
    let joining = getDateFromMS(temp.joining);
    let nationality = temp.nationality;
    let city_name = alasql("SELECT *  from addr where emp =" + emp.id)[0]["city"];


    temp = alasql("SELECT *  from edu where emp = " + emp.id);
    let major_name = temp.length === 0 ? '' : temp[0]["major"];
    let school_name = temp.length === 0 ? '' : temp[0]["school"];


    temp = alasql("SELECT *  from payroll where emp =" + emp.id);

    let payroll_names = "<ul>";
    for (let ii = 0; ii < temp.length; ii++) {
        payroll_names += "<li>" +temp[ii]["item"] + " : <b>" + temp[ii]["amount"] + "</b></li>"
    }
    payroll_names += '</ul';



    var tr = $('<tr></tr>');
    tr.append('<td><input type="hidden" class=" class_payroll_checkbox class_payroll_id_' + emp.id + '"></td>');
    tr.append('<td><img height=40 class="img-circle" src="img/' + emp.id + '.jpg"></td>');
    tr.append('<td><a href="emp.html?id=' + emp.id + '">' + emp.name + '</a></td>');
    tr.append('<td class="background_department_index_page">' + emp.dept + '</td>');
    tr.append('<td class="background_designation_index_page">' + emp.desgn + '</td>');
    tr.append('<td class="background_joining_index_page">' + joining + '</td>');
    tr.append('<td class="background_skill_index_page">' + skills + '</td>');
    tr.append('<td class="background_project_index_page">' + projects + '</td>');
    tr.append('<td class="background_nationality_index_page">' + nationality + '</td>');
    tr.append('<td class="background_city_index_page">' + city_name + '</td>');
    tr.append('<td class="background_school_index_page">' + school_name + '</td>');
    tr.append('<td class="background_major_index_page" >' + major_name + '</td>');
    tr.append('<td class="background_payroll_index_page">' + payroll_names + '</td>');
    tr.append('<td class="background_birthday_index_page">' + emp.birthday + '</td>');
    tr.appendTo(tbody);
}
$('#search_result_label').append('<b>Total result found : '+emps.length+'</b>');


markSearchFields();

function markSearchFields() {
    for (var key in queryParameters) {

        if (queryParameters.hasOwnProperty(key)) {

            if ($.url().param(key) === '') {
                continue;
            }


            if (key.includes('Skill')) {

                $('.background_skill_index_page').css('background-color', 'yellow');
            }
            else if (key.includes('Age')) {

                $('.background_birthday_index_page').css('background-color', 'yellow');
            }
            else if (key.includes('Experience')) {

                $('.background_joining_index_page').css('background-color', 'yellow');
            }
            else if (key.includes('Joining')) {
                $('.background_joining_index_page').css('background-color', 'yellow');

            }
            else if (key.includes('Designation')) {
                $('.background_designation_index_page').css('background-color', 'yellow');
            }
            else if (key.includes('Department')) {
                $('.background_department_index_page').css('background-color', 'yellow');
            }
            else if (key.includes('Major')) {
                $('.background_major_index_page').css('background-color', 'yellow');

            }
            else if (key.includes('School')) {
                $('.background_school_index_page').css('background-color', 'yellow');

            }
            else if (key.includes('Lives')) {

                $('.background_city_index_page').css('background-color', 'yellow');
            }
            else if (key.includes('Nationality')) {
                $('.background_nationality_index_page').css('background-color', 'yellow');
            }

            else if (key.includes('Project')) {
                $('.background_project_index_page').css('background-color', 'yellow');
            }
            else {
                ;
            }


        }


    }

}
function parseSearchString(str) {
    console.log("str " + str);

    //First -> Direct Search


    if (directSearchJson[str] !== undefined) {
        let sqlStr = 'SELECT * from ' + directSearchJson[str]["table"] + " where " + directSearchJson[str]["type"] + " LIKE  ?";
        console.log("//" + sqlStr);

        if (directSearchJson[str]["table"] === "emp") {
            return alasql('SELECT * from ' + directSearchJson[str]["table"] + " where " + directSearchJson[str]["type"] + " LIKE  ?", ['%' + str + '%']);
        }
        else {
            return alasql('SELECT emp AS id from ' + directSearchJson[str]["table"] + " where " + directSearchJson[str]["type"] + " LIKE  ?", ['%' + str + '%']);
        }

    }
    else {
        if (str.startsWith("Joined") || str.startsWith("has")) {

            let arr = str.split(' ');
            console.log(arr);
            if (arr[arr.length - 1] === 'today') {
                let d = new Date();
                d.setHours(0, 0, 0, 0);
                console.log("D " + d.getTime());
                return alasql('SELECT emp from professional where joining >= ' + d.getTime());

            }


            if (arr[arr.length - 1] === "week") {
                if (arr[1] === 'this') {
                    console.log("Joined this week . ");
                    let d = new Date();
                    d.setMilliseconds(d.getMilliseconds() - d.getDay() * 24 * 3600 * 1000);
                    d.setHours(0, 0, 0, 0);
                    return alasql("SELECT * from professional where joining >=" + d.getTime());

                }
                else {
                    console.log("Joined last week.");
                    let d = new Date();
                    let dd = new Date();
                    d.setMilliseconds(d.getMilliseconds() - (d.getDay() + 7) * 24 * 3600 * 1000);
                    d.setHours(0, 0, 0, 0);
                    dd.setMilliseconds(dd.getMilliseconds() - dd.getDay() * 24 * 3600 * 1000);
                    dd.setHours(0, 0, 0, 0);
                    return alasql("SELECT * from professional where joining >=" + d.getTime() + " and joining <" + dd.getTime());

                }
            }

            if (arr[arr.length - 1] === "month") {
                if (arr[1] === 'this') {
                    console.log("Joined this month . ");
                    let d = new Date();
                    d.setDate(1);
                    d.setHours(0, 0, 0, 0);
                    return alasql("SELECT * from professional where joining >=" + d.getTime());


                }
                else {
                    console.log("Joined last month.");
                    let d = new Date();
                    let dd = new Date();
                    d.setMonth(d.getMonth() - 1);
                    d.setHours(0, 0, 0, 0);
                    dd.setDate(1);
                    dd.setHours(0, 0, 0, 0);
                    return alasql("SELECT * from professional where joining >=" + d.getTime() + " and joining <" + dd.getTime());

                }
            }

            if (arr[arr.length - 1] === "ago") {
                console.log("Joined within ? months ago ");
                let noMonths = parseInt(arr[2]);
                let d = new Date();
                d.setMonth(d.getMonth() - noMonths);
                d.setHours(0, 0, 0, 0);
                return alasql("SELECT * from professional where joining >=" + d.getTime());

            }
            if (arr[0] === "has") {
                console.log("has ? years of experience.");
                let noYears = parseInt(arr[1]);

                let d = new Date();

                d.setFullYear(d.getFullYear() - noYears);
                d.setHours(0, 0, 0, 0);
                console.log("D " + d.getTime());

                return alasql("SELECT * from professional where joining <=" + d.getTime());

            }


        }

        if (str.startsWith("age")) {
            let arr = str.split(' ');
            console.log(arr);


            if (arr[arr.length - 1] === "older" || arr[arr.length - 1] === "younger") {
                let age = parseInt(arr[1]);
                let d = new Date();
                //let dd = "";
                d.setFullYear(d.getFullYear() - age);
                // dd += d.getFullYear()+"-"
                // 	+(d.getMonth() >= 9 ? d.getMonth()+1 : '0'+(d.getMonth()+1) )+"-"
                // 							+(d.getDate() >= 10 ? d.getDate() :'0'+d.getDate());

                let dd = d.toISOString().slice(0, 10);


                if (arr[arr.length - 1] === "older") {
                    console.log("age ? years or older");
                    console.log("Birth Year before " + dd);
                    return alasql("SELECT * from emp where birthday <=\"" + dd + "\"");

                }
                else {
                    console.log("age ? years or younger ");
                    console.log("Birth Year after " + dd);
                    return alasql("SELECT * from emp where birthday >=\"" + dd + "\"");


                }

            }
            else {
                let lowAge = parseInt(arr[1]);
                let highAge = parseInt(arr[3]);

                let dLow = new Date();
                let dHigh = new Date();

                dLow.setFullYear(dLow.getFullYear() - lowAge);
                dHigh.setFullYear(dHigh.getFullYear() - highAge);

                let ddLow = dLow.toISOString().slice(0, 10);
                let ddHigh = dHigh.toISOString().slice(0, 10);

                console.log("age ? - ? year");
                console.log("From " + ddHigh + " ~ " + ddLow);

                return alasql("SELECT * from emp where birthday >=\"" + ddHigh + "\" and birthday <= \"" + ddLow + "\"");

            }


        }
        if (str.startsWith("knows")) {
            let arr = str.split(' ');

            console.log(arr);

            arr.splice(0, 1);
            let empSkilled = alasql("SELECT distinct emp from skill");

            for (let i = 0; i < arr.length; i++) {
                if (arr[i] !== ",") {
                    let tempSkilled = alasql("SELECT distinct emp from skill where name = \"" + arr[i] + "\"");

                    for (let j = 0; j < empSkilled.length; j++) {
                        let isFound = false;
                        for (let k = 0; k < tempSkilled.length; k++) {
                            if (empSkilled[j]["emp"] === tempSkilled[k]["emp"]) {
                                empSkilled[j]["id"] = empSkilled[j]["emp"];
                                isFound = true;
                                break;
                            }
                        }
                        if (!isFound) {
                            empSkilled.splice(j, 1);
                            j--;
                        }
                    }

                }
            }


            console.log(empSkilled);

            return empSkilled;


        }
        if (str.includes("married")) {
            if (str.includes("unmarried")) {
                let married_arr = alasql("SELECT distinct emp from family where relation = 'Wife' or relation = 'Husband' ");
                let all_emp = alasql("SELECT * from emp");

                for (let i = 0; i < married_arr.length; i++) {
                    for (let j = 0; j < all_emp.length; j++) {
                        if (married_arr[i]["emp"] === all_emp[j]["id"]) {
                            all_emp.splice(j, 1);
                            break;
                        }


                    }
                }
                console.log("unmarried");
                return all_emp;

            }
            if (str.includes("no")) {
                let hasChildren = alasql("SELECT distinct emp AS id from family where relation='Daughter' or relation='Son' ");
                let isMarried = alasql("SELECT distinct emp AS id from family where relation='Husband' or relation= 'Wife' ");

                for (let i = 0; i < isMarried.length; i++) {
                    for (let j = 0; j < hasChildren.length; j++) {
                        if (isMarried[i]["id"] === hasChildren[j]["id"]) {
                            isMarried.splice(i, 1);
                            i--;
                            break;
                        }
                    }
                }
                console.log("no children " + hasChildren.length)
                console.log("married and has no children . ", isMarried.length);

                return isMarried;

            }
            else {
                let hasChildren = alasql("SELECT distinct emp AS id from family where relation='Daughter' or relation='Son' ");

                console.log("married and has children .");

                return hasChildren;


            }


        }


    }


}

function empSkillExpSortShow(arr_task_emp) {
    let repStr = '';
    for (let i = 0; i < arr_task_emp.length; i++) {
        let row_name_emp = "class_task_row_" + arr_task_emp[i]["emp_id"];
        let empBusyClass = arr_task_emp[i]["is_busy"] ? ' busy_emp_class ' : 'free_emp_class';
        let checkboxText = arr_task_emp[i]["selectedEmp"] ? 'checked' : '';
        let expereicneTooltipLabel = Math.floor(arr_task_emp[i]["joining_time"]/31536000000) === 0 ? 'Experience : Less than a year . ': 'Experience : '+Math.floor(arr_task_emp[i]["joining_time"]/31536000000)+' years.';

        console.log( arr_task_emp[i]["joining_time"]);

        repStr +=
            '<tr class="' + empBusyClass + '">' +
            '<td class="col-sm-1"><input type="checkbox" class=" class_task_checkbox ' + row_name_emp + ' " ' + checkboxText + ' ></td>' +
            '<td class="col-lg-3">' + arr_task_emp[i]["name"] + '</td>' +
            '<td class="col-sm-2 ' + arr_task_emp[i]["skill_bg_color"] + ' " >' + arr_task_emp[i]["skill_level"] + ' (<b>'+arr_task_emp[i]["skill_avg"].toFixed(2)+'</b>)</td>' +
            '<td class="col-sm-2 ' + arr_task_emp[i]["join_bg_color"] + ' " data-toggle="tooltip" data-placement="top" title="'+expereicneTooltipLabel+'">'+arr_task_emp[i]["experience"]+'</td>' +

            '</tr>';
    }

    $('#tbody_emp_skill_exp').html(repStr);

    $(' .class_task_checkbox ').change(function () {
        console.log("Clck");
        let arr = $(this).attr("class").split(",");
        let arr2 = arr[arr.length - 1].split("_");
        let emp_id = parseInt(arr2[arr2.length - 1]);


        if ($(this).prop('checked')) {
            console.log("Selected  " + emp_id);

            for (let i = 0; i < arr_task_emp.length; i++) {
                if (arr_task_emp[i]["emp_id"] === emp_id) {
                    arr_task_emp[i]["selectedEmp"] = true;
                    break;
                }

            }

        }
        else {
            console.log("UnSelected  " + emp_id);
            $(this).prop('checked', false);

            for (let i = 0; i < arr_task_emp.length; i++) {
                if (arr_task_emp[i]["emp_id"] === emp_id) {
                    arr_task_emp[i]["selectedEmp"] = false;
                    break;
                }

            }

        }
        console.log(arr_task_emp);


    });


}
function getDateFromMS(r) {
    let t = new Date(r);
    return t.getFullYear() + "/" + (t.getMonth() + 1) + "/" + t.getDate();

}


function bonusDistributionOptionChange() {


    let totalBonusAmount = parseInt($('#id_bonus_total_amount_input').val());
    console.log(totalBonusAmount);

    $('#bonus_remaining_notification').text('');

    setDefaultBonusValues();


    console.log($(this));


    if ($('#id_bonus_distribution_select').find(":selected").text() === 'Distribute evenly') {


        console.log('hhh');
        $('.class_bonus_percentage').hide();
        $('.class_bonus_title_percentage').text('');

        let individualAmount = parseFloat(totalBonusAmount / emps.length).toFixed(2);
        console.log(individualAmount);
        for (let i = 0; i < emps.length; i++) {
            let empId = emps[i]["id"];

            $('.class_bonus_amount.class_bonus_employee_' + empId).val(individualAmount);

        }
        $('.class_bonus_amount').unbind('keyup');
        $('.class_bonus_amount').keyup(checkTotalAmountSum);

    }
    else if ($('#id_bonus_distribution_select').find(":selected").text() === 'Distribute by ratio') {
        $('#bonus_remaining_notification').text('');

        $('.class_bonus_percentage').show();
        $('.class_bonus_title_percentage').text('Ratio');

        $('.class_bonus_percentage').keyup(function (event) {

            if (event.which == 13) {
                event.preventDefault();
            }


            let totalRatio = 0;
            let totalBonusAmount = parseInt($('#id_bonus_total_amount_input').val());


            for (let i = 0; i < emps.length; i++) {
                let empId = emps[i]["id"];
                totalRatio += parseFloat($('.class_bonus_percentage.class_bonus_employee_' + empId).val());

            }
            for (let i = 0; i < emps.length; i++) {
                let empId = emps[i]["id"];
                let individualAmount = ((parseInt($('.class_bonus_percentage.class_bonus_employee_' + empId).val()) * totalBonusAmount) / totalRatio).toFixed(2);

                $('.class_bonus_amount.class_bonus_employee_' + empId).val(individualAmount);

            }


        });

    }
    else if ($('#id_bonus_distribution_select').find(":selected").text() === 'Distribute by percentage') {
        $('#bonus_remaining_notification').text('');
        $('.class_bonus_percentage').show();
        $('.class_bonus_title_percentage').text('Percentage');
        $('.class_bonus_percentage').keyup(function (event) {

            if (event.which == 13) {
                event.preventDefault();
            }


            if (parseFloat($(this).val()) > 100) {
                alert("Percentage must be less than or equal to 100 . ");
                return;

            }

            let totalPercentageSummation = 0;


            for (let i = 0; i < emps.length; i++) {
                let empId = emps[i]["id"];
                totalPercentageSummation += parseInt($('.class_bonus_percentage.class_bonus_employee_' + empId).val());

            }
            if (totalPercentageSummation > 100) {
                let arr = $(this).attr('class').split(' ');
                let arr2 = arr[arr.length - 1].split('_');
                let targetId = parseInt(arr2[arr2.length - 1]);

                for (let i = 0; i < emps.length; i++) {
                    if (emps[i].id !== targetId) {
                        $('.class_bonus_percentage.class_bonus_employee_' + emps[i]["id"]).val(0);

                    }

                }

            }

            for (let i = 0; i < emps.length; i++) {
                let empId = emps[i]["id"];
                let individualAmount = ((parseFloat($('.class_bonus_percentage.class_bonus_employee_' + empId).val()) * totalBonusAmount) / 100).toFixed(2);

                $('.class_bonus_amount.class_bonus_employee_' + empId).val(individualAmount);

            }

            setRemainingBudgetLabel();

        });
    }
    else if ($('#id_bonus_distribution_select').find(":selected").text() === 'Distribute manually') {

        $('.class_bonus_percentage').hide();
        $('.class_bonus_title_percentage').text('');


        $('.class_bonus_amount').unbind('keyup');
        $('.class_bonus_amount').keyup(checkTotalAmountSum);


    }
    else {
        console.log('else');
        ;
    }


}
$('#id_bonus_distribution_select').change(bonusDistributionOptionChange);

$('#bonus_distribution_submission').on('click', function () {

    if ($('#id_bonus_name_input').val() === '') {
        alert("Enter valid bonus name . ");
        return;
    }

    if (!setRemainingBudgetLabel()) {
        alert("Please fix employee bonus amount or total budget amount");
        return;
    }


    $('#modalBonusDistribution').hide();

    let pay_name = $('#id_bonus_name_input').val();

    let newPayIds = [];

    for (let i = 0; i < emps.length; i++) {


        let pay_id = alasql("SELECT MAX(id) AS max_id from payroll")[0]["max_id"] + 1;
        let pay_amount = $('.class_bonus_amount.class_bonus_employee_' + emps[i]["id"]).val();
        alasql("INSERT INTO payroll VALUES(?,?,?,?,?);", [pay_id, emps[i]["id"], pay_name, pay_amount, 'plus']);
        newPayIds.push(pay_id);

    }

    generateReportPayroll(newPayIds, 'bonus');


});
$('#id_bonus_total_amount_input').keyup(bonusDistributionOptionChange);
function checkTotalAmountSum(event) {
    if (event.which == 13) {
        event.preventDefault();
    }
    setRemainingBudgetLabel();


}

function setRemainingBudgetLabel() {
    let totalBonusAmount = parseInt($('#id_bonus_total_amount_input').val());
    let totalSum = 0;

    for (let i = 0; i < emps.length; i++) {
        totalSum += parseFloat($('.class_bonus_amount.class_bonus_employee_' + emps[i]["id"]).val());


    }

    let remaining = parseFloat((totalBonusAmount - totalSum).toFixed(2));
    console.log(remaining);

    if (remaining < -0.001) {
        alert("Total employee bonus exceeds bonus budget . ");
        $('#bonus_remaining_notification').html('<span style="color: red" > Remaining budget is ' + remaining + '</span>');
        return false;

    }
    else {

        $('#bonus_remaining_notification').html('<span style="color: green"> Remaining budget is ' + remaining + '</span>');
        return true;
    }


}

function setDefaultBonusValues() {

    for (let i = 0; i < emps.length; i++) {
        $('.class_bonus_amount.class_bonus_employee_' + emps[i]["id"]).val(0);
        $('.class_bonus_percentage.class_bonus_employee_' + emps[i]["id"]).val(0);


    }

}

