
function submit_product(){
    alert('javascript front end has started')
    const productname = document.getElementById('product_name').value.trim()
    const productdescription = document.getElementById('product_description').value.trim()
    const images = document.getElementById('image_upload').files
    if (images.length > 5){
        return document.getElementById("responsemessage").innerText = "you have to upload less than five images"
    }

    if (!productname|| !productdescription || !images){
            alert("all fields must be filled")
            return
        }
    const formdata = new FormData()

    formdata.append("productdescription",productdescription)
    formdata.append("productname",productname)
    for (let i=0;i<images.length;i++){
        formdata.append("files",images[i])
    }

    
    try {
        alert("sending to the backend")
        fetch("/products",{
            method:'POST',
            body:formdata
        })
        .then(response=>response.json())
        .then(data =>{
            console.log(data)
            if (data.result) {
                document.getElementById('responsemessage').innerText = data.msg
                //i retrieve the redirectTo key and replace the url with it
                window.location.href = data.redirectto
            } else {
                alert(`${data.error}`)
            }
           })      
        .catch(error=>{
            console.log(error)
            document.getElementById('responsemessage').innerText = "error uploading file"
       
        })
    } catch (error) {
        alert(error)
    } 
}
    