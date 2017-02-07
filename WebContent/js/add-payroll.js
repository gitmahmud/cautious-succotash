var ids = $.url().param('p');

ids = ids.split(",");
for(let i =0;i<ids.length;i++)
{
    ids[i] = parseInt(ids[i]);
}
console.log(ids);


