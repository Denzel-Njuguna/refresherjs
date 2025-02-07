
function submit_product(){
    const productname = document.getElementById('product_name').value.trim()
    const productdescription = document.getElementById('product_description').value.trim()
    const image = document.getElementById('image_upload').files[0]

    if (!productname|| !productdescription || !image){
            alert("all fields must be filled")
            return
        }
    const formdata = new FormData()

    formdata.append("productdescription",productdescription)
    formdata.append("productname",productname)
    formdata.append("image",image)

    
    fetch("/testing",{
        method:'POST',
        body:formdata
    })
    .then(response=>response.json())
    .then(data =>{
        console.log(data)
        document.getElementById('responsemessage').innerText = data.message
        //i retrieve the redirectTo key and replace the url with it 
        if(data.redirectTo){
            window.location.href = data.redirectTo
        }
       })      
    .catch(error=>{
        console.log(error)
        document.getElementById('responsemessage').innerText = "error uploading file"
   
    }) 
}
    