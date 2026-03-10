async function fnConsultaCEP(){

    const CEP = '13470470'

    const resposta = await fetch(`http://viacep.com.br/ws/${CEP}/json/`)
    const data = await resposta.json();
    // console.log(data)

    if(resposta.status==200){
        console.log('===================')
        console.log(`CEP: ${data.cep}`)
        console.log(`CEP: ${data.logradouro}`)
        console.log(`CEP: ${data.bairro}`)
        console.log(`CEP: ${data.localidade}`)
        console.log(`CEP: ${data.estado}`)
        console.log('===================')
    } else {
        console.log('===================')
        console.log('ENDEREÇO NÂO ENCONTRADO')
        console.log('===================')
    }
}

fnConsultaCEP()