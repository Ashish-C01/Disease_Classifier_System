document.querySelectorAll(".drop-zone__input").forEach((inputElement)=>{
    const dropzoneelement=inputElement.closest(".drop-zone"); /*moves from drop-zone-input to upper part until it find drop-zone class*/
    
    dropzoneelement.addEventListener("click",(e)=>{
        inputElement.click();
    });
    
    inputElement.addEventListener("change",(e)=>{
        if(inputElement.files.length){
            updateThumbnail(dropzoneelement,inputElement.files[0]);
        }
    });
    
    dropzoneelement.addEventListener("dragover",(e)=>{
        e.preventDefault();/* prevents default action*/
        dropzoneelement.classList.add("drop-zone--over");/*happens when user drags a file*/
    });

    ["dragleave","dragend"].forEach((type)=>{
        dropzoneelement.addEventListener((type),e=>{
            dropzoneelement.classList.remove("drop-zone--over");
        });
    });

    dropzoneelement.addEventListener("drop",(e)=>{
        e.preventDefault();
        if (e.dataTransfer.files.length){
            inputElement.files=e.dataTransfer.files;
            updateThumbnail(dropzoneelement,e.dataTransfer.files[0]);

        }
        dropzoneelement.classList.remove("drop-zone--over");
    });
 

});


function updateThumbnail(dropzoneelement,file){
    let thumbnailElement=dropzoneelement.querySelector(".drop-zone__thumb");


    //first time remove
    if(dropzoneelement.querySelector(".drop-zone__prompt")){
        dropzoneelement.querySelector(".drop-zone__prompt").remove();
    }




    //for first time
    if(!thumbnailElement){
        thumbnailElement=document.createElement("div");
        thumbnailElement.classList.add("drop-zone__thumb");
        dropzoneelement.appendChild(thumbnailElement);
    }

    thumbnailElement.dataset.label=file.name;


    //show thumbnail for image file
    if(file.type.startsWith("image/")){
        const reader=new FileReader();

        reader.readAsDataURL(file);
        reader.onload = () =>{
            console.log("hello");
            thumbnailElement.style.backgroundImage=`url('${reader.result}')`;
        };
    }
    else{
        thumbnailElement.style.backgroundImage=null;
    }
}

function malariaClassificationButton(){
    var files = document.getElementById("malaria_input_file").files;
    if (files.length == 0){
        alert("Image Not Uploaded !")
        return
    }
    var outputResult = document.getElementById("classificationOuputResultMalaria");
    outputResult.innerHTML = "";
    var formData = new FormData()

    formData.append("myfile",files[0])
    
    var request = new XMLHttpRequest();
    request.open("POST", "http://127.0.0.1:5000/malaria-classifier");
    request.send(formData);
    request.onreadystatechange = function(){
        if (request.readyState == XMLHttpRequest.DONE) {
            if (request.status == 200){
                var outputResult = document.getElementById("classificationOuputResultMalaria");
                // alert("Predicted");
                
                outputResult.innerHTML = JSON.parse(request.response)["result"]
            }else{
                alert("Something went wrong")
            }
        }
    }
    
}


function pneumoniaClassificationButton(){
    let files = document.getElementById("pneumonia_input_file").files;
    if (files.length == 0){
        alert("Image Not Uploaded !")
        return
    }
    var outputResult = document.getElementById("classificationOuputResultPneumonia");
    outputResult.innerHTML = "";

    var formData = new FormData()

    formData.append("myfile1",files[0])
    
    var request = new XMLHttpRequest();
    request.open("POST", "http://127.0.0.1:5000/pneumonia-classifier");
    request.send(formData);
    request.onreadystatechange = function(){
        if (request.readyState == XMLHttpRequest.DONE) {
            if (request.status == 200){
                let outputResult = document.getElementById("classificationOuputResultPneumonia");
                // alert("Predicted");
                outputResult.innerHTML = JSON.parse(request.response)["result"]
            }else{
                alert("Something went wrong")
            }
        }
    }
    
}

