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
                payData[j]["min_amount"] = Math.min(payData[j]["min_amount"], tempData[k]["min_amount"]);

            }
        }

        if (!isContain) {
            payData.splice(j, 1);
            j--;

        }


    }


}

// console.log("Payroll "+payData);


for (let i = 0; i < payData.length; i++) {
    console.log(i);
    // let selectBoxId = "id_select_amount_percentage_"+i;
    // let changeAmountId = "div_change_amount_"+i;
    // let changePercentageId = "div_change_percentage_"+i;
    let row_name = "class_row_" + i;
    let button_reset_class = payData[i]["universal_amount"] ? "btn-primary" : "btn-warning";


    $('#tbody_change_payroll').append(
        '<tr><td class="col-sm-4 class_col_0 ' + row_name + '">' + payData[i]["item"] + '</td>' +
        '<td class="col-sm-3"><form class="form-inline"><div class="form-group">' +
        '<input type="number" class="form-control col-sm-2 class_col_1 ' + row_name + '" placeholder="Amount"  min="0"></div>' +
        '<div class="form-group"><button class="btn ' + button_reset_class + ' class_col_2 ' + row_name + '" type="button" >Reset</button></div></form></td>' +
        '<td class="col-sm-5"><form class="form-inline"><div class="form-group"><select class="form-control col-sm-2 class_col_3 ' + row_name + '" >' +
        '<option>By Amount</option><option>By Percentage</option></select></div>' +
        '<div class="form-group class_div_amount ' + row_name + '" ><input type="number" class="form-control col-sm-2 class_col_4 ' + row_name + '" placeholder="Amount" style="width: 100%" value="0"></div>' +
        '<div class="form-group class_div_percentage ' + row_name + '" style="display: none;" >' +
        '<input type="number" class="form-control col-sm-2 class_col_5 ' + row_name + '" placeholder="%" style="width: 60%" min="-100" value="0">' +
        '<label style="padding-left: 5%">    %</label> </div> <div class="form-group">' +
        '<button type="button" class="btn btn-primary class_col_6 ' + row_name + '">Adjust </button>  </div>   </form>    </td>     </tr>'
    );


}


$(" .class_col_2 ").on('click', function () {
        let arr = $(this).attr("class").split(" ");
        let arr_row = arr[arr.length - 1];
        let pay_item_name = $(".class_col_0." + arr_row).text();
        let pay_reset_amount = parseInt($(".class_col_1." + arr_row).val());

        console.log(pay_item_name + " " + pay_reset_amount);

            for (let i = 0; i < ids.length; i++) {
                alasql("UPDATE payroll SET amount = ? WHERE emp = ? and item = ?", [pay_reset_amount, ids[i], pay_item_name]);

            }


    }
);

$(" .class_col_6 ").on('click', function () {
        let arr = $(this).attr("class").split(" ");
        let arr_row = arr[arr.length - 1];
        let pay_item_name = $(".class_col_0." + arr_row).text();



        if($(".class_col_3."+arr_row).find(":selected").text() === "By Amount" )
        {
            let pay_change_amount =  parseInt($(".class_col_4." + arr_row).val());

            console.log(pay_item_name +" "+ pay_change_amount);

            if (pay_change_amount < 0) {
                for (let i = 0; i < ids.length; i++) {

                    alasql("UPDATE payroll SET amount = amount - ? WHERE emp = ? and item = ?", [Math.abs(pay_change_amount) , ids[i], pay_item_name]);

                }

            }
            else {
                for(let i =0;i<ids.length ; i++)
                {
                    alasql("UPDATE payroll SET amount = amount + ? WHERE emp = ? and item = ?", [pay_change_amount , ids[i], pay_item_name]);

                }

            }

        }
        else
        {
            let pay_change_percent = parseInt($(".class_col_5." + arr_row).val())/100;

            console.log(pay_item_name+" "+pay_change_percent);

            if (pay_change_percent < 0) {
                for (let i = 0; i < ids.length; i++) {

                    alasql("UPDATE payroll SET amount = amount * ? WHERE emp = ? and item = ?", [1-Math.abs(pay_change_percent) , ids[i], pay_item_name]);

                }

            }
            else {
                for(let i =0;i<ids.length ; i++)
                {
                    alasql("UPDATE payroll SET amount = amount + amount * ? WHERE emp = ? and item = ?", [pay_change_percent , ids[i], pay_item_name]);

                }

            }



        }




    }
);

























