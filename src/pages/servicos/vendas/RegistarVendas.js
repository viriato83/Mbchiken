import { useEffect, useState } from "react";
import Conteinner from "../../../components/Container";
import Content from "../../../components/Content";
import Header from "../../../components/Header";
import Slider from "../../../components/Sider";
import Footer from "../../../components/Footer";
import { useParams } from "react-router-dom";
import mensagem from "../../../components/mensagem";

 // Adicionar repositório de clientes

import { repositorioVenda } from "./vendasRepositorio";
import vendas from "./Vendas";

import ClienteRepository from "../Clientes/ClienteRepository";

import { repositorioProdcao } from "../Producao/producaoRepository";
import { Producao } from "../Producao/Producao";
export default function RegistarVenda() {
  const [inputs, setInputs] = useState({
    quantidade: "",
    valorUnitario: "",
    data: "",
    cliente: "",
    producao: "",
  });

  const [ativo, setAtivo] = useState("Cadastrar");
  const [desativado, setDesativado] = useState(false);
  const [clientes, setClientes] = useState([]); // Lista dinâmica de clientes
  const [producao, setProducao] = useState([]); // Lista dinâmica de mercadorias
  const { id } = useParams();
  const usuario=sessionStorage.getItem('idusuarios');
  let msg = new mensagem();
  let repositorio = new repositorioVenda();
  const proRepo = new repositorioProdcao;
  let Cadastro =true; //
  let saidas=0;
  useEffect(() => {
    // atualizacao 2025
    // Buscar clientes e mercadorias do backend
    const fetchClientes = async () => {
      const clienteRepo = new ClienteRepository();
      const data = await clienteRepo.leitura(); // Assumindo que listar retorna os clientes
      setClientes(data);
    };

    const fetchproducao = async () => {
    
      const data = await proRepo.leitura(); // Assumindo que listar retorna as mercadorias
      setProducao(data);
    };

  
    fetchClientes();
    fetchproducao();
    // criaProducao()
  }, []);

  //atualizacao 2025

  const criaProducao = () => {
    let Total = 0; // Inicializa o total
  
    producao.map((prod) => {
    
      if (prod.idproducao == inputs.producao) {
            Total = prod.quantidade_atual - Number(inputs.quantidade);
        // Valida se a quantidade restante é válida
        if (Total <= 0) {
          // window.alert("Quantidade insuficiente em estoque.");
          // Total = 0; // Garante que não seja negativo
            Cadastro=false
      
        }if(Total>0){
          Cadastro=true
        }
      }
      // console.log(Total)
    });
  
    // Retorna uma nova instância da mercadoria com o valor correto
    return new Producao(
      "", 
      "",
      Total, 
      0,
      0, // A
      0
    );
  };
  
  // console.log(criaProducao())
  
  const criaVenda = () => {
 
    return new vendas(
      inputs.quantidade,
      inputs.valorUnitario,
      inputs.data,
      inputs.cliente,
      inputs.producao,usuario
    );
  };

  const limparFormulario = () => {
    setInputs({
      quantidade: "",
      valorUnitario: "",
      data: "",
      cliente: "",
      producao: "",
    });
  };

  const cadastrar = async () => {
    try {
      setAtivo("Cadastrando...");
      setDesativado(true);
          if (id) {
            repositorio.editar(id, criaVenda());
            msg.sucesso("Venda editada com sucesso.");
            limparFormulario();
          } else {
            if (
              !inputs.quantidade ||
              !inputs.valorUnitario ||
              !inputs.data ||
              !inputs.cliente ||
              !inputs.producao
            ) {
              msg.Erro("Preencha corretamente todos os campos obrigatórios");
              return;
            }
        
            // Verificar estoque antes do cadastro
            const novaProducao = criaProducao();
        
            if (!Cadastro) {
              msg.Erro("Estoque insuficiente.");
              return;
            }
        
            try {
              // Cadastrar venda
              await repositorio.cadastrar(criaVenda());
        
              // Atualizar mercadoria com estoque atualizado
              await proRepo.editar(inputs.producao, novaProducao);
        
              // msg.sucesso("Venda cadastrada com sucesso.");
            } catch (error) {
              msg.Erro(`Erro ao cadastrar venda.`);
            }finally{
              limparFormulario();
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
            <h1>Registo de Vendas</h1>
            <div className="form m-4 was-validated">
              <div className="form-floating m-3">
                <input
                  type="number"
                  value={id ? id : 0}
                  disabled
                  className="id form-control"
                />
                <label className="form-label">ID:</label>
              </div>
              <div className="form-floating m-3">
                <input
                  className="quantidade form-control"
                  type="number"
                  required
                  placeholder=""
                  value={inputs.quantidade}
                  onChange={(e) =>
                    setInputs({ ...inputs, quantidade: e.target.value })
                  }
                />
                <label className="form-label">Quantidade:</label>
              </div>
              <div className="form-floating m-3 ">
                <input
                  type="number"
                  required
                  className="valor_uni form-control"
                  placeholder="Consumo de racao"
                  value={inputs.valorUnitario}
                  onChange={(e) =>
                    setInputs({ ...inputs, valorUnitario: e.target.value })
                  }
                />
                <label className="form-label">Valor Unitário</label>
              </div>
              <div className="form-floating m-3">
                <input
                  type="date"
                  className="data form-control"
                  placeholder="Data"
                  value={inputs.data}
                  onChange={(e) =>
                    setInputs({ ...inputs, data: e.target.value })
                  }
                />
                <label className="form-label">Data:</label>
              </div>
              <div className="form-floating m-3">
                <select
                  className="form-select"
                  value={inputs.producao}
                  onChange={(e) =>
                    setInputs({ ...inputs, producao: e.target.value })
                  }
                >
                  <option value="">Selecione uma Producao</option>
                  {producao.map((prod) =>(
                    <option key={prod.idproducao} value={prod.idproducao}>
                      {prod.idproducao}. {prod.nome}
                    </option>
              
                 ))}
                </select>
                <label className="form-label">Producao:</label>
              </div>
              <div className="form-floating m-3">
                <select
                  className="form-select"
                  value={inputs.cliente}
                  onChange={(e) =>
                    setInputs({ ...inputs, cliente: e.target.value })
                  }
                >
                  <option value="">Selecione um Cliente</option>
                  {clientes.map((prod) =>(
                    <option key={prod.idclientes} value={prod.idclientes}>
                      {prod.idclientes}. {prod.nome}
                    </option>
              
                 ))}
                </select>
                <label className="form-label">Cliente:</label>
              </div>
              <div className="bt input-group">
                <button
                  onClick={cadastrar}
                  className="btn cadastrar"
                  disabled={desativado}
                >
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