function liverClassificationButton(){


 
    const gend=document.getElementById('gender').value;
    let age=parseInt(document.getElementById('age').value);
    let totalb=parseFloat(document.getElementById('Total_b').value);
    let alkaline_p=parseFloat(document.getElementById('Alkaline_p').value);
    let alamine_a=parseFloat(document.getElementById('Alkaline_p').value);
    let total_p=parseFloat(document.getElementById('Total_p').value);
    let albumin_g=parseFloat(document.getElementById('Albumin_g').value);

 
    

    if(gend=='Male')
    {
        var gender=0;
    }
    else{
        var gender=1;
    }
    // if(!age || !totalb || !alkaline_p || !alamine_a || !total_p || !albumin_g){
    //     alert("please fill all values");
    //     return;
    // }
    if( Number.isNaN(age) || Number.isNaN(gender) || Number.isNaN(totalb) || Number.isNaN(alkaline_p) || Number.isNaN(alamine_a) || Number.isNaN(total_p) || Number.isNaN(albumin_g) ){
        alert("Please fill all values");
        return;
    }

    let outputResult = document.getElementById("classificationOuputResultLiver");
    outputResult.innerHTML="";
    val={
        'Age':age,
        'Gender':gender,
        'Total_b':totalb,
        'Alkaline_p':alkaline_p,
        'Alamine_a':alamine_a,
        'Total_protien':total_p,
        'Albumin_g':albumin_g
    }


    var request = new XMLHttpRequest();
    request.open("POST", "http://127.0.0.1:5000/test_liver");
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(JSON.stringify(val));
    console.log(val);
    // request.send(val);
    request.onreadystatechange = function(){
        if (request.readyState == XMLHttpRequest.DONE) {
            if (request.status == 200){
                let outputResult = document.getElementById("classificationOuputResultLiver");
                // alert("Predicted");
                outputResult.innerHTML = JSON.parse(request.response)["result"]+"% chances that you have liver disease";
        
            }else{
                alert("Something went wrong")
            }
        }
    }
    
}


function HeartClassificationButton(){

 
    const gend=document.getElementById('gender1').value;
    if(gend=='Male')
    {
        var gender=1;
    }
    else{
        var gender=0;
    }

    let age=parseInt(document.getElementById('age1').value);
    let cp=parseFloat(document.getElementById('CP').value);
    let trtbps=parseFloat(document.getElementById('trtbps').value);
    let chol=parseFloat(document.getElementById('chol').value);
    let fbs=parseFloat(document.getElementById('fbs').value);
    let recg=parseFloat(document.getElementById('rest_ecg').value);
    let thalachh=parseFloat(document.getElementById('thalachh').value);
    let exng=parseFloat(document.getElementById('exng').value);
    let oldpeak=parseFloat(document.getElementById('oldpeak').value);
    let slp=parseFloat(document.getElementById('slp').value);
    let caa=parseFloat(document.getElementById('caa').value);
    let thal=parseFloat(document.getElementById('thall').value);
    // if( !gender || !age || !cp || !trtbps || !chol || !fbs || !recg || !thalachh || !exng || !oldpeak || !slp || !caa || !thal ){
    //     alert("Please fill all values");
    //     console.log(age,gender,cp,trtbps,chol,fbs,recg,thalachh,exng,oldpeak,slp,caa,thal);
    //     return;
    // }
    if( Number.isNaN(gender) || Number.isNaN(age) || Number.isNaN(cp) || Number.isNaN(trtbps) || Number.isNaN(chol) || Number.isNaN(fbs) || Number.isNaN(recg) || Number.isNaN(thalachh) || Number.isNaN(exng) || Number.isNaN(oldpeak) || Number.isNaN(slp) || Number.isNaN(caa) || Number.isNaN(thal) ){
        alert("Please fill all values");
        return;
    }

    let outputResult = document.getElementById("classificationOuputResultHeart");
    outputResult.innerHTML = "";

   
    val={
        'Age':age,
        'Gender':gender,
        'CP':cp,
        'trtbps':trtbps,
        'Cholestrol':chol,
        'FBS':fbs,
        'Rest_ECG':recg,
        'Thallachh':thalachh,
        'EXNG':exng,
        'OldPeak':oldpeak,
        'SLP':slp,
        'CAA':caa,
        'Thal':thal

    }


    var request = new XMLHttpRequest();
    request.open("POST", "http://127.0.0.1:5000/test_heart");
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(JSON.stringify(val));
    console.log(val);
    // request.send(val);
    request.onreadystatechange = function(){
        if (request.readyState == XMLHttpRequest.DONE) {
            if (request.status == 200){
                let outputResult = document.getElementById("classificationOuputResultHeart")
                // alert("Predicted");
                outputResult.innerHTML = JSON.parse(request.response)["result"];
        
            }else{
                alert("Something went wrong")
            }
        }
    }
    
}


