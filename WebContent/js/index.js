
//alert($("#sbox_3").find(":selected").val());

// parse request params
var q1 = $.url().param('q1');
$('input[name="q1"]').val(q1);
var q2 = $.url().param('q2');
$('input[name="q2"]').val(q2);

var queryParameters = [];
var searchParameters = [];
queryParameters = $.url().param();

for(var key in queryParameters){

	if(queryParameters.hasOwnProperty(key)){

		let queryId = parseInt(key.substring(1));
		let selectBoxId = 'sbox_' + queryId ;
		console.log('b Id '+selectBoxId);
		let selectedSearch = $("#"+selectBoxId).find(":selected").val() ;
		console.log('S ' +selectedSearch);

		if(selectedSearch  === 'Skill')
		{
			searchParameters.push('knows '+ $.url().param('q'+queryId) ) ;
		}
		else if(selectedSearch === 'Age')
		{
            searchParameters.push('age '+ $.url().param('q'+queryId) ) ;

		}
		else if(selectedSearch === 'Experience')
		{
            searchParameters.push('has '+ $.url().param('q'+queryId) +' of experience ') ;

		}
		else if(selectedSearch === 'Joining Date')
		{
            searchParameters.push('Joined '+ $.url().param('q'+queryId) ) ;
		}
		else
		{
            searchParameters.push($.url().param('q'+queryId) ) ;

		}



    }
}

console.log("aa ",searchParameters);





var emps , arr_task_emp;





$("#add_payroll_submit").on('click',
	function () {

	let pay_name = $("#id_payroll_item").val();
	let pay_type = $('#inlineRadio1').is(':checked') === true ? "plus" : "minus" ;


	if($('#id_modal_select_option').find(":selected").text() === "Payroll Amount"){
        let pay_amount = parseInt($("#id_model_pay_amount").val());
        console.log("pay amount "+pay_amount);


        let pay_id = alasql("SELECT MAX(id) AS max_id from payroll")[0]["max_id"] +1;

        for(let i =0;i<emps.length ; i++) {

            alasql('INSERT INTO payroll VALUES(?,?,?,?,?);', [pay_id+i , emps[i]["id"] , pay_name,pay_amount,pay_type]);

        }
	}
	else
	{

        let pay_id = alasql("SELECT MAX(id) AS max_id from payroll")[0]["max_id"] +1;
        let pay_existing = $('#id_modal_add_pay_item_select').find(":selected").text() ;
        let percentAmountString = $('#id_modal_input_percentage').val();
        let percentAmount;
        if(percentAmountString.indexOf(".") === -1 )
		{
			percentAmount = parseInt(percentAmountString)/100;

		}
		else
		{
            percentAmount = parseFloat(percentAmountString)/100;

		}
		console.log("Percent Amount "+percentAmount);


        console.log("Percent "+percentAmount);

        for(let i =0;i<emps.length ;i++)
		{
			let pay_amount = parseFloat((alasql("SELECT amount from payroll where emp= ?  and item= ? ", [ emps[i]["id"],pay_existing ] )[0]["amount"]
								* percentAmount).toFixed(2)) ;
            //alert("pay amount "+pay_amount+" type "+typeof pay_amount);

			alasql("INSERT INTO payroll VALUES(?,?,?,?,?);",[ pay_id+i , emps[i]["id"] , pay_name , pay_amount , pay_type ]);

		}



	}



	//alert(pay_name+"\n"+pay_amount+"\n"+pay_type+"\n"+pay_id);

       window.location.reload(true);
        $("#id_payroll_item").val('');
        $("#id_model_pay_amount").val(0);
        $('#id_modal_select_option').show();





    }

);

$("#id_skill_sort_btn_asc").on('click',function () {

    arr_task_emp.sort(function (a, b) {
        return a.skill_avg - b.skill_avg;
    });

    empSkillExpSortShow(arr_task_emp);


});

$("#id_skill_sort_btn_desc").on('click',function () {

    arr_task_emp.sort(function (a, b) {
        return -a.skill_avg + b.skill_avg;
    });

    empSkillExpSortShow(arr_task_emp);


});

$('#id_experience_sort_btn_asc').on('click',function () {

    arr_task_emp.sort(function (a, b) {
        return a.joining_time - b.joining_time;
    });

    empSkillExpSortShow(arr_task_emp);

});

$('#id_experience_sort_btn_desc').on('click',function () {

    arr_task_emp.sort(function (a, b) {
        return -a.joining_time + b.joining_time;
    });
    empSkillExpSortShow(arr_task_emp);

});




