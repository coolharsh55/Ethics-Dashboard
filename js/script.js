
$( document ).ready(function() {


    $('.ui.radio.checkbox').checkbox();

    $('.dropdown').dropdown();

    $(".item").on("click", function(){
        if($('div[data-toggle="other-selection"]').css("display") == "block"){
          $('div[data-toggle="other-selection"]').css("display","none");
        };
    });

    $(".add-tag-button").on("click", function(){
      var input_elements = $(this).parent().find(".argument-area").children();
      if(checkElements(input_elements)){
        var name = $(input_elements[0]).find("input").val()
        var tagArea = $(this).parent().find(".multiple-input-text-tags");
        var otherInfo = gatherInfo(input_elements);
        $(this).parent().find(".multiple-input-text-tags").css("display","flex");
        tagArea.append(
          $("<div/>",{'class':'multiple-input-text-tag'}).append(
            $("<a/>", {'class':"ui label transition visible data-button", text:name}),
            $("<div />", {class:"ui popup top left transition hidden"}).append(
              $("<div />",{class:"ui flex"}).append(otherInfo)
            ),
            $("<i/>", {'class':"delete icon remove-icon", title:"remove"})
          )
        );
        $(this).parent().find(".errorMessage").css("display", "none");
          
      }else{
        if($(this).parent().find(".errorMessage").css("display") != "block"){
          $(this).parent().find(".errorMessage").slideToggle();
        }
      }
    });

    $("body").on("click",".delete",function(){
      $(this).parent().remove();
    });

    $('select').on('click', function() {
      if($(this).children().filter("option:selected").val()=="other"){
        $(this).parent().find(".other-option").slideToggle();
      }
    });

    $("body").on('change', "input[type='checkbox']" ,function() {
      if($(this).attr("name")=="age"){
        $(this).parent().find("select").slideToggle();
      }else if($(this).attr("name")=="gender"){
        $(this).parent().find("textarea").slideToggle();
      }else{
        $(this).parent().find("input[type='text']").slideToggle();
      }

    });


    $(".add-checkbox-option").on('click', function(){
      if($(this).parent().find("input").val()!=""){
        var value = $(this).parent().find("input").val();
        var div_tag = $("<div />");
        var input_checkbox = $("<input>", {type:"checkbox", id:value, name:value});
        var label_tag = $("<label />",{'for':value,text:value});
        var input_text = $("<input>", {type:"text",'class':"other-option",'placeholder':"Further Description",'style':"display:none"});
        div_tag.append(input_checkbox,label_tag,input_text);
        $(this).parent().parent().parent().find(".checkBoxArea-div").append(div_tag);
      }
    });


    $(".add-select-option").on("click", function(){
      if($(this).parent().find("input").val()!=""){
        var value = $(this).parent().find("input").val();
        var option_tag = $("<option />", {"text":value, "value":value});
        $(this).parent().parent().parent().find("select").append(option_tag);
        $(this).parent().parent().parent().find(".selection").append(
          $("<a/>",{class:"ui label transition visible",'data-value':"hair-colour",style:"display: inline-block !important;", text:value}).append(
          $("<i />",{class:"delete icon"})));
      }
    });

    $("body").on("click", ".data-button", function(){
      $(this).popup({
        on: 'hover'
      });
    });

});

function checkElements(input_elements){
  var inputOkay = [];
  var elementsArr = [];
  for(var i of input_elements){
    var arr = [...$(i)[0].children];
    var input_found = false;
    var select_found = false;
    var selectObj, inputObj;
    for(var i of arr.values()){
      if($(i)[0].tagName == "INPUT" && $(i)[0].type != "checkbox"){
        input_found = true;
        inputObj = $(i);
      }
      if($(i)[0].tagName == "SELECT"){
        select_found = true;
        selectObj = $(i);
      }
      elementsArr.push(determineOkayInput(input_found, select_found, inputObj, selectObj));
    }
    
    inputOkay.push(arrayBoolean(elementsArr));
    elementsArr = [];
  }
  
  return arrayBoolean(inputOkay);
}

function arrayBoolean(arr){
  var bool = arr[0];
  for(var i=1;i<arr.length;i++){
    bool &= arr[i];
  }
  return bool;
}

