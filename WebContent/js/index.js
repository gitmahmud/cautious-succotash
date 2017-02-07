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





console.log("q1 "+q1+" q2 "+q2+" q3 "+q3+" q4 "+q4+" q5 "+q5);
var directSearchJson = JSON.parse(localStorage.getItem("directSearchJson"));


var emps;

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

	let linkPayroll = "add-payroll.html?p=";

	for(let i =0;i<emps.length ; i++)
	{
		linkPayroll += emps[i]["id"];
		if(i !== emps.length - 1)
		{
			linkPayroll += ",";
		}

	}
    $("#button_add_payroll").attr("href",linkPayroll);





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
