import Conteinner from "../components/Container";
import Content from "../components/Content";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Sidebar from "../components/Sider";
import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import ClienteRepository from "./servicos/Clientes/ClienteRepository";

import repositorioStock from "./servicos/Stock.js/Repositorio";
import { repositorioVenda } from "./servicos/vendas/vendasRepositorio";
import Loading from "../components/loading";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import repositorioLote from "./servicos/Lotes/Repositorio";
import { repositorioProdcao } from "./servicos/Producao/producaoRepository";

// Função para agrupar dados por período
function agruparPorPeriodo(dados, periodo = "dia") {
  const agrupados = {};

  dados.forEach((item) => {
    let chave;
    const data = new Date(item.data);

    if (periodo === "dia") {
      chave = data.toISOString().split("T")[0];
    } else if (periodo === "semana") {
      const semana = Math.ceil(data.getDate() / 7);
      chave = `${data.getFullYear()}-M${data.getMonth() + 1}-W${semana}`;
    } else if (periodo === "mes") {
      chave = `${data.getFullYear()}-${data.getMonth() + 1}`;
    }

    if (!agrupados[chave]) {
      agrupados[chave] = 0;
    }
    agrupados[chave] += item.valor_total;
  });

  return {
    labels: Object.keys(agrupados),
    valores: Object.values(agrupados),
  };
}

function exportarParaExcel(dados, nomeArquivo = "dados.xlsx") {
  const wsDados = XLSX.utils.json_to_sheet(dados.infoBasica);

  const wsGrafico = XLSX.utils.json_to_sheet(
    dados.grafico.map((venda) => ({
      ID: venda.idvendas,
      Quantidade: venda.quantidade,
      ValorUnitario: venda.valor_uni,
      Data: venda.data,
      ValorTotal: venda.valor_total,
    }))
  );

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, wsDados, "Resumo");
  XLSX.utils.book_append_sheet(wb, wsGrafico, "Detalhes de Vendas");

  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

  saveAs(blob, nomeArquivo);
}


export default function Dashboard() {
  const clientes = new ClienteRepository();
  const stok = new repositorioStock();
  const vendas = new repositorioVenda();
  const producao=new repositorioProdcao;
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const [cards, setCard] = useState([]);
  const [entrada, setEntradada] = useState(0);
  const [saida, setSaida] = useState(0);
  const [useVenda, setVenda] = useState([]);
  const [useData, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dadosParaExportar, setDadosParaExportar] = useState(null);

  const buscarCargo = () => sessionStorage.getItem("cargo");
  useEffect(() => {
    async function card() {
      if (cards.length === 0) {  // Verifica se os cards já foram carregados
        setLoading(true);
        let frangos=0;
         let diferencaDias=0;
        try {
          let dados =await producao.leitura();
          dados.map((e)=>{
            const dataAtual = new Date();
            if(e.lotes.status==="Ativo"){
              frangos=e.quantidade_atual;
              const dataProducao = new Date(e.data);
               diferencaDias = Math.floor((dataAtual - dataProducao) / (1000 * 60 * 60 * 24));
              
      
            }
          })
          let cards2 = [
            await clientes.total(),
            await stok.total(),
            await vendas.total(),
            frangos,
            diferencaDias
          ];
          setCard(cards2);
  
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      }
    }
  
    async function setGrafico() {
      const dados = await vendas.leitura();
      const { labels, valores } = agruparPorPeriodo(dados, "mes");
      setVenda(valores);
      setData(labels);
  
      // Prepara os dados para exportação depois de buscar tudo
      setDadosParaExportar({
        infoBasica: [
          { label: "Total Clientes", valor: cards[0] },
          { label: "Total Estoque", valor: cards[1] },
          { label: "Total Vendas", valor: cards[2] },
          { label: "Total Frangos", valor: cards[3] },
          { label: "Dias desde Produção", valor: cards[4] },
        ],
        grafico: dados,
        labels: labels,
      });
    }
  
    card();
    setGrafico();
  }, []);  // Ajuste na lista de dependências
  

    if (useVenda.length > 0 && useData.length > 0) {
      const ctx = chartRef.current.getContext("2d");
  
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
  
      chartInstanceRef.current = new Chart(ctx, {
        type: "bar",
        data: {
          labels: useData,
          datasets: [
            {
              label: "Vendas",
              data: useVenda,
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: "top" },
          },
          scales: {
            x: {
              ticks: {
                maxTicksLimit: 10,
              },
            },
            y: {
              ticks: {
                stepSize: 1000,
                callback: function (value) {
                  return `${value} Mt`;
                },
              },
            },
          },
        },
      });
    }
    // Isso só será executado quando useVenda ou useData mudarem
  
  return (
    <>
      <Header></Header>
      <Conteinner>
        <Sidebar></Sidebar>
        <Content>
          {loading && <Loading></Loading>}
          <div className="dashboard">
            <div className="card total-clients">
              <h3>Total Clientes</h3>
              <p id="totalClients">{cards[0]}</p>
            </div>
            <div className="card total-sales">
              <h3>Total Vendas</h3>
              <p id="totalSales">{cards[2]}</p>
            </div>

                <div className="card total-goods">
                  <h3>Quantidade Disponivel</h3>
                  <p id="totalGoods">{cards[3]}</p>
                </div>
                {/* <div className="card total-stock">
                  <h3>Total Stock</h3>
                  <p id="totalStock">{cards[1]}</p>
                </div> */}
                <div className="card total-stock">
                  <h3>Data em Dias</h3>
                  <p id="totalStock">{cards[4]}</p>
                </div>
              
          </div>

          <div>
            <canvas id="salesChart" ref={chartRef}></canvas>
          </div>

          {dadosParaExportar && (
            <button
              onClick={() =>
                exportarParaExcel(dadosParaExportar, "dashboard_dados.xlsx")
              }
              className="btn btn-export btn-primary mt-4"
            >
              Baixar Relatório Excel
            </button>
          )}
        </Content>
      </Conteinner>
      <Footer></Footer>
    </>
  );
}
