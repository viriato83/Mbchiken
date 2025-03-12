export default class vendas{

    constructor(quantidade,valor_uni,data,clientes_idclientes,producao,usuario) {
        this.quantidade = quantidade;
        this.valor_uni = valor_uni;
        this.data = data;
        this.cliente = {
            idclientes : clientes_idclientes
        };
        this.producao= 
            {
                idproducao:producao
            }
        this.usuario= 
            {
                idusuario:usuario
            }
        
        
    }
}