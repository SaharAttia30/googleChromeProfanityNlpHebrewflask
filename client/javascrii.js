function whatToTakeFlages(textNodes){
  let res =[];
  for (let i = 0; i < textNodes.length; i++) {
    if(textNodes[i].nodeValue.includes(' ') && /[א-ת]/.test(textNodes[i].nodeValue)){
      res.push("1");
    }
    else{
      res.push("0");
    }
  }
  return res;
}

function whatToTakeArray(textNodes){
  let res =[];
  for (let i = 0; i < textNodes.length; i++) {
    if(textNodes[i].nodeValue.includes(' ') && /[א-ת]/.test(textNodes[i].nodeValue)){
      res.push(textNodes[i].nodeValue);
    }
    else{
    }
  }
  return res;
}

async function getSwearArray(res_str_to_send){
  let response = await fetch('http://localhost:3000/', {
      method: 'POST',
      body: JSON.stringify({ res_str_to_send }),
      headers: { 'Content-Type': 'application/json' },
  })
  var myJSON_Text = await response.text();
  let is_swear_arr_res = myJSON_Text.split(',');
  return is_swear_arr_res;
}

function getTextNodesInPage() {
  const textNodes = [];
  const iterator = document.createNodeIterator(
    document.body,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );

  let currentNode;
  while (currentNode = iterator.nextNode()) {
    if (currentNode.nodeType === Node.TEXT_NODE) {
      textNodes.push(currentNode);
    }
  }
  return textNodes;
}

function getHebTrimedArrToSend(first_is_taken_arr_function){
  let first_is_taken_arr = first_is_taken_arr_function;
  for (let i = 0; i < first_is_taken_arr.length ; i++) {
    let res = "";
    for (let j = 0; j < first_is_taken_arr[i].length ; j++) {
      if(/[א-ת]/.test(first_is_taken_arr[i][j]) || first_is_taken_arr[i][j] == " "){
        res = res + first_is_taken_arr[i][j];
      }
    }
    first_is_taken_arr[i] = res;
    first_is_taken_arr[i].trim();
  }
  return first_is_taken_arr;
}
function postResToPage(textNodes, is_swear_arr_res, first_flag_is_taken_arr,first_is_taken_arr){
  let count = 0;

  for (let i = 0; i < textNodes.length ; i++) {
    if(first_flag_is_taken_arr[i] == "1") {
      if(is_swear_arr_res[count] == "1"){
        let temp_star = "";
        for (let j = 0; j < textNodes[i].nodeValue.length ; j++) {
          if(/[א-ת]/.test(textNodes[i].nodeValue[j])){
            temp_star += "*";
          }
          else{
            temp_star += textNodes[i].nodeValue[j];
          }
        }
        textNodes[i].nodeValue = temp_star;
      }
      count += 1;
      if(count == first_is_taken_arr.length){
        break;
      }
    }
  }
  return true;
}
async function blurCussWords() {
  const textNodes = getTextNodesInPage();
  let first_is_taken_arr_to_func = whatToTakeArray(textNodes);
  let first_flag_is_taken_arr = whatToTakeFlages(textNodes);
  let first_is_taken_arr = getHebTrimedArrToSend(first_is_taken_arr_to_func);
  let res_str_to_send = first_is_taken_arr.join(",");
  let is_swear_arr_res = await getSwearArray(res_str_to_send);
  console.log(is_swear_arr_res);
  console.log(first_is_taken_arr);
  let res = false;
  res = postResToPage(textNodes,is_swear_arr_res,first_flag_is_taken_arr,first_is_taken_arr);
  if(res){
    console.log("Page has been corrected");
  }
  else{
    console.log("there was a problem");
  }
}

window.addEventListener("load", blurCussWords);