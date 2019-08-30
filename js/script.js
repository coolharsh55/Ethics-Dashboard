
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

    // $("#import-button").click(function(){
    //   $('.ui.modal').modal('show');
    // });

    $("#json-file-upload").click(function(){
      var jsonUploaded;
      $.getJSON("test.json").fail(function(){
          alert("fail");
      }).done(function(json) {
        var h4Tags = $("h4");
        var h4TagsObject = {};
        for(var i of h4Tags){
          h4TagsObject[$(i)[0].innerText] = i;
        }
        
        $.each(json, function(index, value){
          if(value != ""){
            var nextElementTarget = $(h4TagsObject[index])[0].nextElementSibling;
            insertValue(nextElementTarget, value);
          }
        });
      });

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
      download(JSON.stringify(userData, 2, null), userData["Project Title"], 'application/json');
    });

    $(".add-tag-button").on("click", function(){
      var input_elements = $(this).parent().find(".argument-area").children();
      if(checkElements(input_elements)){
        createInfoBox(this, input_elements, null);
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
      createCheckBox(this, null, null, null);
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
      var elements = $(this).parent().find("input");
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

function createInfoBox(element, input_elements, obj){
  var tagArea;
  if(obj!=null){
    var tagArea = $(element).find(".multiple-input-text-tags");
    $(element).find(".multiple-input-text-tags").css("display","flex");
    Object.keys(obj).forEach(function(key) {
      tagArea.append(
        $("<div />",{class:"box"}).append(gatherInfo(null, obj[key]),
          $("<i />",{class:"material-icons edit-test", text:"create"}),
          $("<i />",{class:"material-icons delete-button", text:"clear"})
        )
      );
    });
  }else{
    tagArea = $(element).parent().find(".multiple-input-text-tags");
    $(element).parent().find(".multiple-input-text-tags").css("display","flex");
    tagArea.append(
      $("<div />",{class:"box"}).append(gatherInfo(input_elements, null),
        $("<i />",{class:"material-icons edit-test", text:"create"}),
        $("<i />",{class:"material-icons delete-button", text:"clear"})
      )
    );
  }

  for(var i of tagArea.find("input")){
    $(i).attr("disabled","");
  }
  $(element).parent().find(".errorMessage").css("display", "none");
}

function insertValue(nextElementTarget, value){
  if($(nextElementTarget)[0].tagName=="DIV"){
    if($(nextElementTarget)[0].classList.value=="checkBoxArea"){
      // console.log($(nextElementTarget), value);
      var checkboxObject = {};
      var allCheckboxes = $(nextElementTarget).find("input[type='checkbox']");
      Object.keys(allCheckboxes).forEach(function(key) {
        checkboxObject[String($(allCheckboxes[key])[0].name).toLowerCase()] = $(allCheckboxes[key]);
      });
      Object.keys(value).forEach(function(key) {
        if(key.toLowerCase() in checkboxObject){
          checkboxObject[key.toLowerCase()].prop("checked",true);
          if(checkboxObject[key.toLowerCase()].parent().children("textarea").length){
            var checkboxTextArea = $(checkboxObject[key.toLowerCase()].parent().children("textarea"));
            checkboxTextArea.val(value[key]);
            checkboxTextArea.css("display","block");
          }else if(typeof value[key]==="object"){
            console.log(value[key]);
            var checkboxSelectArea = $(checkboxObject[key.toLowerCase()].parent().children("select"));
            checkboxSelectArea.val("other");
            checkboxSelectArea.css("display","inherit");
            var inputChildren = checkboxObject[key.toLowerCase()].parent().find(".age-range").children("input");
            for(var i of inputChildren){
              $(i).css("display", "block");
            }
          }else{
            var checkboxInputArea = $(checkboxObject[key.toLowerCase()].parent().children("input"));
            checkboxInputArea.val(value[key]);
            checkboxInputArea.css("display","inherit");
          }

        }else{
          createCheckBox(null, value, key, nextElementTarget);
        }
      });
    }else if($(nextElementTarget)[0].classList.value=="inline fields"){
      for(var i of $(nextElementTarget).find("label")){
        if($(i)[0].innerText == value){
          $(i).parent().find("input").prop("checked",true);
        }
      }
    }else{
    }
  }else if($(nextElementTarget)[0].tagName=="FIELDSET"){
    createInfoBox($(nextElementTarget), null, value);
  }else{
    $(nextElementTarget).val(value);
  }
}

function createCheckBox(element, obj, key, nextElementTarget){
  var checkboxValue, placeholder="Further Description", div_tag, input_checkbox, label_tag, input_text;
  if(element!=null){
    if($(element).parent().find("input").val()!=""){
      checkboxValue = $(element).parent().find("input").val();
      $(element).parent().parent().parent().find(".checkBoxArea-div").append(div_tag);
    }
  }else{
    checkboxValue = key.toLowerCase();
    placeholder = obj[checkboxValue];
  }
  var div_tag = $("<div />");
  var input_checkbox = $("<input>", {type:"checkbox", id:checkboxValue, name:checkboxValue, checked:true});
  var label_tag = $("<label />",{'for':checkboxValue,text:checkboxValue});
  var input_text = $("<input>", {type:"text",'class':"other-option",'placeholder':placeholder,'style':"display:block"});
  div_tag.append(input_checkbox,label_tag,input_text);
  if(element!=null){
    if($(element).parent().find("input").val()!=""){
      checkboxValue = $(this).parent().find("input").val();
      $(element).parent().parent().parent().find(".checkBoxArea-div").append(div_tag);
    }
  }else{
    $(nextElementTarget).find(".checkBoxArea-div").append(div_tag);
  }
}

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

function gatherInfo(input_elements, obj){
  var temp = [];
  if(obj!=null){
      Object.keys(obj).forEach(function(key) {
        temp.push(
          $("<div />", {class:"field"}).append(
            $("<div />").append(
              $("<h5 />",{text:key}),
              $("<input />", {'type':'text','value':obj[key]})
            )
          )
        );
      });
  }else{
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
  }
  return temp;
}



// Variant
// This one lets you improve the PDF sharpness by scaling up the HTML node tree to render as an image before getting pasted on the PDF.
function print(quality = 1) {
  var doc = new jsPDF()

  var json = JSON.parse(JSON.stringify(userData));
  var pageDown = 10;
  doc.setFontSize(9);
  Object.keys(json).forEach(function(key) {
    console.log(pageDown);

    if(pageDown%270==0){
      doc.addPage();
      pageDown=10;
    }
    var extraMarginBottom=0;
    doc.text(20, pageDown+=5, String(key)+":");
    if(Array.isArray(json[key])){
      for(var i of json[key]){
        if(typeof i === 'object'){
          Object.keys(i).forEach(function(key) {
            doc.text(25, pageDown+=5+(5*extraMarginBottom), String(key)+":");
            doc.text(65, pageDown, String(i[key]));
          });
        }
        doc.text(25, pageDown+=5, "");
      }
    }else if(typeof json[key] === 'object'){
      var obj = json[key];
      Object.keys(obj).forEach(function(key) {
        doc.text(25, pageDown+=5+(5*extraMarginBottom), String(key)+":");
        var splitTitle = doc.splitTextToSize(String(obj[key]), 125);
        extraMarginBottom = splitTitle.length;
        console.log("extraM:", extraMarginBottom);
        doc.text(65, pageDown, splitTitle);

      });
    }else{
      doc.text(25, pageDown+=5+(5*extraMarginBottom), String(json[key]));
    }
    
  });
  // doc.text(20, 20, 'Hello world!')
  // doc.text(20, 30, 'This is client-side Javascript, pumping out a PDF.')
  // doc.addPage()
  // doc.text(20, 20, 'Do you like that?')
  doc.output('save', String(json["Project Title"]) + '.pdf');
  return doc;
}

function download(data, filename, type) {
  var file = new Blob([data], {type: type});
  if (window.navigator.msSaveOrOpenBlob) // IE10+
      window.navigator.msSaveOrOpenBlob(file, filename);
  else { // Others
      var a = document.createElement("a"),
      url = URL.createObjectURL(file);
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(function() {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);  
      }, 0); 
  }
}