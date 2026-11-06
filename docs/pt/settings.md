# Definições

A caixa de diálogo de configuração do widget apresenta três campos. «Plano» é
preenchido no Editor de Planos, que aparece automaticamente ao abrir as definições;
o campo de texto a seguir é a versão técnica preliminar e não deve ser
editado manualmente. Os restantes dois campos encontram-se diretamente na caixa de diálogo. O
título do plano não é um campo da caixa de diálogo, mas sim é preenchido no Editor de Planos
(ver abaixo).

| Atributo | Rótulo na caixa de diálogo | Descrição |
| --- | --- | --- |
| `plan` | Plano | Título, níveis, categorias, entradas e a vista inicial. É preenchido no Editor de Planos. Predefinição: vazio. |
| `show-today` | Mostrar linha de «Hoje» | Uma linha vertical escura com «Hoje» no eixo marca o dia de hoje, desde que este se encontre na secção visível. Predefinição: ativado. |
| `allow-export` | Oferecer exportação para Excel | Mostra aos leitores o botão **Exportar**, através do qual podem descarregar as entradas como uma folha de cálculo do Excel. Predefinição: ativado. |

## O Editor de Planos

O Editor de Planos ocupa todo o ecrã. Na parte superior encontra-se a barra de título, abaixo dela
a **Pré-visualização** e três separadores. Entre a pré-visualização e os separadores, bem como entre
a lista de registos e o formulário, existe uma alça de arrastar que permite alterar a altura da
pré-visualização e a largura da lista (com o rato ou as setas do teclado;
um duplo-clique restabelece as predefinições; o navegador guarda as dimensões).

### Barra de título

| Elemento de controlo | Descrição |
| --- | --- |
| Título | Situa-se acima do plano e atribui um nome ao ficheiro do Excel. Opcional: deixar em branco se a página já tiver um título adequado; o ficheiro passa então a chamar-se `Plano do Projeto_AAAA-MM-DD.xlsx`. |
| «42 / 300 entradas» | Indica quantas entradas o plano contém, em relação ao limite máximo. |
| «Alterações não guardadas» | Aparece assim que o plano no editor diferir da versão guardada. |
| Cancelar | Fecha o editor; caso existam alterações não guardadas, pergunta previamente se estas devem ser descartadas. |
| Aplicar | Grava o plano nas definições e fecha o editor. É guardado juntamente com a página. |

### Pré-visualização

| Elemento de controlo | Descrição |
| --- | --- |
| Pré-visualização | A mesma linha do tempo que na página, com zoom, sem filtros e sem exportação. Um clique numa entrada seleciona-a no separador «Entradas» e coloca-a à vista na lista. Um clique em **Pré-visualização** a recolhe; quando expandida, volta à altura em que foi deixada pela última vez. |
| Esta secção como vista inicial | Guarda a secção visível da pré-visualização, com precisão mensal, como vista inicial ao carregar a página. |
| Remover vista inicial | Apaga a vista inicial; ao carregar, o widget volta a mostrar o plano completo. |
| Começar com modelo | Apenas se o plano estiver vazio: mostra os modelos à escolha («Roteiro do produto», «Adiamento de prazo»). Um clique num cartão preenche o editor com o mesmo; **Voltar** regressa sem alterações. |
| Começar do zero | Apenas se o plano estiver vazio: cria um nível «Nível 1». |

### Separador «Entradas»

À esquerda, a lista de entradas, ordenada por data. Acima, encontra-se
**Pesquisar entradas** e, abaixo, um botão para alternar o tipo —
**Marcos**, **Períodos**, **Datas-limite**, cada um com o respetivo número (quando a
pesquisa: resultados); o botão **+** ao lado cria uma entrada desse tipo,
e a pesquisa atua dentro desse tipo.
Ao passar o cursor por cima de uma linha, aparece à direita um caixote do lixo para eliminar (com
confirmação).

À direita, encontra-se o formulário da entrada selecionada; acima dele, o título e
os botões **Duplicar** e **Apagar**; abaixo, os separadores **Geral**
(Tipo, Título, Descrição), **Classificação** (Nível, Categoria, Série),
**Data** (data ou início e fim; no caso de um período, uma seta no final; Provisório)
**Dependências** e **Conteúdo** (página ou notícia associada). Um
ponto vermelho na separador indica uma entrada inválida nessa secção; no caso de datas-limite,
a secção **Dependências** não se aplica:

