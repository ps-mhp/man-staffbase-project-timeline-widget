# Definições

A caixa de diálogo de configuração do Staffbase apresenta apenas o campo «Plano». Este é
preenchido no Editor de Planos, que aparece automaticamente ao abrir as definições;
o campo de texto a seguir é a versão técnica em bruto e não deve ser
editado manualmente. Os campos anteriores **Mostrar linha de hoje** e
**Oferecer exportação para Excel** estão ocultos na caixa de diálogo e encontram-se no
Editor de Planos, em **Definições**; os seus valores estão no plano. Um bloco em
que nunca tenham sido alterados no editor mantém o que exibia anteriormente. Também o
título do plano não é um campo da caixa de diálogo, mas é atualizado no Editor de Planos
.

| Atributo | Rótulo | Descrição |
| --- | --- | --- |
| `plan` | Plano | Título, níveis, categorias, entradas, vista inicial e os botões para a linha «Hoje» e a exportação. É atualizado no Editor de Planos. Predefinição: vazio. |
| `show-today` | Mostrar linha de hoje | Apenas uma opção de recurso para planos que não incluem o botão. No editor, como **Mostrar linha de hoje** em **Definições**: Uma linha vertical escura com «Hoje» no eixo marca o dia de hoje, desde que este se encontre na secção visível. Predefinição: ativado. |
| `allow-export` | Oferecer exportação para Excel | Apenas como alternativa, tal como acima. No editor, como **Oferecer exportação para Excel**: mostra aos leitores o botão **Exportar**, através do qual podem descarregar as entradas como uma folha de cálculo do Excel. Predefinição: ativado. |

## O Editor de Planos

O Editor de Planos ocupa todo o ecrã. Na parte superior encontra-se o cabeçalho do
quadro comum; abaixo, à esquerda, as **entradas**; no centro, o
formulário da entrada selecionada; e à direita, o painel **Plano**.

### Cabeçalho

| Elemento de controlo | Descrição |
| --- | --- |
| Editor · Computador · Tablet · Telemóvel | O **Editor** apresenta o formulário. As visualizações para dispositivos mostram, em vez disso, o plano na largura do dispositivo — a mesma visualização que na página, com zoom, sem filtros e sem exportação; um clique num registo seleciona-o. |
| Estado | «3 registos alterados · níveis» — o que difere do último estado guardado. Uma entrada sem nível impede a gravação. |
| Voltar atrás / Repetir | Anula ou repõe as alterações passo a passo (⌘/Ctrl Z, ⇧⌘/Ctrl Z). |
| Ajuda | Explica o funcionamento (F1). |
| Cancelar | Fecha o editor; caso existam alterações não guardadas, pergunta previamente se estas devem ser descartadas. |
| Aplicar | Grava o plano nas definições (⌘/Ctrl S); **Aplicar e fechar** também com ⌘/Ctrl ↵. É guardado juntamente com a página. |

### Barra lateral «Entradas»

À esquerda, a lista de entradas, ordenada por data, com o número («12 de
300»). **Novo** cria um **marco**, **período** ou **data-limite**;
sem nível, só é possível selecionar a data-limite. Abaixo, encontram-se **Pesquisar entradas** e
a seleção do tipo (**Todos os tipos**, **Marcos**, **Períodos**,
**Datas-limite**, cada um com o respetivo número; com a pesquisa ativa: resultados).

### Formulário da entrada

Acima do formulário aparecem «Entrada 4 de 12», o tipo e os botões **Duplicar
entrada** e **Apagar entrada**; abaixo, os separadores **Geral**
(Tipo, Título, Descrição, Provisório), **Classificação** (nível, categoria,
série), **Data** (data ou início e fim; no caso de um período, há uma seta no final),
**Dependências** e **Conteúdo** (página ou notícia associada,
anexos). «(Erro)» atrás de um separador indica uma entrada inválida nesse separador;
no caso de datas-limite, a secção **Dependências** não se aplica:

| Campo | Aplica-se a | Descrição |
| --- | --- | --- |
| Tipo | todos | Marco, período ou data-limite. Ao mudar para data-limite, o nível é omitido. Sem nível, uma data-limite mantém-se como tal. |
| Título | todos | Obrigatório. Aparece na entrada e nos detalhes. |
| Descrição | todos | Opcional, várias linhas. Aparece apenas nos detalhes e na exportação para Excel. |
| Provisório | todos | A data ainda não está definida; a entrada aparece como um contorno ou com uma borda tracejada. |
| Nível | Marco, Período | O nível em que a entrada se encontra. **Novo nível…** cria um (nome) e atribui-o imediatamente. |
| Categoria | todas | Determina a cor e, no caso dos marcos, a forma. «Sem categoria» aparece a cinzento; os marcos aparecem como losangos. **Nova categoria…** cria uma (nome, cor e forma) e atribui-a imediatamente. |
| Série | Marco, Período | As entradas do mesmo nível com o mesmo nome de série aparecem numa linha. O campo expande as séries deste nível com o número das respetivas entradas; um novo nome digitado é aceite através de «Criar nova série como “...”», **Sem série** remove a entrada. |
| Data | Marco, data de referência | A data. |
| Início, Fim | Período | Primeiro e último dia; ambos fazem parte do período. |
| Seta no fim | Período | A barra termina numa ponta de seta — «continua». |
| Depende de | Marco, Período | Os antecessores da entrada; representados na página por uma linha tracejada com seta. |
| Ligação | todas | **Nenhuma**, **Página** ou **Artigo de notícias**. Uma alteração anula uma ligação existente. Na página, o título da entrada fica então sublinhado e, ao clicar, o conteúdo abre-se numa janela sobre o plano. |
| Página | todas | A página do Staffbase da lista de páginas (as 100 últimas editadas). **Nova página …** cria-a no editor do Staffbase, que se sobrepõe ao editor do plano; após a criação, fica ligada. |
| Canal, publicação | todas | Primeiro o canal de notícias (com o seu tipo: artigo, notícia curta, publicação com imagem), depois a publicação. Os rascunhos podem ser selecionados e estão identificados com «(Rascunho)» — os leitores só os vêem após a publicação. **Nova publicação…** cria uma no canal selecionado; após o armazenamento, fica ligada. **Abrir numa nova aba** mostra o conteúdo associado. |
| Anexos | todos | Até dez ficheiros ou imagens da biblioteca multimédia, cada um com uma legenda opcional (caso contrário, o nome do ficheiro). **Adicionar ficheiro ou imagem …** abre a biblioteca; as setas organizam, a cruz remove. Os anexos permanecem após o início de sessão. Na página, aparecem ao lado do conteúdo associado ou nos detalhes; na exportação para Excel, na coluna «Anexos». |
| Duplicar entrada | todos | Cria uma cópia da entrada. |
| Eliminar entrada | todas | Solicita confirmação e, em seguida, elimina a entrada e todas as dependências que apontam para ela; a mensagem de confirmação indica as entradas dependentes. |

