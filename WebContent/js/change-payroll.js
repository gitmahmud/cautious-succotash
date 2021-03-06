/**
 * Created by rahman_ma-pc on 2/8/2017.
 */
var ids = $.url().param('p');

ids = ids.split(",");
for (let i = 0; i < ids.length; i++) {
    ids[i] = parseInt(ids[i]);
}
console.log(ids[0]);

var payData = alasql("SELECT * from payroll where emp = " + ids[0]);
// console.log("Payroll "+payData.length);

for (let i = 0; i < payData.length; i++) {
    payData[i]["universal_amount"] = true;
    payData[i]["min_amount"] = payData[i]["amount"];

}

// console.log("Payroll "+payData);


for (let i = 1; i < ids.length; i++) {
    let tempData = alasql("SELECT * from payroll where emp = " + ids[i]);

    for (let j = 0; j < payData.length; j++) {
        let isContain = false;

        for (let k = 0; k < tempData.length; k++) {
            if (payData[j]["item"] === tempData[k]["item"]) {
                isContain = true;
                if (payData[j]["amount"] === tempData[k]["amount"]) {
                    payData[j]["universal_amount"] = payData[j]["universal_amount"] && true;
                }
                else {
                    payData[j]["universal_amount"] = payData[j]["universal_amount"] && false;
                }
                payData[j]["min_amount"] = Math.min(payData[j]["min_amount"], tempData[k]["amount"]);

            }
        }

        if (!isContain) {
            payData.splice(j, 1);
            j--;

        }


    }


}

console.log("Payroll ",payData);

let selectAnotherItemOptions = '';
for (let i = 0; i < payData.length; i++) {
    selectAnotherItemOptions += '<option>' + payData[i]["item"] + '</option>';

}