| Campo | Aplica-se a | Descrição |
| --- | --- | --- |
| Tipo | todos | Marco, período ou data-limite. Ao mudar para data-limite, o nível deixa de se aplicar. |
| Título | todos | Obrigatório. Aparece na entrada e nos detalhes. |
| Descrição | todos | Opcional, várias linhas. Aparece apenas nos detalhes e na exportação para Excel. |
| Nível | Marco, período | O nível em que a entrada se encontra. **Novo nível …** cria um (nome) e atribui-o imediatamente. |
| Categoria | todas | Determina a cor e, no caso dos marcos, a forma. «Sem categoria» aparece a cinzento; os marcos aparecem como losangos. **Nova categoria …** cria uma (nome, cor e forma) e atribui-a imediatamente. |
| Data | Marco, data de referência | A data. |
| Início, Fim | Período | Primeiro e último dia; ambos fazem parte do período. |
| Seta no final | Período | A barra termina numa ponta de seta — «continua». |
| Série | Marco, Período | As entradas do mesmo nível com o mesmo nome de série ficam numa linha. O campo expande as séries deste nível com o número das suas entradas; um novo nome digitado é aceite através de «Criar como nova série com “...”», **Sem série** remove a entrada. |
| Provisório | todos | A data ainda não está definida; a entrada aparece como um contorno ou com uma borda tracejada. |
| Depende de | Marco, Período | Os antecessores da entrada; apresentados na página como uma linha tracejada com uma seta. |
| Ligação | todas | **Nenhuma**, **Página** ou **Artigo de notícias**. Uma alteração anula uma ligação existente. Na página, o título da entrada fica então sublinhado e, ao clicar, o conteúdo abre-se numa janela sobre o plano. |
| Página | todas | A página do Staffbase da lista de páginas (as 100 últimas editadas). **Nova página…** cria-a no Editor do Staffbase, que se sobrepõe ao Editor do plano; após a criação, fica ligada. |
| Canal, Publicação | todas | Primeiro o canal de notícias (com o seu tipo: artigo, notícia curta, publicação com imagem), depois a publicação. Os rascunhos podem ser selecionados e estão identificados com «(Rascunho)» — os leitores só os verão após a publicação. **Nova publicação…** cria uma no canal selecionado; após o armazenamento, fica associada. **Abrir num novo separador** mostra o conteúdo associado. |
| Anexos | todos | Até dez ficheiros ou imagens da biblioteca multimédia, cada um com uma legenda opcional (caso contrário, o nome do ficheiro). **Adicionar ficheiro ou imagem…** abre a biblioteca; **↑**/**↓** ordena, **×** elimina. Os anexos permanecem após o início de sessão. Na página, aparecem ao lado do conteúdo associado ou nos detalhes; na exportação para Excel, na coluna «Anexos». |
| Duplicar | todos | Cria uma cópia da entrada. |
| Eliminar | todos | Solicita confirmação e, em seguida, elimina a entrada e todas as dependências que apontam para ela; a mensagem de confirmação indica as entradas dependentes. |

### Separador «Níveis»

| Elemento de controlo | Descrição |
| --- | --- |
| Novo nível | No canto superior direito do separador. Cria um novo nível. |
| Nome | O nome do nível, à esquerda da sua linha. Deve ser único. Ao lado, indica-se quantas entradas contém. |
| Setas para cima / para baixo | Ordem na página e na exportação para o Excel. |
| Apagar | Elimina a camada. Se esta contiver entradas, o editor pergunta se estas devem ser movidas para outra camada (seleção **Camada de destino**) ou se devem ser eliminadas juntamente com a camada. |

### Separador «Categorias»

| Elemento de controlo | Descrição |
| --- | --- |
| Nova categoria | No canto superior direito do separador. Cria uma nova categoria. |
| Campo de cor | À frente do nome; mostra a cor. Um clique expande as doze cores e o campo **Valor hexadecimal**; a tecla Esc ou um clique ao lado fecha-o. |
| Valor hexadecimal | Uma cor personalizada no formato `#RRGGBB`, por exemplo, `#E40045`. |
| Botão de forma | Ao lado do campo de cor; mostra a forma com que os marcos da categoria aparecem. Um clique expande as oito formas: losango, triângulo, triângulo com a ponta para baixo, quadrado, círculo, hexágono, estrela ou cruz. As setas do teclado alteram a forma. |
| Nome | O nome na legenda e nos detalhes. Deve ser único. Ao lado, indica a quantidade de entradas atribuídas à categoria. |
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
  secção visível. Num plano que se situe inteiramente no passado ou
  no futuro, a linha só será visível após o deslocamento.
- O **título** determina também o nome do ficheiro Excel; sem
  a exportação ativada, funciona apenas como título.
- O **título** e a **visualização inicial** são definidos no editor de planos, não na
  caixa de diálogo; ambos fazem parte do plano.