### Painel «Plano»: Definições

| Elemento de controlo | Descrição |
| --- | --- |
| Título do plano | Aparece acima do plano e atribui o nome ao ficheiro Excel. Opcional: deixe em branco se a página já tiver um título adequado; o ficheiro passará a chamar-se `Plano do projeto_AAAA-MM-DD.xlsx`. |
| Mostrar linha de hoje | Botão, ver acima. Enquanto nunca tiver sido acionado no editor, indica que o bloco mantém a sua configuração anterior. |
| Oferecer exportação para Excel | Botão, ver acima; o mesmo se aplica. |
| Aplicar esta secção | Guarda a secção visível da pré-visualização (vista para computador, tablet ou telemóvel), com precisão mensal, como vista ao carregar a página. Bloqueado se não for indicada nenhuma secção. |
| Remover vista inicial | Apaga a vista inicial; ao carregar, o widget volta a mostrar o plano na íntegra. |
| Começar com modelo | Apenas com o plano vazio, no centro: mostra os modelos à escolha («Roteiro do produto», «Adiamento de data»). Um clique num cartão preenche o editor com o mesmo; **Voltar** regressa sem efetuar alterações. Num plano com entradas, esta opção não está disponível — o modelo substituiria as entradas existentes. |
| Começar do zero | Apenas quando o plano está vazio: cria um nível «Nível 1». |

### Painel «Plano»: Camadas

| Elemento de controlo | Descrição |
| --- | --- |
| Nova camada | Cria uma nova camada. |
| Nome | O nome da camada, à esquerda da sua linha. Deve ser único. Abaixo indica-se quantas entradas contém. |
| Setas para cima / para baixo | Ordem na página e na exportação para o Excel. |
| Eliminar | Remove a camada. Se esta contiver entradas, o editor pergunta se estas devem ser movidas para outra camada (seleção **Camada de destino**) ou se devem ser eliminadas juntamente com a camada. |

### Painel «Plano»: Categorias

| Elemento de controlo | Descrição |
| --- | --- |
| Nova categoria | Cria uma nova categoria. |
| Campo de cor | À frente do nome; mostra a cor. Um clique expande as doze cores e o campo **Valor hexadecimal**; a tecla Esc ou um clique ao lado fecha-o. |
| Valor hexadecimal | Uma cor personalizada no formato `#RRGGBB`, por exemplo, `#E40045`. |
| Botão de forma | Ao lado do campo de cor; mostra a forma com que os marcos da categoria aparecem. Um clique expande as oito formas: losango, triângulo, triângulo com a ponta para baixo, quadrado, círculo, hexágono, estrela ou cruz. As setas do teclado alternam entre as formas. |
| Nome | O nome na legenda e nos detalhes. Deve ser único. Abaixo, indica a quantidade de entradas atribuídas à categoria. |
| Setas para cima / para baixo | Ordem na legenda. |
| Apagar | Remove a categoria; as suas entradas passam a ficar «sem categoria». A mensagem de confirmação indica o seu número. |

## Limites

- Um plano pode conter, no máximo, **300 entradas**, **20 níveis** e
  **24 categorias**. O editor não aceita mais do que isso.
- Os compromissos são **dias inteiros** sem hora. A vista inicial é
  **por mês**.
- O texto nunca aparece na cor da categoria — cores claras como o amarelo ficariam
  ilegíveis sobre fundo branco. A cor aplica-se apenas à forma, à barra e
  ao ponto da legenda; a fonte na barra é preta ou branca, consoante o que
  for mais legível.
- **Sem entradas, o widget não mostra nada** — nem uma moldura vazia nem
  uma mensagem.

## Dependências entre as definições

- **Mostrar linha de hoje** só funciona se o dia de hoje estiver na
  secção visível. No caso de um plano que se situe inteiramente no passado ou
  no futuro, É por isso que a linha só fica visível depois de ser deslocada.
- O **título** também determina o nome do ficheiro do Excel; sem
  a opção de exportação ativada, funciona apenas como título.
- **Título do plano**, **Vista inicial**, **Linha de hoje** e **Exportação** são definidos no
  Editor de planos, e não na caixa de diálogo; todos fazem parte do plano.
