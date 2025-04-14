const form = document.getElementById('task-form');
const lista = document.getElementById('task-list');
let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];

function mostrarNotificacao(msg, tipo = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${tipo}`;
  toast.textContent = msg;

  document.getElementById('toast-container').appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

form.addEventListener('submit', function(e) {
  e.preventDefault();
  const tarefa = document.getElementById('tarefa').value;
  const data = document.getElementById('data').value;
  const hora = document.getElementById('hora').value;

  const novaTarefa = {
    id: Date.now(),
    texto: tarefa,
    data: formatarData(data),  // Alterado
    hora: formatarHora(hora),  // Alterado
    feita: false
  };

  tarefas.push(novaTarefa);
  salvarTarefas();
  renderizarTarefas();
  mostrarNotificacao("✅ Tarefa criada com sucesso!", "success");
  form.reset();
});

function salvarTarefas() {
  localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

function renderizarTarefas() {
  lista.innerHTML = '';
  tarefas.forEach(tarefa => {
    const div = document.createElement('div');
    div.className = 'task';
    if (tarefa.feita) div.classList.add('done');

    const conteudo = document.createElement('div');
    conteudo.innerHTML = `<strong>${tarefa.data} às ${tarefa.hora}:</strong> ${tarefa.texto}`;
    div.appendChild(conteudo);

    const acoes = document.createElement('div');
    acoes.className = 'actions';

    const btnEditar = document.createElement('button');
    btnEditar.textContent = '✏️ Editar';
    btnEditar.onclick = () => {
      // Preencher os campos de edição com os valores atuais
      document.getElementById('tarefa').value = tarefa.texto;
      document.getElementById('data').value = formatarDataParaInput(tarefa.data); // Ajustar formato da data
      document.getElementById('hora').value = tarefa.hora;

      // Remover a tarefa original
      tarefas = tarefas.filter(t => t.id !== tarefa.id);
      salvarTarefas();
      renderizarTarefas();
    };

    const btnFeito = document.createElement('button');
    btnFeito.textContent = tarefa.feita ? '↩️ Desfazer' : '✅ Feito';
    btnFeito.onclick = () => {
      tarefa.feita = !tarefa.feita;
      salvarTarefas();
      renderizarTarefas();
    };

    const btnRemover = document.createElement('button');
    btnRemover.textContent = '❌ Remover';
    btnRemover.onclick = () => {
      tarefas = tarefas.filter(t => t.id !== tarefa.id);
      salvarTarefas();
      renderizarTarefas();
      mostrarNotificacao("❌ Tarefa removida com sucesso!", "error");
    };

    acoes.appendChild(btnEditar);
    acoes.appendChild(btnFeito);
    acoes.appendChild(btnRemover);
    div.appendChild(acoes);

    lista.appendChild(div);
  });
}

function formatarData(data) {
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`; // Formato dia/mês/ano
}

function formatarDataParaInput(data) {
  const [dia, mes, ano] = data.split('/');
  return `${ano}-${mes}-${dia}`; // Formato para o input do tipo date
}

function formatarHora(hora) {
  const [h, m] = hora.split(':');
  return `${h}:${m}`; // Mantém o formato 24h
}

renderizarTarefas();