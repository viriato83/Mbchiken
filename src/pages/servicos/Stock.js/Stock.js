export default class stock{

    constructor(quantidade,tipo,valor_un,data,lote) {
        this.quantidade = quantidade;
         this.data=data;
         this.valor_un = valor_un;
         this.tipo=tipo;
        this.lote={
            idlotes:lote
        }
        
    }
}