for (let i = 0; i < payData.length; i++) {
    console.log(i);
    // let selectBoxId = "id_select_amount_percentage_"+i;
    // let changeAmountId = "div_change_amount_"+i;
    // let changePercentageId = "div_change_percentage_"+i;
    let row_name = "class_row_" + i;
    let button_reset_class = payData[i]["universal_amount"] ? "btn-primary" : "btn-warning";
    let button_tooltip_reset = payData[i]["universal_amount"] ? '' : ' data-toggle="tooltip" data-placement="top" title="Employees have different amount for this item."' ;
    let taxCss = payData[i]["item"].includes('Tax') ? ' data-toggle="tooltip" data-placement="top" title="This item automatically system generated . Change with caution. " style="background: darkgrey" ' : '';
    let minusItemResetLabel = '';
    let minusItemIncreaseLabel = '';
    let minusItemResetMaxAttr = '';
    let minusItemIncreaseMaxAttr = '';





    let payType = alasql('SELECT type from payroll where item = "'+payData[i]["item"]+'"')[0]["type"];



    if(payType === 'minus')
    {
        let minimumSalaryWithoutTax = 99999999 ;
        let minimumSalary = 99999999;

        for(let j = 0 ;j<ids.length ; j++)
        {
            let salaryWithoutTaxArr =  alasql('SELECT type , sum(amount) AS total from payroll where emp= ? and item != "'+payData[i]["item"]+'"  group by type', [ ids[j] ]);

            if(salaryWithoutTaxArr.length === 1)
            {
                minimumSalaryWithoutTax = Math.min(minimumSalaryWithoutTax , salaryWithoutTaxArr[0]["total"]);
            }
            else
            {
                minimumSalaryWithoutTax = Math.min(minimumSalaryWithoutTax , Math.abs(salaryWithoutTaxArr[0]["total"] - salaryWithoutTaxArr[1]["total"]));

            }
            let salaryArr = alasql('SELECT type , sum(amount) AS total from payroll where emp= ?   group by type', [ ids[j] ]);

            minimumSalary = Math.min(minimumSalary , salaryArr[0]["total"] - salaryArr[1]["total"] );

        }
       minusItemResetLabel = '<p class="label label-warning" style="color: black">Maximum reset amount : '+minimumSalaryWithoutTax+' </p>';
       minusItemIncreaseLabel = '<p class="label label-warning" style="color: black">Maximum increase amount : '+minimumSalary+' </p>';

       minusItemResetMaxAttr = ' max="'+minimumSalaryWithoutTax+'" ';
       minusItemIncreaseMaxAttr = ' max="'+minimumSalary+'" ';


        console.log(minimumSalaryWithoutTax + ' '+minimumSalary);


    }








    $('#tbody_change_payroll').append(
        '<tr'+taxCss+'><td  class="col-sm-3 class_col_0 ' + row_name + '">' + payData[i]["item"]  +'</td>' +
        '<td class="col-sm-4"><form class="form-inline">' +
        '<div class="form-group"><select class="form-control col-sm-4 class_col_select_another_item_percentage ' + row_name + '" >' +
        '<option>By Amount</option><option>By Percentage of another item</option></select></div>' +

        '<div class="form-group class_div_reset_by_amount">' +
        '<input type="number" class="form-control col-sm-3 class_col_1 ' + row_name + '" placeholder="Amount" '+minusItemResetMaxAttr+' min="0"><br/><p class="label label-warning" style="color: black">Minimum reset amount : 0 </p><br>'+minusItemResetLabel+'</div>' +

        '<div class="form-group class_div_another_item_percentage ' + row_name + '" style="display: none;" >' +
        '<input type="number" min="0" class="form-control col-sm-1 class_col_another_item_percentage ' + row_name + '" placeholder="%"  value="0">' +
        '<label class="col-sm-1" style="padding-left: 5%"> % of </label> '+
        '<select class="form-control col-sm-1 class_col_another_item_name_select '+ row_name +'" >'+selectAnotherItemOptions+'</select></div>'+




        '<div class="form-group"><button class="btn ' + button_reset_class + ' class_col_2 ' + row_name + '" type="button" '+ button_tooltip_reset +'>Reset</button></div></form></td>' +



        '<td class="col-sm-5"><form class="form-inline"><div class="form-group"><select class="form-control col-sm-2 class_col_3 ' + row_name + '" >' +
        '<option>By Amount</option><option>By Percentage</option></select></div><br>' +
        '<div class="form-group class_div_amount ' + row_name + '" ><input type="number"'+minusItemIncreaseMaxAttr+' min="'+payData[i]["min_amount"]*(-1)+'" class="form-control col-sm-2 class_col_4 ' + row_name + '" placeholder="Amount" style="width: 75%" value="0"><br>' +
        '<p class="label label-warning" style="color: black">Maximum decrease amount : '+payData[i]["min_amount"]+' </p><br>'+minusItemIncreaseLabel+'</div>'+
        '<div class="form-group class_div_percentage ' + row_name + '" style="display: none;" >' +
        '<input type="number" class="form-control col-sm-2 class_col_5 ' + row_name + '" placeholder="%" style="width: 60%" min="-100" value="0">' +
        '<label style="padding-left: 5%">    %</label> </div>' +
        ' <div class="form-group">' +
        '<button type="button" class="btn btn-primary class_col_6 ' + row_name + '">Adjust </button>  </div>   </form>    </td>     </tr>'
    );


}


setEmplyeeNamesLabel();


