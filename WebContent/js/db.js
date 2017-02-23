var DB = {};

DB.init = function() {
	if (window.confirm('are you sure to initialize database?')) {
		DB.load();
	}
};

DB.load = function() {
	// personal info
	alasql('DROP TABLE IF EXISTS emp;');

	alasql('CREATE TABLE emp(id INT IDENTITY, number STRING, name STRING, sex INT, birthday DATE, tel STRING, ctct_name STRING, ctct_addr STRING, ctct_tel STRING, pspt_no STRING, pspt_date STRING, pspt_name STRING, rental STRING,dept STRING,desgn STRING);');
	var pemp = alasql.promise('SELECT MATRIX * FROM CSV("data/EMP-EMP.csv", {headers: true})').then(function(emps) {
		for (var i = 0; i < emps.length; i++) {
			alasql('INSERT INTO emp VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);', emps[i]);

		}
	});

	// address
	alasql('DROP TABLE IF EXISTS addr;');
	alasql('CREATE TABLE addr(id INT IDENTITY, emp INT, zip STRING, state STRING, city STRING, street STRING, bldg STRING, house INT);');
	var paddr = alasql.promise('SELECT MATRIX * FROM CSV("data/ADDR-ADDR.csv", {headers: true})').then(
			function(addresses) {
				for (var i = 0; i < addresses.length; i++) {
					alasql('INSERT INTO addr VALUES(?,?,?,?,?,?,?,?);', addresses[i]);
				}
			});

	// family
	alasql('DROP TABLE IF EXISTS family;');
	alasql('CREATE TABLE family(id INT IDENTITY, emp INT, name STRING, sex INT, birthday STRING, relation STRING, cohabit INT, care INT);');
	var pfamily = alasql.promise('SELECT MATRIX * FROM CSV("data/FAMILY-FAMILY.csv", {headers: true})').then(
			function(families) {
				for (var i = 0; i < families.length; i++) {
					alasql('INSERT INTO family VALUES(?,?,?,?,?,?,?,?);', families[i]);
				}
			});

	// education
	alasql('DROP TABLE IF EXISTS edu;');
	alasql('CREATE TABLE edu(id INT IDENTITY, emp INT, school STRING, major STRING, grad STRING);');
	var pedu = alasql.promise('SELECT MATRIX * FROM CSV("data/EDU-EDU.csv", {headers: true})').then(function(edus) {
		for (var i = 0; i < edus.length; i++) {
			alasql('INSERT INTO edu VALUES(?,?,?,?,?);', edus[i]);
		}
	});

	// choice
	alasql('DROP TABLE IF EXISTS choice;');
	alasql('CREATE TABLE choice(id INT IDENTITY, name STRING, text STRING);');
	var pchoice = alasql.promise('SELECT MATRIX * FROM CSV("data/CHOICE-CHOICE.csv", {headers: true})').then(
			function(choices) {
				for (var i = 0; i < choices.length; i++) {
					alasql('INSERT INTO choice VALUES(?,?,?);', choices[i]);
				}
			});

	//personal extended
    alasql('DROP TABLE IF EXISTS professional;');
    var ret = alasql('CREATE TABLE professional(id INT IDENTITY, emp STRING, joining STRING, nationality STRING, bank_account STRING);');
    console.log("create table professional "+ret);
	var pprof =  alasql.promise('SELECT MATRIX * FROM CSV("data/PERSONAL-PROFESSIONAL.csv", {headers: true})').then(
        function(professionals) {
            for (var i = 0; i < professionals.length; i++) {
                alasql('INSERT INTO professional VALUES(?,?,?,?,?);', professionals[i]);
            }
        });

	//employee skill
	alasql('DROP TABLE IF EXISTS skill;');
    alasql('CREATE TABLE skill(id INT IDENTITY,emp STRING, name STRING, rating INT);');

    var pskill =  alasql.promise('SELECT MATRIX * FROM CSV("data/EMP-SKILL.csv", {headers: true})').then(
        function(skills) {
            for (var i = 0; i < skills.length; i++) {
                alasql('INSERT INTO skill VALUES(?,?,?,?);', skills[i]);
            }
        });

    //employee project

    alasql('DROP TABLE IF EXISTS project;');
    alasql('CREATE TABLE project(id INT IDENTITY,emp STRING, name STRING, role STRING, description STRING,created STRING, startdate STRING,enddate STRING);');

    var pproject =  alasql.promise('SELECT MATRIX * FROM CSV("data/EMP-PRJ.csv", {headers: true})').then(
        function(projects) {
            for (var i = 0; i < projects.length; i++) {
                alasql('INSERT INTO project VALUES(?,?,?,?,?,?,?,?);', projects[i]);
            }

        });

    alasql('DROP TABLE IF EXISTS payroll;');
    alasql('CREATE TABLE payroll(id INT IDENTITY,emp STRING, item STRING, amount INT, type STRING);');

    var ppayroll =  alasql.promise('SELECT MATRIX * FROM CSV("data/EMP-PAY.csv", {headers: true})').then(
        function(payrolls) {
            for (var i = 0; i < payrolls.length; i++) {
                // console.log(payrolls[i]);
                alasql('INSERT INTO payroll VALUES(?,?,?,?,?);', payrolls[i]);
            }
        });


    alasql('DROP TABLE IF EXISTS role_project;');
    alasql('CREATE TABLE role_project(id INT IDENTITY,name STRING, type STRING );');

    var prole_project =  alasql.promise('SELECT MATRIX * FROM CSV("data/PRJ-ROLE.csv", {headers: true})').then(
        function(roles_projects) {
            for (var i = 0; i < roles_projects.length; i++) {
                // console.log(payrolls[i]);
                alasql('INSERT INTO role_project VALUES(?,?,?,?);', roles_projects[i]);
            }
        });




    // reload html

    Promise.all([ pemp, paddr, pfamily, pedu, pchoice, pprof,pskill, pproject,ppayroll,prole_project ]).then(function() {

    	console.log("here it is!");
    	var directSearchJson = {};

    	var res = alasql("SELECT nationality FROM professional GROUP BY nationality");

    	for(let i =0;i<res.length; i++)
		{

			directSearchJson[res[i]["nationality"]] = {
										"type" : "nationality",
										"table": "professional"
										};
		}

		res = alasql("SELECT city FROM addr GROUP BY city");

        for(let i =0;i<res.length; i++)
        {

            directSearchJson[res[i]["city"]] = {
                "type" : "city",
                "table": "addr"
            };
        }

        res = alasql("SELECT name FROM role_project where type='project' GROUP BY name");

        for(let i =0;i<res.length; i++)
        {

            directSearchJson[res[i]["name"]] = {
                "type" : "name",
                "table": "project"
            };
        }
        res = alasql("SELECT school FROM  edu GROUP BY school");

        for(let i = 0;i<res.length ;i++)
		{
            directSearchJson[res[i]["school"]] = {
                "type" : "school",
                "table": "edu"
            };
		}

        res = alasql("SELECT major FROM  edu GROUP BY major");

        for(let i = 0;i<res.length ;i++)
        {
            directSearchJson[res[i]["major"]] = {
                "type" : "major",
                "table": "edu"
            };
        }

        res = alasql("SELECT  desgn FROM emp GROUP BY desgn");

        for(let i =0;i<res.length; i++)
        {

            directSearchJson[res[i]["desgn"]] = {
                "type" : "desgn",
                "table": "emp"
            };
        }

		res = alasql("SELECT dept FROM emp GROUP BY dept");

        for(let i =0;i<res.length; i++)
        {

            directSearchJson[res[i]["dept"]] = {
                "type" : "dept",
                "table": "emp"
            };
        }




        localStorage.setItem("directSearchJson" , JSON.stringify(directSearchJson));

       window.location.reload(true);


    });






};

DB.remove = function() {
	if (window.confirm('are you sure do delete dababase?')) {
		alasql('DROP localStorage DATABASE EMP')
	}
};

DB.choice = function(id) {
	var choices = alasql('SELECT text FROM choice WHERE id = ?', [ id ]);
	if (choices.length) {
		return choices[0].text;
	} else {
		return '';
	}
};

DB.choices = function(name) {
	return alasql('SELECT id, text FROM choice WHERE name = ?', [ name ]);
};

// connect to database
try {
	alasql('ATTACH localStorage DATABASE EMP');
	alasql('USE EMP');
} catch (e) {
	alasql('CREATE localStorage DATABASE EMP');
	alasql('ATTACH localStorage DATABASE EMP');
	alasql('USE EMP');
	DB.load();



}



