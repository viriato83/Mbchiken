

export default class  Mortalidade{

    constructor(descricao,quantidade,data,idade,lote){
        this.descricao = descricao;
        this.quantidade = quantidade;
        this.data = data;
        this.idade=idade;
        this.producao={
            idproducao:lote
         
        }
    }
}