$("#hide_emp_checkbox").change(function () {
    if($('#hide_emp_checkbox').prop('checked')){
    	$(' .busy_emp_class ').hide();

	}
	else
	{
        $(' .busy_emp_class ').show();

	}

});


$("#button_task_next").on('click',function () {
	let str = '';

	let proj_arr = alasql('SELECT * from role_project where type="project"');
	let proj_arr_select = '';
	for(let i = 0; i<proj_arr.length ; i++)
	{
		proj_arr_select += '<option>'+proj_arr[i]["name"]+'</option>';
	}

	$('#id_project_selection').html(proj_arr_select);

	let role_arr = alasql('SELECT * from role_project where type="role"');
	let role_arr_select ='';

    for(let i = 0; i<role_arr.length ; i++)
    {
        role_arr_select += '<option>'+role_arr[i]["name"]+'</option>';
    }



	for(let i =0; i<arr_task_emp.length ; i++)
	{
		if(arr_task_emp[i]["selectedEmp"] ){

            let indexDesgn = role_arr_select.indexOf(alasql('SELECT desgn from emp where id = ?',[arr_task_emp[i]["emp_id"]])[0]["desgn"]);
            if(indexDesgn >= 0 ) {
                role_arr_select = role_arr_select.slice(0, indexDesgn - 1) + " selected" + role_arr_select.slice(indexDesgn - 1, role_arr_select.length);
            }

			str+=
			'<tr>'+
				'<td>'+arr_task_emp[i]["name"]+'</td>'+
				'<td>'+
				'<select class="class_select_checkbox_role class_assign_employee_'+arr_task_emp[i]["emp_id"]+'">'+role_arr_select	+'</select>'+
				'</td><td>'+
            '<div class="form-group">'+
            '<textarea class="form-control class_select_description_role class_assign_employee_'+arr_task_emp[i]["emp_id"]+'"  rows="4"></textarea>'+
			'</div></td>'+
			'</tr>'
		}
	}

	$("#tbody_assign_role").html(str);

});


$('#modal_add_task_finish').on('click' , function () {
	let proj_name = $('#id_project_selection').find(":selected").text();
	for(let i =0; i <arr_task_emp.length ; i++)
	{
		if(arr_task_emp[i]["selectedEmp"]){

			let currentRole = $('.class_select_checkbox_role.class_assign_employee_'+arr_task_emp[i]["emp_id"]).find(":selected").text();
			let currentDescription = $('.class_select_description_role.class_assign_employee_'+arr_task_emp[i]["emp_id"]).val();

			// if(alasql('SELECT * from project where emp=?',[arr_task_emp[i]["emp_id"]]).length !== 0 ) {
            //
             //    alasql('UPDATE project SET name = ? , role= ? , description = ? WHERE emp=?',[proj_name , currentRole,currentDescription , arr_task_emp[i]["emp_id"]]);
            // }
            // else
			// {
			let row_id = alasql('SELECT MAX(id)+1 AS row_id from project')[0]['row_id'];
			alasql('INSERT INTO project VALUES(?,?,?,?,?,?);', [row_id, arr_task_emp[i]["emp_id"], proj_name, currentRole, currentDescription,new Date().getTime()]);

			//}

		}

	}


window.location.reload(true);




});







//console.log("q1 "+q1+" q2 "+q2+" q3 "+q3+" q4 "+q4+" q5 "+q5);
var directSearchJson = JSON.parse(localStorage.getItem("directSearchJson"));