$(" .class_col_2 ").on('click', function () {
        let arr = $(this).attr("class").split(" ");
        let arr_row = arr[arr.length - 1];
        let pay_item_name = $(".class_col_0." + arr_row).text();
        let reset_warning = $('.btn.class_col_2.' + arr_row).attr("class").split(" ")[1] === "btn-warning";
        let taxWarning = pay_item_name.includes('Tax');

    console.log("here ");
        if($(".class_col_select_another_item_percentage."+arr_row).find(":selected").text() === "By Amount") {

            if(taxWarning){
                if(!confirm("Tax is automatically generated by the system . You sure to reset ? ")) {
                    return;
                }
            }

            if (reset_warning) {
                if (confirm("This payroll amount is not same for all employees.\nAre you sure to perform this action ?")) {

                    let pay_reset_amount_string = $(".class_col_1." + arr_row).val();
                    let pay_reset_amount = pay_reset_amount_string.indexOf(".") === -1 ? parseInt(pay_reset_amount_string) : parseFloat(pay_reset_amount_string);

                    console.log(pay_item_name + " " + pay_reset_amount);

                    for (let i = 0; i < ids.length; i++) {
                        alasql("UPDATE payroll SET amount = ? WHERE emp = ? and item = ?", [pay_reset_amount, ids[i], pay_item_name]);

                    }
                    generateReportChangePayroll(pay_item_name);

                    $('.btn.class_col_2.' + arr_row).attr("class", " btn btn-primary class_col_2 " + arr_row);


                }


            }
            else {


                let pay_reset_amount_string = $(".class_col_1." + arr_row).val();

                let pay_reset_amount = pay_reset_amount_string.indexOf(".") === -1 ? parseInt(pay_reset_amount_string) : parseFloat(pay_reset_amount_string);

                console.log(pay_item_name + " " + pay_reset_amount);

                for (let i = 0; i < ids.length; i++) {
                    alasql("UPDATE payroll SET amount = ? WHERE emp = ? and item = ?", [pay_reset_amount, ids[i], pay_item_name]);

                }
                generateReportChangePayroll(pay_item_name);

            }
        }
        else
        {
            let pay_reset_percentage_string = $(".class_col_another_item_percentage."+arr_row).val();
            let pay_reset_percentage = pay_reset_percentage_string.indexOf(".") === -1 ? parseInt(pay_reset_percentage_string) : parseFloat(pay_reset_percentage_string);
            pay_reset_percentage = pay_reset_percentage/100;

            let pay_reset_another_item_name = $(".class_col_another_item_name_select."+arr_row).find(":selected").text();


            for (let i = 0; i < ids.length; i++) {


                console.log("Type pf amount "+typeof (alasql("SELECT amount from payroll where emp = ? and item=?",[ids[i],pay_reset_another_item_name])[0]["amount"]));
                console.log("Type of percent "+typeof pay_reset_percentage);
                let pay_reset_amount = parseFloat( ( alasql("SELECT amount from payroll where emp = ? and item=?",[ids[i],pay_reset_another_item_name])[0]["amount"] * pay_reset_percentage ).toFixed(2));
                console.log(typeof pay_reset_amount);
                alasql("UPDATE payroll SET amount = ? WHERE emp = ? and item = ?", [pay_reset_amount , ids[i] , pay_item_name]);
            }
            generateReportChangePayroll(pay_item_name);


        }


    }
);

$(" .class_col_6 ").on('click', function () {
        let arr = $(this).attr("class").split(" ");
        let arr_row = arr[arr.length - 1];
        let pay_item_name = $(".class_col_0." + arr_row).text();


        if ($(".class_col_3." + arr_row).find(":selected").text() === "By Amount") {
            let pay_change_amount_string = $(".class_col_4." + arr_row).val();
            let pay_change_amount = pay_change_amount_string.indexOf(".") === -1 ? parseInt(pay_change_amount_string) : parseFloat(pay_change_amount_string);

            console.log(pay_item_name + " " + pay_change_amount);

            if (pay_change_amount < 0) {
                for (let i = 0; i < ids.length; i++) {

                    alasql("UPDATE payroll SET amount = amount - ? WHERE emp = ? and item = ?", [Math.abs(pay_change_amount), ids[i], pay_item_name]);

                }

            }
            else {
                for (let i = 0; i < ids.length; i++) {
                    alasql("UPDATE payroll SET amount = amount + ? WHERE emp = ? and item = ?", [pay_change_amount, ids[i], pay_item_name]);

                }

            }

        }
        else {
            let pay_change_percent_string = $(".class_col_5." + arr_row).val();
            let pay_change_percent;
            if (pay_change_percent_string.indexOf(".") === -1) {
                pay_change_percent = parseInt(pay_change_percent_string) / 100;

            }
            else {
                pay_change_percent = parseFloat(pay_change_percent_string) / 100;

            }



            if (pay_change_percent < 0) {
                if(pay_change_percent < -0.5 ){
                    if(!confirm("You are decreasing payroll amount by more than 50% . This is not usual . Are you sure to continue ? "))
                    {
                        return;
                    }

                }
                for (let i = 0; i < ids.length; i++) {

                    let currentAmount = alasql('SELECT amount from payroll where emp = ? and item = ? ',[ids[i] , pay_item_name])[0]["amount"];
                    let payTotalAmount = parseFloat( currentAmount * (1 - Math.abs( pay_change_percent ) )  )  ;
                    payTotalAmount = parseFloat(payTotalAmount.toFixed(2));
                    console.log(payTotalAmount);

                    alasql("UPDATE payroll SET amount = ? WHERE emp = ? and item = ?", [payTotalAmount, ids[i], pay_item_name]);

                }

            }
            else {

                for (let i = 0; i < ids.length; i++) {
                    let currentAmount = alasql('SELECT amount from payroll where emp = ? and item = ? ',[ids[i] , pay_item_name])[0]["amount"] ;
                    let payTotalAmount =  parseFloat( (currentAmount * pay_change_percent) + currentAmount );
                    payTotalAmount = parseFloat(payTotalAmount.toFixed(2));
                    console.log(payTotalAmount);
                    alasql("UPDATE payroll SET amount =  ? WHERE emp = ? and item = ?", [payTotalAmount, ids[i], pay_item_name]);

                }

            }


        }



        generateReportChangePayroll(pay_item_name);






    }
);