function determineOkayInput(input_found, select_found, inputObj, selectObj){
  if(input_found && select_found){
    if(selectObj[0].value == "other"){
      return inputObj[0].value != "" ? true : false;
    }else{
      return true;
    }
  }else if(input_found){
    return inputObj[0].value != "" ? true : false;
  }else{
    return true;
  }  
}

function gatherInfo(input_elements){
  var temp = [];
  for(var i of input_elements){
    var title = $(i).find("label").text();
    var value;
    if($(i).find("input")[0].type=="checkbox"){
      if($(i).find("input")[0].checked==true){
        temp.push(
          $("<div />", {class:"column"}).append(
            $("<h4 />", {text:title}),
            $("<input />", {'value':"Yes"})
          )
        );
      }else{
        temp.push(
          $("<div />", {class:"column"}).append(
            $("<h4 />", {text:title}),
            $("<input />", {'value':"No"})
          )
        );
      }
    }else{
      if($(i).find("input").val()!=""){
        value = $(i).find("input").val();
        temp.push(
          $("<div />", {class:"column"}).append(
            $("<h4 />", {text:title}),
            $("<input />", {'value':value})
          )
        );
        $(i).find("input").val("");
      }else if($(i).find("select").val()=="other"){
        value = $(i).find("input").val();
        temp.push(
          $("<div />", {class:"column"}).append(
            $("<h4 />", {text:title}),
            $("<input />", {'value':value})
          )
        );
        $(i).find("input").val("");
      }else{
        value = $(i).find("select").val();
        temp.push(
          $("<div />", {class:"column"}).append(
            $("<h4 />", {text:title}),
            $("<input />", {'value':value})
          )
        );
        
      }
    }
    
  }
  
  return temp;
}

// function chooseInputType(val){
//   for(var i of $("form").children()){
//     $(i).css("display", "none");
//   }
//   $.getJSON("form.json", function(json) {
//       var jsonObjectSize = Object.keys(json).length;
//       if(val<=jsonObjectSize){
//           var element = $("div[data-name="+json[val]["input"]+"]");
//           element.css("display", "block");
//           if(json[val]["arguments"]){
//             addAdditionalArguments(json[val], element);
//           }
//       }
//       if(json[val]["form-complete"]){
//         $("#final-submit-button").css("display","block");
//       }
//   });
// }



// function addToMultipleDropdown(){
//   return "<option value='MA'>Mason</option>"
// }


// function addToRadio(){
//   return "<div class='field'>\
//   <div class='ui radio checkbox'>\
//   <input type='radio' name='choice' checked='' tabindex='0' class='hidden'>\
//   <label>Maybe</label>\
//   </div>\
// </div>"
// }


// function addAdditionalArguments(arguments, element){
//   var argumentSize = Object.keys(arguments["arguments"]).length;
//   var argumentArea = $(element).find(".argument-area");
//   for(var i=0;i<argumentSize;i++){
//     if(arguments["arguments"][i]["input"]=="single-input"){
//         argumentArea.append(addSingleInput(arguments["arguments"][i]["title"],arguments["arguments"][i]["type"]));
//     }else if(arguments["arguments"][i]["input"]=="single-selector"){
//         argumentArea.append(addSingleSelector(arguments["arguments"][i]["options"], arguments["arguments"][i]["title"]));
//     }
//   }

//   argumentArea.append(
//       $("<button/>",{"type":'button' ,class:'multiple-input-text-button', id:"hello"}).append(
//           $("<i/>",{"class":'material-icons',"text":"add"})
//       )
//   );
// }

// function addSingleInput(name,type){
//   return  $('<div/>', {'class': 'field'}).append
//             (
//               $('<label/>', {"text":name}) ,
//               $('<input/>', {"class": 'multiple-input-text-box user-input', "type": type})
//             );
// }


// function addSingleSelector(options, title){
//   return $("<div/>" ,{class:'field' ,"data-name":'single-selector'}).append(
//             $('<label/>', {"text":title}),
//             $("<select/>", {class:"ui fluid dropdown data-user-value user-input"}).append(function(){
//               var optionList = [];
//               for(var i in options){
//                 optionList.push($("<option/>",{value:options[i],text:options[i]}));
//               }
//               return optionList;
//             })
//           );
// }
