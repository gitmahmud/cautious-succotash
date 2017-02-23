// read personal info
var id = parseInt($.url().param('id'));
var emp = alasql('SELECT * FROM emp WHERE id=?', [ id ])[0];
$('#number').text(emp.number);
$('#name').text(emp.name);
$('#sex').text(DB.choice(emp.sex));
$('#birthday').text(emp.birthday);
$('#tel').text(emp.tel);
$('#ctct_name').text(emp.ctct_name);
$('#ctct_addr').text(emp.ctct_addr);
$('#ctct_tel').text(emp.ctct_tel);
$('#pspt_no').text(emp.pspt_no);
$('#pspt_date').text(emp.pspt_date);
$('#pspt_name').text(emp.pspt_name);
$('#rental').text(DB.choice(emp.rental));
$('#employee_department').text(emp.dept);
$('#employee_designation').text(emp.desgn);

console.log("Employee Id "+id);






var emp_personal_extended = alasql('SELECT * FROM professional WHERE emp=?', [ id])[0];

console.log('a '+emp_personal_extended.nationality);
console.log('b '+emp_personal_extended.bank_account);
console.log("Employee Id "+id);

$('#joining_date').text(getDateFromMS(emp_personal_extended.joining));
$('#nationality').text(emp_personal_extended.nationality);
$('#bank_account').text(emp_personal_extended.bank_account);

var emp_projects = alasql('SELECT * FROM project WHERE emp=?', [ id]);


if (emp_projects.length !== 0) {

	let emp_project_list_html = '';

    for (let i = 0; i < emp_projects.length; i++) {
        let emp_project = emp_projects[i];

    	emp_project_list_html += '<tr>'+
				'<td>'+emp_project.name+'</td>'+
				'<td>'+emp_project.role+'</td>'+
				'<td>'+emp_project.description+'</td>'+
				'<td>'+getDateFromMS(emp_project.created)+'</td>'+
				'<td>'+emp_project.startdate+'</td>'+
				'<td>'+emp_project.enddate+'</td>'+
				'</tr>';

        // $('#project_name').text(emp_project.name);
        // $('#project_description').text(emp_project.description);
        // $('#project_role').text(emp_project.role);

    }

    $('#tbody_project_list').append(emp_project_list_html);
}


var emp_skills = alasql('SELECT * FROM skill WHERE emp=?' ,[id]);

for(let i =0;i<emp_skills.length ; i++) {
    $('#tbody-skill').append('<tr><th scope="row">' + (i+1) +'</th><td>' + emp_skills[i]["name"] + '</td><td>' +emp_skills[i]["rating"] + '</td></tr>');
}


// set image and name
$('#img-emp').attr('src', 'img/' + emp.id + '.jpg');
$('#div-name_kanji').text(emp.name);
$('#div-number').text(emp.number);
$('#nav-emp').text(emp.name);
$('#form-emp').attr('href', 'emp-form.html?id=' + id);

// read address info
var addrs = alasql('SELECT * FROM addr WHERE emp=?', [ id ]);
for (var i = 0; i < addrs.length; i++) {
	var addr = addrs[i];
	var tr = $('<tr>').appendTo('#tbody-addr');
	tr.append('<td>' + addr.zip + '</td>');
	tr.append('<td>' + addr.state + '</td>');
	tr.append('<td>' + addr.city + '</td>');
	tr.append('<td>' + addr.street + '</td>');
	tr.append('<td>' + addr.bldg + '</td>');
	tr.append('<td>' + DB.choice(addr.house) + '</td>');
	var td = $('<td class="text-right">').appendTo(tr);
	$('<a href="addr-form.html?id=' + addr.id + '" class="btn btn-xs btn-primary">').html(
			'<span class="glyphicon glyphicon-pencil"></span> Edit').appendTo(td);
	$('<span> </span>').appendTo(td);
	$('<a class="btn btn-xs btn-danger">').html('<span class="glyphicon glyphicon-remove"></span> Delete').appendTo(td);
}
$('#ins-addr').attr('href', 'addr-form.html?emp=' + id);

// read family info
var families = alasql('SELECT * FROM family WHERE emp=?', [ id ]);
for (var i = 0; i < families.length; i++) {
	var family = families[i];
	var tr = $('<tr>').appendTo('#tbody-family');
	tr.append('<td>' + family.name + '</td>');
	tr.append('<td>' + DB.choice(family.sex) + '</td>');
	tr.append('<td>' + family.birthday + '</td>');
	tr.append('<td>' + family.relation + '</td>');
	tr.append('<td>' + DB.choice(family.cohabit) + '</td>');
	tr.append('<td>' + DB.choice(family.care) + '</td>');
	var td = $('<td class="text-right">').appendTo(tr);
	$('<a href="family-form.html?id=' + family.id + '" class="btn btn-xs btn-primary">').html(
			'<span class="glyphicon glyphicon-pencil"></span> Edit').appendTo(td);
	$('<span> </span>').appendTo(td);
	$('<a class="btn btn-xs btn-danger">').html('<span class="glyphicon glyphicon-remove"></span> Delete').appendTo(td);
}
$('#ins-family').attr('href', 'family-form.html?emp=' + id);

// read academic history
var edus = alasql('SELECT * FROM edu WHERE emp=?', [ id ]);
for (var i = 0; i < edus.length; i++) {
	var edu = edus[i];
	var tr = $('<tr>').appendTo('#tbody-edu');
	tr.append('<td>' + edu.school + '</td>');
	tr.append('<td>' + edu.major + '</td>');
	tr.append('<td>' + edu.grad + '</td>');
	var td = $('<td class="text-right">').appendTo(tr);
	$('<a href="edu-form.html?id=' + edu.id + '" class="btn btn-xs btn-primary">').html(
			'<span class="glyphicon glyphicon-pencil"></span> Edit').appendTo(td);
	$('<span> </span>').appendTo(td);
	$('<a class="btn btn-xs btn-danger">').html('<span class="glyphicon glyphicon-remove"></span> Delete').appendTo(td);
}
$('#ins-edu').attr('href', 'edu-form.html?emp=' + id);

//read payroll information

var pays = alasql("SELECT * FROM payroll WHERE emp=?",[ id ]);
var total_pay = 0;
for(var i =0;i<pays.length;i++){
	if(pays[i]["type"] === "plus")
	{
		total_pay += pays[i]["amount"];
        $("#tbody-payroll").append('<tr class="text-success"><td>' + pays[i]["item"] + '</td><td>' +pays[i]["amount"] + '</td></tr>');
	}
	else
	{
		total_pay -= pays[i]["amount"];
        $("#tbody-payroll").append('<tr class="text-danger"><td>' + pays[i]["item"] + '</td><td>' +pays[i]["amount"] + '</td></tr>');
	}


}

$("#tbody-payroll").append('<tr bgcolor="#008b8b" ><td><b>Total : </b></td><td><b>' +total_pay.toFixed(2)+ '</b></td></tr>');


// delete employee
function destroy() {
	if (window.confirm('are you sure to delete employee?')) {
		alasql('DELETE FROM emp WHERE id=?', [ id ]);
		window.location.assign('index.html');
	}
}

function getDateFromMS(r) {
	let t = new Date(r);
	return t.getFullYear() + "/"+(t.getMonth()+1)+"/"+t.getDate();

}