$('#modal_close_change_payroll').on('click',function () {
    $('#showChangePayrollModalReport').modal('hide');
    window.location.reload(true);

})

function generateReportChangePayroll(changeName)
{
    let str = '';

    for (let i = 0; i < ids.length; i++) {
        let emp = alasql('SELECT * from emp where id='+ids[i])[0];

        str += '<tr><td><img height=40 class="img-circle" src="img/' + emp.id + '.jpg"></td>';
        str += '<td>' + emp.name + '</td><td>';

        let pays = alasql("SELECT * FROM payroll WHERE emp=?", [emp.id]);
        let total_pay = 0;
        for (let i = 0; i < pays.length; i++) {
            if (pays[i]["type"] === "plus") {
                total_pay += pays[i]["amount"];

                if (changeName !== pays[i]["item"]) {
                    str += pays[i]["item"] + ' :   ' + pays[i]["amount"] + ' <br>';
                }
                else {
                    str += pays[i]["item"] + ' :  ' + pays[i]["amount"] + '<span class="label label-warning">Change</span> <br>';

                }
            }
            else {
                total_pay -= pays[i]["amount"];

                if ( changeName !==pays[i]["item"] ) {
                    str += pays[i]["item"] + ' :  -' + pays[i]["amount"] + ' <br>';
                }
                else {
                    str += pays[i]["item"] + ' :  -' + pays[i]["amount"] + '<span class="label label-warning">Change</span> <br>';

                }
            }
        }
        str += '<b>Total : ' + total_pay.toFixed(2) + '</b></td></tr>';
    }


    $('#tbody_emps_change_payroll_report').html(str);

    $('#showChangePayrollModalReport').modal('show');


}



function setEmplyeeNamesLabel() {
    let empLabel = '<table class="table table-striped"><thead><th></th><th></th>';
    for(let i = 0; i<payData.length ; i++)
    {
        empLabel += '<th>'+payData[i]["item"] + '</th>';
    }
    empLabel += '</thead>';

    for (let i = 0; i < ids.length; i++) {

        let emp = alasql('SELECT * from emp where id='+ids[i])[0];
        // console.log('id ',emp);
        empLabel += '<tr><td><img height=40 class="img-circle" src="img/' + emp.id + '.jpg"></td><td>' + emp.name + '</td>';

        for(let j = 0 ; j<payData.length ; j++)
        {
            let payAmount = alasql('SELECT amount from payroll where emp= ? and item=?',[ids[i] , payData[j]["item"] ])[0]["amount"];
            empLabel += '<td>'+payAmount+'</td>';

        }

        empLabel += '</tr>';
    }
    $('#employee_name_show_change_payroll').html(empLabel);

}

$('.class_col_another_item_percentage ').keyup(function () {
    if( $(this).val() < 0)
    {
        alert("Reset percentage amount cannot be less than 0 . ");
        $(this).val(0);
    }

});

$('.class_col_1').keyup(function () {
    if($(this).val() < 0 )
    {
        alert("Reset amount cannot be negative . ");
        $(this).val(0);
    }

    if(typeof $(this).attr("max") !== 'undefined'){
        let l = parseFloat($(this).attr("max"));
        if($(this).val() >l)
        {
            alert("You cannot reset this payroll item over "+l);
            $(this).val(l);
        }


    }


});

$('.class_col_4').keyup(function () {


    if($(this).val() < 0 && parseFloat($(this).attr('min')) > $(this).val()){
        console.log(typeof  $(this).attr('min') );

        alert("You cannot decrease beyond "+Math.abs($(this).attr('min'))+'.');
        $(this).val($(this).attr('min')  );
    }

    if(typeof $(this).attr("max") !== 'undefined'){
        let l = parseFloat($(this).attr("max"));
        if($(this).val() >l)
        {
            alert("You cannot increase this payroll item over "+l);
            $(this).val(l);
        }


    }


});

$('.class_col_5').keyup(function () {
    if($(this).val() < -100)
    {
        alert("You cannot decrease any item beyond 100 % .");
        $(this).val(-100);
    }
});
















