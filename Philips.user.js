
// ==UserScript==
// @name Philips
// @description 123 
// @author ET
// @license MIT
// @version 1.3
// @match http://*/*
// ==/UserScript==



        var  get_el_body = document.getElementsByTagName('body')[0];
        var  newInput=document.createElement('a');
             newInput.innerHTML="♥";
             newInput.id='love';
             newInput.href="#";
             var w_space = document.createElement('span');
             w_space.innerHTML = " = ";



             document.getElementsByClassName('nou')[0].getElementsByTagName('u')[0].innerHTML += "Hi";
             document.getElementsByClassName('header_menu_item user')[0].appendChild(w_space);
             document.getElementsByClassName('header_menu_item user')[0].appendChild(newInput);



        var input_user_file_wrap = document.createElement('div');
            input_user_file_wrap.id = "input_user_file_wrap";
            get_el_body.appendChild(input_user_file_wrap);

        var input_user_file = document.createElement('input');
            input_user_file.type = "file";
            input_user_file.id = "input_user_file";
            input_user_file.setAttribute('multiple', true);
            document.getElementById('input_user_file_wrap').appendChild(input_user_file);

        var plus_file = document.createElement('span');
            plus_file.innerHTML = "+";
            plus_file.id = "plus_file";
            document.getElementById('input_user_file_wrap').appendChild(plus_file);

        var get_files = document.getElementById('input_user_file');
        

window.onload = function () 

    {

        var catalog = {};

        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; 
        var yyyy = today.getFullYear();

        if(dd<10) { dd='0'+dd }; 

        if(mm<10) { mm='0'+mm };

        today = dd+'_'+mm+'_'+yyyy;



        var osnova = function () 

        {

            for (var j = 0; j < get_files.files.length; j++)  {
                
                var file_name = get_files.files[j].name;
                
                if (file_name=="DSC03524.htm") {

                    var reader = new FileReader();
                    reader.onload = function (e)
        
                    { 

                        var parser = new DOMParser();
                                                
                        var balance_file = e.target.result.match(/<tr>[\s\S]+?<\/tr>/gm);
                        
                        for (var k = 0; k < balance_file.length; k++) {
                            
                            var balance = parser.parseFromString(balance_file[k], "text/xml");                             
                            
                            if (balance.getElementsByTagName('tr')[0].getElementsByTagName('td').length == 5) {

                            var balance_td = balance.getElementsByTagName('tr')[0].getElementsByTagName('td');

                                  
                                    var model_string = balance_td[2].getElementsByTagName('p')[0].getElementsByTagName('span')[0].innerHTML.replace(/\s/g, '');
                                        console.log(model_string)

                                    var price_number = balance_td[4].getElementsByTagName('p')[0].getElementsByTagName('span')[0].innerHTML.replace(/,/g,'');
                                        price_number2 = parseInt(price_number);
                                        console.log(price_number2)
                                    var balance_number = parseInt(balance_td[3].getElementsByTagName('p')[0].getElementsByTagName('span')[0].innerHTML);
                                        console.log(balance_number)
                                    var descript = balance_td[1].getElementsByTagName('p')[0].getElementsByTagName('span')[0].innerHTML;
                                        console.log(descript)
                                    var bar = balance_td[0].getElementsByTagName('p')[0].getElementsByTagName('span')[0].innerHTML;
                                        console.log(bar)
                                    
                                    catalog['item'+k] = { 
                                        model: model_string,
                                        price: price_number2,
                                        balance1: balance_number,
                                        description: descript, 
                                        barcode: bar
                                    };
                                     
                                };
                                
                            };

                        };

                    };

                reader.readAsText(get_files.files[j]);
               

                if (file_name=="SUPER.htm")  {
                
                    var reader2 = new FileReader();
                    reader2.onload = function (e) 

                    {
                                         
                        var parser2 = new DOMParser();
                        var sales_file = e.target.result.match(/<tr>[\s\S]+?<\/tr>/gm);  
                         
                        for ( var i = 0; i < sales_file.length; i++) {
                        
                            var sales = parser2.parseFromString(sales_file[i], "text/xml");                             

                            var sales_td = sales.getElementsByTagName('tr')[0].getElementsByTagName('td');
  
                            for (var item in catalog) {
                                
                                if(sales_td.length == 6 && sales_td[5].getElementsByTagName('p')[0].innerHTML == catalog[item].barcode) {

                                    console.log('sales_4')

                                    var sold_number = parseInt(sales_td[3].getElementsByTagName('p')[0].innerHTML);     
                                    var sold_price_num = sales_td[4].getElementsByTagName('p')[0].innerHTML;
                                        sold_price_num2 = parseInt(sold_price_num);
                                    
                                    console.log(sold_price_num2)

                                    catalog[item].sold =  sold_number;
                                    catalog[item].sold_price =  sold_price_num2;
                                            
                                };
                          
                            };

                        };

                        // for (var key in catalog) {console.log(catalog[key])};

                    };   
                         
   
                };
                                             
                reader2.readAsText(get_files.files[j]);
                
            };

            var json = JSON.stringify(catalog);
            var blob = new Blob([json], {type: "application/json"});
            var url  = URL.createObjectURL(blob);

            var a = document.createElement('a');
            a.download    = "Philips-"+today+".json";
            a.href        = url;
            a.click(); 

        
        };

    function massiv() {  

        var get_td = document.getElementsByTagName('td'), out = [];
        for (var i=0; i < get_td.length; i++) {
            for ( var item in catalog) {
                if (get_td[i].firstChild != undefined && catalog[item].model==get_td[i].firstChild.nodeValue && catalog[item].sold == true) {
                    out.push([
                        get_td[i].nextSibling,
                        [
                            get_td[i].nextSibling.nextSibling.getElementsByTagName('div')[1].getElementsByTagName('input')[0], 
                            catalog[item].sold
                        ],
                        [
                            get_td[i].nextSibling.nextSibling.getElementsByTagName('div')[1].getElementsByTagName('input')[1], 
                            catalog[item].price
                        ],
                        get_td[i].nextSibling.nextSibling.getElementsByTagName('div')[1].getElementsByTagName('a')[0]
                    ]);
                };
            };
        };
     
        console.log('123')

        var i = out.length;

        (function re(){
            if(!i--) return; 
            out[i][0].click();
            out[i][1][0].value = out[i][1][1];    
            out[i][2][0].value = out[i][2][1];
            if (out[i][1][0].value!='' || out[i][2][0].value!='') {
               //out[i][3].click();
            }
            else {
                alert('123');
            }
            setTimeout(re, 1000)
        }());

    };

    document.getElementById('love').addEventListener('click', massiv, false);

    function addListenerMulti(el, s, fn) {
        
        var evts = s.split(' ');
        
        for (var i=0, iLen=evts.length; i<iLen; i++) {
        
            el.addEventListener(evts[i], fn, false);
        
        }
    }

    addListenerMulti(get_files, 'drop change', osnova);


};
