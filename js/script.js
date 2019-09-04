
var json_file;
var userData = {};
$( document ).ready(function() {



    //this function is no longer being used, but can be used to build the form from a simple json structure
    // $.getJSON("form.json").fail(function(){
    //     alert("fail");
    // }).done(function(json) {
    //     json_file = json;
    // });


    //semantic ui script components
    $('.ui.radio.checkbox').checkbox();

    $('.dropdown').dropdown();


    $(".item").on("click", function(){
        if($('div[data-toggle="other-selection"]').css("display") == "block"){
          $('div[data-toggle="other-selection"]').css("display","none");
        };
    });


    //trigger pdf creation
    $("#pdf-button").click(function(){
      print();
    });

    // $("#import-button").click(function(){
    //   $('.ui.modal').modal('show');
    // });

    $("#json-file-upload").click(function(){

      //hard coded path to a test json file to re-populate the fields from a previous partially filled-in form from the user
      $.getJSON("test.json").fail(function(){
          alert("fail");
      }).done(function(json) {

        // a mapping from titles to the h4 DOM objects, to allow for easy navigation to user input elements
        var h4Tags = $("h4");
        var h4TagsObject = {};
        for(var i of h4Tags){
          h4TagsObject[$(i)[0].innerText] = i;
        }
        
        $.each(json, function(index, value){
          if(value != ""){
            var nextElementTarget = $(h4TagsObject[index])[0].nextElementSibling;  //gets teh DIV or INPUT element, where we insert the data
            insertValue(nextElementTarget, value);
          }
        });
      });

    });

    // assign data-answer attribute to each h4 to collect answers
    $("h4").each(function(){
      $(this).attr("data-answer","");
    });


    //creates the json file for the user
    $("#test-button").click(function(){

      // add the input, textarea value to the data-answer attribute in the h4 tag
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


      //handling radio elements
      $(".inline").each(function(){
        var title = $($(this)[0].previousElementSibling)[0].innerText;// find the radio area title (h4 tag)
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
        

        //create an object containing titles mapped to empty objects
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


    //create a an info box for section like supervisors and researchers
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

    //remove data from researchers and supervisors
    $("body").on("click",".delete-button",function(){
      $(this).parent().remove();
    });

    //show radio button "further description" area
    $('select').on('click', function() {
      if($(this).children().filter("option:selected").val()=="other"){
        $(this).parent().find(".other-option").slideToggle();
      }
    });


    //show the extra text area for checkboxes
    $("body").on('change', "input[type='checkbox']" ,function() {
      if($(this).attr("name")=="age"){
        $(this).parent().find("select").slideToggle();
      }else if($(this).attr("name")=="gender"){
        $(this).parent().find("textarea").slideToggle();
      }else{
        $(this).parent().find("input[type='text']").slideToggle();
      }

    });


    // add new checkbox for the user
    $(".add-checkbox-option").on('click', function(){
      createCheckBox(this, null, null, null);
    });


    //adds option to multiple dropdown area
    $(".add-select-option").on("click", function(){
      if($(this).parent().find("input").val()!=""){
        var value = $(this).parent().find("input").val();
        var option_tag = $("<option />", {"text":value, "value":value});
        $(this).parent().parent().parent().find("select").append(option_tag);
        $(this).parent().parent().parent().find(".selection").append(
          $("<a/>",{class:"ui label transition visible",'data-value':value,style:"display: inline-block !important;", text:value}).append(
          $("<i />",{class:"delete icon"})));
      }
    });

    // $("#checklist-button").on("click",function(){
    //   $.each(json_file, function(index, value){

    //       if(json_file[index]["input-value"]=="Yes"){
    //         $("#formV2").append(json_file[index]["checklist-item-body"]["item-body"]);
    //       }
      
    //   });

    // });

    //allow users to change the values for supervisors and researchers
    $("body").on("click", ".edit-test", function(){
      var elements = $(this).parent().find("input");
      elements.removeAttr("disabled");
      for(var i of elements){
        $(i).css("border","1px solid grey");
      }
    });

    //check if all numbers enetered are positive
    $("body").on("change", "input[type='number']", function(){
        if($(this).val() < 0){
          $(this).css("border","1px solid red");
          alert("Number must be positive");
        }else{
          $(this).css("border","1px solid green");
        }
    })

    //allows for dropdown section on the index.html front end
    $(".main-title").click(function(){
      var element = $(this)[0].nextElementSibling;
      $(element).slideToggle();
    
    });
});

function createInfoBox(element, input_elements, obj){
  //this function creates the information boxes for supervisors and researchers
  var tagArea;
  if(obj!=null){
    // this if gets exectued if the user  adds information
    var tagArea = $(element).find(".multiple-input-text-tags");
    $(element).find(".multiple-input-text-tags").css("display","flex");

    //loop through all of the inputs to get the values, gatherInfo will create the html element to show the data and to allow the user to edit it.
    Object.keys(obj).forEach(function(key) {
      tagArea.append(
        $("<div />",{class:"box"}).append(gatherInfo(null, obj[key]),
          $("<i />",{class:"material-icons edit-test", text:"create"}),
          $("<i />",{class:"material-icons delete-button", text:"clear"})
        )
      );
    });
  }else{
    // this else get executed when retrieving information from a json file
    tagArea = $(element).parent().find(".multiple-input-text-tags");
    $(element).parent().find(".multiple-input-text-tags").css("display","flex");
    tagArea.append(
      $("<div />",{class:"box"}).append(gatherInfo(input_elements, null),
        $("<i />",{class:"material-icons edit-test", text:"create"}),
        $("<i />",{class:"material-icons delete-button", text:"clear"})
      )
    );
  }

  //automatically disable all the info box until the user presses the edit button
  for(var i of tagArea.find("input")){
    $(i).attr("disabled","");
  }
  $(element).parent().find(".errorMessage").css("display", "none");
}

function insertValue(nextElementTarget, value){

  if($(nextElementTarget)[0].tagName=="DIV"){
    if($(nextElementTarget)[0].classList.value=="checkBoxArea"){
      var checkboxObject = {};
      var allCheckboxes = $(nextElementTarget).find("input[type='checkbox']");
      //map the checkboxes to the lowercase id of that checkbox. This allows for easy access to the checkbox element from the uploaded json file
      Object.keys(allCheckboxes).forEach(function(key) {
        checkboxObject[String($(allCheckboxes[key])[0].name).toLowerCase()] = $(allCheckboxes[key]);
      });

      //scan through the uploaded json checkboxes 
      Object.keys(value).forEach(function(key) {
        if(key.toLowerCase() in checkboxObject){
          checkboxObject[key.toLowerCase()].prop("checked",true); //check teh user specified checkboxes

          //some checkboxes have further description areas, whic we need to fill automatically with the user values 
          if(checkboxObject[key.toLowerCase()].parent().children("textarea").length){
            var checkboxTextArea = $(checkboxObject[key.toLowerCase()].parent().children("textarea"));
            checkboxTextArea.val(value[key]);
            checkboxTextArea.css("display","block");
          }else if(typeof value[key]==="object" || checkboxObject[key.toLowerCase()].parent().children("select").length){
            var dic = value[key];
            var checkboxSelectArea = $(checkboxObject[key.toLowerCase()].parent().children("select"));
           if(typeof value[key] !== 'object'){
            checkboxSelectArea.val(value[key]);
           }else{
            // this area automatically fills the Min and Max age for the Age checkbox
            checkboxSelectArea.val("other");
            var inputChildren = checkboxObject[key.toLowerCase()].parent().find(".age-range").children("input");
            for(var i of inputChildren){
              $(i).css("display", "block");
              if($(i).attr("placeholder")=="Max"){
                $(i).val(dic["Max"]);
              }else{
                $(i).val(dic["Min"]);
              }
            }
           }
           checkboxSelectArea.css("display","inherit");
          }else{
            var checkboxInputArea = $(checkboxObject[key.toLowerCase()].parent().children("input"));
            checkboxInputArea.val(value[key]);
            checkboxInputArea.css("display","inherit");
          }
        }else{
          //if the user has a saved checkbox that doesnt currently exist in the form then we must create that checkbox and add it
          createCheckBox(null, value, key, nextElementTarget);
        }
      });
    }else if($(nextElementTarget)[0].classList.value=="inline fields"){
      // handle the radio inputs
      // find the correpsonding label to the input and check it true
      for(var i of $(nextElementTarget).find("label")){
        if($(i)[0].innerText == value){
          $(i).parent().find("input").prop("checked",true);
        }
      }
    }else{
      //multiple dropwdon area
     
      var selectArea = $(nextElementTarget).find("select");
      var options = $(selectArea).find("option");
      var currentValues = [];
      var menuArea = $(selectArea).parent().find(".menu");
      // console.log("values", value);
      // console.log("options", options);

      for(var i of $(menuArea)[0].children){
        currentValues.push($(i).attr("data-value"));
      }
      // console.log(currentValues);

      for(var i of value){
        if(!(currentValues.includes(i))){
          $(menuArea).append(
            $("<div />", {class:"item", "data-value":i, text:i})
          );
        }
      }

      // console.log("menu:", $(selectArea).parent().find(".menu"));
      // <div class="item" data-value="SUS">SUS</div>

      for(var j of menuArea){
        // // $(j).click();
        // console.log("test:", j);
        for(var x of $(j)[0].children){
          console.log("item", $(x));
          if(value.includes($(x).attr("data-value"))){
            $(x).click();
          }
        }
      }

      // console.log($(selectArea).parent().find(".menu"));
      // for(var i of options){
      //   attributeMapping[$(i)[0].value] = $(i);
      // }
      // console.log(attributeMapping);
      // for(var i of value){
      //   console.log("value:",i);
      //   if(i in attributeMapping){
      //     console.log(attributeMapping[i]);
      //   }else{
      //     var userChoice = $("<option/>" ,{value:i, text:i});
      //     $(selectArea).append(userChoice);
      //     $(userChoice).click();
      //     $(selectArea).parent().parent().find("input[type='text']").val(i);
      //     $(selectArea).parent().parent().find("button").click();
      //   }
      //   for(var j of $(selectArea).parent().parent().find(".item")){
      //     if($(j)[0].text == i){
      //       $(j).css("background-color","red");
      //     }
      //   }
      // }

      // for(var j of $(selectArea).parent().find(".menu")){
      //   if($(j)[0].text == i){
      //     $(j).css("background-color","red");
      //   }
      //   $(j).click();
      //   console.log($($(j)[0].children).length);
      //   for(var x of $(j)[0].children){
      //     console.log(x);
      //     $(x).click();
      //   }
      // }
      // console.log($(selectArea).parent().parent().find(".item"));

      // console.log(" ");
    }
  }else if($(nextElementTarget)[0].tagName=="FIELDSET"){
    createInfoBox($(nextElementTarget), null, value);
  }else{
    $(nextElementTarget).val(value);
  }
}

function createCheckBox(element, obj, key, nextElementTarget){
  var checkboxValue, placeholder="Further Description", div_tag, input_checkbox, label_tag, input_text;

  //create checkbox if user is not using an uploaded json file
  if(element!=null){
    if($(element).parent().find("input").val()!=""){
      checkboxValue = $(element).parent().find("input").val();
      $(element).parent().parent().parent().find(".checkBoxArea-div").append(div_tag);
    }
  }else{
    checkboxValue = key.toLowerCase();
    placeholder = obj[checkboxValue];
  }

  //create new checkbox with specified value
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


// this function is used to check that all fields of supervisors and researchers are correctly filled in
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


//PDF creater
function print(quality = 1) {
  var doc = new jsPDF()
  //userData is a f=global javascript object containing all of the current user information
  var json = JSON.parse(JSON.stringify(userData));
  var pageDown = 10; //every sentence is 10 units above or below eachother 
  var newPageNumber = 270; //create a new page every 270 units;
  doc.setFontSize(9);
  Object.keys(json).forEach(function(key) {

    // create a new page 
    if(pageDown%newPageNumber==0){
      doc.addPage();
      pageDown=10;
    }

    var extraMarginBottom=0;
    doc.text(20, pageDown+=5, String(key)+":"); // add text to PDF page

    /*
      If the corresponding value from a key ian an object or array, then we must loop through these values to print them
    */
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
        var splitTitle = doc.splitTextToSize(String(obj[key]), 125);         //split any lines that may be to big for the page into multiple lines to form a paragraph
        extraMarginBottom = splitTitle.length;
        doc.text(65, pageDown, splitTitle);

      });
    }else{
      doc.text(25, pageDown+=5+(5*extraMarginBottom), String(json[key]));
    }
    
  });
  doc.output('save', String(json["Project Title"]) + '.pdf');
  return doc;
}


//downloads the generated JSON 
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