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


var emps;



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
        let percentAmount = parseInt($('#id_modal_input_percentage').val())/100;

        console.log("Percent "+percentAmount);

        for(let i =0;i<emps.length ;i++)
		{
			let pay_amount = alasql("SELECT amount from payroll where emp= ?  and item= ? ", [ emps[i]["id"],pay_existing ] )[0]["amount"]
								* percentAmount ;
            console.log("pay amount "+pay_amount);

			alasql("INSERT INTO payroll VALUES(?,?,?,?,?);",[ pay_id+i , emps[i]["id"] , pay_name , pay_amount , pay_type ]);

		}



	}



	//alert(pay_name+"\n"+pay_amount+"\n"+pay_type+"\n"+pay_id);





    }

);


console.log("q1 "+q1+" q2 "+q2+" q3 "+q3+" q4 "+q4+" q5 "+q5);
var directSearchJson = JSON.parse(localStorage.getItem("directSearchJson"));




if(q3 !== undefined) {
    emps = alasql('SELECT * FROM emp', []);

	if(q3)
	{

		let tempEmps = parseSearchString(q3) ;
		if(tempEmps === undefined)
		{
			tempEmps = [];
		}

		console.log(tempEmps);


		for(let i =0;i<emps.length ;i++)
		{
			let isFound = false;
			for(let j =0;j<tempEmps.length ; j++)
			{
				if(emps[i]["id"] === tempEmps[j]["id"])
				{
					isFound = true;
					break;
				}
			}
			if(!isFound)
			{
				emps.splice(i,1);
				i--;
			}
		}
	}
	if(q4)
	{
        let tempEmps = parseSearchString(q4) ;
        if(tempEmps === undefined)
        {
            tempEmps = [];
        }

        console.log(tempEmps);


        for(let i =0;i<emps.length ;i++)
        {
            let isFound = false;
            for(let j =0;j<tempEmps.length ; j++)
            {
                if(emps[i]["id"] === tempEmps[j]["id"])
                {
                    isFound = true;
                    break;
                }
            }
            if(!isFound)
            {
                emps.splice(i,1);
                i--;
            }
        }


	}
	if(q5)
	{
        let tempEmps = parseSearchString(q5) ;
        if(tempEmps === undefined)
        {
            tempEmps = [];
        }

        console.log(tempEmps);


        for(let i =0;i<emps.length ;i++)
        {
            let isFound = false;
            for(let j =0;j<tempEmps.length ; j++)
            {
                if(emps[i]["id"] === tempEmps[j]["id"])
                {
                    isFound = true;
                    break;
                }
            }
            if(!isFound)
            {
                emps.splice(i,1);
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

	//First -> Direct Search


	if(directSearchJson[str] !== undefined )
	{
		let sqlStr ='SELECT * from '+directSearchJson[str]["table"]+" where "+directSearchJson[str]["type"]+" LIKE  ?";
		console.log("//"+sqlStr);

		return alasql('SELECT * from '+directSearchJson[str]["table"]+" where "+directSearchJson[str]["type"]+" LIKE  ?",['%'+str+'%']);

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

                return alasql("SELECT * from professional where joining >="+d.getTime());

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
				return all_emp;

			}
			if(str.includes("no")){
				let noChildren =alasql("SELECT distinct emp from family where relation='Daughter' or relation='Son' ");
                let all_emp = alasql("SELECT * from emp");

                for(let i =0;i<noChildren.length ; i++)
                {
                    for(let j =0;j<all_emp.length ; j++)
                    {
                        if(noChildren[i]["emp"] === all_emp[j]["id"])
                        {
                            all_emp.splice(j,1);
                            break;
                        }

                    }
                }

                return all_emp;

			}
			else {
                let hasChildren =alasql("SELECT distinct emp AS id from family where relation='Daughter' or relation='Son' ");

                return hasChildren;


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
