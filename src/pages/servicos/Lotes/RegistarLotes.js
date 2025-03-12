import { useEffect, useState } from "react";
import Conteinner from "../../../components/Container";
import Content from "../../../components/Content";
import Header from "../../../components/Header";
import Slider from "../../../components/Sider";
import Footer from "../../../components/Footer";
import { useParams } from "react-router-dom";
import mensagem from "../../../components/mensagem";

import Lotes from "./Lotes";
import repositorioLote from "./Repositorio";


export default function RegistarLotes() {
  const [inputs, setInputs] = useState({
    nome: "",
    tipo: "",
    quantidade: "",
    dataInicio: "",  
    valorUnitario: "",
    dataFim: "",
  });
  
 
  const { id } = useParams();
  let msg= new mensagem();
  let repositorio = new repositorioLote();
  const usuario= sessionStorage.getItem("idusuarios");
  const [desativado, setDesativado] = useState(false);
  const [ativo, setAtivo] = useState("Cadastrar");
 
  const criaLote= () => {
    return new Lotes(inputs.nome,inputs.tipo,inputs.quantidade,inputs.dataInicio,inputs.valorUnitario,inputs.dataFim,"Ativo",usuario) 
      
  };
  const limparFormulario = () => {
    setInputs({
      nome:"",
      tipo: "",
      quantidade: 0,
      dataInicio: "",
      valorUnitario: 0,
      dataFim: "",

    });
  };
  

  const cadastrar = () => {
    try {
      setAtivo("Cadastrando...");
      setDesativado(true);  
        if (id) {
          repositorio.editar(id, criaLote());
          msg.sucesso("Lote editada com sucesso.");
          limparFormulario(); // Limpa o formulário após editar
        } else {
          if (
            !inputs.nome ||
            !inputs.tipo ||
            !inputs.quantidade ||
            !inputs.dataInicio ||
            !inputs.valorUnitario 
            
          ) {
          
            msg.Erro("Preencha corretamente todos os campos obrigatórios");
          } else {
                console.log(criaLote())
                repositorio.cadastrar(criaLote());
                msg.sucesso("Lote cadastrada com sucesso.");
                limparFormulario(); // Limpa o formulário após cadastrar
              
          }
          
        }
      } catch (e) {
        console.error("Erro: " + e.message);
      } finally {
        setDesativado(false); //
        
          setAtivo("Cadastrar");
      }
  };
  
  

  return (
    <>
      <Header />
      <Conteinner>
        <Slider />
        <Content>
        <div className="Cadastro">
            <h1>Registo de Lotes</h1>
           
          <div className="form m-4 was-validated">
              <div className="form-floating my-3">
                <input type="number" value={id ? id : 0} disabled className="id form-control" />
                <label className="form-label">ID:</label>
              </div>

              {/* Nome do lote */}
              <div className="form-floating my-3">
                <input
                  className="nome form-control"
                  type="text"
                  required
                  placeholder="Nome do lote"
                  value={inputs.nome}
                  onChange={(e) => setInputs({ ...inputs, nome: e.target.value })}
                />
                <label className="form-label">Nome:</label>
              </div>

              {/* Tipo do lote */}
              <div className="form-floating my-3">
                <input
                  type="text"
                  required
                  className="tipo form-control"
                  placeholder="Tipo do lote"
                  value={inputs.tipo}
                  onChange={(e) => setInputs({ ...inputs, tipo: e.target.value })}
                />
                <label className="form-label">Tipo:</label>
              </div>

              {/* Quantidade */}
              <div className="form-floating my-3">
                <input
                  type="number"
                  required
                  className="quantidade form-control"
                  placeholder="Quantidade"
                  value={inputs.quantidade}
                  onChange={(e) => setInputs({ ...inputs, quantidade: e.target.value })}
                />
                <label className="form-label">Quantidade:</label>
              </div>

              {/* Data de Início */}
              <div className="form-floating my-3">
                <input
                  type="date"
                  required
                  className="data_inicio form-control"
                  placeholder="Data de Início"
                  value={inputs.dataInicio}
                  onChange={(e) => setInputs({ ...inputs, dataInicio: e.target.value })}
                />
                <label className="form-label">Data de Início:</label>
              </div>

              {/* Data de Fim */}
              <div className="form-floating my-3">
                <input
                  type="date"
                  required
                  className="data_fim form-control"
                  placeholder="Data de Fim"
                  value={inputs.dataFim}
                  onChange={(e) => setInputs({ ...inputs, dataFim: e.target.value })}
                />
                <label className="form-label">Data de Fim:</label>
              </div>

              {/* Valor Unitário */}
              <div className="form-floating my-3">
                <input
                  type="number"
                  required
                  className="valor_un form-control"
                  placeholder="Valor Unitário"
                  value={inputs.valorUnitario}
                  onChange={(e) => setInputs({ ...inputs, valorUnitario: e.target.value })}
                />
                <label className="form-label">Valor Unitário:</label>
              </div>
              {/* Botão de cadastro */}
              <div className="bt input-group">
                <button onClick={cadastrar} className="btn cadastrar" disabled={desativado}>
                  {ativo}
                </button>
              </div>
            </div>
          </div>

        </Content>
      </Conteinner>
      <Footer />
    </>
  );
}
