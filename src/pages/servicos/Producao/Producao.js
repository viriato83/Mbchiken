
export class Producao{
    constructor(
         nome,
        data,
        quantidade_atual,
        peso,
        consumo_racao,idlote
    ){
        this.nome = nome;
        this.data = data;
        this.quantidade_atual = quantidade_atual;
        this.peso = peso;
        this.consumo_racao = consumo_racao;
        this.lotes={
            idlotes:idlote
        }
    }
}