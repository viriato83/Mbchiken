export default class Modal {
  constructor() {
    this.elemento = document.querySelector(".content");
  }

  Abrir(texto) {
    // Remover qualquer modal existente antes de criar um novo
    this.fechar();

    // Criar o modal dinamicamente
    const modal = document.createElement("div");
    modal.classList.add("modal-container");
    modal.innerHTML = `<div class="modal-dialog show">
                <div class="modal-content">
                    <div class="modal-header">  
                        <button
                            type="button"
                            class="btn-close"
                            
                            aria-label="Fechar"
                        ></button>
                    </div>
                    <div class="modal-body">
                            <p class="p_modal">Deseja ${texto}?</p>
                            <div class="buttons">
                            <button class="sim btn-success">Sim</button>
                            <button class="nao btn-danger">Não</button>
                     </div>
              
                    </div>
                </div>
            </div>
  `;
  

    // Adicionar o modal à área de conteúdo
    this.elemento.appendChild(modal);

    // Adicionar evento para fechar o modal quando clicar em "Não"
    modal.querySelector(".nao").addEventListener("click", () => this.fechar());
    modal.querySelector(".btn-close").addEventListener("click", () =>this.fechar());
  }

  fechar() {
    const modalExistente = document.querySelector(".modal-container");
    if (modalExistente) {
      modalExistente.remove();
    }
  }
}
