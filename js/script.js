
var json_file;
var userData = {};
$( document ).ready(function() {


    $.getJSON("form.json").fail(function(){
        alert("fail");
    }).done(function(json) {
        json_file = json;
    });

    $('.ui.radio.checkbox').checkbox();

    $('.dropdown').dropdown();

    $(".item").on("click", function(){
        if($('div[data-toggle="other-selection"]').css("display") == "block"){
          $('div[data-toggle="other-selection"]').css("display","none");
        };
    });

    $("#pdf-button").click(function(){
      print();
    });

    // assign data-answer attribute to each h4 to collect answers
    $("h4").each(function(){
      $(this).attr("data-answer","");
    });

    $("#test-button").click(function(){
      $("input, textarea").each(function(){
        var value = $(this).val();
        if(value){
          var element = $(this)[0].previousElementSibling;
          if(element != null && $(element)[0].tagName =="H4"){
            $(element).attr("data-answer", value);
          }
        }
      });

      $("h4").each(function(){
        userData[$(this).text()] = $(this).attr("data-answer");
      });

      $(".inline").each(function(){
        var title = $($(this)[0].previousElementSibling)[0].innerText;
        var checkedElement = $(this).find("input:checked").parent().find("label");
        userData[title] = $(checkedElement)[0].innerText;
      });

      $(".multiple-input-text-tags").each(function(){
        var title = $($(this).parents("fieldset")[0].previousElementSibling)[0].innerText;
        var tagsObj = [];
        if($(this).css("display") != "none"){
          for(var i of $(this).children()){
            var fields = $(i).find(".field");
            var obj = {};
            for(var j of fields){

              obj[$(j).find("h5").text()] = $(j).find("input").val();
            }
            tagsObj.push(obj);
          }
          userData[title] = tagsObj;
        }
      });


      $(".checkBoxArea-div").each(function(){
        var title = $($(this).parent()[0].previousElementSibling)[0].innerText;
        var tagsObj = [];
        if($(this).css("display") != "none"){
          for(var i of $(this).children()){
            var fields = $(i).find(".field");
            var obj = {};
            for(var j of fields){

              obj[$(j).find("h5").text()] = $(j).find("input").val();
            }
            tagsObj.push(obj);
          }
          userData[title] = tagsObj;
        }
        

        $(this).children().find("input[type='checkbox']").each(function(){
          if($(this).prop("checked")){
            var parentTitle = $($(this).parents(".checkBoxArea")[0].previousElementSibling)[0].innerText;
            userData[parentTitle] = {};
          }
        });


        $(this).children().find("input[type='checkbox']").each(function(){

          if($(this).prop("checked")){
            var parentTitle = $($(this).parents(".checkBoxArea")[0].previousElementSibling)[0].innerText;
            var tempObj = userData[parentTitle];
            var title = $(this).parent().find("label")[0].innerText;
            var childNodes = $(this).parent().children();
            var currentValue;
            for(var i of childNodes){
              var tagName = $(i)[0].tagName;
              switch(tagName){
                case "SELECT":
                  
                  var selectVal = $(i)[0].value;
                  if(selectVal!="other"){
                    tempObj[title]=selectVal;
                  }else{
                    currentValue = {};
                    for(var j of $($(i)[0].nextElementSibling).find("input")){
                      currentValue[$(j)[0].placeholder] = $(j)[0].value;
                    }
                    tempObj[title] = currentValue;
                  }
                  break;
                
                case "TEXTAREA":
                    tempObj[title] = $(i)[0].value;
                    break;
              
                case "INPUT":
                  if($(i)[0].value == "on" || $(i)[0].value == ""){
                    tempObj[title] = "checked";
                  }else{
                    tempObj[title] = $(i)[0].value;
                  }
                  break;
                }
            }
          }
        });
        
      });

      $(".multiple-dropdown").each(function(){
        var parentTitle = $($(this)[0].previousElementSibling)[0].innerText;
        var attributesList = [];
        var anchorTags = $(this).children(".multiple").find("a");
        for(var i of anchorTags){
          attributesList.push($(i).attr("data-value"));
        }

        userData[parentTitle] = attributesList;
      });
    });

    $(".add-tag-button").on("click", function(){
      var input_elements = $(this).parent().find(".argument-area").children();
      if(checkElements(input_elements)){
        var name = $(input_elements[0]).find("input").val()
        var tagArea = $(this).parent().find(".multiple-input-text-tags");
        $(this).parent().find(".multiple-input-text-tags").css("display","flex");
        tagArea.append(
          $("<div />",{class:"box"}).append(gatherInfo(input_elements),
            $("<i />",{class:"material-icons edit-test", text:"create"}),
            $("<i />",{class:"material-icons delete-button", text:"clear"})
          )
        );
        for(var i of tagArea.find("input")){
          $(i).attr("disabled","");
        }
        $(this).parent().find(".errorMessage").css("display", "none");
          
      }else{
        if($(this).parent().find(".errorMessage").css("display") != "block"){
          $(this).parent().find(".errorMessage").slideToggle();
        }
      }
    });

    $("body").on("click",".delete-button",function(){
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


    $("body").on("change", "input[type='radio']",function(){
      displayElements($(this),$(this).attr("data-area"));
      findQuestion($(this));
    });

    $("#checklist-button").on("click",function(){
      $.each(json_file, function(index, value){

          if(json_file[index]["input-value"]=="Yes"){
            $("#formV2").append(json_file[index]["checklist-item-body"]["item-body"]);
          }
      
      });

    });

    $("body").on("click", ".edit-test", function(){
      var elements = $(this).parent().parent().find("input");
      elements.removeAttr("disabled");
      for(var i of elements){
        $(i).css("border","1px solid grey");
      }
    });

    $("body").on("change", "input[type='number']", function(){
        if($(this).val() < 0){
          $(this).css("border","1px solid red");
          alert("Number must be positive");
        }else{
          $(this).css("border","1px solid green");
        }
    })

    $(".main-title").click(function(){
      var element = $(this)[0].nextElementSibling;
      $(element).slideToggle();
    
    });
});

function findQuestion(element){
  var questionElement;
  for(var i of element.parents()){
    if($(i).hasClass("fields")){
      questionElement = $(i)[0].previousElementSibling;
    }
  }
  indexIdIdentifier = $(questionElement).attr("id");
  if($(element).parent().find("label")[0].innerText=="Yes"){
    json_file[indexIdIdentifier]["input-value"] = "Yes";
  }else{
    json_file[indexIdIdentifier]["input-value"] = "No";
  }
}

function displayElements(element, areaToDisplay){
  if($(element).parent().find("label")[0].innerText == "Yes"){
    $("."+areaToDisplay).slideToggle();
  }else if($(element).parent().find("label")[0].innerText == "No" && $("."+areaToDisplay).css("display")=="block"){
    $("."+areaToDisplay).slideToggle();
  }
}

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
          $("<div />", {class:"field"}).append(
            $("<div />").append(
              $("<h5 />",{text:title}),
              $("<input />", {'type':'text','value':'Yes'})
            )
          )
        );
      }else{
        temp.push(
          $("<div />", {class:"field"}).append(
            $("<div />").append(
              $("<h5 />",{text:title}),
              $("<input />", {'type':'text','value':'No'})
            )
          )
        );
      }
    }else{
      if($(i).find("input").val()!=""){
        value = $(i).find("input").val();
        temp.push(
          $("<div />", {class:"field"}).append(
            $("<div />").append(
              $("<h5 />",{text:title}),
              $("<input />", {'type':'text','value':value})
            )
          )
        );
        $(i).find("input").val("");
      }else if($(i).find("select").val()=="other"){
        value = $(i).find("input").val();
        temp.push(
          $("<div />", {class:"field"}).append(
            $("<div />").append(
              $("<h5 />",{text:title}),
              $("<input />", {'type':'text','value':value})
            )
          )
        );
        $(i).find("input").val("");
      }else{
        value = $(i).find("select").val();
        temp.push(
          $("<div />", {class:"field"}).append(
            $("<div />").append(
              $("<h5 />",{text:title}),
              $("<input />", {'type':'text','value':value})
            )
          )
        );
        
      }
    }
  }
  return temp;
}



// Variant
// This one lets you improve the PDF sharpness by scaling up the HTML node tree to render as an image before getting pasted on the PDF.
function print(quality = 1) {
  var doc = new jsPDF()

  var json = JSON.parse(JSON.stringify(userData));
  Object.keys(json).forEach(function(key) {
    doc.text(20, 20, String(key));
  });
  // doc.text(20, 20, 'Hello world!')
  // doc.text(20, 30, 'This is client-side Javascript, pumping out a PDF.')
  // doc.addPage()
  // doc.text(20, 20, 'Do you like that?')
  doc.output('save', 'filename.pdf')
  return doc;
}