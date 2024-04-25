document.getElementById("btn").addEventListener('click', () => {
    window.open("principal_empresa.html")
})

document.getElementById("cl").addEventListener('click', () => {
    window.open("principal_cliente.html?id="+encodeURIComponent(document.getElementsByName("cliente")[0].value))
})
