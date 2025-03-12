export  default class Lotes{


    constructor(nome,tipo,quantidade,data_inicio,valor_un,data_fim,status,idusuarios){
        this.nome = nome;
        this.tipo=tipo;
        this.quantidade=quantidade;
        this.data_inicio=data_inicio;
        this.data_fim=data_fim;
        this.valor_un=valor_un;
        this.status=status;
        this.usuario={
            idusuario:idusuarios
        }
     

    }

     
    
}