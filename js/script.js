
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
      var tagArea = $(this).parent().find(".multiple-input-text-tags");
      var otherInfo = gatherInfo(input_elements);
      $(this).parent().find(".multiple-input-text-tags").css("display","flex");
      tagArea.append($("<div/>",{'class':'multiple-input-text-tag', 'data-position':'top center','title':  otherInfo}).append(
        $("<a/>", {'class':"ui label transition visible", text:$(input_elements[0]).find("input").val()}),
        $("<i/>", {'class':"delete icon remove-icon"})
      ));
    });


    $(".delete").click(function(){
      console.log("gfds");
    });

    $('select').on('click', function() {
      if($(this).children().filter("option:selected").val()=="other"){
        $(this).parent().find(".other-option").slideToggle();
      }
    });

    $("input[type='checkbox'").on('change', function() {
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
        alert($(this).parent().parent().parent());
      }
    });

});

function gatherInfo(input_elements){
  var temp = "";
  for(var i of input_elements){
    temp += " "+$(i).find("label").text()+":";
    if($(i).find("input").val() && $(i).find("select").val()=="other"){
      temp+=" " + $(i).find("input").val();
    }else{
      if($(i).find("select").val()){
        temp+=" " +$(i).find("select").val();
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
