/**
 * Created by rahman_ma-pc on 2/8/2017.
 */
var ids = $.url().param('p');

ids = ids.split(",");
for(let i =0;i<ids.length;i++)
{
    ids[i] = parseInt(ids[i]);
}
console.log(ids[0]);

var payData = alasql("SELECT * from payroll where emp = "+ids[0]);
// console.log("Payroll "+payData.length);

for(let i =0;i<payData.length ; i++)
{
    payData[i]["universal_amount"] = true;
    payData[i]["min_amount"] = payData[i]["amount"];

}

// console.log("Payroll "+payData);


for(let i =1;i<ids.length ; i++)
{
    let tempData = alasql("SELECT * from payroll where emp = "+ids[i]);

    for(let j = 0 ; j<payData.length ; j++)
    {
        let isContain = false;

        for(let k = 0 ;k<tempData.length ; k++)
        {
            if(payData[j]["item"] === tempData[k]["item"])
            {
                isContain = true;
                if(payData[j]["amount"] === tempData[k]["amount"])
                {
                    payData[j]["universal_amount"] = payData[j]["universal_amount"] && true;
                }
                else
                {
                    payData[j]["universal_amount"] = payData[j]["universal_amount"] && false;
                }
                payData[j]["min_amount"] = Math.min(payData[j]["min_amount"],tempData[k]["min_amount"]);

            }
        }

        if(!isContain)
        {
            payData.splice(j,1);
            j--;

        }


    }


}

// console.log("Payroll "+payData);



for(let i =0; i < payData.length ; i++) {
    console.log(i);
    let selectBoxId = "id_select_amount_percentage_"+i;
    let changeAmountId = "div_change_amount_"+i;
    let changePercentageId = "div_change_percentage_"+i;

    $('#tbody_change_payroll').append(
    '<tr><td class="col-sm-4">'+ payData[i]["item"] +'</td>'+
    '<td class="col-sm-3"><form class="form-inline"><div class="form-group">'+
    '<input type="number" class="form-control col-sm-2" placeholder="Amount" id="id_payroll_reset_amount" min="0"></div>'+
    '<div class="form-group"><button class="btn btn-primary" type="button" id="button_reset_amount">Reset</button></div></form></td>'+
    '<td class="col-sm-5"><form class="form-inline"><div class="form-group"><select class="form-control col-sm-2 " id='+selectBoxId+'>'+
    '<option>By Amount</option><option>By Percentage</option></select></div>'+
    '<div class="form-group " id="'+changeAmountId+'"><input type="number" class="form-control col-sm-2" placeholder="Amount" style="width: 100%"id="id_payroll_increase_decrease_amount"></div>'+
    '<div class="form-group " id="'+changePercentageId+'" style="display: none">'+
    '<input type="number" class="form-control col-sm-2" placeholder="%" style="width: 60%"id="id_payroll_increase_decrease_percentage" min="-100">'+
    '<label style="padding-left: 5%">    %</label> </div> <div class="form-group">' +
    '<button type="button" class="btn btn-primary">Adjust </button>  </div>   </form>    </td>     </tr>'
    );



}






















