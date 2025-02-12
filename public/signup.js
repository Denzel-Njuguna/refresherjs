document.getElementById("signup_form").addEventListener('submit',function(event){
    event.preventDefault()

    const nameinput = document.getElementById("name_input").value.trim()
    const usernameinput = document.getElementById("username_input").value.trim()
    const password = document.getElementById("password").value.trim()


    if(!nameinput || !usernameinput || !password){
        document.getElementById("result").innerText = "you have to fill in all the fields"
    }

    try {
        fetch("/users",{
            method:"POST",
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                'name':nameinput,
                'username':usernameinput,
                'password':password
            })
        })
        .then(response => response.json())
        .then(data=>{
            if(!data.user){
                console.error('there was an error in the backend')
                document.getElementById("result").innerHTML = data.msg.map(err=>err.msg).join('<br>')
            }else{
                console.log('the backend was successful ')
                document.getElementById("result").innerHTML = `${data.msg}`
                window.location.href = data.redirectto
            }
        })
        .catch(error=>{
            alert(error)
        })
    } catch (error) {
        
    }
})
    