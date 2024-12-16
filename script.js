const modal = document.querySelector('.modal-container');
const tbody = document.querySelector('tbody');
const sNome = document.querySelector('#m-nome');
const sQuantidade = document.querySelector('#m-quantidade');
const sPreco = document.querySelector('#m-preco');
const btnSalvar = document.querySelector('#btnSalvar');

let itens;
let id;

function openModal(edit = false, index = 0) {
  modal.classList.add('active');
  modal.onclick = e => {
    if (e.target.className.indexOf('modal-container') !== -1) closeModal();
  };
  document.onkeydown = e => {
    if (e.key === 'Escape') closeModal();
  };

  if (edit) {
    sNome.value = itens[index].nome;
    sQuantidade.value = itens[index].quantidade;
    sPreco.value = itens[index].preco;
    id = index;
  } else {
    clearFields();
  }
}

function closeModal() {
  modal.classList.remove('active');
  document.onkeydown = null;
}

function clearFields() {
  sNome.value = '';
  sQuantidade.value = '';
  sPreco.value = '';
}

function deleteItem(index) {
  if (confirm('Tem certeza que deseja excluir este item?')) {
    itens.splice(index, 1);
    setItensBD();
    loadItens();
    alert('Item excluído com sucesso!');
  }
}

function insertItem(item, index) {
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>${item.nome}</td>
    <td>${item.quantidade}</td>
    <td>${formatCurrency(item.preco)}</td>
    <td class="acao"><button class="btn-edit"><i class='bx bx-edit'></i></button></td>
    <td class="acao"><button class="btn-delete"><i class='bx bx-trash'></i></button></td>
  `;

  tr.querySelector('.btn-edit').addEventListener('click', () => openModal(true, index));
  tr.querySelector('.btn-delete').addEventListener('click', () => deleteItem(index));

  tbody.appendChild(tr);
}

btnSalvar.onclick = e => {
  e.preventDefault();

  const nome = sNome.value.trim();
  const quantidade = sQuantidade.value.trim();
  const preco = parseFloat(sPreco.value);

  if (!nome || !quantidade || isNaN(preco) || preco <= 0) {
    alert('Preencha todos os campos corretamente!');
    return;
  }

  if (id !== undefined) {
    itens[id] = { nome, quantidade, preco };
  } else {
    itens.push({ nome, quantidade, preco });
  }

  setItensBD();
  modal.classList.remove('active');
  loadItens();
  id = undefined;
};

function loadItens() {
  itens = getItensBD();
  tbody.innerHTML = '';
  itens.forEach((item, index) => insertItem(item, index));
}

const getItensBD = () => {
  try {
    return JSON.parse(localStorage.getItem('dbfunc')) ?? [];
  } catch (e) {
    console.error('Erro ao carregar dados do localStorage:', e);
    return [];
  }
};
const setItensBD = () =>
    localStorage.setItem('dbfunc', JSON.stringify(itens));

function formatCurrency(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

loadItens();
