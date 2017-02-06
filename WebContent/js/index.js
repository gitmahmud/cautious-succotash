


// parse request params
var q1 = $.url().param('q1');
$('input[name="q1"]').val(q1);
var q2 = $.url().param('q2');
$('input[name="q2"]').val(q2);

var q3 = $.url().param('q3');
$('input[name="q3"]').val(q3);


var q4 = $.url().param('q4');
$('input[name="q4"]').val(q4);


var q5 = $.url().param('q5');
$('input[name="q5"]').val(q5);

var t  = alasql('SELECT id FROM emp', []);
let allEmpId =[];

for(let i =0;i<allEmpId.length ;i++)
{
	console.log(t[i]);
	allEmpId.push(t[i]["id"]);

}
console.log(allEmpId);

// read data from database
var emps;
if (q1) {
	emps = alasql('SELECT * FROM emp WHERE number LIKE ?', [ '%' + q1 + '%' ]);
} else if (q2) {
	emps = alasql('SELECT * FROM emp WHERE name LIKE ?', [ '%' + q2 + '%' ]);
}

else {
	emps = alasql('SELECT * FROM emp', []);
}

var emp_q3 =[],emp_q4=[] , emp_q5 = []  ;
if(q3){

	emp_q3 = parseSearchString(q3);
	console.log("Emp q3 "+emp_q3);
}
else
{
    emp_q3 = 	allEmpId;
}
if(q4){

    emp_q4 = parseSearchString(q4);
}
else
{
    emp_q4 = allEmpId;
}
if(q5)
{
    emp_q5 = parseSearchString(q5);

}
else
{
	emp_q5 = allEmpId;

}



var empIds = getIntersection(emp_q3,emp_q4,emp_q5);
console.log(empIds);
if(q3) {
emps = alasql('SELECT * FROM emp WHERE id = ? ',empIds);

}

console.log(emps);

// create employee list
var tbody = $('#tbody-emps');
for (var i = 0; i < emps.length; i++) {
	var emp = emps[i];
	var tr = $('<tr></tr>');
	tr.append('<td><img height=40 class="img-circle" src="img/' + emp.id + '.jpg"></td>');
	tr.append('<td><a href="emp.html?id=' + emp.id + '">' + emp.number + '</a></td>');
	tr.append('<td>' + emp.name + '</td>');
	tr.append('<td>' + DB.choice(emp.sex) + '</td>');
	tr.append('<td>' + emp.birthday + '</td>');
	tr.append('<td>' + emp.tel + '</td>');
	tr.appendTo(tbody);
}

function parseSearchString(str)
{
	console.log("str "+str);

	if(str.startsWith("Joined"))
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


			}
		}
	}

}

function getIntersection(t1,t2,t3) {
	t1= t1.sort();
	t2= t2.sort();
	t3= t3.sort();
	console.log("T1 size "+t2);

	let tmp =  t1.filter(function (element) {
		console.log("el "+element);
		return t2.indexOf(element) !== -1 && t3.indexOf(element) !== -1 ;

    });

	console.log(tmp);
	return tmp;

}