if(searchParameters.length > 0 ) {
    emps = alasql('SELECT * FROM emp', []);


    for(let i = 0;i<searchParameters.length ; i++) {

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


	let linkPayroll = "change-payroll.html?p=";

	for(let i =0;i<emps.length ; i++)
	{
		linkPayroll += emps[i]["id"];
		if(i !== emps.length - 1)
		{
			linkPayroll += ",";
		}


	}
    $("#button_change_payroll").attr("href",linkPayroll);


	let arr_pay_items = [];
	let first_items = alasql("SELECT * from payroll where emp = "+emps[0]["id"]);
	for(let i =0;i<first_items.length ; i++)
	{
		arr_pay_items.push(first_items[i]["item"]);
	}

	for(let i = 1 ; i<emps.length;i++)
	{
		let otherItems = alasql("SELECT * from payroll where emp = "+emps[i]["id"]);

		let temp_pay_items = [];
		for(let j = 0 ;j<otherItems.length ; j++)
		{
			temp_pay_items.push(otherItems[j]["item"]);
		}

		for(let j = 0;j<arr_pay_items.length ; j++)
		{
			if(temp_pay_items.indexOf(arr_pay_items[j]) === -1)
			{
				arr_pay_items.splice(j,1);
				j--;
			}

		}

	}

	let selectStr = '';
	for(let i =0;i<arr_pay_items.length ; i++)
	{
		selectStr += '<option>'+arr_pay_items[i]+'</option>';

	}
	$("#id_modal_add_pay_item_select").append(selectStr);

	console.log('arr '+arr_pay_items);

	//
	let arr_skill_sorted,arr_experience_sorted;

	arr_task_emp = [];
    let join_time_per_level = alasql('SELECT ? - MIN(joining) AS max_join_time from professional ',[new Date().getTime()] )[0]["max_join_time"]/3;
    console.log(join_time_per_level + typeof join_time_per_level);


	for(let i =0;i<emps.length ; i++)
	{
		let skill_avg = alasql("SELECT avg(rating) AS point from skill where emp=?",[emps[i]["id"]])[0]["point"];
		let skill_level ,skill_bg_color;
		if(skill_avg >4)
		{
			skill_level = 'Advanced';
			skill_bg_color = "bg-success text-white";

		}
		else if(skill_avg > 3)
		{
			skill_level = 'Intermediate';
            skill_bg_color = "bg-info text-white";

		}
		else
		{
			skill_level = 'Basic';
            skill_bg_color = "bg-warning text-white" ;
		}

		let joining_time = alasql("SELECT ? - joining  AS current_join from professional where emp = ?",[ new Date().getTime(),emps[i]["id"] ])[0]["current_join"];
		let join_level , join_bg_color;

		console.log(emps[i]["id"]+" "+ joining_time);

		if(joining_time > 2*join_time_per_level)
		{
			join_level = 'Veteran';
			join_bg_color = "bg-success text-white";

		}
		else if(joining_time > join_time_per_level)
		{
			join_level = 'Senior';
            join_bg_color = "bg-info text-white";
		}
		else
		{
			join_level = 'Junior';
            join_bg_color = "bg-warning text-white" ;
        }

        let isBusy = alasql('SELECT * from project where emp=?',[emps[i]["id"]]).length !== 0 ;

		arr_task_emp.push(
			{
				"emp_id" : emps[i]["id"],
				"name" : emps[i]["name"],
				"skill_level" : skill_level,
				"experience" : join_level,
				"skill_bg_color" : skill_bg_color,
				"join_bg_color" : join_bg_color,
				"skill_avg" : skill_avg,
				"joining_time" : joining_time,
				"is_busy" : isBusy,
				"selectedEmp" : false
			}

		);

	}

	arr_task_emp.sort(function (a, b) {
		return -a.skill_avg + b.skill_avg;
    });

	empSkillExpSortShow(arr_task_emp);


}
else
{
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
    let temp = alasql("SELECT * from skill where emp="+emp.id);

    let skills = "";
    for(let ii = 0;ii<temp.length ; ii++)
	{
		skills += temp[ii]["name"] + "<br>";
	}

	temp = alasql("SELECT * from project where emp="+emp.id);
    let projects = "";
    for(let ii = 0;ii<temp.length ; ii++)
    {
        projects += temp[ii]["name"]+"<br>";
    }

    temp = alasql("SELECT * from professional where emp="+emp.id)[0];
    let joining  = getDateFromMS(temp.joining);
    let nationality = temp.nationality;
    let city_name = alasql("SELECT *  from addr where emp ="+emp.id)[0]["city"];


    temp = alasql("SELECT *  from edu where emp = "+emp.id);
    let major_name  = temp.length === 0 ? '':temp[0]["major"];
    let school_name = temp.length === 0 ? '' : temp[0]["school"];


    temp = alasql("SELECT *  from payroll where emp ="+emp.id);

    let payroll_names = "";
    for(let ii = 0;ii<temp.length ; ii++)
    {
        payroll_names += temp[ii]["item"] +" : " +  temp[ii]["amount"]+"<br>"
    }



    var tr = $('<tr></tr>');
	tr.append('<td><img height=40 class="img-circle" src="img/' + emp.id + '.jpg"></td>');
	tr.append('<td><a href="emp.html?id=' + emp.id + '">' + emp.name + '</a></td>');
	tr.append('<td>' + emp.dept + '</td>');
	tr.append('<td>' + emp.desgn + '</td>');
    tr.append('<td>' + joining + '</td>');
	tr.append('<td>' + skills + '</td>');
	tr.append('<td>' + projects + '</td>');
    tr.append('<td>' + nationality + '</td>');
    tr.append('<td>' + city_name + '</td>');
    tr.append('<td>' + school_name + '</td>');
    tr.append('<td>' + major_name + '</td>');
    tr.append('<td>' + payroll_names + '</td>');

	tr.append('<td>' + emp.birthday + '</td>');
	tr.appendTo(tbody);
}

function parseSearchString(str)
{
	console.log("str "+str);

	//First -> Direct Search


	if(directSearchJson[str] !== undefined )
	{
		let sqlStr ='SELECT * from '+directSearchJson[str]["table"]+" where "+directSearchJson[str]["type"]+" LIKE  ?";
		console.log("//"+sqlStr);

		if(directSearchJson[str]["table"] === "emp"){
            return alasql('SELECT * from '+directSearchJson[str]["table"]+" where "+directSearchJson[str]["type"]+" LIKE  ?",['%'+str+'%']);
		}
		else {
            return alasql('SELECT emp AS id from ' + directSearchJson[str]["table"] + " where " + directSearchJson[str]["type"] + " LIKE  ?", ['%' + str + '%']);
        }

	}
	else
	{
        if(str.startsWith("Joined") || str.startsWith("has"))
        {

            let arr = str.split(' ');
            console.log(arr);
            if(arr[arr.length -1 ] === 'today')
            {
                let d = new Date();
                d.setHours(0,0,0,0);
                console.log("D "+d.getTime());
                return alasql('SELECT emp from professional where joining >= '+d.getTime());

            }


            if(arr[arr.length - 1] === "week")
            {
                if(arr[1] === 'this')
                {
                	console.log("Joined this week . ");
                	let d = new Date();
                	d.setMilliseconds(d.getMilliseconds() - d.getDay() * 24*3600*1000);
                	d.setHours(0,0,0,0);
                	return alasql("SELECT * from professional where joining >="+d.getTime());

                }
                else{
                	console.log("Joined last week.");
                	let d = new Date();
                	let dd = new Date();
                	d.setMilliseconds(d.getMilliseconds() - (d.getDay()+7) * 24*3600*1000  );
                	d.setHours(0,0,0,0);
                	dd.setMilliseconds(dd.getMilliseconds() - dd.getDay() * 24 * 3600* 1000);
                	dd.setHours(0,0,0,0);
                	return alasql("SELECT * from professional where joining >="+d.getTime() + " and joining <"+dd.getTime());

				}
            }

            if(arr[arr.length -1 ] === "month")
			{
				if(arr[1] === 'this')
				{
					console.log("Joined this month . ");
					let d = new Date();
					d.setDate(1);
					d.setHours(0,0,0,0);
					return alasql("SELECT * from professional where joining >="+d.getTime());


				}
				else
				{
                    console.log("Joined last month.");
                    let d = new Date();
                    let dd = new Date();
                    d.setMonth(d.getMonth() - 1);
                    d.setHours(0,0,0,0);
                    dd.setDate(1);
                    dd.setHours(0,0,0,0);
                    return alasql("SELECT * from professional where joining >="+d.getTime()+" and joining <"+dd.getTime());

				}
			}

			if(arr[arr.length - 1] === "ago")
			{
				console.log("Joined within ? months ago ");
				let noMonths = parseInt(arr[2]);
				let d = new Date();
				d.setMonth(d.getMonth() - noMonths);
				d.setHours(0,0,0,0);
				return alasql("SELECT * from professional where joining >="+d.getTime());

			}
            if(arr[0] === "has")
            {
                console.log("has ? years of experience.");
                let noYears = parseInt(arr[1]);

                let d = new Date();

                d.setFullYear(d.getFullYear() - noYears);
                d.setHours(0,0,0,0);
                console.log("D "+d.getTime());

                return alasql("SELECT * from professional where joining <="+d.getTime());

            }




        }

        if(str.startsWith("age"))
		{
            let arr = str.split(' ');
            console.log(arr);


			if(arr[arr.length - 1] === "older" || arr[arr.length - 1] === "younger")
			{
				let age = parseInt(arr[1]);
                let d = new Date();
                //let dd = "";
                d.setFullYear(d.getFullYear() - age);
                // dd += d.getFullYear()+"-"
                // 	+(d.getMonth() >= 9 ? d.getMonth()+1 : '0'+(d.getMonth()+1) )+"-"
                // 							+(d.getDate() >= 10 ? d.getDate() :'0'+d.getDate());

                let dd = d.toISOString().slice(0,10);


                if(arr[arr.length - 1] === "older")
				{
					console.log("age ? years or older");
					console.log("Birth Year before "+dd);
					return alasql("SELECT * from emp where birthday <=\""+dd+"\"");

				}
				else
				{
					console.log("age ? years or younger ");
                    console.log("Birth Year after "+dd);
                    return alasql("SELECT * from emp where birthday >=\""+dd+"\"");



				}

			}
			else
			{
				let lowAge = parseInt(arr[1]) ;
				let highAge = parseInt(arr[3]);

				let dLow = new Date();
				let dHigh = new Date();

				dLow.setFullYear(dLow.getFullYear() - lowAge);
				dHigh.setFullYear(dHigh.getFullYear() - highAge);

				let ddLow = dLow.toISOString().slice(0,10);
				let ddHigh = dHigh.toISOString().slice(0,10);

				console.log("age ? - ? year");
				console.log("From "+ddHigh+" ~ "+ddLow);

                return alasql("SELECT * from emp where birthday >=\""+ddHigh+"\" and birthday <= \""+ddLow+"\"");

			}


		}
		if(str.startsWith("knows"))
		{
			let arr = str.split(' ');

            console.log(arr);

            arr.splice(0,1);
            let empSkilled = alasql("SELECT distinct emp from skill");

            for(let i = 0;i<arr.length;i++)
			{
				if(arr[i] !== ",")
				{
					let tempSkilled = alasql("SELECT distinct emp from skill where name = \""+arr[i]+"\"");

                    for(let j =0;j<empSkilled.length ;j++)
                    {
                        let isFound = false;
                        for(let k =0;k<tempSkilled.length ; k++)
                        {
                            if(empSkilled[j]["emp"] === tempSkilled[k]["emp"])
                            {
                            	empSkilled[j]["id"] = empSkilled[j]["emp"];
                                isFound = true;
                                break;
                            }
                        }
                        if(!isFound)
                        {
                            empSkilled.splice(j,1);
                            j--;
                        }
                    }

				}
			}


			console.log(empSkilled);

            return empSkilled;



        }
        if(str.includes("married"))
		{
			if(str.includes("unmarried"))
			{
                let married_arr = alasql("SELECT distinct emp from family where relation = 'Wife' or relation = 'Husband' ");
                let all_emp = alasql("SELECT * from emp");

                for(let i =0;i<married_arr.length ; i++)
				{
					for(let j =0;j<all_emp.length ; j++)
					{
						if(married_arr[i]["emp"] === all_emp[j]["id"])
						{
							all_emp.splice(j,1);
							break;
						}


					}
				}
				console.log("unmarried");
				return all_emp;

			}
			if(str.includes("no")){
				let hasChildren =alasql("SELECT distinct emp AS id from family where relation='Daughter' or relation='Son' ");
                let isMarried = alasql("SELECT distinct emp AS id from family where relation='Husband' or relation= 'Wife' ");

                for(let i =0;i<isMarried.length ; i++)
                {
                    for(let j =0;j<hasChildren.length ; j++)
                    {
                        if(isMarried[i]["id"] === hasChildren[j]["id"])
                        {
                            isMarried.splice(i,1);
                            i--;
                            break;
                        }
                    }
                }
                console.log("no children "+hasChildren.length)
                console.log("married and has no children . ",isMarried.length);

                return isMarried;

			}
			else {
                let hasChildren =alasql("SELECT distinct emp AS id from family where relation='Daughter' or relation='Son' ");

                console.log("married and has children .");

                return hasChildren;


			}




		}


	}




}

function empSkillExpSortShow(arr_task_emp) {
	let repStr = '';
    for(let i =0;i<arr_task_emp.length;i++) {
        let row_name_emp = "class_task_row_" + arr_task_emp[i]["emp_id"];
        let empBusyClass= arr_task_emp[i]["is_busy"] ? ' busy_emp_class ' : 'free_emp_class';
        let checkboxText = arr_task_emp[i]["selectedEmp"] ? 'checked' : '';

		repStr+=
            '<tr class="'+empBusyClass+'">' +
            '<td class="col-sm-1"><input type="checkbox" class=" class_task_checkbox ' + row_name_emp + ' " '+checkboxText+' ></td>' +
            '<td class="col-lg-3">' + arr_task_emp[i]["name"] + '</td>' +
            '<td class="col-sm-2 ' + arr_task_emp[i]["skill_bg_color"] + ' " >' + arr_task_emp[i]["skill_level"] + '</td>' +
            '<td class="col-sm-2 ' + arr_task_emp[i]["join_bg_color"] + ' " >' + arr_task_emp[i]["experience"] + '</td>' +
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
            $(this).prop('checked',false);

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
    return t.getFullYear() + "/"+(t.getMonth()+1)+"/"+t.getDate();

}



