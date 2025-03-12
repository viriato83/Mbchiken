import { useEffect, useState } from "react";
import Container from "../../../components/Container";
import Content from "../../../components/Content";
import Header from "../../../components/Header";
import Sider from "../../../components/Sider";
import ClienteRepository from "./ClienteRepository";
import Clientes from "./Cclientes";
import { useParams } from "react-router-dom";
import mensagem from "../../../components/mensagem";
import Footer from "../../../components/Footer";

export default function RegistarClientes() {
  const [inputs, setInputs] = useState({ nome: "", localizacao: "", telefone: "" });
  const { id } = useParams();
  const [ativo, setAtivo] = useState("Cadastrar");
  const [desativado, setDesativado] = useState(false);

  useEffect(() => {
    new mensagem();
  }, []);

  const criaCliente = () => {
    return new Clientes(inputs.nome, inputs.localizacao, inputs.telefone);
  };

  const cadastrar = async () => {
    if(!id){
      if (!inputs.nome || !inputs.telefone || !inputs.localizacao) {
        new mensagem().Erro("Preencha corretamente todos os campos");
        return;
      }
    }

    const repositorio = new ClienteRepository();
    
    try {
      setAtivo("Cadastrando...");
      setDesativado(true);
      if (id) {
        await repositorio.editar(id, criaCliente());
      } else {
        await repositorio.cadastrar(criaCliente());
      }
      
      // Limpar os inputs após o cadastro
    } catch (e) {
      console.error("Erro: " + e.message);
    } finally {
      setDesativado(false); //
      setInputs({ nome: "", localizacao: "", telefone: "" });
      
        setAtivo("Cadastrar");
    }
  };

  return (
    <>
      <Header />
      <Container>
        <Sider />
        <Content>
          <div className="Cadastro">
            <h1>Registo de Clientes</h1>
            <div className="form m-4 was-validated">
              <div className="form-floating m-3">
                <input type="number" value={id ? id : 0} disabled className="id form-control" />
                <label className="form-label">ID:</label>
              </div>
              <div className="form-floating m-3">
                <input
                  className="nome form-control"
                  type="text"
                  required
                  placeholder="Nome do cliente"
                  value={inputs.nome}
                  onChange={(e) => setInputs({ ...inputs, nome: e.target.value })}
                />
                <label className="form-label">Nome:</label>
              </div>
              <div className="form-floating m-3">
                <input
                  type="text"
                  required
                  className="localizacao form-control"
                  placeholder="Localização do cliente"
                  value={inputs.localizacao}
                  onChange={(e) => setInputs({ ...inputs, localizacao: e.target.value })}
                />
                <label className="form-label">Localização:</label>
              </div>
              <div className="form-floating m-3">
                <input
                  type="tel"
                  className="telefone form-control"
                  placeholder="Telefone do cliente"
                  value={inputs.telefone}
                  onChange={(e) => setInputs({ ...inputs, telefone: e.target.value })}
                />
                <label className="form-label">Telefone:</label>
              </div>
              <div className="bt input-group">
                <button onClick={cadastrar} className="btn cadastrar" disabled={desativado}>
                  {ativo}
                </button>
              </div>
            </div>
          </div>
        </Content>
      </Container>
      <Footer />
    </>
  );
}
